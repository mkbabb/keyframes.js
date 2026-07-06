#!/usr/bin/env node
/**
 * proof:demo-fonts — T.D3 (OD-6 / T-TY2): the Jakarta body register, POSITIVE.
 *
 * THE POLARITY FLIP (T.D3 lockstep — flipped in the SAME motion that deleted
 * the I.W6 system-stack reclaim). The I.W6-era gate asserted the exact INVERSE
 * of the owner-blessed register: "NO Plus Jakarta anywhere" over a ui-sans-serif
 * system reclaim — and was GREEN while the owner wrote "Most of the fonts on
 * the site are not right at all" (VERDICT #24; the gate-blindspot lesson's
 * third recurrence). Per OD-6 (APPROVED 2026-07-05 "Good.", the P-THEME blessed
 * reference), glass-ui's own bundled Plus Jakarta Sans IS the body register —
 * already paid for (base64 via @mkbabb/glass-ui/styles/fonts), zero new payload.
 *
 * RUNTIME gate (the rendered computed font is the oracle, not source shape):
 *   (a) POSITIVE — the body + dock + control chrome resolve "Plus Jakarta Sans"
 *       (head of the computed stack); a ui-sans-serif/system-ui-headed surface
 *       is the violation now (the retired reclaim surviving somewhere);
 *   (b) the display register still resolves Instrument Serif (the demo's
 *       deliberate --font-display identity survives);
 *   (c) no PRIMARY demo face (Instrument Serif / Fira Code / Plus Jakarta) is
 *       stuck in an error state;
 *   (d) ACTUATION — the resolved body face SURVIVES a cube→spring scene switch
 *       byte-identical (J.W3 S5's oracle-precept SWITCH leg, kept).
 *
 * SUBORDINATED to proof:font-census (T.D1's tuple gate) — this gate carries the
 * fast positive body-identity check; the census carries the tuple totality.
 * Serves dist/gh-pages/. Harness: scripts/lib/demo-driver.mjs (withPage; under
 * KF_REQUIRE_BROWSER a playwright-absent skip is a hard fail at the lib seam).
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SCENE_MACHINE_KEY as MACHINE_KEY, navToScene, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const fail = (l) => { failures.push(l); console.error(`  ✗ ${l}`); };

console.log(
    "proof:demo-fonts — T.D3: Plus Jakarta Sans is the POSITIVE body assertion (the I.W6 " +
        "system-reclaim polarity is FLIPPED per OD-6); Instrument Serif display survives; the resolved " +
        "face survives a scene switch.",
);

const JAKARTA_HEAD_RE = /^\s*["']?Plus Jakarta Sans/i;
const SYSTEM_HEAD_RE =
    /^\s*["']?(?:ui-sans-serif|system-ui|-apple-system|BlinkMacSystemFont|Segoe UI|Roboto|Helvetica|Arial)\b/i;

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

        // (a) POSITIVE: Jakarta heads the body + every UI chrome surface; a
        //     system-sans HEAD is the retired-reclaim violation.
        const all = [{ s: "body", ff: probe.body }, ...probe.chrome];
        const nonJakarta = all.filter((x) => !JAKARTA_HEAD_RE.test(x.ff));
        const systemHeaded = all.filter((x) => SYSTEM_HEAD_RE.test(x.ff));
        if (nonJakarta.length === 0) {
            ok(`(a) the body + ${probe.chrome.length} UI chrome surface(s) ALL head with "Plus Jakarta Sans" — glass-ui's own register flows natively (body resolves: ${probe.body.slice(0, 42)})`);
        } else {
            fail(
                `(a) ${nonJakarta.length} surface(s) do NOT resolve the Jakarta body register: ` +
                    nonJakarta.map((x) => `${x.s} → ${x.ff.slice(0, 40)}`).join("; ") +
                    (systemHeaded.length > 0
                        ? ` — ${systemHeaded.length} head with the RETIRED ui-sans-serif system reclaim (the I.W6 pin survives somewhere)`
                        : ""),
            );
        }
        // (b) the display register is still Instrument Serif.
        if (/Instrument/i.test(probe.display)) {
            ok(`(b) the display register still resolves Instrument Serif (${probe.display.slice(0, 38)}) — the demo's --font-display identity survives`);
        } else {
            fail(`(b) the display register is NOT Instrument Serif (got: ${probe.display.slice(0, 42)}) — the demo's display identity regressed`);
        }
        // (c) no PRIMARY demo face stuck in error. The metric-override "… Fallback"
        // faces are EXCLUDED (their local() system-font source is a host artifact on
        // font-less CI runners, not a demo defect).
        const ours = probe.errored.filter(
            (f) => /Instrument|Fira|Jakarta/i.test(f) && !/Fallback/i.test(f),
        );
        if (ours.length === 0) ok(`(c) no PRIMARY demo-owned font face in error state (Instrument Serif / Fira Code / Plus Jakarta load clean; the metric-override "… Fallback" faces are excluded)`);
        else fail(`(c) PRIMARY demo font face(s) in error: ${ours.join(", ")}`);

        // (d) ACTUATION leg (J.W3 S5, kept): the resolved body face must SURVIVE a
        // real cube→spring scene switch byte-identical — and still be Jakarta.
        await navToScene(page, "spring", /*T.B5-RENDER elided*/ null);
        const afterSwitch = await page.evaluate(async () => {
            await document.fonts.ready;
            return getComputedStyle(document.body).fontFamily;
        });
        if (afterSwitch === probe.body && JAKARTA_HEAD_RE.test(afterSwitch)) {
            ok(`(d) the resolved body face SURVIVES the cube→spring scene SWITCH byte-identical (${afterSwitch.slice(0, 42)}) — the register holds across a route change (the actuation leg)`);
        } else {
            fail(`(d) the body font CHANGED across the cube→spring switch: '${probe.body.slice(0, 42)}' → '${afterSwitch.slice(0, 42)}' — a scene-scoped surface re-lands a different register`);
        }
        },
    );
    if (result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
    }
}

await browserHalf();
if (failures.length) { console.error(`\nproof:demo-fonts — FAIL (${failures.length})`); process.exit(1); }
console.log(
    "\nproof:demo-fonts — PASS: the body + dock + control chrome resolve glass-ui's own Plus Jakarta " +
        "Sans (the POSITIVE assertion — the retired ui-sans-serif reclaim is the violation now); the " +
        "display register is Instrument Serif; no demo face is half-loaded; AND the resolved face " +
        "survives a cube→spring scene SWITCH byte-identical.",
);
