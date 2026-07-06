#!/usr/bin/env node
/**
 * proof:easing-stage-is-ball — H.W10 G4 (the easing `singular` stage = ONE large
 * engine-driven ball, NOT a second copy of the curve editor).
 *
 * The defect (live, pre-W10, #/easing singular): W5.S4 PROMOTED the editable curve
 * to the stage — a SECOND `EasingCurveCanvas` (the `:bezier-points`/
 * `@update:bezierPoints` two-way wire, EasingTarget.vue:47-59) sat on the stage
 * DUPLICATING the editable curve already in the sidebar. The W5-era audit
 * (a-scene-square-easing.md:236-252) had prescribed option-b — "a real animated
 * subject (a box eased by the selected curve — dogfooding)" — but W5 chose the
 * curve-promote instead; the user re-raised it (G4).
 *
 * The fix (G4/S3): the duplicate stage canvas is DELETED; the `singular` stage is
 * ONE large engine-driven hero ball whose x = `currentEasingFn(progress) * maxX`
 * — the SELECTED easing applied to the engine's progress sweep (the curve in
 * MOTION; the inv ζ dogfood: the ball's position IS the timing function applied to
 * the engine's progress). The editable curve lives in the SIDEBAR ONLY.
 *
 * Three BROWSER clauses, each BITING on the exact defect:
 *
 *   1. THE STAGE IS A BALL, NOT A SECOND CANVAS (born-RED anchor). In the easing
 *      singular stage (`.stage-cell`), the primary subject is a `.progress-ball`/
 *      `.hero-ball` (an AnimationVisualizer-class ball) AND there is ZERO
 *      `EasingCurveCanvas`/`canvas` in the `.stage-cell` subtree. BITE: RED on the
 *      W5 tree (a second EasingCurveCanvas `<svg>`/`<canvas>` in the stage); GREEN
 *      only once the duplicate stage canvas is DELETED and the ball renders. A
 *      `display:none` suppression cannot pass — the assertion is the ABSENCE of the
 *      canvas ELEMENT from the stage subtree (the subtree is deleted, not hidden).
 *
 *   2. THE BALL TRAVERSES UNDER THE SELECTED EASING (born-RED anchor, non-vacuity).
 *      The hero ball's x-position TRACKS `fn(progress)` over time: sampled across
 *      two frames of the running engine sweep, the ball's getBoundingClientRect()
 *      .left CHANGES (the curve in motion). BITE: a static decorative ball (no
 *      engine sweep) → x does not change → reds. This guards the "real animated
 *      subject" intent — a frozen ball cannot stand in for the dogfood.
 *
 *   3. THE EDITABLE CURVE LIVES IN THE SIDEBAR (the de-duplication is real, not a
 *      loss). With the controls pane open on the easing tab, EXACTLY the SIDEBAR
 *      hosts an editable `.easing-curve-canvas` — it exists (the editor is not
 *      gone) and it is OUTSIDE the `.stage-cell` (it moved to the sidebar, it was
 *      not deleted wholesale). BITE: delete the sidebar canvas too → the editable
 *      curve has no home → reds (the curve must have ONE home, the sidebar).
 *
 * Settle-gated on the H.W1 FSM resting (mirrors proof:easing-canvas-bounded): the
 * #/easing route is pinned via the lib's navToScene (an IN-PAGE hash assignment —
 * NOT page.goto — goto clears storage + the H.W1 reconcile trap — settled on the
 * destination's per-EXPECTED control surface), the viewport is RE-ASSERTED after
 * navigation, the controls pane + easing tab are opened so the sidebar editor
 * mounts, the route rests ≥500ms, and the gate waits until the stage hero ball
 * resolves before measuring.
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * resolveChromium + context/teardown, J.W3 S1) + navToScene. Browser-only (the
 * stage subject + its motion are rendered facts — there is no static half); under
 * KF_REQUIRE_BROWSER a playwright-absent skip becomes a hard fail AT THE LIB SEAM
 * so a SHIP is never green-reported un-exercised.
 * Re-runnable: `node scripts/proof-easing-stage-is-ball.mjs`. Serves the BUILT
 * dist/gh-pages/ (run `npm run gh-pages` first).
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, pressPlayToggle, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log("proof:easing-stage-is-ball — H.W10 G4 (the singular stage = ONE engine-driven ball, not a duplicate curve)");

const CTRL_KEY = "animation-groups-control-options-store";

/** Settle on #/easing via the lib's in-page hash nav (storage + the H.W1 trap
 *  survive; page.goto clears both). Re-assert the viewport AFTER navigation. Open
 *  the controls pane + the easing tab so the SIDEBAR editor mounts (clause 3); the
 *  singular stage is the default view. Rest ≥500ms. */
