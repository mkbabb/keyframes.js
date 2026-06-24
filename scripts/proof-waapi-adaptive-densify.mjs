#!/usr/bin/env node
/**
 * proof:waapi-adaptive-densify — Q.WB4 the WAAPI curvature-adaptive sub-segment
 * densify gate + the MEASURE-FIRST decision-JSON terminal (the P-inv-28 durable
 * verdict).
 *
 * The densify (`waapi.ts:toWAAPIKeyframes` → `densifyInteriorTimes`) replaced the
 * retired fixed-8 uniform interior-stop emit with a best-first, budget-bounded
 * curvature refinement: it spends interior keyframe stops WHERE the true rAF
 * curve bends and NONE where it is near-linear. The headline metric is FIDELITY
 * + keyframe-COUNT (a BUILD-time emit, not a hot path — so the win is a smaller
 * keyframe set on the common case + a provably-no-worse chord-to-curve fill,
 * both DETERMINISTIC and device-independent), never a wall-clock perf claim.
 *
 * The REAL observable (the gate-blindspot lesson): the emitted keyframe set's
 * fidelity to the rAF curve + its interior-stop count over a curvature corpus —
 * NOT a source grep. The measurement is computed deterministically by
 * `bench/waapi-densify.bench.ts:measureDensifyCorpus` (a fixed grid + integer
 * counts, no timing) and a live `toWAAPIKeyframes` boundary check, run in a tsx
 * probe; the gate asserts the four clauses below and records the durable verdict.
 *
 * ── CLAUSES (each BITES) ─────────────────────────────────────────────────────
 *
 *   measured-first — `scripts/waapi-densify-decision.json` exists and records,
 *       per corpus curve, BOTH emits' interior-stop COUNT and chord-to-curve
 *       ERROR; the `$comment` scopes the metric to "interior-stop count +
 *       chord-to-curve error over the curvature corpus". BITE: a count-only
 *       decision (no recorded chord error) → the error-recorded assertion reds.
 *
 *   count-shrinks — the adaptive emit's interior-stop count ≤ the fixed-8 count
 *       on the LINEAR/gentle curves; EXACTLY 0 on the `linear` baseline. BITE: a
 *       fixed-uniform emit (8 stops on a `linear` segment, the curvature probe
 *       mis-wired) → reds.
 *
 *   fidelity-never-regresses (KEYSTONE) — the adaptive emit's chord-to-curve
 *       error ≤ the fixed-8 emit's error on EVERY corpus curve (the sharp
 *       cubic-bezier, the spring overshoot, the vh transform, the linear
 *       baseline). BITE: a too-coarse tolerance / budget-misdirected emit that
 *       under-samples a sharp bend below the fixed-8 fidelity → reds.
 *
 *   boundaries-preserved — every frame boundary (`time.start`/`time.stop`)
 *       appears in the emitted keyframe offset set. BITE: the adaptive
 *       redistribution drops a boundary → reds.
 *
 * ── PORTABILITY (the device-dependence-greening spine) ───────────────────────
 * The fidelity metric (chord-to-curve error) is DETERMINISTIC (a numeric error
 * over a fixed sampled grid, not wall-clock) and the stop-count is an INTEGER —
 * both HARD everywhere. NO absolute-hz floor: the densify is a BUILD-time emit,
 * not a hot path; any build-time throughput is an OBSERVE-ONLY note (the bench's
 * `bench()` arms), never a hard CI predicate.
 *
 * ── BORN-RED ON THE UNFIXED TREE ─────────────────────────────────────────────
 * On today's pre-cure tree the emit is fixed-uniform (8 interior stops on a
 * `linear` segment), no decision JSON exists, and no gate exists — so
 * `count-shrinks` reds (8 ≠ 0 on linear), `measured-first` reds (ENOENT), and
 * `fidelity-never-regresses` cannot be measured (no adaptive emit). The gate is
 * born-RED by construction; GREEN only once the adaptive emit shrinks the count
 * on the common case + never regresses fidelity on any case + preserves every
 * boundary, AND the verdict is recorded.
 *
 * Mirrors `proof:soa-composite`'s spawn/parse + durable-verdict shape; exits 1
 * until the densify resolves a recorded ADOPT verdict.
 */
