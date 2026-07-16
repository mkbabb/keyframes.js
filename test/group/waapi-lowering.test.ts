import { describe, expect, it, vi } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { AnimationGroup, isGroupWAAPIEligible, lowerGroupWAAPI } from "../../src/animation/group";

const animation = (el: HTMLElement, value: string, useWAAPI = true) => {
    const a = new CSSKeyframesAnimation({ duration: 100, useWAAPI }, el);
    a.fromString(`@keyframes x { from { opacity: ${value}; animation-timing-function: linear } to { opacity: ${value} } }`);
    return a;
};

describe("U.C16 group WAAPI lowering", () => {
    it("lowers a single-target all-eligible additive stack to one native effect per layer", () => {
        const el = document.createElement("div");
        const animate = vi.fn(() => ({}) as Animation);
        Object.defineProperty(el, "animate", { configurable: true, value: animate });
        const first = animation(el, "0.2");
        const second = animation(el, "0.3");
        const group = AnimationGroup.of(first, { animation: second, layer: { op: "add" } });
        const verdict = isGroupWAAPIEligible(group);
        expect(verdict.eligible).toBe(true);
        const handles = lowerGroupWAAPI(group);
        expect(handles).toHaveLength(2);
        expect(animate).toHaveBeenCalledTimes(2);
        expect((animate.mock.calls as unknown[][])[1]?.[1]).toMatchObject({ composite: "add" });
    });

    it("refuses weight layers so the caller can retain the rAF compositor", () => {
        const el = document.createElement("div");
        Object.defineProperty(el, "animate", { configurable: true, value: vi.fn() });
        const first = animation(el, "0.2");
        const second = animation(el, "0.3");
        const group = AnimationGroup.of(first, { animation: second, layer: { op: "replace", weight: 0.5 } });
        const verdict = isGroupWAAPIEligible(group);
        expect(verdict).toEqual({ eligible: false, reason: "weight-driven layer has no native composite equivalent" });
        expect(lowerGroupWAAPI(group)).toBeNull();
    });

    it("returns to rAF when native effect construction rejects", () => {
        const el = document.createElement("div");
        const cancel = vi.fn();
        let calls = 0;
        Object.defineProperty(el, "animate", {
            configurable: true,
            value: vi.fn(() => {
                calls += 1;
                if (calls === 2) throw new TypeError("unsupported composite");
                return { cancel } as unknown as Animation;
            }),
        });
        const first = animation(el, "0.2");
        const second = animation(el, "0.3");
        const group = AnimationGroup.of(first, second);

        expect(lowerGroupWAAPI(group)).toBeNull();
        expect(cancel).toHaveBeenCalledOnce();
    });
});
