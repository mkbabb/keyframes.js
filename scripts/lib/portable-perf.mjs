/**
 * portable-perf.mjs — the ONE shared perf-gate helper (P.W1 S3).
 *
 * The K3 portability spine (the owner mandate — PORTABLE perf gate,
 * ratio-normalized) crystallized: every aggressive optimization's born-RED
 * gate calls `ratioGate()` or `absoluteGate()` from here; none re-derives
 * the same-report ratio math or authors a hardcoded `floorHz` HARD predicate
 * outside this module. Eliminates the per-bench-process.exit() duplication
 * (AUDIT-DIGEST.md X1 §recs).
 *
 * ── TWO EXPORTS ──────────────────────────────────────────────────────────────
 *
 *   ratioGate({ report, baselineCase, candidateCase, floorFraction,
 *               posture?, reason?, decisionPath?, meta? })
 *
 *     The same-report ratio gate: candHz / baseHz >= floorFraction.
 *     Device-INDEPENDENT BY CONSTRUCTION — numerator and denominator are
 *     measured in the SAME vitest bench pass (the K3 portability spine).
 *     Returns { adopt, ratio, baseHz, candHz, verdict } and routes the miss
 *     through `declarePosture(posture, {reason})` (the existing ci-env.mjs
 *     authority — no new posture system). If `decisionPath` is provided,
 *     writes a durable verdict JSON (the P-inv-28 terminal-home shape,
 *     matching `spring-vector-decision.json`).
 *
 *   absoluteGate({ report, candidateCase, floorHz, posture?, reason?,
 *                  marginComment, decisionPath?, meta? })
 *
 *     For the warmEngine-class microtask floor and similar cases where no
 *     meaningful same-report baseline exists. `marginComment` is MANDATORY —
 *     the caller must explain why an absolute floor is the honest choice,
 *     preventing silent adoption of device-dependent HARD predicates. Throws
 *     if `marginComment` is absent/empty. Routes the miss through the same
 *     `declarePosture` path.
 *
 * ── HOW TO USE ───────────────────────────────────────────────────────────────
 *
 *   import { ratioGate, absoluteGate } from './lib/portable-perf.mjs';
 *
 *   // Parse the vitest bench --outputJson report yourself (readFileSync + JSON.parse),
 *   // then pass the parsed object:
 *   const result = ratioGate({
 *     report,                       // the parsed vitest bench JSON
 *     baselineCase: 'boxed · K=8',  // exact bench case name
 *     candidateCase: 'SoA · K=8',   // exact bench case name
 *     floorFraction: 1.2,           // ADOPT threshold
 *     posture: 'observe-only',      // 'hard' | 'observe-only' | 'runner-calibrated'
 *     reason: 'wall-clock throughput — re-measure on-device',
 *     decisionPath: join(root, 'scripts', 'my-decision.json'),
 *     meta: { target: 'AnimationGroup.transformFramesGrouped' },
 *   });
 *   // result.adopt === true → ADOPT; false → KILL
 *
 * ── POSTURE ──────────────────────────────────────────────────────────────────
 *   hard              — red on miss everywhere (device-independent gates:
 *                       structural, correctness, coverage).
 *   observe-only      — recorded (noted) in CI, HARD on-device/local.
 *                       Requires a non-empty `reason`.
 *   runner-calibrated — threshold kept; stress size is the gate's sizing concern.
 *
 * ── NO NEW POSTURE SYSTEM ────────────────────────────────────────────────────
 * This helper imports and delegates to the existing `ci-env.mjs` authority.
 * It does NOT re-implement `IN_CI` or the posture taxonomy — a new reader
 * imports this, not ci-env.mjs directly for ratio math, and not ci-env.mjs
 * instead of this (the single seam).
 */

import { writeFileSync } from "node:fs";
import { declarePosture } from "./ci-env.mjs";

// ── Internal: extract a flat name→hz map from a vitest bench JSON report ─────
/**
 * @param {unknown} report — the parsed vitest bench `--outputJson` object
 * @returns {Map<string, number>} name→hz
 */
function hzMapFromReport(report) {
    const map = new Map();
    const files = Array.isArray(report?.files) ? report.files : [];
    for (const file of files) {
        const groups = Array.isArray(file.groups) ? file.groups : [];
        for (const group of groups) {
            const benchmarks = Array.isArray(group.benchmarks) ? group.benchmarks : [];
            for (const b of benchmarks) {
                if (b && typeof b.name === "string" && typeof b.hz === "number") {
                    map.set(b.name, b.hz);
                }
            }
        }
    }
    return map;
}

