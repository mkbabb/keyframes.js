// SERVED MODEL: claude-opus-5-5
/**
 * The orbit's rotation math, pure (KF-M2, COHESION §0hm): no Vue, no DOM, no
 * gl-matrix. gl-matrix's `quat` is a Float32Array, and a float32 attitude
 * cannot hold the closed-loop and renormalisation gates (1e-12); every tuple
 * here is a plain f64 array in gl-matrix's layout, `[x, y, z, w]`.
 *
 * Frames. S is the screen frame in CSS px: x right, y down, z toward the
 * viewer (right-handed: x × y = z). G is the stage attitude `.graph` is parked
 * at (graphAttitude.ts); Q is the container-local attitude OrbitalDrag renders
 * inside G, so the world attitude is G·Q. A rotation the hand authors on the
 * screen (q_s) reaches the stored Q conjugated: Q' = (G⁻¹·q_s·G)·Q.
 */

export type Vec3 = [number, number, number];
export type Quat = [number, number, number, number];

export const IDENTITY_QUAT: Readonly<Quat> = [0, 0, 0, 1];

export const dot3 = (a: Readonly<Vec3>, b: Readonly<Vec3>) =>
    a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export const cross3 = (a: Readonly<Vec3>, b: Readonly<Vec3>): Vec3 => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
];

export const norm3 = (a: Readonly<Vec3>) => Math.hypot(a[0], a[1], a[2]);

/** Hamilton product a·b (apply b, then a), gl-matrix's `quat.multiply` order. */
export const quatMultiply = (a: Readonly<Quat>, b: Readonly<Quat>): Quat => {
    const [ax, ay, az, aw] = a;
    const [bx, by, bz, bw] = b;
    return [
        aw * bx + ax * bw + ay * bz - az * by,
        aw * by + ay * bw + az * bx - ax * bz,
        aw * bz + az * bw + ax * by - ay * bx,
        aw * bw - ax * bx - ay * by - az * bz,
    ];
};

export const quatConjugate = (q: Readonly<Quat>): Quat => [-q[0], -q[1], -q[2], q[3]];

export const quatDot = (a: Readonly<Quat>, b: Readonly<Quat>) =>
    a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];

/** Unit length, in the w ≥ 0 hemisphere (q and −q are one rotation; one
 *  spelling keeps the rendered axis-angle ≤ 180° and the store comparable). */
export const quatCanonical = (q: Readonly<Quat>): Quat => {
    const n = Math.hypot(q[0], q[1], q[2], q[3]);
    if (n === 0) return [0, 0, 0, 1];
    const s = q[3] < 0 ? -1 / n : 1 / n;
    return [q[0] * s, q[1] * s, q[2] * s, q[3] * s];
};

export const quatFromAxisAngle = (axis: Readonly<Vec3>, rad: number): Quat => {
    const n = norm3(axis);
    if (n === 0 || rad === 0) return [0, 0, 0, 1];
    const s = Math.sin(rad / 2) / n;
    return [axis[0] * s, axis[1] * s, axis[2] * s, Math.cos(rad / 2)];
};

/** The axis (unit) and angle (rad, in [0, π] for a canonical q) of a rotation. */
export const quatToAxisAngle = (q: Readonly<Quat>): { axis: Vec3; angle: number } => {
    const c = quatCanonical(q);
    const s = Math.hypot(c[0], c[1], c[2]);
    if (s < 1e-15) return { axis: [0, 0, 1], angle: 0 };
    return { axis: [c[0] / s, c[1] / s, c[2] / s], angle: 2 * Math.atan2(s, c[3]) };
};

/** Rotate a vector by a unit quaternion. */
export const rotateVec = (q: Readonly<Quat>, v: Readonly<Vec3>): Vec3 => {
    const p = quatMultiply(quatMultiply(q, [v[0], v[1], v[2], 0]), quatConjugate(q));
    return [p[0], p[1], p[2]];
};

/** The angle (rad) between two rotations — the atan2 form, exact near zero
 *  (2·acos|dot| loses everything below ~1e-8 to rounding). */
