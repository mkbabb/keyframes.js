import { ValueUnit, lerp } from "@mkbabb/value.js";
import { withReducedMotion } from "./internal/reduced-motion";
import { yieldToMain } from "./internal/scheduler";
import { RAFPlayback } from "./playback";
import { Animation, getAnimationId } from "./engine";
import type {
    AnimationLayerConfig,
    TransformFunction,
    Vars,
} from "./constants";
import { defaultLayerConfig } from "./constants";

/**
 * Typed blend-carrier guard — the group is heavy-side (it statically
 * composes the engine), so the real `ValueUnit` class is available for an
 * `instanceof` check instead of structural duck-typing on `{ value }`.
 */
const isNumericUnit = (value: unknown): value is ValueUnit<number> =>
    value instanceof ValueUnit && typeof value.value === "number";

/**
 * The total no-op transform default (I.W0 S3). A single shared reference so a
 * group can ask "did a child override the default yet?" by identity (`this.
 * transform === NOOP_TRANSFORM`) instead of a lying `transform == null` on a
 * field a definite-assignment assertion claimed was always set. A childless
 * group keeps this and composites a harmless empty frame.
 */
const NOOP_TRANSFORM: TransformFunction<any> = () => {};

export interface AnimationGroupEntry<V extends Vars> {
    animation: Animation<V>;
    values: Record<string, unknown>;
    layer: AnimationLayerConfig;
}

export interface AnimationGroupObject<V extends Vars> {
    [key: string]: AnimationGroupEntry<V>;
}

/** Input type for AnimationGroup constructor — bare Animation or Animation with layer config. */
export type AnimationGroupInput<V extends Vars> =
    | Animation<V>
    | { animation: Animation<V>; layer?: Partial<AnimationLayerConfig> };

export class AnimationGroup<V extends Vars> {
    animations: AnimationGroupObject<V> = {};
    /**
     * The group's composite transform. Defaults to a real no-op at the FIELD
     * (I.W0 S3) — NOT a lying definite-assignment assertion. A childless or
     * pre-`parse()` group (e.g. the empty HOME backdrop) composites nothing,
     * so `transformFramesGrouped` calls a harmless no-op instead of throwing
     * `this.transform is not a function` (B1/E1). The constructor overrides
     * this with the first child's transform when one exists.
     */
    transform: TransformFunction<V> = NOOP_TRANSFORM;

    superKey: string | undefined;

    paused = false;
    started = false;
    done = false;

    /**
     * When true, `play()` honors `prefers-reduced-motion: reduce` by snapping
     * every child to its final frame in a single composite instead of running
     * the rAF draw loop. SSR-safe no-op off-DOM. Default false.
     */
    respectReducedMotion = false;

    /**
     * Children-per-slice before `advanceTo()` yields to the main thread. Groups at
     * or under this size tick in one slice (fast path); larger groups tick in
     * batches with a `scheduler.yield()` between them so a big per-frame
     * composite doesn't run as one long task (INP relief).
     */
    static readonly YIELD_BATCH = 32;

    singleTarget = true;

    lastTickTime: number = 0;

    /** THE rAF owner for the group's draw loop. */
    readonly playback = new RAFPlayback();
    resolvePromise: ((value: void | PromiseLike<void>) => void) | null = null;
    private _playingPromise: Promise<void> | null = null;

    /**
     * Pre-bound frame callback — allocated once in constructor to avoid
     * creating a new closure on every playback loop start.
     */
    private _boundFrame: (t: number) => boolean | Promise<boolean>;

    /**
     * Cached entries array, sorted by layer zIndex. Rebuilt on demand
     * via dirty flag to avoid Object.values() allocation on every frame.
     */
    private _entries: AnimationGroupEntry<V>[] = [];
    private _entriesDirty = true;

    /**
     * Long-lived composite buffer, cleared in place at the top of
     * `transformFramesGrouped` (the same zero-alloc idiom `interpFrames`'s
     * `out` buffer already uses). With it the compositor honours the class's
     * own zero-alloc discipline — no fresh `groupedValues` object, and no
     * per-layer `filteredValues` object, allocated per frame.
     */
    private _grouped: Record<string, unknown> = {};

