#!/usr/bin/env node
/**
 * b13-mobile — Tranche I INVESTIGATION probe (mobile surface).
 *
 * Drives the BUILT dist/gh-pages at two mobile viewports (390×844 iPhone-12 +
 * 375×667 iPhone-SE/8) and captures, per scene:
 *   • page.on("console") + page.on("pageerror") VERBATIM
 *   • the single-page overlay geometry (stage full-bleed? sheet occlusion?)
 *   • the springy bottom-sheet drawer (drive the grab handle, sample --sheet-t)
 *   • the top dock + bottom menubar (affixed? z-order? clickable?)
 *   • a screenshot per scene
 *
 * Models proof-no-orphan-specular.mjs / proof-drawer-spring.mjs (serveDist on
 * port 0 + chromium via createRequire(KF_PLAYWRIGHT_DIR).require("playwright-
 * core") + openSceneFresh navigating `${base}/#/${scene}`).
 *
 * Run:  KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
 *       node docs/tranches/I/audit/investigate/probes/b13-mobile.mjs
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

const SUPER_KEY_BY_SCENE = {
    cube: "Cube",
    amiga: "Amiga",
    square: "Square",
    easing: "Easing",
    spring: "Spring",
    sequence: "Sequence",
    "motion-path": "MotionPath",
};

const MIME = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".ttf": "font/ttf",
    ".woff2": "font/woff2",
    ".svg": "image/svg+xml",
};

function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        let p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
            // SPA fallback so hash routes resolve.
            p = path.join(DIST, "index.html");
        }
        res.writeHead(200, {
            "content-type": MIME[path.extname(p)] ?? "application/octet-stream",
        });
        fs.createReadStream(p).pipe(res);
    });
}

function resolveChromium() {
    const requireFrom = createRequire(
        path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
    );
    try {
        return requireFrom("playwright-core").chromium;
    } catch {
        return requireFrom("@playwright/test").chromium;
    }
}

const report = { viewports: {} };

async function settleScene(page, scene, vw, vh) {
    await page.evaluate((s) => {
        location.hash = "#/" + s;
    }, scene);
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
    await page.setViewportSize({ width: vw, height: vh });
    // seed open + a selection so the v-show sheet renders
    const superKey = SUPER_KEY_BY_SCENE[scene];
    await page.evaluate(
        ([ck, sk]) => {
            const firstOption =
                [...document.querySelectorAll("[role=option]")]
                    .map((el) => el.textContent?.trim())
                    .find((t) => t && t.length > 0) ?? "";
            let store;
            try {
                store = JSON.parse(localStorage.getItem(ck) || "{}");
            } catch {
                store = {};
            }
            const prev = sk && store[sk] && typeof store[sk] === "object" ? store[sk] : {};
            store[sk] = {
                ...prev,
                isControlsPanelOpen: true,
                selectedAnimation:
                    prev.selectedAnimation && prev.selectedAnimation.length > 0
                        ? prev.selectedAnimation
                        : firstOption,
            };
            localStorage.setItem(ck, JSON.stringify(store));
        },
        [CTRL_KEY, superKey],
    );
    await page.reload({ waitUntil: "load" });
    await page.evaluate((s) => {
        location.hash = "#/" + s;
    }, scene);
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
    await page.setViewportSize({ width: vw, height: vh });
    await page.waitForTimeout(1100);
}

async function probeOverlay(page) {
    return page.evaluate(() => {
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        const clamp = (v) => Math.max(0, Math.min(vh, v));
        const q = (s) => document.querySelector(s);
        const sheet = q(".controls-pane-wrapper");
        const host = q(".scene-host");
        const cell = q(".stage-cell");
        const r = (el) => (el ? el.getBoundingClientRect() : null);
        const sr = r(sheet);
        const hr = r(host);
        const cr = r(cell);
        const sheetCs = sheet ? getComputedStyle(sheet) : null;
        const cellCs = cell ? getComputedStyle(cell) : null;
        const modeClass = sheet
            ? [...sheet.classList]
                  .map((c) => /^controls-pane--stage-(.+)$/.exec(c)?.[1])
                  .find(Boolean) ?? null
            : null;
        const sheetT = sheet ? getComputedStyle(sheet).getPropertyValue("--sheet-t").trim() : null;
        // docks
        const zdocks = [...document.querySelectorAll(".z-dock, [class*='z-dock']")];
        const docks = zdocks
            .map((el) => {
                const rr = el.getBoundingClientRect();
                return {
                    cls: el.className?.toString().slice(0, 60),
                    top: Math.round(rr.top),
                    bottom: Math.round(rr.bottom),
                    w: Math.round(rr.width),
                    h: Math.round(rr.height),
                    pos: getComputedStyle(el).position,
                };
            })
            .filter((d) => d.w > 0 && d.h > 0);
        return {
            vw,
            vh,
            modeClass,
            sheetT,
            sheet: sr && {
                top: Math.round(sr.top),
                bottom: Math.round(sr.bottom),
                h: Math.round(sr.height),
                w: Math.round(sr.width),
                pos: sheetCs?.position,
                z: sheetCs?.zIndex,
            },
            host: hr && { top: Math.round(hr.top), bottom: Math.round(hr.bottom), h: Math.round(hr.height), w: Math.round(hr.width) },
            cell: cr && { pos: cellCs?.position, top: Math.round(cr.top), bottom: Math.round(cr.bottom), h: Math.round(cr.height) },
            visibleUnoccluded: sr && hr ? Math.round(clamp(sr.top) - clamp(hr.top)) : null,
            visibleFrac: sr && hr ? +(((clamp(sr.top) - clamp(hr.top)) / vh).toFixed(3)) : null,
            hasGrabHandle: !!q(".sheet-grab-handle"),
            // does any non-handle text have user-select:none? sample the menubar + dock
            bodyUserSelect: getComputedStyle(document.body).userSelect,
        };
    });
}

async function driveSheet(page) {
    return page.evaluate(() => {
        return new Promise((resolve) => {
            const el = document.querySelector(".controls-pane-wrapper");
            if (!el) return resolve({ error: "no .controls-pane-wrapper" });
            const handle = el.querySelector(".sheet-grab-handle");
            if (!handle) return resolve({ error: "no .sheet-grab-handle" });
            const read = () => parseFloat(getComputedStyle(el).getPropertyValue("--sheet-t")) || 0;
            const start = read();
            const samples = [];
            const t0 = performance.now();
            let moveT0 = null;
            const tick = () => {
                const now = performance.now();
                const v = read();
                samples.push({ t: +(now - t0).toFixed(1), v: +v.toFixed(4) });
                if (moveT0 === null && Math.abs(v - start) > 0.01) moveT0 = now - t0;
                if (now - t0 < 900) requestAnimationFrame(tick);
                else resolve({ samples, start, moveOffset: moveT0 });
            };
            handle.click();
            requestAnimationFrame(tick);
        });
    });
}

function analyze(trace) {
    if (trace.error) return { error: trace.error };
    const vs = trace.samples.map((s) => s.v);
    const terminal = vs[vs.length - 1];
    const max = Math.max(...vs);
    const min = Math.min(...vs);
    const moveStart = trace.moveOffset ?? 0;
    let settleMs = null;
    for (const s of trace.samples) {
        if (s.t < moveStart) continue;
        if (Math.abs(s.v - terminal) <= 0.01) {
            settleMs = +(s.t - moveStart).toFixed(0);
            break;
        }
    }
    const dir = terminal - trace.start;
    const overshoot = +(dir >= 0 ? max - terminal : terminal - min).toFixed(4);
    return { start: +trace.start.toFixed(3), terminal: +terminal.toFixed(3), max: +max.toFixed(4), min: +min.toFixed(4), settleMs, overshoot, moved: Math.abs(terminal - trace.start) > 0.05, frames: vs.length };
}

(async () => {
    const chromium = resolveChromium();
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();

    const VIEWPORTS = [
        { name: "390x844", vw: 390, vh: 844 },
        { name: "375x667", vw: 375, vh: 667 },
    ];
    const SCENES = ["cube", "easing", "amiga", "square", "spring", "sequence", "motion-path"];

    try {
        for (const vp of VIEWPORTS) {
            report.viewports[vp.name] = { scenes: {} };
            for (const scene of SCENES) {
                const ctx = await browser.newContext({
                    viewport: { width: vp.vw, height: vp.vh },
                    hasTouch: true,
                    isMobile: true,
                });
                const page = await ctx.newPage();
                const consoleMsgs = [];
                const pageErrors = [];
                page.on("console", (m) => {
                    const type = m.type();
                    if (type === "error" || type === "warning") {
                        consoleMsgs.push({ type, text: m.text().slice(0, 500) });
                    }
                });
                page.on("pageerror", (e) => {
                    pageErrors.push({ msg: e.message?.slice(0, 600), stack: e.stack?.split("\n").slice(0, 6).join(" | ") });
                });
                page.on("requestfailed", (req) => {
                    const f = req.failure();
                    if (f && /ENOENT|404|net::ERR/.test(f.errorText)) {
                        consoleMsgs.push({ type: "requestfailed", text: `${req.url().slice(-80)} :: ${f.errorText}` });
                    }
                });

                const rec = { console: consoleMsgs, pageErrors };
                try {
                    await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
                    await settleScene(page, scene, vp.vw, vp.vh);
                    rec.overlay = await probeOverlay(page);
                    // try driving the sheet only on cube/easing (representative subject + editor)
                    if (scene === "cube" || scene === "easing") {
                        rec.sheetTrace = analyze(await driveSheet(page));
                    }
                    const shot = path.join(SHOTS, `b13-${vp.name}-${scene}.png`);
                    await page.screenshot({ path: shot, fullPage: false }).catch(() => {});
                    rec.shot = path.relative(REPO, shot);
                } catch (e) {
                    rec.probeError = e.message?.slice(0, 300);
                }
                report.viewports[vp.name].scenes[scene] = rec;
                await ctx.close();
            }
        }
    } finally {
        await browser.close();
        server.close();
    }

    const out = path.resolve(HERE, "../b13-mobile.result.json");
    fs.writeFileSync(out, JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    console.error(`\n[wrote ${path.relative(REPO, out)}]`);
})();
