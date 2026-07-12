import { useTemplateRef } from "vue";
import { kfEngine } from "@utils/kfEngine";

function resolveElement(value: unknown): HTMLElement | null {
    if (value instanceof HTMLElement) return value;
    const candidate = value as { $el?: unknown } | null;
    return candidate?.$el instanceof HTMLElement ? candidate.$el : null;
}

export function useIconSpin() {
    const resetIconEl = useTemplateRef<HTMLElement>("resetIconEl");
    const { CSSKeyframesAnimation } = kfEngine();
    const animation = new CSSKeyframesAnimation({
        duration: 400,
        timingFunction: "easeOutCubic",
    }).fromString(/*css*/ `@keyframes twist {
        0% { transform: perspective(200px) rotateY(0deg) scale(1); }
        40% { transform: perspective(200px) rotateY(-180deg) scale(0.85); }
        100% { transform: perspective(200px) rotateY(-360deg) scale(1); }
    }`);
    const resetIconSpin = () => {
        const element = resolveElement(resetIconEl.value);
        if (!element) return;
        animation.setTargets(element);
        animation.reset();
        void animation.play();
    };
    return { resetIconEl, resetIconSpin };
}
