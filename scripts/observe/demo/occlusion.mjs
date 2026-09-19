#!/usr/bin/env node
/**
 * occlusion-gate — the scripted Playwright occlusion gate (B inv δ: no page
 * occludes on any viewport).
 *
 * For every page × {375, 1280, 1440} × {controls: closed, open} it asserts,
 * against the BUILT `dist/gh-pages/` (the artefact a deploy publishes):
 *   1. NO horizontal viewport overflow (`document.scrollWidth <= innerWidth`);
 *   2. every scene's SUBJECT renders, with a non-zero rect inside the
 *      viewport bounds — so "occlusion-free because the page is BLANK" (the
 *      W0 false-green for amiga/square/easing/spring) cannot pass; and
 *   3. NO dock overlaps the subject's CONTENT RECT — a HARD failing assertion
 *      (C.W1 S2). The B-shipped gate computed this overlap but downgraded it
 *      to a console note; C promotes it to `failures` so a dock covering a
 *      non-`dockFloatAllowed` scene's content turns the gate RED. The genuine
 *      tension (a full-bleed canvas legitimately permits an edge-floating
 *      dock) is resolved by the per-scene `dockFloatAllowed` manifest flag
 *      (amiga = true; cube/home/square/easing/spring = false), NOT a blanket
 *      exemption.
 *
 * The CONTROLS-OPEN axis (C.W1 S2): docks genuinely occlude only in the
 * editing state. The gate runs BOTH `controls: closed` and `controls: open`;
 * the open pass drives each scene into its editing state via
 * `openControlsPanel` (shared driver) before probing. The open pass is gated
 * behind `KF_CAPTURE_OPEN_PANEL` — set `KF_CAPTURE_OPEN_PANEL=1` when the
 * heavier open-state matrix is required.
 *
 * The per-scene SUBJECT MANIFEST + the open-panel driver live in
 * `scripts/lib/demo-driver.mjs`, single-sourced with the π capture harness
 * (the subject the occlusion gate fits in-bounds is the subject the π gate
 * paints).
 *
 * EXCLUSIONS (recorded so a future reader does not read them as a missed
 * regression): the cube's `div.axis-line.{x,y,z}` are decorative 3D guide
 * lines that extend toward the vanishing point — they are clipped by the
 * scene's `overflow` and excluded from the subject/overflow checks; only the
 * named scene subjects are gated.
 *
 * Harness: the lib lifecycle (withBrowser, J.W3 S1 — not withPage: the matrix
 * needs a FRESH browser.newPage per combo so localStorage cannot leak). Under
 * KF_REQUIRE_BROWSER a chromium-absent start FAILS at the lib seam (W7-1).
 * Exit 1 on any occlusion finding.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
    SCENES,
    serveDist,
    openControlsPanel,
    withBrowser,
} from "../../lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
// The roster driver supplies a wipe-immune snapshot and its already-running
// static server.  Honor that seam here as well as in withPage: this gate uses
// withBrowser directly because it needs a fresh page per matrix cell.  When
// run standalone, retain the canonical deploy artefact and local server.
const SHARED_DIST_DIR = process.env.KF_SHARED_DIST_DIR;
const SHARED_DIST_URL = process.env.KF_SHARED_DIST_URL;
const DIST = SHARED_DIST_DIR ?? path.join(REPO, "dist/gh-pages");

const VIEWPORTS = [
    { name: "mobile", width: 375, height: 667 },
    { name: "laptop", width: 1280, height: 800 },
    { name: "desktop", width: 1440, height: 900 },
];

// The controls axis. The open pass is gated behind KF_CAPTURE_OPEN_PANEL (the
// W0 convention) — the editing state is where docks genuinely occlude, so inv δ
// must be proven there, but the drive is heavier (a per-scene store-seed +
// reload), so it is opt-in unless the caller sets the environment flag.
const RUN_OPEN = !!process.env.KF_CAPTURE_OPEN_PANEL;
const CONTROL_STATES = RUN_OPEN ? ["closed", "open"] : ["closed"];

// In-page probe: horizontal overflow, the subject rect, and the dock bands.
// The dock↔subject overlap is computed in Node (so the gate can apply the
// per-scene `dockFloatAllowed` + content-rect logic uniformly).
const PROBE = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const overflowX = document.documentElement.scrollWidth - vw;

    const visible = (el) => {
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity === 0)
            return false;
        const r = el.getBoundingClientRect();
        return r.width > 8 && r.height > 8;
    };

    // Dock bands — the rects the overlap test runs against. Target the actual
    // VISIBLE dock chrome (`.glass-dock` is `fit-content` — a centered pill),
    // NOT the `fixed left-0 right-0` positioning wrapper (whose bounding box
    // spans the full viewport even though only the centered pill paints). Using
    // the wrapper's full-width box would over-fire on every tall card that
    // reaches the bottom edge; the pill is what actually occludes.
    const docks = [
        ...document.querySelectorAll(".glass-dock, [class*=menubar], [class*=top-dock]"),
    ]
        .filter(visible)
        .map((el) => {
            const r = el.getBoundingClientRect();
            return {
                left: Math.round(r.left),
                top: Math.round(r.top),
                right: Math.round(r.right),
                bottom: Math.round(r.bottom),
            };
        });

    return { vw, vh, overflowX, docks };
};

// Largest visible, in-viewport subject rect (mirrors the shared subjectRect,
// inlined here so a single page.evaluate returns subject + docks together).
const SUBJECT_PROBE = (sel) => {
    const vh = window.innerHeight;
    const visible = (el) => {
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity === 0)
            return false;
        const r = el.getBoundingClientRect();
        return r.width > 8 && r.height > 8;
    };
    let best = null;
    for (const el of document.querySelectorAll(sel)) {
        if (!visible(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        const area = r.width * r.height;
        if (!best || area > best.area) {
            best = {
                area,
                rect: {
                    x: Math.round(r.x),
                    y: Math.round(r.y),
                    w: Math.round(r.width),
                    h: Math.round(r.height),
                    right: Math.round(r.right),
                    bottom: Math.round(r.bottom),
                },
            };
        }
    }
    return best ? best.rect : null;
};

// Does ANY dock COVER the subject's content rect? The audit named the real
// class as "covers the subject's content rect, not just its center point"
// (plan-fidelity 2) — so this graduates the B-shipped focal-CENTER-only test
// to a content-RECT measure: a dock occludes when it covers the subject's
// focal center OR covers ≥ COVERAGE_THRESHOLD of the subject's area. A dock
// pill that merely GRAZES the bottom edge of a tall card (the intended
// floating layout) covers neither the center nor a meaningful fraction, so it
// does not fire; a dock sitting over the cube/hero target does. `inject` is a
// test-only synthetic dock rect for the bite test.
const COVERAGE_THRESHOLD = 0.35;
function dockOverlapsContentRect(subjectRect, docks, inject = null) {
    if (!subjectRect) return false;
    const s = subjectRect;
    const sLeft = s.x;
    const sTop = s.y;
    const sRight = s.right;
    const sBottom = s.bottom;
    const cx = s.x + s.w / 2;
    const cy = s.y + s.h / 2;
    const subjectArea = Math.max(1, s.w * s.h);
    const all = inject ? [...docks, inject] : docks;
    for (const d of all) {
        const ix = Math.max(0, Math.min(sRight, d.right) - Math.max(sLeft, d.left));
        const iy = Math.max(0, Math.min(sBottom, d.bottom) - Math.max(sTop, d.top));
        if (ix <= 1 || iy <= 1) continue; // no real overlap on this dock
        // Covers the focal center the user looks at?
        const coversCenter =
            cx >= d.left && cx <= d.right && cy >= d.top && cy <= d.bottom;
        // Or covers a meaningful fraction of the content rect?
        const coverageFraction = (ix * iy) / subjectArea;
        if (coversCenter || coverageFraction >= COVERAGE_THRESHOLD) return true;
    }
    return false;
}

async function main() {
    if (!SHARED_DIST_URL && !fs.existsSync(path.join(DIST, "index.html"))) {
        console.error("occlusion observation — FAIL: dist/gh-pages not built (run `npm run gh-pages`).");
        process.exit(2);
    }

    // A synthetic dock-over-subject rect can be injected for the bite test
    // (KF_OCCLUSION_INJECT=<sceneKey> reddens that scene in the open state).
    const injectScene = process.env.KF_OCCLUSION_INJECT ?? null;

    const failures = [];
    console.log(
        `occlusion observation — inv δ (no page occludes on any viewport)` +
            ` [controls: ${CONTROL_STATES.join(", ")}]`,
    );
    if (!RUN_OPEN) {
        console.log(
            "  ○ controls-open axis skipped — set KF_CAPTURE_OPEN_PANEL=1 to run it" +
                " (the open state is where docks genuinely occlude).",
        );
    }

    const result = await withBrowser(
        async (browser) => {
            const server = SHARED_DIST_URL ? null : await serveDist(DIST);
            const url = SHARED_DIST_URL ?? server.url;
            try {
    for (const scene of SCENES) {
        for (const vp of VIEWPORTS) {
            for (const controls of CONTROL_STATES) {
                const page = await browser.newPage({
                    viewport: { width: vp.width, height: vp.height },
                });
                // MR1 PB-2 — per scene × viewport × controls-state, an uncaught
                // pageerror reds this cell (the blank-demo crash class keyed on
                // `pageerror`, not `console.error` — R2-04 AV-1). Attached before
                // goto so a load-time crash is captured.
                const pageErrors = [];
                page.on("pageerror", (err) =>
                    pageErrors.push(
                        String(err && err.message ? err.message : err)
                            .split("\n")[0]
                            .trim(),
                    ),
                );
                try {
                    await page.goto(`${url}/#/${scene.route}`, { waitUntil: "load" });
                    await page.waitForTimeout(2500);

                    if (controls === "open") {
                        // Drive into the editing state — the one state where a
                        // dock can cover the subject's content (C.W1 S2).
                        await openControlsPanel(page);
                    }

                    const env = await page.evaluate(PROBE);
                    const subject = await page.evaluate(SUBJECT_PROBE, scene.subjectSelector);
                    const tag = `${scene.key}/${vp.name}/${controls}`.padEnd(24);

                    const local = [];
                    if (pageErrors.length > 0)
                        local.push(
                            `pageerror during mount: ${[...new Set(pageErrors)].slice(0, 2).join(" | ")}`,
                        );
                    if (env.overflowX > 1)
                        local.push(`horizontal overflow +${env.overflowX}px`);
                    if (!subject)
                        local.push(`subject ABSENT (blank ≠ occlusion-free)`);
                    else {
                        if (subject.right > env.vw + 1 || subject.x < -1)
                            local.push(
                                `subject clips the viewport (x ${subject.x}..${subject.right} vs 0..${env.vw})`,
                            );
                        // The subject must be roughly CENTERED — its center x
                        // within the central 70% of the viewport. This is what
                        // bites on the cube clip: a 3D subject's layout box can
                        // be tiny but its CENTER betrays the jam. SKIPPED for a
                        // SWEEPING subject (easing's hero ball) whose x IS the
                        // animation value (currentEasingFn(progress) * maxX) — it
                        // TRAVERSES the full stage by design, so a static centering
                        // check is inappropriate + flaky (it would pass/fail by the
                        // capture phase). The render + dock-occlusion checks below
                        // still bite (the ball must exist + not be dock-covered).
                        const cx = subject.x + subject.w / 2;
                        if (!scene.sweepingSubject && (cx < 0.15 * env.vw || cx > 0.85 * env.vw))
                            local.push(
                                `subject is jammed against an edge (center x ${Math.round(cx)} = ${Math.round((100 * cx) / env.vw)}% of vw, want 15–85%)`,
                            );

                        // HARD dock-over-content assertion (C.W1 S2). A dock
                        // covering a non-`dockFloatAllowed` scene's content rect
                        // is the real occlusion the audit named — promote it
                        // from the B-shipped advisory note to a `failures` push.
                        // A test-only synthetic dock (KF_OCCLUSION_INJECT) is
                        // added for the open-state bite test.
                        const inject =
                            controls === "open" && injectScene === scene.key
                                ? {
                                      left: subject.x - 4,
                                      top: subject.y - 4,
                                      right: subject.right + 4,
                                      bottom: subject.bottom + 4,
                                  }
                                : null;
                        const covered = dockOverlapsContentRect(subject, env.docks, inject);
                        if (covered && !scene.dockFloatAllowed) {
                            local.push(
                                `dock covers the subject's CONTENT RECT (real occlusion; scene is not dockFloatAllowed)`,
                            );
                        }
                    }

                    if (local.length === 0) {
                        const floatNote =
                            subject &&
                            scene.dockFloatAllowed &&
                            dockOverlapsContentRect(subject, env.docks)
                                ? " (dockFloatAllowed: a dock floats over the full-bleed canvas — intended)"
                                : "";
                        console.log(
                            `  ✓ ${tag} subject ${subject.w}×${subject.h} in-bounds, no overflow, no content occlusion${floatNote}`,
                        );
                    } else {
                        for (const m of local) {
                            console.error(`  ✗ ${tag} ${m}`);
                            failures.push(`${tag.trim()}: ${m}`);
                        }
                    }
                } finally {
                    await page.close();
                }
            }
        }
    }

            } finally {
                await server?.close();
            }
        },
        { label: "the occlusion matrix (inv δ)" },
    );
    if (result.skipped) {
        console.log(`occlusion observation — SKIP: ${result.reason}. In CI this is an install step, not a skip.`);
        return;
    }

    if (failures.length > 0) {
        console.error(`\nocclusion observation — FAIL (${failures.length}): inv δ violated.`);
        process.exit(1);
    }
    console.log(
        `\nocclusion observation — PASS: every observed scene × viewport × controls-state is occlusion-free ` +
            `(controls: ${CONTROL_STATES.join(", ")}).`,
    );
}

main().catch((err) => {
    console.error("occlusion observation — ERROR:", err);
    process.exit(3);
});
