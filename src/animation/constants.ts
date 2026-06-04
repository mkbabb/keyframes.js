import {
    COLOR_SPACE_RANGES,
    easeInOutCubic,
    timingFunctions,
    type ColorSpace,
    type HueInterpolationMethod,
    type InterpolatedVar,
    type ValueArray,
    type ValueUnit,
} from "@mkbabb/value.js";
export type {
    ColorSpace,
    HueInterpolationMethod,
    InterpolatedVar,
} from "@mkbabb/value.js";

export const DIRECTIONS = [
    "normal",
    "reverse",
    "alternate",
    "alternate-reverse",
] as const;

export const FILL_MODES = ["none", "forwards", "backwards", "both"] as const;

/**
 * The valid `colorSpace` values — the runtime key-set of value.js's
 * `COLOR_SPACE_RANGES`, the SAME source the `ColorSpace` type derives from
 * (`keyof typeof COLOR_SPACE_RANGES`). Drawing it from the registry keeps the
 * fail-explicit setter's accept-list from drifting from the type.
 */
export const COLOR_SPACES = Object.keys(COLOR_SPACE_RANGES) as ColorSpace[];

/**
 * The valid `hueMethod` values — the closed CSS Color 4 union
 * `HueInterpolationMethod`. value.js exposes this only as a type (no runtime
 * array), so the spec's four members are pinned here, typed against the union
 * so a drift fails to compile.
 */
export const HUE_METHODS = [
    "shorter",
    "longer",
    "increasing",
    "decreasing",
] as const satisfies readonly HueInterpolationMethod[];

export type TimingFunctionNames = keyof typeof timingFunctions;

export type Vars<T = any> = {
    [arg: string]: number | string | T;
};

export type TransformFunction<V extends Vars> = (v: V, t: number) => void;

export type TimingFunction = (t: number) => number;

/**
 * The typed easing value — a callable curve plus, when one exists, the CSS
 * easing string that reproduces it (e.g. a spring's `linear()` stops).
 *
 * Replaces the former Symbol-on-a-closure side channel: the "this closure
 * has a CSS twin" fact now flows through the type system, so wrapping or
 * binding the callable can no longer silently drop it. `waapi.ts` reads
 * `.css` to run the true curve on the compositor; everything else reads
 * `.fn`.
 */
export interface Easing {
    /** The callable curve — the hot-path interpolation function. */
    fn: TimingFunction;
    /** CSS easing string that faithfully reproduces `fn`, when one exists. */
    css?: string;
}

export interface TemplateAnimationFrame<V extends Vars> {
    id: number;
    start: ValueUnit;
    vars: V;

    transform?: TransformFunction<V>;
    timingFunction?: Easing;
}

export interface AnimationFrame<V extends Vars> {
    id: number;

    start: ValueUnit;

    ixs: {
        start: number;
        stop: number;
    };

    time: {
        start: number;
        stop: number;
    };

    flatVars: V;
    vars: V;

    interpVars: {
        [arg: string]: Array<InterpolatedVar<V>>;
    };

    /**
     * Pre-flattened array of all interpolation variables across all properties.
     * Built once during parse() to avoid Object.values().flat() allocation
     * on every interpFrames() call in the hot path.
     */
    allInterpVars: Array<InterpolatedVar<V>>;

    transform: TransformFunction<V>;

    timingFunction: Easing;
}

export type AnimationOptions = {
    duration: number;

    delay: number;

    iterationCount: number;

    direction: (typeof DIRECTIONS)[number];

    fillMode: (typeof FILL_MODES)[number];

    timingFunction: Easing;

    useWAAPI: boolean;

    /**
     * When true, honor `prefers-reduced-motion: reduce` by snapping the
     * `Animation`/`AnimationGroup` `play()` path to the final frame in a
     * single paint instead of running the rAF/WAAPI loop. SSR-safe no-op
     * off-DOM. Default false (consumers opt in).
     */
    respectReducedMotion: boolean;

    colorSpace: ColorSpace;

    hueMethod?: HueInterpolationMethod;
};

export type InputAnimationOptions = Partial<{
    duration: number | string;
    delay: number | string;

    iterationCount: number | string | "infinite" | undefined;

    direction: (typeof DIRECTIONS)[number];
    fillMode: (typeof FILL_MODES)[number];

    timingFunction:
        | TimingFunction
        | Easing
        | TimingFunctionNames
        | string
        | undefined;

    /** When true (default), eligible animations may use the Web Animations API for compositor-thread execution. Set to false to force rAF. */
    useWAAPI: boolean;

    /** When true, snap `play()` to the final frame under `prefers-reduced-motion: reduce`. Default false. */
    respectReducedMotion: boolean;

    colorSpace?: ColorSpace;

    hueMethod?: HueInterpolationMethod;
}>;

export const defaultOptions: AnimationOptions = {
    duration: 1000,
    delay: 0,
    iterationCount: 1,
    direction: "normal",
    fillMode: "forwards",
    timingFunction: { fn: easeInOutCubic },
    useWAAPI: true,
    respectReducedMotion: false,
    colorSpace: "oklab",
};

export type BlendMode = "replace" | "add" | "weighted";

export interface AnimationLayerConfig {
    /** Higher wins. Default: 0 */
    zIndex: number;
    /** 0–1 for 'weighted' blend mode. Default: 1 */
    weight: number;
    /**
     * Default: 'replace'. Defaulting on a genuinely-omitted blend mode is
     * the sanctioned contract (the fail-explicit seam throws only on
     * malformed PRESENT input, never on omission) — an unspecified layer
     * blends by replacement, the least-surprising composite.
     */
    blendMode: BlendMode;
    /** Layer toggle. Default: true */
    enabled: boolean;
    /** Optional property whitelist — only these properties will be output from this layer */
    properties?: Set<string>;
}

export const defaultLayerConfig: AnimationLayerConfig = {
    zIndex: 0,
    weight: 1,
    blendMode: "replace",
    enabled: true,
};
