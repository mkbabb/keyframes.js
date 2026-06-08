#!/usr/bin/env node
/**
 * ROOT-CAUSE PROBE [rc-easing-editor] DEEP — the discriminator showed:
 *   selectedControl === "easing" (correct, NOT a Tabs-model desync) BUT
 *   the TabsContent easing panel renders data-state="inactive" AND
 *   selectedAnimation flips "" (fresh) → null (switched).
 *
 * The EasingSidebar's TabsContent is slotted INSIDE <AnimationControls>, which is
 * itself wrapped in `<div v-show="selectedAnimation == name">` (ControlsPaneWrapper).
 * The AnimationControls instances are keyed by the GROUP's animation NAMES. The
 * easing scene's contract anim is "Easing Preview". This probe answers:
 *   (a) Is the <AnimationControls> host for "Easing Preview" in the DOM at all?
 *   (b) What is its wrapping v-show div's display (none = gated out)?
 *   (c) What is the reka <Tabs> root's resolved value attr / active trigger?
 *   (d) Does forcing selectedAnimation="Easing Preview" in the store + a tick
 *       bring the editor back? (proves the v-show gate is THE cause)
 *
 * Run: KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
 *        node docs/tranches/I/audit/investigate/probes/rc-easing-editor-deep.mjs
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

async function deepInspect(page) {
    return page.evaluate(() => {
        const ctrlRaw = (() => { try { return JSON.parse(localStorage.getItem("animation-groups-control-options-store") || "{}"); } catch { return {}; } })();
        const easingStore = ctrlRaw["Easing"] || null;
        // The v-show wrappers around each AnimationControls — find any with an easing tabpanel inside or any with display:none.
        const tabsRoots = Array.from(document.querySelectorAll('[data-slot="tabs"], [data-orientation="horizontal"]'));
        const panels = Array.from(document.querySelectorAll('[role="tabpanel"]')).map((el) => {
            // climb to the nearest v-show wrapper (a plain div whose style.display we can read)
            let host = el;
            let hiddenAncestor = null;
            while (host && host !== document.body) {
                const disp = getComputedStyle(host).display;
                if (disp === "none") { hiddenAncestor = host.className || host.tagName; break; }
                host = host.parentElement;
            }
            return {
                value: el.getAttribute("value") || el.id || null,
                state: el.getAttribute("data-state"),
                inlineDisplay: el.style.display || null,
                hiddenByAncestor: hiddenAncestor,
                hasEasingCanvas: !!el.querySelector(".easing-curve-canvas"),
            };
        });
        // The reka Tabs root resolved value: reka tabs sets data-state on triggers; read the active trigger.
        const triggers = Array.from(document.querySelectorAll('[role="tab"]')).map((t) => ({ text: t.textContent.trim().slice(0, 20), state: t.getAttribute("data-state"), value: t.getAttribute("value") || t.id }));
        return {
            easingStore_selectedControl: easingStore?.selectedControl ?? null,
            easingStore_selectedAnimation: easingStore?.selectedAnimation ?? null,
            tabsRootCount: tabsRoots.length,
            panels,
            triggers,
            easingCanvasInDom: !!document.querySelector(".easing-curve-canvas"),
        };
    });
}

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

    await page.goto(`${base}/#/cube`, { waitUntil: "load" });
    await page.waitForTimeout(1500);
    await dockSwitch(page, "Easing");
    log("\n=== AFTER switch cube → Easing (deep) ===");
    log(JSON.stringify(await deepInspect(page), null, 2));

    // === FORCE selectedAnimation = "Easing Preview" + nudge selectedControl, see if editor returns ===
    log("\n=== FORCE store.Easing.selectedAnimation='Easing Preview' ===");
    await page.evaluate(() => {
        const raw = JSON.parse(localStorage.getItem("animation-groups-control-options-store") || "{}");
        if (raw["Easing"]) { raw["Easing"].selectedAnimation = "Easing Preview"; raw["Easing"].selectedControl = "easing"; }
        localStorage.setItem("animation-groups-control-options-store", JSON.stringify(raw));
    });
    // The store is a useStorage ref; a same-tab localStorage.setItem does NOT
    // trigger reactivity. Re-enter the scene to re-read the store (amiga → easing).
    await dockSwitch(page, "Amiga");
    await dockSwitch(page, "Easing");
    log("after forcing selectedAnimation + round-trip:");
    log(JSON.stringify(await deepInspect(page), null, 2));
    await page.screenshot({ path: path.join(SHOTS, "rc-easing-forced.png") });

    await ctx.close(); await browser.close(); server.close();
    log("\nDONE.");
})().catch((e) => { console.error("PROBE FAILED:", e); process.exit(1); });
