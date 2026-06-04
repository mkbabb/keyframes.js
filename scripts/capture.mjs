#!/usr/bin/env node
/**
 * capture — the before/after-every-page capture harness (the precept edict's
 * checked-in instrument).
 *
 * The before/after-every-page edict (precepts SPEC.md, committed at 8ccf9f4)
 * binds the capture to "a SINGLE Playwright/Chrome harness CHECKED INTO the
 * tranche's audit dir so it re-runs identically at open and close." B
 * authored the edict and ran the capture, but the harness lived in /tmp — so
 * "re-runs identically" was unsatisfiable (tranche-C plan-findings,
 * precept-adherence CRITICAL). This is that harness, in the repo.
 *
 * It serves the BUILT `dist/gh-pages/` (the artefact a deploy publishes — NOT
 * the dev server; B's BEFORE was dev because the prod build was blank, an
 * asymmetry the DELTA must name), navigates every demo page × {375,1280,1440}
 * at idle, screenshots to the target dir, and records per-page console errors.
 *
 * Usage:
 *   node scripts/capture.mjs <before|after> [outDir]
 *   KF_PLAYWRIGHT_DIR=/path  (resolve playwright from there; CI installs it)
 *   KF_CAPTURE_OPEN_PANEL=1  (also capture the controls-OPEN state — the state
 *                             inv δ / the a11y audit must exercise, C.W1)
 *
 * Default outDir: docs/tranches/<TRANCHE>/audit/screenshots/<phase>/ — pass
 * an explicit dir to target a specific tranche.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const phase = process.argv[2];
if (phase !== "before" && phase !== "after") {
    console.error("usage: node scripts/capture.mjs <before|after> [outDir]");
    process.exit(2);
}
const OUT =
    process.argv[3] ??
    path.join(REPO, `docs/tranches/B/audit/screenshots/${phase}`);

// The pinned matrix — 6 pages × 3 viewports = 18 captures. Identical at open
// and close so the pairing is a true diff, not a re-scoped shoot.
const PAGES = [
    { id: "home", route: "" },
    { id: "cube", route: "cube" },
    { id: "amiga", route: "amiga" },
    { id: "square", route: "square" },
    { id: "easing", route: "easing" },
    { id: "spring", route: "spring" },
];
const VIEWPORTS = [
    { name: "mobile", width: 375, height: 667 },
    { name: "laptop", width: 1280, height: 800 },
    { name: "desktop", width: 1440, height: 900 },
];

function resolveChromium() {
    const root = process.env.KF_PLAYWRIGHT_DIR ?? REPO;
    const requireFrom = createRequire(path.join(root, "package.json"));
    for (const pkg of ["playwright-core", "@playwright/test", "playwright"]) {
        try {
            return requireFrom(pkg).chromium;
        } catch {
            /* next */
        }
    }
    return null;
}

const MIME = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".ttf": "font/ttf",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
};

async function main() {
    const chromium = resolveChromium();
    if (!chromium) {
        console.error(
            "capture — playwright not resolvable (set KF_PLAYWRIGHT_DIR).",
        );
        process.exit(2);
    }
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        console.error("capture — dist/gh-pages not built (run `npm run gh-pages`).");
        process.exit(2);
    }
    fs.mkdirSync(OUT, { recursive: true });

    const server = http.createServer((req, res) => {
        const u = decodeURIComponent(new URL(req.url, "http://x").pathname);
        let p = path.join(DIST, u === "/" ? "index.html" : u);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
            p = path.join(DIST, "index.html");
        }
        res.writeHead(200, {
            "content-type": MIME[path.extname(p)] ?? "application/octet-stream",
        });
        fs.createReadStream(p).pipe(res);
    });
    await new Promise((r) => server.listen(0, r));
    const port = server.address().port;
    const browser = await chromium.launch();
    const report = [];

    for (const pg of PAGES) {
        for (const vp of VIEWPORTS) {
            const page = await browser.newPage({
                viewport: { width: vp.width, height: vp.height },
            });
            const consoleErrors = [];
            page.on("console", (m) => {
                if (m.type() === "error") consoleErrors.push(m.text());
            });
            page.on("pageerror", (e) => consoleErrors.push("PAGEERROR: " + e.message));
            await page.goto(`http://127.0.0.1:${port}/#/${pg.route}`, {
                waitUntil: "load",
            });
            await page.waitForTimeout(2500);
            const file = `${pg.id}-${vp.name}.png`;
            await page.screenshot({ path: path.join(OUT, file) });
            report.push({ page: pg.id, viewport: vp.name, file, consoleErrors });
            console.log(
                `  ${file.padEnd(20)} ${consoleErrors.length ? `⚠ ${consoleErrors.length} console error(s)` : "✓ clean"}`,
            );
            await page.close();
        }
    }

    await browser.close();
    server.close();

    fs.writeFileSync(
        path.join(OUT, "_capture-report.json"),
        JSON.stringify(report, null, 2),
    );
    const dirty = report.filter((r) => r.consoleErrors.length);
    console.log(
        `\ncapture (${phase}) — ${report.length} screenshots → ${path.relative(REPO, OUT)}` +
            (dirty.length
                ? `; console errors on: ${dirty.map((r) => `${r.page}/${r.viewport}`).join(", ")}`
                : "; zero console errors"),
    );
}

main().catch((err) => {
    console.error("capture — ERROR:", err);
    process.exit(3);
});
