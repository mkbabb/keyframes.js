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
 *     `getTimingFunction`, `resolveKeyframes`, `DIRECTIONS`, `FILL_MODES`,
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
// CSSKeyframesAnimation, getAnimationId, getTimingFunction, resolveKeyframes,
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
    parseScrollCSS,
    parseScrollTimeline,
    parseScrollRange,
    serializeScrollOptions,
    roundTripScrollCSS,
    dispatchScrollBackend,
    resolveRange,
    pinCSS,
} from "./scroll";
export type {
    ScrollSceneOptions,
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
} from "./scroll";

// ── compile — the round-trip's BACKWARD half ─────────────────────────────────
export { compileToCSS } from "./compile";
// S.F1 VT-c — the View-Transitions emitter (PAIRED with the AnimationEngine
// `compileToViewTransition` field — the proof:engine-subpath-mirror TYPE-diff).
export { compileToViewTransition } from "./compile/view-transition";
export type {
    VTRoleSpec,
    ViewTransitionCompileOptions,
    VTCompileRefusalReason,
    VTCompileRefusal,
    CompiledViewTransitionCSS,
} from "./compile/view-transition";

// ── validate — the round-trip's FORWARD half (the validation layer) ──────────
export { validate, explain } from "./validate";
export type { ValidateOptions, ValidateResult } from "./validate";

// ── L.W8 ED-3 dogfood surface — serialization / DOM-paint / yield helpers ─────
export {
    CSSKeyframesToString,
    CSSKeyframesToStrings,
    formatCSSKeyframeString,
} from "./compile/backward/format";
export { transformTargetsStyle } from "./compile/parse-flatten";
export { yieldToMain } from "./internal/scheduler";
