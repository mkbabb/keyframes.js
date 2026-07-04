/**
 * The value.js static/dynamic boundary's DYNAMIC half — the memoized
 * engine-loading machinery split out of the barrel (`index.ts`).
 *
 * This module owns the `await import("./engine")` (and `./group`,
 * `./svg/motion-path`, `./svg/draw-svg`, `./svg/morph-svg`, `./ingest`,
 * `./scroll`, `./compile`, `./validate`, `./presets`, `./compile/backward/format`,
 * `./compile/parse-flatten`, `./internal/scheduler`)
 * DYNAMIC edges — never a STATIC `@mkbabb/value.js` import. Every value.js-
 * bearing import here is `import type` (erased under `verbatimModuleSyntax`),
 * so this module carries ZERO static value.js edge: a consumer reaching the
 * accessors pays for the heavy chunks only when the returned Promise is first
 * awaited.
 *
 * The barrel re-exports the accessors + the surface interface TYPES through
 * `export { … } from "./load-engine"` / `export type { … } from "./load-engine"`,
 * so the PUBLIC surface (`docs/published-surface.md`, `proof:published-surface`)
 * is UNCHANGED. `proof:boundary` bundles each accessor by name off the barrel
 * and asserts (a) no static engine/value.js edge on the accessor entry and
 * (b) the heavy engine emits as a NON-ENTRY dynamic chunk — both hold here
 * because every heavy edge is a runtime `import("./…")`.
 */

// ── HEAVY engine TYPE surface (erased; no runtime edge) ──────────────────
import type { KeyframesAnimation, CSSKeyframesAnimation } from "./engine";
import type { ResolvedKeyframes } from "./engine";
// R.W2c — `AnimationGroup` is its own `group/` zone (no longer re-exported
// through the engine barrel); the dynamic surface composes it here so
// `loadAnimationEngine()` returns the SAME symbol set.
import type { AnimationGroup } from "./group";
import type {
    MotionPath as MotionPathClass,
    fromMotionPath as fromMotionPathImpl,
} from "./svg/motion-path";
import type {
    DrawSVG as DrawSVGClass,
    fromDrawSVG as fromDrawSVGImpl,
} from "./svg/draw-svg";
// O.W6 MORPHSVG (the DM-3 7-tranche chronic terminal) — the HEAVY path-shape
// morph runtime surface, merged onto the engine below. `morph-svg.ts` constructs
// CSSKeyframesAnimation AND imports value.js's PathGeometry (the ONE geometry
// edge it legitimately needs), so it rides the dynamic boundary, never the LIGHT
// static barrel.
import type {
    MorphSVG as MorphSVGClass,
    fromMorphSVG as fromMorphSVGImpl,
} from "./svg/morph-svg";
// K.W8 INGEST (FLAGGED ADDITIVE EDIT) — the HEAVY ingest runtime surface, merged
// onto the engine below (ingest statically imports the engine + adapter, so it
// rides the dynamic boundary, never the LIGHT static barrel).
import type {
    fromStyleSheets as fromStyleSheetsImpl,
    fromLiveAnimations as fromLiveAnimationsImpl,
    resolveLiveKeyframes as resolveLiveKeyframesImpl,
    adoptRunning as adoptRunningImpl,
} from "./ingest";
// K.W9 SCROLL-AS-CSS (FLAGGED ADDITIVE EDIT) — the HEAVY scroll runtime surface,
// merged onto the engine below (scroll/scene has a static value.js edge, so it
// rides the dynamic boundary, never the LIGHT static barrel).
import type {
    ScrollScene as ScrollSceneClass,
    createScrollScene as createScrollSceneImpl,
    parseScrollCSS as parseScrollCSSImpl,
    parseScrollTimeline as parseScrollTimelineImpl,
    parseScrollRange as parseScrollRangeImpl,
    serializeScrollOptions as serializeScrollOptionsImpl,
    roundTripScrollCSS as roundTripScrollCSSImpl,
    dispatchScrollBackend as dispatchScrollBackendImpl,
    resolveRange as resolveRangeImpl,
    pinCSS as pinCSSImpl,
    // S.F4 — the discrete `animation-trigger` lifecycle driver.
    TriggerScene as TriggerSceneClass,
    createTriggerScene as createTriggerSceneImpl,
    supportsNativeTrigger as supportsNativeTriggerImpl,
} from "./scroll";
// K.W10 COMPILE (FLAGGED ADDITIVE EDIT) — the HEAVY compiler runtime surface,
// merged onto the engine below (compile statically imports value.js's
// reverseAnimationShorthand/sampleColorRamp + the engine, so it rides the
// dynamic boundary, never the LIGHT static barrel).
import type { compileToCSS as compileToCSSImpl } from "./compile";
// L.W6 AGENT-AUTHORING VERB (FLAGGED ADDITIVE EDIT) — the HEAVY validate/explain
// runtime surface, merged onto the engine below (validate.ts statically imports
// the engine + compile + waapi, all value.js-bearing, so it rides the dynamic
// boundary, never the LIGHT static barrel).
import type {
    validate as validateImpl,
    explain as explainImpl,
} from "./validate";
// L.W8 S1 ED-3 DOGFOOD INVERSION (FLAGGED ADDITIVE) — the heavy
// serialization/painting/scheduler helpers the demo (and any round-tripping
// consumer) reaches through `loadAnimationEngine()`. `CSSKeyframesToString`/
// `CSSKeyframesToStrings`/`formatCSSKeyframeString` serialize a parsed
// `Animation` back to CSS (`format.ts`, value.js-bearing); `transformTargetsStyle`
// paints a `Vars` snapshot onto DOM targets (`utils.ts`, the same painter
// `Animation.interpFrames` drives); `yieldToMain` is the engine's ONE INP-relief
// yield ladder (`internal/scheduler.ts`, value.js-free). All ride the engine
// chunk the dynamic boundary already pulls — no new static value.js edge.
import type {
    CSSKeyframesToString as CSSKeyframesToStringImpl,
    CSSKeyframesToStrings as CSSKeyframesToStringsImpl,
    formatCSSKeyframeString as formatCSSKeyframeStringImpl,
} from "./compile/backward/format";
import type { transformTargetsStyle as transformTargetsStyleImpl } from "./compile/parse-flatten";
import type { yieldToMain as yieldToMainImpl } from "./internal/scheduler";
import type * as AnimationPresets from "./presets/index";
import type {
    AnimationOptions,
    AnimationLayerConfig,
    TimingFunction,
    TimingFunctionNames,
} from "./constants/types";
import type { Stylesheet } from "@mkbabb/value.js";

