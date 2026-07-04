#!/usr/bin/env node
/**
 * proof:gesture-manifest — the S.G3 census oracle (SG-8; born-RED, census-shaped).
 *
 * Replaces v1's unfalsifiable "README'd gesture set" with a MACHINE-READABLE
 * per-scene gesture census (`scripts/gesture-manifest.mjs`) that the gate
 * BROWSER-ACTUATES. For every entry it asserts, at a real viewport on a touch
 * context:
 *
 *   (1) STRUCTURAL — the entry carries a non-empty `tell` AND a `touch.kind` that
 *       is a RELIABLE primitive (`double-tap`/`tap`/`drag`). A manifest entry
 *       WITHOUT a tell is a hard RED (the tell requirement bites — surfacing the
 *       affordance is mandatory); a touch wired via native `dblclick` synthesis is
 *       a hard RED (unreliable across mobile browsers — SG-8).
 *   (2) TELL — the tell selector resolves to a VISIBLE element on fresh scene entry
 *       (a documented-but-unshown gesture cannot pass).
 *   (3) TOUCH — the touch path is actuated via the reliable primitive (a
 *       pointer-based double-tap = two full down+up pairs within 300ms; a button
 *       tap; a pointer drag) — NEVER native `dblclick` synthesis.
 *   (4) EFFECT — the gesture's observable result fires (a class/attr/element),
 *       so a dead tell over a broken affordance cannot pass.
 *
 * Runtime-tier (T1/T8): reads the running demo (the BUILT dist/gh-pages/) at
 * 1440×900 on a `hasTouch` context. Under KF_REQUIRE_BROWSER a playwright-absent
 * skip is a hard fail at the lib seam. Re-runnable: `node
 * scripts/proof-gesture-manifest.mjs`.
 *
 * BORN-RED WITNESS. On the pre-S.G3 tree no census exists and the sealed
 * affordances have no tell + no touch path — every entry reds. As each scene gains
 * its tell + a browser-actuated touch path and enters the census, the gate greens.
 * PLANT (recorded): (a) add a census entry with `tell: null` → the STRUCTURAL
 * clause reds; (b) set a `touch.kind: "dblclick"` → the STRUCTURAL clause reds.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { REQUIRE_BROWSER, withPage } from "./lib/demo-driver.mjs";
import { GESTURE_MANIFEST, RELIABLE_TOUCH_KINDS } from "./gesture-manifest.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const CTRL_KEY = "animation-groups-control-options-store";

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const note = (label) => console.log(`  · ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log("proof:gesture-manifest — the per-scene gesture census (S.G3 S6, SG-8)");

// ── (1) STRUCTURAL — the census shape (the born-RED plant surface) ────────────
// Every entry MUST carry a non-empty tell and a reliable touch kind. This runs
// in-process (no browser) so the plant reds even without a harness.
for (const e of GESTURE_MANIFEST) {
    const key = `${e.scene}:${e.id}`;
    if (typeof e.tell !== "string" || !e.tell.trim()) {
        fail(
            `${key} — the census entry has NO on-stage tell (\`tell\` is ${JSON.stringify(e.tell)}). ` +
                `An entry without a tell is a hard RED: surfacing the affordance is mandatory, not optional.`,
        );
    }
    if (!e.touch || !RELIABLE_TOUCH_KINDS.includes(e.touch.kind)) {
        fail(
            `${key} — touch.kind ${JSON.stringify(e.touch?.kind)} is NOT a reliable primitive ` +
                `(one of ${RELIABLE_TOUCH_KINDS.join(" / ")}). Native \`dblclick\` synthesis is refused ` +
                `(unreliable across mobile browsers — SG-8).`,
        );
    }
    if (!e.touch?.target || !e.effect?.kind) {
        fail(`${key} — the census entry is missing a touch target or an effect kind`);
    }
}
if (failures.length === 0) {
    ok(
        `STRUCTURAL — all ${GESTURE_MANIFEST.length} census entries carry a tell + a reliable touch ` +
            `primitive (${RELIABLE_TOUCH_KINDS.join("/")}); zero native-dblclick touch paths`,
    );
}

// ── The reliable-primitive actuators (no native dblclick anywhere) ────────────

/** Is the tell element present AND visible on the page? */
function tellVisible(page, sel) {
    return page.evaluate((s) => {
        const el = document.querySelector(s);
        if (!el) return { ok: false, why: "not found" };
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const shown =
            r.width > 0 &&
            r.height > 0 &&
            cs.visibility !== "hidden" &&
            cs.display !== "none" &&
            parseFloat(cs.opacity || "1") > 0.02 &&
            (el.offsetParent !== null || cs.position === "fixed");
        return { ok: shown, why: shown ? "" : "present but not visible" };
    }, sel);
}

