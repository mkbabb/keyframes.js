/**
 * dicePhysics: two dice on a table, pure and Vue-free (the pair's model).
 *
 * Each die is a rigid cube (side s, unit mass, isotropic inertia s²/6). The
 * table is the plane z = 0 (table axes: x right, y toward the viewer, z up off
 * the table), walled where the stage's edge is. Gravity pulls; the table and
 * the walls answer at each corner of the die's rounded body with an impulse
 * (restitution and Coulomb friction, so a die thrown flat rolls and a corner
 * strike flips it). The two dice meet as boxes: the separating axis over the
 * 15 axes of a box pair finds the overlap, the pair is pushed apart along it,
 * and the impulse acts at the deepest corner. A die that has nearly stopped is
 * handed to keyframes' SpringProgress, which lays it flat on the face nearest
 * up, checked against the other die first.
 *
 * The step is fixed (STEP_S, 240 Hz) and sub-stepped from the frame's dt, so
 * 60 and 120 Hz draw the same throw.
 *
 * The camera (the stage looking down at the table, tilted TILT_DEG from the
 * screen) and the table's walls are here too, so a throw can be judged
 * without a page.
 */
import { SpringProgress } from "@mkbabb/keyframes.js";
import { DIE_FACES, type DieFace, type DieValue } from "./pips";

export type V3 = [number, number, number];
export type Q = [number, number, number, number]; // x, y, z, w

/** Fixed physics step (s). */
export const STEP_S = 1 / 240;
/** Gravity in die sides per s² (a die is small and heavy). */
export const GRAVITY_SIDES = 38;
/** The rounded body: corners drawn in by this fraction of the side. */
export const ROUND = 0.1;
/** Restitution: the table, a wall, the other die. */
export const E_TABLE = 0.32;
export const E_WALL = 0.45;
export const E_DIE = 0.4;
/** Below this approach speed (sides/s) a contact does not bounce. */
const REST_BOUNCE = 0.9;
/** Coulomb friction on the table and the walls, and between the dice (their
 *  faces are smooth). */
export const MU = 0.42;
const MU_DIE = 0.15;
/** The pair's landing gap, centre to centre (sides). */
const PAIR_GAP = 1.1;
/** How long two dice thrown side by side part before they tumble (s). */
const TUMBLE_WAIT_S = 0.08;
/** The felt: what of a die's spin and glide a hard landing keeps. */
const FELT_SPIN = 0.15;
const FELT_GLIDE = 0.45;
/** Rolling and spin drag while touching the table (1/s). */
const DRAG_LIN = 5;
const DRAG_ANG = 10;
/** Settle when slower than these (sides/s, rad/s) for SETTLE_HOLD_S. */
const SETTLE_LIN = 0.7;
const SETTLE_ANG = 3.0;
const SETTLE_HOLD_S = 0.05;
/** The landing: the spring that lays a die flat (keyframes' SpringProgress). */
export const SETTLE_SPRING = { response: 0.26, dampingFraction: 0.62 };
/** The table's tilt from the screen (deg). */
export const TILT_DEG = 38;
const TILT = (TILT_DEG * Math.PI) / 180;
const C = Math.cos(TILT);
const S = Math.sin(TILT);

export type DiePhase = "rest" | "air" | "settle" | "held";
export type Side = DieFace["side"];
/** The value each face carries (a die relabelled under reduced motion is
 *  still a true die: its labels are a rotation of the first ones). */
export type Labels = Record<Side, DieValue>;

export interface Die {
    p: V3; // centre (px, table axes)
    v: V3; // px/s
    q: Q; // attitude
    w: V3; // rad/s, table axes
    phase: DiePhase;
    /** Seconds spent slow enough to settle. */
    slow: number;
    /** The landing: from and to (attitude, centre) on one spring. */
    settle?: { from: Q; to: Q; p0: V3; p1: V3; spring: SpringProgress } | undefined;
    /** A throw's tumble and when it begins (s into the flight): two dice
     *  thrown from side by side part for TUMBLE_WAIT_S first, as spinning
     *  side by side they would strike each other leaving the hand. */
    tumble?: { w: V3; at: number } | undefined;
    /** Seconds since the throw left the hand. */
    flight: number;
    labels: Labels;
}

export interface Table {
    /** The die's side (px). */
    side: number;
    /** The walls: |x| ≤ halfX, −farY ≤ y ≤ nearY (px, a die's edge). */
    halfX: number;
    farY: number;
    nearY: number;
}

// ── Vectors and quaternions ─────────────────────────────────────────
export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: V3, b: V3): V3 => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
];
export const len = (a: V3) => Math.hypot(a[0], a[1], a[2]);

