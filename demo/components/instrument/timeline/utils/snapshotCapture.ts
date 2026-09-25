import { createKeyframeId } from "../timelineTypes";
import type { TimelineKeyframe } from "../timelineTypes";
import { percentSelector } from "@utils/keyframeSelector";

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
            vars[prop] = value;
        }
    }

    return {
        id: createKeyframeId(),
        selector: percentSelector(percent),
        percent,
        vars,
    };
}
