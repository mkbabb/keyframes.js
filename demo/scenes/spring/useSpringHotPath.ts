import { ref, type Ref } from "vue";

import type { SpringProgress } from "@mkbabb/keyframes.js";

import { useThrottledReadout } from "@composables/useThrottledReadout";
import { usePainterRegistry } from "@composables/scene-runtime/usePainterRegistry";

import { PROGRESS_READOUT_HZ } from "@utils/rafConstants";
import { SPRING_PRESETS, type SpringPreset } from "./springPresets";

/** One live tracker plus its reactive read-out, for the comparison row. */
export interface SpringTrack {
    preset: SpringPreset;
    spring: SpringProgress;
    /** Reactive mirror of the spring's current value (0–1). */
    value: Ref<number>;
    /** Reactive mirror of the spring's current velocity. */
    velocity: Ref<number>;
    settled: Ref<boolean>;
}

/**
 * J.W2 S5 (DS-3) — THE HOT POSITIONAL PATH OFF THE VUE RENDER GRAPH.
 *
 * The former `frame()` wrote 17 reactive refs PER FRAME (3 live + 4 tracks
 * × 3 + progress/sampled) — every consumer (the SpringTarget ball + readout,
 * the 4 SpringSidebar track balls, the sampler row) re-rendered at 60 Hz.
 * Reactivity is the wrong tool for a 60 Hz positional update (the I.W4 D4
 * resolution, verbatim). The cure is easing's EXACT discipline: the loop
 * writes a NON-reactive live snapshot + drives registered "spring painters"
 * (closures the view layer hands us that write `el.style` DIRECTLY); the
 * reactive refs become READOUT mirrors flushed at PROGRESS_READOUT_HZ for
 * the human-readable numerals — the hot path never touches the render graph.
 *
 * Colocated with `useSpringDemo` (its only caller — the J.W0-S5
 * proof:demo-no-oversize seam, the same concern-seam split shape as the
 * easing useEasingDemo/useEasingGallery pair): this unit owns the snapshot,
 * the painter registry, and the readout mirrors; the demo's rAF loop writes
 * the snapshot and calls `repaintSprings` (hot) + `maybeFlushReadouts` (cold).
 *
 * @param tracks  the canonical preset trackers — `flushReadouts` mirrors each
 *                track's spring into its reactive read-out refs.
 */
export function useSpringHotPath(tracks: SpringTrack[]) {
    // The shared few-Hz cold-path throttle seam (T.F23(c) — the DRY extraction
    // that retired the hand-rolled `lastReadoutAt` accumulator this scene, easing,
    // and historically amiga/sequence each copy-pasted).
    const readout = useThrottledReadout(PROGRESS_READOUT_HZ);

    // ── Reactive READOUT mirrors — written at PROGRESS_READOUT_HZ only ──────
    // The human-readable numerals/badge, NEVER per frame. The 60 Hz positional
    // truth lives in the non-reactive `springLive` snapshot below; the balls
    // are painted from it by direct `style` writes (the I.W4 D4 DotPainter
    // idiom, transposed).
    const liveValue = ref(0);
    const liveVelocity = ref(0);
    const liveSettled = ref(false);
    const sampled = ref(0);

    // The normalized [0,1] sweep phase the comparison row runs on. It is the one
    // round-trippable scalar the raw-rAF ScenePlayback contract preserves across
    // a scene switch (the live markRaw springs are re-created on remount, so the
    // phase IS the scene's restorable position). The CONTRACT authority — written
    // at PROGRESS_READOUT_HZ (the few-Hz text cadence + the snapshot/restore seam).
    const progress = ref(0);

    // ── K.W4 S2 — the CONTINUOUS scrubber-position channel (the slider cure) ──
    // The stepping-slider root (live-spring-sequence-mp-verdict.md §2): the
    // transport scrubber thumb was driven off `progress` — a PROGRESS_READOUT_HZ
    // (6 Hz) mirror — so the position visibly STEPPED (13 distinct positions /
    // max-dwell 21 frames over a 2 s play window, the born-RED witness). The cure
    // is a SEPARATE channel for the POSITION: `scrubberPhase` is written EVERY
    // frame off the 60 Hz sampler-sweep truth (painter-style — it drives ONLY the
    // scrubber thumb + the visualizer time-twin, never the badges/numerals, so it
    // is NOT the re-paint storm the 6 Hz throttle guards against). A few-Hz cadence
    // is correct for a TEXT numeral (a human cannot read a number changing 60×/s)
    // and WRONG for a position (the eye sees the 6 Hz step). The two channels are
    // disjoint by construction: `progress` = text + contract; `scrubberPhase` =
    // position. (NOT raising PROGRESS_READOUT_HZ to 60 — that un-throttles the
    // text; NOT a CSS transition masking the steps — the position is born-continuous.)
    const scrubberPhase = ref(0);

    /** The always-current NON-reactive spring state (the painters read this;
     *  the reactive refs lag it by ≤ one readout tick, by design). `phase` is
     *  the raw sweep phase [0,1], updated every frame — the live twin the
     *  reactive `progress` mirror lags. */
    const springLive = {
        value: 0,
        velocity: 0,
        settled: false,
        /** Canonical preset track values, indexed like `tracks`. */
        trackValues: SPRING_PRESETS.map(() => 0),
        sampled: 0,
        phase: 0,
    };

    const { registerPainter: registerSpringPainter, repaint: repaintSprings } =
        usePainterRegistry(() => [] as const);

    /** Flush the live snapshot into the reactive READOUT mirrors (the few-Hz
     *  cold path: the numerals, the settled badge, the contract time-twin). */
    const flushReadouts = (): void => {
        liveValue.value = springLive.value;
        liveVelocity.value = springLive.velocity;
        liveSettled.value = springLive.settled;
        for (let i = 0; i < tracks.length; i++) {
            const t = tracks[i]!;
            t.value.value = springLive.trackValues[i]!;
            t.velocity.value = t.spring.velocity;
            t.settled.value = t.spring.settled;
        }
        sampled.value = springLive.sampled;
        progress.value = springLive.phase;
    };

    /** The cold-path cadence gate: flush the readout mirrors at
     *  PROGRESS_READOUT_HZ (called from the 60 Hz loop with its `now`). */
    const maybeFlushReadouts = (now: DOMHighResTimeStamp): void => {
        readout.maybeFlush(now, flushReadouts);
    };

    /** K.W4 S2 — push the CONTINUOUS sweep phase into the scrubber-position
     *  channel. Called EVERY frame (60 Hz) from the loop AND on every scrub /
     *  reset so the thumb tracks born-continuous, never the 6 Hz text mirror. */
    const paintScrubberPhase = (): void => {
        scrubberPhase.value = springLive.phase;
    };

    return {
        // Readout mirrors (few-Hz)
        liveValue,
        liveVelocity,
        liveSettled,
        sampled,
        progress,
        // K.W4 S2 — the continuous scrubber-position channel (60 Hz)
        scrubberPhase,
        paintScrubberPhase,
        // The non-reactive hot-path seam
        springLive,
        registerSpringPainter,
        repaintSprings,
        flushReadouts,
        maybeFlushReadouts,
    };
}
