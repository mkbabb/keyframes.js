import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RAFPlayback } from "../src/animation/playback";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { AnimationGroup } from "../src/animation/group";
import { springTimingFunction } from "../src/animation/springTimingFunction";
import { getCSSEasing } from "../src/animation/internal/css-easing";
import { toWAAPIOptions } from "../src/animation/waapi";
import { yieldToMain } from "../src/animation/internal/scheduler";

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

function opacityAnim(name: string, duration = 200) {
    const anim = new CSSKeyframesAnimation({ duration, useWAAPI: false })
        .fromString(`
        from { opacity: 0; }
        to { opacity: 1; }
    `);
    anim.name = name;
    return anim;
}

// ── RAFPlayback reduced-motion gate (the exported shared gate) ────────────

describe("RAFPlayback reduced-motion gate", () => {
    afterEach(() => mockReducedMotion(false));

    it("respectReducedMotion + reduced preference: snaps onTick(1) once, no loop", async () => {
        mockReducedMotion(true);
        const rafSpy = vi.spyOn(window, "requestAnimationFrame");
        const pb = new RAFPlayback();
        const ticks: number[] = [];
        await pb.play(100, (p) => ticks.push(p), {
            respectReducedMotion: true,
        });
        expect(ticks).toEqual([1]);
        expect(rafSpy).not.toHaveBeenCalled();
        rafSpy.mockRestore();
    });

    it("respectReducedMotion but NO reduced preference: runs the rAF loop", async () => {
        mockReducedMotion(false);
        const pb = new RAFPlayback();
        const ticks: number[] = [];
        await pb.play(50, (p) => ticks.push(p), { respectReducedMotion: true });
        expect(ticks.length).toBeGreaterThan(1);
        expect(ticks[ticks.length - 1]).toBe(1);
    });

    it("default (no option): runs the rAF loop even under reduced preference", async () => {
        mockReducedMotion(true);
        const pb = new RAFPlayback();
        const ticks: number[] = [];
        await pb.play(50, (p) => ticks.push(p));
        expect(ticks.length).toBeGreaterThan(1);
    });
});

// ── Heavy Animation.play() reduced-motion snap ────────────────────────────

describe("Animation.play() reduced-motion snap (heavy path)", () => {
    afterEach(() => mockReducedMotion(false));

    it("respectReducedMotion + reduced preference: snaps to final frame, no rAF loop", async () => {
        mockReducedMotion(true);
        const rafSpy = vi.spyOn(window, "requestAnimationFrame");
        const el = document.createElement("div");
        const anim = new CSSKeyframesAnimation({
            duration: 400,
            useWAAPI: false,
            respectReducedMotion: true,
        }).fromString(`from { opacity: 0; } to { opacity: 1; }`);
        anim.setTargets(el);

        await anim.play();
        expect(parseFloat(el.style.opacity)).toBeCloseTo(1);
        expect(rafSpy).not.toHaveBeenCalled();
        rafSpy.mockRestore();
    });

    it("respectReducedMotion off: runs the normal rAF loop", async () => {
        mockReducedMotion(true);
        const rafSpy = vi.spyOn(window, "requestAnimationFrame");
        const el = document.createElement("div");
        const anim = new CSSKeyframesAnimation({
            duration: 40,
            useWAAPI: false,
        }).fromString(`from { opacity: 0; } to { opacity: 1; }`);
        anim.setTargets(el);
        await anim.play();
        expect(rafSpy).toHaveBeenCalled();
        rafSpy.mockRestore();
    });
});

// ── AnimationGroup reduced-motion snap ────────────────────────────────────

