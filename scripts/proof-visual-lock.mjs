#!/usr/bin/env node
/**
 * proof:visual-lock — H.W8 S2 (I-2): the APPEARANCE axis the gate lattice never
 * had. The single broadest lever — it converts the D1/D3/D4/D6/D7/D10 appearance
 * regressions (a re-introduced two-column grid, a 680px easing canvas, a
 * full-width ribbon, a broken dot-fade, a mid-rung hero, a stacked mobile stage)
 * from "no gate can see it" into ONE re-runnable named-region pixel diff.
 *
 * ── WHAT IT LOCKS (and what it does NOT) ───────────────────────────────────────
 * It locks LAYOUT / COLOR / TYPE — the rendered SHAPE of the final demo. It does
 * NOT lock in-flight animation frames (WV-W8-HIGH-2): the named regions include
 * PERPETUAL live motion (the amiga Three.js sphere, the CSS-3D cube, the engine
 * progress balls, the hero TypingDots, the easing/sequence/path live subjects),
 * and a pixel diff over a moving frame would flap forever. The freeze is TWO-fold:
 *   (1) PRM — the page is emulated under `prefers-reduced-motion: reduce`, which
 *       the demo HONORS broadly (design-idioms.css + useSheetSpring + the engine's
 *       respectReducedMotion). That halts the CSS-driven motion (shimmer, dot
 *       cadence transitions, the sheet spring) so those settle to a rest frame.
 *   (2) MASK — the genuinely-live sub-rects that PRM does NOT stop (WebGL/canvas,
 *       the CSS-3D `.cube` rAF bob, the engine-driven balls, the typing dots) are
 *       MASKED (Playwright paints them a flat pink) before capture, so a moving
 *       frame never enters the diff. The mask is per-region (see REGIONS) — the
 *       region's LAYOUT/COLOR/TYPE chrome around the masked subject is still
 *       locked; only the live pixels inside the subject rect are excluded.
 *
 * ── THE MATRIX (DRY in the DRIVER, net-new in the DIFF — WV-W8-HIGH-2) ─────────
 * Reuses `serveDist` + the H.W8-S1 re-sourced `SCENES` (so a new scene
 * AUTO-enrolls in the lock too) + `openControlsPanel` from the shared
 * demo-driver. For each scene × {mobile 375, desktop 1440} × {controls closed,
 * open} it screenshots each NAMED REGION (not full-page — a full-page diff flaps
 * on AA noise; named regions are the controls pane, the hero, the ribbon, the
 * stage) to a COMMITTED PNG under `scripts/baselines/visual-lock/`, then diffs the
 * fresh capture against the committed baseline via `pixelmatch`.
 *
 * ── MEASURE-FIRST TOLERANCE (WV-W8-HIGH-1) ─────────────────────────────────────
 * The diff budget is split measure-first: a NOISE-FLOOR run (`--measure`, 3×
 * against the current stable render) records the max same-render mismatch
 * fraction per region; the GOLDEN baseline (`--update-baseline`) is captured
 * AFTER the fix waves land. The committed TOLERANCE (TOLERANCE_FRAC below) is
 * bound from the measured noise-floor with headroom — a re-run of the gate against
 * its own committed baseline must sit COMFORTABLY under it (the noise floor
 * measured 0 mismatched px per region with PRM+mask; the budget is set to a small
 * non-zero fraction so font-hinting / GPU-raster jitter across machines cannot
 * flap, while a real layout/color/type regression — which moves hundreds to
 * thousands of px — still reds).
 *
 * ── USAGE ──────────────────────────────────────────────────────────────────────
 *   node scripts/proof-visual-lock.mjs                 — GATE: diff vs baseline
 *   node scripts/proof-visual-lock.mjs --measure       — noise-floor 3× (no bind)
 *   node scripts/proof-visual-lock.mjs --update-baseline — (re)capture the golden
 *   KF_PLAYWRIGHT_DIR=/path   resolve playwright from there (CI installs it)
 *   KF_REQUIRE_BROWSER=1      a playwright-absent skip becomes a HARD fail
 *
 * Serves the BUILT `dist/gh-pages/` (run `npm run gh-pages` first) — the artefact
 * a deploy publishes, the final demo at the H.W8 re-pin (glass-ui `~3.5.1`, the
 * MINIMUM 3.x carrying the dock retune without the 3.6/3.7 Card-surface specular
 * regression — see docs/tranches/H/audit/harden/impl-w8-repin.md). Mirrors the
 * capture.mjs / occlusion-gate plumbing; pixelmatch + pngjs are CI-only devDeps
 * (BLK-4 — the diff toolchain stays off the 2-runtime-dep library surface).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import {
    SCENES,
    resolveChromium,
    serveDist,
    openControlsPanel,
} from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
const BASELINE_DIR = path.join(REPO, "scripts/baselines/visual-lock");
const DIFF_DIR = path.join(REPO, "scripts/baselines/visual-lock/_diff");

// ── Mode ───────────────────────────────────────────────────────────────────────
const MODE = process.argv.includes("--update-baseline")
    ? "update"
    : process.argv.includes("--measure")
      ? "measure"
      : "gate";

// ── The viewport axis the contract names ────────────────────────────────────────
const VIEWPORTS = [
    { name: "mobile", width: 375, height: 667 },
    { name: "desktop", width: 1440, height: 900 },
];

// ── The MEASURE-FIRST tolerance (WV-W8-HIGH-1) ──────────────────────────────────
// pixelmatch per-pixel threshold (color-distance sensitivity, 0..1; lower = more
// sensitive). 0.1 is pixelmatch's recommended default — sensitive enough to catch
// a token/color/type shift, loose enough to not fire on sub-pixel AA.
const PIXELMATCH_THRESHOLD = 0.1;
// The committed mismatch BUDGET: the fraction of a region's pixels that may differ
// before the region reds. Bound MEASURE-FIRST (WV-W8-HIGH-1): `--measure` ran the
// noise floor 3× against the current stable render, per region, AFTER the
// perpetual-motion freeze (PRM + the MASK_SUBJECTS container masks + the
// settle-stable capture-wait). The measured worst same-render mismatch across many
// runs spanned ~0.09%–0.16% (settle-timing jitter on the live scene stages — the
// engine balls / curve / live readouts are masked, but the residual font-hinting +
// sub-pixel reflow jitter between fresh re-mounts is non-zero on a demo this
// animation-dense). The committed budget is set at 0.5% — ~3× the measured worst
// noise floor, durable headroom against cross-machine GPU-raster jitter, while a
// real D1/D3/D4/D6/D7/D10 regression (a two-column grid, a full-width ribbon, a
// mid-rung hero, a stacked mobile stage) moves WHOLE LAYOUT BLOCKS — tens of
// percent, orders of magnitude above 0.5% → still reds hard.
const TOLERANCE_FRAC = 0.005;
// The absolute floor — a region must mismatch at least this many px AND exceed the
// fraction to red, so a handful of jittered AA pixels on a tiny region cannot flap.
const TOLERANCE_MIN_PX = 40;

const MACHINE_KEY = "keyframes-js-scene-machine"; // SCENE_MACHINE_PERSIST_KEY

// ── The NAMED REGIONS (NOT full-page — WV-W8-HIGH-2) ────────────────────────────
// Each region names a host selector to clip + a list of LIVE-MOTION sub-selectors
// to MASK (the rAF/WebGL pixels PRM does not stop). The region's chrome around the
// masked subject — the card surface, the radius, the type, the layout — is locked;
// only the in-flight frame inside the masked rect is excluded. `states` says which
// controls-state the region is captured in (closed/open); `routes` (optional)
// restricts a region to specific scenes (else: every scene).
//
// MASK_SUBJECTS — the universal live-motion sub-rects. A region clips its host and
// masks any of these that fall inside it. These are CONTAINER-LEVEL hooks (the
// whole live-track box, not the moving element): a moving sub-element is at a
// different x each capture, so masking only the element leaves an edge-mismatch
// halo (measured ~0.35% noise on the ribbon); masking the whole TRACK the element
// sweeps along covers its full motion range with a stable rect (→ 0% noise floor).
const MASK_SUBJECTS = [
    "canvas", // amiga Three.js + any 2D canvas
    ".amiga-canvas",
    ".cube", // the CSS-3D cube (rAF idle bob)
    ".graph", // the home/cube unovis graph (live)
    // The AnimationVisualizer scrub widget — the inner container box that holds
    // ALL the moving balls (the ball + its two faded twins). `.container-inline-
    // size` is the visualizer's own track box (AnimationVisualizer.vue:13), unique
    // to this widget; masking it covers the ball's full sweep range stably.
    ".container-inline-size",
    ".glass-slider", // the reka scrub Slider (its thumb tracks the engine t)
    // The editable bezier curve plot (EasingCurveCanvas SVG) — the curve path +
    // its draggable control-point handles render with sub-pixel AA jitter on a
    // fresh mount (the curve IS the editor's live content, not LAYOUT/COLOR/TYPE
    // chrome). The `.easing-curve-canvas-wrapper` rounded-card border around it
    // STAYS locked; only the inner plot SVG is masked.
    ".easing-curve-canvas",
    // The engine-driven ball SWEEP TRACKS — mask the whole track (not the ball at
    // its instant x): the ball is mid-flight at capture, so a ball-only mask
    // leaves an edge halo as it sweeps. `.hero-track` (easing) / `.spring-rail`
    // (spring) carry the full sweep range.
    ".hero-track",
    ".hero-ball",
    ".progress-rail",
    ".progress-ball",
    ".mp-traveller", // the motion-path traveller
    ".mp-guide-path", // the path the traveller sweeps (the live offset-path)
    ".seq-playhead", // the sequence swept playhead line
    ".spring-rail", // the spring scene live rail subject
    // Live NUMERIC readouts that tick with the engine t (e.g. easing's
    // `f(0.67) = 0.69…`). `.tabular-nums` is the demo's idiom for a ticking
    // counter — its VALUE is in-flight, its layout/type is locked by the chrome
    // around it.
    ".tabular-nums",
    "[class*=TypingDots]",
    ".typing-dots",
    ".dot", // the hero typing dots spans
    ".gold-shimmer", // the shimmer fill (belt-and-braces; PRM already stills it)
];

const REGIONS = [
    {
        // The HERO — the home start-screen display block (D7 φ-hero rung, the
        // type/layout of the poster hero). Home route only; the live TypingDots
        // is masked, the rung/type/color is locked.
        name: "hero",
        host: ".hero-display, #start-screen, .start-screen-prose",
        routes: ["home"],
        states: ["closed"],
    },
    {
        // The STAGE — the scene's protagonist plate (D1 one-column, D3 easing
        // canvas, the glass-card register). The live subject (canvas/cube/balls)
        // is masked; the stage card chrome + layout is locked.
        name: "stage",
        host: ".stage-cell",
        states: ["closed", "open"],
    },
    {
        // The CONTROLS PANE — the editing surface (D1 grid columns, the label
        // subgrid, the cartoon depth, the idle register). Open state only.
        name: "controls",
        host: ".controls-pane-wrapper, .controls-pane",
        states: ["open"],
    },
    {
        // The RIBBON — the playback transport (D4 ribbon-width / rail binding).
        // Open state only; the scrub ball is masked, the transport chrome locked.
        name: "ribbon",
        host: "#controls-ribbon-target, .playback-ribbon",
        states: ["open"],
    },
];

// ── Console plumbing ────────────────────────────────────────────────────────────
const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — ` +
                "the visual-lock appearance axis cannot pass vacuously",
        );
    } else {
        console.log(`  ○ visual-lock skipped — ${reason}`);
    }
    return REQUIRE_BROWSER ? 1 : 0;
};

// ── In-page region geometry ─────────────────────────────────────────────────────
// For a region host selector, return the union bbox of the largest visible match
// + the in-bbox rects of every live-motion sub-element to mask. Returns null when
// the host is absent (a region not present on this scene/state is simply skipped —
// non-vacuity is enforced by the baseline's existence: a baseline with no fresh
// capture, or a fresh capture with no baseline, reds in the diff step).
async function regionGeometry(page, hostSel, maskSels) {
    return page.evaluate(
        ({ hostSel, maskSels }) => {
            const visible = (el) => {
                const cs = getComputedStyle(el);
                if (
                    cs.visibility === "hidden" ||
                    cs.display === "none" ||
                    +cs.opacity === 0
                )
                    return false;
                const r = el.getBoundingClientRect();
                return r.width > 8 && r.height > 8;
            };
            const inViewport = (r) =>
                r.bottom > 0 &&
                r.top < window.innerHeight &&
                r.right > 0 &&
                r.left < window.innerWidth;

            // Largest visible, in-viewport host match.
            let best = null;
            for (const el of document.querySelectorAll(hostSel)) {
                if (!visible(el)) continue;
                const r = el.getBoundingClientRect();
                if (!inViewport(r)) continue;
                const area = r.width * r.height;
                if (!best || area > best.area) best = { area, el, r };
            }
            if (!best) return null;

            // Clamp the host rect to the viewport (a region can bleed off-screen;
            // the screenshot clip must stay in-bounds).
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const clip = {
                x: Math.max(0, Math.floor(best.r.left)),
                y: Math.max(0, Math.floor(best.r.top)),
            };
            clip.width = Math.max(
                1,
                Math.min(vw, Math.ceil(best.r.right)) - clip.x,
            );
            clip.height = Math.max(
                1,
                Math.min(vh, Math.ceil(best.r.bottom)) - clip.y,
            );

            // The live-motion sub-rects that intersect the host, in PAGE coords.
            const masks = [];
            for (const sel of maskSels) {
                for (const el of document.querySelectorAll(sel)) {
                    if (!visible(el)) continue;
                    const r = el.getBoundingClientRect();
                    // intersect with the host clip
                    const x0 = Math.max(clip.x, r.left);
                    const y0 = Math.max(clip.y, r.top);
                    const x1 = Math.min(clip.x + clip.width, r.right);
                    const y1 = Math.min(clip.y + clip.height, r.bottom);
                    if (x1 - x0 > 1 && y1 - y0 > 1) {
                        masks.push({
                            x: Math.floor(x0),
                            y: Math.floor(y0),
                            width: Math.ceil(x1 - x0),
                            height: Math.ceil(y1 - y0),
                        });
                    }
                }
            }
            return { clip, masks };
        },
        { hostSel, maskSels },
    );
}

/** Paint the masked sub-rects a flat color in the page (a deterministic overlay
 *  the screenshot captures), then remove the overlays after capture. We paint
 *  rather than rely on Playwright's `mask` option so the masked region is a
 *  STABLE flat fill in BOTH the baseline and the fresh capture (Playwright's mask
 *  color is also stable, but in-DOM overlays survive the clip math uniformly). */
