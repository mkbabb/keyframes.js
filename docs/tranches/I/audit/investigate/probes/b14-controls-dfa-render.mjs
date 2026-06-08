#!/usr/bin/env node
/**
 * INV [b14-controls-dfa-render] — the per-scene control-surface DFA + the
 * easing→amiga "blank controls" (B2) reproduction probe.
 *
 * Models scripts/proof-no-orphan-specular.mjs (serveDist on port 0 +
 * chromium via createRequire(KF_PLAYWRIGHT_DIR).require("playwright-core") +
 * openSceneFresh navigating `${base}/#/${scene}`).
 *
 * GOAL: capture, per scene, WHICH control surfaces actually render (dock tabs +
 * in-panel tabs + the active tab content) vs the DFA table (controlSurfacesFor),
 * AND drive the easing→amiga scene switch to reproduce B2's TypeError +
 * the "blank controls" symptom. Captures page.on("console") + page.on(
 * "pageerror") verbatim + screenshots.
 *
 * Run: KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
 *      node docs/tranches/I/audit/investigate/probes/b14-controls-dfa-render.mjs
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const SHOTS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../shots");
fs.mkdirSync(SHOTS, { recursive: true });

const MIME = {
    ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
    ".json": "application/json", ".png": "image/png", ".ttf": "font/ttf",
    ".woff2": "font/woff2", ".svg": "image/svg+xml", ".webp": "image/webp",
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
        res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
        fs.createReadStream(p).pipe(res);
    });
}

// Attach console + pageerror capture to a page; pushes into the given arrays.
function wire(page, consoleLog, pageErrors) {
    page.on("console", (msg) => {
        consoleLog.push({ type: msg.type(), text: msg.text() });
    });
    page.on("pageerror", (err) => {
        pageErrors.push({ message: err.message, stack: err.stack });
    });
}

async function freshContext(browser, base, scene, consoleLog, pageErrors, vw = 1440) {
    const ctx = await browser.newContext({ viewport: { width: vw, height: 900 } });
    const page = await ctx.newPage();
    wire(page, consoleLog, pageErrors);
    await page.addInitScript((ck) => {
        try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {}
    }, CTRL_KEY);
    await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
    await page.waitForFunction(
        ([mk, s]) => {
            try { return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s; } catch { return false; }
        },
        [MACHINE_KEY, scene],
        { timeout: 8000 },
    ).catch(() => {});
    await page.waitForTimeout(1200);
    return { ctx, page };
}

// Snapshot the control-surface RENDER state from the live DOM.
async function snapshotControlState(page) {
    return await page.evaluate(() => {
        const out = {};
        // The persisted machine activeScene.
        try {
            out.activeScene = JSON.parse(localStorage.getItem("keyframes-js-scene-machine") || "{}").activeScene;
        } catch { out.activeScene = "(unreadable)"; }

        // Dock control-tab triggers: reka TabsTrigger inside the dock control
        // panel. We harvest every [role=tab] visible and its label/value.
        const tabTriggers = [...document.querySelectorAll('[role="tab"]')].map((el) => ({
            value: el.getAttribute("data-value") || el.getAttribute("value") || el.getAttribute("aria-controls") || "",
            label: (el.textContent || "").trim().slice(0, 24),
            selected: el.getAttribute("data-state") === "active" || el.getAttribute("aria-selected") === "true",
            visible: !!(el.offsetParent || el.getClientRects().length),
        }));
        out.tabTriggers = tabTriggers;

        // Active tab panel content text (is the panel BLANK?).
        const activePanels = [...document.querySelectorAll('[role="tabpanel"]')]
            .filter((el) => el.getAttribute("data-state") === "active" || !el.hidden)
            .map((el) => ({
                value: el.getAttribute("data-value") || el.getAttribute("aria-labelledby") || "",
                textLen: (el.textContent || "").trim().length,
                childCount: el.querySelectorAll("*").length,
                visible: !!(el.offsetParent || el.getClientRects().length),
                sample: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
            }));
        out.activePanels = activePanels;

        // Does ANY control affordance render? (dock control-panel toggle, the
        // sliding tab indicator, etc.) — heuristic by presence of [role=tab].
        out.tabCount = tabTriggers.length;

        // The easing sidebar / bezier editor presence — B4 cross-signal.
        out.hasEasingSidebar = !!document.querySelector('[class*="easing" i], [data-easing], svg path[d*="C"]');
        out.hasControlsSliders = document.querySelectorAll('input[type="range"], [role="slider"]').length;

        // Whole-document text length as a blank-detector floor.
        const panel = document.querySelector('[class*="control" i]');
        out.controlRegionTextLen = panel ? (panel.textContent || "").trim().length : -1;
        return out;
    });
}

async function main() {
    let chromium;
    const requireFrom = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
    ({ chromium } = requireFrom("playwright-core"));

    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();

    const report = { perScene: {}, switch: {} };

    try {
        // ── PART 1: per-scene fresh-mount control-surface render snapshot ──────
        const SCENES = ["cube", "amiga", "square", "easing", "spring", "sequence", "motion-path"];
        for (const scene of SCENES) {
            const consoleLog = [], pageErrors = [];
            const { ctx, page } = await freshContext(browser, base, scene, consoleLog, pageErrors);
            const state = await snapshotControlState(page);
            await page.screenshot({ path: path.join(SHOTS, `b14-fresh-${scene}.png`) });
            report.perScene[scene] = { state, consoleLog, pageErrors };
            await ctx.close();
        }

        // ── PART 2: the B2 repro — easing (playing) → amiga scene SWITCH ───────
        // Open easing fresh (it autoPlays). Wait for the rAF loop. Then click
        // the amiga dock nav target to switch — capture the TypeError + whether
        // amiga's controls render BLANK.
        {
            const consoleLog = [], pageErrors = [];
            const { ctx, page } = await freshContext(browser, base, "easing", consoleLog, pageErrors);
            const before = await snapshotControlState(page);
            await page.screenshot({ path: path.join(SHOTS, `b14-switch-0-easing.png`) });

            // Find the amiga nav target in the dock and click it. The dock nav
            // glyphs carry aria-label or the scene label; try several selectors.
            const switched = await page.evaluate(() => {
                const cands = [...document.querySelectorAll("button, a, [role=button], [role=tab]")];
                const amiga = cands.find((el) =>
                    /amiga/i.test(el.getAttribute("aria-label") || "") ||
                    /^amiga$/i.test((el.textContent || "").trim()) ||
                    /amiga/i.test(el.getAttribute("title") || "") ||
                    (el.getAttribute("href") || "").includes("amiga"),
                );
                if (amiga) { amiga.scrollIntoView(); amiga.click(); return { clicked: true, how: amiga.tagName + " " + (amiga.getAttribute("aria-label") || amiga.textContent || "").trim().slice(0, 20) }; }
                return { clicked: false };
            });

            // If the dock click didn't resolve, fall back to hash navigation —
            // which still exercises the machine NAVIGATE → captureActive path.
            if (!switched.clicked) {
                await page.evaluate(() => { location.hash = "#/amiga"; });
            }
            await page.waitForTimeout(2000);
            const after = await snapshotControlState(page);
            await page.screenshot({ path: path.join(SHOTS, `b14-switch-1-amiga.png`) });

            report.switch = {
                method: switched.clicked ? `dock-click (${switched.how})` : "hash-fallback (#/amiga)",
                before, after, consoleLog, pageErrors,
            };
            await ctx.close();
        }
    } finally {
        await browser.close();
        server.close();
    }

    // Emit the report as JSON to stdout (the caller pipes / reads it).
    console.log("===B14-REPORT-JSON-START===");
    console.log(JSON.stringify(report, null, 2));
    console.log("===B14-REPORT-JSON-END===");
}

main().catch((e) => { console.error("PROBE-FATAL:", e); process.exit(1); });
