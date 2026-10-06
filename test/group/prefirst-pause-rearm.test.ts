// SERVED MODEL: claude-opus-5-5
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { AnimationGroup } from "../../src/animation/group";

/**
 * X.KF.W13X Repair 1 · R-r-1 STRANDED-GROUP-PREFIRST-PAUSE.
 *
 * `.r`'s served instrument (r/edge.mjs) pressed Pause in the microtask after
 * the autoplay PLAY, before the group's first rAF tick: `frames=301 min=0
 * last=0`, the transport reading "Pause" over a cube frozen at 0. The group is
 * `!started` in that window, so `pause()` is a no-op and the host withdraws the
 * armed loop with `playback.stop()`; the held `play()` promise then came back
 * from every later `play()` with no loop behind it.
 *
 * Deterministic: no clock is advanced. The fact is whether a `play()` leaves a
 * loop armed.
 */
const channel = () => {
    const a = new CSSKeyframesAnimation({
        duration: 5000,
        iterationCount: "infinite",
        useWAAPI: false,
    } as never).fromString("from { opacity: 0; } to { opacity: 1; }");
    a.setTargets(document.createElement("div"));
    return a;
};

describe("X.KF.W13X R-r-1 — a play() always leaves the group's loop armed", () => {
    it("a loop withdrawn before the first tick is re-armed by the next play(), under the same promise", () => {
        const group = new AnimationGroup<any>(channel(), channel());
        group.singleTarget = false;
        void group.play();
        expect(group.playback.running).toBe(true);
        expect(group.started).toBe(false); // armed, first tick pending
        const held = group._playingPromise;
        expect(held).not.toBeNull();

        // The host's suspend in this window (scenePlaybackAdapters `suspend()`):
        // `pause()` is a no-op on a not-yet-started group, so the loop is stopped raw.
        group.pause();
        group.playback.stop();
        expect(group.playback.running).toBe(false);

        void group.play(); // the host's resume on a `!started` group
        expect(group.playback.running).toBe(true);
        expect(group._playingPromise).toBe(held);
        group.stop();
        expect(group.playback.running).toBe(false);
    });

    it("a paused group is not re-armed by play(): un-pausing stays resume()'s act", async () => {
        const group = new AnimationGroup<any>(channel(), channel());
        group.singleTarget = false;
        void group.play();
        await group.advanceTo(100);
        await group.advanceTo(116.7);
        group.pause();
        expect(group.playback.running).toBe(false);
        void group.play();
        expect(group.playback.running).toBe(false);
        expect(group.paused).toBe(true);
        group.resume();
        expect(group.playback.running).toBe(true);
        group.stop();
    });
});
