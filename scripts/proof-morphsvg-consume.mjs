#!/usr/bin/env node
/**
 * proof:morphsvg-consume — the O.W6 SVG path-shape morph gate (the DM-3
 * 7-tranche P-invariant-28 chronic terminal).
 *
 * `fromMorphSVG(from, to, opts?)` samples two `d` strings at `samples` uniform
 * arc-length steps over value.js's `PathGeometry`, pairs the points, and
 * interpolates the `(x, y)` pairs from the `from`-polyline (`0%`) to the
 * `to`-polyline (`100%`). The morph IS the engine lerping those per-point
 * coordinates — value.js owns the geometry (the `d`-parse + arc-length table);
 * keyframes.js owns the compositor (sample + lerp + the `from*` factory). It is
 * the THIRD member of the HEAVY `from*`-over-geometry family, beside
 * `fromMotionPath` / `fromDrawSVG`.
 *
 * This is the EXIT of the DM-3 7-tranche chronic: a kf-side BUILD-IN over a
 * PUBLISHED substrate (value.js 1.0.2+ ships `PathGeometry`/`getPointAtT`),
 * with NO sibling gate and NO 8th bare BOOK. The keystone gate is `live-morph`:
 * a real triangle→square morph whose mid-`t` sample is DISTINCT from BOTH
 * endpoints — the L.W1 S4 observable-truth discipline (a stub that exports the
 * name but returns an empty / identity / endpoint-only animation must STILL red).
 *
 * CLAUSES (each BITES):
 *
 *   primitive-exists    — `morph-svg.ts` exports `fromMorphSVG` AND `MorphSVG`.
 *       BITE: rename/drop the export → reds.
 *
 *   single-valuejs-edge — `morph-svg.ts` carries EXACTLY ONE `@mkbabb/value.js`
 *       specifier — the `PathGeometry` import (the ONE geometry edge it
 *       legitimately needs) — and NO second geometry home (no hand-rolled
 *       path-`d` parser). The BARREL re-export of the runtime symbols is
 *       FORBIDDEN (type-only). BITE: a second value.js specifier, a static
 *       value-export of fromMorphSVG/MorphSVG on the barrel, or a hand-rolled
 *       `d`-parser → reds.
 *
 *   barrel-wired        — `fromMorphSVG`/`MorphSVG` ride `loadAnimationEngine()`
 *       (the load-engine module imports `./morph-svg`, assigns them on the
 *       engine surface), and ONLY `MorphSVGOptions` is on the static barrel
 *       (type-only). BITE: drop the wiring, or static-export the value → reds.
 *
 *   live-morph (KEYSTONE) — run the REAL compositor through `loadAnimationEngine()`
 *       over two NON-TRIVIAL `d` strings of DISTINCT geometry (triangle →
 *       square), and assert BOTH: (i) frame count > 0, AND (ii) the interpolated
 *       sample at mid-`t` is DISTINCT from BOTH endpoints over the FULL sampled
 *       `(x, y)` set (NOT a single shared-endpoint vertex — the clause-4
 *       precision: the start vertex `M 0 0` is SHARED, so a single-vertex
 *       compare would false-RED a correct morph / false-GREEN a stub). The probe
 *       runs the live `PathGeometry`-backed compositor; a name-only proxy
 *       passes `primitive-exists` but a stub STILL reds here.
 *
 *   test-locks          — `test/svg/morph-svg.test.ts` carries the locking
 *       assertions (the samples-count keyframe set, the degenerate-path
 *       AnimationOptionError refusal, the mid-`t`-distinct interpolation over the
 *       FULL set, the shared-vertex hazard). BITE: delete a lock → reds.
 *
 * The behaviour proof rides the chained `vitest run test/svg/morph-svg.test.ts` (the
 * lead wires the combined `"proof:morphsvg-consume"` script — see the tail).
 *
 * NOTE on the live-morph substrate. The O.W6 spec names the BUILT `dist/`
 * barrel; this gate runs the live morph over the TS SOURCE through
 * `loadAnimationEngine()` via a `tsx` probe (the `proof:soa-composite`
 * precedent) so it stays race-safe alongside the build and exercises the
 * IDENTICAL compositor (the `PathGeometry` sampler is DOM-free — isomorphic
 * jsdom/browser/node). The runtime observable is the same: a real
 * triangle→square morph interpolating, mid-`t` distinct from both endpoints.
 *
 * Mirrors `proof:drawsvg` / `proof:motion-path`: exits 1 on any residual.
 */
