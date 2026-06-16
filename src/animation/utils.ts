import { any as parseAny } from "@mkbabb/parse-that";
import {
    CSSCubicBezier,
    CSSFunction,
    CSSValues,
    cssLinear,
    flattenObject,
    functionIdentityValue,
    FunctionValue,
    memoize,
    normalizeValueUnits,
    parseLinearStops,
    parseSteps,
    prepareInterpVar,
    steppedEase,
    timingFunctions,
    tryParse,
    unflattenObjectToString,
    ValueArray,
    ValueUnit,
} from "@mkbabb/value.js";
import type {
    ColorSpace,
    HueInterpolationMethod,
    NormalizeValueUnitsOptions,
} from "@mkbabb/value.js";
import type {
    TemplateAnimationFrame,
    TimingFunction,
    TimingFunctionNames,
    Vars,
} from "./constants";

export type ParsedVarMap = Record<string, ValueArray>;

/**
 * The function-token name a leaf `ValueUnit` was flattened OUT of, stamped so
 * the identity-aware arity pad ({@link createInterpVarValue}) can resolve the
 * CSS identity element of an ABSENT function (e.g. `scale → 1`, `translateX →
 * 0px`) instead of the bare numeric `0`. `flattenObject`/value.js's parse tree
 * dissolves the `FunctionValue` wrapper into bare leaves, dropping the name; we
 * re-attach it here at flatten time. `value.js`'s `ValueUnit.clone()` does NOT
 * preserve this field, so the cache restamps it (see `tryParseLeaves`).
 */
const FN_NAME = Symbol("kf.fnName");

type NamedValueUnit = ValueUnit & { [FN_NAME]?: string };

/** Read the stamped flatten-origin function name off a leaf (if any). */
const fnNameOf = (u: ValueUnit): string | undefined =>
    (u as NamedValueUnit)[FN_NAME];

/** Stamp the flatten-origin function name onto a leaf, returning it. */
const stampFnName = (u: ValueUnit, fnName: string | undefined): ValueUnit => {
    if (fnName !== undefined) (u as NamedValueUnit)[FN_NAME] = fnName;
    return u;
};

const flattenToValueUnits = (
    value: unknown,
    fnName?: string,
): ValueUnit[] => {
    if (value instanceof ValueUnit) {
        return [stampFnName(value.clone(), fnName ?? fnNameOf(value))];
    }

    if (value instanceof FunctionValue) {
        // The function token (`scale`, `translateX`, `brightness`, …) lives on
        // `FunctionValue.name`; thread it down so each leaf remembers its
        // origin function for the identity-aware pad.
        return value.values.flatMap((entry) =>
            flattenToValueUnits(entry, value.name),
        );
    }

    if (value instanceof ValueArray) {
        return value.flatMap((entry) => flattenToValueUnits(entry, fnName));
    }

    throw new TypeError(
        `Expected ValueUnit/FunctionValue/ValueArray, got ${typeof value}`,
    );
};

const splitPathKey = (key: string): { mainKey: string; childKey: string } => {
    const childKey = key.split(".").pop();
    const mainKey = key.split(".").shift();

    if (!childKey || !mainKey) {
        throw new Error(`Invalid flattened key: ${key}`);
    }

    return { mainKey, childKey };
};

const applyPropertyContext = (
    values: ValueArray,
    mainKey: string,
    childKey: string,
) => {
    values.setProperty(mainKey);
    if (childKey !== mainKey) {
        values.setSubProperty(childKey);
    }
    return values;
};

/**
 * Match a CSS `cubic-bezier(x1, y1, x2, y2)` literal. Accepts
 * arbitrary whitespace and signed decimals. Standards-compliant
 * CSS timing-function syntax, as specified by CSS Easing Level 1.
 */
const CUBIC_BEZIER_LITERAL =
    /^\s*cubic-bezier\s*\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)\s*$/i;

/** Cheap prefix guards so a non-`steps(`/`linear(` string never reaches the
 * (throwing) value.js parsers — keeps the registry fall-through hot. */
