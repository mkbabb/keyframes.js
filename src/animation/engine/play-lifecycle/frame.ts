/**
 * engine/play-lifecycle/frame.ts — the per-frame ADVANCE + RENDER leg of the
 * standalone-play machine (V.W5 LT-07 carve off `play-lifecycle.ts`).
 *
 * The iteration-boundary handlers (`onStart`/`onEnd`), the driver-layer
 * absolute-clock advance (`advanceTo` + its `advanceBody` steady-path helper),
 * the rAF per-frame step (`playFrame`), and the post-advance paint half
 * (`renderFrame`). Depends on `events.ts` (the reversal predicate), the transport
 * leaf (`settle`/`resolvePlay`), and `strategies.ts` (the mid-flight
 * reduced-motion snap). `renderFrame` is a module-internal cross-file export
 * (kept `export`, barrel-EXCLUDED — consumed by `playFrame`).
 */
import { reverse, shouldReverse } from "./events";
import { snapToReducedMotion } from "./strategies";
import { resolvePlay, settle } from "./transport";
import { sleep } from "../../internal/helpers";
import { withReducedMotion } from "../../internal/reduced-motion";
import type { FlatAuthoredValues } from "../../compile/value";
import type { Vars } from "../../constants";
import type { KeyframesAnimation } from "../animation";

/**
 * True while the play's ONE `delay` phase offset is still owed.
 *
 * X.KF.W5 ruling KF-W5R4(2) (COHESION §0j.C): **`delay` is PER-PLAY** — one
 * phase offset taken at play start, never re-slept per iteration. `onEnd`
 * clears `startTime` at EVERY iteration boundary, so `advanceTo` re-enters
 * `onStart` for iterations 2..N; without this predicate that re-entry re-slept
 * the whole delay AND re-offset `startTime`, making the JS-side period
 * `duration + delay` — a monotone drift against the compositor's exact clock
 * (the banked witness: 27 %/cycle, unbounded) plus corrupt `iteration`
 * bookkeeping. Native WAAPI agrees: `delay` there is one phase offset per play,
 * which is why the delegated lane never showed the drift its shadow loop did.
 */
const delayPending = <V extends Vars>(anim: KeyframesAnimation<V>): boolean =>
    anim.options.delay > 0 && anim._playback.iteration === 0;

/** SYNC unless the per-play `delay` is still owed — then a thenable resolving
 *  after the sleep (iterations 2..N are always sync; see {@link delayPending}). */
export function onStart<V extends Vars>(
    anim: KeyframesAnimation<V>,
): Promise<void> | undefined {
    anim._playback.reversed = false;

    if (shouldReverse(anim.options.direction, anim._playback.iteration)) {
        reverse(anim);
    }

    if (anim.options.fillMode === "backwards" || anim.options.fillMode === "both") {
        anim.fillBackwards();
    }

    if (delayPending(anim)) {
        anim._playback.paused = true;
        return sleep(anim.options.delay).then(() => {
            anim._playback.paused = false;
            anim._playback.started = true;
        });
    }

    anim._playback.started = true;
    return undefined;
}

export function onEnd<V extends Vars>(anim: KeyframesAnimation<V>): void {
    // Completion paints the rest frame per the fill contract — the one
    // place "where does the playhead rest?" is decided.
    anim.paintRest();

    anim._playback.startTime = undefined;

    if (anim._playback.iteration >= anim.options.iterationCount - 1) {
        anim._playback.done = true;
        anim._playback.iteration = 0;
        anim.dispatchAnimationEvent("animationend");
    } else {
        anim._playback.iteration += 1;
        anim.dispatchAnimationEvent("animationiteration");
    }
}

/**
 * Advance the playhead to absolute clock `t` (a rAF timestamp, NOT a
 * delta). Lazily runs `onStart` on the first call, reconciles the
 * pause/resume clock, and ends the iteration once `t` reaches the
 * duration. This is the DRIVER-layer advance — the one meaning of the
 * absolute-clock step, distinct from the `tickDt(dt)` stepper surface
 * the rest of the engine canonicalized to.
 *
 * SYNC on the steady path (J.W6 S1 — the F.W5 held half, landed): every
 * post-start frame returns a plain number (no per-frame promise+microtask
 * hop); a thenable ONLY when the FIRST tick awaits the genuinely-async
 * delay sleep. Ordering locked by proof:event-ordering.
 */
