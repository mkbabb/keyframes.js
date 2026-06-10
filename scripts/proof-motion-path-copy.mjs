#!/usr/bin/env node
/**
 * proof:motion-path-copy — H.W12 §Hard gate (I3 · R-MP-C · W-MP-3).
 *
 * MotionPath emits a real author `offset-path` but never surfaced it as COPYABLE.
 * Once the path is editable (proof:motion-path-editable) the scene's most useful
 * output is the `offset-path: path('…')` declaration the user could paste into
 * their own stylesheet — the SECOND copy-paste artifact beside Discrete's
 * `linear()` (`a-scene-path-discrete.md:172` "the most directly useful artifact in
 * the entire demo"). H.W12.S6 surfaces it: a `CopyButton` + a `.artifact` `<code>`
 * block re-reading the SAME single source the guide + traveller ride, so what you
 * copy IS what you shaped. This gate asserts the copy affordance emits
 * `offset-path: path(…)` STATICALLY (the artifact source + the CopyButton wiring)
 * + BEHAVIOURALLY (the rendered artifact reads `offset-path: path('…')` AND the
 * real CopyButton click writes that exact text to the clipboard AND it re-reads
 * the single source — it UPDATES live when the path is edited).
 *
 * STATIC HALF (always runs — the artifact source-shape):
 *
 *   1. THE ARTIFACT EMITS offset-path: path(…) — `useMotionPathDemo.ts` derives a
 *      `copyablePath` that is `offset-path: path('${pathD}')` (re-reads the single
 *      source), and `MotionPathTarget.vue` surfaces it via a `<CopyButton
 *      :text="demo.copyablePath…">` + a `.artifact` `<code>` block. BITE: drop the
 *      copy affordance (no CopyButton / no artifact) → reds; emit something other
 *      than `offset-path: path(…)` → reds.
 *
 * BROWSER HALF (the rendered artifact reads offset-path: path('…'), the real copy
 * writes it to the clipboard, and it re-reads the single source on edit;
 * settle-gated on the H.W1 FSM resting):
 *
 *   2. proof:motion-path-copy — settle on motion-path; the `.artifact` text reads
 *      `offset-path: path('…')` (the live declaration), a real click on the
 *      CopyButton writes that EXACT string to the clipboard (clipboard read-back),
 *      AND after a control-handle drag (an edit) the artifact UPDATES to the new
 *      path (it re-reads the single source — what you copy IS what you shaped).
 *      BITE: no copy affordance → no `.artifact` text → reds; a stale static string
 *      that does not track the edit → the artifact never updates → reds.
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * resolveChromium + context/teardown, J.W3 S1) + navToScene (the per-EXPECTED-
 * state scene settle). Under KF_REQUIRE_BROWSER a playwright-absent skip becomes
 * a hard fail AT THE LIB SEAM. Re-runnable:
 * `node scripts/proof-motion-path-copy.mjs`.
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

console.log("proof:motion-path-copy — H.W12 (I3 · R-MP-C · the copy-offset-path artifact)");

// ── STATIC HALF ──────────────────────────────────────────────────────────────
const demoSrc = read(path.join(DEMO, "motion-path/useMotionPathDemo.ts"));
const targetSrc = read(path.join(DEMO, "motion-path/MotionPathTarget.vue"));

// 1. THE ARTIFACT EMITS offset-path: path(…).
{
    // copyablePath derives the offset-path declaration from the single source.
    const emitsDecl = /copyablePath\s*=\s*computed\([\s\S]{0,200}?offset-path:\s*path\(/.test(
        demoSrc,
    );
    // The Target surfaces it via a CopyButton bound to copyablePath + an .artifact code block.
    const hasCopyButton = /<CopyButton\b[\s\S]*?:text="demo\.copyablePath/.test(targetSrc);
    const hasArtifact = /class="artifact[\s\S]*?demo\.copyablePath/.test(targetSrc);
    if (emitsDecl && hasCopyButton && hasArtifact) {
        ok(
            `the artifact emits offset-path: path(…) — useMotionPathDemo derives ` +
                `copyablePath = "offset-path: path('\${pathD}')" (the single source), and ` +
                `MotionPathTarget surfaces it via <CopyButton :text="demo.copyablePath"> + ` +
                `a .artifact <code> block`,
        );
    } else {
        fail(
            `the artifact emits offset-path: path(…) — expected copyablePath = ` +
                `offset-path: path(…) (${emitsDecl}) + a <CopyButton :text="demo.copyablePath"> ` +
                `(${hasCopyButton}) + a .artifact block reading copyablePath (${hasArtifact}); ` +
                `the copy artifact must surface the live offset-path (H.W12.S6 / R-MP-C)`,
        );
    }
}

// ── BROWSER HALF ─────────────────────────────────────────────────────────────
/** Drive a scene switch via the lib's navToScene (per-EXPECTED-state settle;
 *  expectedTrigger null = the destination renders NO control panel), re-assert
 *  the viewport, then a settle window. */
