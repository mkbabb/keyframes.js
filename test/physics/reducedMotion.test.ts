import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SmoothProgress } from "../../src/animation/physics/smooth";
import { NumericAnimation } from "../../src/animation/physics/numeric";

/**
 * Reduced-motion option tests. Mocks `window.matchMedia` to simulate the
 * `prefers-reduced-motion: reduce` user preference and asserts that
 * `setTarget`/`play` short-circuit when the option is enabled.
 *
 * vitest's jsdom environment provides `window`; we replace `matchMedia`
 * per-test to flip the preference deterministically.
 */

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

describe("SmoothProgress respectReducedMotion", () => {
    beforeEach(() => {
        mockReducedMotion(true);
    });

    afterEach(() => {
        // Reset to non-reduced (default vitest jsdom state).
        mockReducedMotion(false);
    });

    it("default option (false): setTarget animates", () => {
        const sp = new SmoothProgress({ damping: 0.5 });
        sp.setTarget(1);
        // Without respectReducedMotion, setTarget marks unsettled and
        // requires tick()/play() to converge.
        expect(sp.settled).toBe(false);
        expect(sp.current).toBe(0);
    });

    it("respectReducedMotion=true: setTarget snaps immediately", () => {
        const sp = new SmoothProgress({
            damping: 0.5,
            respectReducedMotion: true,
        });
        sp.setTarget(1);
        // With respectReducedMotion + reduced-motion preference, setTarget
        // jumps straight to target without damping.
        expect(sp.settled).toBe(true);
        expect(sp.current).toBe(1);
    });

    it("respectReducedMotion=true: play() invokes onFrame once with target", () => {
        const sp = new SmoothProgress({
            damping: 0.5,
            respectReducedMotion: true,
        });
        sp.setTarget(0.7);
        const frames: number[] = [];
        sp.play((v) => frames.push(v));
        // No rAF loop; one synchronous callback at target.
        expect(frames).toEqual([0.7]);
        expect(sp.settled).toBe(true);
    });

    it("respectReducedMotion ignores when matchMedia not present", () => {
        // Simulate SSR: remove matchMedia.
        const originalWindow = (globalThis as any).window;
        (globalThis as any).window = undefined;
        try {
            const sp = new SmoothProgress({
                damping: 0.5,
                respectReducedMotion: true,
            });
            sp.setTarget(1);
            // Without window/matchMedia, the option is a no-op.
            expect(sp.settled).toBe(false);
        } finally {
            (globalThis as any).window = originalWindow;
        }
    });
});

describe("NumericAnimation respectReducedMotion", () => {
    beforeEach(() => {
        mockReducedMotion(true);
    });

    afterEach(() => {
        mockReducedMotion(false);
    });

    it("default option (false): play() runs full duration", async () => {
        const anim = new NumericAnimation([{ x: 0 }, { x: 100 }], {
            duration: 50,
        });
        const frames: number[] = [];
        await anim.play((v) => frames.push(v.x));
        // Multiple frames captured during the 50ms playback.
        expect(frames.length).toBeGreaterThan(1);
        expect(frames[frames.length - 1]).toBe(100);
    });

    it("respectReducedMotion=true: play() snaps to final keyframe", async () => {
        const anim = new NumericAnimation([{ x: 0 }, { x: 100 }], {
            duration: 50,
            respectReducedMotion: true,
        });
        const frames: number[] = [];
        await anim.play((v) => frames.push(v.x));
        // One synchronous callback at the final values.
        expect(frames).toEqual([100]);
    });
});
