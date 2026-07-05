#!/usr/bin/env node
/**
 * proof:mobile-single-page — H.W7 S1 (the mobile stack→overlay transposition).
 *
 * The mobile layout STACKED the controls over a ~30px stage (an `auto` row1
 * starving a `1fr` row2 to ~0); the mandate is that the animation be the
 * full-bleed BACKGROUND and the controls a bottom SHEET overlaying it. This
 * gate bites the RENDERED geometry of that transposition at 390×844 — the
 * single broadest device the contract names — across the three mode-classes
 * (subject / editor / storyboard, scenes.ts `stageModeFor`).
 *
 * FOUR browser clauses + one static clause, each BITING on the exact defect it
 * forbids (born-RED on the mobile stack + the CSS-eased drawer today, GREEN on
 * the fixed full-bleed stage + the SpringProgress sheet):
 *
 *   (a) THE STAGE IS THE FULL-BLEED BACKGROUND — the SUBJECT-class UNOCCLUDED
 *       visible fraction ≥ 0.45 (WV-W7-HIGH-5 + HIGH-3 + MED-3). With the
 *       controls sheet FORCED OPEN (the open-state geometry — a fresh load with
 *       no selection v-show-hides the sheet, so the harness seeds the store +
 *       drives the sheet to its expanded detent), the UNOCCLUDED visible stage
 *       fraction — measured `clamp(sheet.top) − clamp(sceneHost.top)`, NOT the
 *       layout box (a `fixed; inset:0` stage has full-height LAYOUT regardless
 *       of a covering sheet, so the layout-box gate would pass VACUOUSLY) — is
 *       ≥ 0.45·innerHeight AND the host bottom ≤ innerHeight. Applied ONLY to
 *       the SUBJECT mode-class (cube/amiga/square — the 3D object IS the
 *       backdrop); the EDITOR (easing) + STORYBOARD (spring/sequence/path)
 *       classes are EXEMPT (the curve/rows/path ARE the content, not a
 *       background to preserve — there the sheet may rise to its 70dvh ceiling).
 *       BITE: the live STACK (open pane → stage evicted to ~30px, frac≈0.04)
 *       reds; the layout-box vacuity is foreclosed by measuring the sheet-top
 *       occlusion. NON-VACUITY: the host must have real area + the sheet must
 *       resolve, or the clause fails (a missing sheet/host cannot pass GREEN).
 *
 *   (b) OPENING THE CONTROLS OVERLAYS — IT DOES NOT SHIFT THE STAGE. Driving the
 *       sheet open↔closed (a REAL grab-handle click — the disjoint gesture
 *       surface, BLK-6) moves the scene-host rect by ±1px (the overlay does not
 *       displace the stage). BITE: the live STACK evicts the stage from `1fr`
 *       to ~30px when the pane opens (a massive shift) → reds; greens on the
 *       fixed full-bleed overlay (the stage rect is identical open vs closed).
 *       SUBJECT class (the full-bleed background is the thing that must not move).
 *
 *   (c) BOTH DOCKS AFFIXED. The top dock + the bottom menubar are
 *       `position: fixed` (not in normal flow) at 390×844 — the ALREADY-SOTA
 *       affixed-dock scaffolding (inv δ) the rebuild must not regress. BITE:
 *       un-affix a dock (drop `position: fixed`) → reds.
 *
 *   (d) THE DETENTS ARE ≤70dvh, NEVER FULL-HEIGHT (WV-W7-HIGH-5). The sheet's
 *       expanded detent (`--sheet-detent-expanded`, the resolved px) is ≤ 0.70·
 *       innerHeight AND the open sheet's rendered height is ≤ 0.70·innerHeight —
 *       a covering sheet that ate the whole viewport would pass (a) vacuously
 *       (the stage's LAYOUT box is still full-height), so this caps the sheet
 *       independently. BITE: restore the deleted near-full-viewport max-height
 *       (`100dvh − …`) → the detent exceeds 0.70·innerHeight → reds. All three
 *       mode-classes (the ceiling is universal; only the floor (a) is
 *       subject-only).
 *
 *   STATIC — THE MOBILE STACK IS DELETED, THE STAGE LEAVES THE FLOW. The
 *   `grid-rows-[auto_1fr_auto]` mobile branch is GONE from
 *   AnimationControlsGroup.vue (no legacy beside the replacement) AND the mobile
 *   `@media (max-width: 1023px)` rule makes `.stage-cell` `position: fixed;
 *   inset: 0` (the stage left the grid). BITE: re-introduce the stacked mobile
 *   grid OR drop the fixed full-bleed mobile stage → reds. (Comments that
 *   NARRATE the deletion are stripped before the scan — a doc-comment is not a
 *   usage.)
 *
 * THE MODE-CLASS is read PER SCENE from the live `controls-pane--stage-<mode>`
 * class (single-sourced in scenes.ts `stageModeFor`); the 0.45 floor (clause a)
 * applies to `subject` only, exactly as the contract specifies. The EXEMPT
 * classes are still asserted to OPEN (a non-vacuity guard: the editor/storyboard
 * sheet must materialise + occupy the viewport, just without the floor).
 *
 * Settle-gated on the H.W1 FSM resting (mirrors proof:stage-within-docks /
 * proof:demo-shell-grid): the scene is pinned via the lib's navToScene (an
 * IN-PAGE hash assignment — NOT page.goto, which clears storage + the H.W1
 * reconcile trap — settled on the destination's per-EXPECTED control surface),
 * the viewport is RE-ASSERTED after navigation (Playwright resets on navigate),
 * the store is seeded OPEN with a real selectedAnimation, and the sheet is
 * driven to its expanded detent before measuring.
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * resolveChromium + context/teardown, J.W3 S1). Browser-led (the overlay
 * geometry is a rendered fact) + the one static source clause; under
 * KF_REQUIRE_BROWSER a playwright-absent skip becomes a hard fail AT THE LIB
 * SEAM so a SHIP is never green-reported un-exercised. Re-runnable:
 * `node scripts/proof-mobile-single-page.mjs`. Serves the BUILT dist/gh-pages/
 * (run `npm run gh-pages` first).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:mobile-single-page — H.W7 S1 (the stage is the full-bleed background; the controls OVERLAY it; ≤70dvh detents)",
);

const CTRL_KEY = "animation-groups-control-options-store";

// The mobile target the contract names. 390×844 = the iPhone 12/13/14 logical
// viewport (the single broadest device the §Hard gate fixes the measure at).
const VW = 390;
const VH = 844;

// The visible-fraction FLOOR (clause a) — subject class only. The contract's
// 0.45 (the rebuild measures ≈0.48; the live stack measures ≈0.04).
const VISIBLE_FLOOR = 0.45;
// The detent CEILING (clause d) — universal. ≤70dvh, NEVER full-height.
const DETENT_CEILING = 0.7;
// Sub-pixel / dvh-vs-innerHeight rounding tolerance.
const TOL = 2;

// The route → superKey map (demo/app/scene/scenes.ts) the control-options store is
// keyed by. The harness seeds the OPEN state under this key so the sheet's
// `v-show` (gated on selectedAnimation) materialises.
const SUPER_KEY_BY_SCENE = {
    cube: "Cube",
    amiga: "Amiga",
    square: "Square",
    easing: "Easing",
    spring: "Spring",
    sequence: "Sequence",
};

// The scenes by mode-class (scenes.ts `STAGE_MODES`). `subject` carries the
// 0.45 floor; `editor`/`storyboard` are floor-EXEMPT but still asserted to open
// + sit under the 70dvh ceiling. `trigger` = the destination's control-tab
// label navToScene settles on (null = the scene renders NO control panel).
const SCENES = [
    { scene: "cube", mode: "subject", trigger: "Controls" },
    { scene: "amiga", mode: "subject", trigger: "Controls" },
    { scene: "square", mode: "subject", trigger: "Controls" },
    { scene: "easing", mode: "editor", trigger: "Easing" },
    { scene: "spring", mode: "storyboard", trigger: "Spring" },
    // sequence — SURFACES EMPTY (its DFA set is []; SQ-T3/T.B4: the pane/sheet
    // mounts iff surfacesFor(scene).length > 0, so NO sheet is the CORRECT
    // mobile state — the old always-mounted sheet was a grab handle onto zero
    // content, the exact occlusion-recurrence T.B4 cures). When T.B2's
    // derivation lands and sequence derives the triad from its real painting
    // channels, flip `surfaces` back and this row re-joins the sheet clauses
    // (the batch-④ arming-audit).
    { scene: "sequence", mode: "storyboard", trigger: null, surfaces: false },
];
const TRIGGER_BY_SCENE = Object.fromEntries(SCENES.map((s) => [s.scene, s.trigger]));

/** Settle on #/<scene> via the lib's navToScene (an IN-PAGE hash assignment —
 *  storage + the H.W1 trap survive; page.goto clears both — settled on the
 *  destination's per-EXPECTED control surface). Re-assert the viewport AFTER
 *  navigation (Playwright resets on navigate). Then FORCE the open state: seed
 *  the control-options store under the scene's superKey with a real
 *  selectedAnimation + isControlsPanelOpen=true (the sheet's v-show needs a
 *  selection; the OPEN-NOTES from impl-w7-overlay.md require a deterministic
 *  open), and DRIVE the sheet to its expanded detent via a real grab-handle
 *  click if it is not already open. */
