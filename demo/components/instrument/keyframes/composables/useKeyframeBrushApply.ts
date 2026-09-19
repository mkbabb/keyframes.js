import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { kfEngine } from "@kf-engine";
import { onMounted, onUnmounted, useTemplateRef } from "vue";
import { useApplyCSS } from "./useApplyCSS";

const { CSSKeyframesAnimation } = kfEngine();

interface KeyframeBrushApplyOptions {
    animation: KeyframesAnimation<any>;
    styleId: string;
    getCSSString: () => string;
    templateRef: string;
}

/** Owns the editor surfaces' single apply-CSS identity and brush feedback. */
export function useKeyframeBrushApply(options: KeyframeBrushApplyOptions) {
    const brush = useTemplateRef<HTMLElement>(options.templateRef);
    // KF-KE-8 (D-5, cure map as corrected at the bank: M-6 reversed) — the
    // brush is a STANDALONE animation, and the standalone play path reads
    // `options.respectReducedMotion` (up-front gate + live re-consult per
    // tick), so the opt-in lives in its own options bag. It is the one INFINITE
    // animation on this surface; under the preference it snaps to its final
    // frame instead of wiggling forever. The delete choreography arms through
    // the group's own default (`AnimationGroup.respectReducedMotion = true`,
    // KF.W5) and the two progress sweeps through their bags (KAD-11); the
    // MECHANISM unification across the demo is KF.W9's, not re-derived here.
    const brushAnimation = new CSSKeyframesAnimation({
        duration: 700,
        timingFunction: "linear",
        iterationCount: "infinite",
        direction: "alternate",
        respectReducedMotion: true,
    }).fromString(/*css*/ `@keyframes keyframeBrushApply {
        0%, 100% { transform: rotate(0deg); }
        20%, 30%, 40% { transform: rotate(30deg); }
        60%, 70%, 80% { transform: rotate(-90deg); }
    }`);

    const { isApplied, toggle } = useApplyCSS({
        getAnimation: () => options.animation,
        styleId: options.styleId,
        getCSSString: options.getCSSString,
        getClassName: () => options.styleId,
    });

    const applyCSSStyles = () => {
        toggle();
        if (isApplied.value) void brushAnimation.play();
        else brushAnimation.pause();
    };

    onMounted(() => brushAnimation.setTargets(brush.value!));
    onUnmounted(() => brushAnimation.pause());

    return { applyCSSStyles, cssApplied: isApplied };
}
