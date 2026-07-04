/**
 * MotionPath — CSS-native path motion (F.W12).
 *
 * Animate an element along an author-supplied `offset-path` by sweeping
 * `offset-distance: from% → to%`. This is the highest-ROI competitor-feature
 * close (GSAP MotionPathPlugin / anime.js `createMotionPath` / Motion
 * `offsetPath`) that needs ZERO new geometry: the BROWSER owns the
 * `offset-path` → position resolution; keyframes only interpolates the scalar
 * `offset-distance`. The result is pure WAAPI-eligible CSS that delegates
 * compositor-thread through the EXISTING eligibility gate + `toWAAPIOptions`
 * (`waapi.ts`) — no new eligibility predicate, no second geometry home.
 *
 * ── WHAT THIS IS (the CSS-native sliver, F.W12 §Design-decision 1)
 *   `offset-distance` over `offset-path` is the one path capability that is
 *   pure CSS the compositor resolves. The heavier SVG-geometry half — parse a
 *   path `d` to a length-parametrized sampler (numeric/canvas MotionPath,
 *   MorphSVG, DrawSVG) — is value-domain geometry math, routed OUT to value.js
 *   (VJ-F1) and BOOKED, NOT manufactured here.
 *
 * ── WAAPI ELIGIBILITY (F.W12 §Design-decision 3, MEASURE-FIRST)
 *   `offset-distance`'s `%` resolves against the PATH LENGTH, not a layout box —
 *   so it is exempt from the WAAPI layout-`%` rejection (the exemption is keyed
 *   on the property in `waapi.ts`'s eligibility gate; `width: %` stays
 *   ineligible). A `MotionPath` over a DOM target with a uniform CSS-twin easing
 *   passes `isWAAPIEligible` UNCHANGED and runs compositor-thread.
 *
 * ── BOUNDARY: HEAVY (no NEW static value.js edge).
 *   `motion-path.ts` constructs `CSSKeyframesAnimation`, so it statically
 *   imports `./engine` — exactly like `draw-svg.ts`. It carries NO
 *   `@mkbabb/value.js` import of its own (any light leaf it needs comes from
 *   `./internal/leaves`), so it adds no new value.js edge beyond the engine it
 *   already composes; the barrel places it behind `loadAnimationEngine()` (the
 *   lead wires that), so a light-only consumer never pulls it. `proof:boundary`
 *   stays green.
 */

import { CSSKeyframesAnimation } from "../engine";
import { SVGAnimationHandle } from "./handle";
import type { InputAnimationOptions, Vars } from "../constants";

/**
 * The author's path geometry — the `offset-path` value set on the target. Any
 * valid CSS `offset-path`: a `path()` data string, a `ray()`, a `url(#id)`
 * SVG-path reference, or a basic shape. The browser resolves it to positions;
 * keyframes never parses it.
 */
export type OffsetPath = string;

export interface MotionPathOptions extends Partial<InputAnimationOptions> {
    /**
     * The author `offset-path` (required) — set on the target so the browser
     * resolves position from `offset-distance`. See {@link OffsetPath}.
     */
    path: OffsetPath;

    /**
     * Start of the `offset-distance` sweep. Default `"0%"` (the path origin).
     * Any `<length-percentage>` the property accepts; `%` is path-relative.
     */
    from?: string;

    /** End of the sweep. Default `"100%"` (the path end). */
    to?: string;

    /**
     * Optional `offset-rotate` set on the target for tangent-following — e.g.
     * `"auto"` (the element rotates to face along the path) or `"auto 90deg"`.
     * A STATIC author value (not animated); omitted leaves the CSS default.
     */
    rotate?: string;

    /**
     * Auto-start the play loop after construction + targeting. Default true.
     * `false` returns a constructed, targeted, NOT-yet-playing handle so the
     * caller can drive the returned animation (`.play()` / `.pause()` / `.stop()`).
     */
    autoPlay?: boolean;
}

/** Normalize a `<length-percentage>` (a bare number → a `%` string). */
const asDistance = (v: string | number): string =>
    typeof v === "number" ? `${v}%` : v;

/**
 * Build a CSS-native path-motion animation: set the author `offset-path` (and
 * optional `offset-rotate`) on the target(s), and sweep `offset-distance` from
 * → to. Returns the constructed {@link CSSKeyframesAnimation} as the control
 * handle (the control-handle contract — `.play()` / `.pause()` / `.stop()` / the
 * awaitable play promise), consistent with the `from*` factory family.
 *
 * The returned animation passes the EXISTING WAAPI eligibility gate
 * (`isWAAPIEligible`) for a DOM target with a uniform CSS-twin easing, and
 * delegates compositor-thread via `playWAAPI` — no new eligibility predicate.
 *
 * @param target  one or more DOM elements (or a single element) to move.
 * @param options `{ path, from?, to?, rotate?, ...animationOptions }`.
 *
 * @example
 * // Move a box along a quadratic path, facing along it, over 2s:
 * fromMotionPath(box, {
 *   path: "path('M 0 0 Q 100 -100 200 0')",
 *   rotate: "auto",
 *   duration: 2000,
 * });
 */
export function fromMotionPath<V extends Vars = Vars>(
    target: HTMLElement | HTMLElement[],
    options: MotionPathOptions,
): CSSKeyframesAnimation<V> {
    const {
        path,
        from = "0%",
        to = "100%",
        rotate,
        autoPlay = true,
        ...animOptions
    } = options;

    if (typeof path !== "string" || path.length === 0) {
        throw new Error(
            "fromMotionPath(): `path` is required — pass an offset-path value (a path()/ray()/url(#id) string).",
        );
    }

    const targets = Array.isArray(target) ? target : [target];

    // Set the AUTHOR path (and optional tangent-rotate) on every target. These
    // are STATIC values the browser resolves position from — never animated, so
    // they carry no per-frame cost and do not enter the keyframe set.
    for (const el of targets) {
        el.style.offsetPath = path;
        if (rotate !== undefined) el.style.offsetRotate = rotate;
    }

    // The ONLY animated key is the scalar `offset-distance` (a path-relative
    // `<length-percentage>`), swept from → to. This is exactly the shape the
    // engine parses, frames, and delegates — the browser owns the geometry.
    const keyframes = {
        "0%": { "offset-distance": asDistance(from) },
        "100%": { "offset-distance": asDistance(to) },
    } as unknown as Record<string, Partial<V>>;

    const animation = new CSSKeyframesAnimation<V>(animOptions).fromKeyframes(
        keyframes,
    );

    animation.setTargets(...targets);

    if (autoPlay) {
        // Fire the play loop; the handle carries the play promise via its own
        // re-entrant `play()`. We do NOT await — the handle IS the control
        // surface (the control-handle contract).
        void animation.play();
    }

    return animation;
}

/**
 * `MotionPath` — the class form of {@link fromMotionPath}, for callers who
 * prefer a named primitive alongside `CSSKeyframesAnimation`. Construction is
 * the factory: `new MotionPath(target, { path }).animation` is the control
 * handle. The factory is the canonical entry; this is a thin ergonomic wrapper.
 */
export class MotionPath<
    V extends Vars = Vars,
> extends SVGAnimationHandle<V> {
    // S.B4 (a20 F1+F2) — the `animation` control handle + play/pause/stop/finished
    // delegation live on `SVGAnimationHandle`; `extends` gives `MotionPath` the
    // `.finished` getter it was silently MISSING (closed by construction).
    constructor(
        target: HTMLElement | HTMLElement[],
        options: MotionPathOptions,
    ) {
        super(fromMotionPath<V>(target, options));
    }
}
