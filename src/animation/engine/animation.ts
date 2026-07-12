/**
 * `engine/animation.ts` — the base `KeyframesAnimation` class over a composed
 * `FrameCompiler`. The CSS-parsing `CSSKeyframesAnimation` subclass lives in
 * the `./css` sub-zone; the play machine / interp hot-path / option-apply /
 * compile bridge are carved into `./playback` / `./interpolate` /
 * `./option-setters` / `./compile-bridge`, the element-aware resolver into
 * `../resolve/element-resolve` (R.W2 + S.B2).
 * Statically imports the heavy `@mkbabb/value.js` surface — reachable ONLY
 * through the `./index` dynamic boundary (`await loadAnimationEngine()`).
 */
import type { ValueUnit } from "@mkbabb/value.js";
import { RAFPlayback } from "../physics/playback";
import type { Diagnostic } from "../compile/adapter";
import { defaultOptions } from "../constants";
import type {
    AnimationFrame,
    AnimationOptions,
    CompositeOperator,
    InputAnimationOptions,
    TemplateAnimationFrame,
    TransformFunction,
    Vars,
} from "../constants";
// S.B4 (a06 F1/F2) — the engine carries ZERO edge to `group/`. The former
// `.group()` convenience (which reached the group ctor via the
// `internal/group-factory` service locator) is EXCISED; group construction is
// now `AnimationGroup.of(first, ...rest)` (genuine ownership — the compositor
// owns its own construction), so the engine↔group ring is one-directional
// (group → engine) BY CONSTRUCTION, with no back-edge to invert.
import { FrameCompiler } from "../compile/frame-compiler";
import {
    type ParsedVarMap,
    transformTargetsStyle,
} from "../compile/parse-flatten";
import * as playback from "./play-lifecycle";
import { PlaybackState } from "./playback-state";
import * as interpolate from "./interpolate";
import * as setters from "./option-setters";
import * as compileBridge from "./compile-bridge";
import { bindTargets } from "../resolve/element-resolve";

// `getAnimationId` moved to the value.js-free `internal/animation-id.ts` leaf
// (R.W2c — kills the group→engine edge); re-exported, surface UNCHANGED.
export { getAnimationId } from "../internal/animation-id";

let nextId = 0;

/**
 * The core animation engine — keyframes, timing, interpolation, playback.
 *
 * PKG-3 RENAME (L.W8): formerly `Animation`; renamed to `KeyframesAnimation`
 * because the old name collided with the ambient `globalThis.Animation` (WAAPI),
 * leaking a suffixed collision alias into the d.ts. The legacy `Animation`
 * re-export alias was DROPPED in 5.0.0 (Q.WE1 — NO-LEGACY).
 */
export class KeyframesAnimation<V extends Vars = Vars> {
    id: number = nextId++;
    name: string | undefined;
    superKey: string | undefined;

    targets: HTMLElement[];

    options: AnimationOptions;

    /** The frame-compilation half — template frames → sampled `frames[]`. The
     * class composes one and delegates `addFrame`/`parse` + the frame accessors
     * to it. READ-ONLY surface (G.W19): the backing `_compiler` is written ONLY
     * by the constructor + `adoptCompiled` (via `_setCompiler`); an external
     * `animation.compiler = …` reach-in is a COMPILE error (the live-options
     * desync lock). */
    private _compiler!: FrameCompiler<V>;

    get compiler(): FrameCompiler<V> {
        return this._compiler;
    }

    /** THE rAF owner for this animation — the standalone play loop and the WAAPI
     * shadow tick both ride it, so `stop()` halts either uniformly. */
    readonly playback = new RAFPlayback();

    /** The standalone-play machine's OWN run-state (R.W2 — DI by composition):
     * the deferred play resolver, the held play promise, the live WAAPI handles,
     * the bound frame callback, the hoisted zero-alloc interp buffer. The five
     * fields formerly privacy-inverted onto the class body + re-published through
     * the excised `PlaybackHost` interface; the `./playback` free functions now
     * own them via `this._playback` directly (no cast, no re-publication). */
    readonly _playback: PlaybackState;

