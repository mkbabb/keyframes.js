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
import type { CssLinearStop, CssTimingFunction } from "@mkbabb/value.js/css";
import { parseTimingFunction, requireParsed } from "../parse-facade";
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

/**
 * A registry name's curve, straight from value.js's `easing()`. value.js
 * 4.1.0's `easing()` is memoised, so every call for a name hands out the ONE
 * reference value holds for it — kf keeps no name→curve map of its own (the
 * X.KF.W4 K1 memo this replaces was deleted at the 4.1.0 repin, KF.W3, as it
 * scheduled itself). A registry name value refuses is value rejecting its own
 * easing: a broken contract, never a user refusal, so it throws.
 */
const registryEasing = (name: string): EasingFunction => {
    const result = easing(name);
    if (!result.ok) {
        throw new Error(
            `value.js rejected its own easing ${JSON.stringify(name)}: ${result.error.code}`,
        );
    }
    return result.value;
};

/**
 * The registry roster with each name's curve, evaluated at module top level —
 * THE BOOT FENCE (G-KF3-6): a `bezierPresets` key value stops accepting is a kf
 * boot `throw` here, and a key it adds silently widens this public roster.
 *
 * The references are value.js's memoised ones, so they are stable but NOT
 * injective: the 40 names resolve onto **31** distinct references, because nine
 * hyphen/camel twin pairs (`ease-out-cubic` ≡ `easeOutCubic`, `smooth-step-3` ≡
 * `smoothStep3`, …) share one value.js function. A reference therefore
 * identifies the CURVE and never the name that produced it — which is why
 * `easing-serialize.ts`'s reverse lookup can tell a registry curve from a
 * closure but cannot recover WHICH name was written, and why G-KFW4-5 proves
 * identity by sampled value-identity on the 33-point grid rather than by name
 * equality (COHESION §0j.C KF-SS3). `test/compile/easing-identity.test.ts`
 * asserts all three facts.
 */
export const timingFunctionEntries: readonly (readonly [
    string,
    EasingFunction,
])[] = registryNames.map((name) => [name, registryEasing(name)] as const);

const registeredNames: ReadonlySet<string> = new Set(registryNames);

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

    // X.KF.W4 K1 (R-2) — THE REGISTRY IS CONSULTED FIRST. Four registry names
    // are also CSS keywords (`ease`, `ease-in`, `ease-out`, `ease-in-out`), and
    // the order is what keeps every registry name on ONE path: a name resolves
    // through `registryEasing` (value's memoised `easing()`, the very reference
    // `timingFunctionEntries` holds, which the serializer's reverse lookup
    // reads), and only a non-registry string reaches the CSS parser.
    if (registeredNames.has(timingFunction)) {
        return registryEasing(timingFunction);
    }

    return fromCssTimingFunction(
        requireParsed(
            parseTimingFunction(timingFunction),
            () => new TypeError(`Unknown timing function "${timingFunction}".`),
        ),
    );
};
