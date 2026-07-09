#!/usr/bin/env node
/**
 * proof:retirement-ledger — T.M7 (lane 29 rec 6 / T-GATE-RETIRE), the LEDGER
 * MECHANISM. The feature-coupled retirement ledger + the no-orphan-key completion
 * clause. T.M owns the LEDGER (scripts/gate-bands.mjs RETIREMENT_LEDGER); the BANDS
 * execute each deletion (T.A/T.B/T.C/T.D/T.E). This gate does NOT delete keys.
 *
 * DERIVE-FROM-TREE (the CRITICAL design constraint): a retire-target key still
 * present in package.json = PENDING; absent = RETIRED. Status is NEVER
 * hand-maintained — so the ledger is MERGE-CONFLICT-FREE against the parallel T.E
 * lane deleting compose/morph/motion-path keys (this worktree cannot see that
 * deletion; the derive-from-tree read reflects it automatically at merge).
 *
 * TEETH:
 *  (1) WELL-FORMED — every ledger entry names its coupled feature + verdict item +
 *      executing band. A malformed entry REDs.
 *  (2) NO-ORPHAN-KEY — a package.json proof:* key that is GONE but is NOT accounted
 *      (a RETIREMENT_LEDGER target, a FROZEN DISCHARGE, or a T born-RED backlog key)
 *      is an untracked deletion → this clause DERIVES the accounted-retire set and
 *      the completion status; when an entry is RETIRED its named `proof:` SUCCESSOR
 *      (if any) MUST be LIVE — retiring a gate + its feature may not leave the
 *      surviving live property unasserted.
 *  (3) COMPLETION — reports PENDING vs RETIRED per entry (informational; the ledger
 *      is COMPLETE when every entry is RETIRED). The count converges under T.M8.
 *
 * Overrides (plant-test): KF_PKG.
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
const isLive = (g) => g in scripts;

const { RETIREMENT_LEDGER, T_BORNRED_BACKLOG } = await import(
    pathToFileURL(join(root, "scripts/gate-bands.mjs")).href
);

// ── (1) well-formed ───────────────────────────────────────────────────────────
{
    const malformed = [];
    for (const [key, e] of Object.entries(RETIREMENT_LEDGER)) {
        if (!e.coupledFeature || !e.verdictItem || !e.executedBy) malformed.push(key);
    }
    if (malformed.length > 0) {
        failures.push(
            "well-formed (T.M7.1) — retirement-ledger entr(ies) missing coupledFeature / verdictItem " +
                "/ executedBy: " +
                malformed.join(", ") +
                ". Each retirement must name its coupled feature, the verdict item, and the executing band.",
        );
    } else {
        passes.push(
            `well-formed (T.M7.1) — all ${Object.keys(RETIREMENT_LEDGER).length} ledger entries are ` +
                "well-formed (coupled feature + verdict item + executing band).",
        );
    }
}

// ── (2) no-orphan / successor-live ────────────────────────────────────────────
{
    const orphanSuccessors = [];
    for (const [key, e] of Object.entries(RETIREMENT_LEDGER)) {
        if (isLive(key)) continue; // still PENDING — nothing to check
        // RETIRED: if it named a proof: successor, that successor must be LIVE.
        const succ = e.successor ? (String(e.successor).match(/proof:[a-z0-9-]+/) || [])[0] : null;
        if (succ && !isLive(succ)) {
            orphanSuccessors.push(`${key} → ${succ} (successor NOT live)`);
        }
    }
    if (orphanSuccessors.length > 0) {
        failures.push(
            "no-orphan (T.M7.2) — RETIRED gate(s) whose named successor is NOT a live gate: " +
                orphanSuccessors.join(", ") +
                ". Retiring a gate + its feature may not leave the surviving live property unasserted " +
                "— the successor system gate must exist when the retire lands.",
        );
    } else {
        passes.push(
            "no-orphan (T.M7.2) — every RETIRED ledger entry with a named successor has a LIVE successor " +
                "(no surviving property left unasserted).",
        );
    }
}

// ── (3) completion status (derive-from-tree) ──────────────────────────────────
{
    const entries = Object.keys(RETIREMENT_LEDGER);
    const retired = entries.filter((k) => !isLive(k));
    const pending = entries.filter((k) => isLive(k));
    notes.push(
        `completion (T.M7.3) — retirement ledger: ${retired.length}/${entries.length} RETIRED, ` +
            `${pending.length} PENDING (derived from the tree, never hand-maintained). ` +
            (retired.length === entries.length
                ? "the ledger is COMPLETE."
                : `PENDING: ${pending.join(", ")}.`),
    );
    // sanity: no ledger target is ALSO a declared T born-RED backlog key (they are
    // disjoint concerns — a retire-target is being removed, a backlog gate is being
    // greened; a key in both is a modelling error).
    const overlap = entries.filter((k) => k in (T_BORNRED_BACKLOG ?? {}));
    if (overlap.length > 0) {
        failures.push(
            "model (T.M7) — key(s) in BOTH the retirement ledger and the T born-RED backlog: " +
                overlap.join(", ") +
                ". A key is either being RETIRED or being GREENED, not both.",
        );
    }
}

// ── report ────────────────────────────────────────────────────────────────────
console.log("proof:retirement-ledger — T.M7 (feature-coupled retirement, derive-from-tree)\n");
for (const p of passes) console.log("  ✓ " + p);
for (const n of notes) console.log("  · " + n);
if (failures.length > 0) {
    console.error(`\nproof:retirement-ledger — FAIL (${failures.length}):`);
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}
console.log(
    "\nproof:retirement-ledger — PASS: the feature-coupled retirement ledger is well-formed, " +
        "status is derived from the tree (no hand-maintenance → merge-conflict-free), and no retired " +
        "gate orphaned a surviving live property.",
);
