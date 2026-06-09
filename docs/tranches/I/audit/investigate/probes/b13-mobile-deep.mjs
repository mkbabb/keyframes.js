#!/usr/bin/env node
/**
 * b13-mobile-deep — second mobile probe: scene-SWITCH crash (B2), dock
 * interactivity/animation, sheet-body content visibility, menubar overlap.
 * 390×844 only (the broadest device).
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
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".ttf": "font/ttf", ".woff2": "font/woff2", ".svg": "image/svg+xml" };

function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        let p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) p = path.join(DIST, "index.html");
        res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
        fs.createReadStream(p).pipe(res);
    });
}
function resolveChromium() {
    const requireFrom = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
    try { return requireFrom("playwright-core").chromium; } catch { return requireFrom("@playwright/test").chromium; }
}
async function waitScene(page, scene) {
    await page.waitForFunction(([mk, s]) => { try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s; } catch { return false; } }, [MACHINE_KEY, scene], { timeout: 8000 }).catch(() => {});
}

(async () => {
    const chromium = resolveChromium();
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const VW = 390, VH = 844;
    const out = {};

    try {
        // ── TEST A: scene-switch while a scene is "playing" (B2 reproduction) ──
        {
            const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, hasTouch: true, isMobile: true });
            const page = await ctx.newPage();
            const errs = [], cons = [];
            page.on("pageerror", (e) => errs.push({ msg: e.message?.slice(0, 400), stack: e.stack?.split("\n").slice(0, 7).join(" | ") }));
            page.on("console", (m) => { if (m.type() === "error") cons.push(m.text().slice(0, 400)); });

            await page.goto(`${base}/#/cube`, { waitUntil: "load" });
            await waitScene(page, "cube");
            await page.setViewportSize({ width: VW, height: VH });
            await page.waitForTimeout(900);
            // Press play (the menubar play button) to set the scene "playing"
            const playClicked = await page.evaluate(() => {
                const btns = [...document.querySelectorAll("button,[role=button]")];
                const play = btns.find((b) => /play|pause|toggle/i.test(b.getAttribute("aria-label") || "") || b.querySelector("svg"));
                return false; // we'll drive via store instead, below
            });
            // Drive "playing" deterministically: set scenePlayback isPlaying for cube,
            // then switch routes (the B2 suspend/resume path).
            await page.evaluate(() => {
                // start the group by clicking the last menubar button (the play ▷)
                const bar = document.querySelector(".animation-menu-bar, [class*='menu-bar'], [class*='menubar']");
                const btns = bar ? [...bar.querySelectorAll("button")] : [];
                const last = btns[btns.length - 1];
                if (last) last.click();
            });
            await page.waitForTimeout(700);
            const errsBeforeSwitch = errs.length;
            // Now SWITCH scenes via the scene picker (top dock) — easing
            await page.evaluate(() => { location.hash = "#/easing"; });
            await waitScene(page, "easing");
            await page.setViewportSize({ width: VW, height: VH });
            await page.waitForTimeout(1000);
            // switch again easing -> amiga (B2's named pair)
            await page.evaluate(() => { location.hash = "#/amiga"; });
            await waitScene(page, "amiga");
            await page.waitForTimeout(1000);
            out.sceneSwitch = {
                pageErrors: errs,
                consoleErrors: cons,
                errsBeforeSwitch,
                note: "errors appearing after errsBeforeSwitch index were triggered by the route switch (B2 suspend/resume)",
            };
            await page.screenshot({ path: path.join(SHOTS, "b13-deep-after-switch-amiga.png") }).catch(() => {});
            await ctx.close();
        }

        // ── TEST B: dock + menubar interactivity / animation timing ──
        {
            const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, hasTouch: true, isMobile: true });
            const page = await ctx.newPage();
            await page.goto(`${base}/#/cube`, { waitUntil: "load" });
            await waitScene(page, "cube");
            await page.setViewportSize({ width: VW, height: VH });
            await page.waitForTimeout(1000);
            out.dock = await page.evaluate(() => {
                const docks = [...document.querySelectorAll(".z-dock, [class*='z-dock']")].map((el) => {
                    const r = el.getBoundingClientRect();
                    const cs = getComputedStyle(el);
                    return { cls: el.className?.toString().slice(0, 70), top: Math.round(r.top), bottom: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.h || r.height), pos: cs.position, z: cs.zIndex, transition: cs.transition?.slice(0, 80), willChange: cs.willChange, userSelect: cs.userSelect };
                }).filter((d) => d.w > 0);
                // any element with a long/heavy transition near the dock
                const menubar = document.querySelector("[class*='menu'],[class*='menubar'],[class*='ribbon']");
                return { docks, menubarFound: !!menubar };
            });
            // Tap the top dock scene-picker trigger and measure response
            const pickerProbe = await page.evaluate(async () => {
                const trigger = document.querySelector("[class*='z-dock'] button, [class*='z-dock'] [role=button]");
                if (!trigger) return { error: "no dock trigger" };
                const t0 = performance.now();
                trigger.click();
                await new Promise((r) => setTimeout(r, 400));
                // did a popover/menu open?
                const open = !!document.querySelector("[data-state=open],[role=menu],[role=listbox],[class*='popover']");
                return { clickedMs: +(performance.now() - t0).toFixed(0), popoverOpen: open };
            });
            out.dock.pickerProbe = pickerProbe;
            await ctx.close();
        }

        // ── TEST C: with sheet seeded OPEN, is the controls BODY actually visible? ──
        {
            const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, hasTouch: true, isMobile: true });
            const page = await ctx.newPage();
            await page.goto(`${base}/#/cube`, { waitUntil: "load" });
            await waitScene(page, "cube");
            await page.evaluate((ck) => {
                const firstOption = [...document.querySelectorAll("[role=option]")].map((el) => el.textContent?.trim()).find((t) => t) ?? "Rotations";
                let store; try { store = JSON.parse(localStorage.getItem(ck) || "{}"); } catch { store = {}; }
                store.Cube = { ...(store.Cube || {}), isControlsPanelOpen: true, selectedAnimation: (store.Cube && store.Cube.selectedAnimation) || firstOption };
                localStorage.setItem(ck, JSON.stringify(store));
            }, CTRL_KEY);
            await page.reload({ waitUntil: "load" });
            await page.evaluate(() => { location.hash = "#/cube"; });
            await waitScene(page, "cube");
            await page.setViewportSize({ width: VW, height: VH });
            await page.waitForTimeout(1400);
            out.sheetBody = await page.evaluate(() => {
                const wrap = document.querySelector(".controls-pane-wrapper");
                const pane = document.querySelector(".controls-pane");
                const content = document.querySelector(".controls-content");
                const wr = wrap?.getBoundingClientRect();
                const pr = pane?.getBoundingClientRect();
                const cr = content?.getBoundingClientRect();
                const sheetT = wrap ? getComputedStyle(wrap).getPropertyValue("--sheet-t").trim() : null;
                const paneOpacity = pane ? getComputedStyle(pane).opacity : null;
                const panePE = pane ? getComputedStyle(pane).pointerEvents : null;
                // is the actual controls UI (sliders etc) inside the viewport and visible?
                const sliders = [...document.querySelectorAll(".controls-pane input, .controls-pane [role=slider], .controls-pane button")];
                const visibleControls = sliders.filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom <= window.innerHeight && r.top >= 0; }).length;
                return {
                    sheetT,
                    wrapRect: wr && { top: Math.round(wr.top), bottom: Math.round(wr.bottom), h: Math.round(wr.height) },
                    paneRect: pr && { top: Math.round(pr.top), bottom: Math.round(pr.bottom), h: Math.round(pr.height) },
                    contentRect: cr && { top: Math.round(cr.top), bottom: Math.round(cr.bottom), h: Math.round(cr.height) },
                    paneOpacity,
                    panePointerEvents: panePE,
                    totalControlEls: sliders.length,
                    visibleControlsInViewport: visibleControls,
                    vh: window.innerHeight,
                };
            });
            await page.screenshot({ path: path.join(SHOTS, "b13-deep-cube-open-seeded.png") }).catch(() => {});
            await ctx.close();
        }
    } finally {
        await browser.close();
        server.close();
    }

    const outPath = path.resolve(HERE, "../b13-mobile-deep.result.json");
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
    console.log(JSON.stringify(out, null, 2));
})();
