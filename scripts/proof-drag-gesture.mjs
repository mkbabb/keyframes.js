#!/usr/bin/env node
/**
 * proof:drag-gesture — I.W4 D1 + D2 (the B6 RUNTIME/INTERACTION gate).
 *
 * THE DEFECTS (rc-drag-perf §1). B6-a: a drag on the `/square` box (and, latently,
 * every scene rail) highlighted the chrome text the pointer swept — there was NO
 * global select-suppression seam (`SquareScene.vue:2` scoped `select-none` to the
 * stage; the drag listened at `window`, so the cursor legitimately crossed the
 * dock + control labels, which stayed `user-select:auto`). B6-b: `pointerup →
 * reseat(0,0)` (`SquareScene.vue:104`) hard-coded a spring-home-on-release, so the
 * box snapped back to centre instead of staying where dragged.
 *
 * THE FIX (D1 + D2). The shared `useDragScrub` seam now owns the single
 * "gesture-in-flight" authority: on pointer-down it sets `body.is-dragging`
 * (whose rule `body.is-dragging * { user-select: none }` lives in
 * design-idioms.css), cleared on pointerup/pointercancel — inherited by EVERY
 * drag surface. And `releasePolicy: "persist"` (the default) leaves the dragged
 * value in place on release; the explicit `Home`/`End` recenter stays.
 *
 * THIS GATE BITES (born-RED on `8a40cf4`/HEAD-pre-fix, GREEN-on-fix):
 *
 *  • clause (a) — a REAL `page.mouse.down→move→up` over the document, starting on
 *    the square box and SWEEPING across a dock/control label, leaves
 *    `getSelection().toString()` EMPTY. The born-RED witness is DUAL (the
 *    synthetic-drag artifact would false-green a naive selection-only gate, per
 *    rc §1a): (i) the PRIMARY runtime read — `getSelection()` empty after the
 *    sweep; (ii) the STRUCTURAL corroborator (the decisive proof per
 *    `b6-square-drag.mjs`) — `getComputedStyle(html/body/dock/controls).userSelect`
 *    resolves to a SUPPRESSED value (`none`) WHILE the gesture is in flight (and
 *    `body.is-dragging` is set). If `setPointerCapture` routes the pointer stream
 *    away from the document text-select machinery (the synthetic-drag artifact
 *    that read 0 chars), the STRUCTURAL assertion is the born-RED-of-record — the
 *    gate NEVER passes on a synthetic 0-char read. Run against EVERY drag surface
 *    (square, spring, sequence) — the seam owns it, the gate covers it.
 *  • clause (b) — drag the square box to a measured non-centre offset, release,
 *    wait for the spring to settle → its `transform` ≠ identity (persisted, NOT
 *    recentred). Then assert `Home`/`End` STILL recentres (no capability lost).
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * env-driven resolveChromium + context/teardown, J.W3 S1) + navToScene
 * (the J.W0 per-EXPECTED-state settle). Under KF_REQUIRE_BROWSER a
 * playwright-absent skip is a hard fail AT THE LIB SEAM (W7-1/S6d).
 * P6 posture: hard — device-independent correctness oracle (red anywhere; J.W3
 * S2b). Re-runnable: `node scripts/proof-drag-gesture.mjs`. Serves
 * the BUILT dist/gh-pages/.
 *
 * ── L.W5 EXTENSION (S1 bounds / S2 snap / S4 drag2D) — the GESTURE-PRIMITIVE
 * clauses (born-RED on HEAD-pre-cure, audit Lane 32 W-GESTURE-BOUNDS +
 * W-FRONT-DOOR+). These run over the LIGHT compiled barrel (`dist/keyframes.js`)
 * + the `drag.ts` source IN-PROCESS — no browser, no demo build (the
 * `proof:orchestration` pattern). `Draggable`/`drag2D` are value.js-free, so
 * the import never pulls value.js in (`proof:boundary` stays green).
 *
 *  • clause (S1 bounds) — `new Draggable({ bounds: { min: 0, max: 200 },
 *    rubberBand: 0 })`, a synthetic pointer-down at 100 + pointer-move to 300
 *    (100px over max) leaves `spring.target <= 200` (the hard clamp). On today's
 *    tree `DragOptions` has no `bounds` field — the option is ignored, the move
 *    sets `spring.target = 300` unguarded — the clause FAILS. A static
 *    corroborator: `DragOptions` declares a `bounds` field in `drag.ts`
 *    (zero hits today).
 *  • clause (S2 snap) — `new Draggable({ snap: [0, 100, 200] })`, a release at
 *    x=60 with velocity 0 reseats `spring.target` to the nearest snap target
 *    (100). On today's tree the release seats `spring.target = 60` (no snap) —
 *    the clause FAILS. Static corroborator: a `snap` field in `drag.ts`.
 *  • clause (S4 drag2D) — `drag2D` + `Drag2DHandle` are exported; a 2-D drag
 *    from (50, 80) to (100, 120) follows so `handle.value.x ≈ 100` and
 *    `handle.value.y ≈ 120`. On today's tree `drag2D` is `undefined` on the
 *    barrel (and absent from `drag.ts`) — the clause FAILS.
 *
 * These three clauses are MANDATORY (pure-JS, no browser) — they never skip;
 * a missing surface is a red, not a vacuous pass.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { REQUIRE_BROWSER, navToScene, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
// The LIGHT compiled barrel + the drag source — the L.W5 S1/S2/S4 gesture
// clauses run over these in-process (no browser, no demo build needed).
const LIB = path.join(REPO, "dist/keyframes.js");
const DRAG_SRC = path.join(REPO, "src/animation/orchestration/drag/draggable.ts");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const note = (label) => console.log(`  · ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log("proof:drag-gesture — I.W4 D1+D2 (B6 drag select-suppression + persist)");

const CTRL_KEY = "animation-groups-control-options-store";

// The destination control-tab label navToScene settles on per scene (null = no
// control panel projects — sequence).
const TRIGGER = { square: "Controls", spring: "Spring", sequence: null };

/** Open a scene in a FRESH context at its canonical FIRST-LOAD mount. */
async function openSceneFresh(browser, base, scene, viewportWidth) {
    const ctx = await browser.newContext({ viewport: { width: viewportWidth, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript((ck) => {
        try {
            localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true }));
        } catch {
            /* ignore */
        }
    }, CTRL_KEY);
    await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
    await navToScene(page, scene, TRIGGER[scene], { timeout: 8000 });
    await page.setViewportSize({ width: viewportWidth, height: 900 });
    await page.waitForTimeout(900); // route rested + the scene's sub-Cards mounted
    return { ctx, page };
}

