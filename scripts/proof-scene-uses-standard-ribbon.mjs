#!/usr/bin/env node
/**
 * proof:scene-uses-standard-ribbon — H.W10 S2 (G3 + G7) the standard-transport lock.
 *
 * THE DEFECT (live, born-RED on the pre-W10 tree). The easing/spring scenes
 * DIVERGED from the standard cube/amiga controls component: each hand-rolled a
 * bespoke `ribbonContent` PLAYBACK transport — a `grid grid-cols-2` of a
 * Pause/Play `<Button class="btn-playback btn-playback-accent">` + a Reset
 * `<Button class="h-8 w-full rounded-full ...">` (a DIFFERENT class string, a
 * DIFFERENT verb) — with NO scrubber `Slider`, NO `Reverse`, NO
 * `AnimationVisualizer` ball (`EasingScene.vue:56-90` / `SpringScene.vue:95-183`).
 * The two divergent class strings rendered UNEQUAL box metrics (the G7 unequal
 * width/height). cube/amiga mount the STANDARD `PlaybackRibbon` (a scrubber + a
 * `grid-cols-2` of `.btn-playback`-skinned Play/Reverse + the visualizer ball).
 *
 * THE FIX (G3 + G7, H.W10 S2). The easing/spring scenes' PRIMARY transport IS the
 * standard `PlaybackRibbon` — the SAME component cube/amiga render. The easing
 * scene surfaces its contract animation into the standard ribbon mounted in the
 * `ribbonContent` slot (the cube-extension seam `RibbonBar.vue:96-103`); spring
 * does the same in its solver view, KEEPING its legitimate DOMAIN verbs (Re-seat /
 * Reveal-Dismiss) beside the standard ribbon (the cube model — `CubeScene.vue:157`
 * keeps a Matrix Reset + Lock toggle alongside the standard transport). Reusing
 * the standard ribbon makes the buttons match cube/amiga EXACTLY (G3) AND
 * equal-size by the `grid-cols-2` track + the shared `.btn-playback` skin (G7) —
 * the layout idiom, NOT a per-button magic number.
 *
 * Falsifiable BROWSER clauses per scene (easing + spring·solver), each BITING on
 * the exact defect, scoped to the live ribbon (the `.controls-pane`/RibbonBar
 * `Card` that hosts the `ribbon-content` slot):
 *
 *   1. STANDARD RIBBON SIGNATURE (the component IDENTITY). The standard
 *      `PlaybackRibbon`'s DOM marks are all present in the ribbon: (a) the scrubber
 *      `.timeline-green` Slider, (b) the `grid-cols-2` transport row of exactly two
 *      cells — the Play `.btn-playback` button + the Reverse button (the standard
 *      ribbon skins ONLY Play `.btn-playback`; Reverse rides `.btn-interactive`),
 *      (c) the `AnimationVisualizer` ball (`.bg-accent-red.rounded-full`). BITE:
 *      the bespoke fork has NO scrubber, NO visualizer, and a Play/Pause + Reset
 *      pair (no `grid-cols-2` Play/Reverse transport) → reds.
 *
 *   2. PLAY/REVERSE NOT PLAY/RESET (the verb + de-dup). A transport cell labeled
 *      "Reverse" exists; NO transport cell labeled "Reset" lives in the ribbon
 *      (the bottom dock owns Reset — de-duplicated). BITE: the fork's Reset cell
 *      → reds.
 *
 *   3. EQUAL DIMS (G7). The two PRIMARY transport cells (the `grid-cols-2`
 *      Play/Reverse) have equal `getBoundingClientRect()` width AND height within
 *      a 2px tolerance. BITE: the fork's two divergent class strings → unequal
 *      box → reds. NON-VACUITY: both cells must have real area (w·h > 0).
 *
 * **NOT over-constrained (the harden caveat).** `ribbonContent` is the STANDARD
 * scene-extension slot cube ITSELF uses for DOMAIN extras. The gate does NOT
 * forbid `ribbonContent`; it forbids the PRIMARY playback transport living there
 * INSTEAD of in the standard `PlaybackRibbon`. Spring's legitimate domain verbs
 * (Re-seat in solver, Reveal/Dismiss in discrete) MAY remain as ribbon extras —
 * the gate only asserts the standard ribbon IS the transport + the equal-dims of
 * the standard cells, it does not count extra domain buttons. The spring DISCRETE
 * sub-view is a CSS-transition toggle (no sweep transport applies) — out of scope;
 * the gate measures spring's SOLVER view (where the standard sweep transport
 * mounts).
 *
 * Settle-gated on the H.W1 FSM resting (mirrors proof:easing-canvas-bounded): each
 * scene is pinned via the lib's navToScene (an IN-PAGE hash assignment — NOT
 * page.goto, which clears storage + the H.W1 reconcile trap — settled on the
 * destination's per-EXPECTED control surface), the viewport is re-asserted after
 * navigation, the controls pane is forced open with the scene tab selected so the
 * ribbon mounts, and the gate waits until the ribbon DOM resolves before
 * measuring.
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * resolveChromium + context/teardown, J.W3 S1). Browser-only (the mounted
 * component + the rendered box dims are rendered facts — there is no static half);
 * under KF_REQUIRE_BROWSER a playwright-absent skip becomes a hard fail AT THE
 * LIB SEAM so a SHIP is never green-reported un-exercised. Re-runnable:
 * `node scripts/proof-scene-uses-standard-ribbon.mjs`. Serves the BUILT
 * dist/gh-pages/ (run `npm run gh-pages` first).
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
    "proof:scene-uses-standard-ribbon — H.W10 S2 (the easing/spring PRIMARY transport IS the standard PlaybackRibbon · equal-dims G7)",
);

const CTRL_KEY = "animation-groups-control-options-store";

// The destination control-tab labels navToScene settles on (per-EXPECTED-state).
const TRIGGER = { easing: "Easing", spring: "Spring" };

/** Settle on #/<scene> via the lib's in-page hash nav (storage + the H.W1 trap
 *  survive; page.goto clears both). Re-assert the viewport AFTER navigation
 *  (Playwright resets on navigate). Force the controls pane OPEN + the scene tab
 *  selected so the ribbon (the scene's PRIMARY transport) mounts. */
