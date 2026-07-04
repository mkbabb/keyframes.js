// proof:ci-coverage — F.W2 (wire proof:all into CI) + G.W6 (workflow hygiene).
//
// The gate's conceptual scope WIDENED at G.W6 from "ci-coverage" to "workflow
// hygiene": it now reads ALL THREE workflows (ci.yml + release.yml +
// deploy-pages.yml) and folds four findings into ONE self-policing instrument.
//
// CLAUSE 0 (F.W2) — coverage, FORWARD: every `proof:*` gate declared in
//   package.json MUST be invoked by the CI workflow. Three inv-tagged gates
//   (proof:dogfood/inv ζ, proof:demo-elevate/inv ο, proof:modern-web) +
//   proof:platform-adopt previously had ZERO matches in ci.yml — authored but
//   never run, the exact gate-coverage hole the retro named. Drop any proof:*
//   from ci.yml → it reds.
// CLAUSE 0b (J.W3 S3b · THREE-TIER at S.A4) — coverage, CONVERSE: every `npm run
//   proof:*` step that gates ci.yml MUST be reachable from `proof:all` (= the
//   proof:library-correctness ∪ proof:demo-correctness ∪ proof:hygiene chains),
//   modulo the named EXCLUDED set. Before J.W3 three
//   CI-hard gates (dock-zorder, scene-control-dfa, scene-transition-perf) ran
//   in CI but lived in NO aggregator — a dev's `proof:all` was a strictly
//   WEAKER verdict than CI (GC-2/BP-4). With both directions asserted,
//   `proof:all == the CI roster` is a machine fact.
// CLAUSE 0c (J.W3 S3d / CICD-4) — no raw-node gate steps: ci.yml may invoke a
//   gate ONLY as `npm run proof:*`. The former raw `node scripts/X.mjs` steps
//   (demo-smoke / occlusion-gate / lighthouse-gate — the inv-γ/inv-δ HEADLINE
//   demo invariants) were invisible to BOTH coverage directions; they are now
//   wrapped as proof:demo-smoke / proof:occlusion / proof:lighthouse-a11y (one
//   invocation shape), and any NEW raw-node gate step reds here.
// CLAUSE 1 (G.W6 S1, WIDENED J.W3 S3d / CICD-5) — version-literal consistency:
//   no `^X.Y.Z` OR `~X.Y.Z` version literal in ANY of the three workflows may
//   disagree with package.json's declared @mkbabb/* ranges. The pre-J.W3 form
//   scanned ci.yml only and was caret-only, so deploy-pages.yml `^3.4.0` was
//   never scanned and ci.yml's tilde-form `~3.5.1` evaded — the clause passed
//   VACUOUSLY. The floor is single-sourced in package.json, never in workflow
//   prose.
// CLAUSE 2 (G.W6 S2) — clone-DRY: the `git clone … glass-ui` literal must appear
//   in ZERO workflow .yml files (it lives ONLY in the setup-glass-ui composite
//   action), AND both demo-build jobs must `uses: ./.github/actions/setup-glass-ui`.
// CLAUSE 3 (G.W6 S4) — concurrency-present: every workflow .yml must declare a
//   top-level `concurrency:` block (ci + release + deploy-pages).
// CLAUSE 4 (J.W3 S2c) — the declared-posture hygiene clause ("P6 made
//   mechanical"): (a) the IN_CI single authority — NO script under scripts/
//   reads `process.env.CI`/`GITHUB_ACTIONS` directly except the one authority
//   (scripts/lib/ci-env.mjs); a reader imports the lib IN_CI/declarePosture,
//   never re-implements the literal. (b) the observe-only manifest, TWO-WAY —
//   every gate that declares `declarePosture("observe-only", …)` is a row in
//   the taxonomy doc's posture table (docs/tranches/J/gate-taxonomy.md) with a
//   non-empty reason, AND every observe-only table row is backed by a live
//   declaration (no stale manifest rows). A NEW device-dependent gate cannot
//   ship a re-implemented IN_CI or an unlisted observe-only posture unnoticed.
// CLAUSE 4 EXTENSION (L.W4 S4 / inv-L-device-honesty) — the CATEGORY +
//   ARCHITECTURAL-cure columns: every observe-only row in the taxonomy posture
//   table (whole-gate postures AND clause-level documented-LIMITATION rows like
//   `proof:live-session-mobile` (M2), L.W4 S6) MUST carry a non-empty Category
//   {wall-clock | pixel-render | physics-settle | forced-layout | touch-emulation}
//   AND a non-empty Architectural cure. A device-honesty declaration that drifts
//   back to an informal note inside the reason string reds.
// CLAUSE 5 (L.W4 S7) — the PUBLISH-PATH roster: release.yml MUST invoke
//   proof:published-surface AND proof:deps-current BEFORE its `npm publish` step
//   (the tarball==exports==docs oracle + the @mkbabb/* floor·protocol·realm-
//   convergent lock). A publish shipping a stale floor or a mismatched API surface
//   without either gate firing is the G-CONST-1 recurrence proof:deps-current was
//   built to forbid. Born-RED on the pre-L release.yml (proof:boundary → publish).
//
// RUN: node scripts/proof-ci-coverage.mjs
//
// RECORDED exclusions (NOT a silent exemption — a future lane reads the reason):
//  - proof:all          — the local convenience chain; CI runs the gates
//                         DISTRIBUTED across the library `gates` job and the
//                         `demo-smoke` job (each gate in the job that has its
//                         context), not via one proof:all call.
//  - proof:ci-coverage  — this gate itself. (It IS in proof:hygiene, so the
//                         converse clause sees it as reachable.)
//  (proof:lighthouse-mobile — LEFT this set at J.W4 S6 (the J.md J.W4 row
//   discharged): it now declares `observe-only` through the ONE ci-env helper
//   (hard on-device via KF_REQUIRE_LH=1), carries its taxonomy-manifest row
//   (gate-taxonomy.md), runs in proof:hygiene, and is invoked in the ci.yml
//   demo job — visible to BOTH coverage directions. The last true orphan is
//   tiered.)
//  (proof:repin-safe — KILLED at J.W3 S6a, GC-5: a one-shot G.W1 pre-stage gate
//   whose `^0.10.0→^0.11.0` re-pin is HISTORY; stale-by-construction. Script +
//   package.json key + this exclusion entry deleted in ONE motion.)

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
// S.A2 — the demo-gate partition is single-sourced in scripts/demo-roster.mjs
// (the roster driver reads the SAME module), so ci-coverage counts the roster's
// gates as CI-invoked even though they are run INSIDE the report-all roster step
// rather than as individual `npm run proof:*` ci.yml lines.
import {
    ALL_DEMO_GATES,
    CORRECTNESS_ROSTER,
    BORNRED_TRIPWIRES,
} from "./demo-roster.mjs";
// S.A4 S3/S4/S7 — the gate-band manifests (the FROZEN appearance set + its
// machine-distinguishable discharge ledger + the regression-guard band). Clauses
// 9 + 10 below read these; they are single-sourced here so a FROZEN key cannot be
// deleted without a discharge row, and a regression-guard cannot drift out of the
// hygiene tier, unnoticed.
import { FROZEN_SET, DISCHARGE, REGRESSION_GUARDS } from "./gate-bands.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const wf = (name) =>
    readFileSync(join(root, ".github", "workflows", name), "utf8");

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const WORKFLOWS = ["ci.yml", "release.yml", "deploy-pages.yml"];
const ci = wf("ci.yml");

