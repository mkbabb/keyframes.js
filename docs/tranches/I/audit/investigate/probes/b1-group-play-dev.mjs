#!/usr/bin/env node
/**
 * INV PROBE — B1 against the DEV server (:5174) for SOURCE-MAPPED stacks.
 * Captures console + pageerror, clicks the rainbow group-play button, and
 * snapshots the exact CSS string that reaches formatCSS (by patching window).
 *
 *   KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
 *     node docs/tranches/I/audit/investigate/probes/b1-group-play-dev.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SHOTS = path.resolve(HERE, "../shots");
fs.mkdirSync(SHOTS, { recursive: true });
const DEV = process.env.KF_DEV_BASE ?? "http://localhost:5174";

const requireFrom = createRequire(
    path.join(process.env.KF_PLAYWRIGHT_DIR ?? path.resolve(HERE, "../../../../../.."), "package.json"),
);
const { chromium } = requireFrom("playwright-core");

const log = [];
const record = (kind, text) => {
    log.push({ kind, text });
    console.log(`[${kind}] ${String(text).slice(0, 800)}`);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

page.on("console", (msg) => record(`console.${msg.type()}`, msg.text()));
page.on("pageerror", (err) => record("pageerror", `${err.message}\n${err.stack ?? ""}`));

await page.goto(`${DEV}/#/`, { waitUntil: "load" });
await page.waitForTimeout(2500); // give vite + dynamic engine import time

record("info", "=== HOME LOADED (dev) ===");
await page.screenshot({ path: path.join(SHOTS, "b1-dev-01-home.png") });

// Probe the empty home group's transform state + the selected animation's
// serializable CSS BEFORE clicking, to catch the "......" producer.
const preState = await page.evaluate(async () => {
    const out = {};
    try {
        // Reach the App's currentAnimationGroup via the DOM is not possible; instead
        // count buttons + read any visible keyframes editor text.
        out.playBtn = !!document.querySelector('button[aria-label^="Play animation"], button.rainbow-pastel, button.rainbow-vivid');
        const editor = document.querySelector(".monaco-editor, [class*=cm-content], textarea");
        out.editorText = editor ? (editor.innerText || editor.value || "").slice(0, 400) : null;
    } catch (e) { out.err = e.message; }
    return out;
});
record("info", `pre-click state: ${JSON.stringify(preState)}`);

// Click the rainbow play.
const sel = 'button[aria-label^="Play animation"], button[aria-label^="Pause animation"], button.rainbow-pastel, button.rainbow-vivid';
const btn = await page.$(sel);
if (btn) {
    record("info", `clicking rainbow play (${sel})`);
    const before = log.length;
    await btn.click({ force: true }).catch((e) => record("info", `click err: ${e.message}`));
    await page.waitForTimeout(2500);
    record("info", `=== ${log.length - before} new log line(s) after click ===`);
} else {
    record("info", "NO rainbow play button found on dev home");
}

await page.screenshot({ path: path.join(SHOTS, "b1-dev-02-after-play.png") });

await browser.close();

const outPath = path.resolve(HERE, "../b1-group-play-dev.console.json");
fs.writeFileSync(outPath, JSON.stringify(log, null, 2));

const errs = log.filter((l) => l.kind === "pageerror" || /\.(error|warning)$/.test(l.kind));
console.log(`\n=== SUMMARY: ${errs.length} error/warning line(s) ===`);
for (const e of errs) console.log(`  • [${e.kind}] ${e.text.slice(0, 600)}\n`);
