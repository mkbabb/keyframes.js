/**
 * Easing construction at the light/heavy boundary.
 *
 * The light engines (`NumericAnimation`, `ElementMorph`, the `Timeline`
 * family) accept easing as a callable `TimingFunction` or a typed
 * {@link Easing} — synchronous, value.js-free. A string easing *name* from
 * value.js's registry is resolved ONCE, up front, through this module's
 * async factory — the single dynamic `import("./engine")` edge — and the
 * result is a plain callable the light engines consume with no pending
 * state, no identity fallback, and no resolver class.
 *
 * This replaces the former `EasingResolvable` (an async resolver smuggled
 * behind a sync API: identity-fallback-until-resolved, a dev-only warning
 * coupled to the bundler's console-drop, and a silent-permanent-identity
 * degradation on an unresolvable name — the fail-explicit violation). The
 * seam moves from "every `.at()` checks pending" to "resolve the name once,
 * explicitly, before construction."
 */
import type { Easing, TimingFunction } from "./constants";
import { UnknownEasingError } from "./internal/errors";

/**
 * Normalize a callable or typed easing to {@link Easing}. Synchronous and
 * value.js-free — the light-engine input normalizer.
 */
export const toEasing = (input: TimingFunction | Easing): Easing =>
    typeof input === "function" ? { fn: input } : input;

/** CSS easing keywords that are themselves valid `animation-timing-function`. */
const CSS_NATIVE_KEYWORD = /^(linear|ease|ease-in|ease-out|ease-in-out)$/;
/**
 * CSS `cubic-bezier(...)` / `steps(...)` / `linear(...)` literals + the
 * `step-*` keywords. `linear(...)` (CSS Easing L2, Baseline 2023) is a faithful
 * CSS twin like the others — including it lets the engine's OWN spring `linear()`
 * emission round-trip (emit → re-parse preserves the curve, not collapse to the
 * bare `linear` keyword) and delegate to the compositor (F.W7).
 */
const CSS_FUNCTION_EASING =
    /^(cubic-bezier\(|steps\(|linear\(|step-start$|step-end$)/;

/**
 * The faithful CSS easing string for an easing NAME / literal, or
 * `undefined` when the name has no faithful CSS twin (value.js bespoke
 * curves — `easeOutCubic`, `bounceInEase` — do NOT map to a CSS keyword).
 *
 * This is what makes a WAAPI delegation faithful: only an easing whose
 * `.css` is set delegates to the compositor; everything else runs the true
 * curve on the rAF path. Pure string logic — value.js-free.
 */
export const cssTwinFor = (name: string): string | undefined => {
    const trimmed = name.trim();
    if (CSS_NATIVE_KEYWORD.test(trimmed)) return trimmed;
    if (CSS_FUNCTION_EASING.test(trimmed)) return trimmed;
    return undefined;
};

/**
 * Resolve a string easing name (a value.js registry entry — `"easeOutCubic"`,
 * `"ease-out-cubic"`, … — or a CSS `cubic-bezier()` literal) to a typed
 * {@link Easing}.
 *
 * The lookup rides the dynamic engine boundary: `import("./engine")` loads
 * the value.js-bearing easing registry only when a named easing is actually
 * used, so a light-only consumer that never calls this stays value.js-free.
 *
 * Fail-explicit: an unresolvable name throws {@link UnknownEasingError};
 * an engine chunk-load failure rethrows with the failing easing named —
 * never an unhandled rejection, never a silent identity fallback.
 *
 * ```ts
 * const easing = await resolveEasing("easeOutCubic");
 * const anim = new NumericAnimation(frames, { timingFunction: easing });
 * ```
 */
export async function resolveEasing(name: string): Promise<Easing> {
    let engine: typeof import("./engine");
    try {
        engine = await import("./engine");
    } catch (cause) {
        throw new Error(
            `keyframes: the engine chunk failed to load while resolving ` +
                `easing "${name}" — the easing registry is unreachable.`,
            { cause },
        );
    }

    const fn = engine.getTimingFunction(name);
    if (!fn) {
        throw new UnknownEasingError(name);
    }

    const easing: Easing = { fn };
    const css = cssTwinFor(name);
    if (css) easing.css = css;
    return easing;
}
