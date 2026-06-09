#!/usr/bin/env node
/**
 * TRANCHE I — probe [b3-amiga-switch]. Pin the controls-blank-on-switch (the B2
 * DFA symptom as it lands on the amiga surface): load easing, PLAY it, then
 * switch to amiga and inspect the left controls panel DOM (is the controls grid
 * present or an empty pill?) + the menubar play/pause icon + any pageerror.
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
const MACHINE_KEY = "keyframes-js-scene-machine";
const CTRL_KEY = "animation-groups-control-options-store";
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
    ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
    ".svg": "image/svg+xml", ".woff2": "font/woff2", ".ttf": "font/ttf" };
function serveDist() {
    return http.createServer((req, res) => {
        const u = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, u === "/" ? "index.html" : u);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) return res.writeHead(404).end();
        res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
        fs.createReadStream(p).pipe(res);
    });
}
const errs = [];
async function open(browser, base, scene, vw) {
    const ctx = await browser.newContext({ viewport: { width: vw, height: 900 } });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => errs.push({ scene, name: e.name, message: e.message, stack: e.stack }));
    await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);
    await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
    await page.waitForFunction(([mk, s]) => { try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s; } catch { return false; } }, [MACHINE_KEY, scene], { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(1200);
    return { ctx, page };
}
// describe the left controls panel: does it hold a real controls grid or is it empty?
async function controlsDom(page) {
    return page.evaluate(() => {
        // the controls panel is the first card in the left rail (the duration/easing grid)
        const labels = [...document.querySelectorAll("*")].filter((el) => /^(duration|delay|iterations|direction|fill mode|easing)$/i.test((el.textContent || "").trim()) && el.children.length === 0);
        const cards = [...document.querySelectorAll("[data-surface], .glass-card, [class*='card']")];
        // find the leftmost non-empty card region in the left third
        const leftCards = cards.filter((c) => { const r = c.getBoundingClientRect(); return r.x < 420 && r.width > 100 && r.height > 40; })
            .map((c) => { const r = c.getBoundingClientRect(); return { cls: c.className.slice(0, 80), w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y), textLen: (c.textContent || "").trim().length }; });
        // menubar play/pause: look for an element whose aria/title says play or pause
        const pp = [...document.querySelectorAll("button,[role='button'],[aria-label]")].map((el) => (el.getAttribute("aria-label") || el.getAttribute("title") || "")).filter((s) => /play|pause/i.test(s));
        return { controlLabelCount: labels.length, controlLabels: labels.map((l) => l.textContent.trim()), leftCards, playPauseLabels: pp };
    });
}
async function main() {
    const requireFrom = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
    let chromium; try { ({ chromium } = requireFrom("playwright-core")); } catch { ({ chromium } = requireFrom("@playwright/test")); }
    const server = serveDist(); await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const report = {};
    try {
        const { ctx, page } = await open(browser, base, "easing", 1440);
        report.easingControls = await controlsDom(page);
        // PLAY the easing scene group via the menubar play button
        await page.evaluate(() => {
            const btn = [...document.querySelectorAll("button,[role='button']")].find((b) => /play/i.test(b.getAttribute("aria-label") || b.getAttribute("title") || b.textContent || ""));
            if (btn) btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        await page.waitForTimeout(600);
        report.afterPlayErrs = errs.length;
        // SWITCH to amiga: click the Amiga dock/scene-selector entry
        const clicked = await page.evaluate(() => {
            const cand = [...document.querySelectorAll("a,button,[role='button'],[role='menuitem'],[role='option']")];
            const t = cand.find((el) => /amiga/i.test((el.getAttribute("aria-label") || "") + " " + (el.getAttribute("href") || "") + " " + (el.textContent || "")));
            if (t) { t.dispatchEvent(new MouseEvent("click", { bubbles: true })); return { found: true, how: t.tagName + ":" + (t.getAttribute("aria-label") || t.textContent || "").slice(0, 30) }; }
            return { found: false };
        });
        report.switchClick = clicked;
        if (!clicked.found) await page.evaluate(() => { location.hash = "#/amiga"; });
        await page.waitForTimeout(1800);
        report.activeSceneAfter = await page.evaluate((mk) => { try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene; } catch { return null; } }, MACHINE_KEY);
        report.amigaControls = await controlsDom(page);
        report.switchErrs = errs.slice();
        await page.screenshot({ path: path.join(SHOTS, "b3-amiga-07-switch-played.png") });
        await ctx.close();
    } finally { await browser.close(); server.close(); }
    console.log(JSON.stringify(report, null, 2));
}
main().catch((e) => { console.error("PROBE CRASH:", e); process.exit(1); });
