import { COMPUTED_UNITS } from "@mkbabb/value.js";
import type { KeyframesAnimation } from "../engine";
import type { Vars } from "../constants";

/**
 * Units a delegated WAAPI animation must NOT carry — the layout-dependent
 * set. value.js's `COMPUTED_UNITS` is only `["var","calc"]` (the units the
 * engine resolves to a frozen px via a DOM round-trip during interpolation);
 * but WAAPI freezes a WIDER set. The rAF path re-emits each value as its OWN
 * unit string every frame (`width: 50vh`), so the browser re-resolves it on
 * every layout change; WAAPI computes its keyframes' viewport/container units
 * to px ONCE (at keyframe computation) and does not track a viewport/container
 * resize mid-animation — diverging from the rAF path. So every viewport- and
 * container-relative unit (plus `%`, resolved against the containing block)
 * stays on the rAF path, which is always pixel-correct.
 *
 * `var()`/`calc()` stay out for a deliberate, lasting reason beyond "needs DOM
 * resolution": a registered `@property` custom does not composite anyway (it
 * rasterizes per frame), so this rejection remains correct even as `@property`
 * reaches Baseline — it is not an incidental limitation to revisit.
 *
 * The guard is conservative by design: rejecting a unit only forgoes the
 * compositor optimization (the animation runs on rAF, always correct); it
 * never produces a wrong pixel. So the wider set trades a perf opportunity for
 * guaranteed isomorphism with the rAF path.
 */
const WAAPI_INELIGIBLE_UNITS: ReadonlySet<string> = new Set<string>([
    ...COMPUTED_UNITS, // var, calc — frozen-px via the computed round-trip
    "%",
    // viewport-relative (incl. the small/large/dynamic-viewport families)
    "vh",
    "vw",
    "vmin",
    "vmax",
    "vi",
    "vb",
    "svh",
    "svw",
    "svmin",
    "svmax",
    "svi",
    "svb",
    "lvh",
    "lvw",
    "lvmin",
    "lvmax",
    "lvi",
    "lvb",
    "dvh",
    "dvw",
    "dvmin",
    "dvmax",
    "dvi",
    "dvb",
    // container-query-relative
    "cqw",
    "cqh",
    "cqi",
    "cqb",
    "cqmin",
    "cqmax",
]);

/** True when a value's unit would freeze to px under WAAPI delegation. */
const isComputedUnit = (unit: unknown): boolean =>
    typeof unit === "string" && WAAPI_INELIGIBLE_UNITS.has(unit);

/**
 * Properties whose `%` resolves against a NON-layout-box reference the
 * compositor tracks correctly — so their `%` is exempt from the layout-`%`
 * rejection (F.W12 §Design-decision 3). `offset-distance`'s `%` is relative to
 * the resolved length of the element's `offset-path`, which WAAPI computes once
 * at keyframe computation and does not need to re-resolve on a layout resize
 * (unlike `width: %`, which tracks the containing block). The path itself
 * (`offset-path`) is a STATIC author value set on the element, not animated, so
 * the animated scalar is purely `offset-distance`.
 */
const PATH_RELATIVE_PERCENT_PROPERTIES: ReadonlySet<string> = new Set<string>([
    "offset-distance",
]);

/**
 * True when the property's `%` is path-relative (exempt from the layout-`%`
 * rejection). The flattened interpVars key MAY carry a dotted nesting prefix,
 * so the LEAF segment is matched — `offset-distance` admits whether it arrives
 * bare or nested. `calc`/`var` units are NOT exempted here (they still freeze);
 * only the `%` rejection is relaxed for the offset family.
 */
const isOffsetPercentProperty = (property: string): boolean =>
    PATH_RELATIVE_PERCENT_PROPERTIES.has(property) ||
    PATH_RELATIVE_PERCENT_PROPERTIES.has(property.split(".").pop() ?? property);

export type WAAPIEligibility =
    | { eligible: true }
    | { eligible: false; reason: string };

