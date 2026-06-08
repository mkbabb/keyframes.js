#!/usr/bin/env node
/**
 * proof:easing-canvas-bounded — H.W4 S1/S2 (WV-W4-MED-2) the easing-canvas
 * ceiling lock.
 *
 * The defect (live, 1440×900, `/#/easing`): the `.easing-curve-canvas` SVG was a
 * 680×680px square eating 77% of an 883px panel, off a `width:100%` + `aspect-
 * ratio:1` SVG in a `max-width:none` card with NO container context anywhere
 * (`container-type: normal` on every ancestor). The fix (S1) makes the editor
 * root a `container-type: inline-size` context and bounds the canvas with
 * `block-size: clamp(160px, 38cqi, 280px); max-block-size: 280px` so the canvas
 * sizes off the CONTAINER inline size, not the viewport; (S2) drops the redundant
 * wash border so ONE surface owns the frame.
 *
 * The born-RED ANCHORS are the two LAYOUT-INVARIANT clauses (WV-W4-MED-2 — the
 * `blockSize<=280` clause is layout-state-dependent: it already reads ≤280 in a
 * narrow-rail render, so it passes VACUOUSLY there and is DEMOTED to a post-fix
 * ceiling). The 680px measurement is pinned to the DEDICATED EasingSidebar
 * FULL-RAIL render at #/easing (where the audit got 724px sidebar → 680px canvas).
 *
 * Four falsifiable BROWSER clauses, each BITING on the exact defect:
 *
 *   1. CONTAINER CONTEXT (born-RED anchor). The editor root `.easing-editor`
 *      resolves `getComputedStyle(root).containerType === 'inline-size'`. BITE:
 *      RED on the pre-W4 tree (the container context does NOT exist — every
 *      ancestor is `normal`); GREEN only once the `.easing-editor` container is
 *      declared. Layout-invariant (no rail-width dependence).
 *
 *   2. PANEL-HEIGHT RATIO ≤ 0.55 (born-RED anchor). On the full-rail render the
 *      canvas height ÷ editor-root height is ≤ 0.55. BITE: RED at 0.77 on the
 *      pre-W4 tree (the 680px canvas in the 883px panel); GREEN once the canvas
 *      is clamped. Layout-invariant relative to the panel (the canvas can no
 *      longer dominate the panel regardless of rail width).
 *
 *   3. SQUARE LAW — computed `aspect-ratio: 1 / 1` (structural invariant, NOT the
 *      rendered box w===h). MEASURE-FIRST note: at the clamp FLOOR the rendered
 *      box is NOT w===h (inline-size 100% of the fixed --rail-width while
 *      block-size clamps to the 160px floor — the explicit block-size legitimately
 *      overrides aspect-ratio), so a rendered-box `width===height` assert would
 *      RED on the correct fix (a false failure). The square LAW the canvas keeps
 *      is the DECLARED `aspect-ratio: 1 / 1` — it renders square whenever the
 *      clamp is not clipping, and keeps the curve undistorted (preserveAspectRatio)
 *      when it is. BITE: drop `aspect-ratio: 1` (let the SVG go rectangular) →
 *      computed aspect-ratio ≠ `1 / 1` → reds.
 *
 *   4. HEADER CLEARANCE ≥ 8px. The full-rail editor's parity header
 *      (`.easing-editor > h2`) bottom → `.easing-curve-canvas-wrapper` top gap is
 *      ≥ 8px (the title does not sit hard against the canvas frame — the
 *      double-chrome/touching-header defect). BITE: collapse the header gap (e.g.
 *      re-stack a bordered wash panel hard under a `pb-1` header) → gap < 8px →
 *      reds.
 *
 *   5. BLOCK-SIZE CEILING ≤ 280px (DEMOTED post-fix ceiling, NOT a born-RED
 *      anchor — WV-W4-MED-2). The computed `block-size` ≤ 280px on the full-rail
 *      render. Kept as the explicit ceiling lock (it was 680px pre-fix on this
 *      exact full-rail render); it is the ceiling the clamp guarantees, asserted
 *      after the two layout-invariant anchors so a narrow-rail vacuous pass cannot
 *      stand in for the born-RED proof.
 *
 * Settle-gated on the H.W1 FSM resting (WV-W4-LOW-1 / HD-W4-6): the D12 route
 * storm makes the EasingSidebar measurement non-deterministic, so #/easing is
 * pinned via an IN-PAGE hash assignment (NOT page.goto), the machine is polled to
 * rest on `easing`, the viewport is re-asserted after navigation, the controls
 * pane is opened on the easing tab, and the gate waits until the `.easing-editor`
 * full-rail root + canvas resolve before measuring.
 *
 * Mirrors scripts/proof-demo-shell-grid.mjs / proof-stage-not-clipped.mjs (the
 * serveDist + Playwright + settle plumbing). Browser-only (the ceiling is a
 * rendered fact — there is no static half); under KF_REQUIRE_BROWSER a
 * playwright-absent skip becomes a hard fail so the canvas ceiling is never
 * green-reported un-exercised. Re-runnable:
 * `node scripts/proof-easing-canvas-bounded.mjs`. Serves the BUILT dist/gh-pages/
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

console.log("proof:easing-canvas-bounded — H.W4 S1/S2 (the easing-canvas ceiling lock)");

const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — ` +
                "the canvas-ceiling clauses cannot pass vacuously",
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

/** Settle on #/easing via an IN-PAGE hash assignment (storage + the H.W1 trap
 *  survive; page.goto clears both). Re-assert the viewport AFTER navigation
 *  (Playwright resets on navigate). Open the controls pane on the easing tab so
 *  the FULL-RAIL EasingSidebar render (the .easing-editor root + canvas) mounts —
 *  the 680px born-RED was on THIS render (WV-W4-MED-2 / HD-W4-3). */
