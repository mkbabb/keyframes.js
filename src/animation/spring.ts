import { withReducedMotion } from "./internal/reduced-motion";
import { RAFPlayback } from "./playback";

/**
 * iOS-style spring physics options. The pair `(response, dampingFraction)`
 * is the SwiftUI-canonical surface — designer-tunable, normalized so
 * `dampingFraction = 1` is critically damped (no overshoot), `< 1` rings,
 * `> 1` is overdamped (sluggish). Internally these map onto a standard
 * second-order linear ODE
 *
 *   x'' + 2ζω₀ x' + ω₀² x = ω₀² target
 *
 * with `ω₀ = 2π / response` and `ζ = dampingFraction`, unit mass.
 */
export interface SpringProgressOptions {
    /**
     * Angular period of the oscillation in seconds. Roughly the time the
     * spring takes to swing through one cycle if undamped. Default 0.5.
     * Smaller values → snappier; larger → looser.
     */
    response: number;
    /**
     * Damping ratio ζ. `1` critically damped (fastest no-overshoot);
     * `< 1` underdamped (rings); `> 1` overdamped (sluggish). Default
     * 0.86 — the iOS "smooth" preset.
     */
    dampingFraction: number;
    /** Starting position. Default 0. */
    initial: number;
    /** Starting velocity (units/s). Default 0. */
    initialVelocity: number;
    /**
     * Position settle threshold. When |x - target| AND |v| both drop
     * below `settleThreshold` and `velocitySettleThreshold` respectively,
     * the spring snaps to target and stops integrating. Default 1e-3.
     */
    settleThreshold: number;
    /** Velocity settle threshold (units/s). Default 1e-3. */
    velocitySettleThreshold: number;
    /**
     * When true, honor `prefers-reduced-motion: reduce` by snapping to
     * target immediately rather than springing. SSR-safe (no-op on
     * non-browser environments). Default false.
     */
    respectReducedMotion: boolean;
}

/** Subscriber callback. Receives current position + velocity each emission. */
export type SpringSubscriber = (value: number, velocity: number) => void;

/** Per-frame callback for `.play()` mode. */
export type SpringFrameCallback = (value: number, velocity: number) => void;

const defaultSpringOptions: SpringProgressOptions = {
    response: 0.5,
    dampingFraction: 0.86,
    initial: 0,
    initialVelocity: 0,
    settleThreshold: 1e-3,
    velocitySettleThreshold: 1e-3,
    respectReducedMotion: false,
};

/**
 * Live-target spring tracker. Sibling of `SmoothProgress` for animations
 * where the target may change mid-flight (gesture follows, drag, live
 * data) and overshoot / oscillation is desired.
 *
 * The solver integrates the second-order damped harmonic oscillator
 * analytically between target-change events. Mid-frame target changes
 * re-seat the closed-form solution from the current `(x, v)` state, so
 * the trajectory never jumps.
 *
 * Three integration cases (chosen by ζ):
 *
 * - **Underdamped** (ζ < 1): decaying sinusoid. Overshoots; rings.
 * - **Critically damped** (ζ = 1): fastest settle without overshoot.
 * - **Overdamped** (ζ > 1): two exponential modes, monotone settle.
 *
 * API mirrors SwiftUI's `.spring(response:dampingFraction:)`.
 */
export class SpringProgress {
    private options: SpringProgressOptions;

    private targetValue: number;
    private currentValue: number;
    private currentVelocity: number;
    private isSettled: boolean;

    /** Time elapsed since the last target re-seat, in seconds. */
    private elapsed: number;

    /** Cached `(x, v)` at the most recent target re-seat. */
    private originValue: number;
    private originVelocity: number;

    // Derived solver parameters, refreshed on construction + target
    // change. Held as plain fields for hot-path read.
    private omega: number; // ω₀ = 2π / response
    private zeta: number; // ζ = dampingFraction
    private omegaD: number; // damped frequency: ω₀ √(1 - ζ²)  (underdamped only)

    private subscribers: Set<SpringSubscriber> = new Set();
    private disposed: boolean = false;

    // Managed playback for `.play()` / `.stop()` — loop ownership delegates
    // to the shared RAFPlayback driver (this class is a pure stepper: it
    // implements `Tickable` via `tickDt`/`settled`). Symmetric with
    // `SmoothProgress.play(onFrame)`.
    private _playback = new RAFPlayback();
    private _onFrame: SpringFrameCallback | undefined = undefined;

