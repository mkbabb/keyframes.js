#!/usr/bin/env node
/**
 * proof:hero-two-focal — T.D9 (OD-4 **APPROVED**, the P-HERO blessed reference
 * `worktree-wf_1e744f4d-2bb-1`). **OWNER authority (T.M6)**: this oracle's green
 * window IS the owner-approved home composition — the "ink on graph paper"
 * φ-band seat reviewed live 2026-07-05 — so its green cannot be reached without
 * that committed token (OWNER-DECISIONS.md OD-4; verdict artifact
 * docs/tranches/T/verdicts/T.D9.md).
 *
 * THE SUCCESSOR GATE. It structurally replaces the three retired FROZEN hero
 * locks (gate-bands.mjs DISCHARGE, kind: migration):
 *   • proof:hero-rung    — the mega-φ-rung survivorship is clause (a) here (the
 *     new hero KEEPS text-display-mega; only the SEAT moved).
 *   • proof:hero-balance — the one-optical-block + top-band geometry lock; its
 *     live half (the hero is ONE poster block, not scattered fragments) rides
 *     clause (d); its top-band seat assertion was the REJECTED state (VERDICT
 *     #3 "lower on the page") and is INVERTED by clause (b).
 *   • proof:hero-cls     — the word-split-geometry CLS companion; the geometry
 *     it locked (per-word spans in the top band) is the rejected state. The
 *     Capsize metric-matched fallback + the mega rung it really guarded are
 *     re-asserted by clause (a) + proof:demo-elevate's first-paint clause.
 *
 * THE CLAUSES (the T.D9 placement contract; VERDICT #3 + OD-4):
 *   (a) RUNG (static) — the start-screen <h1> carries `text-display-mega`, no
 *       lower rung (the hero-rung survivor clause, source-shape like the
 *       original: fluid clamp() tokens are unstable to compare at runtime).
 *   (b) φ-BAND SEAT (browser, 1440×900 + 375×812) — the h1 rect intersects
 *       NEITHER glass dock rect (top compass, bottom transport) AND
 *       h1.top ≥ 0.38 × viewport height (the "lower on the page, toward the
 *       centre" floor — the rejected header-band hero parked at y≈21; the
 *       blessed seat is top-offset + 0.45/0.52 × work-area height, which
 *       always clears this conservative floor). Overlap with the CUBE is
 *       WELCOME ("it's OK if it sits a bit on top of the cube") — measured and
 *       REPORTED, never failed.
 *   (c) TWO-FOCAL CENSUS (browser) — home renders the hero AND the die (both
 *       visible, non-degenerate rects), and ZERO forbidden furniture from the
 *       owner-sanctioned home manifest (stage-manifests/home.json): no
 *       typing-card/kf-source-egg, no gallery door (VERDICT #2/#15).
 *   (d) SEAT DERIVATION (static) — the `.hero-band` seat derives from the
 *       work-area chain (`--work-area-top-offset` + `--work-area-height`), with
 *       NO raw px/vh offset literal in its `top:` (the K.W3 M4/C5 ban; the
 *       100dvh var() fallback is the chain's own saturation value, allowed).
 *
 * Harness: scripts/lib/demo-driver.mjs withPage (serveDist + resolveChromium;
 * under KF_REQUIRE_BROWSER a playwright-absent skip is a hard fail at the lib
 * seam). Serves the BUILT dist/gh-pages (run `npm run gh-pages` first).
 * Re-runnable: `node scripts/proof-hero-two-focal.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
const START_SCREEN = path.join(
    REPO,
    "demo/@/components/custom/editor-shell/EditorStartScreen.vue",
);

const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const note = (l) => console.log(`  · ${l}`);
const fail = (l) => {
    failures.push(l);
    console.error(`  ✗ ${l}`);
};
const read = (p) => fs.readFileSync(p, "utf8");
const stripComments = (s) =>
    s
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/(^|[^:])\/\/[^\n]*/g, "$1");

console.log(
    "proof:hero-two-focal — T.D9 (OD-4 APPROVED · the φ-band two-focal home composition; " +
        "OWNER authority — successor of hero-rung/-balance/-cls)",
);

