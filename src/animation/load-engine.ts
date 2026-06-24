/**
 * The value.js static/dynamic boundary's DYNAMIC half — the memoized
 * engine-loading machinery split out of the barrel (`index.ts`).
 *
 * This module owns the `await import("./engine")` (and `./animate`,
 * `./motion-path`, `./draw-svg`, `./ingest`, `./scroll-scene`, `./compile`,
 * `./validate`, `./animations`, `./format`, `./utils`, `./internal/scheduler`)
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
import type {
    KeyframesAnimation,
    CSSKeyframesAnimation,
    AnimationGroup,
} from "./engine";
import type { ResolvedKeyframes } from "./engine";
import type { animate as animateImpl } from "./animate";
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
} from "./compile/format";
import type { transformTargetsStyle as transformTargetsStyleImpl } from "./compile/parse-flatten";
import type { yieldToMain as yieldToMainImpl } from "./internal/scheduler";
import type * as AnimationPresets from "./presets/index";
import type {
    AnimationOptions,
    AnimationLayerConfig,
    TimingFunction,
    TimingFunctionNames,
} from "./constants";
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
    /**
     * The core engine constructor (PKG-3, L.W8 §S4) — renamed from `Animation`
     * to clear the `globalThis.Animation` d.ts collision. The legacy `Animation`
     * backward-compat alias was DROPPED in 5.0.0 (Q.WE1 — NO-LEGACY).
     */
    KeyframesAnimation: typeof KeyframesAnimation;
    CSSKeyframesAnimation: typeof CSSKeyframesAnimation;
    AnimationGroup: typeof AnimationGroup;
    getAnimationId: (animation: KeyframesAnimation | string) => string;
    getTimingFunction: (
        timingFunction:
            | TimingFunction
            | TimingFunctionNames
            | string
            | undefined,
    ) => TimingFunction | undefined;
    resolveKeyframes: (input: string | Stylesheet) => ResolvedKeyframes;
    /** The single-call front door — dispatch + auto-target + auto-play. */
    animate: typeof animateImpl;
    /** CSS-native MotionPath (F.W12) — offset-distance over an author offset-path. */
    MotionPath: typeof MotionPathClass;
    fromMotionPath: typeof fromMotionPathImpl;
    /** CSS-native DrawSVG (G.W13) — stroke-dashoffset sweep over the path length. */
    DrawSVG: typeof DrawSVGClass;
    fromDrawSVG: typeof fromDrawSVGImpl;
    /**
     * MorphSVG (O.W6, the DM-3 7-tranche chronic terminal) — SVG path-shape
     * morphing over value.js's `PathGeometry`. Samples two `d` strings at
     * `samples` uniform arc-length steps, pairs the points, and interpolates the
     * `(x, y)` pairs across `t`; `MorphSVG.sampleD(t)` reads the morphed `d`.
     */
    MorphSVG: typeof MorphSVGClass;
    fromMorphSVG: typeof fromMorphSVGImpl;
    /**
     * The preset library (`fadeIn`, `bounce`, `shake`, …) — heavy (each returns
     * a `CSSKeyframesAnimation`), so it rides the dynamic boundary as a namespace
     * instead of the light static barrel: `const { presets } = await
     * loadAnimationEngine(); presets.fadeIn({ duration: 500 })` (F.W11).
     */
    presets: typeof AnimationPresets;
    DIRECTIONS: readonly AnimationOptions["direction"][];
    FILL_MODES: readonly AnimationOptions["fillMode"][];
    defaultOptions: AnimationOptions;
    defaultLayerConfig: AnimationLayerConfig;
    /**
     * K.W8 INGEST (FLAGGED ADDITIVE) — the round-trip pointed FORWARD at the
     * live web. `fromStyleSheets`/`fromLiveAnimations`/`resolveLiveKeyframes`
     * walk the CSSOM into kf `CSSKeyframesAnimation` objects (per-sheet CORS
     * `try/catch` → a `CORS_SKIP` diagnostic, never a silent drop); `adoptRunning`
     * takes over a RUNNING CSS animation mid-flight via `getAnimations()`
     * currentTime handoff (the continuity seed, NOT seed-at-zero). HEAVY (the
     * ingest needs the value.js parser) — reached only here, never the LIGHT
     * barrel. Named `adoptRunning` to disambiguate from `engine.adoptCompiled`.
     */
    fromStyleSheets: typeof fromStyleSheetsImpl;
    fromLiveAnimations: typeof fromLiveAnimationsImpl;
    resolveLiveKeyframes: typeof resolveLiveKeyframesImpl;
    adoptRunning: typeof adoptRunningImpl;
    /**
     * K.W9 SCROLL-AS-CSS (FLAGGED ADDITIVE) — the scroll-grammar round-trip
     * (`parseScrollCSS` / `serializeScrollOptions` / `roundTripScrollCSS`,
     * consuming value.js 0.13.0's typed `CSSTimelineOptions` extractor +
     * inverse serializer), the `ScrollScene` JS driver (`createScrollScene`),
     * the conservative-correct backend dispatch (`dispatchScrollBackend`), and
     * the `position:sticky` pin synthesis (`pinCSS`). HEAVY (static value.js
     * edge) — reached only here, never the LIGHT barrel.
     */
    ScrollScene: typeof ScrollSceneClass;
    createScrollScene: typeof createScrollSceneImpl;
    parseScrollCSS: typeof parseScrollCSSImpl;
    parseScrollTimeline: typeof parseScrollTimelineImpl;
    parseScrollRange: typeof parseScrollRangeImpl;
    serializeScrollOptions: typeof serializeScrollOptionsImpl;
    roundTripScrollCSS: typeof roundTripScrollCSSImpl;
    dispatchScrollBackend: typeof dispatchScrollBackendImpl;
    resolveRange: typeof resolveRangeImpl;
    pinCSS: typeof pinCSSImpl;
    /**
     * K.W10 COMPILE (FLAGGED ADDITIVE) — the round-trip's BACKWARD half:
     * `compileToCSS(group | sequence | childList)` → a ZERO-RUNTIME CSS artifact
     * (`@keyframes` + `animation-*` longhands + `animation-composition` layering
     * + `linear()` springs + materialized stagger delays + perceptual `oklab()`
     * densify) PLUS the CC-3 ineligibility report (the four named refusals —
     * `weighted` blend / custom renderers / perceptual oklab beyond densify /
     * computed-unit drift). The compiler is the parser run BACKWARD over the SAME
     * data model (`format.ts` is `keyframes.ts` run backward); a human pastes the
     * result and ships with ZERO kf bytes on the page. HEAVY (value.js-bearing) —
     * reached only here, never the LIGHT barrel.
     */
    compileToCSS: typeof compileToCSSImpl;
    /**
     * L.W6 AGENT-AUTHORING VERB (FLAGGED ADDITIVE) — the round-trip's FORWARD
     * half: the VALIDATION layer over the compile surface, the first question an
     * LLM agent asks before it suggests kf ("will this `@keyframes` block ship
     * faithfully?"). `validate(css, opts?)` is a READ-ONLY projection over three
     * already-typed channels (the adapter `diagnostics`, the compile
     * `{ eligible, refusals }`, the WAAPI `eligibility`) onto ONE agent-shaped
     * `ValidateResult` envelope an LLM branches on WITHOUT scraping a message;
     * `explain(css, opts?)` formats the SAME verdict deterministic human/LLM-
     * readable. NO new engine code — a pure JOIN over the channels L.W1/L.W2 made
     * honest. HEAVY (validate.ts imports the engine + compile + waapi) — reached
     * only here, never the LIGHT barrel.
     */
    validate: typeof validateImpl;
    explain: typeof explainImpl;
    /**
     * L.W8 S1 ED-3 DOGFOOD INVERSION (FLAGGED ADDITIVE) — the heavy
     * serialization/painting/scheduler helpers over a parsed `Animation`.
     * `CSSKeyframesToString`/`CSSKeyframesToStrings` re-serialize the parsed
     * keyframes back to CSS (the FORWARD half of `fromString`, value.js-bearing);
     * `formatCSSKeyframeString` trims one keyframe body for display;
     * `transformTargetsStyle` paints a `Vars` snapshot onto DOM targets (the
     * same painter the run loop drives); `yieldToMain` is the engine's ONE
     * INP-relief yield ladder. HEAVY (they ride the engine chunk) — reached only
     * here, never the LIGHT barrel.
     */
    CSSKeyframesToString: typeof CSSKeyframesToStringImpl;
    CSSKeyframesToStrings: typeof CSSKeyframesToStringsImpl;
    formatCSSKeyframeString: typeof formatCSSKeyframeStringImpl;
    transformTargetsStyle: typeof transformTargetsStyleImpl;
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
 * front door (`animate`, `MotionPath`/`DrawSVG`, the ingest + scroll + compile
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
 * returns the SAME in-flight Promise — no double import. The per-chunk imports
 * are themselves memoized, so the granular `loadEngine`/`loadCompiler`/
 * `loadIngest` accessors share the same in-flight chunk Promises.
 */
let _enginePromise: Promise<AnimationEngine> | null = null;
export const loadAnimationEngine = (): Promise<AnimationEngine> =>
    (_enginePromise ??= Promise.all([
        importEngine(),
        // `animate` lives in its own module (it constructs CSSKeyframesAnimation)
        // and is merged onto the engine surface so consumers reach it the same
        // way: `const { animate } = await loadAnimationEngine()`.
        import("./animate"),
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
        // parse-flatten/scheduler helpers. `compile/format`/`compile/parse-flatten`
        // are value.js-bearing and already sit on the engine chunk's static graph;
        // `internal/scheduler` is value.js-free. Merged here so a consumer reaching
        // the serialization / DOM-paint / yield helpers does so the same way as the
        // rest of the heavy surface — no new static value.js edge on the LIGHT barrel.
        import("./compile/format"),
        import("./compile/parse-flatten"),
        import("./internal/scheduler"),
    ]).then(
        ([
            engine,
            animateMod,
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
                    animate: animateMod.animate,
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
 * Fire-and-forget idle-warmer for the heavy engine (L.W7 S1, W121).
 *
 * Pre-flights `loadAnimationEngine()`'s dynamic import so the first
 * `.animate()` / `new CSSKeyframesAnimation()` call on a cold page resolves
 * against an already-in-flight (or already-resolved) Promise instead of paying
 * network + parse + compile latency inline. Call it during idle —
 * `requestIdleCallback`, `visibilitychange`, or `mouseenter` on the app shell:
 *
 * ```ts
 * requestIdleCallback(() => warmEngine());
 * ```
 *
 * Idempotent and value.js-free by construction: it shares the SAME
 * module-scope `_enginePromise` with `loadAnimationEngine()`, so a
 * `loadAnimationEngine()` after `warmEngine()` returns the same in-flight
 * Promise — no double import. It fires a DYNAMIC import only; it names no
 * static value.js specifier, so `proof:boundary` stays green.
 *
 * L.W7 S4 (MEASURE-FIRST — the `scheduler.postTask` adoption is DEFERRED, not
 * shipped). `scheduler.postTask("background", …)` would be the idiomatic home
 * for an idle warm, but the `proof:scheduler-posttask` probe only SKIPS in
 * jsdom (the API is absent there) — it has NOT positively MEASURED that the
 * `"background"` call does not degrade INP on a real engine. Per the wave's own
 * measure-first law (and inv ε — no claim without an observed oracle), warmEngine
 * stays on the PROVEN bare `void loadAnimationEngine()` path. The probe + gate are
 * ARMED: when a real-browser run (Playwright with `scheduler.postTask`) measures
 * the background dispatch safe, warmEngine adopts `postTask("background")` then —
 * a gated future change, not an unmeasured ship today.
 */
export const warmEngine = (): void => {
    void loadAnimationEngine();
};
