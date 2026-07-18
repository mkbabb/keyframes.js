import {
    NAMED_EASING_BEZIER,
    DETAIL_TIMING_FUNCTIONS,
} from "@utils/reference-data/animationDescriptions";

interface CurveGroupItem {
    name: string;
    description: string;
    isBezier: boolean;
    isDetail: boolean;
}

interface CurveGroup {
    family: string;
    items: CurveGroupItem[];
}

function item(name: string, description: string): CurveGroupItem {
    return {
        name,
        description,
        isBezier: name in NAMED_EASING_BEZIER,
        isDetail: DETAIL_TIMING_FUNCTIONS.has(name),
    };
}

export const EASING_GROUPS: CurveGroup[] = [
    {
        family: "Standard",
        items: [
            item("linear", "constant velocity"),
            item("ease", "gentle start & end"),
            item("ease-in", "slow start, fast end"),
            item("ease-out", "fast start, slow end"),
            item("ease-in-out", "slow start & end"),
        ],
    },
    {
        family: "Sine",
        items: [
            item("ease-in-sine", "sinusoidal ramp up"),
            item("ease-out-sine", "sinusoidal ramp down"),
            item("ease-in-out-sine", "sinusoidal both"),
        ],
    },
    {
        family: "Quad",
        items: [
            item("ease-in-quad", "quadratic acceleration"),
            item("ease-out-quad", "quadratic deceleration"),
            item("ease-in-out-quad", "quadratic both"),
        ],
    },
    {
        family: "Cubic",
        items: [
            item("ease-in-cubic", "cubic acceleration"),
            item("ease-out-cubic", "cubic deceleration"),
            item("ease-in-out-cubic", "cubic both"),
            item("smooth-step-3", "Hermite interpolation"),
        ],
    },
    {
        family: "Expo",
        items: [
            item("ease-in-expo", "exponential ramp"),
            item("ease-out-expo", "exponential decay"),
            item("ease-in-out-expo", "exponential both"),
        ],
    },
    {
        family: "Circ",
        items: [
            item("ease-in-circ", "circular ramp up"),
            item("ease-out-circ", "circular ramp down"),
            item("ease-in-out-circ", "circular both"),
        ],
    },
    {
        family: "Back",
        items: [
            item("ease-in-back", "pulls back first"),
            item("ease-out-back", "overshoots, settles"),
            item("ease-in-out-back", "pull back & overshoot"),
        ],
    },
    {
        family: "Bounce",
        items: [item("ease-in-bounce", "bouncing ramp up")],
    },
    {
        family: "Steps",
        items: [
            item("steps", "discrete jumps"),
            item("step-start", "jump at start"),
            item("step-end", "jump at end"),
        ],
    },
    {
        family: "Custom",
        items: [item("cubic-bezier", "custom curve")],
    },
];

/** Reverse lookup: curve name → family name. */
const _familyMap = new Map<string, string>();
for (const group of EASING_GROUPS) {
    for (const i of group.items) {
        _familyMap.set(i.name, group.family);
    }
}

export function getFamilyForCurve(name: string): string {
    return _familyMap.get(name) ?? "Custom";
}

/** Get all curves in the same family as the given curve. */
export function getFamilyCurves(name: string): CurveGroupItem[] {
    const family = getFamilyForCurve(name);
    return EASING_GROUPS.find((g) => g.family === family)?.items ?? [];
}
