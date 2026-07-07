#!/usr/bin/env node
/**
 * proof:browser — the local dev convenience target (H.W8 WV-W8-HIGH-3).
 *
 * The browser-gated proof:* checks (the appearance + interaction axes) run in CI
 * under the `demo-smoke` job with `KF_REQUIRE_BROWSER=1` against the built
 * `dist/gh-pages/`. Wiring them ONLY into that env-dark CI job reproduces the
 * dark-by-default disease the H.W8 gate-regime upgrade exists to cure — a
 * developer never sees them locally. This target is the LIT-IN-THE-DEV-LOOP
 * answer: it auto-builds `dist/gh-pages/` if absent, then runs the browser gates
 * locally with `KF_REQUIRE_BROWSER=1`, so the appearance/interaction axes are one
 * command away on a workstation.
 *
 * It is a META target (it invokes gates already individually wired into CI), so
 * it is a RECORDED exclusion in proof:ci-coverage — not a distinct CI gate.
 * Re-runnable: `npm run proof:browser`.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages/index.html");

// The browser-gated gates the appearance + interaction axes live in (each is also
// individually CI-wired in the demo-smoke job; this target just LIGHTS them locally).
// Intersected with package.json's actual scripts below, so a renamed/absent gate
// is skipped (not a spurious "Missing script" failure).
const CANDIDATE_GATES = [
    "proof:demo-usability",
    "proof:scene-machine-irrefragable",
    "proof:scene-control-dfa",
    "proof:stage-glass-card",
    "proof:scene-card-rounded",
    "proof:scene-uses-standard-ribbon",
    "proof:easing-stage-is-ball",
    "proof:easing-sidebar-normalized",
    "proof:easing-sidebar-minimal",
    "proof:stage-within-docks",
    "proof:glass-and-cartoon",
    "proof:cartoon-is-panel-depth",
    "proof:single-column-pack",
    "proof:label-subgrid",
    "proof:bezier-no-scroll",
    "proof:bezier-single-card",
    "proof:bezier-grown",
    "proof:cartoon-shadow-unclipped",
    "proof:idle-fade",
    "proof:darkmode-row-toggle",
    "proof:dock-popover-opens",
    "proof:single-toggle",
    "proof:scene-parity",
    "proof:scene-perf-budget",
    "proof:sequence-rows-draggable",
    "proof:mobile-single-page",
    "proof:drawer-spring",
    "proof:dock-zorder",
];

// Run only the candidates that actually resolve a package.json script (skip the rest).
const pkgScripts = JSON.parse(fs.readFileSync(path.join(REPO, "package.json"), "utf8")).scripts;
const BROWSER_GATES = CANDIDATE_GATES.filter((g) => g in pkgScripts);

console.log("proof:browser — the local appearance+interaction axis (H.W8 WV-W8-HIGH-3)");

if (!fs.existsSync(DIST)) {
    console.log("  · dist/gh-pages absent — building (npm run gh-pages)…");
    execSync("npm run gh-pages", { cwd: REPO, stdio: "inherit" });
}

const failures = [];
for (const gate of BROWSER_GATES) {
    process.stdout.write(`  ▸ ${gate} … `);
    try {
        execSync(`npm run ${gate}`, {
            cwd: REPO,
            stdio: ["ignore", "ignore", "pipe"],
            env: { ...process.env, KF_REQUIRE_BROWSER: "1" },
        });
        console.log("✓");
    } catch (e) {
        console.log("✗");
        failures.push(gate);
    }
}

if (failures.length > 0) {
    console.error(
        `\nproof:browser — FAIL (${failures.length}): ${failures.join(", ")}. ` +
            `Run each individually for detail (e.g. KF_REQUIRE_BROWSER=1 npm run ${failures[0]}).`,
    );
    process.exit(1);
}
console.log(
    `\nproof:browser — PASS: all ${BROWSER_GATES.length} browser gates green ` +
        `locally (the appearance + interaction axes are LIT in the dev loop).`,
);
