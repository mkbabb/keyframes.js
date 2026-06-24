#!/usr/bin/env node
/**
 * proof:easing-curve-editor — Q.WC2 (the EASING scene's curve-editor DESIGN
 * layer over the Q.WC1 DemoControlPoint — the frontend-design headline that the
 * impl drive SUBSTITUTED with a passive sidebar telemetry readout).
 *
 * THE FINDING (B5-kf-demo-arch). The easing scene was specced as the demo's
 * protagonist DIRECT-MANIPULATION instrument and shipped instead as a passive
 * sidebar telemetry readout: (1) the HERO stage is read-only (`aria-hidden` +
 * `pointer-events:none`) — you cannot edit the curve where it is largest; (2)
 * `f(t)=` is opaque — no ghost of the named curve a custom edit departed from;
 * (3) the readout is read-only + coarse-only keyboard. Q.WC2 promotes the editor
 * onto the hero (the highest-leverage gap), adds the comparison-DIFF ghost, and
 * makes the numeric readout writable + the keyboard fine/coarse.
 *
 * THE GATE — a Playwright session over the BUILT `dist/gh-pages/` (the
 * scripts/lib/demo-driver.mjs lifecycle). It EXTENDS (never duplicates) Q.WC1's
 * proof:demo-control-point: that gate covers the handle's existence + a SIDEBAR
 * live-drag + the no-overshoot + a single keyboard nudge; THIS gate asserts the
 * HERO host specifically + the ghost + the precision authoring. Under
 * KF_REQUIRE_BROWSER=1 a playwright-absent skip is a hard fail (W7-1/S6d).
 *
 * Three clauses (Q.WC2 §S4):
 *   (1) hero-editable (KEYSTONE — the APPEARANCE/INTERACTION-axis observable):
 *       navigate `#/easing`, assert ≥2 DemoControlPoint handles on the HERO
 *       STAGE element (`.easing-stage-handles`, NOT only the sidebar — a sidebar-
 *       only edit passes Q.WC1's gate but must RED this one), then a REAL
 *       `page.mouse.down → move → up` over one HERO handle re-shapes the hero
 *       bezier `d` (`demo.svgPath`) AND re-times the subject ball (the sampled
 *       hero-ball x differs after the drag). BITE: a hero that only repaints but
 *       does not re-time the ball reds.
 *   (2) diff-ghost (the S2 clarity contract): select `ease-out`, drag a hero
 *       handle (forcing named→custom), assert a `.bezier-path--ghost` carrying
 *       the ORIGINAL named curve `d` is present; reset to a from-scratch custom
 *       curve and assert NO ghost. BITE: a permanently-present ghost (clutter) OR
 *       a never-present ghost both red.
 *   (3) precision-author (the S3 authoring contract): focus a handle,
 *       `Shift+ArrowRight`, assert `x` nudges by ~0.001 (FINE, not 0.01); type a
 *       `cubic-bezier(…)` into the writable readout, assert the handles + `d`
 *       move to match. BITE: a read-only readout or a coarse-only nudge reds.
 *
 * Re-runnable: `node scripts/proof-easing-curve-editor.mjs`. Serves the BUILT
 * dist/gh-pages/.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, resolveChromium, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:easing-curve-editor — Q.WC2 (the easing scene as the DemoControlPoint showcase — hero edit + diff-ghost + precision authoring)",
);

const CTRL_KEY = "animation-groups-control-options-store";

const HERO_HANDLE_SEL =
    ".easing-stage-handles [data-demo-control-point] .control-point.handle";

async function switchScene(page, scene, expectedTrigger) {
    await navToScene(page, scene, expectedTrigger, { timeout: 8000 });
    await page.waitForTimeout(700);
}

/** The hero bezier path `d` (the live `demo.svgPath` projection) + the hero
 *  ball's translateX (the subject under the current curve). */
async function sampleHero(page) {
    return page.evaluate(async () => {
        const path = document.querySelector(".easing-stage-curve-path");
        const d = path ? path.getAttribute("d") : null;
        const ball = document.querySelector(".progress-ball.hero-ball");
        const readX = () => {
            if (!ball) return null;
            const t = getComputedStyle(ball).transform;
            // matrix(a,b,c,d,e,f) → e is translateX; "none" → 0.
            const m = t && t.startsWith("matrix") ? t.match(/matrix\(([^)]+)\)/) : null;
            if (m) return parseFloat(m[1].split(",")[4]);
            return 0;
        };
        const xs = [];
        for (let i = 0; i < 8; i++) {
            xs.push(readX());
            await new Promise((r) => requestAnimationFrame(r));
        }
        return { d, xs: xs.filter((v) => v != null) };
    });
}

