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
 * `text-wrap: balance`, the AnimatedText X-5 lesson). Punctuation rides as its
 * own `"unit"` under word granularity (`isWordLike === false` but non-blank).
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
        for (const { segment } of seg.segment(text)) {
            out.push({ text: segment, kind: isBlank(segment) ? "space" : "unit" });
        }
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
