/**
 * compile/ — the forward + backward CSS-keyframe compile pipeline (R.W1, S.B3).
 *
 * HEAVY (value.js-bearing). FORWARD (this directory's root): `parse-flatten.ts`
 * (CSS leaves → ValueUnits) → `frame-compiler.ts` (build frames + the numeric SoA
 * plan) + `easing-registry.ts` (the synchronous `getTimingFunction` resolver) +
 * `easing-option.ts` (the heavy-surface easing-input resolver) + `selector.ts`
 * (the keyframe-selector grammar). BACKWARD (the `backward/` sub-zone, S.B3 C-2):
 * `compileToCSS` + the oklab densify + the `@keyframes` serializer — re-exported
 * here from `./backward`. `adapter.ts` (`resolveKeyframes`) is the ingest→template
 * feeder for `FrameCompiler.parse` (C-9). This barrel is the zone's single surface
 * (consumers reach it through `loadAnimationEngine`).
 *
 * S.B3 C-2 — the FORWARD re-export CEREMONY through `frame-compiler` is DEAD:
 * `resolveEasingOption` comes from `./easing-option` and `namedSelectorToFraction`
 * / `NAMED_SELECTOR_SUPERTYPE` from `./selector` DIRECTLY (their real modules),
 * not bridged through `frame-compiler`.
 */
// Forward pipeline
export { FrameCompiler } from "./frame-compiler";
export { resolveEasingOption } from "./easing-option";
export { namedSelectorToFraction, NAMED_SELECTOR_SUPERTYPE } from "./selector";
export {
    parseAndFlattenObject,
    createInterpVarValue,
    transformTargetsStyle,
} from "./parse-flatten";
export type { ParsedVarMap } from "./parse-flatten";
export { getTimingFunction } from "./easing-registry";
// Backward pipeline (the compile/backward/ sub-zone barrel)
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
    CompileInput,
} from "./backward";
export {
    CSSKeyframesToString,
    CSSKeyframesToStrings,
    formatCSSKeyframeString,
    serializeEasing,
} from "./backward";
// S.F1 VT-c — the View-Transitions emitter (compileToCSS's sibling; a
// name-keyed role spec → zero-runtime `::view-transition-*` CSS).
export { compileToViewTransition } from "./view-transition";
export type {
    VTRoleSpec,
    ViewTransitionCompileOptions,
    VTCompileRefusalReason,
    VTCompileRefusal,
    CompiledViewTransitionCSS,
} from "./view-transition";
// S.F3 EN-c — the entry/exit emitter (compileToCSS's DECLARED-ENDPOINT sibling; a
// selector-keyed spec → zero-runtime `@starting-style` + `allow-discrete` CSS).
export { compileToEntry } from "./entry";
export type {
    EntryRoleSpec,
    EntryCompileOptions,
    EntryRefusalReason,
    EntryRefusal,
    CompiledEntryCSS,
} from "./entry";
