/**
 * keyframes.js package barrel — the value.js static/dynamic boundary.
 *
 * Two surfaces meet here:
 *
 *   LIGHT (static)  — the physics/interpolation engines. `SpringProgress`,
 *     `SmoothProgress`, `NumericAnimation`, `ElementMorph`, the `Timeline`
 *     family, and the spring-stop helpers. None of them carries a static
 *     import edge to `@mkbabb/value.js`: they read their handful of leaf
 *     helpers (rAF + clamp/lerp/scale) from `./internal/leaves`, and accept
 *     easing as a callable `TimingFunction` rather than resolving string
 *     names through value.js's registry. A consumer that imports only these
 *     never pulls value.js into its graph.
 *
 *   HEAVY (dynamic) — the CSS-keyframe parsing engine. `Animation`,
 *     `CSSKeyframesAnimation`, `AnimationGroup`, `getTimingFunction`,
 *     `resolveKeyframes`, and the animation-options constants. These
 *     genuinely need value.js (`ValueUnit`/`Color`/the CSS parser/the
 *     easing registry) and live in `./engine`, reached ONLY through
 *     `loadAnimationEngine()` — an `await import("./engine")`. The barrel
 *     holds no static edge to that module, so the heavy graph (and value.js)
 *     stays out of a light-only consumer's static import graph.
 *
 * The TYPE surface stays whole on the static barrel: `import type` is erased
 * under `verbatimModuleSyntax`, so re-exporting heavy-side types here costs
 * no runtime edge. Only runtime *values* are gated behind the dynamic accessor.
 */

// ── LIGHT engines (value.js-free, static) ────────────────────────────────
export { NumericAnimation } from "./numeric";
export type { NumericAnimationOptions, NumericFrameCallback } from "./numeric";
export { SmoothProgress } from "./smooth";
export type { SmoothProgressOptions } from "./smooth";
export { SpringProgress, reseatToSpring, probeVelocity } from "./spring";
export type {
    SpringProgressOptions,
    SpringSubscriber,
    SpringFrameCallback,
    VelocityProbe,
} from "./spring";
// K.W11 PHYS-E — the intensity-scaled reduced-motion mechanism (value.js-free
// light leaf): the ONE gate's policy type + the amplitude-scale resolver a
// consumer can read to scale its own non-spring motion under reduced motion.
export { reducedMotionScale } from "./internal/reduced-motion";
export type { ReducedMotionPolicy } from "./internal/reduced-motion";
export { springLinearStops } from "./springLinearStops";
export type { SpringLinearStopsOptions } from "./springLinearStops";
export { springTimingFunction } from "./springTimingFunction";
export type { SpringTimingFunctionOptions } from "./springTimingFunction";
export { ElementMorph } from "./morph";
export type { MorphRect, ElementMorphOptions } from "./morph";
export {
    Timeline,
    ScrollTimeline,
    ManualTimeline,
    createNativeTimeline,
} from "./timeline";
export type {
    TimelineOptions,
    ScrollTimelineOptions,
    NativeTimelineSpec,
} from "./timeline";
export { RAFPlayback } from "./playback";
export type { RAFPlaybackOptions, Tickable } from "./playback";

// ── Orchestration tier (E.W10 — value.js-free light helpers over the engines) ─
// stagger/flip/drag/decay/Sequence carry zero static value.js edge: stagger is
// a pure delay generator, flip composes ElementMorph, drag/decay ride
// SpringProgress, Sequence drives Animation.advanceTo over a master clock (the
// Animation runtime is the consumer's; Sequence holds only its type). The
// single-call `animate()` front door is HEAVY (it constructs CSSKeyframesAnimation)
// and rides loadAnimationEngine below.
export { stagger } from "./stagger";
export type { StaggerOrigin, StaggerOptions, StaggerFn } from "./stagger";
export { flip, flipShared } from "./flip";
export type { FlipOptions } from "./flip";
export { drag, Draggable, drag2D } from "./drag";
export type {
    DragOptions,
    DragAxis,
    DragSubscriber,
    Drag2DHandle,
} from "./drag";
export { decay, decayRest } from "./decay";
export type { DecayOptions, DecaySample } from "./decay";
export { Sequence } from "./sequence";
export type {
    SequencePosition,
    SequenceEntry,
    SequenceOptions,
    SequenceEvent,
    SequenceSegmentSubscriber,
    SequenceLabelSubscriber,
    SequenceSubscriber,
} from "./sequence";
// Easing construction at the boundary: `toEasing` normalizes a callable /
// typed Easing synchronously (value.js-free); `resolveEasing` resolves a
// string name through the dynamic engine boundary, fail-explicit.
export { resolveEasing, toEasing } from "./easing";
export { AnimationOptionError, UnknownEasingError } from "./internal/errors";

