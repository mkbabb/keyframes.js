#!/usr/bin/env node
/**
 * proof:bezier-single-card — H.W11 I6 (S5) the cubic-bézier de-nest lock
 * (no card-in-card; born-RED on the W9/W10 inner Card).
 *
 * The defect (live, desktop, the cubic-bézier detail panel): the bezier detail
 * editor was rendered as `<Card surface="cartoon" tier="quiet" class="easing-editor
 * …">` (`TimingFunctionPanel.vue:15`) INSIDE the controls host
 * (`AnimationControlsControls.vue:3` is itself a `<Card surface="cartoon">`, and it
 * renders `<TimingFunctionPanel>` at `:128`) — card-in-card. The steps variant
 * (`TimingFunctionPanel.vue:87`) was the same shape. I6 (S5) DROPS the inner
 * `<Card>` (both variants): the bezier/steps editor flows into the parent controls
 * Card's content directly (the detail panel is a VIEW within the controls Card, not
 * its own card). NO legacy beside the replacement — the inner Card subtree is
 * DELETED, not `display:none`-suppressed.
 *
 * One falsifiable BROWSER clause, BITING on the exact card-in-card defect (born-RED
 * on `tranche-h-impl` HEAD, GREEN on the I6 de-nest):
 *
 *   EXACTLY ONE CARD DEPTH. Between the bezier canvas (`.easing-curve-canvas`) and
 *   the controls-pane root (`.controls-layout`), count the glass-ui `<Card>`
 *   ancestors. A glass-ui Card is identified by its `data-surface` attribute (the
 *   Card root ALWAYS emits `data-surface` — `cartoon`/`glass`/… — VERIFIED in the
 *   published render; a decorative `rounded-card` wrapper like
 *   `.easing-curve-canvas-wrapper` carries NO `data-surface`, so it is NOT counted).
 *   The count MUST be EXACTLY 1 (the controls-pane Card). BITE: RED today — the
 *   inner `TimingFunctionPanel.vue:15` Card (`data-surface="cartoon"`) nested inside
 *   the controls Card (`data-surface="cartoon"`) → 2 Card ancestors. GREEN once the
 *   inner Card is removed → 1.
 *
 * NON-VACUITY: the bezier detail panel must be actually OPEN (the host present with
 * real area AND the `.easing-curve-canvas` mounted) — driven by a REAL click on the
 * live `.easing-edit-btn` pencil (the same trusted-input driver
 * proof:bezier-no-scroll uses); a panel that never opened fails LOUD, never
 * green-vacuous. AND the controls-pane Card (`data-surface`) MUST be found as an
 * ancestor (count ≥ 1) so a zero-card render (no host) cannot pass as "exactly 1".
 *
 * Settle-gated on the H.W1 FSM resting (the lib's navToScene #/cube hash pin +
 * pane-open + viewport-re-assert + detail-row-settle plumbing
 * proof:bezier-no-scroll uses; page.goto clears storage + the H.W1 reconcile
 * trap). Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist
 * + resolveChromium + context/teardown, J.W3 S1) + navToScene. Browser-only (the
 * rendered card depth is a DOM fact — the static source half is that
 * TimingFunctionPanel no longer imports/renders an inner Card, which
 * proof:bezier-no-scroll's header-bake already constrains; this gate locks the
 * COMPUTED depth). Under KF_REQUIRE_BROWSER a playwright-absent skip becomes a
 * hard fail AT THE LIB SEAM so a SHIP is never green-reported un-exercised.
 * Re-runnable:
 * `node scripts/proof-bezier-single-card.mjs`. Serves the BUILT dist/gh-pages/
 * (run `npm run gh-pages` first).
 */
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

console.log("proof:bezier-single-card — H.W11 I6 (the cubic-bézier de-nest lock; no card-in-card)");

const CTRL_KEY = "animation-groups-control-options-store";

async function settleOnCube(page, viewportWidth, viewportHeight) {
    await navToScene(page, "cube", "Controls", { timeout: 8000 });
    await page.setViewportSize({ width: viewportWidth, height: viewportHeight });
    await page.evaluate((ck) => {
        try {
            const s = JSON.parse(localStorage.getItem(ck) || "{}");
            s.isControlsPanelOpen = true;
            localStorage.setItem(ck, JSON.stringify(s));
        } catch {
            /* fall through to the class toggle */
        }
        const el = document.querySelector(".controls-layout");
        if (el) {
            el.classList.add("controls-layout--open");
            el.classList.remove("controls-layout--closed");
        }
    }, CTRL_KEY);
    await page.waitForTimeout(600);
}

/** Open the cubic-bézier detail panel via a REAL click on the live easing-edit
 *  pencil — the same trusted-input driver proof:bezier-no-scroll uses. Returns
 *  true once the detail panel host + the .easing-curve-canvas are live + the
 *  animated row height has stabilized. */
