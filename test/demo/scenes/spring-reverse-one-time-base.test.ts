/**
 * X.KF.W13X.r3res2b — COHESION §0fj item 2 · KF-W13.md ADDENDUM (i): the Sweep
 * ribbon ball under Reverse, on ONE time base (§0er ESC-spring-1; the ribbon's
 * C-2 effective-time contract, `PlaybackRibbon.vue`).
 *
 * The banked defect (served ×2 at kf `bb2dc68d`, `evidence/W13X/r3res2b/before-r*.json`):
 * with Reverse on, the ribbon's visualizer ball read the MIRROR of the scrubber
 * thumb (|ball − (1 − thumb)| = 0, |ball − thumb| up to 1.0), and a keyboard scrub
 * under Reverse threw the thumb to its mirror (0.119 → 0.870 for five steps). The
 * demo clock already runs the Sweep backwards (KFA-44) AND the channel carries
 * `springEditAnim.reversed`; the demo seated the engine's RAW `t` with the axis
 * (effective) time, so the engine's `effectiveT` — what the ball paints — inverted
 * a second time, and the ribbon's RAW `sliderUpdate.t` was read back as effective.
 *
 * (1) every frame, forward and reversed, the ball's read (`springEditAnim.effectiveT`
 *     over the leg) equals the thumb's (`scrubberPhase`): one effective time;
 * (2) a scrub the ribbon emits under Reverse (RAW engine time, inverted by the
 *     ribbon over the channel's flag exactly as `PlaybackRibbon.scrubTo` does)
 *     lands the thumb where the user put it, not at its mirror.
 */
import { beforeAll, describe, expect, it, vi } from "vitest";

import { withSetup } from "../../support/withSetup";
import { useSpringDemo } from "../../../demo/scenes/spring/useSpringDemo";
import { useSceneMachine } from "../../../demo/state";
import { warmKfEngine } from "../../../demo/kf-engine";

function parkPausedOnSpring() {
    const machine = useSceneMachine();
    machine.dispatch({ type: "NAVIGATE", to: "spring" });
    machine.dispatch({ type: "SCENE_READY" });
    machine.dispatch({ type: "PAUSE" });
    return machine;
}

/** A driven rAF clock: `frame(ms)` advances performance.now by `ms` and runs one frame. */
function drivenClock() {
    let clock = 1000;
    let queue = new Map<number, FrameRequestCallback>();
    let id = 1;
    const prevRaf = window.requestAnimationFrame;
    const prevCancel = window.cancelAnimationFrame;
    const nowSpy = vi.spyOn(performance, "now").mockImplementation(() => clock);
    window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
        queue.set(id, cb);
        return id++;
    }) as typeof window.requestAnimationFrame;
    window.cancelAnimationFrame = ((h: number) => {
        queue.delete(h);
    }) as typeof window.cancelAnimationFrame;
    const frame = (ms = 16) => {
        clock += ms;
        const cur = queue;
        queue = new Map();
        for (const cb of cur.values()) cb(clock);
    };
    const restore = () => {
        nowSpy.mockRestore();
        window.requestAnimationFrame = prevRaf;
        window.cancelAnimationFrame = prevCancel;
    };
    return { frame, restore };
}

/** The ball's fraction as `AnimationVisualizer` paints it: `effectiveT / duration`. */
const ballOf = (demo: ReturnType<typeof useSpringDemo>) =>
    demo.springEditAnim.effectiveT / demo.springEditAnim.options.duration;

beforeAll(async () => {
    await warmKfEngine();
});

describe("(1) the ribbon ball and the scrubber thumb read one effective time", () => {
    it("forward and under Reverse, frame for frame", () => {
        const clock = drivenClock();
        const machine = parkPausedOnSpring();
        const [demo, app] = withSetup(() => useSpringDemo());
        try {
            demo.play();
            expect(machine.status.value).toBe("playing");
            for (let i = 0; i < 40; i++) {
                clock.frame();
                expect(ballOf(demo), `forward frame ${i}`).toBeCloseTo(demo.scrubberPhase.value, 6);
            }
            demo.setReversed(true);
            expect(demo.springEditAnim.reversed).toBe(true);
            for (let i = 0; i < 60; i++) {
                clock.frame();
                expect(ballOf(demo), `reversed frame ${i}`).toBeCloseTo(demo.scrubberPhase.value, 6);
            }
        } finally {
            app.unmount();
            clock.restore();
        }
    });
});

describe("(2) a scrub under Reverse lands the thumb where the user put it", () => {
    it("the ribbon's RAW sliderUpdate.t is read back through the channel's direction", () => {
        const clock = drivenClock();
        const machine = parkPausedOnSpring();
        const [demo, app] = withSetup(() => useSpringDemo());
        try {
            demo.play();
            for (let i = 0; i < 40; i++) clock.frame();
            demo.setReversed(true);
            for (let i = 0; i < 10; i++) clock.frame();
            demo.pause();
            clock.frame();
            expect(machine.status.value).toBe("paused");

            const dur = demo.sweepLegMs.value;
            const from = demo.scrubberPhase.value;
            const wanted = Math.min(1, from + 0.05);
            // PlaybackRibbon.scrubTo — the one inversion, over the channel's flag.
            const rawT = demo.springEditAnim.reversed ? dur - wanted * dur : wanted * dur;
            // The scene's `onSliderUpdate` seam. Pre-cure, SpringScene read the RAW
            // time as the axis fraction (`demo.scrubTo(v.t / dur)`).
            const d = demo as { scrubToEngineT?: (t: number) => void };
            if (typeof d.scrubToEngineT === "function") d.scrubToEngineT(rawT);
            else demo.scrubTo(rawT / dur);

            expect(demo.scrubberPhase.value, "the thumb sits where the user put it").toBeCloseTo(wanted, 6);
            expect(ballOf(demo), "the ball sits with the thumb").toBeCloseTo(wanted, 6);
        } finally {
            app.unmount();
            clock.restore();
        }
    });
});
