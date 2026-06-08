#!/usr/bin/env node
/**
 * proof:scene-parity — H.W5 §Hard gate (the pertinence + interactivity lock ·
 * WV-W5-LOW-2: structural MEMBERSHIP, not a magic integer).
 *
 * The Discrete (@starting-style) mode was MERGED into the Spring scene as a
 * sub-view in ONE motion (S3): the standalone scene/route/descriptor replaced
 * together, `springLinearStops()` folded from DOUBLE (SpringSidebar.vue:130 +
 * StartingStyleTarget.vue:95) to ONE composable, and the per-mode interactivity
 * floor (S4/S5) makes EVERY surviving mode directly manipulable. This gate
 * asserts those facts STRUCTURALLY (static) + BEHAVIOURALLY (browser).
 *
 * STATIC HALF (always runs — the membership + fold property):
 *
 *   1. NO starting-style ROUTE — `router.ts` declares no `/starting-style` route
 *      and no `name:"starting-style"` (comment-blanked). BITE: re-add the route →
 *      reds. The Discrete merge landed.
 *
 *   2. NO starting-style DESCRIPTOR — `scenes.ts` declares no `id:"starting-style"`
 *      descriptor (comment-blanked). BITE: re-add the descriptor → reds.
 *
 *   3. SURVIVING NEW-MODE SET = {spring, sequence, motion-path} (membership, NOT
 *      "exactly 3"). The three NEW-mode descriptors are present AND no MERGED-AWAY
 *      new mode (starting-style / discrete) survives as a descriptor. BITE: drop
 *      motion-path, or resurrect a discrete descriptor → reds.
 *
 *   4. springLinearStops() — EXACTLY ONE CALL-SITE (the "spring-local fold").
 *      `grep ≤1 springLinearStops(` actual CALL across the spring surface
 *      (comment/prose/template/CSS blanked). Born-RED at 2 (SpringSidebar.vue +
 *      StartingStyleTarget.vue); GREEN at 1 (useSpringLinearStops.ts). NOTE: this
 *      gate does NOT touch springTimingFunction (6×-surfaced, INTENTIONAL — WV-W5-
 *      HIGH-1). BITE: re-inline a second springLinearStops() call → 2 → reds.
 *
 * BROWSER HALF (each surviving mode exposes ≥1 pointer-interactive affordance;
 * settle-gated on the H.W1 FSM resting — the per-mode locks fail on interaction
 * logic, not the D12 route storm. Drives scene switches IN-PAGE via the hash
 * reconcile fixed point the in-app combobox funnels through (switchScene →
 * runSceneSwitch → NAVIGATE), waiting for the machine to rest on the target):
 *
 *   5. proof:motionpath-drag — settle on motion-path; pointer-drag the traveller
 *      toward the path's 50%-length point → the computed `offset-distance` on the
 *      traveller (AND its slider `aria-valuenow`) lands ≈50%. BITE: revert the S4a
 *      drag (the inert traveller had NO pointer handler) → offset-distance never
 *      moves → reds.
 *
 *   6. proof:square-drag — settle on square; a `pointerdown`+move on `.demo-box`
 *      mutates a target ref (the slider `aria-valuetext` = the per-axis spring
 *      `.target`) AND the spring converges (the box `transform` advances toward
 *      the re-seated target over frames). BITE: revert the S5 drag (the dead
 *      `<div>heyyyy`) → no handler → the target/transform never move → reds.
 *
 *   7. proof:easing-curve-onstage — settle on easing; the stage renders
 *      `EasingCurveCanvas[editable]` (the `.easing-stage-curve` host, NOT the
 *      sidebar) AND a handle drag FIRES `update:bezierPoints` AND the bound
 *      `bezierControlPoints` ref CHANGES — the THREE-NAME wiring (WV-W5-HIGH-2:
 *      emit `update:bezierPoints` camelCase → prop `bezierPoints` → demo ref
 *      `bezierControlPoints`). Observed via the handle `cx/cy` + the rendered
 *      `.bezier-path` `d` shifting after the drag (both re-derive from the ref).
 *      BITE: imprison the curve in the sidebar (the pre-S4 state) → no on-stage
 *      editable host → reds; a mis-named handler silently no-ops → the ref never
 *      changes → reds.
 *
 * Mirrors scripts/proof-easing-canvas-bounded.mjs / proof-scene-machine-
 * irrefragable.mjs (serveDist + Playwright + the FSM-settle plumbing + the
 * KF_REQUIRE_BROWSER skipOrFail). Browser-only clauses serve the BUILT
 * dist/gh-pages/ (run `npm run gh-pages` first). Under KF_REQUIRE_BROWSER a
 * playwright-absent skip becomes a hard fail so the per-mode interactivity floor
 * is never green-reported un-exercised. Re-runnable:
 * `node scripts/proof-scene-parity.mjs`.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");

// Blank /* … */ + // … comments so a scene's OWN doc-comment (which names the
// merged-away `starting-style` mode + the former 2-call springLinearStops in
// PROSE) does NOT count as a live route/descriptor/call. Mirrors proof:idioms /
// proof:icon-idiom `blankComments`.
const blankComments = (s) =>
    s
        .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
        .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length));

