#!/usr/bin/env node
/** b15 follow-up: dock catch-light liveness + page substrate + easing perf spike. */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const SHOTS = path.resolve(HERE, "../shots");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".ttf": "font/ttf", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".webp": "image/webp", ".ico": "image/x-icon" };

function serveDist() {
    return http.createServer((req, res) => {
        const u = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, u === "/" ? "index.html" : u);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) return res.writeHead(404).end();
        res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
        fs.createReadStream(p).pipe(res);
    });
}

const chromium = (() => {
    const r = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
    try { return r("playwright-core").chromium; } catch { return r("@playwright/test").chromium; }
})();

async function main() {
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const out = {};

    for (const scene of ["cube", "easing"]) {
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await ctx.newPage();
        await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
        await page.waitForTimeout(1200);

        // Page substrate behind the glass — what does the glass refract?
        const substrate = await page.evaluate(() => {
            const b = getComputedStyle(document.body);
            const root = getComputedStyle(document.documentElement);
            const app = document.querySelector("#app, .app, main");
            return {
                bodyBg: b.backgroundColor,
                bodyBgImage: (b.backgroundImage || "none").slice(0, 60),
                rootBg: root.backgroundColor,
                appBg: app ? getComputedStyle(app).backgroundColor : null,
                darkClass: document.documentElement.classList.contains("dark"),
            };
        });

        // Dock catch-light liveness: read --mouse-x before/after hovering a dock icon.
        const dockBefore = await page.evaluate(() => {
            const d = document.querySelector(".dock-icon-button, .glass-dock [class*='dock-icon']");
            if (!d) return { found: false };
            return { found: true, mouseX: d.style.getPropertyValue("--mouse-x").trim() || "(unset)", rect: d.getBoundingClientRect() };
        });
        let dockAfter = { found: false };
        const dockHandle = await page.$(".dock-icon-button, .glass-dock [class*='dock-icon']");
        if (dockHandle) {
            const box = await dockHandle.boundingBox();
            if (box) {
                await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.4);
                await page.waitForTimeout(250);
                dockAfter = await dockHandle.evaluate((d) => ({
                    found: true,
                    mouseX: d.style.getPropertyValue("--mouse-x").trim() || "(unset)",
                    mouseY: d.style.getPropertyValue("--mouse-y").trim() || "(unset)",
                    beforeIntensity: getComputedStyle(d, "::before").getPropertyValue("--specular-intensity"),
                    beforeBg: (getComputedStyle(d, "::before").backgroundImage || "").slice(0, 70),
                }));
            }
        }

        // Easing perf spike: measure paint cost while idle, identify heavy layers.
        let perf = null;
        if (scene === "easing") {
            perf = await page.evaluate(() => new Promise((resolve) => {
                const s = []; let last = performance.now(); let n = 0;
                const tick = (now) => { s.push(now - last); last = now; if (++n < 90) requestAnimationFrame(tick); else { s.sort((a, b) => a - b); resolve({ mean: +(s.reduce((a, b) => a + b, 0) / s.length).toFixed(2), p50: +s[45].toFixed(2), p95: +s[Math.floor(s.length * 0.95)].toFixed(2), max: +s[s.length - 1].toFixed(2), over32: s.filter((x) => x > 32).length }); } };
                requestAnimationFrame((t) => { last = t; requestAnimationFrame(tick); });
            }));
        }

        out[scene] = { substrate, dockBefore, dockAfter, perf };
        await ctx.close();
    }

    await browser.close();
    server.close();
    console.log(JSON.stringify(out, null, 2));
}
main().catch((e) => { console.error(e); process.exit(1); });
