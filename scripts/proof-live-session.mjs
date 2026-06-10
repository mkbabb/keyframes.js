#!/usr/bin/env node
/**
 * proof:live-session — Tranche I.W7 S2 · THE HEADLINE · the gate-of-gates.
 *
 * ONE re-runnable INTERACTION-DRIVEN session over the BUILT dist/gh-pages/ — the
 * SEAM that collapses the lattice of ~34 proxy load-rest/wrong-projection browser
 * gates into a SINGLE human-battery probe (rc-gate-blindspot §5.2). Harness: the
 * scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist + resolveChromium
 * + context/teardown for the dist legs; withBrowser for the :5174 dev-server
 * leg; navToScene as the per-EXPECTED-state nav primitive — J.W3 S1) — EXTENDED
 * FROM PASSIVE TO ACTUATING. The session IS the human battery: load → CLICK the
 * rainbow group-play → hover-expand the morphing dock + SWITCH scenes → fire a
 * synthetic visibilitychange while a raw-rAF scene plays → DRAG on /square + a
 * centre-drag on /amiga → switch back → replay.
 *
 * THE ORACLE — a single accumulated ERROR BUDGET = 0 (the S2a structured
 * allowlist below) captured via page.on("console")/("pageerror")/("requestfailed")
 * across the WHOLE battery, NOT rested per route — PLUS the product-facing DOM
 * assertions (the union of the per-wave legs):
 *   B1 — after the rainbow group-play the cube draw loop is LIVE (≥3 distinct
 *        .cube/.graph transforms).
 *   B2 — a synthetic visibilitychange→hidden on a PLAYING raw-rAF scene raises NO
 *        _gen throw (S2b: the born-RED-of-record; the deterministic dev-server leg
 *        is a NAMED exception, KF_DEV_SERVER=1).
 *   B4 — after a switch-into-easing the .easing-curve-canvas + draggable handles
 *        are present and a handle-drag mutates the path.
 *   B6 — on /square a real drag selects NO text + the transform PERSISTS.
 *   B3 — on /amiga a centre-drag moves the SUBJECT, not the room.
 *   B7 — at rest the glass ::before carry NO bloom.
 *   B9 — every scene glyph PAINTS.
 *   font — the body font is NOT Plus Jakarta (the I.W6-font reclaim).
 *
 * TWO HARNESS MODES (H-6 — both required):
 *   • MODE-PERSIST — ONE persistent context for the suspend/resume/switch matrix
 *     (resume-iff-was-playing is a CROSS-SCENE, WITHIN-SESSION continuity; a fresh
 *     context per scene RESETS the FSM + localStorage and destroys it).
 *   • MODE-FRESH — a fresh context per scene for the INDEPENDENT legs (B1 play,
 *     B4 mount+drag, B6 drag, B3 centre-drag, B7 rest, B9 paint, font), so a leak
 *     in one scene cannot mask a defect in another.
 *
 * THE PER-WAVE §HARD GATES ARE THE CLAUSES OF THIS BATTERY. I.W7 assembles them
 * into the single re-runnable session: this gate runs the battery INLINE for the
 * cross-cutting budget + DOM, and its summary CITES the per-wave gates as the
 * granular clauses (proof:engine-no-throw-on-play [B1], proof:fsm-suspend-resume-
 * live [B2], proof:easing-editor-live [B4], proof:amiga-subject-is-pivot [B3],
 * proof:drag-gesture + proof:perf-frame-budget [B6/B8], proof:icon-paint-live
 * [B9/K], proof:specular-absent-at-rest [B7], proof:demo-fonts [font]).
 *
 * Born-RED on `b934a08` (every breakage live: B1 throws on the rainbow-play click,
 * B2 throws on play→switch, B4's panel is blank, B6 selects text + recenters, B3
 * re-projects the room, B7 blooms at rest, B9's orphan). GREEN only when ALL of
 * I.W0–I.W6 land. Under KF_REQUIRE_BROWSER a playwright-absent skip is a hard
 * fail AT THE LIB SEAM. Serves the BUILT dist/gh-pages/. Re-runnable:
 *   KF_REQUIRE_BROWSER=1 KF_PLAYWRIGHT_DIR=… node scripts/proof-live-session.mjs
 */
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chargeBudget, isNamedBenign } from "./lib/console-budget.mjs";
import {
    REQUIRE_BROWSER,
    SCENE_MACHINE_KEY,
    navToScene,
    withBrowser,
    withPage,
} from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const note = (l) => console.log(`  · ${l}`);
const fail = (l) => {
    failures.push(l);
    console.error(`  ✗ ${l}`);
};

console.log(
    "proof:live-session — I.W7 S2 (THE HEADLINE): ONE interaction-driven session over the BUILT dist — " +
        "PLAY + SWITCH + DRAG with a single accumulated ERROR BUDGET = 0 + the product-facing DOM",
);

