#!/usr/bin/env node
/**
 * proof:demo-no-oversize — H.W12 S3 / I10 (the demo stays decomposed + colocated).
 *
 * I10 is a VERIFY lane, NOT a split campaign: the demo is already D-tranche
 * decomposed (no demo file exceeds 500L), and the ONLY >500L files in the repo are
 * the FENCED engine (`src/animation/*` — ALREADY-SOTA, inv ζ, NOT swept here). So
 * this gate is a born-GREEN REGRESSION GUARD: it bites a FUTURE over-split (an I3
 * enrichment that pushes a Target past 500L without a colocated split) and a
 * FUTURE orphan (a `use*Demo` composable filed away from its scene Target).
 *
 * Re-runnable STATIC instrument (no browser, no build), mirroring the
 * collectSources idiom of proof:decomposition. The engine is excluded by
 * construction (the sweep root is `demo/`, never `src/`).
 *
 *   CLAUSE 1 — 500L CEILING. Every demo `.vue`/`.ts` (under `demo/`, dist/ +
 *     node_modules/ excluded) is ≤500L. Born-GREEN today (max demo file ≈485L);
 *     the bite is a future Target crossing 500L without a colocated split.
 *
 *   CLAUSE 2 — COLOCATION COHERENT. Each stage-scene dir colocates its
 *     `*Target.vue` + `use*Demo.ts` (+ its `*Keys.ts` inject key); NO `use*Demo`
 *     composable is orphaned in a dir without a sibling `*Target.vue`. The shared
 *     `useDragScrub` lives at the cross-scene `demo/@/composables/` home (a
 *     scene-shared seam, correctly NOT a scene-private composable). Reds if a
 *     `use*Demo` is filed without its Target sibling (the manufactured-split /
 *     orphan the spec forbids), or a stage-scene dir loses its Target / key.
 *
 * Re-runnable: `node scripts/proof-demo-no-oversize.mjs`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");

const SKIP_DIR = new Set(["dist", "node_modules", ".git", "coverage"]);
const SOURCE_EXT = new Set([".ts", ".vue"]);
const CEILING = 500;

const toPosix = (p) => p.split(path.sep).join("/");
const relPosix = (abs) => toPosix(path.relative(REPO, abs));

const failures = [];

/** Walk a dir, collecting every source file (skipping dist/ + deps). */
function collectSources(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) {
            if (SKIP_DIR.has(e.name)) continue;
            collectSources(path.join(dir, e.name), out);
        } else if (SOURCE_EXT.has(path.extname(e.name))) {
            out.push(path.join(dir, e.name));
        }
    }
    return out;
}

