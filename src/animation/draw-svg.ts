/**
 * DrawSVG — CSS-native SVG line-drawing (G.W13).
 *
 * Animate the "drawing" of an SVG stroke by sweeping `stroke-dashoffset` over a
 * `stroke-dasharray` set to the path's full length. This is the CSS-native
 * sliver of the SVG suite (GSAP DrawSVGPlugin / anime.js `createDrawable()`)
 * that needs ZERO new geometry: the BROWSER owns the length resolution via ONE
 * `getTotalLength()` read; keyframes only interpolates the scalar
 * `stroke-dashoffset`. The result is pure WAAPI-eligible CSS that delegates
 * compositor-thread through the EXISTING eligibility gate + `toWAAPIOptions`
 * (`waapi.ts`) — no new eligibility predicate, no second geometry home.
 *
 * ── WHAT THIS IS (the CSS-native sliver, G.W13 §Design-decision 1 / the F26-1c re-split)
 *   Line-drawing is `stroke-dashoffset: L → 0` over `stroke-dasharray: L` where
 *   `L = el.getTotalLength()` — ONE DOM read, NO `d`-parse, NO point-count
 *   reconciliation, NO value.js geometry. It mirrors `motion-path.ts` exactly:
 *   "the browser owns the geometry, keyframes interpolates a scalar." The
 *   heavier SVG-geometry half — MorphSVG / numeric MotionPath, which DO need a
 *   path-`d` sampler — is value-domain geometry math routed OUT to value.js
 *   (VJ-F1) and BOOKED, NOT manufactured here. DrawSVG needs NONE of it.
 *
 * ── WAAPI ELIGIBILITY (G.W13 §Design-decision 2, MEASURE-FIRST)
 *   `stroke-dashoffset` is a plain animatable `<length>` in user units — it
 *   carries no computed-unit or color disqualifier and needs NO percent
 *   exemption (unlike `offset-distance`). A `DrawSVG` over an SVG DOM target
 *   (`<path>`/`<line>`/`<circle>` …) with a uniform CSS-twin easing passes
 *   `isWAAPIEligible` UNCHANGED — the SIMPLEST eligible shape — and runs
 *   compositor-thread.
 *
 * ── BOUNDARY: HEAVY (no NEW static value.js edge).
 *   `draw-svg.ts` constructs `CSSKeyframesAnimation`, so it statically imports
 *   `./engine` — exactly like `motion-path.ts`. It carries NO `@mkbabb/value.js`
 *   import of its own, so it adds no new value.js edge beyond the engine it
 *   already composes; the barrel places it behind `loadAnimationEngine()`, so a
 *   light-only consumer never pulls it. `proof:boundary` stays green.
 */

import { CSSKeyframesAnimation } from "./engine";
import type { InputAnimationOptions } from "./constants";

/**
 * The minimal geometry contract DrawSVG needs: any SVG element that exposes
 * `getTotalLength()` (`SVGGeometryElement` — `<path>`, `<line>`, `<circle>`,
 * `<ellipse>`, `<rect>`, `<polygon>`, `<polyline>`). Narrower than `SVGElement`
 * so a non-geometry SVG node is a type error at the call site, not a runtime
 * surprise.
 */
export type SVGDrawTarget = SVGElement & { getTotalLength(): number };

export interface DrawSVGOptions extends Partial<InputAnimationOptions> {
    /**
     * Start of the draw sweep as a fraction of the stroke, `"0%"` → `"100%"`
     * (or a bare number read as a `%`). Default `"0%"` — the stroke starts
     * undrawn (full `stroke-dashoffset`) and draws IN. `"100%"` → `"0%"`
     * erases it.
     */
    from?: string | number;

    /** End of the draw sweep. Default `"100%"` (fully drawn). */
    to?: string | number;

    /**
     * Auto-start the play loop after construction + targeting. Default true.
     * `false` returns a constructed, targeted, NOT-yet-playing handle so the
     * caller can drive the returned animation (`.play()` / `.pause()` / `.stop()`).
     */
    autoPlay?: boolean;
}

/** Parse a draw fraction (`"0%"`, `"100%"`, `50`, `0.5`-as-`%`) to [0, 1]. */
const asFraction = (v: string | number): number => {
    const n = typeof v === "number" ? v : parseFloat(v);
    if (!Number.isFinite(n)) {
        throw new Error(
            `fromDrawSVG(): invalid draw fraction ${JSON.stringify(v)} — ` +
                `pass a percent string ("0%".."100%") or a number.`,
        );
    }
    return n / 100;
};

