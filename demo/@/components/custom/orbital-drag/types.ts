export interface GestureEvent extends Event {
    screenX: number;
    screenY: number;
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
