#!/usr/bin/env node
/**
 * proof:gate-is-runtime — Tranche I.W7 S6. THE META-GATE THAT MAKES THE
 * GATE-ORACLE PRECEPT MECHANICALLY PRIOR (the structural answer to RED-1).
 *
 * THE PRECEPT (I charter invariant, S1):
 *   > A gate's ORACLE must be the PRODUCT PROPERTY a human would check, exercised
 *   > through the SAME surface the human uses, with an ERROR BUDGET OF ZERO across
 *   > the human's interaction battery (PLAY + SWITCH + DRAG). A gate whose oracle
 *   > is source text, a jsdom unit, a serialized snapshot, a self-captured
 *   > baseline, a design-token number, or a paperwork ledger is a HYGIENE gate,
 *   > not a CORRECTNESS gate, and MUST be LABELED as such.
 *
 * THIS GATE IS THE MACHINE THAT ENFORCES IT. For EVERY member of the
 * `proof:correctness` tier — the roster is DERIVED from the chain's membership
 * (J.W3 S4 / T4 / GC-3), never a hardcoded list, so a new correctness gate can
 * never escape the precept-enforcer — it asserts the gate's SCRIPT:
 *   (a) opens a browser over the proven serveDist + KF_PLAYWRIGHT_DIR chromium +
 *       newContext harness (it is NOT a jsdom unit, NOT a bare source grep), AND
 *   (b) ACTUATES the running product — it references the actuating harness
 *       primitives (page.click / page.dispatchEvent / page.mouse / page.keyboard /
 *       page.dragAndDrop / a trusted PointerEvent dispatch), NOT goto+rest, NOT a
 *       localStorage round-trip, NOT a source grep, AND
 *   (c) is wired into the CORRECTNESS TIER of proof:all (proof:correctness).
 * A wave whose §Hard gate is a source-shape / load-rest / proxy-store / self-
 * baseline oracle FAILS the meta-gate.
 *
 * WHY THIS CLOSES RED-1 STRUCTURALLY. The harden review's RED-1 is that the
 * precept's authority was ASSERTED ("each prior wave already obeys it") rather
 * than mechanically prior. This gate runs on the broken tree alongside every
 * other, so a wave authored or run BEFORE the overhaul cannot ship a source-shape
 * §Hard gate without the meta-gate reding. The precept is MECHANICALLY prior (a
 * gate enforces it from t=0), not authorially prior.
 *
 * BORN-RED on `b934a08` — H's regime has ≈0 genuinely-behavioral §Hard gates
 * (rc-gate-blindspot §1 census: GENUINELY BEHAVIORAL ≈ 0); every H "interaction-
 * axis" gate is load-rest / wrong-projection / proxy-store, and none of the I
 * runtime gate scripts exist on H's tip — so the meta-gate finds no qualifying
 * correctness gate and FAILS. GREEN now: each I wave's §Hard gate is an actuating
 * runtime gate wired to the correctness tier.
 *
 * HYGIENE-vs-CORRECTNESS POSTURE OF THE META-GATE ITSELF (H-4). This gate reads
 * gate SCRIPTS (the source shape of the harness), so it is itself a HYGIENE-tier
 * gate by the taxonomy — it does NOT carry product-correctness authority (it
 * cannot see B1–B9; only proof:live-session can). Its job is STRUCTURAL
 * enforcement of the precept, exactly as eslint is hygiene-tier. It runs in the
 * HYGIENE tier of proof:all. Complements proof:chronic-closure (S4), which polices
 * the chronic ROWS' cited gates; this gate polices the GATES' SHAPE.
 *
 * NO browser, no build — a pure static read of the gate scripts + package.json.
 * Re-runnable: `node scripts/proof-gate-is-runtime.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
    ACTUATION_PRIMITIVES,
    STRONG_ACTUATION,
    missingHarnessAnchors,
} from "./lib/gate-shape.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCRIPTS_DIR = path.join(REPO, "scripts");
const PKG = path.join(REPO, "package.json");

const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const note = (l) => console.log(`  · ${l}`);
const fail = (l) => {
    failures.push(l);
    console.error(`  ✗ ${l}`);
};

console.log(
    "proof:gate-is-runtime — I.W7 S6 (the meta-gate: every wave's §Hard correctness gate is an " +
        "ACTUATING runtime gate wired to the correctness tier · the gate-ORACLE precept, machine-enforced)",
);

const pkg = JSON.parse(fs.readFileSync(PKG, "utf8"));
const SCRIPTS = pkg.scripts ?? {};
const PROOF_ALL = SCRIPTS["proof:all"] ?? "";
const PROOF_CORRECTNESS = SCRIPTS["proof:correctness"] ?? "";

// ── The audited roster is DERIVED from proof:correctness MEMBERSHIP (J.W3 S4,
// T4 / GC-3). The pre-J.W3 form hardcoded a 9-gate literal — and the actual
// correctness tier had 10: `proof:demo-fonts` escaped the precept-enforcer, the
// exact "a correctness gate can be added without the meta-gate noticing" hole
// that undermined the meta-gate's own "mechanically prior, not authorially
// prior" thesis. The roster is now the PARSED proof:correctness chain: every
// member is audited, NO hand-edited exemption exists, and a NEW correctness
// gate can never escape the precept again (T4). WAVE_ANNOTATION is provenance
// METADATA only (which wave declared the gate) — it does not and cannot gate
// membership.
const WAVE_ANNOTATION = {
    "proof:engine-no-throw-on-play": "I.W0",
    "proof:fsm-suspend-resume-live": "I.W1",
    "proof:easing-editor-live": "I.W2",
    "proof:amiga-subject-is-pivot": "I.W3",
    "proof:drag-gesture": "I.W4",
    "proof:perf-frame-budget": "I.W4",
    "proof:icon-paint-live": "I.W5",
    "proof:specular-absent-at-rest": "I.W6",
    "proof:demo-fonts": "I.W6-font (tiered at J.W3 S5 — the SWITCH actuation leg)",
    "proof:live-session": "I.W7",
};
const WAVE_HARD_GATES = [
    ...new Set(
        [...(SCRIPTS["proof:correctness"] ?? "").matchAll(/proof:[a-z0-9-]+/g)].map(
            (m) => m[0],
        ),
    ),
]
    .filter((g) => g !== "proof:correctness")
    .map((gate) => ({ wave: WAVE_ANNOTATION[gate] ?? "correctness-tier", gate }));

// ── The detection primitives (the same set the spec names — S6) ───────────────
// Routed through the ONE lib-aware authority (scripts/lib/gate-shape.mjs),
// SHARED with proof:chronic-closure — the J.W3 fix-round consolidation. The
// pre-fix form inlined its own copy here while chronic-closure inlined a stale
// twin; the drift between the two detectors is exactly the duplication class
// the wave existed to kill. The rule (unchanged): a gate satisfies the harness
// signature by IMPORTING withPage/withBrowser from scripts/lib/demo-driver.mjs
// (the lib IS the serveDist + KF_PLAYWRIGHT_DIR resolveChromium + newContext
// trio, single-sourced per gate-census GC-1) OR by carrying all three inline
// anchors (the not-yet-migrated form, kept valid). The actuation primitives —
// navToScene SWITCH (J.W3 S5) / click / dispatch / drag / key / PointerEvent /
// hover — and the STRONG-vs-rest-appearance split (B7) are the same table; a
// gate whose ONLY actuation is a pointer move/hover is recorded as the
// rest-appearance class and named, so the distinction is honest, not hidden.

// A gate "RUNS in <chain>" iff that chain invokes `npm run <gate>`.
const inChain = (chain, gate) =>
    new RegExp(`\\brun ${gate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(chain);

// The HYGIENE-tier scripts a correctness gate must NOT be (the negative half of
// the taxonomy): a gate that is wired into proof:hygiene but claimed as §Hard
// correctness would be the original sin. We assert each §Hard gate is in the
// CORRECTNESS tier and NOT in the hygiene tier.
const PROOF_HYGIENE = SCRIPTS["proof:hygiene"] ?? "";

function scriptPathFor(gateValue) {
    // gateValue is the package.json script body, e.g. "node scripts/proof-x.mjs".
    const m = gateValue.match(/scripts\/(proof-[a-z0-9-]+\.mjs)/i);
    return m ? path.join(SCRIPTS_DIR, m[1]) : null;
}

// ── Audit each wave's §Hard gate ──────────────────────────────────────────────
for (const { wave, gate } of WAVE_HARD_GATES) {
    const body = SCRIPTS[gate];

    // (resolve) the gate must be an authored package.json key.
    if (!body) {
        fail(
            `[${wave}] §Hard gate \`${gate}\` does NOT resolve to a package.json script key — ` +
                `the wave declares no runtime correctness gate (or it was renamed/dropped).`,
        );
        continue;
    }

    // (c) the gate must be wired into the CORRECTNESS TIER of proof:all. We accept
    // either a `proof:correctness` sub-aggregator membership OR a direct proof:all
    // membership when proof:correctness is the chain proof:all runs (single source).
    const inCorrectness = inChain(PROOF_CORRECTNESS, gate) || (PROOF_CORRECTNESS === "" && inChain(PROOF_ALL, gate));
    const inHygiene = inChain(PROOF_HYGIENE, gate);
    if (!inCorrectness) {
        fail(
            `[${wave}] §Hard gate \`${gate}\` is NOT wired into the CORRECTNESS tier (proof:correctness) — ` +
                `a correctness gate must run in the correctness tally, not be orphaned or hygiene-only.`,
        );
    }
    if (inHygiene) {
        fail(
            `[${wave}] §Hard gate \`${gate}\` is wired into the HYGIENE tier (proof:hygiene) — a §Hard ` +
                `correctness gate may NOT be demoted to hygiene; the runtime clause carries the wave's green.`,
        );
    }

    // (a)+(b) read the SCRIPT and assert the harness + actuation shape.
    const sp = scriptPathFor(body);
    if (!sp || !fs.existsSync(sp)) {
        fail(
            `[${wave}] §Hard gate \`${gate}\` resolves but its script (${body}) is not a readable ` +
                `scripts/proof-*.mjs file — the meta-gate cannot verify it actuates.`,
        );
        continue;
    }
    const src = fs.readFileSync(sp, "utf8");

    // (a) the browser-harness signature — the lib lifecycle import (the J.W3
    //     single-sourced trio) OR all three inline anchors must be present
    //     (lib-aware via the shared gate-shape authority).
    const missingHarness = missingHarnessAnchors(src);
    // (b) the actuation primitives present.
    const actsPresent = ACTUATION_PRIMITIVES.filter((p) => p.re.test(src)).map((p) => p.name);
    const strongPresent = STRONG_ACTUATION.filter((p) => p.re.test(src)).map((p) => p.name);

    const rel = path.relative(REPO, sp).split(path.sep).join("/");

    if (missingHarness.length > 0) {
        fail(
            `[${wave}] \`${gate}\` (${rel}) is NOT a browser runtime gate — missing harness anchor(s): ` +
                `${missingHarness.join(", ")}. A §Hard correctness gate must open a real browser over the ` +
                `built dist (serveDist + KF_PLAYWRIGHT_DIR + newContext, inline OR via the lib lifecycle ` +
                `import { withPage } from "./lib/demo-driver.mjs"), not be a jsdom unit / source grep.`,
        );
        continue;
    }

    if (actsPresent.length === 0) {
        fail(
            `[${wave}] \`${gate}\` (${rel}) opens a browser but does NOT ACTUATE — it references NONE of ` +
                `{page.click, dispatchEvent, page.mouse, page.keyboard, page.dragAndDrop, PointerEvent, ` +
                `.hover}. A goto+rest load-rest oracle is forbidden (the proof:demo-console-clean sin).`,
        );
        continue;
    }

    if (strongPresent.length === 0) {
        // The ONLY actuation is a pointer move/hover — the at-rest appearance class
        // (B7 specular: the product property IS measured at rest). RECORDED, not
        // failed: its oracle is the rendered pixel of the running product, reached
        // by moving the pointer to a neutral rest — the precept's "product property
        // a human would check". Named so the distinction is honest.
        ok(
            `[${wave}] \`${gate}\` — RUNTIME (rest-appearance class): opens the browser harness + actuates ` +
                `via [${actsPresent.join(", ")}] (pointer move/hover to a neutral rest); its CORRECTNESS oracle ` +
                `is the RENDERED pixel property at rest (the running product a human would check). Wired to the ` +
                `correctness tier. [The product property is measured at rest BY DESIGN — B7 bloom-absent.]`,
        );
    } else {
        ok(
            `[${wave}] \`${gate}\` — RUNTIME/INTERACTION: opens the browser harness + DRIVES the product via ` +
                `[${strongPresent.join(", ")}]${actsPresent.length > strongPresent.length ? ` (+ ${actsPresent.filter((a) => !strongPresent.includes(a)).join(", ")})` : ""}; ` +
                `wired to the correctness tier. The wave's green hangs on this actuating clause (S1 / H-4).`,
        );
    }
}

// ── Non-vacuity floor: the roster must be non-empty + cover every I wave ───────
{
    if (WAVE_HARD_GATES.length === 0) {
        fail(
            `[coverage] the derived roster is EMPTY — proof:correctness resolves no members. The ` +
                `meta-gate must never pass vacuously (the born-RED b934a08 condition).`,
        );
    }
    const waveRoots = new Set(WAVE_HARD_GATES.map((g) => (g.wave.match(/^I\.W\d+/) ?? [g.wave])[0]));
    const EXPECTED_WAVES = ["I.W0", "I.W1", "I.W2", "I.W3", "I.W4", "I.W5", "I.W6", "I.W7"];
    const missingWaves = EXPECTED_WAVES.filter((w) => !waveRoots.has(w));
    if (missingWaves.length > 0) {
        fail(
            `[coverage] the §Hard-gate roster is MISSING a wave: ${missingWaves.join(", ")} — every I wave ` +
                `(I.W0–I.W7) must declare an actuating runtime §Hard gate; a missing wave is the exact ` +
                `assertion-by-omission the meta-gate forbids.`,
        );
    } else {
        note(
            `coverage: the roster is DERIVED from proof:correctness membership (${WAVE_HARD_GATES.length} ` +
                `gates — J.W3 S4/T4, no hardcoded list, no hand-edited exemption) and spans all ` +
                `${EXPECTED_WAVES.length} I waves (I.W4 declares two: drag-gesture + perf-frame-budget; ` +
                `demo-fonts enters under its J.W3 S5 SWITCH-actuation tiering).`,
        );
    }
}

// ── Self-posture record: this gate is HYGIENE-tier (it reads gate SCRIPTS) ─────
{
    const selfInHygiene = inChain(PROOF_HYGIENE, "proof:gate-is-runtime");
    const selfInCorrectness = inChain(PROOF_CORRECTNESS, "proof:gate-is-runtime");
    if (selfInCorrectness && !selfInHygiene) {
        fail(
            `[self-posture] proof:gate-is-runtime is wired into the CORRECTNESS tier — but it reads gate ` +
                `SCRIPTS (source shape of the harness), so it is HYGIENE-tier by its own taxonomy (it cannot ` +
                `see B1–B9; only proof:live-session can). Move it to proof:hygiene (H-4).`,
        );
    } else {
        ok(
            `[self-posture] proof:gate-is-runtime records itself HYGIENE-tier — it reads gate SCRIPTS, so it ` +
                `does NOT carry product-correctness authority (structural enforcement, like eslint). The overhaul ` +
                `does not exempt its own enforcer from its own taxonomy (H-4).`,
        );
    }
}

if (failures.length > 0) {
    console.error(
        `\nproof:gate-is-runtime — FAIL (${failures.length}): a wave's declared §Hard correctness gate is ` +
            `NOT an actuating runtime gate (source-shape / load-rest / proxy-store / jsdom), OR is not wired ` +
            `into the correctness tier of proof:all. The gate-ORACLE precept is not mechanically satisfied — ` +
            `a wave cannot close on a hygiene clause (S1 / H-4 / RED-1).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:gate-is-runtime — PASS: every I wave's (I.W0–I.W7) declared §Hard correctness gate opens a real " +
        "browser over the built dist (serveDist + KF_PLAYWRIGHT_DIR + newContext) AND actuates the product " +
        "(click / dispatch / drag / key / hover), AND is wired into the correctness tier of proof:all. The " +
        "gate-ORACLE precept is MACHINE-ENFORCED, not asserted-backward (RED-1 closed). This gate is itself " +
        "HYGIENE-tier (it reads gate scripts) — it polices the GATES' SHAPE; proof:chronic-closure polices the " +
        "chronic ROWS' cited gates; together the two-tier taxonomy is machine-enforced from t=0.",
);