// ── TYPE surface (erased; no runtime edge) ───────────────────────────────
// The animation-domain types consumers should prefer over redefining their
// own. These re-export from value.js-bearing modules, but `import type` is
// stripped at build so the static barrel stays value.js-free.
export type {
    TimingFunction,
    TimingFunctionNames,
    TransformFunction,
    Easing,
    AnimationOptions,
    InputAnimationOptions,
    TemplateAnimationFrame,
    AnimationFrame,
    BlendMode,
    AnimationLayerConfig,
    WeightStepper,
    Vars,
    InterpolatedVar,
} from "./constants";
export type { ResolvedKeyframes } from "./engine";
export type { AnimationGroupEntry } from "./engine";
// The single-call front door's type surface (erased; the runtime `animate` rides
// loadAnimationEngine below, since it constructs the heavy CSSKeyframesAnimation).
export type { AnimateInput, AnimateOptions, KeyframeMap } from "./animate";
// CSS-native MotionPath (F.W12) — HEAVY (composes the engine); the runtime rides
// loadAnimationEngine below. Its option/path types are erased here.
export type { MotionPathOptions, OffsetPath } from "./motion-path";
// CSS-native DrawSVG (G.W13) — HEAVY (composes the engine); the runtime rides
// loadAnimationEngine below. Its option/target types are erased here.
export type { DrawSVGOptions, SVGDrawTarget } from "./draw-svg";
// K.W8 INGEST (FLAGGED ADDITIVE EDIT) — the round-trip pointed FORWARD at the
// live web. `fromStyleSheets`/`fromLiveAnimations`/`resolveLiveKeyframes`/
// `adoptRunning` walk the CSSOM + take over a running CSS animation; ingest.ts
// statically imports the engine + adapter (value.js-bearing), so the RUNTIME
// rides loadAnimationEngine below. ONLY its option/result TYPES are re-exported
// here (erased — no static value.js edge on the LIGHT barrel; proof:boundary
// stays green).
export type {
    IngestOptions,
    IngestResult,
    IngestedAnimation,
    AdoptRunningOptions,
    AdoptResult,
} from "./ingest";
// K.W9 SCROLL-AS-CSS (FLAGGED ADDITIVE EDIT) — HEAVY (scroll-scene.ts carries a
// static `@mkbabb/value.js` edge: it consumes the 0.13.0 scroll-grammar typed
// extractor/serializer). The runtime (`ScrollScene`, `parseScrollCSS`,
// `dispatchScrollBackend`, `pinCSS`, …) rides loadAnimationEngine below; ONLY
// its types are re-exported here (erased — no static value.js edge on the LIGHT
// barrel; proof:boundary stays green). The kf `ScrollScene` driver owns TIME;
// value.js owns the scroll VALUES.
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
} from "./scroll-scene";
export type { ScrollScene } from "./scroll-scene";
// K.W10 COMPILE (FLAGGED ADDITIVE EDIT) — the round-trip's BACKWARD half: compile
// an orchestration graph (AnimationGroup / Sequence / child list) → zero-runtime
// CSS. HEAVY (compile.ts statically imports value.js's reverseAnimationShorthand
// /sampleColorRamp + the engine), so the runtime `compileToCSS` rides
// loadAnimationEngine below; ONLY its option/result TYPES are re-exported here
// (erased — no static value.js edge on the LIGHT barrel; proof:boundary stays
// green). The compiler is the parser run BACKWARD over the SAME data model.
export type {
    CompileInput,
    CompileOptions,
    CompiledCSS,
    CompileRefusal,
    CompileRefusalReason,
} from "./compile";
// Heavy-class TYPES stay on the static barrel (erased) so consumers keep
// `import type { Animation } from "@mkbabb/keyframes.js"` for annotations.
// The runtime constructors are reached only via `loadAnimationEngine()`.
export type {
    Animation,
    CSSKeyframesAnimation,
    AnimationGroup,
} from "./engine";

