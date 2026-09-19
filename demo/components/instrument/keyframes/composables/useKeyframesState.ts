import { convertPixelsToCh } from "@utils/helpers";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { ref } from "vue";
import {
    createAnimationUUId,
    getStoredAnimationGroupControlOptions,
} from "@state";

/**
 * The editor's UI-state half: the reactive string refs, the stored-control
 * scaffold, the stable identifiers, and the pure format-width / animation-name
 * helpers. No parsing, no animation mutation — that is `useKeyframesParsing`.
 */
export function useKeyframesState(animation: KeyframesAnimation<any>) {
    const animationUUID = createAnimationUUId(animation, animation.superKey);
    const keyframesStyleId = `keyframes-style-${animationUUID}`;

    const storedControls = getStoredAnimationGroupControlOptions(animation);
    const kfControls = storedControls.keyframeControls;

    // --- Refs ---

    const cssKeyframesString = ref("");
    const addKeyframesString = ref(kfControls.addKeyframes);
    const templateFrameStrings = ref<string[]>([]);

    // --- Pure helpers ---

    /**
     * KF-KE-48 (X.KF.W12.c) — the format width is HONEST about its input. It
     * read a `tabsListEl` ref that nothing ever bound, through a `!` asserting
     * a value that was always null, so every caller got `undefined` and the
     * responsive print-width path was dead while looking alive. The ref is
     * gone; the function takes the measuring element or returns `undefined`
     * (prettier's own default width), and says so.
     */
    const getFormatWidth = (el?: HTMLElement) => {
        if (el === undefined || el.offsetWidth == null) {
            return undefined;
        }

        return convertPixelsToCh(el.offsetWidth, el);
    };

    /**
     * KF-KE-4 (X.KF.W12.c) — THE APPLY IDENTITY IS ONE STRING.
     *
     * The name the injected stylesheet is emitted under — its `.selector`, its
     * `animation-name` and its `@keyframes` name (the emitter's only rule is
     * `` `.${name}` ``) — and the class the Apply control adds to every target
     * (`useKeyframeBrushApply` → `useApplyCSS`: `getClassName() === styleId`)
     * are the SAME token, by construction rather than by agreement between two
     * derivations. This function used to strip the `keyframes-style-` prefix and
     * case-fold, so the sheet named `.x` while the target wore `keyframes-style-X`
     * and Apply had never once applied anything — proven by execution in
     * `keyframes-editor-honest.test.ts`, which reads both strings back from the
     * DOM. No sanitization happens here: routing the ONE token through the
     * library's published `cssIdent` is N-8, the APPLY-UNIT's row.
     */
    const getTmpAnimationName = () => keyframesStyleId;

    return {
        animationUUID,
        keyframesStyleId,
        storedControls,
        kfControls,

        cssKeyframesString,
        addKeyframesString,
        templateFrameStrings,

        getFormatWidth,
        getTmpAnimationName,
    };
}

export type KeyframesState = ReturnType<typeof useKeyframesState>;