    // The run-state FSM (S.B2 — C-15): single-STORAGE in `_playback`, exposed as
    // PUBLIC accessor delegates so every external writer keeps its `anim.<field> =`
    // write while the backing store is unified (the engine-internal hot path reads
    // `anim._playback.*` directly). `managed` stays a real field (ownership).
    get startTime(): number | undefined { return this._playback.startTime; }
    set startTime(v: number | undefined) { this._playback.startTime = v; }
    get pausedTime(): number { return this._playback.pausedTime; }
    set pausedTime(v: number) { this._playback.pausedTime = v; }
    get t(): number { return this._playback.t; }
    set t(v: number) { this._playback.t = v; }
    get iteration(): number { return this._playback.iteration; }
    set iteration(v: number) { this._playback.iteration = v; }
    get started(): boolean { return this._playback.started; }
    set started(v: boolean) { this._playback.started = v; }
    get done(): boolean { return this._playback.done; }
    set done(v: boolean) { this._playback.done = v; }
    get reversed(): boolean { return this._playback.reversed; }
    set reversed(v: boolean) { this._playback.reversed = v; }
    get paused(): boolean { return this._playback.paused; }
    set paused(v: boolean) { this._playback.paused = v; }

    /** Structured parse/honoring diagnostics (K.W7 S4) — a FLAT additive array
     * of stable-coded {@link Diagnostic} rows surfaced from `resolveKeyframes` +
     * the engine's composition-fallback rows; empty on a clean parse. Every
     * SILENT fallback site is mirrored here (`proof:diagnostics-channel`). */
    diagnostics: Diagnostic[] = [];

    /** The captured UNDERLYING base value per composited leaf (K.W7 S1) — the
     * per-element numeric base `add`/`accumulate` accumulates ONTO; empty for a
     * pure-`replace` animation. INTERNAL — read by `./interpolate` (R.W2). */
    _compositionBase: Map<string, number[]> = new Map();

    /** Properties whose non-numeric composite already emitted its
     * `COMPOSITION_FALLBACK` row (once per property, not per frame). INTERNAL —
     * read by `./interpolate` (R.W2). */
    _compositionFallbackSeen: Set<string> = new Set();

    /** True once a non-`replace` operator was seen — the hot path skips ALL
     * composition work when false. INTERNAL — read by `./interpolate` (R.W2). */
    _hasComposition: boolean = false;

    /** True when an `AnimationGroup` drives this animation's `advanceTo()`/
     * `interpFrames()` from its own rAF loop. Standalone `.play()` throws when
     * set rather than racing the group. */
    managed: boolean = false;

    /** If the most recent `play()` fell back from WAAPI to rAF despite
     * `useWAAPI: true`, this records the reason. Queryable; no console output. */
    waapiIneligibleReason: string | undefined = undefined;

    unflatten: boolean = true;

    /** The compile-stable union of every frame's `flatVars` keys, fixed at
     * `parse` — what `clearBuffer` null-fills to keep a reused buffer stale-free
     * WITHOUT `delete` (F.W4 S1, the V8 dictionary-mode trap). Exposed read-only
     * as `flatKeys` so the group sizes its composite buffer the same way.
     * INTERNAL — read by `./interpolate` (R.W2). */
    _stableKeys: string[] = [];

    /** The consumer's EXPLICIT constructor options (NOT merged with defaults) —
     * retained so `fromString` can layer a parsed style-rule `animation`
     * shorthand UNDER them (constructor-explicit wins, F.W8). */
    protected _ctorOptions: Partial<InputAnimationOptions> = {};

    /** The compile-stable union of this animation's interpolated keys. */
    get flatKeys(): readonly string[] {
        return this._stableKeys;
    }

    /**
     * The instance's ONE default DOM-style renderer, allocated once. "Did the
     * consumer supply a custom transform?" is a reference comparison against this
     * single value ({@link usesDefaultRenderer}) — typed and bind-proof.
     */
    protected readonly _defaultTransform: TransformFunction<V> = (vars) =>
        transformTargetsStyle(vars, this.targets);

    /** True when `fn` is this instance's default DOM-style renderer. */
    usesDefaultRenderer(fn: TransformFunction<V> | undefined): boolean {
        return fn === this._defaultTransform;
    }

    /**
     * Fire a lifecycle `AnimationEvent` on each bound target (R.W2 — F-6, body in
     * `./playback`). INTERNAL: the play machine calls it on the concrete
     * animation — kept ON the class but NOT `private`, reached by direct field
     * access (the old `PlaybackHost` re-publication + cast are excised).
     */
    dispatchAnimationEvent(type: string) {
        playback.dispatchAnimationEvent(this, type);
    }

