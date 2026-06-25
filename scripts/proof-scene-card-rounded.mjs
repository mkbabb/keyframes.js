#!/usr/bin/env node
/**
 * proof:scene-card-rounded — H.W10 G2 (no kf-owned scene surface renders square
 * corners; every cartoon surface is rounded, or the stage is full-bleed).
 *
 * The defect (live, pre-W10, #/easing & #/spring): the easing/spring STAGE was a
 * bare-class `glass-resting cartoon-surface` <div> WITHOUT `rounded-card` — a
 * cartoon card surface with `border-radius: 0` (square corners), the literal G2
 * defect (EasingTarget.vue:4, SpringTarget.vue:4, StartingStyleTarget.vue:9,
 * SpringScene.vue:8, plus EasingSidebar.vue:2's bare sidebar). The sidebars also
 * missed the radius token.
 *
 * The fix (G2, dissolved into G6/G8):
 *   - the easing/spring STAGE drops its bare cartoon card → FULL-BLEED like
 *     cube/amiga (no card to round — G8); and
 *   - the sidebars become a glass-ui `<Card surface="cartoon" tier="quiet">`
 *     which carries `rounded-card` BY CONSTRUCTION (one radius token — G6).
 * So G2 closes by REUSE of the Card primitive + the full-bleed stage, NOT an
 * ad-hoc `rounded-*` literal.
 *
 * One COMPUTED clause + one STATIC clause, each BITING on the exact defect:
 *
 *   1. EVERY CARTOON SURFACE IS ROUNDED (computed, born-RED anchor). In the
 *      easing AND spring scenes (the whole .controls-layout subtree), EVERY
 *      element carrying the `cartoon-surface` class token (the bare-class idiom AND
 *      the glass-ui Card's `surface="cartoon"` render — both emit `cartoon-surface`)
 *      resolves a NON-ZERO computed border-radius. BITE: RED on the pre-W10 bare
 *      `glass-resting cartoon-surface` stage card (computed border-radius 0);
 *      GREEN once every cartoon surface is either the `rounded-card` Card sidebar
 *      (16px), the `rounded-full` view-switch pill, or the editable curve wrapper
 *      (`rounded-lg`, 10px). A NON-VACUITY guard requires ≥1 cartoon surface to be
 *      found per scene (a scene with zero cartoon surfaces cannot pass GREEN — the
 *      assertion would be vacuous).
 *
 *   2. THE STAGE IS FULL-BLEED (static, the G8 surface consequence). The
 *      contract-named stage roots — EasingTarget.vue, SpringTarget.vue,
 *      StartingStyleTarget.vue, and SpringScene.vue's stage wrapper — carry NO
 *      bare-class `cartoon-surface` (the stage card is DROPPED → full-bleed; there
 *      is no card to round). Comments that NARRATE the deletion are stripped before
 *      the scan (the doc-comments quote the dropped class). BITE: re-add
 *      `class="… glass-resting cartoon-surface"` to a stage root → reds. (The
 *      legitimate rounded controls — the spring view-switch `rounded-full` pill —
 *      live in SpringScene's SWITCH markup, not the stage subject root, and are
 *      caught GREEN by clause 1's rounded computed-radius, not red by this static
 *      stage-root scan.)
 *
 * Settle-gated on the H.W1 FSM resting (mirrors proof:easing-canvas-bounded): each
 * scene is pinned via the lib's navToScene (an IN-PAGE hash assignment — NOT
 * page.goto, which clears storage + the H.W1 reconcile trap — settled on the
 * destination's per-EXPECTED control surface), the viewport is RE-ASSERTED after
 * navigation, the controls pane + the scene's tab are opened so the sidebar Card
 * mounts, the route rests ≥500ms, and the gate waits until ≥1 cartoon surface
 * resolves before measuring.
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * resolveChromium + context/teardown, J.W3 S1). The computed-radius clause is a
 * rendered fact (browser); the full-bleed clause is a source fact (static). Under
 * KF_REQUIRE_BROWSER a playwright-absent skip becomes a hard fail AT THE LIB SEAM
 * so the computed clause is never green-reported un-exercised. Re-runnable:
 * `node scripts/proof-scene-card-rounded.mjs`. Serves the BUILT dist/gh-pages/
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

console.log("proof:scene-card-rounded — H.W10 G2 (no kf-owned scene surface renders square corners)");

const CTRL_KEY = "animation-groups-control-options-store";

// The destination control-tab labels navToScene settles on (per-EXPECTED-state).
const TRIGGER = { easing: "Easing", spring: "Spring" };

/** Settle on #/<scene> via the lib's in-page hash nav. Re-assert the viewport
 *  AFTER navigation. Open the controls pane + the scene tab so the sidebar Card
 *  (a cartoon surface) mounts. Rest ≥500ms. */
