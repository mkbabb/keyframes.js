#!/usr/bin/env node
/**
 * TRANCHE I — investigation probe [b3-amiga].
 * B3 — "/amiga totally broken, floats around".
 *
 * Models scripts/proof-no-orphan-specular.mjs: serveDist on port 0 + chromium
 * via createRequire(KF_PLAYWRIGHT_DIR).require("playwright-core") +
 * openSceneFresh navigating `${base}/#/amiga`. Captures page.on("console") +
 * page.on("pageerror"), samples the runtime Three.js state (canvas size, WebGL
 * context, sphere position over time, camera), exercises the boing egg + a
 * scene-switch, and screenshots to ../shots/.
 *
 * RUN: KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
 *      node docs/tranches/I/audit/investigate/probes/b3-amiga.mjs
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

const MACHINE_KEY = "keyframes-js-scene-machine";
const CTRL_KEY = "animation-groups-control-options-store";
const MIME = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".ttf": "font/ttf",
    ".woff2": "font/woff2",
    ".svg": "image/svg+xml",
};

function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
            res.writeHead(404).end();
            return;
        }
        res.writeHead(200, {
            "content-type": MIME[path.extname(p)] ?? "application/octet-stream",
        });
        fs.createReadStream(p).pipe(res);
    });
}

const consoleLog = [];
const pageErrors = [];
const netFails = [];

async function openSceneFresh(browser, base, scene, vw) {
    const ctx = await browser.newContext({ viewport: { width: vw, height: 900 } });
    const page = await ctx.newPage();
    page.on("console", (msg) => {
        consoleLog.push({ scene, type: msg.type(), text: msg.text() });
    });
    page.on("pageerror", (err) => {
        pageErrors.push({ scene, name: err.name, message: err.message, stack: err.stack });
    });
    page.on("requestfailed", (req) => {
        netFails.push({ scene, url: req.url(), failure: req.failure()?.errorText });
    });
    page.on("response", (resp) => {
        if (resp.status() >= 400) {
            netFails.push({ scene, url: resp.url(), status: resp.status() });
        }
    });
    await page.addInitScript((ck) => {
        try {
            localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true }));
        } catch {}
    }, CTRL_KEY);
    await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
    await page
        .waitForFunction(
            ([mk, s]) => {
                try {
                    return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s;
                } catch {
                    return false;
                }
            },
            [MACHINE_KEY, scene],
            { timeout: 8000 },
        )
        .catch(() => {});
    await page.setViewportSize({ width: vw, height: 900 });
    await page.waitForTimeout(1200);
    return { ctx, page };
}

// Read the live Three.js sphere/canvas state out of the page. We cannot reach
// the Vue component closure, so we probe the DOM canvas + WebGL + measure the
// rendered pixels (is the sphere actually painted? is the canvas sized?).
async function probeAmigaRuntime(page) {
    return page.evaluate(async () => {
        const out = {};
        const canvas = document.querySelector("canvas.amiga-canvas");
        out.canvasFound = !!canvas;
        if (canvas) {
            const r = canvas.getBoundingClientRect();
            out.cssRect = { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y) };
            out.bufferSize = { w: canvas.width, h: canvas.height };
            out.clientSize = { w: canvas.clientWidth, h: canvas.clientHeight };
            const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
            out.hasWebGL = !!gl;
            out.glContextLost = gl ? gl.isContextLost() : null;
            // sample the rendered pixels: count non-transparent pixels (the sphere
            // + checker room should paint many). A blank/0-area canvas paints none.
            try {
                const dpr = window.devicePixelRatio;
                out.dpr = dpr;
            } catch {}
        }
        // the stage host geometry — "floats around" may be a layout/positioning bug
        const root = document.querySelector(".scene-root");
        if (root) {
            const rr = root.getBoundingClientRect();
            const cs = getComputedStyle(root);
            out.sceneRoot = {
                rect: { w: Math.round(rr.width), h: Math.round(rr.height), x: Math.round(rr.x), y: Math.round(rr.y) },
                contentVisibility: cs.contentVisibility,
                containIntrinsicSize: cs.containIntrinsicSize,
                position: cs.position,
            };
        }
        // the stage CELL the scene mounts into (positioning context)
        const cell = document.querySelector(".stage-cell") || canvas?.closest("[class*='stage']");
        if (cell) {
            const cr = cell.getBoundingClientRect();
            const cs = getComputedStyle(cell);
            out.stageCell = {
                cls: cell.className,
                rect: { w: Math.round(cr.width), h: Math.round(cr.height), x: Math.round(cr.x), y: Math.round(cr.y) },
                position: cs.position,
                inset: `${cs.top} ${cs.right} ${cs.bottom} ${cs.left}`,
            };
        }
        return out;
    });
}

// Sample whether the canvas is actually painting frames (rAF running) by reading
// a checksum of the canvas pixels twice with a delay. If the room/sphere render,
// the gl drawing buffer has content; "floats around" implies position drift —
// we sample the visible centroid of painted pixels over time via a 2D snapshot
// of the canvas using toDataURL is not reliable for webgl with preserveDrawingBuffer
// false; instead we screenshot twice and compare in node if needed. Here we just
// capture two screenshots a beat apart to eyeball drift.

async function main() {
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        console.error("dist/gh-pages not built");
        process.exit(2);
    }
    let chromium;
    const requireFrom = createRequire(
        path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
    );
    try {
        ({ chromium } = requireFrom("playwright-core"));
    } catch {
        ({ chromium } = requireFrom("@playwright/test"));
    }

    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const report = {};

    try {
        const VW = 1440;
        const { ctx, page } = await openSceneFresh(browser, base, "amiga", VW);

        // ── 1. first-load runtime state ───────────────────────────────────────
        report.firstLoad = await probeAmigaRuntime(page);
        await page.screenshot({ path: path.join(SHOTS, "b3-amiga-01-load.png") });

        // ── 2. is the present loop drifting the sphere with NO input? ("floats")
        // Screenshot t0, wait 1.2s, screenshot t1 — drift visible by eye/diff.
        await page.waitForTimeout(200);
        await page.screenshot({ path: path.join(SHOTS, "b3-amiga-02-t0.png") });
        await page.waitForTimeout(1500);
        await page.screenshot({ path: path.join(SHOTS, "b3-amiga-03-t1.png") });

        // ── 3. try a drag-on-canvas (the spin gesture) ────────────────────────
        const canvas = await page.$("canvas.amiga-canvas");
        if (canvas) {
            const box = await canvas.boundingBox();
            if (box) {
                const cx = box.x + box.width / 2;
                const cy = box.y + box.height / 2;
                await page.mouse.move(cx, cy);
                await page.mouse.down();
                for (let i = 1; i <= 8; i++) {
                    await page.mouse.move(cx + i * 12, cy - i * 4);
                    await page.waitForTimeout(16);
                }
                await page.mouse.up();
                report.dragErrorsAfter = pageErrors.length;
                await page.waitForTimeout(300);
                await page.screenshot({ path: path.join(SHOTS, "b3-amiga-04-after-drag.png") });
            }
        }

        // ── 4. the boing egg (dblclick) ───────────────────────────────────────
        if (canvas) {
            await canvas.dblclick().catch(() => {});
            await page.waitForTimeout(700);
            await page.screenshot({ path: path.join(SHOTS, "b3-amiga-05-boing.png") });
            report.boingState = await probeAmigaRuntime(page);
        }

        report.firstLoadShape = report.firstLoad;
        await ctx.close();

        // ── 5. switch INTO amiga from another scene (the float-on-switch path) ─
        // Reproduce the user report "switching easing→amiga shows blank/broken".
        const ec = await openSceneFresh(browser, base, "easing", VW);
        try {
            // click the amiga dock entry, then probe
            const clicked = await ec.page.evaluate(() => {
                const links = [...document.querySelectorAll("a,button,[role='button']")];
                const target = links.find((el) =>
                    /amiga/i.test(el.getAttribute("href") || "") ||
                    /amiga/i.test(el.getAttribute("aria-label") || "") ||
                    /amiga/i.test(el.textContent || ""),
                );
                if (target) {
                    target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                    return true;
                }
                return false;
            });
            report.switchDockClicked = clicked;
            // fallback: hash-navigate
            if (!clicked) {
                await ec.page.evaluate(() => { location.hash = "#/amiga"; });
            }
            await ec.page.waitForTimeout(1600);
            report.afterSwitch = await probeAmigaRuntime(ec.page);
            await ec.page.screenshot({ path: path.join(SHOTS, "b3-amiga-06-switch-from-easing.png") });
        } finally {
            await ec.ctx.close();
        }
    } finally {
        await browser.close();
        server.close();
    }

    report.consoleLog = consoleLog;
    report.pageErrors = pageErrors;
    report.netFails = netFails;
    console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
    console.error("PROBE CRASH:", e);
    process.exit(1);
});
