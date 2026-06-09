#!/usr/bin/env node
/**
 * b16-easing-isolate — pin down WHY easing runs hot. Measures:
 *  (a) the rAF cost on easing while the preview sweep PLAYS vs after PAUSE,
 *  (b) whether the loop self-terminates on pause (the FSM gate),
 *  (c) CPU-throttled (4x) frame cost to expose the per-frame JS/layout work the
 *      headless 2x-clock masks, and a CDP trace of one second on easing,
 *  (d) the DOM node count painting per frame (comparison curves).
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".ttf": "font/ttf", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".map": "application/json" };
function serveDist() {
    return http.createServer((req, res) => {
        const u = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, u === "/" ? "index.html" : u);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) return res.writeHead(404).end();
        res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
        res.end(fs.readFileSync(p));
    });
}
const MACHINE_KEY = "keyframes-js-scene-machine";
const CTRL_KEY = "animation-groups-control-options-store";
const SAMPLE_RAF = (ms) => new Promise((resolve) => {
    const ivs = []; let last = performance.now(); const t0 = last;
    const tick = (now) => { ivs.push(now - last); last = now;
        if (now - t0 < ms) requestAnimationFrame(tick);
        else { const s = ivs.slice(1).sort((a, b) => a - b); const at = (q) => s.length ? s[Math.min(s.length - 1, Math.floor(q * s.length))] : 0;
            resolve({ n: s.length, mean: +(s.reduce((a, b) => a + b, 0) / (s.length || 1)).toFixed(2), p95: +at(0.95).toFixed(2), max: +(s[s.length - 1] || 0).toFixed(2), dropped: s.filter((x) => x > 24).length }); } };
    requestAnimationFrame(tick);
});

const out = { ts: new Date().toISOString() };
async function main() {
    const requireFrom = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
    const { chromium } = requireFrom("playwright-core");
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    try {
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await ctx.newPage();
        await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);
        await page.goto(`${base}/#/easing`, { waitUntil: "load" });
        await page.waitForFunction(([mk]) => { try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === "easing"; } catch { return false; } }, [MACHINE_KEY], { timeout: 6000 }).catch(() => {});
        await page.waitForTimeout(1800);

        // machine status + DOM weight of the easing stage
        const state0 = await page.evaluate(() => {
            let m = {}; try { m = JSON.parse(localStorage.getItem("keyframes-js-scene-machine") || "{}"); } catch {}
            const svgPaths = document.querySelectorAll("svg path").length;
            const svgEls = document.querySelectorAll("svg").length;
            const totalNodes = document.querySelectorAll("*").length;
            return { machineStatus: m.status, machinePlayback: m.playbackByScene, svgPaths, svgEls, totalNodes };
        });
        out.atLoad = state0;

        // (a) cost while playing (preview sweep auto-runs on mount)
        out.playingRaf = await page.evaluate(SAMPLE_RAF, 1500);

        // (b) pause via the machine, then re-measure — does the loop self-terminate?
        // Find and click the play/pause control if present; else dispatch through hash is N/A.
        // The preview sweep gates on machine.status==='playing'. Toggling the dock play
        // button pauses it. Try clicking a [aria-label*="ause"] / play toggle.
        const toggled = await page.evaluate(() => {
            const btns = [...document.querySelectorAll("button")];
            const b = btns.find((x) => /pause|play/i.test(x.getAttribute("aria-label") || x.title || ""));
            if (b) { b.click(); return (b.getAttribute("aria-label") || b.title || "").slice(0, 40); }
            return null;
        });
        await page.waitForTimeout(900);
        out.pauseToggleHit = toggled;
        out.afterPauseRaf = await page.evaluate(SAMPLE_RAF, 1500);
        out.afterPauseMachine = await page.evaluate(() => { try { return JSON.parse(localStorage.getItem("keyframes-js-scene-machine") || "{}").status; } catch { return "?"; } });

        await ctx.close();

        // (c) CPU-throttled (4x) cost on easing — exposes the real device-class floor
        const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page2 = await ctx2.newPage();
        const client = await ctx2.newCDPSession(page2);
        await page2.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);
        await page2.goto(`${base}/#/easing`, { waitUntil: "load" });
        await page2.waitForTimeout(1500);
        await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
        out.throttled4xEasingRaf = await page2.evaluate(SAMPLE_RAF, 1800);
        await client.send("Emulation.setCPUThrottlingRate", { rate: 1 });
        // compare: throttled cube
        await page2.evaluate(() => { location.hash = "#/cube"; });
        await page2.waitForTimeout(1800);
        await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
        out.throttled4xCubeRaf = await page2.evaluate(SAMPLE_RAF, 1800);
        await client.send("Emulation.setCPUThrottlingRate", { rate: 1 });
        await ctx2.close();
    } finally {
        await browser.close();
        server.close();
    }
    fs.writeFileSync(path.join(HERE, "b16-easing-isolate.result.json"), JSON.stringify(out, null, 2));
    console.log(JSON.stringify(out, null, 2));
}
main().catch((e) => { console.error("FAILED:", e); process.exit(1); });
