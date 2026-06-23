/**
 * MorphSVG — SVG path-shape morphing (O.W6, the DM-3 7-tranche chronic terminal).
 *
 * Morph one SVG `<path>` `d` string INTO another of differing geometry (GSAP
 * `MorphSVGPlugin` / Flubber parity): sample both paths at `samples` uniform
 * arc-length intervals, pair the point sets, and interpolate the `(x, y)` pairs
 * across `t` to drive the morphed polyline. This is the THIRD member of the
 * HEAVY `from*`-over-geometry family, beside `fromMotionPath` (offset-distance
 * over an author offset-path) and `fromDrawSVG` (stroke-dashoffset over the
 * path length) — the same `CSSKeyframesAnimation`-handle return.
 *
 * ── WHO OWNS WHAT (the seam, beside motion-path.ts / draw-svg.ts)
 *   value.js's `PathGeometry` owns the geometry: it parses a `d` string ONCE at
 *   construction, builds the cumulative arc-length table, and answers
 *   `getPointAtT(t)` as a binary-search + lerp (DOM-free — value.js named
 *   keyframes.js MorphSVG as the consumer, `transform/path.d.ts:5-10`).
 *   keyframes.js owns the COMPOSITOR: sample both polylines at `samples` uniform
 *   `t`, emit per-point numeric coordinate keys, and let the engine's native
 *   numeric `lerp` traverse from the `from`-polyline at `0%` to the `to`-polyline
 *   at `100%`. The morph is the engine interpolating those coordinates; the
 *   morphed `d` at any `t` is reassembled from the interpolated points by
 *   {@link MorphSVG.sampleD}.
 *
 * ── WHY UNIFORM SAMPLING (the engine-compatibility floor, NOT a quality ceiling)
 *   Sampling BOTH paths at the same `samples` count guarantees MATCHED point
 *   counts between the `0%` and `100%` frames — exactly what interpolating a
 *   polyline channel requires (both frames emit the same `samples + 1` point
 *   keys). Topology-aware vertex correspondence (the Flubber "matched command
 *   counts / shape resampling" refinement) is a QUALITY follow-on over this
 *   floor — uniform sampling already produces a valid, interpolating morph
 *   (BOOKED, not required for the chronic exit).
 *
 * ── BOUNDARY: HEAVY (exactly ONE value.js edge — `PathGeometry`).
 *   `morph-svg.ts` constructs `CSSKeyframesAnimation`, so it statically imports
 *   `./engine` (exactly like `motion-path.ts` / `draw-svg.ts`). Unlike those two
 *   it ALSO imports `PathGeometry` from `@mkbabb/value.js` — the ONE value.js
 *   symbol it legitimately needs (value.js owns the geometry; kf does NOT
 *   re-home a path-`d` parser). The file is HEAVY and rides
 *   `loadAnimationEngine()`, so a LIGHT-only consumer never pulls it: the barrel
 *   exposes ONLY `MorphSVGOptions` (a type, erased). `proof:boundary` stays
 *   green; `proof:morphsvg-consume`'s `single-valuejs-edge` clause asserts the
 *   exactly-one specifier.
 */

import { PathGeometry } from "@mkbabb/value.js";
import { CSSKeyframesAnimation } from "./engine";
import type { InputAnimationOptions } from "./constants";
import { AnimationOptionError } from "./internal/errors";

/** A sampled point on a path polyline. */
export interface MorphPoint {
    x: number;
    y: number;
}

export interface MorphSVGOptions extends Partial<InputAnimationOptions> {
    /**
     * The number of uniform arc-length steps each path is sampled at. The
     * morph emits `samples + 1` point-pairs (the endpoints inclusive), and the
     * MATCHED count between the `0%` and `100%` frames is what makes the
     * polyline channel interpolable. Default `64` — the keystone-validated
     * resolution. Must be an integer `>= 2` (a 1-sample "morph" is just the two
     * endpoints with no body); a smaller / non-integer value throws.
     */
    samples?: number;

    /**
     * Optional target the morph drives. When given, the morph writes the
     * interpolated polyline `d` (`MorphSVG.sampleD`) onto the target's
     * `--morph-d` CSS custom property each frame so an author can render it
     * (e.g. `<path d="" style="d: var(--morph-d)">` or a JS reader). Default
     * target-less: the returned handle IS the control surface, exactly like
     * `fromDrawSVG`'s target-less form — `MorphSVG.sampleD(t)` reads the
     * morphed `d` directly without a DOM write.
     */
    target?: HTMLElement | SVGElement;

