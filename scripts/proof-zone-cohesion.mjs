#!/usr/bin/env node
/**
 * proof:zone-cohesion — T.F22 THE LIBRARY HALF of THE GRAND COLOCATION EDICT
 * (2026-07-05, OWNER-ASKS row 1). The library-side companion to
 * `proof:decomposition`.
 *
 * `proof:decomposition` (clause 1) measures the HARD 500L `.ts` ceiling, and
 * `proof:cohesion` / `boundary-cohesion` measure the cross-file cycle/ownership
 * RING. NEITHER measures a zone's INTERNAL concern density — a 490L single file
 * that packs three concerns passes both. THIS gate closes that: it measures
 * per-zone INTRA-FILE cohesion at a STRICTER 400L threshold. A long, multi-concern
 * file inside a zone must be broken into ENCAPSULATED common modules WITHIN that
 * zone (the edict's "long running dirs … broken into common modules and
 * encapsulated thereof", abstracted from dirs to intra-zone files), OR carry a
 * JUSTIFIED single-concern declaration — a hot-path / flat-data-table / already-
 * carved cohesive-class unit the edict explicitly exempts (T.F22 scope (b): "do
 * NOT contrive splits").
 *
 * RING-FENCE (T.md §4 — BINDING, machine-checked). This gate touches ONLY
 * intra-zone FILE structure; it NEVER re-carves a zone BOUNDARY. Clause 3 proves
 * it: the 11-zone partition (ZONE_DIRS) is intact + each zone still carries its
 * `index.ts` barrel, `internal/` stays the barrel-free leaf tier (C-5), and no
 * zone was added or removed. The zone DECISIONS (the R.W1 partition, EN-a/EN-b,
 * the ownership inversion) STAND — this wave is about zone INTERNALS only.
 *
 * CLAUSES (each BITES on the exact negative case it forbids — verified, not
 * asserted; mirrors proof:decomposition's per-clause exit-1 discipline):
 *
 *   1. ZONE-COHESION CEILING — every `src/animation/**\/*.ts` over
 *      ZONE_COHESION_CEILING (400L) is EITHER decomposed (now ≤400) OR carries a
 *      JUSTIFIED single-concern entry (below) with a recorded rationale. A NEW
 *      file crossing 400 with no justification REDs; the cure is a cohesion
 *      carve into an encapsulated sub-module, never a raised threshold.
 *
 *   2. STALE-JUSTIFICATION GUARD — a JUSTIFIED entry naming a file that is now
 *      ≤400 (the carve landed) OR absent (renamed/deleted) is DEAD; prune it.
 *      (The R.W0 stale-override lesson: a self-certifying allowlist entry that no
 *      longer measures anything is a mask — it REDs.)
 *
 *   3. RING-FENCE — the zone partition is intact: every ZONE_DIRS entry exists +
 *      carries an `index.ts` barrel; `internal/` exists WITHOUT one (C-5); no
 *      extra barrelled zone dir appeared beyond ZONE_DIRS ∪ {constants}. A gate
 *      that could green by re-carving a boundary is falsified here.
 *
 *   4. NO-TEST-IN-SRC — zero `*.test.ts` / `*.spec.ts` under `src/` (the S.B7
 *      invariant the edict must PRESERVE, not weaken — T.F22 scope: "no test
 *      files in src stands").
 *
 * Exits 1 on any residual with a clear, per-clause message.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ANIM = path.join(REPO, "src/animation");
const SRC = path.join(REPO, "src");

const toPosix = (p) => p.split(path.sep).join("/");
const relPosix = (abs) => toPosix(path.relative(REPO, abs));

// The stricter INTRA-ZONE concern-density threshold (below proof:decomposition's
// 500L HARD ceiling): a `.ts` over this either decomposes or is justified.
const ZONE_COHESION_CEILING = 400;

// The 11 PUBLIC zone directories (the R.W1 partition — the canonical list, kept
// in lockstep with proof:no-flat-siblings' ZONE_DIRS). `constants/` is a
// barrelled types/defaults dir (S.B1), not one of the 11 "zones" but a legal
// barrelled sub-dir; `internal/` is the barrel-FREE leaf tier (C-5).
const ZONE_DIRS = [
    "physics",
    "orchestration",
    "engine",
    "group",
    "compile",
    "resolve",
    "ingest",
    "scroll",
    "waapi",
    "presets",
    "svg",
];

/**
 * THE JUSTIFIED SINGLE-CONCERN DECLARATIONS — files over 400L that are ONE
 * cohesive concern the edict explicitly exempts (T.F22 scope (b): "do NOT
 * contrive splits"). Each carries a recorded rationale; a stale entry (file now
 * ≤400 or absent) REDs (clause 2). The reds on every OTHER over-400 file ARE the
 * carve backlog — this map is NOT a ceiling-raiser (contrast the R.W0
 * LIBRARY_CEILING_OVERRIDE anti-pattern: there is no per-file cap here, only a
 * declaration that the file is a single indivisible concern).
 *
 * Keyed by repo-relative POSIX path.
 */
