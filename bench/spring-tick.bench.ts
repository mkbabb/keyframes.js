/**
 * spring-tick.bench.ts — `SpringProgress.tickDt` throughput (F.W1 S4b,
 * `a-test-quality §4`).
 *
 * The orchestration tier's hot stepper (`spring.ts:289` `tickDt`), shipped
 * E.W10 with ZERO throughput coverage — the highest-profile E public API with
 * no bench. `tickDt` delegates to the analytic `_stepSeconds` → `evaluateAt`,
 * whose three branches (underdamped ζ<1 / critically damped ζ=1 / overdamped
 * ζ>1) take genuinely different transcendental paths, so each is benched.
 *
 * A long settle window (a far target + tiny thresholds) keeps the spring
 * integrating across the whole frame loop rather than snapping settled early.
 * Imports `SpringProgress` from the VALUE module `spring`, never the barrel.
 */
import { bench, describe } from "vitest";
import { decayRest } from "../src/animation/physics/decay";
import { reseatToSpring, SpringProgress } from "../src/animation/physics/spring";

const FRAMES = 600;
const DT = 16.667; // a 60Hz step, the unit `tickDt` takes (milliseconds)

/**
 * A spring tuned to integrate for the whole window: a slow response + tiny
 * settle thresholds mean `checkSettled` never trips inside `FRAMES` steps, so
 * every `tickDt` exercises the analytic solver rather than the settled
 * fast-return.
 */
const makeSpring = (dampingFraction: number) =>
    new SpringProgress({
        response: 100,
        dampingFraction,
        settleThreshold: 1e-12,
        velocitySettleThreshold: 1e-12,
    });

describe("SpringProgress.tickDt throughput (analytic solver)", () => {
    const regimes: ReadonlyArray<readonly [string, number]> = [
        ["underdamped (ζ=0.5)", 0.5],
        ["critically damped (ζ=1)", 1],
        ["overdamped (ζ=1.5)", 1.5],
    ];

    for (const [label, zeta] of regimes) {
        bench(`${label} · ${FRAMES} tickDt steps`, () => {
            const spring = makeSpring(zeta);
            spring.target = 1000;
            for (let f = 0; f < FRAMES; f++) {
                spring.tickDt(DT);
            }
        });
    }

    // The live-target re-seat path: each `target` set re-seats the closed-form
    // solution from the current (x, v) state (`reseatTarget` → `evaluateAt`),
    // the gesture-follow / drag shape the spring exists for.
    bench(`live re-seat · ${FRAMES} target changes + ticks`, () => {
        const spring = makeSpring(0.86);
        for (let f = 0; f < FRAMES; f++) {
            spring.target = (f % 2) * 1000;
            spring.tickDt(DT);
        }
    });
});

/**
 * L.W7 §S2-constraint — the SpringProgress VECTOR-SUGAR ADOPT-or-KILL probe
 * (W122 second half). MEASURE-FIRST: a `setTargets(Float64Array)` multi-spring
 * overload would tick all K channels into one `Float64Array` per tick. A new
 * public surface was NOT free — the now-retired `proof:spring-vector` probe
 * ADOPTed the sugar ONLY if
 * this measurement shows the vector path beats K independent scalar
 * `SpringProgress` instances by >= 20% at K=8; otherwise it KILLs the sugar
 * (no unproven code ships).
 *
 * Both arms must do the SAME analytic work: K=8 channels under ONE shared
 * `(response, dampingFraction)` (the uniform-spring vector use case — a
 * translate3d/scale3d transform vector animated by one spring config), each
 * channel carrying its own `(origin, originVelocity, target)`. The arms
 * differ ONLY in the dispatch shape:
 *   - SCALAR: K=8 `SpringProgress` instances, K per-frame `tickDt` calls
 *     (K method dispatches + K field-read sets per frame);
 *   - VECTOR: one inline analytic stepper over `Float64Array` lanes — one
 *     per-frame call that loops K channels into a shared output buffer (no
 *     per-channel method dispatch, no per-instance object).
 *
 * The vector arm is a LOCAL prototype (the candidate `setTargets` body): if it
 * wins, the body lands on `SpringProgress`; if not, this stays the only place
 * the vector path ever existed. The math is the same underdamped closed form
 * `spring.ts:evaluateAt` uses, so the comparison is honest (equal FLOPs, the
 * delta is pure dispatch/alloc amortization).
 */
const K = 8;