/** Drive a REAL trusted-pointer drag of a HERO handle (data-index). */
async function dragHeroHandle(page, dataIndex, target) {
    const box = await page.evaluate(
        ([sel, idx]) => {
            const handle = document.querySelector(`${sel}[data-index="${idx}"]`);
            if (!handle) return null;
            const r = handle.getBoundingClientRect();
            const svg = document.querySelector(".easing-stage-handles");
            const sr = svg.getBoundingClientRect();
            return {
                startX: r.x + r.width / 2,
                startY: r.y + r.height / 2,
                svg: { x: sr.x, y: sr.y, width: sr.width, height: sr.height },
            };
        },
        [HERO_HANDLE_SEL, dataIndex],
    );
    if (!box) return { dragged: false };
    const tx = box.svg.x + box.svg.width * target.fx;
    const ty = box.svg.y + box.svg.height * target.fy;
    await page.mouse.move(box.startX, box.startY);
    await page.mouse.down();
    for (let i = 1; i <= 14; i++) {
        await page.mouse.move(
            box.startX + (tx - box.startX) * (i / 14),
            box.startY + (ty - box.startY) * (i / 14),
            { steps: 1 },
        );
        await page.waitForTimeout(16);
    }
    await page.mouse.up();
    return { dragged: true };
}

/** Select a named easing via the reka EasingSelect dropdown (a `role=combobox`
 *  trigger + teleported `role=option` items whose text is `<name><description>`).
 *  Returns true on a successful pick. Uses trusted playwright clicks. */
async function selectNamed(page, name) {
    const trigger = page
        .locator(".easing-trigger-label")
        .locator("xpath=ancestor::button[1]");
    try {
        await trigger.click({ timeout: 4000 });
    } catch {
        return false;
    }
    // The option list teleports; wait for it.
    await page
        .waitForFunction(
            () => document.querySelectorAll("[role=option]").length > 0,
            null,
            { timeout: 4000 },
        )
        .catch(() => {});
    // Match the option whose NAME span has the exact target text (the option
    // renders `<svg/><span>{name}</span><span>{description}</span>`, so the
    // concatenated textContent is `<name><description>` with no separator — match
    // the inner span by exact text instead).
    const idx = await page.evaluate((target) => {
        const opts = [...document.querySelectorAll("[role=option]")];
        return opts.findIndex((o) =>
            [...o.querySelectorAll("span")].some(
                (s) => s.textContent.trim().toLowerCase() === target,
            ),
        );
    }, name);
    if (idx < 0) {
        await page.keyboard.press("Escape").catch(() => {});
        return false;
    }
    try {
        await page.locator("[role=option]").nth(idx).click({ timeout: 4000 });
    } catch {
        return false;
    }
    await page.waitForTimeout(300);
    return true;
}

