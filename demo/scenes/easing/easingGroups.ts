import {
    TIMING_DESCRIPTIONS,
    NAMED_EASING_BEZIER,
    DETAIL_TIMING_FUNCTIONS,
} from "@components/custom/instrument/transport/animationDescriptions";

export interface CurveGroupItem {
    name: string;
    description: string;
    isBezier: boolean;
    isDetail: boolean;
}

export interface CurveGroup {
    family: string;
    items: CurveGroupItem[];
}

function item(name: string): CurveGroupItem {
    return {
        name,
        description: TIMING_DESCRIPTIONS[name] ?? "",
        isBezier: name in NAMED_EASING_BEZIER,
        isDetail: DETAIL_TIMING_FUNCTIONS.has(name),
    };
}

export const EASING_GROUPS: CurveGroup[] = [
    {
        family: "Standard",
        items: [
            item("linear"),
            item("ease"),
            item("ease-in"),
            item("ease-out"),
            item("ease-in-out"),
        ],
    },
    {
        family: "Sine",
        items: [
            item("ease-in-sine"),
            item("ease-out-sine"),
            item("ease-in-out-sine"),
        ],
    },
    {
        family: "Quad",
        items: [
            item("ease-in-quad"),
            item("ease-out-quad"),
            item("ease-in-out-quad"),
        ],
    },
    {
        family: "Cubic",
        items: [
            item("ease-in-cubic"),
            item("ease-out-cubic"),
            item("ease-in-out-cubic"),
            item("smooth-step-3"),
        ],
    },
    {
        family: "Expo",
        items: [
            item("ease-in-expo"),
            item("ease-out-expo"),
            item("ease-in-out-expo"),
        ],
    },
    {
        family: "Circ",
        items: [
            item("ease-in-circ"),
            item("ease-out-circ"),
            item("ease-in-out-circ"),
        ],
    },
    {
        family: "Back",
        items: [
            item("ease-in-back"),
            item("ease-out-back"),
            item("ease-in-out-back"),
        ],
    },
    {
        family: "Bounce",
        items: [
            item("ease-in-bounce"),
            item("bounce-in-ease"),
            item("bounce-in-ease-half"),
            item("bounce-out-ease"),
            item("bounce-out-ease-half"),
            item("bounce-in-out-ease"),
        ],
    },
    {
        family: "Steps",
        items: [item("steps"), item("step-start"), item("step-end")],
    },
    {
        family: "Custom",
        items: [item("cubic-bezier")],
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
