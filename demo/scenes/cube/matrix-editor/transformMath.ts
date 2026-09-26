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

/* X.KF.W13X.matrix (UIA-KF-162 · UIA-KF-265) — a slider range per cell ROLE.
   A matrix3d argument is a unitless matrix entry except the translation column
   (px). The former table offered three presets and mapped every cell that was
   not T or S onto `rotate` (±360 DEGREES), so a perspective cell (a divisor term,
   useful near ±0.005) or a shear/rotation entry (cos/sin magnitudes, ±1) moved
   the die by a whole distortion per slider step; and translate was a fixed
   ±1000 px that let the die leave a 390 px stage. The ranges now follow what
   each entry IS, and the translate range is DERIVED from the stage it paints
   into (`translateBounds`). */
export const matrixSliderOptions = {
    scale: { bounds: [0.4, 3] as [number, number], step: 0.01 },
    shear: { bounds: [-1, 1] as [number, number], step: 0.01 },
    perspective: { bounds: [-0.005, 0.005] as [number, number], step: 0.0001 },
    divisor: { bounds: [0.4, 3] as [number, number], step: 0.01 },
};

/** The stage the Matrix channel paints into, measured by `useTransformState`:
 *  the stage region's half extents and the die's side, in CSS px. */
export interface StageExtent {
    halfWidth: number;
    halfHeight: number;
    side: number;
}

/**
 * The translate range for one axis: the die may travel until its face reaches
 * the stage's edge — the half-extent less the die's half side — and on z (which
 * has no stage edge) one die-length toward or away from the viewer. An
 * unmeasured stage offers no travel: a range is never invented without the
 * extent it is derived from.
 */
export const translateBounds = (
    extent: StageExtent | null,
    axis: string,
): [number, number] => {
    if (!extent) return [0, 0];
    const reach =
        axis === "z"
            ? extent.side
            : (axis === "y" ? extent.halfHeight : extent.halfWidth) - extent.side / 2;
    const r = Math.max(0, Math.round(reach));
    return [-r, r];
};

export interface MatrixCellMeta extends MatrixCellName {
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

/* X.KF.W13X.matrix (KFA-138 · UIA-KF-159) — the Matrix channel's AUTHORED
   endpoint. Both endpoints were identity, so on a fresh load the channel played
   identity → identity: `.cube-pose` held one pose for all 180 captured frames and
   choosing "Matrix" in the transport changed nothing. The end pose is authored
   as the one thing the rotate/scale channels cannot show — a shear (column 1,
   row 0: x' = x + 0.35·y, the die leaning as it plays) — and Reset returns HERE,
   so Reset never re-seats the inert channel either. The start stays identity
   (topology 2, `useTransformState`). */
export const AUTHORED_MATRIX_END: Readonly<MatrixValues> = [
    1, 0, 0, 0,
    0.35, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
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

/* X.KF.W13X.matrix (UIA-KF-063) — ONE unique name per entry. The grid read
   `Sx … Pw Pw Pw … w`: the three perspective cells shared "Pw" (their ROW is w;
   what varies is the column) and the six off-diagonals carried a bare axis
   letter each, so two cells in a column read the same. matrix3d is
   column-major — index i sits at column ⌊i/4⌋, row i mod 4 — and each role is
   named by what it couples: S/T by the axis they act on, P by the input axis
   whose depth it divides, K (a shear/rotation entry) by output·input axis, and
   the lone divisor `w`. */
export interface MatrixCellName {
    /** The role letter: S · T · P · K · w. */
    symbol: string;
    /** The axis subscript ("" for w). */
    sub: string;
    /** symbol + sub, unique across the 16 entries — the cell's accessible name. */
    name: string;
}

const XYZ = ["x", "y", "z"];

export const matrixCellName = (i: number): MatrixCellName => {
    const col = Math.floor(i / 4);
    const row = i % 4;
    const role = getTransformFromIx(i);
    const [symbol, sub] =
        role === "S" || role === "T"
            ? [role, XYZ[row] ?? ""]
            : role === "P"
              ? [role, XYZ[col] ?? ""]
              : i === 15
                ? ["w", ""]
                : ["K", `${XYZ[row] ?? ""}${XYZ[col] ?? ""}`];
    return { symbol, sub, name: symbol + sub };
};

export const getSliderOptionsFromIx = (
    i: number,
    extent: StageExtent | null = null,
): { bounds: [number, number]; step: number } => {
    const role = getTransformFromIx(i);
    if (role === "T") return { bounds: translateBounds(extent, XYZ[i % 4] ?? "x"), step: 1 };
    if (role === "S") return matrixSliderOptions.scale;
    if (role === "P") return matrixSliderOptions.perspective;
    return i === 15 ? matrixSliderOptions.divisor : matrixSliderOptions.shear;
};