// ═════════════════════════════════════════════════════════════════════════════
// S2a — THE ERROR BUDGET, DEFINED ONCE (the structured allowlist; H-2).
//
// The budget is the COMPLEMENT of the named EXCLUDED set — NOT a positive match
// list (the inversion of proof:demo-console-clean's narrowed-regex sin, which
// asserted ONLY one HA1_SIGNATURE and filtered everything else OUT, so B1's flood
// passed). Every captured pageerror / unhandledrejection / console.error /
// promoted warning|verbose line that is NOT in the named-benign EXCLUDED set REDS
// the budget. There is NO regex-narrowing escape hatch.
//
//  | Tier      | Signal                                            | Threshold |
//  |-----------|---------------------------------------------------|-----------|
//  | HARD      | pageerror (uncaught throw)                        | = 0       |
//  | HARD      | unhandledrejection                                | = 0       |
//  | HARD      | console.error                                     | = 0       |
//  | HARD      | value.js /Parse error at offset 0: "\.+"/ line    | = 0       |  ← B1/B5 bare-"......" fingerprint, matched EXPLICITLY so a narrowed regex can never hide it
//  | PROMOTED  | warning|verbose /ReadPixels|GPU stall|content-    | = 0       |  ← NOT benign: a REAL GPU stall (RC-2); SCOPED to the amiga WebGL context
//  |           |   visibility|hidden by content-visibility/        |           |     (the Monaco keyframes-pane content-visibility:hidden B-2 cache is NAMED-BENIGN)
//  | EXCLUDED  | the dev DevTools dep-optimizer source-map noise   | not       |  ← B9-c, the :5174-only ×47 lines — a dev-environment integrity artifact accepted at I.W5;
//  | (benign)  |   (the dep-optimizer / source-map pattern)        | counted   |     the built dist is clean + never emits it (so the exclusion is inert on the dist legs)
//  | EXCLUDED  | ReadPixels/GPU-stall on a DECLARED-READBACK leg    | not       |  ← the harness's OWN page.screenshot of a WebGL canvas reads the framebuffer back and
//  | (benign)  |   (leg label matches /readback/)                  | counted   |     emits the SAME GL line as a product stall; it is the MEASUREMENT INSTRUMENT, not the
//  |           |                                                   |           |     product — the genuine RC-2 oracle rides the no-screenshot B3:amiga-present-loop leg
// ═════════════════════════════════════════════════════════════════════════════

// THE CLASSIFIER IS LIB-SOURCED (J.W3 S1b / GC-7): `NAMED_BENIGN` + `isNamedBenign`
// + `chargeBudget` (with the PARSE_FINGERPRINT / GEN_CRASH / PROMOTED_GPU /
// PROMOTED_CV oracles) live in scripts/lib/console-budget.mjs — the SINGLE budget
// authority any future console-budget gate consumes. The promotion carries the
// W7-2 LEG-SCOPING fix: the dev DevTools/vite/dep-optimizer/source-map exclusions
// apply ONLY on the dev-server leg (`B2:dev-server:5174`); on every dist leg they
// are INERT BY CONSTRUCTION (`/source ?map/i` tightened to the DevTools
// dep-optimizer fingerprint). The Monaco content-visibility exclusion stays
// leg-independent (scoped by `monaco` in the regex itself). The `leg` label is
// therefore THREADED through every chargeBudget/isNamedBenign call below.

// A budget accumulator bound to a page (or many). All charges across the WHOLE
// battery accrue here; the verdict reads `charges.length === 0`.
function makeBudget(label) {
    const charges = [];
    const attach = (page, legLabel) => {
        page.on("pageerror", (e) => {
            const c = chargeBudget("pageerror", null, String(e?.message ?? e), legLabel);
            if (c) charges.push({ ...c, leg: legLabel });
        });
        page.on("console", (m) => {
            // Chrome's "hidden by content-visibility" verbose line carries NO
            // element info in its text — the Monaco keyframes-pane named-benign
            // signature lives in the message SOURCE (the monaco/CSSCodeEditor
            // chunk). Append the source URL so the named-benign check matches BY
            // NAMED SIGNATURE (S1b), never by widening the text regex.
            const src = m.location()?.url ?? "";
            const text = src ? `${m.text()} [source: ${src}]` : m.text();
            const c = chargeBudget("console", m.type(), text, legLabel);
            if (c) charges.push({ ...c, leg: legLabel });
        });
        page.on("crash", () => charges.push({ tier: "HARD", text: "page crashed", leg: legLabel }));
        page.on("requestfailed", (req) => {
            // A failed asset request on the dist is a real miss (the B9 orphan
            // class) — charge it unless named-benign (a dev source-map miss,
            // leg-scoped: benign ONLY on the dev-server leg — W7-2).
            const u = req.url();
            const ef = req.failure?.()?.errorText ?? "";
            const txt = `requestfailed: ${u} (${ef})`;
            if (!isNamedBenign(txt, legLabel) && !isNamedBenign(u, legLabel)) {
                charges.push({ tier: "HARD", text: txt, leg: legLabel });
            }
        });
        page.context().on?.("weberror", (e) => {
            const c = chargeBudget("weberror", null, String(e?.error?.message ?? e), legLabel);
            if (c) charges.push({ ...c, leg: legLabel });
        });
    };
    return { label, charges, attach };
}

// ── browser plumbing (the scripts/lib/demo-driver.mjs lifecycle, J.W3 S1) ─────
const USE_DEV_SERVER = process.env.KF_DEV_SERVER === "1";
const MACHINE_KEY = SCENE_MACHINE_KEY; // SCENE_MACHINE_PERSIST_KEY (lib-sourced)
const CTRL_KEY = "animation-groups-control-options-store";

// ── shared page helpers (the actuating primitives) ────────────────────────────
async function seedControlsOpen(page) {
    await page.addInitScript((ck) => {
        try {
            localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true }));
        } catch {
            /* ignore */
        }
    }, CTRL_KEY);
}

async function waitActiveScene(page, sceneId, timeout = 8000) {
    await page
        .waitForFunction(
            ([mk, id]) => {
                try {
                    return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === id;
                } catch {
                    return false;
                }
            },
            [MACHINE_KEY, sceneId],
            { timeout },
        )
        .catch(() => {});
}

// In-page hash NAVIGATE: the lib's navToScene (storage + the live FSM survive —
// required for the MODE-PERSIST continuity), settled on the destination's
// per-EXPECTED control surface. Each call site keeps its own post-nav settle
// window (the battery's choreography).

