#!/usr/bin/env node
/**
 * proof:compose-scene — S.D3 (C-4), the playground-fold KEYSTONE (the
 * APPEARANCE/INTERACTION-axis observable, NOT a source grep).
 *
 * The standalone `demo/playground/` was a dead identity-crisis app: an un-pinned
 * `outDir` landmine, a blank build, 9.6MB of dist debris, and the single most
 * on-brand moment in the whole demo (the bind-ignition + `fromDrawSVG` comet-tail)
 * UNREACHABLE by any deployed user. S.D3 FOLDS it in as the ninth SPA scene
 * `scenes/compose/`. This gate witnesses the cure at the two seams a source-shape
 * gate structurally cannot: the scene MOUNTS in the running SPA, the standalone
 * entry is GONE, and the ignition moment drives a REAL `fromDrawSVG` sweep.
 *
 * THREE clauses:
 *
 *   standalone-gone (source/repo — the identity fix) — `demo/playground/` does not
 *       exist on disk; `package.json` has no `dev:playground` script;
 *       `vite.config.ts` declares no `playground` mode. BITE: leave any of the
 *       three → red (the plant: a stray `demo/playground/` on disk reds here).
 *
 *   scene-mounts (THE KEYSTONE — the runtime mount) — navigate `#/compose` over
 *       the BUILT dist, and assert the foundry (`[data-foundry]`) mounts with a
 *       non-zero box AND zero console errors during entry. BITE: a scene that
 *       fails to register / throws on mount reds (the nav settles on no foundry).
 *
 *   ignition-drives-drawsvg (THE KEYSTONE — the runtime dogfood) — add an asset,
 *       bind a preset through the Assets panel, and assert the comet-tail path is
 *       swept by the library's OWN `fromDrawSVG`: the `.comet-tail-path` receives
 *       an inline `stroke-dasharray` (the unmistakable DrawSVG signature — no
 *       source stub sets that at runtime without `fromDrawSVG` actually running)
 *       AND the `.comet-tail` flips `is-igniting`. BITE: a scene that mounts but
 *       never runs the ignition (the bind wired to nothing) reds.
 *
 * Born-RED before the fold: NO `compose` scene existed (the nav 404s, `[data-
 * foundry]` never mounts, the ignition never fires). GREEN once the fold lands.
 *
 * ── DAG (sd-#4) ── This gate is AUTHORED at S.D3 and its mount + ignition clauses
 * pass on the merged D3 tree. Its formal board CLOSE waits for S.G: compose
 * auto-enrolls in the occlusion / a11y / font / stage-visible runtime fleet
 * (the fleet gates, not clauses of THIS gate), and compose-fleet-green precedes
 * the close (T4 — no born-GREEN-then-red mid-band). Re-run at S.Z2.
 *
 * Runtime over the BUILT `dist/gh-pages/` (run `npm run gh-pages` first) via the
 * shared demo-driver harness (withPage/navToScene). Under KF_REQUIRE_BROWSER=1 a
 * playwright/dist-absent skip is a hard FAIL (the W7-1 rule).
 *
 * RUN: node scripts/proof-compose-scene.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { navToScene, withPage } from "./lib/demo-driver.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

console.log("proof:compose-scene — S.D3 (C-4) the playground-fold KEYSTONE");

// ── standalone-gone (source/repo — the identity fix) ──────────────────────────
{
    const issues = [];
    if (existsSync(join(root, "demo/playground"))) {
        issues.push(
            "demo/playground/ still exists on disk — the standalone app was not deleted (the fold's whole point)",
        );
    }
    const pkg = JSON.parse(read("package.json"));
    if (pkg.scripts && "dev:playground" in pkg.scripts) {
        issues.push(
            "package.json still declares the `dev:playground` script — the standalone dev entry survives",
        );
    }
    const vite = read("vite.config.ts");
    if (/mode\.mode\s*===\s*["']playground["']|--mode\s+playground/.test(vite)) {
        issues.push(
            "vite.config.ts still declares a `playground` mode — the un-pinned-outDir landmine survives",
        );
    }
    // The scene must be REGISTERED (the fold's other half): a `compose` descriptor
    // → ComposeScene.vue in the scene registry.
    const scenes = read("demo/app/scene/scenes.ts");
    if (!(/\bid:\s*["']compose["']/.test(scenes) && /ComposeScene\.vue/.test(scenes))) {
        issues.push(
            "scenes.ts has no `compose` descriptor → ComposeScene.vue — the fold registered no scene",
        );
    }
    if (issues.length === 0) {
        ok(
            "standalone-gone",
            "demo/playground/ + the dev:playground script + the vite playground mode are GONE, and the compose scene is registered (scenes.ts → ComposeScene.vue)",
        );
    } else {
        for (const i of issues) fail("standalone-gone", i);
    }
}

// ── the runtime keystones (scene-mounts + ignition-drives-drawsvg) ────────────
const DIST = join(root, "dist", "gh-pages");
const result = await withPage(
    {
        distDir: DIST,
        label: "the compose fold (mount + the fromDrawSVG bind-ignition)",
        context: { viewport: { width: 1280, height: 900 } },
    },
    async (page, { url }) => {
        const consoleErrors = [];
        page.on("console", (m) => {
            if (m.type() === "error") consoleErrors.push(m.text());
        });
        page.on("pageerror", (e) => consoleErrors.push(String(e)));

        await page.goto(`${url}/#/`, { waitUntil: "load" });
        // compose's control tab is the DFA `assets` surface ("Assets").
        await navToScene(page, "compose", "Assets", { timeout: 12000 });

        // (1) the foundry mounts with a non-zero box.
        const foundryMounted = await page
            .waitForFunction(
                () => {
                    const el = document.querySelector("[data-foundry]");
                    if (!el) return false;
                    const r = el.getBoundingClientRect();
                    return r.width > 0 && r.height > 0;
                },
                null,
                { timeout: 8000 },
            )
            .then(() => true)
            .catch(() => false);

        // (2) drive the bind-ignition. The ignition (is-igniting + the fromDrawSVG
        //     stroke-dasharray) is TRANSIENT (~900ms), so INSTALL a background
        //     recorder BEFORE the bind — it captures the transient regardless of the
        //     interaction's exact timing (the race a naive after-the-fact poll loses).
        await page.evaluate(() => {
            const w = /** @type {any} */ (window);
            w.__ign = { sawDash: false, sawIgniting: false };
            w.__ignTimer = setInterval(() => {
                const path = document.querySelector(".comet-tail-path");
                const svg = document.querySelector(".comet-tail");
                if (path && path.style && path.style.strokeDasharray)
                    w.__ign.sawDash = true;
                if (svg && svg.classList.contains("is-igniting"))
                    w.__ign.sawIgniting = true;
            }, 20);
        });

        // Add a shape — the empty-state CTA button (auto-selects the new asset). The
        // controls pane is rendered in SEVERAL responsive containers (desktop rail +
        // mobile sheet + collapsed dock), so every control has ~5 DOM copies —
        // target only the VISIBLE one (the active desktop rail) via `:visible`.
        const addBtn = page.locator('button:visible:has-text("Add a shape")').first();
        if ((await addBtn.count()) > 0) {
            await addBtn.click({ force: true, timeout: 3000 }).catch(() => {});
        }
        await page.waitForTimeout(400);

        // Open the animation-binding Select + pick a preset, RETRYING until the bind
        // registers (the reka listbox occasionally drops a selection that races its
        // open). The bind is CONFIRMED by the asset's stored `animationName` — a
        // durable signal, not the transient ignition.
        let bound = false;
        for (let attempt = 0; attempt < 3 && !bound; attempt++) {
            const trigger = page.locator('[role="combobox"]:visible').first();
            if ((await trigger.count()) === 0) break;
            await trigger.click({ force: true, timeout: 3000 }).catch(() => {});
            const opt = page
                .locator('[role="option"]:visible')
                .filter({ hasNotText: /^None$/ })
                .first();
            // Wait for the reka listbox to be interactive (options rendered) before
            // selecting — a click that races the open is dropped.
            await opt.waitFor({ state: "visible", timeout: 3000 }).catch(() => {});
            await opt.click({ timeout: 3000 }).catch(() => {});
            await page.waitForTimeout(300);
            bound = await page.evaluate(() => {
                try {
                    const st = JSON.parse(
                        localStorage.getItem("asset-manager-state") || "{}",
                    );
                    return (st.assets || []).some((a) => !!a.animationName);
                } catch {
                    return false;
                }
            });
        }

        // (3) let the draw window elapse, then read the recorder: the ignition
        //     drove a REAL fromDrawSVG iff the comet-tail flipped is-igniting AND its
        //     path received an inline stroke-dasharray (the DrawSVG sweep signature).
        await page.waitForTimeout(1400);
        const ignition = await page.evaluate(() => {
            const w = /** @type {any} */ (window);
            clearInterval(w.__ignTimer);
            return w.__ign || { sawDash: false, sawIgniting: false };
        });

        return { foundryMounted, consoleErrors, bound, ignition };
    },
);

