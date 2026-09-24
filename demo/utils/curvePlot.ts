/**
 * X.KF.W13W.b (OA-56, COHESION §0co) — THE ONE CURVE-TO-POINT PRIMITIVE.
 *
 * The owner's law (KF-W13.md, "the tracking ball rides the curve"): on every
 * plot of an easing or a simulation the playhead ball is a point ON the plotted
 * curve, at (x(p), y(p)) in the plot's own coordinates, and one mapping places
 * both the stroke and the ball — no second geometry, no rail, no mid-height
 * track.
 *
 * So a plot is built here, once, from its function and its frame, and the same
 * object answers both questions: `d` is the stroke, `point(p)` / `place(p)` is
 * where the ball is. Nothing else in the demo maps a curve value to a ball.
 *
 *  - The stroke is a polyline through `(t, fn(t))` over a uniform grid plus the
 *    caller's knots (the vertices of a piecewise-linear function, so a
 *    `linear()` trace is drawn exactly). A jump (steps) is located by bisection
 *    inside its interval and drawn as a vertical riser, so the stroke is the
 *    staircase the ball actually jumps along.
 *  - `point(p)` evaluates the SAME polyline at `x = p`: the ball sits on the
 *    drawn segment, never on the analytic value a chord cuts under. On the
 *    riser's column it takes the right-hand value — the step has fired.
 *  - Overshoot is never clamped: back / elastic / spring values outside [0, 1]
 *    map outside the band, and the plot's own bounds carry the curve (and so
 *    the ball) there.
 *  - `place(p)` is the ball's CSS transform for the one placement idiom
 *    (`.curve-carriage` in `design-idioms.css`): a carriage spanning the
 *    stroke's own `<svg>` box, translated by the point's fraction of that box —
 *    `translate()` percentages resolve against the carriage, which IS the
 *    plot box, and a `preserveAspectRatio="none"` viewBox maps linearly onto
 *    that same box. No width is read, ever.
 */

/** A timing function or a simulation trace: normalized time → value. */
export type CurveFn = (t: number) => number;

/** A plot's user space: its `viewBox`, and how (t, v) land in it. */
export interface PlotFrame {
    /** The `<svg>` viewBox the stroke is drawn in, `[minX, minY, width, height]`. */
    readonly viewBox: readonly [number, number, number, number];
    /** Normalized time → user-space x. */
    readonly x: (t: number) => number;
    /** Value → user-space y (value 0 and 1 wherever the plot puts them). */
    readonly y: (v: number) => number;
}

export interface CurvePlotOptions {
    /** Uniform grid intervals over [0, 1] (default 64). */
    readonly samples?: number;
    /** Extra abscissae the stroke must pass through (a polyline's vertices). */
    readonly knots?: readonly number[];
}

export interface CurvePoint {
    readonly x: number;
    readonly y: number;
}

export interface CurvePlot {
    readonly frame: PlotFrame;
    /** The `viewBox` attribute string. */
    readonly viewBox: string;
    /** The stroke — an SVG path over the frame's user space. */
    readonly d: string;
    /** The stroke's vertices in (t, v) space, riser pairs included. */
    readonly vertices: readonly { readonly t: number; readonly v: number }[];
    /** The value the stroke draws at normalized time `p` (clamped to [0, 1]). */
    value(p: number): number;
    /** The stroke's point at normalized time `p`, in user space. */
    point(p: number): CurvePoint;
    /** The point as a fraction of the plot box (0..1 inside, beyond on overshoot). */
    fraction(p: number): CurvePoint;
    /** The ball carriage's CSS transform at `p` (see `.curve-carriage`). */
    place(p: number): string;
}

/** A jump below this (in value units) is a continuous slope, not a riser. */
const JUMP_EPSILON = 1e-6;
/** Bisection depth: the interval shrinks to 2^-48 of the grid step. */
const BISECT_DEPTH = 48;

const clamp01 = (p: number): number => (p < 0 ? 0 : p > 1 ? 1 : p);

/**
 * The stroke's vertices: the grid ∪ knots, each interval bisected once to find
 * a jump. A continuous interval converges to a zero difference; a jump keeps
 * its height and becomes a riser pair `(c⁻, v⁻) (c⁺, v⁺)`.
 */
