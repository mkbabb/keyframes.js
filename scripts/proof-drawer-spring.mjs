#!/usr/bin/env node
/**
 * proof:drawer-spring — H.W7.S2 / inv ζ (the mobile bottom-SHEET drawer is the
 * engine's OWN `SpringProgress`, NOT a CSS `grid-template-rows`/height ease).
 *
 * The flagship structural motion of a SPRING ENGINE must be sprung by the engine
 * itself (dogfood-as-mandate). H.W7 DELETES the 550ms CSS `transition:
 * grid-template-rows 0.55s cubic-bezier(…)` drawer in `ControlsPaneWrapper.vue`
 * and replaces it with a `useSheetSpring(open)` composable that constructs a
 * `new SpringProgress({ response: 0.3, dampingFraction: 0.8,
 * respectReducedMotion: true })`, per-frame writing a reactive `--sheet-t` the
 * sheet's `height` reads. The three falsifiable clauses, each BITING on the EXACT
 * pre-overlay defect it forbids:
 *
 *   (a) NO CSS HEIGHT TRANSITION (STATIC — always runs; WV-W7-HIGH-1 SCOPE +
 *       WV-W7-LOW-2 dist exclusion). A grep-gate SCOPED to the sheet file
 *       `ControlsPaneWrapper.vue` ONLY (comment-stripped, so the doc-comments that
 *       NARRATE the deletion are not mistaken for survivors): NO `transition` whose
 *       property list touches the sheet's MOTION axis — `height`, `grid-template-
 *       rows`, `transform`, or the catch-all `all` — survives. The open/close
 *       motion comes from the `SpringProgress` subscription (`--sheet-t`), never a
 *       CSS curve. EXCLUDES `AnimationControlsControls.vue` (its `.panel-row`
 *       `transition: grid-template-rows` crossfade is ALREADY-SOTA, H.W3-PRESERVED
 *       — an unscoped grep would red on it forever) and `demo/app/dist/*` (a
 *       whole-repo grep matches the built bundle). The opacity-axis transitions
 *       (the desktop idle-fade / open-close fade) are ALLOWED — they are not the
 *       height/position axis the spring owns. BITE: reds on the pre-overlay tree
 *       (`transition: grid-template-rows 0.55s …` on the sheet); greens when the
 *       CSS ease is deleted and the spring is the sole height driver.
 *
 *   (b) SPRING SHAPE + FAST SETTLE (BROWSER). A live runtime probe of the REAL
 *       `.controls-pane-wrapper`'s `--sheet-t` custom property (the value the
 *       SpringProgress writes each frame), sampled per `requestAnimationFrame`
 *       while the sheet is driven OPEN (0→1) by a trusted click on the grab handle:
 *         • SETTLE — from the first frame of motion to within 0.01 of terminal
 *           (≈1px on the detent range) is `< 350ms` (measured ≈176ms — the
 *           response 0.3 / ζ 0.8 instance; NOT the 550ms CSS ramp, NOT the
 *           response-0.5 `--spring-snappy` ≈401ms the contract forbids binding).
 *         • SHAPE — the trace OVERSHOOTS its terminal (peaks ABOVE 1 before
 *           ringing back) — the ζ<1 underdamped spring signature. A CSS
 *           `cubic-bezier(0.4,0,0.2,1)` ease is monotone-to-terminal and NEVER
 *           exceeds it; a `linear()` from `springLinearStops` would overshoot but
 *           is not what the sheet uses. The overshoot bite distinguishes a genuine
 *           live SpringProgress from any monotone eased ramp.
 *       BITE: reds on the 550ms eased ramp (settle ≈550ms, overshoot 0 — monotone);
 *       greens on the SpringProgress-driven sheet.
 *
 *   (c) PRM SINGLE-FRAME SNAP (BROWSER). Under `prefers-reduced-motion: reduce`
 *       (Playwright `emulateMedia`), driving the sheet open/close snaps `--sheet-t`
 *       to terminal in a SINGLE frame — ZERO intermediate frames between start and
 *       terminal. This is the engine's `respectReducedMotion: true` →
 *       `_snapSettled()` path (one emit, no loop, spring.ts:271), which a CSS
 *       duration that ignores PRM cannot produce. BITE: drive the sheet by a CSS
 *       duration that ignores PRM → intermediate frames appear → reds; locks
 *       `respectReducedMotion: true` on the sheet's own spring.
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * resolveChromium + context/teardown, J.W3 S1; the lib's navToScene IN-PAGE hash
 * settle so storage + the H.W1 reconcile trap survive). The STATIC clause (a)
 * always runs; the BROWSER clauses (b)/(c) gate on playwright resolution + the
 * BUILT dist/gh-pages/ (run `npm run gh-pages` first). Under KF_REQUIRE_BROWSER a
 * playwright-absent skip becomes a hard fail AT THE LIB SEAM, so the
 * spring-shape/PRM facts are never green-reported un-exercised. Re-runnable:
 * `node scripts/proof-drawer-spring.mjs`.
 *
 * ── HARNESS NOTE (the open-state seed, from impl-w7-overlay.md §OPEN NOTES) ──
 * A fresh `#/cube` load with no selection `v-show`-HIDES the sheet
 * (`v-show="storedControls.selectedAnimation && …"`). The probe must FORCE the
 * sheet to render: seed the cube superKey's `selectedAnimation` + open the pane via
 * the control-options store, then wait for `.controls-pane-wrapper` to mount. The
 * sheet motion is then driven by a TRUSTED click on the real `.sheet-grab-handle`
 * (the BLK-6 gesture surface) — never a synthetic store flip, so the gate exercises
 * the same path a user's swipe does.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, withPage } from "./lib/demo-driver.mjs";
import { declarePosture } from "./lib/ci-env.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};
const note = (label) => console.log(`  · ${label}`);

// The (b) SETTLE clause is an absolute WALL-CLOCK measurement (settleMs from first
// motion to terminal-EPS) — throttle-sensitive on a loaded GitHub-Actions Linux
// runner (P6 device-dependent). It rides the ONE observe-only mechanism: RECORDED
// in CI, HARD on the dev box / under KF_REQUIRE_*. The device-INDEPENDENT clauses —
// the ζ<1 overshoot-shape (a monotone CSS ease can NEVER overshoot), the
// single-frame PRM snap, and the static no-CSS-ease-on-height fact — carry the hard
// "the sheet IS the engine's SpringProgress, not a CSS ramp" assertion regardless.
const { miss: settleMiss } = declarePosture("observe-only", {
    reason: "wall-clock spring-settle ms is throttle-sensitive on a loaded CI runner; the overshoot-shape + PRM-snap + static-no-CSS-ease clauses carry the hard spring-vs-ease verdict",
    fail,
    note,
});

console.log(
    "proof:drawer-spring — H.W7.S2 (the mobile sheet is the engine's own SpringProgress, not a CSS ease)",
);

// ── localStorage keys (the deterministic open-state seed) ────────────────────
const CTRL_KEY = "animation-groups-control-options-store";

// The scene the probe drives: cube — a `subject` mode-class scene whose sheet is
// the full SpringProgress drawer over the full-bleed stage (the flagship motion).
const PROBE_SCENE = "cube";
const PROBE_SUPER_KEY = "Cube"; // getAnimationSuperKey("cube") — the control projection key

// The settle budget the contract names (response 0.3 / ζ 0.8 ≈176ms; the 550ms CSS
// ease and the response-0.5 `--spring-snappy` ≈401ms both FAIL it).
const SETTLE_BUDGET_MS = 350;
// "within 1px of terminal" on the detent range → 0.01 of the [0,1] --sheet-t track
// (the detent range is ~hundreds of px; 0.01 is a sub-px-to-~few-px terminal band).
const SETTLE_EPS = 0.01;
// A genuine ζ=0.8 ring overshoots ~0.015 past terminal; require a real (non-noise)
// overshoot so a monotone CSS ease (overshoot 0) cannot pass.
const MIN_OVERSHOOT = 0.004;

// ─────────────────────────────────────────────────────────────────────────────
// CLAUSE (a) — NO CSS HEIGHT/grid-template-rows/transform TRANSITION (static)
// ─────────────────────────────────────────────────────────────────────────────
function stripCssComments(src) {
    // strip /* … */ so a doc-comment NARRATING the deleted ease is not a survivor.
    return src.replace(/\/\*[\s\S]*?\*\//g, " ");
}

