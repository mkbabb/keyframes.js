import { binarySearchRange } from "./internal/binarySearch";
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
     * A **string name** is resolved LAZILY through the dynamic engine
     * boundary: on the first `.play()` (or an explicit `await .ready()`)
     * the engine module is `await import(...)`-ed and the name looked up
     * via `getTimingFunction`, so the value.js-bearing easing registry
     * loads only when a named easing is actually used. The resolved
     * callable is cached on the instance (resolved once per animation).
     * Until resolution, `.at()` interpolates with a linear fallback.
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

/** Feature-detect reduced-motion preference. SSR-safe (returns false). */
function prefersReducedMotion(): boolean {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Callback invoked each frame during `.play()` with the interpolated values. */
export type NumericFrameCallback<T extends Record<string, number>> = (values: T) => void;

const linear: TimingFunction = (t: number) => t;

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
    private timingFn: TimingFunction;
    private result: T;
    private _duration: number;
    private _respectReducedMotion: boolean;

    // A string easing *name* awaiting lazy resolution through the engine
    // boundary. `null` once resolved (or when a callable/undefined easing
    // was supplied, which needs no resolution).
    private _pendingEasingName: TimingFunctionNames | null = null;
    // Memoized resolve-once promise so concurrent `.play()` / `.ready()`
    // calls share a single `await import("./engine")`.
    private _easingReady: Promise<void> | null = null;

    // Shared rAF lifecycle for `.play()` / `.stop()`.
    private _playback = new RAFPlayback();

    constructor(keyframes: T[], options?: NumericAnimationOptions) {
        if (keyframes.length < 2) {
            throw new Error(
                "NumericAnimation requires at least 2 keyframes.",
            );
        }

        this.keyframes = keyframes.map((kf) => ({ ...kf }));
        this._duration = options?.duration ?? 0;
        this._respectReducedMotion = options?.respectReducedMotion ?? false;

        const easing = options?.timingFunction;
        if (typeof easing === "function") {
            // Callable — used directly. No engine load, value.js-free path.
            this.timingFn = easing;
        } else if (typeof easing === "string") {
            // String name — resolved lazily via the engine boundary on the
            // first `.play()` / `.ready()`. Linear fallback until then.
            this.timingFn = linear;
            this._pendingEasingName = easing;
        } else {
            this.timingFn = linear;
        }

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

    /**
     * Resolve a pending string easing *name* through the dynamic engine
     * boundary. A no-op (resolved promise) when easing was supplied as a
     * callable or omitted. Memoized — the `await import("./engine")` and
     * `getTimingFunction` lookup run at most once per instance.
     *
     * `.play()` awaits this before the first frame; stateless `.at()`
     * consumers that pass a name can `await animation.ready()` first to
     * interpolate with the resolved easing rather than the linear fallback.
     */
    ready(): Promise<void> {
        if (this._pendingEasingName === null) return Promise.resolve();
        if (this._easingReady) return this._easingReady;

        const name = this._pendingEasingName;
        // Direct dynamic import of the engine module — the ONLY value.js
        // edge, and only reached when a named easing is actually used.
        this._easingReady = import("./engine").then((engine) => {
            const resolved = engine.getTimingFunction(name);
            if (resolved) {
                this.timingFn = resolved;
                // Segments captured `this.timingFn` by value at build time —
                // rebuild so they pick up the resolved easing.
                this.segments = this.buildSegments();
            }
            this._pendingEasingName = null;
        });
        return this._easingReady;
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
        // Reduced-motion: snap to final keyframe and resolve immediately.
        // No rAF loop spawned; the callback fires once with the final values.
        if (this._respectReducedMotion && prefersReducedMotion()) {
            const finalValues = this.at(1);
            onFrame?.(finalValues);
            return;
        }
        await this._playback.play(dur, (progress) => {
            const values = this.at(progress);
            onFrame?.(values);
        });
    }

    /** Cancel a running `.play()` animation. The play promise resolves immediately. */
    stop(): void {
        this._playback.stop();
    }
}
