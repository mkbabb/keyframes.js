/**
 * The Easing scene's preview DATA — the sweep keyframes, the curve the scene
 * opens on and its duration — declared once and read by both the scene
 * (`useEasingDemo`) and its dock miniature (`EasingMini.vue`, KF.W13U.d2 /
 * OA-32). A light module: the dock imports it statically.
 */

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
