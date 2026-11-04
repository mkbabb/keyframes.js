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
import { FRAME_RATE } from "../../internal/leaves";
import { withReducedMotion } from "../../internal/reduced-motion";
import type { FlatAuthoredValues } from "../../compile/value";
import type { Vars } from "../../constants";
import type { KeyframesAnimation } from "../animation";

/**
 * True while the play's ONE `delay` phase offset is still owed.
 *
 * X.KF.W5 ruling KF-W5R4(2) (COHESION §0j.C): **`delay` is PER-PLAY** — one
 * phase offset taken at play start, never re-taken per iteration. `onEnd`
 * clears `startTime` at EVERY iteration boundary, so `advanceTo` re-enters
 * `onStart` for iterations 2..N; without this predicate that re-entry
 * re-offset `startTime` by the whole delay, making the JS-side period
 * `duration + delay` — a monotone drift against the compositor's exact clock
 * (the banked witness: 27 %/cycle, unbounded) plus corrupt `iteration`
 * bookkeeping. Native WAAPI agrees: `delay` there is one phase offset per play.
 */
const delayPending = <V extends Vars>(anim: KeyframesAnimation<V>): boolean =>
    anim.options.delay > 0 && anim._playback.iteration === 0;

/**
 * Open an iteration: direction, the backwards fill, `started`. Always SYNC.
 *
 * 6.2.1 — **`delay` is a PHASE on the driving clock, never a sleep.** The
 * delay used to be a wall-clock `sleep` here, which made the first advance a
 * thenable. Every driver that owns a clock then disagreed with it: an
 * `AnimationGroup` awaited its LONGEST child's sleep before it painted or
 * rescheduled (a staggered cohort sat still, then jumped), and a caller's
 * explicit clock (`advanceTo(t)`) was overtaken by `setTimeout`. Now the
 * play anchors at `clock + delay` ({@link advanceTo}) and its local time is
 * NEGATIVE until the delay elapses — the CSS before-phase, painted per the
 * fill contract by `interpFrames` (backwards/both → the 0 % frame, else
 * nothing). `animationstart` fires when the active phase begins, as in CSS.
 */
export function onStart<V extends Vars>(anim: KeyframesAnimation<V>): void {
    anim._playback.reversed = false;

    if (shouldReverse(anim.options.direction, anim._playback.iteration)) {
        reverse(anim);
    }

    if (anim.options.fillMode === "backwards" || anim.options.fillMode === "both") {
        anim.fillBackwards();
    }

    anim._playback.started = true;
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
 * SYNC (J.W6 S1; 6.2.1): every frame returns a plain number — the delay is a
 * phase on `t`, not a sleep, so no frame ever waits on a timer. Ordering locked
 * by proof:event-ordering.
 */
export function advanceTo<V extends Vars>(
    anim: KeyframesAnimation<V>,
    t: number,
): number {
    if (anim._playback.startTime === undefined) {
        // The phase is read from the SAME predicate the iteration opens under,
        // and read BEFORE `onStart` runs: iteration 1 is offset by `delay`,
        // iterations 2..N by 0 (KF-W5R4(2) — `delay` is per-play).
        const phase = delayPending(anim) ? anim.options.delay : 0;
        onStart(anim);
        return beginIteration(anim, t, phase, false);
    }
    return advanceBody(anim, t, false);
}

/** Anchor the iteration `onStart` just opened, then advance it to `t`. */
function beginIteration<V extends Vars>(
    anim: KeyframesAnimation<V>,
    t: number,
    phase: number,
    wrapped: boolean,
): number {
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
    // KFA-70: a fresh anchor waits for its first presented frame
    // (`presentAnchor`, rAF lanes only). A delayed anchor takes it too: the
    // delay is a phase on this same tick, so a group's delayed and undelayed
    // children re-anchor together and stay on one master clock.
    anim._playback.anchorTick = carried === undefined ? t : undefined;
    // The active phase begins now unless a delay is owed; then `animationstart`
    // waits for the clock to reach the anchor (`advanceBody`), as in CSS.
    anim._playback.startOwed = phase > 0;
    if (!anim._playback.startOwed) anim.dispatchAnimationEvent("animationstart");
    return advanceBody(anim, t, wrapped);
}

/**
 * KFA-70 engine limb (X.KF.W13X.r4lib) — re-anchor a fresh play to its first
 * PRESENTED frame. The anchor tick paints the rest pose; that frame is only
 * presented when the next rAF tick arrives. When the anchor frame ran long (a
 * play started during a heavy mount: ~110 ms of style/layout before the rest
 * pose reached the screen), the next tick read the whole stall as elapsed time
 * and the first moving frame jumped 63–70 % of the landing cube's settle. No
 * motion has been presented before this tick, so the play may advance at most
 * one frame here; the clock moves forward by the rest. A prompt anchor frame
 * (≤ one frame) is untouched.
 *
 * Called by the rAF lanes only (`playFrame`, the group's draw loop), before
 * the tick's advance: `advanceTo` itself stays the pure absolute-clock driver
 * for callers that own their clock.
 */
export function presentAnchor<V extends Vars>(
    anim: KeyframesAnimation<V>,
    t: number,
): void {
    const anchor = anim._playback.anchorTick;
    if (anchor === undefined || t <= anchor) return;
    anim._playback.anchorTick = undefined;
    const stall = t - anchor - FRAME_RATE;
    if (stall > 0 && !anim._playback.paused) {
        anim._playback.startTime! += stall;
    }
}

/** The post-start advance body — pause clock, local time, iteration end. */
function advanceBody<V extends Vars>(
    anim: KeyframesAnimation<V>,
    t: number,
    wrapped: boolean,
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

    // The before-phase: a delayed play's local time is negative until its
    // delay elapses; the active phase (and its `animationstart`) begins at 0.
    if (anim._playback.startOwed) {
        if (anim._playback.t < 0) return anim._playback.t;
        anim._playback.startOwed = false;
        anim.dispatchAnimationEvent("animationstart");
    }

    if (anim._playback.t >= anim.options.duration && wrapped) {
        // A period or more past the boundary this frame already crossed (a
        // stalled tab): one boundary per frame — the next frame crosses this
        // one, so `animationiteration` fires once per frame, as in CSS.
        anim._playback.t = anim.options.duration;
    } else if (anim._playback.t >= anim.options.duration) {
        // KFA-181 (X.KF.W13V.k) — the next iteration begins exactly one
        // duration after this one began, so the overshoot past the boundary is
        // CARRIED. Re-basing at the next frame's clock dropped it (plus the held
        // end frame) on every wrap: a 1600 ms channel lost ~4 frame-times per
        // 8 s against its 8000 ms sibling and drifted out of phase.
        const nextStart = anim._playback.startTime! + anim.options.duration;
        onEnd(anim);
        anim._playback.t = anim.options.duration;
        if (!anim._playback.done) {
            anim._playback.carriedStartTime = nextStart;
            // KFA-145 (X.KF.W13X.r4lib) — the next iteration begins in THIS
            // frame, so the frame paints the wrapped pose. Clamping it to the
            // end pose held that pose for an extra frame on every loop (the
            // Square tour read t = 2000 then t = 0 as one pose: a hitch under
            // a linear easing).
            onStart(anim);
            return beginIteration(anim, t, 0, true);
        }
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
): boolean {
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

    presentAnchor(anim, t);
    // Sync (J.W6 S1; 6.2.1) — the loop-core reschedules inline.
    return renderFrame(anim, anim.advanceTo(t));
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
