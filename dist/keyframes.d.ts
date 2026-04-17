import { bezierPresets } from '@mkbabb/value.js';
import { bounceInEase } from '@mkbabb/value.js';
import { bounceInEaseHalf } from '@mkbabb/value.js';
import { bounceInOutEase } from '@mkbabb/value.js';
import { bounceOutEase } from '@mkbabb/value.js';
import { bounceOutEaseHalf } from '@mkbabb/value.js';
import { cancelAnimationFrame as cancelAnimationFrame_2 } from '@mkbabb/value.js';
import { clamp } from '@mkbabb/value.js';
import { CSSCubicBezier } from '@mkbabb/value.js';
import { cubicBezier } from '@mkbabb/value.js';
import { cubicBezierToString } from '@mkbabb/value.js';
import { cubicBezierToSVG } from '@mkbabb/value.js';
import { deCasteljau } from '@mkbabb/value.js';
import { easeInBounce } from '@mkbabb/value.js';
import { easeInCirc } from '@mkbabb/value.js';
import { easeInCubic } from '@mkbabb/value.js';
import { easeInExpo } from '@mkbabb/value.js';
import { easeInOutCirc } from '@mkbabb/value.js';
import { easeInOutCubic } from '@mkbabb/value.js';
import { easeInOutExpo } from '@mkbabb/value.js';
import { easeInOutQuad } from '@mkbabb/value.js';
import { easeInOutSine } from '@mkbabb/value.js';
import { easeInQuad } from '@mkbabb/value.js';
import { easeInSine } from '@mkbabb/value.js';
import { easeOutCirc } from '@mkbabb/value.js';
import { easeOutCubic } from '@mkbabb/value.js';
import { easeOutExpo } from '@mkbabb/value.js';
import { easeOutQuad } from '@mkbabb/value.js';
import { easeOutSine } from '@mkbabb/value.js';
import { HueInterpolationMethod } from '@mkbabb/value.js';
import { interpBezier } from '@mkbabb/value.js';
import { InterpolatedVar } from '@mkbabb/value.js';
import { jumpTerms } from '@mkbabb/value.js';
import { lerp } from '@mkbabb/value.js';
import { linear } from '@mkbabb/value.js';
import { logerp } from '@mkbabb/value.js';
import { parseCSSPercent } from '@mkbabb/value.js';
import { parseCSSStylesheet } from '@mkbabb/value.js';
import { parseCSSTime } from '@mkbabb/value.js';
import { PropertyDescriptor as PropertyDescriptor_2 } from '@mkbabb/value.js';
import { requestAnimationFrame as requestAnimationFrame_2 } from '@mkbabb/value.js';
import { scale } from '@mkbabb/value.js';
import { sleep } from '@mkbabb/value.js';
import { smoothStep3 } from '@mkbabb/value.js';
import { stepEnd } from '@mkbabb/value.js';
import { steppedEase } from '@mkbabb/value.js';
import { stepStart } from '@mkbabb/value.js';
import { Stylesheet } from '@mkbabb/value.js';
import { timingFunctionDescriptions } from '@mkbabb/value.js';
import { timingFunctions } from '@mkbabb/value.js';
import { ValueArray } from '@mkbabb/value.js';
import { ValueUnit } from '@mkbabb/value.js';

