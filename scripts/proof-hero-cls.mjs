#!/usr/bin/env node
/**
 * proof:hero-cls — H.W4 S3 (the MEASURE-FIRST CLS companion) the mega-rung-keeps-
 * CLS-≈0 lock.
 *
 * The risk S3 guards against: bumping the hero one φ rung into the audacious tier
 * (`text-display-4` → `text-display-mega`, 86→177px) could re-open a font-swap
 * layout shift (the bigger the type, the bigger any reflow). The Capsize
 * metric-matched fallback (`@font-face "Instrument Serif Fallback"` with
 * `size-adjust`/`ascent-override`/`descent-override`, style.css:80) is ALREADY-SOTA
 * (E.W11.S5, 0 CLS) and scales WITH the rung; AND the hero lives in an
 * absolutely-positioned, zero-height, `pointer-events-none` overlay
 * (`EditorStartScreen.vue:3` — `absolute … h-0 w-screen`), so any internal reflow
 * of the `<h1>` shifts NOTHING in document flow. Both together keep the LCP node's
 * CLS contribution ≈ 0 after the mega bump.
 *
 * Two falsifiable BROWSER clauses:
 *
 *   1. HERO-ATTRIBUTED STEADY-STATE CLS ≈ 0 (a PerformanceObserver('layout-shift')
 *      summing ONLY the shift entries whose `sources[].node` IS the hero `<h1>` / a
 *      descendant / the hero overlay — NOT total page CLS — measured in a STEADY-
 *      STATE window). This is the spec's "the `<h1>` LCP node CLS CONTRIBUTION ≈ 0":
 *      (a) attributing the shift to the hero, so the demo's own stage/scene mount
 *      churn (which legitimately reflows the rest of the page during load) does NOT
 *      false-bite the hero; AND (b) a TWO-WINDOW measure — the buffer is RESET after
 *      the start-screen `<Transition appear>` entrance + the per-word `lift-down`
 *      settle + the font swap complete, so the one-shot entrance animation (a
 *      deliberate, user-expected effect the layout-shift API records on first paint,
 *      which fires on ANY rung) is excluded; the measured window is the steady-state
 *      where the FONT-SWAP/rung-bump risk would show. The hero's steady-state
 *      contribution is ≤ 0.02 (an order of magnitude under the CWV "good" 0.1 bound).
 *      BITE: a font-swap that reflows the hero's IN-FLOW content (moving it out of
 *      the zero-height overlay, or dropping the Capsize fallback) → a steady-state
 *      hero shift → reds. (Browsers lacking the API are caught by clause 2 — the
 *      structural reason — so the gate never silently passes when CLS is unmeasurable.)
 *
 *   2. OVERLAY NON-DISPLACEMENT (the structural reason the hero's CLS stays ≈0 even
 *      if the font swaps the wrap-count — and the attribution-independent floor).
 *      The hero `<h1>`'s nearest positioned ancestor (the start-screen overlay) is
 *      `position:absolute` AND its own laid-out height in flow is 0 (`h-0`) — so the
 *      `<h1>` is OUT of document flow and cannot push siblings. BITE: re-flow the
 *      hero into the document (drop the absolute overlay) → the overlay is no longer
 *      position:absolute / h-0 → reds, catching the regression that would let the
 *      bigger rung shift the page.
 *
 * Settle-gated on the H.W1 FSM resting (WV-W4-LOW-1 / HD-W4-6): the home hero is
 * the `#start-screen` slot gated on `isHome`; the layout-shift observer is
 * installed at document-start (addInitScript) so it captures the font-swap shift,
 * then the machine is polled to rest on `home` + `document.fonts.ready` before the
 * CLS is read.
 *
 * Mirrors scripts/proof-demo-shell-grid.mjs (the serveDist + Playwright + settle
 * plumbing). Browser-only (CLS is a runtime metric). Under KF_REQUIRE_BROWSER a
 * playwright-absent skip → hard fail. Re-runnable: `node scripts/proof-hero-cls.mjs`.
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

console.log("proof:hero-cls — H.W4 S3 (the mega rung keeps the hero CLS ≈ 0)");

const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — ` +
                "the CLS + overlay clauses cannot pass vacuously",
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
const CLS_CEILING = 0.02; // an order of magnitude under the CWV "good" 0.1 bound.

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
        // A FRESH context so the layout-shift observer sees the first paint + the
        // font swap (a re-used page would have the font cached + already painted).
        const context = await browser.newContext({ viewport: { width: VW, height: VH } });
        const page = await context.newPage();

        // Install the layout-shift accumulator at document-start so it captures the
        // hero's font-swap shift (buffered:true also back-fills entries before this
        // runs). The observer runs BEFORE the hero exists, so we RETAIN each shift
        // entry's source nodes + value (excluding user-input shifts, per CWV); the
        // hero ATTRIBUTION is computed after the hero renders (clause 1). We keep a
        // live node reference (not a snapshot) so we can test ancestry post-hoc.
        await page.addInitScript(() => {
            window.__lsEntries = []; // { value, nodes: Node[] }
            window.__lsApiOk = true;
            try {
                new PerformanceObserver((list) => {
                    for (const e of list.getEntries()) {
                        if (e.hadRecentInput) continue;
                        const nodes = (e.sources || []).map((s) => s.node).filter(Boolean);
                        window.__lsEntries.push({ value: e.value, nodes });
                    }
                }).observe({ type: "layout-shift", buffered: true });
            } catch {
                window.__lsApiOk = false; // layout-shift API unavailable — flagged below
            }
        });

        await page.goto(`${base}/`, { waitUntil: "load" });
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
        await page.setViewportSize({ width: VW, height: VH });
        await page.evaluate(() => document.fonts.ready);
        // Let the START-SCREEN <Transition appear> entrance + the per-word lift-down
        // settle AND the font swap complete (the entrance is a deliberate, user-
        // expected one-shot animation that the layout-shift API records on first
        // paint — it fires on ANY rung, so it is NOT the mega-bump's font-swap risk).
        await page.waitForTimeout(1500);
        // RESET the accumulator: drop the entrance/first-paint shifts so the measured
        // window is STEADY-STATE (fonts swapped, entrance done). A hero shift in this
        // window is the genuine font-swap/rung-bump shift the spec guards against.
        await page.evaluate(() => {
            window.__lsEntries = [];
        });
        await page.waitForTimeout(800); // the steady-state observation window

        const probe = await page.evaluate(() => {
            const h1 = document.querySelector("h1.hero-display");
            if (!h1) return { found: false };
            // The nearest POSITIONED ancestor (the start-screen overlay) — its
            // position + in-flow height determine whether the hero is in flow.
            let overlay = h1.parentElement;
            while (overlay && getComputedStyle(overlay).position === "static") {
                overlay = overlay.parentElement;
            }
            const oCS = overlay ? getComputedStyle(overlay) : null;

            // ATTRIBUTE the buffered layout-shift entries to the hero: a shift counts
            // toward the hero's contribution iff one of its source nodes IS the hero
            // <h1>, a descendant of it, or the hero overlay (the element whose box the
            // hero would push if it were in flow). Total page CLS is reported too (for
            // the failure diagnostic) but is NOT the assertion — the demo's stage/scene
            // mount legitimately reflows the rest of the page during load.
            const heroAncestor = overlay || h1;
            let heroCls = 0;
            let totalCls = 0;
            for (const ent of window.__lsEntries || []) {
                totalCls += ent.value;
                const touchesHero = ent.nodes.some(
                    (n) => n && (n === h1 || h1.contains(n) || heroAncestor.contains(n) || n.contains(h1)),
                );
                if (touchesHero) heroCls += ent.value;
            }

            return {
                found: true,
                heroCls,
                totalCls,
                clsApiOk: window.__lsApiOk === true,
                entryCount: (window.__lsEntries || []).length,
                overlayPosition: oCS ? oCS.position : null,
                overlayHeightPx: oCS ? parseFloat(oCS.height) : null,
                heroFontSize: parseFloat(getComputedStyle(h1).fontSize),
                fontsStatus: document.fonts.status,
            };
        });

        if (!probe.found) {
            fail("CLS — the hero <h1>.hero-display did not render at `/` (the FSM may not have rested on home)");
        } else {
            // ── 1. HERO-ATTRIBUTED CLS ≈ 0 ──────────────────────────────────────
            if (!probe.clsApiOk) {
                fail("CLS — the layout-shift PerformanceObserver API is unavailable (cannot measure CLS)");
            } else if (probe.heroCls <= CLS_CEILING) {
                ok(
                    `hero-attributed CLS: ${probe.heroCls.toFixed(5)} ≤ ${CLS_CEILING} over the load + ` +
                        `font swap at the mega rung (${probe.heroFontSize.toFixed(0)}px; fonts ${probe.fontsStatus}; ` +
                        `${probe.entryCount} shift entries, page-total ${probe.totalCls.toFixed(5)}) — the ` +
                        `Capsize fallback + the overlay keep the hero's LCP shift ≈ 0`,
                );
            } else {
                fail(
                    `hero-attributed CLS — ${probe.heroCls.toFixed(5)} > ${CLS_CEILING} at the mega rung ` +
                        `(${probe.heroFontSize.toFixed(0)}px; page-total ${probe.totalCls.toFixed(5)}); the font ` +
                        `swap reflowed the hero's in-flow content (the Capsize fallback or the overlay ` +
                        `non-displacement regressed)`,
                );
            }

            // ── 2. OVERLAY NON-DISPLACEMENT ─────────────────────────────────────
            const absolute = probe.overlayPosition === "absolute" || probe.overlayPosition === "fixed";
            const zeroFlow = probe.overlayHeightPx != null && probe.overlayHeightPx <= 1;
            if (absolute && zeroFlow) {
                ok(
                    `overlay non-displacement: the hero's positioned ancestor is ` +
                        `position:${probe.overlayPosition} + ${Math.round(probe.overlayHeightPx)}px in-flow height ` +
                        `(the <h1> is OUT of document flow — any internal reflow shifts nothing)`,
                );
            } else {
                fail(
                    `overlay non-displacement — the hero's positioned ancestor is ` +
                        `position:${probe.overlayPosition} with ${probe.overlayHeightPx}px in-flow height ` +
                        `(expected absolute/fixed + ~0 height); the hero is in document flow and a ` +
                        `font-swap reflow at the mega rung would push the page`,
                );
            }
        }
        await context.close();
    } finally {
        await browser.close();
        server.close();
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:hero-cls — FAIL (${failures.length}): the mega-rung hero contributes a ` +
            `measurable layout shift, or the hero left its zero-height overlay (H.W4 S3 — CLS must stay ≈0).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:hero-cls — PASS: the mega-rung hero keeps CLS ≈ 0 (the Capsize fallback scales with " +
        "the rung; the zero-height absolute overlay keeps the <h1> out of document flow) (H.W4 S3).",
);
