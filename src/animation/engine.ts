/**
 * Heavy parsing engine — `Animation`, `CSSKeyframesAnimation`, and the
 * `AnimationGroup` they compose. This module statically imports the heavy
 * `@mkbabb/value.js` surface (`ValueUnit`, `parseCSSValueUnit`,
 * `parseCSSStylesheet`, `unflattenObject`, the Color/normalize machinery)
 * that CSS-keyframe parsing genuinely requires.
 *
 * It is reachable ONLY through the dynamic boundary in `./index` —
 * `await loadAnimationEngine()` does `import("./engine")`, so the package
 * barrel carries no static edge to this module or to value.js. A consumer
 * that pulls only the light interpolators (`SpringProgress`,
 * `SmoothProgress`, `NumericAnimation`, `ElementMorph`, `Timeline`) never
 * loads this graph. See `./index` for the boundary contract.
 */
import {
    clamp,
    convertToMs,
    isObject,
    parseCSSTime,
    parseCSSValueUnit,
    scale,
    seekPreviousValue,
    sleep,
    unflattenObject,
    ValueUnit,
    type PropertyDescriptor,
} from "@mkbabb/value.js";
import { cssTwinFor } from "./easing";
import { binarySearchRange } from "./internal/binarySearch";
import { AnimationOptionError, parseOption } from "./internal/errors";
import { withReducedMotion } from "./internal/reduced-motion";
import { RAFPlayback } from "./playback";
import { resolveKeyframes } from "./adapter";
import {
    COLOR_SPACES,
    DIRECTIONS,
    FILL_MODES,
    HUE_METHODS,
    defaultOptions,
} from "./constants";
import type {
    AnimationFrame,
    AnimationOptions,
    Easing,
    InputAnimationOptions,
    TemplateAnimationFrame,
    TransformFunction,
    Vars,
} from "./constants";
import { AnimationGroup } from "./group";
import {
    calcFrameTime,
    createInterpVarValue,
    getTimingFunction,
    lerpValue,
    parseAndFlattenObject,
    type ParsedVarMap,
    transformTargetsStyle,
} from "./utils";
import { isWAAPIEligible, playWAAPI } from "./waapi";

/** `parseCSSTime` that converts a parse failure to `undefined` for the option seam. */
const tryParseTime = (raw: string): number | undefined => {
    try {
        const parsed = parseCSSTime(raw);
        return Number.isFinite(parsed) ? parsed : undefined;
    } catch {
        return undefined;
    }
};

/**
 * Resolve heavy-surface easing input — a callable, a typed `Easing`, a
 * registry name, or a `cubic-bezier()` literal — to a typed `Easing`.
 * Fail-explicit: unresolvable input throws; there is no silent fallback
 * to a default curve.
 */
const resolveEasingOption = (
    option: string,
    input: NonNullable<InputAnimationOptions["timingFunction"]>,
): Easing => {
    if (typeof input === "function") return { fn: input };
    if (typeof input === "object") {
        if (typeof (input as Easing).fn === "function") {
            return input as Easing;
        }
        throw new AnimationOptionError(
            option,
            input,
            "an Easing must carry a callable `fn`",
        );
    }
    const fn = getTimingFunction(input);
    if (!fn) {
        throw new AnimationOptionError(
            option,
            input,
            "unknown timing function — pass a callable TimingFunction, a " +
                "typed Easing, a registry name, or a cubic-bezier() literal",
        );
    }
    // Attach the faithful CSS twin when one exists (CSS keyword,
    // cubic-bezier()/steps() literal) so a WAAPI delegation runs the true
    // curve; value.js bespoke names (easeOutCubic, …) get none and stay on
    // the rAF path.
    const css = cssTwinFor(input);
    return css ? { fn, css } : { fn };
};

const hasClone = (value: unknown): value is { clone: () => unknown } => {
    if (typeof value !== "object" || value == null) {
        return false;
    }

    const maybeClone = (value as { clone?: unknown }).clone;
    return typeof maybeClone === "function";
};

export const getAnimationId = (animation: Animation | string): string => {
    if (typeof animation === "string") return animation;
    return animation.name ?? String(animation.id);
};

let nextId = 0;

export class Animation<V extends Vars = any> {
    id: number = nextId++;
    name: string | undefined;
    superKey: string | undefined;

    targets: HTMLElement[];

    options: AnimationOptions;

    templateFrames: TemplateAnimationFrame<V>[] = [];
    parsedVars: ParsedVarMap[] = [];

    frameId: number = 0;

    frames: AnimationFrame<V>[] = [];

    /**
     * THE rAF owner for this animation — the standalone rAF play loop and
     * the WAAPI shadow tick both ride it, so `stop()` halts either
     * uniformly and no raw rAF handle leaks onto the instance.
     */
    readonly playback = new RAFPlayback();

