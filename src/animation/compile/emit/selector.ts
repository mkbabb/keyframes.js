/**
 * `compile/emit/selector.ts` — THE keyframe-selector serializer (X.KF.W8
 * MISS-β2 · G3; published K-D6). One body for `50%` / `entry` / `entry 50%`.
 *
 * A value-free LEAF: its only value.js edge is the erased `import type` of
 * the selector union, so the LIGHT `.` barrel publishes it without spending
 * its value.js-free boundary (`proof:boundary`). `css-text.ts`'s emitters and
 * `format/format.ts` import it from here, and the demo's timeline merge key
 * reads it off the published barrel; there is no second body.
 */
import type { KeyframeSelector } from "@mkbabb/value.js/css";

export const serializeSelector = (selector: KeyframeSelector): string => {
    if (selector.kind === "percent") return `${selector.value * 100}%`;
    return selector.offset === undefined
        ? selector.name
        : `${selector.name} ${selector.offset * 100}%`;
};
