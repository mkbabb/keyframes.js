import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { AnimationGroup } from "../../src/animation/group";
import { CompositeState } from "../../src/animation/group/composite-state";
import { compositeFramesAt } from "../support/group-probe";

const scalar = (out: Record<string, unknown>, key: string) => out[key] as number;

const multi = (css: string, t: number) => {
    const animation = new CSSKeyframesAnimation({ duration: 4000 }).fromString(css);
    animation.t = t;
    return animation;
};

describe("U.C14 owned CompositeState", () => {
    it("keeps grouped properties shape-stable while contributions change", () => {
        const state = new CompositeState();
        state.configure(["opacity"]);
        state.clear();
        state.copy("opacity", 1);
        state.pruneInactive();
        const keys = Object.keys(state.values);
        state.clear();
        state.pruneInactive();
        expect(Object.keys(state.values)).toEqual(keys);
        expect(state.values.opacity).toBeUndefined();
    });

    it("excludes disabled layers from the grouped-key union", () => {
        const base = multi("from{opacity:0}to{opacity:1}", 500);
        const disabled = multi("from{left:0px}to{left:20px}", 500);
        const group = new AnimationGroup<any>(
            { animation: base },
            { animation: disabled, layer: { enabled: false } },
        );
        const grouped = compositeFramesAt(group, 0);
        expect(Object.keys(grouped)).toEqual(["opacity"]);
    });

    it.each([
        ["add", "add"],
        ["weight", "replace"],
    ] as const)(
        "keeps the %s contribution live after a segment boundary",
        (kind, op) => {
            const base = multi("0%{opacity:1}50%{opacity:3}100%{opacity:1}", 1000);
            const top = multi("0%{opacity:10}50%{opacity:30}100%{opacity:10}", 1000);
            const group = new AnimationGroup<any>(
                { animation: base, layer: { op: "replace" } },
                { animation: top, layer: { op, weight: 0.5 } },
            );
            compositeFramesAt(group, 0); // build the stable plan before crossing
            base.t = top.t = 3000;
            const out = compositeFramesAt(group, 0);
            expect(scalar(out, "opacity")).toBeCloseTo(
                kind === "add" ? 22 : 11,
                8,
            );
        },
    );

    it("keeps custom-transform authored values live after the boundary", () => {
        const samples: number[] = [];
        const animation = new CSSKeyframesAnimation<any>({ duration: 4000 });
        animation.fromVars(
            [{ pose: 0 }, { pose: 20 }, { pose: 40 }],
            (vars) => samples.push(vars.pose),
        );
        const group = new AnimationGroup<any>(animation);
        animation.t = 1000;
        compositeFramesAt(group, 0);
        animation.t = 3000;
        compositeFramesAt(group, 0);
        expect(samples.at(-1)).toBeCloseTo(30, 8);
        expect(new Set(samples).size).toBeGreaterThan(1);
    });

    it("removes keys contributed only by a removed layer", () => {
        const base = multi("from{opacity:0}to{opacity:1}", 500);
        const removed = multi("from{left:0px}to{left:20px}", 500);
        const group = new AnimationGroup<any>(base, removed);
        expect(compositeFramesAt(group, 0).left).toBeDefined();
        const key = Object.keys(group.animations).find(
            (name) => group.animations[name]!.animation === removed,
        )!;
        delete group.animations[key];
        group.invalidateEntries();
        expect(compositeFramesAt(group, 0).left).toBeUndefined();
    });
});
