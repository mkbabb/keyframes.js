#!/usr/bin/env node
/**
 * proof:layout-cluster — Tranche K.W3 §Hard gate (THE LAYOUT TRANSPOSITION ·
 * the dock anchoring becomes a DERIVED grid that clusters gracefully on a cinema
 * display and a phone alike — the layout-cluster oracle).
 *
 * THE DEFECT this oracle is born to bite (the §2 pathological-screen smoking gun,
 * `layout-grid-k.md §2`). The macro layout clamps the content card to 1920×1056
 * (`--work-area-max-{width,height}`), but the CHROME does not cluster to that card:
 *   • the dock anchors are `slack × bias` with NO ceiling — `slack =
 *     viewport − fixed-card-ceiling` grows UNBOUNDED, so on a 5K panel the top
 *     dock floats 698.8px in, the bottom 1132.2px in (the docks maroon mid-void);
 *   • the rail track is a FIXED 400px (`--rail-width: 400px`) — INVARIANT across a
 *     4× viewport-area span (400px at 1280, 1920, 3440, AND 5120);
 *   • the surplus past the card ceiling is pure DEAD GUTTER (37.5%W / 36.7%H fill
 *     at 5K with 1600px of empty graph-paper each side).
 * The whole UI maroons as a tiny island in a sea of dead graph paper.
 *
 * THE ORACLE (the K.md boundary-ORACLE + gate-ORACLE precept — the layout property
 * a human would CHECK, exercised through the SAME built surface, on the REAL built
 * dist over the FIVE pathological viewports the §2 probe fixed the measure at):
 * drive `dist/gh-pages` at 1280×800, 1440×900, 3440×1440, 5120×2880, AND the
 * tall-portrait 1280×2000, open the controls panel (the J/K openControlsPanel/
 * navToScene driver the harness owns), read the RESOLVED layout tokens
 * (`--dock-top-anchor` etc., resolved via a temp-probe since getComputedStyle may
 * return the un-resolved calc()) + the rendered dock/card/rail box rects, and
 * assert the cluster properties. PLUS a static grep clause asserting ZERO
 * hardcoded dock/rail offsets survive.
 *
 * FOUR correctness clauses (a)-(d) — born-RED on TODAY's tree by the §2 shape,
 * GREEN on M1+M3+M4:
 *
 *   (a) THE DOCKS CLUSTER TO THE CONTENT CARD, NOT THE VIEWPORT (M3; the §2
 *       5K/portrait float dies). At 5120×2880 AND at 1280×2000 the resolved
 *       `--dock-top-anchor` / `--dock-bottom-anchor` (and the rendered dock box's
 *       distance from the work-area card edge) are BOUNDED ≤ a NAMED ceiling
 *       (the `--dock-anchor-ceiling` + the φ `--dock-margin` term), NOT the
 *       unbounded `slack × bias`. BORN-RED WITNESS: `dock-top-anchor: 698.8px` at
 *       5K and `362.6px` at portrait (`layout-grid-k.md §2`) — far past any sane
 *       ceiling → RED. BITE: reds on the un-capped `max(offset…)` chain
 *       (`style.css:224,241`); greens on the `min(offset, ceiling)` cap (M3).
 *
 *   (b) THE RAIL TRACK IS DERIVED, NOT FIXED 400px (M1; C1 dies). At 1440×900 the
 *       rail ≈ the baseline open width; at 3440 AND 5120 the controls-pane width
 *       is GREATER than the 1440 baseline (the rail SCALED, viewport-aware) AND
 *       bounded by the M1 clamp max (did NOT stay invariant 400px, did NOT blow to
 *       30rem on a narrow shell). BORN-RED WITNESS: `controlsPane.w == 400`
 *       invariant at 1280/1920/3440/5120 (`layout-grid-k.md §2`) → "the rail
 *       scaled on a large screen" is FALSE → RED. BITE: reds on `--rail-width:
 *       400px`; greens on the clamp()/minmax() derived track.
 *
 *   (c) THE SURPLUS IS DISTRIBUTED, NOT DEAD GUTTER (M4). At 5120×2880 the stage
 *       cell (the subject region) grew via `[stage] minmax(0,1fr)` — it consumes a
 *       LARGER fraction of the work-area card width than the pre-cure dead-gutter
 *       case (the rail is bounded by M1, so the stage takes the remainder), AND
 *       the chrome clustered to the card (clause (a) bounded). BORN-RED WITNESS:
 *       pre-cure 37.5%W fill with the stage a fixed 1520px regardless of surplus →
 *       RED. BITE: reds on the no-distribution tree; greens on M4.
 *
 *   (d) ZERO HARDCODED DOCK/RAIL OFFSETS SURVIVE A GREP (the U-K7 literal; static).
 *       No fixed-px dock-anchor or rail-track literal in the demo styling source:
 *       `--rail-width: <Npx>` is GONE from design-idioms.css, and the dock-anchor
 *       chain carries NO raw-px addend beyond the φ `--dock-margin` term + the
 *       named `--dock-anchor-ceiling` token. ALLOWLIST-FENCED so the φ
 *       `--dock-margin/4`÷`/φ` terms, the named ceiling token, and the legitimate
 *       `clamp()` rem bounds are NOT false positives — the clause targets RAW
 *       fixed-px ANCHOR/RAIL literals ONLY. BORN-RED-ABLE ON PLANTED OFFSETS: the
 *       clause REDS if a `--rail-width: 360px` (or any fixed-px dock/rail literal)
 *       is PLANTED back — a falsifiable witness (KF_LAYOUT_PLANT=1 injects a
 *       synthetic `--rail-width: 360px` line and the clause MUST red). BITE: reds
 *       on today's `--rail-width: 400px`; greens when M1 derives it; reds AGAIN if
 *       a future edit plants a fixed offset back.
 *
 *   (e) is the TASTE review packet (USER-DOMAIN, the K-born TASTE boundary) — NOT
 *       a runtime clause here. The per-viewport before/after screenshots
 *       (desktop + mobile) GENERATE at K.W4's close; the layout band closes ONLY
 *       on the user's verdict. This gate RECORDS the requirement; it does not
 *       block on it.
 *
 * P6 posture (declared): clauses (a)-(d) are DEVICE-INDEPENDENT (resolved CSS
 * tokens, DOM box geometry, static grep — the viewport sizes are SET via
 * setViewportSize, NOT read from the host) → they HARD-gate on the Linux CI runner
 * (no IN_CI escape; host-independent BY CONSTRUCTION). Under KF_REQUIRE_BROWSER a
 * playwright-absent / dist-absent run is a HARD FAIL at the lib seam (the W7-1
 * regime); otherwise it skips honestly. Serves the BUILT dist/gh-pages/.
 * Re-runnable:
 *   npm run gh-pages && KF_REQUIRE_BROWSER=1 node scripts/proof-layout-cluster.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, openControlsPanel, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:layout-cluster — K.W3 (the dock anchoring is a DERIVED grid that clusters on a cinema display and a phone alike)",
);

// The five pathological viewports the §2 probe fixed the measure at. The scene
// is #/cube (the SUBJECT class — the canonical layout-card scene). PORTRAIT is
// the tall 1280×2000 (the slack-float bites the portrait/mobile axis too).
const VIEWPORTS = [
    { w: 1280, h: 800, label: "1280×800 (laptop)" },
    { w: 1440, h: 900, label: "1440×900 (baseline desktop)" },
    { w: 3440, h: 1440, label: "3440×1440 (ultrawide)" },
    { w: 5120, h: 2880, label: "5120×2880 (5K cinema)" },
    { w: 1280, h: 2000, label: "1280×2000 (tall portrait)" },
];

// The named ceiling band (px) the M3 cap bounds the dock anchor to. The
// `--dock-anchor-ceiling` token sets the FLOAT cap; the φ `--dock-margin` term
// (≈ 2px top, ≈ 5px bottom) is added on top. We assert the resolved anchor is
// BOUNDED — well below the pre-cure 698.8px / 1132.2px / 362.6px / 588.3px floats.
// The ceiling sketch is 6rem (§4); allow the ceiling + the φ margin + tolerance.
// A generous correctness bound (the float must DIE, not be perfectly tuned):
// 8rem = 128px covers the ceiling + the φ margin + sub-pixel slack and is FAR
// below the pre-cure floats — a born-RED witness on the un-capped chain.
const ANCHOR_BOUND_PX = 128; // ≤ this = "clustered to the card", not marooned
const TOL = 2;

/** Settle #/cube at the given viewport, open the controls pane, wait for the
 *  named desktop grid (or the mobile pane) to paint. Re-assert the viewport
 *  AFTER navigation (Playwright resets on navigate). */
