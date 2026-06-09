#!/usr/bin/env node
/**
 * ROOT-CAUSE PROBE [rc-easing-editor] — discriminate WHY the EasingSidebar blanks
 * on a dock-switch INTO easing. Three competing hypotheses from the investigate
 * findings:
 *   H1 (B4)  — the <Tabs> root model-value (selectedControl) desyncs → TabsContent
 *              value="easing" never mounts.
 *   H2 (new) — the EasingSidebar lives INSIDE AnimationControls, which is
 *              v-show="selectedAnimation == name" (ControlsPaneWrapper:63). If
 *              selectedAnimation for the "Easing" superKey is NOT "Easing Preview"
 *              after the swap, the WHOLE AnimationControls subtree (incl. the
 *              slotted TabsContent) is display:none → sidebar blank, while the
 *              RibbonBar (gated only by v-if="selectedAnimation", outside the
 *              v-for/v-show) survives.
 *   H3 (B2)  — the _gen unbound-stop crash poisons the flush mid-swap → partial mount.
 *
 * This probe reads, at the moment the sidebar blanks: the per-superKey store
 * (selectedControl + selectedAnimation), the presence of the AnimationControls
 * host vs the ribbon, the Tabs root data-state, and the _gen error co-fire.
 *
 * Run: KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
 *        node docs/tranches/I/audit/investigate/probes/rc-easing-editor-gate.mjs
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

async function snapshot(page, tag) {
    return page.evaluate((tag) => {
        const ctrlRaw = (() => { try { return JSON.parse(localStorage.getItem("animation-groups-control-options-store") || "{}"); } catch { return {}; } })();
        const machine = (() => { try { return JSON.parse(localStorage.getItem("keyframes-js-scene-machine") || "{}"); } catch { return {}; } })();
        const easingStore = ctrlRaw["Easing"] || null;
        const tabsRoot = document.querySelector('[data-slot="tabs"], [role="tablist"]')?.closest('[data-slot="tabs"]')
            || document.querySelector('.controls-pane [data-orientation]');
        // The Tabs root carries the model-value; the TabsContent for easing:
        const easingPanel = document.querySelector('[data-slot="tabs-content"][value="easing"], [id*="content-easing"], [data-state][role="tabpanel"]');
        const allTabPanels = Array.from(document.querySelectorAll('[role="tabpanel"]')).map((el) => ({
            state: el.getAttribute("data-state"),
            value: el.getAttribute("value") || el.id || null,
            hasEasingCanvas: !!el.querySelector(".easing-curve-canvas"),
        }));
        return {
            tag,
            activeScene: machine.activeScene ?? null,
            status: machine.status ?? null,
            easingStore_selectedControl: easingStore?.selectedControl ?? null,
            easingStore_selectedAnimation: easingStore?.selectedAnimation ?? null,
            easingStore_isControlsPanelOpen: easingStore?.isControlsPanelOpen ?? null,
            // DOM gates:
            easingEditorPresent: !!document.querySelector(".easing-editor"),
            easingCanvasPresent: !!document.querySelector(".easing-curve-canvas"),
            handleCount: document.querySelectorAll(".easing-curve-canvas .control-point.handle").length,
            // The ribbon (the survivor): scrubber + Pause/Reverse:
            ribbonPresent: !!document.querySelector(".btn-playback, [class*='playback-ribbon'], .animation-visualizer"),
            // Any tabpanel at all in the controls pane?
            tabPanelCount: allTabPanels.length,
            tabPanels: allTabPanels,
            // The control-pane host:
            controlsPanePresent: !!document.querySelector(".controls-pane"),
            // Pull selectedControl from a tab list active trigger if present:
            activeTabTrigger: document.querySelector('[role="tab"][data-state="active"]')?.textContent?.trim()?.slice(0, 24) ?? null,
        };
    }, tag);
}

async function dockSwitch(page, label) {
    const dock = page.locator('.glass-dock, [class*="glass-dock"], [aria-label="Scene"]').first();
    try { await dock.scrollIntoViewIfNeeded({ timeout: 1500 }); } catch {}
    const box = await dock.boundingBox().catch(() => null);
    if (box) { await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); }
    else { const vp = page.viewportSize(); await page.mouse.move(vp.width / 2, vp.height - 40); }
    await page.waitForTimeout(600);
    const trigger = page.locator('[aria-label="Scene"]').first();
    await trigger.click({ timeout: 8000 });
    await page.waitForTimeout(350);
    const opt = page.locator(`[role="option"]:has-text("${label}"), [data-slot="select-item"]:has-text("${label}")`).first();
    const n = await opt.count();
    if (!n) { await page.keyboard.press("Escape").catch(() => {}); return { clicked: false, optionCount: n }; }
    await opt.click({ timeout: 6000 });
    await page.waitForTimeout(1700);
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
    const errors = [];
    const gen = [];
    page.on("console", (m) => { const t = m.text(); if (t.includes("_gen") || t.includes("......") || t.includes("KeyframesString")) gen.push(`[${m.type()}] ${t.slice(0, 120)}`); });
    page.on("pageerror", (e) => { errors.push(String(e.stack || e).slice(0, 200)); });

    await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);

    // === FRESH load of easing (the working baseline) ===
    log("\n=== FRESH easing (#/easing) ===");
    await page.goto(`${base}/#/easing`, { waitUntil: "load" });
    await page.waitForTimeout(1800);
    const fresh = await snapshot(page, "fresh-easing");
    log(JSON.stringify(fresh, null, 2));

    // === land cube, then dock-switch INTO easing (the broken path) ===
    log("\n=== reload cube, dock-switch cube → Easing ===");
    await page.goto(`${base}/#/cube`, { waitUntil: "load" });
    await page.waitForTimeout(1500);
    const errBefore = errors.length, genBefore = gen.length;
    const sw = await dockSwitch(page, "Easing");
    log("dock switch:", JSON.stringify(sw));
    const afterSwitch = await snapshot(page, "switched-into-easing");
    log(JSON.stringify(afterSwitch, null, 2));
    log("NEW pageerrors during switch:", errors.length - errBefore);
    log("NEW _gen/dots/keyframes console during switch:", gen.length - genBefore);
    await page.screenshot({ path: path.join(SHOTS, "rc-easing-switched.png") });

    log("\n── _gen / '......' / KeyframesString console ──");
    for (const m of gen) log("  " + m);
    log("\n── PAGEERRORS ──");
    for (const e of errors) log("  " + e);

    log("\n── VERDICT DISCRIMINATOR ──");
    log("fresh: editor=%s control=%s anim=%s", fresh.easingEditorPresent, fresh.easingStore_selectedControl, fresh.easingStore_selectedAnimation);
    log("switched: editor=%s control=%s anim=%s ribbon=%s panels=%s", afterSwitch.easingEditorPresent, afterSwitch.easingStore_selectedControl, afterSwitch.easingStore_selectedAnimation, afterSwitch.ribbonPresent, afterSwitch.tabPanelCount);

    await ctx.close();
    await browser.close();
    server.close();
    log("\nDONE.");
})().catch((e) => { console.error("PROBE FAILED:", e); process.exit(1); });