    /**
     * The live WAAPI compositor animations during a `_playWAAPI` delegation
     * (one per target), populated by `playWAAPI` and cleared on teardown.
     * The lifecycle methods (`stop`/`reset`) cancel these so a stopped
     * compositor animation never keeps painting and the awaited play
     * promise never hangs. Empty on the rAF path.
     */
    _waAnimations: globalThis.Animation[] = [];

    startTime: number | undefined = undefined;
    pausedTime: number = 0;
    t: number = 0;

    iteration: number = 0;

    started: boolean = false;
    done: boolean = false;
    reversed: boolean = false;
    paused: boolean = false;

    /**
     * True when an `AnimationGroup` is driving this animation's
     * `tick()` and `interpFrames()` from its own rAF loop. Set by
     * the group at construction; standalone `.play()` / `.draw()`
     * throw when this is true rather than racing the group.
     */
    managed: boolean = false;

    /**
     * If the most recent `play()` was rejected by WAAPI eligibility
     * but `useWAAPI: true` was requested, this records the reason.
     * Queryable by debug builds — no console output is produced.
     */
    waapiIneligibleReason: string | undefined = undefined;

    unflatten: boolean = true;

    private resolvePromise: ((value: void | PromiseLike<void>) => void) | null =
        null;
    private _playingPromise: Promise<void> | null = null;

    /**
     * Pre-bound frame callback — allocated once to avoid creating a new
     * closure on every playback loop start.
     */
    private _boundFrame = this._frame.bind(this);

    /**
     * The instance's ONE default DOM-style renderer, allocated once.
     * "Did the consumer supply a custom transform?" is a reference
     * comparison against this single value ({@link usesDefaultRenderer}) —
     * typed and bind-proof, unlike a Symbol tag on a closure, which
     * `Function.prototype.bind` silently drops.
     */
    protected readonly _defaultTransform: TransformFunction<V> = (vars) =>
        transformTargetsStyle(vars, this.targets);

    /** True when `fn` is this instance's default DOM-style renderer. */
    usesDefaultRenderer(fn: TransformFunction<V> | undefined): boolean {
        return fn === this._defaultTransform;
    }

    private dispatchAnimationEvent(type: string) {
        // SSR-safe capability contract: `AnimationEvent`/`dispatchEvent` are
        // DOM capabilities — when absent (Node, non-element targets) the
        // lifecycle proceeds without events rather than throwing, mirroring
        // the off-DOM posture of `prefersReducedMotion()`. Event delivery is
        // an observation channel, not a library-internal contract.
        if (typeof AnimationEvent === "undefined") return;
        for (const target of this.targets) {
            if (typeof target?.dispatchEvent !== "function") continue;
            target.dispatchEvent(
                new AnimationEvent(type, {
                    animationName: this.name ?? "",
                    elapsedTime: this.t / 1000,
                }),
            );
        }
    }

    constructor(
        options?: Partial<InputAnimationOptions>,
        targets?: HTMLElement[] | HTMLElement | undefined,
        name?: string | undefined,
        superKey?: string | undefined,
    ) {
        this.options = {} as AnimationOptions;

        this.setOptions({ ...defaultOptions, ...(options ?? {}) });

        this.targets =
            targets == null ? [] : Array.isArray(targets) ? targets : [targets];

        this.name = name;
        this.superKey = superKey;
    }

    convertFrameStart(frame: TemplateAnimationFrame<V>) {
        if (
            frame.start.unit === "s" ||
            frame.start.unit === "ms" ||
            !frame.start.unit
        ) {
            const timeUnit = frame.start.unit === "s" ? "s" : "ms";
            const value = convertToMs(frame.start.value, timeUnit);

            frame.start.value = (value / this.options.duration) * 100;
            frame.start.unit = "%";
        }
        frame.start.value = clamp(frame.start.value, 0, 100);

        return frame;
    }

    addFrame<K extends V>(
        start: number | string | ValueUnit<number>,
        vars: Partial<K>,
        transform?: TransformFunction<K>,
        timingFunction?: InputAnimationOptions["timingFunction"],
    ): Animation<K> {
        if (typeof start === "number") {
            start = String(start) + "%";
        } else if (typeof start === "string") {
            start = start;
        } else if (start instanceof ValueUnit) {
            start = String(start);
        }

        const parsedStart = parseCSSValueUnit(start);

        let templateFrame = {
            id: this.frameId,
            start: parsedStart,
            vars,
            transform,
            // Genuine omission inherits the animation's easing; a present-
            // but-unresolvable input throws (fail-explicit).
            timingFunction:
                timingFunction == null
                    ? this.options.timingFunction
                    : resolveEasingOption("timingFunction", timingFunction),
        } as TemplateAnimationFrame<K>;

        this.convertFrameStart(
            templateFrame as unknown as TemplateAnimationFrame<V>,
        );

        this.templateFrames.push(
            templateFrame as unknown as TemplateAnimationFrame<V>,
        );
        this.frameId += 1;

        return this as unknown as Animation<K>;
    }

