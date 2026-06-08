#!/usr/bin/env node
/**
 * I.audit — B8 probe #3: trigger a REAL width morph + capture SpringProgress.
 *
 * The dock morph (the keyframes.js SpringProgress FLIP on the non-VT path, or
 * the View-Transition on Chromium) fires when the dock's CONTENT WIDTH changes:
 *   - clicking the collapsed pill (collapsed↔expanded layer swap), and
 *   - toggling the controls panel (the "Controls" select + collapse toggle
 *     appear/disappear → the layer's natural width changes).
 * This probe forces those, FORCING the SpringProgress path (deleting
 * startViewTransition), and records every per-frame inline `width` write the
 * spring makes on `.dock-layers` plus the frame deltas during the morph window.
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
const MACHINE_KEY = "keyframes-js-scene-machine";
const CTRL_KEY = "animation-groups-control-options-store";
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".ttf": "font/ttf", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".map": "application/json" };

function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404).end(); return; }
        res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
        fs.createReadStream(p).pipe(res);
    });
}
function loadChromium() {
    const requireFrom = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
    try { return requireFrom("playwright-core").chromium; } catch { return requireFrom("@playwright/test").chromium; }
}

async function run(forceSpring) {
    const chromium = loadChromium();
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const consoleErr = [];
    page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") consoleErr.push(`[${m.type()}] ${m.text().slice(0, 200)}`); });
    page.on("pageerror", (e) => consoleErr.push(`[pageerror] ${e.message}`));

    await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);
    await page.addInitScript((force) => {
        window.__w = { writes: [], morphStart: 0, morphEnd: 0 };
        if (force) { try { Object.defineProperty(document, "startViewTransition", { value: undefined, configurable: true }); } catch {} }
    }, forceSpring);

    await page.goto(`${base}/#/cube`, { waitUntil: "load" });
    await page.waitForFunction(([mk]) => { try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === "cube"; } catch { return false; } }, [MACHINE_KEY], { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(1200);

    const vtPresent = await page.evaluate(() => typeof document.startViewTransition === "function");

    // Hook the per-frame inline width writes on .dock-layers (the SpringProgress
    // `b(r, `${e}px`)` writes). Record value + timestamp.
    await page.evaluate(() => {
        const dock = document.querySelector(".glass-dock");
        const layers = dock?.querySelector(".dock-layers");
        if (!layers) { window.__w.error = "no .dock-layers"; return; }
        const mo = new MutationObserver((muts) => {
            for (const m of muts) {
                if (m.attributeName === "style") {
                    const w = layers.style.width;
                    window.__w.writes.push({ t: Math.round(performance.now()), w });
                }
            }
        });
        mo.observe(layers, { attributes: true, attributeFilter: ["style"] });
        // Also watch the dock root data-morphing.
        const dmo = new MutationObserver((muts) => {
            for (const m of muts) if (m.attributeName === "data-morphing") {
                if (dock.hasAttribute("data-morphing")) window.__w.morphStart = Math.round(performance.now());
                else window.__w.morphEnd = Math.round(performance.now());
            }
        });
        dmo.observe(dock, { attributes: true, attributeFilter: ["data-morphing"] });
    });

    // ── frame sampler running across the action window ──
    const framesP = page.evaluate(() => new Promise((resolve) => {
        const d = []; let last = performance.now(); const start = last;
        (function tick(now) { d.push(+(now - last).toFixed(2)); last = now; now - start < 5000 ? requestAnimationFrame(tick) : resolve(d); })(performance.now());
    }));

    // ── ACTIONS that change dock content width ──
    // 1. Click collapsed pill → expand (layer swap, width grows).
    const dock = await page.$(".glass-dock");
    await dock.click({ force: true }).catch(() => {});
    await page.waitForTimeout(700);
    // 2. Toggle the controls panel via the dock's first DockIconButton (PanelLeftClose/Open)
    //    → the Controls select appears/disappears → width morph.
    const toggle = await page.$('.glass-dock button[title*="ontrol"]');
    if (toggle) {
        for (let i = 0; i < 3; i++) {
            await toggle.click({ force: true }).catch(() => {});
            await page.waitForTimeout(600);
        }
    }
    // 3. Switch the controls-tab selector if present (Controls→Keyframes→Timeline) → width morph
    const ctrlSel = await page.$('[aria-label="Controls tab"]');
    if (ctrlSel) {
        await ctrlSel.click({ force: true }).catch(() => {});
        await page.waitForTimeout(400);
        await page.keyboard.press("Escape").catch(() => {});
    }
    await page.waitForTimeout(500);

    const frames = await framesP;
    const w = await page.evaluate(() => window.__w);

    const sorted = [...frames].sort((a, b) => a - b);
    const sum = frames.reduce((a, b) => a + b, 0);
    const stats = {
        n: frames.length, meanMs: +(sum / frames.length).toFixed(2),
        maxMs: Math.max(...frames), p95Ms: sorted[Math.floor(sorted.length * 0.95)],
        droppedGt33: frames.filter((d) => d > 33).length, droppedGt50: frames.filter((d) => d > 50).length,
    };

    const shot = path.join(SHOTS, `b8-morph-real-${forceSpring ? "spring" : "vt"}.png`);
    await page.screenshot({ path: shot }).catch(() => {});

    await ctx.close(); await browser.close(); server.close();
    return {
        forcedSpringPath: forceSpring, viewTransitionPresent: vtPresent,
        widthWriteCount: w.writes?.length ?? 0,
        widthWriteSample: (w.writes ?? []).slice(0, 30),
        morphStart: w.morphStart, morphEnd: w.morphEnd,
        morphDurationMs: w.morphEnd && w.morphStart ? w.morphEnd - w.morphStart : null,
        writeError: w.error ?? null,
        frameStats: stats,
        consoleErr: [...new Set(consoleErr)],
        screenshot: path.relative(REPO, shot),
    };
}

async function main() {
    if (!fs.existsSync(path.join(DIST, "index.html"))) { console.error("dist not built"); process.exit(2); }
    const report = { vt: await run(false), spring: await run(true) };
    const dump = path.join(SHOTS, "..", "b8-dock-morph-real-dump.json");
    fs.writeFileSync(dump, JSON.stringify(report, null, 2));
    console.log("=== B8 DOCK REAL MORPH (VT vs SpringProgress) ===");
    console.log(JSON.stringify(report, null, 2));
    console.log("\nDump:", path.relative(REPO, dump));
}
main().catch((e) => { console.error("PROBE FAILED:", e); process.exit(1); });
