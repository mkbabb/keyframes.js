import { watch } from "vue";
import type { WatchSource } from "vue";
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
 * box. Under reduced motion the stage fades in at its new place (140 ms).
 *
 * On an upright phone the stage is laid out for the band above the opened
 * controls sheet (useStageReserve): when that reserve changes, the stage's
 * glide wrapper is carried the same way from where it stood, and where its
 * new box is larger than the old it starts at the old box's size (a uniform
 * scale), so a stage growing back to the screen never starts cut at its
 * edges.
 *
 * Inert during a scene swap (the view transition carries that change), and on
 * a short landscape phone, whose side sheet answers its lift on the glide's
 * own tokens.
 */
export function useStageSlide(
    cell: () => HTMLElement | null | undefined,
    open: () => boolean,
    glide: () => HTMLElement | null | undefined,
    layoutReserve: () => string,
): void {
    const desktop = useMediaQuery("(min-width: 1024px)");
    const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
    carryOnChange(open, () => (desktop.value ? cell() : null), () => reduced.value, false);
    carryOnChange(layoutReserve, () => (desktop.value ? null : glide()), () => reduced.value, true);
}

const swapping = (): boolean => {
    try {
        return document.documentElement.matches(":active-view-transition");
    } catch {
        return false;
    }
};

/** When `source` changes, carry `target()` from its painted place before the
 *  change to where it lays out after it (`fit`: from no larger than it was). */
function carryOnChange(
    source: WatchSource<unknown>,
    target: () => HTMLElement | null | undefined,
    reduced: () => boolean,
    fit: boolean,
): void {
    let from: DOMRect | null = null;
    watch(
        source,
        () => {
            const el = target();
            from = el && !swapping() ? el.getBoundingClientRect() : null;
        },
        { flush: "pre" },
    );
    watch(
        source,
        () => {
            const el = target();
            const start = from;
            from = null;
            if (!el || !start) return;
            el.style.transition = "none";
            el.style.translate = "";
            el.style.scale = "";
            const end = el.getBoundingClientRect();
            const dx = start.left + start.width / 2 - (end.left + end.width / 2);
            const dy = start.top + start.height / 2 - (end.top + end.height / 2);
            const s = fit && end.width > 0 && end.height > 0
                ? Math.min(1, start.width / end.width, start.height / end.height)
                : 1;
            if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && s > 0.995) {
                el.style.transition = "";
                return;
            }
            if (reduced()) {
                // A short fade where it now lays out: a Web Animation, since
                // glass's reduced-motion rule zeroes every CSS transition.
                el.style.transition = "";
                el.animate?.([{ opacity: 0 }, { opacity: 1 }], { duration: 140, easing: "ease-out" });
                return;
            }
            el.style.translate = `${dx}px ${dy}px`;
            if (s < 0.995) el.style.scale = String(s);
            void el.offsetWidth;
            el.style.transition = "";
            el.style.translate = "";
            el.style.scale = "";
        },
        { flush: "post" },
    );
}
