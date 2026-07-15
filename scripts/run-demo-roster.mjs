#!/usr/bin/env node
/**
 * run-demo-roster — the S.A2 S2 net-deletion driver: run a demo-gate TIER as ONE
 * report-all step against a SHARED chromium + a STABLE dist snapshot (SPEC §3
 * S.A2 S2).
 *
 * THE OBSERVED PROBLEM (why net-deletion is mandated). The former demo-smoke job
 * ran ~50 browser gates as ~50 separate `npm run proof:*` steps, EACH launching
 * its own chromium (~50 launches under the 50-minute ceiling — the device-
 * dependence APPARATUS concern) and EACH serving its own `dist/gh-pages`. Worse:
 * a handful of gates internally run `build:lib`, which EMPTIES `dist/`; the
 * orchestrator's roster run proved that a mid-roster wipe cascaded FALSE
 * `HarnessRequiredError` reds into every concurrent gate.
 *
 * THE CURE (this driver):
 *   1. build gh-pages once (if absent), then SNAPSHOT it to a stable temp dir —
 *      immune to a mid-roster `build:lib` that empties the real dist/.
 *   2. launch ONE chromium `launchServer()` + serve the snapshot ONCE; export
 *      `KF_SHARED_BROWSER_WS` / `KF_SHARED_DIST_URL` / `KF_SHARED_DIST_DIR` so
 *      every gate (via the demo-driver seam) CONNECTS to the one chromium and
 *      reads the one snapshot instead of launching/serving its own.
 *   3. run each gate as a subprocess; AFTER each, HEAL `dist/gh-pages` back from
 *      the snapshot if the gate wiped it (covers the minority of gates that read
 *      the real tree directly rather than through the seam).
 *   4. REPORT-ALL: collect every exit code, print each gate's verdict, CLASSIFY
 *      reds into the S.A0 BACKLOG (expected, discharged at the named wave) vs
 *      UNEXPECTED (an S.A2 regression). Exit 1 iff ANY gate red'd — the BACKLOG
 *      rows are BLOCKING, so demo-correctness stays honestly RED until S.G2/G3
 *      close (the "failing set ⊆ backlog" verdict is printed for the gate).
 *
 * This is ONE CI step, so demo-correctness needs NO step-level
 * `continue-on-error` (the report-all is INSIDE the driver) — the SPEC §3 S.A2
 * "zero continue-on-error masking" clause is satisfied structurally.
 *
 * Usage:
 *   node scripts/run-demo-roster.mjs --tier=correctness      # the blocking roster
 *   node scripts/run-demo-roster.mjs --tier=correctness --workers=1  # serial (default)
 *   node scripts/run-demo-roster.mjs --tier=correctness --only=proof:cold-entry,proof:idle-fade
 */
import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { IN_CI } from "./lib/ci-env.mjs";
import { resolveChromium, serveDist } from "./lib/demo-driver.mjs";
import { BACKLOG, CORRECTNESS_ROSTER, OBSERVE_IN_CI } from "./demo-roster.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GHPAGES = path.join(REPO, "dist", "gh-pages");

