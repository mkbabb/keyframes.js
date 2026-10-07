import { createKeyframeId } from "../timelineTypes";
import type { TimelineKeyframe } from "../timelineTypes";
import { percentSelector } from "@utils/keyframeSelector";

/**
 * X-DS kf pass 3 · KF-C3-01 — the CSSOM serialises a colour with alpha in the
 * LEGACY comma form (`rgba(0, 0, 0, 0)` — the cube's transparent ground), and
 * the value.js 4.0.0 grammar the compile parses with refuses that form
 * (`expected scalar` at 0–16; value.js DIVERGENCE-LEDGER PB-01, cured in the
 * X.P parser, not yet published). So a second Snapshot — the first build —
 * always failed. The capture writes the same colour in the modern space form
 * `rgb(r g b / a)`, which both grammars read and which means the same colour
 * (css-color-4 §8.1). Retire this at the value.js repin that ships PB-01.
 */
const LEGACY_RGBA = /\brgba?\(\s*([-\d.e]+%?)\s*,\s*([-\d.e]+%?)\s*,\s*([-\d.e]+%?)\s*,\s*([-\d.e]+%?)\s*\)/gi;

export const modernColourSyntax = (value: string): string =>
    value.replace(LEGACY_RGBA, "rgb($1 $2 $3 / $4)");

/**
 * Capture a CSS property snapshot from an element's computed style.
 *
 * KF.W7 N-8 — `none` and `auto` are VALUES, not absences. The filter used to
 * drop them over a set that includes `transform`, `filter` and `box-shadow`, so
 * a rest pose captured at those bytes was asymmetric with the poses around it
 * and *"animate to none"* — the commonest authored return-to-rest in the set —
 * was UNAUTHORABLE from the instrument's own capture gesture. They are
 * preserved; only a computed value that is genuinely empty is skipped.
 * Measured before the change (KF.W7.e, double-run): the compile accepts
 * `transform: none` · `filter: none` · `box-shadow: none` · `width: auto`, so
 * preserving them feeds the engine nothing it refuses.
 *
 * Interaction lock (P7's K-4): THP's `{}`-ghost kill rests on `opacity` and
 * `background-color` ALWAYS surviving this filter. Widening what survives
 * cannot narrow that set, so the kill stands.
 */
export function captureSnapshot(
    element: HTMLElement,
    percent: number,
    properties: string[],
): TimelineKeyframe {
    const computed = getComputedStyle(element);
    const vars: Record<string, string> = {};

    // KFA-224 — the AUTHORED value first. The computed style serialises a
    // transform as `matrix3d(…)`, which cannot represent a multi-turn rotation
    // (the cube's `rotateY(0.987turn)` came back as a matrix, and the editor
    // showed a snapshot of the matrix, not the rotation). Whatever the element
    // carries inline — what the engine and the author wrote — is taken as
    // written; the computed value is the fallback for a property with no
    // inline declaration.
    for (const prop of properties) {
        const value = (
            element.style.getPropertyValue(prop) || computed.getPropertyValue(prop)
        ).trim();
        if (value) {
            vars[prop] = modernColourSyntax(value);
        }
    }

    return {
        id: createKeyframeId(),
        selector: percentSelector(percent),
        percent,
        vars,
    };
}
