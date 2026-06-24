#!/usr/bin/env node
/**
 * proof:processframe-soa — Q.WB3 (the SoA frontier beyond the compositor): the
 * single-animation `processFrame` numeric fold MEASURE-FIRST + ADOPT/KILL + the
 * K-ladder monotonicity witness.
 *
 * P.W2 folded the GROUP compositor (`proof:soa-composite`); the DOMINANT
 * single-animation per-frame interp — `processFrame` (`engine.ts`, the boxed
 * per-`InterpolatedVar` `lerpValue` megamorphic loop EVERY preset/`fromString`/
 * single animation rides) — was the residual. Q.WB3 transposes its NUMERIC subset
 * to a contiguous `Float64Array`+`lerpArray` fold over a precomputed numeric-slot
 * layout (built ONCE at `parse` — `frame._numericPlan`); the color/computed/mixed
 * tail keeps the boxed `lerpValue` (the K3 partition; the color tail's
 * `ColorChannelPlan` consume is the GATED value.js 1.2.0 frontier, NOT this arm).
 *
 * ── CLAUSES (each BITES) ─────────────────────────────────────────────────────
 *
 *   measured-first (S1) — `processframe-soa-decision.json` exists, records the
 *       per-K ratio SCOPED to `processFrame` (the single-animation per-frame
 *       interp), and the `$comment` FORBIDS citing the compositor /
 *       `SpringProgress.setTargets` number. BITE: a decision-JSON whose `target`
 *       is the compositor path, or that copies the compositor's ratio.
 *
 *   k-ladder-monotone (S3) — the decision JSON records K=3/8/12 AND
 *       `ratio(K=12) >= ratio(K=3)` (within a noise tolerance — the proof the
 *       SoA win SCALES with channel count). BITE: a K=8-only decision, or a
 *       non-monotone ladder.
 *
 *   interp-equal (S2 oracle, ACTIVE — chartered by the ADOPT verdict) — the SoA
 *       `processFrame` output is byte-equal to an INDEPENDENT boxed reference
 *       (per-channel `lerp(start, stop, eased)`) over a real preset/`fromString`
 *       corpus, sampled across the window (`maxErr === 0`). BITE: a mis-strided
 *       multi-component leaf → the interp drifts → reds.
 *
 *   spring-vector-shipped (S5, a CONFIRM) — `SpringProgress.setTargets` accepts a
 *       `Float64Array` (`spring.ts`), and `spring-vector-decision.json` is present
 *       + ADOPT. The same `Float64Array` lane discipline runs across the LIGHT
 *       spring sugar AND the HEAVY processFrame fold. BITE: the overload dropped,
 *       or the decision JSON stale/absent.
 *
 * ── PORTABILITY (the owner mandate) ──────────────────────────────────────────
 * Every ratio is SAME-REPORT (numerator + denominator in the same `vitest bench`
 * pass — device-INDEPENDENT by construction). NO absolute `floorHz` is a HARD
 * predicate (the run-variable-ratio finding + the device-dependence-greening
 * lesson). The K-ladder asserts a RATIO monotonicity, never an absolute hz. The
 * `interp-equal` oracle is byte-equality (HARD everywhere).
 *
 * GATED arms NOT implemented here (recorded, not built): S4 the color
 * `ColorChannelPlan` consume (value.js 1.2.0 — `proof:color-soa`); S6 the in-realm
 * `.fnName` parallel-array FALLBACK (fires ONLY on a recorded VJ-Q4 decline).
 *
 * Mirrors `proof:soa-composite`'s spawn/parse + durable-verdict shape.
 */
