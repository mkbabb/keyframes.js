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
    const brushAnimation = new CSSKeyframesAnimation({
        duration: 700,
        timingFunction: "linear",
        iterationCount: "infinite",
        direction: "alternate",
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
