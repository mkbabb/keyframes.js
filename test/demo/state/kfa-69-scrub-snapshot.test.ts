// SERVED MODEL: claude-opus-5-5
// KF.W13X.r3res · KFA-69's machine record (R-3).
//
// A scrub of one channel is a SEEK of the group (`76531255`, `5ce04f9d`): every
// child lands at its own phase of one master time. The machine's SCRUB record
// then wrote the selected child's one `t` onto EVERY child's snapshot, so the
// persisted record disagreed with the paint, and a reload (SCENE_READY →
// restore) re-seated every sibling at that one `t`: out of phase again, with
// each sibling's stale `iteration` / `reversed` beside it. The record is the
// group's own post-seek clocks, read through the ScenePlayback contract.

import { beforeAll, describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../../src/animation/engine";
import { AnimationGroup } from "../../../src/animation/group";
import { warmKfEngine } from "../../../demo/kf-engine";
import { useSceneMachine } from "../../../demo/state/useSceneMachine";
import {
    createGroupAdapter,
    restoreGroupPlaybackState,
} from "../../../demo/state/scenePlaybackAdapters";

beforeAll(async () => {
    await warmKfEngine();
});

const channel = (name: string, duration: number, direction = "normal") => {
    const a = new CSSKeyframesAnimation<{ opacity: number }>({
        duration,
        iterationCount: "infinite",
        direction,
        useWAAPI: false,
    } as never).fromString(`from { opacity: 0; } to { opacity: 1; }`);
    a.name = name;
    a.setTargets(document.createElement("div"));
    return a;
};

/** The amiga-shaped group: three phase-locked children of unequal periods. */
const makeGroup = () =>
    new AnimationGroup<any>(
        channel("spin", 1550),
        channel("x", 2400, "alternate"),
        channel("y", 3367, "alternate"),
    );

/** The transport's scrub, as `useAnimationGroupPlayback.sliderUpdate` runs it. */
function scrubChild(
    machine: ReturnType<typeof useSceneMachine>,
    group: AnimationGroup<any>,
    name: string,
    t: number,
) {
    const animation = group.animations[name]!.animation;
    group.seek(group.elapsedOf(animation) - animation.t + t).render();
    machine.dispatch({ type: "SCRUB", t });
}

describe("KFA-69 — the SCRUB record is the group's own clocks", () => {
    it("each child's snapshot holds its own phase after a scrub of one child", () => {
        const group = makeGroup();
        const machine = useSceneMachine();
        const release = machine.register("kfa69-scrub", createGroupAdapter(() => group));
        machine.dispatch({ type: "NAVIGATE", to: "kfa69-scrub" });
        machine.dispatch({ type: "SCENE_READY" });
        machine.dispatch({ type: "PAUSE" });

        group.seek(3000).render();
        scrubChild(machine, group, "x", 1000);

        const live = createGroupAdapter(() => group).snapshot().animations;
        const record = machine.perScene.value["kfa69-scrub"]!.animations;
        for (const name of ["spin", "x", "y"]) {
            expect(record[name], name).toEqual(live[name]);
        }
        // the three phases differ; the former record held 1000 for all three
        expect(new Set(["spin", "x", "y"].map((n) => record[n]!.t)).size).toBe(3);
        release();
    });

    it("a restore from the record re-seats the siblings in phase", () => {
        const group = makeGroup();
        const machine = useSceneMachine();
        const release = machine.register("kfa69-restore", createGroupAdapter(() => group));
        machine.dispatch({ type: "NAVIGATE", to: "kfa69-restore" });
        machine.dispatch({ type: "SCENE_READY" });
        machine.dispatch({ type: "PAUSE" });

        group.seek(5000).render();
        scrubChild(machine, group, "spin", 400);
        const master = group.elapsedOf("spin");

        const reloaded = makeGroup();
        restoreGroupPlaybackState(reloaded, machine.perScene.value["kfa69-restore"]! as never);
        for (const name of ["spin", "x", "y"]) {
            expect(reloaded.elapsedOf(name), name).toBeCloseTo(master, 6);
        }
        release();
    });
});
