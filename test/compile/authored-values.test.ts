import { describe, it, expect } from "vitest";
import { CSSKeyframesAnimation } from "@src/animation/engine";
import { AnimationGroup } from "@src/animation/group";
import {
    buildNestedAuthoredSink,
    refreshNestedAuthoredSink,
} from "@src/animation/compile/value-ast";

/**
 * T.A6 — the authored-value `frame.transform` contract. A custom transform
 * ("animate any object") receives authored-shaped values: numbers for unitless
 * numeric leaves and strings for unit-bearing or color leaves. The nested sink
 * covers both consumer paths (per-animation apply and group composition).
 */
describe("T.A6 — nested authored-value sink", () => {
    it("buildNestedAuthoredSink: numbers and CSS strings retain their authored types", () => {
        const flat = {
            "rotation.x": 1.5,
            translate: "10px",
        };
        const { root } = buildNestedAuthoredSink(flat);
        const r = root as { rotation: { x: unknown }; translate: unknown };

        expect(typeof r.rotation.x).toBe("number");
        expect(r.rotation.x).toBe(1.5);
        expect(typeof r.translate).toBe("string");
        expect(r.translate).toBe("10px");
    });

    it("refreshNestedAuthoredSink: re-reads the flat authored value in place", () => {
        const flat = { "rotation.x": 0 };
        const proj = buildNestedAuthoredSink(flat);
        const root = proj.root as { rotation: { x: number } };
        expect(root.rotation.x).toBe(0);

        flat["rotation.x"] = 2.5;
        const before = proj.root;
        refreshNestedAuthoredSink(proj);
        expect(proj.root).toBe(before); // root identity preserved
        expect(root.rotation.x).toBe(2.5);
        expect(typeof root.rotation.x).toBe("number");
    });
});

describe("T.A6 — per-animation transform receives authored values", () => {
    it("fromVars({rotation:{x}}) hands the transformFunc a `typeof number` leaf", () => {
        const seen: unknown[] = [];
        const anim = new CSSKeyframesAnimation({
            duration: 1000,
            iterationCount: 1,
        }).fromVars(
            [{ rotation: { x: 0 } }, { rotation: { x: 1.5 } }],
            (vars: any) => {
                seen.push(vars.rotation.x);
            },
        );

        // Apply the transform at the timeline end (a genuine lerped frame).
        anim.interpFrames(1000, true);

        expect(seen.length).toBeGreaterThan(0);
        for (const v of seen) {
            expect(typeof v).toBe("number");
            expect(Number.isNaN(v as number)).toBe(false);
        }
    });

    it("a units-authored leaf reaches the transform as the authored string", () => {
        let got: unknown;
        const anim = new CSSKeyframesAnimation({
            duration: 1000,
            iterationCount: 1,
        }).fromVars(
            [{ box: { w: "0px" } }, { box: { w: "100px" } }],
            (vars: any) => {
                got = vars.box.w;
            },
        );
        anim.interpFrames(500, true);
        expect(typeof got).toBe("string");
        expect(got).toMatch(/px$/);
    });
});

describe("T.A6 — group composition preserves authored values", () => {
    it("a single-target custom-transform group hands the transform finite numbers", () => {
        const seen: any[] = [];
        const transform = (vars: any) => {
            seen.push({
                ry: vars.rotation?.y,
                px: vars.position?.x,
            });
        };

        const rotations = new CSSKeyframesAnimation({
            duration: 1000,
            iterationCount: Infinity,
        }).fromVars(
            [{ rotation: { x: 0, y: 0, z: 0 } }, { rotation: { x: 6, y: 6, z: 6 } }],
            transform,
        );
        const bounceX = new CSSKeyframesAnimation({
            duration: 1000,
            iterationCount: Infinity,
        }).fromVars(
            [{ position: { x: -5 } }, { position: { x: 5 } }],
            transform,
        );

        const group = new AnimationGroup(rotations as any, bounceX as any);
        // The amiga discipline (T.A7): ride the single-target composite path.
        group.singleTarget = true;

        for (let i = 0; i <= 10; i++) {
            group.setChildTime(rotations as any, (i / 10) * 1000);
            group.setChildTime(bounceX as any, (i / 10) * 1000);
            group.render();
        }

        expect(seen.length).toBeGreaterThan(0);
        for (const s of seen) {
            expect(typeof s.ry).toBe("number");
            expect(Number.isFinite(s.ry)).toBe(true);
            expect(typeof s.px).toBe("number");
            expect(Number.isFinite(s.px)).toBe(true);
        }
        // The pose actually moves rather than remaining constant.
        const rys = seen.map((s) => s.ry);
        expect(new Set(rys).size).toBeGreaterThanOrEqual(3);
    });
});