    createFrame(startIx: number, endIx: number): AnimationFrame<V> {
        const startFrame = this.templateFrames[startIx]!;
        const endFrame = this.templateFrames[endIx]!;

        const ixs = {
            start: startIx,
            stop: endIx,
        };

        const time = calcFrameTime(startFrame, endFrame, this.options.duration);

        let transform = startFrame.transform;

        if (transform == null) {
            const transformIx = seekPreviousValue(
                startIx,
                this.frames,
                (f) => f.transform != null,
            )!;
            transform = this.frames[transformIx]!.transform;
        }

        let timingFunction = startFrame.timingFunction;
        if (timingFunction == null) {
            const timingFunctionIx = seekPreviousValue(
                startIx,
                this.frames,
                (f) => f.timingFunction != null,
            )!;
            timingFunction = this.frames[timingFunctionIx]!.timingFunction;
        }

        const id = this.frameId++;

        return {
            id,
            ixs,
            start: startFrame.start,
            time,
            vars: undefined as unknown as V,
            flatVars: undefined as unknown as V,
            interpVars: {},
            allInterpVars: [],
            transform,
            timingFunction,
        } as AnimationFrame<V>;
    }

    /**
     * Build an index mapping each variable name to the frame indices where
     * it appears. Used by reconcileVars() for O(1) "next occurrence" lookups
     * instead of O(N) findIndex scans per variable.
     */
    private buildVarIndex(): Map<string, number[]> {
        const index = new Map<string, number[]>();
        for (let i = 0; i < this.parsedVars.length; i++) {
            for (const key of Object.keys(this.parsedVars[i]!)) {
                let arr = index.get(key);
                if (!arr) {
                    arr = [];
                    index.set(key, arr);
                }
                arr.push(i);
            }
        }
        return index;
    }

    /**
     * Reconcile interpolation variables across non-adjacent keyframes.
     * For each variable at frame `ix`, find the next frame that also
     * defines that variable and create an interpolation segment between them.
     *
     * Uses a pre-built variable index (from buildVarIndex) to avoid
     * O(frames²) findIndex scans.
     */
    reconcileVars(ix: number, varIndex: Map<string, number[]>) {
        const startVars = this.parsedVars[ix];
        if (!startVars) {
            return;
        }

        for (const v of Object.keys(startVars)) {
            // Use the pre-built index to find the next frame defining this variable
            const occurrences = varIndex.get(v);
            if (!occurrences) continue;

            // Find first occurrence after ix
            let varIx = -1;
            for (const idx of occurrences) {
                if (idx > ix) {
                    varIx = idx;
                    break;
                }
            }

            if (varIx === -1) continue;

            const [startIx, endIx] = [ix, varIx];

            const frameIx = this.frames.findIndex(
                (f) => f.ixs.start === startIx && f.ixs.stop === endIx,
            );
            const frame =
                frameIx !== -1
                    ? this.frames[frameIx]!
                    : this.createFrame(startIx, endIx);

            frame.interpVars[v] = createInterpVarValue(
                v,
                startIx,
                endIx,
                this.parsedVars,
                this.options.colorSpace,
                this.options.hueMethod,
            ) as AnimationFrame<V>["interpVars"][string];

            if (frameIx === -1) {
                this.frames.push(frame);
            }
        }
    }

    parse() {
        this.frames = [];

        this.templateFrames.sort((a, b) => a.start.value - b.start.value);

        this.parsedVars = this.templateFrames.map((frame) => {
            const parsed = parseAndFlattenObject(
                frame.vars as Record<string, unknown>,
            );

            Object.values(parsed).forEach((values) => {
                values.setTargets(this.targets);
            });

            return parsed;
        });

        for (let i = 0; i < this.templateFrames.length - 1; i++) {
            this.frames.push(this.createFrame(i, i + 1));
        }

        // Perform variable reconciliation using pre-built index for O(1) lookups
        const varIndex = this.buildVarIndex();
        this.frames.forEach((_, ix) => this.reconcileVars(ix, varIndex));

        // Sort frames by start time, then by stop time
        this.frames.sort((a, b) => {
            if (a.time.start === b.time.start) {
                return a.time.stop - b.time.stop;
            }
            return a.time.start - b.time.start;
        });

        // Filter out frames that have no interpolated variables
        this.frames = this.frames.filter(
            (frame) =>
                frame.interpVars != null &&
                Object.keys(frame.interpVars).length > 0,
        );

        // Set the vars for each frame and pre-flatten interpVars for hot-path iteration
        this.frames.forEach((frame) => {
            const flatVars = Object.entries(frame.interpVars).reduce<
                Record<string, ValueUnit[]>
            >((acc, [key, value]) => {
                acc[key] = value.map((v) => v.value);
                return acc;
            }, {});
            frame.flatVars = flatVars as unknown as V;
            frame.vars = unflattenObject(frame.flatVars);
            // Pre-flatten for zero-alloc iteration in interpFrames()
            frame.allInterpVars = Object.values(frame.interpVars).flat();
        });

        return this;
    }

