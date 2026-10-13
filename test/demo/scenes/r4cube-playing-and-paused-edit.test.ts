// SERVED MODEL: claude-opus-5-5
// @vitest-environment jsdom
/**
 * X.KF.W13X.r4cube — the R-4 cube row (value.js KF-W13.md addendum (g)).
 *
 * KFA-131 — the die's compositor promotion (`.idle-hover.playing .cube {
 * will-change: transform }`, CubeTarget.css) rides the `playing` class, which
 * CubeTarget binds from CubeScene's `isPlaying`. That flag had no writer (a
 * bare `ref(false)`), so the class never appeared. Its one writer is the scene
 * machine: the class follows PLAY and PAUSE through the REAL CubeScene.
 *
 * MATRIX-PAUSED-EDIT-UNPAINTED — with the group started and PAUSED, a Matrix
 * cell edit (the editor's own `onUpdateMatrixCell` intent) and a Reset reach
 * the channel through `adoptCompiled`, which re-keys the animation without
 * painting it; the pre-start painter refuses once the group is started (one
 * writer per element, KFA-2). So the die held its pose while the digits
 * moved. The paused channel must be repainted at its own playhead, and the
 * edit must not resume playback.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import type { VNode } from "vue";
import { mount } from "@vue/test-utils";
import { warmKfEngine } from "../../../demo/kf-engine";
import { useSceneMachine } from "../../../demo/state";
import CubeScene from "../../../demo/scenes/cube/CubeScene.vue";
import { CUBE_SCENE_ID } from "../../../demo/scenes/cube/cubeKeys";
import { CUBE_ANIMATION_NAMES } from "../../../demo/scenes/cube/cubeMotion";

// ── a controllable rAF queue (the square-w13x idiom) ───────────────────────
let queue = new Map<number, FrameRequestCallback>();
let nextId = 1;
let clock = 0;
let prevRaf: typeof window.requestAnimationFrame;
let prevCancel: typeof window.cancelAnimationFrame;
const flush = (n = 1): void => {
    for (let i = 0; i < n; i++) {
        clock += 16;
        const current = queue;
        queue = new Map();
        for (const cb of current.values()) cb(clock);
    }
};

interface Facility {
    playback: Parameters<ReturnType<typeof useSceneMachine>["register"]>[1];
    group: {
        started: boolean;
        paused: boolean;
        stop(): void;
        animations: Record<string, { animation: { t: number } }>;
    };
}
interface Exposed {
    facility: Facility;
    tabsContent: () => VNode;
}

beforeAll(async () => {
    await warmKfEngine();
}, 60_000);

describe("X.KF.W13X.r4cube — the cube's playing state and the paused matrix edit", () => {
    let wrapper: ReturnType<typeof mount>;
    let exposed: Exposed;
    let release: () => void = () => {};

    beforeEach(async () => {
        queue = new Map();
        clock = 1000;
        prevRaf = window.requestAnimationFrame;
        prevCancel = window.cancelAnimationFrame;
        window.requestAnimationFrame = (cb: FrameRequestCallback) => {
            const id = nextId++;
            queue.set(id, cb);
            return id;
        };
        window.cancelAnimationFrame = (id: number) => {
            queue.delete(id);
        };
        wrapper = mount(CubeScene, { attachTo: document.body });
        await nextTick();
        exposed = wrapper.vm as unknown as Exposed;
    });
    afterEach(() => {
        release();
        exposed.facility.group.stop();
        wrapper.unmount();
        useSceneMachine().dispatch({ type: "PAUSE" });
        window.requestAnimationFrame = prevRaf;
        window.cancelAnimationFrame = prevCancel;
    });

    /** The App's lifecycle: the scene's adapter registered on the machine
     *  (the one path to the group), then PLAY, then ~1 s of frames. */
    const play = async () => {
        const machine = useSceneMachine();
        release = machine.register(CUBE_SCENE_ID, exposed.facility.playback);
        machine.dispatch({ type: "NAVIGATE", to: CUBE_SCENE_ID });
        machine.dispatch({ type: "SCENE_READY" });
        machine.dispatch({ type: "PAUSE" }); // a known edge: the singleton may rest on "playing"
        machine.dispatch({ type: "PLAY" });
        await nextTick();
        flush(60);
        await nextTick();
    };
    const pause = async () => {
        useSceneMachine().dispatch({ type: "PAUSE" });
        await nextTick();
        flush(2);
        await nextTick();
    };
    const rollClasses = () => wrapper.find(".idle-hover").classes();
    const pose = () => (wrapper.find(".cube-pose").element as HTMLElement).style.transform;

    it("KFA-131 — the `playing` class follows the machine: present while playing, gone once paused, back on resume", async () => {
        expect(rollClasses()).not.toContain("playing");
        await play();
        expect(exposed.facility.group.started && !exposed.facility.group.paused).toBe(true);
        expect(rollClasses()).toContain("playing");
        await pause();
        expect(rollClasses()).not.toContain("playing");
        useSceneMachine().dispatch({ type: "PLAY" });
        await nextTick();
        expect(rollClasses()).toContain("playing");
    });

    it("MATRIX-PAUSED-EDIT-UNPAINTED — a cell edit while paused moves the die, at the channel's own playhead, and does not resume", async () => {
        await play();
        await pause();
        const group = exposed.facility.group;
        expect(group.started && group.paused).toBe(true);
        // precondition: the Matrix channel sits past its start, so its pose depends on the endpoint
        expect(group.animations[CUBE_ANIMATION_NAMES.Matrix]!.animation.t).toBeGreaterThan(0);
        const before = pose();
        expect(before).toMatch(/matrix3d\(/);

        const editor = exposed.tabsContent();
        const props = editor.props as { onUpdateMatrixCell: (to: number, ix: number) => void };
        props.onUpdateMatrixCell(1.5, 0);
        for (let i = 0; i < 40; i++) {
            flush();
            await nextTick();
        }
        expect(pose()).not.toBe(before);
        expect(group.paused).toBe(true);
        expect(useSceneMachine().status.value).toBe("paused");
    });

    it("MATRIX-PAUSED-EDIT-UNPAINTED — a Reset while paused moves the die and does not resume", async () => {
        await play();
        await pause();
        const editor = exposed.tabsContent();
        const props = editor.props as {
            onUpdateMatrixCell: (to: number, ix: number) => void;
            onResetMatrix: () => void;
        };
        props.onUpdateMatrixCell(2, 0);
        for (let i = 0; i < 40; i++) {
            flush();
            await nextTick();
        }
        const edited = pose();
        props.onResetMatrix();
        for (let i = 0; i < 60; i++) {
            flush();
            await nextTick();
        }
        expect(pose()).not.toBe(edited);
        expect(exposed.facility.group.paused).toBe(true);
        expect(useSceneMachine().status.value).toBe("paused");
        // the paused repaint leaves the group resumable: PLAY picks it back up
        useSceneMachine().dispatch({ type: "PLAY" });
        await nextTick();
        expect(exposed.facility.group.paused).toBe(false);
        expect(rollClasses()).toContain("playing");
    });
});
