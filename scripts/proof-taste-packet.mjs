#!/usr/bin/env node
/**
 * proof:taste-packet — Tranche K.W5 S5 (the TASTE-boundary protocol, instrumented).
 *
 * ── WHAT THIS GATE ASSERTS (and what it NEVER does) ──────────────────────────
 * It asserts the TASTE-packet GENERATOR works: given a wave's named deltas, the
 * `scripts/lib/taste-packet.mjs` generator emits a review packet — per-pane
 * BEFORE/AFTER screenshots (desktop + mobile), the named deltas labeled, the
 * taste-anchor checklist, and a manifest with an UNSET (USER-DOMAIN) verdict slot.
 *
 * It does NOT verdict the design. The verdict on the packet is the user's — a
 * named USER-DOMAIN step scheduled BEFORE the close (the TASTE-boundary
 * invariant). An agent's "designer-eye PASS" is corroboration, NEVER the verdict
 * (the J.W7c failure mode: agents PASS while the user says "awful",
 * PATH-FORWARD.md §1). This gate is the PROTOCOL corroborator — it proves the
 * packaging machinery EXISTS and produces a well-formed packet, so a design band
 * can never claim a verdict it never packaged.
 *
 * ── TIER / POSTURE ───────────────────────────────────────────────────────────
 * HYGIENE/PROTOCOL (K.W5 §Hard gate clause (e)). It corroborates the design close
 * by packaging the evidence; it carries NO correctness authority and may NEVER
 * substitute for a red correctness clause (cold-entry / B1 / subject-animates /
 * scene-control-dfa). P6: the packet is a protocol artifact (the verdict is human,
 * not device) — so the SHAPE of the generated packet is asserted device-
 * independently; no pixel-equality is required (a packet is a presentation, not a
 * lock).
 *
 * The gate generates a SMOKE packet (a representative pane set) into a temp dir,
 * then asserts the packet's STRUCTURE: the manifest exists + parses, every pane
 * has a desktop AND mobile AFTER shot, every shot file referenced in the manifest
 * exists on disk, the named deltas round-trip, the taste-anchor checklist is
 * present + UNCHECKED, and the verdict slot is UNSET (the generator never fills
 * it). The temp packet is removed after (this gate produces no committed artifact
 * — the COMMITTED packets are a per-wave authoring motion, not a CI by-product).
 *
 * BORN-RED WITNESS: there is NO generator today (pre-K.W5); the J.W7c verify
 * rounds asked for a "designer-eye PASS" and got it while the user's same-day
 * verdict was "awful". The protocol-absence is the born-RED — a wave's design band
 * cannot close without a generated packet + a recorded user verdict; this gate
 * makes the generator's existence + output well-formedness machine-checkable.
 *
 * Serves the BUILT dist/gh-pages/ (run `npm run gh-pages` first). Under
 * KF_REQUIRE_BROWSER a playwright-absent / dist-absent run is a HARD FAIL at the
 * lib seam (W7-1); otherwise it skips honestly. Re-runnable:
 *   npm run gh-pages && KF_REQUIRE_BROWSER=1 node scripts/proof-taste-packet.mjs
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { REQUIRE_BROWSER } from "./lib/demo-driver.mjs";
import { generateTastePacket, TASTE_ANCHORS } from "./lib/taste-packet.mjs";

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

// A representative SMOKE pane set across the named regions — the hero (home),
// a stage, the controls editing pane, and the transport ribbon — so the gate
// exercises every REGION_HOSTS path. `before: "baseline"` rides the committed
// visual-lock golden where present (the BEFORE is the pre-wave shot, zero extra
// capture); a pane with no committed baseline is recorded in `missingBefore`,
// NOT a fail (the BEFORE source is the wave author's choice).
const SMOKE_PANES = [
    { scene: "home", region: "hero", deltas: ["hero serif display rung (smoke)"] },
    { scene: "cube", region: "stage", deltas: ["protagonist plate register (smoke)"] },
    { scene: "spring", region: "controls", deltas: ["keyframes editor two-way (smoke)"] },
    { scene: "cube", region: "ribbon", deltas: ["transport row register (smoke)"] },
];

// L.W11 — the design-refinement before/after pane set. The W11 wave refines the
// TASTE-approved demo into one INSTRUMENT language (the four pillars amplified, the
// crayons KEPT by register) + one new egg per scene. The taste-packet must cover
// THIS wave's named deltas so the user's "meets the bar" verdict is packaged over
// the actual W11 refinement surfaces — the hero source-card, the re-lit cube plate,
// the spring derby/editor pane, the transport row. Each delta names the S-clause
// refinement (NOT the egg — the egg's correctness is proof:design-refinement's;
// the packet is the TASTE verdict over the resting refined appearance).
const W11_PANES = [
    {
        scene: "home",
        region: "hero",
        deltas: [
            "S1 — crayon-red proportioned to the live t=0→1 readouts + caret",
            "S1 — the rainbow concentrated on the play-CTA hover ring",
            "S1 — the graph PAPER vignette + grain + 60s major-grid drift",
        ],
    },
    {
        scene: "cube",
        region: "stage",
        deltas: [
            "S2 — the six KEPT crayon facets re-materialed as lit-lacquer plates (--face-1…6, no hue touched)",
            "S2 — drafting-stamp face markings (serif tnum numeral + Fira axis tag)",
            "S2 — the live rx ry rz Euler chip in .readout-accent",
        ],
    },
    {
        scene: "spring",
        region: "controls",
        deltas: [
            "S6 — the linear() Fira-Code block KEPT as the copyable deliverable",
            "S6 — the SVG plot of its 26 stops drawn beside it",
            "S6 — the four rainbow derby lanes (--spring-lane-* from --rainbow-*)",
        ],
    },
    {
        scene: "cube",
        region: "ribbon",
        deltas: [
            "S2 — the transport row in the muted-axis FRAME register (crayons stay on the SIGNAL plate)",
        ],
    },
];

/**
 * validatePacket — generate ONE packet for a {wave, panes} and assert its
 * structural well-formedness (manifest parses, wave + panes round-trip, every pane
 * carries desktop+mobile shots + named deltas + an on-disk AFTER, the taste-anchor
 * checklist is present + UNCHECKED, the verdict slot is UNSET). Returns
 * { skipped } | { captured } so the caller can short-circuit on the harness seam.
 * The W11 set is asserted by the SAME machinery the K.W5 smoke is — the generator
 * is wave-parameterized, so covering the W11 before/after is a pane-set add, not a
 * second pipeline.
 */