    /**
     * Option setters — the fail-explicit contract.
     *
     * Genuine omission (`undefined`/`null`) means "use the default" and is
     * always accepted; present-but-malformed input THROWS a typed
     * `AnimationOptionError` naming the option and the offending value.
     * This is the same posture the layer API chose ("silent no-ops were
     * hiding consumer bugs") applied to the whole options surface — no
     * silent fallback, no silently-preserved previous value.
     */
    setTimingFunction(timingFunction: InputAnimationOptions["timingFunction"]) {
        this.options.timingFunction =
            timingFunction == null
                ? defaultOptions.timingFunction
                : resolveEasingOption("timingFunction", timingFunction);
        return this;
    }

    setIterationCount(iterationCount: InputAnimationOptions["iterationCount"]) {
        if (iterationCount == null) {
            this.options.iterationCount = defaultOptions.iterationCount;
            return this;
        }
        if (
            iterationCount === "infinite" ||
            iterationCount === "∞" ||
            iterationCount === "Infinity" ||
            iterationCount === Infinity
        ) {
            this.options.iterationCount = Infinity;
            return this;
        }
        this.options.iterationCount = parseOption(
            "iterationCount",
            iterationCount,
            (raw) => {
                const n =
                    typeof raw === "string"
                        ? Number.parseFloat(raw.trim())
                        : (raw as number);
                return typeof n === "number" && !Number.isNaN(n) && n >= 0
                    ? n
                    : undefined;
            },
            'expected a non-negative count, "infinite", or Infinity',
        );
        return this;
    }

    setDuration(duration: InputAnimationOptions["duration"]) {
        // Genuine omission: keep the current duration (the constructor
        // always seeds the default; a bare `setDuration()` is a no-op).
        if (duration == null) return this;

        const d = parseOption(
            "duration",
            duration,
            (raw) => {
                const n =
                    typeof raw === "string"
                        ? tryParseTime(raw)
                        : (raw as number);
                return typeof n === "number" && isFinite(n) && n > 0
                    ? n
                    : undefined;
            },
            "expected a positive duration in milliseconds or a CSS time string",
        );

        const prevDuration = this.options.duration;
        const ratio = d / prevDuration;

        for (let i = 0; i < this.frames.length; i++) {
            const frame = this.frames[i]!;
            frame.time.start *= ratio;
            frame.time.stop *= ratio;
        }

        this.options.duration = d;

        return this;
    }

    setDelay(delay: InputAnimationOptions["delay"]) {
        if (delay == null) {
            this.options.delay = defaultOptions.delay;
            return this;
        }
        this.options.delay = parseOption(
            "delay",
            delay,
            (raw) => {
                const n =
                    typeof raw === "string"
                        ? tryParseTime(raw)
                        : (raw as number);
                // Negative delays are valid CSS (start mid-animation).
                return typeof n === "number" && isFinite(n) ? n : undefined;
            },
            "expected a delay in milliseconds or a CSS time string",
        );
        return this;
    }

    setDirection(direction: InputAnimationOptions["direction"]) {
        if (direction == null) {
            direction = defaultOptions.direction;
        } else if (!DIRECTIONS.includes(direction)) {
            throw new AnimationOptionError(
                "direction",
                direction,
                `expected one of: ${DIRECTIONS.join(", ")}`,
            );
        }
        this.options.direction = direction;

        // Immediately update reversed flag so mid-iteration direction changes take effect
        this.reversed = false;
        if (
            this.options.direction === "reverse" ||
            (this.options.direction === "alternate-reverse" &&
                this.iteration % 2 === 0) ||
            (this.options.direction === "alternate" && this.iteration % 2 === 1)
        ) {
            this.reversed = true;
        }

        return this;
    }

    setFillMode(fillMode: InputAnimationOptions["fillMode"]) {
        if (fillMode == null) {
            fillMode = defaultOptions.fillMode;
        } else if (!FILL_MODES.includes(fillMode)) {
            throw new AnimationOptionError(
                "fillMode",
                fillMode,
                `expected one of: ${FILL_MODES.join(", ")}`,
            );
        }
        this.options.fillMode = fillMode;
        return this;
    }

