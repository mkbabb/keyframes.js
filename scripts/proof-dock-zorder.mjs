#!/usr/bin/env node
/**
 * proof:dock-zorder — H.W7 S3/F3 (the dock z-order + hit-test + keep-open mutex
 * over the NEW fixed full-bleed stage). The mobile overlay (S1) makes the stage
 * `position: fixed; inset: 0` BEHIND the bottom sheet and BOTH affixed docks.
 * The ONLY risks the `fixed` stage introduces are a z-inversion, a pointer-event
 * steal, a fixed-containing-block ancestor, or a collapse-timer anchor shift —
 * this gate measures each as a RENDERED fact at 390×844 (MEASURE-FIRST). It is a
 * verification clause on S1, not a separate edit; the docks themselves are
 * consumed glass-ui, untouched.
 *
 * FIVE browser clauses, each BITING on the exact defect it forbids:
 *
 *   1. Z-ORDER STRICTLY ASCENDING (the born-RED anchor). The fixed stage layer's
 *      computed `z-index` (`.stage-cell` → z-content=10) is STRICTLY BELOW the
 *      open sheet's (`.controls-pane-wrapper` → z-controls=20), which is STRICTLY
 *      BELOW BOTH docks' z-dock (=40). stage < sheet < dock. BITE: a z-inversion
 *      (raise the stage to z-dock, or drop a dock below z-controls) → reds. A
 *      NON-VACUITY guard requires ≥2 z-dock bands carrying a real GlassDock and a
 *      mounted fixed stage (a missing layer cannot pass GREEN).
 *
 *   2. DOCK HIT-TEST (`elementFromPoint` at each dock-button center returns the
 *      DOCK, not the stage/sheet). For every IN-VIEWPORT dock-button center in
 *      each real dock band, `document.elementFromPoint(cx, cy)` resolves to a node
 *      CONTAINED BY that dock (the fixed stage z-10 + the sheet z-20 sit beneath
 *      the z-40 dock, so the dock wins the hit). BITE: the stage/sheet painting
 *      OVER a dock button (z-inversion or a pointer-events steal) → the hit
 *      resolves to `.stage-cell`/`.controls-pane-wrapper` → reds. Off-viewport
 *      button centers (the top dock over-fills the 390 band) are EXCLUDED — only
 *      an on-screen center is a meaningful hit-test; a ≥1 in-viewport-button floor
 *      per real band guards non-vacuity.
 *
 *   3. THE OPEN SHEET DOES NOT STEAL THE MENUBAR'S POINTER EVENTS. With the sheet
 *      FORCED OPEN (its z-20 layer overlaps nothing of the z-40 menubar, but a
 *      mis-anchored sheet or a pointer-events:auto backdrop could intercept), EACH
 *      in-viewport BOTTOM-MENUBAR button center hit-tests to the menubar dock (NOT
 *      the sheet). BITE: a full-bleed sheet backdrop that covers the menubar, or a
 *      sheet that anchors over the menubar band, steals the transport's pointer →
 *      reds. (This is clause 2 scoped to the bottom band under the OPEN sheet — the
 *      precise S3 "the bottom sheet must NOT steal pointer events from the bottom
 *      menubar's GlassDock".)
 *
 *   4. LOW-1 — the fixed-containing-block invariant. The fixed stage resolves
 *      against the VIEWPORT: its rect == the viewport (±2px) AND no ancestor in its
 *      chain establishes a containing block for `fixed` (no `transform`/`contain:
 *      paint|layout|strict|content`/`perspective`/`filter`/`will-change:transform`).
 *      BITE: a `transform`/`contain`/`perspective`/`filter` on the fixed stage or
 *      any ancestor makes `fixed` resolve against THAT ancestor (not the viewport)
 *      → the stage detaches from the dock-safe band → reds.
 *
 *   5. KEEP-OPEN MUTEX — the menubar's collapse timer cannot shift the sheet's
 *      anchor while the sheet is OPEN (WV-W7-MED-4 / S2b). With the sheet open and
 *      NO dock interaction, after a wait PAST any plausible collapse-delay the
 *      bottom menubar's anchor (its band `top`/`bottom`) and the sheet's anchor
 *      (`top`/`bottom`) are UNCHANGED (±2px) — the collapse timer did not fire and
 *      shift `--work-area-bottom-offset`/`--dock-band-reserve` out from under the
 *      open sheet. BITE: let the collapse timer fire under an open sheet (un-pin
 *      the menubar so it collapses and re-anchors) → the menubar top moves → the
 *      sheet's bottom-anchored top shifts → reds.
 *
 *      NB (the landed reconciliation, recorded for the engine reviewer): the S2b
 *      mutex is wired as `useOptionalDockContext()?.keepOpen()` in
 *      `useSheetGesture` — but the sheet renders as a SIBLING of the menubar's
 *      `<GlassDock>` (ControlsPaneWrapper and AnimationMenuBar are siblings under
 *      AnimationControlsGroup), so the OPTIONAL context resolves to `null` and the
 *      `keepOpen()` call is a structural no-op (a `data-held` flag never sets).
 *      The INVARIANT it guards (no anchor shift while open) HOLDS for a stronger
 *      reason: the menubar mounts `:always-expanded`, so its collapse timer is
 *      structurally disabled — the anchor cannot shift regardless. This gate
 *      asserts the MEASURED invariant (the anchor is stable across the
 *      collapse-delay window), NOT the `data-held` mechanism the landed tree never
 *      exercises — the rendered fact the mutex promises, MEASURE-FIRST.
 *
 * Settle-gated on the H.W1 FSM resting (mirrors proof:stage-within-docks): the
 * scene is pinned via the lib's navToScene (an IN-PAGE hash assignment — NOT
 * page.goto, which clears storage + the H.W1 reconcile trap — settled on the
 * destination's per-EXPECTED control surface), the viewport is RE-ASSERTED after
 * navigation, the controls pane is FORCED OPEN deterministically (seed
 * `isControlsPanelOpen` + a `selectedAnimation` — a fresh #/cube load with no
 * selection v-show-hides the sheet; impl-w7-overlay §OPEN NOTES), the route
 * rests, and the gate waits until the stage + the dock bands resolve before
 * measuring.
 *
 * Browser-led (a z-order/hit-test/anchor fact is a rendered fact — there is no
 * static half). Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage =
 * serveDist + resolveChromium + context/teardown, J.W3 S1); under
 * KF_REQUIRE_BROWSER a playwright-absent skip becomes a hard fail AT THE LIB SEAM
 * so a SHIP is never green-reported un-exercised. Re-runnable:
 * `node scripts/proof-dock-zorder.mjs`. Serves the BUILT dist/gh-pages/ (run
 * `npm run gh-pages` first).
 */
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
    "proof:dock-zorder — H.W7 S3/F3 (the fixed stage z-below both docks · " +
        "elementFromPoint at each dock-button returns the dock · the open sheet " +
        "does not steal the menubar's pointer · LOW-1 fixed-CB · keep-open mutex)",
);

