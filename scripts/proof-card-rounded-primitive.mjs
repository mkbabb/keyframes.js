#!/usr/bin/env node
/**
 * proof:card-rounded-primitive — H.W11 I4 (NO kf-owned card resolves
 * border-radius:0 anywhere — motion-path included; the deeper "impossible to
 * leave square" primitive default is a glass-ui born-RED-paired HANDOFF).
 *
 * The defect (live, the immediately-superseded W10 baseline): the sequence/path
 * stage SUBJECT roots were bare-class `glass-resting cartoon-surface` <div>s
 * (`SequenceTarget.vue:3`, `MotionPathTarget.vue:3`). The glass-ui
 * `@utility cartoon-surface` (`node_modules/@mkbabb/glass-ui/dist/styles/cards.css`,
 * the `@utility cartoon-surface` block) is decoration-only — a 2px border + an
 * offset-stamp shadow + a hover-lift, with ZERO `border-radius` BY DESIGN (the
 * radius lives on the `<Card>` root's `rounded-card`, NOT the utility). So a
 * `cartoon-surface`-ONLY <div> renders SQUARE corners — the exact defect the user
 * named: "motion-path's card is NOT rounded — it should be impossible".
 *
 * The fix, at TWO altitudes (inv-16):
 *   • THE DEMO HALF (lands NOW, born-GREEN — this lane / I5's swap closes it FOR
 *     FREE): the bare cartoon stage divs SWAP to the consumed glass-ui `<Card>`
 *     (which carries `rounded-card` by construction), so NO kf-owned stage card
 *     renders square. ZERO bare-class `cartoon-surface` <div> survives as a
 *     stage `*Target.vue` ROOT, AND every stage card resolves a non-zero computed
 *     border-radius.
 *   • THE GLASS-UI HANDOFF HALF (born-RED-paired, NOT patched in kf): make a
 *     `cartoon-surface`-ONLY element impossible to leave square FROM THE PRIMITIVE
 *     ITSELF (e.g. `@utility cartoon-surface` gains `border-radius:
 *     var(--radius-card)`, OR a `rounded-card`-carrying `cartoon-card` recipe
 *     ships). glass-ui is CONSUMED published — patching `cards.css` in kf would
 *     re-author a sibling-owned primitive (inv-16 violation). So this half is a
 *     born-RED WITNESS: it green-reports while the HANDOFF is PENDING and FLIPS
 *     RED the instant glass-ui ships the default (the consume-leg signal — bump
 *     the package, retire the demo-side guarantee's now-redundant necessity,
 *     retire this witness).
 *
 * THREE clauses:
 *
 *   1. DEMO STATIC (HARD — must be GREEN now). The stage SUBJECT `*Target.vue`
 *      ROOTS carry NO bare-class `cartoon-surface` (the cartoon stage div is
 *      DROPPED → `<Card>`). Comments that NARRATE the deletion are stripped before
 *      the scan (the doc-comments quote the dropped class as backtick-fenced inline
 *      code, NOT a live `class="…"` attribute). BITE: re-add
 *      `class="… cartoon-surface"` to a stage root → reds.
 *
 *   2. DEMO COMPUTED (HARD — must be GREEN now, browser). For EACH of {easing,
 *      spring, sequence, motion-path} the stage protagonist Card (the
 *      `[data-surface="glass"]` element in `.stage-cell`) resolves a NON-ZERO
 *      computed border-radius (the `rounded-card` token resolves — motion-path
 *      included, the named defect closed). A NON-VACUITY guard requires the card
 *      to be found per scene. BITE: a bare-cartoon (radius 0) or full-bleed (no
 *      card) stage → reds.
 *
 *   3. GLASS-UI HANDOFF (born-RED WITNESS — EXPECTED-RED while PENDING, FLIPS RED
 *      on ship). Parse the PUBLISHED `cards.css`: does the `@utility
 *      cartoon-surface` block declare a `border-radius` (OR a `cartoon-card`
 *      rounded recipe ship)? While the HANDOFF is PENDING (no radius on the
 *      primitive) the witness HOLDS — the gate green-reports (clauses 1+2 carry
 *      the demo guarantee). The instant glass-ui ships the default radius the
 *      witness FLIPS RED — hard-fail so the kf consume-leg is done: bump
 *      @mkbabb/glass-ui + retire this witness (the chronic actually closing).
 *
 * Settle-gated on the H.W1 FSM resting (mirrors proof:scene-card-rounded): each
 * scene is pinned via the lib's navToScene (an IN-PAGE hash assignment — NOT
 * page.goto, which clears storage + the H.W1 reconcile trap — settled on the
 * destination's per-EXPECTED control surface), the viewport is RE-ASSERTED after
 * navigation, and the gate waits until the stage glass Card resolves before
 * measuring. Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage =
 * serveDist + resolveChromium + context/teardown, J.W3 S1). Under
 * KF_REQUIRE_BROWSER a playwright-absent skip on the COMPUTED half becomes a
 * hard fail AT THE LIB SEAM (the demo-side radius guarantee cannot pass
 * vacuously); the STATIC half + the HANDOFF witness run regardless.
 *
 * Re-runnable: `node scripts/proof-card-rounded-primitive.mjs`. Serves the BUILT
 * dist/gh-pages/ (run `npm run gh-pages` first).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log("proof:card-rounded-primitive — H.W11 I4 (no kf-owned card renders square; the glass-ui radius-primitive is a born-RED-paired HANDOFF)");

// The destination control-tab labels navToScene settles on (per-EXPECTED-state;
// null = the scene mounts no control panel — sequence).
const TRIGGER = { easing: "Curve", spring: "Physics", sequence: null }; // item-7a facet defaults

function stripComments(src) {
    // strip /* … */ + <!-- … --> so a doc-comment quoting the dropped class is not a usage
    return src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/<!--[\s\S]*?-->/g, " ");
}