    setUseWAAPI(useWAAPI: InputAnimationOptions["useWAAPI"]) {
        if (useWAAPI == null) {
            this.options.useWAAPI = defaultOptions.useWAAPI;
            return this;
        }
        if (typeof useWAAPI !== "boolean") {
            throw new AnimationOptionError(
                "useWAAPI",
                useWAAPI,
                "expected a boolean",
            );
        }
        this.options.useWAAPI = useWAAPI;
        return this;
    }

    setRespectReducedMotion(
        respectReducedMotion: InputAnimationOptions["respectReducedMotion"],
    ) {
        if (respectReducedMotion == null) {
            this.options.respectReducedMotion =
                defaultOptions.respectReducedMotion;
            return this;
        }
        if (typeof respectReducedMotion !== "boolean") {
            throw new AnimationOptionError(
                "respectReducedMotion",
                respectReducedMotion,
                "expected a boolean",
            );
        }
        this.options.respectReducedMotion = respectReducedMotion;
        return this;
    }

    setColorSpace(colorSpace: InputAnimationOptions["colorSpace"]) {
        if (colorSpace == null) {
            this.options.colorSpace = defaultOptions.colorSpace;
            return this;
        }
        if (!COLOR_SPACES.includes(colorSpace)) {
            throw new AnimationOptionError(
                "colorSpace",
                colorSpace,
                `expected one of: ${COLOR_SPACES.join(", ")}`,
            );
        }
        this.options.colorSpace = colorSpace;
        return this;
    }

    setHueMethod(hueMethod: InputAnimationOptions["hueMethod"]) {
        // Genuine omission leaves `hueMethod` unset (the color machinery picks
        // the space's default); a present-but-malformed value throws.
        if (hueMethod == null) return this;
        if (!(HUE_METHODS as readonly string[]).includes(hueMethod)) {
            throw new AnimationOptionError(
                "hueMethod",
                hueMethod,
                `expected one of: ${HUE_METHODS.join(", ")}`,
            );
        }
        this.options.hueMethod = hueMethod;
        return this;
    }

    setOptions(options: Partial<InputAnimationOptions>) {
        this.setTimingFunction(options.timingFunction);
        this.setDuration(options.duration);
        this.setIterationCount(options.iterationCount);
        this.setDelay(options.delay);
        this.setDirection(options.direction);
        this.setFillMode(options.fillMode);
        this.setUseWAAPI(options.useWAAPI);
        this.setRespectReducedMotion(options.respectReducedMotion);
        this.setColorSpace(options.colorSpace);
        this.setHueMethod(options.hueMethod);
        return this;
    }

    reverse() {
        // Adjust startTime so effectiveT remains continuous across the flip.
        // Before: effectiveT = reversed ? duration - t : t
        // After flip we need the same effectiveT, so shift raw t to (duration - t).
        if (this.startTime !== undefined) {
            const rawT = this.t;
            const shift = this.options.duration - 2 * rawT;
            this.startTime -= shift;
        }
        this.reversed = !this.reversed;
        return this;
    }

    fillForwards() {
        this.interpFrames(this.options.duration, true);
    }

    fillBackwards() {
        this.interpFrames(0, true);
    }

    /**
     * Where the playhead rests after a completed play — derived ONCE from
     * `fillMode` (forwards/both → final; none/backwards → initial). This is
     * the explicit rest-position contract: completion paints the rest frame
     * per this derivation, and the reduced-motion snap is "rest = final,
     * paint it, settle" — the same path a `fillMode: forwards` completion
     * takes, not a separate code path.
     */
    get restPosition(): "initial" | "final" {
        return this.options.fillMode === "forwards" ||
            this.options.fillMode === "both"
            ? "final"
            : "initial";
    }

    /** Paint the rest frame per the fill contract. */
    paintRest() {
        if (this.restPosition === "final") {
            this.fillForwards();
        } else {
            this.fillBackwards();
        }
    }