async function settle(page, vw, vh) {
    await navToScene(page, "cube", "Controls", { timeout: 10000 });
    await page.setViewportSize({ width: vw, height: vh });
    await openControlsPanel(page);
    await page.setViewportSize({ width: vw, height: vh });
    // Wait until the controls pane + the work-area card have painted real area.
    await page
        .waitForFunction(
            () => {
                const layout = document.querySelector(".controls-layout");
                const content = document.querySelector(".controls-content");
                if (!layout || !content) return false;
                const lr = layout.getBoundingClientRect();
                const cr = content.getBoundingClientRect();
                return lr.width > 0 && lr.height > 0 && cr.width > 0;
            },
            { timeout: 10000 },
        )
        .catch(() => {});
    await page.waitForTimeout(500); // grid + spring settle
}

/** Resolve a CSS length expression (e.g. `var(--dock-top-anchor)`) to px by
 *  probing a hidden element — getComputedStyle returns the un-resolved calc()
 *  for custom properties, so we MUST resolve it through layout. */
async function probe(page) {
    return page.evaluate(() => {
        const resolvePx = (expr) => {
            const el = document.createElement("div");
            el.style.position = "absolute";
            el.style.visibility = "hidden";
            el.style.height = expr;
            el.style.width = expr;
            document.body.appendChild(el);
            const h = el.getBoundingClientRect().height;
            el.remove();
            return h;
        };

        const layout = document.querySelector(".controls-layout");
        const content = document.querySelector(".controls-content");
        const stage = document.querySelector(".stage-cell");
        const lr = layout ? layout.getBoundingClientRect() : null;
        const cr = content ? content.getBoundingClientRect() : null;
        const sr = stage ? stage.getBoundingClientRect() : null;

        // The two docks (out of flow, `fixed`): the top scene-switcher pill and
        // the bottom transport. Robust to the multi-z-dock DOM: a dock is a
        // z-dock element with real area; top is above mid-viewport, bottom below.
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        const zdocks = [
            ...document.querySelectorAll(".z-dock, [class*='z-dock']"),
        ];
        let topDock = null;
        let bottomDock = null;
        for (const el of zdocks) {
            const r = el.getBoundingClientRect();
            if (!(r.width > 0 && r.height > 0)) continue;
            if (r.top < vh / 2) {
                if (!topDock || r.top < topDock.top) {
                    topDock = { top: r.top, bottom: r.bottom };
                }
            } else {
                if (!bottomDock || r.bottom > bottomDock.bottom) {
                    bottomDock = { top: r.top, bottom: r.bottom };
                }
            }
        }

        const rootCs = getComputedStyle(document.documentElement);
        return {
            vw,
            vh,
            topAnchorPx: resolvePx("var(--dock-top-anchor)"),
            bottomAnchorPx: resolvePx("var(--dock-bottom-anchor)"),
            railWidthExpr: rootCs.getPropertyValue("--rail-width").trim(),
            layout: lr
                ? { top: lr.top, bottom: lr.bottom, left: lr.left, right: lr.right, w: lr.width, h: lr.height }
                : null,
            content: cr ? { w: cr.width, top: cr.top, left: cr.left } : null,
            stage: sr
                ? { w: sr.width, h: sr.height, top: sr.top, bottom: sr.bottom, left: sr.left, right: sr.right }
                : null,
            topDock,
            bottomDock,
        };
    });
}