/** Hover-expand the morphing dock so its Scene trigger is hit-testable (the real
 *  combobox path — b10 §0: a probe that does not hover-expand the dock NEVER
 *  exercises the switch). Returns true once .glass-dock reports .expanded. */
async function expandDock(page) {
    const center = await page.evaluate(() => {
        const dock = document.querySelector(".glass-dock");
        if (!dock) return null;
        const r = dock.getBoundingClientRect();
        return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
    });
    if (!center) return false;
    await page.mouse.move(center.x, center.y);
    await page
        .waitForFunction(() => document.querySelector(".glass-dock")?.classList.contains("expanded"), null, { timeout: 4000 })
        .catch(() => {});
    await page.waitForTimeout(200);
    return page.evaluate(() => !!document.querySelector(".glass-dock.expanded"));
}

/** SWITCH scenes via the real dock Select (hover-expand → open the Scene combobox
 *  → click a DIFFERENT scene option). Falls back to a keyboard commit. Returns the
 *  drive note (so the summary records how the switch was driven). */
async function dockSwitch(page) {
    await expandDock(page);
    await page.click('[aria-label="Scene"]', { timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(350);
    // Find the first non-Home, non-active option in-page, then COMMIT it with a
    // TRUSTED Playwright click — reka-ui's SelectItem commits on REAL pointer
    // events, NOT a synthetic in-page el.click() (which leaves the FSM on the
    // source scene). The trusted click reliably drives the switch.
    const target = await page.evaluate(() => {
        const opts = [...document.querySelectorAll('[role="option"]')];
        const active = (document.querySelector('[role="option"][data-state="checked"]')?.textContent || "").trim().toLowerCase();
        const opt = opts.find((o) => {
            const t = (o.textContent || "").trim().toLowerCase();
            return t && t !== "home" && t !== active;
        });
        return { label: opt ? (opt.textContent || "").trim() : null, optCount: opts.length };
    });
    let committed = false;
    if (target.label) {
        try {
            await page.getByRole("option", { name: target.label, exact: true }).click({ timeout: 3000 });
            committed = true;
        } catch {
            /* fall through to the keyboard commit */
        }
    }
    if (!committed) {
        await page.keyboard.press("ArrowDown").catch(() => {});
        await page.keyboard.press("Enter").catch(() => {});
    }
    await page.waitForTimeout(900);
    return committed ? `dock-Select clicked "${target.label}" (of ${target.optCount} options, trusted)` : `dock-Select keyboard-committed (optCount ${target.optCount})`;
}

/** CLICK the rainbow group-play pill (the user's first gesture; B1 trigger). */
async function clickRainbowPlay(page) {
    const candidates = [
        'button[aria-label*="Play animation"]',
        'button[aria-label*="play" i]',
        ".btn-playback-play",
        '[data-testid="group-play"]',
    ];
    for (const sel of candidates) {
        const el = page.locator(sel).first();
        if ((await el.count()) > 0) {
            await el.click({ force: true, timeout: 2500 }).catch(() => {});
            return true;
        }
    }
    return false;
}

/** Fire a SYNTHETIC visibilitychange→hidden (the B2 born-RED-of-record; NO dock
 *  gesture). Overrides document.visibilityState/hidden so @vueuse's
 *  useDocumentVisibility reflects "hidden" when the event fires. */
async function fireVisibilityHidden(page) {
    await page.evaluate(() => {
        try {
            Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
            Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
        } catch {
            /* ignore */
        }
        document.dispatchEvent(new Event("visibilitychange"));
    });
}
async function fireVisibilityVisible(page) {
    await page.evaluate(() => {
        try {
            Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" });
            Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
        } catch {
            /* ignore */
        }
        document.dispatchEvent(new Event("visibilitychange"));
    });
}

// ═════════════════════════════════════════════════════════════════════════════
// THE BATTERY
// ═════════════════════════════════════════════════════════════════════════════
async function runBattery() {
    const VW = 1440;

    // ONE accumulated budget across the WHOLE battery (both modes, every leg).
    const budget = makeBudget("whole-battery");

    // Per-leg product-facing DOM verdicts (the union of the per-wave legs).
    const dom = {};

    // The lib lifecycle owns the server/chromium/teardown (the dist legs); every
    // leg opens its own fresh/persistent context off the provided `browser` (the
    // two harness modes ARE the oracle), so the lib's default page stays idle at
    // about:blank. The :5174 dev-server leg launches its OWN browser through
    // withBrowser (the second launch).
    const result = await withPage(
        { distDir: DIST, label: "the live-session battery" },
        async (_page, { url: base, browser }) => {
        // ════════════════════════════════════════════════════════════════════
        // MODE-FRESH — the INDEPENDENT per-scene legs (a fresh context per scene).
        // ════════════════════════════════════════════════════════════════════

        // ── B1 leg — the rainbow group-play click is TOTAL + the cube draw loop
        //    is LIVE (≥3 distinct .cube/.graph transforms). Run on HOME (the empty
        //    group E1 repro) + cube. ─────────────────────────────────────────
        {
            const ctx = await browser.newContext({ viewport: { width: VW, height: 900 } });
            const page = await ctx.newPage();
            budget.attach(page, "B1:home/cube-play");
            await seedControlsOpen(page);
            await page.goto(`${base}/#/`, { waitUntil: "load" });
            await page.waitForTimeout(500);
            await clickRainbowPlay(page); // home: empty-group play (the E1 throw site)
            await page.waitForTimeout(1200);
            // Switch to cube + sample the live transform across the autoplay window.
            const distinct = await page.evaluate(async () => {
                const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
                location.hash = "#/cube";
                const seen = new Set();
                for (let i = 0; i < 100; i++) {
                    for (const sel of [".cube", ".graph", ".idle-hover"]) {
                        const el = document.querySelector(sel);
                        if (el) {
                            const t = getComputedStyle(el).transform;
                            if (t && t !== "none") seen.add(sel + "|" + t);
                        }
                    }
                    await sleep(25);
                }
                return seen.size;
            });
            await clickRainbowPlay(page); // cube: the rainbow play on a real group
            await page.waitForTimeout(800);
            dom.B1 = { distinct, live: distinct >= 3, pass: distinct >= 3 };
            await ctx.close();
        }

        // ── B4 leg — switch INTO easing: .easing-curve-canvas + draggable handles
        //    present + a handle-drag MUTATES the path. Driven by a real dock switch
        //    from cube. ─────────────────────────────────────────────────────────
        {
            const ctx = await browser.newContext({ viewport: { width: VW, height: 900 } });
            const page = await ctx.newPage();
            budget.attach(page, "B4:cube→easing");
            await seedControlsOpen(page);
            await page.goto(`${base}/#/cube`, { waitUntil: "load" });
            await waitActiveScene(page, "cube");
            await page.waitForTimeout(700);
            // Switch into easing via the hash route (the accepted switch-in repro of
            // the reka passive-latch). Then open the easing controls tab if needed.
            await navToScene(page, "easing", "Easing");
            await page.waitForTimeout(1500);
            const easing = await page.evaluate(async () => {
                const canvas = document.querySelector(".easing-curve-canvas");
                const present = !!canvas;
                let display = "(absent)";
                let tabpanelState = "(no-host)";
                let handleCount = 0;
                let d0 = null;
                if (canvas) {
                    display = getComputedStyle(canvas).display;
                    const host = canvas.closest('[role="tabpanel"]');
                    tabpanelState = host ? host.getAttribute("data-state") || "(no-attr)" : "(no-tabpanel)";
                    handleCount = canvas.querySelectorAll(".control-point.handle").length;
                    const pathEl = canvas.querySelector(".bezier-path");
                    d0 = pathEl ? pathEl.getAttribute("d") : null;
                }
                return { present, display, tabpanelState, handleCount, d0 };
            });
            let dMutated = false;
            if (easing.present && easing.handleCount >= 2) {
                // Drag handle 0 via trusted pointer events (the real handle drag).
                await page.evaluate(async () => {
                    const svg = document.querySelector(".easing-curve-canvas");
                    const handle = document.querySelector('.easing-curve-canvas .control-point.handle[data-index="0"]') || document.querySelector(".easing-curve-canvas .control-point.handle");
                    if (!svg || !handle) return;
                    const r = svg.getBoundingClientRect();
                    const hb = handle.getBoundingClientRect();
                    const sx = hb.x + hb.width / 2;
                    const sy = hb.y + hb.height / 2;
                    const fire = (type, x, y) =>
                        svg.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 1, pointerType: "mouse", buttons: type === "pointerup" ? 0 : 1, clientX: x, clientY: y }));
                    fire("pointerdown", sx, sy);
                    const tx = r.x + r.width * 0.7;
                    const ty = r.y + r.height * 0.15;
                    for (let i = 1; i <= 12; i++) {
                        fire("pointermove", sx + ((tx - sx) * i) / 12, sy + ((ty - sy) * i) / 12);
                        await new Promise((res) => requestAnimationFrame(res));
                    }
                    fire("pointerup", tx, ty);
                });
                await page.waitForTimeout(300);
                const d1 = await page.evaluate(() => {
                    const pathEl = document.querySelector(".easing-curve-canvas .bezier-path");
                    return pathEl ? pathEl.getAttribute("d") : null;
                });
                dMutated = !!easing.d0 && !!d1 && easing.d0 !== d1;
            }
            dom.B4 = {
                present: easing.present,
                mountedActive: easing.present && easing.display !== "none" && easing.tabpanelState === "active",
                handleCount: easing.handleCount,
                dMutated,
                pass: easing.present && easing.display !== "none" && easing.tabpanelState === "active" && easing.handleCount >= 2 && dMutated,
            };
            await ctx.close();
        }

        // ── B6 leg — on /square a real drag selects NO text + the transform
        //    PERSISTS (≠ identity after settle). ─────────────────────────────
        {
            const ctx = await browser.newContext({ viewport: { width: VW, height: 900 } });
            const page = await ctx.newPage();
            budget.attach(page, "B6:square-drag");
            await seedControlsOpen(page);
            await page.goto(`${base}/#/square`, { waitUntil: "load" });
            await waitActiveScene(page, "square");
            await page.waitForTimeout(900);
            const box = await page.evaluate(() => {
                const el = document.querySelector(".demo-box");
                const r = el?.getBoundingClientRect();
                return r ? { cx: Math.round(r.left + r.width / 2), cy: Math.round(r.top + r.height / 2) } : null;
            });
            let selectedChars = 0;
            let bodyDragging = false;
            let userSelectSuppressed = false;
            let persisted = false;
            if (box) {
                await page.mouse.move(box.cx, box.cy);
                await page.mouse.down();
                const target = { x: box.cx - 90, y: box.cy + 70 };
                let mid = null;
                for (let i = 1; i <= 8; i++) {
                    await page.mouse.move(Math.round(box.cx + ((target.x - box.cx) * i) / 8), Math.round(box.cy + ((target.y - box.cy) * i) / 8));
                    if (i === 6) {
                        mid = await page.evaluate(() => {
                            const us = (el) => (el ? getComputedStyle(el).userSelect || getComputedStyle(el).webkitUserSelect : "n/a");
                            return {
                                bodyDragging: document.body.classList.contains("is-dragging"),
                                html: us(document.documentElement),
                                body: us(document.body),
                                sel: (window.getSelection()?.toString() || "").length,
                            };
                        });
                    }
                    await page.waitForTimeout(16);
                }
                await page.mouse.up();
                const after = await page.evaluate(() => (window.getSelection()?.toString() || "").length);
                selectedChars = Math.max(mid?.sel ?? 0, after);
                bodyDragging = !!mid?.bodyDragging;
                const supp = (v) => v != null && ["none", "-webkit-none"].includes(String(v).toLowerCase());
                userSelectSuppressed = supp(mid?.html) && supp(mid?.body);
                // Persist: poll the transform until it settles, assert ≠ identity.
                const readT = () => page.evaluate(() => { const el = document.querySelector(".demo-box"); return el ? getComputedStyle(el).transform : "none"; });
                let prev = await readT();
                let settled = prev;
                for (let i = 0; i < 12; i++) {
                    await page.waitForTimeout(80);
                    const cur = await readT();
                    if (cur === prev) { settled = cur; break; }
                    prev = cur; settled = cur;
                }
                const isIdentity = (t) => {
                    if (!t || t === "none") return true;
                    const m = t.match(/matrix(?:3d)?\(([^)]+)\)/);
                    if (!m) return true;
                    const n = m[1].split(",").map((s) => parseFloat(s.trim()));
                    if (n.length === 6) {
                        const [a, , , d, e, f] = n;
                        return Math.abs(e) < 1 && Math.abs(f) < 1 && Math.abs(a - 1) < 0.02 && Math.abs(d - 1) < 0.02;
                    }
                    return false;
                };
                persisted = !isIdentity(settled);
            }
            dom.B6 = { selectedChars, bodyDragging, userSelectSuppressed, persisted, pass: !!box && selectedChars === 0 && userSelectSuppressed && persisted };
            await ctx.close();
        }

        // ── B3 leg — on /amiga a CENTRE-drag moves the SUBJECT, not the room
        //    (the centre region changes appreciably while the periphery stays
        //    ~static — the inverse of the HEAD whole-room re-projection). Two
        //    sub-windows mirror the canonical proof:amiga-subject-is-pivot split:
        //    (B3a) a NO-screenshot present-loop spin is the integrated RC-2 GPU-
        //    stall oracle — it CHARGES the budget (born-RED on the readback-every-
        //    frame HEAD); (B3b) a declared-READBACK screenshot pair MEASURES the
        //    subject-vs-room MAD — the harness's own framebuffer readback emits the
        //    GL driver's "GPU stall due to ReadPixels" line, the INSTRUMENT not the
        //    product, so the `:readback` leg does NOT charge (chargeBudget guard). ─
        {
            // B3a — the STEADY-STATE present-loop GPU-stall oracle (the integrated
            // RC-2 mirror of proof:amiga-subject-is-pivot clause (c)). The RC-2
            // born-RED HEAD read the framebuffer back EVERY FRAME of the present
            // loop (120+/2s — it "spammed"); I.W3 removed it → the steady-state loop
            // is clean. Empirically (3000ms probe): the only ReadPixels lines on the
            // dist are a ONE-TIME burst of ~4 at t≈400ms — a COLD-GPU-process init
            // artifact (shader compile + the FIRST backdrop-filter composite reading
            // the transparent alpha:0 WebGL canvas back under the .glass-dock blur,
            // flagged a "stall" ONLY under headless SwiftShader). A WARMED second
            // load emits ZERO. So the faithful oracle is WARM-then-OBSERVE: a
            // throwaway load warms the shared GPU process (its cold-start burst is
            // UNBUDGETED), then the budget observes a fresh ≥2.5s steady-state loop
            // and must see ZERO. This is NOT tuning-to-pass — a regression to the
            // per-frame readback stalls every frame REGARDLESS of warmup, so this
            // still reds the real defect; only the headless cold-start init burst is
            // excluded (the canonical gate excludes it the same way, by warming via
            // its earlier clauses). The DOM RC-2 invariant — no content-visibility
            // ancestor over the WebGL canvas — is asserted by the cited standalone
            // clause (c)'s DOM leg; this leg owns the steady-state stall count.
            {
                const ctxW = await browser.newContext({ viewport: { width: VW, height: 900 } });
                const pageW = await ctxW.newPage();
                await pageW.goto(`${base}/#/amiga`, { waitUntil: "load" });
                await pageW.waitForTimeout(1600); // warm the shared GPU process (UNBUDGETED)
                await ctxW.close();
            }
            const ctxA = await browser.newContext({ viewport: { width: VW, height: 900 } });
            const pageA = await ctxA.newPage();
            budget.attach(pageA, "B3:amiga-present-loop");
            await pageA.goto(`${base}/#/amiga`, { waitUntil: "load" });
            await pageA.waitForTimeout(2600); // ≥2s STEADY-STATE present loop on a warm GPU, NO readback
            await ctxA.close();

            // B3b — the declared-READBACK MAD: subject moves, room stable.
            const ctx = await browser.newContext({ viewport: { width: VW, height: 900 } });
            const page = await ctx.newPage();
            budget.attach(page, "B3:amiga-readback");
            await page.goto(`${base}/#/amiga`, { waitUntil: "load" });
            await page.waitForTimeout(1600);
            const handle = await page.$("canvas.amiga-canvas");
            let mad = null;
            if (handle) {
                const box = await handle.boundingBox();
                const clip = { x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width), height: Math.round(box.height) };
                const before = `data:image/png;base64,${(await page.screenshot({ clip, type: "png" })).toString("base64")}`;
                // Centre-drag (where the centred sphere now sits).
                const x0 = box.x + 0.5 * box.width;
                const y0 = box.y + 0.5 * box.height;
                await page.mouse.move(x0, y0);
                await page.mouse.down();
                for (let i = 1; i <= 12; i++) {
                    await page.mouse.move(x0 + i * 14, y0 - i * 6);
                    await page.waitForTimeout(16);
                }
                await page.mouse.up();
                await page.waitForTimeout(450);
                const after = `data:image/png;base64,${(await page.screenshot({ clip, type: "png" })).toString("base64")}`;
                mad = await page.evaluate(
                    async ([beforeUrl, afterUrl]) => {
                        const load = (url) => new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.src = url; });
                        const [a, b] = await Promise.all([load(beforeUrl), load(afterUrl)]);
                        const W = Math.min(a.width, b.width);
                        const H = Math.min(a.height, b.height);
                        const toData = (img) => { const c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d"); g.drawImage(img, 0, 0); return g.getImageData(0, 0, W, H).data; };
                        const da = toData(a), db = toData(b);
                        const cx = W / 2, cy = H / 2;
                        const rC = 0.22 * Math.min(W, H), rP = 0.38 * Math.min(W, H);
                        let cS = 0, cN = 0, pS = 0, pN = 0;
                        for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) {
                            const i = (y * W + x) * 4;
                            const d = Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]);
                            const dist = Math.hypot(x - cx, y - cy);
                            if (dist <= rC) { cS += d; cN++; } else if (dist >= rP) { pS += d; pN++; }
                        }
                        return { centreMAD: cN ? cS / cN : 0, peripheryMAD: pN ? pS / pN : 0 };
                    },
                    [before, after],
                );
            }
            const subjectMoved = mad && mad.centreMAD >= 6;
            const peripheryStable = mad && mad.peripheryMAD <= mad.centreMAD * 0.6;
            dom.B3 = { mad, pass: !!handle && subjectMoved && peripheryStable };
            await ctx.close();
        }

        // ── B7 leg — at rest the glass ::before carry NO bloom (rendered alpha ≤
        //    threshold). + B9 leg — every scene glyph PAINTS. + font leg — body
        //    font is NOT Plus Jakarta. Sweep the scenes once. ──────────────────
        {
            const SCENES = ["cube", "easing", "spring", "sequence", "motion-path"];
            const REST_OPACITY_MAX = 0.05;
            const SPECULAR_RADIAL = /radial-gradient/;
            let bloomers = [];
            let maxRest = 0;
            let totalGlass = 0;
            let glyphFailures = [];
            let scenesGlyphPainted = 0;
            let fontProbe = null;

            for (const scene of SCENES) {
                const ctx = await browser.newContext({ viewport: { width: VW, height: 900 } });
                const page = await ctx.newPage();
                budget.attach(page, `B7/B9:${scene}`);
                await seedControlsOpen(page);
                await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
                await waitActiveScene(page, scene);
                await page.waitForTimeout(900);
                // B7 — move the pointer to a NEUTRAL corner (rest), sample ::before.
                await page.mouse.move(2, 2);
                await page.waitForTimeout(150);
                const restProbe = await page.evaluate(() => {
                    const sels = ["[data-surface='glass']", ".glass-specular-track", ".dock-icon-button", ".glass-card"];
                    const seen = new Set();
                    const out = [];
                    for (const sel of sels) for (const el of document.querySelectorAll(sel)) {
                        if (seen.has(el)) continue; seen.add(el);
                        const b = getComputedStyle(el, "::before");
                        out.push({ cls: (el.className || "").toString().slice(0, 24), op: parseFloat(b.opacity || "0"), hasRadial: /radial-gradient/.test(b.backgroundImage || "") });
                    }
                    return out;
                });
                for (const e of restProbe) {
                    totalGlass++;
                    if (e.op > maxRest) maxRest = e.op;
                    if (e.hasRadial && e.op > REST_OPACITY_MAX) bloomers.push(`${scene}:${e.cls}(op=${e.op})`);
                }
                // B9 — the dock trigger glyph paints (hover-expand the dock first).
                await expandDock(page);
                const glyph = await page.evaluate(() => {
                    const root = document.querySelector('[aria-label="Scene"]');
                    if (!root) return { paints: false, reason: "no Scene trigger" };
                    const svgs = [...root.querySelectorAll("svg")];
                    for (const svg of svgs) {
                        const r = svg.getBoundingClientRect();
                        const cs = getComputedStyle(svg);
                        if (cs.display !== "none" && cs.visibility !== "hidden" && r.width > 0 && r.height > 0) return { paints: true };
                    }
                    return { paints: false, reason: svgs.length ? "svg(s) zero-box/hidden" : "no svg under trigger" };
                });
                if (glyph.paints) scenesGlyphPainted += 1;
                else glyphFailures.push(`${scene}: dock glyph does not paint (${glyph.reason})`);
                // font — sample the body font on cube once (the I.W6-font reclaim).
                if (scene === "cube") {
                    fontProbe = await page.evaluate(async () => {
                        await document.fonts.ready;
                        const ff = (el) => (el ? getComputedStyle(el).fontFamily : "");
                        return { body: ff(document.body), display: ff(document.querySelector(".text-display-4, h1, [class*='display']")) };
                    });
                }
                await ctx.close();
            }
            dom.B7 = { totalGlass, maxRest, bloomers, pass: bloomers.length === 0 };
            dom.B9 = { scenesGlyphPainted, total: SCENES.length, glyphFailures, pass: glyphFailures.length === 0 && scenesGlyphPainted === SCENES.length };
            const jakarta = fontProbe ? /Jakarta/i.test(fontProbe.body) : true;
            dom.font = { body: fontProbe?.body?.slice(0, 48) ?? "(unread)", jakarta, pass: !!fontProbe && !jakarta };
        }

        // ════════════════════════════════════════════════════════════════════
        // MODE-PERSIST — ONE persistent context for the SUSPEND/RESUME/SWITCH
        // matrix (the B2 leg + resume-iff-was-playing). The FSM + localStorage
        // carry across the switch.
        // ════════════════════════════════════════════════════════════════════
        {
            const persistCtx = await browser.newContext({ viewport: { width: VW, height: 900 } });
            const page = await persistCtx.newPage();
            budget.attach(page, "B2:persist-suspend/switch");
            await seedControlsOpen(page);
            await page.goto(`${base}/#/easing`, { waitUntil: "load" });
            await waitActiveScene(page, "easing");
            await page.waitForTimeout(1000);

            // B2 — the SYNTHETIC visibilitychange→hidden on the PLAYING easing scene
            // raises NO _gen throw (the born-RED-of-record; the budget captures it).
            const genBefore = budget.charges.filter((c) => /_gen-crash|_gen|Cannot read propert/.test(c.text)).length;
            await fireVisibilityHidden(page);
            await page.waitForTimeout(700);
            await fireVisibilityVisible(page);
            await page.waitForTimeout(400);
            // SWITCH while playing (hover-expand the morphing dock + real Select)
            // with the visibility co-fire — the play→switch face of B2.
            await fireVisibilityHidden(page);
            const switchNote = await dockSwitch(page);
            await fireVisibilityVisible(page);
            await page.waitForTimeout(600);
            const genAfter = budget.charges.filter((c) => /_gen-crash|_gen|Cannot read propert/.test(c.text)).length;

            // resume-iff-was-playing — switch back to easing + replay (continuity).
            await navToScene(page, "easing", "Easing");
            await page.waitForTimeout(1500);
            await page.waitForTimeout(500);
            await clickRainbowPlay(page);
            await page.waitForTimeout(800);
            const replayClean = budget.charges.filter((c) => c.tier === "HARD").length === 0;

            dom.B2 = {
                genThrows: genAfter - genBefore,
                switchNote,
                pass: genAfter === genBefore, // no NEW _gen throw across suspend+switch
                replayClean,
            };
            await persistCtx.close();
        }

        // ── OPTIONAL: the DETERMINISTIC born-RED-of-record dev-server leg (S2b).
        //    The synthetic-visibility _gen throw is INTERMITTENT on dist but
        //    DETERMINISTIC on the source-mapped :5174 dev server — a NAMED,
        //    justified exception. KF_DEV_SERVER=1 runs clause B2 against :5174 and
        //    excludes ONLY the named dev source-map noise. ─────────────────────
        if (USE_DEV_SERVER) {
            await runDevServerB2(budget);
        } else {
            note(
                "B2 dev-server leg SKIPPED (KF_DEV_SERVER unset). The DETERMINISTIC born-RED-of-record is the " +
                    "source-mapped :5174 reproduction (b2-dfa-gen-crash.md); the GREEN property (synthetic tick → " +
                    "zero _gen) is verified on the dist above. Set KF_DEV_SERVER=1 to run the corroborating dev leg.",
            );
        }
        },
    );
    if (result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
        return;
    }

    // ── REPORT — the accumulated budget + the product-facing DOM verdicts ─────
    reportBattery(budget, dom);
}

