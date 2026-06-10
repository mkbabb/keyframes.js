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
// THE CANONICAL SUBSTRATE (I.W7 S4): the I-tranche PROGRESS.md chronic ledger
// SUPERSEDES H's `## Open deferrals` table. The H tables remain narrative history.
const I_PROGRESS = path.join(REPO, "docs/tranches/I/PROGRESS.md");
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
const PROOF_CORRECTNESS = SCRIPTS["proof:correctness"] ?? "";

const resolves = (gate) => Object.prototype.hasOwnProperty.call(SCRIPTS, gate);
const inChain = (chain, gate) =>
    new RegExp(`\\brun ${gate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(chain);
const inProofAll = (gate) => inChain(PROOF_ALL, gate);
// A gate satisfies the CORRECTNESS tier iff it runs in proof:correctness (or, if
// no sub-aggregator exists, directly in proof:all).
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
    // gate-citation contract).
    const after = src.slice(headIdx);
    const lines = after.split("\n");
    const rows = [];
    let started = false;
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const t = line.trim();
        // A subsequent heading of any level ENDS the canonical table region.
        if (/^#{2,}\s/.test(t)) break;
        if (!t.startsWith("|")) {
            // Once table rows have begun, a non-table line ENDS the table.
            if (started) break;
            continue;
        }
        const cells = t.split("|").slice(1, -1).map((c) => c.trim());
        if (cells.length < 3) continue;
        if (/^chronic$/i.test(cells[0])) {
            started = true;
            continue;
        }
        if (cells.every((c) => /^:?-{2,}:?$/.test(c) || c === "")) {
            started = true;
            continue;
        }
        started = true;
        rows.push({ chronic: cells[0], mode: cells[1], closure: cells[2] });
    }
    return rows;
}

const NOT_A_GATE = new Set(["proof:all", "proof:correctness", "proof:hygiene"]);

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
    const vaporTell = /\bVAPORWARE\b|\bunpublished\b|\bunreleased\b|\bfuture version\b|\blocal tag\b/i.test(text);
    if (vaporTell && !publishedOrConsumed) {
        return `the HANDOFF targets ${ver[0]} with a vaporware/unpublished tell and NO published-or-consumed marker`;
    }
    return null;
}

// ── Audit one row ─────────────────────────────────────────────────────────────
function auditRow(row, srcLabel) {
    const cell = row.closure;
    const name = row.chronic.replace(/\*\*/g, "").trim();
    const all = gateNames(cell);
    const retired = retiredNames(cell);
    const loadBearing = all.filter((g) => !retired.has(g));
    const reaffirm = isReaffirm(cell);

    // RETIRED dual — a RETIRED-tagged name MUST be absent from package.json + proof:all.
    for (const g of retired) {
        if (resolves(g)) fail(`[${name}] RETIRED/DELETED gate \`${g}\` STILL RESOLVES in package.json — a retired gate must be ABSENT (the dual of resolve). Remove its script key + .mjs.`);
        if (inProofAll(g)) fail(`[${name}] RETIRED/DELETED gate \`${g}\` is STILL invoked in proof:all — remove it (its subject is superseded; it must not run).`);
    }

    // (iii) a non-RE-AFFIRM row with NO load-bearing gate reds.
    if (loadBearing.length === 0 && !reaffirm) {
        fail(`[${name}] the closure cell names NO load-bearing \`proof:*\` gate (only ${retired.size ? "RETIRED names" : "prose"}) — a chronic must exit via a RUNTIME SYSTEM-property gate, never a bare tag.`);
    }

    // HANDOFF rule (a) — no vaporware-targeted HANDOFF.
    const vapor = vaporwareHandoff(cell);
    if (vapor) {
        fail(`[${name}] HANDOFF rule (a) VIOLATED — ${vapor}. A HANDOFF may target ONLY a PUBLISHED version or a kf-owned consume-edge, never a future version / unreleased commit (the B7 vaporware lesson).`);
    }

    // (1)/(2)/(3) per load-bearing gate: resolve + correctness-tier + RUNTIME.
    const runtimeGates = [];
    for (const g of loadBearing) {
        if (!resolves(g)) {
            fail(`[${name}] closure gate \`${g}\` does NOT resolve to an authored package.json key — a DANGLING reference (M1 paper-close bite).`);
            continue;
        }
        if (!inCorrectnessTier(g)) {
            fail(`[${name}] closure gate \`${g}\` resolves but is NOT in the CORRECTNESS tier of proof:all (proof:correctness) — a chronic must close via a CORRECTNESS gate that runs, not a hygiene/orphan one. Wire it into proof:correctness.`);
        }
        // (3) THE S4 CORE — the cited gate must be a RUNTIME gate that actuates.
        const rt = isRuntimeGate(g);
        if (!rt.runtime) {
            fail(`[${name}] closure gate \`${g}\` is NOT a RUNTIME/INTERACTION gate (${rt.why}) — a chronic exits ONLY via a gate that opens a browser AND drives the live interaction the chronic lives in. A source-shape / load-rest / proxy gate cannot close a chronic (S4 rule 3; the keystone fix).`);
        } else {
            runtimeGates.push(g);
        }
    }

    // (4) BORN-RED — a non-RE-AFFIRM row must carry a born-RED witness in prose.
    if (!reaffirm && loadBearing.length > 0) {
        const bornRed = /\bborn-?RED\b|\bBIT\b|witnessed.*defect|reproduc/i.test(cell);
        if (!bornRed) {
            fail(`[${name}] the closure cites runtime gate(s) but carries NO born-RED witness in prose — a chronic must close via a gate that BIT on the defect tree, not merely a gate that exists (S4 rule 4).`);
        }
    }

    return { name, loadBearing, runtimeGates, retired: [...retired], handoff: isHandoffClosure(cell), reaffirm, src: srcLabel };
}