async function openBezierPanel(page) {
    const pencil = await page.$(".easing-edit-btn");
    if (!pencil) return false;
    try {
        await pencil.click({ timeout: 2000, force: true });
    } catch {
        return false;
    }
    await pencil.dispose?.();
    const settled = await page
        .waitForFunction(
            () => {
                const host = document.querySelector(
                    ".panel-row--detail.panel-row--active > .panel-content",
                );
                const canvas = document.querySelector(".easing-curve-canvas");
                if (!host || !canvas) return false;
                const cR = canvas.getBoundingClientRect();
                if (!(cR.width > 0 && cR.height > 0)) return false;
                const prev = host.__bezierPrevCH;
                const now = host.clientHeight;
                host.__bezierPrevCH = now;
                return now > 40 && prev != null && Math.abs(now - prev) <= 1;
            },
            { timeout: 8000, polling: 200 },
        )
        .then(() => true)
        .catch(() => false);
    await page.waitForTimeout(400);
    return settled;
}

async function browserHalf() {
    const VW = 1440;
    const VH = 900;
    const result = await withPage(
        {
            distDir: DIST,
            label: "the single-card-depth clause",
            context: { viewport: { width: VW, height: VH } },
        },
        async (page, { url }) => {
        await page.goto(`${url}/#/cube`, { waitUntil: "load" });
        await settleOnCube(page, VW, VH);
        const opened = await openBezierPanel(page);

        if (!opened) {
            const dbg = await page.evaluate(() => ({
                hasPencil: !!document.querySelector(".easing-edit-btn"),
                hasHost: !!document.querySelector(
                    ".panel-row--detail.panel-row--active > .panel-content",
                ),
                hasCanvas: !!document.querySelector(".easing-curve-canvas"),
                paneOpen: !!document.querySelector(".controls-layout--open"),
                hash: location.hash,
            }));
            fail(
                `the cubic-bézier detail panel never opened ` +
                    `(pencil:${dbg.hasPencil}, host:${dbg.hasHost}, canvas:${dbg.hasCanvas}, ` +
                    `paneOpen:${dbg.paneOpen}, hash:${dbg.hash}). The card-depth cannot be measured ` +
                    `on a panel that never opened — a vacuous pass is forbidden.`,
            );
        } else {
            // Count glass-ui Card ancestors (data-surface) from the canvas up to the
            // controls-pane root. A decorative rounded-card wrapper (no data-surface)
            // is NOT a Card and is excluded.
            const probe = await page.evaluate(() => {
                const canvas = document.querySelector(".easing-curve-canvas");
                if (!canvas) return { found: false };
                const cards = [];
                let stoppedAtRoot = false;
                let el = canvas.parentElement;
                let guard = 0;
                while (el && guard++ < 200) {
                    if (el.classList.contains("controls-layout")) {
                        stoppedAtRoot = true;
                        break;
                    }
                    // The glass-ui Card root ALWAYS carries data-surface (cartoon /
                    // glass / …). A decorative `rounded-card` wrapper does NOT, so
                    // it is correctly NOT counted as a Card.
                    if (el.hasAttribute("data-surface")) {
                        cards.push({
                            surface: el.getAttribute("data-surface"),
                            tier: el.getAttribute("data-tier"),
                            cls: el.className.slice(0, 56),
                        });
                    }
                    el = el.parentElement;
                }
                return { found: true, stoppedAtRoot, cardCount: cards.length, cards };
            });

            if (!probe.found) {
                fail("the .easing-curve-canvas vanished after open — cannot measure card depth");
            } else if (!probe.stoppedAtRoot) {
                fail(
                    "card-depth — the walk from the canvas never reached the .controls-layout root " +
                        "(the canvas is not mounted inside the controls pane); cannot bound the depth",
                );
            } else if (probe.cardCount === 1) {
                ok(
                    `single card: EXACTLY 1 glass-ui Card (data-surface="${probe.cards[0].surface}") ` +
                        `between the bezier canvas and the .controls-layout root — the inner ` +
                        `TimingFunctionPanel Card is GONE (de-nested); the detail editor flows into ` +
                        `the parent controls Card directly`,
                );
            } else if (probe.cardCount === 0) {
                fail(
                    `single card — ZERO glass-ui Card ancestors found between the canvas and the ` +
                        `.controls-layout root (the controls-pane Card must be present; a zero-card ` +
                        `render cannot pass as "exactly 1")`,
                );
            } else {
                fail(
                    `single card — ${probe.cardCount} glass-ui Card ancestors (need EXACTLY 1): ` +
                        probe.cards.map((c) => `data-surface="${c.surface}"`).join(" inside ") +
                        `. Born-RED today (the inner TimingFunctionPanel.vue:15 Card nested inside the ` +
                        `AnimationControlsControls controls Card → 2); greens on the I6 inner-card removal.`,
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
        `\nproof:bezier-single-card — FAIL (${failures.length}): the cubic-bézier detail panel ` +
            `nests a card inside a card (the inner Card must be DROPPED — H.W11 I6).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:bezier-single-card — PASS: the cubic-bézier detail panel has EXACTLY ONE glass-ui " +
        "Card between the canvas and the controls-pane root (the inner Card is de-nested; the " +
        "editor flows into the parent controls Card — H.W11 I6).",
);
