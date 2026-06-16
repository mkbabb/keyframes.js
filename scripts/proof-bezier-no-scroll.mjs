#!/usr/bin/env node
/**
 * proof:bezier-no-scroll — H.W9 F2 (S4) the bezier-panel FIT + header-bake lock.
 *
 * The defect (live, desktop, the cubic-bézier detail panel): the panel's intrinsic
 * height (header + the 280px easing canvas + the timing readout + the preset select
 * + a STANDALONE top-LEFT back `<Button>` ABOVE the card) exceeded the detail-panel
 * cap `min(50vh,480px); overflow-y:auto` (AnimationControlsControls.vue:331-334),
 * producing a vertical scrollbar; W4 had placed the back affordance as an external
 * top-LEFT element ABOVE the Card (the former TimingFunctionPanel.vue:5-12). F2
 * (S4) fits the panel — a TIGHTER in-panel canvas ceiling (clamp(160,38cqi,220),
 * a NAMED panel-context clamp UNDER W4's full-rail 280, the square law preserved)
 * + the header move removing one row — and bakes the back into the CardHeader RIGHT
 * (a ghost icon-button `@click="emit('exitDetailPanel')"` beside the `cubic-bézier`
 * CardTitle), DELETING the external button (no legacy beside its replacement).
 *
 * Two falsifiable BROWSER clauses, each BITING on the exact defect (born-RED on the
 * pre-W9 tree, GREEN on the F2 fix):
 *
 *   1. NO VERTICAL OVERFLOW. The detail-panel host `.panel-row--detail.panel-row--active
 *      > .panel-content` (the `max-height: min(50vh,480px); overflow-y:auto` cap)
 *      resolves `scrollHeight <= clientHeight + TOL` (the content fits — no scroll
 *      region) AND `getComputedStyle(host).overflowY !== 'scroll'` (a permanent
 *      scrollbar is forbidden — `auto` is fine ONLY because the content fits so it
 *      never engages). BITE: RED today (the bezier stack overflows the cap on a
 *      standing desktop viewport → scrollHeight > clientHeight); GREEN once the
 *      tighter canvas + header-bake make it fit.
 *
 *   2. HEADER-RIGHT BAKE. The back/close control (the `[aria-label="back to
 *      controls"]` ghost button) is, inside the bezier Card's CardHeader row, to
 *      the RIGHT of the `cubic-bézier` CardTitle: `backRect.left > titleRect.right`
 *      AND the back button shares a common header-row ancestor with the title (it
 *      is a header sibling, NOT an external pre-card button positioned ABOVE the
 *      Card). BITE: RED today (the back affordance is a standalone top-LEFT
 *      `<Button>` ABOVE the card — its `.left` is to the LEFT of the title and it
 *      is not a header sibling); GREEN once it is baked header-right.
 *
 * NON-VACUITY: the bezier detail panel must be actually OPEN (the host present with
 * real area AND the EasingCurveCanvas mounted) — driven by a REAL click on the live
 * `.easing-edit-btn` pencil (which converts the default named easing to cubic-bézier
 * and clears detailPanelDismissed), the same trusted-input idiom proof:dock-popover-
 * opens uses; a panel that never opened fails LOUD, never green-vacuous.
 *
 * Settle-gated on the H.W1 FSM resting (the lib's navToScene #/cube hash pin +
 * pane-open + viewport-re-assert plumbing the H.W3/W4 gates use; page.goto clears
 * storage + the H.W1 reconcile trap). Harness: the scripts/lib/demo-driver.mjs
 * lifecycle (withPage = serveDist + resolveChromium + context/teardown, J.W3 S1) +
 * navToScene. Browser-only (a scroll/overflow is a rendered fact — there is no
 * static half); under KF_REQUIRE_BROWSER a playwright-absent skip becomes a hard
 * fail AT THE LIB SEAM so the panel-fit is never green-reported un-exercised.
 * Re-runnable:
 * `node scripts/proof-bezier-no-scroll.mjs`. Serves the BUILT dist/gh-pages/
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

console.log("proof:bezier-no-scroll — H.W9 F2 (the bezier-panel fit + header-bake lock)");

const CTRL_KEY = "animation-groups-control-options-store";

/** Settle on #/cube via the lib's in-page hash nav (storage + the H.W1 trap
 *  survive; goto would clear both). Re-assert the test viewport AFTER navigation
 *  (Playwright resets on navigate) + force the controls pane OPEN + rest ≥500ms,
 *  the same FSM-resting settle the H.W3/W4 gates use. */
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
    await page.waitForTimeout(600); // route rested ≥500ms + panel mount
}

