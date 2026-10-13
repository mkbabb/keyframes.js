import { onBeforeUnmount, onMounted, type Ref } from "vue";
import { useResizeObserver } from "@vueuse/core";

const HEIGHT_PROP = "--menubar-measured-h";
const PEAK_PROP = "--menubar-measured-h-peak";

/**
 * Publish the menubar host's REAL border-box height on :root.
 *
 * CH-3/M1 — the mobile sheet anchors on `--dock-band-reserve`, which style.css
 * folds this live measure into via max(), so the sheet always clears the menubar
 * the user sees; token drift can never re-open the occlusion. Height is
 * content-driven (never a function of the reserve it feeds) — no custom-property
 * cycle.
 *
 * S1 — the live value breathes across the sheet toggle (~90↔84px), and a stage
 * band that breathes shifts the fixed stage rect; so a MONOTONIC high-water mark
 * is published beside it for the stage to reserve. The peak is a pure ceiling
 * over observed heights, never fed back into the measure.
 *
 * X.KF.W13.b · TD-17 — the host ref is PASSED IN by the SFC that owns the
 * template (a typed `useTemplateRef`), not bound here by a hard-coded string.
 */
export function useMenubarMeasure(menubarHostEl: Readonly<Ref<HTMLElement | null>>) {
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
}
