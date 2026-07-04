#!/usr/bin/env node
/**
 * proof:soa-composite — the Tranche P / P.W2 MEASURE-FIRST compositor-blend gate
 * + the ADOPT/KILL decision-JSON terminal (the P-inv-28 durable verdict).
 *
 * The SoA compositor fold (the validated 3.7× — `scripts/soa-composite-decision.json`,
 * bit-identical `maxErr=0`) transposes
 * `AnimationGroup.transformFramesGrouped`'s `add`/`weighted` arms from a boxed
 * per-element AoS loop (`for..in` + `Array.isArray` + per-element `isNumericUnit`
 * dispatch) into a contiguous `Float64Array` fold over a precomputed numeric-slot
 * layout. The `replace` DEFAULT arm is dispatch-free and UNTOUCHED.
 *
 * This gate enforces the MEASURE-FIRST discipline made mechanical: the per-arm
 * ratio is measured on `transformFramesGrouped`'s OWN blend path (NOT the
 * transplanted `SpringProgress.setTargets` 3.86×), the ADOPT/KILL verdict is
 * recorded durably, and the SoA path's correctness is the byte-exact `proof:blend`
 * oracle (chained in the package.json script).
 *
 * ── CLAUSES (each BITES) ─────────────────────────────────────────────────────
 *
 *   measured-first — `bench/group-composite.bench.ts` exists, benches the three
 *       arms (`replace` / `add` / `weighted`) SEPARATELY, with an `add`/`weighted`
 *       SoA-vs-boxed pair at K=8. BITE: the bench absent, or it cites the
 *       transplanted 3.86× instead of a `transformFramesGrouped`-measured ratio.
 *
 *   verdict-scope (KEYSTONE) — the decision-JSON `$comment` SCOPES the ratio to
 *       `transformFramesGrouped` (never `SpringProgress.setTargets`). The per-arm
 *       `add`/`weighted` SoA ratio at K=8 clears `floorFraction = 1.2` (ADOPT) or
 *       is recorded KILL. BITE: a decision-JSON scoping to the wrong path reds.
 *
 *   soa-path-taken — a real `add`/`weighted` `AnimationGroup` blend BUILDS a SoA
 *       plan (`_soaPlans` non-null) and the fold runs (`soaBlendLayer` invoked).
 *       BITE: the SoA path is dead (the plan never builds, the boxed path always
 *       runs) → the fold-taken probe reds.
 *
 *   bit-identical — the SoA blend output is byte-equal to an independent boxed
 *       reference over a real `replace`+`add`+`weighted`+multi-component corpus
 *       (`maxErr === 0`). The deep oracle is chained `proof:blend`; this clause is
 *       the in-gate witness. BITE: a clamp slips into `add` (`0.8+0.8` reads `1.0`
 *       not `1.6`), or a multi-component leaf is mis-strided → reds.
 *
 *   zero-alloc — the SoA fold allocates NO `Float64Array` per frame: the buffer
 *       is built once at the `_groupedKeysDirty` seam and reused. BITE: a
 *       per-frame buffer alloc → the heap-delta probe reds.
 *
 * ── PORTABILITY (the owner mandate) ──────────────────────────────────────────
 * The SoA-vs-boxed ratio is SAME-REPORT (numerator + denominator measured in the
 * same `vitest bench` pass — device-INDEPENDENT by construction, the E24 gold
 * standard). No absolute `floorHz` is a HARD predicate. The bit-identical +
 * zero-alloc clauses are DETERMINISTIC (byte-equality + an alloc count, not
 * wall-clock — HARD everywhere). When P.W1's `scripts/lib/portable-perf.mjs`
 * `ratioGate` lands, this gate's inline same-report ratio routes through it; the
 * verdict math is identical.
 *
 * Mirrors `proof:spring-vector`'s spawn/parse + durable-verdict shape; exits 1
 * until the bench resolves a `transformFramesGrouped`-scoped verdict.
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
const SUITE = "bench/group-composite.bench.ts";
const GROUP_SRC = "src/animation/group/group.ts";
const decisionPath = join(root, "scripts", "soa-composite-decision.json");

// The ADOPT threshold the P.W2 charter names: the SoA fold must run >= 1.2× the
// boxed blend at K=8 to ADOPT; below it, KILL (the boxed arms ship as-is).
const K = 8;
const FLOOR_FRACTION = 1.2;

// The K-rung ladder (Q.WF2 S3 / the B1-kf-soa witness gap): the bench measures
// the SoA-vs-boxed ratio at K∈{3,8,12} children. The original P.W2 verdict
// recorded ONLY K=8, leaving the K-scaling under-witnessed in the durable
// `soa-composite-decision.json`. The `k-ladder-monotone` clause records ALL
// THREE rungs and asserts the ratio is K-MONOTONE (the SoA advantage grows, or
// at least does not shrink, with child count) — a SAME-REPORT comparison
// (numerator + denominator + all three rungs in ONE bench pass), device-
// independent by construction (no absolute floorHz).
const K_LADDER = [3, 8, 12];

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

console.log(
    "proof:soa-composite — P.W2 (the SoA compositor fold, MEASURE-FIRST + ADOPT/KILL)",
);

// ── Clause: the bench suite exists + benches the three arms separately ────────
if (!existsSync(join(root, SUITE))) {
    console.error(`proof:soa-composite — FAIL: the bench suite ${SUITE} is absent`);
    process.exit(1);
}
{
    const src = readFileSync(join(root, SUITE), "utf8");
    const hasReplace = /replace/i.test(src);
    const hasAddBoxed = /add boxed/i.test(src) && /add SoA/i.test(src);
    const hasWeightedBoxed =
        /weighted boxed/i.test(src) && /weighted SoA/i.test(src);
    if (!hasReplace || !hasAddBoxed || !hasWeightedBoxed) {
        fail(
            "measured-first",
            `${SUITE} must bench the THREE arms separately with an add/weighted ` +
                `SoA-vs-boxed pair (replace=${hasReplace}, add pair=${hasAddBoxed}, ` +
                `weighted pair=${hasWeightedBoxed}).`,
        );
    } else {
        ok(
            "measured-first",
            `${SUITE} benches replace + add (SoA/boxed) + weighted (SoA/boxed) separately`,
        );
    }
    // The transplanted-number guard: the bench MUST NOT cite the 3.86× as its
    // justification (it measures SpringProgress.setTargets, a DIFFERENT path).
    if (/3\.86/.test(src)) {
        fail(
            "measured-first",
            `${SUITE} cites the transplanted 3.86× (SpringProgress.setTargets) — the ` +
                `ratio must be measured on transformFramesGrouped's OWN path.`,
        );
    }
}

// ── Run the bench, compute the K=8 add/weighted SoA-vs-boxed ratio ────────────
let verdict = null;
let ratioAdd = NaN;
let ratioWeighted = NaN;
{
    const tmp = mkdtempSync(join(tmpdir(), "kf-soa-composite-"));
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
            const find = (re) => benches.find((b) => re.test(b.name));
            const finite = (b) => b && Number.isFinite(b.hz) && b.hz > 0;

            // The per-K SoA-vs-boxed ratio for an arm — SAME-REPORT (numerator +
            // denominator from this one bench pass). Returns null on a missing /
            // non-finite rung so the caller can red `measured-first`.
            const ratioAt = (arm, k) => {
                const boxed = find(new RegExp(`${arm} boxed · K=${k}\\b`));
                const soa = find(new RegExp(`${arm} SoA · K=${k}\\b`));
                return finite(boxed) && finite(soa) ? soa.hz / boxed.hz : null;
            };

            // The full K-ladder for add + weighted (Q.WF2 S3 — the durable
            // witness the original P.W2 verdict omitted).
            const ladder = {};
            let ladderComplete = true;
            for (const k of K_LADDER) {
                const a = ratioAt("add", k);
                const w = ratioAt("weighted", k);
                if (a === null || w === null) ladderComplete = false;
                ladder[k] = { add: a, weighted: w };
            }

            const addBoxed = find(new RegExp(`add boxed · K=${K}\\b`));
            const addSoA = find(new RegExp(`add SoA · K=${K}\\b`));
            const wBoxed = find(new RegExp(`weighted boxed · K=${K}\\b`));
            const wSoA = find(new RegExp(`weighted SoA · K=${K}\\b`));
            if (![addBoxed, addSoA, wBoxed, wSoA].every(finite) || !ladderComplete) {
                fail(
                    "measured-first",
                    `the report has no finite SoA/boxed pair for add + weighted across ` +
                        `the K-ladder ${JSON.stringify(K_LADDER)} ` +
                        `(K=${K}: addBoxed=${!!addBoxed}, addSoA=${!!addSoA}, ` +
                        `wBoxed=${!!wBoxed}, wSoA=${!!wSoA}; ladderComplete=${ladderComplete}).`,
                );
            } else {
                ratioAdd = addSoA.hz / addBoxed.hz;
                ratioWeighted = wSoA.hz / wBoxed.hz;

                // ── Clause: k-ladder-monotone (Q.WF2 S3) ──────────────────────
                // The SoA advantage must NOT shrink as the child count grows:
                // ratio(K=8) >= ratio(K=3) AND ratio(K=12) >= ratio(K=8), for
                // BOTH the add and the weighted arm. A SAME-REPORT comparison
                // (all three rungs measured in this one pass) — device-
                // independent, no absolute floorHz. A small per-run epsilon
                // absorbs bench jitter at the rung boundaries (the monotone
                // SHAPE is the assertion, not exact wall-clock equality).
                const EPS = 0.15; // 15% jitter tolerance at a rung boundary
                const monoFails = [];
                for (const arm of ["add", "weighted"]) {
                    for (let i = 1; i < K_LADDER.length; i++) {
                        const lo = K_LADDER[i - 1];
                        const hi = K_LADDER[i];
                        const rLo = ladder[lo][arm];
                        const rHi = ladder[hi][arm];
                        if (rHi < rLo * (1 - EPS)) {
                            monoFails.push(
                                `${arm}: ratio(K=${hi})=${rHi.toFixed(3)}× < ` +
                                    `ratio(K=${lo})=${rLo.toFixed(3)}× (− more than ` +
                                    `${(EPS * 100).toFixed(0)}% jitter) — the SoA ` +
                                    `advantage SHRINKS with child count.`,
                            );
                        }
                    }
                }
                if (monoFails.length > 0) {
                    fail(
                        "k-ladder-monotone",
                        `the SoA-vs-boxed ratio is NOT K-monotone across ` +
                            `${JSON.stringify(K_LADDER)}:\n      ` +
                            monoFails.join("\n      "),
                    );
                } else {
                    ok(
                        "k-ladder-monotone",
                        `the SoA-vs-boxed ratio is K-monotone across ` +
                            `K∈${JSON.stringify(K_LADDER)} for add + weighted ` +
                            `(add ${K_LADDER.map((k) => ladder[k].add.toFixed(2)).join("→")}×, ` +
                            `weighted ${K_LADDER.map((k) => ladder[k].weighted.toFixed(2)).join("→")}×, ` +
                            `same-report)`,
                    );
                }
                const adopt =
                    ratioAdd >= FLOOR_FRACTION && ratioWeighted >= FLOOR_FRACTION;
                verdict = adopt ? "ADOPT" : "KILL";
                // DETERMINISTIC-WRITE (Q.WA3 S4 / the Q.W0 obligation): a normal gate
                // run must leave the tree CLEAN. The freshly-measured verdict is the
                // durable decision; we WRITE it ONLY under an explicit `KF_RECORD=1`
                // (the deliberate re-record), and otherwise COMPARE the measured
                // verdict against the COMMITTED one. The wall-clock `hz`/`ratio` +
                // the `recordedAt` timestamp vary per run (a forced dirty tree), so
                // the STABLE assertion is the ADOPT/KILL verdict — not the noisy
                // numbers. Scoped to transformFramesGrouped.
                // The durable K-ladder (Q.WF2 S3) — all three rungs recorded so
                // the K-scaling verdict is witnessed in the JSON, not just K=8.
                const kLadder = {};
                for (const k of K_LADDER) {
                    kLadder[k] = {
                        add: +ladder[k].add.toFixed(3),
                        weighted: +ladder[k].weighted.toFixed(3),
                    };
                }
                const record = {
                    $comment:
                        "SoA-vs-boxed blend ADOPT-or-KILL verdict (P.W2) + the K-ladder " +
                        "witness (Q.WF2 S3). The ratio is scoped to " +
                        "AnimationGroup.transformFramesGrouped's add/weighted arms ONLY " +
                        "(the isolated blend substrate, SAME-REPORT, device-independent) " +
                        "— NOT the transplanted SpringProgress.setTargets 3.86× (a " +
                        "different path). ADOPT (>=1.2× at K=8) authorizes the SoA fold; " +
                        "KILL forbids it and ships the boxed arms as-is. The default " +
                        "`replace` arm is dispatch-free and untouched. `kLadder` records " +
                        "the add/weighted ratio at K∈{3,8,12}; the gate asserts the ratio " +
                        "is K-MONOTONE (the SoA advantage does not shrink with child " +
                        "count), same-report.",
                    target:
                        "AnimationGroup.transformFramesGrouped (add/weighted arms ONLY)",
                    k: K,
                    floorFraction: FLOOR_FRACTION,
                    add: { soaOverBoxed: +ratioAdd.toFixed(3) },
                    weighted: { soaOverBoxed: +ratioWeighted.toFixed(3) },
                    kLadder,
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
                        "verdict-scope",
                        `${verdict}: add ${ratioAdd.toFixed(3)}× / weighted ` +
                            `${ratioWeighted.toFixed(3)}× vs ${FLOOR_FRACTION}× at K=${K} ` +
                            `(transformFramesGrouped-scoped, same-report). ` +
                            `RECORDED → scripts/soa-composite-decision.json (KF_RECORD=1)`,
                    );
                } else if (existsSync(decisionPath)) {
                    const committed = JSON.parse(readFileSync(decisionPath, "utf8"));
                    if (committed.verdict !== verdict) {
                        fail(
                            "verdict-scope",
                            `the MEASURED verdict (${verdict}: add ${ratioAdd.toFixed(3)}× / ` +
                                `weighted ${ratioWeighted.toFixed(3)}×) DISAGREES with the ` +
                                `committed verdict (${committed.verdict}) in ` +
                                `scripts/soa-composite-decision.json. Re-record with ` +
                                `KF_RECORD=1 if the regime genuinely changed.`,
                        );
                    } else {
                        ok(
                            "verdict-scope",
                            `${verdict}: add ${ratioAdd.toFixed(3)}× / weighted ` +
                                `${ratioWeighted.toFixed(3)}× vs ${FLOOR_FRACTION}× at K=${K} ` +
                                `(transformFramesGrouped-scoped, same-report) — MATCHES the ` +
                                `committed verdict (tree stays clean; KF_RECORD=1 to re-record)`,
                        );
                    }
                } else {
                    fail(
                        "verdict-scope",
                        `no committed scripts/soa-composite-decision.json to compare the ` +
                            `measured ${verdict} verdict against — record it once with KF_RECORD=1.`,
                    );
                }
            }
        }
    } finally {
        rmSync(tmp, { recursive: true, force: true });
    }
}

// ── Clause: the decision-JSON `$comment` scopes the ratio correctly ───────────
if (existsSync(decisionPath)) {
    const decision = JSON.parse(readFileSync(decisionPath, "utf8"));
    const comment = Array.isArray(decision.$comment)
        ? decision.$comment.join(" ")
        : String(decision.$comment ?? "");
    if (!/transformFramesGrouped/.test(comment)) {
        fail(
            "verdict-scope",
            `the decision-JSON $comment must SCOPE the ratio to transformFramesGrouped ` +
                `(it reads: "${comment.slice(0, 80)}…").`,
        );
    }
    if (/3\.86/.test(comment) && !/NOT the transplanted/i.test(comment)) {
        fail(
            "verdict-scope",
            `the decision-JSON cites the transplanted 3.86× as the verdict ratio.`,
        );
    }

    // ── Clause: k-ladder-monotone (durable record, Q.WF2 S3) ──────────────
    // The committed decision-JSON must DURABLY record the K-ladder (all three
    // rungs), not just K=8 — the B1-kf-soa witness gap. A committed JSON
    // missing `kLadder`, a rung, or an arm reds; the recorded ladder must
    // itself be K-monotone (the durable verdict matches the live assertion).
    const kLadder = decision.kLadder;
    const missingRungs = K_LADDER.filter(
        (k) =>
            !kLadder ||
            !kLadder[k] ||
            typeof kLadder[k].add !== "number" ||
            typeof kLadder[k].weighted !== "number",
    );
    if (missingRungs.length > 0) {
        fail(
            "k-ladder-monotone",
            `the committed scripts/soa-composite-decision.json does not durably ` +
                `record the full K-ladder — missing/incomplete rung(s) ` +
                `${JSON.stringify(missingRungs)} (it must carry kLadder[K].{add,weighted} ` +
                `for K∈${JSON.stringify(K_LADDER)}, Q.WF2 S3 — the original P.W2 ` +
                `verdict recorded only K=8).`,
        );
    } else {
        const EPS = 0.15;
        const durableMonoFails = [];
        for (const arm of ["add", "weighted"]) {
            for (let i = 1; i < K_LADDER.length; i++) {
                const lo = K_LADDER[i - 1];
                const hi = K_LADDER[i];
                if (kLadder[hi][arm] < kLadder[lo][arm] * (1 - EPS)) {
                    durableMonoFails.push(
                        `${arm}: kLadder[K=${hi}]=${kLadder[hi][arm]}× < ` +
                            `kLadder[K=${lo}]=${kLadder[lo][arm]}×`,
                    );
                }
            }
        }
        if (durableMonoFails.length > 0) {
            fail(
                "k-ladder-monotone",
                `the committed K-ladder is NOT K-monotone:\n      ` +
                    durableMonoFails.join("\n      "),
            );
        } else {
            ok(
                "k-ladder-monotone",
                `the committed decision-JSON durably records the K-monotone ladder ` +
                    `(K∈${JSON.stringify(K_LADDER)}: add ` +
                    `${K_LADDER.map((k) => kLadder[k].add).join("→")}×, weighted ` +
                    `${K_LADDER.map((k) => kLadder[k].weighted).join("→")}×)`,
            );
        }
    }
} else {
    fail(
        "verdict-scope",
        `the decision-JSON ${decisionPath} is absent — no transformFramesGrouped-scoped verdict exists.`,
    );
}

// ── Clause: soa-path-taken — a real blend builds the plan + folds it ──────────
// + bit-identical + zero-alloc, all measured live on the REAL group via a tsx probe.
{
    // R.W2 — `CSSKeyframesAnimation` was carved out of `engine/animation.ts` into
    // `engine/css/css-animation.ts`; the probe imports it from its new home.
    const engineUrl = pathToFileURL(
        join(root, "src", "animation", "engine", "css", "css-animation.ts"),
    ).href;
    const groupUrl = pathToFileURL(
        join(root, "src", "animation", "group", "group.ts"),
    ).href;
    const valueUrl = pathToFileURL(
        join(root, "node_modules", "@mkbabb", "value.js", "dist", "value.js"),
    ).href;
    const probe = `
import { CSSKeyframesAnimation } from ${JSON.stringify(engineUrl)};
import { AnimationGroup } from ${JSON.stringify(groupUrl)};
import { ValueUnit, lerp } from ${JSON.stringify(valueUrl)};

// Numeric scalar leaves (transform axes, opacity) + a multi-component leaf
// (margin → length-2 ValueUnit[]) — the SoA fold covers all; the multi-component
// leaf exercises the contiguous multi-slot stride. (The var()/computed boxed-
// residual path needs a DOM target and is covered by the jsdom corpus —
// test/blend.test.ts + test/iw0-cube-composite.test.ts, the chained proof:blend.)
const css = \`0% { transform: translate(0px,0px) scale(1) rotate(0deg); opacity: 1; margin: 0px 0px }
             100% { transform: translate(120px,60px) scale(1.4) rotate(45deg); opacity: 0.4; margin: 10px 20px }\`;
const mk = (c) => new CSSKeyframesAnimation({ duration: 1000 }).fromString(c);

const buildGroup = () => new AnimationGroup(
  { animation: mk(css), layer: { blendMode: "replace", zIndex: 0 } },
  { animation: mk(css), layer: { blendMode: "add", zIndex: 1 } },
  { animation: mk(css), layer: { blendMode: "weighted", zIndex: 2, weight: 0.5 } },
  { animation: mk(css), layer: { blendMode: "add", zIndex: 3 } },
);

// Independent boxed reference (cloned leaves, never shares refs with the group).
function boxedRef(entries, w) {
  const grouped = {};
  for (const { animation, layer } of entries) {
    const vals = {}; animation.interpFrames(animation.t, false, vals);
    const cloned = {};
    for (const k in vals) { const leaf = vals[k]; if (leaf === undefined) continue;
      cloned[k] = leaf.map((u) => u instanceof ValueUnit ? new ValueUnit(u.value, u.unit) : u); }
    if (layer.blendMode === "replace") { for (const k in cloned) grouped[k] = cloned[k]; }
    else { for (const k in cloned) { const inc = cloned[k]; const ex = grouped[k];
      if (Array.isArray(ex) && Array.isArray(inc)) { const n = Math.min(ex.length, inc.length);
        for (let i = 0; i < n; i++) { if (ex[i] instanceof ValueUnit && inc[i] instanceof ValueUnit) {
          if (layer.blendMode === "add") ex[i].value += inc[i].value; else ex[i].value = lerp(ex[i].value, inc[i].value, w);
        } else ex[i] = inc[i]; } } else grouped[k] = inc; } }
  }
  const out = {};
  for (const k in grouped) { const leaf = grouped[k]; if (Array.isArray(leaf)) out[k] = leaf.map((u) => u instanceof ValueUnit ? u.value : NaN); }
  return out;
}

const group = buildGroup();

// R.W2 — the \`soaBlendLayer\` private wrapper was EXCISED (the bench-monkey-patch
// anti-pattern). The fold (\`groupSoABlendLayer\`) is now called DIRECTLY at the
// blend site and writes the blended numerics into \`_compositeBuf\`. So instead of
// counting wrapper invocations, observe the FOLD's effect: zero the buffer before
// a frame and confirm the fold re-populated it with non-zero blended values — a
// dead/stubbed SoA path leaves the zeroed buffer untouched.
let soaCalls = 0;

let maxErr = 0;
for (const t of [120, 300, 500, 700, 900]) {
  for (const e of group.getEntries()) e.animation.t = t;
  // After the first warm frame the plan + buffer exist; zero the buffer so a
  // subsequent fold's write is observable.
  if (group._compositeBuf instanceof Float64Array) group._compositeBuf.fill(0);
  const out = group.transformFramesGrouped(0);
  // The fold ran iff the (previously zeroed) buffer now carries a non-zero
  // blended value.
  if (group._compositeBuf instanceof Float64Array &&
      group._compositeBuf.some((v) => v !== 0)) soaCalls++;
  const groupOut = {};
  for (const k of Object.keys(out)) { const leaf = out[k]; if (Array.isArray(leaf)) groupOut[k] = leaf.map((u) => u instanceof ValueUnit ? u.value : NaN); }
  const ref = boxedRef(group.getEntries(), 0.5);
  for (const k of Object.keys(ref)) { const a = ref[k], b = groupOut[k];
    if (!b) { maxErr = Infinity; continue; }
    for (let i = 0; i < a.length; i++) maxErr = Math.max(maxErr, Math.abs(a[i] - (b[i] ?? NaN))); }
}

// plan built (non-null) + the buffer is ONE allocation across all frames.
const planBuilt = group._soaPlans !== null && group._soaPlans.length > 0;
const buf = group._compositeBuf;
// zero per-frame alloc: drive 200 more frames; the buffer identity is unchanged.
const bufBefore = group._compositeBuf;
for (let f = 0; f < 200; f++) { for (const e of group.getEntries()) e.animation.t = (f * 5) % 1000; group.transformFramesGrouped(0); }
const bufStable = group._compositeBuf === bufBefore && bufBefore instanceof Float64Array;

console.log(JSON.stringify({ soaCalls, planBuilt, maxErr, bufStable }));
`;
    const tmp = mkdtempSync(join(tmpdir(), "kf-soa-probe-"));
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
                "soa-path-taken",
                `the SoA probe failed (status ${run.status}). Tail:\n${tail}`,
            );
        } else {
            const { soaCalls, planBuilt, maxErr, bufStable } = JSON.parse(line);
            if (!planBuilt || soaCalls === 0) {
                fail(
                    "soa-path-taken",
                    `the SoA path is DEAD (planBuilt=${planBuilt}, soaCalls=${soaCalls}) — ` +
                        `a real add/weighted blend must BUILD the plan and run soaBlendLayer.`,
                );
            } else {
                ok(
                    "soa-path-taken",
                    `the SoA plan built + soaBlendLayer ran ${soaCalls}× on the real add/weighted blend`,
                );
            }
            if (maxErr !== 0) {
                fail(
                    "bit-identical",
                    `the SoA blend DIFFERS from the boxed reference (maxErr=${maxErr}) over the ` +
                        `replace+add+weighted+multi-component corpus — a clamp/stride/weight bug.`,
                );
            } else {
                ok(
                    "bit-identical",
                    `the SoA blend is byte-equal to the boxed reference (maxErr=0) over the corpus`,
                );
            }
            if (!bufStable) {
                fail(
                    "zero-alloc",
                    `the _compositeBuf is re-allocated per frame (not reused from the ` +
                        `_groupedKeysDirty seam) — a zero-alloc regression on the draw path.`,
                );
            } else {
                ok(
                    "zero-alloc",
                    `the _compositeBuf is allocated ONCE + reused across 200+ frames (zero per-frame alloc)`,
                );
            }
        }
    } finally {
        rmSync(tmp, { recursive: true, force: true });
    }
}

// ── Clause: the source carries the SoA fold (not deleted, not stubbed) ────────
// R.W2 — `transformFramesGrouped` (the fold + plan-build call site) was carved
// out of `group.ts` into `./compositor`; the fold/plan-builder CALLS are greped
// there, the `_compositeBuf`/`_soaPlans` instance STATE stays on `group.ts`.
{
    const compositorSrc = readFileSync(
        join(root, "src/animation/group/compositor.ts"),
        "utf8",
    );
    const groupSrc = readFileSync(join(root, GROUP_SRC), "utf8");
    const hasFold =
        /groupSoABlendLayer/.test(compositorSrc) &&
        /_compositeBuf/.test(groupSrc);
    const hasPlan =
        /buildSoAPlans/.test(compositorSrc) && /_soaPlans/.test(groupSrc);
    if (!hasFold || !hasPlan) {
        fail(
            "soa-path-taken",
            `the SoA fold is missing (groupSoABlendLayer in compositor.ts + ` +
                `_compositeBuf state in group.ts=${hasFold}) or the plan builder ` +
                `(buildSoAPlans in compositor.ts + _soaPlans state in group.ts=${hasPlan}).`,
        );
    } else {
        ok(
            "soa-path-taken",
            `the SoA fold (groupSoABlendLayer in ./compositor) + the plan builder + the ` +
                `_compositeBuf/_soaPlans state on group.ts are intact`,
        );
    }
}

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:soa-composite — FAIL:\n" +
            failures.join("\n") +
            "\n\n  The compositor SoA fold must be MEASURED on transformFramesGrouped's OWN\n" +
            "  path (never the transplanted 3.86×), record an ADOPT/KILL verdict scoped\n" +
            "  to transformFramesGrouped, take the SoA path on a real blend, stay byte-\n" +
            "  identical to the boxed reference, and allocate the Float64Array buffer\n" +
            "  ONCE (zero per-frame alloc).",
    );
    process.exit(1);
}
console.log(
    `proof:soa-composite — PASS (${verdict}): the SoA compositor fold is MEASURED on\n` +
        "transformFramesGrouped's own path (same-report, device-independent), the verdict\n" +
        "is recorded scoped to transformFramesGrouped, the SoA path is taken on a real\n" +
        "add/weighted blend, the output is byte-equal to the boxed reference, and the\n" +
        "Float64Array buffer is allocated once + reused. The byte-exact value proof rides\n" +
        "the chained `proof:blend`.",
);
