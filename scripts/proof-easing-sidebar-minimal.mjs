#!/usr/bin/env node
/**
 * proof:easing-sidebar-minimal — H.W12 J (S7) the MINIMAL controls-like easing
 * sidebar lock (round-4 feedback, j-easing-minimalism.md; born-RED on the post-W11
 * `EasingSidebar.vue` — the `<LabeledInput label="value">` + the `<h2>` title +
 * the short duration track).
 *
 * THE DEFECT (post-W11, the user's round-4 screenshot). The W11-normalized easing
 * sidebar still carried REDUNDANT CHROME that stole the bezier's space: a "value"
 * CSS-value TEXT INPUT (`<LabeledInput label="value">`, `EasingSidebar.vue:41-48`)
 * duplicating the `<EasingSelect>` dropdown's job; its "value" LABEL; a trailing
 * inline `<CopyButton>` serving that input; an `<h2 class="text-title">` SCENE
 * TITLE (`:24`) the standard controls do not carry; a SHORT duration track; and
 * the bezier visualizer smaller than it could be.
 *
 * THE FIX (J1–J6). The `<EasingSelect>` dropdown IS the sole easing selector; the
 * curve IS the subject. STRIP: the value text input + its label + the trailing
 * CopyButton (J1+J2), the `<h2>` title (J5). GROW: the duration control to
 * FULL-WIDTH (J3), the `<EasingCurveCanvas>` TALLER (J6, reclaiming the J1/J5
 * space). KEEP: ONE flat container (J4 — no double wrapper).
 *
 * Falsifiable clauses, each BITING on the exact round-4 defect. The STRIP +
 * single-container facts are STATIC (source-grep — the deletions are source facts,
 * cheap + playwright-independent); the FULL-WIDTH duration + the GREW-TALLER canvas
 * + the FITS-WITHOUT-SCROLL are BROWSER-measured (rendered facts). Settle-gated on
 * the H.W1 FSM resting (mirrors proof:easing-sidebar-normalized).
 *
 *   STATIC (source — the J1/J2/J5/J4 deletions):
 *     S1 (J1) — NO `<LabeledInput label="value">` CSS-value text input in
 *        EasingSidebar.vue (the dropdown is the sole selector). The remaining
 *        `LabeledInput` is the STEPS field (`type="number" label="steps"`), shown
 *        only for the steps curve — a different control, NOT the value text input.
 *     S2 (J2) — NO `label="value"` in EasingSidebar.vue (the value label is gone).
 *     S3 (J5) — NO `<h2 …>` scene title in EasingSidebar.vue.
 *     S4 (J1) — NO `css-value-input` / `value-field` dead anchors survive (the
 *        scoped :deep(.css-value-input) rule + the markup anchor DIE with J1).
 *
 *   BROWSER (rendered — the J3/J6/J4 facts, settle-gated on the FSM):
 *     B1 (J5+J1+J2) — the LIVE sidebar has ZERO `<h2>` + ZERO CSS-value text
 *        `<input>` + ZERO "value"-labeled `.labeled-field` (the strip is rendered,
 *        not just sourced — a born-RED suppression-by-CSS would still render them).
 *     B2 (J1) — the `<EasingSelect>` dropdown IS present (the SOLE selector — the
 *        strip did not also drop the dropdown; non-vacuity).
 *     B3 (J3) — the `duration` control resolves a FULL-WIDTH track: its rendered
 *        track width ≈ the `CardContent` inner width (within ±8px). BITE: the short
 *        2-track `[label] [value]` row (the born-RED) leaves the track << inner width.
 *     B4 (J4) — ONE container: exactly 1 glass-ui Card-root
 *        (`.rounded-card.text-card-foreground`) in the sidebar (no nested wrapper).
 *     B5 (J6) — the `<EasingCurveCanvas>` block-size GREW above the W11 in-sidebar
 *        size (the canvas's own default `clamp(160px, 38cqi, 280px)` FLOOR = 160px,
 *        which W11 did NOT override — the rail rendered ~160px). The J6 grow raises
 *        the floor to 260px; the rendered block-size must exceed the 160px W11
 *        baseline with margin (> 200px). BITE: the un-grown 160px reds.
 *     B6 (J6) — the grown canvas STILL FITS: the sidebar pane's
 *        `scrollHeight ≤ clientHeight + TOL` AND `overflow-y !== 'scroll'` (the grow
 *        reclaimed the J1/J5 space WITHOUT introducing scroll).
 *
 * Under KF_REQUIRE_BROWSER a playwright-absent skip becomes a hard fail so a SHIP is
 * never green-reported with the browser half un-exercised (the static half still
 * runs + bites). Re-runnable: `node scripts/proof-easing-sidebar-minimal.mjs`.
 * Serves the BUILT dist/gh-pages/ (run `npm run gh-pages` first).
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
const SIDEBAR_SRC = path.join(REPO, "demo/easing/EasingSidebar.vue");

// The W11 in-sidebar canvas baseline the J6 grow must EXCEED. W11 did NOT override
// the canvas's own default `block-size: clamp(160px, 38cqi, 280px)` in the sidebar,
// so the rail rendered at the 160px floor (easing-eggs lane note §1). The J6 grow
// raises the floor to 260px; the rendered block-size must clear the 160px baseline
// with margin so a SUPPRESSED-but-measured 160 fails.
const W11_INSIDEBAR_CANVAS = 160;
const GROW_MIN = 200; // > the 160 W11 floor with clear separation (landed: 260px)

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:easing-sidebar-minimal — H.W12 J (the easing sidebar is MINIMAL, controls-like · no value input/label · no <h2> · full-width duration · grown canvas)",
);

// ── STATIC HALF (the J1/J2/J5/J4 deletions are source facts) ───────────────────
// Comment-blank so the J-narration comments (which QUOTE the deleted chrome) do not
// false-positive — only LIVE template/markup counts.
const blankComments = (s) =>
    s
        .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
        .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length))
        .replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "));

try {
    const raw = fs.readFileSync(SIDEBAR_SRC, "utf8");
    const src = blankComments(raw);

    // S1 (J1) — no value text input. A `<LabeledInput … label="value" …>` (in any
    // attribute order). The steps `LabeledInput type="number" label="steps"` is a
    // DIFFERENT control — only a `label="value"` LabeledInput is the born-RED.
    const valueInputRe =
        /<LabeledInput\b[^>]*\blabel\s*=\s*"value"|<LabeledInput\b[^>]*\bcss-value-input\b/;
    if (valueInputRe.test(src)) {
        fail(
            'static S1 (J1) — EasingSidebar.vue still renders the `<LabeledInput label="value">` ' +
                "CSS-value text input; J1 DELETES it (the <EasingSelect> dropdown is the sole selector).",
        );
    } else {
        ok("static S1 (J1): no `<LabeledInput label=\"value\">` CSS-value text input (the dropdown is sole)");
    }

    // S2 (J2) — no `label="value"` anywhere (the value label is gone).
    if (/\blabel\s*=\s*"value"/.test(src)) {
        fail('static S2 (J2) — EasingSidebar.vue still carries a `label="value"`; J2 DELETES the value label.');
    } else {
        ok('static S2 (J2): no `label="value"` (the value label is gone)');
    }

    // S3 (J5) — no `<h2>` scene title.
    if (/<h2\b/.test(src)) {
        fail(
            "static S3 (J5) — EasingSidebar.vue still renders an `<h2>` scene title; J5 DELETES it " +
                "(controls carry no big per-scene title — the dropdown names the curve).",
        );
    } else {
        ok("static S3 (J5): no `<h2>` scene title (controls-like, no per-scene title)");
    }

    // S4 (J1) — the dead css-value-input / value-field anchors are gone (the scoped
    // :deep(.css-value-input) rule + the `value-field` markup anchor DIE with J1).
    const deadAnchors = [];
    if (/css-value-input/.test(src)) deadAnchors.push("css-value-input");
    if (/\bvalue-field\b/.test(src)) deadAnchors.push("value-field");
    if (deadAnchors.length > 0) {
        fail(
            `static S4 (J1) — dead value-input anchor(s) survive in EasingSidebar.vue ` +
                `(${deadAnchors.join(", ")}); they DIE with the deleted text input (no legacy beside the replacement).`,
        );
    } else {
        ok("static S4 (J1): no css-value-input / value-field dead anchors (deleted with the input)");
    }
} catch (e) {
    fail(`static — could not read EasingSidebar.vue: ${e.message}`);
}

// ── BROWSER HALF (the J3/J6/J4 rendered facts, settle-gated on the FSM) ─────────
const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — ` +
                "the full-width-duration + grown-canvas + fits clauses cannot pass vacuously",
        );
    } else {
        console.log(`  ○ browser half skipped — ${reason}`);
    }
};

const MIME = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".ttf": "font/ttf",
    ".woff2": "font/woff2",
    ".svg": "image/svg+xml",
};
const MACHINE_KEY = "keyframes-js-scene-machine"; // SCENE_MACHINE_PERSIST_KEY
const CTRL_KEY = "animation-groups-control-options-store";

function serveDist() {
    const server = http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
            res.writeHead(404).end();
            return;
        }
        res.writeHead(200, {
            "content-type": MIME[path.extname(p)] ?? "application/octet-stream",
        });
        fs.createReadStream(p).pipe(res);
    });
    return server;
}

/** Settle on #/easing via an IN-PAGE hash assignment (storage + the H.W1 trap
 *  survive; page.goto clears both). Re-assert the viewport AFTER navigation. Force
 *  the controls pane OPEN + the easing tab selected so the FULL-RAIL sidebar mounts.
 *  Mirrors proof-easing-sidebar-normalized.mjs settleOnScene. */
