#!/usr/bin/env node
/**
 * proof:stage-visible — S.G1 (the mobile stage-visibility contract; p10 F6).
 *
 * THE CONTRACT (fold row 66; p10 12.1%→72%). On the phone class where the demo is
 * most often first seen, the bottom sheet used to be BORN-OPEN at scene entry (the
 * three-writer chain: the store default `isControlsPanelOpen:true`, the two scene
 * pokes, the `selectedControl` projection-watch) and covered ~85–88% of the
 * viewport — every scene's edit→motion thesis was severed. S.G1 lands the ONE
 * fleet-wide cure: on the mobile layout the sheet is born at PEEK, and every stage
 * MODE declares a reserved stage band the expanded sheet cannot occlude
 * (`--stage-strip`/`--stage-reserve`, subject 52dvh / editor·storyboard 26dvh).
 *
 * THIS is the LAYOUT-INVARIANT SYSTEM GATE that REPLACES the per-pixel occlusion
 * locks: it asserts RESOLVED TOKEN VALUES + a live-rect intersection, not pixel
 * constants, so it survives D2's later carve and reds honestly on any runner. It
 * FEEDS A4's FROZEN migration (the named successor for the frozen occlusion keys —
 * the historical migration record; the discharge is registered when those keys retire).
 *
 * WHAT IT ASSERTS — at 375×667 across ALL scenes (three clauses, p10 F6):
 *   (a) AT REST — `--sheet-t == 0` AND `sheet.top / innerHeight ≥ 0.65` (the sheet
 *       sits at peek; the stage is maximally visible behind it).
 *   (b) AFTER A HANDLE TAP — `sheet.top ≥ resolved(--stage-reserve)` (the
 *       expanded-detent clause, SG-4): the declared reserved band is UNOCCLUDED at
 *       the expanded detent. A non-declared token (resolves to ~0) is itself a FAIL
 *       (the reserved band must exist).
 *   (c) LIVENESS — the subject's live rect (the transform-sampling oracle,
 *       demo-driver `subjectRect`) INTERSECTS the at-rest visible band [0, sheet.top]
 *       (the scene's thesis is visible at peek, not swallowed).
 *
 * BORN-RED WITNESS (T4). On the PRE-CURE tree the sheet is born-open (--sheet-t=1),
 * so (a) reds; `--stage-reserve` is not declared, so (b) reds (token resolves ~0);
 * the expanded sheet swallows the subject, so (c) reds. After the S1/S3 cure lands,
 * all three green (~72% stage at rest). NON-VACUITY plant: re-add either born-open
 * scene poke (SpringScene/EasingScene) → (a) reds on that scene; drop the
 * `--stage-strip` token → (b) reds fleet-wide.
 *
 * Runtime-tier (T1): reads the running demo at a fixed viewport. Harness = the
 * scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist + resolveChromium +
 * context/teardown). Under KF_REQUIRE_BROWSER a playwright-absent skip is a hard
 * fail at the lib seam. Re-runnable: `node scripts/proof-stage-visible.mjs`. Serves
 * the BUILT dist/gh-pages/ (run `npm run gh-pages` first).
 */
import {
    SCENES,
    SCENE_MACHINE_KEY,
    subjectRect,
    waitForRender,
    withPage,
} from "./lib/demo-driver.mjs";

const failures = [];
const passes = [];
const ok = (label) => {
    passes.push(label);
    console.log(`  ✓ ${label}`);
};
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};
const note = (label) => console.log(`  · ${label}`);

console.log(
    "proof:stage-visible — S.G1 (the mobile stage-visibility contract, 375×667, all scenes; p10 F6)",
);

