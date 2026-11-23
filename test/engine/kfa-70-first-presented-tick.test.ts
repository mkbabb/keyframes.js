// SERVED MODEL: claude-opus-5-5
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { AnimationGroup } from "../../src/animation/group";

/**
 * KFA-70 engine limb (X.KF.W13X.r4lib) — the play clock starts at the first
 * presented frame, not at the frame that anchored it.
 *
 * The landing cube's settle was played during a long mount frame: the anchor
 * tick painted the rest pose, the browser then spent ~110 ms rendering that
 * frame, and the next tick read 110 ms of elapsed time — the first moving
 * frame already showed 63–70 % of the sweep (`frame.ts:107` anchors at the
 * anchor tick's clock). Nothing had been presented in between, so on the rAF
 * lane the first advance after a fresh anchor is at most one frame: the clock
 * is re-anchored to the first presented tick. A prompt first frame is
 * unchanged.
 */
let queue: FrameRequestCallback[] = [];
const tick = (now: number) => {
    const due = queue;
    queue = [];
    for (const cb of due) cb(now);
};

beforeEach(() => {
    queue = [];
    window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
        queue.push(cb);
        return queue.length;
    }) as typeof window.requestAnimationFrame;
    window.cancelAnimationFrame = (() => {}) as typeof window.cancelAnimationFrame;
});

afterEach(() => {
    // @ts-expect-error — remove the stub
    delete window.requestAnimationFrame;
    // @ts-expect-error — remove the stub
    delete window.cancelAnimationFrame;
});

const FRAME = 1000 / 60;

const settle = () => {
    const el = document.createElement("div");
    const a = new CSSKeyframesAnimation<{ opacity: number }>({
        duration: 1000,
        timingFunction: "linear",
        useWAAPI: false,
    } as never).fromString("from { opacity: 0; } to { opacity: 1; }");
    a.setTargets(el);
    return { a, el };
};

const opacity = (el: HTMLElement) => Number(el.style.opacity);

describe("KFA-70 — the clock starts at the first presented tick", () => {
    it("standalone: a 118 ms first frame advances one frame, not 118 ms", async () => {
        const { a, el } = settle();
        void a.play();
        await Promise.resolve();
        tick(1000); // the anchor tick paints the rest pose
        expect(opacity(el)).toBeCloseTo(0, 9);
        tick(1118); // the long mount frame is presented here
        expect(opacity(el)).toBeCloseTo(FRAME / 1000, 6);
        tick(1118 + FRAME);
        expect(opacity(el)).toBeCloseTo((2 * FRAME) / 1000, 6);
        a.stop();
    });

    it("standalone: a prompt first frame is unchanged", async () => {
        const { a, el } = settle();
        void a.play();
        await Promise.resolve();
        tick(1000);
        tick(1012);
        expect(opacity(el)).toBeCloseTo(0.012, 9);
        a.stop();
    });

    it("group: a child's first frame after a long mount frame advances one frame", async () => {
        const { a, el } = settle();
        const other = settle();
        const group = new AnimationGroup<any>(a, other.a);
        group.singleTarget = false;
        void group.play();
        await Promise.resolve();
        tick(1000);
        tick(1118);
        expect(opacity(el)).toBeCloseTo(FRAME / 1000, 6);
        group.stop();
    });

    // FORTY-SIXTH E1 (J3) — a pause at the anchor tick (the shell holds a
    // landing scene's loop at its first painted frame until the swap lands)
    // spans no local time and is not an anchor stall. The paused span was
    // read twice (the anchor's stall moved the clock on by it, and the
    // resume moved it on again): the playhead ran negative by the whole
    // pause, held still that long, then jumped back.
    it("group: a pause at the anchor tick, resumed 600 ms later, plays on from the anchor", async () => {
        const { a, el } = settle();
        const other = settle();
        const group = new AnimationGroup<any>(a, other.a);
        group.singleTarget = false;
        void group.play();
        await Promise.resolve();
        tick(1000); // the anchor tick
        group.pause(); // held at the first painted frame
        tick(1000 + FRAME);
        group.resume(); // the swap landed
        tick(1600);
        tick(1600 + FRAME);
        expect(a.t).toBeGreaterThan(0);
        expect(a.t).toBeLessThanOrEqual(2 * FRAME + 1e-6);
        tick(1600 + 2 * FRAME);
        expect(opacity(el)).toBeGreaterThan(0);
        expect(opacity(el)).toBeLessThanOrEqual((3 * FRAME) / 1000 + 1e-6);
        group.stop();
    });

    it("group: a seek while held at the anchor is where the resumed loop plays on from", async () => {
        const { a, el } = settle();
        const other = settle();
        const group = new AnimationGroup<any>(a, other.a);
        group.singleTarget = false;
        void group.play();
        await Promise.resolve();
        tick(1000);
        group.pause();
        group.seek(125).render();
        group.resume();
        tick(1600);
        tick(1600 + FRAME);
        // Never behind the seek, never far past it.
        expect(a.t).toBeGreaterThanOrEqual(125);
        expect(a.t).toBeLessThanOrEqual(125 + 2 * FRAME + 1e-6);
        expect(opacity(el)).toBeGreaterThanOrEqual(0.125 - 1e-9);
        group.stop();
    });
});