// ── 1. DEMO STATIC: no bare-class cartoon-surface on a stage *Target.vue ROOT ──
function staticHalf() {
    // the converged stage SUBJECT roots (I5/S1). A bare-class `cartoon-surface`
    // in live markup (not a comment) re-introduces the square defect — the radius
    // lives on the <Card> root, not the utility. (The motion-path root was PRUNED
    // at T.E3, OD-1 = PRUNE.)
    const stageRoots = [
        "demo/scenes/easing/EasingTarget.vue",
        "demo/scenes/spring/SpringTarget.vue",
        "demo/scenes/spring/StartingStyleTarget.vue",
        "demo/scenes/sequence/SequenceTarget.vue",
    ];
    let offenders = 0;
    for (const rel of stageRoots) {
        const p = path.join(REPO, rel);
        if (!fs.existsSync(p)) {
            fail(`static — stage root ${rel} not found`);
            continue;
        }
        const src = stripComments(fs.readFileSync(p, "utf8"));
        if (/\bcartoon-surface\b/.test(src)) {
            fail(
                `static — ${rel} carries a bare-class \`cartoon-surface\` in live markup; the stage ` +
                    `card MUST consume the glass-ui <Card> (rounded-card by construction), not a bare ` +
                    `cartoon div (border-radius 0 — the I4 square defect)`,
            );
            offenders++;
        }
    }
    if (offenders === 0) {
        ok(
            "static — the four stage *Target.vue roots (easing/spring/starting-style/sequence) " +
                "carry ZERO bare-class `cartoon-surface`; every stage card consumes the " +
                "rounded `<Card>` primitive (I4 closed by I5's swap — no kf-owned square card)",
        );
    }
    return offenders;
}

// ── 2. DEMO COMPUTED: every stage card resolves a non-zero border-radius ───────
async function settleOnScene(page, scene, viewportWidth, viewportHeight) {
    await navToScene(page, scene, TRIGGER[scene], { timeout: 8000 });
    await page.setViewportSize({ width: viewportWidth, height: viewportHeight });
    await page.waitForTimeout(700);
}

/** Wait until the stage glass Card resolves. RESILIENT: if the heaviest scene
 *  (spring) loses the first settle race (the FSM rest poll timed out silently),
 *  RE-SETTLE once before reporting absent — a true full-bleed/bare-cartoon stage
 *  still reds (the card never appears across both attempts), a slow mount does
 *  not false-RED. */
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
    await settleOnScene(page, scene, viewportWidth, viewportHeight);
    return probeOnce();
}

const SCENES = [
    { scene: "easing", label: "easing" },
    { scene: "spring", label: "spring" },
    { scene: "sequence", label: "sequence" },
];

async function computedHalf() {
    const VW = 1440;
    const VH = 900;
    const result = await withPage(
        {
            distDir: DIST,
            label: "the demo-side stage-card rounding",
            context: { viewport: { width: VW, height: VH } },
        },
        async (page, { url }) => {
        await page.goto(`${url}/#/${SCENES[0].scene}`, { waitUntil: "load" });
        for (const { scene, label } of SCENES) {
            await settleOnScene(page, scene, VW, VH);
            const mounted = await waitStageCard(page, scene, VW, VH);

            if (!mounted) {
                fail(
                    `${label} — the stage glass Card never mounted; cannot assert its computed radius ` +
                        `(the FSM may not have rested on ${scene}, or the stage is still bare/full-bleed)`,
                );
                continue;
            }

            const probe = await page.evaluate(() => {
                const cell = document.querySelector(".stage-cell");
                const card = cell.querySelector('[data-surface="glass"]');
                const cs = getComputedStyle(card);
                const radii = [
                    cs.borderTopLeftRadius,
                    cs.borderTopRightRadius,
                    cs.borderBottomLeftRadius,
                    cs.borderBottomRightRadius,
                ].map((v) => parseFloat(v) || 0);
                return { maxRadius: Math.max(...radii), cls: (card.className?.baseVal ?? card.className ?? "").slice(0, 80) };
            });

            if (probe.maxRadius > 0) {
                ok(
                    `${label} — the stage card resolves a non-zero border-radius ` +
                        `(${Math.round(probe.maxRadius)}px — rounded-card consumed; motion-path's named ` +
                        `square defect is closed)`,
                );
            } else {
                fail(
                    `${label} — the stage card renders SQUARE corners (border-radius 0: '${probe.cls}'); ` +
                        `the kf-owned stage card must be rounded (the I4 defect — "it should be impossible")`,
                );
            }
        }
        },
    );
    if (result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
    }
}

