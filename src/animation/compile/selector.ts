/**
 * compile/selector.ts — the keyframe-SELECTOR grammar (J.W1 SEAM-1 / L.W1 S4 /
 * Q.WD1-bind), carved off `frame-compiler.ts` in R.W2b.
 *
 * A `<keyframe-selector>` is the LEFT side of a keyframe rule (`50% { … }`,
 * `from { … }`, the scroll-range `entry 50% { … }`). This module owns the
 * conforming-grammar regexes, the opaque scroll-range named-selector storage tag,
 * and the named-phase → `[0,1]` fraction resolver. `frame-compiler.ts`'s
 * `addFrame` validates an incoming selector against these; the engine's
 * scroll-attach resolves a stored named selector to a numeric `%` via
 * {@link namedSelectorToFraction}. value.js-bearing (the `AnimationOptionError`
 * + the phase table) — rides the heavy compile chunk alongside `frame-compiler`.
 */
import { ValueUnit, parseCSSValueUnit } from "@mkbabb/value.js";
import { AnimationOptionError } from "../internal/errors";
import { PHASE_FRACTIONS } from "../internal/scroll-phases";

/**
 * Multiplier for the content-derived compiled `frameId` (FC-2): a segment's id
 * is `startIx * FRAME_ID_SCALE + stopIx`, unique + deterministic for any keyframe
 * count below the scale. 1e6 keyframes is far past any real animation.
 */
export const FRAME_ID_SCALE = 1_000_000;

/**
 * The NAMED keyframe-selector grammar (J.W1 S3 — the SEAM-1 guard made TOTAL). A
 * selector is CONFORMING iff it is (a) a percentage literal `<number>%` whose
 * value lies in [0,100], or (b) the CSS keyframe keyword `from`/`to`
 * (case-insensitive, per CSS) — and NOTHING else. The boundary is named so the
 * guard is total, not a "looks-invalid" sniff that re-opens the gap.
 */
