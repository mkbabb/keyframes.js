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
    extractTimelineOptions,
    isObject,
    lerpValue,
    scale,
    sleep,
    ValueUnit,
    type CSSTimelineOptions,
    type PropertyDescriptor,
} from "@mkbabb/value.js";
import { binarySearchRange } from "./internal/binarySearch";
import { withReducedMotion } from "./internal/reduced-motion";
import { RAFPlayback } from "./playback";
import { resolveKeyframes } from "./adapter";
import type { Diagnostic } from "./adapter";
import { defaultOptions } from "./constants";
import type {
    AnimationFrame,
    AnimationOptions,
    CompositeOperator,
    Easing,
    InputAnimationOptions,
    TemplateAnimationFrame,
    TransformFunction,
    Vars,
} from "./constants";
import { AnimationGroup } from "./group";
import {
    applyComposition as applyCompositionImpl,
    computeHasComposition as computeHasCompositionImpl,
    resetCompositionCaches,
} from "./engine-composition";
import {
    normalizeBoolean,
    normalizeColorSpace,
    normalizeDelay,
    normalizeDirection,
    normalizeDuration,
    normalizeFillMode,
    normalizeHueMethod,
    normalizeIterationCount,
    normalizeTimingFunction,
} from "./engine-options";
import { cssTwinFor } from "./easing";
import { FrameCompiler } from "./frame-compiler";
import {
    getTimingFunction,
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

export const getAnimationId = (
    animation: KeyframesAnimation | string,
): string => {
    if (typeof animation === "string") return animation;
    return animation.name ?? String(animation.id);
};

let nextId = 0;

/**
 * The core animation engine — keyframes, timing, interpolation, playback.
 *
 * ── PKG-3 RENAME (L.W8 §S4 · audit W126). Formerly `Animation`; renamed to
 * `KeyframesAnimation` because the old name collided with the ambient
 * `globalThis.Animation` (WAAPI), leaking a numeric-suffixed collision alias
 * into the d.ts roll-up (packaging-k.md:118-127). The old `Animation` name
 * survives as a backward-compat RE-EXPORT alias (value + type) below — see the
 * `@deprecated` `Animation` export for the full rationale. Gated by
 * `proof:pkg3-clean`. The runtime constructor is `KeyframesAnimation`.
 */
export class KeyframesAnimation<V extends Vars = any> {
    id: number = nextId++;
    name: string | undefined;
    superKey: string | undefined;

    targets: HTMLElement[];

    options: AnimationOptions;

    /**
     * The frame-compilation half — template frames → sampled `frames[]`.
     * `Animation` composes one and delegates `addFrame`/`parse` + the frame
     * accessors (`templateFrames`/`parsedVars`/`frames`/`frameId`) to it.
     * Assigned in the constructor once `options` exists (the compiler holds a
     * live reference to that options object).
     *
     * READ-ONLY surface (G.W19): the backing `_compiler` is written ONLY by the
     * constructor and {@link adoptCompiled}. An external `animation.compiler = …`
     * write was the one cross-boundary reach-in vector that could desync the
     * live-options reference (`this.options !== this.compiler.options`); making
     * `compiler` a get-only accessor makes that reach-in a COMPILE error, not a
     * convention. Adopt a compiled state via `adoptCompiled(source)`.
     */
    private _compiler!: FrameCompiler<V>;

    get compiler(): FrameCompiler<V> {
        return this._compiler;
    }

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

    /**
     * Structured parse/honoring diagnostics (K.W7 S4) — surfaced from the
     * adapter's `resolveKeyframes` ({@link CSSKeyframesAnimation.fromString})
     * and joined by the engine's own composition-fallback rows. A FLAT additive
     * array of stable-coded {@link Diagnostic} rows; empty on a clean parse with
     * no fallback. Every SILENT fallback site is mirrored here — the honesty
     * surface (`proof:diagnostics-channel`). Queryable; no console output.
     */
    diagnostics: Diagnostic[] = [];

    /**
     * The captured UNDERLYING base value for each composited leaf (K.W7 S1),
     * keyed by the flat property key — the per-element numeric base the
     * `add`/`accumulate` operator accumulates ONTO (snapshotted the first time a
     * composited leaf is applied). Empty for a pure-`replace` animation (the
     * zero-overhead path). The capture/accumulate logic lives in
     * `./engine-composition` ({@link applyComposition}/`captureUnderlyingBase`).
     */
    private _compositionBase: Map<string, number[]> = new Map();

    /** Properties whose non-numeric composite already emitted its
     * `COMPOSITION_FALLBACK` row — so a long playback emits the honesty row
     * ONCE per property, not once per frame (S3/S4). */
    private _compositionFallbackSeen: Set<string> = new Set();

    /** True once `fromString`/`addFrame` saw a non-`replace` operator — the hot
     * path skips ALL composition work when this is false (the predictable
     * per-animation-constant branch the §gate's clause (f) measures free). */
    private _hasComposition: boolean = false;

    started: boolean = false;
    done: boolean = false;
    reversed: boolean = false;
    paused: boolean = false;

    /**
     * True when an `AnimationGroup` is driving this animation's
     * `advanceTo()` and `interpFrames()` from its own rAF loop. Set by
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
     * The ONE output buffer for the standalone play loop's `interpFrames`
     * calls — reused every frame so steady-state playback allocates no
     * per-frame result object (the primitive-level analogue of the group's
     * hoisted `_grouped` buffer, gated by `proof:standalone-zero-alloc`).
     * The play path (`_frame`) never returns this object to a consumer, so
     * reuse is safe; `at()` (a query whose result the caller keeps) still
     * allocates a fresh object.
     */
    private _interpOut: Record<string, ValueUnit[]> = {};

    /**
     * The compile-stable union of every frame's `flatVars` keys — the maximal
     * key-set any `interpFrames` call can write. Fixed at `parse` (the keys
     * never change across frames; a color-space renormalize re-derives the same
     * carriers under the same keys). It is what `clearBuffer` null-fills to keep
     * a reused buffer stale-free WITHOUT `delete` (F.W4 S1 — the V8 dictionary-
     * mode trap the delete-loop fell into). Exposed (read-only) as `flatKeys`
     * so the `AnimationGroup` can size its own composite buffer the same way.
     */
    private _stableKeys: string[] = [];

    /**
     * The consumer's EXPLICIT constructor options (NOT merged with defaults) —
     * retained so `fromString` can layer a parsed style-rule `animation`
     * shorthand UNDER them (constructor-explicit wins over parsed-from-CSS, F.W8).
     */
    protected _ctorOptions: Partial<InputAnimationOptions> = {};

    /** The compile-stable union of this animation's interpolated keys. */
    get flatKeys(): readonly string[] {
        return this._stableKeys;
    }

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

        // Create the compiler BEFORE `setOptions` — it holds a live reference
        // to `this.options` (the setters mutate that object in place, never
        // replace it), and `setOptions` → `setDuration` reads `this.frames`
        // (which delegates to the compiler), so the compiler must exist first.
        // Writes the backing field directly (`compiler` is a get-only accessor).
        this._compiler = new FrameCompiler<V>(this.options);

        // Retain the consumer's EXPLICIT options (not merged with defaults) so
        // `fromString` can apply a sibling style-rule's `animation` shorthand as
        // the base WITH these constructor-explicit options overriding it (F.W8).
        this._ctorOptions = options ?? {};
        this.setOptions({ ...defaultOptions, ...this._ctorOptions });

        this.targets =
            targets == null ? [] : Array.isArray(targets) ? targets : [targets];

        this.name = name;
        this.superKey = superKey;
    }

    // ── Frame-compiler delegation ────────────────────────────────────
    // The frame data + the compile pipeline live on `this.compiler`; these
    // accessors keep the historical public surface intact for the group, the
    // CSS subclass, the serializer, and consumers.

    get templateFrames(): TemplateAnimationFrame<V>[] {
        return this.compiler.templateFrames;
    }
    set templateFrames(value: TemplateAnimationFrame<V>[]) {
        this.compiler.templateFrames = value;
    }

    get parsedVars(): ParsedVarMap[] {
        return this.compiler.parsedVars;
    }

    get frames(): AnimationFrame<V>[] {
        return this.compiler.frames;
    }

    get frameId(): number {
        return this.compiler.frameId;
    }

    /** Append a template frame (delegated to the compiler). Chainable. */
    addFrame<K extends V>(
        start: number | string | ValueUnit<number>,
        vars: Partial<K>,
        transform?: TransformFunction<K>,
        timingFunction?: InputAnimationOptions["timingFunction"],
        composition?: CompositeOperator,
    ): KeyframesAnimation<K> {
        this.compiler.addFrame(
            start,
            vars,
            transform,
            timingFunction,
            composition,
        );
        return this as unknown as KeyframesAnimation<K>;
    }

    /** Compile the template frames into the sampled `frames[]`. Chainable. */
    parse() {
        this.compiler.parse(this.targets);
        this.computeStableKeys();
        this.computeHasComposition();
        return this;
    }

    /**
     * Set `_hasComposition` (K.W7 S1) — true iff ANY compiled frame carries a
     * non-`replace` `animation-composition` operator (the hot-path branch reads
     * this ONE per-animation constant; a pure-`replace` animation never pays for
     * the composition work) — and reset the per-run base/fallback caches so a
     * re-parse re-snapshots the underlying base. See `./engine-composition`.
     */
    private computeHasComposition(): void {
        this._hasComposition = computeHasCompositionImpl(this.frames);
        resetCompositionCaches(
            this._compositionBase,
            this._compositionFallbackSeen,
        );
    }

    /**
     * Adopt another animation's ALREADY-COMPILED state as ONE atomic motion
     * (G.W19) — the first-class verb for the "single-compile, then transplant"
     * pattern (E.W8 S0): a throwaway animation is built + compiled ONCE off the
     * new keyframes, and the live animation adopts that compiled state without a
     * second compile.
     *
     * The transplant moves the `{ compiler, options, unflatten }` triad together
     * and re-binds the live-options reference BY CONSTRUCTION — `this.options` is
     * read OFF the adopted compiler, so `this.options === this.compiler.options`
     * holds without relying on the caller's assignment order. This is the
     * invariant the demo formerly held by a comment + three ordered field writes;
     * here it is the method's contract, enforced by `proof:adopt-compiled`. A
     * `compiler` adopted WITHOUT re-binding `options` would leave the setters
     * mutating one object while the compiler reads another — the exact desync
     * the `6e29236` live-options lock guards against.
     *
     * Recomputes `_stableKeys` so `flatKeys` (the buffer-sizing contract)
     * reflects the adopted compiled frames, not the pre-adopt key-set. Chainable.
     *
     * @param source an animation whose `compiler` is already compiled.
     */
    adoptCompiled(source: KeyframesAnimation<V>): this {
        // Transplant the compiled compiler whole (its `frames`/`templateFrames`/
        // `parsedVars` come with it) into the backing field.
        this._compiler = source.compiler;
        // Re-bind the live-options reference OFF the adopted compiler, so
        // `this.options === this.compiler.options` is true by construction.
        this.options = this.compiler.options;
        this.unflatten = source.unflatten;
        // The adopted frames may carry a different key-set — recompute the
        // stable-key union so the reused interpolation buffer sizes correctly.
        this.computeStableKeys();
        // The adopted frames may carry composition operators — re-derive the
        // honoring flag + reset the per-run base/fallback caches (K.W7).
        this.computeHasComposition();
        return this;
    }

    /**
     * Recompute `_stableKeys` — the union of every compiled frame's `flatVars`
     * keys — after a (re)compile. The maximal key-set the `clearBuffer`
     * null-fill resets, so a reused interpolation buffer stays in V8
     * fast-properties mode without ever calling `delete` (F.W4 S1).
     */
    private computeStableKeys() {
        const seen = new Set<string>();
        for (const frame of this.frames) {
            for (const key in frame.flatVars) seen.add(key);
        }
        this._stableKeys = [...seen];
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
        this.options.timingFunction = normalizeTimingFunction(timingFunction);
        return this;
    }

    setIterationCount(iterationCount: InputAnimationOptions["iterationCount"]) {
        this.options.iterationCount = normalizeIterationCount(iterationCount);
        return this;
    }

    setDuration(duration: InputAnimationOptions["duration"]) {
        // Genuine omission: keep the current duration (the constructor
        // always seeds the default; a bare `setDuration()` is a no-op).
        const d = normalizeDuration(duration);
        if (d === undefined) return this;

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
        this.options.delay = normalizeDelay(delay);
        return this;
    }

    setDirection(direction: InputAnimationOptions["direction"]) {
        this.options.direction = normalizeDirection(direction);

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
        this.options.fillMode = normalizeFillMode(fillMode);
        return this;
    }

    setUseWAAPI(useWAAPI: InputAnimationOptions["useWAAPI"]) {
        this.options.useWAAPI = normalizeBoolean("useWAAPI", useWAAPI);
        return this;
    }

    setRespectReducedMotion(
        respectReducedMotion: InputAnimationOptions["respectReducedMotion"],
    ) {
        this.options.respectReducedMotion = normalizeBoolean(
            "respectReducedMotion",
            respectReducedMotion,
        );
        return this;
    }

    setColorSpace(colorSpace: InputAnimationOptions["colorSpace"]) {
        this.options.colorSpace = normalizeColorSpace(colorSpace);
        // Honor the live-options contract: if frames are already compiled, the
        // color space is baked into their interp carriers — re-derive them so
        // the change takes effect (not a silent compile-stale no-op).
        if (this.frames.length > 0) this.compiler.renormalizeColors();
        return this;
    }

    setHueMethod(hueMethod: InputAnimationOptions["hueMethod"]) {
        // Genuine omission leaves `hueMethod` unset (the color machinery picks
        // the space's default); a present-but-malformed value throws.
        const normalized = normalizeHueMethod(hueMethod);
        if (normalized === undefined) return this;
        this.options.hueMethod = normalized;
        // The hue-interpolation method is baked into compiled cylindrical-space
        // carriers; re-derive when frames already exist (live-options contract).
        if (this.frames.length > 0) this.compiler.renormalizeColors();
        return this;
    }

    /**
     * Set the LAYER-level `animation-composition` operator (L.W1 S5, Band A).
     * Genuine omission (`undefined`) leaves the field unset — the serializer
     * treats it as the CSS default `replace` and omits the longhand. A present
     * value is stored verbatim (`replace` | `add` | `accumulate`), so a sibling
     * `.class { animation-composition: add }` ingested by `fromString`
     * round-trips on re-serialize.
     */
    setComposite(composite: InputAnimationOptions["composite"]) {
        if (composite === undefined) return this;
        this.options.composite = composite;
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
        this.setComposite(options.composite);
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
        out?: Record<string, ValueUnit[]>,
    ): Record<string, ValueUnit[]> {
        t = this.reversed ? this.options.duration - t : t;

        const frames = this.frames;
        const len = frames.length;

        // Binary search for the first frame containing t
        const seedIdx = binarySearchRange(
            frames,
            t,
            (f) => f.time.start,
            (f) => f.time.stop,
        );

        // No active frame: an explicit (reused) buffer is cleared in place via
        // the stable-key null-fill so it never carries a stale key; a fresh
        // caller (no buffer) gets a new empty object. F.W4 S1: NO `delete` — the
        // delete-loop trapped the reused buffer in V8 dictionary mode for the
        // animation's lifetime (`%HasFastProperties === false`, 3.8–6.2× slower).
        if (seedIdx === -1) {
            if (out === undefined) return {};
            this.clearBuffer(out);
            return out;
        }

        // Frames are sorted by (time.start, time.stop), so the frames active at
        // `t` are a contiguous run around the seed. Find its bounds without
        // allocating; `processFrame` is a method (not a per-call closure) so the
        // steady-state play path mints nothing per frame (D-RT-1).
        let lo = seedIdx;
        let hi = seedIdx;
        for (let i = seedIdx - 1; i >= 0; i--) {
            const f = frames[i]!;
            if (t < f.time.start || t > f.time.stop) break;
            lo = i;
        }
        for (let i = seedIdx + 1; i < len; i++) {
            const f = frames[i]!;
            if (t < f.time.start || t > f.time.stop) break;
            hi = i;
        }

        // Lerp (and optionally apply) every active frame in place. The leaves of
        // each frame's `flatVars` ARE the `ValueUnit`s just mutated here
        // (`frame-compiler.ts` `acc[key] = value.map((v) => v.value)`).
        for (let i = lo; i <= hi; i++) {
            this.processFrame(frames[i]!, t, transformFrames);
        }

        // F.W4 S3 — the single-active-frame alias fast-path. The dominant shape
        // (2-stop `fromString`, every preset, every single-property animation)
        // has exactly one active frame, and that frame's `flatVars` already holds
        // the freshly-lerped units — so a fresh caller (no `out` buffer) gets it
        // returned DIRECTLY, with no clear and no copy. The aliasing-correctness
        // clause: a caller that passes its OWN buffer (the AnimationGroup's
        // `entry.values`, the play loop's `_interpOut`) takes the buffer path
        // below and NEVER the alias, so no consumer mutates a shared frame object
        // expecting a private copy.
        if (lo === hi) {
            const fv = frames[seedIdx]!.flatVars as unknown as Record<
                string,
                ValueUnit[]
            >;
            if (out === undefined) return fv;
            this.clearBuffer(out);
            Object.assign(out, fv);
            return out;
        }

        // ≥2 active frames (properties with distinct stop sets). Merge into the
        // stable-key buffer (a reused `out` is null-filled first, NOT delete-
        // poisoned; a fresh caller gets a new object whose keys are exactly the
        // active union). Object.assign into a fast-properties receiver stays at
        // fixed-offset speed.
        const result = out ?? {};
        if (out !== undefined) this.clearBuffer(out);
        for (let i = lo; i <= hi; i++) {
            Object.assign(result, frames[i]!.flatVars);
        }
        return result;
    }

    /**
     * Clear a reused interpolation buffer to a stale-free state WITHOUT
     * `delete` — the V8-correct stable-key null-fill (F.W4 S1). The key-set is
     * compile-stable (`_stableKeys` is the union of every frame's `flatVars`
     * keys, fixed at `parse`), so null-filling it keeps the buffer in
     * fast-properties mode AND zero-alloc. Inactive keys read back `undefined`;
     * every consumer of a reused buffer (the group blend, the unused play-loop
     * `_interpOut`) skips them — only the standalone return path (which never
     * reuses a buffer) must be `undefined`-free, and it takes the alias / fresh
     * merge above.
     */
    private clearBuffer(buf: Record<string, ValueUnit[]>) {
        const keys = this._stableKeys;
        for (let i = 0; i < keys.length; i++) {
            buf[keys[i]!] = undefined as unknown as ValueUnit[];
        }
    }

    /**
     * Interpolate ONE active frame at time `t` in place (lerp + optional
     * transform). Lifted off the `interpFrames` hot loop so playback allocates
     * no per-frame closure. A zero-width frame (`start === stop`, a degenerate
     * keyframe pair) snaps to the endpoint instead of dividing by zero in
     * `scale` (E-RT-5). The merge into the result buffer is done by the caller
     * (F.W4 S3 — so the single-frame path can alias `flatVars` with no copy).
     */
    private processFrame(
        frame: AnimationFrame<V>,
        t: number,
        transformFrames: boolean,
    ) {
        const { start, stop } = frame.time;
        const scaled = start === stop ? 1 : scale(t, start, stop, 0, 1);
        const eased = frame.timingFunction.fn(scaled);

        for (const iv of frame.allInterpVars) {
            lerpValue(eased, iv);
        }

        // K.W7 S1 — HONOR `animation-composition` on the rAF APPLY path (the
        // `add`/`accumulate` composite of the lerped leaf onto the captured base;
        // see `./engine-composition`). GATED on `transformFrames`: only the rAF
        // apply (the engine-write channel) composites — a `false` sample (the
        // WAAPI keyframe build, the group blend, a `.at()` query) keeps the RAW
        // lerped effect, because the WAAPI compositor adds the base ITSELF (S2,
        // the `composite` keyword); compositing here too would DOUBLE-count, so
        // the rAF↔WAAPI parity holds precisely because this path is rAF-only. A
        // pure-`replace` animation skips the branch (the `_hasComposition` const).
        if (
            transformFrames &&
            this._hasComposition &&
            frame.composition != null
        ) {
            this.applyComposition(frame);
        }

        if (transformFrames) {
            frame.transform(this.unflatten ? frame.vars : frame.flatVars, t);
        }
    }

    /**
     * Composite ONE frame's lerped numeric leaves onto the captured underlying
     * base per its `animation-composition` operator (K.W7 S1) — the thin engine
     * seam threading the live per-run state into the pure `./engine-composition`
     * honoring (where the un-clamped add, repeat-aware accumulate, captured base,
     * and non-numeric `replace`-fallback + `COMPOSITION_FALLBACK` row live).
     */
    private applyComposition(frame: AnimationFrame<V>): void {
        applyCompositionImpl(frame, {
            iteration: this.iteration,
            target: this.targets[0],
            compositionBase: this._compositionBase,
            compositionFallbackSeen: this._compositionFallbackSeen,
            diagnostics: this.diagnostics,
        });
    }

    /** SYNC unless `delay > 0` — then a thenable resolving after the sleep. */
    onStart(): Promise<void> | undefined {
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
            return sleep(this.options.delay).then(() => {
                this.paused = false;
                this.started = true;
            });
        }

        this.started = true;
        return undefined;
    }

    onEnd() {
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

    /**
     * Advance the playhead to absolute clock `t` (a rAF timestamp, NOT a
     * delta). Lazily runs `onStart` on the first call, reconciles the
     * pause/resume clock, and ends the iteration once `t` reaches the
     * duration. This is the DRIVER-layer advance — the one meaning of the
     * absolute-clock step, distinct from the `tickDt(dt)` stepper surface
     * the rest of the engine canonicalized to.
     *
     * SYNC on the steady path (J.W6 S1 — the F.W5 held half, landed): every
     * post-start frame returns a plain number (no per-frame promise+microtask
     * hop); a thenable ONLY when the FIRST tick awaits the genuinely-async
     * delay sleep. Ordering locked by proof:event-ordering.
     */
    advanceTo(t: number): number | Promise<number> {
        if (this.startTime === undefined) {
            const pending = this.onStart();
            const begin = (): number => {
                this.startTime = t + this.options.delay;
                this.dispatchAnimationEvent("animationstart");
                return this._advance(t);
            };
            return pending ? pending.then(begin) : begin();
        }
        return this._advance(t);
    }

    /** The post-start advance body — pause clock, local time, iteration end. */
    private _advance(t: number): number {
        if (this.paused && this.pausedTime === 0) {
            this.pausedTime = t;
            return this.t;
        } else if (this.pausedTime > 0 && !this.paused) {
            const dt = t - this.pausedTime;
            this.startTime! += dt;
            this.pausedTime = 0;
        }

        this.t = t - this.startTime!;

        if (this.t >= this.options.duration) {
            this.onEnd();
            this.t = this.options.duration;
        }
        return this.t;
    }

    /**
     * One frame of the standalone rAF play path, driven by the shared
     * `RAFPlayback.loop`. Returns whether the loop should continue.
     */
    private _frame(t: number): boolean | Promise<boolean> {
        // Live reduced-motion: a long/infinite animation that was running when
        // the OS toggled `prefers-reduced-motion: reduce` re-consults the ONE
        // detector per tick and converges to the SAME terminal state the
        // up-front gate produces (snap to the rest frame, settle) — the
        // observation half of the shared detector (D-LIB-3). No-op when the
        // option is off or the preference is unset (the run() branch returns).
        const flipped = withReducedMotion(
            this.options.respectReducedMotion,
            () => true,
            () => false,
        );
        if (flipped) {
            this._snapToReducedMotion();
            return false;
        }

        // Sync steady path (J.W6 S1) — the loop-core reschedules inline.
        const stepped = this.advanceTo(t);
        return typeof stepped === "number"
            ? this._renderFrame(stepped)
            : stepped.then((local) => this._renderFrame(local));
    }

    /** The post-advance render half of `_frame` — paint, or settle on done. */
    private _renderFrame(t: number): boolean {
        if (this.paused) {
            return false;
        }

        if (!this.done) {
            // Reuse the one hoisted buffer — steady-state playback allocates
            // no per-frame result object (proof:standalone-zero-alloc).
            this.interpFrames(t, true, this._interpOut);
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
     * `this.playback`) drives `advanceTo()` so events, iteration count,
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

    /**
     * Mid-flight reduced-motion snap (D-LIB-3). A running rAF loop detected a
     * live flip to `reduce`; converge to the rest frame and resolve the
     * in-flight `play()` exactly as a forwards completion would. Distinct from
     * `_playReducedMotion` (the up-front gate) only in that `animationstart`
     * already fired — so here we paint final, mark done, end, settle, and
     * release the awaiter. The WAAPI lane snaps via the same path: the up-front
     * gate already routes reduced-motion away from WAAPI, and a live flip on a
     * WAAPI animation cancels the compositor handles before settling.
     */
    private _snapToReducedMotion(): void {
        this._cancelWAAPI();
        this.fillForwards();
        this.iteration = 0;
        this.done = true;
        this.dispatchAnimationEvent("animationend");
        this.settle();
        this._resolvePlay();
    }

    /**
     * The completion front-door (G.W13) — `await anim.finished` resolves once
     * the in-flight play settles. It exposes the ONE held `_playingPromise`
     * `play()` already constructs (the re-entrant guard returns it; the
     * `finally`-clear nulls it on settle) — NOT a second completion lifecycle.
     * Two reads mid-play return the SAME promise. A settled (or never-played)
     * animation reads `null` and resolves immediately: "not running" = "nothing
     * to await" — the honest semantics for a getter that reports current
     * settledness, not a pre-armed future run.
     */
    get finished(): Promise<void> {
        return this._playingPromise ?? Promise.resolve();
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

    /**
     * Pause playback — idempotent. Pausing an already-paused (or
     * not-yet-started) animation is a no-op, never a resume: a method named
     * `pause` pauses. Use {@link resume} for the explicit resume.
     */
    pause() {
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

    /** The explicit flip: pauses if playing, resumes if paused. */
    toggle() {
        return this.paused ? this.resume() : this.pause();
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

    group(...animations: KeyframesAnimation<V>[]) {
        return new AnimationGroup<V>(this, ...animations);
    }
}

/**
 * @deprecated Renamed to {@link KeyframesAnimation} in 5.0.0 (PKG-3, L.W8 §S4).
 * The old `Animation` name collided with the ambient `globalThis.Animation`
 * (WAAPI), so the rolled-up d.ts formerly leaked a numeric-suffixed collision
 * alias into every intermediate type in IDE hover text. The CANONICAL
 * declaration is now `KeyframesAnimation` (no ambient collision); this
 * `Animation` is a pure RE-EXPORT alias of it — value AND type — so existing
 * code keeps working: `import type { Animation } from "@mkbabb/keyframes.js"`,
 * `new Animation()`, and `instanceof Animation` all resolve to
 * `KeyframesAnimation`. Because the canonical name no longer collides, API
 * Extractor emits the clean re-export (`KeyframesAnimation` exported under the
 * `Animation` name, no numeric suffix) — `proof:pkg3-clean` stays GREEN.
 * Migrate to `KeyframesAnimation`; this alias is a transition aid.
 */
export { KeyframesAnimation as Animation };

export class CSSKeyframesAnimation<V extends Vars> extends KeyframesAnimation<V> {
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

    /**
     * Parsed scroll-grammar (`animation-timeline` / `animation-range` /
     * `timeline-scope` / `animation-trigger`) recovered from a sibling style rule
     * by `fromString` (L.W2 S1 — CC-6). Populated from
     * `extractTimelineOptions(resolved.stylesheet)`; `undefined` when the input
     * carried no scroll grammar (the canonical time-clock animation). A read-only
     * metadata field — no hot-path impact, analogous to {@link propertyRegistry}.
     * The compiler (`compileToCSS`) reads it to EMIT the scroll longhands back out
     * (`serializeScrollOptions` run backward over the parsed options — the same
     * moat law as the `animation` shorthand), closing the round-trip's EMIT half.
     */
    scrollOptions?: CSSTimelineOptions;

    fromString(keyframes: string, transform?: TransformFunction<V>) {
        transform = this.resolveTransform(transform);

        // Single grammar in value.js handles every input shape:
        // bare @keyframes, @property + @keyframes, .class +
        // @keyframes, multi-keyframes, mixed at-rules. No regex
        // pre-detection or fallback parser path.
        const resolved = resolveKeyframes(keyframes);
        this.propertyRegistry = resolved.properties;

        // L.W2 S1 (CC-6) — recover the scroll grammar from the SAME parse. value.js's
        // `extractTimelineOptions` reads `animation-timeline`/`animation-range`/
        // `timeline-scope`/`animation-trigger` off the stylesheet into a typed
        // `CSSTimelineOptions`. Set the field ONLY when scroll grammar is actually
        // present (it returns `{}` for a canonical time-clock animation), so the
        // compiler's EMIT half threads only a real scroll source — a plain
        // animation leaves `scrollOptions` `undefined` (byte-identical to before).
        // Under `exactOptionalPropertyTypes`, a re-parse with no scroll grammar
        // must CLEAR a stale field rather than assign `undefined` into the optional.
        const timeline = extractTimelineOptions(resolved.stylesheet);
        if (Object.keys(timeline).length > 0) this.scrollOptions = timeline;
        else delete this.scrollOptions;

        // K.W7 S4 — surface the adapter's structured diagnostics (EMPTY_PARSE,
        // and any value.js PARSE_ERROR consumed through OnParseError) on the
        // animation. A fresh array per `fromString` so a re-parse does not
        // carry stale rows; the engine's own COMPOSITION_FALLBACK rows join it
        // at apply time. The channel is queryable; nothing is logged.
        this.diagnostics = [...resolved.diagnostics];

        // F.W8 — apply a sibling style rule's `animation` shorthand/longhands as
        // the option BASE, with the constructor-explicit options overriding it.
        // value.js's `extractAnimationOptions` returns only the declared fields;
        // translate its CSS shape to the engine's (infinite → `Infinity`, the
        // timing-function string flows through `getTimingFunction` as the
        // per-keyframe case does). No-op (byte-identical) when the input carries
        // no style rule. The dead `resolved.options` field is now consumed.
        const opt = resolved.options;
        const base: Partial<InputAnimationOptions> = {};
        if (opt.duration != null) base.duration = opt.duration;
        if (opt.timingFunction != null)
            base.timingFunction =
                opt.timingFunction as InputAnimationOptions["timingFunction"];
        if (opt.iterationCount !== undefined)
            base.iterationCount =
                opt.iterationCount === null ? Infinity : opt.iterationCount;
        if (opt.direction != null)
            base.direction =
                opt.direction as NonNullable<
                    InputAnimationOptions["direction"]
                >;
        if (opt.delay != null) base.delay = opt.delay;
        if (opt.fillMode != null)
            base.fillMode = opt.fillMode as NonNullable<
                InputAnimationOptions["fillMode"]
            >;
        // L.W1 S5 (Band A) — the LAYER-level `animation-composition` longhand
        // value.js 0.13.0 surfaces on `CSSAnimationOptions.composition`. Carry it
        // onto `options.composite` so an authored `animation-composition: add`
        // (arriving via a sibling `.class` rule) round-trips instead of dropping.
        if (opt.composition != null)
            base.composite = opt.composition as CompositeOperator;
        if (Object.keys(base).length > 0) {
            this.setOptions({ ...base, ...this._ctorOptions });
        }

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
            // Preserve the faithful CSS twin (a `linear()`/`cubic-bezier()`/
            // `steps()` literal, a CSS keyword) so the per-keyframe easing
            // round-trips on re-serialize instead of collapsing to the bare
            // registry name (F.W7 — the read half of the round-trip symmetry).
            let easing: Easing | undefined;
            if (resolvedFn) {
                const css = tfText ? cssTwinFor(tfText) : undefined;
                easing = css ? { fn: resolvedFn, css } : { fn: resolvedFn };
            }
            // K.W7 S1 — thread the captured per-keyframe `animation-composition`
            // operator (`add`/`accumulate`/`replace`) from the adapter's Map
            // into the template frame BESIDE the per-keyframe easing read. This
            // is the WIRING the audit named: the engine READING the value it
            // dropped, never a re-parse of the CSS at apply time.
            const composition = resolved.composition.get(percent) as
                | CompositeOperator
                | undefined;
            this.addFrame(
                percent,
                frame as Partial<V>,
                transform,
                easing,
                composition,
            );
        }

        this.parse();

        // D-LIB-1: register the parsed `@property` registry with the platform.
        // Until now the registry was an inert metadata-recovery `Map`; a typed
        // custom the author declared via `@property` was, to the browser, an
        // untyped string — so the WAAPI path animated it DISCRETELY (a silent
        // regression vs the rAF path's JS interpolation). Registering makes the
        // native path interpolate the typed custom SMOOTHLY (isomorphism-
        // restoring). Feature-detected; the JS path is the verbatim fallback.
        this.registerProperties();

        return this;
    }

    /**
     * Register every parsed `@property` descriptor with the UA via
     * `CSS.registerProperty` (D-LIB-1) — one guarded pass at the end of
     * `fromString`. Feature-detected (`CSS.registerProperty` may be absent:
     * SSR, jsdom, older engines) so it no-ops to today's behaviour where
     * unsupported. A duplicate-name re-registration throws a benign
     * `InvalidModificationError` (the global registry is process-wide and
     * idempotent for a given name) — swallowed per-descriptor so one already-
     * registered name never aborts the rest of the pass.
     *
     * Baseline 2024-07-09 (newly available — feature-detect mandatory).
     */
    private registerProperties(): void {
        if (
            typeof CSS === "undefined" ||
            typeof CSS.registerProperty !== "function"
        ) {
            return;
        }
        for (const [name, descriptor] of this.propertyRegistry) {
            // `syntax` is required by the platform; a descriptor parsed without
            // one cannot be registered (it stays an untyped custom). value.js's
            // `ValueArray.toString()` is the canonical CSS serialization of the
            // initial value (the same form value.js emits for `initial-value:`).
            if (descriptor.syntax == null) continue;
            const definition: PropertyDefinition = {
                name,
                syntax: descriptor.syntax,
                inherits: descriptor.inherits ?? false,
            };
            if (descriptor.initialValue != null) {
                definition.initialValue = descriptor.initialValue.toString();
            }
            try {
                CSS.registerProperty(definition);
            } catch {
                // InvalidModificationError on a duplicate name (process-wide
                // registry) — benign, the property is already registered with
                // these semantics. Any other throw (malformed syntax/initial
                // value the UA rejects) likewise must not abort playback: the
                // JS path remains correct, so swallow and move on.
            }
        }
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
