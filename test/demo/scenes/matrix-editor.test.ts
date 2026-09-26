// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.matrix — the Matrix Controls facet (the cube's `matrix-editor/`).
 *
 * Unit witnesses for the rows whose cause is a VALUE this directory owns; the
 * served geometry (the label over the value, the disc, the grid island, the
 * selected cell's resting state, the Fixed/Free verb in the ribbon) is read by
 * the committed served probe `evidence/W13X/matrix/matrix.mjs`, RED at the
 * before bytes and GREEN after, x2.
 *
 * - UIA-KF-063 — every cell has a UNIQUE name (three perspective cells all read
 *   "Pw" and the off-diagonals a bare axis letter).
 * - UIA-KF-162 — a perspective or off-diagonal cell is a unitless matrix entry,
 *   never the rotate preset's ±360 degrees.
 * - UIA-KF-265 — the translate range is the stage's half-extent less the die's
 *   half side, not ±1000 px.
 * - KFA-138 · UIA-KF-159 — the Matrix channel is not identity → identity on a
 *   fresh load, and Reset returns to that authored pose.
 * - UIA-KF-028 · UIA-KF-264 · UIA-KF-260 · UIA-KF-106 · UIA-KF-161 · UIA-KF-047
 *   — the mounted editor: no inert `fixed` state, one selected cell marked for
 *   AT and at rest, a named slider with a readout, a titled section, and no
 *   bogus `start/end/step` attributes on a text field.
 */
import { beforeAll, describe, expect, it } from "vitest";
import { createApp, effectScope, nextTick, ref } from "vue";
import { mat4 } from "gl-matrix";

import { warmKfEngine } from "../../../demo/kf-engine";
import type { TransformState } from "../../../demo/scenes/cube/orbital-drag";
import { useTransformState } from "../../../demo/scenes/cube/matrix-editor/useTransformState";
import {
    AUTHORED_MATRIX_END,
    createMatrix,
    getSliderOptionsFromIx,
    matrixCellName,
    matrixValues,
    translateBounds,
} from "../../../demo/scenes/cube/matrix-editor/transformMath";

const raf = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const rest = (): TransformState => ({
    rotate: { x: 0, y: 0, z: 0 },
    translate: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    matrix: mat4.create(),
});
const IDENTITY = Array.from(mat4.create());
const PERSPECTIVE = [3, 7, 11];
const OFF_DIAGONAL = [1, 2, 4, 6, 8, 9];

beforeAll(async () => {
    await warmKfEngine();
});

describe("UIA-KF-063 — every matrix cell has a unique name", () => {
    it("16 distinct names; the perspective row reads Px/Py/Pz", () => {
        const names = Array.from({ length: 16 }, (_, i) => matrixCellName(i).name);
        expect(new Set(names).size).toBe(16);
        expect(PERSPECTIVE.map((i) => matrixCellName(i).name)).toEqual(["Px", "Py", "Pz"]);
        expect([0, 5, 10].map((i) => matrixCellName(i).name)).toEqual(["Sx", "Sy", "Sz"]);
        expect([12, 13, 14].map((i) => matrixCellName(i).name)).toEqual(["Tx", "Ty", "Tz"]);
    });
});

describe("UIA-KF-162 — unitless cells get unitless ranges", () => {
    it("perspective and off-diagonal cells never take the ±360 rotate bounds", () => {
        for (const i of PERSPECTIVE) {
            const [lo, hi] = getSliderOptionsFromIx(i).bounds;
            expect(Math.max(Math.abs(lo), Math.abs(hi))).toBeLessThanOrEqual(0.01);
        }
        for (const i of [...OFF_DIAGONAL, 15]) {
            const [lo, hi] = getSliderOptionsFromIx(i).bounds;
            expect(Math.max(Math.abs(lo), Math.abs(hi))).toBeLessThanOrEqual(3);
        }
    });
});

describe("UIA-KF-265 — translate bounds come from the stage", () => {
    it("Tx/Ty = the stage half-extent less the die's half side; unmeasured = no travel", () => {
        const extent = { halfWidth: 439, halfHeight: 396, side: 370 };
        expect(translateBounds(extent, "x")).toEqual([-254, 254]);
        expect(translateBounds(extent, "y")).toEqual([-211, 211]);
        expect(translateBounds(extent, "z")).toEqual([-370, 370]);
        expect(translateBounds(null, "x")).toEqual([0, 0]);
        expect(getSliderOptionsFromIx(12, extent).bounds).toEqual([-254, 254]);
        expect(getSliderOptionsFromIx(13, extent).bounds).toEqual([-211, 211]);
    });
});

describe("KFA-138 · UIA-KF-159 — the Matrix channel has an authored endpoint", () => {
    it("a fresh state is not identity → identity, and Reset returns to the authored pose", async () => {
        const el = document.createElement("div");
        const scope = effectScope();
        try {
            await scope.run(async () => {
                const state = useTransformState(ref(false), ref<HTMLElement | undefined>(el), rest());
                expect(matrixValues(state.matrix3dStart.value)).toEqual(IDENTITY);
                expect(matrixValues(state.matrix3dEnd.value)).not.toEqual(IDENTITY);
                expect(matrixValues(state.matrix3dEnd.value)).toEqual(Array.from(AUTHORED_MATRIX_END));

                state.updateMatrixCell(2, 0);
                for (let k = 0; k < 90 && matrixValues(state.matrix3dEnd.value)[0] !== 2; k++) await raf();
                expect(matrixValues(state.matrix3dEnd.value)[0]).toBe(2);

                state.resetMatrix();
                const target = Array.from(AUTHORED_MATRIX_END);
                for (let k = 0; k < 120 && matrixValues(state.matrix3dEnd.value).some((v, i) => Math.abs(v - target[i]!) > 1e-9); k++) await raf();
                matrixValues(state.matrix3dEnd.value).forEach((v, i) => expect(v).toBeCloseTo(target[i]!, 9));
            });
        } finally {
            scope.stop();
        }
    }, 30_000);
});

describe("UIA-KF-028 · 264 · 260 · 106 · 161 · 047 — the mounted editor", () => {
    it("a titled section, one AT-marked selected cell, a named slider with a readout, no inert state", async () => {
        const { default: MatrixEditor } = await import(
            "../../../demo/scenes/cube/matrix-editor/MatrixEditor.vue"
        );
        const { getStoredAnimationGroupControlOptions } = await import("@state");
        const { getAxisFromIx, getTransformFromIx } = await import(
            "../../../demo/scenes/cube/matrix-editor/transformMath"
        );
        const meta = Array.from({ length: 16 }, (_, i) => ({
            axis: getAxisFromIx(i),
            transform: getTransformFromIx(i),
            sliderOptions: getSliderOptionsFromIx(i, { halfWidth: 439, halfHeight: 396, side: 370 }),
            ...matrixCellName(i),
        }));
        const host = document.createElement("div");
        document.body.appendChild(host);
        const app = createApp(MatrixEditor, {
            matrix3dEnd: createMatrix(AUTHORED_MATRIX_END),
            matrixCellMeta: meta,
            superKey: "cube",
        });
        app.mount(host);
        await nextTick();

        // UIA-KF-161 — the surface is a titled section.
        expect(host.textContent).toContain("Transform matrix");

        // UIA-KF-047 (consumer half) — the cells are fields without the
        // slider attributes a text input does not have.
        const inputs = [...host.querySelectorAll<HTMLInputElement>(".matrix-grid input")];
        expect(inputs).toHaveLength(16);
        for (const i of inputs) {
            for (const a of ["start", "end", "step"]) expect(i.hasAttribute(a)).toBe(false);
        }

        // UIA-KF-264 — exactly one cell is the selected one, marked for AT.
        const current = () => [...host.querySelectorAll('.matrix-grid [aria-current="true"]')];
        expect(current()).toHaveLength(1);
        inputs[12]!.dispatchEvent(new Event("focus"));
        inputs[12]!.click();
        await nextTick();
        expect(current()).toHaveLength(1);
        expect(current()[0]!.closest(".matrix-cell")?.textContent).toContain("Tx");

        // UIA-KF-260 · UIA-KF-106 — the slider is named by the cell it drives
        // and the value reads beside it.
        const slider = host.querySelector<HTMLElement>("[role=slider]");
        expect(slider).not.toBeNull();
        const labelled = host.querySelector(".param-row label, .param-row .labeled-field")?.textContent ?? "";
        expect(labelled).toContain("Tx");
        expect(host.querySelector(".param-row output")?.textContent?.trim()).not.toBe("");

        // UIA-KF-028 — the stored slice holds no inert `fixed` flag.
        const stored = getStoredAnimationGroupControlOptions("cube");
        expect(Object.keys(stored.matrixOptions ?? {})).toEqual(["selectedMatrixCell"]);

        app.unmount();
        host.remove();
    }, 30_000);
});
