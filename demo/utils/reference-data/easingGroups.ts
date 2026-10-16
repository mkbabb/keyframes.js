import {
    NAMED_EASING_BEZIER,
    DETAIL_TIMING_FUNCTIONS,
} from "@utils/reference-data/animationDescriptions";
import type { EasingName } from "../../scenes/easing/useEasingDemo";

interface CurveGroupItem {
    /** Every catalogue tile IS a selectable name of the easing scene's contract. */
    name: EasingName;
    description: string;
    isBezier: boolean;
    isDetail: boolean;
    /** X-DS r6 pass 9 (KF-C9-07) — the description is SHOWN, as a muted second
     *  line under the name, on a tile whose engine name misdescribes the shape
     *  it draws. Everywhere else it stays the tile's accessible description only. */
    noteShown: boolean;
}

interface CurveGroup {
    family: string;
    items: CurveGroupItem[];
}

function item(name: EasingName, description: string, noteShown = false): CurveGroupItem {
    return {
        name,
        description,
        isBezier: name in NAMED_EASING_BEZIER,
        isDetail: DETAIL_TIMING_FUNCTIONS.has(name),
        noteShown,
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
            // X-DS r6 pass 8 (KF-C8-02) — the catalogue names what the tile
            // draws. value.js's `ease-in-bounce` is a bezier solve on
            // (0.09, 0.91, 0.5, 1.5): a fast rise that overshoots and settles,
            // no bounce. It stood alone under a "Bounce" heading with the copy
            // "bouncing ramp up", contradicting its own thumbnail; it sits in
            // the overshoot family it belongs to. The engine name is value.js's
            // public contract and is kept (a true bounce is a value.js ruling).
            // X-DS r6 pass 9 (KF-C9-07) — and SHOWS it: a sighted reader saw a
            // tile named "bounce" drawing an overshoot dome, the caption only
            // in the accessibility tree. This one tile carries its shape as a
            // visible second line; the engine name is unchanged.
            item("ease-in-bounce", "fast rise, overshoots", true),
        ],
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
