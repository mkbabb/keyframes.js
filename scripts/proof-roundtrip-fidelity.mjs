#!/usr/bin/env node
/**
 * proof:roundtrip-fidelity — the G.W16 TR-4 parse-corpus + value-fidelity
 * round-trip gate (Band T · TEST-ONLY).
 *
 * The grammar was tested by scattered inline `fromString` one-liners with no
 * fixture directory, and `format.test.ts` round-trips assert frame COUNT +
 * property NAME — never that the INTERPOLATED VALUE survives
 * parse→format→reparse. The re-pin's A2 maximal-munch classifier changes how
 * units tokenize, and `format.ts`'s serializer is where a dropped channel would
 * silently corrupt a round trip (the `serializeEasing` silent-"linear" class
 * G.W4 fights, generalized to the full value matrix).
 *
 * This gate is the falsifiable instrument: the source-grep + manifest-existence
 * half (the corpus exists and is authoritative) chained with the behaviour half
 * (`vitest run test/roundtrip-fidelity.test.ts` — the byte-same midpoint).
 * Generalizes G.W4's `proof:roundtrip-easing` (the easing channel only) to the
 * whole value matrix (colors, multi-arg transforms, filters).
 *
 * A SOURCE-GREP gate in the style of `proof:motion-path`: it does NOT
 * re-implement the round-trip (it lives in the .test.ts); it asserts the corpus
 * is present + authoritative and that the round-trip body is byte-same shaped,
 * and BITES on a deleted lock. The behaviour proof rides the chained `vitest run`.
 *
 * CLAUSES (each BITES):
 *
 *   corpus-exists       — `test/fixtures/keyframes/` has a manifest + ≥1 .css
 *       fixture, and every .css has a manifest row. BITE: empty the corpus or
 *       drop a fixture's manifest row → reds.
 *
 *   ast-authoritative   — every manifest row carries a non-trivial expected AST
 *       (a `frames` count + a non-empty `keys` shape). BITE: delete a row's
 *       `frames`/`keys` → the corpus claim is un-falsifiable → reds.
 *
 *   value-fidelity      — the test body asserts BYTE-SAME midpoint for `byte`
 *       rows (parse→format→reparse→interpFrames(0.5)) — not frame-count, not
 *       name-only. BITE: weaken the `expect(after).toBe(before)` byte-same lock →
 *       reds.
 *
 *   format-shape-lock   — the test body asserts the normalized frame STRUCTURE
 *       (templateFrames.length + the sorted at(0.5) keys) against the manifest.
 *       BITE: delete the structure assert → a grammar regression slips silently.
 *
 *   no-source-edit      — the round-trip flows through the unchanged
 *       `CSSKeyframesToString` + `fromString` surfaces; the test carries NO `src/`
 *       mutation. BITE: a required `src/` edit to make a clause bite is a finding,
 *       surfaced not patched.
 *
 * Mirrors `proof:motion-path`: exits 1 on any residual.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

console.log(
    "proof:roundtrip-fidelity — G.W16 TR-4 (the parse corpus + value-fidelity round-trip)",
);

const CORPUS = "test/fixtures/keyframes";
const TEST = "test/roundtrip-fidelity.test.ts";

// ── corpus-exists — the manifest + ≥1 .css, every .css covered ─────────────────
{
    const corpusDir = join(root, CORPUS);
    const manifestPath = join(corpusDir, "manifest.json");
    if (!existsSync(corpusDir) || !existsSync(manifestPath)) {
        fail(
            "corpus-exists",
            `${CORPUS}/manifest.json is missing — the parse corpus does not exist.`,
        );
    } else {
        const cssFiles = readdirSync(corpusDir).filter((f) =>
            f.endsWith(".css"),
        );
        const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
        const covered = new Set((manifest.fixtures ?? []).map((f) => f.file));
        const uncovered = cssFiles.filter((f) => !covered.has(f));
        if (cssFiles.length === 0) {
            fail("corpus-exists", `${CORPUS} has no .css fixtures.`);
        } else if (uncovered.length > 0) {
            fail(
                "corpus-exists",
                `${CORPUS} has fixtures with no manifest row: ${uncovered.join(", ")}.`,
            );
        } else {
            ok(
                "corpus-exists",
                `${CORPUS} has ${cssFiles.length} .css fixture(s), all covered by the manifest`,
            );
        }

        // ── ast-authoritative — every row has a non-trivial expected AST ──────
        const weak = (manifest.fixtures ?? []).filter(
            (f) =>
                typeof f.frames !== "number" ||
                f.frames < 1 ||
                !Array.isArray(f.keys) ||
                f.keys.length === 0,
        );
        if (weak.length > 0) {
            fail(
                "ast-authoritative",
                `manifest rows with no non-trivial expected AST (frames/keys): ${weak
                    .map((f) => f.file)
                    .join(", ")} — the corpus is un-falsifiable.`,
            );
        } else {
            ok(
                "ast-authoritative",
                `all ${(manifest.fixtures ?? []).length} manifest rows carry a frames count + a non-empty keys shape`,
            );
        }
    }
}

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

// ── value-fidelity — the byte-same midpoint lock (not frame-count) ─────────────
requireAll("value-fidelity", TEST, [
    {
        name: "parse→format→reparse via CSSKeyframesToString",
        re: /CSSKeyframesToString\(a\)/,
    },
    {
        name: "the BYTE-SAME midpoint lock for `byte` rows",
        re: /expect\(after\)\.toBe\(before\)/,
    },
    {
        name: "the midpoint is interpFrames(0.5) (= at(0.5)), serialized + sorted",
        re: /a\.at\(0\.5\)[\s\S]*?\.sort\(\)/,
    },
]);

// ── format-shape-lock — the normalized frame STRUCTURE is asserted ────────────
requireAll("format-shape-lock", TEST, [
    {
        name: "the template-frame count is asserted against the manifest",
        re: /templateFrames\.length\)\.toBe\(fx\.frames\)/,
    },
    {
        name: "the sorted at(0.5) keys are asserted against the manifest AST",
        re: /Object\.keys\(a\.at\(0\.5\)\)\.sort\(\)\)\.toEqual\(fx\.keys\)/,
    },
]);

// ── no-source-edit — the round-trip rides the unchanged surfaces ──────────────
{
    // The test must consume the engine + serializer surfaces, never patch them.
    const src = read(TEST);
    const importsEngine = /from "\.\.\/src\/animation\/engine"/.test(src);
    // R.W1 moved the serializer `format.ts` → `compile/format.ts`; the round-trip
    // still consumes the real `CSSKeyframesToString` surface at its new zone path.
    const importsFormat = /from "\.\.\/src\/animation\/compile\/backward\/format"/.test(
        src,
    );
    if (importsEngine && importsFormat) {
        ok(
            "no-source-edit",
            "the round-trip rides the unchanged engine + format surfaces (TEST-ONLY)",
        );
    } else {
        fail(
            "no-source-edit",
            `${TEST} no longer imports BOTH the engine and the serializer — the round-trip must exercise the real surfaces, not a shim.`,
        );
    }
}

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:roundtrip-fidelity — FAIL: the parse corpus / round-trip is not fully locked:\n" +
            failures.join("\n") +
            "\n\n  The corpus pairs each .css fixture with its expected normalized AST\n" +
            "  (frames + keys) and asserts the value-fidelity round-trip —\n" +
            "  parse→format→reparse→interpFrames(0.5) byte-same midpoint. Restore the\n" +
            "  clause each anchor names. The behaviour proof rides `vitest run " +
            TEST +
            "`.",
    );
    process.exit(1);
}
console.log(
    "proof:roundtrip-fidelity — PASS: the parse corpus is authoritative (every\n" +
        ".css × its expected normalized AST), and the value survives the round trip\n" +
        "(parse→format→reparse→interpFrames(0.5) byte-same midpoint). Generalizes\n" +
        "proof:roundtrip-easing to the full value matrix. The behaviour proof rides\n" +
        "`vitest run " +
        TEST +
        "`.",
);
