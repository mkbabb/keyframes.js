/**
 * resolve.bench.ts — S.F5b S1 (fold row 45): the FIRST bench coverage of the
 * `resolve/` zone (the emerging-CSS lowering pass — `if()`/`@function`/`env()`/
 * `spring()`), which shipped at P.W13/Q.WB1 and grew to ~887L with ZERO bench
 * coverage. A bench without a taxonomy row rots (sf-#6), so every arm here is
 * classified in `bench/taxonomy.json`.
 *
 * The `resolve/` zone is a COMPILE-time pass (once per `resolveKeyframes`, NOT a
 * per-frame hot path), so these arms are RUN-CHECK: they make the zone's cost
 * VISIBLE and catch a TypeError/empty-result regression when `npm run bench`
 * executes them, NOT a wall-clock budget (C-10 — no raw absolute ms/hz floor). The
 * SOTA-perf floors that ARE budgeted live in the interp/compositor suites; the
 * lowering pass is measured, not floored.
 *
 * Coverage spans the zone's members: `core.ts` (the recursion + the cheap
 * structural sniff), `resolve-if.ts` (the `if()` branch resolution),
 * `resolve-function.ts` (`@function` call-inlining, reached through the adapter),
 * `spring-css.ts` (the `spring()` → kf-Easing physics), and the common
 * all-concrete keyframe (the zero-cost `hasResolvableValue` skip the adapter pays
 * on EVERY keyframe, resolvable or not).
 *
 * Imports `resolveKeyframes` from the VALUE module `compile/adapter` + the zone's
 * public helpers from `resolve`, never the type-only barrel `../src/animation`.
 */
import { bench, describe } from "vitest";
import { parseCSSValue, ValueArray } from "@mkbabb/value.js";
import { resolveKeyframes } from "../src/animation/compile/adapter";
import {
    hasResolvableValue,
    makeResolveContext,
    resolveValues,
    springCssToOptions,
} from "../src/animation/resolve";

// ── Fixtures (parsed/held once; the bench body pays only the resolution) ───────

/** An `if()`/`media()` keyframe stream — the Phase-1 element-independent arm. */
const IF_MEDIA_CSS =
    "@keyframes k {\n" +
    "  0% { width: if(media(min-width: 600px): 10px; else: 20px); color: if(supports(color: lch(0 0 0)): red; else: blue); }\n" +
    "  33% { width: if(media(max-width: 400px): 30px; else: 40px); }\n" +
    "  66% { width: if(media(min-width: 900px): 50px; else: 60px); }\n" +
    "  100% { width: 100px; color: green; }\n" +
    "}";

/** A nested `@function` call stream — the call-inlining arm (recurse + bind). */
const FUNCTION_CSS =
    "@function --double(--x) { result: calc(var(--x) * 2); }\n" +
    "@function --triple(--y) { result: calc(var(--y) * 3); }\n" +
    "@keyframes k {\n" +
    "  0% { width: --double(--triple(10px)); margin: --double(5px); }\n" +
    "  100% { width: 200px; margin: 40px; }\n" +
    "}";

/** A `spring()` timing-function stream — the spring-css physics arm. */
const SPRING_CSS =
    "@keyframes k {\n" +
    "  0% { transform: translateX(0px); animation-timing-function: spring(1 100 10 0); }\n" +
    "  100% { transform: translateX(300px); }\n" +
    "}";

/**
 * An all-concrete 6-stop keyframe stream — NO lowerable node. The adapter pays
 * only the `hasResolvableValue` structural sniff on each declaration (the pass
 * returns the same nodes untouched); this arm measures the zone's overhead on
 * the OVERWHELMING common case (a plain keyframe animation the resolver skips).
 */
const CONCRETE_CSS =
    "@keyframes k {\n" +
    "  0% { transform: translateX(0px) scale(1); opacity: 0; color: rgb(0 0 0); }\n" +
    "  20% { transform: translateX(60px) scale(1.1); opacity: 0.2; }\n" +
    "  40% { transform: translateX(120px) scale(1.2); opacity: 0.4; }\n" +
    "  60% { transform: translateX(180px) scale(1.1); opacity: 0.6; }\n" +
    "  80% { transform: translateX(240px) scale(1.05); opacity: 0.8; }\n" +
    "  100% { transform: translateX(300px) scale(1); opacity: 1; color: rgb(255 255 255); }\n" +
    "}";

// A pre-parsed `if()` value + a deeply-nested concrete value for the direct
// core-recursion arms (built once; the body reconstructs only the mutable ctx).
const IF_VALUE = new ValueArray(
    parseCSSValue(
        "if(supports(color: lch(0 0 0)): red; else: blue)",
    ) as never,
);
const NESTED_CONCRETE_VALUE = new ValueArray(
    parseCSSValue("calc(calc(10px * 3) + calc(20px / 2))") as never,
    parseCSSValue("translate3d(10px, 20px, 30px)") as never,
);

describe("resolve/ zone — emerging-CSS lowering (S.F5b, run-check)", () => {
    bench("resolveKeyframes · if()/media 4-stop pipeline", () => {
        resolveKeyframes(IF_MEDIA_CSS);
    });

    bench("resolveKeyframes · @function nested inline", () => {
        resolveKeyframes(FUNCTION_CSS);
    });

    bench("resolveKeyframes · spring() timing resolution", () => {
        resolveKeyframes(SPRING_CSS);
    });

    bench("resolveKeyframes · all-concrete 6-stop (zero-cost sniff)", () => {
        resolveKeyframes(CONCRETE_CSS);
    });

    bench("resolveValues · if() ValueArray (core recursion)", () => {
        resolveValues(IF_VALUE, makeResolveContext(new Map()));
    });

    bench("hasResolvableValue · nested concrete scan (common-case skip)", () => {
        hasResolvableValue(NESTED_CONCRETE_VALUE);
    });

    bench("springCssToOptions · (m,k,c,v0) → (response, damping)", () => {
        springCssToOptions([1, 100, 10, 0]);
    });
});
