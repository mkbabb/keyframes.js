#!/usr/bin/env node
/**
 * proof:prompt-recap-u — U.R2's tree-cleared recap witness.
 *
 * This is the T recap teeth retargeted to PROMPT-RECAP-U.  U permits a
 * structural ask to clear against a live TREE-WITNESSED file:line; taste and
 * interaction asks still require an owner token.  A band, wave, or green
 * source-shape gate is never a spirit oracle.  The gate is intentionally
 * boring and one-shot: it replaces proof:prompt-recap-t (net gate count flat).
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const RECAP = process.env.KF_PROMPT_RECAP || join(root, "docs/tranches/U/PROMPT-RECAP-U.md");
const OWNER_ASKS = process.env.KF_OWNER_ASKS || join(root, "docs/tranches/U/OWNER-ASKS.md");
const failures = [];
const passes = [];
const fail = (m) => failures.push(m);
const pass = (m) => passes.push(m);

if (!existsSync(RECAP)) {
  fail(`(i) ledger-present — ${RECAP} is absent (U.R1 requires a born-at-entry ledger).`);
} else {
  const md = readFileSync(RECAP, "utf8");
  pass("(i) ledger-present — PROMPT-RECAP-U is present.");
  const rows = md.split("\n")
    .filter((l) => /^\s*\|/.test(l) && !/^\s*\|[\s|:-]+\|?\s*$/.test(l))
    .map((l) => l.split("|").map((c) => c.trim()).filter((_, i, a) => i > 0 && i < a.length - 1));

  // A status may be cleared only by an owner token, a tree witness, or the
  // explicitly posture-only dev clause.  Wave/band mappings never clear it.
  const status = (cells) => cells.find((c) => /ADDRESSED|OWNER-|PENDING-OWNER|RE-ISSUED|TREE-WITNESSED/.test(c)) || "";
  // Ignore the schema/legend rows themselves; only prose ledger rows carry a
  // real status (schema rows contain backticks and the explanatory forbidden
  // token text).
  const isSchema = (s) => /`|an ADDRESSED row citing|green source-shape gate/.test(s);
  const addressed = rows.filter((cells) => /\bADDRESSED\b|OWNER-APPROVED/.test(status(cells)) && !isSchema(status(cells)));
  const badOracle = addressed.filter((cells) => /→\s*(?:Band\b|Wave\b|U\.[A-Z]|[A-Z]\.[A-Z])/.test(status(cells)));
  if (badOracle.length) fail(`(ii) band/wave-as-oracle — ${badOracle.length} ADDRESSED status row(s) cite a band or wave.`);
  else pass("(ii) band/wave-as-oracle — no ADDRESSED status cites a band or wave.");

  const designGreen = rows.filter((cells) => {
    const joined = cells.join(" | ");
    const spirit = status(cells);
    const design = /\b(hero|dock|theme|font|scene|panel|easing|morph|cursor|appearance|design|OD-U)/i.test(joined);
    return design && /`?proof:[a-z0-9-]+`?/.test(spirit) && /\b(?:green|GREEN|exits?\s*0|ADDRESSED)\b/.test(spirit) && /ADDRESSED|OWNER-APPROVED/.test(spirit);
  });
  if (designGreen.length) fail(`(iii) green-gate-as-design-oracle — ${designGreen.length} design/appearance status row(s) cite a green gate.`);
  else pass("(iii) green-gate-as-design-oracle — no design/appearance status cites a green gate.");

  const uncleared = rows.filter((cells) => {
    const spirit = status(cells);
    if (!/RE-ISSUED/.test(spirit)) return false;
    if (!/\bADDRESSED\b|OWNER-APPROVED/.test(spirit)) return false;
    return !/OWNER-APPROVED\s+shot:\d|TREE-WITNESSED\s+[^|]*:\d|owner|posture/i.test(spirit);
  });
  if (uncleared.length) fail(`(iv) re-issuance-census — ${uncleared.length} re-issued row(s) are ADDRESSED without an owner/tree clearance.`);
  else pass("(iv) re-issuance-census — re-issued mandate rows remain honestly auto-RED or carry clearance.");

  // Structural ADDRESSED rows must expose a readable tree witness.  The one
  // posture row is deliberately exempt; it records U's development-only posture.
  const missingWitness = addressed.filter((cells) => {
    const spirit = status(cells);
    return !/OWNER-APPROVED\s+shot:\d|TREE-WITNESSED\s+[^|]*:\d|posture/i.test(spirit);
  });
  if (missingWitness.length) fail(`(v) clearance-token — ${missingWitness.length} ADDRESSED row(s) lack OWNER-APPROVED shot, TREE-WITNESSED file:line, or explicit posture token.`);
  else pass("(v) clearance-token — every ADDRESSED row carries an owner/tree clearance or explicit posture token.");

  const correction = /recurring-correction-shape|correction shape/i.test(md) &&
    /owner rejects on taste what the process passes on convergence/i.test(md) &&
    /proof:owner-review-gate/i.test(md);
  if (correction) pass("(vi) correction-shape — the recurring rejection register and owner-review gate are present.");
  else fail("(vi) correction-shape — the recurring rejection register is incomplete.");
}

if (!existsSync(OWNER_ASKS)) fail(`(vii) owner-asks — ${OWNER_ASKS} is absent.`);
else {
  const rows = readFileSync(OWNER_ASKS, "utf8").split("\n").filter((l) => /^\s*\|\s*\d+\s*\|/.test(l));
  const empty = rows.filter((l) => { const c = l.split("|").map((x) => x.trim()); return !c[c.length - 2] || /^[-_—]+$/.test(c[c.length - 2]); });
  if (!rows.length) fail("(vii) owner-asks — no numbered rows parsed.");
  else if (empty.length) fail(`(vii) owner-asks — ${empty.length} numbered row(s) have no disposition.`);
  else pass(`(vii) owner-asks — all ${rows.length} numbered rows carry a disposition.`);
}

console.log("proof:prompt-recap-u — U.R2 (tree-cleared born-at-entry recap witness)\n");
for (const p of passes) console.log("  ✓ " + p);
if (failures.length) {
  console.error(`\nproof:prompt-recap-u — FAIL (${failures.length}):`);
  for (const f of failures) console.error("  ✗ " + f);
  process.exit(1);
}
console.log("\nproof:prompt-recap-u — PASS: U's ledger is current, non-vacuous, and cleared only by owner/tree evidence.");
