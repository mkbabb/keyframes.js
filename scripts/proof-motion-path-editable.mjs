#!/usr/bin/env node
/**
 * proof:motion-path-editable — H.W12 §Hard gate (I3 · R-MP-B · the F4 elevation).
 *
 * The MotionPath author path was FIXED — `PATH_D` was a frozen `d` literal; the
 * traveller could be scrubbed ALONG the path but the path itself could not be
 * SHAPED (the W5 drag scrubbed DISTANCE on a fixed loop). H.W12.S6 makes the path
 * EDITABLE: the cubic's control points are draggable SVG handles, and the geometry
 * is single-sourced (`motionPathGeometry.ts` — a control net compiled to ONE `d`
 * by `buildPathD`). A handle drag re-emits `PATH_D`, and BOTH the guide `<path>`
 * `d` AND the traveller's CSS `offset-path` re-read it in LOCKSTEP — the
 * single-source invariant guarantees no drift. This gate asserts that fact
 * STATICALLY (the single-source compiler + the lockstep re-emit) + BEHAVIOURALLY
 * (a real handle drag moves BOTH to the SAME new `d`).
 *
 * STATIC HALF (always runs — the single-source structure that makes no-drift true):
 *
 *   1. THE PATH IS A SINGLE-SOURCE CONTROL NET — `motionPathGeometry.ts` is no
 *      longer a frozen const: it exports a control net (`DEFAULT_POINTS`) + a
 *      `buildPathD()` compiler that derives the ONE `d`; `PATH_D` is
 *      `buildPathD(DEFAULT_POINTS)` (the net compiled). BITE: re-freeze `PATH_D`
 *      to a literal string (no net, no compiler) → reds.
 *
 *   2. THE GUIDE + TRAVELLER RE-READ THE ONE SOURCE IN LOCKSTEP — the guide
 *      `<path>` binds `:d="demo.pathD…"` (reactive) AND the gesture composable
 *      `watch(pathD)` re-writes the traveller's `offset-path` to the SAME `d`
 *      (`el.style.offsetPath = …`). So a control-net mutation re-emits to BOTH.
 *      BITE: drop the `watch(pathD)` traveller re-write (the guide re-shapes but
 *      the traversal stays on the stale geometry — drift) → reds.
 *
 * BROWSER HALF (the live handle drag re-shapes BOTH the guide `d` AND the
 * traveller `offset-path` to the SAME new `d`; settle-gated on the H.W1 FSM
 * resting. Drives the scene switch IN-PAGE via the hash reconcile fixed point,
 * waiting for the machine to rest on `motion-path`):
 *
 *   3. proof:motion-path-editable — settle on motion-path; capture the guide
 *      `.mp-guide-path` `d` AND the traveller's computed `offset-path` BEFORE,
 *      pointer-drag a `.mp-handle` control point by a visible delta, then capture
 *      BOTH AFTER. Assert (a) the guide `d` CHANGED, (b) the traveller's computed
 *      `offset-path` CHANGED, and (c) they changed TO THE SAME `d` (the inner
 *      `path('…')` string of the traveller's offset-path equals the guide's `d`).
 *      BITE: re-freeze the path (handles inert) → neither `d` moves → reds; drop
 *      the lockstep re-write → the guide moves but the traveller's offset-path
 *      stays stale (they DIFFER) → reds (the no-drift invariant is the point).
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * resolveChromium + context/teardown, J.W3 S1) + navToScene (the per-EXPECTED-
 * state scene settle). The browser half serves the BUILT dist/gh-pages/ (run
 * `npm run gh-pages` first). Under KF_REQUIRE_BROWSER a playwright-absent skip
 * becomes a hard fail AT THE LIB SEAM. Re-runnable:
 * `node scripts/proof-motion-path-editable.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");

console.log("proof:motion-path-editable — H.W12 (I3 · R-MP-B · the editable path, single-source)");

// ── STATIC HALF ──────────────────────────────────────────────────────────────
const geomSrc = read(path.join(DEMO, "scenes/motion-path/motionPathGeometry.ts"));
const targetSrc = read(path.join(DEMO, "scenes/motion-path/MotionPathTarget.vue"));
const gestureSrc = read(path.join(DEMO, "scenes/motion-path/useMotionPathGesture.ts"));

// 1. THE PATH IS A SINGLE-SOURCE CONTROL NET.
{
    const hasNet = /export const DEFAULT_POINTS\b/.test(geomSrc);
    const hasCompiler = /export function buildPathD\b/.test(geomSrc);
    // PATH_D derives from the net via the compiler (NOT a frozen literal).
    const pathDFromNet = /export const PATH_D\s*=\s*buildPathD\(/.test(geomSrc);
    if (hasNet && hasCompiler && pathDFromNet) {
        ok(
            `the path is a single-source control net — motionPathGeometry exports ` +
                `DEFAULT_POINTS + buildPathD(), and PATH_D = buildPathD(DEFAULT_POINTS) ` +
                `(the net compiled to ONE d, not a frozen literal)`,
        );
    } else {
        fail(
            `the path is a single-source control net — expected DEFAULT_POINTS ` +
                `(${hasNet}) + buildPathD() (${hasCompiler}) + PATH_D = buildPathD(…) ` +
                `(${pathDFromNet}); the path must be a draggable net, not a frozen ` +
                `const (H.W12.S6 / R-MP-B)`,
        );
    }
}

// 2. THE GUIDE + TRAVELLER RE-READ THE ONE SOURCE IN LOCKSTEP.
{
    // The guide <path> binds :d to the reactive pathD.
    const guideBinds = /<path\b[\s\S]*?:d="demo\.pathD/.test(targetSrc);
    // The gesture composable watches pathD and re-writes the traveller offset-path.
    const watchesPathD = /watch\(\s*\(\)\s*=>\s*demo\.pathD/.test(gestureSrc);
    const rewritesOffsetPath = /\.style\.offsetPath\s*=/.test(gestureSrc);
    if (guideBinds && watchesPathD && rewritesOffsetPath) {
        ok(
            `the guide + traveller re-read the ONE source in lockstep — the guide ` +
                `<path> binds :d="demo.pathD" (reactive) AND the gesture composable ` +
                `watch(pathD) re-writes the traveller's offset-path to the SAME d ` +
                `(no drift by construction)`,
        );
    } else {
        fail(
            `the guide + traveller re-read the ONE source in lockstep — expected the ` +
                `guide :d="demo.pathD" (${guideBinds}) + a watch(pathD) (${watchesPathD}) ` +
                `that re-writes the traveller .style.offsetPath (${rewritesOffsetPath}); ` +
                `both consumers must re-read the single source (H.W12.S6)`,
        );
    }
}

// ── BROWSER HALF ─────────────────────────────────────────────────────────────
/** Drive a scene switch via the lib's navToScene (per-EXPECTED-state settle;
 *  expectedTrigger null = the destination renders NO control panel), re-assert
 *  the viewport, then a settle window. */
