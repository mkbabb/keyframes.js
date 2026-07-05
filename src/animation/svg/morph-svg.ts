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
import { CSSKeyframesAnimation } from "../engine";
import { SVGAnimationHandle } from "./handle";
import type {
    InputAnimationOptions,
    TransformFunction,
    Vars,
} from "../constants";
import { AnimationOptionError } from "../internal/errors";

/** A sampled point on a path polyline. */
export interface MorphPoint {
    x: number;
    y: number;
    /**
     * The tangent angle (radians) of the source path at this point — populated
     * ONLY when the morph is built with `orient: true` (the
     * `PathGeometry.sampleAtLength` tangent, the `rotate: auto` value). Absent
     * (`undefined`) on a position-only morph (the default ~130-key floor).
     */
    angle?: number;
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
     * Optional target the morph drives. When given, the morph reassembles the
     * interpolated polyline into a `d` string EACH FRAME and writes it onto the
     * target's style as BOTH:
     *   • the `d:` CSS property — `target.style.d = path("M … L …")` — which
     *     Chromium and recent Safari render DIRECTLY on a `<path>`/`<svg>`
     *     (no author wiring needed), and
     *   • the `--morph-d` custom property — `var(--morph-d)` — the cross-browser
     *     author channel + the Firefox-lags fallback (`<path style="d:
     *     var(--morph-d)">`, or a JS reader via {@link MorphSVG.sampleD}).
     *
     * The render rides the engine's per-frame renderer seam (a custom
     * `transform` supplied to `fromKeyframes`), NOT the default DOM-style
     * renderer — so the morph is WAAPI-ineligible by construction and always
     * runs the rAF path where the renderer fires. The reassembly reuses an
     * instance-level scratch point-array, so the steady frame mints nothing.
     *
     * Default target-less: the returned handle IS the control surface, exactly
     * like `fromDrawSVG`'s target-less form — {@link MorphSVG.sampleD}(t) reads
     * the morphed `d` directly without a DOM write.
     */
    target?: HTMLElement | SVGElement;

    /**
     * Orient-along-path: when `true`, the morph ALSO samples each point's
     * tangent angle (radians) from `PathGeometry.sampleAtLength` and emits a
     * per-point `--morph-{i}-angle` channel that interpolates the `from`→`to`
     * tangent across `t` — the `rotate: auto` value a consumer reads to bank a
     * glyph along the morphed outline. Default `false` (a position-only morph
     * stays at the ~130-key floor; orient adds ~65 angle keys ONLY when asked,
     * pre-empting a "morph is too heavy" perf concern).
     */
    orient?: boolean;

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
/** The per-point tangent-angle key (radians) — emitted ONLY when `orient`. */
const angleKey = (i: number): string => `--morph-${i}-angle`;

/**
 * Sample a {@link PathGeometry} at `n + 1` uniform `t` in `[0, 1]`, returning
 * the `(x, y)` point array (length `n + 1`). The arc-length table was built at
 * construction, so each `getPointAtT` is a binary-search + lerp — no re-parse.
 *
 * When `orient` is true, each point ALSO carries the path's tangent `angle`
 * (radians) at that step. The arc-length conversion is the correctness pivot:
 * the position is sampled by NORMALIZED `t` via `getPointAtT(i/n)`, but
 * `sampleAtLength` takes an arc-LENGTH — so the tangent at the SAME point is
 * `sampleAtLength(totalLength * (i/n)).angle`, NOT `sampleAtLength(i/n)` (which
 * would read the tangent a fraction of a pixel along the path — a degenerate
 * near-origin angle).
 */
const samplePolyline = (
    geo: PathGeometry,
    n: number,
    orient: boolean,
): MorphPoint[] => {
    const pts: MorphPoint[] = new Array(n + 1);
    for (let i = 0; i <= n; i++) {
        if (orient) {
            const s = geo.sampleAtLength(geo.totalLength * (i / n));
            pts[i] = { x: s.x, y: s.y, angle: s.angle };
        } else {
            pts[i] = geo.getPointAtT(i / n);
        }
    }
    return pts;
};

/** Format ONE number for a `d` string — integers bare, fractions to 3 places. */
const fmtNum = (n: number): string =>
    Number.isInteger(n) ? `${n}` : n.toFixed(3);

/** Assemble a polyline point array into an SVG `d` string (`M … L … L …`). */
const pointsToD = (pts: MorphPoint[]): string => {
    if (pts.length === 0) return "";
    let d = `M ${fmtNum(pts[0]!.x)} ${fmtNum(pts[0]!.y)}`;
    for (let i = 1; i < pts.length; i++) {
        d += ` L ${fmtNum(pts[i]!.x)} ${fmtNum(pts[i]!.y)}`;
    }
    return d;
};

/**
 * The minimal style-write surface the morph renderer needs — `style.setProperty`
 * (the `--morph-d` custom property + the `d:` property). Both `HTMLElement` and
 * `SVGElement` satisfy it; typed structurally so the renderer composes off-DOM
 * (the same DOM-free posture as the rest of the geometry path) over any
 * `{ style: { setProperty } }` target without a `document` cast.
 */
