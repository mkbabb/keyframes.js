/**
 * The pose the orbit SHOWS, read off its container's transform (K4: the frame
 * writes `style.transform` straight from the state; the model catches up when
 * the die rests). Per-frame readings take this; at rest it equals the model.
 */
import { rotateVec, type Quat } from "../../../demo/scenes/cube/orbital-drag/arcball";
import { attitudeQuat } from "../../../demo/scenes/cube/graphAttitude";

const G = attitudeQuat();

export interface ShownPose {
    quaternion: Quat;
    /** The pan in screen px (the container renders G⁻¹·t). */
    translate: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
}

export const shown = (el: HTMLElement): ShownPose => {
    const tf = el.style.transform;
    const num = (re: RegExp) => (re.exec(tf)?.slice(1) ?? []).map(Number);
    const [tx = 0, ty = 0, tz = 0] = num(/translate3d\(([-\d.e]+)px,\s*([-\d.e]+)px,\s*([-\d.e]+)px\)/);
    const [ax = 0, ay = 0, az = 1, deg = 0] = num(/rotate3d\(([-\d.e]+),\s*([-\d.e]+),\s*([-\d.e]+),\s*([-\d.e]+)deg\)/);
    const [s = 1] = num(/scale3d\(([-\d.e]+),/);
    const n = Math.hypot(ax, ay, az) || 1;
    const h = (deg * Math.PI) / 360;
    // Read back through G: snap the rotation's float noise (≤ 1e-9 px) to 0.
    const t = rotateVec(G, [tx, ty, tz]).map((v) => (Math.abs(v) < 1e-9 ? 0 : v));
    return {
        quaternion: [(ax / n) * Math.sin(h), (ay / n) * Math.sin(h), (az / n) * Math.sin(h), Math.cos(h)],
        translate: { x: t[0]!, y: t[1]!, z: t[2]! },
        scale: { x: s, y: s, z: s },
    };
};