    /**
     * Stateless progress query. Maps [0,1] from first keyframe to last,
     * regardless of playback direction. `apply=true` invokes transform callbacks.
     */
    at(progress: number, apply: boolean = false): Record<string, ValueUnit[]> {
        const saved = this.reversed;
        this.reversed = false;
        const t = clamp(progress, 0, 1) * this.options.duration;
        const result = this.interpFrames(t, apply);
        this.reversed = saved;
        return result;
    }

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
     * @param out - Optional output object to write results into. When
     *   provided, its keys are cleared first so no stale keys from a
     *   previous call leak through. Pass this per-animation to achieve
     *   zero-allocation steady-state playback.
     * @returns Merged flat vars from all active frames
     */
    interpFrames(
        t: number,
        transformFrames: boolean = false,
        out: Record<string, ValueUnit[]> = {},
    ) {
        t = this.reversed ? this.options.duration - t : t;

        const result = out;
        for (const k in result) delete result[k];

        const frames = this.frames;
        const len = frames.length;

        // Binary search for the first frame containing t
        const seedIdx = binarySearchRange(
            frames,
            t,
            (f) => f.time.start,
            (f) => f.time.stop,
        );

        if (seedIdx === -1) return result;

        // Process the seed frame, then expand to collect all overlapping frames.
        // Frames are sorted by (time.start, time.stop), so overlapping frames
        // at the same time are contiguous neighbors.
        const processFrame = (frame: AnimationFrame<V>) => {
            const { start, stop } = frame.time;
            const scaled = scale(t, start, stop, 0, 1);
            const eased = frame.timingFunction.fn(scaled);

            for (const iv of frame.allInterpVars) {
                lerpValue(eased, iv);
            }

            if (transformFrames) {
                frame.transform(
                    this.unflatten ? frame.vars : frame.flatVars,
                    t,
                );
            }

            Object.assign(result, frame.flatVars);
        };

        // Scan backward from seed (inclusive) to first frame that doesn't contain t
        for (let i = seedIdx; i >= 0; i--) {
            const f = frames[i]!;
            if (t < f.time.start || t > f.time.stop) break;
            processFrame(f);
        }

        // Scan forward from seed+1 to last frame that contains t
        for (let i = seedIdx + 1; i < len; i++) {
            const f = frames[i]!;
            if (t < f.time.start || t > f.time.stop) break;
            processFrame(f);
        }

        return result;
    }

    async onStart() {
        this.reversed = false;

        if (
            this.options.direction === "reverse" ||
            (this.options.direction === "alternate-reverse" &&
                this.iteration % 2 === 0) ||
            (this.options.direction === "alternate" && this.iteration % 2 === 1)
        ) {
            this.reverse();
        }

        if (
            this.options.fillMode === "backwards" ||
            this.options.fillMode === "both"
        ) {
            this.fillBackwards();
        }

        if (this.options.delay > 0) {
            this.paused = true;
            await sleep(this.options.delay);
            this.paused = false;
        }

        this.started = true;
    }

    async onEnd() {
        // Completion paints the rest frame per the fill contract — the one
        // place "where does the playhead rest?" is decided.
        this.paintRest();

        this.startTime = undefined;

        if (this.iteration >= this.options.iterationCount - 1) {
            this.done = true;
            this.iteration = 0;
            this.dispatchAnimationEvent("animationend");
        } else {
            this.iteration += 1;
            this.dispatchAnimationEvent("animationiteration");
        }
    }

    async tick(t: number) {
        if (this.startTime === undefined) {
            await this.onStart();
            this.startTime = t + this.options.delay;
            this.dispatchAnimationEvent("animationstart");
        }

        if (this.paused && this.pausedTime === 0) {
            this.pausedTime = t;
            return this.t;
        } else if (this.pausedTime > 0 && !this.paused) {
            const dt = t - this.pausedTime;
            this.startTime += dt;
            this.pausedTime = 0;
        }

        this.t = t - this.startTime;

        if (this.t >= this.options.duration) {
            await this.onEnd();
            this.t = this.options.duration;
        }
        return this.t;
    }

    /**
     * One frame of the standalone rAF play path, driven by the shared
     * `RAFPlayback.loop`. Returns whether the loop should continue.
     */
    private async _frame(t: number): Promise<boolean> {
        t = await this.tick(t);

        if (this.paused) {
            return false;
        }

        if (!this.done) {
            this.interpFrames(t, true);
            return true;
        }

        // Completion: `onEnd` (inside tick) ALREADY painted the rest frame
        // per the fill contract. Do NOT re-paint here — an
        // `interpFrames(duration)` would clobber that rest paint with the
        // final frame, so a `fillMode: none` animation would end at its
        // final frame instead of resting at its initial one. settle is pure
        // teardown, never a repaint.
        this.settle();
        this._resolvePlay();
        return false;
    }

    private _resolvePlay() {
        const resolve = this.resolvePromise;
        this.resolvePromise = null;
        resolve?.();
    }

    /** Internal rAF-based play loop — loop ownership rides `this.playback`. */
    private _playRAF(): Promise<void> {
        return new Promise((resolve) => {
            this.resolvePromise = resolve;
            this.playback.loop(this._boundFrame);
        });
    }

    /**
     * Play via the Web Animations API. WAAPI handles visuals on the
     * compositor thread; a shadow loop in `playWAAPI` (riding
     * `this.playback`) drives `tick()` so events, iteration count,
     * pause/resume, and other lifecycle state stay coherent with the
     * rAF path.
     *
     * No silent fallback — eligibility is decided once in `play()`
     * before this is invoked, and runtime errors propagate.
     */
    private async _playWAAPI(): Promise<void> {
        await playWAAPI(this);
        this.settle();
    }

