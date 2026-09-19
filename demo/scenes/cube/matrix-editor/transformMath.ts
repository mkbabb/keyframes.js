import type { CssCall, CssList, CssScalar, CssValue } from "@mkbabb/value.js/value";
import { mat4 } from "gl-matrix";

/* ── The cube scene's ONE set of structural CSS-value builders ──────────────
   Every cube surface that authors a `transform` for the engine's COMPILE path
   builds it here: `useCubeDemo`'s rotation + graph-attitude channels and
   `CubeTarget`'s roll egg. Authoring a nested plain object instead (the shape
   `{ transform: { rotateX, rotateY } }`) flattens to the dotted property names
   `transform.rotateX` / `transform.rotateY`, which CSSOM's `setProperty`
   discards without a throw — kf-CubeTarget #2, the Roll's dead paint. One
   builder set, one supported property name. */

export const numberValue = (value: number, unit = ""): CssScalar => ({
    kind: "scalar",
    payload: { type: "number", value, unit },
});

export const transformCall = (name: string, ...args: CssValue[]): CssCall => ({
    kind: "call",
    name,
    args,
});

export const transformList = (...items: CssCall[]): CssList => ({
    kind: "list",
    separator: "space",
    items,
});

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
    // The args stay the OPEN `CssValue` union, deliberately: `matrixValueAt`
    // (`:91-103`) exists to REJECT a non-scalar arg, and
    // `test/demo/scenes/cube-scene.test.ts:118-122` proves that rejection by
    // authoring a `var()` arg — a narrowed `args` would make the guard's own
    // falsifier inexpressible. Readers that KNOW their matrix came from
    // `createMatrix` say so at their own site (MatrixEditor.vue).
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

/**
 * kf-CubeTarget #53 — the SERIALIZED form of an authored matrix, for the one
 * consumer that paints a snapshot rather than compiling a keyframe: the demo's
 * direct `transformTargetsStyle({ transform }, targets)` call.
 *
 * `transformTargetsStyle` writes `style.setProperty(property, String(value))`
 * and SKIPS any value that is an object (`compile/value/compile.ts` — the
 * `typeof value === "object"` continue). A `Matrix3dCall` IS an object, so
 * handing it whole means the write is dropped on every target, every call — the
 * die's only pre-start orientation writer never painting anything. The compile
 * path (`fromVars`) is unaffected: it flattens the AST to serialized leaves
 * itself, which is why `useCubeDemo` keeps handing it the structural call.
 *
 * The args are already validated by `matrixValues` (finite, unitless, arity 16),
 * so serializing here is a formatting act, not a trust boundary.
 */
export const matrix3dCss = (matrix: Matrix3dCall): string =>
    `matrix3d(${matrixValues(matrix).join(", ")})`;

/* ── ME-42/ME-11 — THE DIGIT POLICY, stated for BOTH representations ────────
   The matrix field has no model behind it: its rendered text IS its editable
   state, and the commit re-parses whatever that text became. A single 2-dp
   formatter therefore governed the DISPLAY and the WRITE path at once, so
   touching a cell holding `0.7071067811865476` silently re-committed a value
   derived from `"0.71"`. The two representations are named separately here, in
   the module that owns matrix values, so the policy is one readable pair rather
   than an expression inlined in a template. */

/** At rest: two decimals, the tabular column the 4×4 lattice reads as a grid. */
export const matrixCellDisplayText = (value: number): string =>
    (Math.round(value * 100) / 100).toFixed(2).replace(/\.0*$/, "");

/** While edited (and in the cell's `title`): the cell's FULL stored precision,
 *  so an edit opens on the true value and a committed-unchanged field
 *  round-trips exactly. */
export const matrixCellEditText = (value: number): string => String(value);

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
