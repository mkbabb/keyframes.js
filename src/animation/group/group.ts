import { RAFPlayback } from "../physics/playback";
// PKG-3 (L.W8 §S4): the engine class is `KeyframesAnimation` (formerly
// `Animation`; the @deprecated alias was DROPPED in 5.0.0 — Q.WE1). The value
// import provides the runtime constructor (the `instanceof` guard) + the type.
// `getAnimationId` is the value.js-free leaf (R.W2c — kills group→engine edge).
import { KeyframesAnimation } from "../engine";
import { getAnimationId } from "../internal/animation-id";
import { renderMultiTarget, requireEntry } from "./entries";
import { advanceBatched, advanceSlice } from "./yield-batch";
import { advanceLayerSprings } from "./springs";
import type { LayerTransitionSpring } from "./springs";
import { compositeFrame } from "./compositor";
import * as layerApi from "./layer-api";
// S.B5 (a19 F1) — the TRANSPORT verbs (play/pause/resume/stop/settle/reset/
// playing + the reduced-motion snap) are FREE FUNCTIONS in the colocated
// `./lifecycle` module; the methods below are thin `this`-delegates over them.
import * as lifecycle from "./lifecycle";
import { createGroupCompositeStorage } from "./composite-storage";
import type {
    AnimationLayerConfig,
    TransformFunction,
    Vars,
} from "../constants";
import { defaultLayerConfig, NOOP_TRANSFORM } from "../constants";

// R.W2 — the `group-layer-springs.ts` junk-drawer 3-way split (entry-set helpers
// → `./entries`, scheduler-yield batching → `./yield-batch`, K.W11 PHYS-C
// spring-weight helpers → `./springs`) + the `transformFramesGrouped`/
// `residualBlendArm` composite carve → `./compositor` (the SoA fold itself lives in
// `./soa`). The cached plans and scratch stay in one private composite store. The
// `LayerTransitionSpring` option type is re-exported so the public
// `transitionLayer`/`crossfade` signatures read unchanged.
export type { LayerTransitionSpring };

// S.B4 (a04) — the entry/object/input shapes live in the `./types` leaf.
import type {
    AnimationGroupEntry,
    AnimationGroupObject,
    AnimationGroupInput,
} from "./types";

export class AnimationGroup<V extends Vars> {
    animations: AnimationGroupObject<V> = {};
    /** The group's composite transform. Defaults to a real no-op at the FIELD
     * (I.W0 S3) — a childless/pre-`parse()` group composites nothing instead of
     * throwing; the constructor overrides it with the first child's transform. */
    transform: TransformFunction<V> = NOOP_TRANSFORM;

    superKey: string | undefined;

    paused = false;
    started = false;
    done = false;

    /** When true, `play()` honors `prefers-reduced-motion: reduce` by snapping
     * every child to its final frame in one composite, no rAF loop. Default false. */
    respectReducedMotion = false;

    /** Children-per-slice before `advanceTo()` yields to the main thread; larger
     * groups batch with a `scheduler.yield()` between slices (INP relief). */
    static readonly YIELD_BATCH = 32;

    /** Construct a group from a first animation + rest (S.B4 / a06 F1/F2 — the
     * genuine-ownership replacement for the excised `KeyframesAnimation.group()`
     * service locator; each input is a bare animation or `{ animation, layer }`). */
    static of<V extends Vars>(
        first: KeyframesAnimation<V> | AnimationGroupInput<V>,
        ...rest: (KeyframesAnimation<V> | AnimationGroupInput<V>)[]
    ): AnimationGroup<V> {
        return new AnimationGroup<V>(first, ...rest);
    }

    singleTarget = true;

    /**
     * T.A6 — true when the group's composite `transform` is a CUSTOM (non-DOM)
     * consumer that expects the nested PLAIN authored-shape projection (the
     * "animate any object" seam), inherited from the first child's own
     * `unflatten` flag alongside its transform. False (the default) keeps the
     * DOM-style default renderer's flat composite map, byte-unchanged.
     */
    unflatten = false;

    lastTickTime: number = 0;

