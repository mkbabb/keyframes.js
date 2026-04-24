import {
    cancelAnimationFrame,
    requestAnimationFrame,
} from "@mkbabb/value.js";

export interface SmoothProgressOptions {
    /** Damping factor (0, 1]. Higher = faster convergence. Default 0.1 */
    damping: number;
    /** Snap to target when |target - current| < threshold. Default 0.001 */
    snapThreshold: number;
    /**
     * Minimum change required to update the target. Changes smaller than this
     * are ignored, filtering high-frequency noise (e.g. sub-pixel scroll jitter).
     * Default 0 (disabled — every change is accepted).
     */
    targetEpsilon: number;
    /** Starting value. Default 0 */
    initial: number;
    /** Clamp current to [0, 1]. Default true */
    clamp: boolean;
}

/** Per-frame callback for `.play()` mode. Receives the smoothed current value. */
export type SmoothFrameCallback = (value: number) => void;

const defaultSmoothOptions: SmoothProgressOptions = {
    damping: 0.1,
    snapThreshold: 0.001,
    targetEpsilon: 0,
    initial: 0,
    clamp: true,
};

export class SmoothProgress {
    private options: SmoothProgressOptions;
    private targetValue: number;
    private currentValue: number;
    private isSettled: boolean;

    // Managed rAF lifecycle for `.play()` / `.stop()`. Symmetric with
    // `NumericAnimation.play(onFrame)`: the engine owns the loop so
    // consumers never reimplement rAF glue. Auto-stops on settle;
    // `setTarget()` while `onFrame` is attached and the loop is idle
    // auto-resumes the loop.
    private _rafId: ReturnType<typeof requestAnimationFrame> | null = null;
    private _lastFrameT: number = 0;
    private _onFrame: SmoothFrameCallback | undefined = undefined;

    constructor(options?: Partial<SmoothProgressOptions>) {
        this.options = { ...defaultSmoothOptions, ...options };
        this.targetValue = this.options.initial;
        this.currentValue = this.options.initial;
        this.isSettled = true;
    }

    get target(): number {
        return this.targetValue;
    }

    get current(): number {
        return this.currentValue;
    }

    get settled(): boolean {
        return this.isSettled;
    }

    setTarget(target: number): void {
        if (this.options.clamp) {
            target = Math.max(0, Math.min(1, target));
        }
        const delta = Math.abs(target - this.targetValue);
        if (delta > 0 && delta >= this.options.targetEpsilon) {
            this.targetValue = target;
            this.isSettled = false;
            // Auto-resume the managed loop if `.play()` attached a
            // callback and the loop has idled after a prior settle.
            if (this._onFrame && this._rafId === null) {
                this._startLoop();
            }
        }
    }

    /** Advance one step using fixed damping. Returns current value. */
    tick(): number {
        if (this.isSettled) return this.currentValue;

        this.currentValue +=
            (this.targetValue - this.currentValue) * this.options.damping;

        if (
            Math.abs(this.targetValue - this.currentValue) <
            this.options.snapThreshold
        ) {
            this.currentValue = this.targetValue;
            this.isSettled = true;
        }

        if (this.options.clamp) {
            this.currentValue = Math.max(
                0,
                Math.min(1, this.currentValue),
            );
        }

        return this.currentValue;
    }

    /** Frame-rate independent tick. dt is in milliseconds. */
    tickDt(dt: number): number {
        if (this.isSettled) return this.currentValue;

        const factor = 1 - Math.exp((-this.options.damping * dt) / 16.667);
        this.currentValue +=
            (this.targetValue - this.currentValue) * factor;

        if (
            Math.abs(this.targetValue - this.currentValue) <
            this.options.snapThreshold
        ) {
            this.currentValue = this.targetValue;
            this.isSettled = true;
        }

        if (this.options.clamp) {
            this.currentValue = Math.max(
                0,
                Math.min(1, this.currentValue),
            );
        }

        return this.currentValue;
    }

    /** Immediately set current = target. */
    snap(): void {
        this.currentValue = this.targetValue;
        this.isSettled = true;
        this._stopLoop();
    }

    /** Reset to a specific value (default 0). */
    reset(value?: number): void {
        const v = value ?? 0;
        this.targetValue = v;
        this.currentValue = v;
        this.isSettled = true;
        this._stopLoop();
    }

    /**
     * Start a managed rAF loop that calls `tickDt(dt)` each frame until
     * `settled`, invoking `onFrame(current)` per tick. Idempotent — repeat
     * calls re-bind the callback without spawning a second loop. Once
     * settled the loop auto-stops; `setTarget()` while a callback is
     * bound auto-resumes the loop without needing another `.play()`.
     *
     * Symmetric with `NumericAnimation.play(onFrame)`: library owns rAF,
     * consumer provides a per-frame callback. Consumers that already
     * drive their own rAF (e.g. canvas renderers) should continue to
     * call `.tickDt(dt)` directly and never invoke `.play()`.
     */
    play(onFrame?: SmoothFrameCallback): void {
        this._onFrame = onFrame;
        if (this.isSettled) {
            onFrame?.(this.currentValue);
            return;
        }
        this._startLoop();
    }

    /**
     * Cancel the managed rAF loop and detach the per-frame callback.
     * Pairs with `.play()`. Does not touch current/target/settled state.
     */
    stop(): void {
        this._onFrame = undefined;
        this._stopLoop();
    }

    private _startLoop(): void {
        if (this._rafId !== null) return;
        this._lastFrameT = 0;
        const frame = (now: number): void => {
            const dt = this._lastFrameT ? now - this._lastFrameT : 16.667;
            this._lastFrameT = now;
            const v = this.tickDt(dt);
            this._onFrame?.(v);
            if (this.isSettled) {
                this._stopLoop();
                return;
            }
            this._rafId = requestAnimationFrame(frame);
        };
        this._rafId = requestAnimationFrame(frame);
    }

    private _stopLoop(): void {
        if (this._rafId !== null) {
            cancelAnimationFrame(this._rafId);
            this._rafId = null;
        }
        this._lastFrameT = 0;
    }
}