async function settleOnEasing(page, viewportWidth, viewportHeight) {
    await page.evaluate(() => {
        location.hash = "#/easing";
    });
    await page
        .waitForFunction(
            (mk) => {
                try {
                    return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === "easing";
                } catch {
                    return false;
                }
            },
            MACHINE_KEY,
            { timeout: 8000 },
        )
        .catch(() => {});
    await page.setViewportSize({ width: viewportWidth, height: viewportHeight });
    await page.evaluate(
        (ck) => {
            try {
                const st = JSON.parse(localStorage.getItem(ck) || "{}");
                st.isControlsPanelOpen = true;
                st.selectedControl = "easing";
                localStorage.setItem(ck, JSON.stringify(st));
            } catch {
                /* fall through to the class toggle */
            }
            const el = document.querySelector(".controls-layout");
            if (el) {
                el.classList.add("controls-layout--open");
                el.classList.remove("controls-layout--closed");
            }
        },
        CTRL_KEY,
    );
    await page.waitForTimeout(700);
}

/** Wait until the FULL-RAIL easing sidebar PAINTS (content in the active controls
 *  tabpanel) — NOT until it is minimal. Each clause then bites on the SPECIFIC fact;
 *  requiring "minimal" here would conflate "not mounted" with "born-RED". */
