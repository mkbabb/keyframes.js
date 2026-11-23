import { markRaw, shallowRef, watch } from "vue";
import type { Ref } from "vue";
import type { CubeSkin } from "@state";
import { kfEngine } from "@kf-engine";
import { getStoredAnimationOptions, walkGroupClock, EASE_IN_MS } from "@state";
import { useSceneVisibilityPause } from "@composables/scene-runtime/useSceneVisibilityPause";
import { CUBE_SCENE_ID } from "./cubeKeys";
import type { Matrix3dCall } from "./matrix-editor/transformMath";
import { CUBE_ANIMATION_NAMES, CUBE_AUTHORED_OPTIONS, cubeSpinKeyframes } from "./cubeMotion";

/** The die's way back to speed when a hand lets it go (`easeBack`), in ms:
 *  the one ramp every start of the spin takes. */
const EASE_BACK_MS = EASE_IN_MS;

/** The cube's per-channel paint targets (KF.W13U.w — one element per
 *  transform owner). The stage's attitude (`.graph`) is not one: it is parked
 *  by the template from the first paint (CubeTarget, GRAPH_ATTITUDE). */
export interface CubeTargets {
    cubeEl: HTMLElement;
    bobEl: HTMLElement;
    poseEl: HTMLElement;
}

export function useCubeDemo(
    matrix3dStart: Ref<Matrix3dCall>,
    matrix3dEnd: Ref<Matrix3dCall>,
    skin: Readonly<Ref<CubeSkin>>,
    /** `held`: true while a hand holds the die (CubeTarget's `hold`), and
     *  `playing`, the scene's own play state (a Pause pressed while the hand
     *  held the die is kept at its release). */
    {
        held,
        playing,
    }: { held?: Readonly<Ref<boolean>>; playing?: Readonly<Ref<boolean>> } = {},
) {
    // HEAVY surface from the warmed engine (kfEngine(), L.W8 S1 dogfood inversion)
    // — synchronous, since the warm resolves before any scene mounts. `presets`
    // is the barrel's preset namespace (the old `* as animations` deep import).
    const { CSSKeyframesAnimation, AnimationGroup, presets } = kfEngine();

    const matrixAnimationOptions = getStoredAnimationOptions(
        CUBE_ANIMATION_NAMES.Matrix,
        CUBE_SCENE_ID,
    );

    const compileMatrixAnimation = () =>
        new CSSKeyframesAnimation(
            matrixAnimationOptions.animationOptions,
        ).fromVars([
            { transform: matrix3dStart.value },
            { transform: matrix3dEnd.value },
        ]);

    const matrixAnim = shallowRef(markRaw(compileMatrixAnimation()));
    matrixAnim.value.name = CUBE_ANIMATION_NAMES.Matrix;
    matrixAnim.value.superKey = CUBE_SCENE_ID;

    // MATRIX-PAUSED-EDIT-UNPAINTED (X.KF.W13X.r4cube) — `adoptCompiled` re-keys
    // the channel without painting it. Idle, the pre-start painter
    // (`useTransformState`'s `paintTarget`) shows the edit; playing, the next
    // group tick does; PAUSED, nothing did, so a cell edit or a Reset moved the
    // digits and never the die. The started group owns the element (one writer
    // per element, KFA-2), so the paused frame is repainted by the group itself
    // at every child's own playhead (`render()`, the same verb the scrub's
    // seek paints with). Playback is not resumed.
    watch([matrix3dStart, matrix3dEnd], () => {
        matrixAnim.value.adoptCompiled(compileMatrixAnimation());
        const group = animationGroup.value;
        if (group.started && group.paused) group.render();
    });

    const rotationAnimationOptions = getStoredAnimationOptions(
        CUBE_ANIMATION_NAMES.Rotations,
        CUBE_SCENE_ID,
        CUBE_AUTHORED_OPTIONS[CUBE_ANIMATION_NAMES.Rotations],
    );

    const rotationAnim = shallowRef(
        markRaw(
            new CSSKeyframesAnimation(
                rotationAnimationOptions.animationOptions,
            ).fromKeyframes(cubeSpinKeyframes()),
        ),
    );
    rotationAnim.value.name = CUBE_ANIMATION_NAMES.Rotations;
    rotationAnim.value.superKey = CUBE_SCENE_ID;

    const hoverAnimationOptions = getStoredAnimationOptions(
        CUBE_ANIMATION_NAMES.Hover,
        CUBE_SCENE_ID,
    );

    // The Hover channel's motion follows the skin: the crayon bob, or under
    // Daraksha the library's `garlandSway` (a pendulum from the hinge the skin
    // block sets on `.cube-bob`). Same channel, same element, same options —
    // the swap RE-KEYS it (`adoptCompiled`, the Matrix channel's verb), so
    // `.cube-bob` keeps one writer and the group keeps three children. The
    // sway rides the channel's own stored options, so the engine's
    // reduced-motion gate that governs the bob governs the sway.
    const compileHoverAnimation = (s: CubeSkin) =>
        s === "daraksha"
            ? presets.garlandSway(hoverAnimationOptions.animationOptions)
            : presets.hover(hoverAnimationOptions.animationOptions);

    const hoverAnim = shallowRef(markRaw(compileHoverAnimation(skin.value)));
    hoverAnim.value.name = CUBE_ANIMATION_NAMES.Hover;
    hoverAnim.value.superKey = CUBE_SCENE_ID;

    watch(skin, (s, prev) => {
        if ((s === "daraksha") === (prev === "daraksha")) return;
        hoverAnim.value.adoptCompiled(compileHoverAnimation(s));
        const group = animationGroup.value;
        if (group.started && group.paused) group.render();
    });

    const animationGroup = shallowRef(
        markRaw(
            new AnimationGroup(
                rotationAnim.value,
                matrixAnim.value,
                hoverAnim.value,
            ),
        ),
    );
    // KF.W13U.w — the channels paint DIFFERENT elements, so the group runs its
    // per-animation path, DECLARED (the supported opt-out, KF-W5R4(4); the
    // SquareScene precedent): the constructor derives `singleTarget` before any
    // target exists (`undefined === undefined`), and the per-child
    // `setTargets` below never re-derives it.
    animationGroup.value.singleTarget = false;

    // FORTY-SIXTH E1 (J1, J2) — the die arrives parked. It used to arrive flat
    // and face-on (the stage at identity) and twist 30° into its attitude by a
    // 650 ms ease-out-back sweep played on the first frame after mount: the
    // sweep ran under the page's arrival fade and the boot's long frame, so the
    // visitor met it mid-twist, in steps of 13 to 18° per frame; at identity the
    // Z axis stroke pointed at the camera and projected as a lavender wedge; and
    // it replayed on every return to the cube. The stage's attitude is now set by
    // the template on first render (CubeTarget, GRAPH_ATTITUDE), so the die is
    // parked in the first frame it is painted and arrives with the page: by its
    // fade on a load, by the swap's morph inside the app.

    // KF.W13U.w (OA-27) — each channel authors a WHOLE `transform`, and a
    // group layer's `replace` op keeps ONE writer per property (README
    // `AnimationGroup`: "replace: highest zIndex wins"). All three on `.cube`
    // composited to the last writer — the die only bobbed, never spun. Each
    // channel therefore owns its own nested element (CubeTarget's template), so
    // the three transforms compose by nesting: bob · pose · spin.
    const setTargets = ({ cubeEl, bobEl, poseEl }: CubeTargets) => {
        rotationAnim.value.setTargets(cubeEl);
        matrixAnim.value.setTargets(poseEl);
        hoverAnim.value.setTargets(bobEl);
    };

    // The way back to speed after a yield: the die stood still under the hand,
    // and the spin and the bob must not jump from still to full speed in one
    // frame (the motion law: nothing changes instantly). The group's clock is
    // walked up to speed (`walkGroupClock`, the one ramp every start of the
    // spin takes: the swap's landing too), and the group resumes from where
    // the walk left it, so speed carries on without a step.
    const easeBack = (done: () => void, keepGoing: () => boolean): (() => void) =>
        walkGroupClock(animationGroup.value, { ms: EASE_BACK_MS, shape: "rise" }, done, keepGoing);

    // B-3: pause the cube's engine draw loop while the tab is hidden, and while
    // a hand holds the die (the die holds still under it; the page's frames
    // carry the hand alone). The group owns its rAF; `pause()` records each
    // child's `pausedTime` and `resume()` re-bases `startTime` so `effectiveT`
    // stays continuous — no forward jump on return. Only resumes what it
    // paused (a user-paused cube stays paused).
    useSceneVisibilityPause(
        () => animationGroup.value.playing(),
        () => animationGroup.value.pause(),
        () => animationGroup.value.resume(),
        { held: () => held?.value ?? false, playing: () => playing?.value ?? true, easeIn: easeBack },
    );

    return {
        matrixAnim,
        rotationAnim,
        hoverAnim,
        animationGroup,
        setTargets,
    };
}
