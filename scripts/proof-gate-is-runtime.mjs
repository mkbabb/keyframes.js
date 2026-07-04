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
 * `proof:demo-correctness` tier (S.A4 renamed proof:correctness → the browser-
 * actuator tier) — the roster is DERIVED from the chain's membership
 * (J.W3 S4 / T4 / GC-3), never a hardcoded list, so a new demo-correctness gate can
 * never escape the precept-enforcer — it asserts the gate's SCRIPT:
 *   (a) opens a browser over the proven serveDist + KF_PLAYWRIGHT_DIR chromium +
 *       newContext harness (it is NOT a jsdom unit, NOT a bare source grep), AND
 *   (b) ACTUATES the running product — it references the actuating harness
 *       primitives (page.click / page.dispatchEvent / page.mouse / page.keyboard /
 *       page.dragAndDrop / a trusted PointerEvent dispatch), NOT goto+rest, NOT a
 *       localStorage round-trip, NOT a source grep, AND
 *   (c) is wired into the DEMO-CORRECTNESS TIER of proof:all (proof:demo-correctness).
 * The SYMMETRIC inversion (S.A4 S2): every proof:library-correctness member must NOT
 * carry a browser harness — mis-tier reds in BOTH directions (SA-9).
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
    hasBrowserHarness,
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
const PROOF_DEMO_CORRECTNESS = SCRIPTS["proof:demo-correctness"] ?? "";
const PROOF_LIBRARY_CORRECTNESS = SCRIPTS["proof:library-correctness"] ?? "";