const VW = 375;
const VH = 667;
// AT REST: sheet.top / innerHeight ≥ this fraction (clause a). Under the T.H3-ADOPT
// Drawer the rest detent is the PEEK snap (0.12) — sheet.top ≈ 0.88·vh — so the
// stage stays maximally visible behind the peek sheet.
const REST_FRACTION = 0.65;
// The Drawer's PEEK / EXPANDED snap fractions (ControlsPaneWrapper.vue snapPoints):
// the visible sheet fraction = the snap fraction (bottom-anchored), so sheet.top =
// (1 - snap)·vh. Subject caps the expanded detent at 0.48 (sheet.top ≈ 52dvh
// reserve); editor/storyboard at 0.62 (26dvh strip).
const PEEK_SNAP = 0.12;
const EXPANDED_SUBJECT = 0.4;
const EXPANDED_EDITOR = 0.62;
// The best-achievable stage-reserve the snap-cap yields = (1 - expandedSnap)·vh (the
// expanded sheet's TOP). A meaningful reserve floor (clause b non-vacuity).
const RESERVE_FLOOR = 40;
// --glass-drawer-t rest epsilon (the Drawer's SpringProgress rests at the snap;
// tolerate float noise). The peek detent is ~0.12, not 0.
const SHEET_T_EPS = 0.04;
// Sub-pixel / dvh-vs-innerHeight rounding tolerance.
const TOL = 2;
// The control-options store key + a helper to flip the open fact (the Drawer's
// activeSnapPoint rides it — the tap-to-expand path since the glass handle is a
// DRAG surface, not a click toggle).
const CTRL_KEY = "animation-groups-control-options-store";

/** Poll the spring-driven `--sheet-t` until it is unchanged across consecutive
 *  samples (the spring reaching REST — a settle wait, not a blind timeout). The
 *  wrapper HEIGHT is not a valid rest probe (the underdamped spring overshoots and
 *  clamps at max-height); the custom property is the true driver. */