declare class Animation_2<V extends Vars = any> {
    id: number;
    name: string | undefined;
    superKey: string | undefined;
    targets: HTMLElement[];
    options: AnimationOptions;
    templateFrames: TemplateAnimationFrame<V>[];
    parsedVars: ParsedVarMap[];
    frameId: number;
    frames: AnimationFrame<V>[];
    handleId: number | any;
    startTime: number | undefined;
    pausedTime: number;
    t: number;
    iteration: number;
    started: boolean;
    done: boolean;
    reversed: boolean;
    paused: boolean;
    /**
     * True when an `AnimationGroup` is driving this animation's
     * `tick()` and `interpFrames()` from its own rAF loop. Set by
     * the group at construction; standalone `.play()` / `.draw()`
     * throw when this is true rather than racing the group.
     */
    managed: boolean;
    /**
     * If the most recent `play()` was rejected by WAAPI eligibility
     * but `useWAAPI: true` was requested, this records the reason.
     * Queryable by debug builds — no console output is produced.
     */
    waapiIneligibleReason: string | undefined;
    unflatten: boolean;
    private resolvePromise;
    private _playingPromise;
    /**
     * Pre-bound draw callback — allocated once to avoid creating a new
     * closure on every requestAnimationFrame reschedule.
     */
    private _boundDraw;
    private dispatchAnimationEvent;
    constructor(options?: Partial<InputAnimationOptions>, targets?: HTMLElement[] | HTMLElement | undefined, name?: string | undefined, superKey?: string | undefined);
    convertFrameStart(frame: TemplateAnimationFrame<V>): TemplateAnimationFrame<V>;
    addFrame<K extends V>(start: number | string | ValueUnit<number>, vars: Partial<K>, transform?: TransformFunction<K>, timingFunction?: TimingFunction | TimingFunctionNames): Animation_2<K>;
    createFrame(startIx: number, endIx: number): AnimationFrame<V>;
    /**
     * Build an index mapping each variable name to the frame indices where
     * it appears. Used by reconcileVars() for O(1) "next occurrence" lookups
     * instead of O(N) findIndex scans per variable.
     */
    private buildVarIndex;
    /**
     * Reconcile interpolation variables across non-adjacent keyframes.
     * For each variable at frame `ix`, find the next frame that also
     * defines that variable and create an interpolation segment between them.
     *
     * Uses a pre-built variable index (from buildVarIndex) to avoid
     * O(frames²) findIndex scans.
     */
    reconcileVars(ix: number, varIndex: Map<string, number[]>): void;
    parse(): this;
    setTimingFunction(timingFunction: InputAnimationOptions["timingFunction"]): this;
    setIterationCount(iterationCount: InputAnimationOptions["iterationCount"]): this;
    setDuration(duration: InputAnimationOptions["duration"]): this;
    setDelay(delay: InputAnimationOptions["delay"]): this;
    setDirection(direction: InputAnimationOptions["direction"]): this;
    setFillMode(fillMode: InputAnimationOptions["fillMode"]): this;
    setUseWAAPI(useWAAPI: InputAnimationOptions["useWAAPI"]): this;
    setColorSpace(colorSpace: InputAnimationOptions["colorSpace"]): this;
    setHueMethod(hueMethod: InputAnimationOptions["hueMethod"]): this;
    setOptions(options: Partial<InputAnimationOptions>): this;
    reverse(): this;
    fillForwards(): void;
    fillBackwards(): void;
    /**
     * Stateless progress query. Maps [0,1] from first keyframe to last,
     * regardless of playback direction. `apply=true` invokes transform callbacks.
     */
    at(progress: number, apply?: boolean): Record<string, ValueUnit[]>;
    /**
     * Interpolate all active frames at time `t`. This is the hot path —
     * called once per rAF frame during playback.
     *
     * Uses binary search (O(log N)) to find the first matching frame,
     * then scans neighbors to collect all overlapping frames at `t`
     * (multiple properties may share the same time range).
     *
     * @param t - Current animation time in milliseconds
     * @param transformFrames - If true, applies each frame's transform function to targets
     * @returns Merged flat vars from all active frames
     */
    interpFrames(t: number, transformFrames?: boolean): Record<string, ValueUnit<any, string | undefined>[]>;
    onStart(): Promise<void>;
    onEnd(): Promise<void>;
    tick(t: number): Promise<number>;
    draw(t: number): Promise<void>;
    /** Internal rAF-based play loop. */
    private _playRAF;
    /**
     * Play via the Web Animations API. WAAPI handles visuals on the
     * compositor thread; a shadow rAF loop in `playWAAPI` drives
     * `tick()` so events, iteration count, pause/resume, and other
     * lifecycle state stay coherent with the rAF path.
     *
     * No silent fallback — eligibility is decided once in `play()`
     * before this is invoked, and runtime errors propagate.
     */
    private _playWAAPI;
    play(): Promise<void>;
    pause(draw?: boolean): this;
    resume(): this;
    stop(): void;
    playing(): boolean;
    /** Returns the effective time accounting for direction reversal. */
    get effectiveT(): number;
    reset(): this;
    setTargets(...targets: HTMLElement[]): this;
    group(...animations: Animation_2<V>[]): AnimationGroup<V>;
}
export { Animation_2 as Animation }

export declare interface AnimationFrame<V extends Vars> {
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
    timingFunction: TimingFunction;
}

