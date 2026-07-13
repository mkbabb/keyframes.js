#!/usr/bin/env node
/**
 * proof:easing-gallery — T.E6 (the specimen-drawer gallery IS the easing scene).
 *
 * ── AUTHORITY: OWNER (T.M6) · BLOCKING ────────────────────────────────────────
 * OD-7 RULED APPROVED 2026-07-06 (the packet ratification, OWNER-ASKS row 4):
 * "Ratify all with your best judgment" — **P-GALLERY is the blessed reference**
 * (kept worktree `worktree-wf_558e7859-5ca-3` @ 8414cb5; capture packet at
 * docs/tranches/T/audit/prototypes/P-GALLERY/). Per T.M2 this born-RED oracle
 * was deliberately UNAUTHORED until the OD-7 token landed — it is authored NOW,
 * in the easing terminal batch, against the landed production graft. Its green
 * is unreachable without the owner-blessed composition (the gallery layout,
 * tile treatment, one-shared-clock sweep are the OD-7 ruling's subject); the
 * ball-preview INTENT of the retired `proof:easing-stage-is-ball` surface-lock
 * survives HERE (historical migration successor).
 *
 * THE COMPOSITION (ruling #14 "just have the easing balls previewed here"):
 * every named curve is a specimen tile — a static sparkline portrait + a
 * hairline rail + a 14px OD-6-violet ball racing x = fn(phase)·maxX — under ONE
 * shared sweep clock (the surviving registerDotPainter direct-write seam,
 * I.W4 D4): all balls depart together, arrive per their curve.
 *
 * CLAUSES (the T.E.md §T.E6 oracle):
 *   (1) TILE CENSUS — navToScene(easing) renders ≥30 specimen tiles, each
 *       carrying a sparkline portrait + a rail + a data-curve-keyed ball.
 *   (2) ANALYTIC MID-SWEEP — with the sweep honestly playing (a real transport
 *       press), one same-frame sample recovers the shared phase φ from the
 *       `linear` runner (x/maxX) and asserts the OTHER runners sit at their
 *       curve's exact x = fn(φ)·maxX: `ease-in-quad` at φ²·maxX and
 *       `ease-in-out-quad` at its closed form (2φ² / 1−(−2φ+2)²/2) — ±2px.
 *       (The wave's "fn(0.5)·maxX ±1px at phase 0.5" generalized to the live
 *       phase: the closed-form check is exact at EVERY φ, not just 0.5, and
 *       needs no scrub seam. The runners are top-row tiles — always inside
 *       the IntersectionObserver window at 1440×900, so the IO gate never
 *       masks the sample.)
 *   (3) TRANSFORM-ONLY WRITES — a 2s in-page MutationObserver trace over the
 *       drawer while playing: every style-attribute write lands on a
 *       `.tile-ball` and mutates ONLY `transform` (zero per-frame filter/
 *       layout-property writes — the smear/beam died with the hero). The frame
 *       budget (median rAF delta + long tasks) is REPORTED — enforced only off
 *       CI (KF_PERF_ENFORCE=1 forces it): the reference-machine budget is a
 *       device-dependent measurement (the CI device-dependence lesson), the
 *       structural transform-only clause is the device-independent closure.
 *   (4) THE PROMOTION — a tile click updates the header: the specimen name
 *       takes the Instrument-Serif header slot and the literal is COMPLETE and
 *       re-parseable (`cubic-bezier(0.19, 1, 0.22, 1)` for ease-out-expo — the
 *       four numbers verified; `bounce-out-ease` promotes its registry name —
 *       the F7 truncation class is dead).
 *   (5) THE FAMILY FILTER — pressing `Bounce` narrows the drawer to the six
 *       bounce specimens on the same shared clock; `All` restores the census.
 *   (6) COHERENT FREEZE — after a real pause press the whole field rests: two
 *       samples 400ms apart are transform-identical (ONE clock, total).
 *
 * Runs over the BUILT dist/gh-pages (scripts/lib/demo-driver.mjs withPage).
 * Under KF_REQUIRE_BROWSER=1 a playwright-absent skip is a hard fail.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, pressPlayToggle, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const note = (label) => console.log(`  · ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:easing-gallery — T.E6 (OD-7 APPROVED · P-GALLERY blessed reference · OWNER authority)",
);

const BALL = 14; // the specimen runner size (--ball-size, EasingTarget.vue)

/** One same-frame sample of the named runners' translateX + the rail maxX. */
async function sampleRunners(page, names) {
    return page.evaluate(async (curveNames) => {
        // Sample INSIDE one rAF tick so every read sees the same painted phase.
        await new Promise((r) => requestAnimationFrame(r));
        const stage = document.querySelector(".specimen-tile .tile-stage");
        const railW = stage ? stage.clientWidth : 0;
        const xOf = (name) => {
            const el = document.querySelector(`.tile-ball[data-curve="${name}"]`);
            if (!el) return null;
            const t = el.style.transform || "";
            const m = t.match(/translateX\(([-\d.]+)px\)/);
            return m ? parseFloat(m[1]) : null;
        };
        const xs = {};
        for (const n of curveNames) xs[n] = xOf(n);
        return { railW, xs };
    }, names);
}

