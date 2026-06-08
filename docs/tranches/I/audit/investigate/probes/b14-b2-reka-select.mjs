#!/usr/bin/env node
/**
 * B2 DEFINITIVE REPRO — easing (PLAYING) → amiga via the reka SCENE Select,
 * using Playwright native auto-retrying locators (robust against the easing
 * scene's per-frame re-render churn). Serves the BUILT dist/gh-pages.
 *
 * Sequence: open #/easing → autoPlay runs (confirm "Pause") → open the
 * aria-label="Scene" reka combobox → click the "Amiga" role=option → settle →
 * capture pageerror (the `_gen` TypeError) + the resulting control render.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const SHOTS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../shots");
const MIME = { ".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".png":"image/png",".ttf":"font/ttf",".woff2":"font/woff2",".svg":"image/svg+xml",".webp":"image/webp" };
const MACHINE_KEY = "keyframes-js-scene-machine";
const CTRL_KEY = "animation-groups-control-options-store";

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

const consoleLog = [], pageErrors = [];
page.on("console", (m) => consoleLog.push({ type: m.type(), text: m.text() }));
page.on("pageerror", (e) => pageErrors.push({ message: e.message, stack: e.stack }));

await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);
await page.goto(`${base}/#/easing`, { waitUntil: "load" });
await page.waitForFunction((mk) => { try { return JSON.parse(localStorage.getItem(mk)||"{}").activeScene === "easing"; } catch { return false; } }, MACHINE_KEY, { timeout: 8000 }).catch(()=>{});
await page.waitForTimeout(1800);

const playingBefore = await page.locator('button[aria-label="Pause animation"], button:has-text("Pause")').first().isVisible().catch(() => false);
await page.screenshot({ path: path.join(SHOTS, "b14-reka-0-easing.png") });

const errBefore = pageErrors.length;

// Open the Scene reka combobox (native locator auto-retries through re-renders).
let opened = false, optionClicked = false, clickErr = null;
try {
    await page.locator('button[aria-label="Scene"]').click({ timeout: 5000 });
    opened = true;
    // The reka Select listbox portals to body; the Amiga option is role=option.
    await page.getByRole("option", { name: "Amiga", exact: true }).click({ timeout: 5000 });
    optionClicked = true;
} catch (e) {
    clickErr = String(e).split("\n")[0];
}

await page.waitForTimeout(2800); // settle the swap + SCENE_READY restore
const errDuringSwitch = pageErrors.slice(errBefore);
await page.screenshot({ path: path.join(SHOTS, "b14-reka-1-after-amiga.png") });

const after = await page.evaluate(() => {
    let activeScene = "(?)";
    try { activeScene = JSON.parse(localStorage.getItem("keyframes-js-scene-machine")||"{}").activeScene; } catch {}
    const stillLoading = /Loading scene/i.test(document.body.textContent || "");
    const visiblePanels = [...document.querySelectorAll('[role="tabpanel"]')]
        .filter((el) => !!(el.offsetParent || el.getClientRects().length))
        .map((el) => ({ value: el.getAttribute("data-value")||"", textLen: (el.textContent||"").trim().length, selected: el.getAttribute("data-state")==="active" }));
    const selectedTab = [...document.querySelectorAll('[role="tab"]')].find((t) => t.getAttribute("data-state")==="active");
    const controlPanel = document.querySelector('[class*="control" i]');
    const anyControlsVisible = [...document.querySelectorAll('input,select,[role="slider"],.monaco-editor,[role="tab"]')].some((e)=>!!(e.offsetParent||e.getClientRects().length));
    return {
        activeScene, stillLoading, visiblePanels,
        selectedTabValue: selectedTab ? (selectedTab.getAttribute("data-value")||selectedTab.textContent||"").trim().slice(0,24) : "(none)",
        controlRegionTextLen: controlPanel ? (controlPanel.textContent||"").trim().length : -1,
        anyControlsVisible,
        sliders: document.querySelectorAll('input[type="range"], [role="slider"]').length,
    };
});

const report = {
    playingBefore, opened, optionClicked, clickErr,
    after,
    pageErrorsDuringSwitch: errDuringSwitch,
    allPageErrors: pageErrors,
    relevantConsole: consoleLog
        .filter((m) => /error|warn|Error|parse|undefined|_gen|TypeError|suspend|computed|readonly|fetch|import/i.test(m.text) && !/content-visibility|WebGL|GL Driver|GPU stall/.test(m.text))
        .map((m)=>`[${m.type}] ${m.text}`.slice(0,500)),
};
console.log("===B2-REKA-JSON-START===");
console.log(JSON.stringify(report, null, 2));
console.log("===B2-REKA-JSON-END===");

await browser.close();
server.close();
