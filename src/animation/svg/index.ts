/**
 * svg/ — the HEAVY SVG animation factories (R.W1; lib-light F-1: these are NOT
 * light — each statically imports `CSSKeyframesAnimation` from the engine, and
 * `morph-svg.ts` also pulls value.js's `PathGeometry`). `MotionPath`
 * (offset-distance over an author offset-path), `DrawSVG` (stroke-dashoffset line
 * drawing), `MorphSVG` (path-shape morph). The barrel is the zone's single
 * surface, reached through `loadAnimationEngine()`.
 */
export { MotionPath, fromMotionPath } from "./motion-path";
export type { MotionPathOptions, OffsetPath } from "./motion-path";
export { DrawSVG, fromDrawSVG } from "./draw-svg";
export type { DrawSVGOptions, SVGDrawTarget } from "./draw-svg";
export { MorphSVG, fromMorphSVG } from "./morph-svg";
export type { MorphSVGOptions, MorphPoint } from "./morph-svg";
