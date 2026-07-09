import { describe, expect, it } from "vitest";
import { springTimingFunction } from "../../src/animation/physics/spring";
import { ElementMorph } from "../../src/animation/physics/morph";
import type { Easing } from "../../src/animation/constants";

describe("springTimingFunction", () => {
    it("anchors fn(0) = 0 and fn(1) = 1 exactly", () => {
        const { fn } = springTimingFunction({
            response: 0.5,
            dampingFraction: 0.86,
        });
        expect(fn(0)).toBe(0);
        expect(fn(1)).toBe(1);
    });

    it("clamps out-of-range input to the endpoints", () => {
        const { fn } = springTimingFunction({
            response: 0.5,
            dampingFraction: 0.86,
        });
        expect(fn(-0.5)).toBe(0);
        expect(fn(2)).toBe(1);
    });

    it("rises monotonically up to its peak", () => {
        const { fn } = springTimingFunction({
            response: 0.5,
            dampingFraction: 0.45,
            sampleCount: 200,
        });
        // Scan to the peak; everything before it must be non-decreasing.
        let peakT = 0;
        let peakV = -Infinity;
        for (let i = 0; i <= 200; i++) {
            const v = fn(i / 200);
            if (v > peakV) {
                peakV = v;
                peakT = i / 200;
            }
        }
        let prev = -Infinity;
        for (let i = 0; i <= 200; i++) {
            const t = (peakT * i) / 200;
            const v = fn(t);
            expect(v).toBeGreaterThanOrEqual(prev - 1e-9);
            prev = v;
        }
    });

    it("preserves the analytic overshoot for the bouncy 0.5/0.45 preset (≈ +20%)", () => {
        const response = 0.5;
        const dampingFraction = 0.45;
        const { fn } = springTimingFunction({
            response,
            dampingFraction,
            sampleCount: 256,
        });

        let sampledPeak = -Infinity;
        for (let i = 0; i <= 256; i++) {
            sampledPeak = Math.max(sampledPeak, fn(i / 256));
        }

        // Closed-form first-overshoot peak of the damped harmonic
        // oscillator (x0 = -1, v0 = 0): 1 + e^(-ζπ/√(1-ζ²)).
        const zeta = dampingFraction;
        const analyticPeak =
            1 + Math.exp((-zeta * Math.PI) / Math.sqrt(1 - zeta * zeta));

        expect(analyticPeak).toBeGreaterThan(1.2);
        expect(analyticPeak).toBeLessThan(1.21);
        expect(sampledPeak).toBeGreaterThan(1.18);
        expect(sampledPeak).toBeCloseTo(analyticPeak, 2);
    });

    it("does not overshoot for a critically damped preset (ζ = 1)", () => {
        const { fn } = springTimingFunction({
            response: 0.5,
            dampingFraction: 1,
            sampleCount: 200,
        });
        for (let i = 0; i <= 200; i++) {
            expect(fn(i / 200)).toBeLessThanOrEqual(1 + 1e-6);
        }
    });

    it("carries its CSS linear() twin on the typed Easing", () => {
        const easing = springTimingFunction({
            response: 0.5,
            dampingFraction: 0.5,
        });
        expect(easing.css).toMatch(/^linear\(/);
        // The pairing does not change the callable's numeric behavior.
        expect(easing.fn(0)).toBe(0);
        expect(easing.fn(1)).toBe(1);
    });

    it("is accepted by ElementMorph directly as a typed Easing", () => {
        const easing: Easing = springTimingFunction({
            response: 0.5,
            dampingFraction: 0.45,
        });
        const morph = new ElementMorph(
            { x: 0, y: 0, width: 100, height: 100 },
            { x: 200, y: 0, width: 100, height: 100 },
            { timingFunction: easing, duration: 600 },
        );
        // Mid-flight the spring overshoots, so translateX exceeds the
        // 200px destination delta before settling back to it.
        const peakish = morph.at(0.18).translateX;
        expect(peakish).toBeGreaterThan(200);
        expect(morph.at(1).translateX).toBeCloseTo(200, 5);
    });
});
