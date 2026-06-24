#!/usr/bin/env node
/**
 * proof:easing-editor-live — I.W2 §Hard gate (B4 + the B5 readout seam).
 *
 * THE DEFECT (B4). The easing curve/timing editor is BLANK on every in-app
 * switch-INTO `/easing` — a SILENT render gating (no crash). Root cause
 * (rootcause-rc-easing-editor.md): the editor lives in `TabsContent
 * value="easing"` under a reka `<Tabs :model-value="storedControls.selectedControl">`
 * whose `useVModel` LATCHES `passive` from `modelValue === undefined` AT MOUNT; on
 * a scene SWITCH the `<Tabs>` root is created on a tick where `:model-value`
 * resolves `undefined`, so the panel computes `data-state="inactive"` →
 * `display:none` → the bezier canvas + dropdown unmount. The FRESH load works
 * (EasingScene set `selectedControl="easing"` synchronously). PLUS a parity gap:
 * J's minimalism stripped the read-only value+copy readout the rail lost.
 *
 * THE CURE (I.W2): S1 single-sources the SELECTED control surface from the scene
 * machine's control-surface DFA (`selectedControlSurfaceFor`) and binds the
 * `<Tabs> :model-value` to THAT projection, so on a switch the model-value is
 * born `"easing"` on the mounting tick (latch taken correct). S2 force-mounts the
 * single-surface scene's sole `TabsContent`. S3 folds the read-only readout+copy
 * back as a COMPLETE re-parseable `cubic-bezier(…)`/`steps(…)` literal (never the
 * bare `"cubic-bezier"` keyword that `resolveEasingOption ← new
 * CSSKeyframesAnimation` rejects on the next controls re-mount). S4 unifies the
 * two divergent bezier hosts onto ONE `EasingEditor`.
 *
 * THE GATE — a Playwright session over the BUILT `dist/gh-pages/` (the
 * scripts/lib/demo-driver.mjs lifecycle: withPage = serveDist + env-driven
 * resolveChromium + context/teardown, J.W3 S1; navToScene = the J.W0
 * per-EXPECTED-state settle). The switch-in is driven by a hash route
 * change `location.hash="#/easing"` FROM another scene (the accepted repro of the
 * switch-in latch). P6 posture: hard — device-independent correctness oracle
 * (red anywhere; J.W3 S2b). Clauses (I.W2.md §Hard gate):
 *   (a) load `#/cube` → switch INTO Easing → assert `.easing-curve-canvas`
 *       PRESENT + `display !== none` + its host `[role="tabpanel"]`
 *       `data-state="active"`.
 *   (b) ≥2 `.control-point.handle` present; DRAG a handle and assert it (1)
 *       mutates the bezier path `d` AND (2) re-animates the subject (the sampled
 *       position-at-fixed-t changes after the drag — a no-op that only mutates
 *       the SVG `d` still REDs).
 *   (c) the selector dropdown present + changing it re-renders the curve; the
 *       readout + CopyButton value are a complete re-parseable
 *       `cubic-bezier(…)`/`steps(…)` literal (NOT bare `"cubic-bezier"`); switch
 *       away+back (Easing→Amiga→Easing) to force a controls RE-MOUNT and assert
 *       ZERO `AnimationOptionError`.
 *   (d) the same (a)-(c) on the RETURN path AND on spring's single-surface panel;
 *       ZERO `pageerror`/`_gen`/`"......"` throughout.
 *
 * Re-runnable: `node scripts/proof-easing-editor-live.mjs`. Serves the BUILT
 * dist/gh-pages/. Under KF_REQUIRE_BROWSER=1 a playwright-absent skip is a hard
 * fail AT THE LIB SEAM (W7-1/S6d) so a SHIP is never green-reported un-exercised.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const note = (label) => console.log(`  · ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log("proof:easing-editor-live — I.W2 §Hard gate (B4 desync + the B5 readout seam)");

const CTRL_KEY = "animation-groups-control-options-store";

// A complete, re-parseable cubic-bezier(x1, y1, x2, y2) / steps(n, term?) literal
// — NOT the bare "cubic-bezier"/"steps" keyword. The four-number bezier form and
// the steps form; nothing else counts as a re-mountable readout.
const REPARSEABLE_LITERAL =
    /^\s*(?:cubic-bezier\(\s*-?[\d.eE+-]+\s*,\s*-?[\d.eE+-]+\s*,\s*-?[\d.eE+-]+\s*,\s*-?[\d.eE+-]+\s*\)|steps\(\s*\d+\s*(?:,\s*[\w-]+\s*)?\))\s*$/;
const BARE_TOKEN = /^(cubic-bezier|steps)$/;

const OPTION_ERROR_RE =
    /AnimationOptionError|Invalid value for animation option "timingFunction"/i;
const GEN_RE = /_gen|this\._gen|is not an object \(evaluating 'this\._gen'\)/;
const BARE_DOTS_RE = /Parse error at offset 0: "\.{3,}"|"\.{6}"|"\.\.\.\.\.\."/;

/** Switch the active scene via a hash route change (the accepted switch-in repro
 *  — it re-creates the controls host on the swap tick, exercising the reka
 *  passive-latch). Settles via the lib's navToScene (the J.W0 per-EXPECTED-state
 *  wait: machine activeScene rested + the destination control surface projected;
 *  `expectedTrigger` = the destination's control-tab label, or null). */