const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — ` +
                "the drag-gesture assertions cannot pass vacuously",
        );
    } else {
        console.log(`  ○ browser half skipped — ${reason}`);
    }
};

// The drag surfaces, by scene → the grab handle selector the seam attaches to.
// The seam owns the gesture-in-flight token, so a SINGLE structural assertion
// (userSelect suppressed during the gesture) must hold for ALL of them.
//
// J.W2 S1 (W4-3/W4-4) — the roster is EXTENDED with the two RECOVERED
// pointer-capture surfaces (`audit/wave-I.W4.md §3` coverage gap): the easing
// bezier-handle drag (EasingCurveCanvas) and the playback-ribbon slider scrub
// (PlaybackRibbon). Each carries a `land` probe (an attribute that must MUTATE
// across the gesture) so the gate also asserts the gesture LANDS — the drag is
// a real interaction, not a dead pointer sweep. BORN-RED on the pre-J.W2 tree:
// both surfaces bypassed the shared seam (inline handlers / raw window
// pointerup, NO `acquireSelectSuppression`), so `body.is-dragging` never arms.
const DRAG_SURFACES = [
    { scene: "square", handle: ".demo-box" },
    { scene: "spring", handle: ".spring-rail" },
    { scene: "sequence", handle: ".seq-scrub" },
    {
        scene: "easing",
        name: "easing/bezier-handle",
        handle: ".easing-curve-canvas circle.control-point.handle",
        land: {
            selector: ".easing-curve-canvas path.bezier-path",
            attr: "d",
            what: "the bezier `d` mutates",
        },
    },
    {
        scene: "easing",
        name: "easing/ribbon-slider",
        handle: ".timeline-green [data-slider-impl]",
        land: {
            selector: ".timeline-green [role=slider]",
            attr: "aria-valuenow",
            what: "the playhead scrubs",
        },
    },
];

// ── The honest settle predicates for clause (b) (C-10) ────────────────────────
// The live spring (square) has a STARTUP PAUSE: the first RAFPlayback frame after
// `reseat()` re-arms the loop ticks with dt=0 (no move), so for a beat after a
// `Home` re-seat the box holds at its prior position. A naive "poll until two
// consecutive reads coincide" predicate FALSE-SETTLES on that pause — two equal
// reads at a NON-rest position — which flipped this gate run-to-run (the observed
// clause-(b) flake). The cure is to assert the REAL end-states, never "stopped
// changing for one interval": a SUSTAINED-stable dwell for persist, and the actual
// identity end-state for the Home recenter. The wall-clock bounds are DEFENSIVE
// backstops (a genuinely stuck box still reds), never the pass/fail closure (C-10:
// no raw absolute frame/ms threshold is the closure — the closure is the observed
// rest state / reached identity).

/** identity = "none" or a matrix with ~zero translate + ~unit scale. */
const isIdentityTransform = (t) => {
    if (!t || t === "none") return true;
    const m = t.match(/matrix(?:3d)?\(([^)]+)\)/);
    if (!m) return true;
    const n = m[1].split(",").map((s) => parseFloat(s.trim()));
    if (n.length === 6) {
        // matrix(a,b,c,d,e,f): translate=(e,f), scale≈(a,d)
        const [a, , , d, e, f] = n;
        return Math.abs(e) < 1 && Math.abs(f) < 1 && Math.abs(a - 1) < 0.02 && Math.abs(d - 1) < 0.02;
    }
    return false;
};

/** Read a live computed transform for a selector on the page. */
const readTransformOf = (page, sel) =>
    page.evaluate((s) => {
        const el = document.querySelector(s);
        return el ? getComputedStyle(el).transform : "none";
    }, sel);

/**
 * SUSTAINED-stable settle (C-10). Poll until the transform holds identical across
 * a sustained confirmation window (≥ `holdMs`), so the spring's startup-pause
 * cannot false-settle at a transient. The `timeoutMs` is a defensive backstop; the
 * closure is "the value truly stopped moving." Returns the settled transform.
 */
async function settleTransform(page, sel, { holdMs = 260, stepMs = 60, timeoutMs = 4000 } = {}) {
    const need = Math.max(3, Math.ceil(holdMs / stepMs));
    const deadline = Date.now() + timeoutMs;
    let last = await readTransformOf(page, sel);
    let stable = 0;
    while (Date.now() < deadline) {
        await page.waitForTimeout(stepMs);
        const cur = await readTransformOf(page, sel);
        if (cur === last) {
            if (++stable >= need) return cur;
        } else {
            stable = 0;
            last = cur;
        }
    }
    return last;
}

/**
 * END-STATE predicate for the Home recenter (C-10). Wait until the transform
 * REACHES identity — the actual assertion ("Home recenters"). A startup-pause
 * false-settle cannot red this (we wait for the real end-state, not "stopped
 * changing"); if the box genuinely never recenters (the B6-b regression this
 * clause guards) the backstop expires and we report not-reached. Returns
 * `{ reached, last }`.
 */
async function waitForIdentity(page, sel, { stepMs = 60, timeoutMs = 4000 } = {}) {
    const deadline = Date.now() + timeoutMs;
    let last = await readTransformOf(page, sel);
    if (isIdentityTransform(last)) return { reached: true, last };
    while (Date.now() < deadline) {
        await page.waitForTimeout(stepMs);
        last = await readTransformOf(page, sel);
        if (isIdentityTransform(last)) return { reached: true, last };
    }
    return { reached: false, last };
}

async function browserHalf() {
    const VW = 1440;
    const result = await withPage(
        { distDir: DIST, label: "the drag-gesture assertions" },
        async (_page, { url: base, browser }) => {
        // ── clause (a) — REAL drag selects no chrome text, EVERY drag surface ──
        // The seam owns select-suppression: for each surface we drive a real
        // page.mouse drag from the grab handle, SWEEP across a chrome label, and
        // assert BOTH (i) getSelection() empty AND (ii) the structural userSelect
        // suppression holds mid-gesture (the decisive, capture-artifact-proof
        // witness). Run against all four surfaces.
        let surfacesExercised = 0;
        const surfaceFailures = [];

        for (const { scene, handle, name, land } of DRAG_SURFACES) {
            const label = name ?? scene;
            const { ctx, page } = await openSceneFresh(browser, base, scene, VW);
            try {
                // Find a grab handle for this surface + a chrome label to sweep over.
                const geom = await page.evaluate((handleSel) => {
                    const pick = handleSel
                        .split(",")
                        .map((s) => s.trim())
                        .map((s) => document.querySelector(s))
                        .find(Boolean);
                    const r = pick?.getBoundingClientRect();
                    // A chrome label to sweep over: a dock label / control caption.
                    // Prefer a text-bearing element OUTSIDE the drag surface.
                    const chromeText = [
                        ...document.querySelectorAll(
                            ".glass-dock *, .dock-label, [class*='controls'] label, header *",
                        ),
                    ].find((el) => {
                        const t = (el.textContent || "").trim();
                        const rr = el.getBoundingClientRect();
                        return t.length > 1 && rr.width > 4 && rr.height > 4;
                    });
                    const cr = chromeText?.getBoundingClientRect();
                    return {
                        has: !!(r && r.width > 4 && r.height > 4),
                        hx: r ? Math.round(r.left + r.width / 2) : 0,
                        hy: r ? Math.round(r.top + r.height / 2) : 0,
                        chrome: cr
                            ? { cx: Math.round(cr.left + cr.width / 2), cy: Math.round(cr.top + cr.height / 2) }
                            : null,
                    };
                }, handle);

                if (!geom.has) {
                    // The two J.W2-recovered surfaces are MANDATORY roster rows —
                    // an unfound handle there is a red (the gate would otherwise
                    // pass vacuously on the exact surfaces this wave recovers).
                    if (land) {
                        surfaceFailures.push(
                            `${label}: no grab handle matched \`${handle}\` — the recovered surface was NOT exercised (non-vacuity)`,
                        );
                    } else {
                        note(`${label}: no grab handle matched \`${handle}\` — surface not exercised here`);
                    }
                    continue;
                }

                // The chrome sweep target: the located chrome label, else a point
                // up in the header band (a chrome strip that is never the surface).
                const sweepTo = geom.chrome ?? { cx: Math.round(VW / 2), cy: 60 };

                // Drive a REAL mouse drag: down on the handle, move across the
                // chrome label in steps, sample userSelect MID-gesture, then up.
                await page.mouse.move(geom.hx, geom.hy);
                await page.mouse.down();

                // J.W2 — the gesture-LANDS probe: sample the landing attribute
                // right after pointer-down; it must have MUTATED by the gesture's
                // final step (the drag drives the product, not a dead sweep).
                const landBefore = land
                    ? await page.evaluate(
                          ([sel, attr]) =>
                              document.querySelector(sel)?.getAttribute(attr) ?? null,
                          [land.selector, land.attr],
                      )
                    : null;

                // Step toward the chrome label, sampling the structural state at
                // the point where the cursor is over the chrome.
                const steps = 8;
                let midSample = null;
                for (let i = 1; i <= steps; i++) {
                    const x = Math.round(geom.hx + ((sweepTo.cx - geom.hx) * i) / steps);
                    const y = Math.round(geom.hy + ((sweepTo.cy - geom.hy) * i) / steps);
                    await page.mouse.move(x, y);
                    if (i === steps) {
                        // At the chrome label: sample the structural suppression +
                        // any live selection accrued so far.
                        midSample = await page.evaluate(() => {
                            const us = (el) =>
                                el ? getComputedStyle(el).userSelect || getComputedStyle(el).webkitUserSelect : "n/a";
                            const dock = document.querySelector(".glass-dock");
                            const controls = document.querySelector("[class*='controls'], aside, .controls-pane");
                            return {
                                bodyDragging: document.body.classList.contains("is-dragging"),
                                html: us(document.documentElement),
                                body: us(document.body),
                                dock: us(dock),
                                controls: us(controls),
                                selectionMid: (window.getSelection()?.toString() || "").length,
                            };
                        });
                    }
                }

                // J.W2 — sample the landing attribute at the gesture's final step
                // (BEFORE release, so a post-release playback resume cannot drift
                // the probed value).
                const landAfter = land
                    ? await page.evaluate(
                          ([sel, attr]) =>
                              document.querySelector(sel)?.getAttribute(attr) ?? null,
                          [land.selector, land.attr],
                      )
                    : null;

                await page.mouse.up();

                const after = await page.evaluate(() => ({
                    selection: (window.getSelection()?.toString() || "").length,
                    bodyDraggingAfter: document.body.classList.contains("is-dragging"),
                }));

                surfacesExercised += 1;

                if (land) {
                    if (landBefore !== null && landBefore !== landAfter) {
                        note(`${label}: the gesture LANDS — ${land.what} (${String(landBefore).slice(0, 32)}… → ${String(landAfter).slice(0, 32)}…)`);
                    } else {
                        surfaceFailures.push(
                            `${label}: the gesture did NOT land — ${land.what} expected, but ` +
                                `\`${land.attr}\` stayed ${JSON.stringify(landBefore)} across the drag`,
                        );
                    }
                }

                // (ii) STRUCTURAL — the decisive, capture-artifact-proof witness:
                // every chrome surface must resolve userSelect=none WHILE the
                // gesture is live (and body.is-dragging set). This is the property
                // that WAS `auto` everywhere on HEAD (18/18 chrome `user-select:auto`).
                const suppressedTokens = ["none", "-webkit-none"];
                const isSuppressed = (v) => v != null && suppressedTokens.includes(String(v).toLowerCase());
                if (!midSample) {
                    surfaceFailures.push(`${label}: could not sample the mid-gesture structural state`);
                } else if (!midSample.bodyDragging) {
                    surfaceFailures.push(
                        `${label}: body.is-dragging was NOT set during the gesture — the seam did not arm the global token (D1 not live for this surface)`,
                    );
                } else if (!isSuppressed(midSample.html) || !isSuppressed(midSample.body)) {
                    surfaceFailures.push(
                        `${label}: html/body userSelect was NOT suppressed mid-gesture (html=${midSample.html}, body=${midSample.body}) — the chrome stays selectable (B6-a born-RED shape)`,
                    );
                } else {
                    // (i) PRIMARY runtime — getSelection empty after sweep+release.
                    // (A synthetic 0-char read NEVER passes alone — the structural
                    // assertion above is the load-bearing born-RED-of-record; here
                    // we additionally confirm the real drag accrued no selection.)
                    if (midSample.selectionMid > 0 || after.selection > 0) {
                        surfaceFailures.push(
                            `${label}: a real drag over a chrome label accrued ${midSample.selectionMid || after.selection} selected chars — text IS highlighting (B6-a)`,
                        );
                    } else {
                        note(
                            `${label}: drag swept chrome — userSelect suppressed (html=${midSample.html}, body=${midSample.body}, dock=${midSample.dock}, controls=${midSample.controls}); getSelection empty; token cleared on release (${after.bodyDraggingAfter ? "STILL SET — leak!" : "cleared"})`,
                        );
                        if (after.bodyDraggingAfter) {
                            surfaceFailures.push(
                                `${label}: body.is-dragging was NOT cleared on pointerup — the gesture token leaked (selection would freeze globally)`,
                            );
                        }
                    }
                }
            } finally {
                await ctx.close();
            }
        }

        if (surfacesExercised === 0) {
            skipOrFail("clause (a) exercised ZERO drag surfaces (non-vacuity floor unmet)");
        } else if (surfaceFailures.length === 0) {
            ok(
                `clause (a) — a REAL drag over a chrome label selects NO text + userSelect is ` +
                    `suppressed (html/body=none) for the WHOLE gesture across ${surfacesExercised} ` +
                    `drag surface(s); body.is-dragging set on down, cleared on up. The seam owns the ` +
                    `global gesture-in-flight token (D1) — inherited by every drag surface.`,
            );
        } else {
            fail(
                `clause (a) — ${surfaceFailures.length} drag surface(s) still highlight chrome / leave ` +
                    `userSelect:auto mid-gesture (B6-a — the seam's global select-suppression is not live):\n      ` +
                    surfaceFailures.join("\n      "),
            );
        }

        // ── clause (b) — the dragged square PERSISTS after settle; Home recenters ──
        {
            const { ctx, page } = await openSceneFresh(browser, base, "square", VW);
            try {
                const box = await page.evaluate(() => {
                    const el = document.querySelector(".demo-box");
                    const r = el?.getBoundingClientRect();
                    return r
                        ? { cx: Math.round(r.left + r.width / 2), cy: Math.round(r.top + r.height / 2) }
                        : null;
                });
                if (!box) {
                    fail("clause (b) — the .demo-box was not found on /square");
                } else {
                    // Drag the box to a measured non-centre offset (down + right),
                    // release, then wait for the spring to settle.
                    await page.mouse.move(box.cx, box.cy);
                    await page.mouse.down();
                    const target = { x: box.cx - 90, y: box.cy + 70 };
                    for (let i = 1; i <= 6; i++) {
                        await page.mouse.move(
                            Math.round(box.cx + ((target.x - box.cx) * i) / 6),
                            Math.round(box.cy + ((target.y - box.cy) * i) / 6),
                        );
                        await page.waitForTimeout(16);
                    }
                    await page.mouse.up();

                    // The dragged box must PERSIST at its dragged offset (D2). Wait
                    // for a SUSTAINED-stable settle (not one coincident read — the
                    // spring startup pause would false-settle a naive predicate),
                    // then assert the rest pose is ≠ identity AND still carries the
                    // dragged translate (it did NOT recenter — the B6-b guard).
                    const settled = await settleTransform(page, ".demo-box");
                    const translateOf = (t) => {
                        const m = String(t).match(/matrix(?:3d)?\(([^)]+)\)/);
                        if (!m) return { e: 0, f: 0 };
                        const n = m[1].split(",").map((s) => parseFloat(s.trim()));
                        return n.length === 6 ? { e: n[4], f: n[5] } : { e: 0, f: 0 };
                    };
                    const persistTr = translateOf(settled);
                    const persisted =
                        !isIdentityTransform(settled) &&
                        (Math.abs(persistTr.e) > 20 || Math.abs(persistTr.f) > 20);
                    if (!persisted) {
                        fail(
                            `clause (b) — after drag+settle the box did NOT persist at its dragged ` +
                                `offset (transform=${String(settled).slice(0, 48)}…, translate=` +
                                `(${Math.round(persistTr.e)},${Math.round(persistTr.f)})) — it recentred ` +
                                `instead of persisting (B6-b: pointerup → reseat(0,0) born-RED shape)`,
                        );
                    } else {
                        ok(
                            `clause (b) — the dragged box PERSISTS after settle (transform=${String(settled).slice(0, 48)}…, ` +
                                `translate=(${Math.round(persistTr.e)},${Math.round(persistTr.f)}) ≠ home); ` +
                                `releasePolicy:"persist" leaves the spring at the dragged target (D2)`,
                        );
                    }

                    // Home/End STILL recenters (no capability lost). Focus the box,
                    // press Home, then wait for the recenter spring to actually REACH
                    // identity (the asserted end-state — never "stopped changing," so
                    // the spring's post-reseat startup pause cannot false-fail it; a
                    // box that genuinely never recenters reds via the backstop).
                    const focused = await page.evaluate(() => {
                        const el = document.querySelector(".demo-box");
                        el?.focus();
                        return document.activeElement === el;
                    });
                    if (!focused) {
                        fail("clause (b) — the .demo-box could not take keyboard focus (Home cannot actuate)");
                    }
                    await page.keyboard.press("Home");
                    const home = await waitForIdentity(page, ".demo-box");
                    if (home.reached) {
                        ok(
                            `clause (b) — Home STILL recenters (transform reached identity, ${home.last}) — ` +
                                `the deliberate return-home affordance is preserved`,
                        );
                    } else {
                        fail(
                            `clause (b) — Home did NOT recenter the box (transform=${String(home.last).slice(0, 48)}…) — ` +
                                `the explicit recenter affordance regressed`,
                        );
                    }
                }
            } finally {
                await ctx.close();
            }
        }
        },
    );
    if (result.skipped) console.log(`  ○ browser half skipped — ${result.reason}`);
}

