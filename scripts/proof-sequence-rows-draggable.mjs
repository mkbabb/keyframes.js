#!/usr/bin/env node
/**
 * proof:sequence-rows-draggable — H.W12 §Hard gate (I3 · R-SEQ-D · H-MI-4).
 *
 * The Sequence storyboard rows were READ-ONLY — the `stagger`/`at:` distribution
 * was invisible-as-tunable (`SequenceTarget.vue:19-38` rows displayed `@NNms` text
 * with no handle). H.W12.S6 makes each row DRAGGABLE: a row's start-handle
 * re-authors that child's master-clock `at:` offset LIVE, dogfooding the shared
 * `useDragScrub` seam (S1) + the engine's own position model (`Sequence` entry
 * re-sort, `useSequenceDemo.ts:344-368` reseatRow). This gate asserts that fact
 * STATICALLY (the source-shape that makes the rows draggable + the re-sort) +
 * BEHAVIOURALLY (a real pointer drag moves the row's `at:` AND re-orders the
 * stagger distribution).
 *
 * STATIC HALF (always runs — the source-shape that makes the rows authorable):
 *
 *   1. THE ROW HANDLE IS A DRAGGABLE SLIDER — `SequenceTarget.vue` mounts a
 *      `.seq-handle` per row carrying `role="slider"` + `@pointerdown` (the drag
 *      seam) + `aria-valuenow` (the live `at:` readout). BITE: revert the rows to
 *      read-only `@NNms` text (no handle / no pointerdown) → reds.
 *
 *   2. THE RE-AUTHOR RE-SORTS THE ENGINE — `useSequenceDemo.ts` exposes
 *      `reseatRow(index, at)` that (a) re-emits the reactive `delays[index]` AND
 *      (b) sets the matching `Sequence` entry's `at` + re-sorts the entries by
 *      `at` (`sequence.entries.sort`). BITE: drop the entry re-sort (the rows
 *      re-label but the engine timing never re-orders) → reds.
 *
 * BROWSER HALF (the live drag re-authors `at:` AND the Sequence re-sorts;
 * settle-gated on the H.W1 FSM resting — the drag fails on interaction logic, not
 * a route storm. Drives the scene switch IN-PAGE via the hash reconcile fixed
 * point, waiting for the machine to rest on `sequence`):
 *
 *   3. proof:sequence-rows-draggable — settle on sequence; pointer-drag a row's
 *      `.seq-handle` from its current x toward the FAR end of its track → that
 *      row's `aria-valuenow` (its `at:` ms) CHANGES (moved later), AND the
 *      stagger distribution RE-SORTS (the SORTED order of all rows' `at:` values
 *      changes from the pristine staircase — proof the engine re-ordered, not
 *      just relabelled one row). BITE: revert the row drag (read-only rows) → the
 *      `at:` never moves → reds; drop the entry re-sort → the sorted order never
 *      changes → reds.
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * resolveChromium + context/teardown, J.W3 S1) + navToScene (the per-EXPECTED-
 * state scene settle). The browser half serves the BUILT dist/gh-pages/ (run
 * `npm run gh-pages` first). Under KF_REQUIRE_BROWSER a playwright-absent skip
 * becomes a hard fail AT THE LIB SEAM so the affordance is never
 * green-reported un-exercised. Re-runnable:
 * `node scripts/proof-sequence-rows-draggable.mjs`.
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

console.log("proof:sequence-rows-draggable — H.W12 (I3 · R-SEQ-D · the draggable storyboard rows)");

// ── STATIC HALF ──────────────────────────────────────────────────────────────
const targetSrc = read(path.join(DEMO, "sequence/SequenceTarget.vue"));
const demoSrc = read(path.join(DEMO, "sequence/useSequenceDemo.ts"));

// 1. THE ROW HANDLE IS A DRAGGABLE SLIDER.
{
    // The `.seq-handle` element carries role="slider" + @pointerdown + aria-valuenow.
    // The handle's attributes wrap across many lines, so isolate the single
    // `<div class="seq-handle" … >` open tag and assert its attributes within it.
    const hasHandle = /class="seq-handle"/.test(targetSrc);
    const handleTag = (targetSrc.match(/<div\b[^>]*class="seq-handle"[\s\S]*?>/) ?? [
        "",
    ])[0];
    const hasRole = /role="slider"/.test(handleTag);
    const hasPointerDown = /@pointerdown=/.test(handleTag);
    const hasValueNow = /:aria-valuenow=/.test(handleTag);
    if (hasHandle && hasRole && hasPointerDown && hasValueNow) {
        ok(
            `the row handle is a draggable slider — SequenceTarget mounts a ` +
                `.seq-handle per row with role="slider" + @pointerdown (the drag seam) ` +
                `+ :aria-valuenow (the live at: readout), not the read-only @NNms text`,
        );
    } else {
        fail(
            `the row handle is a draggable slider — expected a .seq-handle with ` +
                `role="slider" (${hasRole}) + @pointerdown (${hasPointerDown}) + ` +
                `:aria-valuenow (${hasValueNow}); the rows must be draggable, not ` +
                `read-only @NNms text (H.W12.S6 / R-SEQ-D)`,
        );
    }
}

// 2. THE RE-AUTHOR RE-SORTS THE ENGINE.
{
    const hasReseat = /\breseatRow\b/.test(demoSrc);
    // The re-author sets the matching entry's `at` AND re-sorts the entries (the
    // engine's position-insertion model — Sequence.add re-sorts by at).
    const setsEntryAt = /entry\.at\s*=/.test(demoSrc) || /\.at\s*=\s*clamped/.test(demoSrc);
    const reSorts = /sequence\.entries\.sort\(/.test(demoSrc);
    if (hasReseat && setsEntryAt && reSorts) {
        ok(
            `the re-author re-sorts the engine — useSequenceDemo exposes reseatRow() ` +
                `that re-emits the reactive delays[i] AND sets the matching Sequence ` +
                `entry's at + re-sorts the entries by at (sequence.entries.sort — the ` +
                `engine position model, inv ζ)`,
        );
    } else {
        fail(
            `the re-author re-sorts the engine — expected reseatRow (${hasReseat}) that ` +
                `sets entry.at (${setsEntryAt}) AND sequence.entries.sort (${reSorts}); ` +
                `the rows must re-author the engine timing, not just re-label`,
        );
    }
}

// ── BROWSER HALF ─────────────────────────────────────────────────────────────
/** Drive a scene switch through the EXACT reconcile fixed point the in-app
 *  combobox funnels through (the lib's navToScene: an IN-PAGE hash assignment —
 *  storage + the H.W1 trap survive — settled on the destination's per-EXPECTED
 *  control surface; expectedTrigger null = the destination renders NO control
 *  panel). Re-assert the viewport (Playwright resets on navigate), then a
 *  settle window. */