// ── The audited roster is DERIVED from proof:demo-correctness MEMBERSHIP (J.W3 S4,
// T4 / GC-3; RE-TARGETED at S.A4 from the renamed proof:correctness). S.A4 replaced
// the harness-defined two-tier model ("proof:correctness" = opens-a-browser) with a
// SEVERITY-axis taxonomy: proof:demo-correctness is the BROWSER-actuator tier this
// meta-gate polices (every member must open a browser + actuate), and
// proof:library-correctness is the node/jsdom value-proof tier, audited by the
// SYMMETRIC clause below (an LC member must NOT carry a browser-harness signature —
// making mis-tier falsifiable in BOTH directions, SA-9). The roster is the PARSED
// proof:demo-correctness chain: every member is audited, NO hand-edited exemption
// exists, and a NEW demo-correctness gate can never escape the precept (T4). The
// stale I-era WAVE_ANNOTATION provenance map is DROPPED (S.A4 — I.W0–I.W7 labels
// post-date to S; provenance never gated membership); every member is labelled
// `demo-correctness`.
const WAVE_HARD_GATES = [
    ...new Set(
        [...PROOF_DEMO_CORRECTNESS.matchAll(/proof:[a-z0-9-]+/g)].map((m) => m[0]),
    ),
]
    .filter((g) => g !== "proof:demo-correctness")
    .map((gate) => ({ wave: "demo-correctness", gate }));

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

    // (c) the gate must be wired into the DEMO-CORRECTNESS tier of proof:all. We accept
    // either a `proof:demo-correctness` sub-aggregator membership OR a direct proof:all
    // membership when demo-correctness is the chain proof:all runs (single source).
    const inCorrectness = inChain(PROOF_DEMO_CORRECTNESS, gate) || (PROOF_DEMO_CORRECTNESS === "" && inChain(PROOF_ALL, gate));
    const inHygiene = inChain(PROOF_HYGIENE, gate);
    if (!inCorrectness) {
        fail(
            `[${wave}] §Hard gate \`${gate}\` is NOT wired into the DEMO-CORRECTNESS tier (proof:demo-correctness) — ` +
                `a demo-correctness gate must run in the actuating tally, not be orphaned or hygiene-only.`,
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

// ── Non-vacuity floor: MEMBERSHIP-COUNT (S.A4, replacing the frozen I-wave floor) ─
// The pre-S.A4 floor asserted the roster spanned a HARDCODED I.W0–I.W7 wave list —
// stale by construction post-S (the I labels no longer describe the demo-correctness
// tier, and a legitimate retire like C-6 scene-switcher-mobile would falsely red a
// frozen wave slot). Per a27 F4 / S.A4 (c) it is replaced by a MEMBERSHIP-COUNT
// non-vacuity floor: the derived roster must be non-empty AND carry at least a sane
// minimum of actuating gates (so it cannot silently collapse to a vacuous pass — the
// born-RED b934a08 condition — while imposing no frozen per-wave list). Every member
// is shape-audited by the loop above; this floor guards the roster's SIZE.
{
    const MEMBERSHIP_FLOOR = 10; // non-vacuity: a gutted demo-correctness tier reds
    if (WAVE_HARD_GATES.length === 0) {
        fail(
            `[coverage] the derived roster is EMPTY — proof:demo-correctness resolves no members. The ` +
                `meta-gate must never pass vacuously (the born-RED b934a08 condition; a run-all DELEGATOR ` +
                `instead of a direct && chain yields this empty roster — proof:demo-correctness MUST stay ` +
                `a direct && chain, p08 §3.2).`,
        );
    } else if (WAVE_HARD_GATES.length < MEMBERSHIP_FLOOR) {
        fail(
            `[coverage] the derived demo-correctness roster has only ${WAVE_HARD_GATES.length} member(s) — ` +
                `below the non-vacuity floor of ${MEMBERSHIP_FLOOR}. The actuating tier cannot silently ` +
                `collapse (S.A4 membership-count floor, replacing the stale I.W0–I.W7 wave list).`,
        );
    } else {
        note(
            `coverage: the roster is DERIVED from proof:demo-correctness membership (${WAVE_HARD_GATES.length} ` +
                `actuating gates — J.W3 S4/T4, no hardcoded list, no hand-edited exemption; S.A4 membership-` +
                `count floor ≥ ${MEMBERSHIP_FLOOR}, the frozen I-wave floor dropped).`,
        );
    }
}

// ── The SYMMETRIC mis-tier clause (S.A4 S2 / SA-9/SA-10) — falsifiable in BOTH
// directions. The demo-correctness loop above asserts every §Hard gate DOES open a
// browser + actuate (a node gate masquerading as demo-correctness REDs on the
// missingHarness check). The inverse must also hold: a proof:library-correctness
// member's script must NOT carry a browser-harness signature — a browser-actuating
// gate hiding in the node/jsdom value-proof tier REDs. Together the two make "a
// planted mis-tiered gate REDs" falsifiable in BOTH directions (p08 §3.4; the v1
// "post-actuation DOM-read heuristic" is DROPPED — the anchor is the existing
// browser-harness signature, inverted). A vitest-only LC gate carries no
// scripts/proof-*.mjs, so it cannot bear a browser harness — correctly tiered. ────
{
    const libraryMembers = [
        ...new Set(
            [...PROOF_LIBRARY_CORRECTNESS.matchAll(/proof:[a-z0-9-]+/g)].map((m) => m[0]),
        ),
    ].filter((g) => g !== "proof:library-correctness");
    if (PROOF_LIBRARY_CORRECTNESS === "") {
        fail(
            `[library-correctness] proof:library-correctness resolves NO members — the S.A4 three-tier ` +
                `taxonomy did not land (or the tier was renamed). The symmetric mis-tier clause cannot audit ` +
                `an absent tier.`,
        );
    }
    for (const gate of libraryMembers) {
        const body = SCRIPTS[gate];
        if (!body) {
            fail(
                `[library-correctness] \`${gate}\` is a proof:library-correctness member but does NOT resolve ` +
                    `to a package.json script key — a dangling tier membership.`,
            );
            continue;
        }
        const sp = scriptPathFor(body);
        if (!sp || !fs.existsSync(sp)) {
            // vitest-only / no proof-*.mjs — cannot carry a browser harness → correctly tiered.
            continue;
        }
        const src = fs.readFileSync(sp, "utf8");
        const rel = path.relative(REPO, sp).split(path.sep).join("/");
        if (hasBrowserHarness(src)) {
            fail(
                `[library-correctness] \`${gate}\` (${rel}) carries a BROWSER-HARNESS signature (serveDist + ` +
                    `KF_PLAYWRIGHT_DIR + newContext, inline OR the withPage lib lifecycle) but is filed in ` +
                    `proof:library-correctness (node/jsdom value-proofs). A browser-actuating gate belongs in ` +
                    `proof:demo-correctness — the symmetric mis-tier inversion REDs (SA-9).`,
            );
        }
    }
}

// ── Self-posture record: this gate is HYGIENE-tier (it reads gate SCRIPTS) ─────
{
    const selfInHygiene = inChain(PROOF_HYGIENE, "proof:gate-is-runtime");
    const selfInCorrectness = inChain(PROOF_DEMO_CORRECTNESS, "proof:gate-is-runtime");
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
    "\nproof:gate-is-runtime — PASS: every proof:demo-correctness member opens a real browser over the built " +
        "dist (serveDist + KF_PLAYWRIGHT_DIR + newContext) AND actuates the product (click / dispatch / drag / " +
        "key / hover), AND is wired into the demo-correctness tier of proof:all; AND every proof:library-" +
        "correctness member is a node/jsdom value-proof carrying NO browser harness (the S.A4 symmetric mis-" +
        "tier inversion — mis-tier reds in BOTH directions). The gate-ORACLE precept is MACHINE-ENFORCED, not " +
        "asserted-backward (RED-1 closed). This gate is itself HYGIENE-tier (it reads gate scripts) — it polices " +
        "the GATES' SHAPE; proof:chronic-closure polices the chronic ROWS' cited gates; the three-tier taxonomy " +
        "is machine-enforced from t=0.",
);