export const qMul = (a: Q, b: Q): Q => [
    a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
    a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
    a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
    a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
];
export const qConj = (q: Q): Q => [-q[0], -q[1], -q[2], q[3]];
export const qNorm = (q: Q): Q => {
    const m = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
    return [q[0] / m, q[1] / m, q[2] / m, q[3] / m];
};
export const qAxisAngle = (axis: V3, angle: number): Q => {
    const m = len(axis) || 1;
    const s = Math.sin(angle / 2) / m;
    return [axis[0] * s, axis[1] * s, axis[2] * s, Math.cos(angle / 2)];
};
/** Rotate v by q. */
export const qRot = (q: Q, v: V3): V3 => {
    const u: V3 = [q[0], q[1], q[2]];
    const t = mul(cross(u, v), 2);
    return add(add(v, mul(t, q[3])), cross(u, t));
};
/** Slerp, extrapolating past 1 for a spring's overshoot. */
export const qSlerp = (a: Q, b: Q, t: number): Q => {
    let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
    let bb = b;
    if (d < 0) {
        d = -d;
        bb = [-b[0], -b[1], -b[2], -b[3]];
    }
    if (d > 0.9995) {
        return qNorm([
            a[0] + (bb[0] - a[0]) * t,
            a[1] + (bb[1] - a[1]) * t,
            a[2] + (bb[2] - a[2]) * t,
            a[3] + (bb[3] - a[3]) * t,
        ]);
    }
    const th = Math.acos(d);
    const s = Math.sin(th);
    const ka = Math.sin((1 - t) * th) / s;
    const kb = Math.sin(t * th) / s;
    return qNorm([a[0] * ka + bb[0] * kb, a[1] * ka + bb[1] * kb, a[2] * ka + bb[2] * kb, a[3] * ka + bb[3] * kb]);
};

/** The table's tilt as a rotation (the screen's frame from the table's). */
export const TABLE_TILT: Q = qAxisAngle([1, 0, 0], TILT);

/** The CSS matrix3d of a die: its attitude, a scale, then its centre (table px). */
export const dieMatrix = (d: Pick<Die, "p" | "q">, scale = 1): string => {
    const [x, y, z, w] = d.q;
    const xx = x * x, yy = y * y, zz = z * z;
    const xy = x * y, xz = x * z, yz = y * z, wx = w * x, wy = w * y, wz = w * z;
    const k = scale;
    // Column-major: the images of the die's x, y and z axes, then the centre.
    return `matrix3d(${k * (1 - 2 * (yy + zz))},${k * 2 * (xy + wz)},${k * 2 * (xz - wy)},0,${k * 2 * (xy - wz)},${k * (1 - 2 * (xx + zz))},${k * 2 * (yz + wx)},0,${k * 2 * (xz + wy)},${k * 2 * (yz - wx)},${k * (1 - 2 * (xx + yy))},0,${d.p[0]},${d.p[1]},${d.p[2]},1)`;
};

const UP: V3 = [0, 0, 1];

export const FIRST_LABELS: Labels = Object.fromEntries(DIE_FACES.map((f) => [f.side, f.value])) as Labels;

/** The face most nearly up: its side, its value and its normal (table axes). */
export const faceUp = (q: Q, labels: Labels = FIRST_LABELS): { side: Side; value: DieValue; n: V3 } => {
    let best = { side: "top" as Side, value: labels.top, n: [0, 0, 1] as V3 };
    let top = -Infinity;
    for (const f of DIE_FACES) {
        const n = qRot(q, f.normal as V3);
        if (n[2] > top) {
            top = n[2];
            best = { side: f.side, value: labels[f.side], n };
        }
    }
    return best;
};

/** The attitude that lays `q` flat on its most-up face by the least turn
 *  (its yaw kept). */
export const flatten = (q: Q): Q => {
    const { n } = faceUp(q);
    const c = Math.max(-1, Math.min(1, n[2]));
    const axis = cross(n, UP);
    const a = Math.acos(c);
    if (len(axis) < 1e-9 || a < 1e-6) return q;
    return qNorm(qMul(qAxisAngle(axis, a), q));
};

/** An attitude resting on its `side` face with a yaw (rad). */
export const restingOnSide = (side: Side, yaw: number): Q => {
    const f = DIE_FACES.find((x) => x.side === side)!;
    const n = f.normal as V3;
    const axis = cross(n, UP);
    const c = dot(n, UP);
    const lay =
        len(axis) < 1e-9 ? (c > 0 ? ([0, 0, 0, 1] as Q) : qAxisAngle([1, 0, 0], Math.PI)) : qAxisAngle(axis, Math.acos(c));
    return qNorm(qMul(qAxisAngle(UP, yaw), lay));
};

