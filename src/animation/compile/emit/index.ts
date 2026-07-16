/**
 * compile/emit/ — the EMIT leg of the CSS-keyframe compile (S.B3, C-2; U.C8 P1).
 *
 * The round-trip's BACKWARD/emit direction: the parser run backward over the
 * SAME value.js data model, plus the two DECLARED-ENDPOINT sibling emitters that
 * share its substrate. `backward.ts` (`compileToCSS` — orchestration graph →
 * zero-runtime CSS) + `backward-walk.ts` (the input-graph walkers) +
 * `backward-color.ts` (the oklab densify) + `format.ts` (the `@keyframes`
 * serializer) form the core; `entry.ts` (`compileToEntry` —
 * `@starting-style`/`allow-discrete`) and `view-transition.ts`
 * (`compileToViewTransition` — `::view-transition-*`) are the two sibling
 * emitters, projections over the SAME `format.ts`/`serializeEasing` substrate,
 * colocated here (U.C8: the `backward/` → `emit/` rename + the two move-ins; the
 * refusal-probe de-accretion interior stays DEFERRED to U.C9).
 *
 * The FORWARD leg (`frame-compiler.ts`, `value-ast.ts`, `selector.ts`,
 * `numeric-plan.ts`, and the `easing/` sub-zone — `easing-registry.ts` +
 * `easing-option.ts`, U.C8) stays in `compile/` (root + the `easing/` FORWARD
 * sub-zone) — the real seam is FORWARD vs BACKWARD/emit (a18: zero
 * forward↔emit edges), which is why the emit leg is its own sub-zone. This
 * barrel is the sub-zone's single surface for the backward-core names; the
 * parent `compile/index.ts` re-exports those from HERE and reaches the two
 * sibling emitters at their files directly (`./emit/entry`,
 * `./emit/view-transition`).
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
} from "./backward";
export type { CompileRefusal, CompileRefusalReason } from "./refusal-probes";
// VT-b (S.F1) — the per-child compile + its selector-factory options, exposed so
// the sibling View-Transitions emitter (`./view-transition`) re-targets
// the SAME block+rule pipeline onto the `::view-transition-*` pseudos.
export { compileChild } from "./backward";
export type { CompileChildOptions } from "./backward";
export type { CompileInput, CompileChild } from "./backward-walk";
export {
    CSSKeyframesToString,
    CSSKeyframesToStrings,
    formatCSSKeyframeString,
    declaredKeyframeBodyFor,
} from "./format";
export { serializeEasing } from "./easing-serialize";
// VT-b / EN-c (S.F1/S.F3) — the CSS-ident normalizer, exposed so the sibling
// View-Transitions + entry/exit emitters derive stable pseudo/rule names.
export { cssIdent } from "./backward-walk";
// EN-c (S.F3) — the color-endpoint canonicalizer + color-leaf narrower, exposed
// so the entry/exit emitter ships `oklab()` endpoints (the perceptual-oklab
// INVERSION — native oklab interpolation, no densify).
export { colorUnitToOklabCSS, isColorUnit } from "./backward-color";