/**
 * Write a durable verdict JSON in the P-inv-28 terminal-home shape
 * (matching `spring-vector-decision.json`).
 *
 * @param {string} decisionPath
 * @param {object} payload
 */
function writeDecision(decisionPath, payload) {
    writeFileSync(
        decisionPath,
        JSON.stringify({ ...payload, recordedAt: new Date().toISOString() }, null, 2) + "\n",
        "utf8",
    );
}

// ── ratioGate ────────────────────────────────────────────────────────────────

/**
 * The same-report ratio gate (device-INDEPENDENT BY CONSTRUCTION).
 *
 * @param {object} opts
 * @param {unknown}   opts.report          — the parsed vitest bench JSON
 * @param {string}    opts.baselineCase    — exact name of the baseline bench case
 * @param {string}    opts.candidateCase   — exact name of the candidate bench case
 * @param {number}    opts.floorFraction   — ADOPT threshold (e.g. 1.2 = 20% faster)
 * @param {string}   [opts.posture]        — 'observe-only' | 'hard' | 'runner-calibrated' (default 'observe-only')
 * @param {string}   [opts.reason]         — required when posture === 'observe-only'
 * @param {string}   [opts.decisionPath]   — if set, writes the durable verdict JSON
 * @param {object}   [opts.meta]           — extra fields merged into the decision JSON
 * @param {Function} [opts.fail]           — custom fail hook (default: process.exitCode=1 + stderr)
 * @param {Function} [opts.note]           — custom note hook (default: console.log)
 * @returns {{ adopt: boolean, ratio: number, baseHz: number, candHz: number, verdict: 'ADOPT' | 'KILL' } | null}
 *   null if the report is missing the named cases (a HARD structural miss).
 */
export function ratioGate({
    report,
    baselineCase,
    candidateCase,
    floorFraction,
    posture = "observe-only",
    reason,
    decisionPath,
    meta = {},
    fail: customFail,
    note: customNote,
}) {
    const hzByName = hzMapFromReport(report);

    const { miss } = declarePosture(posture, {
        reason,
        fail: customFail ?? ((label) => { process.exitCode = 1; console.error(`  ✗ ${label}`); }),
        note: customNote ?? ((label) => console.log(`  · ${label}`)),
    });

    const baseHz = hzByName.get(baselineCase);
    const candHz = hzByName.get(candidateCase);

    // Structural miss — the named cases are absent from the report.
    // This is HARD everywhere (the report does not contain the cases at all),
    // not a device-dependent throughput miss.
    if (typeof baseHz !== "number" || !Number.isFinite(baseHz) || baseHz <= 0) {
        process.exitCode = 1;
        console.error(
            `  ✗ [ratioGate] baselineCase "${baselineCase}" is absent or non-finite ` +
                `in the report (hz=${JSON.stringify(baseHz)}) — HARD structural miss.`,
        );
        return null;
    }
    if (typeof candHz !== "number" || !Number.isFinite(candHz) || candHz <= 0) {
        process.exitCode = 1;
        console.error(
            `  ✗ [ratioGate] candidateCase "${candidateCase}" is absent or non-finite ` +
                `in the report (hz=${JSON.stringify(candHz)}) — HARD structural miss.`,
        );
        return null;
    }

    const ratio = candHz / baseHz;
    const adopt = ratio >= floorFraction;
    const verdict = adopt ? "ADOPT" : "KILL";

    if (decisionPath) {
        writeDecision(decisionPath, {
            $comment:
                `ratioGate verdict (portable-perf.mjs). candidateCase / baselineCase ratio ` +
                `at floorFraction=${floorFraction} — SAME-REPORT, device-INDEPENDENT by construction ` +
                `(numerator and denominator in the same vitest bench pass). ` +
                `ADOPT (>=${floorFraction}×) authorizes the optimization; KILL forbids it.`,
            baselineCase,
            candidateCase,
            floorFraction,
            baseHz,
            candHz,
            ratio: +ratio.toFixed(4),
            verdict,
            ...meta,
        });
    }

    if (!adopt) {
        miss(
            `[ratioGate] ${verdict}: "${candidateCase}" ran ${candHz.toFixed(1)} hz / ` +
                `"${baselineCase}" ${baseHz.toFixed(1)} hz = ${ratio.toFixed(3)}× < ${floorFraction}×`,
        );
    }

    return { adopt, ratio, baseHz, candHz, verdict };
}

// ── ratioGateValue ─────────────────────────────────────────────────────────────

