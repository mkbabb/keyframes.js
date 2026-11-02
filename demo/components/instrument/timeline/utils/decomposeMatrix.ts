// SERVED MODEL: claude-opus-5-5
/**
 * The hover preview's matrix decomposition — kf-owned, demo-side.
 *
 * value.js 4.1.0 retired its `decomposeMatrix2D` / `decomposeMatrix3D` / `Mat4`
 * family (X-W9 G27, "no shim, no forwarding export"), and this component was its
 * only consumer anywhere (O-117). The ghost reads a UA-normalised `matrix()` /
 * `matrix3d()` and needs exactly two things from it: the linear part's rotation
 * and its scale (and, in 2D, the skew). Translation is dropped on purpose and
 * perspective is not represented (a plate is not a stage), so neither is
 * computed here — this is the decomposition the ghost READS, not a general
 * transform library.
 */

export type GhostDecomposition2D = Readonly<{
    scaleX: number;
    scaleY: number;
    /** radians */
    angle: number;
    /** tan(skew angle) */
    skew: number;
}>;

export type GhostDecomposition3D = Readonly<{
    scale: readonly [x: number, y: number, z: number];
    /** unit quaternion [x, y, z, w] */
    quaternion: readonly [x: number, y: number, z: number, w: number];
}>;

type Vec3 = [number, number, number];

const EPSILON = 1e-12;

const dot = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const length = (a: Vec3): number => Math.sqrt(dot(a, a));
const scaled = (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k];
const minus = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: Vec3, b: Vec3): Vec3 => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
];

/**
 * `matrix(a, b, c, d, e, f)` → rotation · skewX · scale, per CSSOM View §15.1
 * (the "unmatrix" 2D steps; `e`/`f` are the translation the ghost drops).
 */
export function decomposeMatrix2D(
    a: number,
    b: number,
    c: number,
    d: number,
): GhostDecomposition2D {
    let [r0x, r0y, r1x, r1y] = [a, b, c, d];

    let scaleX = Math.sqrt(r0x * r0x + r0y * r0y);
    if (scaleX !== 0) [r0x, r0y] = [r0x / scaleX, r0y / scaleX];

    let skew = r0x * r1x + r0y * r1y;
    [r1x, r1y] = [r1x - r0x * skew, r1y - r0y * skew];

    const scaleY = Math.sqrt(r1x * r1x + r1y * r1y);
    if (scaleY !== 0) {
        [r1x, r1y] = [r1x / scaleY, r1y / scaleY];
        skew /= scaleY;
    }

    if (r0x * r1y - r0y * r1x < 0) {
        scaleX = -scaleX;
        [r0x, r0y] = [-r0x, -r0y];
    }

    return { scaleX, scaleY, angle: Math.atan2(r0y, r0x), skew };
}

/**
 * `matrix3d(…16)` (column-major, CSS parameter order) → scale + rotation
 * quaternion, by the CSS Transforms "unmatrix" Gram–Schmidt steps.
 *
 * `null` when there is no rotation to read: a wrong arity, a zero `m44`, or a
 * degenerate (non-invertible) linear part — a zero scale on any axis, where the
 * normalisation would otherwise write `NaN` into the wrapper's style.
 */
export function decomposeMatrix3D(values: readonly number[]): GhostDecomposition3D | null {
    if (values.length !== 16) return null;
    const w = values[15]!;
    if (Math.abs(w) < EPSILON) return null;
    const m = values.map((v) => v / w);

    let row0: Vec3 = [m[0]!, m[1]!, m[2]!];
    let row1: Vec3 = [m[4]!, m[5]!, m[6]!];
    let row2: Vec3 = [m[8]!, m[9]!, m[10]!];

    const scaleX = length(row0);
    if (scaleX < EPSILON) return null;
    row0 = scaled(row0, 1 / scaleX);

    row1 = minus(row1, scaled(row0, dot(row0, row1)));
    const scaleY = length(row1);
    if (scaleY < EPSILON) return null;
    row1 = scaled(row1, 1 / scaleY);

    row2 = minus(row2, scaled(row0, dot(row0, row2)));
    row2 = minus(row2, scaled(row1, dot(row1, row2)));
    const scaleZ = length(row2);
    if (scaleZ < EPSILON) return null;
    row2 = scaled(row2, 1 / scaleZ);

    // A coordinate-system flip negates the basis (and so the rotation), never
    // the reported scale — the unmatrix convention.
    if (dot(row0, cross(row1, row2)) < 0) {
        row0 = scaled(row0, -1);
        row1 = scaled(row1, -1);
        row2 = scaled(row2, -1);
    }

    return {
        scale: [scaleX, scaleY, scaleZ],
        quaternion: quaternionOf(row0, row1, row2),
    };
}

/** The rotation whose basis columns are `c0`, `c1`, `c2`, as `[x, y, z, w]`. */
function quaternionOf(c0: Vec3, c1: Vec3, c2: Vec3) {
    const [m00, m10, m20] = c0;
    const [m01, m11, m21] = c1;
    const [m02, m12, m22] = c2;
    const trace = m00 + m11 + m22;

    if (trace > 0) {
        const s = 0.5 / Math.sqrt(trace + 1);
        return [(m21 - m12) * s, (m02 - m20) * s, (m10 - m01) * s, 0.25 / s] as const;
    }
    if (m00 > m11 && m00 > m22) {
        const s = 2 * Math.sqrt(1 + m00 - m11 - m22);
        return [0.25 * s, (m01 + m10) / s, (m02 + m20) / s, (m21 - m12) / s] as const;
    }
    if (m11 > m22) {
        const s = 2 * Math.sqrt(1 + m11 - m00 - m22);
        return [(m01 + m10) / s, 0.25 * s, (m12 + m21) / s, (m02 - m20) / s] as const;
    }
    const s = 2 * Math.sqrt(1 + m22 - m00 - m11);
    return [(m02 + m20) / s, (m12 + m21) / s, 0.25 * s, (m10 - m01) / s] as const;
}
