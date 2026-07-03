/**
 * presets/spring.ts — the spring-eased preset factories (R.W1; lib-animations F6).
 *
 * Split off `classic.ts` (the cubic-bezier/keyword library): these four presets
 * reach for the in-house analytic spring via `springTimingFunction` — the same
 * solver `springLinearStops` drives, paired with its CSS `linear()` twin so a
 * WAAPI delegation runs the true overshoot on the compositor. `(response,
 * dampingFraction)` is the SwiftUI-canonical surface; the three `SPRING_*`
 * constants mirror the glass-ui `--spring-*` token presets this module's
 * factories reach for (snappy / bouncy / gentle) — the single source of truth
 * for the spring vocabulary. (S.C3a deleted the unused fourth, `SPRING_SMOOTH`
 * — zero factories referenced it; the `--spring-smooth` glass-ui token itself
 * is unaffected, this was a dead LOCAL mirror, not the token.)
 */
import { CSSKeyframesAnimation } from "../engine";
import { springTimingFunction } from "../physics/spring";
import type { InputAnimationOptions } from "../constants";

/** The three canonical iOS spring presets this module's factories use, as typed `Easing` curves. */
const SPRING_SNAPPY = { response: 0.35, dampingFraction: 0.78 } as const;
const SPRING_BOUNCY = { response: 0.5, dampingFraction: 0.5 } as const;
const SPRING_GENTLE = { response: 0.7, dampingFraction: 0.95 } as const;

const springScaleInKeyframes = /*css*/ `
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;
/**
 * Spring-eased scale-in entrance — the canonical iOS "pop" with overshoot.
 * Uses the bouncy spring (ζ 0.5) so the element settles past 1 before resting.
 */
export const springScaleIn = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 600,
        timingFunction: springTimingFunction(SPRING_BOUNCY),
        ...(options ?? {}),
    }).fromString(springScaleInKeyframes);

const springSlideInKeyframes = /*css*/ `
  0% {
    transform: translateY(40px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;
/** Spring-eased slide-up entrance — the snappy spring (ζ 0.78). */
export const springSlideIn = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 600,
        timingFunction: springTimingFunction(SPRING_SNAPPY),
        ...(options ?? {}),
    }).fromString(springSlideInKeyframes);

const springPopKeyframes = /*css*/ `
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
`;
/** Spring-eased attention "pop" — the bouncy spring drives the scale pulse. */
export const springPop = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 700,
        timingFunction: springTimingFunction(SPRING_BOUNCY),
        ...(options ?? {}),
    }).fromString(springPopKeyframes);

const springWobbleKeyframes = /*css*/ `
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(8deg);
  }
`;
/** Spring-eased wobble — gentle spring (ζ 0.95) for a soft attention nudge. */
export const springWobble = (options?: InputAnimationOptions) =>
    new CSSKeyframesAnimation({
        duration: 800,
        timingFunction: springTimingFunction(SPRING_GENTLE),
        ...(options ?? {}),
    }).fromString(springWobbleKeyframes);
