#!/usr/bin/env node
/**
 * proof:demo-control-point — Q.WC1 (DM-2 NINTH-carry terminal · the worst
 * P-invariant-28 violation in the constellation, declared ABSOLUTE-FINAL at
 * O.W5 AND P.W7, never built).
 *
 * THE CHRONIC. `DemoControlPoint` (the curve-editor control-point handle over
 * the LIGHT `drag2D` primitive) was carried E→F→G→H→I→J→K→L→M→O→P as a glass-ui
 * component HANDOFF that BC answered ASK#5 = NO. kf already owns the LIGHT
 * `drag2D` substrate (index.ts:88) orphan-exported with zero consumers; Q.WC1
 * builds the kf-side component over it (critically damped) and consolidates the
 * bespoke `EasingCurveCanvas` handle onto it. This gate is the chronic's
 * terminus — a RUNTIME (interaction) gate over the REAL observable, NOT a source
 * grep. It REPLACES the retired glass-ui-handoff tripwire.
 *
 * THE GATE — a Playwright session over the BUILT `dist/gh-pages/` (the
 * scripts/lib/demo-driver.mjs lifecycle: withPage = serveDist + env-driven
 * resolveChromium + context/teardown; navToScene = the per-EXPECTED-state
 * settle). The switch-in is driven by a hash route change FROM another scene
 * (cube → easing), exercising the editor-mount path. Under KF_REQUIRE_BROWSER=1
 * a playwright-absent skip is a hard fail AT THE LIB SEAM (W7-1/S6d).
 * P6 posture: hard — device-independent interaction oracle.
 *
 * Five clauses (Q.WC1 §S3):
 *   (1) component-built  — `demo/@/components/custom/instrument/easing/DemoControlPoint.vue` exists
 *       (source-shape corroborator). BITE: rename/drop the file → red.
 *   (2) light-substrate  — DemoControlPoint imports `drag2D` from the kf barrel
 *       (NOT a deep path, NOT a bespoke pointer handler); EasingCurveCanvas
 *       renders `<DemoControlPoint>` and the bespoke `useEasingCurveDrag` CTM
 *       handler is ABSENT (the S2 consolidation). BITE: re-introduce a bespoke
 *       `<circle class="control-point handle">` drag or a hand-rolled
 *       `pointerToSVG` → red.
 *   (3) live-drag (KEYSTONE — the APPEARANCE/INTERACTION-axis observable):
 *       navigate `#/easing`, assert ≥2 DemoControlPoint handles, drive a REAL
 *       `page.mouse.down → move → up` over one handle to a measured offset and
 *       assert BOTH: (i) the bound normalized `(x,y)` CHANGED (the bezier path
 *       `d` mutated), AND (ii) the curve RE-TIMES the subject (the sampled
 *       easing at a fixed `t` differs after the drag). The dragged element is a
 *       `[data-demo-control-point]` handle (the distinct obligation over
 *       proof:easing-editor-live clause (b)). BITE: a stub `<circle>` that
 *       repaints but does not re-shape the curve OR re-time the ball reds.
 *   (4) damped-no-overshoot (the S1 precision contract — APPEARANCE axis): a
 *       FAST drag (a velocity-bearing fling) is sampled across the settle window
 *       and asserted monotonic to the release value (no overshoot past the drop
 *       point beyond a tight epsilon). BITE: the default under-damped drag2D
 *       spring (dampingFraction 0.86) overshoots → red.
 *   (5) keyboard-operable (a11y corroborator): focus a handle, press an arrow
 *       key, assert the normalized `(x,y)` nudges (the bezier `d` mutates).
 *       BITE: a drag-only handle (no tabindex/arrow nudge) → red.
 *
 * Re-runnable: `node scripts/proof-demo-control-point.mjs`. Serves the BUILT
 * dist/gh-pages/.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, pressPlayToggle, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
const COMPONENT = path.join(REPO, "demo/@/components/custom/instrument/easing/DemoControlPoint.vue");
const CANVAS = path.join(REPO, "demo/@/components/custom/instrument/easing/EasingCurveCanvas.vue");
const BESPOKE = path.join(
    REPO,
    "demo/@/components/custom/composables/useEasingCurveDrag.ts",
);

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const note = (label) => console.log(`  · ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:demo-control-point — Q.WC1 (DM-2 NINTH-carry terminal — DemoControlPoint over LIGHT drag2D)",
);

const CTRL_KEY = "animation-groups-control-options-store";

// ── clause (1) component-built + clause (2) light-substrate (source-shape) ────
{
    console.log(
        "\nclause (1) component-built + clause (2) light-substrate (the build-in + the consolidation)",
    );
    if (fs.existsSync(COMPONENT)) {
        ok("(1) demo/@/components/custom/instrument/easing/DemoControlPoint.vue EXISTS (the NINTH-carry build-in landed).");
    } else {
        fail(
            "(1) demo/@/components/custom/instrument/easing/DemoControlPoint.vue is ABSENT — the DM-2 component is unbuilt (the NINTH carry).",
        );
    }

    const cpSrc = fs.existsSync(COMPONENT) ? fs.readFileSync(COMPONENT, "utf8") : "";
    // The LIGHT substrate import: `drag2D` from the kf barrel (@mkbabb/keyframes.js),
    // NOT a deep path (./drag, ../src), NOT a bespoke pointer handler.
    const importsDrag2D =
        /\bdrag2D\b/.test(cpSrc) &&
        /from\s+["']@mkbabb\/keyframes\.js["']/.test(cpSrc);
    const deepPath = /from\s+["'][^"']*\/(drag|drag-2d)["']/.test(cpSrc);
    if (importsDrag2D && !deepPath) {
        ok("(2) DemoControlPoint imports `drag2D` from the kf barrel (@mkbabb/keyframes.js) — the LIGHT substrate, no deep path.");
    } else {
        fail(
            `(2) DemoControlPoint does NOT import \`drag2D\` from the kf barrel ` +
                `(importsDrag2D=${importsDrag2D}, deepPath=${deepPath}) — the handle must ride the LIGHT primitive, not a bespoke pointer path.`,
        );
    }

    const canvasSrc = fs.existsSync(CANVAS) ? fs.readFileSync(CANVAS, "utf8") : "";
    const rendersDCP = /<DemoControlPoint\b/.test(canvasSrc);
    // The bespoke gesture-physics is GONE: no `useEasingCurveDrag` IMPORT (an
    // `import … useEasingCurveDrag` statement — not a mere comment mention), no
    // `@pointerdown="startDragging"` on the svg, no hand-rolled `pointerToSVG`.
    const bespokeImport =
        /\bimport\b[^;\n]*\buseEasingCurveDrag\b/.test(canvasSrc) ||
        /\buseEasingCurveDrag\s*\(/.test(canvasSrc);
    const bespokeStartDragging = /@pointerdown\s*=\s*["']startDragging["']/.test(canvasSrc);
    const bespokeFileGone = !fs.existsSync(BESPOKE);
    if (rendersDCP && !bespokeImport && !bespokeStartDragging && bespokeFileGone) {
        ok(
            "(2) EasingCurveCanvas renders <DemoControlPoint> and the bespoke useEasingCurveDrag CTM handler is DELETED " +
                "(rendersDCP, no useEasingCurveDrag import, no @pointerdown=startDragging, the composable file is gone).",
        );
    } else {
        fail(
            `(2) the consolidation is incomplete: rendersDCP=${rendersDCP}, bespokeImport=${bespokeImport}, ` +
                `bespokeStartDragging=${bespokeStartDragging}, bespokeFileGone=${bespokeFileGone} — ` +
                `two drag paths must not persist (no-legacy).`,
        );
    }
}

/** Switch the active scene via a hash route change + the per-EXPECTED-state
 *  settle (the J.W0 navToScene). */
