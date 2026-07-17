#!/usr/bin/env node
/**
 * proof:publish → agent-surface — the AGENT-boundary no-drift lock (DM-01 / DR-1).
 *
 * The agent index (`/llms.txt` + `/llms-full.txt`) is GENERATED from
 * `docs/published-surface.md` (the same machine-checked manifest the
 * published-surface sub-gate validates), so it can never advertise an export the
 * surface does not publish. This check is the ONE site that wires that guarantee:
 * it lives inside the proof:publish battery, not in ci.yml, not as a new proof
 * genre, not as a package.json script.
 *
 * R.W7's generate-before-assert model (the flat `scripts/proof-agent-surface.mjs`
 * that carried it was removed with the Tranche-U apparatus dissolution; DR-1
 * caught the resulting drift): the artifacts are gitignored build files, absent on
 * a clean checkout, so we WRITE them fresh from the live manifest first, then
 * assert. The bite is the export-reality invariant and the getTimingFunction
 * absence, not the trivially-fresh byte-diff.
 */
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import {
    REPO,
    CURATED,
    parseManifestRoster,
    buildLlmsTxt,
    buildLlmsFullTxt,
} from "../../lib/agent-surface.mjs";

const GEN = join(REPO, "scripts/gen-agent-surface.mjs");

// ── generate-before-assert: write the gitignored artifacts from the live manifest ──
const gen = spawnSync(process.execPath, [GEN], { stdio: "inherit" });
if (gen.status !== 0) {
    console.error("proof:publish — agent-surface FAIL: the generator itself errored.");
    process.exit(gen.status ?? 1);
}

// ── the REAL diff-and-exit: on-disk artifacts must equal a fresh generation ──
const check = spawnSync(process.execPath, [GEN, "--check"], { stdio: "inherit" });
if (check.status !== 0) process.exit(check.status ?? 1);

// ── the invariant that bites: every curated export ∈ the published roster ──
const roster = new Set(parseManifestRoster().map((r) => r.name));
const curated = [...new Set(CURATED.flatMap((p) => p.exports))];
const phantom = curated.filter((e) => !roster.has(e));
if (phantom.length > 0) {
    console.error(
        `proof:publish — agent-surface FAIL: the curated index links export(s) NOT in ` +
            `the published surface: ${phantom.map((e) => `\`${e}\``).join(", ")}.`,
    );
    process.exit(1);
}

// ── getTimingFunction (removed at 6.0.0) must never reappear in the artifacts ──
const both = `${buildLlmsTxt()}\n${buildLlmsFullTxt()}`;
if (/getTimingFunction/.test(both)) {
    console.error(
        "proof:publish — agent-surface FAIL: `getTimingFunction` (removed at 6.0.0) is present in the agent surface.",
    );
    process.exit(1);
}

console.log(
    `proof:publish — agent-surface PASS: /llms.txt + /llms-full.txt match a fresh ` +
        `generation; all ${curated.length} curated exports are published; getTimingFunction absent.`,
);
process.exit(0);