import { spawnSync } from "node:child_process";
import {
    mkdtempSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

console.log(
    "proof:morphsvg-consume — O.W6 (SVG path-shape morph, the DM-3 chronic terminal)",
);

const MS = "src/animation/svg/morph-svg.ts";
const INDEX = "src/animation/index.ts";
const LOAD_ENGINE = "src/animation/load-engine.ts";
const TEST = "test/svg/morph-svg.test.ts";

const requireAll = (clause, file, anchors) => {
    const src = read(file);
    const missing = anchors.filter(({ re }) => !re.test(src));
    if (missing.length > 0) {
        fail(
            clause,
            `${file} is missing: ` +
                missing.map((m) => m.name).join("; ") +
                ` — the ${clause} contract is no longer locked.`,
        );
    } else {
        ok(clause, `${file} locks ${anchors.length} ${clause} anchor(s)`);
    }
};

// ── primitive-exists — fromMorphSVG + MorphSVG are exported ───────────────────
requireAll("primitive-exists", MS, [
    {
        name: "exports `fromMorphSVG`",
        re: /export\s+function\s+fromMorphSVG\b/,
    },
    {
        name: "exports the `MorphSVG` class",
        re: /export\s+class\s+MorphSVG\b/,
    },
]);

// ── single-valuejs-edge — EXACTLY ONE @mkbabb/value.js specifier (PathGeometry) ─
{
    const src = read(MS);
    // Count every static value.js specifier (import/from/subpath). MorphSVG
    // legitimately composes the published PathGeometry — the ONE geometry edge —
    // and must NOT re-home a path-`d` parser or pull a second value.js symbol.
    const edges = src.match(/["']@mkbabb\/value\.js(?:\/[^"']*)?["']/g) || [];
    const importsPathGeometry =
        /import\s*\{[^}]*\bPathGeometry\b[^}]*\}\s*from\s*["']@mkbabb\/value\.js["']/.test(
            src,
        );
    if (edges.length !== 1 || !importsPathGeometry) {
        fail(
            "single-valuejs-edge",
            `${MS}: ${edges.length} static @mkbabb/value.js specifier(s) (want EXACTLY 1), PathGeometry imported=${importsPathGeometry} — MorphSVG composes the published PathGeometry (the ONE geometry edge), never a second value.js symbol nor a hand-rolled path-d parser.`,
        );
    } else {
        ok(
            "single-valuejs-edge",
            `${MS} carries exactly one value.js specifier — the PathGeometry import (value.js owns the geometry; no second home)`,
        );
    }

    // No hand-rolled d-parser: MorphSVG must NOT re-home the path grammar
    // (that is value.js's job). A bespoke command tokenizer is the tell.
    const handRolledParser =
        /function\s+parsePathD\b/.test(src) ||
        /\.match\(\s*\/[^/]*[MLHVCSQTAZ][^/]*\/[gi]*\s*\)/.test(src) ||
        /const\s+commands?\s*=\s*\bd\b\.split/.test(src);
    if (handRolledParser) {
        fail(
            "single-valuejs-edge",
            `${MS} appears to re-home a path-d parser — the geometry is value.js's PathGeometry, not a second home.`,
        );
    } else {
        ok("single-valuejs-edge", `${MS} re-homes no path-d parser`);
    }

    // The BARREL re-export must be TYPE-ONLY. A static value re-export of the
    // runtime symbols would pull PathGeometry (value.js) onto the LIGHT path.
    const staticValueExportRe =
        /export\s*\{\s*(?:[^}]*\b)?(?:fromMorphSVG|MorphSVG)\b[^}]*\}\s*from\s*["']\.\/svg\/morph-svg["']/;
    const leaked =
        staticValueExportRe.test(read(INDEX)) ||
        staticValueExportRe.test(read(LOAD_ENGINE));
    if (leaked) {
        fail(
            "single-valuejs-edge",
            `a static value re-export of fromMorphSVG/MorphSVG appears on the barrel surface — it must be type-only (the runtime rides loadAnimationEngine()), else a light-only consumer pulls value.js (proof:boundary breach).`,
        );
    } else {
        ok(
            "single-valuejs-edge",
            `the barrel re-exports only the MorphSVG TYPES (no static value export of the runtime)`,
        );
    }
}

