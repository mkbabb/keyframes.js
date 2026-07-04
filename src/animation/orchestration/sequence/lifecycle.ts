/**
 * orchestration/sequence/lifecycle.ts — the Sequence TRANSPORT verbs (play /
 * stop / pause / resume) + the playback-rate/repeat modifiers (timeScale /
 * reverse / repeat / yoyo), lifted off the `Sequence` class as FREE FUNCTIONS
 * (S.B5 — the sequence ceiling carve, mirroring `group/lifecycle.ts` + the
 * engine's `engine/play-lifecycle.ts`). The class keeps thin `this`-delegates so
 * the public transport surface reads unchanged; the BODIES — the `_playingPromise`
 * re-entrancy guard, the child `startTime`/`managed` seeding, the no-jump
 * re-anchor, the settle-and-resolve teardown — live here.
 *
 * The pure master-clock MATH (the repeat/yoyo fold, the rest phase, the origin
 * seed, the per-frame driver) already lives in `./transport`; these verbs DRIVE
 * it — they call `reanchorSequence`/`settleSequence` directly rather than a
 * class method. A colocated INTERNAL module: statically imported by `./sequence`,
 * LIGHT (value.js-free — it drives `Animation` through its public surface only).
 * The back-edge to the class is a TYPE-only import (`import type { Sequence }`),
 * so there is NO runtime cycle.
 *
 * The seam (what STAYS on `sequence.ts`): the master-clock SCRUB (`seek`), the
 * insertion API (`add`/`label`/`on`/`setTargets`), the getters, the `_frame`
 * driver delegate (the seek↔play parity test drives `seq._frame` directly), and
 * the `get finished()` completion front-door.
 */
import { prefersReducedMotion } from "../../internal/reduced-motion";
import { reanchorSequence, settleSequence } from "./transport";
import type { Vars } from "../../constants/types";
import type { Sequence } from "./sequence";

/**
 * Drive the sequence over real time via `RAFPlayback`. Each child is driven
 * through the published `Animation.advanceTo(absoluteClock)` map: its `startTime`
 * is seeded to its resolved `at`, so `advanceTo(masterClock)` yields the child's
 * local clock as `masterClock − at` exactly. Resolves when the master playhead
 * passes the sequence `duration`.
 *
 * Re-entrant: a `play()` while one is in flight returns the same held promise.
 * Under `respectReducedMotion` + an active query, snaps to the rest frame in one
 * paint (a terminal `seek(duration)`), no draw loop.
 */
export function play<V extends Vars>(seq: Sequence<V>): Promise<void> {
    if (seq._playingPromise) return seq._playingPromise;

    if (seq.respectReducedMotion && prefersReducedMotion()) {
        seq.seek(seq.duration);
        return Promise.resolve();
    }

    // Seed each child's absolute-clock anchor: advanceTo(clock) computes
    // local = clock − startTime, and we want local = masterClock − at, so
    // startTime := at. Pre-seeding `startTime` (and `started`) makes
    // `advanceTo` skip its lazy `onStart` (no per-child `delay` sleep, no
    // duplicate `animationstart`) while still honoring `onEnd` (rest-frame
    // paint + `animationend`) when the segment passes its duration.
    // (Sequence children carry no own `delay`; the `at` IS the offset.)
    for (const { animation, at } of seq.entries) {
        animation.startTime = at;
        animation.started = true;
        animation.managed = true;
    }

    // A fresh play starts the master clock at 0 (the origin seed reads `_time`).
    // `resume()` keeps `_time` so the playhead continues.
    seq._time = 0;
    seq._paused = false;
    seq._playOrigin = undefined;
    seq._lastClock = undefined;

    const result = new Promise<void>((resolve) => {
        seq._resolvePlay = resolve;
        seq.playback.loop(seq._boundFrame);
    });

    seq._playingPromise = result;
    result.finally(() => {
        seq._playingPromise = null;
    });
    return result;
}

