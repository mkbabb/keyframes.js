#!/usr/bin/env node
/**
 * I.B9 DEV-MODE probe — reproduce the LIVE dev-server (:5174) 404s + source-map
 * errors that the BUILT dist does NOT exhibit. Drives the SAME chromium as the
 * dist probe, but points at the running Vite dev server instead of serveDist.
 *
 * Run (dev server must be up — `npm run dev`):
 *   KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
 *   KF_DEV_BASE=http://localhost:5174 \
 *   node docs/tranches/I/audit/investigate/probes/b9-dev-mode.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const SHOTS = path.resolve(HERE, "../shots");
fs.mkdirSync(SHOTS, { recursive: true });

const BASE = process.env.KF_DEV_BASE ?? "http://localhost:5174";
const requireFrom = createRequire(
    path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
);
const { chromium } = requireFrom("playwright-core");

const SCENES = ["cube", "amiga", "square", "easing", "spring", "sequence", "motion-path"];

(async () => {
    const browser = await chromium.launch();
    const report = {};

    for (const scene of SCENES) {
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await ctx.newPage();

        const consoleAll = [];
        const pageErrors = [];
        const net404 = [];
        const sourcemaps = [];

        page.on("console", (m) => consoleAll.push({ type: m.type(), text: m.text() }));
        page.on("pageerror", (e) => pageErrors.push(String(e.stack || e.message || e)));
        page.on("requestfailed", (r) =>
            net404.push({ kind: "requestfailed", url: r.url(), failure: r.failure()?.errorText }),
        );
        page.on("response", (resp) => {
            const url = resp.url();
            const st = resp.status();
            if (url.endsWith(".map") || /\.map(\?|$)/.test(url)) {
                sourcemaps.push({ url, status: st });
            }
            if (st >= 400) net404.push({ kind: "http", url, status: st });
        });

        try {
            await page.goto(`${BASE}/#/${scene}`, { waitUntil: "load", timeout: 20000 });
        } catch (e) {
            pageErrors.push(`goto failed: ${String(e)}`);
        }
        await page.waitForTimeout(2000);

        const shot = path.join(SHOTS, `b9-dev-${scene}.png`);
        await page.screenshot({ path: shot }).catch(() => {});

        report[scene] = {
            consoleErrors: consoleAll.filter((m) => m.type === "error"),
            consoleWarnings: consoleAll.filter((m) => m.type === "warning"),
            pageErrors,
            net404,
            sourcemapNon200: sourcemaps.filter((s) => s.status >= 400),
            sourcemapTotal: sourcemaps.length,
            shot: path.relative(REPO, shot),
        };
        await ctx.close();
    }

    await browser.close();

    const outFile = path.join(HERE, "b9-dev-output.json");
    fs.writeFileSync(outFile, JSON.stringify(report, null, 2));

    console.log("=== DEV-MODE PER-SCENE SUMMARY ===");
    const all404 = new Set();
    const allMapFail = new Set();
    for (const [scene, r] of Object.entries(report)) {
        console.log(
            `\n[${scene}] consoleErrors=${r.consoleErrors.length} pageErrors=${r.pageErrors.length} net404=${r.net404.length} sourcemapNon200=${r.sourcemapNon200.length}/${r.sourcemapTotal}`,
        );
        for (const n of r.net404) {
            const u = n.url.replace(BASE, "");
            all404.add(`${n.kind} ${n.status ?? n.failure ?? ""} ${u}`);
        }
        for (const s of r.sourcemapNon200) allMapFail.add(s.url.replace(BASE, ""));
        if (r.net404.length) console.log("  net404:", JSON.stringify(r.net404.slice(0, 6).map((n) => ({ s: n.status ?? n.failure, u: n.url.replace(BASE, "") }))));
        if (r.consoleErrors.length) console.log("  consoleErr[0]:", JSON.stringify(r.consoleErrors[0]?.text?.slice(0, 220)));
    }
    console.log("\n=== UNION 404 SET (dev) ===");
    console.log([...all404].join("\n") || "(none)");
    console.log("\n=== UNION SOURCEMAP FAIL SET (dev) ===");
    console.log([...allMapFail].join("\n") || "(none)");
    console.log(`\nfull JSON → ${path.relative(REPO, outFile)}`);
})();
