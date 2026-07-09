#!/usr/bin/env node
/**
 * proof:cube-silhouette — Tranche T.A1 + T.A4 (the 3D die RESTORED · born-RED on
 * the pre-cure tree).
 *
 * ── WHAT THIS GATE ASSERTS ───────────────────────────────────────────────────
 * The cube's L-era `--spin-energy` bloom was a `filter: drop-shadow(...)` on the
 * die. `filter` is a CSS grouping property → it forced `.cube--relit`'s USED
 * `transform-style` to `flat`, collapsing the six `.cube-side` faces onto one
 * plane: only face 1 survived; right/left/top measured ~15px slivers (verdict #1,
 * lane 02 F1). T.A1 DELETES the bloom channel; T.A4 sizes `.cube` honestly
 * (side×side, was 0 × 450px). This gate reds on BOTH defects and greens on the
 * cured render:
 *
 *   (STATIC HALF, always runs)
 *     • grep-zero `spin-energy` under demo/scenes/cube/ — the bloom channel + its
 *       @property/producer/binding must be GONE (never a relocated ancestor filter).
 *
 *   (BROWSER HALF, KF_REQUIRE_BROWSER / when the harness is available)
 *     • SILHOUETTE (T.A1): at cold entry, NO reduced-motion emulation, ≥3
 *       `.cube-side` bounding rects each with width AND height > 0.25·--side-size
 *       (the flattened slivers fail this; the restored 3D faces pass).
 *     • GEOMETRY (T.A4): the `.cube` element's own rect is side×side ±1px (the
 *       former `height: calc(--side-size * 2)` / zero-width flex collapse fails).
 *
 * Harness: scripts/lib/demo-driver.mjs (withPage = serveDist + resolveChromium +
 * context/teardown; navToScene drives the in-page scene switch). When no browser
 * is resolvable the browser half is SKIPPED (harness-unavailable is not a failure —
 * the static half still bites); CI runs it on the shared harness via the demo
 * roster. Re-runnable: `node scripts/proof-cube-silhouette.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CUBE_DIR = path.join(REPO, "demo/scenes/cube");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:cube-silhouette — T.A1/T.A4 (the 3D die restored: no bloom flatten, honest geometry)",
);

// ── STATIC HALF — grep-zero `spin-energy` under demo/scenes/cube/ ─────────────
function walk(dir) {
    const out = [];
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) out.push(...walk(p));
        else out.push(p);
    }
    return out;
}

const cubeFiles = walk(CUBE_DIR).filter((p) =>
    /\.(vue|ts|css|mjs|js)$/.test(p),
);
const bloomHits = cubeFiles.filter((p) =>
    /spin-energy|spinEnergy/.test(fs.readFileSync(p, "utf8")),
);
if (bloomHits.length === 0) {
    ok("grep-zero — no `spin-energy` bloom channel survives under demo/scenes/cube/");
} else {
    fail(
        `grep-zero — the --spin-energy bloom still resolves in: ${bloomHits
            .map((p) => path.relative(REPO, p))
            .join(", ")} (T.A1 deletes it; NEVER relocate the filter to an ancestor)`,
    );
}

// ── BROWSER HALF — the silhouette + geometry render checks ────────────────────
const VW = 1440;
const VH = 900;

async function browserHalf() {
    const result = await withPage(
        {
            distDir: DIST,
            label: "cube silhouette + geometry",
            context: { viewport: { width: VW, height: VH } },
        },
        async (page, { url }) => {
            await page.goto(`${url}/#/cube`, { waitUntil: "load" });
            await navToScene(page, "cube", "Controls", { timeout: 8000 }).catch(
                () => {},
            );
            await page.setViewportSize({ width: VW, height: VH });
            // Let the settle intro land (T.A3 ease-out-back, ~650ms) so the die is
            // at its opening attitude at capture time.
            await page.waitForTimeout(1200);

            const measured = await page.evaluate(() => {
                const cube = document.querySelector(".cube");
                if (!cube) return { error: "no .cube element" };
                // `--side-size` is an UNREGISTERED custom prop → getComputedStyle
                // returns the raw `min(...)` string, not px. The `.cube` LAYOUT box
                // is `width/height: var(--side-size)` (T.A4) and carries no transform
                // of its own (the 3D rotation rides ancestor containers), so its
                // offsetWidth/offsetHeight ARE the resolved side-size in px.
                const side = cube.offsetWidth;
                const faces = [...document.querySelectorAll(".cube-side")].map(
                    (f) => {
                        const r = f.getBoundingClientRect();
                        return { w: r.width, h: r.height };
                    },
                );
                return {
                    side,
                    cube: { w: cube.offsetWidth, h: cube.offsetHeight },
                    faces,
                };
            });

            if (measured.error) {
                fail(`render — ${measured.error} on #/cube`);
                return;
            }
            const { side, cube, faces } = measured;
            if (!(side > 0)) {
                fail(`render — .cube offsetWidth did not resolve to a positive px (got ${side})`);
                return;
            }

            // T.A1 — SILHOUETTE: ≥3 faces each w AND h > 0.25·side.
            const floor = 0.25 * side;
            const solid = faces.filter((f) => f.w > floor && f.h > floor);
            if (solid.length >= 3) {
                ok(
                    `silhouette — ${solid.length}/6 .cube-side faces render with w AND h > ` +
                        `0.25·--side-size (${floor.toFixed(1)}px); the die is 3D, not flattened`,
                );
            } else {
                fail(
                    `silhouette — only ${solid.length}/6 faces exceed 0.25·side (${floor.toFixed(
                        1,
                    )}px); the faces are collapsed onto one plane (the --spin-energy filter ` +
                        `flatten, #1). Face rects: ${JSON.stringify(
                            faces.map((f) => `${f.w.toFixed(0)}×${f.h.toFixed(0)}`),
                        )}`,
                );
            }

            // T.A4 — GEOMETRY: the .cube box is side×side ±1px.
            const dw = Math.abs(cube.w - side);
            const dh = Math.abs(cube.h - side);
            if (dw <= 1 && dh <= 1) {
                ok(
                    `geometry — .cube rect ${cube.w.toFixed(1)}×${cube.h.toFixed(
                        1,
                    )} == --side-size ${side}px ±1px (honest die footprint)`,
                );
            } else {
                fail(
                    `geometry — .cube rect ${cube.w.toFixed(1)}×${cube.h.toFixed(
                        1,
                    )} ≠ --side-size ${side}×${side}px (±1px); the box is mis-sized ` +
                        `(was 0 × 450px: zero-width flex collapse + double height, #T.A4)`,
                );
            }
        },
    );
    if (result && result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:cube-silhouette — FAIL (${failures.length}): the die is flattened / mis-sized, ` +
            `or the --spin-energy bloom survives. Born-RED on the pre-T.A tree; greens when T.A1 ` +
            `deletes the bloom + T.A4 sizes .cube honestly.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:cube-silhouette — PASS: the six-faced die renders in 3D (≥3 solid face rects), " +
        ".cube is side×side, and no --spin-energy bloom survives.",
);
process.exit(0);