/** Open the cubic-bézier detail panel via a REAL click on the live easing-edit
 *  pencil (.easing-edit-btn — onEditIconClick → converts the default named easing
 *  to cubic-bézier and clears detailPanelDismissed → showDetailPanel becomes true).
 *  The detailPanelDismissed ref is component-internal (no localStorage backing), so
 *  a trusted click is the correct driver — the same trusted-input idiom
 *  proof:dock-popover-opens uses. Returns true once the detail panel host + the
 *  EasingCurveCanvas are live. */
async function openBezierPanel(page) {
    // Wait for the easing-edit pencil to be present + visible before querying it.
    // page.$() is a snapshot (no auto-wait); on a slow CI runner the 600 ms settle
    // in settleOnCube may not be enough for the controls panel to fully mount, so
    // we poll until the element is actionable (up to 5 s) before handing off to click.
    const pencilLoc = page.locator(".easing-edit-btn").first();
    await pencilLoc.waitFor({ state: "visible", timeout: 5000 }).catch(() => {});
    const pencil = await page.$(".easing-edit-btn");
    if (!pencil) return false;
    try {
        await pencil.click({ timeout: 2000, force: true });
    } catch {
        return false;
    }
    await pencil.dispose?.();
    // Wait for the detail row to go active + the bezier Card + canvas to mount AND
    // for the grid-template-rows 0fr→1fr row-expand transition to SETTLE. The row
    // animates open, so a too-early measure catches a transient collapsed host
    // (clientHeight ≈ 4px = just the .panel-content 2px padding, while scrollHeight
    // already reads the full content → a false overflow). The settle predicate
    // waits for the host's clientHeight to STOP CHANGING across consecutive samples
    // (the animated row height has stabilized) — this works whether the final state
    // FITS (clientHeight settles to the content height) or OVERFLOWS (clientHeight
    // settles AT the max-height cap), so the born-RED overflow case still measures
    // a real, stable, capped host rather than being masked as "never opened". */
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
                // Stabilization latch on the element (survives across polls).
                const prev = host.__bezierPrevCH;
                const now = host.clientHeight;
                host.__bezierPrevCH = now;
                // The collapsed transient (≤ ~6px) must not satisfy: require a
                // non-trivial height AND two equal consecutive samples (stable).
                return now > 40 && prev != null && Math.abs(now - prev) <= 1;
            },
            { timeout: 8000, polling: 200 },
        )
        .then(() => true)
        .catch(() => false);
    // Let any final canvas reflow settle before measuring.
    await page.waitForTimeout(400);
    return settled;
}

