import { inject, onBeforeUnmount, onMounted, shallowRef, type ComputedRef, type InjectionKey, type Ref } from "vue";

/**
 * P2d — the upright phone sheet's Reset, where a row already stands.
 *
 * An upright phone's opened sheet leads with Reset (to the start), the verb the
 * dock leaves out at rest. Where the scene has two or more channels it shares
 * its row with the channel select. Where it has one, a Reset alone took a whole
 * row of a 304 px sheet (easing, sequence). There the surface that heads the
 * sheet carries Reset in its own first row instead (the Stagger header, the
 * easing duration row), and the sheet's head row gives way while it does.
 */
export interface SheetReset {
    /** A surface's first row should carry Reset (an upright phone, one channel). */
    inRow: Readonly<Ref<boolean>>;
    reset: () => void;
    /** A surface carries Reset while mounted; returns its release. */
    claim: () => () => void;
}

export const SHEET_RESET_KEY: InjectionKey<SheetReset> = Symbol("sheet-reset");

/** The pane host's side: the claims, and whether the head row gives way. */
export function provideSheetReset(inRow: Readonly<Ref<boolean>>, reset: () => void) {
    const claims = shallowRef(0);
    const api: SheetReset = {
        inRow,
        reset,
        claim: () => {
            claims.value++;
            let held = true;
            return () => {
                if (!held) return;
                held = false;
                claims.value--;
            };
        },
    };
    return { api, carried: (): boolean => inRow.value && claims.value > 0 };
}

/** A surface's side: whether its first row shows Reset, and the verb. */
export function useSheetReset(): { shown: ComputedRef<boolean> | Readonly<Ref<boolean>>; reset: () => void } {
    const seat = inject(SHEET_RESET_KEY, null);
    if (!seat) return { shown: shallowRef(false), reset: () => {} };
    let release: (() => void) | null = null;
    onMounted(() => (release = seat.claim()));
    onBeforeUnmount(() => release?.());
    return { shown: seat.inRow, reset: seat.reset };
}
