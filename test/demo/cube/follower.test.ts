import { describe, expect, it } from "vitest";
import {
    createFollower,
    criticalStep,
    followerNear,
    holdFollower,
    landFollower,
    moveTarget,
    rebaseFollower,
    stepFollower,
} from "../../../demo/scenes/cube/orbital-drag/follower";

/**
 * The orbit's one follower: every stepped input (a wheel stream, a notch, an
 * arrow key, a pinch, a twist) moves a target, and the shown value follows it
 * on the critically damped spring, by its exact step.
 */

/** Run a follower at `hz` for `ms`, the target moved by `input(t)` at frame t. */
const run = (omega: number, hz: number, ms: number, input: (t: number) => number) => {
    const f = createFollower(1, omega);
    const dt = 1 / hz;
    const xs: { t: number; x: number; v: number; T: number }[] = [];
    let tPrev = 0;
    for (let t = dt; t <= ms / 1000 + 1e-9; t += dt) {
        moveTarget(f, [input(t) - input(tPrev)]);
        stepFollower(f, dt);
        xs.push({ t, x: f.x[0]!, v: f.v[0]!, T: f.T[0]! });
        tPrev = t;
    }
    return xs;
};

describe("the orbit's follower", () => {
    it("from rest it never overshoots a step: x climbs to T monotonically", () => {
        const f = createFollower(1, 90);
        moveTarget(f, [1]);
        let prev = 0;
        for (let i = 0; i < 240; i++) {
            stepFollower(f, 1 / 120);
            expect(f.x[0]!).toBeLessThanOrEqual(1 + 1e-12);
            expect(f.x[0]!).toBeGreaterThanOrEqual(prev - 1e-12);
            prev = f.x[0]!;
        }
        expect(Math.abs(f.x[0]! - 1)).toBeLessThan(1e-9);
    });

    it("never overshoots when the target stops: a steady stream, then nothing", () => {
        // A target moving at 3 units/s for 400 ms, then still.
        const xs = run(90, 120, 1200, (t) => 3 * Math.min(t, 0.4));
        const end = 3 * 0.4;
        for (const s of xs) expect(s.x).toBeLessThanOrEqual(end + 1e-12);
        // Five notches 70 ms apart (a mouse wheel), at the notch stiffness.
        const notches = run(30, 120, 1500, (t) => Math.min(5, Math.floor(t / 0.07) + 1) * 0.7);
        for (let i = 1; i < notches.length; i++) {
            expect(notches[i]!.x).toBeLessThanOrEqual(5 * 0.7 + 1e-12);
            expect(notches[i]!.x).toBeGreaterThanOrEqual(notches[i - 1]!.x - 1e-12);
        }
    });

    it("lands exactly: once home it holds the target to the bit", () => {
        const f = createFollower(3, 90);
        moveTarget(f, [0.4, -0.2, 0.05]);
        let frames = 0;
        while (!followerNear(f, 1e-6, 1e-4) && frames < 1000) {
            stepFollower(f, 1 / 60);
            frames++;
        }
        expect(frames).toBeLessThan(60);
        landFollower(f);
        expect(f.x).toEqual(f.T);
        expect(f.v).toEqual([0, 0, 0]);
    });

    it("is frame-rate independent: one curve sampled at 60 and 120 Hz agrees within 1e-6", () => {
        for (const omega of [30, 90]) {
            const at60 = run(omega, 60, 600, (t) => (t > 0 ? 1 : 0));
            const at120 = run(omega, 120, 600, (t) => (t > 0 ? 1 : 0));
            for (const s of at60) {
                const twin = at120.find((u) => Math.abs(u.t - s.t) < 1e-9)!;
                expect(Math.abs(twin.x - s.x)).toBeLessThan(1e-6);
                expect(Math.abs(twin.v - s.v)).toBeLessThan(1e-6 * omega);
            }
        }
        // The step itself: two half steps are one whole step.
        const [x1, v1] = criticalStep(0.2, 3, 1, 90, 1 / 120);
        const [x2, v2] = criticalStep(x1, v1, 1, 90, 1 / 120);
        const [x, v] = criticalStep(0.2, 3, 1, 90, 1 / 60);
        expect(Math.abs(x2 - x)).toBeLessThan(1e-12);
        expect(Math.abs(v2 - v)).toBeLessThan(1e-9);
    });

    it("its speed is continuous when the target moves: a new step never kicks the frame it lands in", () => {
        const f = createFollower(1, 90);
        moveTarget(f, [1]);
        stepFollower(f, 1 / 120);
        const v0 = f.v[0]!;
        // A second step of the target: the speed after a vanishing dt is the
        // speed before it, and after a frame it has grown by at most ω²·Δe·dt.
        moveTarget(f, [1]);
        stepFollower(f, 1e-7);
        expect(Math.abs(f.v[0]! - v0)).toBeLessThan(1e-2);
        // From rest the first frame is soft: a 60 Hz frame takes under 45 %
        // of a step (an impulse would take all of it in one frame).
        const g = createFollower(1, 90);
        moveTarget(g, [1]);
        stepFollower(g, 1 / 60);
        expect(g.x[0]!).toBeLessThan(0.45);
        const h = createFollower(1, 30);
        moveTarget(h, [1]);
        stepFollower(h, 1 / 60);
        expect(h.x[0]!).toBeLessThan(0.1);
    });

    it("lags a steady stream by 2/ω (less half a frame: the stream lands as a step at each frame's start)", () => {
        const xs = run(90, 120, 500, (t) => 2 * t);
        const s = xs[xs.length - 1]!;
        expect(Math.abs((s.T - s.x) / 2 - 2 / 90 + 1 / 240)).toBeLessThan(1e-4);
    });

    it("hold stops it where it stands; rebase keeps what it shows", () => {
        const f = createFollower(2, 90);
        moveTarget(f, [1, 2]);
        stepFollower(f, 1 / 60);
        const x = [...f.x];
        holdFollower(f);
        expect(f.T).toEqual(x);
        expect(f.v).toEqual([0, 0]);
        stepFollower(f, 1 / 60);
        expect(f.x).toEqual(x);
        moveTarget(f, [0.5, 0]);
        rebaseFollower(f);
        expect(f.x).toEqual([0, 0]);
        expect(f.T[0]!).toBeCloseTo(0.5, 12);
    });
});
