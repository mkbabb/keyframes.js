/** Keyframe selector ingestion and named-phase timeline resolution. */
import {
    parseKeyframeSelector as parseValueSelector,
    type KeyframeSelector,
    type ParseIssue,
} from "@mkbabb/value.js/css";
import { AnimationOptionError } from "../internal/errors";
import { PHASE_FRACTIONS } from "../internal/scroll-phases";

/** Content-derived compiled frame id scale. */
export const FRAME_ID_SCALE = 1_000_000;

const issueText = (issue: ParseIssue): string =>
    `${issue.code} at ${issue.start}-${issue.end}: expected ${issue.expected.join(
        " or ",
    )}, got ${issue.actual ?? "end of input"}`;

/**
 * Parse a selector through Value's sole grammar authority. Value normalizes
 * percentages to `[0,1]`, `from`/`to` to percent selectors, named offsets to
 * `[0,1]`, and mixed-case keywords/names to lowercase.
 */
export function parseKeyframeSelector(start: string): KeyframeSelector {
    const result = parseValueSelector(start);
    if (result.ok) return result.value;

    throw new AnimationOptionError(
        "start",
        start,
        `invalid keyframe selector — ${result.diagnostics
            .map(issueText)
            .join("; ")}`,
        start.trim() === "" ? "EMPTY_PARSE" : undefined,
    );
}

/**
 * Resolve a parsed named selector to its position on the animation timeline.
 * This is Keyframes-owned phase semantics, not selector parsing: the producer
 * has already normalized the optional offset to `[0,1]`.
 */
export const namedSelectorToFraction = (selector: KeyframeSelector): number => {
    if (selector.kind !== "named") {
        throw new AnimationOptionError(
            "start",
            selector,
            "named phase resolution requires a parsed named keyframe selector",
            "NAMED_SELECTOR_NO_TIMELINE",
        );
    }
    const span = PHASE_FRACTIONS[selector.name];
    if (span === undefined) {
        throw new AnimationOptionError(
            "start",
            selector,
            `no timeline phase is defined for ${JSON.stringify(selector.name)}`,
            "NAMED_SELECTOR_NO_TIMELINE",
        );
    }
    const offset = selector.offset ?? 0;
    return span.start + offset * (span.end - span.start);
};
