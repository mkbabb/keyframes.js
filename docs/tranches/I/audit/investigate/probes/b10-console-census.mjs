#!/usr/bin/env node
/**
 * b10-console-census — Tranche I investigation probe.
 *
 * Navigates EVERY route and, on each, runs the interaction battery:
 *   (1) fresh-load console capture
 *   (2) click PLAY (the group transport)
 *   (3) click a CONTROLS surface (open the controls panel / tab)
 *   (4) switch AWAY to the next scene, then BACK
 *
 * Captures the COMPLETE catalog of console errors/warnings + pageerrors per
 * route+interaction, with counts, verbatim messages, and stacks. Writes a JSON
 * ledger to stdout (captured by the runner) and a screenshot per route.
 *
 * Models scripts/proof-no-orphan-specular.mjs: serveDist on port 0 +
 * playwright-core via createRequire(KF_PLAYWRIGHT_DIR) + openSceneFresh.
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
const CTRL_KEY = "animation-groups-control-options-store";
const MACHINE_KEY = "keyframes-js-scene-machine";

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

// Attach console + pageerror listeners that route into a per-phase bucket.
function wireSinks(page, getPhase, sink) {
    page.on("console", (msg) => {
        const type = msg.type();
        if (type !== "error" && type !== "warning") return;
        sink.push({
            phase: getPhase(),
            kind: type,
            text: msg.text(),
            location: msg.location()
                ? `${msg.location().url}:${msg.location().lineNumber}:${msg.location().columnNumber}`
                : null,
        });
    });
    page.on("pageerror", (err) => {
        sink.push({
            phase: getPhase(),
            kind: "pageerror",
            text: String(err && err.message ? err.message : err),
            stack: err && err.stack ? String(err.stack) : null,
        });
    });
    page.on("requestfailed", (req) => {
        const f = req.failure();
        sink.push({
            phase: getPhase(),
            kind: "requestfailed",
            text: `${req.method()} ${req.url()} — ${f ? f.errorText : "unknown"}`,
        });
    });
}

const SCENES = [
    "", // home (#/)
    "easing",
    "spring",
    "sequence",
    "motion-path",
    "cube",
    "amiga",
    "square",
];

async function run() {
    const chromium = resolveChromium();
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const VW = 1440;
    const browser = await chromium.launch();
    const results = [];

    try {
        for (let idx = 0; idx < SCENES.length; idx++) {
            const scene = SCENES[idx];
            const routeLabel = scene === "" ? "home(#/)" : scene;
            const sink = [];
            let phase = "load";
            const ctx = await browser.newContext({ viewport: { width: VW, height: 900 } });
            const page = await ctx.newPage();
            await page.addInitScript((ck) => {
                try {
                    localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true }));
                } catch {}
            }, CTRL_KEY);
            wireSinks(page, () => phase, sink);

            const behaviors = [];
            try {
                // ── (1) LOAD ───────────────────────────────────────────────
                await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
                await page.waitForTimeout(1400);

                // ── (2) PLAY — try the group transport play button ─────────
                phase = "play";
                const playSelectors = [
                    'button[aria-label*="Play animation"]',
                    'button[aria-label="Play"]',
                    'button[aria-label*="Play"]',
                    'button[title*="Play"]',
                ];
                let played = false;
                for (const sel of playSelectors) {
                    const btn = page.locator(sel).first();
                    if ((await btn.count()) > 0) {
                        await btn.click({ timeout: 2500, force: true }).catch((e) =>
                            behaviors.push(`play click(${sel}) threw: ${e.message}`),
                        );
                        played = true;
                        behaviors.push(`clicked play via ${sel}`);
                        break;
                    }
                }
                if (!played) behaviors.push("no visible play button found");
                await page.waitForTimeout(900);

                // ── (3) CONTROLS — open the controls panel / click a tab ────
                phase = "controls";
                const ctrlSelectors = [
                    'button[aria-label*="ontrol"]',
                    'button[title*="ontrol"]',
                    '[role="tab"]',
                    'button:has-text("Controls")',
                    'button:has-text("Keyframes")',
                    'button[aria-label="Select animation"]',
                ];
                let ctrlClicked = 0;
                for (const sel of ctrlSelectors) {
                    const els = page.locator(sel);
                    const n = await els.count();
                    for (let i = 0; i < Math.min(n, 3); i++) {
                        const el = els.nth(i);
                        if (await el.isVisible().catch(() => false)) {
                            await el
                                .click({ timeout: 1800 })
                                .then(() => {
                                    ctrlClicked++;
                                    behaviors.push(`clicked control ${sel}#${i}`);
                                })
                                .catch((e) =>
                                    behaviors.push(`control click(${sel}#${i}) threw: ${e.message}`),
                                );
                            await page.waitForTimeout(450);
                        }
                    }
                    if (ctrlClicked >= 3) break;
                }
                if (ctrlClicked === 0) behaviors.push("no controls surface clicked");

                // ── (4) SWITCH AWAY + BACK via the REAL dock Scene combobox ─
                // The dock morphs: the full layer (Scene combobox) is hidden
                // until hover. Expand it, open the combobox, pick the option.
                const SCENE_LABEL = {
                    "": "Home", easing: "Easing", spring: "Spring",
                    sequence: "Sequence", "motion-path": "Path", cube: "Cube",
                    amiga: "Amiga", square: "Square",
                };
                const switchVia = async (sceneId) => {
                    const label = SCENE_LABEL[sceneId] ?? sceneId;
                    const dock = page.locator(".glass-dock").first();
                    if ((await dock.count()) > 0) {
                        await dock.hover({ force: true }).catch(() => {});
                        await page
                            .waitForFunction(() => {
                                const f = document.querySelector(".dock-layer--full");
                                return f && getComputedStyle(f).visibility !== "hidden" && +getComputedStyle(f).opacity > 0.5;
                            }, { timeout: 2500 })
                            .catch(() => {});
                    }
                    const trig = page.locator('button[aria-label="Scene"]:visible').first();
                    if ((await trig.count()) === 0) {
                        await page.evaluate((s) => { location.hash = `#/${s}`; }, sceneId);
                        return `hash-fallback #/${sceneId}`;
                    }
                    await trig.click({ force: true, timeout: 2500 }).catch(() => {});
                    await page.waitForTimeout(400);
                    const opt = page.locator(`[role="option"]:has-text("${label}")`).first();
                    if ((await opt.count()) === 0) {
                        await page.keyboard.press("Escape").catch(() => {});
                        await page.evaluate((s) => { location.hash = `#/${s}`; }, sceneId);
                        return `no-option-${label}→hash`;
                    }
                    await opt.click({ force: true, timeout: 2500 }).catch(() => {});
                    return `combobox→${label}`;
                };
                phase = "switch-away";
                const nextScene = SCENES[(idx + 1) % SCENES.length];
                behaviors.push(`away→${SCENE_LABEL[nextScene]}: ${await switchVia(nextScene)}`);
                await page.waitForTimeout(1300);

                phase = "switch-back";
                behaviors.push(`back→${routeLabel}: ${await switchVia(scene)}`);
                await page.waitForTimeout(1300);

                // ── (5) PLAY-after-return (catches suspend/resume FSM) ──────
                phase = "play-after-return";
                for (const sel of playSelectors) {
                    const btn = page.locator(sel).first();
                    if ((await btn.count()) > 0 && (await btn.isVisible().catch(() => false))) {
                        await btn.click({ timeout: 2500 }).catch((e) =>
                            behaviors.push(`replay click threw: ${e.message}`),
                        );
                        behaviors.push(`replay via ${sel}`);
                        break;
                    }
                }
                await page.waitForTimeout(800);

                // screenshot
                const shotName = `b10-${scene === "" ? "home" : scene}.png`;
                await page
                    .screenshot({ path: path.join(SHOTS, shotName), fullPage: false })
                    .catch(() => {});
                results.push({
                    route: `#/${scene}`,
                    label: routeLabel,
                    behaviors,
                    console: sink,
                    counts: {
                        error: sink.filter((s) => s.kind === "error").length,
                        warning: sink.filter((s) => s.kind === "warning").length,
                        pageerror: sink.filter((s) => s.kind === "pageerror").length,
                        requestfailed: sink.filter((s) => s.kind === "requestfailed").length,
                    },
                    screenshot: path.join("shots", shotName),
                });
            } catch (e) {
                results.push({
                    route: `#/${scene}`,
                    label: routeLabel,
                    behaviors,
                    console: sink,
                    fatal: String(e && e.stack ? e.stack : e),
                });
            } finally {
                await ctx.close();
            }
        }
    } finally {
        await browser.close();
        server.close();
    }

    console.log("===B10_JSON_START===");
    console.log(JSON.stringify(results, null, 2));
    console.log("===B10_JSON_END===");
}

run().catch((e) => {
    console.error("PROBE_FATAL", e);
    process.exit(1);
});
