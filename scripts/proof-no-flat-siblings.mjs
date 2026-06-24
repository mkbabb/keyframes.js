#!/usr/bin/env node
/**
 * proof:no-flat-siblings — the R.W1 directory-partition born-RED gate.
 *
 * Tranche Q branded a "decomposition close" but spawned EIGHT flat hyphenated
 * siblings (`engine-playback.ts`, `group-soa.ts`, `waapi-densify.ts`,
 * `frame-compiler-numeric.ts`, …) instead of real directory sub-modules — and
 * those siblings created 15 circular-import violations (the known-violations
 * baseline). R.W1 promotes every family cluster into the 7-zone directory
 * partition. This gate locks the partition so a future tranche cannot re-spawn a
 * flat hyphenated sibling under the old shape.
 *
 * CLAUSES (each BITES):
 *
 *   1. NO FLAT HYPHENATED SIBLINGS — no `src/animation/*.ts` file survives whose
 *      name matches `<base>-<suffix>.ts` for a zone family base (engine, group,
 *      spring, compile, waapi, frame-compiler, ingest, scroll, sequence) — nor the
 *      camelCase spring drift (`spring[A-Z]*.ts`), `drag-2d.ts`, or `animations.ts`.
 *      Each family is now a DIRECTORY (`physics/spring/`, `engine/`, …).
 *
 *   2. ZONE BARRELS PRESENT — every introduced zone directory (physics,
 *      orchestration, engine, group, compile, resolve, ingest, scroll, presets,
 *      svg) carries an `index.ts` barrel (the single public surface).
 *
 *   3. KNOWN-VIOLATIONS DISSOLVED — the count of entries in
 *      `.dependency-cruiser-known-violations.json` is STRICTLY LESS than the
 *      pre-R.W1 value (15 — the sibling cycles the directory partition dissolves).
 *
 * Plant test (RED-state proof): add `engine-playback.ts` back as a flat file in
 * `src/animation/` (alongside the new `engine/` directory). Run this gate.
 * Clause 1 must RED with `engine-playback.ts` in the violation list. Remove the
 * spurious flat file; confirm GREEN.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ANIM = path.join(REPO, "src/animation");

// The pre-R.W1 known-violations count — the 15 sibling cycles the partition
// dissolves. Clause 3 asserts the live count is STRICTLY less.
const PRE_RW1_KNOWN_VIOLATIONS = 15;

// The flat-hyphenated-sibling pattern: `<base>-<suffix>.ts` for a zone family
// base, plus the camelCase spring drift + the two named singletons.
const FAMILY_BASES = [
    "engine",
    "group",
    "spring",
    "compile",
    "waapi",
    "frame-compiler",
    "ingest",
    "scroll",
    "sequence",
];
const NAMED_SINGLETONS = new Set(["drag-2d.ts", "animations.ts"]);

// Every zone directory must carry an index.ts barrel.
const ZONE_DIRS = [
    "physics",
    "orchestration",
    "engine",
    "group",
    "compile",
    "resolve",
    "ingest",
    "scroll",
    "presets",
    "svg",
];

const failures = [];

// ── 1. NO FLAT HYPHENATED SIBLINGS ─────────────────────────────────────────
const flatFiles = fs
    .readdirSync(ANIM, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith(".ts"))
    .map((e) => e.name);

const offenders = [];
for (const name of flatFiles) {
    if (NAMED_SINGLETONS.has(name)) {
        offenders.push(name);
        continue;
    }
    // camelCase spring drift: springLinearStops.ts / springTimingFunction.ts
    if (/^spring[A-Z][A-Za-z]*\.ts$/.test(name)) {
        offenders.push(name);
        continue;
    }
    // <base>-<suffix>.ts for any family base
    for (const base of FAMILY_BASES) {
        if (new RegExp(`^${base}-[a-z][a-z0-9-]*\\.ts$`).test(name)) {
            offenders.push(name);
            break;
        }
    }
}
if (offenders.length > 0) {
    failures.push(
        "[flat-siblings] these flat-hyphenated-sibling file(s) survive at " +
            "src/animation/ root — promote them into their zone directory " +
            `(physics/spring/, engine/, group/, …): ${offenders.join(", ")}.`,
    );
} else {
    console.log(
        "  ✓ [flat-siblings] no flat-hyphenated zone-family sibling survives at " +
            "src/animation/ root",
    );
}

// ── 2. ZONE BARRELS PRESENT ────────────────────────────────────────────────
const missingBarrels = [];
for (const dir of ZONE_DIRS) {
    const barrel = path.join(ANIM, dir, "index.ts");
    if (!fs.existsSync(barrel)) missingBarrels.push(`${dir}/index.ts`);
}
if (missingBarrels.length > 0) {
    failures.push(
        "[zone-barrels] these zone directories have NO index.ts barrel (the " +
            `single public surface the partition requires): ${missingBarrels.join(", ")}.`,
    );
} else {
    console.log(
        `  ✓ [zone-barrels] all ${ZONE_DIRS.length} zone directories carry an index.ts barrel`,
    );
}

// ── 3. KNOWN-VIOLATIONS DISSOLVED ──────────────────────────────────────────
const baselinePath = path.join(REPO, ".dependency-cruiser-known-violations.json");
let known = [];
try {
    known = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
} catch (e) {
    failures.push(
        `[known-violations] could not read ${path.basename(baselinePath)}: ${e.message}`,
    );
}
const count = Array.isArray(known) ? known.length : Number.NaN;
if (!(count < PRE_RW1_KNOWN_VIOLATIONS)) {
    failures.push(
        `[known-violations] the baseline holds ${count} entries — NOT strictly ` +
            `less than the pre-R.W1 count (${PRE_RW1_KNOWN_VIOLATIONS}). The sibling ` +
            `cycles must DISSOLVE as the families become directories with single ` +
            `barrel imports; never grow the baseline.`,
    );
} else {
    console.log(
        `  ✓ [known-violations] ${count} entries < ${PRE_RW1_KNOWN_VIOLATIONS} ` +
            `(the sibling cycles dissolved)`,
    );
}

if (failures.length > 0) {
    console.error("\nproof:no-flat-siblings — FAIL:");
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}

console.log(
    "\nproof:no-flat-siblings — PASS: the 7-zone directory partition holds — no " +
        "flat-hyphenated sibling survives, every zone carries a barrel, and the " +
        "sibling cycles dissolved (known-violations < 15).",
);