    /**
     * Auto-start the play loop after construction + targeting. Default true.
     * `false` returns a constructed, NOT-yet-playing handle so the caller can
     * drive the returned animation (`.play()` / `.pause()` / `.stop()`).
     */
    autoPlay?: boolean;
}

/** The default uniform-sample count — the keystone-validated resolution. */
const DEFAULT_SAMPLES = 64;

/** The per-point coordinate key prefix (a CSS custom property, kebab-safe). */
const xKey = (i: number): string => `--morph-${i}-x`;
const yKey = (i: number): string => `--morph-${i}-y`;

/**
 * Sample a {@link PathGeometry} at `n + 1` uniform `t` in `[0, 1]`, returning
 * the `(x, y)` point array (length `n + 1`). The arc-length table was built at
 * construction, so each `getPointAtT` is a binary-search + lerp — no re-parse.
 */
const samplePolyline = (geo: PathGeometry, n: number): MorphPoint[] => {
    const pts: MorphPoint[] = new Array(n + 1);
    for (let i = 0; i <= n; i++) {
        pts[i] = geo.getPointAtT(i / n);
    }
    return pts;
};

/** Assemble a polyline point array into an SVG `d` string (`M … L … L …`). */
const pointsToD = (pts: MorphPoint[]): string => {
    if (pts.length === 0) return "";
    const fmt = (n: number): string =>
        Number.isInteger(n) ? `${n}` : n.toFixed(3);
    let d = `M ${fmt(pts[0]!.x)} ${fmt(pts[0]!.y)}`;
    for (let i = 1; i < pts.length; i++) {
        d += ` L ${fmt(pts[i]!.x)} ${fmt(pts[i]!.y)}`;
    }
    return d;
};

/**
 * Build an SVG path-shape morph: sample two `d` strings at `samples` uniform
 * arc-length steps each, pair the point sets, and interpolate the `(x, y)`
 * pairs from the `from`-polyline (`0%`) to the `to`-polyline (`100%`). Returns
 * the constructed {@link CSSKeyframesAnimation} as the control handle (the
 * `animate()` contract — `.play()` / `.pause()` / `.stop()` / `.finished`),
 * consistent with the `from*` factory family.
 *
 * value.js's `PathGeometry` owns the geometry (the `d`-parse + arc-length
 * table, built ONCE per path at construction); the engine's native numeric
 * `lerp` traverses the per-point coordinate keys. The morphed `d` at any `t` is
 * reassembled from the interpolated points — read it via the `MorphSVG` class's
 * {@link MorphSVG.sampleD}.
 *
 * Refuses a degenerate input: a zero-length `from` or `to` path throws a typed
 * {@link AnimationOptionError} rather than faking a silent zero-frame / identity
 * morph (the honest-or-refuse law — a morph between a zero-length path and
 * anything is a malformed input, not a morph).
 *
 * @param from   the source SVG path `d` string.
 * @param to     the target SVG path `d` string (differing geometry).
 * @param options `{ samples?, target?, autoPlay?, ...animationOptions }`.
 *
 * @example
 * // Morph a triangle into a square over 1s:
 * const m = fromMorphSVG(
 *   "M 0 0 L 100 0 L 50 100 Z",
 *   "M 0 0 L 100 0 L 100 100 L 0 100 Z",
 *   { duration: 1000 },
 * );
 */