    /**
     * The compile-stable union of every child's contributed (whitelist-filtered)
     * keys — what `_grouped` is null-filled to each frame so the composite is
     * cleared WITHOUT `delete` (F.W4 S2: the delete-loop trapped `_grouped` in
     * V8 dictionary mode). Recomputed only when the entry set / a layer
     * whitelist changes (via `invalidateEntries`); stable across frames.
     */
    private _groupedKeys: string[] = [];
    private _groupedKeysDirty = true;

    constructor(...inputs: (Animation<V> | AnimationGroupInput<V>)[]) {
        this._boundFrame = this._frame.bind(this);

        const animations: Animation<V>[] = [];

        for (const input of inputs) {
            let animation: Animation<V>;
            let layerConfig: Partial<AnimationLayerConfig> | undefined;

            if (input instanceof Animation) {
                animation = input;
            } else {
                animation = input.animation;
                layerConfig = input.layer;
            }

            // Inherit the transform from the first child that has one,
            // overriding the no-op field default. When children are
            // constructed before `parse()` (so `frames` is empty), the field's
            // no-op default stands — `transformFramesGrouped` composites a
            // harmless empty frame instead of throwing (I.W0 S3 — the former
            // "resolved lazily" comment promised a lazy fallback that never
            // existed; the field default IS the total fallback, no-legacy).
            if (this.transform === NOOP_TRANSFORM && animation.frames[0] != null) {
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

    /**
     * Returns the animation entries sorted by layer zIndex.
     * Uses dirty-flag caching — only rebuilds when the animations object
     * or layer configs are mutated. All hot-path iteration (tick, draw,
     * transformFramesGrouped) uses this instead of Object.values().
     */
    private getEntries(): AnimationGroupEntry<V>[] {
        if (this._entriesDirty) {
            this._entries = Object.values(this.animations);
            this._entries.sort((a, b) => a.layer.zIndex - b.layer.zIndex);
            this._entriesDirty = false;
        }
        return this._entries;
    }

    /** Mark entries cache stale. Called at all mutation boundaries. */
    private invalidateEntries(): void {
        this._entriesDirty = true;
        this._groupedKeysDirty = true;
    }

    /**
     * Recompute `_groupedKeys` — the union of each child's contributed keys
     * (whitelist-filtered when the layer carries one). The maximal key-set the
     * `transformFramesGrouped` null-fill clears, so the composite buffer stays
     * in V8 fast-properties mode without `delete` (F.W4 S2). Children are parsed
     * (their `flatKeys` populated) before the first composite — the group only
     * blends during play, after child setup — and any later structural change
     * re-dirties through `invalidateEntries`.
     */
    private computeGroupedKeys(): void {
        const seen = new Set<string>();
        for (const entry of this.getEntries()) {
            const whitelist = entry.layer.properties;
            for (const key of entry.animation.flatKeys) {
                if (whitelist && !whitelist.has(key)) continue;
                seen.add(key);
            }
        }
        this._groupedKeys = [...seen];
    }

    // ── Setup ────────────────────────────────────────────────────────

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

    // ── Lifecycle hooks ──────────────────────────────────────────────

    onStart() {
        this.started = true;
        return this;
    }

    onEnd() {
        return this;
    }

    // ── Frame rendering ──────────────────────────────────────────────

    /**
     * Composite all animation values into a single grouped transform.
     * Called per-frame for single-target groups. Applies layer blending
     * (replace / add / weighted) in zIndex order, then calls the group
     * transform function with the merged values.
     *
     * Refreshes every child's values at its current `t` in place —
     * `interpFrames(t, false, entry.values)` clears and rewrites the
     * long-lived buffer, so no stale keys leak across frames and no
     * fresh object is allocated per entry per frame.
     */
    transformFramesGrouped(t: number) {
        // Reuse the long-lived composite buffer, cleared in place — the same
        // zero-alloc idiom `interpFrames` uses for its `out` buffer. No fresh
        // object per frame.
        const groupedValues = this._grouped;
        if (this._groupedKeysDirty) {
            this.computeGroupedKeys();
            this._groupedKeysDirty = false;
        }

        // F.W4 S2 — stable-key null-fill clear (NO `delete`: the delete-loop
        // trapped `_grouped` in V8 dictionary mode, taxing every blend read +
        // the transform serialize per key per frame). Inactive keys read back
        // `undefined`; the blend skips them and the first-contributor check
        // below is `!== undefined` (not `key in`, which the null-fill makes
        // always-true); the post-blend compaction drops any key no enabled child
        // contributed so the transform never serializes an `undefined`.
        const groupedKeys = this._groupedKeys;
        for (let i = 0; i < groupedKeys.length; i++) {
            groupedValues[groupedKeys[i]!] = undefined;
        }

        const entries = this.getEntries();

        let done = true;
        for (const groupObject of entries) {
            const { animation, layer, values } = groupObject;

            done = done && animation.done;

            if (!layer.enabled) continue;

            // Refresh in place. `values` is reset by interpFrames (the stable-key
            // null-fill) before new keys are assigned, so the done/paused
            // early-return from the previous implementation is unnecessary — a
            // scrubbed child's fresh state is always reflected here. Inactive
            // child keys read back `undefined`; the blend arms skip them.
            animation.interpFrames(
                animation.t,
                false,
                values as Record<string, ValueUnit[]>,
            );

            // The property whitelist is applied INLINE as a key-skip — no
            // `filteredValues` object, no `Object.entries`/`Object.fromEntries`
            // array. Each blend arm walks `values` with `for..in` (allocation-
            // free), `continue`s on a non-whitelisted or `undefined` key.
            const whitelist = layer.properties;

            switch (layer.blendMode) {
                case "replace":
                    for (const key in values) {
                        if (whitelist && !whitelist.has(key)) continue;
                        const incoming = values[key];
                        if (incoming === undefined) continue;
                        groupedValues[key] = incoming;
                    }
                    break;

                case "add":
                    // Accumulate each numeric leaf element in place (the leaf is
                    // a `ValueUnit[]` — a one-element array for a scalar, an
                    // N-element array for a multi-component leaf). Numeric add is
                    // UN-CLAMPED (CSS `animation-composition: add` does not clamp
                    // at composition; clamping is at use) — `0.8 + 0.8 → 1.6`.
                    for (const key in values) {
                        if (whitelist && !whitelist.has(key)) continue;
                        const incoming = values[key];
                        if (incoming === undefined) continue;
                        const existing = groupedValues[key];
                        if (Array.isArray(existing) && Array.isArray(incoming)) {
                            const n = Math.min(existing.length, incoming.length);
                            for (let i = 0; i < n; i++) {
                                if (
                                    isNumericUnit(existing[i]) &&
                                    isNumericUnit(incoming[i])
                                ) {
                                    existing[i].value += incoming[i].value;
                                } else {
                                    existing[i] = incoming[i];
                                }
                            }
                        } else {
                            groupedValues[key] = incoming;
                        }
                    }
                    break;

                case "weighted":
                    // Lerp each numeric leaf element toward the incoming value by
                    // `weight`, in place. `weight === 1` produces a fully-blended
                    // value distinct from `replace` because the lerp leaf still
                    // mutates the existing carrier in place.
                    for (const key in values) {
                        if (whitelist && !whitelist.has(key)) continue;
                        const incoming = values[key];
                        if (incoming === undefined) continue;
                        const existing = groupedValues[key];
                        if (Array.isArray(existing) && Array.isArray(incoming)) {
                            const n = Math.min(existing.length, incoming.length);
                            for (let i = 0; i < n; i++) {
                                if (
                                    isNumericUnit(existing[i]) &&
                                    isNumericUnit(incoming[i])
                                ) {
                                    existing[i].value = lerp(
                                        existing[i].value,
                                        incoming[i].value,
                                        layer.weight,
                                    );
                                } else {
                                    existing[i] = incoming[i];
                                }
                            }
                        } else {
                            groupedValues[key] = incoming;
                        }
                    }
                    break;
            }
        }

        this.done = done;

        // Drop any key NO enabled child contributed this frame (a disabled
        // layer's stale key, or a property whose child does not cover `t`) so the
        // transform never serializes an `undefined`. In the common case (every
        // grouped key contributed) this deletes nothing, so `_grouped` stays in
        // fast-properties mode and the per-frame path is delete-free + zero-alloc
        // — the rare `delete` is strictly no worse than the old per-frame loop.
        for (let i = 0; i < groupedKeys.length; i++) {
            const key = groupedKeys[i]!;
            if (groupedValues[key] === undefined) delete groupedValues[key];
        }

        // I.W0 S3 — the lazy composite-transform resolution, now REAL (the
        // constructor comment once only promised it). When a child is
        // constructed before `parse()` populates its `frames`, the constructor
        // inheritance does not fire and `transform` keeps its no-op field
        // default — which would composite NOTHING (a frozen subject, the cube's
        // static-matrix symptom). Resolve it from the first now-parsed child the
        // FIRST time we draw with a real frame; a genuinely childless group
        // keeps the no-op (harmless, never throws). Idempotent: once resolved,
        // the identity guard skips this.
        if (this.transform === NOOP_TRANSFORM) {
            for (const entry of this.getEntries()) {
                const frame = entry.animation.frames[0];
                if (frame != null && frame.transform != null) {
                    this.transform = frame.transform;
                    break;
                }
            }
        }

        this.transform(groupedValues as V, t);

        return groupedValues;
    }

    /**
     * Render the current composition as a static frame using each
     * child's current `t`. Single-target groups go through the
     * blended transform; multi-target groups apply each child's
     * interpolated vars directly to its own targets.
     *
     * This is the public entry point for scenarios that mutate a
     * child's state outside the rAF loop (scrubbing, state restore,
     * pause snapshots) and need the visual to update immediately.
     */
    render(): void {
        const now = this.lastTickTime || performance.now();
        if (this.singleTarget) {
            this.transformFramesGrouped(now);
        } else {
            for (const entry of this.getEntries()) {
                entry.animation.interpFrames(entry.animation.t, true);
            }
        }
    }

    /**
     * Set a child animation's current time without touching its
     * siblings. Updates `pausedTime` so the child resumes correctly
     * from the scrub position. Chainable. Call `render()` afterwards
     * to reflect the change visually.
     */
    setChildTime(nameOrAnim: string | Animation<V>, t: number) {
        const key =
            typeof nameOrAnim === "string"
                ? nameOrAnim
                : getAnimationId(nameOrAnim);
        const entry = this.animations[key];
        if (!entry) {
            throw new Error(
                `AnimationGroup.setChildTime: no animation registered for key "${key}". Known keys: ${Object.keys(this.animations).join(", ") || "(none)"}.`,
            );
        }
        const anim = entry.animation;
        anim.t = t;
        if (anim.startTime !== undefined) {
            anim.pausedTime = anim.startTime + t;
        }
        return this;
    }

    // ── Playback loop ────────────────────────────────────────────────

    /**
     * Advance all child animations to absolute clock `t`. SYNC on the steady
     * path (J.W6 S1): children that all step synchronously advance the group
     * with no per-frame `Promise.all`/microtask hop; a thenable only on a
     * genuinely-async child or the over-`YIELD_BATCH` yield path.
     */
    advanceTo(t: number): this | Promise<this> {
        this.lastTickTime = t;
        if (!this.started) this.onStart();

        const entries = this.getEntries();
        const BATCH = AnimationGroup.YIELD_BATCH;
        const pending =
            entries.length <= BATCH
                ? this._advanceSlice(entries, t)
                : this._advanceBatched(entries, t, BATCH);
        return pending
            ? pending.then(() => this._endAdvance())
            : this._endAdvance();
    }

    /** Batched advance — yield to the main thread between batches. */
    private async _advanceBatched(
        entries: AnimationGroupEntry<V>[],
        t: number,
        batch: number,
    ): Promise<void> {
        for (let i = 0; i < entries.length; i += batch) {
            await this._advanceSlice(entries.slice(i, i + batch), t);
            if (i + batch < entries.length) await yieldToMain();
        }
    }

    /** The post-advance tail — `onEnd` once the render marked done. */
    private _endAdvance(): this {
        if (this.done) this.onEnd();
        return this;
    }

    /** Advance one slice — `undefined` iff every child stepped sync. */
    private _advanceSlice(
        slice: AnimationGroupEntry<V>[],
        t: number,
    ): Promise<void> | undefined {
        let promises: Promise<number>[] | undefined;
        for (const entry of slice) {
            const anim = entry.animation;
            if (anim.paused && anim.pausedTime !== 0) continue;
            const stepped = anim.advanceTo(t);
            if (typeof stepped !== "number") (promises ??= []).push(stepped);
        }
        return promises && Promise.all(promises).then(() => undefined);
    }

    /**
     * One frame of the group's draw loop, driven by the shared
     * `RAFPlayback.loop`. Ticks all children, then renders
     * (single-target: grouped blending; multi-target: per-child).
     * Returns whether the loop should continue.
     */
    private _frame(t: number): boolean | Promise<boolean> {
        const advanced = this.advanceTo(t);
        return typeof (advanced as Promise<this>).then === "function"
            ? (advanced as Promise<this>).then(() => this._renderFrame(t))
            : this._renderFrame(t);
    }

    /** The post-advance render half of `_frame` — composite, or settle. */
    private _renderFrame(t: number): boolean {
        if (this.paused) {
            return false;
        }

        if (this.singleTarget) {
            this.transformFramesGrouped(t);
        } else {
            let allDone = true;
            for (const entry of this.getEntries()) {
                entry.animation.interpFrames(entry.animation.t, true);
                allDone = allDone && entry.animation.done;
            }
            this.done = allDone;
        }

        if (!this.done) {
            return true;
        }

        // Completion: every child's `onEnd` already painted its rest frame
        // per its fill contract, and the composite above rendered the
        // blended result — settle is pure teardown, never a repaint. (The
        // former completion-path `reset()` repainted frame 0, so a fadeIn
        // group ended invisible — the quirk the rest-position contract
        // retires.)
        this.settle();
        this._resolvePlay();
        return false;
    }

    private _resolvePlay() {
        const resolve = this.resolvePromise;
        this.resolvePromise = null;
        resolve?.();
    }

    /**
     * Start the animation group. Returns a promise that resolves
     * when all child animations complete (or on explicit stop/reset).
     * Re-entrant: a `play()` while one is in flight returns the same
     * promise rather than leaking a second draw loop.
     *
     * Under `respectReducedMotion` + an active `prefers-reduced-motion`
     * query, snaps every child to its final frame in a single composite —
     * no rAF draw loop — then settles exactly as a completed play would.
     */
    /**
     * The completion front-door (G.W13) — `await group.finished` resolves once
     * the in-flight composite play settles. Exposes the ONE held
     * `_playingPromise` `play()` constructs (the re-entrant guard returns it;
     * the `finally`-clear nulls it on settle) — NOT a second completion
     * lifecycle. A settled (or never-played) group resolves immediately.
     */
    get finished(): Promise<void> {
        return this._playingPromise ?? Promise.resolve();
    }

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

    /**
     * `prefers-reduced-motion` snap for the group: rest = final, paint it,
     * settle — the SAME terminal path a completed play takes, with the
     * motion elided. Every child advances to its final frame, one composite
     * paints, and `settle()` (pure teardown, never a repaint) readies the
     * group for replay. The final frame stays on the target(s), matching
     * `Animation._playReducedMotion`.
     */
    private _playReducedMotion(): Promise<void> {
        this.onStart();
        const now = this.lastTickTime || performance.now();
        this.lastTickTime = now;

        // Snap every child to its final frame and apply it to the target(s).
        for (const entry of this.getEntries()) {
            const anim = entry.animation;
            anim.started = true;
            anim.t = anim.options.duration;
            anim.interpFrames(anim.t, true);
        }

        if (this.singleTarget) {
            // Composite the snapped children into one final paint.
            this.transformFramesGrouped(now);
        }

        this.settle();

        return Promise.resolve();
    }

    // ── The managed-child lifecycle contract (consolidated; full statement in
    // src/animation/CLAUDE.md → AnimationGroup → "Managed-child lifecycle").
    // A managed child (`managed = true`) is loop-owned by the group: it throws
    // on direct `play()` (the group owns the rAF loop); `pause()` propagates to
    // every child AND records the last rAF clock on each child's `pausedTime`
    // so `resume()` adjusts `startTime` jump-free; `resume()` un-pauses children
    // DIRECTLY (never `child.resume()`) so no child rAF loop races the draw
    // loop; `settle()` releases the child (`managed = false`).

    /**
     * Pause the group — idempotent. Pausing an already-paused (or
     * not-yet-started) group is a no-op, NOT a resume. Mirrors
     * `Animation.pause`: a method named `pause` pauses, never secretly
     * resumes. Use {@link toggle} for the explicit flip, {@link resume}
     * for the explicit resume.
     *
     * Cancels the rAF loop immediately (don't wait for the frame callback to
     * self-terminate) and renders a final-frame snapshot so the visual
     * matches the exact pause moment.
     */
    pause() {
        if (!this.started || this.paused) return this;

        this.paused = true;
        const now = this.lastTickTime || performance.now();

        // Propagate the pause to every child.
        for (const entry of this.getEntries()) {
            const anim = entry.animation;
            anim.pause();
            // Use the last rAF timestamp (not performance.now()) so resume
            // correctly adjusts startTime without a forward jump.
            if (anim.pausedTime === 0) {
                anim.pausedTime = now;
            }
        }

        this.playback.stop();
        this.render();

        return this;
    }

    /**
     * Resume the group — idempotent. Resuming a running (or not-yet-started)
     * group is a no-op. Unpauses every child DIRECTLY (not via
     * `child.resume()`, which would start each child's own rAF loop) — the
     * group's draw loop owns the ticking — and re-registers that loop.
     */
    resume() {
        if (!this.started || !this.paused) return this;

        this.paused = false;
        for (const entry of this.getEntries()) {
            entry.animation.paused = false;
        }

        this.playback.loop(this._boundFrame);

        return this;
    }

    /** The explicit flip: pauses if playing, resumes if paused. */
    toggle() {
        return this.paused ? this.resume() : this.pause();
    }

    /**
     * Pure state teardown — never paints. The group analogue of
     * `Animation.settle()`: releases every child (`managed = false`,
     * `child.settle()`) and clears the group's own playback flags.
     * Completion and the reduced-motion snap both end here, leaving the
     * rest frame (per each child's fill contract) on the target(s).
     */
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

    /**
     * Explicit rewind: paint every started child back to its INITIAL
     * frame, then settle. This is the user-facing "return to start" —
     * rest position `initial` painted deliberately, not a completion side
     * effect. (Completion does NOT come here; it settles where the fill
     * contract rested the pixels.)
     */
    reset() {
        for (const entry of this.getEntries()) {
            const anim = entry.animation;
            if (anim.started && anim.frames.length > 0) {
                anim.interpFrames(0, true);
            }
        }

        return this.settle();
    }

    /**
     * Halt the draw loop, rewind to the initial frame (the transport-stop
     * semantic the demo's controls expect), and resolve any pending
     * `play()` promise.
     */
    stop() {
        this.playback.stop();
        this.reset();
        this._resolvePlay();

        return this;
    }

    playing() {
        return !(!this.started || this.paused);
    }

    forcePause() {
        this.paused = true;
        for (const entry of this.getEntries()) {
            entry.animation.paused = true;
        }
    }

    forcePlay() {
        this.paused = false;
        for (const entry of this.getEntries()) {
            entry.animation.paused = false;
        }
    }

    // ── Layer management API ─────────────────────────────────────────

    /**
     * Set layer config for an animation by name or reference.
     * Chainable. Throws when the key doesn't match a registered
     * animation — silent no-ops were hiding consumer bugs.
     */
    setLayerConfig(
        nameOrAnim: string | Animation<V>,
        config: Partial<AnimationLayerConfig>,
    ) {
        const key =
            typeof nameOrAnim === "string"
                ? nameOrAnim
                : getAnimationId(nameOrAnim);
        const entry = this.animations[key];
        if (!entry) {
            throw new Error(
                `AnimationGroup.setLayerConfig: no animation registered for key "${key}". Known keys: ${Object.keys(this.animations).join(", ") || "(none)"}.`,
            );
        }
        Object.assign(entry.layer, config);
        this.invalidateEntries();
        return this;
    }

    /** Convenience toggle for enabling/disabling a layer. Chainable. */
    setLayerEnabled(nameOrAnim: string | Animation<V>, enabled: boolean) {
        return this.setLayerConfig(nameOrAnim, { enabled });
    }

    /** Read the layer config for an animation. */
    getLayerConfig(
        nameOrAnim: string | Animation<V>,
    ): AnimationLayerConfig | undefined {
        const key =
            typeof nameOrAnim === "string"
                ? nameOrAnim
                : getAnimationId(nameOrAnim);
        return this.animations[key]?.layer;
    }
}
