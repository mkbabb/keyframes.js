import { Animation, getAnimationId } from ".";
import { ValueArray } from "../units";
import { cancelAnimationFrame, requestAnimationFrame } from "../utils";
import type { TransformFunction, Vars } from "./constants";

export interface AnimationGroupObject<V extends Vars> {
    [key: string]: {
        animation: Animation<V>;
        values: Vars<ValueArray>;
    };
}

export class AnimationGroup<V extends Vars> {
    animations: AnimationGroupObject<V> = {};
    transform!: TransformFunction<V>;

    superKey: string | undefined;

    paused = false;
    started = false;
    done = false;

    singleTarget = true;

    handleId: number | any = undefined;
    resolvePromise: ((value: void | PromiseLike<void>) => void) | null = null;

    constructor(...animations: Animation<V>[]) {
        for (const animation of animations) {
            this.transform ??= animation.frames[0].transform;

            const name = getAnimationId(animation);

            this.animations[name] = {
                values: {},
                animation,
            };

            animation.managed = true;
        }

        this.singleTarget = animations.every(
            (animation) => animation.targets[0] === animations[0].targets[0],
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
            (animation) => animation.targets[0] === animations[0].targets[0],
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
        let groupedValues: Vars<ValueArray> = {};

        let done = true;
        for (const groupObject of Object.values(this.animations)) {
            const { animation, values } = groupObject;

            done = done && animation.done;

            if (!(animation.done || animation.paused)) {
                const vars = animation.interpFrames(animation.t, false);

                Object.assign(values, vars);
            }

            groupedValues = {
                ...groupedValues,
                ...values,
            };
        }

        this.done = done;

        this.transform(groupedValues as V, t);

        return groupedValues;
    }

    async tick(t: number) {
        if (!this.started) {
            this.onStart();
        }

        Object.values(this.animations).forEach(async (groupObject) => {
            if (
                !groupObject.animation.paused ||
                groupObject.animation.pausedTime === 0
            ) {
                await groupObject.animation.tick(t);
            }
        });

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
            Object.values(this.animations).forEach((groupObject) => {
                groupObject.animation.pause(false);
            });
        }

        if (prevPaused) {
            requestAnimationFrame(this.draw.bind(this));
        }

        return this;
    }

    reset() {
        // Apply fillBackwards first so targets snap to their initial frame
        // before clearing animation state (prevents visual glitches like cube cutoff)
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
}
