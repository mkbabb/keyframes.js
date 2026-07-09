#!/usr/bin/env node
/**
 * proof:compile-browser-parse — S.B3 EN-a/EN-b BROWSER-HARNESS gate (SPEC §3 S.B3
 * clause 4 + EN-b's browser half; en-fix-proto.md §5.3). The demo-correctness
 * roster member (browser-actuating library-value gate — enrolled beside the other
 * browser-parse actuators, NOT a jsdom `proof:library-correctness` slot).
 *
 * WHY BROWSER-HARNESS, NOT jsdom (load-bearing): jsdom's `getComputedStyle` does
 * NOT drop an invalid `animation` shorthand, so the EN-a bug (`ease-out-cubic`
 * voiding the whole declaration → `animation-name: none`) is INVISIBLE in jsdom —
 * precisely why P2-2 F6 evaded every existing jsdom round-trip gate. A jsdom slot
 * would be a FALSE green (and would correctly RED under S.A4's symmetric mis-tier
 * clause). This gate ACTUATES a real Chromium (playwright-core via glass-ui's
 * install, KF_PLAYWRIGHT_DIR) and asserts VIA THE BROWSER.
 *
 * The gate DRIVES the proven born-RED oracle `test/engine/en-fix-oracle.test.ts` (the
 * vitest browser oracle) — it runs against the CURRENT TS source (vitest's TS
 * pipeline), NOT a stale built `dist/`, so it tests the shipped serialize path as
 * written. Two clauses: EN-a (an emitted `easeOutCubic` artifact computes
 * `animation-name !== none`) + EN-b's browser half (a mixed `opacity+transform+
 * color` track animates ALL three props). The oracle SKIPS (never fails) when
 * playwright-core is not resolvable, so a browserless env is not a false red; set
 * KF_PLAYWRIGHT_DIR to actuate.
 *
 * RUN: npm run proof:compile-browser-parse
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORACLE = "test/engine/en-fix-oracle.test.ts";

console.log(
    "proof:compile-browser-parse — S.B3 EN-a/EN-b browser-parse oracle " +
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
        "\nproof:compile-browser-parse — FAIL: the EN-a/EN-b browser oracle red'd. " +
            "An emitted registry-easing artifact computed `animation-name: none` " +
            "(EN-a), or a mixed track dropped its non-color props (EN-b). The kf " +
            "parser round-trip CANNOT substitute for this browser-parse clause.",
    );
    process.exit(res.status ?? 1);
}
console.log(
    "\nproof:compile-browser-parse — PASS: the emitted easeOutCubic artifact is " +
        "browser-VALID (animation-name !== none) and the mixed track animates all props.",
);
process.exit(0);