async function settleOnScene(page, sceneId, expectedTrigger, vw, vh, settleMs = 1400) {
    await navToScene(page, sceneId, expectedTrigger, { timeout: 8000 });
    await page.setViewportSize({ width: vw, height: vh });
    await page.waitForTimeout(settleMs);
}

async function waitVisible(page, selector, timeout = 8000) {
    return page
        .waitForFunction(
            (sel) => {
                const el = document.querySelector(sel);
                if (!el) return false;
                const r = el.getBoundingClientRect();
                return r.width > 0 && r.height > 0;
            },
            selector,
            { timeout },
        )
        .then(() => true)
        .catch(() => false);
}

/** Normalize an offset-path / d string for GEOMETRIC comparison: extract the
 *  inner path data from `path("…")` / `path('…')` if present, then canonicalize
 *  the SVG path-data tokenization — the guide `d` keeps the AUTHORED comma
 *  separators (`200 320, 340 320`) while the browser's computed `offset-path`
 *  serializes the SAME geometry comma-free (`200 320 340 320`). Both are the same
 *  path; commas in SVG path data are pure whitespace, so we treat them as such
 *  (replace commas → spaces, collapse whitespace) — the no-drift invariant is
 *  GEOMETRIC equality, not byte equality of two browsers' serializations. */
function extractPathData(v) {
    if (!v) return "";
    const m = String(v).match(/path\(\s*["']?([^"')]*)["']?\s*\)/i);
    const data = m ? m[1] : String(v);
    return data
        .replace(/,/g, " ") // SVG path commas are whitespace — canonicalize
        .replace(/\s+/g, " ")
        .trim();
}