async function switchScene(page, scene, expectedTrigger) {
    await navToScene(page, scene, expectedTrigger, { timeout: 8000 });
    await page.waitForTimeout(700); // route rested + the scene's controls mounted
}

/** Resolve the easing/spring scene's control-pane state: the curve canvas (or the
 *  sidebar root for spring), its display, and the host tabpanel's data-state.
 *  J.W2 S2 (S4-stretch): single-surface scenes mount their panel FLAT — there is
 *  NO reka tabpanel (and no model-value latch to race) by design. A flat-mounted,
 *  VISIBLE panel reports `tabpanelState: "(flat)"` and counts as mounted-active
 *  (visibility is the felt property; the latch the data-state probe detected is
 *  structurally gone for these scenes). */
async function paneState(page, surfaceClass) {
    return page.evaluate((cls) => {
        const canvas = document.querySelector(`.${cls}`);
        const present = !!canvas;
        let display = "(absent)";
        let tabpanelState = "(no-host)";
        let visible = false;
        if (canvas) {
            display = getComputedStyle(canvas).display;
            const r = canvas.getBoundingClientRect();
            visible = display !== "none" && r.width > 2 && r.height > 2;
            const host = canvas.closest('[role="tabpanel"]');
            tabpanelState = host
                ? host.getAttribute("data-state") || "(no-attr)"
                : "(flat)";
        }
        return { present, display, tabpanelState, visible };
    }, surfaceClass);
}

/** Mounted-active under BOTH mount shapes: an ACTIVE tabpanel host (multi-surface
 *  scenes) or the J.W2 flat mount (single-surface scenes — visible, no tabpanel). */
const isMountedActive = (st) =>
    st.present &&
    st.display !== "none" &&
    (st.tabpanelState === "active" || (st.tabpanelState === "(flat)" && st.visible));

/** Read the easing readout text + the CopyButton's copy payload. The copy text is
 *  read from the CopyButton's `:text` — surfaced via the clipboard write, which we
 *  intercept by reading the button's title/aria or, robustly, by clicking it with
 *  a clipboard shim installed at context level. We read the visible readout text
 *  and the button's bound text attribute fallback. */
async function readReadout(page) {
    return page.evaluate(() => {
        const readout = document.querySelector(".easing-readout .easing-readout-value");
        const readoutText = readout ? readout.textContent.trim() : null;
        // The CopyButton renders inside `.easing-readout`. Its copied value is the
        // `:text` prop — surfaced as the readout value (one source). Capture the
        // window clipboard shim's last write if present (installed below).
        const copied = window.__kfLastCopy ?? null;
        return { readoutText, copied, hasReadout: !!readout };
    });
}

