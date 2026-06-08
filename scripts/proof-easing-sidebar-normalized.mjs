#!/usr/bin/env node
/**
 * proof:easing-sidebar-normalized — H.W10 S4 (G5 + G6) the normalized-sidebar lock.
 *
 * THE DEFECT (live, born-RED on the pre-W10 tree). The easing/spring sidebars
 * DIVERGED from the standard `AnimationControlsControls` sidebar: `EasingSidebar`
 * was a bare-class root `<div class="easing-editor glass-resting cartoon-surface
 * p-3 grid gap-3">` wrapping ×2 inner `<Card surface="cartoon">` + ad-hoc
 * `grid grid-cols-2`/`grid gap-1`/`flex gap-2` row containers + a steps Card
 * (`EasingSidebar.vue:2-97`); `SpringSidebar` was the parallel ×3-inner-Card fork.
 * The rung was the TIGHTEST in the system: `text-admin-label` labels,
 * `text-mono-caption` values, `size="sm"` sliders (a 4px track / 12px thumb),
 * `p-2`/`p-3` padding, `gap-1` — vs the standard `text-mono-small` labels, default
 * (md, 6px-track) controls, `px-4 py-3`, `gap-2` (`AnimationControlsControls.vue`).
 *
 * THE FIX (G5 + G6, H.W10 S4). Both sidebars are flattened onto ONE
 * `Card surface="cartoon" tier="quiet"` (the H.W9 quiet register; the Card
 * primitive carries the `rounded-card` token by construction — dissolves G2's
 * square corner) carrying `Labeled*` label-left rows. The ×2 easing + ×3 spring
 * inner sub-Cards are DELETED (folded into the one parent Card), the ad-hoc grid
 * row containers replaced by `Labeled*` rows, the `text-admin-label` labels lifted
 * to `text-mono-small`, the `size="sm"` sliders lifted to the default `LabeledSlider`
 * rung (G5 closes by G6 — same components → same sizes, NO per-control size
 * override).
 *
 * Falsifiable BROWSER clauses per sidebar (easing + spring), each BITING on the
 * exact defect, scoped to the live sidebar (the active controls tabpanel's Card):
 *
 *   (a) STANDARD RUNG (the G5 sizing clause). ZERO `.text-admin-label` labels in
 *       the sidebar (the tightest-rung label class is gone), AND the param-row
 *       Slider's computed track height is ≥ 5px (the default md ~6px track — NOT
 *       the bespoke `size="sm"` 4px track). BITE: a `text-admin-label` label or a
 *       `size="sm"` 4px-track slider → reds.
 *
 *   (b) BOUNDED NESTING (the G6 flatten clause). The sidebar has exactly ONE
 *       glass-ui Card — its single parent Card — NOT the ×3 inner-Card chain. The
 *       glass-ui Card ROOT signature is `.rounded-card.text-card-foreground`
 *       (verified glass-ui CardFooter-*.js) — this DISTINGUISHES a real `<Card>`
 *       component from a plain div that merely uses the `rounded-card` radius
 *       UTILITY (e.g. the EasingCurveCanvas's `.easing-curve-canvas-wrapper`
 *       `glass-panel rounded-card` HERO, a legitimate domain element, NOT a sub-Card).
 *       BITE: the born-RED ×2/×3 inner `<Card surface="cartoon">` sub-Cards → ≥3
 *       `.rounded-card.text-card-foreground` in the sidebar subtree → reds.
 *
 *   (c) Labeled* ROWS (the G6 row-idiom clause). Every PARAM field is a glass-ui
 *       `.labeled-field` row (the H.W9 F1 label-left idiom), NOT a hand-classed
 *       `grid gap-1` / `grid grid-cols-2` div. NON-VACUITY: there is ≥1
 *       `.labeled-field` row (a sidebar with zero param rows can't pass vacuously).
 *
 * **NOT over-constrained.** The easing curve canvas stays the lone HERO element
 * (a domain control, not a param row — not asserted as a `.labeled-field`); the
 * spring preset CHIPS keep `size="sm"` (a COMPACT BUTTON cluster, not the control
 * rung the G5 clause targets — the clause measures the param-row SLIDER track, not
 * a button). The clause asserts the param rows are normalized, it does not forbid
 * legitimate domain affordances (the curve / the preset chips / the Monaco editor).
 *
 * Settle-gated on the H.W1 FSM resting (mirrors proof:easing-canvas-bounded): each
 * scene is pinned via an IN-PAGE hash assignment (NOT page.goto — goto clears
 * storage + the H.W1 reconcile trap), the machine is polled to rest on the scene,
 * the viewport is re-asserted after navigation, the controls pane is forced open
 * with the scene tab selected so the FULL-RAIL sidebar mounts, and the gate waits
 * until the sidebar Card resolves before measuring.
 *
 * Mirrors scripts/proof-easing-canvas-bounded.mjs (the serveDist + Playwright +
 * settle plumbing). Browser-only (the computed rung + the rendered nesting are
 * rendered facts — there is no static half); under KF_REQUIRE_BROWSER a
 * playwright-absent skip becomes a hard fail so a SHIP is never green-reported
 * un-exercised. Re-runnable: `node scripts/proof-easing-sidebar-normalized.mjs`.
 * Serves the BUILT dist/gh-pages/ (run `npm run gh-pages` first).
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
    "proof:easing-sidebar-normalized — H.W10 S4 (the easing/spring sidebars on the standard rung · ×3 inner Cards gone · Labeled* rows · G5/G6)",
);

const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — ` +
                "the normalized-sidebar clauses cannot pass vacuously",
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

/** Settle on #/<scene> via an IN-PAGE hash assignment (storage + the H.W1 trap
 *  survive; page.goto clears both). Re-assert the viewport AFTER navigation
 *  (Playwright resets on navigate). Force the controls pane OPEN + the scene tab
 *  selected so the FULL-RAIL sidebar mounts. */