async function settleOnEasing(page, viewportWidth, viewportHeight) {
    await navToScene(page, "easing", /*T.B2-derived: Controls projects*/ null, { timeout: 8000 });
    // T.G3 RE-ARM: the scene RESTS on entry (autoPlays:false, true rest) — the
    // traverse clause needs an HONEST PRESS to put the curve in motion.
    await pressPlayToggle(page, { intent: "play" });
    await page.waitForTimeout(600);
    await page.setViewportSize({ width: viewportWidth, height: viewportHeight });
    await page.evaluate((ck) => {
        try {
            const s = JSON.parse(localStorage.getItem(ck) || "{}");
            s.isControlsPanelOpen = true;
            s.selectedControl = "easing";
            localStorage.setItem(ck, JSON.stringify(s));
        } catch {
            /* fall through to the class toggle */
        }
        const el = document.querySelector(".controls-layout");
        if (el) {
            el.classList.add("controls-layout--open");
            el.classList.remove("controls-layout--closed");
        }
    }, CTRL_KEY);
    await page.waitForTimeout(700); // route rested ≥500ms + the grid reflow
}

/** Wait until the singular stage hero ball resolves (the stage is in its ball
 *  form, not mid-mount). */
async function waitHeroBall(page) {
    return page
        .waitForFunction(
            () => {
                const cell = document.querySelector(".stage-cell");
                if (!cell) return false;
                const ball = cell.querySelector(".hero-ball, .progress-ball");
                if (!ball) return false;
                const r = ball.getBoundingClientRect();
                return r.width > 0 && r.height > 0;
            },
            { timeout: 8000 },
        )
        .then(() => true)
        .catch(() => false);
}

