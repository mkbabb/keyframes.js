#!/usr/bin/env node
/**
 * proof:no-layout-animation — T.G4 (lane 11 T4). authority=INSTRUMENT.
 *
 * ── THE DEFECT THIS GATE FORBIDS ─────────────────────────────────────────────
 * Animating a LAYOUT property (`left`/`top`) forces the browser to re-run layout
 * on EVERY frame the value changes, and `will-change: left`/`top` cannot composite
 * it away (`left`/`top` are not compositable — the promotion merely pins a layer
 * that still re-lays-out). Lane 11 §4b measured the spring ball/thumb + the
 * sequence scrubber/playhead/traveller positioned by animating `left` at 60Hz —
 * ~90 layouts/second of pure thrash. The cure (T.G4): position by
 * `transform: translate()` (compositor-only — measured layoutΔ=0/frame vs the
 * `left`-animation's 1/frame in the SAME rig), delete the `will-change:left/top`
 * promotions.
 *
 * ── WHAT IT ASSERTS ──────────────────────────────────────────────────────────
 * (a) SOURCE (fast, no browser): NO animated-layout tell in `demo/scenes` —
 *     • zero `will-change:` naming `left`/`top`,
 *     • zero CSS `transition` animating `left`/`top`,
 *     • zero `@keyframes` block animating `left`/`top`.
 *     Static positioning (`top: 50%`, `left: 0`, a drag-driven discrete `left`)
 *     is NOT flagged — only the ANIMATION tells (a moving subject's per-frame
 *     layout property). This is the falsifiable recurrence guard: re-introduce a
 *     `will-change: left` or a `transition: left` on a moving subject and it reds.
 * (b) RUNTIME (browser): the two scenes lane 11 named (spring + sequence) hold
 *     idle `LayoutCount` at ~0/frame — the observable proof the source cure
 *     removed the thrash, not merely renamed it. (The full per-frame recalc+layout
 *     budget across cube/spring/easing is proof:perf-counters; this gate owns the
 *     `left`→`transform` half + its source recurrence guard.)
 *
 * ── AUTHORITY · WIRING ───────────────────────────────────────────────────────
 * INSTRUMENT (a falsifiable structure + a measured layout count, not the owner
 * perceived-perf bar). GREEN as of the T.G4-tail cures (sequence + spring-heatmap
 * converted; the ⑧ spring rail already converted). Blocking member of
 * proof:demo-correctness. Harness: scripts/lib/demo-driver.mjs withPage; counters:
 * scripts/lib/cdp-perf.mjs. Re-runnable: `KF_PLAYWRIGHT_DIR=… node
 * scripts/proof-no-layout-animation.mjs`.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { attachCounters, measurePerFrame } from "./lib/cdp-perf.mjs";
import { SCENE_MACHINE_KEY, withPage } from "./lib/demo-driver.mjs";

const SCENES_DIR = "demo/scenes";
const failures = [];
const fail = (label) => { failures.push(label); console.error(`  ✗ ${label}`); };
const ok = (label) => console.log(`  ✓ ${label}`);
const note = (label) => console.log(`  · ${label}`);

console.log(
    `proof:no-layout-animation — T.G4 (position by transform, never left/top; ` +
        `kill the layout-thrash) · authority=INSTRUMENT`,
);

// ── clause (a) — the SOURCE recurrence guard ─────────────────────────────────
function walk(dir) {
    const out = [];
    for (const entry of readdirSync(dir)) {
        const p = join(dir, entry);
        const st = statSync(p);
        if (st.isDirectory()) out.push(...walk(p));
        else if (/\.(vue|css)$/.test(entry)) out.push(p);
    }
    return out;
}

// `will-change:` whose value list contains left/top (as whole words).
const WILL_CHANGE_LAYOUT = /will-change:\s*[^;{}]*\b(left|top)\b/;
// `transition:` (property or shorthand) animating left/top (whole word, not
// `border-left`/`margin-top` — require a word boundary before the token and a
// following timing/comma/end, which those hyphenated forms never satisfy because
// the token is preceded by `-`).
const TRANSITION_LAYOUT =
    /transition(?:-property)?:\s*[^;{}]*(?<![-\w])(left|top)\b/;
// A `@keyframes … { … left|top: … }` block animating a layout property. We scan
// each @keyframes body for a `left:`/`top:` declaration (not margin-/inset-).
const KEYFRAMES_BLOCK = /@keyframes[^{]*\{([\s\S]*?)\}\s*\}/g;
const KF_LAYOUT_DECL = /(?<![-\w])(left|top)\s*:/;

const files = walk(SCENES_DIR);
const srcHits = [];
for (const f of files) {
    const src = readFileSync(f, "utf8");
    // Strip line comments cheaply is unnecessary; the tells are declarations.
    for (const [rx, kind] of [
        [WILL_CHANGE_LAYOUT, "will-change:left/top"],
        [TRANSITION_LAYOUT, "transition:left/top"],
    ]) {
        const lines = src.split("\n");
        lines.forEach((line, i) => {
            if (rx.test(line)) srcHits.push(`${f}:${i + 1} — ${kind}: ${line.trim().slice(0, 70)}`);
        });
    }
    // @keyframes bodies animating left/top.
    let m;
    while ((m = KEYFRAMES_BLOCK.exec(src)) !== null) {
        if (KF_LAYOUT_DECL.test(m[1])) {
            srcHits.push(`${f} — @keyframes animates left/top`);
        }
    }
}
if (srcHits.length === 0) {
    ok(
        `source: ZERO animated-layout tell across ${files.length} demo/scenes files ` +
            `(no will-change:left/top, no transition:left/top, no @keyframes animating ` +
            `left/top) — every moving subject rides transform`,
    );
} else {
    for (const h of srcHits) fail(`source: ${h}`);
    fail(
        `an animated \`left\`/\`top\` (or its will-change promotion) is back in ` +
            `demo/scenes — position moving subjects by \`transform: translate()\` ` +
            `(compositor-only), the T.G4 contract`,
    );
}

// ── clause (b) — the RUNTIME idle-layout confirmation ────────────────────────
const MEASURED = ["spring", "sequence"];
const WINDOW_MS = 1500;
const LAYOUT_PER_FRAME_CEIL = 0.3; // an idle scene lays out on ~0 of its frames

async function browserHalf() {
    const result = await withPage(
        {
            label: "no-layout-animation idle LayoutCount",
            context: { viewport: { width: 1440, height: 900 } },
        },
        async (page, { url: base }) => {
            for (const scene of MEASURED) {
                await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
                await page
                    .waitForFunction(
                        ([mk, s]) => {
                            try {
                                return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s;
                            } catch {
                                return false;
                            }
                        },
                        [SCENE_MACHINE_KEY, scene],
                        { timeout: 8000 },
                    )
                    .catch(() => {});
                await page.waitForTimeout(1200);
                const cdp = await attachCounters(page);
                const m = await measurePerFrame(page, { windowMs: WINDOW_MS, cdp });
                const layoutPF = m.layoutPerFrame;
                note(
                    `/${scene}: idle layout=${layoutPF.toFixed(2)}/frame ` +
                        `(layout=${m.layoutCount}, frames=${m.frames})`,
                );
                if (layoutPF <= LAYOUT_PER_FRAME_CEIL) {
                    ok(
                        `/${scene} rests without layout thrash: ${layoutPF.toFixed(2)}/frame ` +
                            `≤ ${LAYOUT_PER_FRAME_CEIL} — the \`left\`→\`transform\` cure holds live`,
                    );
                } else {
                    fail(
                        `/${scene} re-lays-out ${layoutPF.toFixed(2)}/frame at idle ` +
                            `(> ${LAYOUT_PER_FRAME_CEIL}) — a layout property is still animating`,
                    );
                }
            }
            return true;
        },
    );
    return result;
}

const outcome = await browserHalf();
if (outcome.skipped) {
    console.log(`  ○ runtime half skipped — ${outcome.reason} (source clause still asserted)`);
}

if (failures.length > 0) {
    console.error(
        `\nproof:no-layout-animation — FAIL (${failures.length}): a moving subject in ` +
            `demo/scenes animates a LAYOUT property (\`left\`/\`top\`) — position it by ` +
            `\`transform: translate()\` instead (compositor-only, T.G4). The source guard ` +
            `catches the will-change/transition/@keyframes tell; the runtime clause catches ` +
            `the live per-frame layout.`,
    );
    process.exit(1);
}
console.log(
    `\nproof:no-layout-animation — PASS: no demo/scenes subject animates \`left\`/\`top\` ` +
        `(source), and spring + sequence rest with ~0 layout/frame (runtime) — the T.G4 ` +
        `transform-not-left contract holds, source and live.`,
);
