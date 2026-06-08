#!/usr/bin/env node
/** b10-easing-amiga — the user's EXACT B2 repro: start on easing, PLAY it, then
 *  switch to amiga. Expect: B2 this._gen suspend crash + BLANK controls. Also
 *  probes whether easing has its bezier/timing editor (B4). Direct-navigates to
 *  #/easing first (a raf-adapter scene), plays, then dock-switches to amiga (a
 *  group-adapter scene) — the cross-family suspend path. */
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
const CTRL_KEY = "animation-groups-control-options-store";
function serveDist() { return http.createServer((req, res) => { const u = decodeURIComponent(new URL(req.url, "http://x").pathname); const p = path.join(DIST, u === "/" ? "index.html" : u); if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) return void res.writeHead(404).end(); res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" }); fs.createReadStream(p).pipe(res); }); }
function resolveChromium() { const r = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json")); try { return r("playwright-core").chromium; } catch { return r("@playwright/test").chromium; } }

const sink = [];
let phase = "init";
function wire(page) {
    page.on("console", (m) => { const t = m.type(); if (t === "error" || t === "warning") sink.push({ phase, kind: t, text: m.text() }); });
    page.on("pageerror", (e) => sink.push({ phase, kind: "pageerror", text: String(e?.message ?? e), stack: e?.stack ? String(e.stack) : null }));
}
async function expandDock(page) {
    const dock = page.locator(".glass-dock").first();
    if ((await dock.count()) === 0) return;
    await dock.hover({ timeout: 2000, force: true }).catch(() => {});
    await page.waitForFunction(() => { const f = document.querySelector(".dock-layer--full"); return f && getComputedStyle(f).visibility !== "hidden" && +getComputedStyle(f).opacity > 0.5; }, { timeout: 2500 }).catch(() => {});
}
async function selectScene(page, label) {
    await expandDock(page);
    const trigger = page.locator('button[aria-label="Scene"]').first();
    await trigger.click({ timeout: 3000, force: true }).catch((e) => sink.push({ phase, kind: "pageerror", text: `trigger: ${e.message}` }));
    await page.waitForTimeout(350);
    const opt = page.locator(`[role="option"]:has-text("${label}")`).first();
    if ((await opt.count()) === 0) { await page.keyboard.press("Escape").catch(() => {}); return `NO option ${label}`; }
    await opt.click({ timeout: 3000, force: true }).catch((e) => sink.push({ phase, kind: "pageerror", text: `opt ${label}: ${e.message}` }));
    await page.waitForTimeout(1300);
    return `selected ${label}`;
}
async function clickPlay(page) {
    for (const s of ['button[aria-label*="Play animation"]', 'button[aria-label="Play"]', 'button:has-text("Play")']) {
        const b = page.locator(s).first();
        if ((await b.count()) > 0) { await b.click({ timeout: 2500, force: true }).catch((e) => sink.push({ phase, kind: "pageerror", text: `play: ${e.message}` })); return `play ${s}`; }
    }
    return "no play";
}
// snapshot the controls-surface contents (B2/B4 blank detection)
async function ctrlSnapshot(page) {
    return await page.evaluate(() => {
        const txt = (sel) => (document.querySelector(sel)?.textContent || "").trim();
        const bezierSvg = document.querySelector('svg path[d*="C"], [class*="bezier"], [class*="curve"]');
        const easingEditBtn = [...document.querySelectorAll("button")].find((b) => /easing curve|timing/i.test(b.getAttribute("title") || b.getAttribute("aria-label") || ""));
        const comboValues = [...document.querySelectorAll('[role="combobox"]')].map((c) => (c.textContent || "").trim()).slice(0, 8);
        const customTwin = document.body.textContent.includes("no CSS twin");
        return {
            playBtns: [...document.querySelectorAll("button")].filter((b) => /play|pause/i.test(b.getAttribute("aria-label") || b.textContent || "")).length,
            comboboxes: document.querySelectorAll('[role="combobox"]').length,
            comboValues,
            hasBezierEditor: !!bezierSvg,
            hasEasingEditBtn: !!easingEditBtn,
            customNoTwin: customTwin,
            mainTextLen: (document.querySelector("main, #app")?.textContent || "").trim().length,
        };
    });
}

const trace = [];
const server = serveDist();
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await resolveChromium().launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);
wire(page);

phase = "load:easing";
await page.goto(`${base}/#/easing`, { waitUntil: "load" });
await page.waitForTimeout(1600);
trace.push({ at: "easing-load", ctrl: await ctrlSnapshot(page) });
await page.screenshot({ path: path.join(SHOTS, "b10-ea-1-easing-load.png") }).catch(() => {});

phase = "play:easing";
trace.push({ at: "easing-play", did: await clickPlay(page) });
await page.waitForTimeout(900);
trace.push({ at: "easing-after-play", ctrl: await ctrlSnapshot(page) });

phase = "switch:easing→amiga";
trace.push({ at: "→amiga", did: await selectScene(page, "Amiga") });
await page.waitForTimeout(900);
trace.push({ at: "amiga-after-switch", ctrl: await ctrlSnapshot(page) });
await page.screenshot({ path: path.join(SHOTS, "b10-ea-2-amiga-after.png") }).catch(() => {});

phase = "switch:amiga→easing(back)";
trace.push({ at: "→easing-back", did: await selectScene(page, "Easing") });
await page.waitForTimeout(900);
trace.push({ at: "easing-back", ctrl: await ctrlSnapshot(page) });
await page.screenshot({ path: path.join(SHOTS, "b10-ea-3-easing-back.png") }).catch(() => {});

console.log("===EA_TRACE===");
console.log(JSON.stringify(trace, null, 2));
console.log("===EA_CONSOLE===");
console.log(JSON.stringify(sink, null, 2));
await browser.close();
server.close();
