#!/usr/bin/env node
/**
 * proof:easter-egg — H.W12 §Hard gate (I3 · ONE on-aesthetic egg per scene).
 *
 * The user asked for "a few easter eggs per scene" (round-3 I3). H.W12 lands ONE
 * hidden, tasteful, on-aesthetic egg per scene, each DOGFOODING a public engine
 * primitive (inv ζ — NO hand-rolled rAF) and producing an OBSERVABLE
 * off-the-normal-path effect a hidden trigger fires. This gate asserts EACH
 * scene's egg is wired (STATIC: the trigger + the engine dogfood) AND fires its
 * observable effect (BROWSER: the hidden gesture flips the egg's state).
 *
 * The seven eggs (i-r5's primaries + the frontend-design pass):
 *   • sequence    EE-SEQ-1 "the reel"   — type "reel" → the five balls cascade in
 *                  an overshoot wave (isReeling → .reel-active).
 *   • motion-path EE-MP-2 "the wink"    — drag the traveller a FULL LAP (0→100% on
 *                  the closed loop) → the 🙂‍↔️ glyph swaps to 😎 (.mp-traveller--winking).
 *   • cube        "the Roll"            — dblclick the cube → it rolls to a random
 *                  die face on ease-out-back (.cube--rolling + the transform spins).
 *   • amiga       "the Boing"           — dblclick the stage → the 1984 Boing Ball
 *                  bounce/spin/hue group plays one arc (.amiga-canvas--boing).
 *   • square      "the Tumble"          — dblclick the box → a barrel-roll +
 *                  palette sweep (the box transform leaves rest).
 *   • spring      "the Derby"           — dblclick the rail → the canonical
 *                  trackers launch in a staggered wave (the live ball sweeps off
 *                  its rest position).
 *   (easing "the Gallery" — RETIRED at T.E7 (VERDICT #15): the gallery-door +
 *    useEasingGallery were owner-ruled removals; the T.E6 scene IS the gallery.)
 *
 * STATIC HALF (always runs — each egg's trigger + its dogfood): every scene's
 *   source carries a hidden egg trigger (a dblclick handler / a typed-code key
 *   listener / a full-lap accumulator) wired to an effect that reuses the engine.
 *   BITE: delete an egg (no trigger) → that scene's static clause reds.
 *
 * BROWSER HALF (each scene's hidden trigger fires its observable effect;
 *   settle-gated on the H.W1 FSM resting — scene switches driven IN-PAGE via the
 *   hash reconcile fixed point): for EACH scene, settle on it, fire the hidden
 *   gesture, and assert the observable off-the-normal-path effect flips. BITE:
 *   revert an egg to a no-op → its effect never fires → that scene's browser
 *   clause reds.
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * resolveChromium + context/teardown, J.W3 S1; the lib's navToScene drives the
 * IN-PAGE scene switches). Under KF_REQUIRE_BROWSER a playwright-absent skip
 * becomes a hard fail AT THE LIB SEAM. Re-runnable:
 * `node scripts/proof-easter-egg.mjs`.
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

console.log("proof:easter-egg — H.W12 (I3 · ONE hidden on-aesthetic egg per scene, inv ζ)");

// ── STATIC HALF — each egg's trigger + its engine dogfood ─────────────────────
// Each entry: [scene, file, [required source-shape tokens], human note].
const STATIC_EGGS = [
    {
        scene: "sequence",
        file: "scenes/sequence/useSequenceDemo.ts",
        tokens: [/\bplayReel\b/, /isReeling/, /REEL_STAGGER|child\.play\(\)/],
        triggerFile: "scenes/sequence/SequenceTarget.vue",
        triggerTokens: [/REEL_CODE|"reel"/, /demo\.playReel\(\)/],
        note: 'EE-SEQ-1 "the reel" — a typed-"reel" trigger replays the children as a cascading overshoot wave (isReeling → .reel-active), reusing the engine children (inv ζ)',
    },
    // (EE-MP-2 "the wink" — the motion-path full-lap 😎 glyph-swap egg — was
    //  RETIRED at T.E3: the motion-path scene was PRUNED, OD-1 = PRUNE. Noted for
    //  the easter-egg retirement ledger.)
    {
        scene: "cube",
        file: "scenes/cube/CubeTarget.vue",
        tokens: [/onRoll/, /cube--rolling/, /CSSKeyframesAnimation|ease-out-back/],
        triggerFile: "scenes/cube/CubeTarget.vue",
        triggerTokens: [/useDoubleTap\(/, /onRoll/],
        note: '"the Roll" — dblclick rolls the cube to a die face on an engine CSSKeyframesAnimation (.cube--rolling)',
    },
    //  RETIRED at T.A8/T.A10: the amiga "Boing" double-tap egg was DELETED — the
    //  Boing IS the scene now (the transport plays the continuous group), so there
    //  is no dormant egg to wake. The boing timer, the double-tap handler, the
    //  power-on boot, and the `.amiga-canvas--boing` state token are all gone
    //  (T.A8). Noted for the easter-egg retirement ledger (same lockstep genus as
    //  the motion-path EE-MP-2 retirement above).
    {
        scene: "square",
        file: "scenes/square/useSquareDemo.ts",
        tokens: [/tumble/, /SpringProgress|transformFunc|rotate/],
        triggerFile: "scenes/square/SquareScene.vue",
        triggerTokens: [/useDoubleTap\(/, /tumble/],
        note: '"the Tumble" — dblclick barrel-rolls the box via a SpringProgress folded into the paint loop',
    },
    {
        scene: "spring",
        // K.W4 colocation split — the derby effect moved into useSpringDerby.ts (the
        // egg's own sub-unit beside useSpringDemo.ts); read both so the effect tokens
        // resolve across the seam.
        file: ["scenes/spring/useSpringDemo.ts", "scenes/spring/useSpringDerby.ts"],
        tokens: [/\bderby\b/, /derbyRunning/, /spring\.target|liveSpring\.target/],
        triggerFile: "scenes/spring/SpringTarget.vue",
        triggerTokens: [/useDoubleTap\(/, /derby/],
        note: '"the Derby" — dblclick the rail launches the canonical trackers in a staggered SpringProgress wave',
    },
    // (easing "the Gallery" — RETIRED at T.E7, VERDICT #15: the gallery-door
    //  button + useEasingGallery.ts were owner-ruled removals; the redesigned
    //  easing scene (T.E6, OD-7) IS the gallery. Row re-cut in lockstep with the
    //  deletion — never green a clause by resurrecting the button.)
];

for (const egg of STATIC_EGGS) {
    // `file` may be a single path or a colocated set (a concern-seam split) — read
    // + concatenate so the effect tokens resolve across the sub-units.
    const files = Array.isArray(egg.file) ? egg.file : [egg.file];
    const src = files.map((f) => read(path.join(DEMO, f))).join("\n");
    const triggerSrc = read(path.join(DEMO, egg.triggerFile));
    const haveEffect = egg.tokens.every((re) => re.test(src));
    const haveTrigger = egg.triggerTokens.every((re) => re.test(triggerSrc));
    if (haveEffect && haveTrigger) {
        ok(`[${egg.scene}] egg wired — ${egg.note}`);
    } else {
        const missEffect = egg.tokens.filter((re) => !re.test(src)).map(String);
        const missTrigger = egg.triggerTokens
            .filter((re) => !re.test(triggerSrc))
            .map(String);
        fail(
            `[${egg.scene}] egg wired — ${egg.note}; MISSING effect token(s) ` +
                `${JSON.stringify(missEffect)} in ${egg.file} OR trigger token(s) ` +
                `${JSON.stringify(missTrigger)} in ${egg.triggerFile} (the egg must have a ` +
                `hidden trigger + an engine-dogfooding effect, inv ζ)`,
        );
    }
}

// ── BROWSER HALF ─────────────────────────────────────────────────────────────
// The destination control-tab labels navToScene settles on (the per-EXPECTED
// predicate — the proof:scene-control-dfa DFA table): cube/amiga/square keep the
// built-in "Controls" surface, spring/easing project their scene tabs,
// sequence renders NO control panel (null).
const EXPECTED_TRIGGER = {
    cube: "Controls",
    amiga: "Controls",
    square: "Controls",
    spring: "Spring",
    easing: "Easing",
    sequence: null,
};

async function settleOnScene(page, sceneId, vw, vh, settleMs = 1400) {
    await navToScene(page, sceneId, EXPECTED_TRIGGER[sceneId], { timeout: 8000 });
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

/** Fire the egg's DOUBLE-TAP on an element (S.G3 re-arm — the arming-audit
 *  class). The eggs ride the pointer-based `useDoubleTap` recognizer (touch
 *  parity; native `@dblclick` is RETIRED), which counts two genuine
 *  pointerdown→pointerup pairs on the element within its 300ms window and
 *  move-tolerance. The honest actuation is therefore the recognizer's REAL
 *  gesture: two full stationary press pairs (same point, same pointerId per
 *  pair, `isPrimary` — synthetic PointerEvents default it false and the
 *  recognizer rightly ignores secondary touches), ~80ms apart. A stationary
 *  pair is drag-disjoint by design (OrbitalDrag's capture path releases clean
 *  on a no-move up — the recognizer/drag coexistence users exercise daily).
 *  Returns false if the element is absent. */
