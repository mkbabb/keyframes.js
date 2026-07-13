#!/usr/bin/env node
/**
 * proof:glass-ui-gap-tripwire — T.H1 (the glass-ui gap ledger version TRIPWIRE).
 *
 * The generalized register over demo/glass-ui-gaps.ts. It reads the registry's
 * latest published @mkbabb/glass-ui version/dist + the `glassCaps` probe (the SINGLE source
 * scripts/lib/glass-caps.mjs — the SAME probe proof:workaround-deletion reads,
 * never a second copy) and enforces two clauses:
 *
 *   CLAUSE A (the version tripwire — the self-justifying-carry killer): for each
 *     ledger entry with a `glassCap` + workaround site(s), when the cap is
 *     SATISFIED in the latest published dist AND a workaround site still exists ⇒
 *     RED. The excision is now SAFE and OVERDUE. If the registry probe is
 *     unavailable, the result is explicitly PENDING (installed 4.0.x is never a
 *     substitute), so a cure in an unreachable minor cannot stay invisible.
 *
 *   CLAUSE B (lane-25 rec 2 — the deleted-primitive replacement rule): every
 *     workaround site the ledger names MUST cite its ledger entry (a `GLASSUI-GAP:`
 *     marker naming the entry id) OR import @mkbabb/glass-ui. A replacement site
 *     with NEITHER reds — no band-aid escapes the ledger.
 *
 * DEVICE-INDEPENDENT (pure filesystem + dist-content grep, no browser, no timing):
 *   node scripts/proof-glass-ui-gap-tripwire.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
    glassCaps,
    glassCapsMeta,
} from "./lib/glass-caps.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const LEDGER = join(root, "demo/glass-ui-gaps.ts");

const failures = [];
const passes = [];

console.log(
    "proof:glass-ui-gap-tripwire — T.H1 (the glass-ui gap ledger version tripwire)\n",
);

// ── (0) the ledger file is present (born-RED on absence — the pin-ledger idiom) ──
if (!existsSync(LEDGER)) {
    console.error(
        "  ✗ ledger-present — demo/glass-ui-gaps.ts ABSENT. The gap ledger + version " +
            "tripwire cannot run (T.H1 born-RED-on-absent-ledger).",
    );
    console.error("\nproof:glass-ui-gap-tripwire — FAIL: the ledger is absent.");
    process.exit(1);
}
const ledgerSrc = readFileSync(LEDGER, "utf8");

// ── parse the registry entries from the .ts source (the gate is .mjs; it reads the
//    single-source .ts as text and extracts each entry's glassCap + sites) ────────
function parseLedger(src) {
    const objStart = src.indexOf("export const GLASS_UI_GAPS = {");
    if (objStart === -1) return [];
    const body = src.slice(objStart);
    const end = body.indexOf("} as const");
    const scope = end === -1 ? body : body.slice(0, end);
    // Each entry is a 4-space-indented `<id>: {` block. Split on those heads.
    const heads = [...scope.matchAll(/\n {4}(\w+):\s*\{/g)];
    const entries = [];
    for (let i = 0; i < heads.length; i++) {
        const id = heads[i][1];
        const from = heads[i].index;
        const to = i + 1 < heads.length ? heads[i + 1].index : scope.length;
        const block = scope.slice(from, to);
        const capM = block.match(/glassCap:\s*(null|"([^"]+)")/);
        const glassCap = capM ? (capM[1] === "null" ? null : capM[2]) : null;
        const askM = block.match(/ask:\s*"([^"]+)"/);
        const ask = askM ? askM[1] : "(unknown)";
        const sitesM = block.match(/workaroundSites:\s*\[([\s\S]*?)\]/);
        const workaroundSites = sitesM
            ? [...sitesM[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
            : [];
        entries.push({ id, glassCap, ask, workaroundSites });
    }
    return entries;
}

const entries = parseLedger(ledgerSrc);
if (entries.length === 0) {
    console.error(
        "  ✗ ledger-parse — demo/glass-ui-gaps.ts carries NO GLASS_UI_GAPS entries " +
            "(the parse found zero). The registry shape drifted.",
    );
    console.error("\nproof:glass-ui-gap-tripwire — FAIL: the ledger parsed empty.");
    process.exit(1);
}

console.log(
    `  · published latest @mkbabb/glass-ui ${glassCapsMeta.latestVersion ?? "(unavailable)"} ` +
        `(${glassCapsMeta.state}; source=${glassCapsMeta.source}; ` +
        `consumeEligible=${glassCapsMeta.consumeEligible}) — caps: ` +
        Object.entries(glassCaps)
            .map(([k, v]) => `${k}=${v}`)
            .join("  "),
);
console.log(
    `  · installed diagnostic @mkbabb/glass-ui ${glassCapsMeta.installedVersion ?? "(absent)"} ` +
        `(not used as tripwire authority)`,
);
console.log(`  · ledger: ${entries.length} gap entr(ies)\n`);

const VALID_CAPS = new Set(Object.keys(glassCaps));

// ── CLAUSE A — the version tripwire (cap satisfied ∧ workaround present ⇒ RED) ──
for (const e of entries) {
    if (e.glassCap === null) continue; // recorded no-cap gap — never an arm
    if (!VALID_CAPS.has(e.glassCap)) {
        failures.push(
            `tripwire — ledger entry "${e.id}" names glassCap "${e.glassCap}" that is ` +
                `NOT a computed cap (${[...VALID_CAPS].join(", ")}). A dangling cap key ` +
                "can never fire the tripwire — fix the ledger or add the cap to glass-caps.mjs.",
        );
        continue;
    }
    if (e.workaroundSites.length === 0) continue; // cap but no site — nothing to strand
    const capObserved =
        glassCapsMeta.state === "PUBLISHED" && glassCaps[e.glassCap] === true;
    const capSatisfied = glassCapsMeta.consumeEligible && capObserved;
    const presentSites = e.workaroundSites.filter((s) =>
        existsSync(join(root, s)),
    );
    if (capSatisfied && presentSites.length > 0) {
        failures.push(
            `tripwire (CLAUSE A) — gap "${e.id}" (${e.ask}): glassCaps.${e.glassCap} is ` +
                `SATISFIED in latest published ${glassCapsMeta.latestVersion} dist, ` +
                "but its workaround site(s) still exist: " +
                presentSites.join(", ") +
                ". The excision is now SAFE and OVERDUE — delete the workaround and re-pin " +
                "(this is the version tripwire flipping RED the instant the gap closes).",
        );
    } else {
        passes.push(
            `tripwire (CLAUSE A) — gap "${e.id}" (${e.ask}): arm=${capSatisfied} ` +
                `(glassCaps.${e.glassCap} latestObserved=${capObserved}) — ${
                    capSatisfied
                        ? "workaround already excised"
                        : glassCapsMeta.state !== "PUBLISHED"
                          ? "latest published dist unavailable — PENDING; installed dist ignored"
                          : capObserved && !glassCapsMeta.consumeEligible
                            ? `cap observed in latest ${glassCapsMeta.latestVersion} dist, but consume is held until glass-ui 5.0.0+`
                            : "cure absent from latest published dist (the band-aid is still needed)"
                }.`,
        );
    }
}

// ── CLAUSE B — the deleted-primitive replacement rule (lane-25 rec 2) ──────────
// Every workaround site MUST cite its ledger entry (a `GLASSUI-GAP:` marker naming
// the entry id) OR import @mkbabb/glass-ui. A replacement site with neither reds.
for (const e of entries) {
    for (const site of e.workaroundSites) {
        const abs = join(root, site);
        if (!existsSync(abs)) continue; // absent site → nothing to cite (excised)
        const src = readFileSync(abs, "utf8");
        const citesLedger =
            src.includes("GLASSUI-GAP:") && src.includes(e.id);
        const importsGlassUi = /@mkbabb\/glass-ui/.test(src);
        if (citesLedger || importsGlassUi) {
            passes.push(
                `citation (CLAUSE B) — ${site} cites gap "${e.id}" ` +
                    `(${citesLedger ? "GLASSUI-GAP marker" : "@mkbabb/glass-ui import"}).`,
            );
        } else {
            failures.push(
                `citation (CLAUSE B, lane-25 rec 2) — the workaround site ${site} (gap ` +
                    `"${e.id}") carries NEITHER a \`GLASSUI-GAP: ${e.id}\` ledger citation NOR ` +
                    "an @mkbabb/glass-ui import. A deleted-primitive replacement site must " +
                    "point at its ledger entry so the version tripwire can find it.",
            );
        }
    }
}

// ── report ────────────────────────────────────────────────────────────────────
for (const p of passes) console.log("  ✓ " + p);
if (failures.length > 0) {
    console.error(`\nproof:glass-ui-gap-tripwire — FAIL (${failures.length}):`);
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}
if (glassCapsMeta.state !== "PUBLISHED") {
    console.log(
        "\nproof:glass-ui-gap-tripwire — PENDING: latest published glass-ui dist " +
            "could not be fetched; installed-only evidence was deliberately ignored. " +
            "Re-run with registry access before treating the cap state as current.",
    );
} else if (!glassCapsMeta.consumeEligible) {
    console.log(
        "\nproof:glass-ui-gap-tripwire — PASS (release-held): latest published " +
            `${glassCapsMeta.latestVersion} caps were fetched; any positive cap is ` +
            "recorded as frontier evidence but no 4.x workaround deletion is armed " +
            "until the explicitly held glass-ui 5.0.0+ consume edge is authorized.",
    );
} else {
    console.log(
        "\nproof:glass-ui-gap-tripwire — PASS: no gap's cure is satisfied in the " +
            `latest published ${glassCapsMeta.latestVersion} dist while its workaround survives, ` +
            "and every workaround site cites its ledger entry.",
    );
}
process.exit(0);
