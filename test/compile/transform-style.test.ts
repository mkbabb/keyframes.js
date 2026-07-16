import { describe, expect, it } from "vitest";
import { transformTargetsStyle } from "../../src/animation/compile/value-ast";

describe("transformTargetsStyle apply seam", () => {
    it("reuses the serialized shape across a steady apply window", () => {
        const target = document.createElement("div");
        const vars = { opacity: 0.5 };

        for (let frame = 0; frame < 1000; frame++) {
            vars.opacity = (frame % 100) / 100;
            transformTargetsStyle(vars, [target]);
        }

        expect(target.style.getPropertyValue("opacity")).toBe("0.99");
    });

    it("filters epoch-cleared leaves without leaking stale CSS", () => {
        const target = document.createElement("div");
        const vars: Record<string, number | undefined> = {
            opacity: 1,
            transform: 1,
        };

        transformTargetsStyle(vars, [target]);
        expect(target.style.getPropertyValue("opacity")).toBe("1");

        vars.opacity = undefined;
        vars.transform = undefined;
        transformTargetsStyle(vars, [target]);
        expect(target.style.getPropertyValue("opacity")).toBe("");
    });
});
