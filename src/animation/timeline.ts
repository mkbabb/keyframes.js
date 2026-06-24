import { toEasing } from "./easing";
import { clamp } from "./internal/leaves";
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
        let raw = clamp(this.sample(), 0, 1);
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

export interface KeyframesScrollTimelineOptions extends TimelineOptions {
    /** Viewport fraction for full progress. Default 0.35. */
    threshold?: number | undefined;
    /** Custom scroll position supplier. Default: window.scrollY. */
    getScrollY?: (() => number) | undefined;
    /** Custom viewport height supplier. Default: window.innerHeight. */
    getViewportHeight?: (() => number) | undefined;
}

/**
 * The JS scroll-progress sampler.
 *
 * ── PKG-3 RENAME (L.W8 §S4 · audit W126). Formerly `ScrollTimeline`. Renamed
 * `ScrollTimeline` → `KeyframesScrollTimeline` because the rolled-up d.ts
 * declaration `ScrollTimeline` collided with the ambient `globalThis.ScrollTimeline`
 * (the Houdini native scroll timeline): API Extractor renamed the colliding
 * source class and re-exported it under a numeric-suffixed alias that leaked
 * into IDE hover text. Naming the class `KeyframesScrollTimeline` (no ambient
 * collision) clears the rename; gated by `proof:pkg3-clean`. The legacy
 * `ScrollTimeline` backward-compat RE-EXPORT alias was DROPPED in 5.0.0
 * (Q.WE1 — NO-LEGACY).
 */
export class KeyframesScrollTimeline extends Timeline {
    private threshold: number;
    private getScrollY: () => number;
    private getViewportHeight: () => number;

    constructor(options?: KeyframesScrollTimelineOptions) {
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

/**
 * Spec for the ADDITIVE native scroll-driven bridge (D-LIB-2 / F-5).
 *
 * A `kind: "scroll"` request maps to the platform `ScrollTimeline` (scroll
 * progress over a `source` scroller); `kind: "view"` maps to `ViewTimeline`
 * (a `subject`'s view progress through its scrollport). `axis` defaults to the
 * platform default (`block`). value.js-free — these are DOM globals.
 */
export type NativeTimelineSpec =
    | { kind: "scroll"; source?: Element | null; axis?: ScrollAxis }
    | { kind: "view"; subject: Element; axis?: ScrollAxis; inset?: string };

/**
 * Feature-detect (`"ScrollTimeline" in window` / `"ViewTimeline" in window`)
 * and construct a NATIVE `AnimationTimeline` for the additive WAAPI scroll
 * bridge (D-LIB-2 / F-5). Returns `null` where the platform lacks the API
 * (Firefox today, SSR, jsdom) — the caller then keeps the JS {@link Timeline}
 * sampler, which is the proven fallback AND the only general driver over
 * non-DOM targets.
 *
 * CRITICAL — the ARCH-kill HOLDS: this does NOT replace the JS sampler. Native
 * scroll-driven is Chromium-only / not-Baseline, and the JS `Timeline` is a
 * strictly more general caller-polled sampler (it also applies `SmoothProgress`
 * smoothing + boundary snap the native `animation-range` path has none of). The
 * bridge is a pure additive fast lane where supported + eligible. No polyfill.
 *
 * Light: a runtime `in`-detect over the `window` globals — zero static
 * value.js / engine edge, so importing this keeps `timeline.ts` light.
 */
export function createNativeTimeline(
    spec: NativeTimelineSpec,
): AnimationTimeline | null {
    if (typeof window === "undefined") return null;

    // Qualify with `globalThis.` — the bare identifier `ScrollTimeline` is the
    // module's backward-compat re-export alias of the JS `KeyframesScrollTimeline`
    // sampler (PKG-3, L.W8 §S4), NOT the native platform global; `globalThis.`
    // pins the platform's own constructor (typed by lib.dom's `declare var
    // ScrollTimeline`). The option types are DERIVED from those constructors
    // (`ConstructorParameters`) — the JS sampler's own option interface is now
    // `KeyframesScrollTimelineOptions`, distinct from lib.dom's
    // `ScrollTimelineOptions`, so the names no longer shadow.
    if (spec.kind === "scroll") {
        if (typeof globalThis.ScrollTimeline === "undefined") return null;
        type NativeScrollOptions = NonNullable<
            ConstructorParameters<typeof globalThis.ScrollTimeline>[0]
        >;
        const options: NativeScrollOptions = {};
        if (spec.source !== undefined) options.source = spec.source;
        if (spec.axis !== undefined) options.axis = spec.axis;
        return new globalThis.ScrollTimeline(options);
    }

    if (typeof globalThis.ViewTimeline === "undefined") return null;
    type NativeViewOptions = NonNullable<
        ConstructorParameters<typeof globalThis.ViewTimeline>[0]
    >;
    const options: NativeViewOptions = { subject: spec.subject };
    if (spec.axis !== undefined) options.axis = spec.axis;
    if (spec.inset !== undefined) options.inset = spec.inset;
    return new globalThis.ViewTimeline(options);
}
