import { withReducedMotion } from "./internal/reduced-motion";
import { RAFPlayback } from "./playback";

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
    /**
     * When true, honor `prefers-reduced-motion: reduce` by snapping to
     * target immediately rather than damping. `setTarget` short-circuits
     * the smooth-toward path; `play()` invokes `onFrame` once with the
     * target value. Default false (back-compat — consumers opt in).
     *
     * The check uses `matchMedia` if available; on SSR / Node the option
     * is a no-op (animations proceed normally).
     */
    respectReducedMotion: boolean;
}

/** Per-frame callback for `.play()` mode. Receives the smoothed current value. */
export type SmoothFrameCallback = (value: number) => void;

const defaultSmoothOptions: SmoothProgressOptions = {
    damping: 0.1,
    snapThreshold: 0.001,
    targetEpsilon: 0,
    initial: 0,
    clamp: true,
    respectReducedMotion: false,
};

export class SmoothProgress {
    private options: SmoothProgressOptions;
    private targetValue: number;
    private currentValue: number;
    private isSettled: boolean;

    // Managed playback for `.play()` / `.stop()` — loop ownership delegates
    // to the shared RAFPlayback driver (this class is a pure stepper: it
    // implements `Tickable` via `tickDt`/`settled`). Auto-stops on settle;
    // `setTarget()` while `onFrame` is attached and the loop is idle
    // auto-resumes the loop.
    private _playback = new RAFPlayback();
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
            withReducedMotion(
                this.options.respectReducedMotion,
                // Snap directly to target — settled stays true, any bound
                // `onFrame` fires once with the new value, no loop.
                () => this._snapSettled(),
                () => {
                    this.isSettled = false;
                    // Auto-resume the managed loop if `.play()` attached a
                    // callback and the loop idled after a prior settle.
                    if (this._onFrame) this._startLoop();
                },
            );
        }
    }

    /**
     * Reduced-motion snap: jump to target, settle, emit once, and stop the
     * managed loop — symmetric with `SpringProgress._snapSettled`. A
     * reduced-motion snap leaves no scheduled `drive` frame on either
     * stepper; the two `_snapSettled` bodies are now contract-equivalent
     * (value-set + settle + emit + stop), differing only in the spring's
     * velocity/origin fields.
     */
    private _snapSettled(): void {
        this.currentValue = this.targetValue;
        this.isSettled = true;
        this._onFrame?.(this.currentValue);
        this._playback.stop();
    }

    /**
     * THE canonical step: advance by `dt` milliseconds, frame-rate
     * independent. Returns the new current value.
     */
    tickDt(dt: number): number {
        if (this.isSettled) return this.currentValue;

        const factor = 1 - Math.exp((-this.options.damping * dt) / 16.667);
        this.currentValue += (this.targetValue - this.currentValue) * factor;

        if (
            Math.abs(this.targetValue - this.currentValue) <
            this.options.snapThreshold
        ) {
            this.currentValue = this.targetValue;
            this.isSettled = true;
        }

        if (this.options.clamp) {
            this.currentValue = Math.max(0, Math.min(1, this.currentValue));
        }

        return this.currentValue;
    }

    /** Immediately set current = target. */
    snap(): void {
        this.currentValue = this.targetValue;
        this.isSettled = true;
        this._playback.stop();
    }

    /** Reset to a specific value (default 0). */
    reset(value?: number): void {
        const v = value ?? 0;
        this.targetValue = v;
        this.currentValue = v;
        this.isSettled = true;
        this._playback.stop();
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
        withReducedMotion(
            this.options.respectReducedMotion,
            // Short-circuit to an immediate target snap — one emit, no loop.
            () => this._snapSettled(),
            () => {
                if (this.isSettled) {
                    onFrame?.(this.currentValue);
                    return;
                }
                this._startLoop();
            },
        );
    }

    /**
     * Cancel the managed rAF loop and detach the per-frame callback.
     * Pairs with `.play()`. Does not touch current/target/settled state.
     */
    stop(): void {
        this._onFrame = undefined;
        this._playback.stop();
    }

    /**
     * Arm the shared driver: it steps `tickDt(dt)` once per frame until
     * `settled` flips true, emitting `onFrame` per step. Idempotent —
     * the driver no-ops while already running.
     */
    private _startLoop(): void {
        this._playback.drive(this, () => this._onFrame?.(this.currentValue));
    }
}
