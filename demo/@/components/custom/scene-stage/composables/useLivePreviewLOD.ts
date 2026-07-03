import {
    computed,
    onScopeDispose,
    ref,
    shallowRef,
    type ComputedRef,
    type Ref,
} from "vue";
import { RAFPlayback } from "@mkbabb/keyframes.js";
import type { SceneLodTier } from "../sceneStageRegistry";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * useLivePreviewLOD — ONE shared throttled clock + the concurrent-full-loop cap
 * (Tranche N · round-2 D9.4).
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * The carousel mounts up to 7 LIVE previews at once. Running every one at full
 * fps is the perf cliff. This composable is the single LOD authority:
 *
 *  • ONE shared clock — a single `RAFPlayback.loop` the ENGINE owns (NOT a raw
 *    `requestAnimationFrame`; inv ζ). It publishes a monotonically rising frame
 *    `epoch` + a `nowMs` each frame; the previews read this instead of each
 *    spawning their own loop.
 *
 *  • PER-CARD registration → a reactive `shouldRun` + an effective `fps` gate:
 *      - FRONT card  → full fps (the clock's native cadence)
 *      - FLANK cards → ~15–20 fps (a frame-skip gate)
 *      - REAR/off band → PAUSED (`visible: false`). D9.4: the LIT-BAND `v-if`
 *        (CarouselDisk) is the pause authority — a rear card is UNMOUNTED, so
 *        there is no content-visibility / IntersectionObserver mirror to keep.
 *    A preview reads `shouldRun` + `tick` (a per-card frame token that only
 *    advances when this card is due) to gate its own target animation cadence.
 *
 *  • A CONCURRENT-FULL-LOOP CAP — at most `maxConcurrentFull` cards may hold the
 *    "full" cadence at once; excess full-eligible cards are demoted to the flank
 *    cadence. The single WebGL preview (amiga) counts double against the cap (one
 *    WebGL preview is the perf ceiling).
 *
 * LIGHT barrel only (`RAFPlayback`) — value.js-free (proof:boundary).
 */

/** The cadence band a card resolves to. */
export type LodCadence = "full" | "flank" | "paused";

/** Per-card registration handle returned to a `ScenePreviewHost`. */
export interface LodRegistration {
    /** True while this card's loop should run at all (false when rear/hidden). */
    readonly shouldRun: ComputedRef<boolean>;
    /** The resolved cadence band for this card. */
    readonly cadence: ComputedRef<LodCadence>;
    /** Effective fps the card should drive its target at (0 when paused). */
    readonly fps: ComputedRef<number>;
    /**
     * A per-card frame token: increments ONLY on the frames this card is due
     * (full = every shared frame; flank = every Nth). A preview watches this to
     * advance its own engine animation exactly when the LOD says it may.
     */
    readonly tick: Ref<number>;
    /**
     * Report this card's live geometry so the LOD can resolve its cadence:
     * `front` (the centred card) + `visible` (in the viewport / not rear). The
     * host updates these from the orbit deriver + the visibility observer.
     */
    update(state: { front: boolean; visible: boolean; tier: SceneLodTier }): void;
    /** Unregister this card (host unmount). */
    release(): void;
}

export interface LivePreviewLODOptions {
    /** The full-cadence fps (the shared clock's native cap). Default 60. */
    fullFps?: number;
    /** The flank-cadence fps (the reduced band). Default 18. */
    flankFps?: number;
    /** Max cards allowed at the full cadence at once. Default 2. */
    maxConcurrentFull?: number;
}

export interface LivePreviewLOD {
    /** The shared frame epoch (rises once per shared-clock frame). */
    readonly epoch: ComputedRef<number>;
    /** Register a card; returns its reactive LOD gate. */
    register(): LodRegistration;
    /** Whether the shared clock is currently running (any card needs it). */
    readonly running: ComputedRef<boolean>;
}

interface CardState {
    id: number;
    front: boolean;
    visible: boolean;
    tier: SceneLodTier;
    cadence: Ref<LodCadence>;
    tick: Ref<number>;
    /** ms since this card last advanced — drives the frame-skip gate. */
    lastAdvanceMs: number;
}

export function useLivePreviewLOD(
    options: LivePreviewLODOptions = {},
): LivePreviewLOD {
    const fullFps = options.fullFps ?? 60;
    const flankFps = options.flankFps ?? 18;
    const maxConcurrentFull = options.maxConcurrentFull ?? 2;

    const fullIntervalMs = 1000 / fullFps;
    const flankIntervalMs = 1000 / flankFps;

    const epoch = ref(0);
    // A shallow registry of card states (mutated in place; the cadence/tick refs
    // inside are the reactive surface the cards bind to).
    const cards = shallowRef<CardState[]>([]);
    let nextId = 0;

    // ── The ONE shared clock: a single engine-owned RAFPlayback.loop ──────────
    // The loop publishes `epoch` + drives each due card's `tick`. It runs only
    // while at least one card needs it (no resident loop on an empty/all-paused
    // stage); `ensureRunning` (re)arms it, the loop self-stops when idle.
    const clock = new RAFPlayback();
    const running = ref(false);

    function frame(now: number): boolean {
        epoch.value++;
        let anyActive = false;
        for (const c of cards.value) {
            if (c.cadence.value === "paused") continue;
            anyActive = true;
            const interval =
                c.cadence.value === "full" ? fullIntervalMs : flankIntervalMs;
            if (now - c.lastAdvanceMs >= interval) {
                c.lastAdvanceMs = now;
                c.tick.value++;
            }
        }
        if (!anyActive) {
            running.value = false;
            return false; // self-stop the shared loop when nothing is active
        }
        return true;
    }

    function ensureRunning(): void {
        if (running.value) return;
        // Some card just became active — (re)arm the shared engine loop.
        const anyActive = cards.value.some((c) => c.cadence.value !== "paused");
        if (!anyActive) return;
        running.value = true;
        clock.loop(frame);
    }

    /**
     * Resolve every card's cadence from its (front, visible, tier) state under
     * the concurrent-full cap. Called whenever a card updates. Pure ordering:
     *  1. rear/hidden → paused
     *  2. front + visible → full (highest priority for the cap)
     *  3. visible flank → full until the cap is spent, then flank
     * The WebGL tier costs 2 against the cap (one WebGL preview is the ceiling);
     * a rear WebGL card is the only one allowed a static last-frame poster (the
     * host reads `cadence === "paused" && tier === "webgl"` to swap the poster).
     */
    function resolveCadences(): void {
        // Front-first ordering so the centred card always wins a full slot.
        const ordered = [...cards.value].sort(
            (a, b) => Number(b.front) - Number(a.front),
        );
        let fullBudget = maxConcurrentFull;
        for (const c of ordered) {
            if (!c.visible) {
                c.cadence.value = "paused";
                continue;
            }
            const cost = c.tier === "webgl" ? 2 : 1;
            if (fullBudget >= cost) {
                fullBudget -= cost;
                c.cadence.value = "full";
            } else {
                c.cadence.value = "flank";
            }
        }
        ensureRunning();
    }

    function register(): LodRegistration {
        const state: CardState = {
            id: nextId++,
            front: false,
            visible: false,
            tier: "css",
            cadence: ref<LodCadence>("paused"),
            tick: ref(0),
            lastAdvanceMs: 0,
        };
        cards.value = [...cards.value, state];

        const fpsFor = (cad: LodCadence): number =>
            cad === "full" ? fullFps : cad === "flank" ? flankFps : 0;

        return {
            shouldRun: computed(() => state.cadence.value !== "paused"),
            cadence: computed(() => state.cadence.value),
            fps: computed(() => fpsFor(state.cadence.value)),
            tick: state.tick,
            update({ front, visible, tier }) {
                state.front = front;
                state.visible = visible;
                state.tier = tier;
                resolveCadences();
            },
            release() {
                cards.value = cards.value.filter((c) => c.id !== state.id);
                resolveCadences();
            },
        };
    }

    onScopeDispose(() => {
        clock.stop();
        cards.value = [];
    });

    return {
        epoch: computed(() => epoch.value),
        register,
        running: computed(() => running.value),
    };
}
