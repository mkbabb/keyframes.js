#!/usr/bin/env node
/**
 * INVESTIGATION PROBE — B4: /easing LOST the curve/timing editor.
 *
 * Models the proven harness (scripts/proof-no-orphan-specular.mjs): serveDist on
 * an ephemeral port + chromium via createRequire(KF_PLAYWRIGHT_DIR).require(
 * "playwright-core") + openSceneFresh navigating `${base}/#/easing`.
 *
 * Goal: reproduce the ACTUAL runtime state of the easing sidebar. Capture:
 *   • page.on("console") + page.on("pageerror") verbatim
 *   • does the EasingSelect dropdown exist? open it? select cubic-bezier?
 *   • does the EasingCurveCanvas render? does it carry draggable handles
 *     (.control-point.handle — the bezier-edit affordance)?
 *   • try dragging a handle: does the curve change / does selecting cubic-bezier
 *     surface the editable handles?
 *   • screenshot to ../shots/.
 *
 * Run: KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
 *        node docs/tranches/I/audit/investigate/probes/b4-easing-lost-editor.mjs
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
    ".html": "text/html",
    ".js": "text/javascript",
    ".mjs": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
    ".ttf": "font/ttf",
    ".map": "application/json",
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

async function openSceneFresh(browser, base, scene, vw) {
    const ctx = await browser.newContext({ viewport: { width: vw, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript((ck) => {
        try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {}
    }, CTRL_KEY);
    await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
    await page
        .waitForFunction(
            ([mk, s]) => {
                try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s; }
                catch { return false; }
            },
            [MACHINE_KEY, scene],
            { timeout: 8000 },
        )
        .catch(() => {});
    await page.waitForTimeout(900);
    return { ctx, page };
}

const log = (...a) => console.log(...a);

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
    const consoleMsgs = [];
    const pageErrors = [];

    const { ctx, page } = await openSceneFresh(browser, base, "easing", 1440);
    page.on("console", (m) => consoleMsgs.push(`[${m.type()}] ${m.text()}`));
    page.on("pageerror", (e) => pageErrors.push(String(e.stack || e)));

    // Re-settle so the listeners attached above catch interaction-time messages.
    await page.waitForTimeout(400);

    // ── 1. INVENTORY: what controls EXIST in the easing sidebar right now? ──
    const inventory = await page.evaluate(() => {
        const q = (sel) => Array.from(document.querySelectorAll(sel));
        const vis = (el) => {
            if (!el) return false;
            const r = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none";
        };
        const editor = document.querySelector(".easing-editor");
        const canvas = document.querySelector(".easing-curve-canvas");
        const handles = q(".easing-curve-canvas .control-point.handle");
        const bezierPath = document.querySelector(".easing-curve-canvas .bezier-path");
        // EasingSelect renders a reka SelectTrigger; find the one carrying the curve glyph.
        const triggers = q('[data-slot="select-trigger"], [role="combobox"], button[aria-haspopup]');
        const easingTrigger = q(".easing-trigger-label").map((s) => s.closest("button") || s.parentElement)[0]
            || triggers.find((t) => t.querySelector("svg path"));
        const durationSliders = q(".duration-field, .labeled-field.duration-field");
        const labels = q(".easing-editor label, .easing-editor .text-mono-small").map((l) => l.textContent.trim());
        // Confirm the J-removed bits are gone (text "value" input, copy, h2 title).
        const valueInput = q('.easing-editor input.css-value-input, .easing-editor .value-field');
        const h2Title = q(".easing-editor h2");
        return {
            editorPresent: !!editor,
            editorVisible: vis(editor),
            canvasPresent: !!canvas,
            canvasVisible: vis(canvas),
            handleCount: handles.length,
            handlesVisible: handles.map(vis),
            bezierPathPresent: !!bezierPath,
            bezierPathD: bezierPath?.getAttribute("d") || null,
            easingTriggerPresent: !!easingTrigger,
            easingTriggerText: easingTrigger?.textContent.trim().slice(0, 60) || null,
            durationSliderCount: durationSliders.length,
            labels,
            jRemoved_valueInputCount: valueInput.length,
            jRemoved_h2Count: h2Title.length,
            // Whole easing sidebar text (truncated) to see what the user actually sees.
            sidebarText: (editor?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 300),
        };
    });
    log("\n── INVENTORY (easing sidebar, curve='ease' default) ──");
    log(JSON.stringify(inventory, null, 2));

    await page.screenshot({ path: path.join(SHOTS, "b4-easing-01-default.png"), fullPage: false });

    // ── 2. OPEN the EasingSelect dropdown + select cubic-bezier ──
    let selectOpened = false, bezierItemFound = false, selectError = null;
    try {
        // Click the easing trigger (the curve-glyph select).
        const trig = page.locator(".easing-trigger-label").first();
        await trig.click({ timeout: 3000 });
        await page.waitForTimeout(400);
        selectOpened = await page.evaluate(() =>
            !!document.querySelector('[role="listbox"], [data-slot="select-content"], [data-reka-popper-content-wrapper]'),
        );
        // Find a cubic-bezier item.
        const itemTexts = await page.evaluate(() =>
            Array.from(document.querySelectorAll('[role="option"], [data-slot="select-item"]'))
                .map((i) => i.textContent.trim()),
        );
        log("\n── DROPDOWN items (first 40) ──");
        log(JSON.stringify(itemTexts.slice(0, 40), null, 2));
        bezierItemFound = itemTexts.some((t) => /cubic-bezier/i.test(t));
        if (bezierItemFound) {
            const item = page.locator('[role="option"]:has-text("cubic-bezier"), [data-slot="select-item"]:has-text("cubic-bezier")').first();
            await item.click({ timeout: 3000 });
            await page.waitForTimeout(500);
        } else {
            await page.keyboard.press("Escape").catch(() => {});
        }
    } catch (e) {
        selectError = String(e.message || e);
    }
    log(`\nselectOpened=${selectOpened} bezierItemFound=${bezierItemFound} selectError=${selectError}`);

    // ── 3. After selecting cubic-bezier: are editable handles present now? ──
    const afterBezier = await page.evaluate(() => {
        const handles = Array.from(document.querySelectorAll(".easing-curve-canvas .control-point.handle"));
        const bezierPath = document.querySelector(".easing-curve-canvas .bezier-path");
        const machine = (() => { try { return JSON.parse(localStorage.getItem("keyframes-js-scene-machine") || "{}"); } catch { return {}; } })();
        return {
            handleCount: handles.length,
            bezierPathD: bezierPath?.getAttribute("d") || null,
            currentCurveLabel:
                document.querySelector(".easing-trigger-label span[title]")?.getAttribute("title")
                || document.querySelector(".easing-trigger-label")?.textContent.trim().slice(0, 40)
                || null,
            machineStatus: machine.status ?? null,
        };
    });
    log("\n── AFTER selecting cubic-bezier ──");
    log(JSON.stringify(afterBezier, null, 2));
    await page.screenshot({ path: path.join(SHOTS, "b4-easing-02-bezier.png"), fullPage: false });

    // ── 4. DRAG a bezier handle (if present) and see if the curve changes ──
    let dragResult = null;
    if (afterBezier.handleCount > 0) {
        const before = afterBezier.bezierPathD;
        const box = await page.evaluate(() => {
            const h = document.querySelector(".easing-curve-canvas .control-point.handle");
            const r = h.getBoundingClientRect();
            return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        });
        await page.mouse.move(box.x, box.y);
        await page.mouse.down();
        await page.mouse.move(box.x + 40, box.y - 60, { steps: 8 });
        await page.mouse.up();
        await page.waitForTimeout(300);
        const after = await page.evaluate(() =>
            document.querySelector(".easing-curve-canvas .bezier-path")?.getAttribute("d") || null,
        );
        dragResult = { before, after, changed: before !== after };
    }
    log("\n── DRAG handle result ──");
    log(JSON.stringify(dragResult, null, 2));
    await page.screenshot({ path: path.join(SHOTS, "b4-easing-03-after-drag.png"), fullPage: false });

    // ── 5. CONSOLE + PAGEERROR dump ──
    log("\n── CONSOLE (during interaction) ──");
    for (const m of consoleMsgs) log("  " + m);
    log("\n── PAGEERROR ──");
    for (const e of pageErrors) log("  " + e);

    await ctx.close();
    await browser.close();
    server.close();
    log("\nDONE. shots in:", SHOTS);
})().catch((e) => {
    console.error("PROBE FAILED:", e);
    process.exit(1);
});
