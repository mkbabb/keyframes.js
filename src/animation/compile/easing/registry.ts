/** Resolve public timing-function inputs through Value 4's typed contracts. */
import {
    CubicBezier,
    bezierPresets,
    easing,
    linearEasing,
    steppedEase,
    type EasingFunction,
    type LinearEasingStop,
} from "@mkbabb/value.js/easing";
import {
    parseTimingFunction,
    type CssLinearStop,
    type CssTimingFunction,
} from "@mkbabb/value.js/css";
import type { TimingFunction } from "../../constants";

const DIRECT_NAMES = [
    "easeOutCubic",
    "easeInOutSine",
    "easeInOutCubic",
    "easeInOutQuad",
    "easeInOutExpo",
    "easeInOutCirc",
    "easeOutExpo",
    "smoothStep3",
    "easeInBounce",
] as const;

const registryNames = [
    ...Object.keys(bezierPresets),
    "ease-in-bounce",
    ...DIRECT_NAMES,
] as const;

/** Stable identities let the serializer distinguish named curves from closures. */
export const timingFunctionEntries: readonly (readonly [
    string,
    EasingFunction,
])[] = registryNames.map((name) => {
    const result = easing(name);
    if (!result.ok) {
        throw new Error(
            `value.js rejected its own easing ${JSON.stringify(name)}: ${result.error.code}`,
        );
    }
    return [name, result.value] as const;
});

const timingFunctionRegistry = new Map(timingFunctionEntries);

/**
 * Resolve omitted CSS `linear()` positions after parsing. A two-position stop
 * represents two coincident output stops; missing endpoints become 0/1 and
 * interior runs are distributed evenly between their surrounding positions.
 */
const resolveLinearStops = (
    stops: readonly CssLinearStop[],
): LinearEasingStop[] => {
    const expanded = stops.flatMap(({ output, input }) =>
        input.length === 2
            ? [
                  { output, input: input[0] },
                  { output, input: input[1] },
              ]
            : [{ output, input: input[0] }],
    );

    expanded[0]!.input ??= 0;
    expanded[expanded.length - 1]!.input ??= 1;

    let previous = expanded[0]!.input!;
    for (let i = 1; i < expanded.length; i++) {
        const position = expanded[i]!.input;
        if (position !== undefined) {
            expanded[i]!.input = Math.max(previous, position);
            previous = expanded[i]!.input!;
        }
    }

    for (let start = 0; start < expanded.length - 1; ) {
        let end = start + 1;
        while (expanded[end]!.input === undefined) end++;
        const from = expanded[start]!.input!;
        const to = expanded[end]!.input!;
        for (let i = start + 1; i < end; i++) {
            expanded[i]!.input =
                from + ((to - from) * (i - start)) / (end - start);
        }
        start = end;
    }

    return expanded as LinearEasingStop[];
};

const fromCssTimingFunction = (
    value: CssTimingFunction,
): EasingFunction => {
    switch (value.kind) {
        case "keyword": {
            const result = easing(value.name);
            if (result.ok) return result.value;
            throw new TypeError(`Invalid timing function: ${result.error.code}.`);
        }
        case "cubic-bezier": {
            const result = CubicBezier(value.x1, value.y1, value.x2, value.y2);
            if (result.ok) return result.value;
            throw new TypeError(`Invalid cubic-bezier(): ${result.error.code}.`);
        }
        case "steps": {
            const result = steppedEase(value.count, value.position);
            if (result.ok) return result.value;
            throw new TypeError(`Invalid steps(): ${result.error.code}.`);
        }
        case "linear-function": {
            const result = linearEasing(resolveLinearStops(value.stops));
            if (result.ok) return result.value;
            throw new TypeError(`Invalid linear(): ${result.error.code}.`);
        }
    }
};

/** Resolve a callable, canonical Value name, or CSS timing-function literal. */
export const resolveTimingFunction = (
    timingFunction: TimingFunction | string,
): TimingFunction => {
    if (typeof timingFunction !== "string") {
        return timingFunction;
    }

    const parsed = parseTimingFunction(timingFunction);
    if (parsed.ok) return fromCssTimingFunction(parsed.value);
    const registered = timingFunctionRegistry.get(timingFunction);
    if (registered !== undefined) return registered;
    throw new TypeError(`Unknown timing function "${timingFunction}".`);
};