// Blank HTML/Vue <!-- … --> comments (the template prose) so a template comment
// naming `springLinearStops()` is not a call-site, and a `<!-- starting-style -->`
// note is not a descriptor.
const blankHtmlComments = (s) =>
    s.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "));

console.log("proof:scene-parity — H.W5 (the pertinence merge + the per-mode interactivity floor)");

// ── STATIC HALF ──────────────────────────────────────────────────────────────
const scenesSrc = blankComments(read(path.join(DEMO, "app/scenes.ts")));
const routerSrc = blankComments(read(path.join(DEMO, "app/router.ts")));

// 1. NO starting-style ROUTE.
{
    const hasPath = /["'`]\/starting-style\b/.test(routerSrc);
    const hasName = /\bname:\s*["']starting-style["']/.test(routerSrc);
    if (!hasPath && !hasName) {
        ok(
            `no starting-style route — router.ts declares no /starting-style path ` +
                `and no name:"starting-style" (the Discrete merge landed in one motion)`,
        );
    } else {
        fail(
            `no starting-style route — router.ts STILL declares a starting-style ` +
                `route (path:${hasPath}, name:${hasName}); the Discrete (@starting-style) ` +
                `mode is a Spring sub-view now, not its own route (H.W5.S3)`,
        );
    }
}

// 2. NO starting-style DESCRIPTOR.
{
    const hasDescriptor = /\bid:\s*["']starting-style["']/.test(scenesSrc);
    if (!hasDescriptor) {
        ok(
            `no starting-style descriptor — scenes.ts declares no ` +
                `id:"starting-style" (merged into the Spring scene as a sub-view)`,
        );
    } else {
        fail(
            `no starting-style descriptor — scenes.ts STILL declares an ` +
                `id:"starting-style" descriptor; the Discrete mode must be a Spring ` +
                `sub-view, not a standalone descriptor (H.W5.S3)`,
        );
    }
}

// 3. SURVIVING NEW-MODE SET = {spring, sequence, motion-path} (membership).
{
    // The descriptor ids declared in scenes.ts (the `id: "<name>"` keys).
    const declaredIds = new Set();
    for (const m of scenesSrc.matchAll(/\bid:\s*["']([^"']+)["']/g)) declaredIds.add(m[1]);

    const NEW_MODE_SURVIVORS = ["spring", "sequence", "motion-path"];
    // The new modes that were MERGED AWAY / KILLED and must NOT survive as a
    // descriptor (WV-W5-LOW-2: a resurrected discrete mode reds).
    const NEW_MODE_FORBIDDEN = ["starting-style", "discrete"];

    const missing = NEW_MODE_SURVIVORS.filter((id) => !declaredIds.has(id));
    const resurrected = NEW_MODE_FORBIDDEN.filter((id) => declaredIds.has(id));

    if (missing.length === 0 && resurrected.length === 0) {
        ok(
            `surviving new-mode set = {spring, sequence, motion-path} — all three ` +
                `present, no merged-away mode (starting-style/discrete) resurrected ` +
                `(structural membership, NOT a magic integer)`,
        );
    } else {
        if (missing.length > 0) {
            fail(
                `surviving new-mode set — MISSING descriptor(s): ${missing.join(", ")} ` +
                    `(the survivor set must be {spring, sequence, motion-path})`,
            );
        }
        if (resurrected.length > 0) {
            fail(
                `surviving new-mode set — a merged-away mode resurfaced as a ` +
                    `descriptor: ${resurrected.join(", ")} (Discrete is a Spring sub-view, ` +
                    `not its own mode, H.W5.S3)`,
            );
        }
    }
}

// 4. springLinearStops() — EXACTLY ONE CALL-SITE across the spring surface.
{
    // The spring surface = demo/spring/ + any demo/.vue/.ts that could call it.
    // A CALL-site is `springLinearStops(` in LIVE code (comments + template/CSS
    // prose blanked). The composable useSpringLinearStops.ts holds the ONE call;
    // SpringSidebar.vue / StartingStyleTarget.vue now CONSUME the composable
    // (they NAME it in prose/template only). springTimingFunction is NOT counted
    // (WV-W5-HIGH-1: 6×-surfaced, intentional).
    const SKIP_DIR = new Set(["dist", "node_modules", ".git"]);
    const collect = (dir, out = []) => {
        if (!fs.existsSync(dir)) return out;
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
            if (e.isDirectory()) {
                if (SKIP_DIR.has(e.name)) continue;
                collect(path.join(dir, e.name), out);
            } else if (/\.(ts|vue)$/.test(e.name)) {
                out.push(path.join(dir, e.name));
            }
        }
        return out;
    };
    const CALL = /\bspringLinearStops\s*\(/g;
    const callSites = [];
    for (const abs of collect(DEMO)) {
        const raw = read(abs);
        // For a .vue file a `springLinearStops()` CALL can ONLY live in the
        // <script> block — a `<span>springLinearStops() → CSS</span>` or an
        // `eased by springLinearStops()` caption is TEMPLATE TEXT prose, NOT a
        // call (the function is never invoked there). So restrict the .vue search
        // to the <script> body; .ts files (the composable) search the whole body.
        // Comments (TS/JS + CSS /* */ + HTML <!-- -->) are blanked either way.
        let searchable;
        if (abs.endsWith(".vue")) {
            const scriptBlocks = [...raw.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
                .map((m) => m[1])
                .join("\n");
            searchable = blankComments(scriptBlocks);
        } else {
            searchable = blankComments(blankHtmlComments(raw));
        }
        for (const m of searchable.matchAll(CALL)) {
            const line = searchable.slice(0, m.index).split("\n").length;
            callSites.push(`${path.relative(REPO, abs)} (#${line} in searched body)`);
        }
    }
    if (callSites.length === 1) {
        ok(
            `springLinearStops() spring-local fold — EXACTLY 1 call-site ` +
                `(${callSites[0]}); the former 2 (SpringSidebar + StartingStyleTarget) ` +
                `folded into the one composable (WV-W5-HIGH-1; springTimingFunction ` +
                `NOT gated — intentional)`,
        );
    } else if (callSites.length === 0) {
        fail(
            `springLinearStops() spring-local fold — ZERO call-sites found (expected ` +
                `EXACTLY 1 in the composable); the artifact source vanished — the fold ` +
                `removed the call rather than centralizing it`,
        );
    } else {
        fail(
            `springLinearStops() spring-local fold — ${callSites.length} call-sites ` +
                `(expected EXACTLY 1): ${callSites.join(", ")}. Fold every consumer onto ` +
                `the ONE useSpringLinearStops composable (born-RED at 2: SpringSidebar.vue ` +
                `+ StartingStyleTarget.vue, WV-W5-HIGH-1)`,
        );
    }
}

// ── BROWSER HALF (the per-mode interactivity floor) ──────────────────────────
const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — the ` +
                "per-mode interactivity locks (motionpath-drag · square-drag · " +
                "easing-curve-onstage) cannot pass vacuously",
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

function serveDist() {
    return http.createServer((req, res) => {
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
}

/** Drive a scene switch through the EXACT reconcile fixed point the in-app
 *  combobox funnels through (switchScene → runSceneSwitch → NAVIGATE → the
 *  echo-guarded writer): an IN-PAGE hash assignment (NOT page.goto — storage +
 *  the H.W1 trap survive). Wait for the machine's activeScene to REST on the
 *  target (proof:scene-machine-irrefragable green is the prerequisite), then a
 *  settle window. Re-assert the viewport (Playwright resets on navigate).  */
async function settleOnScene(page, sceneId, vw, vh, settleMs = 1400) {
    await page.evaluate((s) => {
        location.hash = "#/" + s;
    }, sceneId);
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
            { timeout: 8000 },
        )
        .catch(() => {});
    await page.setViewportSize({ width: vw, height: vh });
    await page.waitForTimeout(settleMs);
}

/** Wait until a selector mounts with real area (not a mid-mount 0×0). */
async function waitVisible(page, selector, timeout = 8000) {
    return page
        .waitForFunction(
            (sel) => {
                const el = document.querySelector(sel);
                if (!el) return false;
                const r = el.getBoundingClientRect();
                return r.width > 0 && r.height > 0;
            },
            selector,
            { timeout },
        )
        .then(() => true)
        .catch(() => false);
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

    const VW = 1440;
    const VH = 900;
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage({ viewport: { width: VW, height: VH } });
        await page.goto(`${base}/#/cube`, { waitUntil: "load" });
        // Let the app + machine boot on a real scene before the first switch.
        await page.waitForTimeout(800);

        // ── 5. proof:motionpath-drag ─────────────────────────────────────────
        await settleOnScene(page, "motion-path", VW, VH);
        const mpReady = await waitVisible(page, ".mp-traveller");
        const guideReady = await waitVisible(page, ".mp-guide-path");
        if (!mpReady || !guideReady) {
            fail(
                `motionpath-drag — the motion-path stage did not mount ` +
                    `(.mp-traveller:${mpReady}, .mp-guide-path:${guideReady}); the FSM may ` +
                    `not have rested on motion-path`,
            );
        } else {
            // The 50%-length point on the guide path, in CLIENT coords. The
            // traveller's CSS offset-path shares this `d`, so the path's midpoint
            // IS where offset-distance:50% positions the traveller — we drag the
            // traveller TO that client point and the projector snaps to ~50%.
            const target = await page.evaluate(() => {
                const path = document.querySelector(".mp-guide-path");
                const stage = document.querySelector(".mp-stage");
                const traveller = document.querySelector(".mp-traveller");
                if (!path || !stage || !traveller) return null;
                const total = path.getTotalLength();
                const half = path.getPointAtLength(total * 0.5); // SVG user units
                const sr = stage.getBoundingClientRect();
                const svg = path.ownerSVGElement;
                const vb = svg.viewBox.baseVal; // 0 0 VIEW VIEW
                // user → client: the guide SVG fills the stage box.
                const cx = sr.left + ((half.x - vb.x) / vb.width) * sr.width;
                const cy = sr.top + ((half.y - vb.y) / vb.height) * sr.height;
                const tr = traveller.getBoundingClientRect();
                return {
                    fromX: tr.left + tr.width / 2,
                    fromY: tr.top + tr.height / 2,
                    toX: cx,
                    toY: cy,
                };
            });
            if (!target) {
                fail("motionpath-drag — could not project the path's 50% point to client coords");
            } else {
                // A real pointer drag: down on the traveller, move toward the
                // path midpoint over several steps, up.
                await page.mouse.move(target.fromX, target.fromY);
                await page.mouse.down();
                const STEPS = 12;
                for (let i = 1; i <= STEPS; i++) {
                    const t = i / STEPS;
                    await page.mouse.move(
                        target.fromX + (target.toX - target.fromX) * t,
                        target.fromY + (target.toY - target.fromY) * t,
                    );
                    await page.waitForTimeout(16);
                }
                await page.mouse.up();
                await page.waitForTimeout(200);

                const probe = await page.evaluate(() => {
                    const t = document.querySelector(".mp-traveller");
                    const ariaNow = Number(t?.getAttribute("aria-valuenow"));
                    const od = getComputedStyle(t).offsetDistance; // "50%" / "200px" / ""
                    // Parse offset-distance as a percent if expressed as %.
                    let odPct = null;
                    if (od && od.trim().endsWith("%")) odPct = parseFloat(od);
                    return { ariaNow, od, odPct };
                });

                // The drag projects the pointer onto the nearest path length; at
                // the path midpoint that is ~50%. Accept a generous ±12% band (the
                // self-crossing loop's nearest-point search + the sampling step).
                const ariaOk = Number.isFinite(probe.ariaNow) && Math.abs(probe.ariaNow - 50) <= 12;
                const odOk = probe.odPct === null || Math.abs(probe.odPct - 50) <= 12;
                if (ariaOk && odOk) {
                    ok(
                        `motionpath-drag — dragging the traveller to the path's 50% point ` +
                            `landed offset-distance ≈ 50% (aria-valuenow ${probe.ariaNow}%, ` +
                            `computed offset-distance "${probe.od}") — the S4a drag scrubs ` +
                            `offset-distance directly`,
                    );
                } else {
                    fail(
                        `motionpath-drag — the traveller drag did NOT land ≈50% ` +
                            `(aria-valuenow ${probe.ariaNow}%, computed offset-distance ` +
                            `"${probe.od}"); the inert traveller (no S4a pointer handler) ` +
                            `never moves offset-distance`,
                    );
                }
            }
        }

        // ── 6. proof:square-drag ─────────────────────────────────────────────
        await settleOnScene(page, "square", VW, VH);
        const sqReady = await waitVisible(page, ".demo-box");
        if (!sqReady) {
            fail(
                `square-drag — the .demo-box did not mount; the FSM may not have ` +
                    `rested on square`,
            );
        } else {
            const before = await page.evaluate(() => {
                const box = document.querySelector(".demo-box");
                return {
                    valuetext: box.getAttribute("aria-valuetext") || "",
                    transform: getComputedStyle(box).transform,
                    rect: (() => {
                        const r = box.getBoundingClientRect();
                        return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
                    })(),
                };
            });
            // pointerdown on the box, then drag a healthy offset so the per-axis
            // spring targets re-seat (the offset / TRAVEL=110px → a clamped
            // [-1,1] target ≠ 0). HOLD the drag at the offset so the springs keep
            // chasing the re-seated target while we sample the convergence window
            // (release re-seats to rest → the transform would unwind).
            await page.mouse.move(before.rect.cx, before.rect.cy);
            await page.mouse.down();
            for (let i = 1; i <= 10; i++) {
                await page.mouse.move(
                    before.rect.cx + 9 * i,
                    before.rect.cy + 7 * i,
                );
                await page.waitForTimeout(16);
            }
            // Poll the INLINE style.transform (the authoritative per-frame spring-
            // loop write — getComputedStyle can catch the loop mid-frame at rest)
            // over a window: capture the target-ref valuetext when it first leaves
            // rest, and the SEQUENCE of inline transforms to witness convergence.
            const HOLD_SAMPLES = 14; // ~14 × 50ms ≈ 700ms — ample for response 0.32
            let valuetextDuring = before.valuetext;
            const transforms = [];
            for (let k = 0; k < HOLD_SAMPLES; k++) {
                const snap = await page.evaluate(() => {
                    const box = document.querySelector(".demo-box");
                    return {
                        valuetext: box.getAttribute("aria-valuetext") || "",
                        // The inline write is the spring loop's truth; fall back to
                        // computed if (somehow) inline is empty.
                        transform: box.style.transform || getComputedStyle(box).transform,
                    };
                });
                if (
                    valuetextDuring === before.valuetext &&
                    snap.valuetext !== before.valuetext
                ) {
                    valuetextDuring = snap.valuetext;
                }
                transforms.push(snap.transform);
                await page.waitForTimeout(50);
            }
            await page.mouse.up();
            await page.waitForTimeout(120);

            const during = { valuetext: valuetextDuring };
            // (a) the target ref mutated — the aria-valuetext (= spring .target)
            //     changed from its rest "x 0.00, y 0.00".
            const targetMutated =
                during.valuetext !== before.valuetext &&
                !/x 0\.00,\s*y 0\.00/.test(during.valuetext);
            // (b) the spring converged — the box transform LEFT the rest pose AND
            //     ADVANCED over the hold window (≥2 distinct non-rest transforms
            //     proves the live spring loop chased the re-seated target, not a
            //     one-shot paint). Rest = "none" / "" / identity matrix.
            const isRest = (t) =>
                !t ||
                t === "none" ||
                /^matrix\(1,\s*0,\s*0,\s*1,\s*0,\s*0\)$/.test(t) ||
                /translate\(0px,\s*0px\)\s*scale\(1\)/.test(t);
            const nonRest = transforms.filter((t) => !isRest(t));
            const distinctNonRest = new Set(nonRest).size;
            const movedFromRest = nonRest.length > 0;
            const keptConverging = distinctNonRest >= 2;

            if (targetMutated && movedFromRest && keptConverging) {
                ok(
                    `square-drag — pointerdown+move on .demo-box mutated the per-axis ` +
                        `spring target (aria-valuetext "${before.valuetext}" → ` +
                        `"${during.valuetext}") AND the spring converged (the box transform ` +
                        `advanced from the rest pose under the live spring loop) — the S5 ` +
                        `drag+SpringProgress floor`,
                );
            } else {
                fail(
                    `square-drag — the drag did not (target ref mutated:${targetMutated} ` +
                        `[${before.valuetext} → ${during.valuetext}], transform moved from ` +
                        `rest:${movedFromRest}, kept converging:${keptConverging} ` +
                        `[${distinctNonRest} distinct non-rest transforms over the hold ` +
                        `window]); the dead <div>heyyyy (no S5 pointer handler) never ` +
                        `re-seats a target or converges`,
                );
            }
        }

        // ── 7. proof:easing-curve-onstage (the three-name wiring) ────────────
        await settleOnScene(page, "easing", VW, VH);
        // Default curve "ease" ∈ NAMED_EASING_BEZIER + viewMode "singular" → the
        // editable EasingCurveCanvas renders ON STAGE (.easing-stage-curve), not
        // imprisoned in the sidebar.
        const stageCurveReady = await waitVisible(page, ".easing-stage-curve");
        if (!stageCurveReady) {
            fail(
                `easing-curve-onstage — the stage did not render EasingCurveCanvas ` +
                    `[editable] (.easing-stage-curve absent); the curve is still imprisoned ` +
                    `in the sidebar (the pre-S4 state) or the FSM did not rest on easing`,
            );
        } else {
            const onStageEditable = await page.evaluate(() => {
                const stage = document.querySelector(".easing-stage-curve");
                // [editable] proof: the draggable control-point handles render
                // (they only exist when editable && bezierPoints).
                const handle = stage.querySelector(".control-point.handle[data-index='0']");
                const bezierPath = stage.querySelector(".bezier-path");
                if (!handle || !bezierPath) return null;
                const hr = handle.getBoundingClientRect();
                return {
                    hasHandle: true,
                    handleCx: handle.getAttribute("cx"),
                    handleCy: handle.getAttribute("cy"),
                    pathD: bezierPath.getAttribute("d"),
                    drag: {
                        x: hr.left + hr.width / 2,
                        y: hr.top + hr.height / 2,
                    },
                };
            });
            if (!onStageEditable) {
                fail(
                    `easing-curve-onstage — the on-stage canvas is not EDITABLE (no ` +
                        `.control-point.handle / .bezier-path); the editable handles render ` +
                        `only when editable && bezierPoints — the stage-promotion (S4b) is ` +
                        `incomplete`,
                );
            } else {
                // Drag handle[0] downward-right by a visible delta. The canvas
                // handler hit-tests within 0.08 SVG units of the handle, so the
                // pointerdown must land ON the handle's screen position.
                const dx = 60;
                const dy = 60;
                await page.mouse.move(onStageEditable.drag.x, onStageEditable.drag.y);
                await page.mouse.down();
                for (let i = 1; i <= 10; i++) {
                    await page.mouse.move(
                        onStageEditable.drag.x + (dx / 10) * i,
                        onStageEditable.drag.y + (dy / 10) * i,
                    );
                    await page.waitForTimeout(16);
                }
                await page.mouse.up();
                await page.waitForTimeout(200);

                const after = await page.evaluate(() => {
                    const stage = document.querySelector(".easing-stage-curve");
                    const handle = stage.querySelector(
                        ".control-point.handle[data-index='0']",
                    );
                    const bezierPath = stage.querySelector(".bezier-path");
                    return {
                        handleCx: handle?.getAttribute("cx"),
                        handleCy: handle?.getAttribute("cy"),
                        pathD: bezierPath?.getAttribute("d"),
                    };
                });

                // The THREE-NAME proof (WV-W5-HIGH-2): a handle drag FIRES
                // `update:bezierPoints` → `demo.updateBezierPoints` writes the
                // `bezierControlPoints` ref → the canvas re-derives the handle
                // cx/cy + the path `d` FROM that ref. So a CHANGE in the handle
                // position AND the rendered path `d` proves the emit reached the
                // ref (a mis-named handler would silently no-op → no change).
                const handleMoved =
                    after.handleCx !== onStageEditable.handleCx ||
                    after.handleCy !== onStageEditable.handleCy;
                const pathChanged = after.pathD !== onStageEditable.pathD;

                if (handleMoved && pathChanged) {
                    ok(
                        `easing-curve-onstage — the stage renders EasingCurveCanvas` +
                            `[editable] AND a handle drag FIRED update:bezierPoints AND the ` +
                            `bound bezierControlPoints ref CHANGED (handle ` +
                            `(${onStageEditable.handleCx},${onStageEditable.handleCy}) → ` +
                            `(${after.handleCx},${after.handleCy}); the .bezier-path d ` +
                            `re-derived) — the three-name wiring holds (emit ` +
                            `update:bezierPoints → prop bezierPoints → ref bezierControlPoints)`,
                    );
                } else {
                    fail(
                        `easing-curve-onstage — the handle drag did NOT propagate ` +
                            `(handle moved:${handleMoved}, path d changed:${pathChanged}); a ` +
                            `mis-named handler (the camelCase emit update:bezierPoints vs a ` +
                            `kebab/typo'd listener) silently no-ops, so the bezierControlPoints ` +
                            `ref never changes (WV-W5-HIGH-2)`,
                    );
                }
            }
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
        `\nproof:scene-parity — FAIL (${failures.length}): the pertinence merge / ` +
            `springLinearStops fold / per-mode interactivity floor regressed (H.W5 ` +
            `§Hard gate).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:scene-parity — PASS: starting-style is merged away (no route/descriptor), " +
        "the survivor new-mode set is {spring, sequence, motion-path}, springLinearStops() " +
        "is computed in exactly ONE composable, and every surviving mode exposes a pointer-" +
        "interactive affordance (motionpath-drag · square-drag · easing-curve-onstage).",
);
