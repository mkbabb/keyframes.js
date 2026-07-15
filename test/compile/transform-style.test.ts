import { describe, expect, it } from "vitest";
import { ValueUnit } from "@mkbabb/value.js/units";
import { transformTargetsStyle } from "../../src/animation/compile/parse-flatten";

describe("transformTargetsStyle apply seam", () => {
    it("reuses the serialized shape across a steady apply window", () => {
        const target = document.createElement("div");
        const vars = { opacity: [new ValueUnit(0.5)] };

        for (let frame = 0; frame < 1000; frame++) {
            vars.opacity[0]!.value = (frame % 100) / 100;
            transformTargetsStyle(vars, [target]);
        }

        expect(target.style.getPropertyValue("opacity")).toBe("0.99");
    });

    it("filters epoch-cleared leaves without leaking stale CSS", () => {
        const target = document.createElement("div");
        const vars: Record<string, any[]> = {
            opacity: [new ValueUnit(1)],
            transform: [new ValueUnit(1)],
        };

        transformTargetsStyle(vars, [target]);
        expect(target.style.getPropertyValue("opacity")).toBe("1");

        vars.opacity = [undefined];
        vars.transform = [undefined];
        transformTargetsStyle(vars, [target]);
        expect(target.style.getPropertyValue("opacity")).toBe("");
    });
});
