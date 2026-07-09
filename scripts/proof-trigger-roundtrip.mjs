#!/usr/bin/env node
/**
 * proof:trigger-roundtrip — S.F4 BROWSER-HARNESS gate (SPEC §3 S.F4 hard gate;
 * C-14; r5). The demo-correctness roster member (browser-actuating library-value
 * gate — enrolled beside the other browser actuators `proof:compile-browser-parse`
 * / `proof:split-a11y`, NOT a jsdom `proof:library-correctness` slot).
 *
 * WHY BROWSER-HARNESS, NOT jsdom (load-bearing): the native/fallback split turns
 * on `CSS.supports("animation-trigger", …)`. jsdom's `CSS.supports` does NOT know
 * `animation-trigger`, so the feature-detect that chooses native-vs-kf is
 * INVISIBLE in jsdom — a jsdom slot could only assert the kf state machine (the
 * fast half in test/scroll/scroll-scene.test.ts already does), never that the
 * driver's dispatch verdict MATCHES a real browser's platform support. A jsdom
 * slot would be a FALSE green (and would correctly RED under S.A4's symmetric
 * mis-tier clause). This gate ACTUATES a real Chromium (playwright-core via
 * glass-ui's install, KF_PLAYWRIGHT_DIR) and asserts VIA THE BROWSER.
 *
 * The gate DRIVES the born-RED oracle `test/scroll/trigger-oracle.test.ts`: it
 * bundles the value.js-free kf trigger driver into a real page and drives the
 * PARSED `animation-trigger` grammar THROUGH the JS driver, asserting the
 * observed idle→active→done (+ backward/repeat) transitions — the grammar→behavior
 * round-trip. Scrub-based structural assertions (the STATE sequence a scroll
 * position crosses), never a raw fps/ms threshold (C-10). The oracle SKIPS (never
 * fails) when playwright-core is not resolvable, so a browserless env is not a
 * false red; set KF_PLAYWRIGHT_DIR to actuate.
 *
 * RUN: npm run proof:trigger-roundtrip
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORACLE = "test/scroll/trigger-oracle.test.ts";

console.log(
    "proof:trigger-roundtrip — S.F4 animation-trigger grammar→behavior oracle " +
        `(${ORACLE}, playwright-core)`,
);
if (!process.env.KF_PLAYWRIGHT_DIR) {
    console.log(
        "  (KF_PLAYWRIGHT_DIR unset — the oracle resolves playwright from the repo " +
            "and SKIPS if absent; set KF_PLAYWRIGHT_DIR=<glass-ui> to actuate a browser.)",
    );
}

const res = spawnSync("npx", ["vitest", "run", ORACLE], {
    cwd: REPO,
    stdio: "inherit",
    env: process.env,
});

if (res.status !== 0) {
    console.error(
        "\nproof:trigger-roundtrip — FAIL: the animation-trigger browser oracle " +
            "red'd. A parsed <trigger-type> did NOT drive its declared idle→active→" +
            "done (+ backward/repeat) transitions in the ScrollScene driver, OR the " +
            "native/fallback feature-detect diverged from the browser's CSS.supports " +
            "verdict. The kf parser round-trip CANNOT substitute for this browser-" +
            "actuated clause.",
    );
    process.exit(res.status ?? 1);
}
console.log(
    "\nproof:trigger-roundtrip — PASS: the parsed animation-trigger grammar drives " +
        "the observed idle→active→done lifecycle in the browser, and the native/" +
        "fallback split is feature-detected (never UA-sniffed).",
);
process.exit(0);
