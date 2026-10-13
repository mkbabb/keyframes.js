import { onBeforeUnmount, shallowRef, watch } from "vue";
import type { Ref, ShallowRef } from "vue";

/**
 * X-DS r4 pass 5 (KF-C24-01) — THE FOLD NEVER LANDS IN A GAP.
 *
 * The desktop rail's surface scroller (`.controls-surface`, glass
 * `FadingScroll`) is bounded by the work band, so a facet taller than the band
 * scrolls. Where the fold fell was luck: at 1440x900 it fell in the gap under
 * the spring presets, so the pane ended on the preset divider, ~27 px of blank
 * and the ribbon's rule, the 16 px end fade fell on nothing, and the rest of
 * the facet vanished with no cue (KF-C14-01 / KF-C15-01 broken by the C23
 * band). This generalises the C15 rule from the spring figure to every facet
 * and every scene:
 *
 *   • a row that starts above the end fade and runs under it IS the cue that
 *     the content continues, and the scroller is left alone;
 *   • otherwise the scroller ends exactly on the foot of the last whole row
 *     above the fold (a trailing separator or gap goes under the fold with the
 *     rest), and the frame closes up under it.
 *
 * X-DS r4 pass 6 (KF-C25-01) — A ROW THE FOLD SITS ON IS WHOLE, SO NO FADE
 * LIES ON IT. Glass FadingScroll's 16 px end fade is a "more below" cue; laid
 * over a complete row it erased the row's foot (Bouncy and Gentle at 1440x900
 * lost their bottom border and corners, the easing pill at 1280x800 faded into
 * the ribbon's rule). Moving the cap one fade lower does not work: the gap from
 * a row to the separator under it (8 px) is narrower than the fade, so the
 * separator then sat half-faded 8 px above the ribbon's rule, a doubled
 * hairline. So when the fold sits on a foot, the scroller's END fade is off
 * (FadingScroll's own `fadeEnd`): the row and the ribbon's rule close the
 * frame cleanly. The moment the reader scrolls, the fade returns, and with it
 * the cue for whatever is still below; back at the top, it lands again.
 *
 * X-DS r5 pass 3 (KF-C3R-01) — THE FOOT AND THE RIBBON'S RULE ARE TWO LINES.
 * Landed exactly on the foot, a bordered row (the spring preset tiles at
 * 1440x900) drew its bottom border on the ribbon's hairline: one doubled edge.
 * The scroller now ends one row gap below the foot (its own
 * `scroll-padding-block-end`, ControlsPaneWrapper.css), and never as far as
 * the next row or separator, which stay under the fold.
 *
 * X-DS r5 pass 4 (KF-C4-03) — THE FOLD NEVER CUTS A LINE OF TEXT. A row under
 * the fold was left wherever the fold fell, so at 1280x800 the spring preset
 * tiles were sliced through their value line, while the widths either side
 * landed on a foot. One rule now, in three outcomes the geometry picks:
 *
 *   • the fold cuts no text and the fade lies on none (it crosses a figure,
 *     such as the heatmap's canvas, or a field): the crossing row is the cue,
 *     as before;
 *   • it would cut the text of a boxed row (a tile): the scroller ends where
 *     that box's own text begins, so the box's top edge and leading padding sit
 *     under the fade and its text is under the fold. The box edge is the cue;
 *   • it would cut any other row's text: the scroller lands on the foot above.
 *
 * A row whose foot is nearer the fold than one row gap counts as cut: it has no
 * room for the air KF-C3R-01 gives a foot.
 *
 * "Rows" are what paints: an element with its own text, a replaced element, or
 * a painted box (fill or border); hairline separators and empty layout boxes
 * are not content. It runs only when the scroller's content or the viewport
 * resizes, never per frame, and it writes one `max-block-size` per scroller.
 */
const SURFACE = ".controls-surface";
const SEPARATOR = "[data-slot=separator],[role=separator],hr";
/** The tallest box that is still a row (a field, a tile), in fade widths: 96 px
 *  at glass's 16 px fade. The rail's figures (the plot, the heatmap, the code
 *  well) are floored well above it. */
const ROW_MAX_FADES = 6;
const REPLACED = new Set(["IMG", "CANVAS", "VIDEO", "INPUT", "TEXTAREA", "SELECT", "svg"]);

interface Span {
    top: number;
    bottom: number;
    /** The element's own text (a line the fold must not cut), not a box or a figure. */
    text: boolean;
}

const transparent = (color: string) =>
    color === "transparent" || /rgba?\([^)]*,\s*0\)$/.test(color) || / \/ 0\)$/.test(color);

function paints(cs: CSSStyleDeclaration): boolean {
    if (!transparent(cs.backgroundColor) || cs.backgroundImage !== "none") return true;
    for (const side of ["Top", "Bottom", "Left", "Right"] as const) {
        const width = Number.parseFloat(cs.getPropertyValue(`border-${side.toLowerCase()}-width`));
        const style = cs.getPropertyValue(`border-${side.toLowerCase()}-style`);
        const color = cs.getPropertyValue(`border-${side.toLowerCase()}-color`);
        if (width > 0 && style !== "none" && !transparent(color)) return true;
    }
    return false;
}

