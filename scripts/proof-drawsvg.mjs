#!/usr/bin/env node
/**
 * proof:drawsvg — the G.W13 CSS-native DrawSVG gate.
 *
 * `DrawSVG` animates `stroke-dashoffset: L → 0` over `stroke-dasharray: L` where
 * `L = target.getTotalLength()` (ONE DOM read). It is pure WAAPI-eligible CSS
 * that delegates compositor-thread through the EXISTING eligibility gate — no new
 * predicate, no `d`-parse, no value.js geometry. It mirrors `motion-path.ts`.
 *
 * A SOURCE-GREP gate in the style of `proof:motion-path`: each clause reds on the
 * exact regression it forbids — verified, not asserted. The behaviour proof
 * (single getTotalLength read / dasharray===L / stroke-dashoffset sweep /
 * eligibility / delegation) lives in the chained `vitest run
 * test/svg/draw-svg.test.ts` (the lead wires the combined `"proof:drawsvg"` script —
 * see the note at the tail).
 *
 * CLAUSES (each BITES):
 *
 *   primitive-exists   — `draw-svg.ts` exports `fromDrawSVG` AND `DrawSVG`. BITE:
 *       rename/drop the export → reds.
 *
 *   single-length-read — the factory reads `getTotalLength()` and assigns it to a
 *       const ONCE (`const L = target.getTotalLength()`), NOT per-frame. BITE:
 *       read it per-frame, or more than once → the single-read clause reds.
 *
 *   dasharray-set      — the factory sets `stroke-dasharray` to that length on the
 *       target (`target.style.strokeDasharray = `${L}``). BITE: strip the
 *       dasharray set, or set a value !== L → reds.
 *
 *   animates-offset    — the keyframe set sweeps the `stroke-dashoffset` key
 *       `L*(1-fromFrac) → L*(1-toFrac)` over the `0%`/`100%` stops. BITE: build
 *       over a non-stroke-dashoffset key → reds.
 *
 *   eligibility-reuse  — `draw-svg.ts` carries NO second eligibility predicate
 *       (no `isWAAPIEligible`-shaped function of its own); it rides the ONE gate.
 *       BITE: add a stroke-specific eligibility branch → reds.
 *
 *   no-valuejs-edge    — `draw-svg.ts` holds NO static `@mkbabb/value.js`
 *       specifier (the HEAVY-but-no-NEW-edge discipline; it composes the engine
 *       only). BITE: add `import … "@mkbabb/value.js"` → reds (and proof:boundary
 *       would too).
 *
 *   barrel-wired       — `index.ts` exports `fromDrawSVG`/`DrawSVG` behind
 *       `loadAnimationEngine()` (the heavy boundary), mirroring MotionPath. BITE:
 *       expose them on the static barrel → the light-only consumer pulls the
 *       engine and proof:boundary reds.
 *
 *   test-locks         — `test/svg/draw-svg.test.ts` carries the locking assertions
 *       (single getTotalLength read, dasharray===L, the stroke-dashoffset sweep,
 *       eligibility true, compositor delegation). BITE: delete a lock → reds.
 *
 * Mirrors `proof:motion-path`: exits 1 on any residual.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

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

console.log("proof:drawsvg — G.W13 (CSS-native DrawSVG)");

const DS = "src/animation/svg/draw-svg.ts";
const INDEX = "src/animation/index.ts";
// L close (`fix(tranche-L close): the gate-suite roster reconciliation`)
// extracted `loadAnimationEngine` + its dynamic `import("./…")` edges and the
// engine-surface runtime assigns out of `index.ts` into `load-engine.ts` (a new
// module the barrel re-exports `loadAnimationEngine` from). The dynamic import +
// runtime assign of DrawSVG now live there; the barrel keeps ONLY the type
// re-export. The barrel-wired clause reads the load-engine surface for the
// runtime wiring and BOTH surfaces for the no-static-value-export prohibition.
const LOAD_ENGINE = "src/animation/load-engine.ts";
const TEST = "test/svg/draw-svg.test.ts";

// ── primitive-exists — fromDrawSVG + DrawSVG are exported ──────────────────────
requireAll("primitive-exists", DS, [
    { name: "exports `fromDrawSVG`", re: /export\s+function\s+fromDrawSVG\b/ },
    { name: "exports the `DrawSVG` class", re: /export\s+class\s+DrawSVG\b/ },
]);

// ── single-length-read — L = getTotalLength() read ONCE at construction ───────
{
    // Strip block/line comments so docstring examples (`el.getTotalLength()`)
    // are not counted — the gate measures the CODE's single read, not prose.
    const src = read(DS)
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/[^\n]*/g, "");
    // The real call site reads off `target` and assigns to `const L`. The
    // type-guard's `typeof (...).getTotalLength !== "function"` references the
    // property WITHOUT `()` — not a call.
    const reads = (src.match(/target\.getTotalLength\(\)/g) || []).length;
    const assignedOnce = /const\s+L\s*=\s*target\.getTotalLength\(\)/.test(src);
    if (reads !== 1 || !assignedOnce) {
        fail(
            "single-length-read",
            `${DS}: getTotalLength() is CALLED ${reads} time(s) (want exactly 1, assigned to \`const L\`) — the browser owns the geometry; L is read ONCE at construction, never per-frame (the measure-first layout-round-trip the Mandate forbids).`,
        );
    } else {
        ok(
            "single-length-read",
            `getTotalLength() is called exactly once, assigned to \`const L\` — read once at construction`,
        );
    }
}

