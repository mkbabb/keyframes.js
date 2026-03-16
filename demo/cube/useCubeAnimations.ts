import { markRaw, shallowRef } from "vue";
import type { Ref } from "vue";
import { CSSKeyframesAnimation } from "@src/animation/index";
import { AnimationGroup } from "@src/animation/group";
import { FunctionValue } from "@src/units";
import { ValueUnit } from "@src/units";
import * as animations from "@src/animation/animations";
import { getStoredAnimationOptions } from "@components/custom/animation-controls/animationStores";

export const SUPER_KEY = "Cube";

export const CUBE_ANIMATION_NAMES = {
    Matrix: CUBE_ANIMATION_NAMES.Matrix,
    Rotations: CUBE_ANIMATION_NAMES.Rotations,
    Hover: CUBE_ANIMATION_NAMES.Hover,
} as const;

export function useCubeAnimations(
    matrix3dStart: Ref<FunctionValue>,
    matrix3dEnd: Ref<FunctionValue>,
) {
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
        markRaw(animations.hover(hoverAnimationOptions.animationOptions)),
    );
    hoverAnim.value.name = CUBE_ANIMATION_NAMES.Hover;
    hoverAnim.value.superKey = SUPER_KEY;

    const animationGroup = shallowRef(
        markRaw(
            new AnimationGroup(
                rotationAnim.value as any,
                matrixAnim.value as any,
                hoverAnim.value as any,
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

    return {
        matrixAnim,
        rotationAnim,
        hoverAnim,
        animationGroup,
        changeGraphPerspectiveAnim,
        setTargets,
    };
}
