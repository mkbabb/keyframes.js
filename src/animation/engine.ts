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
    isObject,
    lerpArray,
    lerpValue,
    scale,
    ValueArray,
    ValueUnit,
    type CSSTimelineOptions,
    type CustomFunctionDescriptor,
    type PropertyDescriptor,
} from "@mkbabb/value.js";
import { binarySearchRange } from "./internal/binarySearch";
import { AnimationOptionError } from "./internal/errors";
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
import {
    recoverAnimationOptionsBase,
    recoverScrollOptions,
    registerPropertyDescriptors,
} from "./engine-css-metadata";
import { cssTwinFor } from "./easing";
import {
    FrameCompiler,
    namedSelectorToFraction,
    NAMED_SELECTOR_SUPERTYPE,
} from "./frame-compiler";
import type { Timeline } from "./timeline";
import {
    DROP,
    hasPhase2Node,
    makeResolveContext,
    resolveValues,
    type ResolveEnv,
} from "./resolve-values";
import {
    getTimingFunction,
    type ParsedVarMap,
    transformTargetsStyle,
} from "./utils";
import * as playback from "./engine-playback";
import type { PlaybackHost } from "./engine-playback";

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
 * into the d.ts roll-up (packaging-k.md:118-127). The legacy `Animation`
 * backward-compat RE-EXPORT alias was DROPPED in 5.0.0 (Q.WE1 — NO-LEGACY).
 * Gated by `proof:pkg3-clean`. The runtime constructor is `KeyframesAnimation`.
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
     * Q.WD1 S3 (DM-22) — the named-selector PLAY-TIME guard. A scroll-range named
     * selector (`entry`/`exit`/`cover`/`contain`) ingests + round-trips opaquely
     * (the L.W1 S4 floor — `fromString`/`parse()` NEVER throw); it is RESOLVABLE to
     * a numeric `%` only under a `ScrollTimeline`/`ManualTimeline` via
     * `bindTimeline`. If a numeric position is genuinely DEMANDED (`play()`/`at()`)
     * while a template frame still carries `NAMED_SELECTOR_SUPERTYPE` (unresolved —
     * `bindTimeline` was never called), refuse with the TYPED
     * `NAMED_SELECTOR_NO_TIMELINE` rather than silently producing NaN frames that
     * `binarySearchRange` treats as ALWAYS-ACTIVE. Fired ONLY at the genuinely-
     * demanded point — NEVER at parse/ingest (the reverted Path-A trap). A resolved
     * frame (the superType tag CLEARED by `bindTimeline`) passes silently — this is
     * a zero-cost `Array.find` over `templateFrames` whose starts are `%`/`from`/
     * `to` (no `superType`) on a non-named animation.
     */
    private assertNoUnresolvedNamedSelector(): void {
        const unresolved = this.compiler.templateFrames.find((f) =>
            f.start.superType?.includes(NAMED_SELECTOR_SUPERTYPE),
        );
        if (unresolved != null) {
            const raw = String(unresolved.start.value);
            throw new AnimationOptionError(
                "start",
                raw,
                `named scroll-range selector ("${raw}") requires a ScrollTimeline ` +
                    `or ManualTimeline — call bindTimeline(timeline) before play() ` +
                    `to resolve the named phase to a numeric position`,
                "NAMED_SELECTOR_NO_TIMELINE",
            );
        }
    }

    /**
     * Stateless progress query. Maps [0,1] from first keyframe to last,
     * regardless of playback direction. `apply=true` invokes transform callbacks.
     */
    at(progress: number, apply: boolean = false): Record<string, ValueUnit[]> {
        // Q.WD1 S3 — the oracle path shares the named-selector guard (an unresolved
        // named-selector animation would otherwise produce NaN here too).
        this.assertNoUnresolvedNamedSelector();
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

        // Q.WB3 S2 — the numeric SoA fold (ADOPT-verdicted, `processframe-soa-
        // decision.json`). The pure-numeric iv subset folds through ONE contiguous
        // `lerpArray` over the precomputed `Float64Array` endpoint buffers (built
        // ONCE at `parse` — `frame._numericPlan`), replacing the per-channel boxed
        // `lerpValue` megamorphic dispatch on the DOMINANT single-animation path.
        // The result strides back into each numeric leaf's `value.value` slot (the
        // SAME slot `lerpValue` wrote), so the apply/composition/transform below —
        // which read the now-folded `flatVars`/`vars` — run EXACTLY as before
        // (bit-identical, `proof:processframe-soa` interp-equal). The BOXED residual
        // (color/computed/mixed) keeps the per-element `lerpValue`, UNCHANGED.
        const plan = frame._numericPlan;
        if (plan !== undefined && plan.numeric.length > 0) {
            const { numeric, from, to, out } = plan;
            lerpArray(from, to, eased, out);
            for (let s = 0; s < numeric.length; s++) {
                (numeric[s]!.value as unknown as { value: number }).value =
                    out[s]!;
            }
            for (const iv of plan.boxed) {
                lerpValue(eased, iv);
            }
        } else {
            for (const iv of frame.allInterpVars) {
                lerpValue(eased, iv);
            }
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

    // ── The per-tick ADVANCE (the play loop's lazy-start + clock step) ────
    // `advanceTo`/`onStart`/`onEnd` STAY as PUBLIC methods (the absolute-clock
    // advance the `AnimationGroup`, `group-layer-springs`, and the WAAPI shadow
    // loop drive externally), but their bodies live in `engine-playback.ts`
    // beside the rest of the play machine (Q.WF1). Thin `this`-delegates here.

    /** SYNC unless `delay > 0` — then a thenable resolving after the sleep. */
    onStart(): Promise<void> | undefined {
        return playback.onStart(this._host);
    }

    onEnd() {
        playback.onEnd(this._host);
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
        return playback.advanceTo(this._host, t);
    }

    // ── Standalone-play lifecycle machine (Q.WF1 — `engine-playback.ts`) ──
    // The rAF / WAAPI / reduced-motion play DRIVERS + the transport verbs were
    // lifted off this god-object into the colocated INTERNAL `engine-playback.ts`
    // (DF-11-A, the FULL engine-seam transposition — the fourth `engine-*.ts`).
    // Each method below is now a thin `this`-delegate over a host-passing free
    // function (`playback.*`) the class SATISFIES via the {@link PlaybackHost}
    // protocol. The `this`-bound re-derive contract is byte-preserved: the
    // functions never reassign `this.options` (the live-options identity holds),
    // the per-tick `this.frames` read + the `_interpOut` zero-alloc buffer reuse
    // + the `_boundFrame` (bound ONCE at construction) all survive the move
    // (proof:standalone-zero-alloc / proof:engine / proof:event-ordering). The
    // per-tick ADVANCE (`advanceTo`) + the SAMPLE (`interpFrames`/`at`) STAY here
    // — they are the engine's PUBLIC sampling API the play loop drives.
    //
    // `_host` is the structural cast threading `this` as the play machine's host;
    // every member the functions reach is declared on this class.
    private get _host(): PlaybackHost<V> {
        return this as unknown as PlaybackHost<V>;
    }

    /**
     * One frame of the standalone rAF play path, driven by the shared
     * `RAFPlayback.loop`. Returns whether the loop should continue.
     */
    private _frame(t: number): boolean | Promise<boolean> {
        return playback.playFrame(this._host, t);
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
        return playback.play(this._host);
    }

    /**
     * Pause playback — idempotent. Pausing an already-paused (or
     * not-yet-started) animation is a no-op, never a resume: a method named
     * `pause` pauses. Use {@link resume} for the explicit resume.
     */
    pause() {
        playback.pause(this._host);
        return this;
    }

    resume() {
        playback.resume(this._host);
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
        playback.stop(this._host);
    }

    playing() {
        return playback.playing(this._host);
    }

    /** Returns the effective time accounting for direction reversal. */
    get effectiveT(): number {
        return playback.effectiveT(this._host);
    }

    /**
     * Pure state teardown — flags, clocks, iteration. NEVER paints. This is
     * the terminal half of the rest-position contract: completion paints
     * the rest frame (via `onEnd` → `paintRest`) and then settles; the
     * reduced-motion snap paints final and then settles. Settling is
     * orthogonal to where the pixels rest.
     */
    settle() {
        playback.settle(this._host);
        return this;
    }

    /**
     * Explicit rewind: paint the INITIAL frame, then settle. This is the
     * user-facing "return to start" — rest position `initial`, painted
     * deliberately — distinct from `settle()`, which tears down state and
     * leaves the pixels where they rest.
     */
    reset() {
        playback.reset(this._host);
        return this;
    }

    setTargets(...targets: HTMLElement[]) {
        this.targets = targets;

        // Q.WB1 — the emerging-CSS Phase-2 element-AWARE resolution pass. The
        // FIRST pass (Phase 1, at `resolveKeyframes` flatten time) had no element
        // and deliberately left the element-aware nodes UNRESOLVED: `if(style(--p))`
        // (a `style(...)`-condition `if()` `resolveIf` returned intact), and the
        // `sibling-index()`/`sibling-count()` `FunctionValue`s. Now the target is
        // bound, so re-run the SAME `resolveValues` rewriter over the pre-flatten
        // template snapshot against an element-POPULATED env, then re-`parse()`.
        // Gated by `hasPhase2Node` (the common pure-Phase-1 / all-concrete
        // animation skips both the re-resolve AND the extra parse — the fast
        // target-propagate path below is unchanged for it).
        const rebuilt = this._resolveElementAwareValues();
        if (!rebuilt) {
            // The fast path (no Phase-2 node): propagate the bound target onto the
            // ALREADY-compiled interp carriers so value.js's computed-unit DOM
            // resolution reads the live box. (A Phase-2 re-`parse()` already binds
            // the targets via `compiler.parse(this.targets)`, so this is skipped on
            // the rebuilt path.)
            this.frames.forEach((frame) => {
                Object.values(frame.interpVars).forEach((values) => {
                    values.forEach(({ start, stop, value }) => {
                        start.setTargets(this.targets);
                        stop.setTargets(this.targets);
                        value.setTargets(this.targets);
                    });
                });
            });
        }

        return this;
    }

    /**
     * Q.WB1 — the emerging-CSS Phase-2 SECOND resolution pass (the gestalt P.W13
     * designed: ONE rewriter, a SECOND lifecycle point — element-populated env,
     * SAME `ResolveContext` shape). Runs over the PRE-FLATTEN
     * `compiler.templateFrames[i].vars` snapshot (the Phase-1-resolved, unflattened
     * `Record<string, ValueArray>` `parse()` re-flattens via
     * `parseAndFlattenObject`), so a Phase-1-resolved leaf — already a concrete
     * `ValueUnit` — is returned as-is by `resolveNode`, making the pass idempotent
     * over the Phase-1 result. Gated by `hasPhase2Node`: a declaration with NO
     * element-aware node is never re-resolved (zero second-pass cost).
     *
     * SSR-safe: with no bound target (or a target with no `parentElement`) the env
     * fields are OMITTED, so a residual node stays unresolved (never a throw on
     * `getComputedStyle(undefined)`) — the same posture Phase 1 holds for
     * `style(--p)` today.
     *
     * @returns `true` iff at least one template carried a Phase-2 node and the
     *   compiler was re-`parse()`d (so `setTargets` skips its fast propagate).
     */
    private _resolveElementAwareValues(): boolean {
        const templates = this.compiler.templateFrames;
        // Gate: only run the element-aware pass when SOME template carries a
        // Phase-2 node — the common case (percent/from/to + concrete values, or a
        // pure-Phase-1 if(supports)/spring()) pays zero second-pass cost.
        let anyPhase2 = false;
        for (const frame of templates) {
            const vars = frame.vars as Record<string, unknown>;
            for (const key in vars) {
                if (hasPhase2Node(vars[key])) {
                    anyPhase2 = true;
                    break;
                }
            }
            if (anyPhase2) break;
        }
        if (!anyPhase2) return false;

        const env = this._buildElementAwareEnv();
        // No element-populated env (SSR / no target) → leave the residual nodes
        // intact (idempotent, never a throw). Nothing to re-resolve.
        if (env === undefined) return false;

        // The SAME ResolveContext shape Phase 1 uses; the ONLY delta is the
        // element-populated env. The `@function` registry is irrelevant to the
        // Phase-2 arms (style/sibling-*), so an empty Map suffices.
        const ctx = makeResolveContext(
            new Map<string, CustomFunctionDescriptor>(),
            env,
        );

        let rewrote = false;
        for (const frame of templates) {
            const vars = frame.vars as Record<string, unknown>;
            for (const key in vars) {
                const value = vars[key];
                if (!(value instanceof ValueArray) || !hasPhase2Node(value)) {
                    continue;
                }
                const resolved = resolveValues(value, ctx);
                if (resolved === DROP) {
                    // Guaranteed-invalid (a style(--p) if() with no branch + no
                    // else) → OMIT the declaration (the CSS guaranteed-invalid
                    // rule), exactly as the Phase-1 adapter path does.
                    delete vars[key];
                    rewrote = true;
                    continue;
                }
                if (resolved !== value) {
                    vars[key] = resolved;
                    rewrote = true;
                }
            }
        }

        if (!rewrote) return false;

        // Re-flatten/recompile from the now-Phase-2-resolved templates. The existing
        // `parse()` re-runs `parseAndFlattenObject` over the rewritten
        // `templateFrames[i].vars` AND binds the live targets (so computed-unit
        // resolution reads the box) — one re-`parse()` per `setTargets`, paid ONLY
        // on the Phase-2 path.
        this.parse();
        return true;
    }

    /**
     * Q.WB1 — build the element-AWARE {@link ResolveEnv} from the bound target (the
     * precondition for the Phase-2 second pass). SSR-safe: with no target / no
     * `parentElement`, the relevant field is OMITTED (not assigned), so the residual
     * node stays unresolved rather than throwing. Built ONCE per `setTargets` — the
     * pass is a compile-time lowering, never on the hot path.
     *
     * @returns the populated env, or `undefined` when no target is bound at all
     *   (the whole pass is skipped — nothing element-aware can resolve).
     */
    private _buildElementAwareEnv(): ResolveEnv | undefined {
        const target = this.targets[0];
        if (target == null) return undefined;
        // The custom-prop reader: prefer the COMPUTED value, fall back to the INLINE
        // `style.getPropertyValue` (jsdom does not resolve inline/registered custom
        // props into `getComputedStyle` reliably). Returns `undefined` for an unset
        // prop — the presence/equality contract `evalStyleCondition` consumes.
        const env: ResolveEnv = {
            customProps: (name: string) => {
                let v = "";
                if (typeof getComputedStyle === "function") {
                    try {
                        v = getComputedStyle(target)
                            .getPropertyValue(name)
                            .trim();
                    } catch {
                        v = "";
                    }
                }
                if (v === "") v = target.style.getPropertyValue(name).trim();
                return v === "" ? undefined : v;
            },
        };
        const parent = target.parentElement;
        if (parent != null) {
            // 1-based DOM position (per the CSS `sibling-index()` definition).
            env.siblingIndex = () =>
                Array.prototype.indexOf.call(parent.children, target) + 1;
            env.siblingCount = () => parent.children.length;
        }
        return env;
    }

    group(...animations: KeyframesAnimation<V>[]) {
        return new AnimationGroup<V>(this, ...animations);
    }
}

export class CSSKeyframesAnimation<
    V extends Vars,
> extends KeyframesAnimation<V> {
    /**
     * Q.WD1-bind S2 (DM-22) — the timeline a scroll-range named selector resolves
     * its phase against. Stored by {@link bindTimeline} for the no-timeline guard's
     * check; `undefined` until a timeline is bound. A scroll-context operation
     * specific to CSS keyframes with named selectors (the base `Animation` class is
     * value.js-/scroll-agnostic), so the field + method live here.
     */
    private _boundTimeline?: Timeline;

    constructor(
        options?: Partial<InputAnimationOptions>,
        ...targets: HTMLElement[]
    ) {
        super(options, targets);

        this.unflatten = false;
    }

    /**
     * Q.WD1-bind S2 (DM-22) — the attach-time deferred-resolution seam. A
     * scroll-range named keyframe selector (`entry`/`exit`/`cover`/`contain`)
     * ingests OPAQUELY (the L.W1 S4 floor) and is RESOLVABLE only under a timeline;
     * `bindTimeline` is where that resolution happens. It walks `templateFrames`,
     * resolves each named-selector start to a numeric `%` `ValueUnit` via
     * {@link namedSelectorToFraction}, CLEARS the `NAMED_SELECTOR_SUPERTYPE` tag (so
     * the resolved frame is indistinguishable from an author-written `%` at the sort
     * step — no NaN), and re-compiles. The play-time guard
     * (`assertNoUnresolvedNamedSelector`) then finds zero unresolved frames and
     * passes silently — so this MUST land before the guard fires (the gate-enforced
     * sub-wave ordering: the guard over-throws on a bound animation if the resolver
     * is absent).
     *
     * Idempotent + safe to call before `fromString`: with no named frames the walk
     * is a no-op; calling it after a NaN-producing `parse()` purges the NaN frames.
     */
    bindTimeline(timeline: Timeline): this {
        this._boundTimeline = timeline;

        let resolvedAny = false;
        for (const frame of this.compiler.templateFrames) {
            if (frame.start.superType?.includes(NAMED_SELECTOR_SUPERTYPE)) {
                const fraction = namedSelectorToFraction(
                    String(frame.start.value),
                );
                // A proper numeric percentage ValueUnit; the named-selector tag is
                // CLEARED (absent on the replacement) so the sort + calcFrameTime see
                // a plain `%` start — no NaN.
                frame.start = new ValueUnit(fraction * 100, "%");
                resolvedAny = true;
            }
        }

        // Re-compile if already parsed (purge any NaN frames the prior parse made)
        // OR if we just resolved named starts — the next `parse()` then sees only
        // numeric starts. If never parsed and nothing resolved, the walk was a no-op.
        if (resolvedAny && this.compiler.frames.length > 0) {
            this.parse();
        }

        return this;
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
     * by `fromString` (L.W2 S1 — CC-6) via `recoverScrollOptions` (the
     * CSS-metadata-recovery seam); `undefined` when the input carried no scroll
     * grammar (the canonical time-clock animation). A read-only metadata field —
     * no hot-path impact, analogous to {@link propertyRegistry}. The compiler
     * (`compileToCSS`) reads it to EMIT the scroll longhands back out, closing the
     * round-trip's EMIT half.
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

        // L.W2 S1 (CC-6) — recover the scroll grammar from the SAME parse via the
        // CSS-metadata-recovery seam. Under `exactOptionalPropertyTypes`, a
        // re-parse with no scroll grammar must DELETE a stale field rather than
        // assign `undefined` into the optional.
        const timeline = recoverScrollOptions(resolved.stylesheet);
        if (timeline !== undefined) this.scrollOptions = timeline;
        else delete this.scrollOptions;

        // K.W7 S4 — surface the adapter's structured diagnostics (EMPTY_PARSE,
        // and any value.js PARSE_ERROR consumed through OnParseError) on the
        // animation. A fresh array per `fromString` so a re-parse does not
        // carry stale rows; the engine's own COMPOSITION_FALLBACK rows join it
        // at apply time. The channel is queryable; nothing is logged.
        this.diagnostics = [...resolved.diagnostics];

        // F.W8 — recover a sibling style rule's `animation` shorthand/longhands as
        // the option BASE via the CSS-metadata-recovery seam, with the
        // constructor-explicit options overriding it. The base is EMPTY (a
        // byte-identical no-op) when the input carried no style rule.
        const base = recoverAnimationOptionsBase(resolved.options);
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

        // D-LIB-1: register the parsed `@property` registry with the platform via
        // the CSS-metadata-recovery seam, so the native (WAAPI) path interpolates
        // a typed custom SMOOTHLY instead of discretely (the rAF JS path is the
        // verbatim fallback). Feature-detected — see `engine-css-metadata.ts`.
        registerPropertyDescriptors(this.propertyRegistry);

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
