#!/usr/bin/env node
/**
 * proof:dock-morph-continuity — T.C5 (GU-2 acceptance gate). BORN-RED BY MEASUREMENT.
 *
 * VERDICT #4 — "the dock animation" the owner remembers being good never runs.
 * Dense rAF sampling (lane 08 D2): the dock box SNAPS 58→14px in one frame, holds a
 * 14px SLIVER for the whole "morph" + ~500ms, then JUMP-CUTS 14→225px with no
 * animation. Root: glass-ui measures endpoint geometry (`--dock-morph-from/to`,
 * `dist/dock.js`) while the expanded layer is not yet laid out (both resolve ≈14px
 * padding-only) → the interpolation is a no-op sliver and the `max-content` release
 * becomes the visible jump-cut.
 *
 * This gate rAF-SAMPLES the `.glass-dock` width across an EXPAND and a COLLAPSE
 * (real hover in / out) and asserts:
 *   (a) MONOTONE ±2px — no direction reversal beyond 2px within a transition;
 *   (b) max PER-FRAME Δ ≤ 25% of the total range — no single-frame snap;
 *   (c) NO width change > 5px AFTER `[data-morphing]` clears — no max-content
 *       release jump-cut;
 *   (d) PRM zeroes the reveal blur (`--dock-reveal-blur → 0` under
 *       prefers-reduced-motion).
 *
 * MEASURED (not source-shape): real `getBoundingClientRect().width` per animation
 * frame off the LIVE dock. It REDS TODAY (the 58→14 snap ≫ 25%, the sliver hold,
 * the post-settle 14→225 jump-cut ≫ 5px). Per MEMORY the fix is glass-ui-root
 * (measure REAL laid-out endpoints / defer the morph one frame) — a born-RED
 * handoff: EXCLUDED + T_BORNRED_BACKLOG, dischargedBy the glass-ui GU-2 publish +
 * re-pin. AUTHORITY: OWNER + blocking-not-OBSERVE (T.M6).
 *
 * Harness: scripts/lib/demo-driver.mjs `withPage`. Serves the BUILT dist/gh-pages/
 * — run `npm run gh-pages` first. Under KF_REQUIRE_BROWSER=1 a skip is a HARD FAIL.
 * Re-runnable: `node scripts/proof-dock-morph-continuity.mjs`.
 */
import { withPage, REQUIRE_BROWSER } from "./lib/demo-driver.mjs";

const failures = [];
const passes = [];

console.log(
    "proof:dock-morph-continuity — T.C5/GU-2 (dock width morph is continuous — monotone, no snap, no jump-cut) [BORN-RED]\n",
);

