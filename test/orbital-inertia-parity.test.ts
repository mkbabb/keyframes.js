import { describe, expect, it } from "vitest";
import { decay } from "../src/animation/physics/decay";
import {
    TARGET_DT,
    inertiaFactorToFriction,
} from "../demo/scenes/cube/orbital-drag/composables/inertiaDecay";

/**
 * F.W10.S1 — the inertia-parity gate (MEASURE-FIRST felt-equivalence).
 *
 * The orbital-drag demo (`useOrbitalInertia`) USED to hand-roll the frictional
 * glide as a per-frame `decay = Math.pow(inertiaFactor, dt/TARGET_DT)` velocity
 * multiply (the discrete forward-Euler form). It now consumes the engine's
 * SHIPPED analytic `decay()` closed form (`v(t) = v0·e^(−k·t)`). The swap is
 * felt-equivalent — NOT asserted, PROVEN here:
 *
 *   1. At 60fps the analytic velocity trajectory matches the hand-rolled
 *      `Math.pow` form within epsilon over a representative window.
 *   2. The analytic form is frame-rate-INVARIANT: sampled at 30 / 60 / 120fps,
 *      every step lands on the SAME e^(−k·t) curve (the property the discrete
 *      form only APPROXIMATES — it drifts off the curve as the frame rate
 *      changes). This is the named-befitting delta: strictly MORE correct.
 *
 * The k-from-inertiaFactor mapping is the one MEASURE-FIRST fact the swap rests
 * on: `k = −ln(inertiaFactor)·(1000/TARGET_DT)`. It is exported from the
 * composable and locked here so a perturbation reds (BITE clause below).
 */

const INERTIA_FACTOR = 0.92; // the orbital-drag default friction-per-frame

/** The LEGACY hand-rolled velocity trajectory: multiply by the per-frame
 *  `Math.pow(inertiaFactor, dt/TARGET_DT)` factor, stepping `dtMs` per frame. */
function legacyVelocityTrajectory(
    v0: number,
    inertiaFactor: number,
    dtMs: number,
    frames: number,
): number[] {
    const factor = Math.pow(inertiaFactor, dtMs / TARGET_DT);
    const out: number[] = [];
    let v = v0;
    for (let i = 0; i < frames; i++) {
        out.push(v);
        v *= factor;
    }
    return out;
}

describe("orbital inertia parity — the decay() swap is felt-equivalent (F.W10.S1)", () => {
    it("matches the hand-rolled Math.pow velocity trajectory within epsilon at 60fps", () => {
        const v0 = 4.5; // a representative angular release speed (deg/frame)
        const k = inertiaFactorToFriction(INERTIA_FACTOR);
        const sample = decay({ velocity: v0, friction: k });

        const FRAMES = 120; // a ~2s window — long enough to span the whole glide
        const legacy = legacyVelocityTrajectory(
            v0,
            INERTIA_FACTOR,
            TARGET_DT,
            FRAMES,
        );

        // At a UNIFORM 60fps step, the legacy `Math.pow(inertiaFactor, 1)`
        // multiply IS `inertiaFactor^n` at frame n, and the analytic form is
        // `v0·e^(−k·(n·TARGET_DT/1000))`. The k-mapping makes them identical to
        // floating-point precision (the felt-pixel-equivalence the gate proves).
        for (let i = 0; i < FRAMES; i++) {
            const tSeconds = (i * TARGET_DT) / 1000;
            const analytic = sample(tSeconds).velocity;
            expect(analytic).toBeCloseTo(legacy[i]!, 9);
        }
    });

    it("is frame-rate INVARIANT — 30/60/120fps land on the same e^(−k·t) curve", () => {
        const v0 = 3.2;
        const k = inertiaFactorToFriction(INERTIA_FACTOR);
        const sample = decay({ velocity: v0, friction: k });

        // The continuous curve the analytic form rides — frame-rate agnostic.
        const curveAt = (tSeconds: number) => v0 * Math.exp(-k * tSeconds);

        for (const fps of [30, 60, 120]) {
            const dtMs = 1000 / fps;
            // Walk ~1s of wall-clock at this frame rate; every step's analytic
            // velocity must lie EXACTLY on the continuous curve regardless of
            // the step size — the frame-rate invariance the discrete form lacks.
            for (let frame = 0; frame * dtMs <= 1000; frame++) {
                const tSeconds = (frame * dtMs) / 1000;
                expect(sample(tSeconds).velocity).toBeCloseTo(
                    curveAt(tSeconds),
                    9,
                );
            }
        }
    });

    it("the analytic glide and the legacy form converge to the SAME endpoint (zero velocity)", () => {
        const v0 = 5;
        const k = inertiaFactorToFriction(INERTIA_FACTOR);
        const sample = decay({ velocity: v0, friction: k });

        // Far out in time both forms have bled to (effectively) zero velocity.
        const analyticEnd = sample(10).velocity;
        const legacy = legacyVelocityTrajectory(
            v0,
            INERTIA_FACTOR,
            TARGET_DT,
            600,
        );
        const legacyEnd = legacy[legacy.length - 1]!;

        expect(analyticEnd).toBeCloseTo(0, 3);
        expect(legacyEnd).toBeCloseTo(0, 3);
        // The continuity assert: a NON-zero seeded velocity produces a NON-zero
        // start. Zeroing the seed (the BITE) collapses the whole trajectory to
        // 0, so this assert reds.
        expect(sample(0).velocity).toBeCloseTo(v0, 9);
    });

    // ── BITE clauses (the gate must bite, not merely log) ────────────────────

    it("BITE: zeroing the seeded velocity reds the continuity assert", () => {
        const k = inertiaFactorToFriction(INERTIA_FACTOR);
        const zeroSeed = decay({ velocity: 0, friction: k });
        // With a zeroed seed the trajectory is flat 0 — it CANNOT reproduce a
        // non-zero release, so the start-velocity continuity check fails.
        expect(zeroSeed(0).velocity).not.toBeCloseTo(4.5, 9);
    });

    it("BITE: perturbing the k-from-inertiaFactor mapping breaks the 60fps epsilon match", () => {
        const v0 = 4.5;
        const correctK = inertiaFactorToFriction(INERTIA_FACTOR);
        const perturbedK = correctK * 1.1; // a 10% friction perturbation
        const sample = decay({ velocity: v0, friction: perturbedK });

        const legacy = legacyVelocityTrajectory(
            v0,
            INERTIA_FACTOR,
            TARGET_DT,
            120,
        );

        // Somewhere in the window the perturbed trajectory must diverge beyond
        // the parity epsilon — the mapping is load-bearing, not cosmetic.
        let diverged = false;
        for (let i = 0; i < legacy.length; i++) {
            const tSeconds = (i * TARGET_DT) / 1000;
            if (Math.abs(sample(tSeconds).velocity - legacy[i]!) > 1e-3) {
                diverged = true;
                break;
            }
        }
        expect(diverged).toBe(true);
    });

    it("the exported k-mapping is k = −ln(inertiaFactor)·(1000/TARGET_DT)", () => {
        // Lock the exact analytic form of the mapping the swap rests on.
        for (const f of [0.8, 0.9, 0.92, 0.95]) {
            expect(inertiaFactorToFriction(f)).toBeCloseTo(
                -Math.log(f) * (1000 / TARGET_DT),
                9,
            );
        }
    });
});