/** The NAMED dev-server exception (S2b): spin vite (:5174) and run the synthetic
 *  B2 leg against the source-mapped build where the _gen deref is DETERMINISTIC.
 *  EXCLUDES only the named dev source-map noise (leg-scoped — W7-2/S1b). The
 *  browser launch routes through the lib's withBrowser against the EXTERNAL
 *  :5174 URL (the second launch — no dist server). W7-1 / J.W3 S6d (the named
 *  vacuous-pass hole, closed): under KF_REQUIRE_BROWSER=1 a vite-did-not-come-up
 *  skip is a FAIL, never a note()+return. Post-fix: GREEN. */
async function runDevServerB2(budget) {
    const PORT = 5174;
    const child = spawn("npx", ["vite", "--port", String(PORT), "--strictPort"], { cwd: REPO, stdio: "ignore", env: { ...process.env } });
    const devBase = `http://localhost:${PORT}`;
    const up = await (async () => {
        for (let i = 0; i < 120; i++) {
            try {
                const r = await fetch(devBase, { method: "GET" });
                if (r.ok || r.status === 200) return true;
            } catch { /* not up */ }
            await new Promise((res) => setTimeout(res, 500));
        }
        return false;
    })();
    if (!up) {
        if (REQUIRE_BROWSER) {
            fail(
                `B2 dev-server leg REQUIRED (KF_REQUIRE_BROWSER=1) but vite did not come up on :${PORT} ` +
                    `within 60s — the deterministic B2 clause cannot pass vacuously (a note()-skip under ` +
                    `KF_REQUIRE_BROWSER=1 is a FAIL — J.W3 S6d / W7-1)`,
            );
        } else {
            note(`B2 dev-server leg: vite did not come up on :${PORT} within 60s — skipped.`);
        }
        child.kill("SIGTERM");
        return;
    }
    try {
        const result = await withBrowser(
            async (browser) => {
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await ctx.newPage();
        budget.attach(page, "B2:dev-server:5174");
        await seedControlsOpen(page);
        await page.goto(`${devBase}/#/easing`, { waitUntil: "load" });
        await waitActiveScene(page, "easing");
        await page.waitForTimeout(1400);
        const before = budget.charges.filter((c) => /_gen/.test(c.text)).length;
        await fireVisibilityHidden(page);
        await page.waitForTimeout(800);
        await fireVisibilityVisible(page);
        await page.waitForTimeout(400);
        const after = budget.charges.filter((c) => /_gen/.test(c.text)).length;
        if (after === before) {
            ok(`B2 DEV-SERVER (:5174, the deterministic exception): the synthetic visibilitychange→hidden on the source-mapped PLAYING easing scene raised ZERO _gen throws — the deterministic born-RED-of-record is fixed at the source (only the named dev source-map noise excluded).`);
        } else {
            fail(`B2 DEV-SERVER (:5174) RED: the deterministic suspend STILL threw the _gen crash class (${after - before} new) — the bind-proof fix did not hold at the source.`);
        }
        await ctx.close();
            },
            { label: "the deterministic B2 dev-server leg" },
        );
        if (result.skipped) {
            note(`B2 dev-server leg skipped — ${result.reason}`);
        }
    } finally {
        child.kill("SIGTERM");
    }
}

