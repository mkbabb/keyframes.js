#!/usr/bin/env node
/**
 * b11-b1-trace — isolate the B1 "Parse error at offset 0: ......" crash.
 * Instruments the page: wraps console.error/warn, captures the FULL pageerror
 * stack, and patches the engine parser entry to log the OFFENDING input string
 * before it throws (so we see exactly what "......" is). Also records 404s (B9).
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
function loadChromium() {
    const r = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
    try { return r("playwright-core").chromium; } catch { return r("@playwright/test").chromium; }
}

async function main() {
    const chromium = loadChromium();
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const scene = process.argv[2] || "cube";
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();

    const errors = [];
    const notFound = [];
    page.on("pageerror", (e) => errors.push(`PAGEERROR ${e.name}: ${e.message}\n${e.stack ?? ""}`));
    page.on("requestfailed", (req) => notFound.push(`FAILED ${req.url()} — ${req.failure()?.errorText}`));
    page.on("response", (res) => { if (res.status() === 404) notFound.push(`404 ${res.url()}`); });

    // capture Error constructor args globally to see the parse-error input context
    await page.addInitScript(() => {
        window.__b1 = [];
        const OrigError = Error;
        // record any Error whose message matches the parse signature, with stack
        const origCE = console.error.bind(console);
        console.error = (...a) => { try { window.__b1.push("CE: " + a.map(x => (x && x.message) ? x.message + "\n" + (x.stack||"") : String(x)).join(" ")); } catch {} origCE(...a); };
        const origCW = console.warn.bind(console);
        console.warn = (...a) => { try { window.__b1.push("CW: " + a.map(String).join(" ")); } catch {} origCW(...a); };
    });
    await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);

    await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
    await page.waitForFunction(([mk, s]) => { try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s; } catch { return false; } }, [MACHINE_KEY, scene], { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(1200);

    console.log(`# B1 trace — scene ${scene} — base ${base}`);
    console.log(`\n## after LOAD: errors=${errors.length} 404/failed=${notFound.length}`);
    for (const e of errors) console.log(e + "\n");
    const loadB1 = await page.evaluate(() => window.__b1.slice());
    console.log(`## console-captured (load):`);
    for (const l of loadB1.slice(0, 8)) console.log("  " + l.slice(0, 300).replace(/\n/g, "\n    "));

    // Click the rainbow group-play
    errors.length = 0;
    const play = await page.evaluate(() => {
        const b = [...document.querySelectorAll("button")].find(x => /^play animation$/i.test(x.getAttribute("aria-label") || ""));
        if (!b) return { ok: false };
        const r = b.getBoundingClientRect(); b.click(); return { ok: true };
    });
    await page.waitForTimeout(1800);
    console.log(`\n## after GROUP-PLAY (clicked=${play.ok}): pageerrors=${errors.length}`);
    for (const e of errors.slice(0, 3)) console.log(e + "\n");
    const playB1 = await page.evaluate(() => window.__b1.slice());
    console.log(`## console-captured (play, last 10):`);
    for (const l of playB1.slice(-10)) console.log("  " + l.slice(0, 400).replace(/\n/g, "\n    "));

    console.log(`\n## 404 / failed requests (B9 source-map + assets):`);
    const uniq = [...new Set(notFound)];
    for (const n of uniq.slice(0, 30)) console.log("  " + n);
    console.log(`  ... ${uniq.length} unique failed/404 (total events ${notFound.length})`);

    await page.screenshot({ path: path.join(SHOTS, `b11-b1-${scene}.png`) });
    await ctx.close();
    await browser.close();
    server.close();
}
main().catch((e) => { console.error("FATAL", e); process.exit(1); });
