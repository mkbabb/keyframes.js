import { describe, expect, it } from "vitest";
import { SmoothProgress } from "../src/animation/smooth";

describe("SmoothProgress", () => {
    it("starts settled at initial value", () => {
        const sp = new SmoothProgress();
        expect(sp.current).toBe(0);
        expect(sp.target).toBe(0);
        expect(sp.settled).toBe(true);
    });

    it("starts at custom initial value", () => {
        const sp = new SmoothProgress({ initial: 0.5 });
        expect(sp.current).toBe(0.5);
        expect(sp.settled).toBe(true);
    });

    it("becomes unsettled when target changes", () => {
        const sp = new SmoothProgress();
        sp.setTarget(1);
        expect(sp.target).toBe(1);
        expect(sp.settled).toBe(false);
    });

    it("tick() moves current toward target", () => {
        const sp = new SmoothProgress({ damping: 0.5 });
        sp.setTarget(1);
        const v1 = sp.tick();
        expect(v1).toBeGreaterThan(0);
        expect(v1).toBeLessThan(1);
        const v2 = sp.tick();
        expect(v2).toBeGreaterThan(v1);
    });

    it("eventually settles at target", () => {
        const sp = new SmoothProgress({ damping: 0.5, snapThreshold: 0.01 });
        sp.setTarget(1);
        for (let i = 0; i < 100; i++) sp.tick();
        expect(sp.settled).toBe(true);
        expect(sp.current).toBe(1);
    });

    it("snap() immediately reaches target", () => {
        const sp = new SmoothProgress();
        sp.setTarget(0.75);
        sp.snap();
        expect(sp.current).toBe(0.75);
        expect(sp.settled).toBe(true);
    });

    it("reset() returns to specified value", () => {
        const sp = new SmoothProgress();
        sp.setTarget(1);
        sp.tick();
        sp.reset(0.3);
        expect(sp.current).toBe(0.3);
        expect(sp.target).toBe(0.3);
        expect(sp.settled).toBe(true);
    });

    it("clamps target to [0, 1] by default", () => {
        const sp = new SmoothProgress();
        sp.setTarget(2);
        expect(sp.target).toBe(1);
        sp.setTarget(-1);
        expect(sp.target).toBe(0);
    });

    it("clamp=false allows values outside [0, 1]", () => {
        const sp = new SmoothProgress({ clamp: false });
        sp.setTarget(2);
        expect(sp.target).toBe(2);
    });

    it("tickDt() converges with variable dt", () => {
        const sp = new SmoothProgress({ damping: 0.2 });
        sp.setTarget(1);
        const v1 = sp.tickDt(16.667);
        expect(v1).toBeGreaterThan(0);
        const v2 = sp.tickDt(16.667);
        expect(v2).toBeGreaterThan(v1);
    });

    it("tick() returns current when already settled", () => {
        const sp = new SmoothProgress({ initial: 0.5 });
        expect(sp.tick()).toBe(0.5);
    });
});
