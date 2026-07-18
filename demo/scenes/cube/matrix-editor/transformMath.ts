import type { CssCall, CssScalar, CssValue } from "@mkbabb/value.js/value";
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

export type MatrixScalar = Readonly<{
    kind: "scalar";
    payload: Readonly<{
        type: "number";
        value: number;
        unit: "";
    }>;
}>;

export type Matrix3dCall = Readonly<{
    kind: "call";
    name: "matrix3d";
    args: readonly CssValue[];
}>;

export type MatrixValues = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
];

const matrixScalar = (value: number): MatrixScalar => ({
    kind: "scalar",
    payload: { type: "number", value, unit: "" },
});

export const createMatrix = (
    values: ArrayLike<number> = mat4.create(),
): Matrix3dCall => {
    if (values.length !== 16) {
        throw new RangeError(
            `matrix3d requires 16 arguments; received ${values.length}.`,
        );
    }
    const numeric = Array.from(values);
    const invalid = numeric.findIndex((value) => !Number.isFinite(value));
    if (invalid !== -1) {
        throw new TypeError(
            `matrix3d argument ${invalid} must be a finite number.`,
        );
    }
    return {
        kind: "call",
        name: "matrix3d",
        args: numeric.map(matrixScalar),
    };
};

const matrixValueAt = (matrix: Matrix3dCall, index: number): number => {
    const argument = matrix.args[index];
    if (
        argument?.kind !== "scalar" ||
        argument.payload.type !== "number" ||
        argument.payload.unit !== "" ||
        !Number.isFinite(argument.payload.value)
    ) {
        throw new TypeError(
            `matrix3d argument ${index} must be a finite unitless number.`,
        );
    }
    return argument.payload.value;
};

export const matrixValues = (matrix: Matrix3dCall): MatrixValues => {
    if (matrix.args.length !== 16) {
        throw new RangeError(
            `matrix3d requires 16 arguments; received ${matrix.args.length}.`,
        );
    }
    return [
        matrixValueAt(matrix, 0),
        matrixValueAt(matrix, 1),
        matrixValueAt(matrix, 2),
        matrixValueAt(matrix, 3),
        matrixValueAt(matrix, 4),
        matrixValueAt(matrix, 5),
        matrixValueAt(matrix, 6),
        matrixValueAt(matrix, 7),
        matrixValueAt(matrix, 8),
        matrixValueAt(matrix, 9),
        matrixValueAt(matrix, 10),
        matrixValueAt(matrix, 11),
        matrixValueAt(matrix, 12),
        matrixValueAt(matrix, 13),
        matrixValueAt(matrix, 14),
        matrixValueAt(matrix, 15),
    ];
};

export const withMatrixCell = (
    matrix: Matrix3dCall,
    index: number,
    value: number,
): Matrix3dCall => {
    const values = matrixValues(matrix);
    if (!Number.isInteger(index) || index < 0 || index >= values.length) {
        throw new RangeError(
            `Matrix cell ${index} is outside the matrix3d value.`,
        );
    }
    if (!Number.isFinite(value)) {
        throw new TypeError(`Matrix cell ${index} must be a finite number.`);
    }
    values[index] = value;
    return createMatrix(values);
};

export const cssVariable = (name: string): CssCall => ({
    kind: "call",
    name: "var",
    args: [
        {
            kind: "scalar",
            payload: { type: "keyword", value: name },
        } satisfies CssScalar,
    ],
});

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
