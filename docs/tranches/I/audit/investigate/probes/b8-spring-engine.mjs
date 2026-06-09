#!/usr/bin/env node
/**
 * I.audit — B8 probe #5: PROVE the SpringProgress engine FLIP path with a real
 * width delta. VT neutered. A scene switch (cube→sequence, different label
 * widths) + a collapsed↔expanded swap forces a measurable width change so the
 * keyframes.js SpringProgress writes per-frame inline widths. Captures every
 * write + the engine's settle behavior + frame jank, and any engine throw.
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
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".ttf": "font/ttf", ".map": "application/json" };

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
    return requireFrom("playwright-core").chromium;
}
function stats(frames) {
    if (!frames.length) return { n: 0 };
    const sorted = [...frames].sort((a, b) => a - b);
    const sum = frames.reduce((a, b) => a + b, 0);
    return { n: frames.length, meanMs: +(sum / frames.length).toFixed(2), maxMs: +Math.max(...frames).toFixed(2), p95Ms: +sorted[Math.floor(sorted.length * 0.95)].toFixed(2), droppedGt33: frames.filter((d) => d > 33).length, droppedGt50: frames.filter((d) => d > 50).length };
}

async function main() {
    if (!fs.existsSync(path.join(DIST, "index.html"))) { console.error("dist not built"); process.exit(2); }
    const chromium = loadChromium();
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const consoleErr = [];
    page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") consoleErr.push(`[${m.type()}] ${m.text().slice(0, 160)}`); });
    page.on("pageerror", (e) => consoleErr.push(`[pageerror] ${e.message} | ${(e.stack || "").split("\n")[1] || ""}`));

    await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);
    await page.addInitScript(() => {
        try { Object.defineProperty(document, "startViewTransition", { value: undefined, configurable: true }); } catch {}
        window.__w = { writes: [], morphSpans: [] };
    });
    await page.goto(`${base}/#/cube`, { waitUntil: "load" });
    await page.waitForFunction(([mk]) => { try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === "cube"; } catch { return false; } }, [MACHINE_KEY], { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1200);

    const vtNeutered = await page.evaluate(() => typeof document.startViewTransition !== "function");

    await page.evaluate(() => {
        const dock = document.querySelector(".glass-dock");
        const layers = dock?.querySelector(".dock-layers");
        if (layers) new MutationObserver((muts) => { for (const m of muts) if (m.attributeName === "style") window.__w.writes.push({ t: Math.round(performance.now()), w: layers.style.width }); }).observe(layers, { attributes: true, attributeFilter: ["style"] });
        if (dock) new MutationObserver((muts) => { for (const m of muts) if (m.attributeName === "data-morphing") window.__w.morphSpans.push({ t: Math.round(performance.now()), on: dock.hasAttribute("data-morphing") }); }).observe(dock, { attributes: true, attributeFilter: ["data-morphing"] });
    });

    const framesP = page.evaluate(() => new Promise((res) => { const d = []; let last = performance.now(); const start = last; (function tick(now) { d.push(+(now - last).toFixed(2)); last = now; now - start < 6000 ? requestAnimationFrame(tick) : res(d); })(performance.now()); }));

    // Force collapse → expand cycle (different layer widths), then switch scenes
    // via the dock scene selector (cube → sequence: longer label) to grow width.
    const dock = await page.$(".glass-dock");
    await page.mouse.move(700, 850); await page.waitForTimeout(2700);
    await dock.click({ force: true }).catch(() => {}); // expand
    await page.waitForTimeout(700);
    // Open scene selector + pick a different scene (sequence) → label width change
    const sceneTrig = await page.$('[aria-label="Scene"]');
    if (sceneTrig) {
        await sceneTrig.click({ force: true }).catch(() => {});
        await page.waitForTimeout(400);
        const seqItem = await page.$('[role="option"]:has-text("Sequence"), [role="menuitem"]:has-text("Sequence")');
        if (seqItem) { await seqItem.click({ force: true }).catch(() => {}); }
        else { await page.keyboard.press("Escape").catch(() => {}); }
        await page.waitForTimeout(900);
    }
    // Toggle collapse again
    await page.mouse.move(700, 850); await page.waitForTimeout(2700);

    const frames = await framesP;
    const w = await page.evaluate(() => window.__w);

    const shot = path.join(SHOTS, "b8-spring-engine.png");
    await page.screenshot({ path: shot }).catch(() => {});

    const report = {
        vtNeutered,
        springEngineEngaged: (w.writes?.length ?? 0) > 0,
        widthWriteCount: w.writes?.length ?? 0,
        widthWriteFirst20: (w.writes ?? []).slice(0, 20),
        morphSpans: w.morphSpans ?? [],
        frameStats: stats(frames),
        consoleErr: [...new Set(consoleErr)],
        screenshot: path.relative(REPO, shot),
    };
    await ctx.close(); await browser.close(); server.close();
    const dump = path.join(SHOTS, "..", "b8-spring-engine-dump.json");
    fs.writeFileSync(dump, JSON.stringify(report, null, 2));
    console.log("=== B8 SPRING ENGINE FLIP (VT neutered) ===");
    console.log(JSON.stringify(report, null, 2));
    console.log("\nDump:", path.relative(REPO, dump));
}
main().catch((e) => { console.error("PROBE FAILED:", e); process.exit(1); });
