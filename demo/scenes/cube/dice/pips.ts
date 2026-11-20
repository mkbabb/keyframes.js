/**
 * The die's marks: pips on a 3 × 3 grid, as a Western die is marked, and the
 * face each value sits on.
 *
 * Opposite faces sum to seven, and 1, 2, 3 run counter-clockwise round the
 * corner they share (a right-handed die). The die rests at the stage's opening
 * attitude showing that corner: 1 on top, 2 on the left, 3 on the right, the 2
 * laid top-left to bottom-right and the 3 top-right to bottom-left, as a die
 * is drawn.
 *
 * A value's colour is its own (`--die-N`, CubeTarget.css's one block of the
 * six value tokens), so a skin paints the same number the same colour wherever
 * the die turns, on the single die and on the pair.
 */

export type DieValue = 1 | 2 | 3 | 4 | 5 | 6;

export type Vec3 = readonly [number, number, number];

/** A pip's cell: row, column (1-3). */
export type Cell = readonly [row: number, col: number];

const TL: Cell = [1, 1];
const TR: Cell = [1, 3];
const ML: Cell = [2, 1];
const C: Cell = [2, 2];
const MR: Cell = [2, 3];
const BL: Cell = [3, 1];
const BR: Cell = [3, 3];

export const PIPS: Readonly<Record<DieValue, readonly Cell[]>> = {
    1: [C],
    2: [TL, BR],
    3: [TR, C, BL],
    4: [TL, TR, BL, BR],
    5: [TL, TR, C, BL, BR],
    6: [TL, ML, BL, TR, MR, BR],
};

export interface DieFace {
    /** The cube face it sits on (CubeTarget's face classes). */
    side: "front" | "right" | "back" | "left" | "top" | "bottom";
    value: DieValue;
    /** Its outward normal in the die's own frame (CSS axes: x right, y down,
     *  z toward the viewer). */
    normal: Vec3;
    /** The face's own column (+x) and row (+y) directions in that frame, as
     *  its CSS transform lays them (rotateY / rotateX, then translateZ). */
    u: Vec3;
    v: Vec3;
}

/** The six faces, in the cube's face order (CubeTarget's `cubeSides`). */
export const DIE_FACES: readonly DieFace[] = [
    { side: "front", value: 3, normal: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] },
    { side: "right", value: 5, normal: [1, 0, 0], u: [0, 0, -1], v: [0, 1, 0] },
    { side: "back", value: 4, normal: [0, 0, -1], u: [-1, 0, 0], v: [0, 1, 0] },
    { side: "left", value: 2, normal: [-1, 0, 0], u: [0, 0, 1], v: [0, 1, 0] },
    { side: "top", value: 1, normal: [0, -1, 0], u: [1, 0, 0], v: [0, 0, 1] },
    { side: "bottom", value: 6, normal: [0, 1, 0], u: [1, 0, 0], v: [0, 0, -1] },
];

export const faceOf = (value: DieValue): DieFace => DIE_FACES.find((f) => f.value === value)!;

/** A pip's centre in the die's frame (a die of side 1, the grid inset 15 %). */
export const pipPoint = (face: DieFace, [row, col]: Cell): Vec3 => {
    const cell = 0.7 / 3;
    const a = (col - 2) * cell;
    const b = (row - 2) * cell;
    return [
        face.normal[0] / 2 + face.u[0] * a + face.v[0] * b,
        face.normal[1] / 2 + face.u[1] * a + face.v[1] * b,
        face.normal[2] / 2 + face.u[2] * a + face.v[2] * b,
    ];
};

/** A value's colour and its ink: the die's own tokens, by value. */
export const valueColor = (v: DieValue) => `var(--die-${v})`;
export const valueInk = (v: DieValue) => `var(--die-${v}-ink)`;