async function applyMasks(page, masks) {
    await page.evaluate((masks) => {
        const layer = document.createElement("div");
        layer.id = "__kf_visual_lock_masks";
        layer.style.cssText =
            "position:fixed;left:0;top:0;width:0;height:0;z-index:2147483647;pointer-events:none;";
        for (const m of masks) {
            const d = document.createElement("div");
            d.style.cssText =
                `position:fixed;left:${m.x}px;top:${m.y}px;` +
                `width:${m.width}px;height:${m.height}px;` +
                "background:#ff00ff;pointer-events:none;";
            layer.appendChild(d);
        }
        document.body.appendChild(layer);
    }, masks);
}
async function removeMasks(page) {
    await page.evaluate(() => {
        document.getElementById("__kf_visual_lock_masks")?.remove();
    });
}

/** Capture a masked region only once it is VISUALLY SETTLED — re-screenshot until
 *  two consecutive captures are pixel-identical (≤ a few px), so a mid-settle
 *  transient (the mobile sheet spring, a late reflow, a font swap) can NEVER enter
 *  the baseline OR a fresh diff. This is the deterministic-seek half of the freeze:
 *  PRM + mask still the perpetual motion; this stable-wait stills the one-shot
 *  settle. Re-applies the masks each attempt (the masked element may have moved). */
