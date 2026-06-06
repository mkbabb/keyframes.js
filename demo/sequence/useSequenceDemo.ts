import { computed, markRaw, onActivated, onDeactivated, ref } from "vue";

import { AnimationGroup } from "@src/animation/group";
import { CSSKeyframesAnimation } from "@src/animation/engine";
import { Sequence } from "@src/animation/sequence";
import { stagger } from "@src/animation/stagger";
import { springTimingFunction } from "@src/animation/springTimingFunction";
import { RAFPlayback } from "@src/animation/playback";

import { useSceneVisibilityPause } from "../app/useSceneVisibilityPause";

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
    const animationGroup = markRaw(new AnimationGroup(contractAnim));
    animationGroup.started = true;
    animationGroup.paused = true;

    // ── Reactive transport state (mirrors the Sequence) ──────────────────────
    const isPlaying = ref(false);
    const isReversed = ref(false);
    const timeScale = ref(1);
    const progress = ref(0);

    /** Read the live Sequence playhead into the reactive progress mirror. */
    const syncFromSequence = () => {
        progress.value = Math.max(0, Math.min(1, sequence.progress));
    };

    // The reactivity mirror — the master progress read-out — rides the engine's
    // OWN `RAFPlayback.loop` driver (NOT a parallel raw rAF). It is gated by the
    // sequence's playing flag and stops itself when motion ends; the Sequence's
    // own play loop drives the actual ball motion in parallel.
    const mirror = markRaw(new RAFPlayback());
    const startMirror = () => {
        mirror.loop(() => {
            syncFromSequence();
            return isPlaying.value;
        });
    };
    const stopMirror = () => mirror.stop();

    // ── Transport ────────────────────────────────────────────────────────────
    const play = () => {
        if (isPlaying.value) return;
        isPlaying.value = true;
        startMirror();
        // Sequence.play() owns its RAFPlayback loop; resolves at the end.
        void sequence.play().finally(() => {
            isPlaying.value = false;
            stopMirror();
            syncFromSequence();
        });
    };

    const pause = () => {
        if (!isPlaying.value) return;
        sequence.pause();
        isPlaying.value = false;
        stopMirror();
    };

    const resume = () => {
        if (isPlaying.value) return;
        isPlaying.value = true;
        startMirror();
        sequence.resume();
    };

    const togglePlay = () => {
        const mid =
            sequence.time > 0 &&
            sequence.time < sequence.duration &&
            !isPlaying.value;
        if (mid) {
            resume();
        } else if (isPlaying.value) {
            pause();
        } else {
            play();
        }
    };

    const reverse = () => {
        sequence.reverse();
        isReversed.value = sequence.rate < 0;
        // A reverse on a settled sequence needs the loop running to walk back.
        if (!isPlaying.value) {
            isPlaying.value = true;
            startMirror();
            sequence.resume();
        }
    };

    const setTimeScale = (n: number) => {
        timeScale.value = n;
        sequence.timeScale(sequence.rate < 0 ? -n : n);
    };

    const scrub = (p: number) => {
        if (isPlaying.value) pause();
        sequence.progress = Math.max(0, Math.min(1, p));
        syncFromSequence();
    };

    const reset = () => {
        sequence.stop();
        isPlaying.value = false;
        isReversed.value = false;
        timeScale.value = 1;
        stopMirror();
        sequence.timeScale(1);
        sequence.seek(0);
        syncFromSequence();
    };

    // Pause the engine loop while the tab is backgrounded (CWV / battery).
    useSceneVisibilityPause(
        () => isPlaying.value,
        () => pause(),
        () => resume(),
    );

    onDeactivated(() => {
        stopMirror();
        sequence.stop();
    });
    onActivated(() => {
        syncFromSequence();
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
    };
}

export type SequenceDemo = ReturnType<typeof useSequenceDemo>;
