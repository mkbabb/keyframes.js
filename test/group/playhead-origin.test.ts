// SERVED MODEL: claude-opus-5-5
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { AnimationGroup } from "../../src/animation/group";

/**
 * X.KF.W13X.r — KFA-17 / C6-3, the `[real-cube]` intermittent, at its root.
 *
 * The recorded failure (KF.W13U R-close-2 and Check): from an established rest
 * the cube's playhead read 0, then Play drove it to -1266.7, then -25.1 —
 * counting UP from minus the paused span. The mechanism: the oracle pauses the
 * autoplayed cube ~20 s after entry (its two waits time out, 8 s + 12 s), which
 * is four periods of the channels' 5 s default, so under load the pause lands
 * ON a wrap tick. That tick's `onEnd` had cleared the child's `startTime`; the
 * group's `pause()` recorded `pausedTime` on it anyway; at resume the lazy
 * start anchored a FRESH `startTime` at the resume clock and `advanceBody` then
 * subtracted the paused span from it again, so local = -(paused span).
 *
 * KFA-181 (5ae589ab) now carries a non-final wrap's anchor, which took the
 * cube's infinite channels off the fresh-anchor path; any child that reaches
 * the lazy start with no carried anchor (a finished finite channel in a still
 * running group) still took it. The cure: a fresh anchor is taken at this
 * frame's clock, so a pause recorded before it spans no local time and is
 * discarded, never applied.
 */
const DURATION = 5000; // the demo's channel default (animationOptionsStore)
const FRAME = 16.7;

const channel = (iterationCount: number | "infinite" = "infinite") => {
    const a = new CSSKeyframesAnimation({
        duration: DURATION,
        iterationCount,
        direction: "alternate",
        timingFunction: "ease-in-out",
        useWAAPI: false,
    } as never).fromString("from { opacity: 0; } to { opacity: 1; }");
    a.setTargets(document.createElement("div"));
    return a;
};

/** Drive the group on a 16.7 ms clock until `child` wraps (its `startTime` is
 *  cleared by `onEnd`), then pause ON that tick — the landing the oracle's
 *  20 s wait makes under load. Returns the clock of the pause tick. */
const pauseOnWrapTick = async (
    group: AnimationGroup<any>,
    child: CSSKeyframesAnimation<any>,
    from: number,
    wraps: number,
): Promise<number> => {
    let t = from;
    let seen = 0;
    await group.advanceTo(t);
    for (;;) {
        t += FRAME;
        const before = child.iteration;
        const wasDone = child.done;
        await group.advanceTo(t);
        if (child.iteration !== before || (!wasDone && child.done)) seen += 1;
        if (seen === wraps) break;
    }
    expect(child.startTime).toBeUndefined();
    group.pause();
    return t;
};

describe("X.KF.W13X.r — a resume never runs the playhead negative", () => {
    it("the recorded cube path: pause on the 4th wrap tick, resume 1266.7 ms later", async () => {
        const rotations = channel();
        const matrix = channel();
        const hover = channel();
        const group = new AnimationGroup<any>(rotations, matrix, hover);
        group.singleTarget = false;
        const tp = await pauseOnWrapTick(group, rotations, 120.2, 4);
        // The rest the oracle read: the reversed 4th iteration ended, effectiveT 0.
        expect(rotations.effectiveT).toBe(0);
        const overshoot = tp - (120.2 + 4 * DURATION);
        group.resume();
        await group.advanceTo(tp + 1266.7);
        const first = rotations.t;
        await group.advanceTo(tp + 2508.3);
        const later = rotations.t;
        // Born-RED before KFA-181: -1266.7, then -25.1 (the recorded trace).
        expect(first).toBeCloseTo(overshoot, 6);
        expect(later).toBeCloseTo(overshoot + (2508.3 - 1266.7), 6);
    });

    it("an unanchored child (a finished finite channel): the pause is not applied to its fresh anchor", async () => {
        const once = channel(1);
        const sibling = channel();
        const group = new AnimationGroup<any>(once, sibling);
        group.singleTarget = false;
        const tp = await pauseOnWrapTick(group, once, 120.2, 1);
        expect(once.done).toBe(true);
        group.resume();
        await group.advanceTo(tp + 1266.7);
        const first = once.t;
        await group.advanceTo(tp + 2508.3);
        const later = once.t;
        // The pause-free control: the next tick re-anchors the child at its own
        // clock (local 0) and it advances by the frame gap from there.
        expect(first).toBe(0);
        expect(later).toBeCloseTo(2508.3 - 1266.7, 6);
        expect(once.pausedTime).toBe(0);
    });
});
