/**
 * The heavy entry seam.
 *
 * `public.ts` is the composition barrel for the `./engine` entry.  Keeping the
 * loader as a dynamic import of that same module gives the package one runtime
 * roster: a symbol can never be added to one hand-written loader list and
 * omitted from the subpath barrel.  The `typeof import()` reference is erased
 * by TypeScript, so this module remains a value.js-free light entry.
 */

// API Extractor cannot currently follow a `typeof import("./public")` node in
// a rolled-up declaration.  Keep the consumer-facing shape explicit for this
// build tool, but source every member type from the composition barrel (rather
// than from the implementation zones).  The runtime roster below is still
// exclusively `import("./public")`.
import type {
    KeyframesAnimation,
    CSSKeyframesAnimation,
    AnimationGroup,
    getAnimationId,
    getTimingFunction,
    resolveKeyframes,
    MotionPath,
    fromMotionPath,
    DrawSVG,
    fromDrawSVG,
    MorphSVG,
    fromMorphSVG,
    fromStyleSheets,
    fromLiveAnimations,
    resolveLiveKeyframes,
    adoptRunning,
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
    TriggerScene,
    createTriggerScene,
    supportsNativeTrigger,
    compileToCSS,
    compileToViewTransition,
    compileToEntry,
    validate,
    explain,
    CSSKeyframesToString,
    CSSKeyframesToStrings,
    formatCSSKeyframeString,
    transformTargetsStyle,
    yieldToMain,
} from "./public";
import type * as AnimationPresets from "./presets/index";
import type {
    AnimationOptions,
    AnimationLayerConfig,
    TimingFunction,
    TimingFunctionNames,
} from "./constants/types";
import type { Stylesheet } from "@mkbabb/value.js";

export interface AnimationEngine {
    KeyframesAnimation: typeof KeyframesAnimation;
    CSSKeyframesAnimation: typeof CSSKeyframesAnimation;
    AnimationGroup: typeof AnimationGroup;
    getAnimationId: typeof getAnimationId;
    getTimingFunction: typeof getTimingFunction;
    resolveKeyframes: typeof resolveKeyframes;
    MotionPath: typeof MotionPath;
    fromMotionPath: typeof fromMotionPath;
    DrawSVG: typeof DrawSVG;
    fromDrawSVG: typeof fromDrawSVG;
    MorphSVG: typeof MorphSVG;
    fromMorphSVG: typeof fromMorphSVG;
    presets: typeof AnimationPresets;
    DIRECTIONS: readonly AnimationOptions["direction"][];
    FILL_MODES: readonly AnimationOptions["fillMode"][];
    defaultOptions: AnimationOptions;
    defaultLayerConfig: AnimationLayerConfig;
    fromStyleSheets: typeof fromStyleSheets;
    fromLiveAnimations: typeof fromLiveAnimations;
    resolveLiveKeyframes: typeof resolveLiveKeyframes;
    adoptRunning: typeof adoptRunning;
    ScrollScene: typeof ScrollScene;
    createScrollScene: typeof createScrollScene;
    parseScrollCSS: typeof parseScrollCSS;
    parseScrollTimeline: typeof parseScrollTimeline;
    parseScrollRange: typeof parseScrollRange;
    serializeScrollOptions: typeof serializeScrollOptions;
    roundTripScrollCSS: typeof roundTripScrollCSS;
    dispatchScrollBackend: typeof dispatchScrollBackend;
    resolveRange: typeof resolveRange;
    pinCSS: typeof pinCSS;
    TriggerScene: typeof TriggerScene;
    createTriggerScene: typeof createTriggerScene;
    supportsNativeTrigger: typeof supportsNativeTrigger;
    compileToCSS: typeof compileToCSS;
    compileToViewTransition: typeof compileToViewTransition;
    compileToEntry: typeof compileToEntry;
    validate: typeof validate;
    explain: typeof explain;
    CSSKeyframesToString: typeof CSSKeyframesToString;
    CSSKeyframesToStrings: typeof CSSKeyframesToStrings;
    formatCSSKeyframeString: typeof formatCSSKeyframeString;
    transformTargetsStyle: typeof transformTargetsStyle;
    yieldToMain: typeof yieldToMain;
}

let enginePromise: Promise<AnimationEngine> | undefined;

/**
 * Resolve the heavy CSS-keyframe engine and its companion front doors.
 *
 * This is intentionally the same module used by the `./engine` package
 * subpath.  Module evaluation and the promise are both memoized, so warming
 * and an eventual consumer share one in-flight load.
 */
export const loadAnimationEngine = (): Promise<AnimationEngine> =>
    (enginePromise ??= import("./public"));

/** Start loading the heavy surface without awaiting it. */
export const warmEngine = (): void => {
    void loadAnimationEngine();
};