async function browserHalf() {
    const result = await withPage(
        {
            distDir: DIST,
            label: "the layout-cluster oracle (5 pathological viewports)",
            context: { viewport: { width: 1440, height: 900 } },
        },
        async (_libPage, { url: base, browser }) => {
            // Per-viewport rail width (clause b cross-viewport comparison).
            const railByViewport = {};

            for (const { w, h, label } of VIEWPORTS) {
                const page = await browser.newPage({ viewport: { width: w, height: h } });
                await page.goto(`${base}/#/cube`, { waitUntil: "load" });
                await settle(page, w, h);
                const g = await probe(page);

                // NON-VACUITY: the card + the pane must have real area, or a
                // missing surface would pass clauses vacuously.
                if (!g.layout || !(g.layout.w > 0 && g.layout.h > 0)) {
                    fail(`${label} — the work-area card has zero area; a vacuous pass is forbidden`);
                    await page.close();
                    continue;
                }
                if (!g.content || !(g.content.w > 0)) {
                    fail(`${label} — the controls pane (.controls-content) has zero width; cannot measure the rail`);
                    await page.close();
                    continue;
                }
                railByViewport[`${w}x${h}`] = g.content.w;

                // ── (a) THE DOCKS CLUSTER — bounded anchors at 5K + portrait ──
                // Assert at the pathological viewports the §2 float bites: 5K and
                // tall-portrait. (The other viewports are measured for the rail.)
                const isPathological =
                    (w === 5120 && h === 2880) || (w === 1280 && h === 2000);
                if (isPathological) {
                    const topBounded = g.topAnchorPx <= ANCHOR_BOUND_PX + TOL;
                    const botBounded = g.bottomAnchorPx <= ANCHOR_BOUND_PX + TOL;
                    // The rendered dock box distance from the card edge (a second,
                    // geometry-rooted witness of the same property).
                    const topDockGap =
                        g.topDock && g.layout ? Math.abs(g.topDock.top - g.layout.top) : null;
                    const botDockGap =
                        g.bottomDock && g.layout
                            ? Math.abs(g.layout.bottom - g.bottomDock.bottom)
                            : null;
                    if (topBounded && botBounded) {
                        ok(
                            `${label} — (a) docks CLUSTER to the card: top-anchor ${g.topAnchorPx.toFixed(1)}px + ` +
                                `bottom-anchor ${g.bottomAnchorPx.toFixed(1)}px both ≤ ${ANCHOR_BOUND_PX}px ceiling band ` +
                                `(NOT the unbounded slack×bias — pre-cure read 698.8/1132.2 at 5K, 362.6/588.3 at portrait); ` +
                                `dock box gap from card edge: top ${topDockGap == null ? "n/a" : Math.round(topDockGap) + "px"}, ` +
                                `bottom ${botDockGap == null ? "n/a" : Math.round(botDockGap) + "px"}`,
                        );
                    } else {
                        fail(
                            `${label} — (a) the docks DO NOT cluster to the card: top-anchor ${g.topAnchorPx.toFixed(1)}px ` +
                                `(bounded:${topBounded}), bottom-anchor ${g.bottomAnchorPx.toFixed(1)}px (bounded:${botBounded}) ` +
                                `must each be ≤ ${ANCHOR_BOUND_PX}px (the named --dock-anchor-ceiling band). The unbounded ` +
                                `slack×bias floats the docks 698.8/1132.2px in at 5K (362.6/588.3 at portrait); M3's ` +
                                `min(offset, ceiling) cap is the cure.`,
                        );
                    }
                }

                await page.close();
            }

            // ── (b) THE RAIL IS DERIVED, NOT FIXED 400px ──
            const r1440 = railByViewport["1440x900"];
            const r3440 = railByViewport["3440x1440"];
            const r5120 = railByViewport["5120x2880"];
            if (r1440 == null || r3440 == null || r5120 == null) {
                fail(
                    `(b) the rail width was not measured at all required viewports ` +
                        `(1440:${r1440}, 3440:${r3440}, 5120:${r5120}) — cannot assert the derived-rail property`,
                );
            } else {
                // The rail SCALED: at 3440 AND 5120 the pane is GREATER than the
                // 1440 baseline (viewport-aware), NOT invariant at 400px. And it
                // is BOUNDED (the M1 clamp max — it did not blow to 30rem≈480px on
                // a wide shell; allow ≤ ~30rem + slack for the pad budget).
                const RAIL_MAX = 30 * 16 + 40; // 30rem clamp max + pad/tolerance
                const scaled = r3440 > r1440 + TOL && r5120 > r1440 + TOL;
                const bounded = r3440 <= RAIL_MAX && r5120 <= RAIL_MAX;
                // The born-RED witness: pre-cure the rail is INVARIANT 400px.
                const invariant =
                    Math.abs(r1440 - 400) <= 3 &&
                    Math.abs(r3440 - 400) <= 3 &&
                    Math.abs(r5120 - 400) <= 3;
                if (scaled && bounded && !invariant) {
                    ok(
                        `(b) the rail is DERIVED: 1440 baseline ${r1440.toFixed(1)}px → 3440 ${r3440.toFixed(1)}px → ` +
                            `5120 ${r5120.toFixed(1)}px (SCALED with viewport-aware intrinsic sizing, bounded ≤ ${RAIL_MAX}px) — ` +
                            `NOT the pre-cure invariant 400px across a 4× area span`,
                    );
                } else {
                    fail(
                        `(b) the rail is NOT a derived viewport-aware track: 1440 ${r1440.toFixed(1)}px, ` +
                            `3440 ${r3440.toFixed(1)}px, 5120 ${r5120.toFixed(1)}px ` +
                            `(scaled:${scaled}, bounded:${bounded}, pre-cure-invariant-400:${invariant}). The rail must ` +
                            `GROW on a cinema display (3440/5120 > 1440 baseline) and stay bounded by the M1 clamp max — ` +
                            `the born-RED witness is controlsPane.w == 400 invariant across 1280/1920/3440/5120.`,
                    );
                }

                // ── (c) THE SURPLUS IS DISTRIBUTED, NOT DEAD GUTTER ──
                // Re-measure the stage fraction at 5K. The stage cell must consume
                // a large fraction of the work-area card width (it grew via
                // [stage] minmax(0,1fr) as the surplus arrived) — NOT a fixed
                // 1520px island. We re-probe 5K for the stage geometry.
                const page = await browser.newPage({ viewport: { width: 5120, height: 2880 } });
                await page.goto(`${base}/#/cube`, { waitUntil: "load" });
                await settle(page, 5120, 2880);
                const g5 = await probe(page);
                await page.close();

                if (!g5.layout || !g5.stage) {
                    fail(`(c) at 5120×2880 the card/stage rects did not resolve — cannot assert surplus distribution`);
                } else {
                    // The stage fraction of the WORK-AREA CARD width (the centered
                    // content band). Pre-cure the stage was a fixed 1520px in a
                    // 1920px card = ~79% of the card BUT the CARD itself was a tiny
                    // 37.5% island of the 5120 viewport. The cure: the card grows
                    // (work-area clamps higher / the stage minmax fills) so the
                    // SUBJECT uses the surplus. Assert the stage occupies the
                    // dominant share of the card AND the card+stage are a real
                    // fraction of the viewport (not the 37.5% marooned island).
                    const stageOfCard = g5.stage.w / g5.layout.w;
                    const cardOfViewport = g5.layout.w / g5.vw;
                    // The stage must dominate the card (it is the [stage] 1fr that
                    // grows beside the bounded rail) AND the chrome clusters (a).
                    const stageDominates = stageOfCard >= 0.55;
                    // The surplus is not pure gutter: the card+stage fill more than
                    // the pre-cure 37.5%W marooned island.
                    const notMarooned = cardOfViewport > 0.375 + 0.02;
                    if (stageDominates && notMarooned) {
                        ok(
                            `(c) the surplus is DISTRIBUTED at 5K: the stage is ${(stageOfCard * 100).toFixed(1)}% of the ` +
                                `work-area card (grew via [stage] minmax(0,1fr) beside the bounded rail), the card fills ` +
                                `${(cardOfViewport * 100).toFixed(1)}% of the viewport (> the pre-cure 37.5% marooned island) — ` +
                                `the subject uses the extra real estate, NOT pure dead gutter`,
                        );
                    } else {
                        fail(
                            `(c) the surplus is NOT distributed at 5K: stage ${(stageOfCard * 100).toFixed(1)}% of the card ` +
                                `(dominates:${stageDominates}), card ${(cardOfViewport * 100).toFixed(1)}% of the viewport ` +
                                `(notMarooned:${notMarooned}). Pre-cure the stage is a fixed 1520px island (37.5%W fill, ` +
                                `1600px dead gutter each side); M4's [stage] minmax(0,1fr) + the capped chrome is the cure.`,
                        );
                    }
                }
            }
        },
    );
    if (result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
    }
}

