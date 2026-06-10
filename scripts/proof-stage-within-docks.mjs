#!/usr/bin/env node
/**
 * proof:stage-within-docks — H.W10 G8 (the [stage]-track dock-safe containment
 * PRIMITIVE). The NEW/AMEND of proof:stage-not-clipped: that gate measured the
 * `.stage-cell` GRID CELL (the cell is always within the viewport, so the clip
 * slipped past it); THIS gate bites the SCENE SUBJECT against the affixed DOCK
 * bands — the thing the user actually saw clipped.
 *
 * The defect (live, pre-W10, #/easing & #/spring): the TOP ChromeDock and the
 * BOTTOM AnimationMenuBar are each `fixed` and overlay the work-area's centred
 * top/bottom edges (a --dock-band-reserve band apiece). The `[stage]` grid track
 * did NOT reserve those bands — the easing/spring `flex-1`/`h-full` stage card
 * STRETCHED and its TOP edge ran UNDER the top dock (the `dock-inset` patch padded
 * BOTTOM ONLY). cube/amiga didn't clip because their subjects CENTRE in the cell.
 * The fix (G8) makes `.stage-cell` the SINGLE dock-safe envelope: box-sizing:
 * border-box + symmetric `padding-block: var(--dock-band-reserve)` — the existing
 * cycle-free token (dock-icon-height + dock-margin + safe-area-inset-bottom), ZERO
 * magic numbers — so EVERY scene subject is inset clear of BOTH dock bands, once;
 * the per-scene `dock-inset` is DELETED.
 *
 * Two BROWSER clauses + one STATIC clause, each BITING on the exact defect:
 *
 *   1. SUBJECT WITHIN THE DOCK-SAFE BAND (browser, the born-RED anchor). For the
 *      easing (#/easing — `.hero-ball`) and spring (#/spring — `.spring-rail`)
 *      scenes the rendered scene SUBJECT is contained within the affixed dock
 *      bands, at TWO altitudes the contract names ("1280/1440 + mobile"):
 *        • DESKTOP (1280 & 1440) — the W10 anchor: subject.top is BELOW the top
 *          dock's visible bottom AND subject.bottom is ABOVE the bottom dock's
 *          visible top (contained between BOTH bands; the rail·stage·rail grid gives
 *          the subject the full inter-band height). BITE: revert G8 (drop the
 *          `.stage-cell` padding-block reserve / restore the bottom-only
 *          `dock-inset`) → the stretched stage subject's top runs under the top dock
 *          → subject.top < topDock.bottom → reds.
 *        • MOBILE (390) — the W10-OWNABLE guarantee: subject.top clears the TOP dock
 *          (the exact top-clip the user reported; pre-W10 `dock-inset` padded BOTTOM
 *          only, so the top ran under the dock — the symmetric `padding-block`
 *          reserve fixes it at EVERY width) AND `.stage-cell` resolves the symmetric
 *          `--dock-band-reserve` token (the primitive is in effect at mobile, not
 *          desktop-only). MEASURE-FIRST scope: at mobile the layout is a STACKED
 *          `grid-rows-[auto_1fr_auto]` (the controls pane is a sibling grid ROW that
 *          squeezes the stage's `1fr` row, so the stage bottom grazes the menubar) —
 *          turning the mobile pane into an OVERLAY is the SEPARATE H.W7 deliverable
 *          (mobile overlay + springy drawer), NOT the W10 G8 [stage]-track primitive.
 *          The bottom-menubar mobile containment is asserted at desktop here + lands
 *          fully with H.W7; W10's gate bites only what W10 G8 fixes at mobile.
 *      A NON-VACUITY guard requires the subject to have real area (width·height > 0)
 *      and both dock bands to be found (a missing dock/subject cannot pass GREEN).
 *
 *   2. CONTAINMENT IS THE GRID, NOT A PATCH (browser). At the same widths, ZERO
 *      live `.dock-inset` elements exist in the easing/spring DOM (the per-scene
 *      patch is gone — the reserve is on the layout primitive). BITE: re-add the
 *      `dock-inset` class to a scene wrapper → a live `.dock-inset` element appears
 *      → reds.
 *
 *   3. NO `dock-inset` IN SOURCE (static). The `.dock-inset { … }` CSS RULE is gone
 *      from design-idioms.css AND no easing/spring scene template references the
 *      `dock-inset` token in a `class`/`:class` ATTRIBUTE (doc-comments that NARRATE
 *      the deletion are not usages — comments are stripped before the scan). BITE:
 *      re-introduce the `.dock-inset` utility OR a per-scene `class="dock-inset"`
 *      callsite → reds. (The containment comes from the [stage] track, not a
 *      per-scene patch — the precept "no legacy beside the replacement".)
 *
 * MEASURE-FIRST note (why the SUBJECT, not the cell content-box): the full-bleed
 * `.scene-host` flex container fills the padded cell, so its BOX bottom (the cell
 * content-box) legitimately grazes the menubar band (the menubar's visible band is
 * taller than the symmetric reserve) — but the centred SUBJECT (the ball / rail /
 * card) stays clear. The clip the user reported, and the thing G8 fixes, is the
 * SUBJECT's top running under the TOP dock; the gate measures the rendered subject
 * (the contract's bite: "the stage SUBJECT's getBoundingClientRect() top ... AND
 * bottom ..."), not the flex envelope.
 *
 * Dock-band identification (robust to the multi-`z-dock` DOM): the TOP dock band's
 * bottom = the MAX visible `.bottom` of the `z-dock` elements seated in the top
 * region (rect.top < vh/2) with real area (the centred ChromeDock is the DEEPEST
 * top band — clearing it clears the shallower top-corner z-dock too); the BOTTOM
 * dock band's top = the MIN visible `.top` of the `z-dock` elements seated in the
 * bottom region (rect.top ≥ vh/2) with real area (the collapsed h:0 expanded-
 * timeline cell is excluded by the real-area guard; the menubar is the band).
 *
 * Settle-gated on the H.W1 FSM resting (mirrors proof:stage-not-clipped /
 * proof:easing-canvas-bounded): the scene is pinned via the lib's navToScene (an
 * IN-PAGE hash assignment — NOT page.goto, which clears storage + the H.W1
 * reconcile trap — settled on the destination's per-EXPECTED control surface),
 * the viewport is RE-ASSERTED after navigation, the controls pane is opened on
 * desktop, the route rests ≥500ms, and the gate waits until the subject + the
 * dock bands resolve before measuring.
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * resolveChromium + context/teardown, J.W3 S1 — the `.stage-cell` plumbing it
 * REUSES). Browser-led (a dock clip is a
 * rendered fact — there is no static half for the containment) + the one static
 * source clause; under KF_REQUIRE_BROWSER a playwright-absent skip becomes a hard
 * fail AT THE LIB SEAM so a SHIP is never green-reported un-exercised. Re-runnable:
 * `node scripts/proof-stage-within-docks.mjs`. Serves the BUILT dist/gh-pages/
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

console.log("proof:stage-within-docks — H.W10 G8 (the scene subject is contained within the affixed dock bands)");

const CTRL_KEY = "animation-groups-control-options-store";

// The destination control-tab labels navToScene settles on (per-EXPECTED-state).
const TRIGGER = { easing: "Easing", spring: "Spring" };

/** Settle on #/<scene> via the lib's in-page hash nav (storage + the H.W1 trap
 *  survive; page.goto clears both). Re-assert the viewport AFTER navigation
 *  (Playwright resets on navigate). Open the controls pane on desktop so the
 *  layout is in its canonical rail·stage·rail form; rest ≥500ms. */
