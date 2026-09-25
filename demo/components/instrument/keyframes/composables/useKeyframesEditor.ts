import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { useKeyframesState } from "./useKeyframesState";
import { useKeyframesParsing } from "./useKeyframesParsing";

/**
 * Editor entry composable — composes the two colocated halves:
 *   • `useKeyframesState`   — UI state (the buffer ref, the style id, the
 *                             format-width helper).
 *   • `useKeyframesParsing` — parse orchestration (animation ⇄ buffer, the one
 *                             op, the length-watch flush).
 *
 * KF-KE-49 (X.KF.W12.c) — this barrel returns what its consumer
 * (`KeyframesStringControls.vue`) READS, and nothing else.
 * X.KF.W13X.keyframes (A2-KE-L1-1) cut it from fourteen — the other ten served
 * only the card editor (`KeyframesEditor.vue`) and its add dialog, deleted
 * with that subtree (KFE-ORPHAN). It once re-exported twenty members "so the
 * callsite keeps resolving" — a backwards-compat surface under the
 * standing no-shim law. A consumer that needs one of the halves' internals
 * reaches the half. `getTmpAnimationName` left the list with the accessor
 * itself (D-23 / N-8, X.KF.W12.e): it was a second NAME for `keyframesStyleId`,
 * which this barrel already publishes, and it was dead at every consumer.
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
        cssKeyframesString: state.cssKeyframesString,
        keyframesStyleId: state.keyframesStyleId,
        animationName: state.animationName,
        sheetCSSString: state.sheetCSSString,
        updateFromString: parsing.updateFromString,
        updateCSSAnimationKeyframesStringFromAnimation:
            parsing.updateCSSAnimationKeyframesStringFromAnimation,
    };
}
