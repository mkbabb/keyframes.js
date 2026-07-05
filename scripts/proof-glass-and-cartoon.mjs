#!/usr/bin/env node
/**
 * proof:glass-and-cartoon — H.W9 F8 (the "glass is back" lock; the calm
 * glass+cartoon register).
 *
 * THE HEADLINE (H.W9.md §S1 / _PLAN.md §1): `cartoon-surface` is a DECORATION-ONLY
 * utility composed ON TOP of the `glass-${tier}` plate the Card already emits. The
 * W2 surface flip silently took the Card default `tier="resting"` (0.65 α / 12px
 * blur), reading more OPAQUE than the pre-cartoon `.glass-card` plate (`tier="quiet"`,
 * 0.50 α / 10px) — the user's "lost the glass" (F8). H.W9 adds `tier="quiet"` to
 * every kf-owned `surface="cartoon"` panel Card, recovering the EXACT 0.50 α the
 * user remembers. This gate is the computed-style lock that the glass returned:
 * each kf-owned cartoon panel Card resolves BOTH the cartoon offset-stamp DEPTH
 * (`--shadow-cartoon-md`, covered tier-agnostically by proof:cartoon-is-panel-depth,
 * which STAYS GREEN) AND a TRANSLUCENT, backdrop-filtered background.
 *
 * MEASURE-FIRST (the α threshold, bound from the LIVE landed tree). The two tiers
 * resolve to:
 *   tier="resting" → background-color α = 0.65   (the W2 opaque regression)
 *   tier="quiet"   → background-color α = 0.50   (the F8 recovery; measured live:
 *                    color(srgb … / 0.5), backdrop-filter: blur(10px) saturate(1.05)
 *                    brightness(1.02) on every visible cartoon panel Card).
 * The gate's OPACITY CEILING is α ≤ 0.55 — it BITES the 0.65 resting tier (the
 * "panels went opaque" regression) and PASSES the 0.50 quiet tier with margin,
 * without depending on the exact 0.50 (a glass-ui tier re-tune within (0, 0.55]
 * stays green; a regression to resting reds).
 *
 * Two falsifiable halves, each BITING on the exact F8 regression:
 *
 *   1. SOURCE-SHAPE (STATIC — always runs). Every kf-owned `<Card surface="cartoon">`
 *      panel site carries `tier="quiet"` (the 9-site inventory post-H.W11-I6, which
 *      de-nested the two inner TimingFunctionPanel cartoon Cards; ~14 pre-W11). A
 *      flake-free source anchor that a NEW cartoon panel cannot ship without the
 *      quiet tier, and that the landed sites did not drift. BITE: drop `tier="quiet"`
 *      from any `surface="cartoon"` panel Card → it falls back to the resting 0.65
 *      tier → reds.
 *
 *   2. COMPUTED-TRANSLUCENCY (BROWSER — runs when playwright resolves + dist is
 *      built). Sweep the panel-bearing routes (cube/easing/spring); collect every
 *      `[data-surface="cartoon"]` Card. In the NON-reduced-transparency case
 *      (asserted live via matchMedia — under reduced-transparency glass-ui maps
 *      α→1 + blur→none, glass.css:367-383, so the panels SHOULD be opaque and the
 *      gate would mis-bite), assert each VISIBLE cartoon Card resolves:
 *        (a) background-color α ≤ 0.55 (NOT the opaque resting 0.65) AND
 *        (b) backdrop-filter !== 'none' (the glass blur is live).
 *      NON-VACUITY: ≥4 distinct cartoon Cards must be WITNESSED translucent
 *      (α < 1 AND backdrop ≠ none) across the swept routes (post-H.W11 the easing
 *      scene is DFA-gated to its own surface + I6 de-nested the inner bezier card,
 *      so the cube/easing/spring sweep witnesses 4, not the pre-W11 5; the sibling
 *      proof:cartoon-is-panel-depth keeps ≥5 via its named-contract box-shadow sweep)
 *      — a missing-Card scene cannot
 *      green a 0-count. A deliberately-borderless Card (e.g. the EXPANDED
 *      KeyframeTimeline → `bg-transparent` with no backdrop) is α≈0 / backdrop
 *      none — it is NOT an opaque regression (α ≤ 0.55 holds) and simply does not
 *      COUNT toward the ≥5 translucent witnesses; an OPAQUE Card (α > 0.55) is the
 *      violation. BITE: revert any panel to the resting tier → its α resolves 0.65
 *      > 0.55 → reds; strip the glass blur (backdrop-filter:none on a non-transparent
 *      panel) → its translucent-witness drops below the ≥5 floor → reds.
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * resolveChromium + context/teardown, J.W3 S1; the STATIC half always runs, the
 * BROWSER half gates on playwright resolution — under KF_REQUIRE_BROWSER a
 * playwright-absent skip becomes a hard fail AT THE LIB SEAM so a SHIP is never
 * green-reported un-exercised). Scene switches are driven by the lib's navToScene
 * (an IN-PAGE hash assignment — NOT page.goto, which clears storage + kills the
 * H.W1 reconcile trap — settled on the destination's per-EXPECTED control
 * surface). proof:cartoon-is-panel-depth (the DEPTH half) STAYS
 * GREEN, tier-agnostic; this gate is the orthogonal TRANSLUCENCY half. Re-runnable:
 * `node scripts/proof-glass-and-cartoon.mjs`. The browser half serves the BUILT
 * dist/gh-pages/ (run `npm run gh-pages` first).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, REQUIRE_BROWSER, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const DIST = path.join(REPO, "dist/gh-pages");

// MEASURE-FIRST: tier="quiet"=0.50 α, tier="resting"=0.65 α. The ceiling bites
// the resting regression (0.65 > 0.55) and passes quiet (0.50 ≤ 0.55) with margin.
const ALPHA_CEILING = 0.55;

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};
const read = (p) => fs.readFileSync(p, "utf8");
const rel = (p) => path.relative(REPO, p).split(path.sep).join("/");

console.log("proof:glass-and-cartoon — H.W9 F8 (the calm glass+cartoon register · the 'glass is back' lock)");

// ── 1. SOURCE-SHAPE (static, always runs) ─────────────────────────────────────
{
    // Every kf-owned `<Card surface="cartoon">` panel site (the H.W9.md §S1 ~14-site
    // inventory) MUST carry `tier="quiet"`. Sweep the demo tree for the opening
    // `<Card surface="cartoon" …>` tags and assert each names tier="quiet".
    const VUE_FILES = [];
    const walk = (dir) => {
        for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
            const abs = path.join(dir, ent.name);
            if (ent.isDirectory()) {
                if (ent.name === "node_modules" || ent.name === "dist") continue;
                walk(abs);
            } else if (ent.name.endsWith(".vue")) {
                VUE_FILES.push(abs);
            }
        }
    };
    walk(DEMO);

    // Match a `<Card …>` opening tag carrying surface="cartoon" (children
    // CardContent/CardHeader/etc. are excluded by the `(?![A-Za-z])` boundary).
    const cartoonCardTag = /<Card(?![A-Za-z])\b[^>]*\bsurface\s*=\s*"cartoon"[^>]*>/g;
    let total = 0;
    let withoutQuiet = 0;
    const offenders = [];
    for (const abs of VUE_FILES) {
        const src = read(abs);
        let m;
        cartoonCardTag.lastIndex = 0;
        while ((m = cartoonCardTag.exec(src)) !== null) {
            total += 1;
            if (!/\btier\s*=\s*"quiet"/.test(m[0])) {
                withoutQuiet += 1;
                offenders.push(`${rel(abs)}: ${m[0].replace(/\s+/g, " ").slice(0, 90)}`);
            }
        }
    }

    if (total < 6) {
        // The §S1 inventory was ~14 sites pre-H.W11; H.W11 I6 de-nested the two
        // inner TimingFunctionPanel cartoon Cards (the bezier + steps card-in-card).
        // T.E1 (OD-1 PRUNE) removed the compose scene's two cartoon Cards
        // (AssetLayerPanel · AssetViewport), so the kf-owned cartoon-panel inventory
        // is now 7 (RibbonBar · AnimationControlsControls · KeyframesEditor ·
        // KeyframeTimeline · MatrixEditor · EasingSidebar · SpringSidebar). The
        // non-vacuity floor is 6 (a 1-site margin under the landed 7) — a count far
        // below it means the sweep missed the panels (a vacuous green guard); a
        // single accidental removal still passes, losing 2+ reds.
        fail(
            `source-shape non-vacuity — only ${total} <Card surface="cartoon"> panel site(s) found ` +
                `(the post-T.E1-prune inventory is 7; the sweep may be mis-rooted). A vacuous pass is forbidden.`,
        );
    } else if (withoutQuiet === 0) {
        ok(
            `source-shape: all ${total} kf-owned <Card surface="cartoon"> panel sites carry ` +
                `tier="quiet" (the F8 glass recovery — 0.50 α over the offset-stamp depth)`,
        );
    } else {
        fail(
            `source-shape — ${withoutQuiet} of ${total} <Card surface="cartoon"> panel sites do NOT ` +
                `carry tier="quiet" (they fall back to the resting 0.65 α — the F8 opaque regression):\n      ` +
                offenders.slice(0, 6).join("\n      "),
        );
    }
}

// ── 2. COMPUTED-TRANSLUCENCY (browser, gated) ─────────────────────────────────
// skipOrFail is KEPT for the reduced-transparency ORACLE precondition below (an
// honest cannot-certify skip, NOT a harness-start skip — those are the lib's W7-1
// seam now). REQUIRE_BROWSER is the lib's single authority.
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — ` +
                "the computed glass-translucency assertion cannot pass vacuously",
        );
    } else {
        console.log(`  ○ browser half skipped — ${reason}`);
    }
};

const CTRL_KEY = "animation-groups-control-options-store";

// The destination control-tab labels navToScene settles on (per-EXPECTED-state).
const TRIGGER = { cube: "Controls", easing: "Easing", spring: "Spring" };

/** Settle on a scene via the lib's in-page hash nav (storage + the H.W1 trap
 *  survive; goto would clear both). Re-assert the viewport AFTER navigation
 *  (Playwright resets on navigate) + force the controls pane OPEN + rest ≥500ms,
 *  the same FSM-resting settle the H.W2/W3 gates use. */
