import {
    computed,
    onMounted,
    ref,
    watch,
    type ComputedRef,
    type Ref,
} from "vue";
import { useEventListener, useResizeObserver } from "@vueuse/core";

interface UseScrollFadeOptions {
    /** The scrollable element to measure. */
    el: Ref<HTMLElement | null>;
    /** Scroll axis to track. */
    axis: "x" | "y";
    /**
     * CSS class prefix. Classes are derived from axis:
     * - `y` → `${classPrefix}-top`, `${classPrefix}-bottom`, `${classPrefix}-both`
     * - `x` → `${classPrefix}-left`, `${classPrefix}-right`, `${classPrefix}-both`
     */
    classPrefix?: string;
    /** Pixel threshold before overflow is detected (default 2). */
    threshold?: number;
    /** Re-check overflow whenever this ref changes. */
    retrigger?: Ref<any>;
    /**
     * Optional element to observe for resizes (defaults to `el`).
     * Useful when the resize-observed wrapper differs from the scrollable child.
     */
    observeEl?: Ref<HTMLElement | null>;
}

interface UseScrollFadeReturn {
    overflowStart: Ref<boolean>;
    overflowEnd: Ref<boolean>;
    fadeClass: ComputedRef<string>;
    /** Manually re-check overflow state. */
    check: () => void;
}

/**
 * Detects scroll overflow on a single axis and exposes CSS fade classes.
 *
 * For `axis: "y"` it reads `scrollTop` / `scrollHeight` / `clientHeight`
 * and generates classes `${prefix}-top`, `${prefix}-bottom`, `${prefix}-both`.
 *
 * For `axis: "x"` it reads `scrollLeft` / `scrollWidth` / `clientWidth`
 * and generates classes `${prefix}-left`, `${prefix}-right`, `${prefix}-both`.
 *
 * The scroll listener (on `el`) and the ResizeObserver (on `observeEl`, or `el`
 * when `observeEl` is not provided) run on vueuse's `useEventListener` /
 * `useResizeObserver` (D.W3.S4). Both accept the element REF directly: they
 * auto-detach the listener/observer from the OLD element and re-bind to the new
 * one on a mid-flight ref swap (no leaked listener on the prior element), and
 * auto-clean on scope dispose (idempotent unmount). This replaces the
 * hand-managed `watch(el)` / `watch(observeEl)` / `onMounted` / `onUnmounted`
 * attach-detach bookkeeping — the re-attach robustness is now structural.
 */
export function useScrollFade(options: UseScrollFadeOptions): UseScrollFadeReturn {
    const {
        el,
        axis,
        classPrefix = "scroll-fade",
        threshold = 2,
        retrigger,
        observeEl,
    } = options;

    const overflowStart = ref(false);
    const overflowEnd = ref(false);

    const startSuffix = axis === "y" ? "top" : "left";
    const endSuffix = axis === "y" ? "bottom" : "right";

    const fadeClass = computed(() => {
        if (overflowStart.value && overflowEnd.value) return `${classPrefix}-both`;
        if (overflowStart.value) return `${classPrefix}-${startSuffix}`;
        if (overflowEnd.value) return `${classPrefix}-${endSuffix}`;
        return "";
    });

    function check() {
        const scrollEl = el.value;
        if (!scrollEl) {
            overflowStart.value = false;
            overflowEnd.value = false;
            return;
        }

        if (axis === "y") {
            overflowStart.value = scrollEl.scrollTop > threshold;
            overflowEnd.value =
                scrollEl.scrollTop + scrollEl.clientHeight <
                scrollEl.scrollHeight - threshold;
        } else {
            overflowStart.value = scrollEl.scrollLeft > threshold;
            overflowEnd.value =
                scrollEl.scrollLeft + scrollEl.clientWidth <
                scrollEl.scrollWidth - threshold;
        }
    }

    // Scroll listener — re-binds to the new `el` and detaches the old on swap.
    useEventListener(el, "scroll", check, { passive: true });

    // ResizeObserver — observes `observeEl` (or `el`); re-binds on ref swap.
    useResizeObserver(observeEl ?? el, () => check());

    // Re-check overflow when the measured element changes (the geometry of the
    // new element may differ from the old).
    watch(el, () => check());
    if (observeEl) {
        watch(observeEl, () => check());
    }

    // Watch retrigger
    if (retrigger) {
        watch(retrigger, () => check());
    }

    onMounted(() => check());

    return {
        overflowStart,
        overflowEnd,
        fadeClass,
        check,
    };
}
