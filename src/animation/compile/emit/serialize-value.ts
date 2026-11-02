import type { ColorIssue } from "@mkbabb/value.js/css";
import { serializeCssValue } from "@mkbabb/value.js/css";
import type { CssValue } from "@mkbabb/value.js/value";

/**
 * The ONE seam through which kf turns a `CssValue` into CSS text (X.KF.W3
 * G-KF3-4, COHESION §0hd.1 arm (B): totality at ingest, one named invariant at
 * the boundary).
 *
 * The body is value.js's published `serializeCssValue` (`@mkbabb/value.js/css`)
 * — kf owns no value serializer. That export answers a `Result`: `!ok` (a
 * `ColorIssue`) only for a colour leaf it cannot spell (`color_invalid_input` ·
 * `color_non_finite` · `color_out_of_range`). Every value this seam meets has
 * been admitted by kf's ingest (the parse facade's `Result` and the CC-3
 * refusals are where an unacceptable value is refused, as data), and value.js
 * serializes every value its own parser admits. So a refusal here is not a user
 * refusal with a channel to travel: it is a broken invariant, and it is raised
 * as exactly one named error, never absorbed into a fallback string.
 */
export class SerializeInvariantError extends Error {
    readonly code = "SERIALIZE_INVARIANT";

    constructor(
        readonly value: CssValue,
        readonly issue: ColorIssue,
    ) {
        super(`ingest admitted a value the serializer refuses (${issue.code}).`);
        this.name = "SerializeInvariantError";
    }
}

export const serializeAdmittedValue = (value: CssValue): string => {
    const serialized = serializeCssValue(value);
    if (!serialized.ok) throw new SerializeInvariantError(value, serialized.error);
    return serialized.value;
};
