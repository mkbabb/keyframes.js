import { debounce } from "@utils/helpers";
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { loadAnimationEngine } from "@mkbabb/keyframes.js";
import { nextTick, watch } from "vue";
import type { KeyframesState } from "./useKeyframesState";
import { useKeyframeOps } from "./useKeyframeOps";
import { formatEditorCSS } from "@utils/formatEditorCSS";

/**
 * The editor's parsing-orchestration half: projects the live `Animation` into
 * the pane's buffer (animation → string) and threads that projection into the
 * buffer → animation op (`useKeyframeOps`, one-way dependency, no cycle).
 *
 * X.KF.W13X.keyframes (KFE-ORPHAN · A2-KE-L1-1) — the per-card projection
 * (`updateAllStrings` over `CSSKeyframesToStrings`), the card-selection watch
 * and the card ops served only the card editor and its add dialog, which no
 * product file mounted after `e69f7731`. What stays is what the live pane
 * reads: the buffer projection and the one op.
 */
export function useKeyframesParsing(
    animation: KeyframesAnimation<any>,
    state: KeyframesState,
    emit: (event: "keyframesUpdate", val: { animation: KeyframesAnimation<any> }) => void,
) {
    const { cssKeyframesString, keyframesStyleId, getFormatWidth } = state;

    // --- CSS string generation (animation → strings) ---

    // N-8 (X.KF.W12.e) — THE EMITTED SELECTOR READS THE IDENTITY DIRECTLY.
    //
    // This is the demo's emitted-selector half of the one name: whatever string
    // goes in here comes back out as the projection's `.selector`, its
    // `animation-name` and its `@keyframes` name. It used to arrive through a
    // `getTmpAnimationName()` accessor that derived a SECOND name from the
    // class's id (prefix stripped, case-folded), which is why the injected sheet
    // bound nothing. The accessor is gone: `keyframesStyleId` — normalized once
    // by the library's own published `cssIdent` (`useKeyframesState`) — is read
    // here, and the class the Apply control adds is the same const. One name,
    // one derivation, no agreement to keep.
    const updateCSSAnimationKeyframesStringFromAnimation = async (
        cssAnimationKeyframes?: string,
    ) => {
        const { CSSKeyframesToString } = await loadAnimationEngine();
        const raw =
            cssAnimationKeyframes ??
            (await CSSKeyframesToString(animation, keyframesStyleId));
        const keyframesString = await formatEditorCSS(raw, getFormatWidth());

        cssKeyframesString.value = keyframesString;

        return keyframesString;
    };

    // After an adopt the buffer re-projects from the animation the op wrote —
    // debounced, so a burst of edits settles into one projection.
    const reproject = debounce(() => {
        void updateCSSAnimationKeyframesStringFromAnimation();
    }, 100);

    const ops = useKeyframeOps(animation, emit, { reproject });

    // `animation.templateFrames` is a `markRaw` array, so this watch fires on
    // STRUCTURAL changes (a frame added/removed — the array reference's length)
    // — NOT on element-level edits (`frame.start`/`frame.vars` mutation), which
    // are un-tracked under markRaw and covered instead by the explicit
    // `reproject()` after each adopt. For the structural case the
    // `flush: 'post'` + `nextTick` ordering (D.W3.S4) keeps the buffer from
    // reprojecting off a half-applied array between the mutation and the render
    // barrier.
    watch(
        () => animation.templateFrames.length,
        async () => {
            await nextTick();
            reproject();
        },
        { flush: "post" },
    );

    return {
        updateFromString: ops.updateFromString,
        updateCSSAnimationKeyframesStringFromAnimation,
    };
}
