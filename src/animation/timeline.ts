import { SmoothProgress } from "./smooth";
import type { SmoothProgressOptions } from "./smooth";
import type { TimingFunction, TimingFunctionNames } from "./constants";
import { timingFunctions } from "../easing";

export interface TimelineOptions {
    easing?: TimingFunction | TimingFunctionNames | undefined;
    /** SmoothProgress config. `false` disables smoothing. Default: enabled. */
    smoothing?: Partial<SmoothProgressOptions> | false | undefined;
    /**
     * Boundary snap zone. When the eased progress is within this distance of
     * 0 or 1, the smoother snaps instantly instead of lerping. Prevents
     * oscillation at scroll endpoints where micro-jitter alternates between
     * boundary and non-boundary values each frame.
     * Default 0.005.
     */
    boundaryEpsilon?: number | undefined;
}

const resolveEasing = (
    easing: TimingFunction | TimingFunctionNames | undefined,
): TimingFunction | null => {
    if (easing == null) return null;
    if (typeof easing === "function") return easing;
    const fn = timingFunctions[easing];
    if (typeof fn === "function" && fn.length <= 1) {
        return fn as TimingFunction;
    }
    return null;
};

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

export abstract class Timeline {
    private smoother: SmoothProgress | null;
    private easingFn: TimingFunction | null;
    private currentProgress: number = 0;
    private boundaryEpsilon: number;

    constructor(options?: TimelineOptions) {
        this.easingFn = resolveEasing(options?.easing);
        this.boundaryEpsilon = options?.boundaryEpsilon ?? 0.005;

        if (options?.smoothing === false) {
            this.smoother = null;
        } else {
            this.smoother = new SmoothProgress(
                options?.smoothing as Partial<SmoothProgressOptions> | undefined,
            );
        }
    }

    /** Subclass returns raw [0,1] progress from its source. */
    protected abstract sample(): number;

    /** Advance one frame. Applies easing -> boundary snap -> smoothing. */
    tick(): number {
        let raw = clamp01(this.sample());
        if (this.easingFn) raw = this.easingFn(raw);

        // Snap to exact boundary when within epsilon — prevents oscillation
        // from micro-jitter alternating between snap and lerp each frame.
        const eps = this.boundaryEpsilon;
        if (raw <= eps) raw = 0;
        else if (raw >= 1 - eps) raw = 1;

        if (this.smoother) {
            this.smoother.setTarget(raw);
            if (raw <= 0 || raw >= 1) {
                this.smoother.snap();
            } else {
                this.smoother.tick();
            }
            this.currentProgress = this.smoother.current;
        } else {
            this.currentProgress = raw;
        }
        return this.currentProgress;
    }

    /** Frame-rate independent variant. dt in ms. */
    tickDt(dt: number): number {
        let raw = clamp01(this.sample());
        if (this.easingFn) raw = this.easingFn(raw);

        const eps = this.boundaryEpsilon;
        if (raw <= eps) raw = 0;
        else if (raw >= 1 - eps) raw = 1;

        if (this.smoother) {
            this.smoother.setTarget(raw);
            if (raw <= 0 || raw >= 1) {
                this.smoother.snap();
            } else {
                this.smoother.tickDt(dt);
            }
            this.currentProgress = this.smoother.current;
        } else {
            this.currentProgress = raw;
        }
        return this.currentProgress;
    }

    get progress(): number {
        return this.currentProgress;
    }

    /** True if no smoother or smoother is settled. */
    get settled(): boolean {
        return this.smoother == null || this.smoother.settled;
    }

    /** Immediately converge smoother to current target. */
    snap(): void {
        this.smoother?.snap();
        if (this.smoother) {
            this.currentProgress = this.smoother.current;
        }
    }

    /** Reset progress to a specific value (default 0). */
    reset(value?: number): void {
        const v = value ?? 0;
        if (this.smoother) {
            this.smoother.reset(v);
        }
        this.currentProgress = v;
    }
}

export interface ScrollTimelineOptions extends TimelineOptions {
    /** Viewport fraction for full progress. Default 0.35. */
    threshold?: number | undefined;
    /** Custom scroll position supplier. Default: window.scrollY. */
    getScrollY?: (() => number) | undefined;
    /** Custom viewport height supplier. Default: window.innerHeight. */
    getViewportHeight?: (() => number) | undefined;
}

export class ScrollTimeline extends Timeline {
    private threshold: number;
    private getScrollY: () => number;
    private getViewportHeight: () => number;

    constructor(options?: ScrollTimelineOptions) {
        super(options);
        this.threshold = options?.threshold ?? 0.35;
        this.getScrollY = options?.getScrollY ?? (() => window.scrollY);
        this.getViewportHeight =
            options?.getViewportHeight ?? (() => window.innerHeight);
    }

    protected sample(): number {
        const maxScroll = this.getViewportHeight() * this.threshold;
        return maxScroll <= 0 ? 0 : this.getScrollY() / maxScroll;
    }
}

export class ManualTimeline extends Timeline {
    private value: number = 0;

    constructor(options?: TimelineOptions) {
        super({ smoothing: false, ...options });
    }

    /** Set the raw progress value. */
    set(value: number): void {
        this.value = value;
    }

    protected sample(): number {
        return this.value;
    }
}
