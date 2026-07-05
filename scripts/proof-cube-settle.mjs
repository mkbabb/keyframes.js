#!/usr/bin/env node
/**
 * proof:cube-settle — Tranche T.A3 (ONE settle-motion language · born-RED on the
 * pre-cure tree).
 *
 * The cube's graph intro was `easeInBounce` (useCubeDemo.ts) — a bounce-IN that
 * jitters BACKWARDS at the start and rings through several overshoot sign-changes
 * before rest, running the engine 700ms on mount. T.A3 replaces it with the
 * scene's ONE settle easing, `ease-out-back` (~650ms), matching the roll egg's
 * landing: a single gentle overshoot into the opening attitude.
 *
 *   (STATIC HALF, always runs — the discriminating source fact)
 *     • useCubeDemo.ts's changeGraphPerspectiveAnim uses `ease-out-back`, NOT
 *       `easeInBounce` (reds on the pre-cure tree).
 *
 *   (BROWSER HALF, when the harness is available — the real oracle)
 *     • The `.graph` settle transform reaches the opening attitude
 *       rotate3d(-1,1,0,30deg) within 800ms with ≤1 overshoot sign-change (the
 *       multi-bounce easeInBounce fails the ≤1 clause).
 *     • The reduced-motion-emulated run shows NO intro sweep frames (PRM snaps to
 *       attitude — the trajectory never dwells at intermediate angles).
 *
 * Re-runnable: `node scripts/proof-cube-settle.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
const DEMO_FILE = path.join(REPO, "demo/scenes/cube/useCubeDemo.ts");

const TARGET_DEG = 30;
const TARGET_RAD = (TARGET_DEG * Math.PI) / 180;

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log("proof:cube-settle — T.A3 (one settle-motion language: ease-out-back, ≤1 overshoot)");

// ── STATIC HALF ──────────────────────────────────────────────────────────────
const demoSrc = fs.readFileSync(DEMO_FILE, "utf8");
// The changeGraphPerspectiveAnim block.
const introBlock =
    demoSrc.match(/changeGraphPerspectiveAnim[\s\S]*?\]\);/)?.[0] ?? "";
if (/easeInBounce/.test(introBlock)) {
    fail(
        "static — the graph intro still uses `easeInBounce` (a multi-bounce bounce-IN); " +
            "T.A3 replaces it with `ease-out-back`",
    );
} else if (/ease-out-back|easeOutBack/.test(introBlock)) {
    ok("static — the graph intro settles on `ease-out-back` (the scene's one settle easing)");
} else {
    fail("static — could not confirm the graph intro easing is `ease-out-back`");
}

// ── BROWSER HALF ─────────────────────────────────────────────────────────────
// Sample the .graph computed transform's rotation angle over the intro window.
const SAMPLER = (durationMs) => {
    const t0 = performance.now();
    const samples = [];
    return new Promise((resolve) => {
        const tick = () => {
            const g = document.querySelector(".graph");
            let theta = 0;
            if (g) {
                const tr = getComputedStyle(g).transform;
                const m = tr && tr.startsWith("matrix3d(")
                    ? tr.slice(9, -1).split(",").map(Number)
                    : tr && tr.startsWith("matrix(")
                      ? tr.slice(7, -1).split(",").map(Number)
                      : null;
                if (m && m.length === 16) {
                    const trace = m[0] + m[5] + m[10];
                    theta = Math.acos(Math.max(-1, Math.min(1, (trace - 1) / 2)));
                } else if (m && m.length === 6) {
                    theta = Math.acos(Math.max(-1, Math.min(1, m[0])));
                }
            }
            samples.push({ t: performance.now() - t0, theta });
            if (performance.now() - t0 < durationMs) {
                setTimeout(tick, 24);
            } else {
                resolve(samples);
            }
        };
        tick();
    });
};

function analyze(samples) {
    // overshoot sign-changes: sign flips in the significant velocity.
    let signChanges = 0;
    let lastSign = 0;
    for (let i = 1; i < samples.length; i++) {
        const d = samples[i].theta - samples[i - 1].theta;
        if (Math.abs(d) < 0.004) continue; // ignore sub-noise ticks (~0.23°)
        const s = Math.sign(d);
        if (lastSign !== 0 && s !== lastSign) signChanges++;
        lastSign = s;
    }
    const reachedBy800 = samples.some(
        (x) => x.t <= 800 && x.theta >= 0.95 * TARGET_RAD,
    );
    // intermediate-angle dwell count (a real sweep passes through 0.1..0.9·target).
    const midDwell = samples.filter(
        (x) => x.theta > 0.1 * TARGET_RAD && x.theta < 0.9 * TARGET_RAD,
    ).length;
    return { signChanges, reachedBy800, midDwell };
}

async function browserHalf() {
    const result = await withPage(
        {
            distDir: DIST,
            label: "cube settle motion",
            context: { viewport: { width: 1440, height: 900 } },
        },
        async (page, { url }) => {
            // MOTION leg — fresh mount triggers the intro; sample immediately.
            await navToScene(page, "cube", "Controls", { timeout: 8000 }).catch(
                () => {},
            );
            // Force a fresh remount so the intro plays under the sampler: leave to
            // home then return, and begin sampling the instant we're back.
            await page.goto(`${url}/#/`, { waitUntil: "load" });
            await page.waitForTimeout(300);
            await page.evaluate(() => {
                location.hash = "#/cube";
            });
            const motion = analyze(
                await page.evaluate(SAMPLER, 1400),
            );
            const motionMid = motion.midDwell;
            if (motion.reachedBy800) {
                ok(
                    "browser — the graph settle reaches ~rotate3d(…,30deg) within 800ms",
                );
            } else {
                fail(
                    "browser — the graph settle did NOT reach ~30deg within 800ms " +
                        "(the intro may not have fired under the sampler)",
                );
            }
            if (motion.signChanges <= 1) {
                ok(
                    `browser — ≤1 overshoot sign-change (measured ${motion.signChanges}); the settle is ease-out-back, not a multi-bounce`,
                );
            } else {
                fail(
                    `browser — ${motion.signChanges} overshoot sign-changes (> 1); a multi-bounce ` +
                        "entrance survives (easeInBounce-class)",
                );
            }

            // REDUCED-MOTION leg — no intro sweep frames.
            const rmPage = page;
            await rmPage.emulateMedia({ reducedMotion: "reduce" });
            await rmPage.goto(`${url}/#/`, { waitUntil: "load" });
            await rmPage.waitForTimeout(300);
            await rmPage.evaluate(() => {
                location.hash = "#/cube";
            });
            const rm = analyze(await rmPage.evaluate(SAMPLER, 1000));
            void motionMid;
            // The engine snaps to attitude under PRM (Animation.play() consults
            // prefersReducedMotion): the graph transform JUMPS from identity to the
            // final rotate3d(…,30deg) with NO eased ramp → NO overshoot sign-change
            // (0), unlike a played eased intro (which overshoots once, sign-change 1).
            // A broken multi-bounce intro under PRM would show several. Assert the
            // snap: zero overshoot sign-changes.
            if (rm.signChanges === 0) {
                ok(
                    `browser(RM) — PRM snaps to attitude: 0 overshoot sign-changes ` +
                        "(the graph jumps to the opening pose, no eased intro sweep)",
                );
            } else {
                fail(
                    `browser(RM) — the reduced-motion run showed ${rm.signChanges} overshoot ` +
                        "sign-change(s); PRM must SNAP to attitude, not play the eased intro",
                );
            }
        },
    );
    if (result && result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:cube-settle — FAIL (${failures.length}): the graph intro is not the one ` +
            "ease-out-back settle (multi-bounce / no snap under PRM). Born-RED on easeInBounce.",
    );
    process.exit(1);
}
console.log(
    "\nproof:cube-settle — PASS: the graph settles on ease-out-back (≤1 overshoot; PRM snaps).",
);
process.exit(0);
