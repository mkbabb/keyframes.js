/**
 * CSS-rule METADATA RECOVERY (the W1/W2 seam) — the standalone helpers the
 * `CSSKeyframesAnimation` engine calls in `fromString` to recover, off the SAME
 * value.js parse, the rule metadata the `@keyframes` grammar surfaced beside the
 * frames themselves: the `@property` typed-custom registry and the scroll-driven
 * timeline grammar. One cohesive concern — "read the metadata the parser already
 * computed back onto the animation" — lifted off the engine god-object.
 *
 * INTERNAL colocated module — NOT a barrel export. The class keeps the thin
 * delegating call sites (`recoverScrollOptions(...)`, `registerPropertyDescriptors(
 * this.propertyRegistry)`); the VALIDATION / feature-detect / per-descriptor
 * try/catch logic — the bulk — lives here. The engine still imports it
 * STATICALLY; both ride the same heavy `loadAnimationEngine()` chunk, so the
 * dynamic boundary is unchanged. ZERO behavior change — the helpers do exactly
 * what the inlined `fromString` / `registerProperties` bodies did.
 *
 * value.js is reached only for the metadata types (`PropertyDescriptor`,
 * `CSSTimelineOptions`, `Stylesheet`) and `extractTimelineOptions` — the same
 * heavy surface `engine.ts` already imports.
 */
import {
    extractAnimationOptions,
    extractTimelineOptions,
    type CSSTimelineOptions,
    type PropertyDescriptor,
    type Stylesheet,
} from "@mkbabb/value.js";
import type { Diagnostic } from "../adapter";
import type { CompositeOperator, InputAnimationOptions } from "../constants";

/** The parsed sibling-rule `animation` shape value.js surfaces (the EMIT source). */
type ParsedAnimationOptions = ReturnType<typeof extractAnimationOptions>;

/**
 * Translate a sibling style rule's parsed `animation` shorthand/longhands into
 * the engine's option BASE (F.W8). value.js's `extractAnimationOptions` returns
 * only the DECLARED fields; this maps its CSS shape to the engine's
 * (`infinite` → `Infinity`; the timing-function string flows through the engine's
 * `getTimingFunction` exactly as the per-keyframe case does, downstream of the
 * `setOptions` merge). Returns an EMPTY object (byte-identical no-op) when the
 * input carried no style rule — the caller skips `setOptions` on an empty base.
 *
 * The caller merges this base UNDER the constructor-explicit options
 * (`{ ...base, ...ctorOptions }`), so an author's `animation:` longhand is the
 * default and the constructor wins on conflict.
 */
export function recoverAnimationOptionsBase(
    opt: ParsedAnimationOptions,
): Partial<InputAnimationOptions> {
    const base: Partial<InputAnimationOptions> = {};
    if (opt.duration != null) base.duration = opt.duration;
    if (opt.timingFunction != null)
        base.timingFunction =
            opt.timingFunction as InputAnimationOptions["timingFunction"];
    if (opt.iterationCount !== undefined)
        base.iterationCount =
            opt.iterationCount === null ? Infinity : opt.iterationCount;
    if (opt.direction != null)
        base.direction = opt.direction as NonNullable<
            InputAnimationOptions["direction"]
        >;
    if (opt.delay != null) base.delay = opt.delay;
    if (opt.fillMode != null)
        base.fillMode = opt.fillMode as NonNullable<
            InputAnimationOptions["fillMode"]
        >;
    // L.W1 S5 (Band A) — the LAYER-level `animation-composition` longhand value.js
    // 0.13.0 surfaces on `CSSAnimationOptions.composition`. Carry it onto
    // `options.composite` so an authored `animation-composition: add` (arriving via
    // a sibling `.class` rule) round-trips instead of dropping.
    if (opt.composition != null)
        base.composite = opt.composition as CompositeOperator;
    return base;
}