interface ElementWithStyle {
    style: { setProperty(property: string, value: string): void };
}

/**
 * The minimal ATTRIBUTE-write surface the build-time at-rest seed needs —
 * `setAttribute` (the SVG `d` presentation attribute). Both `HTMLElement` and
 * `SVGElement` satisfy it structurally; typed here so the at-rest seed composes
 * off-DOM (jsdom/browser/node) over any `{ setAttribute }` target without a
 * `document` cast — the same DOM-free posture as {@link ElementWithStyle}.
 *
 * T.A14 (ATTRIBUTE-FIRST) — the `from` shape rides the SVG `d` ATTRIBUTE, seeded
 * ONCE at build time, so the subject paints at rest with NO live engine write.
 * The per-frame CSS `d:` channel (via {@link makeMorphRenderer}) legitimately
 * OVERRIDES the attribute only while a frame is in flight; the moment no frame
 * is written (autoPlay:false, pre-play, post-settle) the attribute paints. The
 * at-rest state must never depend on a live engine write (the shot-17 failure
 * class: a missed/failed write → the protagonist renders as nothing).
 */
interface ElementWithAttribute {
    setAttribute(qualifiedName: string, value: string): void;
}

/**
 * Build the per-frame RENDER contract (S1) — the custom `transform` a
 * target-bearing {@link fromMorphSVG} supplies to `fromKeyframes`. Each frame
 * the engine invokes this with the interpolated `vars` (the `--morph-{i}-x/y`
 * keys, each `vars[key][0].value` the lerped number — the SAME shape
 * {@link MorphSVG.sampleD} reads); it reassembles the points into a `d` string
 * and writes it onto `target.style` as BOTH the `d:` CSS property and the
 * `--morph-d` custom property.
 *
 * ZERO-ALLOC on the steady frame: the scratch point-array is hoisted into THIS
 * closure once (`scratch`, length `samples + 1`), and each frame mutates its
 * slots in place — NO `new Array` per render (contrast `MorphSVG.sampleD`'s
 * per-call allocation, fine for a one-off manual pull, NOT a 60Hz render).
 */
const makeMorphRenderer = <V extends Vars>(
    target: ElementWithStyle,
    samples: number,
): TransformFunction<V> => {
    // The ONE hoisted scratch buffer — reused every frame (zero-alloc steady).
    const scratch: MorphPoint[] = new Array(samples + 1);
    for (let i = 0; i <= samples; i++) scratch[i] = { x: 0, y: 0 };

    return (vars: V) => {
        const v = vars as unknown as Record<
            string,
            ReadonlyArray<{ value?: number }> | undefined
        >;
        for (let i = 0; i <= samples; i++) {
            const pt = scratch[i]!;
            // R.W3 §2D (FAIL-EXPLICIT): the morph renderer seeds EVERY point
            // key at construction time (xKey(i)/yKey(i) for every i in [0,samples]),
            // so a missing key here is an engine-invariant violation, NOT an
            // expected-absent case. Mask-to-0 would corrupt the path silently —
            // throw instead (the honest-or-refuse law from the factory below).
            const lx = v[xKey(i)]?.[0]?.value;
            const ly = v[yKey(i)]?.[0]?.value;
            if (lx === undefined || ly === undefined) {
                throw new Error(
                    `morph render: point ${i} lost its coordinate leaf ` +
                        `(engine invariant violated — xKey/yKey seeded at construction)`,
                );
            }
            pt.x = lx;
            pt.y = ly;
        }
        const d = pointsToD(scratch);
        // The cross-browser author channel (var(--morph-d) + the JS reader) AND
        // the directly-rendered `d:` property (Chromium/Safari). Both writes are
        // honest: `d` paints natively where supported; `--morph-d` is the
        // documented Firefox-lags fallback.
        target.style.setProperty("--morph-d", d);
        target.style.setProperty("d", `path("${d}")`);
    };
};

/**
 * Build an SVG path-shape morph: sample two `d` strings at `samples` uniform
 * arc-length steps each, pair the point sets, and interpolate the `(x, y)`
 * pairs from the `from`-polyline (`0%`) to the `to`-polyline (`100%`). Returns
 * the constructed {@link CSSKeyframesAnimation} as the control handle (the
 * control-handle contract — `.play()` / `.pause()` / `.stop()` / `.finished`),
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
 * @param options `{ samples?, target?, orient?, autoPlay?, ...animationOptions }`.
 *
 * @example
 * // Morph a triangle into a square over 1s, RENDERING onto a live <path>:
 * const path = document.querySelector("path");
 * const m = fromMorphSVG(
 *   "M 0 0 L 100 0 L 50 100 Z",
 *   "M 0 0 L 100 0 L 100 100 L 0 100 Z",
 *   { duration: 1000, target: path },
 * );
 * // each frame the engine writes path.style.d = path("…") + --morph-d so the
 * // morphing shape paints directly (no author-side reader needed on Chromium/
 * // Safari; `<path style="d: var(--morph-d)">` is the Firefox-lags fallback).
 */
