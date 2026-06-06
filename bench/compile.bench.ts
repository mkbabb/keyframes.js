/**
 * compile.bench.ts — FrameCompiler compile-throughput, editing-session profile
 * (F.W1 S4a, `a-test-quality §4` / `a-framecompiler-remeasure §1`).
 *
 * Cold `fromString` (parse → compile → sampled `frames[]`) over 2/6/11/50/200-stop
 * animations — the full-tick denominator the W8 RECORD/BOOK lacked. Before this
 * the bench tier had NO FrameCompiler coverage: `a-test-quality §6` — "F cannot
 * re-measure E's W8 withhold without a FrameCompiler bench that doesn't exist."
 * This is the instrument that lets F honestly re-measure (or retire) E's W8
 * S1/S2/S3 withholds rather than re-asserting "negligible".
 *
 * Each iteration constructs a FRESH `CSSKeyframesAnimation` and runs `fromString`
 * end-to-end — the editing-session reality (a keystroke re-parses + re-compiles
 * the whole stylesheet). Imports `CSSKeyframesAnimation` from the VALUE module
 * `engine`, never the type-only barrel (F.W1 S1).
 */
import { bench, describe } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";

/**
 * An `N`-stop keyframe string with a realistic multi-property body per stop
 * (opacity + a 4-function transform) — the same per-value mix the compile
 * pipeline walks in `parseAndFlattenObject` → `createInterpVarValue`.
 */
const makeKeyframes = (stops: number): string =>
    Array.from({ length: stops }, (_, i) => {
        const pct = Math.round((i / (stops - 1)) * 100);
        return (
            `${pct}% { opacity: ${i / stops}; ` +
            `transform: translateX(${i * 10}px) translateY(${i * 5}px) ` +
            `scale(${1 + i / 100}) rotate(${i * 6}deg); }`
        );
    }).join("\n");

describe("FrameCompiler compile-throughput (cold fromString)", () => {
    const profile = [2, 6, 11, 50, 200] as const;

    for (const stops of profile) {
        const css = makeKeyframes(stops);
        bench(`${stops}-stop cold compile`, () => {
            new CSSKeyframesAnimation({ duration: 1000 }).fromString(css);
        });
    }
});