function main() {
    if (!fs.existsSync(DEMO)) {
        console.error("proof:demo-no-oversize — ERROR: demo/ not found.");
        process.exit(3);
    }

    console.log(
        "proof:demo-no-oversize — H.W12 S3/I10 (≤500L · colocation coherent · engine FENCED)",
    );

    const sources = collectSources(DEMO).sort();

    // ── CLAUSE 1 — 500L ceiling (regression guard) ─────────────────────────
    const over = [];
    let max = { rel: "", lines: 0 };
    for (const abs of sources) {
        const lines = fs.readFileSync(abs, "utf8").split("\n").length;
        if (lines > max.lines) max = { rel: relPosix(abs), lines };
        if (lines > CEILING) over.push({ rel: relPosix(abs), lines });
    }
    if (over.length > 0) {
        for (const o of over) {
            failures.push(
                `[ceiling] ${o.rel}: ${o.lines}L exceeds the ${CEILING}L demo ` +
                    `ceiling — split at its natural concern seam into a COLOCATED ` +
                    `sub-unit (the spec's answer is a colocated split, NOT trimming ` +
                    `the affordance; NO manufactured split that orphans a unit). ` +
                    `The engine (src/animation) is FENCED and out of this sweep ` +
                    `(H.W12.S3/I10).`,
            );
        }
    } else {
        console.log(
            `  ✓ [ceiling] all ${sources.length} demo .vue/.ts files ≤ ${CEILING}L ` +
                `(max ${max.rel} @ ${max.lines}L); the engine src/animation is ` +
                `FENCED + excluded`,
        );
    }

    // ── CLAUSE 2 — colocation coherent ─────────────────────────────────────
    {
        // The cross-scene shared composables home (NOT a scene-private dir — a
        // use* here is correctly shared, e.g. useDragScrub).
        const SHARED_COMPOSABLES = "demo/@/composables";

        // Every `use*Demo.ts` (the per-scene demo composable) must sit in a dir
        // that ALSO holds a sibling `*Target.vue` OR `*Scene.vue` — the
        // colocation invariant (the composable lives beside the surface it
        // drives). The Scene-sibling arm is the FUSED-scene form (S.D4's C-17
        // rename surfaced it: amiga/square render their subject INSIDE
        // <Name>Scene.vue and never had a separate Target — manufacturing one
        // would be exactly the manufactured-split the spec forbids). An orphan
        // (a use*Demo with NEITHER sibling) still reds.
        const orphans = [];
        const sceneComposables = sources.filter((abs) =>
            /\/use[A-Za-z]+Demo\.ts$/.test(toPosix(abs)),
        );
        for (const abs of sceneComposables) {
            const dir = path.dirname(abs);
            const siblings = fs.readdirSync(dir);
            const hasSurface = siblings.some((s) => /(?:Target|Scene)\.vue$/.test(s));
            if (!hasSurface) {
                orphans.push(relPosix(abs));
            }
        }
        if (orphans.length > 0) {
            failures.push(
                `[colocate] ${orphans.length} \`use*Demo\` composable(s) filed ` +
                    `WITHOUT a sibling \`*Target.vue\`/\`*Scene.vue\` in the same dir — a scene ` +
                    `composable colocates with its driven surface (no orphan in a wrong ` +
                    `dir; H.W12.S3/I10). Orphans:\n      ` +
                    orphans.join("\n      "),
            );
        } else {
            console.log(
                `  ✓ [colocate] all ${sceneComposables.length} use*Demo ` +
                    `composables colocate with a sibling *Target.vue/*Scene.vue`,
            );
        }

        // The stage scenes each colocate Target + composable + inject key.
        // R.W5: the scenes fused from `demo/<name>/` into `demo/scenes/<name>/`
        // (proof:scene-colocated is the fusion authority); these path literals
        // track the new colocated home. (motion-path was PRUNED at T.E3, OD-1.)
        const STAGE_SCENES = [
            "demo/scenes/sequence",
            "demo/scenes/spring",
            "demo/scenes/easing",
        ];
        const incoherent = [];
        for (const rel of STAGE_SCENES) {
            const dir = path.join(REPO, rel);
            if (!fs.existsSync(dir)) {
                incoherent.push(`${rel} (dir missing)`);
                continue;
            }
            const files = fs.readdirSync(dir);
            const hasTarget = files.some((f) => /Target\.vue$/.test(f));
            const hasDemo = files.some((f) => /^use[A-Za-z]+Demo\.ts$/.test(f));
            const hasKeys = files.some((f) => /Keys\.ts$/.test(f));
            const missing = [];
            if (!hasTarget) missing.push("*Target.vue");
            if (!hasDemo) missing.push("use*Demo.ts");
            if (!hasKeys) missing.push("*Keys.ts");
            if (missing.length > 0) {
                incoherent.push(`${rel} (missing ${missing.join(", ")})`);
            }
        }
        if (incoherent.length > 0) {
            failures.push(
                `[colocate] ${incoherent.length} stage-scene dir(s) do not ` +
                    `colocate Target + composable + inject key coherently ` +
                    `(H.W12.S3/I10):\n      ` +
                    incoherent.join("\n      "),
            );
        } else {
            console.log(
                `  ✓ [colocate] all ${STAGE_SCENES.length} stage-scene dirs ` +
                    `colocate *Target.vue + use*Demo.ts + *Keys.ts; the shared ` +
                    `useDragScrub lives at ${SHARED_COMPOSABLES}/`,
            );
        }
    }

    if (failures.length > 0) {
        console.error(
            "\nproof:demo-no-oversize — FAIL (the demo decomposition / colocation regressed):",
        );
        for (const f of failures) console.error("  ✗ " + f);
        console.error(
            "\n  I10 is VERIFY, not a split campaign: the demo is D-tranche decomposed\n" +
                "  (no file >500L; the engine is FENCED) and each scene colocates its\n" +
                "  Target + composable + key. This gate guards that state against a\n" +
                "  future over-split or an orphaned composable.",
        );
        process.exit(1);
    }

    console.log(
        "\nproof:demo-no-oversize — PASS: every demo file ≤500L; the scene\n" +
            "Target/composable/key colocations are coherent; the engine is FENCED.\n" +
            "H.W12 S3/I10 holds (the born-GREEN regression guard).",
    );
}

main();
