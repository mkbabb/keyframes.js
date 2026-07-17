/**
 * compile/emit/easing-serialize — the Easing → CSS `<easing-function>`
 * serialization tier (EN-a, S.B3; carved from format.ts at the S.B3 merge —
 * the 500L cohesion tripwire; this IS a seam: TimingFunction→CSS text, no
 * keyframe/block emission).
 */
import { camelCaseToHyphen } from "../../internal/helpers";
import type { Easing, TimingFunction } from "../../constants";
import { AnimationOptionError } from "../../internal/errors";
import { timingFunctionEntries } from "../easing/registry";

/**
 * EN-a (S.B3, P2-2 F6) — the SIX native-CSS `<easing-function>` keywords. A
 * registry name serializes VERBATIM only when its hyphenation IS one of these; a
 * `hyphenated` registry name outside this set (`ease-out-cubic`, `ease-in-quart`,
 * …) is NOT a CSS keyword and the browser drops the whole `animation` shorthand
 * (`animation-name: none`), so the emitted `@keyframes` artifact was browser-DEAD.
 */
const NATIVE_CSS_EASING =
    /^(linear|ease|ease-in|ease-out|ease-in-out|step-start|step-end)$/;

/** Round to 5 decimals — the `linear()` stop-value / percentage quantization. */
const round5 = (n: number): number => Math.round(n * 1e5) / 1e5;

/**
 * EN-a (S.B3, P2-2 F6) — the UNIVERSAL CSS twin: densify a `TimingFunction`
 * callable into a browser-valid `linear()` easing over `n + 1` evenly-spaced
 * samples. This is the SOLE twin mechanism (NOT a partial closed-form
 * `cubic-bezier()` table): most Penner curves (cubic/quart/quint/expo/circ) are
 * not a single bezier, and elastic/bounce are multi-oscillation with no bezier at
 * all — a partial table would be a faithfulness trap. `linear(n=32)` is faithful
 * for ALL of them, overshoot curves emit stop values outside `[0,1]` (which
 * `linear()` permits), percentages are monotone so the stop list is always
 * grammar-valid, and the emitted `linear(` re-parses to a `.css`-carrying FIXPOINT
 * (`animation.ts` `cssTwinFor` matches the `linear(` prefix) — serialize →
 * parse → serialize is stable.
 */
function linearDensifyEasing(fn: TimingFunction, n = 32): string {
    const stops: string[] = [];
    for (let i = 0; i <= n; i++) {
        const t = i / n;
        stops.push(`${round5(fn(t))} ${round5(t * 100)}%`);
    }
    return `linear(${stops.join(", ")})`;
}

/**
 * Serialize an `Easing` to its CSS `animation-timing-function` token (F.W7,
 * EN-a-hardened). A CSS-twinned easing emits its faithful CSS string VERBATIM (a
 * spring's `linear()`, a `cubic-bezier()` literal) — it is already CSS. Otherwise
 * the callable is reverse-looked-up in the registry:
 *   • a registry name whose hyphenation IS a native CSS keyword
 *     (`NATIVE_CSS_EASING`: `linear`/`ease`/`ease-in`/`ease-out`/`ease-in-out`/
 *     `step-start`/`step-end`) rides VERBATIM (byte-minimal + already browser-valid);
 *   • EVERY OTHER registry easing (`easeOutCubic` → `ease-out-cubic`, …) emits its
 *     `linear()` DENSIFY twin — because the hyphenated registry name is NOT a CSS
 *     `<easing-function>`, so the browser drops the whole `animation` shorthand
 *     (`animation-name: none`) and the shipped `@keyframes` is browser-DEAD (P2-2
 *     F6, live-proven against the unmodified dist). The kf parser re-reads the
 *     registry name happily — which is why every round-trip gate stayed green: the
 *     artifact round-trips through KF but NOT through the BROWSER.
 *
 * A custom closure has no faithful CSS twin (G.W4): when the easing carries no
 * `.css` and is NOT a value.js registry entry, the curve is genuinely
 * unrepresentable — fail-EXPLICIT (THROW naming the option + the faithful
 * remedies), never a silent WRONG emit. The THROW is PRESERVED for twinless
 * closures.
 */
export function serializeEasing(easing: Easing): string {
    if (easing.css !== undefined) return easing.css;
    const registryName = timingFunctionEntries.find(
        ([_name, func]) => func === easing.fn,
    )?.[0];
    if (registryName === undefined) {
        throw new AnimationOptionError(
            "timingFunction",
            easing.fn,
            "a custom TimingFunction has no CSS animation-timing-function " +
                "representation — attach a faithful Easing.css twin, or use a " +
                "registry name / cubic-bezier() / linear() literal",
        );
    }
    const hyphenated = camelCaseToHyphen(registryName);
    // A registry name whose hyphenation IS a native CSS keyword rides verbatim
    // (byte-minimal, already faithful + browser-valid). Every other registry
    // easing hyphenates to a NON-CSS token — emit its `linear()` twin (EN-a).
    if (NATIVE_CSS_EASING.test(hyphenated)) return hyphenated;
    return linearDensifyEasing(easing.fn);
}