async function browserHalf() {
    const VW = 1440;
    const VH = 900;
    const result = await withPage(
        {
            distDir: DIST,
            label: "the live handle-drag lockstep re-shape",
            context: { viewport: { width: VW, height: VH } },
        },
        async (page, { url }) => {
        await page.goto(`${url}/#/cube`, { waitUntil: "load" });
        await page.waitForTimeout(800);

        // ── 3. the handle drag re-shapes BOTH the guide d AND offset-path ────
        // (motion-path renders NO control panel — EXPECT trigger null)
        await settleOnScene(page, "motion-path", null, VW, VH);
        const guideReady = await waitVisible(page, ".mp-guide-path");
        const travellerReady = await waitVisible(page, ".mp-traveller");
        const handlesReady = await page
            .waitForFunction(
                () => document.querySelectorAll(".mp-handle").length >= 3,
                { timeout: 8000 },
            )
            .then(() => true)
            .catch(() => false);
        if (!guideReady || !travellerReady || !handlesReady) {
            fail(
                `motion-path-editable — the editable stage did not mount ` +
                    `(.mp-guide-path:${guideReady}, .mp-traveller:${travellerReady}, ` +
                    `.mp-handle≥3:${handlesReady}); the FSM may not have rested on motion-path`,
            );
        } else {
            const before = await page.evaluate(() => {
                const guide = document.querySelector(".mp-guide-path");
                const traveller = document.querySelector(".mp-traveller");
                // Pick a CONTROL handle (off the path) so dragging it visibly
                // re-shapes the cubic; fall back to the first handle.
                const handles = [...document.querySelectorAll(".mp-handle")];
                const handle =
                    handles.find((h) => h.classList.contains("mp-handle--control")) ??
                    handles[0];
                const hr = handle.getBoundingClientRect();
                return {
                    guideD: guide.getAttribute("d"),
                    offsetPath: getComputedStyle(traveller).offsetPath,
                    handleX: hr.left + hr.width / 2,
                    handleY: hr.top + hr.height / 2,
                };
            });

            // Drag the handle by a visible delta (well clear of its hit radius).
            const dx = 80;
            const dy = -60;
            await page.mouse.move(before.handleX, before.handleY);
            await page.mouse.down();
            const STEPS = 12;
            for (let i = 1; i <= STEPS; i++) {
                const t = i / STEPS;
                await page.mouse.move(
                    before.handleX + dx * t,
                    before.handleY + dy * t,
                );
                await page.waitForTimeout(16);
            }
            await page.mouse.up();
            await page.waitForTimeout(250);

            const after = await page.evaluate(() => {
                const guide = document.querySelector(".mp-guide-path");
                const traveller = document.querySelector(".mp-traveller");
                return {
                    guideD: guide.getAttribute("d"),
                    offsetPath: getComputedStyle(traveller).offsetPath,
                };
            });

            const guideChanged = after.guideD !== before.guideD;
            const offsetChanged = after.offsetPath !== before.offsetPath;
            // The no-drift invariant: the traveller's offset-path inner path data
            // EQUALS the guide's new d (both re-read the ONE single source).
            const afterGuideData = extractPathData(after.guideD);
            const afterOffsetData = extractPathData(after.offsetPath);
            const sameSource =
                afterGuideData.length > 0 && afterGuideData === afterOffsetData;

            if (guideChanged && offsetChanged && sameSource) {
                ok(
                    `motion-path-editable — dragging a control handle re-shaped the guide ` +
                        `d AND the traveller's offset-path, BOTH to the SAME new d (no drift). ` +
                        `guide d "…${afterGuideData.slice(-40)}" === offset-path inner ` +
                        `"…${afterOffsetData.slice(-40)}" — the single-source PATH_D invariant`,
                );
            } else {
                fail(
                    `motion-path-editable — the handle drag did NOT re-shape both in ` +
                        `lockstep (guide d changed:${guideChanged}, offset-path ` +
                        `changed:${offsetChanged}, same-source:${sameSource}). ` +
                        `Guide data "…${afterGuideData.slice(-50)}" vs offset-path data ` +
                        `"…${afterOffsetData.slice(-50)}". A frozen path leaves both ` +
                        `unchanged; a missing lockstep re-write leaves the traveller on the ` +
                        `stale geometry (they drift) — the single-source invariant fails`,
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
        `\nproof:motion-path-editable — FAIL (${failures.length}): the editable path / ` +
            `the single-source PATH_D lockstep invariant regressed (H.W12 I3).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:motion-path-editable — PASS: the path is a draggable single-source " +
        "control net; dragging a control handle re-shapes BOTH the guide <path> d AND " +
        "the traveller's offset-path to the SAME new d (the no-drift PATH_D invariant).",
);
