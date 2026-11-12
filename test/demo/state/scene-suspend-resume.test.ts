// SERVED MODEL: claude-opus-5-5
/**
 * owner-1112 (item 6, "the animation state should suspend and resume, fully
 * encapsulated per page") — a scene left mid-play resumes where it was.
 *
 * The witness drives the real scene machine and the real Amiga group (the
 * scene's own `useAmigaDemo`, through the shell's one group adapter) on a hand
 * frame queue, so every frame is an explicit act with its own timestamp:
 *
 *  (1) the Amiga plays for one second and is left for another scene, which
 *      plays for two; while away the Amiga's group runs no loop (no frame is
 *      queued for it, its clocks do not move), and the other scene's clock is
 *      its own;
 *  (2) the return mounts a FRESH group (a scene remounts on entry) and the
 *      restore seats each child within one frame of where it was left, still
 *      playing; the first frame after the return advances it by that frame,
 *      not by the time away;
 *  (3) a paused scene comes back paused at exactly its clock, and its paused
 *      state does not leak into the scene that was playing.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { CSSKeyframesAnimation } from "../../../src/animation/engine";
import { AnimationGroup } from "../../../src/animation/group";
import { warmKfEngine } from "../../../demo/kf-engine";
import { useSceneMachine } from "../../../demo/state/useSceneMachine";
import { createGroupAdapter } from "../../../demo/state/scenePlaybackAdapters";
import { useAmigaDemo } from "../../../demo/scenes/amiga/useAmigaDemo";

const FRAME = 1000 / 60;

beforeAll(async () => {
    await warmKfEngine();
});

/** The other scene: one infinite channel on a DOM target. */
const otherGroup = () => {
    const a = new CSSKeyframesAnimation<{ opacity: number }>({
        duration: 5000,
        iterationCount: "infinite",
        useWAAPI: false,
    } as never).fromString(`from { opacity: 0; } to { opacity: 1; }`);
    a.name = "fade";
    a.setTargets(document.createElement("div"));
    return new AnimationGroup<any>(a);
};

const clocks = (group: AnimationGroup<any>) =>
    Object.fromEntries(Object.entries(group.animations).map(([k, v]) => [k, v.animation.t]));

describe("owner-1112 item 6 — a scene suspends on leave and resumes where it was", () => {
    let queue: FrameRequestCallback[];
    let now: number;
    /** Run `n` frames: each queued callback once, at the next timestamp. */
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
    });
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("a playing scene resumes within one frame of where it was left, and runs nothing while away", () => {
        const machine = useSceneMachine();
        const AMIGA = "o1112-amiga";
        const OTHER = "o1112-other";

        // Enter the Amiga and play it for one second.
        let amiga = useAmigaDemo().animationGroup;
        let release = machine.register(AMIGA, createGroupAdapter(() => amiga));
        machine.dispatch({ type: "NAVIGATE", to: AMIGA });
        machine.dispatch({ type: "SCENE_READY" });
        machine.dispatch({ type: "PLAY" });
        frames(60);
        const left = clocks(amiga);
        expect(Object.values(left).every((t) => t > 900)).toBe(true);

        // Leave it: the machine captures and suspends it, the scene unmounts.
        machine.dispatch({ type: "NAVIGATE", to: OTHER });
        release();
        amiga.stop();
        const other = otherGroup();
        const releaseOther = machine.register(OTHER, createGroupAdapter(() => other));
        machine.dispatch({ type: "SCENE_READY" });
        machine.dispatch({ type: "PLAY" });
        const queuedWhileAway: number[] = [];
        for (let i = 0; i < 120; i++) {
            frames(1);
            queuedWhileAway.push(queue.length);
        }
        // Away: only the other scene's one loop is queued, frame after frame.
        expect(Math.max(...queuedWhileAway)).toBe(1);
        expect(other.animations.fade!.animation.t).toBeGreaterThan(1500);
        // The record of the Amiga is the clock it was left at.
        const record = machine.perScene.value[AMIGA]!;
        expect(record.playing).toBe(true);
        for (const [name, t] of Object.entries(left)) {
            expect(Math.abs(record.animations[name]!.t - t), name).toBeLessThanOrEqual(FRAME);
        }

        // Return: a fresh mount, a fresh group, the restore.
        machine.dispatch({ type: "NAVIGATE", to: AMIGA });
        releaseOther();
        other.stop();
        amiga = useAmigaDemo().animationGroup;
        release = machine.register(AMIGA, createGroupAdapter(() => amiga));
        machine.dispatch({ type: "SCENE_READY" });
        expect(machine.status.value).toBe("playing");
        const back = clocks(amiga);
        for (const [name, t] of Object.entries(left)) {
            expect(Math.abs(back[name]! - t), name).toBeLessThanOrEqual(FRAME);
        }
        // The first frames after the return advance it by those frames, never
        // by the two seconds away.
        frames(2);
        const after = clocks(amiga);
        for (const [name, t] of Object.entries(back)) {
            expect(after[name]! - t, name).toBeGreaterThanOrEqual(0);
            expect(after[name]! - t, name).toBeLessThanOrEqual(2 * FRAME + 0.5);
        }
        // The other scene's record is its own clock, not the Amiga's.
        expect(Object.keys(machine.perScene.value[OTHER]!.animations)).toEqual(["fade"]);
        release();
        amiga.stop();
    });

    it("a paused scene comes back paused at exactly its clock; a playing one stays playing", () => {
        const machine = useSceneMachine();
        const PAUSED = "o1112-paused";
        const PLAYING = "o1112-playing";

        let a = useAmigaDemo().animationGroup;
        let releaseA = machine.register(PAUSED, createGroupAdapter(() => a));
        machine.dispatch({ type: "NAVIGATE", to: PAUSED });
        machine.dispatch({ type: "SCENE_READY" });
        machine.dispatch({ type: "PLAY" });
        frames(45);
        machine.dispatch({ type: "PAUSE" });
        frames(3);
        const left = clocks(a);

        machine.dispatch({ type: "NAVIGATE", to: PLAYING });
        releaseA();
        a.stop();
        const b = otherGroup();
        const releaseB = machine.register(PLAYING, createGroupAdapter(() => b));
        machine.dispatch({ type: "SCENE_READY" });
        machine.dispatch({ type: "PLAY" });
        frames(30);
        expect(machine.status.value).toBe("playing");

        machine.dispatch({ type: "NAVIGATE", to: PAUSED });
        releaseB();
        b.stop();
        a = useAmigaDemo().animationGroup;
        releaseA = machine.register(PAUSED, createGroupAdapter(() => a));
        machine.dispatch({ type: "SCENE_READY" });
        expect(machine.status.value).toBe("paused");
        frames(10);
        expect(clocks(a)).toEqual(left);
        // ...and the scene that was playing kept its own intent.
        expect(machine.perScene.value[PLAYING]!.playing).toBe(true);
        releaseA();
        a.stop();
    });
});
