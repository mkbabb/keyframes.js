/**
 * Q.WD2 S1 (the P.W9 S3 grammar-fuzz harness, RE-SCOPED for value.js 1.1.0) —
 * the property-based @keyframes round-trip oracle.
 *
 * The three confirmed inv-O-2 breaches in value.js (none→NaN, color()-wrapper
 * loss, the round() TypeError) were HAND-DISCOVERED in audits. A round-trip
 * fuzz oracle would have caught them automatically. This harness generates
 * random VALID @keyframes fragments from MODEL grammars (not raw-string fuzz),
 * parses them via `CSSKeyframesAnimation.fromString`, serializes via
 * `CSSKeyframesToString`, re-parses, re-serializes, and asserts the serialized
 * `@keyframes` block is BYTE-STABLE across the round trip
 * (serialize→reparse→serialize) — the SAME structural-equality oracle
 * `proof:roundtrip-fidelity`'s `text` rows use. A byte-stable round trip means
 * the grammar+serializer preserved every value's structure (function name,
 * channel count, unit, wrapper); a divergence is a value.js serialization
 * regression on a commonly-used CSS value type.
 *
 * Why serialize→reparse→serialize (NOT `at(0.5)` numeric equality): a `calc()`
 * leaf cannot be sampled via `at(0.5)` without a live DOM box ("Cannot
 * interpolate computed values without a target element"), so a numeric-midpoint
 * oracle would EXCLUDE the math family. The byte-stable serialize oracle is
 * computed-safe AND catches the none-channel + wrapper-loss breaches (each
 * re-serializes to a DIFFERENT comma/wrapper shape — probe-confirmed
 * 2026-06-23: `oklch(0.6 NaN 200)` → `oklch(0.6, NaN, 200)` on re-parse;
 * `display-p3(1 0 0)` → `display-p3(1, 0, 0)`).
 *
 * The Q.WD2 re-scope vs. P.W9 (probe-re-confirmed 2026-06-23 against value.js
 * 1.1.0):
 *   - the `round()` arm is a STANDARD GREEN arm (fixed in 1.1.0 — it byte-stably
 *     round-trips `round(nearest, 3.7px, 1px)`); P.W9's permanent SKIP is OBSOLETE.
 *   - the none-channel + color()-wrapper arms are EXPECTED-FAILURE tripwires:
 *     they ASSERT the known-broken state (the round trip is NOT byte-stable) so
 *     the harness is GREEN-today, and auto-flip RED (alerting an implementer to
 *     promote them to standard green arms) when value.js's VJ-Q9
 *     serialization-fidelity fix lands and the round trip becomes byte-stable
 *     (consumed via the Q.WG4 `^1.2.0` re-pin). A permanently-RED arm on a
 *     sibling publish would be a BLOCKED harness — the scoped-GREEN discipline.
 *
 * Re-run by `scripts/proof-grammar-fuzz.mjs` (the source-grep + scoped-GREEN +
 * fixture-coverage half) + this `vitest run` body (the property half).
 */
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { CSSKeyframesToString } from "../../src/animation/compile/backward/format";

// ── CI run budget (Q.WD2 §S1) ──────────────────────────────────────────────────
// A FIXED seed for reproducibility; a CI-capped run count (the pre-release
// stress sweep raises it via the env knob). 30s per-property timeout.
const CASES = Number(process.env.KF_FUZZ_RUNS ?? 50);
const SEED = Number(process.env.KF_FUZZ_SEED ?? 42);
const fcOpts = { numRuns: CASES, seed: SEED } as const;

/** Just the `@keyframes` block (drop any leading `.class { … }` rule the
 *  serializer prepends) — mirrors roundtrip-fidelity.test.ts:62. */
const kfBlock = (css: string): string => css.slice(css.indexOf("@keyframes"));

/**
 * The structural round-trip oracle: parse → serialize → re-parse → re-serialize.
 * Returns the two serialized `@keyframes` blocks and whether they are BYTE-SAME.
 * A byte-stable pair means the grammar+serializer preserved the value's full
 * structure across the round trip.
 */