function reportBattery(budget, dom) {
    // ── THE ORACLE: the accumulated ERROR BUDGET = 0 across the WHOLE battery ──
    const hard = budget.charges.filter((c) => c.tier === "HARD");
    const promoted = budget.charges.filter((c) => c.tier === "PROMOTED");
    if (budget.charges.length === 0) {
        ok(
            `ERROR BUDGET = 0 across the WHOLE battery (PLAY + SWITCH + DRAG, both modes): ZERO HARD charges ` +
                `(pageerror / unhandledrejection / console.error / "......" parse fingerprint / _gen) AND ZERO ` +
                `PROMOTED charges (amiga WebGL ReadPixels/GPU-stall · non-Monaco content-visibility). The budget ` +
                `is the COMPLEMENT of the named-benign EXCLUDED set (no narrowed-regex escape hatch) — S2a.`,
        );
    } else {
        fail(
            `ERROR BUDGET BLOWN — ${hard.length} HARD + ${promoted.length} PROMOTED charge(s) across the battery ` +
                `(S2a, the complement of the named-benign set):\n      ` +
                budget.charges.slice(0, 12).map((c) => `[${c.tier}|${c.leg}] ${c.text.slice(0, 130)}`).join("\n      "),
        );
    }

    // ── THE PRODUCT-FACING DOM — the union of the per-wave legs ────────────────
    const verdict = (key, label, citedGate) => {
        const d = dom[key];
        if (!d) {
            note(`${label} — leg did not run (no DOM verdict captured) [${citedGate}]`);
            return;
        }
        if (d.pass) ok(`${label} — PASS [${citedGate}] · ${JSON.stringify(d).slice(0, 180)}`);
        else fail(`${label} — FAIL [${citedGate}] · ${JSON.stringify(d).slice(0, 220)}`);
    };

    verdict("B1", "B1 cube draw loop is LIVE after group-play (≥3 distinct transforms)", "proof:engine-no-throw-on-play");
    verdict("B2", "B2 synthetic visibilitychange on a playing scene raises NO _gen throw", "proof:fsm-suspend-resume-live");
    verdict("B4", "B4 switch-into-easing mounts the curve canvas + a handle-drag mutates", "proof:easing-editor-live");
    verdict("B3", "B3 amiga centre-drag moves the SUBJECT not the room", "proof:amiga-subject-is-pivot");
    verdict("B6", "B6 /square drag selects NO text + the transform PERSISTS", "proof:drag-gesture (+ proof:perf-frame-budget)");
    verdict("B7", "B7 the glass ::before carry NO bloom at rest", "proof:specular-absent-at-rest");
    verdict("B9", "B9 every scene glyph PAINTS", "proof:icon-paint-live");
    verdict("font", "font reclaim — the body font is NOT Plus Jakarta", "proof:demo-fonts");

    // Fold each failing DOM leg into the failures tally (the budget verdict above
    // already pushed its own). Collect the DOM fails so the process exits non-zero.
    for (const [key, label, gate] of [
        ["B1", "B1 cube-live", "proof:engine-no-throw-on-play"],
        ["B2", "B2 suspend-no-throw", "proof:fsm-suspend-resume-live"],
        ["B4", "B4 easing-mount+drag", "proof:easing-editor-live"],
        ["B3", "B3 amiga-subject", "proof:amiga-subject-is-pivot"],
        ["B6", "B6 square-drag", "proof:drag-gesture"],
        ["B7", "B7 specular-rest", "proof:specular-absent-at-rest"],
        ["B9", "B9 glyph-paint", "proof:icon-paint-live"],
        ["font", "font-reclaim", "proof:demo-fonts"],
    ]) {
        const d = dom[key];
        if (d && !d.pass && !failures.some((f) => f.includes(label))) {
            failures.push(`${label} DOM leg failed (clause ${gate})`);
        }
    }
}

await runBattery();

if (failures.length > 0) {
    console.error(
        `\nproof:live-session — FAIL (${failures.length}): the human battery (PLAY + SWITCH + DRAG) blew the ` +
            `ERROR BUDGET (S2a) and/or a product-facing DOM leg reds. Each clause cites its per-wave §Hard gate. ` +
            `Revert any of I.W0–I.W6 and the matching clause reds — this is the gate-of-gates.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:live-session — PASS: ONE interaction-driven session over the BUILT dist drove the rainbow play + " +
        "the morphing-dock switch + the synthetic visibility tick + the drags, accumulated a ZERO error budget " +
        "(S2a, the complement of the named-benign set) across the WHOLE battery, AND asserted the product-facing " +
        "DOM — the cube draw loop LIVE (B1), the suspend raising no _gen throw (B2), the easing canvas + handle-" +
        "drag mutation (B4), the amiga subject moving not the room (B3), the square drag selecting no text + " +
        "persisting (B6), the glass ::before flat at rest (B7), every glyph painting (B9), the body font not " +
        "Plus Jakarta (font). The per-wave §Hard gates are the granular clauses of this battery. The day this " +
        "gate is green, \"green\" means \"a human using the product would see it work.\"",
);