const JUSTIFIED = new Map([
    // ── HOT PATHS (a split adds per-frame indirection — coordinate with T.G) ──
    [
        "src/animation/physics/spring/progress.ts",
        "HOT PATH — the per-frame SpringProgress stepper (tick/tickDt over the " +
            "closed-form solver); one algorithm, per-frame. A carve would add " +
            "call indirection to the 60Hz path (T.G-coordinated).",
    ],
    [
        "src/animation/compile/frame-compiler.ts",
        "HOT PATH — FrameCompiler.parse + the interp-plan build the per-frame " +
            "interpFrames reads; one cohesive compile-then-sample unit (T.G).",
    ],
    [
        "src/animation/group/group.ts",
        "HOT PATH — the AnimationGroup compositor draw loop (the per-frame SoA " +
            "blend fold is already carved to soa/compositor/springs siblings; the " +
            "residue is the one thin this-delegating class over the loop; T.G).",
    ],
    // ── FLAT DATA TABLE (a data partition has no cohesion benefit — S.B5) ─────
    [
        "src/animation/presets/classic-data.ts",
        "FLAT DATA TABLE — the 34 CSS keyframe-string constants (S.B5 split the " +
            "DATA off the factories); a 3-way string partition is the contrivance " +
            "R.md §7 forbids. Leave it (the wave names this one to leave).",
    ],
    // ── COHESIVE CORE CLASS / EMITTER (peripheral concerns ALREADY carved) ────
    [
        "src/animation/engine/animation.ts",
        "COHESIVE CORE CLASS — the base KeyframesAnimation. R.W2/S.B2 already " +
            "carved the play machine (play-lifecycle), interp (interpolate), " +
            "option-apply (option-setters/options), compile bridge, PlaybackState " +
            "store, and CSS layer (css/) OFF it; the residue is one class whose " +
            "methods interdepend — a further split fragments the concern.",
    ],
    [
        "src/animation/engine/play-lifecycle.ts",
        "COHESIVE LIFECYCLE UNIT — the standalone-play free-function machine " +
            "(play/advance/transport + the rAF/WAAPI/reduced-motion drivers + the " +
            "per-frame render half). One play-loop concern, hot-path-adjacent (it " +
            "DRIVES advanceTo per frame) — a split adds per-frame indirection (T.G).",
    ],
    [
        "src/animation/compile/backward/backward.ts",
        "COHESIVE EMITTER — compileToCSS. The input-graph walkers (backward-walk), " +
            "the oklab densify (backward-color), the linear() densify (densify), " +
            "the format serializer (format/format-options) are ALREADY sibling " +
            "sub-modules; the residue is the one emit orchestrator + its refusal " +
            "taxonomy — cohesive, no independent sub-concern to encapsulate.",
    ],
    [
        "src/animation/compile/entry.ts",
        "COHESIVE EMITTER — compileToEntry (the @starting-style/allow-discrete " +
            "three-rule grammar) + its 9-way refusal taxonomy. One declared-" +
            "endpoint projection over format.ts's substrate; a single concern.",
    ],
    [
        "src/animation/ingest/cssom.ts",
        "COHESIVE WALK — the CSSOM stylesheet walk (fromStyleSheets / " +
            "fromLiveAnimations / resolveLiveKeyframes + the per-rule diagnostics). " +
            "The mid-flight temporal takeover (adopt.ts) is ALREADY a sibling; the " +
            "residue is one walk over document.styleSheets.",
    ],
    [
        "src/animation/orchestration/drag/draggable.ts",
        "COHESIVE CLASS — the one-axis Draggable (pointer-capture follow + " +
            "velocity-window sampling + release fling re-seat). The 2-D sugar is " +
            "ALREADY carved to drag-2d.ts; the residue is one input-plumbing class " +
            "whose gesture state is a single lifecycle.",
    ],
    [
        "src/animation/orchestration/sequence/sequence.ts",
        "COHESIVE CLASS — the master-playhead Sequence. events/lifecycle/transport " +
            "are ALREADY carved into the sub-zone siblings; the 402L residue is one " +
            "class (the position-insertion clock map) — barely over, indivisible.",
    ],
]);

