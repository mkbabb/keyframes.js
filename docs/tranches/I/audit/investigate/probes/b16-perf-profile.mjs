#!/usr/bin/env node
/**
 * b16-perf-profile — Tranche I investigation probe.
 *
 * MEASURE the demo's runtime perf against the user's "supremely broken, slow,
 * errored" report. Quantifies:
 *   (1) initial load — FCP / LCP / DCL / load / TTFB / long-tasks-during-boot
 *   (2) scene-switch latency — switch easing→amiga→spring→square, time each
 *   (3) dock-spring frame timing — open the dock, sample rAF frame intervals +
 *       count dropped frames during the spring expand
 *   (4) long tasks (>50ms) — PerformanceObserver('longtask') for the whole run
 *   (5) rAF loop cost — sample the steady-state frame interval idle vs playing
 *   (6) glass-ui backdrop-filter cost — count backdrop-filter layers + measure
 *       a forced repaint with them present
 *   (7) main-bundle weight / chunk transfer (from the network log)
 *
 * Harness modeled on scripts/proof-no-orphan-specular.mjs: serveDist on port 0,
 * chromium via createRequire(KF_PLAYWRIGHT_DIR).require("playwright-core"),
 * openSceneFresh navigating `${base}/#/${scene}`.
 *
 * RUN:  KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
 *         node docs/tranches/I/audit/investigate/probes/b16-perf-profile.mjs
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
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".ttf": "font/ttf",
    ".woff2": "font/woff2",
    ".svg": "image/svg+xml",
    ".map": "application/json",
};

function serveDist() {
    const xfer = []; // [{url, bytes}]
    const server = http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
            res.writeHead(404).end();
            return;
        }
        const body = fs.readFileSync(p);
        xfer.push({ url: urlPath, bytes: body.length });
        res.writeHead(200, {
            "content-type": MIME[path.extname(p)] ?? "application/octet-stream",
        });
        res.end(body);
    });
    server._xfer = xfer;
    return server;
}

const MACHINE_KEY = "keyframes-js-scene-machine";
const CTRL_KEY = "animation-groups-control-options-store";

async function openSceneFresh(browser, base, scene, vw = 1440) {
    const ctx = await browser.newContext({ viewport: { width: vw, height: 900 } });
    const page = await ctx.newPage();
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
    await page.waitForTimeout(900);
    return { ctx, page };
}

// Install a long-task + paint observer BEFORE navigation so boot is captured.
const BOOT_OBSERVERS = () => {
    window.__perf = { longTasks: [], paints: {}, lcp: 0 };
    try {
        new PerformanceObserver((l) => {
            for (const e of l.getEntries())
                window.__perf.longTasks.push({ start: Math.round(e.startTime), dur: Math.round(e.duration) });
        }).observe({ type: "longtask", buffered: true });
    } catch {}
    try {
        new PerformanceObserver((l) => {
            for (const e of l.getEntries()) window.__perf.paints[e.name] = Math.round(e.startTime);
        }).observe({ type: "paint", buffered: true });
    } catch {}
    try {
        new PerformanceObserver((l) => {
            const es = l.getEntries();
            const last = es[es.length - 1];
            if (last) window.__perf.lcp = Math.round(last.startTime);
        }).observe({ type: "largest-contentful-paint", buffered: true });
    } catch {}
};

// Sample rAF frame intervals for `ms` and return {n, mean, p50, p95, max, dropped}.
const SAMPLE_RAF = (ms) =>
    new Promise((resolve) => {
        const ivs = [];
        let last = performance.now();
        const t0 = last;
        const tick = (now) => {
            ivs.push(now - last);
            last = now;
            if (now - t0 < ms) requestAnimationFrame(tick);
            else {
                const s = ivs.slice(1).sort((a, b) => a - b);
                const at = (q) => s.length ? s[Math.min(s.length - 1, Math.floor(q * s.length))] : 0;
                resolve({
                    n: s.length,
                    mean: +(s.reduce((a, b) => a + b, 0) / (s.length || 1)).toFixed(2),
                    p50: +at(0.5).toFixed(2),
                    p95: +at(0.95).toFixed(2),
                    max: +(s[s.length - 1] || 0).toFixed(2),
                    dropped: s.filter((x) => x > 24).length, // >24ms ⇒ a 60fps frame was missed
                });
            }
        };
        requestAnimationFrame(tick);
    });

const out = { ts: new Date().toISOString(), measurements: {} };
const log = (...a) => console.log(...a);

async function main() {
    let chromium;
    try {
        const requireFrom = createRequire(
            path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
        );
        ({ chromium } = requireFrom("playwright-core"));
    } catch (e) {
        console.error("playwright-core not resolvable:", e.message);
        process.exit(2);
    }

    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    log(`serving dist/gh-pages at ${base}`);

    const browser = await chromium.launch();
    const consoleErrors = [];
    const pageErrors = [];

    try {
        // ── (1) INITIAL LOAD — cold boot of the home/cube route ──
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await ctx.newPage();
        page.on("console", (m) => {
            if (m.type() === "error") consoleErrors.push(m.text().slice(0, 300));
        });
        page.on("pageerror", (e) => pageErrors.push(String(e).slice(0, 400)));
        await page.addInitScript(BOOT_OBSERVERS);
        await page.addInitScript((ck) => {
            try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {}
        }, CTRL_KEY);

        const tNav = Date.now();
        await page.goto(`${base}/#/cube`, { waitUntil: "load" });
        const wallLoad = Date.now() - tNav;
        await page.waitForTimeout(2500); // let LCP + boot long-tasks settle

        const nav = await page.evaluate(() => {
            const n = performance.getEntriesByType("navigation")[0] || {};
            const r = performance.getEntriesByType("resource");
            const big = r
                .filter((x) => x.transferSize > 0 || x.decodedBodySize > 0)
                .map((x) => ({
                    name: x.name.split("/").pop(),
                    enc: Math.round((x.encodedBodySize || x.transferSize || 0) / 1024),
                    dec: Math.round((x.decodedBodySize || 0) / 1024),
                    dur: Math.round(x.duration),
                }))
                .sort((a, b) => b.dec - a.dec)
                .slice(0, 12);
            return {
                ttfb: Math.round(n.responseStart || 0),
                domContentLoaded: Math.round(n.domContentLoadedEventEnd || 0),
                loadEvent: Math.round(n.loadEventEnd || 0),
                domInteractive: Math.round(n.domInteractive || 0),
                resourceCount: r.length,
                jsCssTransferKB: Math.round(
                    r.filter((x) => /\.(js|css)/.test(x.name)).reduce((s, x) => s + (x.encodedBodySize || 0), 0) / 1024,
                ),
                jsCssDecodedKB: Math.round(
                    r.filter((x) => /\.(js|css)/.test(x.name)).reduce((s, x) => s + (x.decodedBodySize || 0), 0) / 1024,
                ),
                heaviest: big,
                perf: window.__perf,
            };
        });

        const bootLongTasks = nav.perf.longTasks || [];
        const bootBlockingMs = bootLongTasks.reduce((s, t) => s + Math.max(0, t.dur - 50), 0);
        out.measurements.initialLoad = {
            wallClockToLoadMs: wallLoad,
            ttfbMs: nav.ttfb,
            fcpMs: nav.perf.paints["first-contentful-paint"] ?? null,
            lcpMs: nav.perf.lcp || null,
            domInteractiveMs: nav.domInteractive,
            domContentLoadedMs: nav.domContentLoaded,
            loadEventMs: nav.loadEvent,
            resourceCount: nav.resourceCount,
            jsCssTransferKB: nav.jsCssTransferKB,
            jsCssDecodedKB: nav.jsCssDecodedKB,
            bootLongTaskCount: bootLongTasks.length,
            bootLongestTaskMs: bootLongTasks.reduce((m, t) => Math.max(m, t.dur), 0),
            bootTotalBlockingTimeMs: bootBlockingMs,
            heaviestResources: nav.heaviest,
        };
        log("(1) initial load:", JSON.stringify(out.measurements.initialLoad, null, 2));

        // ── (6) backdrop-filter cost — count layers + forced-repaint timing ──
        const backdrop = await page.evaluate(() => {
            const all = [...document.querySelectorAll("*")];
            let bd = 0;
            const samples = [];
            for (const el of all) {
                const cs = getComputedStyle(el);
                const f = cs.backdropFilter || cs.webkitBackdropFilter;
                if (f && f !== "none") {
                    bd++;
                    if (samples.length < 8) {
                        const r = el.getBoundingClientRect();
                        samples.push({
                            cls: (el.className || "").toString().slice(0, 50),
                            filter: f.slice(0, 40),
                            area: Math.round(r.width * r.height),
                        });
                    }
                }
            }
            // Force a few full repaints; measure cost with backdrop layers present.
            const t0 = performance.now();
            for (let i = 0; i < 30; i++) {
                document.body.style.transform = `translateZ(0) translateX(${i % 2}px)`;
                void document.body.offsetHeight; // force reflow+repaint
            }
            document.body.style.transform = "";
            const repaint30ms = +(performance.now() - t0).toFixed(2);
            return { backdropLayerCount: bd, repaint30ms, samples };
        });
        out.measurements.backdropFilter = backdrop;
        log("(6) backdrop-filter:", JSON.stringify(backdrop, null, 2));

        // ── (5) rAF loop cost — IDLE steady state on cube (has idle bob) ──
        const rafIdle = await page.evaluate(SAMPLE_RAF, 1500);
        out.measurements.rafIdleCube = rafIdle;
        log("(5) rAF idle (cube, 1.5s):", JSON.stringify(rafIdle));

        await page.screenshot({ path: path.join(SHOTS, "b16-01-cube-loaded.png") });

        // ── (3) dock-spring frame timing — hover the dock to expand, sample frames ──
        // The dock starts collapsed (:start-collapsed). Hover triggers the spring expand.
        let dockSpring = { error: "dock not found" };
        try {
            const dock = await page.$(".dock, [class*='dock'], [data-dock]");
            const dockBox = dock ? await dock.boundingBox() : null;
            // Begin sampling, then trigger the expand by moving the mouse onto the dock.
            const samplePromise = page.evaluate(SAMPLE_RAF, 1200);
            if (dockBox) {
                await page.mouse.move(dockBox.x + dockBox.width / 2, dockBox.y + dockBox.height / 2);
            } else {
                // fallback: hover top-center where the fixed dock lives
                await page.mouse.move(720, 24);
            }
            dockSpring = await samplePromise;
        } catch (e) {
            dockSpring = { error: String(e).slice(0, 200) };
        }
        out.measurements.dockSpringFrames = dockSpring;
        log("(3) dock-spring frames:", JSON.stringify(dockSpring));
        await page.screenshot({ path: path.join(SHOTS, "b16-02-dock-expanded.png") });

        await ctx.close();

        // ── (2) SCENE-SWITCH LATENCY — measure each switch via the dock selector ──
        // Drive switches by setting the hash route (the router maps #/<scene> → scene
        // machine) and timing until the scene's target mounts + first paint settles.
        const switchSeq = ["easing", "amiga", "spring", "square", "sequence", "motion-path", "cube"];
        const sctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const spage = await sctx.newPage();
        spage.on("console", (m) => { if (m.type() === "error") consoleErrors.push("[switch] " + m.text().slice(0, 280)); });
        spage.on("pageerror", (e) => pageErrors.push("[switch] " + String(e).slice(0, 360)));
        await spage.addInitScript(BOOT_OBSERVERS);
        await spage.addInitScript((ck) => {
            try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {}
        }, CTRL_KEY);
        await spage.goto(`${base}/#/cube`, { waitUntil: "load" });
        await spage.waitForTimeout(1500);

        const switchTimings = [];
        for (const scene of switchSeq) {
            const t0 = Date.now();
            await spage.evaluate((s) => { location.hash = `#/${s}`; }, scene);
            // Wait for the scene machine to register the activeScene, then settle a beat.
            const machined = await spage
                .waitForFunction(
                    ([mk, s]) => {
                        try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s; }
                        catch { return false; }
                    },
                    [MACHINE_KEY, scene],
                    { timeout: 6000 },
                )
                .then(() => true)
                .catch(() => false);
            const machineMs = Date.now() - t0;
            // measure frame interval right after the switch (transition cost)
            const postSwitchRaf = await spage.evaluate(SAMPLE_RAF, 600);
            switchTimings.push({
                scene,
                machineSettledMs: machineMs,
                machineRegistered: machined,
                postSwitchRaf,
            });
            await spage.waitForTimeout(400);
        }
        out.measurements.sceneSwitch = switchTimings;
        log("(2) scene-switch:", JSON.stringify(switchTimings, null, 2));
        await spage.screenshot({ path: path.join(SHOTS, "b16-03-after-switch-sequence.png") });

        // ── (4) LONG TASKS for the whole switch run ──
        const switchLongTasks = await spage.evaluate(() => window.__perf.longTasks);
        out.measurements.longTasksDuringSwitches = {
            count: switchLongTasks.length,
            longestMs: switchLongTasks.reduce((m, t) => Math.max(m, t.dur), 0),
            totalBlockingMs: switchLongTasks.reduce((s, t) => s + Math.max(0, t.dur - 50), 0),
            tasks: switchLongTasks.slice(0, 20),
        };
        log("(4) long tasks during switches:", JSON.stringify(out.measurements.longTasksDuringSwitches, null, 2));

        await sctx.close();

        // ── (7) bundle/transfer from the server log ──
        const byUrl = {};
        for (const { url, bytes } of server._xfer) byUrl[url] = (byUrl[url] || 0) + bytes;
        const transfer = Object.entries(byUrl)
            .map(([url, bytes]) => ({ url: url.split("/").pop(), kb: Math.round(bytes / 1024) }))
            .sort((a, b) => b.kb - a.kb)
            .slice(0, 16);
        out.measurements.serverTransfer = {
            totalRequests: server._xfer.length,
            totalKB: Math.round(server._xfer.reduce((s, x) => s + x.bytes, 0) / 1024),
            top: transfer,
        };
        log("(7) server transfer:", JSON.stringify(out.measurements.serverTransfer, null, 2));
    } finally {
        out.consoleErrors = consoleErrors;
        out.pageErrors = pageErrors;
        await browser.close();
        server.close();
    }

    const jsonPath = path.join(HERE, "b16-perf-profile.result.json");
    fs.writeFileSync(jsonPath, JSON.stringify(out, null, 2));
    log(`\nconsole errors: ${out.consoleErrors.length}, page errors: ${out.pageErrors.length}`);
    log(`result written: ${jsonPath}`);
}

main().catch((e) => {
    console.error("PROBE FAILED:", e);
    process.exit(1);
});
