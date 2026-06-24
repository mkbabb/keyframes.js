#!/usr/bin/env node
/**
 * proof:morph-orients — Q.WC4 S2, orient-along-path (the BOOKED follow-on,
 * terminalized).
 *
 * value.js's `PathGeometry.sampleAtLength(length)` already publishes the tangent
 * `angle` (radians, "for rotate: auto"), but O.W6 sampled `getPointAtT` (position
 * only) and left orient-along-path BOOKED-out with no terminal home. This gate
 * witnesses the cure: an `orient: true` morph consumes the published tangent and
 * emits a per-point `--morph-{i}-angle` channel that interpolates the from→to
 * tangent across `t` (the rotate: auto value a consumer banks a glyph by); an
 * `orient: false` (default) morph carries NO angle channel (the position-only
 * floor unchanged — the orient adds ~65 angle keys ONLY when asked).
 *
 * THE REAL OBSERVABLE (born-RED on the pre-wave tree): no `orient` option, no
 * `--morph-angle` channel — the tangent was unconsumed. The probe runs the live
 * compositor over the TS SOURCE through `tsx` (the proof:morphsvg-consume
 * precedent), exercising the IDENTICAL sampler.
 *
 * CLAUSES (each BITES):
 *   angle-channel-on  — `orient: true` emits `samples + 1` per-point
 *       `--morph-{i}-angle` keys. BITE: drop the orient sampling → no angle keys.
 *   angle-channel-off — `orient: false` (default) emits ZERO angle keys (the
 *       position-only floor — orient is OPT-IN). BITE: an always-on angle channel
 *       (the perf-deferral risk) reds.
 *   angle-interpolates — a body point's angle at mid-t sits BETWEEN its from and
 *       to tangents (the engine lerps the published tangent). BITE: a constant /
 *       degenerate angle (e.g. sampleAtLength(i/n) instead of *totalLength) reds.
 *
 * Mirrors proof:morphsvg-consume — exits 1 on any residual.
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

console.log(
    "proof:morph-orients — Q.WC4 S2 (orient-along-path, the tangent channel)",
);

const indexUrl = pathToFileURL(join(root, "src", "animation", "index.ts")).href;

const probe = `
import { loadAnimationEngine } from ${JSON.stringify(indexUrl)};

const TRIANGLE = "M 0 0 L 100 0 L 50 100 Z";
const SQUARE = "M 0 0 L 100 0 L 100 100 L 0 100 Z";

const eng = await loadAnimationEngine();
if (typeof eng.fromMorphSVG !== "function") {
  console.log(JSON.stringify({ hasFn: false }));
  process.exit(0);
}

const SAMPLES = 16;
const angleKeys = (anim) => {
  const s = new Set();
  for (const f of anim.frames) for (const k of Object.keys(f.interpVars)) s.add(k);
  return [...s].filter((k) => /^--morph-\\d+-angle$/.test(k));
};

const oriented = eng.fromMorphSVG(TRIANGLE, SQUARE, { samples: SAMPLES, orient: true, autoPlay: false });
const plain = eng.fromMorphSVG(TRIANGLE, SQUARE, { samples: SAMPLES, autoPlay: false });

const onKeys = angleKeys(oriented);
const offKeys = angleKeys(plain);

// A body point whose tangent banks across the morph.
const angleAt = (anim, t, i) =>
  anim.interpFrames(t * anim.options.duration, false)["--morph-" + i + "-angle"]?.[0]?.value;
const I = 8;
const a0 = angleAt(oriented, 0, I), a5 = angleAt(oriented, 0.5, I), a1 = angleAt(oriented, 1, I);
const interpolates =
  typeof a0 === "number" && typeof a1 === "number" && typeof a5 === "number" &&
  a0 !== a1 &&
  a5 >= Math.min(a0, a1) && a5 <= Math.max(a0, a1);

console.log(JSON.stringify({
  hasFn: true,
  samples: SAMPLES,
  onCount: onKeys.length,
  offCount: offKeys.length,
  interpolates,
  a0, a5, a1,
}));
`;

const tmp = mkdtempSync(join(tmpdir(), "kf-morph-orient-probe-"));
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
            "angle-channel-on",
            `the orient probe failed (status ${run.status}). Tail:\n${tail}`,
        );
    } else {
        const r = JSON.parse(line);
        if (!r.hasFn) {
            fail(
                "angle-channel-on",
                `loadAnimationEngine() resolved NO fromMorphSVG — the morph is unreachable.`,
            );
        } else {
            // angle-channel-on
            if (r.onCount === r.samples + 1) {
                ok(
                    "angle-channel-on",
                    `orient: true emits ${r.onCount} per-point --morph-{i}-angle keys (samples + 1), the rotate: auto tangent`,
                );
            } else {
                fail(
                    "angle-channel-on",
                    `orient: true emitted ${r.onCount} angle keys (expected ${r.samples + 1}) — the published sampleAtLength tangent is unconsumed.`,
                );
            }
            // angle-channel-off
            if (r.offCount === 0) {
                ok(
                    "angle-channel-off",
                    `orient: false (default) emits NO angle channel — the position-only floor (orient is opt-in)`,
                );
            } else {
                fail(
                    "angle-channel-off",
                    `the default (no orient) emitted ${r.offCount} angle keys — orient must be OPT-IN (the perf floor), not always-on.`,
                );
            }
            // angle-interpolates
            if (r.interpolates) {
                ok(
                    "angle-interpolates",
                    `the angle channel banks the tangent: from=${r.a0?.toFixed(3)} → mid=${r.a5?.toFixed(3)} → to=${r.a1?.toFixed(3)} (mid between, the engine lerps it)`,
                );
            } else {
                fail(
                    "angle-interpolates",
                    `the angle channel does not interpolate the tangent (from=${r.a0}, mid=${r.a5}, to=${r.a1}) — ` +
                        `a constant / degenerate angle (e.g. sampleAtLength(i/n) without the *totalLength arc-length conversion).`,
                );
            }
        }
    }
} finally {
    rmSync(tmp, { recursive: true, force: true });
}

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:morph-orients — FAIL: orient-along-path is not terminalized:\n" +
            failures.join("\n") +
            "\n\n  An `orient: true` morph must sample PathGeometry.sampleAtLength's\n" +
            "  published tangent angle (at the ARC-LENGTH totalLength * i/n, not i/n)\n" +
            "  and emit a per-point --morph-{i}-angle channel that interpolates the\n" +
            "  from→to tangent across t; `orient: false` (default) emits NONE.",
    );
    process.exit(1);
}
console.log(
    "proof:morph-orients — PASS: orient-along-path consumes the published\n" +
        "sampleAtLength tangent behind the `orient` option, emitting a per-point\n" +
        "--morph-{i}-angle channel that banks the from→to tangent across t; the\n" +
        "default stays position-only. The BOOKED follow-on is terminalized.",
);
