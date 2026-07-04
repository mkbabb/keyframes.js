/**
 * spring-blend-weight.test.ts — K.W11 PHYSICS (the flagship-demo oracle).
 * proof:spring-blend-weight — the value-level twin to the source-grep gate.
 *
 * The physics ALGEBRA composed with kf's unique axes — the value proof for the
 * three frontier moves, each born-RED in the FRONTIER sense (the capability was
 * ABSENT on the pre-cure tree: the weight was a CONSTANT, the engine path
 * carried NO velocity, the PRM gate was a BOOLEAN):
 *
 *   (a) PHYS-C overshoot       — an under-damped crossfade spring drives the
 *       blend weight PAST its target and settles back (NOT a hard cut). Read on
 *       the engine's own blend write (the composited leaf value as `weight`
 *       springs), never decorative churn — the engine-write disambiguation rule.
 *   (b) PHYS-C velocity-carry  — re-targeting the crossfade mid-flight inherits
 *       the live velocity (the spring re-seats from (x, v)); the weight does not
 *       kink (no restart-from-rest discontinuity).
 *   (c) PHYS-B2                — reseatToSpring leaves the interruption position
 *       at the MEASURED velocity (the finite-diff seed), velocity-continuous
 *       within ε; a zero-velocity restart provably fails.
 *   (d) PHYS-E                 — at intensity s the spring's PEAK displacement is
 *       s × the full-intensity peak (analytic, assertable); the settle time /
 *       curve shape is preserved (the WCAG 2.3.3 amplitude scale, not a kill).
 *
 * The (a)/(b) crossfade asserts read the COMPOSITED leaf the `weighted` blend
 * writes — the engine's own blend-weight effect — over a real parsed-CSS pair.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ValueUnit } from "@mkbabb/value.js";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { AnimationGroup } from "../src/animation/group";
import { compositeFramesAt } from "./support/group-probe";
import {
    SpringProgress,
    reseatToSpring,
    probeVelocity,
} from "../src/animation/physics/spring";

/** Build a parsed `opacity` 0→1 animation pinned at its own clock `t`. */
const opacityAt = (t: number): CSSKeyframesAnimation<any> => {
    const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
        "from { opacity: 0; } to { opacity: 1; }",
    );
    a.name = `o${t}`;
    a.t = t;
    return a;
};

/** Read the scalar value of a single-element `ValueUnit[]` leaf. */
const scalar = (out: Record<string, any>, key: string): number => {
    const leaf = out[key];
    expect(Array.isArray(leaf)).toBe(true);
    expect(leaf[0]).toBeInstanceOf(ValueUnit);
    return leaf[0].value;
};