/** Halt the play loop where it stands and resolve any pending `play()`. */
export function stop<V extends Vars>(seq: Sequence<V>): void {
    seq.playback.stop();
    settleSequence(seq);
    const resolve = seq._resolvePlay;
    seq._resolvePlay = null;
    resolve?.();
}

/**
 * Halt the play loop where it stands WITHOUT releasing the playhead — the
 * managed-pause contract. The rAF loop stops; `_time` and the play promise are
 * RETAINED (children stay `managed`, unlike `stop()`), so a later `resume`
 * continues from exactly here. No-op when not playing or already paused.
 */
export function pause<V extends Vars>(seq: Sequence<V>): void {
    if (!seq._playingPromise || seq._paused) return;
    seq._paused = true;
    seq.playback.stop();
    // The next resume re-seeds the origin from the retained `_time`; clear it so
    // a stale pre-pause origin cannot leak a forward jump.
    seq._playOrigin = undefined;
}

/**
 * Resume a paused sequence — restart the rAF loop with the origin re-anchored so
 * the FIRST resumed frame's master clock equals the retained `_time` (the
 * no-forward-jump re-anchor, the same `RAFPlayback`/`AnimationGroup` managed-pause
 * contract — `src/animation/CLAUDE.md` §Managed-child lifecycle). No-op when not
 * paused.
 */
export function resume<V extends Vars>(seq: Sequence<V>): void {
    if (!seq._playingPromise || !seq._paused) return;
    seq._paused = false;
    // Clearing the origin makes the next frame seed it from `_time` (the
    // `_frame` origin-seed: `origin = clock − _time / rate`), so the master
    // clock continues from the paused playhead with no forward jump.
    seq._playOrigin = undefined;
    seq._lastClock = undefined;
    seq.playback.loop(seq._boundFrame);
}

/**
 * Set the scalar playback rate — slow-mo (`< 1`), real-time (`1`), fast-forward
 * (`> 1`), or backward (`< 0`, the `reverse` form). The master clock is
 * re-anchored so the playhead is CONTINUOUS at the rate-change instant (no jump).
 * Takes effect immediately whether or not the sequence is playing.
 */
export function timeScale<V extends Vars>(seq: Sequence<V>, n: number): void {
    if (!Number.isFinite(n)) {
        throw new Error(
            `Sequence.timeScale(n): n must be a finite number, got ${n}.`,
        );
    }
    // Re-anchor at the OLD rate's playhead, THEN adopt the new rate, so the
    // origin solves `(clock − origin) * newRate = _time` from the current
    // `_time` — continuous across the flip.
    seq._rate = n;
    reanchorSequence(seq, seq._playingPromise != null);
}

/**
 * Flip the playback direction — the playhead walks backward from where it stands
 * (a negative rate) or forward again, preserving `|rate|`. C⁰-continuous: the
 * re-anchor keeps the playhead exactly where it is at the flip instant (locked by
 * the F.W9 seek↔play parity gate).
 */
export function reverse<V extends Vars>(seq: Sequence<V>): void {
    seq._rate = -seq._rate;
    reanchorSequence(seq, seq._playingPromise != null);
}

/**
 * Set how many cycles `play()` runs before settling — `1` is single-play, `n`
 * runs `n` cycles, `Infinity` loops forever (until `stop()`). The master clock
 * folds modulo `duration` per cycle.
 */
export function repeat<V extends Vars>(seq: Sequence<V>, count: number): void {
    if (count !== Infinity && (!Number.isInteger(count) || count < 1)) {
        throw new Error(
            `Sequence.repeat(count): count must be a positive integer or Infinity, got ${count}.`,
        );
    }
    seq._repeatCount = count;
}

/**
 * Toggle yoyo (ping-pong) — when on, odd cycles run reflected (`duration −
 * phase`) so the playhead bounces back and forth across the `repeat` cycles.
 */
export function yoyo<V extends Vars>(seq: Sequence<V>, on: boolean): void {
    seq._yoyoOn = on;
}
