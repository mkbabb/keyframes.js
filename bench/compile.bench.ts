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
import { parseStylesheet } from "@mkbabb/value.js/css";
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

/**
 * The CF-1 compile-latency-map witness (G.W2 S4b · the supplemental fold).
 *
 * Pairs the value.js `parse()` leaf against the full `fromString` at N≥50, the
 * two cases the `a-perf-compile-flatten-bitpack CF-1` finding maps: the compile
 * step's cost lives in value.js's `tryParseCache`-backed parse, NOT kf's own
 * O(N)-SOTA frame layout (CF-2 killed the O(N²) reconcile; SoA is a runtime,
 * not a compile, lever — CF-4). The two bench cases let a gate read the ratio
 * (`parse-hz` vs `fromString-hz`) and surface a kf-side compile hot-spot the
 * moment one appears — i.e. if `fromString` grows materially slower than the
 * value.js parse it wraps, the parse fraction drops and the map is stale.
 *
 * The `parse()` case uses Value 4's `parseStylesheet` (the grammar parse the
 * FrameCompiler invokes) over the SAME `@keyframes` body — the production-path
 * parse leaf, no kf compile on top. Imports `CSSKeyframesAnimation` from the
 * VALUE module `engine` (F.W1 S1).
 */
describe("compile latency map — value.js parse() vs fromString (CF-1, G.W2)", () => {
    const profile = [50, 200] as const;

    for (const stops of profile) {
        const css = makeKeyframes(stops);
        const sheet = `@keyframes k {\n${css}\n}`;

        bench(`N=${stops} · value.js parse() (grammar leaf)`, () => {
            parseStylesheet(sheet);
        });

        bench(`N=${stops} · fromString (parse + compile + sample)`, () => {
            new CSSKeyframesAnimation({ duration: 1000 }).fromString(css);
        });
    }
});