function mockReducedMotion(matches: boolean): void {
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        configurable: true,
        value: vi.fn((query: string) => ({
            matches: query.includes("prefers-reduced-motion") && matches,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
}

// ── PHYS-C (a) — a spring-driven crossfade OVERSHOOTS and settles ─────────────

describe("proof:spring-blend-weight (a) — PHYS-C: the blend weight follows the spring (overshoots, settles)", () => {
    it("an under-damped transitionLayer drives the composited weight PAST 1.0, then settles", () => {
        // base (zIndex 0) holds opacity 0 at every t; top (weighted, zIndex 1)
        // holds opacity 1 at every t. The group's draw loop advances BOTH
        // children's own clocks, so we make each child's contribution constant
        // across its clock (a flat 0→0 and 1→1 keyframe) — then the composited
        // opacity = lerp(0, 1, w) = w reads back the LIVE blend weight directly
        // (the engine's own blend write), regardless of the child clock. Spring
        // the weight 0 → 1 with a ringing (under-damped) spring: it must blend
        // PAST 1.0 (overshoot) before settling — a constant-weight HARD CUT
        // provably cannot produce a value above its target.
        const base = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { opacity: 0; } to { opacity: 0; }",
        );
        base.name = "base";
        const top = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { opacity: 1; } to { opacity: 1; }",
        );
        top.name = "top";

        const group = new AnimationGroup<any>(
            { animation: base, layer: { blendMode: "replace", zIndex: 0 } },
            {
                animation: top,
                layer: { blendMode: "weighted", zIndex: 1, weight: 0 },
            },
        );

        // Under-damped → rings → overshoots. Seed at the layer's current weight
        // (0), target 1.
        group.transitionLayer(top, {
            weight: 1,
            spring: { response: 0.3, dampingFraction: 0.4 },
        });

        // Drive the group's managed clock by hand: advance a sequence of frames
        // (16ms each) and read the composited opacity = the live blend weight.
        let peak = -Infinity;
        let last = 0;
        // First advance establishes lastTickTime (dt clamped to 0); subsequent
        // frames integrate the spring.
        for (let i = 1; i <= 120; i++) {
            group.advanceTo(i * 16);
            const out = compositeFramesAt(group, i * 16);
            const w = scalar(out, "opacity");
            peak = Math.max(peak, w);
            last = w;
        }

        // OVERSHOOT — the ringing spring blended the weight past the 1.0 target
        // (a hard cut never exceeds the target). This is the canonical iOS
        // "snap into place" for a whole animation layer.
        expect(peak).toBeGreaterThan(1.0);
        // SETTLE — by the end the spring has converged back to the target.
        expect(last).toBeCloseTo(1.0, 2);
    });

    it("born-RED witness: a CONSTANT-weight layer is a hard cut (never overshoots)", () => {
        // The pre-cure behavior: a static weight blends at the constant every
        // frame — it can NEVER exceed the target. This documents the property
        // the overshoot assert above relies on (a constant weight ≤ target).
        const base = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { opacity: 0; } to { opacity: 0; }",
        );
        base.name = "cbase";
        const top = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { opacity: 1; } to { opacity: 1; }",
        );
        top.name = "ctop";
        const group = new AnimationGroup<any>(
            { animation: base, layer: { blendMode: "replace", zIndex: 0 } },
            {
                animation: top,
                layer: { blendMode: "weighted", zIndex: 1, weight: 1 },
            },
        );
        let peak = -Infinity;
        for (let i = 1; i <= 30; i++) {
            group.advanceTo(i * 16);
            const out = compositeFramesAt(group, i * 16);
            peak = Math.max(peak, scalar(out, "opacity"));
        }
        // A constant weight=1 never exceeds the 1.0 target — no overshoot.
        expect(peak).toBeLessThanOrEqual(1.0 + 1e-9);
    });

    it("the spring-driven path is ZERO-ALLOC per frame (same composite buffer, even mid-crossfade)", () => {
        // The spring drive must not break the compositor's zero-alloc discipline
        // (proof:zero-alloc's buffer-identity instrument): `transformFramesGrouped`
        // returns the SAME `_grouped` buffer every frame, and `advanceLayerSprings`
        // reads `weightSpring.value` (a field) + steps `tickDt` (one analytic eval,
        // already zero-alloc) — no fresh object per frame WHILE a crossfade rings.
        const base = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { opacity: 0; } to { opacity: 0; }",
        );
        base.name = "zbase";
        const top = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { opacity: 1; } to { opacity: 1; }",
        );
        top.name = "ztop";
        const group = new AnimationGroup<any>(
            { animation: base, layer: { blendMode: "replace", zIndex: 0 } },
            {
                animation: top,
                layer: { blendMode: "weighted", zIndex: 1, weight: 0 },
            },
        );
        group.transitionLayer(top, {
            weight: 1,
            spring: { response: 0.3, dampingFraction: 0.4 },
        });
        // Advance mid-flight (the spring is still ringing, _hasLayerSprings true).
        group.advanceTo(16);
        const r1 = compositeFramesAt(group, 16);
        group.advanceTo(32);
        const r2 = compositeFramesAt(group, 32);
        group.advanceTo(48);
        const r3 = compositeFramesAt(group, 48);
        // Same buffer every frame → no per-frame composite allocation while the
        // spring drives the weight.
        expect(r1).toBe(r2);
        expect(r2).toBe(r3);
    });
});

// ── PHYS-C (b) — the crossfade carries VELOCITY on re-target (no kink) ────────

