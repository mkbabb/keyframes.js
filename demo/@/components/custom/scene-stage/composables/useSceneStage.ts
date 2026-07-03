import {
    computed,
    ref,
    watch,
    type ComputedRef,
    type Ref,
    type WatchStopHandle,
} from "vue";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * useSceneStage — the phase machine + the COMMIT SETTLE-FUNNEL (Tranche S).
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * ROUND 2 (stage-design-v2 · D1 + D2). The round-1 funnel FIRED but could fire
 * the WRONG scene (tech H1/H1b): `committing` accepted browse verbs and the arm
 * latched a moving quantity, so a flick-during-committing (or Enter-during-flick)
 * desynced front from armed and the 2000ms belt committed a stale scene while the
 * ring rested on a different one. The v2 cures are STRUCTURAL:
 *
 *   • D1 — THE LOCK. Committing is "walking into the stage": browse verbs
 *     (step/centerIndex) are LOCKED during `committing` (silent no-op). This makes
 *     `armed === orbit.target === rested front` an INVARIANT and turns the
 *     failsafe into a true belt, not the primary commit path for the divergent
 *     case. It also gives the D5 payoff beat a stable frame.
 *   • D1.1 — THE MOVING-TARGET ARM. A coasting ring (Enter/Space mid-flick) arms
 *     the spring's DESTINATION slot (`sceneAt(orbit.targetIndex)`), never the slot
 *     the ring happens to be passing through. The call site resolves this.
 *   • D1.3 — a 2000ms re-armable failsafe (reset on every (re-)arm + spin-to-front
 *     init) and a 280ms MINIMUM DWELL before fire() even when the armed card is
 *     already front-and-settled (the payoff breath). Under PRM dwell = 0 (snap).
 *     The dwell makes `data-stage-phase="committing"` HONESTLY PAINT (cures H6).
 *   • D2 — VT-FRAME EXIT. fire() pre-warms the target scene, then routes the
 *     commit through the caller's `runSceneSwitch`, whose VT `update` callback
 *     invokes `onUpdate` to drop the stage to `closed` INSIDE the captured frame
 *     — the un-named overlay is torn down in the same synchronous mutation, so it
 *     is never double-captured. The commit path NEVER enters `zooming-in`; that
 *     phase is the cancel-close path ONLY (Esc/×/pill re-click, no VT).
 *   • D1.2 — the full event×state matrix: `fanning-in × requestCommit` BUFFERS
 *     (pendingCommit, last-write-wins, drained on carousel), cleared on cancel.
 *
 * Observables (D1.4): `window.__stageLastCommit = { id, t }` PLUS
 * `window.__stageArmedLog` — an append-only `{ id, t, cause }[]` written at each
 * arm and at fire (the gate's primary interleaving witness).
 *
 * No engine import — pure orchestration state (proof:boundary trivially holds).
 */

export type StagePhase =
    | "closed"
    | "zooming-out"
    | "fanning-in"
    | "carousel"
    | "committing"
    | "zooming-in";

export type ArmCause = "tap" | "key" | "buffered" | "failsafe";

/** The gate observable shape written on fire (design §10 step 3). */
export interface StageLastCommit {
    id: string;
    t: number;
}
export interface StageArmLogEntry {
    id: string;
    t: number;
    cause: ArmCause;
}

declare global {
    interface Window {
        __stageLastCommit?: StageLastCommit;
        __stageArmedLog?: StageArmLogEntry[];
    }
}

export interface SceneStageDeps {
    /** The ordered ring of scene ids (the carousel index domain). */
    sceneIds: readonly string[];
    /**
     * The App's scene-switch entry — the ONE commit edge. The stage routes its
     * commit through this so the live swap + View-Transition path is unchanged.
     * `onUpdate` is invoked INSIDE the VT update callback (D2) so the overlay
     * tears down in the captured frame.
     */
    runSceneSwitch: (
        sceneId: string,
        opts?: { stage?: boolean; onUpdate?: () => void },
    ) => void;
    /** The live front index the orbit publishes (useCarouselOrbit.frontIndex). */
    frontIndex: Ref<number> | ComputedRef<number>;
    /** The DESTINATION slot the spring is chasing (D1.1 arm target). */
    targetIndex: Ref<number> | ComputedRef<number>;
    /** True while the orbit spring is chasing its target. */
    spinning: Ref<boolean> | ComputedRef<boolean>;
    /** Spin a card to front via the shortest signed delta (interruptible). */
    setTargetIndex: (index: number) => void;
    /** Whether reduced-motion is active (dwell → 0, snap). */
    reducedMotion: () => boolean;
    /**
     * Pre-warm the target scene chunk before the VT (D2.2). Resolves ~instantly
     * once warmed; the 280ms dwell absorbs the latency. Optional (proto stub).
     */
    warmScene?: (id: string) => Promise<void>;
}

export interface SceneStage {
    readonly phase: ComputedRef<StagePhase>;
    readonly isOpen: ComputedRef<boolean>;
    /** The armed id the gate reads while `committing` (null otherwise). */
    readonly armedId: ComputedRef<string | null>;
    /** The id of the scene the stage was opened FROM (the live scene). */
    readonly fromSceneId: ComputedRef<string | null>;
    readonly centeredIndex: ComputedRef<number>;
    readonly centeredSceneId: ComputedRef<string>;

    /** Open the stage FROM a scene; begins zoom-out → fan-in. */
    open(fromSceneId: string): void;
    /** Cancel-close (Esc/×/pill re-click) — NEVER commits. */
    close(): void;
    /** THE commit funnel — arms, spins-to-front, then fires on settle+dwell/failsafe. */
    requestCommit(id: string, cause?: ArmCause): void;
    /** The scene id at a ring slot (for the D1.1 destination-slot arm). */
    sceneAt(index: number): string;

    /** Browse verbs (never commit) — LOCKED during committing (D1). */
    step(dir: number): void;
    centerIndex(index: number): void;

    /** Advancers the view calls as each beat settles (idempotent per phase). */
    onZoomOutDone(): void;
    onFanInDone(): void;
    onZoomInDone(): void;

    /** Overlay keydown router (design §9 Keys row). */
    onKeydown(e: KeyboardEvent): void;

    /** Teardown (host unmount). */
    dispose(): void;
}

/** D1.3: generous, re-armable belt — a 3–4-slot decay re-seat can take ≳1s. */
const FAILSAFE_MS = 2000;
/** D1.3/D5: the payoff breath — the flare must paint before fire(). */
const DWELL_MS = 280;

export function useSceneStage(deps: SceneStageDeps): SceneStage {
    const { sceneIds } = deps;
    const n = Math.max(1, sceneIds.length);

    const phase = ref<StagePhase>("closed");
    const fromSceneId = ref<string | null>(null);
    const armedId = ref<string | null>(null);

    const centeredIndex = computed(() => deps.frontIndex.value);
    const centeredSceneId = computed(
        () => sceneIds[centeredIndex.value] ?? sceneIds[0] ?? "",
    );

    function indexOfScene(id: string): number {
        const i = sceneIds.indexOf(id);
        return i < 0 ? 0 : i;
    }
    function clampIndex(i: number): number {
        return ((i % n) + n) % n;
    }
    function sceneAt(index: number): string {
        return sceneIds[clampIndex(index)] ?? sceneIds[0] ?? "";
    }

    function pushArmLog(id: string, cause: ArmCause): void {
        if (typeof window === "undefined") return;
        (window.__stageArmedLog ??= []).push({
            id,
            t: performance.now(),
            cause,
        });
    }

    // ── open / fan choreography ──────────────────────────────────────────────
    function open(scene: string): void {
        if (phase.value !== "closed") return;
        fromSceneId.value = scene;
        pendingCommit = null;
        deps.setTargetIndex(indexOfScene(scene));
        phase.value = "zooming-out";
    }
    function onZoomOutDone(): void {
        if (phase.value !== "zooming-out") return;
        phase.value = "fanning-in";
    }
    function onFanInDone(): void {
        if (phase.value !== "fanning-in") return;
        phase.value = "carousel";
        // D1.2: drain a buffered fan-in commit → committing immediately.
        if (pendingCommit) {
            const p = pendingCommit;
            pendingCommit = null;
            requestCommit(p.id, "buffered");
        }
    }

    // ── browse verbs — LOCKED during committing (D1) ─────────────────────────
    function step(dir: number): void {
        if (phase.value !== "carousel") {
            if (phase.value === "committing") devLockedBrowse("step");
            return;
        }
        deps.setTargetIndex(clampIndex(centeredIndex.value + Math.sign(dir)));
    }
    function centerIndex(index: number): void {
        if (phase.value !== "carousel") {
            if (phase.value === "committing") devLockedBrowse("centerIndex");
            return;
        }
        deps.setTargetIndex(clampIndex(index));
    }
    function devLockedBrowse(verb: string): void {
        // D1.2: browse is a silent no-op during committing; dev-logged only.
        if (import.meta.env?.DEV) {
            // eslint-disable-next-line no-console
            console.debug(`[scene-stage] browse "${verb}" locked (committing)`);
        }
    }

    // ── THE COMMIT FUNNEL (design §10 · D1/D2) ───────────────────────────────
    let failsafe: ReturnType<typeof setTimeout> | null = null;
    let dwellTimer: ReturnType<typeof setTimeout> | null = null;
    let settleStop: WatchStopHandle | null = null;
    let dwellDone = false;
    let fireCause: ArmCause = "tap";
    /** D1.2: single-latch buffered commit while zooming-out / fanning-in. */
    let pendingCommit: { id: string; cause: ArmCause } | null = null;

    function clearCommitTimers(): void {
        if (failsafe) {
            clearTimeout(failsafe);
            failsafe = null;
        }
        if (dwellTimer) {
            clearTimeout(dwellTimer);
            dwellTimer = null;
        }
        if (settleStop) {
            settleStop();
            settleStop = null;
        }
    }

    function requestCommit(id: string, cause: ArmCause = "tap"): void {
        // D1.2: buffer during the opening beats (last-write-wins).
        if (phase.value === "zooming-out" || phase.value === "fanning-in") {
            pendingCommit = { id, cause: "buffered" };
            return;
        }
        if (phase.value === "committing") {
            // same id → no-op; different id is IMPOSSIBLE under the browse lock
            // (front cannot change), so the call is ignored + dev-logged.
            if (id !== armedId.value) devLockedBrowse("requestCommit");
            return;
        }
        if (phase.value !== "carousel") return;

        armedId.value = id;
        phase.value = "committing";
        fireCause = cause;
        pushArmLog(id, cause);

        // spin-to-front if not already there (or if still coasting).
        if (deps.frontIndex.value !== indexOfScene(id) || deps.spinning.value) {
            deps.setTargetIndex(indexOfScene(id));
        }

        // D1.3: the re-armable belt (reset on every (re-)arm + spin init).
        if (failsafe) clearTimeout(failsafe);
        failsafe = setTimeout(() => {
            fireCause = "failsafe";
            // Loud invariant-breach telemetry (never a user-facing branch): the
            // lock should make front === armed at failsafe-fire time.
            if (
                typeof window !== "undefined" &&
                centeredSceneId.value !== armedId.value
            ) {
                // eslint-disable-next-line no-console
                console.warn(
                    "[scene-stage] FAILSAFE fired with front !== armed",
                    { front: centeredSceneId.value, armed: armedId.value },
                );
            }
            fire();
        }, FAILSAFE_MS);

        // D1.3: the minimum-dwell payoff breath (0 under PRM → snap).
        dwellDone = deps.reducedMotion();
        if (!dwellDone) {
            if (dwellTimer) clearTimeout(dwellTimer);
            dwellTimer = setTimeout(() => {
                dwellDone = true;
                maybeFire();
            }, DWELL_MS);
        }

        // the settle watcher — the ring lands on the armed card.
        if (settleStop) settleStop();
        settleStop = watch(
            () => [deps.spinning.value, centeredSceneId.value] as const,
            () => maybeFire(),
            { flush: "post" },
        );

        // already on target + settled? (dwell still gates the fire.)
        maybeFire();
    }

    /** Fire only when the ring is settled ON the armed card AND the dwell elapsed. */
    function maybeFire(): void {
        if (phase.value !== "committing") return;
        const settledOnArmed =
            !deps.spinning.value &&
            centeredSceneId.value === armedId.value &&
            armedId.value != null;
        if (settledOnArmed && dwellDone) void fire();
    }

    let firing = false;
    async function fire(): Promise<void> {
        if (phase.value !== "committing" || firing) return; // idempotent
        const id = armedId.value;
        if (!id) return;
        firing = true;
        clearCommitTimers();
        pushArmLog(id, fireCause);

        // D2.2: pre-warm the target scene BEFORE the VT so the update callback
        // never returns while the scene is a suspended fallback.
        try {
            await deps.warmScene?.(id);
        } catch {
            /* warm failure is non-fatal — the VT degrades to the fallback. */
        }
        // an Esc during the warm aborts the commit.
        if (phase.value !== "committing") {
            firing = false;
            return;
        }

        // THE one commit edge. The overlay leaves INSIDE the captured VT frame
        // via onUpdate (D2.1): switchScene + phase→closed in ONE mutation batch.
        deps.runSceneSwitch(id, {
            stage: true,
            onUpdate: () => commitClose(id),
        });
        firing = false;
    }

    /** Runs INSIDE the VT update callback (D2.1) — the overlay unmounts here. */
    function commitClose(id: string): void {
        phase.value = "closed";
        fromSceneId.value = null;
        armedId.value = null;
        pendingCommit = null;
        // the gate observable — proves the funnel fired end to end.
        if (typeof window !== "undefined") {
            window.__stageLastCommit = { id, t: performance.now() };
        }
    }

    // ── cancel-close (structurally distinct from commit) ─────────────────────
    function close(): void {
        if (phase.value === "closed" || phase.value === "zooming-in") return;
        clearCommitTimers();
        dwellDone = false;
        pendingCommit = null;
        armedId.value = null;
        phase.value = "zooming-in";
        // NO runSceneSwitch, NO observable write — the origin scene never left.
    }

    function onZoomInDone(): void {
        if (phase.value !== "zooming-in") return;
        phase.value = "closed";
        fromSceneId.value = null;
        armedId.value = null;
    }

    // ── keyboard (design §9 Keys row) ────────────────────────────────────────
    let typeahead = "";
    let typeaheadTimer: ReturnType<typeof setTimeout> | null = null;
    function onKeydown(e: KeyboardEvent): void {
        if (phase.value === "closed") return;
        switch (e.key) {
            case "ArrowRight":
                e.preventDefault();
                step(1);
                return;
            case "ArrowLeft":
                e.preventDefault();
                step(-1);
                return;
            case "Home":
                e.preventDefault();
                centerIndex(0);
                return;
            case "End":
                e.preventDefault();
                centerIndex(n - 1);
                return;
            case "Enter":
            case " ": {
                e.preventDefault();
                // D1.1: a coasting ring arms the DESTINATION slot, never the
                // passing front; a settled ring arms the centered scene.
                const id = deps.spinning.value
                    ? sceneAt(deps.targetIndex.value)
                    : centeredSceneId.value;
                requestCommit(id, "key");
                return;
            }
            case "Escape":
                e.preventDefault();
                close();
                return;
        }
        // type-ahead: printable char → match a scene id/label prefix
        if (e.key.length === 1 && /\S/.test(e.key)) {
            typeahead += e.key.toLowerCase();
            if (typeaheadTimer) clearTimeout(typeaheadTimer);
            typeaheadTimer = setTimeout(() => (typeahead = ""), 600);
            const hit = sceneIds.findIndex((id) =>
                id.toLowerCase().startsWith(typeahead),
            );
            if (hit >= 0) centerIndex(hit);
        }
    }

    function dispose(): void {
        clearCommitTimers();
        if (typeaheadTimer) clearTimeout(typeaheadTimer);
    }

    return {
        phase: computed(() => phase.value),
        isOpen: computed(() => phase.value !== "closed"),
        armedId: computed(() => armedId.value),
        fromSceneId: computed(() => fromSceneId.value),
        centeredIndex,
        centeredSceneId,
        open,
        close,
        requestCommit,
        sceneAt,
        step,
        centerIndex,
        onZoomOutDone,
        onFanInDone,
        onZoomInDone,
        onKeydown,
        dispose,
    };
}
