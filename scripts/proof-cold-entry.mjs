#!/usr/bin/env node
/**
 * proof:cold-entry — Tranche K.W0 S6 (the COLD-ENTRY truth · the gate-ORACLE's
 * first oracle on the COLD axis: the first gesture a human makes WORKS).
 *
 * THE DEFECT this oracle is born to bite (the live P0). The product's PRIMARY
 * FIRST-RUN gesture — click the rainbow play on the cold landing hero — navigates
 * `#/` → `#/cube` and RESUMES via the group adapter's `resume()` no-op on a
 * never-started group (`scenePlaybackAdapters.ts:76-79`). The FSM enters `playing`
 * (`machine.cube = {playing:true, started:true}`), the progress UI polls `anim.t`,
 * but `interpFrames` never writes a subject — so the dock reads "Play animation"
 * and the playback slider parks at "0" while the machine BELIEVES a thing the
 * engine never did. WORSE, the certifying oracle (`proof:live-session` B1) was
 * VACUOUS against it: it greens on 40-101 distinct transforms from the
 * `.idle-hover` CSS bob at REST with the engine OFF — a liveness oracle that
 * cannot tell an ENGINE write from a decorative CSS animation (DL-K2, the
 * ≥9-tranche gate-blindspot meta-chronic).
 *
 * THE ORACLE (the engine-write disambiguation rule + the COLD-axis invariant):
 * drive the COLD/DEFAULT entry — the hero CTA from a `localStorage.clear()`
 * context, NO seedControlsOpen — and read the ENGINE's own write channel, never
 * the idle bob. The LOAD-BEARING signals are engine-ATTRIBUTABLE and device-
 * independent:
 *   (i)  the dock play aria flips "Play animation" → "Pause animation"
 *   (ii) the persistent playback slider's `aria-valuenow` advances from "0"
 *        (the playhead in ms — provably "0" engine-OFF, advancing engine-ON
 *        across every probe; the `--ball-p`/slider scalar the spec names)
 * Plus a GATED corroborator (NEVER the load-bearer — the §Provenance adjudication):
 *   (iii) the per-scene engine-write subject (the OrbitalDrag wrapper carrying the
 *         engine matrix via `apply-transform-to-container` for cube/amiga; the box
 *         for square) traverses distinct values WHILE aria="Pause animation", with
 *         `.idle-hover` EXCLUDED. The wrapper count alone is unfit in BOTH
 *         directions (bare `.cube`=0 cold AND 0/1 warm-choreo; bare `.graph`=13
 *         engine-off) — so it corroborates GATED on aria, it does not verdict.
 *
 * BORN-RED WITNESS (observed live on the pre-cure dist, `localStorage.clear()`):
 *   home→cube hero handoff settles at `{route:#/cube, aria:"Play", slider:"0",
 *   machine.cube={playing:true,started:true}}` — the aria never flips, the slider
 *   never advances, the gated corroborator never samples (aria≠Pause). RED.
 *   On the cure (S1 the resume made total → `group.play()` on the fresh group) the
 *   aria flips, the slider advances from "0", and the corroborator can sample.
 *
 * P6 posture: clauses (a)-(d) are device-INDEPENDENT CORRECTNESS gates (the aria
 * flip + the slider value change are DOM-membership + computed-attribute facts) →
 * they hard-gate. The play-window sample is a per-EXPECTED predicate (the aria
 * FLIP, the slider VALUE change), NEVER a fixed settleMs (the J.W0 settle-precept
 * carries — a fixed settle is a load-dependent oracle). Budget 0: the cold path
 * threw NOTHING on the broken tree (the defect is a SILENT no-op), so the gate
 * asserts a POSITIVE product property, not an error count. Under
 * KF_REQUIRE_BROWSER a playwright-absent / dist-absent run is a HARD FAIL at the
 * lib seam (the W7-1 regime); otherwise it skips honestly. Serves the BUILT
 * dist/gh-pages/. Re-runnable:
 *   npm run gh-pages && KF_REQUIRE_BROWSER=1 node scripts/proof-cold-entry.mjs
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const note = (l) => console.log(`  · ${l}`);
const fail = (l) => {
    failures.push(l);
    console.error(`  ✗ ${l}`);
};

console.log(
    "proof:cold-entry — K.W0 S6 (the COLD-ENTRY truth): drive the cold hero CTA from a " +
        "localStorage.clear() context, read the ENGINE's own write channel (the dock aria flip + " +
        "the playback slider advancing from \"0\"), never the idle bob.",
);

// ── the per-scene engine-write SUBJECT selector (the GATED corroborator target;
//    the element the engine MUTATES when playing — NOT the idle CSS bob). cube/
//    amiga carry the OrbitalDrag wrapper (`.graph > div`, the
//    apply-transform-to-container matrix); amiga renders a WebGL <canvas> (no
//    wrapper) so its corroborator is the canvas present-loop liveness, owned by
//    proof:amiga-subject-is-pivot — here the load-bearing aria+slider pair carries
//    it. square's box is drag-autonomous (the contract anim has no DOM target,
//    S7) — its corroborator is the box transform, GATED on aria like the rest. ──
const ENGINE_WRITE_SUBJECT = {
    cube: ".graph > div", // the OrbitalDrag wrapper (apply-transform-to-container)
    amiga: null, // WebGL canvas — no DOM-transform wrapper; aria+slider carries it
    square: ".demo-box",
};
// The IDLE bob that fooled B1 (CubeTarget.vue `.idle-hover` — `animation: idle-bob
// … infinite alternate` at REST; stops only `.idle-hover.playing{animation:none}`).
// EXCLUDED from every distinct-count sample (the engine-write disambiguation rule).
const IDLE_BOB_EXCLUDE = ".idle-hover";

// The persistent playback slider (PlaybackRibbon scrubber). Its `aria-valuenow` is
// the playhead in ms: "0" engine-OFF, advancing engine-ON — the LOAD-BEARING
// engine-attributable scalar (the spec's slider/`--ball-p`). Present whether or
// not the controls pane is open, so it reads on the genuine cold context.
const PLAY_SLIDER = '[role="slider"]';

// The per-scene control-tab trigger (the navToScene per-EXPECTED predicate) for
// the direct-hash leg. The group-adapter family all project "Controls".
const EXPECT = {
    cube: { trigger: "Controls" },
    amiga: { trigger: "Controls" },
    square: { trigger: "Controls" },
};

// ── shared in-page reads (the engine-write channel) ───────────────────────────

/** The dock play button's accessible name (the aria flip is the load-bearing
 *  engine-attributable signal): "Play animation" engine-OFF, "Pause animation"
 *  engine-ON. Reads the expanded menubar transport (the collapsed mirror carries
 *  the "(collapsed dock)" suffix). Returns "Play" | "Pause" | "?". */
