#!/usr/bin/env node
/**
 * proof:chronic-closure — H.W8 S3 (I-3) — THE CHRONIC-CLOSURE META-GATE.
 *
 * The H-born repair (`a-deferred-chronic §2-3`, `_SYNTHESIS-gap-scorecard §0/§6`):
 * four user-visible chronics — cartoon-shadow (D2), φ-hero (D7), mobile (D10),
 * dock (D5) — "exited" the A→G deferred ledger NOT by being SOLVED but by being
 * RE-CLASSIFIED (M1 issue-level close, M2 scope-narrowing, M3 column-migration to
 * HANDOFF). **The P-invariant policed the COLUMN, not the PRODUCT.**
 *
 * This meta-gate makes a bare tag NON-terminal. It parses the COMMITTED chronic
 * table at `docs/tranches/H/PROGRESS.md §"Open deferrals"` — the SINGLE canonical
 * substrate (BLK-2: `H/FINAL.md` does NOT exist until H.WZ; it is parsed
 * ADDITIONALLY only behind an `fs.existsSync` guard; `_SYNTHESIS-deferred-ledger`
 * is descriptive history, NOT the runtime target). For each chronic row it asserts
 * the binding rule:
 *
 *   A chronic exits ONLY with
 *     (a) a passing SYSTEM-property gate, OR
 *     (b) a HANDOFF tag PAIRED with a born-RED kf gate.
 *   A bare HANDOFF tag with no born-RED gate REDS the ledger.
 *
 * Concretely, for each row's "H closure" cell:
 *   (i)   every LOAD-BEARING `proof:*` gate name RESOLVES to an authored script
 *         key in package.json (no dangling name — the M1 paper-close bite) AND is
 *         a member of `proof:all` (so it actually runs green there).
 *   (ii)  every row that carries a HANDOFF closure carries a born-RED `proof:*`
 *         gate name that likewise RESOLVES + runs in `proof:all` (the M3 bite —
 *         a bare HANDOFF with no born-RED gate reds).
 *   (iii) a row with NEITHER a resolvable SYSTEM gate NOR a HANDOFF-paired
 *         born-RED gate REDS.
 *
 * RETIRED-tag exclusion (the harden RETIRED-exclusion rule): a gate name
 * explicitly tagged RETIRED in the row prose (the H.W9 register-collapse names
 * `proof:cartoon-specular-coexist` + `proof:specular-calm` as RETIRED — their
 * subject, the W2 composite, no longer exists) is EXCLUDED from the resolve-or-red
 * set. It is a NARRATIVE reference to a DELETED gate — required to be ABSENT, the
 * DUAL of resolve: a RETIRED-tagged name that STILL resolves in package.json /
 * proof:all REDS (catching a half-done retire).
 *
 * This is the SAME static resolve-or-red mechanism as `proof:idioms` clause-1 +
 * the `proof:brittleness` LISTENER_ALLOWLIST stale-guard — a static parse of a
 * committed table, not a new runtime probe. Exits 1 on any residual. Re-runnable:
 *   npm run proof:chronic-closure
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PROGRESS = path.join(REPO, "docs/tranches/H/PROGRESS.md");
const FINAL = path.join(REPO, "docs/tranches/H/FINAL.md"); // BLK-2: may not exist
const PKG = path.join(REPO, "package.json");

const failures = [];
const fail = (msg) => failures.push(msg);

// ── The authored gate set (the resolve target) ────────────────────────────────
const pkg = JSON.parse(fs.readFileSync(PKG, "utf8"));
const SCRIPTS = pkg.scripts ?? {};
const PROOF_ALL = SCRIPTS["proof:all"] ?? "";
// A gate "RESOLVES" iff `package.json.scripts["proof:<name>"]` exists.
const resolves = (gate) => Object.prototype.hasOwnProperty.call(SCRIPTS, gate);
// A gate "RUNS in proof:all" iff the proof:all chain invokes `npm run <gate>`.
const inProofAll = (gate) =>
    new RegExp(`\\brun ${gate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(PROOF_ALL);

// ── Parse the §"Open deferrals" chronic table from PROGRESS.md ─────────────────
/**
 * Extract the table rows under the `## Open deferrals` heading: the
 * `| Chronic | Prior false-close mode | H closure |` markdown table. Returns an
 * array of { chronic, closure } (the 1st + 3rd cells), skipping the header +
 * separator rows.
 */
