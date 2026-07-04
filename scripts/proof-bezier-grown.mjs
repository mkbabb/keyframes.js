#!/usr/bin/env node
/**
 * proof:bezier-grown — H.W11 I7 (S6) the bezier-canvas GROW + "editing:" subtitle
 * removal lock (REFINES W9 F2; born-RED on the 220px cap + the subtitle).
 *
 * The defect (live, desktop, the cubic-bézier detail panel): W9 F2 TIGHTENED the
 * in-panel canvas ceiling to `block-size: clamp(160px, 38cqi, 220px); max-block-size:
 * 220px` (`TimingFunctionPanel.vue:251-252`) to fit-without-scroll, which made the
 * editor SMALL; and a redundant "editing: {{ editingCurveName }}" subtitle sat at
 * `TimingFunctionPanel.vue:33`. The user wants the bezier controls as BIG/TALL as
 * possible within the container, and the "editing:" subtitle removed. I7 (S6) — which
 * composes with I6's inner-card removal (S5) freeing vertical space — RAISES the
 * in-panel canvas ceiling above the W9 220px (the grown clamp
 * `clamp(232px, 78cqi, 300px); max-block-size: min(300px, 46vh)`, the square LAW
 * preserved — `aspect-ratio:1` from EasingCurveCanvas) AND DELETES the "editing:"
 * subtitle. The grown canvas MUST still fit without re-introducing scroll (the W9
 * fit-without-scroll invariant holds).
 *
 * Three falsifiable BROWSER clauses, each BITING on the exact W9 defect (born-RED on
 * `tranche-h-impl` HEAD, GREEN on the I7 grow + subtitle removal):
 *
 *   1. THE CANVAS GREW. The in-panel `.easing-curve-canvas` resolved `block-size`
 *      is GREATER than the W9 220px ceiling (the panel grew). BITE: RED today (the
 *      canvas is capped at 220px — `block-size: clamp(160px, 38cqi, 220px);
 *      max-block-size: 220px`); GREEN once the ceiling rises (≈232px at 1440 — the
 *      `78cqi`/232 floor over the 220 W9 cap).
 *
 *   2. NO "editing:" SUBTITLE. No text node containing "editing:" exists anywhere in
 *      the open detail panel host. BITE: RED today (the "editing: {{ editingCurveName
 *      }}" `<p>` at `:33` renders); GREEN once the subtitle is DELETED (not
 *      `display:none`-suppressed — the subtree is removed, so no "editing:" text node
 *      exists at all).
 *
 *   3. STILL FITS (the W9 invariant holds — composes with proof:bezier-no-scroll).
 *      The detail-panel host `.panel-row--detail.panel-row--active > .panel-content`
 *      resolves `scrollHeight ≤ clientHeight + TOL` (the grown canvas still fits — no
 *      scroll region) AND `overflow-y !== 'scroll'`. BITE: a grow that re-introduces
 *      scroll fails here (the grow must respect the fit-without-scroll constraint).
 *      Reuses the W9 proof:bezier-no-scroll measurement plumbing.
 *
 * NON-VACUITY: the bezier detail panel must be actually OPEN (the host present with
 * real area AND the .easing-curve-canvas mounted) — driven by a REAL click on the
 * live `.easing-edit-btn` pencil (the same trusted-input driver
 * proof:bezier-no-scroll uses); a panel that never opened fails LOUD, never
 * green-vacuous. The 220px threshold is a NUMERIC bite (a measured-but-suppressed
 * 220 would fail clause 1) — the canvas must REALLY exceed the W9 cap.
 *
 * Measured at 1280×720 AND 1440×900 (the same two anchors proof:bezier-no-scroll
 * uses — the shorter 720 viewport is the harsher case for the min(300px, 46vh) cap +
 * the no-scroll fit). Settle-gated on the H.W1 FSM resting (the lib's navToScene
 * #/cube hash pin + pane-open + viewport-re-assert + detail-row-settle plumbing).
 * Mirrors scripts/proof-bezier-no-scroll.mjs. Harness: the
 * scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist + resolveChromium +
 * context/teardown, J.W3 S1) + navToScene. Browser-only (the resolved block-size +
 * the scroll fit are rendered facts; the static "editing:"-deleted half is a source
 * grep folded below for belt-and-braces). Under KF_REQUIRE_BROWSER a
 * playwright-absent skip becomes a hard fail AT THE LIB SEAM. Re-runnable:
 * `node scripts/proof-bezier-grown.mjs`.
 * Serves the BUILT dist/gh-pages/ (run `npm run gh-pages` first).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
const PANEL_SRC = path.join(
    REPO,
    "demo/@/components/custom/animation-transport/controls/TimingFunctionPanel.vue",
);

const W9_CEILING = 220; // the W9 F2 cap the I7 grow must exceed

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log("proof:bezier-grown — H.W11 I7 (the bezier-canvas grow + 'editing:' subtitle removal)");

// ── STATIC HALF (belt-and-braces): the "editing:" subtitle is DELETED from source ──
// The browser half is authoritative (it measures the rendered fact), but a cheap
// source grep catches a regression that re-adds the subtitle even if the browser
// half is skipped (no playwright). BITES on the `:33` `editing: {{ editingCurveName
// }}` `<p>` — born-RED on HEAD, green once the line is removed.
try {
    const src = fs.readFileSync(PANEL_SRC, "utf8");
    // Match the TEMPLATE subtitle interpolation `editing: {{ … }}`, not the
    // narration comment (which references "editing:" inside a quoted JS comment).
    // The defect line is `>editing: {{ editingCurveName }}<` — an `editing:` text
    // node immediately followed by a `{{` mustache. The W11 comment that NARRATES
    // the deletion quotes it as `"editing: …"` (a doubly-quoted phrase, NOT a
    // mustache), so this pattern does not false-positive on the narration.
    const subtitleRe = /editing:\s*\{\{/;
    if (subtitleRe.test(src)) {
        fail(
            "static — TimingFunctionPanel.vue still renders an `editing: {{ … }}` subtitle " +
                "(the redundant `:33` `<p>editing: {{ editingCurveName }}</p>`); I7 DELETES it " +
                "(the curve + the cubic-bezier readout already say what is being edited).",
        );
    } else {
        ok("static: no `editing: {{ … }}` subtitle interpolation in TimingFunctionPanel.vue (deleted)");
    }
} catch (e) {
    fail(`static — could not read TimingFunctionPanel.vue: ${e.message}`);
}

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
 *  pencil — the same trusted-input driver proof:bezier-no-scroll uses. */
