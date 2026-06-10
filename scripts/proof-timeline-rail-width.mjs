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
 * proof:scene-machine-irrefragable's C3 route-stability clause as the
 * flake-defeat (D12 churn cannot flap the measurement once the grid has
 * resolved).
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * resolveChromium + context/teardown, J.W3 S1). Pure-measurement gate — no
 * static half (the source-shape no-cap/width-not-min-width lock is
 * proof:demo-shell-grid's grep). Under KF_REQUIRE_BROWSER a playwright-absent
 * skip becomes a hard fail AT THE LIB SEAM. Re-runnable:
 * `node scripts/proof-timeline-rail-width.mjs`. The browser half serves the
 * BUILT dist/gh-pages/ (run `npm run gh-pages` first).
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPage } from "./lib/demo-driver.mjs";

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
async function browserHalf() {
    const result = await withPage(
        {
            distDir: DIST,
            label: "the rail-width binding + mobile full-bleed measurements",
            // ── 1. RAIL-WIDTH BINDING (desktop, 1440×900) ────────────────────
            context: { viewport: { width: 1440, height: 900 } },
        },
        async (page, { url, browser }) => {
        const base = url;
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
            //     into the pane minus the SYMMETRIC shadow-clearance pad) AND is
            //     within the rail budget (the 768 cap is dead). H.W8 reconcile:
            //     H.W9.S2/F7 made the shadow-clearance pad SYMMETRIC — padding-left
            //     12px + padding-right 12px = 24px total (the cartoon stamp throws
            //     bottom-LEFT, so the pad had to be added on BOTH inline edges to
            //     keep the stamp inside the [rail]-track overflow:hidden). The
            //     border-box width:var(--rail-width) keeps BOTH pads inside the
            //     budget → content-box = rail − 24. The gate's floor was a stale
            //     rail−14 (one-side pad, the H.W3 assumption before F7); the
            //     binding is PERFECT (400/400/400 border-box, 376 content-box =
            //     400 − 24) — the floor is corrected to rail − 24. The EQUALITY to
            //     the live content-box (contentBoxOk) is the load-bearing assert; a
            //     re-introduced cap (768) breaks both it AND the upper bound.
            const PAD = 24; // H.W9.S2/F7 symmetric shadow-clearance (12px ×2)
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
                    probe.acW >= probe.rail - PAD - TOL;
                if (contentBoxOk && inBudget) {
                    ok(
                        `rail-width root binding: AnimationControls root (${probe.acW}px) === ` +
                            `.controls-content content-box (${probe.contentContentBox}px), within the ` +
                            `--rail-width budget (${probe.rail}px − ${PAD}px symmetric shadow-clearance) — the 768 cap is dead`,
                    );
                } else {
                    fail(
                        `rail-width root binding — AnimationControls root=${probe.acW}px must equal the ` +
                            `.controls-content content-box (${probe.contentContentBox}px, ±${TOL}px) AND sit ` +
                            `within the --rail-width budget (${probe.rail}px − ${PAD}px symmetric pad). Born-RED ` +
                            `pre-H.W3: the root was capped 768px by lg:max-w-screen-md, far above the rail budget.`,
                    );
                }
            }
        }

        // ── 2. MOBILE RIBBON FULL-BLEED (390×740) ───────────────────────────
        // The desktop cap must NOT leak into mobile (D10 / H.W7 full-bleed guard).
        // A fresh page in its own context (fresh storage — the original per-page
        // context semantics), from the lifecycle's browser handle.
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
                // The ribbon sits inside glass-ui's <Card surface="cartoon">, which
                // renders the `.rounded-card` class (the glass-ui ~3.5.x Card host;
                // the legacy `.glass-card` name is matched too for resilience across
                // glass-ui versions). H.W8 reconcile: the old `.glass-card`-only
                // selector found no ancestor (ribbonCard null) — the card class is
                // `.rounded-card` now.
                const ribbonCard = ribbon
                    ? ribbon.closest(".rounded-card, .glass-card")
                    : null;
                const bw = (el) => (el ? +el.getBoundingClientRect().width.toFixed(2) : null);
                // The pane's CONTENT-box (border-box minus the symmetric H.W9.S2/F7
                // shadow-clearance pad) — the box the ribbon wrapper actually fills.
                let contentContentBox = null;
                if (content) {
                    const ccs = getComputedStyle(content);
                    contentContentBox = +(
                        content.clientWidth -
                        parseFloat(ccs.paddingLeft) -
                        parseFloat(ccs.paddingRight)
                    ).toFixed(2);
                }
                return {
                    rail: parseFloat(
                        getComputedStyle(layout).getPropertyValue("--rail-width"),
                    ),
                    viewport: window.innerWidth,
                    contentW: bw(content),
                    contentContentBox,
                    ribbonCardW: bw(ribbonCard),
                };
            });

            // (a) NO desktop-cap leak: the fixed desktop `width: var(--rail-width)`
            //     (400px) is a desktop @media rule that must NOT apply at 390 — if
            //     it leaked, content would pin to 400 > the 390 viewport (overflow).
            //     H.W8 reconcile: the H.W7 bottom-sheet is TRUE full-bleed — content
            //     fills the viewport edge-to-edge (390 === viewport), NOT inset below
            //     it. The old `contentW < rail - 20` floor falsely assumed a margin-
            //     inset; the cap-leak witness is `content ≤ viewport AND content <
            //     rail` (a 400px leak at a 390 viewport breaks BOTH). Full-bleed
            //     (content === viewport) is the H.W7 design, not a regression.
            const noLeak =
                m.contentW != null &&
                m.contentW <= m.viewport + 1 &&
                m.contentW < m.rail;
            if (noLeak) {
                ok(
                    `mobile no-cap-leak: .controls-content (${m.contentW}px) full-bleeds the ` +
                        `${m.viewport}px viewport — below the desktop --rail-width (${m.rail}px); the desktop ` +
                        `fixed width does not leak to mobile`,
                );
            } else {
                fail(
                    `mobile no-cap-leak — .controls-content=${m.contentW}px at a ${m.viewport}px viewport must ` +
                        `stay ≤ the viewport AND below the desktop --rail-width (${m.rail}px). If it pins to ` +
                        `${m.rail}px the desktop fix leaked into mobile (breaks the H.W7 full-bleed bottom-sheet).`,
                );
            }

            // (b) the ribbon tracks the controls-pane CONTENT-box (≈, within the
            //     RibbonBar pl-4/pr-7 inset = 16+28 = 44px + tolerance). H.W8
            //     reconcile: the ribbon wrapper fills the pane CONTENT-box (border-
            //     box minus the H.W9.S2/F7 symmetric 24px shadow-clearance pad), so
            //     the card = content-box − 44 (the wrapper inset). The old clause
            //     measured against the BORDER-box (390) and gave a 48px slack that
            //     omitted the 24px content pad → a false 68px divergence. Measuring
            //     against the content-box (366) isolates the true ribbon-vs-pane
            //     relationship: 366 − 322 = 44 (the documented pl-4/pr-7 inset).
            const RIBBON_INSET = 44; // pl-4 (16) + pr-7 (28)
            const SLACK = RIBBON_INSET + 6; // + tolerance
            if (
                m.ribbonCardW != null &&
                m.contentContentBox != null &&
                m.contentContentBox - m.ribbonCardW <= SLACK
            ) {
                ok(
                    `mobile ribbon ≈ pane: the ribbon card (${m.ribbonCardW}px) tracks the ` +
                        `.controls-content content-box (${m.contentContentBox}px) at ${m.viewport}px ` +
                        `(within the RibbonBar pl-4/pr-7 inset — full-bleed retained)`,
                );
            } else {
                fail(
                    `mobile ribbon ≈ pane — the ribbon card (${m.ribbonCardW}px) should track the ` +
                        `.controls-content content-box (${m.contentContentBox}px) at ${m.viewport}px ` +
                        `(within the RibbonBar pl-4/pr-7 inset ≈ ${RIBBON_INSET}px); a larger divergence ` +
                        `means the ribbon no longer full-bleeds with the pane.`,
                );
            }
        }
        await mpage.close();
        },
    );
    if (result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
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