async function settleAndOpen(page, scene) {
    await navToScene(page, scene, TRIGGER_BY_SCENE[scene], { timeout: 8000 });
    await page.setViewportSize({ width: VW, height: VH });

    // Seed the OPEN state deterministically. The store is keyed by superKey; the
    // default carries isControlsPanelOpen:true, but the sheet's v-show needs a
    // non-empty selectedAnimation. If the store already has one (the demo seeds
    // Cube→"Rotations"), keep it; else fall back to the first dock option name.
    const superKey = SUPER_KEY_BY_SCENE[scene];
    await page.evaluate(
        ([ck, sk]) => {
            const firstOption =
                [...document.querySelectorAll("[role=option]")]
                    .map((el) => el.textContent?.trim())
                    .find((t) => t && t.length > 0) ?? "";
            let store;
            try {
                store = JSON.parse(localStorage.getItem(ck) || "{}");
            } catch {
                store = {};
            }
            const prev =
                sk && store[sk] && typeof store[sk] === "object" ? store[sk] : {};
            store[sk] = {
                selectedControl: prev.selectedControl ?? "controls",
                selectedKeyframesControl: prev.selectedKeyframesControl ?? "string",
                isTimelineExpanded: false,
                ...prev,
                isControlsPanelOpen: true,
                selectedAnimation:
                    prev.selectedAnimation && prev.selectedAnimation.length > 0
                        ? prev.selectedAnimation
                        : firstOption,
            };
            localStorage.setItem(ck, JSON.stringify(store));
        },
        [CTRL_KEY, superKey],
    );
    // The store is read on mount; a reload re-hydrates the seeded state. Re-pin the
    // hash + viewport after reload (a reload restarts at the index route).
    await page.reload({ waitUntil: "load" });
    await navToScene(page, scene, TRIGGER_BY_SCENE[scene], { timeout: 8000 });
    await page.setViewportSize({ width: VW, height: VH });
    await page.waitForTimeout(900); // the spring settles (<350ms) + reflow

    // ── S.G1 S4 (p10 F5 arming re-arm; T7 — gate follows code) ──
    // The mobile sheet is now BORN AT PEEK (the S.G1 three-writer peek cure): the
    // host mount-reset overrides the seeded `isControlsPanelOpen:true` on the mobile
    // layout. This gate measures the EXPANDED-detent overlay geometry (clause a's
    // unoccluded floor + the editor/storyboard non-vacuity "sheet must occupy the
    // viewport"), so it DRIVES the sheet to its expanded detent via a real
    // grab-handle tap — exactly what this function's contract already names. The
    // born-open state the store seed relied on is what the contract deletes; the tap
    // restores the measured state without depending on the deleted auto-open.
    const alreadyOpen = await page.evaluate(
        () => !!document.querySelector(".controls-pane-wrapper.controls-pane--open"),
    );
    if (!alreadyOpen) {
        // The grab pill toggles on POINTER events; this context has no hasTouch, so
        // a real-mouse click (which fires pointerdown/pointerup — the same actuation
        // this gate's no-shift leg uses) is the open gesture, NOT page.tap.
        await page.click(".sheet-grab-handle", { timeout: 5000 }).catch(() => {});
        await page
            .waitForFunction(
                () =>
                    !!document.querySelector(
                        ".controls-pane-wrapper.controls-pane--open",
                    ),
                { timeout: 5000 },
            )
            .catch(() => {});
        await page.waitForTimeout(600); // the open spring settles to the detent
    }
}

