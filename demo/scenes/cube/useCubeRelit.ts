import { computed, type Ref } from "vue";

import type { TransformState } from "./orbital-drag";
import { clamp } from "@mkbabb/value.js/math";

/**
 * L.W11.S2 — the orientation-coupled RE-LIT die (the cube scene's instrument
 * egg), extracted from CubeTarget.vue as a colocated sub-unit (the demo
 * ≤500L-per-file decomposition discipline; proof:demo-no-oversize). The light
 * is PINNED in the room; the cube turns under it — faces toward the key light
 * brighten and catch a thin specular, faces away sink into a --background veil.
 *
 * It rides the LIVE transform model OrbitalDrag publishes per rotation
 * (syncRotationToModel) — a pure reactive `computed` off
 * `transform.value.rotate`, NOT a second rAF (inv ζ). The crayon hue is never
 * touched: the published `--lit` channel modulates LUMINANCE only
 * (proof:crayon-preserved unaffected).
 *
 * kf-CubeTarget #4/#56 — THE ROOM FRAME, STATED. "Pinned in the room" is a
 * claim about two frames, and the model needs both to keep it:
 *
 *  · #4 — the die's frame is the CSS frame, where **+Y points DOWN the screen**
 *    (derived from CubeTarget.css's own face rules: `.top` is `rotateX(90deg)`,
 *    whose outward normal is `[0,-1,0]`, and FACE_NORMALS says exactly that).
 *    A key light with **+0.6** on Y therefore shone UP FROM BENEATH, resting the
 *    top face at 0.20 and the bottom at 0.80 — the model inverted its own sign.
 *  · #56 — `.cube` is not a child of the room: it hangs under `.graph`, which the
 *    scene parks at `rotate3d(-1, 1, 0, 30deg)` on mount. A normal rotated by the
 *    model's Euler triple alone is still in the GRAPH's frame, ~30° from the
 *    room's, so the "pinned" light was pinned to the graph. The attitude is now a
 *    REQUIRED PARAMETER — the caller states the stage its die hangs on — and the
 *    normal is carried the last hop into the room before it meets the light. The
 *    sign fix alone does not close this: it fixes the model's frame, not the
 *    screen's.
 */

// The pinned key light (up-and-right-and-toward-viewer) in the ROOM frame,
// normalized once. Y is NEGATIVE because up-the-screen is −Y here (#4).
const KEY_LIGHT = (() => {
    const v = [0.45, -0.6, 0.66];
    const m = Math.hypot(v[0]!, v[1]!, v[2]!);
    return [v[0]! / m, v[1]! / m, v[2]! / m] as const;
})();

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
 * lands in this frame, not the room's. Three consumers read it — the scene's
 * eased intro keyframe, its PRM snap (`useCubeDemo`), and the room hop below —
 * so it is authored ONCE and never re-spelled. It lives here, with the geometry
 * that needs it, so nothing that only wants a frame has to load the engine.
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

/** The six facet outward normals in the cube's local frame (rest pose: front
 *  toward +Z, the screen). Index-aligned to the cubeSides order. */
export const FACE_NORMALS: ReadonlyArray<readonly [number, number, number]> = [
    [0, 0, 1], // front  — +Z
    [1, 0, 0], // right  — +X
    [0, 0, -1], // back  — −Z
    [-1, 0, 0], // left  — −X
    [0, -1, 0], // top   — −Y
    [0, 1, 0], // bottom — +Y
];

/**
 * Rotate a local face normal by the die's current Euler triple (Rx·Ry·Rz, the
 * demo's quaternion↔Euler convention), then by the stage attitude its `.graph`
 * ancestor is parked at (#56), landing the normal in the ROOM frame — then dot
 * with the pinned key light → a clamped 0…1 "litness". Mapped with a soft
 * ambient floor so a shadowed face never goes fully black (a re-light, not an
 * extinguish).
 */
function litFor(
    n: readonly number[],
    r: { x: number; y: number; z: number },
    graphAttitude: GraphAttitude,
) {
    const rx = r.x * DEG;
    const ry = r.y * DEG;
    const rz = r.z * DEG;
    let x = n[0]!;
    let y = n[1]!;
    let z = n[2]!;
    // Rz
    let c = Math.cos(rz);
    let s = Math.sin(rz);
    [x, y] = [x * c - y * s, x * s + y * c];
    // Ry
    c = Math.cos(ry);
    s = Math.sin(ry);
    [x, z] = [x * c + z * s, -x * s + z * c];
    // Rx
    c = Math.cos(rx);
    s = Math.sin(rx);
    [y, z] = [y * c - z * s, y * s + z * c];
    // The last hop: the graph's own attitude, into the room the light is in.
    const [rx3, ry3, rz3] = rotateByAttitude([x, y, z], graphAttitude);
    const d = rx3 * KEY_LIGHT[0] + ry3 * KEY_LIGHT[1] + rz3 * KEY_LIGHT[2];
    return clamp(0.5 + 0.5 * d, 0, 1);
}

export function useCubeRelit(
    transform: Ref<TransformState>,
    /** The attitude the die's `.graph` ancestor is parked at. REQUIRED (#56):
     *  a lighting model that cannot see the stage cannot pin a light to a room. */
    graphAttitude: GraphAttitude,
) {
    // Per-face --lit (string for the inline style binding), recomputed reactively
    // off the live rotation — no second rAF.
    //
    // T.A5 — QUANTIZE to skip no-op repaints. Each per-face `--lit` write triggers
    // a `color-mix` + two-gradient repaint (.face-relit). The former `toFixed(3)`
    // produced a distinct 0…1 string on nearly every rotation tick, so a fine orbit
    // drag fired a per-face style INVALIDATION on essentially every pointermove.
    // Rounding to `toFixed(2)` collapses the high-frequency fine ticks of a real
    // drag onto the same rounded string, so Vue's `style.setProperty('--lit', …)`
    // re-set is a NO-OP the browser skips (setting a custom property to its current
    // value does not invalidate) — an order-of-magnitude fewer real repaints during
    // an orbit. The 1% luminance step is imperceptible, so the capture is unchanged.
    const faceLit = computed(() =>
        FACE_NORMALS.map((n) =>
            litFor(n, transform.value.rotate, graphAttitude).toFixed(2),
        ),
    );

    return { faceLit };
}
