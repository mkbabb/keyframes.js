import { describe, it, expect } from "vitest";
import { CSSKeyframesAnimation } from "@src/animation/engine";
import { AnimationGroup } from "@src/animation/group";
import {
    buildPlainProjection,
    refreshPlainProjection,
} from "@src/animation/compile/plain-vars";
import { ValueUnit } from "@mkbabb/value.js";

/**
 * T.A6 — the plain-vars `frame.transform` contract. A custom transform ("animate
 * any object") must receive PLAIN authored-shaped values: `typeof number` for a
 * unitless numeric leaf, the authored STRING for a units/color leaf — NEVER the
 * array-boxed `ValueUnit` leaves value.js ≥ 2.0.1 hands `frame.vars`. The
 * projection covers BOTH consumer paths (per-animation apply + the group SoA
 * compositor output), so the amiga mesh never sees a `NaN`-yielding boxed leaf.
 */
describe("T.A6 — plain-vars projection unit", () => {
    it("buildPlainProjection: unitless numeric leaf → number; units leaf → string", () => {
        const flat: Record<string, ValueUnit[]> = {
            "rotation.x": [new ValueUnit(1.5)],
            translate: [new ValueUnit(10, "px")],
        };
        const { root } = buildPlainProjection(flat);
        const r = root as { rotation: { x: unknown }; translate: unknown };

        expect(typeof r.rotation.x).toBe("number");
        expect(r.rotation.x).toBe(1.5);
        expect(typeof r.translate).toBe("string");
        expect(r.translate).toBe("10px");
    });

    it("refreshPlainProjection: re-reads the live leaf `.value` in place (same root object)", () => {
        const leaf = new ValueUnit(0);
        const proj = buildPlainProjection({ "rotation.x": [leaf] });
        const root = proj.root as { rotation: { x: number } };
        expect(root.rotation.x).toBe(0);

        // Mutate the leaf as the interp stride would, then refresh.
        (leaf as unknown as { value: number }).value = 2.5;
        const before = proj.root;
        refreshPlainProjection(proj);
        expect(proj.root).toBe(before); // root identity preserved
        expect(root.rotation.x).toBe(2.5);
        expect(typeof root.rotation.x).toBe("number");
    });
});

describe("T.A6 — per-animation transform receives plain values", () => {
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
        // The array-box regression: today's `frame.vars` handed a one-element
        // ValueUnit[] (typeof "object"). The plain projection kills it.
        expect(seen.some((v) => Array.isArray(v))).toBe(false);
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

describe("T.A6 — the GROUP SoA compositor output is plain-projected", () => {
    it("a single-target custom-transform group hands the transform plain numbers (no boxed leaves, finite)", () => {
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
        // The pose actually moves (the composite is live, not stomped to a
        // constant boxed leaf).
        const rys = seen.map((s) => s.ry);
        expect(new Set(rys).size).toBeGreaterThanOrEqual(3);
    });
});
