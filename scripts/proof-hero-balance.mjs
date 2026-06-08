#!/usr/bin/env node
/**
 * proof:hero-balance — H.W4 S3 (the orphaned-`...` fold) the one-optical-block lock.
 *
 * The defect (live, 1440×900, `/`): the hero `<h1>` was `text-display-4 grid p-0
 * lg:flex`; `.grid` beat `lg:flex` in v4 source order so the `<h1>` computed
 * `display:grid` with `grid-template-rows: 94.72px 94.72px` — the SECOND
 * `<AnimatedText :text="ellipsis">` `...` sat on its OWN grid row BELOW the title,
 * mid-fade, fragmenting the poster (the mechanism is GRID-ROW stacking, CP-HIGH-6
 * — NOT flex-wrap). S3 collapses the host to a PLAIN BLOCK and keeps the ellipsis
 * a SEPARATE inline host (the H.W6 TypingDots mount point), so the title + the
 * inline dots read as ONE optical block.
 *
 * Three falsifiable BROWSER clauses, asserting the LAYOUT fold (NOT the dot
 * cadence — that is H.W6's proof:typing-dots; HD-W4-4 / WV-W4-MED-3):
 *
 *   1. NO GRID-ROW STACKING (both widths — the structural fix). The hero `<h1>`
 *      does NOT compute `display:grid` with ≥2 explicit stacked rows (the orphan
 *      mechanism). BITE: revert to `grid p-0 lg:flex` → `display:grid` +
 *      `grid-template-rows: <h> <h>` → the `...` is back on its own grid row → reds.
 *
 *   2. TITLE ≤ 2 LINES (both widths — the balance substrate). The title word
 *      boxes cluster into ≤ 2 distinct visual rows ("Select an / animation"
 *      balances to two lines; `text-wrap: balance` holds). BITE: drop the balance
 *      substrate / overflow to 3+ title rows → reds. (Rows clustered within half a
 *      line-height to absorb the per-word `lift-down` animation offset.)
 *
 *   3. DOTS ON THE SAME OPTICAL BLOCK (desktop 1440 — the no-orphan-row lock). The
 *      TypingDots host's vertical band OVERLAPS the LAST title word's vertical band
 *      (same line box — the dots sit inline-adjacent to the title, NOT on a
 *      separate row below it). BITE: the pre-fix grid put the `...` on its own row
 *      below the title (no vertical overlap) → reds; merging the dots into the
 *      title run or re-stacking them → reds. (Asserted at the desktop measure where
 *      "Select an animation" fits one line and the dots trail it inline; at 390 the
 *      title legitimately wraps to two lines and the dots follow the last word in
 *      natural flow — that is text wrapping, not the grid-row orphan, so clause 3
 *      is the desktop-anchored bite while clauses 1+2 hold at both widths.)
 *
 * Settle-gated on the H.W1 FSM resting (WV-W4-LOW-1 / HD-W4-6): the home hero is
 * the `#start-screen` slot gated on `isHome`; poll the machine to rest on `home` +
 * the hero `<h1>.hero-display` to render. Measured at 1440×900 (desktop) AND 390×844
 * (mobile) per the contract's "screenshot diff at 1440 + 390."
 *
 * Mirrors scripts/proof-demo-shell-grid.mjs (the serveDist + Playwright + settle
 * plumbing). Browser-only (the fold is a rendered fact). Under KF_REQUIRE_BROWSER a
 * playwright-absent skip → hard fail. Re-runnable: `node scripts/proof-hero-balance.mjs`.
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

console.log("proof:hero-balance — H.W4 S3 (the orphaned-`...` fold · one optical block)");

const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — ` +
                "the one-optical-block clauses cannot pass vacuously",
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

async function settleOnHome(page, viewportWidth, viewportHeight) {
    await page
        .waitForFunction(
            (mk) => {
                try {
                    const m = JSON.parse(localStorage.getItem(mk) || "{}");
                    return m.activeScene === "home" && !!document.querySelector("h1.hero-display");
                } catch {
                    return false;
                }
            },
            MACHINE_KEY,
            { timeout: 8000 },
        )
        .catch(() => {});
    await page.setViewportSize({ width: viewportWidth, height: viewportHeight });
    await page.waitForTimeout(500);
}

/** Measure the hero fold at one viewport. Returns the grid-stack signal, the
 *  distinct title-row count (lift-down word boxes clustered within ½ line-height),
 *  and the dots-vs-last-word vertical-band overlap. */
