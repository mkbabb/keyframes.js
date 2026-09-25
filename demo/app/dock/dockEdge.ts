// SERVED MODEL: claude-opus-5-5
import { inject, provide, ref, watch, type InjectionKey, type Ref } from "vue";

/**
 * X.KF.W13X.dock · UIA-KF-131 — a popup opened from the top dock starts BELOW
 * the dock, not inside it.
 *
 * The floating content is placed from its TRIGGER (`sideOffset` past the
 * trigger's bottom edge), and every trigger here sits inside the dock plate's
 * own block padding. So the scene list and the @mbabb menu opened 4-12 px up
 * INTO the dock that hosts them (served: list top 76 over a dock bottom of 83
 * at 390, 94 over 98 at 1440), covering its lower rim — and, on a wrapped
 * dock, its second row. The offset that clears the host is the dock's bottom
 * minus the trigger's bottom, plus the gap, measured when the popup opens.
 *
 * The band is ChromeDock's own wrapper around the GlassDock (the demo's
 * element, sized to the dock), provided once and read by every popup trigger
 * in the dock's slot (MbabbMenu is App's slot content). The producer half —
 * floating content inside a dock offsets from the dock edge by itself —
 * stays relay-only (O-59).
 */
const DOCK_BAND_KEY: InjectionKey<Readonly<Ref<HTMLElement | null>>> = Symbol("dock-band");

/** The gap between the dock's edge and a popup it opens (the menu's former trigger offset). */
export const DOCK_POPUP_GAP = 8;

export function provideDockBand(band: Readonly<Ref<HTMLElement | null>>): void {
    provide(DOCK_BAND_KEY, band);
}

/**
 * The `sideOffset` for a popup whose trigger is `trigger`, re-measured each
 * time `open` turns true. The band is the provided one (slot content) unless
 * the provider itself passes its own. Outside a dock it is the gap alone.
 */
export function useDockEdgeOffset(
    trigger: () => HTMLElement | null | undefined,
    open: Readonly<Ref<boolean>>,
    band: Readonly<Ref<HTMLElement | null>> | null = inject(DOCK_BAND_KEY, null),
): Readonly<Ref<number>> {
    const offset = ref(DOCK_POPUP_GAP);
    watch(
        open,
        (isOpen) => {
            if (!isOpen) return;
            const el = trigger();
            const host = band?.value;
            const inset = el && host ? host.getBoundingClientRect().bottom - el.getBoundingClientRect().bottom : 0;
            offset.value = Math.max(0, inset) + DOCK_POPUP_GAP;
        },
        { flush: "sync" },
    );
    return offset;
}
