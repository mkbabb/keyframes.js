export { default as OrbitalDrag } from "./OrbitalDrag.vue";

export const axes = ["x", "y", "z"] as const;

export interface TransformState {
    rotate: {
        x: number;
        y: number;
        z: number;
    };
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
}

export interface VelocityState {
    rotate: {
        x: number;
        y: number;
        z: number;
    };
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
}

export const defaultTransformState: TransformState = {
    rotate: {
        x: 0,
        y: 0,
        z: 0,
    },
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
};

export const defaultVelocityState: VelocityState = {
    rotate: {
        x: 0,
        y: 0,
        z: 0,
    },
    translate: {
        x: 0,
        y: 0,
        z: 0,
    },
    scale: {
        x: 0,
        y: 0,
        z: 0,
    },
};
