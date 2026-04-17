import { FunctionValue, ValueUnit } from "@mkbabb/value.js";
import { mat4 } from "gl-matrix";

export const MATRIX_AXES = ["x", "y", "z", "w"];

export const transformSliderOptions = {
    translate: {
        bounds: [-1000, 1000] as [number, number],
        step: 1,
        value: 0,
    },
    rotate: {
        bounds: [-360, 360] as [number, number],
        step: 1,
        value: 0,
    },
    scale: {
        bounds: [0.4, 3] as [number, number],
        step: 0.01,
        value: 1,
    },
};

export interface MatrixCellMeta {
    axis: string;
    transform: string;
    sliderOptions: { bounds: [number, number]; step: number };
}

export const createMatrix = () =>
    new FunctionValue(
        "matrix3d",
        [...mat4.create()].map((v) => new ValueUnit(v)),
    );

export const getAxisFromIx = (i: number): string =>
    MATRIX_AXES[i % MATRIX_AXES.length] ?? "x";

export const getTransformFromIx = (i: number) => {
    if (i === 12 || i === 13 || i === 14) return "T";
    if (i === 0 || i === 5 || i === 10) return "S";
    if (i === 3 || i === 7 || i === 11) return "P";
    return "";
};

export const getSliderOptionsFromIx = (i: number) => {
    const transform = getTransformFromIx(i);
    const key =
        transform === "T"
            ? "translate"
            : transform === "S"
              ? "scale"
              : "rotate";
    return transformSliderOptions[key];
};
