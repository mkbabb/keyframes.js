/**
 * event-ordering.test.ts — J.W6 S1 (FB-2). proof:event-ordering.
 *
 * THE correctness ORACLE that gates the `Animation`/`AnimationGroup`
 * sync-step half (the F.W5 HELD half, F→I rider): the engine's lifecycle
 * dispatch order through the deterministic `advanceTo` clock —
 *
 *   `animationstart` → `animationiteration`* → `animationend`
 *
 * — plus the two boundary observables a listener actually reads: the rest
 * frame is PAINTED before `animationend` dispatches (onEnd paints, then
 * dispatches), and the awaited `play()` resolves only AFTER `animationend`.
 *
 * PATH-AGNOSTIC by construction: every advance below is `await`ed, and
 * `await` of a non-thenable is the identity — so the gate is GREEN on the
 * async `advanceTo` shape AND on a sync-converted shape alike, and a
 * conversion (or any refactor) that REORDERS a boundary dispatch reds it.
 * This is the no-regression boundary the sync conversion ships behind
 * (`docs/tranches/J/waves/J.W6.md §S1`); the F.W5 lock at
 * `test/sync-step.test.ts` clause 2 remains the sibling guard.
 *
 *  clause 1 — Animation, single iteration: `animationstart` strictly
 *    precedes `animationend`.
 *  clause 2 — Animation, multiple iterations: start first; iteration
 *    strictly between start and end; `animationend` exactly once, last.
 *  clause 3 — paint-before-event: at `animationend` dispatch time the rest
 *    frame per the fill contract is ALREADY on the target (a deliberate
 *    dispatch-before-paint reorder reds this — the born-RED witness).
 *  clause 4 — AnimationGroup at the YIELD_BATCH=32 boundary: every child's
 *    start precedes its end through `group.advanceTo`.
 *  clause 5 — the play path: the awaited `play()` resolves after
 *    `animationend` dispatched.
 */
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { AnimationGroup } from "../src/animation/group";

// Polyfill AnimationEvent for jsdom (the engine skips dispatch when absent;
// this gate needs delivery to observe ordering).
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

const FADE = "from { opacity: 0; } to { opacity: 1; }";

const makeFade = (options: Record<string, unknown> = {}) => {
    const el = document.createElement("div");
    const a = new CSSKeyframesAnimation({
        duration: 100,
        delay: 0,
        useWAAPI: false,
        ...options,
    }).fromString(FADE);
    a.setTargets(el);
    return { a, el };
};

describe("proof:event-ordering — the Animation lifecycle dispatch order", () => {
    it("clause 1 — animationstart strictly precedes animationend", async () => {
        const { a, el } = makeFade();
        const order: string[] = [];
        el.addEventListener("animationstart", () => order.push("start"));
        el.addEventListener("animationend", () => order.push("end"));

        await a.advanceTo(0); // first tick → animationstart
        await a.advanceTo(200); // past duration → animationend

        expect(order).toEqual(["start", "end"]);
    });

    it("clause 2 — start first; iteration between; end exactly once, last", async () => {
        const { a, el } = makeFade({ iterationCount: 3 });
        const order: string[] = [];
        el.addEventListener("animationstart", () => order.push("start"));
        el.addEventListener("animationiteration", () =>
            order.push("iteration"),
        );
        el.addEventListener("animationend", () => order.push("end"));

        // Each onEnd before the last iteration resets startTime, so the next
        // advance re-runs onStart — the engine sequence interleaves (re)starts
        // between iterations. The lock pins the BOUNDARY ordering.
        await a.advanceTo(0);
        await a.advanceTo(200); // iteration 0 → 1
        await a.advanceTo(400); // re-start
        await a.advanceTo(600); // iteration 1 → 2
        await a.advanceTo(800); // re-start
        await a.advanceTo(1000); // animationend (last iteration)

        expect(order[0]).toBe("start");
        expect(order[order.length - 1]).toBe("end");
        expect(order.filter((e) => e === "end")).toHaveLength(1);
        expect(order.filter((e) => e === "iteration")).toHaveLength(2);
        for (const e of ["iteration"]) {
            expect(order.indexOf(e)).toBeGreaterThan(order.indexOf("start"));
            expect(order.lastIndexOf(e)).toBeLessThan(order.indexOf("end"));
        }
    });

    it("clause 3 — the rest frame is painted BEFORE animationend dispatches", async () => {
        // fillMode defaults to "forwards" → rest = final (opacity 1). onEnd
        // paints the rest frame, THEN dispatches — so a listener reads the
        // settled value. A dispatch-before-paint reorder reds this clause.
        const { a, el } = makeFade();
        let opacityAtEnd: string | null = null;
        el.addEventListener("animationend", () => {
            opacityAtEnd = el.style.opacity;
        });

        await a.advanceTo(0);
        await a.advanceTo(200);

        expect(opacityAtEnd).not.toBeNull();
        expect(parseFloat(opacityAtEnd!)).toBe(1);
    });

    it("clause 4 — 32-cell group: every child's start precedes its end", async () => {
        const cells = Array.from({ length: 32 }, () => makeFade());
        const orders: string[][] = cells.map(() => []);
        cells.forEach(({ el }, i) => {
            el.addEventListener("animationstart", () =>
                orders[i]!.push("start"),
            );
            el.addEventListener("animationend", () => orders[i]!.push("end"));
        });

        const group = new AnimationGroup(...cells.map(({ a }) => a));
        await group.advanceTo(0); // first tick → every child animationstart
        await group.advanceTo(200); // past duration → every child animationend

        for (const order of orders) {
            expect(order).toEqual(["start", "end"]);
        }
    });

    it("clause 5 — the awaited play() resolves after animationend", async () => {
        const { a, el } = makeFade({ duration: 60 });
        const order: string[] = [];
        el.addEventListener("animationstart", () => order.push("start"));
        el.addEventListener("animationend", () => order.push("end"));

        await a.play();
        order.push("resolved");

        expect(order[0]).toBe("start");
        expect(order.indexOf("end")).toBeGreaterThan(0);
        expect(order[order.length - 1]).toBe("resolved");
        expect(order.indexOf("resolved")).toBe(order.indexOf("end") + 1);
    });
});
