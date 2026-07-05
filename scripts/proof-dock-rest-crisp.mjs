#!/usr/bin/env node
/**
 * proof:dock-rest-crisp — T.C5 (GU-1 acceptance gate). BORN-RED BY MEASUREMENT.
 *
 * VERDICT #4 ("all the dock animations are ruined" / the shot-04 "unreadable
 * blur-blob"). A RESTING collapsed dock holds `--dock-expand-t: 0`, and glass-ui's
 * BB.W-LIQUID-REVEAL rule (`dist/styles/dock/morph.css`:
 *   .glass-dock { --dock-reveal-blur: 3px;
 *                 filter: blur(calc(var(--dock-reveal-blur) * (1 - var(--dock-expand-t, 1)))) }
 * ) is NOT gated on `[data-morphing]` — so a resting 54px circle sits under a
 * permanent 3px SELF-`filter` over plate + border + shadow + glyph. This gate
 * MEASURES the computed `filter` of every `.glass-dock` at rest and asserts it is
 * `none` / `blur(0px)`: a resting dock — collapsed or expanded — is CRISP, ALWAYS.
 *
 * MEASURED (not source-shape): the gate reads the real `getComputedStyle().filter`
 * off the LIVE rendered docks in a real browser, both docks × {collapsed, expanded}
 * × {light, dark}. It REDS TODAY because the resting collapsed dock measures
 * `blur(3px)` (the glass-ui-root defect). Per MEMORY (dock fixes go in glass-ui
 * root, never patched in demo) kf CANNOT self-cure it — it is a born-RED handoff:
 * EXCLUDED + T_BORNRED_BACKLOG, dischargedBy the glass-ui GU-1 publish + re-pin
 * (the reveal blur gated on `[data-morphing]`, content-only). AUTHORITY: OWNER +
 * blocking-not-OBSERVE (a "blurry janky dock" may not ride non-blocking — T.M6).
 *
 * Harness: scripts/lib/demo-driver.mjs `withPage` (serveDist + resolveChromium +
 * context/teardown). Under KF_REQUIRE_BROWSER=1 a playwright/dist-absent skip is a
 * HARD FAIL at the lib seam. Serves the BUILT dist/gh-pages/ — run `npm run
 * gh-pages` first. Re-runnable: `node scripts/proof-dock-rest-crisp.mjs`.
 */
import { withPage, REQUIRE_BROWSER } from "./lib/demo-driver.mjs";

const failures = [];
const passes = [];

console.log(
    "proof:dock-rest-crisp — T.C5/GU-1 (every .glass-dock is CRISP at rest — filter none/blur(0px)) [BORN-RED]\n",
);

/** Parse a computed `filter` string → the max non-zero blur radius in px (0 when
 *  none / blur(0px)). `none` → 0; `blur(3px)` → 3; a matrix/other filter with a
 *  blur term → its radius. */
function maxBlurPx(filter) {
    if (!filter || filter === "none") return 0;
    let max = 0;
    for (const m of filter.matchAll(/blur\(\s*([\d.]+)px\s*\)/g)) {
        const px = parseFloat(m[1]);
        if (px > max) max = px;
    }
    return max;
}

const result = await withPage(
    { label: "proof:dock-rest-crisp (the resting .glass-dock filter measurement)" },
    async (page, { url }) => {
        await page.goto(url, { waitUntil: "domcontentloaded" });
        // The dock chrome is present on every route (home is fine). Let the shell
        // mount + the docks settle to their RESTING collapsed state.
        await page
            .waitForFunction(
                () => document.querySelectorAll(".glass-dock").length > 0,
                undefined,
                { timeout: 12000 },
            )
            .catch(() => {});

        const measures = [];
        for (const theme of ["light", "dark"]) {
            // Drive the theme the demo way (the `.dark` class on <html>).
            await page.evaluate((t) => {
                document.documentElement.classList.toggle("dark", t === "dark");
            }, theme);
            // Let the theme + any transition settle to REST (no morph in flight).
            await page.waitForTimeout(400);
            const rows = await page.evaluate(() => {
                const out = [];
                document.querySelectorAll(".glass-dock").forEach((el, i) => {
                    const cs = getComputedStyle(el);
                    const r = el.getBoundingClientRect();
                    out.push({
                        i,
                        filter: cs.filter,
                        morphing:
                            el.hasAttribute("data-morphing") ||
                            el.getAttribute("data-morphing") === "true",
                        w: Math.round(r.width),
                        h: Math.round(r.height),
                    });
                });
                return out;
            });
            for (const row of rows) measures.push({ theme, ...row });
        }
        return measures;
    },
);

if (result.skipped) {
    // Not under KF_REQUIRE_BROWSER — the harness could not start (no browser / no
    // dist). Honest skip note; the gate is born-RED by measurement so it cannot
    // pass vacuously when required.
    console.log(
        `  · browser half skipped (${result.reason}) — build the demo (npm run gh-pages) + set ` +
            "KF_PLAYWRIGHT_DIR/KF_REQUIRE_BROWSER=1 to MEASURE the resting dock filter.",
    );
    if (REQUIRE_BROWSER) process.exit(1);
    console.log(
        "\nproof:dock-rest-crisp — SKIP (browser unavailable; born-RED-by-measurement, not a green).",
    );
    process.exit(0);
}

const measures = result.value ?? [];
if (measures.length === 0) {
    failures.push(
        "no-docks — zero `.glass-dock` elements rendered on the home route. The dock chrome must " +
            "mount for the resting-filter measurement (a blank measurement is not a crisp dock).",
    );
}
for (const m of measures) {
    const blur = maxBlurPx(m.filter);
    // Only a RESTING dock is judged (a genuinely in-flight morph legitimately
    // decongests) — but at rest there is no [data-morphing], so every measured
    // row here IS a resting state.
    if (m.morphing) continue; // in-flight morph beat — not a resting state
    if (blur > 0) {
        failures.push(
            `resting-blur — .glass-dock[${m.i}] (${m.theme}, ${m.w}×${m.h}) computes ` +
                `filter: "${m.filter}" (${blur}px self-blur) AT REST. A resting dock must be CRISP ` +
                "(none/blur(0px)) — GU-1: the reveal blur must gate on [data-morphing], content-only.",
        );
    } else {
        passes.push(
            `crisp — .glass-dock[${m.i}] (${m.theme}, ${m.w}×${m.h}) computes filter: "${m.filter}" ` +
                "at rest (crisp, no self-blur).",
        );
    }
}

for (const p of passes) console.log("  ✓ " + p);
if (failures.length > 0) {
    console.error(
        `\nproof:dock-rest-crisp — FAIL (${failures.length}) [BORN-RED backlog — T_BORNRED_BACKLOG; dischargedBy glass-ui GU-1 publish + re-pin (T.C6)]:`,
    );
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}
console.log(
    "\nproof:dock-rest-crisp — PASS: every .glass-dock is crisp at rest (filter none/blur(0px), both docks × themes).",
);
process.exit(0);
