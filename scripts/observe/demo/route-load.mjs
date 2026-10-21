#!/usr/bin/env node
/**
 * route-load — OD19-ALL (owner docket 2026-10-19): "All loading times for all
 * apps needs to be improved, every page", route-to-route "smoothly and
 * subtly". The falsifier for each route's measured load bar.
 *
 * Over the PRODUCTION demo build (`npm run gh-pages`, or KF_DIST=<dir>),
 * served statically, headless Chromium at CPU 4x (CDP), 1440x900 light, no
 * network throttle (localhost):
 *
 *   COLD, per route (a fresh context: empty cache), deep link #/<route>:
 *     - time to route content (the scene host holds the scene, no skeleton, no
 *       view transition running) <= COLD_READY_MS;
 *     - the JS decoded before route content <= JS_KB[route] (the bytes the
 *       route pays before its first content);
 *     - the home-only Aurora chunk is fetched on home ONLY (a deep link used
 *       to render home first and fetch it on every route).
 *   WARM (one context; boot #/cube, idle, then hash-navigate route to route,
 *   the router -> runSceneSwitch path the dock takes): every swap's
 *   `scene-swap:prepare` <= SWAP_PREPARE_MS and `scene-swap:commit` (the
 *   frozen-snapshot span the View Transition holds) <= SWAP_COMMIT_MS.
 *   DEEP LINK -> HOME (a fresh context: boot #/sequence, idle, navigate home):
 *     the same two bars, and no request for Home's backdrop chunk starts after
 *     the pick (C3-KF-02).
 *
 * The bars are the AFTER measurements with headroom for a loaded machine
 * (value.js docs/tranches/X/execution/OD19/keyframes.md "### load"). Exit 1 on
 * any breach, 2 when the build or the browser is missing.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SCENES, serveDist, withBrowser } from "../../lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const DIST = path.resolve(process.env.KF_DIST ?? path.join(REPO, "dist/gh-pages"));
const RATE = 4;
const COLD_READY_MS = 1500;
const JS_KB = { home: 1150, amiga: 1500 };
const JS_KB_DEFAULT = 960;
const SWAP_PREPARE_MS = 150;
const SWAP_COMMIT_MS = 650;

if (!fs.existsSync(path.join(DIST, "index.html"))) {
    console.error(`route-load — ${DIST}/index.html missing (run \`npm run gh-pages\`).`);
    process.exit(2);
}

const failures = [];
const check = (okay, label) => {
    if (okay) console.log(`  ✓ ${label}`);
    else {
        failures.push(label);
        console.error(`  ✗ ${label}`);
    }
};

const READY = () => {
    const host = document.querySelector(".scene-host");
    if (!host?.firstElementChild || host.querySelector(".scene-skeleton")) return false;
    if (document.documentElement.matches(":active-view-transition")) return false;
    return host.getBoundingClientRect().height > 0;
};
const hashOf = (route) => `#/${route}`;
const throttle = async (context, page) =>
    (await context.newCDPSession(page)).send("Emulation.setCPUThrottlingRate", { rate: RATE });
const newContext = (browser) => browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });

const server = await serveDist(DIST);
let half;
try {
    half = await withBrowser(
        async (browser) => {
            console.log(`route-load — ${DIST} · CPU ${RATE}x · 1440x900`);
            for (const scene of SCENES) {
                const context = await newContext(browser);
                try {
                    const page = await context.newPage();
                    await throttle(context, page);
                    await page.goto(server.url + "/" + hashOf(scene.route), { waitUntil: "commit" });
                    await page.waitForFunction(READY, undefined, { timeout: 30_000, polling: "raf" });
                    const m = await page.evaluate(() => {
                        const ready = performance.now();
                        const rs = performance.getEntriesByType("resource");
                        const js = rs.filter((e) => /\.js(\?|$)/.test(e.name) && e.responseEnd <= ready);
                        return {
                            ready: Math.round(ready),
                            jsKB: Math.round(js.reduce((a, e) => a + (e.decodedBodySize || 0), 0) / 1024),
                            aurora: rs.some((e) => /HeroAurora/.test(e.name)),
                        };
                    });
                    const kb = JS_KB[scene.key] ?? JS_KB_DEFAULT;
                    check(m.ready <= COLD_READY_MS, `cold ${scene.key}: route content at ${m.ready} ms (bar ${COLD_READY_MS})`);
                    check(m.jsKB <= kb, `cold ${scene.key}: ${m.jsKB} KB JS before content (bar ${kb})`);
                    check(m.aurora === (scene.key === "home"), `cold ${scene.key}: Aurora chunk ${m.aurora ? "fetched" : "not fetched"} (home only)`);
                } finally {
                    await context.close();
                }
            }
            const context = await newContext(browser);
            try {
                const page = await context.newPage();
                await throttle(context, page);
                await page.goto(server.url + "/#/cube", { waitUntil: "load" });
                await page.waitForFunction(READY, undefined, { timeout: 30_000 });
                await page.waitForTimeout(3000);
                let from = "cube";
                const order = [...SCENES.map((s) => s.key).filter((k) => k !== "cube" && k !== "home"), "cube", "home"];
                for (const key of order) {
                    const route = SCENES.find((s) => s.key === key).route;
                    const m = await page.evaluate(async (hash) => {
                        performance.clearMeasures();
                        location.hash = hash;
                        for (let i = 0; i < 400 && !performance.getEntriesByName("scene-swap:total").length; i++)
                            await new Promise((r) => setTimeout(r, 16));
                        return Object.fromEntries(
                            performance
                                .getEntriesByType("measure")
                                .filter((e) => e.name.startsWith("scene-swap:"))
                                .map((e) => [e.name.slice(11), Math.round(e.duration)]),
                        );
                    }, hashOf(route));
                    check(m.prepare !== undefined && m.prepare <= SWAP_PREPARE_MS, `warm ${from}->${key}: prepare ${m.prepare} ms (bar ${SWAP_PREPARE_MS})`);
                    // home and the cube share one mounted scene: a hop between them has no commit to bound.
                    if (m.commit !== undefined || !(key === "home" || from === "home"))
                        check(m.commit !== undefined && m.commit <= SWAP_COMMIT_MS, `warm ${from}->${key}: commit ${m.commit} ms (bar ${SWAP_COMMIT_MS})`);
                    from = key;
                    await page.waitForTimeout(1200);
                }
            } finally {
                await context.close();
            }
            // C3-KF-02 (OD19 repair 3) — the first move into Home from a deep
            // link: a fresh context boots #/sequence (home's backdrop is not in
            // its cold load), idles, then navigates home. The swap's bars hold,
            // and no request for the backdrop (HeroAurora) starts after the
            // pick: the idle warm settled it with the scenes' chunks.
            const deep = await newContext(browser);
            try {
                const page = await deep.newPage();
                await throttle(deep, page);
                await page.goto(server.url + "/#/sequence", { waitUntil: "load" });
                await page.waitForFunction(READY, undefined, { timeout: 30_000 });
                await page.waitForTimeout(3000);
                const m = await page.evaluate(async () => {
                    performance.clearMeasures();
                    const pick = performance.now();
                    location.hash = "#/";
                    for (let i = 0; i < 400 && !performance.getEntriesByName("scene-swap:total").length; i++)
                        await new Promise((r) => setTimeout(r, 16));
                    const swap = Object.fromEntries(
                        performance
                            .getEntriesByType("measure")
                            .filter((e) => e.name.startsWith("scene-swap:"))
                            .map((e) => [e.name.slice(11), Math.round(e.duration)]),
                    );
                    const late = performance
                        .getEntriesByType("resource")
                        .filter((e) => /HeroAurora/.test(e.name) && e.startTime >= pick)
                        .map((e) => e.name.split("/").pop());
                    return { ...swap, late };
                });
                check(m.prepare !== undefined && m.prepare <= SWAP_PREPARE_MS, `warm sequence(deep link)->home: prepare ${m.prepare} ms (bar ${SWAP_PREPARE_MS})`);
                check(m.commit !== undefined && m.commit <= SWAP_COMMIT_MS, `warm sequence(deep link)->home: commit ${m.commit} ms (bar ${SWAP_COMMIT_MS})`);
                check(m.late.length === 0, `warm sequence(deep link)->home: backdrop fetched after the pick: ${m.late.join(", ") || "none"}`);
            } finally {
                await deep.close();
            }
        },
        { label: "route-load" },
    );
} finally {
    await server.close();
}

// A load bar measured by no browser is no bar: an unresolvable chromium (this
// repo carries no playwright; point KF_PLAYWRIGHT_DIR at a checkout that does)
// FAILS the gate rather than passing it vacuously.
if (half?.skipped) {
    console.error(`route-load — no browser: ${half.reason}`);
    process.exit(2);
}
if (failures.length) {
    console.error(`route-load — FAIL (${failures.length})`);
    process.exit(1);
}
console.log("route-load — PASS");