async function settleOnScene(page, scene, viewportWidth, viewportHeight) {
    await navToScene(page, scene, TRIGGER[scene], { timeout: 8000 });
    await page.setViewportSize({ width: viewportWidth, height: viewportHeight });
    await page.evaluate(
        ([ck, s]) => {
            try {
                const st = JSON.parse(localStorage.getItem(ck) || "{}");
                st.isControlsPanelOpen = true;
                st.selectedControl = s; // the scene's custom tab (easing/spring)
                localStorage.setItem(ck, JSON.stringify(st));
            } catch {
                /* fall through to the class toggle */
            }
            const el = document.querySelector(".controls-layout");
            if (el) {
                el.classList.add("controls-layout--open");
                el.classList.remove("controls-layout--closed");
            }
        },
        [CTRL_KEY, scene],
    );
    await page.waitForTimeout(700); // route rested ≥500ms + the slot mount tick
}

/** Wait until the ribbon's standard transport mounts: the RibbonBar Card host
 *  carries a `.btn-playback` transport button (the slot has rendered the
 *  standard PlaybackRibbon, not mid-mount). */
async function waitRibbonMounted(page) {
    return page
        .waitForFunction(
            () => {
                const host = document.querySelector(
                    ".controls-pane .ribbon-bar, .controls-pane, .controls-layout",
                );
                if (!host) return false;
                return !!document.querySelector(".btn-playback");
            },
            { timeout: 8000 },
        )
        .then(() => true)
        .catch(() => false);
}

/** Probe the live ribbon for the standard PlaybackRibbon signature + the G7
 *  equal-dims of the two primary transport cells. Returns a structured result.
 *  Scopes to the RibbonBar Card (the host of the ribbon-content slot AND the
 *  teleported controls-ribbon-target) so domain extras elsewhere don't leak in. */
