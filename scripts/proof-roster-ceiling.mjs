#!/usr/bin/env node
/**
 * proof:roster-ceiling — T.M8 (lane 24 rec 2 / lane 27 F9/F10).
 *
 * Execute the fold S.A4 declared-but-deferred. S.A4's headline was "190 → ~138
 * immediate → ~120 once the FROZEN fold discharges"; the tree INVERTED to 203+
 * (each altitude band authored MORE structural born-RED oracles). This gate:
 *
 *  (1) COUNT CEILING (BORN-RED backlog) — the total proof:* count must not exceed
 *      ROSTER_CEILING (scripts/gate-bands.mjs). Today ~204 > 120 → RED. This CONVERGES
 *      as M7's ~15 feature-coupled retirements + the FROZEN discharge land; it is a
 *      DECLARED T born-RED backlog row (T_BORNRED_BACKLOG), never a mask.
 *  (2) FROZEN DISCHARGE PROGRESS — reports FROZEN_SET vs DISCHARGE (the fold's
 *      progress; proof:ci-coverage clause 9 enforces the per-key discharge validity).
 *  (3) F9 FOLD — the 3 orphaned S.B6 type-surface gates (engine-subpath-mirror /
 *      no-any-default / dts-rollups-agree) must be wired into a real tier
 *      (proof:library-correctness or proof:hygiene-chain), no longer dev-only orphans
 *      (lane 27 F9). REDs if any of the three is neither a tier member nor still
 *      carries its documented dev-only EXCLUDED reason.
 *
 * The COUNT clause reds by design → this gate rides the T born-RED backlog.
 *
 * Overrides (plant-test): KF_PKG, KF_ROSTER_CEILING.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PKG = process.env.KF_PKG || join(root, "package.json");

const failures = [];
const passes = [];
const notes = [];

const pkg = JSON.parse(readFileSync(PKG, "utf8"));
const scripts = pkg.scripts ?? {};
const proofKeys = Object.keys(scripts).filter((k) => k.startsWith("proof:"));

const { FROZEN_SET, DISCHARGE, ROSTER_CEILING } = await import(
    pathToFileURL(join(root, "scripts/gate-bands.mjs")).href
);
const CEILING = Number(process.env.KF_ROSTER_CEILING || ROSTER_CEILING);

// ── (1) count ceiling (BORN-RED backlog) ──────────────────────────────────────
{
    if (proofKeys.length > CEILING) {
        failures.push(
            `count-ceiling (T.M8.1, BORN-RED backlog) — ${proofKeys.length} proof:* gates exceed the ` +
                `declared roster ceiling of ${CEILING}. S.A4's diet INVERTED (203 at S-close; batch ⑩'s ` +
                "edict fold re-authored it up further). This CONVERGES as the lane-1 easing-terminal " +
                "retirements + crayon + the external-blocked FROZEN discharges land — a declared T born-RED " +
                "backlog row (scripts/gate-bands.mjs T_BORNRED_BACKLOG), not a mask.",
        );
    } else {
        passes.push(
            `count-ceiling (T.M8.1) — ${proofKeys.length} proof:* gates ≤ the roster ceiling ${CEILING}: ` +
                "the diet re-converged.",
        );
    }
}

// ── (2) FROZEN discharge progress (report) ────────────────────────────────────
{
    const dischargedCount = Object.keys(DISCHARGE).length;
    const frozenLive = FROZEN_SET.filter((g) => g in scripts).length;
    const frozenGone = FROZEN_SET.length - frozenLive;
    notes.push(
        `frozen-discharge (T.M8.2) — FROZEN_SET ${FROZEN_SET.length}: ${frozenLive} live, ${frozenGone} ` +
            `discharged/gone; ${dischargedCount} DISCHARGE record(s). Per-key validity is enforced by ` +
            "proof:ci-coverage clause 9 (a FROZEN key deleted without a discharge record REDs there).",
    );
}

// ── (3) F9 fold: the 3 type-surface gates wired into a real tier ──────────────
{
    const F9 = ["proof:engine-subpath-mirror", "proof:no-any-default", "proof:dts-rollups-agree"];
    const lc = String(scripts["proof:library-correctness"] ?? "");
    const hc = String(scripts["proof:hygiene-chain"] ?? "");
    const orphaned = F9.filter(
        (g) => g in scripts && !new RegExp(`\\brun ${g}\\b`).test(lc) && !new RegExp(`\\brun ${g}\\b`).test(hc),
    );
    if (orphaned.length > 0) {
        failures.push(
            "f9-fold (T.M8.3) — the S.B6 type-surface gate(s) " +
                orphaned.join(", ") +
                " are LIVE but wired into NO tier (proof:library-correctness / proof:hygiene-chain) — " +
                "the lane 27 F9 orphans (runnable + passing, never CI-wired). Fold them into a tier.",
        );
    } else {
        const present = F9.filter((g) => g in scripts);
        passes.push(
            `f9-fold (T.M8.3) — the ${present.length} live S.B6 type-surface gate(s) are wired into a ` +
                "tier (no longer dev-only orphans; lane 27 F9 discharged).",
        );
    }
}

// ── report ────────────────────────────────────────────────────────────────────
console.log("proof:roster-ceiling — T.M8 (roster ceiling + FROZEN discharge + F9 fold)\n");
for (const p of passes) console.log("  ✓ " + p);
for (const n of notes) console.log("  · " + n);
if (failures.length > 0) {
    console.error(`\nproof:roster-ceiling — FAIL (${failures.length}):`);
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}
console.log("\nproof:roster-ceiling — PASS: the roster is within ceiling and the F9 orphans are folded.");