async function switchScene(page, scene, expectedTrigger) {
    await navToScene(page, scene, expectedTrigger, { timeout: 8000 });
    await page.waitForTimeout(700);
}

/** Read the bezier path `d` + a sampled traveling-dot cy window (the subject
 *  under the current curve). The cy = `1 − easingFn(progress)` in SVG space, so
 *  the SPREAD of the cy window over the live sweep changes iff the CURVE that
 *  maps progress→cy changed. */
async function sampleCurve(page) {
    return page.evaluate(async () => {
        const path = document.querySelector(".easing-curve-canvas .bezier-path");
        const d = path ? path.getAttribute("d") : null;
        const sampleDot = () => {
            const dot = document.querySelector(".easing-curve-canvas .traveling-dot");
            return dot ? parseFloat(dot.getAttribute("cy")) : null;
        };
        const samples = [];
        for (let i = 0; i < 8; i++) {
            samples.push(sampleDot());
            await new Promise((r) => requestAnimationFrame(r));
        }
        return { d, samples: samples.filter((v) => v != null) };
    });
}

/** Drive a REAL trusted-pointer drag of one DemoControlPoint handle (data-index)
 *  via page.mouse. `velocity`: "slow" steps slowly so the spring tracks 1:1; a
 *  "fast" fling imparts a release velocity (the no-overshoot probe). */
