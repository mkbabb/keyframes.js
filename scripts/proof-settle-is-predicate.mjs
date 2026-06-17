#!/usr/bin/env node
/**
 * proof:settle-is-predicate — L.W4 S2 (the W28 fixed-ms-sleep root; the K audit's
 * 259-sleep macOS-pass / Linux-fail class). The falsifiable form of "the
 * load-bearing demo-driver helper settles on a STATE PREDICATE, never on a fixed
 * wall-clock sleep".
 *
 * THE BREACH (the K close post-mortem; audit Lane 33). `openControlsPanel` in
 * scripts/lib/demo-driver.mjs carried FOUR `page.waitForTimeout(N)` calls
 * (500/800/600/800 ms). A fixed sleep races the render: it passes on a fast
 * macOS box (the work finishes inside the budget) and FAILS on the slow Linux
 * CI runner (the work overruns the budget — the pane is not open when the gate
 * probes). `openControlsPanel` is the load-bearing helper EVERY layout-probing
 * gate calls before reading the open-pane DOM, so its sleeps are the shared race
 * surface. The cure (`navToScene`) already existed for scene-nav — it waits on a
 * `waitForFunction` PREDICATE (the timeout is a ceiling; the wait returns the
 * INSTANT the predicate holds — load-INDEPENDENT by construction). The
 * transposition spreads that contract to `openControlsPanel` via the new
 * `waitForRender(page, predicate, { timeout })` helper.
 *
 * THE GATE (STATIC — no browser; runs in the `gates` job, adds zero demo-smoke
 * wall-clock). It greps the `openControlsPanel` function body in
 * scripts/lib/demo-driver.mjs and asserts ZERO `page.waitForTimeout(...)` calls.
 *
 * BORN-RED on today's tree (FOUR `waitForTimeout` calls in openControlsPanel);
 * GREEN after the transposition replaces them with `waitForRender` predicates.
 * BITE: re-introduce ANY fixed `waitForTimeout` into openControlsPanel → reds.
 * Re-runnable: `node scripts/proof-settle-is-predicate.mjs`.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRIVER = join(root, "scripts", "lib", "demo-driver.mjs");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:settle-is-predicate — L.W4 S2 (openControlsPanel settles on a state predicate, not a fixed-ms sleep)",
);

if (!existsSync(DRIVER)) {
    fail(`scripts/lib/demo-driver.mjs not found at ${DRIVER} — the driver moved; re-ground the gate.`);
} else {
    const src = readFileSync(DRIVER, "utf8");

    // Isolate the `openControlsPanel` function body. Anchor on its declaration,
    // then brace-match from the first `{` after the signature to its close.
    const sigRe = /export\s+async\s+function\s+openControlsPanel\s*\([^)]*\)\s*\{/;
    const sigM = sigRe.exec(src);
    if (!sigM) {
        fail(
            "could not locate `export async function openControlsPanel(...) {` in demo-driver.mjs " +
                "— the helper was renamed/removed; re-ground the gate.",
        );
    } else {
        const bodyStart = sigM.index + sigM[0].length - 1; // index of the opening `{`
        let depth = 0;
        let end = -1;
        for (let i = bodyStart; i < src.length; i++) {
            const ch = src[i];
            if (ch === "{") depth++;
            else if (ch === "}") {
                depth--;
                if (depth === 0) {
                    end = i;
                    break;
                }
            }
        }
        if (end === -1) {
            fail("openControlsPanel body has an unbalanced brace — cannot scan it.");
        } else {
            const body = src.slice(bodyStart, end + 1);
            // Count fixed-ms sleeps: `page.waitForTimeout(...)` (the .waitForTimeout
            // method on the page handle). Any occurrence is the breach.
            const sleeps = body.match(/\.waitForTimeout\s*\(/g) ?? [];
            if (sleeps.length > 0) {
                fail(
                    `openControlsPanel contains ${sleeps.length} fixed-ms \`waitForTimeout(...)\` ` +
                        "call(s) — the macOS-pass / Linux-fail render-race class. Transpose each to a " +
                        "`waitForRender(page, predicate, …)` settle (the navToScene contract: the " +
                        "timeout is a ceiling; the wait returns the instant the predicate holds).",
                );
            } else {
                ok(
                    "openControlsPanel contains ZERO `waitForTimeout(...)` calls — it settles on " +
                        "state predicates (waitForRender), load-independent by construction (S2).",
                );
            }
        }
    }

    // Corroborator (LABELED — corroborates the cure, never substitutes for the
    // breach clause above): the `waitForRender` helper exists + is exported, so
    // the transposed callers have a settle primitive to call. A missing helper
    // would mean the sleeps were merely deleted (a broken drive), not transposed.
    const hasHelper = /export\s+async\s+function\s+waitForRender\s*\(/.test(src);
    if (hasHelper) {
        ok(
            "the `waitForRender(page, predicate, { timeout })` settle primitive is exported from " +
                "demo-driver.mjs (the navToScene-contract helper the transposition rides).",
        );
    } else {
        fail(
            "no exported `waitForRender(...)` helper in demo-driver.mjs — the S2 settle primitive " +
                "is the cure the openControlsPanel transposition depends on; author it alongside navToScene.",
        );
    }
}

// ── Verdict ──────────────────────────────────────────────────────────────────
if (failures.length > 0) {
    console.error(
        `\nproof:settle-is-predicate — FAIL (${failures.length}): the load-bearing ` +
            "openControlsPanel helper still settles on a fixed-ms sleep (or the waitForRender " +
            "primitive is missing) — the 259-sleep macOS-pass / Linux-fail race root (S2).",
    );
    process.exit(1);
}
console.log(
    "\nproof:settle-is-predicate — PASS: openControlsPanel settles on state predicates via " +
        "waitForRender (zero fixed-ms sleeps); load-independent by construction (the navToScene contract).",
);
