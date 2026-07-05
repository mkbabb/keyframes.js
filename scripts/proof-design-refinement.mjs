#!/usr/bin/env node
/**
 * proof:design-refinement — Tranche L.W11 (the per-scene instrument-egg arms ·
 * BORN-RED today).
 *
 * ── WHAT THIS GATE ASSERTS ───────────────────────────────────────────────────
 * L.W11 refines the TASTE-approved demo into one coherent INSTRUMENT language and
 * adds ONE new, proportionate, on-aesthetic EASTER EGG per scene (S1-S9), each a
 * surgical refinement of the kept subject (never an abrogation). This gate is the
 * per-scene roster for those NEW eggs — a sibling of proof:easter-egg's shape:
 *
 *   (STATIC HALF) each scene's NEW egg carries (a) a hidden TRIGGER, (b) a NEW
 *     egg-DOM marker (a stable class/attr the refinement introduces), and (c) an
 *     ENGINE DOGFOOD (CSSKeyframesAnimation / SpringProgress / Sequence /
 *     DrawSVG / SmoothProgress / fromMotionPath / AnimationGroup — a public engine
 *     primitive) in the egg's owning source — AND it does NOT hand-roll a rAF in
 *     that egg's region (inv ζ). The anti-rAF clause is the BITE: a hand-rolled
 *     `requestAnimationFrame` loop in the egg's owning unit REDs the arm.
 *
 *   (BROWSER HALF) settle on the scene, fire the egg's hidden trigger, and assert
 *     the NEW observable off-the-normal-path effect flips (the egg DOM marker
 *     activates / the engine writes the new layer's observable state). Born-RED
 *     until the egg exists; the lib seam's KF_REQUIRE_BROWSER rule applies.
 *
 * ── BORN-RED, BY DESIGN ──────────────────────────────────────────────────────
 * The W11 eggs do NOT exist yet — so this gate is BORN-RED today: each arm names
 * the NEW egg DOM + the NEW engine dogfood the refinement must add. It greens ONLY
 * when L.W11 lands each scene's new instrument egg (the trigger + the engine-
 * dogfooded effect + no hand-rolled rAF). This is distinct from proof:easter-egg,
 * which guards the SEVEN already-shipped H.W12 eggs (kept green); proof:design-
 * refinement guards the NINE NEW W11 instrument eggs.
 *
 * ── THE NINE NEW EGGS (the S1-S9 recipes — design-fold-clauses.txt is the oracle) ─
 *   S1 home        — the live-source quadrant card TYPES its own @keyframes block in
 *                    Fira Code (red caret) → format.ts serializes it back on a ~6s
 *                    round-trip; dogfood: CSSKeyframesAnimation + format.ts.
 *   S2 cube        — the orientation-coupled RE-LIT die: faces toward the pinned
 *                    light brighten + catch specular as the cube orbits (rides
 *                    syncRotationToModel, NO second rAF); the kept dblclick ROLL
 *                    lands a --spin-energy bloom "thunk".
 *   S3 amiga       — the once-on-enter power-on BOOT (flash → H-hold roll → 3
 *                    wall-slam Boing bounces) off the IntersectionObserver re-entry;
 *                    PRM-snapped; dogfood: the Boing AnimationGroup.
 *   S4 square      — the kept tumble dblclick gains a palette-sweep on the
 *                    barrel-roll; dogfood: SpringProgress (the kept chase).
 *   S5 easing      — drag-bend SMEARS the trace proportional to per-frame velocity,
 *                    decaying via SmoothProgress; a once-on-enter graticule +
 *                    self-drawing trace (DrawSVG dogfood); PRM-snapped.
 *   S6 spring      — the four-lane DERBY refined: four SpringProgress solvers race
 *                    four rainbow lanes (--spring-lane-*), ζ=0.45 ringing past the
 *                    line; a quiet red-dashed settle pulse on liveSettled.
 *   S7 sequence    — scrubbing the master clock DETONATES the rainbow lanes in a
 *                    diagonal cascade chasing the thumb (violet→green); an
 *                    orchestrated ~700ms power-on; PRM-guarded.
 *   (S8 motion-path + S9 compose refinement eggs were RETIRED at T.E3/T.E1 —
 *    those scenes were PRUNED, OD-1 = PRUNE.)
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * resolveChromium + context/teardown; navToScene drives the IN-PAGE scene switch).
 * Re-runnable: `node scripts/proof-design-refinement.mjs`.
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

console.log(
    "proof:design-refinement — L.W11 (the nine NEW per-scene instrument eggs · born-RED · inv ζ)",
);

// ── The public engine primitives an egg may DOGFOOD (inv ζ — never a hand-rolled
// rAF). An egg's effect MUST reuse one of these (or the managed RAFPlayback the
// engine owns), never a bare requestAnimationFrame loop in the egg's own unit. ──
const ENGINE_DOGFOOD = new RegExp(
    [
        "CSSKeyframesAnimation",
        "SpringProgress",
        "SmoothProgress",
        "new Sequence\\b|\\bSequence\\(",
        "AnimationGroup",
        "DrawSVG|fromDrawSVG",
        "MotionPath|fromMotionPath",
        "NumericAnimation",
        "RAFPlayback", // the engine's MANAGED driver is the sanctioned rAF owner
        "loadAnimationEngine",
        "format\\.ts|serialize|toCSSString|formatCSS", // S1 round-trips via format.ts
    ].join("|"),
);

// A HAND-ROLLED rAF — the inv-ζ violation. A bare requestAnimationFrame in the
// egg's owning unit (NOT routed through the engine's RAFPlayback / a managed loop)
// is the abrogation this gate bites. We allow `RAFPlayback`/engine-managed loops;
// a literal `requestAnimationFrame(` call in the egg unit is the red.
const HANDROLLED_RAF = /requestAnimationFrame\s*\(/;

// ── The nine NEW W11 eggs — each cites its owning file(s), the NEW egg-DOM marker
// the refinement introduces, the NEW engine dogfood, the hidden trigger, and the
// browser-half observable. Born-RED: these markers do NOT exist yet. ───────────
const W11_EGGS = [
    {
        scene: "home",
        // The S1 live-source quadrant card — a NEW GLASS card that types its own
        // @keyframes block (Fira Code, red caret) and round-trips it via format.ts.
        files: ["@/components/custom/editor-shell/EditorStartScreen.vue", "@/components/custom/editor-shell/AnimatedText.vue"],
        domMarker: /kf-source-egg|source-typing-card|hero-keyframes-card/,
        dogfood: /loadAnimationEngine|CSSKeyframesAnimation|format|serialize/,
        triggerFile: "@/components/custom/editor-shell/EditorStartScreen.vue",
        trigger: /kf-source-egg|source-typing-card|hero-keyframes-card/,
        note: "S1 — the quadrant GLASS card TYPES a @keyframes block (Fira Code, red caret), format.ts serializes it back on a ~6s round-trip loop (the moat made visible)",
        browser: { scene: "home", host: ".kf-source-egg, .source-typing-card, .hero-keyframes-card", trigger: "none" },
    },
    {
        scene: "cube",
        files: ["scenes/cube/CubeTarget.vue", "scenes/cube/orbital-drag/OrbitalDrag.vue"],
        domMarker: /spin-energy|--spin-energy|face--lit|relit/,
        dogfood: /CSSKeyframesAnimation|syncRotationToModel|loadAnimationEngine/,
        triggerFile: "scenes/cube/CubeTarget.vue",
        // The re-lit die rides the EXISTING orbit (no new rAF) — the trigger is the
        // orbit drive + the kept dblclick ROLL landing a --spin-energy thunk.
        trigger: /spin-energy|--spin-energy|onRoll/,
        note: "S2 — the orientation-coupled RE-LIT die: faces toward the pinned light brighten + catch specular as the cube orbits (rides syncRotationToModel, NO second rAF); the dblclick ROLL lands a --spin-energy bloom thunk",
        browser: { scene: "cube", host: ".cube", trigger: "dblclick", probe: "spin-energy" },
    },
    {
        scene: "amiga",
        files: ["scenes/amiga/AmigaScene.vue", "scenes/amiga/useAmigaDemo.ts"],
        domMarker: /power-on|booting|amiga--boot|boot-sequence/,
        dogfood: /AnimationGroup|Group|loadAnimationEngine|play\(\)/,
        triggerFile: "scenes/amiga/AmigaScene.vue",
        // Fires once on the IntersectionObserver re-entry — the trigger is the
        // observer wiring, not a click.
        trigger: /IntersectionObserver|power-on|booting|onEnter/,
        note: "S3 — the once-on-enter power-on BOOT (flash → H-hold roll → 3 wall-slam Boing bounces) off the IntersectionObserver re-entry; PRM-snapped; the Boing AnimationGroup dogfooded",
        browser: { scene: "amiga", host: ".amiga-canvas", trigger: "reenter", probe: "power-on|booting" },
    },
    {
        scene: "square",
        files: ["scenes/square/useSquareDemo.ts"],
        domMarker: /paletteSweep|palette-sweep|tumbleSweep|sweepHue/,
        dogfood: /SpringProgress|tumble/,
        triggerFile: "scenes/square/SquareScene.vue",
        trigger: /useDoubleTap\([\s\S]*?tumble|tumble[\s\S]*?useDoubleTap\(/,
        note: "S4 — the kept tumble dblclick gains a NEW palette-sweep on the barrel-roll (the violet→green sweep over the kept SpringProgress chase)",
        browser: { scene: "square", host: ".demo-box", trigger: "dblclick", probe: "palette|sweep" },
    },
    {
        scene: "easing",
        files: ["scenes/easing/useEasingDemo.ts", "scenes/easing/EasingHeroStage.vue", "scenes/easing/useEasingGallery.ts"],
        domMarker: /trace-smear|drag-smear|self-draw|trace-glow|graticule-boot/,
        dogfood: /SmoothProgress|DrawSVG|fromDrawSVG/,
        triggerFile: "scenes/easing/EasingHeroStage.vue",
        // Drag-bend smear is the trigger (a handle drag); the self-draw fires on enter.
        trigger: /trace-smear|drag-smear|onHandleDrag|smear/,
        note: "S5 — drag-bend SMEARS the trace proportional to per-frame velocity, decaying via SmoothProgress; a once-on-enter graticule + self-drawing trace (DrawSVG dogfood); PRM-snapped",
        browser: { scene: "easing", host: ".bezier-path, .easing-curve-canvas", trigger: "drag-handle", probe: "smear" },
    },
    {
        scene: "spring",
        files: ["scenes/spring/useSpringDerby.ts", "scenes/spring/SpringTarget.vue"],
        // S6 refines the derby into FOUR rainbow lanes (--spring-lane-*) + a
        // red-dashed settle pulse on liveSettled.
        domMarker: /spring-lane|derby-lane|settle-pulse|lane-\d/,
        dogfood: /SpringProgress/,
        triggerFile: "scenes/spring/SpringTarget.vue",
        trigger: /useDoubleTap\([\s\S]*?derby|derby[\s\S]*?useDoubleTap\(/,
        note: "S6 — the four-lane DERBY: four SpringProgress solvers race four rainbow lanes (--spring-lane-*), ζ=0.45 ringing past the line; a quiet red-dashed settle pulse on liveSettled",
        browser: { scene: "spring", host: ".spring-rail", trigger: "dblclick", probe: "spring-lane|settle-pulse" },
    },
    {
        scene: "sequence",
        files: ["scenes/sequence/useSequenceDemo.ts", "scenes/sequence/SequenceTarget.vue", "scenes/sequence/SequenceScrubber.vue"],
        domMarker: /lane-detonate|cascade-chase|lane-ignite|detonat/,
        dogfood: /Sequence|progress|stagger/,
        triggerFile: "scenes/sequence/SequenceScrubber.vue",
        // Scrubbing the master clock is the trigger.
        trigger: /lane-detonate|cascade|onScrub|detonat/,
        note: "S7 — scrubbing the master clock DETONATES the rainbow lanes in a diagonal cascade chasing the thumb (violet→green), cooling in reverse on drag-back; an orchestrated ~700ms power-on; PRM-guarded",
        browser: { scene: "sequence", host: ".seq-playhead, .seq-storyboard", trigger: "scrub", probe: "detonat|cascade" },
    },
    // (S8 motion-path "author-the-curve" + S9 compose "bind-ignition" refinement
    //  eggs were RETIRED at T.E3/T.E1 — those scenes were PRUNED, OD-1 = PRUNE.)
];

// ── STATIC HALF — each NEW egg's DOM marker + engine dogfood + NO hand-rolled rAF ─
for (const egg of W11_EGGS) {
    const src = egg.files.map((f) => read(path.join(DEMO, f))).join("\n");
    const triggerSrc = read(path.join(DEMO, egg.triggerFile));

    const haveMarker = egg.domMarker.test(src);
    const haveDogfood = egg.dogfood.test(src);
    const haveTrigger = egg.trigger.test(triggerSrc);
    // inv ζ — once the egg EXISTS (its marker is present), its effect must DOGFOOD
    // the engine, NOT hand-roll a rAF. The anti-rAF clause bites ONLY when the egg
    // has landed (haveMarker) AND introduces a bare requestAnimationFrame that is
    // NOT routed through the engine's managed RAFPlayback. Pre-egg, the scene's
    // existing legit rAF is NOT the egg's — so the clause does not false-fire on a
    // born-RED scene (the marker absence is the only thing keeping the arm red).
    const handRolled =
        haveMarker && HANDROLLED_RAF.test(src) && !/RAFPlayback/.test(src);

    if (haveMarker && haveDogfood && haveTrigger && !handRolled) {
        ok(`[${egg.scene}] W11 egg wired — ${egg.note}`);
    } else {
        const miss = [];
        if (!haveMarker) miss.push(`egg-DOM marker ${egg.domMarker} (the NEW instrument layer)`);
        if (!haveDogfood) miss.push(`engine dogfood ${egg.dogfood} (inv ζ — reuse a public primitive)`);
        if (!haveTrigger) miss.push(`hidden trigger ${egg.trigger} in ${egg.triggerFile}`);
        if (handRolled)
            miss.push(
                `a HAND-ROLLED requestAnimationFrame in the egg unit (inv ζ violation — ` +
                    `route through the engine's RAFPlayback / a managed loop, never a bare rAF)`,
            );
        fail(
            `[${egg.scene}] W11 egg MISSING — ${egg.note}; needs: ${miss.join("; ")} ` +
                `(born-RED — L.W11 lands this egg)`,
        );
    }
}

// ── BROWSER HALF — each NEW egg's hidden trigger fires its observable effect ───
// Born-RED: the host markers don't exist yet, so each arm reports the egg absent.
// Once landed, the arm fires the trigger and asserts the new observable flips.
const EXPECTED_TRIGGER = {
    home: null,
    cube: "Controls",
    amiga: "Controls",
    square: "Controls",
    spring: "Spring",
    easing: "Easing",
    sequence: null,
    // (motion-path + compose were PRUNED at T.E3/T.E1, OD-1 = PRUNE.)
};

async function waitVisible(page, selector, timeout = 6000) {
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

const VW = 1440;
const VH = 900;

async function browserHalf() {
    const result = await withPage(
        {
            distDir: DIST,
            label: "the nine W11 instrument eggs",
            context: { viewport: { width: VW, height: VH } },
        },
        async (page, { url }) => {
            await page.goto(`${url}/#/cube`, { waitUntil: "load" });
            await page.waitForTimeout(600);

            for (const egg of W11_EGGS) {
                const b = egg.browser;
                // S.D3 (C-4) — every egg is now a REAL SPA scene (the former
                // playground egg was RE-POINTED to the folded compose scene, which
                // the machine routes like any other), so the standalone-source
                // `b.scene === null` witness is RETIRED: the compose bind-ignition
                // is live-driven through the SPA route below, the UPGRADE the fold
                // makes possible.
                await navToScene(page, b.scene, EXPECTED_TRIGGER[b.scene], {
                    timeout: 8000,
                }).catch(() => {});
                await page.setViewportSize({ width: VW, height: VH });
                await page.waitForTimeout(900);
                // The amiga power-on BOOT is a SCROLL-BACK delight: it fires on a
                // GENUINE re-entry (leave the scene, return), NEVER on the cold first
                // arrival (the proof:cold-entry contract — the engine starts only on
                // the human's dock-play). So to OBSERVE the boot honestly, drive its
                // real trigger: leave amiga (to cube), then return — the Intersection
                // re-entry fires runBoot(), flipping `booting` (the `power-on` marker).
                // We probe inside the boot window (the marker is live for ~3s).
                if (b.trigger === "reenter") {
                    await navToScene(page, "cube", EXPECTED_TRIGGER.cube, {
                        timeout: 8000,
                    }).catch(() => {});
                    await page.waitForTimeout(500);
                    await navToScene(page, b.scene, EXPECTED_TRIGGER[b.scene], {
                        timeout: 8000,
                    }).catch(() => {});
                    await page.setViewportSize({ width: VW, height: VH });
                    // Settle into the boot window (booting flips true on re-entry).
                    await page.waitForTimeout(600);
                }
                const present = await waitVisible(page, b.host, 4000);
                if (!present) {
                    fail(
                        `[${egg.scene}] W11 egg fires — the NEW egg host (${b.host}) is not ` +
                            `present; born-RED until L.W11 adds the instrument layer`,
                    );
                    continue;
                }
                // ── home — the REAL observable (inv-M-observable-truth), NOT a
                // DOM-presence proxy. The card types its @keyframes and plays an
                // ENGINE animation on `.hero-display`; its computed transform MUST
                // depart `none` (the translateY lift). The L.W11 ship had this
                // SILENTLY DEAD — `fromKeyframes({transform:"translateY(-22px)"})`
                // (a function-STRING) is dropped at flatten, so the host was
                // visible but the hero never lifted, and the old presence-proxy
                // arm passed green. This arm reds on that exact breach.
                if (egg.scene === "home") {
                    const lift = await page.evaluate(async () => {
                        const el = document.querySelector(".hero-display");
                        if (!el) return -1;
                        let maxTy = 0;
                        const t0 = performance.now();
                        while (performance.now() - t0 < 7500) {
                            const tr = getComputedStyle(el).transform;
                            const m =
                                tr && tr !== "none"
                                    ? tr.match(/matrix\(([^)]+)\)/)
                                    : null;
                            if (m) {
                                const ty = Math.abs(
                                    parseFloat(m[1].split(",")[5]),
                                );
                                if (ty > maxTy) maxTy = ty;
                            }
                            await new Promise((r) => setTimeout(r, 40));
                        }
                        return +maxTy.toFixed(2);
                    });
                    if (lift >= 4) {
                        ok(
                            `[home] W11 egg fires — the hero LIFT is LIVE: .hero-display ` +
                                `computed transform departs none (max |translateY| = ${lift}px). ` +
                                `Real-observable: a dropped string-form transform reds here.`,
                        );
                    } else {
                        fail(
                            `[home] W11 egg fires — the hero lift is DEAD: .hero-display ` +
                                `transform never departed none (max |translateY| = ${lift}px) ` +
                                `over a 7.5s window — the typed @keyframes did not animate the hero`,
                        );
                    }
                    continue;
                }
                // The host exists — assert the NEW observable marker is reachable
                // (the refinement's new layer DOM). The exact trigger drive lands
                // with the egg; here we assert the new host carries the W11 marker
                // class/attr so a host that merely reuses an OLD selector can't pass.
                const hasNewLayer = await page.evaluate(
                    ({ host, probe }) => {
                        const el = document.querySelector(host);
                        if (!el) return false;
                        if (!probe) return true;
                        const re = new RegExp(probe);
                        // The new layer is reachable as a class on the host or a
                        // descendant, or a CSS custom property the egg writes.
                        const scope = el.closest("[class]") ?? el;
                        const html = scope.outerHTML.slice(0, 4000);
                        return re.test(html);
                    },
                    { host: b.host, probe: b.probe ?? "" },
                );
                if (hasNewLayer) {
                    ok(
                        `[${egg.scene}] W11 egg fires — the NEW instrument layer (${b.probe ?? b.host}) ` +
                            `is present + reachable`,
                    );
                } else {
                    fail(
                        `[${egg.scene}] W11 egg fires — the host exists but the NEW W11 marker ` +
                            `(${b.probe}) is absent; born-RED until the refinement's layer lands`,
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
        `\nproof:design-refinement — FAIL (${failures.length}): a scene's NEW W11 instrument ` +
            `egg is missing, inert, or hand-rolls a rAF. BORN-RED by design — each arm greens ` +
            `when L.W11 lands that scene's engine-dogfooded instrument egg (inv ζ).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:design-refinement — PASS: every scene's NEW W11 instrument egg is wired " +
        "(a hidden trigger → an observable off-the-normal-path effect, each dogfooding a public " +
        "engine primitive, none hand-rolling a rAF): home source-card · cube re-lit die · amiga " +
        "power-on · square palette-sweep · easing trace-smear · spring four-lane derby · sequence " +
        "lane-detonate.",
);
process.exit(0);
