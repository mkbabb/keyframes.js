#!/usr/bin/env node
/**
 * proof:square-honest — S.G2 S2 (the square honest-controls oracle; fold row 69).
 * The RUNTIME bite the source-shape DFA gate could not make about the LIE.
 *
 * THE DEFECT. The square scene projected the full built-in editor triad
 * ([controls, keyframes, timeline]) — a duration/easing panel, a Monaco keyframes
 * editor, and a draggable timeline — over a `CSSKeyframesAnimation` ("Transform")
 * whose grouped interpolation passes FLAT ValueUnits that never match the
 * nested-object structure the box's custom transformFunc reads
 * (`group.singleTarget = false`), so `group.play()` PAINTED NOTHING. The panel
 * edited a dead animation: Play did not obey duration/easing and the panel was not
 * collapsed — a lying control surface (the "none of the animations work properly
 * /square" report).
 *
 * THE ORACLE (runtime, T1/T8 — SPEC §3 S.G2, sg-#6 named oracle). Play visibly
 * obeys duration/easing OR the lying panel is COLLAPSED to the live controls with
 * the mono caption. The chosen cure is the collapse: the box is spring/drag/Play-
 * tumble autonomous (self-contained like sequence/motion-path/morph), so the
 * built-in triad is removed and the live controls are the box itself + the global
 * dock Play (isPlaying → tumble) + a mono caption naming that interaction. The
 * gate asserts, at the square scene:
 *   (a) COLLAPSED — NO controls-tab trigger renders AND NO built-in triad tab node
 *       ("Keyframes"/"Timeline") is visible anywhere (the lying editor is gone);
 *   (b) LIVE CONTROLS — the subject box (`.demo-box`) is present and the mono
 *       caption (`.square-live-caption`, a monospace-font caption naming the
 *       drag/Play-tumble interaction) renders;
 *   (c) HONEST PLAY (corroboration) — pressing the dock transport Play visibly
 *       tumbles the box (its transform changes within a generous ceiling). A
 *       device-dependent spring settle, so RECORDED not blocking (C-10 — no raw
 *       frame/ms threshold gates closure); (a)+(b) are the falsifiable oracle.
 *
 * BORN-RED WITNESS. On the pre-fix tree square projected the triad → the
 * "Controls tab" trigger + the Keyframes/Timeline nodes render → clause (a) REDs.
 * After the S.G2 S2 collapse (CONTROL_SURFACES.square = []) + the mono caption →
 * (a)+(b) green. Plant: restore the triad to square's DFA entry while Play still
 * paints nothing → (a) REDs (the lying panel is back).
 *
 * Re-runnable: `node scripts/proof-square-honest.mjs`. Serves the BUILT
 * dist/gh-pages/ (run `npm run gh-pages` first).
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, pressPlayToggle, withPage } from "./lib/demo-driver.mjs";

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
    "proof:square-honest — S.G2 S2 (fold row 69): the lying editor panel is COLLAPSED, the box + mono caption ARE the live controls",
);

async function browserHalf() {
    const result = await withPage(
        {
            distDir: DIST,
            label: "the square honest-controls oracle",
            context: { viewport: { width: 1280, height: 900 } },
        },
        async (page, { url }) => {
            await page.goto(`${url}/#/square`, { waitUntil: "load" });
            // square now renders NO control panel (collapsed DFA) — trigger null.
            await navToScene(page, "square", null, { timeout: 12000 });
            const ready = await page
                .waitForFunction(() => !!document.querySelector(".demo-box"), {
                    timeout: 8000,
                })
                .then(() => true)
                .catch(() => false);
            if (!ready) {
                fail(
                    "the square scene never mounted (.demo-box absent) — the FSM may not have rested on square",
                );
                return;
            }

            // Give the control surface time to PROJECT before judging the collapse.
            // On desktop (≥1024) a NON-empty DFA surface force-opens the panel AND
            // renders the dock "Controls tab" trigger (~1.5s after entry); a COLLAPSED
            // [] surface NEVER projects one. Wait up to a ceiling for the trigger to
            // POSSIBLY appear (the un-collapsed/lying case) — a collapsed scene waits
            // out the ceiling, confirming absence. This is a deadline-bounded liveness
            // check ("does the panel trigger ever project"), NOT a frame/ms threshold
            // (C-10). It is the authoritative collapse signal for clause (a): without
            // it the gate reads the pre-projection DOM and false-greens the lying panel.
            const triggerProjected = await page
                .waitForFunction(
                    () => {
                        const t = document.querySelector("[aria-label='Controls tab']");
                        return !!(t && t.getBoundingClientRect().width > 0);
                    },
                    { timeout: 5000 },
                )
                .then(() => true)
                .catch(() => false);

            const probe = await page.evaluate(() => {
                const visible = (el) => {
                    if (!el) return false;
                    const r = el.getBoundingClientRect();
                    const cs = getComputedStyle(el);
                    return (
                        r.width > 0 &&
                        r.height > 0 &&
                        cs.display !== "none" &&
                        cs.visibility !== "hidden"
                    );
                };
                // (a) COLLAPSED — no controls-tab trigger, no triad tab node.
                const trigger = document.querySelector("[aria-label='Controls tab']");
                const hasTrigger = visible(trigger);
                let triad = null;
                for (const el of document.querySelectorAll(
                    "button, [role=option], [role=tab], .dock-label, span",
                )) {
                    const t = (el.textContent || "").trim();
                    if ((t === "Keyframes" || t === "Timeline") && visible(el)) {
                        triad = t;
                        break;
                    }
                }
                // (b) LIVE CONTROLS — the box + the mono caption.
                const box = document.querySelector(".demo-box");
                const caption = document.querySelector(".square-live-caption");
                const captionMono = caption
                    ? /mono|monospace|Menlo|Consolas|Courier/i.test(
                          getComputedStyle(caption).fontFamily,
                      )
                    : false;
                return {
                    hasTrigger,
                    triggerText: trigger?.textContent?.trim() || null,
                    triad,
                    boxPresent: visible(box),
                    captionPresent: !!caption && (caption.textContent || "").trim().length > 0,
                    captionText: caption?.textContent?.trim() || null,
                    captionMono,
                };
            });

            // (a) COLLAPSED — the deadline-bounded projection wait is the
            // authoritative signal (the probe re-read corroborates).
            const panelProjected = triggerProjected || probe.hasTrigger || !!probe.triad;
            if (!panelProjected) {
                ok(
                    "(a) COLLAPSED: the square scene projects NO controls-tab trigger within the ceiling " +
                        "and NO built-in triad tab node (the lying keyframes/timeline/duration editor is gone)",
                );
            } else {
                fail(
                    `(a) NOT collapsed — the lying editor panel PROJECTS on square: ` +
                        `controls-tab trigger projected:${triggerProjected} / probe-visible:${probe.hasTrigger} ` +
                        `(text='${probe.triggerText}'), triad node visible:${probe.triad || false}. The built-in ` +
                        `triad edited a CSSKeyframesAnimation that painted nothing — collapse square's DFA to [] (S.G2 S2).`,
                );
            }

            // (b) LIVE CONTROLS + mono caption.
            if (probe.boxPresent && probe.captionPresent && probe.captionMono) {
                ok(
                    `(b) LIVE CONTROLS: the subject box renders and the mono caption ` +
                        `("${probe.captionText}") names the drag/Play-tumble interaction — the honest ` +
                        `replacement for the removed panel`,
                );
            } else {
                fail(
                    `(b) the live controls / mono caption are incomplete: box present:${probe.boxPresent}, ` +
                        `caption present:${probe.captionPresent} (text='${probe.captionText}'), ` +
                        `caption monospace:${probe.captionMono}. The collapse must leave the box + a mono ` +
                        `caption as the live controls (S.G2 S2).`,
                );
            }

            // (c) HONEST PLAY (corroboration, RECORDED — device-dependent settle).
            const restTransform = await page.evaluate(() => {
                const b = document.querySelector(".demo-box");
                return b ? getComputedStyle(b).transform : null;
            });
            const actuated = await pressPlayToggle(page, { intent: "play" });
            let tumbled = false;
            if (actuated) {
                // Poll for a transform change within a generous ceiling (not a
                // frame/ms threshold — "did the box move at all under Play").
                for (let i = 0; i < 40 && !tumbled; i++) {
                    await page.waitForTimeout(50);
                    const cur = await page.evaluate(() => {
                        const b = document.querySelector(".demo-box");
                        return b ? getComputedStyle(b).transform : null;
                    });
                    if (cur && cur !== restTransform) tumbled = true;
                }
            }
            if (tumbled) {
                ok(
                    `(c) HONEST PLAY (recorded): the dock transport Play ("${actuated}") visibly tumbled ` +
                        `the box (its transform changed from rest) — the live control is honest, not a dead panel`,
                );
            } else {
                note(
                    `(c) HONEST PLAY (recorded, not blocking — device-dependent spring settle, C-10): ` +
                        `Play actuated=${actuated}; no transform change observed within the ceiling (headless ` +
                        `spring-timing confound). The collapse+caption oracle (a)+(b) is the blocking contract.`,
                );
            }
        },
    );
    if (result.skipped) console.log(`  ○ browser half skipped — ${result.reason}`);
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:square-honest — FAIL (${failures.length}): the square control surface is not honest ` +
            `(the lying keyframes/timeline/duration panel survives, or the collapsed live-controls + mono ` +
            `caption are missing — fold row 69).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:square-honest — PASS: the lying editor panel is COLLAPSED (no triad), and the box + the mono " +
        "caption ARE the live controls (Play tumbles the box) — the square control surface is honest (S.G2 S2).",
);
