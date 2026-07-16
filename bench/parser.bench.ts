/**
 * parser.bench.ts — the parsing-charter measurement substrate (F.W1 S4b,
 * `parsing/_SYNTHESIS-parsing-sota KF-10` / `NEW-40` / `p-parse-perf-F`).
 *
 * The SHAPED parser bench the parsing dive names as the charter deliverable.
 * Beyond the original cold `fromString` benches (kept), three shapes:
 *
 *   1. a REALISTIC per-value corpus — lengths/colors/calc/transforms, not just
 *      `opacity` — the value mix the value.js + parse-that hand-offs gate against;
 *   2. the CACHE-BUSTER shape — a unique value per iteration so `tryParseCache`
 *      never hits (the editor-keystroke reality: warm ~94µs → cache-busting
 *      ~247µs ≈ 2.6×). This is the row KF-9/`NEW-24` (`splitPathKey`'s
 *      double-`split(".")` alloc) measures itself against, MEASURE-FIRST;
 *   3. a LAYER-ISOLATION micro-bench — the bare `parseCssValue` (the value.js
 *      leaf) vs the full `fromString` pipeline, the rows the value.js Wave-A
 *      `any()`→`dispatch()` and parse-that §1.5 hand-offs collapse.
 *
 * Imports `CSSKeyframesAnimation` from the VALUE module `engine` (the S1 fix),
 * never the type-only barrel; the bare-value leaf is Value 4's typed
 * `parseCssValue` Result boundary.
 */
import { bench, describe } from "vitest";
import { parseCssValue } from "@mkbabb/value.js/css";
import { CSSKeyframesAnimation } from "../src/animation/engine";

// ── Cold corpora (the original benches, kept) ────────────────────────────────

const simpleKeyframes = `
    from { opacity: 0; }
    to { opacity: 1; }
`;

const complexKeyframes = Array.from({ length: 11 }, (_, i) => {
    const pct = Math.round((i / 10) * 100);
    return `${pct}% { opacity: ${i / 10}; transform: translateX(${i * 20}px) translateY(${i * 10}px); }`;
}).join("\n");

describe("keyframe parsing", () => {
    bench("simple 2-stop (cold)", () => {
        new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            simpleKeyframes,
        );
    });

    bench("complex 11-stop (cold)", () => {
        new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            complexKeyframes,
        );
    });
});

describe("fromString end-to-end", () => {
    bench("simple 2-stop full pipeline", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            simpleKeyframes,
        );
        // Simulate one frame of interpolation
        anim.interpFrames(500, false);
    });

    bench("complex 11-stop full pipeline", () => {
        const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            complexKeyframes,
        );
        anim.interpFrames(500, false);
    });
});

// ── S4b.1 — the realistic per-value corpus ───────────────────────────────────
// Lengths/colors/calc/transforms — the value mix the value.js + parse-that
// hand-offs walk, not the opacity-only sliver the original benches measured.

const realisticKeyframes = `
    0% {
        opacity: 0;
        width: 100px;
        background-color: rgb(255, 0, 0);
        color: hsl(200, 50%, 40%);
        left: calc(100% - 50px);
        margin: calc(1rem + 2vw);
        transform: translateX(0px) translateY(10px) scale(1) rotate(0deg) skewX(2deg);
        filter: blur(0px) brightness(1);
    }
    100% {
        opacity: 1;
        width: 400px;
        background-color: rgb(0, 128, 255);
        color: hsl(40, 80%, 60%);
        left: calc(100% - 250px);
        margin: calc(2rem + 5vw);
        transform: translateX(200px) translateY(80px) scale(1.5) rotate(180deg) skewX(8deg);
        filter: blur(4px) brightness(1.4);
    }
`;

describe("parse — realistic per-value corpus", () => {
    bench("lengths/colors/calc/transforms (cold)", () => {
        new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            realisticKeyframes,
        );
    });
});

// ── S4b.2 — the cache-buster shape ───────────────────────────────────────────
// A UNIQUE value per iteration so `tryParseCache` (keyed by `${childKey}:${strValue}`)
// never hits — the editor-keystroke reality the warm cold benches above mask. A
// monotonic counter perturbs every leaf, so each `fromString` pays the full
// combinator parse, not the memo.

let bust = 0;
const makeBustingKeyframes = (n: number): string => `
    0% {
        opacity: 0;
        width: ${100 + n}px;
        background-color: rgb(${n % 256}, ${(n * 2) % 256}, ${(n * 3) % 256});
        transform: translateX(${n}px) translateY(${n * 2}px) rotate(${n % 360}deg);
    }
    100% {
        opacity: 1;
        width: ${400 + n}px;
        background-color: rgb(${(n + 1) % 256}, ${(n * 5) % 256}, ${(n * 7) % 256});
        transform: translateX(${n + 200}px) translateY(${n * 3}px) rotate(${(n + 180) % 360}deg);
    }
`;

describe("parse — cache-buster (tryParseCache never hits)", () => {
    bench("unique value per iteration (full combinator parse)", () => {
        new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            makeBustingKeyframes(bust++),
        );
    });
});

// ── S4b.3 — the layer-isolation micro-bench ──────────────────────────────────
// The bare Value 4 leaf (`parseCssValue`) vs the full keyframes pipeline. The
// contrast exposes how much of `fromString` is the leaf parse vs the grammar +
// reconcile + compile layers the keyframes engine owns on top.

describe("parse — layer isolation (bare leaf vs full pipeline)", () => {
    bench("bare parseCssValue — single length", () => {
        parseCssValue("123.45px");
    });

    bench("bare parseCssValue — transform function", () => {
        parseCssValue("translateX(200px)");
    });

    bench("bare parseCssValue — calc expression", () => {
        parseCssValue("calc(100% - 50px)");
    });

    bench("full pipeline — single-property 2-stop", () => {
        new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "from { transform: translateX(0px); } to { transform: translateX(200px); }",
        );
    });
});