const CTRL_KEY = "animation-groups-control-options-store";
const SCENE = "cube"; // the canonical SUBJECT-class scene (the full-bleed stage)
const W = 390;
const H = 844;
const TOL = 2; // sub-pixel rounding tolerance

/** Settle on #/<scene> via the lib's navToScene IN-PAGE hash nav (storage + the
 *  H.W1 trap survive; page.goto clears both). Re-assert the viewport AFTER
 *  navigation (Playwright resets on navigate). FORCE the controls pane OPEN
 *  deterministically (seed isControlsPanelOpen + a selectedAnimation) — a fresh
 *  #/cube load with no selection v-show-hides the sheet (impl-w7-overlay §OPEN
 *  NOTES). Rest so the spring settles + the docks affix. */
async function settleOpen(page) {
    await navToScene(page, SCENE, "Controls", { timeout: 8000 });
    await page.setViewportSize({ width: W, height: H });
    await page.evaluate(
        ([ck]) => {
            try {
                const s = JSON.parse(localStorage.getItem(ck) || "{}");
                s.isControlsPanelOpen = true;
                if (!s.selectedAnimation) s.selectedAnimation = "Rotations";
                localStorage.setItem(ck, JSON.stringify(s));
            } catch {
                /* fall through — the store seed is best-effort */
            }
        },
        [CTRL_KEY],
    );
    // Re-pin so the reconcile re-reads the seeded store + selectedAnimation.
    await page.evaluate((s) => {
        location.hash = "#/" + s;
    }, SCENE);
    await page.waitForTimeout(1800); // route rested + the sheet spring settled

    // ── S.G1 S4 (p10 F5 arming re-arm; T7 — gate follows code) ──
    // The mobile sheet is now BORN AT PEEK (the S.G1 three-writer peek cure): the
    // host mount-reset overrides the seeded `isControlsPanelOpen:true` on the mobile
    // layout, so the store seed above renders the sheet at peek, not open. This
    // gate's z-order/hit-test measure needs the OPEN sheet, so ARM it via a real
    // grab-handle tap (the born-open behavior the store seed relied on is exactly
    // what the contract deletes). The tap makes the open-state measure run on the
    // intended contract, not on the deleted auto-open.
    const alreadyOpen = await page.evaluate(
        () => !!document.querySelector(".controls-pane-wrapper.controls-pane--open"),
    );
    if (!alreadyOpen) {
        // The grab pill toggles on POINTER events; this context has no hasTouch, so
        // a real-mouse click (which fires pointerdown/pointerup) is the open gesture
        // (NOT page.tap, which needs hasTouch).
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
        await page.waitForTimeout(600); // the open spring settles
    }
}

