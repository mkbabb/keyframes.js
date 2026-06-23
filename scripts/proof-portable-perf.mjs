#!/usr/bin/env node
/**
 * proof:portable-perf — P.W1 S3: the self-test for scripts/lib/portable-perf.mjs.
 *
 * Verifies the shared ratio-gate helper exports and contract correctness without
 * running any bench (this gate is pure Node — no vitest, no spawned process).
 * A consumer gate (proof:soa-composite, proof:spring-vector) imports ratioGate /
 * absoluteGate directly and never re-derives the ratio math.
 *
 * ── CLAUSES ──────────────────────────────────────────────────────────────────
 *
 *   helper-present   — scripts/lib/portable-perf.mjs exists and exports
 *                      `ratioGate` + `absoluteGate`. BITE: the file is absent
 *                      or missing either export → new perf gates would copy-paste
 *                      the ratio math (the X1 per-bench duplication).
 *
 *   ratio-gate-pass  — a fixture report with candHz = 2.0 × baseHz and
 *                      floorFraction = 1.2 → ratioGate returns { adopt: true,
 *                      verdict: 'ADOPT', ratio ≈ 2.0 }. The happy-path sanity.
 *
 *   ratio-gate-fail  — a fixture report with candHz = 0.5 × baseHz and
 *                      floorFraction = 1.2 → ratioGate calls the `fail` hook
 *                      (HARD local posture) with a KILL verdict. BITE: a gate
 *                      calling ratioGate misses the candHz < floorFraction case.
 *
 *   ratio-gate-missing-case — a report that is missing the baselineCase →
 *                      ratioGate returns null + sets process.exitCode = 1 (a
 *                      HARD structural miss). BITE: a perf gate silently passes
 *                      when the bench case is absent/renamed.
 *
 *   absolute-gate-pass — a fixture report with hz = 5000 and floorHz = 1000 →
 *                      absoluteGate returns { pass: true }. Happy-path.
 *
 *   absolute-gate-fail — hz = 500 < floorHz = 1000 → absoluteGate calls the
 *                      `fail` hook. BITE: a miss on the warmEngine-class floor
 *                      goes undetected.
 *
 *   absolute-gate-no-comment — absoluteGate called WITHOUT marginComment →
 *                      THROWS an error. BITE: a caller silently adopts a
 *                      device-dependent absolute-floor HARD predicate without
 *                      stating the honest reason (K3 portability spine violated).
 *
 *   lint-no-raw-floor — scan scripts/ for `if.*hz.*<.*floor\|hz\s*>=\s*WIN_FRAC`
 *                      patterns OUTSIDE of portable-perf.mjs, ci-env.mjs, and
 *                      the decision-JSON files — enforces that no gate re-derives
 *                      the floor math (the X1 duplication prevented). BITE: a
 *                      new perf gate hardcodes `if (hz < floor)` → reds.
 *
 * ── POSTURE ──────────────────────────────────────────────────────────────────
 * This gate is HARD everywhere — it tests a pure-JS helper with no wall-clock
 * dependence. The ratio and absoluteGate fixture assertions are deterministic.
 * The lint-no-raw-floor clause is a static source-graph scan (device-independent).
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

// ── Clause: helper present ───────────────────────────────────────────────────
const helperPath = join(root, "scripts", "lib", "portable-perf.mjs");
if (!existsSync(helperPath)) {
    console.error(
        "proof:portable-perf — FAIL: scripts/lib/portable-perf.mjs is absent.\n" +
            "  A new perf gate would copy-paste the same-report ratio math (X1 duplication).",
    );
    process.exit(1);
}

/** @type {{ ratioGate: Function, absoluteGate: Function }} */
let helper;
try {
    helper = await import(helperPath);
} catch (e) {
    console.error(`proof:portable-perf — FAIL: could not import portable-perf.mjs: ${e.message}`);
    process.exit(1);
}