async function settleOnScene(page, scene, viewportWidth) {
    await navToScene(page, scene, TRIGGER[scene], { timeout: 8000 });
    await page.setViewportSize({ width: viewportWidth, height: 900 });
    await page.evaluate((ck) => {
        try {
            const s = JSON.parse(localStorage.getItem(ck) || "{}");
            s.isControlsPanelOpen = true;
            localStorage.setItem(ck, JSON.stringify(s));
        } catch {
            /* ignore */
        }
    }, CTRL_KEY);
    await page.waitForTimeout(700); // route rested ≥500ms + panel mount
}

/** Parse a numeric background-color alpha (0..1) from a computed color string.
 *  Handles rgb()/rgba(), color(srgb … / α), AND the CSS Color 4 slash-alpha
 *  functions oklab()/oklch()/lab()/lch()/hwb()/color() — the modern syntax
 *  glass-ui ≥3.5 resolves the glass plate to (`oklab(L a b / α)`), where 3.4
 *  emitted `color(srgb … / α)`. A fully-transparent / unset background → 0 (a
 *  deliberately-borderless Card, not an opaque regression). The generic
 *  slash-alpha extractor reads the trailing `/ α` of ANY color function, so a
 *  glass-ui color-syntax re-tune within the same translucency does not red the
 *  consume-leg (the gate measures α, not the color space). */