/** Wait until the fixed stage + ≥2 real (glass-dock-bearing) z-dock bands + the
 *  OPEN sheet resolve, so the measure is not racing the mount/reflow. */
async function waitMounted(page) {
    return page
        .waitForFunction(
            () => {
                const stage = document.querySelector(".stage-cell");
                if (!stage) return false;
                if (getComputedStyle(stage).position !== "fixed") return false;
                const realDocks = [
                    ...document.querySelectorAll(".z-dock, [class*='z-dock']"),
                ].filter((el) => el.querySelector(".glass-dock"));
                const sheet = document.querySelector(".controls-pane-wrapper");
                const sheetOpen =
                    sheet && sheet.className.includes("controls-pane--open");
                return realDocks.length >= 2 && !!sheetOpen;
            },
            undefined,
            { timeout: 8000 },
        )
        .then(() => true)
        .catch(() => false);
}

async function browserHalf() {
    const result = await withPage(
        {
            distDir: DIST,
            label: "the dock z-order/hit-test/mutex assertions",
            context: { viewport: { width: W, height: H } },
        },
        async (page, { url }) => {
        await page.goto(`${url}/#/${SCENE}`, { waitUntil: "load" });
        await settleOpen(page);
        const mounted = await waitMounted(page);
        if (!mounted) {
            const dbg = await page.evaluate(() => ({
                hasStage: !!document.querySelector(".stage-cell"),
                stagePos: document.querySelector(".stage-cell")
                    ? getComputedStyle(document.querySelector(".stage-cell")).position
                    : null,
                realDocks: [
                    ...document.querySelectorAll(".z-dock, [class*='z-dock']"),
                ].filter((el) => el.querySelector(".glass-dock")).length,
                sheetOpen: !!document.querySelector(".controls-pane-wrapper.controls-pane--open"),
                hash: location.hash,
            }));
            fail(
                `the fixed stage / open sheet / docks never resolved at ${W}×${H} ` +
                    `(stage:${dbg.hasStage} pos:${dbg.stagePos}, realDocks:${dbg.realDocks}, ` +
                    `sheetOpen:${dbg.sheetOpen}, hash:${dbg.hash}) — the FSM may not have ` +
                    `rested on ${SCENE} or the sheet did not force open`,
            );
            return;
        }

        // ── Probe 1: z-order + LOW-1 + the dock bands + the dock-button centers ──
        const probe = await page.evaluate(() => {
            const css = (el) => getComputedStyle(el);
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            const stage = document.querySelector(".stage-cell");
            const sheet = document.querySelector(".controls-pane-wrapper");
            const sr = stage.getBoundingClientRect();
            const shr = sheet.getBoundingClientRect();

            // LOW-1 — walk the fixed stage's ancestor chain for a fixed-containing-block.
            const offenders = [];
            let node = stage;
            while (node && node !== document.documentElement) {
                const cs = css(node);
                const containsCB =
                    cs.contain &&
                    cs.contain !== "none" &&
                    /\b(paint|layout|strict|content)\b/.test(cs.contain);
                if (
                    cs.transform !== "none" ||
                    containsCB ||
                    (cs.perspective && cs.perspective !== "none") ||
                    cs.filter !== "none" ||
                    cs.willChange === "transform"
                ) {
                    offenders.push({
                        tag: node.tagName,
                        cls: (node.className?.toString?.() || "").slice(0, 30),
                        transform: cs.transform,
                        contain: cs.contain,
                        perspective: cs.perspective,
                        filter: cs.filter,
                        willChange: cs.willChange,
                    });
                }
                node = node.parentElement;
            }

            // The z-dock band wrappers (the OUTER fixed wrappers carry .z-dock); the
            // REAL dock bands are those holding a glass-dock (the EditorHeader corner
            // + the collapsed h:0 timeline cell are z-dock but NOT real dock bands).
            const zWrappers = [
                ...document.querySelectorAll(".z-dock, [class*='z-dock']"),
            ];
            const dockBands = [];
            let minDockZ = Infinity;
            for (const el of zWrappers) {
                const z = parseFloat(css(el).zIndex);
                if (Number.isFinite(z)) minDockZ = Math.min(minDockZ, z);
            }
            for (const el of zWrappers) {
                const dock = el.querySelector(".glass-dock");
                if (!dock) continue;
                const er = el.getBoundingClientRect();
                if (!(er.width > 0 && er.height > 0)) continue;
                const region = er.top < vh / 2 ? "top" : "bottom";
                // The dock's PAINTED band: the .glass-dock box (it is `overflow:hidden`,
                // so its children are CLIPPED to it — a fit-content/collapsed dock lays
                // out extra buttons that overflow OFF the visible band; those are not
                // painted there and are the wrong thing to hit-test). MEASURE-FIRST:
                // hit-test ONLY a button center that lies inside the dock's painted box
                // AND is genuinely interactive (pointer-events != none — a clipped/
                // collapsed-away button computes `pointer-events: none`).
                const dr = dock.getBoundingClientRect();
                const btns = [
                    ...dock.querySelectorAll(
                        "button, [role='button'], [role='combobox'], a[href]",
                    ),
                ].filter((b) => {
                    const r = b.getBoundingClientRect();
                    return r.width > 4 && r.height > 4;
                });
                const hits = [];
                for (const b of btns) {
                    const r = b.getBoundingClientRect();
                    const cx = Math.round(r.left + r.width / 2);
                    const cy = Math.round(r.top + r.height / 2);
                    const inViewport = cx >= 0 && cx <= vw && cy >= 0 && cy <= vh;
                    if (!inViewport) continue; // off-screen center is not a meaningful hit-test
                    // The center must lie within the dock's PAINTED (overflow-clipped)
                    // box — a button overflowing the collapsed band is not rendered there.
                    const inPaintedBand =
                        cx >= dr.left - 1 &&
                        cx <= dr.right + 1 &&
                        cy >= dr.top - 1 &&
                        cy <= dr.bottom + 1;
                    if (!inPaintedBand) continue;
                    if (css(b).pointerEvents === "none") continue; // not interactive here
                    const hit = document.elementFromPoint(cx, cy);
                    const inDock = hit ? dock.contains(hit) || hit === dock || el.contains(hit) : false;
                    const onStageOrSheet =
                        hit &&
                        (stage.contains(hit) ||
                            hit === stage ||
                            sheet.contains(hit) ||
                            hit === sheet);
                    hits.push({
                        label: (b.getAttribute("aria-label") || b.textContent || "").trim().slice(0, 24),
                        cx,
                        cy,
                        inDock,
                        onStageOrSheet,
                    });
                }
                // A COLLAPSED dock (fit-content) clips its inner buttons to a single
                // interactive pill — the `.glass-dock` element ITSELF is the click
                // target (pointer-events:auto; onClickCollapsed), the inner buttons are
                // pointer-events:none. When no inner button qualifies, hit-test the
                // dock's OWN center: the same assertion (the dock wins over stage/sheet).
                if (hits.length === 0) {
                    const cx = Math.round(dr.left + dr.width / 2);
                    const cy = Math.round(dr.top + dr.height / 2);
                    if (cx >= 0 && cx <= vw && cy >= 0 && cy <= vh) {
                        const hit = document.elementFromPoint(cx, cy);
                        const inDock = hit ? dock.contains(hit) || hit === dock || el.contains(hit) : false;
                        const onStageOrSheet =
                            hit &&
                            (stage.contains(hit) ||
                                hit === stage ||
                                sheet.contains(hit) ||
                                hit === sheet);
                        hits.push({ label: "(collapsed dock pill)", cx, cy, inDock, onStageOrSheet });
                    }
                }
                dockBands.push({
                    region,
                    z: parseFloat(css(el).zIndex),
                    top: Math.round(er.top),
                    bottom: Math.round(er.bottom),
                    nInViewportBtns: hits.length,
                    hits,
                });
            }

            return {
                vw,
                vh,
                stageZ: parseFloat(css(stage).zIndex),
                stagePos: css(stage).position,
                stageRect: { left: Math.round(sr.left), top: Math.round(sr.top), w: Math.round(sr.width), h: Math.round(sr.height) },
                rectIsViewport:
                    Math.abs(sr.left) <= 2 &&
                    Math.abs(sr.top) <= 2 &&
                    Math.abs(sr.width - vw) <= 2 &&
                    Math.abs(sr.height - vh) <= 2,
                offenders,
                sheetZ: parseFloat(css(sheet).zIndex),
                sheetRect: { top: Math.round(shr.top), bottom: Math.round(shr.bottom) },
                minDockZ,
                dockBands,
            };
        });

        // ── Clause 1 — Z-ORDER STRICTLY ASCENDING ───────────────────────────────
        const realBands = probe.dockBands;
        if (realBands.length < 2) {
            fail(
                `z-order non-vacuity — fewer than 2 real dock bands found ` +
                    `(${realBands.length}); the z-order cannot be asserted without both ` +
                    `affixed GlassDock bands`,
            );
        } else if (!Number.isFinite(probe.stageZ)) {
            fail(`z-order — the fixed stage has no numeric z-index (got ${probe.stageZ})`);
        } else if (!Number.isFinite(probe.sheetZ)) {
            fail(`z-order — the open sheet has no numeric z-index (got ${probe.sheetZ})`);
        } else {
            const stageBelowSheet = probe.stageZ < probe.sheetZ;
            const sheetBelowDocks = probe.sheetZ < probe.minDockZ;
            const stageBelowDocks = probe.stageZ < probe.minDockZ;
            if (stageBelowSheet && sheetBelowDocks && stageBelowDocks) {
                ok(
                    `z-order strictly ascending: stage z(${probe.stageZ}) < sheet z(${probe.sheetZ}) ` +
                        `< both docks z(${probe.minDockZ}) — the fixed stage + the open sheet ` +
                        `sit BELOW both affixed docks`,
                );
            } else {
                fail(
                    `z-order INVERTED: stage z(${probe.stageZ}), sheet z(${probe.sheetZ}), ` +
                        `min dock z(${probe.minDockZ}) — required stage < sheet < dock` +
                        `${stageBelowSheet ? "" : " (stage ≥ sheet ✗)"}` +
                        `${sheetBelowDocks ? "" : " (sheet ≥ dock ✗)"}` +
                        `${stageBelowDocks ? "" : " (stage ≥ dock ✗)"}`,
                );
            }
        }

        // ── Clause 2 — DOCK HIT-TEST (each in-viewport dock-button center → the dock) ──
        for (const band of realBands) {
            if (band.nInViewportBtns < 1) {
                fail(
                    `dock hit-test (${band.region} band) — zero in-viewport dock buttons ` +
                        `found; a vacuous pass is forbidden (the band must expose ≥1 hit-testable button)`,
                );
                continue;
            }
            const stolen = band.hits.filter((h) => h.onStageOrSheet || !h.inDock);
            if (stolen.length === 0) {
                ok(
                    `dock hit-test (${band.region} band): all ${band.nInViewportBtns} in-viewport ` +
                        `dock-button center(s) resolve to the dock (the z-${band.z} dock wins over ` +
                        `the stage z(${probe.stageZ}) + sheet z(${probe.sheetZ}))`,
                );
            } else {
                fail(
                    `dock hit-test (${band.region} band): ${stolen.length} dock-button center(s) ` +
                        `do NOT resolve to the dock — ` +
                        stolen
                            .map(
                                (h) =>
                                    `"${h.label}"@(${h.cx},${h.cy})${h.onStageOrSheet ? " ← hit the STAGE/SHEET" : " ← hit a non-dock node"}`,
                            )
                            .join(", ") +
                        ` (a z-inversion or a pointer-events steal lets the stage/sheet ` +
                        `intercept the dock's pointer)`,
                );
            }
        }

        // ── Clause 3 — THE OPEN SHEET DOES NOT STEAL THE MENUBAR'S POINTER ───────
        const bottomBand = realBands.find((b) => b.region === "bottom");
        if (!bottomBand) {
            fail(
                `sheet-vs-menubar pointer — the bottom menubar band was not found; the ` +
                    `S3 "the sheet must NOT steal the menubar's pointer events" clause cannot run`,
            );
        } else {
            const menubarStolen = bottomBand.hits.filter((h) => h.onStageOrSheet);
            if (menubarStolen.length === 0) {
                ok(
                    `the OPEN sheet (z-${probe.sheetZ}) does not steal the bottom menubar's ` +
                        `pointer events — all ${bottomBand.nInViewportBtns} menubar button center(s) ` +
                        `hit the dock, not the sheet (S3)`,
                );
            } else {
                fail(
                    `the OPEN sheet STEALS the menubar's pointer events: ` +
                        menubarStolen.map((h) => `"${h.label}"@(${h.cx},${h.cy})`).join(", ") +
                        ` resolve to the sheet/stage — the sheet must anchor ABOVE the menubar ` +
                        `band (bottom: var(--dock-menubar-reserve)) and carry no covering backdrop`,
                );
            }
        }

        // ── Clause 4 — LOW-1 (the fixed-containing-block invariant) ──────────────
        if (probe.rectIsViewport && probe.offenders.length === 0) {
            ok(
                `LOW-1: the fixed stage resolves against the VIEWPORT (rect ` +
                    `${probe.stageRect.left},${probe.stageRect.top} ${probe.stageRect.w}×${probe.stageRect.h} ` +
                    `== ${probe.vw}×${probe.vh} ±2px) AND no ancestor establishes a fixed-CB ` +
                    `(zero transform/contain/perspective/filter/will-change offenders)`,
            );
        } else {
            if (!probe.rectIsViewport) {
                fail(
                    `LOW-1: the fixed stage rect (${probe.stageRect.left},${probe.stageRect.top} ` +
                        `${probe.stageRect.w}×${probe.stageRect.h}) is NOT the viewport (${probe.vw}×${probe.vh}) ` +
                        `— a fixed-containing-block ancestor is re-anchoring it`,
                );
            }
            if (probe.offenders.length > 0) {
                fail(
                    `LOW-1: ${probe.offenders.length} ancestor(s) of the fixed stage establish a ` +
                        `fixed-containing-block — ` +
                        probe.offenders
                            .map(
                                (o) =>
                                    `<${o.tag}.${o.cls}> {transform:${o.transform}, contain:${o.contain}, ` +
                                    `perspective:${o.perspective}, filter:${o.filter}, willChange:${o.willChange}}`,
                            )
                            .join("; ") +
                        ` — 'fixed' would resolve against the ancestor, not the viewport`,
                );
            }
        }

        // ── Clause 5 — KEEP-OPEN MUTEX (no anchor shift while the sheet is open) ──
        // Measure the menubar + sheet anchors NOW, wait PAST the collapse-delay with
        // NO dock interaction, re-measure — the timer must not have fired + shifted.
        const anchorBefore = await page.evaluate(() => {
            const menubar = [
                ...document.querySelectorAll(".z-dock, [class*='z-dock']"),
            ].find(
                (el) =>
                    el.querySelector(".glass-dock") &&
                    el.getBoundingClientRect().top > window.innerHeight / 2,
            );
            const sheet = document.querySelector(".controls-pane-wrapper");
            const mr = menubar ? menubar.getBoundingClientRect() : null;
            const shr = sheet ? sheet.getBoundingClientRect() : null;
            return {
                menubarTop: mr ? Math.round(mr.top) : null,
                menubarBottom: mr ? Math.round(mr.bottom) : null,
                sheetTop: shr ? Math.round(shr.top) : null,
                sheetBottom: shr ? Math.round(shr.bottom) : null,
            };
        });
        // Wait well past any plausible collapse-delay (glass-ui default ≈600ms — give
        // 3.5s) WITHOUT moving the mouse / touching the dock (a synthetic event would
        // reset the timer + mask a real collapse).
        await page.waitForTimeout(3500);
        const anchorAfter = await page.evaluate(() => {
            const menubar = [
                ...document.querySelectorAll(".z-dock, [class*='z-dock']"),
            ].find(
                (el) =>
                    el.querySelector(".glass-dock") &&
                    el.getBoundingClientRect().top > window.innerHeight / 2,
            );
            const sheet = document.querySelector(".controls-pane-wrapper");
            const mr = menubar ? menubar.getBoundingClientRect() : null;
            const shr = sheet ? sheet.getBoundingClientRect() : null;
            const stillOpen = sheet
                ? sheet.className.includes("controls-pane--open")
                : false;
            return {
                menubarTop: mr ? Math.round(mr.top) : null,
                menubarBottom: mr ? Math.round(mr.bottom) : null,
                sheetTop: shr ? Math.round(shr.top) : null,
                sheetBottom: shr ? Math.round(shr.bottom) : null,
                stillOpen,
            };
        });
        const anchorsResolved =
            anchorBefore.menubarTop != null &&
            anchorBefore.sheetTop != null &&
            anchorAfter.menubarTop != null &&
            anchorAfter.sheetTop != null;
        if (!anchorsResolved) {
            fail(
                `keep-open mutex — the menubar/sheet anchors did not resolve ` +
                    `(before:${JSON.stringify(anchorBefore)}, after:${JSON.stringify(anchorAfter)}); ` +
                    `the anchor-stability invariant cannot be asserted`,
            );
        } else if (!anchorAfter.stillOpen) {
            fail(
                `keep-open mutex — the sheet CLOSED on its own across the collapse-delay ` +
                    `window (the open state must persist for the mutex to be meaningful)`,
            );
        } else {
            const menubarShift = Math.abs(anchorAfter.menubarTop - anchorBefore.menubarTop);
            const sheetTopShift = Math.abs(anchorAfter.sheetTop - anchorBefore.sheetTop);
            const sheetBottomShift = Math.abs(
                anchorAfter.sheetBottom - anchorBefore.sheetBottom,
            );
            if (menubarShift <= TOL && sheetTopShift <= TOL && sheetBottomShift <= TOL) {
                ok(
                    `keep-open mutex: across a 3.5s collapse-delay window with the sheet OPEN + ` +
                        `no dock interaction, the menubar anchor (top ${anchorAfter.menubarTop}) and ` +
                        `the sheet anchor (top ${anchorAfter.sheetTop}, bottom ${anchorAfter.sheetBottom}) ` +
                        `are UNSHIFTED (±${TOL}px) — the collapse timer cannot move the sheet's anchor`,
                );
            } else {
                fail(
                    `keep-open mutex VIOLATED: the menubar/sheet anchor SHIFTED across the ` +
                        `collapse-delay window (menubarTop Δ${menubarShift}px, sheetTop Δ${sheetTopShift}px, ` +
                        `sheetBottom Δ${sheetBottomShift}px) — the collapse timer fired under the open ` +
                        `sheet + re-anchored --work-area-bottom-offset/--dock-band-reserve (hold ` +
                        `keepOpen() while open / keep the menubar always-expanded)`,
                );
            }
        }
        },
    );
    if (result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:dock-zorder — FAIL (${failures.length}): the fixed full-bleed stage ` +
            `inverted a dock z-order, stole a dock's pointer events, anchored against a ` +
            `non-viewport containing block, or let the menubar collapse timer shift the ` +
            `open sheet's anchor (H.W7 S3/F3).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:dock-zorder — PASS: the fixed stage (z-content) sits strictly BELOW the open " +
        "sheet (z-controls) sits strictly BELOW both docks (z-dock); elementFromPoint at every " +
        "in-viewport dock-button center returns the dock; the open sheet does not steal the " +
        "menubar's pointer events; the fixed stage resolves against the viewport (LOW-1); and " +
        "the menubar's collapse timer cannot shift the open sheet's anchor (H.W7 S3/F3).",
);