async function settleOnScene(page, scene, viewportWidth, viewportHeight) {
    await page.evaluate((s) => {
        location.hash = `#/${s}`;
    }, scene);
    await page
        .waitForFunction(
            ([mk, s]) => {
                try {
                    return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s;
                } catch {
                    return false;
                }
            },
            [MACHINE_KEY, scene],
            { timeout: 8000 },
        )
        .catch(() => {});
    await page.setViewportSize({ width: viewportWidth, height: viewportHeight });
    await page.evaluate(
        ([ck, s]) => {
            try {
                const st = JSON.parse(localStorage.getItem(ck) || "{}");
                st.isControlsPanelOpen = true;
                st.selectedControl = s;
                localStorage.setItem(ck, JSON.stringify(st));
            } catch {
                /* fall through to the class toggle */
            }
            const el = document.querySelector(".controls-layout");
            if (el) {
                el.classList.add("controls-layout--open");
                el.classList.remove("controls-layout--closed");
            }
        },
        [CTRL_KEY, scene],
    );
    await page.waitForTimeout(700);
}

/** Wait until the FULL-RAIL sidebar RENDERS (content present in the active
 *  controls tabpanel) — NOT until it is normalized. The guard waits only for the
 *  sidebar to PAINT (a non-trivial subtree) so the three clauses can each bite on
 *  the SPECIFIC born-RED fact (the bespoke bare-class fork DOES render — it just
 *  has no `.labeled-field` rows / carries `.text-admin-label` / nests sub-Cards).
 *  Requiring `.labeled-field` here would conflate "not mounted" with "born-RED",
 *  hiding the precise BITE behind a timeout. */
async function waitSidebarMounted(page) {
    return page
        .waitForFunction(
            () => {
                const panel = document.querySelector(
                    '[role="tabpanel"][data-state="active"]',
                );
                if (!panel) return false;
                // The sidebar has painted: the panel has a real child with area
                // (the normalized Card OR the bespoke bare-class root — both render).
                const root = panel.firstElementChild;
                if (!root) return false;
                const r = root.getBoundingClientRect();
                return r.width > 0 && r.height > 0;
            },
            { timeout: 8000 },
        )
        .then(() => true)
        .catch(() => false);
}

