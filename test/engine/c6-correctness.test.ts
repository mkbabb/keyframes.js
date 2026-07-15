import { describe, expect, it, vi } from "vitest";
import { NumericAnimation } from "../../src/animation/physics/numeric";
import { captureUnderlyingBase } from "../../src/animation/engine/composition";

describe("U.C6 engine correctness", () => {
    it("owns numeric .at() scratch per animation instance", () => {
        const a = new NumericAnimation([{ x: 0 }, { x: 1 }]);
        const b = new NumericAnimation([{ x: 10 }, { x: 20 }]);
        a.at(0.25);
        b.at(0.75);

        const scratch = (value: NumericAnimation<{ x: number }>) =>
            (value as unknown as { _out: Float64Array })._out;
        expect(scratch(a)).not.toBe(scratch(b));
        expect(a.at(0.25).x).toBeCloseTo(0.25);
        expect(b.at(0.75).x).toBeCloseTo(17.5);
    });

    it("parses a composed base property once per capture run", () => {
        const getPropertyValue = vi.fn(() => "10 20");
        const target = { style: { getPropertyValue } } as unknown as HTMLElement;
        const pose = new Map<string, number[]>();

        expect(captureUnderlyingBase(target, "translateX", 2, pose)).toEqual([10, 20]);
        expect(captureUnderlyingBase(target, "translateX", 1, pose)).toEqual([10]);
        expect(getPropertyValue).toHaveBeenCalledTimes(1);
    });
});
