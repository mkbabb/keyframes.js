import { describe, expect, it } from "vitest";
import { ValueUnit } from "@mkbabb/value.js";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { AnimationGroup } from "../../src/animation/group";
import { compositeFramesAt } from "../support/group-probe";

const scalar = (out: Record<string, any>, key: string): ValueUnit =>
    out[key]![0] as ValueUnit;

const animation = (css: string) =>
    new CSSKeyframesAnimation({ duration: 1000 }).fromString(css);

describe("U.C15 composition vocabulary", () => {
    it("accepts accumulate as the additive group operation", () => {
        const base = animation("from { opacity: 0.4 } to { opacity: 0.4 }");
        const top = animation("from { opacity: 0.6 } to { opacity: 0.6 }");
        const group = AnimationGroup.of(
            { animation: base },
            { animation: top, layer: { op: "accumulate", zIndex: 1 } },
        );
        expect(scalar(compositeFramesAt(group, 0), "opacity").value).toBeCloseTo(1);
    });

    it("honors the deprecated weighted alias when expressed as op + weight", () => {
        const top = animation("from { opacity: 0.8 } to { opacity: 0.8 }");
        const group = AnimationGroup.of({
            animation: top,
            layer: { op: "replace", weight: 0.25 },
        });
        expect(scalar(compositeFramesAt(group, 0), "opacity").value).toBeCloseTo(0.2);
    });

    it("refuses to sum mismatched numeric units and keeps the incoming leaf", () => {
        const base = animation("from { left: 10px } to { left: 10px }");
        const top = animation("from { left: 50% } to { left: 50% }");
        const group = AnimationGroup.of(
            { animation: base },
            { animation: top, layer: { op: "add", zIndex: 1 } },
        );
        const leaf = scalar(compositeFramesAt(group, 0), "left");
        expect(leaf.unit).toBe("%");
        expect(leaf.value).toBeCloseTo(50);
    });
});