    /**
     * Cancel the live WAAPI compositor animations (if any). Cancelling
     * rejects each `wa.finished`, which `playWAAPI` catches as a halt — so
     * this both stops the compositor paint AND unblocks the awaited play
     * promise. No-op on the rAF path.
     */
    private _cancelWAAPI(): void {
        if (this._waAnimations.length === 0) return;
        for (const wa of this._waAnimations) {
            try {
                wa.cancel();
            } catch {
                /* a finished/detached WAAPI animation throws on cancel — ignore */
            }
        }
        this._waAnimations = [];
    }

    /**
     * `prefers-reduced-motion` snap: rest = final, paint it, settle — the
     * SAME terminal path a `fillMode: forwards` completion takes, with the
     * motion elided. The lifecycle stays observable (`animationstart` →
     * final paint → `animationend`) so consumers' event wiring is identical
     * to a completed normal play.
     */
    private async _playReducedMotion(): Promise<void> {
        this.started = true;
        this.dispatchAnimationEvent("animationstart");
        this.fillForwards();
        this.iteration = 0;
        this.done = true;
        this.dispatchAnimationEvent("animationend");
        this.settle();
    }

    async play(): Promise<void> {
        if (this.managed) {
            throw new Error(
                "Animation.play() called on a managed animation — the AnimationGroup owns the rAF loop. Call group.play() instead.",
            );
        }

        if (this._playingPromise) return this._playingPromise;

        const result = withReducedMotion(
            this.options.respectReducedMotion,
            // Reduced-motion wins over WAAPI/rAF — snap to the final frame.
            () => {
                this.waapiIneligibleReason = undefined;
                return this._playReducedMotion();
            },
            () => {
                if (this.options.useWAAPI) {
                    const elig = isWAAPIEligible(this);
                    if (elig.eligible) {
                        this.waapiIneligibleReason = undefined;
                        return this._playWAAPI();
                    }
                    this.waapiIneligibleReason = elig.reason;
                    return this._playRAF();
                }
                this.waapiIneligibleReason = undefined;
                return this._playRAF();
            },
        );

        this._playingPromise = result;
        result.finally(() => {
            this._playingPromise = null;
        });
        return result;
    }

    pause(draw: boolean = true) {
        if (this.paused && draw) {
            return this.resume();
        }
        if (this.started) {
            this.paused = true;
        }
        return this;
    }

    resume() {
        if (this.started && this.paused) {
            this.paused = false;
            if (this._waAnimations.length > 0) {
                // WAAPI: the shadow loop is still installed (it keeps
                // rescheduling while paused, pausing the compositor each
                // frame), so it resumes the curve on its next tick. Do NOT
                // start the rAF `_frame` loop — that would race the shadow
                // loop and orphan the paused compositor animation. Nudge the
                // compositor directly for an immediate resume.
                for (const wa of this._waAnimations) wa.play();
            } else if (!this.playback.running) {
                this.playback.loop(this._boundFrame);
            }
        }
        return this;
    }

    /**
     * Halt playback where it stands: cancel the loop AND the WAAPI
     * compositor animations, settle state, and resolve any pending `play()`
     * promise. Never paints — `reset()` is the explicit rewind.
     */
    stop() {
        this._cancelWAAPI();
        this.playback.stop();
        this.settle();
        this._resolvePlay();
    }

    playing() {
        return !(!this.started || this.paused);
    }

    /** Returns the effective time accounting for direction reversal. */
    get effectiveT(): number {
        return this.reversed ? this.options.duration - this.t : this.t;
    }

    /**
     * Pure state teardown — flags, clocks, iteration. NEVER paints. This is
     * the terminal half of the rest-position contract: completion paints
     * the rest frame (via `onEnd` → `paintRest`) and then settles; the
     * reduced-motion snap paints final and then settles. Settling is
     * orthogonal to where the pixels rest.
     */
    settle() {
        this.done = false;
        this.started = false;
        this.paused = false;
        this.reversed = false;
        this.iteration = 0;
        this.startTime = undefined;
        this.pausedTime = 0;
        this.t = 0;

        return this;
    }

    /**
     * Explicit rewind: paint the INITIAL frame, then settle. This is the
     * user-facing "return to start" — rest position `initial`, painted
     * deliberately — distinct from `settle()`, which tears down state and
     * leaves the pixels where they rest.
     */
    reset() {
        this._cancelWAAPI();
        if (this.started && this.frames.length > 0) {
            this.fillBackwards();
        }
        return this.settle();
    }

