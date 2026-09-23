/**
 * The cube's motion DATA — its channel names and its spin keyframes — declared
 * once and read by both the scene (`useCubeDemo`) and its dock miniature
 * (`CubeMini.vue`, KF.W13U.d2 / OA-32), so the icon turns by the very
 * keyframes the stage plays. A light module on purpose: the dock imports it
 * statically, so it carries no scene runtime.
 */
import {
    cssVariable,
    numberValue,
    transformCall,
    transformList,
} from "./matrix-editor/transformMath";

export const CUBE_ANIMATION_NAMES = {
    Matrix: "Matrix",
    Rotations: "Rotations",
    Hover: "Hover",
} as const;

/** The Rotations channel: one full turn about Y, one about Z, and X to the
 *  element's `--rotationX` (declared on `.cube`). */
export const cubeSpinKeyframes = () => ({
    from: {
        transform: transformList(
            transformCall("rotateX", numberValue(0, "deg")),
            transformCall("rotateY", numberValue(0, "turn")),
            transformCall("rotateZ", numberValue(0, "deg")),
        ),
    },
    "100%": {
        transform: transformList(
            transformCall("rotateX", cssVariable("--rotationX")),
            transformCall("rotateY", numberValue(1, "turn")),
            transformCall("rotateZ", numberValue(360, "deg")),
        ),
    },
});
