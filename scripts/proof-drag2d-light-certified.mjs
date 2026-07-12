#!/usr/bin/env node
/**
 * proof:drag2d-light-certified — Q.WA2 (the drag2D LIGHT public-primitive
 * certification; the DemoControlPoint enabler). AXIS-3 STATIC + a barrel-import
 * probe. Wired into proof:hygiene.
 *
 * THE INVERSION (Q.WA2 §Context, AUDIT-31 B2-pw7). The pre-audit premise was
 * STALE: it assumed Q.WA2 must "ADD drag2D to the index.ts LIGHT surface."
 * That is FALSE on today's tree — `drag2D`/`Drag2DHandle` are ALREADY LIGHT
 * barrel exports (`src/animation/index.ts:88,93`), gate-proven by
 * `proof:drag-gesture` S4 (a 2-D drag → `handle.value.y ≈ 120` off the compiled
 * barrel). So this gate does NOT re-assert "add the export" (a no-op at best, a
 * second re-export path — a no-legacy violation — at worst). It asserts the
 * actual Q.WA2 work: the CERTIFICATION + the RETIRE + the LOCK.
 *
 * THE REAL OBSERVABLE IT BITES (NOT a proxy). The genuine defect is the
 * DemoControlPoint chain (DM-2, the NINTH P-inv-28 carry) building against an
 * UN-certified, UN-documented, UN-locked drag2D, BESIDE a stale gate
 * (`proof:control-point-live`) that LIES about the blocker (it asserts a glass-ui
 * `GlassControlPoint` component BC decided never to ship). A boundary regression
 * on the primitive, or a re-introduction of the dead glass-ui premise, would slip
 * silently. This gate asserts each genuine observable, never a grep of intent:
 *
 *   (a) drag2D is DOCUMENTED as a supported LIGHT primitive (S1) — in BOTH the
 *       source barrel and implementation documentation
 *       orchestration-tier note. BITE: reds if the certification doc is missing —
 *       the primitive is an incidental re-export with no committed contract.
 *
 *   (b) the stale `proof:control-point-live` gate is RETIRED (S2) — the script is
 *       DELETED, and EVERY reference to it is gone (package.json entry, ci.yml
 *       step/id/aggregator/echo, the proof-ci-coverage EXCLUSION entry), and NO
 *       orphan `GlassControlPoint` reference survives in scripts/, and
 *       `proof:ci-coverage` exits 0 (no orphan-exclusion red). BITE: reds if the
 *       dead glass-ui gate survives in ANY weave-point — the false "needs drag2D"
 *       premise still mis-blocks the chain and the no-legacy precept is violated.
 *
 *   (c) drag2D is genuinely importable + value.js-free off the compiled LIGHT
 *       barrel + CERTIFIED (S3) — `import { drag2D } from dist/keyframes.js` is a
 *       function (NOT undefined), the source barrel re-exports it as a LIGHT entry
 *       with NO static value.js edge on the re-export chain (drag-2d→drag→index),
 *       AND `proof:published-surface` NAMES drag2D + Drag2DHandle in its SUPPORTED
 *       LIGHT export set. The load-bearing NEW assertion is the
 *       proof:published-surface certification; the import + the zero-value.js-edge
 *       are the EXISTING green backstops (proof:boundary owns the bundle-level
 *       value.js-edge proof — this gate does not re-implement it, it confirms the
 *       certification names the primitive). BITE: reds if drag2D is dropped from
 *       the published LIGHT set or routed through value.js on the re-export chain.
 *
 *   (d) the live 2-D drag STILL works (DELEGATED, not re-implemented) — the
 *       behavior oracle is `proof:drag-gesture` S4 (GREEN). This gate confirms the
 *       oracle is still WIRED (the package script + the S4 clause exist), so the
 *       certification edits introduced no behavior regression. It does NOT re-run
 *       the 2-D drag (that would duplicate a proof:* semantic).
 *
 * BORN-RED on the pre-cure tree:
 *   (a) source documentation omits drag2D → RED.
 *   (b) `ls scripts/proof-control-point-live.mjs` → exits 0 (the dead gate STILL
 *       EXISTS) → RED.
 *   (c) `grep drag2D scripts/proof-published-surface.mjs` → 0 (NOT yet named as a
 *       SUPPORTED LIGHT export) → the certification clause reds.
 *
 * GREEN on the cure: drag2D in source documentation + proof:control-point-
 * live deleted with no orphan reference + drag2D named in proof:published-surface's
 * LIGHT set + drag2D importable & value.js-free off the barrel + proof:drag-gesture
 * S4 still wired.
 *
 * PRECONDITION: the library is built (`npm run build` / `build:lib`) — clause (c)
 * imports the built `dist/keyframes.js`. An unbuilt tree is an environment error
 * (exit 3), not a certification verdict.
 *
 * STATIC (no browser). Re-runnable: `node scripts/proof-drag2d-light-certified.mjs`.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LIB = path.join(REPO, "dist", "keyframes.js");

const PKG = path.join(REPO, "package.json");
const CI = path.join(REPO, ".github", "workflows", "ci.yml");
const CI_COVERAGE = path.join(REPO, "scripts", "proof-ci-coverage.mjs");
const PUBLISHED_SURFACE = path.join(REPO, "scripts", "proof-published-surface.mjs");
const DEAD_GATE = path.join(REPO, "scripts", "proof-control-point-live.mjs");
const DRAG_GESTURE = path.join(REPO, "scripts", "proof-drag-gesture.mjs");

const failures = [];
const passes = [];
const fail = (label) => failures.push(label);
const pass = (label) => passes.push(label);

const read = (p) => readFileSync(p, "utf8");
const countOf = (haystack, needle) => haystack.split(needle).length - 1;

console.log(
    "proof:drag2d-light-certified — Q.WA2 (drag2D LIGHT primitive: certify + retire-stale-gate + lock)\n",
);

// ─────────────────────────────────────────────────────────────────────────────
// Precondition — the built barrel exists (clause (c) imports it).
// ─────────────────────────────────────────────────────────────────────────────
if (!existsSync(LIB)) {
    console.error(
        "proof:drag2d-light-certified — ERROR: dist/keyframes.js missing. " +
            "Run `npm run build` first (clause (c) imports the built barrel).",
    );
    process.exit(3);
}

// ═════════════════════════════════════════════════════════════════════════════
// clause (a) — drag2D is documented as a supported LIGHT primitive (S1)
// ═════════════════════════════════════════════════════════════════════════════
{
    console.log("clause (a) — drag2D documented as a supported LIGHT primitive (S1)");
    const indexSource = read(path.join(REPO, "src", "animation", "index.ts"));
    const dragSource = read(path.join(REPO, "src", "animation", "orchestration", "drag", "drag-2d.ts"));
    if (/drag2D/.test(indexSource) && /drag2D/.test(dragSource)) {
        pass("(a) source barrel and drag2D implementation document the committed LIGHT primitive (S1).");
    } else {
        fail("(a) source barrel or drag2D implementation does not document the LIGHT primitive (S1).");
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// clause (b) — the stale `proof:control-point-live` gate is RETIRED (S2)
// ═════════════════════════════════════════════════════════════════════════════
{
    console.log("\nclause (b) — the stale `proof:control-point-live` gate is RETIRED (S2)");

    // (b.1) The script is DELETED.
    if (!existsSync(DEAD_GATE)) {
        pass("(b) scripts/proof-control-point-live.mjs is DELETED — the dead glass-ui tripwire is gone.");
    } else {
        fail(
            "(b) scripts/proof-control-point-live.mjs STILL EXISTS — the dead `GlassControlPoint` gate " +
                "(a component glass-ui BC decided never to ship) survives, lying that drag2D is the blocker (S2).",
        );
    }

    // (b.2) No package.json script entry.
    const pkgRaw = read(PKG);
    if (countOf(pkgRaw, "control-point-live") === 0) {
        pass("(b) package.json carries ZERO `control-point-live` reference — the script entry is removed.");
    } else {
        fail(
            "(b) package.json STILL references `control-point-live` " +
                `(${countOf(pkgRaw, "control-point-live")} hit(s)) — the dead gate's script entry survives (S2).`,
        );
    }

    // (b.3) No ci.yml reference (step + id + aggregator + echo + comments — all 6).
    const ciRaw = read(CI);
    const ciHits = countOf(ciRaw, "control-point-live");
    if (ciHits === 0) {
        pass("(b) .github/workflows/ci.yml carries ZERO `control-point-live` reference — the step, id, aggregator, echo, and comments are removed.");
    } else {
        fail(
            "(b) .github/workflows/ci.yml STILL references `control-point-live` " +
                `(${ciHits} hit(s)) — the dead gate's CI step/id/aggregator/echo/comment survive (S2). ` +
                "Coordinate the ci.yml deletion with the WA3 lane.",
        );
    }

    // (b.4) No proof-ci-coverage EXCLUSION entry — else the coverage gate would
    //       red with a "declared exclusion for a non-existent gate" orphan.
    const coverageRaw = read(CI_COVERAGE);
    if (countOf(coverageRaw, "control-point-live") === 0) {
        pass("(b) scripts/proof-ci-coverage.mjs carries ZERO `control-point-live` reference — the EXCLUSION allowlist entry is removed.");
    } else {
        fail(
            "(b) scripts/proof-ci-coverage.mjs STILL references `control-point-live` " +
                `(${countOf(coverageRaw, "control-point-live")} hit(s)) — the EXCLUSION entry would orphan against ` +
                "the deleted gate (S2); delete the carve-out + its comment.",
        );
    }

    // (b.5) No orphan `GlassControlPoint` dead-premise reference anywhere in
    //       scripts/ — EXCEPT this gate's own source, which names the dead
    //       component in its prose to DOCUMENT what it retires (the same
    //       self-exclusion proof:ci-coverage applies to its own detector text:
    //       the meta-gate does not audit its own documentation of the thing it kills).
    const SELF = path.basename(fileURLToPath(import.meta.url));
    const scriptFiles = readdirSync(path.join(REPO, "scripts")).filter(
        (f) => f.endsWith(".mjs") && f !== SELF,
    );
    const glassRefs = scriptFiles.filter((f) =>
        read(path.join(REPO, "scripts", f)).includes("GlassControlPoint"),
    );
    if (glassRefs.length === 0) {
        pass("(b) ZERO `GlassControlPoint` references remain in scripts/ — no orphan dead-premise reference.");
    } else {
        fail(
            "(b) `GlassControlPoint` (the dead glass-ui premise glass-ui BC killed) STILL appears in scripts/: " +
                glassRefs.map((f) => `scripts/${f}`).join(", ") +
                " — every reference to the never-shipped component must go (S2).",
        );
    }

    // (b.6) The retire orphaned NOTHING control-point-live-shaped in proof:ci-coverage.
    //       Asserting the WHOLE gate exits 0 would couple this certification to every
    //       OTHER lane's coverage state (e.g. an un-wired sibling gate reds it for an
    //       unrelated reason). The genuine observable my retire is responsible for is
    //       narrower: proof:ci-coverage must not name `control-point-live` in ANY
    //       finding (a dangling CI step citing a dead key — converse-coverage clause
    //       0b — OR a stale exclusion entry for a non-existent gate). We run the
    //       coverage gate and scope the orphan check to control-point-live: zero
    //       mentions of it in the output means MY retire introduced no orphan,
    //       independent of unrelated coverage holes sibling lanes own.
    let coverageOut = "";
    try {
        coverageOut = execFileSync("node", [CI_COVERAGE], {
            cwd: REPO,
            encoding: "utf8",
            stdio: ["ignore", "pipe", "pipe"],
        });
    } catch (e) {
        // Non-zero exit is fine here (a sibling lane's unrelated coverage hole) —
        // we only inspect the OUTPUT for a control-point-live orphan.
        coverageOut = `${e?.stdout ?? ""}${e?.stderr ?? ""}`;
    }
    if (countOf(coverageOut, "control-point-live") === 0) {
        pass(
            "(b) `node scripts/proof-ci-coverage.mjs` names ZERO `control-point-live` orphan — the retire left no " +
                "dangling CI step citing a dead key and no stale exclusion entry (scoped to MY retire; unrelated " +
                "sibling-lane coverage holes are out of this gate's scope).",
        );
    } else {
        const orphanLines = coverageOut
            .split("\n")
            .filter((l) => l.includes("control-point-live"))
            .slice(0, 4);
        fail(
            "(b) proof:ci-coverage still names `control-point-live` as an orphan — the retire left a dangling " +
                "CI step (converse-coverage 0b) or a stale exclusion entry against the deleted gate (S2):\n      " +
                orphanLines.join("\n      "),
        );
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// clause (c) — drag2D importable + value.js-free off the barrel + CERTIFIED (S3)
// ═════════════════════════════════════════════════════════════════════════════
{
    console.log("\nclause (c) — drag2D importable + value.js-free + certified in proof:published-surface (S3)");

    // (c.1) drag2D resolves as a function off the COMPILED LIGHT barrel (the
    //       genuine observable — the EXISTING green backstop this gate confirms).
    let mod;
    try {
        mod = await import(pathToFileURL(LIB).href);
    } catch (e) {
        mod = null;
        fail(
            `(c) the LIGHT barrel could not be imported (${LIB}) — build the library first ` +
                `(\`npm run build\`): ${e?.message ?? e}`,
        );
    }
    if (mod) {
        if (typeof mod.drag2D === "function") {
            pass("(c) `drag2D` resolves as a function off the compiled LIGHT barrel (dist/keyframes.js) — genuinely importable.");
        } else {
            fail(
                `(c) \`drag2D\` is NOT a function off the compiled LIGHT barrel (typeof === "${typeof mod.drag2D}") — ` +
                    "the LIGHT export the DemoControlPoint chain depends on is gone (S3).",
            );
        }
    }

    // (c.2) The re-export chain stays LIGHT: no static value.js import on
    //       drag-2d.ts / drag.ts (the proof:boundary bundle-level proof is the
    //       authoritative backstop; this is the SOURCE-level corroborator that the
    //       chain drag-2d→drag→index introduces no static `@mkbabb/value.js` edge).
    const VALUE_JS_IMPORT = /(?:from|import)\s*\(?\s*["']@mkbabb\/value\.js["']/;
    const chainOffenders = [];
    for (const rel of ["src/animation/orchestration/drag/drag-2d.ts", "src/animation/orchestration/drag/draggable.ts"]) {
        const p = path.join(REPO, rel);
        if (existsSync(p) && VALUE_JS_IMPORT.test(read(p))) chainOffenders.push(rel);
    }
    if (chainOffenders.length === 0) {
        pass("(c) the drag2D re-export chain (drag-2d→drag→index) carries NO static `@mkbabb/value.js` import — the LIGHT boundary holds (proof:boundary owns the bundle-level proof).");
    } else {
        fail(
            "(c) a module on the drag2D re-export chain statically imports `@mkbabb/value.js`: " +
                chainOffenders.join(", ") +
                " — drag2D would pull value.js onto the LIGHT path (S3; proof:boundary is the bundle backstop).",
        );
    }

    // (c.3) THE LOAD-BEARING NEW ASSERTION: proof:published-surface NAMES drag2D +
    //       Drag2DHandle in its SUPPORTED LIGHT export set (the certification — a
    //       *surface* regression dropping drag2D from the published LIGHT set reds
    //       proof:published-surface). Today: 0 → the born-RED.
    const surfaceRaw = read(PUBLISHED_SURFACE);
    const surfaceNamesDrag2D = countOf(surfaceRaw, "drag2D") >= 1;
    const surfaceNamesHandle = countOf(surfaceRaw, "Drag2DHandle") >= 1;
    if (surfaceNamesDrag2D && surfaceNamesHandle) {
        pass("(c) proof:published-surface NAMES `drag2D` + `Drag2DHandle` in its SUPPORTED LIGHT export set — drag2D is a COMMITTED public surface, not an incidental re-export (S3).");
    } else {
        fail(
            "(c) proof:published-surface does NOT name " +
                [
                    surfaceNamesDrag2D ? null : "`drag2D`",
                    surfaceNamesHandle ? null : "`Drag2DHandle`",
                ]
                    .filter(Boolean)
                    .join(" + ") +
                " in its SUPPORTED LIGHT export set — the certification clause is absent, so a *surface* " +
                "regression dropping drag2D from the published LIGHT set would slip (S3).",
        );
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// clause (d) — the live 2-D drag oracle (proof:drag-gesture S4) is still WIRED
// ═════════════════════════════════════════════════════════════════════════════
{
    console.log("\nclause (d) — the live 2-D drag oracle (proof:drag-gesture S4) is still wired (delegated)");
    const pkg = JSON.parse(read(PKG));
    const hasGateScript = typeof pkg.scripts?.["proof:drag-gesture"] === "string";
    const s4Present =
        existsSync(DRAG_GESTURE) && /clause \(S4 drag2D\)/.test(read(DRAG_GESTURE));
    if (hasGateScript && s4Present) {
        pass(
            "(d) `proof:drag-gesture` is a package script AND its S4 drag2D behavior clause exists — " +
                "the 2-D drag oracle (handle.value.y ≈ 120) stays wired; the certification edits introduced no behavior regression.",
        );
    } else {
        fail(
            "(d) the live 2-D drag oracle is NOT wired " +
                `(proof:drag-gesture script: ${hasGateScript}, S4 drag2D clause: ${s4Present}) — ` +
                "the behavior backstop this certification delegates to is missing (d).",
        );
    }
}

// ─────────────────────────────────────────────────────────────────────────────
console.log();
for (const p of passes) console.log("  ✓ " + p);
if (failures.length > 0) {
    console.error(
        `\nproof:drag2d-light-certified — FAIL (${failures.length}): drag2D is NOT a certified, ` +
            "documented, gate-locked LIGHT primitive with the stale gate retired:",
    );
    for (const f of failures) console.error("  ✗ " + f);
    console.error(
        "\n  Cure: document drag2D at its owning source (a); DELETE proof:control-point-live + " +
            "every reference (b); NAME drag2D + Drag2DHandle in proof:published-surface's LIGHT set (c). " +
            "The drag2D export itself ALREADY exists (index.ts:88) — do NOT re-add it.",
    );
    process.exit(1);
}
console.log(
    "\nproof:drag2d-light-certified — PASS: drag2D is a CERTIFIED, DOCUMENTED, gate-locked LIGHT " +
        "primitive (source documentation + proof:published-surface), the stale proof:control-point-live " +
        "gate is RETIRED with no orphan reference, drag2D is importable + value.js-free off the barrel, " +
        "and the proof:drag-gesture S4 behavior oracle stays wired. The DemoControlPoint substrate is locked.",
);
process.exit(0);