async function waitSidebarMounted(page) {
    return page
        .waitForFunction(
            () => {
                const panel = document.querySelector('[role="tabpanel"][data-state="active"]');
                if (!panel) return false;
                const root = panel.firstElementChild;
                if (!root) return false;
                const r = root.getBoundingClientRect();
                // Also wait for the hero canvas to paint (the grow measurement needs it).
                const canvas = panel.querySelector(".easing-curve-canvas");
                const cr = canvas ? canvas.getBoundingClientRect() : null;
                return r.width > 0 && r.height > 0 && !!cr && cr.height > 0;
            },
            { timeout: 8000 },
        )
        .then(() => true)
        .catch(() => false);
}

/** Probe the active easing-sidebar tabpanel for the J facts. */
async function probeSidebar(page) {
    return page.evaluate(() => {
        const panel = document.querySelector('[role="tabpanel"][data-state="active"]');
        if (!panel) return { found: false };

        // B1 — strip: no <h2>, no CSS-value text input, no "value"-labelled row.
        const h2 = panel.querySelectorAll("h2").length;
        // A CSS-value text input is a type=text/no-type <input>. The steps control
        // is type=number — excluded. Count text-ish inputs (the born-RED value field).
        const textInputs = Array.from(panel.querySelectorAll("input")).filter((i) => {
            const t = (i.getAttribute("type") || "text").toLowerCase();
            return t === "text" || t === "search" || t === "";
        }).length;
        // A "value"-labelled labeled-field row (the born-RED value row).
        const valueLabeledRows = Array.from(panel.querySelectorAll(".labeled-field")).filter(
            (r) => /\bvalue\b/i.test((r.querySelector("label")?.textContent || "").trim()),
        ).length;

        // B2 — the EasingSelect dropdown IS present (the sole selector). The
        // EasingSelect renders a reka-ui Select trigger (role=combobox) OR a button
        // carrying the curve name; detect a combobox/select trigger in the panel.
        const dropdown =
            panel.querySelector('[role="combobox"]') ||
            panel.querySelector('[data-slot="select-trigger"]') ||
            panel.querySelector("button[aria-haspopup='listbox']");
        const hasDropdown = !!dropdown;

        // B4 — ONE container: exactly 1 glass-ui Card-root signature.
        const cardCount = panel.querySelectorAll(".rounded-card.text-card-foreground").length;

        // B3 — full-width duration. The CardContent inner width (the flat container)
        // vs the duration row's slider track width.
        const cardContent =
            panel.querySelector(".rounded-card.text-card-foreground .panel-content") ||
            panel.querySelector(".panel-content") ||
            panel.querySelector(".rounded-card.text-card-foreground");
        let cardInnerWidth = null;
        if (cardContent) {
            const cs = getComputedStyle(cardContent);
            cardInnerWidth =
                cardContent.clientWidth -
                parseFloat(cs.paddingLeft || "0") -
                parseFloat(cs.paddingRight || "0");
        }
        // The duration row → its slider track. The .duration-field modifier marks it.
        const durRow =
            panel.querySelector(".labeled-field.duration-field") ||
            Array.from(panel.querySelectorAll(".labeled-field")).find((r) =>
                /\bduration\b/i.test((r.querySelector("label")?.textContent || "").trim()),
            );
        let durTrackWidth = null;
        if (durRow) {
            const track = durRow.querySelector(".slider-track") || durRow.querySelector('[data-slot="slider"]');
            if (track) durTrackWidth = track.getBoundingClientRect().width;
        }

        // B5 — the canvas grew. Resolved block-size of the hero canvas.
        const canvas = panel.querySelector(".easing-curve-canvas");
        const canvasBlock = canvas ? parseFloat(getComputedStyle(canvas).blockSize) : null;

        // B6 — fits without scroll. The sidebar pane host (the scrollable rail).
        const pane =
            panel.closest(".controls-pane") ||
            panel.parentElement ||
            panel;
        const paneCS = pane ? getComputedStyle(pane) : null;

        return {
            found: true,
            h2,
            textInputs,
            valueLabeledRows,
            hasDropdown,
            cardCount,
            cardInnerWidth,
            durTrackWidth,
            canvasBlock,
            paneScrollH: pane ? pane.scrollHeight : null,
            paneClientH: pane ? pane.clientHeight : null,
            paneOverflowY: paneCS ? paneCS.overflowY : null,
        };
    });
}

