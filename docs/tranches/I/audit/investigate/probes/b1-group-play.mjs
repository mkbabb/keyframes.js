#!/usr/bin/env node
/**
 * INV PROBE — B1: the rainbow GROUP-PLAY "......" parse crash.
 *
 * Opens home (#/), captures console + pageerror, then clicks the rainbow
 * group-play (togglePlay) button and re-captures. Mirrors the proven harness:
 * serveDist on port 0 + chromium via createRequire(KF_PLAYWRIGHT_DIR).
 *
 *   KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
 *     node docs/tranches/I/audit/investigate/probes/b1-group-play.mjs
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const SHOTS = path.resolve(HERE, "../shots");
fs.mkdirSync(SHOTS, { recursive: true });

const MIME = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".ttf": "font/ttf",
    ".woff2": "font/woff2",
    ".svg": "image/svg+xml",
    ".map": "application/json",
};

function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
            res.writeHead(404).end();
            return;
        }
        res.writeHead(200, {
            "content-type": MIME[path.extname(p)] ?? "application/octet-stream",
        });
        fs.createReadStream(p).pipe(res);
    });
}

const requireFrom = createRequire(
    path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
);
const { chromium } = requireFrom("playwright-core");

const log = [];
const record = (kind, text) => {
    log.push({ kind, text });
    console.log(`[${kind}] ${text}`);
};

const server = serveDist();
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;
record("info", `serving dist at ${base}`);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

page.on("console", (msg) => {
    record(`console.${msg.type()}`, msg.text());
});
page.on("pageerror", (err) => {
    record("pageerror", `${err.message}\n${err.stack ?? ""}`);
});

await page.goto(`${base}/#/`, { waitUntil: "load" });
await page.waitForTimeout(1500);
record("info", "=== HOME LOADED (pre-interaction console above) ===");
await page.screenshot({ path: path.join(SHOTS, "b1-01-home-loaded.png") });

// Select an animation first if a start-screen blocks the group (the group only
// has frames once an animation is chosen). Try the start-screen / selector.
const startScreenBtns = await page.$$("button");
record("info", `found ${startScreenBtns.length} buttons on home`);

// Find and click the rainbow play button (aria-label includes "Play animation").
const playSelectors = [
    'button[aria-label^="Play animation"]',
    'button[aria-label^="Pause animation"]',
    'button.rainbow-pastel',
    'button.rainbow-vivid',
];
let clicked = false;
for (const sel of playSelectors) {
    const el = await page.$(sel);
    if (el) {
        record("info", `clicking play via selector: ${sel}`);
        const before = log.length;
        await el.click({ force: true }).catch((e) => record("info", `click err ${sel}: ${e.message}`));
        await page.waitForTimeout(1500);
        clicked = true;
        record("info", `=== after click ${sel}: ${log.length - before} new log line(s) ===`);
        break;
    }
}
if (!clicked) {
    record("info", "NO rainbow play button found — dumping the start-screen / selector state");
    // The group may require an animation selection first. Snapshot the start screen.
    const txt = await page.evaluate(() => document.body.innerText.slice(0, 600));
    record("info", `body text: ${txt.replace(/\n+/g, " | ")}`);
}

await page.screenshot({ path: path.join(SHOTS, "b1-02-after-play.png") });

// Also try selecting an animation from a dropdown/start-screen, then play.
// The EditorStartScreen has an "select an animation" affordance; click any
// animation-named button then re-try play.
record("info", "=== attempting animation-select then play ===");
const selectorCandidates = await page.$$(
    'button, [role="option"], [role="menuitem"], li',
);
record("info", `scanning ${selectorCandidates.length} clickable candidates for an animation name`);

// Dump network 404s captured (icon ENOENT etc.) — separate probe owns B9 but
// note here if format/parse assets fail to load.
await browser.close();
server.close();

// Persist the captured log next to the shots.
const outPath = path.resolve(HERE, "../b1-group-play.console.json");
fs.writeFileSync(outPath, JSON.stringify(log, null, 2));
record("info", `wrote console log → ${outPath}`);

const errs = log.filter((l) => l.kind === "pageerror" || /error/i.test(l.kind));
console.log(`\n=== SUMMARY: ${errs.length} error/pageerror line(s) ===`);
for (const e of errs) console.log(`  • [${e.kind}] ${e.text.slice(0, 300)}`);
