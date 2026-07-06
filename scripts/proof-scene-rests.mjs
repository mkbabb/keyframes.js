#!/usr/bin/env node
/**
 * proof:scene-rests — T.G3 (lane 11 T3). authority=INSTRUMENT.
 *
 * ── THE DEFECT THIS GATE FORBIDS ─────────────────────────────────────────────
 * With ZERO interaction and no play pressed, scenes never rested: lane 11 §4
 * measured spring burning 33% of one core forcing 90 layouts/second, morph 11%
 * CPU rendering a bare grid, easing 14% forcing 28 layouts/s — perpetual preview
 * loops with no stop + per-frame reactive writes. A scene at TRUE REST does no
 * layout, no style recalc, and burns ~0 CPU when nothing is happening. The cure
 * (T.G3, batch ⑧): every preview loop terminates when its animation settles
 * (autoPlays:false + the cube idle-bob removed); no reactive ref is written
 * per-frame at 60Hz.
 *
 * ── WHAT IT ASSERTS (the cross-scene TRUE-REST oracle) ───────────────────────
 * After a 4.5s settle (cold-mount long-tasks drain), over a 3s idle window, each
 * measured scene holds:
 *   • idle LayoutCount   < LAYOUT_CEIL   (no perpetual layout — device-independent)
 *   • idle RecalcStyleCount < RECALC_CEIL (no perpetual style recalc — device-independent)
 *   • idle TaskDuration  < TASK_MS_CEIL  (a GENEROUS CPU-burn sanity bound; the
 *                                         absolute is machine-dependent so it is
 *                                         set loose — true rest measures ~0.5–1%)
 * proof:perf-counters owns the PER-FRAME recalc/layout RATIO on cube/spring/easing;
 * this gate owns the ABSOLUTE idle counts + the CPU-busy (TaskDuration) axis across
 * the WHOLE surviving CSS-scene set (lane 11 names this band the cross-scene rest
 * oracle + the CDP-counter measurement seam). Measured GREEN this run: cube 0/0,
 * amiga 0/0, square 0/0, easing 0/0, spring 0/0, sequence 0/0 — all < 1% busy.
 *
 * ── HOME (the honest exemption) ──────────────────────────────────────────────
 * /home is EXEMPT: its hero carries the owner-blessed Aurora (OD-2 APPROVED,
 * "more subtle" — an INTENTIONAL perpetual gradient paint, not a stuck preview
 * loop). It is not a true-rest candidate by design. Measured a benign ~1.9% busy
 * / 12 layouts over 3s — two orders of magnitude below the 33%-CPU thrash T.G3
 * targets — but a designed hero animation is not "rest", so it is recorded, not
 * gated. (A future home-rest concern — settling the Aurora off-viewport — is
 * T.D/T.G3-home, not this cross-scene oracle.)
 *
 * ── AUTHORITY · WIRING ───────────────────────────────────────────────────────
 * INSTRUMENT (a measured idle-count fact, not the owner perceived-perf bar).
 * Blocking member of proof:demo-correctness. Harness: scripts/lib/demo-driver.mjs
 * withPage; counters: scripts/lib/cdp-perf.mjs. Re-runnable:
 * `KF_PLAYWRIGHT_DIR=… node scripts/proof-scene-rests.mjs`.
 */
import { attachCounters, measureCounters } from "./lib/cdp-perf.mjs";
import { SCENE_MACHINE_KEY, withPage } from "./lib/demo-driver.mjs";

// The surviving CSS scenes that must reach TRUE REST (post-OD-1 prune). /home is
// EXEMPT (the owner-blessed Aurora hero — an intentional perpetual paint).
const MEASURED = ["cube", "square", "easing", "spring", "sequence"];
// amiga is WebGL: its DOM rest (layout+recalc=0) is gated here, but its GL raster
// CPU is proof:amiga-budget's domain (T.G5) — so its TaskDuration is RECORDED,
// not gated by this DOM-rest oracle (it idles ~1% but the GL raster varies).
const DOM_ONLY = ["amiga"];
const EXEMPT = ["home"]; // measured + recorded, not gated (the Aurora hero, OD-2)
const SETTLE_MS = 4500;
const WINDOW_MS = 3000;

// The idle rest budgets. The DEVICE-INDEPENDENT true-rest tells are
// LayoutCount + RecalcStyleCount at ~0 — a perpetual preview loop that MOVES
// something re-lays-out, one that WRITES styles restyles, and neither count
// scales with the machine (a rested scene is 0/0 on any box, the C-10 discipline
// applied to this oracle). TaskDuration (wall-clock CPU) is inherently
// machine/contention-DEPENDENT, so it rides a GENEROUS ceiling: it exists only
// to catch a gross pure-JS burn loop that shows in neither DOM count, set far
// above a rested scene's ~15–30ms idle overhead yet far below the perpetual-loop
// reality T.G3 cured (spring 33% CPU = ~990ms / morph 11% = ~330ms over 3s).
const LAYOUT_CEIL = 5; // > a handful of layouts over 3s ⇒ a live loop
const RECALC_CEIL = 30; // a few restyles are noise; hundreds ⇒ perpetual churn
const TASK_MS_CEIL = 150; // 150/3000 = 5% — contention-robust; true rest is ~0.5–1%

