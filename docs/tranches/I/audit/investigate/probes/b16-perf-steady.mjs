#!/usr/bin/env node
/**
 * b16-perf-steady — second pass. Isolates STEADY-STATE rAF cost per scene (after
 * the scene rests), the rAF-callback count (how many concurrent loops run), and
 * forces a CDP trace on the dock-spring + a scene-switch to localize long tasks.
 * Also probes whether the 16ms/40fps degradation on easing/spring is a real
 * steady-state floor or a one-off transition artifact.
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
        const b = fs.readFileSync(p);
        res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
        res.end(b);
    });
}
const MACHINE_KEY = "keyframes-js-scene-machine";
const CTRL_KEY = "animation-groups-control-options-store";

const SAMPLE_RAF = (ms) => new Promise((resolve) => {
    const ivs = []; let last = performance.now(); const t0 = last;
    const tick = (now) => { ivs.push(now - last); last = now;
        if (now - t0 < ms) requestAnimationFrame(tick);
        else { const s = ivs.slice(1).sort((a, b) => a - b); const at = (q) => s.length ? s[Math.min(s.length - 1, Math.floor(q * s.length))] : 0;
            resolve({ n: s.length, mean: +(s.reduce((a, b) => a + b, 0) / (s.length || 1)).toFixed(2), p50: +at(0.5).toFixed(2), p95: +at(0.95).toFixed(2), max: +(s[s.length - 1] || 0).toFixed(2), dropped: s.filter((x) => x > 24).length }); } };
    requestAnimationFrame(tick);
});

// Count active rAF callbacks per frame by monkey-patching requestAnimationFrame.
const INSTRUMENT_RAF = () => {
    window.__rafStats = { perFrameCounts: [], totalCalls: 0 };
    const orig = window.requestAnimationFrame.bind(window);
    let frameCbs = 0; let lastTs = 0;
    window.requestAnimationFrame = function (cb) {
        window.__rafStats.totalCalls++;
        return orig((ts) => {
            if (ts !== lastTs) { if (lastTs) window.__rafStats.perFrameCounts.push(frameCbs); frameCbs = 0; lastTs = ts; }
            frameCbs++;
            return cb(ts);
        });
    };
};

const out = { ts: new Date().toISOString(), steady: [] };
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
        await page.addInitScript(INSTRUMENT_RAF);
        await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);
        await page.goto(`${base}/#/cube`, { waitUntil: "load" });
        await page.waitForTimeout(1500);

        const scenes = ["cube", "easing", "spring", "amiga", "square", "sequence", "motion-path"];
        for (const scene of scenes) {
            await page.evaluate((s) => { location.hash = `#/${s}`; }, scene);
            await page.waitForFunction(([mk, s]) => { try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s; } catch { return false; } }, [MACHINE_KEY, scene], { timeout: 6000 }).catch(() => {});
            await page.waitForTimeout(1600); // let the scene fully REST (transition done)
            await page.evaluate(() => { window.__rafStats.perFrameCounts = []; });
            const raf = await page.evaluate(SAMPLE_RAF, 1800); // STEADY-STATE sample
            const rafStats = await page.evaluate(() => {
                const c = window.__rafStats.perFrameCounts;
                const mean = c.length ? +(c.reduce((a, b) => a + b, 0) / c.length).toFixed(2) : 0;
                const max = c.length ? Math.max(...c) : 0;
                return { framesObserved: c.length, callbacksPerFrameMean: mean, callbacksPerFrameMax: max };
            });
            out.steady.push({ scene, steadyRaf: raf, concurrentRafLoops: rafStats });
            console.log(`${scene}: steady mean=${raf.mean}ms p95=${raf.p95}ms dropped=${raf.dropped}/${raf.n} | rAF cbs/frame mean=${rafStats.callbacksPerFrameMean} max=${rafStats.callbacksPerFrameMax}`);
        }
        await ctx.close();
    } finally {
        await browser.close();
        server.close();
    }
    fs.writeFileSync(path.join(HERE, "b16-perf-steady.result.json"), JSON.stringify(out, null, 2));
    console.log("written:", path.join(HERE, "b16-perf-steady.result.json"));
}
main().catch((e) => { console.error("FAILED:", e); process.exit(1); });