// ── (a) RUNG — the h1 stays on text-display-mega (hero-rung survivor) ────────
{
    const src = stripComments(read(START_SCREEN));
    const h1 = src.match(/<h1\b[^>]*>/);
    if (!h1) {
        fail("(a) no <h1> in EditorStartScreen.vue — the poster block is absent");
    } else {
        const onMega = /\btext-display-mega\b/.test(h1[0]);
        const lowerRung = h1[0].match(/\btext-display-(?:[1-5]|audacious|hero)\b/);
        if (onMega && !lowerRung) {
            ok("(a) the start-screen <h1> carries text-display-mega (the audacious poster rung survives the re-seat)");
        } else {
            fail(
                `(a) the start-screen <h1> is off the mega rung (found ${JSON.stringify(h1[0])}) — ` +
                    `the re-seat moved the SEAT, never the rung (OD-4 blessed the mega poster)`,
            );
        }
    }
}

// ── (d) SEAT DERIVATION — work-area chain, no raw px/vh offset ───────────────
{
    const src = read(START_SCREEN);
    const bandRule = src.match(/\.hero-band\s*\{[\s\S]*?\}/g) ?? [];
    const joined = bandRule.join("\n");
    const usesChain =
        /--work-area-top-offset/.test(joined) && /--work-area-height/.test(joined);
    // Raw offsets: a `top:` term with a bare px/vh length OUTSIDE a var()
    // fallback. The chain fallback `var(--work-area-height, 100dvh)` is the
    // saturation value (dvh, allowed); ban NN px and NN vh (non-dvh) literals.
    const tops = [...joined.matchAll(/top:\s*([^;]+);/g)].map((m) => m[1]);
    // Strip whole var() expressions FIRST — their fallbacks (`, 0px` / `, 100dvh`)
    // are the chain's own saturation values, not seat offsets; only a length
    // literal OUTSIDE a var() is a raw magic offset.
    const rawOffset = tops.some((t) => {
        const outsideVars = t.replace(/var\([^()]*\)/g, "");
        return (
            /\b\d+(\.\d+)?px\b/.test(outsideVars) ||
            /\b\d+(\.\d+)?vh\b/.test(outsideVars.replace(/dvh/g, ""))
        );
    });
    if (bandRule.length === 0) {
        fail("(d) no `.hero-band` rule in EditorStartScreen.vue — the φ-band seat is missing");
    } else if (usesChain && !rawOffset) {
        ok("(d) the .hero-band seat derives from the work-area chain (top-offset + a φ share of --work-area-height); zero raw px/vh offsets");
    } else {
        fail(
            `(d) the .hero-band seat is not chain-derived (usesChain=${usesChain}, rawOffset=${rawOffset}) — ` +
                "the K.W3 M4/C5 ban on raw-vh/px magic seats holds for the new hero",
        );
    }
}

// ── (b)+(c) browser — the two-focal φ-band composition, both viewports ───────
const VIEWPORTS = [
    { label: "desktop", viewport: { width: 1440, height: 900 } },
    {
        label: "mobile",
        viewport: { width: 375, height: 812 },
        hasTouch: true,
        isMobile: true,
        deviceScaleFactor: 3,
    },
];

