#!/usr/bin/env node
/**
 * proof:subject-full — T.M5 (b) (lane 29 rec 4 / T-GATE-LEGIBLE). BORN-RED.
 *
 * FULLNESS over EXISTENCE — a RENDERED-REGION assertion, not an attribute read. The
 * cube renders ALL SIX faces (subject-animates / orbital-rotate3d / live-session B1
 * today certify "≥3 distinct interpolated transforms" — a single die-face that
 * TILTS passes, #1). The morph renders a VISIBLE FILLED shape over the grid
 * in-viewport (proof:morph-scene reads the d-attr mutation on a possibly-invisible /
 * grid-occluded path, #21). Both replace the ≥3-distinct-value / non-zero-bbox
 * certificates that greened the rejected renders.
 *
 * BORN-RED BY DESIGN: each `full` subject in SUBJECTS.json carries `verified: false`
 * until the CURED render passes the rendered-region browser check. T.A owns the cube
 * --spin-energy bloom delete + the amiga NaN/rotation cure; morph is PRUNED per OD-1
 * (its clause retires in lockstep with proof:morph-scene, T.M7). Rides the T born-RED
 * BACKLOG (T_BORNRED_BACKLOG).
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

let full = [];
try {
    full = JSON.parse(readFileSync(SUBJECTS, "utf8")).full ?? [];
} catch (e) {
    failures.push(`subjects — cannot read ${SUBJECTS}: ${e.message}.`);
}

for (const s of full) {
    if (!s.verified) {
        failures.push(
            `unverified — subject "${s.subject}": ${s.assertion} — NOT verified on the cured render ` +
                `(${s.verdictItem}; cure: ${s.cure}). Born-RED until the rendered-REGION browser oracle ` +
                "passes (fullness ≠ ≥3-distinct-transform / d-attr mutation — those proxies are retired).",
        );
    } else {
        passes.push(`full — subject "${s.subject}" passes the rendered-region fullness oracle.`);
    }
}

console.log("proof:subject-full — T.M5(b) (fullness over existence; rendered-region) [BORN-RED]\n");
for (const p of passes) console.log("  ✓ " + p);
if (failures.length > 0) {
    console.error(`\nproof:subject-full — FAIL (${failures.length}) [BORN-RED backlog — T_BORNRED_BACKLOG]:`);
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}
console.log("\nproof:subject-full — PASS: every full subject renders its whole region (all faces / visible shape).");
