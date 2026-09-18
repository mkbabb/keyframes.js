/**
 * The heavy entry seam.
 *
 * `public.ts` is the composition barrel for the `./engine` entry.  Keeping the
 * loader as a dynamic import of that same module gives the package one runtime
 * roster: a symbol can never be added to one hand-written loader list and
 * omitted from the subpath barrel.  The `typeof import()` reference is erased
 * by TypeScript, so this module adds no eager parser/color edge to the LIGHT
 * barrel (whose only Value runtime dependency is the shared `/math` leaf).
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
    driveScrollCSS,
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
    // X.KF.W5 — the publication decision's four names (G-CSSIDENT). The roster
    // below and `public.ts` are one surface by construction; a name published
    // through the subpath but missing here would be exactly the split this
    // module's header exists to prevent.
    cssIdent,
    reverseCSSTime,
    serializeTimingFunction,
    resolveTimingFunction,
    timingFunctionEntries,
} from "./public";
import type * as AnimationPresets from "./presets/index";
import type { AnimationOptions, AnimationLayerConfig } from "./constants/types";

export interface AnimationEngine {
    KeyframesAnimation: typeof KeyframesAnimation;
    CSSKeyframesAnimation: typeof CSSKeyframesAnimation;
    AnimationGroup: typeof AnimationGroup;
    getAnimationId: typeof getAnimationId;
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
    driveScrollCSS: typeof driveScrollCSS;
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
    /** The CSS-ident normalizer — ONE derivation for every emitted name. */
    cssIdent: typeof cssIdent;
    /** ms → the CSS time literal the emitters write. */
    reverseCSSTime: typeof reverseCSSTime;
    /** A parsed timing function → its CSS literal. */
    serializeTimingFunction: typeof serializeTimingFunction;
    /** SYNCHRONOUS name→fn easing resolution (KF-ET-32). */
    resolveTimingFunction: typeof resolveTimingFunction;
    /** The registry roster behind it — `[name, fn]`, stable, not injective. */
    timingFunctionEntries: typeof timingFunctionEntries;
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
    (enginePromise ??= import("./public").catch((error: unknown) => {
        // RETRY, NOT POISON (X.KF.W5 B-17 ≡ KF-EST-17). `??=` memoized the
        // REJECTED promise too, so one failed chunk load — a deploy mid-flight,
        // a dropped connection — left the heavy surface permanently unreachable
        // for the lifetime of the mount, with the only visible surface an
        // unhandled rejection on the LCP node. The memo is dropped on failure so
        // the next call genuinely retries; the SUCCESS path is untouched, so
        // warming and an eventual consumer still share one in-flight load.
        //
        // This is not a swallow: the error is re-thrown to this caller, which
        // still sees the failure it asked about.
        enginePromise = undefined;
        throw error;
    }));

/** Start loading the heavy surface without awaiting it. */
export const warmEngine = (): void => {
    void loadAnimationEngine();
};
