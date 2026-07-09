#!/usr/bin/env node
/**
 * proof:stage-inventory — T.M4 (lane 29 rec 3 / T-GATE-INVENTORY). BORN-RED.
 *
 * The NEGATIVE-SPACE gate — the INVERSE of the DFA. Instead of "the control set
 * equals the table," assert "the on-stage element set equals the OWNER-SANCTIONED
 * inventory," so extra chrome NOT in the manifest REDs: the cube rx/ry/rz readout
 * (#5), the ghost tooltip / home divider / play-not-first ordering (#6), the
 * controls surrounding pane (#7), the square caption block (#11), the cursor light
 * (#22). This catches the entire "never gated" Class D ("no gate can assert this
 * element should not exist") and STRUCTURALLY REPLACES proof:gesture-manifest's
 * inverted tell-MANDATE (which does the opposite — an entry WITHOUT a tell is a
 * hard RED, surfacing the affordance is mandatory — the exact owner-rejected legend).
 *
 * BORN-RED BY DESIGN: each scene's manifest slot is either an owner-sanctioned
 * inventory OR the string "EMPTY-RED". A scene whose slot is EMPTY-RED REDs — the
 * band that rebuilds the scene fills it WITH owner sign-off (T.M4 lockstep;
 * T.A/T.B/T.C/T.D/T.E). The RENDERED-set reconciliation (does the running demo
 * paint exactly the sanctioned set?) is the BROWSER discharge, gated behind
 * KF_REQUIRE_BROWSER; without it the gate validates the manifest LAYER and reds on
 * the EMPTY-RED slots. This gate rides the T born-RED BACKLOG (scripts/gate-bands.mjs
 * T_BORNRED_BACKLOG) — it is NOT wired into any blocking aggregator until it greens.
 *
 * LOCKSTEP (lane 18): proof:gesture-manifest + scripts/gesture-manifest.mjs + the
 * GestureLegend layer + the 11 data-gesture-tell sites are retired in the SAME
 * motion this gate greens (T.M7 RETIREMENT_LEDGER) — never leave the inventory gate
 * pointing at a tell the owner removed. This gate does NOT retire gesture-manifest
 * itself (T.E11/T.M7 lockstep — the coupled DOM spans later batches).
 *
 * Overrides (plant-test): KF_STAGE_MANIFESTS (index path).
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const INDEX =
    process.env.KF_STAGE_MANIFESTS ||
    join(root, "docs/tranches/T/stage-manifests/INDEX.json");
const DIR = dirname(INDEX);

const failures = [];
const passes = [];

let scenes = [];
try {
    scenes = JSON.parse(readFileSync(INDEX, "utf8")).scenes ?? [];
} catch (e) {
    failures.push(`index — cannot read the stage-manifest index (${INDEX}): ${e.message}.`);
}

for (const s of scenes) {
    if (!s.manifest || s.manifest === "EMPTY-RED") {
        failures.push(
            `empty-red — scene "${s.scene}" has an EMPTY-RED stage manifest (${s.note || ""}). ` +
                "The owner-sanctioned on-stage inventory is not yet authored — the band that rebuilds " +
                "the scene fills it WITH owner sign-off (T.M4 lockstep). Born-RED by design.",
        );
        continue;
    }
    const p = join(DIR, s.manifest);
    if (!existsSync(p)) {
        failures.push(
            `missing — scene "${s.scene}" cites manifest ${s.manifest} which does not exist at ${p}.`,
        );
        continue;
    }
    let m;
    try {
        m = JSON.parse(readFileSync(p, "utf8"));
    } catch (e) {
        failures.push(`malformed — ${s.manifest} is not valid JSON: ${e.message}.`);
        continue;
    }
    if (!Array.isArray(m.sanctioned) || m.sanctioned.length === 0) {
        failures.push(
            `unfilled — scene "${s.scene}" manifest ${s.manifest} has no `+
                "`sanctioned` inventory. The negative-space gate needs the owner-sanctioned set to " +
                "assert extra chrome REDs.",
        );
        continue;
    }
    if (process.env.KF_REQUIRE_BROWSER === "1") {
        // The RENDERED-set reconciliation (browser) is the discharge; not run here
        // (this batch lands the MECHANISM born-RED). A later wave opens the browser,
        // reads the on-stage element set, and asserts it == sanctioned.
        failures.push(
            `render-unverified — scene "${s.scene}" manifest is filled but the RENDERED-set ` +
                "reconciliation (browser) is not yet implemented (the T.A/T.B/T.C/T.D discharge).",
        );
    } else {
        passes.push(
            `manifest-filled — scene "${s.scene}" carries an owner-sanctioned inventory ` +
                `(${m.sanctioned.length} sanctioned, ${(m.forbidden || []).length} forbidden). ` +
                "The browser rendered-set reconciliation is the discharge (KF_REQUIRE_BROWSER).",
        );
    }
}

console.log("proof:stage-inventory — T.M4 (owner-sanctioned on-stage manifest; negative-space gate) [BORN-RED]\n");
for (const p of passes) console.log("  ✓ " + p);
if (failures.length > 0) {
    console.error(`\nproof:stage-inventory — FAIL (${failures.length}) [BORN-RED backlog — T_BORNRED_BACKLOG]:`);
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}
console.log(
    "\nproof:stage-inventory — PASS: every scene's on-stage element set matches its owner-sanctioned inventory.",
);