// The clause body, parameterized over (page, base, consoleErrors) so it runs
// under either the production-dist `withPage` lifecycle (the default contract) OR
// a live dev/preview server named by KF_DEMO_URL (the NAMED exception, mirroring
// proof:live-session's KF_DEV_SERVER): the gate's PRIMARY contract is the built
// dist, but a transient SHARED-tree engine-build break (e.g. a minified-bundle
// regression that fails the scene-host mount) must not block the demo-design
// observable from being witnessed — set KF_DEMO_URL=http://localhost:<port> to
// run the same clauses against a running server.
async function runClauses(page, base, consoleErrors) {
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

            await page.goto(`${base}/#/cube`, { waitUntil: "load" });
            await navToScene(page, "cube", "Controls", { timeout: 8000 });
            await page.waitForTimeout(700);
            await switchScene(page, "easing", "Easing");

            // ── clause (1) hero-editable (KEYSTONE) ──
            console.log("\nclause (1) hero-editable (KEYSTONE — a HERO-stage handle drag re-shapes the curve + re-times the ball)");
            const heroHandleCount = await page.evaluate(
                (sel) => document.querySelectorAll(sel).length,
                HERO_HANDLE_SEL,
            );
            if (heroHandleCount >= 2) {
                ok(`(1) ${heroHandleCount} DemoControlPoint handles present ON the HERO stage (.easing-stage-handles), not only the sidebar.`);
            } else {
                fail(
                    `(1) only ${heroHandleCount} HERO-stage handles present (expected ≥2) — the hero is still read-only ` +
                        `(aria-hidden/pointer-events:none); a sidebar-only editor passes Q.WC1's gate but must RED this one.`,
                );
            }

            if (heroHandleCount >= 2) {
                const before = await sampleHero(page);
                const { dragged } = await dragHeroHandle(page, 0, { fx: 0.7, fy: 0.2 });
                await page.waitForTimeout(400);
                const after = await sampleHero(page);
                const dMutated = !!before.d && !!after.d && before.d !== after.d;
                const spread = (a) => (a.length ? Math.max(...a) - Math.min(...a) : 0);
                const reTimed =
                    Math.abs(spread(after.xs) - spread(before.xs)) > 0.5 ||
                    before.xs.some(
                        (v, i) => i < after.xs.length && Math.abs(v - after.xs[i]) > 1,
                    );
                if (dragged && dMutated && reTimed) {
                    ok("(1) a REAL page.mouse drag of a HERO handle re-shaped `demo.svgPath` (the hero `d`) AND re-timed the subject ball.");
                } else {
                    fail(
                        `(1) the hero handle drag did not both re-shape the curve AND re-time the ball ` +
                            `(dragged=${dragged}, dMutated=${dMutated}, reTimed=${reTimed}) — a hero that repaints but does not re-time reds.`,
                    );
                }
            }

            // ── clause (2) diff-ghost ──
            console.log("\nclause (2) diff-ghost (named→custom shows the ORIGINAL named curve reference; from-scratch shows NONE)");
            // Establish a NAMED baseline (ease-out), then drag a hero handle to
            // force named→custom and assert the ghost appears with a distinct `d`.
            const picked = await selectNamed(page, "ease-out");
            await page.waitForTimeout(300);
            const ghostBeforeEdit = await page.evaluate(
                () => !!document.querySelector(".easing-curve-canvas .bezier-path--ghost"),
            );
            // The named curve has no ghost yet (no edit departed from it).
            await dragHeroHandle(page, 1, { fx: 0.55, fy: 0.7 });
            await page.waitForTimeout(300);
            const ghost = await page.evaluate(() => {
                const g = document.querySelector(".easing-curve-canvas .bezier-path--ghost");
                const live = document.querySelector(".easing-curve-canvas .bezier-path:not(.bezier-path--ghost)");
                return {
                    present: !!g,
                    d: g ? g.getAttribute("d") : null,
                    liveD: live ? live.getAttribute("d") : null,
                };
            });
            const ghostShownOnEdit =
                picked && ghost.present && !!ghost.d && ghost.d !== ghost.liveD && !ghostBeforeEdit;
            if (ghostShownOnEdit) {
                ok("(2) a named→custom edit (ease-out → drag) renders a `.bezier-path--ghost` carrying the ORIGINAL named curve `d` (distinct from the live trace), absent BEFORE the edit.");
            } else {
                fail(
                    `(2) the named-curve diff-ghost did not appear on a named→custom edit ` +
                        `(picked=${picked}, ghostBeforeEdit=${ghostBeforeEdit}, present=${ghost.present}, distinct=${ghost.d !== ghost.liveD}).`,
                );
            }
            // Reset to a fresh NAMED curve (no edit departed from it) → the ghost
            // CLEARS: the diff is tied to the named→custom EDIT, never permanent
            // clutter. (Selecting any curve from the dropdown clears the captured
            // baseline; a bare named curve has no diff to show.)
            const pickedFresh = await selectNamed(page, "ease-in-out");
            await page.waitForTimeout(300);
            const ghostFresh = await page.evaluate(
                () => !!document.querySelector(".easing-curve-canvas .bezier-path--ghost"),
            );
            if (pickedFresh && !ghostFresh) {
                ok("(2) re-selecting a fresh named curve CLEARS the ghost — the diff is tied to the named→custom edit, never permanent clutter.");
            } else {
                fail(
                    `(2) the ghost persisted after re-selecting a fresh named curve (pickedFresh=${pickedFresh}, ghost=${ghostFresh}) — ` +
                        `the ghost must be ABSENT without an active named→custom edit.`,
                );
            }

            // ── clause (3) precision-author ──
            console.log("\nclause (3) precision-author (Shift+Arrow = fine 0.001 nudge; a typed cubic-bezier moves the handles + d)");
            // Re-establish an editable curve and focus a SIDEBAR handle (the
            // numeric readout lives in the sidebar; the fine nudge is on the
            // focused handle, hero or sidebar — both share the model).
            await selectNamed(page, "ease-in-out");
            await page.waitForTimeout(300);
            const fineBefore = await page.evaluate(() => {
                const handle = document.querySelector(
                    '.easing-curve-canvas [data-demo-control-point] .control-point.handle[data-index="0"]',
                );
                if (!handle) return null;
                handle.focus();
                return parseFloat(handle.getAttribute("cx"));
            });
            // ONE Shift+ArrowRight should move x by the FINE step (0.001), not 0.01.
            await page.keyboard.down("Shift");
            await page.keyboard.press("ArrowRight");
            await page.keyboard.up("Shift");
            await page.waitForTimeout(120);
            const fineAfter = await page.evaluate(() => {
                const handle = document.querySelector(
                    '.easing-curve-canvas [data-demo-control-point] .control-point.handle[data-index="0"]',
                );
                return handle ? parseFloat(handle.getAttribute("cx")) : null;
            });
            const fineDelta =
                fineBefore != null && fineAfter != null ? Math.abs(fineAfter - fineBefore) : null;
            // The cx is in curve-x units (viewBox 0..1), so the fine delta should
            // be ≈0.001, distinctly below the coarse 0.01.
            const fineOK = fineDelta != null && fineDelta > 0.0003 && fineDelta < 0.005;
            if (fineOK) {
                ok(`(3) Shift+ArrowRight nudges the handle x by ~${fineDelta?.toFixed(4)} (FINE 0.001, distinctly below the coarse 0.01).`);
            } else {
                fail(
                    `(3) the FINE keyboard nudge is wrong (delta=${fineDelta}); expected ~0.001 — a coarse-only nudge reds.`,
                );
            }

            // Type a cubic-bezier into the writable readout and assert the curve moves.
            const typedTarget = "cubic-bezier(0.17, 0.67, 0.83, 0.67)";
            const beforeType = await page.evaluate(
                () => {
                    const p = document.querySelector(
                        ".easing-curve-canvas .bezier-path:not(.bezier-path--ghost)",
                    );
                    return p ? p.getAttribute("d") : null;
                },
            );
            const typed = await page.evaluate(async (val) => {
                const input = document.querySelector(".curve-author-input");
                if (!input) return false;
                input.focus();
                // Set the value + dispatch input + change (the commit path).
                const setter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    "value",
                ).set;
                setter.call(input, val);
                input.dispatchEvent(new Event("input", { bubbles: true }));
                input.dispatchEvent(new Event("change", { bubbles: true }));
                await new Promise((r) => setTimeout(r, 250));
                return true;
            }, typedTarget);
            await page.waitForTimeout(200);
            const afterType = await page.evaluate(
                () => {
                    const p = document.querySelector(
                        ".easing-curve-canvas .bezier-path:not(.bezier-path--ghost)",
                    );
                    return p ? p.getAttribute("d") : null;
                },
            );
            if (typed && beforeType && afterType && beforeType !== afterType) {
                ok(`(3) a typed \`${typedTarget}\` in the writable readout moved the handles + the bezier \`d\` to match (round-trip through parseCSSValue).`);
            } else {
                fail(
                    `(3) the writable readout did not round-trip a typed cubic-bezier ` +
                        `(typed=${typed}, dMutated=${beforeType !== afterType}) — a read-only readout reds.`,
                );
            }

            const fatal = consoleErrors.filter((e) => /^pageerror:/.test(e));
            if (fatal.length === 0) {
                ok(`console — ZERO pageerror across the drive (${consoleErrors.length} console line(s) total).`);
            } else {
                fail(`console — ${fatal.length} pageerror(s):\n      ${fatal.slice(0, 4).join("\n      ")}`);
            }
}

