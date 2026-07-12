#!/usr/bin/env node
/**
 * proof:dock-grammar — T.C1 (the dock grammar recut) + T.C2 (home census) +
 * T.C4 (serif-deletion grep). BORN-RED → GREEN at the recut.
 *
 * THE META-FACT this band cures (lane 08): the S roster (85/85 green) never looked
 * at a dock's grammar — the owner rejected both docks on sight (VERDICT #4/#6/#17).
 * This gate is the STRUCTURAL half: both docks speak glass-ui's OWN dock grammar
 * (`DockSeparator` between INHABITED zones), NOT hand-cut markup. Falsifiable teeth:
 *
 *   G1 — zero hand-rolled `class="dock-separator"` divs anywhere in demo/ (the
 *        T.H4-subsumed no-hand-rolled-dock-separator rule rides here). A raw hairline
 *        div planted back reds.
 *   G2 — both docks IMPORT + USE glass-ui `<DockSeparator>` (the divider primitive).
 *   G3 — no LEADING separator: the first rendered element in each dock is identity
 *        (ChromeDock: the scene <Select>) / the primary (TransportDock: play), never
 *        a `<DockSeparator>`.
 *   G4 — the serif chrome flip is DELETED (T.C4): no `.dock-label` display-font
 *        override, no `.dock-scene-title` display binding — the dock rides glass-ui's
 *        Jakarta dock-label register (VERDICT #24).
 *   G5 — home = COMPASS ONLY (T.C2): the transport dock MOUNTS iff the scene exposes
 *        ≥1 channel (a channel-count v-if on <TransportDock>), never unconditionally
 *        (shot 06's orphaned home transport cluster).
 *
 * The ELISION (single/zero ⇒ NOTHING) rides proof:dock-elision; the play-first
 * ORDER rides proof:transport-play-first-render (one source of order truth). STATIC.
 * Re-runnable: `node scripts/proof-dock-grammar.mjs`.
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
const ACG = path.join(
    DEMO,
    "@/components/instrument/transport/AnimationControlsGroup.vue",
);
const STYLE = path.join(DEMO, "@/styles/style.css");

const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const fail = (l) => {
    failures.push(l);
    console.error(`  ✗ ${l}`);
};
const read = (p) => fs.readFileSync(p, "utf8");
const stripHtml = (s) => s.replace(/<!--[\s\S]*?-->/g, "");

console.log("proof:dock-grammar — T.C1 the dock grammar recut (glass-ui DockSeparator, inhabited zones)\n");

// Recursively collect demo .vue files.
function vueFiles(dir) {
    const out = [];
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.name === "node_modules" || e.name === "dist") continue;
        const p = path.join(dir, e.name);
        if (e.isDirectory()) out.push(...vueFiles(p));
        else if (e.name.endsWith(".vue")) out.push(p);
    }
    return out;
}

// ── G1 — zero hand-rolled dock-separator divs ────────────────────────────────
{
    const offenders = [];
    for (const f of vueFiles(DEMO)) {
        const src = stripHtml(read(f));
        if (/class\s*=\s*["'][^"']*\bdock-separator\b[^"']*["']/.test(src)) {
            offenders.push(path.relative(REPO, f));
        }
    }
    if (offenders.length === 0) {
        ok("G1 — zero hand-rolled `class=\"dock-separator\"` divs in demo/ (dividers are glass-ui DockSeparator).");
    } else {
        fail(`G1 — hand-rolled dock-separator divs survive in: ${offenders.join(", ")} — replace with <DockSeparator>.`);
    }
}

// ── G2 — both docks import + use DockSeparator ───────────────────────────────
for (const [label, file] of [["ChromeDock", CHROME], ["TransportDock", TRANSPORT]]) {
    const src = stripHtml(read(file));
    const imported = /import\s*{[^}]*\bDockSeparator\b[^}]*}\s*from\s*["']@mkbabb\/glass-ui\/dock["']/.test(src);
    const used = /<DockSeparator\b/.test(src);
    if (imported && used) ok(`G2 — ${label} imports + renders glass-ui <DockSeparator>.`);
    else fail(`G2 — ${label} does not import+use <DockSeparator> (imported: ${imported}, used: ${used}).`);
}

// ── G3 — no LEADING separator ────────────────────────────────────────────────
{
    const chrome = stripHtml(read(CHROME));
    const sepC = chrome.indexOf("<DockSeparator");
    const sceneSel = chrome.indexOf("<Select");
    if (sepC === -1 || (sceneSel !== -1 && sceneSel < sepC)) {
        ok("G3 — ChromeDock leads with identity (scene <Select>), not a DockSeparator.");
    } else {
        fail(`G3 — ChromeDock renders a LEADING <DockSeparator> (sep@${sepC} before scene <Select>@${sceneSel}).`);
    }
    const transport = stripHtml(read(TRANSPORT));
    const sepT = transport.indexOf("<DockSeparator");
    // The play control leads: its aria-label ternary or the onPlayPointerDown handler.
    const playT = (() => {
        const a = transport.search(/aria-label\s*=\s*"[^"]*Play animation/);
        const h = transport.search(/@pointerdown\s*=\s*"onPlayPointerDown/);
        return Math.min(...[a, h].filter((x) => x !== -1));
    })();
    if (sepT === -1 || (Number.isFinite(playT) && playT < sepT)) {
        ok("G3 — TransportDock leads with the primary play control, not a DockSeparator.");
    } else {
        fail(`G3 — TransportDock renders a LEADING <DockSeparator> (sep@${sepT} before play@${playT}).`);
    }
}

// ── G4 — serif chrome flip DELETED (T.C4) ────────────────────────────────────
{
    const style = read(STYLE);
    // A `.dock-label` rule setting a display/serif font-family is the K.W2 flip.
    const dockLabelSerif = /\.dock-label\b[^{}]*\{[^}]*font-family\s*:\s*[^;}]*(?:--font-display|Instrument Serif|serif)/i.test(style);
    const sceneTitleDisplay = /\.dock-scene-title\b[^{}]*\{[^}]*font-family\s*:\s*[^;}]*(?:--font-display|Instrument Serif)/i.test(
        read(CHROME) + style,
    );
    if (!dockLabelSerif && !sceneTitleDisplay) {
        ok("G4 — no `.dock-label`/`.dock-scene-title` display-font override (the serif chrome flip is deleted; Jakarta dock register — T.C4/T.D3).");
    } else {
        fail(`G4 — a dock display-font override survives (dock-label serif: ${dockLabelSerif}, dock-scene-title display: ${sceneTitleDisplay}) — VERDICT #24, delete it.`);
    }
}

// ── G5 — home = COMPASS ONLY (T.C2 transport mount census) ───────────────────
{
    const acg = stripHtml(read(ACG));
    // The <TransportDock ...> element must carry a channel-count v-if (mount iff ≥1).
    // Scan a window after the tag open (the v-if value itself carries a `>`, so a
    // lazy `...>` match would stop inside the attribute — window-scan instead).
    const tagAt = acg.indexOf("<TransportDock");
    const window = tagAt === -1 ? "" : acg.slice(tagAt, tagAt + 400);
    const guarded =
        tagAt !== -1 &&
        /v-if\s*=\s*"[^"]*(?:transportNames|channelNames|channels)\.length\s*>\s*0[^"]*"/.test(
            window,
        );
    if (guarded) {
        ok("G5 — the transport dock mounts iff the scene exposes ≥1 channel (home = compass only; the orphaned home transport is elided — T.C2).");
    } else {
        fail("G5 — <TransportDock> is NOT channel-count guarded in AnimationControlsGroup.vue — it mounts unconditionally (home renders the orphaned transport cluster, shot 06).");
    }
}

if (failures.length > 0) {
    console.error(`\nproof:dock-grammar — FAIL (${failures.length}): the dock grammar recut regressed.`);
    process.exit(1);
}
console.log("\nproof:dock-grammar — PASS: both docks speak glass-ui's DockSeparator grammar; no hand-rolled dividers; identity leads; serif flip deleted; home is compass only.");