const argv = process.argv.slice(2);
const flag = (name, def) => {
    const a = argv.find((x) => x.startsWith(`--${name}=`));
    return a ? a.slice(name.length + 3) : def;
};
const tier = flag("tier", "correctness");
const workers = Math.max(1, Number(flag("workers", 1)) || 1);
// A per-gate wall-clock CEILING so ONE hung gate cannot consume the whole 50m job
// budget (the report-all must still verdict every OTHER gate). Playwright's own
// timeouts should fire first; this is the defensive backstop. Not a settle race —
// it is a subprocess kill, not a page.waitForTimeout.
const gateTimeoutMs = Math.max(30, Number(flag("gate-timeout", 300)) || 300) * 1000;
const only = flag("only", "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const TIERS = { correctness: CORRECTNESS_ROSTER };
let roster = TIERS[tier];
if (!roster) {
    console.error(`run-demo-roster: unknown tier "${tier}" — one of ${Object.keys(TIERS).join(", ")}`);
    process.exit(2);
}
if (only.length) roster = roster.filter((g) => only.includes(g));

console.log(
    `run-demo-roster — tier=${tier} · ${roster.length} gate(s) · one shared chromium + one served dist ` +
        `snapshot · report-all (S.A2 S2 net-deletion)`,
);

// ── 1. dist/gh-pages present, then SNAPSHOT it (wipe-immune) ───────────────────
if (!fs.existsSync(path.join(GHPAGES, "index.html"))) {
    console.log("  · dist/gh-pages absent — building (npm run gh-pages)…");
    execSync("npm run gh-pages", { cwd: REPO, stdio: "inherit" });
}
const snapshot = fs.mkdtempSync(path.join(os.tmpdir(), "kf-demo-roster-"));
fs.cpSync(GHPAGES, snapshot, { recursive: true });
console.log(`  · dist snapshot → ${snapshot} (immune to a mid-roster build:lib wipe)`);

/** Heal dist/gh-pages from the snapshot if a gate emptied it (the cascade cure
 *  for gates that read the real tree directly, not through the demo-driver seam). */
function healGhPages() {
    if (!fs.existsSync(path.join(GHPAGES, "index.html"))) {
        fs.mkdirSync(GHPAGES, { recursive: true });
        fs.cpSync(snapshot, GHPAGES, { recursive: true });
        return true;
    }
    return false;
}

// ── 2. ONE shared chromium + ONE served snapshot ──────────────────────────────
const chromium = resolveChromium();
if (!chromium) {
    console.error(
        "run-demo-roster: playwright not resolvable (set KF_PLAYWRIGHT_DIR or install @playwright/test) — " +
            "the shared browser cannot start.",
    );
    process.exit(1);
}
const browserServer = await chromium.launchServer();
const wsEndpoint = browserServer.wsEndpoint();
const distServer = await serveDist(snapshot);
console.log(`  · shared chromium ws=${wsEndpoint.replace(/\/[0-9a-f]{16,}.*$/i, "/…")} · served dist=${distServer.url}`);

const childEnv = {
    ...process.env,
    KF_REQUIRE_BROWSER: "1",
    KF_SHARED_BROWSER_WS: wsEndpoint,
    KF_SHARED_DIST_URL: distServer.url,
    KF_SHARED_DIST_DIR: snapshot,
};

/** Run ONE gate as a subprocess; resolve its { gate, code, ms, timedOut }. */
function runGate(gate) {
    return new Promise((resolve) => {
        const t0 = Date.now();
        console.log(`\n──── ${gate} ────`);
        const child = spawn("npm", ["run", gate], {
            cwd: REPO,
            env: childEnv,
            stdio: "inherit",
        });
        let timedOut = false;
        const timer = setTimeout(() => {
            timedOut = true;
            console.error(`  ✗ ${gate} — exceeded the per-gate ceiling (${gateTimeoutMs / 1000}s) — killed.`);
            child.kill("SIGTERM");
            setTimeout(() => child.kill("SIGKILL"), 5000).unref();
        }, gateTimeoutMs);
        const done = (code) => {
            clearTimeout(timer);
            healGhPages(); // heal a mid-roster dist wipe before the next gate
            resolve({ gate, code: timedOut ? 1 : code ?? 1, ms: Date.now() - t0, timedOut });
        };
        child.on("close", (code) => done(code));
        child.on("error", () => done(1));
    });
}

// ── 3. run the roster (default serial for shared-browser timing safety) ────────
const results = [];
async function drain() {
    const queue = [...roster];
    async function worker() {
        for (;;) {
            const gate = queue.shift();
            if (!gate) return;
            results.push(await runGate(gate));
        }
    }
    await Promise.all(Array.from({ length: Math.min(workers, roster.length) }, worker));
}
try {
    await drain();
} finally {
    await distServer.close().catch(() => {});
    await browserServer.close().catch(() => {});
    fs.rmSync(snapshot, { recursive: true, force: true });
}

// ── 4. REPORT-ALL + the "failing set ⊆ backlog" verdict ───────────────────────
const allFailed = results.filter((r) => r.code !== 0).map((r) => r.gate);
const passed = results.filter((r) => r.code === 0).map((r) => r.gate);
// The OBSERVE-IN-CI carve-out (demo-roster.mjs — the visual-lock adjudication):
// declared-posture observe gates ride the roster for harness amortisation; IN CI
// their reds RECORD (annotated below) and never block; off-CI they hard-gate.
const observedRed = IN_CI ? allFailed.filter((g) => OBSERVE_IN_CI.includes(g)) : [];
const failed = allFailed.filter((g) => !observedRed.includes(g));
// The live demo-roster manifest is the sole expected-red authority. A red outside
// this explicit set is an unexpected regression; no dissolved T ledger masks it.
const EXPECTED_BACKLOG = { ...BACKLOG };
const backlogRed = failed.filter((g) => g in EXPECTED_BACKLOG);
const unexpectedRed = failed.filter((g) => !(g in EXPECTED_BACKLOG));

console.log(`\n════ run-demo-roster (tier=${tier}) — REPORT-ALL ════`);
console.log(`  passed: ${passed.length}/${results.length}`);
if (observedRed.length) {
    console.log(
        `  OBSERVE-IN-CI reds (RECORDED, not blocking — declared posture; hard-gates on-device): ` +
            observedRed.join(", "),
    );
}
if (backlogRed.length) {
    console.log(
        `  BACKLOG reds (EXPECTED — S.A0 external holds enumerated, discharged at the named wave): ` +
            backlogRed.map((g) => `${g}→${EXPECTED_BACKLOG[g]}`).join(", "),
    );
}
if (unexpectedRed.length) {
    console.error(
        `  ✗ UNEXPECTED reds (OUTSIDE the S.A0 backlog — an S.A2 regression, or a downstream defect): ` +
            unexpectedRed.join(", "),
    );
}

if (failed.length === 0) {
    const observedNote = observedRed.length
        ? ` (${observedRed.length} declared-posture observe red(s) RECORDED above, not blocking)`
        : "";
    console.log(
        `\nrun-demo-roster — PASS: all ${results.length - observedRed.length} blocking ${tier} gate(s) green` +
            `${observedNote} on one shared chromium + one served dist snapshot (net-deletion holds).`,
    );
    process.exit(0);
}
// The BACKLOG rows are BLOCKING — the job stays RED until S.G2/G3 close. Exit 1
// on ANY red; the classification above tells S.A2 whether the failing set is
// ⊆ backlog (the wave's success shape) or carries an unexpected regression.
console.error(
    `\nrun-demo-roster — RED (${failed.length}/${results.length}): ` +
        (unexpectedRed.length
            ? `${unexpectedRed.length} UNEXPECTED red(s) outside the backlog — investigate (S.A2 regression).`
            : `failing set ⊆ the S.A0 backlog (${backlogRed.length} row(s)) — demo-correctness stays honestly ` +
              `RED until S.G2/G3 discharge them (expected; SPEC §3 S.A2/S.A3 timing note).`),
);
process.exit(1);