/** An attitude showing `value` up (first labels) with a yaw (rad). */
export const restingOn = (value: DieValue, yaw: number): Q =>
    restingOnSide(DIE_FACES.find((f) => f.value === value)!.side, yaw);

export const newDie = (p: V3, value: DieValue, yaw: number): Die => ({
    p,
    v: [0, 0, 0],
    q: restingOn(value, yaw),
    w: [0, 0, 0],
    phase: "rest",
    slow: 0,
    flight: 0,
    labels: { ...FIRST_LABELS },
});

// ── Relabelling (reduced motion) ────────────────────────────────────
/** The 24 turns of a cube, as integer matrices (rows), det +1. */
const CUBE_TURNS: number[][][] = (() => {
    const out: number[][][] = [];
    const perms = [
        [0, 1, 2],
        [0, 2, 1],
        [1, 0, 2],
        [1, 2, 0],
        [2, 0, 1],
        [2, 1, 0],
    ];
    for (const p of perms)
        for (let signs = 0; signs < 8; signs++) {
            const m = [0, 1, 2].map((r) => {
                const row = [0, 0, 0];
                row[p[r]!] = signs & (1 << r) ? -1 : 1;
                return row;
            });
            const det =
                m[0]![0]! * (m[1]![1]! * m[2]![2]! - m[1]![2]! * m[2]![1]!) -
                m[0]![1]! * (m[1]![0]! * m[2]![2]! - m[1]![2]! * m[2]![0]!) +
                m[0]![2]! * (m[1]![0]! * m[2]![1]! - m[1]![1]! * m[2]![0]!);
            if (det === 1) out.push(m);
        }
    return out;
})();

const sideOfNormal = (n: V3): Side =>
    DIE_FACES.find((f) => f.normal[0] === n[0] && f.normal[1] === n[1] && f.normal[2] === n[2])!.side;

/**
 * The labels that show `value` on the face now up, by turning the die's marks
 * (one of the cube's 24 turns, so opposite faces still sum to seven and the
 * die keeps its hand). The die itself does not move.
 */
export const relabelUp = (q: Q, labels: Labels, value: DieValue, rnd = Math.random): Labels => {
    const up = faceUp(q, labels).side;
    const options: Labels[] = [];
    for (const m of CUBE_TURNS) {
        const next = {} as Labels;
        for (const f of DIE_FACES) {
            const n = f.normal;
            const g: V3 = [
                m[0]![0]! * n[0] + m[0]![1]! * n[1] + m[0]![2]! * n[2],
                m[1]![0]! * n[0] + m[1]![1]! * n[1] + m[1]![2]! * n[2],
                m[2]![0]! * n[0] + m[2]![1]! * n[1] + m[2]![2]! * n[2],
            ];
            next[f.side] = labels[sideOfNormal(g)];
        }
        if (next[up] === value) options.push(next);
    }
    return options[Math.floor(rnd() * options.length)] ?? labels;
};

// ── The camera and the table ────────────────────────────────────────
export interface Camera {
    /** The stage's box (px). */
    w: number;
    h: number;
    /** The perspective distance (px): a long lens, so the dice are not distorted. */
    persp: number;
    /** The die's side (px). */
    side: number;
}

/** The die's side: 24 % of the stage's short side on a phone-sized stage
 *  (under 500 px), 21 % elsewhere, within a hand's reach (64-168 px). */
export const dieSide = (w: number, h: number): number => {
    const short = Math.min(w, h);
    return Math.max(64, Math.min(168, (short < 500 ? 0.24 : 0.21) * short));
};

export const cameraFor = (w: number, h: number): Camera => ({
    w,
    h,
    persp: Math.max(900, 1.6 * Math.max(w, h)),
    side: dieSide(w, h),
});

/** A table point to the stage (px from its centre), and its scale. */
export const project = (cam: Camera, p: V3) => {
    const Y = p[1] * C - p[2] * S;
    const Z = p[1] * S + p[2] * C;
    const k = cam.persp / (cam.persp - Z);
    return { x: p[0] * k, y: Y * k, k };
};

/** A stage point (px from its centre) onto the table's plane at height z0. */
export const unproject = (cam: Camera, sx: number, sy: number, z0: number): V3 => {
    const P = cam.persp;
    const t = (P - z0 / C) / (P + (sy * S) / C);
    return [t * sx, (t * sy + z0 * S) / C, z0];
};

/** The walls: the dice stay where they can be seen, a die's width inside the
 *  stage's edge (the far edge is the narrow one). */
