#!/usr/bin/env node
/**
 * proof:owner-review-gate — T.M2 (lane 26 rec 1 / lane 28 rec 2).
 *
 * The design-wave CLOSE contract, made structural + moved UPSTREAM to
 * gate-AUTHORING time. lane 26's core mechanism: a born-RED gate is the
 * CRYSTALLISATION point of a disposition — for a DESIGN wave it is a
 * taste-manufacturing machine. Authoring proof:gesture-manifest FIXED "every
 * affordance must have an on-stage legend"; the fan-out then drove to 100%
 * convergence — i.e. drove to the owner-REJECTED state, at scale, provably. The
 * S.E shelf lesson ("critic consensus ≠ owner verdict; put the owner review inside
 * the design loop") made a MACHINE fact.
 *
 * TWO TEETH:
 *  (a) PRE-AUTHORING sign-off — the OD register (docs/tranches/T/OWNER-DECISIONS.md)
 *      is the data source: a design wave's born-RED ORACLE may NOT exist in
 *      package.json until its OD row carries an owner TOKEN. A proof:easing-gallery
 *      key existing today REDs the gate (OD-7 is PENDING-OWNER). This enforces
 *      charter §3 (the OD rows) — "no design wave's born-RED oracle is authored
 *      until its OD row carries an owner token."
 *  (b) CONVERGENCE ≠ SUFFICIENT — a design/appearance/interaction wave marked CLOSED
 *      without a paired owner-review token (a FILLED verdict artifact, T.M1) REDs:
 *      critic-convergence + a green born-RED oracle is NECESSARY but NOT SUFFICIENT
 *      to close a design wave.
 *
 *  The disjunctive-spec trap (lane 26 F4): a "fix-OR-remove" oracle may not close on
 *  the REMOVE branch without an owner token that removal is the intended disposition.
 *  A manifest wave may declare `disjunctive: true`; closing it without an owner token
 *  REDs (the square oracle offered fix-OR-remove and the impl took remove, which the
 *  oracle then certified).
 *
 * Pure static read. Overrides (plant-test): KF_APPEARANCE_WAVES, KF_OWNER_DECISIONS,
 * KF_PROGRESS_MD, KF_VERDICTS_DIR, KF_PKG.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST =
    process.env.KF_APPEARANCE_WAVES ||
    join(root, "docs/tranches/T/verdicts/APPEARANCE-WAVES.json");
const OD =
    process.env.KF_OWNER_DECISIONS ||
    join(root, "docs/tranches/T/OWNER-DECISIONS.md");
const PROGRESS =
    process.env.KF_PROGRESS_MD || join(root, "docs/tranches/T/PROGRESS.md");
const VERDICTS_DIR =
    process.env.KF_VERDICTS_DIR || join(root, "docs/tranches/T/verdicts");
const PKG = process.env.KF_PKG || join(root, "package.json");

const failures = [];
const passes = [];

const read = (p) => {
    try {
        return readFileSync(p, "utf8");
    } catch (e) {
        failures.push(`read — cannot read ${p}: ${e.message}.`);
        return "";
    }
};

const manifest = (() => {
    try {
        return JSON.parse(read(MANIFEST)).waves ?? [];
    } catch (e) {
        failures.push(`manifest — ${MANIFEST} is not valid JSON: ${e.message}.`);
        return [];
    }
})();
const odDoc = read(OD);
const board = read(PROGRESS);
const pkg = (() => {
    try {
        return JSON.parse(read(PKG));
    } catch {
        return { scripts: {} };
    }
})();
const scripts = pkg.scripts ?? {};

// ── OD token detection ────────────────────────────────────────────────────────
// An OD row carries a token iff its register-table row (| **OD-X** | … |) resolves
// to a RULED/APPROVED ruling AND does NOT say PENDING-OWNER. OD-7 today is
// PENDING-OWNER (the ONE pending row); OD-1..6 carry ✅ RULED/APPROVED tokens.
function odHasToken(odId) {
    const rowRe = new RegExp(`^\\|\\s*\\*\\*${odId}\\*\\*\\s*\\|.*$`, "im");
    const m = odDoc.match(rowRe);
    const cell = m ? m[0] : "";
    if (!cell) return { known: false };
    const pending = /PENDING-OWNER/i.test(cell);
    const ruled = /(RULED|APPROVED|✅)/i.test(cell);
    return { known: true, token: ruled && !pending };
}

// ── the CLOSED-wave signal ────────────────────────────────────────────────────
const CLOSE = /\b(CLOSED|LANDED)\b/;
const isClosed = (id) =>
    board.split("\n").some((l) => l.includes(id) && CLOSE.test(l));

const PLACEHOLDER = /\b(PENDING|TBD|___|FIXME)\b/i;
function verdictFilled(id) {
    const art = join(VERDICTS_DIR, `${id}.md`);
    if (!existsSync(art)) return false;
    const md = readFileSync(art, "utf8");
    const hasOwner = /\*\*?Owner\s*\([^)]+\)[^"]*"[^"]+"/i.test(md);
    const disp = md.match(/^\s*Disposition:\s*(APPROVED|REJECTED)\b/im);
    return hasOwner && disp && !PLACEHOLDER.test(disp[0]);
}

// ── tooth (a): oracle-exists-while-OD-pending ─────────────────────────────────
if (failures.length === 0 && manifest.length > 0) {
    let toothAViolations = 0;
    for (const w of manifest) {
        if (!w.oracle || !w.od) continue;
        const oracleLive = w.oracle in scripts;
        const { known, token } = odHasToken(w.od);
        if (!known) {
            failures.push(
                `od-unknown — wave ${w.id} cites OD row ${w.od}, but that row is not found in ` +
                    `${OD}. The enforcement surface cannot bind a wave to a missing OD row.`,
            );
            continue;
        }
        if (oracleLive && !token) {
            toothAViolations++;
            failures.push(
                `pre-authoring (T.M2 a) — the design oracle \`${w.oracle}\` (wave ${w.id}) EXISTS in ` +
                    `package.json while its OD row ${w.od} is still PENDING-OWNER. A design wave's ` +
                    "born-RED oracle may NOT be authored until its OD row carries an owner token " +
                    "(charter §3; the S.E lesson moved upstream — the divergence is baked the moment " +
                    "the gate exists).",
            );
        }
    }
    if (toothAViolations === 0) {
        const pendingOracles = manifest
            .filter((w) => w.oracle && w.od && odHasToken(w.od).known && !odHasToken(w.od).token)
            .map((w) => `${w.oracle}⊣${w.od}`);
        passes.push(
            `pre-authoring (T.M2 a) — no design oracle exists ahead of its OD token ` +
                `(${pendingOracles.length} still-gated oracle(s) correctly ABSENT: ` +
                `${pendingOracles.join(", ") || "none"}).`,
        );
    }
}

// ── tooth (b): closed-without-owner-token + disjunctive-spec trap ─────────────
if (failures.length === 0 && manifest.length > 0) {
    const closed = manifest.filter((w) => isClosed(w.id));
    let toothBViolations = 0;
    for (const w of closed) {
        const token = verdictFilled(w.id) || (w.od && odHasToken(w.od).token);
        if (!token) {
            toothBViolations++;
            failures.push(
                `convergence≠sufficient (T.M2 b) — design wave ${w.id} is CLOSED with NO paired ` +
                    "owner-review token (neither a FILLED verdict artifact nor a ruled OD row). " +
                    "Critic-convergence + a green born-RED oracle is NECESSARY but NOT SUFFICIENT " +
                    "to close a design wave (the S.E shelf lesson, structural).",
            );
        } else if (w.disjunctive && !verdictFilled(w.id)) {
            toothBViolations++;
            failures.push(
                `disjunctive-trap (T.M2) — design wave ${w.id} is a fix-OR-remove disjunctive spec ` +
                    "closed with NO owner token that the taken branch is the intended disposition. A " +
                    "fix-OR-remove oracle may not self-certify the remove branch (lane 26 F4).",
            );
        }
    }
    if (toothBViolations === 0) {
        passes.push(
            `convergence≠sufficient (T.M2 b) — every CLOSED design wave (${closed.length}) carries a ` +
                "paired owner-review token; no disjunctive spec self-certified a branch.",
        );
    }
}

// ── report ────────────────────────────────────────────────────────────────────
console.log(
    "proof:owner-review-gate — T.M2 (pre-authoring taste sign-off + convergence≠sufficient)\n",
);
for (const p of passes) console.log("  ✓ " + p);
if (failures.length > 0) {
    console.error(`\nproof:owner-review-gate — FAIL (${failures.length}):`);
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}
console.log(
    "\nproof:owner-review-gate — PASS: no design oracle precedes its OD token; every closed design " +
        "wave carries a paired owner-review token (the design-wave contract holds both ways).",
);
