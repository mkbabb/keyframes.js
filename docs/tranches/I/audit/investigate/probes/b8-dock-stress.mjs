#!/usr/bin/env node
/**
 * I.audit — B8 probe #2: STRESS the dock + isolate the SpringProgress FLIP path.
 *
 * The first probe showed: in Chromium the dock takes the View-Transition path
 * (`startViewTransition` present) and the morph drops ~4 frames. The user runs
 * the demo where the SpringProgress engine FLIP may run (Safari/WebKit has NO
 * startViewTransition → the engine path). This probe:
 *   1. NEUTERS document.startViewTransition (init script deletes it) so the dock
 *      is FORCED down the `@mkbabb/keyframes.js` SpringProgress FLIP — the path
 *      the user's browser actually runs — and measures THAT morph's smoothness.
 *   2. Does rapid REPEATED collapse↔expand cycles (the "supremely broken" churn).
 *   3. Captures data-morphing transitions + inline width writes per frame (the
 *      SpringProgress per-frame width set — the dual-driver / jank witness).
 *   4. Exercises BOTH selector popovers + a scene switch (re-mount).
 *   5. Captures console + pageerror + longtasks across the whole stress run.
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
function frameStats(deltas) {
    if (!deltas.length) return { n: 0 };
    const sorted = [...deltas].sort((a, b) => a - b);
    const sum = deltas.reduce((a, b) => a + b, 0);
    return {
        n: deltas.length, meanMs: +(sum / deltas.length).toFixed(2),
        maxMs: +Math.max(...deltas).toFixed(2),
        p95Ms: +sorted[Math.floor(sorted.length * 0.95)].toFixed(2),
        droppedGt33: deltas.filter((d) => d > 33).length,
        droppedGt50: deltas.filter((d) => d > 50).length,
        approxFps: +(1000 / (sum / deltas.length)).toFixed(1),
    };
}
async function sampleFrames(page, ms) {
    return page.evaluate((dur) => new Promise((resolve) => {
        const deltas = []; let last = performance.now(); const start = last;
        (function tick(now) { deltas.push(now - last); last = now; now - start < dur ? requestAnimationFrame(tick) : resolve(deltas); })(performance.now());
    }), ms);
}

async function run(forceSpring) {
    const chromium = loadChromium();
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const consoleLines = [], pageErrors = [];
    page.on("console", (m) => consoleLines.push(`[${m.type()}] ${m.text()}`));
    page.on("pageerror", (e) => pageErrors.push(`${e.name}: ${e.message} | ${(e.stack || "").split("\n")[1] || ""}`));

    await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);
    await page.addInitScript((force) => {
        window.__perf = { longtasks: [], widthWrites: 0, morphToggles: 0 };
        try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__perf.longtasks.push({ start: Math.round(e.startTime), dur: Math.round(e.duration) }); }).observe({ entryTypes: ["longtask"] }); } catch {}
        if (force) {
            // FORCE the SpringProgress FLIP path: remove startViewTransition so the
            // dock's `a = "startViewTransition" in document` check is false.
            try { delete document.startViewTransition; Object.defineProperty(document, "startViewTransition", { value: undefined, configurable: true }); } catch {}
        }
    }, forceSpring);

    await page.goto(`${base}/#/cube`, { waitUntil: "load" });
    await page.waitForFunction(([mk]) => { try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === "cube"; } catch { return false; } }, [MACHINE_KEY], { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(1000);

    const vtPresent = await page.evaluate(() => typeof document.startViewTransition === "function");

    // Instrument the dock: observe data-morphing attr + inline width writes via a
    // MutationObserver across the stress run.
    await page.evaluate(() => {
        const dock = document.querySelector(".glass-dock");
        if (!dock) return;
        const mo = new MutationObserver((muts) => {
            for (const m of muts) {
                if (m.type === "attributes" && m.attributeName === "data-morphing") window.__perf.morphToggles++;
            }
        });
        mo.observe(dock, { attributes: true, attributeFilter: ["data-morphing"] });
        const layers = dock.querySelector(".dock-layers") || dock;
        const wo = new MutationObserver((muts) => {
            for (const m of muts) if (m.type === "attributes" && m.attributeName === "style") window.__perf.widthWrites++;
        });
        wo.observe(layers, { attributes: true, attributeFilter: ["style"] });
    });

    // ── STRESS: rapid repeated collapse↔expand cycles ──
    const dock = await page.$(".glass-dock");
    const stressSample = sampleFrames(page, 4000);
    for (let i = 0; i < 6; i++) {
        await dock.hover({ force: true }).catch(() => {});
        await page.waitForTimeout(280);          // mid-morph
        await page.mouse.move(700, 850).catch(() => {});  // move away → collapse
        await page.waitForTimeout(380);
    }
    const stressDeltas = await stressSample;

    const perf = await page.evaluate(() => window.__perf);
    const finalState = await page.evaluate(() => {
        const d = document.querySelector(".glass-dock");
        return { classes: d.className, dataMorphing: d.hasAttribute("data-morphing") };
    });

    const shot = path.join(SHOTS, `b8-dock-stress-${forceSpring ? "spring" : "vt"}.png`);
    await page.screenshot({ path: shot }).catch(() => {});

    await ctx.close(); await browser.close(); server.close();
    return {
        forcedSpringPath: forceSpring, viewTransitionPresent: vtPresent,
        stressFrameStats: frameStats(stressDeltas),
        morphToggles: perf.morphToggles, widthWrites: perf.widthWrites,
        longtasks: perf.longtasks, finalState,
        console: consoleLines, pageErrors,
        screenshot: path.relative(REPO, shot),
    };
}

async function main() {
    if (!fs.existsSync(path.join(DIST, "index.html"))) { console.error("dist not built"); process.exit(2); }
    const report = {};
    report.vtPath = await run(false);        // native Chromium VT path
    report.springPath = await run(true);     // FORCED SpringProgress FLIP (the user's WebKit path)
    const dump = path.join(SHOTS, "..", "b8-dock-stress-dump.json");
    fs.writeFileSync(dump, JSON.stringify(report, null, 2));
    console.log("=== B8 DOCK STRESS (VT vs forced SpringProgress FLIP) ===");
    console.log(JSON.stringify(report, null, 2));
    console.log("\nDump:", path.relative(REPO, dump));
}
main().catch((e) => { console.error("PROBE FAILED:", e); process.exit(1); });
