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
 * "Rows" are what paints: an element with its own text, a replaced element, or
 * a painted box (fill or border); hairline separators and empty layout boxes
 * are not content. It runs only when the scroller's content or the viewport
 * resizes, never per frame, and it writes one `max-block-size` per scroller.
 */
const SURFACE = ".controls-surface";
const SEPARATOR = "[data-slot=separator],[role=separator],hr";
const REPLACED = new Set(["IMG", "CANVAS", "VIDEO", "INPUT", "TEXTAREA", "SELECT", "svg"]);

interface Span {
    top: number;
    bottom: number;
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
        spans.push({ top: top - origin, bottom: bottom - origin });
    }
    return spans;
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
 * Land one scroller's fold on content: a row under the fade (`"cue"`), or a
 * row's foot (`"foot"`, where the end fade must be off); `"none"` when nothing
 * overflows or no row can be landed on.
 */
export function landFold(scroller: HTMLElement): "cue" | "foot" | "none" {
    scroller.style.maxBlockSize = "";
    const fold = scroller.clientHeight;
    if (fold === 0 || scroller.scrollHeight - fold <= 1) return "none";
    const fade = fadePx(scroller);
    const spans = contentSpans(scroller);
    if (spans.some((s) => s.top <= fold - fade && s.bottom > fold)) return "cue";
    const limit = Math.min(fold, ...spans.filter((s) => s.bottom > fold).map((s) => s.top));
    const feet = spans.filter((s) => s.bottom <= limit).map((s) => s.bottom);
    if (feet.length === 0) return "none";
    const chrome = scroller.offsetHeight - scroller.clientHeight;
    scroller.style.maxBlockSize = `${Math.ceil(Math.max(...feet)) + chrome}px`;
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
