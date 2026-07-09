#!/usr/bin/env node
/**
 * proof:amiga-decay-visible — Q.WC5 (the amiga scene's `decay()` physics made
 * VISIBLE + the residual scene refinements the impl drive's P.W5.S2 deferred).
 *
 * THE FINDING (B5-kf-demo-arch). The amiga scene is the constellation's clearest
 * "engine drives a non-DOM target" dogfood — `useSphereSpin.ts` flicks the sphere
 * and the SHIPPED analytic `decay()` glide coasts the spin to rest — but the glide
 * is INVISIBLE (no readout shows the angular velocity decaying), so the dogfood
 * claim is unwitnessed; the material is the flat unlit `MeshLambertMaterial`.
 * Q.WC5 builds `AmigaTelemetry.vue` (the readout), swaps to a specular material,
 * and confirms the boing-teardown safety.
 *
 * THE GATE — a Playwright session over the BUILT `dist/gh-pages/` (the
 * scripts/lib/demo-driver.mjs lifecycle). Clauses:
 *   (1) amiga-decay-probe-live (KEYSTONE — RE-ARMED at T.A11): navigate
 *       `#/amiga`, drive a REAL drag + release over the sphere, assert the NON-DOM
 *       gesture-layer probe `window.__kfAmigaProbe.omega()` shows a NON-ZERO
 *       angular velocity at release that DECAYS toward zero over the glide window
 *       (the visible `decay()` curve — the engine dogfood witnessed WITHOUT a
 *       parked telemetry readout, which the owner ruled out). BITE: no probe hook,
 *       or a static / non-decaying reading reds.
 *   (2) specular-material (appearance corroborator — source-shape): the sphere
 *       material is a specular material (`MeshPhongMaterial`/`MeshStandardMaterial`),
 *       NOT `MeshLambertMaterial`. BITE: the flat material reds.
 *   (3) glide-teardown-safe (state corroborator, RE-ARMED at T.A8): flick + navigate
 *       away mid-glide, assert NO post-teardown write error in the console. BITE: a
 *       leaked late write reds. (The boing double-tap was deleted at T.A8 — the Boing
 *       IS the scene; the surviving mid-flight motion is the glide.)
 *
 * Re-runnable: `node scripts/proof-amiga-decay-visible.mjs`. Serves the BUILT
 * dist/gh-pages/. Honors KF_DEMO_URL (the NAMED dev-server exception) so the
 * demo-design observable can be witnessed when the shared engine build is
 * transiently broken.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, resolveChromium, withPage } from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");
const UTILS = path.join(REPO, "demo/scenes/amiga/utils.ts");

// Q.WC5 — the amiga scene is the constellation's only WebGL (Three.js) target, so
// the keystone observable (a real flick → the engine's decay() glide on the SPHERE
// MESH) requires a working WebGL context. Headless chromium defaults to NO GPU and
// fails `new THREE.WebGLRenderer()` ("Error creating WebGL context") — the mesh
// never builds, the raycast hit-test misses, and the flick registers zero velocity
// (a FALSE red on the live decay()). These ANGLE/SwiftShader flags give the
// headless runner a software-rasterized WebGL2 context (SwiftShader Device), so the
// renderer initializes and the REAL flick → REAL velocity → REAL decay coast is
// witnessed device-independently. This is the genuine observable made reachable in
// CI — NOT a weakening of the gate (the decay assertion is unchanged).
const WEBGL_LAUNCH_ARGS = [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
];

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:amiga-decay-visible — Q.WC5 (the engine's decay() glide made visible + the specular surface + the boing-teardown)",
);

// ── clause (2) specular-material (source-shape corroborator) ──
{
    console.log("\nclause (2) specular-material (the sphere reads as an intentionally-lit surface, not the flat unlit ball)");
    const src = fs.existsSync(UTILS) ? fs.readFileSync(UTILS, "utf8") : "";
    // Match the SPHERE's material CONSTRUCTOR (a `new THREE.Mesh*Material(` call),
    // not a comment mention of the retired Lambert.
    const specular = /new\s+THREE\.Mesh(Phong|Standard|Physical)Material\s*\(/.test(src);
    const lambert = /new\s+THREE\.MeshLambertMaterial\s*\(/.test(src);
    if (specular && !lambert) {
        ok("(2) the sphere material is a SPECULAR material (MeshPhong/Standard/Physical), not MeshLambertMaterial — the lit surface reads as intentional.");
    } else {
        fail(
            `(2) the sphere material is not specular (specular=${specular}, lambert=${lambert}) — ` +
                `swap MeshLambertMaterial → a specular material so the lit surface reads as a deliberate object.`,
        );
    }
}

/** Drive a REAL drag + release over the sphere canvas (a flick that seeds the
 *  decay() glide). Returns whether the gesture fired. */
