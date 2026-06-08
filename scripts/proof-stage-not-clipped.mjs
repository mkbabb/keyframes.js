#!/usr/bin/env node
/**
 * proof:stage-not-clipped — H.W3 S4 (WV-W3-HIGH-3) the MEASURE-FIRST stage guard.
 *
 * S4 collapses the 3-track grid to the named `rail·stage·rail` frame, giving the
 * stage its OWN [stage] track and DELETING the `col-start-1 col-end-4` full-grid
 * span (the toll the old centred-stage-with-overlaid-rail paid). The risk S4
 * guards against is the B.W3 "cube half-clipped" invariant — the stage must stay
 * fully on-screen in every pane state at every desktop width. This gate is what
 * lets S4 ship the stronger [stage]-track form safely: if the [stage] form clips,
 * the conservative `col-end-4`-keep span (col-start: rail / col-end: -1) is the
 * documented FALLBACK (WV-W3-HIGH-3) and this gate is how that decision is made.
 *
 * One falsifiable BROWSER clause, BITING on the exact clip:
 *
 *   STAGE WITHIN VIEWPORT. At 1280 AND 1440 (the canonical desktop widths), pane
 *   OPEN AND CLOSED (4 cases), the stage subject's bounding box is FULLY within
 *   the viewport: left ≥ 0, right ≤ innerWidth, top ≥ 0, bottom ≤ innerHeight
 *   (each with a 1px tolerance for sub-pixel rounding). The subject is the named
 *   [stage] grid cell `.stage-cell` (the cell that holds the rendered scene
 *   subject). A NON-VACUITY guard requires the stage to have real area
 *   (width·height > 0) so a missing/zero-size cell cannot pass GREEN.
 *
 *   BITE: revert S4 to a stage span that pushes the subject off-screen (e.g. a
 *   fixed-width rail overlay that shifts the centred stage so its far edge exceeds
 *   innerWidth) → right > innerWidth → reds. If the [stage]-track form itself
 *   clips at 1280/1440, this gate reds RED-TODAY and the col-end-4 fallback is the
 *   prescribed fix (WV-W3-HIGH-3).
 *
 * Settle-gated on the H.W1 FSM resting (WV-W3-MED-3): viewport RE-ASSERTED after
 * navigation (Playwright resets on navigate), pane OPEN/CLOSED set explicitly,
 * scene PINNED to #/cube via an IN-PAGE hash assignment (NOT page.goto — goto
 * clears storage + kills the H.W1 reconcile trap), route rested ≥500ms, the grid
 * settled to the --rail-width form before measuring. Cross-ref H.W1's
 * proof:no-route-storm as the flake-defeat.
 *
 * Mirrors scripts/proof-demo-shell-grid.mjs (the serveDist + Playwright + settle
 * plumbing). Browser-only (a clip is a rendered fact — there is no static half);
 * under KF_REQUIRE_BROWSER a playwright-absent skip becomes a hard fail so a SHIP
 * is never green-reported un-exercised. Re-runnable:
 * `node scripts/proof-stage-not-clipped.mjs`. Serves the BUILT dist/gh-pages/
 * (run `npm run gh-pages` first).
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log("proof:stage-not-clipped — H.W3 S4 (the cube-half-clipped invariant guard)");

const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — ` +
                "the stage-within-viewport assertion cannot pass vacuously",
        );
    } else {
        console.log(`  ○ browser half skipped — ${reason}`);
    }
};

const MIME = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".ttf": "font/ttf",
    ".woff2": "font/woff2",
    ".svg": "image/svg+xml",
};
const MACHINE_KEY = "keyframes-js-scene-machine"; // SCENE_MACHINE_PERSIST_KEY
const CTRL_KEY = "animation-groups-control-options-store";

function serveDist() {
    const server = http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
            res.writeHead(404).end();
            return;
        }
        res.writeHead(200, {
            "content-type": MIME[path.extname(p)] ?? "application/octet-stream",
        });
        fs.createReadStream(p).pipe(res);
    });
    return server;
}

/** Settle on #/cube via an in-page hash assignment (storage + the H.W1 trap
 *  survive; goto would clear both). Re-assert the test viewport AFTER navigation
 *  (Playwright resets on navigate) + rest ≥500ms (WV-W3-MED-3). */
async function settleOnCube(page, viewportWidth, viewportHeight) {
    await page.evaluate(() => {
        location.hash = "#/cube";
    });
    await page
        .waitForFunction(
            (mk) => {
                try {
                    return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === "cube";
                } catch {
                    return false;
                }
            },
            MACHINE_KEY,
            { timeout: 8000 },
        )
        .catch(() => {});
    await page.setViewportSize({ width: viewportWidth, height: viewportHeight });
    await page.waitForTimeout(600);
}

