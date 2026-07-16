/**
 * svg/morph-geometry.ts — the GEOMETRY-SAMPLING + per-frame RENDER machinery of
 * the SVG morph (T.F22 — the per-zone cohesion carve off `morph-svg.ts`).
 *
 * `morph-svg.ts` owns the PUBLIC surface — the `fromMorphSVG` factory + the
 * `MorphSVG` control-handle class. THIS file owns the mechanism BENEATH it: the
 * per-point coordinate-key naming (`xKey`/`yKey`/`angleKey`), the value.js
 * `PathGeometry` → uniform-`t` polyline sampler (`samplePolyline`), the polyline
 * → SVG-`d` reassembly (`pointsToD`/`fmtNum`), the structural DOM-write surfaces
 * (`ElementWithStyle`/`ElementWithAttribute`), and the zero-alloc per-frame
 * render closure (`makeMorphRenderer`).
 *
 * Pure extraction — zero behaviour change; `morph-svg.ts` composes these back
 * and re-exports the public `MorphPoint` type. HEAVY (it consumes value.js's
 * `PathGeometry`, the ONE geometry edge the morph legitimately needs) — reached
 * only via `loadAnimationEngine()`.
 */
import { PathGeometry } from "@mkbabb/value.js/transform";
import type { TransformFunction, Vars } from "../constants";

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

export const DEFAULT_SAMPLES = 64;

/** The per-point coordinate key prefix (a CSS custom property, kebab-safe). */
export const xKey = (i: number): string => `--morph-${i}-x`;
export const yKey = (i: number): string => `--morph-${i}-y`;
/** The per-point tangent-angle key (radians) — emitted ONLY when `orient`. */
export const angleKey = (i: number): string => `--morph-${i}-angle`;

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
export const samplePolyline = (
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
export const fmtNum = (n: number): string =>
    Number.isInteger(n) ? `${n}` : n.toFixed(3);

/** Assemble a polyline point array into an SVG `d` string (`M … L … L …`). */
export const pointsToD = (pts: MorphPoint[]): string => {
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
export interface ElementWithStyle {
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
export interface ElementWithAttribute {
    setAttribute(qualifiedName: string, value: string): void;
}

/**
 * Build the per-frame RENDER contract (S1) — the custom `transform` a
 * target-bearing {@link fromMorphSVG} supplies to `fromKeyframes`. Each frame
 * the engine invokes this with the interpolated `vars` — under the T.A6
 * authored-values contract each `--morph-{i}-x/y` key is a bare interpolated
 * `number` (the "animate any object" seam and {@link MorphSVG.sampleD} both
 * consume the flat authored-value sink); it reassembles the
 * points into a `d` string and writes it onto `target.style` as BOTH the `d:`
 * CSS property and the `--morph-d` custom property.
 *
 * ZERO-ALLOC on the steady frame: the scratch point-array is hoisted into THIS
 * closure once (`scratch`, length `samples + 1`), and each frame mutates its
 * slots in place — NO `new Array` per render (contrast `MorphSVG.sampleD`'s
 * per-call allocation, fine for a one-off manual pull, NOT a 60Hz render).
 */
export const makeMorphRenderer = <V extends Vars>(
    target: ElementWithStyle,
    samples: number,
): TransformFunction<V> => {
    // The ONE hoisted scratch buffer — reused every frame (zero-alloc steady).
    const scratch: MorphPoint[] = new Array(samples + 1);
    for (let i = 0; i <= samples; i++) scratch[i] = { x: 0, y: 0 };

    return (vars: V) => {
        const v = vars as unknown as Record<string, number | undefined>;
        for (let i = 0; i <= samples; i++) {
            const pt = scratch[i]!;
            // R.W3 §2D (FAIL-EXPLICIT): the morph renderer seeds EVERY point
            // key at construction time (xKey(i)/yKey(i) for every i in [0,samples]),
            // so a missing key here is an engine-invariant violation, NOT an
            // expected-absent case. Mask-to-0 would corrupt the path silently —
            // throw instead (the honest-or-refuse law from the factory below).
            // T.A6: the authored sink projects each coordinate as a bare number.
            const lx = v[xKey(i)];
            const ly = v[yKey(i)];
            if (typeof lx !== "number" || typeof ly !== "number") {
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
