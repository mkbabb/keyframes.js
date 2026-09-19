import { computed, markRaw, onScopeDispose, ref } from "vue";

import { kfEngine } from "@kf-engine";
import type { CSSKeyframesAnimation as CSSKeyframesAnimationT } from "@mkbabb/keyframes.js";
import { Sequence } from "@mkbabb/keyframes.js";
import { stagger } from "@mkbabb/keyframes.js";
import { springTimingFunction } from "@mkbabb/keyframes.js";
import { clamp } from "@mkbabb/value.js/math";

import { useSweepScene } from "@composables/scene-runtime/useSweepScene";
import { useSceneTransport } from "@composables/scene-runtime/useSceneTransport";
import type { SceneFacility } from "@composables/scene-facility";
import { useSequenceInstrument } from "./useSequenceInstrument";
import {
    useSceneMachine,
    createRafAdapter,
    type ScenePlayback,
} from "@state";

/**
 * useSequenceDemo — the dogfood of the engine's TEMPORAL orchestrator
 * (`Sequence`) + the `stagger` delay distribution (F.W10.S3).
 *
 * The cube proves `AnimationGroup` (the SPATIAL compositor — many animations on
 * one target, blended per-frame). NOTHING proved `Sequence` — the temporal
 * orchestrator that positions many animations along ONE master clock, each
 * painting its own target. This scene is that proof:
 *
 *   • N child `CSSKeyframesAnimation`s, one per storyboard row, each gliding its
 *     own ball across its rail (a `--ball-p` 0→1 sweep + a settle pop), eased by
 *     a keyframes.js spring twin (`springTimingFunction`). The ENGINE paints the
 *     balls directly (the default DOM renderer sets `--ball-p` on each target);
 *     there is no per-frame Vue work for the motion.
 *   • their start positions are the `stagger` distribution — `stagger(N, {...})`
 *     yields the per-index delay, fed straight into the `Sequence` `at:`
 *     position-insertion (the GSAP timeline idiom);
 *   • the whole storyboard is driven by the `Sequence`'s OWN play loop
 *     (`RAFPlayback` — inv ζ: NO hand-rolled rAF). The transport SURFACE this
 *     scene exposes is exactly what has an affordance (kf-SequenceScene SC-2):
 *     play / pause through the machine (the transport dock), the master
 *     progress-scrub, the row re-time, and `reset` — the re-time's undo, a
 *     visible header verb. The engine's `reverse` / `timeScale` are real
 *     transport calls the scene does not surface, so no wrapper of them lives
 *     here (a verb without an affordance is dead code, not a contract).
 *
 * THE CANONICAL TIME DOMAIN (X.KF.W11.d — kf-SequencePlayhead N-1/N-2, M-10's
 * frame): the scene has ONE clock, the master clock in milliseconds, and its
 * span is `duration = max(at + ROW_DURATION)` over the rows — the engine's own
 * `Sequence.duration`. Every painted or announced position derives from it:
 * the handles and the travellers' gates sit at `at / duration`, the playhead at
 * `time / duration`, the ruler names `q · duration` with its terminal label the
 * duration itself, and the sliders announce milliseconds. `STAGGER_MAX` is the
 * row slider's CONTROL RANGE (the editable `at:` domain) — never a painted
 * domain. The engine's `_duration` is written only by `add()` and is monotone,
 * so a re-time never mutates `entries` in place: it REBUILDS the `Sequence`
 * through `add()` (the only `_duration` writer) and re-seeks the retained
 * master time — the denominator is honest by construction (N-2 lands against
 * N-1). The engine-side rider (recompute on entry mutation, or close `entries`
 * mutability) is declared to the library waves by id, never written here.
 *
 * inv ζ (orchestration analogue): the scene runs on the engine's own `Sequence`
 * + `stagger`; there is no demo-local clock or decay re-derivation. The one
 * reactivity mirror (the master progress read-out) rides the engine's OWN
 * `RAFPlayback.loop` driver — the same light driver `proof:dogfood` blesses —
 * not a parallel hand-rolled raw scheduler.
 *
 * H.W1 (raw-rAF ScenePlayback contract): the Sequence is ALREADY-SOTA as a
 * transport — only its MACHINE-INTEGRATION SEAM changes here. The former private
 * `isPlaying = ref(false)` (a shadow playback authority nothing could suspend —
 * the D12 smell) is DELETED: the play-intent is now a read-only projection of
 * `machine.status === 'playing'`, play/pause/reset DISPATCH to the machine (the
 * single authority), and the mirror loop + the Sequence's own play loop GATE on
 * the machine. The scene exposes a raw-rAF `ScenePlayback` adapter round-tripping
 * `progress`/`isPlaying` so suspend/restore route through the CONTRACT (no
 * AnimationGroup position — the dummy transport host has none).
 */

