import { mat4 } from "gl-matrix";

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
    matrix: mat4;
}

export interface TransformBounds {
    rotate: {
        x: [number, number];
        y: [number, number];
        z: [number, number];
    };
    translate: {
        x: [number, number];
        y: [number, number];
        z: [number, number];
    };
    scale: {
        x: [number, number];
        y: [number, number];
        z: [number, number];
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
    matrix: mat4.create(),
};

export const defaultTransformBounds = {
    rotate: {
        x: [-Infinity, Infinity],
        y: [-Infinity, Infinity],
        z: [-Infinity, Infinity],
    },
    translate: {
        x: [-Infinity, Infinity],
        y: [-Infinity, Infinity],
        z: [-Infinity, Infinity],
    },
    scale: {
        x: [0.1, Infinity],
        y: [0.1, Infinity],
        z: [0.1, Infinity],
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
