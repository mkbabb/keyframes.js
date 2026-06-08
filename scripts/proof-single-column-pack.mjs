#!/usr/bin/env node
/**
 * proof:single-column-pack — H.W3 §Hard gate (WV-W3-MED-2) the column-count +
 * mis-size lock + H.W9 F1 AMEND (the intra-row label-left/value-right clause).
 *
 * The D1 defect (`a-controls-sidebar`): the sidebar was a `grid-cols-[auto_1fr]`
 * two-track grid threaded through a nested `grid-cols-[subgrid]` panel chain, so
 * glass-ui's single-cell `LabeledField` units auto-flowed TWO-per-row in two
 * lopsided columns — left-edge set `{76, 300}` (size 2), width set `{212, 466}`
 * (Δ=254). H.W3.S1 collapses the two-track grid + subgrid chain + col-span-2
 * markers to a single-column stacked-field flow (`flex flex-col gap-2`); every
 * `LabeledField` then shares ONE left edge and ONE width.
 *
 * Three falsifiable BROWSER clauses, BITING on the exact mis-pack (WV-W3-MED-2)
 * AND the H.W9 F1 label-ABOVE stack:
 *
 *   LEAF-ROW SINGLE COLUMN (a)/(b). Measure the LEAF rows `.controls-content
 *   .labeled-field` (NOT `CardContent.children` — that has ONE `panel-stack`
 *   child → set-size 1 = born-GREEN vacuous; the two columns lived at the LEAF
 *   `.labeled-field` level through the subgrid chain). PIN `#/cube` (easing has 0
 *   fields → the gate would red VACUOUSLY on a field-less scene). Filter to the
 *   VISIBLE rows (the inactive crossfade panels are `0fr`-collapsed → width 0;
 *   including them yields a spurious `{x, 0}` width set — the active column is the
 *   subject). Assert ALL visible leaf rows share ONE left-edge `x`
 *   (`new Set(rows.map(r => round(r.x))).size === 1`) AND every row width is within
 *   ±2px (`max(w) − min(w) <= 2`). A `fieldCount >= 6` NON-VACUITY guard (over the
 *   VISIBLE set) requires a real field-bearing render so a field-less / collapsed
 *   scene cannot pass GREEN.
 *
 *   BITE: reds on the pre-W3 tree — the visible left-edge set is `{76, 300}`
 *   (size 2) and the width set is `{212, 466}` (Δ=254). Greens ONLY after the
 *   two-track grid collapses to a single-column stacked flow. Catches any
 *   regression to `auto`/`1fr` or a re-split row (S2's easing/z-index folds).
 *
 *   LABEL-LEFT/VALUE-RIGHT (c) — H.W9 F1 AMEND (born-RED on the W3 label-ABOVE
 *   stack). For EACH visible leaf row, `labelRect.right ≤ controlRect.left` —
 *   the label sits LEFT of the value (the intra-row `[auto_1fr]` split F1
 *   restores via the `AssetPropertiesPanel.vue:6` row idiom). This is ORTHOGONAL
 *   to (a)/(b): the split lives INSIDE each row, so the ROW box keeps ONE left
 *   edge + ONE width (the one-column-pack invariant STAYS true). BITE: reds on
 *   the W3 `flex flex-col` label-over-value stack (the full-width label's right
 *   edge overruns the control's left); greens on the intra-row grid. Re-uses the
 *   `fieldCount >= 6` non-vacuity bar over the rows that expose BOTH a label and
 *   a control — a field-less / missing-child render cannot pass GREEN.
 *
 * Settle-gated on the H.W1 FSM resting (WV-W3-MED-3): viewport ≥1024 RE-ASSERTED
 * after navigation (Playwright resets on navigate), pane OPEN, scene PINNED to
 * #/cube via an IN-PAGE hash assignment (NOT page.goto — goto clears storage +
 * kills the H.W1 reconcile trap), route rested ≥500ms, the named [rail] grid
 * resolved before measuring. Cross-ref H.W1's proof:no-route-storm as the
 * flake-defeat (D12 churn cannot flap the measurement once the grid resolves).
 *
 * Mirrors scripts/proof-stage-not-clipped.mjs / proof-demo-shell-grid.mjs (the
 * serveDist + Playwright + settle plumbing). Browser-only (the column pack is a
 * rendered fact — there is no static half; the source-shape no-subgrid lock is
 * proof:demo-shell-grid's grep). Under KF_REQUIRE_BROWSER a playwright-absent skip
 * becomes a hard fail so a SHIP is never green-reported un-exercised. Re-runnable:
 * `node scripts/proof-single-column-pack.mjs`. Serves the BUILT dist/gh-pages/
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

console.log(
    "proof:single-column-pack — H.W3 (leaf-row single-column + mis-size lock) + H.W9 F1 (label-left/value-right)",
);

const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — ` +
                "the single-column leaf-row assertion cannot pass vacuously",
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

/** Force the controls pane OPEN (the fields only render in the open pane). */
async function openPane(page) {
    await page.evaluate((ck) => {
        try {
            const s = JSON.parse(localStorage.getItem(ck) || "{}");
            s.isControlsPanelOpen = true;
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
    await page.waitForTimeout(600);
}

/** Wait until the desktop named grid is live (the settle predicate — the same
 *  FSM-rested + desktop + open witness the sibling W3 gates use). */
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

    const VW = 1440;
    const VH = 900;
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage({ viewport: { width: VW, height: VH } });
        await page.goto(`${base}/#/cube`, { waitUntil: "load" });
        await settleOnCube(page, VW, VH);
        await openPane(page);
        await waitGridSettled(page);

        // Measure the LEAF rows `.controls-content .labeled-field`. Filter to the
        // VISIBLE, real-area rows (inactive crossfade panels are 0fr-collapsed →
        // width 0; the active column is the subject — WV-W3-MED-2 / impl-w3-impl).
        const probe = await page.evaluate(() => {
            const all = [...document.querySelectorAll(".controls-content .labeled-field")];
            const visibleEls = all.filter((el) => {
                const r = el.getBoundingClientRect();
                return r.width > 0 && r.height > 0;
            });
            const visible = visibleEls.map((el) => el.getBoundingClientRect());
            const xs = visible.map((r) => Math.round(r.x));
            const ws = visible.map((r) => +r.width.toFixed(2));

            // F1 (H.W9 AMEND): per visible leaf row, measure label-RIGHT vs
            // control-LEFT. The `.labeled-field` is the ROW; its children are
            // label → control → (.labeled-field-error). The label-left/value-right
            // intra-row split (the AssetPropertiesPanel idiom F1 restores) makes
            // labelRect.right ≤ controlRect.left; the pre-F1 label-ABOVE stack
            // makes the full-width label.right > the control.left.
            const rowGeom = visibleEls.map((row) => {
                const label = row.querySelector("label");
                const control = [...row.children].find(
                    (k) =>
                        k.tagName !== "LABEL" &&
                        !k.classList.contains("labeled-field-error") &&
                        k.getBoundingClientRect().width > 0,
                );
                if (!label || !control) return { measurable: false };
                const lr = label.getBoundingClientRect();
                const cr = control.getBoundingClientRect();
                return {
                    measurable: true,
                    labelText: (label.textContent || "").trim().slice(0, 16),
                    labelRight: +lr.right.toFixed(1),
                    controlLeft: +cr.left.toFixed(1),
                    leftOf: lr.right <= cr.left,
                };
            });

            return {
                totalCount: all.length,
                visibleCount: visible.length,
                leftEdges: [...new Set(xs)].sort((a, b) => a - b),
                minW: ws.length ? Math.min(...ws) : null,
                maxW: ws.length ? Math.max(...ws) : null,
                rowGeom,
            };
        });

        // NON-VACUITY: a real field-bearing render (≥6 visible leaf rows). #/cube
        // exposes duration/delay/iterations/direction/fill/blend/z-index/enabled.
        if (probe.visibleCount < 6) {
            fail(
                `non-vacuity — only ${probe.visibleCount} visible .controls-content .labeled-field ` +
                    `rows on #/cube (need ≥6; ${probe.totalCount} total). The pane may be closed, the ` +
                    `FSM un-rested, or the scene field-less — a vacuous pass is forbidden.`,
            );
        } else {
            // (a) ONE left edge — every leaf row starts at the same x (single column).
            if (probe.leftEdges.length === 1) {
                ok(
                    `single column: ${probe.visibleCount} visible leaf rows share ONE left edge ` +
                        `x=${probe.leftEdges[0]} (was {76, 300}, size 2 — the two-track grid is gone)`,
                );
            } else {
                fail(
                    `single column — the ${probe.visibleCount} visible leaf rows occupy ` +
                        `${probe.leftEdges.length} left edges {${probe.leftEdges.join(", ")}} (need exactly 1). ` +
                        `Born-RED on the pre-W3 tree ({76, 300}); reds if a row re-splits or the ` +
                        `grid regresses to auto/1fr (S1/S2).`,
                );
            }

            // (b) ONE width — every leaf row is the same width (±2px).
            const dW = probe.maxW != null ? +(probe.maxW - probe.minW).toFixed(2) : null;
            if (dW != null && dW <= 2) {
                ok(
                    `one width: every visible leaf row is within ±2px ` +
                        `(min=${probe.minW}px, max=${probe.maxW}px, Δ=${dW}px — was Δ=254px {212, 466})`,
                );
            } else {
                fail(
                    `one width — the visible leaf rows span min=${probe.minW}px max=${probe.maxW}px ` +
                        `(Δ=${dW}px, need ≤2px). Born-RED on the pre-W3 tree (Δ=254px); reds if a row ` +
                        `lands in the narrow auto column or a wide 1fr column (S1/S2).`,
                );
            }

            // (c) LABEL-LEFT / VALUE-RIGHT (H.W9 F1 AMEND, born-RED on the W3
            // label-ABOVE stack). For EACH visible leaf row, the label's right
            // edge is ≤ the control's left edge — the intra-row [auto_1fr] split
            // F1 restores (the AssetPropertiesPanel.vue:6 row idiom). This does
            // NOT relax (a)/(b): the ROW box still has ONE left edge and ONE
            // width — the split lives INSIDE each row. Re-uses the same
            // `fieldCount >= 6` non-vacuity bar over the MEASURABLE rows so a
            // field-less / label-or-control-missing render cannot pass GREEN.
            const measurable = probe.rowGeom.filter((g) => g.measurable);
            if (measurable.length < 6) {
                fail(
                    `label-left non-vacuity — only ${measurable.length} visible leaf rows expose BOTH ` +
                        `a <label> and a control (need ≥6; ${probe.visibleCount} visible rows). A row ` +
                        `whose label/control cannot be measured cannot witness the intra-row split — ` +
                        `a vacuous pass is forbidden (re-uses the H.W3 fieldCount≥6 bar).`,
                );
            } else {
                const violators = measurable.filter((g) => !g.leftOf);
                if (violators.length === 0) {
                    ok(
                        `label-left/value-right: all ${measurable.length} visible leaf rows place the ` +
                            `label LEFT of the control (labelRect.right ≤ controlRect.left) — the ` +
                            `intra-row [auto_1fr] split (F1); born-RED on the W3 label-ABOVE stack ` +
                            `(label.right > control.left)`,
                    );
                } else {
                    fail(
                        `label-left/value-right — ${violators.length} of ${measurable.length} visible leaf ` +
                            `rows STACK the label above the control (labelRect.right > controlRect.left): ` +
                            violators
                                .slice(0, 4)
                                .map(
                                    (g) =>
                                        `"${g.labelText}" (label.right=${g.labelRight} > control.left=${g.controlLeft})`,
                                )
                                .join(", ") +
                            `. Born-RED on the W3 label-ABOVE flex-col stack; greens on the intra-row ` +
                            `[auto_1fr] split (F1 — the AssetPropertiesPanel row idiom).`,
                    );
                }
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
        `\nproof:single-column-pack — FAIL (${failures.length}): the controls sidebar does not ` +
            `pack into ONE column with ONE width (the D1 two-column mis-pack — H.W3 S1/S2).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:single-column-pack — PASS: every leaf field row shares one left edge and one width " +
        "(the two-track grid + subgrid chain collapsed to a single-column stacked flow — H.W3) " +
        "AND places the label LEFT of the value via the intra-row [auto_1fr] split (H.W9 F1).",
);