async function settleOnEasing(page, viewportWidth, viewportHeight) {
    await page.evaluate(() => {
        location.hash = "#/easing";
    });
    await page
        .waitForFunction(
            (mk) => {
                try {
                    return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === "easing";
                } catch {
                    return false;
                }
            },
            MACHINE_KEY,
            { timeout: 8000 },
        )
        .catch(() => {});
    await page.setViewportSize({ width: viewportWidth, height: viewportHeight });
    // Force the controls pane OPEN + the easing tab selected (the EasingSidebar is
    // teleported into the easing TabsContent — it mounts only when the pane is open
    // and the easing control is active).
    await page.evaluate((ck) => {
        try {
            const s = JSON.parse(localStorage.getItem(ck) || "{}");
            s.isControlsPanelOpen = true;
            s.selectedControl = "easing";
            localStorage.setItem(ck, JSON.stringify(s));
        } catch {
            /* fall through to the class toggle */
        }
        const el = document.querySelector(".controls-layout");
        if (el) {
            el.classList.add("controls-layout--open");
            el.classList.remove("controls-layout--closed");
        }
    }, CTRL_KEY);
    await page.waitForTimeout(600); // route rested ≥500ms
}

/** Wait until the FULL-RAIL EasingSidebar render is live: the `.easing-editor`
 *  root + the `.easing-curve-canvas` both present, the container context resolved,
 *  and the canvas has real area (not mid-mount 0×0). */
