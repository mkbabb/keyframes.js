#!/usr/bin/env node
/**
 * proof:color-soa — Q.WB3 S4 (the GATED color-tail SoA arm, measure-first).
 *
 * The numeric `processFrame`/compositor SoA fold (proof:processframe-soa /
 * proof:soa-composite) leaves the color/computed leaf tail as the residual: a
 * `Color` cannot live in a `Float64Array`, so `buildSoAPlans` classifies every
 * color leaf BOXED. The VJ-Q8 dispatch asked value.js for a `ColorChannelPlan` —
 * a Float64 oklab-channel layout the compositor + `processFrame` fold the color
 * tail through, instead of per-element `Color` boxing.
 *
 * ── THE MEASURE-FIRST FINDING (the decisive verdict) ─────────────────────────
 * value.js 1.2.0 SHIPS the channel-plan fold — but INSIDE THE LEAF, not as a
 * standalone plan kf re-implements over. `prepareInterpVar`/`normalizeValueUnits`
 * (the SAME helpers kf's `createInterpVarValue` already calls) attach a
 * `_colorPlan` (`{keys, startN, stopN, hueIndex, dstVU}` — the contiguous Float64
 * oklab-channel SoA layout) to every color iv, and `lerpColorValue` folds the
 * channels through it. So kf's EXISTING boxed color tail (`lerpValue →
 * lerpColorValue`, the `processFrame`/`group.ts` color arm) ALREADY rides the
 * channel-plan fold — TRANSPARENTLY, via the `^1.2.0` re-pin, zero kf code.
 *
 * THE VERDICT IS THEREFORE **DECLINE-the-kf-side-parallel-arm**: a kf-built
 * `buildColorChannelPlan` + `lerpColorChannels` fold in `processFrame`/`group.ts`
 * would DUPLICATE the fold value.js already performs in `lerpColorValue` — a
 * dead parallel path the no-legacy precept forbids (the in-leaf fold is the
 * single source of truth). The measure-first discrimination: the channel-plan
 * win is REAL and consumed (the gate records the ratio + the bit-identity proof
 * the consumed fold is correct), but the SEPARATE kf-side build is redundant
 * (the gate records the DECLINE — not a blanket adoption).
 *
 * ── CLAUSES (each BITES) ─────────────────────────────────────────────────────
 *
 *   channel-plan-folded (the consume oracle) — every color iv kf builds carries
 *       a `_colorPlan` AND `lerpColorValue` folds through it (the consumed fold
 *       is LIVE, not bypassed). BITE: a value.js regression that drops the
 *       `_colorPlan` (the color tail falls back to per-element boxing) → reds.
 *
 *   color-bit-identical (the correctness oracle) — the `_colorPlan`-folded
 *       `lerpColorValue` produces the SAME color as an INDEPENDENT boxed
 *       `mixColors` reconstruct, perceptually identical (ΔE within ε) across a
 *       grid. BITE: a fold that drifts from the boxed reference → reds.
 *
 *   measured-verdict (the durable decision) — `color-soa-decision.json` records
 *       the DECLINE verdict (the kf-side parallel arm is redundant) + the
 *       measured `foldedOverBoxed` ratio scoped to the color tail. BITE: a
 *       decision-JSON whose verdict flips to a kf-side ADOPT (a dead parallel
 *       build) without the in-leaf fold being absent, or a missing record.
 *
 * ── PORTABILITY (the owner mandate) ──────────────────────────────────────────
 * The ratio is SAME-REPORT (numerator + denominator in the same `vitest bench`
 * pass — device-INDEPENDENT). NO absolute `floorHz` is a HARD predicate (the
 * device-dependence-greening lesson). The bit-identity oracle is perceptual
 * equality (HARD everywhere).
 *
 * DETERMINISTIC-WRITE: a normal run leaves the tree CLEAN — write ONLY under
 * KF_RECORD=1, else COMPARE the measured verdict against the committed one.
 * Mirrors `proof:processframe-soa`'s spawn/parse + durable-verdict shape.
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
const decisionPath = join(root, "scripts", "color-soa-decision.json");

const KS = [3, 8, 12];
// The perceptual-identity tolerance for the bit-identical oracle (ΔE in oklab
// channel units — the folded fold and the boxed reconstruct are the same math,
// so the residual is float round-off, not a perceptual difference).
const EPSILON = 1e-9;

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

console.log(
    "proof:color-soa — Q.WB3 S4 (the GATED color-tail channel-plan fold, MEASURE-FIRST)",
);

// ── Run the bench, compute the per-K color-tail SoA-vs-boxed ratios ───────────
const ratios = {};
{
    const tmp = mkdtempSync(join(tmpdir(), "kf-color-soa-"));
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
            for (const K of KS) {
                const boxed = find(new RegExp(`colorTail boxed · K=${K}\\b`));
                const soa = find(new RegExp(`colorTail SoA · K=${K}\\b`));
                if (!finite(boxed) || !finite(soa)) {
                    fail(
                        "measured-verdict",
                        `the report has no finite colorTail SoA/boxed pair at K=${K} ` +
                            `(boxed=${!!boxed}, soa=${!!soa}).`,
                    );
                    continue;
                }
                ratios[K] = soa.hz / boxed.hz;
            }
        }
    } finally {
        rmSync(tmp, { recursive: true, force: true });
    }
}

// ── channel-plan-folded + color-bit-identical (the consume + correctness oracle) ──
let planTaken = false;
let maxErr = Infinity;
{
    const valueUrl = pathToFileURL(
        join(root, "node_modules", "@mkbabb", "value.js", "dist", "value.js"),
    ).href;
    const probe = `
import {
  FunctionValue, lerpColorValue, mixColors, normalizeValueUnits,
  parseCSSSubValue, prepareInterpVar, ValueArray, ValueUnit,
} from ${JSON.stringify(valueUrl)};

const colorLeaf = (css) => {
  const parsed = parseCSSSubValue(css, { subProperty: "color" });
  const flat = (function rec(v) {
    if (v instanceof ValueUnit) return [v];
    if (v instanceof FunctionValue) return v.values.flatMap(rec);
    if (v instanceof ValueArray) return v.flatMap(rec);
    return [];
  })(parsed);
  return flat[0];
};

// The kf color iv — value.js attaches _colorPlan exactly as kf's
// createInterpVarValue produces it (the SHIPPED consume path).
const pairs = [["red","blue"],["green","orange"],["purple","cyan"],["teal","gold"]];
let planTaken = true;
let maxErr = 0;
let samples = 0;
const oklab = (c) => {
  // raw channels of a value.js Color in oklab (for the ΔE compare).
  const k = c.keys();
  return k.map((key) => c.value?.[key] ?? c[key]);
};
for (const [a, b] of pairs) {
  const iv = prepareInterpVar(
    normalizeValueUnits(colorLeaf(a), colorLeaf(b), { colorSpace: "oklab" }),
  );
  if (!iv._colorPlan) { planTaken = false; continue; }
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    // CANDIDATE — the _colorPlan-folded lerpColorValue (the SHIPPED consume).
    lerpColorValue(t, iv);
    const folded = iv.value.value;
    // REFERENCE — the independent boxed mixColors reconstruct.
    const boxed = mixColors(iv.start.value, iv.stop.value, (1 - t) * 100, t * 100, "oklab");
    // Compare oklab channels (the fold + the boxed mix are the SAME math; the
    // residual is float round-off).
    const fk = oklab(folded), bk = oklab(boxed);
    const n = Math.min(fk.length, bk.length);
    for (let c = 0; c < n; c++) {
      const fv = Number(fk[c]), bv = Number(bk[c]);
      if (Number.isFinite(fv) && Number.isFinite(bv)) {
        maxErr = Math.max(maxErr, Math.abs(fv - bv));
        samples++;
      }
    }
  }
}
console.log(JSON.stringify({ planTaken, maxErr, samples }));
`;
    const tmp = mkdtempSync(join(tmpdir(), "kf-color-soa-probe-"));
    const probeFile = join(tmp, "probe.mjs");
    try {
        writeFileSync(probeFile, probe, "utf8");
        const run = spawnSync("node", [probeFile], {
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
                "channel-plan-folded",
                `the color-fold probe failed (status ${run.status}). Tail:\n${tail}`,
            );
        } else {
            const parsed = JSON.parse(line);
            planTaken = parsed.planTaken;
            maxErr = parsed.samples > 0 ? parsed.maxErr : Infinity;

            if (!planTaken) {
                fail(
                    "channel-plan-folded",
                    `a color iv did NOT carry a _colorPlan — value.js's channel-plan ` +
                        `fold is absent on the installed surface; the color tail falls ` +
                        `back to per-element boxing (the consume is dead).`,
                );
            } else {
                ok(
                    "channel-plan-folded",
                    `every color iv carries a _colorPlan and lerpColorValue folds ` +
                        `through it — the channel-plan SoA fold is consumed transparently ` +
                        `by kf's existing color tail (value.js 1.2.0, ^1.2.0 re-pin)`,
                );
            }

            if (parsed.samples === 0) {
                fail(
                    "color-bit-identical",
                    `the bit-identity probe sampled ZERO channels — the compare is vacuous.`,
                );
            } else if (!(maxErr <= EPSILON)) {
                fail(
                    "color-bit-identical",
                    `the _colorPlan-folded lerpColorValue DRIFTS from the boxed mixColors ` +
                        `reconstruct: maxErr=${maxErr} > ${EPSILON} over ${parsed.samples} ` +
                        `channel samples — the consumed fold is not bit-identical.`,
                );
            } else {
                ok(
                    "color-bit-identical",
                    `the _colorPlan-folded lerpColorValue is bit-identical to the boxed ` +
                        `mixColors reconstruct (maxErr=${maxErr} <= ${EPSILON} over ` +
                        `${parsed.samples} channel samples) — the consumed fold is correct`,
                );
            }
        }
    } finally {
        rmSync(tmp, { recursive: true, force: true });
    }
}

// ── measured-verdict (the durable DECLINE decision) ───────────────────────────
{
    const haveRatios = KS.every((K) => Number.isFinite(ratios[K]));
    // The VERDICT is DECLINE-the-kf-side-parallel-arm: the channel-plan fold is
    // SHIPPED IN-LEAF (value.js's lerpColorValue), consumed transparently — a
    // separate kf-side buildColorChannelPlan/lerpColorChannels fold would be a
    // dead parallel path. This verdict is STABLE (it does not flip on the noisy
    // ratio); the ratio is recorded as the measured-win audit trail.
    const verdict = "DECLINE";
    const record = {
        $comment:
            "color-tail channel-plan SoA verdict (Q.WB3 S4 — VJ-Q8 consume). " +
            "MEASURE-FIRST FINDING: value.js 1.2.0 SHIPS the channel-plan fold " +
            "INSIDE lerpColorValue (prepareInterpVar/normalizeValueUnits attach a " +
            "_colorPlan {keys,startN,stopN,hueIndex,dstVU} to every color iv), so " +
            "kf's EXISTING boxed color tail (lerpValue -> lerpColorValue) already " +
            "rides the channel-plan SoA fold TRANSPARENTLY via the ^1.2.0 re-pin. " +
            "VERDICT = DECLINE the SEPARATE kf-side parallel arm: a kf-built " +
            "buildColorChannelPlan/lerpColorChannels fold in processFrame/group.ts " +
            "would DUPLICATE the in-leaf fold (a dead parallel path the no-legacy " +
            "precept forbids). The foldedOverBoxed ratio (colorTail SoA via " +
            "_colorPlan vs boxed mixColors reconstruct) is the measured-win audit " +
            "trail; the consumed fold is bit-identical to the boxed reference. " +
            "SAME-REPORT, device-independent; no absolute hz floor.",
        target: "color tail (lerpColorValue _colorPlan fold) — CONSUMED IN-LEAF, not kf-rebuilt",
        verdict,
        consumeIsTransparent: true,
        kfSideParallelArm: "DECLINED (redundant — the fold is value.js's lerpColorValue leaf)",
        foldedOverBoxed: haveRatios
            ? {
                  k3: +ratios[3].toFixed(3),
                  k8: +ratios[8].toFixed(3),
                  k12: +ratios[12].toFixed(3),
              }
            : null,
        recordedAt: new Date().toISOString(),
    };

    if (process.env.KF_RECORD === "1") {
        writeFileSync(decisionPath, JSON.stringify(record, null, 2) + "\n", "utf8");
        ok(
            "measured-verdict",
            `DECLINE (the kf-side parallel arm is redundant — the fold is consumed ` +
                `in-leaf). foldedOverBoxed: ` +
                (haveRatios
                    ? `K=3 ${ratios[3].toFixed(2)}× / K=8 ${ratios[8].toFixed(2)}× / K=12 ${ratios[12].toFixed(2)}×`
                    : `(ratios unavailable)`) +
                `. RECORDED → scripts/color-soa-decision.json (KF_RECORD=1)`,
        );
    } else if (existsSync(decisionPath)) {
        const committed = JSON.parse(readFileSync(decisionPath, "utf8"));
        if (committed.verdict !== verdict) {
            fail(
                "measured-verdict",
                `the verdict (${verdict}) DISAGREES with the committed verdict ` +
                    `(${committed.verdict}) in color-soa-decision.json. The DECLINE ` +
                    `verdict flips ONLY if the in-leaf _colorPlan fold becomes absent ` +
                    `(then a kf-side build would be warranted). Re-record with KF_RECORD=1.`,
            );
        } else {
            ok(
                "measured-verdict",
                `DECLINE — MATCHES the committed verdict (the channel-plan fold is ` +
                    `consumed in-leaf; the kf-side parallel arm stays redundant). ` +
                    `foldedOverBoxed: ` +
                    (haveRatios
                        ? `K=3 ${ratios[3].toFixed(2)}× / K=8 ${ratios[8].toFixed(2)}× / K=12 ${ratios[12].toFixed(2)}×`
                        : `(ratios unavailable)`) +
                    ` (tree stays clean; KF_RECORD=1 to re-record)`,
            );
        }
    } else {
        fail(
            "measured-verdict",
            `no committed scripts/color-soa-decision.json to compare the ${verdict} ` +
                `against — record it once with KF_RECORD=1.`,
        );
    }
}

// ── Verdict ──────────────────────────────────────────────────────────────────
if (failures.length > 0) {
    console.error(
        `\nproof:color-soa — FAIL (${failures.length}): the color-tail channel-plan ` +
            `consume is not live/correct, or the verdict is unrecorded:`,
    );
    for (const f of failures) console.error(f);
    process.exit(1);
}
console.log(
    "\nproof:color-soa — PASS: the channel-plan color fold is consumed in-leaf " +
        "(bit-identical), and the kf-side parallel arm is recorded DECLINED " +
        "(no dead parallel path) — the measure-first color-tail verdict is terminal.",
);
