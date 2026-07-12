import { clamp } from "@mkbabb/value.js";
import { quat } from "gl-matrix";

// Pure quaternion ↔ Euler-degree conversion — the orbital drag's source-of-truth
// is the quaternion (gimbal-free accumulation); the Euler triple is the v-model
// surface (per-axis sliders + the share hash). Both directions use the
// `Rx · Ry · Rz` convention `useTransformState` consumes (see the Euler note in
// demo component docs). No Vue/component dependency — colocated
// math, kept out of the SFC.

const RAD2DEG = 180 / Math.PI;
const DEG2RAD = Math.PI / 180;

/** Extract the `Rx·Ry·Rz` Euler triple (degrees) from a quaternion. */
export const quaternionToEulerDegrees = (q: quat) => {
    const [x = 0, y = 0, z = 0, w = 0] = q;
    const x2 = x + x,
        y2 = y + y,
        z2 = z + z;
    const xx = x * x2,
        xy = x * y2,
        xz = x * z2;
    const yy = y * y2,
        yz = y * z2,
        zz = z * z2;
    const wx = w * x2,
        wy = w * y2,
        wz = w * z2;
    const r00 = 1 - (yy + zz);
    const r01 = xy - wz;
    const r02 = xz + wy;
    const r11 = 1 - (xx + zz);
    const r12 = yz - wx;
    const r21 = yz + wx;
    const r22 = 1 - (xx + yy);
    const sy = clamp(r02, -1, 1);
    const ey = Math.asin(sy);
    let ex: number, ez: number;
    if (Math.abs(sy) < 0.9999) {
        ex = Math.atan2(-r12, r22);
        ez = Math.atan2(-r01, r00);
    } else {
        ex = Math.atan2(r21, r11);
        ez = 0;
    }
    return { x: ex * RAD2DEG, y: ey * RAD2DEG, z: ez * RAD2DEG };
};

/** Re-seed `out` from an `Rx·Ry·Rz` Euler triple (degrees). Returns `out`. */
export const eulerDegreesToQuaternion = (
    out: quat,
    x: number,
    y: number,
    z: number,
): quat => {
    const qx = quat.create();
    quat.setAxisAngle(qx, [1, 0, 0], x * DEG2RAD);
    const qy = quat.create();
    quat.setAxisAngle(qy, [0, 1, 0], y * DEG2RAD);
    const qz = quat.create();
    quat.setAxisAngle(qz, [0, 0, 1], z * DEG2RAD);
    quat.multiply(out, qx, qy);
    return quat.multiply(out, out, qz);
};
