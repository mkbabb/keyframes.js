#!/usr/bin/env node
/**
 * proof:motion-path-scale — S.G2 S1 (the traveller-scaling correctness oracle;
 * fold row 68). The RUNTIME bite the source-shape proof:motion-path structurally
 * could not make (it greps the factory shape, never the RENDERED containment).
 *
 * THE DEFECT. The MotionPath traveller rides a CSS `offset-path` authored in the
 * `0..VIEW` (400) user-unit viewBox, but a CSS `offset-path` on an absolutely-
 * positioned <div> resolves in STAGE PIXELS — NOT viewBox units. The SVG guide
 * <path> auto-scales its `0 0 VIEW VIEW` viewBox to fill the stage; the traveller
 * does not, so on any stage narrower than VIEW px (the mobile 375px width) the
 * unscaled author path runs off the plate and the creature DETACHES from the
 * guide, escaping the stage card (the user-visible defect).
 *
 * THE ORACLE (runtime, T1/T8 — SPEC §3 S.G2, sg-#6 named oracle). At 375×667,
 * across the FULL offset-distance sweep (Home → 20 keyboard steps → 1.0), the
 * traveller's rendered rect is CONTAINED within the stage rect
 * (`.mp-traveller` ⊂ `.mp-stage`). The sweep GUARANTEES sampling the path's
 * rightmost extreme (author x=340), the coordinate that escapes a sub-VIEW stage.
 *
 * BORN-RED WITNESS. On the UNSCALED tree the traveller's author-unit offset-path
 * runs to x≈340px on a ~250–300px stage → its rect escapes the plate at the
 * extreme → RED. After the S.G2 S1 fix (`scalePathD(d, stageSide/VIEW)` + a
 * ResizeObserver re-writing the live `offset-path`) the traveller tracks the
 * auto-scaled guide → contained at every sample → GREEN. Plant: drop the scale
 * (write the author `d` back onto the offset-path) → the traveller escapes → REDs.
 * Non-vacuity: the gate also asserts the traveller ACTUALLY SWEPT (its left edge
 * spanned a real range) — a keyboard-inert traveller that never left rest cannot
 * pass vacuously.
 *
 * Re-runnable: `node scripts/proof-motion-path-scale.mjs`. Serves the BUILT
 * dist/gh-pages/ (run `npm run gh-pages` first). Under KF_REQUIRE_BROWSER a
 * playwright-absent skip becomes a hard fail at the lib seam.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const fail = (l) => {
    failures.push(l);
    console.error(`  ✗ ${l}`);
};

console.log(
    "proof:motion-path-scale — S.G2 S1: the traveller rect ⊂ the stage rect at 375×667 across the full offset-distance sweep (fold row 68)",
);

async function browserHalf() {
    const result = await withPage(
        {
            distDir: DIST,
            label: "the motion-path traveller-containment oracle (375×667)",
            // The mobile width where an unscaled 0..VIEW-px offset-path escapes a
            // sub-VIEW stage — the exact defect viewport.
            context: { viewport: { width: 375, height: 667 } },
        },
        async (page, { url }) => {
            await page.goto(`${url}/#/motion-path`, { waitUntil: "load" });
            // motion-path renders NO control panel — expected trigger null.
            await navToScene(page, "motion-path", null, { timeout: 12000 });
            const ready = await page
                .waitForFunction(
                    () => {
                        const s = document.querySelector(".mp-stage");
                        const t = document.querySelector(".mp-traveller");
                        if (!s || !t) return false;
                        const sr = s.getBoundingClientRect();
                        const tr = t.getBoundingClientRect();
                        return (
                            sr.width > 0 &&
                            sr.height > 0 &&
                            tr.width > 0 &&
                            tr.height > 0
                        );
                    },
                    { timeout: 8000 },
                )
                .then(() => true)
                .catch(() => false);
            if (!ready) {
                fail(
                    "the motion-path stage/traveller never painted at 375×667 (the FSM may not have rested on motion-path)",
                );
                return;
            }

            // Focus the traveller (role="slider") and scrub it across the FULL
            // sweep via its keyboard handler (Home → 0, then 20 ArrowRight steps of
            // 0.05 → 1.0), sampling the rendered traveller rect vs the stage rect at
            // each offset-distance. In-page KeyboardEvent dispatch (not page.keyboard)
            // so the sweep never depends on OS-level focus in headless. offset-distance
            // is applied synchronously by the group scrub render, but we settle a frame
            // between the press and the measure so layout reflects the new position.
            const TOL = 1.5; // sub-pixel rounding allowance
            const press = (key) =>
                page.evaluate((k) => {
                    const t = document.querySelector(".mp-traveller");
                    if (!t) return;
                    t.focus();
                    t.dispatchEvent(
                        new KeyboardEvent("keydown", {
                            key: k,
                            bubbles: true,
                            cancelable: true,
                        }),
                    );
                }, key);
            const measure = () =>
                page.evaluate(() => {
                    const s = document.querySelector(".mp-stage");
                    const t = document.querySelector(".mp-traveller");
                    if (!s || !t) return null;
                    const sr = s.getBoundingClientRect();
                    const tr = t.getBoundingClientRect();
                    return {
                        s: { l: sr.left, t: sr.top, r: sr.right, b: sr.bottom },
                        t: {
                            l: tr.left,
                            t: tr.top,
                            r: tr.right,
                            b: tr.bottom,
                            w: tr.width,
                            h: tr.height,
                        },
                    };
                });

            await press("Home");
            await page.waitForTimeout(60);

            let sampled = 0;
            let contained = 0;
            let worst = null;
            let minLeft = Infinity;
            let maxLeft = -Infinity;
            for (let step = 0; step <= 20; step++) {
                if (step > 0) await press("ArrowRight");
                await page.waitForTimeout(40);
                const m = await measure();
                if (!m) continue;
                sampled++;
                minLeft = Math.min(minLeft, m.t.l);
                maxLeft = Math.max(maxLeft, m.t.l);
                const inside =
                    m.t.l >= m.s.l - TOL &&
                    m.t.r <= m.s.r + TOL &&
                    m.t.t >= m.s.t - TOL &&
                    m.t.b <= m.s.b + TOL;
                if (inside) {
                    contained++;
                } else {
                    const escape = Math.max(
                        m.s.l - m.t.l,
                        m.t.r - m.s.r,
                        m.s.t - m.t.t,
                        m.t.b - m.s.b,
                    );
                    if (!worst || escape > worst.escape) {
                        worst = { step, escape, t: m.t, s: m.s };
                    }
                }
            }

            // Non-vacuity: the traveller must have SWEPT (a real left-edge range),
            // else a keyboard-inert traveller parked at a contained rest pose would
            // pass without ever exercising the escaping extreme.
            const swept = sampled > 0 && maxLeft - minLeft >= 8;
            if (!swept) {
                fail(
                    `the traveller did NOT sweep across the keyboard scrub (left-edge range ` +
                        `${(maxLeft - minLeft).toFixed(1)}px < 8px over ${sampled} samples) — the ` +
                        `containment oracle cannot be exercised (the extreme was never sampled). ` +
                        `The keyboard scrub (role=slider ArrowRight) must move the traveller.`,
                );
                return;
            }

            if (contained === sampled) {
                ok(
                    `traveller ⊂ stage across ALL ${sampled} sweep samples at 375×667 ` +
                        `(left-edge swept ${Math.round(minLeft)}→${Math.round(maxLeft)}px; the rendered ` +
                        `rect stays inside the plate at every offset-distance — scalePathD + ` +
                        `ResizeObserver hold, S.G2 S1)`,
                );
            } else {
                fail(
                    `traveller ESCAPES the stage at 375×667 — only ${contained}/${sampled} sweep ` +
                        `samples contained; worst escape ${worst ? worst.escape.toFixed(1) : "?"}px at ` +
                        `step ${worst?.step} (trav ${JSON.stringify(worst?.t)} vs stage ` +
                        `${JSON.stringify(worst?.s)}). The unscaled author offset-path (0..VIEW px) runs ` +
                        `off a sub-VIEW stage — scale the live offset-path by stageSide/VIEW (S.G2 S1, fold row 68).`,
                );
            }
        },
    );
    if (result.skipped) console.log(`  ○ browser half skipped — ${result.reason}`);
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:motion-path-scale — FAIL (${failures.length}): the motion-path traveller detaches from ` +
            `the stage at 375px (its CSS offset-path is not scaled to the rendered stage — fold row 68).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:motion-path-scale — PASS: the motion-path traveller stays ⊂ the stage rect across the full " +
        "offset-distance sweep at 375×667 (scalePathD + ResizeObserver scale the live offset-path to the rendered stage — S.G2 S1).",
);
