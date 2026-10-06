/**
 * The cube stage's parked attitude, single-sourced (#56), and the rotation that
 * carries a vector into it.
 *
 * X-DS pass 1 (KF-P1-02) — this module was `useCubeRelit.ts`, the L.W11.S2
 * orientation-coupled re-lit die (a key light pinned in the room, per-face
 * `--lit` driving a specular sweep and a --background veil). The re-light is
 * DELETED with the lit-lacquer material it fed: the die's faces are flat
 * crayons with a fixed per-face tonal step (CubeTarget.css), the ORIGIN die.
 * What survives is the geometry other units read: the attitude `.graph` is
 * parked at and its Rodrigues rotation.
 */

const DEG = Math.PI / 180;

/** The attitude an ancestor stage is parked at, as CSS authors it: an axis and
 *  an angle in degrees (`rotate3d(x, y, z, Ndeg)`). */
export type GraphAttitude = Readonly<{
    axis: readonly [number, number, number];
    angleDeg: number;
}>;

/**
 * #56 — THE STAGE ATTITUDE, single-sourced. `.graph` is parked here on mount,
 * and it is an ANCESTOR of `.cube`: everything the die's own model computes
 * lands in this frame, not the room's. Its consumers read it — the scene's
 * eased intro keyframe, its PRM snap (`useCubeDemo`), and the axis-reveal
 * geometry's frame stamp —
 * so it is authored ONCE and never re-spelled. It lives in its own module so
 * nothing that only wants a frame has to load the engine.
 */
export const GRAPH_ATTITUDE: GraphAttitude = {
    axis: [-1, 1, 0],
    angleDeg: 30,
};

/** The attitude as CSS authors it — the PRM arm writes this string directly. */
export const graphAttitudeCss = (attitude: GraphAttitude = GRAPH_ATTITUDE) =>
    `rotate3d(${attitude.axis[0]}, ${attitude.axis[1]}, ${attitude.axis[2]}, ${attitude.angleDeg}deg)`;

/**
 * Rodrigues rotation of `v` about `attitude.axis` by `attitude.angleDeg`, in the
 * same right-handed convention the Euler block below uses (and that gl-matrix's
 * `fromXRotation`/`fromYRotation`/`fromZRotation` and `quaternionEuler` share).
 * A zero-length axis or a zero angle is the identity.
 */
export function rotateByAttitude(
    v: readonly [number, number, number],
    attitude: GraphAttitude,
): [number, number, number] {
    const [ax, ay, az] = attitude.axis;
    const m = Math.hypot(ax, ay, az);
    if (m === 0 || attitude.angleDeg === 0) return [v[0], v[1], v[2]];
    const kx = ax / m;
    const ky = ay / m;
    const kz = az / m;
    const a = attitude.angleDeg * DEG;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const dot = kx * v[0] + ky * v[1] + kz * v[2];
    const crossX = ky * v[2] - kz * v[1];
    const crossY = kz * v[0] - kx * v[2];
    const crossZ = kx * v[1] - ky * v[0];
    return [
        v[0] * c + crossX * s + kx * dot * (1 - c),
        v[1] * c + crossY * s + ky * dot * (1 - c),
        v[2] * c + crossZ * s + kz * dot * (1 - c),
    ];
}
