#!/usr/bin/env node
/**
 * proof:demo-shell-grid — H.W3 (WV-W3-HIGH-1) the demo-shell architecture lock.
 *
 * The H.W3 transposition collapses the controls column to ONE named
 * `rail·stage·rail` grid with ONE `--rail-width` token: the two-track
 * `grid-cols-[auto_1fr]` + the nested `grid-cols-[subgrid]` chain + the
 * `col-span-2` markers + the 3-track grid's `col-end-4`/`col-span-full` span
 * hacks + the `--controls-pane-width` token are DELETED (no legacy beside
 * replacement). This gate is the no-legacy + named-frame lock.
 *
 * Three falsifiable clauses, each BITING on the exact obsolete apparatus:
 *
 *   1. NO-LEGACY GREP (STATIC — always runs). Over the S1–S4 rewrite files
 *      PLUS TimingFunctionPanel.vue (in scope via S3b), EXCLUDING
 *      AssetPropertiesPanel.vue by name (a separate tree — its
 *      `grid-cols-[auto_1fr]` is legitimate out-of-scope code, WV-W3-HIGH-1):
 *      ZERO surviving occurrences of `grid-cols-[auto_1fr]`,
 *      `grid-cols-[subgrid]`, `col-span-2`, `col-end-4`, `col-span-full`,
 *      `grid-template-columns: subgrid`. Source is COMMENT-BLANKED first so the
 *      doc-comments that NAME the deleted apparatus (the WV-W3-NIT-1 crossfade
 *      note, the col-end:-1 fallback note) do not false-positive — only LIVE
 *      markup/CSS counts. BITE: re-introduce any of those tokens in a scope file
 *      → reds (every one was live on the pre-W3 tree).
 *
 *   2. DEAD-TOKEN GREP (STATIC — always runs, TREE-WIDE). The
 *      `--controls-pane-width` token (renamed → `--rail-width` in S3) survives
 *      NOWHERE in the live source tree (demo/ + src/), comment-blanked. The
 *      rename is GLOBAL — land it FIRST so W4/W5 appends never reference the dead
 *      token. BITE: any re-introduced `--controls-pane-width` definition or
 *      `var(--controls-pane-width)` consumption → reds.
 *
 *   3. NAMED-TEMPLATE COMPUTED (BROWSER — runs when playwright resolves + dist
 *      is built). At ≥1024 the shell root `.controls-layout` resolves to EXACTLY
 *      the named `[rail] var(--rail-width) [stage] 1fr` ×
 *      `[top] auto [stage] 1fr [bottom] auto` template (open: the [rail] track
 *      equals the resolved --rail-width; the row line names + the [stage] 1fr +
 *      the auto top/bottom rows are present). Settle-gated on the H.W1 FSM
 *      resting (WV-W3-MED-3): viewport ≥1024 RE-ASSERTED after navigation
 *      (Playwright resets on navigate), pane OPEN, scene PINNED to #/cube, route
 *      rested ≥500ms, wait until the first column track resolves to the
 *      --rail-width value before asserting. The scene switch is driven by an
 *      IN-PAGE hash assignment (NOT page.goto — goto clears storage + kills the
 *      H.W1 reconcile trap). NOTE: `.controls-pane--mobile` is a STATIC class on
 *      the wrapper (always present), so the JS-desktop assertion is the COMPUTED
 *      named grid (only the @media(min-width:1024px) branch emits the [rail]
 *      line-named template), NOT a class-absence check. BITE: revert to the
 *      `grid-cols-[var(--controls-pane-width)_1fr_1fr]` 3-track grid → the
 *      computed template loses the [rail]/[stage] line names + the 1fr 1fr
 *      siblings → reds.
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * resolveChromium + context/teardown, J.W3 S1). The STATIC half always runs, the
 * BROWSER half gates on playwright resolution — a skip becomes a hard fail
 * under KF_REQUIRE_BROWSER AT THE LIB SEAM so a SHIP is never green-reported
 * un-exercised. Re-runnable: `node scripts/proof-demo-shell-grid.mjs`. The
 * browser half serves the BUILT dist/gh-pages/ (run `npm run gh-pages` first).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const SRC = path.join(REPO, "src");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};
const read = (p) => fs.readFileSync(p, "utf8");
const rel = (p) => path.relative(REPO, p).split(path.sep).join("/");

// Blank both /* … */ and // … comments (preserving newlines + length) so a
// doc-comment that NAMES a deleted apparatus (the crossfade note, the col-end:-1
// fallback note, a rename-history note) does not false-positive — only LIVE
// markup/CSS declarations count. (Mirrors proof-idioms.mjs `blankComments`.)
const blankComments = (s) =>
    s
        .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
        .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length));