export declare class AnimationGroup<V extends Vars> {
    animations: AnimationGroupObject<V>;
    transform: TransformFunction<V>;
    superKey: string | undefined;
    paused: boolean;
    started: boolean;
    done: boolean;
    singleTarget: boolean;
    lastTickTime: number;
    handleId: number | any;
    resolvePromise: ((value: void | PromiseLike<void>) => void) | null;
    /**
     * Pre-bound draw callback — allocated once in constructor to avoid
     * creating a new closure on every requestAnimationFrame reschedule.
     */
    private _boundDraw;
    /**
     * Cached entries array, sorted by layer zIndex. Rebuilt on demand
     * via dirty flag to avoid Object.values() allocation on every frame.
     */
    private _entries;
    private _entriesDirty;
    constructor(...inputs: (Animation_2<V> | AnimationGroupInput<V>)[]);
    /**
     * Returns the animation entries sorted by layer zIndex.
     * Uses dirty-flag caching — only rebuilds when the animations object
     * or layer configs are mutated. All hot-path iteration (tick, draw,
     * transformFramesGrouped) uses this instead of Object.values().
     */
    private getEntries;
    /** Mark entries cache stale. Called at all mutation boundaries. */
    private invalidateEntries;
    setSuperKey(superKey: string): this;
    setTargets(...targets: HTMLElement[]): this;
    onStart(): this;
    onEnd(): this;
    /**
     * Composite all animation values into a single grouped transform.
     * Called per-frame for single-target groups. Applies layer blending
     * (replace / add / weighted) in zIndex order, then calls the group
     * transform function with the merged values.
     */
    transformFramesGrouped(t: number): Record<string, unknown>;
    /**
     * Render the current animation state as a static frame.
     * Called on pause to ensure the visual matches the exact pause moment.
     * Handles both single-target (grouped blending) and multi-target
     * (per-child interpFrames) paths.
     */
    private renderPauseFrame;
    /**
     * Advance all child animations to timestamp `t`.
     * Awaits all child tick() promises so deferred state updates
     * (startTime, this.t) resolve before interpFrames reads them.
     */
    tick(t: number): Promise<this>;
    /**
     * Main animation frame callback. Ticks all children, then renders
     * (single-target: grouped blending; multi-target: per-child).
     * Reschedules itself via rAF until done.
     */
    draw(t: number): Promise<void>;
    /**
     * Start the animation group. Returns a promise that resolves
     * when all child animations complete (or on explicit stop/reset).
     */
    play(): Promise<unknown>;
    /**
     * Toggle pause state. Calling pause() when playing pauses; calling
     * pause() when paused resumes. (Toggle semantics preserved for
     * backward compatibility with demo's toggleAnimationGroup.)
     *
     * On pause: explicitly cancels the rAF loop and renders a final
     * frame snapshot so the visual matches the exact pause moment.
     * On resume: re-registers the rAF loop.
     */
    pause(): this;
    reset(): this;
    stop(): this;
    playing(): boolean;
    forcePause(): void;
    forcePlay(): void;
    /**
     * Set layer config for an animation by name or reference.
     * Chainable. Throws when the key doesn't match a registered
     * animation — silent no-ops were hiding consumer bugs.
     */
    setLayerConfig(nameOrAnim: string | Animation_2<V>, config: Partial<AnimationLayerConfig>): this;
    /** Convenience toggle for enabling/disabling a layer. Chainable. */
    setLayerEnabled(nameOrAnim: string | Animation_2<V>, enabled: boolean): this;
    /** Read the layer config for an animation. */
    getLayerConfig(nameOrAnim: string | Animation_2<V>): AnimationLayerConfig | undefined;
}

declare interface AnimationGroupEntry<V extends Vars> {
    animation: Animation_2<V>;
    values: Record<string, unknown>;
    layer: AnimationLayerConfig;
}

/** Input type for AnimationGroup constructor — bare Animation or Animation with layer config. */
declare type AnimationGroupInput<V extends Vars> = Animation_2<V> | {
    animation: Animation_2<V>;
    layer?: Partial<AnimationLayerConfig>;
};

declare interface AnimationGroupObject<V extends Vars> {
    [key: string]: AnimationGroupEntry<V>;
}

export declare interface AnimationLayerConfig {
    /** Higher wins. Default: 0 */
    zIndex: number;
    /** 0–1 for 'weighted' blend mode. Default: 1 */
    weight: number;
    /** Default: 'replace' (backward compat) */
    blendMode: BlendMode;
    /** Layer toggle. Default: true */
    enabled: boolean;
    /** Optional property whitelist — only these properties will be output from this layer */
    properties?: Set<string>;
}

