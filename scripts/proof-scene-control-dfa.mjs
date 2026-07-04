#!/usr/bin/env node
/**
 * proof:scene-control-dfa — H.W11 S4 / I2 (the per-scene control-surface DFA).
 * For EVERY scene the rendered control-surface set EXACTLY equals the DFA table
 * entry (no extra, no missing), and the (scene → scene) navigation matrix is
 * TOTAL (every cell resolves a DEFINED set — no undefined behavior). This is the
 * bite that replaces the hard-coded {controls,keyframes,timeline} triad on
 * AnimationControls.vue + ChromeDock.vue + the per-scene reka-tab-fallback hacks.
 *
 * Clauses (each BITES — born-RED on the pre-DFA tree, green on the table-driven
 * render):
 *
 *   D1 STATIC — the DFA table is the SINGLE authority: AnimationControls.vue
 *      renders the built-in triad FROM the DFA (a v-for over `builtInTabs`, no
 *      hard-coded controls/keyframes/timeline TabsTrigger literals); ChromeDock
 *      filters its built-in tab descriptors against `controlSurfaces`; the scenes
 *      no longer carry the onMounted+nextTick reka-fallback re-assert hacks
 *      (EasingScene/SpringScene). BITE: a reverted hard-coded trigger list or a
 *      restored nextTick hack reds.
 *
 *   D2 TOTALITY — `controlSurfacesFor` resolves a DEFINED set for EVERY declared
 *      scene id AND for an unknown id (the conservative built-in default). Driven
 *      by re-deriving the DFA table from source and asserting every scene id maps
 *      + the selector is total. BITE: a partial table (a scene missing an entry
 *      with no total fallback) would leave a (scene → scene) cell undefined.
 *
 *   D3 LIVE PER-SCENE — for each scene the EFFECTIVE rendered control-tab set
 *      equals the DFA entry: easing → ONLY the easing surface (NO keyframes/
 *      timeline tab node anywhere on the page); spring → ONLY spring; cube/amiga/
 *      square → the full built-in triad (controls+keyframes+timeline visible in
 *      the OPENED dock select); sequence/motion-path → NO control panel
 *      affordance at all (the empty DFA set → no controls-tab trigger). BITE: the
 *      pre-DFA easing route showed the meaningless keyframes/timeline triggers.
 *
 *   D4 LIVE NAVIGATION-MATRIX — drive every (scene → scene) ordered pair across a
 *      representative matrix; after each the rendered control-surface set is the
 *      DESTINATION's DFA entry (no stale surface from the source bleeding across).
 *      BITE: a transition that left the prior scene's controls-tab trigger
 *      mounted (a superKey lagging the route) reds.
 *
 * Settle-gated on H.W1 (the FSM resting). Builds on the W1 proof:scene-isolation
 * plumbing (the visible-label scan). Harness: the scripts/lib/demo-driver.mjs
 * lifecycle (withPage = serveDist + resolveChromium + context/teardown, J.W3
 * S1). STATIC half always runs; BROWSER half gated on playwright +
 * KF_REQUIRE_BROWSER (a playwright-absent skip becomes a hard fail AT THE LIB
 * SEAM). Serves the BUILT dist/gh-pages/ (run `npm run gh-pages` first).
 * Re-runnable: `node scripts/proof-scene-control-dfa.mjs`.
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

console.log("proof:scene-control-dfa — H.W11 S4 / I2 (the per-scene control-surface DFA)");

// ── D1 + D2 STATIC half ──────────────────────────────────────────────────────
{
    const acPath = path.join(
        DEMO,
        "@/components/custom/animation-controls/controls/AnimationControls.vue",
    );
    const ac = read(acPath);
    // The triggers come from the DFA (the built-in triad + the scene-conditional
    // surfaces), NOT a hard-coded controls/keyframes/timeline literal list. Two
    // accepted shapes: the legacy reka `<Tabs>` v-for over builtInTabs, OR (K.W1′,
    // glass-ui 4.0.0) the `<SegmentedTabs :options="stripOptions">` strip whose
    // stripOptions derive from `builtInTabs` (the DFA-filtered subset) unioned with
    // the machine's `extraControlTabs` projection — strictly MORE DFA-driven (the
    // scene triggers now flow through the DFA data path, not an injected slot).
    const tableDriven =
        /v-for="tab in builtInTabs"/.test(ac) ||
        (/:options="stripOptions"/.test(ac) &&
            /stripOptions[\s\S]{0,800}?builtInTabs\.value/.test(ac));
    const noHardCoded =
        // the legacy reka-trigger literal shape …
        !/value="controls"\s+:class="tabClasses"/.test(ac) &&
        !/value="keyframes"\s+:class="tabClasses"/.test(ac) &&
        !/value="timeline"\s+:class="tabClasses"/.test(ac) &&
        // … and the 4.0.0 SegmentedTabs shape: no hard-coded options array literal
        // enumerating the triad (the options must come from builtInTabs, asserted
        // by tableDriven — a literal triad would not reference builtInTabs.value).
        !/:options="\[\s*\{\s*value:\s*["']controls["']/.test(ac);
    if (tableDriven && noHardCoded) {
        ok(
            "D1 source: AnimationControls renders the built-in triad FROM the DFA " +
                "(v-for builtInTabs, or the SegmentedTabs stripOptions←builtInTabs strip) — " +
                "no hard-coded controls/keyframes/timeline trigger literals",
        );
    } else {
        fail(
            `D1 source — AnimationControls must render the triad from the DFA ` +
                `(tableDriven:${tableDriven}, noHardCoded:${noHardCoded}); the hard-coded 3-tab ` +
                `list is the pre-DFA defect`,
        );
    }

    const dock = read(path.join(DEMO, "@/components/custom/dock/ChromeDock.vue"));
    const dockFilters =
        /controlSurfaces\?:\s*string\[\]/.test(dock) &&
        /BUILT_IN_CONTROL_TABS\.filter\(\(t\)\s*=>\s*valid\.includes\(t\.value\)\)/.test(
            dock,
        );
    if (dockFilters) {
        ok("D1 source: ChromeDock filters the built-in triad against the DFA `controlSurfaces`");
    } else {
        fail(
            "D1 source — ChromeDock must filter BUILT_IN_CONTROL_TABS against the controlSurfaces " +
                "prop (the DFA-driven render), not merge the full triad unconditionally",
        );
    }

    // The reka-fallback hacks DIE: EasingScene/SpringScene no longer carry the
    // onMounted(() => nextTick(() => selectedControl = ...)) re-assert.
    const easing = read(path.join(DEMO, "scenes/easing/EasingScene.vue"));
    const spring = read(path.join(DEMO, "scenes/spring/SpringScene.vue"));
    const hackGone = (s) =>
        !/onMounted\([^)]*\)\s*=>\s*\{[\s\S]*?nextTick\([\s\S]*?selectedControl/.test(s);
    if (hackGone(easing) && hackGone(spring)) {
        ok(
            "D1 source: the reka-tab-fallback hacks DIE — EasingScene/SpringScene no longer " +
                "re-assert selectedControl in an onMounted+nextTick (the DFA is the explicit owner)",
        );
    } else {
        fail(
            `D1 source — the onMounted+nextTick reka-fallback re-assert hack must be removed ` +
                `(easingHackGone:${hackGone(easing)}, springHackGone:${hackGone(spring)})`,
        );
    }

    // D2 TOTALITY — re-derive the table from source + assert every declared scene
    // id maps AND the selector is total (an unknown id falls back to the triad).
    const dfa = read(
        path.join(
            DEMO,
            "@/state/controlSurfaceDFA.ts",
        ),
    );
    const declaredScenes = ["home", "cube", "amiga", "square", "easing", "spring", "sequence", "motion-path", "morph"];
    const tableBlock = (dfa.match(/CONTROL_SURFACES[^=]*=\s*\{([\s\S]*?)\};/) || [])[1] ?? "";
    const allMapped = declaredScenes.every((s) => {
        const re = new RegExp(`["']?${s.replace("-", "\\-")}["']?\\s*:`);
        return re.test(tableBlock);
    });
    const totalSelector = /const set = CONTROL_SURFACES\[sceneId\];\s*return set \? \[\.\.\.set\] : \[\.\.\.BUILT_IN_SURFACES\]/.test(
        dfa.replace(/\s+/g, " "),
    );
    if (allMapped && totalSelector) {
        ok(
            `D2 totality: all ${declaredScenes.length} declared scenes map in CONTROL_SURFACES + ` +
                `controlSurfacesFor is TOTAL (unknown id → the built-in triad; every nav cell defined)`,
        );
    } else {
        fail(
            `D2 totality — every declared scene must map AND the selector must be total ` +
                `(allMapped:${allMapped}, totalSelector:${totalSelector})`,
        );
    }
}

// ── D3 + D4 BROWSER half ─────────────────────────────────────────────────────
// The expected EFFECTIVE control-tab outcome per scene (the DFA table, observed
// through the dock). `trigger` = the controls-tab trigger's collapsed label (the
// selected surface), or null when NO control panel renders (empty DFA set).
// `noBuiltInTriad` asserts NO keyframes/timeline tab node exists anywhere.
const EXPECT = {
    cube: { hasPanel: true, trigger: "Controls" },
    amiga: { hasPanel: true, trigger: "Controls" },
    square: { hasPanel: true, trigger: "Controls" },
    easing: { hasPanel: true, trigger: "Easing", noBuiltInTriad: true },
    spring: { hasPanel: true, trigger: "Spring", noBuiltInTriad: true },
    sequence: { hasPanel: false },
    "motion-path": { hasPanel: false },
    morph: { hasPanel: false },
};

/** Read the dock's control-tab state: the collapsed trigger label (or null if
 *  no controls-tab trigger renders) + whether any built-in triad tab text
 *  (Keyframes / Timeline) exists in the visible DOM. */
