#!/usr/bin/env node
/**
 * proof:gate-authority — T.M6 (lane 29 rec 7 / T-GATE-META).
 *
 * Extend the meta-gate taxonomy with the AUTHORITY axis. proof:gate-is-runtime
 * enforces the TIER axis (hygiene/correctness, source/runtime) but is taste-blind
 * by construction ("no 'a human would LIKE' in its universe"). This wave adds the
 * question it never asked: *who blesses appearance and taste, and is that blessing
 * a blocking gate?*
 *
 * Two teeth (over scripts/gate-authority.mjs — the single-source registry):
 *  (1) DECLARATION — every LIVE appearance-touching gate (APPEARANCE_TOUCHING that
 *      resolves to a package.json script) MUST carry a GATE_AUTHORITY declaration ∈
 *      {INSTRUMENT, OWNER}. A gate that touches appearance without an authority
 *      field REDs (zero gates carried a declaration on the S tree — born-RED there;
 *      the registry annotates the retained appearance-touching set mechanically,
 *      greening it on this tree).
 *  (2) BLOCKING-NOT-OBSERVE — an OWNER-authority gate may NOT ride an OBSERVE bucket
 *      (demo-roster OBSERVE_GATES / OBSERVE_IN_CI). This is the MEMORY lesson
 *      "critic consensus ≠ owner verdict" as a machine fact + the "blocking, not
 *      OBSERVE" requirement (lane 29 rec 5 / lane 26 rec 3): a sitewide "god awful"
 *      may not ride non-blocking (VERDICT #19). The perf GATE lives in T.G; the
 *      DOCTRINE (OWNER + blocking) is enforced HERE.
 *
 *  NO instrument gate may stand as the appearance BAR — the registry marks the
 *  retained S appearance gates INSTRUMENT (they assert a correctness fact) and the
 *  born-OWNER T.M gates OWNER (green needs a committed owner token).
 *
 * MERGE-SAFE: a gate RETIRED by a parallel band (absent from package.json) is
 * skipped — the axis shrinks with the roster.
 *
 * Pure static read. Overrides (plant-test): KF_PKG, KF_GATE_AUTHORITY (module path).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, isAbsolute, resolve } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PKG = process.env.KF_PKG || join(root, "package.json");
const AUTHORITY_MODULE = process.env.KF_GATE_AUTHORITY
    ? (isAbsolute(process.env.KF_GATE_AUTHORITY)
          ? process.env.KF_GATE_AUTHORITY
          : resolve(process.cwd(), process.env.KF_GATE_AUTHORITY))
    : join(root, "scripts/gate-authority.mjs");

const failures = [];
const passes = [];

const pkg = JSON.parse(readFileSync(PKG, "utf8"));
const scripts = pkg.scripts ?? {};

const { APPEARANCE_TOUCHING, GATE_AUTHORITY, VALID_AUTHORITIES } = await import(
    pathToFileURL(AUTHORITY_MODULE).href
);
const { OBSERVE_GATES, OBSERVE_IN_CI } = await import(
    pathToFileURL(join(root, "scripts/demo-roster.mjs")).href
);
const observeBucket = new Set([...OBSERVE_GATES, ...OBSERVE_IN_CI]);

// ── tooth (1): declaration for every LIVE appearance-touching gate ────────────
{
    const live = APPEARANCE_TOUCHING.filter((g) => g in scripts);
    const undeclared = live.filter((g) => !(g in GATE_AUTHORITY));
    const invalid = live.filter(
        (g) => g in GATE_AUTHORITY && !VALID_AUTHORITIES.has(GATE_AUTHORITY[g]),
    );
    if (undeclared.length > 0) {
        failures.push(
            "declaration (T.M6.1) — LIVE appearance-touching gate(s) with NO authority " +
                "declaration in scripts/gate-authority.mjs: " +
                undeclared.join(", ") +
                ". Every gate that touches appearance must declare INSTRUMENT or OWNER — a " +
                "taste-blind appearance gate is the S regime's exact hole.",
        );
    }
    if (invalid.length > 0) {
        failures.push(
            "declaration (T.M6.1) — appearance-touching gate(s) with an INVALID authority value: " +
                invalid.map((g) => `${g} ("${GATE_AUTHORITY[g]}")`).join(", ") +
                `. Valid: ${[...VALID_AUTHORITIES].join(" | ")}.`,
        );
    }
    if (undeclared.length === 0 && invalid.length === 0) {
        const owners = live.filter((g) => GATE_AUTHORITY[g] === "OWNER");
        passes.push(
            `declaration (T.M6.1) — all ${live.length} LIVE appearance-touching gate(s) carry a valid ` +
                `authority declaration (${owners.length} OWNER, ${live.length - owners.length} INSTRUMENT). ` +
                "No instrument gate stands unlabelled as the appearance bar.",
        );
    }
}

// ── tooth (2): OWNER authority ⇒ blocking, never OBSERVE ───────────────────────
{
    const owners = APPEARANCE_TOUCHING.filter(
        (g) => g in scripts && GATE_AUTHORITY[g] === "OWNER",
    );
    const demoted = owners.filter((g) => observeBucket.has(g));
    if (demoted.length > 0) {
        failures.push(
            "blocking-not-observe (T.M6.2) — OWNER-authority gate(s) demoted to an OBSERVE " +
                "bucket (demo-roster OBSERVE_GATES / OBSERVE_IN_CI): " +
                demoted.join(", ") +
                ". A taste-authority gate may NOT ride non-blocking — a sitewide 'god awful' " +
                "must block (VERDICT #19; lane 29 rec 5). Perf-frame-budget's OBSERVE demotion " +
                "is the anti-pattern this forbids for OWNER gates.",
        );
    } else {
        passes.push(
            `blocking-not-observe (T.M6.2) — all ${owners.length} OWNER-authority gate(s) are BLOCKING ` +
                "(none rides an OBSERVE bucket). The blocking-not-OBSERVE tooth holds.",
        );
    }
}

// ── report ────────────────────────────────────────────────────────────────────
console.log(
    "proof:gate-authority — T.M6 (the INSTRUMENT/OWNER authority axis + blocking-not-OBSERVE teeth)\n",
);
for (const p of passes) console.log("  ✓ " + p);
if (failures.length > 0) {
    console.error(`\nproof:gate-authority — FAIL (${failures.length}):`);
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}
console.log(
    "\nproof:gate-authority — PASS: every live appearance-touching gate declares its authority " +
        "(INSTRUMENT/OWNER) and every OWNER-authority gate blocks (never OBSERVE). The authority axis " +
        "is machine-enforced beside proof:gate-is-runtime's tier axis.",
);
