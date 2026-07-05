#!/usr/bin/env node
/**
 * proof:prompt-recap-t — T.M10 (lane 28 §2/§3; T-recs 1/2/3).
 *
 * The FALSIFIABLE TEETH for the born-at-entry, owner-token-bound recap ledger
 * (docs/tranches/T/PROMPT-RECAP.md — a co-authored corpus file; T.M owns the gate,
 * the ROW CONTENT is another author's). Replaces the never-materialized
 * proof:prompt-recap-s. Every recap A→S measured LETTER and self-certified its
 * SPIRIT column by citing a BAND (→ S.G / → S.D / → S.E — the three bands the owner
 * rejected). "The anti-leak column certified the leak." This gate forbids exactly
 * that.
 *
 * FIVE non-vacuity teeth + the recurring-correction-shape row class:
 *  (i)   the ledger is PRESENT (F1 plant — the S recap was scheduled last, never ran).
 *  (ii)  no ADDRESSED row cites a BAND (not an owner-observed token) as its spirit oracle.
 *  (iii) no design/appearance ask cites a GREEN GATE as its spirit oracle ("green was the defect").
 *  (iv)  no verbatim-re-issued precept is ADDRESSED without a post-re-issuance owner token
 *        (the re-issuance census — the 7-clause mandate is in its ~9th verbatim re-issue).
 *  (v)   OWNER-ASKS.md is fully-dispositioned (the inherited S6 clause; the row-4 deadlock
 *        broken by the `→ Tranche T (this ledger)` transfer).
 *  + the RECURRING-CORRECTION-SHAPE register (§5) exists with ≥1 promoted precept + its gate.
 *
 * Overrides (plant-test): KF_PROMPT_RECAP, KF_OWNER_ASKS.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const RECAP =
    process.env.KF_PROMPT_RECAP || join(root, "docs/tranches/T/PROMPT-RECAP.md");
const OWNER_ASKS =
    process.env.KF_OWNER_ASKS || join(root, "docs/tranches/T/OWNER-ASKS.md");

const failures = [];
const passes = [];

// ── (i) ledger present ────────────────────────────────────────────────────────
if (!existsSync(RECAP)) {
    failures.push(
        `(i) ledger-present — the recap ledger is ABSENT (${RECAP}). The S recap was scheduled ` +
            "LAST and never ran (lane 28 F1); T's ledger is born-at-entry. This is the F1 plant.",
    );
    // nothing else is checkable
    report();
}
const md = readFileSync(RECAP, "utf8");

// Table rows across §1..§8. A row is `| a | b | c | ... |`.
const rows = md
    .split("\n")
    .filter((l) => /^\s*\|/.test(l) && !/^\s*\|[\s|:-]+\|?\s*$/.test(l))
    .map((l) => l.split("|").map((c) => c.trim()).filter((_, i, a) => i > 0 && i < a.length - 1));

// ── (ii) no ADDRESSED row cites a BAND as its spirit oracle ───────────────────
{
    const violators = [];
    for (const cells of rows) {
        // find the spirit-status cell: the cell mentioning a status token
        const spirit = cells.find((c) => /ADDRESSED|OWNER-|PENDING-OWNER|RE-ISSUED/.test(c));
        if (!spirit) continue;
        // ADDRESSED (or OWNER-APPROVED) justified by a band → violation. A band
        // citation = `→ Band`, `→ S.G`, `→ S.D`, `→ S.E`, `→ Band X`. The `T home`
        // column legitimately names T waves; we only inspect the SPIRIT cell.
        const isAddressed = /\bADDRESSED\b|OWNER-APPROVED/.test(spirit);
        const citesBand = /→\s*(Band\b|S\.[A-Z])/.test(spirit);
        if (isAddressed && citesBand) violators.push(spirit.slice(0, 80));
    }
    if (violators.length > 0) {
        failures.push(
            "(ii) band-as-oracle — ADDRESSED spirit-status cell(s) citing a BAND (not an owner token) " +
                "as the spirit oracle: " +
                violators.join(" ⋮ ") +
                ". A→S recaps self-certified by citing → S.G / → S.D / → S.E — the bands the owner " +
                "rejected. The spirit column must cite an owner-observed token, never a band (F2 plant).",
        );
    } else {
        passes.push("(ii) band-as-oracle — no ADDRESSED row cites a band as its spirit oracle.");
    }
}

// ── (iii) no design/appearance ask cites a GREEN GATE as its spirit oracle ────
{
    const violators = [];
    for (const cells of rows) {
        const joined = cells.join(" | ");
        const spirit = cells.find((c) => /ADDRESSED|OWNER-|PENDING-OWNER|RE-ISSUED/.test(c));
        if (!spirit) continue;
        // a design/appearance/interaction ask: the row mentions a design surface
        // token OR a T.[ABCDE]/OD- home. A green-gate citation in the SPIRIT cell:
        // `proof:X` coupled with green/exits-0/ADDRESSED — forbidden as a design oracle.
        const isDesign = /\b(hero|dock|theme|font|scene|panel|easing|morph|cursor|aurora|colocat|appearance|design|OD-\d|T\.[ABCDE])/i.test(
            joined,
        );
        const citesGreenGate =
            /`?proof:[a-z0-9-]+`?/.test(spirit) &&
            /\b(green|GREEN|exits?\s*0|ADDRESSED)\b/.test(spirit) &&
            /OWNER-APPROVED|ADDRESSED/.test(spirit);
        if (isDesign && citesGreenGate) violators.push(spirit.slice(0, 80));
    }
    if (violators.length > 0) {
        failures.push(
            "(iii) green-gate-as-design-oracle — design/appearance ask(s) citing a GREEN GATE as the " +
                "spirit oracle: " +
                violators.join(" ⋮ ") +
                ". Green was the defect (lane 26): a green source-shape gate may not stand as a " +
                "design/appearance/interaction spirit oracle — only an owner token can (T.M2 side).",
        );
    } else {
        passes.push(
            "(iii) green-gate-as-design-oracle — no design/appearance ask cites a green gate as its " +
                "spirit oracle.",
        );
    }
}

// ── (iv) re-issuance census: a re-issued precept ADDRESSED w/o an owner token ──
{
    // The §1 standing-mandate rows carry `RE-ISSUED → auto-RED`. A row flipped to
    // ADDRESSED/OWNER-APPROVED must carry a post-re-issuance owner token
    // (`shot:NN` / an owner quote / an OWNER-APPROVED token). A RE-ISSUED precept
    // marked ADDRESSED with NO such token REDs.
    const violators = [];
    for (const cells of rows) {
        const joined = cells.join(" | ");
        if (!/standing|precept|mandate|RE-ISSUED|re-issue/i.test(joined)) continue;
        const spirit = cells.find((c) => /ADDRESSED|OWNER-|RE-ISSUED/.test(c));
        if (!spirit) continue;
        const clearedToAddressed = /\bADDRESSED\b|OWNER-APPROVED/.test(spirit) && !/RE-ISSUED/.test(spirit);
        const hasOwnerToken = /shot:\d|OWNER-APPROVED\s+shot|Owner\s*\(/.test(spirit);
        if (clearedToAddressed && !hasOwnerToken) violators.push(spirit.slice(0, 80));
    }
    if (violators.length > 0) {
        failures.push(
            "(iv) re-issuance-census — a verbatim-re-issued precept is marked ADDRESSED with NO " +
                "post-re-issuance owner token: " +
                violators.join(" ⋮ ") +
                ". The re-issuance IS the falsification (lane 28 F5) — the 7-clause mandate is in its " +
                "~9th re-issue; a precept auto-REDs its ADDRESSED claim until an owner token clears it.",
        );
    } else {
        passes.push(
            "(iv) re-issuance-census — no re-issued precept is ADDRESSED without a post-re-issuance " +
                "owner token (the standing mandate stays honestly auto-RED).",
        );
    }
}

// ── (v) OWNER-ASKS.md fully dispositioned ─────────────────────────────────────
{
    if (!existsSync(OWNER_ASKS)) {
        failures.push(`(v) owner-asks — ${OWNER_ASKS} is ABSENT; the S6 disposition clause cannot green.`);
    } else {
        const asks = readFileSync(OWNER_ASKS, "utf8");
        const askRows = asks
            .split("\n")
            .filter((l) => /^\s*\|\s*\d+\s*\|/.test(l)) // numbered ask rows
            .map((l) => l.split("|").map((c) => c.trim()));
        const undisposed = askRows.filter((cells) => {
            const disp = cells[cells.length - 2] ?? ""; // last content cell
            return !disp || /^(___|—|-)?$/.test(disp) || /\bPENDING-OWNER\b/i.test(disp) || /^\bPENDING\b/i.test(disp);
        });
        if (askRows.length === 0) {
            failures.push("(v) owner-asks — no numbered ask rows parsed from OWNER-ASKS.md.");
        } else if (undisposed.length > 0) {
            failures.push(
                `(v) owner-asks — ${undisposed.length} OWNER-ASKS row(s) are NOT fully dispositioned. ` +
                    "The inherited S6 clause: every owner ask carries a real disposition (the row-4 " +
                    "circular deadlock is broken by the → Tranche T transfer).",
            );
        } else {
            passes.push(
                `(v) owner-asks — all ${askRows.length} OWNER-ASKS row(s) are fully dispositioned.`,
            );
        }
    }
}

// ── the recurring-correction-shape register (§5) ──────────────────────────────
{
    const has5 = /recurring-correction-shape|correction shape/i.test(md);
    const promoted = /owner rejects on taste what the process passes on convergence/i.test(md);
    const gate = /proof:owner-review-gate/i.test(md);
    if (!has5 || !promoted || !gate) {
        failures.push(
            "correction-shape — the §5 recurring-correction-shape register is missing its required " +
                "content (the promoted 'owner rejects on taste what the process passes on convergence' " +
                "precept + its gate proof:owner-review-gate). A ≥2× rejection pattern must be promoted " +
                "to a standing precept with its own gate (lane 28 F4).",
        );
    } else {
        passes.push(
            "correction-shape — the §5 register promotes the ≥2× rejection pattern to a standing " +
                "precept (proof:owner-review-gate).",
        );
    }
}

function report() {
    console.log(
        "proof:prompt-recap-t — T.M10 (the born-OWNER recap gate teeth over PROMPT-RECAP.md)\n",
    );
    for (const p of passes) console.log("  ✓ " + p);
    if (failures.length > 0) {
        console.error(`\nproof:prompt-recap-t — FAIL (${failures.length}):`);
        for (const f of failures) console.error("  ✗ " + f);
        process.exit(1);
    }
    console.log(
        "\nproof:prompt-recap-t — PASS: the recap ledger is present, cites owner tokens (never bands " +
            "or green gates) for its spirit column, keeps the re-issued mandate honestly auto-RED, and " +
            "OWNER-ASKS is fully dispositioned. The anti-leak column cannot certify the leak.",
    );
}
report();
