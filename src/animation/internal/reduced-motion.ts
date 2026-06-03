/**
 * One shared `prefers-reduced-motion` gate for the whole engine.
 *
 * Collapses the formerly hand-rolled `prefersReducedMotion()` copies (one
 * each in `numeric.ts`, `smooth.ts`, `spring.ts`) into a single SSR-safe
 * authority that EVERY surface consults — the light interpolators
 * (`SpringProgress`, `SmoothProgress`, `NumericAnimation` via `RAFPlayback`),
 * the heavy `Animation.play()` path, and `AnimationGroup.play()`. glass-ui
 * /motion fans the heavy-surface PRM posture out across the constellation
 * from this one detector.
 *
 * Value.js-free: only reads `window.matchMedia`, so importing it keeps a
 * light module's static graph value.js-free.
 */

/**
 * Feature-detect the user's `prefers-reduced-motion: reduce` preference.
 *
 * SSR-safe: returns `false` when `window` / `matchMedia` is unavailable
 * (Node, jsdom without the media query, server render), so animations
 * proceed normally off-DOM and a consumer never has to guard the call.
 */
export function prefersReducedMotion(): boolean {
    if (
        typeof window === "undefined" ||
        typeof window.matchMedia !== "function"
    ) {
        return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
