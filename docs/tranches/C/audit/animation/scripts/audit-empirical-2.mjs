#!/usr/bin/env node
/**
 * audit-empirical-2 — focused re-capture of the two measurements the first
 * pass under-resolved:
 *   (1) dock expand from a TRUE collapsed baseline (force collapse, then expand,
 *       sample width + padding through the whole transition)
 *   (2) spring ball trajectory — re-seat the live target via real pointer
 *       events on .spring-rail, sample .spring-ball left across the spring.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
const OUT = path.join(REPO, "docs/tranches/C/audit/animation/captures");

function resolveChromium() {
    const root = process.env.KF_PLAYWRIGHT_DIR ?? "/tmp/kf-audit";
    const requireFrom = createRequire(path.join(root, "package.json"));
    for (const pkg of ["playwright-core", "@playwright/test", "playwright"]) {
        try {
            return requireFrom(pkg).chromium;
        } catch {}
    }
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

async function main() {
    const chromium = resolveChromium();
    const server = await startServer();
    const port = server.address().port;
    const base = `http://127.0.0.1:${port}`;
    const browser = await chromium.launch();
    const out = {};

    // ── DOCK: clean collapsed→expanded ──────────────────────────────────
    {
        const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
        await page.goto(`${base}/#/cube`, { waitUntil: "load" });
        await sleep(2800);
        // Force collapse: move mouse far away + wait past collapseDelay-ish.
        await page.mouse.move(5, 5);
        await sleep(2600);
        const box = await page.evaluate(() => {
            const d = document.querySelector(".glass-dock");
            const r = d.getBoundingClientRect();
            return { x: r.x + r.width / 2, y: r.y + 8, w: r.width, classes: d.className };
        });
        // Begin sampling, THEN hover to expand — so we catch the collapsed start.
        const samplesPromise = page.evaluate(async () => {
            const d = document.querySelector(".glass-dock");
            const rows = [];
            const start = performance.now();
            return await new Promise((resolve) => {
                function tick() {
                    const now = performance.now();
                    const cs = getComputedStyle(d);
                    rows.push({
                        t: +(now - start).toFixed(1),
                        w: +d.getBoundingClientRect().width.toFixed(2),
                        padL: cs.paddingLeft,
                        transform: cs.transform,
                    });
                    if (now - start > 900) resolve(rows);
                    else requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
            });
        });
        await sleep(30);
        await page.mouse.move(box.x, box.y); // hover → expand
        const samples = await samplesPromise;
        const w0 = samples[0].w;
        const wEnd = samples[samples.length - 1].w;
        const span = wEnd - w0;
        let lastMoveT = 0, maxW = -Infinity;
        for (const s of samples) {
            if (Math.abs(s.w - wEnd) > 0.5) lastMoveT = s.t;
            maxW = Math.max(maxW, s.w);
        }
        // transform overshoot (the spring-snappy is on transform/padding, not width)
        out.dock = {
            collapsedClass: box.classes,
            startWidth: w0, endWidth: wEnd, deltaWidth: +span.toFixed(2),
            measuredTransitionMs: +lastMoveT.toFixed(1),
            maxWidth: +maxW.toFixed(2),
            widthOvershoot: maxW > Math.max(w0, wEnd) + 1.0,
            note: "width is FLIP/grid-driven, NOT in the CSS transition list; the spring-snappy linear() drives padding/transform/box-shadow",
            samples: samples.filter((_, i) => i % 2 === 0),
        };
        // 6 PNG frames across THIS expand
        await page.mouse.move(5, 5); await sleep(2600);
        const offs = [0, 50, 100, 150, 250, 400];
        await page.mouse.move(box.x, box.y);
        const t0 = Date.now();
        for (const o of offs) {
            const w = o - (Date.now() - t0); if (w > 0) await sleep(w);
            await page.screenshot({ path: path.join(OUT, `dock2-expand-${String(o).padStart(3,"0")}ms.png`), clip: { x: 0, y: 0, width: 1440, height: 150 } });
        }
        await page.close();
    }

    // ── SPRING: re-seat live target, sample .spring-ball ────────────────
    {
        const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
        await page.goto(`${base}/#/spring`, { waitUntil: "load" });
        await sleep(3000);
        const railBox = await page.evaluate(() => {
            const rail = document.querySelector(".spring-rail");
            if (!rail) return null;
            const r = rail.getBoundingClientRect();
            return { x: r.x, y: r.y, w: r.width, h: r.height, hasBall: !!document.querySelector(".spring-ball") };
        });
        let samples = [];
        if (railBox) {
            // Dispatch a real pointerdown on the FAR-RIGHT of the rail to re-seat
            // target → ~1, then begin sampling the ball's left immediately.
            const sx = railBox.x + railBox.w * 0.9;
            const sy = railBox.y + railBox.h / 2;
            samples = await page.evaluate(async ({ sx, sy }) => {
                const rail = document.querySelector(".spring-rail");
                const fire = (type) => {
                    const ev = new PointerEvent(type, { clientX: sx, clientY: sy, bubbles: true, cancelable: true, pointerId: 1, pointerType: "mouse", isPrimary: true });
                    rail.dispatchEvent(ev);
                };
                fire("pointerdown");
                fire("pointerup");
                const ball = document.querySelector(".spring-ball");
                const target = document.querySelector(".spring-target-marker");
                const railR = rail.getBoundingClientRect();
                const rows = [];
                const start = performance.now();
                return await new Promise((resolve) => {
                    function tick() {
                        const now = performance.now();
                        const bx = ball ? ball.getBoundingClientRect().x - railR.x : null;
                        const tx = target ? target.getBoundingClientRect().x - railR.x : null;
                        rows.push({ t: +(now - start).toFixed(1), ballX: bx != null ? +bx.toFixed(2) : null, targetX: tx != null ? +tx.toFixed(2) : null });
                        if (now - start > 1800) resolve(rows);
                        else requestAnimationFrame(tick);
                    }
                    requestAnimationFrame(tick);
                });
            }, { sx, sy });
        }
        // Analyse overshoot on ballX.
        let analysis = null;
        const col = samples.map((s) => s.ballX).filter((v) => v != null);
        if (col.length > 3) {
            const x0 = col[0], xEnd = col[col.length - 1];
            const dir = Math.sign(xEnd - x0);
            let extreme = xEnd;
            for (const v of col) extreme = dir > 0 ? Math.max(extreme, v) : Math.min(extreme, v);
            const overshootPx = Math.abs(extreme - xEnd);
            const span = Math.abs(xEnd - x0);
            // settle time: last t where |ballX-xEnd|>1
            let settleT = 0;
            for (const s of samples) if (s.ballX != null && Math.abs(s.ballX - xEnd) > 1) settleT = s.t;
            analysis = {
                startBallX: x0, endBallX: xEnd, spanPx: +span.toFixed(2),
                overshootPx: +overshootPx.toFixed(2),
                overshootRatio: span ? +(overshootPx / span).toFixed(3) : 0,
                settleTimeMs: +settleT.toFixed(1),
                interpretation: overshootPx > 1.5 ? "OVERSHOOT → genuine underdamped iOS spring (dogfoods SpringProgress; response=0.5,damping=0.86)" : "no overshoot captured",
                sampleCount: col.length,
            };
        }
        out.spring = { railBox, analysis, samples: samples.filter((_, i) => i % 3 === 0) };
        await page.close();
    }

    await browser.close();
    server.close();
    fs.writeFileSync(path.join(OUT, "measurements-2.json"), JSON.stringify(out, null, 2));
    console.log(JSON.stringify(out, null, 2));
}
main().catch((e) => { console.error("ERR", e); process.exit(3); });