async function browserHalf() {
    // Measure at 1280×720 AND 1440×900. The shorter 720 viewport is the harsher
    // case for the 50vh cap (min(50vh,480px) = 360px at 720 → the born-RED scroll
    // engaged there first); 1440×900 is the canonical desktop anchor.
    const VIEWPORTS = [
        { w: 1280, h: 720 },
        { w: 1440, h: 900 },
    ];
    const TOL = 1; // sub-pixel rounding tolerance
    const result = await withPage(
        { distDir: DIST, label: "the bezier-panel fit + header-bake clauses" },
        async (_page, { url, browser }) => {
        for (const { w: VW, h: VH } of VIEWPORTS) {
            const page = await browser.newPage({ viewport: { width: VW, height: VH } });
            await page.goto(`${url}/#/cube`, { waitUntil: "load" });
            await settleOnCube(page, VW, VH);
            const opened = await openBezierPanel(page);

            const label = `${VW}×${VH}`;
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
                    `${label} — the cubic-bézier detail panel never opened ` +
                        `(pencil:${dbg.hasPencil}, host:${dbg.hasHost}, canvas:${dbg.hasCanvas}, ` +
                        `paneOpen:${dbg.paneOpen}, hash:${dbg.hash}). The FSM may not have rested, ` +
                        `the pane / easing-edit pencil did not mount, or detailPanelDismissed never cleared.`,
                );
                await page.close();
                continue;
            }

            const probe = await page.evaluate(() => {
                const host = document.querySelector(
                    ".panel-row--detail.panel-row--active > .panel-content",
                );
                const hostCS = getComputedStyle(host);
                // The back/close control + the CardTitle inside the bezier panel.
                const back = document.querySelector('[aria-label="back to controls"]');
                // The bezier CardTitle is the "cubic-bézier" title in the open panel.
                const titles = [...host.querySelectorAll(".text-title, [class*='card-title'], h3, h4")];
                const title =
                    titles.find((t) => /cubic/i.test(t.textContent || "")) || titles[0] || null;
                const backR = back ? back.getBoundingClientRect() : null;
                const titleR = title ? title.getBoundingClientRect() : null;
                // The shared header-row ancestor: the back button must live INSIDE
                // the bezier Card's header row (a justify-between flex), NOT be an
                // external pre-card sibling. Walk up from the back button and the
                // title; they must share a near ancestor that is INSIDE the panel host.
                let sharedInHost = false;
                let backRowIsFlexBetween = false;
                if (back && title && host.contains(back) && host.contains(title)) {
                    // Common ancestor: the back button's parent (the header flex row)
                    // should also contain the title (title LEFT, back RIGHT).
                    const headerRow = back.parentElement;
                    if (headerRow && headerRow.contains(title)) {
                        sharedInHost = true;
                        const rowCS = getComputedStyle(headerRow);
                        backRowIsFlexBetween =
                            rowCS.display === "flex" &&
                            (rowCS.justifyContent === "space-between" ||
                                rowCS.justifyContent === "justify");
                    }
                }
                return {
                    scrollHeight: host.scrollHeight,
                    clientHeight: host.clientHeight,
                    overflowY: hostCS.overflowY,
                    hasBack: !!back,
                    hasTitle: !!title,
                    backInHost: back ? host.contains(back) : false,
                    backLeft: backR ? backR.left : null,
                    titleRight: titleR ? titleR.right : null,
                    sharedInHost,
                    backRowIsFlexBetween,
                };
            });

            // ── 1. NO VERTICAL OVERFLOW ─────────────────────────────────────────
            const fits = probe.scrollHeight <= probe.clientHeight + TOL;
            const notPermanentScroll = probe.overflowY !== "scroll";
            if (fits && notPermanentScroll) {
                ok(
                    `${label} no-scroll: the detail host fits ` +
                        `(scrollHeight ${Math.round(probe.scrollHeight)} ≤ clientHeight ` +
                        `${Math.round(probe.clientHeight)}) and overflow-y is ` +
                        `'${probe.overflowY}' (≠ 'scroll' — the cap never engages a scrollbar)`,
                );
            } else if (!fits) {
                fail(
                    `${label} no-scroll — the detail host OVERFLOWS ` +
                        `(scrollHeight ${Math.round(probe.scrollHeight)} > clientHeight ` +
                        `${Math.round(probe.clientHeight)}); the bezier stack exceeds the ` +
                        `min(50vh,480px) cap → a scrollbar (born-RED). F2's tighter canvas + ` +
                        `header-bake must make it fit.`,
                );
            } else {
                fail(
                    `${label} no-scroll — the detail host resolves overflow-y: 'scroll' ` +
                        `(a permanent scrollbar is forbidden; only 'auto'/'visible'/'hidden' ` +
                        `with content that fits is allowed)`,
                );
            }

            // ── 2. HEADER-RIGHT BAKE ────────────────────────────────────────────
            if (!probe.hasBack || !probe.hasTitle) {
                fail(
                    `${label} header-bake — the back control ` +
                        `([aria-label="back to controls"]: ${probe.hasBack}) or the ` +
                        `cubic-bézier CardTitle (${probe.hasTitle}) was not found in the open panel`,
                );
            } else if (!probe.backInHost) {
                fail(
                    `${label} header-bake — the back control is NOT inside the bezier panel ` +
                        `host (it is an EXTERNAL pre-card button, the born-RED top-LEFT placement); ` +
                        `it must be baked into the CardHeader row`,
                );
            } else if (!(probe.backLeft > probe.titleRight + TOL)) {
                fail(
                    `${label} header-bake — the back control is NOT to the RIGHT of the ` +
                        `cubic-bézier title (backLeft ${Math.round(probe.backLeft)} ≤ titleRight ` +
                        `${Math.round(probe.titleRight)}); born-RED on the external top-LEFT button. ` +
                        `Title LEFT, dismiss RIGHT is the idiomatic detail-panel header.`,
                );
            } else if (!probe.sharedInHost) {
                fail(
                    `${label} header-bake — the back control does not share a header-row ` +
                        `ancestor with the title (it is not a header sibling — the external ` +
                        `top-LEFT button defect)`,
                );
            } else {
                ok(
                    `${label} header-bake: the back control is baked into the CardHeader ` +
                        `RIGHT of the cubic-bézier title (backLeft ${Math.round(probe.backLeft)} > ` +
                        `titleRight ${Math.round(probe.titleRight)}, shared header row` +
                        `${probe.backRowIsFlexBetween ? " · flex justify-between" : ""})`,
                );
            }

            await page.close();
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
        `\nproof:bezier-no-scroll — FAIL (${failures.length}): the cubic-bézier detail ` +
            `panel scrolls and/or the back control is not baked header-right (H.W9 F2).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:bezier-no-scroll — PASS: the cubic-bézier detail panel FITS (no vertical " +
        "overflow, no permanent scrollbar) and the back control is baked into the CardHeader " +
        "RIGHT of the title (H.W9 F2).",
);
