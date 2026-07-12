import { convert2 } from "@mkbabb/value.js";
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

    const tabsListEl = ref<HTMLElement | null>(null);

    // --- Pure helpers ---

    const getFormatWidth = (el?: HTMLElement) => {
        el ??= tabsListEl.value!;

        if (el == null || el.offsetWidth == null) {
            return undefined;
        }

        return convert2(el.offsetWidth, "px", "ch", el);
    };

    const getTmpAnimationName = () => {
        return keyframesStyleId.replace("keyframes-style-", "").toLowerCase();
    };

    return {
        animationUUID,
        keyframesStyleId,
        storedControls,
        kfControls,

        cssKeyframesString,
        addKeyframesString,
        templateFrameStrings,
        tabsListEl,

        getFormatWidth,
        getTmpAnimationName,
    };
}

export type KeyframesState = ReturnType<typeof useKeyframesState>;