/**
 * The value.js-bearing engine surface, resolved through `loadAnimationEngine()`.
 *
 * Spelled as an explicit interface (rather than `typeof import("./engine")`)
 * because the dts roll-up — API Extractor — cannot resolve a `typeof import()`
 * type node that points at an internal module. The shape stays in lockstep
 * with `./engine`'s runtime exports.
 */
export interface AnimationEngine {
    /** The core engine base class (CSS-keyframe parsing + playback). */
    KeyframesAnimation: typeof KeyframesAnimation;
    /** The CSS-parsing `CSSKeyframesAnimation` subclass — the primary "in". */
    CSSKeyframesAnimation: typeof CSSKeyframesAnimation;
    /** Multi-animation compositor (replace/add/weighted layer blending). */
    AnimationGroup: typeof AnimationGroup;
    /** Stable string id for an animation (or string passthrough). */
    getAnimationId: (animation: KeyframesAnimation | string) => string;
    /** Easing name/literal → a typed `TimingFunction` (value.js registry). */
    getTimingFunction: (
        timingFunction:
            | TimingFunction
            | TimingFunctionNames
            | string
            | undefined,
    ) => TimingFunction | undefined;
    /** CSS `@keyframes` text/stylesheet → resolved keyframes. */
    resolveKeyframes: (input: string | Stylesheet) => ResolvedKeyframes;
    /** CSS-native MotionPath — offset-distance over an author offset-path. */
    MotionPath: typeof MotionPathClass;
    /** Construct a MotionPath sweep over a target. */
    fromMotionPath: typeof fromMotionPathImpl;
    /** CSS-native DrawSVG — stroke-dashoffset sweep over the path length. */
    DrawSVG: typeof DrawSVGClass;
    /** Construct a DrawSVG line-draw over an SVG geometry target. */
    fromDrawSVG: typeof fromDrawSVGImpl;
    /** SVG path-shape morphing over value.js's `PathGeometry`. */
    MorphSVG: typeof MorphSVGClass;
    /** Construct a MorphSVG between two `d` strings. */
    fromMorphSVG: typeof fromMorphSVGImpl;
    /** The preset library (`fadeIn`, `bounce`, `shake`, …) as a namespace. */
    presets: typeof AnimationPresets;
    /** The valid `direction` values, as a const tuple. */
    DIRECTIONS: readonly AnimationOptions["direction"][];
    /** The valid `fillMode` values, as a const tuple. */
    FILL_MODES: readonly AnimationOptions["fillMode"][];
    /** The `AnimationOptions` defaults. */
    defaultOptions: AnimationOptions;
    /** The per-layer blend-config defaults. */
    defaultLayerConfig: AnimationLayerConfig;
    /** Walk the document's stylesheets → reconstructed kf animations + CORS diagnostics. */
    fromStyleSheets: typeof fromStyleSheetsImpl;
    /** Narrow to the names currently RUNNING via `getAnimations()`. */
    fromLiveAnimations: typeof fromLiveAnimationsImpl;
    /** The lowest-level live-CSSOM walk (live analogue of `resolveKeyframes`). */
    resolveLiveKeyframes: typeof resolveLiveKeyframesImpl;
    /** Mid-flight takeover of a running CSS animation (currentTime handoff). */
    adoptRunning: typeof adoptRunningImpl;
    /** Scroll-driven animation as CSS — the JS driver over a parsed scroll grammar. */
    ScrollScene: typeof ScrollSceneClass;
    /** Construct a `ScrollScene` driver. */
    createScrollScene: typeof createScrollSceneImpl;
    /** Parse a scroll-as-CSS rule → typed scroll options. */
    parseScrollCSS: typeof parseScrollCSSImpl;
    /** Parse an `animation-timeline` value. */
    parseScrollTimeline: typeof parseScrollTimelineImpl;
    /** Parse an `animation-range` value. */
    parseScrollRange: typeof parseScrollRangeImpl;
    /** Serialize scroll options back to valid CSS. */
    serializeScrollOptions: typeof serializeScrollOptionsImpl;
    /** Round-trip scroll CSS (parse → serialize). */
    roundTripScrollCSS: typeof roundTripScrollCSSImpl;
    /** Conservative-correct scroll backend dispatch. */
    dispatchScrollBackend: typeof dispatchScrollBackendImpl;
    /** Resolve a scroll `animation-range` to concrete boundaries. */
    resolveRange: typeof resolveRangeImpl;
    /** `position:sticky` pin synthesis. */
    pinCSS: typeof pinCSSImpl;
    /** The discrete `animation-trigger` lifecycle driver (idle→active→done). */
    TriggerScene: typeof TriggerSceneClass;
    /** Construct a `TriggerScene` from a parsed trigger / scroll options. */
    createTriggerScene: typeof createTriggerSceneImpl;
    /** Feature-detect native `animation-trigger` (Chrome 145+; never UA-sniffed). */
    supportsNativeTrigger: typeof supportsNativeTriggerImpl;
    /** The round-trip's BACKWARD half: orchestration graph → zero-runtime CSS. */
    compileToCSS: typeof compileToCSSImpl;
    /** Read-only validation envelope over the compile/adapter/WAAPI channels. */
    validate: typeof validateImpl;
    /** Format the `validate` verdict as deterministic human/LLM-readable text. */
    explain: typeof explainImpl;
    /** Re-serialize parsed keyframes back to a CSS string. */
    CSSKeyframesToString: typeof CSSKeyframesToStringImpl;
    /** Re-serialize parsed keyframes back to per-rule CSS strings. */
    CSSKeyframesToStrings: typeof CSSKeyframesToStringsImpl;
    /** Trim one keyframe body for display. */
    formatCSSKeyframeString: typeof formatCSSKeyframeStringImpl;
    /** Paint a `Vars` snapshot onto DOM targets (the run-loop painter). */
    transformTargetsStyle: typeof transformTargetsStyleImpl;
    /** The engine's INP-relief yield ladder. */
    yieldToMain: typeof yieldToMainImpl;
}