export const tableFor = (cam: Camera): Table => {
    const s = cam.side;
    const m = 0.65 * s;
    const far = unproject(cam, cam.w / 2 - m, -cam.h / 2 + m * 1.6, s / 2);
    const near = unproject(cam, 0, cam.h / 2 - m, s / 2);
    return {
        side: s,
        halfX: Math.max(s, far[0]),
        farY: Math.max(s, -far[1]),
        nearY: Math.max(s, near[1]),
    };
};

/** The middle of the table's depth, and the depth. */
export const tableDepth = (tb: Table) => ({ mid: (tb.nearY - tb.farY) / 2, depth: tb.nearY + tb.farY });

// ── Box against box: the separating axis ────────────────────────────
const axesOf = (q: Q): [V3, V3, V3] => [qRot(q, [1, 0, 0]), qRot(q, [0, 1, 0]), qRot(q, [0, 0, 1])];

const cornersOf = (p: V3, q: Q, h: number): V3[] => {
    const out: V3[] = [];
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) out.push(add(p, qRot(q, [sx * h, sy * h, sz * h])));
    return out;
};

export interface BoxContact {
    /** How deep the boxes overlap along `n` (px). */
    depth: number;
    /** The axis of least overlap, from a toward b. */
    n: V3;
    /** Where the impulse acts: the deepest corner (a face axis), or between the
     *  two edges (an edge pair). */
    at: V3;
}

/**
 * The overlap of two cubes of side `s` (centres and attitudes), by the
 * separating axis theorem over the 15 axes (each box's three face normals and
 * the nine edge crosses). Null when an axis separates them.
 */
export function boxContact(a: Pick<Die, "p" | "q">, b: Pick<Die, "p" | "q">, s: number): BoxContact | null {
    const h = s / 2;
    const A = axesOf(a.q);
    const B = axesOf(b.q);
    const T = sub(b.p, a.p);
    let best = Infinity;
    let bestN: V3 = [0, 0, 1];
    let kind = "a" as "a" | "b" | "edge";
    const test = (L: V3, which: "a" | "b" | "edge"): boolean => {
        const l = len(L);
        if (l < 1e-6) return true;
        const n = mul(L, 1 / l);
        const ra = h * (Math.abs(dot(A[0], n)) + Math.abs(dot(A[1], n)) + Math.abs(dot(A[2], n)));
        const rb = h * (Math.abs(dot(B[0], n)) + Math.abs(dot(B[1], n)) + Math.abs(dot(B[2], n)));
        const o = ra + rb - Math.abs(dot(T, n));
        if (o < 0) return false;
        // Prefer a face axis unless an edge pair is clearly shallower.
        const score = which === "edge" ? o + 0.02 * h : o;
        if (score < best) {
            best = score;
            bestN = dot(T, n) < 0 ? mul(n, -1) : n;
            kind = which;
        }
        return true;
    };
    for (const ax of A) if (!test(ax, "a")) return null;
    for (const bx of B) if (!test(bx, "b")) return null;
    for (const ax of A) for (const bx of B) if (!test(cross(ax, bx), "edge")) return null;
    const n = bestN;
    const ha = cornersOf(a.p, a.q, h);
    const hb = cornersOf(b.p, b.q, h);
    // The deepest corners: b's furthest toward a, a's furthest toward b.
    const deepest = (cs: V3[], dir: V3) => {
        const m = Math.max(...cs.map((c) => dot(c, dir)));
        const near = cs.filter((c) => dot(c, dir) > m - 0.02 * h);
        return mul(near.reduce(add, [0, 0, 0] as V3), 1 / near.length);
    };
    const ca = deepest(ha, n);
    const cb = deepest(hb, mul(n, -1));
    const at = kind === "a" ? cb : kind === "b" ? ca : mul(add(ca, cb), 0.5);
    const depth = kind === "edge" ? best - 0.02 * h : best;
    return { depth, n, at };
}

/** How far the two dice overlap (px; 0 when apart). */
export const penetration = (a: Pick<Die, "p" | "q">, b: Pick<Die, "p" | "q">, s: number): number =>
    boxContact(a, b, s)?.depth ?? 0;

// ── Contacts ────────────────────────────────────────────────────────
const UNIT_CORNERS: V3[] = [];
for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) UNIT_CORNERS.push([sx, sy, sz]);