export declare type AnimationOptions = {
    duration: number;
    delay: number;
    iterationCount: number;
    direction: (typeof DIRECTIONS)[number];
    fillMode: (typeof FILL_MODES)[number];
    timingFunction: TimingFunction;
    useWAAPI: boolean;
    colorSpace: string;
    hueMethod?: HueInterpolationMethod;
};

export { bezierPresets }

export declare type BlendMode = "replace" | "add" | "weighted";

export { bounceInEase }

export { bounceInEaseHalf }

export { bounceInOutEase }

export { bounceOutEase }

export { bounceOutEaseHalf }

export { cancelAnimationFrame_2 as cancelAnimationFrame }

export { clamp }

export { CSSCubicBezier }

export declare class CSSKeyframesAnimation<V extends Vars> extends Animation_2<V> {
    constructor(options?: Partial<InputAnimationOptions>, ...targets: HTMLElement[]);
    fromVars(vars: V[], transform?: TransformFunction<V>): this;
    fromKeyframes(keyframes: Map<string, Partial<V>> | Record<string, Partial<V>>, transform?: TransformFunction<V>): this;
    /**
     * Property registry from `@property` declarations parsed by
     * `fromString`. Empty when the input had no `@property` rules.
     * Consumers can read this to recover the type metadata for
     * custom properties (syntax string, initial value, inheritance
     * flag) without re-parsing the source CSS.
     */
    propertyRegistry: Map<string, PropertyDescriptor_2>;
    fromString(keyframes: string, transform?: TransformFunction<V>): this;
    transform(vars: V): void;
}

export { cubicBezier }

export { cubicBezierToString }

export { cubicBezierToSVG }

export { deCasteljau }

export declare const defaultLayerConfig: AnimationLayerConfig;

export declare const defaultOptions: AnimationOptions;

export declare const DIRECTIONS: readonly ["normal", "reverse", "alternate", "alternate-reverse"];

export { easeInBounce }

export { easeInCirc }

export { easeInCubic }

export { easeInExpo }

export { easeInOutCirc }

export { easeInOutCubic }

export { easeInOutExpo }

export { easeInOutQuad }

export { easeInOutSine }

export { easeInQuad }

export { easeInSine }

export { easeOutCirc }

export { easeOutCubic }

export { easeOutExpo }

export { easeOutQuad }

export { easeOutSine }

/**
 * Interpolate position and scale between two elements or rects.
 *
 * Two usage modes:
 * - **Stateless**: call `.at(progress)` or `.toCSSTransform(progress)`
 * - **Managed**: call `.play(element)` to animate an element from source
 *   to destination over the configured duration
 */
export declare class ElementMorph {
    private animation;
    private transformOrigin;
    private timingFunction;
    private duration;
    constructor(from: HTMLElement | MorphRect, to: HTMLElement | MorphRect, options?: ElementMorphOptions);
    /** Re-measure source and destination, rebuilding the internal animation. */
    measure(from: HTMLElement | MorphRect, to: HTMLElement | MorphRect): this;
    /** Get raw transform values at the given progress [0, 1]. */
    at(progress: number): MorphValues;
    /** Get a CSS transform string at the given progress [0, 1]. */
    toCSSTransform(progress: number): string;
    /** Apply the morph transform to an element at the given progress [0, 1]. */
    apply(element: HTMLElement, progress: number): void;
    /**
     * Animate an element from source to destination over the configured duration.
     *
     * @param element — the element to apply transforms to
     * @param duration — override the duration set in constructor options (ms)
     */
    play(element: HTMLElement, duration?: number): Promise<void>;
    /** Cancel a running `.play()` animation. */
    stop(): void;
}

export declare interface ElementMorphOptions {
    timingFunction?: TimingFunction | TimingFunctionNames;
    /** Playback duration in milliseconds. Required for `.play()`. */
    duration?: number;
    transformOrigin?: string;
}

export declare const FILL_MODES: readonly ["none", "forwards", "backwards", "both"];

export declare const getAnimationId: (animation: Animation_2 | string) => string;

