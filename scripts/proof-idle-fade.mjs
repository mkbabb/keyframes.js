#!/usr/bin/env node
/**
 * proof:idle-fade — H.W9 F9 (the controls pane rest-dims after global idle).
 *
 * The defect (F9, a RESTORATION): a D-era refactor dropped the controls idle-fade
 * CSS while keeping the `usePaneHover` / `.controls-pane--hovered` plumbing — the
 * class went vestigial and the OPEN pane rested at full opacity forever. The fix
 * re-authors the rest-dim via `@vueuse/core useIdle(10_000)`: after 10s of GLOBAL
 * window inactivity (and while not hovered) the wrapper carries
 * `.controls-pane--idle` and CSS (design-idioms.css `--controls-idle-opacity` +
 * ControlsPaneWrapper's scoped desktop rule) fades it to ~0.35; any activity / hover
 * / focus-within lifts it back to 1 (the a11y improvement: `:focus-within` + a PRM
 * snap-guard).
 *
 * BROWSER-ONLY (the idle-fade is a rendered, time-driven fact — there is no static
 * half; the wire + token presence is documented in the lane notes / consumed by
 * usePaneHover). One falsifiable BROWSER clause with a NON-VACUITY anchor, BITING on
 * the exact defect:
 *
 *   NON-VACUITY (the active/resting delta): with the pane open and ACTIVE (just
 *   after a settle event), the wrapper's computed `opacity` is ~1 — so the dim is a
 *   real delta, not a pane that is always 0.35. BITE-context: if resting opacity is
 *   already < 1, the "drop" is vacuous → fail.
 *
 *   IDLE-DROP: pin #/cube desktop, open the pane, then fire NO events for >10s
 *   (a real Playwright wait — NOT a synthetic clock; useIdle resets on
 *   mousemove/keydown/wheel/etc, so any synthetic event would defeat the test).
 *   Assert (a) the wrapper carries `.controls-pane--idle` AND (b) its computed
 *   `opacity` drops to `--controls-idle-opacity` (< 1.0, ≈0.35). BITE: born-RED
 *   today (no idle dim exists — the class is dead, opacity rests at 1 forever:
 *   `idleOpacity === 1`). Greens on the restored useIdle-driven rest-dim.
 *
 *   HOVER-LIFT: then `page.hover` the pane → assert opacity returns to 1 (activity
 *   resets useIdle → the class drops AND the :hover override lifts it; both paths
 *   restore full opacity). BITE: if the dim never lifted on interaction, the pane
 *   would be stuck ghosted — reds.
 *
 * Settle-gated on the H.W1 FSM resting (#/cube pinned via an IN-PAGE hash assignment,
 * NOT page.goto — goto clears storage + kills the reconcile trap; viewport ≥1024
 * RE-ASSERTED after navigation; pane OPEN; route rested). The idle rule is
 * desktop-only (@media min-width:1024px). Mirrors scripts/proof-single-column-pack.mjs
 * (the serveDist + settleOnCube + openPane plumbing). Under KF_REQUIRE_BROWSER a
 * playwright-absent skip becomes a hard fail so the idle-fade is never green-reported
 * un-exercised. Re-runnable: `node scripts/proof-idle-fade.mjs`. Serves the BUILT
 * dist/gh-pages/ (run `npm run gh-pages` first).
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

console.log("proof:idle-fade — H.W9 F9 (the controls pane rest-dims after global idle)");

const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — ` +
                "the idle-fade clauses cannot pass vacuously",
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
 *  survive; goto would clear both). Re-assert the test viewport AFTER navigation. */
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
    await page.waitForTimeout(600);
}

