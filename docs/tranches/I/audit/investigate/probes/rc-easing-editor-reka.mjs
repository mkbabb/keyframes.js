#!/usr/bin/env node
/**
 * ROOT-CAUSE PROBE [rc-easing-editor] REKA — the panel is data-state="inactive"
 * while the store selectedControl === "easing". Confirm THE seam: does a fresh
 * mount give data-state="active" but a switch-in give "inactive" for the SAME
 * value? And does TOGGLING selectedControl (click the dock easing tab pill, or
 * dispatch update-selected-control) force reka to re-activate the panel — proving
 * the controlled-Tabs late-registration is the cause (a re-assert fixes it)?
 *
 * The dock projects selectedControl via update-selected-control. We click the
 * dock's controls-tab pill (the "Easing" Activity pill) which re-emits
 * update-selected-control('easing') → re-asserts the Tabs model-value.
 *
 * Run: KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
 *        node docs/tranches/I/audit/investigate/probes/rc-easing-editor-reka.mjs
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
const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".map": "application/json" };
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
const log = (...a) => console.log(...a);

const panelState = (page) => page.evaluate(() => {
    const el = document.querySelector('[role="tabpanel"][id*="content-easing"], [role="tabpanel"]');
    return {
        easingCanvas: !!document.querySelector(".easing-curve-canvas"),
        panelState: el?.getAttribute("data-state") ?? "NONE",
        panelDisplay: el ? getComputedStyle(el).display : "NONE",
    };
});

async function dockSwitch(page, label) {
    const dock = page.locator('.glass-dock, [class*="glass-dock"], [aria-label="Scene"]').first();
    const box = await dock.boundingBox().catch(() => null);
    if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    else { const vp = page.viewportSize(); await page.mouse.move(vp.width / 2, vp.height - 40); }
    await page.waitForTimeout(600);
    await page.locator('[aria-label="Scene"]').first().click({ timeout: 8000 });
    await page.waitForTimeout(350);
    const opt = page.locator(`[role="option"]:has-text("${label}"), [data-slot="select-item"]:has-text("${label}")`).first();
    if (!(await opt.count())) { await page.keyboard.press("Escape").catch(() => {}); return false; }
    await opt.click({ timeout: 6000 });
    await page.waitForTimeout(1700);
    return true;
}

(async () => {
    const requireFrom = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
    const { chromium } = requireFrom("playwright-core");
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    log(`serving dist at ${base}`);
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);

    log("\n=== FRESH #/easing — panel state ===");
    await page.goto(`${base}/#/easing`, { waitUntil: "load" });
    await page.waitForTimeout(1800);
    log(JSON.stringify(await panelState(page)));

    log("\n=== switch cube → Easing — panel state ===");
    await page.goto(`${base}/#/cube`, { waitUntil: "load" });
    await page.waitForTimeout(1500);
    await dockSwitch(page, "Easing");
    log(JSON.stringify(await panelState(page)));

    // === Re-assert the controls-tab via the dock easing pill (update-selected-control) ===
    log("\n=== re-assert selectedControl via dock controls-tab pill ===");
    // The dock controls-tab is the 'Easing' Activity pill in the dock (DockSelectTrigger
    // for controls). Hover the dock, find a control-tab pill labelled Easing/Activity.
    const dock = page.locator('.glass-dock, [class*="glass-dock"]').first();
    const box = await dock.boundingBox().catch(() => null);
    if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(600);
    // Try clicking any dock element that re-selects the easing control surface.
    const beforeReassert = await panelState(page);
    // Programmatic re-assert: dispatch a storage write + re-enter to prove the
    // re-derivation. But the cleanest proof: simulate selecting the control again
    // by clicking the control-tab pill if present.
    const pill = page.locator('[role="tab"]:has-text("Easing"), button:has-text("Easing")').filter({ hasText: "Easing" });
    const pillCount = await pill.count();
    log("control-tab pill candidates:", pillCount);
    if (pillCount) {
        try { await pill.first().click({ timeout: 2500 }); await page.waitForTimeout(600); } catch (e) { log("pill click failed:", String(e).slice(0, 80)); }
    }
    const afterReassert = await panelState(page);
    log("before re-assert:", JSON.stringify(beforeReassert));
    log("after  re-assert:", JSON.stringify(afterReassert));
    await page.screenshot({ path: path.join(SHOTS, "rc-easing-reka-reassert.png") });

    await ctx.close(); await browser.close(); server.close();
    log("\nDONE.");
})().catch((e) => { console.error("PROBE FAILED:", e); process.exit(1); });
