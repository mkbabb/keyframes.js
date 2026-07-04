/**
 * `splitText` — an a11y-FIRST text-splitter that rides the existing engine
 * (S.F2; SF-10). It shreds a text element's content into per-word / per-grapheme
 * / per-line fragments (an animatable **cohort**) and hands back a **ready
 * stagger** over that cohort, WITHOUT shredding the element's accessible name:
 * the container carries the whole pre-split string as its accessible name
 * (`aria-label`, over a naming-capable `role`) while every visual fragment is
 * `aria-hidden` — so a screen reader reads "Select an animation", not the
 * "S…e…l…e…c…t" per-glyph stream the split produced (the AnimatedText.vue
 * precedent, generalised into a LIGHT primitive). GSAP's 2025 SplitText rewrite
 * is the reference bar.
 *
 * LIGHT (value.js-free): it composes `stagger` (a pure delay generator) and the
 * platform `Intl.Segmenter`; it holds NO static `@mkbabb/value.js` edge, so a
 * consumer importing only `splitText` never pulls the CSS engine into its graph
 * (`proof:boundary` enrolls it automatically off the barrel).
 *
 * `by: "word"` / `"grapheme"` are layout-INDEPENDENT. `by: "line"` is
 * layout-DEPENDENT — measured via `getClientRects` with re-measure on resize,
 * and REFUSED (a typed {@link SplitTextRefusalError}) when the container is not
 * measurable or a container-query/resize loop keeps the line map from holding
 * (measure-or-refuse; a silently-stale line map on reflow is the failure this
 * forbids).
 *
 * ```ts
 * const split = splitText(el, { by: "word" });          // a11y on by default
 * const group = new AnimationGroup(
 *     split.fragments.map((frag, i) => ({
 *         animation: fadeUp(frag),
 *         options: { delay: split.stagger(i) },          // the ready stagger
 *     })),
 * );
 * ```
 */
import { stagger } from "../stagger";
import type { StaggerFn, StaggerOptions } from "../stagger";
import { SplitTextRefusalError } from "./refuse";
import { segmentGraphemes, segmentWords, type TextSegment } from "./segment";

/** The split granularity. `"word"`/`"grapheme"` are layout-independent; `"line"`
 *  is measure-or-refuse (SF-10). */
export type SplitBy = "word" | "grapheme" | "line";

export interface SplitTextOptions {
    /** Granularity — `"word"` (default), `"grapheme"`, or `"line"`. */
    by?: SplitBy;
    /**
     * A11Y-FIRST (default `true`): consolidate the accessible name onto the
     * container (`aria-label` = the pre-split string, over a naming role) and
     * mark every fragment `aria-hidden`, so AT reads the whole text as one label.
     * `false` leaves the split fragments in the a11y tree (opt-out for callers
     * that own their own AT handling).
     */
    a11y?: boolean;
    /**
     * The container role applied under `a11y` **only when the element has no
     * role of its own** — a plain `<div>`/`<span>` maps to `role="generic"`,
     * which PROHIBITS an author name, so a bare `aria-label` would not compute.
     * Defaults to `"img"` (the canonical "graphical composite whose text
     * alternative is …" role). Pass a naming-capable role to override.
     */
    role?: string;
    /** Locale for `Intl.Segmenter` (word/grapheme boundaries). */
    locale?: string;
    /** Options for the ready {@link StaggerFn} built over the cohort. */
    stagger?: StaggerOptions;
    /** Class set on each fragment element. Defaults to `"kf-split"`. */
    fragmentClass?: string;
    /**
     * `by: "line"` only — invoked when a resize-driven RE-measure cannot hold
     * (the container became unmeasurable or a container-query loop kept the line
     * map from converging). The observer disconnects and the last good map is
     * left in place; the caller decides whether to fall back to `by: "word"`.
     */
    onRefuse?: (error: SplitTextRefusalError) => void;
}