    constructor(options?: Partial<SpringProgressOptions>) {
        this.options = { ...defaultSpringOptions, ...options };

        this.targetValue = this.options.initial;
        this.currentValue = this.options.initial;
        this.currentVelocity = this.options.initialVelocity;
        this.isSettled = this.options.initialVelocity === 0;

        this.elapsed = 0;
        this.originValue = this.currentValue;
        this.originVelocity = this.currentVelocity;

        this.omega = (2 * Math.PI) / this.options.response;
        this.zeta = this.options.dampingFraction;
        this.omegaD =
            this.zeta < 1
                ? this.omega * Math.sqrt(1 - this.zeta * this.zeta)
                : 0;
    }

    // ── Reads ────────────────────────────────────────────────────────

    get target(): number {
        return this.targetValue;
    }

    get value(): number {
        return this.currentValue;
    }

    get velocity(): number {
        return this.currentVelocity;
    }

    get settled(): boolean {
        return this.isSettled;
    }

    // ── Writes ───────────────────────────────────────────────────────

    /**
     * Set the target. The closed-form solution is re-seated from the
     * current `(value, velocity)` so the trajectory is continuous.
     * Idempotent if the target is unchanged.
     */
    set target(value: number) {
        if (value === this.targetValue && !this.options.initialVelocity) {
            // No-op if target didn't change and velocity is zero — keeps
            // the existing closed-form state intact.
            return;
        }
        this.reseatTarget(value);
    }

    private reseatTarget(target: number): void {
        this.targetValue = target;

        withReducedMotion(
            this.options.respectReducedMotion,
            // Snap to target with zero velocity — one emit, no loop.
            () => this._snapSettled(),
            () => {
                // Re-seat origin to current state; reset elapsed clock.
                this.originValue = this.currentValue;
                this.originVelocity = this.currentVelocity;
                this.elapsed = 0;
                this.isSettled = false;

                // Auto-resume the managed loop if `.play()` attached a callback.
                if (this._onFrame) this._startLoop();
            },
        );
    }

    /** Reduced-motion snap: jump to target at zero velocity, settle, emit once. */
    private _snapSettled(): void {
        this.currentValue = this.targetValue;
        this.currentVelocity = 0;
        this.originValue = this.targetValue;
        this.originVelocity = 0;
        this.elapsed = 0;
        this.isSettled = true;
        this.emit();
        this._playback.stop();
    }

    /**
     * Advance by `dt` seconds. Uses the analytic closed-form solution
     * accumulated from the last target re-seat (so per-frame error is
     * O(machine epsilon), not O(dt²) like Euler).
     */
    tick(dt: number): number {
        if (this.disposed || this.isSettled || dt <= 0) {
            return this.currentValue;
        }

        this.elapsed += dt;
        this.evaluateAt(this.elapsed);
        this.checkSettled();
        this.emit();
        return this.currentValue;
    }

    /**
     * Millisecond-clock sibling of {@link tick} — the {@link Tickable}
     * surface the shared `RAFPlayback.drive` loop steps. The spring math is
     * in seconds; rAF (and the driver) deal in milliseconds.
     */
    tickDt(dt: number): number {
        return this.tick(dt / 1000);
    }

    /**
     * Evaluate the solver at elapsed time `t` (seconds) from the most
     * recent target re-seat. Equivalent to `tick(t - elapsed)` but
     * accepts absolute elapsed time — useful when consumers track their
     * own clock.
     */
    tickToTime(t: number): number {
        if (this.disposed || this.isSettled) {
            return this.currentValue;
        }
        this.elapsed = Math.max(0, t);
        this.evaluateAt(this.elapsed);
        this.checkSettled();
        this.emit();
        return this.currentValue;
    }