    /** THE rAF owner for the group's draw loop. */
    readonly playback = new RAFPlayback();
    /** Native effects installed by the additive group-WAAPI fast lane.
     * INTERNAL: lifecycle owns pause/resume/cancel; an empty array means the
     * group is on its ordinary rAF compositor path. */
    readonly _waAnimations: globalThis.Animation[] = [];
    /** True while the current play is delegated to native effects. The group
     * still runs its shadow transport loop so events and completion retain the
     * rAF contract, but it does not overwrite native compositor output. */
    _waapiDelegated = false;
    resolvePromise: ((value: void | PromiseLike<void>) => void) | null = null;
    /** The ONE held play promise the `finished` front-door exposes. INTERNAL
     * (S.B5) — read/written by the transport free functions in `./lifecycle`. */
    _playingPromise: Promise<void> | null = null;

    /** Pre-bound frame callback — allocated once to avoid a per-loop closure.
     * INTERNAL (S.B5) — read by `./lifecycle`'s `play`/`resume` loop start. */
    _boundFrame: (t: number) => boolean | Promise<boolean>;

    /** Cached entries sorted by layer zIndex (see `getEntries`). */
    private _entries: AnimationGroupEntry<V>[] = [];
    private _entriesDirty = true;

    /** Long-lived zero-allocation compositor state, absent from the public API. */
    private readonly _composite = createGroupCompositeStorage();

    /** K.W11 PHYS-C — true iff ANY layer carries a `weightSpring`; when false (the
     * universal case) `advanceTo` skips the per-frame spring scan (ZERO new work).
     * INTERNAL (R.W2) — set by `./layer-api`'s `transitionLayer`. */
    _hasLayerSprings = false;

    constructor(...inputs: (KeyframesAnimation<V> | AnimationGroupInput<V>)[]) {
        this._boundFrame = this._frame.bind(this);

        const animations: KeyframesAnimation<V>[] = [];

        for (const input of inputs) {
            let animation: KeyframesAnimation<V>;
            let layerConfig: Partial<AnimationLayerConfig> | undefined;

            if (input instanceof KeyframesAnimation) {
                animation = input;
            } else {
                animation = input.animation;
                layerConfig = input.layer;
            }

            // Inherit the transform from the first child that has one. A child
            // built before `parse()` (empty `frames`) leaves the no-op standing,
            // so the composite paints a harmless empty frame, not a throw (I.W0 S3).
            if (
                this.transform === NOOP_TRANSFORM &&
                animation.frames[0] != null
            ) {
                this.transform = animation.frames[0].transform;
                // T.A6 — inherit the child's flatten discipline alongside its
                // transform: a custom-transform child (`unflatten = true`) makes
                // the group project the nested PLAIN authored-shape composite.
                this.unflatten = animation.unflatten;
            }

            const name = getAnimationId(animation);

            this.animations[name] = {
                values: {},
                animation,
                layer: { ...defaultLayerConfig, ...layerConfig },
            };

            animation.managed = true;
            animations.push(animation);
        }

        this.singleTarget = animations.every(
            (animation) => animation.targets[0] === animations[0]?.targets[0],
        );

        this.invalidateEntries();
    }

    // ── Entry cache ──────────────────────────────────────────────────

    /** The animation entries sorted by layer zIndex, dirty-flag cached — rebuilt
     * only on a mutation. INTERNAL (R.W2): read by the colocated `./compositor`/
     * `./entries`/`./scheduler`/`./springs` helpers + all hot-path iteration. */
    getEntries(): AnimationGroupEntry<V>[] {
        if (this._entriesDirty) {
            this._entries = Object.values(this.animations);
            this._entries.sort((a, b) => a.layer.zIndex - b.layer.zIndex);
            this._entriesDirty = false;
        }
        return this._entries;
    }

    /** Mark entries cache stale. Called at all mutation boundaries.
     * INTERNAL (R.W2) — also called by `./layer-api`. */
    invalidateEntries(): void {
        this._entriesDirty = true;
        this._composite.groupedKeysDirty = true;
    }

    setSuperKey(superKey: string) {
        this.superKey = superKey;
        for (const entry of this.getEntries()) {
            entry.animation.superKey = superKey;
        }
        return this;
    }

    setTargets(...targets: HTMLElement[]) {
        const entries = this.getEntries();
        for (const entry of entries) {
            entry.animation.setTargets(...targets);
        }

        this.singleTarget = entries.every(
            (entry) =>
                entry.animation.targets[0] === entries[0]?.animation.targets[0],
        );

        return this;
    }

    /** Composite all values into a single grouped transform (single-target,
     * per-frame). R.W2 — `private` (lib-group F8): the PUBLIC single-frame-paint
     * entry is `render(t?)`; the body lives in `./compositor`. Thin delegate. */
    private transformFramesGrouped(t: number) {
        return compositeFrame(this, this._composite, t);
    }

