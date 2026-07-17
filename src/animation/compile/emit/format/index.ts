/**
 * compile/emit/format/ — the `@keyframes` serializer module (V.W5 LT-06).
 *
 * The format pair carved off the flat `emit/` zone under the ONE library grammar
 * (eponymous primary + pure barrel + kind-named siblings): `format.ts` (the
 * keyframe-body projection + `@keyframes` block builders — eponymous primary)
 * and `options.ts` (the `animation-*` longhand / shorthand / composition /
 * `@property` re-serialize — drops the `format-` stutter).
 *
 * This PURE barrel is the module's single cross-boundary surface. FENCE B: the
 * frozen `./engine` re-export at `public.ts:171` imports
 * `CSSKeyframesToString`/`CSSKeyframesToStrings`/`formatCSSKeyframeString` from
 * `./compile/emit/format` — which now resolves HERE; the barrel re-exports those
 * three so the `./engine` bytes are byte-unchanged. The zone barrel (`../index`)
 * + the sibling `../view-transition` emitter + the sibling `backward/backward.ts`
 * (the keyframe/options block builders it composes) + the format tests reach the
 * surface here. `propertyRegistryToString` + `PremultiplyResult` are intra-module
 * and stay out of the barrel (encapsulation at the barrel).
 *
 * HEAVY (value.js-bearing) — reached only via `loadAnimationEngine()`.
 */
export {
    CSSKeyframesToString,
    CSSKeyframesToStrings,
    formatCSSKeyframeString,
    declaredKeyframeBodyFor,
    keyframesBlock,
    premultipliedKeyframesBlock,
} from "./format";
export {
    animationOptionsToString,
    animationComposition,
    animationShorthand,
} from "./options";
