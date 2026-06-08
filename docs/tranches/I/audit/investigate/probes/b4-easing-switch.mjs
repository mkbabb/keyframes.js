#!/usr/bin/env node
/**
 * INVESTIGATION PROBE — B4 (switch path): does the easing editor survive a
 * scene SWITCH into/out of easing? The user's "LOST" report came from the LIVE
 * demo where they were switching scenes (B2's suspend-crash context:
 * "Switching easing→amiga shows BLANK controls"). Reproduce:
 *   • land on cube, switch → easing via the scene nav dropdown, inspect sidebar.
 *   • land on easing, switch → amiga, capture the suspend crash + whether the
 *     easing controls were left blank.
 *   • capture console + pageerror verbatim across the switches.
 *
 * Run: KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
 *        node docs/tranches/I/audit/investigate/probes/b4-easing-switch.mjs
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
const MACHINE_KEY = "keyframes-js-scene-machine";
const CTRL_KEY = "animation-groups-control-options-store";

function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
            res.writeHead(404).end();
            return;
        }
        res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
        fs.createReadStream(p).pipe(res);
    });
}

const log = (...a) => console.log(...a);

async function inspectEasingSidebar(page) {
    return page.evaluate(() => {
        const editor = document.querySelector(".easing-editor");
        const canvas = document.querySelector(".easing-curve-canvas");
        const handles = document.querySelectorAll(".easing-curve-canvas .control-point.handle");
        const trigger = document.querySelector(".easing-trigger-label");
        const duration = document.querySelectorAll(".duration-field, .labeled-field.duration-field");
        return {
            editorPresent: !!editor,
            canvasPresent: !!canvas,
            handleCount: handles.length,
            selectorPresent: !!trigger,
            selectorText: trigger?.textContent.trim().slice(0, 40) || null,
            durationPresent: duration.length,
            sidebarText: (editor?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 120),
        };
    });
}

(async () => {
    const requireFrom = createRequire(
        path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
    );
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
    page.on("console", (m) => consoleMsgs.push(`[${m.type()}] ${m.text()}`));
    page.on("pageerror", (e) => pageErrors.push(String(e.stack || e)));

    await page.addInitScript((ck) => {
        try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {}
    }, CTRL_KEY);

    // ── SCENARIO A: land on cube, switch → easing via the nav dropdown ──
    log("\n=== SCENARIO A: cube → easing (via nav dropdown) ===");
    await page.goto(`${base}/#/cube`, { waitUntil: "load" });
    await page.waitForTimeout(1200);

    // Open the scene nav dropdown (top-center "Cube ▾").
    const navOpened = await (async () => {
        try {
            // The scene nav trigger carries the active superKey label + a chevron.
            await page.getByRole("combobox").first().click({ timeout: 2000 }).catch(() => {});
            await page.waitForTimeout(300);
            const items = await page.evaluate(() =>
                Array.from(document.querySelectorAll('[role="option"], [data-slot="select-item"]'))
                    .map((i) => i.textContent.trim()));
            return items;
        } catch (e) { return { err: String(e.message || e) }; }
    })();
    log("nav items:", JSON.stringify(navOpened));

    // Click the easing option if present, else hash-navigate.
    let switchedViaNav = false;
    try {
        const opt = page.locator('[role="option"]:has-text("Easing"), [data-slot="select-item"]:has-text("Easing")').first();
        if (await opt.count()) { await opt.click({ timeout: 2000 }); switchedViaNav = true; }
    } catch {}
    if (!switchedViaNav) {
        await page.keyboard.press("Escape").catch(() => {});
        await page.evaluate(() => { location.hash = "#/easing"; });
    }
    await page.waitForTimeout(1400);
    const afterCubeToEasing = await inspectEasingSidebar(page);
    log("easing sidebar after cube→easing:", JSON.stringify(afterCubeToEasing, null, 2));
    await page.screenshot({ path: path.join(SHOTS, "b4-switch-01-cube-to-easing.png") });

    // ── SCENARIO B: now switch easing → amiga (the B2 suspend-crash path) ──
    log("\n=== SCENARIO B: easing → amiga (suspend path) ===");
    const errCountBefore = pageErrors.length;
    switchedViaNav = false;
    try {
        await page.getByRole("combobox").first().click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(300);
        const opt = page.locator('[role="option"]:has-text("Amiga"), [data-slot="select-item"]:has-text("Amiga")').first();
        if (await opt.count()) { await opt.click({ timeout: 2000 }); switchedViaNav = true; }
    } catch {}
    if (!switchedViaNav) {
        await page.keyboard.press("Escape").catch(() => {});
        await page.evaluate(() => { location.hash = "#/amiga"; });
    }
    await page.waitForTimeout(1400);
    const amigaState = await page.evaluate(() => {
        const machine = (() => { try { return JSON.parse(localStorage.getItem("keyframes-js-scene-machine") || "{}"); } catch { return {}; } })();
        // After landing on amiga, do the easing controls linger blank anywhere?
        const easingResidue = document.querySelector(".easing-editor");
        const anyControls = document.querySelector('[class*="control"], .panel-content');
        return {
            activeScene: machine.activeScene ?? null,
            status: machine.status ?? null,
            easingResiduePresent: !!easingResidue,
            anyControlsPresent: !!anyControls,
        };
    });
    log("amiga state:", JSON.stringify(amigaState, null, 2));
    log("pageerrors during easing→amiga switch:", pageErrors.length - errCountBefore);
    await page.screenshot({ path: path.join(SHOTS, "b4-switch-02-easing-to-amiga.png") });

    // ── SCENARIO C: switch BACK amiga → easing, confirm editor returns ──
    log("\n=== SCENARIO C: amiga → easing (return) ===");
    switchedViaNav = false;
    try {
        await page.getByRole("combobox").first().click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(300);
        const opt = page.locator('[role="option"]:has-text("Easing"), [data-slot="select-item"]:has-text("Easing")').first();
        if (await opt.count()) { await opt.click({ timeout: 2000 }); switchedViaNav = true; }
    } catch {}
    if (!switchedViaNav) {
        await page.keyboard.press("Escape").catch(() => {});
        await page.evaluate(() => { location.hash = "#/easing"; });
    }
    await page.waitForTimeout(1400);
    const returnState = await inspectEasingSidebar(page);
    log("easing sidebar after amiga→easing:", JSON.stringify(returnState, null, 2));
    await page.screenshot({ path: path.join(SHOTS, "b4-switch-03-amiga-to-easing.png") });

    // ── DUMP ──
    log("\n── CONSOLE (all) ──");
    for (const m of consoleMsgs) log("  " + m);
    log("\n── PAGEERROR (all) ──");
    for (const e of pageErrors) log("  " + e);

    await ctx.close();
    await browser.close();
    server.close();
    log("\nDONE.");
})().catch((e) => { console.error("PROBE FAILED:", e); process.exit(1); });
