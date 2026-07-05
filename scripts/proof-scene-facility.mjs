#!/usr/bin/env node
/**
 * proof:scene-facility — T.B1 (the `SceneFacility` keystone, STAGE 1: batch-④′ α).
 *
 * The unification seam that replaces the `animationGroup?` + `scenePlayback?` +
 * `useContractAnimGroup` decoy triple with ONE descriptor (`{channels, facets,
 * playback}`) every migrated scene exposes. This gate is SPLIT HONESTLY into two
 * clause families:
 *
 *   (a) STAGE-1 GREEN — the descriptor exists, the GROUP scenes (cube/amiga/
 *       square) + SEQUENCE expose a facility, and none of those four scenes touch
 *       the decoy. These clauses PASS on this tree; a regression (a scene dropping
 *       its facility, or a migrated scene re-growing a contract group) reds them.
 *
 *   (b) BORN-RED — the decoy-ZERO clause: ZERO `useContractAnimGroup` references
 *       anywhere under demo/. This is RED TODAY because easing + spring still ride
 *       the contract group (the STAGE-2 channel-rendering joint motion,
 *       T.B1-β/T.B7, batch ⑤, has not landed) and the `useContractAnimGroup.ts`
 *       definition still exists. Registered in scripts/gate-bands.mjs
 *       T_BORNRED_BACKLOG (dischargedBy the batch-⑤ joint motion); rides CI as a
 *       recorded tripwire, never a blocking &&-chain member.
 *
 * The gate exits 1 while clause (b) is unmet (born-RED). When batch ⑤ deletes the
 * easing/spring call sites + the definition, clause (b) greens and the gate exits
 * 0 — the discharge is machine-observed, not prose.
 *
 * Re-runnable: `node scripts/proof-scene-facility.mjs`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const SKIP_DIR = new Set(["dist", "node_modules", ".git", "coverage"]);
const SOURCE_EXT = new Set([".ts", ".vue"]);

/** Recursively collect every .ts/.vue source under a dir. */
function collectSources(dir) {
    const out = [];
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        if (ent.isDirectory()) {
            if (SKIP_DIR.has(ent.name)) continue;
            out.push(...collectSources(path.join(dir, ent.name)));
        } else if (SOURCE_EXT.has(path.extname(ent.name))) {
            out.push(path.join(dir, ent.name));
        }
    }
    return out;
}

const read = (rel) => fs.readFileSync(path.join(REPO, rel), "utf8");
const exists = (rel) => fs.existsSync(path.join(REPO, rel));

const greenPasses = [];
const greenFails = [];
const bornRedFails = [];

// ── Clause (a1) — the descriptor module exists + exports the seam ────────────
if (
    exists("demo/app/scene/sceneFacility.ts") &&
    /export interface SceneFacility/.test(read("demo/app/scene/sceneFacility.ts")) &&
    /export function facilityFromGroup/.test(read("demo/app/scene/sceneFacility.ts"))
) {
    greenPasses.push(
        "(a1) descriptor — demo/app/scene/sceneFacility.ts exports SceneFacility + facilityFromGroup",
    );
} else {
    greenFails.push(
        "(a1) descriptor — demo/app/scene/sceneFacility.ts must export `SceneFacility` + `facilityFromGroup`",
    );
}

// ── Clause (a2) — SceneExposedApi carries the facility field ─────────────────
if (
    exists("demo/app/scene/sceneExposedApi.ts") &&
    /facility\?:\s*SceneFacility/.test(read("demo/app/scene/sceneExposedApi.ts"))
) {
    greenPasses.push("(a2) contract — SceneExposedApi carries `facility?: SceneFacility`");
} else {
    greenFails.push(
        "(a2) contract — SceneExposedApi must carry `facility?: SceneFacility` (the additive seam)",
    );
}