describe("AnimationGroup.play() reduced-motion snap", () => {
    afterEach(() => mockReducedMotion(false));

    it("respectReducedMotion + reduced preference: resolves without an rAF loop", async () => {
        mockReducedMotion(true);
        const rafSpy = vi.spyOn(window, "requestAnimationFrame");
        const group = new AnimationGroup(opacityAnim("g1"), opacityAnim("g2"));
        group.respectReducedMotion = true;
        await group.play();
        expect(rafSpy).not.toHaveBeenCalled();
        rafSpy.mockRestore();
    });

    it("single-target group SNAPS to the final frame (fadeIn ends visible, not at the initial frame)", async () => {
        mockReducedMotion(true);
        const el = document.createElement("div");
        const group = new AnimationGroup(opacityAnim("solo")).setTargets(el);
        group.respectReducedMotion = true;
        await group.play();
        // The whole point of the snap — the END state, not the pre-animation
        // state. A reset()-routed snap would leave this at opacity 0.
        expect(parseFloat(el.style.opacity)).toBeCloseTo(1);
    });

    it("multi-target group snaps every child to its own final frame", async () => {
        mockReducedMotion(true);
        const a = document.createElement("div");
        const b = document.createElement("div");
        const animA = opacityAnim("ma");
        const animB = opacityAnim("mb");
        animA.setTargets(a);
        animB.setTargets(b);
        const group = new AnimationGroup(animA, animB);
        group.respectReducedMotion = true;
        await group.play();
        expect(parseFloat(a.style.opacity)).toBeCloseTo(1);
        expect(parseFloat(b.style.opacity)).toBeCloseTo(1);
    });
});

// ── scheduler.yield() INP relief ──────────────────────────────────────────

describe("yieldToMain + AnimationGroup tick batching", () => {
    afterEach(() => {
        delete (globalThis as { scheduler?: unknown }).scheduler;
    });

    it("prefers native scheduler.yield() when present", async () => {
        const y = vi.fn(() => Promise.resolve());
        (globalThis as { scheduler?: unknown }).scheduler = { yield: y };
        await yieldToMain();
        expect(y).toHaveBeenCalledTimes(1);
    });

    it("falls back to a macrotask when scheduler.yield is absent", async () => {
        delete (globalThis as { scheduler?: unknown }).scheduler;
        await expect(yieldToMain()).resolves.toBeUndefined();
    });

    it("a large group (> YIELD_BATCH) yields between batches", async () => {
        const y = vi.fn(() => Promise.resolve());
        (globalThis as { scheduler?: unknown }).scheduler = { yield: y };
        const children = Array.from(
            { length: AnimationGroup.YIELD_BATCH + 8 },
            (_, i) => opacityAnim("big" + i),
        );
        const group = new AnimationGroup(...children);
        await group.tick(performance.now());
        expect(y).toHaveBeenCalled();
    });

    it("a small group (<= YIELD_BATCH) does NOT yield (fast path)", async () => {
        const y = vi.fn(() => Promise.resolve());
        (globalThis as { scheduler?: unknown }).scheduler = { yield: y };
        const group = new AnimationGroup(opacityAnim("s1"), opacityAnim("s2"));
        await group.tick(performance.now());
        expect(y).not.toHaveBeenCalled();
    });
});

// ── WAAPI spring linear() widening (LAND) ─────────────────────────────────

describe("WAAPI spring linear() widening", () => {
    it("springTimingFunction tags its closure with a CSS linear() string", () => {
        const tf = springTimingFunction({
            response: 0.5,
            dampingFraction: 0.5,
        });
        const css = getCSSEasing(tf);
        expect(css).toMatch(/^linear\(/);
        // The tag does not change the closure's numeric behavior.
        expect(tf(0)).toBe(0);
        expect(tf(1)).toBe(1);
    });

    it("toWAAPIOptions emits the spring linear() instead of bare linear", () => {
        const spring = springTimingFunction({
            response: 0.4,
            dampingFraction: 0.6,
        });
        const anim = new CSSKeyframesAnimation({
            duration: 300,
            timingFunction: spring,
        }).fromString(`from { opacity: 0; } to { opacity: 1; }`);
        expect(String(toWAAPIOptions(anim).easing)).toMatch(/^linear\(/);
    });

    it("toWAAPIOptions falls back to bare linear for an untagged easing", () => {
        const anim = new CSSKeyframesAnimation({
            duration: 300,
            timingFunction: (t: number) => t * t,
        }).fromString(`from { opacity: 0; } to { opacity: 1; }`);
        expect(toWAAPIOptions(anim).easing).toBe("linear");
    });
});