export function fromMorphSVG<V extends Vars = Vars>(
    from: string,
    to: string,
    options: MorphSVGOptions = {},
): CSSKeyframesAnimation<V> {
    const {
        samples = DEFAULT_SAMPLES,
        target,
        orient = false,
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
    const fromPts = samplePolyline(fromGeo, samples, orient);
    const toPts = samplePolyline(toGeo, samples, orient);

    const startFrame: Record<string, number> = {};
    const endFrame: Record<string, number> = {};
    for (let i = 0; i <= samples; i++) {
        startFrame[xKey(i)] = fromPts[i]!.x;
        startFrame[yKey(i)] = fromPts[i]!.y;
        endFrame[xKey(i)] = toPts[i]!.x;
        endFrame[yKey(i)] = toPts[i]!.y;
        // S2 orient — emit a per-point tangent-angle channel ONLY when asked,
        // so the engine's numeric lerp banks the `from`→`to` tangent across `t`
        // (the `rotate: auto` value). Off by default (the ~130-key floor).
        if (orient) {
            // KEEP: angle ?? 0 — construction-time default for a flat segment;
            // 0-radian is the correct identity (no rotation), NOT a per-frame
            // coordinate mask (the hot-path render throws on missing keys — §2D).
            startFrame[angleKey(i)] = fromPts[i]!.angle ?? 0; // KEEP: flat-segment identity
            endFrame[angleKey(i)] = toPts[i]!.angle ?? 0; // KEEP: flat-segment identity
        }
    }

    const keyframes = {
        "0%": startFrame,
        "100%": endFrame,
    } as unknown as Record<string, Partial<V>>;

    // S1 render contract — a target-bearing morph builds with a CUSTOM per-frame
    // renderer (passed to `fromKeyframes`), NOT the default DOM-style renderer
    // (the bare `setTargets`, which would only write the ~130 invisible numeric
    // `--morph-{i}-x/y` props and NEVER a renderable `d`). The renderer
    // reassembles the interpolated points into a `d` string each frame and
    // writes it onto the target's style as BOTH the `d:` CSS property (Chromium/
    // Safari render `path()` in `d` directly) AND the `--morph-d` custom
    // property (the cross-browser author channel + Firefox-lags fallback).
    //
    // Supplying a custom `transform` flips `usesDefaultRenderer` false, so the
    // morph is WAAPI-ineligible by construction and always runs the rAF path
    // where the renderer fires — the desired behavior (custom props are not the
    // default DOM renderer's WAAPI-animatable set anyway). The reassembly
    // reuses ONE hoisted scratch point-array (`renderScratch`) so the steady
    // frame mints nothing (contrast `MorphSVG.sampleD`'s per-call `new Array`).
    const renderTransform =
        target != null
            ? makeMorphRenderer<V>(
                  target as unknown as ElementWithStyle,
                  samples,
              )
            : undefined;

    // T.A14 (ATTRIBUTE-FIRST) — seed the `from` shape onto the target's SVG `d`
    // ATTRIBUTE at BUILD time, BEFORE any play/frame write. So at rest (no frame
    // in flight — pre-play under autoPlay:false, or post-settle) the subject
    // paints from the attribute alone; the per-frame CSS `d:` channel only
    // overrides it while animating. The at-rest state never depends on a live
    // engine write (the shot-17 invisible-at-rest failure class is impossible by
    // construction). We write the RAW `from` `d` here (the attribute's native
    // form), not the reassembled polyline, so a NON-morphing at-rest subject
    // shows its authored geometry faithfully.
    const attrTarget = target as unknown as Partial<ElementWithAttribute>;
    if (target != null && typeof attrTarget.setAttribute === "function") {
        attrTarget.setAttribute("d", from);
    }

    const animation = new CSSKeyframesAnimation<V>(animOptions).fromKeyframes(
        keyframes,
        renderTransform,
    );

    if (autoPlay) {
        // Fire the play loop; the handle carries the play promise via its own
        // re-entrant `play()`. We do NOT await — the handle IS the control
        // surface (the control-handle contract).
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
export class MorphSVG<
    V extends Vars = Vars,
> extends SVGAnimationHandle<V> {
    // S.B4 (a20 F1+F2) — the `animation` control handle + play/pause/stop/finished
    // delegation live on `SVGAnimationHandle`; MorphSVG adds only its `sampleD`
    // sampling surface (+ the `samples` count) on top of the shared handle.

    /** The uniform-sample count (point pairs = samples + 1). */
    readonly samples: number;

    constructor(from: string, to: string, options: MorphSVGOptions = {}) {
        super(fromMorphSVG<V>(from, to, options));
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
            // KEEP: x ?? 0 / y ?? 0 — manual pull via interpFrames (not the
            // hot-path renderer); 0 is the geometric identity (origin) before
            // the first play tick, NOT a per-frame coordinate mask (§2D).
            pts[i] = { x: x ?? 0, y: y ?? 0 }; // KEEP: pre-tick geometric identity
        }
        return pointsToD(pts);
    }
}
