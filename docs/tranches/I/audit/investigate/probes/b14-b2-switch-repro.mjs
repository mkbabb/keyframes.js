#!/usr/bin/env node
/**
 * B2 FAITHFUL REPRO — easing (PLAYING) → amiga via the dock "Scene" SELECT.
 *
 * The scene nav is a reka Select (dock-select-trigger, aria-label="Scene"), NOT
 * per-scene nav buttons. We open it and click the Amiga option — the genuine
 * NAVIGATE-while-playing path that drives the machine's captureActive() →
 * adapter.suspend(). Captures the `_gen` TypeError + whether amiga's controls
 * render BLANK.
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
await page.waitForTimeout(1800); // let easing autoPlay + the rAF loop run

// Confirm easing is PLAYING (the B2 precondition): the play control reads "Pause".
const playingBefore = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const pause = btns.find((b) => /pause/i.test(b.getAttribute("aria-label")||"") || /^pause$/i.test((b.textContent||"").trim()));
    return !!pause;
});

await page.screenshot({ path: path.join(SHOTS, "b14-b2-0-easing-playing.png") });

// Open the "Scene" select (aria-label="Scene"), then click the "Amiga" option.
const errBefore = pageErrors.length;
const openResult = await page.evaluate(() => {
    const trigger = [...document.querySelectorAll("button")].find((b) => b.getAttribute("aria-label") === "Scene");
    if (!trigger) return { opened: false, reason: "no Scene trigger" };
    trigger.click();
    return { opened: true };
});
await page.waitForTimeout(500);

// The reka Select content portals into the body; find the Amiga option.
let clickedAmiga = await page.evaluate(() => {
    const opts = [...document.querySelectorAll('[role="option"], [data-radix-collection-item], [role="menuitem"]')];
    const amiga = opts.find((o) => /amiga/i.test((o.textContent||"").trim()));
    if (amiga) { amiga.click(); return { clicked: true, text: (amiga.textContent||"").trim().slice(0,20) }; }
    // Fallback: any clickable element naming amiga that wasn't there before.
    const any = [...document.querySelectorAll("*")].find((o) => o.children.length === 0 && /^amiga$/i.test((o.textContent||"").trim()));
    if (any) { any.click(); return { clicked: true, text: "fallback-leaf", tag: any.tagName }; }
    return { clicked: false, optCount: opts.length };
});

// If the select-option route failed, fall back to keyboard nav within the select.
if (!clickedAmiga.clicked) {
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    clickedAmiga = { clicked: "keyboard-fallback" };
}

await page.waitForTimeout(2500); // settle the scene swap + the SCENE_READY restore

const errAfterSwitch = pageErrors.slice(errBefore);
await page.screenshot({ path: path.join(SHOTS, "b14-b2-1-after-switch.png") });

// Snapshot the resulting control-surface render on amiga.
const after = await page.evaluate(() => {
    let activeScene = "(?)";
    try { activeScene = JSON.parse(localStorage.getItem("keyframes-js-scene-machine")||"{}").activeScene; } catch {}
    const visiblePanels = [...document.querySelectorAll('[role="tabpanel"]')]
        .filter((el) => !!(el.offsetParent || el.getClientRects().length))
        .map((el) => ({ value: el.getAttribute("data-value")||"", textLen: (el.textContent||"").trim().length, selected: el.getAttribute("data-state")==="active" }));
    const selectedTab = [...document.querySelectorAll('[role="tab"]')].find((t) => t.getAttribute("data-state")==="active");
    const controlPanel = document.querySelector('[class*="control" i]');
    return {
        activeScene,
        visiblePanels,
        selectedTabValue: selectedTab ? (selectedTab.getAttribute("data-value")||selectedTab.textContent||"").trim().slice(0,24) : "(none)",
        controlRegionTextLen: controlPanel ? (controlPanel.textContent||"").trim().length : -1,
        sliders: document.querySelectorAll('input[type="range"], [role="slider"]').length,
        // Is the whole controls/keyframes region BLANK? (B2 symptom)
        anyControlsVisible: [...document.querySelectorAll('input,select,[role="slider"],.monaco-editor')].some((e)=>!!(e.offsetParent||e.getClientRects().length)),
    };
});

const report = {
    playingBefore,
    openResult,
    clickedAmiga,
    after,
    pageErrorsDuringSwitch: errAfterSwitch,
    allPageErrors: pageErrors,
    relevantConsole: consoleLog.filter((m) => /error|warn|Error|parse|undefined|_gen|TypeError|suspend|computed/i.test(m.text) && !/content-visibility|WebGL|GL Driver/.test(m.text)).map((m)=>`[${m.type}] ${m.text}`.slice(0,400)),
};
console.log("===B2-REPRO-JSON-START===");
console.log(JSON.stringify(report, null, 2));
console.log("===B2-REPRO-JSON-END===");

await browser.close();
server.close();