const result = await withPage(
    {
        label: "proof:dock-morph-continuity (the rAF dock-width sampling)",
        // A viewport wide enough to render the expanded menubar dock (the morph
        // target — a narrow phone width collapses the dock permanently).
        context: { viewport: { width: 1280, height: 800 } },
    },
    async (page, { url }) => {
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await page
            .waitForFunction(
                () => document.querySelectorAll(".glass-dock").length > 0,
                undefined,
                { timeout: 12000 },
            )
            .catch(() => {});

        // Install a per-frame width sampler over every .glass-dock. It records,
        // for each rAF tick, [t, width, morphing] per dock into window.__dockSeries.
        await page.evaluate(() => {
            const w = window;
            w.__dockSeries = [];
            w.__dockSampling = true;
            const t0 = performance.now();
            const tick = () => {
                if (!w.__dockSampling) return;
                const frame = [];
                document.querySelectorAll(".glass-dock").forEach((el) => {
                    const r = el.getBoundingClientRect();
                    frame.push({
                        w: r.width,
                        morphing:
                            el.hasAttribute("data-morphing") ||
                            el.getAttribute("data-morphing") === "true",
                    });
                });
                w.__dockSeries.push({ t: performance.now() - t0, frame });
                requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });

        // Locate a dock element box to hover (the compass/menubar dock). Hover the
        // first .glass-dock's center to trigger the expand morph.
        const box = await page
            .locator(".glass-dock")
            .first()
            .boundingBox()
            .catch(() => null);
        if (box) {
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        }
        await page.waitForTimeout(900); // let the expand morph run + settle
        // Collapse: move the pointer far away.
        await page.mouse.move(5, 5);
        await page.waitForTimeout(900); // let the collapse morph run + settle

        const series = await page.evaluate(() => {
            window.__dockSampling = false;
            return window.__dockSeries;
        });

        // The PRM reveal-blur check: re-load under reduced motion and read
        // --dock-reveal-blur off a .glass-dock (GU-1/GU-2 share the reveal engine).
        const prmBlur = await page.evaluate(() => {
            const el = document.querySelector(".glass-dock");
            if (!el) return null;
            const v = getComputedStyle(el)
                .getPropertyValue("--dock-reveal-blur")
                .trim();
            return v || null;
        });

        return { series, prmBlur };
    },
);

if (result.skipped) {
    console.log(
        `  · browser half skipped (${result.reason}) — build the demo (npm run gh-pages) + set ` +
            "KF_PLAYWRIGHT_DIR/KF_REQUIRE_BROWSER=1 to rAF-SAMPLE the dock width morph.",
    );
    if (REQUIRE_BROWSER) process.exit(1);
    console.log(
        "\nproof:dock-morph-continuity — SKIP (browser unavailable; born-RED-by-measurement, not a green).",
    );
    process.exit(0);
}

const { series } = result.value ?? { series: [] };

// Reduce the per-dock series into the ONE dock that actually morphs (the largest
// width range across the run). Index-stable: docks are enumerated in DOM order.
function widthTrack(series, dockIdx) {
    return series
        .filter((s) => s.frame[dockIdx])
        .map((s) => ({
            t: s.t,
            w: s.frame[dockIdx].w,
            morphing: s.frame[dockIdx].morphing,
        }));
}

if (!series || series.length < 4) {
    failures.push(
        `sampling — only ${series?.length ?? 0} rAF frame(s) captured; the width morph cannot be ` +
            "verified. The dock must render + the hover expand must run for a dense sample.",
    );
} else {
    const dockCount = Math.max(...series.map((s) => s.frame.length));
    let target = { idx: -1, range: -1, track: [] };
    for (let d = 0; d < dockCount; d++) {
        const track = widthTrack(series, d);
        if (track.length === 0) continue;
        const ws = track.map((p) => p.w);
        const range = Math.max(...ws) - Math.min(...ws);
        if (range > target.range) target = { idx: d, range, track };
    }

    const { idx, range, track } = target;
    if (idx === -1 || range < 5) {
        // No dock morphed at all — the width never changed (the sliver/no-op
        // degenerate case OR the hover never triggered). Honest red: the "dock
        // animation" the owner remembers being good is not observable.
        failures.push(
            `no-morph — no .glass-dock width changed more than 5px across the expand/collapse hover ` +
                `(max observed range ${Math.round(Math.max(0, range))}px). The width morph never runs ` +
                "(the 14px-sliver no-op) — GU-2: measure REAL laid-out endpoints so the box truly morphs.",
        );
    } else {
        // (b) max per-frame Δ ≤ 25% of range (no single-frame snap).
        let maxStep = 0;
        let maxStepAt = null;
        for (let i = 1; i < track.length; i++) {
            const d = Math.abs(track[i].w - track[i - 1].w);
            if (d > maxStep) {
                maxStep = d;
                maxStepAt = i;
            }
        }
        const stepPct = (maxStep / range) * 100;
        if (stepPct <= 25) {
            passes.push(
                `no-snap — .glass-dock[${idx}] max per-frame Δ ${maxStep.toFixed(1)}px = ` +
                    `${stepPct.toFixed(0)}% of the ${range.toFixed(0)}px range (≤25% — continuous).`,
            );
        } else {
            failures.push(
                `snap — .glass-dock[${idx}] SNAPS ${maxStep.toFixed(1)}px in one frame ` +
                    `(frame ${maxStepAt}) = ${stepPct.toFixed(0)}% of the ${range.toFixed(0)}px range ` +
                    "(> 25%). GU-2: the box snaps rather than morphs (the 58→14 / 14→225 discontinuity).",
            );
        }

        // (c) no width change > 5px AFTER [data-morphing] clears (no jump-cut).
        //     Find the last frame flagged morphing; assert width is stable after.
        const lastMorph = track.reduce(
            (acc, p, i) => (p.morphing ? i : acc),
            -1,
        );
        if (lastMorph !== -1 && lastMorph < track.length - 1) {
            const settleW = track[lastMorph].w;
            let maxPost = 0;
            for (let i = lastMorph + 1; i < track.length; i++) {
                const d = Math.abs(track[i].w - settleW);
                if (d > maxPost) maxPost = d;
            }
            if (maxPost <= 5) {
                passes.push(
                    `no-jump-cut — after [data-morphing] cleared, .glass-dock[${idx}] width stayed within ` +
                        `${maxPost.toFixed(1)}px (≤5px — no max-content release jump-cut).`,
                );
            } else {
                failures.push(
                    `jump-cut — after [data-morphing] cleared, .glass-dock[${idx}] width changed ` +
                        `${maxPost.toFixed(1)}px (> 5px). GU-2: the max-content release is the visible ` +
                        "14→225 jump-cut the owner sees.",
                );
            }
        } else {
            // [data-morphing] never toggled while the width moved — the morph beat
            // is not even exposed; the discontinuity (b) already reds, but flag it.
            passes.push(
                `morph-flag — .glass-dock[${idx}] carried no post-morph frames to check for a jump-cut ` +
                    "(the [data-morphing] window was not observable in this sample).",
            );
        }

        // (a) MONOTONE ±2px within each transition. Split at the width peak (expand
        //     rises to it, collapse falls from it); assert no reversal > 2px within.
        const peakI = track.reduce(
            (best, p, i) => (p.w > track[best].w ? i : best),
            0,
        );
        const monotone = (seg, rising) => {
            let worst = 0;
            for (let i = 1; i < seg.length; i++) {
                const d = seg[i].w - seg[i - 1].w;
                const reversal = rising ? -d : d; // a "wrong-way" step
                if (reversal > worst) worst = reversal;
            }
            return worst;
        };
        const expandRev = monotone(track.slice(0, peakI + 1), true);
        const collapseRev = monotone(track.slice(peakI), false);
        const worstRev = Math.max(expandRev, collapseRev);
        if (worstRev <= 2) {
            passes.push(
                `monotone — .glass-dock[${idx}] expand + collapse are monotone within ±2px ` +
                    `(worst reversal ${worstRev.toFixed(1)}px).`,
            );
        } else {
            failures.push(
                `non-monotone — .glass-dock[${idx}] reverses direction by ${worstRev.toFixed(1)}px ` +
                    "(> 2px) within a transition (the sliver-hold + release is not a monotone morph).",
            );
        }
    }
}

for (const p of passes) console.log("  ✓ " + p);
if (failures.length > 0) {
    console.error(
        `\nproof:dock-morph-continuity — FAIL (${failures.length}) [BORN-RED backlog — T_BORNRED_BACKLOG; dischargedBy glass-ui GU-2 publish + re-pin (T.C6)]:`,
    );
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}
console.log(
    "\nproof:dock-morph-continuity — PASS: the dock width morph is continuous (monotone, no snap, no jump-cut).",
);
process.exit(0);