export const quatAngleBetween = (a: Readonly<Quat>, b: Readonly<Quat>) => {
    const d = quatMultiply(a, quatConjugate(b));
    return 2 * Math.atan2(Math.hypot(d[0], d[1], d[2]), Math.abs(d[3]));
};

/**
 * Shoemake's sphere map. `u` is the pointer's offset from the projected centre
 * over the arcball radius R. Inside the disc the pointer lifts onto the front
 * hemisphere; outside it rides the rim (z = 0), which is where roll lives.
 */
export const sphereMap = (ux: number, uy: number): Vec3 => {
    const r2 = ux * ux + uy * uy;
    if (r2 <= 1) return [ux, uy, Math.sqrt(1 - r2)];
    const r = Math.sqrt(r2);
    return [ux / r, uy / r, 0];
};

/**
 * Shoemake's arc q(a, b) = [w = a·b, xyz = a×b] for unit a, b: the rotation
 * about a×b by TWICE the angle between them. The double angle is what makes the
 * map direct: with R = 2h (h the projected half side), the front face moves
 * 1:1 under the finger, and centre → rim is a half turn.
 */
export const shoemakeArc = (a: Readonly<Vec3>, b: Readonly<Vec3>): Quat => {
    const c = cross3(a, b);
    return [c[0], c[1], c[2], dot3(a, b)];
};

/**
 * The axis latch (X/Y/Z held): project a sphere point onto the plane ⟂ `axis`
 * (unit, screen frame) and renormalise, so q(a', b') turns about `axis` only.
 * A point on the axis has no projection; the caller keeps the previous one.
 */
export const constrainToAxis = (v: Readonly<Vec3>, axis: Readonly<Vec3>): Vec3 | null => {
    const d = dot3(v, axis);
    const p: Vec3 = [v[0] - d * axis[0], v[1] - d * axis[1], v[2] - d * axis[2]];
    const n = norm3(p);
    if (n < 1e-6) return null;
    return [p[0] / n, p[1] / n, p[2] / n];
};

/** conj(q_s) = G⁻¹·q_s·G — a screen-frame rotation, re-expressed in the frame
 *  the container's attitude Q is stored in (the axis turned by G⁻¹, the angle
 *  kept). */
export const conjugateByAttitude = (qs: Readonly<Quat>, G: Readonly<Quat>): Quat =>
    quatMultiply(quatMultiply(quatConjugate(G), qs), G);

/** Q' = conj(q_s)·Q₀, renormalised and canonical. Anchored: Q₀ is the
 *  gesture's attitude at pointerdown, so a closed path returns exactly. */
export const applyScreenDelta = (
    Q0: Readonly<Quat>,
    qs: Readonly<Quat>,
    G: Readonly<Quat>,
): Quat => quatCanonical(quatMultiply(conjugateByAttitude(qs, G), Q0));

/**
 * The pan's render offset, in the stage's own plane: the container-local
 * (a, b, 0) whose image under G lands the screen pan (t.x, t.y). `.graph`
 * carries `perspective`, which acts in ITS local frame before G, so a local
 * depth magnifies the pan: G⁻¹·t has local z = −0.354·t.x + … and carried the
 * die 1.15× past the clamp at a 440 px pan. On the plane there is no depth,
 * so the die's centre lands exactly t. A z pan (the matrix slider) stays G⁻¹·z.
 */
export const panInPlane = (G: Readonly<Quat>, t: Readonly<Vec3>): Vec3 => {
    const gx = rotateVec(G, [1, 0, 0]);
    const gy = rotateVec(G, [0, 1, 0]);
    const det = gx[0] * gy[1] - gy[0] * gx[1];
    const a = (t[0] * gy[1] - gy[0] * t[1]) / det;
    const b = (gx[0] * t[1] - t[0] * gx[1]) / det;
    const z = rotateVec(quatConjugate(G), [0, 0, t[2]]);
    return [a + z[0], b + z[1], z[2]];
};