/**
 * The same-report ratio gate over RAW measured values (device-INDEPENDENT BY
 * CONSTRUCTION when numerator and denominator are measured in the SAME run).
 *
 * `ratioGate` above reads a vitest bench `--outputJson` report (hz per named
 * case) — the engine hot-loop shape. `ratioGateValue` is the demo-DOM
 * extension (lane 32 T-PERF-E): the demo-perf gates measure CDP counters
 * (TaskDuration ms, LayoutCount, busy fraction) not bench hz, but the SAME
 * same-report/device-independent PRINCIPLE applies — a gate compares two
 * values from the same browser session and asserts a RATIO, never a fresh
 * absolute ms number the runner would inflate. This is the ONE home for that
 * math so no demo-perf gate hand-rolls `if (value < floor)` (the X1
 * duplication proof:portable-perf's lint-no-raw-floor forbids).
 *
 * TWO DIRECTIONS (a demo-perf clause is usually a COST budget, not throughput):
 *   direction: "atLeast" — candidate/baseline must be >= floorFraction (the
 *               ratioGate sense: a SPEEDUP; candidate is faster/better).
 *   direction: "atMost"  — candidate/baseline must be <= ceilFraction (a COST
 *               budget: e.g. TaskDuration WITH the chrome blur must not exceed
 *               the blur-neutralized baseline by more than the margin — the
 *               toggle-delta budget, T.G7). This is the demo-perf default.
 *
 * @param {object} opts
 * @param {string}    opts.label            — human label for the measured quantity
 * @param {number}    opts.baseline         — the denominator (same-run reference)
 * @param {number}    opts.candidate        — the numerator (same-run measurement)
 * @param {"atLeast"|"atMost"} [opts.direction] — default "atMost" (cost budget)
 * @param {number}   [opts.floorFraction]   — required when direction === "atLeast"
 * @param {number}   [opts.ceilFraction]    — required when direction === "atMost"
 * @param {string}   [opts.posture]         — 'observe-only' | 'hard' | 'runner-calibrated'
 * @param {string}   [opts.reason]          — required when posture === 'observe-only'
 * @param {string}   [opts.decisionPath]    — if set, writes the durable verdict JSON
 * @param {object}   [opts.meta]            — extra fields merged into the decision JSON
 * @param {Function} [opts.fail]            — custom fail hook
 * @param {Function} [opts.note]            — custom note hook
 * @returns {{ pass: boolean, ratio: number, baseline: number, candidate: number,
 *             threshold: number, direction: string } | null}
 *   null if either value is non-finite/non-positive (a HARD structural miss).
 */
export function ratioGateValue({
    label,
    baseline,
    candidate,
    direction = "atMost",
    floorFraction,
    ceilFraction,
    posture = "observe-only",
    reason,
    decisionPath,
    meta = {},
    fail: customFail,
    note: customNote,
}) {
    if (direction !== "atLeast" && direction !== "atMost") {
        throw new Error(
            `portable-perf ratioGateValue: unknown direction "${direction}" ` +
                `(expected "atLeast" | "atMost").`,
        );
    }
    const threshold = direction === "atLeast" ? floorFraction : ceilFraction;
    if (typeof threshold !== "number" || !Number.isFinite(threshold)) {
        throw new Error(
            `portable-perf ratioGateValue: direction "${direction}" requires a ` +
                `finite ${direction === "atLeast" ? "floorFraction" : "ceilFraction"}.`,
        );
    }

    const { miss } = declarePosture(posture, {
        reason,
        fail: customFail ?? ((l) => { process.exitCode = 1; console.error(`  ✗ ${l}`); }),
        note: customNote ?? ((l) => console.log(`  · ${l}`)),
    });

    // Structural miss — a value is absent/non-finite/non-positive. HARD everywhere
    // (the measurement did not happen), not a device-dependent throughput miss.
    if (typeof baseline !== "number" || !Number.isFinite(baseline) || baseline <= 0) {
        process.exitCode = 1;
        console.error(
            `  ✗ [ratioGateValue] "${label}" baseline is absent/non-finite/≤0 ` +
                `(${JSON.stringify(baseline)}) — HARD structural miss.`,
        );
        return null;
    }
    if (typeof candidate !== "number" || !Number.isFinite(candidate) || candidate < 0) {
        process.exitCode = 1;
        console.error(
            `  ✗ [ratioGateValue] "${label}" candidate is absent/non-finite/<0 ` +
                `(${JSON.stringify(candidate)}) — HARD structural miss.`,
        );
        return null;
    }

    const ratio = candidate / baseline;
    const pass =
        direction === "atLeast" ? ratio >= threshold : ratio <= threshold;

    if (decisionPath) {
        writeDecision(decisionPath, {
            $comment:
                `ratioGateValue verdict (portable-perf.mjs). "${label}": candidate / ` +
                `baseline = ratio, ${direction === "atLeast" ? ">=" : "<="} ${threshold} to PASS. ` +
                `SAME-REPORT, device-INDEPENDENT by construction (both measured in the same ` +
                `browser session). A COST budget (atMost) reds when the suspect property spikes ` +
                `the counter beyond the margin; a THROUGHPUT budget (atLeast) reds on a slowdown.`,
            label,
            direction,
            threshold,
            baseline: +baseline.toFixed(4),
            candidate: +candidate.toFixed(4),
            ratio: +ratio.toFixed(4),
            pass,
            ...meta,
        });
    }

    if (!pass) {
        miss(
            `[ratioGateValue] "${label}": candidate ${candidate.toFixed(2)} / baseline ` +
                `${baseline.toFixed(2)} = ${ratio.toFixed(3)}× ` +
                `${direction === "atLeast" ? `< floor ${threshold}×` : `> ceil ${threshold}×`}`,
        );
    }

    return { pass, ratio, baseline, candidate, threshold, direction };
}

