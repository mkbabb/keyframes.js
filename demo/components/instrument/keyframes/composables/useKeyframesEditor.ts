import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { useKeyframesState } from "./useKeyframesState";
import { useKeyframesParsing } from "./useKeyframesParsing";

/**
 * Editor entry composable — composes the two colocated halves:
 *   • `useKeyframesState`   — UI state (string refs, stored controls, ids,
 *                             the format-width / apply-name helpers).
 *   • `useKeyframesParsing` — parse orchestration (animation ⇄ CSS strings,
 *                             add/remove keyframe ops, the length-watch flush).
 *
 * KF-KE-49 (X.KF.W12.c) — this barrel returns what its two consumers
 * (`KeyframesEditor.vue`, `KeyframesStringControls.vue`) READ, and nothing
 * else. It used to re-export twenty members "so the callsite keeps resolving",
 * six of them read by no one (`tabsListEl`, `animationUUID`, `storedControls`,
 * `getFormatWidth`, `debouncedUpdateAllStrings`,
 * `updateAnimationFromKeyframesString`) — a backwards-compat surface under the
 * standing no-shim law. A consumer that needs one of the halves' internals
 * reaches the half.
 *
 * KF-KE-19, stated: `getAnimation` is read ONCE, here, and every holder below
 * is a snapshot of that read — the shipped call sites pass a `markRaw` const
 * with no `:key`, so no re-resolution is ever observable, and threading a live
 * getter through both halves is a signature change that reaches the parsing
 * half (the APPLY-UNIT's row). The contract is a snapshot and now says so.
 */
export function useKeyframesEditor(
    getAnimation: () => KeyframesAnimation<any>,
    emit: (
        event: "keyframesUpdate",
        val: { animation: KeyframesAnimation<any> },
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

        // Constants
        keyframesStyleId: state.keyframesStyleId,
        kfControls: state.kfControls,

        // Functions
        getTmpAnimationName: state.getTmpAnimationName,
        updateFromString: parsing.updateFromString,
        updateCSSAnimationKeyframesStringFromAnimation:
            parsing.updateCSSAnimationKeyframesStringFromAnimation,
        updateAllStrings: parsing.updateAllStrings,
        updateAllStringsAndAnimation: parsing.updateAllStringsAndAnimation,
        updateAnimationFromKeyframeString:
            parsing.updateAnimationFromKeyframeString,
        updateAddKeyframesString: parsing.updateAddKeyframesString,
        addKeyframesStringToAnimation: parsing.addKeyframesStringToAnimation,
        removeKeyframeData: parsing.removeKeyframeData,
    };
}
