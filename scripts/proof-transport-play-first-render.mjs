#!/usr/bin/env node
/**
 * proof:transport-play-first-render — T.B10 RENDER clause. DISCHARGED at T.C1.
 *
 * VERDICT #6's second clause ("the play button should be the FIRST element"). The
 * MODEL half (`proof:transport-action-order`) is GREEN — `useSceneTransport`
 * exposes an ordered `{ primary: { kind:"play" }, secondary:[reset, clear] }`. This
 * is the RENDER half: the dock must draw play FIRST (from `actions.primary`), never
 * markup-last.
 *
 * DISCHARGED (T.C1 rail-core rebuild). `TransportDock.vue` now renders, in template
 * order: **PLAY (rail-core, first)** → the animation `<Select>` (contextual section)
 * → Reset (nav). "Clear all & reload" LEFT the transport for the @mbabb settings
 * menu (T.C2), so the former Reset/Clear-before-Play ordering is gone. This gate
 * flipped from BORN-RED to a standing GREEN assertion: the primary Play control is
 * emitted BEFORE the animation select AND before Reset. It moved OUT of
 * T_BORNRED_BACKLOG and joins the blocking hygiene roster in the SAME commit as the
 * render (the discharge = the cure, drive clause 7).
 *
 * One source of order truth: this gate + `proof:transport-action-order` (the model)
 * + `proof:dock-grammar`'s "play first" clause must agree.
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
        "demo/components/instrument/transport/TransportDock.vue",
    );

const failures = [];
const passes = [];

console.log(
    "proof:transport-play-first-render — T.B10 RENDER clause (play drawn first from actions.primary)\n",
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

    // The primary play control: a "Play animation" aria-label NOT followed by
    // "(collapsed dock)" — the COLLAPSED-dock mirror carries the DISTINCT name so
    // we anchor on the primary expanded transport (the element VERDICT #6 orders).
    const playIdx = (() => {
        const re =
            /aria-label\s*=\s*["'][^"']*Play animation(?! \(collapsed dock\))[^"']*["']|['"]Play animation['"]/g;
        let m;
        while ((m = re.exec(markup)) !== null) {
            const tail = markup.slice(m.index, m.index + m[0].length + 24);
            if (!/collapsed dock/.test(tail)) return m.index;
        }
        // Fallback: the primary play handler (the expanded button uses a NON-.stop
        // @pointerdown; the collapsed mirror uses @pointerdown.stop).
        return markup.search(/@pointerdown\s*=\s*["']onPlayPointerDown/);
    })();

    // The animation select (the contextual section) + Reset (the nav utility). The
    // Clear control is GONE (relocated to the @mbabb menu, T.C2), so it is no
    // longer an order anchor. A missing SELECT is legitimate on a single-channel
    // scene's SOURCE only if the whole select markup were removed — it is not (it
    // renders under the channelZone guard), so both markers resolve statically.
    const selectIdx = markup.indexOf('aria-label="Select animation"');
    const resetIdx = markup.indexOf('aria-label="Reset animation"');

    if (playIdx === -1) {
        failures.push(
            "anchors — could not locate the primary Play control in TransportDock.vue " +
                "(no non-collapsed 'Play animation' aria-label, no onPlayPointerDown handler). " +
                "The play-first order cannot be verified — the rail-core Play must be locatable.",
        );
    } else {
        // Play must precede EVERY other transport control it can be ordered against.
        const others = [];
        if (selectIdx !== -1) others.push(["animation select", selectIdx]);
        if (resetIdx !== -1) others.push(["Reset", resetIdx]);
        if (others.length === 0) {
            failures.push(
                "anchors — located Play but neither the animation select " +
                    '(aria-label="Select animation") nor Reset (aria-label="Reset animation") — ' +
                    "the T.C1 recut markers are gone; re-ground the order gate.",
            );
        } else {
            const after = others.filter(([, idx]) => idx < playIdx);
            if (after.length === 0) {
                passes.push(
                    "play-first — the primary Play control is emitted BEFORE " +
                        others.map(([n]) => n).join(" and ") +
                        " in template order (VERDICT #6: play is the first interactive transport element).",
                );
            } else {
                failures.push(
                    "play-first — the primary Play control is emitted AFTER " +
                        after.map(([n, idx]) => `${n}@${idx}`).join(", ") +
                        ` (play@${playIdx}). VERDICT #6: the play button must be FIRST (rail-core, from actions.primary).`,
                );
            }
        }
    }
}

for (const p of passes) console.log("  ✓ " + p);
if (failures.length > 0) {
    console.error(
        `\nproof:transport-play-first-render — FAIL (${failures.length}):`,
    );
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}
console.log(
    "\nproof:transport-play-first-render — PASS: the dock renders play first (from actions.primary).",
);
process.exit(0);
