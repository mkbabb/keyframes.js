import { ref, onMounted, onUnmounted } from "vue";

export function useHighlightCSS(styleId: string) {
    const keyframesStyle = ref<HTMLStyleElement | null>(null);

    const ensureStyleElement = () => {
        const existing = document.head.querySelector(`#${styleId}`);
        if (existing) {
            keyframesStyle.value = existing as HTMLStyleElement;
        } else {
            const el = document.createElement("style");
            el.id = styleId;
            document.head.appendChild(el);
            keyframesStyle.value = el;
        }
    };

    const setContent = (css: string) => {
        if (keyframesStyle.value) {
            keyframesStyle.value.textContent = css;
        }
    };

    const clear = () => {
        if (keyframesStyle.value) {
            keyframesStyle.value.textContent = "";
        }
    };

    onMounted(() => {
        ensureStyleElement();
    });

    onUnmounted(() => {
        keyframesStyle.value?.remove();
        keyframesStyle.value = null;
    });

    return { keyframesStyle, setContent, clear };
}
