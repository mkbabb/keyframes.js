import { flattenObject, functionIdentityValue, FunctionValue, unflattenObjectToString, ValueArray, ValueUnit } from "@mkbabb/value.js/units";
import { parseCSSSubValue } from "@mkbabb/value.js/parsing";
import { memoize, normalizeValueUnits, prepareInterpVar } from "@mkbabb/value.js";
import type { HueInterpolationMethod } from "@mkbabb/value.js/color";
import type { ColorSpace } from "@mkbabb/value.js/color";
import type { NormalizeValueUnitsOptions } from "@mkbabb/value.js";
import type { Vars } from "../constants";

export type ParsedVarMap = Record<string, ValueArray>;

/**
 * The function-token name a leaf `ValueUnit` was flattened OUT of, tracked so
 * the identity-aware arity pad ({@link createInterpVarValue}) can resolve the
 * CSS identity element of an ABSENT function (e.g. `scale → 1`, `translateX →
 * 0px`) instead of the bare numeric `0`. `flattenObject`/value.js's parse tree
 * dissolves the `FunctionValue` wrapper into bare leaves, dropping the name; we
 * re-attach it here at flatten time.
 *
 * The provenance lives on value.js's first-class `ValueUnit.fnName` field
 * (VJ-Q4, value.js ≥ 1.2.0): a public, `clone()`-preserved property the leaf
 * carries natively. Setting it is NOT a foreign-Symbol stamp — `fnName` is
 * value.js's OWN field (its ctor's 7th positional arg, copied by `clone()`), so
 * the realm stays clean (`proof:no-foreign-symbol-stamp` — zero kf-OWNED
 * own-property on a value.js instance) AND the provenance survives `clone()`
 * for free. This RETIRES the former kf-module-local `WeakMap<ValueUnit,string>`
 * + the clone-restamp ceremony it forced: a `WeakMap` key is the instance,
 * which does NOT survive `clone()`, so every clone had to be re-stamped from
 * its master. The `clone()`-preserved field needs no restamp — the S8 terminal
 * (`proof:workaround-deletion` S8 GREEN).
 */

/** Read the flatten-origin function name off a leaf (if any). */
const fnNameOf = (u: ValueUnit): string | undefined => u.fnName;

const flattenToValueUnits = (
    value: unknown,
    fnName?: string,
): ValueUnit[] => {
    if (value instanceof ValueUnit) {
        const leaf = value.clone();
        // `clone()` preserves `fnName`; set the threaded origin only when the
        // caller supplies one (an inner `FunctionValue` leaf), else keep the
        // leaf's own (clone-carried) provenance.
        if (fnName !== undefined) leaf.fnName = fnName;
        return [leaf];
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

// `getTimingFunction` (the synchronous timing-function resolver) moved to the
// `./easing/easing-registry` module in the `compile/easing/` sub-zone (R.W1;
// lib-support F1/F7; relocated U.C8) so `easing.ts` can narrow its dynamic
// import. This module is now the CSS-leaf parse/flatten pipeline only.

/**
 * Bounded LRU over the string→flattened-leaf parse. value.js's `memoize`
 * (`{ maxCacheSize }`, evicts least-recently-used first) replaces the former
 * UNBOUNDED `Map` (the 6-tranche DL-K18 row), keyed by `(childKey, strValue)`
 * via an explicit `keyFn` (the `${childKey}:${strValue}` shape the old
 * hand-rolled cache used). The cached leaves are returned as fresh
 * `.clone()`s per call (the property context + flatten-origin provenance differ
 * per use-site), so the cache holds shared masters and never aliases. The bound is
 * value.js-consistent (its own default is `Infinity` — we pick an explicit
 * finite ceiling; a measured BOUND, not a perf rewrite). At ~hundreds of
 * distinct CSS literals per app this never evicts in practice; it only caps a
 * pathological unbounded-author-input leak.
 */
const TRY_PARSE_CACHE_MAX = 2048;

const tryParseLeaves = memoize(
    (childKey: string, strValue: string): ValueUnit[] => {
        // value.js's `parseCSSSubValue` internalizes the
        // `any(CSSFunction.FunctionArgs, CSSValues.Value)` composition
        // (FunctionArgs-FIRST) AND stamps `subProperty` onto every leaf — the
        // exact parse kf formerly hand-composed by reaching parse-that's `any`
        // combinator across the realm boundary (the cross-realm nominal-type
        // mismatch the `as any` casts papered over). Consuming value.js's own
        // entrypoint removes kf's direct `@mkbabb/parse-that` production
        // dependency (the acyclic-spine restoration; proof:boundary W96).
        const p = parseCSSSubValue(strValue, { subProperty: childKey });

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
        // `ValueUnit.clone()` PRESERVES the flatten-origin `fnName` field (VJ-Q4,
        // value.js ≥ 1.2.0), so the clone carries the master's provenance with no
        // re-stamp — the identity-pad reads `leaf.fnName` directly.
        const masters = tryParseLeaves(childKey, String(value));
        const leaves = masters.map((m) => m.clone());

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
     * flatten-origin provenance carried on the leaf's `fnName` field at flatten
     * time.
     * Absent a known function name (a bare
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

// `calcFrameTime` inlined into its sole consumer `./frame-compiler.ts` (R.W1 —
// lib-support: a 12-line helper with one caller).

/**
 * Per-frame reuse target for the default-renderer's flat-vars → style-string
 * conversion. `transformTargetsStyle` rides the rAF apply hot path (`engine.ts`
 * binds it as `_defaultTransform`, calls it every frame); without an `out`
 * argument `unflattenObjectToString` mints a fresh `Record<string,string>` each
 * call — steady-state GC pressure on every transform animation. value.js's sink
 * accepts a reuse `out` and CLEARS stale keys per call, so one module-scope
 * buffer refilled per frame eliminates the alloc. Safe to share: the function
 * drains the buffer synchronously (the `targets.forEach` runs to completion
 * before return) and JS is single-threaded, so no two applies interleave over it.
 */
const _styleOut: Record<string, string> = {};
const _styleKeys: string[] = [];
// CompositeState keeps inactive grouped keys as `undefined` to preserve the
// hot-path object shape. The value.js serializer intentionally assumes every
// enumerable value is printable, so reuse one filtered view at this output
// boundary instead of teaching the upstream sink about compositor sentinels.
const _definedVars: Record<string, any[]> = {};

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

    for (const key in _definedVars) delete _definedVars[key];
    for (const key in vars) {
        const value = vars[key];
        if (value !== undefined) _definedVars[key] = value as any[];
    }
    const styleStringVars = unflattenObjectToString(_definedVars, _styleOut);
    let styleKeyCount = 0;
    for (const key in styleStringVars) _styleKeys[styleKeyCount++] = key;
    _styleKeys.length = styleKeyCount;

    targets.forEach((target) => {
        for (let i = 0; i < styleKeyCount; i++) {
            const key = _styleKeys[i]!;
            target.style.setProperty(key, styleStringVars[key]!);
        }
    });
}