    /**
     * Analytic step. Updates `currentValue` + `currentVelocity` to
     * `(x(t), v(t))` of the underlying second-order system, with
     * `x(0) = originValue - targetValue`, `v(0) = originVelocity`.
     *
     * Cases:
     *   underdamped:   x(t) = e^(-ζω t) [A cos(ω_d t) + B sin(ω_d t)]
     *   critical:      x(t) = e^(-ω t) [A + B t]
     *   overdamped:    x(t) = A e^(r₁ t) + B e^(r₂ t)
     */
    private evaluateAt(t: number): void {
        const x0 = this.originValue - this.targetValue;
        const v0 = this.originVelocity;
        const w = this.omega;
        const z = this.zeta;

        let xRel: number;
        let vRel: number;

        if (z < 1) {
            // Underdamped.
            const wd = this.omegaD;
            const decay = Math.exp(-z * w * t);
            const A = x0;
            const B = (v0 + z * w * x0) / wd;
            const cos = Math.cos(wd * t);
            const sin = Math.sin(wd * t);
            xRel = decay * (A * cos + B * sin);
            // Derivative.
            vRel =
                decay *
                ((B * wd - A * z * w) * cos - (A * wd + B * z * w) * sin);
        } else if (z === 1) {
            // Critically damped.
            const decay = Math.exp(-w * t);
            const A = x0;
            const B = v0 + w * x0;
            xRel = decay * (A + B * t);
            vRel = decay * (B - w * (A + B * t));
        } else {
            // Overdamped. Two real roots of r² + 2ζω r + ω² = 0.
            const disc = w * Math.sqrt(z * z - 1);
            const r1 = -z * w + disc;
            const r2 = -z * w - disc;
            // Solve A + B = x0, A r1 + B r2 = v0.
            const A = (v0 - r2 * x0) / (r1 - r2);
            const B = x0 - A;
            const e1 = Math.exp(r1 * t);
            const e2 = Math.exp(r2 * t);
            xRel = A * e1 + B * e2;
            vRel = A * r1 * e1 + B * r2 * e2;
        }

        this.currentValue = this.targetValue + xRel;
        this.currentVelocity = vRel;
    }

    private checkSettled(): void {
        const dx = Math.abs(this.currentValue - this.targetValue);
        const dv = Math.abs(this.currentVelocity);
        if (
            dx < this.options.settleThreshold &&
            dv < this.options.velocitySettleThreshold
        ) {
            this.currentValue = this.targetValue;
            this.currentVelocity = 0;
            this.isSettled = true;
        }
    }

    /** Immediately set value = target, zero velocity. */
    snap(): void {
        this._snapSettled();
    }

    /** Reset position + velocity to a specified value (default 0). */
    reset(value?: number, velocity?: number): void {
        const v = value ?? 0;
        const vel = velocity ?? 0;
        this.targetValue = v;
        this.currentValue = v;
        this.currentVelocity = vel;
        this.originValue = v;
        this.originVelocity = vel;
        this.elapsed = 0;
        this.isSettled = vel === 0;
        this.emit();
        this._playback.stop();
    }

    // ── Subscribe / dispose ──────────────────────────────────────────

    /**
     * Subscribe to per-tick updates. Returns an unsubscribe handle.
     * Called with `(value, velocity)` on every `tick`/`snap`/`reset`/
     * `target` set.
     */
    subscribe(fn: SpringSubscriber): () => void {
        this.subscribers.add(fn);
        return () => {
            this.subscribers.delete(fn);
        };
    }

    private emit(): void {
        if (this.subscribers.size === 0) return;
        for (const fn of this.subscribers) {
            fn(this.currentValue, this.currentVelocity);
        }
    }

    /** Tear down the spring. Cancels the rAF loop and clears subscribers. */
    dispose(): void {
        this.disposed = true;
        this._playback.stop();
        this.subscribers.clear();
    }

    // ── Managed playback ─────────────────────────────────────────────

    /**
     * Start a managed rAF loop that calls `tick(dt)` each frame until
     * `settled`, invoking `onFrame(value, velocity)` per tick. Idempotent
     * — repeat calls re-bind the callback without spawning a second loop.
     * Once settled the loop auto-stops; setting `target` while a callback
     * is bound auto-resumes the loop without needing another `.play()`.
     */
    play(onFrame?: SpringFrameCallback): void {
        if (this.disposed) return;
        this._onFrame = onFrame;
        withReducedMotion(
            this.options.respectReducedMotion,
            // Snap to target at zero velocity — one emit, no loop.
            () => this._snapSettled(),
            () => {
                if (this.isSettled) {
                    onFrame?.(this.currentValue, this.currentVelocity);
                    return;
                }
                this._startLoop();
            },
        );
    }

    /** Cancel the managed rAF loop and detach the per-frame callback. */
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
        this._playback.drive(this, () =>
            this._onFrame?.(this.currentValue, this.currentVelocity),
        );
    }
}
