#!/usr/bin/env node
/**
 * gen-agent-surface — the K.W12 ED-1 agent-surface GENERATOR.
 *
 * Produces `/llms.txt` (the curated INDEX) + `/llms-full.txt` (the round-trip
 * recipe inline + the full export roster) from the J.W5 machine-checked
 * `docs/published-surface.md` manifest + the `proof:*` gate roster in
 * `package.json`. The artifacts are GENERATED, NOT hand-maintained — a
 * hand-maintained markdown drifts; the gate-ORACLE precept forbids the
 * doc-rot. `proof:agent-surface` re-derives the SAME roster and set-equates the
 * index against it, so the artifact cannot lie about the published surface.
 *
 * The agent surface is, by construction, the gate-verified surface
 * (ecosystem-distribution.md §6.3): what an agent reads about kf is what kf
 * proves. Every primitive in the index names its `proof:*` gate, so the agent
 * reads "the library PROVES springs, here is the gate" — not "the library
 * claims springs".
 *
 * RUN:    node scripts/gen-agent-surface.mjs        (writes the artifacts)
 *         node scripts/gen-agent-surface.mjs --check (prints; writes nothing)
 *
 * The shared roster derivation lives in `scripts/lib/agent-surface.mjs` so the
 * generator and `proof:agent-surface` read the SAME source of truth — the
 * generator EMITS it, the gate ASSERTS the emitted artifact matches a fresh
 * derivation.
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
    console.log(llmsTxt);
    console.log("\n\n──────── llms-full.txt ────────\n");
    console.log(llmsFullTxt);
} else {
    fs.writeFileSync(LLMS, llmsTxt);
    fs.writeFileSync(LLMS_FULL, llmsFullTxt);
    console.log(
        `gen-agent-surface — wrote llms.txt (${llmsTxt.length} B) + ` +
            `llms-full.txt (${llmsFullTxt.length} B) from docs/published-surface.md ` +
            `+ the proof:* roster. Run \`npm run proof:agent-surface\` to verify.`,
    );
}
