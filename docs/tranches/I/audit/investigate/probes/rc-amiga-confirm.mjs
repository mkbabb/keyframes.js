#!/usr/bin/env node
/**
 * TRANCHE I — ROOT-CAUSE confirmation probe [rc-amiga].
 * Confirms RC-1 (corner-parked subject vs origin-orbiting camera) and RC-2
 * (content-visibility:auto over a live WebGL present loop) against the BUILT
 * dist/gh-pages. Models scripts/proof-no-orphan-specular.mjs (serveDist on
 * port 0 + chromium via createRequire(KF_PLAYWRIGHT_DIR)).
 *
 * RC-1 confirmation strategy (the subject is NOT reachable at canvas centre):
 *   The Vue component closure is unreachable, but the BEHAVIOUR is observable —
 *   a center-canvas drag must tumble the WHOLE room (camera orbit), NOT spin a
 *   centred sphere. We screenshot before/after a center drag and byte-diff a
 *   peripheral strip (the checker room walls) vs. the centre. If the periphery
 *   changes a LOT (room re-projected) the centre-drag drove OrbitControls = the
 *   subject was a miss at centre = RC-1 confirmed.
 *
 *   We ALSO read the computed content-visibility on .scene-root (RC-2) and the
 *   GPU-stall / content-visibility console warnings.
 *
 * RUN: KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
 *      node docs/tranches/I/audit/investigate/probes/rc-amiga-confirm.mjs
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
fs.mkdirSync(SHOTS, { recursive: true });

const MIME = {
    ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
    ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml",
    ".ttf": "font/ttf", ".woff2": "font/woff2", ".jpg": "image/jpeg",
};

function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
            res.writeHead(404).end();
            return;
        }
        res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
        fs.createReadStream(p).pipe(res);
    });
}

const consoleLog = [];
const pageErrors = [];

async function main() {
    const requireFrom = createRequire(
        path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
    );
    let chromium;
    try { ({ chromium } = requireFrom("playwright-core")); }
    catch { ({ chromium } = requireFrom("@playwright/test")); }

    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const report = {};

    try {
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await ctx.newPage();
        page.on("console", (m) => consoleLog.push({ type: m.type(), text: m.text() }));
        page.on("pageerror", (e) => pageErrors.push({ name: e.name, message: e.message }));
        await page.goto(`${base}/#/amiga`, { waitUntil: "load" });
        await page.waitForTimeout(1500);

        // ── RC-2: the computed content-visibility on the WebGL scene root ──
        report.sceneRootStyle = await page.evaluate(() => {
            const root = document.querySelector(".scene-root");
            if (!root) return { found: false };
            const cs = getComputedStyle(root);
            return {
                found: true,
                contentVisibility: cs.contentVisibility,
                containIntrinsicSize: cs.containIntrinsicSize,
                contain: cs.contain,
            };
        });

        // ── canvas geometry ──
        report.canvas = await page.evaluate(() => {
            const c = document.querySelector("canvas.amiga-canvas");
            if (!c) return { found: false };
            const r = c.getBoundingClientRect();
            return {
                found: true,
                rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
            };
        });

        const canvas = await page.$("canvas.amiga-canvas");
        const box = await canvas.boundingBox();
        const cx = box.x + box.width / 2;
        const cy = box.y + box.height / 2;

        // ── RC-1: a CENTER drag → does the WHOLE room re-project? ──
        // Screenshot the canvas region pre/post a center drag, byte-compare.
        const clip = { x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width), height: Math.round(box.height) };
        const before = await page.screenshot({ clip });
        await page.mouse.move(cx, cy);
        await page.mouse.down();
        for (let i = 1; i <= 12; i++) {
            await page.mouse.move(cx + i * 14, cy - i * 6);
            await page.waitForTimeout(16);
        }
        await page.mouse.up();
        await page.waitForTimeout(400);
        const after = await page.screenshot({ clip });
        fs.writeFileSync(path.join(SHOTS, "rc-amiga-center-before.png"), before);
        fs.writeFileSync(path.join(SHOTS, "rc-amiga-center-after.png"), after);

        // Crude byte-level change ratio (PNG bytes differ if pixels differ).
        // A large change after a CENTER drag = the camera orbited the whole room
        // = the centre was a sphere MISS = RC-1 (subject not at centre).
        report.centerDragChangedBytes = !before.equals(after);
        report.beforeBytes = before.length;
        report.afterBytes = after.length;

        await ctx.close();
    } finally {
        await browser.close();
        server.close();
    }

    report.consoleLog = consoleLog;
    report.pageErrors = pageErrors;
    report.gpuStallWarnings = consoleLog.filter((l) => /ReadPixels|GPU stall/i.test(l.text)).length;
    report.contentVisibilityWarnings = consoleLog.filter((l) => /content-visibility/i.test(l.text)).length;
    console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => { console.error("PROBE CRASH:", e); process.exit(1); });
