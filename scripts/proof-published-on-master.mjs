#!/usr/bin/env node
/**
 * proof:published-on-master — Q.WA3 S2 (the MERGE-RECONCILE oracle, the FIRST DAG motion).
 *
 * THE REAL OBSERVABLE (inv-observable-truth, NOT a proxy): the published kf 4.4.0
 * tip lived ONLY on `tranche-p-dev`; master's tip was the M-era `aef3ef3`, so the
 * deploy-of-record (CF Pages, branch `master`) served a STALE bundle. The Q DAG's
 * first motion is the master-merge reconcile — every cross-repo publish chain + the
 * 5.0.0 cut sit downstream of it. This gate is the merge's own oracle: it asserts
 * the v4.4.0 RELEASE COMMIT is an ancestor of `master`.
 *
 * It DERIVES the tag name from package.json (`v${version}` — S.A0: the frozen
 * `v4.4.0` constant rotted when 5.1.0 cut) and RESOLVES it to a commit AT RUN
 * TIME (`git rev-list -n1 v<version>`) — never a frozen hash or version — so it
 * does not rot as releases land, and `git merge-base --is-ancestor <commit>
 * master` (falling back to `origin/master` under CI's detached-HEAD checkout) is
 * the GENUINE ancestry fact, not a grep of a merge-commit subject (which a
 * `--no-ff` message could fake).
 *
 * BORN-RED on the pre-merge tree (`merge-base --is-ancestor` exits 1 when the v4.4.0
 * commit is NOT in master — the deploy-of-record is stale at aef3ef3). GREEN the
 * instant the authorized merge of the tranche-p-dev tip (which carries the v4.4.0
 * release commit transitively) lands on master.
 *
 * RUN: node scripts/proof-published-on-master.mjs
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// The published version whose release commit MUST be an ancestor of master.
// S.A0: DERIVED from package.json at run time — never a hardcoded constant. The
// gate shipped with a frozen `TAG = "v4.4.0"` while the published version moved
// to 5.1.0: the assertion rotted the moment the next release cut (the exact
// frozen-witness failure mode this gate's own docstring forbids for the HASH).
// package.json's `version` is the local, network-free source of truth for "the
// version this tree declares shipped"; release.yml tags every publish `v<semver>`
// (tag-triggered), so `v${version}` names the release commit by construction.
const pkgVersion = JSON.parse(
    readFileSync(join(root, "package.json"), "utf8"),
).version;
const TAG = `v${pkgVersion}`;

const git = (...args) =>
    spawnSync("git", args, { cwd: root, encoding: "utf8" });

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

console.log(
    "proof:published-on-master — Q.WA3 S2 (the published version is an ancestor of master)",
);

// ── Clause: the tag resolves to a commit ──────────────────────────────────────
const revList = git("rev-list", "-n1", TAG);
const tagCommit = (revList.stdout ?? "").trim();
if (revList.status !== 0 || !/^[0-9a-f]{40}$/.test(tagCommit)) {
    fail(
        "tag-resolves",
        `the ${TAG} tag does NOT resolve to a commit (git rev-list -n1 ${TAG} ` +
            `exited ${revList.status}). The release tag must exist for its ancestry ` +
            `to be asserted. stderr: ${(revList.stderr ?? "").trim().slice(0, 160)}`,
    );
    report();
}
ok("tag-resolves", `${TAG} → ${tagCommit.slice(0, 10)} (resolved at run time, not frozen)`);

// ── Clause: master exists ─────────────────────────────────────────────────────
// S.A0: resolve the LOCAL `master` ref first, falling back to the remote-tracking
// `origin/master` — CI's actions/checkout leaves a DETACHED HEAD (no local branch
// ref), so the bare `master` rev-parse can never resolve there even with full
// history; the remote-tracking ref carries the same deploy-of-record ancestry.
const MASTER_CANDIDATES = ["master", "origin/master"];
let masterName = null;
let masterSha = null;
for (const candidate of MASTER_CANDIDATES) {
    const r = git("rev-parse", "--verify", `${candidate}^{commit}`);
    if (r.status === 0) {
        masterName = candidate;
        masterSha = (r.stdout ?? "").trim();
        break;
    }
}
if (!masterName) {
    fail(
        "master-exists",
        `neither \`master\` nor \`origin/master\` resolves (git rev-parse). The ` +
            `deploy-of-record branch must be reachable — on CI the checkout needs ` +
            `history+tags (fetch-depth: 0).`,
    );
    report();
}
ok("master-exists", `${masterName} → ${masterSha.slice(0, 10)}`);

// ── Clause (KEYSTONE): the v4.4.0 commit is an ANCESTOR of master ─────────────
// This is the merge's own oracle — exit 0 iff the release commit is reachable from
// master (the merge of the tranche-p-dev tip brings it in transitively). BORN-RED
// pre-merge (master stale at aef3ef3 / 42f661a M-era era), GREEN on the cure.
const isAncestor = git("merge-base", "--is-ancestor", tagCommit, masterName);
if (isAncestor.status !== 0) {
    fail(
        "ancestor-of-master",
        `the ${TAG} release commit (${tagCommit.slice(0, 10)}) is NOT an ancestor of ` +
            `${masterName} (git merge-base --is-ancestor exited ${isAncestor.status}). The ` +
            `deploy-of-record (CF Pages, branch master) is STALE — the published version ` +
            `is not merged. Merge the release branch tip to master (the first DAG motion).`,
    );
} else {
    ok(
        "ancestor-of-master",
        `${TAG} (${tagCommit.slice(0, 10)}) IS an ancestor of ${masterName} — the published ` +
            `version is merged; the deploy-of-record serves the real impl-drive tree`,
    );
}

report();

function report() {
    console.log("");
    if (failures.length > 0) {
        console.error("proof:published-on-master — FAIL:\n" + failures.join("\n"));
        process.exit(1);
    }
    console.log(
        `proof:published-on-master — PASS: the ${TAG} release commit is an ancestor of ` +
            `master (resolved at run time, no frozen hash). The master-merge reconcile — ` +
            `the FIRST Q DAG motion — has landed; the CF Pages deploy-of-record is ` +
            `live-correct over the published tree.`,
    );
    process.exit(0);
}
