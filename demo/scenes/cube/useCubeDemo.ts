import { FunctionValue, ValueUnit } from "@mkbabb/value.js/units";
import { markRaw, shallowRef } from "vue";
import type { Ref } from "vue";
import { kfEngine } from "@utils/kfEngine";
import { getStoredAnimationOptions } from "@state";
import { useSceneVisibilityPause } from "@composables/scene-runtime/useSceneVisibilityPause";
import { CUBE_SCENE_ID } from "./cubeKeys";

// T.B9 — the ONE keyspace: the store key (and each `animation.superKey` field) is
// the registry SceneId, single-sourced from `cubeKeys.ts`. This re-export keeps
// the existing `SCENE_ID` consumers (CubeScene + this module's internal uses).
export const SCENE_ID = CUBE_SCENE_ID;

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
        SCENE_ID,
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
    matrixAnim.value.superKey = SCENE_ID;

    const rotationAnimationOptions = getStoredAnimationOptions(
        CUBE_ANIMATION_NAMES.Rotations,
        SCENE_ID,
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
    rotationAnim.value.superKey = SCENE_ID;

    const hoverAnimationOptions = getStoredAnimationOptions(
        CUBE_ANIMATION_NAMES.Hover,
        SCENE_ID,
    );

    const hoverAnim = shallowRef(
        markRaw(presets.hover(hoverAnimationOptions.animationOptions)),
    );
    hoverAnim.value.name = CUBE_ANIMATION_NAMES.Hover;
    hoverAnim.value.superKey = SCENE_ID;

    const animationGroup = shallowRef(
        markRaw(
            new AnimationGroup(
                rotationAnim.value,
                matrixAnim.value,
                hoverAnim.value,
            ),
        ),
    );

    // T.A3 — ONE settle-motion language. The former `easeInBounce` intro jittered
    // BACKWARDS at the start (a bounce-IN) and ran the engine 700ms on mount with
    // several overshoot sign-changes; the scene's one settle easing is
    // `ease-out-back` (~650ms) — the same landing the roll egg wears — so the die
    // eases into its opening attitude with a single, gentle overshoot. PRM snaps
    // to attitude (the engine's reduced-motion gate).
    const changeGraphPerspectiveAnim = new CSSKeyframesAnimation({
        duration: 650,
        timingFunction: "ease-out-back",
    }).fromVars([
        { transform: { rotate3d: "0, 0, 0, 0deg" } },
        { transform: { rotate3d: "-1, 1, 0, 30deg" } },
    ]);

    const setTargets = (cubeEl: HTMLElement, graphEl: HTMLElement) => {
        rotationAnim.value.setTargets(cubeEl);
        matrixAnim.value.setTargets(cubeEl);
        hoverAnim.value.setTargets(cubeEl);
        changeGraphPerspectiveAnim.setTargets(graphEl);
        // T.A3 — PRM snaps to the opening attitude: under reduced-motion the graph
        // jumps straight to rotate3d(-1,1,0,30deg) with NO eased intro sweep (the
        // house reduced-motion contract). Otherwise the ease-out-back settle plays.
        const prefersReduced =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) {
            graphEl.style.transform = "rotate3d(-1, 1, 0, 30deg)";
        } else {
            changeGraphPerspectiveAnim.play();
        }
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