// ── Clause (a3) — the GROUP scenes expose a facility ─────────────────────────
const GROUP_SCENES = [
    ["cube", "demo/scenes/cube/CubeScene.vue"],
    ["amiga", "demo/scenes/amiga/AmigaScene.vue"],
    ["square", "demo/scenes/square/SquareScene.vue"],
];
for (const [name, rel] of GROUP_SCENES) {
    if (exists(rel) && /facility:\s*computed\(\(\)\s*=>\s*facilityFromGroup/.test(read(rel))) {
        greenPasses.push(`(a3) group-scene — ${name} exposes facility via facilityFromGroup`);
    } else {
        greenFails.push(
            `(a3) group-scene — ${name} (${rel}) must expose \`facility: computed(() => facilityFromGroup(...))\``,
        );
    }
}

// ── Clause (a4) — SEQUENCE migrated: facility exposed + its contract group gone ──
if (
    exists("demo/scenes/sequence/SequenceScene.vue") &&
    /facility:\s*computed\(\(\)\s*=>\s*demo\.facility\)/.test(
        read("demo/scenes/sequence/SequenceScene.vue"),
    )
) {
    greenPasses.push("(a4) sequence — SequenceScene exposes `facility` (its decoy group is deleted)");
} else {
    greenFails.push(
        "(a4) sequence — SequenceScene.vue must expose `facility: computed(() => demo.facility)`",
    );
}
if (
    exists("demo/scenes/sequence/useSequenceDemo.ts") &&
    /const facility:\s*SceneFacility/.test(read("demo/scenes/sequence/useSequenceDemo.ts"))
) {
    greenPasses.push("(a4) sequence — useSequenceDemo builds a SceneFacility (raw-rAF playback)");
} else {
    greenFails.push("(a4) sequence — useSequenceDemo.ts must build a `SceneFacility`");
}

// ── Clause (a5) — the four MIGRATED scenes touch NO decoy ────────────────────
const MIGRATED_DIRS = ["cube", "amiga", "square", "sequence"];
const migratedDecoy = [];
for (const d of MIGRATED_DIRS) {
    for (const f of collectSources(path.join(DEMO, "scenes", d))) {
        if (/useContractAnimGroup\s*\(/.test(fs.readFileSync(f, "utf8"))) {
            migratedDecoy.push(path.relative(REPO, f));
        }
    }
}
if (migratedDecoy.length === 0) {
    greenPasses.push(
        "(a5) migrated-clean — cube/amiga/square/sequence carry ZERO useContractAnimGroup call sites",
    );
} else {
    greenFails.push(
        "(a5) migrated-clean — a MIGRATED scene still calls useContractAnimGroup: " +
            migratedDecoy.join(", "),
    );
}

// ── Clause (b) — BORN-RED: ZERO useContractAnimGroup references under demo/ ───
const decoyHits = [];
for (const f of collectSources(DEMO)) {
    if (/useContractAnimGroup/.test(fs.readFileSync(f, "utf8"))) {
        decoyHits.push(path.relative(REPO, f));
    }
}
const bornRedGreen = decoyHits.length === 0;
if (!bornRedGreen) {
    bornRedFails.push(
        "(b) decoy-zero [BORN-RED] — useContractAnimGroup still referenced in: " +
            decoyHits.join(", ") +
            ". Discharged by the STAGE-2 easing/spring channel-rendering joint motion " +
            "(T.B1-β/T.B7, batch ⑤): migrate easing + spring off the contract group, then " +
            "delete demo/app/runtime/useContractAnimGroup.ts.",
    );
}

// ── report ───────────────────────────────────────────────────────────────────
console.log("proof:scene-facility — T.B1 STAGE 1 (SceneFacility keystone)\n");
console.log("  clause (a) — STAGE-1 GREEN:");
for (const p of greenPasses) console.log("    ✓ " + p);
for (const f of greenFails) console.log("    ✗ " + f);
console.log("\n  clause (b) — BORN-RED (T_BORNRED_BACKLOG; dischargedBy batch ⑤):");
if (bornRedGreen) console.log("    ✓ (b) decoy-zero — ZERO useContractAnimGroup references under demo/");
for (const f of bornRedFails) console.log("    ✗ " + f);

if (greenFails.length > 0) {
    console.error(
        `\nproof:scene-facility — FAIL: ${greenFails.length} STAGE-1 clause(s) regressed ` +
            "(these must stay GREEN — a migrated scene lost its facility or re-grew a decoy).",
    );
    process.exit(1);
}
if (!bornRedGreen) {
    console.error(
        "\nproof:scene-facility — BORN-RED: STAGE-1 clauses GREEN; the decoy-zero clause (b) " +
            "stays RED until batch ⑤ (easing/spring channel-rendering) lands. This is the declared " +
            "backlog (scripts/gate-bands.mjs T_BORNRED_BACKLOG), not a silent red.",
    );
    process.exit(1);
}

console.log("\nproof:scene-facility — PASS: the facility keystone is complete (decoy gone).");