    constructor(
        options?: Partial<InputAnimationOptions>,
        targets?: HTMLElement[] | HTMLElement | undefined,
        name?: string | undefined,
        superKey?: string | undefined,
    ) {
        this.options = {} as AnimationOptions;

        // Create the compiler BEFORE `setOptions` — it holds a live reference to
        // `this.options` (the setters mutate that object in place), and
        // `setOptions` → `applyDuration` reads `this.frames` (compiler-delegated),
        // so the compiler must exist first.
        this._compiler = new FrameCompiler<V>(this.options);

        // The standalone-play run-state (R.W2 — DI). The frame callback is bound
        // ONCE here and handed to `PlaybackState`, so the play loop never mints a
        // per-loop closure and the bound identity is stable for the lifetime.
        this._playback = new PlaybackState(this._frame.bind(this));

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

    // ── Frame-compiler delegation — the frame data + compile pipeline live on
    // `this.compiler`; these accessors keep the public surface intact.

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
        this.compiler.addFrame(start, vars, transform, timingFunction, composition);
        return this as unknown as KeyframesAnimation<K>;
    }

    /** Compile the template frames into the sampled `frames[]` (R.W2 body in
     * `./compile-bridge`). Chainable. */
    parse() {
        compileBridge.parse(this);
        return this;
    }

    /**
     * Adopt another animation's ALREADY-COMPILED state as ONE atomic motion
     * (G.W19 — body in `./compile-bridge`): moves the `{ compiler, options,
     * unflatten }` triad + re-binds the live-options reference BY CONSTRUCTION
     * (`proof:adopt-compiled`). Chainable.
     */
    adoptCompiled(source: KeyframesAnimation<V>): this {
        compileBridge.adoptCompiled(this, source);
        return this;
    }

    /** INTERNAL (R.W2): the sanctioned backing-field write for `_compiler` (used
     * ONLY by `./compile-bridge`'s `adoptCompiled`). The `compiler` accessor
     * stays get-only — an external `animation.compiler = …` reach-in is a COMPILE
     * error (the G.W19 live-options-desync lock). */
    _setCompiler(compiler: FrameCompiler<V>): void {
        this._compiler = compiler;
    }

    // ── Option setters (fluent, fail-explicit) — each is a thin chainable
    // delegate over `./option-setters` (the normalize + apply logic lives there).

    setTimingFunction(timingFunction: InputAnimationOptions["timingFunction"]) {
        setters.applyTimingFunction(this, timingFunction);
        return this;
    }

    setIterationCount(iterationCount: InputAnimationOptions["iterationCount"]) {
        setters.applyIterationCount(this, iterationCount);
        return this;
    }

    setDuration(duration: InputAnimationOptions["duration"]) {
        setters.applyDuration(this, duration);
        return this;
    }

    setDelay(delay: InputAnimationOptions["delay"]) {
        setters.applyDelay(this, delay);
        return this;
    }

    setDirection(direction: InputAnimationOptions["direction"]) {
        setters.applyDirection(this, direction);
        return this;
    }

    setFillMode(fillMode: InputAnimationOptions["fillMode"]) {
        setters.applyFillMode(this, fillMode);
        return this;
    }

    setUseWAAPI(useWAAPI: InputAnimationOptions["useWAAPI"]) {
        setters.applyUseWAAPI(this, useWAAPI);
        return this;
    }

    setRespectReducedMotion(
        respectReducedMotion: InputAnimationOptions["respectReducedMotion"],
    ) {
        setters.applyRespectReducedMotion(this, respectReducedMotion);
        return this;
    }

    setColorSpace(colorSpace: InputAnimationOptions["colorSpace"]) {
        setters.applyColorSpace(this, colorSpace);
        return this;
    }

    setHueMethod(hueMethod: InputAnimationOptions["hueMethod"]) {
        setters.applyHueMethod(this, hueMethod);
        return this;
    }

    setComposite(composite: InputAnimationOptions["composite"]) {
        setters.applyComposite(this, composite);
        return this;
    }

    setOptions(options: Partial<InputAnimationOptions>) {
        setters.applyOptions(this, options);
        return this;
    }

    reverse() {
        // The startTime clock-shift that keeps `effectiveT` continuous across the
        // flip is a playback concern — body in `./playback` (R.W2 delegation).
        playback.reverse(this);
        return this;
    }

    fillForwards() {
        this.interpFrames(this.options.duration, true);
    }

    fillBackwards() {
        this.interpFrames(0, true);
    }

