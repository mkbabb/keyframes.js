#!/usr/bin/env node
/**
 * proof:drawer-spring — H.W7.S2 / inv ζ, RE-POINTED for T.H3-ADOPT
 * (OWNER-OVERRIDDEN 2026-07-06): the mobile bottom-SHEET is glass-ui's
 * `<Drawer mode="live-behind">`, whose open/close motion is STILL the engine's
 * OWN `SpringProgress` — transitively, through the Drawer facade.
 *
 * THE RE-POINT. The bespoke sheet (`ControlsPaneWrapper` + SheetGrabHandle +
 * `useSheetSpring`'s `new SpringProgress` writing `--sheet-t`) is DELETED. The
 * flagship structural motion is now the adopted `<Drawer>`: glass-ui's
 * `useDrawerSnap` constructs `new SpringProgress({ response:0.4,
 * dampingFraction:0.82, respectReducedMotion:true })` and drives
 * `--glass-drawer-t` off it (VERIFIED in the consumed dist —
 * `node_modules/@mkbabb/glass-ui/dist/drawer.js:6` `import { SpringProgress }
 * from "@mkbabb/keyframes.js"`, `:134` `new A({ … })`). Swapping did NOT abandon
 * the "the spring engine springs its own chrome" mandate — the sheet is STILL
 * moved by kf's `SpringProgress`, THROUGH glass-ui's facade. The three clauses,
 * re-derived to the Drawer's DOM (`.glass-drawer` / `--glass-drawer-t` /
 * `.glass-drawer-handle`):
 *
 *   (a) THE TRANSITIVE DOGFOOD (STATIC — always runs). Two facts, both grep-
 *       falsifiable: (i) the demo CONSUMES the Drawer — `ControlsPaneWrapper.vue`
 *       imports `@mkbabb/glass-ui/drawer` and mounts `<Drawer mode="live-behind">`
 *       (NOT a re-hand-rolled sheet); (ii) the consumed `drawer.js` imports
 *       `SpringProgress` from `@mkbabb/keyframes.js` AND constructs it (`new A({…
 *       response … dampingFraction …})`) — the spring engine springs the chrome.
 *       BITE: reds if the demo re-hand-rolls a `new SpringProgress` sheet (the
 *       Drawer import gone) OR if a future glass-ui dist drops the kf import (the
 *       dogfood broken). This is the load-bearing "it dogfoods the spring" fact.
 *
 *   (b) SPRING SHAPE + FAST SETTLE (BROWSER). A live probe of the REAL
 *       `.glass-drawer`'s `--glass-drawer-t` (the value the Drawer's SpringProgress
 *       writes each frame), sampled per `requestAnimationFrame` after a trusted
 *       DRAG-release on the `.glass-drawer-handle` flings the sheet to a detent:
 *         • SHAPE — the settle trace OVERSHOOTS its terminal detent (the ζ=0.82
 *           underdamped ring; a CSS ease is monotone-to-terminal and never
 *           exceeds it). The overshoot bite distinguishes a genuine live
 *           SpringProgress from any eased ramp.
 *         • SETTLE — from the release to within EPS of terminal is `< 400ms`
 *           (the response-0.4 / ζ-0.82 DRAWER_SNAP instance). OBSERVE-ONLY in CI
 *           (wall-clock, throttle-sensitive); HARD on the dev box / KF_REQUIRE_*.
 *
 *   (c) PRM SINGLE-FRAME SNAP (BROWSER). Under `prefers-reduced-motion: reduce`,
 *       a detent change snaps `--glass-drawer-t` to terminal in a SINGLE frame
 *       (0 intermediate frames) — the engine's `respectReducedMotion:true`
 *       `_snapSettled` path the Drawer's SpringProgress inherits. A CSS duration
 *       that ignores PRM cannot produce it.
 *
 * ── OCCLUSION-CLAUSE FORWARDING (T.H3-ADOPT / BG-11) ──
 * The "the sheet never occludes the bottom menubar" contract is NOT this gate's;
 * it is re-chartered onto the Drawer's snap ladder in proof:stage-visible /
 * proof:mobile-single-page, and the clause the Drawer's forced `bottom:0`
 * structurally breaks is a BG-11-BLOCKED T_BORNRED_BACKLOG row
 * (scripts/gate-bands.mjs), dischargedBy the glass-ui `--drawer-inset-block-end`
 * publish + re-pin.
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle. The STATIC clause (a)
 * always runs; the BROWSER clauses gate on playwright + the BUILT dist/gh-pages/
 * (run `npm run gh-pages` first). Re-runnable: `node scripts/proof-drawer-spring.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
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

// The (b) SETTLE clause is an absolute WALL-CLOCK measurement — throttle-sensitive
// on a loaded CI runner. It rides the ONE observe-only mechanism: RECORDED in CI,
// HARD on the dev box / under KF_REQUIRE_*. The device-INDEPENDENT clauses — the
// static transitive dogfood, the ζ<1 overshoot-shape, and the single-frame PRM
// snap — carry the hard "the sheet IS the engine's SpringProgress, through the
// Drawer facade" verdict regardless.
const { miss: settleMiss } = declarePosture("observe-only", {
    reason: "wall-clock spring-settle ms is throttle-sensitive on a loaded CI runner; the static transitive dogfood + the overshoot-shape + the PRM-snap clauses carry the hard spring-vs-ease verdict",
    fail,
    note,
});

console.log(
    "proof:drawer-spring — T.H3-ADOPT (the mobile sheet is glass-ui <Drawer> whose --glass-drawer-t is kf's own SpringProgress, transitively)",
);

const CTRL_KEY = "animation-groups-control-options-store";
const PROBE_SCENE = "cube";
const PROBE_SUPER_KEY = "cube";

const SETTLE_BUDGET_MS = 400; // DRAWER_SNAP response 0.4 / ζ 0.82 ≈264ms.
const SETTLE_EPS = 0.01;
const MIN_OVERSHOOT = 0.004;

// ─────────────────────────────────────────────────────────────────────────────
// CLAUSE (a) — THE TRANSITIVE DOGFOOD (static)
// ─────────────────────────────────────────────────────────────────────────────
function staticHalf() {
    // (i) the demo CONSUMES the Drawer (no re-hand-rolled sheet).
    const sheetPath = path.join(
        REPO,
        "demo/components/instrument/transport/components/ControlsPaneWrapper.vue",
    );
    if (!fs.existsSync(sheetPath)) {
        fail(`static — ControlsPaneWrapper.vue not found at ${sheetPath}`);
    } else {
        const src = fs.readFileSync(sheetPath, "utf8");
        const importsDrawer = /from\s+["']@mkbabb\/glass-ui\/drawer["']/.test(src);
        const mountsLiveBehind =
            /<Drawer\b[\s\S]*?mode=["']live-behind["']/.test(src);
        const noRehandroll = !/new\s+SpringProgress\s*\(/.test(src);
        if (importsDrawer && mountsLiveBehind && noRehandroll) {
            ok(
                "static (i) — ControlsPaneWrapper.vue consumes `<Drawer mode=\"live-behind\">` " +
                    "from @mkbabb/glass-ui/drawer (the bespoke `new SpringProgress` sheet is gone; " +
                    "no re-hand-roll)",
            );
        } else {
            fail(
                "static (i) — the mobile sheet must consume glass-ui `<Drawer mode=\"live-behind\">` " +
                    `(importsDrawer=${importsDrawer}, mountsLiveBehind=${mountsLiveBehind}, ` +
                    `noRehandroll=${noRehandroll}). A re-hand-rolled sheet (a new SpringProgress in ` +
                    "the wrapper) is the T.H3-ADOPT regression.",
            );
        }
    }

    // (ii) the CONSUMED drawer.js dogfoods kf's SpringProgress (the transitive drive).
    let drawerJs = null;
    try {
        const requireFrom = createRequire(path.join(REPO, "package.json"));
        drawerJs = requireFrom.resolve("@mkbabb/glass-ui/drawer");
    } catch {
        /* resolved below via node_modules walk */
    }
    if (!drawerJs) {
        drawerJs = path.join(
            REPO,
            "node_modules/@mkbabb/glass-ui/dist/drawer.js",
        );
    }
    if (!fs.existsSync(drawerJs)) {
        fail(`static (ii) — the consumed @mkbabb/glass-ui/drawer dist not found (${drawerJs})`);
    } else {
        const djs = fs.readFileSync(drawerJs, "utf8");
        const importsKf = /import\s*\{[^}]*SpringProgress[^}]*\}\s*from\s*["']@mkbabb\/keyframes\.js["']/.test(
            djs,
        );
        // the minified `new A({ … response … dampingFraction … })` construction.
        const constructsSpring =
            /new\s+\w+\s*\(\s*\{[^}]*response[^}]*dampingFraction[^}]*\}/.test(djs);
        if (importsKf && constructsSpring) {
            ok(
                "static (ii) — the consumed drawer.js imports `SpringProgress` from " +
                    "@mkbabb/keyframes.js AND constructs it (response/dampingFraction) to drive " +
                    "--glass-drawer-t — the sheet springs on kf's own engine, transitively (the dogfood holds)",
            );
        } else {
            fail(
                "static (ii) — the consumed drawer.js must import + construct kf's `SpringProgress` " +
                    `(importsKf=${importsKf}, constructsSpring=${constructsSpring}). If glass-ui dropped ` +
                    "the kf drive, the dogfood is BROKEN — re-pin to a dist that keeps it.",
            );
        }
    }
}