async function waitCanvasMounted(page) {
    return page
        .waitForFunction(
            () => {
                const root = document.querySelector(".easing-editor");
                const canvas = document.querySelector(".easing-curve-canvas");
                if (!root || !canvas) return false;
                const cR = canvas.getBoundingClientRect();
                const rR = root.getBoundingClientRect();
                return cR.width > 0 && cR.height > 0 && rR.height > 0;
            },
            { timeout: 8000 },
        )
        .then(() => true)
        .catch(() => false);
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

    // 1440×900 — the canonical desktop measure (the changes-ledger anchor; the
    // 680×680 / 724×883 / 0.77 born-RED numbers were captured here).
    const VW = 1440;
    const VH = 900;
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage({ viewport: { width: VW, height: VH } });
        await page.goto(`${base}/#/easing`, { waitUntil: "load" });
        await settleOnEasing(page, VW, VH);
        const mounted = await waitCanvasMounted(page);

        if (!mounted) {
            const dbg = await page.evaluate(() => ({
                hasRoot: !!document.querySelector(".easing-editor"),
                hasCanvas: !!document.querySelector(".easing-curve-canvas"),
                paneOpen: !!document.querySelector(".controls-layout--open"),
                hash: location.hash,
            }));
            fail(
                `the full-rail EasingSidebar render never mounted (` +
                    `easing-editor:${dbg.hasRoot}, canvas:${dbg.hasCanvas}, ` +
                    `paneOpen:${dbg.paneOpen}, hash:${dbg.hash}) — the FSM may not have ` +
                    `rested on easing or the controls pane / easing tab did not open`,
            );
        } else {
            const probe = await page.evaluate(() => {
                const root = document.querySelector(".easing-editor");
                const canvas = document.querySelector(".easing-curve-canvas");
                const wrapper = document.querySelector(".easing-curve-canvas-wrapper");
                const header = root.querySelector(":scope > h2");
                const rootCS = getComputedStyle(root);
                const canvasCS = getComputedStyle(canvas);
                const rR = root.getBoundingClientRect();
                const cR = canvas.getBoundingClientRect();
                const wrapR = wrapper ? wrapper.getBoundingClientRect() : null;
                const hdrR = header ? header.getBoundingClientRect() : null;
                return {
                    containerType: rootCS.containerType,
                    panelH: rR.height,
                    canvasW: cR.width,
                    canvasH: cR.height,
                    ratio: cR.height / rR.height,
                    aspectRatio: canvasCS.aspectRatio,
                    blockSizePx: parseFloat(canvasCS.blockSize),
                    headerClearance: hdrR && wrapR ? wrapR.top - hdrR.bottom : null,
                    hasHeader: !!header,
                    hasWrapper: !!wrapper,
                };
            });

            // ── 1. CONTAINER CONTEXT (born-RED anchor) ──────────────────────────
            if (probe.containerType === "inline-size") {
                ok(
                    `container context: the .easing-editor root resolves ` +
                        `container-type: inline-size (was 'normal' — the canvas now sizes ` +
                        `off the CONTAINER inline size, not the viewport)`,
                );
            } else {
                fail(
                    `container context — the .easing-editor root resolves ` +
                        `container-type: '${probe.containerType}' (expected 'inline-size'); ` +
                        `the container context does not exist (born-RED: 'normal' pre-W4) so ` +
                        `the 38cqi block-size never bounds the canvas`,
                );
            }

            // ── 2. PANEL-HEIGHT RATIO ≤ 0.55 (born-RED anchor) ──────────────────
            if (probe.ratio <= 0.55) {
                ok(
                    `panel-height ratio: canvas ÷ panel = ${probe.ratio.toFixed(3)} ≤ 0.55 ` +
                        `(canvas ${Math.round(probe.canvasH)}px in a ${Math.round(probe.panelH)}px ` +
                        `panel — was 0.77 / 680px-in-883px pre-W4)`,
                );
            } else {
                fail(
                    `panel-height ratio — canvas ÷ panel = ${probe.ratio.toFixed(3)} > 0.55 ` +
                        `(canvas ${Math.round(probe.canvasH)}px dominates the ${Math.round(probe.panelH)}px ` +
                        `panel; born-RED 0.77 — the canvas still has no block ceiling)`,
                );
            }

            // ── 3. SQUARE LAW — computed aspect-ratio: 1 / 1 ────────────────────
            // (the structural invariant; NOT the rendered box w===h — at the clamp
            // floor the box is legitimately rectangular, see the header comment.)
            const arNorm = probe.aspectRatio.replace(/\s+/g, " ").trim();
            if (arNorm === "1 / 1" || arNorm === "1") {
                ok(
                    `square law: the canvas computes aspect-ratio: 1 / 1 (the curve stays ` +
                        `undistorted; renders a true square whenever the clamp is not clipping ` +
                        `the block-size to the 160px floor / 280px ceiling)`,
                );
            } else {
                fail(
                    `square law — the canvas computes aspect-ratio: '${probe.aspectRatio}' ` +
                        `(expected '1 / 1'); dropping the square aspect-ratio lets the SVG go ` +
                        `rectangular and distorts the easing curve`,
                );
            }

            // ── 4. HEADER CLEARANCE ≥ 8px ───────────────────────────────────────
            if (!probe.hasHeader || !probe.hasWrapper) {
                fail(
                    `header clearance — the full-rail editor parity header ` +
                        `(.easing-editor > h2: ${probe.hasHeader}) or the canvas wrapper ` +
                        `(.easing-curve-canvas-wrapper: ${probe.hasWrapper}) is absent ` +
                        `(the S2 parity header / the wrapper must both render)`,
                );
            } else if (probe.headerClearance >= 8) {
                ok(
                    `header clearance: the parity header bottom → canvas wrapper top gap is ` +
                        `${probe.headerClearance.toFixed(1)}px ≥ 8px (the title does not sit ` +
                        `hard against the canvas frame)`,
                );
            } else {
                fail(
                    `header clearance — the header → canvas gap is ` +
                        `${probe.headerClearance.toFixed(1)}px < 8px (the title sits hard ` +
                        `against the canvas frame — the touching-header / double-chrome defect)`,
                );
            }

            // ── 5. BLOCK-SIZE CEILING ≤ 280px (DEMOTED post-fix ceiling) ────────
            if (probe.blockSizePx <= 280) {
                ok(
                    `block-size ceiling: the canvas block-size resolves ${Math.round(probe.blockSizePx)}px ≤ 280px ` +
                        `(the clamp(160px,38cqi,280px) ceiling — was 680px pre-W4 on this full-rail render; ` +
                        `DEMOTED to a post-fix ceiling per WV-W4-MED-2, not the born-RED anchor)`,
                );
            } else {
                fail(
                    `block-size ceiling — the canvas block-size resolves ${Math.round(probe.blockSizePx)}px > 280px ` +
                        `(the clamp ceiling is not in effect — born-RED 680px on the full-rail render)`,
                );
            }
        }
        await page.close();
    } finally {
        await browser.close();
        server.close();
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:easing-canvas-bounded — FAIL (${failures.length}): the easing canvas ` +
            `lacks its container ceiling (container context / panel ratio / square law / ` +
            `header clearance / block-size ceiling) — H.W4 S1/S2.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:easing-canvas-bounded — PASS: the .easing-editor is an inline-size container, " +
        "the canvas is ≤0.55 of the panel + ≤280px block-size, the square law (aspect-ratio:1/1) " +
        "holds, and the parity header clears the canvas frame (H.W4 S1/S2).",
);
