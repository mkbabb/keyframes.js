#!/usr/bin/env node
/**
 * I.audit — B8 probe #4: WEBKIT (the user's actual browser). The user develops
 * on macOS / Safari. WebKit has NO `startViewTransition` → the dock takes the
 * `@mkbabb/keyframes.js` SpringProgress FLIP. WebKit also pays a far higher
 * backdrop-filter compositor cost than Chromium → the "glass-ui elements are
 * slow" report. This probe reproduces BOTH under WebKit:
 *   1. The SpringProgress dock morph (per-frame inline width writes + frame jank).
 *   2. The glass-ui backdrop-filter compositor cost: animate a transform on the
 *      cube while 30 backdrop-filter surfaces are live + sample frames.
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
function loadWebkit() {
    const requireFrom = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
    return requireFrom("playwright-core").webkit;
}
function stats(frames) {
    const sorted = [...frames].sort((a, b) => a - b);
    const sum = frames.reduce((a, b) => a + b, 0);
    return { n: frames.length, meanMs: +(sum / frames.length).toFixed(2), maxMs: +Math.max(...frames).toFixed(2), p95Ms: +sorted[Math.floor(sorted.length * 0.95)].toFixed(2), droppedGt33: frames.filter((d) => d > 33).length, droppedGt50: frames.filter((d) => d > 50).length, approxFps: +(1000 / (sum / frames.length)).toFixed(1) };
}

async function main() {
    if (!fs.existsSync(path.join(DIST, "index.html"))) { console.error("dist not built"); process.exit(2); }
    const webkit = loadWebkit();
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await webkit.launch();
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const consoleErr = [];
    page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") consoleErr.push(`[${m.type()}] ${m.text().slice(0, 200)}`); });
    page.on("pageerror", (e) => consoleErr.push(`[pageerror] ${e.message}`));

    await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);
    await page.addInitScript(() => {
        window.__w = { writes: [], morphStart: 0, morphEnd: 0 };
    });
    await page.goto(`${base}/#/cube`, { waitUntil: "load" });
    await page.waitForFunction(([mk]) => { try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === "cube"; } catch { return false; } }, [MACHINE_KEY], { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1500);

    const env = await page.evaluate(() => ({
        ua: navigator.userAgent.slice(0, 90),
        hasViewTransition: typeof document.startViewTransition === "function",
        backdropFilterCount: [...document.querySelectorAll("*")].filter((el) => { const f = getComputedStyle(el).backdropFilter; return f && f !== "none"; }).length,
    }));

    // Hook per-frame width writes + data-morphing on the dock.
    await page.evaluate(() => {
        const dock = document.querySelector(".glass-dock");
        const layers = dock?.querySelector(".dock-layers");
        if (layers) new MutationObserver((muts) => { for (const m of muts) if (m.attributeName === "style") window.__w.writes.push({ t: Math.round(performance.now()), w: layers.style.width }); }).observe(layers, { attributes: true, attributeFilter: ["style"] });
        if (dock) new MutationObserver((muts) => { for (const m of muts) if (m.attributeName === "data-morphing") { if (dock.hasAttribute("data-morphing")) window.__w.morphStart = Math.round(performance.now()); else window.__w.morphEnd = Math.round(performance.now()); } }).observe(dock, { attributes: true, attributeFilter: ["data-morphing"] });
    });

    // ── A. DOCK MORPH under WebKit (SpringProgress FLIP) ──
    const dockFramesP = page.evaluate(() => new Promise((res) => { const d = []; let last = performance.now(); const start = last; (function tick(now) { d.push(+(now - last).toFixed(2)); last = now; now - start < 3000 ? requestAnimationFrame(tick) : res(d); })(performance.now()); }));
    const dock = await page.$(".glass-dock");
    // collapse it first by moving pointer away, then click to expand → real morph
    await page.mouse.move(700, 850); await page.waitForTimeout(2700); // collapse-delay
    await dock.click({ force: true }).catch(() => {});
    await page.waitForTimeout(700);
    const toggle = await page.$('.glass-dock button[title*="ontrol"]');
    if (toggle) { for (let i = 0; i < 3; i++) { await toggle.click({ force: true }).catch(() => {}); await page.waitForTimeout(600); } }
    const dockFrames = await dockFramesP;
    const w = await page.evaluate(() => window.__w);

    // ── B. GLASS-UI BACKDROP-FILTER COMPOSITOR COST under WebKit ──
    // Animate the dock hover-scale + force the cube to spin while sampling. The
    // backdrop-filter surfaces must recomposite every frame behind the moving
    // content — the WebKit cost the user feels as "glass-ui slow".
    const glassFramesP = page.evaluate(() => new Promise((res) => { const d = []; let last = performance.now(); const start = last; (function tick(now) { d.push(+(now - last).toFixed(2)); last = now; now - start < 2500 ? requestAnimationFrame(tick) : res(d); })(performance.now()); }));
    // Drive continuous scroll/transform churn behind the glass to force recomposite.
    await page.evaluate(() => {
        const cube = document.querySelector('[class*="cube"], .cube-target, [data-scene]') || document.body;
        let i = 0; const id = setInterval(() => { cube.style.transform = `rotateY(${(i += 6)}deg)`; if (i > 360) clearInterval(id); }, 16);
    });
    await page.mouse.move(720, 73); // hover dock → scale animation
    const glassFrames = await glassFramesP;

    const shot = path.join(SHOTS, "b8-webkit-dock.png");
    await page.screenshot({ path: shot }).catch(() => {});

    const report = {
        engine: "webkit", env,
        dockMorph: {
            widthWriteCount: w.writes?.length ?? 0,
            widthWriteSample: (w.writes ?? []).slice(0, 24),
            morphStart: w.morphStart, morphEnd: w.morphEnd,
            morphDurationMs: w.morphEnd && w.morphStart ? w.morphEnd - w.morphStart : null,
            frameStats: stats(dockFrames),
        },
        glassBackdropCost: { frameStats: stats(glassFrames) },
        consoleErr: [...new Set(consoleErr)],
        screenshot: path.relative(REPO, shot),
    };

    await ctx.close(); await browser.close(); server.close();
    const dump = path.join(SHOTS, "..", "b8-webkit-dump.json");
    fs.writeFileSync(dump, JSON.stringify(report, null, 2));
    console.log("=== B8 WEBKIT (user's real browser) ===");
    console.log(JSON.stringify(report, null, 2));
    console.log("\nDump:", path.relative(REPO, dump));
}
main().catch((e) => { console.error("PROBE FAILED:", e); process.exit(1); });
