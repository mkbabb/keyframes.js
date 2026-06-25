import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RAFPlayback } from "../src/animation/physics/playback";
import type { Tickable } from "../src/animation/physics/playback";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { AnimationGroup } from "../src/animation/group";
import { SmoothProgress } from "../src/animation/physics/smooth";
import { SpringProgress } from "../src/animation/physics/spring";
import { springTimingFunction } from "../src/animation/physics/spring";
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
        await group.advanceTo(performance.now());
        expect(y).toHaveBeenCalled();
    });

    it("a small group (<= YIELD_BATCH) does NOT yield (fast path)", async () => {
        const y = vi.fn(() => Promise.resolve());
        (globalThis as { scheduler?: unknown }).scheduler = { yield: y };
        const group = new AnimationGroup(opacityAnim("s1"), opacityAnim("s2"));
        await group.advanceTo(performance.now());
        expect(y).not.toHaveBeenCalled();
    });
});

// ── WAAPI spring linear() widening (LAND) ─────────────────────────────────

describe("WAAPI spring linear() widening", () => {
    it("springTimingFunction carries its CSS linear() twin on the typed Easing", () => {
        const tf = springTimingFunction({
            response: 0.5,
            dampingFraction: 0.5,
        });
        expect(tf.css).toMatch(/^linear\(/);
        // The pairing does not change the callable's numeric behavior.
        expect(tf.fn(0)).toBe(0);
        expect(tf.fn(1)).toBe(1);
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

// ── S1: one generation-guarded loop core — drive cannot double-schedule ───
//
// A manual rAF queue makes scheduling deterministic: each scheduled callback
// is held until `step()` runs it, and we count how many callbacks are LIVE
// (scheduled but not yet run). A correct single-chain loop never has more
// than one live callback at a time; a double-scheduled chain shows two.

describe("RAFPlayback.drive — one generation-guarded core (S1)", () => {
    let queue: Map<number, FrameRequestCallback>;
    let nextId: number;
    let realRaf: typeof window.requestAnimationFrame;
    let realCancel: typeof window.cancelAnimationFrame;

    beforeEach(() => {
        queue = new Map();
        nextId = 1;
        realRaf = window.requestAnimationFrame;
        realCancel = window.cancelAnimationFrame;
        window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
            const id = nextId++;
            queue.set(id, cb);
            return id;
        }) as typeof window.requestAnimationFrame;
        window.cancelAnimationFrame = ((id: number) => {
            queue.delete(id);
        }) as typeof window.cancelAnimationFrame;
    });

    afterEach(() => {
        window.requestAnimationFrame = realRaf;
        window.cancelAnimationFrame = realCancel;
    });

    /** Run every currently-queued callback once; the `_run` `.then` that
     *  reschedules is a microtask, so await a flush after draining. */
    async function step(now: number): Promise<void> {
        const live = [...queue.entries()];
        queue.clear();
        for (const [, cb] of live) cb(now);
        await Promise.resolve();
        await Promise.resolve();
    }

    it("a stop()+restart mid-frame (re-entrant onFrame) spawns NO second rAF chain", async () => {
        const pb = new RAFPlayback();
        // A stepper that never settles, so the loop keeps rescheduling.
        const tickable: Tickable = {
            settled: false,
            tickDt: () => 0,
        };

        let reentered = false;
        const onFrame = () => {
            // On the FIRST frame, re-enter synchronously: stop the live loop
            // and immediately re-arm it — the classic mid-frame restart that
            // the old `_rafId !== null`-only guard let double-schedule.
            if (!reentered) {
                reentered = true;
                pb.stop();
                pb.drive(tickable, onFrame);
            }
        };

        pb.drive(tickable, onFrame);
        expect(queue.size).toBe(1); // one scheduled frame

        await step(16); // runs the frame → onFrame re-enters stop()+drive()
        // The stale (first) chain must NOT reschedule; only the restart's
        // chain survives. Exactly ONE live callback, never two.
        expect(queue.size).toBe(1);

        await step(32); // advance the surviving chain one more frame
        expect(queue.size).toBe(1); // still a single chain, no fork

        pb.stop();
        expect(queue.size).toBe(0);
    });
});

// ── S2: one canonical tickDt(ms) step — no units foot-gun ─────────────────

describe("tickDt(dt: ms) is the canonical step across steppers (S2)", () => {
    it("tickDt(16) advances the same physical amount on smooth + spring", () => {
        // SmoothProgress: a 16ms step is frame-rate-independent damping.
        const smooth = new SmoothProgress({ damping: 0.2, clamp: false });
        smooth.setTarget(1);
        const sA = smooth.tickDt(16);
        // SpringProgress: tickDt(16) must mean 16 MILLISECONDS (= 0.016s),
        // not 16 seconds — the old `tick(16)` seconds foot-gun would settle
        // instantly. After one 16ms step the spring has barely moved.
        const spring = new SpringProgress({
            response: 0.5,
            dampingFraction: 0.86,
        });
        spring.target = 1;
        const pA = spring.tickDt(16);
        expect(pA).toBeGreaterThan(0);
        expect(pA).toBeLessThan(0.2); // 16ms, NOT 16s — nowhere near settled
        expect(sA).toBeGreaterThan(0);
        expect(sA).toBeLessThan(1);

        // Two 16ms steps advance the SAME physical span as one 32ms step
        // (frame-rate independence holds in ONE unit, ms, for both steppers).
        const smoothSplit = new SmoothProgress({ damping: 0.2, clamp: false });
        smoothSplit.setTarget(1);
        smoothSplit.tickDt(16);
        const smoothTwo = smoothSplit.tickDt(16);
        const smoothOnce = new SmoothProgress({ damping: 0.2, clamp: false });
        smoothOnce.setTarget(1);
        const smoothJump = smoothOnce.tickDt(32);
        // Exponential damping composes exactly: e^(-d·16/F)·e^(-d·16/F) =
        // e^(-d·32/F), so split and single-jump agree to machine epsilon.
        expect(smoothTwo).toBeCloseTo(smoothJump, 12);

        const springSplit = new SpringProgress({
            response: 0.5,
            dampingFraction: 0.86,
        });
        springSplit.target = 1;
        springSplit.tickDt(16);
        const springTwo = springSplit.tickDt(16);
        const springOnce = new SpringProgress({
            response: 0.5,
            dampingFraction: 0.86,
        });
        springOnce.target = 1;
        const springJump = springOnce.tickToTime(0.032);
        // The analytic spring closed-form: two 16ms steps reach the same
        // (x, v) as a single seek to 32ms — same ms unit, same physics.
        expect(springTwo).toBeCloseTo(springJump, 9);
    });
});
