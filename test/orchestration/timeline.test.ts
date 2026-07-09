import { describe, expect, it } from "vitest";
import {
    ManualTimeline,
    KeyframesScrollTimeline,
} from "../../src/animation/orchestration/timeline";
import { easeOutCubic } from "@mkbabb/value.js";
import { resolveEasing } from "../../src/animation/easing";
import { AnimationOptionError } from "../../src/animation/internal/errors";

describe("ManualTimeline", () => {
    it("returns set value immediately (no smoothing)", () => {
        const tl = new ManualTimeline();
        tl.set(0.5);
        expect(tl.tick()).toBe(0.5);
    });

    it("clamps to [0, 1]", () => {
        const tl = new ManualTimeline();
        tl.set(2);
        expect(tl.tick()).toBe(1);
        tl.set(-1);
        expect(tl.tick()).toBe(0);
    });

    it("applies easing", () => {
        const tl = new ManualTimeline({ easing: easeOutCubic });
        tl.set(0.5);
        const p = tl.tick();
        expect(p).toBeCloseTo(easeOutCubic(0.5), 10);
    });

    it("applies an easing resolved up front via resolveEasing", async () => {
        const easing = await resolveEasing("ease-out-cubic");
        const tl = new ManualTimeline({ easing });
        tl.set(0.5);
        const p = tl.tick();
        expect(p).toBeCloseTo(easeOutCubic(0.5), 10);
    });

    it("throws AnimationOptionError on a string easing name (fail-explicit)", () => {
        expect(
            () =>
                new ManualTimeline({
                    // @ts-expect-error — string names are rejected by the type AND at runtime
                    easing: "ease-out-cubic",
                }),
        ).toThrow(AnimationOptionError);
    });

    it("supports smoothing when explicitly enabled", () => {
        const tl = new ManualTimeline({
            smoothing: { damping: 0.5, snapThreshold: 0.01 },
        });
        tl.set(0.8);
        const p1 = tl.tick();
        // With smoothing, first tick should lag behind target
        expect(p1).toBeGreaterThan(0);
        expect(p1).toBeLessThan(0.8);
    });

    it("reset() returns to 0", () => {
        const tl = new ManualTimeline();
        tl.set(0.8);
        tl.tick();
        tl.reset();
        expect(tl.progress).toBe(0);
    });

    it("settled is always true without smoothing", () => {
        const tl = new ManualTimeline();
        tl.set(0.5);
        tl.tick();
        expect(tl.settled).toBe(true);
    });
});

describe("ScrollTimeline", () => {
    const make = (
        scrollY: number,
        viewportHeight: number,
        opts?: { threshold?: number; smoothing?: false },
    ) =>
        new KeyframesScrollTimeline({
            getScrollY: () => scrollY,
            getViewportHeight: () => viewportHeight,
            smoothing: false,
            ...opts,
        });

    it("returns 0 at scroll=0", () => {
        const tl = make(0, 1000);
        expect(tl.tick()).toBe(0);
    });

    it("returns 1 at scroll=threshold", () => {
        // threshold=0.35, viewport=1000 → maxScroll=350
        const tl = make(350, 1000);
        expect(tl.tick()).toBe(1);
    });

    it("sample = scrollY / (viewportHeight * threshold)", () => {
        // scrollY=175, viewport=1000, threshold=0.35 → 175/350 = 0.5
        const tl = make(175, 1000);
        expect(tl.tick()).toBeCloseTo(0.5);
    });

    it("clamps beyond threshold", () => {
        const tl = make(700, 1000);
        expect(tl.tick()).toBe(1);
    });

    it("handles zero viewport height", () => {
        const tl = make(100, 0);
        expect(tl.tick()).toBe(0);
    });

    it("custom threshold", () => {
        // threshold=0.5, viewport=1000 → maxScroll=500
        const tl = make(250, 1000, { threshold: 0.5 });
        expect(tl.tick()).toBeCloseTo(0.5);
    });

    it("smoothing converges over ticks", () => {
        let scrollY = 175;
        const tl = new KeyframesScrollTimeline({
            getScrollY: () => scrollY,
            getViewportHeight: () => 1000,
            smoothing: { damping: 0.5, snapThreshold: 0.01 },
        });

        const p1 = tl.tick();
        expect(p1).toBeGreaterThan(0);
        expect(p1).toBeLessThan(0.5);

        // Converge
        for (let i = 0; i < 100; i++) tl.tick();
        expect(tl.progress).toBeCloseTo(0.5, 1);
    });

    it("boundary snap: raw>=1 -> immediate convergence", () => {
        const tl = new KeyframesScrollTimeline({
            getScrollY: () => 400,
            getViewportHeight: () => 1000,
            smoothing: { damping: 0.1 },
        });

        const p = tl.tick();
        expect(p).toBe(1);
    });

    it("boundary snap: raw<=0 -> immediate convergence", () => {
        let scrollY = 200;
        const tl = new KeyframesScrollTimeline({
            getScrollY: () => scrollY,
            getViewportHeight: () => 1000,
            smoothing: { damping: 0.1 },
        });

        // First move to some value
        tl.tick();
        for (let i = 0; i < 50; i++) tl.tick();

        // Now scroll back to 0
        scrollY = 0;
        const p = tl.tick();
        expect(p).toBe(0);
    });

    it("tickDt() works", () => {
        const tl = new KeyframesScrollTimeline({
            getScrollY: () => 175,
            getViewportHeight: () => 1000,
            smoothing: { damping: 0.5 },
        });

        const p1 = tl.tickDt(16.667);
        expect(p1).toBeGreaterThan(0);
        const p2 = tl.tickDt(16.667);
        expect(p2).toBeGreaterThan(p1);
    });
});

describe("Timeline easing + smoothing composition", () => {
    it("easing applied before smoothing", () => {
        let scrollY = 175;
        const eased05 = easeOutCubic(0.5);

        const tl = new KeyframesScrollTimeline({
            getScrollY: () => scrollY,
            getViewportHeight: () => 1000,
            easing: easeOutCubic,
            smoothing: { damping: 0.5, snapThreshold: 0.01 },
        });

        // First tick: smoother target should be easeOutCubic(0.5)
        // With damping=0.5 and starting from 0, first tick ≈ eased05 * 0.5
        const p1 = tl.tick();
        expect(p1).toBeGreaterThan(0);
        expect(p1).toBeLessThan(eased05);

        // Converge
        for (let i = 0; i < 100; i++) tl.tick();
        expect(tl.progress).toBeCloseTo(eased05, 1);
    });

    it("progress reflects smoothed eased value", () => {
        const tl = new KeyframesScrollTimeline({
            getScrollY: () => 175,
            getViewportHeight: () => 1000,
            easing: easeOutCubic,
            smoothing: false,
        });

        const p = tl.tick();
        expect(p).toBeCloseTo(easeOutCubic(0.5), 10);
        expect(tl.progress).toBe(p);
    });
});
