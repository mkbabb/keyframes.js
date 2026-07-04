/**
 * engine/css/ — the engine's CSS-entry sub-zone (S.B2 — C-1, p01).
 *
 * The `CSSKeyframesAnimation` entry-point subclass (`css-animation.ts`) + its
 * cohesive `@keyframes`-rule metadata recovery sibling (`metadata.ts` — the
 * `@property` registry + scroll-grammar + `animation` shorthand recovery the same
 * value.js parse surfaced). Both are wholly CSS-specific; the base
 * `KeyframesAnimation` (in `../animation`) is value.js-/scroll-agnostic.
 *
 * A 1-EXPORT barrel: the public entry is `CSSKeyframesAnimation`. The `metadata`
 * helpers stay INTERNAL — `css-animation.ts` imports them DIRECTLY (`./metadata`),
 * never through this barrel — so the sub-zone's public surface is exactly the one
 * class the `engine/index.ts` barrel re-exports onward.
 */
export { CSSKeyframesAnimation } from "./css-animation";
