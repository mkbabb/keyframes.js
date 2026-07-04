/**
 * J.W1 S5 — direct edge-case coverage for `decay.ts`, the closed-form
 * frictional glide (the one public module the J charter names "no test";
 * it had only transitive importers). Pins the closed form
 *
 *   x(t) = x0 + (v0/k)·(1 − e^(−k·t)),  v(t) = v0·e^(−k·t)
 *
 * at its edges: the seed state, the asymptotic rest, the never-overshoot
 * property, the zero-velocity glide, and the fail-explicit friction guard.
 */
import { describe, expect, it } from "vitest";
import { decay, decayRest } from "../../src/animation/physics/decay";

describe("decay() — the closed-form frictional glide", () => {
    it("t ≤ 0 yields the SEED state (x0, v0) exactly", () => {
        const sample = decay({ initial: 10, velocity: 200, friction: 4 });
        expect(sample(0)).toEqual({ value: 10, velocity: 200 });
        expect(sample(-1)).toEqual({ value: 10, velocity: 200 });
    });

    it("the glide asymptotes to x0 + v0/k and the velocity bleeds to 0", () => {
        const sample = decay({ initial: 10, velocity: 200, friction: 4 });
        const rest = 10 + 200 / 4; // 60
        const far = sample(100); // k·t = 400 — fully settled
        expect(far.value).toBeCloseTo(rest, 9);
        expect(far.velocity).toBeCloseTo(0, 9);
    });

    it("matches the closed form at a finite t (the curve, not just the endpoints)", () => {
        const sample = decay({ initial: 0, velocity: 100, friction: 5 });
        const t = 0.2;
        const e = Math.exp(-5 * t);
        expect(sample(t).value).toBeCloseTo((100 / 5) * (1 - e), 12);
        expect(sample(t).velocity).toBeCloseTo(100 * e, 12);
    });

    it("NEVER overshoots the rest point — the approach is monotone from below", () => {
        const sample = decay({ velocity: 300, friction: 6 });
        const rest = 300 / 6;
        let prev = -Infinity;
        for (const t of [0.01, 0.05, 0.1, 0.5, 1, 2, 5]) {
            const { value } = sample(t);
            expect(value).toBeGreaterThan(prev);
            expect(value).toBeLessThanOrEqual(rest);
            prev = value;
        }
    });

    it("a NEGATIVE velocity glides backward to a rest BELOW the start (sign symmetry)", () => {
        const sample = decay({ initial: 50, velocity: -100, friction: 5 });
        const rest = 50 - 100 / 5; // 30
        expect(sample(100).value).toBeCloseTo(rest, 9);
        expect(sample(0.1).value).toBeLessThan(50);
        expect(sample(0.1).value).toBeGreaterThan(rest);
    });

    it("velocity 0 → the glide never leaves the initial position", () => {
        const sample = decay({ initial: 42, velocity: 0, friction: 5 });
        expect(sample(1).value).toBe(42);
        expect(sample(1).velocity).toBe(0);
    });

    it("the sampler is PURE — resampling the same t is bit-identical", () => {
        const sample = decay({ velocity: 123, friction: 7 });
        expect(sample(0.37)).toEqual(sample(0.37));
    });

    it("friction ≤ 0 throws — fail-explicit, no infinite glide", () => {
        expect(() => decay({ velocity: 100, friction: 0 })).toThrow();
        expect(() => decay({ velocity: 100, friction: -1 })).toThrow();
    });
});

describe("decayRest() — the projected endpoint without running the loop", () => {
    it("returns x0 + v0/k (and matches the glide's asymptote)", () => {
        expect(decayRest({ initial: 10, velocity: 200, friction: 4 })).toBe(60);
        const sample = decay({ initial: 10, velocity: 200, friction: 4 });
        expect(sample(100).value).toBeCloseTo(
            decayRest({ initial: 10, velocity: 200, friction: 4 }),
            9,
        );
    });

    it("defaults: initial 0, friction 5", () => {
        expect(decayRest({ velocity: 100 })).toBe(20);
    });

    it("friction ≤ 0 throws — same fail-explicit guard as decay()", () => {
        expect(() => decayRest({ velocity: 100, friction: 0 })).toThrow();
    });
});
