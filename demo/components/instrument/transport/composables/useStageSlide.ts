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
 * box.
 *
 * On an upright phone the stage is laid out for the band above the opened
 * controls sheet (useStageReserve). When that reserve changes, a subject laid
 * out by the band (the cube's die, centred in it and sized by it) is carried
 * from its painted place and size to its new ones: the glide wrapper takes
 * the difference as a translate and a scale and lets it go on the dock
 * spring. A card fills its band from the band's top, which does not move, and
 * reflows in place: its type keeps its size, and its lower edge moves under
 * the sheet. It is not re-laid out for the new band in one frame: the band's
 * foot (the cell's block-end padding) walks from where it stood to where it
 * now lies, on the sheet's own arrival spring as the sheet comes and on the
 * dock spring as it goes, so the card's lower edge travels with the sheet and
 * what it holds (a plot, the lanes, a catalogue) gives up or takes back its
 * height over the walk. A walk turns round from where it stands.
 *
 * Under reduced motion nothing travels: the stage fades out where it stood
 * and in where it now lays out (70 ms out, 110 ms in), its change made at the
 * turn, unseen.
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
    walkOnChange(layoutReserve, () => (desktop.value ? null : cell()), glide, () => reduced.value);
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
                // Out where it stood, in where it now lays out.
                fadeThrough(
                    el,
                    () => {
                        el.style.translate = `${dx}px ${dy}px`;
                        if (s !== 1) el.style.scale = String(s);
                    },
                    () => {
                        el.style.translate = "";
                        el.style.scale = "";
                        el.style.transition = "";
                    },
                );
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

const OUT_MS = 70;
const IN_MS = 110;
/** The fade now running on a stage element (reduced motion). */
const veils = new WeakMap<HTMLElement, Animation>();

/** Reduced motion: the stage fades out where it stood and in where it now
 *  lays out, so its change lands unseen at the turn and nothing changes
 *  between two frames (content of two sizes goes out, then in). `hold` keeps
 *  it where it stood through the out; `release` lets it go to its new place.
 *  Web Animations, since glass's reduced-motion rule zeroes every CSS
 *  transition. A fade already running turns round from where it is. */
function fadeThrough(el: HTMLElement, hold: () => void, release: () => void): void {
    const shown = Number(getComputedStyle(el).opacity);
    veils.get(el)?.cancel();
    veils.delete(el);
    if (typeof el.animate !== "function") return release();
    const rise = (from: number): void => {
        const up = el.animate([{ opacity: from }, { opacity: 1 }], {
            duration: Math.max(1, IN_MS * (1 - from)),
            easing: "ease-out",
        });
        veils.set(el, up);
        up.finished.then(
            () => {
                if (veils.get(el) === up) veils.delete(el);
            },
            () => {},
        );
    };
    if (!(shown >= 0.5)) {
        release();
        rise(Number.isFinite(shown) ? shown : 0);
        return;
    }
    hold();
    const down = el.animate([{ opacity: shown }, { opacity: 0 }], { duration: OUT_MS, easing: "ease-in", fill: "forwards" });
    veils.set(el, down);
    down.finished.then(
        () => {
            if (veils.get(el) !== down) return;
            release();
            rise(0);
            down.cancel();
        },
        () => {},
    );
}

/** The foot of the band the stage is laid out in: the cell's block-end
 *  padding as it now computes, a running walk's value included. */
const bandFoot = (cell: HTMLElement): number => parseFloat(getComputedStyle(cell).paddingBlockEnd) || 0;

/** One of glass's springs, read off its tokens: the `linear()` curve and its
 *  own clock (the spring's settle times the motion tempo). A duration of 0
 *  when the tokens are not there. */
const glassSpring = (el: HTMLElement, name: "bloom" | "dock"): { duration: number; easing: string } => {
    const cs = getComputedStyle(el);
    const settle = cs.getPropertyValue(`--spring-${name}-settle`).trim();
    const n = parseFloat(settle);
    const tempo = parseFloat(cs.getPropertyValue("--motion-tempo"));
    const duration = Number.isFinite(n) ? (settle.endsWith("ms") ? n : n * 1000) * (Number.isFinite(tempo) ? tempo : 1) : 0;
    return { duration, easing: cs.getPropertyValue(`--spring-${name}`).trim() };
};

/** When `source` changes and the stage holds a card (nothing the glide can
 *  carry), walk the cell's block-end padding from its painted value to its
 *  new one, so the card re-lays out over the walk and never in one frame.
 *  Making room, it rides the sheet's own arrival spring (glass's detent sheet
 *  travels on `bloom`), so its foot keeps with the sheet's top edge; taking
 *  the room back, it rides the dock spring, the glide's clock, and is done as
 *  the sheet's fade is. The walk is a Web Animation on the padding: a box
 *  whose content must reflow into its new band cannot be carried on a
 *  transform without drawing its type and plots at the wrong size. A change
 *  mid-walk turns round from where the foot stands. Reduced motion, or no
 *  spring to ride: the card fades out at the size it stood and in at its new
 *  one (fadeThrough). */
function walkOnChange(
    source: WatchSource<unknown>,
    cell: () => HTMLElement | null | undefined,
    glide: () => HTMLElement | null | undefined,
    reduced: () => boolean,
): void {
    let from: number | null = null;
    let walk: Animation | null = null;
    watch(
        source,
        () => {
            const c = cell();
            const g = glide();
            from = c && g && !swapping() && !subjectOf(g) ? bandFoot(c) : null;
        },
        { flush: "pre" },
    );
    watch(
        source,
        () => {
            const c = cell();
            const g = glide();
            const was = from;
            from = null;
            // The new foot is read with no walk on it.
            walk?.cancel();
            walk = null;
            if (!c || !g || was === null) return;
            const to = bandFoot(c);
            if (Math.abs(to - was) < 0.5) return;
            const spring = reduced() ? null : glassSpring(g, to > was ? "bloom" : "dock");
            if (!spring?.duration || typeof c.animate !== "function") {
                let keep: Animation | null = null;
                fadeThrough(
                    g,
                    () => {
                        const at = { paddingBlockEnd: `${was}px` };
                        keep = walk = c.animate?.([at, at], { duration: OUT_MS, fill: "forwards" }) ?? null;
                    },
                    () => {
                        keep?.cancel();
                        if (walk === keep) walk = null;
                    },
                );
                return;
            }
            const frames = [{ paddingBlockEnd: `${was}px` }, { paddingBlockEnd: `${to}px` }];
            let next: Animation;
            try {
                next = c.animate(frames, { duration: spring.duration, easing: spring.easing || "ease-out" });
            } catch {
                // A curve this engine cannot read (a `linear()` token on an older one).
                next = c.animate(frames, { duration: spring.duration, easing: "ease-out" });
            }
            walk = next;
            next.finished.then(
                () => {
                    if (walk === next) walk = null;
                },
                () => {},
            );
        },
        { flush: "post" },
    );
}
