/**
 * orchestration/timeline/native.ts — the platform native-timeline feature-detect
 * (R.W1; lib-light F-9). Split off the JS sampler family (`./index`) by the
 * consumer seam: `native.ts` is consumed by `waapi/` (the HEAVY native scroll
 * bridge) while the JS `Timeline` family is the general caller-polled sampler.
 * Both stay LIGHT (value.js-free — these are DOM globals + an `in`-detect).
 */

/**
 * The scroll/view timeline axis — the `block|inline|x|y` keyword set. A LOCAL
 * structural alias of the DOM lib's ambient `ScrollAxis` global (R.W4b): it is
 * byte-identical to `lib.dom.d.ts`'s `type ScrollAxis = "block" | "inline" | "x"
 * | "y"`, but as a NAMED module export it is FOLLOWABLE by the `./engine` subpath
 * dts roll-up (API Extractor cannot follow a bare ambient-global reference reached
 * transitively through `ScrollScene` — it throws "Unable to follow symbol for
 * ScrollAxis"). value.js-free (a string-literal union — these are DOM keywords).
 */
export type ScrollTimelineAxis = "block" | "inline" | "x" | "y";

/**
 * Spec for the ADDITIVE native scroll-driven bridge (D-LIB-2 / F-5).
 *
 * A `kind: "scroll"` request maps to the platform `ScrollTimeline` (scroll
 * progress over a `source` scroller); `kind: "view"` maps to `ViewTimeline`
 * (a `subject`'s view progress through its scrollport). `axis` defaults to the
 * platform default (`block`). value.js-free — these are DOM globals.
 */
export type NativeTimelineSpec =
    | { kind: "scroll"; source?: Element | null; axis?: ScrollTimelineAxis }
    | { kind: "view"; subject: Element; axis?: ScrollTimelineAxis; inset?: string };

/**
 * Feature-detect (`"ScrollTimeline" in window` / `"ViewTimeline" in window`)
 * and construct a NATIVE `AnimationTimeline` for the additive WAAPI scroll
 * bridge (D-LIB-2 / F-5). Returns `null` where the platform lacks the API
 * (Firefox today, SSR, jsdom) — the caller then keeps the JS Timeline sampler,
 * which is the proven fallback AND the only general driver over non-DOM targets.
 *
 * CRITICAL — the ARCH-kill HOLDS: this does NOT replace the JS sampler. Native
 * scroll-driven is Chromium-only / not-Baseline, and the JS `Timeline` is a
 * strictly more general caller-polled sampler (it also applies `SmoothProgress`
 * smoothing + boundary snap the native `animation-range` path has none of). The
 * bridge is a pure additive fast lane where supported + eligible. No polyfill.
 *
 * Light: a runtime `in`-detect over the `window` globals — zero static
 * value.js / engine edge, so importing this keeps the timeline zone light.
 */
export function createNativeTimeline(
    spec: NativeTimelineSpec,
): AnimationTimeline | null {
    if (typeof window === "undefined") return null;

    // Qualify with `globalThis.` — the bare identifier `ScrollTimeline` is the
    // module's backward-compat re-export alias of the JS `KeyframesScrollTimeline`
    // sampler (PKG-3, L.W8 §S4), NOT the native platform global; `globalThis.`
    // pins the platform's own constructor (typed by lib.dom's `declare var
    // ScrollTimeline`). The option types are DERIVED from those constructors
    // (`ConstructorParameters`) — the JS sampler's own option interface is now
    // `KeyframesScrollTimelineOptions`, distinct from lib.dom's
    // `ScrollTimelineOptions`, so the names no longer shadow.
    if (spec.kind === "scroll") {
        if (typeof globalThis.ScrollTimeline === "undefined") return null;
        type NativeScrollOptions = NonNullable<
            ConstructorParameters<typeof globalThis.ScrollTimeline>[0]
        >;
        const options: NativeScrollOptions = {};
        if (spec.source !== undefined) options.source = spec.source;
        if (spec.axis !== undefined) options.axis = spec.axis;
        return new globalThis.ScrollTimeline(options);
    }

    if (typeof globalThis.ViewTimeline === "undefined") return null;
    type NativeViewOptions = NonNullable<
        ConstructorParameters<typeof globalThis.ViewTimeline>[0]
    >;
    const options: NativeViewOptions = { subject: spec.subject };
    if (spec.axis !== undefined) options.axis = spec.axis;
    if (spec.inset !== undefined) options.inset = spec.inset;
    return new globalThis.ViewTimeline(options);
}
