import { describe, expect, it } from "vitest";
// The SUBJECT (`useOrbitalInertia`) consumes `decay` from the PUBLISHED surface
// `@mkbabb/keyframes.js`. This gate consumed it from a deep `src/` path, so the
// envelope it asserted was not the artefact the subject runs (G-L7 rule (d) —
// derive every envelope assertion from the pinned artifact). Retired at
// X.KF.W4 `.d`: one surface, one artefact, one assertion.
import { decay } from "@mkbabb/keyframes.js";
import { afterEach, beforeEach, vi } from "vitest";
import { effectScope } from "vue";
import {
    COAST_GAIN,
    DEFAULT_INERTIA_FACTOR,
    TARGET_DT,
    coastRate,
    inertiaFactorToFriction,
} from "../../../demo/scenes/cube/orbital-drag/composables/inertiaDecay";
import { useOrbitalInertia } from "../../../demo/scenes/cube/orbital-drag/composables/useOrbitalInertia";
import {
    angularVelocityFromSamples,
    quatToAxisAngle,
    shoemakeArc,
    sphereMap,
    type AttitudeSample,
    type Vec3,
} from "../../../demo/scenes/cube/orbital-drag/arcball";

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

// The orbital-drag default friction-per-frame, RECALIBRATED at X.KF.W4 `.d`.
// The pin read 0.92 while the shipped default is 0.95 — `OrbitalDrag.vue`'s
// `const inertiaFactor = props.inertiaFactor ?? 0.95` with no consumer
// override — so every assertion below (the declaration and its EIGHT uses)
// proved parity for a coefficient the demo never runs. The constant is the
// single home the eight uses read, so the recalibration reaches all NINE
// coordinates at once.
// KF-M2 (§0hm D-15) — the shipped default is k = 9/s (e^(−9/60) per frame);
// the parity below holds for any knob, and is proved for the one the demo runs.
const INERTIA_FACTOR = DEFAULT_INERTIA_FACTOR;

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

// ── KF-M2 · G2.5 — the release coast (value.js COHESION §0hm D-15) ──────────
// Born RED: at the pre-cure bytes the default is 0.95 (k ≈ 3.1/s), there is no
// release gain, and a 120 px flick coasts ≈ 2× its own gesture.

describe("G2.5 — the coast is a short exhale, not a slot machine", () => {
    beforeEach(() => {
        vi.stubGlobal("requestAnimationFrame", () => 1);
        vi.stubGlobal("cancelAnimationFrame", () => {});
    });
    afterEach(() => vi.unstubAllGlobals());

    it("the shipped default is k = 9/s and the release gain is 0.5", () => {
        expect(inertiaFactorToFriction(DEFAULT_INERTIA_FACTOR)).toBeCloseTo(9, 12);
        expect(DEFAULT_INERTIA_FACTOR).toBeCloseTo(0.8607, 4);
        expect(COAST_GAIN).toBe(0.5);
    });

    /** A uniform 120 px flick over `ms`, sampled at 60 Hz on an arcball of
     *  R = 2h; returns its angle and its release ω. */
    const flick = (ms: number, h = 144) => {
        const R = 2 * h;
        const v0 = sphereMap(0, 0);
        const samples: AttitudeSample[] = [];
        let angle = 0;
        for (let t = 0; t <= ms + 1e-9; t += 1000 / 60) {
            const x = (120 * Math.min(t, ms)) / ms;
            const q = shoemakeArc(v0, sphereMap(x / R, 0));
            samples.push({ t, q });
            angle = quatToAxisAngle(q).angle;
        }
        return { angle, omega: angularVelocityFromSamples(samples, samples[samples.length - 1]!.t + 4) };
    };

    /** Run a coast frame-stepped at `hz`; returns its total angle and its
     *  duration (ms). */
    const coast = (omega: Vec3, hz: number, reduced = false) => {
        let total = 0;
        const scope = effectScope();
        const inertia = scope.run(() =>
            useOrbitalInertia({
                inertiaFactor: DEFAULT_INERTIA_FACTOR,
                rotateBy: (_axis, a) => void (total += a),
                reducedMotion: () => reduced,
            }),
        )!;
        inertia.start(omega, 0);
        let t = 0;
        let alive = inertia.advance(0);
        while (alive && t < 5000) {
            t += 1000 / hz;
            alive = inertia.advance(t);
        }
        scope.stop();
        return { total, ms: t };
    };

    it("a 120 px flick over 100 / 120 / 160 ms coasts 0.56 / 0.46 / 0.35 × the gesture", () => {
        for (const [ms, want] of [
            [100, 0.556],
            [120, 0.463],
            [160, 0.347],
        ] as const) {
            const f = flick(ms);
            const ratio = coast(f.omega, 60).total / f.angle;
            expect(ratio).toBeGreaterThanOrEqual(0.3);
            expect(ratio).toBeLessThanOrEqual(0.6);
            expect(Math.abs(ratio - want) / want).toBeLessThan(0.12);
        }
    });

    it("|ω| falls under 1% of ω₀ within 520 ms", () => {
        const f = flick(120);
        expect(coast(f.omega, 120).ms).toBeLessThanOrEqual(520);
    });

    it("30, 60 and 120 Hz coast the same angle within 1%", () => {
        const f = flick(120);
        const at60 = coast(f.omega, 60).total;
        for (const hz of [30, 120]) {
            expect(Math.abs(coast(f.omega, hz).total - at60) / at60).toBeLessThan(0.01);
        }
    });

    it("KFA-82 — a hold ≥ 64 ms before release coasts 0", () => {
        const q = shoemakeArc(sphereMap(0, 0), sphereMap(0.3, 0));
        const samples: AttitudeSample[] = [
            { t: 0, q: [0, 0, 0, 1] },
            { t: 16, q },
        ];
        expect(angularVelocityFromSamples(samples, 16 + 65)).toEqual([0, 0, 0]);
        expect(angularVelocityFromSamples(samples, 16 + 10)).not.toEqual([0, 0, 0]);
    });

    it("D-15 — a twist's ω is per unit time: 2 events or 8 read the same rate within 2%", () => {
        const twist = (events: number) => {
            const samples: AttitudeSample[] = [{ t: 0, q: [0, 0, 0, 1] }];
            for (let i = 1; i <= events; i++) {
                const a = ((30 * Math.PI) / 180) * (i / events);
                samples.push({ t: (64 * i) / events, q: [0, 0, Math.sin(a / 2), Math.cos(a / 2)] });
            }
            const w = angularVelocityFromSamples(samples, 66);
            return Math.hypot(...w);
        };
        expect(Math.abs(twist(2) - twist(8)) / twist(8)).toBeLessThan(0.02);
    });

    it("under reduced motion nothing coasts (ω₀ = 0)", () => {
        expect(coastRate(10, true)).toBe(0);
        const f = flick(120);
        expect(coast(f.omega, 60, true).total).toBe(0);
    });

    it("the coast's start is capped at one turn per second", () => {
        expect(coastRate(1000)).toBeCloseTo(2 * Math.PI, 12);
    });
});
