import { SmoothProgress } from "./smooth";
import type { SmoothProgressOptions } from "./smooth";
import type { TimingFunction, TimingFunctionNames } from "./constants";

export interface TimelineOptions {
    /**
     * Easing as a callable `TimingFunction`, OR a string easing *name*
     * from value.js's registry (`"ease-out-cubic"`, `"easeOutCubic"`, …).
     *
     * A **callable** is applied directly and keeps `Timeline` value.js-free.
     *
     * A **string name** is resolved LAZILY through the dynamic engine
     * boundary: the constructor kicks off an `await import(...)` and the
     * resolved easing is applied once it lands (subsequent `tick()`s use
     * it). Until then `tick()` runs with the identity easing. Consumers
     * that need the eased value on the very first `tick()` can
     * `await timeline.ready()` first.
     */
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

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

export abstract class Timeline {
    private smoother: SmoothProgress | null;
    private easingFn: TimingFunction | null;
    private currentProgress: number = 0;
    private boundaryEpsilon: number;
    // Memoized resolve-once promise for a pending string easing name.
    // `null` when easing was a callable / omitted (nothing to resolve).
    private _easingReady: Promise<void> | null = null;

    constructor(options?: TimelineOptions) {
        this.boundaryEpsilon = options?.boundaryEpsilon ?? 0.005;

        const easing = options?.easing;
        if (typeof easing === "function") {
            // Callable — applied directly, value.js-free path.
            this.easingFn = easing;
        } else if (typeof easing === "string") {
            // String name — identity until lazily resolved through the
            // engine boundary. Resolution is kicked off now (fire-and-forget)
            // and also awaitable via `ready()`.
            this.easingFn = null;
            void this.resolveEasingName(easing);
        } else {
            this.easingFn = null;
        }

        if (options?.smoothing === false) {
            this.smoother = null;
        } else {
            this.smoother = new SmoothProgress(
                options?.smoothing as Partial<SmoothProgressOptions> | undefined,
            );
        }
    }

    /**
     * Lazily resolve a string easing *name* through the dynamic engine
     * boundary. Memoized — the `await import("./engine")` and
     * `getTimingFunction` lookup run at most once.
     */
    private resolveEasingName(name: TimingFunctionNames): Promise<void> {
        if (this._easingReady) return this._easingReady;
        // Direct dynamic import of the engine module — the ONLY value.js
        // edge, reached only when a named easing is actually used.
        this._easingReady = import("./engine").then((engine) => {
            const resolved = engine.getTimingFunction(name);
            if (resolved) this.easingFn = resolved;
        });
        return this._easingReady;
    }

    /**
     * Resolve a pending string easing *name* through the dynamic engine
     * boundary. No-op (resolved promise) for callable / omitted easing.
     * `await timeline.ready()` before the first `tick()` to apply the
     * eased value immediately rather than letting it land asynchronously.
     */
    ready(): Promise<void> {
        return this._easingReady ?? Promise.resolve();
    }

    /** Subclass returns raw [0,1] progress from its source. */
    protected abstract sample(): number;

    /**
     * Shared progress pipeline: sample → clamp → easing → boundary snap.
     * Returns the processed raw value. Does NOT advance the smoother —
     * the caller (tick or tickDt) drives the smoother with the appropriate
     * time-step method.
     */
    private applyPipeline(): number {
        let raw = clamp01(this.sample());
        if (this.easingFn) raw = this.easingFn(raw);

        // Snap to exact boundary when within epsilon — prevents oscillation
        // from micro-jitter alternating between snap and lerp each frame.
        const eps = this.boundaryEpsilon;
        if (raw <= eps) raw = 0;
        else if (raw >= 1 - eps) raw = 1;

        return raw;
    }

    /**
     * Finalize progress after the smoother has been advanced (or bypassed).
     * Snaps the smoother at boundaries [0, 1] for instant convergence.
     */
    private finalizeProgress(raw: number): number {
        if (this.smoother) {
            this.smoother.setTarget(raw);
            if (raw <= 0 || raw >= 1) {
                this.smoother.snap();
            }
        }
        this.currentProgress = this.smoother ? this.smoother.current : raw;
        return this.currentProgress;
    }

    /**
     * Shared advance step. When `dt` is undefined, drives the
     * smoother in frame-rate-dependent mode (`tick()`); when given,
     * uses the frame-rate-independent variant (`tickDt(dt)`).
     */
    private _advance(dt?: number): number {
        const raw = this.applyPipeline();
        if (this.smoother && raw > 0 && raw < 1) {
            this.smoother.setTarget(raw);
            if (dt === undefined) this.smoother.tick();
            else this.smoother.tickDt(dt);
            this.currentProgress = this.smoother.current;
        } else {
            this.finalizeProgress(raw);
        }
        return this.currentProgress;
    }

    /** Advance one frame. Applies easing → boundary snap → smoothing. */
    tick(): number {
        return this._advance();
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
