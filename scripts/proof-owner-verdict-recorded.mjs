#!/usr/bin/env node
/**
 * proof:owner-verdict-recorded — T.M1 (lane 29 rec 1 / lane 24 rec 1).
 *
 * REVIVE K's TASTE-VERDICT as a BLOCKING per-wave gate. K's protocol existed
 * (docs/tranches/K/TASTE-VERDICT.md) and was silently skipped for all of S
 * (docs/tranches/S/*VERDICT* → no matches); the S impl closed all-green with ZERO
 * recorded owner verdict and the owner rejected it on sight. This gate REDs unless
 * every CLOSED appearance/taste wave in the T tranche carries a committed
 * owner-verdict artifact with the Verdict slot FILLED.
 *
 * THE ENABLER OF THE BORN-OWNER CLASS. Its GREEN for a closed appearance wave
 * cannot be reached without a committed owner token — the artifact-presence check
 * itself is a PROCESS fact (a verdict was RECORDED), not a taste judgment; the
 * taste judgment lives in the artifact's Disposition + T.M3's golden.
 *
 * VACUITY: with ZERO closed appearance waves the gate is vacuously GREEN (T has no
 * closed appearance wave yet). It MUST red on a planted token-less closed
 * appearance wave — plant-tested in both directions (see the tail plant-test
 * harness the wave doc cites; run `KF_PROGRESS_MD=… node scripts/proof-owner-verdict-recorded.mjs`).
 *
 * NON-AUTHORITATIVE CORROBORATOR: proof:taste-packet proves only the GENERATOR
 * works ("produces no committed artifact" — its own header). It is explicitly
 * re-declared NON-authoritative for the verdict here; the verdict is the committed
 * owner token in the artifact, nothing else.
 *
 * Pure static read (no browser, no build). Overrides for plant-testing:
 *   KF_APPEARANCE_WAVES  — path to the appearance-wave manifest JSON
 *   KF_PROGRESS_MD       — path to the board (the CLOSED-wave source)
 *   KF_VERDICTS_DIR      — dir holding <wave-id>.md verdict artifacts
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST =
    process.env.KF_APPEARANCE_WAVES ||
    join(root, "docs/tranches/T/verdicts/APPEARANCE-WAVES.json");
const PROGRESS =
    process.env.KF_PROGRESS_MD || join(root, "docs/tranches/T/PROGRESS.md");
const VERDICTS_DIR =
    process.env.KF_VERDICTS_DIR || join(root, "docs/tranches/T/verdicts");

const failures = [];
const passes = [];

// ── the appearance/taste wave set ─────────────────────────────────────────────
let waves = [];
try {
    waves = JSON.parse(readFileSync(MANIFEST, "utf8")).waves ?? [];
} catch (e) {
    failures.push(
        `manifest — cannot read the appearance-wave manifest (${MANIFEST}): ${e.message}. ` +
            "The born-OWNER gate class registry is the named source of which waves require a verdict.",
    );
}

// ── the CLOSED-wave signal from the board ─────────────────────────────────────
let board = "";
try {
    board = readFileSync(PROGRESS, "utf8");
} catch (e) {
    failures.push(`board — cannot read the T board (${PROGRESS}): ${e.message}.`);
}
const CLOSE = /\b(CLOSED|LANDED)\b/;
// A wave W is CLOSED iff a board line names its id AND a close token.
const isClosed = (id) =>
    board
        .split("\n")
        .some((l) => l.includes(id) && CLOSE.test(l));

// ── the FILLED-verdict predicate over an artifact ─────────────────────────────
const PLACEHOLDER = /\b(PENDING|TBD|___|N\/?A|FIXME)\b/i;
function verdictFilled(md) {
    // isolate the "## Verdict" section (from the heading to the next `## ` or EOF)
    const start = md.search(/^##\s*Verdict\b/im);
    let body = md;
    if (start >= 0) {
        const rest = md.slice(start).replace(/^##\s*Verdict\b/i, "");
        const next = rest.search(/^##\s/m);
        body = next >= 0 ? rest.slice(0, next) : rest;
    }
    const hasOwnerToken = /\*\*?Owner\s*\([^)]+\)[^"]*"[^"]+"/i.test(body);
    const disp = body.match(/^\s*Disposition:\s*(APPROVED|REJECTED)\b/im);
    if (!hasOwnerToken) return { ok: false, why: "no committed owner token (Owner (<name>) … \"<verbatim>\")" };
    if (!disp) return { ok: false, why: "no `Disposition: APPROVED|REJECTED` line" };
    // the disposition line itself must not be a placeholder
    if (PLACEHOLDER.test(disp[0])) return { ok: false, why: "Disposition is a placeholder" };
    return { ok: true, disp: disp[1] };
}

// ── the check ─────────────────────────────────────────────────────────────────
if (failures.length === 0) {
    const closed = waves.filter((w) => isClosed(w.id));
    if (closed.length === 0) {
        passes.push(
            `vacuous-green — ZERO closed appearance/taste waves on the T board (of ` +
                `${waves.length} registered). The gate is vacuously green; it REDs the moment ` +
                "any registered appearance wave is marked CLOSED without a FILLED verdict artifact.",
        );
    }
    for (const w of closed) {
        const art = join(VERDICTS_DIR, `${w.id}.md`);
        if (!existsSync(art)) {
            failures.push(
                `verdict-missing — appearance wave ${w.id} ("${w.title}") is CLOSED on the ` +
                    `board but carries NO owner-verdict artifact (${w.id}.md). K's TASTE-VERDICT ` +
                    "protocol is BLOCKING for T — an appearance wave cannot close without a " +
                    "committed, FILLED owner verdict (the S all-green-zero-verdict failure).",
            );
            continue;
        }
        const v = verdictFilled(readFileSync(art, "utf8"));
        if (!v.ok) {
            failures.push(
                `verdict-unfilled — ${w.id}.md exists but its Verdict slot is NOT filled: ${v.why}. ` +
                    "A recorded verdict needs a committed owner token + a real disposition (the process " +
                    "fact T.M1 proves — critic-convergence is not a verdict).",
            );
        } else {
            passes.push(
                `verdict-recorded — ${w.id} ("${w.title}") carries a FILLED owner verdict ` +
                    `(Disposition: ${v.disp}).`,
            );
        }
    }
}

// ── report ────────────────────────────────────────────────────────────────────
console.log(
    "proof:owner-verdict-recorded — T.M1 (K's TASTE-VERDICT revived as a blocking per-wave gate)\n",
);
for (const p of passes) console.log("  ✓ " + p);
if (failures.length > 0) {
    console.error(`\nproof:owner-verdict-recorded — FAIL (${failures.length}):`);
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}
console.log(
    "\nproof:owner-verdict-recorded — PASS: every closed appearance/taste wave carries a committed, " +
        "FILLED owner-verdict artifact (proof:taste-packet is a non-authoritative generator, not the verdict).",
);
