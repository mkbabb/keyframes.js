import { withReducedMotion } from "../internal/reduced-motion";
import { RAFPlayback } from "../physics/playback";
// PKG-3 (L.W8 §S4): the engine class is `KeyframesAnimation` (formerly
// `Animation`; the @deprecated alias was DROPPED in 5.0.0 — Q.WE1). The value
// import provides the runtime constructor (the `instanceof` guard) + the type.
// `getAnimationId` is the value.js-free leaf (R.W2c — kills group→engine edge).
import { KeyframesAnimation } from "../engine";
import { getAnimationId } from "../internal/animation-id";
import {
    renderMultiTarget,
    requireEntry,
    setChildrenPaused,
    snapChildrenToFinal,
} from "./entries";
import { advanceBatched, advanceSlice } from "./yield-batch";
import { advanceLayerSprings } from "./springs";
import type { LayerTransitionSpring } from "./springs";
import { compositeFrame } from "./compositor";
import * as layerApi from "./layer-api";
import type { SoALayerPlan } from "./soa";
import type {
    AnimationLayerConfig,
    TransformFunction,
    Vars,
} from "../constants";
import { defaultLayerConfig, NOOP_TRANSFORM } from "../constants";

// R.W2 — the `group-layer-springs.ts` junk-drawer 3-way split (entry-set helpers
// → `./entries`, scheduler-yield batching → `./yield-batch`, K.W11 PHYS-C
// spring-weight helpers → `./springs`) + the `transformFramesGrouped`/
// `boxedBlendArm` composite carve → `./compositor` (the SoA fold itself lives in
// `./soa`). `_soaPlans`/`_compositeBuf` stay instance state here. The
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

    lastTickTime: number = 0;

    /** THE rAF owner for the group's draw loop. */
    readonly playback = new RAFPlayback();
    resolvePromise: ((value: void | PromiseLike<void>) => void) | null = null;
    private _playingPromise: Promise<void> | null = null;

    /** Pre-bound frame callback — allocated once to avoid a per-loop closure. */
    private _boundFrame: (t: number) => boolean | Promise<boolean>;

    /** Cached entries sorted by layer zIndex (see `getEntries`). */
    private _entries: AnimationGroupEntry<V>[] = [];
    private _entriesDirty = true;

    /** Long-lived composite buffer, cleared in place each frame (zero-alloc).
     * INTERNAL (R.W2) — read/written by `./compositor`. */
    _grouped: Record<string, unknown> = {};

    /** The compile-stable union of every child's contributed keys — what `_grouped`
     * is null-filled to each frame so the composite clears WITHOUT `delete` (F.W4
     * S2; fold in `./entries`). INTERNAL (R.W2) — the `./compositor` null-fill. */
    _groupedKeys: string[] = [];
    _groupedKeysDirty = true;

    /** P.W2 — the SoA composite layout for the `add`/`weighted` blend arms (the
     * validated 3.7×, bit-identical): one {@link SoALayerPlan} per entry, the FLAT
     * pure-numeric pairs hoisted into a {@link Float64Array} fold (built by
     * `buildSoAPlans` in `./soa`, rebuilt ONLY on a structural change). INTERNAL
     * (R.W2) — read/written by `./compositor`. */
    _soaPlans: SoALayerPlan[] | null = null;
    /** The long-lived SoA fold scratch — the contiguous numeric accumulate buffer,
     * sized to the WIDEST single-layer pair count once per structural change
     * (reused, zero per-frame alloc). INTERNAL (R.W2) — read by `./compositor`. */
    _compositeBuf: Float64Array | null = null;

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
        this._groupedKeysDirty = true;
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
        return compositeFrame(this, t);
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
            this.transformFramesGrouped(t);
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
            this.transformFramesGrouped(t);
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
        this._resolvePlay();
        return false;
    }

    private _resolvePlay() {
        const resolve = this.resolvePromise;
        this.resolvePromise = null;
        resolve?.();
    }

    /** The completion front-door (G.W13) — `await group.finished` resolves once
     * the in-flight composite play settles. Exposes the ONE held `_playingPromise`
     * (a settled/never-played group resolves immediately). */
    get finished(): Promise<void> {
        return this._playingPromise ?? Promise.resolve();
    }

    /** Start the group. Resolves when all children complete (or on stop/reset).
     * Re-entrant: an in-flight `play()` returns the same promise. Under
     * `respectReducedMotion` + an active query, snaps to final (no rAF loop). */
    async play(): Promise<void> {
        if (this._playingPromise) return this._playingPromise;

        const result = withReducedMotion(
            this.respectReducedMotion,
            () => this._playReducedMotion(),
            () =>
                new Promise<void>((resolve) => {
                    this.resolvePromise = resolve;
                    this.playback.loop(this._boundFrame);
                }),
        );

        this._playingPromise = result;
        result.finally(() => {
            this._playingPromise = null;
        });
        return result;
    }

    /** `prefers-reduced-motion` snap: rest = final, paint it, settle — the SAME
     * terminal path a completed play takes, motion elided. */
    private _playReducedMotion(): Promise<void> {
        this.started = true;
        // The PRM snap is INSTANTANEOUS — no rAF clock; the snap's `t` is
        // non-normative for a pure-CSS transform. No `|| performance.now()` silent
        // fallback (R.W2): the snap's clock IS 0 (the at-rest `lastTickTime`).
        const now = this.lastTickTime;

        // Snap every child to its final frame, then composite one final paint.
        snapChildrenToFinal(this.getEntries());
        if (this.singleTarget) {
            this.transformFramesGrouped(now);
        }

        this.settle();

        return Promise.resolve();
    }

    // ── The managed-child lifecycle contract (full statement in
    // src/animation/CLAUDE.md → AnimationGroup → "Managed-child lifecycle"): a
    // managed child is loop-owned — it throws on direct `play()`; `pause()` records
    // the last rAF clock on each child's `pausedTime` so `resume()` adjusts
    // `startTime` jump-free; `resume()` un-pauses children DIRECTLY (never
    // `child.resume()`); `settle()` releases the child (`managed = false`).

    /** Pause the group — idempotent. Pausing an already-paused (or not-yet-started)
     * group is a no-op, NOT a resume. Cancels the rAF loop + renders a final-frame
     * snapshot so the visual matches the pause moment. */
    pause() {
        if (!this.started || this.paused) return this;

        this.paused = true;
        // A started group has ticked, so `lastTickTime` is set (R.W2 — no
        // `|| performance.now()` fallback for a never-occurring case). Record it on
        // each child's `pausedTime` so resume adjusts startTime jump-free.
        const now = this.lastTickTime;
        for (const entry of this.getEntries()) {
            const anim = entry.animation;
            anim.pause();
            if (anim.pausedTime === 0) {
                anim.pausedTime = now;
            }
        }

        this.playback.stop();
        this.render();

        return this;
    }

    /** Resume the group — idempotent. Unpauses every child DIRECTLY (not via
     * `child.resume()` — the group's draw loop owns the ticking) + re-registers it. */
    resume() {
        if (!this.started || !this.paused) return this;
        this.paused = false;
        setChildrenPaused(this.getEntries(), false);
        this.playback.loop(this._boundFrame);
        return this;
    }

    /** The explicit flip: pauses if playing, resumes if paused. */
    toggle() {
        return this.paused ? this.resume() : this.pause();
    }

    /** Pure state teardown — never paints. Releases every child (`managed = false`,
     * `child.settle()`) and clears the group flags, leaving the rest frame painted. */
    settle() {
        for (const entry of this.getEntries()) {
            entry.animation.managed = false;
            entry.animation.settle();
        }

        this.started = false;
        this.done = false;
        this.paused = false;
        this.lastTickTime = 0;

        return this;
    }

    /** Explicit rewind: paint every started child back to its INITIAL frame, then
     * settle — the user-facing "return to start" (completion does NOT come here). */
    reset() {
        for (const entry of this.getEntries()) {
            const anim = entry.animation;
            if (anim.started && anim.frames.length > 0) {
                anim.interpFrames(0, true);
            }
        }

        return this.settle();
    }

    /** Halt the draw loop, rewind to the initial frame (the transport-stop
     * semantic the demo's controls expect), and resolve any pending `play()`. */
    stop() {
        this.playback.stop();
        this.reset();
        this._resolvePlay();

        return this;
    }

    playing() {
        return !(!this.started || this.paused);
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