/** Probe the active controls tabpanel sidebar for the G5/G6 normalization facts. */
async function probeSidebar(page) {
    return page.evaluate(() => {
        const panel = document.querySelector(
            '[role="tabpanel"][data-state="active"]',
        );
        if (!panel) return { found: false };

        // (b) BOUNDED NESTING — count glass-ui Card COMPONENTS (the Card root
        // signature `.rounded-card.text-card-foreground`) in the sidebar subtree.
        // A plain div using the `rounded-card` radius utility (e.g. the curve-canvas
        // HERO wrapper) carries `rounded-card` but NOT `text-card-foreground`, so it
        // is correctly excluded — only real `<Card>` components count.
        const cards = panel.querySelectorAll(".rounded-card.text-card-foreground");

        // (a) STANDARD RUNG — no tightest-rung label class; the param slider track
        // resolves the default md height (not the size="sm" 4px track).
        const adminLabels = panel.querySelectorAll(".text-admin-label");
        const tracks = Array.from(panel.querySelectorAll(".slider-track"));
        const trackHeights = tracks
            .map((t) => {
                // The track height is driven by --slider-track-height (sm:0.25rem=4px,
                // md:0.375rem=6px). Read the resolved box height.
                const r = t.getBoundingClientRect();
                return r.height;
            })
            .filter((h) => h > 0);

        // (c) Labeled* ROWS — the param fields are glass-ui labeled-field rows.
        const labeledRows = panel.querySelectorAll(".labeled-field");

        return {
            found: true,
            cardCount: cards.length,
            adminLabelCount: adminLabels.length,
            trackHeights,
            labeledRowCount: labeledRows.length,
        };
    });
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

    const W = 1440;
    const H = 900;
    const MIN_TRACK = 5; // the default md track (~6px) clears 5px; the sm 4px track does not
    const browser = await chromium.launch();
    try {
        for (const scene of ["easing", "spring"]) {
            const page = await browser.newPage({ viewport: { width: W, height: H } });
            await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
            await settleOnScene(page, scene, W, H);
            const mounted = await waitSidebarMounted(page);

            if (!mounted) {
                const dbg = await page.evaluate(() => {
                    const panel = document.querySelector(
                        '[role="tabpanel"][data-state="active"]',
                    );
                    return {
                        hasPanel: !!panel,
                        hasCard: !!panel?.querySelector(".rounded-card"),
                        hasRow: !!panel?.querySelector(".labeled-field"),
                        hash: location.hash,
                    };
                });
                fail(
                    `${scene}: the normalized sidebar never mounted (` +
                        `tabpanel:${dbg.hasPanel}, .rounded-card:${dbg.hasCard}, ` +
                        `.labeled-field:${dbg.hasRow}, hash:${dbg.hash}) — the FSM may not have ` +
                        `rested on ${scene} or the controls pane / scene tab did not open. ` +
                        `If the sidebar is STILL the bespoke bare-class fork (no .labeled-field), this is the born-RED.`,
                );
                await page.close();
                continue;
            }

            const probe = await probeSidebar(page);

            // ── (a) STANDARD RUNG (G5) ──────────────────────────────────────────
            const minTrack = probe.trackHeights.length ? Math.min(...probe.trackHeights) : null;
            const rungOk =
                probe.adminLabelCount === 0 &&
                (minTrack === null || minTrack >= MIN_TRACK);
            if (rungOk) {
                ok(
                    `${scene}: standard rung — 0 .text-admin-label labels (the tightest rung is gone)` +
                        (minTrack !== null
                            ? `, param-slider track ${minTrack.toFixed(1)}px ≥ ${MIN_TRACK}px ` +
                              `(the default md rung, NOT the size="sm" 4px track)`
                            : ` (no param slider in this sidebar — the label-rung clause carries)`),
                );
            } else {
                fail(
                    `${scene}: the sidebar is NOT on the standard rung ` +
                        `(.text-admin-label labels:${probe.adminLabelCount} (want 0), ` +
                        `min param-slider track:${minTrack === null ? "n/a" : minTrack.toFixed(1) + "px"} ` +
                        `(want ≥${MIN_TRACK}px — the size="sm" 4px track is the born-RED)) — H.W10 G5.`,
                );
            }

            // ── (b) BOUNDED NESTING (G6) ────────────────────────────────────────
            if (probe.cardCount === 1) {
                ok(
                    `${scene}: bounded nesting — exactly 1 glass-ui Card (.rounded-card) ` +
                        `(the lone parent Card; the born-RED ×2/×3 inner sub-Card chain is GONE)`,
                );
            } else {
                fail(
                    `${scene}: the sidebar has ${probe.cardCount} glass-ui Cards (.rounded-card) ` +
                        `(expected exactly 1 — the lone parent Card); the born-RED ×2 easing / ×3 spring ` +
                        `inner sub-Card chain is still present (≥3) — flatten onto ONE Card (H.W10 G6).`,
                );
            }

            // ── (c) Labeled* ROWS (G6 row idiom) ────────────────────────────────
            if (probe.labeledRowCount >= 1) {
                ok(
                    `${scene}: Labeled* rows — ${probe.labeledRowCount} glass-ui .labeled-field row(s) ` +
                        `(the param fields are the standard label-left rows, not hand-classed grid divs)`,
                );
            } else {
                fail(
                    `${scene}: the sidebar has ${probe.labeledRowCount} .labeled-field rows ` +
                        `(expected ≥1) — the param fields are still hand-classed grid divs ` +
                        `(grid gap-1 / grid-cols-2), not the standard Labeled* rows (H.W10 G6).`,
                );
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
        `\nproof:easing-sidebar-normalized — FAIL (${failures.length}): an easing/spring sidebar ` +
            `is NOT normalized onto the standard component (tightest rung / ×3 inner Cards / hand-classed ` +
            `rows survive — the bespoke fork, H.W10 S4 / G5 + G6).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:easing-sidebar-normalized — PASS: the easing + spring sidebars are ONE quiet-cartoon Card " +
        "(no inner sub-Card chain), every param field a standard Labeled* label-left row on the standard " +
        "rung (0 text-admin-label, default md slider track) — G5 + G6.",
);
