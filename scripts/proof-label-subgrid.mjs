#!/usr/bin/env node
/**
 * proof:label-subgrid — H.W11 I1 (S3) the UNIFORM label-column subgrid lock
 * (REFINES W9 F1; born-RED on the W9 per-row `auto` label widths).
 *
 * The defect (live, desktop, the controls sidebar): W9 F1 restored label-LEFT /
 * value-RIGHT rows by giving EACH glass-ui `.labeled-field` its OWN per-row
 * `grid-template-columns: auto 1fr` (`AnimationControlsControls.vue:355-357`,
 * `EasingSidebar.vue:144-146`, `LayerConfigPanel.vue`). Each row therefore derived
 * its OWN `auto` label width → labels are NOT uniform across rows. The user wants
 * ONE uniform label column (one derived width from the widest label, not per-row
 * auto). I1 (S3) promotes the per-row rules to a PARENT `.labeled-field-grid`
 * subgrid (`design-idioms.css §LABEL-subgrid`): the container is a 2-track grid
 * `[label] auto [value] 1fr` and each `.labeled-field` participates via
 * `grid-template-columns: subgrid; grid-column: 1 / -1`, so the `auto` label track
 * is sized ONCE from the widest label and every row's label cell resolves the SAME
 * width by construction. The `SequenceTarget.vue:25-27` `w-20` magic literal dies
 * (folds into the subgrid via Lane A's stage swap / Lane C's row participation).
 *
 * Three falsifiable BROWSER clauses, each BITING on the exact W9 per-row defect
 * (born-RED on `tranche-h-impl` HEAD, GREEN on the I1 subgrid):
 *
 *   1. UNIFORM LABEL WIDTH. Within EACH `.labeled-field-grid` (the consuming row
 *      container), measure every leaf `.labeled-field`'s label cell
 *      (`.labeled-field-label`, glass-ui's `<label>`). ALL labels in a grid resolve
 *      the SAME computed width (max − min ≤ 1px) — uniform, not per-row `auto`.
 *      BITE: RED on the W9 tree (per-row `auto`: e.g. "duration"=86px vs "blend"=43px
 *      derive DIFFERENT widths across rows; with no `.labeled-field-grid` container
 *      at all under W9, NO uniform-track grid is found → the gate reds on the missing
 *      subgrid). GREEN once the parent subgrid sizes the column ONCE.
 *
 *   2. ONE SHARED RIGHT EDGE (the track is shared, not coincidental). Within each
 *      grid, every label's RIGHT edge resolves the SAME x (max − min ≤ 1px) — the
 *      labels are right-aligned to ONE track boundary (the `[value]` line), proving
 *      they share the column, not merely happen to be equal-width. BITE: RED on the
 *      W9 per-row tree (each label's right edge floats at its own `auto` boundary).
 *
 *   3. THE PARENT IS SUBGRID (the mechanism, not a coincidence). Each measured
 *      `.labeled-field` row resolves `grid-template-columns` starting with `subgrid`
 *      AND its `.labeled-field-grid` parent resolves `display: grid` with a 2-track
 *      template. BITE: RED on the W9 tree (the parent `.panel-content` is
 *      `flex flex-col`, NOT a subgrid grid; the rows are independent `auto 1fr`
 *      grids, NOT `subgrid`). GREEN once the idiom lands.
 *
 * NON-VACUITY (the §Mandate bar — the uniform width must be a REAL constraint):
 * the subject grid must carry ≥3 leaf `.labeled-field` rows with DIFFERING label
 * text (so a single-row trivial pass cannot satisfy it — three differing labels
 * forced to ONE width is the real constraint). The canonical `#/cube` main-controls
 * grid carries 5 (duration / delay / iterations / direction / fill mode). A grid
 * with <3 differing-text rows is SKIPPED for the non-vacuity subject set; the gate
 * fails LOUD if NO grid meets the bar.
 *
 * Settle-gated on the H.W1 FSM resting (the same in-page #/cube hash pin + pane-open
 * + viewport-re-assert + [rail]·[stage] grid-resolve plumbing the W3/W9 gates use;
 * page.goto clears storage + the H.W1 reconcile trap). Mirrors
 * scripts/proof-single-column-pack.mjs (the serveDist + Playwright + settle
 * plumbing) — the W9 F1 one-column invariant it asserts STAYS GREEN (the subgrid
 * keeps ONE left edge per row); this gate ADDS the uniform-width clause. Browser-only
 * (a column track is a rendered fact — there is no static half; the idiom-exists
 * source lock is design-idioms.css's `.labeled-field-grid` rule, consumed here at
 * render). Under KF_REQUIRE_BROWSER a playwright-absent skip becomes a hard fail so
 * a SHIP is never green-reported un-exercised. Re-runnable:
 * `node scripts/proof-label-subgrid.mjs`. Serves the BUILT dist/gh-pages/
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

console.log("proof:label-subgrid — H.W11 I1 (the uniform label-column subgrid lock; REFINES W9 F1)");

const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — ` +
                "the uniform-label-width clauses cannot pass vacuously",
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
 *  (Playwright resets on navigate) + force the controls pane OPEN + rest ≥500ms. */
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