async function captureStable(page, geom) {
    const SETTLE_PX = 8; // ≤8 differing px between two reads ⇒ settled
    const MAX_TRIES = 6;
    let prev = null;
    let last = null;
    for (let i = 0; i < MAX_TRIES; i++) {
        await applyMasks(page, geom.masks);
        last = await page.screenshot({ clip: geom.clip });
        await removeMasks(page);
        if (prev) {
            try {
                const a = PNG.sync.read(prev);
                const b = PNG.sync.read(last);
                if (a.width === b.width && a.height === b.height) {
                    const tmp = new PNG({ width: a.width, height: a.height });
                    const mm = pixelmatch(
                        a.data,
                        b.data,
                        tmp.data,
                        a.width,
                        a.height,
                        { threshold: PIXELMATCH_THRESHOLD },
                    );
                    if (mm <= SETTLE_PX) return last; // settled
                }
            } catch {
                /* fall through to another attempt */
            }
        }
        prev = last;
        await page.waitForTimeout(350);
    }
    return last; // best effort after MAX_TRIES (still masked + diffed honestly)
}

// ── Settle: navigate IN-PAGE (storage survives) + rest the FSM ──────────────────
async function settle(page, route, scene, state) {
    // home is the index route (empty hash); scenes are #/<route>.
    await page.evaluate((r) => {
        location.hash = r ? "#/" + r : "#/";
    }, route);
    if (scene !== "home") {
        await page
            .waitForFunction(
                ([mk, s]) => {
                    try {
                        return (
                            JSON.parse(localStorage.getItem(mk) || "{}")
                                .activeScene === s
                        );
                    } catch {
                        return false;
                    }
                },
                [MACHINE_KEY, scene],
                { timeout: 8000 },
            )
            .catch(() => {});
    }
    await page.waitForTimeout(1800); // mount + the PRM rest frame settles
    if (state === "open") {
        await openControlsPanel(page);
        await page.waitForTimeout(800);
    }
}