/** An impulse at r (from the centre) against a fixed surface of normal n. */
function contact(d: Die, r: V3, n: V3, e: number, s: number) {
    const I = (s * s) / 6;
    const vc = add(d.v, cross(d.w, r));
    const vn = dot(vc, n);
    if (vn >= 0) return;
    const rn = cross(r, n);
    const kn = 1 + dot(rn, rn) / I;
    const bounce = -vn > REST_BOUNCE * s ? e : 0;
    const jn = (-(1 + bounce) * vn) / kn;
    const vt = sub(vc, mul(n, vn));
    const vtl = len(vt);
    let J = mul(n, jn);
    if (vtl > 1e-6) {
        const t = mul(vt, 1 / vtl);
        const rt = cross(r, t);
        const kt = 1 + dot(rt, rt) / I;
        const jt = Math.min(vtl / kt, MU * jn);
        J = sub(J, mul(t, jt));
    }
    d.v = add(d.v, J);
    d.w = add(d.w, mul(cross(r, J), 1 / I));
}

/** The table and the walls, at each corner of the rounded body. True while
 *  the die touches the table. */
function collideBounds(d: Die, tb: Table): boolean {
    const s = tb.side;
    const rr = ROUND * s;
    const h = s / 2 - rr;
    let touching = false;
    // A hard landing (faster than a bounce) is taken up by the felt first:
    // the spin and the glide it would turn into a roll are mostly absorbed.
    if (-d.v[2] > REST_BOUNCE * s && UNIT_CORNERS.some((c) => d.p[2] + qRot(d.q, mul(c, h))[2] - rr < 0)) {
        d.w = mul(d.w, FELT_SPIN);
        d.v = [d.v[0] * FELT_GLIDE, d.v[1] * FELT_GLIDE, d.v[2]];
    }
    for (const c of UNIT_CORNERS) {
        const r = qRot(d.q, mul(c, h));
        const pz = d.p[2] + r[2] - rr;
        if (pz < 0) {
            d.p[2] -= pz;
            contact(d, [r[0], r[1], r[2] - rr], UP, E_TABLE, s);
            touching = true;
        }
        const px = d.p[0] + r[0];
        if (px + rr > tb.halfX) {
            d.p[0] -= px + rr - tb.halfX;
            contact(d, [r[0] + rr, r[1], r[2]], [-1, 0, 0], E_WALL, s);
        } else if (px - rr < -tb.halfX) {
            d.p[0] += -tb.halfX - (px - rr);
            contact(d, [r[0] - rr, r[1], r[2]], [1, 0, 0], E_WALL, s);
        }
        const py = d.p[1] + r[1];
        if (py + rr > tb.nearY) {
            d.p[1] -= py + rr - tb.nearY;
            contact(d, [r[0], r[1] + rr, r[2]], [0, -1, 0], E_WALL, s);
        } else if (py - rr < -tb.farY) {
            d.p[1] += -tb.farY - (py - rr);
            contact(d, [r[0], r[1] - rr, r[2]], [0, 1, 0], E_WALL, s);
        }
    }
    return touching;
}

/** The die's centre inside the walls (a half side in), so a knock never
 *  pushes it through one. True when it moved. */
function keepInside(d: Die, tb: Table): boolean {
    const m = tb.side / 2;
    const x = Math.max(-tb.halfX + m, Math.min(tb.halfX - m, d.p[0]));
    const y = Math.max(-tb.farY + m, Math.min(tb.nearY - m, d.p[1]));
    const moved = x !== d.p[0] || y !== d.p[1];
    d.p[0] = x;
    d.p[1] = y;
    return moved;
}

const wake = (d: Die) => {
    if (d.phase === "rest" || d.phase === "settle") {
        d.phase = "air";
        d.settle = undefined;
        d.slow = 0;
    }
};

/**
 * The two dice as boxes: pushed apart along the axis of least overlap (a held
 * die is a hand and does not give way), and a knock answered by an impulse at
 * the deepest corner, with the dice's restitution and friction. One die lying
 * on the other slides off it.
 */
