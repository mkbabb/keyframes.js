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