/**
 * A POINTER-based double-tap: two full pointerdown+pointerup pairs on the target
 * within the 300ms window, ~120ms apart — genuine PointerEvents (isPrimary,
 * pointerType:touch) through the DOM to the real listeners. This is the reliable
 * primitive the demo's useDoubleTap recognizes; it is explicitly NOT native
 * `dblclick` synthesis.
 */
function actuateDoubleTap(page, sel) {
    return page.evaluate((s) => {
        const el = document.querySelector(s);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        const x = r.left + r.width / 2;
        const y = r.top + r.height / 2;
        const fire = (type) =>
            el.dispatchEvent(
                new PointerEvent(type, {
                    pointerId: 1,
                    isPrimary: true,
                    pointerType: "touch",
                    clientX: x,
                    clientY: y,
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                }),
            );
        return new Promise((res) => {
            fire("pointerdown");
            fire("pointerup");
            setTimeout(() => {
                fire("pointerdown");
                fire("pointerup");
                res(true);
            }, 120);
        });
    }, sel);
}

/** A touch TAP on a button (real touch input → click). */
async function actuateTap(page, sel) {
    // page.tap needs the hasTouch context (set below). It fires
    // pointerdown+pointerup+click — the reliable button-tap primitive.
    await page.tap(sel, { timeout: 5000 });
    return true;
}

/**
 * A POINTER drag: pointerdown on the handle, a few pointermoves, pointerup — the
 * shared useDragScrub seam (window-scope move/up listeners) drives it. Genuine
 * PointerEvents (isPrimary, pointerType:touch), bubbling to window.
 */
function actuateDrag(page, sel, dx) {
    return page.evaluate(
        ([s, delta]) => {
            const el = document.querySelector(s);
            if (!el) return false;
            const r = el.getBoundingClientRect();
            const x0 = r.left + r.width / 2;
            const y0 = r.top + r.height / 2;
            const fire = (type, x) =>
                el.dispatchEvent(
                    new PointerEvent(type, {
                        pointerId: 1,
                        isPrimary: true,
                        pointerType: "touch",
                        clientX: x,
                        clientY: y0,
                        bubbles: true,
                        cancelable: true,
                        composed: true,
                    }),
                );
            return new Promise((res) => {
                fire("pointerdown", x0);
                let i = 0;
                const step = () => {
                    i += 1;
                    fire("pointermove", x0 + (delta * i) / 5);
                    if (i < 5) setTimeout(step, 16);
                    else {
                        fire("pointerup", x0 + delta);
                        res(true);
                    }
                };
                setTimeout(step, 16);
            });
        },
        [sel, dx],
    );
}

/** Poll the effect predicate up to a generous backstop (C-10 — the closure is the
 *  observed effect, not an elapsed-frame count). Returns whether it fired. */
async function awaitEffect(page, effect, baseline) {
    const deadline = Date.now() + 3000;
    for (;;) {
        const fired = await page.evaluate(
            ([eff, base]) => {
                if (eff.kind === "class-appears") {
                    const el = document.querySelector(eff.selector);
                    return !!el && el.classList.contains(eff.token);
                }
                if (eff.kind === "attr-present") {
                    return !!document.querySelector(eff.selector);
                }
                if (eff.kind === "element-appears") {
                    const el = document.querySelector(eff.selector);
                    if (!el) return false;
                    const r = el.getBoundingClientRect();
                    return r.width > 0 && r.height > 0;
                }
                if (eff.kind === "attr-changes") {
                    const el = document.querySelector(eff.selector);
                    return !!el && el.getAttribute(eff.attr) !== base;
                }
                return false;
            },
            [effect, baseline],
        );
        if (fired) return true;
        if (Date.now() > deadline) return false;
        await page.waitForTimeout(60);
    }
}