    /**
     * Render the current composition as a static frame — the public entry for
     * state mutated outside the rAF loop (scrubbing, restore, pause snapshots).
     * R.W2 — the silent `|| performance.now()` fabrication is EXCISED: the
     * composite `t` is non-normative for a pure-CSS transform, so a caller with a
     * clock passes it (`render(now)`); a scrub uses the group's REAL `lastTickTime`
     * (0 for a never-ticked group), never a fabricated wall-clock.
     */
    render(t: number = this.lastTickTime): void {
        if (this.singleTarget) {
            // Native group effects own visual output while delegated; retain
            // the exact compositor paint at the terminal tick before settle
            // cancels those effects, so fill/commit semantics remain parity-
            // safe. Every non-terminal frame is shadow-only.
            if (!this._waapiDelegated || this.done) {
                this.transformFramesGrouped(t);
            }
        } else {
            renderMultiTarget(this.getEntries());
        }
    }

    /** Set a child's current time without touching its siblings (updates
     * `pausedTime` for a jump-free resume). Chainable; `render()` to reflect it. */
    setChildTime(nameOrAnim: string | KeyframesAnimation<V>, t: number) {
        const entry = requireEntry(this.animations, nameOrAnim, "setChildTime");
        const anim = entry.animation;
        anim.t = t;
        if (anim.startTime !== undefined) {
            anim.pausedTime = anim.startTime + t;
        }
        return this;
    }

    /** Advance all child animations to absolute clock `t`. SYNC on the steady path
     * (J.W6 S1): all-synchronous children advance with no per-frame microtask hop;
     * a thenable only on an async child or the over-`YIELD_BATCH` yield path. */
    advanceTo(t: number): this | Promise<this> {
        // K.W11 PHYS-C — advance any spring-driven layer weights by the frame
        // delta BEFORE updating `lastTickTime`. A first tick has `lastTickTime ===
        // 0`, so clamp the delta to 0 (the spring integrates from the next frame).
        const dt = this.lastTickTime === 0 ? 0 : t - this.lastTickTime;
        if (this._hasLayerSprings) this.advanceLayerSprings(dt);

        this.lastTickTime = t;
        this.started = true;

        // The slice fan-out / over-`YIELD_BATCH` batched advance are pure
        // functions in `./scheduler`; `advanceSlice` returns `undefined` on the
        // all-sync fast path (J.W6 S1 — zero microtask).
        const entries = this.getEntries();
        const BATCH = AnimationGroup.YIELD_BATCH;
        const pending =
            entries.length <= BATCH
                ? advanceSlice(entries, t)
                : advanceBatched(entries, t, BATCH);
        return pending ? pending.then(() => this) : this;
    }

    /** One frame of the group's draw loop: tick all children, then render. */
    private _frame(t: number): boolean | Promise<boolean> {
        const advanced = this.advanceTo(t);
        return typeof (advanced as Promise<this>).then === "function"
            ? (advanced as Promise<this>).then(() => this._renderFrame(t))
            : this._renderFrame(t);
    }

    /** The post-advance render half of `_frame` — composite, or settle on done. */
    private _renderFrame(t: number): boolean {
        if (this.paused) {
            return false;
        }

        if (this.singleTarget) {
            // The shadow transport still advances every child, but delegated
            // native effects own visual output until the terminal tick. Keep
            // the group completion calculation here because `compositeFrame`
            // is intentionally skipped on the delegated steady path.
            this.done = this.getEntries().every(
                (entry) => entry.animation.done,
            );
            if (!this._waapiDelegated || this.done) {
                this.transformFramesGrouped(t);
            }
        } else {
            this.done = renderMultiTarget(this.getEntries());
        }

        if (!this.done) {
            return true;
        }

        // Completion: every child already painted its rest frame + the composite
        // rendered the blend, so settle is pure teardown, never a repaint (a
        // completion `reset()` would end a fadeIn group invisible at frame 0).
        this.settle();
        lifecycle.resolvePlay(this);
        return false;
    }

    /** The completion front-door (G.W13) — `await group.finished` resolves once
     * the in-flight composite play settles. Exposes the ONE held `_playingPromise`
     * (a settled/never-played group resolves immediately). */
    get finished(): Promise<void> {
        return this._playingPromise ?? Promise.resolve();
    }

    /** Start the group. Resolves when all children complete (or on stop/reset).
     * Re-entrant, and PRM-aware — body in `./lifecycle` (S.B5 / a19 F1). */
    async play(): Promise<void> {
        return lifecycle.play(this);
    }