describe("proof:spring-blend-weight (b) — PHYS-C: a mid-flight re-target carries velocity (no kink)", () => {
    it("re-targeting the weight spring mid-flight re-seats from live (value, velocity)", () => {
        // Drive a weight spring 0 → 1, capture its in-flight velocity, then
        // re-target 1 → 0. The re-seat must inherit the live velocity (the
        // shipped `set target` → `reseatTarget`), so the trajectory is
        // continuous (the first frames after the re-target still carry the
        // prior momentum) — NOT a restart from rest.
        const top = opacityAt(1000);
        const group = new AnimationGroup<any>({
            animation: top,
            layer: { blendMode: "weighted", zIndex: 0, weight: 0 },
        });
        group.transitionLayer(top, {
            weight: 1,
            spring: { response: 0.3, dampingFraction: 0.9 },
        });

        // Advance a few frames to build up velocity.
        for (let i = 1; i <= 8; i++) group.advanceTo(i * 16);
        const layer = group.getLayerConfig(top)!;
        const springBefore = layer.weightSpring as SpringProgress;
        const vBefore = springBefore.velocity;
        expect(Math.abs(vBefore)).toBeGreaterThan(0); // moving

        // Re-target mid-flight. The SAME spring instance must re-seat (NOT a
        // fresh from-rest spring), preserving the live velocity.
        group.transitionLayer(top, {
            weight: 0,
            spring: { response: 0.3, dampingFraction: 0.9 },
        });
        const springAfter = group.getLayerConfig(top)!.weightSpring as
            | SpringProgress
            | undefined;
        // Same instance — re-seated, not replaced.
        expect(springAfter).toBe(springBefore);
        // The velocity is continuous across the re-target (no zeroing).
        expect(springAfter!.velocity).toBeCloseTo(vBefore, 6);
    });
});

// ── PHYS-B2 — reseatToSpring is velocity-continuous ──────────────────────────

describe("proof:spring-blend-weight (c) — PHYS-B2: reseatToSpring interrupts velocity-continuously", () => {
    it("probeVelocity finite-differences the stream (units/second)", () => {
        // Two samples 16ms apart, position 0 → 0.4 → velocity = 0.4 / 0.016 = 25.
        const v = probeVelocity({
            prev: { value: 0.0, time: 100 },
            curr: { value: 0.4, time: 116 },
        });
        expect(v).toBeCloseTo(0.4 / 0.016, 6);
    });

    it("a zero/negative dt probe reads stationary (no division blow-up)", () => {
        expect(
            probeVelocity({
                prev: { value: 0, time: 100 },
                curr: { value: 1, time: 100 },
            }),
        ).toBe(0);
    });

    it("the reseated spring LEAVES at the measured velocity (no kink), NOT from rest", () => {
        // A parsed-CSS interp stream moving at +25 units/s at position 0.4 is
        // interrupted and re-targeted to 1.0. The reseated spring must begin at
        // (0.4, +25) — the first step continues the prior direction/speed within
        // ε. A zero-velocity restart would begin at (0.4, 0) and fail.
        const probe = {
            prev: { value: 0.36, time: 100 },
            curr: { value: 0.4, time: 116 }, // +0.04 over 16ms → +2.5 units/s
        };
        const measured = probeVelocity(probe);
        const spring = reseatToSpring(probe, 1.0, {
            response: 0.5,
            dampingFraction: 0.86,
        });
        // Seeded at the interruption position with the measured velocity.
        expect(spring.value).toBeCloseTo(0.4, 6);
        expect(spring.velocity).toBeCloseTo(measured, 6);

        // The first post-interruption frame continues the prior direction/speed:
        // position advances ≈ measured × dt from 0.4, NOT held at rest.
        const before = spring.value;
        spring.tickDt(1); // 1ms step
        const dxOverDt = (spring.value - before) / 0.001; // units/s
        // The leave-velocity matches the measured velocity within ε.
        expect(dxOverDt).toBeCloseTo(measured, 1);

        // Born-RED contrast: a from-rest spring (velocity 0) leaves with ~0
        // initial slope — provably a kink against the moving stream.
        const fromRest = new SpringProgress({
            initial: 0.4,
            response: 0.5,
            dampingFraction: 0.86,
        });
        fromRest.target = 1.0;
        const rb = fromRest.value;
        fromRest.tickDt(1);
        const restSlope = (fromRest.value - rb) / 0.001;
        expect(Math.abs(restSlope)).toBeLessThan(Math.abs(dxOverDt) / 2);
    });
});

// ── PHYS-E — the spring scales AMPLITUDE, not the curve, under reduced motion ─

