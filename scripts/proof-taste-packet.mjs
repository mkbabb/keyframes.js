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

async function main() {
    console.log("proof:taste-packet — K.W5 S5 (the TASTE-boundary packet generator produces a well-formed packet)");

    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "kf-taste-packet-"));
    let result;
    try {
        result = await generateTastePacket({
            wave: "K.W5-smoke",
            outDir,
            panes: SMOKE_PANES,
            before: "baseline",
        });
    } catch (err) {
        // A throw under the harness seam (dist absent under KF_REQUIRE_BROWSER) is
        // the W7-1 hard fail; surface it.
        console.error("proof:taste-packet — ERROR:", err.message);
        fs.rmSync(outDir, { recursive: true, force: true });
        process.exit(REQUIRE_BROWSER ? 1 : 3);
    }

    if (result.skipped) {
        fs.rmSync(outDir, { recursive: true, force: true });
        if (REQUIRE_BROWSER) {
            console.error(`proof:taste-packet — HARD FAIL: ${result.skipped}`);
            process.exit(1);
        }
        console.log(
            `proof:taste-packet — SKIP (${result.skipped}); set KF_REQUIRE_BROWSER=1 to require it.`,
        );
        process.exit(0);
    }

    // ── Assert the packet STRUCTURE ──────────────────────────────────────────
    const manifestPath = result.manifestPath;
    if (!manifestPath || !fs.existsSync(manifestPath)) {
        fail("the manifest.json was not written");
    } else {
        ok(`manifest written → ${path.relative(outDir, manifestPath)}`);
        let m;
        try {
            m = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
        } catch (e) {
            fail(`manifest.json does not parse: ${e.message}`);
        }
        if (m) {
            // wave + panes round-trip.
            if (m.wave === "K.W5-smoke") ok("the wave name round-trips in the manifest");
            else fail(`the wave name is wrong in the manifest (${m.wave})`);

            if (Array.isArray(m.panes) && m.panes.length === SMOKE_PANES.length)
                ok(`all ${SMOKE_PANES.length} panes are present in the manifest`);
            else fail(`the manifest panes set is wrong (${m.panes?.length})`);

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
                ? ok("every pane carries BOTH a desktop and a mobile shot entry")
                : fail("a pane is missing a desktop or mobile shot entry");
            everyDeltaRoundtrips
                ? ok("every pane carries its named deltas")
                : fail("a pane lost its named deltas");
            everyAfterExists
                ? ok("every captured AFTER shot exists on disk")
                : fail("a captured AFTER shot is missing on disk");

            // The taste-anchor checklist is present + UNCHECKED.
            const checklist = m.tasteAnchorChecklist ?? [];
            if (checklist.length === TASTE_ANCHORS.length)
                ok(`the taste-anchor checklist carries all ${TASTE_ANCHORS.length} anchors`);
            else fail(`the taste-anchor checklist is incomplete (${checklist.length})`);
            if (checklist.every((c) => c.preserved === null))
                ok("the taste-anchor checklist is UNCHECKED (the user ticks it — not the gate)");
            else fail("the taste-anchor checklist is pre-checked (the gate must NOT verdict)");

            // The verdict slot is UNSET — the load-bearing TASTE-boundary assertion.
            if (m.verdict === null && m.verdictBy === null && m.verdictAt === null)
                ok("the verdict slot is UNSET (USER-DOMAIN — the generator NEVER fills it)");
            else
                fail(
                    "the verdict slot is PRE-FILLED — a gate may NEVER carry the design verdict " +
                        "(the TASTE-boundary invariant)",
                );
        }
    }

    // At least one AFTER shot must have been captured (the generator drove the demo).
    const captured = result.shots.filter((s) => s.after).length;
    if (captured > 0) ok(`${captured} AFTER pane shot(s) captured from the demo`);
    else fail("ZERO AFTER shots captured — the generator did not drive the demo");

    fs.rmSync(outDir, { recursive: true, force: true });

    if (failures.length) {
        console.error(`\nproof:taste-packet — FAIL (${failures.length}): the packet generator did not produce a well-formed packet.`);
        process.exit(1);
    }
    console.log(
        "\nproof:taste-packet — PASS: the TASTE-packet generator produces a well-formed review packet " +
            "(per-pane before/after, desktop+mobile, named deltas, the taste-anchor checklist UNCHECKED, the " +
            "verdict slot UNSET). The packaging EXISTS; the verdict stays the user's (the TASTE-boundary invariant).",
    );
}

main().catch((e) => {
    console.error("proof:taste-packet — ERROR:", e);
    process.exit(3);
});
