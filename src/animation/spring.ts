import { clamp } from "./internal/leaves";
import {
    reducedMotionScale,
    withReducedMotion,
    type ReducedMotionPolicy,
} from "./internal/reduced-motion";
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
     * Honor `prefers-reduced-motion: reduce` (K.W11 PHYS-E — the
     * intensity-scaled, WCAG 2.3.3-aligned gate):
     *
     * - `false` (default) — ignore the preference; the spring runs at full
     *   amplitude.
     * - `true` — the classic binary snap: under an active query the spring
     *   jumps to target at zero velocity (amplitude scale `0`). SSR-safe.
     * - a `number` ∈ [0, 1] — the AMPLITUDE INTENSITY: under an active query
     *   the spring keeps its trajectory SHAPE (curve + settle time) but scales
     *   its displacement-from-rest (`originValue − targetValue`) to this
     *   fraction. At `0.3` the peak overshoot is 30 % of the full-intensity
     *   peak; the envelope is preserved by construction (the analytic form
     *   makes the scaling exact and free). `1` ≈ full motion, `0` ≡ the snap.
     *
     * The scale is the CONSUMER's policy (a settings slider, a per-animation
     * field) — the OS exposes only a binary signal; kf provides the mechanism.
     */
    respectReducedMotion: ReducedMotionPolicy;
}

/**
 * The modern, time-based spring surface — the idiom Motion now leads its
 * docs with, treating `(response, dampingFraction)` as the advanced
 * fallback. A pure parameter translation: `response = visualDuration` and
 * `dampingFraction = 1 − bounce` (clamped). The solver, the `linear()`
 * sampler, and the live re-seat are unchanged — this is a construction-time
 * alternate surface, zero hot-path cost.
 *
 * Exactly one of `visualDuration` / `duration` selects the perceptual
 * settle time (the period mapped onto `response`); `bounce` ∈ [−1, 1]
 * selects overshoot (`0` ≈ critically damped, `> 0` rings, `< 0`
 * overdamped). The remaining {@link SpringProgressOptions} keys
 * (`initial`, `initialVelocity`, thresholds, `respectReducedMotion`)
 * carry through unchanged.
 */
export interface SpringDurationOptions
    extends Partial<
        Pick<
            SpringProgressOptions,
            | "initial"
            | "initialVelocity"
            | "settleThreshold"
            | "velocitySettleThreshold"
            | "respectReducedMotion"
        >
    > {
    /**
     * The perceptual settle duration in seconds — mapped directly onto
     * `response`. The designer-facing name for the same quantity.
     */
    visualDuration?: number;
    /**
     * Alias of {@link visualDuration} (the Motion `duration` key). When
     * both are supplied, `visualDuration` wins. Default 0.5.
     */
    duration?: number;
    /**
     * Overshoot, in [−1, 1]. `0` maps to critically damped (no ring),
     * `> 0` rings (underdamped), `< 0` is overdamped (sluggish). Mapped
     * `dampingFraction = 1 − bounce`. Default 0.
     */
    bounce?: number;
}

/**
 * Translate the time-based `{ visualDuration | duration, bounce }` surface
 * to the canonical `(response, dampingFraction)` pair — the documented
 * Motion mapping. `response = visualDuration`; `dampingFraction = 1 −
 * bounce`, with `bounce` clamped to `[−1, 1]` (so `dampingFraction` lands
 * in `[0, 2]`). Returns a `Partial<SpringProgressOptions>` the standard
 * constructor consumes directly — there is no second code path.
 */
