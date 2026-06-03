import type { TimingFunction } from "../constants";

/**
 * A `TimingFunction` is an opaque `(t) => number` closure — the WAAPI
 * delegation path cannot recover a CSS easing string from it. When a closure
 * HAS a faithful CSS representation, we tag it here so the compositor can run
 * the real curve instead of falling back to bare `linear`. The mechanism is
 * general (any CSS easing string — `linear()`, `cubic-bezier()`, `steps()`);
 * today only `springTimingFunction` tags its closure (with a `linear()`).
 *
 * Value.js-free: only a `Symbol` + a type import (erased). Keeping it in
 * `internal/` lets the LIGHT producer (`springTimingFunction`) and the HEAVY
 * consumer (`waapi.ts`) share the tag without coupling their modules.
 */
const CSS_EASING = Symbol.for("keyframes.cssEasing");

/** Tag a `TimingFunction` with the CSS easing string (e.g. a `linear()`) that reproduces it. Returns the same closure. */
export function tagCSSEasing<F extends TimingFunction>(fn: F, css: string): F {
    (fn as unknown as Record<symbol, string>)[CSS_EASING] = css;
    return fn;
}

/** Read a `TimingFunction`'s CSS easing string tag, or `undefined` if it carries none. */
export function getCSSEasing(
    fn: TimingFunction | undefined,
): string | undefined {
    if (typeof fn !== "function") return undefined;
    const tagged = (fn as TimingFunction & Record<symbol, unknown>)[CSS_EASING];
    return typeof tagged === "string" ? tagged : undefined;
}
