import {
    reducedMotionScale,
    withReducedMotion,
} from "../../internal/reduced-motion";
import { RAFPlayback } from "../playback";
// The spring family's shared option/subscriber types + the canonical
// DEFAULT_SPRING_RESPONSE live in `./types` (the ring-break, R.W1) — read from
// there rather than re-declared here, so duration.ts/reseat.ts no longer import
// back through the class module. The barrel re-exports these from `./types`
// directly; this module only consumes them.
import { defaultSpringOptions } from "./types";
import type {
    SpringProgressOptions,
    SpringSubscriber,
    SpringFrameCallback,
} from "./types";
// S.B5 — the MANAGED-PLAYBACK loop (`.play()`/`.stop()` rAF ownership) is a set
// of FREE FUNCTIONS in the colocated `./managed-play` module, driving this
// stepper through the `SpringPlayback` structural contract (declared in `./types`
// so this edge stays one-directional — no import cycle). `.play`/`.stop` below
// are thin delegates; `set target`'s auto-resume reaches `springStartLoop`.
import { springPlay, springStartLoop, springStop } from "./managed-play";
// The spring-from-duration surface (`{ visualDuration | duration, bounce }`) and
// its `(response, dampingFraction)` translation live in the colocated
// `./duration` module (the barrel re-exports the surface from there).
import {
    durationToSpringOptions,
    type SpringDurationOptions,
} from "./solver/duration";
// The SoA multi-channel lane subsystem (L.W7 §S2 vector sugar) lives in the
// colocated `./vector` module (R.W2b carve); `SpringProgress` holds at most one
// `SpringVectorLanes` (lazily armed on the first `setTargets`) and delegates its
// `setTargets`/`tickVector`/`values`/`velocities` surface to it — the scalar hot
// path never touches a lane buffer.
import type { SpringVectorLanes } from "./solver/vector";
import {
    armVectorLanes,
    tickVectorLanes,
    vectorValues,
    vectorVelocities,
} from "./vector-surface";
// The shared closed-form analytic kernel (R.W2c §spring `solver.ts`, the dep-free
// leaf) — the scalar `evaluateAt` consumes it; the vector lanes inline it hoisted.
// Read the closed-form kernel directly. Importing the solver barrel here would
// route back through `sample.ts`/`reseat.ts`, both of which construct a
// SpringProgress, recreating a runtime cycle in the spring family.
import { solveDampedHarmonic } from "./solver/solver";

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

    /** The reduced-motion policy — read by `./managed-play`'s `springPlay` to
     * route the snap vs. run branch. */
    get respectReducedMotion() {
        return this.options.respectReducedMotion;
    }

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
    /** @internal (S.B5) — read by `./managed-play`'s `springPlay` (a disposed
     * spring never plays); the {@link SpringPlayback} contract. */
    disposed: boolean = false;

    // ── Vector lanes (L.W7 §S2, W122 — ADOPT @ 2.97–3.78× over K scalars) ────
    // The `setTargets(Float64Array)` multi-channel overload steps K channels
    // under THIS spring's (omega, zeta, omegaD) into one shared `Float64Array`
    // per tick — instead of K independent scalar `SpringProgress` instances. The
    // SoA lane buffers + the per-channel analytic solver live in the colocated
    // `SpringVectorLanes` (R.W2b carve); this field is `null` until the first
    // `setTargets` arms it, so a scalar-only spring never allocates and the
    // scalar hot path is byte-unchanged. The lanes ring identically to a scalar
    // spring of the same config — the per-channel step is the SAME closed form
    // `evaluateAt` uses.
    private vectorLanes: SpringVectorLanes | null = null;

    // Managed playback for `.play()` / `.stop()` — loop ownership delegates to
    // the shared RAFPlayback driver (this class is a pure stepper: it implements
    // `Tickable` via `tickDt`/`settled`). The loop-arming BODIES live in the
    // colocated `./managed-play` (S.B5); these two fields are the run-state those
    // free functions read/write through the {@link SpringPlayback} contract.
    // INTERNAL (@internal, S.B5). Symmetric with `SmoothProgress.play(onFrame)`.
    readonly _playback = new RAFPlayback();
    /** @internal (S.B5) — the bound per-frame callback (`play` sets, `stop` clears). */
    _onFrame: SpringFrameCallback | undefined = undefined;

    /** @internal — ManagedStepper callback projection. */
    _emitManagedFrame(): void {
        this._onFrame?.(this.value, this.velocity);
    }

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
            // No-op if target unchanged and velocity zero — keep solver state.
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
                if (this._onFrame) springStartLoop(this);
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

        // The closed-form analytic step (the underdamped / critical / overdamped
        // case split) lives in the shared `./sample` kernel — the SAME math the
        // vector SoA lane loop inlines, so the two forms ring identically.
        const { x: xRel, v: vRel } = solveDampedHarmonic(
            x0,
            v0,
            this.omega,
            this.zeta,
            this.omegaD,
            t,
        );

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

    // ── Vector facet (implementation lives in ./vector-surface) ─────────────
    setTargets(targets: Float64Array): void {
        this.vectorLanes = armVectorLanes(this.vectorLanes, targets);
    }

    /**
     * The shared output lane buffer — the K channels' current values, written
     * in place by {@link tickVector}. A STABLE reference (never re-allocated
     * after the first {@link setTargets}); read it after each tick. Returns an
     * empty `Float64Array` before the first `setTargets` arms the lanes.
     */
    get values(): Float64Array {
        return vectorValues(this.vectorLanes);
    }

    /**
     * The shared output velocity lane buffer — the K channels' current
     * velocities, written in place by {@link tickVector}. A STABLE reference;
     * empty before the first {@link setTargets}.
     */
    get velocities(): Float64Array {
        return vectorVelocities(this.vectorLanes);
    }

    /**
     * Advance EVERY lane by `dt` MILLISECONDS — one call, K channels, one buffer
     * write, delegated to the SoA {@link SpringVectorLanes} under this spring's
     * `(omega, zeta, omegaD)`. The analytic per-channel step is the same closed
     * form `evaluateAt` uses, with the transcendentals (`exp`/`cos`/`sin`)
     * hoisted once per tick — the amortization the W122 probe measured. No-op
     * (returns the same buffer) before the first {@link setTargets}, when
     * disposed, or for `dt <= 0`.
     */
    tickVector(dt: number): Float64Array {
        if (this.disposed || this.vectorLanes === null || dt <= 0) {
            return this.values;
        }
        return tickVectorLanes(
            this.vectorLanes,
            dt,
            this.omega,
            this.zeta,
            this.omegaD,
        );
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

    // ── Managed playback (bodies in `./managed-play`, S.B5) ──────────────────

    /**
     * Start a managed rAF loop that calls `tickDt(dt)` each frame until
     * `settled`, invoking `onFrame(value, velocity)` per tick. Idempotent;
     * PRM-aware (snaps under an active reduced-motion query). Body in
     * `./managed-play` (S.B5).
     */
    play(onFrame?: SpringFrameCallback): void {
        springPlay(this, onFrame);
    }

    /** Cancel the managed rAF loop and detach the per-frame callback. Body in
     * `./managed-play` (S.B5). */
    stop(): void {
        springStop(this);
    }
}
