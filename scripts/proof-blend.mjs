#!/usr/bin/env node
/**
 * proof:blend — the G.W17 dead-leaf correctness gate.
 *
 * The `add` + `weighted` blend arms guarded `isNumericUnit(existing)` on a bare
 * `ValueUnit`, but the leaf is a `ValueUnit[]` (`frame-compiler.ts` builds
 * `flatVars` via `value.map(v => v.value)`), so the guard was ALWAYS false and
 * both arms collapsed to last-writer-wins `replace`. The fix guards on the ARRAY
 * and loops `min(existing.length, incoming.length)` elements, blending each
 * numeric pair IN PLACE (zero-alloc intact) — written as a loop from the start,
 * NO length-1 special case (the Mandate's no-special-case lock).
 *
 * A SOURCE-GREP gate in the style of `proof:motion-path` / `proof:engine`: each
 * clause reds on the exact regression it forbids — verified, not asserted. The
 * VALUE proof (the exact blended numbers, the four §gate clauses a/b/c/d) lives
 * in the chained `vitest run test/group/blend.test.ts` (the lead wires the combined
 * `"proof:blend"` script — see the note at the tail).
 *
 * CLAUSES (each BITES):
 *
 *   array-guard      — both arms guard on `Array.isArray(existing) &&
 *       Array.isArray(incoming)`, NOT a bare-`ValueUnit` guard on the leaf. BITE:
 *       revert to `isNumericUnit(existing)` on the whole leaf → the guard is
 *       always false again (the dead leaf) → reds.
 *
 *   element-loop     — both arms loop `Math.min(existing.length,
 *       incoming.length)` and reuse `isNumericUnit` PER ELEMENT. BITE: drop the
 *       loop (a length-1 access) or drop the `min` (over-read) → reds.
 *
 *   in-place-blend   — the blend mutates `existing[i].value` in place (zero-alloc
 *       intact); `add` is `+=`, `weighted` is `lerp(...)`. BITE: allocate a fresh
 *       carrier per blend, or clamp the add → reds (the GL-6 un-clamped contract).
 *
 *   lerp-live        — the `lerp` import (group.ts:1) is LIVE — its call-site in
 *       the weighted arm is reached. BITE: an unreachable lerp (the dead leaf)
 *       leaves the import dormant → the test reds (weighted returns the bare
 *       incoming).
 *
 *   test-locks       — `test/group/blend.test.ts` carries the four value clauses
 *       (add→1.0, weighted→0.25, the un-clamped 1.6, the multi-component leaf).
 *       BITE: delete a lock → reds.
 *
 * Mirrors `proof:motion-path`: exits 1 on any residual.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

/** Assert every anchor is present in `src`; the clause reds on any missing. */
const requireAll = (clause, file, anchors) => {
    const src = read(file);
    const missing = anchors.filter(({ re }) => !re.test(src));
    if (missing.length > 0) {
        fail(
            clause,
            `${file} is missing: ` +
                missing.map((m) => m.name).join("; ") +
                ` — the ${clause} contract is no longer locked.`,
        );
    } else {
        ok(clause, `${file} locks ${anchors.length} ${clause} anchor(s)`);
    }
};

console.log("proof:blend — G.W17 (the dead add/weighted blend-leaf correction)");

// R.W2 — the boxed `add`/`weighted` blend leaf (`boxedBlendArm`) was carved out
// of `group.ts` into the colocated `./compositor` (the lib-group 146L+70L split);
// the blend-leaf source clauses below grep it at its new home ("gate follows code
// to its new home"). The behavioral value-locks ride `test/group/blend.test.ts`.
const GROUP = "src/animation/group/compositor.ts";
const TEST = "test/group/blend.test.ts";

// ── array-guard — both arms guard on Array.isArray(existing && incoming) ──────
{
    const src = read(GROUP);
    const arrayGuards = (
        src.match(/Array\.isArray\(existing\)\s*&&\s*Array\.isArray\(incoming\)/g) ||
        []
    ).length;
    if (arrayGuards < 2) {
        fail(
            "array-guard",
            `${GROUP} has ${arrayGuards} \`Array.isArray(existing) && Array.isArray(incoming)\` guard(s); the add AND weighted arms each need one — a bare-ValueUnit guard on the leaf is ALWAYS false (the leaf is a ValueUnit[]), the dead-leaf bug.`,
        );
    } else {
        ok(
            "array-guard",
            `both blend arms guard on the ARRAY shape (${arrayGuards} guards) — the leaf's real ValueUnit[] shape, not a bare ValueUnit`,
        );
    }
}

