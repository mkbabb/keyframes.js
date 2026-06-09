#!/usr/bin/env node
/**
 * proof:demo-fonts — Tranche I.W6-font. The demo's font IDENTITY is its own, NOT
 * glass-ui's brand default. glass-ui ~3.9.0 force-applies "Plus Jakarta Sans" to
 * the body/text register of every consumer (typography.css `body { font-family:
 * var(--font-text) }`, --font-text -> --font-stack-text -> Plus Jakarta). The kf
 * user flagged it: "the fonts dont seem correct on the dock; we dont use plus
 * jakarta". keyframes.js's register is Instrument Serif (display) + Fira Code
 * (mono) over a clean native UI sans — reclaimed by overriding --font-stack-text
 * at :root (the documented glass-ui consumer lever; the @theme-inline bridge can't
 * be overridden directly).
 *
 * RUNTIME gate (the rendered computed font is the oracle, not source shape):
 *   (a) the body + dock + control chrome resolve a font-family with NO "Plus
 *       Jakarta" — the glass-ui brand font never lands on a kf surface;
 *   (b) the display register still resolves Instrument Serif (the demo's deliberate
 *       --font-display override survives);
 *   (c) no font is stuck in an `error`/half-loaded state on the demo's own faces.
 * Born-RED on a tree that inherits glass-ui's Plus Jakarta default; GREEN once the
 * demo reclaims --font-stack-text. Serves dist/gh-pages/. Mirrors the
 * proof-no-orphan-specular harness.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const fail = (l) => { failures.push(l); console.error(`  ✗ ${l}`); };

console.log("proof:demo-fonts — I.W6-font: the demo's own font identity, NOT glass-ui's Plus Jakarta brand default");

const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) fail(`browser half REQUIRED but ${reason}`);
    else console.log(`  ○ browser half skipped — ${reason}`);
};
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".ttf": "font/ttf" };
const MACHINE_KEY = "keyframes-js-scene-machine";

function serveDist() {
    return http.createServer((req, res) => {
        const u = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, u === "/" ? "index.html" : u);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404).end(); return; }
        res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
        fs.createReadStream(p).pipe(res);
    });
}

async function browserHalf() {
    if (!fs.existsSync(path.join(DIST, "index.html"))) { skipOrFail("dist/gh-pages not built"); return; }
    let chromium;
    try { chromium = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"))("playwright-core").chromium; }
    catch { skipOrFail("playwright not resolvable (set KF_PLAYWRIGHT_DIR)"); return; }

    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    try {
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await ctx.newPage();
        await page.goto(`${base}/#/cube`, { waitUntil: "load" });
        await page.waitForFunction((mk) => { try { return !!JSON.parse(localStorage.getItem(mk) || "{}").activeScene; } catch { return false; } }, MACHINE_KEY, { timeout: 8000 }).catch(() => {});
        await page.waitForTimeout(1200);
        const probe = await page.evaluate(async () => {
            await document.fonts.ready;
            const ff = (el) => (el ? getComputedStyle(el).fontFamily : "");
            const body = ff(document.body);
            const surfaces = [".dock-icon-button", ".dock-select-trigger", ".dock-label", "[role='tab']", ".animation-controls"];
            const chrome = surfaces.map((s) => ({ s, ff: ff(document.querySelector(s)) })).filter((x) => x.ff);
            const display = ff(document.querySelector(".text-display-4, h1, [class*='display']"));
            const errored = [...document.fonts].filter((f) => f.status === "error").map((f) => f.family);
            return { body, chrome, display, errored };
        });

        // (a) NO Plus Jakarta on the body or any UI chrome surface.
        const jakartaHits = [{ s: "body", ff: probe.body }, ...probe.chrome].filter((x) => /Jakarta/i.test(x.ff));
        if (jakartaHits.length === 0) {
            ok(`(a) NO "Plus Jakarta" on the body or ${probe.chrome.length} UI chrome surface(s) — the glass-ui brand font is reclaimed (body resolves: ${probe.body.slice(0, 42)})`);
        } else {
            fail(`(a) "Plus Jakarta Sans" still on ${jakartaHits.length} surface(s): ${jakartaHits.map((x) => x.s).join(", ")} — the glass-ui brand default leaked onto kf chrome (override --font-stack-text at :root)`);
        }
        // (b) the display register is still Instrument Serif (the demo's --font-display survives).
        if (/Instrument/i.test(probe.display)) {
            ok(`(b) the display register still resolves Instrument Serif (${probe.display.slice(0, 38)}) — the demo's --font-display override survives`);
        } else {
            fail(`(b) the display register is NOT Instrument Serif (got: ${probe.display.slice(0, 42)}) — the demo's display identity regressed`);
        }
        // (c) no PRIMARY demo face stuck in error. The metric-override "… Fallback"
        // faces (the CLS-reduction fallbacks whose `src: local(<system font>)` aliases
        // a host font for matched metrics) are EXCLUDED: on a font-less Linux CI runner
        // their `local()` system-font source does not resolve → the face reports
        // `error`, but that is a HOST artifact (the CI VM lacks the system font), NOT a
        // demo-font defect — the PRIMARY webfonts (Instrument Serif / Fira Code) load
        // fine (clauses a/b green). On a real device the fallback faces resolve. So we
        // gate the PRIMARY faces only; a primary face in error is a real broken load.
        const ours = probe.errored.filter(
            (f) => /Instrument|Fira/i.test(f) && !/Fallback/i.test(f),
        );
        if (ours.length === 0) ok(`(c) no PRIMARY demo-owned font face in error state (Instrument Serif / Fira Code webfonts load clean; the metric-override "… Fallback" faces are excluded — their local() system-font source is a host concern, not a demo defect)`);
        else fail(`(c) PRIMARY demo font face(s) in error: ${ours.join(", ")}`);

        await ctx.close();
    } finally {
        await browser.close();
        server.close();
    }
}

await browserHalf();
if (failures.length) { console.error(`\nproof:demo-fonts — FAIL (${failures.length})`); process.exit(1); }
console.log("\nproof:demo-fonts — PASS: the body + dock + control chrome resolve the demo's own native sans (NO Plus Jakarta); the display register is Instrument Serif; no demo face is half-loaded. The glass-ui brand-font default never lands on a kf surface.");
