#!/usr/bin/env node
/**
 * proof:orbital-rotate3d — G.W18 (the orbital rotate3d OUTPUT collapse).
 *
 * The orbital rotation source of truth is a gimbal-free quaternion accumulated by
 * left-multiplying delta quaternions (the SOTA trackball idiom). The OUTPUT leg
 * round-tripped it: DECOMPOSE the quaternion into three Euler angles, re-apply as
 * `rotateX·rotateY·rotateZ` — the quaternion anti-pattern (retrieve→modify→
 * re-apply) that re-introduces the very gimbal-lock the accumulation leg avoids.
 * G.W18 collapses the OUTPUT to its native form: ONE `rotate3d(ax, ay, az, deg)`
 * read straight off the quaternion via `quat.getAxisAngle` — loss-free + pole-free
 * by construction. The Euler v-model is PRESERVED (O-1a) for the slider/share
 * surface, so `quaternionToEulerDegrees` STAYS (its one caller, syncRotationToModel,
 * still needs the Euler triple).
 *
 * A SOURCE-GREP gate in the `proof:blend` / `proof:motion-path` style: each clause
 * reds on the exact regression it forbids — verified, not asserted. The VALUE proof
 * (the form lock + the gimbal-pole parity, the axis-angle round-trip) lives in the
 * chained `vitest run test/orbital-rotate3d.test.ts` (the lead wires the combined
 * `"proof:orbital-rotate3d"` script — see the note at the tail).
 *
 * CLAUSES (each BITES):
 *
 *   render-rotate3d  — containerStyle's transform emits `rotate3d(${...}` read off
 *       `quat.getAxisAngle`. BITE: revert the render to `rotateX/Y/Z` → reds.
 *
 *   no-euler-render  — the transform template carries NONE of the decomposed Euler
 *       clauses `rotateX(${rotate.x}deg)` / `rotateY(...)` / `rotateZ(...)`. BITE:
 *       re-add the Euler re-application beside the rotate3d → reds.
 *
 *   getaxisangle     — `quat.getAxisAngle(` is the render's axis-angle source (the
 *       exact inverse of the `quat.setAxisAngle` the accumulation leg uses), and a
 *       reused module-scope axis out-param keeps it zero-alloc. BITE: read the axis
 *       off Euler again → reds.
 *
 *   euler-vmodel-kept — `quaternionToEulerDegrees` SURVIVES and `syncRotationToModel`
 *       still calls it (O-1a: the Euler v-model is the slider/share surface, NOT
 *       deleted). BITE: delete the v-model extractor while its caller remains → reds
 *       (this is the O-1b widening this wave defers, forbidden here).
 *
 *   test-locks       — `test/orbital-rotate3d.test.ts` carries the form-lock + the
 *       gimbal-pole-parity clauses. BITE: delete a lock → reds.
 *
 * Mirrors `proof:blend`: exits 1 on any residual. Re-runnable:
 * `node scripts/proof-orbital-rotate3d.mjs`.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

console.log("proof:orbital-rotate3d — G.W18 (the rotation OUTPUT renders as native rotate3d)");

const SFC = "demo/scenes/cube/orbital-drag/OrbitalDrag.vue";
const TEST = "test/orbital-rotate3d.test.ts";

const sfc = read(SFC);

// ── render-rotate3d — the transform emits rotate3d off getAxisAngle ───────────
if (/rotate3d\(\$\{/.test(sfc)) {
    ok("render-rotate3d", `${SFC} renders the transform as a rotate3d(\${...}) clause`);
} else {
    fail(
        "render-rotate3d",
        `${SFC}: the containerStyle transform must emit a rotate3d(\${ax}, \${ay}, \${az}, \${deg}deg) clause — the gimbal-free quaternion's native axis-angle form, NOT a decomposed Rx·Ry·Rz.`,
    );
}

// ── no-euler-render — the decomposed Euler re-application is GONE ──────────────
{
    const eulerClauses = [
        /rotateX\(\$\{rotate\.x\}deg\)/,
        /rotateY\(\$\{rotate\.y\}deg\)/,
        /rotateZ\(\$\{rotate\.z\}deg\)/,
    ].filter((re) => re.test(sfc));
    if (eulerClauses.length === 0) {
        ok("no-euler-render", `${SFC}: no decomposed rotateX/Y/Z(\${rotate.*}deg) clause in the render`);
    } else {
        fail(
            "no-euler-render",
            `${SFC}: ${eulerClauses.length} decomposed Euler re-application clause(s) survive in the render (rotateX/Y/Z off rotate.*) — the round-trip anti-pattern this wave collapses; the render must be ONE rotate3d off the quaternion.`,
        );
    }
}

// ── getaxisangle — the render reads the axis-angle off the quaternion ─────────
{
    const usesGetAxisAngle = /quat\.getAxisAngle\s*\(/.test(sfc);
    const reusedOutParam = /vec3\.create\(\)/.test(sfc); // renderAxis out-param
    if (usesGetAxisAngle && reusedOutParam) {
        ok("getaxisangle", `${SFC}: the render reads the axis-angle via quat.getAxisAngle into a reused vec3 out-param (zero-alloc)`);
    } else {
        fail(
            "getaxisangle",
            `${SFC}: quat.getAxisAngle=${usesGetAxisAngle}, reused vec3 out-param=${reusedOutParam} — the render must read the axis-angle straight off currentQuaternion via quat.getAxisAngle (the exact inverse of the setAxisAngle accumulation leg), into a reused module-scope vec3.`,
        );
    }
}

// ── euler-vmodel-kept — O-1a: the Euler extractor SURVIVES for the v-model ─────
// The pure quaternion↔Euler math is colocated in quaternionEuler.ts (kept under
// the SFC's line ceiling); the SFC imports + calls it for the v-model triple.
{
    const eulerMod = read("demo/scenes/cube/orbital-drag/quaternionEuler.ts");
    const extractorDefined =
        /export\s+const\s+quaternionToEulerDegrees\s*=/.test(eulerMod);
    const stillCalled = /quaternionToEulerDegrees\s*\(\s*currentQuaternion\s*\)/.test(sfc);
    if (extractorDefined && stillCalled) {
        ok("euler-vmodel-kept", `${SFC}: quaternionToEulerDegrees survives (colocated in quaternionEuler.ts) and syncRotationToModel still calls it (the Euler v-model, O-1a)`);
    } else {
        fail(
            "euler-vmodel-kept",
            `quaternionToEulerDegrees defined-in-quaternionEuler.ts=${extractorDefined}, called-in-SFC=${stillCalled} — O-1a KEEPS the Euler v-model (the slider/share surface is per-axis Euler-by-design); deleting it while its caller remains is the O-1b widening this wave DEFERS.`,
        );
    }
}

// ── reverse-path — the v-model is two-way: an external Euler write re-seeds the
// quaternion the render reads (else the container renders the stale dragged
// orientation). The forward path mutates the quaternion + DERIVES the Euler; the
// reverse path must rebuild the quaternion FROM the Euler on an external write. ──
{
    const rebuildDefined = /rebuildQuaternionFromEuler\s*=/.test(sfc);
    // a watch on the Euler v-model triple that re-seeds the quaternion.
    const watchesEulerTriple =
        /watch\(\s*\(\)\s*=>\s*\[\s*model\.value\.rotate\.x/.test(sfc);
    const reseedsOnWatch =
        /rebuildQuaternionFromEuler\(\)/.test(sfc) &&
        // the rebuild is invoked from somewhere OTHER than only onMounted —
        // i.e. it appears at least twice (onMounted seed + the reverse-path watch)
        (sfc.match(/rebuildQuaternionFromEuler\(\)/g) || []).length >= 2;
    if (rebuildDefined && watchesEulerTriple && reseedsOnWatch) {
        ok(
            "reverse-path",
            `${SFC}: an external Euler write (Reset / slider / share) re-seeds the quaternion via a watch on model.value.rotate → rebuildQuaternionFromEuler (the two-way v-model render path)`,
        );
    } else {
        fail(
            "reverse-path",
            `${SFC}: rebuildDefined=${rebuildDefined}, watchesEulerTriple=${watchesEulerTriple}, reseedsOnWatch=${reseedsOnWatch} — the render reads currentQuaternion, so an EXTERNAL write to model.value.rotate must re-seed it (a watch on the Euler triple calling rebuildQuaternionFromEuler); without it the container renders the stale dragged orientation when the v-model is written externally.`,
        );
    }
}

// ── test-locks — the form-lock + gimbal-pole-parity clauses are present ────────
{
    const test = read(TEST);
    const anchors = [
        { name: "form lock (contains rotate3d()", re: /toContain\(["']rotate3d\(["']\)/ },
        { name: "no rotateX( in the render", re: /not\.toContain\(["']rotateX\(["']\)/ },
        { name: "gimbal-pole parity (quatAngleDiff < epsilon)", re: /quatAngleDiffDeg\([^)]*\)\)\.toBeLessThan/ },
        { name: "axis-angle parse + reconstruct", re: /parseRotate3d\(/ },
    ];
    const missing = anchors.filter(({ re }) => !re.test(test));
    if (missing.length === 0) {
        ok("test-locks", `${TEST} locks the form + gimbal-pole-parity clauses (${anchors.length} anchors)`);
    } else {
        fail("test-locks", `${TEST} is missing: ${missing.map((m) => m.name).join("; ")}`);
    }
}

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:orbital-rotate3d — FAIL: the rotation OUTPUT is not collapsed to native rotate3d:\n" +
            failures.join("\n") +
            "\n\n  The OUTPUT must render ONE rotate3d(ax, ay, az, deg) read off the\n" +
            "  source-of-truth quaternion via quat.getAxisAngle (loss-free + pole-free),\n" +
            "  with NO decomposed rotateX/Y/Z re-application; the Euler v-model\n" +
            "  (quaternionToEulerDegrees) STAYS for the slider/share surface (O-1a).",
    );
    process.exit(1);
}
console.log(
    "proof:orbital-rotate3d — PASS: the rotation OUTPUT renders as ONE native\n" +
        "rotate3d off the quaternion (loss-free, gimbal-pole-free); the Euler v-model\n" +
        "is preserved (O-1a). The value proof rides `vitest run test/orbital-rotate3d.test.ts`.",
);