/** Wait until the fixed stage + the named subject host + the sheet resolve (not
 *  mid-mount). */
async function waitMounted(page) {
    return page
        .waitForFunction(
            () => {
                const cell = document.querySelector(".stage-cell");
                const host = document.querySelector(".scene-host");
                const sheet = document.querySelector(".controls-pane-wrapper");
                if (!cell || !host || !sheet) return false;
                const hr = host.getBoundingClientRect();
                const sr = sheet.getBoundingClientRect();
                return hr.width > 0 && hr.height > 0 && sr.width > 0 && sr.height > 0;
            },
            { timeout: 8000 },
        )
        .then(() => true)
        .catch(() => false);
}

/** The geometry probe — the clamped sheet/host tops (the UNOCCLUDED measure),
 *  the rendered sheet height, the resolved expanded detent, the dock positions,
 *  and the live mode-class. */
async function probeGeometry(page) {
    return page.evaluate(() => {
        const vh = window.innerHeight;
        const clamp = (v) => Math.max(0, Math.min(vh, v));
        const host = document.querySelector(".scene-host");
        const sheet = document.querySelector(".controls-pane-wrapper");
        const cell = document.querySelector(".stage-cell");
        const hr = host.getBoundingClientRect();
        const sr = sheet.getBoundingClientRect();
        const sheetCs = getComputedStyle(sheet);
        const cellCs = getComputedStyle(cell);

        // The live mode-class (controls-pane--stage-<mode>) — single-sourced from
        // scenes.ts stageModeFor, threaded App→EditorShell→…→the sheet wrapper.
        const modeClass =
            [...sheet.classList]
                .map((c) => /^controls-pane--stage-(.+)$/.exec(c)?.[1])
                .find(Boolean) ?? null;

        // The resolved expanded detent (the px the open sheet's height lerps to).
        // getComputedStyle returns the COMPUTED custom-property value, but it may
        // be the un-resolved calc() expression; resolve it by probing a temp.
        const detentExprPx = (() => {
            const probe = document.createElement("div");
            probe.style.position = "absolute";
            probe.style.visibility = "hidden";
            probe.style.height = "var(--sheet-detent-expanded)";
            sheet.appendChild(probe);
            const h = probe.getBoundingClientRect().height;
            probe.remove();
            return h;
        })();

        // Dock-band identification (robust to the multi-z-dock DOM): a dock is a
        // z-dock element with real area; affixed iff position:fixed.
        const zdocks = [...document.querySelectorAll(".z-dock, [class*='z-dock']")];
        let topDockAffixed = false;
        let bottomDockAffixed = false;
        let topFound = false;
        let bottomFound = false;
        for (const el of zdocks) {
            const r = el.getBoundingClientRect();
            if (!(r.width > 0 && r.height > 0)) continue; // skip collapsed h:0
            const fixed = getComputedStyle(el).position === "fixed";
            if (r.top < vh / 2) {
                topFound = true;
                topDockAffixed = topDockAffixed || fixed;
            } else {
                bottomFound = true;
                bottomDockAffixed = bottomDockAffixed || fixed;
            }
        }

        return {
            vh,
            host: { top: hr.top, bottom: hr.bottom, w: hr.width, h: hr.height },
            sheet: {
                top: sr.top,
                bottom: sr.bottom,
                w: sr.width,
                h: sr.height,
                pos: sheetCs.position,
                zi: sheetCs.zIndex,
            },
            cellPos: cellCs.position,
            cellInsetTop: cellCs.top,
            modeClass,
            detentExprPx,
            visibleUnoccluded: clamp(sr.top) - clamp(hr.top),
            topFound,
            bottomFound,
            topDockAffixed,
            bottomDockAffixed,
        };
    });
}

