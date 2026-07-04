import { FunctionValue, ValueUnit } from "@mkbabb/value.js";
import { markRaw, shallowRef } from "vue";
import type { Ref } from "vue";
import { kfEngine } from "@utils/kfEngine";
import { getStoredAnimationOptions } from "@state";
import { useSceneVisibilityPause } from "@app/runtime/useSceneVisibilityPause";
import { CUBE_SUPER_KEY } from "./cubeKeys";

// S.D2 S5 (a10) — the superKey now single-sources from `cubeKeys.ts` (8/8 scene
// parity); this re-export keeps the existing `SUPER_KEY` consumers (CubeScene +
// this module's 8 internal uses) unchanged.
export const SUPER_KEY = CUBE_SUPER_KEY;

export const CUBE_ANIMATION_NAMES = {
    Matrix: "Matrix",
    Rotations: "Rotations",
    Hover: "Hover",
} as const;

export function useCubeDemo(
    matrix3dStart: Ref<FunctionValue>,
    matrix3dEnd: Ref<FunctionValue>,
) {
    // HEAVY surface from the warmed engine (kfEngine(), L.W8 S1 dogfood inversion)
    // — synchronous, since the warm resolves before any scene mounts. `presets`
    // is the barrel's preset namespace (the old `* as animations` deep import).
    const { CSSKeyframesAnimation, AnimationGroup, presets } = kfEngine();

    const matrixAnimationOptions = getStoredAnimationOptions(
        CUBE_ANIMATION_NAMES.Matrix,
        SUPER_KEY,
    );

    const matrixAnim = shallowRef(
        markRaw(
            new CSSKeyframesAnimation(
                matrixAnimationOptions.animationOptions,
            ).fromVars([
                { transform: { matrix3d: matrix3dStart.value } },
                { transform: { matrix3d: matrix3dEnd.value } },
            ]),
        ),
    );
    matrixAnim.value.name = CUBE_ANIMATION_NAMES.Matrix;
    matrixAnim.value.superKey = SUPER_KEY;

    const rotationAnimationOptions = getStoredAnimationOptions(
        CUBE_ANIMATION_NAMES.Rotations,
        SUPER_KEY,
    );

    const rotationAnim = shallowRef(
        markRaw(
            new CSSKeyframesAnimation(
                rotationAnimationOptions.animationOptions,
            ).fromKeyframes({
                from: {
                    transform: {
                        rotateX: "0deg",
                        rotateY: "0turn",
                        rotateZ: "0deg",
                    },
                },
                "100%": {
                    transform: {
                        rotateX: new ValueUnit("--rotationX", "var"),
                        rotateY: "1turn",
                        rotateZ: "360deg",
                    },
                },
            }),
        ),
    );
    rotationAnim.value.name = CUBE_ANIMATION_NAMES.Rotations;
    rotationAnim.value.superKey = SUPER_KEY;

    const hoverAnimationOptions = getStoredAnimationOptions(
        CUBE_ANIMATION_NAMES.Hover,
        SUPER_KEY,
    );

    const hoverAnim = shallowRef(
        markRaw(presets.hover(hoverAnimationOptions.animationOptions)),
    );
    hoverAnim.value.name = CUBE_ANIMATION_NAMES.Hover;
    hoverAnim.value.superKey = SUPER_KEY;

    const animationGroup = shallowRef(
        markRaw(
            new AnimationGroup(
                rotationAnim.value,
                matrixAnim.value,
                hoverAnim.value,
            ),
        ),
    );

    const changeGraphPerspectiveAnim = new CSSKeyframesAnimation({
        duration: 700,
        timingFunction: "easeInBounce",
    }).fromVars([
        { transform: { rotate3d: "0, 0, 0, 0deg" } },
        { transform: { rotate3d: "-1, 1, 0, 30deg" } },
    ]);

    const setTargets = (cubeEl: HTMLElement, graphEl: HTMLElement) => {
        rotationAnim.value.setTargets(cubeEl);
        matrixAnim.value.setTargets(cubeEl);
        hoverAnim.value.setTargets(cubeEl);
        changeGraphPerspectiveAnim.setTargets(graphEl);
        changeGraphPerspectiveAnim.play();
    };

    // B-3: pause the cube's engine draw loop while the tab is hidden. The group
    // owns its rAF; `pause()` records each child's `pausedTime` and `resume()`
    // re-bases `startTime` so `effectiveT` stays continuous — no forward jump on
    // return. Only resumes what the hide auto-paused (a user-paused cube stays
    // paused).
    useSceneVisibilityPause(
        () => animationGroup.value.playing(),
        () => animationGroup.value.pause(),
        () => animationGroup.value.resume(),
    );

    return {
        matrixAnim,
        rotationAnim,
        hoverAnim,
        animationGroup,
        changeGraphPerspectiveAnim,
        setTargets,
    };
}