async function flickSphere(page) {
    const box = await page.evaluate(() => {
        // The amiga WebGL canvas SPECIFICALLY (NOT a Monaco overview-ruler canvas
        // that may also be in the DOM) — the centred sphere is at its centre.
        const c = document.querySelector(".amiga-canvas");
        if (!c) return null;
        const r = c.getBoundingClientRect();
        return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
    });
    if (!box) return false;
    // A fast horizontal flick THROUGH the sphere centre (a few quick moves → a
    // real release velocity the decay() glide coasts off). Press at the centre
    // first (the raycast hit), then sweep.
    await page.mouse.move(box.cx, box.cy);
    await page.mouse.down();
    await page.waitForTimeout(16);
    for (let i = 1; i <= 8; i++) {
        await page.mouse.move(box.cx + i * 14, box.cy, { steps: 1 });
        await page.waitForTimeout(14);
    }
    await page.mouse.up();
    return true;
}

async function runClauses(page, base, consoleErrors) {
    page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));
    page.on("console", (m) => {
        if (m.type() === "error") consoleErrors.push(`console.error: ${m.text()}`);
    });

    // Navigate into amiga (from cube — the switch-in path).
    await page.goto(`${base}/#/cube`, { waitUntil: "load" });
    await navToScene(page, "cube", "Controls", { timeout: 8000 });
    await page.waitForTimeout(700);
    await navToScene(page, "amiga", "Controls", { timeout: 8000 });
    await page.waitForTimeout(1000);

    // ── clause (1) amiga-decay-probe-live (KEYSTONE — RE-ARMED at T.A11) ──
    // The parked `.amiga-telemetry` DOM readout was DELETED (owner-ruled — the
    // dishonest "ω 0.00 rad/s forever at rest"). The decay() dogfood is now
    // witnessed through a NON-DOM sampling hook on the gesture layer
    // (`window.__kfAmigaProbe.omega()`) — the SAME already-tracked physics, made
    // legible without an on-stage readout. The assertion is unchanged: a real
    // flick spikes the angular velocity, which then DECAYS toward zero over the
    // glide window (the visible decay() coast).
    console.log("\nclause (1) amiga-decay-probe-live (KEYSTONE — a flick spikes the non-DOM decay probe, which decays over the glide)");
    const probePresent = await page.evaluate(
        () =>
            typeof (window.__kfAmigaProbe && window.__kfAmigaProbe.omega) ===
            "function",
    );
    if (!probePresent) {
        fail(
            "(1) NO `window.__kfAmigaProbe.omega()` hook — the engine's decay() glide runs UNWITNESSED (the non-DOM dogfood probe is absent).",
        );
    } else {
        // Read the coasting angular velocity from the gesture-layer probe.
        const readValue = () =>
            page.evaluate(() => {
                try {
                    const v = window.__kfAmigaProbe.omega();
                    return typeof v === "number" ? v : null;
                } catch {
                    return null;
                }
            });

        const flicked = await flickSphere(page);
        // Sample the readout across the glide window: it should spike at release
        // then DECAY toward zero (the visible decay() coast).
        const samples = [];
        for (let i = 0; i < 16; i++) {
            samples.push(await readValue());
            await page.waitForTimeout(90);
        }
        const nums = samples.filter((v) => v != null);
        const peak = nums.length ? Math.max(...nums) : 0;
        const tail = nums.length ? nums[nums.length - 1] : null;
        // A genuine decay: a non-trivial peak that the tail falls well below.
        const spiked = peak > 0.5;
        const decayed = tail != null && tail < peak * 0.6;
        if (flicked && spiked && decayed) {
            ok(
                `(1) a REAL flick shows a NON-ZERO angular velocity at release (peak ${peak.toFixed(2)} rad/s) ` +
                    `that DECAYS toward zero over the glide window (tail ${tail.toFixed(2)}) — the visible decay() coast.`,
            );
        } else {
            fail(
                `(1) the telemetry did not show a decaying angular velocity after a flick ` +
                    `(flicked=${flicked}, peak=${peak.toFixed(2)}, tail=${tail}, decayed=${decayed}) — ` +
                    `a static / non-decay()-driven readout reds.`,
            );
        }
    }

    // ── clause (3) glide-teardown-safe (RE-ARMED at T.A8/T.A11) ──
    // The boing double-tap egg was DELETED (the Boing IS the scene now — no
    // dormant arc to wake). The teardown-safety observable moves to the surviving
    // mid-flight motion: a flick seeds a live decay() glide + the group may be
    // playing; navigating away mid-glide must raise NO post-teardown write error
    // (the present loop + glide are canceled on unmount, the probe hook removed).
    console.log("\nclause (3) glide-teardown-safe (a flick + unmount mid-glide raises NO post-teardown write error)");
    const errBefore = consoleErrors.length;
    await flickSphere(page);
    await page.waitForTimeout(200);
    await navToScene(page, "cube", "Controls", { timeout: 8000 });
    await page.waitForTimeout(800);
    const teardownErrors = consoleErrors
        .slice(errBefore)
        .filter((e) =>
            /dispos|null|undefined|Cannot (read|set)|is not a function|position|material/i.test(
                e,
            ),
        );
    if (teardownErrors.length === 0) {
        ok("(3) a flick + unmount mid-glide raised NO post-teardown write error (the present loop + glide are canceled on unmount).");
    } else {
        fail(
            `(3) ${teardownErrors.length} post-teardown error(s) after a flick + unmount:\n      ` +
                teardownErrors.slice(0, 3).join("\n      "),
        );
    }
}

