/**
 * The Easing scene's preview DATA — the sweep keyframes, the curve the scene
 * opens on and its duration — declared once and read by both the scene
 * (`useEasingDemo`) and its dock miniature (`EasingMini.vue`, KF.W13U.d2 /
 * OA-32). A light module: the dock imports it statically.
 */
import { curveKeyframes, curvePlot, unitEasingFrame } from "@utils/curvePlot";
import { namedEasing } from "@utils/reference-data/timingCurveUtils";

/** The curve the scene opens on (the editor's initial `currentEasingName`). */
export const EASING_DEFAULT_NAME = "ease";

/** The preview sweep's initial duration, ms (one leg of the alternate). */
export const EASING_DEFAULT_DURATION = 1500;

/** The preview channel's options beside its duration and timing function. */
export const EASING_PREVIEW_OPTIONS = {
    iterationCount: "infinite",
    direction: "alternate",
} as const;

/** The preview's keyframes ARE the sweep: translateX 0 → 100%, the ball's rail. */
export const EASING_PREVIEW_KEYFRAMES = `@keyframes easing-preview {
    from { transform: translateX(0%); }
    to   { transform: translateX(100%); }
}`;

/**
 * X.KF.W13W.b (OA-56) — the dock miniature's plot: the scene's opening curve,
 * built by the ONE curve-to-point primitive, so the icon's stroke and its ball
 * come from the same function. The viewBox pads the unit square by the stroke's
 * own half-width (the mini's `<svg>` clips at its box).
 */
export const EASING_MINI_PLOT = curvePlot(
    namedEasing(EASING_DEFAULT_NAME),
    unitEasingFrame([-0.1, -0.1, 1.2, 1.2]),
    { samples: 32 },
);
/**
 * The miniature's motion: the plot's own vertices as keyframes, played LINEAR
 * under the preview's options (alternate, infinite) — the ball walks the drawn
 * stroke out and back; x is time, y the eased value (`curveKeyframes`).
 */
export const EASING_MINI_KEYFRAMES = curveKeyframes(EASING_MINI_PLOT, "easing-mini");
