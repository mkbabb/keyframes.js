#!/usr/bin/env node
/**
 * proof:chronic-closure — Tranche I.W7 S4 (the durability keystone, REWIRED).
 *
 * THE H-ERA KEYSTONE FAILURE (rc-gate-blindspot §3). H built this meta-gate to
 * police the chronics so they could never paper-close again — and made it the SAME
 * source-shape class that caused the original sin: it parsed a markdown TABLE and
 * asserted each cited gate NAME merely RESOLVED to a package.json key + ran in
 * proof:all. It opened no browser, ran no cited gate, and verified nothing about
 * whether any cited gate measures a real product property. A green
 * proof:chronic-closure certified the bureaucracy was tidy while B1–B9 ran live.
 *
 * THE I.W7 REWIRE (S4). The meta-gate now polices the PRODUCT, not the paperwork.
 * It parses the canonical `## Open deferrals` chronic table (the I-tranche
 * PROGRESS.md ledger that SUPERSEDES H's table) and for each row asserts:
 *
 *   (1) RESOLVE — every load-bearing cited `proof:*` gate resolves to an authored
 *       package.json script key (no dangling name — the M1 paper-close bite).
 *   (2) CORRECTNESS-TIER — every load-bearing gate runs in the CORRECTNESS tier of
 *       proof:all (proof:correctness), so "green in the suite" actually holds AND
 *       the closure is satisfied by a correctness gate, not a hygiene one.
 *   (3) RUNTIME — every load-bearing gate's SCRIPT is a RUNTIME/INTERACTION gate:
 *       it opens a browser over the built dist (the lib withPage/withBrowser
 *       lifecycle import — the J.W3 S1 single-sourced harness — OR the inline
 *       serveDist + KF_PLAYWRIGHT_DIR + newContext trio) AND ACTUATES the product
 *       (navToScene SWITCH / page.click / dispatchEvent / page.mouse /
 *       page.keyboard / page.dragAndDrop / PointerEvent / .hover). A
 *       chronic row whose closure cites ONLY a source-shape / load-rest / proxy-
 *       store gate REDS. (This is the S4 core — a chronic exits only via a gate
 *       that drives the live interaction the chronic lives in.)
 *   (4) BORN-RED — every non-RE-AFFIRM row carries a born-RED witness in its prose
 *       (the gate BIT on the defect tree), so a never-RED gate cannot paper-close.
 *
 *   THE TWO NEW HANDOFF RULES:
 *   (a) PUBLISHED-OR-CONSUME-EDGE — a HANDOFF / consume-leg cell may target ONLY a
 *       PUBLISHED version or a kf-owned consume-edge fix; a future version number /
 *       unreleased working-tree commit REDS (the B7 vaporware lesson — a born-RED
 *       parked against glass-ui 3.8.0 that the user never sees never bites).
 *   (b) RIGHT-AXIS — every gate must measure the PIXEL / INTERACTION the user
 *       reports; a SYSTEM gate measuring the wrong axis passes vacuously (the M1
 *       mobile sheet.top-not-bottom, the B9 icons-behind-SPA-fallback, the B8 dock
 *       token-peak-not-frame-budget lessons). This is enforced via the RUNTIME
 *       rule (3): a wrong-axis proxy gate is, by construction, NOT a runtime gate
 *       that actuates the reported interaction, so (3) reds it.
 *
 * RETIRED-tag exclusion: a `proof:*` name explicitly tagged RETIRED/DELETED in the
 * row prose is EXCLUDED from the resolve-or-red set AND required ABSENT from
 * package.json + proof:all (the dual — a retired gate that still resolves reds a
 * half-done retire). The I.W7 census retires/deletes proof:demo-console-clean,
 * proof:dock-morph-settled, proof:no-orphan-specular, proof:specular-handoff,
 * proof:scene-icons, proof:dragscrub-single.
 *
 * ── THE J.WZ SUBSTRATE TRANSITION (the parse target moves I → J in ONE motion) ──
 *
 * Through J's dev + impl phases the authoritative substrate was
 * `I/PROGRESS.md §"Open deferrals"`. At the J close the parse target MOVES to
 * `J/PROGRESS.md §"Open deferrals"` in the SAME motion the J ledger becomes
 * authoritative (`J.WZ.md §S3`). The transition is NOT a vacuous swap — the gate
 * is re-pointed AND its grammar EVOLVED WITH the ledger so it BITES on the new
 * substrate. Two shape facts the J ledger carries the I ledger did not:
 *
 *   • IT IS THE FULL LEDGER, NOT JUST THE CHRONIC SUBSET. The I `## Open deferrals`
 *     table held only chronic rows that ALL close via a runtime gate that BIT. The
 *     J ledger is the complete disposition board: FOLD / VERIFY-ONLY / RE-AFFIRM /
 *     HANDOFF / BOOK / RECORD / KILL / USER-DOMAIN. The runtime-gate-that-BIT
 *     contract (rules 1–4) is meaningful ONLY for the rows that CLOSE via a kf
 *     runtime gate (FOLD-landed + VERIFY-ONLY-TERMINATED chronic rows). The other
 *     bands close by their OWN discipline: a RECORD row is historical, a KILL row is
 *     permanent-reasoned, a USER-DOMAIN row is owner-fired, an OUT/HANDOFF row is
 *     sibling-published-consumed, a BOOK row names a terminal home. The gate reads
 *     the row's DISPOSITION cell and applies the band-appropriate rule — it does NOT
 *     red a KILL/RECORD/USER-DOMAIN row for lacking a kf runtime gate (that would be
 *     a vacuous false-bite, the inverse paperwork failure).
 *
 *   • THE CHRONICITY COLUMN IS A MACHINE-READABLE INTEGER. Every J row leads its
 *     Chronicity cell with an INTEGER tranche-span (`7 (C,D,E,F,G,H,I)`, `3 (D,H,I)`)
 *     the gate reads. The ≥4-tranche EXIT-ONLY mandate (P-invariant-28) is enforced
 *     MECHANICALLY off that integer: a row whose chronicity integer is ≥4 MUST carry
 *     an EXIT-shaped disposition (FOLD/EXIT-ONLY/KILL/RECORD/VERIFY-ONLY-TERMINATED/
 *     a published-consume HANDOFF) — a ≥4-tranche row left as a bare BOOK/MEASURE-
 *     FIRST with no exit REDS (the perpetual-punt the invariant forbids).
 *
 * THE TABLE SHAPE IS READ BY HEADER, NOT BY FIXED INDEX. The I table was 3 columns
 * (chronic | mode | closure); the J table is 6 (Item | Born | Chronicity |
 * Disposition | Owning wave | gate/evidence). The parser locates the chronic-name,
 * chronicity, disposition, and closure-oracle columns by their HEADER text, so the
 * one detector reads both shapes honestly — the grammar evolved WITH the ledger, not
 * a swap that greens vacuously.
 *
 * NO browser, no build — a static read of the chronic table + the gate SCRIPTS +
 * package.json (it is itself HYGIENE-tier: it polices the chronic ROWS' cited
 * gates' SHAPE, complementing proof:gate-is-runtime which polices the GATES' SHAPE).
 * Re-runnable: `node scripts/proof-chronic-closure.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { actuationNamesOf, missingHarnessAnchors } from "./lib/gate-shape.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCRIPTS_DIR = path.join(REPO, "scripts");
// THE CANONICAL SUBSTRATE (R.W8 §S1 — the substrate TRANSITION Q→R): the R-tranche
// PROGRESS.md `## Open deferrals` ledger SUPERSEDES the Q table in the SAME motion the
// R ledger becomes authoritative (the Q→R re-point — the no-skip discipline the
// M.WZ/O.WZ/P.WZ re-points violated; Q re-pointed L→Q directly after that 3-tranche
// skip, and R re-points Q→R atomically at close so the next tranche inherits a GREEN,
// accurate substrate). The R ledger re-states every prior chronic with its R-terminal
// disposition + chronicity integer so none drops across the transition; DM-7 is
// re-stated as an owner-ratified KILL (R.W0 `23a6867`), the dangling
// proof-keyframes-vue-published reference EXCISED. The Q/L/K/J/I/H tables remain
// narrative history. This is the ONE path constant the R close re-points; the grammar
// is unchanged (the R substrate honors the Q flat-table shape + the DM-N coverage
// tokens) so the gate BITES on the R substrate — never a vacuous swap. The R.W8
// substrate transition (re-point Q→R) was proven non-vacuous before this re-point:
// three deliberately-malformed R-ledger rows (a FOLD citing a source-shape gate; a
// HANDOFF targeting an unpublished future version; a ≥4-tranche bare BOOK) RED on the
// three clause shapes, then the clean terminal R ledger GREENed it. The R ledger is
// the authoritative parse target for `proof:chronic-closure` from R.W8 forward.
const CHRONIC_LEDGER = path.join(REPO, "docs/tranches/R/PROGRESS.md");
const PKG = path.join(REPO, "package.json");

const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const note = (l) => console.log(`  · ${l}`);
const fail = (msg) => {
    failures.push(msg);
    console.error(`  ✗ ${msg}`);
};

console.log(
    "proof:chronic-closure — I.W7 S4 (REWIRED): every chronic exits via a RUNTIME gate that BIT — " +
        "opens a browser AND actuates AND was witnessed born-RED — not a source-shape / load-rest / proxy gate",
);

// ── The authored gate set + the tiered chains ─────────────────────────────────
const pkg = JSON.parse(fs.readFileSync(PKG, "utf8"));
const SCRIPTS = pkg.scripts ?? {};
const PROOF_ALL = SCRIPTS["proof:all"] ?? "";
// S.A4 — the actuating "correctness tier" a chronic must close via was RENAMED
// proof:correctness → proof:demo-correctness (the browser-actuator tier; the
// severity re-taxonomy). A chronic closes via a RUNTIME gate that BIT, which lives
// in the demo-correctness tier; retarget here in lockstep with the rename (T7).
const PROOF_CORRECTNESS = SCRIPTS["proof:demo-correctness"] ?? "";

const resolves = (gate) => Object.prototype.hasOwnProperty.call(SCRIPTS, gate);
const inChain = (chain, gate) =>
    new RegExp(`\\brun ${gate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(chain);
const inProofAll = (gate) => inChain(PROOF_ALL, gate);
// A gate satisfies the CORRECTNESS tier iff it runs in proof:demo-correctness (the
// S.A4-renamed actuating tier; or, if no sub-aggregator exists, directly in proof:all).
const inCorrectnessTier = (gate) =>
    PROOF_CORRECTNESS ? inChain(PROOF_CORRECTNESS, gate) : inProofAll(gate);

// ── The RUNTIME-gate detection (S4 rule 3) — routed through the ONE lib-aware
//    authority (scripts/lib/gate-shape.mjs), the SAME detector proof:gate-is-
//    runtime consumes. The pre-fix form inlined a stale literal trio that did
//    not know the J.W3 S1 lib lifecycle: every correctly-MIGRATED cited gate
//    "failed" the signature — a detector break, not a product finding. The two
//    meta-gates may never drift apart again: one authority, imported by both. ──
function scriptSrcFor(gate) {
    const body = SCRIPTS[gate];
    if (!body) return null;
    const m = body.match(/scripts\/(proof-[a-z0-9-]+\.mjs)/i);
    if (!m) return null;
    const sp = path.join(SCRIPTS_DIR, m[1]);
    return fs.existsSync(sp) ? fs.readFileSync(sp, "utf8") : null;
}

/** Is `gate`'s script a RUNTIME gate that ACTUATES? Returns { runtime, why }. */
function isRuntimeGate(gate) {
    const src = scriptSrcFor(gate);
    if (src == null) return { runtime: false, why: "no readable scripts/proof-*.mjs script" };
    const missingHarness = missingHarnessAnchors(src);
    if (missingHarness.length > 0) return { runtime: false, why: "no browser harness (neither the lib withPage/withBrowser lifecycle import nor the inline serveDist + KF_PLAYWRIGHT_DIR + newContext trio) — a jsdom unit / source grep" };
    const actuates = actuationNamesOf(src).length > 0;
    if (!actuates) return { runtime: false, why: "opens a browser but does NOT actuate (goto+rest load-rest oracle)" };
    return { runtime: true, why: "browser harness + actuates" };
}