async function browserHalf() {
    const VW = 1440;
    const VH = 900;
    const result = await withPage(
        {
            distDir: DIST,
            label: "the stage-is-a-ball assertion",
            context: { viewport: { width: VW, height: VH } },
        },
        async (page, { url }) => {
        await page.goto(`${url}/#/easing`, { waitUntil: "load" });
        await settleOnEasing(page, VW, VH);
        const mounted = await waitHeroBall(page);

        if (!mounted) {
            const dbg = await page.evaluate(() => ({
                hasCell: !!document.querySelector(".stage-cell"),
                hasBall: !!document.querySelector(".stage-cell .hero-ball, .stage-cell .progress-ball"),
                paneOpen: !!document.querySelector(".controls-layout--open"),
                hash: location.hash,
            }));
            fail(
                `the singular stage hero ball never mounted (cell:${dbg.hasCell}, ` +
                    `ball:${dbg.hasBall}, paneOpen:${dbg.paneOpen}, hash:${dbg.hash}) — ` +
                    `the FSM may not have rested on easing or the singular view is not active`,
            );
        } else {
            const probe = await page.evaluate(() => {
                const cell = document.querySelector(".stage-cell");
                const ball = cell.querySelector(".hero-ball, .progress-ball");
                // canvas-class instances in the STAGE subtree (the duplicate to kill)
                const stageCanvases = cell.querySelectorAll(
                    "canvas, .easing-curve-canvas, .easing-curve-canvas-wrapper",
                ).length;
                // the editable curve in the SIDEBAR (outside the stage cell)
                const allEditCanvases = [...document.querySelectorAll(".easing-curve-canvas")];
                const sidebarEditCanvases = allEditCanvases.filter(
                    (c) => !cell.contains(c),
                ).length;
                const br = ball.getBoundingClientRect();
                return {
                    ballCls: ball.className,
                    ballLeft: br.left,
                    stageCanvases,
                    sidebarEditCanvases,
                    totalEditCanvases: allEditCanvases.length,
                };
            });

            // ── 1. THE STAGE IS A BALL, NOT A SECOND CANVAS (born-RED anchor) ──
            if (probe.stageCanvases === 0) {
                ok(
                    `stage is a ball: the singular stage subject is a ` +
                        `'${probe.ballCls.split(/\s+/).filter((c) => /ball/.test(c)).join(" ")}' ` +
                        `and ZERO canvas/EasingCurveCanvas live in the .stage-cell subtree ` +
                        `(the W5 duplicate curve is DELETED, not hidden)`,
                );
            } else {
                fail(
                    `stage is a ball — ${probe.stageCanvases} canvas/EasingCurveCanvas element(s) ` +
                        `remain in the .stage-cell subtree; the duplicate stage curve must be DELETED ` +
                        `(born-RED: the W5 second EasingCurveCanvas at EasingTarget.vue:47-59)`,
                );
            }

            // ── 2. THE BALL TRAVERSES UNDER THE SELECTED EASING (non-vacuity) ──
            const left1 = probe.ballLeft;
            await page.waitForTimeout(350);
            const left2 = await page.evaluate(() => {
                const cell = document.querySelector(".stage-cell");
                const ball = cell.querySelector(".hero-ball, .progress-ball");
                return ball ? ball.getBoundingClientRect().left : null;
            });
            if (left2 !== null && Math.abs(left2 - left1) > 0.5) {
                ok(
                    `ball traverses: the hero ball x-position tracks fn(progress) over the engine ` +
                        `sweep (left ${Math.round(left1)} → ${Math.round(left2)}px across two frames — ` +
                        `the curve in MOTION, the inv ζ dogfood)`,
                );
            } else {
                fail(
                    `ball traverses — the hero ball x-position did NOT change across two frames ` +
                        `(left ${Math.round(left1)} → ${left2 === null ? "n/a" : Math.round(left2)}px); a ` +
                        `static decorative ball cannot stand in for the engine-driven dogfood`,
                );
            }

            // ── 3. THE EDITABLE CURVE LIVES IN THE SIDEBAR ──
            if (probe.sidebarEditCanvases >= 1 && probe.stageCanvases === 0) {
                ok(
                    `editable curve home: exactly the SIDEBAR hosts the editable .easing-curve-canvas ` +
                        `(${probe.sidebarEditCanvases} outside the stage, 0 inside) — the de-duplication is ` +
                        `a MOVE to one home, not a loss`,
                );
            } else if (probe.sidebarEditCanvases === 0) {
                fail(
                    `editable curve home — the editable .easing-curve-canvas has no sidebar home ` +
                        `(${probe.totalEditCanvases} total, ${probe.sidebarEditCanvases} outside the stage); ` +
                        `the editable curve must live in the sidebar (it was not deleted wholesale)`,
                );
            } else {
                fail(
                    `editable curve home — an editable .easing-curve-canvas still lives in the stage ` +
                        `(stage:${probe.stageCanvases}, sidebar:${probe.sidebarEditCanvases}); ONE home only, the sidebar`,
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
        `\nproof:easing-stage-is-ball — FAIL (${failures.length}): the easing singular stage is ` +
            `not the engine-driven ball (a duplicate curve survives, the ball is static, or the ` +
            `editable curve lost its sidebar home) — H.W10 G4.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:easing-stage-is-ball — PASS: the easing singular stage is ONE engine-driven hero ball " +
        "that traverses under the selected easing, ZERO duplicate curve in the stage, and the editable " +
        "curve lives in the sidebar only (H.W10 G4).",
);
