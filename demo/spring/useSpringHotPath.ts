import { ref, type Ref } from "vue";

import type { SpringProgress } from "@src/animation/spring";

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

/** A spring painter: position the moving ball(s) it owns from `springLive`.
 *  The view layer registers these; the loop calls them imperatively each
 *  frame (direct `style` writes — off the Vue render graph). */
export type SpringPainter = () => void;

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
    const PROGRESS_READOUT_HZ = 6; // reactive readout cadence (a few Hz, not 60)
    let lastReadoutAt = 0;

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
    // phase IS the scene's restorable position). The scrubber-equivalent.
    const progress = ref(0);

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

    const springPainters = new Set<SpringPainter>();

    /** Register a non-reactive spring painter (returns an unregister fn).
     *  Paints once immediately so the balls are correct at registration time
     *  (e.g. on a paused scene). */
    const registerSpringPainter = (paint: SpringPainter): (() => void) => {
        springPainters.add(paint);
        paint();
        return () => springPainters.delete(paint);
    };

    /** Repaint every registered painter at the current live state (the hot
     *  path each frame; also used after a scrub / reset so the balls track
     *  while the loop is paused). */
    const repaintSprings = (): void => {
        for (const paint of springPainters) paint();
    };

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
        if (now - lastReadoutAt >= 1000 / PROGRESS_READOUT_HZ) {
            lastReadoutAt = now;
            flushReadouts();
        }
    };

    return {
        // Readout mirrors (few-Hz)
        liveValue,
        liveVelocity,
        liveSettled,
        sampled,
        progress,
        // The non-reactive hot-path seam
        springLive,
        registerSpringPainter,
        repaintSprings,
        flushReadouts,
        maybeFlushReadouts,
    };
}
