/**
 * `public.ts` — the `@mkbabb/keyframes.js/engine` subpath's COMPOSITION barrel:
 * the COMPLETE static mirror of the heavy engine surface (R.W4b). S.B2 (a17 F7)
 * HOISTED it out of `engine/` to sit BESIDE `load-engine.ts` at the
 * `src/animation` root — the two are the dynamic/static halves of the SAME `./engine`
 * heavy surface, and hoisting it makes `engine/` zone-pure BY CONSTRUCTION (no
 * cross-zone composition barrel lives inside the engine zone any more).
 *
 * The owner's question — "what's our IN to the library?" — is answered here. The
 * `./engine` subpath must expose the WHOLE heavy surface a consumer reaches
 * through `await loadAnimationEngine()` (the `AnimationEngine` keys), not just
 * the engine CORE. This barrel re-exports the full cross-zone surface so the
 * subpath's runtime keys ⊇ `loadAnimationEngine()`'s.
 *
 * WHY A ROOT BARREL (not `engine/index.ts`):
 *   `engine/index.ts` is ZONE-PURE — a zone barrel re-exports ONLY its own zone
 *   (R.W2c). Re-adding cross-zone re-exports there (`group`, `svg`, …) would
 *   re-close the engine↔group `no-cycle` ring R.W2c broke. This barrel instead
 *   is a build-entry SINK: NOTHING in `src/animation/**` imports it (the only
 *   reference is `vite.config.ts`'s `engine/index` named entry + the dts
 *   plugin), so its cross-zone edges (`public → ./svg → ./engine`,
 *   `public → ./group`) are strictly ONE-DIRECTIONAL and CANNOT be part of a
 *   cycle. That — plus S.B2's zone-purity hoist — is why the composition lives
 *   here at the root, not in the zone barrel.
 *
 * THE SURFACE — it MATCHES `load-engine.ts`'s `AnimationEngine` interface key
 * for key (the authoritative roster), so a TS/runtime consumer of the static
 * subpath gets the SAME symbols as a `loadAnimationEngine()` consumer:
 *
 *   • engine core (re-exported wholesale from the zone barrel `./engine`):
 *     `KeyframesAnimation`, `CSSKeyframesAnimation`, `getAnimationId`,
 *     `resolveKeyframes`, `DIRECTIONS`, `FILL_MODES`,
 *     `defaultOptions`, `defaultLayerConfig` (+ the `ResolvedKeyframes` type).
 *   • `AnimationGroup` (the `group/` zone).
 *   • the SVG factories `MotionPath`/`fromMotionPath`, `DrawSVG`/`fromDrawSVG`,
 *     `MorphSVG`/`fromMorphSVG` (the `svg/` zone).
 *   • the `presets` namespace (the `presets/` zone).
 *   • the ingest CSSOM walk + temporal takeover (the `ingest/` zone).
 *   • the scroll-grammar round-trip + `ScrollScene` driver (the `scroll/` zone).
 *   • the BACKWARD-half `compileToCSS` + FORWARD-half `validate`/`explain`.
 *   • the serialization / DOM-paint / yield helpers (the L.W8 dogfood surface).
 *
 * This barrel carries value.js by SPECIFIER (it is the heavy surface) — that is
 * correct and intended; `proof:boundary` guards only the LIGHT `.` barrel
 * (`index.ts`), never this subpath.
 */

// ── engine CORE (the zone barrel — wholesale) ────────────────────────────────
// `./engine` is value.js-bearing and zone-pure: KeyframesAnimation,
// CSSKeyframesAnimation, getAnimationId, resolveKeyframes,
// DIRECTIONS, FILL_MODES, defaultOptions, defaultLayerConfig + ResolvedKeyframes.
export * from "./engine";

// ── AnimationGroup (the `group/` zone) ───────────────────────────────────────
export { AnimationGroup } from "./group";
export type {
    AnimationGroupEntry,
    AnimationGroupObject,
    AnimationGroupInput,
} from "./group";

// ── the SVG factories (the `svg/` zone) ──────────────────────────────────────
export {
    MotionPath,
    fromMotionPath,
    DrawSVG,
    fromDrawSVG,
    MorphSVG,
    fromMorphSVG,
} from "./svg";
export type {
    MotionPathOptions,
    OffsetPath,
    DrawSVGOptions,
    SVGDrawTarget,
    MorphSVGOptions,
    MorphPoint,
} from "./svg";

// ── the preset catalog (the `presets/` zone) ─────────────────────────────────
// Mirrors `loadAnimationEngine()`'s `presets` namespace shape (the whole
// `presets/index` module as one namespace export).
export * as presets from "./presets";

