#!/usr/bin/env node
/**
 * proof:live-session-mobile — Tranche J.W4 S1 + S7 · THE MOBILE-INPUT LEG of
 * the live-session battery (the AXES boundary, input-modality band — gates on
 * J.W0 + J.W3 only; NO J.W7a dependence).
 *
 * INVE-2's mobile/touch rows: `proof:live-session` is desktop-1440-mouse-only
 * (`hasTouch|isMobile` grep = 0 there) — "the dock + drag + bezier are
 * pointer-only in the gate. A touch-only regression (`touch-action`,
 * pointer-cancel) is invisible." THIS battery is the cure: a REAL
 * `390×844 + hasTouch + isMobile` context where EVERY gesture is a TOUCH
 * gesture (`page.tap` / `locator.tap` / CDP `Input.dispatchTouchEvent`
 * touchStart→Move→End — NEVER `page.mouse`), riding the SAME J.W3 harness
 * (withPage/withBrowser + navToScene) and the SAME error-budget allowlist
 * (scripts/lib/console-budget.mjs, inherited BY REFERENCE — never re-stated).
 *
 * THE BATTERY (spec J.W4 §S1 — "the sheet, the dock, a scene switch, a drag
 * surface, the play affordance"):
 *   M1 — THE SHEET (on /amiga, the A-01 scene): OPEN at the expanded detent
 *        (the `--sheet-t` spring settle, NOT a fixed wait) → touch-SCROLL to
 *        below-fold content → touch-tap CLOSE → touch-tap RE-OPEN → the
 *        re-opened sheet scrolls AGAIN (the M2 re-open latch, certified on
 *        touch). PLUS the CH-3 RE-CERTIFICATION ORACLE (S7): with the sheet
 *        open ON 390×844, `sheet.bottom ≤ menubar.top` — the bottom menubar
 *        never paints over the sheet (the M1 occlusion class). HARD per P6
 *        (device-INDEPENDENT geometry — never observe-only'd).
 *   M2 — THE DOCK SWITCH: touch-tap expands the morphing dock → touch-tap the
 *        Scene combobox → touch-tap a DIFFERENT scene option → the destination
 *        mounts per J.W0's per-EXPECTED-state predicate (machine activeScene +
 *        the destination control-tab trigger TEXT — cube→easing so the trigger
 *        DISCRIMINATES). NOT a hash assignment — the real touch combobox path.
 *   M3 — THE DRAG SURFACE: on /square a CDP touch-DRAG COMPLETES — the
 *        transform PERSISTS (≠ identity after settle) and `getSelection()` is
 *        empty (the touch-only `touch-action`/selection regression class).
 *   M4 — THE PLAY AFFORDANCE: touch-tap the rainbow group-play (hit-testable
 *        at tap time — `.tap()` asserts the hit-test, no force) → the subject
 *        animates (≥3 distinct subject/visualizer transforms — the B1 liveness
 *        oracle, on touch).
 *
 * ORACLE: every clause above + ONE accumulated ERROR BUDGET = 0 across the
 * whole battery (the proof:live-session structured allowlist, lib-sourced).
 *
 * CH-3 (S7): this gate's M1-geometry clause is the chronic's re-certified
 * closure — it REPLACES the desktop `perf-frame-budget`+`drag-gesture` closure
 * (the wrong-axis oracles INVE-2 names). Born-RED of record: on the pre-cure
 * tree the always-expanded TransportDock (~90px host) overran the token-derived
 * `--dock-band-reserve` (≈52px) and the menubar painted over the open sheet's
 * bottom control row by ~32px at 390×844 (sheet.bottom 762 > menubar.top 730,
 * measured) — this clause RED on that live defect; the cure derives the sheet
 * anchor from the MEASURED menubar (`--menubar-measured-h`, TransportDock.vue +
 * style.css max()), exactly the I deferred-ledger CH-3 prescription.
 *
 * PENDING-W7a (the APPEARANCE-CERTIFICATION band — recorded, NOT implemented
 * here; gates on J.W7a + J.W3 and greens only on the post-W7a tree):
 *   · S1 mobile hero/subject overlap == 0 (the H3/A-01 cure certification)
 *   · the subject-keeps-protagonist-visibility half of the A-01 occlusion
 *   · S3 dark `--ball-tone`/accent computed contrast ≥ floor
 *   · the ghost-rail-absent assertion in the home sweep
 *
 * P6 posture: hard (device-INDEPENDENT touch/geometry facts). Under
 * KF_REQUIRE_BROWSER a harness-absent skip is a hard fail AT THE LIB SEAM.
 * Re-runnable:
 *   KF_REQUIRE_BROWSER=1 KF_PLAYWRIGHT_DIR=… node scripts/proof-live-session-mobile.mjs
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chargeBudget, isNamedBenign } from "./lib/console-budget.mjs";
import { navToScene, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const note = (l) => console.log(`  · ${l}`);
const fail = (l) => {
    failures.push(l);
    console.error(`  ✗ ${l}`);
};

console.log(
    "proof:live-session-mobile — J.W4 S1/S7 (the MOBILE-INPUT leg): a REAL 390×844 + hasTouch context — " +
        "sheet open/scroll/close/RE-OPEN + dock switch + touch-drag + play, every gesture a TOUCH gesture, " +
        "ERROR BUDGET = 0 + the CH-3 mobile occlusion geometry (sheet.bottom ≤ menubar.top)",
);

// The REAL touch context (spec S1): not a narrowed desktop viewport.
const MOBILE_CONTEXT = {
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 3,
};

// ── THE BUDGET — the proof:live-session allowlist, inherited BY REFERENCE ────
// (scripts/lib/console-budget.mjs is the ONE classifier authority; no per-leg
// re-statement, no narrowed regex — J.W3 S1b / GC-7.)
function makeBudget() {
    const charges = [];
    const attach = (page, leg) => {
        page.on("pageerror", (e) => {
            const c = chargeBudget("pageerror", null, String(e?.message ?? e), leg);
            if (c) charges.push({ ...c, leg });
        });
        page.on("console", (m) => {
            const src = m.location()?.url ?? "";
            const text = src ? `${m.text()} [source: ${src}]` : m.text();
            const c = chargeBudget("console", m.type(), text, leg);
            if (c) charges.push({ ...c, leg });
        });
        page.on("crash", () => charges.push({ tier: "HARD", text: "page crashed", leg }));
        page.on("requestfailed", (req) => {
            const u = req.url();
            const ef = req.failure?.()?.errorText ?? "";
            const txt = `requestfailed: ${u} (${ef})`;
            if (!isNamedBenign(txt, leg) && !isNamedBenign(u, leg)) {
                charges.push({ tier: "HARD", text: txt, leg });
            }
        });
    };
    return { charges, attach };
}

/** Wait for the sheet SPRING to rest: poll the spring-driven `--sheet-t` until
 *  3 consecutive identical samples (the spring's own value reaching rest — the
 *  proof:sheet-reopen-scroll settle shape; NEVER a bare settleMs). The wrapper
 *  HEIGHT is not a valid rest probe (the underdamped spring overshoots while
 *  the height clamps at max-height). */
