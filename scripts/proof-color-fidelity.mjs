#!/usr/bin/env node
/**
 * proof:color-fidelity — the K.W12 ED-4 public color-FIDELITY conformance gate.
 *
 * The ONE benchmark only kf can publish honestly (ecosystem-distribution.md
 * §5.4): a CORRECTNESS conformance harness, not a throughput one. It proves
 * kf's UNIQUE axis-2 (perceptual color) matches the CSS Color 4 SPEC reference —
 * un-spinnable: it measures correctness against a spec, NOT speed against a
 * rival. NO throughput benchmark (the credibility trap, BOOK). NO re-authored
 * ΔE kernel (the `deltaEOK` producer is consumed PUBLISHED, inv-16).
 *
 * This is the SOURCE-GREP + artifact half (the style of proof:roundtrip-fidelity
 * / proof:compile-replay): the BEHAVIOUR proof rides the chained `vitest run
 * test/color-fidelity.test.ts` (the engine midpoint × ΔE × the JND assert). This
 * half asserts the corpus is authoritative + the PUBLISHED artifact is real and
 * matches the gated measurement.
 *
 * CLAUSE (d) of the §Hard gate — the harness publishes the ΔE conformance:
 *
 *   corpus-exists      — the corpus has ≥6 color pairs (non-trivial). BITE:
 *       empty the corpus → un-falsifiable → reds.
 *
 *   data-fresh         — the gated measurement (docs/color-fidelity-data.json)
 *       exists, covers every corpus pair, and EVERY published ΔE is under the
 *       JND. BORN-RED WITNESS: `grep deltaEOK src/` was ZERO pre-W10 / no harness
 *       existed pre-W12 → no data → reds by construction. BITE: a lossy
 *       (RGB-mixed) midpoint that exceeds the JND → the data carries an
 *       over-JND ΔE → reds.
 *
 *   artifact-published — docs/color-fidelity.md EXISTS and is byte-identical to
 *       a fresh render of the data (the published numbers ARE the gated ones).
 *       BITE: hand-edit the table, or change the corpus without re-rendering →
 *       the artifact diverges → reds. Fix: `npm run bench:color-fidelity`.
 *
 *   consumes-deltaEOK  — the test consumes value.js's PUBLISHED `deltaEOK` +
 *       `mixColors` (the producer, not a re-author) and the real engine surface.
 *       BITE: a kf-local ΔE re-implementation, or a shim engine → reds (inv-16).
 *
 *   no-throughput      — neither the test nor the harness times anything (no
 *       `performance.now`/`Date.now` benchmark, no rival comparison). The harness
 *       measures FIDELITY, never speed. BITE: a throughput timing slips in → reds.
 *
 * BUDGET 0 — the gate asserts the conformance is PUBLISHED and under threshold,
 * not an error count.
 *
 * RUN: npm run proof:color-fidelity   (this node half && the vitest behaviour half)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderArtifact } from "./color-fidelity-harness.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(REPO, p), "utf8");
const exists = (p) => fs.existsSync(path.join(REPO, p));

const CORPUS = "test/fixtures/color-fidelity-corpus.ts";
const TEST = "test/color-fidelity.test.ts";
const DATA = "docs/color-fidelity-data.json";
const ARTIFACT = "docs/color-fidelity.md";

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

console.log(
    "proof:color-fidelity — K.W12 ED-4 (the public midpoint-ΔE conformance vs CSS Color 4)",
);

// ── corpus-exists ─────────────────────────────────────────────────────────────
if (!exists(CORPUS)) {
    fail("corpus-exists", `${CORPUS} is missing — the conformance corpus does not exist.`);
} else {
    const src = read(CORPUS);
    const pairs = [...src.matchAll(/from:\s*"#?[0-9A-Fa-f]{3,8}"/g)].length;
    if (pairs < 6) {
        fail(
            "corpus-exists",
            `${CORPUS} has ${pairs} color pair(s) — need ≥6 (a non-trivial perceptual span).`,
        );
    } else {
        ok("corpus-exists", `${CORPUS} defines ${pairs} color pairs`);
    }
}

// ── data-fresh — the gated measurement exists + every ΔE is under the JND ─────
let data = null;
if (!exists(DATA)) {
    fail(
        "data-fresh",
        `${DATA} is missing — the gated engine measurement was not emitted ` +
            `(run \`npx vitest run ${TEST}\`, which writes it).`,
    );
} else {
    data = JSON.parse(read(DATA));
    const over = (data.pairs ?? []).filter((p) => p.deltaE >= data.jnd);
    if (!Array.isArray(data.pairs) || data.pairs.length < 6) {
        fail("data-fresh", `${DATA} covers ${data.pairs?.length ?? 0} pairs — the measurement is incomplete.`);
    } else if (over.length > 0) {
        fail(
            "data-fresh",
            `${over.length} pair(s) have a midpoint ΔE ≥ the JND (${data.jnd}): ${over
                .map((p) => `${p.from}→${p.to} (${p.deltaE})`)
                .join(", ")} — a lossy perceptual path.`,
        );
    } else {
        const worst = Math.max(...data.pairs.map((p) => p.deltaE));
        ok(
            "data-fresh",
            `${data.pairs.length} pairs, every midpoint ΔE under the JND (${data.jnd}); worst-case ΔE = ${worst.toExponential(2)}`,
        );
    }
}

// ── artifact-published — docs/color-fidelity.md matches a fresh render ─────────
if (!exists(ARTIFACT)) {
    fail(
        "artifact-published",
        `${ARTIFACT} is missing — the conformance result is not PUBLISHED (run \`node scripts/color-fidelity-harness.mjs\`).`,
    );
} else if (data) {
    let fresh;
    try {
        fresh = renderArtifact();
    } catch (e) {
        fail("artifact-published", `render failed: ${e.message}`);
    }
    if (fresh !== undefined) {
        if (read(ARTIFACT) !== fresh) {
            fail(
                "artifact-published",
                `${ARTIFACT} is STALE — it does not match a fresh render of ${DATA}. ` +
                    `The artifact was hand-edited or the corpus changed without re-rendering. ` +
                    `Fix: \`npm run bench:color-fidelity\`.`,
            );
        } else {
            ok("artifact-published", `${ARTIFACT} is byte-identical to a fresh render of the gated data`);
        }
    }
}

// ── consumes-deltaEOK — the test rides the PUBLISHED producer + real engine ───
{
    const src = exists(TEST) ? read(TEST) : "";
    const consumesProducer =
        /deltaEOK/.test(src) &&
        /mixColors/.test(src) &&
        /from "@mkbabb\/value\.js"/.test(src);
    const ridesEngine = /from "\.\.\/src\/animation\/engine"/.test(src);
    if (!consumesProducer) {
        fail(
            "consumes-deltaEOK",
            `${TEST} does not consume value.js's PUBLISHED deltaEOK + mixColors — a kf-local ΔE re-author breaches inv-16 (published-only consumption).`,
        );
    } else if (!ridesEngine) {
        fail(
            "consumes-deltaEOK",
            `${TEST} does not import the real engine (src/animation/engine) — the midpoint must be the engine's, not a shim's.`,
        );
    } else {
        ok("consumes-deltaEOK", `${TEST} consumes the PUBLISHED deltaEOK/mixColors over the real engine midpoint`);
    }
}

// ── no-throughput — neither the test nor the harness times anything ───────────
{
    const TIMING = /performance\.now\(|Date\.now\(|process\.hrtime|console\.time/;
    const offenders = [];
    for (const f of [TEST, "scripts/color-fidelity-harness.mjs"]) {
        if (exists(f) && TIMING.test(read(f))) offenders.push(f);
    }
    if (offenders.length > 0) {
        fail(
            "no-throughput",
            `timing call(s) found in ${offenders.join(", ")} — ED-4 ships the FIDELITY harness, NOT a throughput benchmark (the credibility trap, BOOK).`,
        );
    } else {
        ok("no-throughput", "neither the harness nor the test times anything — fidelity, never speed");
    }
}

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:color-fidelity — FAIL: the color-fidelity conformance is not fully published/locked:\n" +
            failures.join("\n") +
            "\n\n  ED-4 publishes the ONE benchmark only kf can publish honestly: midpoint\n" +
            "  ΔE vs the CSS Color 4 reference (un-spinnable, spec-measured). Re-measure\n" +
            "  + re-render: `npm run bench:color-fidelity`. The behaviour proof rides\n" +
            "  `vitest run " +
            TEST +
            "`.",
    );
    process.exit(1);
}
console.log(
    "proof:color-fidelity — PASS: the corpus is authoritative, the gated engine\n" +
        "measurement publishes every midpoint ΔE under the JND, the published artifact\n" +
        "(docs/color-fidelity.md) matches the gated data, the PUBLISHED deltaEOK is\n" +
        "consumed (not re-authored), and nothing is timed. The conformance is the\n" +
        "PUBLIC face of kf's perceptual-color axis (the un-spinnable benchmark).",
);