/**
 * WebKit ENGINE feature-detect (CE-1.0). `webkitConvertPointFromNodeToPage`
 * has shipped WebKit-only since Safari 4 and exists in no other engine —
 * unlike UA strings, where Chromium AND jsdom both advertise "AppleWebKit",
 * so a UA sniff would misfire in both. Read per call (a cheap property
 * probe) so a test can install/remove the marker around one assertion.
 */
const isWebKitEngine = (): boolean =>
    typeof (globalThis as { webkitConvertPointFromNodeToPage?: unknown })
        .webkitConvertPointFromNodeToPage === "function";

/**
 * Decide whether an animation can be delegated to the Web Animations
 * API for compositor-thread playback. Single source of truth — the
 * `Animation.play()` dispatcher consults this once, with no inline
 * pre-checks or post-failure fallbacks.
 *
 * Eligibility requires ALL of:
 * 1. At least one DOM target with `Element.animate()` available.
 * 2. Every frame uses the default DOM-style renderer (no user
 *    transform that WAAPI can't see).
 * 3. All frames share the same timing function (WAAPI exposes
 *    one easing per animation, not per stop).
 * 4. No layout-dependent units — `var`/`calc` (frozen to px via the
 *    computed round-trip), and every viewport-/container-relative unit
 *    plus `%` (WAAPI computes these to px once at keyframe computation and
 *    does not track a resize, unlike the rAF path which re-emits the unit
 *    string each frame). See {@link WAAPI_INELIGIBLE_UNITS}.
 * 5. No color interpolation — handled by perceptual color spaces in
 *    JS, not by WAAPI's RGB lerp.
 *
 * On failure returns a diagnostic `reason` so callers can surface it
 * to debug builds without a console.warn falling out of the engine.
 */