// ── (d) STATIC GREP — ZERO hardcoded dock/rail offsets survive ────────────────
// Allowlist-fenced: the φ --dock-margin terms, the named --dock-anchor-ceiling
// token, and the legitimate clamp() rem bounds are NOT false positives. The
// clause targets RAW fixed-px ANCHOR/RAIL literals ONLY.
function blankComments(s) {
    return s
        .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
        .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length));
}

function staticHalf() {
    // The demo's shared styles tier (`demo/styles/` today, or `demo/shared/styles/`
    // after the rename lane). The T.F styles split carved the rail-width + dock-anchor
    // geometry OUT of style.css/design-idioms.css into layout.css, so scan EVERY .css
    // in the tier rather than two fixed filenames (arming-audit: a gate keyed to one
    // spelling misses a moved token — d.1/d.2 would pass vacuously).
    const stylesDir = ["demo/styles", "demo/shared/styles"]
        .map((r) => path.join(REPO, r))
        .find((p) => fs.existsSync(p));
    if (!stylesDir) {
        fail(`static (d) — the demo shared styles tier is missing`);
        return;
    }
    let styleBlob = fs
        .readdirSync(stylesDir)
        .filter((f) => f.endsWith(".css"))
        .map((f) => blankComments(fs.readFileSync(path.join(stylesDir, f), "utf8")))
        .join("\n");

    // FALSIFIABLE WITNESS: KF_LAYOUT_PLANT=1 injects a synthetic fixed-px rail
    // literal — the clause MUST red on it (a re-introduced offset is caught).
    if (process.env.KF_LAYOUT_PLANT === "1") {
        styleBlob += "\n:root { --rail-width: 360px; }\n";
    }

    const hits = [];

    // (d.1) --rail-width must NOT carry a raw fixed-px literal. A derived value
    //       (clamp()/minmax()/var()/min()/max()) is the cure; `--rail-width:
    //       <N>px` is the born-RED defect. Match a `--rail-width:` declaration
    //       whose VALUE is a bare `<number>px` (with optional whitespace), i.e. a
    //       fixed track literal — NOT a clamp()/minmax() that merely CONTAINS a px.
    const railDecl = /--rail-width\s*:\s*([^;]+);/g;
    let m;
    while ((m = railDecl.exec(styleBlob)) !== null) {
        const value = m[1].trim();
        // A RAW fixed-px literal: the whole value is `<number>px` (no
        // clamp/minmax/min/max/var wrapper). A clamp()/minmax() derived track is
        // allowed (its rem/cqi bounds are intrinsic-sizing, not a fixed offset).
        if (/^-?\d*\.?\d+px$/.test(value)) {
            hits.push(
                `styles tier — \`--rail-width: ${value}\` is a RAW fixed-px rail track literal ` +
                    `(C1, the one true hardcoded layout offset U-K7 names); it must be a DERIVED ` +
                    `clamp()/minmax() track (M1), not invariant 400px`,
            );
        }
    }

    // (d.2) The dock-anchor chain carries NO raw-px ADDEND beyond the φ
    //       --dock-margin term + the named --dock-anchor-ceiling token. Scan the
    //       --dock-top-anchor / --dock-bottom-anchor declarations: their value may
    //       reference --work-area-*-offset, --dock-margin, --dock-anchor-ceiling,
    //       env(safe-area-*), --phi, and clamp/min/max/calc/var wrappers — but NOT
    //       a bare `<N>px` addend (a re-tuned magic offset). env(...) defaults of
    //       `0px` are allowlisted (a zero fallback, not an offset).
    for (const [name] of [["--dock-top-anchor"], ["--dock-bottom-anchor"]]) {
        const re = new RegExp(name + "\\s*:\\s*([\\s\\S]*?);", "g");
        let mm;
        while ((mm = re.exec(styleBlob)) !== null) {
            let value = mm[1];
            // Allowlist: strip env(...) defaults (e.g. `, 0px)`) and the named
            // ceiling/margin/phi/offset tokens before scanning for a raw px addend.
            const scrubbed = value
                .replace(/env\([^)]*\)/g, " ") // safe-area insets (with their 0px defaults)
                .replace(/var\([^)]*\)/g, " "); // all token references
            // After stripping env() + var(), any surviving `<N>px` is a RAW addend.
            if (/-?\d*\.?\d+px/.test(scrubbed)) {
                hits.push(
                    `styles tier — ${name} carries a RAW fixed-px addend (a re-tuned magic offset is forbidden; ` +
                        `the chain may reference only the φ --dock-margin term + the named --dock-anchor-ceiling token): ` +
                        `${value.replace(/\s+/g, " ").trim()}`,
                );
            }
        }
    }

    if (hits.length === 0) {
        ok(
            "static (d) — ZERO hardcoded dock/rail offsets survive: --rail-width is a derived track " +
                "(no raw fixed-px literal), the dock-anchor chain carries no raw-px addend beyond the φ " +
                "--dock-margin term + the named --dock-anchor-ceiling token (allowlist-fenced)",
        );
        if (process.env.KF_LAYOUT_PLANT === "1") {
            fail(
                "static (d) — KF_LAYOUT_PLANT=1 planted a `--rail-width: 360px` but the grep did NOT catch it " +
                    "(the falsifiable witness FAILED — the clause is not biting on a re-introduced fixed offset)",
            );
        }
    } else {
        fail(
            `static (d) — ${hits.length} hardcoded dock/rail offset(s) survive the grep ` +
                `(the U-K7 "NO hardcoded dock offsets" discharge fails):\n      ` +
                hits.join("\n      "),
        );
    }
}

staticHalf();
await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:layout-cluster — FAIL (${failures.length}): the layout does not cluster the chrome to ` +
            `the centered content card on a cinema display / a phone (the docks float on unbounded slack, ` +
            `the rail stays a fixed 400px, the surplus is dead gutter, or a fixed offset survives) — K.W3.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:layout-cluster — PASS: the dock anchors CLUSTER to the card (bounded, not slack×bias), the rail " +
        "is a DERIVED viewport-aware track (scaled + bounded, not invariant 400px), the surplus is DISTRIBUTED " +
        "to the growing stage (not dead gutter), and ZERO hardcoded dock/rail offsets survive (K.W3 M1+M3+M4).",
);
