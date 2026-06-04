import { describe, expect, it, vi } from "vitest";
import { SpringProgress } from "../src/animation/spring";

/** 60fps frame step in milliseconds — the canonical `tickDt` unit. */
const FRAME_MS = 1000 / 60;

/** Run the spring's analytic solver in 60fps steps until settled or max ticks. */
function runUntilSettled(
    spring: SpringProgress,
    maxTicks = 6000,
    dt = FRAME_MS,
): { ticks: number; peak: number; trough: number } {
    let peak = -Infinity;
    let trough = Infinity;
    let i = 0;
    for (; i < maxTicks; i++) {
        spring.tickDt(dt);
        if (spring.value > peak) peak = spring.value;
        if (spring.value < trough) trough = spring.value;
        if (spring.settled) break;
    }
    return { ticks: i, peak, trough };
}

describe("SpringProgress", () => {
    describe("construction + reads", () => {
        it("starts at initial position with zero velocity, settled", () => {
            const sp = new SpringProgress();
            expect(sp.value).toBe(0);
            expect(sp.velocity).toBe(0);
            expect(sp.target).toBe(0);
            expect(sp.settled).toBe(true);
            sp.dispose();
        });

        it("respects custom initial position", () => {
            const sp = new SpringProgress({ initial: 0.5 });
            expect(sp.value).toBe(0.5);
            expect(sp.target).toBe(0.5);
            expect(sp.settled).toBe(true);
            sp.dispose();
        });
    });

    describe("target setter", () => {
        it("becomes unsettled when target changes", () => {
            const sp = new SpringProgress();
            sp.target = 1;
            expect(sp.target).toBe(1);
            expect(sp.settled).toBe(false);
            sp.dispose();
        });

        it("setting same target on a zero-velocity settled spring is a no-op", () => {
            const sp = new SpringProgress();
            sp.target = 0;
            expect(sp.settled).toBe(true);
            sp.dispose();
        });
    });

    describe("underdamped (ζ < 1)", () => {
        it("overshoots target then settles", () => {
            const sp = new SpringProgress({
                response: 0.3,
                dampingFraction: 0.4,
            });
            sp.target = 1;
            const { peak } = runUntilSettled(sp);
            // ζ=0.4 overshoots by ~25% — should reach > 1.
            expect(peak).toBeGreaterThan(1.05);
            expect(sp.settled).toBe(true);
            expect(sp.value).toBeCloseTo(1, 3);
            expect(sp.velocity).toBeCloseTo(0, 3);
            sp.dispose();
        });

        it("default options (ζ=0.86) barely overshoots", () => {
            const sp = new SpringProgress();
            sp.target = 1;
            const { peak } = runUntilSettled(sp);
            // ζ=0.86 → overshoot ~0.5%. Strictly tiny, may even be ≤ 1
            // within numeric tolerance — bound is loose.
            expect(peak).toBeLessThan(1.1);
            expect(sp.settled).toBe(true);
            sp.dispose();
        });
    });

    describe("critically damped (ζ = 1)", () => {
        it("does not overshoot target", () => {
            const sp = new SpringProgress({
                response: 0.3,
                dampingFraction: 1,
            });
            sp.target = 1;
            const { peak } = runUntilSettled(sp);
            // Allow a tiny numeric epsilon (analytic floor).
            expect(peak).toBeLessThanOrEqual(1 + 1e-6);
            expect(sp.settled).toBe(true);
            expect(sp.value).toBeCloseTo(1, 3);
            sp.dispose();
        });
    });

    describe("overdamped (ζ > 1)", () => {
        it("monotone approach, no overshoot, settles", () => {
            const sp = new SpringProgress({
                response: 0.3,
                dampingFraction: 1.8,
            });
            sp.target = 1;
            let last = sp.value;
            for (let i = 0; i < 10000; i++) {
                sp.tickDt(FRAME_MS);
                // Monotone non-decreasing approach.
                expect(sp.value).toBeGreaterThanOrEqual(last - 1e-9);
                last = sp.value;
                if (sp.settled) break;
            }
            expect(sp.settled).toBe(true);
            expect(sp.value).toBeCloseTo(1, 3);
            sp.dispose();
        });
    });

    describe("live target change", () => {
        it("integrates from current state — no jump", () => {
            const sp = new SpringProgress({
                response: 0.5,
                dampingFraction: 0.7,
            });
            sp.target = 1;
            // Step into the middle of the trajectory.
            for (let i = 0; i < 10; i++) sp.tickDt(FRAME_MS);
            const midValue = sp.value;
            const midVelocity = sp.velocity;
            expect(midValue).toBeGreaterThan(0);
            expect(midValue).toBeLessThan(1);

            // Re-target. Value + velocity should be continuous across
            // the re-seat — the immediate next read is unchanged.
            sp.target = 0.5;
            expect(sp.value).toBe(midValue);
            expect(sp.velocity).toBe(midVelocity);

            // Continued integration converges to the new target.
            runUntilSettled(sp);
            expect(sp.settled).toBe(true);
            expect(sp.value).toBeCloseTo(0.5, 3);
            sp.dispose();
        });
    });

    describe("tickToTime", () => {
        it("closed-form sample at absolute elapsed time matches incremental ticks", () => {
            const a = new SpringProgress({
                response: 0.4,
                dampingFraction: 0.6,
            });
            const b = new SpringProgress({
                response: 0.4,
                dampingFraction: 0.6,
            });
            a.target = 1;
            b.target = 1;

            // Incremental.
            for (let i = 0; i < 12; i++) a.tickDt(FRAME_MS);
            // Closed-form to same elapsed.
            b.tickToTime(12 / 60);

            expect(b.value).toBeCloseTo(a.value, 6);
            expect(b.velocity).toBeCloseTo(a.velocity, 6);
            a.dispose();
            b.dispose();
        });
    });

    describe("velocity tracking", () => {
        it("velocity is non-zero during flight, zero on settle", () => {
            const sp = new SpringProgress({
                response: 0.5,
                dampingFraction: 0.7,
            });
            sp.target = 1;
            sp.tickDt(FRAME_MS);
            expect(Math.abs(sp.velocity)).toBeGreaterThan(0);
            runUntilSettled(sp);
            expect(sp.velocity).toBe(0);
            sp.dispose();
        });
    });

    describe("subscribe / unsubscribe lifecycle", () => {
        it("subscribers receive (value, velocity) on every tick", () => {
            const sp = new SpringProgress({
                response: 0.3,
                dampingFraction: 0.7,
            });
            const fn = vi.fn();
            const unsub = sp.subscribe(fn);
            sp.target = 1;
            sp.tickDt(FRAME_MS);
            expect(fn).toHaveBeenCalled();
            const [v, vel] = fn.mock.calls[0]!;
            expect(typeof v).toBe("number");
            expect(typeof vel).toBe("number");
            unsub();
            sp.dispose();
        });

        it("unsubscribe stops further emissions", () => {
            const sp = new SpringProgress({
                response: 0.3,
                dampingFraction: 0.7,
            });
            const fn = vi.fn();
            const unsub = sp.subscribe(fn);
            sp.target = 1;
            sp.tickDt(FRAME_MS);
            const beforeUnsub = fn.mock.calls.length;
            unsub();
            sp.tickDt(FRAME_MS);
            expect(fn.mock.calls.length).toBe(beforeUnsub);
            sp.dispose();
        });

        it("multiple subscribers each receive emissions", () => {
            const sp = new SpringProgress({
                response: 0.3,
                dampingFraction: 0.7,
            });
            const a = vi.fn();
            const b = vi.fn();
            sp.subscribe(a);
            sp.subscribe(b);
            sp.target = 1;
            sp.tickDt(FRAME_MS);
            expect(a).toHaveBeenCalled();
            expect(b).toHaveBeenCalled();
            sp.dispose();
        });
    });

    describe("dispose cleanup", () => {
        it("dispose clears subscribers and halts further ticks", () => {
            const sp = new SpringProgress({
                response: 0.3,
                dampingFraction: 0.7,
            });
            const fn = vi.fn();
            sp.subscribe(fn);
            sp.target = 1;
            sp.dispose();
            sp.tickDt(FRAME_MS);
            // After dispose, tick is a no-op — no further emissions.
            expect(fn).not.toHaveBeenCalled();
        });
    });

    describe("snap and reset", () => {
        it("snap sets value=target, velocity=0, settled=true", () => {
            const sp = new SpringProgress({
                response: 0.3,
                dampingFraction: 0.5,
            });
            sp.target = 1;
            sp.tickDt(FRAME_MS);
            sp.tickDt(FRAME_MS);
            sp.snap();
            expect(sp.value).toBe(1);
            expect(sp.velocity).toBe(0);
            expect(sp.settled).toBe(true);
        });

        it("reset returns to specified value, target = value", () => {
            const sp = new SpringProgress();
            sp.target = 1;
            sp.tickDt(FRAME_MS);
            sp.reset(0.25);
            expect(sp.value).toBe(0.25);
            expect(sp.target).toBe(0.25);
            expect(sp.velocity).toBe(0);
            expect(sp.settled).toBe(true);
        });
    });
});