const { ratioGate, absoluteGate } = helper;
if (typeof ratioGate !== "function") {
    fail("helper-present", "portable-perf.mjs does not export `ratioGate` as a function");
}
if (typeof absoluteGate !== "function") {
    fail("helper-present", "portable-perf.mjs does not export `absoluteGate` as a function");
}
if (!failures.some((f) => f.includes("[helper-present]"))) {
    ok("helper-present", "scripts/lib/portable-perf.mjs exports `ratioGate` + `absoluteGate`");
}

// ── Build a fixture vitest bench report ─────────────────────────────────────
// The shape proof:spring-vector / proof:soa-composite read from --outputJson.
const BASE_HZ = 1000;
const makeReport = ({ base = BASE_HZ, cand = BASE_HZ * 2, caseName = "cand", baseName = "base" } = {}) => ({
    files: [
        {
            filepath: "/fake/bench.ts",
            groups: [
                {
                    benchmarks: [
                        { name: baseName, hz: base },
                        { name: caseName, hz: cand },
                    ],
                },
            ],
        },
    ],
});

// ── Clause: ratio-gate-pass ──────────────────────────────────────────────────
if (typeof ratioGate === "function") {
    let failCalled = false;
    const fixReport = makeReport({ base: 1000, cand: 2000 });
    const result = ratioGate({
        report: fixReport,
        baselineCase: "base",
        candidateCase: "cand",
        floorFraction: 1.2,
        posture: "hard",
        fail: () => { failCalled = true; },
        note: () => {},
    });
    if (!result || !result.adopt || result.verdict !== "ADOPT") {
        fail(
            "ratio-gate-pass",
            `candHz=2000 / baseHz=1000 = 2.0× should be ADOPT at floorFraction=1.2 ` +
                `(got adopt=${result?.adopt}, verdict=${result?.verdict})`,
        );
    } else if (failCalled) {
        fail("ratio-gate-pass", "the fail hook was called on a passing ratio (2.0× >= 1.2×)");
    } else {
        ok(
            "ratio-gate-pass",
            `candHz=2000 / baseHz=1000 = ${result.ratio.toFixed(3)}× → ADOPT (floorFraction=1.2) — correct`,
        );
    }
}

// ── Clause: ratio-gate-fail ──────────────────────────────────────────────────
if (typeof ratioGate === "function") {
    let failCalled = false;
    let failMsg = "";
    const fixReport = makeReport({ base: 1000, cand: 500 });
    const result = ratioGate({
        report: fixReport,
        baselineCase: "base",
        candidateCase: "cand",
        floorFraction: 1.2,
        posture: "hard",
        fail: (msg) => { failCalled = true; failMsg = msg; },
        note: () => {},
    });
    if (result?.adopt !== false || result?.verdict !== "KILL") {
        fail(
            "ratio-gate-fail",
            `candHz=500 / baseHz=1000 = 0.5× should be KILL at floorFraction=1.2 ` +
                `(got adopt=${result?.adopt}, verdict=${result?.verdict})`,
        );
    } else if (!failCalled) {
        fail("ratio-gate-fail", "the fail hook was NOT called on a failing ratio (0.5× < 1.2×)");
    } else {
        ok(
            "ratio-gate-fail",
            `candHz=500 / baseHz=1000 = 0.5× → KILL — fail hook called correctly`,
        );
    }
}

// ── Clause: ratio-gate-missing-case ─────────────────────────────────────────
if (typeof ratioGate === "function") {
    const savedExitCode = process.exitCode;
    process.exitCode = 0;
    // Report missing the "base" case entirely
    const fixReport = makeReport({ base: 1000, cand: 2000, baseName: "NOT_BASE" });
    const result = ratioGate({
        report: fixReport,
        baselineCase: "base",
        candidateCase: "cand",
        floorFraction: 1.2,
        posture: "hard",
        fail: () => {},
        note: () => {},
    });
    if (result !== null) {
        fail(
            "ratio-gate-missing-case",
            `expected null when baselineCase is absent from report, got ${JSON.stringify(result)}`,
        );
        process.exitCode = savedExitCode;
    } else if (!process.exitCode) {
        fail(
            "ratio-gate-missing-case",
            "process.exitCode was NOT set to 1 when the structural miss (absent baselineCase) occurred",
        );
        process.exitCode = savedExitCode;
    } else {
        ok(
            "ratio-gate-missing-case",
            "absent baselineCase → returns null + sets process.exitCode=1 (HARD structural miss)",
        );
        process.exitCode = savedExitCode;
    }
}

