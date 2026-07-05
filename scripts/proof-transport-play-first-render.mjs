#!/usr/bin/env node
/**
 * proof:transport-play-first-render — T.B10 RENDER clause. BORN-RED (backlog).
 *
 * VERDICT #6's second clause ("the play button should be the FIRST element"). The
 * MODEL half (`proof:transport-action-order`) is GREEN — `useSceneTransport` now
 * exposes an ordered `{ primary: { kind:"play" }, secondary:[reset, clear] }`. This
 * is the RENDER half: the dock must draw play FROM `actions.primary` FIRST, never a
 * hardcoded markup-last template position.
 *
 * BORN-RED TODAY BY MEASUREMENT (source order, device-independent). The current
 * `TransportDock.vue` EXPANDED menubar transport renders, in template order:
 * Select animation → Reset (`title="Reset animation"`) → Clear
 * (`title="Clear all & reload"`) → **Play LAST** (the primary transport button,
 * `aria-label` "Play animation" / "Pause animation"). Play is emitted AFTER Reset
 * and Clear → this gate reds. It is NOT a blocking &&-chain member (EXCLUDED +
 * T_BORNRED_BACKLOG); it flips GREEN when T.C1's rail-core rebuild renders play
 * first from `actions.primary`.
 *
 * dischargedBy: T.C1 (the play-first rail-core dock rebuild — renders `primary`
 * first from the T.B10 model). One source of order truth: this gate + the
 * `proof:dock-grammar` "first interactive element is play" clause must agree.
 *
 * Overrides (plant-test): KF_TRANSPORT_DOCK.
 *   node scripts/proof-transport-play-first-render.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOCK =
    process.env.KF_TRANSPORT_DOCK ||
    join(
        root,
        "demo/@/components/custom/animation-transport/TransportDock.vue",
    );

const failures = [];
const passes = [];

console.log(
    "proof:transport-play-first-render — T.B10 RENDER clause (play drawn first from actions.primary) [BORN-RED]\n",
);

let src = "";
try {
    src = readFileSync(DOCK, "utf8");
} catch (e) {
    failures.push(`dock-present — cannot read ${DOCK}: ${e.message}.`);
}

if (src) {
    // Blank HTML comments so explanatory prose (which names "play", "Reset",
    // etc.) never counts as real markup — only emitted controls do.
    const markup = src.replace(/<!--[\s\S]*?-->/g, (m) =>
        m.replace(/[^\n]/g, " "),
    );

    // The template-order positions of the three controls (the FIRST real emission
    // of each). The primary play control is the menubar transport button whose
    // aria-label resolves to "Play animation" (the COLLAPSED-dock mirror carries
    // the DISTINCT "Play animation (collapsed dock)" name — excluded so we anchor
    // on the primary expanded transport, the element VERDICT #6 orders).
    const resetIdx = markup.indexOf('title="Reset animation"');
    const clearIdx = markup.indexOf('title="Clear all & reload"');
    // Primary play: a "Play animation" aria-label NOT followed by "(collapsed dock)".
    const playIdx = (() => {
        const re = /aria-label\s*=\s*["'][^"']*Play animation(?! \(collapsed dock\))[^"']*["']|['"]Play animation['"]/g;
        // Prefer a ternary form `isPlaying ? 'Pause animation' : 'Play animation'`
        // (the primary transport) — match the FIRST 'Play animation' literal that
        // is not the collapsed-dock name.
        let m;
        while ((m = re.exec(markup)) !== null) {
            const tail = markup.slice(m.index, m.index + m[0].length + 24);
            if (!/collapsed dock/.test(tail)) return m.index;
        }
        // Fallback: the primary play handler binding (expanded uses a NON-.stop
        // @pointerdown; the collapsed mirror uses @pointerdown.stop).
        const h = markup.search(/@pointerdown\s*=\s*["']onPlayPointerDown/);
        return h;
    })();

    const found = [];
    if (resetIdx === -1) found.push("Reset (title=\"Reset animation\")");
    if (clearIdx === -1) found.push('Clear (title="Clear all & reload")');
    if (playIdx === -1) found.push("primary Play control");
    if (found.length > 0) {
        // A rebuild that renamed/removed these markers: report honestly (the gate
        // cannot verdict order without them). This is a real red — the anchors the
        // order contract keys on are gone; T.C1's rebuild re-establishes them.
        failures.push(
            "anchors — could not locate the play/reset/clear control markers in TransportDock.vue: " +
                found.join(", ") +
                ". The play-first order cannot be verified — T.C1's rail-core rebuild must render " +
                "play first from actions.primary with a locatable primary Play control.",
        );
    } else {
        const playFirst = playIdx < resetIdx && playIdx < clearIdx;
        if (playFirst) {
            passes.push(
                "play-first — the primary Play control is emitted BEFORE Reset and Clear in template " +
                    "order (VERDICT #6: play is the first interactive transport element).",
            );
        } else {
            failures.push(
                "play-first — the primary Play control is emitted AFTER Reset/Clear in TransportDock.vue " +
                    `template order (play@${playIdx} > reset@${resetIdx}, clear@${clearIdx}). VERDICT #6: ` +
                    "the play button must be FIRST. RED TODAY — the dock renders play markup-last; discharged " +
                    "when T.C1's rail-core rebuild draws play first from actions.primary (the T.B10 model).",
            );
        }
    }
}

for (const p of passes) console.log("  ✓ " + p);
if (failures.length > 0) {
    console.error(
        `\nproof:transport-play-first-render — FAIL (${failures.length}) [BORN-RED backlog — T_BORNRED_BACKLOG; dischargedBy T.C1]:`,
    );
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}
console.log(
    "\nproof:transport-play-first-render — PASS: the dock renders play first (from actions.primary).",
);
process.exit(0);
