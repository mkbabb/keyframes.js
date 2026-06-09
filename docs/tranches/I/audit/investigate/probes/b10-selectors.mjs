#!/usr/bin/env node
/** b10-selectors — dump the dock nav + transport button selectors live so the
 *  census can drive the REAL dock-switch path (B2 suspend/resume). */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".ttf": "font/ttf", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".map": "application/json" };

function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) return void res.writeHead(404).end();
        res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
        fs.createReadStream(p).pipe(res);
    });
}
function resolveChromium() {
    const r = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
    try { return r("playwright-core").chromium; } catch { return r("@playwright/test").chromium; }
}

const server = serveDist();
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await resolveChromium().launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(`${base}/#/cube`, { waitUntil: "load" });
await page.waitForTimeout(1500);
const dump = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button, a, [role=tab], [role=button]")];
    return btns.slice(0, 80).map((b) => ({
        tag: b.tagName,
        text: (b.textContent || "").trim().slice(0, 24),
        aria: b.getAttribute("aria-label"),
        title: b.getAttribute("title"),
        role: b.getAttribute("role"),
        cls: (b.className || "").toString().slice(0, 70),
        href: b.getAttribute("href"),
        visible: b.offsetParent !== null,
    })).filter((b) => b.aria || b.title || b.text || b.href);
});
console.log(JSON.stringify(dump, null, 2));
await browser.close();
server.close();