/** Wait until the desktop named grid is live (the FSM-rested + desktop + open
 *  witness the sibling W3/W9 gates use). */
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
    const TOL = 1; // sub-pixel rounding tolerance
    const NON_VACUITY_ROWS = 3; // ≥3 DIFFERING-text rows = a real uniform constraint
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage({ viewport: { width: VW, height: VH } });
        await page.goto(`${base}/#/cube`, { waitUntil: "load" });
        await settleOnCube(page, VW, VH);
        await waitGridSettled(page);

        // Measure each VISIBLE `.labeled-field-grid` row container: its display +
        // template, and every leaf `.labeled-field`'s label cell width/right/template.
        const probe = await page.evaluate(() => {
            const grids = [...document.querySelectorAll(".labeled-field-grid")].filter((g) => {
                const r = g.getBoundingClientRect();
                return r.width > 0 && r.height > 0;
            });
            return grids.map((g) => {
                const gcs = getComputedStyle(g);
                const rows = [...g.querySelectorAll(":scope > .labeled-field")].filter((r) => {
                    const rr = r.getBoundingClientRect();
                    return rr.width > 0 && rr.height > 0;
                });
                const labels = rows
                    .map((row) => {
                        const lbl = row.querySelector(".labeled-field-label") || row.querySelector("label");
                        if (!lbl) return null;
                        const lr = lbl.getBoundingClientRect();
                        return {
                            text: (lbl.textContent || "").trim().slice(0, 18),
                            width: +lr.width.toFixed(2),
                            right: +lr.right.toFixed(2),
                            rowTemplate: getComputedStyle(row).gridTemplateColumns,
                        };
                    })
                    .filter(Boolean);
                return {
                    display: gcs.display,
                    gridTemplate: gcs.gridTemplateColumns,
                    rowCount: rows.length,
                    labelCount: labels.length,
                    distinctTexts: [...new Set(labels.map((l) => l.text))].length,
                    labels,
                };
            });
        });

        // Pick the NON-VACUITY subject grids: ≥3 leaf rows with DIFFERING label text.
        const subjects = probe.filter((g) => g.labelCount >= NON_VACUITY_ROWS && g.distinctTexts >= NON_VACUITY_ROWS);
        if (subjects.length === 0) {
            fail(
                `non-vacuity — NO visible .labeled-field-grid carries ≥${NON_VACUITY_ROWS} leaf .labeled-field ` +
                    `rows with differing label text (found ${probe.length} grid(s): ` +
                    probe.map((g) => `${g.labelCount} labels/${g.distinctTexts} distinct`).join(", ") +
                    `). Under the W9 per-row tree NO .labeled-field-grid container exists at all → this ` +
                    `reds (the uniform track is missing); the pane may also be closed or the FSM un-rested. ` +
                    `A vacuous pass is forbidden — the canonical #/cube main-controls grid carries 5 ` +
                    `(duration/delay/iterations/direction/fill mode).`,
            );
        } else {
            for (const g of subjects) {
                const tag = g.labels.map((l) => `"${l.text}"`).slice(0, 5).join(", ");
                const widths = g.labels.map((l) => l.width);
                const rights = g.labels.map((l) => l.right);
                const dW = +(Math.max(...widths) - Math.min(...widths)).toFixed(2);
                const dR = +(Math.max(...rights) - Math.min(...rights)).toFixed(2);

                // 1. UNIFORM LABEL WIDTH — every label the same width (±1px).
                if (dW <= TOL) {
                    ok(
                        `uniform width: ${g.labelCount} labels (${tag}) all resolve ` +
                            `${widths[0]}px (Δ=${dW}px ≤ ${TOL}) — one derived width, not per-row auto`,
                    );
                } else {
                    fail(
                        `uniform width — the ${g.labelCount} labels (${tag}) span ` +
                            `min=${Math.min(...widths)}px max=${Math.max(...widths)}px (Δ=${dW}px, need ≤${TOL}). ` +
                            `Born-RED on the W9 per-row \`auto\` widths (each label its own width); ` +
                            `greens on the .labeled-field-grid subgrid (one column sized from the widest label).`,
                    );
                }

                // 2. ONE SHARED RIGHT EDGE — all labels right-aligned to one track line.
                if (dR <= TOL) {
                    ok(
                        `shared track: all ${g.labelCount} labels right-align to ONE edge ` +
                            `x=${rights[0]} (Δ=${dR}px ≤ ${TOL}) — they share the [value] track line`,
                    );
                } else {
                    fail(
                        `shared track — the ${g.labelCount} label right-edges span ` +
                            `Δ=${dR}px (need ≤${TOL}); the labels float at independent \`auto\` boundaries ` +
                            `(the W9 per-row tree), not one shared subgrid track.`,
                    );
                }

                // 3. THE PARENT IS SUBGRID — the rows resolve `subgrid`, the parent a grid.
                const allSubgrid = g.labels.every((l) => /^subgrid\b/.test(l.rowTemplate));
                const parentIsGrid = g.display === "grid";
                if (allSubgrid && parentIsGrid) {
                    ok(
                        `subgrid mechanism: the parent is display:grid and all ${g.labelCount} rows ` +
                            `resolve grid-template-columns: subgrid — the uniform width is structural, ` +
                            `not coincidental`,
                    );
                } else {
                    fail(
                        `subgrid mechanism — parent display='${g.display}' (need 'grid'), ` +
                            `rows-subgrid=${allSubgrid} (need all). Born-RED on the W9 tree (the parent ` +
                            `is flex flex-col, the rows are independent \`auto 1fr\` grids, NOT subgrid); ` +
                            `greens on the design-idioms.css §LABEL-subgrid idiom.`,
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
        `\nproof:label-subgrid — FAIL (${failures.length}): the panel label column is NOT ` +
            `uniform across rows (the W9 per-row \`auto\` widths — H.W11 I1 promotes them to a ` +
            `parent subgrid so the column is sized ONCE).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:label-subgrid — PASS: within each labeled panel every leaf-row label cell resolves " +
        "the SAME width AND right-aligns to ONE shared track via CSS subgrid (the uniform label " +
        "column — H.W11 I1; the W9 F1 one-column invariant stays GREEN).",
);