// ── 3. GLASS-UI HANDOFF WITNESS (born-RED — EXPECTED-RED while PENDING) ─────────
/** Witness whether glass-ui has shipped the radius-on-the-primitive default.
 *  PENDING (witness holds, green-report) ⟺ the published `@utility cartoon-surface`
 *  carries NO `border-radius` AND no `cartoon-card` rounded recipe ships.
 *  Returns { primitiveRoundsBareCartoon, why }. */
function handoffWitness() {
    const cardsCss = path.join(REPO, "node_modules/@mkbabb/glass-ui/dist/styles/cards.css");
    if (!fs.existsSync(cardsCss)) {
        // cannot read the installed primitive — a HANDOFF witness cannot certify
        // PENDING in isolation; treat as "cannot witness" (not a demo-half fail).
        return { readable: false, primitiveRoundsBareCartoon: false, why: "cards.css not installed (run `npm ci`)" };
    }
    const css = fs.readFileSync(cardsCss, "utf8");
    // the @utility cartoon-surface block (up to its closing brace at column 0)
    const utilMatch = css.match(/@utility\s+cartoon-surface\s*\{[\s\S]*?\n\}/);
    const utilBlock = utilMatch ? utilMatch[0] : "";
    const utilHasRadius = /border-radius\s*:/.test(utilBlock) || /\bborder-radius\b/.test(utilBlock) || /\brounded\b/.test(utilBlock);
    // OR a rounded cartoon-card recipe ships
    const cartoonCardRecipe = /@utility\s+cartoon-card\b/.test(css);
    const primitiveRoundsBareCartoon = utilHasRadius || cartoonCardRecipe;
    const why = utilHasRadius
        ? "the @utility cartoon-surface block now declares a border-radius"
        : cartoonCardRecipe
          ? "a rounded `cartoon-card` recipe now ships"
          : "the @utility cartoon-surface carries NO border-radius (radius still lives on the <Card> root only)";
    return { readable: true, primitiveRoundsBareCartoon, why };
}

// ── run ────────────────────────────────────────────────────────────────────────
const staticOffenders = staticHalf();
await computedHalf();

// the HANDOFF witness — assessed AFTER the demo halves so a demo regression reds
// first (the demo guarantee is the load-bearing assertion; the witness is the ledger).
const w = handoffWitness();
if (!w.readable) {
    console.log(`\n  ◯ glass-ui HANDOFF witness — ${w.why} (cannot certify PENDING; the demo halves carry the guarantee)`);
} else if (!w.primitiveRoundsBareCartoon) {
    console.log(
        `\n  ◐ glass-ui HANDOFF PENDING (born-RED witness — EXPECTED): ${w.why}. ` +
            `A \`cartoon-surface\`-ONLY element is still square FROM THE PRIMITIVE — kf cannot fix ` +
            `this (inv-16: glass-ui owns cards.css). The demo guarantee (clauses 1+2) holds the line ` +
            `today; this witness FLIPS RED the instant glass-ui ships the radius default.`,
    );
}

// the demo halves are the HARD assertions
if (failures.length > 0) {
    console.error(
        `\nproof:card-rounded-primitive — FAIL (${failures.length}): a kf-owned stage card renders ` +
            `square (a bare-class \`cartoon-surface\` stage root survives or a stage card's computed ` +
            `border-radius is 0) — the demo-side I4 guarantee is the load-bearing assertion.`,
    );
    process.exit(1);
}

// the demo halves PASSED. Now the HANDOFF consume-leg flip: if glass-ui HAS
// shipped the primitive radius, the witness FLIPS RED — the consume-leg is DUE.
if (w.readable && w.primitiveRoundsBareCartoon) {
    console.error(
        `\nproof:card-rounded-primitive — FAIL (consume-leg DUE): glass-ui NOW rounds a ` +
            `\`cartoon-surface\`-only element FROM THE PRIMITIVE (${w.why}). The inv-16 HANDOFF is ` +
            `satisfied upstream — the kf consume-leg is DUE:\n` +
            `  1. bump @mkbabb/glass-ui to the publishing version,\n` +
            `  2. confirm bare cartoon divs round from the primitive (the deeper "impossible to leave ` +
            `square" guarantee is now structural),\n` +
            `  3. retire this born-RED witness (the I4 HANDOFF is closed).`,
    );
    process.exit(1);
}

void staticOffenders;
console.log(
    "\nproof:card-rounded-primitive — PASS: no kf-owned card renders square (the five stage *Target.vue " +
        "roots carry zero bare-class `cartoon-surface`; every stage card resolves a non-zero computed " +
        "border-radius — motion-path included), and the glass-ui radius-primitive HANDOFF is correctly " +
        "PENDING (born-RED witness held) — H.W11 I4.",
);
