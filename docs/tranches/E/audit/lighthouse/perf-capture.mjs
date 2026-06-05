#!/usr/bin/env node
/**
 * perf-capture — the E.W0 performance BASELINE instrument (the input to E.W4).
 *
 * The checked-in `scripts/lighthouse-gate.mjs` scores ONLY a11y + SEO on the
 * open-panel editing state — it deliberately trims `onlyCategories` to those
 * two (fast, focused) and so reports no Performance number. This companion runs
 * the FULL `performance` category over the same SCENES × VIEWPORTS in the same
 * open-panel editing state (reusing the shared `openControlsPanel` driver), and
 * records, per run: the Performance score, the lab metrics (FCP/LCP/TBT/CLS/SI/
 * TTI), and the TOP opportunities + diagnostics (by estimated wasted-ms or
 * numericValue). Output: one JSON per scene×viewport + a `_perf-summary.json`.
 *
 * This file lives UNDER docs/tranches/E/ (inv-16: E writes only keyframes.js,
 * and only this tranche's own audit surface) — it is the evidence harness, not
 * a CI gate. Resolution mirrors the gate: chromium via KF_PLAYWRIGHT_DIR,
 * lighthouse via KF_LIGHTHOUSE_DIR (default repo root).
 *
 * Usage:
 *   KF_PLAYWRIGHT_DIR=/path/to/value.js \
 *   KF_LIGHTHOUSE_DIR=/path/to/keyframes.js \
 *   node docs/tranches/E/audit/lighthouse/perf-capture.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import {
    SCENES,
    resolveChromium,
    serveDist,
    openControlsPanel,
} from "../../../../../scripts/lib/demo-driver.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const OUT = HERE;

const VIEWPORTS = [
    { name: "mobile", width: 375, height: 667 },
    { name: "desktop", width: 1440, height: 900 },
];

function resolveLighthouse() {
    const root = process.env.KF_LIGHTHOUSE_DIR ?? REPO;
    const requireFrom = createRequire(path.join(root, "package.json"));
    try {
        return requireFrom.resolve("lighthouse");
    } catch {
        return null;
    }
}

function metric(lhr, id) {
    const a = lhr.audits[id];
    return a ? a.displayValue ?? String(a.numericValue) : "n/a";
}

/**
 * Top opportunities + diagnostics: every audit with a non-null numericValue
 * that scored < 0.9, ranked by estimated savings (overallSavingsMs) then by
 * raw numericValue. We keep id, title, score, displayValue, and savings.
 */
function opportunities(lhr) {
    const rows = [];
    for (const [id, a] of Object.entries(lhr.audits)) {
        if (a.score === null || a.score >= 0.9) continue;
        if (a.scoreDisplayMode === "informative" && !a.details) continue;
        const savings =
            a.details?.overallSavingsMs ??
            a.details?.overallSavingsBytes ??
            null;
        rows.push({
            id,
            title: a.title,
            score: a.score,
            displayValue: a.displayValue ?? null,
            savingsMs: a.details?.overallSavingsMs ?? null,
            savingsBytes: a.details?.overallSavingsBytes ?? null,
            _rank: a.details?.overallSavingsMs ?? a.numericValue ?? 0,
        });
    }
    rows.sort((x, y) => y._rank - x._rank);
    return rows.map(({ _rank, ...r }) => r);
}

async function main() {
    const chromium = resolveChromium();
    const lighthousePath = resolveLighthouse();
    if (!chromium || !lighthousePath) {
        console.error(
            `perf-capture — SKIP: unresolvable: ${[
                !chromium && "playwright/chromium (KF_PLAYWRIGHT_DIR)",
                !lighthousePath && "lighthouse (KF_LIGHTHOUSE_DIR)",
            ]
                .filter(Boolean)
                .join(" + ")}`,
        );
        process.exit(2);
    }
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        console.error("perf-capture — FAIL: dist/gh-pages not built.");
        process.exit(2);
    }

    const lighthouse = (await import(lighthousePath)).default;
    const { url, close: closeServer } = await serveDist(DIST);
    const DEBUG_PORT = 9322 + Math.floor(Math.random() * 600);
    const browser = await chromium.launch({
        args: [`--remote-debugging-port=${DEBUG_PORT}`],
    });

    const summary = [];
    console.log(
        "perf-capture — Performance category on the OPEN-panel editing state\n",
    );

    try {
        for (const scene of SCENES) {
            for (const vp of VIEWPORTS) {
                const tag = `${scene.key}/${vp.name}`.padEnd(16);
                const sceneUrl = `${url}/#/${scene.route}`;
                const ctx = await browser.newContext({
                    viewport: { width: vp.width, height: vp.height },
                });
                const page = await ctx.newPage();
                await page.goto(sceneUrl, { waitUntil: "load" });
                await page.waitForTimeout(1500);
                await openControlsPanel(page);

                const runnerResult = await lighthouse(
                    sceneUrl,
                    {
                        port: DEBUG_PORT,
                        output: "json",
                        logLevel: "error",
                        onlyCategories: ["performance"],
                        disableStorageReset: true,
                        screenEmulation: {
                            mobile: vp.name === "mobile",
                            width: vp.width,
                            height: vp.height,
                            deviceScaleFactor: vp.name === "mobile" ? 2 : 1,
                            disabled: false,
                        },
                        formFactor: vp.name === "mobile" ? "mobile" : "desktop",
                    },
                    undefined,
                );
                await page.close();
                await ctx.close();

                const lhr = runnerResult.lhr;
                const perf = Math.round(
                    (lhr.categories.performance.score ?? 0) * 100,
                );
                const row = {
                    scene: scene.key,
                    form: vp.name,
                    performance: perf,
                    fcp: metric(lhr, "first-contentful-paint"),
                    lcp: metric(lhr, "largest-contentful-paint"),
                    tbt: metric(lhr, "total-blocking-time"),
                    cls: metric(lhr, "cumulative-layout-shift"),
                    si: metric(lhr, "speed-index"),
                    tti: metric(lhr, "interactive"),
                    opportunities: opportunities(lhr).slice(0, 10),
                };
                summary.push(row);
                fs.writeFileSync(
                    path.join(OUT, `${scene.key}-${vp.name}.json`),
                    JSON.stringify(row, null, 2),
                );
                console.log(
                    `  ${tag} perf=${perf}  fcp=${row.fcp}  lcp=${row.lcp}  tbt=${row.tbt}  cls=${row.cls}  si=${row.si}`,
                );
            }
        }
    } finally {
        await browser.close();
        await closeServer();
    }

    fs.writeFileSync(
        path.join(OUT, "_perf-summary.json"),
        JSON.stringify(summary, null, 2),
    );
    console.log(`\nperf-capture — wrote ${summary.length} runs → ${OUT}`);
}

main().catch((err) => {
    console.error("perf-capture — ERROR:", err);
    process.exit(3);
});
