#!/usr/bin/env node
/**
 * b15-glassui-cards-surfaces — Tranche I investigation probe.
 *
 * AUDITS every kf-owned glass-ui <Card>/<Button>/dock surface in the LIVE BUILT
 * demo (dist/gh-pages): the cartoon-vs-glass register, the specular catch-light
 * bloom, and the perf cost of the glass effects (backdrop-filter blur layers).
 *
 * Models the proven serveDist + playwright pattern from
 * scripts/proof-no-orphan-specular.mjs. Serves dist/gh-pages on port 0, drives
 * chromium via createRequire(KF_PLAYWRIGHT_DIR).require("playwright-core"),
 * navigates `${base}/#/${scene}`, captures console + pageerror, samples the
 * rendered surfaces, hovers to provoke the specular bloom, and screenshots.
 *
 * Run: KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
 *      node docs/tranches/I/audit/investigate/probes/b15-glassui-cards-surfaces.mjs
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
    ".ttf": "font/ttf",
    ".woff2": "font/woff2",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
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

// The warm-white specular catch-light radial signature (glass-ui ~3.5.1).
const SPECULAR_RADIAL = /radial-gradient\([^)]*(?:255,\s*255,\s*255|hsl\(40)/i;

async function openSceneFresh(browser, base, scene) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const consoleMsgs = [];
    const pageErrors = [];
    page.on("console", (m) => consoleMsgs.push({ type: m.type(), text: m.text() }));
    page.on("pageerror", (e) => pageErrors.push(String(e?.stack || e)));
    await page.addInitScript((ck) => {
        try {
            localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true }));
        } catch {
            /* ignore */
        }
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
    await page.waitForTimeout(1000);
    return { ctx, page, consoleMsgs, pageErrors };
}

/** Sample every kf surface: data-surface Cards, glass Buttons, dock icons. */
async function sampleSurfaces(page) {
    return page.evaluate((SIG) => {
        const sig = new RegExp(SIG, "i");
        const inStage = (el) => !!el.closest(".stage-cell, .scene-stage, [data-stage]");
        const out = { cards: [], buttons: [], dock: [], blurLayers: 0, blurDetail: [] };

        // Count every element with an active backdrop-filter blur (the perf cost).
        for (const el of document.querySelectorAll("*")) {
            const cs = getComputedStyle(el);
            const bf = cs.backdropFilter || cs.webkitBackdropFilter || "";
            if (bf && bf !== "none") {
                out.blurLayers += 1;
                if (out.blurDetail.length < 24) {
                    out.blurDetail.push({
                        cls: (el.className || "").toString().slice(0, 60),
                        bf: bf.slice(0, 40),
                        surface: el.getAttribute("data-surface") || null,
                    });
                }
            }
        }

        // kf-owned <Card> surfaces (data-surface present).
        for (const el of document.querySelectorAll("[data-surface]")) {
            const before = getComputedStyle(el, "::before");
            const cs = getComputedStyle(el);
            out.cards.push({
                surface: el.getAttribute("data-surface"),
                onStage: inStage(el),
                cls: (el.className || "").toString().slice(0, 80),
                hasTrack: el.classList.contains("glass-specular-track"),
                beforeBg: (before.backgroundImage || "").slice(0, 90),
                beforeBloom: sig.test(before.backgroundImage || ""),
                bf: (cs.backdropFilter || cs.webkitBackdropFilter || "none").slice(0, 30),
                borderW: cs.borderWidth,
                bg: cs.backgroundColor,
            });
        }

        // glass Buttons + dock icons.
        for (const el of document.querySelectorAll(
            ".glass-specular-track, [class*='dock'], button[class*='glass']",
        )) {
            const before = getComputedStyle(el, "::before");
            const rec = {
                tag: el.tagName,
                cls: (el.className || "").toString().slice(0, 70),
                hasTrack: el.classList.contains("glass-specular-track"),
                beforeBloom: sig.test(before.backgroundImage || ""),
                hasMouseWrite: el.style.getPropertyValue("--mouse-x").trim() !== "",
            };
            if (/dock/i.test(rec.cls)) out.dock.push(rec);
            else out.buttons.push(rec);
        }
        return out;
    }, SPECULAR_RADIAL.source);
}