console.log("proof:demo-shell-grid — H.W3 (the rail·stage·rail architecture lock)");

// ── 1. NO-LEGACY GREP (static, always runs) ──────────────────────────────────
{
    // The S1–S4 rewrite files PLUS TimingFunctionPanel.vue (in scope via S3b).
    // AssetPropertiesPanel.vue is EXCLUDED by NOT being in this set (a separate
    // tree — WV-W3-HIGH-1: its grid-cols-[auto_1fr] is legitimate out-of-scope).
    const AC = path.join(DEMO, "@/components/instrument/transport");
    const scopeFiles = [
        path.join(AC, "AnimationControlsGroup.vue"),
        path.join(AC, "controls/AnimationControlsControls.vue"),
        path.join(AC, "controls/AnimationControls.vue"),
        path.join(AC, "components/ControlsPaneWrapper.vue"),
        path.join(AC, "controls/LayerConfigPanel.vue"),
        path.join(AC, "controls/TimingFunctionPanel.vue"),
    ];

    // The obsolete apparatus tokens. Each was LIVE on the pre-W3 tree; each is a
    // distinct shape so a precise pattern catches a re-introduction without
    // false-positiving on the legitimate single-column forms (e.g. `grid-cols-1`,
    // `col-end: -1` the documented fallback line which is comment-blanked anyway).
    const FORBIDDEN = [
        ["grid-cols-[auto_1fr] (the two-track grid — S1/S3b)", /grid-cols-\[auto_1fr\]/],
        ["grid-cols-[subgrid] (the subgrid-propagation chain — S1)", /grid-cols-\[subgrid\]/],
        ["col-span-2 (the dead two-track span markers — S1/S2/S3b)", /\bcol-span-2\b/],
        ["col-end-4 (the 3-track stage span hack — S4)", /\bcol-end-4\b/],
        ["col-span-full (the redundant full-grid span — S4)", /\bcol-span-full\b/],
        ["grid-template-columns: subgrid (the scoped subgrid rule — S1)", /grid-template-columns:\s*subgrid/],
    ];

    const hits = [];
    for (const abs of scopeFiles) {
        if (!fs.existsSync(abs)) {
            fail(`no-legacy grep — scope file MISSING: ${rel(abs)} (the S1–S4 set drifted)`);
            continue;
        }
        const src = blankComments(read(abs));
        const lines = src.split("\n");
        for (const [label, re] of FORBIDDEN) {
            for (let i = 0; i < lines.length; i++) {
                if (re.test(lines[i])) hits.push(`${rel(abs)}:${i + 1} — ${label}`);
            }
        }
    }
    if (hits.length === 0) {
        ok(
            `no-legacy grep: the S1–S4 + TimingFunctionPanel scope is FREE of the ` +
                `two-track grid / subgrid chain / col-span-2 / col-end-4 / col-span-full / ` +
                `grid-template-columns:subgrid apparatus (${scopeFiles.length} files, comment-blanked)`,
        );
    } else {
        fail(
            `no-legacy grep — the obsolete apparatus survives in a scope file ` +
                `(${hits.length} live occurrence(s); the two-track grid + subgrid chain + ` +
                `col-span hacks must be DELETED, not masked — no legacy beside replacement):\n      ` +
                hits.join("\n      "),
        );
    }
}