// ── ingest — the CSSOM walk + temporal takeover (the `ingest/` zone) ──────────
export {
    fromStyleSheets,
    fromLiveAnimations,
    resolveLiveKeyframes,
    adoptRunning,
} from "./ingest";
export type {
    IngestedAnimation,
    IngestResult,
    IngestOptions,
    AdoptRunningOptions,
    AdoptResult,
} from "./ingest";

// ── scroll — the grammar round-trip + ScrollScene driver (the `scroll/` zone) ─
export {
    ScrollScene,
    createScrollScene,
    driveScrollCSS,
    parseScrollCSS,
    parseScrollTimeline,
    parseScrollRange,
    serializeScrollOptions,
    roundTripScrollCSS,
    dispatchScrollBackend,
    resolveRange,
    pinCSS,
    // S.F4 — the discrete `animation-trigger` layer (idle→active→done).
    TriggerScene,
    createTriggerScene,
    supportsNativeTrigger,
} from "./scroll";
export type {
    ScrollSceneOptions,
    ScrollDriveOptions,
    ScrollDriveTarget,
    ScrollCSSDrive,
    ScrollDispatchRequest,
    ScrollDispatch,
    ScrollBackend,
    ScrollSceneEvent,
    ScrollSceneSubscriber,
    ResolvedRange,
    SnapPoints,
    AnimationTimelineValue,
    AnimationRangeValue,
    CSSTimelineOptions,
    RangeBoundary,
    RangePhase,
    TriggerState,
    TriggerDirection,
} from "./scroll";

// ── compile — the round-trip's BACKWARD half ─────────────────────────────────
export { compileToCSS } from "./compile";

// ── X.KF.W5 THE PUBLICATION DECISION (§Sequencing S-3, gate G-CSSIDENT) ───────
// ONE ruling over THREE library names + the easing registry. Each was a real
// library capability with NO published door, so every consumer hand-rolled or
// deep-reached for it — and the demo's three-names-for-one-animation defect
// (N-8: `keyframes-style-square-Transform` / `@keyframes square-transform` /
// `@keyframes Transform`) is downstream of exactly that: the library owns the
// single CSS-ident normalizer, applies it on Export only, and did not publish
// it, "which is WHY the demo hand-rolls `.replace().toLowerCase()`".
//
//   • `cssIdent` — THE ident normalizer. It reached no published entry: it was
//     re-exported along a two-site INTERNAL chain (`backward/walk.ts` decl →
//     `backward/index.ts` → `compile/emit/index.ts`) and was absent from
//     `index.ts`, `public.ts` and `load-engine.ts` alike.
//   • `reverseCSSTime` · `serializeTimingFunction` — the two CSS-text
//     serializers the demo reaches by deep `@src/` path (C-8). Published, not
//     relocated: they stay in `compile/emit/css-text.ts`, which this wave does
//     not edit, and ride out through the emit sub-zone barrel.
//   • the EASING REGISTRY (KF-ET-32) — the library exposed no SYNCHRONOUS
//     name→fn surface at all (`resolveEasing` is async, on the LIGHT barrel),
//     so a consumer needing one at hand had nothing to import. The resolver and
//     the name roster are published off the heavy surface, where the registry
//     already lives.
//
// HEAVY surface only, deliberately: every one of these carries value.js by
// specifier, and the LIGHT `.` barrel's value.js-free boundary (`proof:boundary`)
// is not spent on a convenience re-export.
export { cssIdent, reverseCSSTime, serializeTimingFunction } from "./compile/emit";
export {
    resolveTimingFunction,
    timingFunctionEntries,
} from "./compile/easing/registry";
// S.F1 VT-c — the View-Transitions emitter (PAIRED with the AnimationEngine
// `compileToViewTransition` field — the proof:engine-subpath-mirror TYPE-diff).
export { compileToViewTransition } from "./compile/emit/view-transition";
export type {
    VTRoleSpec,
    ViewTransitionCompileOptions,
    VTCompileRefusalReason,
    VTCompileRefusal,
    CompiledViewTransitionCSS,
} from "./compile/emit/view-transition";
// S.F3 EN-c — the entry/exit emitter (PAIRED with the AnimationEngine
// `compileToEntry` field — the proof:engine-subpath-mirror TYPE-diff).
export { compileToEntry } from "./compile/emit/entry";
export type {
    EntryRoleSpec,
    EntryCompileOptions,
    EntryRefusalReason,
    EntryRefusal,
    CompiledEntryCSS,
} from "./compile/emit/entry";

// ── validate — the round-trip's FORWARD half (the validation layer) ──────────
export { validate, explain } from "./validate";
export type { ValidateOptions, ValidateResult } from "./validate";

// ── L.W8 ED-3 dogfood surface — serialization / DOM-paint / yield helpers ─────
export {
    CSSKeyframesToString,
    CSSKeyframesToStrings,
    formatCSSKeyframeString,
} from "./compile/emit/format";
export { transformTargetsStyle } from "./compile/value";
export { yieldToMain } from "./internal/scheduler";