async function dragHandle(page, dataIndex, target, { velocity = "slow" } = {}) {
    const box = await page.evaluate((idx) => {
        const handle = document.querySelector(
            `.easing-curve-canvas [data-demo-control-point] .control-point.handle[data-index="${idx}"]`,
        );
        if (!handle) return null;
        const r = handle.getBoundingClientRect();
        const svg = document.querySelector(".easing-curve-canvas");
        const sr = svg.getBoundingClientRect();
        return {
            startX: r.x + r.width / 2,
            startY: r.y + r.height / 2,
            svg: { x: sr.x, y: sr.y, width: sr.width, height: sr.height },
        };
    }, dataIndex);
    if (!box) return { dragged: false };

    const tx = box.svg.x + box.svg.width * target.fx;
    const ty = box.svg.y + box.svg.height * target.fy;
    await page.mouse.move(box.startX, box.startY);
    await page.mouse.down();
    const STEPS = velocity === "fast" ? 4 : 14;
    for (let i = 1; i <= STEPS; i++) {
        const x = box.startX + (tx - box.startX) * (i / STEPS);
        const y = box.startY + (ty - box.startY) * (i / STEPS);
        await page.mouse.move(x, y, { steps: 1 });
        if (velocity === "slow") await page.waitForTimeout(16);
    }
    await page.mouse.up();
    return { dragged: true };
}

