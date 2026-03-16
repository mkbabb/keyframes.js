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
    }

    /** Reset to a specific value (default 0). */
    reset(value?: number): void {
        const v = value ?? 0;
        this.targetValue = v;
        this.currentValue = v;
        this.isSettled = true;
    }
}