/** Hover each Card to provoke the hover-state specular intensity lift. */
async function hoverProbe(page) {
    const handles = await page.$$("[data-surface]");
    const blooms = [];
    for (let i = 0; i < handles.length; i++) {
        try {
            await handles[i].hover({ timeout: 1200, force: true });
            await page.waitForTimeout(180);
            const r = await handles[i].evaluate(
                (el, SIG) => ({
                    surface: el.getAttribute("data-surface"),
                    onStage: !!el.closest(".stage-cell, .scene-stage, [data-stage]"),
                    bloom: new RegExp(SIG, "i").test(
                        getComputedStyle(el, "::before").backgroundImage || "",
                    ),
                    intensity: getComputedStyle(el, "::before").getPropertyValue(
                        "--specular-intensity",
                    ),
                }),
                SPECULAR_RADIAL.source,
            );
            if (r.bloom) blooms.push({ idx: i, ...r });
        } catch {
            /* un-hoverable */
        }
        await handles[i].dispose?.();
        await page.mouse.move(2, 2);
        await page.waitForTimeout(40);
    }
    return blooms;
}

/** Micro-perf: measure rAF cadence over ~1s while idle (blur compositing cost). */
async function measureFrameCost(page) {
    return page.evaluate(
        () =>
            new Promise((resolve) => {
                const samples = [];
                let last = performance.now();
                let n = 0;
                function tick(now) {
                    samples.push(now - last);
                    last = now;
                    if (++n < 60) requestAnimationFrame(tick);
                    else {
                        samples.sort((a, b) => a - b);
                        const mean = samples.reduce((s, x) => s + x, 0) / samples.length;
                        const p95 = samples[Math.floor(samples.length * 0.95)];
                        const max = samples[samples.length - 1];
                        const longTasks = samples.filter((x) => x > 32).length;
                        resolve({
                            frames: samples.length,
                            meanMs: +mean.toFixed(2),
                            p95Ms: +p95.toFixed(2),
                            maxMs: +max.toFixed(2),
                            longTasks,
                        });
                    }
                }
                requestAnimationFrame((t) => {
                    last = t;
                    requestAnimationFrame(tick);
                });
            }),
    );
}

async function main() {
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        console.error("dist/gh-pages not built — run `npm run gh-pages` first");
        process.exit(2);
    }
    const chromium = resolveChromium();
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();

    const SCENES = ["cube", "easing", "spring", "sequence", "motion-path", "amiga", "square"];
    const report = {};

    for (const scene of SCENES) {
        const { ctx, page, consoleMsgs, pageErrors } = await openSceneFresh(browser, base, scene);
        try {
            const surfaces = await sampleSurfaces(page);
            const perf = await measureFrameCost(page);
            const blooms = await hoverProbe(page);
            const shot = path.join(SHOTS, `b15-${scene}.png`);
            await page.screenshot({ path: shot, fullPage: false });
            report[scene] = {
                console: consoleMsgs.filter(
                    (m) => m.type === "error" || m.type === "warning",
                ),
                pageErrors,
                blurLayers: surfaces.blurLayers,
                blurDetail: surfaces.blurDetail,
                cards: surfaces.cards,
                buttons: surfaces.buttons.length,
                buttonBloom: surfaces.buttons.filter((b) => b.beforeBloom).length,
                dock: surfaces.dock.length,
                dockTracks: surfaces.dock.filter((d) => d.hasTrack).length,
                dockMouseWrites: surfaces.dock.filter((d) => d.hasMouseWrite).length,
                hoverBlooms: blooms,
                perf,
                shot: path.relative(REPO, shot),
            };
        } catch (e) {
            report[scene] = { fatal: String(e?.stack || e) };
        } finally {
            await ctx.close();
        }
    }

    await browser.close();
    server.close();
    console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
