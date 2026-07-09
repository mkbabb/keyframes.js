#!/usr/bin/env node
/**
 * proof:stage-glass-card — H.W11 I5 (the four STAGE scenes converge to ONE
 * standard, NON-cartoon glass `<Card>` encapsulation — the headline that
 * REVERSES W10 G8's full-bleed stage).
 *
 * The defect (live, the immediately-superseded W10 baseline): the four stage
 * SUBJECT roots were in THREE different states —
 *   (a) easing/spring → FULL-BLEED, NO card (W10 G8: `EasingTarget.vue:2-10`,
 *       `SpringTarget.vue:2-8`, `StartingStyleTarget.vue` — a bare
 *       `h-full w-full` div, so the stage had NO `rounded-card` radius AND NO
 *       glass `backdrop-filter`);
 *   (b) sequence/path → a bare-class `glass-resting cartoon-surface` <div>
 *       (`SequenceTarget.vue:3`, `MotionPathTarget.vue:3`) — the `cartoon-surface`
 *       @utility carries NO `border-radius` (the radius lives on the `<Card>`
 *       root's `rounded-card`), so those stage cards rendered SQUARE corners (the
 *       exact I4 defect the user named: "motion-path's card is NOT rounded — it
 *       should be impossible");
 *   (c) the I5 target → ALL FOUR on ONE standard non-cartoon glass `<Card>`
 *       (`tier="resting" surface="glass"`, rounded-card by construction).
 *
 * The fix (I5/S1): the full-bleed divs (easing/spring/starting-style) and the
 * bare cartoon divs (sequence/path) ALL swap to the consumed glass-ui `<Card>`
 * (default `tier="resting" surface="glass"`), which emits — by construction —
 * `rounded-card` (→ 16px), `glass-resting` (→ `backdrop-filter: blur(12px)
 * saturate(1.05)`), the `glass-specular-track` rim, AND `data-surface="glass"
 * data-tier="resting"`. The card sits in the surviving `.stage-cell` PRIMITIVE
 * (the G8 LAYOUT half survives; only the surface consequence reverses). The
 * control PANELS stay cartoon+quiet (W2/W9) — two altitudes, cleanly separated.
 *
 * The BROWSER clause, BITING the exact defect, for EACH of {easing, spring,
 * sequence}: the stage SUBJECT root — uniquely the
 * `[data-surface="glass"]` Card inside `.stage-cell` (this selector EXCLUDES
 * spring's `spring-view-switch` cartoon pill, which carries `cartoon-surface` +
 * `rounded-full` but NO `data-surface` — it is chrome, not the protagonist plate)
 * — resolves ALL of:
 *   1. data-surface === "glass" AND data-tier === "resting" (the standard glass
 *      register, NOT cartoon — `data-surface !== "cartoon"`);
 *   2. NON-zero computed border-radius (the `rounded-card` token resolves — NOT
 *      the full-bleed div's 0, NOT the cartoon-surface div's 0) — I4 closes here
 *      FOR FREE;
 *   3. backdrop-filter !== 'none' (the glass plate — NOT the full-bleed div's
 *      none);
 *   4. the element is NOT `cartoon-surface` (the bare cartoon div is GONE) AND
 *      NOT the bare full-bleed div (it IS a Card — the data-surface attr proves
 *      it; a bare div carries neither attr nor `rounded-card`).
 * A NON-VACUITY guard requires EXACTLY-ONE protagonist glass Card per
 * `.stage-cell` (zero → the stage is still full-bleed/bare → reds; the assertion
 * cannot pass vacuously).
 *
 * Settle-gated on the H.W1 FSM resting (mirrors proof:scene-card-rounded /
 * proof:easing-stage-is-ball): each scene is pinned via the lib's navToScene (an
 * IN-PAGE hash assignment — NOT page.goto, which clears storage + the H.W1
 * reconcile trap — settled on the destination's per-EXPECTED control surface),
 * the viewport is RE-ASSERTED after navigation, and the gate waits until the
 * stage glass Card resolves before measuring. Harness: the
 * scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist + resolveChromium +
 * context/teardown, J.W3 S1). Browser-only (the converged card register is a
 * RENDERED fact — the computed radius + backdrop are live values; there is no
 * static half here, the static "no bare cartoon stage root" fact is owned by
 * proof:card-rounded-primitive). Under KF_REQUIRE_BROWSER a playwright-absent
 * skip becomes a hard fail AT THE LIB SEAM so the I5 convergence is never
 * green-reported un-exercised.
 *
 * This is the I5 SUPERSESSION of W10 `proof:scene-card-rounded`'s full-bleed
 * branch: that gate's "OR the stage is full-bleed" disjunct no longer holds (the
 * full-bleed subject no longer exists — it IS a card now). H.W8 folds the W10
 * gate's full-bleed disjunct OUT (see §KEPT UNCHANGED/SUPERSEDED in H.W11.md).
 *
 * Re-runnable: `node scripts/proof-stage-glass-card.mjs`. Serves the BUILT
 * dist/gh-pages/ (run `npm run gh-pages` first).
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, REQUIRE_BROWSER, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log("proof:stage-glass-card — H.W11 I5 (the stage scenes converge to ONE standard glass Card; REVERSES W10 G8 full-bleed)");

// The destination control-tab labels navToScene settles on (per-EXPECTED-state;
// null = the scene mounts no control panel — sequence).
const TRIGGER = { easing: "Easing", spring: "Spring", sequence: null };

/** Settle on #/<scene> via the lib's in-page hash nav (storage + the H.W1 trap
 *  survive; page.goto clears both). Re-assert the viewport AFTER navigation. The
 *  stage subject is the DEFAULT view (no pane/tab toggle needed — the stage Card
 *  is the protagonist, not a sidebar surface). Rest ≥500ms. */