async function waitForSheetRest(page, { timeout = 5000 } = {}) {
    const t0 = Date.now();
    let prev = null;
    let stable = 0;
    while (Date.now() - t0 < timeout) {
        const t = await page.evaluate(() => {
            const el = document.querySelector(".controls-pane-wrapper");
            return el ? getComputedStyle(el).getPropertyValue("--sheet-t").trim() : null;
        });
        if (t !== null && prev !== null && t === prev) {
            stable += 1;
            if (stable >= 3) return t;
        } else {
            stable = 0;
        }
        prev = t;
        await page.waitForTimeout(60);
    }
    return prev;
}

/** A REAL touch swipe via CDP Input.dispatchTouchEvent (Playwright's
 *  touchscreen has tap only — the touch-DRAG rides the devtools touch
 *  sequence, a trusted input path, not a synthetic DOM event). */
async function touchSwipe(page, from, to, { steps = 10, stepMs = 20 } = {}) {
    const cdp = await page.context().newCDPSession(page);
    try {
        await cdp.send("Input.dispatchTouchEvent", {
            type: "touchStart",
            touchPoints: [{ x: from.x, y: from.y }],
        });
        for (let i = 1; i <= steps; i++) {
            await cdp.send("Input.dispatchTouchEvent", {
                type: "touchMove",
                touchPoints: [
                    {
                        x: Math.round(from.x + ((to.x - from.x) * i) / steps),
                        y: Math.round(from.y + ((to.y - from.y) * i) / steps),
                    },
                ],
            });
            await page.waitForTimeout(stepMs);
        }
        await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    } finally {
        await cdp.detach().catch(() => {});
    }
}

