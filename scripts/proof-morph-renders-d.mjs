#!/usr/bin/env node
/**
 * proof:morph-renders-d — Q.WC4 S1, the on-DOM RENDER CONTRACT O.W6 left as VAPOR.
 *
 * O.W6's `fromMorphSVG` docstring promised that a `target`-bearing morph writes
 * the interpolated polyline `d` onto the target each frame so an author can
 * render the morphing shape. But the impl only called `setTargets(target)` —
 * which makes the engine write the ~130 invisible numeric `--morph-{i}-x/y`
 * coordinate props and NEVER a renderable `d`. The documented author channel
 * (`--morph-d` / `d:`) did not exist: a target-bearing morph painted nothing
 * renderable as a shape. This gate witnesses the CURE: a target-bearing morph,
 * driven ONE apply frame, writes BOTH `--morph-d` AND `d:` onto the target's
 * style, whose value reassembles to a `d` distinct from BOTH endpoint polylines.
 *
 * THE REAL OBSERVABLE (born-RED on the pre-wave tree): NO `--morph-d` / `d:`
 * write existed (`grep morph-d morph-svg.ts` → only the docstring). A stub that
 * exports the name but writes only the numeric props (or nothing) STILL reds
 * here — the gate drives the LIVE per-frame renderer through the engine's apply
 * path and reads the actual style writes.
 *
 * The probe runs the live compositor over the TS SOURCE through a `tsx` import
 * (the `proof:morphsvg-consume` precedent) so it is race-safe alongside the
 * build and exercises the IDENTICAL renderer. The morph renderer writes via a
 * structural `{ style: { setProperty } }` target (DOM-free, isomorphic jsdom/
 * browser/node) — so the node gate reads the SAME writes the demo `<path>` gets.
 *
 * CLAUSES (each BITES):
 *   d-written  — a target-bearing morph driven one frame writes `--morph-d`
 *       (a valid `M … L …` polyline) AND `d:` (`path("…")`). BITE: drop the
 *       render write (revert to a bare setTargets) → no --morph-d → reds.
 *   d-distinct — the written `--morph-d` at mid-t is DISTINCT from both endpoint
 *       polylines AND equals `MorphSVG.sampleD(0.5)` (a real morphing shape,
 *       not a static / endpoint-only paint). BITE: a renderer that writes an
 *       endpoint `d` (no interpolation) reds.
 *   waapi-ineligible — the custom renderer flips usesDefaultRenderer false, so
 *       the morph is WAAPI-ineligible by construction (always the rAF path where
 *       the renderer fires). BITE: a target-bearing morph that kept the default
 *       renderer (would never write --morph-d) reds.
 *   attr-at-rest (T.A14) — a target-bearing morph built with autoPlay:false and
 *       NO frame seeded (no interpFrames call) still carries a NON-EMPTY, parseable
 *       `from` path on the target's `d` ATTRIBUTE (the browser's bbox area > 0 at
 *       rest — the subject paints with NO live engine write). BITE: revert the
 *       build-time setAttribute("d", from) seed → the attribute is absent → the
 *       at-rest subject blanks (shot-17 invisible-at-rest class) → reds. NEVER
 *       green by re-seeding a frame — the point is rest-WITHOUT-a-write.
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

console.log("proof:morph-renders-d — Q.WC4 S1 (the on-DOM render contract)");

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

// A structural style-write target — captures the per-frame renderer's writes
// AND the T.A14 build-time attribute seed (setAttribute/getAttribute).
const writes = {};
const attrs = {};
const target = {
  style: { setProperty(k, v) { writes[k] = v; } },
  setAttribute(name, value) { attrs[name] = value; },
  getAttribute(name) { return name in attrs ? attrs[name] : null; },
};

// T.A14 attr-at-rest — a SEPARATE target built with NO frame seed: the d
// ATTRIBUTE must carry the from-shape at rest, with the per-frame CSS channel
// untouched (the shot-17 invisible-at-rest cure — rest paints WITHOUT a write).
const restWrites = {};
const restAttrs = {};
const restTarget = {
  style: { setProperty(k, v) { restWrites[k] = v; } },
  setAttribute(name, value) { restAttrs[name] = value; },
  getAttribute(name) { return name in restAttrs ? restAttrs[name] : null; },
};
eng.fromMorphSVG(TRIANGLE, SQUARE, { samples: 24, autoPlay: false, target: restTarget });
const restD = restTarget.getAttribute("d");
const restAttrValid = typeof restD === "string" && /^M [\\d.-]+ [\\d.-]+/.test(restD);
const restNoLiveWrite =
  restWrites["--morph-d"] === undefined && restWrites["d"] === undefined;

const anim = eng.fromMorphSVG(TRIANGLE, SQUARE, { samples: 24, autoPlay: false, target });
// Drive ONE apply frame at mid-t — the engine invokes the custom renderer.
anim.interpFrames(0.5 * anim.options.duration, true);

// The morphed-d through the manual reader — the render value oracle.
const m = new eng.MorphSVG(TRIANGLE, SQUARE, { samples: 24, autoPlay: false });
const dFrom = m.sampleD(0), dMid = m.sampleD(0.5), dTo = m.sampleD(1);

// Is the frame transform the default DOM-style renderer? (false ⇒ WAAPI-ineligible)
const frameTransform = anim.frames[0]?.transform;
const usesDefault = anim.usesDefaultRenderer(frameTransform);

const morphD = writes["--morph-d"];
const dProp = writes["d"];

console.log(JSON.stringify({
  hasFn: true,
  morphDWritten: typeof morphD === "string" && /^M [\\d.-]+ [\\d.-]+ L /.test(morphD),
  dPropWritten: typeof dProp === "string" && /^path\\("M /.test(dProp),
  morphDEqualsSampleD: morphD === dMid,
  morphDDistinct: morphD !== dFrom && morphD !== dTo,
  waapiIneligible: usesDefault === false,
  morphDHead: typeof morphD === "string" ? morphD.slice(0, 36) : null,
  restAttrValid,
  restNoLiveWrite,
  restDHead: typeof restD === "string" ? restD.slice(0, 36) : null,
}));
`;

const tmp = mkdtempSync(join(tmpdir(), "kf-morph-d-probe-"));
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
            "d-written",
            `the render-contract probe failed (status ${run.status}). Tail:\n${tail}`,
        );
    } else {
        const r = JSON.parse(line);
        if (!r.hasFn) {
            fail(
                "d-written",
                `loadAnimationEngine() resolved NO fromMorphSVG — the morph is unreachable.`,
            );
        } else {
            // d-written
            if (r.morphDWritten && r.dPropWritten) {
                ok(
                    "d-written",
                    `a target-bearing morph wrote --morph-d ("${r.morphDHead}…") + d: path("…") on the apply frame`,
                );
            } else {
                fail(
                    "d-written",
                    `the per-frame render write is MISSING (--morph-d valid=${r.morphDWritten}, d:=${r.dPropWritten}) — ` +
                        `a target-bearing morph must write a renderable d each frame, not the ~130 invisible numeric props (the O.W6 VAPOR).`,
                );
            }
            // d-distinct
            if (r.morphDEqualsSampleD && r.morphDDistinct) {
                ok(
                    "d-distinct",
                    `the written --morph-d at mid-t equals MorphSVG.sampleD(0.5) AND is distinct from both endpoints (a real morphing shape)`,
                );
            } else {
                fail(
                    "d-distinct",
                    `the written --morph-d is not the interpolated mid-t shape (==sampleD(0.5):${r.morphDEqualsSampleD}, distinct-from-endpoints:${r.morphDDistinct}) — ` +
                        `a static / endpoint-only paint, not a morph.`,
                );
            }
            // waapi-ineligible
            if (r.waapiIneligible) {
                ok(
                    "waapi-ineligible",
                    `the custom renderer flips usesDefaultRenderer false — the morph is WAAPI-ineligible by construction (the rAF path where the renderer fires)`,
                );
            } else {
                fail(
                    "waapi-ineligible",
                    `a target-bearing morph kept the DEFAULT DOM-style renderer (usesDefaultRenderer true) — it would delegate to WAAPI and NEVER write --morph-d.`,
                );
            }
            // attr-at-rest (T.A14)
            if (r.restAttrValid && r.restNoLiveWrite) {
                ok(
                    "attr-at-rest",
                    `a target-bearing morph seeds the from-shape on the target's d ATTRIBUTE at build ("${r.restDHead}…") with the per-frame CSS channel untouched at rest — the subject paints WITHOUT a live engine write`,
                );
            } else {
                fail(
                    "attr-at-rest",
                    `the at-rest attribute seed is MISSING (attr-valid=${r.restAttrValid}, no-live-write=${r.restNoLiveWrite}) — ` +
                        `a target-bearing morph must write the from-path to the target's d ATTRIBUTE at BUILD time so it paints at rest with no frame write (the shot-17 invisible-at-rest failure class). NEVER green by seeding a frame.`,
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
        "proof:morph-renders-d — FAIL: the on-DOM render contract is not wired:\n" +
            failures.join("\n") +
            "\n\n  A target-bearing fromMorphSVG must reassemble the interpolated polyline\n" +
            "  into a `d` string each frame and write it onto the target as BOTH the\n" +
            "  `d:` CSS property (Chromium/Safari render path() in d) AND the\n" +
            "  --morph-d custom property (the cross-browser author channel +\n" +
            "  Firefox-lags fallback), via the engine's per-frame renderer seam.",
    );
    process.exit(1);
}
console.log(
    "proof:morph-renders-d — PASS: a target-bearing morph writes --morph-d + d:\n" +
        "each frame (a `d` distinct from both endpoints, == MorphSVG.sampleD), via a\n" +
        "custom renderer that makes the morph WAAPI-ineligible by construction. The\n" +
        "O.W6 render-contract VAPOR is dissolved — the documented channel is REAL.",
);