async function settleOnScene(page, scene, viewportWidth, viewportHeight) {
    await navToScene(page, scene, TRIGGER[scene], { timeout: 8000 });
    await page.setViewportSize({ width: viewportWidth, height: viewportHeight });
    await page.waitForTimeout(700); // route rested ≥500ms + the grid reflow
}

/** Wait until the stage's protagonist glass Card resolves (the scene is in its
 *  card form, not mid-mount). The protagonist is the `[data-surface="glass"]`
 *  Card inside `.stage-cell` (uniquely — the spring cartoon pill carries no
 *  data-surface). RESILIENT: if the heaviest scene (spring) loses the first
 *  settle race (the FSM rest poll timed out silently), RE-SETTLE once before
 *  reporting absent — a true full-bleed/bare-cartoon stage still reds (the card
 *  never appears across both attempts), but a slow mount does not false-RED. */
async function waitStageCard(page, scene, viewportWidth, viewportHeight) {
    const probeOnce = () =>
        page
            .waitForFunction(
                () => {
                    const cell = document.querySelector(".stage-cell");
                    if (!cell) return false;
                    const card = cell.querySelector('[data-surface="glass"]');
                    if (!card) return false;
                    const r = card.getBoundingClientRect();
                    return r.width > 0 && r.height > 0;
                },
                { timeout: 8000 },
            )
            .then(() => true)
            .catch(() => false);
    if (await probeOnce()) return true;
    // one re-settle (re-assert the hash + re-poll the FSM rest) then probe again
    await settleOnScene(page, scene, viewportWidth, viewportHeight);
    return probeOnce();
}

const SCENES = [
    { scene: "easing", label: "easing" },
    { scene: "spring", label: "spring" },
    { scene: "sequence", label: "sequence" },
];

