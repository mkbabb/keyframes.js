#!/usr/bin/env node
/**
 * proof:soa-composite — the Tranche P / P.W2 MEASURE-FIRST compositor-blend gate
 * + the ADOPT/KILL decision-JSON terminal (the P-inv-28 durable verdict).
 *
 * The SoA compositor fold (the validated 3.7× — `scripts/group-soa-decision.json`,
 * weighted 3.66× / add 3.69×, bit-identical `maxErr=0`) transposes
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
const GROUP_SRC = "src/animation/group.ts";
const decisionPath = join(root, "scripts", "soa-composite-decision.json");

// The ADOPT threshold the P.W2 charter names: the SoA fold must run >= 1.2× the
// boxed blend at K=8 to ADOPT; below it, KILL (the boxed arms ship as-is).
const K = 8;
const FLOOR_FRACTION = 1.2;

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
            const addBoxed = find(new RegExp(`add boxed · K=${K}\\b`));
            const addSoA = find(new RegExp(`add SoA · K=${K}\\b`));
            const wBoxed = find(new RegExp(`weighted boxed · K=${K}\\b`));
            const wSoA = find(new RegExp(`weighted SoA · K=${K}\\b`));
            const finite = (b) => b && Number.isFinite(b.hz) && b.hz > 0;
            if (![addBoxed, addSoA, wBoxed, wSoA].every(finite)) {
                fail(
                    "measured-first",
                    `the report has no finite K=${K} SoA/boxed pair for add + weighted ` +
                        `(addBoxed=${!!addBoxed}, addSoA=${!!addSoA}, wBoxed=${!!wBoxed}, wSoA=${!!wSoA}).`,
                );
            } else {
                ratioAdd = addSoA.hz / addBoxed.hz;
                ratioWeighted = wSoA.hz / wBoxed.hz;
                const adopt =
                    ratioAdd >= FLOOR_FRACTION && ratioWeighted >= FLOOR_FRACTION;
                verdict = adopt ? "ADOPT" : "KILL";
                // Record the durable verdict, scoped to transformFramesGrouped.
                writeFileSync(
                    decisionPath,
                    JSON.stringify(
                        {
                            $comment:
                                "SoA-vs-boxed blend ADOPT-or-KILL verdict (P.W2). The ratio is " +
                                "scoped to AnimationGroup.transformFramesGrouped's add/weighted " +
                                "arms ONLY (the isolated blend substrate, SAME-REPORT, device-" +
                                "independent) — NOT the transplanted SpringProgress.setTargets " +
                                "3.86× (a different path). ADOPT (>=1.2× at K=8) authorizes the " +
                                "SoA fold; KILL forbids it and ships the boxed arms as-is. The " +
                                "default `replace` arm is dispatch-free and untouched.",
                            target:
                                "AnimationGroup.transformFramesGrouped (add/weighted arms ONLY)",
                            k: K,
                            floorFraction: FLOOR_FRACTION,
                            add: { soaOverBoxed: +ratioAdd.toFixed(3) },
                            weighted: { soaOverBoxed: +ratioWeighted.toFixed(3) },
                            verdict,
                            recordedAt: new Date().toISOString(),
                        },
                        null,
                        2,
                    ) + "\n",
                    "utf8",
                );
                ok(
                    "verdict-scope",
                    `${verdict}: add ${ratioAdd.toFixed(3)}× / weighted ` +
                        `${ratioWeighted.toFixed(3)}× vs ${FLOOR_FRACTION}× at K=${K} ` +
                        `(transformFramesGrouped-scoped, same-report). ` +
                        `Verdict → scripts/soa-composite-decision.json`,
                );
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
} else {
    fail(
        "verdict-scope",
        `the decision-JSON ${decisionPath} is absent — no transformFramesGrouped-scoped verdict exists.`,
    );
}

// ── Clause: soa-path-taken — a real blend builds the plan + folds it ──────────
// + bit-identical + zero-alloc, all measured live on the REAL group via a tsx probe.
{
    const engineUrl = pathToFileURL(
        join(root, "src", "animation", "engine.ts"),
    ).href;
    const groupUrl = pathToFileURL(
        join(root, "src", "animation", "group.ts"),
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
let soaCalls = 0;
const origSoA = group.soaBlendLayer.bind(group);
group.soaBlendLayer = function (p) { soaCalls++; return origSoA(p); };

let maxErr = 0;
for (const t of [120, 300, 500, 700, 900]) {
  for (const e of group.getEntries()) e.animation.t = t;
  const out = group.transformFramesGrouped(0);
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
{
    const src = readFileSync(join(root, GROUP_SRC), "utf8");
    const hasFold = /soaBlendLayer/.test(src) && /_compositeBuf/.test(src);
    const hasPlan = /buildSoAPlans/.test(src) && /_soaPlans/.test(src);
    if (!hasFold || !hasPlan) {
        fail(
            "soa-path-taken",
            `${GROUP_SRC} is missing the SoA fold (soaBlendLayer/_compositeBuf=${hasFold}) ` +
                `or the plan builder (buildSoAPlans/_soaPlans=${hasPlan}).`,
        );
    } else {
        ok(
            "soa-path-taken",
            `${GROUP_SRC} carries the SoA fold (soaBlendLayer + _compositeBuf) + the plan builder`,
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