/** A multi-channel analytic spring vector — the candidate `setTargets` body. */
class SpringVectorProbe {
    private readonly omega: number;
    private readonly zeta: number;
    private readonly omegaD: number;
    private readonly origin: Float64Array;
    private readonly originVel: Float64Array;
    private readonly target: Float64Array;
    /** Output lane the consumer reads — one shared buffer, never re-alloc'd. */
    readonly current: Float64Array;
    readonly velocity: Float64Array;
    private elapsed = 0;

    constructor(k: number, response: number, dampingFraction: number) {
        this.omega = (2 * Math.PI) / response;
        this.zeta = dampingFraction;
        this.omegaD =
            this.zeta < 1
                ? this.omega * Math.sqrt(1 - this.zeta * this.zeta)
                : 0;
        this.origin = new Float64Array(k);
        this.originVel = new Float64Array(k);
        this.target = new Float64Array(k);
        this.current = new Float64Array(k);
        this.velocity = new Float64Array(k);
    }

    /** Re-seat all lanes onto a new target vector from the current (x, v). */
    setTargets(targets: Float64Array): void {
        this.origin.set(this.current);
        this.originVel.set(this.velocity);
        this.target.set(targets);
        this.elapsed = 0;
    }

    /** Advance every lane by `dt` ms — one call, K channels, one buffer write. */
    tickDt(dt: number): void {
        this.elapsed += dt / 1000;
        const t = this.elapsed;
        const w = this.omega;
        const z = this.zeta;
        const wd = this.omegaD;
        const decay = Math.exp(-z * w * t); // hoisted: shared across lanes
        const cos = z < 1 ? Math.cos(wd * t) : 0;
        const sin = z < 1 ? Math.sin(wd * t) : 0;
        const dcrit = z === 1 ? Math.exp(-w * t) : 0;
        for (let i = 0; i < this.current.length; i++) {
            const x0 = this.origin[i]! - this.target[i]!;
            const v0 = this.originVel[i]!;
            let xRel: number;
            let vRel: number;
            if (z < 1) {
                const A = x0;
                const B = (v0 + z * w * x0) / wd;
                xRel = decay * (A * cos + B * sin);
                vRel =
                    decay *
                    ((B * wd - A * z * w) * cos -
                        (A * wd + B * z * w) * sin);
            } else if (z === 1) {
                const A = x0;
                const B = v0 + w * x0;
                xRel = dcrit * (A + B * t);
                vRel = dcrit * (B - w * (A + B * t));
            } else {
                const disc = w * Math.sqrt(z * z - 1);
                const r1 = -z * w + disc;
                const r2 = -z * w - disc;
                const A = (v0 - r2 * x0) / (r1 - r2);
                const B = x0 - A;
                const e1 = Math.exp(r1 * t);
                const e2 = Math.exp(r2 * t);
                xRel = A * e1 + B * e2;
                vRel = A * r1 * e1 + B * r2 * e2;
            }
            this.current[i] = this.target[i]! + xRel;
            this.velocity[i] = vRel;
        }
    }
}

describe("SpringProgress vector-sugar ADOPT-or-KILL probe (L.W7 §S2, W122)", () => {
    // A spring config that integrates the whole window (never snaps settled) —
    // the scalar arm uses the same `makeSpring` thresholds so neither arm gets
    // the settled fast-return. K=8 channels, each a distinct far target.
    const targets = new Float64Array(K);
    for (let i = 0; i < K; i++) targets[i] = 100 * (i + 1);

    // SCALAR baseline: K=8 independent SpringProgress instances. K method
    // dispatches per frame + K instance objects. The honest "K scalars" path.
    bench(`scalar · K=8 independent SpringProgress · ${FRAMES} tickDt`, () => {
        const springs: SpringProgress[] = [];
        for (let i = 0; i < K; i++) {
            const s = makeSpring(0.5);
            s.target = targets[i]!;
            springs.push(s);
        }
        for (let f = 0; f < FRAMES; f++) {
            for (let i = 0; i < K; i++) springs[i]!.tickDt(DT);
        }
    });

    // VECTOR candidate: one SpringVectorProbe over Float64Array lanes. One
    // per-frame call loops K channels into the shared output buffer — no
    // per-channel method dispatch, no per-instance object.
    bench(`vector · K=8 SpringVectorProbe (Float64Array) · ${FRAMES} tickDt`, () => {
        const probe = new SpringVectorProbe(K, 100, 0.5);
        probe.setTargets(targets);
        for (let f = 0; f < FRAMES; f++) {
            probe.tickDt(DT);
        }
    });
});