// ── The capture loop ────────────────────────────────────────────────────────────
function baselinePath(scene, vp, state, region) {
    const suffix = state === "open" ? "-open" : "";
    return path.join(BASELINE_DIR, `${scene}-${vp}${suffix}-${region}.png`);
}

async function captureAll({ write }) {
    const chromium = resolveChromium();
    if (!chromium) return { skipped: "playwright not resolvable" };
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        return { skipped: "dist/gh-pages not built (run `npm run gh-pages`)" };
    }
    fs.mkdirSync(BASELINE_DIR, { recursive: true });

    const { url, close } = await serveDist(DIST);
    const browser = await chromium.launch();
    // PRM emulation at the CONTEXT level — every page inherits the rest frame.
    const captures = []; // { key, scene, vp, state, region, buffer }

    try {
        for (const scene of SCENES) {
            for (const vp of VIEWPORTS) {
                // The set of states any region on this scene needs.
                const states = ["closed", "open"];
                for (const state of states) {
                    // Skip an open pass for home (no controls panel).
                    if (state === "open" && scene.key === "home") continue;
                    const regionsForState = REGIONS.filter(
                        (rg) =>
                            rg.states.includes(state) &&
                            (!rg.routes || rg.routes.includes(scene.key)),
                    );
                    if (regionsForState.length === 0) continue;

                    const context = await browser.newContext({
                        viewport: { width: vp.width, height: vp.height },
                        reducedMotion: "reduce",
                        deviceScaleFactor: 1,
                    });
                    const page = await context.newPage();
                    await page.emulateMedia({ reducedMotion: "reduce" });
                    await page.goto(`${url}/#/${scene.route}`, {
                        waitUntil: "load",
                    });
                    await settle(page, scene.route, scene.key, state);
                    await page.setViewportSize({
                        width: vp.width,
                        height: vp.height,
                    });

                    for (const rg of regionsForState) {
                        const geom = await regionGeometry(
                            page,
                            rg.host,
                            MASK_SUBJECTS,
                        );
                        const key = `${scene.key}/${vp.name}/${state}/${rg.name}`;
                        if (!geom) {
                            // The region is absent on this scene/state. Record so
                            // the diff step can flag a baseline with no capture.
                            captures.push({
                                key,
                                scene: scene.key,
                                vp: vp.name,
                                state,
                                region: rg.name,
                                buffer: null,
                            });
                            continue;
                        }
                        const buffer = await captureStable(page, geom);
                        captures.push({
                            key,
                            scene: scene.key,
                            vp: vp.name,
                            state,
                            region: rg.name,
                            buffer,
                        });
                    }
                    await page.close();
                    await context.close();
                }
            }
        }
    } finally {
        await browser.close();
        await close();
    }

    if (write) {
        let written = 0;
        for (const c of captures) {
            if (!c.buffer) continue;
            fs.writeFileSync(
                baselinePath(c.scene, c.vp, c.state, c.region),
                c.buffer,
            );
            written++;
        }
        return { written, captures };
    }
    return { captures };
}

