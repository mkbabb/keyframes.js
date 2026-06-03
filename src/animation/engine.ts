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
    cancelAnimationFrame,
    clamp,
    convertToMs,
    easeInOutCubic,
    isObject,
    parseCSSTime,
    parseCSSValueUnit,
    requestAnimationFrame,
    scale,
    seekPreviousValue,
    sleep,
    unflattenObject,
    ValueUnit,
    type PropertyDescriptor,
} from "@mkbabb/value.js";
import { binarySearchRange } from "./internal/binarySearch";
import { prefersReducedMotion } from "./internal/reduced-motion";
import { resolveKeyframes } from "./adapter";
import { defaultOptions } from "./constants";
import type {
    AnimationFrame,
    AnimationOptions,
    InputAnimationOptions,
    TemplateAnimationFrame,
    TimingFunction,
    TimingFunctionNames,
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

    handleId: number | any = undefined;

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
     * Pre-bound draw callback — allocated once to avoid creating a new
     * closure on every requestAnimationFrame reschedule.
     */
    private _boundDraw = this.draw.bind(this);

    private dispatchAnimationEvent(type: string) {
        // TODO(MEDIUM): Throw explicit capability errors when AnimationEvent/dispatchEvent is unavailable instead of silently skipping.
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
        timingFunction?: TimingFunction | TimingFunctionNames,
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
            timingFunction:
                getTimingFunction(timingFunction) ??
                this.options.timingFunction,
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

    setTimingFunction(timingFunction: InputAnimationOptions["timingFunction"]) {
        // TODO(HIGH): Remove implicit timing-function defaulting here; reject unknown timing functions explicitly.
        this.options.timingFunction =
            getTimingFunction(timingFunction) ?? easeInOutCubic;
        return this;
    }

    setIterationCount(iterationCount: InputAnimationOptions["iterationCount"]) {
        if (
            !iterationCount ||
            iterationCount === "infinite" ||
            iterationCount === "∞" ||
            iterationCount === "Infinity"
        ) {
            this.options.iterationCount = Infinity;
        } else if (typeof iterationCount === "string") {
            const parsed = parseFloat(iterationCount.trim());
            // TODO(CRITICAL): Replace silent invalid-input no-op with explicit error for malformed iterationCount strings.
            if (isNaN(parsed) || parsed < 0) return this;
            this.options.iterationCount = parsed;
        } else {
            // TODO(HIGH): Replace silent invalid-input no-op with explicit error for invalid numeric iterationCount values.
            if (isNaN(iterationCount) || iterationCount < 0) return this;
            this.options.iterationCount = iterationCount;
        }
        return this;
    }

    setDuration(duration: InputAnimationOptions["duration"]) {
        if (typeof duration === "string") {
            duration = parseCSSTime(duration);
        }

        const d = duration ?? this.options.duration;
        // TODO(HIGH): Stop silently preserving previous duration on invalid input; throw a validation error.
        if (!isFinite(d) || d <= 0) return this;

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
        if (typeof delay === "string") {
            delay = parseCSSTime(delay);
        }
        // TODO(MEDIUM): Avoid implicit delay defaulting on undefined input in strict mode; require explicit intent.
        this.options.delay = delay ?? 0;
        return this;
    }

    setDirection(direction: InputAnimationOptions["direction"]) {
        // TODO(MEDIUM): Avoid implicit direction fallback; reject missing direction when strict option validation is enabled.
        this.options.direction = direction ?? "normal";

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
        // TODO(MEDIUM): Avoid implicit fill-mode fallback; reject missing fill mode when strict option validation is enabled.
        this.options.fillMode = fillMode ?? "forwards";
        return this;
    }

    setUseWAAPI(useWAAPI: InputAnimationOptions["useWAAPI"]) {
        // TODO(LOW): Avoid implicit WAAPI opt-in defaulting here; validate explicit policy selection upstream.
        this.options.useWAAPI = useWAAPI ?? true;
        return this;
    }

    setRespectReducedMotion(
        respectReducedMotion: InputAnimationOptions["respectReducedMotion"],
    ) {
        this.options.respectReducedMotion = respectReducedMotion ?? false;
        return this;
    }

    setColorSpace(colorSpace: InputAnimationOptions["colorSpace"]) {
        // TODO(MEDIUM): Avoid implicit color-space fallback; require explicit color-space selection in strict mode.
        this.options.colorSpace = colorSpace ?? "oklab";
        return this;
    }

    setHueMethod(hueMethod: InputAnimationOptions["hueMethod"]) {
        if (hueMethod !== undefined) {
            this.options.hueMethod = hueMethod;
        }
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
            const eased = frame.timingFunction(scaled);

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
        if (
            this.options.fillMode === "forwards" ||
            this.options.fillMode === "both"
        ) {
            this.fillForwards();
        } else if (
            this.options.fillMode === "none" ||
            this.options.fillMode === "backwards"
        ) {
            this.fillBackwards();
        }

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

    async draw(t: number) {
        if (this.managed) {
            throw new Error(
                "Animation.draw() called on a managed animation — the AnimationGroup owns the rAF loop. Call group.play()/pause()/stop() instead.",
            );
        }

        t = await this.tick(t);

        if (this.paused) {
            return;
        }

        this.interpFrames(t, true);

        if (!this.done) {
            this.handleId = requestAnimationFrame(this._boundDraw);
        } else {
            this.reset();
            if (this.resolvePromise) {
                this.resolvePromise();
            }
        }
    }

    /** Internal rAF-based play loop. */
    private _playRAF(): Promise<void> {
        return new Promise((resolve) => {
            this.resolvePromise = resolve;
            this.handleId = requestAnimationFrame(this._boundDraw);
        });
    }

    /**
     * Play via the Web Animations API. WAAPI handles visuals on the
     * compositor thread; a shadow rAF loop in `playWAAPI` drives
     * `tick()` so events, iteration count, pause/resume, and other
     * lifecycle state stay coherent with the rAF path.
     *
     * No silent fallback — eligibility is decided once in `play()`
     * before this is invoked, and runtime errors propagate.
     */
    private async _playWAAPI(): Promise<void> {
        await playWAAPI(this);
        this.reset();
    }

    /**
     * `prefers-reduced-motion` snap: jump to the final frame in a single
     * paint — no rAF/WAAPI loop. The lifecycle stays observable
     * (`animationstart` → fill final → `animationend`) so consumers' event
     * wiring is identical to a completed normal play.
     */
    private async _playReducedMotion(): Promise<void> {
        this.started = true;
        this.dispatchAnimationEvent("animationstart");
        // The visually-complete end state — the same frame a forwards fill
        // settles on. Reduced-motion shows the result without the motion.
        this.fillForwards();
        this.iteration = 0;
        this.done = true;
        this.dispatchAnimationEvent("animationend");
        this.reset();
    }

    async play(): Promise<void> {
        if (this.managed) {
            throw new Error(
                "Animation.play() called on a managed animation — the AnimationGroup owns the rAF loop. Call group.play() instead.",
            );
        }

        if (this._playingPromise) return this._playingPromise;

        let result: Promise<void>;
        if (this.options.respectReducedMotion && prefersReducedMotion()) {
            // Reduced-motion wins over WAAPI/rAF — snap to the final frame.
            this.waapiIneligibleReason = undefined;
            result = this._playReducedMotion();
        } else if (this.options.useWAAPI) {
            const elig = isWAAPIEligible(this);
            if (elig.eligible) {
                this.waapiIneligibleReason = undefined;
                result = this._playWAAPI();
            } else {
                this.waapiIneligibleReason = elig.reason;
                result = this._playRAF();
            }
        } else {
            this.waapiIneligibleReason = undefined;
            result = this._playRAF();
        }

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
            this.handleId = requestAnimationFrame(this._boundDraw);
        }
        return this;
    }

    stop() {
        cancelAnimationFrame(this.handleId);
        this.reset();
    }

    playing() {
        return !(!this.started || this.paused);
    }

    /** Returns the effective time accounting for direction reversal. */
    get effectiveT(): number {
        return this.reversed ? this.options.duration - this.t : this.t;
    }

    reset() {
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

    fromVars(vars: V[], transform?: TransformFunction<V>) {
        this.unflatten = transform != null;
        // TODO(MEDIUM): Require an explicit transform strategy instead of defaulting to instance transform.
        transform ??= this.transform.bind(this);

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
        this.unflatten = transform != null;
        // TODO(MEDIUM): Require an explicit transform strategy instead of defaulting to instance transform.
        transform ??= this.transform.bind(this);

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
        this.unflatten = transform != null;
        // TODO(MEDIUM): Require an explicit transform strategy instead of defaulting to instance transform.
        transform ??= this.transform.bind(this);

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
            const tfText = resolved.timingFunctions.get(percent);
            const resolvedTF = tfText
                ? getTimingFunction(tfText as TimingFunctionNames)
                : undefined;
            this.addFrame(percent, frame as Partial<V>, transform, resolvedTF);
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
