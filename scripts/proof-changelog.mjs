#!/usr/bin/env node
/**
 * proof:changelog — the GENERALIZED breaking-set MIGRATION-doc oracle (S.C1 · C-18).
 *
 * Semver honesty: a BREAKING removal from the published surface MUST be documented
 * for the consumer. The predecessor gate (`proof:changelog-5`, Q.WE1) hardcoded the
 * three 5.0.0 alias-drop renames — it could not catch the NEXT release's removals
 * (the 5.1.0 `animate()` excision + the granular-loader collapse shipped WITHOUT a
 * migration doc; the fold-row-24 semver gap). This gate generalizes the mechanism
 * (C-18) so EVERY release's removed surface is gated version-agnostically.
 *
 * THE C-18 DIFF MECHANISM. `docs/published-surface.md` is a SINGLE current file with
 * NO per-release history — so the gate reconstructs the previous surface via git,
 * no archived snapshots:
 *   1. resolve the PREVIOUS published tag — `npm dist-tags.latest`, falling back to
 *      the highest `v*` git tag; guarded so a tag that is NOT strictly below the
 *      current package version (i.e. the current version is already published, or
 *      npm is unreachable) steps back to the highest `v*` tag strictly BELOW the
 *      current version (the release this HEAD supersedes — else the diff is vacuous
 *      and an already-published version's debt escapes).
 *   2. `git show v<prev>:docs/published-surface.md` — the previous surface.
 *   3. diff its public-symbol rows against HEAD's.
 *   4. RED on any REMOVED symbol lacking a matching entry in `docs/MIGRATION-<cur>.md`
 *      (the file exists AND names the removed symbol).
 *
 * A public-symbol ROW is a markdown table row; its symbols are the `backticked`
 * tokens in the FIRST cell (a row may list several, e.g. `flip`/`flipShared`).
 * Description-cell backticks are ignored (only the first cell is the symbol cell).
 *
 * Born-RED today: at HEAD (5.1.0) vs v5.0.0 the removed symbols are `animate`,
 * `loadEngine`, `loadCompiler`, `loadIngest` and `docs/MIGRATION-5.1.0.md` is
 * ABSENT. GREEN once S.C1's S2 backfills the doc naming each removed symbol.
 *
 * CI posture: HARD — a semver-honesty precept, structural and device-independent.
 * (Requires the prev release tag to be resolvable — the same git-tag dependency
 * proof:published-on-master already carries.)
 *
 * RUN: npm run proof:changelog
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SURFACE = "docs/published-surface.md";

const failures = [];
const git = (...args) => spawnSync("git", args, { cwd: REPO, encoding: "utf8" });

// ── semver helpers ────────────────────────────────────────────────────────────
const norm = (v) => String(v).trim().replace(/^v/, "");
function parseSemver(v) {
    const m = norm(v).match(/^(\d+)\.(\d+)\.(\d+)/);
    return m ? [+m[1], +m[2], +m[3]] : null;
}
function cmpSemver(a, b) {
    const pa = parseSemver(a);
    const pb = parseSemver(b);
    if (!pa || !pb) return 0;
    for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pa[i] - pb[i];
    return 0;
}

// ── the current version (the doc a removal must be documented in) ─────────────
const pkg = JSON.parse(fs.readFileSync(path.join(REPO, "package.json"), "utf8"));
const CURRENT = norm(pkg.version);
console.log(`proof:changelog — C-18 generalized MIGRATION oracle (current v${CURRENT})\n`);

// ── clause 0 — resolve the previous published tag ─────────────────────────────
console.log("clause 0 — resolve the previous published tag");

// The highest `v*` git tag strictly below the current version.
const allTags = (git("tag", "--list", "v*").stdout ?? "")
    .split("\n")
    .map((t) => t.trim())
    .filter((t) => parseSemver(t));
const highestBelowCurrent = allTags
    .filter((t) => cmpSemver(t, CURRENT) < 0)
    .sort(cmpSemver)
    .pop();

// npm dist-tags.latest (short-timeout; offline-tolerant).
let npmLatest = null;
const view = spawnSync(
    "npm",
    ["view", pkg.name, "dist-tags.latest"],
    { cwd: REPO, encoding: "utf8", timeout: 15000 },
);
if (view.status === 0 && parseSemver(view.stdout)) npmLatest = norm(view.stdout);

// Prefer npm latest when it is a real predecessor (strictly below current);
// otherwise (already-published / equal / offline) step back to the highest v* tag
// strictly below current.
let prevVersion = null;
if (npmLatest && cmpSemver(npmLatest, CURRENT) < 0) {
    prevVersion = npmLatest;
    console.log(`  · npm dist-tags.latest = ${npmLatest} (a real predecessor of ${CURRENT})`);
} else {
    prevVersion = highestBelowCurrent ? norm(highestBelowCurrent) : null;
    console.log(
        `  · npm latest ${npmLatest ?? "(unreachable)"} is not strictly below ${CURRENT}; ` +
            `falling back to the highest v* tag below current`,
    );
}

if (!prevVersion) {
    failures.push(
        "(0) no previous published tag resolves below the current version — cannot " +
            "reconstruct the prior published surface. Ensure the release tags are fetched " +
            "(the git-tag dependency proof:published-on-master shares).",
    );
    report();
}
const prevTag = `v${prevVersion}`;
console.log(`  ✓ previous published surface = ${prevTag}:${SURFACE}`);

// ── clause 1 — reconstruct + diff the surfaces ────────────────────────────────
console.log("\nclause 1 — diff the published-surface rows (prev → HEAD)");

const prevShow = git("show", `${prevTag}:${SURFACE}`);
if (prevShow.status !== 0) {
    failures.push(
        `(1) \`git show ${prevTag}:${SURFACE}\` failed (exit ${prevShow.status}) — the prior ` +
            `surface is unreachable. stderr: ${(prevShow.stderr ?? "").trim().slice(0, 160)}`,
    );
    report();
}
const headSurface = fs.readFileSync(path.join(REPO, SURFACE), "utf8");

/** Public symbols = the `backticked` tokens in each table row's FIRST cell. */
function symbols(text) {
    const set = new Set();
    for (const line of text.split("\n")) {
        const first = line.match(/^\s*\|([^|]*)\|/);
        if (!first) continue;
        for (const t of first[1].matchAll(/`([^`]+)`/g)) set.add(t[1].trim());
    }
    return set;
}
const prevSyms = symbols(prevShow.stdout ?? "");
const headSyms = symbols(headSurface);
const removed = [...prevSyms].filter((s) => !headSyms.has(s)).sort();

console.log(
    `  · ${prevSyms.size} symbols at ${prevTag}, ${headSyms.size} at HEAD; ` +
        `${removed.length} removed: ${removed.length ? removed.join(", ") : "(none)"}`,
);

// ── clause 2 — every removed symbol is documented in MIGRATION-<current>.md ────
console.log(`\nclause 2 — every removed symbol documented in docs/MIGRATION-${CURRENT}.md`);

if (removed.length === 0) {
    console.log("  ✓ no public-surface row removed since the previous release — vacuously covered.");
} else {
    const migName = `docs/MIGRATION-${CURRENT}.md`;
    const migPath = path.join(REPO, migName);
    if (!fs.existsSync(migPath)) {
        failures.push(
            `(2) ${migName} is ABSENT, but v${CURRENT} removes public-surface row(s) [` +
                removed.join(", ") +
                `] relative to ${prevTag}. A breaking removal MUST ship a migration doc ` +
                `(semver honesty). Author ${migName} naming each removed symbol.`,
        );
    } else {
        const doc = fs.readFileSync(migPath, "utf8");
        const undocumented = removed.filter(
            (s) => !new RegExp(`\\b${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(doc),
        );
        if (undocumented.length > 0) {
            failures.push(
                `(2) ${migName} exists but does NOT name removed symbol(s): ` +
                    undocumented.join(", ") +
                    `. Each removed public-surface row needs a matching migration entry.`,
            );
        } else {
            console.log(
                `  ✓ ${migName} documents every removed symbol (${removed.join(", ")}).`,
            );
        }
    }
}

report();

function report() {
    if (failures.length > 0) {
        console.error(
            `\nproof:changelog — FAIL (${failures.length} finding(s); an undocumented ` +
                `breaking removal):`,
        );
        for (const f of failures) console.error("  ✗ " + f);
        process.exit(1);
    }
    console.log(
        `\nproof:changelog — PASS: every public-surface row removed between ${prevTag} ` +
            `and HEAD is documented in docs/MIGRATION-${CURRENT}.md (the C-18 diff mechanism ` +
            `over git-reconstructed surfaces — version-agnostic semver honesty).`,
    );
    process.exit(0);
}
