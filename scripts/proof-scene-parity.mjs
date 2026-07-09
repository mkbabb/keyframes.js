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
 *   3. SURVIVING NEW-MODE SET = {spring, sequence} (membership, NOT "exactly N").
 *      The NEW-mode descriptors are present AND no MERGED-AWAY / PRUNED new mode
 *      (starting-style / discrete / motion-path / morph) survives as a descriptor.
 *      BITE: drop a survivor, or resurrect a pruned descriptor → reds.
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
 *   (5. proof:motionpath-drag was RETIRED at T.E3 — the motion-path scene was
 *      PRUNED, OD-1 = PRUNE.)
 *
 *   6. proof:square-drag — settle on square; a `pointerdown`+move on `.demo-box`
 *      mutates a target ref (the slider `aria-valuetext` = the per-axis spring
 *      `.target`) AND the spring converges (the box `transform` advances toward
 *      the re-seated target over frames). BITE: revert the S5 drag (the dead
 *      `<div>heyyyy`) → no handler → the target/transform never move → reds.
 *
 *   7. proof:easing-curve-editable (sidebar) — settle on easing (it opens on
 *      its Curve facet, item-7a); the facet body renders the glass-ui
 *      `EasingPicker` (T.E8 — the hand-rolled EasingCurveCanvas/handle stack is
 *      DELETED with the instrument/easing cluster) AND a REAL page.mouse handle
 *      drag mutates the picker's curve path AND the authored edit LANDS in the
 *      demo (the gallery header literal re-derives from `bezierControlPoints`
 *      through the EasingSidebar onPickerChange → demo.updateBezierPoints
 *      seam). The interactivity FLOOR (you CAN edit the curve) survives the
 *      cluster deletion — asserted on the vendor surface.
 *      BITE: unmount the picker → no editable curve anywhere → reds; a broken
 *      emission seam silently no-ops → the header literal never changes → reds.
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * resolveChromium + context/teardown, J.W3 S1) + navToScene (the per-EXPECTED-
 * state scene settle). Browser-only clauses serve the BUILT dist/gh-pages/ (run
 * `npm run gh-pages` first). Under KF_REQUIRE_BROWSER a playwright-absent skip
 * becomes a hard fail AT THE LIB SEAM so the per-mode interactivity floor is
 * never green-reported un-exercised. Re-runnable:
 * `node scripts/proof-scene-parity.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, withPage } from "./lib/demo-driver.mjs";

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
const scenesSrc = blankComments(read(path.join(DEMO, "app/scene/scenes.ts")));
const routerSrc = blankComments(read(path.join(DEMO, "app/scene/router.ts")));

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

// 3. SURVIVING NEW-MODE SET = {spring, sequence} (membership). The motion-path
//    (+ morph) new-mode scenes were PRUNED at T.E3 (OD-1 = PRUNE).
{
    // The descriptor ids declared in scenes.ts (the `id: "<name>"` keys).
    const declaredIds = new Set();
    for (const m of scenesSrc.matchAll(/\bid:\s*["']([^"']+)["']/g)) declaredIds.add(m[1]);

    const NEW_MODE_SURVIVORS = ["spring", "sequence"];
    // The new modes that were MERGED AWAY / KILLED / PRUNED and must NOT survive as
    // a descriptor (WV-W5-LOW-2: a resurrected discrete mode reds; T.E3 pruned
    // motion-path + morph).
    const NEW_MODE_FORBIDDEN = ["starting-style", "discrete", "motion-path", "morph"];

    const missing = NEW_MODE_SURVIVORS.filter((id) => !declaredIds.has(id));
    const resurrected = NEW_MODE_FORBIDDEN.filter((id) => declaredIds.has(id));

    if (missing.length === 0 && resurrected.length === 0) {
        ok(
            `surviving new-mode set = {spring, sequence} — both ` +
                `present, no merged-away/pruned mode (starting-style/discrete/motion-path/morph) ` +
                `resurrected (structural membership, NOT a magic integer)`,
        );
    } else {
        if (missing.length > 0) {
            fail(
                `surviving new-mode set — MISSING descriptor(s): ${missing.join(", ")} ` +
                    `(the survivor set must be {spring, sequence})`,
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
const CTRL_KEY = "animation-groups-control-options-store"; // controlOptionsStore

/** Drive a scene switch through the EXACT reconcile fixed point the in-app
 *  combobox funnels through (switchScene → runSceneSwitch → NAVIGATE → the
 *  echo-guarded writer): the lib's navToScene (an IN-PAGE hash assignment —
 *  NOT page.goto, storage + the H.W1 trap survive — settled on the
 *  destination's per-EXPECTED control surface; expectedTrigger null = the
 *  destination renders NO control panel). Then a settle window. Re-assert the
 *  viewport (Playwright resets on navigate).  */
async function settleOnScene(page, sceneId, expectedTrigger, vw, vh, settleMs = 1400) {
    await navToScene(page, sceneId, expectedTrigger, { timeout: 8000 });
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

/** Open a FRESH page settled on #/easing so the easing TabsContent's full-rail
 *  SIDEBAR mounts (mirrors proof:easing-stage-is-ball's settleOnEasing +
 *  proof:easing-canvas-bounded). The editable easing curve lives in the SIDEBAR
 *  after W10.G4 (the stage is the ball — proof:easing-stage-is-ball), and that
 *  sidebar mounts only when the easing tab is ACTIVE. reka activates it via
 *  EasingScene.vue's onMounted+nextTick re-assert, which fires on a FRESH mount —
 *  an IN-PAGE hash switch (settleOnScene) does NOT trigger it (the tab-init race),
 *  and after the earlier clauses cycled the shared page through square
 *  the reka Tabs state is sticky so even a same-page reload lands on `controls`.
 *  So clause 7 runs on its OWN page (the ball gate's idiom — that gate's page only
 *  ever visits easing): goto(#/easing), wait for the FSM to rest, re-assert the
 *  viewport, open the controls pane + easing tab in the store, settle ≥900ms. The
 *  caller closes the page. base = the served origin (no hash). */
async function freshEasingPage(browser, base, vw, vh) {
    const page = await browser.newPage({ viewport: { width: vw, height: vh } });
    await page.goto(`${base}/#/easing`, { waitUntil: "load" });
    // navToScene re-asserts the hash + waits for the FSM to rest on easing AND
    // the easing control surface to project (the per-EXPECTED settle — easing
    // opens on its Curve facet since item-7a, so the trigger reads "Curve").
    await navToScene(page, "easing", "Curve", { timeout: 8000 });
    await page.setViewportSize({ width: vw, height: vh });
    await page.evaluate((ck) => {
        try {
            const s = JSON.parse(localStorage.getItem(ck) || "{}");
            s.isControlsPanelOpen = true;
            s.selectedControl = "easing";
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
    await page.waitForTimeout(900); // the easing tab mount + the grid reflow
    return page;
}

async function browserHalf() {
    const VW = 1440;
    const VH = 900;
    const result = await withPage(
        {
            distDir: DIST,
            label:
                "the per-mode interactivity locks (square-drag · " +
                "easing-curve-onstage)",
            context: { viewport: { width: VW, height: VH } },
        },
        async (page, { url, browser }) => {
        const base = url;
        await page.goto(`${base}/#/cube`, { waitUntil: "load" });
        // Let the app + machine boot on a real scene before the first switch.
        await page.waitForTimeout(800);

        // (clause 5 proof:motionpath-drag was RETIRED at T.E3 — the motion-path
        //  scene was PRUNED, OD-1 = PRUNE.)

        // ── 6. proof:square-drag ─────────────────────────────────────────────
        // (square's dock control trigger reads "Controls" — the built-in triad)
        await settleOnScene(page, "square", "Controls", VW, VH);
        const sqReady = await waitVisible(page, ".demo-box");
        if (!sqReady) {
            fail(
                `square-drag — the .demo-box did not mount; the FSM may not have ` +
                    `rested on square`,
            );
        } else {
            // S.A0: the per-axis spring readout MOVED off the box onto its two
            // sr-only `role="slider"` children (the P.W5/W6 + R.W5 a11y split —
            // the box is `role="group"`; each axis slider carries `aria-valuetext`
            // "x 0.00" / "y 0.00"). Reading `box.getAttribute("aria-valuetext")`
            // returned "" on both sides of the drag — the gate red on its own
            // staleness while the drag genuinely re-seated + converged. Read the
            // axis sliders and join them into the same "x …, y …" shape the rest
            // predicate below expects.
            const readValuetext = () =>
                page.evaluate(() => {
                    const box = document.querySelector(".demo-box");
                    const axes = [...box.querySelectorAll('[role="slider"][aria-valuetext]')];
                    if (axes.length > 0) {
                        return axes.map((a) => a.getAttribute("aria-valuetext")).join(", ");
                    }
                    // The pre-split shape (a valuetext directly on the box) is
                    // still honoured.
                    return box.getAttribute("aria-valuetext") || "";
                });
            const before = await page.evaluate(() => {
                const box = document.querySelector(".demo-box");
                return {
                    transform: getComputedStyle(box).transform,
                    rect: (() => {
                        const r = box.getBoundingClientRect();
                        return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
                    })(),
                };
            });
            before.valuetext = await readValuetext();
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
                    const axes = [...box.querySelectorAll('[role="slider"][aria-valuetext]')];
                    return {
                        valuetext:
                            axes.length > 0
                                ? axes.map((a) => a.getAttribute("aria-valuetext")).join(", ")
                                : box.getAttribute("aria-valuetext") || "",
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

        // ── 7. proof:easing-curve-editable (sidebar) — the three-name wiring ──
        //
        // T.E8 (the easing TERMINAL batch) — the editable curve is the glass-ui
        // EasingPicker (the Curve facet body; the hand-rolled EasingCurveCanvas +
        // DemoControlPoint stack is DELETED). The clause asserts the SAME
        // interactivity FLOOR on the vendor surface: the picker mounts visible
        // with ≥2 draggable handles, a REAL page.mouse drag mutates its curve
        // path, AND the edit lands in the demo (the gallery header literal
        // re-derives from the bezierControlPoints ref through the
        // EasingSidebar → demo.updateBezierPoints seam). Runs on its OWN fresh
        // page, closed at the clause's end.
        {
        const page = await freshEasingPage(browser, base, VW, VH);
        try {
        const pickerReady = await page
            .waitForFunction(
                () => {
                    const picker = document.querySelector('[data-testid="easing-picker"]');
                    if (!picker) return false;
                    const r = picker.getBoundingClientRect();
                    const handles = [...picker.querySelectorAll("svg circle")].filter(
                        (c) => /cursor/.test(c.getAttribute("style") || ""),
                    );
                    return r.width > 40 && r.height > 40 && handles.length >= 2;
                },
                { timeout: 8000 },
            )
            .then(() => true)
            .catch(() => false);
        if (!pickerReady) {
            fail(
                "easing-curve-editable (Curve facet) — the glass-ui EasingPicker did not " +
                    "mount visible with its two draggable handles (the T.E8 sole edit " +
                    "surface); the Curve facet may not be selected or the FSM did not rest",
            );
        } else {
            const beforeState = await page.evaluate(() => {
                const picker = document.querySelector('[data-testid="easing-picker"]');
                const h = [...picker.querySelectorAll("svg circle")].filter((c) =>
                    /cursor/.test(c.getAttribute("style") || ""),
                )[0];
                const r = h.getBoundingClientRect();
                return {
                    drag: { x: r.x + r.width / 2, y: r.y + r.height / 2 },
                    pathD: [...picker.querySelectorAll("svg path")]
                        .map((p) => p.getAttribute("d"))
                        .join("|"),
                    headerLiteral:
                        document
                            .querySelector(".specimen-literal .literal-text")
                            ?.textContent?.trim() ?? null,
                };
            });
            await page.mouse.move(beforeState.drag.x, beforeState.drag.y);
            await page.mouse.down();
            for (let i = 1; i <= 10; i++) {
                await page.mouse.move(
                    beforeState.drag.x + 6 * i,
                    beforeState.drag.y + 6 * i,
                );
                await page.waitForTimeout(16);
            }
            await page.mouse.up();
            await page.waitForTimeout(250);
            const afterState = await page.evaluate(() => {
                const picker = document.querySelector('[data-testid="easing-picker"]');
                return {
                    pathD: [...picker.querySelectorAll("svg path")]
                        .map((p) => p.getAttribute("d"))
                        .join("|"),
                    headerLiteral:
                        document
                            .querySelector(".specimen-literal .literal-text")
                            ?.textContent?.trim() ?? null,
                };
            });
            const pathChanged = afterState.pathD !== beforeState.pathD;
            const landed =
                !!afterState.headerLiteral &&
                afterState.headerLiteral !== beforeState.headerLiteral &&
                /^cubic-bezier\(/.test(afterState.headerLiteral);
            if (pathChanged && landed) {
                ok(
                    "easing-curve-editable (Curve facet) — the vendor EasingPicker is the " +
                        "editable curve: a REAL handle drag mutated the curve path AND the " +
                        `authored quad landed in the demo (header literal → ${afterState.headerLiteral}) ` +
                        "— the emission seam (onPickerChange → updateBezierPoints → " +
                        "bezierControlPoints) holds",
                );
            } else {
                fail(
                    "easing-curve-editable (Curve facet) — the handle drag did NOT propagate " +
                        `(picker path changed:${pathChanged}, header literal ` +
                        `${JSON.stringify(beforeState.headerLiteral)} → ` +
                        `${JSON.stringify(afterState.headerLiteral)}); the vendor emission → ` +
                        "demo seam silently no-ops",
                );
            }
        }
        } finally {
            await page.close(); // the fresh clause-7 easing page
        }
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
        `\nproof:scene-parity — FAIL (${failures.length}): the pertinence merge / ` +
            `springLinearStops fold / per-mode interactivity floor regressed (H.W5 ` +
            `§Hard gate).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:scene-parity — PASS: starting-style is merged away (no route/descriptor), " +
        "the survivor new-mode set is {spring, sequence}, springLinearStops() " +
        "is computed in exactly ONE composable, and every surviving mode exposes a pointer-" +
        "interactive affordance (square-drag · easing-curve-editable on the " +
        "glass-ui EasingPicker — the T.E8 Curve facet body; the drawer is the stage).",
);
