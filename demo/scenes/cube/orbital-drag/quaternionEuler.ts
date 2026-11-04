// SERVED MODEL: claude-opus-5-5
import { foldDegrees, quatFromAxisAngle, quatMultiply, unwrapDegrees } from "./arcball";
import type { Quat } from "./arcball";

/**
 * The Euler READOUT of the orbit's quaternion (KF-M2, D-16). The quaternion is
 * the truth; the triple is only what the matrix readout and the v-model show.
 *
 * Order Y·X·Z (R = Ry·Rx·Rz; the builder is q = q_y·q_x·q_z). The former
 * Rx·Ry·Rz put the singularity on yaw, the commonest drag, so a horizontal
 * spin folded y at ±81° and flipped x and z by 180°. Y·X·Z puts it on pitch,
 * and the readout carries it continuously:
 *   - each angle is unwrapped onto the turn nearest the previous reading;
 *   - of the two Euler solutions, (Y, X, Z) and (Y+180, 180−X, Z+180), the one
 *     nearest the previous reading is kept, so a pitch through 90° runs on
 *     (91°, 92°, …) instead of flipping Y and Z by a half turn;
 *   - at the pole itself only Y∓Z is defined, so Z holds its previous value and
 *     Y takes the rest.
 */

const RAD2DEG = 180 / Math.PI;
const DEG2RAD = Math.PI / 180;

export type EulerDegrees = { x: number; y: number; z: number };

/** cos X below which the pole formulas take over (|r12| > 1 − 1e-12). The band
 *  is kept this narrow so the readout stays an exact spelling of q: holding Z
 *  is only exact where X is ±90° to working precision. */
const POLE_EPS = 1e-12;

/** Build q = q_y · q_x · q_z from a Y·X·Z triple (degrees). */
export const eulerDegreesToQuaternion = (x: number, y: number, z: number): Quat =>
    quatMultiply(
        quatMultiply(quatFromAxisAngle([0, 1, 0], y * DEG2RAD), quatFromAxisAngle([1, 0, 0], x * DEG2RAD)),
        quatFromAxisAngle([0, 0, 1], z * DEG2RAD),
    );

const cost = (a: EulerDegrees, b: EulerDegrees) =>
    Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);

const unwrapTriple = (e: EulerDegrees, prev: EulerDegrees): EulerDegrees => ({
    x: unwrapDegrees(e.x, prev.x),
    y: unwrapDegrees(e.y, prev.y),
    z: unwrapDegrees(e.z, prev.z),
});

/**
 * Read the Y·X·Z triple (degrees) off a unit quaternion, continuous with
 * `prev` (the last reading; identity when omitted).
 */
export const quaternionToEulerDegrees = (
    q: Readonly<Quat>,
    prev: EulerDegrees = { x: 0, y: 0, z: 0 },
): EulerDegrees => {
    const [x, y, z, w] = q;
    const r00 = 1 - 2 * (y * y + z * z);
    const r01 = 2 * (x * y - w * z);
    const r02 = 2 * (x * z + w * y);
    const r10 = 2 * (x * y + w * z);
    const r11 = 1 - 2 * (x * x + z * z);
    const r12 = 2 * (y * z - w * x);
    const r22 = 1 - 2 * (x * x + y * y);

    const s = Math.min(1, Math.max(-1, -r12));
    if (Math.abs(r12) > 1 - POLE_EPS) {
        // The pole: X = ±90°, and only Y − Z (at +90°) or Y + Z (at −90°) is
        // defined. Z holds; Y takes the remainder.
        const zPrev = prev.z;
        const X = s > 0 ? 90 : -90;
        const Y =
            s > 0
                ? zPrev + Math.atan2(r01, r00) * RAD2DEG
                : Math.atan2(-r01, r00) * RAD2DEG - zPrev;
        return unwrapTriple({ x: X, y: Y, z: zPrev }, prev);
    }

    const X = Math.asin(s) * RAD2DEG;
    const Y = Math.atan2(r02, r22) * RAD2DEG;
    const Z = Math.atan2(r10, r11) * RAD2DEG;
    const a = unwrapTriple({ x: X, y: Y, z: Z }, prev);
    const b = unwrapTriple({ x: (X >= 0 ? 180 : -180) - X, y: Y + 180, z: Z + 180 }, prev);
    return cost(b, prev) < cost(a, prev) ? b : a;
};

/** Fold each angle back inside one turn (gesture end only). */
export const foldEulerDegrees = (e: EulerDegrees): EulerDegrees => ({
    x: foldDegrees(e.x),
    y: foldDegrees(e.y),
    z: foldDegrees(e.z),
});
