import { convert2 } from "@mkbabb/value.js";
import type { Animation } from "@src/animation/engine";
import { ref } from "vue";
import {
    createAnimationUUId,
    getStoredAnimationGroupControlOptions,
} from "../../stores";

/**
 * The editor's UI-state half: the reactive string refs, the stored-control
 * scaffold, the stable identifiers, and the pure format-width / animation-name
 * helpers. No parsing, no animation mutation — that is `useKeyframesParsing`.
 */
export function useKeyframesState(animation: Animation<any>) {
    const animationUUID = createAnimationUUId(animation, animation.superKey);
    const keyframesStyleId = `keyframes-style-${animationUUID}`;

    const defaultKeyframeControls = {
        selectedKeyframesControl: "keyframes",
        dialogOpen: false,
        keyframes: "",
        addKeyframes: "",
    };

    const storedControls = getStoredAnimationGroupControlOptions(animation);
    storedControls.keyframeControls ??= defaultKeyframeControls;

    // After ??= above, keyframeControls is guaranteed non-undefined.
    // Use a local alias to avoid TS18048 on every access.
    const kfControls = storedControls.keyframeControls!;

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
