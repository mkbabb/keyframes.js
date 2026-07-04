/**
 * compile/backward/ — the BACKWARD leg of the CSS-keyframe compile (S.B3, C-2).
 *
 * The round-trip's BACKWARD direction: the parser run backward over the SAME
 * value.js data model. `backward.ts` (`compileToCSS` — orchestration graph →
 * zero-runtime CSS) + `backward-walk.ts` (the input-graph walkers) +
 * `backward-color.ts` (the oklab densify) + `format.ts` (the `@keyframes`
 * serializer). The FORWARD leg (`frame-compiler.ts`, `parse-flatten.ts`,
 * `easing-registry.ts`, `easing-option.ts`, `selector.ts`, `numeric-plan.ts`)
 * stays in `compile/` root — the real seam is FORWARD vs BACKWARD (a18: zero
 * forward↔backward edges), which is why the backward leg is its own sub-zone and
 * the two easing files stay flat. This barrel is the sub-zone's single surface;
 * the parent `compile/index.ts` re-exports the public backward names from HERE.
 *
 * HEAVY (value.js-bearing) — reached only via `loadAnimationEngine()`.
 */
export {
    compileToCSS,
    DEFAULT_DELTA_E_EPSILON,
    DEFAULT_DENSIFY_STOPS,
} from "./backward";
export type {
    CompileOptions,
    CompiledCSS,
    CompileRefusal,
    CompileRefusalReason,
} from "./backward";
export type { CompileInput } from "./backward-walk";
export {
    CSSKeyframesToString,
    CSSKeyframesToStrings,
    formatCSSKeyframeString,
    serializeEasing,
} from "./format";
