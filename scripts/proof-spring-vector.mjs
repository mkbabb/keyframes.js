#!/usr/bin/env node
/**
 * proof:spring-vector — L.W7 §S2-constraint, the SpringProgress VECTOR-SUGAR
 * BOOK→ADOPT-or-KILL probe (W122 second half).
 *
 * `SpringProgress` vector sugar — a `setTargets(Float64Array)` multi-spring
 * overload that ticks all K springs' `current` values into one `Float64Array`
 * output per tick, instead of K independent scalar `SpringProgress` instances —
 * rides the same lerpArray substrate as the S2 `NumericAnimation` consume. But a
 * new public surface is NOT free: it needs a measurement showing it BEATS K
 * independent scalars before any code ships.
 *
 * The §S2 constraint (L.W7.md): the vector sugar is BOOK → born-RED probe ONLY.
 * No new `SpringProgress` method ships without a bench measurement showing the
 * vector path beats K independent scalar instances at the target K. The probe is
 * this gate (`proof:spring-vector`):
 *
 *   - RED until a bench arm in `bench/spring-tick.bench.ts` shows the multi-spring
 *     VECTOR path is >= 20% FASTER than K independent scalars at K=8;
 *   - ELSE (the bench arm exists but the win is < 20%) the vector sugar is
 *     KILLED — and the gate RECORDS the kill (a `scripts/spring-vector-decision.json`
 *     verdict) and GREENs on the recorded KILL (no unproven code ships).
 *
 * This is the MEASURE-FIRST discipline made mechanical (the L.W1 workaround
 * lesson): code ships ONLY if the measurement passes the threshold; otherwise the
 * decision is a recorded KILL, never an unproven `setTargets(Float64Array)`.
 *
 * ── THE TWO TERMINAL VERDICTS ────────────────────────────────────────────────
 *   ADOPT — the bench arm exists AND vectorHz >= scalarHz * 1.2 at K=8. The gate
 *           GREENs; the `setTargets(Float64Array)` sugar is authorized to ship.
 *   KILL  — the bench arm exists AND the win is < 20%. The gate writes the KILL
 *           verdict to scripts/spring-vector-decision.json and GREENs on the
 *           recorded kill (the sugar is NOT built; the decision is durable).
 *
 * ── BORN-RED TODAY ───────────────────────────────────────────────────────────
 * RED today because (a) this script + the `proof:spring-vector` package.json key
 * did not exist before L.W7, AND (b) NO multi-spring vector bench arm exists in
 * `bench/spring-tick.bench.ts` (the probe is UNDONE — the BOOK is open). The gate
 * cannot reach a terminal verdict (ADOPT or KILL) without the measurement, so it
 * REDs: the probe must be RUN before the decision is recorded. GREEN only once a
 * vector arm exists and the gate records ADOPT (>=20%) or KILL (<20%).
 *
 * Mirrors proof:bench-runs's spawn/parse shape; exits 1 until the probe resolves.
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
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SUITE = "bench/spring-tick.bench.ts";
const decisionPath = join(root, "scripts", "spring-vector-decision.json");

// The threshold the §S2 constraint names: the vector path must be >= 20% faster
// than K independent scalars at K=8 to ADOPT; below it, KILL.
const K = 8;
const WIN_FRACTION = 1.2;

// The bench-case name CONVENTIONS the probe arm must use (the names this gate
// matches in the report). The vector arm names "vector" + "K=8"; the scalar
// baseline names "scalar" + "K=8". A probe author wires both with these markers.
const VECTOR_RE = /vector/i;
const SCALAR_RE = /scalar|independent/i;
const K8_RE = /\bK\s*=\s*8\b|\bK8\b|×\s*8\b|\b8\s*springs?\b/i;

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

// ── Clause: the bench suite exists ───────────────────────────────────────────
if (!existsSync(join(root, SUITE))) {
    console.error(`proof:spring-vector — FAIL: the bench suite ${SUITE} is absent`);
    process.exit(1);
}

// ── Clause: a multi-spring K=8 vector arm + its scalar baseline exist ────────
// Source-grep first — the probe arm must be AUTHORED (the BOOK answered) before
// the gate runs it. Absent arm = the probe is UNDONE = RED.
const suiteSrc = readFileSync(join(root, SUITE), "utf8");
const hasVectorArm = VECTOR_RE.test(suiteSrc) && K8_RE.test(suiteSrc);
const hasScalarArm = SCALAR_RE.test(suiteSrc) && K8_RE.test(suiteSrc);

if (!hasVectorArm || !hasScalarArm) {
    fail(
        "probe-undone",
        `no multi-spring K=8 vector probe arm in ${SUITE} (the BOOK is OPEN). ` +
            `The §S2 constraint requires a bench measuring the SpringProgress ` +
            `setTargets(Float64Array) vector path vs ${K} independent scalar ` +
            `SpringProgress instances at K=${K}. Until that arm exists and the gate ` +
            `records ADOPT (>=20%) or KILL (<20%), no setTargets(Float64Array) sugar ` +
            `may ship (MEASURE-FIRST). [vector arm: ${hasVectorArm}, scalar arm: ${hasScalarArm}]`,
    );
}

// ── Run the bench (only if both arms are authored) ───────────────────────────
if (hasVectorArm && hasScalarArm) {
    const tmp = mkdtempSync(join(tmpdir(), "kf-spring-vector-"));
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
            fail("run", `\`vitest bench\` exited ${run.status}. Tail:\n${tail}`);
        } else {
            const report = JSON.parse(readFileSync(outFile, "utf8"));
            const benches = (report.files ?? []).flatMap((f) =>
                (f.groups ?? []).flatMap((g) => g.benchmarks ?? []),
            );
            const vector = benches.find(
                (b) => VECTOR_RE.test(b.name) && K8_RE.test(b.name),
            );
            const scalar = benches.find(
                (b) => SCALAR_RE.test(b.name) && K8_RE.test(b.name),
            );
            if (!vector || !scalar) {
                fail(
                    "probe-undone",
                    `the report has no matching K=8 vector/scalar pair ` +
                        `(vector=${!!vector}, scalar=${!!scalar}) — name the arms with ` +
                        `"vector"/"scalar" + "K=8"`,
                );
            } else if (
                !Number.isFinite(vector.hz) ||
                !Number.isFinite(scalar.hz) ||
                scalar.hz <= 0
            ) {
                fail("run", `non-finite hz (vector=${vector.hz}, scalar=${scalar.hz})`);
            } else {
                const ratio = vector.hz / scalar.hz;
                const adopt = ratio >= WIN_FRACTION;
                const verdict = adopt ? "ADOPT" : "KILL";
                // Record the durable decision either way (the recorded verdict
                // is the gate's persistent memory — the KILL is as authoritative
                // as the ADOPT).
                writeFileSync(
                    decisionPath,
                    JSON.stringify(
                        {
                            $comment:
                                "SpringProgress vector-sugar ADOPT-or-KILL verdict (L.W7 §S2). " +
                                "vectorHz/scalarHz at K=8 vs the >=1.2 (20%) ADOPT threshold. " +
                                "ADOPT authorizes setTargets(Float64Array); KILL forbids it (the " +
                                "sugar is not built — MEASURE-FIRST, no unproven code).",
                            k: K,
                            winFraction: WIN_FRACTION,
                            vectorHz: vector.hz,
                            scalarHz: scalar.hz,
                            ratio,
                            verdict,
                            recordedAt: new Date().toISOString(),
                        },
                        null,
                        2,
                    ) + "\n",
                    "utf8",
                );
                if (adopt) {
                    ok(
                        "verdict",
                        `ADOPT: vector ${vector.hz.toFixed(1)} hz / scalar ` +
                            `${scalar.hz.toFixed(1)} hz = ${ratio.toFixed(3)}× >= ` +
                            `${WIN_FRACTION}× at K=${K} — setTargets(Float64Array) authorized. ` +
                            `Verdict → scripts/spring-vector-decision.json`,
                    );
                } else {
                    ok(
                        "verdict",
                        `KILL: vector ${vector.hz.toFixed(1)} hz / scalar ` +
                            `${scalar.hz.toFixed(1)} hz = ${ratio.toFixed(3)}× < ` +
                            `${WIN_FRACTION}× at K=${K} — vector sugar KILLED, NOT built ` +
                            `(MEASURE-FIRST). Verdict recorded → scripts/spring-vector-decision.json`,
                    );
                }
            }
        }
    } finally {
        rmSync(tmp, { recursive: true, force: true });
    }
}

console.log("");
if (failures.length > 0) {
    console.error("proof:spring-vector — FAIL:\n" + failures.join("\n"));
    process.exit(1);
}
console.log(
    "proof:spring-vector — PASS: the SpringProgress vector-sugar probe resolved to a\n" +
        "recorded verdict (ADOPT >=20% at K=8 → setTargets(Float64Array) authorized; OR\n" +
        "KILL <20% → the sugar is not built). MEASURE-FIRST: no unproven code shipped.",
);
