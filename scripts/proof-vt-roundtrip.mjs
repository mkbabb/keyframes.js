#!/usr/bin/env node
/**
 * proof:vt-roundtrip — S.F1 VT-c BORN-RED browser-harness gate (SF-5, p09). The
 * demo-correctness roster member (a browser-actuating LIBRARY-VALUE gate —
 * enrolled beside the other browser actuators, NOT a jsdom
 * `proof:library-correctness` slot, per the S.F preamble tier-reconciliation note
 * + the `proof:compile-browser-parse` / `proof:split-a11y` precedent).
 *
 * WHY BROWSER-HARNESS, NOT jsdom (load-bearing): jsdom has NO View Transitions —
 * no `::view-transition-*` pseudo tree, no `getAnimations()` over it — so "the
 * emitted names/durations/`linear()` drive the old/new pseudos AND the group
 * pseudo carries the emitted duration" is INVISIBLE there. A jsdom slot would be a
 * FALSE green (and would correctly RED under S.A4's symmetric mis-tier clause).
 * This ACTUATES a real Chromium (playwright-core via glass-ui's install,
 * KF_PLAYWRIGHT_DIR) and asserts VIA THE BROWSER.
 *
 * The gate DRIVES the born-RED oracle `test/compile/view-transition-roundtrip.test.ts` — it
 * runs against the CURRENT TS source (vitest's TS pipeline), NOT a stale built
 * `dist/`. STRUCTURAL, device-INDEPENDENT: the emitted names/durations/`linear()`
 * on the old/new pseudos (via `effect.pseudoElement`); the group pseudo carrying
 * the emitted duration (the mandatory timing-only override — its OMISSION ships
 * the 250ms/ease temporal incoherence p09 observed); + ONE settled-state
 * rect-tolerance clause (the flipShared visual-equivalence letter). NO per-frame
 * pixel/ms threshold (C-10 governs the plan). The oracle SKIPS (never fails) when
 * playwright-core is not resolvable, so a browserless env is not a false red; set
 * KF_PLAYWRIGHT_DIR to actuate.
 *
 * BORN-RED WITNESS: with no `compile/view-transition.ts` emitter the oracle's
 * import of `compileToViewTransition` fails → RED; and with the group timing-only
 * emission deleted, the group pseudo carries the UA 250ms (not the emitted 350ms)
 * → the keystone assertion REDs. GREEN once the emitter ships the three surfaces.
 *
 * RUN: npm run proof:vt-roundtrip
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORACLE = "test/compile/view-transition-roundtrip.test.ts";

console.log(
    "proof:vt-roundtrip — S.F1 View-Transitions round-trip oracle " +
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
        "\nproof:vt-roundtrip — FAIL: the View-Transitions round-trip oracle red'd. " +
            "The emitted names/durations/linear() did not drive the ::view-transition- " +
            "old/new pseudos, or the ::view-transition-group pseudo did NOT carry the " +
            "emitted duration (the mandatory timing-only override — its omission ships " +
            "the 250ms/ease temporal incoherence), or the settled-state rect clause " +
            "failed. The kf-parser round-trip CANNOT substitute for this browser gate.",
    );
    process.exit(res.status ?? 1);
}
console.log(
    "\nproof:vt-roundtrip — PASS: the emitted names/durations/linear() drive the " +
        "old/new pseudos, the group pseudo carries the emitted duration (temporal " +
        "coherence), and the subject settles at its committed rect.",
);
process.exit(0);
