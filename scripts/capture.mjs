#!/usr/bin/env node
/**
 * capture — the before/after-every-page capture harness (the precept edict's
 * checked-in instrument) + the C.W1 S3 π-FULL probes.
 *
 * The before/after-every-page edict (precepts SPEC.md, committed at 8ccf9f4)
 * binds the capture to "a SINGLE Playwright/Chrome harness CHECKED INTO the
 * tranche's audit dir so it re-runs identically at open and close." B
 * authored the edict and ran the capture, but the harness lived in /tmp — so
 * "re-runs identically" was unsatisfiable. This is that harness, in the repo.
 *
 * It serves the BUILT `dist/gh-pages/` (the artefact a deploy publishes — NOT
 * the dev server), navigates every demo page × {375,1280,1440} at idle,
 * screenshots to the target dir, and records per-page console errors.
 *
 * C.W1 S3 adds the two FULL-only π clauses W7 swore were met but produced no
 * artefact:
 *   • the --reduced-motion animation-timing probe (≥5 frames spanning the
 *     named duration; the final-frame readPixels non-empty assertion);
 *   • the per-surface contrast-vs-background table (measured WCAG luminance
 *     ratios for the display/heading/dock surfaces).
 *
 * ── INV-ε SEQUENCING — the reduced-motion HARD assertion is GATED behind
 *    KF_RM_HONORED=1 (default OFF). ──────────────────────────────────────────
 * The demo does NOT honor `prefers-reduced-motion` yet — C.W3 lands the
 * honoring (motion-dogfood 1: zero `prefers-reduced-motion` refs in the demo).
 * So in C.W1 the probe RUNS, EMITS the ≥5-frame artefact, and RECORDS the
 * measured frames — but the HARD "renders the rest/final frame under
 * reduced-motion" assertion does NOT exit-1 until KF_RM_HONORED=1 is set.
 * C.W3 flips that env on once the demo honors RM, and the same checked-in probe
 * turns the gate true (inv ε: a deferred gate is marked deferred, not met, and
 * the close cannot read π as met before its precondition ships). Until then the
 * probe reports the measured RM frames + writes the artefact, and a not-yet-
 * honored RM path is a NOTE, never a build failure.
 *
 * Usage:
 *   node scripts/capture.mjs <before|after> [outDir]   — screenshot matrix
 *   node scripts/capture.mjs --reduced-motion [outDir] — RM probe + contrast
 *   KF_PLAYWRIGHT_DIR=/path   (resolve playwright from there; CI installs it)
 *   KF_CAPTURE_OPEN_PANEL=1   (also capture the controls-OPEN state)
 *   KF_RM_HONORED=1           (C.W3: make the RM rest-frame assertion HARD)
 *
 * Default outDir: docs/tranches/<TRANCHE>/audit/screenshots/<phase>/ for the
 * screenshot phases; docs/tranches/C/audit/capture/ for --reduced-motion.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
    SCENES,
    resolveChromium,
    serveDist,
    openControlsPanel,
    subjectRect,
} from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const arg1 = process.argv[2];
const MODES = new Set(["before", "after", "--reduced-motion"]);
if (!MODES.has(arg1)) {
    console.error(
        "usage: node scripts/capture.mjs <before|after|--reduced-motion> [outDir]",
    );
    process.exit(2);
}

const VIEWPORTS = [
    { name: "mobile", width: 375, height: 667 },
    { name: "laptop", width: 1280, height: 800 },
    { name: "desktop", width: 1440, height: 900 },
];

// ── Shared in-page measurement helpers ──────────────────────────────────────

// WCAG contrast: relative luminance + ratio, computed over the surfaces'
// COMPUTED colors. Walks up the DOM to find the first non-transparent
// background so a glass/translucent surface measures against what's behind it.
const CONTRAST_PROBE = () => {
    const parseRGB = (s) => {
        const m = s.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        const parts = m[1].split(",").map((x) => parseFloat(x.trim()));
        return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
    };
    const lum = ({ r, g, b }) => {
        const f = (c) => {
            c /= 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const ratio = (a, b) => {
        const l1 = lum(a),
            l2 = lum(b);
        const hi = Math.max(l1, l2),
            lo = Math.min(l1, l2);
        return (hi + 0.05) / (lo + 0.05);
    };
    // Effective background: climb ancestors until a non-transparent bg color.
    const effectiveBg = (el) => {
        let cur = el;
        while (cur && cur !== document.documentElement) {
            const bg = parseRGB(getComputedStyle(cur).backgroundColor);
            if (bg && bg.a > 0) return bg;
            cur = cur.parentElement;
        }
        const docBg = parseRGB(getComputedStyle(document.body).backgroundColor);
        return docBg && docBg.a > 0 ? docBg : { r: 255, g: 255, b: 255, a: 1 };
    };
    const measure = (label, sel) => {
        const el = document.querySelector(sel);
        if (!el) return { surface: label, selector: sel, present: false };
        const fg = parseRGB(getComputedStyle(el).color);
        const bg = effectiveBg(el);
        if (!fg) return { surface: label, selector: sel, present: true, ratio: null };
        const r = ratio(fg, bg);
        return {
            surface: label,
            selector: sel,
            present: true,
            fg: `rgb(${Math.round(fg.r)},${Math.round(fg.g)},${Math.round(fg.b)})`,
            bg: `rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`,
            ratio: Math.round(r * 100) / 100,
            passAA: r >= 4.5,
            passAALarge: r >= 3,
        };
    };
    // First non-`—` measurement across a list of candidate selectors (the
    // editing state hides the splash <h1>, so fall through to the serif label
    // the dock/menubar renders so the display surface still resolves).
    const measureFirst = (label, sels) => {
        for (const sel of sels) {
            const m = measure(label, sel);
            if (m.present && m.ratio != null) return m;
        }
        return { surface: label, selector: sels[0], present: false };
    };
    return [
        // The display serif surface (splash <h1> when present; else the serif
        // animation-name / dock label that carries the display type in-editor).
        measureFirst("display-heading", [
            "h1.instrument-serif",
            "h1",
            ".instrument-serif.text-lg",
            "[class*=dock] .instrument-serif",
            ".instrument-serif",
        ]),
        // A secondary heading surface.
        measureFirst("heading", ["h2", "[class*=heading]", "h3, [role=heading]"]),
        // The dock surface text (the floating dock chrome).
        measureFirst("dock", [
            "[class*=dock] .instrument-serif",
            "[class*=dock] span",
            ".glass-dock",
            "[class*=dock]",
        ]),
    ].filter((m) => m.present);
};

// A non-empty pixel sample over the subject rect: are there >1 distinct colors
// in a grid sample? An empty/blank canvas reads as a single flat color.
const PIXEL_NONEMPTY = (rect) => {
    // Sample the subject region by reading element-derived pixels via an
    // offscreen draw is not available without canvas access; instead we test
    // structural non-emptiness: the subject rect has measurable size AND at
    // least one descendant/self with a non-transparent rendered box. For a
    // <canvas> subject we read its 2d/webgl pixels directly when reachable.
    const el = document
        .elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    if (!el) return { nonEmpty: false, reason: "no element at subject center" };

    // Canvas path: sample real pixels ONLY when the SUBJECT itself is/contains
    // a canvas (the amiga/3d scenes). A DOM subject (cards/cube) must NOT be
    // routed through an unrelated canvas elsewhere on the page — that mis-read
    // a painted DOM card as "empty" off a transparent offscreen canvas.
    const canvas =
        el.tagName === "CANVAS" ? el : el.closest?.("canvas") ?? el.querySelector?.("canvas");
    if (canvas && canvas.width > 0 && canvas.height > 0) {
        try {
            const gl =
                canvas.getContext("webgl2") ||
                canvas.getContext("webgl") ||
                canvas.getContext("experimental-webgl");
            if (gl) {
                const px = new Uint8Array(4 * 16);
                // Read a small block near the canvas center.
                const cx = Math.floor(canvas.width / 2) - 2;
                const cy = Math.floor(canvas.height / 2) - 2;
                gl.readPixels(cx, cy, 4, 4, gl.RGBA, gl.UNSIGNED_BYTE, px);
                let nonZero = 0;
                for (let i = 0; i < px.length; i++) if (px[i] !== 0) nonZero++;
                return { nonEmpty: nonZero > 0, sampled: "webgl", nonZero };
            }
            const ctx2d = canvas.getContext("2d");
            if (ctx2d) {
                const data = ctx2d.getImageData(
                    Math.floor(canvas.width / 2) - 2,
                    Math.floor(canvas.height / 2) - 2,
                    4,
                    4,
                ).data;
                let nonZero = 0;
                for (let i = 0; i < data.length; i++) if (data[i] !== 0) nonZero++;
                return { nonEmpty: nonZero > 0, sampled: "2d", nonZero };
            }
        } catch (e) {
            // CORS-tainted or context lost — fall through to the DOM heuristic.
        }
    }

    // DOM subject path: the subject is a styled element (cube/square/cards).
    // Non-empty = the element has a rendered box with a visible paint
    // (background, border, or text) — a blank scene has none.
    const cs = getComputedStyle(el);
    const hasPaint =
        cs.backgroundColor !== "rgba(0, 0, 0, 0)" ||
        parseFloat(cs.borderTopWidth) > 0 ||
        (el.textContent ?? "").trim().length > 0 ||
        cs.backgroundImage !== "none" ||
        cs.transform !== "none";
    return { nonEmpty: hasPaint, sampled: "dom", tag: el.tagName };
};

// ── Screenshot matrix (before|after) ────────────────────────────────────────

async function screenshotMatrix(phase) {
    const OUT =
        process.argv[3] ??
        path.join(REPO, `docs/tranches/B/audit/screenshots/${phase}`);
    const chromium = resolveChromium();
    if (!chromium) {
        console.error("capture — playwright not resolvable (set KF_PLAYWRIGHT_DIR).");
        process.exit(2);
    }
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        console.error("capture — dist/gh-pages not built (run `npm run gh-pages`).");
        process.exit(2);
    }
    fs.mkdirSync(OUT, { recursive: true });
    const runOpen = !!process.env.KF_CAPTURE_OPEN_PANEL;

    const { url, close } = await serveDist(DIST);
    const browser = await chromium.launch();
    const report = [];

    for (const scene of SCENES) {
        for (const vp of VIEWPORTS) {
            const states = runOpen ? ["closed", "open"] : ["closed"];
            for (const controls of states) {
                const page = await browser.newPage({
                    viewport: { width: vp.width, height: vp.height },
                });
                const consoleErrors = [];
                page.on("console", (m) => {
                    if (m.type() === "error") consoleErrors.push(m.text());
                });
                page.on("pageerror", (e) =>
                    consoleErrors.push("PAGEERROR: " + e.message),
                );
                await page.goto(`${url}/#/${scene.route}`, { waitUntil: "load" });
                await page.waitForTimeout(2500);
                if (controls === "open") await openControlsPanel(page);
                const suffix = controls === "open" ? "-open" : "";
                const file = `${scene.key}-${vp.name}${suffix}.png`;
                await page.screenshot({ path: path.join(OUT, file) });
                report.push({
                    page: scene.key,
                    viewport: vp.name,
                    controls,
                    file,
                    consoleErrors,
                });
                console.log(
                    `  ${file.padEnd(26)} ${consoleErrors.length ? `⚠ ${consoleErrors.length} console error(s)` : "✓ clean"}`,
                );
                await page.close();
            }
        }
    }

    await browser.close();
    await close();

    fs.writeFileSync(
        path.join(OUT, "_capture-report.json"),
        JSON.stringify(report, null, 2),
    );
    const dirty = report.filter((r) => r.consoleErrors.length);
    console.log(
        `\ncapture (${phase}) — ${report.length} screenshots → ${path.relative(REPO, OUT)}` +
            (dirty.length
                ? `; console errors on: ${dirty.map((r) => `${r.page}/${r.viewport}`).join(", ")}`
                : "; zero console errors"),
    );
}

// ── --reduced-motion probe + contrast table (C.W1 S3) ───────────────────────

// The π-FULL scenes: spring + cube (the named reduced-motion scenes — the
// runtime confirmation of B.W2's rest-position contract on the rendered scene).
const RM_SCENES = SCENES.filter((s) => s.key === "spring" || s.key === "cube");
const RM_FRAME_COUNT = 6; // ≥ 5 frames spanning the named duration
const RM_DURATION_MS = 2000; // the named-animation window the frames span

async function reducedMotionProbe() {
    const OUT =
        process.argv[3] ?? path.join(REPO, "docs/tranches/C/audit/capture");
    const chromium = resolveChromium();
    if (!chromium) {
        console.error("capture — playwright not resolvable (set KF_PLAYWRIGHT_DIR).");
        process.exit(2);
    }
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        console.error("capture — dist/gh-pages not built (run `npm run gh-pages`).");
        process.exit(2);
    }
    fs.mkdirSync(OUT, { recursive: true });

    const rmHonored = !!process.env.KF_RM_HONORED;
    const { url, close } = await serveDist(DIST);
    const browser = await chromium.launch();

    console.log(
        "capture — π FULL: reduced-motion animation-timing probe + contrast table",
    );
    console.log(
        rmHonored
            ? "  KF_RM_HONORED=1 — the rest-frame assertion is HARD this run."
            : "  KF_RM_HONORED unset — RM not yet honored (C.W3 lands it); the" +
                  " probe runs + records, the rest-frame check is a NOTE (no exit-1).",
    );

    const report = { reducedMotion: [], contrast: [], rmHonored };
    const failures = [];

    for (const scene of RM_SCENES) {
        // Emulate prefers-reduced-motion: reduce in a REAL browser.
        const context = await browser.newContext({
            viewport: { width: 1280, height: 800 },
            reducedMotion: "reduce",
        });
        const page = await context.newPage();
        try {
            await page.emulateMedia({ reducedMotion: "reduce" });
            await page.goto(`${url}/#/${scene.route}`, { waitUntil: "load" });
            await page.waitForTimeout(2500);
            // Drive into the editing state so the animation surface is live.
            await openControlsPanel(page);

            const rect = await subjectRect(page, scene.subjectSelector);
            const sceneRec = {
                scene: scene.key,
                reducedMotion: true,
                durationMs: RM_DURATION_MS,
                subjectRect: rect,
                frames: [],
            };

            // Capture ≥ 5 frames spanning the named duration. Each frame is a
            // screenshot artefact + a non-empty pixel-sample record over the
            // subject rect.
            const step = RM_DURATION_MS / (RM_FRAME_COUNT - 1);
            for (let i = 0; i < RM_FRAME_COUNT; i++) {
                const t = Math.round(i * step);
                const sample = rect
                    ? await page.evaluate(PIXEL_NONEMPTY, rect)
                    : { nonEmpty: false, reason: "no subject rect" };
                const file = `rm-${scene.key}-frame${i}.png`;
                if (rect) {
                    await page.screenshot({
                        path: path.join(OUT, file),
                        clip: {
                            x: Math.max(0, rect.x),
                            y: Math.max(0, rect.y),
                            width: Math.max(1, rect.width),
                            height: Math.max(1, rect.height),
                        },
                    });
                }
                sceneRec.frames.push({ index: i, atMs: t, file, sample });
                if (i < RM_FRAME_COUNT - 1) await page.waitForTimeout(step);
            }

            // The FINAL frame's pixel sample is the rest-frame assertion target.
            const finalFrame = sceneRec.frames[sceneRec.frames.length - 1];
            const finalNonEmpty = !!finalFrame?.sample?.nonEmpty;
            sceneRec.finalFrameNonEmpty = finalNonEmpty;

            const measured = `${sceneRec.frames.length} frames over ${RM_DURATION_MS}ms; final-frame non-empty: ${finalNonEmpty}`;
            if (finalNonEmpty) {
                console.log(`  ✓ ${scene.key}: ${measured}`);
            } else if (rmHonored) {
                // C.W3: RM honored — a blank rest frame is a real failure.
                console.error(`  ✗ ${scene.key}: ${measured} (RM honored — rest frame must paint)`);
                failures.push(`${scene.key}: reduced-motion rest frame is empty`);
            } else {
                // C.W1: RM not yet honored — record, do NOT fail.
                console.log(
                    `  ○ ${scene.key}: ${measured} — NOTE: RM not yet honored (C.W3); not gated.`,
                );
            }
            report.reducedMotion.push(sceneRec);

            // Contrast table for this scene's surfaces (editing state).
            const contrast = await page.evaluate(CONTRAST_PROBE);
            report.contrast.push({ scene: scene.key, surfaces: contrast });
        } finally {
            await page.close();
            await context.close();
        }
    }

    // The DISPLAY-heading surface (the splash <h1> serif) only renders on the
    // home/splash route — the editing state hides it. Measure it where it
    // actually paints so the display surface resolves a real ratio, not `—`.
    {
        const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
        const page = await ctx.newPage();
        try {
            await page.goto(`${url}/#/`, { waitUntil: "load" });
            await page.waitForTimeout(2500);
            const contrast = await page.evaluate(CONTRAST_PROBE);
            report.contrast.push({ scene: "home-splash", surfaces: contrast });
        } finally {
            await page.close();
            await ctx.close();
        }
    }

    await browser.close();
    await close();

    // ── Emit artefacts: the JSON report + a readable contrast/RM table. ──
    fs.writeFileSync(
        path.join(OUT, "reduced-motion-report.json"),
        JSON.stringify(report, null, 2),
    );

    const lines = [];
    lines.push("# C.W1 S3 — π FULL capture artefact");
    lines.push("");
    lines.push("## Reduced-motion animation-timing probe");
    lines.push("");
    lines.push("Emulated `prefers-reduced-motion: reduce` in a real Chromium;");
    lines.push(
        `≥${RM_FRAME_COUNT - 1} frames captured over the named ${RM_DURATION_MS}ms window per scene.`,
    );
    lines.push("");
    lines.push(
        rmHonored
            ? "KF_RM_HONORED=1 — the final-frame non-empty assertion is HARD."
            : "KF_RM_HONORED unset — RM not yet honored (C.W3 lands it). The probe" +
                  " RUNS + RECORDS the measured frames; the rest-frame assertion is a" +
                  " NOTE, not a gate (inv ε: deferred, not met). C.W3 flips KF_RM_HONORED=1.",
    );
    lines.push("");
    lines.push("| scene | frames | window | final-frame non-empty |");
    lines.push("| --- | --- | --- | --- |");
    for (const r of report.reducedMotion) {
        lines.push(
            `| ${r.scene} | ${r.frames.length} | ${r.durationMs}ms | ${r.finalFrameNonEmpty} |`,
        );
    }
    lines.push("");
    lines.push("## Per-surface contrast-vs-background (measured WCAG ratios)");
    lines.push("");
    lines.push("| scene | surface | fg | bg | ratio | AA (≥4.5) | AA-large (≥3) |");
    lines.push("| --- | --- | --- | --- | --- | --- | --- |");
    for (const c of report.contrast) {
        for (const s of c.surfaces) {
            lines.push(
                `| ${c.scene} | ${s.surface} | ${s.fg ?? "—"} | ${s.bg ?? "—"} | ${s.ratio ?? "—"} | ${s.passAA ?? "—"} | ${s.passAALarge ?? "—"} |`,
            );
        }
    }
    lines.push("");
    fs.writeFileSync(path.join(OUT, "capture-report.md"), lines.join("\n") + "\n");

    console.log(
        `\ncapture (--reduced-motion) — ${report.reducedMotion.length} RM scene(s), ` +
            `${report.contrast.reduce((n, c) => n + c.surfaces.length, 0)} contrast rows ` +
            `→ ${path.relative(REPO, OUT)} (reduced-motion-report.json + capture-report.md)`,
    );

    // INV-ε: only exit-1 on the RM rest-frame path once KF_RM_HONORED=1.
    if (failures.length > 0 && rmHonored) {
        console.error(`\ncapture — FAIL (${failures.length}): reduced-motion rest frame did not paint.`);
        process.exit(1);
    }
    console.log(
        rmHonored
            ? "\ncapture — PASS: reduced-motion paints its rest frame; contrast measured."
            : "\ncapture — DONE: RM probe + contrast emitted; RM-honored gate deferred to C.W3 (KF_RM_HONORED).",
    );
}

// ── Dispatch ────────────────────────────────────────────────────────────────

async function main() {
    if (arg1 === "--reduced-motion") {
        await reducedMotionProbe();
    } else {
        await screenshotMatrix(arg1);
    }
}

main().catch((err) => {
    console.error("capture — ERROR:", err);
    process.exit(3);
});
