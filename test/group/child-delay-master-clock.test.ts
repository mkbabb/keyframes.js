import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { AnimationGroup } from "../../src/animation/group";
import { stagger } from "../../src/animation/orchestration/stagger";

/**
 * A group child's `delay` is a PHASE on the group's one master clock.
 *
 * The documented semantics (README §stagger: "feed the delays to
 * `AnimationGroup` per-child `delay`"; `group/seek.ts`: a child's position is
 * the master elapsed time read against its OWN delay): a child started with
 * its siblings sits, at master time `m`, at local time `m − delay`. Before its
 * delay it is in the CSS before-phase (its fill decides what it paints); once
 * it finishes it holds its end until the group completes.
 *
 * The defect this replaces (6.2.0, measured on the Daraksha unfurl): the delay
 * was a wall-clock `sleep` inside the child's first advance, so
 *  · the group's first frame waited on its LONGEST delay (the draw loop never
 *    rescheduled — every petal sat still, then all of them jumped), and
 *  · a child that finished before its siblings was advanced again, re-entered
 *    `onStart` and replayed from 0 % (the petal that "snapped back").
 *
 * Driven by a stubbed rAF queue at a 16 ms cadence (under one frame, so the
 * KFA-70 first-presented-frame re-anchor moves nothing).
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

const DURATION = 600;

const petal = (delay: number, fillMode: "none" | "backwards" | "both") => {
    const anim = new CSSKeyframesAnimation<{ opacity: number }>({
        duration: DURATION,
        delay,
        timingFunction: "linear",
        fillMode,
        useWAAPI: false,
    } as never).fromString("from { opacity: 0; } to { opacity: 1; }");
    const el = document.createElement("div");
    document.body.appendChild(el);
    anim.setTargets(el);
    return { anim, el };
};

const opacity = (el: HTMLElement) =>
    el.style.opacity === "" ? undefined : Number(el.style.opacity);

const START = 1000;
const STEP = 16;

describe("a group child's delay is a phase on the master clock", () => {
    it("every child sits at master − delay; the loop never waits on a delay", async () => {
        const delays = [0, 70, 300];
        const petals = delays.map((d) => petal(d, "both"));
        const group = new AnimationGroup<any>(...petals.map((p) => p.anim));
        group.singleTarget = false;
        const done = group.play();
        await Promise.resolve();

        for (let t = START; t <= START + 300 + DURATION + 2 * STEP; t += STEP) {
            expect(queue.length, `a frame is scheduled before ${t}`).toBe(1);
            tick(t);
            if (!group.started) break;
            const m = t - START;
            petals.forEach(({ el }, i) => {
                const expected = Math.min(1, Math.max(0, (m - delays[i]!) / DURATION));
                expect(opacity(el), `petal ${i} at master ${m} ms`).toBeCloseTo(expected, 6);
            });
        }
        await done;
        // The play ends exactly when its longest child does, and every petal
        // rests open (fill both).
        for (const { el } of petals) expect(opacity(el)).toBe(1);
    });

    it("a child that finishes first holds its end — it never replays from 0 %", async () => {
        const fast = petal(0, "both");
        const slow = petal(400, "both");
        const group = new AnimationGroup<any>(fast.anim, slow.anim);
        group.singleTarget = false;
        void group.play();
        await Promise.resolve();

        for (let t = START; t <= START + 400 + DURATION / 2; t += STEP) tick(t);

        expect(fast.anim.done).toBe(true);
        expect(opacity(fast.el)).toBe(1);
        expect(fast.anim.iteration).toBe(0);
        expect(opacity(slow.el)).toBeGreaterThan(0.4);
        group.stop();
    });

    it("the before-phase paints per the fill: backwards → 0 % frame, none → nothing", async () => {
        const backwards = petal(200, "backwards");
        const none = petal(200, "none");
        const lead = petal(0, "none");
        const group = new AnimationGroup<any>(lead.anim, backwards.anim, none.anim);
        group.singleTarget = false;
        void group.play();
        await Promise.resolve();

        for (let t = START; t <= START + 100; t += STEP) tick(t);

        expect(opacity(backwards.el)).toBe(0);
        expect(opacity(none.el)).toBeUndefined();
        expect(opacity(lead.el)).toBeGreaterThan(0);
        group.stop();
    });

    it("the group's advance is synchronous — a delay is no sleep", () => {
        const at = stagger(6, { each: 70 });
        const petals = [0, 1, 2, 3, 4, 5].map((i) => petal(at(i, 6), "both"));
        const group = new AnimationGroup<any>(...petals.map((p) => p.anim));
        group.singleTarget = false;

        expect(group.advanceTo(START)).toBe(group);
        petals.forEach(({ anim }, i) => {
            expect(anim.startTime).toBe(START + 70 * i);
            expect(group.elapsedOf(anim)).toBe(0);
        });
        expect(group.advanceTo(START + 200)).toBe(group);
        petals.forEach(({ anim }) => expect(group.elapsedOf(anim)).toBe(200));
    });

    it("seek reads the same phase back: before a child's delay its local time is negative", () => {
        const a = petal(0, "backwards");
        const b = petal(300, "backwards");
        const group = new AnimationGroup<any>(a.anim, b.anim);
        group.singleTarget = false;

        group.seek(100).render();

        expect(a.anim.t).toBe(100);
        expect(b.anim.t).toBe(-200);
        expect(group.elapsedOf(b.anim)).toBe(100);
        expect(opacity(b.el)).toBe(0);
    });
});
