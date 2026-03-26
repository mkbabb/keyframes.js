import {
    computed,
    onMounted,
    onUnmounted,
    ref,
    watch,
    type ComputedRef,
    type Ref,
} from "vue";

export interface UseScrollFadeOptions {
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

export interface UseScrollFadeReturn {
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
 * Attaches a scroll listener to `el` and a ResizeObserver to `observeEl`
 * (or `el` when `observeEl` is not provided). Both are cleaned up on unmount.
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

    // --- Scroll listener ---
    let boundScrollEl: HTMLElement | null = null;

    function attachScrollListener() {
        detachScrollListener();
        const scrollEl = el.value;
        if (scrollEl) {
            scrollEl.addEventListener("scroll", check, { passive: true });
            boundScrollEl = scrollEl;
        }
    }

    function detachScrollListener() {
        if (boundScrollEl) {
            boundScrollEl.removeEventListener("scroll", check);
            boundScrollEl = null;
        }
    }

    // --- ResizeObserver ---
    let resizeObserver: ResizeObserver | null = null;

    function attachResizeObserver() {
        detachResizeObserver();
        const target = (observeEl ?? el).value;
        if (target) {
            resizeObserver = new ResizeObserver(() => check());
            resizeObserver.observe(target);
        }
    }

    function detachResizeObserver() {
        if (resizeObserver) {
            resizeObserver.disconnect();
            resizeObserver = null;
        }
    }

    // Re-attach listeners when the element ref changes
    watch(el, () => {
        attachScrollListener();
        // If no separate observeEl, re-attach resize observer too
        if (!observeEl) attachResizeObserver();
        check();
    });

    if (observeEl) {
        watch(observeEl, () => {
            attachResizeObserver();
            check();
        });
    }

    // Watch retrigger
    if (retrigger) {
        watch(retrigger, () => check());
    }

    onMounted(() => {
        attachScrollListener();
        attachResizeObserver();
        check();
    });

    onUnmounted(() => {
        detachScrollListener();
        detachResizeObserver();
    });

    return {
        overflowStart,
        overflowEnd,
        fadeClass,
        check,
    };
}