/** The sheet/menubar/subject geometry on the LIVE mobile viewport. The menubar
 *  is the TransportDock host (`.menubar-safe-pb`, the fixed bottom z-dock band
 *  the CH-3 occlusion lives against). */
const readGeometry = (page) =>
    page.evaluate(() => {
        const r = (el) => {
            if (!el) return null;
            const b = el.getBoundingClientRect();
            return {
                top: Math.round(b.top),
                bottom: Math.round(b.bottom),
                height: Math.round(b.height),
                width: Math.round(b.width),
            };
        };
        const wrapper = document.querySelector(".controls-pane-wrapper");
        return {
            open: !!wrapper?.classList.contains("controls-pane--open"),
            closed: !!wrapper?.classList.contains("controls-pane--closed"),
            sheetT: wrapper
                ? getComputedStyle(wrapper).getPropertyValue("--sheet-t").trim()
                : null,
            sheet: r(wrapper),
            menubar: r(document.querySelector(".menubar-safe-pb")),
            handle: !!document.querySelector(".sheet-grab-handle"),
            vh: window.innerHeight,
        };
    });

/** CH-3 geometry clause — sheet.bottom ≤ menubar.top (1px AA tolerance). */
function assertNoMenubarOcclusion(geo, when) {
    if (!geo.sheet || !geo.menubar) {
        fail(
            `CH-3 geometry (${when}): sheet (${!!geo.sheet}) / menubar (${!!geo.menubar}) ` +
                `missing on 390×844 — the occlusion oracle cannot run (non-vacuity)`,
        );
        return;
    }
    if (geo.sheet.bottom <= geo.menubar.top + 1) {
        ok(
            `CH-3 geometry (${when}): sheet.bottom ${geo.sheet.bottom} ≤ menubar.top ` +
                `${geo.menubar.top} on 390×844 — the bottom menubar never paints over the sheet ` +
                `(the M1 occlusion class is ABSENT; the chronic's re-certified mobile oracle)`,
        );
    } else {
        fail(
            `CH-3 geometry (${when}): sheet.bottom ${geo.sheet.bottom} > menubar.top ` +
                `${geo.menubar.top} on 390×844 — the menubar paints OVER the open sheet's bottom ` +
                `${geo.sheet.bottom - geo.menubar.top}px (the M1 occlusion class, LIVE — the CH-3 ` +
                `mobile chronic re-opened; the sheet anchor must clear the MEASURED menubar)`,
        );
    }
}

// The broad liveness sampler (the B1 oracle's union form): subject computed
// transforms + any inline-transform mover under the scene host (the cube
// group-play drives the visualizer ball + scene movers).
const sampleLiveness = (page, ms = 2500) =>
    page.evaluate(async (dur) => {
        const sleep = (m) => new Promise((r) => setTimeout(r, m));
        const seen = new Set();
        const t0 = performance.now();
        while (performance.now() - t0 < dur) {
            for (const sel of [".cube", ".graph", ".idle-hover"]) {
                const el = document.querySelector(sel);
                if (el) {
                    const t = getComputedStyle(el).transform;
                    if (t && t !== "none") seen.add(sel + "|" + t);
                }
            }
            for (const el of document.querySelectorAll(
                ".scene-host [style*='transform'], .stage-cell [style*='transform'], .controls-pane-wrapper [style*='transform']",
            )) {
                const t = el.style.transform;
                if (t) seen.add("inline|" + (el.className?.toString?.() ?? "").slice(0, 24) + "|" + t);
            }
            await sleep(40);
        }
        return seen.size;
    }, ms);

