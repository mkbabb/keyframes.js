#!/usr/bin/env node
/**
 * TRANCHE I — investigation probe [b3-amiga-float] (focused follow-up).
 * Pin the "floats around" behavior: does the sphere DRIFT at rest (autoplay /
 * leaked group play), and does a CENTER drag spin the sphere or orbit the
 * camera? We sample the painted-sphere CENTROID from canvas screenshots over
 * time (the red checker sphere is the only saturated-red region), so we measure
 * actual on-screen motion without reaching the Vue closure.
 *
 * RUN: KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
 *      node docs/tranches/I/audit/investigate/probes/b3-amiga-float.mjs
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
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
    ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
    ".svg": "image/svg+xml", ".woff2": "font/woff2", ".ttf": "font/ttf" };

function serveDist() {
    return http.createServer((req, res) => {
        const u = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, u === "/" ? "index.html" : u);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory())
            return res.writeHead(404).end();
        res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
        fs.createReadStream(p).pipe(res);
    });
}

// Read the saturated-red sphere centroid out of the live canvas via a 2D copy
// (the WebGL canvas is drawn onto a 2D scratch canvas so getImageData works
// regardless of preserveDrawingBuffer — captured immediately after a render).
async function sphereCentroid(page) {
    return page.evaluate(() => {
        const c = document.querySelector("canvas.amiga-canvas");
        if (!c) return null;
        const w = c.width, h = c.height;
        const s = document.createElement("canvas");
        s.width = w; s.height = h;
        const ctx = s.getContext("2d");
        ctx.drawImage(c, 0, 0);
        let data;
        try { data = ctx.getImageData(0, 0, w, h).data; } catch { return { tainted: true }; }
        let sx = 0, sy = 0, n = 0;
        for (let y = 0; y < h; y += 2) {
            for (let x = 0; x < w; x += 2) {
                const i = (y * w + x) * 4;
                const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
                // the checker sphere's red tiles: strong red, low green/blue
                if (a > 40 && r > 150 && g < 90 && b < 90) { sx += x; sy += y; n++; }
            }
        }
        if (n === 0) return { redPixels: 0, w, h };
        return { redPixels: n, cx: Math.round(sx / n), cy: Math.round(sy / n), w, h };
    });
}

async function open(browser, base, scene, vw) {
    const ctx = await browser.newContext({ viewport: { width: vw, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);
    await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
    await page.waitForFunction(([mk, s]) => { try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s; } catch { return false; } }, [MACHINE_KEY, scene], { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(1200);
    return { ctx, page };
}

async function main() {
    const requireFrom = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
    let chromium; try { ({ chromium } = requireFrom("playwright-core")); } catch { ({ chromium } = requireFrom("@playwright/test")); }
    const server = serveDist(); await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const report = { restSamples: [], centerDrag: {}, cornerNote: "" };
    try {
        const { ctx, page } = await open(browser, base, "amiga", 1440);

        // ── A) drift-at-rest: sample the sphere centroid every 400ms for 2.4s ──
        for (let i = 0; i < 7; i++) {
            report.restSamples.push(await sphereCentroid(page));
            await page.waitForTimeout(400);
        }

        // ── B) does a CENTER drag spin the sphere or orbit the room? ──────────
        // record centroid before, drag through the canvas center, record after.
        const canvas = await page.$("canvas.amiga-canvas");
        const box = await canvas.boundingBox();
        const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
        report.centerDrag.before = await sphereCentroid(page);
        await page.mouse.move(cx, cy); await page.mouse.down();
        for (let i = 1; i <= 10; i++) { await page.mouse.move(cx + i * 14, cy + i * 2); await page.waitForTimeout(16); }
        await page.mouse.up();
        await page.waitForTimeout(300);
        report.centerDrag.after = await sphereCentroid(page);
        // the room-orbit signature: the WHOLE scene re-projected → sphere centroid
        // jumps far AND red-pixel count changes (sphere re-sized by perspective).

        // ── C) does a drag ON the sphere's actual screen position spin it? ─────
        const c0 = report.centerDrag.after;
        if (c0 && c0.cx != null) {
            // map buffer px → css px (buffer==css here, dpr handled) then to page
            const sxCss = box.x + (c0.cx / c0.w) * box.width;
            const syCss = box.y + (c0.cy / c0.h) * box.height;
            report.onSphereDrag = { aimedCssX: Math.round(sxCss), aimedCssY: Math.round(syCss) };
            const beforeOn = await sphereCentroid(page);
            await page.mouse.move(sxCss, syCss); await page.mouse.down();
            for (let i = 1; i <= 10; i++) { await page.mouse.move(sxCss + i * 10, syCss - i * 3); await page.waitForTimeout(16); }
            await page.mouse.up();
            await page.waitForTimeout(120);
            const afterOn = await sphereCentroid(page);
            // post-release glide: sample for ~1.2s, watch the sphere keep moving
            const glide = [];
            for (let i = 0; i < 6; i++) { glide.push(await sphereCentroid(page)); await page.waitForTimeout(200); }
            report.onSphereDrag.before = beforeOn;
            report.onSphereDrag.after = afterOn;
            report.onSphereDrag.glide = glide;
        }
        await ctx.close();
    } finally { await browser.close(); server.close(); }
    console.log(JSON.stringify(report, null, 2));
}
main().catch((e) => { console.error("PROBE CRASH:", e); process.exit(1); });