    setTargets(...targets: HTMLElement[]) {
        this.targets = targets;

        this.frames.forEach((frame) => {
            Object.values(frame.interpVars).forEach((values) => {
                values.forEach(({ start, stop, value }) => {
                    start.setTargets(this.targets);
                    stop.setTargets(this.targets);
                    value.setTargets(this.targets);
                });
            });
        });

        return this;
    }

    group(...animations: Animation<V>[]) {
        return new AnimationGroup<V>(this, ...animations);
    }
}

export class CSSKeyframesAnimation<V extends Vars> extends Animation<V> {
    constructor(
        options?: Partial<InputAnimationOptions>,
        ...targets: HTMLElement[]
    ) {
        super(options, targets);

        this.unflatten = false;
    }

    /**
     * One transform-resolution seam for the three `from*` entry points:
     * a supplied transform is the consumer's renderer (vars arrive
     * unflattened); genuine omission resolves to the instance's ONE
     * default DOM-style renderer, which keeps WAAPI eligibility a
     * reference comparison (`usesDefaultRenderer`).
     */
    private resolveTransform(
        transform: TransformFunction<V> | undefined,
    ): TransformFunction<V> {
        this.unflatten = transform != null;
        return transform ?? this._defaultTransform;
    }

    fromVars(vars: V[], transform?: TransformFunction<V>) {
        transform = this.resolveTransform(transform);

        for (let i = 0; i < vars.length; i++) {
            const v = vars[i]!;
            const percent = Math.round((i / (vars.length - 1)) * 100);
            this.addFrame(percent, v, transform);
        }

        this.parse();

        return this;
    }

    fromKeyframes(
        keyframes: Map<string, Partial<V>> | Record<string, Partial<V>>,
        transform?: TransformFunction<V>,
    ) {
        transform = this.resolveTransform(transform);

        if (isObject(keyframes)) {
            keyframes = new Map(Object.entries(keyframes));
        }

        const entries =
            keyframes instanceof Map
                ? keyframes.entries()
                : Object.entries(keyframes);

        for (const [percent, frame] of entries) {
            this.addFrame(percent, frame, transform);
        }

        this.parse();
        return this;
    }

    /**
     * Property registry from `@property` declarations parsed by
     * `fromString`. Empty when the input had no `@property` rules.
     * Consumers can read this to recover the type metadata for
     * custom properties (syntax string, initial value, inheritance
     * flag) without re-parsing the source CSS.
     */
    propertyRegistry: Map<string, PropertyDescriptor> = new Map();

    fromString(keyframes: string, transform?: TransformFunction<V>) {
        transform = this.resolveTransform(transform);

        // Single grammar in value.js handles every input shape:
        // bare @keyframes, @property + @keyframes, .class +
        // @keyframes, multi-keyframes, mixed at-rules. No regex
        // pre-detection or fallback parser path.
        const resolved = resolveKeyframes(keyframes);
        this.propertyRegistry = resolved.properties;

        for (const [percent, cachedFrame] of resolved.keyframes.entries()) {
            // Clone the frame to avoid mutating the memoized parse cache
            const frame = Object.fromEntries(
                Object.entries(cachedFrame).map(([k, v]) => [
                    k,
                    hasClone(v) ? v.clone() : v,
                ]),
            ) as Record<string, unknown>;
            // CSS parsing stays LENIENT (a forgiving language): an
            // unrecognized per-keyframe `animation-timing-function` falls
            // back to the inherited easing rather than throwing. The
            // fail-explicit throw is reserved for the explicit
            // setter/addFrame API where a bad value is a consumer bug, not
            // a parse outcome.
            const tfText = resolved.timingFunctions.get(percent);
            const resolvedFn = tfText ? getTimingFunction(tfText) : undefined;
            this.addFrame(
                percent,
                frame as Partial<V>,
                transform,
                resolvedFn ? { fn: resolvedFn } : undefined,
            );
        }

        this.parse();

        return this;
    }

    transform(vars: V) {
        transformTargetsStyle(vars, this.targets);
    }
}

// Heavy-surface companions re-exported through this module so the dynamic
// boundary (`loadAnimationEngine()` in ./index) hands consumers the whole
// value.js-bearing engine in one `import("./engine")`. Every name here
// transitively reaches value.js (the `timingFunctions` registry, the
// `easeInOutCubic` default, the CSS-keyframe parser), which is exactly why
// it sits behind the dynamic boundary rather than on the static barrel.
export { AnimationGroup } from "./group";
export type { AnimationGroupEntry } from "./group";
export { getTimingFunction } from "./utils";
export { resolveKeyframes } from "./adapter";
export type { ResolvedKeyframes } from "./adapter";
export {
    DIRECTIONS,
    FILL_MODES,
    defaultOptions,
    defaultLayerConfig,
} from "./constants";