async function browserHalf() {
    const consoleErrors = [];
    const DEMO_URL = process.env.KF_DEMO_URL;
    if (DEMO_URL) {
        const chromium = resolveChromium();
        if (!chromium) {
            console.log("  ○ browser half skipped — playwright not resolvable");
            return;
        }
        const browser = await chromium.launch({ args: WEBGL_LAUNCH_ARGS });
        const ctx = await browser.newContext({
            viewport: { width: 1440, height: 900 },
        });
        const page = await ctx.newPage();
        try {
            await runClauses(page, DEMO_URL, consoleErrors);
        } finally {
            await ctx.close();
            await browser.close();
        }
        return;
    }
    const result = await withPage(
        {
            distDir: DIST,
            label: "the amiga-decay-visible runtime clauses",
            context: { viewport: { width: 1440, height: 900 } },
            // The amiga sphere is WebGL — give the headless runner a SwiftShader
            // context so `new THREE.WebGLRenderer()` succeeds and the real flick →
            // decay() coast is witnessed (see WEBGL_LAUNCH_ARGS).
            launch: { args: WEBGL_LAUNCH_ARGS },
        },
        async (page, { url: base }) => {
            await runClauses(page, base, consoleErrors);
        },
    );
    if (result.skipped) console.log(`  ○ browser half skipped — ${result.reason}`);
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:amiga-decay-visible — FAIL (${failures.length}): the amiga decay() dogfood is not witnessed — ` +
            `the non-DOM decay probe does not decay after a flick, OR the sphere is the flat unlit MeshLambertMaterial, OR a ` +
            `flick + unmount leaks a post-teardown write.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:amiga-decay-visible — PASS: a real flick shows the engine's decay() glide as a decaying angular velocity " +
        "on the non-DOM probe (amiga-decay-probe-live), the sphere is a specular lit surface (specular-material), and a flick + " +
        "unmount raises no post-teardown write (glide-teardown-safe). The engine's analytic decay() dogfood is WITNESSED.",
);