async function runBattery() {
    const budget = makeBudget();

    const result = await withPage(
        { distDir: DIST, context: MOBILE_CONTEXT, label: "the mobile-input battery" },
        async (_page, { url: base, browser }) => {
            // WARM-then-OBSERVE (the proof:live-session B3a pattern, verbatim
            // rationale): the FIRST amiga load in a fresh headless browser emits
            // a one-time cold-GPU-process ReadPixels burst (~4 lines at
            // t≈400ms — shader compile + the first backdrop-filter composite
            // reading the alpha:0 WebGL canvas under SwiftShader), the
            // measurement environment's init artifact, NOT the product's
            // present loop. A throwaway UNBUDGETED load warms the shared GPU
            // process; the budgeted M1 leg then observes a warm steady state.
            // A real per-frame-readback regression stalls EVERY frame
            // regardless of warmup, so the budget still reds the true defect.
            {
                const ctxW = await browser.newContext(MOBILE_CONTEXT);
                const pageW = await ctxW.newPage();
                await pageW.goto(`${base}/#/amiga`, { waitUntil: "load" });
                await pageW.waitForTimeout(1600); // warm (UNBUDGETED)
                await ctxW.close();
            }

            // ── M1 + CH-3 — THE SHEET on /amiga (open → scroll → close → RE-OPEN) ──
            {
                const ctx = await browser.newContext(MOBILE_CONTEXT);
                const page = await ctx.newPage();
                budget.attach(page, "M1:amiga-sheet");
                await page.goto(`${base}/#/amiga`, { waitUntil: "load" });
                await navToScene(page, "amiga", "Controls", { timeout: 12000 });
                await page
                    .waitForFunction(
                        () =>
                            !!document.querySelector(".controls-pane-wrapper") &&
                            !!document.querySelector(".sheet-grab-handle"),
                        { timeout: 10000 },
                    )
                    .catch(() => {});
                await waitForSheetRest(page);

                // 1. OPEN at the expanded detent. The scene auto-opens its sheet;
                // if it rested closed, the grab-pill tap IS the open gesture.
                let geo = await readGeometry(page);
                if (!geo.open && geo.handle) {
                    await page.tap(".sheet-grab-handle");
                    await waitForSheetRest(page);
                    geo = await readGeometry(page);
                }
                if (geo.open && geo.sheetT === "1") {
                    ok(
                        `M1 sheet OPEN: the controls sheet rests at the expanded detent ` +
                            `(--sheet-t=1, spring-settled — not a fixed wait) on 390×844`,
                    );
                } else {
                    fail(
                        `M1 sheet OPEN: the sheet did not reach its expanded detent ` +
                            `(open=${geo.open}, --sheet-t=${geo.sheetT}) — the touch open gesture is broken`,
                    );
                }

                // CH-3 (S7) — the occlusion geometry, sheet OPEN.
                assertNoMenubarOcclusion(geo, "sheet OPEN");

                // 2. SCROLL — a real touch swipe inside the open sheet reaches
                // below-fold content. Non-vacuity: content TALLER than the body.
                const pane = await page.evaluate(() => {
                    const p = document.querySelector(".controls-pane");
                    if (!p) return null;
                    const r = p.getBoundingClientRect();
                    return {
                        cx: Math.round(r.left + r.width / 2),
                        cy: Math.round(r.top + r.height / 2),
                        scrollH: p.scrollHeight,
                        clientH: p.clientHeight,
                    };
                });
                if (!pane || pane.scrollH <= pane.clientH + 8) {
                    fail(
                        `M1 sheet SCROLL: sheet content does not overflow the body ` +
                            `(scrollH=${pane?.scrollH} clientH=${pane?.clientH}) — the scroll oracle cannot bite`,
                    );
                } else {
                    await touchSwipe(
                        page,
                        { x: pane.cx, y: pane.cy },
                        { x: pane.cx, y: pane.cy - 180 },
                    );
                    await page.waitForTimeout(500);
                    const scrolled = await page.evaluate(
                        () => document.querySelector(".controls-pane")?.scrollTop ?? 0,
                    );
                    if (scrolled > 0) {
                        ok(
                            `M1 sheet SCROLL: a real touch swipe scrolls the open sheet to below-fold ` +
                                `content (scrollTop=${scrolled}px of ${pane.scrollH - pane.clientH}px overflow)`,
                        );
                    } else {
                        fail(
                            `M1 sheet SCROLL: the touch swipe moved NOTHING (scrollTop=0; ` +
                                `${pane.scrollH}px content in a ${pane.clientH}px body) — below-fold ` +
                                `controls are touch-unreachable`,
                        );
                    }
                }

                // 3. CLOSE → RE-OPEN via real taps on the grab pill (the M2
                // re-open latch, on touch).
                await page.tap(".sheet-grab-handle");
                await waitForSheetRest(page);
                const closedGeo = await readGeometry(page);
                if (closedGeo.closed && closedGeo.sheetT === "0") {
                    ok(`M1 sheet CLOSE: tap on the grab pill collapses to the peek detent (--sheet-t=0)`);
                } else {
                    fail(
                        `M1 sheet CLOSE: the tap did not collapse the sheet ` +
                            `(closed=${closedGeo.closed}, --sheet-t=${closedGeo.sheetT})`,
                    );
                }
                // The peek sliver must ALSO clear the menubar (the grab pill is
                // the re-open affordance — a menubar-covered pill is untappable).
                assertNoMenubarOcclusion(closedGeo, "sheet CLOSED (peek)");

                await page.tap(".sheet-grab-handle");
                await page
                    .waitForFunction(
                        () => !!document.querySelector(".controls-pane-wrapper.controls-pane--open"),
                        { timeout: 6000 },
                    )
                    .catch(() => {});
                await waitForSheetRest(page);
                // Reset the scroll latch state so the RE-OPEN swipe measures the
                // re-opened sheet's own scrollability, not the first leg's offset.
                await page.evaluate(() => {
                    const p = document.querySelector(".controls-pane");
                    if (p) p.scrollTop = 0;
                });
                const reopen = await page.evaluate(() => {
                    const w = document.querySelector(".controls-pane-wrapper");
                    const p = document.querySelector(".controls-pane");
                    return {
                        open: !!w?.classList.contains("controls-pane--open"),
                        sheetT: w ? getComputedStyle(w).getPropertyValue("--sheet-t").trim() : null,
                        overflowY: p ? getComputedStyle(p).overflowY : null,
                        cx: p ? Math.round(p.getBoundingClientRect().left + p.getBoundingClientRect().width / 2) : 0,
                        cy: p ? Math.round(p.getBoundingClientRect().top + p.getBoundingClientRect().height / 2) : 0,
                    };
                });
                const reopenScrollable = reopen.overflowY === "auto" || reopen.overflowY === "scroll";
                if (reopen.open && reopen.sheetT === "1" && reopenScrollable) {
                    await touchSwipe(
                        page,
                        { x: reopen.cx, y: reopen.cy },
                        { x: reopen.cx, y: reopen.cy - 180 },
                    );
                    await page.waitForTimeout(500);
                    const scrolled2 = await page.evaluate(
                        () => document.querySelector(".controls-pane")?.scrollTop ?? 0,
                    );
                    if (scrolled2 > 0) {
                        ok(
                            `M1 sheet RE-OPEN: the SECOND open reaches the expanded detent AND scrolls ` +
                                `to its content on touch (overflow-y=${reopen.overflowY}, ` +
                                `scrollTop=${scrolled2}px) — the M2 re-open latch holds on a real touch context`,
                        );
                    } else {
                        fail(
                            `M1 sheet RE-OPEN: the re-opened sheet did NOT scroll on touch ` +
                                `(scrollTop=0) — the M2 re-open scroll latch is broken on touch`,
                        );
                    }
                } else {
                    fail(
                        `M1 sheet RE-OPEN: the second open did not restore a scrollable expanded sheet ` +
                            `(open=${reopen.open}, --sheet-t=${reopen.sheetT}, overflow-y=${reopen.overflowY}) ` +
                            `— the M2 latch class (no transitionend ever fires on the spring-driven sheet)`,
                    );
                }
                await ctx.close();
            }

            // ── M2 — THE DOCK SWITCH on touch (cube → easing, the discriminating
            //    trigger pair: "Controls" → "Easing") ─────────────────────────
            {
                const ctx = await browser.newContext(MOBILE_CONTEXT);
                const page = await ctx.newPage();
                budget.attach(page, "M2:dock-switch");
                await page.goto(`${base}/#/cube`, { waitUntil: "load" });
                await navToScene(page, "cube", "Controls", { timeout: 12000 });
                await page.waitForTimeout(600);

                // Tap-expand the morphing TOP dock (the scene dock — the one
                // whose rect sits in the top half; the bottom transport dock is
                // always-expanded).
                const dockCenter = await page.evaluate(() => {
                    const vh = window.innerHeight;
                    for (const d of document.querySelectorAll(".glass-dock")) {
                        const r = d.getBoundingClientRect();
                        if (r.top < vh / 2 && r.width > 0) {
                            return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
                        }
                    }
                    return null;
                });
                if (!dockCenter) {
                    fail("M2 dock: no top scene dock found on 390×844 — the switch cannot run");
                } else {
                    await page.touchscreen.tap(dockCenter.x, dockCenter.y);
                    await page
                        .waitForFunction(
                            () => {
                                const vh = window.innerHeight;
                                return [...document.querySelectorAll(".glass-dock.expanded")].some(
                                    (d) => d.getBoundingClientRect().top < vh / 2,
                                );
                            },
                            { timeout: 5000 },
                        )
                        .catch(() => {});
                    const expanded = await page.evaluate(() => {
                        const vh = window.innerHeight;
                        return [...document.querySelectorAll(".glass-dock.expanded")].some(
                            (d) => d.getBoundingClientRect().top < vh / 2,
                        );
                    });
                    if (!expanded) {
                        fail("M2 dock: the touch tap did NOT expand the morphing dock (touch-expand broken)");
                    } else {
                        ok("M2 dock: a touch tap expands the morphing scene dock (hit-testable on touch)");
                    }

                    // Open the Scene combobox + tap the easing option (a REAL
                    // reka commit on touch — not a hash assignment). TWO touch
                    // realities the loop self-heals against (both observed on
                    // the live dock): (a) a trigger tap during the dock's morph
                    // window is CONSUMED by the expand transition (the glass-ui
                    // first-tap swallow), and (b) with no hover on touch the
                    // dock auto-collapses after its collapse-delay, hiding the
                    // trigger. Each attempt therefore RE-EXPANDS the dock if it
                    // rests collapsed, lets the morph settle, and taps the
                    // trigger at its LIVE center — until the listbox actually
                    // projects the scene options (a state wait per attempt,
                    // never one blind timer).
                    let optionsOpen = false;
                    for (let attempt = 0; attempt < 4 && !optionsOpen; attempt++) {
                        const topDock = await page.evaluate(() => {
                            const vh = window.innerHeight;
                            for (const d of document.querySelectorAll(".glass-dock")) {
                                const r = d.getBoundingClientRect();
                                if (r.top < vh / 2 && r.width > 0) {
                                    return {
                                        x: Math.round(r.x + r.width / 2),
                                        y: Math.round(r.y + r.height / 2),
                                        expanded: d.classList.contains("expanded"),
                                    };
                                }
                            }
                            return null;
                        });
                        if (!topDock) break;
                        if (!topDock.expanded) {
                            await page.touchscreen.tap(topDock.x, topDock.y);
                            await page
                                .waitForFunction(
                                    () => {
                                        const vh = window.innerHeight;
                                        return [...document.querySelectorAll(".glass-dock.expanded")].some(
                                            (d) => d.getBoundingClientRect().top < vh / 2,
                                        );
                                    },
                                    { timeout: 4000 },
                                )
                                .catch(() => {});
                        }
                        await page.waitForTimeout(800); // the morph settles (the consumed-tap window passes)
                        const trig = await page.evaluate(() => {
                            const t = document.querySelector('[aria-label="Scene"]');
                            const r = t?.getBoundingClientRect();
                            return r && r.width > 0
                                ? {
                                      x: Math.round(Math.min(r.x + r.width / 2, window.innerWidth - 8)),
                                      y: Math.round(r.y + r.height / 2),
                                  }
                                : null;
                        });
                        if (!trig) continue;
                        await page.touchscreen.tap(trig.x, trig.y);
                        optionsOpen = await page
                            .waitForFunction(
                                () => document.querySelectorAll('[role="option"]').length > 1,
                                { timeout: 2500 },
                            )
                            .then(() => true)
                            .catch(() => false);
                    }
                    let committed = false;
                    if (optionsOpen) {
                        try {
                            await page
                                .getByRole("option", { name: "Easing", exact: true })
                                .tap({ timeout: 4000 });
                            committed = true;
                        } catch {
                            /* recorded below */
                        }
                    }
                    if (!committed) {
                        fail(
                            `M2 dock: the Scene combobox ${optionsOpen ? "opened but the Easing option was not tappable" : "never projected its options under the touch tap"} (touch commit failed)`,
                        );
                    }
                    // The per-EXPECTED-destination-state predicate (J.W0): the
                    // machine rests on easing AND the destination control-tab
                    // trigger projects "Easing" (the trigger TEXT discriminates
                    // the destination — never the source's stale surface).
                    await page
                        .waitForFunction(
                            () => {
                                try {
                                    const m = JSON.parse(
                                        localStorage.getItem("keyframes-js-scene-machine") || "{}",
                                    );
                                    const trig = document.querySelector("[aria-label='Controls tab']");
                                    return (
                                        m.activeScene === "easing" &&
                                        (trig?.textContent?.trim() || "") === "Easing"
                                    );
                                } catch {
                                    return false;
                                }
                            },
                            { timeout: 10000 },
                        )
                        .catch(() => {});
                    const dest = await page.evaluate(() => {
                        let m = null;
                        try {
                            m = JSON.parse(localStorage.getItem("keyframes-js-scene-machine") || "{}").activeScene;
                        } catch {
                            /* read-only */
                        }
                        return {
                            machine: m,
                            trigger: document.querySelector("[aria-label='Controls tab']")?.textContent?.trim() ?? null,
                        };
                    });
                    if (dest.machine === "easing" && dest.trigger === "Easing") {
                        ok(
                            `M2 dock SWITCH: the touch combobox commit landed cube→easing per the ` +
                                `expected-destination-state predicate (machine=easing, trigger="Easing")`,
                        );
                    } else {
                        fail(
                            `M2 dock SWITCH: the destination state never projected ` +
                                `(machine=${dest.machine}, trigger=${dest.trigger}; expected easing/"Easing") ` +
                                `— the touch switch is broken or lags its control surface`,
                        );
                    }
                }
                await ctx.close();
            }

            // ── M3 — THE DRAG SURFACE on /square (a touch drag COMPLETES) ────
            {
                const ctx = await browser.newContext(MOBILE_CONTEXT);
                const page = await ctx.newPage();
                budget.attach(page, "M3:square-touch-drag");
                await page.goto(`${base}/#/square`, { waitUntil: "load" });
                await navToScene(page, "square", "Controls", { timeout: 12000 });
                await page.waitForTimeout(900);
                const box = await page.evaluate(() => {
                    const el = document.querySelector(".demo-box");
                    const r = el?.getBoundingClientRect();
                    return r
                        ? { cx: Math.round(r.left + r.width / 2), cy: Math.round(r.top + r.height / 2) }
                        : null;
                });
                if (!box) {
                    fail("M3 touch-drag: .demo-box absent on /square at 390×844 — the drag cannot run");
                } else {
                    await touchSwipe(
                        page,
                        { x: box.cx, y: box.cy },
                        { x: box.cx - 70, y: box.cy + 50 },
                        { steps: 8, stepMs: 25 },
                    );
                    // Poll the transform to rest (the release spring settles).
                    let prev = null;
                    let settled = "none";
                    for (let i = 0; i < 14; i++) {
                        await page.waitForTimeout(80);
                        const cur = await page.evaluate(() => {
                            const el = document.querySelector(".demo-box");
                            return el ? getComputedStyle(el).transform : "none";
                        });
                        if (cur === prev) {
                            settled = cur;
                            break;
                        }
                        prev = cur;
                        settled = cur;
                    }
                    const selChars = await page.evaluate(
                        () => (window.getSelection()?.toString() || "").length,
                    );
                    const isIdentity = (t) => {
                        if (!t || t === "none") return true;
                        const m = t.match(/matrix(?:3d)?\(([^)]+)\)/);
                        if (!m) return true;
                        const n = m[1].split(",").map((s) => parseFloat(s.trim()));
                        if (n.length === 6) {
                            const [a, , , d, e, f] = n;
                            return (
                                Math.abs(e) < 1 && Math.abs(f) < 1 && Math.abs(a - 1) < 0.02 && Math.abs(d - 1) < 0.02
                            );
                        }
                        return false;
                    };
                    const persisted = !isIdentity(settled);
                    if (persisted && selChars === 0) {
                        ok(
                            `M3 touch-drag: the /square touch drag COMPLETED — transform persists ` +
                                `(${settled.slice(0, 48)}…) and getSelection() is empty (no touch-drag text selection)`,
                        );
                    } else {
                        fail(
                            `M3 touch-drag: persisted=${persisted} (settled=${settled.slice(0, 60)}), ` +
                                `selectedChars=${selChars} — the touch drag did not complete cleanly ` +
                                `(the touch-action/pointer-cancel regression class)`,
                        );
                    }
                }
                await ctx.close();
            }

            // ── M4 — THE PLAY AFFORDANCE (touch-tap, hit-testable, animates) ──
            {
                const ctx = await browser.newContext(MOBILE_CONTEXT);
                const page = await ctx.newPage();
                budget.attach(page, "M4:play-tap");
                await page.goto(`${base}/#/cube`, { waitUntil: "load" });
                await navToScene(page, "cube", "Controls", { timeout: 12000 });
                await page.waitForTimeout(900);
                let tapped = false;
                try {
                    // .tap() (no force) ASSERTS hit-testability — the
                    // dock-stability dependency is part of the oracle.
                    await page
                        .locator('button[aria-label="Play animation"]')
                        .first()
                        .tap({ timeout: 5000 });
                    tapped = true;
                } catch {
                    /* recorded below */
                }
                if (!tapped) {
                    fail(
                        "M4 play: the rainbow group-play button was NOT hit-testable at touch-tap time " +
                            "on 390×844 — the play affordance is touch-unreachable",
                    );
                } else {
                    const distinct = await sampleLiveness(page);
                    if (distinct >= 3) {
                        ok(
                            `M4 play: the touch-tap started playback — ${distinct} distinct subject/` +
                                `visualizer transforms over the sample window (the B1 liveness oracle, on touch)`,
                        );
                    } else {
                        fail(
                            `M4 play: only ${distinct} distinct transforms after the play tap (<3) — ` +
                                `the tap did not start a live draw loop`,
                        );
                    }
                }
                await ctx.close();
            }
        },
    );
    if (result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
        return;
    }

    // ── THE BUDGET VERDICT — zero across the WHOLE mobile battery ────────────
    if (budget.charges.length === 0) {
        ok(
            "ERROR BUDGET = 0 across the mobile battery (sheet + dock + drag + play, all touch): " +
                "zero HARD + zero PROMOTED charges (the lib-sourced live-session allowlist, by reference)",
        );
    } else {
        fail(
            `ERROR BUDGET BLOWN — ${budget.charges.length} charge(s) across the mobile battery:\n      ` +
                budget.charges
                    .slice(0, 10)
                    .map((c) => `[${c.tier}|${c.leg}] ${c.text.slice(0, 130)}`)
                    .join("\n      "),
        );
    }

    // ── PENDING-W7a — the APPEARANCE-CERTIFICATION clauses (recorded; gates on
    //    J.W7a + J.W3; implemented in phase-2 on the post-W7a tree) ───────────
    note(
        "PENDING-W7a (appearance band, NOT asserted here): mobile hero/subject overlap == 0 (H3/A-01 cure) · " +
            "subject keeps protagonist visibility above the open sheet (A-01 half) · dark --ball-tone/accent " +
            "contrast ≥ floor (S3) · ghost-rail-absent on home (XH-1)",
    );
}

await runBattery();

if (failures.length > 0) {
    console.error(
        `\nproof:live-session-mobile — FAIL (${failures.length}): the 390×844 + hasTouch battery red — ` +
            "a touch human's sheet/dock/drag/play surface (or the CH-3 occlusion geometry) is broken.",
    );
    process.exit(1);
}
console.log(
    "\nproof:live-session-mobile — PASS: a REAL touch context drove the sheet (open → scroll → close → " +
        "RE-OPEN, all taps/swipes), the dock combobox switch landed per the expected-destination predicate, " +
        "the /square touch drag completed (persisted, no selection), the play tap started a live draw loop, " +
        "the CH-3 occlusion geometry held (sheet.bottom ≤ menubar.top at both detents), and the error budget " +
        "is ZERO. The mobile half of the AXES boundary is certified on its own axis.",
);
