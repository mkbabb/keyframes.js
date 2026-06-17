import type { Animation } from "@mkbabb/keyframes.js";
import { useKeyframesState } from "./useKeyframesState";
import { useKeyframesParsing } from "./useKeyframesParsing";

/**
 * Editor entry composable — composes the two colocated halves:
 *   • `useKeyframesState`   — UI state (string refs, stored controls, ids,
 *                             pure format-width / name helpers).
 *   • `useKeyframesParsing` — parse orchestration (animation ⇄ CSS strings,
 *                             add/remove keyframe ops, the array-watch flush).
 *
 * The public return shape is unchanged from the pre-split composable so the
 * `KeyframesEditor.vue` callsite keeps resolving.
 */
export function useKeyframesEditor(
    getAnimation: () => Animation<any>,
    emit: (
        event: "keyframesUpdate",
        val: { animation: Animation<any> },
    ) => void,
) {
    const animation = getAnimation();

    const state = useKeyframesState(animation);
    const parsing = useKeyframesParsing(animation, state, emit);

    return {
        // Refs
        cssKeyframesString: state.cssKeyframesString,
        addKeyframesString: state.addKeyframesString,
        templateFrameStrings: state.templateFrameStrings,
        tabsListEl: state.tabsListEl,

        // Constants
        animationUUID: state.animationUUID,
        keyframesStyleId: state.keyframesStyleId,
        storedControls: state.storedControls,
        kfControls: state.kfControls,

        // Functions
        getFormatWidth: state.getFormatWidth,
        getTmpAnimationName: state.getTmpAnimationName,
        updateCSSAnimationKeyframesStringFromAnimation:
            parsing.updateCSSAnimationKeyframesStringFromAnimation,
        updateAllStrings: parsing.updateAllStrings,
        debouncedUpdateAllStrings: parsing.debouncedUpdateAllStrings,
        updateAllStringsAndAnimation: parsing.updateAllStringsAndAnimation,
        updateAnimationFromKeyframesString:
            parsing.updateAnimationFromKeyframesString,
        updateAnimationFromKeyframeString:
            parsing.updateAnimationFromKeyframeString,
        updateAddKeyframesString: parsing.updateAddKeyframesString,
        addKeyframesStringToAnimation: parsing.addKeyframesStringToAnimation,
        removeKeyframeData: parsing.removeKeyframeData,
    };
}
