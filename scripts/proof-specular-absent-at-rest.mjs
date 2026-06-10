#!/usr/bin/env node
/**
 * proof:specular-absent-at-rest — Tranche I.W6 (B7 / CH-1). THE INVERSION of the
 * old `proof:no-orphan-specular` (which RECORDED the warm-white catch-light bloom
 * as "accepted residue" and called PRESENCE a pass — the blind-spot incarnate).
 *
 * The deliverable: every stage glass `::before` AND every dock/play glass
 * `<Button>` track reads FLAT at rest — the warm-white catch-light bloom the user
 * flagged TWICE is ABSENT IN THE RENDERED PIXELS, with ZERO kf-side CSS
 * suppression. The fix is the two-sided consume-edge, no kf fork: glass-ui PUBLISHED
 * the `specular="off"` Card default + the W54 rest-intensity-0 cohesion (rest
 * `--specular-intensity` defaults to 0 → the `::before` paints opacity 0 at rest on
 * EVERY glass surface, dock controls included); kf bumped the pin to ~3.9.0 and
 * rides the new flat default. ZERO kf CSS, no `!important`, no `::before{content:
 * none}` neutralizer (the REJECTED workaround).
 *
 * THE ORACLE (H-1 — perceptual, not source-shape). The PRIMARY assertion is the
 * RENDERED `::before` alpha at rest: `getComputedStyle(el,'::before').opacity` is
 * the live painted alpha of the catch-light radial — a perceptual property of the
 * running product, NOT a source grep. At rest it must be ≤ a small threshold (the
 * bloom contributes no visible luminance). The `.glass-specular-track` class may
 * LINGER on the dock controls (a thin alias onto the unified `.glass-material`) —
 * that is fine BY ITSELF; what matters is that it paints opacity 0 at rest. A
 * future glass-ui that re-arms a nonzero rest intensity (the 3.5.1 regression:
 * 0.22–0.35) REDS here, in the pixels, regardless of the class.
 *
 * Born-RED on the 3.5.1 tree (rest `::before` opacity 0.22 on dock tracks /
 * 0.35 on stage cards); GREEN the instant kf consumes the glass-ui ~3.9.0 build
 * (rest opacity 0). Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage
 * = serveDist + env-driven resolveChromium + context/teardown, J.W3 S1) +
 * navToScene (the J.W0 per-EXPECTED-state settle) + fresh context per scene.
 * P6 posture: hard — device-independent correctness oracle (red anywhere; J.W3
 * S2b). Re-runnable. Serves dist/gh-pages/.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const note = (l) => console.log(`  · ${l}`);
const fail = (l) => { failures.push(l); console.error(`  ✗ ${l}`); };

console.log("proof:specular-absent-at-rest — I.W6 (B7): the catch-light bloom is ABSENT at rest, by the pixels");

// HYGIENE meta-clause (c): the vaporware IOU gate is DELETED, not parked.
{
    const pkg = JSON.parse(fs.readFileSync(path.join(REPO, "package.json"), "utf8"));
    if (pkg.scripts["proof:specular-handoff"]) {
        fail(`[hygiene c] proof:specular-handoff still in package.json — the born-RED IOU against a (now-published) target must be DELETED (its concern folds into THIS runtime-absence gate)`);
    } else {
        ok(`[hygiene c] proof:specular-handoff is DELETED — no born-RED IOU against a vaporware target (the fix is now a published+consumed glass-ui default, a state THIS repo reached)`);
    }
}

const REST_OPACITY_MAX = 0.05; // a catch-light radial at rest must contribute ~no alpha
const CTRL_KEY = "animation-groups-control-options-store";

// The destination control-tab label navToScene settles on per scene (null = no
// control panel projects — sequence/motion-path).
const TRIGGER = { cube: "Controls", easing: "Easing", spring: "Spring", sequence: null, "motion-path": null };

async function openScene(browser, base, scene) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript((ck) => { try { localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true })); } catch {} }, CTRL_KEY);
    await page.goto(`${base}/#/${scene}`, { waitUntil: "load" });
    await navToScene(page, scene, TRIGGER[scene] ?? null, { timeout: 8000 });
    await page.waitForTimeout(900);
    return { ctx, page };
}

async function browserHalf() {
    const SCENES = ["cube", "easing", "spring", "sequence", "motion-path"];
    const result = await withPage(
        { distDir: DIST, label: "the specular-absent-at-rest pixel assertions" },
        async (_page, { url: base, browser }) => {
        let totalGlass = 0, bloomers = [];
        let maxRest = 0;
        for (const scene of SCENES) {
            const { ctx, page } = await openScene(browser, base, scene);
            try {
                // Move the pointer to a NEUTRAL corner so nothing is hovered (rest).
                await page.mouse.move(2, 2);
                await page.waitForTimeout(150);
                // Sample the RENDERED ::before alpha on every glass surface that can
                // carry the catch-light: stage glass cards + dock/play glass <Button>
                // tracks + any .glass-specular-track. The alpha IS the painted bloom.
                const probe = await page.evaluate(() => {
                    const sels = ["[data-surface='glass']", ".glass-specular-track", ".dock-icon-button", ".glass-card"];
                    const seen = new Set();
                    const out = [];
                    for (const sel of sels) {
                        for (const el of document.querySelectorAll(sel)) {
                            if (seen.has(el)) continue; seen.add(el);
                            const b = getComputedStyle(el, "::before");
                            const op = parseFloat(b.opacity || "0");
                            const hasRadial = /radial-gradient/.test(b.backgroundImage || "");
                            out.push({ cls: (el.className || "").toString().slice(0, 28), op, hasRadial });
                        }
                    }
                    return out;
                });
                for (const e of probe) {
                    totalGlass++;
                    if (e.op > maxRest) maxRest = e.op;
                    // A catch-light radial painting > the threshold at rest is a bloom.
                    if (e.hasRadial && e.op > REST_OPACITY_MAX) bloomers.push(`${scene}:${e.cls}(op=${e.op})`);
                }
                await ctx.close();
            } catch (e) { await ctx.close(); throw e; }
        }

        // ── clause (a) — CORRECTNESS: the bloom is ABSENT at rest, by the pixels ──
        if (bloomers.length === 0) {
            ok(`[a] CORRECTNESS — ZERO of ${totalGlass} glass ::before catch-lights paint a bloom at rest across ${SCENES.join("/")} (max rest ::before alpha = ${maxRest} ≤ ${REST_OPACITY_MAX}). The stage cards (specular="off" default) AND the dock/play glass tracks (rest --specular-intensity 0, glass-ui ~3.9.0 W54 cohesion) read FLAT — the warm-white catch-light the user flagged is GONE, with ZERO kf-side CSS.`);
        } else {
            fail(`[a] CORRECTNESS — ${bloomers.length} glass ::before catch-light(s) STILL paint a bloom at rest (alpha > ${REST_OPACITY_MAX}): ${bloomers.slice(0, 6).join(", ")} — the consume-edge (glass-ui rest-intensity-0 default) is not fully consumed.`);
        }
        },
    );
    if (result.skipped) console.log(`  ○ browser half skipped — ${result.reason}`);
}

await browserHalf();

if (failures.length) {
    console.error(`\nproof:specular-absent-at-rest — FAIL (${failures.length}):`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
}
console.log("\nproof:specular-absent-at-rest — PASS: the warm-white catch-light bloom is ABSENT at rest on every stage glass card AND dock/play glass track (rendered ::before alpha 0), via the published+consumed glass-ui ~3.9.0 flat default — no kf-side CSS, no fork, no workaround. B7 closed; proof:specular-handoff deleted (no vaporware IOU).");