async function settleOnScene(page, scene, control, viewportWidth, viewportHeight) {
    await navToScene(page, scene, TRIGGER[scene], { timeout: 8000 });
    await page.setViewportSize({ width: viewportWidth, height: viewportHeight });
    await page.evaluate(
        ([ck, ctrl]) => {
            try {
                const s = JSON.parse(localStorage.getItem(ck) || "{}");
                s.isControlsPanelOpen = true;
                s.selectedControl = ctrl;
                localStorage.setItem(ck, JSON.stringify(s));
            } catch {
                /* fall through to the class toggle */
            }
            const el = document.querySelector(".controls-layout");
            if (el) {
                el.classList.add("controls-layout--open");
                el.classList.remove("controls-layout--closed");
            }
        },
        [CTRL_KEY, control],
    );
    await page.waitForTimeout(700);
}

/** Wait until ≥1 cartoon surface resolves in the live scene (not mid-mount). */
async function waitCartoonSurface(page) {
    return page
        .waitForFunction(
            () => {
                const root = document.querySelector(".controls-layout") || document.body;
                const all = [...root.querySelectorAll("*")];
                return all.some((el) => {
                    const c = " " + (el.className?.baseVal ?? el.className ?? "") + " ";
                    return /\scartoon-surface\s/.test(c);
                });
            },
            { timeout: 8000 },
        )
        .then(() => true)
        .catch(() => false);
}

const SCENES = [
    { scene: "easing", control: "easing", label: "easing" },
    { scene: "spring", control: "spring", label: "spring" },
];

