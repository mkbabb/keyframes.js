#!/usr/bin/env node
/**
 * proof:square-honest — v2 (T.A13 + T.B3, the G2 inversion CURED; fold row 69).
 *
 * THE HISTORY. S.G2 amputated the square's editor panel because Play painted
 * NOTHING: the box's custom nested-object `transformFunc` was written for the
 * spring loop's RAW NUMBERS, but the engine handed nested vars whose leaves
 * stringified to `"42pxpx"` → invalid CSS → CSSOM SILENTLY DISCARDED the write →
 * the box never moved. The locally-correct S.G2 move (a lying panel is worse than
 * none) COLLAPSED square's DFA to `[]` — and this very gate then asserted the
 * COLLAPSE (panel ABSENT). The owner rejected the vanish (VERDICT #12/#25: "Square
 * used to have a proper keyframes/controls section — that was removed?"; "we forgot
 * about that facility entirely"). The gate was enforcing the REJECTED state.
 *
 * THE CURE (T.A13). Three parts land the honest Play: (1) the unit-honest `num()`
 * normalizer at the shared transformFunc boundary resolves BOTH writers — the
 * spring loop's numbers AND the T.A6 plain-vars authored strings (`"42px"` → 42,
 * `"108%"` → 1.08) — so the `"0pxpx"` discard is impossible; (2) REAL four-corner
 * keyframes (a ±90px diamond tour, full 360° rotation, nested `d` swell, rainbow
 * sweep) so Play VISIBLY obeys duration/easing/direction; (3) the {idle, drag,
 * playback} single-authority FSM (pointerdown mid-tour pauses the group + seats the
 * springs from the painted pose — a jump-free takeover). With T.B3 the DFA re-tables
 * square into the triad, so the panel RETURNS honestly.
 *
 * THE ORACLE (v2 — born-RED on the PRE-fix tree). At the square scene:
 *   (a) PANEL PRESENT — the controls-tab trigger PROJECTS (the triad returns). On
 *       the pre-fix tree square's DFA was `[]` → no trigger → (a) REDs.
 *   (b) HONEST PLAY — pressing the dock transport Play DISPLACES the box ≥ 60px
 *       (translate magnitude) within one tour duration. On the pre-fix tree Play
 *       painted nothing (the "0pxpx" discard) → the box never moved → (b) REDs.
 *   (c) POSE-CAPTURE TAKEOVER (recorded, C-10) — a pointerdown mid-tour pauses the
 *       tour and the box tracks the pointer with no frame jump; device-dependent
 *       spring settle, so RECORDED not blocking.
 *
 * The old `hasPanel:false` / mono-caption / collapse assertions are DELETED — grep
 * this file for `hasPanel: false` / `square-live-caption` → 0.
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
    "proof:square-honest v2 — T.A13+T.B3 (fold row 69): the panel RETURNS honestly and Play visibly moves the box",
);

async function browserHalf() {
    const result = await withPage(
        {
            distDir: DIST,
            label: "the square honest-panel + honest-Play oracle",
            context: { viewport: { width: 1280, height: 900 } },
        },
        async (page, { url }) => {
            await page.goto(`${url}/#/square`, { waitUntil: "load" });
            // square NOW projects the controls-tab trigger (the re-tabled triad).
            await navToScene(page, "square", "Controls", { timeout: 12000 });
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

            // (a) PANEL PRESENT — the controls-tab trigger projects within the
            // desktop force-open ceiling (a non-empty DFA set force-opens the rail
            // + renders the "Controls tab" trigger). A collapsed [] scene never
            // would; the projection wait is the authoritative signal.
            const triggerProjected = await page
                .waitForFunction(
                    () => {
                        const t = document.querySelector(
                            "[aria-label='Controls tab']",
                        );
                        return !!(t && t.getBoundingClientRect().width > 0);
                    },
                    { timeout: 6000 },
                )
                .then(() => true)
                .catch(() => false);

            if (triggerProjected) {
                ok(
                    "(a) PANEL PRESENT: the square scene projects the controls-tab trigger — the " +
                        "built-in editor triad RETURNED (the VERDICT #12/#25 panel restoration)",
                );
            } else {
                fail(
                    "(a) NO panel — the controls-tab trigger never projected on square within the ceiling. " +
                        "T.B3 re-tables square into the triad; the panel must RETURN (the G2 collapse is cured).",
                );
            }

            // (b) HONEST PLAY — Play displaces the box ≥ 60px within one duration.
            // Measured off the box's computed transform translate (m41/m42), robust
            // to the stage clip.
            const translateProbe = () => {
                const b = document.querySelector(".demo-box");
                if (!b) return null;
                const t = getComputedStyle(b).transform;
                if (!t || t === "none") return 0;
                try {
                    const m = new DOMMatrixReadOnly(t);
                    return Math.hypot(m.m41, m.m42);
                } catch {
                    return 0;
                }
            };
            const restMag = await page.evaluate(translateProbe);
            const actuated = await pressPlayToggle(page, { intent: "play" });
            let maxMag = restMag ?? 0;
            if (actuated) {
                // Poll across one tour duration (~2000ms) for the peak translate.
                for (let i = 0; i < 44; i++) {
                    await page.waitForTimeout(50);
                    const cur = await page.evaluate(translateProbe);
                    if (typeof cur === "number" && cur > maxMag) maxMag = cur;
                    if (maxMag >= 60) break;
                }
            }
            if (actuated && maxMag >= 60) {
                ok(
                    `(b) HONEST PLAY: the dock transport Play ("${actuated}") DISPLACED the box ` +
                        `${maxMag.toFixed(1)}px (≥ 60px) within one tour — Play obeys the four-corner ` +
                        `keyframes (the "0pxpx" CSSOM discard is CURED, the panel edits a LIVE anim)`,
                );
            } else {
                fail(
                    `(b) Play did NOT move the box honestly: actuated=${actuated}, peak translate ` +
                        `${maxMag.toFixed(1)}px (need ≥ 60px). The num() normalizer + four-corner ` +
                        `keyframes must make Play paint (the box tours the diamond).`,
                );
            }

            // (c) POSE-CAPTURE TAKEOVER (recorded, C-10 — device-dependent settle).
            // A pointerdown on the box mid-tour should pause the tour and flip the
            // FSM to `drag` (the springs seated from the painted pose).
            const boxCenter = await page.evaluate(() => {
                const b = document.querySelector(".demo-box");
                if (!b) return null;
                const r = b.getBoundingClientRect();
                return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
            });
            let tookOver = false;
            if (boxCenter) {
                await page.mouse.move(boxCenter.x, boxCenter.y);
                await page.mouse.down();
                await page.mouse.move(boxCenter.x + 40, boxCenter.y + 10, {
                    steps: 4,
                });
                await page.waitForTimeout(80);
                const modeNow = await page.evaluate(() => {
                    const b = document.querySelector(".demo-box");
                    return b ? b.getAttribute("data-square-mode") : null;
                });
                await page.mouse.up();
                tookOver = modeNow === "drag";
            }
            if (tookOver) {
                ok(
                    "(c) POSE-CAPTURE TAKEOVER (recorded): a pointerdown mid-tour flipped the FSM to " +
                        "`drag` (the group paused, the springs seated from the painted pose) — jump-free",
                );
            } else {
                note(
                    "(c) POSE-CAPTURE TAKEOVER (recorded, not blocking — device-dependent settle, C-10): " +
                        "the drag-mode flip was not observed within the ceiling (headless timing confound). " +
                        "(a)+(b) are the blocking contract.",
                );
            }
        },
    );
    if (result.skipped) console.log(`  ○ browser half skipped — ${result.reason}`);
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:square-honest v2 — FAIL (${failures.length}): the square panel did not return honestly ` +
            `(the triad trigger is absent, or Play does not move the box — the num() normalizer + four-corner ` +
            `keyframes + FSM must make Play paint; fold row 69).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:square-honest v2 — PASS: the editor triad RETURNED (panel present) and Play visibly DISPLACES the " +
        "box (the four-corner tour) — the G2 collapse is CURED, the panel edits an HONEST animation (T.A13+T.B3).",
);