export function fromMorphSVG<V extends Record<string, any> = any>(
    from: string,
    to: string,
    options: MorphSVGOptions = {},
): CSSKeyframesAnimation<V> {
    const {
        samples = DEFAULT_SAMPLES,
        target,
        autoPlay = true,
        ...animOptions
    } = options;

    if (typeof from !== "string" || from.length === 0) {
        throw new AnimationOptionError(
            "from",
            from,
            "fromMorphSVG(): `from` must be a non-empty SVG path `d` string.",
        );
    }
    if (typeof to !== "string" || to.length === 0) {
        throw new AnimationOptionError(
            "to",
            to,
            "fromMorphSVG(): `to` must be a non-empty SVG path `d` string.",
        );
    }
    if (!Number.isInteger(samples) || samples < 2) {
        throw new AnimationOptionError(
            "samples",
            samples,
            "fromMorphSVG(): `samples` must be an integer >= 2 (a 1-sample " +
                "morph is just the two endpoints, with no body to interpolate).",
        );
    }

    // value.js owns the geometry — parse each `d` ONCE; the arc-length table is
    // built at construction, so the per-step sampling below is a binary-search
    // + lerp, never a re-parse. These two allocations are the ONLY per-call
    // geometry cost (the motion-path/draw-svg "browser owns the geometry"
    // pattern, with PathGeometry standing in for the browser's DOM sampler).
    const fromGeo = new PathGeometry(from);
    const toGeo = new PathGeometry(to);

    // Refuse, don't fake: a zero-length path is a malformed input, not a morph.
    if (fromGeo.totalLength === 0) {
        throw new AnimationOptionError(
            "from",
            from,
            "fromMorphSVG(): the `from` path has zero arc-length — a morph " +
                "between a zero-length path and anything is malformed input, " +
                "not an identity animation.",
        );
    }
    if (toGeo.totalLength === 0) {
        throw new AnimationOptionError(
            "to",
            to,
            "fromMorphSVG(): the `to` path has zero arc-length — a morph " +
                "between a zero-length path and anything is malformed input, " +
                "not an identity animation.",
        );
    }

    // Sample BOTH paths at the SAME `samples` count → MATCHED point counts
    // between the 0% and 100% frames (the engine-compatibility floor: a
    // polyline channel is interpolable only when both endpoint frames carry the
    // same point keys). The morph is the engine lerping these coordinates.
    const fromPts = samplePolyline(fromGeo, samples);
    const toPts = samplePolyline(toGeo, samples);

    const startFrame: Record<string, number> = {};
    const endFrame: Record<string, number> = {};
    for (let i = 0; i <= samples; i++) {
        startFrame[xKey(i)] = fromPts[i]!.x;
        startFrame[yKey(i)] = fromPts[i]!.y;
        endFrame[xKey(i)] = toPts[i]!.x;
        endFrame[yKey(i)] = toPts[i]!.y;
    }

    const keyframes = {
        "0%": startFrame,
        "100%": endFrame,
    } as unknown as Record<string, Partial<V>>;

    const animation = new CSSKeyframesAnimation<V>(animOptions).fromKeyframes(
        keyframes,
    );

    if (target != null) {
        animation.setTargets(target as unknown as HTMLElement);
    }

    if (autoPlay) {
        // Fire the play loop; the handle carries the play promise via its own
        // re-entrant `play()`. We do NOT await — the handle IS the control
        // surface (the `animate()` contract).
        void animation.play();
    }

    return animation;
}

/**
 * `MorphSVG` — the class form of {@link fromMorphSVG}, for callers who prefer a
 * named primitive alongside `CSSKeyframesAnimation` / `MotionPath` / `DrawSVG`.
 * Construction is the factory: `new MorphSVG(from, to).animation` is the control
 * handle. The factory is the canonical entry; this is a thin ergonomic wrapper
 * that ALSO exposes {@link sampleD} — the morphed `d` string at a normalized
 * `t`, reassembled from the interpolated point coordinates.
 */
export class MorphSVG<V extends Record<string, any> = any> {
    /** The underlying coordinate-interpolating animation — the control handle. */
    readonly animation: CSSKeyframesAnimation<V>;

    /** The uniform-sample count (point pairs = samples + 1). */
    readonly samples: number;

    constructor(from: string, to: string, options: MorphSVGOptions = {}) {
        this.animation = fromMorphSVG<V>(from, to, options);
        this.samples = options.samples ?? DEFAULT_SAMPLES;
    }

    /**
     * The morphed SVG path `d` string at a normalized `t` in `[0, 1]`, built
     * from the engine's interpolated point coordinates (`0` → the `from`
     * polyline, `1` → the `to` polyline, `0.5` → the point-wise midpoint). The
     * value a consumer renders (`<path d>` / a `d:` custom property), distinct
     * from BOTH endpoint polylines at any interior `t`.
     */
    sampleD(t: number): string {
        const clamped = t < 0 ? 0 : t > 1 ? 1 : t;
        const ms = clamped * this.animation.options.duration;
        const out = this.animation.interpFrames(ms, false);
        const pts: MorphPoint[] = new Array(this.samples + 1);
        for (let i = 0; i <= this.samples; i++) {
            const x = out[xKey(i)]?.[0]?.value;
            const y = out[yKey(i)]?.[0]?.value;
            pts[i] = { x: x ?? 0, y: y ?? 0 };
        }
        return pointsToD(pts);
    }

    /** Start (or re-enter) the morph play loop. */
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

    /** Resolve once the morph completes — the {@link Animation.finished} front-door. */
    get finished(): Promise<void> {
        return this.animation.finished;
    }
}
