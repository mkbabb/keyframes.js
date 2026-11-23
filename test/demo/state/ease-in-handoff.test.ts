/**
 * An eased start hands the loop on without a held frame.
 *
 * `easeIn` walks a paused group's clock up to rate 1 over `EASE_IN_MS`, then
 * resumes the group. Every drawn frame from the last part of the ramp through
 * the first frames of the resumed loop must move the clock on by about the
 * frame's own time, read from what the frame painted on the target (the
 * clock's field runs one frame ahead once the walk seats the resume). The
 * ramp's last frame keeps the time past the ramp's end (it does not clamp to
 * the ramp's end), and the resumed loop's first frame moves on by one more
 * frame. A clock that stands still for a frame there reads as a hitch in the
 * die's spin right as it reaches speed.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { CSSKeyframesAnimation } from "../../../src/animation/engine";
import { AnimationGroup } from "../../../src/animation/group";
import { warmKfEngine } from "../../../demo/kf-engine";
import { createGroupAdapter, EASE_IN_MS } from "../../../demo/state/scenePlaybackAdapters";

/** 120 Hz, the rate the films ran at. */
const FRAME = 25 / 3;

beforeAll(async () => {
    await warmKfEngine();
});

/** One linear 5 s channel on opacity: the painted opacity × 5000 is the clock. */
const spinGroup = () => {
    const target = document.createElement("div");
    const a = new CSSKeyframesAnimation<{ opacity: number }>({
        duration: 5000,
        iterationCount: "infinite",
        timingFunction: "linear",
        useWAAPI: false,
    } as never).fromString(`from { opacity: 0; } to { opacity: 1; }`);
    a.name = "spin";
    a.setTargets(target);
    return { group: new AnimationGroup<any>(a), painted: () => Number(target.style.opacity) * 5000 };
};

describe("an eased start hands the loop on without a held frame", () => {
    let queue: FrameRequestCallback[];
    let now: number;
    const frame = () => {
        now += FRAME;
        const due = queue;
        queue = [];
        for (const cb of due) cb(now);
    };

    beforeEach(() => {
        queue = [];
        now = 1000;
        let id = 0;
        vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
            queue.push(cb);
            return ++id;
        });
        vi.stubGlobal("cancelAnimationFrame", () => {});
    });
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("every frame from the ramp's last fifth to the loop's tenth frame moves the clock on", () => {
        const { group, painted } = spinGroup();
        group.play();
        for (let i = 0; i < 30; i++) frame();
        group.pause();
        frame();

        const adapter = createGroupAdapter(() => group);
        adapter.easeIn?.(() => true);
        const askedAt = now;
        const drawn: Array<{ at: number; t: number }> = [];
        for (let i = 0; i < Math.ceil(EASE_IN_MS / FRAME) + 12; i++) {
            frame();
            drawn.push({ at: now - askedAt, t: painted() });
        }

        expect(group.paused).toBe(false);
        // Rate r(u) = 3u² − 2u³ is at least 0.9 from u = 0.8 on.
        const from = drawn.findIndex(({ at }) => at >= 0.8 * EASE_IN_MS);
        const steps = drawn.slice(from).map(({ at, t }, k, all) =>
            k === 0 ? null : { at, step: t - all[k - 1]!.t },
        ).filter((s): s is { at: number; step: number } => s !== null);
        expect(steps.length).toBeGreaterThan(10);
        for (const { at, step } of steps) {
            expect(step, `the clock's step in the frame at +${at.toFixed(1)} ms`).toBeGreaterThan(0.75 * FRAME);
            expect(step, `the clock's step in the frame at +${at.toFixed(1)} ms`).toBeLessThan(1.25 * FRAME);
        }
        group.stop();
    });
});
