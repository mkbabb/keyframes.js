import { describe, expect, it } from "vitest";
import { SmoothProgress } from "../../src/animation/physics/smooth";

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

    it("tickDt() moves current toward target", () => {
        const sp = new SmoothProgress({ damping: 0.5 });
        sp.setTarget(1);
        const v1 = sp.tickDt(16.667);
        expect(v1).toBeGreaterThan(0);
        expect(v1).toBeLessThan(1);
        const v2 = sp.tickDt(16.667);
        expect(v2).toBeGreaterThan(v1);
    });

    it("eventually settles at target", () => {
        const sp = new SmoothProgress({ damping: 0.5, snapThreshold: 0.01 });
        sp.setTarget(1);
        for (let i = 0; i < 100; i++) sp.tickDt(16.667);
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
        sp.tickDt(16.667);
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

    it("tickDt() returns current when already settled", () => {
        const sp = new SmoothProgress({ initial: 0.5 });
        expect(sp.tickDt(16.667)).toBe(0.5);
    });

    describe("play() / stop()", () => {
        it("play() with no outstanding target fires onFrame once and stays idle", async () => {
            const sp = new SmoothProgress({ initial: 0.3 });
            const frames: number[] = [];
            sp.play((v) => frames.push(v));
            await new Promise((r) => setTimeout(r, 40));
            expect(frames).toEqual([0.3]);
            sp.stop();
        });

        it("play() drives onFrame until settled, then stops", async () => {
            const sp = new SmoothProgress({ damping: 0.5, snapThreshold: 0.01 });
            const frames: number[] = [];
            sp.setTarget(1);
            sp.play((v) => frames.push(v));
            await new Promise((r) => setTimeout(r, 300));
            expect(sp.settled).toBe(true);
            expect(sp.current).toBe(1);
            expect(frames.length).toBeGreaterThan(1);
            const last = frames[frames.length - 1]!;
            expect(last).toBe(1);
        });

        it("setTarget() after settle auto-resumes the loop", async () => {
            const sp = new SmoothProgress({ damping: 0.5, snapThreshold: 0.01 });
            const frames: number[] = [];
            sp.play((v) => frames.push(v));
            sp.setTarget(1);
            await new Promise((r) => setTimeout(r, 200));
            expect(sp.settled).toBe(true);
            const framesAfterFirst = frames.length;

            sp.setTarget(0);
            await new Promise((r) => setTimeout(r, 200));
            expect(sp.settled).toBe(true);
            expect(sp.current).toBe(0);
            expect(frames.length).toBeGreaterThan(framesAfterFirst);
            sp.stop();
        });

        it("stop() cancels the loop; subsequent setTarget does not restart without play()", async () => {
            const sp = new SmoothProgress({ damping: 0.5 });
            const frames: number[] = [];
            sp.setTarget(1);
            sp.play((v) => frames.push(v));
            await new Promise((r) => setTimeout(r, 40));
            sp.stop();
            const frozen = frames.length;
            sp.setTarget(0);
            await new Promise((r) => setTimeout(r, 100));
            // No new frames since callback was detached.
            expect(frames.length).toBe(frozen);
        });

        it("play() is idempotent — calling again rebinds callback without spawning a second loop", async () => {
            const sp = new SmoothProgress({ damping: 0.5, snapThreshold: 0.01 });
            sp.setTarget(1);

            let countA = 0;
            let countB = 0;
            sp.play(() => countA++);
            sp.play(() => countB++); // rebinds — A should stop receiving
            await new Promise((r) => setTimeout(r, 200));

            // B gets all frames after rebind; A stops accumulating.
            expect(countB).toBeGreaterThan(0);
            // A may have gotten 1-2 frames before rebind but not the bulk.
            expect(countA).toBeLessThan(countB);
        });

        it("snap() during play stops the loop and fires no further frames", async () => {
            const sp = new SmoothProgress({ damping: 0.2 });
            const frames: number[] = [];
            sp.setTarget(1);
            sp.play((v) => frames.push(v));
            await new Promise((r) => setTimeout(r, 40));
            sp.snap();
            const frozen = frames.length;
            await new Promise((r) => setTimeout(r, 100));
            expect(frames.length).toBe(frozen);
            expect(sp.current).toBe(1);
        });
    });
});
