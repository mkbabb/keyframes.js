#!/usr/bin/env node
/**
 * proof:cartoon-shadow-unclipped — H.W9 F7 (S2) the cartoon-stamp clearance lock.
 *
 * The STRUCTURAL TENSION (live, #/cube desktop): the cartoon offset shadow casts
 * bottom-LEFT (--shadow-cartoon-md: -4px 3px; --shadow-cartoon-lg: -6px 4px on
 * hover/focus; + the --lift-sm -1px hover translate → ~8px left extent worst case),
 * but ControlsPaneWrapper's load-bearing `overflow:hidden` (desktop, the [rail]-track
 * collapse axis — KEEP it) clips anything outside the pane box. The risk: the
 * left-throwing shadow's bottom-LEFT lobe exits the pane box and is SLICED by the
 * clip edge (a straight sharp cut). The Card is overflow-visible but a child cannot
 * escape an ancestor's clip. F7 (S2) adds `padding-left:12px` to `.controls-content`
 * (KEEP the clip) so the panel Card is inset further from the clip edge and the
 * shadow renders INSIDE the pane box with generous clearance (reconcile, don't fork —
 * the crisp Memphis stamp is intended; the slice is the defect this protects against).
 *
 * MEASURE-FIRST FINDING (impl-w9-gate-f2f7, this lane): on the LANDED tree the active
 * panel Card already carries a pre-existing ~16px inner inset (the AnimationControls
 * filing-tab `pl-4 pr-7` wrapper) from the wrapper's clip edge, which alone exceeds
 * the ~8px worst-case shadow throw — so the shadow lobe already clears the clip even
 * with `padding-left:0`, and F7's `padding-left:12px` is a DEFENSIVE clearance that
 * widens that margin (16→28px), not the sole barrier. Geometrically, a `.controls-
 * content` padding-left change translates the Card AND a `.controls-content`-relative
 * reference IDENTICALLY, so no purely-geometric clause can born-RED on that toggle.
 * The clip edge that does NOT move with the padding is the wrapper's `overflow:hidden`
 * box edge (= the `.controls-pane` box left); the structurally-correct, faithful
 * assertion is the shadow lobe staying inside THAT. This gate is therefore a
 * STRUCTURAL-INVARIANT containment GUARD — like proof:stage-not-clipped (which also
 * ships GREEN on the landed tree and is the MEASURE-FIRST guard that lets the form
 * ship safely): it locks the shadow-inside-the-clip invariant the F7 clearance
 * establishes and BITES on any regression that pushes the lobe past the clip (a Card
 * shoved flush + a widened throw, the inner inset removed, the clip moved, or the
 * padding clearance dropped below the throw on a narrower rail). The §Hard-gate
 * "born-RED" framing assumed a flush Card; the live tree's pre-inset makes F7
 * defensive — the honest disposition is the containment guard, recorded here + in the
 * lane note (NOT a faked red).
 *
 * One falsifiable BROWSER clause (the structural containment invariant; mirrors
 * proof:stage-not-clipped's viewport-containment plumbing — F7 is a STRUCTURAL pixel
 * artifact, not a source grep):
 *
 *   SHADOW LEFT-LOBE INSIDE THE CLIP. The active panel Card (the `.controls-content
 *   [data-surface="cartoon"]` panel, hovered so the WORST-CASE --shadow-cartoon-lg +
 *   --lift-sm extent is in effect) — its rendered bounding-box left edge MINUS the
 *   shadow's |x| left extent (the shadow's leftmost pixel, parsed from the resolved
 *   `box-shadow` as the most-negative `offsetX − blur − spread` across all layers) is
 *   ≥ the `.controls-pane` box left edge (the wrapper's load-bearing overflow:hidden
 *   clip boundary, which the bottom-LEFT lobe must not cross), with a 1px sub-pixel
 *   tolerance. Also asserts F7's mechanism is present: `.controls-content` resolves a
 *   `padding-left ≥ 8px` (≥ the ~8px worst-case throw — the defensive clearance the
 *   fix adds; a regression that drops it reds).
 *
 *   BITE: reds if a regression pushes the shadow's leftmost pixel past the clip (the
 *   Card shoved flush against the pane edge + the throw widened; the inner inset
 *   removed; the clip boundary moved) OR if `.controls-content`'s F7 padding-left
 *   clearance is dropped below the worst-case throw. The MEASURE-FIRST disposition
 *   (above): on the landed tree the lobe clears the clip with margin (the guard is
 *   GREEN), exactly as proof:stage-not-clipped is GREEN on the landed [stage] form.
 *
 * NON-VACUITY: (a) the active panel Card must be found with REAL area; (b) the parsed
 * shadow left extent must be a real POSITIVE throw (the cartoon offset stamp genuinely
 * casts left — a 0/degenerate shadow would make the containment trivially true) so a
 * glass-ui shadow rename to a non-left-casting family fails LOUD; (c) the wrapper must
 * actually resolve a left-clipping `overflow` (hidden/clip) so the clip boundary is a
 * real one — a non-clipping wrapper (which could not slice anything) reds rather than
 * passing vacuously.
 *
 * Settle-gated on the H.W1 FSM resting (the same in-page #/cube hash pin + pane-open +
 * viewport-re-assert + named-grid-resolved plumbing the H.W3 gates use; page.goto
 * clears storage + the H.W1 reconcile trap). Mirrors scripts/proof-stage-not-clipped.mjs
 * (the serveDist + Playwright + settle + bbox-containment plumbing). Browser-only (a
 * clip is a rendered fact — there is no static half); under KF_REQUIRE_BROWSER a
 * playwright-absent skip becomes a hard fail so the clearance is never green-reported
 * un-exercised. Re-runnable: `node scripts/proof-cartoon-shadow-unclipped.mjs`. Serves
 * the BUILT dist/gh-pages/ (run `npm run gh-pages` first).
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log("proof:cartoon-shadow-unclipped — H.W9 F7 (the cartoon-stamp clearance lock)");

const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — ` +
                "the shadow-clearance assertion cannot pass vacuously",
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

/** Settle on #/cube via an in-page hash assignment (storage + the H.W1 trap
 *  survive; goto would clear both). Re-assert the test viewport AFTER navigation
 *  (Playwright resets on navigate) + force the controls pane OPEN + rest ≥500ms. */
