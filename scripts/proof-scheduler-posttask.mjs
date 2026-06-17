#!/usr/bin/env node
/**
 * proof:scheduler-posttask — L.W7 S4, the `scheduler.postTask` priority-bands
 * BOOK→born-RED probe (W123).
 *
 * `scheduler.postTask` ships priority bands ("user-blocking" for a gesture's
 * first visible frame, "background" for `warmEngine()`'s pre-flight chunk
 * loads). `internal/scheduler.ts` probes only `scheduler.yield` (lines 41-48)
 * and never `postTask`. The audit's born-RED discipline (W123): this is a
 * BOOK→probe wave — the gate does NOT assert a throughput improvement; it
 * asserts the probe result is SKIP (no API in the env) or GREEN (no error), and
 * that `yieldToMain()`'s `scheduler.yield` fast-path is UNAFFECTED.
 *
 * The script runs `test/scheduler-posttask-probe.test.ts` and asserts:
 *   - exit 0 (the probe passes — the SKIP-when-absent arm + the device-
 *     independent "yieldToMain uses scheduler.yield, never postTask" assertion);
 *   - the probe file exists and is named in the suite (a renamed/dropped probe
 *     is the absence the gate forbids).
 *
 * MEASURE-FIRST (the L.W7 guardrail): only when this probe is GREEN does the
 * production `warmEngine()` (S1) adopt `scheduler.postTask(…, { priority:
 * "background" })`. No `postTask` code ships into `scheduler.ts` / `index.ts`
 * without this probe green. The §Bite: replacing `scheduler.yield` with
 * `postTask` in `yieldToMain` would serialize a group's batch-slice yields with
 * background imports — the assertion-3 arm in the probe catches exactly that.
 *
 * ── BORN-RED TODAY ───────────────────────────────────────────────────────────
 * This script + the `proof:scheduler-posttask` package.json key did not exist
 * before L.W7 — `npm run proof:scheduler-posttask` exits non-zero (missing
 * script). GREEN when the script exists AND the probe passes (the
 * yieldToMain-uses-yield assertion holds; the postTask arm SKIPs in jsdom).
 *
 * Mirrors proof:bench-runs's spawn shape; exits 1 on any residual.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const PROBE = "test/scheduler-posttask-probe.test.ts";

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

// ── Clause: the probe file exists ────────────────────────────────────────────
if (!existsSync(join(root, PROBE))) {
    fail("present", `the probe file ${PROBE} is absent`);
} else {
    ok("present", `${PROBE} is present`);

    // ── Clause: the probe passes (SKIP-when-absent | GREEN) ──────────────────
    const run = spawnSync("npx", ["vitest", "run", PROBE], {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
    });

    if (run.error) {
        fail("probe", `failed to spawn \`vitest run\`: ${run.error.message}`);
    } else if (run.status !== 0) {
        const tail = `${run.stdout ?? ""}\n${run.stderr ?? ""}`
            .split("\n")
            .filter((l) => l.trim().length > 0)
            .slice(-20)
            .join("\n");
        fail(
            "probe",
            `the scheduler.postTask probe exited ${run.status} — the ` +
                `yieldToMain-uses-scheduler.yield assertion failed (or the ` +
                `postTask arm errored). Tail:\n${tail}`,
        );
    } else {
        ok(
            "probe",
            `the scheduler.postTask probe passed (SKIP-when-absent + the ` +
                `device-independent yieldToMain-uses-yield assertion)`,
        );
    }
}

console.log("");
if (failures.length > 0) {
    console.error("proof:scheduler-posttask — FAIL:\n" + failures.join("\n"));
    process.exit(1);
}
console.log(
    "proof:scheduler-posttask — PASS: the scheduler.postTask priority-bands probe\n" +
        "is GREEN — postTask is detected-or-skipped and yieldToMain's scheduler.yield\n" +
        "fast-path is unaffected. (MEASURE-FIRST: warmEngine adopts postTask only now.)",
);
