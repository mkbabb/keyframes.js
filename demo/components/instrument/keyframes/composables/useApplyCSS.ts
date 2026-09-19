import { onBeforeUnmount, ref } from "vue";
import type { Ref } from "vue";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { useHighlightCSS } from "./useHighlightCSS";

/**
 * KF-KE-6 (X.KF.W12.c) — the apply state lives at the IDENTITY's altitude.
 *
 * `isApplied` and `prevPaused` used to be per-instance refs beside a deliberately
 * shared identity: two closures over one animation each believed they alone
 * had applied it, so the second owner's `aria-pressed` lied, a toggle from one
 * side restored a pause state the other side had saved, and — once the sheet
 * actually applied anything (KF-KE-4) — the first closure to unmount left the
 * target wearing a class whose rules the survivor still owned. One record per
 * style id, shared by every owner, is what "one identity" meant all along.
 */
interface ApplyState {
    /** Whether the identity is applied — ONE flag, read by every owner's brush. */
    isApplied: Ref<boolean>;
    /** The animation's pause state before Apply paused it, for the unapply. */
    prevPaused: boolean;
}

const applyStates = new Map<string, ApplyState>();

const applyStateFor = (styleId: string): ApplyState => {
    let state = applyStates.get(styleId);
    if (state === undefined) {
        state = { isApplied: ref(false), prevPaused: false };
        applyStates.set(styleId, state);
    }
    return state;
};

/**
 * The "Apply CSS" toggle: inject the animation's CSS into the identity's one
 * `<style>` (owned and refcounted by `useHighlightCSS`), add the SAME name as a
 * class to every target, and pause the JS animation so the CSS one shows;
 * unapply restores the pause state, empties the sheet and removes the class.
 */
export function useApplyCSS(options: {
    getAnimation: () => KeyframesAnimation<any>;
    styleId: string;
    getCSSString: () => string;
    getClassName: () => string;
}): {
    isApplied: Ref<boolean>;
    toggle: () => void;
    clear: () => void;
} {
    const { getAnimation, styleId, getCSSString, getClassName } = options;

    const sheet = useHighlightCSS(styleId);
    const state = applyStateFor(styleId);
    const { isApplied } = state;

    const apply = () => {
        const animation = getAnimation();
        const className = getClassName();

        state.prevPaused = animation.paused;
        animation.paused = animation.started;
        sheet.setContent(getCSSString());
        animation.targets.forEach((t: Element) => t.classList.add(className));
        isApplied.value = true;
    };

    const unapply = () => {
        const animation = getAnimation();
        const className = getClassName();

        animation.paused = state.prevPaused;
        sheet.clear();
        animation.targets.forEach((t: Element) =>
            t.classList.remove(className),
        );
        isApplied.value = false;
    };

    const toggle = () => {
        if (isApplied.value) unapply();
        else apply();
    };

    const clear = () => {
        if (isApplied.value) unapply();
    };

    // KF-KE-12 ≡ N-5 — `clear()` is WIRED into the lifetime, refcount-aware. An
    // owner leaving while another is live leaves the applied identity to the
    // survivor; the LAST owner out takes the applied state down with the sheet
    // (pause restored, class removed), so no target is left wearing a class
    // whose sheet just left the document and no animation stays paused with
    // nobody to un-pause it. `beforeUnmount` runs before every `unmounted` hook,
    // i.e. before the sheet's own release decrements the count it reads.
    onBeforeUnmount(() => {
        if (sheet.isSoleHolder()) {
            clear();
            applyStates.delete(styleId);
        }
    });

    return { isApplied, toggle, clear };
}