async function probeViewport(vp) {
    const result = await withPage(
        {
            distDir: DIST,
            context: {
                viewport: vp.viewport,
                ...(vp.hasTouch
                    ? { hasTouch: true, isMobile: true, deviceScaleFactor: 3 }
                    : {}),
            },
            label: `hero-two-focal (${vp.label})`,
        },
        async (page, { url: base }) => {
            await page.goto(`${base}/#/`, { waitUntil: "load" });
            // Let the start-screen <Transition appear> + the die settle land.
            await page.waitForTimeout(1600);
            return page.evaluate(() => {
                const rect = (el) => {
                    if (!el) return null;
                    const b = el.getBoundingClientRect();
                    if (b.width < 4 || b.height < 4) return null;
                    return { x: b.x, y: b.y, right: b.right, bottom: b.bottom, w: b.width, h: b.height };
                };
                const inter = (a, b) => {
                    if (!a || !b) return 0;
                    const ix = Math.max(0, Math.min(a.right, b.right) - Math.max(a.x, b.x));
                    const iy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y));
                    return Math.round(ix * iy);
                };
                const hero = rect(document.querySelector("h1.hero-display"));
                // The two glass chrome pieces: every rendered glass dock plate
                // (top compass + bottom transport ride the same primitive).
                const docks = [...document.querySelectorAll(".glass-dock")]
                    .map(rect)
                    .filter(Boolean);
                // The die (the home subject): union of visible cube faces.
                let cube = null;
                for (const f of document.querySelectorAll(".cube-side, .cube")) {
                    const r = rect(f);
                    if (!r) continue;
                    if (!cube) cube = { ...r };
                    else {
                        cube.x = Math.min(cube.x, r.x);
                        cube.y = Math.min(cube.y, r.y);
                        cube.right = Math.max(cube.right, r.right);
                        cube.bottom = Math.max(cube.bottom, r.bottom);
                    }
                }
                // Forbidden furniture (the owner-sanctioned home manifest's
                // forbidden set — stage-manifests/home.json).
                const forbidden = [
                    ".kf-source-egg",
                    ".source-typing-card",
                    ".hero-keyframes-card",
                    ".gallery-door",
                    "[data-gallery-door]",
                ].flatMap((sel) => [...document.querySelectorAll(sel)].map(() => sel));
                return {
                    hero,
                    dockCount: docks.length,
                    dockHits: docks.map((d) => inter(hero, d)).filter((a) => a > 0),
                    cube,
                    cubeOverlap: inter(hero, cube),
                    forbidden,
                    innerHeight: window.innerHeight,
                };
            });
        },
    );
    if (result.skipped) {
        console.log(`  ○ browser half (${vp.label}) skipped — ${result.reason}`);
        return;
    }
    const m = result.value;
    if (!m.hero) {
        fail(`(b ${vp.label}) the hero h1.hero-display did not render a visible rect`);
        return;
    }
    // (b) dock non-intersection
    if (m.dockCount >= 1 && m.dockHits.length === 0) {
        ok(`(b ${vp.label}) the hero intersects NEITHER glass dock (${m.dockCount} dock plate(s) measured)`);
    } else {
        fail(
            `(b ${vp.label}) hero∩dock — dockCount=${m.dockCount}, overlapping areas=${JSON.stringify(m.dockHits)}px² ` +
                "(the hero must own its band; the docks own theirs)",
        );
    }
    // (b) the lower/centred floor
    const floor = 0.38 * m.innerHeight;
    if (m.hero.y >= floor) {
        ok(
            `(b ${vp.label}) the hero sits on the φ band — h1.top ${Math.round(m.hero.y)}px ≥ ` +
                `${Math.round(floor)}px (0.38 × viewport; the rejected header-band hero parked at y≈21)`,
        );
    } else {
        fail(
            `(b ${vp.label}) the hero is back in the top band — h1.top ${Math.round(m.hero.y)}px < ` +
                `${Math.round(floor)}px (VERDICT #3: lower on the page, toward the centre)`,
        );
    }
    // (c) two-focal census
    if (m.cube) {
        ok(`(c ${vp.label}) two-focal — the die renders beside the hero (cube union rect present)`);
    } else {
        fail(`(c ${vp.label}) the home subject (the die) did not render — the composition is one-focal`);
    }
    if (m.forbidden.length === 0) {
        ok(`(c ${vp.label}) zero forbidden furniture (typing-card / kf-source-egg / gallery door) on home`);
    } else {
        fail(`(c ${vp.label}) forbidden home furniture rendered: ${m.forbidden.join(", ")}`);
    }
    note(
        `(${vp.label}) hero∩cube overlap = ${m.cubeOverlap}px² — WELCOME per OD-4 ` +
            `("it's OK if it sits a bit on top of the cube"); reported, never failed`,
    );
}

for (const vp of VIEWPORTS) await probeViewport(vp);

if (failures.length > 0) {
    console.error(
        `\nproof:hero-two-focal — FAIL (${failures.length}): the home composition is off the ` +
            "OD-4-blessed two-focal φ-band contract (rung / seat / dock-clearance / furniture).",
    );
    process.exit(1);
}
console.log(
    "\nproof:hero-two-focal — PASS: the hero rides the mega rung on the work-area-derived φ band, " +
        "clear of both docks, over a rendered die, with zero forbidden furniture — the OD-4 blessed " +
        "two-focal composition (T.D9).",
);
