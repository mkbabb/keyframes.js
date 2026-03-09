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

export const TIMING_DESCRIPTIONS: Record<string, string> = {
    "cubic-bezier": "custom curve",
    "linear": "constant velocity",
    "ease": "gentle start & end",
    "ease-in": "slow start, fast end",
    "ease-out": "fast start, slow end",
    "ease-in-out": "slow start & end",
    "ease-in-back": "pulls back first",
    "ease-out-back": "overshoots, settles",
    "ease-in-out-back": "pull back & overshoot",
    "ease-in-quad": "quadratic acceleration",
    "ease-out-quad": "quadratic deceleration",
    "ease-in-out-quad": "quadratic both",
    "ease-in-cubic": "cubic acceleration",
    "ease-out-cubic": "cubic deceleration",
    "ease-in-out-cubic": "cubic both",
    "ease-in-sine": "sinusoidal ramp up",
    "ease-out-sine": "sinusoidal ramp down",
    "ease-in-out-sine": "sinusoidal both",
    "ease-in-circ": "circular ramp up",
    "ease-out-circ": "circular ramp down",
    "ease-in-out-circ": "circular both",
    "ease-in-expo": "exponential ramp",
    "ease-out-expo": "exponential decay",
    "ease-in-out-expo": "exponential both",
    "ease-in-bounce": "bouncing ramp up",
    "bounce-in-ease": "bounce entrance",
    "bounce-in-ease-half": "half bounce in",
    "bounce-out-ease": "bounce landing",
    "bounce-out-ease-half": "half bounce out",
    "bounce-in-out-ease": "bounce both ends",
    "smooth-step3": "hermite interpolation",
    "smooth-step-3": "hermite interpolation",
    "steps": "discrete jumps",
    "step-start": "jump at start",
    "step-end": "jump at end",
};

export const COLOR_SPACE_DESCRIPTIONS: Record<string, string> = {
    "oklab": "perceptually uniform (default)",
    "srgb": "standard RGB gamut",
    "lab": "CIE L*a*b* perceptual",
    "lch": "cylindrical lab (hue aware)",
    "oklch": "cylindrical oklab (hue aware)",
};

export const HUE_METHOD_DESCRIPTIONS: Record<string, string> = {
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