// ── Memoized engine chunk import — the dynamic boundary, deduped ──────────
// The engine `import("./engine/index")` is memoized once (module-scope `null` →
// Promise) so `warmEngine()` and `loadAnimationEngine()` share ONE in-flight
// Promise: a `warmEngine()` pre-flight that has started the engine import is
// reused by a later `loadAnimationEngine()` — no double import. The browser
// module cache already dedupes the network fetch; memoizing the Promise
// guarantees the warmEngine/loadAnimationEngine "same in-flight Promise"
// contract (S1). The granular `loadEngine`/`loadCompiler`/`loadIngest`
// accessors + their surface interfaces were EXCISED (R.W1 §2f — zero real call
// sites; the demo uses only the full `loadAnimationEngine()`).
let _engineMod: Promise<typeof import("./engine/index")> | null = null;

const importEngine = (): Promise<typeof import("./engine/index")> =>
    (_engineMod ??= import("./engine/index"));

/**
 * Load the heavy CSS-keyframe parsing engine — `Animation`,
 * `CSSKeyframesAnimation`, `AnimationGroup`, `getTimingFunction`,
 * `resolveKeyframes`, and the animation-options constants (`DIRECTIONS`,
 * `FILL_MODES`, `defaultOptions`, `defaultLayerConfig`) — PLUS every heavy
 * front door (`MotionPath`/`DrawSVG`/`MorphSVG`, the ingest + scroll + compile
 * round-trip, the `presets` namespace). The FULL surface; backward-compatible.
 *
 * This is the dynamic boundary: the `import("./engine")` pulls value.js into
 * the consumer's graph only when first awaited, so a light-only consumer
 * (spring / smooth / numeric / morph / timeline) never loads it.
 *
 * ```ts
 * const { CSSKeyframesAnimation } = await loadAnimationEngine();
 * const anim = new CSSKeyframesAnimation(opts).fromString(css);
 * ```
 *
 * Memoized via a module-scope `_enginePromise` shared with `warmEngine()`
 * (L.W7 S1): a `loadAnimationEngine()` call after `warmEngine()` has started
 * returns the SAME in-flight Promise — no double import.
 */