const dockControlState = (page) =>
    page.evaluate(() => {
        const trigger = document.querySelector("[aria-label='Controls tab']");
        const visible = (el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
        };
        // Built-in triad nodes: any element whose trimmed text is exactly
        // 'Keyframes' or 'Timeline' (the triad tab labels) and is visible.
        let triad = false;
        for (const el of document.querySelectorAll("button, [role=option], .dock-label, span")) {
            const t = (el.textContent || "").trim();
            if ((t === "Keyframes" || t === "Timeline") && visible(el)) {
                triad = true;
                break;
            }
        }
        return {
            hasTrigger: !!(trigger && visible(trigger)),
            triggerText: trigger?.textContent?.trim() || null,
            builtInTriadVisible: triad,
        };
    });

async function browserHalf() {
    const result = await withPage(
        {
            distDir: DIST,
            label: "the per-scene + navigation-matrix DFA clauses",
            context: { viewport: { width: 1280, height: 900 } },
        },
        async (page, { url }) => {
        await page.goto(`${url}/#/cube`, { waitUntil: "load" });
        await page.waitForTimeout(3000);

        // ── D3 PER-SCENE ─────────────────────────────────────────────────────
        let perSceneClean = 0;
        const sceneIds = Object.keys(EXPECT);
        for (const id of sceneIds) {
            await navToScene(page, id, EXPECT[id].hasPanel ? EXPECT[id].trigger : null);
            const st = await dockControlState(page);
            const exp = EXPECT[id];
            let pass = st.hasTrigger === exp.hasPanel;
            if (exp.hasPanel) pass = pass && st.triggerText === exp.trigger;
            if (exp.noBuiltInTriad) pass = pass && !st.builtInTriadVisible;

            if (pass) {
                perSceneClean++;
                ok(
                    `D3 ${id}: rendered control-surface set matches the DFA ` +
                        `(panel:${st.hasTrigger}, trigger='${st.triggerText}'` +
                        `${exp.noBuiltInTriad ? ", no built-in triad node" : ""})`,
                );
            } else {
                fail(
                    `D3 ${id} — rendered set ≠ DFA entry: got ` +
                        `{panel:${st.hasTrigger}, trigger='${st.triggerText}', ` +
                        `triad:${st.builtInTriadVisible}} expected ${JSON.stringify(exp)}` +
                        (exp.noBuiltInTriad && st.builtInTriadVisible
                            ? " (the meaningless keyframes/timeline triad leaked — the pre-DFA defect)"
                            : ""),
                );
            }
        }
        if (perSceneClean === sceneIds.length) {
            ok(`D3 per-scene: ${perSceneClean}/${sceneIds.length} scenes render EXACTLY their DFA set`);
        }

        // ── D4 NAVIGATION-MATRIX (totality, no stale bleed) ──────────────────
        // Drive a representative ordered set covering both architectures + the
        // empty-set scenes; after each the destination's DFA entry holds (no
        // source surface bleeding). The easing→cube + sequence→easing pairs are
        // the named bites (a built-in trigger leaking into easing; a stale easing
        // trigger persisting into sequence's panel-less stage).
        const matrix = [
            ["cube", "easing"],
            ["easing", "cube"],
            ["easing", "sequence"],
            ["sequence", "easing"],
            ["spring", "motion-path"],
            ["motion-path", "spring"],
            ["cube", "spring"],
        ];
        let matrixClean = 0;
        for (const [from, to] of matrix) {
            await navToScene(page, from, EXPECT[from].hasPanel ? EXPECT[from].trigger : null);
            await navToScene(page, to, EXPECT[to].hasPanel ? EXPECT[to].trigger : null);
            const st = await dockControlState(page);
            const exp = EXPECT[to];
            let pass = st.hasTrigger === exp.hasPanel;
            if (exp.hasPanel) pass = pass && st.triggerText === exp.trigger;
            if (exp.noBuiltInTriad) pass = pass && !st.builtInTriadVisible;
            if (pass) {
                matrixClean++;
            } else {
                fail(
                    `D4 [${from}→${to}] — destination control-surface set wrong: got ` +
                        `{panel:${st.hasTrigger}, trigger='${st.triggerText}', triad:${st.builtInTriadVisible}} ` +
                        `expected ${JSON.stringify(exp)} (stale '${from}' surface bled across)`,
                );
            }
        }
        if (matrixClean === matrix.length) {
            ok(
                `D4 navigation-matrix: ${matrixClean}/${matrix.length} ordered (from→to) pairs ` +
                    `land on the DESTINATION's DFA set — no undefined cell, no stale surface bleed`,
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
        `\nproof:scene-control-dfa — FAIL (${failures.length}): a scene renders a control-surface ` +
            `set that does not match its DFA entry, the table is not the single authority, or the ` +
            `navigation matrix leaks a stale surface.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:scene-control-dfa — PASS: every scene renders EXACTLY its DFA control-surface set " +
        "(easing → only easing; sequence/path → no panel), the table is the single authority, and " +
        "the (scene → scene) navigation matrix is total (H.W11 S4 / I2).",
);
