import { watch } from "vue";
import { useMediaQuery } from "@vueuse/core";

/**
 * LAST-TEN KF-18 — on the desktop, opening or closing the controls pane moves
 * the stage on a transform. The [rail] track lands at once (one layout), and
 * the stage cell is carried from where it was to where it now lays out on
 * glass's dock spring (AnimationControlsGroup.css), so the stage never re-lays
 * out frame by frame through a grid-template-columns tween. The transform is
 * on the stage cell itself, the box whose place changes, so its painted place
 * never jumps (a layout shift is read off that box). A press mid-slide
 * reverses from the cell's current place: the start is read off its painted
 * box. Under reduced motion the stage fades in at its new place.
 *
 * Inert on the phone (the cell is fixed there and its glide is the sheet's)
 * and during a scene swap (the view transition carries that change).
 */
export function useStageSlide(
    cell: () => HTMLElement | null | undefined,
    open: () => boolean,
): void {
    const desktop = useMediaQuery("(min-width: 1024px)");
    const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
    let from: DOMRect | null = null;

    const swapping = (): boolean => {
        try {
            return document.documentElement.matches(":active-view-transition");
        } catch {
            return false;
        }
    };

    watch(
        open,
        () => {
            const el = cell();
            from = desktop.value && el && !swapping() ? el.getBoundingClientRect() : null;
        },
        { flush: "pre" },
    );

    watch(
        open,
        () => {
            const el = cell();
            const start = from;
            from = null;
            if (!el || !start) return;
            el.style.transition = "none";
            el.style.translate = "";
            el.style.opacity = "";
            const end = el.getBoundingClientRect();
            const dx = start.left + start.width / 2 - (end.left + end.width / 2);
            const dy = start.top + start.height / 2 - (end.top + end.height / 2);
            if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
                el.style.transition = "";
                return;
            }
            if (reduced.value) el.style.opacity = "0";
            else el.style.translate = `${dx}px ${dy}px`;
            void el.offsetWidth;
            el.style.transition = "";
            el.style.translate = "";
            el.style.opacity = "";
        },
        { flush: "post" },
    );
}