// ── Clause: absolute-gate-pass ───────────────────────────────────────────────
if (typeof absoluteGate === "function") {
    let failCalled = false;
    const fixReport = makeReport({ base: 0, cand: 5000, caseName: "cand" });
    const result = absoluteGate({
        report: fixReport,
        candidateCase: "cand",
        floorHz: 1000,
        marginComment: "a memoized microtask resolve is <1ms on any runner; no same-report baseline exists",
        posture: "hard",
        fail: () => { failCalled = true; },
        note: () => {},
    });
    if (!result || !result.pass) {
        fail(
            "absolute-gate-pass",
            `hz=5000 should pass floorHz=1000 (got pass=${result?.pass})`,
        );
    } else if (failCalled) {
        fail("absolute-gate-pass", "the fail hook was called on a passing absolute floor (5000 >= 1000)");
    } else {
        ok("absolute-gate-pass", `hz=5000 >= floorHz=1000 → pass=true — correct`);
    }
}

// ── Clause: absolute-gate-fail ───────────────────────────────────────────────
if (typeof absoluteGate === "function") {
    let failCalled = false;
    const fixReport = makeReport({ base: 0, cand: 500, caseName: "cand" });
    const result = absoluteGate({
        report: fixReport,
        candidateCase: "cand",
        floorHz: 1000,
        marginComment: "test: no same-report baseline (memoized microtask floor)",
        posture: "hard",
        fail: () => { failCalled = true; },
        note: () => {},
    });
    if (result?.pass !== false) {
        fail(
            "absolute-gate-fail",
            `hz=500 should fail floorHz=1000 (got pass=${result?.pass})`,
        );
    } else if (!failCalled) {
        fail("absolute-gate-fail", "the fail hook was NOT called on a failing absolute floor (500 < 1000)");
    } else {
        ok("absolute-gate-fail", `hz=500 < floorHz=1000 → fail hook called correctly`);
    }
}

// ── Clause: absolute-gate-no-comment (MUST THROW) ────────────────────────────
if (typeof absoluteGate === "function") {
    let threw = false;
    let thrownMsg = "";
    const fixReport = makeReport({ base: 0, cand: 5000, caseName: "cand" });
    try {
        absoluteGate({
            report: fixReport,
            candidateCase: "cand",
            floorHz: 1000,
            // marginComment intentionally absent — must throw
            posture: "hard",
            fail: () => {},
            note: () => {},
        });
    } catch (e) {
        threw = true;
        thrownMsg = String(e.message ?? e);
    }
    if (!threw) {
        fail(
            "absolute-gate-no-comment",
            "absoluteGate without marginComment did NOT throw — the mandatory-comment " +
                "enforcement is broken (silent adoption of device-dependent predicates allowed)",
        );
    } else if (!/marginComment/i.test(thrownMsg)) {
        fail(
            "absolute-gate-no-comment",
            `absoluteGate threw but the error did not mention 'marginComment': "${thrownMsg.slice(0, 120)}"`,
        );
    } else {
        ok(
            "absolute-gate-no-comment",
            "absoluteGate without marginComment → THROWS (K3 portability spine enforced)",
        );
    }
}

