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
 *   s3-arity-pad        — the MCI-5 consume is locked (K.W1): the pad holds the
 *       function's CSS IDENTITY (`brightness → 1`) at t=0. The former `it.fails`
 *       witness has FLIPPED to a passing `it(` (the inner identity-`1` assertion
 *       now PASSES). BITE: delete the identity-`1` lock → the consume goes
 *       un-watched → reds.
 *
 *   s4-cqw-emit         — the bare-cqw positive control asserts the emit carries
 *       `cqw` (the browser resolves per frame). BITE: delete the `50cqw` lock →
 *       the classification asymmetry is no longer witnessed → reds.
 *
 *   identity-consume    — the pad consumes value.js's `functionIdentityValue`
 *       producer (the published MCI-5 fix), NOT a hand-rolled kf identity table.
 *       The pad routes the absent function's name into `functionIdentityValue`
 *       and falls back to the historical `new ValueUnit(0)` only when value.js
 *       has no identity. BITE: a kf-local identity LITERAL (a hard-coded
 *       `brightness → 1` map) instead of the value.js consume → reds.
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

// ── s3-arity-pad — the MCI-5 consume is locked: the pad holds the CSS identity ─
requireAll("s3-arity-pad", TEST, [
    {
        name: "the MCI-5 witness has flipped to a passing it( (the consume landed)",
        re: /it\(\s*\n?\s*["']filter brightness pad holds the CSS identity 1 at t=0/,
    },
    {
        name: "the assertion locks the CSS identity 1 at t=0 (the consumed target)",
        re: /paddedBrightnessAt\(0\)\)\.toBe\(1\)/,
    },
    {
        name: "and locks the lerp to the authored endpoint 2 at t=1",
        re: /paddedBrightnessAt\(1\)\)\.toBe\(2\)/,
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

// ── identity-consume — the pad consumes value.js's functionIdentityValue ──────
{
    // MCI-5 is CONSUMED (K.W1): the pad resolves the absent function's CSS
    // identity through value.js's PUBLISHED `functionIdentityValue` producer,
    // falling back to the historical `new ValueUnit(0)` only when value.js has
    // no identity for the name. This is the published-consume-edge form, NOT a
    // hand-rolled kf identity LITERAL (a hard-coded `brightness → 1` map would
    // re-author value-domain knowledge kf must consume, not own).
    const utils = read("src/animation/compile/parse-flatten.ts");
    const importsProducer =
        /import\s*\{[\s\S]*?functionIdentityValue[\s\S]*?\}\s*from\s*["']@mkbabb\/value\.js["']/.test(
            utils,
        );
    const padConsumesIdentity =
        /functionIdentityValue\([^)]*\)/.test(utils) &&
        /identity\s*\?\?\s*new ValueUnit\(0\)/.test(utils);
    // A hard-coded identity literal map (kf re-authoring the value table) is the
    // breach this clause forbids — e.g. `{ brightness: 1, scale: 1, … }` inline.
    const hasIdentityLiteralMap =
        /(brightness|scale|saturate)\s*:\s*1\b[\s\S]{0,80}(translate|blur|opacity)\s*:/.test(
            utils,
        );
    if (!importsProducer || !padConsumesIdentity) {
        fail(
            "identity-consume",
            "src/animation/compile/parse-flatten.ts no longer routes the arity pad through value.js's `functionIdentityValue` producer (`identity ?? new ValueUnit(0)`) — the MCI-5 consume edge regressed.",
        );
    } else if (hasIdentityLiteralMap) {
        fail(
            "identity-consume",
            "src/animation/compile/parse-flatten.ts gained a hand-rolled identity LITERAL map — the MCI-5 fix is a value.js consume (`functionIdentityValue`), not a kf-authored value table.",
        );
    } else {
        ok(
            "identity-consume",
            "the arity pad consumes value.js's `functionIdentityValue` (published MCI-5), bare `ValueUnit(0)` only as the no-identity fallback",
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
            "  value.js seam (S2), locks the MCI-5 identity-pad consume (S3) and\n" +
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
        "(known-coordinate + parity + hueMethod), the MCI-5 identity pad is\n" +
        "consumed from value.js, and the bare-cqw emit is the positive control. The\n" +
        "behaviour proof rides `vitest run " +
        TEST +
        "`.",
);
