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
 * controls sheet (useStageReserve). When that reserve changes, a subject laid
 * out by the band (the cube's die, centred in it and sized by it) is carried
 * from its painted place and size to its new ones: the glide wrapper takes
 * the difference as a translate and a scale and lets it go on the dock
 * spring. A card fills its band from the band's top, which does not move, and
 * reflows in place: its type keeps its size, and its lower edge moves under
 * the sheet.
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
    carryOnChange(open, () => (desktop.value ? cell() : null), (el) => el, () => reduced.value);
    carryOnChange(layoutReserve, () => (desktop.value ? null : glide()), subjectOf, () => reduced.value);
}

/** The first box down the glide's line of only children that does not fill
 *  the glide: a subject the band lays out (the die). None when the line ends
 *  first, as on a card that fills the band. */
function subjectOf(glide: HTMLElement): HTMLElement | null {
    const g = glide.getBoundingClientRect();
    let el: Element = glide;
    for (let depth = 0; depth < 6; depth++) {
        const shown = [...el.children].filter((c) => c.getBoundingClientRect().width > 0);
        const only = shown.length === 1 ? shown[0] : undefined;
        if (!only) return null;
        el = only;
        const r = el.getBoundingClientRect();
        const fills =
            Math.abs(r.left - g.left) < 1 && Math.abs(r.top - g.top) < 1 && Math.abs(r.right - g.right) < 1 && Math.abs(r.bottom - g.bottom) < 1;
        if (!fills) return el instanceof HTMLElement ? el : null;
    }
    return null;
}

const swapping = (): boolean => {
    try {
        return document.documentElement.matches(":active-view-transition");
    } catch {
        return false;
    }
};

/** When `source` changes, carry `target()` so that its `subject` (the target
 *  itself on the desktop) starts from its painted place before the change and
 *  goes to where it lays out after it. A subject other than the target also
 *  keeps its painted size (a uniform scale about the target's centre). */
function carryOnChange(
    source: WatchSource<unknown>,
    target: () => HTMLElement | null | undefined,
    subject: (el: HTMLElement) => HTMLElement | null,
    reduced: () => boolean,
): void {
    let from: { box: HTMLElement; rect: DOMRect } | null = null;
    watch(
        source,
        () => {
            const el = target();
            const box = el && !swapping() ? subject(el) : null;
            from = box ? { box, rect: box.getBoundingClientRect() } : null;
        },
        { flush: "pre" },
    );
    watch(
        source,
        () => {
            const el = target();
            const was = from;
            from = null;
            if (!el || !was || !was.box.isConnected) return;
            el.style.transition = "none";
            el.style.translate = "";
            el.style.scale = "";
            const start = was.rect;
            const end = was.box.getBoundingClientRect();
            const s = was.box !== el && end.width > 0 ? Math.min(2, Math.max(0.5, start.width / end.width)) : 1;
            // Scaled about the target's centre o, the subject's centre p lands
            // at o + s(p - o); the translate takes it on to where it stood.
            const o = el.getBoundingClientRect();
            const ox = o.left + o.width / 2;
            const oy = o.top + o.height / 2;
            const dx = start.left + start.width / 2 - (ox + s * (end.left + end.width / 2 - ox));
            const dy = start.top + start.height / 2 - (oy + s * (end.top + end.height / 2 - oy));
            if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(s - 1) < 0.005) {
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
            if (s !== 1) el.style.scale = String(s);
            void el.offsetWidth;
            el.style.transition = "";
            el.style.translate = "";
            el.style.scale = "";
        },
        { flush: "post" },
    );
}