export function advanceTo<V extends Vars>(
    anim: KeyframesAnimation<V>,
    t: number,
): number | Promise<number> {
    if (anim._playback.startTime === undefined) {
        // The phase is read from the SAME predicate `onStart` slept on, and read
        // BEFORE it runs, so the sleep and the start-time offset can never
        // disagree: iteration 1 is offset by `delay`, iterations 2..N by 0
        // (KF-W5R4(2) — `delay` is per-play).
        const phase = delayPending(anim) ? anim.options.delay : 0;
        const pending = onStart(anim);
        const begin = (): number => {
            // KFA-181 (X.KF.W13V.k): a non-final wrap carries its boundary
            // forward; only a genuine first start anchors at this frame's clock.
            const carried = anim._playback.carriedStartTime;
            anim._playback.carriedStartTime = undefined;
            anim._playback.startTime = carried ?? t + phase;
            // KFA-17 / C6-3 (X.KF.W13X.r): a FRESH anchor is taken at this
            // frame's clock, so a pause recorded before it (a group paused on
            // the tick that cleared this child's anchor) spans no local time.
            // Applying it would move the anchor forward by the paused span and
            // run the playhead negative by exactly that span. A carried anchor
            // predates the pause, so it keeps the pause offset.
            if (carried === undefined) anim._playback.pausedTime = 0;
            anim.dispatchAnimationEvent("animationstart");
            return advanceBody(anim, t);
        };
        return pending ? pending.then(begin) : begin();
    }
    return advanceBody(anim, t);
}

/** The post-start advance body — pause clock, local time, iteration end. */
function advanceBody<V extends Vars>(
    anim: KeyframesAnimation<V>,
    t: number,
): number {
    if (anim._playback.paused && anim._playback.pausedTime === 0) {
        anim._playback.pausedTime = t;
        return anim._playback.t;
    } else if (anim._playback.pausedTime > 0 && !anim._playback.paused) {
        const dt = t - anim._playback.pausedTime;
        anim._playback.startTime! += dt;
        anim._playback.pausedTime = 0;
    }

    anim._playback.t = t - anim._playback.startTime!;

    if (anim._playback.t >= anim.options.duration) {
        // KFA-181 (X.KF.W13V.k) — the next iteration begins exactly one
        // duration after this one began, so the overshoot past the boundary is
        // CARRIED. Re-basing at the next frame's clock dropped it (plus the held
        // end frame) on every wrap: a 1600 ms channel lost ~4 frame-times per
        // 8 s against its 8000 ms sibling and drifted out of phase.
        const nextStart = anim._playback.startTime! + anim.options.duration;
        onEnd(anim);
        anim._playback.t = anim.options.duration;
        if (!anim._playback.done) anim._playback.carriedStartTime = nextStart;
    }
    return anim._playback.t;
}

/**
 * One frame of the standalone rAF play path, driven by the shared
 * `RAFPlayback.loop`. Returns whether the loop should continue.
 */
export function playFrame<V extends Vars>(
    anim: KeyframesAnimation<V>,
    t: number,
): boolean | Promise<boolean> {
    // Live reduced-motion: a long/infinite animation that was running when
    // the OS toggled `prefers-reduced-motion: reduce` re-consults the ONE
    // detector per tick and converges to the SAME terminal state the
    // up-front gate produces (snap to the rest frame, settle) — the
    // observation half of the shared detector (D-LIB-3). No-op when the
    // option is off or the preference is unset (the run() branch returns).
    const flipped = withReducedMotion(
        anim.options.respectReducedMotion,
        () => true,
        () => false,
    );
    if (flipped) {
        snapToReducedMotion(anim);
        return false;
    }

    // Sync steady path (J.W6 S1) — the loop-core reschedules inline.
    const stepped = anim.advanceTo(t);
    return typeof stepped === "number"
        ? renderFrame(anim, stepped)
        : stepped.then((local) => renderFrame(anim, local));
}

/** The post-advance render half of `playFrame` — paint, or settle on done. */
function renderFrame<V extends Vars>(
    anim: KeyframesAnimation<V>,
    t: number,
): boolean {
    if (anim._playback.paused) {
        return false;
    }

    if (!anim._playback.done) {
        // Reuse the one hoisted buffer — steady-state playback allocates
        // no per-frame result object (proof:standalone-zero-alloc).
        anim.interpFrames(
            t,
            true,
            anim._playback._interpOut as FlatAuthoredValues,
        );
        return true;
    }

    // Completion: `onEnd` (inside tick) ALREADY painted the rest frame
    // per the fill contract. Do NOT re-paint here — an
    // `interpFrames(duration)` would clobber that rest paint with the
    // final frame, so a `fillMode: none` animation would end at its
    // final frame instead of resting at its initial one. settle is pure
    // teardown, never a repaint.
    settle(anim);
    resolvePlay(anim);
    return false;
}
