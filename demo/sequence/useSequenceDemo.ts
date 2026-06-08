import { computed, markRaw, onScopeDispose, ref, watch } from "vue";

import { AnimationGroup } from "@src/animation/group";
import { CSSKeyframesAnimation } from "@src/animation/engine";
import { Sequence } from "@src/animation/sequence";
import { stagger } from "@src/animation/stagger";
import { springTimingFunction } from "@src/animation/springTimingFunction";
import { RAFPlayback } from "@src/animation/playback";

import { useSceneVisibilityPause } from "../app/useSceneVisibilityPause";
import {
    useSceneMachine,
    createRafAdapter,
    type ScenePlayback,
} from "@components/custom/animation-controls/stores";

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
 *     (`RAFPlayback` — inv ζ: NO hand-rolled rAF) through the F.W9 transport:
 *     play / pause / resume / reverse / timeScale / progress-scrub.
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
const ROW_DURATION = 900;

/** The stagger increment between adjacent rows (ms) — the `at:` spacing. */
const STAGGER_EACH = 260;

/** One storyboard row: index + its resolved start offset on the master clock. */
export interface SequenceRow {
    /** 0-based row index (top → bottom). */
    index: number;
    /** This row's resolved start offset on the master clock (ms). */
    at: number;
}

export function useSequenceDemo() {
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
    const delays = staggerFn.delays(ROW_COUNT);

    // ── The child animations (one glide per row) ─────────────────────────────
    // Each row is a CSSKeyframesAnimation sweeping a CSS custom property
    // `--ball-p` 0 → 1 (the ball's normalized rail position) plus an opacity
    // fade-in and a settle scale-pop. The default DOM renderer paints them; the
    // target's CSS reads `--ball-p` to position the ball (allocation-free, one
    // custom-property value per frame — the .progress-ball idiom's own posture).
    const childAnims: CSSKeyframesAnimation<any>[] = [];
    for (let i = 0; i < ROW_COUNT; i++) {
        const anim = new CSSKeyframesAnimation({
            duration: ROW_DURATION,
            fillMode: "forwards",
            timingFunction: springTimingFunction({
                response: 0.45,
                dampingFraction: 0.62,
            }),
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
    // `RAFPlayback` loop.
    const sequence = markRaw(new Sequence());
    for (let i = 0; i < ROW_COUNT; i++) {
        sequence.add(childAnims[i]!, delays[i]!);
    }

    // ── A minimal contract AnimationGroup for the bottom-bar transport ───────
    // The scene's MOTION is the Sequence's own loop; the editor's bottom bar
    // still expects an AnimationGroup handle (the StartingStyleScene posture).
    // This single preview animation dogfoods the same spring twin the rows ride;
    // it drives no scene motion.
    // [DOCUMENTED EXPECTATION, WV-W1 lane escape hatch: the group is retained
    // ONLY as the transport host; deleting it strands the bottom-bar contract
    // (ControlsPaneWrapper/AnimationMenuBar/readout). The PLAYBACK authority is
    // the machine + the raw-rAF ScenePlayback adapter; the group's `paused` is a
    // ONE-WAY projection of the machine status (below).]
    const contractAnim = markRaw(
        new CSSKeyframesAnimation({
            duration: sequence.duration || ROW_DURATION,
            iterationCount: "infinite",
            timingFunction: springTimingFunction({
                response: 0.5,
                dampingFraction: 0.7,
            }),
        }).fromVars([{ opacity: 0 }, { opacity: 1 }]),
    );
    contractAnim.name = "Sequence Preview";
    contractAnim.superKey = "Sequence";
    const animationGroup = markRaw(new AnimationGroup(contractAnim));
    animationGroup.started = true;
    animationGroup.paused = true;

    // ── Playback intent: DERIVED from the machine, NOT a private shadow ───────
    // The former private `isPlaying = ref(false)` was the SHADOW playback
    // authority (the D12 smell — a second source of truth nothing could
    // suspend). DELETED: the play-intent is now a read-only projection of
    // `machine.status === 'playing'`. play/pause/reset dispatch to the machine;
    // the transport UI reads THIS computed.
    const machine = useSceneMachine();
    const isPlaying = computed(() => machine.status.value === "playing");

    // ONE-WAY projection: the transport host's `paused` mirrors the machine
    // status so the bottom-bar play button reflects the true playback state.
    // Read-only (the machine is the authority) — NOT a bidirectional hand-sync
    // that would make the group a shadow authority.
    watch(
        isPlaying,
        (playing) => {
            animationGroup.paused = !playing;
        },
        { immediate: true },
    );

    const isReversed = ref(false);
    const timeScale = ref(1);
    const progress = ref(0);

    /** Read the live Sequence playhead into the reactive progress mirror. */
    const syncFromSequence = () => {
        progress.value = Math.max(0, Math.min(1, sequence.progress));
    };

    // The reactivity mirror — the master progress read-out — rides the engine's
    // OWN `RAFPlayback.loop` driver (NOT a parallel raw rAF). It GATES on the
    // machine (the single authority): when the machine leaves `playing` the loop
    // self-terminates. The Sequence's own play loop drives the actual ball motion
    // in parallel; this loop only mirrors the playhead into the reactive readout.
    const mirror = markRaw(new RAFPlayback());
    const startMirror = () => {
        if (mirror.running) return;
        mirror.loop(() => {
            syncFromSequence();
            return machine.status.value === "playing";
        });
    };
    const stopMirror = () => mirror.stop();

    // ── The engine-loop drivers (driven by the adapter / the machine) ─────────
    // The adapter's resume/suspend route the engine loop through ONE seam
    // (startLoop/stopLoop). They are engine-transport ACTIONS, NOT intent — the
    // machine owns the intent. The Sequence transport internals (play vs resume,
    // reverse, timeScale, seek) are PRESERVED byte-for-byte: only the play/pause
    // intent + the mirror gating route through the machine now (the lane mandate:
    // touch only the machine-integration seam, not the SOTA transport).

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
    const play = () => {
        if (isPlaying.value) return;
        machine.dispatch({ type: "PLAY" });
    };

    const pause = () => {
        if (!isPlaying.value) return;
        machine.dispatch({ type: "PAUSE" });
    };

    const resume = () => play();

    const togglePlay = () => {
        if (isPlaying.value) pause();
        else play();
    };

    // reverse / timeScale / scrub are SEQUENCE-internal transport (the F.W9
    // contract) — they reshape the engine loop but do not flip the play/pause
    // axis the machine owns. scrub records `t` onto the machine snapshot so the
    // scrubbed playhead round-trips on suspend/restore.

    const reverse = () => {
        // Flip the engine rate FIRST (the SOTA transport call — preserved
        // exactly). If a live loop is running it picks up the new rate next
        // frame; the badge reads the engine's sign.
        sequence.reverse();
        isReversed.value = sequence.rate < 0;
        // A reverse while paused needs the loop running to walk back — dispatch
        // PLAY (the machine's resume re-arms the engine loop via the adapter's
        // startLoop → sequence.resume(), continuing from the current playhead in
        // the new direction, exactly as the original `sequence.resume()` did).
        if (!isPlaying.value && isMidPlay()) play();
    };

    const setTimeScale = (n: number) => {
        timeScale.value = n;
        sequence.timeScale(sequence.rate < 0 ? -n : n);
    };

    const scrub = (p: number) => {
        if (isPlaying.value) pause();
        sequence.progress = Math.max(0, Math.min(1, p));
        syncFromSequence();
        // Record the scrubbed playhead onto the machine snapshot so it survives a
        // scene switch (the raw-rAF round-trip).
        machine.dispatch({ type: "SCRUB", t: progress.value });
    };

    const reset = () => {
        sequence.stop();
        isReversed.value = false;
        timeScale.value = 1;
        stopMirror();
        sequence.timeScale(1);
        sequence.seek(0);
        syncFromSequence();
        machine.dispatch({ type: "RESET" });
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
            sequence.progress = Math.max(0, Math.min(1, t));
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

    // Paint the initial (t=0) frame so the balls rest at their rail origin and
    // the readout shows 0 before the first restore (the SequenceTarget seeks 0 on
    // mount too — this is the composable-side belt-and-braces).
    syncFromSequence();

    // Pause the engine loop while the tab is backgrounded (CWV / battery),
    // without disturbing the machine's play/pause intent (PRESERVED autoPaused
    // contract — "only resume what IT paused"). `startLoop` resumes from the
    // retained playhead with no jump.
    useSceneVisibilityPause(
        () => mirror.running,
        stopLoop,
        startLoop,
    );

    // Stop the mirror + sequence on scope dispose (the genuine unmount seam) —
    // the host has NO <KeepAlive>, so onDeactivated never fires; this gives the
    // mid-play swap an honest stop instead of letting the loop wind down detached.
    onScopeDispose(() => {
        stopMirror();
        sequence.stop();
    });

    return {
        rows: computed<SequenceRow[]>(() =>
            Array.from({ length: ROW_COUNT }, (_, i) => ({
                index: i,
                at: delays[i]!,
            })),
        ),
        delays,
        sequence,
        childAnims,
        animationGroup,
        isPlaying,
        isReversed,
        timeScale,
        progress,
        play,
        pause,
        resume,
        togglePlay,
        reverse,
        setTimeScale,
        scrub,
        reset,
        // The raw-rAF ScenePlayback adapter — the App registers it on SCENE_READY
        // so the Sequence's progress/isPlaying round-trip through the CONTRACT.
        scenePlayback,
    };
}

export type SequenceDemo = ReturnType<typeof useSequenceDemo>;