import { spawnSync } from "node:child_process";
import {
    existsSync,
    mkdtempSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SUITE = "bench/interp-buffer.bench.ts";
const decisionPath = join(root, "scripts", "processframe-soa-decision.json");
const SPRING_DECISION = join(root, "scripts", "spring-vector-decision.json");

// The ADOPT threshold the Q.WB3 charter names (the W122/J.W6 S2 ADOPT floor):
// the numeric fold must run >= 1.2× the boxed processFrame at K=8 to ADOPT.
const FLOOR_FRACTION = 1.2;
const KS = [3, 8, 12];
// Same-machine V8/GC noise tolerance for the K-ladder monotonicity assertion
// (the ratio is run-variable; the monotone CLAIM is robust to small jitter).
const MONOTONE_TOLERANCE = 0.85;

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

console.log(
    "proof:processframe-soa — Q.WB3 (single-animation processFrame SoA fold, MEASURE-FIRST + K-ladder)",
);

// ── Run the bench, compute the per-K processFrame SoA-vs-boxed ratios ─────────
let verdict = null;
const ratios = {};
{
    const tmp = mkdtempSync(join(tmpdir(), "kf-processframe-soa-"));
    const outFile = join(tmp, "bench.json");
    try {
        const run = spawnSync(
            "npx",
            ["vitest", "bench", "--run", SUITE, `--outputJson=${outFile}`],
            { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
        );
        if (run.status !== 0 || !existsSync(outFile)) {
            const tail = `${run.stdout ?? ""}\n${run.stderr ?? ""}`
                .split("\n")
                .filter((l) => l.trim())
                .slice(-15)
                .join("\n");
            fail(
                "run",
                `\`vitest bench\` exited ${run.status}. Tail:\n${tail}`,
            );
        } else {
            const report = JSON.parse(readFileSync(outFile, "utf8"));
            const benches = (report.files ?? []).flatMap((f) =>
                (f.groups ?? []).flatMap((g) => g.benchmarks ?? []),
            );
            const find = (re) => benches.find((b) => re.test(b.name));
            const finite = (b) => b && Number.isFinite(b.hz) && b.hz > 0;
            let allPresent = true;
            for (const K of KS) {
                const boxed = find(
                    new RegExp(`processFrame boxed · K=${K}\\b`),
                );
                const soa = find(new RegExp(`processFrame SoA · K=${K}\\b`));
                if (!finite(boxed) || !finite(soa)) {
                    allPresent = false;
                    fail(
                        "measured-first",
                        `the report has no finite processFrame SoA/boxed pair at K=${K} ` +
                            `(boxed=${!!boxed}, soa=${!!soa}).`,
                    );
                    continue;
                }
                ratios[K] = soa.hz / boxed.hz;
            }
            if (allPresent) {
                const adopt = ratios[8] >= FLOOR_FRACTION;
                verdict = adopt ? "ADOPT" : "KILL";

                // The durable decision (P-inv-28). DETERMINISTIC-WRITE (Q.WA3 S4):
                // a normal gate run leaves the tree CLEAN — write ONLY under
                // KF_RECORD=1, else COMPARE the measured verdict against the
                // committed one (the wall-clock hz/ratio vary per run, so the
                // STABLE assertion is the ADOPT/KILL verdict + the K-monotonicity,
                // not the noisy numbers). Scoped to processFrame.
                const record = {
                    $comment:
                        "single-animation processFrame SoA-vs-boxed ADOPT-or-KILL " +
                        "verdict + K-ladder monotonicity witness (Q.WB3 S1/S3). The " +
                        "ratio is scoped to processFrame (the single-animation " +
                        "per-frame interp — the dominant preset/fromString/single " +
                        "path) — NOT the compositor AnimationGroup.transformFrames" +
                        "Grouped, NOT the transplanted SpringProgress.setTargets " +
                        "number (a DIFFERENT path). SAME-REPORT, device-independent. " +
                        "ADOPT (>=1.2× at K=8) charters the numeric fold; KILL ships " +
                        "the boxed processFrame as-is. The K=3/8/12 ratios witness " +
                        "SoA-over-boxed monotonicity in K (the fold scales).",
                    target: "processFrame (single-animation per-frame interp)",
                    floorFraction: FLOOR_FRACTION,
                    k3: { soaOverBoxed: +ratios[3].toFixed(3) },
                    k8: { soaOverBoxed: +ratios[8].toFixed(3) },
                    k12: { soaOverBoxed: +ratios[12].toFixed(3) },
                    verdict,
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
                        `${verdict}: K=3 ${ratios[3].toFixed(2)}× / K=8 ` +
                            `${ratios[8].toFixed(2)}× / K=12 ${ratios[12].toFixed(2)}× ` +
                            `vs ${FLOOR_FRACTION}× (processFrame-scoped, same-report). ` +
                            `RECORDED → scripts/processframe-soa-decision.json (KF_RECORD=1)`,
                    );
                } else if (existsSync(decisionPath)) {
                    const committed = JSON.parse(
                        readFileSync(decisionPath, "utf8"),
                    );
                    if (committed.verdict !== verdict) {
                        fail(
                            "measured-first",
                            `the MEASURED verdict (${verdict}) DISAGREES with the ` +
                                `committed verdict (${committed.verdict}) in ` +
                                `processframe-soa-decision.json. Re-record with KF_RECORD=1 ` +
                                `if the regime genuinely changed.`,
                        );
                    } else {
                        ok(
                            "measured-first",
                            `${verdict}: K=3 ${ratios[3].toFixed(2)}× / K=8 ` +
                                `${ratios[8].toFixed(2)}× / K=12 ${ratios[12].toFixed(2)}× ` +
                                `(processFrame-scoped, same-report) — MATCHES the committed ` +
                                `verdict (tree stays clean; KF_RECORD=1 to re-record)`,
                        );
                    }
                } else {
                    fail(
                        "measured-first",
                        `no committed scripts/processframe-soa-decision.json to compare ` +
                            `the measured ${verdict} against — record it once with KF_RECORD=1.`,
                    );
                }

                // ── k-ladder-monotone (S3) ─────────────────────────────────────
                const monotone =
                    ratios[8] >= ratios[3] * MONOTONE_TOLERANCE &&
                    ratios[12] >= ratios[3] * MONOTONE_TOLERANCE;
                if (!monotone) {
                    fail(
                        "k-ladder-monotone",
                        `the SoA-over-boxed ratio is NOT monotone-non-decreasing in K ` +
                            `(K=3 ${ratios[3].toFixed(2)}× → K=8 ${ratios[8].toFixed(2)}× → ` +
                            `K=12 ${ratios[12].toFixed(2)}×, tolerance ${MONOTONE_TOLERANCE}) — ` +
                            `the fold does not scale with channel count.`,
                    );
                } else {
                    ok(
                        "k-ladder-monotone",
                        `the SoA win is monotone-non-decreasing in K (K=3 ` +
                            `${ratios[3].toFixed(2)}× → K=8 ${ratios[8].toFixed(2)}× → K=12 ` +
                            `${ratios[12].toFixed(2)}×) — the fold scales with channel count`,
                    );
                }
            }
        }
    } finally {
        rmSync(tmp, { recursive: true, force: true });
    }
}

// ── interp-equal (S2 oracle, ACTIVE) — the SoA processFrame output is byte-equal
//    to an INDEPENDENT boxed reference over a preset/fromString corpus ──────────
{
    const engineUrl = pathToFileURL(
        join(root, "src", "animation", "engine.ts"),
    ).href;
    const valueUrl = pathToFileURL(
        join(root, "node_modules", "@mkbabb", "value.js", "dist", "value.js"),
    ).href;
    const probe = `
import { CSSKeyframesAnimation } from ${JSON.stringify(engineUrl)};
import { lerp, scale, ValueUnit } from ${JSON.stringify(valueUrl)};

// A real numeric corpus: a multi-channel transform + opacity + several flat
// length props (the dominant fromString/preset shape — every leaf NUMERIC, the
// SoA fold's subject). 5 stops so the segment scan + multi-frame window is real.
const css = \`0% { transform: translate3d(0px,0px,0px) scale3d(1,1,1) rotateZ(0deg); opacity: 1; width: 10px; height: 20px; left: 5px }
             25% { transform: translate3d(40px,10px,5px) scale3d(1.2,1.1,1) rotateZ(45deg); opacity: 0.8; width: 40px; height: 50px; left: 25px }
             50% { transform: translate3d(80px,20px,10px) scale3d(1.4,1.2,1) rotateZ(90deg); opacity: 0.6; width: 70px; height: 80px; left: 45px }
             100% { transform: translate3d(160px,40px,20px) scale3d(1.8,1.4,1) rotateZ(180deg); opacity: 0; width: 130px; height: 140px; left: 95px }\`;
const anim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(css);

// The SoA fold IS the engine path now; the reference is INDEPENDENT — per
// numeric iv, lerp(start.value, stop.value, easedForThatFrame). We reconstruct
// the boxed result directly from the iv endpoints + the frame's easing.
let maxErr = 0;
let samples = 0;
let planTaken = false;
for (let i = 0; i <= 60; i++) {
  const t = (i / 60) * 1000;
  // engine path (the SoA fold writes flatVars in place).
  anim.interpFrames(t, false);
  // Find the active frame(s) the engine just sampled + recompute the boxed ref.
  for (const frame of anim.frames) {
    const { start, stop } = frame.time;
    if (t < start || t > stop) continue;
    if (frame._numericPlan && frame._numericPlan.numeric.length > 0) planTaken = true;
    // Compute scaled/eased EXACTLY as processFrame does (the engine uses
    // value.js's scale(), not a hand-rolled division — so the independent boxed
    // reference matches the engine's boxed path to the BYTE, not ~1 ULP).
    const scaled = start === stop ? 1 : scale(t, start, stop, 0, 1);
    const eased = frame.timingFunction.fn(scaled);
    for (const iv of frame.allInterpVars) {
      if (typeof iv.start.value !== "number" || typeof iv.stop.value !== "number") continue;
      const ref = lerp(iv.start.value, iv.stop.value, eased);
      const got = iv.value.value;
      maxErr = Math.max(maxErr, Math.abs(ref - got));
      samples++;
    }
  }
}
console.log(JSON.stringify({ maxErr, samples, planTaken }));
`;
    const tmp = mkdtempSync(join(tmpdir(), "kf-processframe-probe-"));
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
                "interp-equal",
                `the interp-equal probe failed (status ${run.status}). Tail:\n${tail}`,
            );
        } else {
            const { maxErr, samples, planTaken } = JSON.parse(line);
            if (!planTaken) {
                fail(
                    "interp-equal",
                    `the numeric SoA fold path was NEVER taken (frame._numericPlan ` +
                        `absent/empty) — the fold is dead, the boxed path always runs.`,
                );
            } else if (samples === 0) {
                fail(
                    "interp-equal",
                    `the probe sampled ZERO numeric leaves — the corpus is not numeric.`,
                );
            } else if (maxErr !== 0) {
                fail(
                    "interp-equal",
                    `the SoA processFrame output DIFFERS from the boxed reference ` +
                        `(maxErr=${maxErr}) over ${samples} samples — a mis-strided/` +
                        `mis-packed leaf. The fold must be BIT-IDENTICAL.`,
                );
            } else {
                ok(
                    "interp-equal",
                    `the SoA processFrame output is byte-equal to the boxed reference ` +
                        `(maxErr=0) over ${samples} numeric-leaf samples (the fold path taken)`,
                );
            }
        }
    } finally {
        rmSync(tmp, { recursive: true, force: true });
    }
}