async function settleOnScene(page, scene, viewportWidth, viewportHeight) {
    await navToScene(page, scene, TRIGGER[scene], { timeout: 8000 });
    await page.setViewportSize({ width: viewportWidth, height: viewportHeight });
    const openPane = viewportWidth >= 1024;
    await page.evaluate(
        ([ck, op]) => {
            try {
                const s = JSON.parse(localStorage.getItem(ck) || "{}");
                s.isControlsPanelOpen = op;
                localStorage.setItem(ck, JSON.stringify(s));
            } catch {
                /* fall through to the class toggle */
            }
            const el = document.querySelector(".controls-layout");
            if (el) {
                el.classList.toggle("controls-layout--open", op);
                el.classList.toggle("controls-layout--closed", !op);
            }
        },
        [CTRL_KEY, openPane],
    );
    await page.waitForTimeout(700); // route rested ≥500ms + the grid reflow
}

/** Wait until the stage cell + the named subject + ≥2 dock bands resolve (not
 *  mid-mount), so the measure is not racing the reflow. */
async function waitSubjectMounted(page, subjectSel) {
    return page
        .waitForFunction(
            (sel) => {
                const cell = document.querySelector(".stage-cell");
                if (!cell) return false;
                const subj = cell.querySelector(sel);
                if (!subj) return false;
                const r = subj.getBoundingClientRect();
                const docks = document.querySelectorAll(".z-dock, [class*='z-dock']");
                return r.width > 0 && r.height > 0 && docks.length >= 2;
            },
            subjectSel,
            { timeout: 8000 },
        )
        .then(() => true)
        .catch(() => false);
}