const failures = [];
const fail = (label) => { failures.push(label); console.error(`  ✗ ${label}`); };
const ok = (label) => console.log(`  ✓ ${label}`);
const note = (label) => console.log(`  · ${label}`);

console.log(
    `proof:scene-rests — T.G3 (scenes reach true rest) · authority=INSTRUMENT · ` +
        `after ${SETTLE_MS}ms settle over ${WINDOW_MS}ms: layout < ${LAYOUT_CEIL} · ` +
        `recalc < ${RECALC_CEIL} (device-independent) · task < ${TASK_MS_CEIL}ms (loose CPU bound)`,
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
    // Settle: let cold-mount long-tasks + any settle-and-stop preview loops drain.
    await page.waitForTimeout(SETTLE_MS);
    const cdp = await attachCounters(page);
    return measureCounters(page, { windowMs: WINDOW_MS, cdp });
}

async function browserHalf() {
    const result = await withPage(
        {
            label: "the cross-scene true-rest idle budgets",
            context: { viewport: { width: 1440, height: 900 } },
        },
        async (page, { url: base }) => {
            for (const scene of EXEMPT) {
                const m = await openAndMeasure(page, base, scene);
                note(
                    `EXEMPT /${scene} (owner-blessed Aurora hero, OD-2): ` +
                        `layout=${m.layoutCount} recalc=${m.recalcCount} ` +
                        `task=${m.taskMs.toFixed(1)}ms busy=${(m.busyFraction * 100).toFixed(1)}% ` +
                        `— recorded, not gated (an intentional perpetual paint, not a stuck loop)`,
                );
            }
            for (const scene of DOM_ONLY) {
                const m = await openAndMeasure(page, base, scene);
                note(
                    `/${scene} (WebGL — GL raster CPU is proof:amiga-budget/T.G5): ` +
                        `layout=${m.layoutCount} recalc=${m.recalcCount} ` +
                        `task=${m.taskMs.toFixed(1)}ms busy=${(m.busyFraction * 100).toFixed(1)}% (recorded)`,
                );
                const bad = [];
                if (m.layoutCount >= LAYOUT_CEIL) bad.push(`layout ${m.layoutCount} ≥ ${LAYOUT_CEIL}`);
                if (m.recalcCount >= RECALC_CEIL) bad.push(`recalc ${m.recalcCount} ≥ ${RECALC_CEIL}`);
                if (bad.length === 0) {
                    ok(
                        `/${scene} reaches DOM TRUE REST: ${m.layoutCount} layout · ` +
                            `${m.recalcCount} recalc over ${WINDOW_MS}ms idle — no perpetual DOM ` +
                            `loop (its GL raster budget is proof:amiga-budget)`,
                    );
                } else {
                    fail(`/${scene} never DOM-rests: ${bad.join(", ")} over ${WINDOW_MS}ms idle`);
                }
            }
            for (const scene of MEASURED) {
                const m = await openAndMeasure(page, base, scene);
                const tag =
                    `/${scene}: layout=${m.layoutCount} recalc=${m.recalcCount} ` +
                    `task=${m.taskMs.toFixed(1)}ms busy=${(m.busyFraction * 100).toFixed(1)}%`;
                note(tag);
                const bad = [];
                if (m.layoutCount >= LAYOUT_CEIL) bad.push(`layout ${m.layoutCount} ≥ ${LAYOUT_CEIL}`);
                if (m.recalcCount >= RECALC_CEIL) bad.push(`recalc ${m.recalcCount} ≥ ${RECALC_CEIL}`);
                if (m.taskMs >= TASK_MS_CEIL) bad.push(`task ${m.taskMs.toFixed(1)}ms ≥ ${TASK_MS_CEIL}ms`);
                if (bad.length === 0) {
                    ok(
                        `/${scene} reaches TRUE REST: ${m.layoutCount} layout · ` +
                            `${m.recalcCount} recalc · ${(m.busyFraction * 100).toFixed(1)}% CPU ` +
                            `over ${WINDOW_MS}ms idle — no perpetual loop`,
                    );
                } else {
                    fail(`/${scene} never rests: ${bad.join(", ")} over ${WINDOW_MS}ms idle`);
                }
            }
            return true;
        },
    );
    return result;
}

const outcome = await browserHalf();
if (outcome.skipped) {
    // A skip is unmeasurable, not passing — the sibling browser gates' posture.
    console.log(`  ○ browser half skipped — ${outcome.reason}`);
    process.exit(0);
}
if (failures.length > 0) {
    console.error(
        `\nproof:scene-rests — FAIL (${failures.length}): a surviving scene never reaches ` +
            `true rest — it lays out / restyles / burns CPU with zero interaction (the T.G3 ` +
            `defect: a perpetual preview loop or a per-frame reactive write). Gate the loop on ` +
            `its \`settled\` register + cap reactive readouts; it must idle at ~0/0 and < 1% CPU.`,
    );
    process.exit(1);
}
console.log(
    `\nproof:scene-rests — PASS: every surviving CSS scene reaches TRUE REST (idle ` +
        `layout < ${LAYOUT_CEIL}, recalc < ${RECALC_CEIL} device-independent, task < ${TASK_MS_CEIL}ms) ` +
        `after settling; /home's Aurora hero recorded-exempt (OD-2). The no-true-rest churn ` +
        `is closed cross-scene.`,
);