// ── L.W5 — the LIGHT gesture-primitive half (S1 bounds / S2 snap / S4 drag2D) ─
//
// A minimal element stub: records the per-gesture listeners `Draggable`
// binds, no-ops pointer capture, and dispatches a synthetic PointerEvent to
// the bound handlers. `Draggable.handle{Down,Move,Up}` read only
// `e.pointerId` / `e.clientX|Y` / `e.timeStamp` and call
// `el.addEventListener` / `el.setPointerCapture`, so this faithful stub drives
// the real (uncured) class with no DOM.
function stubEl() {
    const listeners = new Map();
    return {
        listeners,
        addEventListener(type, fn) {
            if (!listeners.has(type)) listeners.set(type, new Set());
            listeners.get(type).add(fn);
        },
        removeEventListener(type, fn) {
            listeners.get(type)?.delete(fn);
        },
        setPointerCapture() {},
        releasePointerCapture() {},
        dispatch(type, ev) {
            for (const fn of listeners.get(type) ?? []) fn(ev);
        },
    };
}

const pe = (type, { clientX = 0, clientY = 0, pointerId = 1, timeStamp = 0 }) => ({
    type,
    clientX,
    clientY,
    pointerId,
    timeStamp,
});

async function lightHalf() {
    console.log(
        "\n  L.W5 — the LIGHT gesture-primitive half (S1 bounds / S2 snap / S4 drag2D):",
    );

    let mod;
    try {
        mod = await import(pathToFileURL(LIB).href);
    } catch (e) {
        fail(
            `the LIGHT barrel could not be imported (${LIB}) — build the ` +
                `library first (\`npm run build\`): ${e?.message ?? e}`,
        );
        return;
    }
    const { Draggable, drag2D } = mod;
    if (typeof Draggable !== "function") {
        fail(`the LIGHT barrel does not export \`Draggable\` as a class`);
        return;
    }

    const dragSrc = readFileSync(DRAG_SRC, "utf8");

    // ── clause (S1 bounds) — a drag past max is clamped (rubberBand:0) ────────
    {
        // Static corroborator: `DragOptions` declares a `bounds` field.
        const hasBoundsField =
            /bounds\??\s*:\s*\{[^}]*\bmin\b[^}]*\bmax\b/.test(dragSrc) ||
            /bounds\??\s*:\s*\{\s*min:\s*number;\s*max:\s*number\s*\}/.test(
                dragSrc,
            );

        const el = stubEl();
        const d = new Draggable({ bounds: { min: 0, max: 200 }, rubberBand: 0 });
        d.attach(el);
        el.dispatch("pointerdown", pe("pointerdown", { clientX: 100, timeStamp: 0 }));
        // Move 100px past the declared max (200) → 300.
        el.dispatch("pointermove", pe("pointermove", { clientX: 300, timeStamp: 16 }));
        const target = d.spring.target;
        d.dispose?.();

        const clamped = target <= 200;
        if (!clamped || !hasBoundsField) {
            fail(
                `clause (S1 bounds) — a drag past max=200 with rubberBand:0 left ` +
                    `\`spring.target = ${target}\` (expected <= 200, a hard clamp); ` +
                    `DragOptions \`bounds\` field present in drag.ts: ${hasBoundsField}. ` +
                    `Today the bounds option is ignored — \`handleMove\` sets ` +
                    `\`spring.target = value\` unconditionally (W-GESTURE-BOUNDS born-RED).`,
            );
        } else {
            ok(
                `clause (S1 bounds) — a drag past max=200 (rubberBand:0) clamps ` +
                    `\`spring.target\` to ${target} (<= 200); DragOptions carries a bounds field`,
            );
        }
    }

    // ── clause (S2 snap) — release at 60 (vel 0) snaps to nearest target 100 ──
    {
        const hasSnapField = /snap\??\s*:\s*(?:readonly\s*)?number\s*\[\s*\]/.test(
            dragSrc,
        );

        const el = stubEl();
        const d = new Draggable({ snap: [0, 100, 200] });
        d.attach(el);
        // Down then up at x=60 with no intervening move (velocity 0). The
        // pointerup carries the same timeStamp neighborhood so estimateVelocity
        // returns ~0 — a held release at 60.
        el.dispatch("pointerdown", pe("pointerdown", { clientX: 60, timeStamp: 0 }));
        el.dispatch("pointerup", pe("pointerup", { clientX: 60, timeStamp: 0 }));
        const target = d.spring.target;
        d.dispose?.();

        // The nearest snap target to a rest-projection of 60 is 100.
        const snappedTo100 = Math.abs(target - 100) < 1e-6;
        if (!snappedTo100 || !hasSnapField) {
            fail(
                `clause (S2 snap) — a release at x=60 with velocity 0 left ` +
                    `\`spring.target = ${target}\` (expected 100, the nearest snap ` +
                    `target in [0,100,200]); DragOptions \`snap\` field present in ` +
                    `drag.ts: ${hasSnapField}. Today \`handleUp\` reseats the spring ` +
                    `at the bare release coordinate — no snap projection ` +
                    `(W-GESTURE-BOUNDS snap arm born-RED).`,
            );
        } else {
            ok(
                `clause (S2 snap) — a release at x=60 (vel 0) reseats ` +
                    `\`spring.target\` to ${target} (the nearest snap target); ` +
                    `DragOptions carries a snap field`,
            );
        }
    }

    // ── clause (S4 drag2D) — the 2-D single-call sugar follows both axes ──────
    {
        const hasDrag2DSource = /\bdrag2D\b/.test(dragSrc);
        const hasHandleSource = /\bDrag2DHandle\b/.test(dragSrc);

        if (typeof drag2D !== "function") {
            fail(
                `clause (S4 drag2D) — \`drag2D\` is NOT exported from the LIGHT ` +
                    `barrel (typeof === "${typeof drag2D}"); drag.ts declares ` +
                    `\`drag2D\`: ${hasDrag2DSource}, \`Drag2DHandle\`: ${hasHandleSource}. ` +
                    `Every 2-D drag needs eight lines of two-Draggable boilerplate ` +
                    `(W-FRONT-DOOR+ born-RED — \`grep -nE "drag2D|Drag2DHandle" ` +
                    `src/animation/orchestration/drag/draggable.ts\` → zero hits).`,
            );
        } else {
            // Functional follow: a 2-D drag from (50, 80) to (100, 120) should
            // leave handle.value near (100, 120).
            let followed = false;
            let valX;
            let valY;
            try {
                const el = stubEl();
                const handle = drag2D(el, {});
                el.dispatch(
                    "pointerdown",
                    pe("pointerdown", { clientX: 50, clientY: 80, timeStamp: 0 }),
                );
                el.dispatch(
                    "pointermove",
                    pe("pointermove", { clientX: 100, clientY: 120, timeStamp: 16 }),
                );
                valX = handle?.value?.x;
                valY = handle?.value?.y;
                followed =
                    typeof valX === "number" &&
                    typeof valY === "number" &&
                    Math.abs(valX - 100) < 1 &&
                    Math.abs(valY - 120) < 1;
                handle?.dispose?.();
            } catch (e) {
                fail(`clause (S4 drag2D) — drag2D follow threw: ${e?.message ?? e}`);
            }
            if (!followed) {
                fail(
                    `clause (S4 drag2D) — a 2-D drag from (50,80) to (100,120) did ` +
                        `NOT follow: handle.value = (${valX}, ${valY}); expected ` +
                        `near (100, 120).`,
                );
            } else if (!hasDrag2DSource || !hasHandleSource) {
                fail(
                    `clause (S4 drag2D) — drag2D follows but the source markers are ` +
                        `missing (drag2D: ${hasDrag2DSource}, Drag2DHandle: ${hasHandleSource}).`,
                );
            } else {
                ok(
                    `clause (S4 drag2D) — drag2D follows both axes to ` +
                        `(${valX}, ${valY}); Drag2DHandle exported`,
                );
            }
        }
    }
}