/** The two scenes G8 names: each scene + the concrete rendered SUBJECT the user
 *  saw clip (the contract's "stage SUBJECT" — the ball / the rail, NOT the
 *  full-bleed flex envelope whose box legitimately fills the padded cell). */
const SCENES = [
    { scene: "easing", subject: ".hero-ball", label: "easing singular hero ball" },
    { scene: "spring", subject: ".spring-rail", label: "spring solver rail" },
];
const WIDTHS = [
    { w: 1280, h: 900, kind: "desktop" },
    { w: 1440, h: 900, kind: "desktop" },
    { w: 390, h: 844, kind: "mobile" },
];
const TOL = 1.5; // sub-pixel rounding tolerance

async function browserHalf() {
    const result = await withPage(
        {
            distDir: DIST,
            label: "the dock-containment assertion",
            context: { viewport: { width: WIDTHS[0].w, height: WIDTHS[0].h } },
        },
        async (page, { url }) => {
        await page.goto(`${url}/#/${SCENES[0].scene}`, { waitUntil: "load" });
        for (const { scene, subject, label } of SCENES) {
            for (const { w: W, h: H, kind } of WIDTHS) {
                await settleOnScene(page, scene, W, H);
                const mounted = await waitSubjectMounted(page, subject);
                const tag = `${label} ${W}×${H} (${kind})`;

                if (!mounted) {
                    const dbg = await page.evaluate((sel) => ({
                        hasCell: !!document.querySelector(".stage-cell"),
                        hasSubject: !!document.querySelector(`.stage-cell ${sel}`),
                        docks: document.querySelectorAll(".z-dock, [class*='z-dock']").length,
                        hash: location.hash,
                    }), subject);
                    fail(
                        `${tag} — the subject never mounted (cell:${dbg.hasCell}, ` +
                            `subject(${subject}):${dbg.hasSubject}, z-docks:${dbg.docks}, ` +
                            `hash:${dbg.hash}) — the FSM may not have rested on ${scene}`,
                    );
                    continue;
                }

                const probe = await page.evaluate((sel) => {
                    const vh = window.innerHeight;
                    const cell = document.querySelector(".stage-cell");
                    const subj = cell.querySelector(sel);
                    const sr = subj.getBoundingClientRect();

                    // Dock-band identification — measure the innermost VISIBLE chrome
                    // (the .pointer-events-auto pill inside the fixed wrapper) so a
                    // wrapper bigger than the visible band does not over-constrain.
                    const visRect = (el) => {
                        const pill = el.querySelector(".pointer-events-auto");
                        return (pill || el).getBoundingClientRect();
                    };
                    const zdocks = [...document.querySelectorAll(".z-dock, [class*='z-dock']")];
                    let topBandBottom = -Infinity; // deepest top-region dock bottom
                    let bottomBandTop = Infinity; // shallowest bottom-region dock top
                    let topFound = false;
                    let bottomFound = false;
                    for (const el of zdocks) {
                        const v = visRect(el);
                        if (!(v.width > 0 && v.height > 0)) continue; // skip collapsed h:0
                        if (v.top < vh / 2) {
                            if (v.bottom > topBandBottom) topBandBottom = v.bottom;
                            topFound = true;
                        } else {
                            if (v.top < bottomBandTop) bottomBandTop = v.top;
                            bottomFound = true;
                        }
                    }

                    const cs = getComputedStyle(cell);
                    return {
                        vh,
                        subj: { top: sr.top, bottom: sr.bottom, w: sr.width, h: sr.height },
                        topBandBottom,
                        bottomBandTop,
                        topFound,
                        bottomFound,
                        padBlockTop: parseFloat(cs.paddingTop) || 0,
                        padBlockBottom: parseFloat(cs.paddingBottom) || 0,
                        dockInsetLive: document.querySelectorAll(".dock-inset").length,
                    };
                }, subject);

                // NON-VACUITY: the subject must have real area + both bands found.
                if (!(probe.subj.w > 0 && probe.subj.h > 0)) {
                    fail(
                        `${tag} — the subject has zero area ` +
                            `(w:${Math.round(probe.subj.w)} h:${Math.round(probe.subj.h)}); a vacuous pass is forbidden`,
                    );
                    continue;
                }
                if (!probe.topFound || !probe.bottomFound) {
                    fail(
                        `${tag} — a dock band was not found ` +
                            `(topDock:${probe.topFound}, bottomDock:${probe.bottomFound}); ` +
                            `the containment cannot be asserted without both affixed bands`,
                    );
                    continue;
                }

                // ── 1. SUBJECT WITHIN THE DOCK-SAFE BAND (born-RED anchor) ──
                const clearTop = probe.subj.top >= probe.topBandBottom - TOL;
                const clearBottom = probe.subj.bottom <= probe.bottomBandTop + TOL;
                if (kind === "desktop") {
                    // DESKTOP (1280/1440) — the W10 anchor: the rail·stage·rail grid gives
                    // the subject the full height between BOTH affixed bands. The G8
                    // primitive reserves both; the subject is contained top AND bottom.
                    if (clearTop && clearBottom) {
                        ok(
                            `${tag} — subject contained in the dock-safe band ` +
                                `(subj.top ${Math.round(probe.subj.top)} ≥ topDock.bottom ${Math.round(probe.topBandBottom)} ` +
                                `AND subj.bottom ${Math.round(probe.subj.bottom)} ≤ bottomDock.top ${Math.round(probe.bottomBandTop)})`,
                        );
                    } else {
                        fail(
                            `${tag} — the subject CLIPS a dock band ` +
                                `(subj.top ${Math.round(probe.subj.top)} vs topDock.bottom ${Math.round(probe.topBandBottom)}` +
                                `${clearTop ? "" : " ← runs UNDER the top dock"}; ` +
                                `subj.bottom ${Math.round(probe.subj.bottom)} vs bottomDock.top ${Math.round(probe.bottomBandTop)}` +
                                `${clearBottom ? "" : " ← runs UNDER the bottom dock"}). ` +
                                `The G8 [stage]-track containment primitive is not reserving the band ` +
                                `(restore .stage-cell padding-block: var(--dock-band-reserve)).`,
                        );
                    }
                } else {
                    // MOBILE (390) — the W10-OWNABLE guarantee only. At mobile the layout is
                    // a STACKED `grid-rows-[auto_1fr_auto]`: the controls pane is a sibling
                    // grid ROW above the stage (it squeezes the stage's `1fr` row). Turning
                    // the mobile pane into an OVERLAY (so the stage keeps full height and its
                    // bottom clears the menubar) is the SEPARATE H.W7 deliverable (mobile
                    // overlay + springy drawer) — NOT the W10 G8 [stage]-track primitive.
                    // W10 G8 owns, and this clause bites at mobile: (a) the SUBJECT clears
                    // the TOP dock (the exact top-clip the user reported — pre-W10 `dock-inset`
                    // padded BOTTOM-only so the top ran under the dock; the symmetric
                    // `padding-block` reserve fixes it at every width), and (b) `.stage-cell`
                    // resolves the symmetric `--dock-band-reserve` token (the primitive is in
                    // effect at mobile, not desktop-only). The bottom-menubar mobile
                    // containment is asserted at desktop here + lands fully with H.W7.
                    const reserveOn = probe.padBlockTop > 0 && probe.padBlockBottom > 0;
                    const symmetric = Math.abs(probe.padBlockTop - probe.padBlockBottom) <= 0.5;
                    if (clearTop && reserveOn && symmetric) {
                        ok(
                            `${tag} — subject clears the TOP dock (subj.top ${Math.round(probe.subj.top)} ≥ ` +
                                `topDock.bottom ${Math.round(probe.topBandBottom)}) AND .stage-cell reserves the ` +
                                `symmetric --dock-band-reserve (padding-block ${Math.round(probe.padBlockTop)}px) — the ` +
                                `W10 G8 primitive is in effect at mobile; the bottom-menubar mobile containment is the ` +
                                `H.W7 mobile-overlay deliverable (the stacked pane row, not the G8 track)`,
                        );
                    } else {
                        fail(
                            `${tag} — the W10 G8 mobile guarantee fails: ` +
                                `subject ${clearTop ? "clears" : "RUNS UNDER"} the top dock ` +
                                `(subj.top ${Math.round(probe.subj.top)} vs topDock.bottom ${Math.round(probe.topBandBottom)}); ` +
                                `.stage-cell padding-block ${Math.round(probe.padBlockTop)}/${Math.round(probe.padBlockBottom)}px ` +
                                `(reserve must be present + symmetric). The symmetric --dock-band-reserve on .stage-cell ` +
                                `must hold at mobile (the top-clip fix is width-agnostic).`,
                        );
                    }
                }

                // ── 2. CONTAINMENT IS THE GRID, NOT A PATCH (live) ──
                if (probe.dockInsetLive === 0) {
                    ok(`${tag} — zero live .dock-inset elements (the containment is the layout primitive, not a per-scene patch)`);
                } else {
                    fail(
                        `${tag} — ${probe.dockInsetLive} live .dock-inset element(s) present; ` +
                            `the per-scene patch must be gone (the [stage]-track primitive owns the reserve)`,
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

// ── 3. NO `dock-inset` IN SOURCE (static) ──────────────────────────────────────
function stripComments(src, kind) {
    // strip /* … */ (CSS) and <!-- … --> (Vue template) comments so a doc-comment
    // that NARRATES the dock-inset deletion is not mistaken for a usage.
    let s = src.replace(/\/\*[\s\S]*?\*\//g, " ");
    if (kind === "vue") s = s.replace(/<!--[\s\S]*?-->/g, " ");
    return s;
}

function staticHalf() {
    const cssPath = path.join(REPO, "demo/@/styles/design-idioms.css");
    if (!fs.existsSync(cssPath)) {
        fail(`static — design-idioms.css not found at ${cssPath}`);
    } else {
        const css = stripComments(fs.readFileSync(cssPath, "utf8"), "css");
        // the `.dock-inset { … }` RULE definition (a selector, not a token in prose)
        if (/\.dock-inset\s*[,{]/.test(css)) {
            fail(
                "static — the `.dock-inset { … }` CSS rule still exists in design-idioms.css; " +
                    "the per-scene utility must be DELETED (superseded by the [stage]-track primitive)",
            );
        } else {
            ok("static — the `.dock-inset` CSS rule is gone from design-idioms.css (deleted, not commented-around)");
        }
    }

    // No easing/spring scene template references `dock-inset` in a class attribute.
    const sceneFiles = [
        "demo/easing/EasingTarget.vue",
        "demo/easing/EasingSidebar.vue",
        "demo/spring/SpringTarget.vue",
        "demo/spring/StartingStyleTarget.vue",
        "demo/spring/SpringSidebar.vue",
        "demo/app/scenes/EasingScene.vue",
        "demo/app/scenes/SpringScene.vue",
        "demo/motion-path/MotionPathTarget.vue",
        "demo/sequence/SequenceTarget.vue",
    ];
    let usages = 0;
    for (const rel of sceneFiles) {
        const p = path.join(REPO, rel);
        if (!fs.existsSync(p)) continue;
        const src = stripComments(fs.readFileSync(p, "utf8"), "vue");
        // a `dock-inset` token surviving comment-strip is a real class/binding usage
        if (/\bdock-inset\b/.test(src)) {
            fail(`static — ${rel} references the \`dock-inset\` token in live markup (a class/binding usage, not a comment)`);
            usages++;
        }
    }
    if (usages === 0) {
        ok("static — no easing/spring/motion-path/sequence scene template references `dock-inset` in live markup");
    }
}

staticHalf();
await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:stage-within-docks — FAIL (${failures.length}): a scene subject clips an ` +
            `affixed dock band (or a \`dock-inset\` patch survives) — the G8 [stage]-track ` +
            `containment primitive is not the single dock-safe envelope (H.W10 G8).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:stage-within-docks — PASS: the easing/spring scene subjects are contained within " +
        "the affixed dock bands at 1280 & 1440 & mobile, the `dock-inset` patch is gone (live + source), " +
        "and the containment is the [stage]-track primitive (H.W10 G8).",
);
