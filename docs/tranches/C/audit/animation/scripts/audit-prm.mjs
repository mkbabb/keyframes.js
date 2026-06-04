#!/usr/bin/env node
// audit-prm — definitive prefers-reduced-motion check on the cube idle-bob.
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
const OUT = path.join(REPO, "docs/tranches/C/audit/animation/captures");
function resolveChromium() {
    const requireFrom = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? "/tmp/kf-audit", "package.json"));
    for (const p of ["playwright-core", "@playwright/test", "playwright"]) { try { return requireFrom(p).chromium; } catch {} }
    return null;
}
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".ttf": "font/ttf", ".jpg": "image/jpeg", ".webp": "image/webp" };
function startServer() {
    const server = http.createServer((req, res) => {
        const u = decodeURIComponent(new URL(req.url, "http://x").pathname);
        let p = path.join(DIST, u === "/" ? "index.html" : u);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) p = path.join(DIST, "index.html");
        res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
        fs.createReadStream(p).pipe(res);
    });
    return new Promise((r) => server.listen(0, () => r(server)));
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function probe(browser, base, reduced) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...(reduced ? { reducedMotion: "reduce" } : {}) });
    const page = await ctx.newPage();
    await page.goto(`${base}/#/cube`, { waitUntil: "load" });
    await sleep(2800);
    const r = await page.evaluate(async () => {
        const el = document.querySelector(".idle-hover");
        if (!el) return { found: false };
        const cs = getComputedStyle(el);
        // Sample translateY of the idle-bob element over 700ms.
        const ys = [];
        const start = performance.now();
        await new Promise((res) => {
            function tick() {
                const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
                ys.push(+m.m42.toFixed(3)); // translateY
                if (performance.now() - start > 3400) res(); // full 3s cycle + margin
                else requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        });
        const min = Math.min(...ys), max = Math.max(...ys);
        return {
            found: true,
            animationName: cs.animationName,
            animationPlayState: cs.animationPlayState,
            translateYmin: min, translateYmax: max,
            translateYrange: +(max - min).toFixed(3),
            sampleCount: ys.length,
            moving: (max - min) > 0.2,
        };
    });
    await ctx.close();
    return r;
}

async function main() {
    const chromium = resolveChromium();
    const server = await startServer();
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const normal = await probe(browser, base, false);
    const reduced = await probe(browser, base, true);
    await browser.close(); server.close();
    const out = {
        idleBob_normal: normal,
        idleBob_reducedMotion: reduced,
        verdict: reduced.moving
            ? "DEMO IGNORES prefers-reduced-motion: the cube idle-bob @keyframes keeps bobbing under reduce (translateY range " + reduced.translateYrange + "px)"
            : "idle-bob suppressed under reduce",
    };
    fs.writeFileSync(path.join(OUT, "measurements-prm.json"), JSON.stringify(out, null, 2));
    console.log(JSON.stringify(out, null, 2));
}
main().catch((e) => { console.error("ERR", e); process.exit(3); });
