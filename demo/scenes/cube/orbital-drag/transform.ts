// SERVED MODEL: claude-opus-5-5
// The orbital transform model: the axis tuple, the transform and bounds shapes
// and their defaults. A leaf module: OrbitalDrag.vue and its composables import
// it directly and never import their own barrel (index.ts), which re-exports it
// beside the SFC.
import { mat4 } from "gl-matrix";
import type { Quat } from "./arcball";
import type { Box } from "./similarity";

export const axes = ["x", "y", "z"] as const;

export interface TransformState {
    /** The Y·X·Z Euler READOUT of `quaternion` (degrees, unwrapped through a
     *  gesture). An external write here is re-seeded into the quaternion. */
    rotate: {
        x: number;
        y: number;
        z: number;
    };
    /** KF-M2 — the attitude itself, `[x, y, z, w]`, the stored truth. The
     *  readout is derived from it, never the other way, and home ↔ cube carries
     *  it whole (no lossy Euler hop). Optional so a hand-built state without it
     *  re-seeds from `rotate`. */
    quaternion?: Quat;
    /** The pan, in SCREEN px (rendered as translate3d(G⁻¹·t), so the subject
     *  moves exactly as far as the hand on screen). */
    translate: {
        x: number;
        y: number;
        z: number;
    };
    scale: {
        x: number;
        y: number;
        z: number;
    };
    matrix: mat4;
}

/**
 * What the orbit may reach: the zoom range, and the visible-stage box V the
 * subject's projected centre stays inside (KF-M1). `stage` is read once per
 * gesture anchor, never per frame.
 */
export interface TransformBounds {
    scale: [number, number];
    stage?: () => Box | null;
}

export const defaultTransformState: TransformState = {
    rotate: {
        x: 0,
        y: 0,
        z: 0,
    },
    quaternion: [0, 0, 0, 1],
    translate: {
        x: 0,
        y: 0,
        z: 0,
    },
    scale: {
        x: 1,
        y: 1,
        z: 1,
    },
    matrix: mat4.create(),
};

export const defaultTransformBounds: TransformBounds = {
    scale: [0.4, 3],
};