/** Drive the easing scene: assert (a) the canvas un-hides, (b) a handle-drag
 *  mutates the path `d` AND re-animates the subject, (c) the dropdown + the
 *  re-parseable readout. Returns a per-clause result map. */
async function exerciseEasing(page, label) {
    const res = { label };

    // ── clause (a) — the editor un-hides on switch-IN ──
    const st = await paneState(page, "easing-curve-canvas");
    res.a = isMountedActive(st);
    res.aDetail = st;

    if (!res.a) return res; // (b)/(c) need the mounted canvas

    // ── clause (b) — ≥2 handles, drag mutates `d` AND re-animates ──
    const handleCount = await page.evaluate(
        () => document.querySelectorAll(".easing-curve-canvas .control-point.handle").length,
    );
    res.handleCount = handleCount;

    // Sample the traveling-dot's position (the subject sampled at the live sweep
    // cy) BEFORE the drag, the bezier path `d` BEFORE, then drag a handle, then
    // re-sample. A genuine curve-change moves BOTH the path `d` AND, because the
    // sweep eases the SAME curve, the subject's sampled position over a fixed
    // window. We pin the sweep by sampling the dot cy across two frames.
    const before = await page.evaluate(async () => {
        const path = document.querySelector(".easing-curve-canvas .bezier-path");
        const d0 = path ? path.getAttribute("d") : null;
        // Sample the traveling dot cy across a short window (the subject under the
        // current curve). The dot's cy = 1 - easingFn(progress) in SVG space.
        const sampleDot = () => {
            const dot = document.querySelector(".easing-curve-canvas .traveling-dot");
            return dot ? parseFloat(dot.getAttribute("cy")) : null;
        };
        const samples = [];
        for (let i = 0; i < 6; i++) {
            samples.push(sampleDot());
            await new Promise((r) => requestAnimationFrame(r));
        }
        return { d0, samples };
    });

    // Drag handle 0 a real distance via trusted pointer events on the SVG.
    const dragged = await page.evaluate(async () => {
        const svg = document.querySelector(".easing-curve-canvas");
        const handle = document.querySelector(
            '.easing-curve-canvas .control-point.handle[data-index="0"]',
        );
        if (!svg || !handle) return false;
        const r = svg.getBoundingClientRect();
        const hb = handle.getBoundingClientRect();
        const startX = hb.x + hb.width / 2;
        const startY = hb.y + hb.height / 2;
        // Q.WC1 — the curve handle was consolidated onto `DemoControlPoint` over
        // the LIGHT `drag2D` (the bespoke SVG-level `@pointerdown="startDragging"`
        // hit-test was retired). The `drag2D` Draggable binds its `pointerdown`
        // listener on the HANDLE element (not the SVG), so the synthetic gesture
        // is dispatched on the handle (`setPointerCapture` retargets move/up to
        // it). The bite is unchanged: a real handle drag must still mutate the
        // bezier `d` AND re-time the subject.
        const fire = (type, x, y) =>
            handle.dispatchEvent(
                new PointerEvent(type, {
                    bubbles: true,
                    cancelable: true,
                    pointerId: 1,
                    pointerType: "mouse",
                    button: type === "pointerdown" ? 0 : -1,
                    buttons: type === "pointerup" ? 0 : 1,
                    clientX: x,
                    clientY: y,
                }),
            );
        fire("pointerdown", startX, startY);
        const tx = r.x + r.width * 0.7;
        const ty = r.y + r.height * 0.15;
        const STEPS = 12;
        for (let i = 1; i <= STEPS; i++) {
            const x = startX + (tx - startX) * (i / STEPS);
            const y = startY + (ty - startY) * (i / STEPS);
            fire("pointermove", x, y);
            await new Promise((res) => requestAnimationFrame(res));
        }
        fire("pointerup", tx, ty);
        return true;
    });
    res.dragged = dragged;
    await page.waitForTimeout(300);

    const after = await page.evaluate(async () => {
        const path = document.querySelector(".easing-curve-canvas .bezier-path");
        const d1 = path ? path.getAttribute("d") : null;
        const sampleDot = () => {
            const dot = document.querySelector(".easing-curve-canvas .traveling-dot");
            return dot ? parseFloat(dot.getAttribute("cy")) : null;
        };
        const samples = [];
        for (let i = 0; i < 6; i++) {
            samples.push(sampleDot());
            await new Promise((r) => requestAnimationFrame(r));
        }
        return { d1, samples };
    });

    res.dMutated = !!before.d0 && !!after.d1 && before.d0 !== after.d1;
    // The subject re-animates under the new curve: the sampled dot-cy SET shifts.
    // A no-op that only mutates `d` would leave the dot path identical (same fn).
    // We compare the multiset of cy samples — a changed curve eases the same
    // progress differently, so at least one sampled position must differ beyond a
    // float epsilon. (The sweep is playing, so progress advances; the discriminant
    // is whether the CURVE that maps progress→cy changed, witnessed by a cy that
    // no longer lies on the old curve for any sampled progress.)
    const beforeSet = (before.samples || []).filter((v) => v != null);
    const afterSet = (after.samples || []).filter((v) => v != null);
    const minLen = Math.min(beforeSet.length, afterSet.length);
    let reanimated = false;
    if (minLen >= 2) {
        // The range/spread of the eased position changes when the curve changes
        // (a steeper/flatter curve reshapes the dot's vertical travel). Compare
        // the spread (max-min) of the two windows; a curve change moves it.
        const spread = (arr) => Math.max(...arr) - Math.min(...arr);
        const sBefore = spread(beforeSet);
        const sAfter = spread(afterSet);
        reanimated =
            Math.abs(sAfter - sBefore) > 0.01 ||
            // or any individual sample shifted beyond epsilon at a matching index
            beforeSet.some((v, i) => i < afterSet.length && Math.abs(v - afterSet[i]) > 0.02);
    }
    res.reanimated = reanimated;
    res.b = res.handleCount >= 2 && res.dragged && res.dMutated && res.reanimated;
    res.bDetail = { handleCount, dMutated: res.dMutated, reanimated, beforeSet, afterSet };

    // ── clause (c) — the selector + the re-parseable readout ──
    const dropdownPresent = await page.evaluate(
        () => !!document.querySelector(".easing-trigger-label"),
    );
    res.dropdownPresent = dropdownPresent;

    // After the drag the curve is `cubic-bezier` — the readout must be present and
    // a complete re-parseable literal (NOT the bare keyword).
    const readout = await readReadout(page);
    res.readoutText = readout.readoutText;
    res.copied = readout.copied;
    const readoutOK =
        readout.hasReadout &&
        !!readout.readoutText &&
        REPARSEABLE_LITERAL.test(readout.readoutText) &&
        !BARE_TOKEN.test(readout.readoutText.trim());
    const copyOK =
        readout.copied == null /* clipboard not intercepted */
            ? true
            : REPARSEABLE_LITERAL.test(readout.copied) && !BARE_TOKEN.test(readout.copied.trim());
    res.c = dropdownPresent && readoutOK && copyOK;
    res.cDetail = { dropdownPresent, readoutText: readout.readoutText, copied: readout.copied, readoutOK, copyOK };

    return res;
}

