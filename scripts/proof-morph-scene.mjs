#!/usr/bin/env node
/**
 * proof:morph-scene — Q.WC4 S3, the MorphSVG demo scene KEYSTONE (the
 * APPEARANCE/INTERACTION-axis observable, NOT a source grep).
 *
 * The library-built `fromMorphSVG` was a DEAD demo-side export: the library
 * exports it, the test consumes it, `proof:morphsvg-consume` is GREEN — but NO
 * demo scene RENDERED a morph on the DOM (a green source-shape gate misses that
 * the 3rd HEAVY geometry front door is unobserved in the running demo — the
 * gate-blindspot lesson). This gate witnesses the cure: a real `MorphSVGScene`
 * that mounts, plays a shape morph, and renders a live `<path>` whose `d` at
 * mid-`t` is DISTINCT from BOTH endpoint shapes (a real morphing shape, not a
 * static path or 130 invisible numeric props).
 *
 * Two clauses:
 *
 *   scene-registered (source-shape corroborator) — the scene machine carries a
 *       `morph` scene; `MorphSVGScene.vue` exists + consumes `fromMorphSVG`
 *       (through the demo's kfEngine surface). BITE: drop the registration → red.
 *
 *   morph-renders (THE KEYSTONE — the runtime observable) — navigate `#/morph`,
 *       PLAY the morph, and assert the subject's RENDERED path `d` (the engine-
 *       written `d:`/`--morph-d`) (i) CHANGES over the morph window (≥3 distinct
 *       states — a live morph, not a static path), AND (ii) at mid-window is
 *       DISTINCT from BOTH endpoint ghost shapes (the `from` AND the `to`). BITE:
 *       a scene that mounts but renders a static / endpoint-only shape (the render
 *       contract not wired) reds; a scene that only writes the numeric props but
 *       no `--morph-d`/`d:` reds.
 *
 * Born-RED on the pre-wave tree: NO `morph` scene existed (`ls demo/app/scenes/`
 * → no Morph) — the nav 404s, the rendered `d` read throws. The `morph-renders`
 * RED is the GENUINE defect (the primitive is undemoed AND a target-bearing
 * morph rendered nothing), not a proxy.
 *
 * Runtime over the BUILT `dist/gh-pages/` (run `npm run gh-pages` first) via the
 * shared demo-driver harness (withPage/navToScene). Under KF_REQUIRE_BROWSER=1 a
 * playwright/dist-absent skip is a hard FAIL (the W7-1 rule).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { navToScene, withPage } from "./lib/demo-driver.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

console.log("proof:morph-scene — Q.WC4 S3 (the MorphSVG demo scene KEYSTONE)");

// ── scene-registered (source-shape corroborator) ──────────────────────────────
{
    const scenes = read("demo/app/scenes.ts");
    const sceneFile = "demo/scenes/morph/MorphSVGScene.vue";
    let sceneSrc = "";
    try {
        sceneSrc = read(sceneFile);
    } catch {
        sceneSrc = "";
    }
    // A `morph` descriptor + the MorphSVGScene component lazy-load.
    const registered =
        /\bid:\s*["']morph["']/.test(scenes) &&
        /MorphSVGScene\.vue/.test(scenes);
    // The scene (through its demo composable) consumes fromMorphSVG.
    const composite = (() => {
        let useMorph = "";
        try {
            useMorph = read("demo/scenes/morph/useMorphDemo.ts");
        } catch {
            useMorph = "";
        }
        return (
            /\bfromMorphSVG\b/.test(useMorph) ||
            /\bfromMorphSVG\b/.test(sceneSrc)
        );
    })();

    if (registered && sceneSrc.length > 0 && composite) {
        ok(
            "scene-registered",
            "scenes.ts carries a `morph` descriptor → MorphSVGScene.vue, which consumes fromMorphSVG (the demo dogfoods the 3rd HEAVY geometry front door)",
        );
    } else {
        fail(
            "scene-registered",
            `the morph scene is not registered/consuming fromMorphSVG ` +
                `(descriptor:${registered}, MorphSVGScene.vue exists:${sceneSrc.length > 0}, consumes-fromMorphSVG:${composite}).`,
        );
    }
}

// ── morph-renders (THE KEYSTONE — the live runtime observable) ────────────────
const DIST = join(root, "dist", "gh-pages");
const result = await withPage(
    {
        distDir: DIST,
        label: "the morph-renders keystone (the LIVE rendered morph at mid-t)",
        context: { viewport: { width: 1280, height: 900 } },
    },
    async (page, { url }) => {
        await page.goto(`${url}/#/`, { waitUntil: "load" });
        // morph is a panel-less scene (no control-tab) → expect trigger null.
        await navToScene(page, "morph", null, { timeout: 12000 });

        // Wait for the subject <path> to mount (the render target).
        await page
            .waitForFunction(
                () => !!document.querySelector("[data-morph-subject]"),
                null,
                { timeout: 8000 },
            )
            .catch(() => {});

        // Settle: the scene's SCENE_READY + ScenePlayback adapter register a tick
        // after mount; a play click that races registration is dropped (the
        // machine is still `loading`). Wait for the morph subject to carry the
        // SEEDED initial render (--morph-d / d:) — the proof the scene wired up.
        await page
            .waitForFunction(
                () => {
                    const p = document.querySelector("[data-morph-subject]");
                    if (!p) return false;
                    const cs = getComputedStyle(p);
                    return (
                        (cs.getPropertyValue("--morph-d") || "").trim().length >
                            0 ||
                        (cs.getPropertyValue("d") || "")
                            .trim()
                            .startsWith("path")
                    );
                },
                null,
                { timeout: 8000 },
            )
            .catch(() => {});

        // Read the two endpoint ghost shapes (the `from` + `to` extremes the
        // morph travels between) — the distinctness oracle.
        const ghosts = await page.evaluate(() =>
            [...document.querySelectorAll(".morph-ghost")].map((p) =>
                (p.getAttribute("d") || "").trim(),
            ),
        );

        // PLAY the morph (the rainbow group-play pill / playback control). Click,
        // then WAIT until the rendered `d` actually changes (the morph is
        // ticking) — retrying the click once if the first window is static (the
        // SCENE_READY race). The wait is a ceiling, so a live box returns at once.
        const PLAY_SELECTORS = [
            'button[aria-label*="Play animation"]',
            'button[aria-label*="play" i]',
            ".btn-playback-play",
        ];
        const clickPlay = async () => {
            for (const sel of PLAY_SELECTORS) {
                const el = page.locator(sel).first();
                if ((await el.count()) > 0) {
                    await el
                        .click({ force: true, timeout: 2500 })
                        .catch(() => {});
                    return true;
                }
            }
            return false;
        };
        const readD = () =>
            page.evaluate(() => {
                const p = document.querySelector("[data-morph-subject]");
                if (!p) return null;
                const cs = getComputedStyle(p);
                return (
                    (cs.getPropertyValue("d") || "").trim() ||
                    (cs.getPropertyValue("--morph-d") || "").trim() ||
                    null
                );
            });
        const dBefore = await readD();
        await clickPlay();
        // Wait for the morph to start ticking (the rendered `d` left its seed);
        // a second play click breaks the SCENE_READY race if the first dropped.
        const started = await page
            .waitForFunction(
                (seed) => {
                    const p = document.querySelector("[data-morph-subject]");
                    if (!p) return false;
                    const cs = getComputedStyle(p);
                    const d =
                        (cs.getPropertyValue("d") || "").trim() ||
                        (cs.getPropertyValue("--morph-d") || "").trim();
                    return d.length > 0 && d !== seed;
                },
                dBefore,
                { timeout: 4000 },
            )
            .then(() => true)
            .catch(() => false);
        if (!started) await clickPlay();

        // Sample the subject's RENDERED `d` over the morph window. The engine
        // writes BOTH the `d:` CSS property AND --morph-d each frame — read
        // either (Chromium resolves `d` to its computed `path(...)`).
        const sampled = await page.evaluate(async () => {
            const sleep = (m) => new Promise((r) => setTimeout(r, m));
            const read = () => {
                const p = document.querySelector("[data-morph-subject]");
                if (!p) return null;
                const cs = getComputedStyle(p);
                const dProp = (cs.getPropertyValue("d") || "").trim();
                const dVar = (cs.getPropertyValue("--morph-d") || "").trim();
                return { dProp, dVar };
            };
            const seen = new Set();
            const dVars = [];
            const t0 = performance.now();
            // ~2.4s — a touch over one morph half-cycle (the scene's 2.2s morph).
            while (performance.now() - t0 < 2400) {
                const r = read();
                if (r) {
                    const key = r.dProp || r.dVar;
                    if (key) seen.add(key);
                    if (r.dVar) dVars.push(r.dVar);
                }
                await sleep(40);
            }
            return { distinct: seen.size, dVars };
        });

        return { ghosts, sampled };
    },
);

if (result.skipped) {
    console.log(`  ○ morph-renders — browser half skipped: ${result.reason}`);
} else {
    const { ghosts, sampled } = result.value;
    const [fromD, toD] = ghosts;
    // (i) the rendered `d` CHANGES over the window (a live morph, not static).
    const changes = sampled.distinct >= 3;
    // (ii) at least one sampled --morph-d is DISTINCT from BOTH endpoint shapes
    //      (a real morphing mid-shape, not an endpoint-snap). The engine writes
    //      a polyline `d` (M … L …); the ghosts are the authored shapes — a
    //      strict-inequality compare is sound (the morph reassembles a polyline,
    //      never byte-equal to an authored polygon/star/blob `d`).
    const midDistinct = sampled.dVars.some(
        (d) => d.length > 0 && d !== fromD && d !== toD,
    );

    if (ghosts.length < 2 || !fromD || !toD) {
        fail(
            "morph-renders",
            `the endpoint ghost shapes did not render (ghosts=${ghosts.length}) — the scene mounted no morph stage.`,
        );
    } else if (!changes) {
        fail(
            "morph-renders",
            `the subject's rendered \`d\` produced only ${sampled.distinct} distinct state(s) over the morph window (<3) — ` +
                `a STATIC path, not a live morph (the render contract not wired, or the morph not playing).`,
        );
    } else if (!midDistinct) {
        fail(
            "morph-renders",
            `no sampled --morph-d was DISTINCT from both endpoint shapes — the subject renders an endpoint-only / non-interpolating shape ` +
                `(samples=${sampled.dVars.length}, distinctStates=${sampled.distinct}).`,
        );
    } else {
        ok(
            "morph-renders",
            `the LIVE morph renders: the subject's \`d\` walked ${sampled.distinct} distinct states + a mid-window shape DISTINCT from both endpoints ` +
                `(a real morphing <path>, not static / endpoint-only / numeric-props-only)`,
        );
    }
}

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:morph-scene — FAIL: the MorphSVG demo scene is not witnessed:\n" +
            failures.join("\n") +
            "\n\n  The 3rd HEAVY geometry front door (fromMorphSVG) must be DEMOED: a\n" +
            "  MorphSVGScene that mounts, plays a shape morph, and renders a live\n" +
            "  <path> whose `d` at mid-t differs from both endpoint shapes (the\n" +
            "  Q.WC4 render contract — `d:`/--morph-d written each frame). Run\n" +
            "  `npm run gh-pages` first so the runtime half drives the built demo.",
    );
    process.exit(1);
}
console.log(
    "proof:morph-scene — PASS: the MorphSVG scene is registered + the LIVE demo\n" +
        "renders a real morphing <path> (the rendered `d` walks distinct states +\n" +
        "a mid-t shape distinct from both endpoints) — the 3rd HEAVY geometry front\n" +
        "door is finally DEMOED (the gate-blindspot closed via a RUNTIME observable).",
);
