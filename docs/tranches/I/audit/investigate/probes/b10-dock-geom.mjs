#!/usr/bin/env node
/** b10-dock-geom — why is the Scene combobox "not visible"? Dump its rect +
 *  computed display/visibility/opacity + ancestor transforms, plus the dock
 *  container geometry, to know how to drive the real switch. */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".ttf": "font/ttf", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".map": "application/json" };
function serveDist() { return http.createServer((req, res) => { const u = decodeURIComponent(new URL(req.url, "http://x").pathname); const p = path.join(DIST, u === "/" ? "index.html" : u); if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) return void res.writeHead(404).end(); res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" }); fs.createReadStream(p).pipe(res); }); }
function resolveChromium() { const r = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json")); try { return r("playwright-core").chromium; } catch { return r("@playwright/test").chromium; } }
const server = serveDist();
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await resolveChromium().launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(`${base}/#/cube`, { waitUntil: "load" });
await page.waitForTimeout(1500);
const info = await page.evaluate(() => {
    const el = document.querySelector('button[aria-label="Scene"]');
    if (!el) return { found: false };
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const chain = [];
    let n = el;
    while (n && chain.length < 8) {
        const c = getComputedStyle(n);
        chain.push({ tag: n.tagName, cls: (n.className || "").toString().slice(0, 50), display: c.display, visibility: c.visibility, opacity: c.opacity, transform: c.transform.slice(0, 30), pos: c.position });
        n = n.parentElement;
    }
    return { found: true, rect: { x: r.x, y: r.y, w: r.width, h: r.height }, vw: innerWidth, vh: innerHeight, display: cs.display, visibility: cs.visibility, opacity: cs.opacity, pointerEvents: cs.pointerEvents, chain };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
server.close();