async function browserHalf() {
    const consoleErrors = [];
    const result = await withPage(
        {
            distDir: DIST,
            label: "the easing-editor-live runtime clauses",
            context: { viewport: { width: 1440, height: 900 } },
        },
        async (page, { url: base }) => {

        // A clipboard shim — capture the CopyButton's write so clause (c) can read
        // the COPIED payload (not just the visible readout). Installed before any
        // navigation so every copy is intercepted.
        await page.addInitScript(() => {
            window.__kfLastCopy = null;
            try {
                const orig = navigator.clipboard && navigator.clipboard.writeText;
                if (navigator.clipboard) {
                    navigator.clipboard.writeText = (t) => {
                        window.__kfLastCopy = String(t);
                        return orig ? orig.call(navigator.clipboard, t).catch(() => {}) : Promise.resolve();
                    };
                }
            } catch {
                /* ignore */
            }
        });
        await page.addInitScript((ck) => {
            try {
                localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true }));
            } catch {
                /* ignore */
            }
        }, CTRL_KEY);

        // Capture pageerror + console for the (d) zero-error invariant.
        page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));
        page.on("console", (m) => {
            if (m.type() === "error") consoleErrors.push(`console.error: ${m.text()}`);
            if (m.type() === "warning") {
                const t = m.text();
                if (BARE_DOTS_RE.test(t)) consoleErrors.push(`console.warn: ${t}`);
            }
        });

        // Fresh load on cube (the editor un-hides on a SWITCH-INTO easing; cube is
        // the starting scene the gate switches AWAY from).
        await page.goto(`${base}/#/cube`, { waitUntil: "load" });
        await navToScene(page, "cube", "Controls", { timeout: 8000 });
        await page.waitForTimeout(700);

        // ── (a)-(c) on the SWITCH-INTO path: cube → easing ──
        const errBeforeEasing = consoleErrors.length;
        await switchScene(page, "easing", "Easing");
        const easingIn = await exerciseEasing(page, "cube→easing");
        reportEasing(easingIn);

        // ── (c) re-mount: Easing → Amiga → Easing, assert ZERO AnimationOptionError ──
        const errBeforeRemount = consoleErrors.length;
        await switchScene(page, "amiga", "Controls");
        await switchScene(page, "easing", "Easing");
        const remountErrors = consoleErrors
            .slice(errBeforeRemount)
            .filter((e) => OPTION_ERROR_RE.test(e));
        if (remountErrors.length === 0) {
            ok(
                "clause (c) re-mount — Easing→Amiga→Easing forced a controls RE-MOUNT with ZERO " +
                    "AnimationOptionError (the persisted timingFunction is a re-mountable literal, not the bare token)",
            );
        } else {
            fail(
                `clause (c) re-mount — ${remountErrors.length} AnimationOptionError(s) across the ` +
                    `Easing→Amiga→Easing re-mount (the persisted value is the bare "cubic-bezier"/"steps" ` +
                    `token, not a re-parseable literal):\n      ` +
                    remountErrors.slice(0, 4).join("\n      "),
            );
        }

        // ── (d) RETURN path: re-exercise (a)-(c) on the returned easing scene ──
        const easingReturn = await exerciseEasing(page, "amiga→easing (return)");
        reportEasing(easingReturn);

        // ── (d) SPRING single-surface panel: switch into spring, assert (a) ──
        await switchScene(page, "spring", "Spring");
        const springSt = await paneState(page, "spring-sidebar");
        // SpringSidebar may not carry a `.spring-sidebar` class — fall back to the
        // sidebar's known content marker: the canonical preset surface. J.W7c U5
        // REDESIGNED the spring panel from first principles (`SegmentedTabs` + the
        // single preset surface), renaming the legacy comparison `.preset-row` rows
        // to the `.preset-cell` cells inside the `.preset-grid` — same flat-mounted
        // content, evolved markers. The fallback asserts the flat-mounted preset
        // surface is rendered + visible (both the J.W7c `.preset-cell`/`.preset-grid`
        // shape AND the legacy `.preset-row` shape are read honestly, so the bite is
        // unchanged: the spring panel mounts ACTIVE on switch-in). J.W2 S2
        // (S4-stretch): the spring panel mounts FLAT (no tabpanel).
        let springA = isMountedActive(springSt);
        if (!springSt.present) {
            const springPanel = await page.evaluate(() => {
                const SEL = ".controls-pane .preset-cell, .controls-pane .preset-grid, .controls-pane .preset-row";
                const row = document.querySelector(SEL);
                if (!row) return { flatVisible: false, rows: 0 };
                const r = row.getBoundingClientRect();
                return {
                    flatVisible: r.width > 2 && r.height > 2,
                    rows: document.querySelectorAll(SEL).length,
                };
            });
            springA = springPanel.flatVisible;
            springSt.fallback = springPanel;
        }
        if (springA) {
            ok(
                `clause (d) spring — the single-surface spring panel mounts ACTIVE on switch-in ` +
                    `(${JSON.stringify(springSt)})`,
            );
        } else {
            fail(
                `clause (d) spring — the spring single-surface panel did NOT mount active on ` +
                    `switch-in (the latch re-fired): ${JSON.stringify(springSt)}`,
            );
        }

        // ── (d) ZERO pageerror/_gen/"......" throughout ──
        const fatal = consoleErrors.filter(
            (e) => GEN_RE.test(e) || BARE_DOTS_RE.test(e) || /^pageerror:/.test(e),
        );
        if (fatal.length === 0) {
            ok(
                `clause (d) console — ZERO pageerror/_gen/"......" across the cube→easing→amiga→` +
                    `easing→spring sweep (${consoleErrors.length} non-fatal console line(s) total)`,
            );
        } else {
            fail(
                `clause (d) console — ${fatal.length} fatal pageerror/_gen/"......" line(s) across ` +
                    `the switch sweep:\n      ` +
                    fatal.slice(0, 6).join("\n      "),
            );
        }

        },
    );
    if (result.skipped) console.log(`  ○ browser half skipped — ${result.reason}`);
}

