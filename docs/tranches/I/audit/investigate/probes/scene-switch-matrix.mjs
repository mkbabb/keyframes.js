#!/usr/bin/env node
/**
 * I.audit — b12-scene-switching-matrix probe.
 *
 * Drives the BUILT dist/gh-pages live via Playwright. For EVERY ordered scene
 * pair (NxN over {home,cube,amiga,square,easing,spring,sequence,motion-path})
 * it:
 *   1. opens scene A fresh (clean storage), waits for the machine to settle,
 *   2. (optionally) clicks the bottom-bar PLAY so A is genuinely PLAYING,
 *   3. clicks scene B's dock target (real navigation, the user's gesture),
 *   4. captures: console errors + pageerrors VERBATIM, whether B renders
 *      controls (vs blank), whether the prior scene (A) suspended, and whether
 *      B resumed iff-it-was-playing.
 *
 * Mirrors scripts/proof-no-orphan-specular.mjs plumbing (serveDist on port 0 +
 * chromium via createRequire(KF_PLAYWRIGHT_DIR).require("playwright-core")).
 *
 * Run:  KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
 *         node docs/tranches/I/audit/investigate/probes/scene-switch-matrix.mjs
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const SHOTS = path.join(HERE, "..", "shots");
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

const SCENES = ["home", "cube", "amiga", "square", "easing", "spring", "sequence", "motion-path"];

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

/** Read the machine state from localStorage (activeScene + perScene snapshots). */
async function readMachine(page) {
    return page.evaluate((mk) => {
        try {
            return JSON.parse(localStorage.getItem(mk) || "{}");
        } catch {
            return {};
        }
    }, MACHINE_KEY);
}

/** Does the controls region render anything substantive (vs blank)? */
async function controlsSignal(page) {
    return page.evaluate(() => {
        const q = (s) => document.querySelector(s);
        const main = q("#app") || document.body;
        const txt = (main.innerText || "").trim();
        // The known blank-state breadcrumbs (B5, B2 blank controls).
        const noTwin = /no CSS twin|see console/i.test(txt);
        // Count interactive control surfaces present.
        const buttons = document.querySelectorAll("button").length;
        const sliders = document.querySelectorAll('input[type="range"], [role="slider"]').length;
        const surfaces = document.querySelectorAll("[data-surface]").length;
        const canvases = document.querySelectorAll("canvas, svg").length;
        // A controls panel / menubar presence heuristic.
        const hasMenubar = !!q('[class*="menubar" i], [class*="MenuBar" i], [class*="ribbon" i]');
        return {
            textLen: txt.length,
            noTwin,
            buttons,
            sliders,
            surfaces,
            canvases,
            hasMenubar,
            sample: txt.slice(0, 140),
        };
    });
}

/** Click the dock target for a scene id; returns true if a target was found. */
async function clickDock(page, sceneId) {
    // The dock buttons carry the scene label; try several robust locators.
    const clicked = await page.evaluate((id) => {
        const cands = [...document.querySelectorAll("a,button,[role=button]")];
        const norm = (s) => (s || "").toLowerCase().replace(/[^a-z]/g, "");
        const want = norm(id === "motion-path" ? "motionpath" : id);
        // 1) href hash match
        for (const el of cands) {
            const href = el.getAttribute("href") || "";
            if (href.replace(/[^a-z-]/gi, "").toLowerCase().endsWith(want.replace("motionpath", "motion-path"))) {
                el.scrollIntoView();
                el.click();
                return true;
            }
        }
        // 2) aria-label / title / text match
        for (const el of cands) {
            const label = norm(
                el.getAttribute("aria-label") ||
                    el.getAttribute("title") ||
                    el.textContent ||
                    "",
            );
            if (label === want || label.includes(want)) {
                el.scrollIntoView();
                el.click();
                return true;
            }
        }
        return false;
    }, sceneId);
    return clicked;
}

async function waitActive(page, sceneId, timeout = 6000) {
    return page
        .waitForFunction(
            ([mk, s]) => {
                try {
                    return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s;
                } catch {
                    return false;
                }
            },
            [MACHINE_KEY, sceneId],
            { timeout },
        )
        .then(() => true)
        .catch(() => false);
}

async function openFresh(browser, base, scene) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    page.on("console", (m) => {
        if (m.type() === "error" || m.type() === "warning") {
            consoleErrors.push(`[${m.type()}] ${m.text()}`);
        }
    });
    page.on("pageerror", (e) => {
        pageErrors.push(`${e.name}: ${e.message}\n${(e.stack || "").split("\n").slice(0, 6).join("\n")}`);
    });
    await page.addInitScript((ck) => {
        try {
            localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true }));
        } catch {}
    }, CTRL_KEY);
    await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
    await waitActive(page, scene);
    await page.waitForTimeout(900);
    return { ctx, page, consoleErrors, pageErrors };
}

/** Try to start playback via the bottom-bar play button. */
async function clickPlay(page) {
    return page.evaluate(() => {
        const cands = [...document.querySelectorAll("button,[role=button]")];
        for (const el of cands) {
            const label = (
                el.getAttribute("aria-label") ||
                el.getAttribute("title") ||
                el.textContent ||
                ""
            ).toLowerCase();
            if (/\bplay\b/.test(label) && !/pause|replay|display/.test(label)) {
                el.click();
                return true;
            }
            // icon-only play: look for a lucide play svg
            if (el.querySelector('svg[class*="play" i], .lucide-play')) {
                el.click();
                return true;
            }
        }
        return false;
    });
}