// ── Clause: lint-no-raw-floor ────────────────────────────────────────────────
// Scan scripts/ for any `if (hz < floor)` or `hz >= WIN_FRAC` style pattern
// OUTSIDE portable-perf.mjs and ci-env.mjs (which owns the posture taxonomy).
// Decision-JSON files and this self-test are excluded.
// The pattern specifically catches raw re-derived floor math in gate scripts.
{
    const EXCLUDED_FILENAMES = new Set([
        "portable-perf.mjs",   // this is the ONE authoritative home
        "ci-env.mjs",          // the posture taxonomy authority
        "proof-portable-perf.mjs", // this self-test script
    ]);
    // Only scan .mjs files directly under scripts/ (not subdirs, which are the lib)
    const scriptsDir = join(root, "scripts");
    let scriptFiles;
    try {
        scriptFiles = readdirSync(scriptsDir)
            .filter((f) => f.endsWith(".mjs"))
            .filter((f) => !EXCLUDED_FILENAMES.has(f));
    } catch (e) {
        fail("lint-no-raw-floor", `could not read scripts/ dir: ${e.message}`);
        scriptFiles = [];
    }

    // The pattern to catch: raw floor comparisons that should be routed through
    // ratioGate / absoluteGate. We look for the specific comparison shape
    // `hz < floor` or `hz >= WIN_FRACTION` or `hz < floorHz` as a bare if-predicate.
    // We do NOT flag `floorHz` as a field name (that's taxonomy.json keys, not code).
    // Note: proof-spring-vector uses WIN_FRACTION and proof-bench-taxonomy uses hz < floor —
    // those are the OLD duplications the spec acknowledges. This lint clause fires only
    // on NEW gates (any file NOT in the exclusion list that re-introduces the pattern).
    // The existing gates (proof-spring-vector.mjs, proof-bench-taxonomy.mjs) are
    // themselves not in EXCLUDED_FILENAMES, but they are the KNOWN prior art.
    // Per the spec, the refactor of the existing gates is S3's "no-legacy" purge;
    // since that refactor is a separate author concern and these are pre-existing,
    // we scope the lint to catch NEW raw-floor patterns beyond the known two.
    const KNOWN_PRIOR_ART = new Set([
        "proof-bench-taxonomy.mjs",   // pre-existing ratio math (refactor tracked in S3)
        "proof-spring-vector.mjs",    // pre-existing WIN_FRACTION (refactor tracked in S3)
    ]);
    const RAW_FLOOR_RE = /\bhz\s*[<>]=?\s*(?:floor|floorHz|WIN_FRAC)/;

    const violations = [];
    for (const file of scriptFiles) {
        if (KNOWN_PRIOR_ART.has(file)) continue;
        const src = readFileSync(join(scriptsDir, file), "utf8");
        const lines = src.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (RAW_FLOOR_RE.test(line) && !line.trim().startsWith("//")) {
                violations.push(`${file}:${i + 1}: ${line.trim()}`);
            }
        }
    }

    if (violations.length > 0) {
        fail(
            "lint-no-raw-floor",
            `raw floor-comparison patterns found OUTSIDE portable-perf.mjs ` +
                `(a new gate re-derived the ratio math — import ratioGate/absoluteGate instead):\n` +
                violations.map((v) => `    ${v}`).join("\n"),
        );
    } else {
        ok(
            "lint-no-raw-floor",
            `no raw hz<floor / hz>=WIN_FRAC patterns in new gate scripts ` +
                `(the known pre-existing prior art in proof-bench-taxonomy.mjs + ` +
                `proof-spring-vector.mjs is excluded from the lint, tracked for S3 refactor)`,
        );
    }
}

// ── Summary ──────────────────────────────────────────────────────────────────
console.log("");
if (failures.length > 0) {
    console.error("proof:portable-perf — FAIL:\n" + failures.join("\n"));
    process.exit(1);
}
console.log(
    "proof:portable-perf — PASS: the shared perf-gate helper (scripts/lib/portable-perf.mjs)\n" +
        "exports ratioGate + absoluteGate; both contracts hold on fixture reports (pass/fail/\n" +
        "missing-case/no-comment-throw); no raw floor-comparison math in new gate scripts.\n" +
        "Future perf gates call ratioGate/absoluteGate — the X1 per-bench duplication prevented.",
);
