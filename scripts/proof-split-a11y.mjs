#!/usr/bin/env node
/**
 * proof:split-a11y — S.F2 SplitText BROWSER-HARNESS gate (the T8 hard gate). A
 * demo-correctness roster member (a browser-actuating LIBRARY-VALUE gate —
 * enrolled beside the other browser actuators, NOT a jsdom
 * `proof:library-correctness` slot, per the S.F preamble tier-reconciliation
 * note + the S.B3 `proof:compile-browser-parse` precedent).
 *
 * WHY BROWSER-HARNESS, NOT jsdom (load-bearing): the COMPUTED ACCESSIBLE NAME is
 * a browser artifact. jsdom does not run the ARIA name-computation algorithm, so
 * "the split container's accessible name == the pre-split string" is INVISIBLE
 * in jsdom — a jsdom slot could only check the raw `aria-label` ATTRIBUTE
 * (source-shape), never that a plain `<div>` (role=generic, name-prohibited)
 * would DROP that label. A jsdom slot would be a FALSE green (and would correctly
 * RED under S.A4's symmetric mis-tier clause). This gate ACTUATES a real Chromium
 * (playwright-core via glass-ui's install, KF_PLAYWRIGHT_DIR) and asserts VIA THE
 * BROWSER A11Y TREE (`page.accessibility.snapshot`).
 *
 * The gate DRIVES the born-RED oracle `test/orchestration/split-a11y-oracle.test.ts`, which
 * ISOLATES a value.js-free `{ splitText, stagger }` bundle off the LIGHT source
 * (the SAME rolldown mechanism `proof:boundary` uses to prove the entry is
 * value.js-free), serves it over a same-origin static server, and runs the REAL
 * `splitText` in-browser against the live DOM — the shipped LIGHT code as
 * written, no stale `dist/` (a revert of the a11y wiring reds the name-equality
 * clause with NO rebuild). Two clauses: (a) the split container's computed
 * accessible name equals the pre-split string with NO per-fragment named leaf
 * surviving the a11y tree (the name is CONSOLIDATED, not shattered); (b) the
 * fragments ANIMATE under the ready stagger (an earlier-delayed fragment is
 * further along than a later-delayed one at the same scrub time). The oracle
 * SKIPS (never fails) when playwright-core is not resolvable, so a browserless
 * env is not a false red; set KF_PLAYWRIGHT_DIR to actuate.
 *
 * The jsdom-viable half (the a11y ATTRIBUTE wiring + the by:"line"
 * measure-or-refuse posture) lives in `test/orchestration/split-text.test.ts` (the fast local
 * bite, run by the default `vitest run`); THIS is the browser a11y-tree half.
 *
 * RUN: npm run proof:split-a11y
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORACLE = "test/orchestration/split-a11y-oracle.test.ts";

console.log(
    "proof:split-a11y — S.F2 SplitText a11y-tree browser oracle " +
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
        "\nproof:split-a11y — FAIL: the SplitText a11y-tree oracle red'd. The split " +
            "container's COMPUTED accessible name did not equal the pre-split string " +
            "(the name was shattered — fragment text exposed without an author-name- " +
            "capable role consolidation), or the fragments did not animate under the " +
            "ready stagger. The a11y ATTRIBUTE presence (jsdom) CANNOT substitute for " +
            "this browser a11y-tree clause.",
    );
    process.exit(res.status ?? 1);
}
console.log(
    "\nproof:split-a11y — PASS: the split container's computed accessible name == " +
        "the pre-split string (consolidated, not shattered) and the fragments animate " +
        "under the ready stagger.",
);
process.exit(0);
