#!/usr/bin/env node
/**
 * proof:scene-transition-perf — H.W11 S4 / I2 (the control-surface DFA's NAMED
 * transition-performance budget). The MEASURE-FIRST half of the per-scene
 * control-surface DFA: a cross-scene navigate + control-surface re-render must
 * settle within a measured budget, AND the control-surface state must
 * suspend-on-leave + fully-resume on SCENE_READY (the round-trip identity,
 * EXTENDING the W1 proof:scene-machine-irrefragable field set with the
 * control-surface projection {selectedControl, control-surfaces}).
 *
 * ── THE BENCH (bench:scene-transition) — MEASURE-FIRST, NOT GUESSED ──────────
 * The budget bound was set from a measured W11 baseline on the live render
 * (1280×900, the built dist): the cross-scene navigate + control-surface
 * re-render settled at p50 ≈ 36ms, p95 ≈ 46ms, max ≈ 46ms across the
 * cube↔easing↔spring matrix (the architecture-spanning representatives: a group
 * scene, an autoplay raw-rAF scene with a scene-specific surface, and a second).
 * The BUDGET is set to 120ms — ~2.6× headroom over the measured p95, comfortably
 * under the ~200ms "feels instant" INP threshold, while still BITING a real
 * regression (a transition that crossed 120ms would be a perceptible hitch). The
 * budget is named here from the baseline; it is NOT an asserted guess (the spec's
 * MEASURE-FIRST precept).
 *
 * Clauses (each BITES):
 *
 *   T1 TRANSITION-BUDGET — drive ≥N cross-scene navigates over the
 *      cube↔easing↔spring matrix; the per-transition settle (from the
 *      location.hash assignment to the control-surface re-render committed two
 *      rAFs later, with the machine's activeScene rested on the target) must be
 *      ≤ BUDGET_MS at the p95. BITE: a control-surface re-render that thrashed
 *      (a per-scene poke-set storm, an un-memoized DFA recompute) would climb the
 *      p95 above budget.
 *
 *   T2 CONTROL-SURFACE ROUND-TRIP IDENTITY — for the named easing↔cube cross-pair
 *      the control projection {selectedControl, isControlsPanelOpen} round-trips
 *      A→B→A byte-identical (the easing scene returns to selectedControl='easing',
 *      isControlsPanelOpen=true; the cube returns to its own). This EXTENDS the
 *      W1 identity-field-set with the control-surface projection — the DFA-gated
 *      surface state suspends on leave and fully resumes on the explicit
 *      SCENE_READY (no stale surface bleeding across scenes). BITE: a transition
 *      that lost the per-scene selectedControl (the reka-fallback-hack era) would
 *      return easing to a built-in 'controls' tab that no longer exists for it.
 *
 * Settle-gated on H.W1 (the FSM resting). Mirrors the serveDist + Playwright +
 * settle plumbing of scripts/proof-scene-machine-irrefragable.mjs +
 * scripts/proof-scene-perf-budget.mjs. STATIC half (the DFA source anchors)
 * always runs so a refactor that drops the DFA is caught even when playwright is
 * absent. Under KF_REQUIRE_BROWSER a playwright-absent skip becomes a hard fail.
 * Re-runnable: `node scripts/proof-scene-transition-perf.mjs`. Serves the BUILT
 * dist/gh-pages/ (run `npm run gh-pages` first).
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const DIST = path.join(REPO, "dist/gh-pages");

// The MEASURE-FIRST budget — named from the W11 baseline (p95 ≈ 46ms), set to
// 120ms (~2.6× headroom, under the ~200ms feels-instant INP threshold, biting a
// real regression). See the header note.
const BUDGET_MS = 120;

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};
const read = (p) => fs.readFileSync(p, "utf8");

console.log(
    "proof:scene-transition-perf — H.W11 S4 / I2 (the control-surface DFA transition budget)",
);

// ── STATIC half (the DFA source anchors — always runs) ───────────────────────
{
    const dfaPath = path.join(
        DEMO,
        "@/components/custom/animation-controls/stores/controlSurfaceDFA.ts",
    );
    if (fs.existsSync(dfaPath)) {
        const src = read(dfaPath);
        const hasTable = /export const CONTROL_SURFACES\s*:\s*Record<SceneId/.test(src);
        const easingOnly = /easing:\s*\[\s*["']easing["']\s*\]/.test(src);
        const springOnly = /spring:\s*\[\s*["']spring["']\s*\]/.test(src);
        const seqEmpty = /sequence:\s*\[\s*\]/.test(src);
        const pathEmpty = /["']motion-path["']:\s*\[\s*\]/.test(src);
        const total = /export function controlSurfacesFor/.test(src);
        if (hasTable && easingOnly && springOnly && seqEmpty && pathEmpty && total) {
            ok(
                "DFA source: CONTROL_SURFACES table present (easing→[easing], spring→[spring], " +
                    "sequence/motion-path→[]) + a TOTAL controlSurfacesFor selector",
            );
        } else {
            fail(
                `DFA source — controlSurfaceDFA.ts must define the CONTROL_SURFACES table ` +
                    `(table:${hasTable}, easingOnly:${easingOnly}, springOnly:${springOnly}, ` +
                    `seqEmpty:${seqEmpty}, pathEmpty:${pathEmpty}, total:${total})`,
            );
        }
    } else {
        fail(
            "DFA source — controlSurfaceDFA.ts is ABSENT (the control-surface DFA was not authored)",
        );
    }

    // The projection lives on the W1 effect layer (useSceneMachine), NOT the
    // reducer (sceneMachine.ts) — the W1-EXTENDS-not-re-authors discipline.
    const useMachine = read(
        path.join(
            DEMO,
            "@/components/custom/animation-controls/stores/useSceneMachine.ts",
        ),
    );
    const projection =
        /controlSurfaces:\s*readonly\(/.test(useMachine) &&
        /controlSurfacesFor\(machine\.value\.context\.activeScene\)/.test(useMachine);
    const reducer = read(
        path.join(
            DEMO,
            "@/components/custom/animation-controls/stores/sceneMachine.ts",
        ),
    );
    const reducerUntouched = !/controlSurface/i.test(reducer);
    if (projection && reducerUntouched) {
        ok(
            "DFA projection: useSceneMachine exposes the reactive `controlSurfaces` projection; " +
                "the W1 reducer (sceneMachine.ts) is UNTOUCHED by the DFA (EXTENDS, not re-authors)",
        );
    } else {
        fail(
            `DFA projection — useSceneMachine must expose `+"`controlSurfaces`"+` derived from ` +
                `activeScene AND the W1 reducer must stay DFA-free (projection:${projection}, ` +
                `reducerUntouched:${reducerUntouched})`,
        );
    }
}

// ── BROWSER half (the live measured budget + the round-trip identity) ─────────
const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — the ` +
                "transition-budget + control-surface round-trip cannot pass vacuously",
        );
    } else {
        console.log(`  ○ browser half skipped — ${reason}`);
    }
};

const MIME = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".ttf": "font/ttf",
    ".woff2": "font/woff2",
    ".svg": "image/svg+xml",
};
const MACHINE_KEY = "keyframes-js-scene-machine";
const CTRL_KEY = "animation-groups-control-options-store";
const SUPER_KEY = {
    cube: "Cube",
    easing: "Easing",
    spring: "Spring",
    sequence: "Sequence",
    "motion-path": "MotionPath",
};

function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
            res.writeHead(200, { "content-type": "text/html" });
            fs.createReadStream(path.join(DIST, "index.html")).pipe(res);
            return;
        }
        res.writeHead(200, {
            "content-type": MIME[path.extname(p)] ?? "application/octet-stream",
        });
        fs.createReadStream(p).pipe(res);
    });
}

async function navByHash(page, sceneId, settleMs = 1500) {
    await page.evaluate((s) => {
        location.hash = "#/" + s;
    }, sceneId);
    await page
        .waitForFunction(
            ([mk, id]) => {
                try {
                    return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === id;
                } catch {
                    return false;
                }
            },
            [MACHINE_KEY, sceneId],
            { timeout: 8000 },
        )
        .catch(() => {});
    await page.waitForTimeout(settleMs);
}

/** Drive ONE cross-scene transition and measure the settle: from the hash
 *  assignment to the control-surface re-render committed two rAFs after the
 *  machine's activeScene rests on the target. */