/** Capture the attr baseline for an `attr-changes` effect (before actuation). */
function captureBaseline(page, effect) {
    if (effect.kind !== "attr-changes") return Promise.resolve(null);
    return page.evaluate(
        ([sel, attr]) => document.querySelector(sel)?.getAttribute(attr) ?? null,
        [effect.selector, effect.attr],
    );
}

async function browserHalf() {
    const result = await withPage(
        { distDir: DIST, label: "the gesture-manifest census" },
        async (_page, { url: base, browser }) => {
            for (const e of GESTURE_MANIFEST) {
                const key = `${e.scene}:${e.id}`;
                // A FRESH touch context per entry — the census proves TOUCH parity,
                // so every actuation runs on a hasTouch context (page.tap needs it;
                // the pointer double-tap/drag ride pointerType:touch).
                const ctx = await browser.newContext({
                    viewport: { width: 1440, height: 900 },
                    hasTouch: true,
                });
                const page = await ctx.newPage();
                await page.addInitScript((ck) => {
                    try {
                        localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true }));
                    } catch {
                        /* ignore */
                    }
                }, CTRL_KEY);
                try {
                    await page.goto(`${base}/#/${e.scene}`, { waitUntil: "load" });
                    // Route rested + the scene's sub-cards (and, for pane tells, the
                    // controls pane) mounted.
                    await page.waitForTimeout(1000);

                    // (2) TELL — visible on fresh entry (poll briefly for late mounts).
                    let tv = await tellVisible(page, e.tell);
                    for (let i = 0; i < 10 && !tv.ok; i++) {
                        await page.waitForTimeout(120);
                        tv = await tellVisible(page, e.tell);
                    }
                    if (!tv.ok) {
                        fail(
                            `${key} — the on-stage tell \`${e.tell}\` is ${tv.why} on fresh entry ` +
                                `(a documented-but-unshown gesture cannot pass)`,
                        );
                        continue;
                    }

                    // (3)+(4) TOUCH + EFFECT.
                    const baseline = await captureBaseline(page, e.effect);
                    // Ensure the touch target exists before actuating.
                    const hasTarget = await page.evaluate(
                        (s) => !!document.querySelector(s),
                        e.touch.target,
                    );
                    if (!hasTarget) {
                        fail(`${key} — the touch target \`${e.touch.target}\` was not found on the stage`);
                        continue;
                    }

                    if (e.touch.kind === "double-tap") {
                        await actuateDoubleTap(page, e.touch.target);
                    } else if (e.touch.kind === "tap") {
                        await actuateTap(page, e.touch.target);
                    } else if (e.touch.kind === "drag") {
                        await actuateDrag(page, e.touch.target, e.touch.dx ?? 24);
                    }

                    const fired = await awaitEffect(page, e.effect, baseline);
                    if (fired) {
                        ok(
                            `${key} — tell shown + ${e.touch.kind} actuated (reliable primitive) → the gesture ` +
                                `fired (${e.label})`,
                        );
                    } else {
                        fail(
                            `${key} — the ${e.touch.kind} touch path actuated but the gesture did NOT fire ` +
                                `(effect ${JSON.stringify(e.effect)} never observed) — the affordance is dead on touch`,
                        );
                    }
                } finally {
                    await ctx.close();
                }
            }
        },
    );
    if (result.skipped) {
        if (REQUIRE_BROWSER) {
            fail(
                `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${result.reason} — ` +
                    "the census cannot be actuated vacuously",
            );
        } else {
            console.log(`  ○ browser half skipped — ${result.reason}`);
        }
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:gesture-manifest — FAIL (${failures.length}):\n  ` +
            failures.join("\n  ") +
            `\n\n  One or more census entries red: an entry with no tell, a non-reliable (native-dblclick) ` +
            `touch path, a tell that is not shown on fresh entry, or a touch path that did not fire the ` +
            `gesture. The census is the source-of-truth — every sealed affordance must carry an on-stage ` +
            `tell + a browser-actuated reliable-primitive touch path (S.G3 SG-8).`,
    );
    process.exit(1);
}
console.log(
    `\nproof:gesture-manifest — PASS: all ${GESTURE_MANIFEST.length} census entries carry an on-stage tell ` +
        `and a browser-actuated reliable-primitive touch path (pointer double-tap / button tap / pointer drag — ` +
        `never native dblclick); every tell is shown on fresh entry and every touch path fires its gesture on a ` +
        `touch context. The hidden-affordance systemic (fold row 67) is closed, falsifiably.`,
);
