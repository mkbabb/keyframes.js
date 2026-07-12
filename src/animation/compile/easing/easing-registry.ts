/**
 * compile/easing/easing-registry.ts — `getTimingFunction`, the HEAVY synchronous
 * timing-function resolver (R.W1; lib-support F1/F7). Split off the misnamed
 * `utils.ts` god-module (now `parse-flatten.ts`) so it owns ONE concern: resolve
 * a timing-function input (a callable, a registry name, or a CSS
 * `cubic-bezier()`/`steps()`/`linear()` literal) to a callable `TimingFunction`.
 * Relocated into the `compile/easing/` sub-zone beside `easing-option.ts` in U.C8.
 *
 * Lives here (not in `easing.ts`) so `easing.ts:resolveEasing` can narrow its
 * dynamic import from the full engine chunk to `"./compile/easing/easing-registry"`
 * (lib-support F7). HEAVY (value.js-bearing — the registry + the CSS parsers).
 */
import { CSSCubicBezier, cssLinear, parseLinearStops, parseSteps, steppedEase, timingFunctions } from "@mkbabb/value.js/easing";
import type {
    TimingFunction,
    TimingFunctionNames,
} from "../../constants";

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
            // KEEP: fall through to the registry / undefined — a malformed
            // steps(...) degrades to the lookup, never a silent wrong curve.
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
        // value.js's serializer now emits canonical space-joined `linear()` stops
        // (`linear(0, 0.5 25%, 1)`) — VJ-L2 (value.js ≥ 1.0.0), consumed here — so
        // `parseLinearStops` takes the string DIRECTLY. The former flat-comma
        // normalize fold (a value.js 0.12.0 serialize/parse asymmetry workaround)
        // is RETIRED with the consume of the root fix (proof:workaround-deletion S7).
        // A bad `linear()` still degrades to the registry lookup (never a silent
        // wrong curve), exactly as before.
        try {
            return cssLinear(parseLinearStops(timingFunction));
        } catch {
            // KEEP: fall through to the registry / undefined — a bad linear()
            // degrades to the lookup, never a silent wrong curve.
        }
    }

    const resolved = timingFunctions[timingFunction as TimingFunctionNames];
    if (typeof resolved === "function" && resolved.length <= 1) {
        return resolved as TimingFunction;
    }
    return undefined;
};