/**
 * Recover the scroll grammar from the SAME parse (L.W2 S1 — CC-6). value.js's
 * `extractTimelineOptions` reads `animation-timeline`/`animation-range`/
 * `timeline-scope`/`animation-trigger` off the stylesheet into a typed
 * `CSSTimelineOptions`. Returns the typed options ONLY when scroll grammar is
 * actually present (value.js returns `{}` for a canonical time-clock
 * animation), so the compiler's EMIT half threads only a real scroll source —
 * a plain animation recovers `undefined` (byte-identical to before).
 *
 * The caller (`fromString`) ASSIGNS the field on a present result and DELETEs it
 * on `undefined`, so a re-parse with no scroll grammar clears a stale field
 * rather than assigning `undefined` into the optional (the
 * `exactOptionalPropertyTypes` contract on `scrollOptions`).
 */
export function recoverScrollOptions(
    stylesheet: Stylesheet,
): CSSTimelineOptions | undefined {
    const timeline = extractTimelineOptions(stylesheet);
    return Object.keys(timeline).length > 0 ? timeline : undefined;
}

/**
 * Register every parsed `@property` descriptor with the UA via
 * `CSS.registerProperty` (D-LIB-1) — one guarded pass at the end of
 * `fromString`. Feature-detected (`CSS.registerProperty` may be absent: SSR,
 * jsdom, older engines) so it no-ops to today's behaviour where unsupported. A
 * duplicate-name re-registration throws a benign `InvalidModificationError` (the
 * global registry is process-wide and idempotent for a given name) — swallowed
 * per-descriptor so one already-registered name never aborts the rest of the
 * pass.
 *
 * Until this pass the registry is an inert metadata-recovery `Map`; a typed
 * custom the author declared via `@property` is, to the browser, an untyped
 * string — so the WAAPI path animates it DISCRETELY (a silent regression vs the
 * rAF path's JS interpolation). Registering makes the native path interpolate
 * the typed custom SMOOTHLY (isomorphism-restoring). The JS path is the verbatim
 * fallback.
 *
 * R.W3 §2A (FAIL-EXPLICIT): only the benign duplicate-name
 * `InvalidModificationError` is swallowed. Any OTHER UA rejection (malformed
 * syntax / invalid initial value) pushes a `PROPERTY_REGISTER_REJECTED`
 * diagnostic — the WAAPI path would animate the typed custom DISCRETELY
 * without this row, a silent regression vs the rAF path's JS interpolation.
 *
 * Baseline 2024-07-09 (newly available — feature-detect mandatory).
 */
export function registerPropertyDescriptors(
    registry: Map<string, PropertyDescriptor>,
    diagnostics: Diagnostic[],
): void {
    if (
        typeof CSS === "undefined" ||
        typeof CSS.registerProperty !== "function"
    ) {
        return;
    }
    for (const [name, descriptor] of registry) {
        // `syntax` is required by the platform; a descriptor parsed without
        // one cannot be registered (it stays an untyped custom). value.js's
        // `ValueArray.toString()` is the canonical CSS serialization of the
        // initial value (the same form value.js emits for `initial-value:`).
        if (descriptor.syntax == null) continue;
        const definition: PropertyDefinition = {
            name,
            syntax: descriptor.syntax,
            inherits: descriptor.inherits ?? false,
        };
        if (descriptor.initialValue != null) {
            definition.initialValue = descriptor.initialValue.toString();
        }
        try {
            CSS.registerProperty(definition);
        } catch (err) {
            if (
                err instanceof DOMException &&
                err.name === "InvalidModificationError"
            ) {
                // Benign: the property is already registered with these
                // semantics (the global registry is process-wide and
                // idempotent for a given name). The JS path remains correct.
                continue;
            }
            // A genuine UA rejection (malformed syntax / invalid initial
            // value) — surface it so the author knows the WAAPI path will
            // animate this typed custom DISCRETELY (a rAF-vs-WAAPI
            // regression). Do NOT silently swallow (R.W3 §2A).
            diagnostics.push({
                code: "PROPERTY_REGISTER_REJECTED",
                property: name,
                message: `CSS.registerProperty refused @property ${name}: ${String(err)}`,
            });
        }
    }
}
