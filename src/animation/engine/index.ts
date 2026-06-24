/**
 * engine/ — the HEAVY value.js-bearing engine core barrel (R.W1/R.W2; gestalt §5).
 *
 * The bundling seam: re-exports the engine classes (the base `KeyframesAnimation`
 * from `./animation`, the CSS-parsing `CSSKeyframesAnimation` subclass carved out
 * to `./css-animation` at R.W2) PLUS the value.js-bearing companions
 * (`AnimationGroup`, `getTimingFunction`, `resolveKeyframes`, the option
 * constants) so `loadAnimationEngine()` hands consumers the whole engine in one
 * `import("./engine/index")`. Every name here transitively reaches value.js,
 * which is exactly why it sits behind the dynamic boundary.
 */
export { KeyframesAnimation, getAnimationId } from "./animation";
export { CSSKeyframesAnimation } from "./css-animation";
export { AnimationGroup } from "../group";
export type { AnimationGroupEntry } from "../group";
export { getTimingFunction } from "../compile/easing-registry";
export { resolveKeyframes } from "../adapter";
export type { ResolvedKeyframes } from "../adapter";
export {
    DIRECTIONS,
    FILL_MODES,
    defaultOptions,
    defaultLayerConfig,
} from "../constants";
