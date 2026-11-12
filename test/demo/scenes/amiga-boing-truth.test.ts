/**
 * owner-1112 (item 5, "#/amiga — animation is not correct") — the Boing's
 * bounce is the exact parabola (constant gravity), its shadow reads on the dark
 * ground.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { CubicBezier } from "@mkbabb/value.js/easing";

const read = (rel: string) => readFileSync(resolve(process.cwd(), rel), "utf8");
const demo = read("demo/scenes/amiga/useAmigaDemo.ts");
const bezier = (name: "FALL" | "RISE") => {
    const m = demo.match(new RegExp(`const ${name} = "cubic-bezier\\(([^)]*)\\)"`));
    expect(m, name).not.toBeNull();
    const [x1, y1, x2, y2] = m![1]!.split(",").map(Number) as [number, number, number, number];
    const r = CubicBezier(x1, y1, x2, y2) as unknown as { ok: boolean; value: (t: number) => number };
    expect(r.ok).toBe(true);
    return r.value;
};

describe("the Boing bounce is the parabola (owner-1112 item 5)", () => {
    it("the fall is y = t² and the rise y = 1 − (1 − t)², to within 0.5 %", () => {
        const fall = bezier("FALL");
        const rise = bezier("RISE");
        for (const t of [0.1, 0.25, 0.5, 0.75, 0.9]) {
            expect(Math.abs(fall(t) - t * t), `fall ${t}`).toBeLessThan(0.005);
            expect(Math.abs(rise(t) - (1 - (1 - t) ** 2)), `rise ${t}`).toBeLessThan(0.005);
        }
    });
    it("the dark-theme contact shadow has the alpha to read on a near-black ground", () => {
        const m = read("demo/scenes/amiga/useAmigaThree.ts").match(/SHADOW_PEAK = \{ light: ([\d.]+), dark: ([\d.]+) \}/);
        expect(Number(m![2])).toBeGreaterThanOrEqual(0.8);
    });
});
