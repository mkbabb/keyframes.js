// proof:no-shadow-playback-authority — T.B8 (lane 30 rec 1), the vitest half.
//
// The grep clause (scripts/proof-no-shadow-playback-authority.mjs) proves NO file
// outside createGroupAdapter / the scene-owned loops drives a group's play/pause
// axis. THIS suite proves the second half of the sweep: the group-scene SCRUB
// PERSISTENCE gap is closed. Before T.B8 the group scenes (cube/amiga/square)
// never dispatched SCRUB — `sliderUpdate` only did the local `setChildTime`, so
// the scrubbed playhead persisted COARSELY, refreshed onto the machine snapshot
// only at `captureActive()` (a NAVIGATE-away / SUSPEND). A scrub-then-reload with
// no navigation lost it. Now `sliderUpdate` dispatches SCRUB, recording the
// playhead onto the machine snapshot immediately — WITHOUT a NAVIGATE between.
//
// BITE: reds the instant `sliderUpdate` stops dispatching SCRUB (the scrub is not
// persisted without a leave) — the exact pre-T.B8 gap. Greens on the cure.

import { beforeAll, describe, expect, it, vi } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { AnimationGroup } from "../../src/animation/group";
import { warmKfEngine } from "../../demo/@/utils/kfEngine";
import { useSceneMachine } from "../../demo/@/state/useSceneMachine";
import { createGroupAdapter } from "../../demo/@/state/scenePlaybackAdapters";
import { useAnimationGroupPlayback } from "../../demo/@/components/custom/animation-transport/composables/useAnimationGroupPlayback";
import type { StoredAnimationGroupControlOptions } from "@state";

// The demo composables read the HEAVY engine surface synchronously via the warmed
// `kfEngine()`; the unit harness has no app boot, so warm it once.
beforeAll(async () => {
    await warmKfEngine();
});

const storedOptions = (
    over: Partial<StoredAnimationGroupControlOptions> = {},
): StoredAnimationGroupControlOptions => ({
    selectedControl: "controls",
    selectedAnimation: "",
    selectedKeyframesControl: "string",
    isTimelineExpanded: false,
    isControlsPanelOpen: true,
    ...over,
});

/** A cube-style group with one named, target-attached animation. */
function makeCubeGroup(): AnimationGroup<any> {
    const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
        from { opacity: 0; }
        to { opacity: 1; }
    `);
    a.name = "spin";
    a.targets = [document.createElement("div")];
    return new AnimationGroup(a as any);
}

describe("proof:no-shadow-playback-authority — group-scene scrub persistence (T.B8)", () => {
    it("a cube scrub with NO play/pause bracket records the playhead onto the machine snapshot WITHOUT a NAVIGATE", () => {
        const machine = useSceneMachine();
        const group = makeCubeGroup();

        // Register the group adapter for 'cube' (the App's bindSceneAdapter path)
        // and drive the machine onto cube.
        const release = machine.register("cube", createGroupAdapter(() => group));
        machine.dispatch({ type: "NAVIGATE", to: "cube" });
        machine.dispatch({ type: "SCENE_READY" });

        // Populate the cube snapshot's per-animation clocks the way a returning
        // user's session would: a NAVIGATE-away runs captureActive() →
        // adapter.snapshot() → perScene.cube.animations = { spin: {...} }, then
        // navigate back. (This is the ONLY setup NAVIGATE; the scrub below has NO
        // navigation after it — that is the invariant under test.)
        machine.dispatch({ type: "NAVIGATE", to: "home" });
        machine.dispatch({ type: "NAVIGATE", to: "cube" });
        machine.dispatch({ type: "SCENE_READY" });
        expect(
            Object.keys(machine.perScene.value["cube"]!.animations),
        ).toContain("spin");

        // THE SCRUB — no play/pause bracket, no NAVIGATE/SUSPEND after it.
        const emit = vi.fn();
        const anim = group.animations["spin"]!.animation;
        const { sliderUpdate } = useAnimationGroupPlayback(
            () => group,
            storedOptions({ selectedAnimation: "spin" }),
            emit,
        );
        sliderUpdate({ t: 555, animation: anim as any });

        // The scrubbed playhead is recorded onto BOTH the per-animation clock and
        // the progress scalar — WITHOUT a NAVIGATE/SUSPEND capture (the pre-T.B8
        // group scenes refreshed `t` only at captureActive()).
        expect(machine.perScene.value["cube"]!.animations["spin"]!.t).toBe(555);
        expect(machine.perScene.value["cube"]!.progress).toBe(555);

        release();
    });

    it("sliderUpdate still moves the child clock (the per-child setChildTime scrub is preserved)", () => {
        const group = makeCubeGroup();
        const anim = group.animations["spin"]!.animation;
        const emit = vi.fn();
        const { sliderUpdate } = useAnimationGroupPlayback(
            () => group,
            storedOptions({ selectedAnimation: "spin" }),
            emit,
        );
        sliderUpdate({ t: 300, animation: anim as any });
        expect(anim.t).toBe(300);
    });
});
