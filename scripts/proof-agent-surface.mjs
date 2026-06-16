#!/usr/bin/env node
/**
 * proof:agent-surface — the K.W12 ED-1 boundary-ORACLE at the AGENT boundary.
 *
 * The gate-ORACLE precept carried to the AGENT boundary: J.W5 proved "the thing
 * a human INSTALLS is the thing the source declares" (proof:published-surface);
 * this gate proves "the thing an AGENT reads about kf is the thing kf PROVES"
 * (ecosystem-distribution.md §6.3). The agent index (`/llms.txt`,
 * `/llms-full.txt`) is GENERATED from `docs/published-surface.md` (the J.W5
 * machine-checked manifest) + the `proof:*` gate roster — a hand-maintained
 * index is the doc-rot the gate-ORACLE precept exists to kill.
 *
 * CLAUSE (a) — the agent index NEVER drifts from the published surface
 * (CORRECTNESS · the §Hard gate spine bar). Four asserts, each BITES:
 *
 *   (a.1) the artifacts EXIST — `/llms.txt` + `/llms-full.txt` are present.
 *       BORN-RED WITNESS: `ls llms.txt` → "No such file" on the pre-W12 tree →
 *       the gate cannot read the index → reds by construction.
 *
 *   (a.2) every export the index LINKS is a real published export — the union
 *       of the curated exports (the 13 primitives) ⊆ the manifest roster, AND
 *       the FULL export roster in llms-full.txt == the manifest roster
 *       (set-equality: the index advertises no unpublished export, nor omits a
 *       published one). BITE: add an export to the surface but not the index →
 *       drift → reds; index a non-export → reds.
 *
 *   (a.3) every `proof:*` gate the index CITES exists in the `proof:all` roster
 *       (the package.json proof:* scripts). The agent reads "the library PROVES
 *       springs, here is the gate" — and that gate is real. BITE: cite a
 *       non-existent gate → reds.
 *
 *   (a.4) the artifacts MATCH a fresh generation — the on-disk llms.txt /
 *       llms-full.txt are byte-identical to what `gen-agent-surface.mjs` emits
 *       from TODAY's manifest + roster. This is the by-construction no-drift
 *       lock: the artifact cannot be hand-edited away from the generated truth.
 *       BITE: hand-edit the index, or change the manifest without regenerating
 *       → the on-disk artifact diverges from the fresh build → reds. Fix:
 *       `node scripts/gen-agent-surface.mjs`.
 *
 * BUDGET 0 — the gate asserts POSITIVE product properties (the index exists and
 * matches the published surface), not an error count.
 *
 * RUN: npm run proof:agent-surface
 */
import fs from "node:fs";
import path from "node:path";
import {
    REPO,
    CURATED,
    parseManifestRoster,
    parseProofRoster,
    buildLlmsTxt,
    buildLlmsFullTxt,
} from "./lib/agent-surface.mjs";

const LLMS = path.join(REPO, "llms.txt");
const LLMS_FULL = path.join(REPO, "llms-full.txt");

const failures = [];
const ok = (msg) => console.log(`  ✓ ${msg}`);

console.log(
    "proof:agent-surface — the gate-ORACLE at the AGENT boundary (the index can never lie)",
);

// ── (a.1) the artifacts exist ──────────────────────────────────────────────────
const haveLlms = fs.existsSync(LLMS);
const haveFull = fs.existsSync(LLMS_FULL);
if (!haveLlms) failures.push("(a.1) /llms.txt does NOT exist — the agent index is absent (run `node scripts/gen-agent-surface.mjs`).");
if (!haveFull) failures.push("(a.1) /llms-full.txt does NOT exist — the full agent surface is absent.");
if (haveLlms && haveFull) ok("(a.1) /llms.txt + /llms-full.txt present");

if (failures.length > 0) {
    report();
}

// ── derive the source-of-truth rosters ─────────────────────────────────────────
const roster = parseManifestRoster();
const rosterNames = new Set(roster.map((r) => r.name));
const proofRoster = parseProofRoster();

// Sanity floor — a silently-empty parse must FAIL the gate, not pass it.
if (roster.length < 20) {
    failures.push(
        `(a) manifest roster parse yielded only ${roster.length} exports — the derivation is broken (fail-loud, not false-green).`,
    );
}
if (proofRoster.size < 50) {
    failures.push(
        `(a) proof:* roster parse yielded only ${proofRoster.size} gates — the derivation is broken (fail-loud).`,
    );
}

const llmsTxt = haveLlms ? fs.readFileSync(LLMS, "utf8") : "";
const llmsFull = haveFull ? fs.readFileSync(LLMS_FULL, "utf8") : "";

