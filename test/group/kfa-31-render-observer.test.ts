// SERVED MODEL: claude-opus-5-5
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { AnimationGroup } from "../../src/animation/group";

/**
 * KFA-31 · KFA-85 library limb (X.KF.W13X.r4lib) — `AnimationGroup` has a
 * per-frame observer on the DOM lane.
 *
 * The cube's re-lighting must read the full composed orientation (orbit ·
 * roll · bob · pose · spin) on the group's own tick — one writer, no second
 * rAF — and re-light for free on a scrub. The group published only
 * `animationstart` / `animationiteration` / `animationend`, so the consumer had
 * no frame to hang the light on. `onRender(listener)` is called after every
 * frame the group's draw loop paints, after every `render()` (a scrub, a pause
 * snapshot) and after `reset()`, and returns its unsubscribe.
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

const spin = () => {
    const a = new CSSKeyframesAnimation<{ opacity: number }>({
        duration: 1000,
        iterationCount: "infinite",
        timingFunction: "linear",
        useWAAPI: false,
    } as never).fromString("from { opacity: 0; } to { opacity: 1; }");
    a.setTargets(document.createElement("div"));
    return a;
};

describe("KFA-31 · KFA-85 — the group's per-frame observer", () => {
    it("fires once per painted frame, after the paint, and stops on unsubscribe", async () => {
        const a = spin();
        const group = new AnimationGroup<any>(a, spin());
        group.singleTarget = false;
        const seen: [number, number][] = [];
        const off = group.onRender((t) => seen.push([t, a.t]));
        void group.play();
        await Promise.resolve();
        tick(1000);
        tick(1016);
        tick(1032);
        expect(seen.map(([t]) => t)).toEqual([1000, 1016, 1032]);
        // The listener reads the frame it is told about: the child already
        // advanced to it.
        expect(seen.at(-1)![1]).toBeCloseTo(32, 6);
        off();
        tick(1048);
        expect(seen).toHaveLength(3);
        group.stop();
    });

    it("a scrub (setChildTime + render) and a reset re-notify with no rAF", () => {
        const a = spin();
        const group = new AnimationGroup<any>(a, spin());
        group.singleTarget = false;
        let calls = 0;
        group.onRender(() => calls++);
        group.setChildTime(a, 400).render();
        expect(calls).toBe(1);
        group.reset();
        expect(calls).toBe(2);
        expect(queue).toHaveLength(0);
    });

    it("a paused group does not notify", async () => {
        const group = new AnimationGroup<any>(spin(), spin());
        group.singleTarget = false;
        void group.play();
        await Promise.resolve();
        tick(1000);
        group.pause();
        let calls = 0;
        group.onRender(() => calls++);
        tick(1016);
        tick(1032);
        expect(calls).toBe(0);
        group.stop();
    });
});