let _enginePromise: Promise<AnimationEngine> | null = null;
export const loadAnimationEngine = (): Promise<AnimationEngine> =>
    (_enginePromise ??= Promise.all([
        importEngine(),
        // R.W2c — the `group/` compositor zone (`AnimationGroup`). Formerly
        // re-exported through the engine barrel; now its own zone import merged
        // here so the dynamic surface is UNCHANGED while the engine↔group
        // `no-cycle` ring stays broken (a zone barrel re-exports only itself).
        import("./group/index"),
        import("./svg/motion-path"),
        import("./svg/draw-svg"),
        // O.W6 MORPHSVG (the DM-3 7-tranche chronic terminal) — the morph-svg
        // module constructs CSSKeyframesAnimation AND imports value.js's
        // PathGeometry; merged here so consumers reach the path-shape morph the
        // same way as the rest of the heavy surface. Rides the dynamic boundary,
        // never the LIGHT static barrel.
        import("./svg/morph-svg"),
        // K.W8 INGEST (FLAGGED ADDITIVE) — the ingest barrel statically imports
        // the engine + adapter (value.js-bearing); merged here so consumers
        // reach the CSSOM walk + takeover the same way as the rest of the heavy
        // surface.
        import("./ingest/index"),
        // K.W9 SCROLL-AS-CSS (FLAGGED ADDITIVE) — the scroll barrel pulls
        // value.js's scroll-grammar into the heavy chunk; merged here so
        // consumers reach it the same way as the rest of the heavy surface.
        import("./scroll/index"),
        // K.W10 COMPILE (FLAGGED ADDITIVE) — the compiler statically imports
        // value.js's reverseAnimationShorthand/sampleColorRamp + the engine;
        // merged here so consumers reach the round-trip's BACKWARD half the same
        // way as the rest of the heavy surface.
        import("./compile/index"),
        // L.W6 AGENT-AUTHORING VERB (FLAGGED ADDITIVE) — validate.ts statically
        // imports the engine + compile + waapi (all value.js-bearing); merged here
        // so consumers reach the forward-half VALIDATION layer the same way as the
        // rest of the heavy surface. A pure read-only projection — no new chunk
        // dependency the engine did not already pull.
        import("./validate"),
        import("./presets/index"),
        // L.W8 S1 ED-3 DOGFOOD INVERSION (FLAGGED ADDITIVE) — the format/
        // parse-flatten/scheduler helpers. `compile/backward/format` (S.B3 C-2) /
        // `compile/parse-flatten` are value.js-bearing and already sit on the engine
        // chunk's static graph; `internal/scheduler` is value.js-free. Merged here so
        // a consumer reaching the serialization / DOM-paint / yield helpers does so
        // the same way as the rest of the heavy surface — no new static value.js edge
        // on the LIGHT barrel.
        import("./compile/backward/format"),
        import("./compile/parse-flatten"),
        import("./internal/scheduler"),
    ]).then(
        ([
            engine,
            groupMod,
            motionMod,
            drawMod,
            morphMod,
            ingestMod,
            scrollMod,
            compileMod,
            validateMod,
            presets,
            formatMod,
            utilsMod,
            schedulerMod,
        ]) =>
            Object.assign(
                {
                    AnimationGroup: groupMod.AnimationGroup,
                    MotionPath: motionMod.MotionPath,
                    fromMotionPath: motionMod.fromMotionPath,
                    DrawSVG: drawMod.DrawSVG,
                    fromDrawSVG: drawMod.fromDrawSVG,
                    MorphSVG: morphMod.MorphSVG,
                    fromMorphSVG: morphMod.fromMorphSVG,
                    fromStyleSheets: ingestMod.fromStyleSheets,
                    fromLiveAnimations: ingestMod.fromLiveAnimations,
                    resolveLiveKeyframes: ingestMod.resolveLiveKeyframes,
                    adoptRunning: ingestMod.adoptRunning,
                    ScrollScene: scrollMod.ScrollScene,
                    createScrollScene: scrollMod.createScrollScene,
                    parseScrollCSS: scrollMod.parseScrollCSS,
                    parseScrollTimeline: scrollMod.parseScrollTimeline,
                    parseScrollRange: scrollMod.parseScrollRange,
                    serializeScrollOptions: scrollMod.serializeScrollOptions,
                    roundTripScrollCSS: scrollMod.roundTripScrollCSS,
                    dispatchScrollBackend: scrollMod.dispatchScrollBackend,
                    resolveRange: scrollMod.resolveRange,
                    pinCSS: scrollMod.pinCSS,
                    TriggerScene: scrollMod.TriggerScene,
                    createTriggerScene: scrollMod.createTriggerScene,
                    supportsNativeTrigger: scrollMod.supportsNativeTrigger,
                    compileToCSS: compileMod.compileToCSS,
                    validate: validateMod.validate,
                    explain: validateMod.explain,
                    presets,
                    CSSKeyframesToString: formatMod.CSSKeyframesToString,
                    CSSKeyframesToStrings: formatMod.CSSKeyframesToStrings,
                    formatCSSKeyframeString: formatMod.formatCSSKeyframeString,
                    transformTargetsStyle: utilsMod.transformTargetsStyle,
                    yieldToMain: schedulerMod.yieldToMain,
                },
                engine,
            ),
    ));

/**
 * Fire-and-forget idle-warmer for the heavy engine. Pre-flights
 * `loadAnimationEngine()`'s dynamic import during idle (`requestIdleCallback` /
 * `visibilitychange` / `mouseenter`) so the first `new CSSKeyframesAnimation()`
 * on a cold page resolves against an already-in-flight Promise. Idempotent and
 * value.js-free — it shares the one memoized `_enginePromise` (no double import)
 * and names only a dynamic import (`proof:boundary` stays green).
 */
export const warmEngine = (): void => {
    void loadAnimationEngine();
};
