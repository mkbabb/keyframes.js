/**
 * scroll/dispatch.ts — the BACKEND-DISPATCH + PIN-SYNTHESIS half of the scroll
 * zone (T.F22 — the per-zone cohesion carve off `scene.ts`).
 *
 * `scene.ts` owns the `ScrollScene` TIME driver (the range→[0,1] map, the scrub
 * smoother, the physics snap, the enter/leave thresholds). THIS file owns the
 * two STANDALONE decisions beside it — neither of which the `ScrollScene`
 * instance touches:
 *   • `dispatchScrollBackend` — the conservative-correct native-vs-JS backend
 *     choice with a queryable reason (the `waapiIneligibleReason` idiom pointed
 *     at the scroll clock).
 *   • `pinCSS` — the SO-3 `position:sticky` pin synthesis (kf authors the
 *     platform's pin; the browser pins on the compositor; SO-4 transform-pin
 *     KILLED).
 *
 * Pure extraction — zero behaviour change; the `scroll/` barrel re-exports this
 * surface from HERE (the `proof:scroll-roundtrip` / dispatch import set is
 * unchanged, only its source file moved). No new value.js edge: it references
 * value.js only via ERASED `import type` (through `../engine`); the HEAVY static
 * edge stays in `./grammar`. The whole scroll surface is reached ONLY via
 * `loadAnimationEngine()` (`proof:boundary`).
 */
import {
    attachNativeScrollTimeline,
    isWAAPIEligible,
    type NativeScrollAttachment,
} from "../waapi";
import {
    createNativeTimeline,
    type NativeTimelineSpec,
} from "../orchestration/timeline/native";
import type { KeyframesAnimation } from "../engine";
import type { Vars } from "../constants";

/**
 * The dispatch request — what the caller wants over the parsed scene. The matrix
 * reads these + the target shape to choose native vs JS (the conservative-correct
 * backend choice with a queryable reason).
 */
export interface ScrollDispatchRequest<V extends Vars> {
    /** The animation to drive over the scroll clock. */
    animation?: KeyframesAnimation<V> | undefined;
    /** The native timeline spec (`scroll`/`view`) for the eligible fast lane. */
    nativeSpec?: NativeTimelineSpec | undefined;
    /** True if scrub smoothing was requested (forces JS — native has no smoother). */
    scrub?: boolean | undefined;
    /** True if snap was requested (forces JS — native has no physics snap). */
    snap?: boolean | undefined;
    /** True if scroll velocity / non-DOM driving was requested (forces JS). */
    velocity?: boolean | undefined;
}

/** The backend selected for a scroll-driven animation. */
export type ScrollBackend = "native" | "js";

/** The dispatch verdict — which backend, and (for JS) the human-readable reason. */
export type ScrollDispatch =
    | { backend: "native"; attachment: NativeScrollAttachment }
    | { backend: "js"; reason: string };

/**
 * SO-1/SO-2 the DISPATCH (conservative-correct, with a queryable reason). The
 * WAAPI-eligibility seam pointed at the scroll clock:
 *
 *   DOM target + WAAPI-eligible + native ScrollTimeline present + NO scrub/snap/
 *   velocity                                                → NATIVE (zero main-thread)
 *   scrub OR snap OR velocity requested                     → JS (native has no smoother/snap)
 *   non-DOM target / no animation                           → JS (the universal driver)
 *   WAAPI-ineligible (computed unit / color / custom curve) → JS (the ineligible set)
 *   native ScrollTimeline ABSENT (Firefox, jsdom, SSR)      → JS (createNativeTimeline → null)
 *
 * The JS path NEVER deletes the native lane and the native path NEVER swallows
 * an ineligible animation — the reason string is the honesty surface (the
 * `waapiIneligibleReason` idiom). This ADDS a tier; it deletes no driver.
 */
export function dispatchScrollBackend<V extends Vars>(
    request: ScrollDispatchRequest<V>,
): ScrollDispatch {
    const { animation, nativeSpec, scrub, snap, velocity } = request;

    // A kf-only capability was requested — the native `animation-range` lane has
    // no smoother (`timeline.ts` pipeline note) and no physics snap, so the JS
    // ScrollScene is the ONLY correct backend.
    if (scrub) {
        return { backend: "js", reason: "scrub smoothing requested (native scroll has no SmoothProgress smoother)" };
    }
    if (snap) {
        return { backend: "js", reason: "physics snap requested (native scroll has no decay/spring settle)" };
    }
    if (velocity) {
        return { backend: "js", reason: "scroll velocity / non-DOM driving requested (JS-only capability)" };
    }

    // No animation or no native spec → the JS driver is the universal fallback
    // (non-DOM targets, plain-object/canvas/WebGL-uniform driving).
    if (animation == null || nativeSpec == null) {
        return { backend: "js", reason: "non-DOM target or no native timeline spec (the universal JS driver)" };
    }

    // The WAAPI-eligibility gate (DOM + default renderer + uniform timing + no
    // computed units + no color interp) — the conservative-correct condition for
    // the compositor fast lane.
    const elig = isWAAPIEligible(animation);
    if (!elig.eligible) {
        return { backend: "js", reason: elig.reason };
    }

    // Feature-detect the native global. createNativeTimeline → null on Firefox-
    // default / jsdom / SSR; the caller keeps the JS sampler.
    const timeline = createNativeTimeline(nativeSpec);
    if (timeline == null) {
        return { backend: "js", reason: "native scroll/view timeline unavailable (feature absent)" };
    }

    // Eligible + native present + no kf-only capability → attach NATIVE (zero
    // main-thread sampling), via the SHIPPED bridge.
    const attachment = attachNativeScrollTimeline(animation, nativeSpec, {
        eligibility: elig,
        timeline,
    });
    if (!attachment.attached) {
        // The bridge re-checked and refused — surface its reason on the JS path.
        return { backend: "js", reason: attachment.reason };
    }
    return { backend: "native", attachment };
}

/**
 * SO-3 the `position:sticky` pin SYNTHESIS — EMIT the pin CSS (kf authors the
 * platform's pin; the browser pins on the compositor). The pin uses
 * `position:sticky`, NEVER `transform:translateY` (SO-4 KILLED — cross-thread
 * jitter). Returns a declaration block string the consumer applies to the
 * pinned element. `top` defaults to `0` (pin to the scrollport top).
 *
 * @example
 * pinCSS()            // → "position: sticky; top: 0px;"
 * pinCSS({ top: 24 }) // → "position: sticky; top: 24px;"
 */
export function pinCSS(opts?: { top?: number; bottom?: number }): string {
    const decls = ["position: sticky;"];
    if (opts?.bottom != null) {
        decls.push(`bottom: ${opts.bottom}px;`);
    } else {
        decls.push(`top: ${opts?.top ?? 0}px;`);
    }
    return decls.join(" ");
}
