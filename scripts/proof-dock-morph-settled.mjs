#!/usr/bin/env node
/**
 * proof:dock-morph-settled — H.W8 S3/S4 · the dock-spring SETTLE half (D5 LAG,
 * cross-repo) · the chronic-closure HANDOFF gate, born-RED on the un-bumped tree.
 *
 * BLK-3 — CANONICAL NAME `proof:dock-morph-settled` (NOT `proof:dock-live`). This
 * gate polices the dock-spring SETTLE half ONLY — D5, the dock-resize LAG, owned by
 * glass-ui's `--spring-dock` token. The @mbabb popover-OPENS half (D9) is SPLIT OUT
 * to H.W1's `proof:dock-popover-opens` (a kf SHIP gate) — do NOT conflate the two.
 *
 * BLK-5 / inv-16 — this is a CONSUME-LEG, not a kf fork. The dock spring lives in
 * `@mkbabb/glass-ui`'s `tokens.css` (`--spring-dock`). kf does NOT re-author the
 * spring; it CONSUMES the published token. The fix for D5 is the consume-leg bump
 * `@mkbabb/glass-ui ^3.4.0 → ^3.5.1` (glass-ui 3.5.0/3.5.1/3.6.0/3.7.0 are PUBLISHED
 * on npm; `53c1b07` carries the dock-spring retune) — NOT a wait, NOT a fork.
 *
 * THE TOKEN-PEAK FORM (WV-W8-MED-5 / BLK-5) — the settle-≤1-frame budget cannot be
 * derived from a broken pre-fix baseline (the morph is not reliably driveable live:
 * 181 samples, no morph captured), so the gate measures the SPRING TOKEN directly:
 * the `--spring-dock: linear(...)` ramp's PEAK value. A `linear()` easing ramps
 * through a series of `value percent` stops; the peak overshoot (max value − 1) is
 * the spring's settle aggression — the higher the overshoot, the longer + bouncier
 * the visual settle (the felt "lag"). The budget: peak overshoot ≤ +6%.
 *
 *   - glass-ui ^3.4.0 (the installed register BEFORE the H bump): peak = 1.16292 →
 *     +16.3% overshoot → RED (the born-RED today state — D5 is live).
 *   - glass-ui ≥3.5.1 (the consume-leg retune `53c1b07`): peak = 1.04501 → +4.5%
 *     overshoot → GREEN (the dock settles tight; D5 closes via the consumed token).
 *
 * BITE: revert `@mkbabb/glass-ui` to `^3.4.0` + re-lock → the installed token's peak
 * re-rises to +16.3% > +6% → reds (the consume-leg regressed). Greens ONLY when the
 * INSTALLED glass-ui carries the retuned spring — the kf-side WATCH on the HANDOFF;
 * kf cannot satisfy it by forking the token (the gate reads node_modules, not a kf
 * file).
 *
 * Static gate — reads the INSTALLED `@mkbabb/glass-ui/dist/styles/tokens.css`. No
 * browser, no build. Re-runnable: `node scripts/proof-dock-morph-settled.mjs`.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// The settle budget: the `--spring-dock` ramp peak overshoot must be ≤ +6%.
// Born-RED on glass-ui ^3.4.0 (+16.3%); green on the ≥3.5.1 retune (+4.5%).
const PEAK_OVERSHOOT_CEILING = 0.06;

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:dock-morph-settled — H.W8 (the dock-spring settle half · D5 LAG · " +
        "consume-leg HANDOFF · token-peak ≤ +6%)",
);

const TOKENS = join(
    ROOT,
    "node_modules",
    "@mkbabb",
    "glass-ui",
    "dist",
    "styles",
    "tokens.css",
);

if (!existsSync(TOKENS)) {
    // glass-ui is an optionalDependency; on a clean runner without it the dock
    // token is not present. This gate cannot measure the spring it does not have —
    // fail EXPLICIT (the consume-leg cannot be vacuously green).
    fail(
        "@mkbabb/glass-ui is not installed — the dock-spring token cannot be " +
            "measured (install the optionalDependency; the demo CI arm runs npm ci)",
    );
} else {
    const css = readFileSync(TOKENS, "utf8");

    // Locate the `--spring-dock: linear( … );` declaration and isolate its body.
    const m = /--spring-dock:\s*linear\(([^;]*)\)\s*;/.exec(css);
    if (!m) {
        fail(
            "tokens.css declares no `--spring-dock: linear(...)` — the dock-spring " +
                "token moved or was renamed; re-ground the gate against the new name",
        );
    } else {
        const body = m[1];
        // A linear() easing is a comma-separated list of `value [percent[ percent]]`
        // stops. The first token of each stop is the easing OUTPUT value; the peak
        // of those values is the spring overshoot. Pull every leading numeric value.
        const stops = body.split(",").map((s) => s.trim());
        let peak = -Infinity;
        for (const stop of stops) {
            // The leading number of the stop (before any percent position).
            const vm = /^(-?\d*\.?\d+)/.exec(stop);
            if (vm) {
                const v = Number.parseFloat(vm[1]);
                if (Number.isFinite(v) && v > peak) peak = v;
            }
        }

        if (!Number.isFinite(peak)) {
            fail(
                "could not parse any numeric stop from `--spring-dock: linear(...)` " +
                    "— the token body is malformed",
            );
        } else {
            const overshoot = peak - 1; // value 1.0 is "settled"; >1 is overshoot.
            const pct = (overshoot * 100).toFixed(1);
            const ceilPct = (PEAK_OVERSHOOT_CEILING * 100).toFixed(0);
            // Read the installed glass-ui version for the report.
            let version = "unknown";
            try {
                version = JSON.parse(
                    readFileSync(
                        join(ROOT, "node_modules", "@mkbabb", "glass-ui", "package.json"),
                        "utf8",
                    ),
                ).version;
            } catch {
                /* version is cosmetic; the token measurement is the gate */
            }

            if (overshoot <= PEAK_OVERSHOOT_CEILING) {
                ok(
                    `--spring-dock ramp peak = ${peak.toFixed(5)} → +${pct}% ` +
                        `overshoot ≤ +${ceilPct}% (glass-ui@${version} — the dock ` +
                        `settles tight; D5 closes via the consumed token)`,
                );
            } else {
                fail(
                    `--spring-dock ramp peak = ${peak.toFixed(5)} → +${pct}% ` +
                        `overshoot > +${ceilPct}% (glass-ui@${version} — the dock ` +
                        `settle is too bouncy; D5 LAG is live). Bump ` +
                        `@mkbabb/glass-ui to ≥3.5.1 to consume the dock-spring ` +
                        `retune (53c1b07) — do NOT fork the token in kf (inv-16).`,
                );
            }
        }
    }
}

if (failures.length > 0) {
    console.error(
        `\nproof:dock-morph-settled — FAIL (${failures.length}): the consumed ` +
            `--spring-dock overshoot exceeds the +6% settle budget (D5 dock LAG is ` +
            `live). The fix is the glass-ui consume-leg bump (^3.5.1+), not a kf ` +
            `fork (inv-16 / BLK-5).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:dock-morph-settled — PASS: the consumed --spring-dock ramp peak is " +
        "within the +6% settle budget — the dock-resize lag (D5) is closed via the " +
        "published glass-ui retune, consumed not forked.",
);