/**
 * Resolve a timing-function input to a callable `TimingFunction`.
 *
 * Accepts:
 *   - a `TimingFunction` — returned as-is
 *   - a named entry in `timingFunctions` (`ease-out-cubic`,
 *     `easeOutCubic`, `linear`, etc.) — looked up in the registry
 *   - a CSS `cubic-bezier(x1, y1, x2, y2)` literal string —
 *     parsed to control points and resolved via `CSSCubicBezier`
 *   - `undefined` or a name/literal the registry can't find —
 *     returns `undefined` so callers can fall back to their
 *     default (usually `easeInOutCubic`)
 *
 * Higher-arity factory entries (`steps`, `step-start`, `step-end`)
 * live in the registry but require construction arguments; they
 * return `undefined` here so callers can invoke them explicitly.
 */
export declare const getTimingFunction: (timingFunction: TimingFunction | TimingFunctionNames | string | undefined) => TimingFunction | undefined;

export declare type InputAnimationOptions = Partial<{
    duration: number | string;
    delay: number | string;
    iterationCount: number | string | "infinite" | undefined;
    direction: (typeof DIRECTIONS)[number];
    fillMode: (typeof FILL_MODES)[number];
    timingFunction: TimingFunction | TimingFunctionNames | undefined;
    /** When true (default), eligible animations may use the Web Animations API for compositor-thread execution. Set to false to force rAF. */
    useWAAPI: boolean;
    colorSpace?: string;
    hueMethod?: HueInterpolationMethod;
}>;

export { interpBezier }

export { InterpolatedVar }

export { jumpTerms }

export { lerp }

export { linear }

export { logerp }

export declare class ManualTimeline extends Timeline {
    private value;
    constructor(options?: TimelineOptions);
    /** Set the raw progress value. */
    set(value: number): void;
    protected sample(): number;
}

export declare interface MorphRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

declare interface MorphValues {
    [key: string]: number;
    translateX: number;
    translateY: number;
    scaleX: number;
    scaleY: number;
}

/**
 * Zero-allocation numeric keyframe interpolator.
 *
 * Interpolates plain `Record<string, number>` keyframes using O(log N)
 * binary-search segment lookup. Designed for canvas/WebGL render loops
 * where CSS value parsing and DOM targets are unnecessary overhead.
 *
 * Two usage modes:
 * - **Stateless**: call `.at(progress)` from your own render loop
 * - **Managed**: call `.play(onFrame?)` to run a rAF-driven playback
 *   that resolves when the animation completes
 */
export declare class NumericAnimation<T extends Record<string, number>> {
    private keyframes;
    private segments;
    private positions;
    private timingFn;
    private result;
    private _duration;
    private _playback;
    constructor(keyframes: T[], options?: NumericAnimationOptions);
    private buildSegments;
    private buildSegment;
    /**
     * Map [0, 1] progress to interpolated values. Zero allocation —
     * returns the same pre-allocated result object on every call.
     *
     * Uses O(log N) binary search over segments. Falls back to the
     * last segment if progress is past the final stop position.
     */
    at(progress: number): T;
    /** Update a keyframe's values in-place, recomputing adjacent segments. */
    updateKeyframe(index: number, values: Partial<T>): this;
    /**
     * Play the animation over its duration using requestAnimationFrame.
     *
     * Calls `onFrame` each frame with the interpolated values (the same
     * zero-allocation object returned by `.at()`). Returns a Promise that
     * resolves when the animation completes or is stopped.
     *
     * @param onFrame — optional per-frame callback receiving interpolated values
     * @param duration — override the duration set in constructor options (ms)
     */
    play(onFrame?: NumericFrameCallback<T>, duration?: number): Promise<void>;
    /** Cancel a running `.play()` animation. The play promise resolves immediately. */
    stop(): void;
}

export declare interface NumericAnimationOptions {
    timingFunction?: TimingFunction | TimingFunctionNames | undefined;
    /** Playback duration in milliseconds. Required for `.play()`. */
    duration?: number | undefined;
    /** Explicit positions as percentages [0-100]. Auto-distributes if omitted. */
    positions?: number[] | undefined;
}

/** Callback invoked each frame during `.play()` with the interpolated values. */
export declare type NumericFrameCallback<T extends Record<string, number>> = (values: T) => void;

export { parseCSSPercent }

export { parseCSSStylesheet }

export { parseCSSTime }

declare type ParsedVarMap = Record<string, ValueArray>;

export { PropertyDescriptor_2 as PropertyDescriptor }

export { requestAnimationFrame_2 as requestAnimationFrame }

export { scale }