async function settleOnCube(page, viewportWidth, viewportHeight) {
    await page.evaluate(() => {
        location.hash = "#/cube";
    });
    await page
        .waitForFunction(
            (mk) => {
                try {
                    return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === "cube";
                } catch {
                    return false;
                }
            },
            MACHINE_KEY,
            { timeout: 8000 },
        )
        .catch(() => {});
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

/** Wait until the desktop named grid is live (the [rail]·[stage] line names) so
 *  the pane is the fixed --rail-width column, not mid-bind — the same settle
 *  predicate the sibling W3 gates use. */
async function waitGridSettled(page) {
    await page
        .waitForFunction(
            () => {
                const el = document.querySelector(".controls-layout");
                if (!el) return false;
                const cols = getComputedStyle(el).gridTemplateColumns;
                return /\[rail\]/.test(cols) && /\[stage\]/.test(cols);
            },
            { timeout: 8000 },
        )
        .catch(() => {});
}

/** Parse a resolved `box-shadow` string into its layers' geometric LEFT extent.
 *  The browser serializes box-shadow as comma-separated layers, each
 *  `<color> <offX> <offY> <blur> [<spread>]` (color FIRST in computed form). The
 *  shadow's leftmost pixel relative to the box left edge is `offX − blur − spread`
 *  (negative offX casts left; blur + spread widen the lobe). We return the MOST
 *  NEGATIVE such value across layers → its magnitude is the left throw beyond the
 *  box edge. Runs browser-side (no Node access to the resolved style otherwise).
 *  Defined as a string injected into page.evaluate. */
const PARSE_SHADOW_LEFT_FN = `(shadow) => {
    if (!shadow || shadow === 'none') return null;
    // Split on commas NOT inside parens (rgb()/color()/color-mix() carry commas).
    const layers = [];
    let depth = 0, start = 0;
    for (let i = 0; i < shadow.length; i++) {
        const ch = shadow[i];
        if (ch === '(') depth++;
        else if (ch === ')') depth--;
        else if (ch === ',' && depth === 0) { layers.push(shadow.slice(start, i)); start = i + 1; }
    }
    layers.push(shadow.slice(start));
    let minLeft = 0; // 0 = no left throw; we want the most-negative (furthest left)
    let sawPx = false;
    for (const layer of layers) {
        // Strip the color token (rgb(...)/rgba(...)/color(...)/color-mix(...)/#hex/keyword).
        // The numeric px lengths are what remain; grab them in order.
        const nums = layer.match(/-?\\d*\\.?\\d+px/g);
        if (!nums || nums.length < 2) continue; // need at least offX offY
        const vals = nums.map((n) => parseFloat(n));
        // box-shadow lengths order: offX offY [blur] [spread]
        const offX = vals[0];
        const blur = vals.length >= 3 ? vals[2] : 0;
        const spread = vals.length >= 4 ? vals[3] : 0;
        sawPx = true;
        const leftExtent = offX - blur - spread; // leftmost pixel relative to box left
        if (leftExtent < minLeft) minLeft = leftExtent;
    }
    return sawPx ? minLeft : null; // negative ⇒ casts left by |minLeft|
}`;

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

    const TOL = 1; // sub-pixel rounding tolerance
    const browser = await chromium.launch();
    try {
        for (const W of [1280, 1440]) {
            const H = 900;
            const page = await browser.newPage({ viewport: { width: W, height: H } });
            await page.goto(`${base}/#/cube`, { waitUntil: "load" });
            await settleOnCube(page, W, H);
            await waitGridSettled(page);

            const label = `${W}×${H}`;

            // Find the active panel Card inside the controls pane. Prefer the
            // .controls-content cartoon Card; hover it so the WORST-CASE
            // --shadow-cartoon-lg (+ --lift-sm) extent is in effect (the worst
            // clip case), then read the resolved shadow + geometry.
            const cardHandle = await page.evaluateHandle(() => {
                const pane = document.querySelector(".controls-pane");
                if (!pane) return null;
                const content = pane.querySelector(".controls-content") || pane;
                // The first visible cartoon panel Card with real area inside the pane.
                const cards = [...content.querySelectorAll('[data-surface="cartoon"]')];
                for (const c of cards) {
                    const r = c.getBoundingClientRect();
                    if (r.width > 0 && r.height > 0) return c;
                }
                return null;
            });

            const cardEl = cardHandle.asElement();
            if (!cardEl) {
                fail(
                    `${label} — no active panel Card ([data-surface="cartoon"] with real area) ` +
                        `found inside .controls-pane / .controls-content; the pane may be closed or ` +
                        `the FSM un-rested (a vacuous pass is forbidden)`,
                );
                await cardHandle.dispose?.();
                await page.close();
                continue;
            }

            // Engage the worst-case hover shadow (--shadow-cartoon-lg + --lift-sm).
            try {
                await cardEl.hover({ timeout: 1500, force: true });
                await page.waitForTimeout(700); // let the spring hover-lift complete
            } catch {
                /* if hover refuses, the rest shadow (--shadow-cartoon-md) is still
                   a left-casting shadow — the measurement below is still valid. */
            }

            const probe = await page.evaluate(
                ([parseFnSrc]) => {
                    const parseShadowLeft = eval("(" + parseFnSrc + ")");
                    const pane = document.querySelector(".controls-pane");
                    const content = pane
                        ? pane.querySelector(".controls-content") || pane
                        : null;
                    const card = (() => {
                        if (!content) return null;
                        const cards = [...content.querySelectorAll('[data-surface="cartoon"]')];
                        for (const c of cards) {
                            const r = c.getBoundingClientRect();
                            if (r.width > 0 && r.height > 0) return c;
                        }
                        return null;
                    })();
                    if (!pane || !content || !card) {
                        return { found: false };
                    }
                    const paneR = pane.getBoundingClientRect();
                    const cardR = card.getBoundingClientRect();
                    const cardCS = getComputedStyle(card);
                    const contentCS = getComputedStyle(content);
                    const contentR = content.getBoundingClientRect();
                    const padLeft = parseFloat(contentCS.paddingLeft) || 0;
                    // The CLIP BOUNDARY: the wrapper that owns the load-bearing
                    // overflow:hidden (desktop) — the bottom-LEFT lobe must not cross
                    // ITS box left. (The .controls-pane is the inner overflow-y-auto
                    // scroll host; its box left coincides with the wrapper's left.)
                    // This edge does NOT move with .controls-content's padding-left, so
                    // it is the faithful, biting reference (a padding-left toggle
                    // translates the Card + a content-relative ref identically). Fall
                    // back to the pane box-left if the wrapper is absent.
                    const wrapper = document.querySelector(".controls-pane-wrapper");
                    const wrapperCS = wrapper ? getComputedStyle(wrapper) : null;
                    const wrapperR = wrapper ? wrapper.getBoundingClientRect() : null;
                    const clipBoxLeft = wrapperR ? wrapperR.left : paneR.left;
                    // The wrapper's effective left-clipping overflow (overflow-x or the
                    // shorthand) — the clip must be REAL for the boundary to mean
                    // anything (non-vacuity c).
                    const wrapperOverflowX = wrapperCS
                        ? wrapperCS.overflowX || wrapperCS.overflow
                        : null;
                    const shadowLeftExtent = parseShadowLeft(cardCS.boxShadow); // ≤0 ⇒ casts left
                    return {
                        found: true,
                        boxShadow: (cardCS.boxShadow || "").slice(0, 90),
                        shadowLeftExtent, // e.g. -7 means the lobe reaches 7px left of the card box
                        cardLeft: cardR.left,
                        clipBoxLeft,
                        paneLeft: paneR.left,
                        contentLeft: contentR.left,
                        padLeft,
                        wrapperOverflowX,
                    };
                },
                [PARSE_SHADOW_LEFT_FN],
            );

            await cardHandle.dispose?.();

            if (!probe.found) {
                fail(`${label} — the active panel Card vanished between handle + measure`);
                await page.close();
                continue;
            }

            // NON-VACUITY (b): the shadow must genuinely cast LEFT (a real positive
            // throw), else the containment is trivially true.
            const leftThrow =
                probe.shadowLeftExtent != null && probe.shadowLeftExtent < 0
                    ? -probe.shadowLeftExtent
                    : 0;
            if (leftThrow <= 0) {
                fail(
                    `${label} non-vacuity — the active panel Card's resolved box-shadow does ` +
                        `NOT cast left (parsed left-extent=${probe.shadowLeftExtent}, shadow=` +
                        `"${probe.boxShadow}…"); the cartoon offset stamp must throw left ` +
                        `(--shadow-cartoon-md -4px / -lg -6px) or this gate cannot bite`,
                );
                await page.close();
                continue;
            }

            // NON-VACUITY (c): the wrapper must actually resolve a LEFT-clipping
            // overflow (hidden/clip) — a non-clipping wrapper could not slice the
            // lobe, so the containment would be meaningless.
            const ox = (probe.wrapperOverflowX || "").trim();
            const wrapperClips = ox === "hidden" || ox === "clip" || ox === "scroll" || ox === "auto";
            if (!wrapperClips) {
                fail(
                    `${label} non-vacuity — the .controls-pane-wrapper does NOT resolve a ` +
                        `left-clipping overflow (overflow-x: '${probe.wrapperOverflowX}'); the ` +
                        `load-bearing clip must be present (hidden) for the containment to mean ` +
                        `anything — if the clip is gone, the [rail]-track collapse also broke`,
                );
                await page.close();
                continue;
            }

            // CLAUSE (a) — F7 MECHANISM: .controls-content carries a defensive
            // padding-left ≥ the ~8px worst-case throw (the clearance the fix adds; a
            // regression that drops it below the throw reds).
            const PAD_FLOOR = 8;
            if (probe.padLeft >= PAD_FLOOR - TOL) {
                ok(
                    `${label} F7 clearance: .controls-content resolves padding-left ` +
                        `${probe.padLeft.toFixed(0)}px ≥ ${PAD_FLOOR}px (the defensive left ` +
                        `clearance ≥ the ~8px worst-case shadow throw)`,
                );
            } else {
                fail(
                    `${label} F7 clearance — .controls-content resolves padding-left ` +
                        `${probe.padLeft.toFixed(0)}px < ${PAD_FLOOR}px (below the ~8px worst-case ` +
                        `cartoon shadow throw); F7 (S2) must add padding-left to .controls-content ` +
                        `to keep the left lobe clear of the load-bearing overflow:hidden`,
                );
            }

            // CLAUSE (b) — CONTAINMENT: the shadow's leftmost pixel = cardLeft −
            // leftThrow must be ≥ the wrapper clip box-left (the lobe stays inside the
            // load-bearing clip — the structural invariant the F7 clearance protects).
            const shadowLeftmostPx = probe.cardLeft - leftThrow;
            const clears = shadowLeftmostPx >= probe.clipBoxLeft - TOL;
            if (clears) {
                ok(
                    `${label} containment: the cartoon shadow's left lobe lands INSIDE the clip ` +
                        `(shadow leftmost ${shadowLeftmostPx.toFixed(1)}px ≥ clip box-left ` +
                        `${probe.clipBoxLeft.toFixed(1)}px by ${(shadowLeftmostPx - probe.clipBoxLeft).toFixed(1)}px; ` +
                        `card left ${probe.cardLeft.toFixed(1)}, left throw ${leftThrow.toFixed(1)}px, ` +
                        `padding-left ${probe.padLeft.toFixed(0)}px, wrapper overflow-x '${probe.wrapperOverflowX}')`,
                );
            } else {
                fail(
                    `${label} containment — the cartoon shadow's bottom-LEFT lobe is CLIPPED ` +
                        `(shadow leftmost ${shadowLeftmostPx.toFixed(1)}px < clip box-left ` +
                        `${probe.clipBoxLeft.toFixed(1)}px by ${(probe.clipBoxLeft - shadowLeftmostPx).toFixed(1)}px; ` +
                        `card left ${probe.cardLeft.toFixed(1)}, left throw ${leftThrow.toFixed(1)}px, ` +
                        `padding-left ${probe.padLeft.toFixed(0)}px). The wrapper's load-bearing ` +
                        `overflow:hidden slices the lobe — a regression pushed the Card flush / widened ` +
                        `the throw / dropped the F7 clearance. KEEP the clip, give the shadow room.`,
                );
            }

            await page.close();
        }
    } finally {
        await browser.close();
        server.close();
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:cartoon-shadow-unclipped — FAIL (${failures.length}): the cartoon stamp's ` +
            `bottom-LEFT shadow lobe is sliced by the controls-pane clip (H.W9 F7).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:cartoon-shadow-unclipped — PASS: at 1280 & 1440 the active panel Card's cartoon " +
        "shadow left lobe lands inside the load-bearing overflow:hidden clip AND .controls-content " +
        "carries the F7 defensive left clearance (≥8px) — the structural shadow-inside-the-clip " +
        "invariant holds (H.W9 F7; a containment guard like proof:stage-not-clipped).",
);