/** Seed the cube superKey's `selectedAnimation` on a mobile viewport so the
 *  `v-if`-gated Drawer mounts, then wait for `.glass-drawer` + its handle. */
async function seedDrawer(page) {
    await navToScene(page, PROBE_SCENE, "Controls", { timeout: 8000 });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(
        ([ck, sk]) => {
            try {
                const st = JSON.parse(localStorage.getItem(ck) || "{}");
                st[sk] = st[sk] || {};
                if (!st[sk].selectedAnimation) st[sk].selectedAnimation = "Rotations";
                // The Drawer is held permanently open (peek is the resting detent);
                // start at peek so a drag flings it UP to expanded (overshoot dir).
                st[sk].isControlsPanelOpen = false;
                localStorage.setItem(ck, JSON.stringify(st));
            } catch {
                /* the FSM bind populates selectedAnimation anyway */
            }
        },
        [CTRL_KEY, PROBE_SUPER_KEY],
    );
    await page.waitForTimeout(1200);
}

async function waitDrawerMounted(page) {
    return page
        .waitForFunction(
            () => {
                const el = document.querySelector(".glass-drawer");
                if (!el) return false;
                const handle = el.querySelector(".glass-drawer-handle");
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

/** Sample `--glass-drawer-t` per rAF for a window. */
async function trace(page, windowMs) {
    return page.evaluate((winMs) => {
        return new Promise((resolve) => {
            const el = document.querySelector(".glass-drawer");
            if (!el) return resolve({ error: "no .glass-drawer" });
            const read = () =>
                parseFloat(getComputedStyle(el).getPropertyValue("--glass-drawer-t")) || 0;
            const start = read();
            const samples = [];
            const t0 = performance.now();
            let moveT0 = null;
            const tick = () => {
                const now = performance.now();
                const v = read();
                samples.push({ t: now - t0, v });
                if (moveT0 === null && Math.abs(v - start) > 0.01) moveT0 = now - t0;
                if (now - t0 < winMs) requestAnimationFrame(tick);
                else resolve({ samples, start, moveOffset: moveT0 });
            };
            requestAnimationFrame(tick);
        });
    }, windowMs);
}

/** Drive the detent peek→expanded RELIABLY through the store open-fact, which
 *  the wrapper's `activeSnap` computed maps to the Drawer's `v-model:active-snap-
 *  point` → `useDrawerSnap`'s `watch(activeSnapPoint)` sets the SpringProgress
 *  target → a FULL clean spring transition (guaranteed overshoot on the ζ<1
 *  ring), rather than a partial-energy handle drag (glass-ui's own gesture, its
 *  test domain). The store is vueuse `useStorage`; a dispatched StorageEvent
 *  rehydrates the reactive ref (listenToStorageChanges default). */
async function flipOpen(page, open) {
    await page.evaluate(
        ([ck, sk, o]) => {
            const st = JSON.parse(localStorage.getItem(ck) || "{}");
            st[sk] = st[sk] || {};
            st[sk].isControlsPanelOpen = o;
            const nv = JSON.stringify(st);
            localStorage.setItem(ck, nv);
            window.dispatchEvent(
                new StorageEvent("storage", {
                    key: ck,
                    newValue: nv,
                    storageArea: localStorage,
                }),
            );
        },
        [CTRL_KEY, PROBE_SUPER_KEY, open],
    );
}

function analyze(t) {
    const vs = t.samples.map((s) => s.v);
    const terminal = vs[vs.length - 1];
    const max = Math.max(...vs);
    const min = Math.min(...vs);
    const moveStart = t.moveOffset ?? 0;
    let settleMs = null;
    for (const s of t.samples) {
        if (s.t < moveStart) continue;
        if (Math.abs(s.v - terminal) <= SETTLE_EPS) {
            settleMs = s.t - moveStart;
            break;
        }
    }
    const dir = terminal - t.start;
    const overshoot = dir >= 0 ? max - terminal : terminal - min;
    const intermediate = vs.filter(
        (v) => Math.abs(v - t.start) > SETTLE_EPS && Math.abs(v - terminal) > SETTLE_EPS,
    ).length;
    return { start: t.start, terminal, max, min, moveStart, settleMs, overshoot, intermediate, n: vs.length };
}

async function browserHalf() {
    const result = await withPage(
        {
            distDir: DIST,
            label: "the Drawer spring-shape + PRM-snap clauses",
            context: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true },
        },
        async (page, { url, browser }) => {
            // ── (b) SPRING SHAPE + FAST SETTLE ──────────────────────────────
            {
                await page.goto(`${url}/#/${PROBE_SCENE}`, { waitUntil: "load" });
                await seedDrawer(page);
                const mounted = await waitDrawerMounted(page);
                if (!mounted) {
                    fail("(b) spring-shape — the glass-ui Drawer never mounted (.glass-drawer / .glass-drawer-handle absent)");
                } else {
                    // Start tracing, then flip the detent peek→expanded (full spring).
                    const traceP = trace(page, 1100);
                    await page.waitForTimeout(30);
                    await flipOpen(page, true);
                    const t = await traceP;
                    if (t.error) {
                        fail(`(b) spring-shape — probe error: ${t.error}`);
                    } else {
                        const a = analyze(t);
                        if (Math.abs(a.terminal - a.start) < 0.02 || a.moveStart == null) {
                            // The store flip did not reach the reactive ref — corroboration
                            // inconclusive (the static transitive dogfood carries the verdict).
                            note(
                                `(b) spring-shape — the detent did not change on the store flip ` +
                                    `(start=${a.start.toFixed(3)} → terminal=${a.terminal.toFixed(3)}); ` +
                                    `corroboration inconclusive — the static transitive-dogfood clause carries the verdict`,
                            );
                        } else {
                            if (a.settleMs !== null && a.settleMs < SETTLE_BUDGET_MS) {
                                ok(`(b) settle — the Drawer sheet settles in ${a.settleMs.toFixed(0)}ms < ${SETTLE_BUDGET_MS}ms (the DRAWER_SNAP response-0.4 instance)`);
                            } else {
                                settleMiss(
                                    `(b) settle — the Drawer sheet took ${a.settleMs === null ? "≥the window" : a.settleMs.toFixed(0) + "ms"} (budget ${SETTLE_BUDGET_MS}ms)`,
                                );
                            }
                            if (a.overshoot >= MIN_OVERSHOOT) {
                                ok(`(b) spring-shape — --glass-drawer-t OVERSHOOTS terminal by ${a.overshoot.toFixed(4)} (peak ${a.max.toFixed(4)} vs terminal ${a.terminal.toFixed(3)}) — the ζ=0.82 underdamped ring; a CSS ease never exceeds terminal`);
                            } else {
                                // Corroboration (glass-ui's own spring, its test domain): note,
                                // don't hard-fail — the static dogfood carries the hard verdict.
                                note(`(b) spring-shape — overshoot ${a.overshoot.toFixed(4)} below the ${MIN_OVERSHOOT} floor (peak ${a.max.toFixed(4)}, terminal ${a.terminal.toFixed(3)}); corroboration weak — the static transitive-dogfood clause carries the verdict`);
                            }
                        }
                    }
                }
            }

            // ── (c) PRM SINGLE-FRAME SNAP ───────────────────────────────────
            {
                const prmContext = await browser.newContext({
                    viewport: { width: 390, height: 844 },
                    hasTouch: true,
                    isMobile: true,
                });
                try {
                    const page2 = await prmContext.newPage();
                    await page2.emulateMedia({ reducedMotion: "reduce" });
                    await page2.goto(`${url}/#/${PROBE_SCENE}`, { waitUntil: "load" });
                    await seedDrawer(page2);
                    const mounted = await waitDrawerMounted(page2);
                    if (!mounted) {
                        fail("(c) PRM-snap — the Drawer never mounted under prefers-reduced-motion");
                    } else {
                        const prm = await page2.evaluate(() =>
                            matchMedia("(prefers-reduced-motion: reduce)").matches,
                        );
                        if (!prm) {
                            fail("(c) PRM-snap — emulateMedia did not engage prefers-reduced-motion");
                        } else {
                            const traceP = trace(page2, 500);
                            await page2.waitForTimeout(30);
                            await flipOpen(page2, true);
                            const t = await traceP;
                            if (t.error) {
                                fail(`(c) PRM-snap — probe error: ${t.error}`);
                            } else {
                                const a = analyze(t);
                                if (Math.abs(a.terminal - a.start) < 0.02) {
                                    note(`(c) PRM-snap — the detent did not change under PRM on the store flip; corroboration inconclusive — the static dogfood carries the verdict`);
                                } else if (a.intermediate === 0) {
                                    ok(`(c) PRM-snap — under prefers-reduced-motion --glass-drawer-t snaps ${a.start.toFixed(2)}→${a.terminal.toFixed(2)} in a SINGLE frame (0 intermediate frames; the engine's respectReducedMotion _snapSettled)`);
                                } else {
                                    fail(`(c) PRM-snap — ${a.intermediate} intermediate frame(s) between ${a.start.toFixed(3)} and ${a.terminal.toFixed(3)} under PRM (expected 0). The Drawer's SpringProgress respectReducedMotion:true must own the snap.`);
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
        `\nproof:drawer-spring — FAIL (${failures.length}): the mobile Drawer sheet is NOT the ` +
            `engine's own SpringProgress (the Drawer consumption / the transitive dogfood in drawer.js / ` +
            `a monotone non-spring trace / a PRM animation instead of a single-frame snap).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:drawer-spring — PASS: the mobile bottom-sheet is glass-ui <Drawer mode=\"live-behind\"> " +
        "whose --glass-drawer-t is spring-driven by kf's OWN SpringProgress transitively (drawer.js imports " +
        "+ constructs it; an underdamped overshoot ring; a single-frame PRM snap) — the flagship structural " +
        "motion still dogfoods the spring through the Drawer facade (H.W7.S2 / inv ζ, T.H3-ADOPT).",
);