function durationToSpringOptions(
    opts: SpringDurationOptions,
): Partial<SpringProgressOptions> {
    const {
        visualDuration,
        duration,
        bounce = 0,
        ...passthrough
    } = opts;
    const response = visualDuration ?? duration ?? defaultSpringOptions.response;
    const dampingFraction = 1 - clamp(bounce, -1, 1);
    return { ...passthrough, response, dampingFraction };
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

    /**
     * Amplitude scale ∈ [0, 1] resolved from `respectReducedMotion` at each
     * target re-seat (K.W11 PHYS-E). `1` is full motion (the default / no
     * active query); a numeric policy under an active `prefers-reduced-motion`
     * query yields the intensity. `evaluateAt` solves toward a SCALED target
     * `origin + s·(target − origin)`, so the spring still starts at the origin
     * but travels only `s ×` the full distance — the peak overshoot scales while
     * the envelope (curve + settle time) is preserved by construction. Re-resolved
     * per re-seat (not per frame) so a live OS toggle is honored at the next
     * target change, and the per-frame `evaluateAt` stays a field read — zero
     * extra `matchMedia` cost in the hot path.
     */
    private amplitudeScale = 1;

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
        // K.W11 PHYS-E — resolve the amplitude scale for the initial leg (a
        // spring constructed with `initialVelocity` integrates from frame one).
        this.amplitudeScale = reducedMotionScale(
            this.options.respectReducedMotion,
        );

        this.omega = (2 * Math.PI) / this.options.response;
        this.zeta = this.options.dampingFraction;
        this.omegaD =
            this.zeta < 1
                ? this.omega * Math.sqrt(1 - this.zeta * this.zeta)
                : 0;
    }

    /**
     * Construct a spring from the modern time-based surface
     * `{ visualDuration | duration, bounce }` (the idiom Motion leads its
     * docs with). Pure parameter translation to `(response,
     * dampingFraction)` — `response = visualDuration`, `dampingFraction =
     * 1 − bounce` (clamped) — normalized once here, then handed to the
     * standard constructor. The solver, the `linear()` sampler, and the
     * live re-seat are identical to the `(response, dampingFraction)`
     * path: `fromDuration({ visualDuration: d, bounce: b })` is trajectory-
     * identical to `new SpringProgress({ response: d, dampingFraction: 1 −
     * b })`.
     */
    static fromDuration(options?: SpringDurationOptions): SpringProgress {
        return new SpringProgress(durationToSpringOptions(options ?? {}));
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

                // K.W11 PHYS-E — resolve the amplitude scale for THIS leg from
                // the live preference. A positive intensity reaches the `run`
                // branch (the `withReducedMotion` snap arm is `_snapSettled`);
                // here we record how far the displacement is allowed to travel.
                this.amplitudeScale = reducedMotionScale(
                    this.options.respectReducedMotion,
                );

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
     * THE canonical step: advance by `dt` MILLISECONDS — the {@link Tickable}
     * surface the shared `RAFPlayback.drive` loop steps, and the one unit
     * every stepper's public step takes. Returns the new value.
     *
     * The spring math is in seconds; this converts and delegates to the
     * private analytic stepper {@link _stepSeconds}.
     */
    tickDt(dt: number): number {
        return this._stepSeconds(dt / 1000);
    }

    /**
     * Analytic per-frame step in SECONDS — the spring's native clock.
     * @internal — the canonical public step is the millisecond `tickDt`;
     * only the seconds-based spring samplers (`springLinearStops`,
     * `springTimingFunction`) drive this directly. Uses the closed-form
     * solution accumulated from the last target re-seat (per-frame error is
     * O(machine epsilon), not O(dt²) like Euler).
     */
    _stepSeconds(dt: number): number {
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
        // K.W11 PHYS-E — amplitude scaling under reduced motion. The spring
        // travels toward a SCALED target `origin + s·(target − origin)`: it
        // still STARTS at the origin (x0 = origin − scaledTarget = s·(origin −
        // target)) but settles only `s ×` the full distance, so the peak
        // displacement (and the overshoot) scales by `s` while the envelope
        // (decay + frequency → curve shape + settle time) is preserved by
        // construction. The initial velocity `v0` is a physical fact and is NOT
        // scaled. At s = 1 (the default / no active query) `scaledTarget ===
        // targetValue` — the constant path is byte-unchanged.
        const s = this.amplitudeScale;
        const scaledTarget =
            this.originValue + s * (this.targetValue - this.originValue);
        const x0 = this.originValue - scaledTarget;
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

        // The spring settles to the SCALED target (the reduced-amplitude rest),
        // not the full target — that is the WCAG amplitude reduction: the travel
        // is shortened, the meaning (settle + envelope) is kept.
        this.currentValue = scaledTarget + xRel;
        this.currentVelocity = vRel;
    }

    private checkSettled(): void {
        // Settle against the SCALED target — under amplitude scaling the spring
        // rests at `origin + s·(target − origin)`, so converge there (at s = 1
        // this is `targetValue`, unchanged).
        const s = this.amplitudeScale;
        const scaledTarget =
            this.originValue + s * (this.targetValue - this.originValue);
        const dx = Math.abs(this.currentValue - scaledTarget);
        const dv = Math.abs(this.currentVelocity);
        if (
            dx < this.options.settleThreshold &&
            dv < this.options.velocitySettleThreshold
        ) {
            // Rest at the scaled target (== targetValue at full amplitude).
            this.currentValue = scaledTarget;
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
        // K.W11 PHYS-E — re-resolve the amplitude scale for the leg this reset
        // begins (a reset with a non-zero velocity integrates immediately).
        this.amplitudeScale = reducedMotionScale(
            this.options.respectReducedMotion,
        );
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

/**
 * A two-sample window over a position stream — the last two `(value, time)`
 * the engine emitted before an interruption (K.W11 PHYS-B2). `time` is in
 * MILLISECONDS (the engine's `effectiveT` clock); `value` is the interpolated
 * scalar of the animated property at that time. The finite difference
 * `(curr.value − prev.value) / ((curr.time − prev.time) / 1000)` is the
 * measured velocity in units/SECOND — the one place a numerical derivative is
 * correct, because a keyframe stream carries NO analytic velocity.
 */
export interface VelocityProbe {
    /** The earlier sample `(value, time-ms)`. */
    prev: { value: number; time: number };
    /** The later sample `(value, time-ms)` — the interruption position. */
    curr: { value: number; time: number };
}

/**
 * Measure the instantaneous velocity (units/SECOND) of a position stream from
 * a two-sample {@link VelocityProbe} (K.W11 PHYS-B2). The forward difference
 * `(curr − prev) / dt` with `dt` in seconds. A zero / negative `dt` (two
 * samples at the same frame, or out-of-order) yields `0` — no division blow-up,
 * a stationary read.
 */
export function probeVelocity(probe: VelocityProbe): number {
    const dtMs = probe.curr.time - probe.prev.time;
    if (dtMs <= 0) return 0;
    return (probe.curr.value - probe.prev.value) / (dtMs / 1000);
}

/**
 * Velocity-continuous interruption of a parsed-CSS (or any positional)
 * animation, re-served as a spring (K.W11 PHYS-B2 — the only-kf seam).
 *
 * At interruption the engine path carries a POSITION (`effectiveT` → the
 * interpolated value) but NO velocity — a keyframe stream has no analytic
 * derivative. This finite-differences the interp stream over the last frame
 * (the {@link VelocityProbe}: the two most recent `(value, time)` samples), then
 * seeds a fresh {@link SpringProgress} at the CURRENT position
 * (`probe.curr.value`) with that MEASURED velocity, targeting `newTarget`. The
 * first post-interruption frames therefore continue the prior direction and
 * speed within ε — no visible kink — instead of restarting from rest.
 *
 * The spring's `linear()` twin (`springTimingFunction` / `springLinearStops`)
 * is the SAME kf-internal emitter the compiler consumes, so the reseated
 * transition is round-trippable: the velocity-continuous interruption composes
 * INTO the round-trip rather than forfeiting it.
 *
 * Pure construction — no DOM, no rAF until the returned spring is `.play()`ed
 * or `tickDt`-driven. value.js-free (LIGHT): it composes only `SpringProgress`
 * and the leaf finite difference.
 *
 * @param probe     The two most recent `(value, time-ms)` samples of the
 *                  interrupted stream (`prev` then `curr`, the interruption
 *                  position).
 * @param newTarget The value the spring transitions toward.
 * @param options   Spring config (`response` / `dampingFraction` / thresholds /
 *                  `respectReducedMotion`); `initial` and `initialVelocity` are
 *                  IGNORED — they are seeded from the probe.
 * @returns A `SpringProgress` seeded at `(probe.curr.value, measured velocity)`,
 *          targeting `newTarget`.
 */
export function reseatToSpring(
    probe: VelocityProbe,
    newTarget: number,
    options?: Partial<
        Omit<SpringProgressOptions, "initial" | "initialVelocity">
    >,
): SpringProgress {
    const velocity = probeVelocity(probe);
    const spring = new SpringProgress({
        ...options,
        initial: probe.curr.value,
        initialVelocity: velocity,
    });
    // Re-seat onto the new target from the measured `(x, v)` — the closed-form
    // solution is continuous (origin = current position, origin velocity =
    // the measured velocity), so the trajectory leaves at the prior speed.
    spring.target = newTarget;
    return spring;
}