// ── Header-aware column resolution (the I 3-col AND the J 6-col shape) ──────────
// The I table headers: Chronic | Prior false-close mode | closure (RUNTIME gate).
// The J table headers: Item | Born | Chronicity | Disposition | Owning wave |
//   The gate / evidence (the closure oracle).
// The parser locates each semantic column by HEADER text so the ONE detector reads
// both shapes — the grammar evolved WITH the ledger, not a fixed-index swap.
function resolveColumns(headerCells) {
    const find = (...res) =>
        headerCells.findIndex((h) => res.some((re) => re.test(h)));
    const chronic = find(/\bchronic\b/i, /\bitem\b/i, /\bdeferral\b/i);
    const disposition = find(/\bdisposition\b/i);
    // The closure oracle: prefer an explicit "gate / evidence" / "closure" header;
    // else (the I 3-col shape) it is the LAST column.
    let closure = find(/gate\s*\/\s*evidence/i, /\bclosure\b/i, /closure oracle/i);
    if (closure < 0) closure = headerCells.length - 1;
    const chronicity = find(/\bchronicity\b/i); // J-only; -1 in the I shape.
    return {
        chronic: chronic < 0 ? 0 : chronic,
        disposition, // -1 in the I shape — band rules degrade gracefully
        closure,
        chronicity,
    };
}