function collidePair(a: Die, b: Die, s: number, h: number) {
    const c = boxContact(a, b, s);
    if (!c) return;
    const ia = a.phase === "held" ? 0 : 1;
    const ib = b.phase === "held" ? 0 : 1;
    if (ia + ib === 0) return;
    const { n, depth, at } = c;
    // Apart, exactly, plus a hair so the next test reads them separate.
    const push = depth + 1e-6 * s;
    a.p = sub(a.p, mul(n, (push * ia) / (ia + ib)));
    b.p = add(b.p, mul(n, (push * ib) / (ia + ib)));
    const I = (s * s) / 6;
    const ra = sub(at, a.p);
    const rb = sub(at, b.p);
    const vrel = sub(add(b.v, cross(b.w, rb)), add(a.v, cross(a.w, ra)));
    const vn = dot(vrel, n);
    if (vn < 0) {
        const rna = cross(ra, n);
        const rnb = cross(rb, n);
        const k = ia + ib + (ia * dot(rna, rna)) / I + (ib * dot(rnb, rnb)) / I;
        const e = -vn > REST_BOUNCE * s ? E_DIE : 0;
        const j = (-(1 + e) * vn) / k;
        let J = mul(n, j);
        const vt = sub(vrel, mul(n, vn));
        const vtl = len(vt);
        if (vtl > 1e-6) {
            const t = mul(vt, 1 / vtl);
            const rta = cross(ra, t);
            const rtb = cross(rb, t);
            const kt = ia + ib + (ia * dot(rta, rta)) / I + (ib * dot(rtb, rtb)) / I;
            J = sub(J, mul(t, Math.min(vtl / kt, MU_DIE * j)));
        }
        a.v = sub(a.v, mul(J, ia));
        a.w = sub(a.w, mul(cross(ra, J), ia / I));
        b.v = add(b.v, mul(J, ib));
        b.w = add(b.w, mul(cross(rb, J), ib / I));
        // A real knock wakes a resting die; a graze from a landing does not.
        if (-vn > 0.5 * s) {
            if (ia) wake(a);
            if (ib) wake(b);
        }
    }
    // One die on the other: the upper slides off (a die does not stack).
    if (Math.abs(n[2]) > 0.6) {
        const [upper, lower, iu] = n[2] > 0 ? [b, a, ib] : [a, b, ia];
        if (iu) {
            const dx = upper.p[0] - lower.p[0];
            const dy = upper.p[1] - lower.p[1];
            const m = Math.hypot(dx, dy);
            const dir: V3 = m > 1e-6 ? [dx / m, dy / m, 0] : [1, 0, 0];
            upper.v = add(upper.v, mul(dir, 0.6 * GRAVITY_SIDES * s * h));
            wake(upper);
        }
    }
}

function beginSettle(d: Die, other: Die | undefined, s: number) {
    const to = flatten(d.q);
    const p1: V3 = [d.p[0], d.p[1], s / 2];
    // The lay-flat is checked against the other die first: a landing that
    // would sink into it is moved apart before it begins.
    if (other) {
        const there = other.settle ? { p: other.settle.p1, q: other.settle.to } : other;
        for (let i = 0; i < 4; i++) {
            const c = boxContact({ p: p1, q: to }, there, s);
            if (!c) break;
            const hz = Math.hypot(c.n[0], c.n[1]);
            const dir: V3 = hz > 1e-6 ? [-c.n[0] / hz, -c.n[1] / hz, 0] : [1, 0, 0];
            const step = c.depth / Math.max(hz, 0.3) + 1e-4 * s;
            p1[0] += dir[0] * step;
            p1[1] += dir[1] * step;
        }
    }
    const spring = new SpringProgress({
        ...SETTLE_SPRING,
        initial: 0,
        settleThreshold: 1e-3,
        velocitySettleThreshold: 1e-2,
        respectReducedMotion: false,
    });
    spring.target = 1;
    d.settle = { from: d.q, to, p0: [...d.p], p1, spring };
    d.phase = "settle";
    d.v = [0, 0, 0];
    d.w = [0, 0, 0];
}

/** Advance one die by one fixed step. */
function stepDie(d: Die, other: Die | undefined, tb: Table, h: number) {
    const s = tb.side;
    if (d.phase === "settle" && d.settle) {
        const st = d.settle;
        const u = st.spring.tickDt(h * 1000);
        d.q = qSlerp(st.from, st.to, u);
        const k = Math.min(1, u);
        d.p = [st.p0[0] + (st.p1[0] - st.p0[0]) * k, st.p0[1] + (st.p1[1] - st.p0[1]) * k, st.p0[2] + (st.p1[2] - st.p0[2]) * k];
        if (st.spring.settled) {
            d.q = st.to;
            d.p = [...st.p1];
            d.phase = "rest";
            d.settle = undefined;
        }
        return;
    }
    if (d.phase !== "air") return;
    if (d.tumble && d.flight >= d.tumble.at - 1e-9) {
        d.w = add(d.w, d.tumble.w);
        d.tumble = undefined;
    }
    d.flight += h;
    d.v[2] -= GRAVITY_SIDES * s * h;
    d.p = add(d.p, mul(d.v, h));
    const wl = len(d.w);
    if (wl > 1e-9) d.q = qNorm(qMul(qAxisAngle(d.w, wl * h), d.q));
    const touching = collideBounds(d, tb);
    if (touching) {
        const kl = Math.exp(-DRAG_LIN * h);
        const ka = Math.exp(-DRAG_ANG * h);
        d.v = [d.v[0] * kl, d.v[1] * kl, d.v[2]];
        d.w = mul(d.w, ka);
        const slow = len(d.v) < SETTLE_LIN * s && len(d.w) < SETTLE_ANG;
        d.slow = slow ? d.slow + h : 0;
        if (d.slow >= SETTLE_HOLD_S) beginSettle(d, other, s);
    } else {
        d.slow = 0;
    }
}

