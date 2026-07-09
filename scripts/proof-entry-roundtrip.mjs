#!/usr/bin/env node
/**
 * proof:entry-roundtrip — S.F3 EN-c BORN-RED browser-harness gate (C-22; P2-2).
 * The demo-correctness roster member (a browser-actuating LIBRARY-VALUE gate —
 * enrolled beside the other browser actuators, NOT a jsdom
 * `proof:library-correctness` slot, per the S.F preamble tier-reconciliation note
 * + the `proof:compile-browser-parse` / `proof:vt-roundtrip` precedent).
 *
 * WHY BROWSER-HARNESS, NOT jsdom (load-bearing): `@starting-style` /
 * `transition-behavior: allow-discrete` / `overlay` / the CSSTransition tree are
 * platform artifacts jsdom does NOT run — "the mid-exit display is HELD block" and
 * "without @starting-style there are ZERO transitions" are INVISIBLE there. A
 * jsdom slot would be a FALSE green (and would correctly RED under S.A4's
 * symmetric mis-tier clause). This ACTUATES a real Chromium (playwright-core via
 * glass-ui's install, KF_PLAYWRIGHT_DIR).
 *
 * The gate DRIVES the born-RED oracle `test/compile/entry-roundtrip.test.ts` — SCRUB-BASED
 * structural assertions ONLY, ZERO frame/ms races (C-10). The S1–S7 clause map:
 * S1 (entry transitions with the emitted duration/linear(); scrub-0 == the
 * @starting-style endpoint; entry display has NO CSSTransition — the EXIT hold
 * only), S2/S4 (control clauses), S3 (mid-exit display HELD block, post-finish
 * none), S7 (top-layer overlay hold). The oracle SKIPS (never fails) when
 * playwright-core is not resolvable; set KF_PLAYWRIGHT_DIR to actuate.
 *
 * BORN-RED WITNESS: no `compile/entry.ts` emitter (the oracle's import of
 * `compileToEntry` fails → RED); AND the substrate is browser-dead until S.B3's
 * EN-a lands (`serializeEasing` emits `ease-out-cubic` → `animation-name: none`),
 * so even a naive emitter's S1 has nothing to actuate. GREEN once EN-a is in and
 * EN-c ships the three-rule grammar.
 *
 * RUN: npm run proof:entry-roundtrip
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORACLE = "test/compile/entry-roundtrip.test.ts";

console.log(
    "proof:entry-roundtrip — S.F3 entry/exit round-trip oracle " +
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
        "\nproof:entry-roundtrip — FAIL: the entry/exit round-trip oracle red'd. " +
            "The entry transitions did not run with the emitted duration/linear(), " +
            "scrub-0 did not equal the @starting-style endpoint, a control clause " +
            "(no @starting-style / no allow-discrete) did not isolate its construct, " +
            "or the mid-exit display/overlay HOLD did not hold. The kf-parser " +
            "round-trip CANNOT substitute for this browser gate.",
    );
    process.exit(res.status ?? 1);
}
console.log(
    "\nproof:entry-roundtrip — PASS: entry transitions run the emitted duration/ " +
        "linear() from the @starting-style endpoint, the controls isolate the " +
        "load-bearing constructs, and the allow-discrete exit HOLDS display/overlay.",
);
process.exit(0);