// ── barrel-wired — fromMorphSVG/MorphSVG ride loadAnimationEngine() ───────────
{
    const loadSrc = read(LOAD_ENGINE);
    const importsMorph =
        /import\([\s\S]*?["']\.\/svg\/morph-svg["']\)/.test(loadSrc);
    const assignsFactory =
        /fromMorphSVG:\s*morphMod\.fromMorphSVG/.test(loadSrc) &&
        /MorphSVG:\s*morphMod\.MorphSVG/.test(loadSrc);
    // Only the option TYPE is allowed on the static barrel.
    const typeOnlyBarrel =
        /export\s+type\s*\{[^}]*\bMorphSVGOptions\b[^}]*\}\s*from\s*["']\.\/svg\/morph-svg["']/.test(
            read(INDEX),
        );
    if (!importsMorph || !assignsFactory || !typeOnlyBarrel) {
        fail(
            "barrel-wired",
            `${LOAD_ENGINE}: dynamic import of ./morph-svg=${importsMorph}, runtime assign on the engine surface=${assignsFactory}; MorphSVGOptions type-exported on the static barrel=${typeOnlyBarrel} — MorphSVG must ride loadAnimationEngine() behind the heavy boundary, like MotionPath/DrawSVG.`,
        );
    } else {
        ok(
            "barrel-wired",
            `fromMorphSVG/MorphSVG ride loadAnimationEngine() (heavy boundary, via ${LOAD_ENGINE}); only MorphSVGOptions is on the static barrel`,
        );
    }
}

// ── live-morph (KEYSTONE) — the REAL triangle→square morph interpolates ───────
{
    const indexUrl = pathToFileURL(
        join(root, "src", "animation", "index.ts"),
    ).href;
    const probe = `
import { loadAnimationEngine } from ${JSON.stringify(indexUrl)};

const TRIANGLE = "M 0 0 L 100 0 L 50 100 Z";
const SQUARE = "M 0 0 L 100 0 L 100 100 L 0 100 Z";

const eng = await loadAnimationEngine();
if (typeof eng.fromMorphSVG !== "function") {
  console.log(JSON.stringify({ hasFn: false }));
  process.exit(0);
}

const anim = eng.fromMorphSVG(TRIANGLE, SQUARE, { samples: 64, autoPlay: false });
const frameCount = anim.frames.length;

const coordsAt = (t) => {
  const out = anim.interpFrames(t * anim.options.duration, false);
  const m = {};
  for (const k of Object.keys(out)) { const v = out[k]?.[0]?.value; if (typeof v === "number") m[k] = v; }
  return m;
};
const meanDist = (a, b) => { let s = 0, n = 0; for (const k in a) { if (k in b) { s += Math.abs(a[k] - b[k]); n++; } } return n ? s / n : 0; };

const from = coordsAt(0), mid = coordsAt(0.5), to = coordsAt(1);
const midVsFrom = meanDist(mid, from), midVsTo = meanDist(mid, to), fromVsTo = meanDist(from, to);

// The morphed-d through the class sampler — distinct from both endpoint d's.
const m = new eng.MorphSVG(TRIANGLE, SQUARE, { samples: 64, autoPlay: false });
const dMid = m.sampleD(0.5), dFrom = m.sampleD(0), dTo = m.sampleD(1);

console.log(JSON.stringify({
  hasFn: true,
  frameCount,
  midVsFrom, midVsTo, fromVsTo,
  // mid is distinct from BOTH endpoints over the FULL set AND sits between them.
  midDistinct: midVsFrom > 1 && midVsTo > 1 && midVsFrom < fromVsTo && midVsTo < fromVsTo,
  dMidDistinct: dMid !== dFrom && dMid !== dTo,
}));
`;
    const tmp = mkdtempSync(join(tmpdir(), "kf-morphsvg-probe-"));
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
                "live-morph",
                `the live morph probe failed (status ${run.status}). Tail:\n${tail}`,
            );
        } else {
            const r = JSON.parse(line);
            if (!r.hasFn) {
                fail(
                    "live-morph",
                    `loadAnimationEngine() resolved NO fromMorphSVG on the engine surface — the morph is unreachable (the born-RED cause).`,
                );
            } else if (r.frameCount <= 0) {
                fail(
                    "live-morph",
                    `the morph produced ZERO frames — a degenerate / empty animation, not a real morph.`,
                );
            } else if (!r.midDistinct) {
                fail(
                    "live-morph",
                    `the mid-t sample is NOT distinct from both endpoints over the full set ` +
                        `(midVsFrom=${r.midVsFrom?.toFixed(3)}, midVsTo=${r.midVsTo?.toFixed(3)}, fromVsTo=${r.fromVsTo?.toFixed(3)}) — ` +
                        `a stub / identity / endpoint-snap morph, NOT a real interpolation (the L.W1 S4 proxy trap).`,
                );
            } else if (!r.dMidDistinct) {
                fail(
                    "live-morph",
                    `the morphed-d at mid-t equals an endpoint `+
                        `— MorphSVG.sampleD(0.5) is not interpolating the polyline.`,
                );
            } else {
                ok(
                    "live-morph",
                    `the live triangle→square morph interpolates: frames=${r.frameCount}, ` +
                        `mid-t distinct from BOTH endpoints (midVsFrom=${r.midVsFrom.toFixed(2)}≈midVsTo=${r.midVsTo.toFixed(2)}, ` +
                        `each < fromVsTo=${r.fromVsTo.toFixed(2)} — exactly midway) + sampleD(0.5) distinct`,
                );
            }
        }
    } finally {
        rmSync(tmp, { recursive: true, force: true });
    }
}