/** How many staggered storyboard rows the sequence orchestrates. */
export const ROW_COUNT = 5;

/** Per-row child glide duration (ms). */
export const ROW_DURATION = 900;

/** The stagger increment between adjacent rows (ms) — the `at:` spacing. */
const STAGGER_EACH = 260;

/**
 * The editable `at:` domain (ms) — the row slider's CONTROL RANGE. A row's
 * start-handle re-authors its child's master-clock offset across
 * `[0, STAGGER_MAX]`: wide enough that the rows can be re-authored from
 * fully-overlapped (all at 0) to spread well past the default 1040ms tail,
 * bounded so the storyboard stays legible. It is NOT the painted domain — the
 * rail maps `at / duration → [0,1]` (the canonical clock above).
 */
export const STAGGER_MAX = 1600;

/** One storyboard row: index + its resolved start offset on the master clock. */
// Internal-only (T.F23a un-export): the computed rows shape, consumed solely
// within this composable; no external importer.
interface SequenceRow {
    /** 0-based row index (top → bottom). */
    index: number;
    /** This row's resolved start offset on the master clock (ms). */
    at: number;
}

/** The per-row child keyframe vars the engine paints onto each traveller. */
type BallVars = {
    "--ball-p": number;
    opacity: number;
    scale: number;
};