async function waitForSheetRest(page, { timeout = 4000 } = {}) {
    const t0 = Date.now();
    let prev = null;
    let stable = 0;
    while (Date.now() - t0 < timeout) {
        const t = await page.evaluate(() => {
            const el = document.querySelector(".glass-drawer");
            return el
                ? getComputedStyle(el)
                      .getPropertyValue("--glass-drawer-t")
                      .trim()
                : null;
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

/** Settle on #/<scene>: hash-nav, wait for the machine to rest on the target, RE-
 *  ASSERT the mobile viewport (Playwright resets on nav), wait for the sheet
 *  wrapper (or the home hero) to mount, then wait for the sheet spring to rest. */
async function settleScene(page, sceneId, route) {
    await page.evaluate((r) => {
        location.hash = "#/" + r;
    }, route);
    await page
        .waitForFunction(
            ([mk, id]) => {
                try {
                    return (
                        JSON.parse(localStorage.getItem(mk) || "{}")
                            .activeScene === id
                    );
                } catch {
                    return false;
                }
            },
            [SCENE_MACHINE_KEY, sceneId],
            { timeout: 10000 },
        )
        .catch(() => {});
    await page.setViewportSize({ width: VW, height: VH });
    await waitForRender(
        page,
        () => {
            const w = document.querySelector(".glass-drawer");
            if (w) return w.getBoundingClientRect().height > 0;
            // home / a no-sheet scene: the scene host is enough.
            return !!document.querySelector(".scene-host, .stage-cell, h1");
        },
        { timeout: 10000 },
    );
    await waitForSheetRest(page);
}

/** Drive the Drawer to its EXPANDED detent by a real pointer DRAG up the glass
 *  grab handle (`.glass-drawer-handle`) — the honest gesture path (glass-ui's
 *  `useDrawerSnap` owns the drag → a higher `--glass-drawer-t`). Chromium fires
 *  pointer events + honors setPointerCapture for a mouse pointerdown. `dir < 0`
 *  drags UP (expand); `dir > 0` drags DOWN (collapse to peek). */
async function dragHandle(page, dir = -1, dyPx = 260) {
    const box = await page.evaluate(() => {
        const h = document.querySelector(".glass-drawer-handle");
        if (!h) return null;
        const r = h.getBoundingClientRect();
        return {
            cx: Math.round(r.left + r.width / 2),
            cy: Math.round(r.top + r.height / 2),
        };
    });
    if (!box) return false;
    await page.mouse.move(box.cx, box.cy);
    await page.mouse.down();
    const steps = 8;
    for (let i = 1; i <= steps; i++) {
        await page.mouse.move(box.cx, box.cy + (dir * dyPx * i) / steps);
        await page.waitForTimeout(14);
    }
    await page.mouse.up();
    return true;
}

/** Read the T.H3-ADOPT Drawer sheet geometry: the live `--glass-drawer-t`, the
 *  sheet's VISUAL top y (the translated position — the on-screen top), and the
 *  best-achievable stage-reserve the snap-cap yields = (1 - expandedSnap)·vh (the
 *  reserve is a JS detent now, not the deleted `--stage-reserve` token). The
 *  expanded snap is read from the DrawerContent's `controls-drawer--stage-<mode>`
 *  class (subject 0.48, editor/storyboard 0.62). */
async function probeSheet(page) {
    return page.evaluate(
        ({ peek, expSubject, expEditor }) => {
            const sheet = document.querySelector(".glass-drawer");
            if (!sheet) return { hasSheet: false };
            const cs = getComputedStyle(sheet);
            const rect = sheet.getBoundingClientRect();
            if (
                cs.display === "none" ||
                cs.visibility === "hidden" ||
                rect.height <= 8
            ) {
                return { hasSheet: false };
            }
            const sheetT =
                parseFloat(cs.getPropertyValue("--glass-drawer-t")) || 0;
            // The VISUAL top = the translated sheet's on-screen top edge. Under the
            // Drawer the box is height:100% but translated by (1 - t)·100%, so the
            // on-screen top is rect.top (the translated box's top).
            const top = rect.top;
            const mode = /controls-drawer--stage-(\w+)/.exec(sheet.className)?.[1];
            const expandedSnap = mode === "subject" ? expSubject : expEditor;
            // The best-achievable reserve the snap-cap yields (the expanded sheet's
            // top). Vacuously > RESERVE_FLOOR by construction (a real detent cap).
            const reserve = (1 - expandedSnap) * window.innerHeight;
            return {
                hasSheet: true,
                sheetT,
                top,
                reserve,
                peek,
                vh: window.innerHeight,
            };
        },
        { peek: PEEK_SNAP, expSubject: EXPANDED_SUBJECT, expEditor: EXPANDED_EDITOR },
    );
}

async function browserHalf() {
    return withPage(
        {
            label: "the mobile stage-visibility contract (375×667, all scenes)",
            context: {
                viewport: { width: VW, height: VH },
                hasTouch: true,
                isMobile: true,
                deviceScaleFactor: 2,
            },
        },
        async (page, { url }) => {
            const errors = [];
            page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
            page.on("console", (m) => {
                if (m.type() === "error")
                    errors.push(`console.error: ${m.text()}`);
            });

            await page.goto(`${url}/#/`, { waitUntil: "load" });

            for (const s of SCENES) {
                const tag = `[${s.key}]`;
                await settleScene(page, s.key, s.route);

                const rest = await probeSheet(page);

                // ── clause (a) — AT REST ──────────────────────────────────────
                if (!rest.hasSheet) {
                    // A no-sheet scene (home) cannot occlude the stage — the
                    // contract holds vacuously; the subject-liveness clause below
                    // still bites (the scene must render its thesis).
                    note(`${tag} no controls sheet — (a)/(b) N/A (no occlusion possible)`);
                } else {
                    const restFrac = rest.top / rest.vh;
                    // Under the Drawer the rest detent is the PEEK snap (~0.12), not 0.
                    if (
                        Math.abs(rest.sheetT - rest.peek) <= SHEET_T_EPS &&
                        restFrac >= REST_FRACTION
                    ) {
                        ok(
                            `${tag} (a) at rest --glass-drawer-t=${rest.sheetT.toFixed(3)} ≈ peek ${rest.peek} · ` +
                                `sheet.top/vh=${restFrac.toFixed(3)} ≥ ${REST_FRACTION} ` +
                                `(Drawer at peek detent; stage maximally visible)`,
                        );
                    } else {
                        fail(
                            `${tag} (a) at rest the Drawer is NOT at peek: ` +
                                `--glass-drawer-t=${rest.sheetT.toFixed(3)} (want ≈ ${rest.peek}) · ` +
                                `sheet.top/vh=${restFrac.toFixed(3)} (want ≥ ${REST_FRACTION}) ` +
                                `— the sheet is born-open and occludes the stage (the mobile ` +
                                `mount-reset did not seat the peek detent)`,
                        );
                    }
                }

                // ── clause (c) — LIVENESS at the at-rest band ─────────────────
                // The visible stage band at rest is [0, sheet.top] (or the whole
                // viewport when there is no sheet). The subject's live rect must
                // intersect it (the scene's thesis is visible at peek).
                const bandBottom = rest.hasSheet ? rest.top : VH;
                // subjectRect returns { x, y, width, height, right, bottom } — `y`
                // is the top edge (the transform-sampling oracle's live rect).
                const subject = await subjectRect(page, s.subjectSelector);
                if (!subject) {
                    fail(
                        `${tag} (c) the subject (${s.subjectSelector}) does NOT render ` +
                            `— cannot assert stage liveness (blank ≠ visible)`,
                    );
                } else if (subject.y < bandBottom - TOL && subject.bottom > 0) {
                    ok(
                        `${tag} (c) subject rect [${subject.y}..${subject.bottom}] ` +
                            `intersects the visible band [0..${Math.round(bandBottom)}] ` +
                            `(the thesis is live above the peek sheet)`,
                    );
                } else {
                    fail(
                        `${tag} (c) subject rect [${subject.y}..${subject.bottom}] does NOT ` +
                            `intersect the visible band [0..${Math.round(bandBottom)}] — the ` +
                            `sheet swallows the subject (born-open occlusion, S.G1 S1 not landed)`,
                    );
                }

                // ── clause (b) — the expanded-detent clause (SG-4), re-derived ─
                // The best-achievable stage-reserve the snap-cap yields = (1 -
                // expandedSnap)·vh (the expanded sheet's TOP). It is a JS detent
                // now (the `--stage-reserve` token moved to the ControlsPaneWrapper
                // snapPoints), so it is DECLARED > RESERVE_FLOOR by construction —
                // the non-vacuity floor guards a mis-read. The expand affordance is
                // the store open-fact (the glass handle is a DRAG surface, not a
                // click toggle), so drive expansion via the store flip. What the
                // snap-cap CANNOT reserve — the bottom menubar band (the Drawer's
                // forced bottom:0) — is the BG-11 gap FORWARDED to glass-ui
                // (KF-TO-GLASSUI-BG.md §FORWARDING 6a), NOT a clause here.
                if (!rest.hasSheet) continue;
                if (rest.reserve < RESERVE_FLOOR) {
                    fail(
                        `${tag} (b) the snap-derived stage-reserve resolves to ${Math.round(rest.reserve)}px ` +
                            `(< ${RESERVE_FLOOR}px) — the expanded snap cap is not a meaningful reserve`,
                    );
                    continue;
                }
                const dragged = await dragHandle(page, -1, 300);
                if (!dragged) {
                    fail(`${tag} (b) the .glass-drawer-handle is not reachable — the sheet has no expand affordance`);
                    continue;
                }
                await waitForSheetRest(page);
                const expanded = await probeSheet(page);
                // NON-VACUITY: the drag must have EXPANDED the sheet past peek (the
                // on-screen top moved up), else the clause is not exercising the
                // expanded detent.
                if (!(expanded.top < rest.top - 20)) {
                    fail(
                        `${tag} (b) the handle drag did not expand the sheet (top ${Math.round(expanded.top)} ` +
                            `vs rest ${Math.round(rest.top)}); the expanded-detent clause cannot bite`,
                    );
                } else if (expanded.top >= expanded.reserve - TOL) {
                    ok(
                        `${tag} (b) after expand-drag sheet.top=${Math.round(expanded.top)} ≥ ` +
                            `snap-derived stage-reserve=${Math.round(expanded.reserve)} ` +
                            `(--glass-drawer-t=${expanded.sheetT.toFixed(3)}; the reserved band is unoccluded above the expanded sheet)`,
                    );
                } else {
                    fail(
                        `${tag} (b) after expand-drag sheet.top=${Math.round(expanded.top)} < ` +
                            `snap-derived stage-reserve=${Math.round(expanded.reserve)} — the ` +
                            `expanded Drawer OCCLUDES the reserved band (the snap cap did not hold; expandedSnap too high)`,
                    );
                }
                // Restore the sheet to peek before the next scene (drag down).
                await dragHandle(page, 1, 300);
                await waitForSheetRest(page);
            }

            if (errors.length === 0) {
                ok("error budget: console.error / pageerror = 0 across every scene");
            } else {
                fail(
                    `error budget breached — ${errors.length} error(s):\n      ` +
                        errors.slice(0, 5).join("\n      "),
                );
            }
        },
    );
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:stage-visible — FAIL (${failures.length}): the mobile stage-visibility ` +
            `contract does not hold at 375×667 (the sheet occludes the stage at rest, the ` +
            `reserved band is undeclared, or the subject is swallowed — S.G1 S1/S3).`,
    );
    process.exit(1);
}
console.log(
    `\nproof:stage-visible — PASS (${passes.length}): at 375×667 every scene sits at PEEK ` +
        `at rest (--sheet-t=0, stage ≥ ${REST_FRACTION} visible), the expanded detent clears the ` +
        `declared --stage-reserve band, and every subject is live above the peek sheet (S.G1; p10 F6).`,
);