// ── element-loop — both arms loop min(existing.length, incoming.length) ───────
{
    const src = read(GROUP);
    const minLoops = (
        src.match(
            /Math\.min\(\s*existing\.length\s*,\s*incoming\.length\s*\)/g,
        ) || []
    ).length;
    const perElementGuard = /isNumericUnit\(existing\[i\]\)\s*&&\s*isNumericUnit\(incoming\[i\]\)/.test(
        src,
    );
    if (minLoops < 2 || !perElementGuard) {
        fail(
            "element-loop",
            `${GROUP}: expected 2 \`Math.min(existing.length, incoming.length)\` loops (found ${minLoops}) AND a per-element \`isNumericUnit(existing[i]) && isNumericUnit(incoming[i])\` guard (found ${perElementGuard}) — a length-1 access is the special-case the Mandate forbids; dropping min() over-reads.`,
        );
    } else {
        ok(
            "element-loop",
            `both arms loop min(existing.length, incoming.length) with a per-element numeric guard — the multi-component leaf covered for free, no length-1 special case`,
        );
    }
}

// ── in-place-blend — add is `+=`, weighted is `lerp(...)`, mutated in place ───
requireAll("in-place-blend", GROUP, [
    {
        name: "add accumulates in place (existing[i].value += incoming[i].value)",
        re: /existing\[i\]\.value\s*\+=\s*incoming\[i\]\.value/,
    },
    {
        // The weighted lerp mutates in place; its third arg is the per-layer
        // weight scalar `w` (K.W11 PHYS-C hoisted it out of the element loop as
        // `const w = layer.weightSpring?.value ?? layer.weight` so a spring can
        // DRIVE it — the constant `layer.weight` is the fallback). Accept either
        // the bare `layer.weight` or the hoisted `w`; the spring-read provenance
        // is gated by proof:spring-blend-weight's `phys-c-read` clause.
        name: "weighted lerps in place (existing[i].value = lerp(..., w | layer.weight))",
        re: /existing\[i\]\.value\s*=\s*lerp\(\s*existing\[i\]\.value\s*,\s*incoming\[i\]\.value\s*,\s*(?:w|layer\.weight)\b/,
    },
    {
        name: "a non-numeric index replaces (existing[i] = incoming[i])",
        re: /existing\[i\]\s*=\s*incoming\[i\]/,
    },
]);

// ── lerp-live — the lerp import is live (its weighted call-site is reached) ───
{
    const src = read(GROUP);
    const imported = /import\s*\{[^}]*\blerp\b[^}]*\}\s*from\s*["']@mkbabb\/value\.js["']/.test(
        src,
    );
    const called = /=\s*lerp\(/.test(src);
    if (!imported || !called) {
        fail(
            "lerp-live",
            `${GROUP}: lerp imported=${imported}, called=${called} — the weighted arm's lerp must be reached (the dead leaf left the import dormant).`,
        );
    } else {
        ok("lerp-live", `lerp is imported AND its weighted call-site is reached`);
    }
}

// ── test-locks — the four value clauses (a/b/c/d) are present and biting ──────
requireAll("test-locks", TEST, [
    {
        name: "(a) add accumulates → 1.0",
        re: /toBeCloseTo\(1\.0\b/,
    },
    {
        name: "(b) weighted lerps → 0.25",
        re: /toBeCloseTo\(0\.25\b/,
    },
    {
        name: "(c) the GL-6 un-clamped add → 1.6",
        re: /toBeCloseTo\(1\.6\b/,
    },
    {
        name: "(d) the multi-component leaf (margin two-value, length 2)",
        re: /margin[\s\S]*?leaf\.length\)\.toBe\(2\)/,
    },
]);

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:blend — FAIL: the add/weighted blend leaf is not fully gated:\n" +
            failures.join("\n") +
            "\n\n  The leaf is a ValueUnit[]; the blend must guard on the ARRAY and loop\n" +
            "  min(existing.length, incoming.length) elements, blending each numeric\n" +
            "  pair in place (add `+=`, weighted `lerp`), replacing a non-numeric\n" +
            "  index — no length-1 special case, no clamp on add. Restore the clause\n" +
            "  each anchor names.",
    );
    process.exit(1);
}
console.log(
    "proof:blend — PASS: the add + weighted arms blend the ValueUnit[] leaf\n" +
        "element-wise (min(existing.length, incoming.length), per-element numeric\n" +
        "guard), mutate existing[i].value IN PLACE (add `+=`, weighted `lerp`,\n" +
        "un-clamped per GL-6), and replace a non-numeric index — no length-1\n" +
        "special case, lerp live. The value proof rides `vitest run test/group/blend.test.ts`.",
);