// ── (a.2) every linked export is a real published export ───────────────────────
{
    // The curated exports — every one must be in the manifest roster.
    const curatedExports = [...new Set(CURATED.flatMap((p) => p.exports))];
    const phantomCurated = curatedExports.filter((e) => !rosterNames.has(e));
    if (phantomCurated.length > 0) {
        failures.push(
            `(a.2) the curated index links export(s) NOT in the published surface: ${phantomCurated
                .map((e) => `\`${e}\``)
                .join(", ")} — the agent index advertises an unpublished export.`,
        );
    }

    // The FULL roster in llms-full.txt — set-equality against the manifest.
    // Parse the `- \`Name\`` bullets under the two roster sections.
    const fullRosterNames = new Set();
    const rosterSection = llmsFull.slice(
        llmsFull.indexOf("## The full export roster"),
    );
    for (const m of rosterSection.matchAll(/^- `([A-Za-z_$][\w$]*)`$/gm)) {
        fullRosterNames.add(m[1]);
    }
    const missingFromIndex = [...rosterNames].filter(
        (n) => !fullRosterNames.has(n),
    );
    const extraInIndex = [...fullRosterNames].filter(
        (n) => !rosterNames.has(n),
    );
    if (missingFromIndex.length > 0) {
        failures.push(
            `(a.2) /llms-full.txt OMITS published export(s) from its roster: ${missingFromIndex
                .map((e) => `\`${e}\``)
                .join(", ")} — the agent surface hides part of the published surface (drift).`,
        );
    }
    if (extraInIndex.length > 0) {
        failures.push(
            `(a.2) /llms-full.txt's roster names export(s) NOT in the published surface: ${extraInIndex
                .map((e) => `\`${e}\``)
                .join(", ")} — the agent surface advertises a phantom.`,
        );
    }
    if (
        phantomCurated.length === 0 &&
        missingFromIndex.length === 0 &&
        extraInIndex.length === 0
    ) {
        ok(
            `(a.2) every linked export is published — curated ${curatedExports.length}, full roster ${fullRosterNames.size} == manifest ${rosterNames.size} (set-equal)`,
        );
    }
}

// ── (a.3) every cited proof:* gate is real ─────────────────────────────────────
{
    const cited = new Set();
    for (const p of CURATED) cited.add(p.proof);
    // Also catch any `proof:foo` literal in the artifacts that names a gate.
    for (const src of [llmsTxt, llmsFull]) {
        for (const m of src.matchAll(/`(proof:[\w-]+)`/g)) cited.add(m[1]);
    }
    const phantomGates = [...cited].filter((g) => !proofRoster.has(g));
    if (phantomGates.length > 0) {
        failures.push(
            `(a.3) the agent index cites `.concat(
                `proof:* gate(s) NOT in package.json: ${phantomGates
                    .map((g) => `\`${g}\``)
                    .join(", ")} — the agent reads "kf PROVES X here is the gate" but the gate does not exist.`,
            ),
        );
    } else {
        ok(
            `(a.3) every cited proof:* gate exists in the proof:all roster (${cited.size} cited, ${proofRoster.size} total)`,
        );
    }
}

// ── (a.4) the artifacts match a fresh generation (no-drift lock) ───────────────
{
    const freshLlms = buildLlmsTxt();
    const freshFull = buildLlmsFullTxt();
    if (llmsTxt !== freshLlms) {
        failures.push(
            "(a.4) /llms.txt is STALE — it does not match `gen-agent-surface.mjs`'s output from today's manifest + roster. The index was hand-edited or the surface changed without regeneration. Fix: `node scripts/gen-agent-surface.mjs`.",
        );
    }
    if (llmsFull !== freshFull) {
        failures.push(
            "(a.4) /llms-full.txt is STALE — it does not match the generator's output. Fix: `node scripts/gen-agent-surface.mjs`.",
        );
    }
    if (llmsTxt === freshLlms && llmsFull === freshFull) {
        ok(
            "(a.4) both artifacts are byte-identical to a fresh generation (the by-construction no-drift lock holds)",
        );
    }
}

report();

function report() {
    console.log("");
    if (failures.length > 0) {
        console.error(
            `proof:agent-surface — FAIL (${failures.length} finding(s); the agent index lies about the published surface):`,
        );
        for (const f of failures) console.error("  ✗ " + f);
        console.error(
            "\n  The agent surface is, by construction, the gate-verified surface.\n" +
                "  Regenerate it from the manifest + the proof roster:\n" +
                "    node scripts/gen-agent-surface.mjs\n" +
                "  and ensure every curated primitive links a real export + cites a real gate.",
        );
        process.exit(1);
    }
    console.log(
        "proof:agent-surface — PASS: /llms.txt + /llms-full.txt exist, every linked\n" +
            "export is published, every cited proof:* gate is real, and both artifacts\n" +
            "are byte-identical to a fresh generation. The agent index cannot drift\n" +
            "from the J.W5 published surface (the gate-ORACLE at the AGENT boundary).",
    );
    process.exit(0);
}
