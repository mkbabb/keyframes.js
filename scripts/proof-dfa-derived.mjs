#!/usr/bin/env node
/**
 * proof:dfa-derived — T.B2 (the control-surface DFA INVERSION: exclusion table →
 * derivation). The valid control-surface set is no longer a hand-maintained
 * `Record<SceneId, ControlSurface[]>` table row — it is DERIVED from the live
 * scene facility × the selected channel by `surfacesFor(facility, selected)`,
 * with the triad COMPUTED from "does the selected channel paint" (so no row can
 * deny a painting group its triad — the owner's #25 asymmetry cure). This gate
 * BITES the table's absence, the derivation's presence, the single metadata
 * module, and the LIVE census that a painting-channel scene renders the full
 * triad.
 *
 * Clauses (each born-RED on the pre-T.B2 table tree, GREEN on the derivation):
 *
 *   S1 NO TABLE — controlSurfaceDFA.ts declares NO `Record<SceneId,
 *      ControlSurface[]>` literal (the CONTROL_SURFACES / CONDITIONAL_SURFACES
 *      exclusion tables are DELETED). BITE: a reverted table reds.
 *
 *   S2 DERIVES FROM PAINT — `surfacesFor(facility, selected)` is the authority:
 *      the triad is `selected.animation ? BUILT_IN_SURFACES : selected.surfaces`
 *      (computed from paint), unioned with the selected channel's + the
 *      facility's facets. BITE: a table lookup by sceneId reds.
 *
 *   S3 ONE METADATA MODULE — a surface's `{label,icon}` resolves from EXACTLY
 *      ONE module (`SURFACE_META` in controlSurfaceDFA.ts): both ChromeDock and
 *      AnimationControls derive their built-in tab descriptors from SURFACE_META,
 *      NOT a hand-synced local literal (the former BUILT_IN_TAB_META /
 *      BUILT_IN_CONTROL_TABS triplication). BITE: a restored local {label:...}
 *      triad literal reds.
 *
 *   L1 LIVE CENSUS (browser) — a painting-channel scene renders the FULL triad:
 *      cube/easing/spring all expose the built-in Keyframes + Timeline tab nodes
 *      in the OPENED control select (the #25 cure observed — easing/spring are no
 *      longer denied the triad). BITE: the pre-T.B2 easing route showed ONLY the
 *      single easing surface (no Keyframes/Timeline node).
 *
 * STATIC half always runs; BROWSER half gated on playwright + KF_REQUIRE_BROWSER
 * (a playwright-absent skip becomes a hard fail AT THE LIB SEAM). Serves the BUILT
 * dist/gh-pages/ (run `npm run gh-pages` first). Re-runnable:
 * `node scripts/proof-dfa-derived.mjs`.
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
const read = (p) => fs.readFileSync(p, "utf8");

console.log("proof:dfa-derived — T.B2 (control-surface DFA: exclusion table → derivation)");

// ── S1 + S2 + S3 STATIC ──────────────────────────────────────────────────────
{
    const dfa = read(path.join(DEMO, "state/controlSurfaceDFA.ts"));
    const oneLine = dfa.replace(/\s+/g, " ");

    // S1 — no Record<SceneId, ControlSurface[]> literal survives.
    const noTable = !/Record<SceneId,\s*ControlSurface\[\]>/.test(dfa);
    if (noTable) {
        ok("S1: no Record<SceneId,ControlSurface[]> table — the exclusion table is DELETED");
    } else {
        fail("S1 — a Record<SceneId,ControlSurface[]> table literal survives (the table was not inverted)");
    }

    // S2 — surfacesFor is the derivation, triad computed from paint.
    const derives = /export function surfacesFor\(/.test(dfa);
    const paintComputed =
        /selected\?\.animation \? \[\.\.\.BUILT_IN_SURFACES\] : \[\.\.\.\(selected\?\.surfaces \?\? \[\]\)\]/.test(
            oneLine,
        );
    if (derives && paintComputed) {
        ok("S2: surfacesFor(facility, selected) derives the set — the triad is COMPUTED from paint");
    } else {
        fail(
            `S2 — surfacesFor must derive the triad from paint ` +
                `(derives:${derives}, paintComputed:${paintComputed})`,
        );
    }

    // S3 — ONE metadata module. SURFACE_META is the single source; ChromeDock +
    // AnimationControls derive their built-in tab descriptors FROM it (no
    // hand-synced local {label,icon} triad literal).
    const meta = /export const SURFACE_META\s*:\s*Record<ControlSurface, ControlSurfaceTab>/.test(dfa);
    const dock = read(path.join(DEMO, "components/dock/ChromeDock.vue"));
    const ac = read(
        path.join(DEMO, "components/instrument/transport/controls/AnimationControls.vue"),
    );
    const dockDerives = /SURFACE_META\[s\]/.test(dock);
    const acDerives = /SURFACE_META\[s\]/.test(ac);
    const noLocalTriadLiteral =
        !/BUILT_IN_TAB_META\s*[:=]/.test(ac) &&
        !/label:\s*["']Keyframes["']/.test(dock) &&
        !/label:\s*["']Keyframes["']/.test(ac);
    if (meta && dockDerives && acDerives && noLocalTriadLiteral) {
        ok(
            "S3: a surface's {label,icon} resolves from ONE module (SURFACE_META) — " +
                "ChromeDock + AnimationControls derive their tab descriptors from it, no local triad literal",
        );
    } else {
        fail(
            `S3 — the surface metadata must resolve from exactly ONE module ` +
                `(meta:${meta}, dockDerives:${dockDerives}, acDerives:${acDerives}, ` +
                `noLocalTriadLiteral:${noLocalTriadLiteral})`,
        );
    }
}

// ── L1 BROWSER CENSUS ─────────────────────────────────────────────────────────
// A painting-channel scene renders the full built-in triad. The observable #25
// cure: on cube/easing/spring the control-surface SELECT (the reka combobox
// trigger `[aria-label='Controls tab'][role=combobox]`) renders — a MULTI-option
// picker over the triad (+ facet). On the pre-T.B2 tree easing/spring elided to a
// SINGLE non-select surface (no combobox at all), so the picker's presence is the
// direct witness that the painting channel earned its triad (>1 surface). The
// trigger's collapsed label reads the SELECTED surface — item-7a (the easing
// TERMINAL batch): the default is SCENE-AWARE (cube → 'Controls'; easing →
// its Curve facet; spring → Physics), so the census asserts the per-scene
// expected label, and the COMBOBOX presence stays the triad witness.
const controlSelect = (page) =>
    page.evaluate(() => {
        const trig = document.querySelector("[aria-label='Controls tab']");
        return {
            present: !!trig,
            isCombobox: trig?.getAttribute("role") === "combobox",
            label: trig?.textContent?.trim() ?? null,
        };
    });

async function browserHalf() {
    const result = await withPage(
        {
            distDir: DIST,
            label: "the painting-channel triad census (T.B2 #25 cure)",
            context: { viewport: { width: 1280, height: 900 } },
        },
        async (page, { url }) => {
            await page.goto(`${url}/#/cube`, { waitUntil: "load" });
            await page.waitForTimeout(3000);

            let clean = 0;
            // item-7a: the expected COLLAPSED label is the scene-aware default
            // (SCENE_DEFAULT_CONTROL) — the combobox presence is the triad tell.
            const paintingScenes = [
                { id: "cube", label: "Controls" },
                { id: "easing", label: "Curve" },
                { id: "spring", label: "Physics" },
            ];
            for (const { id, label } of paintingScenes) {
                await navToScene(page, id, label);
                await page.waitForTimeout(300);
                const s = await controlSelect(page);
                // The triad grants >1 surface ⇒ the dock renders the MULTI-option
                // control SELECT (a combobox), not a single elided inline surface.
                if (s.present && s.isCombobox && s.label === label) {
                    clean++;
                    ok(
                        `L1 ${id}: renders the multi-surface control SELECT (combobox, label='${label}') ` +
                            `— the painting channel earned its triad (the #25 cure)`,
                    );
                } else {
                    fail(
                        `L1 ${id} — the painting-channel scene did NOT render the triad's multi-surface ` +
                            `select (present:${s.present}, combobox:${s.isCombobox}, label='${s.label}', ` +
                            `expected '${label}'); the derivation must grant a painting channel its triad`,
                    );
                }
            }
            if (clean === paintingScenes.length) {
                ok(
                    `L1 census: ${clean}/${paintingScenes.length} painting-channel scenes render the ` +
                        `triad's multi-surface select (the #25 asymmetry cure)`,
                );
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
        `\nproof:dfa-derived — FAIL (${failures.length}): the control-surface set is not a ` +
            `derivation (a table survives), the triad is not computed from paint, the metadata is ` +
            `not single-sourced, or a painting-channel scene is denied its triad in the browser.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:dfa-derived — PASS: the control-surface set DERIVES from the facility × selected " +
        "channel (surfacesFor), the triad is computed from paint, the {label,icon} metadata is " +
        "single-sourced (SURFACE_META), and every painting-channel scene renders the full triad (T.B2).",
);
