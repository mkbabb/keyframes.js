#!/usr/bin/env node
/**
 * I.audit — B8 probe: dock animations "supremely broken, slow, errored" + glass-ui slow.
 *
 * Drives Playwright over the BUILT dist/gh-pages, exercising the dock:
 *   - collapse → expand morph (the SpringProgress / View-Transition FLIP)
 *   - hover scale
 *   - the scene selector popover + the controls selector popover (open/close)
 *   - a scene switch (re-mount churn)
 * while capturing:
 *   - page.on("console") + page.on("pageerror") (verbatim)
 *   - PerformanceObserver longtask entries (main-thread blocks > 50ms)
 *   - rAF frame-timing samples during the morph (jank witness)
 *   - the glass-ui backdrop-filter / element render cost (paint/layout proxy)
 *   - the dock's --spring-dock token + the effective transition timing
 *
 * Pattern mirrors scripts/proof-no-orphan-specular.mjs (serveDist on :0 +
 * chromium via createRequire(KF_PLAYWRIGHT_DIR).require("playwright-core") +
 * openSceneFresh `${base}/#/${scene}`). TEMP probe — runs, writes a JSON dump +
 * a screenshot, prints a summary. Not a gate.
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

const MIME = {
    ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
    ".json": "application/json", ".png": "image/png", ".ttf": "font/ttf",
    ".woff2": "font/woff2", ".svg": "image/svg+xml", ".map": "application/json",
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

function loadChromium() {
    const requireFrom = createRequire(
        path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
    );
    try { return requireFrom("playwright-core").chromium; }
    catch { return requireFrom("@playwright/test").chromium; }
}

async function openSceneFresh(browser, base, scene, vw = 1440) {
    const ctx = await browser.newContext({ viewport: { width: vw, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript((ck) => {
        try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {}
    }, CTRL_KEY);
    // Install the perf instrumentation BEFORE load so the observer captures
    // longtasks during the whole session.
    await page.addInitScript(() => {
        window.__perf = { longtasks: [], errors: [] };
        try {
            const po = new PerformanceObserver((list) => {
                for (const e of list.getEntries()) {
                    window.__perf.longtasks.push({ start: Math.round(e.startTime), dur: Math.round(e.duration) });
                }
            });
            po.observe({ entryTypes: ["longtask"] });
        } catch {}
        window.addEventListener("error", (e) => window.__perf.errors.push(String(e.message)));
    });
    await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
    await page.waitForFunction(([mk, s]) => {
        try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s; }
        catch { return false; }
    }, [MACHINE_KEY, scene], { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(1000);
    return { ctx, page };
}

// rAF frame-timing sampler — runs in-page during an action window, returns the
// inter-frame deltas (ms). Jank = deltas well above the 16.7ms 60fps budget.
async function sampleFrames(page, ms) {
    return page.evaluate((dur) => new Promise((resolve) => {
        const deltas = [];
        let last = performance.now();
        const start = last;
        function tick(now) {
            deltas.push(now - last);
            last = now;
            if (now - start < dur) requestAnimationFrame(tick);
            else resolve(deltas);
        }
        requestAnimationFrame(tick);
    }), ms);
}

function frameStats(deltas) {
    if (!deltas.length) return { n: 0 };
    const sorted = [...deltas].sort((a, b) => a - b);
    const sum = deltas.reduce((a, b) => a + b, 0);
    const max = Math.max(...deltas);
    const over33 = deltas.filter((d) => d > 33).length; // dropped >= 1 frame @ 60
    const over50 = deltas.filter((d) => d > 50).length; // > 3 frames @ 60
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    return {
        n: deltas.length,
        meanMs: +(sum / deltas.length).toFixed(2),
        maxMs: +max.toFixed(2),
        p95Ms: +p95.toFixed(2),
        droppedGt33: over33,
        droppedGt50: over50,
        approxFps: +(1000 / (sum / deltas.length)).toFixed(1),
    };
}

async function main() {
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        console.error("dist/gh-pages not built — run `npm run gh-pages`");
        process.exit(2);
    }
    const chromium = loadChromium();
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();

    const report = { base, scenes: {} };

    // Use 'cube' (full dock: collapse toggle + controls select + scene select +
    // hover) and 'easing' (scene-switch target).
    const SCENE = "cube";
    const { ctx, page } = await openSceneFresh(browser, base, SCENE);
    const consoleLines = [];
    const pageErrors = [];
    page.on("console", (m) => consoleLines.push(`[${m.type()}] ${m.text()}`));
    page.on("pageerror", (e) => pageErrors.push(`${e.name}: ${e.message}\n${(e.stack || "").split("\n").slice(0, 6).join("\n")}`));

    const out = { scene: SCENE };

    // ── 0. The dock's resolved spring + transition timing (what actually runs) ──
    out.dockTiming = await page.evaluate(() => {
        const dock = document.querySelector(".glass-dock");
        if (!dock) return { error: "no .glass-dock found" };
        const cs = getComputedStyle(dock);
        const root = getComputedStyle(document.documentElement);
        return {
            classes: dock.className,
            transitionProperty: cs.transitionProperty,
            transitionDuration: cs.transitionDuration,
            transitionTimingFunction: cs.transitionTimingFunction.slice(0, 120),
            backdropFilter: cs.backdropFilter,
            springDock: root.getPropertyValue("--spring-dock").trim().slice(0, 80) + "…",
            dockResizeSpring: root.getPropertyValue("--dock-resize-spring").trim(),
            hasViewTransition: typeof document.startViewTransition === "function",
            backdropFilterCount: document.querySelectorAll("*").length
                ? [...document.querySelectorAll("*")].filter((el) => {
                    const f = getComputedStyle(el).backdropFilter;
                    return f && f !== "none";
                  }).length
                : 0,
        };
    });

    // ── 1. The collapse → expand morph (the SpringProgress / VT FLIP) ──
    // The dock starts collapsed (start-collapsed=true). Hover/click expands it.
    out.morph = {};
    // Find the dock + its initial bounding box.
    const dockBoxCollapsed = await page.evaluate(() => {
        const d = document.querySelector(".glass-dock");
        const r = d.getBoundingClientRect();
        return { w: +r.width.toFixed(1), h: +r.height.toFixed(1), collapsed: d.classList.contains("collapsed"), expanded: d.classList.contains("expanded") };
    });
    out.morph.collapsedBox = dockBoxCollapsed;

    // Trigger expand (hover the dock) while sampling frames across the morph.
    const dockHandle = await page.$(".glass-dock");
    const morphSamplePromise = sampleFrames(page, 1200);
    await dockHandle.hover({ force: true }).catch(() => {});
    // Some docks expand on hover, some on click — also click to be sure.
    await page.waitForTimeout(120);
    await dockHandle.click({ force: true }).catch(() => {});
    const morphDeltas = await morphSamplePromise;
    out.morph.expandFrameStats = frameStats(morphDeltas);
    out.morph.morphAttrSeen = await page.evaluate(() => {
        // Was data-morphing ever set? Snapshot now (may have settled).
        const d = document.querySelector(".glass-dock");
        return { dataMorphing: d.hasAttribute("data-morphing"), expanded: d.classList.contains("expanded"), collapsed: d.classList.contains("collapsed") };
    });
    await page.waitForTimeout(400);
    out.morph.expandedBox = await page.evaluate(() => {
        const r = document.querySelector(".glass-dock").getBoundingClientRect();
        return { w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
    });

    // ── 2. Hover scale jitter (idle dock smoothness) ──
    const idleDeltas = await sampleFrames(page, 800);
    out.idleFrameStats = frameStats(idleDeltas);

    // ── 3. Popover open/close: the scene selector trigger ──
    out.popover = {};
    try {
        const sceneTrigger = await page.$('[aria-label="Scene"]');
        if (sceneTrigger) {
            const popSample = sampleFrames(page, 900);
            await sceneTrigger.click({ force: true });
            await page.waitForTimeout(500);
            const opened = await page.evaluate(() => !!document.querySelector('[role="listbox"], [data-state="open"][role="dialog"], [data-radix-popper-content-wrapper], [data-reka-popper-content-wrapper]'));
            out.popover.sceneOpened = opened;
            out.popover.openFrameStats = frameStats(await popSample);
            // close
            await page.keyboard.press("Escape").catch(() => {});
            await page.waitForTimeout(300);
        } else {
            out.popover.sceneOpened = "no [aria-label=Scene] trigger found";
        }
    } catch (e) {
        out.popover.error = String(e.message);
    }

    // ── 4. Glass-ui element render cost: force a reflow loop over backdrop-filter
    //       elements and time it (a coarse proxy for compositor cost). ──
    out.glassCost = await page.evaluate(() => {
        const glassEls = [...document.querySelectorAll("*")].filter((el) => {
            const f = getComputedStyle(el).backdropFilter;
            return f && f !== "none";
        });
        const t0 = performance.now();
        let sink = 0;
        for (let i = 0; i < 5; i++) {
            for (const el of glassEls) {
                el.style.transform = `translateZ(0) scale(${1 + (i % 2) * 0.0001})`;
                sink += el.getBoundingClientRect().width; // force layout
            }
        }
        for (const el of glassEls) el.style.transform = "";
        return {
            backdropFilterElementCount: glassEls.length,
            reflowLoopMs: +(performance.now() - t0).toFixed(2),
            sample: glassEls.slice(0, 5).map((el) => ({
                cls: (el.className || "").toString().slice(0, 50),
                filter: getComputedStyle(el).backdropFilter.slice(0, 40),
            })),
        };
    });

    // ── 5. Long tasks captured over the whole session ──
    out.longtasks = await page.evaluate(() => window.__perf?.longtasks ?? []);
    out.windowErrors = await page.evaluate(() => window.__perf?.errors ?? []);

    // ── screenshot ──
    const shot = path.join(SHOTS, "b8-dock-cube-expanded.png");
    await page.screenshot({ path: shot, fullPage: false }).catch(() => {});
    out.screenshot = path.relative(REPO, shot);

    out.console = consoleLines;
    out.pageErrors = pageErrors;
    report.scenes[SCENE] = out;

    await ctx.close();
    await browser.close();
    server.close();

    const dump = path.join(SHOTS, "..", "b8-dock-probe-dump.json");
    fs.writeFileSync(dump, JSON.stringify(report, null, 2));
    console.log("=== B8 DOCK / GLASS-UI PERF PROBE ===");
    console.log(JSON.stringify(report, null, 2));
    console.log("\nDump:", path.relative(REPO, dump));
}

main().catch((e) => { console.error("PROBE FAILED:", e); process.exit(1); });
