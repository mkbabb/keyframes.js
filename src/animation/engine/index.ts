/**
 * engine/ — the HEAVY value.js-bearing engine core barrel (R.W1; gestalt §5).
 *
 * The bundling seam: re-exports the engine classes (`animation.ts` — the R.W1
 * as-is move; the `KeyframesAnimation` + `CSSKeyframesAnimation` carve into
 * `animation.ts` + `css-animation.ts` is R.W2) PLUS the value.js-bearing
 * companions (`AnimationGroup`, `getTimingFunction`, `resolveKeyframes`, the
 * option constants) so `loadAnimationEngine()` hands consumers the whole engine
 * in one `import("./engine/index")`. Every name here transitively reaches
 * value.js, which is exactly why it sits behind the dynamic boundary.
 */
export {
    KeyframesAnimation,
    CSSKeyframesAnimation,
    getAnimationId,
} from "./animation";
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
