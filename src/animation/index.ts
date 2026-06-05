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
export { SpringProgress } from "./spring";
export type {
    SpringProgressOptions,
    SpringSubscriber,
    SpringFrameCallback,
} from "./spring";
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
    Vars,
    InterpolatedVar,
} from "./constants";
export type { ResolvedKeyframes } from "./engine";
export type { AnimationGroupEntry } from "./engine";
// The single-call front door's type surface (erased; the runtime `animate` rides
// loadAnimationEngine below, since it constructs the heavy CSSKeyframesAnimation).
export type { AnimateInput, AnimateOptions, KeyframeMap } from "./animate";
// Heavy-class TYPES stay on the static barrel (erased) so consumers keep
// `import type { Animation } from "@mkbabb/keyframes.js"` for annotations.
// The runtime constructors are reached only via `loadAnimationEngine()`.
export type { Animation, CSSKeyframesAnimation, AnimationGroup } from "./engine";

// ── HEAVY engine (value.js-bearing, dynamic) ─────────────────────────────
import type { Animation, CSSKeyframesAnimation, AnimationGroup } from "./engine";
import type { ResolvedKeyframes } from "./engine";
import type { animate as animateImpl } from "./animate";
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
    DIRECTIONS: readonly AnimationOptions["direction"][];
    FILL_MODES: readonly AnimationOptions["fillMode"][];
    defaultOptions: AnimationOptions;
    defaultLayerConfig: AnimationLayerConfig;
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
    const [engine, animateMod] = await Promise.all([
        import("./engine"),
        import("./animate"),
    ]);
    return Object.assign({ animate: animateMod.animate }, engine);
};
