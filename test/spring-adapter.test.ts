import { describe, expect, it } from "vitest";
import { SpringProgress } from "../src/animation/physics/spring";

/** 60fps frame step in milliseconds. */
const FRAME_MS = 1000 / 60;

/**
 * Sample a spring's full trajectory under identical stepping — the ground
 * truth for "trajectory-identical". Returns the per-frame `(value,
 * velocity)` pairs.
 */
function sampleTrajectory(
    spring: SpringProgress,
    target: number,
    frames = 120,
): Array<[number, number]> {
    spring.target = target;
    const out: Array<[number, number]> = [];
    for (let i = 0; i < frames; i++) {
        spring.tickDt(FRAME_MS);
        out.push([spring.value, spring.velocity]);
    }
    return out;
}

describe("SpringProgress.fromDuration — time-based adapter", () => {
    it("is trajectory-identical to (response, dampingFraction) with the documented mapping", () => {
        const visualDuration = 0.4;
        const bounce = 0.2;

        const adapter = SpringProgress.fromDuration({ visualDuration, bounce });
        const canonical = new SpringProgress({
            response: visualDuration,
            dampingFraction: 1 - bounce,
        });

        const a = sampleTrajectory(adapter, 1);
        const c = sampleTrajectory(canonical, 1);

        expect(a.length).toBe(c.length);
        for (let i = 0; i < a.length; i++) {
            // Exact equality: the adapter is a pure parameter translation —
            // same solver, same omega/zeta, same stepping.
            expect(a[i]![0]).toBe(c[i]![0]);
            expect(a[i]![1]).toBe(c[i]![1]);
        }
        adapter.dispose();
        canonical.dispose();
    });

    it("BITE: perturbing the mapping (dampingFraction = bounce) diverges", () => {
        const visualDuration = 0.4;
        const bounce = 0.2;

        const adapter = SpringProgress.fromDuration({ visualDuration, bounce });
        // The WRONG mapping — dampingFraction = b instead of 1 − b.
        const wrong = new SpringProgress({
            response: visualDuration,
            dampingFraction: bounce,
        });

        const a = sampleTrajectory(adapter, 1);
        const w = sampleTrajectory(wrong, 1);

        const identical = a.every(
            (p, i) => p[0] === w[i]![0] && p[1] === w[i]![1],
        );
        expect(identical).toBe(false);
        adapter.dispose();
        wrong.dispose();
    });

    it("`duration` is an alias of `visualDuration`", () => {
        const d = 0.6;
        const b = 0.1;
        const viaDuration = SpringProgress.fromDuration({ duration: d, bounce: b });
        const viaVisual = SpringProgress.fromDuration({
            visualDuration: d,
            bounce: b,
        });

        const x = sampleTrajectory(viaDuration, 1);
        const y = sampleTrajectory(viaVisual, 1);
        for (let i = 0; i < x.length; i++) {
            expect(x[i]![0]).toBe(y[i]![0]);
        }
        viaDuration.dispose();
        viaVisual.dispose();
    });

    it("`visualDuration` wins when both keys are present", () => {
        const winner = SpringProgress.fromDuration({
            visualDuration: 0.3,
            duration: 0.9,
            bounce: 0,
        });
        const expected = new SpringProgress({
            response: 0.3,
            dampingFraction: 1,
        });
        const a = sampleTrajectory(winner, 1);
        const e = sampleTrajectory(expected, 1);
        for (let i = 0; i < a.length; i++) {
            expect(a[i]![0]).toBe(e[i]![0]);
        }
        winner.dispose();
        expected.dispose();
    });

    it("bounce 0 maps to critically damped (dampingFraction = 1, no overshoot)", () => {
        const sp = SpringProgress.fromDuration({ visualDuration: 0.3, bounce: 0 });
        sp.target = 1;
        let peak = -Infinity;
        for (let i = 0; i < 2000; i++) {
            sp.tickDt(FRAME_MS);
            if (sp.value > peak) peak = sp.value;
            if (sp.settled) break;
        }
        // dampingFraction = 1 → no overshoot (allow analytic epsilon).
        expect(peak).toBeLessThanOrEqual(1 + 1e-6);
        expect(sp.settled).toBe(true);
        sp.dispose();
    });

    it("positive bounce rings (underdamped overshoot)", () => {
        const sp = SpringProgress.fromDuration({
            visualDuration: 0.3,
            bounce: 0.6,
        });
        sp.target = 1;
        let peak = -Infinity;
        for (let i = 0; i < 2000; i++) {
            sp.tickDt(FRAME_MS);
            if (sp.value > peak) peak = sp.value;
            if (sp.settled) break;
        }
        // dampingFraction = 0.4 → real overshoot.
        expect(peak).toBeGreaterThan(1.05);
        sp.dispose();
    });

    it("bounce is clamped to [−1, 1] (dampingFraction stays in [0, 2])", () => {
        // bounce 2 clamps to 1 → dampingFraction 0 (undamped — never crosses
        // into NaN territory). Just assert it constructs and steps finitely.
        const sp = SpringProgress.fromDuration({
            visualDuration: 0.3,
            bounce: 5,
        });
        sp.target = 1;
        sp.tickDt(FRAME_MS);
        expect(Number.isFinite(sp.value)).toBe(true);

        // bounce −5 clamps to −1 → dampingFraction 2 (overdamped, monotone).
        const sp2 = SpringProgress.fromDuration({
            visualDuration: 0.3,
            bounce: -5,
        });
        sp2.target = 1;
        let last = sp2.value;
        for (let i = 0; i < 200; i++) {
            sp2.tickDt(FRAME_MS);
            expect(sp2.value).toBeGreaterThanOrEqual(last - 1e-9);
            last = sp2.value;
            if (sp2.settled) break;
        }
        sp.dispose();
        sp2.dispose();
    });

    it("passthrough keys (initial, initialVelocity) flow through unchanged", () => {
        const sp = SpringProgress.fromDuration({
            visualDuration: 0.4,
            bounce: 0.1,
            initial: 0.5,
        });
        expect(sp.value).toBe(0.5);
        sp.dispose();
    });

    it("defaults to response 0.5 when no duration key is given", () => {
        const adapter = SpringProgress.fromDuration({ bounce: 0 });
        const canonical = new SpringProgress({
            response: 0.5,
            dampingFraction: 1,
        });
        const a = sampleTrajectory(adapter, 1);
        const c = sampleTrajectory(canonical, 1);
        for (let i = 0; i < a.length; i++) {
            expect(a[i]![0]).toBe(c[i]![0]);
        }
        adapter.dispose();
        canonical.dispose();
    });
});
