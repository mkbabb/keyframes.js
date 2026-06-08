#!/usr/bin/env node
/**
 * ROOT-CAUSE PROBE [rc-easing-editor] VMODEL — the panel stays data-state=inactive
 * DURABLY (not a transient race) while store.selectedControl==="easing". Two
 * possible durable causes remain:
 *   (A) The AnimationControls <Tabs> instance that HOSTS the easing TabsContent is
 *       a DIFFERENT instance than the one whose model-value is "easing" — i.e. the
 *       slotted easing TabsContent is parented under a Tabs root bound to a STALE
 *       store (e.g. the leaving scene's group, or a default-keyed store whose
 *       selectedControl is "controls").
 *   (B) reka useVModel latched passive(modelValue===undefined) at mount AND the
 *       slotted TabsContent's isSelected computed compares against a modelValue
 *       that never became "easing" for THAT root.
 *
 * We resolve A vs B by: enumerating EVERY [data-orientation=horizontal] Tabs root,
 * reading (via the value attr on its descendant tabpanels) which value each root
 * believes active, and which root actually CONTAINS the easing TabsContent. If the
 * easing TabsContent sits under a root whose other panels are 'active' for a
 * DIFFERENT value, that's a wrong-host / stale-store parenting (A).
 *
 * Run: KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
 *        node docs/tranches/I/audit/investigate/probes/rc-easing-editor-vmodel.mjs
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
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

const enumerate = (page) => page.evaluate(() => {
    // Find the controls pane and all Tabs roots within it.
    const pane = document.querySelector(".controls-pane") || document.body;
    const roots = Array.from(pane.querySelectorAll('[data-orientation="horizontal"]'));
    const out = roots.map((root, i) => {
        const panels = Array.from(root.querySelectorAll(':scope [role="tabpanel"]')).map((el) => ({
            value: el.getAttribute("value") || el.id || null,
            state: el.getAttribute("data-state"),
            display: getComputedStyle(el).display,
            hasEasing: !!el.querySelector(".easing-curve-canvas"),
            hidden: el.hasAttribute("hidden"),
        }));
        const triggers = Array.from(root.querySelectorAll(':scope [role="tab"]')).map((t) => ({
            text: t.textContent.trim().slice(0, 16), state: t.getAttribute("data-state"),
        }));
        const containsEasingContent = !!root.querySelector('[id*="content-easing"]');
        return { rootIndex: i, panelCount: panels.length, panels, triggerCount: triggers.length, triggers, containsEasingContent };
    });
    const ctrlRaw = (() => { try { return JSON.parse(localStorage.getItem("animation-groups-control-options-store") || "{}"); } catch { return {}; } })();
    return {
        easing_selectedControl: ctrlRaw["Easing"]?.selectedControl ?? null,
        easing_selectedAnimation: ctrlRaw["Easing"]?.selectedAnimation ?? null,
        rootCount: out.length,
        // Only show roots that have panels or contain easing content.
        rootsOfInterest: out.filter((r) => r.panelCount > 0 || r.containsEasingContent),
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

    log("\n=== FRESH #/easing — Tabs roots ===");
    await page.goto(`${base}/#/easing`, { waitUntil: "load" });
    await page.waitForTimeout(1800);
    log(JSON.stringify(await enumerate(page), null, 2));

    log("\n=== SWITCH cube → Easing — Tabs roots ===");
    await page.goto(`${base}/#/cube`, { waitUntil: "load" });
    await page.waitForTimeout(1500);
    await dockSwitch(page, "Easing");
    log(JSON.stringify(await enumerate(page), null, 2));

    await ctx.close(); await browser.close(); server.close();
    log("\nDONE.");
})().catch((e) => { console.error("PROBE FAILED:", e); process.exit(1); });
