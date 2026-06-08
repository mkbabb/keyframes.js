#!/usr/bin/env node
// Snapshot the dock nav DOM at the easing scene so we can find the amiga target
// selector + the play button, to faithfully reproduce the B2 dock-click switch.
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const MIME = { ".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".png":"image/png",".ttf":"font/ttf",".woff2":"font/woff2",".svg":"image/svg+xml",".webp":"image/webp" };
const MACHINE_KEY = "keyframes-js-scene-machine";

function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404).end(); return; }
        res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
        fs.createReadStream(p).pipe(res);
    });
}

const requireFrom = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
const { chromium } = requireFrom("playwright-core");
const server = serveDist();
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(`${base}/#/easing`, { waitUntil: "load" });
await page.waitForFunction((mk) => { try { return JSON.parse(localStorage.getItem(mk)||"{}").activeScene === "easing"; } catch { return false; } }, MACHINE_KEY, { timeout: 8000 }).catch(()=>{});
await page.waitForTimeout(1500);

const dom = await page.evaluate(() => {
    // Find candidate nav targets: anything carrying an aria-label or title that
    // names a scene, plus the play/pause control.
    const all = [...document.querySelectorAll("button, a, [role=button], [role=tab]")];
    const interesting = all.map((el, i) => ({
        i, tag: el.tagName,
        aria: el.getAttribute("aria-label") || "",
        title: el.getAttribute("title") || "",
        text: (el.textContent || "").trim().replace(/\s+/g," ").slice(0, 30),
        href: el.getAttribute("href") || "",
        cls: (el.getAttribute("class") || "").slice(0, 60),
        visible: !!(el.offsetParent || el.getClientRects().length),
    })).filter(o => o.aria || o.title || (o.text && o.text.length < 24) || o.href);
    return interesting;
});
console.log(JSON.stringify(dom, null, 1));
await browser.close();
server.close();
