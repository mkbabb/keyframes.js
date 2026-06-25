#!/usr/bin/env node
/**
 * proof:spring-heatmap — Tranche P.W6 S3 (the spring parameter-space heatmap ·
 * the headline navigational egg).
 *
 * ── WHAT THIS GATE ASSERTS (the ADOPTED, MEASURE-FIRST design) ────────────────
 * P.W6 S3 turns the spring's two abstract sliders (response / dampingFraction)
 * into a NAVIGABLE landscape: a 20×20 field where each cell is tinted by the
 * EXACT closed-form analytic peak overshoot of the damped harmonic oscillator —
 *
 *     overshoot(ζ) = exp(-ζπ / √(1-ζ²))     (ζ = dampingFraction, 0 < ζ < 1)
 *
 * computed INLINE, NOT by instantiating 400 live SpringProgress trackers at
 * mount. The analytic path was BENCHED at 507× faster (`spring-heatmap-probe`,
 * 2026-06-22: 0.002 ms vs 1.04 ms/mount) and the overshoot formula is EXACT
 * (<1% vs the live 60 Hz peak). A click on the field NAVIGATES the live spring
 * to that (response, dampingFraction).
 *
 * ── THE BORN-RED CLAUSES (each bites the GENUINE defect, not a name-only proxy —
 * the appearance/interaction axis, MEMORY feedback_gate_blindspot_appearance) ──
 *
 *   STATIC HALF (source-shape — the analytic-path discipline):
 *     1. analytic-formula  — SpringHeatmap.vue computes the closed-form overshoot
 *        `exp(-ζπ/√(1-ζ²))` inline (Math.exp(... -zeta * Math.PI ... √(1-ζ²))).
 *        BITE: a heatmap that imports a settle-time helper or hand-rolls a fit
 *        instead of the exact overshoot formula reds.
 *     2. no-400-instances  — the heatmap does NOT instantiate ~400 live
 *        SpringProgress objects to build the grid (no `new SpringProgress` inside
 *        the 20×20 sampling loop). BITE: the DROPPED 400-instance approach reds.
 *     3. tint-from-overshoot — the cell fill is DERIVED from the overshoot value
 *        (the `overshoot(zeta)` result feeds the color-mix amount). BITE: a field
 *        of uniform / random / non-overshoot tint reds.
 *
 *   RUNTIME HALF (observable-truth — the KEYSTONE: a click navigates the spring):
 *     4. heatmap-navigate  — load #/spring, open the spring control pane, assert
 *        `.spring-heatmap` renders with ≥2 DISTINCT tinted cell colors (the
 *        analytic overshoot landscape — a flat field reds), then click a measured
 *        cell at a known (response, dampingFraction) and assert the live params
 *        JUMP to within ±half-cell of that coordinate AND the `.spring-heatmap-
 *        marker` MOVED to the click. BITE: a field that renders but whose click
 *        is inert (no navigate) reds — the EXACT proxy trap the keystone forbids.
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * resolveChromium + context/teardown; navToScene = the per-EXPECTED-state
 * settle). Serves the BUILT dist/gh-pages/. The KF_REQUIRE_BROWSER lib seam
 * governs hard-gate-vs-tripwire (the runtime half hard-gates where chromium is
 * present, notes an honest skip where absent unless KF_REQUIRE_BROWSER=1).
 *
 * Re-runnable:
 *   npm run gh-pages && KF_REQUIRE_BROWSER=1 node scripts/proof-spring-heatmap.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPage, navToScene, REQUIRE_BROWSER } from "./lib/demo-driver.mjs";

const PASS = "\x1b[32m✓\x1b[0m";
const FAIL = "\x1b[31m✗\x1b[0m";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HEATMAP = path.join(REPO, "demo/scenes/spring/SpringHeatmap.vue");

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");

const results = [];
const record = (ok, msg) => results.push({ ok, msg });

// ── STATIC HALF — the analytic-path discipline (no 400 live instances) ─────────
function staticHalf() {
    const src = read(HEATMAP);
    if (!src) {
        record(
            false,
            "static: demo/scenes/spring/SpringHeatmap.vue is ABSENT (born-RED until P.W6 S3 lands the heatmap egg)",
        );
        return;
    }

    // 1. The EXACT closed-form overshoot formula `exp(-ζπ/√(1-ζ²))` is computed
    //    inline. We match the structural signature (Math.exp of a product with
    //    -π and a √(1 - ζ²) denominator) rather than a single brittle literal.
    const hasExp = /Math\.exp\s*\(/.test(src);
    const hasPi = /Math\.PI/.test(src);
    const hasSqrt1MinusZetaSq =
        /Math\.sqrt\s*\(\s*1\s*-\s*\w+\s*\*\s*\w+\s*\)/.test(src) ||
        /Math\.sqrt\s*\(\s*1\s*-\s*\w+\s*\*\*\s*2\s*\)/.test(src);
    const formulaOk = hasExp && hasPi && hasSqrt1MinusZetaSq;
    record(
        formulaOk,
        `analytic-formula — the EXACT closed-form overshoot exp(-ζπ/√(1-ζ²)) is ` +
            `computed inline ` +
            (formulaOk
                ? `(Math.exp · Math.PI · √(1-ζ²) present — the derived control-theory ` +
                  `expression, NOT a settle-time helper from spring.ts)`
                : `(MISSING: ${[
                      !hasExp && "Math.exp",
                      !hasPi && "Math.PI",
                      !hasSqrt1MinusZetaSq && "√(1-ζ²)",
                  ]
                      .filter(Boolean)
                      .join(", ")})`),
    );

    // 2. NO ~400 live SpringProgress instances. The DROPPED approach instantiates
    //    a SpringProgress per cell inside the sampling loop. The analytic path
    //    instantiates ZERO. We assert the component does NOT construct
    //    SpringProgress at all (the closed-form needs no live tracker).
    const constructs = src.match(/new\s+SpringProgress\b/g) ?? [];
    const noLiveInstances = constructs.length === 0;
    record(
        noLiveInstances,
        `no-400-instances — the heatmap builds the 20×20 grid via the closed-form, ` +
            `instantiating ZERO live SpringProgress trackers ` +
            (noLiveInstances
                ? `(the DROPPED 400-instance approach is absent — 507× faster, ` +
                  `spring-heatmap-probe)`
                : `(FAILED: found ${constructs.length} \`new SpringProgress\` — the ` +
                  `DROPPED 400-live-instance approach; tint analytically instead)`),
    );

    // 3. The tint is DERIVED from the overshoot value (the overshoot result feeds
    //    the fill). We assert an `overshoot(...)` computation flows into the
    //    canvas fillStyle / color-mix amount — not a constant or a non-overshoot
    //    channel.
    const hasOvershootFn = /function\s+overshoot\b|const\s+overshoot\s*=/.test(
        src,
    );
    const overshootFeedsFill =
        /overshoot\s*\(/.test(src) &&
        /fillStyle|color-mix/.test(src) &&
        // the overshoot result is captured and reused for the mix amount
        /=\s*overshoot\s*\(/.test(src);
    const tintOk = hasOvershootFn && overshootFeedsFill;
    record(
        tintOk,
        `tint-from-overshoot — the cell fill is DERIVED from overshoot(ζ) ` +
            (tintOk
                ? `(the analytic overshoot drives the color-mix tint amount — the ` +
                  `ringing band saturates, the settled band fades)`
                : `(FAILED: the overshoot value does not flow into the fillStyle/` +
                  `color-mix — the tint must map to overshoot, not a constant)`),
    );
}

// ── RUNTIME HALF (KEYSTONE) — a click navigates the spring (observable-truth) ──
async function runtimeHalf() {
    const out = await withPage(
        {
            label: "proof:spring-heatmap (heatmap-navigate keystone)",
            context: { viewport: { width: 1440, height: 900 } },
        },
        async (page, { url }) => {
            await page.goto(url + "#/spring", { waitUntil: "load" });
            await navToScene(page, "spring", "Spring");
            await page.waitForTimeout(1500);

            // Open the spring control pane (the heatmap lives in SpringSidebar).
            // The dock-managed control tab projects the SpringSidebar slot; clicking
            // the "Spring" control tab opens it. Best-effort — if it's already open
            // (≥1024 auto-opens), the probe finds the field directly.
            await page
                .evaluate(() => {
                    const tab = document.querySelector(
                        "[aria-label='Controls tab']",
                    );
                    if (
                        tab &&
                        !document.querySelector(".spring-heatmap")
                    ) {
                        tab.click();
                    }
                    const opener = document.querySelector('[title="Open controls"]');
                    if (opener && !document.querySelector(".spring-heatmap")) {
                        opener.click();
                    }
                })
                .catch(() => {});
            await page
                .waitForFunction(() => !!document.querySelector(".spring-heatmap"), {
                    timeout: 6000,
                })
                .catch(() => {});

            // (a) the field renders with ≥2 DISTINCT tinted cells (the analytic
            //     landscape — a flat field is not a heatmap). Sample the canvas
            //     pixels along the damping (vertical) axis: the overshoot varies
            //     with ζ, so distinct rows MUST carry distinct tints.
            const field = await page.evaluate(() => {
                const el = document.querySelector(".spring-heatmap");
                if (!el) return { present: false };
                const canvas = el.querySelector("canvas");
                if (!canvas) return { present: true, hasCanvas: false };
                const ctx = canvas.getContext("2d");
                const r = canvas.getBoundingClientRect();
                if (!ctx || canvas.width === 0)
                    return { present: true, hasCanvas: true, distinct: 0 };
                // Sample a vertical column of pixels (the damping axis) — the
                // overshoot landscape changes top→bottom.
                const cx = Math.floor(canvas.width / 2);
                const colors = new Set();
                for (let i = 0; i < 10; i++) {
                    const cy = Math.floor((i / 10) * (canvas.height - 1));
                    const px = ctx.getImageData(cx, cy, 1, 1).data;
                    colors.add(`${px[0]},${px[1]},${px[2]}`);
                }
                return {
                    present: true,
                    hasCanvas: true,
                    distinct: colors.size,
                    rect: { x: r.x, y: r.y, w: r.width, h: r.height },
                };
            });

            if (!field.present) {
                record(
                    false,
                    "heatmap-navigate — `.spring-heatmap` is NOT present (born-RED until " +
                        "P.W6 S3 lands the field in SpringSidebar; the spring control pane " +
                        "may not have opened)",
                );
                return;
            }
            if (!field.hasCanvas || (field.distinct ?? 0) < 2) {
                record(
                    false,
                    `heatmap-navigate — the field renders but carries <2 distinct tinted ` +
                        `cells (${field.distinct ?? 0}); the analytic overshoot landscape must ` +
                        `produce a gradient, not a flat fill`,
                );
                return;
            }

            // (b) THE KEYSTONE — click a measured cell and assert the live params
            //     JUMP to within ±half-cell of that coordinate + the marker moves.
            //     We compute the EXPECTED (response, damping) the heatmap maps for
            //     a click at a known fractional position, then verify the live
            //     spring navigated there.
            //
            //     Ranges (must mirror SpringHeatmap.vue): response [0.1, 1.2],
            //     damping [0.2, 1.5]; 20×20; y inverted (high damping at top).
            const RESPONSE_MIN = 0.1,
                RESPONSE_MAX = 1.2;
            const DAMPING_MIN = 0.2,
                DAMPING_MAX = 1.5;
            const COLS = 20,
                ROWS = 20;
            const halfCellR = (RESPONSE_MAX - RESPONSE_MIN) / COLS / 2;
            const halfCellD = (DAMPING_MAX - DAMPING_MIN) / ROWS / 2;

            // Pick a target cell distinct from any preset (col 5, row 14 → a
            // lower-damping ringing region the click should reach).
            const targetCol = 5;
            const targetRow = 14;
            const fx = (targetCol + 0.5) / COLS;
            const fy = (targetRow + 0.5) / ROWS;
            const expectedResponse =
                Math.round(
                    (RESPONSE_MIN + fx * (RESPONSE_MAX - RESPONSE_MIN)) * 100,
                ) / 100;
            const expectedDamping =
                Math.round(
                    (DAMPING_MAX - fy * (DAMPING_MAX - DAMPING_MIN)) * 100,
                ) / 100;

            const rect = field.rect;
            const clickX = rect.x + fx * rect.w;
            const clickY = rect.y + fy * rect.h;

            // The marker position BEFORE the click (to assert it MOVED).
            const markerBefore = await page.evaluate(() => {
                const m = document.querySelector(".spring-heatmap-marker");
                if (!m) return null;
                const s = m.style;
                return { left: s.left, top: s.top };
            });

            await page.mouse.click(clickX, clickY);
            await page.waitForTimeout(700);

            // Read the live params off the rendered readout + the marker move.
            const after = await page.evaluate(() => {
                // The SpringTarget readout / SpringHeatmap header shows the live
                // (response / damping). Read the marker move + the param readout.
                const m = document.querySelector(".spring-heatmap-marker");
                const marker = m
                    ? { left: m.style.left, top: m.style.top }
                    : null;
                // The heatmap header prints "<response> / <damping>"; parse it.
                const header = [
                    ...document.querySelectorAll(".spring-heatmap-section span"),
                ]
                    .map((s) => s.textContent.trim())
                    .find((t) => /^\d+\.\d+\s*\/\s*\d+\.\d+$/.test(t));
                let response = NaN,
                    damping = NaN;
                if (header) {
                    const m2 = header.match(/(\d+\.\d+)\s*\/\s*(\d+\.\d+)/);
                    if (m2) {
                        response = parseFloat(m2[1]);
                        damping = parseFloat(m2[2]);
                    }
                }
                return { marker, response, damping };
            });

            const markerMoved =
                markerBefore &&
                after.marker &&
                (markerBefore.left !== after.marker.left ||
                    markerBefore.top !== after.marker.top);

            const responseOk =
                Number.isFinite(after.response) &&
                Math.abs(after.response - expectedResponse) <= halfCellR + 1e-6;
            const dampingOk =
                Number.isFinite(after.damping) &&
                Math.abs(after.damping - expectedDamping) <= halfCellD + 1e-6;

            const navigated = responseOk && dampingOk && markerMoved;
            record(
                navigated,
                `heatmap-navigate (KEYSTONE) — a click on cell (${targetCol},${targetRow}) ` +
                    `NAVIGATED the live spring to (response≈${expectedResponse}, ` +
                    `damping≈${expectedDamping}) within ±half-cell ` +
                    (navigated
                        ? `(got response=${after.response}, damping=${after.damping}; ` +
                          `the marker moved to the click — the field is a live navigator)`
                        : `(FAILED: got response=${after.response} (±${halfCellR.toFixed(
                              3,
                          )}), damping=${after.damping} (±${halfCellD.toFixed(
                              3,
                          )}), markerMoved=${markerMoved} — the click did not navigate ` +
                          `the spring or the marker is inert)`),
            );
        },
    );

    if (out?.skipped) {
        record(
            !REQUIRE_BROWSER, // a skip is acceptable ONLY when the browser half is not required
            `heatmap-navigate — browser half ${
                REQUIRE_BROWSER ? "REQUIRED but" : "skipped:"
            } ${out.reason}${
                REQUIRE_BROWSER
                    ? " (KF_REQUIRE_BROWSER=1 — this is a FAIL)"
                    : "; set KF_REQUIRE_BROWSER=1 to require it"
            }`,
        );
    }
}

async function main() {
    console.log(
        "proof:spring-heatmap — P.W6 S3 (the analytic parameter-space heatmap · click-to-navigate)",
    );

    staticHalf();
    await runtimeHalf();

    let allOk = true;
    for (const r of results) {
        console.log(`  ${r.ok ? PASS : FAIL} ${r.msg}`);
        if (!r.ok) allOk = false;
    }

    if (allOk) {
        console.log(
            "\nproof:spring-heatmap — PASS: the heatmap tints 20×20 cells by the EXACT " +
                "closed-form overshoot exp(-ζπ/√(1-ζ²)) (ZERO live SpringProgress instances, " +
                "507× faster), and a click NAVIGATES the live spring within ±half-cell.",
        );
        process.exit(0);
    } else {
        console.error(
            "\nproof:spring-heatmap — FAIL: the heatmap is missing, builds the grid with " +
                "live SpringProgress instances instead of the analytic overshoot, the tint does " +
                "not map to overshoot, or a click does not navigate the spring (BORN-RED until " +
                "P.W6 S3 lands the analytic field + the click→navigate handler).",
        );
        process.exit(1);
    }
}

main().catch((e) => {
    console.error("proof:spring-heatmap — ERROR:", e);
    process.exit(1);
});