    // ── Managed-child lifecycle contract: a managed child is loop-owned — it
    // throws on direct `play()`; `pause()` records the last rAF clock on each
    // child's `pausedTime` so `resume()` adjusts `startTime` jump-free;
    // `resume()` un-pauses children DIRECTLY (never `child.resume()`); and
    // `settle()` releases the child (`managed = false`). This source comment is
    // the authoritative contract for proof:engine and for consumers.

    /** Pause the group — idempotent. Cancels the rAF loop + renders a final-frame
     * snapshot so the visual matches the pause moment; records each child's
     * jump-free `pausedTime`. Body in `./lifecycle` (S.B5). */
    pause() {
        lifecycle.pause(this);
        return this;
    }

    /** Resume the group — idempotent. Unpauses every child DIRECTLY (the group's
     * draw loop owns the ticking). Body in `./lifecycle` (S.B5). */
    resume() {
        lifecycle.resume(this);
        return this;
    }

    /** The explicit flip: pauses if playing, resumes if paused. */
    toggle() {
        return lifecycle.toggle(this);
    }

    /** Pure state teardown — never paints. Releases every child (`managed = false`,
     * `child.settle()`) and clears the group flags. Body in `./lifecycle` (S.B5). */
    settle() {
        lifecycle.settle(this);
        return this;
    }

    /** Explicit rewind: paint every started child back to its INITIAL frame, then
     * settle — the user-facing "return to start". Body in `./lifecycle` (S.B5). */
    reset() {
        lifecycle.reset(this);
        return this;
    }

    /** Halt the draw loop, rewind to the initial frame (the transport-stop
     * semantic the demo's controls expect), and resolve any pending `play()`.
     * Body in `./lifecycle` (S.B5). */
    stop() {
        lifecycle.stop(this);
        return this;
    }

    playing() {
        return lifecycle.playing(this);
    }

    // R.W2 — `forcePause`/`forcePlay` EXCISED (lib-group §5: test-scaffold leaks
    // with zero src/demo usage). The honest lifecycle is `pause()`/`resume()`.

    // ── Layer management + spring-transition API (R.W2 — bodies in `./layer-api`;
    // these are the thin chainable delegates) ─────────────────────────────────

    /** Set layer config for an animation by name or reference. Chainable. */
    setLayerConfig(
        nameOrAnim: string | KeyframesAnimation<V>,
        config: Partial<AnimationLayerConfig>,
    ) {
        layerApi.setLayerConfig(this, nameOrAnim, config);
        return this;
    }

    /** Convenience toggle for enabling/disabling a layer. Chainable. */
    setLayerEnabled(nameOrAnim: string | KeyframesAnimation<V>, enabled: boolean) {
        return this.setLayerConfig(nameOrAnim, { enabled });
    }

    /** Read the layer config for an animation by name or reference. */
    getLayerConfig(
        nameOrAnim: string | KeyframesAnimation<V>,
    ): AnimationLayerConfig | undefined {
        return layerApi.getLayerConfig(this, nameOrAnim);
    }

    /** Spring a layer's blend `weight` to `weight` (K.W11 PHYS-C — body in
     * `./layer-api`; a mid-flight re-target re-seats velocity-continuously). */
    transitionLayer(
        nameOrAnim: string | KeyframesAnimation<V>,
        target: { weight: number; spring?: LayerTransitionSpring },
    ): this {
        layerApi.transitionLayer(this, nameOrAnim, target);
        return this;
    }

    /** Crossfade two layers (K.W11 PHYS-C — body in `./layer-api`): two spring
     * `transitionLayer` calls, a→0 and b→1. Chainable. */
    crossfade(
        a: string | KeyframesAnimation<V>,
        b: string | KeyframesAnimation<V>,
        options?: { spring?: LayerTransitionSpring },
    ): this {
        layerApi.crossfade(this, a, b, options);
        return this;
    }

    /** Advance every spring-driven layer weight by `dt` ms (K.W11 PHYS-C). Called
     * from `advanceTo` ONLY when `_hasLayerSprings` is true. R.W2 (lib-group C2):
     * the integrate BODY moved to `./springs`; this thin delegate updates
     * `_hasLayerSprings` from its "any still active?" return. */
    private advanceLayerSprings(dt: number): void {
        this._hasLayerSprings = advanceLayerSprings(this.getEntries(), dt);
    }
}
