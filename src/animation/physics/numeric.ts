import { toEasing } from "../easing";
import { binarySearchRange } from "../internal/binarySearch";
import { AnimationOptionError } from "../internal/errors";
import { clamp, lerpArray, scale } from "../internal/leaves";
import { RAFPlayback } from "./playback";
import type { Easing, TimingFunction } from "../constants";

interface NumericSegment<T extends Record<string, number>> {
    startPos: number;
    stopPos: number;
    keys: (keyof T & string)[];
    from: Float64Array;
    to: Float64Array;
    timingFunction: TimingFunction;
}

/**
 * Module-scope scratch buffer for the `lerpArray` consume (L.W7 S2). Grown
 * lazily to the widest channel count seen across all `NumericAnimation`
 * instances, never shrunk — a stable reference reused across every `.at()`
 * call so the interpolation hot path allocates nothing. `lerpArray` only ever
 * reads `seg.from.length` channels, so an over-sized `_out` (from a wider
 * sibling animation) is harmless — the trailing slots are ignored.
 */
let _out = new Float64Array(0);

export interface NumericAnimationOptions {
    /**
     * Easing as a callable `TimingFunction` or a typed `Easing` — both
     * synchronous and value.js-free, so this engine never touches the
     * dynamic boundary.
     *
     * A string easing *name* is NOT accepted here (fail-explicit: it
     * throws). Resolve a name once, up front, through the async factory:
     *
     * ```ts
     * const easing = await resolveEasing("easeOutCubic");
     * new NumericAnimation(frames, { timingFunction: easing });
     * ```
     */
    timingFunction?: TimingFunction | Easing | undefined;
    /** Playback duration in milliseconds. Required for `.play()`. */
    duration?: number | undefined;
    /** Explicit positions as percentages [0-100]. Auto-distributes if omitted. */
    positions?: number[] | undefined;
    /**
     * When true, honor `prefers-reduced-motion: reduce` by snapping to the
     * final keyframe values immediately rather than interpolating over
     * `duration`. The play promise resolves on the next microtask. Default
     * false (conservative default — opt in to the reduced-motion snap).
     *
     * The check uses `matchMedia` if available; on SSR / Node the option
     * is a no-op (animations proceed normally).
     */
    respectReducedMotion?: boolean | undefined;
}

/** Callback invoked each frame during `.play()` with the interpolated values. */
export type NumericFrameCallback<T extends Record<string, number>> = (
    values: T,
) => void;

/**
 * Zero-allocation numeric keyframe interpolator.
 *
 * Interpolates plain `Record<string, number>` keyframes using O(log N)
 * binary-search segment lookup. Designed for canvas/WebGL render loops
 * where CSS value parsing and DOM targets are unnecessary overhead.
 *
 * Two usage modes:
 * - **Stateless**: call `.at(progress)` from your own render loop
 * - **Managed**: call `.play(onFrame?)` to run a rAF-driven playback
 *   that resolves when the animation completes
 */
export class NumericAnimation<T extends Record<string, number>> {
    private keyframes: T[];
    private segments: NumericSegment<T>[];
    private positions: number[];
    private result: T;
    private _duration: number;
    private _respectReducedMotion: boolean;

    // The resolved easing callable — synchronous from construction. The
    // linear default mirrors CSS `linear`: interpolation without easing.
    private _easingFn: TimingFunction;

    // Shared rAF lifecycle for `.play()` / `.stop()`.
    private _playback = new RAFPlayback();

    constructor(keyframes: T[], options?: NumericAnimationOptions) {
        if (keyframes.length < 2) {
            throw new Error("NumericAnimation requires at least 2 keyframes.");
        }

        this.keyframes = keyframes.map((kf) => ({ ...kf }));
        this._duration = options?.duration ?? 0;
        this._respectReducedMotion = options?.respectReducedMotion ?? false;

        const easing = options?.timingFunction;
        if (typeof easing === "string") {
            // Fail-explicit: a string name needs the async registry —
            // never a silent identity fallback.
            throw new AnimationOptionError(
                "timingFunction",
                easing,
                "NumericAnimation accepts a callable TimingFunction or a " +
                    "typed Easing; resolve a string name first via " +
                    "`await resolveEasing(name)`.",
            );
        }
        this._easingFn = easing == null ? (t) => t : toEasing(easing).fn;

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

        const from = new Float64Array(keys.length);
        const to = new Float64Array(keys.length);
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i]!;
            from[i] = start[k] as number;
            to[i] = stop[k] as number;
        }

        return {
            startPos: this.positions[index]!,
            stopPos: this.positions[index + 1]!,
            keys,
            from,
            to,
            timingFunction: this._easingFn,
        };
    }

    /**
     * Map [0, 1] progress to interpolated values. Zero allocation —
     * returns the same pre-allocated result object on every call.
     *
     * Uses O(log N) binary search over segments. Falls back to the
     * last segment if progress is past the final stop position.
     */
    at(progress: number): T {
        const p = clamp(progress, 0, 1) * 100;

        // O(log N) segment lookup
        let segIdx = binarySearchRange(
            this.segments,
            p,
            (s) => s.startPos,
            (s) => s.stopPos,
        );
        // Past end or between gaps — clamp to last segment
        if (segIdx === -1) segIdx = this.segments.length - 1;
        const seg = this.segments[segIdx]!;

        const scaled = scale(
            clamp(p, seg.startPos, seg.stopPos),
            seg.startPos,
            seg.stopPos,
            0,
            1,
        );
        const eased = seg.timingFunction(scaled);

        // One fused `lerpArray` over the packed `Float64Array` channels, instead
        // of K scalar `lerp` calls (L.W7 S2). Grow the shared `_out` scratch
        // buffer lazily — never shrink it (a stable module-scope reference so
        // the interp hot path allocates nothing).
        const n = seg.keys.length;
        if (_out.length < n) {
            _out = new Float64Array(n);
        }
        lerpArray(seg.from, seg.to, eased, _out);

        const result = this.result as Record<string, number>;
        for (let i = 0; i < n; i++) {
            result[seg.keys[i]!] = _out[i]!;
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

    // ── Playback ─────────────────────────────────────────────────────

    /**
     * Play the animation over its duration using requestAnimationFrame.
     *
     * Calls `onFrame` each frame with the interpolated values (the same
     * zero-allocation object returned by `.at()`). Returns a Promise that
     * resolves when the animation completes or is stopped.
     *
     * @param onFrame — optional per-frame callback receiving interpolated values
     * @param duration — override the duration set in constructor options (ms)
     */
    async play(
        onFrame?: NumericFrameCallback<T>,
        duration?: number,
    ): Promise<void> {
        const dur = duration ?? this._duration;
        // Reduced-motion snap (snap to final keyframe, no rAF loop) is owned
        // by the shared RAFPlayback gate — passed through, not re-implemented.
        await this._playback.play(
            dur,
            (progress) => {
                const values = this.at(progress);
                onFrame?.(values);
            },
            { respectReducedMotion: this._respectReducedMotion },
        );
    }

    /** Cancel a running `.play()` animation. The play promise resolves immediately. */
    stop(): void {
        this._playback.stop();
    }
}
