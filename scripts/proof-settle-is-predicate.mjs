#!/usr/bin/env node
/**
 * proof:settle-is-predicate — L.W4 S2 (the W28 fixed-ms-sleep root; the K audit's
 * 259-sleep macOS-pass / Linux-fail class), WIDENED at S.A2 S4 from the single
 * sampled site to ALL of the shared driver code.
 *
 * THE BREACH (the K close post-mortem; audit Lane 33). `openControlsPanel` in
 * scripts/lib/demo-driver.mjs carried FOUR `page.waitForTimeout(N)` calls
 * (500/800/600/800 ms). A fixed sleep races the render: it passes on a fast
 * macOS box (the work finishes inside the budget) and FAILS on the slow Linux
 * CI runner (the work overruns the budget — the pane is not open when the gate
 * probes). `openControlsPanel` is the load-bearing helper EVERY layout-probing
 * gate calls before reading the open-pane DOM, so its sleeps were the shared race
 * surface. The cure (`navToScene`) already existed for scene-nav — it waits on a
 * `waitForFunction` PREDICATE (the timeout is a ceiling; the wait returns the
 * INSTANT the predicate holds — load-INDEPENDENT by construction). The
 * transposition spread that contract to `openControlsPanel` via the
 * `waitForRender(page, predicate, { timeout })` helper.
 *
 * THE S.A2 S4 WIDEN — "not just the sampled sites" (SPEC §3 S.A2 S4). The L.W4
 * form scanned ONLY the `openControlsPanel` body, so a fixed `waitForTimeout(600)`
 * planted into ANY OTHER shared-driver helper (`navToScene`, a new roster
 * primitive, …) evaded it — the exact race class re-opening one function over.
 * The widen bans a NUMERIC-literal `page.waitForTimeout(<n>)` across the ENTIRE
 * shared driver surface: `scripts/lib/demo-driver.mjs` (the whole navigation /
 * interaction driver every browser gate rides) + `scripts/run-demo-roster.mjs`
 * (the S.A2 net-deletion roster driver — one shared chromium + one served dist).
 * A caller-supplied variable timeout is NOT banned (it is a ceiling the caller
 * owns); a hard-coded number IS (the macOS-pass / Linux-fail race).
 *
 * THE GATE (STATIC — no browser; runs in the fast `gates` job, adds zero
 * demo-smoke wall-clock). It greps every shared-driver file and asserts ZERO
 * numeric-literal `page.waitForTimeout(<number>)` calls anywhere in them, and
 * (corroborator) that `openControlsPanel` is clean + the `waitForRender` settle
 * primitive is exported.
 *
 * BORN-RED witness: plant a `page.waitForTimeout(500)` into any shared-driver
 * helper (e.g. `navToScene`) → the widened gate reds (the L.W4 form did not);
 * remove it → green. Re-runnable: `node scripts/proof-settle-is-predicate.mjs`.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// ── The shared DRIVER surface (S.A2 S4) — the code EVERY browser gate rides.
// A fixed sleep here is the shared macOS-pass / Linux-fail race. A path that
// does not exist yet (the roster driver lands with the net-deletion) is simply
// skipped — the gate binds to what is present, never reds on an absent file.
const DRIVER_FILES = [
    join(root, "scripts", "lib", "demo-driver.mjs"),
    join(root, "scripts", "run-demo-roster.mjs"),
];

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:settle-is-predicate — L.W4 S2 + S.A2 S4 widen (the shared driver settles on state " +
        "predicates, not fixed-ms sleeps — across ALL driver code, not just openControlsPanel)",
);

// A NUMERIC-literal fixed sleep: `.waitForTimeout(` followed by a number (the
// race class). A caller-supplied variable (`waitForTimeout(settleMs)`) is a
// ceiling the caller owns and is NOT matched — only the hard-coded literal is.
const NUMERIC_SLEEP = /\.waitForTimeout\s*\(\s*[0-9]/g;

// Strip line comments + block comments + the JSDoc header so a `waitForTimeout(N)`
// mentioned in PROSE (this file's own docstring analogue) never false-matches.
function stripComments(src) {
    return src
        .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
        .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length));
}

let scanned = 0;
for (const file of DRIVER_FILES) {
    const rel = file.slice(root.length + 1);
    if (!existsSync(file)) continue; // binds to what is present (roster driver may be pre-net-deletion)
    scanned++;
    const src = stripComments(readFileSync(file, "utf8"));
    const hits = src.match(NUMERIC_SLEEP) ?? [];
    if (hits.length > 0) {
        fail(
            `${rel} contains ${hits.length} fixed-ms \`page.waitForTimeout(<number>)\` call(s) — ` +
                "the macOS-pass / Linux-fail render-race class. Transpose each to a " +
                "`waitForRender(page, predicate, …)` settle (the navToScene contract: the timeout is a " +
                "ceiling; the wait returns the instant the predicate holds).",
        );
    } else {
        ok(`${rel} — ZERO numeric-literal \`waitForTimeout(<number>)\` calls (load-independent by construction).`);
    }
}
if (scanned === 0) {
    fail(
        "no shared-driver file found to scan (scripts/lib/demo-driver.mjs missing) — the driver moved; " +
            "re-ground the gate.",
    );
}

// ── Corroborators (LABELED — corroborate the cure, never substitute for the
// whole-file ban above). Isolate the historically-breached `openControlsPanel`
// body + assert the `waitForRender` primitive is exported. ────────────────────
const DRIVER = join(root, "scripts", "lib", "demo-driver.mjs");
if (existsSync(DRIVER)) {
    const src = readFileSync(DRIVER, "utf8");

    const sigRe = /export\s+async\s+function\s+openControlsPanel\s*\([^)]*\)\s*\{/;
    const sigM = sigRe.exec(src);
    if (!sigM) {
        fail(
            "could not locate `export async function openControlsPanel(...) {` in demo-driver.mjs " +
                "— the helper was renamed/removed; re-ground the corroborator.",
        );
    } else {
        const bodyStart = sigM.index + sigM[0].length - 1;
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
            const body = stripComments(src.slice(bodyStart, end + 1));
            const sleeps = body.match(/\.waitForTimeout\s*\(/g) ?? [];
            if (sleeps.length > 0) {
                fail(
                    `corroborator — openControlsPanel still contains ${sleeps.length} \`waitForTimeout(...)\` ` +
                        "call(s) (the sampled-site breach). Transpose each to a `waitForRender` settle.",
                );
            } else {
                ok("corroborator — openControlsPanel (the sampled site) contains ZERO `waitForTimeout(...)` calls.");
            }
        }
    }

    const hasHelper = /export\s+async\s+function\s+waitForRender\s*\(/.test(src);
    if (hasHelper) {
        ok("corroborator — the `waitForRender(page, predicate, { timeout })` settle primitive is exported (the navToScene-contract helper the transposition rides).");
    } else {
        fail(
            "no exported `waitForRender(...)` helper in demo-driver.mjs — the S2 settle primitive " +
                "is the cure the transposition depends on; author it alongside navToScene.",
        );
    }
}

// ── Verdict ──────────────────────────────────────────────────────────────────
if (failures.length > 0) {
    console.error(
        `\nproof:settle-is-predicate — FAIL (${failures.length}): the shared driver still settles on a ` +
            "fixed-ms sleep somewhere (or the waitForRender primitive is missing) — the 259-sleep " +
            "macOS-pass / Linux-fail race root (S2), widened to ALL driver code (S.A2 S4).",
    );
    process.exit(1);
}
console.log(
    `\nproof:settle-is-predicate — PASS: all ${scanned} shared-driver file(s) settle on state predicates ` +
        "(zero numeric-literal fixed-ms sleeps); load-independent by construction (the navToScene contract).",
);
