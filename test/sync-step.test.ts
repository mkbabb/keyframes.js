/**
 * sync-step.test.ts — F.W5 (the sync-step fast path). proof:sync-step.
 *
 *  clause 1 — the `drive` path schedules ZERO microtasks: a synchronous stepper
 *    over N frames reschedules INLINE (no `Promise.resolve().then` hop), so the
 *    rAF loop advances purely synchronously. BITES: revert `_run` to the
 *    always-async form → the reschedule lands in a microtask → the loop cannot
 *    advance without an awaited drain → only one frame runs per synchronous pump.
 *
 *  clause 2 — the event-ordering LOCK: `animationstart` →
 *    `animationiteration`* → `animationend`, and the play promise resolves
 *    AFTER `animationend`. Authored at F.W5 as the standing isomorphism guard
 *    that locked OUT the then-held `Animation`/group sync half; that half
 *    LANDED at J.W6 S1 behind it (and behind the wider
 *    `proof:event-ordering` gate, `test/event-ordering.test.ts`) — the lock
 *    stands so no later refactor can reorder a boundary dispatch.
 *
 *  clause 3 — the LANDED half's regression lock (J.W6 S1): the steady
 *    `Animation`/`AnimationGroup` play loop also schedules ZERO microtasks —
 *    `advanceTo` is sync past the first tick, `_frame` returns a plain
 *    boolean, and the loop-core fast-path reschedules inline. BITES: revert
 *    `advanceTo`/`_frame` to the async shape → only one frame runs per
 *    synchronous pump (exactly the arm-(a) measurement that justified the
 *    land — 1.998→0 turns/frame, `test/sync-step.measure.test.ts`).
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { RAFPlayback, type Tickable } from "../src/animation/physics/playback";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { AnimationGroup } from "../src/animation/group";

// Polyfill AnimationEvent for jsdom (it has no native AnimationEvent; the engine
// skips dispatch when absent — clause 2 needs it present to observe ordering).
if (typeof globalThis.AnimationEvent === "undefined") {
    (globalThis as { AnimationEvent?: unknown }).AnimationEvent =
        class AnimationEvent extends Event {
            animationName: string;
            elapsedTime: number;
            constructor(
                type: string,
                init?: AnimationEventInit,
            ) {
                super(type, init);
                this.animationName = init?.animationName ?? "";
                this.elapsedTime = init?.elapsedTime ?? 0;
            }
        };
}

describe("F.W5 clause 1 — drive reschedules synchronously (zero microtasks)", () => {
    let pending: Array<(now: number) => void>;
    let realRAF: typeof globalThis.requestAnimationFrame;
    let realCAF: typeof globalThis.cancelAnimationFrame;

    beforeEach(() => {
        pending = [];
        realRAF = globalThis.requestAnimationFrame;
        realCAF = globalThis.cancelAnimationFrame;
        let id = 0;
        globalThis.requestAnimationFrame = ((cb: (now: number) => void) => {
            pending.push(cb);
            return ++id;
        }) as typeof globalThis.requestAnimationFrame;
        globalThis.cancelAnimationFrame =
            (() => {}) as typeof globalThis.cancelAnimationFrame;
    });
    afterEach(() => {
        globalThis.requestAnimationFrame = realRAF;
        globalThis.cancelAnimationFrame = realCAF;
    });

    it("advances the whole drive loop with zero awaited microtasks", () => {
        // A synchronous stepper that settles deterministically after 5 ticks —
        // the `drive` shape (tickDt returns a number, settled is a boolean).
        let n = 0;
        const stepper: Tickable = {
            tickDt: (_dt: number) => {
                n += 1;
                return n;
            },
            get settled() {
                return n >= 5;
            },
        };

        const pb = new RAFPlayback();
        pb.drive(stepper);
        expect(pending.length).toBe(1); // first frame scheduled synchronously

        // Pump frames synchronously WITHOUT draining microtasks. With the sync
        // fast-path each frame reschedules inline, so the loop runs to settle in
        // one synchronous pump. With the OLD always-async `_run`, the reschedule
        // would land in a microtask we never await → only ONE frame would run.
        let frames = 0;
        let now = 0;
        while (pending.length && frames < 50) {
            const cb = pending.shift()!;
            now += 16.667;
            cb(now);
            frames += 1;
        }

        expect(frames).toBe(5); // all 5 ticks ran synchronously (not 1)
        expect(n).toBe(5); // the stepper reached settle
        expect(pending.length).toBe(0); // loop cleaned up on settle
    });
});

describe("F.W5 clause 2 — event-ordering lock (the held-half guard)", () => {
    // Driven through `advanceTo` (the deterministic manual clock, useWAAPI:false)
    // so the ordering is exact and rAF-timing-independent — exactly the seam the
    // held `Animation`-half sync transposition would touch. The play-promise
    // resolve-after-`animationend` point is covered by animation.test.ts's play
    // tests; this lock pins the dispatch ORDER a sync `_frame` could reorder.
    it("animationstart precedes animationend (single iteration)", async () => {
        const el = document.createElement("div");
        const order: string[] = [];
        el.addEventListener("animationstart", () => order.push("start"));
        el.addEventListener("animationend", () => order.push("end"));

        const a = new CSSKeyframesAnimation({
            duration: 100,
            delay: 0,
            useWAAPI: false,
        }).fromString("from { opacity: 0; } to { opacity: 1; }");
        a.setTargets(el);

        await a.advanceTo(0); // first tick → animationstart
        await a.advanceTo(200); // past duration → animationend

        expect(order).toEqual(["start", "end"]);
    });

    it("start → iteration → end across multiple iterations", async () => {
        const el = document.createElement("div");
        const order: string[] = [];
        el.addEventListener("animationstart", () => order.push("start"));
        el.addEventListener("animationiteration", () =>
            order.push("iteration"),
        );
        el.addEventListener("animationend", () => order.push("end"));

        const a = new CSSKeyframesAnimation({
            duration: 100,
            iterationCount: 2,
            delay: 0,
            useWAAPI: false,
        }).fromString("from { opacity: 0; } to { opacity: 1; }");
        a.setTargets(el);

        // Each onEnd resets startTime, so the next advance re-runs onStart — the
        // CURRENT engine sequence is start · iteration · (re)start · end. The
        // lock pins exactly this ordering (a held-half sync `_frame` that
        // reordered any boundary event would red it).
        await a.advanceTo(0); // animationstart (iteration 0)
        await a.advanceTo(200); // onEnd → animationiteration (0 → 1)
        await a.advanceTo(400); // re-onStart → animationstart
        await a.advanceTo(600); // onEnd → animationend (last iteration)

        expect(order[0]).toBe("start");
        expect(order[order.length - 1]).toBe("end");
        expect(order).toContain("iteration");
        // animationend fires exactly once, and last.
        expect(order.filter((e) => e === "end")).toHaveLength(1);
        expect(order.indexOf("iteration")).toBeGreaterThan(
            order.indexOf("start"),
        );
        expect(order.indexOf("iteration")).toBeLessThan(order.indexOf("end"));
    });
});

describe("J.W6 S1 clause 3 — steady Animation/group advance reschedules synchronously", () => {
    let pending: Array<(now: number) => void>;
    let realRAF: typeof globalThis.requestAnimationFrame;
    let realCAF: typeof globalThis.cancelAnimationFrame;

    beforeEach(() => {
        pending = [];
        realRAF = globalThis.requestAnimationFrame;
        realCAF = globalThis.cancelAnimationFrame;
        let id = 0;
        globalThis.requestAnimationFrame = ((cb: (now: number) => void) => {
            pending.push(cb);
            return ++id;
        }) as typeof globalThis.requestAnimationFrame;
        globalThis.cancelAnimationFrame =
            (() => {}) as typeof globalThis.cancelAnimationFrame;
    });
    afterEach(() => {
        globalThis.requestAnimationFrame = realRAF;
        globalThis.cancelAnimationFrame = realCAF;
    });

    const makeFade = () => {
        const el = document.createElement("div");
        const a = new CSSKeyframesAnimation({
            duration: 10_000, // far past the pumped window — steady state
            delay: 0,
            useWAAPI: false,
        }).fromString("from { opacity: 0; } to { opacity: 1; }");
        a.setTargets(el);
        return a;
    };

    /**
     * Pump frames synchronously WITHOUT draining microtasks. With the sync
     * advance each frame reschedules inline, so all N frames run in one
     * synchronous pump; with the old async `advanceTo`/`_frame` the
     * reschedule lands in a microtask we never await → only ONE frame runs.
     */
    const pumpSync = (max: number): number => {
        let frames = 0;
        let now = 0;
        while (pending.length && frames < max) {
            const cb = pending.shift()!;
            now += 16.667;
            cb(now);
            frames += 1;
        }
        return frames;
    };

    it("advances an Animation play loop with zero awaited microtasks", () => {
        const a = makeFade();
        void a.play();
        expect(pending.length).toBe(1); // first frame scheduled synchronously

        expect(pumpSync(20)).toBe(20); // every frame rescheduled inline (not 1)
        a.stop();
    });

    it("advances an AnimationGroup play loop with zero awaited microtasks", () => {
        const group = new AnimationGroup(
            ...Array.from({ length: 4 }, makeFade),
        );
        void group.play();
        expect(pending.length).toBe(1);

        expect(pumpSync(20)).toBe(20);
        group.stop();
    });
});
