#!/usr/bin/env node
/**
 * swap-3d — OD19-ALL "route transitions smooth and subtle", read on the two
 * 3D/canvas scenes (critic-2 C2-KF-01). The dock Scene select swaps
 * Spring -> Cube -> Spring -> Amiga, twice, through the root View Transition
 * dissolve, and no frame of any swap INTO Cube or Amiga may exceed
 * MAX_FRAME_MS.
 *
 * The browser is the default headless shell with ANGLE-Metal (a named GPU
 * witness, no branded Chrome). Under the shell's SwiftShader default, both
 * swaps show one 300-700 ms frame that contains no script. Those frames are
 * software raster, so they are not the dissolve's cost on a GPU compositor:
 *   - Cube: the preserve-3d subtree rastered into the live `scene-subject`
 *     image, four frames per swap. With the dissolve off it peaks at 64-98 ms.
 *     Naming the subject on its own did not help unless the name flattened
 *     the cube.
 *   - Amiga: SwiftShader builds the WebGL pipeline at the first draw. The
 *     frame stays at 326-375 ms with the dissolve off.
 * On ANGLE-Metal the same code peaks at 50-93 ms (value.js
 * docs/tranches/X/execution/OD19/keyframes.md "### repair 2"). If no GPU
 * renderer is served, the witness exits 2 and does not pass vacuously.
 *
 * Over the production demo build (`npm run gh-pages`, or KF_DIST=<dir>).
 * Exit 1 on any breach, 2 when the build, the browser or the GPU is missing.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { serveDist, withBrowser } from "../../lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const DIST = path.resolve(process.env.KF_DIST ?? path.join(REPO, "dist/gh-pages"));
const MAX_FRAME_MS = 120;
const TARGETS = ["Cube", "Spring", "Amiga", "Spring", "Cube", "Spring", "Amiga"];
const GPU_ARGS = ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"];

if (!fs.existsSync(path.join(DIST, "index.html"))) {
    console.error(`swap-3d — ${DIST}/index.html missing (run \`npm run gh-pages\`).`);
    process.exit(2);
}

const rows = [];
let renderer = null;
const server = await serveDist(DIST);
try {
    const ran = await withBrowser(
        async (browser) => {
            const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "dark" });
            try {
                const page = await ctx.newPage();
                page.setDefaultTimeout(15000);
                renderer = await page.evaluate(() => {
                    const gl = document.createElement("canvas").getContext("webgl2");
                    const x = gl?.getExtension("WEBGL_debug_renderer_info");
                    return x ? gl.getParameter(x.UNMASKED_RENDERER_WEBGL) : null;
                });
                if (!renderer || /SwiftShader/i.test(renderer)) return;
                await page.goto(`${server.url}/#/spring`, { waitUntil: "load" });
                await page.waitForTimeout(4000);
                for (const target of TARGETS) {
                    const dock = await page.locator(".glass-dock").first().boundingBox();
                    await page.mouse.move(dock.x + dock.width / 2, dock.y + 28);
                    await page.waitForTimeout(900);
                    await page.locator('[aria-label="Scene"]:visible').first().click();
                    await page.waitForTimeout(600);
                    await page.evaluate(() => {
                        const f = (window.__frames = []);
                        const t0 = performance.now();
                        const tick = (t) => {
                            f.push(t);
                            if (t - t0 < 1600) requestAnimationFrame(tick);
                        };
                        requestAnimationFrame(tick);
                    });
                    await page.getByRole("option", { name: target }).click();
                    await page.waitForTimeout(1800);
                    const worst = await page.evaluate(() => {
                        const f = window.__frames;
                        return Math.round(Math.max(...f.slice(1).map((t, i) => t - f[i])));
                    });
                    rows.push({ target, hash: await page.evaluate(() => location.hash), worst });
                    await page.mouse.move(1437, 450);
                    await page.waitForTimeout(2200);
                }
            } finally {
                await ctx.close();
            }
        },
        { label: "swap-3d", launch: { args: GPU_ARGS } },
    );
    if (ran?.skipped) process.exit(2);
} finally {
    await server.close();
}

console.log(`swap-3d — ${DIST} · ${renderer ?? "no WebGL"} · 1440x900 dark`);
if (!rows.length) {
    console.error("swap-3d — no GPU renderer served; the witness cannot run (exit 2).");
    process.exit(2);
}
let fail = 0;
for (const r of rows) {
    const gated = r.target === "Cube" || r.target === "Amiga";
    const bad = gated && r.worst > MAX_FRAME_MS;
    if (bad) fail++;
    console.log(`${bad ? "FAIL" : "ok  "} ${r.target.padEnd(7)} ${r.hash.padEnd(10)} worst frame ${r.worst} ms${gated ? ` (<= ${MAX_FRAME_MS})` : ""}`);
}
process.exit(fail ? 1 : 0);