await lightHalf();
await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:drag-gesture — FAIL (${failures.length}):\n  ` +
            failures.join("\n  ") +
            `\n\n  One or more drag clauses red. The browser half (I.W4 D1/D2): a drag highlights the ` +
            `chrome it sweeps (B6-a — the global select-suppression token is not live for some surface), ` +
            `or the dragged box recenters instead of persisting (B6-b — releasePolicy not "persist"), or ` +
            `Home lost its recenter. The LIGHT gesture-primitive half (L.W5 S1/S2/S4): Draggable lacks the ` +
            `bounds clamp / snap projection, or drag2D is absent (W-GESTURE-BOUNDS + W-FRONT-DOOR+).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:drag-gesture — PASS: a real drag over a chrome label selects no text and userSelect is " +
        "suppressed for the whole gesture across every drag surface (D1 — the shared seam owns the global " +
        "is-dragging token); the dragged square persists where released (D2 — releasePolicy:\"persist\"); " +
        "Home still recenters (B6-a + B6-b closed at the seam). The LIGHT gesture-primitive half holds: " +
        "Draggable clamps to bounds (S1), snaps to the nearest target on release (S2), and drag2D follows " +
        "both axes (S4) — W-GESTURE-BOUNDS + W-FRONT-DOOR+ closed.",
);