/**
 * S.F5a S4 (C-13, fold row 56) — the `reseatToSpring`-vs-`decayRest` bench.
 *
 * The drag/decay RELEASE seam (`orchestration/drag/draggable.ts:handleUp`) meets
 * two velocity-carrying motion models at a fling release, and C-13 forces the
 * choice to a MEASURED decision INSIDE S (a speculative LIGHT export, no carry):
 *
 *   - `reseatToSpring` (`physics/spring/reseat.ts`) — the velocity-CONTINUOUS
 *     spring re-seat. From a two-sample `VelocityProbe` it finite-differences the
 *     stream velocity, then CONSTRUCTS a fresh `SpringProgress` seeded at
 *     `(current position, measured velocity)` targeting the new value: a LIVE
 *     trajectory that settles TO A TARGET (an object per event).
 *   - `decayRest` (`physics/decay.ts`) — the O(1) targetless frictional-glide
 *     PROJECTION `x0 + v0/k`: a single divide-and-add read of where a release
 *     would coast to under friction, with NO target and NO settling object.
 *
 * These are NOT throughput substitutes — one builds a settling spring toward a
 * target, the other projects a free-coast endpoint. The bench makes the
 * per-event cost of each VISIBLE so the release-seam decision is grounded in
 * numbers, not intuition; the measured gap (the alloc-bearing re-seat vs the
 * O(1) projection) is itself the evidence they are distinct models. 600
 * interruptions / 600 releases mirror the 600-frame gesture windows above.
 *
 * DECISION (measured → recorded): RETAIN-both. The seam doc-comment in
 * `orchestration/drag/draggable.ts:handleUp` records why. Both are `run-check`
 * measurements (recorded in this file's header) — cost-visibility only, no
 * budget asserted (neither is on a per-frame hot path).
 */
const RELEASES = 600;

describe("reseatToSpring vs decayRest — release-seam motion models (S.F5a S4, C-13)", () => {
    // A deterministic pseudo-stream of release states so neither arm folds to a
    // constant — each event carries a distinct `(position, velocity, target)`
    // seed. Precomputed once (outside the timed body) into one flat buffer.
    const seeds = new Float64Array(RELEASES * 3);
    for (let i = 0; i < RELEASES; i++) {
        seeds[i * 3] = (i % 240) - 120; // position sweep
        seeds[i * 3 + 1] = ((i * 37) % 900) - 450; // release velocity (units/s)
        seeds[i * 3 + 2] = ((i * 53) % 480) - 240; // new target sweep
    }

    // reseatToSpring: each interruption finite-differences a two-sample probe
    // and CONSTRUCTS a fresh velocity-continuous `SpringProgress` toward a new
    // target — the live settle model. Reading `spring.value` sinks the result so
    // the alloc + seed cannot be dead-code-eliminated.
    bench(`reseatToSpring · ${RELEASES} interruptions`, () => {
        let sink = 0;
        for (let i = 0; i < RELEASES; i++) {
            const x = seeds[i * 3]!;
            const v = seeds[i * 3 + 1]!;
            const target = seeds[i * 3 + 2]!;
            // A one-frame (16.667ms) two-sample window whose forward difference
            // reconstructs velocity `v` — the honest interruption probe shape:
            // `(curr.value − prev.value) / (dt/1000) === v`.
            const prev = { value: x - (v * DT) / 1000, time: 0 };
            const curr = { value: x, time: DT };
            const spring = reseatToSpring({ prev, curr }, target, {
                response: 100,
                dampingFraction: 0.86,
            });
            sink += spring.value;
        }
        if (!Number.isFinite(sink)) throw new Error("unreachable");
    });

    // decayRest: each release projects the O(1) targetless coast endpoint —
    // one divide + one add, no object, no settle loop. Same seed stream, same
    // sink guard, so the delta against the arm above is pure model cost.
    bench(`decayRest · ${RELEASES} releases`, () => {
        let sink = 0;
        for (let i = 0; i < RELEASES; i++) {
            const initial = seeds[i * 3]!;
            const velocity = seeds[i * 3 + 1]!;
            sink += decayRest({ initial, velocity, friction: 5 });
        }
        if (!Number.isFinite(sink)) throw new Error("unreachable");
    });
});
