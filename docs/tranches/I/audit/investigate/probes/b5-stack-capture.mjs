#!/usr/bin/env node
/**
 * Tranche I — INVESTIGATION PROBE [b5-stack-capture].
 *
 * Second pass for B5: capture the FULL stack of the serializer throw, and
 * confirm the placeholder appears for the default cube animation. We install
 * a page-side console.error tap that records the error OBJECT's `.stack`
 * (the bundled `engine.ts` frames), then load /#/cube and let the keyframes
 * pane auto-serialize on mount.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../../../..");
const DIST = path.join(REPO, "dist/gh-pages");

const MIME = {
    ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
    ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml",
    ".png": "image/png", ".woff2": "font/woff2", ".woff": "font/woff",
    ".ttf": "font/ttf", ".map": "application/json",
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

function requirePlaywright() {
    const requireFrom = createRequire(path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"));
    try { return requireFrom("playwright-core"); } catch { return requireFrom("@playwright/test"); }
}

async function main() {
    const { chromium } = requirePlaywright();
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const out = { stacks: [], warnings: [], placeholderShown: null };

    try {
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await ctx.newPage();

        // Tap the error BEFORE app code runs: wrap console.error to stash the
        // first arg's stack, and patch Error to keep stacks. The serializer
        // catch does `console.error(e)` (KeyframesStringControls onEditorChange)
        // and `console.warn("[KeyframesString]...")` (the mount catch).
        await page.addInitScript(() => {
            window.__caught = [];
            const origErr = console.error.bind(console);
            console.error = (...a) => {
                const e = a.find((x) => x && x.stack);
                if (e) window.__caught.push({ message: String(e.message || e), stack: String(e.stack) });
                return origErr(...a);
            };
        });
        await page.addInitScript((ck) => {
            try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {}
        }, CTRL_KEY);

        const warnings = [];
        page.on("console", (m) => {
            if (m.type() === "warning" || m.type() === "error") warnings.push(m.text());
        });

        await page.goto(`${base}/#/cube`, { waitUntil: "load" });
        await page.waitForFunction(
            ([mk]) => { try { return !!JSON.parse(localStorage.getItem(mk) || "{}").activeScene; } catch { return false; } },
            [MACHINE_KEY], { timeout: 8000 },
        ).catch(() => {});
        await page.waitForTimeout(2500); // mount + Monaco + serialize

        out.placeholderShown = await page.evaluate(() => {
            const t = (document.querySelector(".monaco-pane")?.textContent || "");
            return t.includes("no CSS twin");
        });
        out.stacks = await page.evaluate(() => window.__caught || []);
        out.warnings = warnings.filter((w) => /KeyframesString|Parse error|serialize/i.test(w));

        // Also: harvest the names of the cube animations from the selector.
        out.selectorOptions = await page.evaluate(() => {
            const trig = [...document.querySelectorAll("[class*=dock-select-trigger]")]
                .map((t) => (t.textContent || "").trim());
            return trig;
        });
    } finally {
        await browser.close();
        server.close();
    }
    console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => { console.error("PROBE FAILED:", e); process.exit(1); });