async function browserHalf() {
    const VW = 1440;
    const VH = 900;
    let converged = 0;
    const result = await withPage(
        {
            distDir: DIST,
            label: "the four-scene glass-card convergence",
            context: { viewport: { width: VW, height: VH } },
        },
        async (page, { url }) => {
        await page.goto(`${url}/#/${SCENES[0].scene}`, { waitUntil: "load" });
        for (const { scene, label } of SCENES) {
            await settleOnScene(page, scene, VW, VH);
            const mounted = await waitStageCard(page, scene, VW, VH);

            if (!mounted) {
                const dbg = await page.evaluate(() => ({
                    hasCell: !!document.querySelector(".stage-cell"),
                    hasGlassCard: !!document.querySelector('.stage-cell [data-surface="glass"]'),
                    hash: location.hash,
                }));
                fail(
                    `${label} — the stage glass Card never mounted (cell:${dbg.hasCell}, ` +
                        `glassCard:${dbg.hasGlassCard}, hash:${dbg.hash}); the stage may still be ` +
                        `FULL-BLEED (no card) or BARE-CARTOON — the FSM may not have rested on ${scene}`,
                );
                continue;
            }

            const probe = await page.evaluate(() => {
                const cell = document.querySelector(".stage-cell");
                // the protagonist plate: the glass Card(s) inside the stage cell.
                // EXCLUDES the spring `spring-view-switch` cartoon pill (no data-surface).
                const glassCards = [...cell.querySelectorAll('[data-surface="glass"]')];
                // the pre-I5 sequence/path defect: a bare-class `cartoon-surface` stage div
                // with SQUARE corners (border-radius 0). A rounded cartoon chrome element
                // (e.g. spring's `spring-view-switch` `rounded-full` view-toggle PILL) is NOT
                // the defect — it is legitimate chrome, caught GREEN by its own rounded radius
                // (the W10 proof:scene-card-rounded contract). Only a SQUARE bare cartoon div
                // re-introduces the I4 stage defect.
                const squareCartoon = [...cell.querySelectorAll("*")].filter((el) => {
                    const c = " " + (el.className?.baseVal ?? el.className ?? "") + " ";
                    if (!/\scartoon-surface\s/.test(c)) return false;
                    if (el.getAttribute("data-surface") === "glass") return false;
                    const cs = getComputedStyle(el);
                    const radius = Math.max(
                        parseFloat(cs.borderTopLeftRadius) || 0,
                        parseFloat(cs.borderTopRightRadius) || 0,
                        parseFloat(cs.borderBottomLeftRadius) || 0,
                        parseFloat(cs.borderBottomRightRadius) || 0,
                    );
                    const r = el.getBoundingClientRect();
                    return radius <= 0 && r.width > 0 && r.height > 0;
                });
                const map = glassCards.map((el) => {
                    const cs = getComputedStyle(el);
                    const radii = [
                        cs.borderTopLeftRadius,
                        cs.borderTopRightRadius,
                        cs.borderBottomLeftRadius,
                        cs.borderBottomRightRadius,
                    ].map((v) => parseFloat(v) || 0);
                    const r = el.getBoundingClientRect();
                    const cls = el.className?.baseVal ?? el.className ?? "";
                    return {
                        cls: cls.slice(0, 90),
                        dataSurface: el.getAttribute("data-surface"),
                        dataTier: el.getAttribute("data-tier"),
                        maxRadius: Math.max(...radii),
                        backdrop: cs.backdropFilter || cs.webkitBackdropFilter || "none",
                        isCartoon: /\scartoon-surface\s/.test(" " + cls + " "),
                        w: Math.round(r.width),
                        h: Math.round(r.height),
                    };
                });
                return { glassCount: glassCards.length, squareCartoonInStage: squareCartoon.length, cards: map };
            });

            // ── NON-VACUITY: exactly ONE protagonist glass Card in the stage cell ──
            if (probe.glassCount === 0) {
                fail(
                    `${label} — ZERO glass Card in .stage-cell (the stage is still full-bleed ` +
                        `or bare-cartoon); I5 demands the stage SUBJECT resolves a standard glass Card`,
                );
                continue;
            }
            if (probe.glassCount > 1) {
                fail(
                    `${label} — ${probe.glassCount} glass Cards in .stage-cell (expected EXACTLY one ` +
                        `protagonist plate); the stage register must converge to ONE card, not nest cards`,
                );
                continue;
            }

            const card = probe.cards[0];
            const problems = [];
            // 1. standard glass register, NOT cartoon
            if (card.dataSurface !== "glass" || card.dataTier !== "resting") {
                problems.push(`data-surface/tier is ${card.dataSurface}/${card.dataTier} (expected glass/resting)`);
            }
            if (card.isCartoon) {
                problems.push("the stage card carries `cartoon-surface` (it must be the NON-cartoon glass register)");
            }
            // 2. non-zero border-radius (I4 for free — rounded-card resolves)
            if (!(card.maxRadius > 0)) {
                problems.push(`border-radius is ${card.maxRadius}px (the rounded-card token did not resolve — the full-bleed/bare-cartoon square defect)`);
            }
            // 3. glass backdrop (not the full-bleed div's none)
            if (card.backdrop === "none" || !card.backdrop) {
                problems.push("backdrop-filter is 'none' (the glass plate's backdrop did not resolve — still full-bleed)");
            }
            // 4. no SQUARE bare cartoon stage div survives beside the card (a rounded
            //    cartoon chrome pill — e.g. spring's view-switch — is legitimate, not the defect)
            if (probe.squareCartoonInStage > 0) {
                problems.push(`${probe.squareCartoonInStage} SQUARE bare-class \`cartoon-surface\` div(s) survive in .stage-cell beside the Card (the I4 defect — no legacy beside the replacement)`);
            }

            if (problems.length === 0) {
                converged++;
                ok(
                    `${label} — the stage SUBJECT resolves ONE standard glass Card: ` +
                        `data-surface=glass tier=resting · radius ${Math.round(card.maxRadius)}px · ` +
                        `backdrop ${card.backdrop} · NOT cartoon (${card.w}×${card.h}) — I5 + I4 for free`,
                );
            } else {
                fail(`${label} — the stage card is not the converged glass register: ${problems.join("; ")}`);
            }
        }
        },
    );
    if (result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
        return;
    }

    // the stage-scene convergence: all must resolve the SAME register
    if (REQUIRE_BROWSER || converged > 0) {
        if (converged === SCENES.length) {
            ok(
                `the ${SCENES.length} stage scenes (${SCENES.map((s) => s.label).join(", ")}) converged to ONE ` +
                    `standard glass-card register (the I5/I8/I12 isomorphism — three states → one)`,
            );
        } else if (failures.length === 0) {
            // converged>0 but <N with no recorded failure means a scene was skipped — surface it
            fail(
                `only ${converged}/${SCENES.length} stage scenes converged to the glass-card register ` +
                    `(all MUST converge — any left full-bleed or bare-cartoon breaks the isomorphism)`,
            );
        }
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:stage-glass-card — FAIL (${failures.length}): a stage scene did not converge to the ` +
            `standard non-cartoon glass Card register (it is still full-bleed, bare-cartoon-square, or ` +
            `not the glass surface) — H.W11 I5.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:stage-glass-card — PASS: the stage scenes (easing/spring/sequence) each " +
        "resolve ONE standard non-cartoon glass <Card> (data-surface=glass · rounded-card radius · glass " +
        "backdrop · NOT cartoon) — the I5 reversal of W10 G8's full-bleed, the protagonist convergence.",
);