// ── Parse the canonical `## Open deferrals` chronic table ──────────────────────
function parseChronicTable(file, label) {
    const src = fs.readFileSync(file, "utf8");
    const headIdx = src.search(/^##\s+Open deferrals\s*$/m);
    if (headIdx < 0) {
        fail(`[substrate] ${label} has no "## Open deferrals" section — the meta-gate's parse target is missing`);
        return [];
    }
    // Stop at the NEXT heading of ANY level (`## ` or `### `) — the canonical
    // `## Open deferrals` table is the ONE table immediately under this heading;
    // the §4 narrative 4a–4f tables live under their own `### ` subheadings and
    // are NOT the parse target (they carry the rich live-state probe, not the
    // gate-citation contract). Blockquote lines (`> …`, the SUBSTRATE-TRANSITION
    // NOTE) are narrative and do NOT end the region.
    const after = src.slice(headIdx);
    const lines = after.split("\n");
    const rows = [];
    let started = false;
    let cols = null;
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const t = line.trim();
        // A subsequent heading of any level ENDS the canonical table region.
        if (/^#{2,}\s/.test(t)) break;
        if (!t.startsWith("|")) {
            // Before the table begins, narrative/blockquote lines are skipped.
            // Once table rows have begun, a non-table line ENDS the table.
            if (started) break;
            continue;
        }
        const cells = t.split("|").slice(1, -1).map((c) => c.trim());
        if (cells.length < 3) continue;
        // The header row — resolve the semantic columns by header text.
        if (cols == null && (/^chronic$/i.test(cells[0]) || /\bitem\b/i.test(cells[0]))) {
            cols = resolveColumns(cells);
            started = true;
            continue;
        }
        // The `|---|---|` separator row.
        if (cells.every((c) => /^:?-{2,}:?$/.test(c) || c === "")) {
            started = true;
            continue;
        }
        started = true;
        // Default columns if no header was matched (defensive — I-shape fallback).
        const c = cols ?? { chronic: 0, disposition: -1, closure: cells.length - 1, chronicity: -1 };
        rows.push({
            chronic: cells[c.chronic] ?? "",
            disposition: c.disposition >= 0 ? (cells[c.disposition] ?? "") : "",
            closure: cells[c.closure] ?? "",
            chronicity: c.chronicity >= 0 ? (cells[c.chronicity] ?? "") : "",
        });
    }
    return rows;
}

// ── The Chronicity integer (J shape) — the ≥4-tranche EXIT-ONLY mechanism ───────
/** The leading integer of a Chronicity cell (`7 (C…I)` → 7, `**9 (E…Q)**` → 9);
 * null if none. Markdown emphasis (`*`/`_`) + leading whitespace are stripped first
 * so a bold-wrapped Q cell (`**9 (…)**`) reads its integer — else the ≥4-tranche
 * EXIT-ONLY clause would skip every emphasized row vacuously (the Q-substrate trap). */
function chronicityInt(text) {
    const m = (text ?? "").replace(/^[\s*_]+/, "").match(/^(\d+)\b/);
    return m ? Number(m[1]) : null;
}

// The disposition VOCABULARY (J.WZ §S3 / PROGRESS §"Open deferrals" note). A row's
// band decides which rules bite. A CLOSED-BY-KF-RUNTIME-GATE band (FOLD-landed +
// VERIFY-ONLY) is held to the runtime-gate-that-BIT contract IFF it cites a
// `proof:*` gate; the SIBLING/HISTORICAL/OWNER bands close by their own discipline.
const DISP = {
    fold: (d) => /\bFOLD\b/i.test(d),
    verifyOnly: (d) => /\bVERIFY-?ONLY\b/i.test(d),
    reaffirm: (d) => /\bRE-?AFFIRM\b/i.test(d),
    handoff: (d) => /\bHANDOFF\b|\bOUT\b/i.test(d),
    book: (d) => /\bBOOK\b/i.test(d),
    record: (d) => /\bRECORD\b/i.test(d),
    kill: (d) => /\bKILL\b/i.test(d),
    userDomain: (d) => /\bUSER-?DOMAIN\b/i.test(d),
    exitOnly: (d) => /\bEXIT-?ONLY\b|\bMEASURE-?FIRST\b/i.test(d),
    // EXITED = a row whose landing-wave has already COMMITTED; terminal, sibling band
    // (the gate already ran and BIT; the closure cell is evidence, not a live contract).
    exited: (d) => /\bEXITED\b/i.test(d),
    // BUILD-IN (Q substrate) = a kf-owned ABSOLUTE terminal — the strongest exit
    // shape. The Q ledger uses it on the ≥4-tranche DM-2 (chronicity 9) + DM-22
    // (chronicity 4) rows: a kf-built-and-gated cure is the canonical P-inv-28 exit.
    buildIn: (d) => /\bBUILD-?IN\b/i.test(d),
};

// An EXIT-shaped disposition (satisfies the ≥4-tranche P-invariant-28 mandate). A
// bare BOOK with NO exit/kill/record/handoff/verify marker on a ≥4-tranche row is
// the perpetual punt the invariant forbids.
function isExitShaped(d) {
    if (DISP.kill(d) || DISP.record(d) || DISP.userDomain(d)) return true;
    if (DISP.fold(d) || DISP.verifyOnly(d) || DISP.reaffirm(d)) return true;
    if (DISP.exitOnly(d)) return true;
    // BUILD-IN (Q substrate) — a kf-owned ABSOLUTE terminal IS an exit shape (the
    // strongest one): the cure is built + gated in-realm, no further carry.
    if (DISP.buildIn(d)) return true;
    // A HANDOFF is exit-shaped ONLY when it is sibling-published-consumed (the
    // vaporware check below polices the version-target honesty separately).
    if (DISP.handoff(d)) return true;
    // EXITED = a landed terminal row (the gate already ran + BIT + committed).
    // Exit-shaped: the P-inv-28 mandate is satisfied by the commit landing.
    if (DISP.exited(d)) return true;
    return false;
}

// S.A4 — the aggregator tier names (never cited as a closure GATE). Both the
// pre-S.A4 name (proof:correctness, kept so a legacy prose mention is not mis-read
// as a gate) and the three-tier successors are listed.
const NOT_A_GATE = new Set([
    "proof:all",
    "proof:correctness",
    "proof:demo-correctness",
    "proof:library-correctness",
    "proof:hygiene",
]);

/** All distinct `proof:*` names mentioned in a cell, in order of appearance. */
function gateNames(text) {
    const out = [];
    const re = /`(proof:[a-z0-9-]+)`/gi;
    let m;
    while ((m = re.exec(text))) {
        if (NOT_A_GATE.has(m[1])) continue;
        if (!out.includes(m[1])) out.push(m[1]);
    }
    return out;
}

/** RETIRED/DELETED names in a cell (the dual: required ABSENT). */
function retiredNames(text) {
    const retired = new Set();
    const MARKER = "(?:RETIRED?|retire(?:s|d)?|DELETED?|delete(?:s|d)?|required ABSENT)";
    const NAME = "`proof:[a-z0-9-]+`";
    const GLUE = "(?:\\s*(?:/|\\+|,|and|the|is|was)\\s*)";
    const RUN = `${NAME}(?:${GLUE}${NAME})*`;
    const re = new RegExp(`${MARKER}[\\s\\w]{0,20}?(${RUN})|(${RUN})[\\s\\w]{0,20}?${MARKER}`, "gi");
    let m;
    while ((m = re.exec(text))) {
        const run = m[1] ?? m[2] ?? "";
        for (const g of gateNames(run)) retired.add(g);
    }
    return retired;
}

const isHandoffClosure = (text) => /\bHANDOFF\b|\bconsume-leg\b|\bconsume-edge\b/i.test(text);
const isReaffirm = (text) => /\bRE-?AFFIRM\b/i.test(text);

// HANDOFF rule (a): a HANDOFF cell that targets a FUTURE version number / unreleased
// commit (vaporware) REDS — unless it is explicitly a PUBLISHED version or a kf-owned
// consume-edge. We detect the vaporware shape: a version like "3.8.0"/"v3.8.0" NOT
// paired with a PUBLISHED/consumed marker. The published consume-edge is allowed.
function vaporwareHandoff(text) {
    if (!isHandoffClosure(text)) return null;
    // A version number reference in the cell.
    const ver = text.match(/\bv?\d+\.\d+\.\d+\b/);
    if (!ver) return null;
    const publishedOrConsumed = /\bPUBLISHED\b|\bconsumed\b|\bconsume-edge\b|\bflat default\b|\bbumped?\b/i.test(text);
    // The unpublished tell: the explicit vaporware keywords PLUS the canonical
    // "not yet on npm / on the registry / published" phrasing (a HANDOFF whose
    // sibling target is not yet on the registry IS a vaporware tripwire, not a
    // published-consume-edge — the B7 lesson; the same rule, the canonical phrasing).
    const vaporTell =
        /\bVAPORWARE\b|\bunpublished\b|\bunreleased\b|\bfuture version\b|\blocal tag\b/i.test(text) ||
        /\bnot yet (?:on (?:npm|the registry)|published|on the registry)\b/i.test(text);
    if (vaporTell && !publishedOrConsumed) {
        return `[tripwire] the HANDOFF targets an unpublished sibling version ${ver[0]} — tripwire is not a published-consume-edge`;
    }
    return null;
}

// A band that CLOSES VIA A KF RUNTIME GATE — the rows held to the runtime-gate-that-
// BIT contract (rules 1–4) when they cite a `proof:*` gate. The I substrate held
// ONLY these (every I row was a chronic that closed via a runtime gate); the J
// substrate is the full board and reads the row's disposition to decide the band.
function closesViaKfRuntimeGate(disp) {
    // FOLD-landed and VERIFY-ONLY-TERMINATED rows are kf-owned closures: when they
    // cite a load-bearing `proof:*` gate, that gate is held to the full contract.
    return DISP.fold(disp) || DISP.verifyOnly(disp);
}

// ── Audit one row ─────────────────────────────────────────────────────────────
function auditRow(row, srcLabel) {
    const cell = row.closure;
    const disp = row.disposition || "";
    const name = row.chronic.replace(/\*\*/g, "").replace(/★/g, "").trim();
    const all = gateNames(cell);
    const retired = retiredNames(cell);
    const loadBearing = all.filter((g) => !retired.has(g));
    // The band: on the J substrate the disposition cell decides it; on the legacy
    // I 3-col shape (no disposition column) every row is a runtime-gate closure and
    // the RE-AFFIRM prose tell carries the band, preserving the I behaviour exactly.
    const hasDispColumn = disp.length > 0;
    const reaffirm = hasDispColumn ? DISP.reaffirm(disp) : isReaffirm(cell);
    const runtimeBand = hasDispColumn ? closesViaKfRuntimeGate(disp) : true;
    const chronicity = chronicityInt(row.chronicity);

    // RETIRED dual — a RETIRED-tagged name MUST be absent from package.json + proof:all.
    for (const g of retired) {
        if (resolves(g)) fail(`[${name}] RETIRED/DELETED gate \`${g}\` STILL RESOLVES in package.json — a retired gate must be ABSENT (the dual of resolve). Remove its script key + .mjs.`);
        if (inProofAll(g)) fail(`[${name}] RETIRED/DELETED gate \`${g}\` is STILL invoked in proof:all — remove it (its subject is superseded; it must not run).`);
    }

    // ── The ≥4-tranche EXIT-ONLY mechanism (P-invariant-28, mechanical off the
    //    Chronicity integer; J-substrate only). A row that has ridden ≥4 tranches
    //    MUST carry an EXIT-shaped disposition — a bare BOOK/MEASURE-FIRST with no
    //    exit is the perpetual punt the invariant forbids. ───────────────────────
    if (hasDispColumn && chronicity != null && chronicity >= 4) {
        if (!isExitShaped(disp)) {
            fail(`[${name}] ≥4-tranche row (chronicity ${chronicity}) carries NO EXIT-shaped disposition ("${disp}") — P-invariant-28 forbids a fifth ride; a ≥4-tranche carry must EXIT via FOLD/EXIT-ONLY/KILL/RECORD/VERIFY-ONLY/a published-consume HANDOFF, never a bare BOOK/MEASURE-FIRST.`);
        }
        // A bare BOOK (not also EXIT-ONLY/HANDOFF/RECORD) on a ≥4-tranche row is the
        // exact perpetual punt — the EXIT-shape predicate already reds it, but the
        // MEASURE-FIRST-without-measurement clause is named explicitly:
        if (/\bMEASURE-?FIRST\b/i.test(disp) && !/\bEXIT-?ONLY\b|\bKILL\b|\bLAND\b|\bADOPT\b|\bbench\b|\bmeasured\b/i.test(disp + " " + cell)) {
            fail(`[${name}] ≥4-tranche MEASURE-FIRST row carries NO measurement artifact in its closure — the J close ledger must carry ZERO rows tagged MEASURE-FIRST without a measurement (J.W6 §Goal).`);
        }
    }

    // HANDOFF rule (a) — no vaporware-targeted HANDOFF (applies across bands; a
    // HANDOFF closure targeting a FUTURE/unpublished version reds, the B7 lesson).
    // The check reads the row HOLISTICALLY (disposition + closure together): a
    // `HANDOFF → value.js 3.0.0` disposition with a `not yet on npm` tell in the
    // closure cell is one unpublished-HANDOFF row — the tell may sit in either cell.
    const vapor =
        vaporwareHandoff(cell) ||
        vaporwareHandoff(disp) ||
        vaporwareHandoff(`${disp} ${cell}`);
    if (vapor) {
        fail(`[${name}] HANDOFF rule (a) VIOLATED — ${vapor}. A HANDOFF may target ONLY a PUBLISHED version or a kf-owned consume-edge, never a future version / unreleased commit (the B7 vaporware lesson).`);
    }

    // ── The runtime-gate-that-BIT contract (rules 1–4) — applies to the
    //    KF-RUNTIME-CLOSING bands only. The sibling/historical/owner bands
    //    (RECORD / KILL / USER-DOMAIN / OUT-HANDOFF / BOOK) close by their OWN
    //    discipline and are NOT red for lacking a kf runtime gate. ───────────────
    const runtimeGates = [];
    if (runtimeBand) {
        // A runtime-closing band that names NO load-bearing gate AND is not a bare
        // RE-AFFIRM reds — it must cite the runtime gate that bit. (A FOLD/VERIFY
        // row whose closure is a doc/measurement rather than a kf gate is permitted
        // when the disposition itself names the non-gate mechanism — see below.)
        const nonGateMechanism = /REWRITTEN|tarball|measured|bench|node probe|grep|build root|<title>|drift-gated|relocat|annotation|pointer-only|deleted|typed|removed|UNexported|fixture|corpus/i.test(cell);
        if (loadBearing.length === 0 && !reaffirm && !nonGateMechanism) {
            fail(`[${name}] the closure cell names NO load-bearing \`proof:*\` gate and no non-gate mechanism — a FOLD/VERIFY-ONLY closure must cite the RUNTIME gate that BIT or name its terminal mechanism, never a bare tag.`);
        }
        // (1)/(2)/(3) per load-bearing gate: resolve + correctness-tier + RUNTIME.
        for (const g of loadBearing) {
            if (!resolves(g)) {
                fail(`[${name}] closure gate \`${g}\` does NOT resolve to an authored package.json key — a DANGLING reference (M1 paper-close bite).`);
                continue;
            }
            if (!inCorrectnessTier(g)) {
                fail(`[${name}] closure gate \`${g}\` resolves but is NOT in the DEMO-CORRECTNESS tier of proof:all (proof:demo-correctness — the S.A4-renamed actuating tier) — a chronic must close via a CORRECTNESS gate that runs, not a hygiene/orphan one. Wire it into proof:demo-correctness.`);
            }
            // (3) THE S4 CORE — the cited gate must be a RUNTIME gate that actuates.
            const rt = isRuntimeGate(g);
            if (!rt.runtime) {
                fail(`[${name}] closure gate \`${g}\` is NOT a RUNTIME/INTERACTION gate (${rt.why}) — a chronic exits ONLY via a gate that opens a browser AND drives the live interaction the chronic lives in. A source-shape / load-rest / proxy gate cannot close a chronic (S4 rule 3; the keystone fix).`);
            } else {
                runtimeGates.push(g);
            }
        }
        // (4) BORN-RED — a non-RE-AFFIRM runtime-closing row that cites a gate must
        // carry a born-RED witness in prose.
        if (!reaffirm && runtimeGates.length > 0) {
            const bornRed = /\bborn-?RED\b|\bBIT\b|witnessed.*defect|reproduc|reds? (?:on|today)|red it/i.test(cell);
            if (!bornRed) {
                fail(`[${name}] the closure cites runtime gate(s) but carries NO born-RED witness in prose — a chronic must close via a gate that BIT on the defect tree, not merely a gate that exists (S4 rule 4).`);
            }
        }
    } else {
        // The sibling/historical/owner bands: a cited gate that resolves should
        // still not be a DANGLING reference IF it claims to resolve — but a
        // gate-first BOOK/HANDOFF may name a NOT-YET-AUTHORED kf gate (PT-1's
        // `proof:packrat-position` — "author X first"). Only an UNqualified dangling
        // name (claimed present, absent) reds; a "author X first" is permitted.
        for (const g of loadBearing) {
            const authorFirst = new RegExp(`author\\s+\`?${g.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\`?`, "i").test(cell);
            if (!resolves(g) && !authorFirst) {
                fail(`[${name}] sibling/historical band names \`${g}\` as present but it does NOT resolve — a DANGLING reference. A gate-first HANDOFF must say "author ${g} first"; a RECORD/RE-AFFIRM must cite a gate that exists.`);
            } else if (resolves(g)) {
                runtimeGates.push(g);
            }
        }
    }

    return {
        name,
        disposition: disp,
        chronicity,
        loadBearing,
        runtimeGates,
        retired: [...retired],
        handoff: isHandoffClosure(cell) || DISP.handoff(disp),
        reaffirm,
        runtimeBand,
        src: srcLabel,
    };
}

// ── Run ───────────────────────────────────────────────────────────────────────
const LEDGER_LABEL = "R/PROGRESS.md";
const rows = parseChronicTable(CHRONIC_LEDGER, LEDGER_LABEL);
if (rows.length === 0 && failures.length === 0) {
    fail(`[substrate] parsed ZERO chronic rows from the ${LEDGER_LABEL} §"Open deferrals" — refusing to pass vacuously`);
}

// The crash/defect chronics MUST still be present (re-examined, not dropped) on the
// Q substrate — a chronic silently dropped across the substrate transition is the
// exact re-classification escape the meta-gate exists to forbid. The Q ledger
// (Q.WZ §S1) renamed every L-substrate `CH-N` chronic to its DM-N identity; the
// coverage clause greps the Q DM-N tokens (same no-silent-drop intent, Q vocabulary):
//   CH-1 → DM-9 (specular)  · CH-2 → DM-10 (typography) · CH-3 → DM-11 (mobile)
//   CH-4 → DM-12 (dock)     · CH-5 → DM-13 (empty-value) · CH-6 → DM-14 (DFA-suspend)
//   + scene-control-dfa (DM-15, the net-new I-close chronic, carried unrenamed).
const EXPECTED = [
    { tag: "DM-9 specular (was CH-1)", re: /\bDM-9\b/ },
    { tag: "DM-10 typography (was CH-2)", re: /\bDM-10\b/ },
    { tag: "DM-11 mobile (was CH-3)", re: /\bDM-11\b/ },
    { tag: "DM-12 dock perf (was CH-4)", re: /\bDM-12\b/ },
    { tag: "DM-13 empty-value crash (was CH-5)", re: /\bDM-13\b/ },
    { tag: "DM-14 DFA-suspend (was CH-6)", re: /\bDM-14\b/ },
    { tag: "DM-15 scene-control-dfa (the net-new I-close chronic)", re: /\bDM-15\b|scene-control-dfa/ },
];
for (const e of EXPECTED) {
    if (!rows.some((r) => e.re.test(r.chronic))) {
        fail(`[coverage] the ${e.tag} chronic row is MISSING from the ${LEDGER_LABEL} §"Open deferrals" — a chronic silently dropped across the substrate transition is the exact re-classification escape the meta-gate forbids.`);
    }
}

const audited = rows.map((r) => auditRow(r, LEDGER_LABEL));

// ── Report ────────────────────────────────────────────────────────────────────
if (failures.length) {
    console.error("\n✗ proof:chronic-closure — the chronic ledger is not closed to RUNTIME discipline:\n");
    console.error(
        "  The binding rule (Q.WZ substrate): a kf-runtime-closing row (FOLD/VERIFY-ONLY) exits ONLY via\n" +
            "  a RUNTIME gate (opens a browser AND actuates) that was witnessed born-RED in the correctness\n" +
            "  tier — OR names its terminal non-gate mechanism. A ≥4-tranche row must EXIT (P-invariant-28).\n" +
            "  A source-shape / load-rest / proxy gate, a vaporware HANDOFF, or a wrong-axis gate REDS.",
    );
    process.exit(1);
}

const BAND = (a) => {
    if (a.reaffirm) return "RE-AFFIRM";
    if (!a.runtimeBand) {
        if (DISP.kill(a.disposition)) return "KILL";
        if (DISP.record(a.disposition)) return "RECORD";
        if (DISP.userDomain(a.disposition)) return "USER-DOMAIN";
        if (DISP.handoff(a.disposition)) return "OUT/HANDOFF";
        if (DISP.book(a.disposition)) return "BOOK";
        return "sibling/historical";
    }
    if (DISP.verifyOnly(a.disposition)) return "VERIFY-ONLY";
    return "FOLD";
};

console.log(`\n✓ proof:chronic-closure — the R ledger is TERMINAL; every kf-runtime closure exits via a gate that BIT (${LEDGER_LABEL} §"Open deferrals", ${audited.length} rows):`);
for (const a of audited) {
    const rt = a.runtimeGates.join(", ");
    const ch = a.chronicity != null ? `[${a.chronicity}t] ` : "";
    const ret = a.retired.length ? ` · RETIRED(absent): ${a.retired.join(", ")}` : "";
    const gates = rt ? `\n        gate(s): ${rt}` : "";
    console.log(`    • ${ch}${a.name} — ${BAND(a)}${ret}${gates}`);
}
console.log(
    "\n  The R substrate TRANSITION is non-vacuous: the gate parses the R ledger by header, reads each row's\n" +
        "  DISPOSITION band, holds the FOLD/VERIFY-ONLY rows to the runtime-gate-that-BIT contract, enforces\n" +
        "  the ≥4-tranche EXIT-ONLY mandate off the Chronicity integer, and reds a vaporware HANDOFF — the\n" +
        "  meta-gate polices the PRODUCT on the new substrate, not the column's paperwork.",
);