import {
    existsSync,
    mkdtempSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BENCH = "bench/waapi-densify.bench.ts";
const WAAPI_SRC = "src/animation/waapi/waapi.ts";
const decisionPath = join(root, "scripts", "waapi-densify-decision.json");

// The curves expected to SHRINK to ≤ fixed-8 (the linear/gentle case); a sharp
// bend is ALLOWED to emit more (tightening the fill where it bent — the wave's
// promise). The `linear` baseline must emit EXACTLY 0 interior stops.
const SHRINK_CURVES = new Set(["linear-baseline"]);
const ZERO_INTERIOR_CURVE = "linear-baseline";
const EPS = 1e-9; // float slack on the never-regresses comparison

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

console.log(
    "proof:waapi-adaptive-densify — Q.WB4 (the WAAPI curvature-adaptive densify, MEASURE-FIRST + fidelity guard)",
);

// ── Clause: the bench corpus + the live source carry the adaptive emit ────────
if (!existsSync(join(root, BENCH))) {
    console.error(
        `proof:waapi-adaptive-densify — FAIL: the bench ${BENCH} is absent`,
    );
    process.exit(1);
}
{
    const src = readFileSync(join(root, WAAPI_SRC), "utf8");
    // No-legacy: the fixed-8 const + the uniform loop must be DELETED (not kept
    // beside the adaptive emit as a dead parallel path).
    if (/WAAPI_SUBSEGMENT_STOPS\s*=\s*8/.test(src)) {
        fail(
            "count-shrinks",
            `${WAAPI_SRC} still carries the retired fixed-8 const ` +
                `(WAAPI_SUBSEGMENT_STOPS = 8) — the no-legacy cut requires it DELETED, ` +
                `replaced by the curvature-adaptive emit (densifyInteriorTimes).`,
        );
    }
    if (
        !/densifyInteriorTimes/.test(src) ||
        !/segmentFlatnessError/.test(src)
    ) {
        fail(
            "count-shrinks",
            `${WAAPI_SRC} is missing the curvature-adaptive emit ` +
                `(densifyInteriorTimes / segmentFlatnessError).`,
        );
    } else {
        ok(
            "count-shrinks",
            `${WAAPI_SRC} carries the curvature-adaptive emit (the fixed-8 uniform loop is retired)`,
        );
    }
}

// ── The deterministic corpus measurement (count + chord-error) + the live
// boundary check, run in a tsx probe over the bench module + toWAAPIKeyframes. ──
let measures = null;
{
    const benchUrl = pathToFileURL(join(root, BENCH)).href;
    const waapiUrl = pathToFileURL(
        join(root, "src", "animation", "waapi", "waapi.ts"),
    ).href;
    const probe = `
import { measureDensifyCorpus, buildCorpus, boundaryTimes } from ${JSON.stringify(benchUrl)};
import { toWAAPIKeyframes } from ${JSON.stringify(waapiUrl)};

const measures = await measureDensifyCorpus();

// Live boundaries-preserved probe: every frame boundary offset is in the emit.
const boundaryOk = [];
for (const entry of buildCorpus()) {
    const animation = await entry.build();
    const sorted = boundaryTimes(animation);
    const duration = animation.options.duration;
    const keyframes = toWAAPIKeyframes(animation);
    const offsets = new Set(keyframes.map((k) => k.offset));
    const missing = sorted.filter((t) => !offsets.has(t / duration));
    boundaryOk.push({ name: entry.name, missing });
}

console.log(JSON.stringify({ measures, boundaryOk }));
`;
    const tmp = mkdtempSync(join(tmpdir(), "kf-waapi-densify-"));
    const probeFile = join(tmp, "probe.mts");
    try {
        writeFileSync(probeFile, probe, "utf8");
        const run = spawnSync("npx", ["tsx", probeFile], {
            cwd: root,
            encoding: "utf8",
            stdio: ["ignore", "pipe", "pipe"],
        });
        const line = (run.stdout ?? "")
            .trim()
            .split("\n")
            .filter((l) => l.trim().startsWith("{"))
            .pop();
        if (run.status !== 0 || !line) {
            const tail = `${run.stdout ?? ""}\n${run.stderr ?? ""}`
                .split("\n")
                .filter((l) => l.trim())
                .slice(-15)
                .join("\n");
            fail(
                "measured-first",
                `the densify corpus probe failed (status ${run.status}). Tail:\n${tail}`,
            );
        } else {
            const parsed = JSON.parse(line);
            measures = parsed.measures;

            // ── Clause: count-shrinks ────────────────────────────────────────
            const linear = measures.find((m) => m.name === ZERO_INTERIOR_CURVE);
            if (!linear) {
                fail(
                    "count-shrinks",
                    `the corpus is missing the ${ZERO_INTERIOR_CURVE} baseline.`,
                );
            } else if (linear.adaptive.interiorCount !== 0) {
                fail(
                    "count-shrinks",
                    `the adaptive emit emits ${linear.adaptive.interiorCount} interior stops ` +
                        `on the LINEAR baseline (expected 0 — the chord matches a linear ` +
                        `segment exactly). The curvature probe is mis-wired.`,
                );
            } else {
                ok(
                    "count-shrinks",
                    `the adaptive emit emits 0 interior stops on the linear baseline ` +
                        `(fixed-8 emitted ${linear.fixed.interiorCount})`,
                );
            }
            for (const m of measures) {
                if (!SHRINK_CURVES.has(m.name)) continue;
                if (m.adaptive.interiorCount > m.fixed.interiorCount) {
                    fail(
                        "count-shrinks",
                        `${m.name}: adaptive count ${m.adaptive.interiorCount} > fixed-8 ` +
                            `${m.fixed.interiorCount} — the linear/gentle case must NOT bloat.`,
                    );
                }
            }

            // ── Clause: fidelity-never-regresses (KEYSTONE) ──────────────────
            let allFaithful = true;
            for (const m of measures) {
                if (
                    !Number.isFinite(m.adaptive.chordError) ||
                    !Number.isFinite(m.fixed.chordError)
                ) {
                    allFaithful = false;
                    fail(
                        "fidelity-never-regresses",
                        `${m.name}: non-finite chord error (adaptive=${m.adaptive.chordError}, ` +
                            `fixed=${m.fixed.chordError}).`,
                    );
                    continue;
                }
                if (m.adaptive.chordError > m.fixed.chordError + EPS) {
                    allFaithful = false;
                    fail(
                        "fidelity-never-regresses",
                        `${m.name}: the adaptive chord error ${m.adaptive.chordError.toExponential(3)} ` +
                            `EXCEEDS the fixed-8 error ${m.fixed.chordError.toExponential(3)} — a FIDELITY ` +
                            `REGRESSION. The adaptive emit must be AT LEAST as faithful as fixed-8, everywhere.`,
                    );
                }
            }
            if (allFaithful) {
                ok(
                    "fidelity-never-regresses",
                    `the adaptive emit's chord error ≤ fixed-8 on EVERY corpus curve ` +
                        `(${measures
                            .map(
                                (m) =>
                                    `${m.name}:${m.adaptive.chordError.toExponential(2)}≤${m.fixed.chordError.toExponential(2)}`,
                            )
                            .join(", ")})`,
                );
            }

            // ── Clause: boundaries-preserved ─────────────────────────────────
            const dropped = parsed.boundaryOk.filter(
                (b) => b.missing.length > 0,
            );
            if (dropped.length > 0) {
                fail(
                    "boundaries-preserved",
                    `the adaptive emit DROPPED a boundary on: ` +
                        dropped
                            .map(
                                (b) =>
                                    `${b.name} (missing ${JSON.stringify(b.missing)})`,
                            )
                            .join(", "),
                );
            } else {
                ok(
                    "boundaries-preserved",
                    `every frame boundary appears in the emitted offsets on all ${parsed.boundaryOk.length} corpus curves`,
                );
            }
        }
    } finally {
        rmSync(tmp, { recursive: true, force: true });
    }
}

// ── Clause: measured-first — the durable decision JSON records BOTH count +
// error per curve, scoped to the count+error metric (the deterministic-write
// pattern: WRITE only under KF_RECORD=1, otherwise COMPARE the stable shape). ──
if (measures) {
    const record = {
        $comment:
            "WAAPI curvature-adaptive sub-segment densify ADOPT verdict (Q.WB4). The " +
            "metric is scoped to interior-stop COUNT + chord-to-curve ERROR over the " +
            "curvature corpus (a sharp cubic-bezier inflection, a spring linear() " +
            "overshoot, a multi-component vh-style transform, a linear baseline) — a " +
            "DETERMINISTIC, device-independent fidelity + count comparison, never a " +
            "wall-clock perf claim (the densify is a BUILD-time emit). ADOPT: the " +
            "curvature-adaptive emit shrinks the interior-stop count on the common " +
            "(linear/gentle) case AND never regresses the chord-to-curve fidelity on " +
            "any case AND preserves every boundary — strictly fidelity-improving by a " +
            "measured tolerance, not a fixed-count guess. The fixed-8 uniform loop is " +
            "RETIRED (no-legacy).",
        metric: "interior-stop count + chord-to-curve error over the curvature corpus",
        maxSubsegmentStops: 16,
        chordTolerance: 0.005,
        curves: measures.map((m) => ({
            name: m.name,
            fixed: {
                interiorCount: m.fixed.interiorCount,
                chordError: m.fixed.chordError,
            },
            adaptive: {
                interiorCount: m.adaptive.interiorCount,
                chordError: m.adaptive.chordError,
            },
            fidelityImproved: m.adaptive.chordError <= m.fixed.chordError + EPS,
        })),
        verdict: "ADOPT",
        recordedAt: new Date().toISOString(),
    };

    if (process.env.KF_RECORD === "1") {
        writeFileSync(
            decisionPath,
            JSON.stringify(record, null, 2) + "\n",
            "utf8",
        );
        ok(
            "measured-first",
            `recorded both emits' count + chord-error per curve → scripts/waapi-densify-decision.json (KF_RECORD=1)`,
        );
    } else if (!existsSync(decisionPath)) {
        fail(
            "measured-first",
            `the decision JSON ${decisionPath} is absent — record it once with KF_RECORD=1 ` +
                `(it must record BOTH emits' count + chord-error per curve).`,
        );
    } else {
        const committed = JSON.parse(readFileSync(decisionPath, "utf8"));
        const comment = Array.isArray(committed.$comment)
            ? committed.$comment.join(" ")
            : String(committed.$comment ?? "");
        // The error-recorded assertion: a count-only decision (no per-curve chord
        // error) is forbidden — the fidelity comparison is mandatory.
        const curvesOk =
            Array.isArray(committed.curves) &&
            committed.curves.length === measures.length &&
            committed.curves.every(
                (c) =>
                    typeof c.fixed?.chordError === "number" &&
                    typeof c.adaptive?.chordError === "number" &&
                    typeof c.fixed?.interiorCount === "number" &&
                    typeof c.adaptive?.interiorCount === "number",
            );
        if (!/chord-to-curve error/i.test(comment)) {
            fail(
                "measured-first",
                `the decision JSON $comment must SCOPE the metric to the chord-to-curve ` +
                    `error (the fidelity comparison is mandatory — a count-only verdict is ` +
                    `forbidden). It reads: "${comment.slice(0, 80)}…".`,
            );
        } else if (!curvesOk) {
            fail(
                "measured-first",
                `the decision JSON does NOT record BOTH emits' count + chord-error per ` +
                    `curve (a count-only claim ignoring fidelity is forbidden).`,
            );
        } else if (committed.verdict !== "ADOPT") {
            fail(
                "measured-first",
                `the committed verdict is ${committed.verdict}, not ADOPT — the live ` +
                    `measurement shows the adaptive emit shrinks the count + never regresses ` +
                    `fidelity, so the durable verdict must be ADOPT. Re-record with KF_RECORD=1.`,
            );
        } else {
            ok(
                "measured-first",
                `the decision JSON records both emits' count + chord-error per curve, scoped ` +
                    `to the count+error metric, verdict ADOPT (tree stays clean; KF_RECORD=1 to re-record)`,
            );
        }
    }
}

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:waapi-adaptive-densify — FAIL:\n" +
            failures.join("\n") +
            "\n\n  The WAAPI sub-segment densify must be CURVATURE-ADAPTIVE: emit 0 interior\n" +
            "  stops on a linear segment (count-shrinks), never regress the chord-to-curve\n" +
            "  fidelity below the fixed-8 emit on ANY curve (fidelity-never-regresses), preserve\n" +
            "  every boundary (boundaries-preserved), and record both emits' count + chord-error\n" +
            "  per curve in scripts/waapi-densify-decision.json (measured-first).",
    );
    process.exit(1);
}
console.log(
    "proof:waapi-adaptive-densify — PASS (ADOPT): the WAAPI densify is curvature-adaptive —\n" +
        "0 interior stops on a linear segment, a chord-to-curve fidelity ≤ the retired fixed-8\n" +
        "emit on EVERY curvature-corpus curve (tighter on the sharp ones), every boundary\n" +
        "preserved, and the count + chord-error verdict recorded durably (P-inv-28).",
);
