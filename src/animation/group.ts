import {
    cancelAnimationFrame,
    lerp,
    requestAnimationFrame,
    type ValueUnit,
} from "@mkbabb/value.js";
import { Animation, getAnimationId } from ".";
import type {
    AnimationLayerConfig,
    TransformFunction,
    Vars,
} from "./constants";
import { defaultLayerConfig } from "./constants";

const isNumericCarrier = (value: unknown): value is { value: number } => {
    if (typeof value !== "object" || value == null) {
        return false;
    }

    return (
        "value" in value &&
        typeof (value as { value?: unknown }).value === "number"
    );
};

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
    transform!: TransformFunction<V>;

    superKey: string | undefined;

    paused = false;
    started = false;
    done = false;

    singleTarget = true;

    lastTickTime: number = 0;

    handleId: number | any = undefined;
    resolvePromise: ((value: void | PromiseLike<void>) => void) | null = null;

    /**
     * Pre-bound draw callback — allocated once in constructor to avoid
     * creating a new closure on every requestAnimationFrame reschedule.
     */
    private _boundDraw: (t: number) => void;

    /**
     * Cached entries array, sorted by layer zIndex. Rebuilt on demand
     * via dirty flag to avoid Object.values() allocation on every frame.
     */
    private _entries: AnimationGroupEntry<V>[] = [];
    private _entriesDirty = true;

    constructor(...inputs: (Animation<V> | AnimationGroupInput<V>)[]) {
        this._boundDraw = this.draw.bind(this);

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

            // Inherit the transform from the first child that has one.
            // When children are constructed without `parse()` having been
            // called yet (so `frames` is empty), `transform` stays
            // undefined here and is resolved lazily on the first
            // `transformFramesGrouped` call.
            if (this.transform == null && animation.frames[0] != null) {
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
            (entry) => entry.animation.targets[0] === entries[0]?.animation.targets[0],
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
        const groupedValues: Record<string, unknown> = {};
        const entries = this.getEntries();

        let done = true;
        for (const groupObject of entries) {
            const { animation, layer, values } = groupObject;

            done = done && animation.done;

            if (!layer.enabled) continue;

            // Refresh in place. `values` is reset by interpFrames before
            // new keys are assigned, so the done/paused early-return
            // from the previous implementation is unnecessary — a
            // scrubbed child's fresh state is always reflected here.
            animation.interpFrames(animation.t, false, values as Record<string, ValueUnit[]>);

            // Apply property whitelist filter
            const filteredValues = layer.properties
                ? Object.fromEntries(
                      Object.entries(values).filter(([key]) =>
                          layer.properties!.has(key),
                      ),
                  )
                : values;

            // Blend based on mode
            switch (layer.blendMode) {
                case "replace":
                    Object.assign(groupedValues, filteredValues);
                    break;

                case "add":
                    for (const [key, val] of Object.entries(filteredValues)) {
                        if (key in groupedValues) {
                            const existing = groupedValues[key];
                            const incoming = val;
                            // Accumulate numeric ValueUnit values
                            if (
                                isNumericCarrier(existing) &&
                                isNumericCarrier(incoming)
                            ) {
                                existing.value =
                                    existing.value + incoming.value;
                            } else {
                                groupedValues[key] = val;
                            }
                        } else {
                            groupedValues[key] = val;
                        }
                    }
                    break;

                case "weighted":
                    // Always lerp toward the incoming value by `weight`;
                    // `weight === 1` produces a fully-blended value
                    // distinct from `replace` because the lerp leaf
                    // still mutates the existing carrier in place.
                    for (const [key, val] of Object.entries(filteredValues)) {
                        if (key in groupedValues) {
                            const existing = groupedValues[key];
                            const incoming = val;
                            if (
                                isNumericCarrier(existing) &&
                                isNumericCarrier(incoming)
                            ) {
                                existing.value = lerp(
                                    layer.weight,
                                    existing.value,
                                    incoming.value,
                                );
                            } else {
                                groupedValues[key] = val;
                            }
                        } else {
                            groupedValues[key] = val;
                        }
                    }
                    break;
            }
        }

        this.done = done;

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
     * Advance all child animations to timestamp `t`.
     * Awaits all child tick() promises so deferred state updates
     * (startTime, this.t) resolve before interpFrames reads them.
     */
    async tick(t: number) {
        this.lastTickTime = t;

        if (!this.started) {
            this.onStart();
        }

        const promises: Promise<number>[] = [];
        for (const entry of this.getEntries()) {
            const anim = entry.animation;
            if (!anim.paused || anim.pausedTime === 0) {
                promises.push(anim.tick(t));
            }
        }
        await Promise.all(promises);

        if (this.done) {
            this.onEnd();
        }

        return this;
    }

    /**
     * Main animation frame callback. Ticks all children, then renders
     * (single-target: grouped blending; multi-target: per-child).
     * Reschedules itself via rAF until done.
     */
    async draw(t: number) {
        await this.tick(t);

        if (this.paused) {
            return;
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
            this.handleId = requestAnimationFrame(this._boundDraw);
        } else {
            this.reset();
            if (this.resolvePromise) {
                this.resolvePromise();
            }
        }
    }

    /**
     * Start the animation group. Returns a promise that resolves
     * when all child animations complete (or on explicit stop/reset).
     */
    async play() {
        return new Promise((resolve) => {
            this.resolvePromise = resolve;
            this.handleId = requestAnimationFrame(this._boundDraw);
        });
    }

    /**
     * Toggle pause state. Calling pause() when playing pauses; calling
     * pause() when paused resumes. (Toggle semantics preserved for
     * backward compatibility with demo's toggleAnimationGroup.)
     *
     * On pause: explicitly cancels the rAF loop and renders a final
     * frame snapshot so the visual matches the exact pause moment.
     * On resume: re-registers the rAF loop.
     */
    pause() {
        if (!this.started) return this;

        this.paused = !this.paused;
        const now = this.lastTickTime || performance.now();

        // Propagate pause/unpause to all child animations
        for (const entry of this.getEntries()) {
            const anim = entry.animation;
            if (this.paused) {
                anim.pause(false);
                // Use the last rAF timestamp (not performance.now()) so
                // resume correctly adjusts startTime without a forward jump.
                if (anim.pausedTime === 0) {
                    anim.pausedTime = now;
                }
            } else {
                // Unpause children directly — don't call resume() which would
                // start each child's own rAF loop. The group's draw() handles ticking.
                anim.paused = false;
            }
        }

        if (this.paused) {
            // Stop the rAF loop immediately — don't wait for draw() to self-terminate
            cancelAnimationFrame(this.handleId);
            this.handleId = undefined;
            // Render final frame so the visual matches the pause moment
            this.render();
        } else {
            // Resume: restart the draw loop
            this.handleId = requestAnimationFrame(this._boundDraw);
        }

        return this;
    }

    reset() {
        // Apply fillBackwards first so targets snap to their initial frame
        // before clearing animation state (prevents visual glitches like cube cutoff)
        // TODO(HIGH): Remove visual-glitch workaround sequencing and define explicit reset/fill contract.
        for (const entry of this.getEntries()) {
            const anim = entry.animation;
            if (anim.started && anim.frames.length > 0) {
                anim.interpFrames(0, true);
            }
            anim.managed = false;
            anim.reset();
        }

        this.started = false;
        this.done = false;
        this.paused = false;
        this.lastTickTime = 0;

        return this;
    }

    stop() {
        cancelAnimationFrame(this.handleId);
        this.handleId = undefined;
        this.reset();

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