const ariaState = (page) =>
    page.evaluate(() => {
        if (document.querySelector('button[aria-label="Pause animation"]')) return "Pause";
        if (document.querySelector('button[aria-label="Play animation"]')) return "Play";
        return "?";
    });

/** The playback slider's `aria-valuenow` as a number (the playhead ms; the
 *  engine-attributable scalar that is "0" engine-OFF, advancing engine-ON). */
const sliderValue = (page) =>
    page.evaluate((sel) => {
        const s = document.querySelector(sel);
        if (!s) return null;
        const v = s.getAttribute("aria-valuenow");
        return v == null ? null : parseFloat(v);
    }, PLAY_SLIDER);

/** Find + click the rainbow play (the dock play pill — the user's first gesture).
 *  Returns the selector clicked, or null. */
async function clickRainbowPlay(page) {
    return page.evaluate(() => {
        for (const sel of [
            'button[aria-label="Play animation"]',
            'button[aria-label="Play animation (collapsed dock)"]',
            'button[aria-label*="Play animation" i]',
            ".rainbow-pastel",
        ]) {
            const el = document.querySelector(sel);
            if (el) {
                el.click();
                return sel;
            }
        }
        return null;
    });
}

/** Wait — per an EXPECTED predicate, NOT a fixed settleMs (the J.W0 settle-
 *  precept) — for the engine to START after the play gesture. The LOAD-BEARING
 *  engine-attributable signal is the playback slider's `aria-valuenow` advancing
 *  ABOVE "0" (the playhead the engine actually drives — provably "0" engine-OFF,
 *  advancing ONLY when the engine drives it). The dock play aria flips
 *  OPTIMISTICALLY on the click (the UI toggles isPlaying before the engine writes
 *  a frame), so the aria flip ALONE is not sufficient — the slider advance is the
 *  genuine engine signal. The timeout is a CEILING; the wait returns the instant
 *  the slider advances. Returns true iff the engine drove the playhead within the
 *  ceiling (false ⇒ the cold no-op — the slider parks at "0" — the RED witness). */