async function browserHalf() {
    const result = await withPage(
        {
            distDir: DIST,
            label: "the mobile-overlay geometry",
            context: { viewport: { width: VW, height: VH } },
        },
        async (_libPage, { url: base, browser }) => {
        // Per-scene FRESH pages in their OWN contexts (fresh storage — the
        // scene-machine restore must not bleed a prior scene's persisted state
        // into the next scene's load), from the lifecycle's browser handle.
        for (const { scene, mode, surfaces } of SCENES) {
            const page = await browser.newPage({
                viewport: { width: VW, height: VH },
            });
            await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });

            // A surfaces:false scene mounts NO sheet by construction (SQ-T3):
            // assert the stage mounts AND the wrapper is ABSENT, then move on —
            // the sheet-geometry clauses are vacuous for it, and forcing the
            // sheet open would resurrect the zero-content grab handle.
            if (surfaces === false) {
                await navToScene(page, scene, TRIGGER_BY_SCENE[scene], { timeout: 8000 });
                const state = await page.evaluate(() => ({
                    hasCell: !!document.querySelector(".stage-cell"),
                    hasHost: !!document.querySelector(".scene-host"),
                    hasSheet: !!document.querySelector(".controls-pane-wrapper"),
                }));
                if (state.hasCell && state.hasHost && !state.hasSheet) {
                    ok(
                        `${scene} (${mode}) ${VW}×${VH} — stage mounted, NO sheet ` +
                            `(surfaces empty; the SQ-T3 mount-iff-content invariant holds)`,
                    );
                } else {
                    fail(
                        `${scene} (${mode}) ${VW}×${VH} — expected stage WITHOUT a sheet ` +
                            `(surfaces empty), got cell:${state.hasCell} host:${state.hasHost} ` +
                            `sheet:${state.hasSheet}`,
                    );
                }
                await page.close();
                continue;
            }

            await settleAndOpen(page, scene);
            const mounted = await waitMounted(page);
            const tag = `${scene} (${mode}) ${VW}×${VH}`;

            if (!mounted) {
                const dbg = await page.evaluate(() => ({
                    hasCell: !!document.querySelector(".stage-cell"),
                    hasHost: !!document.querySelector(".scene-host"),
                    hasSheet: !!document.querySelector(".controls-pane-wrapper"),
                    hash: location.hash,
                }));
                fail(
                    `${tag} — the stage/host/sheet never mounted (cell:${dbg.hasCell}, ` +
                        `host:${dbg.hasHost}, sheet:${dbg.hasSheet}, hash:${dbg.hash}) — ` +
                        `the FSM may not have rested or the sheet stayed v-show-hidden`,
                );
                await page.close();
                continue;
            }

            const g = await probeGeometry(page);

            // NON-VACUITY: real host area + both dock bands found + sheet resolved.
            if (!(g.host.w > 0 && g.host.h > 0)) {
                fail(
                    `${tag} — the scene host has zero area ` +
                        `(w:${Math.round(g.host.w)} h:${Math.round(g.host.h)}); a vacuous pass is forbidden`,
                );
                await page.close();
                continue;
            }
            if (!g.topFound || !g.bottomFound) {
                fail(
                    `${tag} — a dock band was not found ` +
                        `(top:${g.topFound}, bottom:${g.bottomFound}); the affixed-dock ` +
                        `assertion (c) cannot run without both bands`,
                );
                await page.close();
                continue;
            }

            // Confirm the mode-class is read PER SCENE (the live class matches the
            // scenes.ts STAGE_MODES expectation) — the mode IS scene data.
            if (g.modeClass !== mode) {
                fail(
                    `${tag} — the live stage mode-class is \`${g.modeClass}\`, expected ` +
                        `\`${mode}\` (scenes.ts stageModeFor must single-source the mode; the ` +
                        `0.45 floor keys on the SUBJECT class — a wrong class would mis-gate)`,
                );
            } else {
                ok(`${tag} — mode-class read per scene (controls-pane--stage-${mode})`);
            }

            // ── (a) THE FULL-BLEED BACKGROUND — visible fraction ≥ 0.45 (SUBJECT only) ──
            const frac = g.visibleUnoccluded / g.vh;
            const hostInViewport = g.host.bottom <= g.vh + TOL;
            if (mode === "subject") {
                if (frac >= VISIBLE_FLOOR && hostInViewport) {
                    ok(
                        `${tag} — (a) UNOCCLUDED visible stage fraction ${frac.toFixed(3)} ≥ ${VISIBLE_FLOOR} ` +
                            `(clamp(sheet.top ${Math.round(g.sheet.top)}) − clamp(host.top ${Math.round(g.host.top)}) = ` +
                            `${Math.round(g.visibleUnoccluded)}px of ${g.vh}) AND host.bottom ${Math.round(g.host.bottom)} ≤ ${g.vh} ` +
                            `— the subject IS the full-bleed background, not occluded by the open sheet`,
                    );
                } else {
                    fail(
                        `${tag} — (a) the subject is NOT the full-bleed background: UNOCCLUDED visible ` +
                            `fraction ${frac.toFixed(3)} (need ≥ ${VISIBLE_FLOOR}) — ` +
                            `clamp(sheet.top ${Math.round(g.sheet.top)}) − clamp(host.top ${Math.round(g.host.top)}) = ` +
                            `${Math.round(g.visibleUnoccluded)}px of ${g.vh}` +
                            `${hostInViewport ? "" : `; host.bottom ${Math.round(g.host.bottom)} > ${g.vh} (parked below the fold)`}. ` +
                            `The mobile STACK starves the stage when the pane opens; the fixed full-bleed stage ` +
                            `+ the floor-respecting expanded detent (S1) is the fix.`,
                    );
                }
            } else {
                // EDITOR / STORYBOARD — the floor is EXEMPT (the content card IS the
                // protagonist). Non-vacuity guard: the sheet must still be OPEN +
                // occupy the viewport (a real overlay, just without the floor).
                if (g.sheet.h > 0 && g.sheet.bottom <= g.vh + TOL) {
                    ok(
                        `${tag} — (a) floor EXEMPT for the ${mode} class (the curve/rows/path ARE the content); ` +
                            `the sheet is a real overlay (h ${Math.round(g.sheet.h)}px, visible stage ${frac.toFixed(3)} — ` +
                            `intentionally below the subject floor)`,
                    );
                } else {
                    fail(
                        `${tag} — (a) the ${mode} sheet did not open as a real overlay ` +
                            `(h ${Math.round(g.sheet.h)}px, bottom ${Math.round(g.sheet.bottom)} vs vh ${g.vh}); ` +
                            `the floor is exempt but the sheet must still materialise (non-vacuity)`,
                    );
                }
            }

            // ── (d) DETENTS ≤ 70dvh, NEVER FULL-HEIGHT (universal) ──
            const detentFrac = g.detentExprPx / g.vh;
            const sheetFrac = g.sheet.h / g.vh;
            if (detentFrac <= DETENT_CEILING + 0.005 && sheetFrac <= DETENT_CEILING + 0.005) {
                ok(
                    `${tag} — (d) detents ≤ 70dvh (expanded detent ${Math.round(g.detentExprPx)}px = ` +
                        `${detentFrac.toFixed(3)}·vh; open sheet ${Math.round(g.sheet.h)}px = ${sheetFrac.toFixed(3)}·vh) — never full-height`,
                );
            } else {
                fail(
                    `${tag} — (d) a detent exceeds the 70dvh ceiling ` +
                        `(--sheet-detent-expanded ${Math.round(g.detentExprPx)}px = ${detentFrac.toFixed(3)}·vh; ` +
                        `open sheet ${Math.round(g.sheet.h)}px = ${sheetFrac.toFixed(3)}·vh). ` +
                        `The near-full-viewport max-height must stay DELETED (S1b — never full-height).`,
                );
            }

            // ── (c) BOTH DOCKS AFFIXED (position: fixed) ──
            if (g.topDockAffixed && g.bottomDockAffixed) {
                ok(`${tag} — (c) both docks affixed (top + bottom menubar position:fixed)`);
            } else {
                fail(
                    `${tag} — (c) a dock is NOT affixed ` +
                        `(top fixed:${g.topDockAffixed}, bottom fixed:${g.bottomDockAffixed}); ` +
                        `the ALREADY-SOTA affixed-dock scaffolding (inv δ) must not regress`,
                );
            }

            // The fixed full-bleed stage itself (the structural anchor of the whole
            // overlay model) — the cell is position:fixed inset:0 on mobile.
            if (g.cellPos === "fixed") {
                ok(`${tag} — the stage cell is position:fixed (the full-bleed fixed layer, S1)`);
            } else {
                fail(
                    `${tag} — the stage cell position is \`${g.cellPos}\`, expected \`fixed\` ` +
                        `(the mobile stage must LEAVE the grid flow and become the full-bleed fixed layer, S1)`,
                );
            }

            // ── (b) OPENING OVERLAYS, DOES NOT SHIFT THE STAGE (SUBJECT class) ──
            // Drive the sheet open↔closed via a REAL grab-handle click (the disjoint
            // gesture surface) and assert the scene-host rect is invariant.
            if (mode === "subject") {
                const hostBefore = await page.evaluate(() => {
                    const h = document.querySelector(".scene-host").getBoundingClientRect();
                    return { top: h.top, bottom: h.bottom, left: h.left };
                });
                const clicked = await page
                    .click(".sheet-grab-handle", { timeout: 4000 })
                    .then(() => true)
                    .catch(() => false);
                await page.waitForTimeout(600); // the spring settles the detent swap
                if (!clicked) {
                    fail(
                        `${tag} — (b) the grab handle was not clickable (the disjoint gesture ` +
                            `surface must own the open/close swipe, BLK-6) — cannot assert the no-shift overlay`,
                    );
                } else {
                    const hostAfter = await page.evaluate(() => {
                        const h = document
                            .querySelector(".scene-host")
                            .getBoundingClientRect();
                        return { top: h.top, bottom: h.bottom, left: h.left };
                    });
                    const dTop = Math.abs(hostAfter.top - hostBefore.top);
                    const dBottom = Math.abs(hostAfter.bottom - hostBefore.bottom);
                    if (dTop <= TOL && dBottom <= TOL) {
                        ok(
                            `${tag} — (b) opening/closing the sheet OVERLAYS the stage (host rect shift ` +
                                `Δtop ${dTop.toFixed(1)}px, Δbottom ${dBottom.toFixed(1)}px ≈ 0) — not a displacing stack`,
                        );
                    } else {
                        fail(
                            `${tag} — (b) toggling the sheet SHIFTED the stage ` +
                                `(host Δtop ${dTop.toFixed(1)}px, Δbottom ${dBottom.toFixed(1)}px > ${TOL}px) — ` +
                                `the mobile STACK evicts the stage when the pane opens; the fixed full-bleed ` +
                                `overlay must keep the stage rect invariant (S1).`,
                        );
                    }
                }
            }

            await page.close();
        }
        },
    );
    if (result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
    }
}