/** One fixed step of the pair (or of one die). */
export function stepOnce(dice: Die[], tb: Table, h: number) {
    const [a, b] = dice;
    if (a) stepDie(a, b, tb, h);
    if (b) stepDie(b, a, tb, h);
    if (a && b && (a.phase !== "rest" || b.phase !== "rest")) {
        // The pair, then the walls, until neither moves the other back in.
        for (let i = 0; i < 3; i++) {
            collidePair(a, b, tb.side, h);
            const moved = (a.phase !== "held" && keepInside(a, tb)) || (b.phase !== "held" && keepInside(b, tb));
            if (!moved) break;
        }
    }
}

/** Advance the pair by `dt` seconds (fixed sub-steps). True while anything moves. */
export function stepPair(dice: Die[], tb: Table, dt: number): boolean {
    const span = Math.min(dt, 0.1);
    const n = Math.max(1, Math.round(span / STEP_S));
    const h = span / n;
    for (let i = 0; i < n; i++) stepOnce(dice, tb, h);
    return dice.some((d) => d.phase !== "rest");
}

/** Throw a die: a launch velocity (px/s, table axes) and a spin (rad/s). */
export function launch(d: Die, v: V3, w: V3, tumble?: { w: V3; at: number }) {
    d.v = [...v];
    d.w = [...w];
    d.tumble = tumble;
    d.flight = 0;
    d.phase = "air";
    d.slow = 0;
    d.settle = undefined;
}

/** A random spin of magnitude in [lo, hi] rad/s about a random axis. */
export function randomSpin(lo: number, hi: number, rnd = Math.random): V3 {
    const u = 2 * rnd() - 1;
    const a = 2 * Math.PI * rnd();
    const r = Math.sqrt(1 - u * u);
    const m = lo + (hi - lo) * rnd();
    return [r * Math.cos(a) * m, r * Math.sin(a) * m, u * m];
}

/** How far the rounded body reaches below its centre at attitude q. */
const reachBelow = (q: Q, s: number): number => {
    const rr = ROUND * s;
    const h = s / 2 - rr;
    return Math.max(...UNIT_CORNERS.map((c) => -qRot(q, mul(c, h))[2])) + rr;
};

/**
 * A throw's tumble, chosen by the hand. A tumbling die's spin is steady in the
 * air, and a free tumble about one axis lands on the face it left about a
 * quarter of the time and on its opposite another quarter, so a throw from a
 * face would favour it. The hand draws the face fairly first (each of the six
 * alike, whatever was up before), then tries spins (an axis within
 * TUMBLE_TILT of level, 14-44 rad/s) until one, flown to the first touch of a
 * corner on the table, meets it with that face up and within LEAN_MAX of flat.
 * The flight is the step's own (gravity, the steady spin, the wait before the
 * tumble), so the throw lands as tried.
 */
const TUMBLE_TILT = 0.7;
const LEAN_MAX = 0.75;
export function landingTumble(
    d: Die,
    v: V3,
    tb: Table,
    wait: number,
    rnd = Math.random,
): { w: V3; at: number } {
    const s = tb.side;
    const g = GRAVITY_SIDES * s;
    const value = (1 + Math.floor(rnd() * 6)) as DieValue;
    // It tumbles once its corners clear the table (a die turning on its way
    // up would strike it with a corner), and once it has parted from the
    // other die.
    const clearZ = (s / 2 - ROUND * s) * Math.sqrt(3) + ROUND * s;
    const rise = v[2] * v[2] - 2 * g * (clearZ - d.p[2]);
    const at = Math.max(wait, d.p[2] >= clearZ ? 0 : rise > 0 ? (v[2] - Math.sqrt(rise)) / g : 0);
    let w: V3 = [0, 0, 0];
    for (let tries = 0; tries < 60; tries++) {
        const z = (2 * rnd() - 1) * TUMBLE_TILT;
        const a = 2 * Math.PI * rnd();
        const r = Math.sqrt(1 - z * z);
        const m = 14 + 30 * rnd();
        w = [r * Math.cos(a) * m, r * Math.sin(a) * m, z * m];
        // The flight, step by step as stepDie flies it, to the first touch.
        let q = d.q;
        let pz = d.p[2];
        let vz = v[2];
        const turn = qAxisAngle(w, m * STEP_S);
        for (let t = 0; t < 2; t += STEP_S) {
            vz -= g * STEP_S;
            pz += vz * STEP_S;
            if (t >= at - 1e-9) q = qNorm(qMul(turn, q));
            if (vz < 0 && pz < reachBelow(q, s)) break;
        }
        const up = faceUp(q, d.labels);
        if (up.value === value && Math.acos(Math.min(1, up.n[2])) <= LEAN_MAX) break;
    }
    return { w, at };
}