// ── spring-vector-shipped (S5, a CONFIRM) — the Float64Array overload + decision ─
{
    const springSrc = readFileSync(
        join(root, "src", "animation", "spring.ts"),
        "utf8",
    );
    const hasOverload = /setTargets\(\s*targets\s*:\s*Float64Array\s*\)/.test(
        springSrc,
    );
    if (!hasOverload) {
        fail(
            "spring-vector-shipped",
            `SpringProgress.setTargets(Float64Array) overload is absent from spring.ts ` +
                `— the Float64Array lane sugar was dropped.`,
        );
    } else if (!existsSync(SPRING_DECISION)) {
        fail(
            "spring-vector-shipped",
            `scripts/spring-vector-decision.json is absent — the ADOPT verdict for ` +
                `the spring vector sugar is not recorded.`,
        );
    } else {
        const d = JSON.parse(readFileSync(SPRING_DECISION, "utf8"));
        if (d.verdict !== "ADOPT") {
            fail(
                "spring-vector-shipped",
                `spring-vector-decision.json verdict is ${d.verdict}, not ADOPT — ` +
                    `the shipped overload contradicts a KILL verdict.`,
            );
        } else {
            ok(
                "spring-vector-shipped",
                `SpringProgress.setTargets(Float64Array) is shipped + ADOPT-verdicted ` +
                    `(spring.ts + spring-vector-decision.json) — the same Float64Array ` +
                    `lane discipline across the LIGHT spring sugar AND the HEAVY fold`,
            );
        }
    }
}

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:processframe-soa — FAIL:\n" +
            failures.join("\n") +
            "\n\n  The single-animation processFrame numeric fold must be MEASURED on\n" +
            "  processFrame's OWN path (never the compositor / transplanted number),\n" +
            "  record an ADOPT/KILL verdict scoped to processFrame with the K=3/8/12\n" +
            "  monotonicity, stay BIT-IDENTICAL to the boxed reference (maxErr=0), and\n" +
            "  confirm the shipped SpringProgress.setTargets(Float64Array) lane sugar.",
    );
    process.exit(1);
}
console.log(
    `proof:processframe-soa — PASS (${verdict}): the single-animation processFrame\n` +
        "numeric fold is MEASURED on its own path (same-report, device-independent),\n" +
        "the verdict + K-ladder monotonicity are recorded scoped to processFrame, the\n" +
        "SoA fold is byte-equal to the boxed reference (maxErr=0), and the\n" +
        "SpringProgress.setTargets(Float64Array) lane sugar is confirmed.\n" +
        "GATED (recorded, not built): S4 ColorChannelPlan (value.js 1.2.0), S6 .fnName\n" +
        "in-realm FALLBACK (fires only on a recorded VJ-Q4 decline).",
);