async function browserHalf() {
    const VW = 1440;
    const VH = 900;
    const result = await withPage(
        {
            distDir: DIST,
            label: "the cartoon-surface rounding assertion",
            context: { viewport: { width: VW, height: VH } },
        },
        async (page, { url }) => {
        await page.goto(`${url}/#/${SCENES[0].scene}`, { waitUntil: "load" });
        for (const { scene, control, label } of SCENES) {
            await settleOnScene(page, scene, control, VW, VH);
            const found = await waitCartoonSurface(page);

            if (!found) {
                fail(
                    `${label} — no cartoon surface mounted (the sidebar Card / scene chrome did not ` +
                        `render); the rounding assertion would be vacuous — the FSM may not have rested ` +
                        `on ${scene} or the pane/tab did not open`,
                );
                continue;
            }

            const probe = await page.evaluate(() => {
                const root = document.querySelector(".controls-layout") || document.body;
                const all = [...root.querySelectorAll("*")];
                const surfaces = all.filter((el) => {
                    const c = " " + (el.className?.baseVal ?? el.className ?? "") + " ";
                    return /\scartoon-surface\s/.test(c);
                });
                return surfaces.map((el) => {
                    const cs = getComputedStyle(el);
                    const cls = el.className?.baseVal ?? el.className ?? "";
                    // a corner is square if EVERY corner radius resolves to 0
                    const radii = [
                        cs.borderTopLeftRadius,
                        cs.borderTopRightRadius,
                        cs.borderBottomLeftRadius,
                        cs.borderBottomRightRadius,
                    ].map((v) => parseFloat(v) || 0);
                    const maxRadius = Math.max(...radii);
                    const r = el.getBoundingClientRect();
                    return {
                        cls: cls.slice(0, 80),
                        maxRadius,
                        w: Math.round(r.width),
                        h: Math.round(r.height),
                        bg: cs.backgroundColor,
                        inStage: !!el.closest(".stage-cell"),
                    };
                });
            });

            // ── 1. EVERY CARTOON SURFACE IS ROUNDED (computed, born-RED anchor) ──
            if (probe.length === 0) {
                fail(`${label} — zero cartoon surfaces found post-mount (vacuity guard); cannot assert rounding`);
                continue;
            }
            const square = probe.filter((s) => s.maxRadius <= 0 && s.w > 0 && s.h > 0);
            if (square.length === 0) {
                ok(
                    `${label} — all ${probe.length} cartoon surface(s) resolve a non-zero ` +
                        `border-radius (the bare square-corner card is gone): ` +
                        probe
                            .map((s) => `${Math.round(s.maxRadius)}px`)
                            .join(", "),
                );
            } else {
                for (const s of square) {
                    fail(
                        `${label} — a cartoon surface renders SQUARE corners (border-radius 0): ` +
                            `'${s.cls}' (${s.w}×${s.h}, bg:${s.bg}, inStage:${s.inStage}); ` +
                            `the bare-class \`cartoon-surface\` card must be rounded (Card \`rounded-card\`) ` +
                            `or DROPPED to full-bleed (the G2 defect)`,
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

// ── 2. THE STAGE IS FULL-BLEED (static, the G8 surface consequence) ────────────
function stripComments(src) {
    // strip /* … */ + <!-- … --> so a doc-comment quoting the dropped class is not a usage
    return src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/<!--[\s\S]*?-->/g, " ");
}

function staticHalf() {
    // the contract-named stage roots must carry NO bare-class `cartoon-surface`
    // (the stage card is DROPPED → full-bleed). The spring view-switch PILL
    // (rounded-full) lives in SpringScene's switch markup — clause 1 catches it
    // GREEN by its rounded computed radius, so we do NOT scan SpringScene's pill
    // out here; instead we assert the stage SUBJECT roots are bg-less.
    const stageRoots = [
        "demo/scenes/easing/EasingTarget.vue",
        "demo/scenes/spring/SpringTarget.vue",
        "demo/scenes/spring/StartingStyleTarget.vue",
    ];
    let stageCartoon = 0;
    for (const rel of stageRoots) {
        const p = path.join(REPO, rel);
        if (!fs.existsSync(p)) {
            fail(`static — stage root ${rel} not found`);
            continue;
        }
        const src = stripComments(fs.readFileSync(p, "utf8"));
        if (/\bcartoon-surface\b/.test(src)) {
            fail(
                `static — ${rel} still carries a \`cartoon-surface\` class in live markup; ` +
                    `the stage is FULL-BLEED (the bare cartoon card is DROPPED — G8/G2)`,
            );
            stageCartoon++;
        }
    }
    if (stageCartoon === 0) {
        ok(
            "static — the easing/spring stage roots (EasingTarget/SpringTarget/StartingStyleTarget) " +
                "carry zero bare-class `cartoon-surface` (full-bleed; no square card to round)",
        );
    }
}

staticHalf();
await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:scene-card-rounded — FAIL (${failures.length}): a kf-owned scene surface ` +
            `renders square corners (a bare un-rounded \`cartoon-surface\` card) — H.W10 G2.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:scene-card-rounded — PASS: every cartoon surface in the easing/spring scenes resolves " +
        "a non-zero border-radius (rounded-card sidebar + rounded-full pill), and the stage roots are " +
        "full-bleed (no square card) — H.W10 G2.",
);