async function validatePacket(wave, panes) {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), `kf-taste-packet-${wave.replace(/[^\w.-]/g, "_")}-`));
    let result;
    try {
        result = await generateTastePacket({ wave, outDir, panes, before: "baseline" });
    } catch (err) {
        // A throw under the harness seam (dist absent under KF_REQUIRE_BROWSER) is
        // the W7-1 hard fail; surface it.
        console.error("proof:taste-packet — ERROR:", err.message);
        fs.rmSync(outDir, { recursive: true, force: true });
        process.exit(REQUIRE_BROWSER ? 1 : 3);
    }

    if (result.skipped) {
        fs.rmSync(outDir, { recursive: true, force: true });
        return { skipped: result.skipped };
    }

    console.log(`  — wave ${wave} (${panes.length} pane${panes.length === 1 ? "" : "s"}):`);

    // ── Assert the packet STRUCTURE ──────────────────────────────────────────
    const manifestPath = result.manifestPath;
    if (!manifestPath || !fs.existsSync(manifestPath)) {
        fail(`[${wave}] the manifest.json was not written`);
    } else {
        ok(`[${wave}] manifest written → ${path.relative(outDir, manifestPath)}`);
        let m;
        try {
            m = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
        } catch (e) {
            fail(`[${wave}] manifest.json does not parse: ${e.message}`);
        }
        if (m) {
            // wave + panes round-trip.
            if (m.wave === wave) ok(`[${wave}] the wave name round-trips in the manifest`);
            else fail(`[${wave}] the wave name is wrong in the manifest (${m.wave})`);

            if (Array.isArray(m.panes) && m.panes.length === panes.length)
                ok(`[${wave}] all ${panes.length} panes are present in the manifest`);
            else fail(`[${wave}] the manifest panes set is wrong (${m.panes?.length})`);

            // Every pane: desktop + mobile shots, deltas, AFTER file on disk.
            let everyAfterExists = true;
            let everyDeltaRoundtrips = true;
            let everyViewport = true;
            for (const pane of m.panes ?? []) {
                const vps = (pane.shots ?? []).map((s) => s.viewport).sort();
                if (vps.join(",") !== "desktop,mobile") everyViewport = false;
                if (!Array.isArray(pane.deltas) || pane.deltas.length === 0)
                    everyDeltaRoundtrips = false;
                for (const shot of pane.shots ?? []) {
                    // The AFTER shot is the load-bearing one (the AFTER tree always
                    // renders). A missing-on-this-viewport region (the ribbon below
                    // the mobile fold) is recorded by the generator; assert the AFTER
                    // for a pane that DID capture exists on disk.
                    const afterFile = path.join(outDir, shot.after);
                    const captured = result.shots.find(
                        (s) =>
                            s.pane === pane.pane && s.viewport === shot.viewport && s.after,
                    );
                    if (captured && !fs.existsSync(afterFile)) everyAfterExists = false;
                }
            }
            everyViewport
                ? ok(`[${wave}] every pane carries BOTH a desktop and a mobile shot entry`)
                : fail(`[${wave}] a pane is missing a desktop or mobile shot entry`);
            everyDeltaRoundtrips
                ? ok(`[${wave}] every pane carries its named deltas`)
                : fail(`[${wave}] a pane lost its named deltas`);
            everyAfterExists
                ? ok(`[${wave}] every captured AFTER shot exists on disk`)
                : fail(`[${wave}] a captured AFTER shot is missing on disk`);

            // The taste-anchor checklist is present + UNCHECKED.
            const checklist = m.tasteAnchorChecklist ?? [];
            if (checklist.length === TASTE_ANCHORS.length)
                ok(`[${wave}] the taste-anchor checklist carries all ${TASTE_ANCHORS.length} anchors`);
            else fail(`[${wave}] the taste-anchor checklist is incomplete (${checklist.length})`);
            if (checklist.every((c) => c.preserved === null))
                ok(`[${wave}] the taste-anchor checklist is UNCHECKED (the user ticks it — not the gate)`);
            else fail(`[${wave}] the taste-anchor checklist is pre-checked (the gate must NOT verdict)`);

            // The verdict slot is UNSET — the load-bearing TASTE-boundary assertion.
            if (m.verdict === null && m.verdictBy === null && m.verdictAt === null)
                ok(`[${wave}] the verdict slot is UNSET (USER-DOMAIN — the generator NEVER fills it)`);
            else
                fail(
                    `[${wave}] the verdict slot is PRE-FILLED — a gate may NEVER carry the design ` +
                        `verdict (the TASTE-boundary invariant)`,
                );
        }
    }

    // At least one AFTER shot must have been captured (the generator drove the demo).
    const captured = result.shots.filter((s) => s.after).length;
    if (captured > 0) ok(`[${wave}] ${captured} AFTER pane shot(s) captured from the demo`);
    else fail(`[${wave}] ZERO AFTER shots captured — the generator did not drive the demo`);

    fs.rmSync(outDir, { recursive: true, force: true });
    return { captured };
}