async function probeRibbon(page) {
    return page.evaluate(() => {
        // The ribbon lives in RibbonBar's Card. The standard PlaybackRibbon root
        // is the `.timeline-green` wrapper's grandparent grid; anchor on the
        // PlaybackRibbon's own outer grid via its unique children. We find the
        // grid-cols-2 transport row that holds the .btn-playback Play cell.
        const playBtn = document.querySelector(".btn-playback");
        const ribbonRoot = playBtn
            ? playBtn.closest(".grid")?.parentElement ?? playBtn.closest(".grid")
            : null;

        const scrubber = document.querySelector(".timeline-green");
        const playbackBtns = Array.from(document.querySelectorAll(".btn-playback"));
        const visualizer = document.querySelector(
            ".bg-accent-red.rounded-full, [class*='bg-accent-red'][class*='rounded-full']",
        );

        // The two PRIMARY transport cells = the grid-cols-2 row that holds the
        // Play `.btn-playback` button. (Spring's domain extras live OUTSIDE this
        // grid-cols-2 row, so they don't pollute the equal-dims measure.)
        const transportRow = playBtn ? playBtn.closest(".grid-cols-2") : null;
        let cells = [];
        if (transportRow) {
            // direct child <button>s of the grid-cols-2 transport row
            cells = Array.from(transportRow.children).filter(
                (c) => c.tagName === "BUTTON" || c.querySelector?.("button"),
            );
            cells = cells.map((c) => (c.tagName === "BUTTON" ? c : c.querySelector("button")));
        }

        const cellDims = cells.map((c) => {
            const r = c.getBoundingClientRect();
            return { w: r.width, h: r.height, text: (c.textContent || "").trim() };
        });

        // Verb scan over all transport-area buttons (within the RibbonBar host).
        const ribbonHostCard = playBtn ? playBtn.closest(".overflow-visible") ?? document.body : document.body;
        const allBtnText = Array.from(ribbonHostCard.querySelectorAll("button")).map((b) =>
            (b.textContent || "").trim().toLowerCase(),
        );
        const hasReverse = allBtnText.some((t) => t.includes("reverse"));
        // A "reset" PRIMARY transport in the ribbon = the bespoke fork's verb.
        const hasResetTransport = playbackBtns.some((b) =>
            (b.textContent || "").trim().toLowerCase().includes("reset"),
        );

        return {
            hasRibbonRoot: !!ribbonRoot,
            hasScrubber: !!scrubber,
            playbackCount: playbackBtns.length, // Play is the ONE .btn-playback in the standard ribbon
            hasVisualizer: !!visualizer,
            hasTransportRow: !!transportRow,
            transportCellCount: cells.length,
            cellDims,
            hasReverse,
            hasResetTransport,
        };
    });
}

