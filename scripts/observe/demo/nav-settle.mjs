#!/usr/bin/env node
/**
 * nav-settle — the per-scene at-rest surface fact, observed (COHESION §0hg.4
 * residual b).
 *
 * `navToScene(page, id, expectedSurface)` returns the instant the destination's
 * surfaces trigger face reads `expectedSurface`; the timeout is only a ceiling.
 * A caller that passes `null` (or nothing) for a scene that HAS a surfaces
 * trigger asks for a fact that never holds, so every non-home visit waits out
 * the whole ceiling (12 s). The gates take the fact from the one SCENES
 * manifest (`scene.surface`), so this witness drives every non-home scene with
 * exactly that fact and asserts (1) it holds at rest and (2) the nav settles
 * well inside the ceiling.
 *
 * Re-runnable:
 *   npm run gh-pages && KF_REQUIRE_BROWSER=1 node scripts/observe/demo/nav-settle.mjs
 */
import { SCENES, navToScene, withPage } from "../../lib/demo-driver.mjs";

const CEILING_MS = 12000;
const SETTLE_BUDGET_MS = 4000;

const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const fail = (l) => {
    failures.push(l);
    console.error(`  ✗ ${l}`);
};

console.log("nav-settle observation — each scene's at-rest surface fact");

await withPage(
    { label: "nav-settle", context: { viewport: { width: 1280, height: 900 } } },
    async (page, { url: base }) => {
        await page.goto(`${base}/#/`, { waitUntil: "load" });
        for (const scene of SCENES) {
            if (scene.key === "home") continue;
            const t0 = Date.now();
            await navToScene(page, scene.key, scene.surface, { timeout: CEILING_MS });
            const ms = Date.now() - t0;
            const face = await page.evaluate(
                () =>
                    document
                        .querySelector("[data-dock-surface-trigger]")
                        ?.getAttribute("data-surface") ?? null,
            );
            const label = `${scene.key}: surface fact ${JSON.stringify(scene.surface)}, at rest ${JSON.stringify(face)}, nav ${ms} ms`;
            if (face === scene.surface && ms < SETTLE_BUDGET_MS) ok(label);
            else fail(label);
        }
    },
);

if (failures.length) {
    console.error(`nav-settle: ${failures.length} RED`);
    process.exit(1);
}
console.log("nav-settle: GREEN");