const structuralRoundTrip = async (
    css: string,
): Promise<{ once: string; twice: string; stable: boolean }> => {
    const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(css);
    const once = kfBlock(await CSSKeyframesToString(a, "fuzz"));
    const b = new CSSKeyframesAnimation({ duration: 1000 }).fromString(once);
    const twice = kfBlock(await CSSKeyframesToString(b, "fuzz"));
    return { once, twice, stable: once === twice };
};

// ── Arbitrary leaves ───────────────────────────────────────────────────────────
/** A bounded, fixed-precision float — value.js serializes floats faithfully, so
 *  a bounded grid keeps the generated CSS valid + the round trip deterministic. */
const unit01 = fc.float({ min: 0, max: 1, noNaN: true, noDefaultInfinity: true });
const small = fc.float({
    min: 0,
    max: 100,
    noNaN: true,
    noDefaultInfinity: true,
});
const r255 = fc.integer({ min: 0, max: 255 });
const hue = fc.float({ min: 0, max: 360, noNaN: true, noDefaultInfinity: true });
/** Round to 4 decimals so the generated literal is a clean CSS number (avoids a
 *  17-digit float that value.js round-trips but is noisy in a failure dump). */
const r4 = (n: number): number => Math.round(n * 1e4) / 1e4;

// ── colorArb — the GREEN-today color arms (value.js 1.1.0) ──────────────────────
const oklchArb = fc
    .tuple(unit01, unit01, hue)
    .map(([l, c, h]) => `oklch(${r4(l)} ${r4(c)} ${r4(h)})`);
