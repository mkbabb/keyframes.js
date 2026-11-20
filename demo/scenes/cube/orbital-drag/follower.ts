/**
 * follower — one critically damped follower for every stepped input.
 *
 * A wheel stream, a mouse notch, an arrow key, a pinch or a twist arrives as
 * steps: events at their own cadence, unevenly against the frames. Each moves
 * a TARGET T; the shown value x follows it on the critically damped spring
 *
 *     x'' = −2ω·x' − ω²·(x − T),
 *
 * taken by its EXACT step over the frame's dt (so the curve is the same at
 * 60 and 120 Hz):
 *
 *     e = x − T,  E = e^(−ωΔt),
 *     x ← T + (e + (v + ωe)·Δt)·E,
 *     v ← (v − (v + ωe)·ω·Δt)·E.
 *
 * It never overshoots a target that stands still or one it was trailing; it
 * lands exactly on the target; and its speed is continuous, so a new step
 * never kicks the frame it arrives in. Its lag behind a steady stream is 2/ω.
 *
 * Pure and Vue-free: the orbit's turn, zoom and pan each hold one, and the
 * pair of dice carries a held die on one.
 */

/** One follower over n components, each its own spring of one stiffness. */
export interface Follower {
    /** Where it stands. */
    x: number[];
    /** Its speed (units per second). */
    v: number[];
    /** Where it is going. */
    T: number[];
    /** Its stiffness ω (1/s): the lag behind a steady stream is 2/ω. */
    omega: number;
}

export const createFollower = (n: number, omega: number): Follower => ({
    x: new Array<number>(n).fill(0),
    v: new Array<number>(n).fill(0),
    T: new Array<number>(n).fill(0),
    omega,
});

/** The exact step of one component over `dt` seconds: [x, v]. */
export const criticalStep = (x: number, v: number, T: number, omega: number, dt: number): [number, number] => {
    const e = x - T;
    const E = Math.exp(-omega * dt);
    const k = v + omega * e;
    return [T + (e + k * dt) * E, (v - k * omega * dt) * E];
};

/** Advance every component by `dt` seconds. */
export const stepFollower = (f: Follower, dt: number): void => {
    if (!(dt > 0)) return;
    for (let i = 0; i < f.x.length; i++) {
        const [x, v] = criticalStep(f.x[i]!, f.v[i]!, f.T[i]!, f.omega, dt);
        f.x[i] = x;
        f.v[i] = v;
    }
};

/** Move the target by `d` (a step of input). */
export const moveTarget = (f: Follower, d: readonly number[]): void => {
    for (let i = 0; i < f.T.length; i++) f.T[i] = f.T[i]! + (d[i] ?? 0);
};

/** Is it home: within `eps` of the target and slower than `epsV` per second? */
export const followerNear = (f: Follower, eps: number, epsV: number): boolean => {
    for (let i = 0; i < f.x.length; i++) {
        if (Math.abs(f.x[i]! - f.T[i]!) > eps || Math.abs(f.v[i]!) > epsV) return false;
    }
    return true;
};

/** Is it owed nothing and still? */
export const followerIdle = (f: Follower): boolean => {
    for (let i = 0; i < f.x.length; i++) if (f.x[i] !== f.T[i] || f.v[i] !== 0) return false;
    return true;
};

/** Land on the target and stop (the remainder under the eye's threshold). */
export const landFollower = (f: Follower): void => {
    for (let i = 0; i < f.x.length; i++) {
        f.x[i] = f.T[i]!;
        f.v[i] = 0;
    }
};

/** Stop where it stands: the target becomes the place, the speed nothing. */
export const holdFollower = (f: Follower): void => {
    for (let i = 0; i < f.x.length; i++) {
        f.T[i] = f.x[i]!;
        f.v[i] = 0;
    }
};

/** Re-origin a follower whose value is a running sum (the turn, the zoom,
 *  the pan are applied as their per-frame difference): x and T move together,
 *  so nothing it shows changes and the numbers stay small. */
export const rebaseFollower = (f: Follower): void => {
    for (let i = 0; i < f.x.length; i++) {
        f.T[i] = f.T[i]! - f.x[i]!;
        f.x[i] = 0;
    }
};