// ── HEAVY engine (value.js-bearing, dynamic) ─────────────────────────────
import type {
    Animation,
    CSSKeyframesAnimation,
    AnimationGroup,
} from "./engine";
import type { ResolvedKeyframes } from "./engine";
import type { animate as animateImpl } from "./animate";
import type {
    MotionPath as MotionPathClass,
    fromMotionPath as fromMotionPathImpl,
} from "./motion-path";
import type {
    DrawSVG as DrawSVGClass,
    fromDrawSVG as fromDrawSVGImpl,
} from "./draw-svg";
// K.W8 INGEST (FLAGGED ADDITIVE EDIT) — the HEAVY ingest runtime surface, merged
// onto the engine below (ingest.ts statically imports the engine + adapter, so
// it rides the dynamic boundary, never the LIGHT static barrel).
import type {
    fromStyleSheets as fromStyleSheetsImpl,
    fromLiveAnimations as fromLiveAnimationsImpl,
    resolveLiveKeyframes as resolveLiveKeyframesImpl,
    adoptRunning as adoptRunningImpl,
} from "./ingest";
// K.W9 SCROLL-AS-CSS (FLAGGED ADDITIVE EDIT) — the HEAVY scroll-scene runtime
// surface, merged onto the engine below (scroll-scene.ts has a static value.js
// edge, so it rides the dynamic boundary, never the LIGHT static barrel).
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
} from "./scroll-scene";
// K.W10 COMPILE (FLAGGED ADDITIVE EDIT) — the HEAVY compiler runtime surface,
// merged onto the engine below (compile.ts statically imports value.js's
// reverseAnimationShorthand/sampleColorRamp + the engine, so it rides the
// dynamic boundary, never the LIGHT static barrel).
import type { compileToCSS as compileToCSSImpl } from "./compile";
import type * as AnimationPresets from "./animations";
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
    Animation: typeof Animation;
    CSSKeyframesAnimation: typeof CSSKeyframesAnimation;
    AnimationGroup: typeof AnimationGroup;
    getAnimationId: (animation: Animation | string) => string;
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
}

/**
 * The engine CORE surface — `Animation` / `CSSKeyframesAnimation` /
 * `AnimationGroup` + the timing/keyframe helpers + the option constants. This
 * is `./engine`'s own runtime exports: parse + interpolate WITHOUT the
 * ingest / compile / motion-path / draw-svg / animate / preset front doors. The
 * granular `loadEngine()` (L.W7 S3) resolves exactly this — a consumer that
 * needs only `new CSSKeyframesAnimation(opts).fromString(css)` pays for the
 * `engine` chunk alone, not the eight-chunk full surface.
 */
export interface EngineCore {
    Animation: typeof Animation;
    CSSKeyframesAnimation: typeof CSSKeyframesAnimation;
    AnimationGroup: typeof AnimationGroup;
    getAnimationId: (animation: Animation | string) => string;
    getTimingFunction: (
        timingFunction:
            | TimingFunction
            | TimingFunctionNames
            | string
            | undefined,
    ) => TimingFunction | undefined;
    resolveKeyframes: (input: string | Stylesheet) => ResolvedKeyframes;
    DIRECTIONS: readonly AnimationOptions["direction"][];
    FILL_MODES: readonly AnimationOptions["fillMode"][];
    defaultOptions: AnimationOptions;
    defaultLayerConfig: AnimationLayerConfig;
}

/**
 * The COMPILER surface (L.W7 S3 `loadCompiler()`) — the engine core PLUS the
 * round-trip's BACKWARD half, `compileToCSS`. A consumer compiling an
 * orchestration graph to zero-runtime CSS pays for `engine` + `compile`, not
 * the ingest / motion / draw / preset weight.
 */
export interface CompilerSurface extends EngineCore {
    compileToCSS: typeof compileToCSSImpl;
}

/**
 * The INGEST surface (L.W7 S3 `loadIngest()`) — the engine core PLUS the
 * forward-pointed live-web walk (`fromStyleSheets` / `fromLiveAnimations` /
 * `resolveLiveKeyframes` / `adoptRunning`) and the scroll-grammar round-trip
 * (`ScrollScene` + `parseScrollCSS` / `serializeScrollOptions` / …). A
 * consumer ingesting CSSOM / adopting a running animation / driving a scroll
 * scene pays for `engine` + `ingest` + `scroll-scene`, not the compile /
 * motion / draw / preset weight.
 */
export interface IngestSurface extends EngineCore {
    fromStyleSheets: typeof fromStyleSheetsImpl;
    fromLiveAnimations: typeof fromLiveAnimationsImpl;
    resolveLiveKeyframes: typeof resolveLiveKeyframesImpl;
    adoptRunning: typeof adoptRunningImpl;
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
}

// ── Memoized chunk imports — the dynamic boundary, deduped ────────────────
// Each `import("./…")` is memoized once (module-scope `null` → Promise) so the
// granular accessors (`loadEngine`/`loadCompiler`/`loadIngest`) and the full
// `loadAnimationEngine` share ONE in-flight Promise per chunk: a `warmEngine()`
// pre-flight that has started the engine import is reused by a later
// `loadAnimationEngine()` — no double import. The browser module cache already
// dedupes the network fetch; memoizing the Promises makes the SAME accessor
// resolve synchronously on its second call and guarantees the
// warmEngine/loadAnimationEngine "same in-flight Promise" contract (S1).
let _engineMod: Promise<typeof import("./engine")> | null = null;
let _compileMod: Promise<typeof import("./compile")> | null = null;
let _ingestMod: Promise<typeof import("./ingest")> | null = null;
let _scrollMod: Promise<typeof import("./scroll-scene")> | null = null;