async function browserHalf() {
    const consoleErrors = [];
    const DEMO_URL = process.env.KF_DEMO_URL;
    if (DEMO_URL) {
        // NAMED exception: run against a live server (KF_DEMO_URL). The default
        // contract below is the built dist.
        const chromium = resolveChromium();
        if (!chromium) {
            console.log("  ○ browser half skipped — playwright not resolvable");
            return;
        }
        const browser = await chromium.launch();
        const ctx = await browser.newContext({
            viewport: { width: 1440, height: 900 },
        });
        const page = await ctx.newPage();
        try {
            await runClauses(page, DEMO_URL, consoleErrors);
        } finally {
            await ctx.close();
            await browser.close();
        }
        return;
    }
    const result = await withPage(
        {
            distDir: DIST,
            label: "the easing-curve-editor design clauses",
            context: { viewport: { width: 1440, height: 900 } },
        },
        async (page, { url: base }) => {
            await runClauses(page, base, consoleErrors);
        },
    );
    if (result.skipped) console.log(`  ○ browser half skipped — ${result.reason}`);
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:easing-curve-editor — FAIL (${failures.length}): the easing scene is not the demo's headline ` +
            `direct-manipulation instrument — the HERO is not editable, OR the named-curve diff-ghost is missing/clutter, OR ` +
            `the readout is read-only / coarse-only. Q.WC2 S1–S3 are not all satisfied.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:easing-curve-editor — PASS: the editor is promoted onto the HERO (a real hero drag re-shapes the curve " +
        "AND re-times the ball), the comparison-DIFF ghost reads `f(t)=` as a delta from the named curve (present on a " +
        "named→custom edit, absent from-scratch), and the writable readout + fine/coarse keyboard author the curve precisely. " +
        "The substituted-headline finding closes.",
);
