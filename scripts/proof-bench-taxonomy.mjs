#!/usr/bin/env node
/**
 * proof:bench-taxonomy — L.W7 S6, Lane 33 (audit ⚠34): the BUDGETED bench gate.
 *
 * proof:bench-runs is a RUN-CHECK (the benches run, a positive `hz` is emitted,
 * no budget asserted — a 2× regression prints a slower number and that gate
 * STAYS GREEN; this is correct by design, `proof-bench-runs.mjs §RECORD`). Two
 * gaps follow (`L.W7.md §S6`):
 *
 *   1. No bench covers the value.js color-math alloc claims (VJ.L1–VJ.L8 /
 *      W78–W85 — transformMat3/oklab2xyz/mixColors/gamutMapToRgbSpace). These
 *      are SIBLING hot paths; kf cannot bench value.js's internals — they are
 *      dispatched as `cross-repo` asks (KF-TO-VALUEJS-O-ASKS.md §7), and this
 *      gate asserts the dispatch is intact (every VJ.L# present in the doc).
 *   2. Every bench-backed SOTA claim (the lerpArray SoA K=8 win, the warmEngine
 *      pre-resolve) is UN-BUDGETED: proof:bench-runs would stay green through a
 *      >20% regression. This gate asserts the `budgeted` floors.
 *
 * The manifest (`bench/taxonomy.json`) maps every bench case in the five named
 * suites to one of {run-check, observe-only, budgeted, cross-repo}. This gate:
 *   - reads the manifest, runs the named suites once (one `vitest bench --run`),
 *   - asserts EVERY case in every suite is covered by the manifest (no orphan
 *     case silently un-classified — the coverage floor),
 *   - for `budgeted` cases: parses `hz`, asserts `hz >= floor` (floor = a sibling
 *     baselineCase's hz × floorFraction, computed from the SAME report so it
 *     tracks the runner — OR an absolute floorMs/floorHz when stated),
 *   - for `run-check`/`observe-only`: asserts a finite positive `hz` (delegates
 *     to proof:bench-runs's contract),
 *   - for `cross-repo` (the VJ.L# asks): does NOT run a kf bench — asserts the
 *     id is listed in KF-TO-VALUEJS-O-ASKS.md.
 *
 * ── inv-L-device-honesty ─────────────────────────────────────────────────────
 * A `budgeted` floor is a device-DEPENDENT wall-clock predicate. The budgeted
 * arm declares `observe-only` posture (`ci-env.declarePosture`): in CI the miss
 * is RECORDED (never red on the slow Linux runner); on-device/local it is HARD.
 * The taxonomy STRUCTURE — every case covered, every cross-repo ask present, the
 * budgeted cases NAMED — is device-INDEPENDENT and HARD everywhere.
 *
 * ── BORN-RED TODAY ───────────────────────────────────────────────────────────
 * This script + `bench/taxonomy.json` + the `proof:bench-taxonomy` package.json
 * key did not exist before L.W7. Even with the script present, the gate RED-s on
 * today's tree because the `pendingBudgeted` warmEngine-pre-resolve case names a
 * bench arm L.W7's S1 cure has NOT shipped (warmEngine is unimplemented per
 * W121) — the gate cannot find the case in the report and fails the
 * budgeted-coverage clause. GREEN when: the manifest covers every case, the
 * budgeted arms (incl. the warmEngine case) exist and hold their floors, and the
 * VJ.L1–VJ.L8 cross-repo asks are present in the dispatch doc.
 *
 * Mirrors proof:bench-runs's spawn/parse shape; exits 1 on any residual.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { declarePosture } from "./lib/ci-env.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

// The budgeted arm is the one device-DEPENDENT clause — observe-only in CI,
// HARD on-device/local. Its misses route through `budget.miss`.
const budget = declarePosture("observe-only", {
    reason: "wall-clock throughput floor — re-measure on-device (the slow Linux runner reports a lower hz)",
    fail: (label) => fail("budgeted", label),
    note: (label) => console.log(`  · ${label}`),
});

// ── Load the manifest ────────────────────────────────────────────────────────
const manifestPath = join(root, "bench", "taxonomy.json");
if (!existsSync(manifestPath)) {
    console.error(
        `proof:bench-taxonomy — FAIL: the manifest is absent at bench/taxonomy.json`,
    );
    process.exit(1);
}

let manifest;
try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
} catch (e) {
    console.error(
        `proof:bench-taxonomy — FAIL: bench/taxonomy.json is not valid JSON: ${e.message}`,
    );
    process.exit(1);
}

const SUITES = Array.isArray(manifest.suites) ? manifest.suites : [];
const CASES = Array.isArray(manifest.cases) ? manifest.cases : [];
const PENDING = Array.isArray(manifest.pendingBudgeted)
    ? manifest.pendingBudgeted
    : [];
const CROSS_REPO = Array.isArray(manifest.crossRepo) ? manifest.crossRepo : [];

const VALID_CATEGORIES = new Set([
    "run-check",
    "observe-only",
    "budgeted",
    "cross-repo",
]);

// ── Clause: manifest well-formed ─────────────────────────────────────────────
if (SUITES.length === 0) {
    fail("manifest", "the manifest declares no `suites`");
}
for (const c of CASES) {
    if (!c || typeof c.name !== "string" || typeof c.suite !== "string") {
        fail("manifest", `a case entry is missing name/suite: ${JSON.stringify(c)}`);
        continue;
    }
    if (!VALID_CATEGORIES.has(c.category)) {
        fail(
            "manifest",
            `case "${c.name}" has an unknown category "${c.category}" ` +
                `(must be one of ${[...VALID_CATEGORIES].join(" | ")})`,
        );
    }
}

// ── Clause: cross-repo asks present in the dispatch doc ───────────────────────
// The VJ.L1–VJ.L8 color-math alloc asks are value.js's to bench; kf asserts the
// dispatch is intact so the frontier stays TRACKED (the §Bite regression:
// silently dropping the asks makes the color-math frontier untracked).
const dispatchPath = join(
    root,
    "docs",
    "tranches",
    "L",
    "KF-TO-VALUEJS-O-ASKS.md",
);
if (!existsSync(dispatchPath)) {
    fail(
        "cross-repo",
        "the dispatch doc docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md is absent",
    );
} else {
    const dispatch = readFileSync(dispatchPath, "utf8");
    const EXPECTED_VJ = Array.from({ length: 8 }, (_, i) => `VJ.L${i + 1}`);
    const namedIds = new Set(CROSS_REPO.map((x) => x && x.id));
    for (const vj of EXPECTED_VJ) {
        if (!namedIds.has(vj)) {
            fail(
                "cross-repo",
                `the manifest's crossRepo[] omits ${vj} (the value.js color-math ask)`,
            );
        }
    }
    // The doc must NAME the VJ.L1–VJ.L8 range. The §7 header carries
    // "VJ.L1–L8" (en-dash); accept either the range form or every id.
    const hasRange = /VJ\.L1\s*[–-]\s*L8/.test(dispatch);
    const hasEvery = EXPECTED_VJ.every((vj) => dispatch.includes(vj));
    if (!hasRange && !hasEvery) {
        fail(
            "cross-repo",
            `KF-TO-VALUEJS-O-ASKS.md does not name the VJ.L1–VJ.L8 color-math ` +
                `perf set (the §7 dispatch)`,
        );
    } else {
        ok(
            "cross-repo",
            `KF-TO-VALUEJS-O-ASKS.md names the VJ.L1–VJ.L8 color-math asks; ` +
                `the manifest's crossRepo[] enumerates all 8`,
        );
    }
}

// ── Clause: bench source paths resolve (T-PERF-A / T.G8 static anchor) ────────
// bench/playwright.bench.ts reads `demo/app/lifecycle/loaf-observer.ts` off the
// tree at run time (transpiled on the fly). That path moved once already
// (demo/app/loaf-observer.ts → demo/app/lifecycle/loaf-observer.ts at the S.D1
// partition, commit 440e5c3) WITHOUT the bench following it, ENOENT-ing the
// whole LoAF gate SILENTLY for 116 commits — invisible at every tier (lane 32
// §2.7). This is the guard the wave names: statically extract every
// `path.join(REPO, "…")` string literal the bench reads and assert it resolves,
// so a future demo/app re-partition reds LOUDLY here instead of zeroing the
// LoAF signal. HARD everywhere (a device-independent structural fact).
{
    const benchSrcPath = join(root, "bench", "playwright.bench.ts");
    if (!existsSync(benchSrcPath)) {
        fail("bench-paths", `bench/playwright.bench.ts is absent (renamed?)`);
    } else {
        const src = readFileSync(benchSrcPath, "utf8");
        // Match `path.join(REPO, "…")` — the REPO-relative tree reads (the
        // observer source, dist artifacts). We intentionally do NOT match
        // path.join(HERE, …) (colocated bench assets) — the historical break was
        // a REPO-relative demo/ path drifting out from under the bench.
        const re = /path\.join\(\s*REPO\s*,\s*"([^"]+)"\s*\)/g;
        const relPaths = new Set();
        let m;
        while ((m = re.exec(src)) !== null) relPaths.add(m[1]);
        if (relPaths.size === 0) {
            fail(
                "bench-paths",
                `no path.join(REPO, "…") reads found in bench/playwright.bench.ts ` +
                    `— the anchor's extraction regex has drifted from the source`,
            );
        }
        const srcRels = [...relPaths].filter(
            (r) => r !== "dist" && !r.startsWith("dist/"),
        );
        for (const rel of relPaths) {
            // Skip build artifacts that only exist after `npm run build` (the
            // `dist/` tree + the `dist/keyframes.js` entry) — the bench already
            // guards those at run time; this anchor is about SOURCE paths that
            // must exist on a clean tree.
            if (rel === "dist" || rel.startsWith("dist/")) continue;
            if (!existsSync(join(root, rel))) {
                fail(
                    "bench-paths",
                    `bench/playwright.bench.ts reads path.join(REPO, "${rel}") ` +
                        `but ${rel} does NOT resolve on the tree — it moved. ` +
                        `Update the bench's path (this is the exact silent ENOENT ` +
                        `that dead-ended the LoAF gate for 116 commits).`,
                );
            }
        }
        if (!failures.some((f) => f.includes("[bench-paths]"))) {
            ok(
                "bench-paths",
                `every REPO-relative source path bench/playwright.bench.ts reads ` +
                    `resolves on the tree (${srcRels.join(", ")})`,
            );
        }
    }
}

// ── Run the benches once, capture the structured report ──────────────────────
const tmp = mkdtempSync(join(tmpdir(), "kf-bench-taxonomy-"));
const outFile = join(tmp, "bench.json");

try {
    const run = spawnSync(
        "npx",
        ["vitest", "bench", "--run", ...SUITES, `--outputJson=${outFile}`],
        { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );

    if (run.error) {
        fail("run", `failed to spawn \`vitest bench\`: ${run.error.message}`);
    } else if (run.status !== 0) {
        const tail = `${run.stdout ?? ""}\n${run.stderr ?? ""}`
            .split("\n")
            .filter((l) => l.trim().length > 0)
            .slice(-20)
            .join("\n");
        fail("run", `\`vitest bench\` exited ${run.status}. Tail:\n${tail}`);
    } else if (!existsSync(outFile)) {
        fail("run", `the bench report was not written to ${outFile}`);
    } else {
        let report;
        try {
            report = JSON.parse(readFileSync(outFile, "utf8"));
        } catch (e) {
            fail("run", `could not parse the bench report: ${e.message}`);
        }

        if (report) {
            // Build a flat name→hz map across every reported suite.
            const hzByName = new Map();
            const namesBySuite = new Map();
            const files = Array.isArray(report.files) ? report.files : [];
            for (const file of files) {
                const fp = String(file.filepath ?? "");
                const suite = SUITES.find((s) =>
                    fp.endsWith(s.replace("bench/", "/")),
                );
                const groups = Array.isArray(file.groups) ? file.groups : [];
                const benches = groups.flatMap((g) =>
                    Array.isArray(g.benchmarks) ? g.benchmarks : [],
                );
                if (suite) {
                    namesBySuite.set(
                        suite,
                        new Set(benches.map((b) => String(b.name))),
                    );
                }
                for (const b of benches) {
                    hzByName.set(String(b.name), b.hz);
                }
            }

            if (run.status === 0) {
                ok("run", `\`vitest bench --run\` over ${SUITES.length} suites exited 0`);
            }

            // ── Clause: coverage — every reported case is in the manifest ────
            // No orphan bench case may go un-classified (the coverage floor).
            const manifestNames = new Set(CASES.map((c) => c.name));
            for (const [suite, reported] of namesBySuite) {
                for (const name of reported) {
                    if (!manifestNames.has(name)) {
                        fail(
                            "coverage",
                            `${suite}: bench case "${name}" is not classified in ` +
                                `bench/taxonomy.json (add it to cases[] with a category)`,
                        );
                    }
                }
            }
            // ...and every manifest case (except pendingBudgeted) must appear in
            // the report (a renamed/dropped case the manifest still names).
            for (const c of CASES) {
                const reported = namesBySuite.get(c.suite);
                if (!reported || !reported.has(c.name)) {
                    fail(
                        "coverage",
                        `manifest case "${c.name}" (${c.suite}) is absent from ` +
                            `the bench report (renamed or dropped?)`,
                    );
                }
            }
            if (
                !failures.some((f) => f.includes("[coverage]")) &&
                manifestNames.size > 0
            ) {
                ok(
                    "coverage",
                    `every reported bench case is classified; every classified ` +
                        `case is reported (${manifestNames.size} cases)`,
                );
            }

            // ── Clause: finite positive hz for every run-check/observe-only ──
            for (const c of CASES) {
                if (c.category === "cross-repo") continue;
                const hz = hzByName.get(c.name);
                if (typeof hz !== "number" || !Number.isFinite(hz) || hz <= 0) {
                    fail(
                        "non-empty",
                        `"${c.name}" yielded no valid throughput (hz=${JSON.stringify(hz)})`,
                    );
                }
            }
            if (!failures.some((f) => f.includes("[non-empty]"))) {
                ok("non-empty", `every classified case reported a finite positive hz`);
            }

            // ── Clause: budgeted floors (observe-only posture in CI) ─────────
            const budgetedCases = CASES.filter((c) => c.category === "budgeted");
            for (const c of budgetedCases) {
                const hz = hzByName.get(c.name);
                if (typeof hz !== "number" || !Number.isFinite(hz) || hz <= 0) {
                    // A budgeted case absent/invalid is a HARD structural miss,
                    // not a device-dependent throughput miss.
                    fail(
                        "budgeted",
                        `budgeted case "${c.name}" is absent/invalid in the report (hz=${JSON.stringify(hz)})`,
                    );
                    continue;
                }
                let floor;
                let basis;
                if (typeof c.baselineCase === "string") {
                    const baseHz = hzByName.get(c.baselineCase);
                    const frac = typeof c.floorFraction === "number" ? c.floorFraction : 1;
                    if (typeof baseHz !== "number" || !Number.isFinite(baseHz)) {
                        fail(
                            "budgeted",
                            `budgeted case "${c.name}" names baselineCase ` +
                                `"${c.baselineCase}" which has no reported hz`,
                        );
                        continue;
                    }
                    floor = baseHz * frac;
                    basis = `${frac}× baseline ("${c.baselineCase}" @ ${baseHz.toFixed(1)} hz)`;
                } else if (typeof c.floorHz === "number") {
                    floor = c.floorHz;
                    basis = `absolute floorHz`;
                } else {
                    fail(
                        "budgeted",
                        `budgeted case "${c.name}" declares no floor ` +
                            `(need baselineCase+floorFraction or floorHz)`,
                    );
                    continue;
                }
                if (hz < floor) {
                    budget.miss(
                        `budgeted case "${c.name}" ran ${hz.toFixed(1)} hz < floor ` +
                            `${floor.toFixed(1)} hz (${basis})`,
                    );
                } else {
                    ok(
                        "budgeted",
                        `"${c.name}" held: ${hz.toFixed(1)} hz >= ${floor.toFixed(1)} hz (${basis})`,
                    );
                }
            }

            // ── Clause: pendingBudgeted cases must EXIST in the report ────────
            // S6 GREEN criterion #2: the budgeted entries must INCLUDE the
            // warmEngine pre-resolve case (S1). It is BORN-RED today — the arm
            // does not exist until S1 ships, so the gate cannot find it. This is
            // a HARD coverage miss (the bench arm is absent, not slow), not a
            // device-dependent throughput miss.
            for (const c of PENDING) {
                if (!hzByName.has(c.name)) {
                    fail(
                        "budgeted-pending",
                        `the budgeted bench arm "${c.name}" (${c.suite}) does NOT ` +
                            `exist yet — L.W7 ${c.$note ? "" : ""}requires it for ` +
                            `S6 GREEN. ${c.$note ?? ""}`.trim(),
                    );
                }
            }
        }
    }
} finally {
    rmSync(tmp, { recursive: true, force: true });
}

console.log("");
if (failures.length > 0) {
    console.error("proof:bench-taxonomy — FAIL:\n" + failures.join("\n"));
    process.exit(1);
}
console.log(
    "proof:bench-taxonomy — PASS: the budgeted bench manifest holds — every bench\n" +
        "case is classified, every budgeted floor is met (observe-only in CI), and the\n" +
        "VJ.L1–VJ.L8 color-math asks are dispatched to value.js Tranche O.",
);