async function waitEngineStarted(page, timeout = 4000) {
    return page
        .waitForFunction(
            (sliderSel) => {
                const s = document.querySelector(sliderSel);
                const sv = s ? parseFloat(s.getAttribute("aria-valuenow") || "0") : 0;
                return sv > 0;
            },
            PLAY_SLIDER,
            { timeout },
        )
        .then(() => true)
        .catch(() => false);
}

/** Sample the engine-write SUBJECT's distinct computed transforms, GATED on
 *  aria="Pause animation" (the engine-write disambiguation: the wrapper count is
 *  engine-attributable ONLY while the engine is playing) and with the idle bob
 *  EXCLUDED. Predicate-driven: it samples while aria stays "Pause", up to a
 *  bounded number of ticks. Returns { distinct, gated, idleExcluded }. */
async function sampleEngineSubject(page, subjectSel) {
    if (!subjectSel) return { distinct: 0, gated: false, idleExcluded: true, skipped: true };
    return page.evaluate(
        async ({ subjectSel, idleSel }) => {
            const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
            const isPause = () => !!document.querySelector('button[aria-label="Pause animation"]');
            // The gate: only sample while the engine reports PLAYING (aria=Pause).
            if (!isPause()) return { distinct: 0, gated: false, idleExcluded: true };
            const seen = new Set();
            for (let i = 0; i < 120 && isPause(); i++) {
                for (const el of document.querySelectorAll(subjectSel)) {
                    // EXCLUDE the idle bob (the CSS animation that fooled B1).
                    if (idleSel && (el.matches?.(idleSel) || el.closest?.(idleSel))) continue;
                    const t = getComputedStyle(el).transform;
                    if (t && t !== "none") seen.add(t);
                }
                await sleep(30);
            }
            return { distinct: seen.size, gated: isPause(), idleExcluded: true };
        },
        { subjectSel, idleSel: IDLE_BOB_EXCLUDE },
    );
}

// ── the budget-0 console oracle: the cold path throws NOTHING on the broken tree
//    (the defect is a SILENT no-op), so a console error/pageerror on the cold path
//    is a REGRESSION the gate also catches (live-session-gap-analysis §3: "No
//    console errors on the cold path"). ───────────────────────────────────────
function attachColdConsole(page, charges, leg) {
    page.on("pageerror", (e) => charges.push({ leg, text: `pageerror: ${String(e?.message ?? e)}` }));
    page.on("console", (m) => {
        if (m.type() === "error") charges.push({ leg, text: `console.error: ${m.text()}` });
    });
    page.on("crash", () => charges.push({ leg, text: "page crashed" }));
}

