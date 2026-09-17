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

/**
 * The name→curve map, built ONCE at module evaluation so a registry name hands
 * out ONE stable reference for the process lifetime (X.KF.W4 K1 / R-2). value.js
 * 4.0.0's `easing()` is NOT memoised — 21 of these 40 names return a fresh
 * function on every call — so this map is what makes kf-side identity stable at
 * all, and `resolveTimingFunction` below must consult it BEFORE the CSS parser
 * or the guarantee is void for the names the parser also accepts.
 *
 * It is stable, NOT injective: the 40 names resolve onto **31** distinct
 * references, because nine hyphen/camel twin pairs (`ease-out-cubic` ≡
 * `easeOutCubic`, `smooth-step-3` ≡ `smoothStep3`, …) share one value.js
 * function. A reference therefore identifies the CURVE and never the name that
 * produced it — which is why `easing-serialize.ts`'s reverse lookup can tell a
 * registry curve from a closure but cannot recover WHICH name was written, and
 * why G-KFW4-5 proves identity by sampled value-identity on the 33-point grid
 * rather than by name equality (COHESION §0j.C KF-SS3). `test/compile/
 * easing-identity.test.ts` asserts all three facts.
 *
 * Scheduled deletion, declared not implied (R-2): when value.js 4.1's memoised
 * `easing()` lands, this memo is deleted in KF.W3's repin commit.
 */
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

    // X.KF.W4 K1 (R-2) — THE REGISTRY IS CONSULTED FIRST. The parser used to
    // run first, and four registry names are also CSS keywords (`ease`,
    // `ease-in`, `ease-out`, `ease-in-out`), so those four took the parse path
    // and got a FRESH `easing()` instance on every call — outside the module
    // memo above. The curve was right and the identity was not, and identity is
    // the thing the serializer reads: `serializeEasing({ fn:
    // resolveTimingFunction("ease") })` THREW `a custom TimingFunction has no
    // CSS representation` on the library's own registry keyword. Ordering the
    // memo first is the whole cure — the parse branch below produces
    // `easing(name)` for exactly these four, i.e. the same curve this map
    // already holds, so no curve changes and every name now hands out one
    // stable reference.
    const registered = timingFunctionRegistry.get(timingFunction);
    if (registered !== undefined) return registered;

    const parsed = parseTimingFunction(timingFunction);
    if (parsed.ok) return fromCssTimingFunction(parsed.value);
    throw new TypeError(`Unknown timing function "${timingFunction}".`);
};
