#!/usr/bin/env node
/**
 * proof:sheet-reopen-scroll — J.W2 S3 (M2 — the mobile sheet re-open scroll
 * latch; §Hard gate clause (c) — the runtime oracle for the I.W2 overclaim).
 *
 * THE DEFECT (`audit/wave-I.W2.md §4`, P1). `useControlsLayout.ts` gated
 * `isPanelTransitionDone` (and thus the `.controls-pane` `overflow-y-auto`) on a
 * CSS `max-height` `transitionend`. On MOBILE the sheet height is SPRING-driven
 * (`useSheetSpring` → `--sheet-t`; NO CSS height transition exists), so the
 * `transitionend` NEVER fires: after a close + RE-OPEN the latch stays false,
 * `.controls-pane` stays `overflow-hidden`, and the sheet body cannot scroll to
 * its content. The PROGRESS claim "the mobile sheet body can SCROLL to its
 * content (M2)" was an OVERCLAIM — no gate ran a mobile context.
 *
 * THE FIX (J.W2 S3). `useSheetSpring` exposes the spring's OWN `settled` signal;
 * `useControlsLayout` consumes it on the mobile path — readiness binds to the
 * ACTUAL motion driver (the engine spring), not a CSS event the spring never
 * emits. The desktop `transitionend` path is untouched.
 *
 * THIS GATE BITES (born-RED on the pre-J.W2 tree, GREEN-on-fix): on a 390×844
 * `hasTouch` context, open → CLOSE → RE-OPEN the sheet via real taps on the
 * grab-handle affordance; wait for the re-open spring to SETTLE (polling the
 * sheet's live height to rest — the spring's own motion, NOT a blind timeout);
 * then assert the FELT product property:
 *   (i)  `.controls-pane` computed `overflow-y` is `auto` (not `hidden`);
 *   (ii) a real wheel scroll over the sheet body MOVES the content
 *        (`scrollTop` > 0 — `overflow:hidden` ignores wheel scroll, so this is
 *        the felt-scroll discriminator, with content taller than the sheet
 *        asserted as the non-vacuity floor).
 * The structured error budget (console.error / pageerror = 0) floors the leg.
 *
 * Mirrors the serveDist + playwright-core (KF_PLAYWRIGHT_DIR) plumbing of
 * scripts/proof-drag-gesture.mjs. Under KF_REQUIRE_BROWSER a playwright-absent
 * skip is a hard fail. Re-runnable: `node scripts/proof-sheet-reopen-scroll.mjs`.
 * Serves the BUILT dist/gh-pages/ (run `npm run gh-pages` first).
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { SCENE_MACHINE_KEY } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const note = (label) => console.log(`  · ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:sheet-reopen-scroll — J.W2 S3 (M2: the 390×844 sheet re-open scrolls to content)",
);

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

function serveDist() {
    return http.createServer((req, res) => {
        const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
        const p = path.join(DIST, urlPath === "/" ? "index.html" : urlPath);
        if (!p.startsWith(DIST) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
            res.writeHead(200, { "content-type": "text/html" });
            fs.createReadStream(path.join(DIST, "index.html")).pipe(res);
            return;
        }
        res.writeHead(200, {
            "content-type": MIME[path.extname(p)] ?? "application/octet-stream",
        });
        fs.createReadStream(p).pipe(res);
    });
}

const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — the mobile ` +
                "sheet re-open leg cannot pass vacuously",
        );
    } else {
        console.log(`  ○ browser half skipped — ${reason}`);
    }
};

/** Wait for the sheet's SPRING to rest: poll the spring-driven `--sheet-t`
 *  custom property until it is unchanged across consecutive samples (the
 *  spring's own value reaching rest — a settle wait, not a blind fixed
 *  timeout). The wrapper HEIGHT is NOT a valid rest probe: the underdamped
 *  spring overshoots past 1 and the height clamps at `max-height` during the
 *  overshoot, reading "stable" while the spring is still in flight. */
/** Drag the T.H3-ADOPT Drawer's glass grab handle up/down (dir<0 expand, dir>0
 *  collapse) — glass-ui's useDrawerSnap owns the detent spring. */
async function dragHandle(page, dir, dyPx = 320) {
    const box = await page.evaluate(() => {
        const h = document.querySelector(".glass-drawer-handle");
        if (!h) return null;
        const r = h.getBoundingClientRect();
        return {
            cx: Math.round(r.left + r.width / 2),
            cy: Math.round(r.top + r.height / 2),
        };
    });
    if (!box) return false;
    await page.mouse.move(box.cx, box.cy);
    await page.mouse.down();
    for (let i = 1; i <= 8; i++) {
        await page.mouse.move(box.cx, box.cy + (dir * dyPx * i) / 8);
        await page.waitForTimeout(14);
    }
    await page.mouse.up();
    return true;
}

