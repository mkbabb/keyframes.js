#!/usr/bin/env node
/**
 * INVESTIGATION PROBE — B4 (PROPER FSM switch): does the easing editor survive a
 * scene switch driven through the REAL dock scene-nav (the `[aria-label="Scene"]`
 * DockSelectTrigger → SelectItem), i.e. the path the user actually uses?
 *
 * The router is vue-router NAMED routes (useSceneMachineRouter); a raw
 * `location.hash` write is NOT the canonical switch. This probe clicks the dock
 * scene Select and picks the option by its visible label — the genuine
 * switchScene → FSM → :key Suspense re-mount path.
 *
 * Scenarios:
 *   A. land cube → (dock) switch to Easing → inspect editor.
 *   B. (dock) switch Easing → Amiga (the B2 suspend path) → was easing left blank?
 *   C. (dock) switch Amiga → Easing (return) → editor back?
 *
 * Run: KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
 *        node docs/tranches/I/audit/investigate/probes/b4-easing-proper-switch.mjs
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

const MIME = {
    ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
    ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml",
    ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2",
    ".woff": "font/woff", ".ttf": "font/ttf", ".map": "application/json",
};
const CTRL_KEY = "animation-groups-control-options-store";

function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
            res.writeHead(404).end(); return;
        }
        res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
        fs.createReadStream(p).pipe(res);
    });
}

const log = (...a) => console.log(...a);

async function inspectEasing(page) {
    return page.evaluate(() => {
        const editor = document.querySelector(".easing-editor");
        const canvas = document.querySelector(".easing-curve-canvas");
        const handles = document.querySelectorAll(".easing-curve-canvas .control-point.handle");
        const trigger = document.querySelector(".easing-trigger-label");
        const duration = document.querySelectorAll(".duration-field, .labeled-field.duration-field");
        const machine = (() => { try { return JSON.parse(localStorage.getItem("keyframes-js-scene-machine") || "{}"); } catch { return {}; } })();
        return {
            activeScene: machine.activeScene ?? null,
            status: machine.status ?? null,
            editorPresent: !!editor,
            canvasPresent: !!canvas,
            handleCount: handles.length,
            selectorPresent: !!trigger,
            selectorText: trigger?.textContent.trim().slice(0, 40) || null,
            durationPresent: duration.length,
        };
    });
}

/** Switch scene via the REAL dock scene-nav Select. The GlassDock is a
 *  hover-reveal surface, so we move the pointer over the dock region first to
 *  expand it before the [aria-label="Scene"] trigger becomes visible. */
async function dockSwitch(page, label) {
    // Reveal the dock: it lives bottom-center. Hover its region, then the trigger.
    const dock = page.locator('.glass-dock, [class*="glass-dock"], [aria-label="Scene"]').first();
    try { await dock.scrollIntoViewIfNeeded({ timeout: 1500 }); } catch {}
    const box = await dock.boundingBox().catch(() => null);
    if (box) { await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); }
    else {
        const vp = page.viewportSize();
        await page.mouse.move(vp.width / 2, vp.height - 40);
    }
    await page.waitForTimeout(600);
    const trigger = page.locator('[aria-label="Scene"]').first();
    await trigger.click({ timeout: 6000 });
    await page.waitForTimeout(350);
    const opt = page.locator(`[role="option"]:has-text("${label}"), [data-slot="select-item"]:has-text("${label}")`).first();
    const n = await opt.count();
    if (!n) { await page.keyboard.press("Escape").catch(() => {}); return { clicked: false, optionCount: n }; }
    await opt.click({ timeout: 4000 });
    await page.waitForTimeout(1600); // Suspense re-mount + scene settle
    return { clicked: true, optionCount: n };
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
    const consoleMsgs = [];
    const pageErrors = [];
    page.on("console", (m) => { const t = m.type(); if (t !== "verbose") consoleMsgs.push(`[${t}] ${m.text()}`); });
    page.on("pageerror", (e) => pageErrors.push(String(e.stack || e)));

    await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);

    log("\n=== land on cube ===");
    await page.goto(`${base}/#/cube`, { waitUntil: "load" });
    await page.waitForTimeout(1400);

    log("\n=== A: dock-switch cube → Easing ===");
    const a = await dockSwitch(page, "Easing");
    log("dock switch A:", JSON.stringify(a));
    const afterA = await inspectEasing(page);
    log("easing editor after A:", JSON.stringify(afterA, null, 2));
    await page.screenshot({ path: path.join(SHOTS, "b4-proper-01-cube-to-easing.png") });

    log("\n=== B: dock-switch Easing → Amiga (suspend path) ===");
    const errB0 = pageErrors.length, conB0 = consoleMsgs.length;
    const b = await dockSwitch(page, "Amiga");
    log("dock switch B:", JSON.stringify(b));
    const afterB = await page.evaluate(() => {
        const machine = (() => { try { return JSON.parse(localStorage.getItem("keyframes-js-scene-machine") || "{}"); } catch { return {}; } })();
        return { activeScene: machine.activeScene ?? null, status: machine.status ?? null,
            easingResidue: !!document.querySelector(".easing-editor") };
    });
    log("after B:", JSON.stringify(afterB, null, 2));
    log("new pageerrors during B:", pageErrors.length - errB0, "| new console during B:", consoleMsgs.length - conB0);
    await page.screenshot({ path: path.join(SHOTS, "b4-proper-02-easing-to-amiga.png") });

    log("\n=== C: dock-switch Amiga → Easing (return) ===");
    const c = await dockSwitch(page, "Easing");
    log("dock switch C:", JSON.stringify(c));
    const afterC = await inspectEasing(page);
    log("easing editor after C (return):", JSON.stringify(afterC, null, 2));
    await page.screenshot({ path: path.join(SHOTS, "b4-proper-03-amiga-to-easing.png") });

    log("\n── CONSOLE (non-verbose, all) ──");
    for (const m of consoleMsgs) log("  " + m);
    log("\n── PAGEERROR (all) ──");
    for (const e of pageErrors) log("  " + e);

    await ctx.close();
    await browser.close();
    server.close();
    log("\nDONE.");
})().catch((e) => { console.error("PROBE FAILED:", e); process.exit(1); });