const failures = [];
const passes = [];

// ── clause -1 (I.WZ): every workflow file is VALID YAML ───────────────────────
// GitHub Actions REJECTS a malformed workflow at PARSE time — a 0s "workflow file
// issue" failure BEFORE any job runs, so deploy-pages.yml (gated on the `ci`
// workflow's SUCCESS via `workflow_run`) never fires and the live site freezes.
// Every OTHER clause here REGEX-parses the YAML, so none can see a parse error —
// the exact gate-blindspot Tranche I closes (a gate that "verifies CI" but never
// checks CI would PARSE). Born-RED on the H.W12 unquoted step names whose
// colon-space (`→ its at: changes`) GHA read as a nested mapping ("mapping values
// are not allowed here") — which silently 0s-failed every master CI run, and every
// deploy, from H's merge until this fix. The `yaml` package is a DECLARED devDep
// as of J.W3 (the W0-booked ELSPROBLEMS fragility, dispositioned: the real parser
// previously resolved only TRANSITIVELY, so a dep-tree shuffle could silently
// degrade this clause to the regex fallback). The regex fallback is KEPT as
// defense-in-depth for a no-install context only.
let yamlParse = null;
try {
    ({ parse: yamlParse } = await import("yaml"));
} catch {
    /* fall back to the regex detector below */
}
for (const name of WORKFLOWS) {
    const src = wf(name);
    let yamlErr = null;
    if (yamlParse) {
        try {
            yamlParse(src);
        } catch (e) {
            yamlErr = (e?.message ?? String(e)).split("\n")[0];
        }
    } else {
        const i = src.split("\n").findIndex((l) => /^\s*- name: [^"'].*: /.test(l));
        if (i >= 0) yamlErr = `unquoted step name with a colon-space at line ${i + 1} (GHA reads it as a nested mapping)`;
    }
    if (yamlErr) {
        failures.push(
            `yaml-valid — ${name} is NOT valid YAML (${yamlErr}). GitHub Actions rejects the ` +
                `WHOLE workflow at parse time (a 0s failure), so no job runs and deploy-pages never ` +
                `fires. Quote any step name/value that carries a colon-space.`,
        );
    } else {
        passes.push(`yaml-valid — ${name} parses as valid YAML (GHA will not 0s-reject it at parse time).`);
    }
}

// ── clause 0 (F.W2): every proof:* gate is invoked in CI ──────────────────────
const EXCLUDED = new Set([
    "proof:all",
    "proof:ci-coverage",
    // proof:browser is a LOCAL dev meta-target (H.W8 WV-W8-HIGH-3) — it invokes the
    // browser gates that are ALREADY individually CI-wired in the demo-smoke job, so
    // it is not a distinct CI gate (running it in CI would duplicate them).
    "proof:browser",
    // I.W7 S5, RE-TAXONOMISED at S.A4 — the THREE-tier SUB-AGGREGATORS. S.A4 replaced
    // the harness-defined two-tier model (`proof:correctness` = "opens-a-browser")
    // with a SEVERITY-axis taxonomy (a27 F1): proof:library-correctness (node/jsdom
    // value-proofs, split off from hygiene-chain) + proof:demo-correctness (browser
    // actuators — the RENAMED proof:correctness; proof:gate-is-runtime polices THIS
    // tier) + proof:hygiene (structure/boundary/absence). proof:all = the three
    // chains via run-all --all. Each is a chain of already-individually-CI-wired
    // gates, not a distinct CI gate (running one in CI would duplicate every member),
    // exactly like proof:all. The clause-0b converse now unions all THREE tiers — omit
    // proof:library-correctness there and every LC gate reds `ciOnly` (the linchpin).
    "proof:library-correctness",
    "proof:demo-correctness",
    "proof:hygiene",
    // L.W4 S3 — proof:all:demo is the DEMO-roster meta-aggregator the Makefile
    // `ci-linux` target runs inside the node:24-slim container (proof:demo-smoke +
    // proof:occlusion + proof:peer-satisfied). Like proof:all/correctness/hygiene it
    // is a chain of already-individually-CI-wired gates, not a distinct CI gate —
    // running it in CI would duplicate its members. It is NOT a coverage hole: its
    // every member is independently invoked in the demo-smoke job.
    "proof:all:demo",
    // L.W4 S8 — proof:peer-satisfied is the BORN-RED-BY-DESIGN F-2 peer-cycle
    // tripwire. It IS CI-invoked (the demo-smoke report-all job, continue-on-error,
    // + release.yml's recorded publish-path step) but it is DELIBERATELY ABSENT from
    // the blocking proof:correctness/proof:hygiene && chains: it STAYS RED until
    // glass-ui BB widens its peer range to admit value.js 0.13.0 + kf re-pins (L.W9),
    // and placing it in a blocking && chain would abort the chain on the expected
    // RED. The exclusion keeps the converse-coverage clause (0b) from demanding a
    // tier membership that would re-introduce the abort — the gate rides CI as a
    // report-all tripwire, by L.W4 S8's born-RED contract, not as an aggregator member.
    "proof:peer-satisfied",
    // (S.B8 DISCHARGE — proof:claude-paths-live's exclusion was DELETED here.
    //  Its src/animation/CLAUDE.md flat-tree backlog (the 22 dead tree-fence
    //  paths, fold row 41, C-8 "gate-first, regen-last") is GONE: S.B8
    //  regenerated the map against the final post-B tree, so the gate is FULLY
    //  green and is now an ORDINARY BLOCKING proof:hygiene-chain member — the
    //  move the S.A5 exclusion text itself named. It rides the demo-correctness
    //  ROSTER (like proof:modern-web/proof:platform-adopt) because clause (c)
    //  reads the built dist/keyframes.d.ts (present via `npm ci`'s `prepare` =
    //  build:lib) and clause (b) reads dist/gh-pages, both of which the demo job
    //  builds; it is NAMED in STATIC_DEMO_CARVEOUT below as a build-dependent
    //  static gate. The forward-coverage clause now DEMANDS its CI invocation.)
    // S.A1 — proof:chronic-closure is BORN-RED-BY-DESIGN through the S impl
    // drive: it now parses the S ledger (the R→S substrate re-point), whose
    // FOLD rows are the FORWARD disposition board — they cite born-RED gates
    // their owning waves author later, so the runtime-gate-that-BIT contract
    // structurally cannot be green until the waves land. Same pattern as
    // claude-paths-live directly above: it stays a proof:hygiene-chain member
    // (local truth + the S.Z3 from-clean closeable-roster run) but is NOT a
    // blocking ci.yml step until S.Z2's RE-EXECUTION clause re-runs it green
    // on the merged tree and re-wires the step + deletes this exclusion in
    // that same commit. Its parse-shape + substance clauses were non-vacuity
    // proven at S.A1 (planted malformed/violating rows RED; plants removed).
    "proof:chronic-closure",
    // (R.W0 — the sibling-adapter publish tripwire was RETIRED with its package: the
    //  overfit Vue adapter was removed entirely + npm-revoked. Its gate script,
    //  package.json key, ci.yml step, release.yml publish job, AND this exclusion entry
    //  were deleted in ONE motion — no orphan survives.)
    // (The DL-K7 control-point tripwire was RETIRED at Q.WA2 / S2. It asserted a
    //  glass-ui component BC decided NEVER to ship, and its false "needs drag2D"
    //  premise mis-blocked the DemoControlPoint chain on a drag2D LIGHT export that
    //  already exists (index.ts:88). The gate script, its package.json entry, its
    //  ci.yml step/id/aggregator/echo, AND this exclusion entry were deleted in ONE
    //  motion — no orphan survives. The DemoControlPoint live-behavior assertion moves
    //  to Q.WC1's NEW proof:demo-control-point; proof:drag2d-light-certified LOCKS the
    //  retire. The retired gate's key is intentionally NOT named here — its literal
    //  token must grep to ZERO in this file.)
    // Q.WA3 S4 — proof:hygiene-chain is the MEMBERSHIP carrier for the report-all
    // proof:hygiene delegator (`node scripts/run-all.mjs --tier=proof:hygiene-chain`).
    // It is the parseable `&&` chain the SCHEDULE (run-all) + the roster-deriving
    // meta-gates (this gate's converse clause + proof:gate-is-runtime) read; it is NOT
    // a distinct CI gate (every member is independently CI-invoked, exactly like
    // proof:hygiene/proof:correctness/proof:all). Excluded from the forward-coverage
    // demand for the same reason those sub-aggregators are.
    "proof:hygiene-chain",
    // S.B6 — the three type-surface / ./engine-drift gates are DEVELOPMENT-ONLY
    // through S (the wave's own Verification: "Development-only; born-RED; re-run
    // at S.Z2"). They are AUTHORED + red→green-witnessed at S.B6 and are GREEN at
    // authorship (unlike proof:peer-satisfied / proof:claude-paths-live /
    // proof:chronic-closure, which stay RED), but they follow the SAME
    // development-only-until-close wiring convention: they do NOT yet ride ci.yml,
    // so a mid-drive tree churn in a parallel worktree cannot flap them in a
    // blocking chain before the tree is final. S.Z2 wires all three into
    // proof:hygiene-chain as ordinary blocking members (they measure the BUILT
    // dist, same precondition as proof:published-surface / proof:alias-dropped)
    // and DELETES these three exclusions in that same commit. Each is
    // individually runnable NOW (`npm run proof:engine-subpath-mirror` etc.).
    "proof:engine-subpath-mirror",
    "proof:no-any-default",
    "proof:dts-rollups-agree",
]);

const gates = Object.keys(pkg.scripts)
    .filter((s) => s.startsWith("proof:") && !EXCLUDED.has(s))
    .sort();

// S.A2 — a gate is CI-invoked if it appears as an `npm run proof:*` line in
// ci.yml OR it is a member of the demo roster (scripts/demo-roster.mjs), which
// the demo-correctness job runs as ONE report-all step (the net-deletion). The
// roster is thus a first-class CI-invocation surface, not a coverage hole.
const rosterCovered = new Set(ALL_DEMO_GATES);
const missing = gates.filter(
    (g) => !ci.includes(`npm run ${g}`) && !rosterCovered.has(g),
);

if (missing.length > 0) {
    failures.push(
        "coverage — these proof:* gates are declared in package.json but NEVER " +
            "invoked in ci.yml (nor in the demo roster): " +
            missing.join(", ") +
            ". An authored-but-unrun gate is a coverage lie — wire it into the " +
            "`gates` job (library-scoped), the `demo-device-observe` job, or the " +
            "demo-correctness roster (scripts/demo-roster.mjs), per F.W2.",
    );
} else {
    passes.push(
        `coverage — all ${gates.length} proof:* gates are invoked in CI ` +
            `(${EXCLUDED.size} recorded exclusions; ${rosterCovered.size} via the ` +
            `demo-correctness roster + demo-device-observe); the inv-tagged gates run.`,
    );
}

// ── clause 0b (J.W3 S3b · THREE-TIER at S.A4): the CONVERSE — every CI-gated
// proof:* step is reachable from proof:all (proof:library-correctness ∪
// proof:demo-correctness ∪ proof:hygiene), modulo the named EXCLUDED set. Before
// this clause, the local/CI asymmetry (3 CI-only orphans, GC-2/BP-4/WZ §E) was
// structurally invisible: this gate enforced only `proof:* ⟹ CI-invoked`, never
// `CI-hard-gated ⟹ in-an-aggregator`. S.A4 split library-correctness OUT of
// hygiene-chain — the union MUST now name all THREE tiers or every one of the 39
// LC gates (still CI-invoked in the `gates` job) reds `ciOnly`. This union is the
// airtightness linchpin the S.A4 lockstep names. ────────────────────────────────
{
    // Resolve a tier's MEMBERSHIP. A tier value is normally the parseable `&&` chain
    // (the M.W1 single source). Q.WA3 S4 makes `proof:hygiene` a REPORT-ALL DELEGATOR
    // (`node scripts/run-all.mjs --tier=proof:hygiene-chain`) so a local
    // `npm run proof:hygiene` collects ALL reds in one pass instead of fail-fast — but
    // the MEMBERSHIP must stay parseable for this gate + proof:gate-is-runtime. So when
    // a tier delegates to run-all, we resolve the membership from the companion
    // `--tier=<key>` chain (the chain key holds the verbatim `&&` membership — the
    // SCHEDULE moves to run-all, the MEMBERSHIP stays in package.json, exactly the M.W1
    // contract). A non-delegating tier resolves to itself.
    const resolveTier = (key) => {
        const val = String(pkg.scripts[key] ?? "");
        const m = val.match(/run-all\.mjs\s+--tier=(proof:[a-z0-9-]+)/);
        return m ? String(pkg.scripts[m[1]] ?? "") : val;
    };
    const chainMembers = (chain) =>
        new Set([...String(chain).matchAll(/proof:[a-z0-9-]+/g)].map((m) => m[0]));
    // S.A4 — the THREE-tier union (was correctness ∪ hygiene). Omitting
    // libraryCorrectness here reds ALL 39 LC gates as `ciOnly`: the linchpin.
    const libraryCorrectness = chainMembers(resolveTier("proof:library-correctness"));
    const demoCorrectness = chainMembers(resolveTier("proof:demo-correctness"));
    const hygiene = chainMembers(resolveTier("proof:hygiene"));
    const ciInvoked = [
        ...new Set([...ci.matchAll(/npm run (proof:[a-z0-9-]+)/g)].map((m) => m[1])),
    ].sort();

    const undefinedKeys = ciInvoked.filter((g) => !(g in pkg.scripts));
    const ciOnly = ciInvoked.filter(
        (g) =>
            (g in pkg.scripts) &&
            !libraryCorrectness.has(g) &&
            !demoCorrectness.has(g) &&
            !hygiene.has(g) &&
            !EXCLUDED.has(g),
    );

    if (undefinedKeys.length > 0) {
        failures.push(
            "converse-coverage (J.W3 S3b) — ci.yml invokes proof:* key(s) that do NOT " +
                "resolve to a package.json script: " +
                undefinedKeys.join(", ") +
                ". A CI step citing a dead gate is a stale-doc lie in the pipeline.",
        );
    }
    if (ciOnly.length > 0) {
        failures.push(
            "converse-coverage (J.W3 S3b) — these gates are CI-invoked but reachable from " +
                "NONE of proof:library-correctness / proof:demo-correctness / proof:hygiene " +
                "(so `npm run proof:all` is a WEAKER verdict than CI): " +
                ciOnly.join(", ") +
                ". Fold each into a tier (library-correctness for a node/jsdom value-proof, " +
                "demo-correctness for a browser actuator, else hygiene) — proof:all == the CI " +
                "roster must hold BOTH ways.",
        );
    }
    if (undefinedKeys.length === 0 && ciOnly.length === 0) {
        passes.push(
            `converse-coverage (J.W3 S3b) — all ${ciInvoked.length} CI-invoked proof:* gates ` +
                `are reachable from proof:all (library-correctness ${libraryCorrectness.size} ∪ ` +
                `demo-correctness ${demoCorrectness.size} ∪ hygiene ${hygiene.size}, modulo the ` +
                `${EXCLUDED.size} recorded exclusions): proof:all == the CI roster, both directions.`,
        );
    }
}

// ── clause 0c (J.W3 S3d / CICD-4): NO raw-node gate steps in ci.yml ───────────
// A gate invoked as `run: node scripts/X.mjs` is invisible to BOTH coverage
// directions (clause 0 + 0b enumerate proof:* keys). The three former raw-node
// steps (demo-smoke / occlusion-gate / lighthouse-gate — the inv-γ/inv-δ
// HEADLINE invariants) are wrapped as proof:demo-smoke / proof:occlusion /
// proof:lighthouse-a11y; ONE invocation shape (`npm run proof:*`) is the
// contract, so a future raw-node gate cannot re-open the blind spot.
{
    const rawNodeSteps = [...ci.matchAll(/run:\s*node scripts\/[^\s]+/g)].map(
        (m) => m[0].replace(/\s+/g, " "),
    );
    if (rawNodeSteps.length > 0) {
        failures.push(
            "raw-node-step (J.W3 S3d / CICD-4) — ci.yml invokes gate script(s) as raw " +
                "`node scripts/…` instead of an `npm run proof:*` key: " +
                rawNodeSteps.join("; ") +
                ". A raw-node gate is coverage-blind in both directions — wrap it as a " +
                "proof:* package key and wire that key into a tier.",
        );
    } else {
        passes.push(
            "raw-node-step (J.W3 S3d / CICD-4) — ZERO raw `node scripts/…` gate steps in " +
                "ci.yml; every CI gate rides an `npm run proof:*` key the two coverage " +
                "clauses can see.",
        );
    }
}

// ── clause 1 (G.W6 S1, WIDENED J.W3 S3d / CICD-5): version-literal consistency ─
// No `^X.Y.Z` OR `~X.Y.Z` version literal in ANY of the three workflows may
// disagree with package.json's declared @mkbabb/* ranges. The dep-order floor is
// single-sourced in package.json; a workflow literal that lies about the
// contract reds the gate. (The pre-J.W3 clause scanned ci.yml only with a
// caret-only regex — deploy-pages.yml's `^3.4.0` was never scanned and ci.yml's
// tilde-form `~3.5.1` evaded it: a VACUOUS pass. Born-RED on exactly those two
// stale comments until S6c refreshed them.)
const declaredRanges = {
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {}),
    ...(pkg.optionalDependencies ?? {}),
    ...(pkg.peerDependencies ?? {}),
};
const mkbabbRanges = Object.entries(declaredRanges)
    .filter(([name]) => name.startsWith("@mkbabb/"))
    .map(([, range]) => range);
const driftedLiterals = [];
for (const name of WORKFLOWS) {
    const literals = [...wf(name).matchAll(/[\^~]\d+\.\d+\.\d+/g)].map((m) => m[0]);
    for (const lit of literals) {
        if (!mkbabbRanges.includes(lit)) driftedLiterals.push(`${name}: ${lit}`);
    }
}
if (driftedLiterals.length > 0) {
    failures.push(
        "version-literal (G.W6 S1 / J.W3 CICD-5) — workflow file(s) hardcode " +
            "version literal(s) " +
            driftedLiterals.join(", ") +
            " that disagree with package.json's declared @mkbabb/* range(s) [" +
            mkbabbRanges.join(", ") +
            "]. Single-source the floor in package.json; do not hardcode it in " +
            "workflow prose (the comment points at `package.json`).",
    );
} else {
    passes.push(
        "version-literal (G.W6 S1 / J.W3 CICD-5) — no `^`/`~` version literal in " +
            "any of the 3 workflows disagrees with package.json's declared " +
            "@mkbabb/* ranges (the dep-order floor is single-sourced).",
    );
}

// ── clause 2 (G.W6 S2, re-grounded): glass-ui consumed from the registry ──────
// The G re-pin moved glass-ui to the PUBLISHED registry package; the demo builds
// against it with NO sibling clone (proven: a registry-only install with no
// `../glass-ui` on disk builds the demo). So the demo jobs must NOT clone the
// sibling, NOT `uses:` the retired setup-glass-ui action, and NO workflow may
// carry a `file:`/clone glass-ui reference. The inverse of the old clone-DRY:
// the file: model is GONE, not single-sourced.
const CLONE_LITERAL = "git clone --depth 1 --branch";
const COMPOSITE_USE = "uses: ./.github/actions/setup-glass-ui";
const fileGlassUi = /file:.*glass-ui|\.\.\/glass-ui/;
const offenders = WORKFLOWS.filter(
    (name) =>
        wf(name).includes(CLONE_LITERAL) ||
        wf(name).includes(COMPOSITE_USE) ||
        fileGlassUi.test(wf(name)),
);
if (offenders.length > 0) {
    failures.push(
        "registry-glass-ui (G.W6 S2 re-grounded) — a workflow still clones the " +
            "glass-ui sibling / `uses:` the retired setup-glass-ui action / carries " +
            "a file: glass-ui reference: " +
            offenders.join(", ") +
            ". The demo consumes the PUBLISHED registry @mkbabb/glass-ui via " +
            "`npm ci`; the file:/clone model was retired with the re-pin.",
    );
} else {
    passes.push(
        "registry-glass-ui (G.W6 S2 re-grounded) — ZERO workflow clones the " +
            "glass-ui sibling or carries a file: glass-ui reference; the demo jobs " +
            "consume the published registry package via `npm ci`.",
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

// ── clause 4 (J.W3 S2c): the declared-posture hygiene clause ───────────────────
// (a) IN_CI single authority: scripts/lib/ci-env.mjs is the ONE place that may
// read process.env.CI / GITHUB_ACTIONS (CICD-3 killed the triplicated literal;
// this clause keeps it dead). (b) observe-only manifest, two-way: declarations
// in gate scripts ⇄ rows in the taxonomy doc's posture table, each with a
// reason. The convention is now a charter invariant a gate polices (P6).
{
    const { readdirSync } = await import("node:fs");
    const AUTHORITY = "scripts/lib/ci-env.mjs";
    const TAXONOMY = "docs/tranches/J/gate-taxonomy.md";
    // SELF-EXCLUSION: this enforcer's own source carries the detection strings
    // (the regex + failure-message literals naming process.env.CI and the
    // declarePosture("observe-only", …) shape) — prose/detection, not an
    // implementation. The meta-gate does not audit its own detector text,
    // exactly as proof:gate-is-runtime does not audit its own script.
    const SELF = "scripts/proof-ci-coverage.mjs";

    // (a) — no re-implemented IN_CI literal outside the authority.
    const scriptFiles = [
        ...readdirSync(join(root, "scripts"))
            .filter((f) => f.endsWith(".mjs"))
            .map((f) => `scripts/${f}`),
        ...readdirSync(join(root, "scripts", "lib"))
            .filter((f) => f.endsWith(".mjs"))
            .map((f) => `scripts/lib/${f}`),
    ];
    const reimplementers = scriptFiles.filter(
        (f) =>
            f !== AUTHORITY &&
            f !== SELF &&
            /process\.env\.(?:CI|GITHUB_ACTIONS)\b/.test(
                readFileSync(join(root, f), "utf8"),
            ),
    );
    if (reimplementers.length > 0) {
        failures.push(
            "posture-authority (J.W3 S2c) — these scripts read process.env.CI/" +
                "GITHUB_ACTIONS directly instead of importing the ONE authority " +
                `(${AUTHORITY}): ` +
                reimplementers.join(", ") +
                ". A re-implemented IN_CI literal is a drift point (CICD-3) — import " +
                "{ IN_CI, declarePosture } from the lib.",
        );
    } else {
        passes.push(
            `posture-authority (J.W3 S2c) — ${AUTHORITY} is the ONLY scripts/ file ` +
                `that reads process.env.CI/GITHUB_ACTIONS (${scriptFiles.length} ` +
                "scripts scanned); every consumer imports the lib helper.",
        );
    }

    // (b) — the observe-only manifest, both directions.
    let taxonomy = null;
    try {
        taxonomy = readFileSync(join(root, TAXONOMY), "utf8");
    } catch {
        /* absent → fails below */
    }
    const declared = [];
    for (const [key, body] of Object.entries(pkg.scripts)) {
        if (!key.startsWith("proof:")) continue;
        const m = String(body).match(/scripts\/([a-z0-9.-]+\.mjs)/i);
        if (!m || `scripts/${m[1]}` === SELF) continue;
        let src = "";
        try {
            src = readFileSync(join(root, "scripts", m[1]), "utf8");
        } catch {
            continue;
        }
        if (/declarePosture\(\s*["']observe-only["']/.test(src)) declared.push(key);
    }
    declared.sort();
    if (taxonomy == null) {
        failures.push(
            `posture-manifest (J.W3 S2c) — the taxonomy doc (${TAXONOMY}) is MISSING; ` +
                "the posture table is the named manifest every observe-only gate must " +
                "be listed in, with a reason (S2b).",
        );
    } else {
        const tableRows = [
            ...taxonomy.matchAll(
                /^\|\s*`(proof:[a-z0-9-]+)`\s*\|\s*observe-only\s*\|\s*([^|]*?)\s*\|/gim,
            ),
        ].map((m) => ({ gate: m[1], reason: m[2].trim() }));
        const rowFor = (g) => tableRows.find((r) => r.gate === g);
        const unlisted = declared.filter((g) => !rowFor(g));
        const reasonless = declared.filter((g) => rowFor(g) && !rowFor(g).reason);
        const stale = tableRows
            .filter((r) => !declared.includes(r.gate))
            .map((r) => r.gate);
        if (unlisted.length > 0) {
            failures.push(
                "posture-manifest (J.W3 S2c) — observe-only declaration(s) with NO row " +
                    `in the taxonomy posture table (${TAXONOMY}): ` +
                    unlisted.join(", ") +
                    ". An undeclared-in-the-manifest device-dependence may not ship — " +
                    "add the row with the declared reason.",
            );
        }
        if (reasonless.length > 0) {
            failures.push(
                "posture-manifest (J.W3 S2c) — observe-only table row(s) with an EMPTY " +
                    "reason: " +
                    reasonless.join(", ") +
                    ". The reason IS the manifest entry (the declared device-dependence).",
            );
        }
        if (stale.length > 0) {
            failures.push(
                "posture-manifest (J.W3 S2c) — taxonomy table row(s) with NO live " +
                    "observe-only declaration behind them (stale manifest): " +
                    stale.join(", ") +
                    ". The NO-stale-docs precept applies to the manifest itself.",
            );
        }
        if (unlisted.length === 0 && reasonless.length === 0 && stale.length === 0) {
            passes.push(
                `posture-manifest (J.W3 S2c) — all ${declared.length} observe-only ` +
                    `gate(s) [${declared.join(", ")}] are listed in the taxonomy ` +
                    "posture table with a reason, and no table row is stale " +
                    "(declarations ⇄ manifest, both directions).",
            );
        }

        // ── clause 4 EXTENSION (L.W4 S4 / inv-L-device-honesty) — the CATEGORY +
        // ARCHITECTURAL-CURE columns. Every observe-only row in the posture table
        // (whether a whole-gate posture OR a clause-level documented LIMITATION row
        // like `proof:live-session-mobile` (M2), L.W4 S6) MUST carry a non-empty
        // Category {wall-clock|pixel-render|physics-settle|forced-layout|
        // touch-emulation} AND a non-empty Architectural cure. Without these the
        // inv-L-device-honesty declaration drifts back to an informal note inside the
        // reason string. The row shape is `| Gate | observe-only | Category | Cure |
        // Reason |` — this regex reads ALL FIVE cells for any observe-only row,
        // INCLUDING the M2 limitation row the strict 4(b) NAME regex skips. ─────────
        const CATEGORIES = new Set([
            "wall-clock",
            "pixel-render",
            "physics-settle",
            "forced-layout",
            "touch-emulation",
        ]);
        const fullRows = [
            ...taxonomy.matchAll(
                /^\|\s*([^|]*?)\s*\|\s*observe-only\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|/gim,
            ),
        ].map((m) => ({
            gate: m[1].trim(),
            category: m[2].trim(),
            cure: m[3].trim(),
            reason: m[4].trim(),
        }));
        const noCategory = fullRows.filter((r) => !r.category);
        const badCategory = fullRows.filter(
            (r) => r.category && !CATEGORIES.has(r.category),
        );
        const noCure = fullRows.filter((r) => !r.cure);
        if (fullRows.length === 0) {
            failures.push(
                "device-honesty (L.W4 S4 / inv-L-device-honesty) — the taxonomy posture " +
                    "table has NO 5-column observe-only rows (Gate | observe-only | Category " +
                    "| Architectural cure | Reason). The CATEGORY + cure columns are required " +
                    "by inv-L-device-honesty — the table must carry them.",
            );
        }
        if (noCategory.length > 0) {
            failures.push(
                "device-honesty (L.W4 S4 / inv-L-device-honesty) — observe-only table " +
                    "row(s) with an EMPTY Category: " +
                    noCategory.map((r) => r.gate).join(", ") +
                    ". Every observe-only declaration must name its device-dependence class " +
                    "{wall-clock | pixel-render | physics-settle | forced-layout | touch-emulation}.",
            );
        }
        if (badCategory.length > 0) {
            failures.push(
                "device-honesty (L.W4 S4 / inv-L-device-honesty) — observe-only table " +
                    "row(s) with an UNKNOWN Category: " +
                    badCategory.map((r) => `${r.gate} ("${r.category}")`).join(", ") +
                    `. The valid category set is {${[...CATEGORIES].join(" | ")}}.`,
            );
        }
        if (noCure.length > 0) {
            failures.push(
                "device-honesty (L.W4 S4 / inv-L-device-honesty) — observe-only table " +
                    "row(s) with an EMPTY Architectural cure: " +
                    noCure.map((r) => r.gate).join(", ") +
                    ". Each observe-only row must record the durable fix that would promote " +
                    "it to `hard` — the cure IS the inv-L-device-honesty declaration.",
            );
        }
        if (
            fullRows.length > 0 &&
            noCategory.length === 0 &&
            badCategory.length === 0 &&
            noCure.length === 0
        ) {
            passes.push(
                `device-honesty (L.W4 S4 / inv-L-device-honesty) — all ${fullRows.length} ` +
                    "observe-only taxonomy row(s) carry a non-empty Category (from the valid " +
                    "set) AND a non-empty Architectural cure: " +
                    fullRows.map((r) => `${r.gate}→${r.category}`).join(", ") +
                    ". The device-honesty declaration is column-bound, not an informal note.",
            );
        }
    }
}

// ── clause 5 (L.W4 S7): the PUBLISH-PATH roster — release.yml runs the publish-
// boundary oracles BEFORE `npm publish`. The pre-L release.yml ran only check:lib →
// build:lib → test → proof:boundary; a publish that shipped a stale @mkbabb/* floor
// (proof:deps-current) or a mismatched API-Extractor surface (proof:published-surface)
// passed without either gate firing (Lane 36 ⚠gate-ORACLE completeness; the G-CONST-1
// recurrence proof:deps-current was built to forbid). This clause reads release.yml and
// asserts BOTH `npm run proof:published-surface` AND `npm run proof:deps-current` appear
// BEFORE the `npm publish` step. RED on the pre-L release.yml; GREEN on the cure. ──────
{
    const release = wf("release.yml");
    const lines = release.split("\n");
    // Anchor on the actual `run: npm publish` STEP (a `run:` key), NOT a header
    // comment that merely names `npm publish` in prose (the `#`-prefixed line at the
    // top of release.yml describes the gate order and would false-match a bare
    // /npm publish/ regex — the exact line-5 false-positive this anchor avoids).
    const publishIdx = lines.findIndex((l) =>
        /^\s*run:\s*npm publish\b/.test(l),
    );
    const idxOf = (gate) =>
        lines.findIndex((l) => /^\s*run:\s*/.test(l) && l.includes(`npm run ${gate}`));
    const REQUIRED = ["proof:published-surface", "proof:deps-current"];
    if (publishIdx === -1) {
        failures.push(
            "publish-path (L.W4 S7) — release.yml has NO `npm publish` step; the publish-" +
                "boundary roster cannot be ordered against a missing publish. Re-ground the gate.",
        );
    } else {
        const violations = [];
        for (const gate of REQUIRED) {
            const i = idxOf(gate);
            if (i === -1) {
                violations.push(`${gate} is ABSENT from release.yml`);
            } else if (i > publishIdx) {
                violations.push(
                    `${gate} runs AFTER \`npm publish\` (line ${i + 1} > ${publishIdx + 1})`,
                );
            }
        }
        if (violations.length > 0) {
            failures.push(
                "publish-path (L.W4 S7) — release.yml does NOT run the publish-boundary " +
                    "oracles before `npm publish`: " +
                    violations.join("; ") +
                    ". A publish that ships a stale @mkbabb/* floor or a mismatched API surface " +
                    "passes without either gate firing — add proof:published-surface + " +
                    "proof:deps-current between proof:boundary and `npm publish`.",
            );
        } else {
            passes.push(
                "publish-path (L.W4 S7) — release.yml runs proof:published-surface AND " +
                    "proof:deps-current BEFORE `npm publish` (the tarball==exports==docs oracle " +
                    "+ the @mkbabb/* floor·protocol·realm-convergent lock close the publish-boundary gap).",
            );
        }
    }
}

// ── ci.yml job partition (shared by clauses 6 + 7): split ci.yml into its jobs
// by their top-level `<name>:` keys at 4-space indent. The `gates` job is the
// FAST library job; S.A2 split the former SLOW `demo-smoke` browser job into
// `demo-correctness` (BLOCKING · the report-all roster) + `demo-device-observe`
// (OBSERVE-ONLY · job-level continue-on-error). `demoJob` is the union demo
// surface the placement/tripwire clauses reason over. ─────────────────────────
const jobBounds = (() => {
    const lines = ci.split("\n");
    const heads = [];
    lines.forEach((l, i) => {
        const m = l.match(/^ {4}([a-z][a-z0-9-]*):\s*$/);
        if (m) heads.push({ name: m[1], line: i });
    });
    const span = (name) => {
        const idx = heads.findIndex((h) => h.name === name);
        if (idx === -1) return "";
        const start = heads[idx].line;
        const end = idx + 1 < heads.length ? heads[idx + 1].line : lines.length;
        return lines.slice(start, end).join("\n");
    };
    const demoCorrectnessJob = span("demo-correctness");
    const demoObserveJob = span("demo-device-observe");
    return {
        gatesJob: span("gates"),
        demoCorrectnessJob,
        demoObserveJob,
        demoJob: demoCorrectnessJob + "\n" + demoObserveJob,
    };
})();

// ── clause 6 (Q.WA3 S1, RE-GROUNDED at S.A2): bornred-tripwire-not-blocking ────
// A born-RED-by-design tripwire (peer-satisfied) must NEVER gate deploy. Under
// S.A2 the blocking surface is the demo-correctness ROSTER (CORRECTNESS_ROSTER)
// run by the report-all driver — a born-RED tripwire in that set would make
// demo-correctness STRUCTURALLY never green → the deploy-of-record (gated on a
// green demo-correctness) could never fire. The tripwire instead rides
// demo-device-observe as a step-level continue-on-error step, RECORDED not
// blocking. This clause asserts BOTH: (a) no present born-RED tripwire is in the
// blocking correctness roster, and (b) each present tripwire that IS wired in the
// demo surface rides the OBSERVE job (with continue-on-error), never a blocking
// step. ────────────────────────────────────────────────────────────────────────
{
    const presentTripwires = BORNRED_TRIPWIRES.filter((g) => g in pkg.scripts);
    const inBlockingRoster = presentTripwires.filter((g) =>
        CORRECTNESS_ROSTER.includes(g),
    );
    // A tripwire wired into demo-correctness as a raw blocking step (should be none).
    const inCorrectnessJob = presentTripwires.filter((g) =>
        new RegExp(`run: npm run ${g.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\b`).test(
            jobBounds.demoCorrectnessJob,
        ),
    );
    if (inBlockingRoster.length > 0 || inCorrectnessJob.length > 0) {
        failures.push(
            "bornred-tripwire-not-blocking (Q.WA3 S1 / S.A2) — born-RED-by-design tripwire(s) " +
                "sit on the BLOCKING demo-correctness surface: " +
                [...new Set([...inBlockingRoster, ...inCorrectnessJob])].join(", ") +
                ". A born-RED tripwire in the blocking roster/job makes demo-correctness " +
                "STRUCTURALLY never green → the deploy-of-record stays dead. Move it to " +
                "demo-device-observe (step continue-on-error, RECORDED), out of CORRECTNESS_ROSTER.",
        );
    } else {
        passes.push(
            "bornred-tripwire-not-blocking (Q.WA3 S1 / S.A2) — all " +
                `${presentTripwires.length} present born-RED tripwire(s) [${presentTripwires.join(", ") || "none"}] ` +
                "are OUT of the blocking demo-correctness roster; they ride demo-device-observe " +
                "as RECORDED (continue-on-error) steps — demo-correctness can go green.",
        );
    }
}

// ── clause 7 (Q.WA3 S4): static-gate-placement ────────────────────────────────
// Every gate whose script opens NO browser (a pure source grep / graph-walk) MUST
// ride the FAST library `gates` job, not the slow 50m demo-smoke browser job — the
// F-7 device-dependence harden. A browser-less gate riding demo-smoke pays the
// browser wall-clock for nothing (and is exposed to the slow-Linux-runner render-race
// class). We classify each gate by reading its script: a gate is BROWSER-bound iff its
// script (transitively, via the demo-driver lib) opens a browser — detected by the
// KF_REQUIRE_BROWSER env on its CI step OR a browser-harness import in its script.
// RECORDED CARVE-OUT: the three pre-existing-RED source gates (proof:decomposition,
// proof:demo-no-oversize, proof:brittleness) carry COMMITTED source-shape reds that
// Q.WA3's zero-source charter cannot fix; moving them to the fail-fast gates job would
// block CI on an out-of-scope defect, so they STAY on demo-smoke's continue-on-error
// report-all surface until a source-fix wave greens them. The carve-out is NAMED here
// (a reason, not a silent exemption) and tightens by deletion as those gates green.
{
    const STATIC_DEMO_CARVEOUT = new Set([
        // Pre-existing-RED committed source gates — kept on demo-smoke's report-all
        // surface (continue-on-error) until a source-fix wave greens them. NOT a
        // device-dependence; an out-of-Q.WA3-scope source red. Delete each entry when
        // its gate greens (then it migrates to the fast gates job).
        "proof:decomposition",
        "proof:demo-no-oversize",
        "proof:brittleness",
        // Build-dependent demo gates: they read the gh-pages BUILD artifact (dist/
        // gh-pages CSS), so they MUST run after the demo build in demo-smoke — not a
        // browser, but not a pure source gate either.
        "proof:modern-web",
        "proof:platform-adopt",
        // S.B8 — the doc-authority gate is ALSO build-dependent (not a browser gate):
        // its export-list clause (c) reads the built dist/keyframes.d.ts and the demo
        // doc-drift clause (b) reads dist/gh-pages, so it rides the demo-correctness
        // roster (which has BOTH — dist/keyframes.d.ts via `npm ci`'s prepare=build:lib
        // and dist/gh-pages via `npm run gh-pages`), not the glass-ui-free fast gates
        // job. Same build-dependent carve-out rationale as the two above.
        "proof:claude-paths-live",
    ]);
    // The browser-harness import signatures (a gate that opens chromium, inline or via
    // the demo-driver lifecycle lib). A KF_REQUIRE_BROWSER env on the CI step is the
    // strongest signal; the script-side import is the belt.
    const opensBrowser = (gateKey) => {
        const body = String(pkg.scripts[gateKey] ?? "");
        // Match ANY scripts/<name>.mjs (not only proof-*.mjs — the headline demo gates
        // run scripts/demo-smoke.mjs / occlusion-gate.mjs / lighthouse-gate.mjs).
        const m = body.match(/scripts\/([a-z0-9-]+\.mjs)/i);
        if (!m) return false; // vitest-only gate (no node script) — not a static grep
        let src = "";
        try {
            src = readFileSync(join(root, "scripts", m[1]), "utf8");
        } catch {
            return false;
        }
        // A gate that imports the browser lifecycle / launches chromium / requires a
        // browser context is BROWSER-bound (it legitimately needs the demo job). The
        // KF_REQUIRE_BROWSER seam (the demo-driver hard-gate flag) is the strongest
        // script-side signal.
        return /serveDist|withBrowser|withPage|newContext|chromium|playwright|KF_REQUIRE_BROWSER/i.test(
            src,
        );
    };
    // The set of gates that ride the demo tier: textually in either demo job OR a
    // member of the demo roster (S.A2 — the correctness roster is run as ONE step,
    // so its members are not textual `npm run` lines but still ride the slow tier).
    const ciGateKeys = [
        ...new Set([
            ...[...ci.matchAll(/npm run (proof:[a-z0-9-]+)/g)].map((m) => m[1]),
            ...ALL_DEMO_GATES,
        ]),
    ];
    const misplaced = [];
    for (const gate of ciGateKeys) {
        if (!(gate in pkg.scripts)) continue;
        if (EXCLUDED.has(gate)) continue; // aggregators / tripwires handled elsewhere
        if (STATIC_DEMO_CARVEOUT.has(gate)) continue; // named carve-out
        if (opensBrowser(gate)) continue; // legitimately browser-bound → demo job
        // It is a static (browser-less) gate. It must ride the gates job, NOT the demo tier.
        const esc = gate.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&");
        const inDemo =
            ALL_DEMO_GATES.includes(gate) ||
            new RegExp(`run: npm run ${esc}\\b`).test(jobBounds.demoJob);
        const inGates = new RegExp(`run: npm run ${esc}\\b`).test(jobBounds.gatesJob);
        // A born-RED demo tripwire (peer-satisfied et al) needs the registry glass-ui
        // install (demo job context) — already EXCLUDED above; this is the static set.
        if (inDemo && !inGates) {
            misplaced.push(gate);
        }
    }
    if (misplaced.length > 0) {
        failures.push(
            "static-gate-placement (Q.WA3 S4) — these browser-less static gate(s) ride the " +
                "slow demo tier (demo-correctness roster / demo-device-observe) instead of the " +
                "fast library `gates` job (the F-7 harden): " +
                misplaced.join(", ") +
                ". A pure source grep / graph-walk must ride the fast job (it pays no browser " +
                "wall-clock + dodges the slow-Linux render-race class) — migrate it, or add a " +
                "NAMED carve-out with a reason if it is build-dependent / pre-existing-RED.",
        );
    } else {
        passes.push(
            "static-gate-placement (Q.WA3 S4) — every browser-less static gate rides the fast " +
                `library \`gates\` job (the ${STATIC_DEMO_CARVEOUT.size} named carve-outs — the ` +
                "pre-existing-RED source gates + the build-dependent demo gates — stay on " +
                "demo-smoke's report-all surface by recorded reason). The F-7 device harden holds.",
        );
    }
}

// ── clause 8 (S.A2, the hard clause): demo-correctness carries ZERO step-level
// `continue-on-error` masking (SPEC §3 S.A2 · x2-#2 falsifiability). The blocking
// correctness tier's report-all is INSIDE the roster driver (one step), so no step
// needs continue-on-error; a residual one would mask a red and let a broken demo
// deploy. The OBSERVE job legitimately carries continue-on-error (it is the
// observe tier); this clause is scoped to demo-correctness alone. ──────────────
{
    if (!jobBounds.demoCorrectnessJob) {
        failures.push(
            "no-mask (S.A2) — the `demo-correctness` job is ABSENT from ci.yml; the S.A2 " +
                "demo-gate split did not land (or the job was renamed). Re-ground the gate.",
        );
    } else {
        const coeLines = jobBounds.demoCorrectnessJob
            .split("\n")
            .map((l, i) => ({ l, i }))
            .filter(({ l }) => /^\s*continue-on-error\s*:/.test(l));
        if (coeLines.length > 0) {
            failures.push(
                "no-mask (S.A2) — the BLOCKING `demo-correctness` job carries " +
                    `${coeLines.length} \`continue-on-error\` line(s) — that is masking. The tier's ` +
                    "report-all lives INSIDE the roster driver (one step); no step needs " +
                    "continue-on-error. Remove it (a residual mask lets a broken demo deploy). " +
                    "The observe tier (demo-device-observe) is the only place continue-on-error belongs.",
            );
        } else {
            passes.push(
                "no-mask (S.A2) — the BLOCKING `demo-correctness` job carries ZERO " +
                    "`continue-on-error` (the report-all is inside the roster driver); no masking " +
                    "can let a broken demo deploy.",
            );
        }
    }
}

// ── clause 9 (S.A4 S3/S4): the FROZEN-set discharge, machine-distinguishable ────
// The ~51 FROZEN demo-appearance gates (scripts/gate-bands.mjs FROZEN_SET) are
// RED-authorized by S and frozen IN PLACE at S.A4. Each is discharged LATER (S.G1/
// S.D3) by EITHER a MIGRATION to a named live successor system gate OR an
// owner-ratified KILL with a re-run witness — enforced HERE: a FROZEN key deleted
// from package.json WITHOUT a DISCHARGE record REDs (free-prose "deletion-with-
// cause" is BANNED, x2-#7); a KILL record without a re-run witness REDs; a migration
// whose successor is not a live gate REDs. The C-6 `proof:scene-switcher-mobile`
// zombie retire (fold row 18) is the FIRST discharge — a KILL whose witness is
// machine-continuous (this clause re-verifies the script is gone, the key is gone,
// and the CORRECTNESS_ROSTER membership is gone, every run). ─────────────────────
{
    const isLive = (g) => g in pkg.scripts;
    const clauseFails0 = failures.length;
    // (1) FROZEN completeness — every FROZEN gate is live OR discharged.
    for (const g of FROZEN_SET) {
        if (isLive(g)) continue;
        if (!DISCHARGE[g]) {
            failures.push(
                `frozen-discharge (S.A4 S3) — FROZEN gate ${g} was DELETED from ` +
                    "package.json with NO discharge record in scripts/gate-bands.mjs. " +
                    "Free-prose deletion-with-cause is BANNED — add a machine record: " +
                    `{ kind:"migration", successor:"proof:<live-system-gate>" } OR ` +
                    `{ kind:"kill", ledger, witness:{ cmd, cite } }.`,
            );
        }
    }
    // (2) every DISCHARGE record is machine-valid AND the retired gate is gone.
    for (const [g, d] of Object.entries(DISCHARGE)) {
        if (isLive(g)) {
            failures.push(
                `frozen-discharge (S.A4 S3) — a discharge record exists for ${g} but it ` +
                    "is STILL a live package.json script. A discharge for a present gate " +
                    "is a lie — remove the gate, or remove the record.",
            );
            continue;
        }
        if (d.kind === "migration") {
            if (!d.successor || !isLive(d.successor)) {
                failures.push(
                    `frozen-discharge (S.A4 S3) — ${g} MIGRATION cites successor ` +
                        `${d.successor || "(none)"} which is NOT a live proof:* gate. The ` +
                        "successor system gate that re-asserts the live property must exist.",
                );
            }
        } else if (d.kind === "kill") {
            if (!d.ledger) {
                failures.push(
                    `frozen-discharge (S.A4 S4) — ${g} KILL names NO S-ledger row. An ` +
                        "owner-ratified KILL must cite its ledger row (not free prose).",
                );
            }
            const w = d.witness;
            if (!w || !w.cmd || !w.cite) {
                failures.push(
                    `frozen-discharge (S.A4 S4) — ${g} KILL lacks a re-run witness ` +
                        "(witness.cmd + witness.cite). A KILL without a re-run witness is " +
                        "BANNED — the witness is what distinguishes a ratified retire from a " +
                        "silent deletion.",
                );
            } else {
                const sm = w.cmd.match(/scripts\/([a-z0-9.-]+\.mjs)/i);
                if (sm && existsSync(join(root, "scripts", sm[1]))) {
                    failures.push(
                        `frozen-discharge (S.A4 S4) — ${g} KILL witness cites ${sm[1]} but ` +
                            "that script STILL exists on disk. The re-run witness is FALSIFIED " +
                            "— the retire did not delete the script.",
                    );
                }
            }
            if (CORRECTNESS_ROSTER.includes(g)) {
                failures.push(
                    `frozen-discharge (S.A4 S4) — KILLED gate ${g} is STILL a member of ` +
                        "CORRECTNESS_ROSTER (scripts/demo-roster.mjs). A ledgered KILL must " +
                        "remove EVERY roster/manifest membership.",
                );
            }
        } else {
            failures.push(
                `frozen-discharge (S.A4 S3) — ${g} has an UNKNOWN discharge kind ` +
                    `"${d.kind}". Only { kind:"migration" } or { kind:"kill" } are ` +
                    "machine-distinguishable; anything else is the banned free prose.",
            );
        }
    }
    if (failures.length === clauseFails0) {
        const dischargedKills = Object.entries(DISCHARGE).filter(
            ([, d]) => d.kind === "kill",
        ).length;
        const dischargedMig = Object.entries(DISCHARGE).filter(
            ([, d]) => d.kind === "migration",
        ).length;
        passes.push(
            `frozen-discharge (S.A4 S3/S4) — all ${FROZEN_SET.length} FROZEN gates are ` +
                `live-or-discharged (${dischargedMig} migration + ${dischargedKills} KILL ` +
                "discharge(s), each machine-witnessed); free-prose deletion is impossible.",
        );
    }
}

// ── clause 10 (S.A4 S7): the regression-guard band ──────────────────────────────
// The absence/excision guards (scripts/gate-bands.mjs REGRESSION_GUARDS) are banded
// under one explicit header; this clause gives the band teeth — every member must be
// a LIVE gate wired into the hygiene tier (proof:hygiene-chain). A regression-guard
// that vanishes or drifts out of hygiene REDs. ──────────────────────────────────
{
    const hygieneChain = String(pkg.scripts["proof:hygiene-chain"] ?? "");
    const notLive = REGRESSION_GUARDS.filter((g) => !(g in pkg.scripts));
    const notInHygiene = REGRESSION_GUARDS.filter(
        (g) =>
            g in pkg.scripts &&
            !new RegExp(`\\brun ${g.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(
                hygieneChain,
            ),
    );
    if (notLive.length > 0) {
        failures.push(
            "regression-guard-band (S.A4 S7) — banded regression-guard(s) that no longer " +
                "resolve to a package.json script: " +
                notLive.join(", ") +
                ". A vanished absence-guard lets the excised anti-pattern silently return.",
        );
    } else if (notInHygiene.length > 0) {
        failures.push(
            "regression-guard-band (S.A4 S7) — banded regression-guard(s) NOT wired into the " +
                "hygiene tier (proof:hygiene-chain): " +
                notInHygiene.join(", ") +
                ". An absence-guard is a hygiene member by taxonomy — re-band it.",
        );
    } else {
        passes.push(
            `regression-guard-band (S.A4 S7) — all ${REGRESSION_GUARDS.length} banded ` +
                "regression-guards are live hygiene-chain members (the excision-guard band is " +
                "an explicit, machine-checked set).",
        );
    }
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