export declare class ScrollTimeline extends Timeline {
    private threshold;
    private getScrollY;
    private getViewportHeight;
    constructor(options?: ScrollTimelineOptions);
    protected sample(): number;
}

export declare interface ScrollTimelineOptions extends TimelineOptions {
    /** Viewport fraction for full progress. Default 0.35. */
    threshold?: number | undefined;
    /** Custom scroll position supplier. Default: window.scrollY. */
    getScrollY?: (() => number) | undefined;
    /** Custom viewport height supplier. Default: window.innerHeight. */
    getViewportHeight?: (() => number) | undefined;
}

export { sleep }

export declare class SmoothProgress {
    private options;
    private targetValue;
    private currentValue;
    private isSettled;
    constructor(options?: Partial<SmoothProgressOptions>);
    get target(): number;
    get current(): number;
    get settled(): boolean;
    setTarget(target: number): void;
    /** Advance one step using fixed damping. Returns current value. */
    tick(): number;
    /** Frame-rate independent tick. dt is in milliseconds. */
    tickDt(dt: number): number;
    /** Immediately set current = target. */
    snap(): void;
    /** Reset to a specific value (default 0). */
    reset(value?: number): void;
}

export declare interface SmoothProgressOptions {
    /** Damping factor (0, 1]. Higher = faster convergence. Default 0.1 */
    damping: number;
    /** Snap to target when |target - current| < threshold. Default 0.001 */
    snapThreshold: number;
    /**
     * Minimum change required to update the target. Changes smaller than this
     * are ignored, filtering high-frequency noise (e.g. sub-pixel scroll jitter).
     * Default 0 (disabled — every change is accepted).
     */
    targetEpsilon: number;
    /** Starting value. Default 0 */
    initial: number;
    /** Clamp current to [0, 1]. Default true */
    clamp: boolean;
}

export { smoothStep3 }

export { stepEnd }

export { steppedEase }

export { stepStart }

export { Stylesheet }

export declare interface TemplateAnimationFrame<V extends Vars> {
    id: number;
    start: ValueUnit;
    vars: V;
    transform?: TransformFunction<V>;
    timingFunction?: TimingFunction;
}

export declare abstract class Timeline {
    private smoother;
    private easingFn;
    private currentProgress;
    private boundaryEpsilon;
    constructor(options?: TimelineOptions);
    /** Subclass returns raw [0,1] progress from its source. */
    protected abstract sample(): number;
    /**
     * Shared progress pipeline: sample → clamp → easing → boundary snap.
     * Returns the processed raw value. Does NOT advance the smoother —
     * the caller (tick or tickDt) drives the smoother with the appropriate
     * time-step method.
     */
    private applyPipeline;
    /**
     * Finalize progress after the smoother has been advanced (or bypassed).
     * Snaps the smoother at boundaries [0, 1] for instant convergence.
     */
    private finalizeProgress;
    /**
     * Shared advance step. When `dt` is undefined, drives the
     * smoother in frame-rate-dependent mode (`tick()`); when given,
     * uses the frame-rate-independent variant (`tickDt(dt)`).
     */
    private _advance;
    /** Advance one frame. Applies easing → boundary snap → smoothing. */
    tick(): number;
    /** Frame-rate independent variant. `dt` in milliseconds. */
    tickDt(dt: number): number;
    get progress(): number;
    /** True if no smoother or smoother is settled. */
    get settled(): boolean;
    /** Immediately converge smoother to current target. */
    snap(): void;
    /** Reset progress to a specific value (default 0). */
    reset(value?: number): void;
}

export declare interface TimelineOptions {
    easing?: TimingFunction | TimingFunctionNames | undefined;
    /** SmoothProgress config. `false` disables smoothing. Default: enabled. */
    smoothing?: Partial<SmoothProgressOptions> | false | undefined;
    /**
     * Boundary snap zone. When the eased progress is within this distance of
     * 0 or 1, the smoother snaps instantly instead of lerping. Prevents
     * oscillation at scroll endpoints where micro-jitter alternates between
     * boundary and non-boundary values each frame.
     * Default 0.005.
     */
    boundaryEpsilon?: number | undefined;
}

export declare type TimingFunction = (t: number) => number;

export { timingFunctionDescriptions }

export declare type TimingFunctionNames = keyof typeof timingFunctions;

export { timingFunctions }

export declare type TransformFunction<V extends Vars> = (v: V, t: number) => void;

export declare type Vars<T = any> = {
    [arg: string]: number | string | T;
};

export { }