if (result.skipped) {
    console.log(`  ○ runtime clauses skipped: ${result.reason}`);
} else {
    const { foundryMounted, consoleErrors, bound, ignition } = result.value;

    // scene-mounts
    if (foundryMounted && consoleErrors.length === 0) {
        ok(
            "scene-mounts",
            "#/compose mounts the foundry ([data-foundry], non-zero box) with ZERO console errors — the ninth scene registers + renders in the SPA",
        );
    } else if (!foundryMounted) {
        fail(
            "scene-mounts",
            "#/compose did not mount the foundry ([data-foundry] absent / zero-box) — the compose scene failed to register or threw on mount",
        );
    } else {
        fail(
            "scene-mounts",
            `#/compose mounted but ${consoleErrors.length} console error(s) fired during entry: ${consoleErrors.slice(0, 3).join(" | ")}`,
        );
    }

    // ignition-drives-drawsvg
    if (ignition.sawDash && ignition.sawIgniting) {
        ok(
            "ignition-drives-drawsvg",
            "binding a preset IGNITES the asset — the comet-tail flips is-igniting AND its path receives an inline stroke-dasharray (the library's own fromDrawSVG sweeping the preset's easing curve, the math drawn back onto the page)",
        );
    } else if (!bound) {
        fail(
            "ignition-drives-drawsvg",
            "could not drive the bind (the Add-a-shape → animation Select flow did not complete) — the ignition never had a chance to fire",
        );
    } else {
        fail(
            "ignition-drives-drawsvg",
            `the bind fired but the ignition did not drive fromDrawSVG (is-igniting=${ignition.sawIgniting}, inline stroke-dasharray=${ignition.sawDash}) — the comet-tail is not swept by the engine`,
        );
    }
}

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:compose-scene — FAIL: the playground fold is not witnessed:\n" +
            failures.join("\n") +
            "\n\n  The dead standalone playground must FOLD into the ninth SPA scene\n" +
            "  (scenes/compose/): the scene mounts at #/compose, the standalone entry\n" +
            "  (demo/playground/ + dev:playground + the vite mode) is GONE, and binding\n" +
            "  a preset drives a REAL fromDrawSVG comet-tail. Run `npm run gh-pages`\n" +
            "  first so the runtime clauses drive the built demo.",
    );
    process.exit(1);
}
console.log(
    "proof:compose-scene — PASS: the folded compose scene mounts in the SPA, the\n" +
        "standalone playground entry is GONE, and the bind-ignition drives a real\n" +
        "fromDrawSVG comet-tail — the demo's most on-brand moment is finally\n" +
        "deployable (the identity-crisis app retired, its ignition given an audience).",
);