export interface SplitTextResult {
    /** The split container (the element passed in). */
    container: HTMLElement;
    /** The animatable fragment cohort, in source order. */
    fragments: HTMLElement[];
    /** The granularity that produced {@link fragments}. */
    by: SplitBy;
    /** The pre-split string — the container's consolidated accessible name. */
    text: string;
    /** A ready per-index delay generator over the cohort (the ready stagger). */
    stagger: StaggerFn;
    /** The materialized stagger delays, one per fragment (convenience). */
    delays: number[];
    /** Restore the container's original markup + a11y attributes. */
    revert(): void;
    /** `by: "line"` — re-measure + re-group the lines now (no-op otherwise). */
    remeasure(): void;
    /** Tear down the resize observer (does not revert the DOM). */
    dispose(): void;
}

/** Round a client-rect edge to collapse sub-pixel jitter into a line key. */
const lineKey = (top: number): number => Math.round(top);

/** True when the element currently has a laid-out box a line-split can measure. */
const isLaidOut = (spans: readonly HTMLElement[]): boolean =>
    spans.some((s) => {
        const r = s.getBoundingClientRect();
        return r.width > 0 || r.height > 0;
    });

/** Build the per-unit fragment nodes for a layout-INDEPENDENT split. */
function buildUnits(
    doc: Document,
    segments: readonly TextSegment[],
    fragmentClass: string,
    a11y: boolean,
): { frag: DocumentFragment; fragments: HTMLElement[] } {
    const frag = doc.createDocumentFragment();
    const fragments: HTMLElement[] = [];
    for (const seg of segments) {
        if (seg.kind === "space") {
            // Live whitespace: keeps the run wrappable at real break points.
            frag.appendChild(doc.createTextNode(seg.text));
            continue;
        }
        const span = doc.createElement("span");
        span.className = fragmentClass;
        span.style.display = "inline-block";
        span.textContent = seg.text;
        if (a11y) span.setAttribute("aria-hidden", "true");
        fragments.push(span);
        frag.appendChild(span);
    }
    return { frag, fragments };
}

/**
 * Group the word-level segments into LINE fragments by their measured top edge
 * (measure-or-refuse). Throws {@link SplitTextRefusalError} when the container
 * cannot be measured. The container is mutated to the frozen line map.
 */
function buildLines(
    el: HTMLElement,
    text: string,
    locale: string | undefined,
    fragmentClass: string,
    a11y: boolean,
): HTMLElement[] {
    if (text.trim().length === 0) throw new SplitTextRefusalError("empty");
    const doc = el.ownerDocument;

    // Transiently lay out per-WORD spans so each unit has a measurable box.
    const words = segmentWords(text, locale);
    const nodes: Node[] = [];
    const unitSpans: HTMLElement[] = [];
    const segOf = new Map<Node, TextSegment>();
    for (const seg of words) {
        if (seg.kind === "space") {
            nodes.push(doc.createTextNode(seg.text));
            continue;
        }
        const span = doc.createElement("span");
        span.textContent = seg.text;
        unitSpans.push(span);
        segOf.set(span, seg);
        nodes.push(span);
    }
    el.replaceChildren(...nodes);

    // Refuse rather than emit a stale/collapsed map when nothing is laid out.
    if (!el.isConnected || !isLaidOut(unitSpans)) {
        throw new SplitTextRefusalError("unmeasurable");
    }

    // Walk in source order, breaking a new line whenever a unit's top edge jumps.
    const lines: TextSegment[][] = [];
    let current: TextSegment[] = [];
    let currentTop: number | null = null;
    for (const node of nodes) {
        const seg =
            node instanceof HTMLElement
                ? segOf.get(node)
                : ({ text: node.textContent ?? "", kind: "space" } as TextSegment);
        if (!seg) continue;
        if (seg.kind === "unit" && node instanceof HTMLElement) {
            const top = lineKey(node.getBoundingClientRect().top);
            if (currentTop === null) {
                currentTop = top;
            } else if (top !== currentTop) {
                if (current.length > 0) lines.push(current);
                current = [];
                currentTop = top;
            }
        }
        current.push(seg);
    }
    if (current.length > 0) lines.push(current);

    // Materialize one frozen block per line.
    const frag = doc.createDocumentFragment();
    const fragments: HTMLElement[] = [];
    for (const lineSegs of lines) {
        const span = doc.createElement("span");
        span.className = fragmentClass;
        span.style.display = "block";
        span.textContent = lineSegs.map((s) => s.text).join("").trimEnd();
        if (a11y) span.setAttribute("aria-hidden", "true");
        fragments.push(span);
        frag.appendChild(span);
    }
    el.replaceChildren(frag);
    return fragments;
}