/** Set the pane open/closed: persist the control store flag + toggle the live
 *  layout state class (the SSOT for the [rail]-track collapse). */
async function setPane(page, open) {
    await page.evaluate(
        ([ck, wantOpen]) => {
            try {
                const s = JSON.parse(localStorage.getItem(ck) || "{}");
                s.isControlsPanelOpen = wantOpen;
                localStorage.setItem(ck, JSON.stringify(s));
            } catch {
                /* fall through to the class toggle */
            }
            const el = document.querySelector(".controls-layout");
            if (el) {
                el.classList.toggle("controls-layout--open", wantOpen);
                el.classList.toggle("controls-layout--closed", !wantOpen);
            }
        },
        [CTRL_KEY, open],
    );
    // Let the grid-template-columns transition (the [rail] track collapse/expand)
    // settle before measuring the reflowed stage.
    await page.waitForTimeout(900);
}

/** Wait until the desktop named grid is live (the [rail] line names + the first
 *  track resolves to --rail-width when open) so the measure is not mid-bind. */
async function waitGridSettled(page) {
    await page
        .waitForFunction(
            () => {
                const el = document.querySelector(".controls-layout");
                if (!el) return false;
                const cols = getComputedStyle(el).gridTemplateColumns;
                return /\[rail\]/.test(cols) && /\[stage\]/.test(cols);
            },
            { timeout: 8000 },
        )
        .catch(() => {});
}

async function browserHalf() {
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        skipOrFail("dist/gh-pages not built (run `npm run gh-pages` first)");
        return;
    }
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
            skipOrFail("playwright not resolvable (set KF_PLAYWRIGHT_DIR or install @playwright/test)");
            return;
        }
    }

    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;

    const TOL = 1; // sub-pixel rounding tolerance
    const browser = await chromium.launch();
    try {
        for (const W of [1280, 1440]) {
            const H = 900;
            const page = await browser.newPage({ viewport: { width: W, height: H } });
            await page.goto(`${base}/#/cube`, { waitUntil: "load" });
            await settleOnCube(page, W, H);
            await waitGridSettled(page);

            for (const open of [true, false]) {
                await setPane(page, open);
                const probe = await page.evaluate(() => {
                    const stage = document.querySelector(".stage-cell");
                    if (!stage) return { found: false };
                    const r = stage.getBoundingClientRect();
                    return {
                        found: true,
                        left: r.left,
                        right: r.right,
                        top: r.top,
                        bottom: r.bottom,
                        width: r.width,
                        height: r.height,
                        vw: window.innerWidth,
                        vh: window.innerHeight,
                    };
                });

                const label = `${W}×${H} pane ${open ? "OPEN" : "CLOSED"}`;
                if (!probe.found) {
                    fail(`${label} — the [stage] cell (.stage-cell) was not found (the named stage track is absent)`);
                    continue;
                }
                // NON-VACUITY: the stage must have real area (a zero-size cell
                // would trivially satisfy the within-viewport bounds).
                if (!(probe.width > 0 && probe.height > 0)) {
                    fail(
                        `${label} — the stage has zero area (w:${Math.round(probe.width)} ` +
                            `h:${Math.round(probe.height)}); a vacuous pass is forbidden`,
                    );
                    continue;
                }
                const within =
                    probe.left >= -TOL &&
                    probe.right <= probe.vw + TOL &&
                    probe.top >= -TOL &&
                    probe.bottom <= probe.vh + TOL;
                if (within) {
                    ok(
                        `${label} — stage fully within viewport ` +
                            `(x:[${Math.round(probe.left)},${Math.round(probe.right)}]⊂[0,${probe.vw}], ` +
                            `y:[${Math.round(probe.top)},${Math.round(probe.bottom)}]⊂[0,${probe.vh}], ` +
                            `w:${Math.round(probe.width)})`,
                    );
                } else {
                    fail(
                        `${label} — the stage subject is CLIPPED ` +
                            `(x:[${Math.round(probe.left)},${Math.round(probe.right)}] vs [0,${probe.vw}], ` +
                            `y:[${Math.round(probe.top)},${Math.round(probe.bottom)}] vs [0,${probe.vh}]). ` +
                            `The B.W3 cube-half-clipped invariant is broken — adopt the col-end-4 ` +
                            `conservative span fallback (WV-W3-HIGH-3) if the [stage]-track form clips.`,
                    );
                }
            }
            await page.close();
        }
    } finally {
        await browser.close();
        server.close();
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:stage-not-clipped — FAIL (${failures.length}): the stage subject is ` +
            `clipped in some desktop width / pane state (the B.W3 cube-half-clipped invariant — H.W3 S4).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:stage-not-clipped — PASS: the stage subject is fully on-screen at 1280 & 1440, " +
        "pane open & closed — the [stage]-track form is un-clipped (S4 ships without the col-end-4 fallback).",
);
