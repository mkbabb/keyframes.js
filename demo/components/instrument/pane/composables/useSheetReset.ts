import { inject, onBeforeUnmount, onMounted, shallowRef, type ComputedRef, type InjectionKey, type Ref } from "vue";

/**
 * The upright phone sheet's Reset (to the start).
 *
 * An upright phone's opened sheet offers Reset, the verb the dock leaves out
 * at rest. Where the scene has two or more channels it shares the sheet's head
 * row with the channel select. Where it has one (easing, sequence), the
 * section the sheet holds carries Reset on a labelled row of its own at its
 * foot (owner, 23 Nov), and the sheet's head row gives way while it does. (It
 * had stood alone in the head row, then in the section's own header, where on
 * sequence it stood one seat from the stagger's reset: two back glyphs in one
 * header.)
 */
export interface SheetReset {
    /** A surface should carry Reset, at its foot (an upright phone, one channel). */
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

/** A surface's side: whether it shows Reset at its foot, and the verb. */
export function useSheetReset(): { shown: ComputedRef<boolean> | Readonly<Ref<boolean>>; reset: () => void } {
    const seat = inject(SHEET_RESET_KEY, null);
    if (!seat) return { shown: shallowRef(false), reset: () => {} };
    let release: (() => void) | null = null;
    onMounted(() => (release = seat.claim()));
    onBeforeUnmount(() => release?.());
    return { shown: seat.inRow, reset: seat.reset };
}