function bgAlphaProbeSource() {
    return `(bg) => {
        if (!bg || bg === "transparent" || bg === "rgba(0, 0, 0, 0)") return 0;
        let m = bg.match(/rgba?\\(([^)]+)\\)/);
        if (m) { const parts = m[1].split(/[,\\/]/).map((s) => s.trim()); return parts.length >= 4 ? parseFloat(parts[3]) : 1; }
        // Any CSS color function with a trailing slash-alpha: color()/oklab()/
        // oklch()/lab()/lch()/hwb()/hsl()/srgb()/... — read the alpha after the / .
        m = bg.match(/\\b[a-z]+\\([^)]*\\/\\s*([0-9.]+%?)\\s*\\)/);
        if (m) { const v = m[1]; return v.endsWith("%") ? parseFloat(v) / 100 : parseFloat(v); }
        // A color function with NO slash-alpha is fully opaque (α = 1).
        if (/\\b[a-z]+\\(/.test(bg) || /^#|^rgb|^hsl/.test(bg)) return 1; /* opaque */
        return 1;
    }`;
}

async function browserHalf() {
    const VW = 1440;
    const result = await withPage(
        {
            distDir: DIST,
            label: "the computed glass-translucency assertion",
            context: { viewport: { width: VW, height: 900 } },
        },
        async (page, { url }) => {
        // Pin the non-reduced-motion case explicitly; reduced-transparency stays at
        // the default no-preference (Playwright has no emulator — the default IS the
        // non-reduced case the F8 lock measures, asserted live below).
        await page.emulateMedia({ reducedMotion: "no-preference" });
        await page.goto(`${url}/#/cube`, { waitUntil: "load" });

        await settleOnScene(page, "cube", VW);

        // PRECONDITION: this gate measures the NON-reduced-transparency case (under
        // reduced-transparency glass-ui maps α→1 + blur→none — the panels SHOULD be
        // opaque, glass.css:367-383). Assert the live media is non-reduced or skip
        // honestly (the assertion would mis-bite otherwise).
        const reducedTransparency = await page.evaluate(
            () => matchMedia("(prefers-reduced-transparency: reduce)").matches,
        );
        if (reducedTransparency) {
            skipOrFail(
                "the live environment reports prefers-reduced-transparency: reduce — the F8 " +
                    "translucency lock measures only the NON-reduced case (glass maps α→1 under reduce)",
            );
        } else {
            const SCENES = ["cube", "easing", "spring"];
            let cartoonSeen = 0;
            let translucentWitnesses = 0; // α<1 AND backdrop≠none
            let opaqueViolators = 0; // α>0.55 (the resting regression)
            const violators = [];

            for (const scene of SCENES) {
                await settleOnScene(page, scene, VW);
                const probe = await page.evaluate(
                    ([alphaCeiling, parseSrc]) => {
                        const parseAlpha = eval(parseSrc);
                        const cards = [...document.querySelectorAll('[data-surface="cartoon"]')];
                        const results = [];
                        for (let i = 0; i < cards.length; i++) {
                            const c = cards[i];
                            const r = c.getBoundingClientRect();
                            if (r.width <= 0 || r.height <= 0) continue; // collapsed/hidden
                            const cs = getComputedStyle(c);
                            const bg = cs.backgroundColor;
                            const alpha = parseAlpha(bg);
                            const backdrop = cs.backdropFilter || cs.webkitBackdropFilter || "none";
                            results.push({
                                idx: i,
                                cls: (c.className || "").toString().slice(0, 48),
                                tier: c.getAttribute("data-tier") || null,
                                alpha,
                                hasBackdrop: !!backdrop && backdrop !== "none",
                                bg: bg.slice(0, 50),
                                backdrop: backdrop.slice(0, 40),
                                opaque: alpha > alphaCeiling,
                                translucent: alpha < 1 && !!backdrop && backdrop !== "none",
                            });
                        }
                        return results;
                    },
                    [ALPHA_CEILING, bgAlphaProbeSource()],
                );

                for (const r of probe) {
                    cartoonSeen += 1;
                    if (r.translucent) translucentWitnesses += 1;
                    if (r.opaque) {
                        opaqueViolators += 1;
                        violators.push(
                            `${scene}#${r.idx} (tier=${r.tier}) α=${r.alpha} > ${ALPHA_CEILING} ` +
                                `[bg=${r.bg}…]`,
                        );
                    }
                }
            }

            // (a) NO opaque panel: every visible cartoon Card's α ≤ 0.55 (NOT the
            // resting 0.65 regression). A single opaque panel reds.
            if (opaqueViolators === 0) {
                ok(
                    `computed-translucency: 0 of ${cartoonSeen} visible cartoon Cards (across ` +
                        `cube/easing/spring) resolve an OPAQUE background (α > ${ALPHA_CEILING}) — ` +
                        `the panels are NOT the resting 0.65 tier (F8 "glass is back")`,
                );
            } else {
                fail(
                    `computed-translucency — ${opaqueViolators} of ${cartoonSeen} visible cartoon Cards ` +
                        `resolve an OPAQUE background (α > ${ALPHA_CEILING} — the resting-tier regression):\n      ` +
                        violators.slice(0, 6).join("\n      "),
                );
            }

            // (b) NON-VACUITY + the ≥4 floor: ≥4 distinct cartoon Cards are
            // WITNESSED translucent (α<1 AND backdrop≠none). A scene that renders no
            // glassy panel (or strips the backdrop) cannot green a 0-count.
            // H.W11 lowered the floor 5→4: I2's per-scene control-surface DFA gates
            // the easing scene to ONLY the easing surface (it no longer renders the
            // extra cartoon control card it did pre-DFA), and I6 de-nested the inner
            // bezier card — so the cube/easing/spring sweep now witnesses 4 translucent
            // cartoon Cards (cube ×2 + easing ×1 + spring ×1), not the pre-W11 5. The
            // sibling proof:cartoon-is-panel-depth keeps the ≥5 box-shadow floor (it
            // counts via the named-contract sweep, not the translucency filter).
            if (translucentWitnesses >= 4) {
                ok(
                    `computed-translucency: ${translucentWitnesses} cartoon Cards resolve a TRANSLUCENT ` +
                        `(α < 1) AND backdrop-filtered background (≥4 floor met — the glass blur is live ` +
                        `over the cartoon depth)`,
                );
            } else {
                fail(
                    `computed-translucency — only ${translucentWitnesses} cartoon Card(s) (of ${cartoonSeen} ` +
                        `seen) resolve a translucent + backdrop-filtered background; the ≥4 glass floor is ` +
                        `NOT met. Either the panels lost the glass (opaque / no backdrop-filter) or the ` +
                        `panel-bearing scenes did not render — a vacuous pass is forbidden.`,
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
        `\nproof:glass-and-cartoon — FAIL (${failures.length}): the demo's panel Cards do not ` +
            `resolve the calm glass+cartoon register — a translucent (α ≤ ${ALPHA_CEILING}), ` +
            `backdrop-filtered glass plate UNDER the cartoon offset-stamp depth (the H.W9 F8 recovery).`,
    );
    process.exit(1);
}
console.log(
    `\nproof:glass-and-cartoon — PASS: every kf-owned cartoon panel Card carries tier="quiet" and ` +
        `resolves a translucent (α ≤ ${ALPHA_CEILING}), backdrop-filtered glass background under the ` +
        `cartoon depth — the glass is back (H.W9 F8). proof:cartoon-is-panel-depth covers the depth half.`,
);
