/**
 * S.B7 · S4 — Cube scene composable coverage (a25 F1 · fold row 40).
 *
 * X-DS pass 1 (KF-P1-02; value.js X-DS.md, COHESION §0ej/§0ek) — the
 * orientation-coupled re-lit die (`useCubeRelit`: a pinned key light, per-face
 * `--lit`, a specular sweep and a veil) is DELETED with the lit-lacquer
 * material; its coverage is retired here in the same motion (never assert a
 * tell the source no longer emits) and replaced by the flat-face falsifier
 * below: the die's faces carry no lighting and their one tonal step is fixed
 * per face. What survives of the module is the stage attitude
 * (`graphAttitude.ts`), still locked here. References the scene's
 * animation-name registry (`useCubeDemo`) + transport key (`cubeKeys`) so a
 * rename reds here.
 *
 * T.A1/T.A2 — the `--spin-energy` bloom (spinEnergy/flashRoll/disposeFlash) and
 * the on-stage `euler` attitude readout were DELETED (verdict #1 / rulings
 * #5/#8); their coverage is retired here in the same motion.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
    GRAPH_ATTITUDE,
    graphAttitudeCss,
    rotateByAttitude,
} from "../../../demo/scenes/cube/graphAttitude";
import { sceneMap } from "../../../demo/app/scene/scenes";
import { CUBE_ANIMATION_NAMES } from "../../../demo/scenes/cube/cubeMotion";
import { CUBE_SCENE_ID } from "../../../demo/scenes/cube/cubeKeys";
import {
    createMatrix,
    cssVariable,
    matrixValues,
    withMatrixCell,
} from "../../../demo/scenes/cube/matrix-editor/transformMath";

const CUBE = resolve(__dirname, "../../../demo/scenes/cube");
const stripComments = (src: string) =>
    src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/<!--[\s\S]*?-->/g, "").replace(/^\s*\/\/.*$/gm, "");

describe("KF-P1-02 — the die's faces are flat crayons", () => {
    const css = stripComments(readFileSync(resolve(CUBE, "CubeTarget.css"), "utf8"));
    const vue = stripComments(readFileSync(resolve(CUBE, "CubeTarget.vue"), "utf8"));

    it("no lighting is authored on a face: no gradient, shadow, specular or veil", () => {
        expect(css).not.toMatch(/gradient\(/);
        expect(css).not.toMatch(/box-shadow/);
        expect(css).not.toMatch(/face-lacquer|face-relit|--lit\b/);
        expect(vue).not.toMatch(/face-lacquer|face-relit|--lit\b|faceLit|useCubeRelit/);
    });

    it("the one tonal step is FIXED per face class, never driven by the rotation", () => {
        const fill = css.match(/\.face-fill\s*\{([^}]*)\}/)![1]!;
        expect(fill).toMatch(/background-color:\s*color-mix\(\s*in oklab,\s*var\(--face-crayon\)/);
        // The step is a class-keyed custom property (top / bottom / sides)…
        expect(css).toMatch(/\.cube-side\.top\s*\{[^}]*--face-step:\s*8%/);
        expect(css).toMatch(/\.cube-side\.bottom\s*\{[^}]*--face-step:\s*8%/);
        expect(css).toMatch(/\.cube-side\.left,\s*\.cube-side\.right\s*\{[^}]*--face-step:\s*4%/);
        // …and nothing in the component writes it (no inline, no script).
        expect(vue).not.toMatch(/--face-step/);
        // The crayons stay the six named tokens (identity, §0dm).
        for (let n = 1; n <= 6; n++) expect(vue).toContain(`var(--face-${n})`);
    });
});

describe("the stage attitude is single-sourced (#56)", () => {
    it("the CSS the PRM arm snaps to is the one authored attitude", () => {
        // The eased intro's end keyframe, the reduced-motion snap and the
        // axis-reveal geometry all read ONE constant.
        expect(graphAttitudeCss()).toBe("rotate3d(-1, 1, 0, 30deg)");
        expect(graphAttitudeCss(GRAPH_ATTITUDE)).toBe(graphAttitudeCss());
    });

    it("the room hop leaves a rest normal off its own axis", () => {
        const turned = rotateByAttitude([0, 0, 1], GRAPH_ATTITUDE);
        expect(Math.hypot(...turned)).toBeCloseTo(1, 10);
        expect(turned[2]).toBeLessThan(1);
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
        // not the retired PascalCase "Cube"), single-sourced from cubeKeys —
        // the registry descriptor's id and store key are that one constant
        // (A2-KE-L1-14: the module-local `SCENE_ID` alias is gone).
        expect(sceneMap.get(CUBE_SCENE_ID)?.id).toBe(CUBE_SCENE_ID);
        expect(sceneMap.get(CUBE_SCENE_ID)?.superKey).toBe(CUBE_SCENE_ID);
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
