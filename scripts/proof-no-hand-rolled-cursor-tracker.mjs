#!/usr/bin/env node
/**
 * proof:no-hand-rolled-cursor-tracker — T.D14 (lane 12 T-CL-3). **INSTRUMENT
 * authority (T.M6); a REGRESSION GUARD** (gate-bands.mjs REGRESSION_GUARDS —
 * the absence/excision band).
 *
 * THE RECURRENCE IS THE DEFECT. The hand-rolled cursor-follow wash was authored
 * TWICE by independent hands — H.W9's `.cartoon-specular` (killed; the lesson
 * recorded verbatim in design-idioms.css) and ComposeTarget's
 * `.foundry-keylight` (`--mouse-x`/`--mouse-y` + a read-after-write pointermove
 * that forced a whole-document layout per event, measured 1097–1671 µs/call —
 * killed with the compose prune, T.E1). Nothing structural stopped a THIRD.
 * This gate does: any demo file that BOTH (a) attaches a bare
 * `pointermove`/`mousemove` handler AND (b) writes a positional `--*-x`/`--*-y`
 * custom property (setProperty / v-bind style / @property registration) REDs —
 * unless the file routes through glass-ui's PUBLIC cursor surface (`setCursor`
 * / `useCursorInteraction` / `injectCursorVelocity` imported from
 * @mkbabb/glass-ui) — the sanctioned door (aurora / goo-blob / constellation).
 *
 * GREEN today by construction: the compose wash died with the T.E1 prune and
 * the T.D13 HeroAurora rides the sanctioned `setCursor` door with zero
 * positional custom-property writes. The gate guards the FUTURE — it is NOT
 * compose-coupled (T.D14 lockstep note).
 *
 * Plant-test: KF_TRACKER_SCAN_DIR=<dir> scans an alternate root — a planted
 * offender (pointermove + setProperty("--glow-x", …)) must RED.
 *
 * Re-runnable: `node scripts/proof-no-hand-rolled-cursor-tracker.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCAN_DIR = process.env.KF_TRACKER_SCAN_DIR || path.join(REPO, "demo");

const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const fail = (l) => {
    failures.push(l);
    console.error(`  ✗ ${l}`);
};

console.log(
    "proof:no-hand-rolled-cursor-tracker — T.D14 (the standing recurrence guard: no third " +
        "hand-rolled --*-x/--*-y pointer tracker; glass-ui's public cursor surface is the one door)",
);

// A bare pointer-follow listener (JS attach or Vue template handler).
const POINTER_LISTENER =
    /addEventListener\(\s*["'](pointermove|mousemove)["']|@(pointermove|mousemove)(?:\.[a-z]+)*\s*=/;
// A positional custom-property WRITE: setProperty("--…x"/"--…y", …), an
// @property registration for a --*-x/--*-y pair, or a reactive style bind of
// one ('--glow-x': …). The trailing [xy] must END the token (never matches
// --mask-x-padding etc. by requiring the quote/colon right after).
const POSITIONAL_WRITE =
    /setProperty\(\s*["']--[\w-]*-?[xy]["']|@property\s+--[\w-]*-?[xy]\b|["']--[\w-]*-[xy]["']\s*:/;
// The sanctioned glass-ui door — the public cursor-reactive surface.
const SANCTIONED =
    /import\s*\{[^}]*\b(setCursor|useCursorInteraction|Aurora|GooBlob|Constellation)\b[^}]*\}\s*from\s*["']@mkbabb\/glass-ui/;

const offenders = [];
const scanned = [];
const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === "node_modules" || entry.name === "dist") continue;
            walk(p);
        } else if (/\.(vue|ts|css)$/.test(entry.name)) {
            const src = fs.readFileSync(p, "utf8");
            // Strip comments so a recorded LESSON (design-idioms.css narrates the
            // killed specular verbatim) never false-fires the guard.
            const live = src
                .replace(/<!--[\s\S]*?-->/g, "")
                .replace(/\/\*[\s\S]*?\*\//g, "")
                .replace(/(^|[^:])\/\/[^\n]*/g, "$1");
            const listens = POINTER_LISTENER.test(live);
            const writes = POSITIONAL_WRITE.test(live);
            if (listens || writes) scanned.push(path.relative(REPO, p));
            if (listens && writes && !SANCTIONED.test(src)) {
                offenders.push(path.relative(REPO, p));
            }
        }
    }
};
walk(SCAN_DIR);

if (offenders.length === 0) {
    ok(
        `zero hand-rolled cursor trackers under ${path.relative(REPO, SCAN_DIR) || SCAN_DIR} ` +
            `(${scanned.length} pointer-touching file(s) scanned; a bare pointermove + a --*-x/--*-y ` +
            "write in one file is the RED; glass-ui's setCursor/useCursorInteraction door is sanctioned)",
    );
} else {
    for (const f of offenders) {
        fail(
            `${f} — a bare pointermove/mousemove handler AND a positional --*-x/--*-y custom-property ` +
                "write in one unit: the THIRD hand-rolled cursor tracker this gate exists to prevent " +
                "(H.W9 .cartoon-specular → ComposeTarget .foundry-keylight → THIS). Route it through " +
                "glass-ui's public cursor surface (@mkbabb/glass-ui/aurora setCursor / " +
                "useCursorInteraction) or record a reviewed exception.",
        );
    }
}

if (failures.length > 0) {
    console.error(
        `\nproof:no-hand-rolled-cursor-tracker — FAIL (${failures.length}): the hand-rolled ` +
            "pointer-tracker pattern recurred (lane 12 T-CL-3).",
    );
    process.exit(1);
}
console.log(
    "\nproof:no-hand-rolled-cursor-tracker — PASS: no demo unit pairs a bare pointer listener with " +
        "a positional custom-property write; cursor-reactive light rides glass-ui's public surface only.",
);