export const SELECTOR_KEYWORD_RE = /^(?:from|to)$/i;
export const SELECTOR_PERCENT_RE = /^(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?%$/;

/**
 * The SCROLL-RANGE named-selector grammar (L.W1 S4 — viol17/W118). value.js
 * parses `entry`/`exit`/`cover`/`contain` as a `KeyframeSelector { kind: "named" }`
 * (CSS scroll-driven animations `<keyframe-selector>` extended form); the adapter
 * surfaces them as their literal name, optionally followed by a range fraction
 * (`entry 0%`, `entry 50%`). The range-fraction form is the common real-world
 * shape; the bare form (`entry`) maps to `entry 0% 100%` per the scroll-animations
 * spec. These selectors are conforming — `addFrame` ACCEPTS and PRESERVES them
 * verbatim — but they are only RESOLVABLE to a numeric `%` under a
 * `ScrollTimeline`/`ManualTimeline` phase mapper (deferred to attach time; the
 * no-timeline-but-position-demanded case refuses with `NAMED_SELECTOR_NO_TIMELINE`,
 * never a silent invented number).
 */
export const SELECTOR_NAMED_RANGE_RE =
    /^(?:entry|exit|cover|contain)(?:\s+\d+(?:\.\d+)?%)?$/i;

/**
 * The `ValueUnit.superType` marker tagging a stored scroll-range named selector
 * (L.W1 S4). The opaque storage is `new ValueUnit(rawSelector, undefined,
 * [NAMED_SELECTOR_SUPERTYPE])`: the `value` carries the raw selector STRING so
 * `toString()` round-trips the authored token VERBATIM (`entry` → `entry`,
 * `entry 0%` → `entry 0%`), and the `superType` tag is the channel the deferred
 * phase resolver keys on (the percent-literal/keyword path never carries it).
 */
export const NAMED_SELECTOR_SUPERTYPE = "named-selector";

/**
 * Q.WD1-bind S1 — the CAPTURING variant of {@link SELECTOR_NAMED_RANGE_RE} (which
 * is NON-capturing — it validates but cannot extract). Group 1 = the phase, group
 * 2 (optional) = the offset `%` numeral. The two stay in LOCK-STEP: the same token
 * set, the same shape, differing only in the capture groups.
 */
const NAMED_SELECTOR_CAPTURE_RE =
    /^(entry|exit|cover|contain)(?:\s+(\d+(?:\.\d+)?)%)?$/i;

/**
 * Q.WD1-bind S1 (DM-22) — resolve a scroll-range named keyframe selector to its
 * `[0, 1]` position fraction. A keyframe selector is a SINGLE position (NOT a
 * range): a bare `entry` is "the START of the entry phase" (`PHASE_FRACTIONS
 * ["entry"].start = 0`); `entry 50%` is 50% THROUGH the entry band (`0 + 0.5 *
 * (0.25 - 0) = 0.125`) — matching `scroll/range.ts` `boundaryFraction`'s
 * arithmetic. NEVER returns NaN: the `SELECTOR_NAMED_RANGE_RE` guard (`addFrame`)
 * has already validated the input, so any string reaching here is a conforming
 * named selector; a defensive non-match throws the typed error rather than
 * inventing a silent number.
 */
export const namedSelectorToFraction = (rawSelector: string): number => {
    const m = NAMED_SELECTOR_CAPTURE_RE.exec(rawSelector.trim());
    if (m === null) {
        throw new AnimationOptionError(
            "start",
            rawSelector,
            `not a conforming scroll-range named selector (entry/exit/cover/contain, ` +
                `optionally with a range fraction like 'entry 50%')`,
            "NAMED_SELECTOR_NO_TIMELINE",
        );
    }
    const phase = m[1]!.toLowerCase();
    const span = PHASE_FRACTIONS[phase]!;
    const offsetText = m[2];
    if (offsetText === undefined) {
        // Bare form — the single position is the START of the phase.
        return span.start;
    }
    // `entry 50%` = 50% THROUGH the phase band (the offset shifts the origin into
    // the phase span — the same arithmetic boundaryFraction uses).
    const offset = Number.parseFloat(offsetText) / 100;
    return span.start + offset * (span.end - span.start);
};

export const SELECTOR_REASON =
    "a keyframe selector must be a percentage 0%–100% " +
    "(e.g. \"0%\", \"50%\"), the keyword 'from'/'to', or a scroll-range " +
    "named selector (entry/exit/cover/contain, optionally with a range " +
    "fraction like 'entry 0%')";

/**
 * Validate + parse a raw keyframe-SELECTOR token (the LEFT side of a keyframe
 * rule) into its `ValueUnit` — the J.W1 SEAM-1 fail-explicit guard, made TOTAL
 * (J.W1 S3) and L.W1-S4-extended for the scroll-range named selectors. Carved
 * off `frame-compiler.ts`'s `addFrame` at S.B5 to live BESIDE the grammar it
 * validates against; `addFrame` calls it after coercing the raw start (number/
 * string/`ValueUnit`) into a string.
 *
 * The guard validates against the NAMED conforming grammar (percentage 0%–100%
 * ∪ from/to ∪ the scroll-range named selectors — {@link SELECTOR_PERCENT_RE} /
 * {@link SELECTOR_KEYWORD_RE} / {@link SELECTOR_NAMED_RANGE_RE}) BEFORE
 * `parseCSSValueUnit`, so EVERY non-conforming selector is a clear, typed
 * `AnimationOptionError` — never value.js's cryptic `Parse error at offset 0`.
 * The blank case carries the stable structured code "EMPTY_PARSE" (J.W1 S8) so a
 * programmatic consumer branches on the reason, not the message string.
 *
 * The scroll-range named selectors (`entry`/`exit`/`cover`/`contain`, optionally
 * `entry 0%`) are CONFORMING (value.js parses them `kind:"named"`): rather than
 * throw (the pre-L guard's bug) or silently accept-and-ignore, they are stored
 * OPAQUELY as `ValueUnit(rawSelector, undefined, [NAMED_SELECTOR_SUPERTYPE])` —
 * `value` holds the selector STRING so it round-trips VERBATIM through
 * `format.ts` (`String(start)`), and the `superType` tag is the channel the
 * deferred phase resolver ({@link namedSelectorToFraction}) keys on. No
 * `parseCSSValueUnit` on that path (it THROWS on `entry`); the named selector
 * resolves to a numeric `%` only under a ScrollTimeline/ManualTimeline phase
 * mapper, deferred to attach time (the no-timeline-but-position-demanded case
 * refuses with the structured `NAMED_SELECTOR_NO_TIMELINE`, never an invented
 * number).
 */
export function parseKeyframeSelector(start: string): ValueUnit {
    const selector = start.trim();
    if (selector === "") {
        throw new AnimationOptionError(
            "start",
            start,
            `${SELECTOR_REASON} — got an empty/blank string`,
            "EMPTY_PARSE",
        );
    }

    if (SELECTOR_NAMED_RANGE_RE.test(selector)) {
        return new ValueUnit(selector, undefined, [NAMED_SELECTOR_SUPERTYPE]);
    }

    if (
        !SELECTOR_KEYWORD_RE.test(selector) &&
        !(SELECTOR_PERCENT_RE.test(selector) && parseFloat(selector) <= 100)
    ) {
        throw new AnimationOptionError(
            "start",
            start,
            `${SELECTOR_REASON} — got ${JSON.stringify(start)}`,
        );
    }

    // Guarded-total: the conforming set ("<n>%", "from", "to") is exactly what
    // value.js parses to a percentage ValueUnit — `from` → 0%, `to` → 100% — so
    // no post-parse conversion/clamp remains.
    return parseCSSValueUnit(selector);
}
