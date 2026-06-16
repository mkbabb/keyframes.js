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
export { Timeline, ScrollTimeline, ManualTimeline, createNativeTimeline } from "./timeline";
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
export { drag, Draggable } from "./drag";
export type { DragOptions, DragAxis, DragSubscriber } from "./drag";
export { decay, decayRest } from "./decay";
export type { DecayOptions, DecaySample } from "./decay";
export { Sequence } from "./sequence";
export type {
    SequencePosition,
    SequenceEntry,
    SequenceOptions,
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
export type { Animation, CSSKeyframesAnimation, AnimationGroup } from "./engine";

// ── HEAVY engine (value.js-bearing, dynamic) ─────────────────────────────
import type { Animation, CSSKeyframesAnimation, AnimationGroup } from "./engine";
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
 * Load the heavy CSS-keyframe parsing engine — `Animation`,
 * `CSSKeyframesAnimation`, `AnimationGroup`, `getTimingFunction`,
 * `resolveKeyframes`, and the animation-options constants (`DIRECTIONS`,
 * `FILL_MODES`, `defaultOptions`, `defaultLayerConfig`).
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
 * The browser caches the dynamic module after the first load, so repeat
 * calls resolve from the module cache without a second fetch.
 */
export const loadAnimationEngine = async (): Promise<AnimationEngine> => {
    // Both pull value.js into the heavy chunk; `animate` lives in its own module
    // (it constructs CSSKeyframesAnimation) and is merged onto the engine surface
    // so consumers reach it the same way: `const { animate } = await loadAnimationEngine()`.
    const [
        engine,
        animateMod,
        motionMod,
        drawMod,
        ingestMod,
        scrollMod,
        compileMod,
        presets,
    ] = await Promise.all([
        import("./engine"),
        import("./animate"),
        import("./motion-path"),
        import("./draw-svg"),
        // K.W8 INGEST (FLAGGED ADDITIVE) — the ingest module statically imports
        // the engine + adapter (value.js-bearing); merged here so consumers
        // reach the CSSOM walk + takeover the same way as the rest of the heavy
        // surface.
        import("./ingest"),
        // K.W9 SCROLL-AS-CSS (FLAGGED ADDITIVE) — the scroll module pulls
        // value.js's scroll-grammar into the heavy chunk; merged here so
        // consumers reach it the same way as the rest of the heavy surface.
        import("./scroll-scene"),
        // K.W10 COMPILE (FLAGGED ADDITIVE) — the compiler statically imports
        // value.js's reverseAnimationShorthand/sampleColorRamp + the engine;
        // merged here so consumers reach the round-trip's BACKWARD half the same
        // way as the rest of the heavy surface.
        import("./compile"),
        import("./animations"),
    ]);
    return Object.assign(
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
    );
};