    /** Where the playhead rests after a completed play (forwards/both → final;
     * none/backwards → initial) — body in `./interpolate`. */
    get restPosition(): "initial" | "final" {
        return interpolate.restPosition(this);
    }

    /** Paint the rest frame per the fill contract (body in `./interpolate`). */
    paintRest() {
        interpolate.paintRest(this);
    }

    /** The named-selector PLAY-TIME guard (Q.WD1 S3 — body in `./interpolate`).
     * INTERNAL (R.W2): the play machine + `at()` call it; NOT `private`. */
    assertNoUnresolvedNamedSelector(): void {
        interpolate.assertNoUnresolvedNamedSelector(this);
    }

    /** Stateless progress query — maps [0,1] from first to last keyframe,
     * direction-agnostic (`apply=true` invokes transforms). Body in
     * `./interpolate`. */
    at(progress: number, apply: boolean = false): Record<string, ValueUnit[]> {
        return interpolate.at(this, progress, apply);
    }

    /**
     * Interpolate all active frames at time `t` — the hot path (once per rAF
     * frame). R.W2 body in `./interpolate`; this is the thin public sampling
     * delegate the group, sequence, WAAPI build, and `at()` all drive. Zero-alloc
     * + fast-properties contract preserved (proof:standalone-zero-alloc /
     * proof:interp-fastprops).
     */
    interpFrames(
        t: number,
        transformFrames: boolean = false,
        out?: Record<string, ValueUnit[]>,
    ): Record<string, ValueUnit[]> {
        return interpolate.interpFrames(this, t, transformFrames, out);
    }

    // ── The play machine + transport verbs (`./playback`) ─────────────────
    // `advanceTo`/`onStart`/`onEnd` (the per-tick absolute-clock ADVANCE the
    // `AnimationGroup` + WAAPI shadow loop drive externally) and the transport
    // verbs (`play`/`pause`/`resume`/`toggle`/`stop`/`settle`/`reset`/`playing`/
    // `effectiveT`) are thin `this`-delegates over the free functions in
    // `./playback` — which OWN the run-state via the composed `this._playback`
    // (`PlaybackState`) struct (R.W2: no `_host` cast, no `PlaybackHost`
    // protocol). The `this`-bound re-derive contract is byte-preserved (the
    // functions never reassign `this.options`; the per-tick `this.frames` read +
    // the `this._playback._interpOut`/`._boundFrame` reuse survive —
    // proof:standalone-zero-alloc / proof:engine / proof:event-ordering). The
    // authoritative per-verb docs live with the implementations in `./playback`.

    onStart(): Promise<void> | undefined {
        return playback.onStart(this);
    }

    onEnd() {
        playback.onEnd(this);
    }

    advanceTo(t: number): number | Promise<number> {
        return playback.advanceTo(this, t);
    }

    /** One frame of the standalone rAF play path (driven by `RAFPlayback.loop`). */
    private _frame(t: number): boolean | Promise<boolean> {
        return playback.playFrame(this, t);
    }

    /** The completion front-door (G.W13) — `await anim.finished` resolves once
     * the in-flight play settles (a settled/never-played animation resolves
     * immediately). Reads the ONE held promise off the composed `_playback`. */
    get finished(): Promise<void> {
        return this._playback._playingPromise ?? Promise.resolve();
    }

    async play(): Promise<void> {
        return playback.play(this);
    }

    pause() {
        playback.pause(this);
        return this;
    }

    resume() {
        playback.resume(this);
        return this;
    }

    /** The explicit flip: pauses if playing, resumes if paused. */
    toggle() {
        return playback.toggle(this);
    }

    stop() {
        playback.stop(this);
    }

    playing() {
        return playback.playing(this);
    }

    get effectiveT(): number {
        return playback.effectiveT(this);
    }

    settle() {
        playback.settle(this);
        return this;
    }

    reset() {
        playback.reset(this);
        return this;
    }

    setTargets(...targets: HTMLElement[]) {
        this.targets = targets;
        // S.B2 — the element-binding body lives in `../resolve/element-resolve`
        // (the emerging-CSS Phase-2 element-aware pass + the fast target-propagate
        // fallback): it coheres with the resolve zone, not the run-state class.
        bindTargets(this);
        return this;
    }

}

// R.W2/S.B2 carve homes: `CSSKeyframesAnimation` → `./css` sub-zone (F-4); the
// Phase-2 element-aware resolver → `../resolve/element-resolve` (F-7); the
// heavy-surface bundling re-exports → `./index` (the engine barrel; gestalt §5).