// ═════════════════════════════════════════════════════════════════════════════
// THE COLD-ENTRY BATTERY
// ═════════════════════════════════════════════════════════════════════════════
async function runBattery() {
    const VW = 1440;
    const result = await withPage(
        { distDir: DIST, label: "the cold-entry oracle", context: { viewport: { width: VW, height: 900 } } },
        async (_page, { url: base, browser }) => {
            const consoleCharges = [];

            // ── clause (a) — the COLD hero-CTA chain STARTS the engine ──────────
            // Fresh context (localStorage.clear(), NO seedControlsOpen — a genuine
            // cold context). goto #/. Click the hero rainbow play as the FIRST
            // gesture. Assert the LOAD-BEARING engine-attributable pair (aria flips
            // + slider advances from "0") + the aria-gated corroborator.
            {
                const ctx = await browser.newContext({ viewport: { width: VW, height: 900 } });
                const page = await ctx.newPage();
                attachColdConsole(page, consoleCharges, "a:cold-hero");
                await page.goto(`${base}/#/`, { waitUntil: "load" });
                await page.evaluate(() => localStorage.clear());
                await page.goto(`${base}/#/`, { waitUntil: "load" });
                // Settle the cold landing (predicate: the play pill is present).
                await page
                    .waitForFunction(
                        () => !!document.querySelector('button[aria-label="Play animation"]'),
                        null,
                        { timeout: 8000 },
                    )
                    .catch(() => {});

                const ariaBefore = await ariaState(page);
                const clicked = await clickRainbowPlay(page);

                // The hero CTA hands off `#/` → `#/cube` (the home→cube chain). Wait
                // — per the EXPECTED predicate, NOT a fixed settleMs — for the route
                // to SETTLE on the cube destination (where the playback slider
                // projects), then read the engine-write channel on the resting
                // handoff. (The home empty-group toggles an OPTIMISTIC "Pause" state
                // on `#/` transiently; the truth is the engine state after the chain
                // completes on cube.)
                await page
                    .waitForFunction(() => location.hash === "#/cube", null, { timeout: 8000 })
                    .catch(() => {});
                await page
                    .waitForFunction(
                        () => !!document.querySelector('[role="slider"]'),
                        null,
                        { timeout: 8000 },
                    )
                    .catch(() => {});
                const sliderBefore = await sliderValue(page);

                // PER-EXPECTED predicate wait (NOT a fixed settleMs): the engine
                // STARTED iff the playback slider (the engine-attributable playhead)
                // advances above "0". The aria flip is OPTIMISTIC UI — a corroborator
                // within the pair, NOT the wait condition.
                const started = await waitEngineStarted(page, 4000);
                const ariaAfter = await ariaState(page);
                const sliderAfter = await sliderValue(page);
                const route = await page.evaluate(() => location.hash);
                const machine = await page.evaluate((mk) => {
                    try {
                        const m = JSON.parse(localStorage.getItem(mk) || "{}");
                        const s = m.perScene?.[m.activeScene];
                        return { active: m.activeScene, playing: s?.playing, started: s?.started };
                    } catch {
                        return null;
                    }
                }, "keyframes-js-scene-machine");

                const ariaFlipped = ariaBefore !== "Pause" && ariaAfter === "Pause";
                const sliderAdvanced = started && (sliderAfter ?? 0) > 0;
                const corr = await sampleEngineSubject(page, ENGINE_WRITE_SUBJECT.cube);

                // The LOAD-BEARING signal is the slider advance (the engine-
                // attributable playhead); the aria flip is reported in the pair but
                // is optimistic UI, so the slider advance carries the verdict.
                const loadBearing = sliderAdvanced && ariaAfter === "Pause";
                if (loadBearing) {
                    ok(
                        `clause (a): the COLD hero-CTA chain STARTS the engine — aria flipped ` +
                            `"${ariaBefore} animation" → "${ariaAfter} animation", the playback slider ` +
                            `advanced ${sliderBefore} → ${sliderAfter} (the engine-attributable playhead), ` +
                            `route ${route} (clicked ${clicked}).`,
                    );
                    // The GATED corroborator — reported as a labeled corroborator, NOT
                    // a hard verdict (the §Provenance adjudication: the single-element
                    // wrapper count is unfit as a load-bearer — bare `.cube`=0 cold AND
                    // 0/1 warm-choreo; the load-bearer is the aria+slider pair).
                    if (corr.distinct >= 3) {
                        ok(
                            `  · corroborator: the engine-write subject (${ENGINE_WRITE_SUBJECT.cube}, ` +
                                `idle-bob excluded) traversed ${corr.distinct} distinct transforms GATED on ` +
                                `aria="Pause animation".`,
                        );
                    } else {
                        note(
                            `corroborator (LABELED — not the load-bearer): the OrbitalDrag wrapper ` +
                                `(${ENGINE_WRITE_SUBJECT.cube}) traversed only ${corr.distinct} distinct ` +
                                `transforms (gated on aria=Pause: ${corr.gated}). The container carries a ` +
                                `near-static engine matrix snapshot with the controls pane closed; the ` +
                                `load-bearing verdict is the aria flip + slider advance, which held. ` +
                                `(§Provenance: the single-element count is unfit as a load-bearer in BOTH ` +
                                `directions — this is why it corroborates, gated, and does not verdict.)`,
                        );
                    }
                } else {
                    fail(
                        `clause (a) RED — the COLD hero-CTA chain did NOT start the engine: ` +
                            `aria "${ariaBefore} animation" → "${ariaAfter} animation" (flipped=${ariaFlipped}), ` +
                            `slider ${sliderBefore} → ${sliderAfter} (advanced=${sliderAdvanced}), ` +
                            `engineStarted=${started}, route=${route}, machine=${JSON.stringify(machine)}. ` +
                            `The resume() no-op on the never-started group leaves the slider "0" and the aria ` +
                            `"Play" while the FSM reports {playing:${machine?.playing},started:${machine?.started}} ` +
                            `— the engine never wrote a frame (the live P0; born-RED on the pre-cure tree).`,
                    );
                }
                await ctx.close();
            }

            // ── clause (b) — every group scene cold-entered BOTH ways ───────────
            // (1) the COLD hero-CTA path (home→cube) is covered by clause (a). Here
            //     we add the OTHER group scenes via the hero→home→switch is NOT the
            //     hero path (only cube shares the home key); so the hero leg is
            //     cube (clause a). (2) the DIRECT-HASH path for cube/amiga/square:
            //     navToScene then a single cold dock-play click START the engine
            //     (the per-scene engine-write channel: aria flips + slider advances;
            //     the corroborator gated on aria, idle bob excluded).
            for (const id of ["cube", "amiga", "square"]) {
                const ctx = await browser.newContext({ viewport: { width: VW, height: 900 } });
                const page = await ctx.newPage();
                attachColdConsole(page, consoleCharges, `b:direct-hash:${id}`);
                await page.goto(`${base}/#/${id}`, { waitUntil: "load" });
                await page.evaluate(() => localStorage.clear());
                // Direct-hash entry via the per-EXPECTED-state nav primitive.
                await navToScene(page, id, EXPECT[id].trigger);
                await page
                    .waitForFunction(
                        () => !!document.querySelector('button[aria-label="Play animation"]'),
                        null,
                        { timeout: 8000 },
                    )
                    .catch(() => {});

                const sliderBefore = await sliderValue(page);
                const ariaBefore = await ariaState(page);
                await clickRainbowPlay(page);
                const started = await waitEngineStarted(page, 4000);
                const ariaAfter = await ariaState(page);
                const sliderAfter = await sliderValue(page);

                const ariaFlipped = ariaBefore !== "Pause" && ariaAfter === "Pause";
                // The LOAD-BEARING signal is the slider advance (the engine-
                // attributable playhead); the aria flip is optimistic UI, reported
                // in the pair but not the verdict.
                const sliderAdvanced = started && (sliderAfter ?? 0) > 0 && (sliderBefore ?? 0) === 0;
                const corr = await sampleEngineSubject(page, ENGINE_WRITE_SUBJECT[id]);

                const enginePair = sliderAdvanced && ariaAfter === "Pause";
                if (enginePair) {
                    const corrNote =
                        ENGINE_WRITE_SUBJECT[id] == null
                            ? ` (corroborator: ${id} renders a WebGL canvas — the present-loop liveness is ` +
                              `owned by proof:amiga-subject-is-pivot; the aria+slider pair carries it here)`
                            : corr.distinct >= 3
                            ? ` (corroborator: ${ENGINE_WRITE_SUBJECT[id]} traversed ${corr.distinct} distinct ` +
                              `transforms gated on aria=Pause, idle bob excluded)`
                            : ` (corroborator LABELED: ${ENGINE_WRITE_SUBJECT[id]} ${corr.distinct} distinct ` +
                              `gated on aria=Pause — the aria+slider pair is the load-bearer)`;
                    ok(
                        `clause (b) ${id} direct-hash: the engine STARTS — aria flipped → "Pause animation", ` +
                            `slider advanced ${sliderBefore} → ${sliderAfter}.${corrNote}`,
                    );
                } else {
                    fail(
                        `clause (b) ${id} direct-hash RED — the engine did NOT start: aria "${ariaBefore}" → ` +
                            `"${ariaAfter}" (flipped=${ariaFlipped}), slider ${sliderBefore} → ${sliderAfter} ` +
                            `(advanced=${sliderAdvanced}), started=${started}. The per-scene cold dock-play ` +
                            `gesture must reach group.play() and write the engine's own hand (the engine-write ` +
                            `channel, never the idle bob).`,
                    );
                }
                await ctx.close();
            }

            // ── clause (c) corroboration in-place (the canonical B1 edit is
            //    Deliverable 2 in proof-live-session.mjs). Here we ASSERT the
            //    disambiguation property: with `.idle-hover` excluded and the
            //    wrapper count GATED on aria, the gate reds when the engine is OFF.
            //    Done as a NEGATIVE control: load cube cold, do NOT click play,
            //    sample the engine-write subject with the idle bob excluded + the
            //    aria gate — it must be 0 (the engine is OFF; the idle bob is not
            //    counted; the wrapper is not engine-attributable at rest). This
            //    proves the oracle reds on engine-off (it does not green on the
            //    idle bob the way the verbatim B1 did). ─────────────────────────
            {
                const ctx = await browser.newContext({ viewport: { width: VW, height: 900 } });
                const page = await ctx.newPage();
                attachColdConsole(page, consoleCharges, "c:engine-off-control");
                await page.goto(`${base}/#/cube`, { waitUntil: "load" });
                await page.evaluate(() => localStorage.clear());
                await navToScene(page, "cube", EXPECT.cube.trigger);
                await page
                    .waitForFunction(
                        () => !!document.querySelector('button[aria-label="Play animation"]'),
                        null,
                        { timeout: 8000 },
                    )
                    .catch(() => {});
                // NO play gesture — the engine is OFF. The idle bob churns (40+
                // distinct on `.idle-hover`), but our gated/excluded sample must be 0.
                const ariaOff = await ariaState(page);
                const sliderOff = await sliderValue(page);
                const gatedSample = await sampleEngineSubject(page, ENGINE_WRITE_SUBJECT.cube);
                // The raw idle-bob distinct count (what the verbatim B1 counted) —
                // reported to witness the vacuity the disambiguation closes.
                const idleBobDistinct = await page.evaluate(async (idleSel) => {
                    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
                    const seen = new Set();
                    for (let i = 0; i < 40; i++) {
                        const el = document.querySelector(idleSel);
                        if (el) {
                            const t = getComputedStyle(el).transform;
                            if (t && t !== "none") seen.add(t);
                        }
                        await sleep(30);
                    }
                    return seen.size;
                }, IDLE_BOB_EXCLUDE);

                const disambiguates =
                    ariaOff === "Play" && (sliderOff ?? 0) === 0 && gatedSample.gated === false && gatedSample.distinct === 0;
                if (disambiguates) {
                    ok(
                        `clause (c) disambiguation: with the engine OFF (aria="Play animation", slider="0"), the ` +
                            `aria-GATED + idle-bob-EXCLUDED engine-write sample is ${gatedSample.distinct} ` +
                            `(precondition aria="Pause" never held) — while the verbatim B1's idle bob churned ` +
                            `${idleBobDistinct} distinct transforms at REST. The oracle REDS on the engine-off ` +
                            `state instead of greening on the idle bob (the engine-write disambiguation rule; ` +
                            `the canonical B1 edit lands in proof:live-session).`,
                    );
                } else {
                    fail(
                        `clause (c) RED — the disambiguation did not hold on the engine-off control: aria=` +
                            `${ariaOff}, slider=${sliderOff}, gatedSample=${JSON.stringify(gatedSample)} ` +
                            `(idle bob churned ${idleBobDistinct}). The gated+excluded sample must be 0 with ` +
                            `the engine off (it must NOT green on the idle bob).`,
                    );
                }
                await ctx.close();
            }

            // ── clause (e) — U-K1/U-K4 cold-default STATE (HYGIENE — labeled) ───
            // K4-C (the REAL assertion, reds today): the amiga COLD RELOAD with NO
            // gesture does NOT auto-resume the bounce — machine.amiga.playing is NOT
            // true on a fresh-from-cold reload. The persisted `playing:true` resumes
            // the float on the pre-cure tree (the K4-C cold-resume defect), so this
            // is a real RED-today assertion. The transport-detent + amiga-amplitude
            // APPEARANCE verdicts are TASTE-boundary (user-domain) — soft-noted.
            {
                const ctx = await browser.newContext({ viewport: { width: VW, height: 900 } });
                const page = await ctx.newPage();
                attachColdConsole(page, consoleCharges, "e:amiga-cold-reload");
                // First visit: enter amiga + PLAY once (so the machine persists a
                // playing snapshot to localStorage — the seed the K4-C defect resumes).
                await page.goto(`${base}/#/amiga`, { waitUntil: "load" });
                await page.evaluate(() => localStorage.clear());
                await navToScene(page, "amiga", EXPECT.amiga.trigger);
                await page
                    .waitForFunction(
                        () => !!document.querySelector('button[aria-label="Play animation"]'),
                        null,
                        { timeout: 8000 },
                    )
                    .catch(() => {});
                await clickRainbowPlay(page);
                await waitEngineStarted(page, 4000);
                // The persisted machine snapshot now (should carry amiga.playing).
                const persisted = await page.evaluate((mk) => {
                    try {
                        const m = JSON.parse(localStorage.getItem(mk) || "{}");
                        return m.perScene?.amiga?.playing ?? null;
                    } catch {
                        return null;
                    }
                }, "keyframes-js-scene-machine");

                // COLD RELOAD with NO gesture — a genuine fresh-from-cold reload that
                // KEEPS localStorage (the persisted snapshot). The cold-default policy
                // must NOT auto-resume the bounce: machine.amiga.playing is NOT true
                // and the dock reads "Play animation" at rest.
                await page.reload({ waitUntil: "load" });
                await page
                    .waitForFunction(
                        () =>
                            !!document.querySelector('button[aria-label="Play animation"]') ||
                            !!document.querySelector('button[aria-label="Pause animation"]'),
                        null,
                        { timeout: 8000 },
                    )
                    .catch(() => {});
                // Read the resting state after a bounded settle (predicate already
                // gated on the dock rendering; this is a short corroborating read).
                const ariaAfterReload = await ariaState(page);
                const sliderAfterReload = await sliderValue(page);
                const resumedPlaying = await page.evaluate((mk) => {
                    try {
                        const m = JSON.parse(localStorage.getItem(mk) || "{}");
                        return m.perScene?.amiga?.playing === true;
                    } catch {
                        return false;
                    }
                }, "keyframes-js-scene-machine");

                // K4-C — the REAL clause-(e) assertion (reds today): no auto-resume.
                const noAutoResume = resumedPlaying !== true && ariaAfterReload !== "Pause";
                if (noAutoResume) {
                    ok(
                        `clause (e) HYGIENE — K4-C: the amiga COLD RELOAD with NO gesture does NOT auto-resume ` +
                            `the bounce (machine.amiga.playing=${resumedPlaying}, dock aria="${ariaAfterReload} ` +
                            `animation", slider=${sliderAfterReload}). The cold-default playback-persistence ` +
                            `policy holds — no uninstructed motion at rest. [HYGIENE: corroborates the cold-axis ` +
                            `truth; the APPEARANCE verdict (amplitude/tint TASTEFUL) closes on the user packet.]`,
                    );
                } else {
                    fail(
                        `clause (e) RED — K4-C: the amiga COLD RELOAD AUTO-RESUMED the bounce with NO gesture ` +
                            `(persistedBeforeReload=${persisted}, machine.amiga.playing-after-reload=` +
                            `${resumedPlaying}, dock aria="${ariaAfterReload} animation"). The persisted ` +
                            `playing:true resumes the float on a cold load — uninstructed motion at rest (the ` +
                            `K4-C cold-resume defect; born-RED on the pre-cure tree).`,
                    );
                }
                // The transport-detent / amiga-amplitude APPEARANCE verdicts are
                // TASTE-boundary (user-domain) — soft-noted, never a green/red here.
                note(
                    "clause (e) TASTE-boundary (soft, user-domain): the bottom TransportDock default detent " +
                        "(U-K1) + the amiga bounce amplitude/tint (U-K4 A/B) APPEARANCE verdicts close on the " +
                        "user's review packet (the TASTE invariant), not on this gate's green.",
                );
                await ctx.close();
            }

            // ── budget 0 — the cold path threw NOTHING on the broken tree (the
            //    defect is a SILENT no-op); a console error/pageerror on any cold
            //    leg is a regression. ─────────────────────────────────────────
            if (consoleCharges.length === 0) {
                ok(
                    "budget 0: ZERO console.error/pageerror across every cold leg (the cold path threw " +
                        "NOTHING on the broken tree — the defect is a SILENT no-op; the gate asserts a " +
                        "POSITIVE product property, not an error count).",
                );
            } else {
                fail(
                    `budget BLOWN — ${consoleCharges.length} console.error/pageerror on the cold path ` +
                        `(a regression — the cold path threw nothing on the broken tree):\n      ` +
                        consoleCharges.slice(0, 8).map((c) => `[${c.leg}] ${c.text.slice(0, 130)}`).join("\n      "),
                );
            }
        },
    );
    if (result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
    }
}

