// proof:ci-coverage — F.W2 (wire proof:all into CI). The falsifiable coverage
// gate: every `proof:*` gate declared in package.json MUST be invoked by the CI
// workflow. Three inv-tagged gates (proof:dogfood/inv ζ, proof:demo-elevate/inv ο,
// proof:modern-web) + proof:platform-adopt previously had ZERO matches in
// ci.yml — they were authored but never run, the exact gate-coverage hole the
// retro named. This gate bites that: drop any proof:* from ci.yml → it reds.
//
// RUN: node scripts/proof-ci-coverage.mjs
//
// RECORDED exclusions (NOT a silent exemption — a future lane reads the reason):
//  - proof:all          — the local convenience chain; CI runs the gates
//                         DISTRIBUTED across the library `gates` job and the
//                         `demo-smoke` job (each gate in the job that has its
//                         context), not via one proof:all call.
//  - proof:ci-coverage  — this gate itself.
//  - proof:lighthouse-mobile — RECORDED browser-gated/runner-calibrated (F.W1
//                         §Folds, E/FINAL.md): it has a legitimate CI-calibration
//                         excuse the grep gates do not, and runs local/dedicated.
//  - proof:repin-safe   — G.W1's PRE-STAGE re-pin safety lock. It reads the
//                         PUBLISHED next-version typings (`npm pack
//                         value.js@0.11.0`) against the LIVE import list BEFORE
//                         the bump moves the lockfile — a pre-bump certification,
//                         not a standing CI invariant (it is NOT chained into
//                         proof:all either, per G.W1 §Design-decision 1). Once
//                         G.W2 lands the bump, the standing CI invariant is
//                         proof:deps-current (the floor + protocol + realm gate),
//                         which IS wired. proof:repin-safe runs local/on-demand
//                         ahead of the NEXT re-pin.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const ci = readFileSync(join(root, ".github", "workflows", "ci.yml"), "utf8");

const EXCLUDED = new Set([
    "proof:all",
    "proof:ci-coverage",
    "proof:lighthouse-mobile",
    "proof:repin-safe",
]);

const gates = Object.keys(pkg.scripts)
    .filter((s) => s.startsWith("proof:") && !EXCLUDED.has(s))
    .sort();

const missing = gates.filter((g) => !ci.includes(`npm run ${g}`));

if (missing.length > 0) {
    console.error(
        "\nproof:ci-coverage — FAIL: these proof:* gates are declared in " +
            "package.json but NEVER invoked in .github/workflows/ci.yml:",
    );
    for (const g of missing) console.error("  ✗ " + g);
    console.error(
        "\n  An authored-but-unrun gate is a coverage lie — wire it into the " +
            "library `gates` job (library-scoped) or the `demo-smoke` job " +
            "(needs the demo build), per F.W2.",
    );
    process.exit(1);
}

console.log(
    `proof:ci-coverage — PASS: all ${gates.length} proof:* gates are invoked in CI ` +
        `(${EXCLUDED.size} recorded exclusions). The inv-tagged gates run.`,
);
