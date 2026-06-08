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
 * Mirrors scripts/proof-scene-parity.mjs (serveDist + Playwright + the FSM-settle
 * plumbing + the KF_REQUIRE_BROWSER skipOrFail). Re-runnable:
 * `node scripts/proof-motion-path-copy.mjs`.
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
const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";
const skipOrFail = (reason) => {
    if (REQUIRE_BROWSER) {
        fail(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — the ` +
                "live copy-artifact + clipboard write + edit-tracking cannot pass vacuously",
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
const MACHINE_KEY = "keyframes-js-scene-machine";

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
    // Grant clipboard so the CopyButton's writeText can be read back (the real
    // copy affordance proof). The origin is the served loopback.
    const context = await chromium.launch().then((b) => b);
    const browser = context;
    const ctx = await browser.newContext({
        viewport: { width: VW, height: VH },
        permissions: ["clipboard-read", "clipboard-write"],
    });
    try {
        const page = await ctx.newPage();
        await page.goto(`${base}/#/cube`, { waitUntil: "load" });
        await page.waitForTimeout(800);

        // ── 2. the rendered artifact + the real clipboard write + edit-track ──
        await settleOnScene(page, "motion-path", VW, VH);
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

        await page.close();
    } finally {
        await ctx.close();
        await browser.close();
        server.close();
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
