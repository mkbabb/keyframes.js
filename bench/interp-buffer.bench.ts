/** Current interpolation hot-path measurements over structural Value 4 slots. */
import { bench, describe } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { loadAnimationEngine, warmEngine } from "../src/animation";
import type { FlatAuthoredValues } from "../src/animation/compile/value-ast";
import type { CompiledAnimationFrame } from "../src/animation/compile/frame";

const FLAT_KEYS = [
    "opacity",
    "width",
    "height",
    "top",
    "left",
    "right",
    "bottom",
    "margin-top",
    "margin-left",
    "padding-top",
    "padding-left",
    "border-width",
] as const;

const makeAnim = (keys: number) => {
    const stops = 5;
    const css = Array.from({ length: stops }, (_, stop) => {
        const percent = Math.round((stop / (stops - 1)) * 100);
        const declarations = FLAT_KEYS.slice(0, keys)
            .map((key, index) => {
                const value = ((stop + index) % 10) * 10 + 1;
                return key === "opacity"
                    ? `${key}: ${value / 100}`
                    : `${key}: ${value}px`;
            })
            .join("; ");
        return `${percent}% { ${declarations}; }`;
    }).join("\n");
    return new CSSKeyframesAnimation({ duration: 1000 }).fromString(css);
};

describe("interpFrames — threaded authored-value buffer", () => {
    for (const keys of [2, 5, 12] as const) {
        const animation = makeAnim(keys);
        const out: FlatAuthoredValues = {};

        bench(`K=${keys} · 600-frame steady window`, () => {
            for (let frame = 0; frame < 600; frame++) {
                animation.interpFrames((frame / 600) * 1000, false, out);
            }
        });
    }
});

/**
 * The prior per-slot-vs-SoA decision arms are retired: the obsolete wrapper
 * representation and its per-leaf dispatch were deleted. This measures the landed
 * NumericFoldPlan directly and fails collection if a numeric corpus does not
 * compile to the current InterpSlot partition.
 */
describe("processFrame — landed NumericFoldPlan K ladder", () => {
    for (const keys of [3, 8, 12] as const) {
        const animation = makeAnim(keys);
        for (const frame of animation.frames as CompiledAnimationFrame[]) {
            const plan = frame._numericPlan;
            if (plan === undefined || plan.numeric.length !== keys) {
                throw new Error(
                    `Expected ${keys} numeric InterpSlots, received ${
                        plan?.numeric.length ?? 0
                    }.`,
                );
            }
        }
        const out: FlatAuthoredValues = {};

        bench(`NumericFoldPlan · K=${keys} · 600-frame window`, () => {
            for (let frame = 0; frame < 600; frame++) {
                animation.interpFrames((frame / 600) * 1000, false, out);
            }
        });
    }
});

warmEngine();

describe("warmEngine pre-resolve", () => {
    bench("memoized heavy surface", async () => {
        const engine = await loadAnimationEngine();
        if (typeof engine.CSSKeyframesAnimation !== "function") {
            throw new Error("warmEngine did not settle the heavy surface.");
        }
    });
});
