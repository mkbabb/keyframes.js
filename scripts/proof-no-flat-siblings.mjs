#!/usr/bin/env node
/**
 * proof:no-flat-siblings — the R.W1 directory-partition born-RED gate
 * (+ the S.B4 barrel-policy clause; C-5 / a02 F4).
 *
 * Tranche Q branded a "decomposition close" but spawned EIGHT flat hyphenated
 * siblings (`engine-playback.ts`, `group-soa.ts`, `waapi-densify.ts`,
 * `frame-compiler-numeric.ts`, …) instead of real directory sub-modules — and
 * those siblings created 15 circular-import violations (the known-violations
 * baseline). R.W1 promotes every family cluster into the zone directory
 * partition (11 zones as of S.A5 — `waapi.ts` was itself promoted to a
 * `waapi/` directory post-R.W1; fold row 41 caught its ZONE_DIRS omission,
 * the exact same "invisible zone" defect class as the former root inventory).
 * This gate locks the partition so a future tranche cannot re-spawn a
 * flat hyphenated sibling under the old shape.
 *
 * CLAUSES (each BITES):
 *
 *   1. NO FLAT HYPHENATED SIBLINGS — no `src/animation/*.ts` file survives whose
 *      name matches `<base>-<suffix>.ts` for a zone FAMILY base — nor the
 *      camelCase spring drift (`spring[A-Z]*.ts`), `drag-2d.ts`, or `animations.ts`.
 *      The FAMILY set is DERIVED from the directory listing (S.B4 / C-5 — every
 *      sub-directory basename under `src/animation`, so a NEW zone directory
 *      protects its own name with no hand-list to drift); each family is a
 *      DIRECTORY (`physics/spring/`, `engine/`, …), so a `<dir>-<suffix>.ts` flat
 *      file belongs INSIDE that directory.
 *
 *   2. ZONE BARRELS PRESENT — every PUBLIC zone directory (ZONE_DIRS: physics,
 *      orchestration, engine, group, compile, resolve, ingest, scroll, waapi,
 *      presets, svg) carries an `index.ts` barrel (the single public surface).
 *      `internal/` is EXCLUDED from ZONE_DIRS by documented design (C-5): it is
 *      the value.js-free LEAF tier, not a zone — its members are consumed as raw
 *      leaves by DIRECT path (`./internal/leaves`, …), never through a barrel, so
 *      the zero-consumer `internal/index.ts` was DELETED at S.B4 (a20/DIGEST).
 *
 *   3. KNOWN-VIOLATIONS DISSOLVED — the count of entries in
 *      `.dependency-cruiser-known-violations.json` is STRICTLY LESS than the
 *      pre-R.W1 value (15 — the sibling cycles the directory partition dissolves).
 *
 *   4. BARREL POLICY: EXPLICIT-NAMED PUBLIC (S.B4 / a02 F4) — no PUBLIC zone
 *      barrel (any ZONE_DIRS `index.ts`) uses the silent-forwarding `export *
 *      from "./x"` flatten form; `export *` is reserved for the leaf tier. The
 *      explicit-named + `export type` form is the reviewable one: a new/accidental
 *      `export const` in a member file joins the public namespace ONLY through a
 *      reviewed barrel edit. NOTE: `export * as ns from "./x"` is a NAMED
 *      namespace export (the `ns` binding is explicit) and is ALLOWED — only the
 *      bare `export * from` flatten is the violation.
 *
 * Plant tests (RED-state proofs):
 *   - clause 1: add `engine-playback.ts` back as a flat file in `src/animation/`
 *     (alongside `engine/`); clause 1 REDs with it listed. Remove → GREEN.
 *   - clause 4: add `export * from "./drag"` to any ZONE_DIRS barrel; clause 4
 *     REDs with that barrel listed. Remove → GREEN.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ANIM = path.join(REPO, "src/animation");

// The pre-R.W1 known-violations count — the 15 sibling cycles the partition
// dissolves. Clause 3 asserts the live count is STRICTLY less.
const PRE_RW1_KNOWN_VIOLATIONS = 15;

// The flat-hyphenated-sibling FAMILY set is DERIVED from the directory listing
// (S.B4 / C-5 — no hand list): every sub-directory basename under
// `src/animation` (recursively) is a zone-family base, so a `<base>-<suffix>.ts`
// flat file at root belongs inside that directory. Deriving it means a NEW zone
// directory protects its own name automatically. `internal/` is a directory too,
// so `internal-*.ts` at root is (correctly) forbidden as well.
const FAMILY_BASES = (function deriveFamilyBases(root) {
    const bases = new Set();
    (function walk(dir) {
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
            if (!e.isDirectory()) continue;
            bases.add(e.name);
            walk(path.join(dir, e.name));
        }
    })(root);
    return [...bases];
})(ANIM);
const NAMED_SINGLETONS = new Set(["drag-2d.ts", "animations.ts"]);

// Every PUBLIC zone directory must carry an index.ts barrel. `internal/` is
// EXCLUDED by documented design (C-5): it is the value.js-free LEAF tier, not a
// zone — consumed by direct path, never through a barrel (its zero-consumer
// `index.ts` was deleted at S.B4).
const ZONE_DIRS = [
    "physics",
    "orchestration",
    "engine",
    "group",
    "compile",
    "resolve",
    "ingest",
    "scroll",
    "waapi",
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
    if (e.code === "ENOENT") {
        // E8 dissolved the suppression ledger after fixing the cycle class. An
        // absent file is the strongest possible zero-entry witness; do not
        // resurrect a deleted suppression artifact merely to satisfy this
        // historical count clause.
        known = [];
    } else {
        failures.push(
            `[known-violations] could not read ${path.basename(baselinePath)}: ${e.message}`,
        );
    }
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

// ── 4. BARREL POLICY: EXPLICIT-NAMED PUBLIC (S.B4 / a02 F4) ─────────────────
// No PUBLIC zone barrel may use the silent-forwarding `export * from "./x"`
// flatten form (`export * as ns from` — a NAMED namespace export — is allowed).
const STAR_FORWARD_RE = /^\s*export\s+\*\s+from\s+["'][^"']+["']/m;
const starOffenders = [];
for (const dir of ZONE_DIRS) {
    const barrel = path.join(ANIM, dir, "index.ts");
    if (!fs.existsSync(barrel)) continue; // clause 2 already reds a missing barrel
    const lines = fs.readFileSync(barrel, "utf8").split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (STAR_FORWARD_RE.test(lines[i])) {
            starOffenders.push(`${dir}/index.ts:${i + 1} — ${lines[i].trim()}`);
        }
    }
}
if (starOffenders.length > 0) {
    failures.push(
        "[barrel-policy] these PUBLIC zone barrel(s) use the silent-forwarding " +
            "`export * from` flatten form — convert to explicit-named + `export " +
            "type` (the reviewable form; `export * as ns from` is allowed): " +
            starOffenders.join("; ") +
            ". `export *` is reserved for the leaf tier (a02 F4).",
    );
} else {
    console.log(
        "  ✓ [barrel-policy] no PUBLIC zone barrel uses the `export * from` " +
            "flatten form (explicit-named public surface; a02 F4)",
    );
}

if (failures.length > 0) {
    console.error("\nproof:no-flat-siblings — FAIL:");
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}

console.log(
    `\nproof:no-flat-siblings — PASS: the ${ZONE_DIRS.length}-zone directory partition holds — no ` +
        "flat-hyphenated sibling survives (FAMILY derived from the directory " +
        "listing), every public zone carries an explicit-named barrel, the " +
        "sibling cycles dissolved (known-violations < 15), and no public barrel " +
        "uses `export * from` (a02 F4).",
);
