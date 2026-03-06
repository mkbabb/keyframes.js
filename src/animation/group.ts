import { Animation, getAnimationId } from ".";
import { lerp } from "../math";
import { cancelAnimationFrame, requestAnimationFrame } from "../utils";
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

    constructor(...inputs: (Animation<V> | AnimationGroupInput<V>)[]) {
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

            // TODO(MEDIUM): Stop implicitly inheriting the first frame transform for the whole group; require explicit group transform wiring.
            this.transform ??= animation.frames[0]!.transform;

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
    }

    setSuperKey(superKey: string) {
        this.superKey = superKey;
        Object.values(this.animations).forEach((groupObject) => {
            groupObject.animation.superKey = superKey;
        });
        return this;
    }

    setTargets(...targets: HTMLElement[]) {
        Object.values(this.animations).forEach((groupObject) => {
            groupObject.animation.setTargets(...targets);
        });

        const animations = Object.values(this.animations).map(
            (groupObject) => groupObject.animation,
        );

        this.singleTarget = animations.every(
            (animation) => animation.targets[0] === animations[0]?.targets[0],
        );

        return this;
    }

    onStart() {
        this.started = true;
        return this;
    }

    onEnd() {
        return this;
    }

    transformFramesGrouped(t: number) {
        const groupedValues: Record<string, unknown> = {};

        // Collect entries, filter by enabled, sort by zIndex
        const entries = Object.values(this.animations);

        // Sort by zIndex ascending (highest last → wins on 'replace')
        entries.sort((a, b) => a.layer.zIndex - b.layer.zIndex);

        let done = true;
        for (const groupObject of entries) {
            const { animation, values, layer } = groupObject;

            done = done && animation.done;

            if (!layer.enabled) continue;

            if (!(animation.done || animation.paused)) {
                const vars = animation.interpFrames(animation.t, false);
                Object.assign(values, vars);
            }

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
                    for (const [key, val] of Object.entries(filteredValues)) {
                        if (key in groupedValues && layer.weight < 1) {
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

    async tick(t: number) {
        this.lastTickTime = t;

        if (!this.started) {
            this.onStart();
        }

        await Promise.all(
            Object.values(this.animations).map(async (groupObject) => {
                if (
                    !groupObject.animation.paused ||
                    groupObject.animation.pausedTime === 0
                ) {
                    await groupObject.animation.tick(t);
                }
            }),
        );

        if (this.done) {
            this.onEnd();
        }

        return this;
    }

    async draw(t: number) {
        await this.tick(t);

        if (this.paused) {
            return;
        }

        if (this.singleTarget) {
            this.transformFramesGrouped(t);
        } else {
            this.done = Object.values(this.animations)
                .map(({ animation }) => {
                    animation.interpFrames(animation.t, true);
                    return animation;
                })
                .every((animation) => animation.done);
        }

        if (!this.done) {
            this.handleId = requestAnimationFrame(this.draw.bind(this));
        } else {
            this.reset();
            if (this.resolvePromise) {
                this.resolvePromise();
            }
        }
    }

    async play() {
        return new Promise((resolve) => {
            this.resolvePromise = resolve;
            this.handleId = requestAnimationFrame(this.draw.bind(this));
        });
    }

    pause() {
        const prevPaused = this.paused;

        if (this.started) {
            this.paused = !this.paused;
            const now = this.lastTickTime || performance.now();
            Object.values(this.animations).forEach((groupObject) => {
                const anim = groupObject.animation;
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
            });

            // Render one final frame at pause so visual matches the pause moment
            if (this.paused && this.singleTarget) {
                for (const groupObject of Object.values(this.animations)) {
                    const anim = groupObject.animation;
                    const vars = anim.interpFrames(anim.t, false);
                    Object.assign(groupObject.values, vars);
                }
                this.transformFramesGrouped(now);
            }
        }

        if (prevPaused) {
            requestAnimationFrame(this.draw.bind(this));
        }

        return this;
    }

    reset() {
        // Apply fillBackwards first so targets snap to their initial frame
        // before clearing animation state (prevents visual glitches like cube cutoff)
        // TODO(HIGH): Remove visual-glitch workaround sequencing and define explicit reset/fill contract.
        Object.values(this.animations).forEach((groupObject) => {
            const anim = groupObject.animation;
            if (anim.started && anim.frames.length > 0) {
                anim.interpFrames(0, true);
            }
            anim.managed = false;
            anim.reset();
        });

        this.started = false;
        this.done = false;
        this.paused = false;
        this.lastTickTime = 0;

        return this;
    }

    stop() {
        cancelAnimationFrame(this.handleId);
        this.reset();

        return this;
    }

    playing() {
        return !(!this.started || this.paused);
    }

    forcePause() {
        this.paused = true;
        Object.values(this.animations).forEach((groupObject) => {
            groupObject.animation.paused = true;
        });
    }

    forcePlay() {
        this.paused = false;
        Object.values(this.animations).forEach((groupObject) => {
            groupObject.animation.paused = false;
        });
    }

    // --- Layer management API ---

    /** Set layer config for an animation by name or reference. Chainable. */
    setLayerConfig(
        nameOrAnim: string | Animation<V>,
        config: Partial<AnimationLayerConfig>,
    ) {
        const key =
            typeof nameOrAnim === "string"
                ? nameOrAnim
                : getAnimationId(nameOrAnim);
        const entry = this.animations[key];
        // TODO(HIGH): Throw when callers target a missing animation key instead of silently ignoring the config update.
        if (entry) {
            Object.assign(entry.layer, config);
        }
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
