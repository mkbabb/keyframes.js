// KF.W13X.r4state · KFA-226 — a scrub was represented as a PAUSE.
//
// Scrub-start emitted PAUSE and scrub-end PLAY, so the play intent was written
// `false` for the length of the drag, and a pause pressed during the drag was
// indistinguishable from the scrub's own (and undone at release). The cure gives
// the scrub its own events (SCRUB_START / SCRUB_END) and its own machine fact
// (`scrubbing`): the scrub holds the loop; it never touches the play intent.

import { beforeAll, describe, expect, it, vi } from "vitest";
import { CSSKeyframesAnimation } from "../../../src/animation/engine";
import { AnimationGroup } from "../../../src/animation/group";
import { warmKfEngine } from "../../../demo/kf-engine";
import {
    transition,
    type MachineState,
    type ScenePlayback,
} from "../../../demo/state/sceneMachine";
import { useSceneMachine } from "../../../demo/state/useSceneMachine";
import { useAnimationGroupPlayback } from "../../../demo/components/instrument/transport/AnimationControlsGroup/useAnimationGroupPlayback";
import type { StoredAnimationGroupControlOptions } from "@state";

beforeAll(async () => {
    await warmKfEngine();
});

const at = (status: MachineState["status"], playing: boolean): MachineState => ({
    status,
    context: {
        activeScene: "spring",
        perScene: { spring: { playing, started: true, animations: {}, progress: 0.4 } },
    },
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

describe("KFA-226 — a scrub is not a PAUSE (the reducer)", () => {
    it("SCRUB_START while playing holds a scrub and KEEPS the play intent", () => {
        const next = transition(at("playing", true), { type: "SCRUB_START" });
        expect(next.scrubbing).toBe(true);
        expect(next.status).toBe("playing");
        expect(next.context.perScene["spring"]!.playing).toBe(true);
    });

    it("SCRUB_END returns to the intent the scrub never touched", () => {
        const held = transition(at("playing", true), { type: "SCRUB_START" });
        expect(held.scrubbing).toBe(true);
        const released = transition(held, { type: "SCRUB_END" });
        expect(released.scrubbing).toBeFalsy();
        expect(released.status).toBe("playing");
    });

    it("a PAUSE pressed during the scrub is the user's pause: it survives the release", () => {
        let s = transition(at("playing", true), { type: "SCRUB_START" });
        s = transition(s, { type: "PAUSE" });
        expect(s.scrubbing).toBe(true); // still dragging
        expect(s.context.perScene["spring"]!.playing).toBe(false);
        s = transition(s, { type: "SCRUB_END" });
        expect(s.status).toBe("paused");
        expect(s.scrubbing).toBeFalsy();
    });

    it("a SCRUB during the hold records t and keeps the hold", () => {
        let s = transition(at("paused", false), { type: "SCRUB_START" });
        s = transition(s, { type: "SCRUB", t: 0.7 });
        expect(s.scrubbing).toBe(true);
        expect(s.context.perScene["spring"]!.progress).toBe(0.7);
    });
});

describe("KFA-226 — a scrub is not a PAUSE (the effect layer)", () => {
    it("SCRUB_START holds the playing loop; SCRUB_END resumes it once, from the released position", () => {
        const a = spyAdapter();
        const { machine, release } = onScene("kfa226-a", a, true);
        machine.dispatch({ type: "SCRUB_START" });
        expect(a.suspend).toHaveBeenCalledTimes(1);
        expect(machine.status.value).toBe("playing"); // the intent reads Pause
        expect(machine.perScene.value["kfa226-a"]!.playing).toBe(true);
        machine.dispatch({ type: "SCRUB_END" });
        expect(a.resume).toHaveBeenCalledTimes(1);
        release();
    });

    it("a PLAY during a paused scrub records the intent but never resumes mid-drag", () => {
        const a = spyAdapter();
        const { machine, release } = onScene("kfa226-b", a, false);
        machine.dispatch({ type: "SCRUB_START" });
        machine.dispatch({ type: "PLAY" });
        expect(a.resume).not.toHaveBeenCalled();
        machine.dispatch({ type: "SCRUB_END" });
        expect(a.resume).toHaveBeenCalledTimes(1);
        release();
    });

    it("a PAUSE during a playing scrub is not undone by the release", () => {
        const a = spyAdapter();
        const { machine, release } = onScene("kfa226-c", a, true);
        machine.dispatch({ type: "SCRUB_START" });
        expect(machine.machine.value.scrubbing).toBe(true);
        machine.dispatch({ type: "PAUSE" });
        machine.dispatch({ type: "SCRUB_END" });
        expect(a.resume).not.toHaveBeenCalled();
        expect(machine.status.value).toBe("paused");
        release();
    });
});

describe("KFA-226 — the group transport's scrub seam dispatches the scrub, not a pause", () => {
    it("onScrubStart / onScrubEnd never emit a play-state change while playing", () => {
        const a = spyAdapter();
        const { machine, release } = onScene("kfa226-d", a, true);
        const group = makeGroup();
        const emit = vi.fn();
        const { onScrubStart, onScrubEnd } = useAnimationGroupPlayback(
            () => group,
            storedOptions(),
            emit,
        );
        onScrubStart();
        expect(emit).not.toHaveBeenCalledWith("playStateChange", false);
        expect(machine.machine.value.scrubbing).toBe(true);
        expect(machine.perScene.value["kfa226-d"]!.playing).toBe(true);
        onScrubEnd();
        expect(emit).not.toHaveBeenCalled();
        expect(machine.machine.value.scrubbing).toBeFalsy();
        expect(a.resume).toHaveBeenCalledTimes(1);
        release();
    });
});