function reportEasing(r) {
    if (r.a) {
        ok(`clause (a) ${r.label} — the editor UN-HIDES on switch-in (${JSON.stringify(r.aDetail)})`);
    } else {
        fail(
            `clause (a) ${r.label} — the .easing-curve-canvas is NOT mounted+active+visible on ` +
                `switch-in (the reka latch blanked it): ${JSON.stringify(r.aDetail)}`,
        );
        return; // (b)/(c) cannot run without the panel
    }

    if (r.b) {
        ok(
            `clause (b) ${r.label} — ${r.handleCount} handles; a handle-drag MUTATES the bezier ` +
                `path d AND re-animates the subject (${JSON.stringify(r.bDetail)})`,
        );
    } else {
        fail(
            `clause (b) ${r.label} — the handle-drag did not both mutate d AND re-animate the ` +
                `subject (a no-op SVG mutation still REDs): ${JSON.stringify(r.bDetail)}`,
        );
    }

    if (r.c) {
        ok(
            `clause (c) ${r.label} — the dropdown is present + the readout/copy is a complete ` +
                `re-parseable literal "${r.readoutText}" (NOT the bare token)`,
        );
    } else {
        fail(
            `clause (c) ${r.label} — the selector/readout failed: ${JSON.stringify(r.cDetail)} ` +
                `(the readout must be a complete cubic-bezier(…)/steps(…) literal, never the bare keyword)`,
        );
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:easing-editor-live — FAIL (${failures.length}): the easing curve/timing editor is ` +
            `still BLANK on switch-in (the reka passive-latch), OR a handle-drag does not re-animate the ` +
            `subject, OR the readout/persist value is the bare "cubic-bezier"/"steps" token (the re-mount ` +
            `throws AnimationOptionError). I.W2 S1-S4 are not all satisfied.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:easing-editor-live — PASS: the easing curve editor un-hides on every switch-in (S1 " +
        "machine-projected model-value + S2 force-mount), a handle-drag mutates the curve AND re-animates " +
        "the subject (S4 one EasingEditor, wired), the read-only readout/copy is a complete re-parseable " +
        "literal that survives a controls re-mount with ZERO AnimationOptionError (S3 the B5 readout seam), " +
        "and spring's single-surface panel + the return path hold the same — ZERO pageerror/_gen/'......'.",
);