async function probeHero(page) {
    return page.evaluate(() => {
        const h1 = document.querySelector("h1.hero-display");
        if (!h1) return { found: false };
        const cs = getComputedStyle(h1);
        const lineH = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize);

        // GRID-ROW STACKING: display:grid AND ≥2 explicit row tracks.
        const rows = cs.gridTemplateRows;
        const rowTracks =
            rows && rows !== "none"
                ? rows.replace(/\[[^\]]*\]/g, " ").trim().split(/\s+/).filter(Boolean)
                : [];
        const gridStacked = cs.display.includes("grid") && rowTracks.length >= 2;

        // TITLE ROWS: cluster the lift-down word-box tops within ½ line-height (the
        // per-word lift-down animation jitters the top a few px on one logical row).
        const words = [...h1.querySelectorAll(".lift-down")];
        const tops = words.map((w) => w.getBoundingClientRect().top).sort((a, b) => a - b);
        const tol = lineH * 0.5;
        const rowCenters = [];
        for (const t of tops) {
            if (!rowCenters.some((c) => Math.abs(c - t) <= tol)) rowCenters.push(t);
        }
        const titleRows = rowCenters.length;

        // DOTS vs LAST WORD vertical-band overlap. The last word = the lowest-then-
        // rightmost lift-down box (the visual end of the title run). The dots host =
        // the TypingDots `.typing-dots` span (or the surviving `<span class="depth-text">`).
        const lastWord = words.length
            ? words.reduce((acc, w) => {
                  const r = w.getBoundingClientRect();
                  if (!acc) return r;
                  // prefer lower row; within a row prefer rightmost
                  if (r.top > acc.top + tol) return r;
                  if (Math.abs(r.top - acc.top) <= tol && r.right > acc.right) return r;
                  return acc;
              }, null)
            : null;
        const dotsHost =
            h1.querySelector(".typing-dots") ||
            h1.querySelector(":scope > span.depth-text") ||
            h1.querySelector("span.depth-text");
        const dotsR = dotsHost ? dotsHost.getBoundingClientRect() : null;

        let bandOverlap = null;
        if (lastWord && dotsR) {
            const overlap =
                Math.min(lastWord.bottom, dotsR.bottom) - Math.max(lastWord.top, dotsR.top);
            bandOverlap = overlap; // >0 ⇒ the dots share the last word's line box
        }

        return {
            found: true,
            display: cs.display,
            gridTemplateRows: rows,
            gridStacked,
            titleRows,
            wordCount: words.length,
            lineH,
            hasDotsHost: !!dotsHost,
            bandOverlap,
            lastWordTop: lastWord ? Math.round(lastWord.top) : null,
            lastWordBottom: lastWord ? Math.round(lastWord.bottom) : null,
            dotsTop: dotsR ? Math.round(dotsR.top) : null,
            dotsBottom: dotsR ? Math.round(dotsR.bottom) : null,
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

    const VIEWPORTS = [
        { w: 1440, h: 900, desktop: true },
        { w: 390, h: 844, desktop: false },
    ];
    const browser = await chromium.launch();
    try {
        for (const vp of VIEWPORTS) {
            const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
            await page.goto(`${base}/`, { waitUntil: "load" });
            await settleOnHome(page, vp.w, vp.h);
            const p = await probeHero(page);
            const tag = `${vp.w}×${vp.h}`;

            if (!p.found) {
                fail(`${tag} — the hero <h1>.hero-display did not render (the FSM may not have rested on home)`);
                await page.close();
                continue;
            }

            // 1. NO GRID-ROW STACKING (both widths)
            if (!p.gridStacked) {
                ok(
                    `${tag} no grid-row stacking: the hero <h1> is display:${p.display} ` +
                        `(grid-template-rows: ${p.gridTemplateRows}) — the orphaned-`.replace(/`/g, "") +
                        `... grid row mechanism is gone`,
                );
            } else {
                fail(
                    `${tag} grid-row stacking — the hero <h1> computes display:${p.display} with ` +
                        `${p.gridTemplateRows} (≥2 stacked rows); the ... is back on its own grid row ` +
                        `(the CP-HIGH-6 orphan mechanism)`,
                );
            }

            // 2. TITLE ≤ 2 LINES (both widths)
            if (p.titleRows <= 2) {
                ok(`${tag} title ≤ 2 lines: the title balances to ${p.titleRows} row(s) (text-wrap: balance holds)`);
            } else {
                fail(
                    `${tag} title > 2 lines — the title runs to ${p.titleRows} rows ` +
                        `(the balance substrate did not hold / the rung overflows)`,
                );
            }

            // 3. DOTS ON THE SAME OPTICAL BLOCK (desktop only — see header comment)
            if (vp.desktop) {
                if (!p.hasDotsHost) {
                    fail(`${tag} dots block — the TypingDots host was not found inside the hero <h1>`);
                } else if (p.bandOverlap != null && p.bandOverlap > 0) {
                    ok(
                        `${tag} dots on the same block: the TypingDots band overlaps the last title ` +
                            `word's line box by ${p.bandOverlap.toFixed(0)}px (dots inline-adjacent — no orphan row)`,
                    );
                } else {
                    fail(
                        `${tag} dots on the same block — the TypingDots host does NOT overlap the last ` +
                            `title word's vertical band (word y:[${p.lastWordTop},${p.lastWordBottom}] vs ` +
                            `dots y:[${p.dotsTop},${p.dotsBottom}], overlap=${p.bandOverlap}); the ... sits on ` +
                            `its own row below the title (the orphan-row defect)`,
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
        `\nproof:hero-balance — FAIL (${failures.length}): the hero is not a single balanced ` +
            `≤2-line optical block with the ... inline (the orphaned-... grid row or an over-wrapped ` +
            `title survives) — H.W4 S3.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:hero-balance — PASS: the hero <h1> is a plain block (no grid-row stacking), the title " +
        "balances to ≤2 lines, and the TypingDots ... reads inline on the same optical block (H.W4 S3).",
);