/**
 * Build a CSS-native SVG line-drawing animation: read the target's path length
 * ONCE, set `stroke-dasharray` to that length (one solid full-length dash), and
 * sweep `stroke-dashoffset` from → to (default `0% → 100%` ⇒ offset `L → 0`,
 * the line draws in). Returns the constructed {@link CSSKeyframesAnimation} as
 * the control handle (the `animate()` contract — `.play()` / `.pause()` /
 * `.stop()` / `.finished`), consistent with the `from*` factory family.
 *
 * The returned animation passes the EXISTING WAAPI eligibility gate
 * (`isWAAPIEligible`) for an SVG DOM target with a uniform CSS-twin easing, and
 * delegates compositor-thread via `playWAAPI` — no new eligibility predicate.
 *
 * The line length `L` is read a SINGLE time at construction (the
 * `motion-path.ts` "browser owns the geometry" pattern). A path mutated mid-draw
 * is a re-construct, not a per-frame re-measure — a per-frame `getTotalLength`
 * would be a layout round-trip the Mandate's measure-first forbids.
 *
 * @param target  an SVG geometry element exposing `getTotalLength()`.
 * @param options `{ from?, to?, ...animationOptions }`.
 *
 * @example
 * // Draw a path stroke in over 2s:
 * fromDrawSVG(pathEl, { duration: 2000 });
 */
export function fromDrawSVG<V extends Record<string, any> = any>(
    target: SVGDrawTarget,
    options: DrawSVGOptions = {},
): CSSKeyframesAnimation<V> {
    const {
        from = "0%",
        to = "100%",
        autoPlay = true,
        ...animOptions
    } = options;

    if (
        target == null ||
        typeof (target as { getTotalLength?: unknown }).getTotalLength !==
            "function"
    ) {
        throw new Error(
            "fromDrawSVG(): `target` must be an SVG geometry element exposing " +
                "getTotalLength() (a <path>/<line>/<circle>/<rect>/<polygon>/…).",
        );
    }

    const fromFrac = asFraction(from);
    const toFrac = asFraction(to);

    // ONE DOM read — the browser owns the geometry. `L` is the full path length;
    // a full-length dash with a swept offset is the genre's line-drawing idiom.
    const L = target.getTotalLength();

    // The dash pattern is the full length, so the stroke is one solid dash whose
    // visibility the offset reveals. Set as a STATIC value the offset sweeps
    // against — never animated, so it carries no per-frame cost.
    target.style.strokeDasharray = `${L}`;

    // The ONLY animated key is the scalar `stroke-dashoffset` (a bare <length>).
    // `offset = L * (1 - frac)`: frac 0 (undrawn) → offset L; frac 1 (drawn) →
    // offset 0. Default `0% → 100%` ⇒ `L → 0`, the line draws in.
    const keyframes = {
        "0%": { "stroke-dashoffset": L * (1 - fromFrac) },
        "100%": { "stroke-dashoffset": L * (1 - toFrac) },
    } as unknown as Record<string, Partial<V>>;

    const animation = new CSSKeyframesAnimation<V>(animOptions).fromKeyframes(
        keyframes,
    );

    animation.setTargets(target as unknown as HTMLElement);

    if (autoPlay) {
        // Fire the play loop; the handle carries the play promise via its own
        // re-entrant `play()`. We do NOT await — the handle IS the control
        // surface (the `animate()` contract).
        void animation.play();
    }

    return animation;
}

/**
 * `DrawSVG` — the class form of {@link fromDrawSVG}, for callers who prefer a
 * named primitive alongside `CSSKeyframesAnimation` / `MotionPath`. Construction
 * is the factory: `new DrawSVG(target).animation` is the control handle. The
 * factory is the canonical entry; this is a thin ergonomic wrapper.
 */
export class DrawSVG<V extends Record<string, any> = any> {
    /** The underlying stroke-dashoffset animation — the control handle. */
    readonly animation: CSSKeyframesAnimation<V>;

    constructor(target: SVGDrawTarget, options: DrawSVGOptions = {}) {
        this.animation = fromDrawSVG<V>(target, options);
    }

    /** Start (or re-enter) the line-drawing play loop. */
    play(): Promise<void> {
        return this.animation.play();
    }

    /** Pause the play loop, retaining the playhead. */
    pause(): this {
        this.animation.pause();
        return this;
    }

    /** Halt and rewind the play loop. */
    stop(): this {
        this.animation.stop();
        return this;
    }

    /** Resolve once the draw completes — the {@link Animation.finished} front-door. */
    get finished(): Promise<void> {
        return this.animation.finished;
    }
}