// ── 2. DEAD-TOKEN GREP (static, always runs, TREE-WIDE) ───────────────────────
{
    // Collect every live .vue / .css / .ts under demo/ + src/, comment-blanked.
    // The dead `--controls-pane-width` token (renamed → --rail-width in S3) must
    // survive NOWHERE in the live source tree. (Gate SCRIPTS legitimately carry
    // the literal as a search pattern — they are not source the demo consumes, so
    // the live-source-tree scope deliberately excludes scripts/ + dist/ + docs/.)
    const exts = new Set([".vue", ".css", ".ts", ".mts", ".cts"]);
    const collect = (root) => {
        const out = [];
        const walk = (dir) => {
            for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
                const abs = path.join(dir, e.name);
                if (e.isDirectory()) {
                    if (e.name === "node_modules" || e.name === "dist") continue;
                    walk(abs);
                } else if (exts.has(path.extname(e.name))) {
                    out.push(abs);
                }
            }
        };
        if (fs.existsSync(root)) walk(root);
        return out;
    };
    const files = [...collect(DEMO), ...collect(SRC)];
    const DEAD = /--controls-pane-width\b/;
    const hits = [];
    for (const abs of files) {
        const src = blankComments(read(abs));
        const lines = src.split("\n");
        for (let i = 0; i < lines.length; i++) {
            if (DEAD.test(lines[i])) hits.push(`${rel(abs)}:${i + 1}`);
        }
    }
    if (hits.length === 0) {
        ok(
            `dead-token grep: --controls-pane-width survives NOWHERE in the live ` +
                `source tree (${files.length} demo/+src/ files, comment-blanked) — ` +
                `the S3 rename to --rail-width is GLOBAL`,
        );
    } else {
        fail(
            `dead-token grep — the renamed --controls-pane-width token survives in ` +
                `the live source tree (${hits.length} occurrence(s)); the S3 rename to ` +
                `--rail-width is GLOBAL (W4/W5 must never reference the dead token):\n      ` +
                hits.join("\n      "),
        );
    }
}

// ── 3. NAMED-TEMPLATE COMPUTED (browser, gated) ──────────────────────────────
const CTRL_KEY = "animation-groups-control-options-store";

/** Force the controls pane OPEN: write the persisted control-options store +
 *  toggle the live layout state class (the SSOT for the [rail]-track collapse).
 *  Idempotent. */
async function openPane(page) {
    await page.evaluate((ck) => {
        try {
            const s = JSON.parse(localStorage.getItem(ck) || "{}");
            s.isControlsPanelOpen = true;
            localStorage.setItem(ck, JSON.stringify(s));
        } catch {
            /* ignore — fall through to the class toggle */
        }
        const el = document.querySelector(".controls-layout");
        if (el) {
            el.classList.add("controls-layout--open");
            el.classList.remove("controls-layout--closed");
        }
    }, CTRL_KEY);
}

/** Settle on #/cube via the lib's navToScene (an IN-PAGE hash assignment — NOT
 *  page.goto, which clears storage + kills the H.W1 reconcile trap; the hash
 *  funnels through the afterEach reader → NAVIGATE → echo-guarded writer, the
 *  same fixed point as the in-app combobox, WV-W1 harness note — settled on the
 *  destination's per-EXPECTED control surface, WV-W3-MED-3). */
async function settleOnCube(page, viewportWidth) {
    await navToScene(page, "cube", "Controls", { timeout: 8000 });
    // RE-ASSERT the test viewport AFTER navigation (Playwright can reset to 390
    // on a navigation — WV-W3-MED-3). ≥1024 is the desktop branch precondition.
    await page.setViewportSize({ width: viewportWidth, height: 900 });
    await page.waitForTimeout(600); // route rested ≥500ms
}