const SKIP_DIR = new Set(["dist", "node_modules", ".git"]);

/** Collect every `.ts` file under a dir (skipping dist/deps). */
function collectTs(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) {
            if (SKIP_DIR.has(e.name)) continue;
            collectTs(path.join(dir, e.name), out);
        } else if (e.name.endsWith(".ts")) {
            out.push(path.join(dir, e.name));
        }
    }
    return out;
}

const lineCount = (abs) => fs.readFileSync(abs, "utf8").split("\n").length;

const failures = [];

console.log(
    "proof:zone-cohesion — T.F22 (per-zone internal cohesion + long-file encapsulation)",
);

const sources = collectTs(ANIM).sort();
console.log(
    `  library .ts files scanned: ${sources.length} under src/animation/ ` +
        `(threshold ${ZONE_COHESION_CEILING}L; ${JUSTIFIED.size} justified ` +
        `single-concern declaration(s))`,
);

// ── 1. ZONE-COHESION CEILING ────────────────────────────────────────────────
{
    const over = [];
    for (const abs of sources) {
        const rel = relPosix(abs);
        const lines = lineCount(abs);
        if (lines > ZONE_COHESION_CEILING && !JUSTIFIED.has(rel)) {
            over.push({ rel, lines });
        }
    }
    if (over.length > 0) {
        for (const o of over) {
            failures.push(
                `[cohesion-ceiling] ${o.rel}: ${o.lines}L exceeds the ` +
                    `${ZONE_COHESION_CEILING}L intra-zone concern-density ` +
                    `threshold — break it into an ENCAPSULATED sub-module WITHIN ` +
                    `its zone (a colocated sibling on the concern seam; NEVER a new ` +
                    `cross-zone edge), OR add a JUSTIFIED single-concern entry with ` +
                    `a recorded rationale if it is one indivisible concern (a hot ` +
                    `path / flat data table / already-carved cohesive class).`,
            );
        }
    } else {
        console.log(
            `  ✓ [cohesion-ceiling] every library .ts is ≤${ZONE_COHESION_CEILING}L ` +
                `or carries a justified single-concern declaration`,
        );
    }
}

// ── 2. STALE-JUSTIFICATION GUARD ──────────────────────────────────────────────
{
    const stale = [];
    for (const [rel, reason] of JUSTIFIED) {
        const abs = path.join(REPO, rel);
        if (!fs.existsSync(abs)) {
            stale.push(`${rel} — file absent (renamed/deleted); prune the entry.`);
            continue;
        }
        const lines = lineCount(abs);
        if (lines <= ZONE_COHESION_CEILING) {
            stale.push(
                `${rel} — now ${lines}L ≤ ${ZONE_COHESION_CEILING}L (the carve ` +
                    `landed); the justification is dead, prune it.`,
            );
        }
        if (typeof reason !== "string" || reason.trim().length < 20) {
            stale.push(`${rel} — the justification rationale is missing/too thin.`);
        }
    }
    if (stale.length > 0) {
        for (const s of stale) failures.push(`[stale-justification] ${s}`);
    } else {
        console.log(
            `  ✓ [stale-justification] every justified entry still measures a ` +
                `>${ZONE_COHESION_CEILING}L file and carries a rationale`,
        );
    }
}

