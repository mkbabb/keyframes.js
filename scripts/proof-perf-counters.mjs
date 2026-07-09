#!/usr/bin/env node
/**
 * proof:perf-counters — T.G7 (lane 32 T-PERF-B). BORN-RED, authority=OWNER.
 *
 * ── THE MEASURED BLINDSPOT THIS GATE CURES ───────────────────────────────────
 * The perf instrument closest in spirit to VERDICT #19 — proof:perf-frame-budget
 * — is STRUCTURALLY BLIND to the churn/thrash cost lane 11 named. Its
 * `requestAnimationFrame`-INTERVAL sampler measures how fast the MAIN-THREAD
 * callback loop iterates and, in this project's headless harness (no vsync pump),
 * the loop free-runs at ~120Hz INDEPENDENT of the per-frame WORK: it reads cube
 * at "0 dropped @120Hz" while the cube in fact forces a STYLE RECALC on EVERY one
 * of those 120 frames and never reaches rest, and spring re-LAYS-OUT on every
 * frame (the `left`-animation thrash). The interval sampler cannot feel per-frame
 * work; the CDP Performance-domain COUNTERS can (lane 32 §2.1).
 *
 * ── WHAT IT MEASURES (the CDP-counter methodology, device-independent) ────────
 * Over a fixed window on each measured surviving scene, read the CDP
 * `RecalcStyleCount` / `LayoutCount` deltas AND the rAF frame count over the SAME
 * window, and gate the DEVICE-INDEPENDENT PER-FRAME RATIOS:
 *
 *   recalcPerFrame = RecalcStyleCount delta / rAF frames    (≈ "restyles/frame")
 *   layoutPerFrame = LayoutCount delta       / rAF frames    (≈ "layouts/frame")
 *
 * The frame count cancels the harness's free-running rate (a slower box fires
 * fewer frames AND accrues proportionally fewer recalcs), so these ratios are
 * device-independent architecture-truth — NOT a fresh absolute ms number (the
 * C-10 / K3 discipline; expressed through portable-perf's ratioGateValue). A
 * scene at TRUE REST restyles/re-lays-out on ~0 of its frames; square, sequence
 * and amiga measure 0.00/frame in the SAME run — proof the budget is achievable,
 * not a device artifact. cube (1.00 recalc/frame — restyles every frame, never
 * rests) and spring (2.03 recalc + 1.00 layout/frame — the `left` thrash) and
 * easing (1.82 + 0.76) are far over budget: born-RED.
 *
 * ── WHY NOT THE BLUR (the honest scope note) ─────────────────────────────────
 * `backdrop-filter` blur (VERDICT #19 root cause #1) is a compositor/GPU raster
 * cost INVISIBLE to these main-thread CDP counters in headless Chromium
 * (measured: neutralizing every backdrop-filter left cube's TaskDuration flat —
 * which is exactly why proof:blur-not-resampled uses an fps toggle, not a
 * counter). This gate owns the OTHER half of the counter methodology: the
 * no-true-rest per-frame RECALC churn (T.G3) and the LAYOUT thrash (T.G4). The
 * live backdrop-surface census is RECORDED here as context (the surviving scenes'
 * chrome), its blur cost gated by proof:blur-not-resampled.
 *
 * ── BORN-RED · OWNER · REGISTERED ────────────────────────────────────────────
 * Reds today at lane 11's measured per-frame ratios. Declares authority=OWNER
 * (the OWNER perceived-perf bar, VERDICT #19; scripts/gate-authority.mjs) and
 * rides the T_BORNRED_BACKLOG (scripts/gate-bands.mjs) as a RECORDED tripwire —
 * kept OUT of every blocking aggregator, never demoted to the demo-roster OBSERVE
 * bucket (the blocking-not-OBSERVE tooth, T.M6.2 — the demotion that let "85/85
 * green" coexist with a 20fps stage). dischargedBy T.G3 (scenes reach true rest —
 * the recalc-per-frame half) + T.G4 (transform-not-`left` — the layout-per-frame
 * half).
 *
 * Harness: scripts/lib/demo-driver.mjs withPage (serve dist/gh-pages + resolve
 * chromium via KF_PLAYWRIGHT_DIR + teardown; a playwright-absent skip becomes a
 * hard fail under KF_REQUIRE_BROWSER). Counters: scripts/lib/cdp-perf.mjs.
 * Re-runnable: `KF_PLAYWRIGHT_DIR=… node scripts/proof-perf-counters.mjs`.
 */
import { ratioGateValue } from "./lib/portable-perf.mjs";
import {
    attachCounters,
    measurePerFrame,
    countBackdropSurfaces,
} from "./lib/cdp-perf.mjs";
import { SCENE_MACHINE_KEY, withPage } from "./lib/demo-driver.mjs";

// The surviving scenes measured for the born-RED per-frame budget (post-OD-1
// prune: compose/morph/motion-path deleted). cube + spring + easing carry the
// churn/thrash; square + sequence are the same-run GREEN references (0.00/frame)
// that prove the budget is achievable. amiga is WebGL (0 DOM recalc) — its GL
// budget is proof:amiga-budget (T.G5), not this DOM-counter gate.
const MEASURED = ["cube", "spring", "easing"];
const REFERENCES = ["square", "sequence"];
const WINDOW_MS = 2000;

// The per-frame budgets (device-independent same-report ratios). A scene at true
// rest recalcs/lays-out on ~0 of its frames (square/sequence measure 0.00). The
// ceilings sit well above 0 (measurement headroom) and far below the born-RED
// per-frame-every-frame reality (cube 1.00 recalc, spring 1.00 layout):
const RECALC_PER_FRAME_CEIL = 0.5; // a restyle on >half the frames ⇒ no rest
const LAYOUT_PER_FRAME_CEIL = 0.3; // a layout on >0.3 of frames ⇒ the thrash

