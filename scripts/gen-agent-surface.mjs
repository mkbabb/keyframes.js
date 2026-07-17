#!/usr/bin/env node
/**
 * gen-agent-surface — the K.W12 ED-1 agent-surface GENERATOR.
 *
 * Produces `/llms.txt` (the curated INDEX) + `/llms-full.txt` (the round-trip
 * recipe inline + the full export roster) from the J.W5 machine-checked
 * `docs/published-surface.md` manifest. The artifacts are GENERATED, NOT
 * hand-maintained, so the index cannot drift from the published roster.
 *
 * The agent surface is, by construction, the gate-verified surface
 * (ecosystem-distribution.md §6.3): what an agent reads about kf is what kf
 * verifies. Every primitive in the index names its focused Vitest file or the
 * package-boundary command.
 *
 * RUN:    node scripts/gen-agent-surface.mjs        (writes the artifacts)
 *         node scripts/gen-agent-surface.mjs --check (diffs the on-disk
 *              artifacts against a fresh generation; exits non-zero on any
 *              drift or absence — the no-drift lock, wired into proof:publish)
 *
 * The shared roster derivation lives in `scripts/lib/agent-surface.mjs` so the
 * generator and package-boundary check read the SAME source of truth.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
    REPO,
    buildLlmsTxt,
    buildLlmsFullTxt,
} from "./lib/agent-surface.mjs";

const check = process.argv.includes("--check");

const llmsTxt = buildLlmsTxt();
const llmsFullTxt = buildLlmsFullTxt();

const LLMS = path.join(REPO, "llms.txt");
const LLMS_FULL = path.join(REPO, "llms-full.txt");

if (check) {
    // --check — a REAL diff-and-exit (DM-01 / DR-1). Regenerate in memory, then
    // compare byte-for-byte against the on-disk artifacts and exit non-zero on any
    // drift or absence. (Previously this only printed the generated text and always
    // exited 0 — a "check" that could never fail.) The files are gitignored build
    // artifacts, so `node scripts/gen-agent-surface.mjs` must have written them
    // first; the proof:publish battery does that (generate-before-assert).
    const drift = [];
    for (const [label, file, fresh] of [
        ["llms.txt", LLMS, llmsTxt],
        ["llms-full.txt", LLMS_FULL, llmsFullTxt],
    ]) {
        const onDisk = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
        if (onDisk === null) {
            drift.push(
                `${label} is ABSENT — run \`node scripts/gen-agent-surface.mjs\` to write it.`,
            );
        } else if (onDisk !== fresh) {
            drift.push(
                `${label} is STALE — it does not match the generator's output from ` +
                    `today's \`docs/published-surface.md\`. Run \`node scripts/gen-agent-surface.mjs\`.`,
            );
        }
    }
    if (drift.length > 0) {
        console.error(
            "gen-agent-surface --check — FAIL (the agent surface drifted from the published manifest):",
        );
        for (const d of drift) console.error("  ✗ " + d);
        process.exit(1);
    }
    console.log(
        "gen-agent-surface --check — OK: /llms.txt + /llms-full.txt are byte-identical to a fresh generation.",
    );
    process.exit(0);
} else {
    fs.writeFileSync(LLMS, llmsTxt);
    fs.writeFileSync(LLMS_FULL, llmsFullTxt);
    console.log(
        `gen-agent-surface — wrote llms.txt (${llmsTxt.length} B) + ` +
            `llms-full.txt (${llmsFullTxt.length} B) from docs/published-surface.md ` +
            `and its focused test references. Run \`npm run proof:publish\` to verify.`,
    );
}