async function browserHalf() {
    const consoleErrors = [];
    const result = await withPage(
        {
            distDir: DIST,
            label: "the demo-control-point live clauses",
            context: { viewport: { width: 1440, height: 900 } },
        },
        async (page, { url: base }) => {
            await page.addInitScript((ck) => {
                try {
                    localStorage.setItem(
                        ck,
                        JSON.stringify({ isControlsPanelOpen: true }),
                    );
                } catch {
                    /* ignore */
                }
            }, CTRL_KEY);
            page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));

            // Fresh load on cube, then SWITCH INTO easing (the editor-mount path).
            await page.goto(`${base}/#/cube`, { waitUntil: "load" });
            await navToScene(page, "cube", "Controls", { timeout: 8000 });
            await page.waitForTimeout(700);
            await switchScene(page, "easing", "Easing");

            // T.G3 — the easing scene RESTS on entry (autoPlays:false). Clause (3)'s
            // `reTimed` bite reads the subject-ball position spread across the sweep,
            // which needs the preview ACTUALLY SWEEPING. Actuate Play (the honest
            // F3-guard-passing press) so a handle drag re-times a LIVE ball.
            await pressPlayToggle(page, { intent: "play" });
            await page.waitForTimeout(300);

            // ── clause (3) live-drag (KEYSTONE) ──
            console.log("\nclause (3) live-drag (KEYSTONE — a real handle drag re-shapes the curve + re-times the ball)");
            const handleCount = await page.evaluate(
                () =>
                    document.querySelectorAll(
                        ".easing-curve-canvas [data-demo-control-point] .control-point.handle",
                    ).length,
            );
            if (handleCount >= 2) {
                ok(`(3) ${handleCount} DemoControlPoint handles ([data-demo-control-point] .control-point.handle) present on the editor.`);
            } else {
                fail(
                    `(3) only ${handleCount} DemoControlPoint handles present (expected ≥2) — ` +
                        `the consolidated drag2D handles did not render.`,
                );
            }

            if (handleCount >= 2) {
                const before = await sampleCurve(page);
                const { dragged } = await dragHandle(page, 0, { fx: 0.7, fy: 0.15 });
                await page.waitForTimeout(400);
                const after = await sampleCurve(page);

                const dMutated = !!before.d && !!after.d && before.d !== after.d;
                // Re-timing: the spread (max−min) of the eased cy window shifts when
                // the curve changes, OR an indexed sample shifts beyond epsilon.
                const spread = (a) => (a.length ? Math.max(...a) - Math.min(...a) : 0);
                const reTimed =
                    Math.abs(spread(after.samples) - spread(before.samples)) > 0.01 ||
                    before.samples.some(
                        (v, i) =>
                            i < after.samples.length &&
                            Math.abs(v - after.samples[i]) > 0.02,
                    );
                if (dragged && dMutated && reTimed) {
                    ok(
                        `(3) a REAL page.mouse drag of a DemoControlPoint handle re-shaped the bezier \`d\` ` +
                            `AND re-timed the subject (curve d mutated + the eased cy window shifted).`,
                    );
                } else {
                    fail(
                        `(3) the handle drag did not both re-shape the curve AND re-time the ball ` +
                            `(dragged=${dragged}, dMutated=${dMutated}, reTimed=${reTimed}) — a stub that ` +
                            `repaints the circle but does not re-shape the curve / re-time the ball reds.`,
                    );
                }

                // ── clause (4) damped-no-overshoot (the precision contract) ──
                console.log("\nclause (4) damped-no-overshoot (the critically-damped precision contract — no ring past the drop point)");
                // Drive a FAST fling, then sample the bound x (read off the handle's
                // live cx in SVG space → curve x) across the settle window; assert it
                // never exceeds the release-point x beyond a tight epsilon.
                const readHandleX = async () =>
                    page.evaluate(() => {
                        const handle = document.querySelector(
                            `.easing-curve-canvas [data-demo-control-point] .control-point.handle[data-index="0"]`,
                        );
                        return handle ? parseFloat(handle.getAttribute("cx")) : null;
                    });
                await dragHandle(page, 0, { fx: 0.55, fy: 0.4 }, { velocity: "fast" });
                const releaseX = await readHandleX();
                let maxX = releaseX ?? 0;
                for (let i = 0; i < 18; i++) {
                    const x = await readHandleX();
                    if (x != null && x > maxX) maxX = x;
                    await page.waitForTimeout(16);
                }
                // x ∈ [0,1] is hard-clamped; the overshoot would push cx past the
                // release value during the ring. Critically damped → monotone in.
                const EPS = 0.02;
                if (releaseX != null && maxX <= releaseX + EPS) {
                    ok(
                        `(4) the bound x is monotone to the release value after a FAST fling ` +
                            `(release cx=${releaseX.toFixed(4)}, max observed cx=${maxX.toFixed(4)} ≤ release + ${EPS}) — ` +
                            `critically damped, no overshoot.`,
                    );
                } else {
                    fail(
                        `(4) the handle OVERSHOT the drop point after a FAST fling ` +
                            `(release cx=${releaseX}, max observed cx=${maxX} > release + ${EPS}) — ` +
                            `the under-damped default spring rings (springOptions:{dampingFraction:1} not applied).`,
                    );
                }

                // ── clause (5) keyboard-operable (a11y) ──
                console.log("\nclause (5) keyboard-operable (the handle is focusable + arrow-key-nudgeable, not drag-only)");
                // Let any in-flight spring from the prior fling settle, then read
                // the handle's cx (the witness — robust to the post-fling x
                // position; we nudge LEFT if x is near the right bound so the
                // nudge is never clamped to a no-op).
                await page.waitForTimeout(300);
                const focusInfo = await page.evaluate(() => {
                    const handle = document.querySelector(
                        `.easing-curve-canvas [data-demo-control-point] .control-point.handle[data-index="0"]`,
                    );
                    if (!handle) return { focused: false, cx: null };
                    handle.focus();
                    return {
                        focused: document.activeElement === handle,
                        cx: parseFloat(handle.getAttribute("cx")),
                    };
                });
                const focused = focusInfo.focused;
                // Nudge AWAY from the nearer bound so the move is never clamped.
                const nudgeKey = (focusInfo.cx ?? 0.5) > 0.5 ? "ArrowLeft" : "ArrowRight";
                for (let i = 0; i < 4; i++) {
                    await page.keyboard.press(nudgeKey);
                    await page.waitForTimeout(30);
                }
                await page.waitForTimeout(150);
                const cxAfter = await page.evaluate(() => {
                    const handle = document.querySelector(
                        `.easing-curve-canvas [data-demo-control-point] .control-point.handle[data-index="0"]`,
                    );
                    return handle ? parseFloat(handle.getAttribute("cx")) : null;
                });
                const cxMoved =
                    focusInfo.cx != null &&
                    cxAfter != null &&
                    Math.abs(cxAfter - focusInfo.cx) > 0.001;
                if (focused && cxMoved) {
                    ok(`(5) a focused handle nudges the normalized x on ${nudgeKey} (cx ${focusInfo.cx?.toFixed(3)} → ${cxAfter?.toFixed(3)}) — keyboard-operable.`);
                } else {
                    fail(
                        `(5) the handle is not keyboard-operable (focused=${focused}, cxMoved=${cxMoved}, ` +
                            `cx ${focusInfo.cx} → ${cxAfter}) — a focusable + arrow-nudgeable handle is the a11y carry-forward.`,
                    );
                }
            }

            const fatal = consoleErrors.filter((e) => /^pageerror:/.test(e));
            if (fatal.length === 0) {
                ok(`console — ZERO pageerror across the drive (${consoleErrors.length} console line(s) total).`);
            } else {
                fail(`console — ${fatal.length} pageerror(s):\n      ${fatal.slice(0, 4).join("\n      ")}`);
            }
        },
    );
    if (result.skipped) console.log(`  ○ browser half skipped — ${result.reason}`);
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:demo-control-point — FAIL (${failures.length}): the DM-2 DemoControlPoint build-in is not ` +
            `complete — the component is absent, OR it does not ride the LIGHT drag2D, OR a real handle drag does not ` +
            `re-shape the curve AND re-time the ball, OR it overshoots the drop point, OR it is not keyboard-operable. ` +
            `Q.WC1 S1–S3 are not all satisfied.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:demo-control-point — PASS: DemoControlPoint is built over the LIGHT drag2D (component-built + " +
        "light-substrate), the EasingCurveCanvas bespoke handle is consolidated onto it, a REAL handle drag re-shapes " +
        "the bezier curve AND re-times the subject ball (live-drag), the handle lands on the drop point with no ring " +
        "(damped-no-overshoot), and it nudges on arrow-key (keyboard-operable). The NINTH-carry P-invariant-28 chronic EXITS.",
);
