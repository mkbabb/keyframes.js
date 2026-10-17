import { onBeforeUnmount, shallowRef, watch } from "vue";
import type { InjectionKey, Ref, ShallowRef } from "vue";

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
/**
 * X-DS r8 pass 7 (KF-C7-01) — the rail's scroll PORTS: every surface scroller
 * (`.controls-surface`) and a bounded facet's own body port (the `.pane-bounded`
 * idiom, ControlsPaneWrapper.css), each marked with its `data-fold-key`. A
 * bounded facet keeps its title row above its port, so the pane never scrolls
 * its own name away; the port under the title lands like any other.
 */
const PORT = "[data-fold-key]";
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
        // X-DS r7 pass 7 — text INSIDE a figure is the figure's own content
        // (the Keyframes code well's lines): the fold crossing it is the
        // figure running under the fold, the cue. Only the innermost box was
        // asked, a line-height overlay inside Monaco, so the scroller landed
        // on the foot above the well and the 71 px port hid the editor whole.
        const cut = texts.filter((s) => s.top < fold && s.bottom > fold - fade);
        const figures = boxes.filter((s) => s.bottom - s.top > ROW_MAX_FADES * fade);
        if (cut.every((t) => figures.some((f) => f.top <= t.top && f.bottom >= t.bottom))) return "cue";
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
 * X-DS r8 pass 7 (KF-C7-01) — THE TOP EDGE IS PLACED TOO. A port pinned at
 * its END (a figure the reader opened, revealed whole above the fold) stopped
 * wherever `scrollHeight - clientHeight` fell: through a title row's letters at
 * 1440x1080, through the preset tiles' names at 1280x800.
 *
 * X-DS r8 pass 8 (KF-C8-01) — THE TOP EDGE CUTS NO ROW. Placed by text alone,
 * the edge still crossed what paints without text: at 1440x1080 the response
 * slider's violet fill showed as a bare bar under the 'Physics' title, its
 * label and readout scrolled away; at 1440x900 and 1280x800 the Smooth/Snappy
 * tiles' lower borders. A row is the label and the control together, so the
 * edge is placed by ROWS: every box at most a row tall (a field, a tile, a
 * label-and-slider pair) that the edge would cross goes above it whole, and a
 * separator left at the edge goes with the row it closes. The edge then sits
 * in the gap between two rows, so the port's START fade is off there (the
 * mirror of KF-C25-01's foot, returned as `true`): no fade lies on the first
 * whole row, and the moment the reader scrolls up the fade is back as the cue.
 * The cap is first cleared, so the port takes the frame's free block before
 * any row is given up (the free plate under the ribbon was the old cap's).
 * The port stays at its end, and never gives up more than half its block (the
 * figure the pin revealed stays whole).
 */
export function landStart(scroller: HTMLElement): boolean {
    const headed = placeStart(scroller);
    // The rail host reads the mark on its next scroll or landing (FOLD_EDGES_KEY).
    scroller.toggleAttribute("data-fold-headed", headed);
    return headed;
}

function placeStart(scroller: HTMLElement): boolean {
    if (scroller.clientHeight === 0) return false;
    if (scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop > 1) return false;
    scroller.style.maxBlockSize = "";
    const fold = scroller.clientHeight;
    const reach = scroller.scrollHeight - fold;
    scroller.scrollTop = scroller.scrollHeight;
    if (reach <= 1) return false;
    const fade = fadePx(scroller);
    const origin = scroller.getBoundingClientRect().top + scroller.clientTop - scroller.scrollTop;
    const boxes: { top: number; bottom: number; figure: boolean }[] = [];
    for (const el of scroller.querySelectorAll("*")) {
        if (el instanceof SVGElement && el.tagName !== "svg") continue;
        if (el.matches(SEPARATOR)) continue;
        const r = el.getBoundingClientRect();
        if (r.width <= 1 || r.height <= 1) continue;
        if (!el.checkVisibility({ contentVisibilityAuto: true, visibilityProperty: true })) continue;
        const tall = r.height > ROW_MAX_FADES * fade;
        // A figure paints (a plot, a well, a canvas); a tall layout box is a group of rows.
        const figure = tall && (REPLACED.has(el.tagName) || paints(getComputedStyle(el)));
        boxes.push({ top: r.top - origin, bottom: r.bottom - origin, figure });
    }
    const rows = boxes.filter((b) => b.bottom - b.top <= ROW_MAX_FADES * fade);
    const crosses = (b: { top: number; bottom: number }, at: number) => b.top < at - 0.5 && b.bottom > at + 0.5;
    let top = reach;
    for (;;) {
        const cut = rows.filter((b) => crosses(b, top));
        if (cut.length === 0) break;
        top = Math.ceil(Math.max(...cut.map((b) => b.bottom)));
    }
    // A separator between the edge and the next row closes the row above it.
    const next = Math.min(Infinity, ...rows.filter((b) => b.top >= top - 0.5).map((b) => b.top));
    const rules = ruleTops(scroller).filter((t) => t >= top - 0.5 && t < next);
    if (rules.length > 0) top = Math.min(next, Math.ceil(Math.max(...rules) + 1));
    const block = scroller.scrollHeight - top;
    if (block < fold / 2) return false;
    if (top > reach) scroller.style.maxBlockSize = `${block + scroller.offsetHeight - fold}px`;
    scroller.scrollTop = scroller.scrollHeight;
    // A figure (taller than a row) the edge crosses keeps the fade as its cue.
    return !boxes.some((b) => b.figure && crosses(b, top));
}

/** The desktop rail's landed port edges, by `data-fold-key`: `footed` ports
 *  rest at their top with the fold on a row's foot (end fade off, KF-C25-01);
 *  `headed` ports rest at their end with the top edge in a gap between rows
 *  (start fade off, KF-C8-01). */
export interface FoldEdges {
    footed: ReadonlySet<string>;
    headed: ReadonlySet<string>;
}

/** The rail's landed edges, provided by the rail host for a facet that bounds
 *  its own port under its title; null on the phone sheet. */
export const FOLD_EDGES_KEY: InjectionKey<Readonly<Ref<FoldEdges | null>>> = Symbol("fold-edges");

/**
 * Keep every desktop rail scroller's fold on content while `rail` is mounted.
 * Returns the landed edges by `data-fold-key`: `footed`, the scrollers whose
 * fold sits on a row's foot while they rest at the top (the host binds
 * `fadeEnd` off, KF-C25-01); `headed`, those resting at their end with the top
 * edge between rows (the host binds `fadeStart` off, KF-C8-01).
 */
export function useFoldLanding(
    rail: Ref<HTMLElement | null | undefined>,
): Readonly<ShallowRef<FoldEdges>> {
    const edges = shallowRef<FoldEdges>({ footed: new Set(), headed: new Set() });
    const same = (a: ReadonlySet<string>, b: ReadonlySet<string>) =>
        a.size === b.size && [...a].every((k) => b.has(k));
    const setEdges = (footed: ReadonlySet<string>, headed: ReadonlySet<string>) => {
        const prev = edges.value;
        if (!same(footed, prev.footed) || !same(headed, prev.headed)) edges.value = { footed, headed };
    };
    let frame = 0;
    const observed = new Set<Element>();
    const resize = new ResizeObserver(() => schedule());
    const land = () => {
        frame = 0;
        const root = rail.value;
        if (!root) return;
        const scrollers = [...root.querySelectorAll<HTMLElement>(PORT)];
        const contents = new Set(scrollers.flatMap((s) => [...s.children]));
        for (const el of observed) if (!contents.has(el)) { resize.unobserve(el); observed.delete(el); }
        for (const el of contents) if (!observed.has(el)) { resize.observe(el); observed.add(el); }
        const footed = new Set<string>();
        const headed = new Set<string>();
        for (const s of scrollers) {
            if (!s.offsetParent) continue;
            const key = s.dataset.foldKey;
            // X-DS r8 pass 6 (KF-C6c-01) — a scroller resting at its END stays
            // there. Re-capping clears the cap first (the browser clamps
            // scrollTop to the taller port) and then lowers it, which grows the
            // scroll range back under a scrollTop that no longer reaches it: the
            // spring figure the reader opened came to rest 10-22 px short of its
            // end, the fold through its response-axis caption.
            const atEnd = s.scrollTop > 0 && s.scrollHeight - s.clientHeight - s.scrollTop <= 1;
            const landed = landFold(s);
            if (atEnd) {
                s.scrollTop = s.scrollHeight;
                if (landStart(s) && key) headed.add(key);
            } else s.removeAttribute("data-fold-headed");
            if (landed === "foot" && key && s.scrollTop === 0) footed.add(key);
        }
        setEdges(footed, headed);
    };
    // Scrolled off the top, the end fade is the cue again; back at the top,
    // re-land. Scrolled off the end, the start fade is the cue again; back at a
    // landed end (`landStart`'s mark), it is off.
    const onScroll = (event: Event) => {
        const s = event.target;
        if (!(s instanceof HTMLElement) || !s.matches(PORT)) return;
        const key = s.dataset.foldKey;
        if (!key) return;
        const { footed, headed } = edges.value;
        const atEnd = s.scrollTop > 0 && s.scrollHeight - s.clientHeight - s.scrollTop <= 1;
        const nextHeaded = new Set([...headed].filter((k) => k !== key));
        if (atEnd && s.hasAttribute("data-fold-headed")) nextHeaded.add(key);
        if (s.scrollTop > 0) setEdges(new Set([...footed].filter((k) => k !== key)), nextHeaded);
        else {
            setEdges(footed, nextHeaded);
            schedule();
        }
    };
    function schedule() {
        frame ||= requestAnimationFrame(land);
    }
    // A channel or surface swap re-creates scrollers or their content.
    const mutations = new MutationObserver(() => {
        const root = rail.value;
        if (!root) return;
        const children = new Set([...root.querySelectorAll(PORT)].flatMap((s) => [...s.children]));
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
    return edges;
}
