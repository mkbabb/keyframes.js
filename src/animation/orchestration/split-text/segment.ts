/**
 * The layout-INDEPENDENT segmenters for `splitText` — `by: "word"` and
 * `by: "grapheme"` (S.F2 §S2). Both ride the platform `Intl.Segmenter` (the SOTA
 * bar GSAP's 2025 rewrite set: grapheme-correct splitting handles emoji,
 * combining marks, and ZWJ sequences that a naive `text.split("")` shreds into
 * mojibake). A conservative regex fallback covers the (rare) no-`Intl.Segmenter`
 * runtime so the primitive never throws on capability alone.
 *
 * A segmenter emits an ordered run of {@link TextSegment}s: each is either a
 * `"unit"` (a word or grapheme — an animatable fragment) or `"space"` (inter-unit
 * whitespace — kept as a live text node so the browser can still wrap the run at
 * real break opportunities; the per-glyph inline-blocks otherwise defeat
 * `text-wrap: balance`, the AnimatedText X-5 lesson). Under word granularity
 * punctuation rides WITH the word it abuts (KF-1): `Intl.Segmenter` emits `,`
 * `.` `!` `"` as their own non-word-like segments, and splitting on those made
 * "Hello," two fragments, so the comma could stagger in late or wrap alone.
 */

/** One ordered piece of the source text. */
export interface TextSegment {
    /** The literal substring. */
    text: string;
    /**
     * `"unit"` — an animatable fragment (word or grapheme). `"space"` — inter-
     * unit whitespace, preserved as a text node (not wrapped, not in the cohort).
     */
    kind: "unit" | "space";
}

/** True when a string is entirely whitespace (`""` counts as blank). */
const isBlank = (s: string): boolean => s.length === 0 || /^\s+$/u.test(s);

/** Resolve `Intl.Segmenter` once; `null` when the runtime lacks it. */
const SEGMENTER_OK =
    typeof Intl !== "undefined" && typeof Intl.Segmenter === "function";

/**
 * Word segmentation. Word-like segments (and non-blank punctuation) become
 * `"unit"`s; runs of whitespace become `"space"`s, preserved in order so the
 * rebuilt run reads identically and still wraps at real spaces.
 */
export function segmentWords(text: string, locale?: string): TextSegment[] {
    if (SEGMENTER_OK) {
        const seg = new Intl.Segmenter(locale, { granularity: "word" });
        const out: TextSegment[] = [];
        // Punctuation that OPENS a word (a quote or bracket after a space or at
        // the start), held until the word it opens arrives.
        let leading = "";
        // True when the last pushed entry is a unit touching the current
        // position (no whitespace in between).
        let afterUnit = false;
        for (const { segment, isWordLike } of seg.segment(text)) {
            if (isBlank(segment)) {
                if (leading) out.push({ text: leading, kind: "unit" });
                leading = "";
                out.push({ text: segment, kind: "space" });
                afterUnit = false;
            } else if (isWordLike) {
                // Adjacent word-like segments stay separate units: scripts
                // written without spaces (CJK, Thai) segment into words that
                // touch, and those are the fragments `by: "word"` promises.
                out.push({ text: leading + segment, kind: "unit" });
                leading = "";
                afterUnit = true;
            } else if (afterUnit) {
                // TRAILING punctuation: it closes the unit it touches.
                out[out.length - 1]!.text += segment;
            } else {
                leading += segment;
            }
        }
        // Punctuation with no word to open (a lone dash, an ellipsis at the
        // end after a space) is its own unit.
        if (leading) out.push({ text: leading, kind: "unit" });
        return out;
    }
    // Fallback: split on whitespace boundaries, keeping the separators.
    return text
        .split(/(\s+)/u)
        .filter((s) => s.length > 0)
        .map((s) => ({ text: s, kind: isBlank(s) ? "space" : "unit" }));
}

/**
 * Grapheme (user-perceived character) segmentation. Every non-blank grapheme is
 * a `"unit"`; whitespace graphemes are `"space"`s. `Intl.Segmenter`'s grapheme
 * granularity is the correct primitive here — `Array.from(text)` splits by code
 * POINT, tearing ZWJ emoji and combining marks apart.
 */
export function segmentGraphemes(text: string, locale?: string): TextSegment[] {
    if (SEGMENTER_OK) {
        const seg = new Intl.Segmenter(locale, { granularity: "grapheme" });
        const out: TextSegment[] = [];
        for (const { segment } of seg.segment(text)) {
            out.push({ text: segment, kind: isBlank(segment) ? "space" : "unit" });
        }
        return out;
    }
    // Fallback: code-point iteration (still better than `.split("")`, which
    // breaks surrogate pairs; combining marks are the residual gap).
    return Array.from(text).map((s) => ({
        text: s,
        kind: isBlank(s) ? "space" : "unit",
    }));
}
