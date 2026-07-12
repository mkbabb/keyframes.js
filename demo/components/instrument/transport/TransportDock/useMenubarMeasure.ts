import { onBeforeUnmount, onMounted, useTemplateRef } from "vue";
import { useResizeObserver } from "@vueuse/core";

const HEIGHT_PROP = "--menubar-measured-h";
const PEAK_PROP = "--menubar-measured-h-peak";

export function useMenubarMeasure() {
    const menubarHostEl = useTemplateRef<HTMLElement>("menubarHostEl");
    let peak = 0;
    const publish = () => {
        const host = menubarHostEl.value;
        if (!host) return;
        const height = Math.ceil(host.getBoundingClientRect().height);
        document.documentElement.style.setProperty(HEIGHT_PROP, `${height}px`);
        if (height > peak) {
            peak = height;
            document.documentElement.style.setProperty(PEAK_PROP, `${peak}px`);
        }
    };
    useResizeObserver(menubarHostEl, publish);
    onMounted(publish);
    onBeforeUnmount(() => {
        document.documentElement.style.removeProperty(HEIGHT_PROP);
        document.documentElement.style.removeProperty(PEAK_PROP);
        peak = 0;
    });
    return menubarHostEl;
}
