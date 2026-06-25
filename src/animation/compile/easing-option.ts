/**
 * compile/easing-option.ts — the heavy-surface easing-input resolver (carved off
 * `frame-compiler.ts` in R.W2b).
 *
 * `resolveEasingOption` normalizes the four heavy-surface easing inputs (a
 * callable, a typed `Easing`, a registry name, or a `cubic-bezier()` literal) to
 * a typed `Easing`, attaching the faithful CSS twin where one exists. `addFrame`
 * (per-stop `timingFunction`) + `engine/options.ts` (the animation default) both
 * drive it; it is re-exported THROUGH `frame-compiler.ts` so the import path is
 * unchanged. HEAVY (the registry resolver + the CSS-twin lookup).
 */
import { cssTwinFor } from "../easing";
import { AnimationOptionError } from "../internal/errors";
import type { Easing, InputAnimationOptions } from "../constants";
import { getTimingFunction } from "./easing-registry";

/**
 * Resolve heavy-surface easing input — a callable, a typed `Easing`, a registry
 * name, or a `cubic-bezier()` literal — to a typed `Easing`. Fail-explicit:
 * unresolvable input throws; there is no silent fallback to a default curve.
 */
export const resolveEasingOption = (
    option: string,
    input: NonNullable<InputAnimationOptions["timingFunction"]>,
): Easing => {
    if (typeof input === "function") return { fn: input };
    if (typeof input === "object") {
        if (typeof (input as Easing).fn === "function") {
            return input as Easing;
        }
        throw new AnimationOptionError(
            option,
            input,
            "an Easing must carry a callable `fn`",
        );
    }
    const fn = getTimingFunction(input);
    if (!fn) {
        // J.W1 S8 — the stable structured code rides the typed throw so a
        // programmatic consumer can branch on the reason (the K3-internal
        // row; the full diagnostics channel stays a K.W0 seed).
        throw new AnimationOptionError(
            option,
            input,
            "unknown timing function — pass a callable TimingFunction, a " +
                "typed Easing, a registry name, or a cubic-bezier() literal",
            "UNKNOWN_TIMING_FN",
        );
    }
    // Attach the faithful CSS twin when one exists (CSS keyword,
    // cubic-bezier()/steps() literal) so a WAAPI delegation runs the true
    // curve; value.js bespoke names (easeOutCubic, …) get none and stay on
    // the rAF path.
    const css = cssTwinFor(input);
    return css ? { fn, css } : { fn };
};
