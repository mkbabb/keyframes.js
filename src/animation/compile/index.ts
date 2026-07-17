/**
 * compile/ — the forward + backward CSS-keyframe compile pipeline (R.W1, S.B3).
 *
 * HEAVY (value.js-bearing). FORWARD (this directory's root): `value-ast.ts`
 * (authored CSS → structural slots) → `frame-compiler.ts` (build frames + the numeric SoA
 * plan) + the `easing/` sub-zone (the synchronous timing resolver +
 * `resolveEasingOption` heavy-surface input resolver, U.C8) + `selector.ts`
 * (the keyframe-selector grammar). BACKWARD/emit (the `emit/` sub-zone, S.B3 C-2;
 * U.C8 renamed `backward/` → `emit/` and moved the two sibling emitters in):
 * `compileToCSS` + the oklab densify + the `@keyframes` serializer — re-exported
 * here from `./emit`; the two declared-endpoint emitters `compileToViewTransition`
 * / `compileToEntry` re-exported from their files (`./emit/view-transition`,
 * `./emit/entry`). `adapter.ts` (`resolveKeyframes`) is the ingest→template
 * feeder for `FrameCompiler.parse` (C-9). This barrel is the zone's single surface
 * (consumers reach it through `loadAnimationEngine`).
 *
 * S.B3 C-2 — the FORWARD re-export CEREMONY through `frame-compiler` is DEAD:
 * `resolveEasingOption` comes from `./easing/option`, while
 * `namedSelectorToFraction` and `parseKeyframeSelector` come from `./selector`
 * DIRECTLY (their real modules), not bridged through `frame-compiler`.
 */
// Forward pipeline
export { FrameCompiler } from "./frame";
export { namedSelectorToFraction, parseKeyframeSelector } from "./selector";
export {
    parseAndFlattenObject,
    compileValuePair,
    transformTargetsStyle,
} from "./value";
export type { ParsedVarMap } from "./value";
// The easing sub-zone (U.C8 — the owner's named example carve): the synchronous
// The heavy-surface `resolveEasingOption` input
// resolver, re-exported here from the `compile/easing/` sub-barrel.
export { resolveEasingOption } from "./easing";
// Backward/emit pipeline (the compile/emit/ sub-zone barrel)
export {
    compileToCSS,
    DEFAULT_DELTA_E_EPSILON,
    DEFAULT_DENSIFY_STOPS,
} from "./emit";
export type {
    CompileOptions,
    CompiledCSS,
    CompileRefusal,
    CompileRefusalReason,
    CompileInput,
} from "./emit";
export {
    CSSKeyframesToString,
    CSSKeyframesToStrings,
    formatCSSKeyframeString,
    serializeEasing,
} from "./emit";
// S.F1 VT-c — the View-Transitions emitter (compileToCSS's sibling; a
// name-keyed role spec → zero-runtime `::view-transition-*` CSS). Colocated in
// emit/; reached at its file directly (never the emit/ barrel — self-cycle idiom).
export { compileToViewTransition } from "./emit/view-transition";
export type {
    VTRoleSpec,
    ViewTransitionCompileOptions,
    VTCompileRefusalReason,
    VTCompileRefusal,
    CompiledViewTransitionCSS,
} from "./emit/view-transition";
// S.F3 EN-c — the entry/exit emitter (compileToCSS's DECLARED-ENDPOINT sibling; a
// selector-keyed spec → zero-runtime `@starting-style` + `allow-discrete` CSS).
export { compileToEntry } from "./emit/entry";
export type {
    EntryRoleSpec,
    EntryCompileOptions,
    EntryRefusalReason,
    EntryRefusal,
    CompiledEntryCSS,
} from "./emit/entry";
