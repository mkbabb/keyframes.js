/**
 * The orbit's bounds, its rubber band and its spring back (owner 2026-11-11:
 * "you should not be able to pan off screen so far ... if you throw the cube
 * out of bounds, it springs back smoothly"). Pure, Vue-free.
 *
 * Pan: the die rests wholly inside the stage (PAN_OUT = 0 of its extent may
 * leave it), D being the extent of its painted silhouette in every attitude:
 * the face's side · s · 2 (the cube's circumscribed diameter, √3, widened by the
 * scene's perspective at its near corner; the embed probe measured the faces'
 * union at up to 2.01 · side · s), so no corner of a turned die is cut by the
 * screen; and the allowed centre on an axis is
 * [min + (0.5 − PAN_OUT)·D, max − (0.5 − PAN_OUT)·D]. A die zoomed larger than
 * the stage swaps those ends, so it may move while it still covers the stage,
 * continuously from the size at which it just fits. (Owner 2026-11-11, after a
 * quarter of the die rested past the edge: "you should not be able to pan off
 * screen so far".) Zoom: ln s inside the scale range.
 *
 * While the hand (or a live wheel stream) holds the die past a bound it
 * follows with resistance, the overshoot shown as d·(1 − 1/(o·BAND/d + 1)) of
 * the raw overshoot o, d the band's reach. Once let go, the overshoot returns
 * by the critically damped spring at the coast's own friction k:
 * x(t) = (x₀ + (v₀ + k·x₀)·t)·e^(−k·t), sampled at elapsed time, so the path is
 * the same at 30, 60 and 120 Hz. A coast that crosses a bound becomes that
 * spring at the crossing, with the coast's velocity there.
 */

/** The share of the die's projected extent that may leave the stage on a side. */
export const PAN_OUT = 0;
/** The die's painted silhouette per unit of its face's side, in any attitude: √3 under the scene's perspective. */
export const SILHOUETTE = 2;
/** The rubber band's resistance at the bound (the shown overshoot's slope). */
export const BAND = 0.55;
/** The zoom band's reach past either end of the scale range (ln s). */
export const ZOOM_BAND_LN = 0.15;
/** A spring is home once its overshoot and speed are under these (px, px/s). */
export const SPRING_REST = 0.05;
export const SPRING_REST_SPEED = 1;

export interface Interval {
    lo: number;
    hi: number;
}

/** No bound at all (a missing stage). */
export const UNBOUNDED: Interval = { lo: -Infinity, hi: Infinity };

/** The centre's allowed interval on one axis of a stage [min, max], for a die of extent D. */
export const panInterval = (min: number, max: number, D: number): Interval => {
    const inset = (0.5 - PAN_OUT) * D;
    const lo = min + inset;
    const hi = max - inset;
    return lo <= hi ? { lo, hi } : { lo: hi, hi: lo };
};

/** The shown overshoot for a raw overshoot `o` ≥ 0 under a band of reach `d`. */
export const band = (o: number, d: number): number =>
    o <= 0 || !(d > 0) ? 0 : d * (1 - 1 / ((o * BAND) / d + 1));

/** The raw overshoot that shows as `r` (band's inverse). */
export const unband = (r: number, d: number): number => {
    if (r <= 0 || !(d > 0)) return 0;
    if (r >= d) return Number.MAX_VALUE;
    return (d / BAND) * (r / (d - r));
};

/** The signed overshoot of `x` past `iv` (0 inside). */
export const excess = (x: number, iv: Interval): number => (x > iv.hi ? x - iv.hi : x < iv.lo ? x - iv.lo : 0);

export const clampTo = (x: number, iv: Interval): number => Math.min(iv.hi, Math.max(iv.lo, x));

/** The shown position of a raw `x` against `iv`, banded with reach `d`. */
export const banded = (x: number, iv: Interval, d: number): number => {
    const e = excess(x, iv);
    if (e === 0) return x;
    return e > 0 ? iv.hi + band(e, d) : iv.lo - band(-e, d);
};

/** The raw position that shows as `y` (banded's inverse). */
export const unbanded = (y: number, iv: Interval, d: number): number => {
    const e = excess(y, iv);
    if (e === 0) return y;
    return e > 0 ? iv.hi + unband(e, d) : iv.lo - unband(-e, d);
};

/** The critically damped return at elapsed `t` (s): overshoot and its rate. */
export const springBack = (x0: number, v0: number, k: number, t: number): { x: number; v: number } => {
    const e = Math.exp(-k * t);
    const b = v0 + k * x0;
    return { x: (x0 + b * t) * e, v: (b - k * (x0 + b * t)) * e };
};

/**
 * One axis of a let-go motion, sampled at elapsed time against a live
 * interval: a coast (x₀ + v₀/k·(1 − e^(−kτ))) that becomes the spring the
 * moment it crosses the interval, or a spring from the start (let go past a
 * bound). The interval is read at every sample (a zoom moves the pan's).
 */
export type AxisMotion =
    | { kind: "coast"; x0: number; v0: number; t0: number }
    | { kind: "spring"; side: 1 | -1; e0: number; v0: number; t0: number };

export interface AxisSample {
    x: number;
    v: number;
    /** The motion that continues (a coast may have become a spring). */
    next: AxisMotion | null;
}

/** Start an axis at `x` with velocity `v` (units/s): a spring if `x` is past `iv`. */
export const axisMotion = (x: number, v: number, iv: Interval, t0: number): AxisMotion | null => {
    const e = excess(x, iv);
    if (e !== 0) return { kind: "spring", side: e > 0 ? 1 : -1, e0: e, v0: v, t0 };
    return v === 0 ? null : { kind: "coast", x0: x, v0: v, t0 };
};

/**
 * Sample `m` at `now` (s). A coast rests once its speed falls under
 * `restFraction` of its start; a spring once it is home, where it lands
 * exactly on the bound.
 */
export const sampleAxis = (
    m: AxisMotion,
    now: number,
    iv: Interval,
    k: number,
    restFraction: number,
    rest: { x: number; v: number } = { x: SPRING_REST, v: SPRING_REST_SPEED },
): AxisSample => {
    if (m.kind === "coast") {
        const tau = Math.max(0, now - m.t0);
        const x = m.x0 + (m.v0 / k) * (1 - Math.exp(-k * tau));
        const v = m.v0 * Math.exp(-k * tau);
        const e = excess(x, iv);
        if (e !== 0 && excess(m.x0, iv) === 0) {
            // The crossing, in closed form: x0 + v0/k·(1 − e^(−kτc)) = bound.
            const side: 1 | -1 = e > 0 ? 1 : -1;
            const bound = side > 0 ? iv.hi : iv.lo;
            const u = 1 - (k * (bound - m.x0)) / m.v0;
            const tc = u > 0 && u <= 1 ? -Math.log(u) / k : 0;
            const vc = m.v0 * Math.exp(-k * tc);
            return sampleAxis({ kind: "spring", side, e0: 0, v0: vc, t0: m.t0 + tc }, now, iv, k, restFraction, rest);
        }
        if (Math.abs(v) < restFraction * Math.abs(m.v0)) return { x, v: 0, next: null };
        return { x, v, next: m };
    }
    const bound = m.side > 0 ? iv.hi : iv.lo;
    const tau = Math.max(0, now - m.t0);
    const s = springBack(m.e0, m.v0, k, tau);
    if (tau > 0 && Math.abs(s.x) < rest.x && Math.abs(s.v) < rest.v) return { x: bound, v: 0, next: null };
    return { x: bound + s.x, v: s.v, next: m };
};