// (The demo-scene corroborator — which asserted MorphSVGScene.vue exists + is
//  registered + consumes fromMorphSVG — was RETIRED at T.E3: the morph SCENE was
//  PRUNED (OD-1 = PRUNE). The LIBRARY MorphSVG assertions below + the test-locks
//  SURVIVE; the published fromMorphSVG factory + test/svg/morph-svg.test.ts are
//  unaffected.)

// ── test-locks — the locking assertions are present and biting ────────────────
requireAll("test-locks", TEST, [
    {
        name: "locks the samples-count keyframe set (2 * (samples + 1) coordinate keys)",
        re: /expect\(keys\.size\)\.toBe\(2 \* \(samples \+ 1\)\)/,
    },
    {
        name: "locks the degenerate-path AnimationOptionError refusal",
        re: /toThrow\([\s\n]*AnimationOptionError[\s\n,]*\)/,
    },
    {
        name: "locks the zero-arc-length refusal message",
        re: /toThrow\([\s\n]*\/zero arc-length\/i[\s\n,]*\)/,
    },
    {
        name: "locks the mid-t-distinct keystone over the FULL set (mid between endpoints)",
        re: /expect\(midVsFrom\)\.toBeLessThan\(fromVsTo\)[\s\S]*?expect\(midVsTo\)\.toBeLessThan\(fromVsTo\)/,
    },
    {
        name: "locks the clause-4 shared-vertex hazard (M 0 0 identical across from/mid/to)",
        re: /expect\(from\.get\("--morph-0-x"\)\)\.toBe\(to\.get\("--morph-0-x"\)\)/,
    },
]);

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:morphsvg-consume — FAIL: the SVG path-shape morph is not fully gated:\n" +
            failures.join("\n") +
            "\n\n  fromMorphSVG samples two `d` strings at `samples` uniform arc-length\n" +
            "  steps over value.js's PathGeometry (the ONE geometry edge), pairs the\n" +
            "  points, and interpolates the (x,y) pairs 0%→100%. It rides\n" +
            "  loadAnimationEngine() (heavy boundary; only MorphSVGOptions is on the\n" +
            "  static barrel), and a live triangle→square morph interpolates with a\n" +
            "  mid-t sample DISTINCT from both endpoints. Restore each named clause.",
    );
    process.exit(1);
}
console.log(
    "proof:morphsvg-consume — PASS: fromMorphSVG morphs an SVG path shape over\n" +
        "value.js's PathGeometry (exactly one value.js edge), rides\n" +
        "loadAnimationEngine() (only MorphSVGOptions on the static barrel), and a\n" +
        "live triangle→square morph interpolates with a mid-t sample DISTINCT from\n" +
        "both endpoints (the DM-3 7-tranche P-inv-28 chronic EXITS — a build-in,\n" +
        "no sibling gate). The behaviour proof rides `vitest run test/svg/morph-svg.test.ts`.",
);