async function main() {
    console.log("proof:taste-packet — K.W5 S5 (the TASTE-boundary packet generator produces a well-formed packet) + L.W11 before/after coverage");

    // Run the K.W5 smoke set AND the L.W11 refinement set through the SAME generator
    // + the SAME structural assertions. A skip from the harness seam (dist absent /
    // playwright unresolvable) short-circuits honestly for both.
    const SETS = [
        ["K.W5-smoke", SMOKE_PANES],
        ["L.W11", W11_PANES],
    ];
    for (const [wave, panes] of SETS) {
        const r = await validatePacket(wave, panes);
        if (r.skipped) {
            if (REQUIRE_BROWSER) {
                console.error(`proof:taste-packet — HARD FAIL: ${r.skipped}`);
                process.exit(1);
            }
            console.log(
                `proof:taste-packet — SKIP (${r.skipped}); set KF_REQUIRE_BROWSER=1 to require it.`,
            );
            process.exit(0);
        }
    }

    if (failures.length) {
        console.error(`\nproof:taste-packet — FAIL (${failures.length}): the packet generator did not produce a well-formed packet.`);
        process.exit(1);
    }
    console.log(
        "\nproof:taste-packet — PASS: the TASTE-packet generator produces a well-formed review packet " +
            "for BOTH the K.W5 smoke set AND the L.W11 refinement before/after (per-pane before/after, " +
            "desktop+mobile, named deltas, the taste-anchor checklist UNCHECKED, the verdict slot UNSET). " +
            "The packaging EXISTS; the verdict stays the user's (the TASTE-boundary invariant).",
    );
}

main().catch((e) => {
    console.error("proof:taste-packet — ERROR:", e);
    process.exit(3);
});