const STEPS_PREFIX = /^\s*steps\s*\(/i;
const LINEAR_PAREN_PREFIX = /^\s*linear\s*\(/i;

/**
 * Resolve a timing-function input to a callable `TimingFunction`.
 *
 * Accepts:
 *   - a `TimingFunction` — returned as-is
 *   - a named entry in `timingFunctions` (`ease-out-cubic`,
 *     `easeOutCubic`, `linear`, etc.) — looked up in the registry
 *   - a CSS `cubic-bezier(x1, y1, x2, y2)` literal string —
 *     parsed to control points and resolved via `CSSCubicBezier`
 *   - a CSS `steps(n[, position])` literal plus the `step-start` /
 *     `step-end` keywords — resolved via `steppedEase`, so the full
 *     CSS Easing Level 1 vocabulary round-trips through `fromString`
 *   - `undefined` or a name/literal the registry can't find —
 *     returns `undefined` so callers can decide (the option setters
 *     throw a typed `AnimationOptionError`, fail-explicit)
 */
export const getTimingFunction = (
    timingFunction: TimingFunction | TimingFunctionNames | string | undefined,
): TimingFunction | undefined => {
    if (timingFunction == null) {
        return undefined;
    }
    if (typeof timingFunction !== "string") {
        return timingFunction;
    }

    // CSS `cubic-bezier(x1, y1, x2, y2)` literal.
    const bezierMatch = timingFunction.match(CUBIC_BEZIER_LITERAL);
    if (bezierMatch) {
        const parts = bezierMatch.slice(1, 5).map((s) =>
            Number.parseFloat(s ?? ""),
        );
        if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
            const [x1, y1, x2, y2] = parts as [number, number, number, number];
            return CSSCubicBezier(x1, y1, x2, y2);
        }
    }

    // CSS `steps(n[, position])` literal + the step keywords — parsed by
    // value.js's `parseSteps` (the full `steps(...)` string; throws on
    // `count < 1` / non-integer / malformed, `jumpTerm` defaults `jump-end`).
    // It throws where the old regex shim fell through, so wrap it: a malformed
    // `steps(...)` degrades to the registry lookup exactly as before.
    if (STEPS_PREFIX.test(timingFunction)) {
        try {
            const { count, jumpTerm } = parseSteps(timingFunction);
            return steppedEase(count, jumpTerm);
        } catch {
            // fall through to the registry / undefined
        }
    }
    if (timingFunction === "step-start") return steppedEase(1, "jump-start");
    if (timingFunction === "step-end") return steppedEase(1, "jump-end");

    // CSS `linear(...)` multi-stop easing — the curve the engine itself emits
    // (a spring's `linear()` from `springLinearStops`/`springTimingFunction`,
    // and any `@keyframes` `animation-timing-function: linear(...)`). Without
    // this branch a re-imported `linear()` falls through to the registry, fails
    // the lookup, and the option setter silently defaults to `easeInOutCubic` —
    // so the rAF JS curve and the compositor `linear()` twin disagree. value.js's
    // `parseLinearStops` takes the FULL `linear(...)` string (Level-2 grammar,
    // ≥1 stop) and THROWS on malformed input, so wrap it: a bad `linear()`
    // degrades to the registry lookup exactly as the old shim did (never a
    // silent wrong curve). `cssLinear` then closes the round-trip.
    if (LINEAR_PAREN_PREFIX.test(timingFunction)) {
        // value.js's own stylesheet serializer (`rule.timingFunction`) emits a
        // `linear()`'s stops as a FLAT comma list — `linear(0, 0.5, 25%, 1)` —
        // not the canonical space-joined `linear(0, 0.5 25%, 1)`. That form its
        // OWN `parseLinearStops` rejects, breaking the engine's spring-`linear()`
        // round-trip (a value.js 0.12.0 serialize/parse asymmetry). Fold a
        // comma that DIRECTLY precedes a `<number>%` back to a space: a `%` token
        // can only be a stop's INPUT position (a `%` output is invalid CSS), so
        // the fold is unambiguous. A canonical author `linear()` is untouched.
        const normalized = timingFunction.replace(
            /,\s*(-?[\d.]+%)/g,
            " $1",
        );
        try {
            return cssLinear(parseLinearStops(normalized));
        } catch {
            // fall through to the registry / undefined
        }
    }

    const resolved = timingFunctions[timingFunction as TimingFunctionNames];
    if (typeof resolved === "function" && resolved.length <= 1) {
        return resolved as TimingFunction;
    }
    return undefined;
};

/**
 * Bounded LRU over the string→flattened-leaf parse. value.js's `memoize`
 * (`{ maxCacheSize }`, evicts least-recently-used first) replaces the former
 * UNBOUNDED `Map` (the 6-tranche DL-K18 row), keyed by `(childKey, strValue)`
 * via an explicit `keyFn` (the `${childKey}:${strValue}` shape the old
 * hand-rolled cache used). The cached leaves are returned as fresh
 * `.clone()`s per call (the property context + `FN_NAME` stamp differ per
 * use-site), so the cache holds shared masters and never aliases. The bound is
 * value.js-consistent (its own default is `Infinity` — we pick an explicit
 * finite ceiling; a measured BOUND, not a perf rewrite). At ~hundreds of
 * distinct CSS literals per app this never evicts in practice; it only caps a
 * pathological unbounded-author-input leak.
 */
const TRY_PARSE_CACHE_MAX = 2048;

const tryParseLeaves = memoize(
    (childKey: string, strValue: string): ValueUnit[] => {
        // value.js and keyframes.js each ship their own copy of
        // @mkbabb/parse-that under different node_modules realms,
        // so the Parser<T> classes are nominally distinct from
        // TypeScript's perspective. The runtime is the same. Cast
        // to `any` to bypass the cross-realm type comparison.
        const fnArgs = (CSSFunction.FunctionArgs as any).map(
            (v: ValueArray) => {
                v.setSubProperty(childKey);
                return v;
            },
        );
        const p = tryParse(
            (parseAny as any)(fnArgs, CSSValues.Value),
            strValue,
        ) as ValueUnit | ValueArray | FunctionValue;

        return flattenToValueUnits(p);
    },
    {
        maxCacheSize: TRY_PARSE_CACHE_MAX,
        // The default `keyFn` is `JSON.stringify`, which keys off only the
        // FIRST argument (`childKey`) — collapsing every `strValue` under one
        // childKey to a single slot. Key on BOTH args explicitly (the old
        // hand-rolled cache used `${childKey}:${strValue}`).
        keyFn: (childKey: string, strValue: string) =>
            `${childKey}:${strValue}`,
    },
);

export function parseAndFlattenObject(
    input: Record<string, unknown>,
): ParsedVarMap {
    const flat = flattenObject(input) as Record<string, unknown>;

    const parse = (key: string, value: unknown): ValueArray => {
        const { childKey, mainKey } = splitPathKey(key);

        if (value instanceof ValueUnit) {
            return applyPropertyContext(
                new ValueArray(...flattenToValueUnits(value)),
                mainKey,
                childKey,
            );
        } else if (value instanceof FunctionValue) {
            const flattened = value.values.flatMap((entry) =>
                flattenToValueUnits(parse(key, entry), value.name),
            );
            return applyPropertyContext(
                new ValueArray(...flattened),
                mainKey,
                childKey,
            );
        } else if (value instanceof ValueArray) {
            const flattened = value.flatMap((entry) =>
                flattenToValueUnits(parse(key, entry)),
            );
            return applyPropertyContext(
                new ValueArray(...flattened),
                mainKey,
                childKey,
            );
        }

        // The bounded-LRU cache holds shared master leaves; clone per call so
        // the property context below (and any later mutation) is per-use-site.
        // `ValueUnit.clone()` drops the `FN_NAME` stamp, so re-apply it from the
        // master onto each clone — the identity-pad must see the origin function.
        const masters = tryParseLeaves(childKey, String(value));
        const leaves = masters.map((m) =>
            stampFnName(m.clone(), fnNameOf(m)),
        );

        return applyPropertyContext(
            new ValueArray(...leaves),
            mainKey,
            childKey,
        );
    };

    const parsedVars = Object.entries(flat).reduce<ParsedVarMap>(
        (acc, [key, value]) => {
            acc[key] = parse(key, value);
            return acc;
        },
        {},
    );

    return parsedVars;
}

export const createInterpVarValue = (
    v: string,
    startIx: number,
    endIx: number,
    vars: ParsedVarMap[],
    colorSpace: ColorSpace = "oklab",
    hueMethod?: HueInterpolationMethod,
) => {
    const startVars = vars[startIx];
    const endVars = vars[endIx];
    if (!startVars || !endVars) {
        throw new Error(
            `Invalid interpolation frame bounds (${startIx} -> ${endIx}).`,
        );
    }

    const left = startVars[v];
    const right = endVars[v];
    if (!left || !right) {
        throw new Error(`Missing variable "${v}" in interpolation bounds.`);
    }

    const maxLength = Math.max(left.length, right.length);
    /**
     * Pad `arr` up to `maxLength`. A padded slot stands in for a function the
     * OTHER side (`counterpart`) has but `arr` lacks — so its fill value is that
     * function's CSS IDENTITY element (`scale → 1`, `translateX → 0px`,
     * `brightness → 1`), resolved via value.js's `functionIdentityValue` off the
     * `FN_NAME` stamped at flatten time. Absent a known function name (a bare
     * scalar list, or a name value.js has no identity for) it falls back to the
     * historical `ValueUnit(0)` — so non-identity-`0` functions stop
     * silently-lerping from black/zero (MCI-5).
     */
    const padToLength = (arr: ValueArray, counterpart: ValueArray): ValueUnit[] => {
        const out = arr.map((entry) => {
            if (!(entry instanceof ValueUnit)) {
                throw new TypeError(
                    `Interpolation for "${v}" requires ValueUnit leaves.`,
                );
            }
            return entry;
        });

        while (out.length < maxLength) {
            const counterLeaf = counterpart[out.length];
            const fnName =
                counterLeaf instanceof ValueUnit
                    ? fnNameOf(counterLeaf)
                    : undefined;
            const identity = fnName ? functionIdentityValue(fnName) : undefined;
            out.push(identity ?? new ValueUnit(0));
        }
        return out;
    };

    const newLeft = padToLength(left, right);
    const newRight = padToLength(right, left);

    return newLeft.map((l, i) => {
        const r = newRight[i];
        if (!r) {
            throw new Error(
                `Missing right-hand interpolation value at index ${i}.`,
            );
        }
        if (!(l instanceof ValueUnit) || !(r instanceof ValueUnit)) {
            throw new TypeError(
                `Interpolation for "${v}" requires ValueUnit leaves.`,
            );
        }
        const opts: NormalizeValueUnitsOptions = { colorSpace };
        if (hueMethod !== undefined) opts.hueMethod = hueMethod;
        return prepareInterpVar(normalizeValueUnits(l, r, opts));
    });
};

export function calcFrameTime<V extends Vars>(
    startFrame: TemplateAnimationFrame<V>,
    endFrame: TemplateAnimationFrame<V>,
    duration: number,
) {
    const [start, stop] = [startFrame.start, endFrame.start];

    return {
        start: (start.value * duration) / 100,
        stop: (stop.value * duration) / 100,
    };
}

/**
 * Default DOM-style renderer used by `Animation.transform` when no
 * user-supplied transform is provided. "Is this the default renderer?"
 * is decided by reference comparison against the Animation instance's
 * one `_defaultTransform` (`usesDefaultRenderer`) — typed and
 * bind-proof, not a Symbol tag a wrapper would silently drop.
 */
export function transformTargetsStyle<V extends Vars>(
    vars: V,
    targets: HTMLElement[],
    flat: boolean = true,
) {
    vars = flat ? vars : (flattenObject(vars) as V);

    const styleStringVars = unflattenObjectToString(vars);

    targets.forEach((target) => {
        Object.entries(styleStringVars).forEach(([key, value]) => {
            target.style.setProperty(key, value);
        });
    });
}
