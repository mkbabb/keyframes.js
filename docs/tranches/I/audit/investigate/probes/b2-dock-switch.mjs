#!/usr/bin/env node
/**
 * TEMP PROBE — B2 via the REAL dock-click scene switch (switchScene → machine
 * NAVIGATE → captureActive → adapter.suspend). The hash-navigate probe did not
 * trip _gen; the dock path is the genuine one the user clicks.
 *
 * Strategy: enumerate the dock's scene buttons, PLAY the current scene, then
 * CLICK each dock target in turn, capturing pageerror after every click. Also
 * dumps the dock anatomy so we know what we clicked.
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

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".ttf": "font/ttf", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".map": "application/json" };
const MACHINE_KEY = "keyframes-js-scene-machine";
const CTRL_KEY = "animation-groups-control-options-store";

function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404).end(); return; }
        res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
        fs.createReadStream(p).pipe(res);
    });
}

async function main() {
    const requireFrom = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
    let chromium;
    try { ({ chromium } = requireFrom("playwright-core")); } catch { ({ chromium } = requireFrom("@playwright/test")); }

    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const out = { steps: [], dockAnatomy: null };

    try {
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await ctx.newPage();
        const pageerrors = [];
        page.on("pageerror", (err) => pageerrors.push({ message: err.message, stack: err.stack }));

        await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);
        // Start on easing (a raw-rAF scene — its adapter is the suspect).
        await page.goto(`${base}/#/easing`, { waitUntil: "load" });
        await page.waitForFunction(([mk, s]) => { try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s; } catch { return false; } }, [MACHINE_KEY, "easing"], { timeout: 8000 }).catch(() => {});
        await page.waitForTimeout(1000);

        // Dock anatomy — find buttons/links that look like scene switchers.
        out.dockAnatomy = await page.evaluate(() => {
            const dock = document.querySelector('[class*="dock" i], nav, [role="navigation"], [class*="Dock"]');
            const allButtons = [...document.querySelectorAll("button, a[href]")];
            const describe = (el) => ({
                tag: el.tagName,
                cls: (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || "").toString().slice(0, 80),
                aria: el.getAttribute("aria-label"),
                title: el.getAttribute("title"),
                href: el.getAttribute("href"),
                text: (el.textContent || "").trim().slice(0, 30),
            });
            return {
                dockFound: !!dock,
                dockCls: dock ? (dock.className.baseVal !== undefined ? dock.className.baseVal : dock.className || "").toString().slice(0, 100) : null,
                buttonCount: allButtons.length,
                sample: allButtons.slice(0, 40).map(describe),
            };
        });

        // Force-play easing first via its play() so the loop is live.
        await page.evaluate(() => { location.hash = "#/easing"; });
        await page.waitForTimeout(400);

        // Click any menubar play button to ensure playing=true.
        for (const sel of ['[class*="menubar"] button', 'button[aria-label*="lay" i]']) {
            const el = await page.$(sel);
            if (el) { try { await el.click({ force: true, timeout: 1000 }); break; } catch {} }
        }
        await page.waitForTimeout(600);

        // Now drive dock switches. Find scene-switch anchors by href="#/<scene>".
        const sceneTargets = ["amiga", "cube", "spring", "square", "sequence", "motion-path"];
        for (const target of sceneTargets) {
            const before = pageerrors.length;
            // Prefer a real dock anchor/button to this scene; fall back to hash.
            const clicked = await page.evaluate((t) => {
                const links = [...document.querySelectorAll("a[href], button")];
                const match = links.find((el) => {
                    const href = el.getAttribute("href") || "";
                    const aria = (el.getAttribute("aria-label") || "").toLowerCase();
                    const title = (el.getAttribute("title") || "").toLowerCase();
                    return href.includes(`#/${t}`) || href.includes(`/${t}`) || aria.includes(t) || title.includes(t);
                });
                if (match) { match.click(); return true; }
                return false;
            }, target);
            if (!clicked) {
                await page.evaluate((t) => { location.hash = `#/${t}`; }, target);
            }
            await page.waitForTimeout(900);
            const newErrors = pageerrors.slice(before);
            const state = await page.evaluate(() => {
                let m = null; try { m = JSON.parse(localStorage.getItem("keyframes-js-scene-machine") || "null"); } catch {}
                return {
                    activeScene: m?.activeScene,
                    sliders: document.querySelectorAll('input[type="range"], [role="slider"]').length,
                    selects: document.querySelectorAll('select, [role="combobox"], button[role="combobox"]').length,
                };
            });
            out.steps.push({ target, clickedDock: clicked, state, newErrors });
            if (newErrors.length) {
                await page.screenshot({ path: path.join(SHOTS, `b2-dock-crash-${target}.png`) });
            }
        }

        await ctx.close();
    } finally {
        await browser.close();
        server.close();
    }
    console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => { console.error("PROBE ERROR:", e); process.exit(1); });
