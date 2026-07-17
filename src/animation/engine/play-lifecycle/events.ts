/**
 * engine/play-lifecycle/events.ts — the lifecycle-EVENT + direction-reversal leg
 * of the standalone-play machine (V.W5 LT-07 carve off `play-lifecycle.ts`).
 *
 * The `AnimationEvent` dispatch (the SSR-safe capability contract) and the
 * three-way direction→reversal predicate + the clock-continuous flip. A leaf of
 * the module: it imports no sibling file (only the animation type + `Vars`).
 */
import type { Vars } from "../../constants";
import type { KeyframesAnimation } from "../animation";

/**
 * Fire a lifecycle `AnimationEvent` on each bound target (R.W2 — F-6). SSR-safe
 * capability contract: `AnimationEvent`/`dispatchEvent` are DOM capabilities —
 * when absent (Node, non-element targets) the lifecycle proceeds without events
 * rather than throwing, mirroring the off-DOM posture of `prefersReducedMotion()`.
 * Event delivery is an observation channel, not a library-internal contract.
 */
export function dispatchAnimationEvent<V extends Vars>(
    anim: KeyframesAnimation<V>,
    type: string,
): void {
    if (typeof AnimationEvent === "undefined") return;
    for (const target of anim.targets) {
        if (typeof target?.dispatchEvent !== "function") continue;
        target.dispatchEvent(
            new AnimationEvent(type, {
                animationName: anim.name ?? "",
                elapsedTime: anim._playback.t / 1000,
            }),
        );
    }
}

/**
 * The three-way direction → reversal predicate (R.W2 F-3 — the DRY fix). Both
 * `setDirection` (mid-iteration direction change) and `onStart` (the play-start
 * reversal) read the SAME test; authored ONCE here so a future direction
 * variant cannot silently diverge between the two sites.
 */
export function shouldReverse(direction: string, iteration: number): boolean {
    return (
        direction === "reverse" ||
        (direction === "alternate-reverse" && iteration % 2 === 0) ||
        (direction === "alternate" && iteration % 2 === 1)
    );
}

/**
 * Flip the direction, adjusting `startTime` so `effectiveT` stays continuous
 * across the flip (R.W2 delegation — body carved off the class at S.B2). Before:
 * `effectiveT = reversed ? duration - t : t`; after the flip we need the SAME
 * `effectiveT`, so shift the raw clock so `t → duration - t`. The class keeps a
 * thin `reverse()` delegate; `onStart` also calls this at play-start.
 */
export function reverse<V extends Vars>(anim: KeyframesAnimation<V>): void {
    if (anim._playback.startTime !== undefined) {
        const rawT = anim._playback.t;
        const shift = anim.options.duration - 2 * rawT;
        anim._playback.startTime -= shift;
    }
    anim._playback.reversed = !anim._playback.reversed;
}
