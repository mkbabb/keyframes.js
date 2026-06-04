import { toEasing } from "./easing";
import { AnimationOptionError } from "./internal/errors";
import { SmoothProgress } from "./smooth";
import type { SmoothProgressOptions } from "./smooth";
import type { Easing, TimingFunction } from "./constants";

export interface TimelineOptions {
    /**
     * Easing as a callable `TimingFunction` or a typed `Easing` — both
     * synchronous and value.js-free, so the `Timeline` family never touches
     * the dynamic boundary.
     *
     * A string easing *name* is NOT accepted here (fail-explicit: it
     * throws). Resolve a name once, up front, through the async factory:
     *
     * ```ts
     * const easing = await resolveEasing("ease-out-cubic");
     * new ScrollTimeline({ easing });
     * ```
     */
    easing?: TimingFunction | Easing | undefined;
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

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

export abstract class Timeline {
    private smoother: SmoothProgress | null;
    // The resolved easing callable — synchronous from construction. The
    // identity default means "no easing applied" for the omitted case.
    private _easingFn: TimingFunction;
    private currentProgress: number = 0;
    private boundaryEpsilon: number;

    constructor(options?: TimelineOptions) {
        this.boundaryEpsilon = options?.boundaryEpsilon ?? 0.005;

        const easing = options?.easing;
        if (typeof easing === "string") {
            // Fail-explicit: a string name needs the async registry —
            // never a silent identity fallback.
            throw new AnimationOptionError(
                "easing",
                easing,
                "Timeline accepts a callable TimingFunction or a typed " +
                    "Easing; resolve a string name first via " +
                    "`await resolveEasing(name)`.",
            );
        }
        this._easingFn = easing == null ? (t) => t : toEasing(easing).fn;

        if (options?.smoothing === false) {
            this.smoother = null;
        } else {
            this.smoother = new SmoothProgress(
                options?.smoothing as
                    | Partial<SmoothProgressOptions>
                    | undefined,
            );
        }
    }

    /** Subclass returns raw [0,1] progress from its source. */
    protected abstract sample(): number;

    /**
     * Shared progress pipeline: sample → clamp → easing → boundary snap.
     * Returns the processed raw value. Does NOT advance the smoother —
     * `_advance` drives it.
     */
    private applyPipeline(): number {
        let raw = clamp01(this.sample());
        // The identity default makes this a no-op for the omitted-easing case.
        raw = this._easingFn(raw);

        // Snap to exact boundary when within epsilon — prevents oscillation
        // from micro-jitter alternating between snap and lerp each frame.
        const eps = this.boundaryEpsilon;
        if (raw <= eps) raw = 0;
        else if (raw >= 1 - eps) raw = 1;

        return raw;
    }

    /**
     * Shared advance step: pipeline → ONE `setTarget` → ONE branch. At a
     * boundary ([0,1]) the smoother snaps for instant convergence; in the
     * interior it steps `tickDt(dt)` (the canonical ms step). Returns the
     * resulting progress.
     */
    private _advance(dt: number): number {
        const raw = this.applyPipeline();
        if (this.smoother) {
            this.smoother.setTarget(raw);
            if (raw <= 0 || raw >= 1) this.smoother.snap();
            else this.smoother.tickDt(dt);
            this.currentProgress = this.smoother.current;
        } else {
            this.currentProgress = raw;
        }
        return this.currentProgress;
    }

    /**
     * Advance one frame at a nominal 60fps step. Applies
     * easing → boundary snap → smoothing. Use {@link tickDt} when you own
     * a real frame clock.
     */
    tick(): number {
        return this._advance(16.667);
    }

    /** Frame-rate independent variant. `dt` in milliseconds. */
    tickDt(dt: number): number {
        return this._advance(dt);
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
