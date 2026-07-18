import { describe, expect, it } from "vitest";
import {
    easing,
    easeInBounce,
    easeOutExpo,
    smoothStep3,
} from "@mkbabb/value.js/easing";
import { EASING_GROUPS } from "@utils/reference-data/easingGroups";

const catalogueItems = EASING_GROUPS.flatMap((group) => group.items);

describe("the demo-owned easing catalogue", () => {
    it("owns non-empty rendered copy for every unique curve", () => {
        expect(catalogueItems).toHaveLength(29);
        expect(new Set(catalogueItems.map(({ name }) => name)).size).toBe(
            catalogueItems.length,
        );

        for (const { description } of catalogueItems) {
            expect(description.trim()).not.toBe("");
        }
    });

    it("contains only Value-resolvable named curves", () => {
        const editorEntries = new Set([
            "cubic-bezier",
            "steps",
            "step-start",
            "step-end",
        ]);

        for (const { name } of catalogueItems) {
            if (editorEntries.has(name)) continue;
            const result = easing(name);
            expect(result.ok, name).toBe(true);
            if (result.ok) expect(typeof result.value).toBe("function");
        }
    });

    it.each([
        ["ease-out-expo", "exponential decay", easeOutExpo],
        ["smooth-step-3", "Hermite interpolation", smoothStep3],
        ["ease-in-bounce", "bouncing ramp up", easeInBounce],
    ] as const)(
        "uses Value's canonical %s easing",
        (name, description, easing) => {
            expect(
                catalogueItems.find((item) => item.name === name)?.description,
            ).toBe(description);
            expect(easing(0)).toBe(0);
            expect(easing(1)).toBe(1);
        },
    );
});