async function settleOnScene(page, sceneId, expectedTrigger, vw, vh, settleMs = 1400) {
    await navToScene(page, sceneId, expectedTrigger, { timeout: 8000 });
    await page.setViewportSize({ width: vw, height: vh });
    await page.waitForTimeout(settleMs);
}

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
    const VW = 1440;
    const VH = 900;
    const result = await withPage(
        {
            distDir: DIST,
            label: "the live copy-artifact + clipboard write + edit-tracking",
            // Grant clipboard so the CopyButton's writeText can be read back (the
            // real copy affordance proof). The origin is the served loopback.
            context: {
                viewport: { width: VW, height: VH },
                permissions: ["clipboard-read", "clipboard-write"],
            },
        },
        async (page, { url }) => {
        await page.goto(`${url}/#/cube`, { waitUntil: "load" });
        await page.waitForTimeout(800);

        // ── 2. the rendered artifact + the real clipboard write + edit-track ──
        // (motion-path renders NO control panel — EXPECT trigger null)
        await settleOnScene(page, "motion-path", null, VW, VH);
        const artifactReady = await waitVisible(page, ".artifact");
        const copyReady = await waitVisible(page, ".artifact ~ * button, .artifact");
        if (!artifactReady) {
            fail(
                `motion-path-copy — the .artifact copy block did not mount ` +
                    `(.artifact:${artifactReady}); the FSM may not have rested on motion-path ` +
                    `or the copy affordance is absent`,
            );
        } else {
            void copyReady;
            const before = await page.evaluate(() => {
                const art = document.querySelector(".artifact");
                return { text: (art?.textContent ?? "").trim() };
            });

            // (a) the artifact reads offset-path: path('…') — the live declaration.
            const emitsDecl = /^offset-path:\s*path\(['"].+['"]\)\s*;?\s*$/.test(
                before.text,
            );

            // (b) a real click on the CopyButton writes that EXACT string to the
            //     clipboard. The CopyButton is the button nearest the artifact's
            //     "offset-path" header row — find the button in the same field block.
            let clipboardText = "";
            const copyBtn = await page.evaluateHandle(() => {
                // The copy button sits in the offset-path field block, beside the
                // "offset-path" label, above the .artifact code. Walk up to the
                // shared field container and find its button.
                const art = document.querySelector(".artifact");
                if (!art) return null;
                const block = art.closest("div");
                // The CopyButton renders a <button>; search the block + its parent.
                return (
                    block?.querySelector("button") ??
                    block?.parentElement?.querySelector("button") ??
                    null
                );
            });
            const btnEl = copyBtn.asElement();
            if (btnEl) {
                await btnEl.click();
                await page.waitForTimeout(150);
                clipboardText = await page.evaluate(async () => {
                    try {
                        return await navigator.clipboard.readText();
                    } catch {
                        return "";
                    }
                });
            }
            const clipboardOk =
                /^offset-path:\s*path\(['"].+['"]\)\s*;?\s*$/.test(clipboardText) &&
                clipboardText.trim() === before.text.trim();

            // (c) the artifact RE-READS the single source — after editing the path
            //     (a control-handle drag), the artifact text UPDATES (what you copy
            //     IS what you shaped).
            let editedText = before.text;
            const handlesReady = await page
                .waitForFunction(
                    () => document.querySelectorAll(".mp-handle").length >= 3,
                    { timeout: 4000 },
                )
                .then(() => true)
                .catch(() => false);
            if (handlesReady) {
                const drag = await page.evaluate(() => {
                    const handles = [...document.querySelectorAll(".mp-handle")];
                    const h =
                        handles.find((x) => x.classList.contains("mp-handle--control")) ??
                        handles[0];
                    const r = h.getBoundingClientRect();
                    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
                });
                await page.mouse.move(drag.x, drag.y);
                await page.mouse.down();
                for (let i = 1; i <= 10; i++) {
                    await page.mouse.move(drag.x + 7 * i, drag.y - 5 * i);
                    await page.waitForTimeout(16);
                }
                await page.mouse.up();
                await page.waitForTimeout(200);
                editedText = await page.evaluate(() => {
                    const art = document.querySelector(".artifact");
                    return (art?.textContent ?? "").trim();
                });
            }
            const reReadsSource = editedText !== before.text;

            if (emitsDecl && clipboardOk && reReadsSource) {
                ok(
                    `motion-path-copy — the .artifact reads "${before.text}", a real ` +
                        `CopyButton click wrote that EXACT string to the clipboard, AND after ` +
                        `a control-handle edit the artifact updated to "${editedText.slice(0, 48)}…" ` +
                        `(it re-reads the single source — what you copy IS what you shaped)`,
                );
            } else {
                fail(
                    `motion-path-copy — the copy artifact did not fully hold ` +
                        `(reads offset-path: path(…):${emitsDecl} ["${before.text}"], ` +
                        `clipboard wrote it:${clipboardOk} ["${clipboardText}"], ` +
                        `updates on edit:${reReadsSource} ["${editedText.slice(0, 48)}"]); ` +
                        `the copy affordance must emit the live offset-path declaration ` +
                        `(H.W12.S6 / proof:motion-path-copy)`,
                );
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
        `\nproof:motion-path-copy — FAIL (${failures.length}): the copy-offset-path ` +
            `artifact regressed (H.W12 I3).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:motion-path-copy — PASS: the scene surfaces a copy affordance that emits " +
        "`offset-path: path('…')` (the second copy artifact beside Discrete's linear()), " +
        "re-reading the single source so what you copy IS what you shaped.",
);