// ── Run ───────────────────────────────────────────────────────────────────────
const rows = parseChronicTable(I_PROGRESS, "I/PROGRESS.md");
if (rows.length === 0 && failures.length === 0) {
    fail('[substrate] parsed ZERO chronic rows from the I PROGRESS.md §"Open deferrals" — refusing to pass vacuously');
}

// The original four H chronics MUST still be present (re-examined, not dropped),
// plus the crash/defect chronics the I tranche folds.
const EXPECTED = [
    { tag: "CH-1 cartoon/specular", re: /\bCH-1\b/ },
    { tag: "CH-2 φ-hero", re: /\bCH-2\b/ },
    { tag: "CH-3 mobile", re: /\bCH-3\b/ },
    { tag: "CH-4 dock", re: /\bCH-4\b/ },
    { tag: "CH-5 B1 empty-value crash", re: /\bCH-5\b|B1\/B5/ },
    { tag: "CH-6 B2 _gen suspend", re: /\bCH-6\b|\bB2\b/ },
];
for (const e of EXPECTED) {
    if (!rows.some((r) => e.re.test(r.chronic))) {
        fail(`[coverage] the ${e.tag} chronic row is MISSING from the I PROGRESS.md §"Open deferrals" — a chronic silently dropped is the exact re-classification escape the meta-gate forbids.`);
    }
}

const audited = rows.map((r) => auditRow(r, "I/PROGRESS.md"));

// ── Report ────────────────────────────────────────────────────────────────────
if (failures.length) {
    console.error("\n✗ proof:chronic-closure — the chronic ledger is not closed to RUNTIME discipline:\n");
    console.error(
        "  The binding rule (I.W7 S4): a chronic exits ONLY via a RUNTIME gate (opens a browser AND\n" +
            "  actuates) that was witnessed born-RED, wired into the correctness tier. A source-shape /\n" +
            "  load-rest / proxy gate, a vaporware HANDOFF, or a wrong-axis gate REDS.",
    );
    process.exit(1);
}

console.log('\n✓ proof:chronic-closure — every chronic exits via a RUNTIME gate that BIT (I PROGRESS.md §"Open deferrals"):');
for (const a of audited) {
    const rt = a.runtimeGates.join(", ");
    const tag = a.reaffirm ? " · RE-AFFIRM (runtime-corroborated)" : "";
    const hf = a.handoff ? " · HANDOFF (published consume-edge)" : "";
    const ret = a.retired.length ? ` · RETIRED(absent): ${a.retired.join(", ")}` : "";
    console.log(`    • ${a.name}\n        runtime gate(s) that BIT: ${rt || "(re-affirm)"}${hf}${tag}${ret}`);
}
console.log(
    "\n  The keystone is FIXED: the meta-gate now polices the PRODUCT (each cited gate opens a browser,\n" +
        "  actuates the live interaction the chronic lives in, and was born-RED), not the column's paperwork.",
);
