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

/** The custom property the Rotations channel's `100%` frame reads through
 *  `var(--rotationX)` — the cube's authored demonstration of `var()` in
 *  keyframes. Every spin element (the scene's `.cube`, the dock miniature's
 *  die) binds this object as its INLINE style, so the declaration exists from
 *  the element's creation, before any group frame can run. A scoped
 *  stylesheet rule raced the autoplay's first frame: when the sheet had not
 *  reached the element, the engine (loud by design) raised
 *  `BrowserScalarResolutionError` and the loop wound down (R-r-2,
 *  X.KF.W13X.cube2). */
export const CUBE_SPIN_VARS = Object.freeze({ "--rotationX": "360deg" });

/** The Rotations channel: one full turn about Y, one about Z, and X to the
 *  element's `--rotationX` (`CUBE_SPIN_VARS`, inline on the spin element). */
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