/** The spin a die rolling at v along the table takes (rolling without slip). */
export const rollingSpin = (v: V3, s: number): V3 => mul(cross(UP, [v[0], v[1], 0]), 2 / s);

/** A tap's aim: the middle of the table, a little toward the viewer on a
 *  tall stage (the lower middle, where a phone's thumb is). */
export const tapAim = (tb: Table, tall: boolean): V3 => {
    const { mid, depth } = tableDepth(tb);
    return [0, mid + (tall ? 0.05 * depth : 0), 0];
};

/**
 * Throw the dice not held: toward the aim from where they lie (a tap), or
 * along a flick (table px/s). The spin is enough that the face a die lands
 * on is the throw's, not the hand's.
 */
export function throwDice(dice: Die[], tb: Table, opts: { tall?: boolean; flick?: V3; rnd?: () => number } = {}) {
    const rnd = opts.rnd ?? Math.random;
    const s = tb.side;
    const aim = tapAim(tb, opts.tall ?? false);
    const { depth } = tableDepth(tb);
    // The pair lands two tumbling dice apart: across the table, or where it
    // is too narrow for that (a phone held upright, the walls a die's width
    // off), one beyond the other. The die already on that side goes to it,
    // so their paths never cross.
    const narrow = tb.halfX - 0.55 * s < 1.5 * PAIR_GAP * s;
    const across = narrow ? 0 : PAIR_GAP * s;
    const along = narrow ? 0.8 * s : 0;
    const u: V3 = narrow ? [0, 1, 0] : [1, 0, 0];
    const leftmost = dice.length === 2 ? (dot(dice[0]!.p, u) <= dot(dice[1]!.p, u) ? 0 : 1) : -1;
    dice.forEach((d, i) => {
        if (d.phase === "held") return;
        let v: V3;
        if (opts.flick) {
            const sp = Math.hypot(opts.flick[0], opts.flick[1]);
            const cap = 14 * s;
            const k = sp > cap ? cap / sp : 1;
            v = [opts.flick[0] * k + (rnd() - 0.5) * 2 * s, opts.flick[1] * k + (rnd() - 0.5) * 2 * s, (5 + 2 * rnd()) * s];
        } else {
            const side = leftmost < 0 ? 0 : i === leftmost ? -1 : 1;
            // On a narrow table each die keeps to its own half across it (the
            // pair is laid along the depth), so their paths cannot cross.
            const tx = narrow
                ? 0.5 * d.p[0] + (rnd() - 0.5) * 0.3 * s
                : aim[0] + side * across + (rnd() - 0.5) * Math.max(0, Math.min(tb.halfX - 0.55 * s - across, 0.6 * s));
            const ty = aim[1] + side * along + (rnd() - 0.5) * 0.1 * depth;
            const dx = tx - d.p[0];
            const dy = ty - d.p[1];
            const dist = Math.hypot(dx, dy);
            const vz = (6 + 2 * rnd()) * s;
            // In the air for 2·vz/g: cover most of the way in the air, and the
            // felt takes the landing.
            const air = (2 * vz) / (GRAVITY_SIDES * s);
            const speed = Math.max(0.5 * s, (0.8 * dist) / air);
            const a = dist > 1 ? Math.atan2(dy, dx) : rnd() * Math.PI * 2;
            v = [Math.cos(a) * speed, Math.sin(a) * speed, vz];
        }
        // Two dice thrown from close together leave apart along that line,
        // and tumble once they have parted.
        const other = dice[1 - i];
        let wait = 0;
        if (other && other.phase !== "held" && leftmost >= 0) {
            const dd = Math.hypot(d.p[0] - other.p[0], d.p[1] - other.p[1]);
            if (dd < 2 * s) {
                const k = (i === leftmost ? -1 : 1) * (2 * s - dd) * 3;
                v = [v[0] + u[0] * k, v[1] + u[1] * k, v[2]];
                wait = TUMBLE_WAIT_S;
            }
        }
        // Off the table, so the first frame is in the air.
        d.p[2] = Math.max(d.p[2], s * 0.62);
        launch(d, v, [0, 0, 0], landingTumble(d, v, tb, wait, rnd));
    });
}
