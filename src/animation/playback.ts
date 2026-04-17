import {
    cancelAnimationFrame,
    clamp,
    requestAnimationFrame,
} from "@mkbabb/value.js";

/**
 * Shared rAF playback lifecycle for stateless interpolators
 * (`NumericAnimation`, `ElementMorph`). Owns the rAF handle, start
 * timestamp, and resolve callback so the interpolator classes don't
 * each reimplement the same loop.
 *
 * Not used by the full `Animation` class — that engine has a richer
 * lifecycle (iteration, direction, fill modes, events) that doesn't
 * factor into this primitive.
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
     */
    play(duration: number, onTick: (progress: number) => void): Promise<void> {
        if (duration <= 0) {
            throw new Error(
                "RAFPlayback.play() requires a duration > 0.",
            );
        }

        this.stop();

        return new Promise<void>((resolve) => {
            this._resolve = resolve;
            this._startTime = undefined;

            const tick = (now: number) => {
                if (this._startTime === undefined) this._startTime = now;
                const progress = clamp((now - this._startTime) / duration, 0, 1);
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