// ── absoluteGate ─────────────────────────────────────────────────────────────

/**
 * The absolute-floor gate (for the warmEngine-class microtask floor and
 * similar cases where no same-report baseline exists).
 *
 * `marginComment` is MANDATORY — the caller must explain why an absolute floor
 * is the honest choice, preventing silent adoption of device-dependent HARD
 * predicates (the K3 portability spine discipline).
 *
 * @param {object} opts
 * @param {unknown}   opts.report          — the parsed vitest bench JSON
 * @param {string}    opts.candidateCase   — exact name of the bench case
 * @param {number}    opts.floorHz         — the absolute floor (hz)
 * @param {string}    opts.marginComment   — MANDATORY. Why an absolute floor is honest here.
 * @param {string}   [opts.posture]        — 'observe-only' | 'hard' | 'runner-calibrated' (default 'observe-only')
 * @param {string}   [opts.reason]         — required when posture === 'observe-only'
 * @param {string}   [opts.decisionPath]   — if set, writes the durable verdict JSON
 * @param {object}   [opts.meta]           — extra fields merged into the decision JSON
 * @param {Function} [opts.fail]           — custom fail hook
 * @param {Function} [opts.note]           — custom note hook
 * @returns {{ pass: boolean, hz: number, floorHz: number } | null}
 *   null if the report is missing the named case (a HARD structural miss).
 */
export function absoluteGate({
    report,
    candidateCase,
    floorHz,
    marginComment,
    posture = "observe-only",
    reason,
    decisionPath,
    meta = {},
    fail: customFail,
    note: customNote,
}) {
    // marginComment is MANDATORY — enforced at declaration time (the K3 spine).
    if (!marginComment || typeof marginComment !== "string" || !marginComment.trim()) {
        throw new Error(
            "portable-perf absoluteGate: `marginComment` is MANDATORY — explain why " +
                "an absolute floor is the honest choice here (prevents silent adoption of " +
                "device-dependent HARD predicates; K3 portability spine discipline).",
        );
    }

    const hzByName = hzMapFromReport(report);

    const { miss } = declarePosture(posture, {
        reason,
        fail: customFail ?? ((label) => { process.exitCode = 1; console.error(`  ✗ ${label}`); }),
        note: customNote ?? ((label) => console.log(`  · ${label}`)),
    });

    const hz = hzByName.get(candidateCase);

    // Structural miss — case absent from the report. HARD everywhere.
    if (typeof hz !== "number" || !Number.isFinite(hz) || hz <= 0) {
        process.exitCode = 1;
        console.error(
            `  ✗ [absoluteGate] candidateCase "${candidateCase}" is absent or non-finite ` +
                `in the report (hz=${JSON.stringify(hz)}) — HARD structural miss.`,
        );
        return null;
    }

    const pass = hz >= floorHz;

    if (decisionPath) {
        writeDecision(decisionPath, {
            $comment:
                `absoluteGate verdict (portable-perf.mjs). An absolute floorHz is used ` +
                `because: ${marginComment} This is observe-only in CI (wall-clock magnitude ` +
                `is device-dependent); the structural presence of the case is HARD everywhere.`,
            candidateCase,
            floorHz,
            hz,
            pass,
            marginComment,
            ...meta,
        });
    }

    if (!pass) {
        miss(
            `[absoluteGate] "${candidateCase}" ran ${hz.toFixed(1)} hz < floor ` +
                `${floorHz.toFixed(1)} hz (marginComment: ${marginComment})`,
        );
    }

    return { pass, hz, floorHz };
}
