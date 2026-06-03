import {
    cancelAnimationFrame,
    clamp,
    requestAnimationFrame,
} from "./internal/leaves";
import { prefersReducedMotion } from "./internal/reduced-motion";

/** Per-playback options for {@link RAFPlayback.play}. */
export interface RAFPlaybackOptions {
    /**
     * Honor `prefers-reduced-motion: reduce` by snapping to the final frame
     * (`onTick(1)`) in a single paint instead of running the rAF loop. The
     * returned promise resolves on the next microtask. Default false.
     *
     * This is THE shared reduced-motion gate for the light managed-playback
     * surface: `NumericAnimation` (and `ElementMorph`, which composes it)
     * route their `respectReducedMotion` option straight through here, so the
     * snap lives in one place rather than re-implemented per interpolator.
     * SSR-safe — off-DOM `prefersReducedMotion()` is false, so playback runs
     * normally.
     */
    respectReducedMotion?: boolean | undefined;
}

/**
 * Shared rAF playback lifecycle for stateless interpolators
 * (`NumericAnimation`, `ElementMorph`). Owns the rAF handle, start
 * timestamp, resolve callback, AND the `prefers-reduced-motion` gate so the
 * interpolator classes don't each reimplement the same loop or the same
 * reduced-motion snap.
 *
 * Not used by the full `Animation` class — that engine has a richer
 * lifecycle (iteration, direction, fill modes, events) that doesn't
 * factor into this primitive; it carries its own reduced-motion snap.
 */
export class RAFPlayback {
    // `requestAnimationFrame` returns `number` in browsers but the
    // shared `requestAnimationFrame` shim falls back to `setTimeout`
    // in non-DOM environments (jsdom/Node) which returns
    // `NodeJS.Timeout`. Either suffices as an opaque cancel handle.
    private _rafId: ReturnType<typeof requestAnimationFrame> | null = null;
    private _startTime: number | undefined = undefined;
    private _resolve: (() => void) | null = null;

    /**
     * Drive `onTick(progress)` once per frame for `duration` ms.
     * `progress` is clamped to [0, 1]; the loop terminates after the
     * frame at `progress === 1`. The returned promise resolves when
     * the animation completes naturally or is interrupted by `stop()`.
     *
     * Under `options.respectReducedMotion` + an active
     * `prefers-reduced-motion: reduce` query, snaps to the final frame —
     * `onTick(1)` fires once, no rAF loop is spawned, and the promise
     * resolves on the next microtask.
     */
    play(
        duration: number,
        onTick: (progress: number) => void,
        options?: RAFPlaybackOptions,
    ): Promise<void> {
        if (duration <= 0) {
            throw new Error("RAFPlayback.play() requires a duration > 0.");
        }

        this.stop();

        // Reduced-motion: snap to the final frame in a single paint.
        if (options?.respectReducedMotion && prefersReducedMotion()) {
            onTick(1);
            return Promise.resolve();
        }

        return new Promise<void>((resolve) => {
            this._resolve = resolve;
            this._startTime = undefined;

            const tick = (now: number) => {
                if (this._startTime === undefined) this._startTime = now;
                const progress = clamp(
                    (now - this._startTime) / duration,
                    0,
                    1,
                );
                onTick(progress);

                if (progress < 1) {
                    this._rafId = requestAnimationFrame(tick);
                } else {
                    this._cleanup();
                }
            };

            this._rafId = requestAnimationFrame(tick);
        });
    }

    /** Cancel a running playback. The play promise resolves immediately. */
    stop(): void {
        if (this._rafId !== null) {
            cancelAnimationFrame(this._rafId);
        }
        this._cleanup();
    }

    private _cleanup(): void {
        this._rafId = null;
        this._startTime = undefined;
        const resolve = this._resolve;
        this._resolve = null;
        resolve?.();
    }
}
