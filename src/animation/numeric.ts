import { binarySearchRange } from "./internal/binarySearch";
import { EasingResolvable } from "./internal/easing-resolvable";
import { clamp, lerp, scale } from "./internal/leaves";
import { RAFPlayback } from "./playback";
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
    /**
     * Easing as a callable `TimingFunction`, OR a string easing *name*
     * from value.js's registry (`"ease-out-cubic"`, `"easeOutCubic"`,
     * `"linear"`, …).
     *
     * A **callable** is used directly and keeps this engine value.js-free —
     * no dynamic import, nothing pulled into the static graph.
     *
     * A **string name** is resolved through the dynamic engine boundary via
     * the shared `EasingResolvable` contract: resolution is kicked off
     * EAGERLY at construction (an `await import("./engine")` looks the name
     * up via `getTimingFunction`), so the value.js-bearing easing registry
     * loads only when a named easing is actually used and the named curve
     * lands by the first frame. Until it lands, `.at()` interpolates with the
     * identity fallback and emits a one-time dev-only warning; `await
     * .ready()` first to interpolate with the named curve from the very first
     * synchronous `.at()`.
     */
    timingFunction?: TimingFunction | TimingFunctionNames | undefined;
    /** Playback duration in milliseconds. Required for `.play()`. */
    duration?: number | undefined;
    /** Explicit positions as percentages [0-100]. Auto-distributes if omitted. */
    positions?: number[] | undefined;
    /**
     * When true, honor `prefers-reduced-motion: reduce` by snapping to the
     * final keyframe values immediately rather than interpolating over
     * `duration`. The play promise resolves on the next microtask. Default
     * false (back-compat — consumers opt in).
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

    // The one shared string-easing-name resolver (eager-resolve + memoized
    // `.ready()` + dev-warn + identity fallback). Holds the live easing the
    // segments capture by value; rebuilds them on resolution via the callback.
    private _easing: EasingResolvable;

    // Shared rAF lifecycle for `.play()` / `.stop()`.
    private _playback = new RAFPlayback();

    constructor(keyframes: T[], options?: NumericAnimationOptions) {
        if (keyframes.length < 2) {
            throw new Error("NumericAnimation requires at least 2 keyframes.");
        }

        this.keyframes = keyframes.map((kf) => ({ ...kf }));
        this._duration = options?.duration ?? 0;
        this._respectReducedMotion = options?.respectReducedMotion ?? false;

        // Segments capture the easing by value at build time, so a resolved
        // name must rebuild them. Eager-resolve is kicked off inside the
        // resolver's constructor; the callback fires on the later microtask
        // once `this.segments` already exists (the import is always async).
        this._easing = new EasingResolvable(options?.timingFunction, () => {
            this.segments = this.buildSegments();
        });

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
            timingFunction: this._easing.fn,
        };
    }

    /**
     * Resolve a pending string easing *name* through the dynamic engine
     * boundary. A no-op (resolved promise) when easing was supplied as a
     * callable or omitted. Memoized via the shared `EasingResolvable` — the
     * `await import("./engine")` and `getTimingFunction` lookup run at most
     * once per instance.
     *
     * Resolution is already kicked off eagerly at construction; `.play()`
     * awaits this before the first frame, and stateless `.at()` consumers
     * that pass a name can `await animation.ready()` first to interpolate
     * with the resolved easing rather than the identity fallback.
     */
    ready(): Promise<void> {
        return this._easing.ready();
    }

    /**
     * Map [0, 1] progress to interpolated values. Zero allocation —
     * returns the same pre-allocated result object on every call.
     *
     * Uses O(log N) binary search over segments. Falls back to the
     * last segment if progress is past the final stop position.
     */
    at(progress: number): T {
        // A synchronous `.at()` while a string easing name is still resolving
        // interpolates with the identity fallback — surface it once in dev.
        this._easing.warnIfPending("NumericAnimation.at()");

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

        for (let i = 0; i < seg.keys.length; i++) {
            (this.result as Record<string, number>)[seg.keys[i]!] = lerp(
                seg.startVals[i]!,
                seg.stopVals[i]!,
                eased,
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
        // Resolve a pending string easing name before the first frame.
        // No-op (and no engine load) for callable / undefined easing.
        await this.ready();

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
