#!/usr/bin/env node
/**
 * proof:bench-runs — F.W1 S5, the falsifiable close for "the benches run".
 *
 * Runs `npx vitest bench --run` over the compile + interp + parser suites and
 * asserts (a) exit 0 AND (b) NON-EMPTY results — a parsed, finite, positive `hz`
 * throughput number for EVERY benchmark case in the report. It is the falsifiable
 * form of the F.W1 unblock: the four lanes that converged on the broken-bench
 * blocker (`F.md §F.W1`) needed an instrument that reds the moment a bench
 * TypeErrors or yields no number.
 *
 *   BITES TODAY: revert `bench/{interpolation,parser}.bench.ts:2` to import
 *   `CSSKeyframesAnimation` from the type-only barrel `"../src/animation"` → the
 *   static named import resolves `undefined` → `new undefined(...)` throws
 *   `TypeError: CSSKeyframesAnimation is not a constructor` → vitest exits
 *   non-zero → this gate reds. It also bites a bench that runs but produces a
 *   non-finite / non-positive hz (a parse that throws into the bench body, an
 *   empty group, a dropped case).
 *
 * RECORD (the budget-free posture — carried so no future lane mistakes green for
 * "no regression"): the vitest benches are intentionally BUDGET-FREE reporters
 * (`a-test-quality §4`). A 2× regression prints a slower number and this gate
 * STAYS GREEN — this is a RUN-CHECK, not a budget. The gates that ASSERT a
 * throughput budget are F4/F5/F6's `proof:interp-fastprops` / `proof:sync-step`
 * / `proof:computed-frame`. Conflating "the benches run" with "the benches hold
 * a budget" would over-claim; the two are separate gates by correct design.
 *
 * SCOPE: the compile/interp/parser suites only. `playwright.bench.ts` is
 * EXCLUDED — it needs a real browser (`KF_PLAYWRIGHT_DIR` + Chromium), a
 * legitimate CI-calibration excuse the in-process suites do not carry
 * (`a-test-quality §1`).
 *
 * Mirrors `proof:engine`/`proof:boundary`: exits 1 on any residual.
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// The in-process suites this gate runs — every runnable bench file EXCEPT
// `playwright.bench.ts` (browser-gated). Listed explicitly so a new bench file
// is a deliberate addition here, not an accidental inclusion.
const SUITES = [
    "bench/interpolation.bench.ts",
    "bench/parser.bench.ts",
    "bench/interp-buffer.bench.ts",
    "bench/compile.bench.ts",
    "bench/sync-step.bench.ts",
    "bench/spring-tick.bench.ts",
];

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

// ── Run the benches, capturing the structured report ─────────────────────────
const tmp = mkdtempSync(join(tmpdir(), "kf-bench-runs-"));
const outFile = join(tmp, "bench.json");

let run;
try {
    run = spawnSync(
        "npx",
        ["vitest", "bench", "--run", ...SUITES, `--outputJson=${outFile}`],
        { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );

    // ── Clause 1: exit 0 (the TypeError-biting clause) ───────────────────────
    if (run.error) {
        fail(
            "exit-zero",
            `failed to spawn \`vitest bench\`: ${run.error.message}`,
        );
    } else if (run.status !== 0) {
        const tail = `${run.stdout ?? ""}\n${run.stderr ?? ""}`
            .split("\n")
            .filter((l) => l.trim().length > 0)
            .slice(-20)
            .join("\n");
        fail(
            "exit-zero",
            `\`vitest bench\` exited ${run.status} (a bench threw — e.g. the ` +
                `type-only-barrel TypeError this gate forbids). Tail:\n${tail}`,
        );
    } else {
        ok(
            "exit-zero",
            `\`vitest bench --run\` over ${SUITES.length} suites exited 0`,
        );
    }

    // ── Clause 2: non-empty results — a finite, positive hz per case ─────────
    if (run.status === 0) {
        let report;
        try {
            report = JSON.parse(readFileSync(outFile, "utf8"));
        } catch (e) {
            fail(
                "non-empty",
                `could not read/parse the bench report at ${outFile}: ${e.message}`,
            );
        }

        if (report) {
            const files = Array.isArray(report.files) ? report.files : [];
            if (files.length === 0) {
                fail("non-empty", "the bench report contains zero files");
            }

            let totalCases = 0;
            const seenSuites = new Set();

            for (const file of files) {
                const fp = String(file.filepath ?? "");
                seenSuites.add(
                    SUITES.find((s) => fp.endsWith(s.replace("bench/", "/"))) ??
                        fp,
                );
                const groups = Array.isArray(file.groups) ? file.groups : [];
                const benches = groups.flatMap((g) =>
                    Array.isArray(g.benchmarks) ? g.benchmarks : [],
                );

                if (benches.length === 0) {
                    fail(
                        "non-empty",
                        `${fp} produced no benchmark cases (empty/missing groups)`,
                    );
                    continue;
                }

                for (const b of benches) {
                    totalCases += 1;
                    const hz = b.hz;
                    if (typeof hz !== "number" || !Number.isFinite(hz) || hz <= 0) {
                        fail(
                            "non-empty",
                            `"${b.name}" (${fp}) yielded no valid throughput ` +
                                `(hz=${JSON.stringify(hz)}) — the case ran ` +
                                `empty, errored into its body, or was dropped`,
                        );
                    }
                }
            }

            // Every requested suite must appear in the report — a silently
            // skipped suite (a missing/renamed file) is the absence the gate
            // forbids (clause 2 of the §Hard gate: "missing/empty bench → reds").
            const missing = SUITES.filter(
                (s) =>
                    ![...seenSuites].some((seen) =>
                        String(seen).endsWith(s.replace("bench/", "/")),
                    ),
            );
            if (missing.length > 0) {
                fail(
                    "non-empty",
                    `requested suites absent from the report: ${missing.join(", ")}`,
                );
            }

            if (failures.length === 0) {
                ok(
                    "non-empty",
                    `every case across ${seenSuites.size} suites reported a ` +
                        `finite positive hz (${totalCases} cases total)`,
                );
            }
        }
    }
} finally {
    rmSync(tmp, { recursive: true, force: true });
}

console.log("");
if (failures.length > 0) {
    console.error("proof:bench-runs — FAIL:\n" + failures.join("\n"));
    process.exit(1);
}
console.log(
    "proof:bench-runs — PASS: the compile/interp/parser bench suites RUN —\n" +
        "vitest bench exits 0 and every case reports a finite positive hz. This is\n" +
        "a RUN-CHECK, not a budget (the throughput budgets are gated by F4/F5/F6).",
);