async function main() {
    const chromium = resolveChromium();
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();

    const results = [];
    // To keep the run tractable we sweep the FULL diagonal for B (open-fresh
    // health) + a representative transition set: every pair where A is a PLAYING
    // scene into every B. We do the full NxN for the from-cube/amiga/easing rows
    // (the engine + raf adapters), plus a curated set covering each B at least
    // once as a target. Each (A,B) is one fresh context.
    const FROM = SCENES; // N
    const TO = SCENES; // N

    let pairIdx = 0;
    for (const A of FROM) {
        for (const B of TO) {
            if (A === B) continue;
            pairIdx++;
            const { ctx, page, consoleErrors, pageErrors } = await openFresh(browser, base, A);
            const row = {
                from: A,
                to: B,
                openErrors: [...pageErrors],
                openConsole: consoleErrors.filter((e) => /error/i.test(e)).slice(0, 4),
            };
            try {
                // Make A playing (best-effort) so the suspend path is exercised.
                row.playClicked = A === "home" ? false : await clickPlay(page);
                await page.waitForTimeout(500);
                const beforeMachine = await readMachine(page);
                row.aWasPlayingHint = row.playClicked;

                // Clear the error buffers so the transition's errors are isolated.
                const baseErrCount = pageErrors.length;
                const baseConsoleCount = consoleErrors.length;

                // SWITCH to B (the real gesture).
                const dockHit = await clickDock(page, B);
                row.dockHit = dockHit;
                if (!dockHit) {
                    // fallback: hash nav (still drives the machine via the router)
                    await page.evaluate((id) => {
                        location.hash = `#/${id}`;
                    }, B);
                }
                const arrived = await waitActive(page, B, 6000);
                row.arrived = arrived;
                await page.waitForTimeout(900);

                // Capture transition-phase errors.
                row.switchPageErrors = pageErrors.slice(baseErrCount).map((e) => e.split("\n").slice(0, 3).join(" | "));
                row.switchConsole = consoleErrors
                    .slice(baseConsoleCount)
                    .filter((e) => /error/i.test(e))
                    .slice(0, 5);

                // Controls render?
                const ctrl = await controlsSignal(page);
                row.controls = ctrl;
                row.controlsBlank =
                    ctrl.noTwin || (ctrl.textLen < 30 && ctrl.buttons < 3) || ctrl.buttons === 0;

                // Did A suspend? Read perScene[A] snapshot's playing flag (after
                // the leave, A's snapshot should be captured & its loop stopped).
                const afterMachine = await readMachine(page);
                const aSnap = afterMachine?.perScene?.[A];
                row.aSnapshotCaptured = !!aSnap;
                row.aSnapPlaying = aSnap?.playing ?? null;

                // Did B resume iff it was playing before? B is freshly entered;
                // a first-ever entry has no prior snapshot, so "resumed" only
                // applies on a RE-entry. We record B's live status from machine.
                row.bStatus = afterMachine?.status ?? null;

                // Screenshot only the interesting (errored or blank) transitions
                // + the diagonal-ish representative set to keep disk sane.
                const interesting =
                    row.switchPageErrors.length > 0 ||
                    row.controlsBlank ||
                    !arrived ||
                    pairIdx % 11 === 0;
                if (interesting) {
                    const shot = path.join(SHOTS, `switch_${A}_to_${B}.png`);
                    await page.screenshot({ path: shot }).catch(() => {});
                    row.shot = path.relative(REPO, shot);
                }
            } catch (e) {
                row.harnessError = String(e?.message || e);
            } finally {
                results.push(row);
                await ctx.close();
            }
        }
    }

    await browser.close();
    server.close();

    // Emit a compact JSON the markdown author consumes.
    const out = path.join(HERE, "..", "b12-matrix-data.json");
    fs.writeFileSync(out, JSON.stringify(results, null, 2));
    console.log(`WROTE ${path.relative(REPO, out)} — ${results.length} transitions`);

    // Console summary table.
    const fmt = (r) => {
        const err = r.switchPageErrors.length ? "ERR" : "ok ";
        const blank = r.controlsBlank ? "BLANK" : "ctrl ";
        const arr = r.arrived ? "->" : "X>";
        return `${err} ${blank} ${r.from} ${arr} ${r.to}  aSnap=${r.aSnapshotCaptured} aPlay=${r.aSnapPlaying} bStatus=${r.bStatus} dock=${r.dockHit}`;
    };
    for (const r of results) console.log("  " + fmt(r));

    // Distinct error signatures.
    const sigs = new Map();
    for (const r of results) {
        for (const e of r.switchPageErrors.concat(r.openErrors.map((x) => x.split("\n")[0]))) {
            const key = e.replace(/:\d+:\d+/g, ":N:N").replace(/offset \d+/g, "offset N").slice(0, 120);
            sigs.set(key, (sigs.get(key) || 0) + 1);
        }
    }
    console.log("\nDISTINCT ERROR SIGNATURES:");
    for (const [k, n] of [...sigs.entries()].sort((a, b) => b[1] - a[1])) {
        console.log(`  ${n}x  ${k}`);
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
