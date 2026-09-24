import { describe, expect, it, vi } from "vitest";
import { computed, effectScope, ref, shallowRef } from "vue";
import type { AnimationGroup } from "@mkbabb/keyframes.js";
import { getStoredAnimationGroupControlOptions } from "@state";
import { useSceneMachineShellBinding } from "../../../demo/app/scene/useSceneMachineShellBinding";
import { HOME_SCENE_ID, sceneMap } from "../../../demo/app/scene/scenes";

// UIA-KF-004 (X.KF.W13V.u): home's transport lists the cube's channels (home
// renders the CubeScene backdrop), and a pick there is a navigate-to-cube
// intent. The pick lands in HOME's control bucket; the intercept that carries
// the user to cube must carry the pick with it, or cube plays its own stored
// channel (Rotations) and the choice is thrown away.
const bindHome = () => {
    const runSceneSwitch = vi.fn();
    const scope = effectScope();
    const binding = scope.run(() =>
        useSceneMachineShellBinding({
            sceneRef: shallowRef(null),
            currentSceneId: computed(() => HOME_SCENE_ID),
            currentSuperKey: computed(() => HOME_SCENE_ID),
            isHome: computed(() => true),
            currentAnimationGroup: shallowRef({
                animations: {},
            } as unknown as AnimationGroup<any>),
            autoPlayNext: ref(false),
            getRunSceneSwitch: () => runSceneSwitch,
        }),
    )!;
    return { binding, runSceneSwitch, stop: () => scope.stop() };
};

describe("home's channel pick survives the hop to cube (UIA-KF-004)", () => {
    const cubeKey = sceneMap.get("cube")!.superKey;

    it("a pick on home is the channel cube selects", () => {
        const home = getStoredAnimationGroupControlOptions(HOME_SCENE_ID);
        const cube = getStoredAnimationGroupControlOptions(cubeKey);
        cube.selectedAnimation = "Rotations";
        home.selectedAnimation = "Matrix";
        const { binding, runSceneSwitch, stop } = bindHome();

        binding.onPlayStateChange(true);

        expect(runSceneSwitch).toHaveBeenCalledWith("cube");
        expect(cube.selectedAnimation).toBe("Matrix");
        stop();
    });

    it("the pick is consumed: a later bare Play on home keeps cube's own selection", () => {
        const home = getStoredAnimationGroupControlOptions(HOME_SCENE_ID);
        const cube = getStoredAnimationGroupControlOptions(cubeKey);
        home.selectedAnimation = "Matrix";
        const { binding, stop } = bindHome();
        binding.onPlayStateChange(true);
        cube.selectedAnimation = "Hover";

        binding.onPlayStateChange(true);

        expect(cube.selectedAnimation).toBe("Hover");
        stop();
    });
});
