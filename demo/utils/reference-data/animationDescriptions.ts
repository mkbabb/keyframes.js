import { timingFunctionDescriptions } from "@mkbabb/value.js/easing";

export const DIRECTION_DESCRIPTIONS: Record<string, string> = {
    "normal": "plays forward",
    "reverse": "plays backward",
    "alternate": "forward then backward",
    "alternate-reverse": "backward then forward",
};

export const FILL_MODE_DESCRIPTIONS: Record<string, string> = {
    "none": "no styles when idle",
    "forwards": "keeps end state",
    "backwards": "applies start state before delay",
    "both": "forwards + backwards",
};

/**
 * OD-U21 / SPEC-B3 §N3 (D2): the timing-function catalogue is value.js's
 * authority. The only retained entry is the legacy spelling consumed by the
 * demo's existing picker data; it is a compatibility alias, not a second
 * description table.
 */
export const TIMING_DESCRIPTIONS: Record<string, string> = {
    ...timingFunctionDescriptions,
    "smooth-step3": timingFunctionDescriptions["smooth-step-3"] ?? "hermite interpolation",
};

// Named easing → cubic-bezier control point mappings
export const NAMED_EASING_BEZIER: Record<string, [number, number, number, number]> = {
    "ease": [0.25, 0.1, 0.25, 1.0],
    "ease-in": [0.42, 0, 1.0, 1.0],
    "ease-out": [0, 0, 0.58, 1.0],
    "ease-in-out": [0.42, 0, 0.58, 1.0],
    "ease-in-sine": [0.47, 0, 0.745, 0.715],
    "ease-out-sine": [0.39, 0.575, 0.565, 1],
    "ease-in-out-sine": [0.445, 0.05, 0.55, 0.95],
    "ease-in-cubic": [0.55, 0.055, 0.675, 0.19],
    "ease-out-cubic": [0.215, 0.61, 0.355, 1],
    "ease-in-out-cubic": [0.645, 0.045, 0.355, 1],
    "ease-in-quad": [0.55, 0.085, 0.68, 0.53],
    "ease-out-quad": [0.25, 0.46, 0.45, 0.94],
    "ease-in-out-quad": [0.455, 0.03, 0.515, 0.955],
    "ease-in-quart": [0.895, 0.03, 0.685, 0.22],
    "ease-out-quart": [0.165, 0.84, 0.44, 1],
    "ease-in-out-quart": [0.77, 0, 0.175, 1],
    "ease-in-quint": [0.755, 0.05, 0.855, 0.06],
    "ease-out-quint": [0.23, 1, 0.32, 1],
    "ease-in-out-quint": [0.86, 0, 0.07, 1],
    "ease-in-expo": [0.95, 0.05, 0.795, 0.035],
    "ease-out-expo": [0.19, 1, 0.22, 1],
    "ease-in-out-expo": [1, 0, 0, 1],
    "ease-in-circ": [0.6, 0.04, 0.98, 0.335],
    "ease-out-circ": [0.075, 0.82, 0.165, 1],
    "ease-in-out-circ": [0.785, 0.135, 0.15, 0.86],
    "ease-in-back": [0.6, -0.28, 0.735, 0.045],
    "ease-out-back": [0.175, 0.885, 0.32, 1.275],
    "ease-in-out-back": [0.68, -0.55, 0.265, 1.55],
    "linear": [0, 0, 1, 1],
};

export const DETAIL_TIMING_FUNCTIONS = new Set(["cubic-bezier", "steps"]);

/**
 * I.W2.S3 — normalize a timing-function VALUE to its KIND. The store now persists
 * a COMPLETE re-parseable literal (`cubic-bezier(x1, y1, x2, y2)` / `steps(n,
 * term)`) so `new CSSKeyframesAnimation` round-trips it on re-mount without an
 * `AnimationOptionError` (the B5 readout seam). But the UI keys its
 * detail-panel / dropdown-highlight / curve-render off the bare KIND — so a
 * persisted literal must still read as `"cubic-bezier"`/`"steps"` for those
 * gates. This is the ONE normalizer: a literal maps to its kind, a bare keyword
 * to itself, a named curve/keyword to itself. KISS — a prefix test on the two
 * parametric forms (the literal always opens `cubic-bezier(` / `steps(`).
 */
export const timingFunctionKind = (value: unknown): string => {
    if (typeof value !== "string") return String(value ?? "");
    if (value === "cubic-bezier" || value.startsWith("cubic-bezier("))
        return "cubic-bezier";
    if (value === "steps" || value.startsWith("steps(")) return "steps";
    return value;
};

/** True when a timing-function VALUE (bare keyword OR literal) is a detail curve
 *  (cubic-bezier / steps) — the literal-aware membership the UI gates on. */
export const isDetailTimingFunction = (value: unknown): boolean =>
    DETAIL_TIMING_FUNCTIONS.has(timingFunctionKind(value));

const COLOR_SPACE_DESCRIPTIONS: Record<string, string> = {
    "oklab": "perceptually uniform (default)",
    "srgb": "standard RGB gamut",
    "lab": "CIE L*a*b* perceptual",
    "lch": "cylindrical lab (hue aware)",
    "oklch": "cylindrical oklab (hue aware)",
};

const HUE_METHOD_DESCRIPTIONS: Record<string, string> = {
    "shorter": "shortest arc",
    "longer": "longest arc",
    "increasing": "always clockwise",
    "decreasing": "always counter-clockwise",
};

export const BLEND_MODE_DESCRIPTIONS: Record<string, string> = {
    "replace": "overwrites lower layers",
    "add": "accumulates with layers",
    "weighted": "lerps by weight factor",
};
