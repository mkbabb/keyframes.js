import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { AnimationGroup } from "../../src/animation/group";
import { compositeFramesAt } from "../support/group-probe";

const value = (out: Record<string, unknown>, key: string) =>
    (out[key] as Array<{ value: number }>)[0]!.value;

const animation = (css: string) =>
    new CSSKeyframesAnimation({ duration: 1000 }).fromString(css);

describe("U.C15 normalized layer weight axis", () => {
    it.each([
        [2, 10],
        [-1, 0],
        [Number.NaN, 0],
    ] as const)("normalizes static weighted=%s to %s", (weight, expected) => {
        const base = animation("from{opacity:0}to{opacity:0}");
        const top = animation("from{opacity:10}to{opacity:10}");
        base.t = top.t = 0;
        const group = new AnimationGroup<any>(
            { animation: base },
            { animation: top, layer: { blendMode: "weighted", weight } },
        );
        expect(value(compositeFramesAt(group, 0), "opacity")).toBeCloseTo(expected, 8);
    });

    it("leaves a live spring's overshoot available to the physical path", () => {
        const base = animation("from{opacity:0}to{opacity:0}");
        const top = animation("from{opacity:1}to{opacity:1}");
        const group = new AnimationGroup<any>(
            { animation: base },
            { animation: top, layer: { blendMode: "weighted", weight: 0.5 } },
        );
        group.transitionLayer(top, {
            weight: 1.5,
            spring: { response: 300, dampingFraction: 0.2 },
        });
        const layer = group.animations[group.getEntries()[1]!.animation.id]?.layer;
        expect(layer).toBeDefined();
        expect(layer!.weightSpring).toBeDefined();
        expect((layer!.weightSpring as { target?: number }).target).toBe(1);
    });
});
