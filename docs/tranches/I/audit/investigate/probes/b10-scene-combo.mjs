#!/usr/bin/env node
/** b10-scene-combo — how many Scene comboboxes, which is visible after dock
 *  expand, and does opening it list the scene options? Confirms the switch
 *  mechanics for the census. Runs on #/easing (where Amiga select failed). */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const SHOTS = path.resolve(HERE, "../shots");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".ttf": "font/ttf", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".map": "application/json" };
function serveDist() { return http.createServer((req, res) => { const u = decodeURIComponent(new URL(req.url, "http://x").pathname); const p = path.join(DIST, u === "/" ? "index.html" : u); if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) return void res.writeHead(404).end(); res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" }); fs.createReadStream(p).pipe(res); }); }
function resolveChromium() { const r = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json")); try { return r("playwright-core").chromium; } catch { return r("@playwright/test").chromium; } }
const server = serveDist();
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await resolveChromium().launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(`${base}/#/easing`, { waitUntil: "load" });
await page.waitForTimeout(1600);

const before = await page.evaluate(() => {
    const scenes = [...document.querySelectorAll('button[aria-label="Scene"]')];
    return scenes.map((s, i) => { const cs = getComputedStyle(s); const r = s.getBoundingClientRect(); return { i, vis: cs.visibility, op: cs.opacity, pe: cs.pointerEvents, text: s.textContent.trim(), rect: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}` }; });
});
// expand dock
await page.locator(".glass-dock").first().hover({ force: true }).catch(() => {});
await page.waitForTimeout(700);
const after = await page.evaluate(() => {
    const scenes = [...document.querySelectorAll('button[aria-label="Scene"]')];
    return scenes.map((s, i) => { const cs = getComputedStyle(s); return { i, vis: cs.visibility, op: cs.opacity, pe: cs.pointerEvents, text: s.textContent.trim() }; });
});
// click the VISIBLE Scene combobox via Playwright :visible filter
let opened = "n/a";
const vis = page.locator('button[aria-label="Scene"]:visible').first();
if ((await vis.count()) > 0) {
    await vis.click({ force: true }).catch((e) => { opened = "click err: " + e.message; });
    await page.waitForTimeout(500);
}
const options = await page.evaluate(() => [...document.querySelectorAll('[role="option"]')].map((o) => o.textContent.trim()));
await page.screenshot({ path: path.join(SHOTS, "b10-scene-combo-open.png") }).catch(() => {});
console.log(JSON.stringify({ before, after, visCount: await page.locator('button[aria-label="Scene"]:visible').count(), opened, options }, null, 2));
await browser.close();
server.close();
