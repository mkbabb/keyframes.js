/**
 * cdp-perf.mjs — the CDP-counter measurement substrate (T.G6/T.G7, lane 32
 * T-PERF-B/E; the perf-oracle re-home).
 *
 * ── THE MEASURED BLINDSPOT THIS SUBSTRATE CURES ──────────────────────────────
 * proof:perf-frame-budget's dropped-frame oracle samples `requestAnimationFrame`
 * INTERVALS, which measures how fast the MAIN-THREAD callback loop iterates. But
 * lane 11's #1 dominant cost — `backdrop-filter` blur re-rasterizing the moving
 * stage — is a COMPOSITOR-THREAD raster cost that does not block the main
 * thread's rAF callback. In this project's own headless Chromium harness (no
 * vsync pump) nothing back-pressures rAF, so the JS loop free-runs at ~120Hz
 * INDEPENDENT of real paint cost: the gate read cube at "0 dropped @120Hz" on
 * the identical build lane 11's CDP counters read at ~20fps (lane 32 §2.1).
 *
 * The device-INDEPENDENT architecture-truth lane 11 validated is the CDP
 * Performance-domain COUNTER deltas — `LayoutCount`, `RecalcStyleCount`,
 * `TaskDuration` — over a fixed play window. Those counters see the compositor/
 * raster/layout work the rAF-interval sampler is structurally blind to. This
 * module is the ONE shared home for reading them, so every perf gate that
 * re-homes onto the corrected methodology (proof:perf-counters, the proof:perf
 * family) reads the SAME counters the SAME way — no per-gate re-derivation of
 * the CDP metrics shape.
 *
 * ── WHY COUNTERS, NOT fps ─────────────────────────────────────────────────────
 * The ABSOLUTE fps figure is conservative-LOW on headless macOS raster (lane 11
 * caveat) and device-dependent. `TaskDuration` (cumulative main-thread + raster
 * CPU seconds) / windowSec = a BUSY FRACTION (fraction of one core), and the
 * LayoutCount/RecalcStyleCount deltas are raw work-unit counts — all three are
 * device-independent architecture-truth. The gate verdicts express these as
 * SAME-REPORT RATIOS (portable-perf.mjs's ratioGateValue), never a fresh
 * absolute ms number (the C-10 / K3-portability discipline).
 *
 * ── EXPORTS ───────────────────────────────────────────────────────────────────
 *   attachCounters(page)                  → a live CDP session (Performance
 *                                           enabled). Off page.context().
 *   snapshotCounters(cdp)                 → Map<name, value> of the current
 *                                           cumulative metrics.
 *   counterDelta(before, after)           → { layoutCount, recalcCount, taskMs,
 *                                           layoutMs, recalcMs, scriptMs } deltas.
 *   measureCounters(page, { windowMs })   → open a session, read deltas over a
 *                                           windowMs wall-clock window, return
 *                                           the deltas + busyFraction + windowMs.
 *   countBackdropSurfaces(page)           → live `backdrop-filter` surface count
 *                                           (the clause-(e) census, promoted to a
 *                                           reusable helper for the correlation
 *                                           budget).
 *   neutralizeBackdropFilter(page)        → inject a stylesheet forcing
 *                                           `backdrop-filter: none !important` on
 *                                           every element (the toggle baseline —
 *                                           lane 11's device-independent toggle-
 *                                           delta methodology, over CDP counters).
 */

// ── The CDP session + metric read ─────────────────────────────────────────────

/**
 * Open a CDP session on the page and enable the Performance domain.
 * @param {import('playwright-core').Page} page
 * @returns {Promise<import('playwright-core').CDPSession>}
 */
export async function attachCounters(page) {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Performance.enable");
    return cdp;
}

/**
 * Read the current cumulative Performance metrics as a name→value Map.
 * @param {import('playwright-core').CDPSession} cdp
 * @returns {Promise<Map<string, number>>}
 */
export async function snapshotCounters(cdp) {
    const res = await cdp.send("Performance.getMetrics");
    const map = new Map();
    for (const { name, value } of res.metrics ?? []) map.set(name, value);
    return map;
}

/**
 * The device-independent counter DELTAS between two snapshots. Durations are
 * reported by CDP in SECONDS (cumulative) — converted to ms here.
 * @param {Map<string, number>} before
 * @param {Map<string, number>} after
 */
export function counterDelta(before, after) {
    const d = (k) => (after.get(k) ?? 0) - (before.get(k) ?? 0);
    return {
        layoutCount: d("LayoutCount"),
        recalcCount: d("RecalcStyleCount"),
        taskMs: d("TaskDuration") * 1000,
        layoutMs: d("LayoutDuration") * 1000,
        recalcMs: d("RecalcStyleDuration") * 1000,
        scriptMs: d("ScriptDuration") * 1000,
    };
}

/**
 * Measure the CDP counter deltas over a fixed wall-clock window. `busyFraction`
 * = taskMs / windowMs (fraction of one core spent on main-thread + raster CPU —
 * ~20fps ≈ a busyFraction well above the 60fps smooth budget once the chrome
 * blur re-samples the moving stage; the device-independent architecture-truth).
 *
 * @param {import('playwright-core').Page} page
 * @param {{ windowMs?: number, cdp?: import('playwright-core').CDPSession }} [opts]
 */
export async function measureCounters(page, { windowMs = 2500, cdp } = {}) {
    const session = cdp ?? (await attachCounters(page));
    const before = await snapshotCounters(session);
    await page.waitForTimeout(windowMs);
    const after = await snapshotCounters(session);
    const delta = counterDelta(before, after);
    return {
        ...delta,
        windowMs,
        busyFraction: windowMs > 0 ? delta.taskMs / windowMs : 0,
    };
}

// ── The backdrop-filter census + toggle (lane 11 methodology) ──────────────────

/**
 * Count live `backdrop-filter` surfaces (the clause-(e) census, promoted to a
 * reusable helper). A surface × moving-subject correlation with a TaskDuration
 * spike is the folded relative budget (T.G7).
 * @param {import('playwright-core').Page} page
 */
export async function countBackdropSurfaces(page) {
    return page.evaluate(() => {
        let n = 0;
        for (const el of document.querySelectorAll("*")) {
            const cs = getComputedStyle(el);
            const bf = cs.backdropFilter || cs.webkitBackdropFilter;
            if (bf && bf !== "none") n++;
        }
        return n;
    });
}

/**
 * Neutralize every `backdrop-filter` in the page (the toggle baseline — remove
 * the ONE suspect property and re-measure the same counters in the same run;
 * lane 11's device-independent toggle-delta, expressed over CDP counters). The
 * injected sheet wins via `!important`; returns nothing (idempotent).
 * @param {import('playwright-core').Page} page
 */
export async function neutralizeBackdropFilter(page) {
    await page.evaluate(() => {
        const id = "__kf_no_backdrop_filter__";
        if (document.getElementById(id)) return;
        const style = document.createElement("style");
        style.id = id;
        style.textContent =
            "*, *::before, *::after { backdrop-filter: none !important; " +
            "-webkit-backdrop-filter: none !important; }";
        document.head.appendChild(style);
    });
    // Let the compositor drop the blur layers before the next measurement.
    await page.waitForTimeout(150);
}