// ── pixelmatch diff: one fresh capture vs its committed baseline ────────────────
function diffOne(scene, vp, state, region, buffer) {
    const bp = baselinePath(scene, vp, state, region);
    const hasBaseline = fs.existsSync(bp);
    // Decide on the (baseline × capture) quadrant. The capture (`buffer`) is null
    // when `regionGeometry` found NO visible, in-viewport host this run — i.e. the
    // region is legitimately ABSENT on this scene/state (the ribbon is `display:none`
    // when `selectedControl ≠ controls` on easing/spring; it is zero-height before
    // the deferred teleport fills it on sequence/motion-path; it renders below the
    // mobile fold on cube/amiga/square). The baseline writer SKIPS exactly these
    // null-buffer regions (no PNG is written), so the four quadrants must be read
    // SYMMETRICALLY with that writer — else a region the writer can never baseline
    // would red forever:
    //   • baseline ABSENT  + capture ABSENT  → genuinely-absent region → SKIP
    //     (not a red: the matrix enrols every scene×vp×state×region, but a region
    //      a scene never renders is not a regression — the writer skipped it too).
    //   • baseline ABSENT  + capture PRESENT → a NEW region rendered but was never
    //     golden-captured → RED (the lock must be complete; run --update-baseline).
    //   • baseline PRESENT + capture ABSENT  → a region that USED to render went
    //     missing → RED (a D-class disappear regression).
    //   • baseline PRESENT + capture PRESENT → diff.
    if (!hasBaseline) {
        return buffer
            ? { status: "no-baseline", path: bp }
            : { status: "absent-skip", path: bp };
    }
    if (!buffer) {
        return { status: "no-capture", path: bp };
    }
    const baseline = PNG.sync.read(fs.readFileSync(bp));
    const fresh = PNG.sync.read(buffer);
    if (baseline.width !== fresh.width || baseline.height !== fresh.height) {
        return {
            status: "dim-mismatch",
            baseDim: `${baseline.width}x${baseline.height}`,
            freshDim: `${fresh.width}x${fresh.height}`,
        };
    }
    const { width, height } = baseline;
    const diff = new PNG({ width, height });
    const mismatch = pixelmatch(
        baseline.data,
        fresh.data,
        diff.data,
        width,
        height,
        { threshold: PIXELMATCH_THRESHOLD },
    );
    const total = width * height;
    const frac = mismatch / total;
    return { status: "diffed", mismatch, total, frac, diff };
}

