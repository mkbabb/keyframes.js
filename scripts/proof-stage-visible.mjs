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
 * scripts/gate-bands.mjs; the discharge is registered when those keys retire).
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
// AT REST: sheet.top / innerHeight ≥ this fraction (clause a).
const REST_FRACTION = 0.65;
// A declared reserved band must resolve to a meaningful px (clause b non-vacuity);
// below this the `--stage-reserve` token is absent/unset → a hard FAIL.
const RESERVE_FLOOR = 40;
// --sheet-t rest epsilon (the spring rests exactly at 0/1; tolerate float noise).
const SHEET_T_EPS = 0.02;
// Sub-pixel / dvh-vs-innerHeight rounding tolerance.
const TOL = 2;

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
            const el = document.querySelector(".controls-pane-wrapper");
            return el
                ? getComputedStyle(el).getPropertyValue("--sheet-t").trim()
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
            const w = document.querySelector(".controls-pane-wrapper");
            if (w) return w.getBoundingClientRect().height > 0;
            // home / a no-sheet scene: the scene host is enough.
            return !!document.querySelector(".scene-host, .stage-cell, h1");
        },
        { timeout: 10000 },
    );
    await waitForSheetRest(page);
}

/** Read the sheet geometry: the live `--sheet-t`, the sheet's top y, and the
 *  RESOLVED `--stage-reserve` px (resolved by probing a temp child that inherits
 *  the wrapper-scoped custom property — the proof:mobile-single-page pattern). */
async function probeSheet(page) {
    return page.evaluate(() => {
        const sheet = document.querySelector(".controls-pane-wrapper");
        if (!sheet) return { hasSheet: false };
        const cs = getComputedStyle(sheet);
        const rect = sheet.getBoundingClientRect();
        // A `v-show`-hidden sheet (home's start screen sets `hideControls`) is
        // display:none — it cannot occlude anything, so it is NOT a sheet for the
        // contract's purposes (no-occlusion, like a scene with no controls).
        if (
            cs.display === "none" ||
            cs.visibility === "hidden" ||
            rect.height <= 8
        ) {
            return { hasSheet: false };
        }
        const sheetT = parseFloat(cs.getPropertyValue("--sheet-t")) || 0;
        const top = rect.top;
        // Resolve `--stage-reserve` (a calc over dvh tokens) to px by probing a
        // hidden child that INHERITS the wrapper-scoped custom property.
        const probe = document.createElement("div");
        probe.style.position = "absolute";
        probe.style.visibility = "hidden";
        probe.style.height = "var(--stage-reserve)";
        sheet.appendChild(probe);
        const reserve = probe.getBoundingClientRect().height;
        probe.remove();
        return { hasSheet: true, sheetT, top, reserve, vh: window.innerHeight };
    });
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
                    if (
                        Math.abs(rest.sheetT) <= SHEET_T_EPS &&
                        restFrac >= REST_FRACTION
                    ) {
                        ok(
                            `${tag} (a) at rest --sheet-t=${rest.sheetT.toFixed(3)} · ` +
                                `sheet.top/vh=${restFrac.toFixed(3)} ≥ ${REST_FRACTION} ` +
                                `(sheet at peek; stage maximally visible)`,
                        );
                    } else {
                        fail(
                            `${tag} (a) at rest the sheet is NOT at peek: ` +
                                `--sheet-t=${rest.sheetT.toFixed(3)} (want ~0) · ` +
                                `sheet.top/vh=${restFrac.toFixed(3)} (want ≥ ${REST_FRACTION}) ` +
                                `— the sheet is born-open and occludes the stage (the ` +
                                `three-writer chain fired; S.G1 S1 not landed)`,
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

                // ── clause (b) — the expanded-detent clause (SG-4) ────────────
                // NON-VACUITY FIRST: the reserved-band token must be DECLARED (a
                // static resolve, valid at any detent). Pre-cure it resolves to ~0
                // (undeclared) → red WITHOUT driving the sheet. Only when the band
                // exists do we drive the sheet to the expanded detent and assert it
                // clears the band.
                if (!rest.hasSheet) continue;
                if (rest.reserve < RESERVE_FLOOR) {
                    fail(
                        `${tag} (b) --stage-reserve resolves to ${Math.round(rest.reserve)}px ` +
                            `(< ${RESERVE_FLOOR}px) — the reserved stage band token is NOT declared ` +
                            `(S.G1 S3 mode tokens not landed)`,
                    );
                    continue;
                }
                const handle = page.locator(".sheet-grab-handle").first();
                if (!(await handle.isVisible().catch(() => false))) {
                    fail(
                        `${tag} (b) the .sheet-grab-handle is not visible/tappable — the ` +
                            `sheet has no reachable expand affordance`,
                    );
                    continue;
                }
                try {
                    await handle.tap({ timeout: 5000 });
                } catch (e) {
                    fail(`${tag} (b) tapping the grab handle failed: ${e.message}`);
                    continue;
                }
                await waitForSheetRest(page);
                const expanded = await probeSheet(page);
                if (expanded.hasSheet && expanded.top >= expanded.reserve - TOL) {
                    ok(
                        `${tag} (b) after a handle tap sheet.top=${Math.round(expanded.top)} ≥ ` +
                            `resolved --stage-reserve=${Math.round(expanded.reserve)} ` +
                            `(--sheet-t=${expanded.sheetT.toFixed(3)}; the declared band is unoccluded)`,
                    );
                } else {
                    fail(
                        `${tag} (b) after a handle tap sheet.top=${Math.round(expanded.top ?? NaN)} < ` +
                            `resolved --stage-reserve=${Math.round(expanded.reserve ?? rest.reserve)} — the ` +
                            `expanded sheet OCCLUDES the declared reserved band (S.G1 S3 detent not derived)`,
                    );
                }
                // Restore the sheet to peek before the next scene (tap toggles).
                await handle.tap({ timeout: 5000 }).catch(() => {});
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