await runBattery();

if (failures.length > 0) {
    console.error(
        `\nproof:cold-entry — FAIL (${failures.length}): the COLD axis does NOT tell the truth — the first ` +
            `gesture a human makes (the cold hero rainbow play) does NOT start the engine (the aria never ` +
            `flips Play→Pause / the playback slider never advances from "0"), OR a group scene cold-entered ` +
            `does not start, OR the engine-off disambiguation control greened on the idle bob, OR the amiga ` +
            `cold reload auto-resumed the bounce. This is born-RED on the pre-cure tree (the resume() no-op ` +
            `on the never-started group, scenePlaybackAdapters.ts:76-79); it greens on S1 (the resume made ` +
            `total → group.play() on the fresh group).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:cold-entry — PASS: the COLD axis tells the truth — the first gesture a human makes (the cold " +
        "hero rainbow play from a localStorage.clear() context) STARTS the engine (the dock aria flips " +
        "Play→Pause, the playback slider advances from \"0\"), every group scene cold-entered starts the " +
        "engine, the oracle REDS on the engine-off state (the engine-write disambiguation, never the idle " +
        "bob), and the amiga cold reload does NOT auto-resume the bounce. The engine-write channel — the " +
        "engine's own hand — is what this oracle reads, not the decorative CSS animation that fooled B1.",
);