// ── dasharray-set — stroke-dasharray set to L on the target ───────────────────
requireAll("dasharray-set", DS, [
    {
        name: "sets stroke-dasharray to the length L (target.style.strokeDasharray = `${L}`)",
        re: /\.style\.strokeDasharray\s*=\s*`\$\{L\}`/,
    },
]);

// ── animates-offset — sweeps stroke-dashoffset over the 0%/100% stops ─────────
requireAll("animates-offset", DS, [
    {
        name: "builds a keyframe over the `stroke-dashoffset` key",
        re: /["']stroke-dashoffset["']\s*:/,
    },
    {
        name: "sweeps offset L*(1-fromFrac) → L*(1-toFrac) across the 0%/100% stops",
        re: /["']0%["']\s*:[\s\S]*?L\s*\*\s*\(1\s*-\s*fromFrac\)[\s\S]*?["']100%["']\s*:[\s\S]*?L\s*\*\s*\(1\s*-\s*toFrac\)/,
    },
]);

// ── eligibility-reuse — NO second eligibility predicate in draw-svg.ts ────────
{
    const src = read(DS);
    const definesPredicate =
        /function\s+is\w*Eligib/i.test(src) ||
        /WAAPI_INELIGIBLE_UNITS/.test(src) ||
        /isWAAPIEligible\s*\(/.test(src);
    if (definesPredicate) {
        fail(
            "eligibility-reuse",
            `${DS} references/defines an eligibility predicate — DrawSVG must reuse the ONE \`isWAAPIEligible\` gate (waapi.ts), not a stroke-specific branch.`,
        );
    } else {
        ok(
            "eligibility-reuse",
            `${DS} defines no second eligibility predicate — it rides the one gate`,
        );
    }
}

// ── no-valuejs-edge — draw-svg.ts carries no static @mkbabb/value.js edge ─────
{
    const src = read(DS);
    const valueJsEdge = /["']@mkbabb\/value\.js(?:\/[^"']*)?["']/.test(src);
    if (valueJsEdge) {
        fail(
            "no-valuejs-edge",
            `${DS} carries a static \`@mkbabb/value.js\` specifier — DrawSVG must compose the engine only (proof:boundary gates this).`,
        );
    } else {
        ok(
            "no-valuejs-edge",
            `${DS} holds zero static value.js specifier (no new boundary edge)`,
        );
    }
}

// ── barrel-wired — fromDrawSVG/DrawSVG behind loadAnimationEngine() ───────────
{
    // The runtime wiring (dynamic import + engine-surface assign) lives in the
    // load-engine module the barrel re-exports `loadAnimationEngine` from.
    const loadSrc = read(LOAD_ENGINE);
    const importsFromDraw =
        /import\([\s\S]*?["']\.\/svg\/draw-svg["']\)/.test(loadSrc);
    const assignsFactory =
        /fromDrawSVG:\s*drawMod\.fromDrawSVG/.test(loadSrc) &&
        /DrawSVG:\s*drawMod\.DrawSVG/.test(loadSrc);
    // A STATIC runtime re-export of the factory would breach the boundary;
    // only the TYPE export (`export type { DrawSVGOptions ... }`) is allowed
    // statically. Reject a static value re-export of the runtime symbols on
    // EITHER the barrel or the load-engine module.
    const staticValueExportRe =
        /export\s*\{\s*(?:[^}]*\b)?(?:fromDrawSVG|DrawSVG)\b[^}]*\}\s*from\s*["']\.\/svg\/draw-svg["']/;
    const staticValueExport =
        staticValueExportRe.test(read(INDEX)) ||
        staticValueExportRe.test(loadSrc);
    if (!importsFromDraw || !assignsFactory || staticValueExport) {
        fail(
            "barrel-wired",
            `${LOAD_ENGINE}: dynamic import of ./draw-svg=${importsFromDraw}, runtime assign on the engine surface=${assignsFactory}, static value re-export anywhere on the barrel surface (forbidden)=${staticValueExport} — DrawSVG must ride loadAnimationEngine() behind the heavy boundary, like MotionPath.`,
        );
    } else {
        ok(
            "barrel-wired",
            `fromDrawSVG/DrawSVG ride loadAnimationEngine() (heavy boundary, via ${LOAD_ENGINE}); only their types are on the static barrel`,
        );
    }
}

// ── test-locks — the locking assertions are present and biting ────────────────
requireAll("test-locks", TEST, [
    {
        name: "locks the SINGLE getTotalLength read (toHaveBeenCalledTimes(1))",
        re: /getTotalLength\)\.toHaveBeenCalledTimes\(1\)/,
    },
    {
        name: "locks stroke-dasharray === L",
        re: /strokeDasharray\)\.toBe\(`\$\{LEN\}`\)/,
    },
    {
        name: "locks the stroke-dashoffset-only interpolating key set",
        re: /expect\(\[\.\.\.keys\]\)\.toEqual\(\["stroke-dashoffset"\]\)/,
    },
    {
        name: "locks eligibility through the one gate ({ eligible: true })",
        re: /expect\(isWAAPIEligible\([\s\S]*?\)\)\.toEqual\(\{\s*eligible:\s*true\s*\}\)/,
    },
    {
        name: "locks compositor delegation (target.animate called)",
        re: /expect\(animate\)\.toHaveBeenCalled\(\)/,
    },
]);

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:drawsvg — FAIL: the CSS-native DrawSVG is not fully gated:\n" +
            failures.join("\n") +
            "\n\n  DrawSVG reads getTotalLength() once, sets stroke-dasharray=L, and sweeps\n" +
            "  stroke-dashoffset L→0; it reuses the ONE isWAAPIEligible gate (no\n" +
            "  stroke-specific predicate), carries zero value.js edge, and rides\n" +
            "  loadAnimationEngine(). Restore the clause each anchor names.",
    );
    process.exit(1);
}
console.log(
    "proof:drawsvg — PASS: DrawSVG sweeps stroke-dashoffset L→0 over\n" +
        "stroke-dasharray:L (one getTotalLength read), reuses the one WAAPI\n" +
        "eligibility gate (no stroke-specific predicate), carries zero value.js\n" +
        "edge, and rides loadAnimationEngine(). The behaviour proof rides\n" +
        "`vitest run test/svg/draw-svg.test.ts`.",
);