async function fireDblclick(page, selector) {
    return page.evaluate(async (sel) => {
        const el = document.querySelector(sel);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const press = () => {
            const opts = {
                bubbles: true,
                cancelable: true,
                button: 0,
                pointerType: "touch",
                isPrimary: true,
                pointerId: 1,
                clientX: cx,
                clientY: cy,
            };
            el.dispatchEvent(new PointerEvent("pointerdown", opts));
            el.dispatchEvent(new PointerEvent("pointerup", opts));
        };
        press();
        await new Promise((res) => setTimeout(res, 80));
        press();
        return true;
    }, selector);
}

const VW = 1440;
const VH = 900;

async function browserHalf() {
    const result = await withPage(
        {
            distDir: DIST,
            label: "the seven scene eggs",
            context: { viewport: { width: VW, height: VH } },
        },
        async (page, { url, browser }) => {
        await page.goto(`${url}/#/cube`, { waitUntil: "load" });
        await page.waitForTimeout(800);

        // ── cube "the Roll" — dblclick → .cube--rolling + the transform spins ──
        {
            await settleOnScene(page, "cube", VW, VH);
            const ready = await waitVisible(page, ".cube");
            if (!ready) {
                fail("[cube] egg fires — the .cube did not mount");
            } else {
                const before = await page.evaluate(() => {
                    const cube = document.querySelector(".cube");
                    return cube.style.transform || getComputedStyle(cube).transform;
                });
                await fireDblclick(page, ".cube");
                // The roll is an engine CSSKeyframesAnimation writing the cube's
                // INLINE transform (rotateX/rotateY) over ~1.1s + the .cube--rolling
                // gesture lock; sample the window for the class OR the inline write
                // leaving its pre-roll value.
                let rolling = false;
                let transformMoved = false;
                for (let k = 0; k < 20 && !rolling && !transformMoved; k++) {
                    const probe = await page.evaluate(() => {
                        const cube = document.querySelector(".cube");
                        return {
                            rolling: cube.classList.contains("cube--rolling"),
                            transform:
                                cube.style.transform || getComputedStyle(cube).transform,
                        };
                    });
                    if (probe.rolling) rolling = true;
                    if (probe.transform && probe.transform !== before)
                        transformMoved = true;
                    await page.waitForTimeout(50);
                }
                if (rolling || transformMoved) {
                    ok(
                        `[cube] "the Roll" fires — dblclick set .cube--rolling=${rolling} ` +
                            `and/or the engine wrote the cube transform (the die-roll spins it)`,
                    );
                } else {
                    fail(
                        `[cube] "the Roll" fires — dblclick did NOT roll the cube ` +
                            `(.cube--rolling:${rolling}, transform moved:${transformMoved}); ` +
                            `the egg is inert`,
                    );
                }
            }
        }

        // ── amiga "the Boing" browser clause — RETIRED at T.A8/T.A10 ──────────
        // The Boing double-tap egg was deleted (the Boing IS the scene now — the
        // transport plays the continuous group); there is no `.amiga-canvas--boing`
        // token to actuate. The amiga static clause is retired above in lockstep.

        // ── square "the Tumble" — dblclick → the box transform leaves rest ────
        {
            await settleOnScene(page, "square", VW, VH);
            const ready = await waitVisible(page, ".demo-box");
            if (!ready) {
                fail("[square] egg fires — the .demo-box did not mount");
            } else {
                const isRest = (t) =>
                    !t ||
                    t === "none" ||
                    /^matrix\(1,\s*0,\s*0,\s*1,\s*0,\s*0\)$/.test(t);
                await fireDblclick(page, ".demo-box");
                // Sample over the tumble window — the engine rotates the box, so a
                // non-rest transform appears within a few frames.
                let moved = false;
                for (let k = 0; k < 16 && !moved; k++) {
                    const t = await page.evaluate(() => {
                        const box = document.querySelector(".demo-box");
                        return box.style.transform || getComputedStyle(box).transform;
                    });
                    if (!isRest(t)) moved = true;
                    await page.waitForTimeout(50);
                }
                if (moved) {
                    ok(
                        `[square] "the Tumble" fires — dblclick barrel-rolled the box ` +
                            `(the transform left the rest pose under the engine)`,
                    );
                } else {
                    fail(
                        `[square] "the Tumble" fires — dblclick did NOT tumble the box ` +
                            `(the transform stayed at rest over the window); the egg is inert`,
                    );
                }
            }
        }

        // ── spring "the Derby" — dblclick rail → the live ball sweeps off rest ─
        {
            await settleOnScene(page, "spring", VW, VH);
            const ready = await waitVisible(page, ".spring-rail");
            const ballReady = await waitVisible(page, ".spring-ball");
            if (!ready || !ballReady) {
                fail(
                    `[spring] egg fires — the rail/ball did not mount ` +
                        `(.spring-rail:${ready}, .spring-ball:${ballReady})`,
                );
            } else {
                const beforeLeft = await page.evaluate(
                    () => document.querySelector(".spring-ball").getBoundingClientRect().left,
                );
                await fireDblclick(page, ".spring-rail");
                // The derby launches the canonical trackers + the live ball in a
                // staggered wave, then bounces the whole field HOME at
                // launchSpan+900ms (~1.5s). The live ball sweeps in that arc — its
                // `left` moves meaningfully at SOME point (a launch-to-1 if it
                // rested at 0, or the bounce-home-to-0 if SCENE_READY restored it at
                // 1). Sample a wide window (~2.6s) and take the peak deviation from
                // the pre-derby rest, so the egg is caught regardless of the restored
                // rest position.
                let maxDelta = 0;
                for (let k = 0; k < 52; k++) {
                    const left = await page.evaluate(
                        () =>
                            document.querySelector(".spring-ball").getBoundingClientRect()
                                .left,
                    );
                    maxDelta = Math.max(maxDelta, Math.abs(left - beforeLeft));
                    await page.waitForTimeout(50);
                }
                if (maxDelta >= 20) {
                    ok(
                        `[spring] "the Derby" fires — dblclick swept the live ball off its ` +
                            `rest position (peak Δleft ${maxDelta.toFixed(0)}px — the staggered ` +
                            `SpringProgress wave + the bounce-home)`,
                    );
                } else {
                    fail(
                        `[spring] "the Derby" fires — dblclick did NOT sweep the ball ` +
                            `(peak Δleft ${maxDelta.toFixed(0)}px < 20); the egg is inert`,
                    );
                }
            }
        }

        // ── easing "the Gallery" — RETIRED at T.E7 (VERDICT #15, owner-ruled). ──
        // The gallery-door button + useEasingGallery.ts + the galleryActive seam
        // were DELETED (S.G3 had promoted a sealed dblclick egg into primary
        // chrome; the ruling is removal — the redesigned scene (T.E6, OD-7) IS
        // the gallery, so a tour of it is moot). The manifest easing:gallery row
        // was re-cut in the same motion (the lane-18-rec-3 lockstep); no clause
        // may resurrect the button.

        // ── sequence EE-SEQ-1 "the reel" — type "reel" → .reel-active ─────────
        {
            await settleOnScene(page, "sequence", VW, VH);
            const ready = await waitVisible(page, ".seq-storyboard");
            if (!ready) {
                fail("[sequence] egg fires — the storyboard did not mount");
            } else {
                // Type the hidden code "reel" (the keydown listener is scene-scoped
                // and ignores editable targets — type on the body, no input focused).
                await page.evaluate(() => {
                    document.activeElement?.blur?.();
                });
                for (const ch of "reel") {
                    await page.keyboard.press(ch);
                    await page.waitForTimeout(40);
                }
                // The reel sets isReeling → the Reel button carries .reel-active, and
                // the balls cascade (--ball-p advances off 0 in a wave).
                let fired = false;
                for (let k = 0; k < 16 && !fired; k++) {
                    fired = await page.evaluate(() => {
                        const reelBtn = document.querySelector(".reel-active");
                        if (reelBtn) return true;
                        // Fallback: any ball mid-glide (--ball-p between 0 and 1).
                        const balls = [...document.querySelectorAll(".seq-ball")];
                        return balls.some((b) => {
                            const p = parseFloat(
                                getComputedStyle(b).getPropertyValue("--ball-p"),
                            );
                            return Number.isFinite(p) && p > 0.02 && p < 0.98;
                        });
                    });
                    if (!fired) await page.waitForTimeout(40);
                }
                if (fired) {
                    ok(
                        `[sequence] EE-SEQ-1 "the reel" fires — typing "reel" set the reel ` +
                            `active (cascading overshoot wave of the engine children)`,
                    );
                } else {
                    fail(
                        `[sequence] EE-SEQ-1 "the reel" fires — typing "reel" did NOT start ` +
                            `the cascade (no .reel-active, no mid-glide ball); the egg is inert`,
                    );
                }
            }
        }

        // (the motion-path EE-MP-2 "the wink" browser clause was RETIRED at T.E3 —
        //  the motion-path scene was PRUNED, OD-1 = PRUNE.)
        },
    );
    if (result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:easter-egg — FAIL (${failures.length}): a scene's hidden egg is ` +
            `missing or inert (H.W12 I3).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:easter-egg — PASS: every scene has its hidden on-aesthetic egg, each " +
        "fired by a hidden trigger to an observable off-the-normal-path effect, each " +
        "dogfooding the engine (inv ζ): sequence reel · cube roll · square tumble · " +
        "spring derby. (easing's gallery was RETIRED at T.E7 (VERDICT #15); amiga's boing was RETIRED at T.A8 — the Boing " +
        "IS the scene now, not a hidden egg; motion-path was PRUNED at T.E3.)",
);
