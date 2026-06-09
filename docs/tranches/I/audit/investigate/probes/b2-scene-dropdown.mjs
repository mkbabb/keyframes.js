#!/usr/bin/env node
/**
 * TEMP PROBE — B2 via the REAL "Scene" dropdown selection (the genuine
 * switchScene path the user clicks). Open the dock "Scene" select, pick a
 * different scene while the current one is PLAYING → captureActive →
 * adapter.suspend → (hypothesis) RAFPlayback method invoked unbound → _gen crash.
 *
 * Also instruments errors with stack capture + a settle wait so the source map
 * resolves frames in dist.
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

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".ttf": "font/ttf", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".map": "application/json" };
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

async function openSceneSelectAndPick(page, sceneLabel) {
    // The "Scene" select trigger (aria-label="Scene").
    const trigger = await page.$('button[aria-label="Scene"]');
    if (!trigger) return { ok: false, reason: "no Scene trigger" };
    await trigger.click({ force: true });
    await page.waitForTimeout(400);
    // The dropdown items render as role=option or in a listbox. Click the one
    // whose text matches the scene label (case-insensitive contains).
    const picked = await page.evaluate((label) => {
        const opts = [...document.querySelectorAll('[role="option"], [role="menuitem"], li, [data-radix-collection-item]')];
        const want = label.toLowerCase();
        const match = opts.find((o) => (o.textContent || "").trim().toLowerCase().includes(want));
        if (match) { match.scrollIntoView(); match.click(); return (match.textContent || "").trim(); }
        return null;
    }, sceneLabel);
    return { ok: !!picked, picked };
}

async function main() {
    const requireFrom = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
    let chromium;
    try { ({ chromium } = requireFrom("playwright-core")); } catch { ({ chromium } = requireFrom("@playwright/test")); }

    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const out = { switches: [] };

    try {
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await ctx.newPage();
        const pageerrors = [];
        page.on("pageerror", (err) => pageerrors.push({ message: err.message, stack: err.stack }));

        await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);
        await page.goto(`${base}/#/easing`, { waitUntil: "load" });
        await page.waitForFunction(([mk, s]) => { try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s; } catch { return false; } }, [MACHINE_KEY, "easing"], { timeout: 8000 }).catch(() => {});
        await page.waitForTimeout(1000);

        // Ensure easing is PLAYING (it autoPlays, but confirm via the machine).
        const playingBefore = await page.evaluate(() => { try { const m = JSON.parse(localStorage.getItem("keyframes-js-scene-machine") || "{}"); return m.perScene?.easing?.playing; } catch { return null; } });

        // Switch easing → amiga via the Scene dropdown (the user's exact gesture).
        const before = pageerrors.length;
        const pick = await openSceneSelectAndPick(page, "amiga");
        await page.waitForTimeout(1300);
        const afterErrors = pageerrors.slice(before);
        const stateAfter = await page.evaluate(() => {
            let m = null; try { m = JSON.parse(localStorage.getItem("keyframes-js-scene-machine") || "null"); } catch {}
            return {
                activeScene: m?.activeScene,
                sliders: document.querySelectorAll('input[type="range"], [role="slider"]').length,
                selects: document.querySelectorAll('select, [role="combobox"], button[role="combobox"]').length,
                // Are amiga controls visibly empty? Probe the controls panel content.
                controlsText: (document.querySelector('[class*="controls-panel" i], [class*="ControlsPane" i], [class*="controls" i]')?.textContent || "").trim().slice(0, 120),
            };
        });
        await page.screenshot({ path: path.join(SHOTS, "b2-dropdown-easing-to-amiga.png") });
        out.switches.push({ from: "easing", to: "amiga", playingBefore, pick, newErrors: afterErrors, stateAfter });

        // Now do it again the OTHER way: switch amiga → easing (group adapter path).
        const before2 = pageerrors.length;
        const pick2 = await openSceneSelectAndPick(page, "cube");
        await page.waitForTimeout(1200);
        out.switches.push({ from: "amiga", to: "cube", pick: pick2, newErrors: pageerrors.slice(before2) });

        // And cube(playing) → easing.
        for (const sel of ['[class*="menubar"] button', 'button[aria-label*="lay" i]']) {
            const el = await page.$(sel); if (el) { try { await el.click({ force: true, timeout: 1000 }); break; } catch {} }
        }
        await page.waitForTimeout(500);
        const before3 = pageerrors.length;
        const pick3 = await openSceneSelectAndPick(page, "easing");
        await page.waitForTimeout(1200);
        out.switches.push({ from: "cube", to: "easing", pick: pick3, newErrors: pageerrors.slice(before3) });

        out.allErrors = pageerrors;
        await ctx.close();
    } finally {
        await browser.close();
        server.close();
    }
    console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => { console.error("PROBE ERROR:", e); process.exit(1); });
