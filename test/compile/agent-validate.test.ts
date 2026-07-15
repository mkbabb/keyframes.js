/**
 * agent-validate.test.ts — L.W6 THE AGENT-AUTHORING VERB (the behaviour proof).
 *
 * `validate(css, opts?)` is the read-only projection over three already-gate-
 * proven typed channels — `ResolvedKeyframes.diagnostics` (adapter),
 * `CompiledCSS.{eligible,refusals}` (compile), `WAAPIEligibility` (waapi) — onto
 * ONE agent-shaped envelope (`ValidateResult`) an LLM agent branches on without
 * scraping a message string. `explain(css, opts?)` formats the same verdict
 * human/LLM-readable. This file owns the runtime behaviour checks (clauses
 * (c) + (d)); `proof:publish` owns the package boundary.
 *
 * BORN-RED WITNESS: on today's tree `src/animation/validate.ts` does NOT exist,
 * so this test FILE fails to load (the `validate`/`explain` import cannot
 * resolve) — every clause reds by construction. It greens only once:
 *   - S1 ships `validate` (clause (a)/(c)/(d) can import it),
 *   - L.W1 honors the @property block on the backward pass (clause (c) verdict
 *     is honest),
 *   - L.W2 CC-3.5 closed the multi-color silent densify (clause (d) refuses
 *     instead of silently shipping eligible:true).
 *
 * ── L.W1 S1 CORRECTION (load-bearing for clause (c)) ─────────────────────────
 * Keyframe `!important` is SPEC-INVALID per CSS Animations §3, and value.js
 * 0.13.0 DROPS the whole declaration at the AST level — correct, it mirrors the
 * browser. kf does NOT honor/emit keyframe `!important` (emitting it would ship
 * invalid CSS). So clause (c) over a fixture containing `opacity: 0 !important`
 * asserts the SPEC-FAITHFUL reality:
 *   - `parseable === true` (the REST of the block parses; value.js does not
 *     throw on the dropped declaration),
 *   - the `@property` block (L.W1 S2) DOES round-trip and is eligible
 *     (`eligible === true`),
 *   - there is NO keyframe-`!important` drop-row in `diagnostics` (value.js
 *     SILENTLY drops it at the AST — the diagnostic-surfacing of that drop is a
 *     value.js-O dispatch, not yet in validate's projection).
 * It does NOT assert "`!important` is honored/emitted" — that claim was RETRACTED.
 */
import { describe, expect, it } from "vitest";
import { validate, explain } from "../../src/animation/validate";

// ── The honored-surface fixture (clause (c)) — @property + keyframe !important ──
//
// The keyframe `!important` is the ⚠31 input: SPEC-INVALID, dropped by value.js
// at the AST (the L.W1 S1 CORRECTION). The `@property` block IS honored on the
// backward pass (L.W1 S2). The fixture exercises BOTH so the projection's
// positive arm (parseable:true + eligible:true, no drop-row) is proven HONEST.
const HONORED_SET = `
@keyframes honored-set {
  from { opacity: 0 !important; animation-composition: add; }
  to   { opacity: 1 !important; }
}
@property --col {
  syntax: '<color>';
  inherits: false;
  initial-value: oklch(50% 0.2 200);
}
`;

// ── The multi-color fixture (clause (d)) — a 2-stop multi-color track ──────────
//
// Two color leaves change across one segment. Pre-L.W2, `compile-color.ts:190`
// silently early-out at `colorKeys.length > 1`, shipping the verbatim sRGB block
// with `eligible:true` (a ΔE drift the single-color path refuses). L.W2 CC-3.5
// closed that hole: under a tight ΔE-ε the densify cannot hold the band → the
// compiler REFUSES with the named `perceptual-oklab` reason instead of shipping
// a lossy artifact.
const COLOR_DRIFT = `
@keyframes color-drift {
  from { background-color: oklch(30% 0.3 120); color: red; }
  to   { background-color: oklch(70% 0.1 260); color: blue; }
}
`;

// ── (c) — validate projects the L.W1 POST-CURE state honestly ──────────────────
describe("L.W6 clause (c) — validate projects the @property/!important fixture honestly (spec-faithful)", () => {
    it("reports parseable:true — value.js parses the block (the dropped !important does not throw)", async () => {
        const result = await validate(HONORED_SET);
        // The REST of the block parses; the spec-invalid keyframe `!important`
        // declaration is silently dropped at the AST, NOT a parse failure.
        expect(result.parseable).toBe(true);
    });

    it("reports eligible:true — the @property block round-trips faithfully (L.W1 S2)", async () => {
        const result = await validate(HONORED_SET);
        // The honored surface compiles faithfully: the `@property` registration
        // round-trips and no CompileRefusal is raised for it.
        expect(result.eligible).toBe(true);
        expect(result.refusals).toEqual([]);
    });

    it("carries NO keyframe-!important drop-row in diagnostics (value.js silently drops it; not in validate's projection)", async () => {
        const result = await validate(HONORED_SET);
        // The honor/spec-faithful surface means the silent-fallback channel is
        // empty for these inputs — no `IMPORTANT_DROPPED` / `PROPERTY_NOT_SERIALIZED`
        // row (those would describe a drop the spec-faithful path does not surface
        // here). The diagnostic-surfacing of the value.js AST drop is a value.js-O
        // dispatch, NOT in validate's projection yet.
        const messages = result.diagnostics.map((d) => `${d.code} ${d.message}`);
        const importantDrop = messages.filter(
            (m) => /important/i.test(m) || /\bIMPORTANT_DROPPED\b/.test(m),
        );
        expect(importantDrop).toEqual([]);
        const propertyDrop = result.diagnostics.filter(
            (d) => /PROPERTY_NOT_SERIALIZED/.test(d.code),
        );
        expect(propertyDrop).toEqual([]);
    });
});

// ── (d) — validate projects the L.W2 multi-color refusal honestly ──────────────
describe("L.W6 clause (d) — validate projects the multi-color perceptual-oklab refusal (L.W2)", () => {
    it("reports eligible:false + refusals[0].reason === 'perceptual-oklab' (under a tight ΔE-ε)", async () => {
        // An impossibly tight ΔE-ε forces the refusal (the densify cannot hold a
        // band below the gamut-map/quantization residual) — the named fallback,
        // NOT a silent verbatim sRGB emit. Pre-L.W2 the multi-color path early-out
        // returned null and the outer loop shipped eligible:true.
        const result = await validate(COLOR_DRIFT, {
            compile: { densifyStops: 8, deltaEEpsilon: 1e-9 },
        });
        expect(result.eligible).toBe(false);
        expect(result.refusals.length).toBeGreaterThan(0);
        expect(result.refusals[0]!.reason).toBe("perceptual-oklab");
    });

    it("explain(css) returns the same verdict as deterministic human/LLM-readable text", async () => {
        const text = await explain(COLOR_DRIFT, {
            compile: { densifyStops: 8, deltaEEpsilon: 1e-9 },
        });
        // explain projects validate's typed result deterministically — it names
        // the keyframes block, the compile-eligibility verdict, and the refusal
        // reason verbatim (no free-text generation, no locale formatting).
        expect(typeof text).toBe("string");
        expect(text).toMatch(/color-drift/);
        expect(text).toMatch(/perceptual-oklab/);
    });
});
