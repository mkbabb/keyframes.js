#!/usr/bin/env node
/**
 * proof:interpolate-anything — the G.W15 value-type-breadth + color-fidelity
 * corpus gate (Band T · TEST-ONLY).
 *
 * The library headline is "CSS keyframe animations for ANYTHING", but the suite
 * exercised ~6 value types and tested color for INEQUALITY only. This gate is
 * the falsifiable instrument that the corpus exists and stays authoritative —
 * the source-grep half (each clause reds if a locking test is deleted) chained
 * with the behaviour half (`vitest run test/interpolate-anything.test.ts`).
 *
 * It is the correctness twin the booked SoA fold (`proof:interp-soa`, the G-2
 * MEASURE-FIRST) ships WITHOUT: a perf bench proves speed, not a correct pixel;
 * a channel mis-order in a SoA pack passes a ns-bench and ships a wrong
 * transform. TR-5 binds them — `proof:interp-soa` MUST NOT land without
 * `proof:interpolate-anything` green on the SAME corpus.
 *
 * A SOURCE-GREP gate in the style of `proof:motion-path` / `proof:orchestration`:
 * it does NOT re-implement the assertions (they live in the .test.ts); it asserts
 * each corpus clause is LOCKED by a live test assertion and BITES on a deleted
 * lock. The behaviour proof rides the chained `vitest run`.
 *
 * CLAUSES (each BITES on a deleted/weakened lock):
 *
 *   s1-value-matrix     — the value-type matrix locks EXACT midpoints for
 *       multi-arg transform, rotate, filter, drop-shadow, box-shadow, gradient
 *       stop, and custom-property VALUE. BITE: delete a row's `.toBe(...)`
 *       midpoint assert → the matrix is no longer falsifiable → reds.
 *
 *   s2-color-fidelity   — the known-coordinate lock + the value.js color-parity
 *       gate (the leaves-parity idiom) + the hueMethod VALUE lock. BITE: drop the
 *       parity `expect(kf...).toBe(vj...)` or a known-coordinate lock → reds.
 *
 *   s3-arity-pad        — the MCI-5 witness is locked as an `it.fails`
 *       expected-fail (GREEN today against the live ValueUnit(0) pad; FLIPS RED
 *       when value.js MCI-5 lands). BITE: delete the `it.fails` witness → the gap
 *       goes un-watched → reds.
 *
 *   s4-cqw-emit         — the bare-cqw positive control asserts the emit carries
 *       `cqw` (the browser resolves per frame). BITE: delete the `50cqw` lock →
 *       the classification asymmetry is no longer witnessed → reds.
 *
 *   no-source-edit      — the wave is TEST-ONLY: the test imports kf source +
 *       value.js (the leaves-parity heavy-side precedent), and carries NO `src/`
 *       mutation. BITE: a `src/` import that writes back, or a kf-side per-call
 *       guard added to createInterpVarValue, would breach the witness charter.
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
            `${file} is missing: ${missing.map((m) => m.name).join("; ")} — the ${clause} contract is no longer locked.`,
        );
    } else {
        ok(clause, `${file} locks ${anchors.length} ${clause} anchor(s)`);
    }
};

console.log("proof:interpolate-anything — G.W15 (the value-type + color-fidelity corpus)");

const TEST = "test/interpolate-anything.test.ts";

// ── s1-value-matrix — the multi-channel value-type matrix locks exact midpoints
requireAll("s1-value-matrix", TEST, [
    {
        name: "multi-arg transform: translate3d midpoint 50px|50px|0px",
        re: /transform\.translate3d["']\)\)\.toBe\("50px \| 50px \| 0px"\)/,
    },
    {
        name: "scale fans out to scaleX/Y/Z at 1.5",
        re: /transform\.scaleX["']\)\)\.toBe\("1\.5"\)/,
    },
    { name: "rotate → 45deg", re: /transform\.rotateZ["']\)\)\.toBe\("45deg"\)/ },
    { name: "filter blur → 5px", re: /filter\.blur["']\)\)\.toBe\("5px"\)/ },
    {
        name: "filter brightness → 1.5",
        re: /filter\.brightness["']\)\)\.toBe\("1\.5"\)/,
    },
    {
        name: "drop-shadow numeric channels at midpoint",
        re: /filter\.drop-shadow[\s\S]*?5px \| 10px \| 2px/,
    },
    {
        name: "box-shadow numeric + color leaf",
        re: /box-shadow[\s\S]*?5px \| 10px \| 2px[\s\S]*?oklab\\\(/,
    },
    {
        name: "gradient stop position midpoint 20%",
        re: /linear-gradient[\s\S]*?toContain\("20%"\)/,
    },
    {
        name: "custom-property VALUE → 50px",
        re: /--w["']\)\)\.toBe\("50px"\)/,
    },
]);

// ── s2-color-fidelity — known-coordinate + value.js parity + hueMethod VALUE lock
requireAll("s2-color-fidelity", TEST, [
    {
        name: "imports the value.js color seam (leaves-parity precedent)",
        re: /normalizeValueUnits[\s\S]*?prepareInterpVar[\s\S]*?lerpValue/,
    },
    {
        name: "the known-coordinate lock table per space (oklab/oklch/lab/rgb)",
        re: /KNOWN[\s\S]*?oklab\(53\.99845437103836%/,
    },
    {
        name: "the value.js color-parity gate (kf === replicated value.js seam)",
        re: /toBe\(\s*vjColorMidpoint\(/,
    },
    {
        name: "the hueMethod VALUE lock at the two distinct known coordinates",
        re: /85\.86461238826914deg[\s\S]*?265\.86461238826917deg/,
    },
]);

// ── s3-arity-pad — the MCI-5 witness is locked as an it.fails expected-fail ────
requireAll("s3-arity-pad", TEST, [
    {
        name: "the MCI-5 witness is an it.fails expected-fail (not a bare red gate)",
        re: /it\.fails\(\s*\n?\s*["']filter brightness pad holds identity 1 at t=0/,
    },
    {
        name: "the inner assertion locks the CSS identity 1 (the consume-leg target)",
        re: /paddedBrightnessAt\(0\)\)\.toBe\(1\)/,
    },
    {
        name: "the positive control witnesses the live ValueUnit(0) pad resolves 0",
        re: /paddedBrightnessAt\(0\)\)\.toBe\(0\)/,
    },
    {
        name: "drives the named createInterpVarValue seam (utils.ts), not a shim",
        re: /createInterpVarValue\("filter", 0, 1/,
    },
]);

// ── s4-cqw-emit — the bare-cqw positive control asserts the cqw emit ──────────
requireAll("s4-cqw-emit", TEST, [
    {
        name: "the bare cqw → cqw midpoint emits 50cqw (raw-number lerp)",
        re: /toBe\("50cqw"\)/,
    },
    {
        name: "the emit carries the cqw unit (the browser resolves per frame)",
        re: /endsWith\("cqw"\)\)\.toBe\(true\)/,
    },
]);

// ── no-source-edit — the wave is TEST-ONLY (no kf-side per-call guard added) ───
{
    // The S3 witness must NOT be "fixed" by a per-call guard in
    // createInterpVarValue — the identity-aware pad is value.js-domain knowledge
    // (the G.WV HANDOFF). Guard against the temptation: utils.ts's pad must still
    // be the bare `new ValueUnit(0)` push (no `brightness`/identity special-case).
    const utils = read("src/animation/utils.ts");
    const padIsBare = /out\.push\(new ValueUnit\(0\)\)/.test(utils);
    const hasIdentitySpecialCase =
        /brightness|identity[\s\S]{0,40}pad|cssIdentity/i.test(
            utils.slice(
                utils.indexOf("createInterpVarValue"),
                utils.indexOf("createInterpVarValue") + 1400,
            ),
        );
    if (!padIsBare) {
        fail(
            "no-source-edit",
            "src/animation/utils.ts no longer pads with the bare `new ValueUnit(0)` — either value.js's MCI-5 fix was consumed (delete the S3 it.fails wrapper) or a kf-side guard was added (a charter breach: the fix is value.js-domain).",
        );
    } else if (hasIdentitySpecialCase) {
        fail(
            "no-source-edit",
            "src/animation/utils.ts createInterpVarValue gained an identity special-case — the MCI-5 fix is a value.js HANDOFF, not a kf-side per-call guard (the no-special-case seam).",
        );
    } else {
        ok(
            "no-source-edit",
            "the createInterpVarValue pad stays the bare `new ValueUnit(0)` (TEST-ONLY; the MCI-5 fix is a value.js HANDOFF)",
        );
    }
}

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:interpolate-anything — FAIL: the value-type/color corpus is not fully locked:\n" +
            failures.join("\n") +
            "\n\n  The corpus drives a fixed @keyframes through interpFrames(0.5) and\n" +
            "  asserts EXACT midpoints (S1), locks color value identity against the\n" +
            "  value.js seam (S2), witnesses the MCI-5 arity pad (S3, it.fails) and\n" +
            "  the bare-cqw emit (S4). Restore the clause each anchor names. The\n" +
            "  behaviour proof rides `vitest run " +
            TEST +
            "`.",
    );
    process.exit(1);
}
console.log(
    "proof:interpolate-anything — PASS: the value-type matrix locks exact\n" +
        "midpoints (multi-arg transform/filter/drop-shadow/box-shadow/gradient/\n" +
        "custom-prop), color value-fidelity is locked against the value.js seam\n" +
        "(known-coordinate + parity + hueMethod), the MCI-5 arity pad is an\n" +
        "it.fails witness, and the bare-cqw emit is the positive control. The\n" +
        "behaviour proof rides `vitest run " +
        TEST +
        "`.",
);