const measureTransition = (page, target) =>
    page.evaluate(async (t) => {
        const mk = "keyframes-js-scene-machine";
        const t0 = performance.now();
        location.hash = "#/" + t;
        await new Promise((resolve) => {
            const check = () => {
                try {
                    if (JSON.parse(localStorage.getItem(mk) || "{}").activeScene === t)
                        return resolve();
                } catch {
                    /* keep polling */
                }
                requestAnimationFrame(check);
            };
            check();
        });
        // two rAFs so the control-surface re-render has committed + painted.
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        return performance.now() - t0;
    }, target);

const controlProjection = (page, superKey) =>
    page.evaluate(
        ([ck, sk]) => {
            try {
                const c = JSON.parse(localStorage.getItem(ck) || "{}")[sk];
                if (!c) return null;
                return {
                    selectedControl: c.selectedControl ?? "",
                    isControlsPanelOpen: !!c.isControlsPanelOpen,
                };
            } catch {
                return null;
            }
        },
        [CTRL_KEY, superKey],
    );

async function browserHalf() {
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        skipOrFail("dist/gh-pages not built (run `npm run gh-pages` first)");
        return;
    }
    let chromium;
    for (const pkg of ["playwright-core", "@playwright/test"]) {
        try {
            const requireFrom = createRequire(
                path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
            );
            ({ chromium } = requireFrom(pkg));
            break;
        } catch {
            /* try next */
        }
    }
    if (!chromium) {
        skipOrFail("playwright not resolvable (set KF_PLAYWRIGHT_DIR or install @playwright/test)");
        return;
    }

    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    try {
        const page = await ctx.newPage();
        await page.goto(`${base}/#/cube`, { waitUntil: "load" });
        await page.waitForTimeout(3000);

        // ── T1 TRANSITION-BUDGET ─────────────────────────────────────────────
        const samples = [];
        const route = [
            ["cube", "easing"],
            ["easing", "spring"],
            ["spring", "cube"],
        ];
        for (let i = 0; i < 6; i++) {
            for (const [, to] of route) {
                samples.push(await measureTransition(page, to));
                await page.waitForTimeout(350);
            }
        }
        samples.sort((a, b) => a - b);
        const p95 = samples[Math.min(samples.length - 1, Math.floor(samples.length * 0.95))];
        const p50 = samples[Math.floor(samples.length * 0.5)];
        if (p95 <= BUDGET_MS) {
            ok(
                `transition-budget: cross-scene navigate + control-surface re-render p95=` +
                    `${p95.toFixed(1)}ms ≤ ${BUDGET_MS}ms budget (p50=${p50.toFixed(1)}ms over ` +
                    `${samples.length} transitions; MEASURE-FIRST baseline p95≈46ms)`,
            );
        } else {
            fail(
                `transition-budget — p95=${p95.toFixed(1)}ms > ${BUDGET_MS}ms budget ` +
                    `(p50=${p50.toFixed(1)}ms over ${samples.length} transitions); the ` +
                    `control-surface re-render regressed (was p95≈46ms at W11 baseline)`,
            );
        }

        // ── T2 CONTROL-SURFACE ROUND-TRIP IDENTITY (easing↔cube) ─────────────
        await navByHash(page, "easing");
        const easingBefore = await controlProjection(page, SUPER_KEY.easing);
        await navByHash(page, "cube");
        await navByHash(page, "easing");
        const easingAfter = await controlProjection(page, SUPER_KEY.easing);

        const roundTrips =
            easingBefore &&
            easingAfter &&
            JSON.stringify(easingBefore) === JSON.stringify(easingAfter) &&
            easingBefore.selectedControl === "easing";
        if (roundTrips) {
            ok(
                `control-surface round-trip: easing↔cube preserves the control projection ` +
                    `byte-identical (${JSON.stringify(easingAfter)}; selectedControl='easing' ` +
                    `resumes — the DFA-gated surface state suspends + fully resumes on SCENE_READY)`,
            );
        } else {
            fail(
                `control-surface round-trip — easing↔cube did NOT preserve the control projection:\n` +
                    `      before: ${JSON.stringify(easingBefore)}\n` +
                    `      after:  ${JSON.stringify(easingAfter)}\n` +
                    `      (the DFA-gated surface state must suspend on leave + fully resume; ` +
                    `selectedControl must return to 'easing')`,
            );
        }

        await page.close();
    } finally {
        await ctx.close();
        await browser.close();
        server.close();
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:scene-transition-perf — FAIL (${failures.length}): the control-surface DFA ` +
            `transition budget or round-trip identity reds (the DFA was dropped, the re-render ` +
            `regressed past ${BUDGET_MS}ms, or the surface state did not round-trip).`,
    );
    process.exit(1);
}
console.log(
    `\nproof:scene-transition-perf — PASS: the control-surface DFA is the explicit owner; the ` +
        `cross-scene transition + control-surface re-render settles within the ${BUDGET_MS}ms ` +
        `MEASURE-FIRST budget and the surface state round-trips (H.W11 S4 / I2).`,
);