// ── 3. RING-FENCE — the zone partition is intact (T.md §4) ────────────────────
{
    const ringFails = [];
    // Every ZONE dir exists + carries an index.ts barrel.
    for (const zone of ZONE_DIRS) {
        const zoneDir = path.join(ANIM, zone);
        if (!fs.existsSync(zoneDir) || !fs.statSync(zoneDir).isDirectory()) {
            ringFails.push(`zone dir src/animation/${zone}/ is MISSING — the R.W1 partition changed.`);
            continue;
        }
        if (!fs.existsSync(path.join(zoneDir, "index.ts"))) {
            ringFails.push(`src/animation/${zone}/ carries no index.ts barrel — the zone lost its surface.`);
        }
    }
    // internal/ stays the barrel-FREE leaf tier (C-5).
    const internalDir = path.join(ANIM, "internal");
    if (!fs.existsSync(internalDir)) {
        ringFails.push("src/animation/internal/ is MISSING — the value.js-free leaf tier vanished.");
    } else if (fs.existsSync(path.join(internalDir, "index.ts"))) {
        ringFails.push(
            "src/animation/internal/index.ts REAPPEARED — internal/ is the " +
                "barrel-FREE leaf tier by design (C-5); a barrel promotes it to a zone.",
        );
    }
    // No EXTRA barrelled zone dir appeared beyond ZONE_DIRS ∪ {constants}.
    const allowedBarrelDirs = new Set([...ZONE_DIRS, "constants"]);
    for (const e of fs.readdirSync(ANIM, { withFileTypes: true })) {
        if (!e.isDirectory() || SKIP_DIR.has(e.name)) continue;
        const hasBarrel = fs.existsSync(path.join(ANIM, e.name, "index.ts"));
        if (hasBarrel && !allowedBarrelDirs.has(e.name)) {
            ringFails.push(
                `src/animation/${e.name}/ is a NEW barrelled top-level dir — this ` +
                    `gate re-carves NO zone boundary (T.md §4). A cohesion split ` +
                    `stays INSIDE an existing zone; a new zone is a boundary change ` +
                    `outside this wave's ring-fence.`,
            );
        }
    }
    if (ringFails.length > 0) {
        for (const f of ringFails) failures.push(`[ring-fence] ${f}`);
    } else {
        console.log(
            `  ✓ [ring-fence] the 11-zone partition + constants/ barrels are intact; ` +
                `internal/ is barrel-free; no zone added/removed`,
        );
    }
}

// ── 4. NO-TEST-IN-SRC (the S.B7 invariant — preserve, never weaken) ──────────
{
    const testInSrc = collectTs(SRC).filter((abs) =>
        /\.(test|spec)\.ts$/.test(path.basename(abs)),
    );
    if (testInSrc.length > 0) {
        failures.push(
            `[no-test-in-src] ${testInSrc.length} test file(s) under src/ — ` +
                `tests live in test/<zone>/ (S.B7); this invariant is PRESERVED, ` +
                `never weakened:\n      ` +
                testInSrc.map(relPosix).join("\n      "),
        );
    } else {
        console.log(`  ✓ [no-test-in-src] zero *.test.ts / *.spec.ts under src/`);
    }
}

if (failures.length > 0) {
    console.error("\nproof:zone-cohesion — FAIL (the library is not yet zone-cohesive):");
    for (const f of failures) console.error("  ✗ " + f);
    console.error(
        "\n  Break each over-threshold multi-concern file into an ENCAPSULATED\n" +
            "  sub-module WITHIN its zone (a colocated sibling on the concern seam,\n" +
            "  NEVER a new cross-zone edge), or record a JUSTIFIED single-concern\n" +
            "  declaration for a genuinely indivisible unit. The ring-fence (T.md §4)\n" +
            "  is machine-checked: this gate re-carves NO zone boundary.",
    );
    process.exit(1);
}

console.log(
    "\nproof:zone-cohesion — PASS: every library .ts is under the intra-zone\n" +
        "cohesion threshold or a justified single concern, the 11-zone partition is\n" +
        "intact (no boundary re-carve), and no test file sits in src/. T.F22 holds.",
);
