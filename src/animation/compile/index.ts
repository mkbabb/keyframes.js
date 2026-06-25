/**
 * compile/ — the forward + backward CSS-keyframe compile pipeline (R.W1).
 *
 * HEAVY (value.js-bearing). FORWARD: `parse-flatten.ts` (CSS leaves → ValueUnits)
 * → `frame-compiler.ts` (build frames + the numeric SoA plan, folded back from
 * the retired `frame-compiler-numeric.ts`). BACKWARD: `backward.ts`
 * (`compileToCSS` — orchestration graph → zero-runtime CSS) + `backward-color.ts`
 * (oklab densify) + `format.ts` (the @keyframes serializer). `easing-registry.ts`
 * is the HEAVY synchronous `getTimingFunction` resolver. This barrel is the zone's
 * single surface (consumers reach it through `loadAnimationEngine`).
 */
// Forward pipeline
export { FrameCompiler, resolveEasingOption, namedSelectorToFraction, NAMED_SELECTOR_SUPERTYPE } from "./frame-compiler";
export {
    parseAndFlattenObject,
    createInterpVarValue,
    transformTargetsStyle,
} from "./parse-flatten";
export type { ParsedVarMap } from "./parse-flatten";
export { getTimingFunction } from "./easing-registry";
// Backward pipeline
export { compileToCSS, DEFAULT_DELTA_E_EPSILON, DEFAULT_DENSIFY_STOPS } from "./backward";
export type {
    CompileOptions,
    CompiledCSS,
    CompileRefusal,
    CompileRefusalReason,
} from "./backward";
// The input-shape type + the walkers live in the colocated `./backward-walk`.
export type { CompileInput } from "./backward-walk";
export {
    CSSKeyframesToString,
    CSSKeyframesToStrings,
    formatCSSKeyframeString,
    serializeEasing,
} from "./format";
