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

/** SYNC unless `delay > 0` — then a thenable resolving after the sleep. */
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

    if (anim.options.delay > 0) {
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
        const pending = onStart(anim);
        const begin = (): number => {
            anim._playback.startTime = t + anim.options.delay;
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
        onEnd(anim);
        anim._playback.t = anim.options.duration;
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
export function renderFrame<V extends Vars>(
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
