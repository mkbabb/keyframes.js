#!/usr/bin/env node
/**
 * proof:dock-elision — T.B5-RENDER (the single-option elision RENDER). BORN-RED → GREEN.
 *
 * ⚠ DOUBLE-HOME FLAG (batch ⑤, parallel lanes). The wave doc double-homes the elision:
 * T.B5 (lane 1) authors the MODEL + an innerText-CENSUS `proof:dock-elision` (the dock's
 * rendered text has no duplicated adjacent token — a DOM/browser assertion); T.C1 RENDERS
 * the zones and asserts the STRUCTURAL absence. This file is T.C1's SOURCE-side elision
 * gate (falsifiable without a browser). If lane 1 lands a browser innerText-census under
 * the SAME key, the orchestrator reconciles at merge (they assert COMPLEMENTARY things —
 * source structure vs rendered text — and may coexist as `proof:dock-elision` [DOM] +
 * this structural check folded into it, or as distinct keys). FLAGGED per the drive
 * clause ("code against the CONTRACT with a local adapter and FLAG it").
 *
 * THE RENDER RULE (VERDICT #17 — the `∿ Spring │ ∿ Spring` dup KILL): a single/zero
 * control-surface or channel renders NOTHING — no node, no flanking separator, no demoted
 * static label. TEETH (STATIC):
 *
 *   E1 — zero STATIC-LABEL nodes: ChromeDock's `dock-static-label`/`soleControlTab` are
 *        DELETED; TransportDock's single-animation `v-else` name span is DELETED.
 *   E2 — the scene-driven selects render ONLY inside their zone-INHABITED guard
 *        (ChromeDock's controls section under `v-if="showControlSection"`; TransportDock's
 *        animation select under `channelZoneKind === 'select'`).
 *   E3 — the section separator rides INSIDE the zone guard (an ABSENT zone renders neither
 *        node NOR separator — no orphan/adjacent hairline), and no LEADING separator.
 *
 * Re-runnable: `node scripts/proof-dock-elision.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const CHROME = path.join(DEMO, "app/dock/ChromeDock.vue");
const TRANSPORT = path.join(
    DEMO,
    "@/components/instrument/transport/TransportDock.vue",
);

const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const fail = (l) => {
    failures.push(l);
    console.error(`  ✗ ${l}`);
};
const stripHtml = (s) => s.replace(/<!--[\s\S]*?-->/g, "");
const chrome = stripHtml(fs.readFileSync(CHROME, "utf8"));
const transport = stripHtml(fs.readFileSync(TRANSPORT, "utf8"));

console.log("proof:dock-elision — T.B5-RENDER (single/zero option ⇒ NOTHING; the #17 dup KILL)\n");

// ── E1 — zero static-label nodes ─────────────────────────────────────────────
{
    const chromeStatic = /dock-static-label/.test(chrome) || /soleControlTab/.test(chrome);
    // TransportDock: no v-else static name span in the EXPANDED region (exclude #collapsed).
    const collapsedAt = transport.indexOf("#collapsed");
    const expanded = collapsedAt === -1 ? transport : transport.slice(0, collapsedAt);
    const transportStatic =
        /v-else[\s\S]{0,80}?{{\s*storedControls\.selectedAnimation\s*}}/.test(expanded);
    if (!chromeStatic && !transportStatic) {
        ok("E1 — zero single-option static-label nodes (ChromeDock dock-static-label/soleControlTab + TransportDock single-animation name span DELETED).");
    } else {
        fail(`E1 — a demoted single-option static label survives (ChromeDock: ${chromeStatic}, TransportDock: ${transportStatic}) — the rejected #17 dup.`);
    }
}

// ── E2 — selects render only inside the zone-inhabited guard ─────────────────
{
    const chromeGuard = /v-if\s*=\s*"\s*showControlSection\s*"/.test(chrome);
    const transportGuard = /v-if\s*=\s*"\s*channelZoneKind\s*===\s*['"]select['"]\s*"/.test(transport);
    if (chromeGuard && transportGuard) {
        ok("E2 — the control/channel selects render ONLY inside their zone-inhabited guard (showControlSection / channelZoneKind === 'select').");
    } else {
        fail(`E2 — a scene-driven select is not zone-guarded (ChromeDock showControlSection: ${chromeGuard}, TransportDock channelZoneKind==='select': ${transportGuard}).`);
    }
}

// ── E3 — section separator inside the zone guard; no leading separator ────────
{
    // ChromeDock: the section DockSeparator sits inside `v-if="showControlSection"`.
    const cSecIdx = chrome.search(/v-if\s*=\s*"\s*showControlSection\s*"/);
    const cSepInSection =
        cSecIdx !== -1 && chrome.slice(cSecIdx, cSecIdx + 300).includes("<DockSeparator");
    // TransportDock: the section DockSeparator sits inside the channel-select guard.
    const tSecIdx = transport.search(/v-if\s*=\s*"\s*channelZoneKind\s*===\s*['"]select['"]\s*"/);
    const tSepInSection =
        tSecIdx !== -1 && transport.slice(tSecIdx, tSecIdx + 300).includes("<DockSeparator");
    // No leading separator (identity/play leads).
    const cSep = chrome.indexOf("<DockSeparator");
    const cLead = chrome.indexOf("<Select");
    const cNoLead = cSep === -1 || (cLead !== -1 && cLead < cSep);
    const tSep = transport.indexOf("<DockSeparator");
    const tPlay = transport.search(/aria-label\s*=\s*"[^"]*Play animation/);
    const tNoLead = tSep === -1 || (tPlay !== -1 && tPlay < tSep);
    if (cSepInSection && tSepInSection && cNoLead && tNoLead) {
        ok("E3 — the section separator rides INSIDE the zone guard (absent zone ⇒ no node + no separator); no leading separator in either dock.");
    } else {
        fail(`E3 — separator placement broke the elision (ChromeDock sep-in-section: ${cSepInSection}/no-lead: ${cNoLead}; TransportDock sep-in-section: ${tSepInSection}/no-lead: ${tNoLead}).`);
    }
}

if (failures.length > 0) {
    console.error(`\nproof:dock-elision — FAIL (${failures.length}): the single-option elision render regressed.`);
    process.exit(1);
}
console.log("\nproof:dock-elision — PASS: single/zero option ⇒ NOTHING (no node, no separator, no demoted static label — the #17 dup is elided).");