const failures = [];
const fail = (label) => { failures.push(label); console.error(`  ✗ ${label}`); };
const note = (label) => console.log(`  · ${label}`);
const ok = (label) => console.log(`  ✓ ${label}`);

console.log(
    `proof:perf-counters — T.G7 (the CDP-counter methodology; the rAF-interval ` +
        `blindspot cure) · per-frame budgets: recalc ≤ ${RECALC_PER_FRAME_CEIL}/frame · ` +
        `layout ≤ ${LAYOUT_PER_FRAME_CEIL}/frame · window=${WINDOW_MS}ms`,
);

async function openAndMeasure(page, base, scene) {
    await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
    await page
        .waitForFunction(
            ([mk, s]) => {
                try {
                    return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s;
                } catch {
                    return false;
                }
            },
            [SCENE_MACHINE_KEY, scene],
            { timeout: 8000 },
        )
        .catch(() => {});
    // Rest the route so cold-mount long-tasks don't pollute the window (we
    // measure the STEADY churn, not the boot).
    await page.waitForTimeout(1200);
    const cdp = await attachCounters(page);
    const m = await measurePerFrame(page, { windowMs: WINDOW_MS, cdp });
    const surfaces = await countBackdropSurfaces(page);
    return { m, surfaces };
}

async function browserHalf() {
    const result = await withPage(
        {
            label: "the perf-counters per-frame CDP budgets",
            context: { viewport: { width: 1440, height: 900 } },
        },
        async (page, { url: base }) => {
            // The GREEN references first — same run, same harness: proof the
            // budget is achievable (rested scenes read ~0.00/frame).
            for (const scene of REFERENCES) {
                const { m } = await openAndMeasure(page, base, scene);
                note(
                    `reference /${scene}: recalc=${m.recalcPerFrame.toFixed(2)}/frame · ` +
                        `layout=${m.layoutPerFrame.toFixed(2)}/frame (frames=${m.frames}) — ` +
                        `the same-run proof a rested scene is ~0/frame.`,
                );
            }
            // The MEASURED surviving scenes — the born-RED per-frame budgets.
            for (const scene of MEASURED) {
                const { m, surfaces } = await openAndMeasure(page, base, scene);
                const tag =
                    `/${scene}: recalc=${m.recalcPerFrame.toFixed(2)}/frame · ` +
                    `layout=${m.layoutPerFrame.toFixed(2)}/frame (recalc=${m.recalcCount}, ` +
                    `layout=${m.layoutCount}, frames=${m.frames}, backdrop-surfaces=${surfaces})`;
                note(tag);
                const rc = ratioGateValue({
                    label: `${scene} recalc/frame`,
                    baseline: m.frames,
                    candidate: m.recalcCount,
                    direction: "atMost",
                    ceilFraction: RECALC_PER_FRAME_CEIL,
                    posture: "hard",
                    fail,
                    note,
                });
                const lc = ratioGateValue({
                    label: `${scene} layout/frame`,
                    baseline: m.frames,
                    candidate: m.layoutCount,
                    direction: "atMost",
                    ceilFraction: LAYOUT_PER_FRAME_CEIL,
                    posture: "hard",
                    fail,
                    note,
                });
                if (rc?.pass && lc?.pass) {
                    ok(
                        `/${scene} reaches rest: recalc ${rc.ratio.toFixed(2)}/frame ≤ ` +
                            `${RECALC_PER_FRAME_CEIL} AND layout ${lc.ratio.toFixed(2)}/frame ≤ ` +
                            `${LAYOUT_PER_FRAME_CEIL} — the per-frame churn/thrash is closed.`,
                    );
                }
            }
            return true;
        },
    );
    if (result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
        return { skipped: true };
    }
    return { skipped: false };
}

const outcome = await browserHalf();

if (outcome.skipped) {
    // A skip is not a green: the born-RED proof needs a browser. Under
    // KF_REQUIRE_BROWSER the withPage seam already hard-failed; locally a skip
    // exits 0 (unmeasurable, not passing) — the sibling browser gates' posture.
    process.exit(0);
}
if (failures.length > 0) {
    console.error(
        `\nproof:perf-counters — FAIL (${failures.length}) [BORN-RED · authority=OWNER · ` +
            `T_BORNRED_BACKLOG, dischargedBy T.G3 (rest) + T.G4 (transform-not-left)]: surviving ` +
            `scene(s) restyle and/or re-lay-out on more than their per-frame budget — the ` +
            `no-true-rest churn (cube restyles every frame; VERDICT #19 "god awful") and the ` +
            `\`left\`-animation LAYOUT thrash (spring lays out every frame; T.G4). The rAF-interval ` +
            `sampler (proof:perf-frame-budget) is blind to this per-frame work; these CDP counters ` +
            `are not. Greens once T.G3 settles the preview loops + T.G4 moves position onto ` +
            `\`transform\`. Recorded tripwire — never blocks the roster; CI tolerates the red via ` +
            `the EXCLUDED registration.`,
    );
    process.exit(1);
}
console.log(
    `\nproof:perf-counters — PASS: every measured surviving scene restyles and re-lays-out ` +
        `within its per-frame budget (the no-true-rest churn + the \`left\` layout thrash are ` +
        `closed). T.G3 + T.G4 have landed; discharge this row from T_BORNRED_BACKLOG.`,
);