export function useSequenceDemo() {
    // HEAVY surface from the warmed engine (kfEngine(), L.W8 S1 dogfood inversion)
    // — synchronous, since the warm resolves before any scene mounts. The TYPES
    // (`*T` aliases) flow from the barrel; only the runtime constructors come from
    // the resolved surface here.
    const { CSSKeyframesAnimation } = kfEngine();

    // ── The stagger distribution → the Sequence `at:` positions ──────────────
    // `stagger` is a pure construction-time per-index delay generator: from the
    // "first" origin it is a monotone ramp 0, each, 2·each, … — a clean staircase
    // (0, 260, 520, 780, 1040ms) so each row enters in turn. The returned delays
    // ARE the master-clock offsets the Sequence inserts each child at — the
    // position-insertion the GSAP timeline leads with. (The spring easing rides
    // each child's GLIDE, not the stagger spacing — a spring twin reshape here
    // would saturate the distribution and fire the later rows simultaneously.)
    const staggerFn = stagger(ROW_COUNT, {
        each: STAGGER_EACH,
        from: "first",
    });
    // The default stagger staircase (0, 260, 520, 780, 1040ms) — captured so the
    // transport Reset can restore the pristine distribution after the rows have
    // been re-authored (H.W12.S6 / I3).
    const DEFAULT_DELAYS = staggerFn.delays(ROW_COUNT);
    // Reactive so the storyboard rows + labels recompute when a row is dragged to
    // re-author its `at:` (H.W12.S6 / I3 — the draggable rows).
    const delays = ref<number[]>([...DEFAULT_DELAYS]);

    // ── The child animations (one glide per row) ─────────────────────────────
    // Each row is a CSSKeyframesAnimation sweeping a CSS custom property
    // `--ball-p` 0 → 1 (the ball's normalized rail position) plus an opacity
    // fade-in and a settle scale-pop. The default DOM renderer paints them; the
    // target's CSS reads `--ball-p` to position the ball (allocation-free, one
    // custom-property value per frame — the .progress-ball idiom's own posture).
    // The per-row glide easing — a spring twin, named so the reel egg can RESTORE
    // it after its overshoot run (the children are shared between the master
    // transport and the egg).
    const rowGlideEase = springTimingFunction({
        response: 0.45,
        dampingFraction: 0.62,
    });
    const childAnims: CSSKeyframesAnimationT<BallVars>[] = [];
    for (let i = 0; i < ROW_COUNT; i++) {
        const anim = new CSSKeyframesAnimation<BallVars>({
            duration: ROW_DURATION,
            fillMode: "forwards",
            timingFunction: rowGlideEase,
        });
        anim.fromKeyframes({
            "0%": { "--ball-p": 0, opacity: 0.25, scale: 0.7 },
            "70%": { "--ball-p": 0.7, opacity: 1, scale: 1.12 },
            "100%": { "--ball-p": 1, opacity: 1, scale: 1 },
        });
        anim.name = `Row ${i + 1}`;
        childAnims.push(markRaw(anim));
    }

    // ── The Sequence — the master-playhead orchestrator ──────────────────────
    // Each child is inserted at its stagger delay (the absolute `at:` ms offset).
    // `Sequence` re-sorts by `at`, maps the master clock to every child's local
    // clock, and drives them through `Animation.advanceTo` over its OWN
    // `RAFPlayback` loop. The Sequence is REBUILT on every re-time (see the
    // canonical-domain note in the module docblock): `add()` is the engine's only
    // `_duration` writer, so building through it is what keeps the denominator
    // honest — the entries are never mutated in place.
    const buildSequence = (at: readonly number[]) => {
        const seq = markRaw(new Sequence<BallVars>());
        for (let i = 0; i < ROW_COUNT; i++) {
            seq.add(childAnims[i]!, at[i]!);
        }
        return seq;
    };
    let sequence = buildSequence(delays.value);

    /** The canonical clock's span (ms) — mirrors `sequence.duration`, re-read
     *  after every rebuild so the ruler's terminal label and every `at /
     *  duration` position recompute together. */
    const duration = ref(sequence.duration);

    // ── Playback intent: DERIVED from the machine, NOT a private shadow ───────
    // The former private `isPlaying = ref(false)` was the SHADOW playback
    // authority (the D12 smell). `useSceneTransport` (R.W5 B.2) projects
    // `isPlaying` read-only off `machine.status` and routes play/pause/togglePlay
    // (+ the `resume = () => play()` alias) to dispatch — the single authority.
    const machine = useSceneMachine();
    const { isPlaying, pause } = useSceneTransport(machine);

    // T.B1 STAGE 1 — the decoy opacity-only contract-group host is DELETED.
    // The Sequence IS the transport (its own `RAFPlayback` loop drives the balls);
    // the scene exposes a `SceneFacility` whose ONE channel is the master sequence
    // and whose `playback` is the raw-rAF adapter registered with the machine.
    // There is no AnimationGroup position — the bottom transport shows the single
    // "Sequence" channel label and drives play/pause through the machine (the
    // sequence's DFA row is [] so NO panel renders). `facility` is assembled below
    // once `scenePlayback` exists.

    const progress = ref(0);

    // L.W11 S7 — the ignition-cascade egg's gesture/boot flags (colocated split,
    // ≤500L); the cascade MOTION is the engine's --ball-p fan-out, not a clock (ζ).
    const { isScrubbing, scrubDir, setScrubbing, setScrubDir, isPoweringOn, powerOn } =
        useSequenceInstrument();

    /** Read the live Sequence playhead into the reactive progress mirror. */
    const syncFromSequence = () => {
        progress.value = clamp(sequence.progress, 0, 1);
    };

    // The reactivity mirror — the master progress read-out — rides the engine's
    // OWN `RAFPlayback.loop` driver (NOT a parallel raw rAF). It GATES on the
    // machine (the single authority): when the machine leaves `playing` the loop
    // self-terminates. The Sequence's own play loop drives the actual ball motion
    // in parallel; this loop only mirrors the playhead into the reactive readout.
    const {
        playback: mirror,
        startLoop: startMirror,
        stopLoop: stopMirror,
    } = useSweepScene({
        frame: () => {
            syncFromSequence();
            return machine.status.value === "playing";
        },
        onArm: () => syncFromSequence(),
        getProgress: () => progress.value,
        setProgress: (t) => {
            sequence.progress = clamp(t, 0, 1);
            syncFromSequence();
        },
        getPlaying: () => machine.status.value === "playing",
    });

    // ── The engine-loop drivers (driven by the adapter / the machine) ─────────
    // The adapter's resume/suspend route the engine loop through ONE seam
    // (startLoop/stopLoop). They are engine-transport ACTIONS, NOT intent — the
    // machine owns the intent. The Sequence transport internals (play vs resume,
    // seek) are PRESERVED: only the play/pause intent + the mirror gating route
    // through the machine (the lane mandate: touch only the machine-integration
    // seam, not the SOTA transport).

    /** True iff the playhead is mid-run (between the rail ends) — the original
     *  resume-vs-fresh-play discriminator the transport used. */
    const isMidPlay = () => sequence.time > 0 && sequence.time < sequence.duration;

    /** Drive the Sequence engine loop + mirror to RUN. A mid-play playhead
     *  RESUMEs from where it stands (no forward jump — the managed-pause
     *  contract); a settled playhead starts a FRESH play from the origin. This is
     *  the SAME play-vs-resume split the original transport made; the only change
     *  is the natural-end `finally` now reflects the stop onto the machine. */
    const startLoop = () => {
        startMirror();
        if (isMidPlay()) {
            // Continue from the current playhead (the engine no-jump re-anchor).
            sequence.resume();
        } else {
            // Settled (at the origin or the end) → a fresh play; resolves at the
            // end and parks the machine back to `paused`.
            void sequence.play().finally(() => {
                stopMirror();
                syncFromSequence();
                // The natural end is a genuine stop — reflect it on the machine
                // (the single authority) so `isPlaying` reads false.
                if (machine.status.value === "playing") {
                    machine.dispatch({ type: "PAUSE" });
                }
            });
        }
    };

    /** Stop the Sequence engine loop + mirror WITHOUT rewinding (genuine suspend
     *  — the snapshot already captured the playhead). */
    const stopLoop = () => {
        sequence.pause();
        stopMirror();
        syncFromSequence();
    };

    // ── Transport (intent → the machine; the adapter drives the loop) ─────────
    // play/pause intent is the transport dock's, dispatched to the machine
    // (`useSceneTransport`); the scene itself surfaces `scrub` (the master
    // scrub), `reseatRow` (the re-time) and `reset` (its undo). scrub reshapes
    // the engine loop without flipping the play/pause axis the machine owns, and
    // records `t` onto the machine snapshot so the scrubbed playhead round-trips
    // on suspend/restore.

    const scrub = (p: number) => {
        if (isPlaying.value) pause();
        sequence.progress = clamp(p, 0, 1);
        syncFromSequence();
        // Record the scrubbed playhead onto the machine snapshot so it survives a
        // scene switch (the raw-rAF round-trip).
        machine.dispatch({ type: "SCRUB", t: progress.value });
    };

    // ── Re-time: the ONE path that changes the canonical clock's span ─────────
    // Rebuild the engine's position model from the new `at:` net through the
    // public `add()` (the only `_duration` writer) and re-seek the retained
    // master time, so the playhead, every gate and the ruler's denominator
    // recompute together (N-1 ∥ N-2). The prior Sequence is STOPPED first: its
    // loop halts, its children settle back to standalone ownership and any held
    // play promise resolves — nothing of it outlives the rebuild.
    const retime = (next: readonly number[]) => {
        const time = sequence.time;
        sequence.stop();
        sequence = buildSequence(next);
        duration.value = sequence.duration;
        sequence.seek(clamp(time, 0, sequence.duration));
        syncFromSequence();
    };

    /** The re-time's UNDO (SC-2): restore the pristine stagger distribution and
     *  rewind — the one path back to the default storyboard after any row has
     *  been re-authored. Exposed as a visible header verb. */
    const reset = () => {
        if (isPlaying.value) pause();
        stopMirror();
        delays.value = [...DEFAULT_DELAYS];
        retime(DEFAULT_DELAYS);
        sequence.seek(0);
        syncFromSequence();
        machine.dispatch({ type: "RESET" });
    };

    // ── The storyboard rows — the reactive view of the editable `at:` net ─────
    const rows = computed<SequenceRow[]>(() =>
        Array.from({ length: ROW_COUNT }, (_, i) => ({
            index: i,
            at: delays.value[i]!,
        })),
    );

    // ── Draggable rows: re-author a child's `at:` live (H.W12.S6 / I3) ────────
    // The headline Sequence refinement — the GSAP-timeline gesture. A row's
    // start-handle drag re-emits its child's master-clock offset; we update the
    // reactive `delays` (the storyboard re-labels) AND re-author the engine's own
    // position-insertion through `retime` (a rebuilt Sequence — the engine's own
    // `add()` position model, inv ζ), which repaints the storyboard at the
    // retained playhead on the new timing. Pausing first keeps a live run from
    // fighting the re-author; the scrubbed snapshot round-trips through the
    // machine so the re-timing survives a scene switch.
    const reseatRow = (index: number, at: number) => {
        if (index < 0 || index >= ROW_COUNT) return;
        if (isPlaying.value) pause();
        const clamped = clamp(Math.round(at), 0, STAGGER_MAX);
        const next = [...delays.value];
        next[index] = clamped;
        delays.value = next;
        retime(next);
        machine.dispatch({ type: "SCRUB", t: progress.value });
    };

    // ── The view's two seam verbs (kf-SequenceTarget L-10/C-4) ───────────────
    // The target binds each traveller as its child animation's engine target
    // and paints the current playhead on mount through THESE verbs, so the view
    // never reaches into `childAnims` or writes `sequence.progress` directly —
    // the composable stays the one writer of the engine's position model.
    /** Bind row `index`'s traveller element as its child animation's target. */
    const bindRowTarget = (index: number, el: HTMLElement) => {
        childAnims[index]?.setTargets(el);
    };
    /** Paint the CURRENT playhead (not a hard t=0): a return entry may already
     *  have re-seated `progress` via the ScenePlayback restore, so seeking the
     *  live value avoids clobbering it regardless of mount/restore order (H.W1). */
    const paintCurrent = () => {
        sequence.progress = progress.value;
        syncFromSequence();
    };

    // ── EE-SEQ-1 "the reel" (H.W12.S6 / I3 egg) ──────────────────────────────
    // A hidden trigger replays the five balls as a cascading Mexican-wave
    // overshoot, IGNORING the master clock once — pure delight, dogfooding the
    // engine: each child is re-driven with an exaggerated overshoot spring on its
    // OWN RAFPlayback, fired in a tight stagger (the wave), then the storyboard
    // re-settles to the live playhead. Reuses the existing child animations (no
    // new engine code, inv ζ). Guarded so a re-trigger mid-reel is a no-op.
    const isReeling = ref(false);
    const REEL_STAGGER = 90; // ms between each ball's wake (the wave spacing)
    const reelOvershoot = springTimingFunction({
        response: 0.42,
        dampingFraction: 0.34, // under-damped → a pronounced overshoot bounce
    });
    const playReel = () => {
        if (isReeling.value) return;
        // Pause the master transport so the reel owns the balls for its run.
        if (isPlaying.value) pause();
        sequence.pause();
        isReeling.value = true;

        let settled = 0;
        for (let i = 0; i < ROW_COUNT; i++) {
            const child = childAnims[i]!;
            window.setTimeout(() => {
                // Drive this child standalone with the overshoot curve for one
                // glide, then count it settled; the last one re-settles the board.
                child.managed = false;
                child.setTimingFunction(reelOvershoot);
                void child.play().finally(() => {
                    // Restore the child's spring + managed posture for the master.
                    child.setTimingFunction(rowGlideEase);
                    child.managed = true;
                    if (++settled >= ROW_COUNT) {
                        isReeling.value = false;
                        // Re-place every ball against the live master playhead.
                        sequence.seek(sequence.progress * sequence.duration);
                        syncFromSequence();
                    }
                });
            }, i * REEL_STAGGER);
        }
    };

    // ── The raw-rAF ScenePlayback adapter (WV-W1-HIGH-3) ──────────────────────
    // Round-trips progress/isPlaying through the contract — these temporal scenes
    // have NO AnimationGroup position (the contractAnim dummy group drives no
    // motion). The App registers this on SCENE_READY; the machine's effect layer
    // calls suspend()/resume()/restore() through it (the single suspend path —
    // no orphan rAF).
    const scenePlayback: ScenePlayback = createRafAdapter({
        getProgress: () => progress.value,
        setProgress: (t) => {
            sequence.progress = clamp(t, 0, 1);
            syncFromSequence();
        },
        getPlaying: () => machine.status.value === "playing",
        // setPlaying is a no-op marker: the machine status IS the intent; the
        // loop is driven by start/stopLoop. Kept for contract symmetry.
        setPlaying: () => {},
        isLoopRunning: () => mirror.running,
        stopLoop,
        startLoop,
    });

    // ── The SceneFacility (T.B1 STAGE 1) ─────────────────────────────────────
    // ONE master channel ("Sequence") — the honest transport-select label; the
    // childAnims are storyboard ROWS surfaced on the target, not dock-selectable
    // transport channels, so the bottom dock shows a single label (no 5-way
    // select). `playback` IS the raw-rAF adapter (registered with the machine);
    // there is no `group` (progress-scalar scene). `facets` is empty — the DFA row
    // is [] so no panel renders.
    const facility: SceneFacility = {
        identity: scenePlayback,
        channels: [
            {
                name: "Sequence",
                progress: () => progress.value,
                setProgress: (t: number) => {
                    sequence.progress = clamp(t, 0, 1);
                    syncFromSequence();
                },
            },
        ],
        facets: [],
        playback: scenePlayback,
        isPlaying: () => scenePlayback.isPlaying(),
    };

    // Paint the initial (t=0) frame so the balls rest at their rail origin and
    // the readout shows 0 before the first restore (the SequenceTarget paints the
    // current playhead on mount too — this is the composable-side belt-and-braces).
    syncFromSequence();

    // Stop the mirror + sequence on scope dispose (the genuine unmount seam) —
    // the host has NO <KeepAlive>, so onDeactivated never fires; this gives the
    // mid-play swap an honest stop instead of letting the loop wind down detached.
    onScopeDispose(() => {
        stopMirror();
        sequence.stop();
    });

    // The provide contract is the CONSUMED surface (kf-SequenceScene L-12/C-8 +
    // SC-2): every member below has a reader in the target, the scrubber or the
    // scene's tests; nothing is published without one.
    return {
        rows,
        STAGGER_MAX,
        /** The canonical clock's span (ms) — the ruler's terminal label. */
        duration,
        reseatRow,
        bindRowTarget,
        paintCurrent,
        playReel,
        isReeling,
        // L.W11 S7 — the ignition-cascade gesture state + the power-on boot.
        isScrubbing, scrubDir, setScrubbing, setScrubDir, isPoweringOn, powerOn,
        /** The LIVE engine Sequence (rebuilt on every re-time — read through the
         *  accessor, never captured). */
        get sequence() {
            return sequence;
        },
        facility,
        isPlaying,
        progress,
        scrub,
        reset,
    };
}

export type SequenceDemo = ReturnType<typeof useSequenceDemo>;
