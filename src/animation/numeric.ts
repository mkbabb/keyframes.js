import { lerp, scale, clamp } from "../math";
import { getTimingFunction } from "./utils";
import type { TimingFunction, TimingFunctionNames } from "./constants";

interface NumericSegment<T extends Record<string, number>> {
    startPos: number;
    stopPos: number;
    keys: (keyof T & string)[];
    startVals: number[];
    stopVals: number[];
    timingFunction: TimingFunction;
}

export interface NumericAnimationOptions {
    timingFunction?: TimingFunction | TimingFunctionNames | undefined;
    /** Explicit positions as percentages [0-100]. Auto-distributes if omitted. */
    positions?: number[] | undefined;
}

const linear: TimingFunction = (t: number) => t;

export class NumericAnimation<T extends Record<string, number>> {
    private keyframes: T[];
    private segments: NumericSegment<T>[];
    private positions: number[];
    private timingFn: TimingFunction;
    private result: T;

    constructor(keyframes: T[], options?: NumericAnimationOptions) {
        if (keyframes.length < 2) {
            throw new Error(
                "NumericAnimation requires at least 2 keyframes.",
            );
        }

        this.keyframes = keyframes.map((kf) => ({ ...kf }));
        this.timingFn =
            (options?.timingFunction
                ? getTimingFunction(options.timingFunction)
                : undefined) ?? linear;

        if (options?.positions) {
            if (options.positions.length !== keyframes.length) {
                throw new Error(
                    "positions length must match keyframes length.",
                );
            }
            this.positions = options.positions;
        } else {
            this.positions = keyframes.map(
                (_, i) => (i / (keyframes.length - 1)) * 100,
            );
        }

        // Pre-allocate result object
        this.result = { ...keyframes[0]! };

        this.segments = this.buildSegments();
    }

    private buildSegments(): NumericSegment<T>[] {
        const segs: NumericSegment<T>[] = [];
        for (let i = 0; i < this.keyframes.length - 1; i++) {
            segs.push(this.buildSegment(i));
        }
        return segs;
    }

    private buildSegment(index: number): NumericSegment<T> {
        const start = this.keyframes[index]!;
        const stop = this.keyframes[index + 1]!;
        const keys = Object.keys(start) as (keyof T & string)[];

        return {
            startPos: this.positions[index]!,
            stopPos: this.positions[index + 1]!,
            keys,
            startVals: keys.map((k) => start[k] as number),
            stopVals: keys.map((k) => stop[k] as number),
            timingFunction: this.timingFn,
        };
    }

    /** Map [0, 1] progress to interpolated values. Zero allocation. */
    at(progress: number): T {
        const p = clamp(progress, 0, 1) * 100;

        // Find active segment
        let seg = this.segments[0]!;
        for (let i = 0; i < this.segments.length; i++) {
            const s = this.segments[i]!;
            if (p >= s.startPos && p <= s.stopPos) {
                seg = s;
                break;
            }
            // Past end — use last segment
            if (i === this.segments.length - 1) {
                seg = s;
            }
        }

        const scaled = scale(
            clamp(p, seg.startPos, seg.stopPos),
            seg.startPos,
            seg.stopPos,
            0,
            1,
        );
        const eased = seg.timingFunction(scaled);

        for (let i = 0; i < seg.keys.length; i++) {
            (this.result as Record<string, number>)[seg.keys[i]!] = lerp(
                eased,
                seg.startVals[i]!,
                seg.stopVals[i]!,
            );
        }

        return this.result;
    }

    /** Update a keyframe's values in-place, recomputing adjacent segments. */
    updateKeyframe(index: number, values: Partial<T>): this {
        if (index < 0 || index >= this.keyframes.length) {
            throw new RangeError(
                `Keyframe index ${index} out of range [0, ${this.keyframes.length - 1}].`,
            );
        }

        Object.assign(this.keyframes[index]!, values);

        // Recompute the 1-2 adjacent segments
        if (index > 0) {
            this.segments[index - 1] = this.buildSegment(index - 1);
        }
        if (index < this.keyframes.length - 1) {
            this.segments[index] = this.buildSegment(index);
        }

        return this;
    }
}