const ownText = (el: Element) =>
    [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim() !== "");

/** The painted spans of a scroller's content, in its unscrolled content box. */
function contentSpans(scroller: HTMLElement): Span[] {
    const origin = scroller.getBoundingClientRect().top + scroller.clientTop - scroller.scrollTop;
    const clips = new Map<Element, { top: number; bottom: number } | null>();
    // The block range an ancestor that clips its overflow lets through (null: none).
    const clipOf = (el: Element): { top: number; bottom: number } | null => {
        if (clips.has(el)) return clips.get(el)!;
        let clip: { top: number; bottom: number } | null = null;
        if (el !== scroller) {
            const parent = el.parentElement;
            const above = parent ? clipOf(parent) : null;
            const cs = getComputedStyle(el);
            clip = above;
            if (cs.overflowY !== "visible") {
                const r = el.getBoundingClientRect();
                clip = {
                    top: Math.max(r.top, above?.top ?? -Infinity),
                    bottom: Math.min(r.bottom, above?.bottom ?? Infinity),
                };
            }
        }
        clips.set(el, clip);
        return clip;
    };
    const spans: Span[] = [];
    for (const el of scroller.querySelectorAll("*")) {
        if (el instanceof SVGElement && el.tagName !== "svg") continue;
        if (el.matches(SEPARATOR)) continue;
        const r = el.getBoundingClientRect();
        if (r.width <= 1 || r.height <= 1) continue;
        const replaced = REPLACED.has(el.tagName);
        const text = !replaced && ownText(el);
        // A force-mounted surface held under `content-visibility: hidden` (the
        // cached Keyframes pane) still reports boxes; it paints nothing. Opacity
        // is not asked: a surface mid fade-in is content that is arriving.
        if (!el.checkVisibility({ contentVisibilityAuto: true, visibilityProperty: true })) continue;
        const cs = getComputedStyle(el);
        if (!replaced && !text && !paints(cs)) continue;
        const clip = el.parentElement ? clipOf(el.parentElement) : null;
        const top = Math.max(r.top, clip?.top ?? -Infinity);
        const bottom = Math.min(r.bottom, clip?.bottom ?? Infinity);
        if (bottom - top <= 1) continue;
        spans.push({ top: top - origin, bottom: bottom - origin, text });
    }
    return spans;
}

/** The tops of the scroller's visible separators, in its unscrolled content box. */
function ruleTops(scroller: HTMLElement): number[] {
    const origin = scroller.getBoundingClientRect().top + scroller.clientTop - scroller.scrollTop;
    return [...scroller.querySelectorAll(SEPARATOR)]
        .filter((el) => el.checkVisibility({ contentVisibilityAuto: true, visibilityProperty: true }))
        .map((el) => el.getBoundingClientRect().top - origin);
}

function fadePx(scroller: HTMLElement): number {
    const raw = getComputedStyle(scroller).getPropertyValue("--fade-scroll-width").trim();
    const n = Number.parseFloat(raw);
    if (!Number.isFinite(n)) return 16;
    return raw.endsWith("rem")
        ? n * Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
        : n;
}

/**
 * Land one scroller's fold on content: a row under the fade (`"cue"`, its text
 * never cut), or one row gap under a row's foot (`"foot"`, where the end fade
 * must be off); `"none"` when nothing overflows or no row can be landed on.
 */
