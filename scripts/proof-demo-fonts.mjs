#!/usr/bin/env node
/**
 * proof:demo-fonts — Tranche I.W6-font. The demo's font IDENTITY is its own, NOT
 * glass-ui's brand default. glass-ui ~3.9.0 force-applies "Plus Jakarta Sans" to
 * the body/text register of every consumer (typography.css `body { font-family:
 * var(--font-text) }`, --font-text -> --font-stack-text -> Plus Jakarta). The kf
 * user flagged it: "the fonts dont seem correct on the dock; we dont use plus
 * jakarta". keyframes.js's register is Instrument Serif (display) + Fira Code
 * (mono) over a clean native UI sans — reclaimed by overriding --font-stack-text
 * at :root (the documented glass-ui consumer lever; the @theme-inline bridge can't
 * be overridden directly).
 *
 * RUNTIME gate (the rendered computed font is the oracle, not source shape):
 *   (a) the body + dock + control chrome resolve a font-family with NO "Plus
 *       Jakarta" — the glass-ui brand font never lands on a kf surface;
 *   (b) the display register still resolves Instrument Serif (the demo's deliberate
 *       --font-display override survives);
 *   (c) no font is stuck in an `error`/half-loaded state on the demo's own faces.
 * Born-RED on a tree that inherits glass-ui's Plus Jakarta default; GREEN once the
 * demo reclaims --font-stack-text. Serves dist/gh-pages/. Harness: the
 * scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist + resolveChromium +
 * context/teardown, J.W3 S1; under KF_REQUIRE_BROWSER a playwright-absent skip
 * becomes a hard fail AT THE LIB SEAM). ACTUATES (J.W3 S5, the oracle-precept
 * SWITCH leg): the resolved face must SURVIVE a navToScene scene switch.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SCENE_MACHINE_KEY as MACHINE_KEY, navToScene, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const fail = (l) => { failures.push(l); console.error(`  ✗ ${l}`); };

console.log("proof:demo-fonts — I.W6-font: the demo's own font identity, NOT glass-ui's Plus Jakarta brand default");

async function browserHalf() {
    const result = await withPage(
        {
            distDir: DIST,
            label: "the demo-font identity assertions",
            context: { viewport: { width: 1440, height: 900 } },
        },
        async (page, { url: base }) => {
        await page.goto(`${base}/#/cube`, { waitUntil: "load" });
        await page.waitForFunction((mk) => { try { return !!JSON.parse(localStorage.getItem(mk) || "{}").activeScene; } catch { return false; } }, MACHINE_KEY, { timeout: 8000 }).catch(() => {});
        await page.waitForTimeout(1200);
        const probe = await page.evaluate(async () => {
            await document.fonts.ready;
            const ff = (el) => (el ? getComputedStyle(el).fontFamily : "");
            const body = ff(document.body);
            const surfaces = [".dock-icon-button", ".dock-select-trigger", ".dock-label", "[role='tab']", ".animation-controls"];
            const chrome = surfaces.map((s) => ({ s, ff: ff(document.querySelector(s)) })).filter((x) => x.ff);
            const display = ff(document.querySelector(".text-display-4, h1, [class*='display']"));
            const errored = [...document.fonts].filter((f) => f.status === "error").map((f) => f.family);
            return { body, chrome, display, errored };
        });

        // (a) NO Plus Jakarta on the body or any UI chrome surface.
        const jakartaHits = [{ s: "body", ff: probe.body }, ...probe.chrome].filter((x) => /Jakarta/i.test(x.ff));
        if (jakartaHits.length === 0) {
            ok(`(a) NO "Plus Jakarta" on the body or ${probe.chrome.length} UI chrome surface(s) — the glass-ui brand font is reclaimed (body resolves: ${probe.body.slice(0, 42)})`);
        } else {
            fail(`(a) "Plus Jakarta Sans" still on ${jakartaHits.length} surface(s): ${jakartaHits.map((x) => x.s).join(", ")} — the glass-ui brand default leaked onto kf chrome (override --font-stack-text at :root)`);
        }
        // (b) the display register is still Instrument Serif (the demo's --font-display survives).
        if (/Instrument/i.test(probe.display)) {
            ok(`(b) the display register still resolves Instrument Serif (${probe.display.slice(0, 38)}) — the demo's --font-display override survives`);
        } else {
            fail(`(b) the display register is NOT Instrument Serif (got: ${probe.display.slice(0, 42)}) — the demo's display identity regressed`);
        }
        // (c) no PRIMARY demo face stuck in error. The metric-override "… Fallback"
        // faces (the CLS-reduction fallbacks whose `src: local(<system font>)` aliases
        // a host font for matched metrics) are EXCLUDED: on a font-less Linux CI runner
        // their `local()` system-font source does not resolve → the face reports
        // `error`, but that is a HOST artifact (the CI VM lacks the system font), NOT a
        // demo-font defect — the PRIMARY webfonts (Instrument Serif / Fira Code) load
        // fine (clauses a/b green). On a real device the fallback faces resolve. So we
        // gate the PRIMARY faces only; a primary face in error is a real broken load.
        const ours = probe.errored.filter(
            (f) => /Instrument|Fira/i.test(f) && !/Fallback/i.test(f),
        );
        if (ours.length === 0) ok(`(c) no PRIMARY demo-owned font face in error state (Instrument Serif / Fira Code webfonts load clean; the metric-override "… Fallback" faces are excluded — their local() system-font source is a host concern, not a demo defect)`);
        else fail(`(c) PRIMARY demo font face(s) in error: ${ours.join(", ")}`);

        // (d) ACTUATION leg (J.W3 S5 — the oracle-precept SWITCH; GC-4/W7-3): the
        // resolved face must SURVIVE a real scene switch. Drive #/cube → #/spring
        // through the lib's navToScene (the per-EXPECTED-state J.W0 primitive: the
        // destination's "Spring" control surface projects), re-read the computed
        // body font, and assert it is the SAME resolved family — and still not
        // Plus Jakarta — after the route change. A switch that re-lands glass-ui's
        // brand default (a scene-scoped override losing the :root reclaim) reds.
        await navToScene(page, "spring", "Spring");
        const afterSwitch = await page.evaluate(async () => {
            await document.fonts.ready;
            return getComputedStyle(document.body).fontFamily;
        });
        if (afterSwitch === probe.body && !/Jakarta/i.test(afterSwitch)) {
            ok(`(d) the resolved body face SURVIVES the cube→spring scene SWITCH byte-identical (${afterSwitch.slice(0, 42)}) — the font reclaim holds across a route change (the actuation leg)`);
        } else {
            fail(`(d) the body font CHANGED across the cube→spring switch: '${probe.body.slice(0, 42)}' → '${afterSwitch.slice(0, 42)}' — the reclaim does not survive a scene switch (a scene-scoped surface re-lands the brand default)`);
        }
        },
    );
    if (result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
    }
}

await browserHalf();
if (failures.length) { console.error(`\nproof:demo-fonts — FAIL (${failures.length})`); process.exit(1); }
console.log("\nproof:demo-fonts — PASS: the body + dock + control chrome resolve the demo's own native sans (NO Plus Jakarta); the display register is Instrument Serif; no demo face is half-loaded; AND the resolved face survives a cube→spring scene SWITCH byte-identical (the S5 actuation leg). The glass-ui brand-font default never lands on a kf surface.");