/** Apply the a11y-first name consolidation to the container. */
function applyA11y(el: HTMLElement, text: string, role: string): boolean {
    el.setAttribute("aria-label", text);
    const hadRole = el.hasAttribute("role");
    if (!hadRole) el.setAttribute("role", role);
    return hadRole;
}

/**
 * Split a text element into an animatable fragment cohort + a ready stagger,
 * a11y-first. See {@link SplitTextOptions} / {@link SplitTextResult}.
 *
 * @param el — the text element to split (its `textContent` is the pre-split
 *   string). For `by: "line"` it must be laid out, else the split refuses.
 * @param options — `{ by, a11y, role, locale, stagger, fragmentClass, onRefuse }`.
 * @throws {SplitTextRefusalError} `by: "line"` on an unmeasurable container.
 */
export function splitText(
    el: HTMLElement,
    options: SplitTextOptions = {},
): SplitTextResult {
    const {
        by = "word",
        a11y = true,
        role = "img",
        locale,
        stagger: staggerOpts,
        fragmentClass = "kf-split",
        onRefuse,
    } = options;

    const doc = el.ownerDocument;
    const text = el.textContent ?? "";
    // Snapshot for revert (markup + whether we authored the role).
    const originalHTML = el.innerHTML;

    let fragments: HTMLElement[];
    if (by === "line") {
        fragments = buildLines(el, text, locale, fragmentClass, a11y);
    } else {
        const segments =
            by === "grapheme"
                ? segmentGraphemes(text, locale)
                : segmentWords(text, locale);
        const built = buildUnits(doc, segments, fragmentClass, a11y);
        el.replaceChildren(built.frag);
        fragments = built.fragments;
    }

    const hadRole = a11y ? applyA11y(el, text, role) : el.hasAttribute("role");

    let staggerFn = stagger(fragments.length, staggerOpts);
    let delays = staggerFn.delays(fragments.length);

    // ── by:"line" — re-measure on resize; refuse rather than latch a stale map.
    let observer: ResizeObserver | null = null;
    // Instability guard: if re-measures thrash inside a tight window without the
    // map holding (a container-query / intrinsic-size feedback loop), refuse.
    let remeasures = 0;
    let windowStart = 0;
    const THRASH_LIMIT = 12;
    const THRASH_WINDOW_MS = 500;

    const remeasure = (): void => {
        if (by !== "line") return;
        fragments = buildLines(el, text, locale, fragmentClass, a11y);
        if (a11y) applyA11y(el, text, role);
        // Re-seat the ready stagger over the new line cohort.
        staggerFn = stagger(fragments.length, staggerOpts);
        delays = staggerFn.delays(fragments.length);
    };

    const disposeObserver = (): void => {
        observer?.disconnect();
        observer = null;
    };

    if (by === "line" && typeof ResizeObserver !== "undefined") {
        observer = new ResizeObserver(() => {
            const now =
                typeof performance !== "undefined" ? performance.now() : Date.now();
            if (now - windowStart > THRASH_WINDOW_MS) {
                windowStart = now;
                remeasures = 0;
            }
            if (++remeasures > THRASH_LIMIT) {
                const err = new SplitTextRefusalError("unstable");
                disposeObserver();
                onRefuse?.(err);
                return;
            }
            try {
                remeasure();
            } catch (err) {
                // A re-measure that cannot be taken: refuse, keep the last good
                // map, and stop observing — never emit a stale line map.
                if (err instanceof SplitTextRefusalError) {
                    disposeObserver();
                    onRefuse?.(err);
                    return;
                }
                throw err;
            }
        });
        observer.observe(el);
    }

    const revert = (): void => {
        disposeObserver();
        el.innerHTML = originalHTML;
        el.removeAttribute("aria-label");
        if (a11y && !hadRole) el.removeAttribute("role");
    };

    return {
        container: el,
        by,
        text,
        // Live getters so a by:"line" re-measure is reflected on the handle.
        get fragments() {
            return fragments;
        },
        get stagger() {
            return staggerFn;
        },
        get delays() {
            return delays;
        },
        revert,
        remeasure,
        dispose: disposeObserver,
    };
}