async function openBezierPanel(page) {
    // Wait for the pencil button to be visible before querying it — the
    // controls-layout was just force-opened via DOM manipulation in
    // settleOnCube; on a slow CI runner the portal/subtree may not have
    // rendered within the fixed 600 ms settle, so we poll for up to 5 s.
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
    const VIEWPORTS = [
        { w: 1280, h: 720 },
        { w: 1440, h: 900 },
    ];
    const TOL = 1;
    const result = await withPage(
        { distDir: DIST, label: "the grow + no-subtitle + still-fits clauses" },
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
                        `paneOpen:${dbg.paneOpen}, hash:${dbg.hash}). The grow cannot be measured on a ` +
                        `panel that never opened — a vacuous pass is forbidden.`,
                );
                await page.close();
                continue;
            }

            const probe = await page.evaluate(() => {
                const canvas = document.querySelector(".easing-curve-canvas");
                const host = document.querySelector(
                    ".panel-row--detail.panel-row--active > .panel-content",
                );
                const ccs = canvas ? getComputedStyle(canvas) : null;
                const cr = canvas ? canvas.getBoundingClientRect() : null;
                const hostCS = host ? getComputedStyle(host) : null;
                return {
                    hasCanvas: !!canvas,
                    blockSize: ccs ? parseFloat(ccs.blockSize) : null,
                    renderedHeight: cr ? +cr.height.toFixed(1) : null,
                    // "editing:" text node anywhere in the open panel host.
                    editingText: host ? /editing:/i.test(host.textContent || "") : null,
                    scrollHeight: host ? host.scrollHeight : null,
                    clientHeight: host ? host.clientHeight : null,
                    overflowY: hostCS ? hostCS.overflowY : null,
                };
            });

            // 1. THE CANVAS GREW — block-size > the W9 220 cap.
            if (probe.blockSize == null) {
                fail(`${label} grow — the .easing-curve-canvas was not found after open`);
            } else if (probe.blockSize > W9_CEILING + TOL) {
                ok(
                    `${label} grew: the canvas resolved block-size ${Math.round(probe.blockSize)}px ` +
                        `> the W9 ${W9_CEILING}px ceiling (rendered ${probe.renderedHeight}px) — a REAL grow`,
                );
            } else {
                fail(
                    `${label} grow — the canvas resolved block-size ${Math.round(probe.blockSize)}px ` +
                        `≤ the W9 ${W9_CEILING}px ceiling; born-RED on the W9 cap ` +
                        `(\`clamp(160px, 38cqi, 220px); max-block-size: 220px\`). I7 must RAISE the ` +
                        `ceiling (\`clamp(232px, 78cqi, 300px)\`) so the canvas grows above 220.`,
                );
            }

            // 2. NO "editing:" SUBTITLE.
            if (probe.editingText === false) {
                ok(`${label} no-subtitle: no "editing:" text node in the open detail panel (deleted)`);
            } else {
                fail(
                    `${label} no-subtitle — the "editing:" subtitle text is PRESENT in the open ` +
                        `detail panel; born-RED on the \`:33\` \`<p>editing: {{ editingCurveName }}</p>\`. ` +
                        `I7 DELETES it (the curve + the cubic-bezier readout already say what is edited).`,
                );
            }

            // 3. STILL FITS (the W9 fit-without-scroll invariant holds).
            const fits = probe.scrollHeight != null && probe.scrollHeight <= probe.clientHeight + TOL;
            const notPermanentScroll = probe.overflowY !== "scroll";
            if (fits && notPermanentScroll) {
                ok(
                    `${label} still fits: scrollHeight ${Math.round(probe.scrollHeight)} ≤ clientHeight ` +
                        `${Math.round(probe.clientHeight)} and overflow-y '${probe.overflowY}' (≠ scroll) — ` +
                        `the grown canvas respects the W9 fit-without-scroll invariant`,
                );
            } else if (!fits) {
                fail(
                    `${label} still fits — the grown canvas OVERFLOWS (scrollHeight ` +
                        `${Math.round(probe.scrollHeight)} > clientHeight ${Math.round(probe.clientHeight)}); ` +
                        `the grow must respect the fit-without-scroll constraint (W9 proof:bezier-no-scroll).`,
                );
            } else {
                fail(
                    `${label} still fits — the detail host resolves overflow-y: 'scroll' ` +
                        `(a permanent scrollbar is forbidden; the grown canvas must still fit)`,
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
        `\nproof:bezier-grown — FAIL (${failures.length}): the bezier canvas did not grow above ` +
            `the W9 ${W9_CEILING}px ceiling, the "editing:" subtitle remains, or the grow ` +
            `re-introduced scroll (H.W11 I7).`,
    );
    process.exit(1);
}
console.log(
    `\nproof:bezier-grown — PASS: the in-panel bezier canvas grew above the W9 ${W9_CEILING}px ` +
        `ceiling, no "editing:" subtitle remains, and the grown canvas still fits without scroll ` +
        `(H.W11 I7; the W9 fit-without-scroll invariant holds).`,
);