// ── STATIC — the mobile stack is DELETED, the stage LEAVES the flow ───────────
function stripComments(src) {
    // strip /* … */ (style) and <!-- … --> (template) comments so a doc-comment
    // that NARRATES the stack deletion is not mistaken for a usage.
    return src
        .replace(/\/\*[\s\S]*?\*\//g, " ")
        .replace(/<!--[\s\S]*?-->/g, " ");
}

function staticHalf() {
    const groupPath = path.join(
        REPO,
        "demo/@/components/custom/animation-transport/AnimationControlsGroup.vue",
    );
    if (!fs.existsSync(groupPath)) {
        fail(`static — AnimationControlsGroup.vue not found at ${groupPath}`);
        return;
    }
    // S.A0-fallout co-edit: the component's style tier lives in a colocated
    // sourced stylesheet (`<style scoped src="./AnimationControlsGroup.css">` —
    // the 500L-tripwire carve, D2-precedent). The static surface is the SFC +
    // that sibling stylesheet, concatenated.
    const groupCssPath = groupPath.replace(/\.vue$/, ".css");
    const src = stripComments(
        fs.readFileSync(groupPath, "utf8") +
            (fs.existsSync(groupCssPath)
                ? "\n" + fs.readFileSync(groupCssPath, "utf8")
                : ""),
    );

    // (1) The `grid-rows-[auto_1fr_auto]` mobile stack is GONE (no legacy beside
    //     the replacement). The mobile stack was the literal Tailwind arbitrary
    //     value on the root; any `grid-rows-[...auto_1fr_auto...]` survival reds.
    if (/grid-rows-\[[^\]]*auto[\s_]*1fr[\s_]*auto[^\]]*\]/.test(src)) {
        fail(
            "static — the mobile `grid-rows-[auto_1fr_auto]` STACK survives in " +
                "AnimationControlsGroup.vue; it must be DELETED (the stage leaves the grid, " +
                "the controls become a sheet — no legacy beside the replacement, S1)",
        );
    } else {
        ok("static — the mobile `grid-rows-[auto_1fr_auto]` stack is deleted (no legacy beside the replacement)");
    }

    // (2) The mobile stage LEAVES the grid: a `@media (max-width: 1023px)` block
    //     makes `.stage-cell` `position: fixed` + `inset: 0` (the full-bleed
    //     fixed layer). Scope the scan to the mobile media block so a desktop
    //     rule cannot satisfy it.
    const mobileBlockMatch = /@media[^{]*max-width:\s*1023px[^{]*\{([\s\S]*)$/.exec(src);
    const styleScope = mobileBlockMatch ? mobileBlockMatch[1] : src;
    const stageCellRule = /\.stage-cell\s*\{([^}]*)\}/.exec(styleScope);
    const stageCellBody = stageCellRule ? stageCellRule[1] : "";
    const hasFixed = /position:\s*fixed/.test(stageCellBody);
    const hasInset = /inset:\s*0/.test(stageCellBody);
    if (hasFixed && hasInset) {
        ok("static — the mobile `.stage-cell` is `position: fixed; inset: 0` (the full-bleed fixed stage layer, S1)");
    } else {
        fail(
            "static — the mobile `.stage-cell` must be `position: fixed; inset: 0` " +
                `(found position:fixed=${hasFixed}, inset:0=${hasInset}) inside the ` +
                "`@media (max-width: 1023px)` block — the stage must LEAVE the grid flow " +
                "and become the full-bleed fixed background (S1)",
        );
    }
}

staticHalf();
await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:mobile-single-page — FAIL (${failures.length}): the mobile layout is not ` +
            `the full-bleed-stage + overlay-sheet single-page model (the subject stage is ` +
            `occluded/displaced, a detent went full-height, a dock un-affixed, or the stack ` +
            `survives in source) — H.W7 S1.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:mobile-single-page — PASS: at 390×844 the subject stage is the full-bleed " +
        "background (≥0.45 unoccluded), opening the controls OVERLAYS it (no shift), both docks " +
        "stay affixed, the detents are ≤70dvh (never full-height), and the mobile stack is " +
        "deleted in favour of the fixed stage (H.W7 S1).",
);