/** log(q) for a unit q: axis · (θ/2). */
export const quatLog = (q: Readonly<Quat>): Vec3 => {
    const c = quatCanonical(q);
    const s = Math.hypot(c[0], c[1], c[2]);
    if (s < 1e-15) return [0, 0, 0];
    const half = Math.atan2(s, c[3]);
    return [(c[0] / s) * half, (c[1] / s) * half, (c[2] / s) * half];
};

/** exp(v) for a pure v: the unit quaternion with axis v̂ and half-angle |v|. */
export const quatExp = (v: Readonly<Vec3>): Quat => {
    const half = norm3(v);
    if (half < 1e-15) return [0, 0, 0, 1];
    const s = Math.sin(half) / half;
    return [v[0] * s, v[1] * s, v[2] * s, Math.cos(half)];
};

/** A timestamped pose, for the release's velocity estimate: the attitude,
 *  and (OA-17) the pan `p` in screen px and the zoom as ln s. */
export interface AttitudeSample {
    t: number;
    q: Quat;
    p?: { x: number; y: number };
    ls?: number;
}

/** The estimator's window and its hold rule (KFA-82). */
export const VELOCITY_WINDOW_MS = 80;
export const MIN_VELOCITY_SPAN_MS = 16;
export const HOLD_RELEASE_MS = 64;

/**
 * The release window every rate is read over: the first and last samples of
 * the last 80 ms and the span between them (s), or null when the hand rested
 * more than 64 ms before release (KFA-82) or the window is too short to read a
 * speed from (fewer than two samples, Δt < 16 ms).
 */
const releaseWindow = <S extends AttitudeSample>(samples: readonly S[], releaseAt: number) => {
    const last = samples[samples.length - 1];
    if (!last || samples.length < 2) return null;
    if (releaseAt - last.t > HOLD_RELEASE_MS) return null;
    let first = last;
    for (let i = samples.length - 1; i >= 0; i--) {
        const s = samples[i]!;
        if (last.t - s.t > VELOCITY_WINDOW_MS) break;
        first = s;
    }
    const dt = (last.t - first.t) / 1000;
    return dt * 1000 < MIN_VELOCITY_SPAN_MS ? null : { first, last, dt };
};

/**
 * The release's angular velocity, per unit TIME (rad/s), as an axis·rate vector
 * in the frame Q is stored in: ω = 2·log(Qₙ·Q_then⁻¹)/Δt over the release
 * window. The rate is the hand's, whatever the event rate: the same angle
 * delivered in two events or in eight reads the same ω (D-15, KFA-83).
 */
export const angularVelocityFromSamples = (
    samples: readonly AttitudeSample[],
    releaseAt: number,
): Vec3 => {
    const w = releaseWindow(samples, releaseAt);
    if (!w) return [0, 0, 0];
    const l = quatLog(quatMultiply(w.last.q, quatConjugate(w.first.q)));
    return [(2 * l[0]) / w.dt, (2 * l[1]) / w.dt, (2 * l[2]) / w.dt];
};

/**
 * OA-17 — the release's pan velocity (screen px/s) and zoom rate (ln s per
 * second), over the SAME window and hold rule as ω, so the three channels of
 * one release are read from one moment of the hand.
 */
export const poseRatesFromSamples = (
    samples: readonly AttitudeSample[],
    releaseAt: number,
): { pan: { x: number; y: number }; zoom: number } => {
    const w = releaseWindow(samples, releaseAt);
    const a = w?.first;
    const b = w?.last;
    if (!w || !a?.p || !b?.p || a.ls === undefined || b.ls === undefined) return { pan: { x: 0, y: 0 }, zoom: 0 };
    return { pan: { x: (b.p.x - a.p.x) / w.dt, y: (b.p.y - a.p.y) / w.dt }, zoom: (b.ls - a.ls) / w.dt };
};

/** Unwrap `a` (degrees) onto the turn nearest `prev`. */
export const unwrapDegrees = (a: number, prev: number) =>
    a + 360 * Math.round((prev - a) / 360);

/** Fold an angle back inside one turn, only once it has left it (|a| > 360);
 *  the readout runs unwrapped through a gesture and folds at its end. */
export const foldDegrees = (a: number) =>
    Math.abs(a) > 360 ? a - 360 * Math.trunc(a / 360) : a;
