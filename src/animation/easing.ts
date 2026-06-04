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

/**
 * Names that are themselves valid CSS easing syntax — for these the
 * resolved {@link Easing} carries `css` so a WAAPI delegation can run the
 * native curve instead of falling back to bare `linear`.
 */
const CSS_NATIVE_EASING =
    /^(linear|ease|ease-in|ease-out|ease-in-out)$|^cubic-bezier\(/;

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
    if (CSS_NATIVE_EASING.test(name)) {
        easing.css = name;
    }
    return easing;
}