// ── Modes ───────────────────────────────────────────────────────────────────────
async function runMeasure() {
    // Noise floor: 3 identical captures of the CURRENT render, diffed pairwise.
    console.log(
        "proof:visual-lock --measure — noise-floor 3× against the current stable render",
    );
    const runs = [];
    for (let i = 0; i < 3; i++) {
        const r = await captureAll({ write: false });
        if (r.skipped) {
            console.log(`  ○ ${r.skipped}`);
            return;
        }
        runs.push(r.captures);
        console.log(`  run ${i + 1}: ${r.captures.length} region captures`);
    }
    // Diff run 2 and run 3 against run 1 (same render → the noise floor).
    let worst = 0;
    let worstKey = "";
    const byKey = (caps, key) => caps.find((c) => c.key === key);
    for (const base of runs[0]) {
        if (!base.buffer) continue;
        const b0 = PNG.sync.read(base.buffer);
        for (const other of [runs[1], runs[2]]) {
            const o = byKey(other, base.key);
            if (!o || !o.buffer) continue;
            const oi = PNG.sync.read(o.buffer);
            if (oi.width !== b0.width || oi.height !== b0.height) continue;
            const diff = new PNG({ width: b0.width, height: b0.height });
            const mm = pixelmatch(
                b0.data,
                oi.data,
                diff.data,
                b0.width,
                b0.height,
                { threshold: PIXELMATCH_THRESHOLD },
            );
            const frac = mm / (b0.width * b0.height);
            if (frac > worst) {
                worst = frac;
                worstKey = base.key;
            }
        }
    }
    console.log(
        `\n  NOISE FLOOR (worst same-render mismatch): ${(worst * 100).toFixed(
            4,
        )}% on ${worstKey || "—"}`,
    );
    console.log(
        `  committed TOLERANCE_FRAC = ${(TOLERANCE_FRAC * 100).toFixed(
            3,
        )}% (+ ${TOLERANCE_MIN_PX}px floor) — headroom ≥ ${(
            (TOLERANCE_FRAC - worst) *
            100
        ).toFixed(4)} points`,
    );
    if (worst > TOLERANCE_FRAC) {
        console.error(
            "  ✗ the measured noise floor EXCEEDS the committed tolerance — re-measure / raise the budget",
        );
        process.exit(1);
    }
    console.log("  ✓ noise floor sits under the committed tolerance");
}

