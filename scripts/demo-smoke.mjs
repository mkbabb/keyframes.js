#!/usr/bin/env node
/**
 * demo-smoke — the demo-build smoke gate (B inv γ: the demo cannot ship blank).
 *
 * Asserts against the BUILT `dist/gh-pages/` — the artefact a deploy would
 * publish — the conditions a blank/tree-shaken build fails. The failure mode
 * this gate exists for: rolldown tree-shook the inline `<script type="module">`
 * bootstrap out of `demo/app/index.html`, shipping a 698-byte preload shim
 * with no app entry and no CSS, and nothing turned red.
 *
 * STATIC half (always runs):
 *   1. `index.html` references a built module entry, and that entry chunk is
 *      substantial (> 50 KB floor — the shim was 698 bytes). The ENTRY
 *      CHUNK's size is gated, not index.html's, so a future inlined shim
 *      cannot pass by bloating the HTML.
 *   2. A non-empty `index-*.css` asset emits, `index.html` carries the
 *      `<style data-critical>` instant-paint block AND the deferred
 *      `media="print"` main-stylesheet link (the critical-CSS apparatus is
 *      live, not dead).
 *   3. No splash residue: no `.loading-skeleton`/`.loading-title` strings.
 *   4. The entry chunk's STATIC import statements exclude the heavy lazy
 *      vendors (`vendor-monaco`, `vendor-three`) — the eager-leak class
 *      (rolldown once parked vite's preload helper inside vendor-monaco,
 *      putting 4 MB on the entry's critical path).
 *
 * BROWSER half (runs when playwright is resolvable — CI installs it;
 *   override the resolution root with KF_PLAYWRIGHT_DIR):
 *   5. Served statically, `/` mounts: `#app` gains non-trivial children and
 *      the hero text renders. A build that emits an entry but throws on
 *      mount still fails.
 *   6. No heavy chunk (`vendor-monaco`, `vendor-three`, `*.worker`) is
 *      requested before `load`.
 *   7. Zero console errors during mount.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
const ENTRY_FLOOR_BYTES = 50_000;

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

// ── STATIC half ─────────────────────────────────────────────────────────
const htmlPath = path.join(DIST, "index.html");
if (!fs.existsSync(htmlPath)) {
    console.error(`demo-smoke — FAIL: ${htmlPath} does not exist (run \`npm run gh-pages\` first).`);
    process.exit(2);
}
const html = fs.readFileSync(htmlPath, "utf8");

// 1. Real, substantial entry chunk.
const entryMatch = html.match(/<script[^>]*type="module"[^>]*src="\.\/(assets\/index-[^"]+\.js)"/);
if (!entryMatch) {
    fail("index.html references a built module entry (assets/index-*.js)");
} else {
    const entryPath = path.join(DIST, entryMatch[1]);
    const size = fs.existsSync(entryPath) ? fs.statSync(entryPath).size : 0;
    if (size > ENTRY_FLOOR_BYTES) {
        ok(`entry chunk ${entryMatch[1]} is substantial (${size} B > ${ENTRY_FLOOR_BYTES} B floor)`);
    } else {
        fail(`entry chunk ${entryMatch[1]} is ${size} B — under the ${ENTRY_FLOOR_BYTES} B floor (blank/tree-shaken build?)`);
    }

    // 4. Heavy vendors are not STATIC imports of the entry.
    if (size > 0) {
        const entrySrc = fs.readFileSync(entryPath, "utf8");
        const staticHeavy = entrySrc.match(/(?:import|from)"\.\/(vendor-monaco|vendor-three)[^"]*"/g);
        if (staticHeavy) {
            fail(`entry statically imports heavy lazy vendors: ${[...new Set(staticHeavy)].join(", ")}`);
        } else {
            ok("entry's static import graph excludes vendor-monaco / vendor-three");
        }
    }
}

// 2. CSS emitted + critical-CSS apparatus live.
const assets = fs.existsSync(path.join(DIST, "assets"))
    ? fs.readdirSync(path.join(DIST, "assets"))
    : [];
const cssAsset = assets.find((a) => /^index-.*\.css$/.test(a));
if (cssAsset && fs.statSync(path.join(DIST, "assets", cssAsset)).size > 1000) {
    ok(`CSS asset emitted (assets/${cssAsset})`);
} else {
    fail("a non-empty index-*.css asset emits (the blank build emitted ZERO css)");
}
if (html.includes("<style data-critical>")) {
    ok("critical-CSS <style data-critical> block inlined");
} else {
    fail("critical-CSS <style data-critical> block present in built index.html");
}
if (/<link rel="stylesheet"[^>]*index-[^>]*media="print"/.test(html)) {
    ok("main stylesheet deferred (media=print onload swap)");
} else {
    fail("main stylesheet carries the non-render-blocking defer pattern");
}

// 3. No splash residue.
if (/loading-skeleton|loading-title/.test(html)) {
    fail("built index.html still carries the loading splash");
} else {
    ok("no loading-splash residue");
}

// ── BROWSER half ────────────────────────────────────────────────────────
async function browserHalf() {
    let chromium;
    try {
        const requireFrom = createRequire(
            path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
        );
        ({ chromium } = requireFrom("playwright-core"));
    } catch {
        try {
            const requireFrom = createRequire(
                path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
            );
            ({ chromium } = requireFrom("@playwright/test"));
        } catch {
            console.log(
                "  ○ browser half skipped — playwright not resolvable " +
                    "(set KF_PLAYWRIGHT_DIR or install @playwright/test)",
            );
            return;
        }
    }

    // Tiny static server over DIST.
    const MIME = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".ttf": "font/ttf",
        ".svg": "image/svg+xml",
    };
    const server = http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        let p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
            res.writeHead(404).end();
            return;
        }
        res.writeHead(200, {
            "content-type": MIME[path.extname(p)] ?? "application/octet-stream",
        });
        fs.createReadStream(p).pipe(res);
    });
    await new Promise((r) => server.listen(0, r));
    const port = server.address().port;

    const browser = await chromium.launch();
    try {
        const page = await browser.newPage();
        const heavyRequests = [];
        const consoleErrors = [];
        page.on("request", (req) => {
            if (/vendor-monaco|vendor-three|\.worker/.test(req.url())) {
                heavyRequests.push(req.url());
            }
        });
        page.on("console", (msg) => {
            if (msg.type() === "error") consoleErrors.push(msg.text());
        });

        await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "load" });

        // 5. The app mounts and paints.
        try {
            await page.waitForFunction(
                () => {
                    const app = document.querySelector("#app");
                    return app && app.children.length > 0 && app.innerHTML.length > 500;
                },
                { timeout: 15000 },
            );
            ok("#app mounts with non-trivial children");
        } catch {
            fail("#app mounts with non-trivial children (blank mount)");
        }

        // Poll directly (the hash router redirect to `#/` can destroy the
        // execution context that page.waitForFunction holds, which would
        // spuriously fail it) — retry-on-error until the hero text appears.
        let heroVisible = false;
        let lastBody = "(unread)";
        for (let i = 0; i < 30 && !heroVisible; i++) {
            try {
                lastBody = await page.evaluate(() => document.body.innerText);
                heroVisible = /select\s+an\s+animation/i.test(lastBody);
            } catch {
                /* context destroyed mid-navigation — retry */
            }
            if (!heroVisible) await page.waitForTimeout(300);
        }
        if (heroVisible) {
            ok("home hero text renders");
        } else {
            fail(
                `home hero text renders ('Select an animation') — body.innerText: ${JSON.stringify(lastBody.slice(0, 200))}`,
            );
        }

        // 6. Heavy chunks off the critical path.
        if (heavyRequests.length === 0) {
            ok("no vendor-monaco / vendor-three / worker request at first paint");
        } else {
            fail(`heavy chunks requested at first paint: ${heavyRequests.slice(0, 3).join(", ")}`);
        }

        // 7. Console clean.
        if (consoleErrors.length === 0) {
            ok("zero console errors during mount");
        } else {
            fail(`console errors during mount: ${consoleErrors.slice(0, 3).join(" | ")}`);
        }
    } finally {
        await browser.close();
        server.close();
    }
}

console.log("demo-smoke — inv γ (the demo cannot ship blank)");
await browserHalf();

if (failures.length > 0) {
    console.error(`\ndemo-smoke — FAIL (${failures.length}): the built demo violates inv γ.`);
    process.exit(1);
}
console.log("\ndemo-smoke — PASS: the built demo paints (inv γ holds).");