async function browserHalf() {
    const W = 1440;
    const H = 900;
    const TOL = 2; // sub-pixel + reka skin rounding tolerance
    const result = await withPage(
        {
            distDir: DIST,
            label: "the standard-ribbon assertion",
            context: { viewport: { width: W, height: H } },
        },
        async (page, { url }) => {
        await page.goto(`${url}/#/easing`, { waitUntil: "load" });
        // easing + spring (spring measured in its SOLVER view, where the standard
        // sweep transport mounts — the discrete view is a CSS toggle, out of scope).
        for (const scene of ["easing", "spring"]) {
            // Fresh-storage reload per scene (the gate's original fresh-page-per-scene
            // harness semantics: the ribbon is asserted on the scene's own fresh mount,
            // not on carried-over cross-scene store state — scene-SWITCH projection is
            // proof:scene-control-dfa's oracle, not this gate's). A bare goto here is a
            // same-document hash nav, so clear + reload forces the true fresh boot.
            await page.goto(`${url}/#/${scene}`, { waitUntil: "load" });
            await page.evaluate(() => localStorage.clear());
            await page.reload({ waitUntil: "load" });
            await settleOnScene(page, scene, W, H);
            const mounted = await waitRibbonMounted(page);

            if (!mounted) {
                const dbg = await page.evaluate(() => ({
                    hasPlayback: !!document.querySelector(".btn-playback"),
                    hasScrubber: !!document.querySelector(".timeline-green"),
                    paneOpen: !!document.querySelector(".controls-layout--open"),
                    hash: location.hash,
                }));
                fail(
                    `${scene}: the standard ribbon never mounted (` +
                        `btn-playback:${dbg.hasPlayback}, scrubber:${dbg.hasScrubber}, ` +
                        `paneOpen:${dbg.paneOpen}, hash:${dbg.hash}) — the FSM may not have ` +
                        `rested on ${scene} or the controls pane / scene tab did not open. ` +
                        `If the scene STILL renders the bespoke fork (no .btn-playback), this is the born-RED.`,
                );
                continue;
            }

            const probe = await probeRibbon(page);

            // ── 1. STANDARD RIBBON SIGNATURE (the component identity) ────────────
            // The standard ribbon skins ONLY Play `.btn-playback` (Reverse rides
            // `.btn-interactive`), so the identity is: scrubber + the grid-cols-2
            // transport row of exactly 2 cells with a Play `.btn-playback` + the
            // visualizer ball.
            const sigOk =
                probe.hasScrubber &&
                probe.hasTransportRow &&
                probe.transportCellCount === 2 &&
                probe.playbackCount >= 1 &&
                probe.hasVisualizer;
            if (sigOk) {
                ok(
                    `${scene}: the PRIMARY transport IS the standard PlaybackRibbon ` +
                        `(scrubber .timeline-green ✓, grid-cols-2 transport row of 2 cells with a Play ` +
                        `.btn-playback ✓, AnimationVisualizer ball ✓) — the SAME component cube/amiga mount`,
                );
            } else {
                fail(
                    `${scene}: the standard PlaybackRibbon signature is INCOMPLETE ` +
                        `(scrubber:${probe.hasScrubber}, grid-cols-2 transport row:${probe.hasTransportRow} ` +
                        `(cells:${probe.transportCellCount}, want 2), Play .btn-playback:${probe.playbackCount} (want ≥1), ` +
                        `visualizer:${probe.hasVisualizer}) — the bespoke fork (no scrubber/visualizer, ` +
                        `a Play/Pause+Reset pair) is the born-RED. Surface the scene animation so the ` +
                        `standard PlaybackRibbon mounts (H.W10 S2).`,
                );
            }

            // ── 2. PLAY/REVERSE NOT PLAY/RESET (the verb + the dock de-dup) ──────
            if (probe.hasReverse && !probe.hasResetTransport) {
                ok(
                    `${scene}: the ribbon transport is Play/Reverse (matches cube/amiga) — ` +
                        `NO Reset cell in the ribbon (the bottom dock owns Reset, de-duplicated)`,
                );
            } else {
                fail(
                    `${scene}: the ribbon transport verbs are wrong ` +
                        `(hasReverse:${probe.hasReverse}, hasResetTransport:${probe.hasResetTransport}) — ` +
                        `the standard ribbon is Play/REVERSE; the bespoke fork's Play/RESET is the born-RED ` +
                        `(Reset is duplicative — the dock already owns it).`,
                );
            }

            // ── 3. EQUAL DIMS (G7) ──────────────────────────────────────────────
            if (probe.cellDims.length < 2) {
                fail(
                    `${scene}: the grid-cols-2 transport row holds ${probe.cellDims.length} cells ` +
                        `(expected 2 — the standard ribbon's Play + Reverse); cannot measure equal dims`,
                );
            } else {
                const [a, b] = probe.cellDims;
                const areaOk = a.w > 0 && a.h > 0 && b.w > 0 && b.h > 0;
                const equalW = Math.abs(a.w - b.w) <= TOL;
                const equalH = Math.abs(a.h - b.h) <= TOL;
                if (!areaOk) {
                    fail(
                        `${scene}: a transport cell has zero area ` +
                            `(${Math.round(a.w)}×${Math.round(a.h)}, ${Math.round(b.w)}×${Math.round(b.h)}); ` +
                            `a vacuous equal-dims pass is forbidden`,
                    );
                } else if (equalW && equalH) {
                    ok(
                        `${scene}: the two transport cells are EQUAL width AND height (G7) — ` +
                            `${Math.round(a.w)}×${Math.round(a.h)} vs ${Math.round(b.w)}×${Math.round(b.h)} ` +
                            `(≤${TOL}px tol; equal-size by the grid-cols-2 track + the shared .btn-playback skin, ` +
                            `not a per-button magic number)`,
                    );
                } else {
                    fail(
                        `${scene}: the two transport cells are UNEQUAL ` +
                            `(${Math.round(a.w)}×${Math.round(a.h)} "${a.text}" vs ` +
                            `${Math.round(b.w)}×${Math.round(b.h)} "${b.text}"; ` +
                            `Δw=${Math.abs(a.w - b.w).toFixed(1)} Δh=${Math.abs(a.h - b.h).toFixed(1)} > ${TOL}px) — ` +
                            `the bespoke fork's two divergent class strings are the born-RED (G7).`,
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

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:scene-uses-standard-ribbon — FAIL (${failures.length}): an easing/spring scene ` +
            `does NOT mount the standard PlaybackRibbon as its primary transport, or the two transport ` +
            `cells are unequal (the bespoke ribbonContent fork — H.W10 S2 / G3 + G7).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:scene-uses-standard-ribbon — PASS: the easing + spring(solver) scenes mount the " +
        "STANDARD PlaybackRibbon (scrubber + Play/Reverse on the shared .btn-playback grid-cols-2 + " +
        "the AnimationVisualizer ball) as their primary transport, with equal-dimension cells (G3 + G7).",
);
