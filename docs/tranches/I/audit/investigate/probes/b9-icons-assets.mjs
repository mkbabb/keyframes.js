#!/usr/bin/env node
/**
 * I.B9 investigation probe — icons + missing assets + source-map errors.
 *
 * Serves the BUILT dist/gh-pages/ on an ephemeral port (proven serveDist
 * pattern from scripts/proof-no-orphan-specular.mjs), opens EACH scene fresh,
 * and records EVERY network request — flagging non-200 responses (404s, missing
 * assets) and source-map (`.map`) fetches/failures. Captures console + pageerror
 * verbatim. Screenshots each scene.
 *
 * Run: KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
 *      node docs/tranches/I/audit/investigate/probes/b9-icons-assets.mjs
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
    ".mjs": "text/javascript",
    ".css": "text/css",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
    ".json": "application/json",
    ".map": "application/json",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".wasm": "application/wasm",
};

// serveDist — identical semantics to proof-no-orphan-specular.mjs, but RECORD
// every request path + whether it hit a real file so we can prove the 404 set.
const served = [];
function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        const inside = p.startsWith(DIST);
        const exists = inside && fs.existsSync(p) && !fs.statSync(p).isDirectory();
        served.push({ urlPath, status: exists ? 200 : 404 });
        if (!exists) {
            res.writeHead(404).end();
            return;
        }
        res.writeHead(200, {
            "content-type": MIME[path.extname(p)] ?? "application/octet-stream",
        });
        fs.createReadStream(p).pipe(res);
    });
}

const requireFrom = createRequire(
    path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
);
const { chromium } = requireFrom("playwright-core");

const SCENES = ["cube", "amiga", "square", "easing", "spring", "sequence", "motion-path"];

(async () => {
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        console.error("dist/gh-pages NOT built — run `npm run gh-pages` first");
        process.exit(2);
    }
    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    console.log(`serving dist/gh-pages at ${base}`);

    const browser = await chromium.launch();
    const report = {};

    for (const scene of SCENES) {
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await ctx.newPage();

        const consoleMsgs = [];
        const pageErrors = [];
        const netFailures = []; // 404 / failed
        const sourcemaps = []; // any .map fetch

        page.on("console", (m) => {
            const txt = m.text();
            consoleMsgs.push({ type: m.type(), text: txt });
        });
        page.on("pageerror", (e) => pageErrors.push(String(e.stack || e.message || e)));
        page.on("requestfailed", (r) =>
            netFailures.push({ url: r.url(), failure: r.failure()?.errorText, method: r.method() }),
        );
        page.on("response", (resp) => {
            const url = resp.url();
            const st = resp.status();
            if (url.endsWith(".map") || url.includes(".map?")) {
                sourcemaps.push({ url, status: st });
            }
            if (st >= 400) {
                netFailures.push({ url, status: st, method: resp.request().method() });
            }
        });

        try {
            await page.goto(`${base}/#/${scene}`, { waitUntil: "load", timeout: 15000 });
        } catch (e) {
            pageErrors.push(`goto failed: ${String(e)}`);
        }
        await page.waitForTimeout(1500); // let lazy chunks + icons + scene Cards mount

        // Inventory the actually-rendered icons: <svg> inline SFCs + <img src> +
        // CSS background-image url()s + any element resolving a url(...) bg.
        const iconInventory = await page.evaluate(() => {
            const out = { inlineSvg: 0, imgSrcs: [], cssBgUrls: [], brokenImgs: [] };
            out.inlineSvg = document.querySelectorAll("svg").length;
            for (const img of document.querySelectorAll("img")) {
                out.imgSrcs.push(img.getAttribute("src"));
                if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) {
                    out.brokenImgs.push(img.getAttribute("src"));
                }
            }
            // sample background-image url()s on visible elements
            const seen = new Set();
            for (const el of document.querySelectorAll("*")) {
                const bg = getComputedStyle(el).backgroundImage;
                if (bg && bg !== "none" && bg.includes("url(")) {
                    const m = bg.match(/url\(["']?([^"')]+)["']?\)/g);
                    if (m) m.forEach((u) => seen.add(u));
                }
            }
            out.cssBgUrls = [...seen].slice(0, 40);
            return out;
        });

        const shot = path.join(SHOTS, `b9-${scene}.png`);
        await page.screenshot({ path: shot, fullPage: false }).catch(() => {});

        report[scene] = {
            consoleErrors: consoleMsgs.filter((m) => m.type === "error"),
            consoleWarnings: consoleMsgs.filter((m) => m.type === "warning"),
            pageErrors,
            netFailures,
            sourcemaps,
            iconInventory,
            shot: path.relative(REPO, shot),
        };

        await ctx.close();
    }

    await browser.close();
    server.close();

    // ── server-side served-path audit: the union 404 set across all scenes ──
    const path404 = [...new Set(served.filter((s) => s.status === 404).map((s) => s.urlPath))];
    const pathServed = [...new Set(served.filter((s) => s.status === 200).map((s) => s.urlPath))];

    const summary = {
        repo: REPO,
        dist: DIST,
        server404Paths: path404,
        servedPathCount: pathServed.length,
        scenes: report,
    };

    const outFile = path.join(HERE, "b9-probe-output.json");
    fs.writeFileSync(outFile, JSON.stringify(summary, null, 2));
    console.log(`\n=== SERVER 404 PATHS (union across scenes) ===`);
    console.log(path404.length ? path404.join("\n") : "(none)");
    console.log(`\n=== PER-SCENE SUMMARY ===`);
    for (const [scene, r] of Object.entries(report)) {
        console.log(
            `\n[${scene}] consoleErrors=${r.consoleErrors.length} pageErrors=${r.pageErrors.length} netFailures=${r.netFailures.length} sourcemaps=${r.sourcemaps.length} inlineSvg=${r.iconInventory.inlineSvg} brokenImgs=${r.iconInventory.brokenImgs.length}`,
        );
        if (r.pageErrors.length) console.log("  pageErrors:", JSON.stringify(r.pageErrors.slice(0, 2)));
        if (r.netFailures.length) console.log("  netFailures:", JSON.stringify(r.netFailures.slice(0, 8)));
        if (r.iconInventory.brokenImgs.length) console.log("  brokenImgs:", JSON.stringify(r.iconInventory.brokenImgs));
    }
    console.log(`\nfull JSON → ${path.relative(REPO, outFile)}`);
})();