describe("proof:spring-blend-weight (d) — PHYS-E: intensity scales the spring AMPLITUDE (WCAG 2.3.3)", () => {
    beforeEach(() => mockReducedMotion(true));
    afterEach(() => mockReducedMotion(false));

    /** Sweep a spring to settle, returning its peak displacement-from-rest. */
    const peakDisplacement = (
        respectReducedMotion: boolean | number,
    ): { peak: number; settleSteps: number } => {
        // Under-damped so it overshoots — the peak is a meaningful amplitude.
        const spring = new SpringProgress({
            initial: 0,
            response: 0.4,
            dampingFraction: 0.5,
            respectReducedMotion,
        });
        spring.target = 100; // displacement-from-rest |0 − 100| = 100 at full
        let peak = 0;
        let settleSteps = 0;
        for (let i = 0; i < 2000 && !spring.settled; i++) {
            spring.tickDt(16);
            peak = Math.max(peak, spring.value);
            settleSteps = i + 1;
        }
        return { peak, settleSteps };
    };

    it("intensity 0.3 → peak displacement is 0.3 × the full-intensity peak", () => {
        // Resolve the TRUE full peak with reduced motion OFF, then the scaled
        // peak at intensity 0.3 under an active query.
        mockReducedMotion(false);
        const fullPeak = peakDisplacement(false).peak;
        mockReducedMotion(true);
        const scaledPeak = peakDisplacement(0.3).peak;

        expect(fullPeak).toBeGreaterThan(100); // overshoots past target
        // The scaled spring's peak (above its origin 0) is 0.3 × the full peak —
        // analytic, since the whole relative solution is scaled by 0.3 while the
        // envelope (curve shape + settle time) is preserved by construction.
        expect(scaledPeak).toBeCloseTo(fullPeak * 0.3, 4);
    });

    it("intensity 1.0 ≈ full motion; intensity 0 ≡ the binary snap (zero displacement)", () => {
        mockReducedMotion(false);
        const fullPeak = peakDisplacement(false).peak;
        mockReducedMotion(true);

        const oneScaled = peakDisplacement(1.0).peak;
        expect(oneScaled).toBeCloseTo(fullPeak, 4);

        // Intensity 0 under reduced motion ≡ the binary snap: the spring jumps to
        // target at zero velocity (no overshoot above the target value 100).
        const zeroSpring = new SpringProgress({
            initial: 0,
            response: 0.4,
            dampingFraction: 0.5,
            respectReducedMotion: 0,
        });
        zeroSpring.target = 100;
        // Snapped immediately — settled at target, never overshot.
        expect(zeroSpring.settled).toBe(true);
        expect(zeroSpring.value).toBe(100);
    });

    it("the envelope (curve SHAPE) is preserved — the scaled trajectory is an exact 0.3× copy of the full one at every sample", () => {
        // Sample BOTH trajectories at the SAME elapsed times. Amplitude scaling
        // scales the relative solution by `s` and leaves the envelope (decay +
        // frequency) untouched, so `scaled(t) === s × full(t)` at every t — the
        // strongest envelope-preserved statement (not just a settle-time count,
        // which an ABSOLUTE settle threshold shifts when the amplitude shrinks).
        const trajectory = (rrm: boolean | number): number[] => {
            const spring = new SpringProgress({
                initial: 0,
                response: 0.4,
                dampingFraction: 0.5,
                respectReducedMotion: rrm,
                // Drop the settle threshold so neither trajectory snaps early —
                // we compare the raw analytic curve over a fixed window.
                settleThreshold: 0,
                velocitySettleThreshold: 0,
            });
            spring.target = 100;
            const out: number[] = [];
            for (let i = 0; i < 60; i++) out.push(spring.tickDt(16));
            return out;
        };
        mockReducedMotion(false);
        const full = trajectory(false);
        mockReducedMotion(true);
        const scaled = trajectory(0.3);

        // The scaled curve is 0.3 × the full curve at EVERY sampled time — same
        // overshoot phase, same zero-crossings, same settle profile.
        for (let i = 0; i < full.length; i++) {
            expect(scaled[i]!).toBeCloseTo(full[i]! * 0.3, 6);
        }
    });

    it("intensity routes to `run` (animates), NOT the binary snap, under reduced motion", () => {
        // A positive intensity keeps animating (scaled) rather than snapping —
        // the spring is NOT settled after a target change (it integrates).
        const spring = new SpringProgress({
            initial: 0,
            response: 0.4,
            dampingFraction: 0.86,
            respectReducedMotion: 0.5,
        });
        spring.target = 100;
        expect(spring.settled).toBe(false); // animating, not snapped
        expect(spring.value).toBe(0); // hasn't moved until first tick
    });
});