/** Force the controls pane OPEN (the idle rule is on the OPEN wrapper). */
async function openPane(page) {
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

/** Wait until the OPEN controls-pane wrapper is live (the settle predicate). */
async function waitWrapper(page) {
    return page
        .waitForFunction(
            () => {
                const el = document.querySelector(".controls-pane-wrapper.controls-pane--open");
                return !!el && el.getBoundingClientRect().height > 0;
            },
            { timeout: 8000 },
        )
        .then(() => true)
        .catch(() => false);
}

const wrapperState = (page) =>
    page.evaluate(() => {
        const el = document.querySelector(".controls-pane-wrapper.controls-pane--open");
        if (!el) return null;
        const cs = getComputedStyle(el);
        const token = getComputedStyle(document.documentElement)
            .getPropertyValue("--controls-idle-opacity")
            .trim();
        return {
            opacity: parseFloat(cs.opacity),
            hasIdleClass: el.classList.contains("controls-pane--idle"),
            hasHoverClass: el.classList.contains("controls-pane--hovered"),
            token: token ? parseFloat(token) : null,
        };
    });

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

    const VW = 1440;
    const VH = 900;
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage({ viewport: { width: VW, height: VH } });
        await page.goto(`${base}/#/cube`, { waitUntil: "load" });
        await settleOnCube(page, VW, VH);
        await openPane(page);
        const live = await waitWrapper(page);

        if (!live) {
            const dbg = await page.evaluate(() => ({
                wrapper: !!document.querySelector(".controls-pane-wrapper"),
                open: !!document.querySelector(".controls-pane-wrapper.controls-pane--open"),
                hash: location.hash,
            }));
            fail(
                `the OPEN controls-pane wrapper never mounted (wrapper:${dbg.wrapper}, ` +
                    `open:${dbg.open}, hash:${dbg.hash}) — the FSM may not have rested on cube ` +
                    "or the pane did not open",
            );
            await page.close();
            return;
        }

        // ── NON-VACUITY (the active/resting delta) ──────────────────────────────
        // Just-settled state is ACTIVE (the open + waits were activity). Read the
        // resting opacity BEFORE the idle window — it must be ~1 so the dim is a
        // real delta, not an always-dim pane.
        const active = await wrapperState(page);
        if (active.token == null) {
            fail(
                "--controls-idle-opacity is not declared on :root — the F9 token (design-idioms.css) " +
                    "must define the rest-dim opacity magnitude",
            );
        } else if (active.token >= 1) {
            fail(
                `--controls-idle-opacity is ${active.token} (≥ 1) — the rest-dim token must be < 1 ` +
                    "(≈0.35) for the fade to be a real dim",
            );
        } else {
            ok(`--controls-idle-opacity token resolves to ${active.token} (< 1 — a real dim magnitude)`);
        }

        if (active.opacity >= 0.99) {
            ok(
                `non-vacuity: the active/resting OPEN pane is opaque ` +
                    `(opacity=${active.opacity.toFixed(3)} ≈ 1) — the idle dim is a real delta`,
            );
        } else {
            fail(
                `non-vacuity — the OPEN pane already rests at opacity=${active.opacity.toFixed(3)} (< 1) ` +
                    "BEFORE idle; the dim cannot be witnessed as a delta (a vacuous always-dim pane)",
            );
        }

        // ── IDLE-DROP: sit idle for >10s with NO events (real wait) ─────────────
        // useIdle(10_000) tracks mousemove/mousedown/resize/keydown/touchstart/wheel
        // + visibilitychange — fire NONE of them. A plain timer wait (no page
        // interaction) lets the idle clock elapse. 11.5s > the 10s threshold.
        await page.waitForTimeout(11_500);

        const idle = await page.evaluate(() => {
            const el = document.querySelector(".controls-pane-wrapper.controls-pane--open");
            const cs = getComputedStyle(el);
            return {
                opacity: parseFloat(cs.opacity),
                hasIdleClass: el.classList.contains("controls-pane--idle"),
                hasHoverClass: el.classList.contains("controls-pane--hovered"),
            };
        });

        const tol = 0.05;
        const droppedToToken =
            active.token != null && Math.abs(idle.opacity - active.token) <= tol;
        if (idle.hasIdleClass && droppedToToken) {
            ok(
                `idle-drop: after >10s idle the wrapper carries .controls-pane--idle and opacity ` +
                    `dropped to ${idle.opacity.toFixed(3)} ≈ --controls-idle-opacity (${active.token}) — ` +
                    "the rest-dim fired (was opacity 1 forever, the dead class)",
            );
        } else if (!idle.hasIdleClass) {
            fail(
                `idle-drop — after >10s idle the wrapper does NOT carry .controls-pane--idle ` +
                    `(opacity=${idle.opacity.toFixed(3)}, hovered:${idle.hasHoverClass}). Born-RED today: ` +
                    "useIdle is not wired / the class is dead — the pane never rest-dims (F9 restoration).",
            );
        } else {
            fail(
                `idle-drop — the wrapper carries .controls-pane--idle but opacity is ` +
                    `${idle.opacity.toFixed(3)}, not ≈ --controls-idle-opacity (${active.token}). The CSS ` +
                    "consuming rule did not fade it (the dim magnitude is unwired).",
            );
        }

        // ── HOVER-LIFT: hover the pane → opacity returns to 1 ───────────────────
        // Hover the wrapper. This is activity (resets useIdle → class drops) AND
        // triggers the :hover override — both restore full opacity.
        const wrapper = page.locator(".controls-pane-wrapper.controls-pane--open").first();
        const box = await wrapper.boundingBox();
        if (box) {
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        } else {
            await wrapper.hover({ force: true }).catch(() => {});
        }
        await page.waitForTimeout(500); // let the lift transition settle

        const hovered = await page.evaluate(() => {
            const el = document.querySelector(".controls-pane-wrapper.controls-pane--open");
            return { opacity: parseFloat(getComputedStyle(el).opacity) };
        });
        if (hovered.opacity >= 0.99) {
            ok(
                `hover-lift: hovering the pane returns opacity to ${hovered.opacity.toFixed(3)} ≈ 1 ` +
                    "(activity resets useIdle + the :hover override lifts it — no stuck ghost)",
            );
        } else {
            fail(
                `hover-lift — after hovering, opacity is ${hovered.opacity.toFixed(3)} (< 1); the dim did ` +
                    "NOT lift on interaction (the pane is stuck ghosted — the override/reset is broken)",
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
        `\nproof:idle-fade — FAIL (${failures.length}): the OPEN controls pane does not rest-dim after ` +
            "global idle and lift on interaction (the idle-fade was dropped — F9 restoration).",
    );
    process.exit(1);
}
console.log(
    "\nproof:idle-fade — PASS: the OPEN pane rests opaque, dims to --controls-idle-opacity after >10s idle, " +
        "and lifts to 1 on hover (the restored useIdle-driven rest-dim — F9).",
);
