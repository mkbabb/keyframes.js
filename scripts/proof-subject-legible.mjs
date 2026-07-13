#!/usr/bin/env node
/**
 * proof:subject-legible — T.M5 (a) (lane 29 rec 4 / T-GATE-LEGIBLE). BORN-RED.
 *
 * LEGIBILITY over EXISTENCE. Retires proof:icon-paint-live (a) ("a PAINTING inline
 * <svg> with a non-zero bounding box" — a blur-filtered/janky icon still has a
 * non-zero box; existence ≠ legibility, #4). The oracle: NO blur filter over a
 * glyph + an edge-energy floor. Reds on today's blurred dock icon (the resting
 * blur(3px), a glass-ui born-RED handoff cured by T.C).
 *
 * BORN-RED BY DESIGN: each `legible` subject in SUBJECTS.json carries `verified:
 * false` until the CURED render passes the browser check (no-blur + edge-energy).
 * The band that cures the defect (T.C) flips it WITH the browser oracle. This gate
 * rides an external owner-review hold — NOT in any blocking aggregator
 * until it greens.
 *
 * LOCKSTEP: proof:icon-paint-live (a)'s bbox clause is superseded/retired as this
 * greens (historical retirement record — proof:icon-paint-live → successor subject-legible).
 *
 * Overrides (plant-test): KF_SUBJECTS.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SUBJECTS =
    process.env.KF_SUBJECTS ||
    join(root, "docs/tranches/T/stage-manifests/SUBJECTS.json");

const failures = [];
const passes = [];

let legible = [];
try {
    legible = JSON.parse(readFileSync(SUBJECTS, "utf8")).legible ?? [];
} catch (e) {
    failures.push(`subjects — cannot read ${SUBJECTS}: ${e.message}.`);
}

for (const s of legible) {
    if (!s.verified) {
        failures.push(
            `unverified — subject "${s.subject}": ${s.assertion} — NOT verified on the cured render ` +
                `(${s.verdictItem}; cure: ${s.cure}). Born-RED until the no-blur + edge-energy browser ` +
                "oracle passes (existence ≠ legibility — the bbox proxy is retired).",
        );
    } else {
        passes.push(`legible — subject "${s.subject}" passes the no-blur + edge-energy oracle.`);
    }
}

console.log("proof:subject-legible — T.M5(a) (legibility over existence; no-blur + edge-energy) [BORN-RED]\n");
for (const p of passes) console.log("  ✓ " + p);
if (failures.length > 0) {
    console.error(`\nproof:subject-legible — FAIL (${failures.length}) [external owner-review hold]:`);
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}
console.log("\nproof:subject-legible — PASS: every legible subject renders crisp (no blur over a glyph).");