const strokeVertices = (
    fn: CurveFn,
    samples: number,
    knots: readonly number[],
): { t: number; v: number }[] => {
    const grid = new Set<number>();
    for (let i = 0; i <= samples; i++) grid.add(i / samples);
    for (const k of knots) if (k >= 0 && k <= 1) grid.add(k);
    const ts = [...grid].sort((a, b) => a - b);

    const out: { t: number; v: number }[] = [{ t: ts[0]!, v: fn(ts[0]!) }];
    for (let i = 1; i < ts.length; i++) {
        let lo = ts[i - 1]!;
        let hi = ts[i]!;
        let vlo = fn(lo);
        let vhi = fn(hi);
        const a = lo;
        const b = hi;
        const vb = vhi;
        for (let k = 0; k < BISECT_DEPTH; k++) {
            const mid = (lo + hi) / 2;
            const vm = fn(mid);
            if (Math.abs(vm - vlo) >= Math.abs(vhi - vm)) {
                hi = mid;
                vhi = vm;
            } else {
                lo = mid;
                vlo = vm;
            }
        }
        if (Math.abs(vhi - vlo) > JUMP_EPSILON) {
            // A riser inside (a, b]: flat-or-sloped run to it, then the jump.
            if (lo > a) out.push({ t: lo, v: vlo });
            out.push({ t: hi, v: vhi });
            if (hi < b) out.push({ t: b, v: vb });
        } else {
            out.push({ t: b, v: vb });
        }
    }
    return out;
};

/** Build a plot: the stroke and the ball's placement from ONE function. */
export function curvePlot(
    fn: CurveFn,
    frame: PlotFrame,
    options: CurvePlotOptions = {},
): CurvePlot {
    const vertices = strokeVertices(fn, options.samples ?? 64, options.knots ?? []);
    const [minX, minY, width, height] = frame.viewBox;

    const d = vertices
        .map(
            ({ t, v }, i) =>
                `${i === 0 ? "M" : "L"} ${+frame.x(t).toFixed(4)} ${+frame.y(v).toFixed(4)}`,
        )
        .join(" ");

    /** The polyline's value at `p`: the last segment whose start is ≤ p. */
    const value = (p: number): number => {
        const t = clamp01(p);
        let lo = 0;
        let hi = vertices.length - 1;
        // The rightmost vertex with vt ≤ t (a riser's upper vertex wins its column).
        while (lo < hi) {
            const mid = (lo + hi + 1) >> 1;
            if (vertices[mid]!.t <= t) lo = mid;
            else hi = mid - 1;
        }
        const a = vertices[lo]!;
        const b = vertices[lo + 1];
        if (!b || b.t === a.t) return a.v;
        return a.v + ((b.v - a.v) * (t - a.t)) / (b.t - a.t);
    };

    const point = (p: number): CurvePoint => ({
        x: frame.x(clamp01(p)),
        y: frame.y(value(p)),
    });

    const fraction = (p: number): CurvePoint => {
        const { x, y } = point(p);
        return { x: (x - minX) / width, y: (y - minY) / height };
    };

    const place = (p: number): string => {
        const f = fraction(p);
        return `translate(${+(f.x * 100).toFixed(3)}%, ${+(f.y * 100).toFixed(3)}%)`;
    };

    return {
        frame,
        viewBox: `${minX} ${minY} ${width} ${height}`,
        d,
        vertices,
        value,
        point,
        fraction,
        place,
    };
}

/** The unit frame every easing sparkline uses: t → x, value 1 at the top. */
export const unitEasingFrame = (
    viewBox: readonly [number, number, number, number] = [0, 0, 1, 1],
): PlotFrame => ({ viewBox, x: (t) => t, y: (v) => 1 - v });

/**
 * The plot's walk as CSS `@keyframes` for the carriage: one keyframe per stroke
 * vertex, at its own time offset. Played under a LINEAR timing function the
 * carriage interpolates straight between consecutive vertices — which is the
 * drawn segment — so an engine-played ball stays on the stroke by construction.
 */
export const curveKeyframes = (plot: CurvePlot, name: string): string => {
    const [minX, minY, width, height] = plot.frame.viewBox;
    // A riser's two vertices round to one offset; the later keyframe wins it.
    const frames = plot.vertices.map(({ t, v }) => {
        const x = ((plot.frame.x(t) - minX) / width) * 100;
        const y = ((plot.frame.y(v) - minY) / height) * 100;
        return `    ${+(t * 100).toFixed(4)}% { transform: translate(${+x.toFixed(3)}%, ${+y.toFixed(3)}%); }`;
    });
    return `@keyframes ${name} {\n${frames.join("\n")}\n}`;
};

/** A piecewise-linear function through `(t, v)` points (a resolved `linear()`). */
export const polylineFn =
    (points: readonly { readonly t: number; readonly v: number }[]): CurveFn =>
    (p) => {
        const t = clamp01(p);
        let i = 1;
        while (i < points.length - 1 && points[i]!.t < t) i++;
        const a = points[i - 1]!;
        const b = points[i]!;
        return b.t === a.t ? b.v : a.v + ((b.v - a.v) * (t - a.t)) / (b.t - a.t);
    };
