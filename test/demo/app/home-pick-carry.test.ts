import { describe, expect, it, vi } from "vitest";
import { computed, effectScope, ref, shallowRef } from "vue";
import type { AnimationGroup } from "@mkbabb/keyframes.js";
import { getStoredAnimationGroupControlOptions, HOME_SCENE_ID } from "@state";
import { useSceneMachineShellBinding } from "../../../demo/app/scene/useSceneMachineShellBinding";
import { homeScene, sceneMap } from "../../../demo/app/scene/scenes";

// UIA-KF-004 (X.KF.W13V.u): home's transport lists the cube's channels (home
// renders the CubeScene backdrop), and a pick there is a navigate-to-cube
// intent: the cube must play the picked channel, or the choice is thrown away.
// X.KF.W13X.r4shell (KFA-22): home stores under the cube's key, so the pick
// is written straight into the bucket the cube selects from — the hop carries
// nothing, and a later bare Play keeps whatever the cube's selection is.
const bindHome = () => {
    const runSceneSwitch = vi.fn();
    const scope = effectScope();
    const binding = scope.run(() =>
        useSceneMachineShellBinding({
            sceneRef: shallowRef(null),
            currentSceneId: computed(() => HOME_SCENE_ID),
            currentSuperKey: computed(() => homeScene.superKey),
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
        const home = getStoredAnimationGroupControlOptions(homeScene.superKey);
        const cube = getStoredAnimationGroupControlOptions(cubeKey);
        cube.selectedAnimation = "Rotations";
        home.selectedAnimation = "Matrix";
        const { binding, runSceneSwitch, stop } = bindHome();

        binding.onPlayStateChange(true);

        expect(runSceneSwitch).toHaveBeenCalledWith("cube");
        expect(cube.selectedAnimation).toBe("Matrix");
        stop();
    });

    it("a later bare Play on home keeps cube's own selection", () => {
        const home = getStoredAnimationGroupControlOptions(homeScene.superKey);
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
