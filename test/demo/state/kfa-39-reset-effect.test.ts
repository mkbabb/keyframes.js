// KF.W13X.r4state · KFA-39 — the scene machine's RESET had no effect arm.
//
// `applyEffects` switched on SCENE_READY/PLAY/PAUSE/RESUME only, so the dock's
// Reset (and R / Escape) on a raw-rAF scene (spring) reached the reducer and
// nothing else — the field never rewound. The cure is one RESET arm that drives
// the active scene through the `ScenePlayback` contract's `reset` member, which
// both adapters implement (the group adapter `stop()`s; the raw-rAF adapter
// forwards to the scene's own born-state body), and the dock's Reset dispatches
// that RESET.

import { beforeAll, describe, expect, it, vi } from "vitest";
import { CSSKeyframesAnimation } from "../../../src/animation/engine";
import { AnimationGroup } from "../../../src/animation/group";
import { warmKfEngine } from "../../../demo/kf-engine";
import type { ScenePlayback } from "../../../demo/state/sceneMachine";
import { useSceneMachine } from "../../../demo/state/useSceneMachine";
import {
    createGroupAdapter,
    createRafAdapter,
    type RafSceneHandle,
} from "../../../demo/state/scenePlaybackAdapters";
import { useAnimationGroupActions } from "../../../demo/components/instrument/transport/AnimationControlsGroup/useAnimationGroupActions";
import type { StoredAnimationGroupControlOptions } from "@state";

beforeAll(async () => {
    await warmKfEngine();
});

function makeGroup(): AnimationGroup<any> {
    const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
        "from { opacity: 0; } to { opacity: 1; }",
    );
    anim.name = "fade";
    anim.targets = [document.createElement("div")];
    return new AnimationGroup(anim as any);
}

const storedOptions = (): StoredAnimationGroupControlOptions => ({
    selectedControl: "controls",
    selectedAnimation: "fade",
    keyframeControls: {
        selectedKeyframesControl: "keyframes",
        dialogOpen: false,
        keyframes: "",
        addKeyframes: "",
    },
    isTimelineExpanded: false,
    isControlsPanelOpen: true,
});

/** A recording adapter (the contract, every member a spy). */
function spyAdapter() {
    return {
        snapshot: vi.fn(() => ({ playing: false, started: true, animations: {} })),
        restore: vi.fn(),
        suspend: vi.fn(),
        resume: vi.fn(),
        isPlaying: vi.fn(() => false),
        reset: vi.fn(),
    } satisfies ScenePlayback;
}

/** Put the global machine on `scene`, resting `playing` or `paused`. */
function onScene(scene: string, adapter: ScenePlayback, playing: boolean) {
    const machine = useSceneMachine();
    const release = machine.register(scene, adapter);
    machine.dispatch({ type: "NAVIGATE", to: scene });
    machine.dispatch({ type: "SCENE_READY" });
    if (playing) machine.dispatch({ type: "PLAY" });
    else machine.dispatch({ type: "PAUSE" });
    vi.mocked(adapter.resume).mockClear();
    vi.mocked(adapter.suspend).mockClear();
    return { machine, release };
}

describe("KFA-39 — RESET has an effect arm", () => {
    it("RESET drives the active scene's adapter reset, once", () => {
        const a = spyAdapter();
        const { machine, release } = onScene("kfa39-a", a, true);
        machine.dispatch({ type: "RESET" });
        expect(a.reset).toHaveBeenCalledTimes(1);
        expect(machine.status.value).toBe("paused");
        release();
    });

    it("the raw-rAF adapter forwards reset to the scene's handle", () => {
        const reset = vi.fn();
        const handle: RafSceneHandle = {
            getProgress: () => 0.5,
            setProgress: vi.fn(),
            getPlaying: () => true,
            setPlaying: vi.fn(),
            isLoopRunning: () => true,
            stopLoop: vi.fn(),
            startLoop: vi.fn(),
            reset,
        };
        createRafAdapter(handle).reset?.();
        expect(reset).toHaveBeenCalledTimes(1);
    });

    it("the group adapter's reset rewinds and halts the group", () => {
        const group = makeGroup();
        const anim = group.animations["fade"]!.animation;
        group.setChildTime(anim as any, 600).render();
        expect(anim.t).toBe(600);
        createGroupAdapter(() => group).reset?.();
        expect(anim.t).toBe(0);
        expect(group.started).toBe(false);
    });
});

describe("KFA-39 — the dock's Reset is the machine's RESET", () => {
    it("useAnimationGroupActions.reset drives the active scene's adapter reset", () => {
        const a = spyAdapter();
        const { release } = onScene("kfa39-dock", a, true);
        const group = makeGroup();
        const { reset } = useAnimationGroupActions({
            getGroup: () => group,
            storedControls: storedOptions(),
            findAnimationGroupObject: () => undefined,
            syncPlayState: vi.fn(),
        });
        reset();
        expect(a.reset).toHaveBeenCalledTimes(1);
        release();
    });
});
