#!/usr/bin/env node
/**
 * I-tranche B7 probe — the specular/sheen on the glass stages.
 *
 * Serves the BUILT dist/gh-pages/, drives chromium (KF_PLAYWRIGHT_DIR), visits
 * each glass STAGE scene (easing/spring/sequence/motion-path), and:
 *   • enumerates every [data-surface] Card + .glass-specular-track element,
 *   • reads the ::before backgroundImage + opacity at REST and on HOVER,
 *   • records whether the Card writes --mouse-x (pointer tracking) on hover,
 *   • screenshots rest + hover to ../shots/.
 *
 * Models scripts/proof-no-orphan-specular.mjs (serveDist on port 0 + the
 * createRequire(KF_PLAYWRIGHT_DIR) playwright-core resolution + openSceneFresh).
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
    ".webmanifest": "application/manifest+json",
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

async function openSceneFresh(browser, base, scene, vw) {
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

const SPECULAR_RADIAL = /radial-gradient\([^)]*rgba\(255,\s*255,\s*255,\s*0\.55\)/;

const requireFrom = createRequire(
    path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
);
const { chromium } = requireFrom("playwright-core");

const server = serveDist();
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;
const VW = 1440;
const SCENES = ["easing", "spring", "sequence", "motion-path", "cube"];
const report = { glassUiVersion: null, scenes: {} };

const browser = await chromium.launch();
const consoleErrors = [];
const pageErrors = [];
try {
    for (const scene of SCENES) {
        const { ctx, page } = await openSceneFresh(browser, base, scene, VW);
        page.on("console", (m) => {
            if (m.type() === "error") consoleErrors.push(`${scene}: ${m.text()}`);
        });
        page.on("pageerror", (e) => pageErrors.push(`${scene}: ${e.message}`));
        try {
            // Enumerate every surface/track element and read REST specular.
            const rest = await page.evaluate(() => {
                const out = [];
                const els = [
                    ...document.querySelectorAll("[data-surface], .glass-specular-track"),
                ];
                for (const el of els.slice(0, 40)) {
                    const cs = getComputedStyle(el, "::before");
                    out.push({
                        tag: el.tagName,
                        surface: el.getAttribute("data-surface") || "(none)",
                        hasTrackClass: el.classList.contains("glass-specular-track"),
                        onStage: !!el.closest(".stage-cell"),
                        beforeBg: cs.backgroundImage.slice(0, 90),
                        beforeOpacity: cs.opacity,
                        specularIntensity: getComputedStyle(el)
                            .getPropertyValue("--specular-intensity")
                            .trim(),
                        mouseXAtRest: el.style.getPropertyValue("--mouse-x").trim(),
                    });
                }
                return out;
            });

            // Hover the STAGE GLASS card specifically (the sheen surface).
            const target =
                (await page.$('.stage-cell [data-surface="glass"]')) ||
                (await page.$('[data-surface="glass"]')) ||
                (await page.$(".stage-cell [data-surface]"));
            let hover = null;
            if (target) {
                const box = await target.boundingBox();
                if (box) {
                    // move into the card centre to provoke pointer tracking
                    await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.4);
                    await page.waitForTimeout(250);
                    hover = await target.evaluate((el) => {
                        const cs = getComputedStyle(el, "::before");
                        return {
                            surface: el.getAttribute("data-surface"),
                            onStage: !!el.closest(".stage-cell"),
                            beforeBg: cs.backgroundImage.slice(0, 120),
                            beforeOpacity: cs.opacity,
                            specularIntensity: getComputedStyle(el)
                                .getPropertyValue("--specular-intensity")
                                .trim(),
                            mouseXOnHover: el.style.getPropertyValue("--mouse-x").trim(),
                            mouseYOnHover: el.style.getPropertyValue("--mouse-y").trim(),
                            paintsRadial:
                                /radial-gradient\([^)]*rgba\(255,\s*255,\s*255,\s*0\.55\)/.test(
                                    cs.backgroundImage,
                                ),
                            beforeHasRadial: /radial-gradient/.test(cs.backgroundImage),
                        };
                    });
                }
                await page.screenshot({
                    path: path.join(SHOTS, `b7-${scene}-hover.png`),
                });
                await page.mouse.move(2, 2);
                await page.waitForTimeout(200);
            }
            await page.screenshot({ path: path.join(SHOTS, `b7-${scene}-rest.png`) });

            report.scenes[scene] = {
                surfacesFound: rest.length,
                glassSurfaces: rest.filter((r) => r.surface === "glass").length,
                trackElements: rest.filter((r) => r.hasTrackClass).length,
                restSample: rest.filter((r) => r.surface === "glass" || r.hasTrackClass).slice(0, 6),
                hover,
            };
        } finally {
            await ctx.close();
        }
    }

    // glass-ui version from the installed package
    try {
        report.glassUiVersion = JSON.parse(
            fs.readFileSync(
                path.join(REPO, "node_modules/@mkbabb/glass-ui/package.json"),
                "utf8",
            ),
        ).version;
    } catch {}
    report.consoleErrors = consoleErrors;
    report.pageErrors = pageErrors;
} finally {
    await browser.close();
    server.close();
}

console.log(JSON.stringify(report, null, 2));
