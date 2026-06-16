/**
 * scroll-grammar.ts — the SO-1 scroll-grammar ROUND-TRIP half of K.W9
 * SCROLL-AS-CSS (the value.js consume edge; the parser run BOTH ways over the
 * SAME data model).
 *
 * Split out of `scroll-scene.ts` at the natural concern seam (the K close
 * decomposition): this module owns the GRAMMAR — PARSE (`parseScrollTimeline` /
 * `parseScrollRange` / `parseScrollCSS`) and SERIALIZE (`serializeScrollOptions`
 * / `roundTripScrollCSS`), each a thin pass-through to value.js 0.13.0's typed
 * `CSSTimelineOptions` extractor + inverse serializer. The sibling
 * `scroll-scene.ts` owns the TIME driver (the range→[0,1] mapping, the
 * `ScrollScene`, the backend dispatch, the `position:sticky` pin) and re-exports
 * this surface, so the barrel + tests + `proof:scroll-roundtrip` import set are
 * unchanged. Pure extraction — zero behaviour change.
 *
 * ── The static/dynamic boundary (BINDING — proof:boundary) ─────────────────
 * This module carries the STATIC `@mkbabb/value.js` edge (the typed
 * scroll-grammar extractor + inverse serializer); it is therefore HEAVY,
 * reached ONLY via `loadAnimationEngine()` (the barrel places `scroll-scene.ts`'s
 * re-exports behind that accessor). The value.js-free LIGHT surface stays
 * value.js-free.
 *
 * ── The VALUE / TIME division-of-labour (RESOLVED — not re-litigated) ──────
 * value.js owns VALUES: it parses `scroll()`/`view()`/range-phase tokens VERBATIM
 * (the named-timeline ref as a `<dashed-ident>` string, the range `offset`
 * as-written — `"40%"`, NOT resolved to px; `auto`/`none` as themselves) and
 * does NOT resolve a live-DOM scroller offset. keyframes.js owns TIME: the
 * `ScrollScene` driver (the sibling module) resolves the live scroller/offset
 * against the DOM. This module is the VALUE half — pure grammar, no DOM.
 */

import {
    extractTimelineOptions,
    parseAnimationRange,
    parseAnimationTimeline,
    parseCSSStylesheet,
    serializeTimelineOptions,
    type AnimationRangeValue,
    type AnimationTimelineValue,
    type CSSTimelineOptions,
    type Stylesheet,
} from "@mkbabb/value.js";

// ── re-export the consumed value.js scroll-grammar TYPES (erased) ──────────
// Consumers annotating a parsed scene reach the typed surface through kf without
// a second value.js import. `import type` is erased — no runtime edge added.
export type {
    AnimationTimelineValue,
    AnimationRangeValue,
    CSSTimelineOptions,
    RangeBoundary,
    RangePhase,
} from "@mkbabb/value.js";

// ═══════════════════════════════════════════════════════════════════════════
// SO-1 — the scroll-grammar ROUND-TRIP (value.js-GATED; the acyclic-spine
// source half, the consume edge LIT on value.js 0.13.0's publish).
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Parse a single `animation-timeline` value (`scroll(root block)`, `view()`,
 * `--named`, `auto`, `none`) to its typed form — a thin pass-through to
 * value.js's `parseAnimationTimeline` (kf consumes the VALUE grammar; it never
 * re-derives a local parser). Emits the value VERBATIM; resolves no defaults.
 */
export function parseScrollTimeline(input: string): AnimationTimelineValue {
    return parseAnimationTimeline(input);
}

/**
 * Parse an `animation-range` shorthand (`entry 0% cover 40%`) to its typed
 * `{ start, end? }` form — a pass-through to value.js's `parseAnimationRange`.
 */
export function parseScrollRange(input: string): AnimationRangeValue {
    return parseAnimationRange(input);
}

/**
 * SO-1 PARSE — extract the full scroll-grammar (`animation-timeline` /
 * `animation-range` / `timeline-scope` / `animation-trigger`) from a scroll-
 * driven stylesheet (string OR a pre-parsed `Stylesheet`) into a typed
 * `CSSTimelineOptions`. Consumes value.js 0.13.0's `extractTimelineOptions` over
 * the parsed stylesheet — the acyclic-spine consume edge (the grammar lives in
 * value.js, where the `animation-*` parsing already lives; kf re-derives no
 * parallel name table).
 *
 * @example
 * parseScrollCSS(`.card {
 *   animation: reveal linear both;
 *   animation-timeline: view();
 *   animation-range: entry 0% cover 40%;
 * }`)
 * // → { timeline: { kind: "view" },
 * //     range: { start: { phase: "entry", offset: "0%" },
 * //              end:   { phase: "cover", offset: "40%" } } }
 */
export function parseScrollCSS(input: string | Stylesheet): CSSTimelineOptions {
    const ast: Stylesheet =
        typeof input === "string" ? parseCSSStylesheet(input) : input;
    return extractTimelineOptions(ast);
}

/**
 * SO-1 SERIALIZE — round-trip a typed `CSSTimelineOptions` BACK to its CSS
 * longhand declarations (`{ "animation-timeline"?, "animation-range"?,
 * "timeline-scope"?, "animation-trigger"? }`). The parser run BACKWARD over the
 * SAME data model — value.js's `serializeTimelineOptions` (the inverse mirror of
 * its extractor), NOT a re-derived lossy emitter. Emits only present fields (no
 * default padding); the keys mirror the CSS longhand names.
 *
 * THE REPLAY-EQUALITY ORACLE: `serializeScrollOptions(parseScrollCSS(s))` is
 * canonical-form-equal to `s`'s scroll declarations — a faithful round-trip, OR
 * a REFUSAL (a parse that drops a phase reds the gate), never a silent
 * approximation. See {@link roundTripScrollCSS}.
 */
export function serializeScrollOptions(opts: CSSTimelineOptions): {
    "animation-timeline"?: string;
    "animation-range"?: string;
    "timeline-scope"?: string;
    "animation-trigger"?: string;
} {
    return serializeTimelineOptions(opts);
}

/**
 * The full SO-1 round-trip in one call: `parse → serialize`. Returns the typed
 * options AND the re-serialized longhand declarations, so a consumer (or the
 * `proof:scroll-roundtrip` gate) can assert the replay-equality invariant
 * (`serialize(parse(s))` canonical-form-equal to `s`).
 */
export function roundTripScrollCSS(input: string | Stylesheet): {
    options: CSSTimelineOptions;
    declarations: ReturnType<typeof serializeScrollOptions>;
} {
    const options = parseScrollCSS(input);
    return { options, declarations: serializeScrollOptions(options) };
}