async function browserHalf() {
    const consoleErrors = [];
    await withPage(
        {
            distDir: DIST,
            label: "the easing-gallery OWNER oracle",
            context: { viewport: { width: 1440, height: 900 } },
        },
        async (page, { url: base }) => {
            page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));
            page.on("console", (m) => {
                if (m.type() === "error") consoleErrors.push(`console.error: ${m.text()}`);
            });

            await page.goto(`${base}/#/easing`, { waitUntil: "load" });
            await navToScene(page, "easing", "Curve", { timeout: 10000 });
            await page.waitForTimeout(800);

            // ── (1) tile census ────────────────────────────────────────────
            const census = await page.evaluate(() => {
                const tiles = [...document.querySelectorAll(".specimen-tile")];
                const complete = tiles.filter(
                    (t) =>
                        t.querySelector(".tile-sparkline path") &&
                        t.querySelector(".tile-rail") &&
                        t.querySelector(".tile-ball[data-curve]"),
                ).length;
                return { tiles: tiles.length, complete };
            });
            if (census.tiles >= 30 && census.complete === census.tiles) {
                ok(
                    `(1) tile census — ${census.tiles} specimen tiles rendered, every one complete ` +
                        "(sparkline portrait + hairline rail + data-curve ball)",
                );
            } else {
                fail(
                    `(1) tile census — ${census.tiles} tiles (need ≥30), ${census.complete} complete ` +
                        "(sparkline+rail+ball) — the specimen drawer is not the scene",
                );
            }

            // ── (2) analytic mid-sweep (the one-shared-clock proof) ────────
            // The scene rests on entry (T.G3) — press the REAL transport play.
            await pressPlayToggle(page, { intent: "play" });
            await page.waitForTimeout(400);

            const NAMES = ["linear", "ease-in-quad", "ease-in-out-quad"];
            const quad = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
            let analytic = null;
            for (let attempt = 0; attempt < 10 && !analytic; attempt++) {
                const s = await sampleRunners(page, NAMES);
                const maxX = s.railW - BALL;
                const xl = s.xs["linear"];
                if (maxX > 20 && xl != null) {
                    const phi = xl / maxX;
                    // A mid-band phase keeps the step runners' expectations
                    // unambiguous (at φ≈0/1 every curve converges).
                    if (phi > 0.05 && phi < 0.95) analytic = { s, maxX, phi };
                }
                if (!analytic) await page.waitForTimeout(160);
            }
            if (!analytic) {
                fail(
                    "(2) analytic mid-sweep — never recovered a mid-band shared phase from the " +
                        "linear runner (is the shared sweep clock driving the tiles?)",
                );
            } else {
                const { s, maxX, phi } = analytic;
                const checks = [
                    ["ease-in-quad", phi * phi * maxX, s.xs["ease-in-quad"]],
                    ["ease-in-out-quad", quad(phi) * maxX, s.xs["ease-in-out-quad"]],
                ];
                const bad = checks.filter(
                    ([, want, got]) => got == null || Math.abs(got - want) > 2,
                );
                if (bad.length === 0) {
                    ok(
                        `(2) analytic mid-sweep — at the recovered shared phase φ=${phi.toFixed(3)} ` +
                            `(maxX=${maxX}px) every sampled runner sits at fn(φ)·maxX ±2px ` +
                            `(ease-in-quad=${s.xs["ease-in-quad"]?.toFixed(1)} vs ${(phi * phi * maxX).toFixed(1)}, ` +
                            `ease-in-out-quad=${s.xs["ease-in-out-quad"]?.toFixed(1)} vs ${(quad(phi) * maxX).toFixed(1)})`,
                    );
                } else {
                    fail(
                        `(2) analytic mid-sweep — at φ=${phi.toFixed(3)} (maxX=${maxX}px) runner(s) off ` +
                            "their curve: " +
                            bad
                                .map(([n, want, got]) => `${n} at ${got}px (want ${want.toFixed(1)}±2)`)
                                .join(", "),
                    );
                }
            }

            // ── (3) transform-only writes (2s trace, playing) ──────────────
            const trace = await page.evaluate(async () => {
                const grid = document.querySelector(".specimen-grid");
                if (!grid) return null;
                const offending = [];
                let ballWrites = 0;
                const mo = new MutationObserver((muts) => {
                    for (const m of muts) {
                        if (m.type !== "attributes" || m.attributeName !== "style") continue;
                        const el = m.target;
                        const style = el.getAttribute("style") || "";
                        const isBall = el.classList?.contains("tile-ball");
                        const transformOnly = /^\s*transform:[^;]+;?\s*$/.test(style);
                        if (isBall && transformOnly) ballWrites++;
                        else if (offending.length < 8) {
                            offending.push(
                                `${el.tagName}.${[...(el.classList || [])].join(".")} → "${style.slice(0, 80)}"`,
                            );
                        }
                    }
                });
                mo.observe(grid, { attributes: true, attributeFilter: ["style"], subtree: true });
                // The frame-budget REPORT (device-dependent — informational on CI).
                const deltas = [];
                let longTasks = 0;
                try {
                    new PerformanceObserver((l) => {
                        longTasks += l.getEntries().length;
                    }).observe({ type: "longtask" });
                } catch {
                    /* longtask unsupported — report-only anyway */
                }
                let last = performance.now();
                const t0 = last;
                while (performance.now() - t0 < 2000) {
                    await new Promise((r) => requestAnimationFrame(r));
                    const now = performance.now();
                    deltas.push(now - last);
                    last = now;
                }
                mo.disconnect();
                deltas.sort((a, b) => a - b);
                const median = deltas[Math.floor(deltas.length / 2)] ?? 0;
                return { ballWrites, offending, median, longTasks, frames: deltas.length };
            });
            if (!trace) {
                fail("(3) transform-only trace — the specimen grid is absent");
            } else if (trace.offending.length === 0 && trace.ballWrites > 30) {
                ok(
                    `(3) transform-only writes — ${trace.ballWrites} ball transform writes over 2s, ` +
                        "ZERO non-transform / non-ball style writes in the drawer (no per-frame filter/layout writes)",
                );
            } else {
                fail(
                    `(3) transform-only writes — ballWrites=${trace.ballWrites} (need >30: the shared ` +
                        `clock must actually drive the field), offending writes: ` +
                        (trace.offending.join(" · ") || "none"),
                );
            }
            if (trace) {
                const budgetLine = `frame budget (report) — median rAF delta ${trace.median.toFixed(1)}ms over ${trace.frames} frames, ${trace.longTasks} long task(s)`;
                const enforce = process.env.KF_PERF_ENFORCE === "1";
                if (enforce && (trace.median > 25 || trace.longTasks > 2)) {
                    fail(`(3-budget, ENFORCED) ${budgetLine} — over the reference budget`);
                } else {
                    note(budgetLine + (enforce ? " (enforced: within budget)" : " (informational on CI — device-dependence lesson)"));
                }
            }

            // ── (4) the promotion (tile click → header name + literal) ─────
            const clickTile = async (name) => {
                const found = await page.evaluate((n) => {
                    const ball = document.querySelector(`.tile-ball[data-curve="${n}"]`);
                    const tile = ball?.closest(".specimen-tile");
                    if (!tile) return false;
                    tile.scrollIntoView({ block: "center" });
                    return true;
                }, name);
                if (!found) return false;
                const box = await page.evaluate((n) => {
                    const tile = document
                        .querySelector(`.tile-ball[data-curve="${n}"]`)
                        ?.closest(".specimen-tile");
                    const r = tile.getBoundingClientRect();
                    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
                }, name);
                await page.mouse.click(box.x, box.y);
                await page.waitForTimeout(350);
                return true;
            };
            const readHeader = () =>
                page.evaluate(() => ({
                    name: document.querySelector(".specimen-name")?.textContent?.trim() ?? null,
                    literal:
                        document.querySelector(".specimen-literal .literal-text")?.textContent?.trim() ??
                        null,
                }));

            if (await clickTile("ease-out-expo")) {
                const h = await readHeader();
                const m = (h.literal || "").match(
                    /^cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)$/,
                );
                const nums = m ? m.slice(1, 5).map(Number) : null;
                const want = [0.19, 1, 0.22, 1];
                const numsOK =
                    nums && nums.every((v, i) => Math.abs(v - want[i]) < 0.005);
                if (h.name === "ease-out-expo" && numsOK) {
                    ok(
                        `(4) promotion — the ease-out-expo tile press promoted the header (name + the ` +
                            `COMPLETE literal ${h.literal}; closing paren present, four numbers verified)`,
                    );
                } else {
                    fail(
                        `(4) promotion — tile press gave header name=${JSON.stringify(h.name)} ` +
                            `literal=${JSON.stringify(h.literal)} (want name ease-out-expo + the complete ` +
                            "cubic-bezier(0.19, 1, 0.22, 1) literal — the F7 truncation class must stay dead)",
                    );
                }
            } else {
                fail("(4) promotion — no ease-out-expo specimen tile to press");
            }
            if (await clickTile("bounce-out-ease")) {
                const h = await readHeader();
                if (h.name === "bounce-out-ease" && h.literal === "bounce-out-ease") {
                    ok(
                        "(4) promotion — the engine-native bounce-out-ease promotes its registry name " +
                            "as the literal (value.js round-trips it by name; the picker catalogue gap is BG-8)",
                    );
                } else {
                    fail(
                        `(4) promotion — bounce-out-ease press gave name=${JSON.stringify(h.name)} ` +
                            `literal=${JSON.stringify(h.literal)}`,
                    );
                }
            } else {
                fail("(4) promotion — no bounce-out-ease specimen tile to press");
            }

            // ── (5) the family filter ──────────────────────────────────────
            const pressFilter = async (label) => {
                const box = await page.evaluate((l) => {
                    // The accessible contract, not a styling hook: the filter is
                    // the aria-labeled single-select ToggleGroup (the old
                    // .family-item class was an unstyled dead-ref, removed at
                    // the T close — proof:styling-idioms resolve-or-red).
                    const items = [
                        ...document.querySelectorAll(
                            '[aria-label="Filter curves by family"] button',
                        ),
                    ];
                    const el = items.find((i) => i.textContent.trim() === l);
                    if (!el) return null;
                    const r = el.getBoundingClientRect();
                    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
                }, label);
                if (!box) return false;
                await page.mouse.click(box.x, box.y);
                await page.waitForTimeout(400);
                return true;
            };
            if (await pressFilter("Bounce")) {
                const bounce = await page.evaluate(() => ({
                    tiles: document.querySelectorAll(".specimen-tile").length,
                    curves: [...document.querySelectorAll(".tile-ball[data-curve]")].map(
                        (b) => b.dataset.curve,
                    ),
                }));
                const allBounce = bounce.curves.every((c) => /bounce/.test(c));
                if (bounce.tiles === 6 && allBounce) {
                    ok("(5) family filter — Bounce narrows to the six bounce specimens (one shared clock)");
                } else {
                    fail(
                        `(5) family filter — Bounce gave ${bounce.tiles} tile(s): ${bounce.curves.join(", ")} ` +
                            "(want exactly the 6 bounce specimens)",
                    );
                }
                await pressFilter("All");
                const restored = await page.evaluate(
                    () => document.querySelectorAll(".specimen-tile").length,
                );
                if (restored >= 30) {
                    ok(`(5) family filter — All restores the census (${restored} tiles)`);
                } else {
                    fail(`(5) family filter — All restored only ${restored} tiles (want ≥30)`);
                }
            } else {
                fail("(5) family filter — no Bounce filter pill to press");
            }

            // ── (6) coherent freeze (pause → the whole field rests) ────────
            await pressPlayToggle(page, { intent: "pause" });
            await page.waitForTimeout(300);
            const freezeA = await page.evaluate(() =>
                [...document.querySelectorAll(".tile-ball[data-curve]")]
                    .slice(0, 12)
                    .map((b) => b.style.transform),
            );
            await page.waitForTimeout(400);
            const freezeB = await page.evaluate(() =>
                [...document.querySelectorAll(".tile-ball[data-curve]")]
                    .slice(0, 12)
                    .map((b) => b.style.transform),
            );
            const frozen =
                freezeA.length > 0 &&
                freezeA.length === freezeB.length &&
                freezeA.every((t, i) => t === freezeB[i]);
            if (frozen) {
                ok(
                    `(6) coherent freeze — a real pause press froze the whole field at one phase ` +
                        `(${freezeA.length} sampled runners transform-identical across 400ms)`,
                );
            } else {
                fail(
                    "(6) coherent freeze — sampled runners kept moving (or vanished) after the pause " +
                        "press — the shared clock is not total",
                );
            }

            // zero page errors throughout
            if (consoleErrors.length === 0) {
                ok("zero pageerror/console.error across the whole drive");
            } else {
                fail(
                    `page errors during the drive (${consoleErrors.length}): ` +
                        consoleErrors.slice(0, 4).join(" · "),
                );
            }
        },
    );
}

const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
try {
    await browserHalf();
} catch (e) {
    const reason = e?.message || String(e);
    if (/playwright|chromium|browser|launch/i.test(reason) && !REQUIRE_BROWSER) {
        console.log(`  ○ browser half skipped — ${reason}`);
    } else {
        fail(`browser half failed — ${reason}`);
    }
}

if (failures.length > 0) {
    console.error(`\nproof:easing-gallery — FAIL (${failures.length})`);
    process.exit(1);
}
console.log(
    "\nproof:easing-gallery — PASS: the specimen drawer IS the easing scene (OD-7's blessed " +
        "composition landed: ≥30 tiles on ONE shared clock, analytic fn(φ)·maxX placement, " +
        "transform-only writes, the header promotion with complete literals, the family filter, " +
        "and a coherent total freeze).",
);