const importEngine = (): Promise<typeof import("./engine")> =>
    (_engineMod ??= import("./engine"));

/**
 * Load the engine CORE (L.W7 S3) — `Animation` / `CSSKeyframesAnimation` /
 * `AnimationGroup` + the timing/keyframe helpers + the option constants, from
 * the `engine` chunk ALONE. The narrowest granular door: parse + interpolate
 * without the ingest / compile / motion / draw / animate / preset front doors.
 *
 * ```ts
 * const { CSSKeyframesAnimation } = await loadEngine();
 * const anim = new CSSKeyframesAnimation(opts).fromString(css);
 * ```
 *
 * Memoizes the engine chunk import shared with `loadAnimationEngine`, so a
 * later full-surface load reuses the in-flight engine Promise.
 */
let _engineSurface: Promise<EngineCore> | null = null;
export const loadEngine = (): Promise<EngineCore> =>
    (_engineSurface ??= importEngine());

/**
 * Load the COMPILER surface (L.W7 S3) — the engine core PLUS `compileToCSS`,
 * the round-trip's BACKWARD half (orchestration graph → zero-runtime CSS).
 * Resolves the `engine` + `compile` chunks; both are memoized, so a later
 * `loadAnimationEngine()` reuses them.
 *
 * ```ts
 * const { compileToCSS } = await loadCompiler();
 * const { css } = compileToCSS(group);
 * ```
 */
let _compilerSurface: Promise<CompilerSurface> | null = null;
export const loadCompiler = (): Promise<CompilerSurface> =>
    (_compilerSurface ??= Promise.all([
        importEngine(),
        (_compileMod ??= import("./compile")),
    ]).then(([engine, compileMod]) =>
        Object.assign({ compileToCSS: compileMod.compileToCSS }, engine),
    ));

/**
 * Load the INGEST surface (L.W7 S3) — the engine core PLUS the live-web walk
 * (`fromStyleSheets` / `fromLiveAnimations` / `resolveLiveKeyframes` /
 * `adoptRunning`) and the scroll-grammar round-trip (`ScrollScene` +
 * `parseScrollCSS` / `serializeScrollOptions` / …). Resolves the `engine` +
 * `ingest` + `scroll-scene` chunks; all are memoized, so a later
 * `loadAnimationEngine()` reuses them.
 *
 * ```ts
 * const { fromStyleSheets } = await loadIngest();
 * const { animations } = fromStyleSheets(document.styleSheets);
 * ```
 */
let _ingestSurface: Promise<IngestSurface> | null = null;
export const loadIngest = (): Promise<IngestSurface> =>
    (_ingestSurface ??= Promise.all([
        importEngine(),
        (_ingestMod ??= import("./ingest")),
        (_scrollMod ??= import("./scroll-scene")),
    ]).then(([engine, ingestMod, scrollMod]) =>
        Object.assign(
            {
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
            },
            engine,
        ),
    ));

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
        import("./motion-path"),
        import("./draw-svg"),
        // K.W8 INGEST (FLAGGED ADDITIVE) — the ingest module statically imports
        // the engine + adapter (value.js-bearing); merged here so consumers
        // reach the CSSOM walk + takeover the same way as the rest of the heavy
        // surface. Shares the memoized `_ingestMod` with `loadIngest()`.
        (_ingestMod ??= import("./ingest")),
        // K.W9 SCROLL-AS-CSS (FLAGGED ADDITIVE) — the scroll module pulls
        // value.js's scroll-grammar into the heavy chunk; merged here so
        // consumers reach it the same way as the rest of the heavy surface.
        // Shares the memoized `_scrollMod` with `loadIngest()`.
        (_scrollMod ??= import("./scroll-scene")),
        // K.W10 COMPILE (FLAGGED ADDITIVE) — the compiler statically imports
        // value.js's reverseAnimationShorthand/sampleColorRamp + the engine;
        // merged here so consumers reach the round-trip's BACKWARD half the same
        // way as the rest of the heavy surface. Shares `_compileMod` with
        // `loadCompiler()`.
        (_compileMod ??= import("./compile")),
        import("./animations"),
    ]).then(
        ([
            engine,
            animateMod,
            motionMod,
            drawMod,
            ingestMod,
            scrollMod,
            compileMod,
            presets,
        ]) =>
            Object.assign(
                {
                    animate: animateMod.animate,
                    MotionPath: motionMod.MotionPath,
                    fromMotionPath: motionMod.fromMotionPath,
                    DrawSVG: drawMod.DrawSVG,
                    fromDrawSVG: drawMod.fromDrawSVG,
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
                    presets,
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
