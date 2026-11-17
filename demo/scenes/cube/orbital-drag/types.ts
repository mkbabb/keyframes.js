import type { Quat } from "./arcball";

export interface GestureEvent extends Event {
    screenX: number;
    screenY: number;
    /** Where the gesture is (client px; WebKit's GestureEvent carries it). */
    clientX: number;
    clientY: number;
    scale: number;
    rotation: number;
}

export type PressedKeys = {
    x: boolean;
    y: boolean;
    z: boolean;
    shift: boolean;
    ctrl: boolean;
    meta: boolean;
};

/** A pose the orbit's spring travels to (KF-URL): attitude, pan (px), zoom. */
export type OrbitPose = { q: Quat; t: { x: number; y: number }; s: number };
