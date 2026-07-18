/**
 * S.B7 · S4 — Cube scene composable coverage (a25 F1 · fold row 40).
 *
 * Locks `useCubeRelit` — the orientation-coupled re-lighting model (the light is
 * pinned in the room; the die turns under it, faces toward the key light
 * brighten). The `faceLit` computed is a pure function of the live rotation, so
 * it asserts deterministically without a rAF. References the scene's
 * animation-name registry (`useCubeDemo`, renamed from `useCubeAnimations` at
 * S.D4, C-17) + transport key (`cubeKeys`) so a rename reds here.
 *
 * T.A1/T.A2 — the `--spin-energy` bloom (spinEnergy/flashRoll/disposeFlash) and
 * the on-stage `euler` attitude readout were DELETED (verdict #1 / rulings
 * #5/#8); their coverage is retired here in the same motion (never assert a tell
 * the source no longer emits).
 */
import { describe, expect, it } from "vitest";
import { mat4 } from "gl-matrix";
import { ref } from "vue";
import type { TransformState } from "../../../demo/scenes/cube/orbital-drag";
import {
    FACE_NORMALS,
    useCubeRelit,
} from "../../../demo/scenes/cube/useCubeRelit";
import {
    CUBE_ANIMATION_NAMES,
    SCENE_ID,
} from "../../../demo/scenes/cube/useCubeDemo";
import { CUBE_SCENE_ID } from "../../../demo/scenes/cube/cubeKeys";
import {
    createMatrix,
    cssVariable,
    matrixValues,
    withMatrixCell,
} from "../../../demo/scenes/cube/matrix-editor/transformMath";

const restTransform = (rotate = { x: 0, y: 0, z: 0 }): TransformState => ({
    rotate,
    translate: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    matrix: mat4.create(),
});

describe("useCubeRelit — the orientation-coupled relight", () => {
    it("FACE_NORMALS is six axis-aligned unit outward normals", () => {
        expect(FACE_NORMALS).toHaveLength(6);
        for (const n of FACE_NORMALS) {
            expect(Math.hypot(n[0], n[1], n[2])).toBeCloseTo(1, 10);
        }
        // Front (+Z) and back (−Z) are opposite.
        expect(FACE_NORMALS[0]).toEqual([0, 0, 1]);
        expect(FACE_NORMALS[2]).toEqual([0, 0, -1]);
    });

    it("at rest the light-facing front is brighter than the shadowed back", () => {
        const { faceLit } = useCubeRelit(ref(restTransform()));
        const front = Number(faceLit.value[0]);
        const back = Number(faceLit.value[2]);
        // Key light has a +Z component → +Z face lit, −Z face sunk.
        expect(front).toBeGreaterThan(back);
        // Every litness is a clamped [0,1] string.
        for (const s of faceLit.value) {
            const v = Number(s);
            expect(v).toBeGreaterThanOrEqual(0);
            expect(v).toBeLessThanOrEqual(1);
        }
    });

    it("faceLit re-lights reactively as the die turns", () => {
        const t = ref(restTransform({ x: 10.4, y: 20.6, z: -3.5 }));
        const { faceLit } = useCubeRelit(t);
        const before = faceLit.value[0];
        // Turn the die a quarter — the computed relights.
        t.value = restTransform({ x: 90, y: 0, z: 0 });
        expect(faceLit.value[0]).not.toBe(before);
    });

    it("faceLit is quantized to 2 decimals (T.A5 — write-count reduction)", () => {
        const { faceLit } = useCubeRelit(ref(restTransform()));
        for (const s of faceLit.value) {
            // toFixed(2) — at most two fractional digits (never three).
            expect(s).toMatch(/^\d(\.\d{1,2})?$/);
        }
    });
});

describe("cube scene registry keys", () => {
    it("the animation-name set + transport superKey are stable", () => {
        expect(CUBE_ANIMATION_NAMES).toEqual({
            Matrix: "Matrix",
            Rotations: "Rotations",
            Hover: "Hover",
        });
        // T.B9 — the ONE keyspace: the store key IS the registry SceneId ("cube",
        // not the retired PascalCase "Cube"), single-sourced from cubeKeys.
        expect(SCENE_ID).toBe(CUBE_SCENE_ID);
        expect(CUBE_SCENE_ID).toBe("cube");
    });
});

describe("cube Value 4 authoring", () => {
    it("authors an immutable structural matrix3d call", () => {
        const matrix = createMatrix();
        const changed = withMatrixCell(matrix, 12, 48);

        expect(matrix).toMatchObject({ kind: "call", name: "matrix3d" });
        expect(matrix.args).toHaveLength(16);
        expect(matrixValues(matrix)[12]).toBe(0);
        expect(matrixValues(changed)[12]).toBe(48);
        expect(changed).not.toBe(matrix);
    });

    it("rejects malformed matrix3d arity and non-numeric arguments", () => {
        const matrix = createMatrix();
        expect(() =>
            matrixValues({ ...matrix, args: matrix.args.slice(0, 15) }),
        ).toThrow(/requires 16 arguments/);
        expect(() =>
            matrixValues({
                ...matrix,
                args: [cssVariable("--bad"), ...matrix.args.slice(1)],
            }),
        ).toThrow(/finite unitless number/);
    });

    it("authors var() as a structural Value call", () => {
        expect(cssVariable("--rotationX")).toEqual({
            kind: "call",
            name: "var",
            args: [
                {
                    kind: "scalar",
                    payload: { type: "keyword", value: "--rotationX" },
                },
            ],
        });
    });
});
