import { computed, nextTick } from "vue";

// GLASSUI-GAP: segmentedTabsAriaOrientation — the roving-tabindex keyboard half of
// the KfPillTabs band-aid (BG-1 aria guard + BG-3 material↔role decouple). It is
// deleted with KfPillTabs.vue on the glass-ui re-pin; see demo/glass-ui-gaps.ts
// (the primary SFC carries the load-bearing glassUiGap import).

/**
 * S.B7 · S6 (fold row 71 · a12 F1 HIGH) — the roving-tabindex keyboard core for
 * `KfPillTabs`, extracted from the SFC so it is unit-testable the way
 * `useToolbarKeyboard` is (vitest carries no Vue-SFC plugin; the accessible
 * keyboard contract is verified by DRIVING a representative tablist host, not by
 * inspecting markup).
 *
 * THE BUG THIS FIXES (a12 F1): the previous handler emitted the new `modelValue`
 * on an arrow key — flipping the reactive tab-stop — but NEVER moved DOM focus.
 * Focus stayed pinned to the originally-focused button (now `tabindex=-1`), so the
 * next arrow re-fired the SAME button's handler with the SAME stale value:
 * traversal collapsed one hop from the entry tab and a third tab was unreachable
 * by keyboard. The APG tablist contract for automatic activation is: the arrow
 * key moves FOCUS (`element.focus()`) and selection follows focus. This restores
 * that — plus Home/End (first/last enabled) and an empty/unmatched-`modelValue`
 * fallback so the strip is always Tab-reachable (a12 F6).
 */
export interface KfPillTabOption {
    label: string;
    value: string;
    disabled?: boolean;
}

export interface UseKfPillTabsParams {
    options: () => readonly KfPillTabOption[];
    orientation: () => "horizontal" | "vertical";
    modelValue: () => string;
    /** Emit the new selection (`update:modelValue`). */
    select: (value: string) => void;
}

export function useKfPillTabs(params: UseKfPillTabsParams) {
    const enabled = () => params.options().filter((o) => !o.disabled);

    /**
     * The single roving tab stop (`tabindex=0`): the SELECTED enabled tab, or —
     * when `modelValue` matches nothing enabled (empty/cleared/all-disabled-but-
     * one) — the FIRST enabled tab, so the strip never becomes Tab-unreachable
     * (a12 F6). `undefined` only when there is no enabled tab at all.
     */
    const rovingValue = computed<string | undefined>(() => {
        const en = enabled();
        const sel = en.find((o) => o.value === params.modelValue());
        return (sel ?? en[0])?.value;
    });

    const focusTab = (list: HTMLElement | null, value: string): void => {
        const btn =
            list &&
            (Array.from(list.children).find(
                (el): el is HTMLElement =>
                    el instanceof HTMLElement && el.dataset.value === value,
            ) ??
                null);
        // After the reactive tab-stop flips, move DOM focus onto the same tab.
        nextTick(() => btn?.focus());
    };

    const onKeydown = (e: KeyboardEvent, value: string): void => {
        const en = enabled();
        if (en.length === 0) return;
        const vertical = params.orientation() === "vertical";
        const nextKey = vertical ? "ArrowDown" : "ArrowRight";
        const prevKey = vertical ? "ArrowUp" : "ArrowLeft";
        // The focused button's index in the enabled set (≥0 for any real tab).
        const cur = Math.max(
            0,
            en.findIndex((o) => o.value === value),
        );

        let target: KfPillTabOption | undefined;
        if (e.key === nextKey) target = en[(cur + 1) % en.length];
        else if (e.key === prevKey)
            target = en[(cur - 1 + en.length) % en.length];
        else if (e.key === "Home") target = en[0];
        else if (e.key === "End") target = en[en.length - 1];
        else return;

        e.preventDefault();
        if (!target) return;
        // Selection follows focus (automatic activation) …
        if (target.value !== params.modelValue()) params.select(target.value);
        // … and focus follows selection — the load-bearing half a12 F1 dropped.
        focusTab((e.currentTarget as HTMLElement).parentElement, target.value);
    };

    return { rovingValue, onKeydown };
}
