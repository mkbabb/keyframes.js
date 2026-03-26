import { ref } from "vue";
import type { Ref } from "vue";
import type { Animation } from "@src/animation/index";
import { useHighlightCSS } from "./useHighlightCSS";

/**
 * Composable that encapsulates the "Apply CSS" toggle pattern:
 * inject a `<style>` element with CSS keyframes content, add a class name
 * to animation targets, and pause/resume the JS animation accordingly.
 *
 * Uses `useHighlightCSS` internally for style element lifecycle management.
 */
export function useApplyCSS(options: {
    getAnimation: () => Animation<any>;
    styleId: string;
    getCSSString: () => string;
    getClassName: () => string;
}): {
    isApplied: Ref<boolean>;
    toggle: () => void;
    clear: () => void;
} {
    const { getAnimation, styleId, getCSSString, getClassName } = options;

    const { setContent, clear: clearStyle } = useHighlightCSS(styleId);

    const isApplied = ref(false);
    const prevPaused = ref(false);

    const toggle = () => {
        const animation = getAnimation();
        const className = getClassName();

        if (isApplied.value) {
            // Unapply: restore previous pause state, clear style, remove class
            animation.paused = prevPaused.value;
            clearStyle();
            animation.targets.forEach((t: Element) =>
                t.classList.remove(className),
            );
            isApplied.value = false;
        } else {
            // Apply: save pause state, pause if running, inject CSS, add class
            prevPaused.value = animation.paused;
            animation.paused = animation.started;
            setContent(getCSSString());
            animation.targets.forEach((t: Element) =>
                t.classList.add(className),
            );
            isApplied.value = true;
        }
    };

    const clear = () => {
        if (isApplied.value) {
            const animation = getAnimation();
            const className = getClassName();

            animation.paused = prevPaused.value;
            clearStyle();
            animation.targets.forEach((t: Element) =>
                t.classList.remove(className),
            );
            isApplied.value = false;
        }
    };

    return { isApplied, toggle, clear };
}
