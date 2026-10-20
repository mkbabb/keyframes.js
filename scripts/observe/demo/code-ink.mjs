#!/usr/bin/env node
/**
 * code-ink — C1-KF-04 (critic 1 on OD19-K7, "better syntax colour coding"):
 * the editor's six code inks must read as six colours, not two families.
 *
 * Over the PRODUCTION demo build (`npm run gh-pages`, or KF_DIST=<dir>),
 * headless Chromium, light and dark: each `CODE_INK` rung (read from
 * `demo/components/instrument/keyframes/utils/codeTokens.ts`, the one table
 * the editor theme and the printed artifacts share) is resolved on the page
 * the way the editor resolves it (a probe element's computed colour, one
 * canvas pixel for the sRGB bytes), converted to OKLab, and every pair's
 * Euclidean ΔE is taken. The bar: the closest pair is >= MIN_DE in both
 * schemes. (At the critic's HEAD, kf `9439cfb7`, the closest pair was
 * number/stop, two of the three violets: 0.073 light, 0.058 dark.)
 *
 * Exit 1 on a breach, 2 when the build or the browser is missing.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { serveDist, withBrowser } from "../../lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const DIST = path.resolve(process.env.KF_DIST ?? path.join(REPO, "dist/gh-pages"));
const MIN_DE = 0.085;

if (!fs.existsSync(path.join(DIST, "index.html"))) {
    console.error(`code-ink — ${DIST}/index.html missing (run \`npm run gh-pages\`).`);
    process.exit(2);
}

// The table, read from its source: `rung: "css",` lines inside CODE_INK.
// KF_INK_SRC points it at another revision's table (the RED read of HEAD).
const src = fs.readFileSync(
    process.env.KF_INK_SRC ?? path.join(REPO, "demo/components/instrument/keyframes/utils/codeTokens.ts"),
    "utf8",
);
const body = src.slice(src.indexOf("export const CODE_INK"), src.indexOf("} as const;"));
const INKS = Object.fromEntries([...body.matchAll(/^\s*(\w+):\s*"([^"]+)",/gm)].map((m) => [m[1], m[2]]));
if (Object.keys(INKS).length !== 6) {
    console.error(`code-ink — expected 6 CODE_INK rungs, read ${Object.keys(INKS).length}`);
    process.exit(1);
}

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function oklab([r8, g8, b8]) {
    const [r, g, b] = [r8, g8, b8].map((v) => lin(v / 255));
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [
        0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
    ];
}

const failures = [];
const report = {};
const server = await serveDist(DIST);
let half;
try {
    half = await withBrowser(
        async (browser) => {
            for (const scheme of ["light", "dark"]) {
                const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: scheme });
                try {
                    const page = await context.newPage();
                    await page.goto(server.url + "/#/cube", { waitUntil: "load" });
                    await page.waitForTimeout(1500);
                    const got = await page.evaluate((inks) => {
                        const probe = document.createElement("div");
                        probe.style.display = "none";
                        document.body.appendChild(probe);
                        const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
                        const out = {};
                        for (const [k, css] of Object.entries(inks)) {
                            probe.style.color = css;
                            ctx.clearRect(0, 0, 1, 1);
                            ctx.fillStyle = getComputedStyle(probe).color;
                            ctx.fillRect(0, 0, 1, 1);
                            out[k] = [...ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)];
                        }
                        probe.remove();
                        return { dark: document.documentElement.classList.contains("dark"), rgb: out };
                    }, INKS);
                    if (got.dark !== (scheme === "dark")) failures.push(`${scheme}: the page did not take the ${scheme} scheme`);
                    const lab = Object.fromEntries(Object.entries(got.rgb).map(([k, v]) => [k, oklab(v)]));
                    const keys = Object.keys(lab);
                    const pairs = [];
                    for (let i = 0; i < keys.length; i++)
                        for (let j = i + 1; j < keys.length; j++) {
                            const [a, b] = [lab[keys[i]], lab[keys[j]]];
                            pairs.push({ pair: `${keys[i]}/${keys[j]}`, de: Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) });
                        }
                    pairs.sort((p, q) => p.de - q.de);
                    report[scheme] = { rgb: got.rgb, closest: pairs.slice(0, 3).map((p) => `${p.pair} ${p.de.toFixed(3)}`) };
                    const min = pairs[0];
                    const ok = min.de >= MIN_DE;
                    console.log(`  ${ok ? "✓" : "✗"} ${scheme}: closest ${min.pair} ΔE ${min.de.toFixed(3)} (bar ${MIN_DE})`);
                    if (!ok) failures.push(`${scheme}: ${min.pair} ΔE ${min.de.toFixed(3)} < ${MIN_DE}`);
                } finally {
                    await context.close();
                }
            }
        },
        { label: "code-ink" },
    );
} finally {
    await server.close();
}
if (half?.skipped) {
    console.error(`code-ink — no browser: ${half.reason}`);
    process.exit(2);
}
console.log(JSON.stringify(report));
if (failures.length) {
    console.error(`code-ink — FAIL (${failures.length})`);
    process.exit(1);
}
console.log("code-ink — PASS");
