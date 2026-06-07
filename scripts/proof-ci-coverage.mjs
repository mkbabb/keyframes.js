// proof:ci-coverage — F.W2 (wire proof:all into CI) + G.W6 (workflow hygiene).
//
// The gate's conceptual scope WIDENED at G.W6 from "ci-coverage" to "workflow
// hygiene": it now reads ALL THREE workflows (ci.yml + release.yml +
// deploy-pages.yml) and folds four findings into ONE self-policing instrument.
//
// CLAUSE 0 (F.W2) — coverage: every `proof:*` gate declared in package.json MUST
//   be invoked by the CI workflow. Three inv-tagged gates (proof:dogfood/inv ζ,
//   proof:demo-elevate/inv ο, proof:modern-web) + proof:platform-adopt previously
//   had ZERO matches in ci.yml — authored but never run, the exact gate-coverage
//   hole the retro named. Drop any proof:* from ci.yml → it reds.
// CLAUSE 1 (G.W6 S1) — version-literal consistency: no bare `^0.NN.0` version
//   literal in ci.yml may disagree with package.json's declared @mkbabb/* range.
//   The floor is single-sourced in package.json, not hardcoded in workflow prose.
// CLAUSE 2 (G.W6 S2) — clone-DRY: the `git clone … glass-ui` literal must appear
//   in ZERO workflow .yml files (it lives ONLY in the setup-glass-ui composite
//   action), AND both demo-build jobs must `uses: ./.github/actions/setup-glass-ui`.
// CLAUSE 3 (G.W6 S4) — concurrency-present: every workflow .yml must declare a
//   top-level `concurrency:` block (ci + release + deploy-pages).
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
const wf = (name) =>
    readFileSync(join(root, ".github", "workflows", name), "utf8");

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const WORKFLOWS = ["ci.yml", "release.yml", "deploy-pages.yml"];
const ci = wf("ci.yml");

const failures = [];
const passes = [];

// ── clause 0 (F.W2): every proof:* gate is invoked in CI ──────────────────────
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
    failures.push(
        "coverage — these proof:* gates are declared in package.json but NEVER " +
            "invoked in ci.yml: " +
            missing.join(", ") +
            ". An authored-but-unrun gate is a coverage lie — wire it into the " +
            "`gates` job (library-scoped) or the `demo-smoke` job (needs the demo " +
            "build), per F.W2.",
    );
} else {
    passes.push(
        `coverage — all ${gates.length} proof:* gates are invoked in CI ` +
            `(${EXCLUDED.size} recorded exclusions); the inv-tagged gates run.`,
    );
}

// ── clause 1 (G.W6 S1): version-literal consistency ───────────────────────────
// No bare `^0.NN.0` version literal in ci.yml may disagree with package.json's
// declared @mkbabb/* range. The dep-order floor is single-sourced in
// package.json; a workflow literal that lies about the contract reds the gate.
const declaredRanges = {
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {}),
    ...(pkg.optionalDependencies ?? {}),
    ...(pkg.peerDependencies ?? {}),
};
const mkbabbRanges = Object.entries(declaredRanges)
    .filter(([name]) => name.startsWith("@mkbabb/"))
    .map(([, range]) => range);
// Any bare semver-range literal in ci.yml (e.g. `^0.10.0`, `^0.11.1`). The
// dep-order comment is the only legitimate home for such a literal, and it must
// agree with a declared @mkbabb/* range — otherwise it is stale-comment drift.
const ciLiterals = [...ci.matchAll(/\^\d+\.\d+\.\d+/g)].map((m) => m[0]);
const driftedLiterals = ciLiterals.filter((lit) => !mkbabbRanges.includes(lit));
if (driftedLiterals.length > 0) {
    failures.push(
        "version-literal (G.W6 S1) — ci.yml hardcodes version literal(s) " +
            driftedLiterals.join(", ") +
            " that disagree with package.json's declared @mkbabb/* range(s) [" +
            mkbabbRanges.join(", ") +
            "]. Single-source the floor in package.json; do not hardcode it in " +
            "workflow prose (the comment points at `package.json`).",
    );
} else {
    passes.push(
        "version-literal (G.W6 S1) — no ci.yml version literal disagrees with " +
            "package.json's declared @mkbabb/* range (the dep-order floor is " +
            "single-sourced).",
    );
}

// ── clause 2 (G.W6 S2): clone-DRY ─────────────────────────────────────────────
// The glass-ui clone literal must live ONLY in the setup-glass-ui composite
// action — ZERO workflow .yml may inline it, and both demo-build jobs must
// `uses:` the action.
const CLONE_LITERAL = "git clone --depth 1 --branch";
const COMPOSITE_USE = "uses: ./.github/actions/setup-glass-ui";
const inlinedIn = WORKFLOWS.filter((name) => wf(name).includes(CLONE_LITERAL));
const usesIn = WORKFLOWS.filter((name) => wf(name).includes(COMPOSITE_USE));
if (inlinedIn.length > 0) {
    failures.push(
        "clone-DRY (G.W6 S2) — the glass-ui clone literal is inlined in " +
            inlinedIn.join(", ") +
            ". The recipe + pin must live ONLY in " +
            ".github/actions/setup-glass-ui/action.yml; both demo-build jobs " +
            "`uses: ./.github/actions/setup-glass-ui`.",
    );
} else if (!usesIn.includes("ci.yml") || !usesIn.includes("deploy-pages.yml")) {
    failures.push(
        "clone-DRY (G.W6 S2) — both demo-build jobs must reference " +
            `\`${COMPOSITE_USE}\`; found in [${usesIn.join(", ") || "none"}]. ` +
            "ci.yml (demo-smoke) and deploy-pages.yml (deploy) both need it.",
    );
} else {
    passes.push(
        "clone-DRY (G.W6 S2) — the glass-ui clone literal appears in ZERO " +
            "workflows; ci.yml + deploy-pages.yml both `uses:` the setup-glass-ui " +
            "composite action (recipe + pin single-sourced).",
    );
}

// ── clause 3 (G.W6 S4): concurrency-present ────────────────────────────────────
// Every workflow must declare a top-level `concurrency:` block (the
// constellation-standard guard against overlapping runs).
const noConcurrency = WORKFLOWS.filter(
    (name) => !/^concurrency:/m.test(wf(name)),
);
if (noConcurrency.length > 0) {
    failures.push(
        "concurrency (G.W6 S4) — these workflows declare NO top-level " +
            "`concurrency:` block: " +
            noConcurrency.join(", ") +
            ". The constellation guard cancels superseded runs (ci) / blocks a " +
            "second publish (release, cancel-in-progress: false).",
    );
} else {
    passes.push(
        "concurrency (G.W6 S4) — all " +
            WORKFLOWS.length +
            " workflows declare a top-level `concurrency:` block.",
    );
}

// ── report ────────────────────────────────────────────────────────────────────
console.log("proof:ci-coverage — F.W2 coverage + G.W6 workflow hygiene\n");
for (const p of passes) console.log("  ✓ " + p);

if (failures.length > 0) {
    console.error(`\nproof:ci-coverage — FAIL (${failures.length}):`);
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}

console.log("\nproof:ci-coverage — PASS: coverage + workflow hygiene green.");
