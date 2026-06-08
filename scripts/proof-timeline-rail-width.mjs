#!/usr/bin/env node
/**
 * proof:timeline-rail-width — H.W3 §Hard gate (the width-binding lock + the
 * mobile full-bleed companion).
 *
 * The D4 defect (`a-timeline-width`): three competing width regimes, zero
 * agreement. Live on `#/cube`, pane open, 1440×900 — the grid track was
 * 1353.59px, the `AnimationControls` root was capped 768px (`lg:max-w-screen-md`),
 * the ribbon stretched 1272px, while `--controls-pane-width` (now `--rail-width`)
 * nominally read 400px and was honored by NOTHING. H.W3 collapses all of it onto
 * the SINGLE `--rail-width` authority (S3 token rename + `min-width`→`width` +
 * the 768 cap deleted; S4 the named `[rail] var(--rail-width) [stage] 1fr` grid).
 *
 * Two falsifiable clauses, each BITING on the exact regime spread:
 *
 *   1. RAIL-WIDTH BINDING (BROWSER — 1440×900, `#/cube`, pane OPEN, settled).
 *      The four surfaces the user perceives as "the controls column" all resolve
 *      to ONE width:
 *        - `--rail-width`                 = the authority (border-box budget)
 *        - `#timeline-expanded-target`    border-box === --rail-width  (on [rail])
 *        - `.controls-content`            border-box === --rail-width  (the pane IS the rail)
 *        - `AnimationControls` root       === `.controls-content` CONTENT-box
 *          (it `w-full`s into the pane minus the documented 12px shadow-clearance
 *          padding — S3 box-sizing:border-box keeps that pad INSIDE the budget),
 *          AND is within the rail budget (≤ rail, ≥ rail − 14): the cap is dead.
 *      BITE: reds TODAY — 1272 (content/ribbon) vs 768 (root, the cap) vs 400
 *      (--rail-width), three numbers, zero agreement; the root at 768 fails BOTH
 *      the content-box equality AND the "within rail budget" clause. Greens only
 *      when all four resolve to the one token. Re-introduce `lg:max-w-screen-md`
 *      on the root, or revert `.controls-content` to a `min-width` floor, → the
 *      root/content stretch past the rail budget → reds.
 *
 *   2. MOBILE RIBBON FULL-BLEED (BROWSER — 390×740, `#/cube`, pane OPEN). The
 *      desktop fixed `width: var(--rail-width)` (400px) must NOT leak into mobile:
 *      the pane + content scale to the narrow viewport (full-bleed retained for
 *      the H.W7 bottom-sheet), and the ribbon ≈ the controls-pane width. Assert
 *      the content width is WELL below the desktop rail-width (no 400px cap leak)
 *      AND the ribbon card tracks the content (±~24px — the RibbonBar's pl-4/pr-7
 *      inset). BITE: reds if the desktop `width: var(--rail-width)` ever applies
 *      at 390 (content pinned to 400 > viewport) — the guard that the desktop fix
 *      does not break the mobile full-bleed.
 *
 * Settle-gate (WV-W3-MED-3 / the §Hard gate harness note): the H.W1 FSM must be
 * RESTING before the measure. Land `#/cube` (the hash reconciles through the
 * machine — pane open is the store default), re-ASSERT the test viewport AFTER
 * navigation (Playwright resets to 390 on navigate), then poll until
 * `getComputedStyle('.controls-layout').gridTemplateColumns` resolves to the named
 * `[rail] <rail-width>px [stage] …` desktop template (the desktop-state witness —
 * the `.controls-pane--mobile` class is UNCONDITIONAL in the wrapper markup, so
 * desktop vs mobile is decided by the @media-applied grid, not a JS class). The
 * named-grid resolution IS the route-rested + desktop + open predicate. Cross-ref
 * H.W1's proof:no-route-storm as the flake-defeat (D12 churn cannot flap the
 * measurement once the grid has resolved).
 *
 * Mirrors scripts/proof-dock-popover-opens.mjs / proof-demo-usability.mjs (the
 * serveDist + Playwright plumbing). Pure-measurement gate — no static half (the
 * source-shape no-cap/width-not-min-width lock is proof:demo-shell-grid's grep).
 * Re-runnable: `node scripts/proof-timeline-rail-width.mjs`. The browser half
 * serves the BUILT dist/gh-pages/ (run `npm run gh-pages` first).
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
    "proof:timeline-rail-width — H.W3 (the four-way --rail-width binding + the mobile full-bleed companion)",
);

// ── BROWSER half (the gate is pure measurement) ──────────────────────────────
const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — ` +
                "the rail-width binding + mobile full-bleed measurements cannot pass vacuously",
        );
    } else {
        console.log(`  ○ browser half skipped — ${reason}`);
    }
};

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
            skipOrFail(
                "playwright not resolvable (set KF_PLAYWRIGHT_DIR or install @playwright/test)",
            );
            return;
        }
    }

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
    await new Promise((r) => server.listen(0, r));
    const port = server.address().port;
    const base = `http://127.0.0.1:${port}`;

    const browser = await chromium.launch();
    try {
        // ── 1. RAIL-WIDTH BINDING (desktop, 1440×900) ───────────────────────
        const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
        await page.goto(`${base}/#/cube`, { waitUntil: "load" });
        // Re-ASSERT the test viewport AFTER navigation (Playwright resets to 390
        // on navigate — WV-W3-MED-3); the named desktop grid only applies ≥1024.
        await page.setViewportSize({ width: 1440, height: 900 });

        // Settle-gate: poll until the FSM rests AND the named desktop grid has
        // resolved — gridTemplateColumns first track === parseFloat(--rail-width).
        // This single predicate witnesses: route rested (the grid is painted),
        // desktop (the @media (min-width:1024) template applied), pane state
        // resolved. The `.controls-pane--mobile` class is unconditional markup, so
        // it is NOT the desktop witness — the resolved grid is.
        let settled = false;
        for (let i = 0; i < 40 && !settled; i++) {
            try {
                settled = await page.evaluate(() => {
                    const layout = document.querySelector(".controls-layout");
                    if (!layout) return false;
                    const cs = getComputedStyle(layout);
                    const rail = parseFloat(cs.getPropertyValue("--rail-width"));
                    if (!(rail > 0)) return false;
                    // gridTemplateColumns resolves line-names + track sizes, e.g.
                    // "[rail] 400px [stage] 953.594px". Pull the first px track.
                    const firstTrack = parseFloat(
                        cs.gridTemplateColumns.replace(/\[[^\]]*\]/g, " ").trim().split(/\s+/)[0],
                    );
                    return Math.abs(firstTrack - rail) <= 2;
                });
            } catch {
                /* context churn mid-reconcile — re-poll */
            }
            if (!settled) await page.waitForTimeout(150);
        }
        // Belt-and-braces: ≥500ms rest after the grid resolves (WV-W3-MED-3).
        await page.waitForTimeout(500);

        if (!settled) {
            fail(
                "rail-width binding — the named [rail] var(--rail-width) [stage] grid never " +
                    "resolved at 1440×900 / #/cube (the desktop template did not apply, or the " +
                    "FSM did not rest — settle-gate timed out)",
            );
        } else {
            const probe = await page.evaluate(() => {
                const layout = document.querySelector(".controls-layout");
                const content = document.querySelector(".controls-content");
                const tl = document.querySelector("#timeline-expanded-target");
                // The AnimationControls root: the visible `.z-content.isolate` flex
                // column inside `.controls-content` (the AnimationControls.vue root —
                // `flex flex-col h-full w-full overflow-hidden z-content relative
                // isolate`). The visualizer balls are also `.z-content` but NOT
                // `.isolate`; scope to `.isolate` + visible to pick the real root.
                const ac = [
                    ...document.querySelectorAll(".controls-content .z-content.isolate"),
                ].find((el) => {
                    const r = el.getBoundingClientRect();
                    return r.width > 0 && r.height > 0;
                });
                const bw = (el) => (el ? +el.getBoundingClientRect().width.toFixed(2) : null);

                const rail = parseFloat(getComputedStyle(layout).getPropertyValue("--rail-width"));
                let contentContentBox = null;
                if (content) {
                    const cs = getComputedStyle(content);
                    contentContentBox =
                        +(
                            content.clientWidth -
                            parseFloat(cs.paddingLeft) -
                            parseFloat(cs.paddingRight)
                        ).toFixed(2);
                }
                return {
                    rail,
                    tlW: bw(tl),
                    contentW: bw(content),
                    contentContentBox,
                    acW: bw(ac),
                    acFound: !!ac,
                };
            });

            const TOL = 2;
            const near = (a, b, t = TOL) => a != null && b != null && Math.abs(a - b) <= t;

            // (a) --rail-width is the authority, and the timeline + pane border-box
            //     both equal it (the border-box budget).
            if (near(probe.tlW, probe.rail) && near(probe.contentW, probe.rail)) {
                ok(
                    `rail-width border-box budget: #timeline-expanded-target (${probe.tlW}px) === ` +
                        `.controls-content (${probe.contentW}px) === --rail-width (${probe.rail}px) (±${TOL}px)`,
                );
            } else {
                fail(
                    `rail-width border-box budget — #timeline-expanded-target=${probe.tlW}px, ` +
                        `.controls-content=${probe.contentW}px, --rail-width=${probe.rail}px must all ` +
                        `agree (±${TOL}px). Born-RED today (content stretched 1272 vs rail 400); reds if a ` +
                        `width regime diverges from the single --rail-width authority.`,
                );
            }

            // (b) the AnimationControls root === the pane CONTENT-box (it w-fulls
            //     into the pane minus the 12px shadow-clearance pad) AND is within
            //     the rail budget (the 768 cap is dead): rail − 14 ≤ acW ≤ rail.
            if (!probe.acFound) {
                fail(
                    "rail-width root binding — the AnimationControls root " +
                        "(.controls-content .z-content.isolate) did not render on #/cube",
                );
            } else {
                const contentBoxOk = near(probe.acW, probe.contentContentBox);
                const inBudget =
                    probe.acW != null &&
                    probe.acW <= probe.rail + TOL &&
                    probe.acW >= probe.rail - 14 - TOL; // 12px pad + tolerance
                if (contentBoxOk && inBudget) {
                    ok(
                        `rail-width root binding: AnimationControls root (${probe.acW}px) === ` +
                            `.controls-content content-box (${probe.contentContentBox}px), within the ` +
                            `--rail-width budget (${probe.rail}px − 12px shadow-clearance) — the 768 cap is dead`,
                    );
                } else {
                    fail(
                        `rail-width root binding — AnimationControls root=${probe.acW}px must equal the ` +
                            `.controls-content content-box (${probe.contentContentBox}px, ±${TOL}px) AND sit ` +
                            `within the --rail-width budget (${probe.rail}px − 12px pad). Born-RED today: the ` +
                            `root was capped 768px by lg:max-w-screen-md, far above the 400px rail budget.`,
                    );
                }
            }
        }
        await page.close();

        // ── 2. MOBILE RIBBON FULL-BLEED (390×740) ───────────────────────────
        // The desktop cap must NOT leak into mobile (D10 / H.W7 full-bleed guard).
        const mpage = await browser.newPage({ viewport: { width: 390, height: 740 } });
        await mpage.goto(`${base}/#/cube`, { waitUntil: "load" });
        await mpage.setViewportSize({ width: 390, height: 740 });

        // Settle: the pane + content paint at mobile width (the mobile @media
        // applies — content width resolves and is < the viewport, not the desktop
        // grid). Poll for a painted content box.
        let mobReady = false;
        for (let i = 0; i < 40 && !mobReady; i++) {
            try {
                mobReady = await mpage.evaluate(() => {
                    const content = document.querySelector(".controls-content");
                    return !!content && content.getBoundingClientRect().width > 0;
                });
            } catch {
                /* re-poll */
            }
            if (!mobReady) await mpage.waitForTimeout(150);
        }
        await mpage.waitForTimeout(300);

        if (!mobReady) {
            fail(
                "mobile-ribbon-full-bleed — the .controls-content never painted at 390×740 / #/cube " +
                    "(the mobile pane did not render)",
            );
        } else {
            const m = await mpage.evaluate(() => {
                const layout = document.querySelector(".controls-layout");
                const content = document.querySelector(".controls-content");
                const ribbon = document.querySelector("#controls-ribbon-target");
                const ribbonCard = ribbon ? ribbon.closest(".glass-card") : null;
                const bw = (el) => (el ? +el.getBoundingClientRect().width.toFixed(2) : null);
                return {
                    rail: parseFloat(
                        getComputedStyle(layout).getPropertyValue("--rail-width"),
                    ),
                    viewport: window.innerWidth,
                    contentW: bw(content),
                    ribbonCardW: bw(ribbonCard),
                };
            });

            // (a) NO desktop-cap leak: the content is well below the desktop
            //     rail-width (400px) — the fixed `width: var(--rail-width)` is a
            //     desktop @media rule that must not apply at 390. Below the rail
            //     AND below the viewport (full-bleed, margin-inset).
            const noLeak =
                m.contentW != null && m.contentW < m.rail - 20 && m.contentW <= m.viewport;
            if (noLeak) {
                ok(
                    `mobile no-cap-leak: .controls-content (${m.contentW}px) scales to the 390px ` +
                        `viewport — well below the desktop --rail-width (${m.rail}px); the desktop ` +
                        `fixed width does not leak to mobile`,
                );
            } else {
                fail(
                    `mobile no-cap-leak — .controls-content=${m.contentW}px at a 390px viewport must ` +
                        `scale below the desktop --rail-width (${m.rail}px). If it pins to ${m.rail}px the ` +
                        `desktop fix leaked into mobile (breaks the H.W7 full-bleed bottom-sheet).`,
                );
            }

            // (b) the ribbon tracks the controls-pane width (≈, within the
            //     RibbonBar pl-4/pr-7 inset ≈ 16+28 = 44px slack).
            if (m.ribbonCardW != null && m.contentW != null && m.contentW - m.ribbonCardW <= 48) {
                ok(
                    `mobile ribbon ≈ pane: the ribbon card (${m.ribbonCardW}px) tracks the ` +
                        `.controls-content (${m.contentW}px) at 390px (full-bleed retained)`,
                );
            } else {
                fail(
                    `mobile ribbon ≈ pane — the ribbon card (${m.ribbonCardW}px) should track the ` +
                        `.controls-content width (${m.contentW}px) at 390px (within the RibbonBar inset); ` +
                        `a large divergence means the ribbon no longer full-bleeds with the pane.`,
                );
            }
        }
        await mpage.close();
    } finally {
        await browser.close();
        server.close();
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:timeline-rail-width — FAIL (${failures.length}): the controls column does not ` +
            `resolve to the single --rail-width authority (the D4 three-regime spread, or the ` +
            `desktop cap leaked into mobile).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:timeline-rail-width — PASS: the rail · timeline · pane · root all bind to one " +
        "--rail-width; the desktop cap does not leak to mobile.",
);