export function landFold(scroller: HTMLElement): "cue" | "foot" | "none" {
    scroller.style.maxBlockSize = "";
    const fold = scroller.clientHeight;
    if (fold === 0 || scroller.scrollHeight - fold <= 1) return "none";
    const fade = fadePx(scroller);
    const chrome = scroller.offsetHeight - fold;
    // One row gap of air under a foot (KF-C3R-01). A row whose foot is nearer
    // the fold than that is not whole: its edge would sit on the ribbon's rule.
    const gap = Number.parseFloat(getComputedStyle(scroller).scrollPaddingBlockEnd) || 0;
    const line = fold - gap;
    const spans = contentSpans(scroller);
    if (spans.some((s) => s.top <= fold - fade && s.bottom > line)) {
        // Text the fold cuts, or the fade lies on (a line under the fade is
        // erased as surely as one under the fold).
        const texts = spans.filter((s) => s.text);
        if (!texts.some((s) => s.top < fold && s.bottom > fold - fade)) return "cue";
        // The innermost box across the fold: the row, when it is a boxed one.
        const boxes = spans.filter((s) => !s.text && s.top < fold && s.bottom > line);
        if (boxes.length > 0) {
            const box = boxes.reduce((a, b) => (b.top > a.top ? b : a));
            const inside = texts.filter((s) => s.top >= box.top && s.bottom <= box.bottom);
            const peek = Math.floor(Math.min(fold, ...inside.map((s) => s.top)));
            // The box's top edge has to sit under the fade, with at least half
            // the fade of it showing, and no earlier line may lie in the fade.
            const shown = peek - box.top;
            const clear = !texts.some((s) => s.top < peek && s.bottom > peek - fade);
            if (shown >= fade / 2 && shown <= fade && clear) {
                scroller.style.maxBlockSize = `${peek + chrome}px`;
                return "cue";
            }
            // No edge to show: a figure (taller than a row) still runs under
            // the fold, since landing above it would hide it whole; a row
            // goes under the fold whole, below.
            if (box.bottom - box.top > ROW_MAX_FADES * fade) return "cue";
        }
    }
    const limit = Math.min(fold, ...spans.filter((s) => s.bottom > line).map((s) => s.top));
    const feet = spans.filter((s) => s.bottom <= limit).map((s) => s.bottom);
    if (feet.length === 0) return "none";
    const foot = Math.ceil(Math.max(...feet));
    // The air under the foot stops short of whatever paints next.
    const next = [...spans.map((s) => s.top), ...ruleTops(scroller)].filter((top) => top >= foot);
    const end = Math.max(foot, Math.min(foot + gap, fold, ...next.map(Math.floor)));
    scroller.style.maxBlockSize = `${end + chrome}px`;
    return "foot";
}

/**
 * Keep every desktop rail scroller's fold on content while `rail` is mounted.
 * Returns the `data-fold-key`s of the scrollers whose fold sits on a row's foot
 * while they rest at the top; the host binds `fadeEnd` off for those (KF-C25-01).
 */
export function useFoldLanding(
    rail: Ref<HTMLElement | null | undefined>,
): Readonly<ShallowRef<ReadonlySet<string>>> {
    const footed = shallowRef<ReadonlySet<string>>(new Set());
    const setFooted = (next: Set<string>) => {
        const prev = footed.value;
        if (next.size !== prev.size || [...next].some((k) => !prev.has(k))) footed.value = next;
    };
    let frame = 0;
    const observed = new Set<Element>();
    const resize = new ResizeObserver(() => schedule());
    const land = () => {
        frame = 0;
        const root = rail.value;
        if (!root) return;
        const scrollers = [...root.querySelectorAll<HTMLElement>(SURFACE)];
        const contents = new Set(scrollers.flatMap((s) => [...s.children]));
        for (const el of observed) if (!contents.has(el)) { resize.unobserve(el); observed.delete(el); }
        for (const el of contents) if (!observed.has(el)) { resize.observe(el); observed.add(el); }
        const next = new Set<string>();
        for (const s of scrollers) {
            if (!s.offsetParent) continue;
            const key = s.dataset.foldKey;
            if (landFold(s) === "foot" && key && s.scrollTop === 0) next.add(key);
        }
        setFooted(next);
    };
    // Scrolled off the top, the end fade is the cue again; back at the top, re-land.
    const onScroll = (event: Event) => {
        const s = event.target;
        if (!(s instanceof HTMLElement) || !s.matches(SURFACE)) return;
        const key = s.dataset.foldKey;
        if (s.scrollTop > 0) {
            if (key && footed.value.has(key)) setFooted(new Set([...footed.value].filter((k) => k !== key)));
        } else schedule();
    };
    function schedule() {
        frame ||= requestAnimationFrame(land);
    }
    // A channel or surface swap re-creates scrollers or their content.
    const mutations = new MutationObserver(() => {
        const root = rail.value;
        if (!root) return;
        const children = new Set([...root.querySelectorAll(SURFACE)].flatMap((s) => [...s.children]));
        if (children.size !== observed.size || [...children].some((c) => !observed.has(c))) schedule();
    });
    // The rail's own box moves when the work band settles (its bound is the
    // band's): the fold moves with it. Landing re-writes the same cap, so the
    // rail settles after one extra pass.
    watch(
        rail,
        (root, previous) => {
            mutations.disconnect();
            if (previous) {
                resize.unobserve(previous);
                previous.removeEventListener("transitionend", schedule);
                previous.removeEventListener("animationend", schedule);
                previous.removeEventListener("scroll", onScroll, true);
            }
            if (root) {
                mutations.observe(root, { childList: true, subtree: true });
                resize.observe(root);
                // A surface swap's enter motion settles the rows' final boxes.
                root.addEventListener("transitionend", schedule);
                root.addEventListener("animationend", schedule);
                root.addEventListener("scroll", onScroll, { capture: true, passive: true });
            }
            schedule();
        },
        { immediate: true, flush: "post" },
    );
    window.addEventListener("resize", schedule);
    onBeforeUnmount(() => {
        window.removeEventListener("resize", schedule);
        mutations.disconnect();
        resize.disconnect();
        rail.value?.removeEventListener("scroll", onScroll, true);
        if (frame) cancelAnimationFrame(frame);
    });
    return footed;
}