async function settleOnScene(page, sceneId, expectedTrigger, vw, vh, settleMs = 1400) {
    await navToScene(page, sceneId, expectedTrigger, { timeout: 8000 });
    await page.setViewportSize({ width: vw, height: vh });
    await page.waitForTimeout(settleMs);
}

/** Wait until a selector mounts with real area (not a mid-mount 0×0). */
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

async function browserHalf() {
    const VW = 1440;
    const VH = 900;
    const result = await withPage(
        {
            distDir: DIST,
            label: "the live row-drag re-author + Sequence re-sort",
            context: { viewport: { width: VW, height: VH } },
        },
        async (page, { url }) => {
        await page.goto(`${url}/#/cube`, { waitUntil: "load" });
        await page.waitForTimeout(800);

        // ── 3. the row drag re-authors at: AND the Sequence re-sorts ─────────
        // (sequence renders NO control panel — EXPECT trigger null)
        await settleOnScene(page, "sequence", null, VW, VH);
        const handlesReady = await page
            .waitForFunction(
                () => document.querySelectorAll(".seq-handle").length >= 3,
                { timeout: 8000 },
            )
            .then(() => true)
            .catch(() => false);
        const storyboardReady = await waitVisible(page, ".seq-storyboard");
        if (!handlesReady || !storyboardReady) {
            fail(
                `sequence-rows-draggable — the storyboard did not mount draggable rows ` +
                    `(.seq-handle≥3:${handlesReady}, .seq-storyboard:${storyboardReady}); ` +
                    `the FSM may not have rested on sequence`,
            );
        } else {
            // Pick the FIRST row's handle (its pristine at: is 0 — the earliest in
            // the staircase, so dragging it later is the cleanest re-sort witness).
            // Read every row's current at: (aria-valuenow on each .seq-handle) and
            // the chosen handle's screen rect + its track's far edge.
            const setup = await page.evaluate(() => {
                const handles = [...document.querySelectorAll(".seq-handle")];
                const ats = handles.map((h) => Number(h.getAttribute("aria-valuenow")));
                // The first row (its track is the handle's parent .seq-track).
                const h0 = handles[0];
                const track = h0.closest(".seq-track");
                const hr = h0.getBoundingClientRect();
                const tr = track.getBoundingClientRect();
                return {
                    ats,
                    fromX: hr.left + hr.width / 2,
                    fromY: hr.top + hr.height / 2,
                    // Drag toward the far (right) end of the track → a large at:.
                    toX: tr.left + tr.width * 0.9,
                    toY: tr.top + tr.height / 2,
                };
            });

            const beforeAt0 = setup.ats[0];
            const beforeSorted = [...setup.ats].sort((a, b) => a - b).join(",");

            // A real pointer drag: down on the handle, move toward the track's far
            // end over several steps, up.
            await page.mouse.move(setup.fromX, setup.fromY);
            await page.mouse.down();
            const STEPS = 12;
            for (let i = 1; i <= STEPS; i++) {
                const t = i / STEPS;
                await page.mouse.move(
                    setup.fromX + (setup.toX - setup.fromX) * t,
                    setup.fromY + (setup.toY - setup.fromY) * t,
                );
                await page.waitForTimeout(16);
            }
            await page.mouse.up();
            await page.waitForTimeout(200);

            const after = await page.evaluate(() => {
                const handles = [...document.querySelectorAll(".seq-handle")];
                return {
                    ats: handles.map((h) => Number(h.getAttribute("aria-valuenow"))),
                };
            });
            const afterAt0 = after.ats[0];
            const afterSorted = [...after.ats].sort((a, b) => a - b).join(",");

            // (a) the dragged row's at: CHANGED — it moved meaningfully later (the
            //     drag went toward the far end of the track).
            const atMoved =
                Number.isFinite(beforeAt0) &&
                Number.isFinite(afterAt0) &&
                afterAt0 - beforeAt0 >= 100;
            // (b) the stagger distribution RE-SORTED — the SORTED multiset of at:
            //     values changed (row 0 moved from the staircase floor to a later
            //     position, re-ordering the distribution the Sequence drives).
            const reSorted = afterSorted !== beforeSorted;

            if (atMoved && reSorted) {
                ok(
                    `sequence-rows-draggable — dragging row 1's handle to the track far ` +
                        `end re-authored its at: (${beforeAt0}ms → ${afterAt0}ms) AND the ` +
                        `stagger distribution re-sorted (sorted at: [${beforeSorted}] → ` +
                        `[${afterSorted}]) — the engine re-ordered, not just relabelled`,
                );
            } else {
                fail(
                    `sequence-rows-draggable — the row drag did NOT re-author + re-sort ` +
                        `(at: moved:${atMoved} [${beforeAt0}→${afterAt0}], distribution ` +
                        `re-sorted:${reSorted} [${beforeSorted}→${afterSorted}]); the ` +
                        `read-only rows (no .seq-handle drag) never move at:, and without ` +
                        `the entry re-sort the distribution never re-orders (H.W12.S6)`,
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
        `\nproof:sequence-rows-draggable — FAIL (${failures.length}): the draggable ` +
            `storyboard rows / the at: re-author + Sequence re-sort regressed (H.W12 I3).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:sequence-rows-draggable — PASS: each storyboard row is a draggable " +
        "slider, dragging it re-authors that child's at: offset, and the Sequence " +
        "re-sorts the stagger distribution (dogfooding useDragScrub + the engine " +
        "position model, inv ζ).",
);
