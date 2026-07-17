/**
 * compile/emit/backward/ — the BACKWARD/emit core module (V.W5 LT-06).
 *
 * The round-trip's emit direction carved off the flat `emit/` zone into its own
 * module under the ONE library grammar (eponymous primary + pure barrel +
 * kind-named siblings): `backward.ts` (the `compileToCSS` orchestration graph →
 * zero-runtime CSS — eponymous primary), `walk.ts` (the input-graph walkers,
 * drops the `backward-` stutter), and `color.ts` (the oklab densify, drops the
 * stutter). This PURE barrel is the module's single cross-boundary surface — the
 * zone barrel (`../index`), the sibling `../view-transition` emitter, and the
 * color-emit tests reach it here, decoupled from the internal file layout. The
 * intra-module walkers (`walkGroup`/`walkSequence`/`walkList`) and color helpers
 * (`round`, `DensifyResult`) are consumed only by `backward.ts` and stay out of
 * the barrel (encapsulation at the barrel).
 *
 * HEAVY (value.js-bearing) — reached only via `loadAnimationEngine()`.
 */
export {
    compileToCSS,
    compileChild,
    DEFAULT_DELTA_E_EPSILON,
    DEFAULT_DENSIFY_STOPS,
} from "./backward";
export type {
    CompileOptions,
    CompiledCSS,
    CompileChildOptions,
} from "./backward";
export { cssIdent } from "./walk";
export type { CompileInput, CompileChild } from "./walk";
export { colorUnitToOklabCSS, isColorUnit, densifyColorBlock } from "./color";