function parseChronicTable(file, label) {
    const src = fs.readFileSync(file, "utf8");
    // Isolate the section body from the heading to the next `## ` heading.
    const headIdx = src.search(/^##\s+Open deferrals\s*$/m);
    if (headIdx < 0) {
        fail(`[substrate] ${label} has no "## Open deferrals" section — the meta-gate's parse target is missing`);
        return [];
    }
    const after = src.slice(headIdx);
    const nextHead = after.slice(3).search(/^##\s+/m);
    const section = nextHead < 0 ? after : after.slice(0, nextHead + 3);

    const rows = [];
    for (const line of section.split("\n")) {
        const t = line.trim();
        if (!t.startsWith("|")) continue;
        // Split into cells (drop the leading/trailing empty from the outer pipes).
        const cells = t.split("|").slice(1, -1).map((c) => c.trim());
        if (cells.length < 3) continue;
        // Skip the header row and the |---|---|---| separator.
        if (/^chronic$/i.test(cells[0])) continue;
        if (cells.every((c) => /^:?-{2,}:?$/.test(c) || c === "")) continue;
        rows.push({ chronic: cells[0], mode: cells[1], closure: cells[2] });
    }
    return rows;
}

// `proof:all` is the SUITE name, never a chronic closure gate — exclude it so it
// is neither counted load-bearing nor mis-flagged RETIRED.
const NOT_A_GATE = new Set(["proof:all"]);

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

/**
 * RETIRED names in a cell: a `proof:*` name whose prose tags it RETIRED. The
 * substrate's two retire constructs put the retire-verb DIRECTLY adjacent to a
 * RUN of one or more backtick-names (separated only by `/`, `+`, `,`, "and",
 * whitespace):
 *   • marker-then-run:  "the RETIRED `proof:cartoon-specular-coexist`/`proof:specular-calm`"
 *   • run-then-marker:  "`proof:cartoon-specular-coexist` + `proof:specular-calm` retire"
 *
 * We match a contiguous run of backtick `proof:*` names (the ONLY tokens between
 * them being the list glue) that is IMMEDIATELY preceded OR followed (≤16 glue
 * chars, no intervening prose) by a retire marker. This is tight enough that a
 * load-bearing PAIRED gate one clause away (e.g. `proof:specular-handoff`
 * "unchanged" before a separate RETIRED clause) is NOT swept in. The marker word
 * itself must be a strong retire signal.
 */
function retiredNames(text) {
    const retired = new Set();
    const MARKER = "(?:RETIRED?|retire(?:s|d)?|required ABSENT)";
    // A run: one backtick-name, then zero+ more joined by list-glue.
    const NAME = "`proof:[a-z0-9-]+`";
    const GLUE = "(?:\\s*(?:/|\\+|,|and|the)\\s*)";
    const RUN = `${NAME}(?:${GLUE}${NAME})*`;
    // marker (≤16 glue/words) RUN   |   RUN (≤16 glue/words) marker
    const re = new RegExp(
        `${MARKER}[\\s\\w]{0,16}?(${RUN})|(${RUN})[\\s\\w]{0,16}?${MARKER}`,
        "gi",
    );
    let m;
    while ((m = re.exec(text))) {
        const run = m[1] ?? m[2] ?? "";
        for (const g of gateNames(run)) retired.add(g);
    }
    return retired;
}

/** A cell carries a HANDOFF closure iff the prose tags it HANDOFF / consume-leg. */
function isHandoffClosure(text) {
    return /\bHANDOFF\b|\bconsume-leg\b/i.test(text);
}

// ── Audit one row ─────────────────────────────────────────────────────────────
function auditRow(row, srcLabel) {
    const cell = row.closure;
    const name = row.chronic.replace(/\*\*/g, "").trim();
    const all = gateNames(cell);
    const retired = retiredNames(cell);
    const loadBearing = all.filter((g) => !retired.has(g));

    // (RETIRED dual) — a RETIRED-tagged name MUST be absent from package.json AND
    // proof:all. A RETIRED name that still resolves reds (half-done retire).
    for (const g of retired) {
        if (resolves(g)) {
            fail(
                `[${name}] RETIRED gate \`${g}\` STILL RESOLVES in package.json — ` +
                    `a retired gate must be ABSENT (the dual of resolve). Remove its script key.`,
            );
        }
        if (inProofAll(g)) {
            fail(
                `[${name}] RETIRED gate \`${g}\` is STILL invoked in proof:all — remove it ` +
                    `(a retired gate's subject is deleted; it must not run).`,
            );
        }
    }

    // (iii) a row with NO load-bearing proof:* gate at all reds (nothing to police
    // the product — the bare-tag terminal H.W8 forbids).
    if (loadBearing.length === 0) {
        fail(
            `[${name}] the closure cell names NO load-bearing \`proof:*\` gate (only ` +
                `${retired.size ? "RETIRED names" : "prose"}) — a chronic must exit via a ` +
                `SYSTEM-property gate OR a HANDOFF-paired born-RED gate, never a bare tag.`,
        );
    }

    // (i)/(ii) every load-bearing gate RESOLVES + runs in proof:all (no dangling
    // name — catches the M1 paper-close AND the M3 bare-HANDOFF).
    for (const g of loadBearing) {
        if (!resolves(g)) {
            fail(
                `[${name}] closure gate \`${g}\` does NOT resolve to an authored ` +
                    `package.json script key — a DANGLING reference (the gate the row ` +
                    `cites does not exist; M1 paper-close / M3 bare-HANDOFF bite).`,
            );
        } else if (!inProofAll(g)) {
            fail(
                `[${name}] closure gate \`${g}\` resolves but is NOT a member of ` +
                    `proof:all — it never runs in the suite, so "green in the last ` +
                    `proof:all" cannot hold. Wire it into proof:all.`,
            );
        }
    }

    // (ii) a HANDOFF row must carry a born-RED kf gate that resolves. If the cell
    // is tagged HANDOFF/consume-leg but names NO resolvable proof:* gate, it is a
    // bare HANDOFF — the M3 column-migration-and-forget the meta-gate forbids.
    if (isHandoffClosure(cell)) {
        const resolvable = loadBearing.filter(resolves);
        if (resolvable.length === 0) {
            fail(
                `[${name}] the closure is a HANDOFF/consume-leg but carries NO ` +
                    `resolvable born-RED \`proof:*\` gate — a bare HANDOFF tag is no ` +
                    `longer a terminal (M3). Pair it with a born-RED kf gate.`,
            );
        }
    }

    return { name, loadBearing, retired: [...retired], handoff: isHandoffClosure(cell), src: srcLabel };
}

// ── Run ───────────────────────────────────────────────────────────────────────
const rows = parseChronicTable(PROGRESS, "PROGRESS.md");
if (rows.length === 0 && failures.length === 0) {
    fail("[substrate] parsed ZERO chronic rows from PROGRESS.md §\"Open deferrals\" — refusing to pass vacuously");
}

// The four chronics MUST be present (the substrate is the canonical four-row
// table; a missing chronic is a silent drop — the exact M-mode the gate forbids).
const EXPECTED = [
    { tag: "D2", re: /\bD2\b/ },
    { tag: "D7", re: /\bD7\b/ },
    { tag: "D10", re: /\bD10\b/ },
    { tag: "D5", re: /\bD5\b/ },
];
for (const e of EXPECTED) {
    if (!rows.some((r) => e.re.test(r.chronic))) {
        fail(
            `[coverage] the ${e.tag} chronic row is MISSING from PROGRESS.md §"Open ` +
                `deferrals" — a chronic silently dropped from the table is the exact ` +
                `re-classification escape the meta-gate forbids.`,
        );
    }
}

const audited = rows.map((r) => auditRow(r, "PROGRESS.md"));

// BLK-2 — parse FINAL.md ADDITIONALLY only if it exists (it is authored at H.WZ).
if (fs.existsSync(FINAL)) {
    const finalRows = parseChronicTable(FINAL, "FINAL.md");
    for (const r of finalRows) auditRow(r, "FINAL.md");
}

// ── Report ────────────────────────────────────────────────────────────────────
if (failures.length) {
    console.error("✗ proof:chronic-closure — the chronic ledger is not closed to discipline:\n");
    for (const f of failures) console.error("  ✗ " + f);
    console.error(
        "\n  The binding rule: a chronic exits ONLY with (a) a passing SYSTEM-property\n" +
            "  gate, OR (b) a HANDOFF tag PAIRED with a born-RED kf gate. A bare HANDOFF reds.",
    );
    process.exit(1);
}

console.log("✓ proof:chronic-closure — every chronic exits to discipline (PROGRESS.md §\"Open deferrals\"):");
for (const a of audited) {
    const lb = a.loadBearing.join(", ");
    const ret = a.retired.length ? ` · RETIRED(absent): ${a.retired.join(", ")}` : "";
    const hf = a.handoff ? " · HANDOFF-paired born-RED" : "";
    console.log(`    • ${a.name}\n        load-bearing: ${lb}${hf}${ret}`);
}
