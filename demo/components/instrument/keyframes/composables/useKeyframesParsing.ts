import { debounce } from "@mkbabb/value.js";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { loadAnimationEngine } from "@mkbabb/keyframes.js";
import { nextTick, watch } from "vue";
import type { KeyframesState } from "./useKeyframesState";
import { useKeyframeOps } from "./useKeyframeOps";

/**
 * The editor's parsing-orchestration half: turns the live `Animation` into its
 * CSS-string projections (animation → strings) and wires the array/control
 * watchers. The string-edit → animation mutation ops are colocated in
 * `useKeyframeOps`, which this composable threads the string-generation
 * callbacks into (one-way dependency, no cycle).
 */
export function useKeyframesParsing(
    animation: KeyframesAnimation<any>,
    state: KeyframesState,
    emit: (event: "keyframesUpdate", val: { animation: KeyframesAnimation<any> }) => void,
) {
    const {
        cssKeyframesString,
        templateFrameStrings,
        kfControls,
        getFormatWidth,
        getTmpAnimationName,
    } = state;

    // --- CSS string generation (animation → strings) ---

    const updateCSSAnimationKeyframesStringFromAnimation = async (
        cssAnimationKeyframes?: string,
    ) => {
        const { CSSKeyframesToString } = await loadAnimationEngine();
        const keyframesString =
            cssAnimationKeyframes ??
            (await CSSKeyframesToString(
                animation,
                getTmpAnimationName(),
                getFormatWidth(),
            ));

        cssKeyframesString.value = keyframesString;

        return keyframesString;
    };

    const updateAllStrings = async () => {
        const { CSSKeyframesToStrings } = await loadAnimationEngine();
        templateFrameStrings.value = [];
        templateFrameStrings.value = await CSSKeyframesToStrings(animation);

        const keyframesString =
            await updateCSSAnimationKeyframesStringFromAnimation();

        return keyframesString;
    };

    const debouncedUpdateAllStrings = debounce(updateAllStrings, 100);

    const updateAllStringsAndAnimation = async () => {
        const reversedKeyframesString = await updateAllStrings();
        ops.updateAnimationFromKeyframesString(reversedKeyframesString);
    };

    // --- CSS string → animation ops (colocated) ---

    const ops = useKeyframeOps(animation, state, emit, {
        updateAllStrings,
        updateAllStringsAndAnimation,
        debouncedUpdateAllStrings,
    });

    // --- Watchers ---

    watch(
        () => kfControls.selectedKeyframesControl,
        () => {
            updateAllStrings();
        },
    );

    // `animation.templateFrames` is a `markRaw` array, so this watch fires on
    // STRUCTURAL changes (a frame added/removed — the array reference's length)
    // — NOT on element-level edits (`frame.start`/`frame.vars` mutation), which
    // are un-tracked under markRaw and covered instead by the EXPLICIT
    // `updateAllStrings()` calls at each mutation site (the single source of
    // truth). For the structural case the `flush: 'post'` + `nextTick` ordering
    // (D.W3.S4) keeps the derived strings from reprojecting off a half-applied
    // array between the mutation and the render barrier. The data-flow is
    // honest: this watch is the structural projector, the explicit calls are
    // the edit projector — not a watch that pretends to cover both.
    watch(
        animation.templateFrames,
        async () => {
            await nextTick();
            debouncedUpdateAllStrings();
        },
        { flush: "post" },
    );

    return {
        updateFromString: ops.updateFromString,
        updateCSSAnimationKeyframesStringFromAnimation,
        updateAllStrings,
        debouncedUpdateAllStrings,
        updateAllStringsAndAnimation,
        updateAnimationFromKeyframesString:
            ops.updateAnimationFromKeyframesString,
        updateAnimationFromKeyframeString: ops.updateAnimationFromKeyframeString,
        updateAddKeyframesString: ops.updateAddKeyframesString,
        addKeyframesStringToAnimation: ops.addKeyframesStringToAnimation,
        removeKeyframeData: ops.removeKeyframeData,
    };
}