export function isWAAPIEligible<V extends Vars>(
    animation: KeyframesAnimation<V>,
): WAAPIEligibility {
    if (!animation.targets || animation.targets.length === 0) {
        return { eligible: false, reason: "no DOM targets" };
    }
    if (typeof animation.targets[0]?.animate !== "function") {
        return {
            eligible: false,
            reason: "target does not implement Element.animate()",
        };
    }

    for (const frame of animation.frames) {
        // Reference comparison against the instance's ONE default renderer —
        // typed and bind-proof, unlike the former Symbol tag (which
        // `Function.prototype.bind` silently dropped, making every
        // CSSKeyframesAnimation read as "custom transform" and the whole
        // WAAPI path dead in practice).
        if (!animation.usesDefaultRenderer(frame.transform)) {
            return {
                eligible: false,
                reason: "custom transform function (not the default DOM renderer)",
            };
        }
    }

    const firstTF = animation.frames[0]?.timingFunction;
    if (firstTF && animation.frames.length > 1) {
        for (let i = 1; i < animation.frames.length; i++) {
            // Compare the CALLABLE identity, not the Easing wrapper — two
            // frames eased by the same resolved `fn` wrapped in distinct
            // `{ fn }` objects are uniform.
            if (animation.frames[i]!.timingFunction.fn !== firstTF.fn) {
                return {
                    eligible: false,
                    reason: "non-uniform per-frame timing function (WAAPI supports one easing per animation)",
                };
            }
        }
        // A multi-segment CSS-twin easing (a spring's `linear()` across 2+
        // keyframe segments) is NO LONGER refused (S.F5c S2). Emitting the
        // per-segment `.css` twin as the effect easing WOULD restart the curve
        // at every stop — silently wrong — so instead the emit DENSIFIES the
        // composite per-segment curve into keyframes fed a SINGLE bare-`linear`
        // effect easing (`toWAAPIKeyframes` bakes `interpFrames`' true
        // multi-segment curve at the offsets where it bends; `toWAAPIOptions`
        // emits `linear` for the multi-segment case). The compositor's
        // piecewise-linear fill over the baked stops then tracks the true rAF
        // curve with NO per-segment restart — the "densify → single `linear()`"
        // collapse. The fidelity is guarded by `proof:waapi-adaptive-densify`
        // (the multi-segment-spring corpus curve + the multi-segment-eligible
        // clause). WebKit still holds a `linear()` twin on rAF below (CE-1.0).
    }

    // WAAPI may delegate ONLY when the (uniform) easing has a FAITHFUL CSS
    // representation — a `.css` twin (a spring's `linear()`, an explicit
    // `cubic-bezier()`/CSS-keyword/`steps()` easing). A bespoke callable
    // (the value.js `easeInOutCubic` default, `easeOutCubic`, `bounceInEase`,
    // a user closure) has NO faithful CSS twin, so delegating it would run
    // BARE LINEAR on the compositor — a silent visual regression. Those stay
    // on the rAF path, which runs the true curve. (Pre-KF-B1 the WAAPI path
    // was dead in practice, so this keeps the resurrection faithful:
    // delegate only when the curve round-trips to CSS.)
    if (firstTF && firstTF.css === undefined) {
        return {
            eligible: false,
            reason: "easing has no faithful CSS twin (would run bare linear on the compositor)",
        };
    }

    // CE-1.0 (J.W6 S9, measured on-device): WebKit refuses hardware
    // acceleration for ANY animation carrying a custom `linear()` easing —
    // even transform/opacity — so a delegated spring would run MAIN-THREAD
    // WAAPI: an extra effect object + the shadow tick loop wrapping an
    // animation no faster than the rAF path it bypassed. The delegation
    // contract (top of file) only ever trades a perf OPPORTUNITY, never a
    // loss, so the `linear()`-twinned easing (a spring's stops, or any
    // custom `linear()` string) is HELD on the rAF path for WebKit.
    // `cubic-bezier()`/keyword twins still delegate — the refusal is
    // `linear()`-specific (a WebKit engine behaviour, not a syntax gap).
    if (firstTF?.css?.startsWith("linear(") && isWebKitEngine()) {
        return {
            eligible: false,
            reason: "WebKit refuses HW-accel for linear() easing — the spring twin stays on the rAF path (CE-1.0)",
        };
    }

    // DATED RE-CHECK (S.F6, 2026-07-04): this hold is a measured-on-device
    // engine behavior, not a syntax gap — CE-1.0's `webkitConvertPointFromNodeToPage`
    // feature-detect will keep firing on every future Safari release until
    // WebKit itself ships HW-accel for a `linear()`-eased animation. RE-VERIFY ON
    // EACH SAFARI RELEASE: the first release that hardware-accelerates a custom
    // `linear()` timing function makes this carve-out removable — unlocking
    // compositor-thread springs on WebKit (kf's "springs on the compositor"
    // headline is a Chrome/Firefox story only until then). No re-check has found
    // that release yet.
    for (const frame of animation.frames) {
        for (const [property, interpVarArr] of Object.entries(
            frame.interpVars,
        )) {
            // `offset-distance`'s `%` resolves against the PATH LENGTH, not a
            // layout box (F.W12 §Design-decision 3 / MEASURE-FIRST). The
            // compositor resolves it correctly at keyframe computation and
            // does NOT need a per-frame layout round-trip — so it is exempt
            // from the `%`/computed-unit rejection that keeps viewport- and
            // container-relative `%` on the rAF path. The exemption is keyed
            // on the property, so a `width: %` (a real layout box) stays
            // ineligible — only the path-relative offset family is admitted.
            const pathRelativePercent = isOffsetPercentProperty(property);

            for (const iv of interpVarArr) {
                // Surgical exemption: ONLY the path-relative `%` is relaxed.
                // `calc`/`var` (and every viewport/container unit) still freeze
                // and stay ineligible even on the offset family.
                const startBad =
                    isComputedUnit(iv.start?.unit) &&
                    !(pathRelativePercent && iv.start?.unit === "%");
                const stopBad =
                    isComputedUnit(iv.stop?.unit) &&
                    !(pathRelativePercent && iv.stop?.unit === "%");
                if (startBad || stopBad) {
                    return {
                        eligible: false,
                        reason: `layout-dependent unit (${String(iv.start?.unit ?? iv.stop?.unit)}) would freeze to px under WAAPI`,
                    };
                }
                if (iv.start?.unit === "color" || iv.stop?.unit === "color") {
                    return {
                        eligible: false,
                        reason: "color interpolation requires perceptual lerp",
                    };
                }
            }
        }
    }

    return { eligible: true };
}