const rgbArb = fc
    .tuple(r255, r255, r255)
    .map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`);
const colorMixArb = fc
    .tuple(
        fc.constantFrom("red", "blue", "green", "oklch(0.5 0.1 200)"),
        fc.constantFrom("yellow", "cyan", "magenta", "rgb(10, 20, 30)"),
        fc.integer({ min: 0, max: 100 }),
    )
    .map(([a, b, p]) => `color-mix(in oklch, ${a}, ${b} ${p}%)`);
const colorArb = fc.oneof(oklchArb, rgbArb, colorMixArb);

// ── mathArb — the GREEN-today math arms (round() FIXED in 1.1.0) ────────────────
const calcArb = fc
    .tuple(small, small)
    .map(([a, b]) => `calc(${r4(a)}px + ${r4(b)}px)`);
const clampArb = fc
    .tuple(small, small)
    .map(([v, max]) => {
        const hi = Math.max(v, max) + 1;
        return `clamp(0px, ${r4(v)}px, ${r4(hi)}px)`;
    });
const roundArb = fc
    .tuple(small, fc.constantFrom(1, 2, 5))
    .map(([v, step]) => `round(nearest, ${r4(v)}px, ${step}px)`);
const mathArb = fc.oneof(calcArb, clampArb, roundArb);

// ── keyframeStopArb — a model @keyframes from the GREEN-today value arms ─────────
/** A single declaration body — a color property over `colorArb`, OR a length
 *  property over `mathArb` (only the GREEN-today arms). */
const declArb = fc.oneof(
    colorArb.map((v) => `color: ${v};`),
    mathArb.map((v) => `width: ${v};`),
);
/** One to three stops with random `%` selectors (the integer 0–100 selector
 *  form — model grammar, never a named selector). */
const keyframeStopArb = fc
    .tuple(
        fc.uniqueArray(fc.integer({ min: 0, max: 100 }), {
            minLength: 1,
            maxLength: 3,
        }),
        fc.array(declArb, { minLength: 1, maxLength: 3 }),
    )
    .map(([stops, decls]) => {
        const body = stops
            .sort((a, b) => a - b)
            .map((pct) => `${pct}% { ${decls[pct % decls.length]} }`)
            .join(" ");
        return `@keyframes x { ${body} }`;
    });

// ── promoted round-trip arms (none-channel + color()-wrapper) — VJ-Q9 fixed in 1.2.0 ──
const noneChannelArb = fc
    .tuple(unit01, hue)
    .map(([l, h]) => `oklch(${r4(l)} none ${r4(h)})`);
const wrapperLossArb = fc
    .tuple(unit01, unit01, unit01)
    .map(([r, g, b]) => `color(display-p3 ${r4(r)} ${r4(g)} ${r4(b)})`);

// ── The property suite ──────────────────────────────────────────────────────────
describe("Q.WD2 S1 — grammar-fuzz: the GREEN-today round-trip arms (value.js 1.1.0)", () => {
    it("colorArb — plain oklch / rgb / color-mix round-trip byte-stable", async () => {
        await fc.assert(
            fc.asyncProperty(colorArb, async (value) => {
                const css = `@keyframes x { 0% { color: ${value}; } 100% { color: ${value}; } }`;
                const { stable, once, twice } = await structuralRoundTrip(css);
                expect(stable, `not byte-stable:\n${once}\n---\n${twice}`).toBe(
                    true,
                );
            }),
            fcOpts,
        );
    }, 30000);

    it("mathArb — calc / clamp / round(nearest) round-trip byte-stable (round() FIXED in 1.1.0 — the Q.WD2 re-scope)", async () => {
        await fc.assert(
            fc.asyncProperty(mathArb, async (value) => {
                const css = `@keyframes x { 0% { width: ${value}; } 100% { width: ${value}; } }`;
                const { stable, once, twice } = await structuralRoundTrip(css);
                expect(stable, `not byte-stable:\n${once}\n---\n${twice}`).toBe(
                    true,
                );
            }),
            fcOpts,
        );
    }, 30000);

    it("keyframeStopArb — random multi-stop @keyframes over the GREEN arms round-trip byte-stable", async () => {
        await fc.assert(
            fc.asyncProperty(keyframeStopArb, async (css) => {
                const { stable, once, twice } = await structuralRoundTrip(css);
                expect(
                    stable,
                    `not byte-stable for ${css}:\n${once}\n---\n${twice}`,
                ).toBe(true);
            }),
            fcOpts,
        );
    }, 30000);
});

describe("Q.WD2 S1 — grammar-fuzz: the PROMOTED round-trip arms (VJ-Q9 fixed in value.js 1.2.0)", () => {
    // Q.WG4 GATED consume: value.js 1.2.0 (VJ-Q9) fixed both serialization breaches —
    // `oklch(L none H)` now serializes `none` (not `NaN`), and `color(display-p3 …)`
    // preserves the `color()` wrapper. The former EXPECTED-FAILURE tripwires are PROMOTED
    // to standard byte-stable round-trip arms — the auto-detect-on-fix the scoped-GREEN
    // posture promised, fired on the `^1.2.0` re-pin.
    it("noneChannelArb — oklch(L none H) round-trips byte-stable (none preserved, no NaN — VJ-Q9)", async () => {
        await fc.assert(
            fc.asyncProperty(noneChannelArb, async (value) => {
                const css = `@keyframes x { 0% { color: ${value}; } 100% { color: ${value}; } }`;
                const { stable, once, twice } = await structuralRoundTrip(css);
                expect(
                    /NaN/.test(once),
                    `none→NaN breach regressed (VJ-Q9): ${once}`,
                ).toBe(false);
                expect(stable, `not byte-stable:\n${once}\n---\n${twice}`).toBe(
                    true,
                );
            }),
            fcOpts,
        );
    }, 30000);

    it("wrapperLossArb — color(display-p3 …) round-trips byte-stable (color() wrapper preserved — VJ-Q9)", async () => {
        await fc.assert(
            fc.asyncProperty(wrapperLossArb, async (value) => {
                const css = `@keyframes x { 0% { color: ${value}; } 100% { color: ${value}; } }`;
                const { stable, once, twice } = await structuralRoundTrip(css);
                // The wrapper is now PRESERVED: the serialized form keeps the authored
                // `color(display-p3 …)` (never the bare invalid-CSS `display-p3(…)`).
                expect(
                    /color\(display-p3/.test(once),
                    `color() wrapper-loss regressed (VJ-Q9): ${once}`,
                ).toBe(true);
                expect(stable, `not byte-stable:\n${once}\n---\n${twice}`).toBe(
                    true,
                );
            }),
            fcOpts,
        );
    }, 30000);
});