function staticHalf() {
    const sheetPath = path.join(
        REPO,
        "demo/@/components/custom/animation-controls/components/ControlsPaneWrapper.vue",
    );
    if (!fs.existsSync(sheetPath)) {
        fail(`static — the sheet file ControlsPaneWrapper.vue not found at ${sheetPath}`);
        return;
    }
    // Scope to the <style> block (the only place a CSS `transition` rule lives);
    // strip comments first so the deletion-narrating doc-comments are not matched.
    const raw = fs.readFileSync(sheetPath, "utf8");
    const styleMatch = raw.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const css = stripCssComments(styleMatch ? styleMatch[1] : raw);

    // Find every `transition[-property]:` declaration and inspect its property list
    // for the sheet's MOTION axis. The opacity-axis transitions (idle-fade,
    // open-close fade) are ALLOWED; height/grid-template-rows/transform/all are the
    // forbidden axes (the spring owns them).
    const MOTION_AXES = ["height", "grid-template-rows", "transform", "all"];
    const offenders = [];
    const declRe = /\btransition(?:-property)?\s*:\s*([^;{}]+)/gi;
    let m;
    while ((m = declRe.exec(css)) !== null) {
        const value = m[1].toLowerCase();
        for (const axis of MOTION_AXES) {
            // word-boundary match so `transform` does not match inside `transform-origin`
            // and `height` does not match inside `max-height` (max-height is not animated here).
            const axisRe = new RegExp(`(^|[\\s,])${axis.replace(/[-]/g, "\\-")}(?=$|[\\s,])`);
            if (axisRe.test(value)) {
                offenders.push({ axis, decl: m[0].trim().replace(/\s+/g, " ") });
            }
        }
    }

    if (offenders.length === 0) {
        ok(
            "static — no `transition` on the sheet's height/grid-template-rows/transform axis " +
                "survives in ControlsPaneWrapper.vue (the SpringProgress `--sheet-t` is the sole " +
                "open/close motion; the allowed opacity-axis fades are untouched)",
        );
    } else {
        fail(
            "static — ControlsPaneWrapper.vue still carries a CSS transition on the sheet's " +
                "MOTION axis (the 550ms `grid-template-rows` ease must be DELETED; the spring " +
                "owns height): " +
                offenders.map((o) => `[${o.axis}] "${o.decl}"`).join(" · "),
        );
    }

    // Belt-and-braces: the spring composable is actually wired (the `useSheetSpring`
    // subscription must be the motion source — guards against deleting the ease AND
    // the spring together, which would leave a static sheet that passes (a) vacuously).
    // The K.WZ proof:demo-no-oversize seam split moved the useSheetSpring(…) call into
    // the colocated useSheetState composable, which ControlsPaneWrapper now imports and
    // whose `--sheet-t` it binds — read the composable alongside so the wire resolves.
    const sheetStatePath = path.join(
        REPO,
        "demo/@/components/custom/animation-controls/composables/useSheetState.ts",
    );
    const sheetState = fs.existsSync(sheetStatePath)
        ? fs.readFileSync(sheetStatePath, "utf8")
        : "";
    const springWired =
        /useSheetSpring\s*\(/.test(sheetState) && /useSheetState\b/.test(raw);
    if (springWired && /--sheet-t/.test(raw)) {
        ok("static — ControlsPaneWrapper.vue wires `useSheetState(…)` → `useSheetSpring(…)` and binds `--sheet-t` (the spring IS the motion source)");
    } else {
        fail(
            "static — ControlsPaneWrapper.vue must wire the sheet spring (`useSheetState(…)` → " +
                "`useSheetSpring(…)`) writing `--sheet-t` " +
                "(deleting the CSS ease without the spring would leave the sheet motionless — a vacuous (a) pass)",
        );
    }
}

/** Settle on #/<scene> at 390×844 via the lib's navToScene IN-PAGE hash nav
 *  (storage + the H.W1 trap survive; page.goto clears both). Re-assert the mobile
 *  viewport AFTER navigation. Seed the superKey's `selectedAnimation` + OPEN the
 *  pane so the `v-show`-gated sheet renders, then start CLOSED so the OPEN drive
 *  (0→1) overshoots ABOVE terminal (the clean spring-shape direction). */
async function seedSheet(page, startOpen) {
    await navToScene(page, PROBE_SCENE, "Controls", { timeout: 8000 });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(
        ([ck, sk, open]) => {
            try {
                const st = JSON.parse(localStorage.getItem(ck) || "{}");
                st[sk] = st[sk] || {};
                // a real animation name so the `v-show` selectedAnimation gate is truthy
                // (the FSM's bindSceneAdapter also sets this on entry; seed it to be robust).
                if (!st[sk].selectedAnimation) st[sk].selectedAnimation = "Rotations";
                st[sk].isControlsPanelOpen = open;
                localStorage.setItem(ck, JSON.stringify(st));
            } catch {
                /* fall through — the FSM bind populates selectedAnimation anyway */
            }
        },
        [CTRL_KEY, PROBE_SUPER_KEY, startOpen],
    );
    await page.waitForTimeout(1200); // route rest + the wrapper mount
}

/** Wait until the real `.controls-pane-wrapper` (the sheet) + its `.sheet-grab-handle`
 *  (the BLK-6 gesture surface) mount, so the probe is not racing the reflow. */
async function waitSheetMounted(page) {
    return page
        .waitForFunction(
            () => {
                const el = document.querySelector(".controls-pane-wrapper");
                if (!el) return false;
                const handle = el.querySelector(".sheet-grab-handle");
                if (!handle) return false;
                const r = el.getBoundingClientRect();
                const hr = handle.getBoundingClientRect();
                return r.height > 0 && hr.width > 0 && hr.height > 0;
            },
            undefined,
            { timeout: 8000 },
        )
        .then(() => true)
        .catch(() => false);
}

/** Drive the sheet by a TRUSTED click on the real grab handle and sample the live
 *  `--sheet-t` per rAF. Returns the trace + the derived settle/overshoot/move-start
 *  metrics measured FROM THE FIRST FRAME OF MOTION (so click-dispatch latency is
 *  excluded). Runs entirely in-page; the click is the real BLK-6 gesture path. */
async function driveAndTrace(page, windowMs = 900) {
    return page.evaluate((winMs) => {
        return new Promise((resolve) => {
            const el = document.querySelector(".controls-pane-wrapper");
            if (!el) return resolve({ error: "no .controls-pane-wrapper" });
            const handle = el.querySelector(".sheet-grab-handle");
            if (!handle) return resolve({ error: "no .sheet-grab-handle" });
            const read = () => parseFloat(getComputedStyle(el).getPropertyValue("--sheet-t")) || 0;
            const start = read();
            const samples = [];
            const tWall0 = performance.now();
            let moveT0 = null;
            const tick = () => {
                const now = performance.now();
                const v = read();
                samples.push({ t: now - tWall0, v });
                if (moveT0 === null && Math.abs(v - start) > 0.01) moveT0 = now - tWall0;
                if (now - tWall0 < winMs) requestAnimationFrame(tick);
                else resolve({ samples, start, moveOffset: moveT0 });
            };
            // the real gesture path — a trusted click on the BLK-6 handle toggles open.
            handle.click();
            requestAnimationFrame(tick);
        });
    }, windowMs);
}

/** Reduce a trace to {terminal, settleMs (from first motion), overshoot, frames}. */
function analyzeTrace(trace) {
    const vs = trace.samples.map((s) => s.v);
    const terminal = vs[vs.length - 1];
    const max = Math.max(...vs);
    const min = Math.min(...vs);
    const moveStart = trace.moveOffset ?? 0;
    let settleMs = null;
    for (const s of trace.samples) {
        if (s.t < moveStart) continue;
        if (Math.abs(s.v - terminal) <= SETTLE_EPS) {
            settleMs = s.t - moveStart;
            break;
        }
    }
    // overshoot past terminal in the direction of travel.
    const dir = terminal - trace.start;
    const overshoot = dir >= 0 ? max - terminal : terminal - min;
    // intermediate frames strictly between start and terminal (the PRM-snap counter).
    const intermediate = vs.filter(
        (v) => Math.abs(v - trace.start) > SETTLE_EPS && Math.abs(v - terminal) > SETTLE_EPS,
    ).length;
    return { start: trace.start, terminal, max, min, moveStart, settleMs, overshoot, intermediate, n: vs.length };
}

async function browserHalf() {
    const result = await withPage(
        {
            distDir: DIST,
            label: "the spring-shape + PRM-snap clauses",
            context: { viewport: { width: 390, height: 844 } },
        },
        async (page, { url, browser }) => {
        // ── (b) SPRING SHAPE + FAST SETTLE ──────────────────────────────────
        {
            await page.goto(`${url}/#/${PROBE_SCENE}`, { waitUntil: "load" });
            // start CLOSED so the trusted handle-click drives the sheet OPEN (0→1),
            // overshooting ABOVE terminal — the clean spring-shape direction.
            await seedSheet(page, false);
            const mounted = await waitSheetMounted(page);
            if (!mounted) {
                const dbg = await page.evaluate(() => ({
                    wrapper: !!document.querySelector(".controls-pane-wrapper"),
                    handle: !!document.querySelector(".sheet-grab-handle"),
                    sheetT: (() => {
                        const el = document.querySelector(".controls-pane-wrapper");
                        return el ? getComputedStyle(el).getPropertyValue("--sheet-t") : "n/a";
                    })(),
                    hash: location.hash,
                }));
                fail(
                    `(b) spring-shape — the sheet never mounted ` +
                        `(wrapper:${dbg.wrapper}, handle:${dbg.handle}, --sheet-t:${dbg.sheetT}, hash:${dbg.hash})`,
                );
            } else {
                const trace = await driveAndTrace(page, 900);
                if (trace.error) {
                    fail(`(b) spring-shape — probe error: ${trace.error}`);
                } else {
                    const a = analyzeTrace(trace);
                    // NON-VACUITY: real motion happened (start≠terminal, ≥1 moving frame).
                    if (Math.abs(a.terminal - a.start) < 0.5 || a.moveStart == null) {
                        fail(
                            `(b) spring-shape — the sheet did not visibly move on the handle click ` +
                                `(start=${a.start.toFixed(3)} → terminal=${a.terminal.toFixed(3)}); a vacuous pass is forbidden`,
                        );
                    } else {
                        // settle budget
                        if (a.settleMs !== null && a.settleMs < SETTLE_BUDGET_MS) {
                            ok(
                                `(b) settle — the sheet settles in ${a.settleMs.toFixed(0)}ms < ${SETTLE_BUDGET_MS}ms ` +
                                    `(from first motion to within ${SETTLE_EPS} of terminal; the response 0.3/ζ 0.8 ` +
                                    `instance, NOT the 550ms CSS ramp nor the response-0.5 --spring-snappy ≈401ms)`,
                            );
                        } else {
                            // observe-only in CI (throttle-sensitive wall-clock);
                            // hard on the dev box / under KF_REQUIRE_*.
                            settleMiss(
                                `(b) settle — the sheet took ${a.settleMs === null ? "≥the sample window" : a.settleMs.toFixed(0) + "ms"} ` +
                                    `to settle (budget ${SETTLE_BUDGET_MS}ms). A 550ms CSS ease / the response-0.5 ` +
                                    `--spring-snappy busts the budget — the sheet must construct the response-0.3 spring instance.`,
                            );
                        }
                        // spring shape — overshoot past terminal (ζ<1 ring; a CSS ease is monotone).
                        if (a.overshoot >= MIN_OVERSHOOT) {
                            ok(
                                `(b) spring-shape — the trace OVERSHOOTS terminal by ${a.overshoot.toFixed(4)} ` +
                                    `(peak ${a.max.toFixed(4)} vs terminal ${a.terminal.toFixed(3)}) — the ζ=0.8 underdamped ` +
                                    `ring; a monotone cubic-bezier ease never exceeds its terminal`,
                            );
                        } else {
                            fail(
                                `(b) spring-shape — NO overshoot (max ${a.max.toFixed(4)}, min ${a.min.toFixed(4)}, ` +
                                    `terminal ${a.terminal.toFixed(3)}; overshoot ${a.overshoot.toFixed(4)} < ${MIN_OVERSHOOT}). ` +
                                    `The motion is monotone-to-terminal — a CSS ease, not a live SpringProgress ` +
                                    `(the drawer must dogfood the engine's underdamped spring).`,
                            );
                        }
                    }
                }
            }
        }

        // ── (c) PRM SINGLE-FRAME SNAP ───────────────────────────────────────
        // A FRESH context (isolated storage, mirrors the pre-lib browser.newPage)
        // so the PRM emulation + seed do not inherit clause (b)'s state.
        {
            const prmContext = await browser.newContext({
                viewport: { width: 390, height: 844 },
            });
            try {
            const page = await prmContext.newPage();
            await page.emulateMedia({ reducedMotion: "reduce" });
            await page.goto(`${url}/#/${PROBE_SCENE}`, { waitUntil: "load" });
            // start OPEN so the handle-click drives CLOSE (1→0) — under PRM it must snap.
            await seedSheet(page, true);
            const mounted = await waitSheetMounted(page);
            if (!mounted) {
                fail("(c) PRM-snap — the sheet never mounted under prefers-reduced-motion");
            } else {
                const prm = await page.evaluate(() =>
                    matchMedia("(prefers-reduced-motion: reduce)").matches,
                );
                if (!prm) {
                    fail("(c) PRM-snap — emulateMedia did not engage prefers-reduced-motion: reduce");
                } else {
                    const trace = await driveAndTrace(page, 400);
                    if (trace.error) {
                        fail(`(c) PRM-snap — probe error: ${trace.error}`);
                    } else {
                        const a = analyzeTrace(trace);
                        if (Math.abs(a.terminal - a.start) < 0.5) {
                            fail(
                                `(c) PRM-snap — the sheet did not change state on the handle click under PRM ` +
                                    `(start=${a.start.toFixed(3)} → terminal=${a.terminal.toFixed(3)}); a vacuous pass is forbidden`,
                            );
                        } else if (a.intermediate === 0) {
                            ok(
                                `(c) PRM-snap — under prefers-reduced-motion the sheet snaps ${a.start.toFixed(0)}→${a.terminal.toFixed(0)} ` +
                                    `in a SINGLE frame (0 intermediate frames; the engine's respectReducedMotion ` +
                                    `_snapSettled — one emit, no loop)`,
                            );
                        } else {
                            fail(
                                `(c) PRM-snap — ${a.intermediate} intermediate frame(s) between start ${a.start.toFixed(3)} ` +
                                    `and terminal ${a.terminal.toFixed(3)} under prefers-reduced-motion (expected 0 — a single-frame ` +
                                    `snap). The sheet is animating through PRM — a CSS duration ignores it; the spring's ` +
                                    `respectReducedMotion:true must own the snap.`,
                            );
                        }
                    }
                }
            }
            } finally {
                await prmContext.close();
            }
        }
        },
    );
    if (result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
    }
}

staticHalf();
await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:drawer-spring — FAIL (${failures.length}): the mobile sheet drawer is NOT the ` +
            `engine's own SpringProgress (a surviving CSS height/grid-template-rows ease / a monotone ` +
            `non-spring trace / a settle over budget / a PRM animation instead of a single-frame snap).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:drawer-spring — PASS: the mobile bottom-sheet open/close motion is the engine's own " +
        "SpringProgress (no CSS height/grid-template-rows ease; <350ms settle; an underdamped overshoot " +
        "ring; a single-frame PRM snap) — the flagship structural motion dogfoods the spring (H.W7.S2 / inv ζ).",
);