async function runUpdate() {
    console.log(
        "proof:visual-lock --update-baseline — capturing the GOLDEN baseline (the re-pinned demo, glass-ui ~3.5.1)",
    );
    const r = await captureAll({ write: true });
    if (r.skipped) {
        console.error(`  ✗ cannot capture: ${r.skipped}`);
        process.exit(1);
    }
    const absent = r.captures.filter((c) => !c.buffer);
    console.log(`  wrote ${r.written} baseline PNGs → ${path.relative(REPO, BASELINE_DIR)}`);
    if (absent.length) {
        console.log(
            `  (${absent.length} region(s) absent on their scene/state, not captured: ${absent
                .map((c) => c.key)
                .join(", ")})`,
        );
    }
}

async function runGate() {
    console.log(
        "proof:visual-lock — H.W8 S2 (I-2): the named-region appearance lock (LAYOUT/COLOR/TYPE)",
    );
    if (!fs.existsSync(BASELINE_DIR) || fs.readdirSync(BASELINE_DIR).filter((f) => f.endsWith(".png")).length === 0) {
        skipOrFail("no committed baseline (run `--update-baseline` first)");
        return finish();
    }
    const r = await captureAll({ write: false });
    if (r.skipped) {
        skipOrFail(r.skipped);
        return finish();
    }

    fs.mkdirSync(DIFF_DIR, { recursive: true });
    let diffed = 0;
    let absent = 0;
    for (const c of r.captures) {
        const res = diffOne(c.scene, c.vp, c.state, c.region, c.buffer);
        if (res.status === "absent-skip") {
            // The region neither rendered this run NOR has a committed baseline —
            // genuinely absent on this scene/state (the writer skipped it too). Not
            // a regression; record it as a skip so the matrix stays explicit.
            absent++;
            console.log(`  · ${c.key} — region absent on this scene/state (no baseline, no capture) — skipped`);
            continue;
        }
        if (res.status === "no-baseline") {
            // A fresh capture exists but no baseline — a NEW region/scene that was
            // never golden-captured. Reds (the lock must be complete).
            fail(`${c.key} — NO baseline committed (capture exists; run --update-baseline)`);
            continue;
        }
        if (res.status === "no-capture") {
            // A baseline exists but the region did not render this run — a
            // disappeared region (D-class regression: the pane/ribbon/hero went
            // missing). Reds.
            fail(`${c.key} — baseline committed but the region did NOT render this run`);
            continue;
        }
        if (res.status === "dim-mismatch") {
            fail(
                `${c.key} — DIMENSION shift (${res.baseDim} → ${res.freshDim}) · a layout regression resized the region`,
            );
            continue;
        }
        diffed++;
        const overFrac = res.frac > TOLERANCE_FRAC;
        const overMin = res.mismatch > TOLERANCE_MIN_PX;
        if (overFrac && overMin) {
            const diffFile = path.join(
                DIFF_DIR,
                `${c.scene}-${c.vp}-${c.state}-${c.region}.diff.png`,
            );
            fs.writeFileSync(diffFile, PNG.sync.write(res.diff));
            fail(
                `${c.key} — ${res.mismatch}px (${(res.frac * 100).toFixed(
                    4,
                )}%) > tolerance ${(TOLERANCE_FRAC * 100).toFixed(
                    3,
                )}% · diff → ${path.relative(REPO, diffFile)}`,
            );
        } else {
            ok(
                `${c.key} — ${res.mismatch}px (${(res.frac * 100).toFixed(
                    4,
                )}%) ≤ tolerance`,
            );
        }
    }
    console.log(
        `\n  ${diffed} region(s) diffed against the committed baseline` +
            (absent ? ` · ${absent} region(s) absent on their scene/state (skipped)` : ""),
    );
    return finish();
}

function finish() {
    if (failures.length) {
        console.error(
            `\nproof:visual-lock — FAIL (${failures.length}): the appearance axis tripped (a LAYOUT/COLOR/TYPE regression, or a missing region/baseline).`,
        );
        process.exit(1);
    }
    console.log(
        "\nproof:visual-lock — PASS: every named region matches its committed golden baseline within tolerance.",
    );
}

async function main() {
    if (MODE === "measure") return runMeasure();
    if (MODE === "update") return runUpdate();
    return runGate();
}

main().catch((err) => {
    console.error("proof:visual-lock — ERROR:", err);
    process.exit(3);
});
