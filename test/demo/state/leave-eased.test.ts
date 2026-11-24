/**
 * FORTY-SIXTH E1 — leaving the cube for Home stops the spin by the eased stop.
 *
 * Home is the cube's own page (one mounted scene), so the spin stays in view
 * across the hop, and it stopped there in one frame (72 to 0°/s). The witness
 * drives the real scene machine and a real group through the shell's one group
 * adapter on a hand frame queue, the painted clock read off the target:
 *
 *  (1) a NAVIGATE that `stays` brings the loop to rest over EASE_OUT_MS: the
 *      first frame after the leave still moves on by about a frame, each step
 *      after it is no longer than the one before, and from the ramp's end the
 *      clock stands, with no frame queued for it;
 *  (2) the record the machine keeps is the clock the loop came to rest at, with
 *      the play intent it had, so a return restores the pose the page showed;
 *  (3) a NAVIGATE that does not stay (a scene that unmounts) still stops the
 *      loop in the frame it is left, its record the clock it was left at;
 *  (4) a stall after the leave (the swap's update holds the frames: 150 ms at
 *      4x CPU) does not eat the ramp: the first frame drawn after it moves on
 *      by about one frame, and the ramp is drawn over the frames after.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { CSSKeyframesAnimation } from "../../../src/animation/engine";
import { AnimationGroup } from "../../../src/animation/group";
import { warmKfEngine } from "../../../demo/kf-engine";
import { useSceneMachine } from "../../../demo/state/useSceneMachine";
import { createGroupAdapter, EASE_IN_MS, EASE_OUT_MS } from "../../../demo/state/scenePlaybackAdapters";

const FRAME = 1000 / 60;

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

describe("FORTY-SIXTH E1 — a leave that stays in view comes to rest by the eased stop", () => {
    let queue: FrameRequestCallback[];
    let now: number;
    const frames = (n: number) => {
        for (let i = 0; i < n; i++) {
            now += FRAME;
            const due = queue;
            queue = [];
            for (const cb of due) cb(now);
        }
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
        // The walks start on the document's frame clock, at the frame they are
        // asked in.
        Object.defineProperty(document, "timeline", { configurable: true, value: { get currentTime() { return now; } } });
    });
    afterEach(() => {
        vi.unstubAllGlobals();
        delete (document as { timeline?: unknown }).timeline;
    });

    /** Enter `id`, play it past its eased start, and return its group. */
    const playing = (machine: ReturnType<typeof useSceneMachine>, id: string) => {
        const spin = spinGroup();
        const release = machine.register(id, createGroupAdapter(() => spin.group));
        machine.dispatch({ type: "NAVIGATE", to: id });
        machine.dispatch({ type: "SCENE_READY" });
        machine.dispatch({ type: "PLAY" });
        frames(Math.ceil((EASE_IN_MS + 500) / FRAME));
        expect(spin.group.paused).toBe(false);
        return { ...spin, release };
    };

    it("the spin slows to rest over the ramp, and the record is where it rests, still meaning to play", () => {
        const machine = useSceneMachine();
        const CUBE = "e1-leave-cube";
        const HOME = "e1-leave-home";
        const { group, painted, release } = playing(machine, CUBE);
        frames(1);
        const before = painted();
        frames(1);
        const fullStep = painted() - before;
        expect(fullStep).toBeCloseTo(FRAME, 0);

        machine.dispatch({ type: "NAVIGATE", to: HOME, stays: true });
        const drawn: number[] = [painted()];
        for (let i = 0; i < Math.ceil(EASE_OUT_MS / FRAME) + 6; i++) {
            frames(1);
            drawn.push(painted());
        }
        const steps = drawn.slice(1).map((t, k) => t - drawn[k]!);
        // Never a stop in one frame: the first frame on still moves by most of
        // a frame's time at full speed.
        expect(steps[0], "the first frame after the leave").toBeGreaterThan(0.75 * fullStep);
        // Then it slows: no step is longer than the one before it.
        for (let k = 1; k < steps.length; k++) {
            expect(steps[k]!, `step ${k} (${steps.map((s) => s.toFixed(2)).join(", ")})`).toBeLessThanOrEqual(steps[k - 1]! + 1e-6);
        }
        // It comes to rest at the ramp's end and stands: half the ramp's time
        // covered (the rate falls 1 → 0 on a smoothstep), no frame queued.
        const restAt = Math.ceil(EASE_OUT_MS / FRAME);
        expect(steps.slice(restAt).every((s) => Math.abs(s) < 1e-6), "standing after the ramp").toBe(true);
        expect(drawn.at(-1)! - drawn[0]!).toBeCloseTo(EASE_OUT_MS / 2, 0);
        expect(queue.length, "frames queued once at rest").toBe(0);
        expect(group.paused).toBe(true);

        // The record is the clock it rests at, with the play intent it had.
        const record = machine.perScene.value[CUBE]!;
        expect(record.playing).toBe(true);
        expect(record.animations.spin!.t).toBeCloseTo(group.animations.spin!.animation.t, 6);
        expect(record.animations.spin!.t).toBeCloseTo(drawn.at(-1)! % 5000, 0);
        release();
        group.stop();
    });

    it("a stall after the leave does not eat the ramp", () => {
        const machine = useSceneMachine();
        const CUBE = "e1-stall-cube";
        const HOME = "e1-stall-home";
        const { group, painted, release } = playing(machine, CUBE);
        machine.dispatch({ type: "NAVIGATE", to: HOME, stays: true });
        const drawn: number[] = [painted()];
        now += 150;
        for (let i = 0; i < Math.ceil(EASE_OUT_MS / FRAME) + 4; i++) {
            frames(1);
            drawn.push(painted());
        }
        const steps = drawn.slice(1).map((t, k) => t - drawn[k]!);
        const label = steps.map((x) => x.toFixed(2)).join(", ");
        expect(steps[0], `the first frame after the stall (${label})`).toBeGreaterThan(0.75 * FRAME);
        expect(steps[0], `the first frame after the stall (${label})`).toBeLessThan(1.05 * FRAME);
        expect(steps.filter((x) => x > 1e-6).length, `frames that move (${label})`).toBeGreaterThanOrEqual(5);
        expect(drawn.at(-1)! - drawn[0]!).toBeCloseTo(EASE_OUT_MS / 2, 0);
        release();
        group.stop();
    });

    it("a leave that does not stay stops the loop in the frame it is left", () => {
        const machine = useSceneMachine();
        const AMIGA = "e1-leave-amiga";
        const OTHER = "e1-leave-other";
        const { group, painted, release } = playing(machine, AMIGA);
        const left = group.animations.spin!.animation.t;
        machine.dispatch({ type: "NAVIGATE", to: OTHER });
        const at = painted();
        frames(4);
        expect(painted()).toBe(at);
        expect(machine.perScene.value[AMIGA]!.animations.spin!.t).toBeCloseTo(left, 6);
        release();
        group.stop();
    });
});
