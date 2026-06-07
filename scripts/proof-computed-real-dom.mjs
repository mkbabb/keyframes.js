#!/usr/bin/env node
/**
 * proof:computed-real-dom — the G.W16 S2 genuine-path C5 gate (Band T,
 * browser-gated).
 *
 * The re-pin's C5 fix (the 24 no-op viewport/container units now RESOLVE —
 * `50dvh`/`100cqw`/`calc(50%+10px)` against the live layout) is the spine's
 * single named correctness break, and the LEAST-protected change in all of G: a
 * DOM-resolution fix the jsdom suite cannot reach (jsdom does no layout). This
 * launcher runs the ONLY genuine-path proof — `bench/computed-real-dom.bench.ts`
 * — which launches Chromium against a served, laid-out page and reads the ACTUAL
 * `getComputedStyle().width` mid-animation against the page's known geometry.
 *
 * It mirrors the `bench/playwright.bench.ts` chromium-resolution convention:
 *   - SKIP locally when Chromium is unresolvable (`KF_PLAYWRIGHT_DIR` unset / no
 *     playwright install) — the bench self-skips via its chromium guard, so this
 *     launcher exits 0 with a SKIP notice.
 *   - HARD-FAIL in CI under `KF_REQUIRE_BROWSER=1` — the bench throws on the
 *     missing browser, vitest exits non-zero, this launcher reds.
 *   - builds the library first if dist is stale, so it measures the CURRENT
 *     engine on the genuine path.
 *
 * BITE: revert value.js to `^0.10.0` (the pre-C5 no-op classifier) → the live
 * page resolves to the bare number / freezes at the un-resolved value → the px
 * no longer matches the page geometry → the bench throws → this gate reds. (Run
 * the real check with `KF_PLAYWRIGHT_DIR=… KF_REQUIRE_BROWSER=1 node
 * scripts/proof-computed-real-dom.mjs`.)
 *
 * The natural sibling of G.W3's `proof:resize-tracks` — both ride this corpus +
 * harness on a real laid-out DOM.
 */
import { execSync, spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distPath = join(root, "dist", "keyframes.js");
const srcDir = join(root, "src", "animation");

function newestMtime(dir) {
    let newest = 0;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, entry.name);
        const m = entry.isDirectory() ? newestMtime(p) : statSync(p).mtimeMs;
        if (m > newest) newest = m;
    }
    return newest;
}

/** Resolve Chromium the way bench/playwright.bench.ts does. */
function chromiumResolvable() {
    const base = process.env.KF_PLAYWRIGHT_DIR ?? root;
    const requireFrom = createRequire(join(base, "package.json"));
    for (const pkg of ["playwright-core", "@playwright/test", "playwright"]) {
        try {
            requireFrom.resolve(pkg);
            return true;
        } catch {
            /* try next */
        }
    }
    return false;
}

console.log("proof:computed-real-dom — G.W16 S2 (the genuine-path C5 proof)");

if (!chromiumResolvable()) {
    const msg =
        "proof:computed-real-dom — SKIP: Chromium/playwright not resolvable " +
        "(set KF_PLAYWRIGHT_DIR or install @playwright/test). Run the real " +
        "check with `KF_PLAYWRIGHT_DIR=… KF_REQUIRE_BROWSER=1 node scripts/proof-computed-real-dom.mjs`.";
    if (process.env.KF_REQUIRE_BROWSER) {
        console.error(msg.replace("SKIP", "FAIL"));
        process.exit(1);
    }
    console.warn(msg);
    process.exit(0);
}

// Build the library if dist is absent or older than the engine source, so the
// gate exercises the CURRENT engine on the genuine path.
if (!existsSync(distPath) || statSync(distPath).mtimeMs < newestMtime(srcDir)) {
    console.log("[proof:computed-real-dom] building library (dist stale/missing)…");
    execSync("npm run build:lib", { cwd: root, stdio: "inherit" });
}

// Run the bench gate (the bench body throws on any C5 resolution violation).
const result = spawnSync(
    "npx",
    ["vitest", "bench", "--run", "bench/computed-real-dom.bench.ts"],
    { cwd: root, stdio: "inherit", env: process.env },
);

if (result.status !== 0) {
    console.error(
        "\nproof:computed-real-dom — FAIL: the C5 computed-unit resolution did not " +
            "hold on the genuine layout path (see the bench output above).",
    );
    process.exit(1);
}
console.log(
    "\nproof:computed-real-dom — PASS: the C5 computed-unit corpus resolved on the " +
        "genuine layout path (or SKIPPED locally with no browser — HARD-FAIL in CI " +
        "under KF_REQUIRE_BROWSER).",
);