async function browserHalf() {
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        skipOrFail("dist/gh-pages not built (run `npm run gh-pages` first)");
        return;
    }
    let chromium;
    try {
        const requireFrom = createRequire(
            path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
        );
        ({ chromium } = requireFrom("playwright-core"));
    } catch {
        try {
            const requireFrom = createRequire(
                path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
            );
            ({ chromium } = requireFrom("@playwright/test"));
        } catch {
            skipOrFail("playwright not resolvable (set KF_PLAYWRIGHT_DIR or install @playwright/test)");
            return;
        }
    }

    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;

    const W = 1440;
    const H = 900;
    const FULLWIDTH_TOL = 8; // the J3 "≈ CardContent inner width" allowance
    const FIT_TOL = 1;
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage({ viewport: { width: W, height: H } });
        await page.goto(`${base}/#/easing`, { waitUntil: "load" });
        await settleOnEasing(page, W, H);
        const mounted = await waitSidebarMounted(page);

        if (!mounted) {
            const dbg = await page.evaluate(() => {
                const panel = document.querySelector('[role="tabpanel"][data-state="active"]');
                return {
                    hasPanel: !!panel,
                    hasCard: !!panel?.querySelector(".rounded-card"),
                    hasCanvas: !!panel?.querySelector(".easing-curve-canvas"),
                    hash: location.hash,
                };
            });
            fail(
                `browser — the easing sidebar never mounted (tabpanel:${dbg.hasPanel}, ` +
                    `.rounded-card:${dbg.hasCard}, .easing-curve-canvas:${dbg.hasCanvas}, hash:${dbg.hash}) — ` +
                    "the FSM may not have rested on easing or the pane/tab did not open. The J clauses cannot " +
                    "measure a sidebar that never painted (a vacuous pass is forbidden).",
            );
            await page.close();
            return;
        }

        const p = await probeSidebar(page);

        // B1 — the strip is RENDERED.
        if (p.h2 === 0 && p.textInputs === 0 && p.valueLabeledRows === 0) {
            ok(
                `B1 (J5+J1+J2) strip rendered: 0 <h2> + 0 CSS-value text <input> + 0 "value"-labelled row ` +
                    `in the live sidebar`,
            );
        } else {
            fail(
                `B1 (J5+J1+J2) — the live sidebar still renders redundant chrome ` +
                    `(<h2>:${p.h2}, CSS-value text input:${p.textInputs}, "value" row:${p.valueLabeledRows}; ` +
                    `want all 0) — the strip is not rendered (born-RED, J1/J2/J5).`,
            );
        }

        // B2 — the dropdown IS present (non-vacuity: the strip kept the selector).
        if (p.hasDropdown) {
            ok("B2 (J1) the <EasingSelect> dropdown IS the sole selector (present in the live sidebar)");
        } else {
            fail(
                "B2 (J1) — the <EasingSelect> dropdown is NOT present in the live sidebar; the strip must " +
                    "KEEP the dropdown (it is the sole easing selector) — a sidebar with neither input nor " +
                    "dropdown has no selector (the strip went too far).",
            );
        }

        // B4 — ONE container.
        if (p.cardCount === 1) {
            ok("B4 (J4) ONE container: exactly 1 glass-ui Card-root (no nested double wrapper)");
        } else {
            fail(
                `B4 (J4) — the sidebar has ${p.cardCount} glass-ui Card-root(s) (want exactly 1 — one flat ` +
                    `CardContent, no double container).`,
            );
        }

        // B3 — full-width duration track.
        if (p.cardInnerWidth == null || p.durTrackWidth == null) {
            fail(
                `B3 (J3) — could not measure the duration track vs CardContent inner width ` +
                    `(cardInner:${p.cardInnerWidth}, durTrack:${p.durTrackWidth}) — the full-width clause cannot be verified.`,
            );
        } else if (p.durTrackWidth >= p.cardInnerWidth - FULLWIDTH_TOL) {
            ok(
                `B3 (J3) duration FULL-WIDTH: track ${Math.round(p.durTrackWidth)}px ≈ CardContent inner ` +
                    `${Math.round(p.cardInnerWidth)}px (within ${FULLWIDTH_TOL}px — the slider spans the card)`,
            );
        } else {
            fail(
                `B3 (J3) — the duration track is ${Math.round(p.durTrackWidth)}px, the CardContent inner is ` +
                    `${Math.round(p.cardInnerWidth)}px (gap ${Math.round(p.cardInnerWidth - p.durTrackWidth)}px > ` +
                    `${FULLWIDTH_TOL}px) — the duration is NOT full-width (the born-RED short 2-track row).`,
            );
        }

        // B5 — the canvas grew above the W11 in-sidebar baseline.
        if (p.canvasBlock == null) {
            fail("B5 (J6) — the .easing-curve-canvas was not found after mount (cannot measure the grow).");
        } else if (p.canvasBlock >= GROW_MIN) {
            ok(
                `B5 (J6) canvas GREW: block-size ${Math.round(p.canvasBlock)}px > the W11 in-sidebar ` +
                    `~${W11_INSIDEBAR_CANVAS}px baseline (≥ ${GROW_MIN}px floor; reclaiming the J1/J5 space)`,
            );
        } else {
            fail(
                `B5 (J6) — the canvas block-size ${Math.round(p.canvasBlock)}px is NOT above the W11 ` +
                    `in-sidebar ~${W11_INSIDEBAR_CANVAS}px baseline (want ≥ ${GROW_MIN}px) — the bezier did not ` +
                    `grow into the reclaimed space (born-RED on the un-grown 160px default).`,
            );
        }

        // B6 — the grown canvas still fits (no scroll).
        const fits = p.paneScrollH != null && p.paneScrollH <= p.paneClientH + FIT_TOL;
        const notPermanentScroll = p.paneOverflowY !== "scroll";
        if (fits && notPermanentScroll) {
            ok(
                `B6 (J6) still fits: pane scrollHeight ${Math.round(p.paneScrollH)} ≤ clientHeight ` +
                    `${Math.round(p.paneClientH)}, overflow-y '${p.paneOverflowY}' (≠ scroll) — the grow reclaimed ` +
                    `space WITHOUT introducing scroll`,
            );
        } else if (!fits) {
            fail(
                `B6 (J6) — the grown sidebar OVERFLOWS (pane scrollHeight ${Math.round(p.paneScrollH)} > ` +
                    `clientHeight ${Math.round(p.paneClientH)}) — the canvas grow must still fit without scroll.`,
            );
        } else {
            fail(
                `B6 (J6) — the sidebar pane resolves overflow-y: 'scroll' (a permanent scrollbar is forbidden; ` +
                    `the grown canvas must still fit).`,
            );
        }

        await page.close();
    } finally {
        await browser.close();
        server.close();
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:easing-sidebar-minimal — FAIL (${failures.length}): the easing sidebar is NOT minimal ` +
            `(the value input / "value" label / <h2> title survive, the duration is not full-width, the canvas ` +
            `did not grow, or the grow introduced scroll — H.W12 J / j-easing-minimalism.md).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:easing-sidebar-minimal — PASS: the easing sidebar is MINIMAL, controls-like — zero CSS-value " +
        "text input + zero \"value\" label + zero <h2> title; the <EasingSelect> dropdown is the sole selector; " +
        "the duration runs full-width; ONE container; the bezier canvas grew above the W11 in-sidebar size and " +
        "still fits without scroll (H.W12 J).",
);
