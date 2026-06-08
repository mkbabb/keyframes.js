#!/usr/bin/env node
/**
 * TEMP PROBE — B2 the DFA `this._gen` undefined crash on scene-switch suspend.
 *
 * Models proof-no-orphan-specular.mjs (serveDist on port 0 + chromium via
 * createRequire(KF_PLAYWRIGHT_DIR).require("playwright-core") + openSceneFresh
 * navigating `${base}/#/${scene}`).
 *
 * Reproduces:
 *   (1) Play a scene, switch to another → capture the TypeError chain.
 *   (2) easing → amiga BLANK controls.
 *
 * Captures page.on("console") + page.on("pageerror") verbatim, behaviors, and a
 * screenshot to docs/tranches/I/audit/investigate/shots/.
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
const MACHINE_KEY = "keyframes-js-scene-machine";
const CTRL_KEY = "animation-groups-control-options-store";

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

function attachCapture(page, sink) {
    page.on("console", (msg) => {
        sink.console.push({ type: msg.type(), text: msg.text() });
    });
    page.on("pageerror", (err) => {
        sink.pageerrors.push({ message: err.message, stack: err.stack });
    });
}

async function gotoScene(browser, base, scene, viewportWidth, sink) {
    const ctx = await browser.newContext({
        viewport: { width: viewportWidth, height: 900 },
    });
    const page = await ctx.newPage();
    attachCapture(page, sink);
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
    await page.waitForTimeout(1000);
    return { ctx, page };
}

/** Drive an in-page scene switch via the hash router (the dock click ends up
 *  calling switchScene → machine NAVIGATE; navigating the hash is the same
 *  router entry the dock uses, and exercises the SAME captureActive→suspend). */
async function navigateHash(page, scene) {
    await page.evaluate((s) => {
        location.hash = `#/${s}`;
    }, scene);
    await page.waitForTimeout(1200);
}

/** Try to find + click the bottom-bar play button (the rainbow group-play).
 *  Returns whether a click happened. */
async function clickPlay(page) {
    // The menubar play/pause button. Probe a few resilient selectors.
    const candidates = [
        'button[aria-label*="lay" i]',
        'button[title*="lay" i]',
        ".animation-menu-bar button",
        '[class*="menubar"] button',
    ];
    for (const sel of candidates) {
        const el = await page.$(sel);
        if (el) {
            try {
                await el.click({ timeout: 1500, force: true });
                return sel;
            } catch {}
        }
    }
    return null;
}

async function readControlsState(page) {
    return page.evaluate(() => {
        const machineRaw = localStorage.getItem("keyframes-js-scene-machine");
        let machine = null;
        try {
            machine = JSON.parse(machineRaw || "null");
        } catch {}
        // Heuristic blank-controls detection: count rendered control widgets.
        const controlsRoot = document.querySelector(
            '[class*="controls"], [class*="Controls"], .animation-controls',
        );
        const sliders = document.querySelectorAll(
            'input[type="range"], [role="slider"]',
        ).length;
        const selects = document.querySelectorAll(
            'select, [role="combobox"], button[role="combobox"]',
        ).length;
        const buttons = document.querySelectorAll("button").length;
        return {
            activeScene: machine?.activeScene ?? null,
            machine,
            hasControlsRoot: !!controlsRoot,
            sliders,
            selects,
            buttons,
        };
    });
}

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
    const VW = 1440;
    const browser = await chromium.launch();

    const report = { scenarios: [] };

    try {
        // ── SCENARIO A: play easing, switch easing → amiga (the user's exact repro) ──
        {
            const sink = { console: [], pageerrors: [] };
            const { ctx, page } = await gotoScene(browser, base, "easing", VW, sink);
            const playSel = await clickPlay(page);
            await page.waitForTimeout(800);
            const beforeSwitch = await readControlsState(page);
            await page.screenshot({
                path: path.join(SHOTS, "b2-A1-easing-playing.png"),
                fullPage: false,
            });

            // Switch easing → amiga (the BLANK-controls + _gen crash pair).
            await navigateHash(page, "amiga");
            const afterSwitch = await readControlsState(page);
            await page.screenshot({
                path: path.join(SHOTS, "b2-A2-amiga-after-switch.png"),
                fullPage: false,
            });

            report.scenarios.push({
                name: "A: easing(playing) → amiga",
                playClicked: playSel,
                beforeSwitch,
                afterSwitch,
                console: sink.console,
                pageerrors: sink.pageerrors,
            });
            await ctx.close();
        }

        // ── SCENARIO B: play cube, switch cube → easing (group adapter suspend) ──
        {
            const sink = { console: [], pageerrors: [] };
            const { ctx, page } = await gotoScene(browser, base, "cube", VW, sink);
            const playSel = await clickPlay(page);
            await page.waitForTimeout(800);
            await navigateHash(page, "easing");
            await page.waitForTimeout(600);
            report.scenarios.push({
                name: "B: cube(playing) → easing",
                playClicked: playSel,
                console: sink.console,
                pageerrors: sink.pageerrors,
            });
            await ctx.close();
        }

        // ── SCENARIO C: easing → amiga WITHOUT explicit play (autoPlays path) ──
        {
            const sink = { console: [], pageerrors: [] };
            const { ctx, page } = await gotoScene(browser, base, "easing", VW, sink);
            await page.waitForTimeout(600);
            await navigateHash(page, "amiga");
            await page.waitForTimeout(800);
            const afterSwitch = await readControlsState(page);
            await page.screenshot({
                path: path.join(SHOTS, "b2-C-amiga-autoplay-switch.png"),
                fullPage: false,
            });
            report.scenarios.push({
                name: "C: easing(autoPlay) → amiga (no manual play)",
                afterSwitch,
                console: sink.console,
                pageerrors: sink.pageerrors,
            });
            await ctx.close();
        }
    } finally {
        await browser.close();
        server.close();
    }

    console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
    console.error("PROBE ERROR:", e);
    process.exit(1);
});