async function browserHalf() {
    const result = await withPage(
        {
            distDir: DIST,
            label: "the named-template computed assertion",
            // 1440×900 — the canonical desktop measure (the changes-ledger anchor).
            context: { viewport: { width: 1440, height: 900 } },
        },
        async (page, { url }) => {
        const VW = 1440;
        await page.goto(`${url}/#/cube`, { waitUntil: "load" });
        await settleOnCube(page, VW);
        await openPane(page);

        // Wait until the first column track resolves to the --rail-width value
        // (the desktop @media branch is live + the pane is open) — WV-W3-MED-3.
        const settled = await page
            .waitForFunction(
                () => {
                    const el = document.querySelector(".controls-layout");
                    if (!el) return false;
                    const cs = getComputedStyle(el);
                    const railWidth = getComputedStyle(document.documentElement)
                        .getPropertyValue("--rail-width")
                        .trim();
                    // The computed columns carry the [rail]/[stage] line names ONLY on
                    // the desktop branch; the first track px must equal --rail-width.
                    const cols = cs.gridTemplateColumns;
                    if (!/\[rail\]/.test(cols) || !/\[stage\]/.test(cols)) return false;
                    const firstPx = parseFloat(cols.replace(/\[[^\]]*\]/g, " ").trim().split(/\s+/)[0]);
                    const railPx = parseFloat(railWidth);
                    return Number.isFinite(firstPx) && Number.isFinite(railPx) && Math.abs(firstPx - railPx) <= 2;
                },
                { timeout: 8000 },
            )
            .catch(() => false);

        if (!settled) {
            const dbg = await page.evaluate(() => {
                const el = document.querySelector(".controls-layout");
                return {
                    cols: el ? getComputedStyle(el).gridTemplateColumns : "<no .controls-layout>",
                    railWidth: getComputedStyle(document.documentElement).getPropertyValue("--rail-width").trim(),
                    vw: window.innerWidth,
                };
            });
            fail(
                `named-template computed — the shell root never settled to the ` +
                    `[rail] var(--rail-width) [stage] 1fr template (got cols=${JSON.stringify(dbg.cols)}, ` +
                    `--rail-width=${dbg.railWidth}, vw=${dbg.vw}); the FSM may not have rested or the ` +
                    `desktop branch is not live`,
            );
        } else {
            const probe = await page.evaluate(() => {
                const el = document.querySelector(".controls-layout");
                const cs = getComputedStyle(el);
                const railWidth = getComputedStyle(document.documentElement)
                    .getPropertyValue("--rail-width")
                    .trim();
                const cols = cs.gridTemplateColumns;
                const rows = cs.gridTemplateRows;
                const railPx = parseFloat(railWidth);
                const firstPx = parseFloat(cols.replace(/\[[^\]]*\]/g, " ").trim().split(/\s+/)[0]);
                // Column line names: [rail] before the rail track, [stage] before the 1fr.
                const colsNamed = /\[rail\]/.test(cols) && /\[stage\]/.test(cols);
                // Two column tracks only (rail + stage), NOT the dead 3-track 1fr 1fr.
                const colTrackCount = cols.replace(/\[[^\]]*\]/g, " ").trim().split(/\s+/).filter(Boolean).length;
                // Row line names: [top] auto [stage] 1fr [bottom] auto (empty auto rows
                // collapse to 0px when unoccupied — assert the NAMES + the track count).
                const rowsNamed = /\[top\]/.test(rows) && /\[stage\]/.test(rows) && /\[bottom\]/.test(rows);
                const rowTrackCount = rows.replace(/\[[^\]]*\]/g, " ").trim().split(/\s+/).filter(Boolean).length;
                return { cols, rows, railWidth, railPx, firstPx, colsNamed, colTrackCount, rowsNamed, rowTrackCount, vw: window.innerWidth };
            });

            const colsOk =
                probe.colsNamed && probe.colTrackCount === 2 && Math.abs(probe.firstPx - probe.railPx) <= 2;
            if (colsOk) {
                ok(
                    `named-template columns: [rail] ${probe.firstPx}px [stage] 1fr ` +
                        `(--rail-width=${probe.railWidth}, two named tracks — the dead 1fr 1fr is gone)`,
                );
            } else {
                fail(
                    `named-template columns — expected [rail] var(--rail-width) [stage] 1fr, ` +
                        `got ${JSON.stringify(probe.cols)} (named:${probe.colsNamed}, ` +
                        `trackCount:${probe.colTrackCount}, first:${probe.firstPx} vs rail:${probe.railPx})`,
                );
            }

            const rowsOk = probe.rowsNamed && probe.rowTrackCount === 3;
            if (rowsOk) {
                ok(
                    `named-template rows: [top] auto [stage] 1fr [bottom] auto ` +
                        `(three named tracks; empty auto rows collapse to 0 — reserved for the H.W4 hero/dock)`,
                );
            } else {
                fail(
                    `named-template rows — expected [top] auto [stage] 1fr [bottom] auto, ` +
                        `got ${JSON.stringify(probe.rows)} (named:${probe.rowsNamed}, trackCount:${probe.rowTrackCount})`,
                );
            }
        }
        },
    );
    if (result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:demo-shell-grid — FAIL (${failures.length}): the demo shell carries ` +
            `obsolete layout apparatus, a dead --controls-pane-width token, or the named ` +
            `rail·stage·rail template did not resolve (H.W3 — no legacy beside replacement).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:demo-shell-grid — PASS: ONE named rail·stage·rail grid, ONE --rail-width " +
        "token, the two-track grid + subgrid chain + col-span hacks + dead token are gone (H.W3).",
);