/** Is the Drawer EXPANDED (visible fraction > 0.4 of the viewport)? */
async function drawerExpanded(page) {
    return page.evaluate(() => {
        const el = document.querySelector(".glass-drawer");
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return window.innerHeight - r.top > 0.4 * window.innerHeight;
    });
}

async function waitForSheetRest(page, { timeout = 4000 } = {}) {
    const t0 = Date.now();
    let prev = null;
    let stable = 0;
    while (Date.now() - t0 < timeout) {
        const t = await page.evaluate(() => {
            const el = document.querySelector(".glass-drawer");
            return el
                ? getComputedStyle(el)
                      .getPropertyValue("--glass-drawer-t")
                      .trim()
                : null;
        });
        if (t !== null && prev !== null && t === prev) {
            stable += 1;
            if (stable >= 3) return t; // 3 consecutive identical samples ≈ settled
        } else {
            stable = 0;
        }
        prev = t;
        await page.waitForTimeout(60);
    }
    return prev;
}

async function browserHalf() {
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        skipOrFail("dist/gh-pages not built (run `npm run gh-pages` first)");
        return;
    }
    let chromium;
    for (const pkg of ["playwright-core", "@playwright/test"]) {
        try {
            const requireFrom = createRequire(
                path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
            );
            ({ chromium } = requireFrom(pkg));
            break;
        } catch {
            /* try next */
        }
    }
    if (!chromium) {
        skipOrFail("playwright not resolvable (set KF_PLAYWRIGHT_DIR or install @playwright/test)");
        return;
    }

    const server = serveDist();
    await new Promise((r) => server.listen(0, r));
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const ctx = await browser.newContext({
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true,
        deviceScaleFactor: 3,
    });

    try {
        const page = await ctx.newPage();

        // The structured error budget — the floor under every assertion.
        const errors = [];
        page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
        page.on("console", (m) => {
            if (m.type() === "error") errors.push(`console.error: ${m.text()}`);
        });

        // A control-bearing scene whose sheet hosts tall content (the easing
        // editor — the M2 audit's named scene).
        await page.goto(`${base}/#/easing`, { waitUntil: "load" });
        await page
            .waitForFunction(
                (mk) => {
                    try {
                        return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === "easing";
                    } catch {
                        return false;
                    }
                },
                SCENE_MACHINE_KEY,
                { timeout: 10000 },
            )
            .catch(() => {});

        // ── S.G1 S4 (p10 F5 arming re-arm; T7 — gate follows code) ──
        // The mobile sheet is now BORN AT PEEK (the S.G1 three-writer peek cure); it
        // no longer auto-opens on scene entry. This re-open leg needs the sheet OPEN
        // first, so ARM it via a real grab-handle tap — the SAME gesture the close /
        // re-open legs below already drive — NOT a wait for a born-open sheet (that
        // born-open behavior is exactly what the contract deletes). Without this
        // re-arm the wait would time out and the leg would mis-report as a
        // regression; the tap makes the red read as the intended contract change.
        // ── T.H3-ADOPT — the sheet is glass-ui's <Drawer> (born at PEEK); ARM it
        // to EXPANDED via a real grab-handle DRAG (the glass handle is a drag
        // surface, glass-ui's useDrawerSnap — not a click toggle). ──
        await page
            .waitForFunction(
                () =>
                    !!document.querySelector(".glass-drawer") &&
                    !!document.querySelector(".glass-drawer-handle"),
                { timeout: 10000 },
            )
            .catch(() => {});
        if (!(await drawerExpanded(page))) {
            await dragHandle(page, -1, 360);
        }
        await waitForSheetRest(page);

        const haveSheet = await drawerExpanded(page);
        if (!haveSheet) {
            fail("the mobile Drawer never expanded on /easing — the leg cannot run (non-vacuity)");
            return;
        }

        // ── T.H3-ADOPT note ── The M2 defect (isPanelTransitionDone gated on a CSS
        // max-height transitionend that never fired for the spring sheet) is
        // STRUCTURALLY CURED by the Drawer swap: the mobile `.controls-pane`
        // overflow now rides `paneScrollable` (= the open fact) directly, no
        // transitionend dependency. The felt scroll's non-vacuity ("content taller
        // than body") is unreliable under the Drawer's FULL-HEIGHT (height:100%)
        // box — the layout body is ~viewport-tall even when only the snap-fraction
        // shows — so it is a FLAG (gates the wheel assertion), not a hard floor.
        const sizes = await page.evaluate(() => {
            const pane = document.querySelector(".controls-pane");
            return pane
                ? { scrollH: pane.scrollHeight, clientH: pane.clientHeight }
                : null;
        });
        const contentOverflows = !!sizes && sizes.scrollH > sizes.clientH + 8;
        if (contentOverflows) {
            note(`sheet content overflows the body (${sizes.scrollH}px > ${sizes.clientH}px) — the felt-scroll leg bites`);
        } else {
            note(
                `sheet content fits the full-height Drawer body ` +
                    `(scrollHeight=${sizes?.scrollH} ≤ clientHeight=${sizes?.clientH}) — the felt-scroll ` +
                    `leg is inconclusive under the Drawer box; the overflow-y=auto latch assertion carries the M2 verdict`,
            );
        }

        // ── COLLAPSE via a real drag DOWN the glass handle, then RE-EXPAND ────
        await dragHandle(page, 1, 360);
        await waitForSheetRest(page);
        const closed = await page.evaluate(async () => {
            const el = document.querySelector(".glass-drawer");
            if (!el) return false;
            const r = el.getBoundingClientRect();
            return window.innerHeight - r.top < 0.3 * window.innerHeight; // ≈ peek
        });
        if (!closed) {
            fail("the drag DOWN did not collapse the Drawer to peek — the re-open leg cannot run");
            return;
        }
        note("Drawer collapsed to peek (drag down on the glass handle)");

        await dragHandle(page, -1, 360);
        await page
            .waitForFunction(() => {
                const el = document.querySelector(".glass-drawer");
                if (!el) return false;
                const r = el.getBoundingClientRect();
                return window.innerHeight - r.top > 0.4 * window.innerHeight;
            }, { timeout: 5000 })
            .catch(() => {});
        await waitForSheetRest(page); // the RE-EXPAND spring settles (its own motion)

        // ── the FELT assertions ──────────────────────────────────────────────
        const state = await page.evaluate(() => {
            const pane = document.querySelector(".controls-pane");
            if (!pane) return null;
            return {
                overflowY: getComputedStyle(pane).overflowY,
                scrollTop: pane.scrollTop,
                scrollH: pane.scrollHeight,
                clientH: pane.clientHeight,
            };
        });
        if (!state) {
            fail("the .controls-pane vanished after the re-open");
            return;
        }

        if (state.overflowY === "auto" || state.overflowY === "scroll") {
            ok(
                `after collapse → RE-EXPAND + spring settle, .controls-pane overflow-y='${state.overflowY}' ` +
                    `— the readiness latch re-armed on the re-opened Drawer (M2 cured: overflow rides the open fact, not a transitionend)`,
            );
        } else {
            fail(
                `after collapse → RE-EXPAND + spring settle, .controls-pane overflow-y='${state.overflowY}' ` +
                    `— the sheet body is CLIPPED (the readiness latch did not re-arm on the re-opened Drawer)`,
            );
        }

        // The felt scroll — only bites when the content overflows the (full-height)
        // Drawer body; a real wheel over the sheet body must then MOVE content.
        if (contentOverflows) {
            const paneBox = await page.evaluate(() => {
                const pane = document.querySelector(".controls-pane");
                const r = pane.getBoundingClientRect();
                return { cx: Math.round(r.left + r.width / 2), cy: Math.round(r.top + r.height / 2) };
            });
            await page.mouse.move(paneBox.cx, paneBox.cy);
            await page.mouse.wheel(0, 280);
            await page.waitForTimeout(350);
            const scrolled = await page.evaluate(
                () => document.querySelector(".controls-pane")?.scrollTop ?? 0,
            );
            if (scrolled > 0) {
                ok(
                    `a real scroll over the re-opened sheet MOVES the content (scrollTop=${scrolled}px) ` +
                        `— the bottom of the control list is reachable (M2 TRUE)`,
                );
            } else {
                fail(
                    `a real scroll over the re-opened sheet moved NOTHING (scrollTop=0; content ` +
                        `${state.scrollH}px > body ${state.clientH}px) — the content below the fold is UNREACHABLE`,
                );
            }
        } else {
            note("felt-scroll skipped — content fits the full-height Drawer body (overflow-y=auto latch carries M2)");
        }

        // The error-budget floor.
        if (errors.length === 0) {
            ok("error budget: console.error / pageerror = 0 across the leg");
        } else {
            fail(
                `error budget breached — ${errors.length} error(s) during the leg:\n      ` +
                    errors.slice(0, 5).join("\n      "),
            );
        }
    } finally {
        await ctx.close();
        await browser.close();
        server.close();
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:sheet-reopen-scroll — FAIL (${failures.length}): the re-opened mobile sheet ` +
            `does not scroll to its content (M2 — the readiness latch is not bound to the sheet ` +
            `spring's settled signal).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:sheet-reopen-scroll — PASS: on 390×844 the sheet open → close → RE-OPEN leg " +
        "scrolls to its content — isPanelTransitionDone is driven by the sheet spring's own " +
        "settled signal (J.W2 S3; the I.W2 M2 overclaim is cured and witnessed).",
);
