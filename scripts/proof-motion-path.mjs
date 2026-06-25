#!/usr/bin/env node
/**
 * proof:motion-path — the F.W12 CSS-native MotionPath gate.
 *
 * `MotionPath` animates `offset-distance: 0% → 100%` over an author-supplied
 * `offset-path` — pure WAAPI-eligible CSS, compositor-thread, ZERO value.js
 * dep. It REUSES the one `isWAAPIEligible` gate; it does NOT bolt on a parallel
 * path-specific eligibility predicate (the wave's non-negotiable, F.W12 §gate).
 *
 * A SOURCE-GREP gate in the style of `proof:engine` / `proof:orchestration`:
 * each clause reds on the exact regression it forbids — verified, not asserted.
 * The behaviour proof (eligibility / delegation / keyframe shape) lives in the
 * chained `vitest run test/motion-path.test.ts` (the lead wires the combined
 * `"proof:motion-path"` script — see the note at the tail).
 *
 * CLAUSES (each BITES):
 *
 *   primitive-exists   — `motion-path.ts` exports `fromMotionPath` AND
 *       `MotionPath`. BITE: rename/drop the export → reds.
 *
 *   animates-offset    — the factory sets `offset-path` on the target and
 *       builds over the `offset-distance` key sweeping 0%→100%. BITE: strip the
 *       offset-path set, or build over a non-offset-distance key → reds.
 *
 *   eligibility-reuse  — `motion-path.ts` carries NO second eligibility
 *       predicate (no `isWAAPIEligible`-shaped function of its own); the ONE
 *       exemption lives PROPERTY-KEYED in `waapi.ts`. BITE: add a path-specific
 *       eligibility branch in motion-path.ts → reds.
 *
 *   waapi-exemption    — `waapi.ts` exempts `offset-distance`'s path-relative
 *       `%` from the layout-`%` rejection, keyed on the property (so `width: %`
 *       stays ineligible). BITE: drop the exemption → the offset-distance %
 *       freezes to px and MotionPath loses the compositor.
 *
 *   no-valuejs-edge    — `motion-path.ts` holds NO static `@mkbabb/value.js`
 *       specifier (the LIGHT-surface discipline; it composes the engine and the
 *       light leaves only). BITE: add `import … "@mkbabb/value.js"` → reds (and
 *       the lead's proof:boundary would too, once the lead wires the export).
 *
 *   test-locks         — `test/motion-path.test.ts` carries the locking
 *       assertions (offset-path set, offset-distance shape, eligibility true,
 *       compositor delegation, the property-keyed BITE). BITE: delete a lock →
 *       reds.
 *
 * Mirrors `proof:engine`: exits 1 on any residual.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

/** Assert every anchor is present in `src`; the clause reds on any missing. */
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

console.log("proof:motion-path — F.W12 (CSS-native MotionPath)");

const MP = "src/animation/svg/motion-path.ts";
// R.W2 carved the flat `waapi/waapi.ts` into cohesive concerns; the property-
// keyed `offset-distance` %-exemption (`isOffsetPercentProperty`) lives in the
// eligibility concern alongside the one `isWAAPIEligible` gate it guards.
const WAAPI = "src/animation/waapi/eligibility.ts";
const TEST = "test/motion-path.test.ts";

// ── primitive-exists — fromMotionPath + MotionPath are exported ───────────────
requireAll("primitive-exists", MP, [
    {
        name: "exports `fromMotionPath`",
        re: /export\s+function\s+fromMotionPath\b/,
    },
    {
        name: "exports the `MotionPath` class",
        re: /export\s+class\s+MotionPath\b/,
    },
]);

// ── animates-offset — sets offset-path + sweeps offset-distance 0%→100% ───────
requireAll("animates-offset", MP, [
    {
        name: "sets `offset-path` on the target (el.style.offsetPath = path)",
        re: /\.style\.offsetPath\s*=\s*path/,
    },
    {
        name: "builds a keyframe over the `offset-distance` key",
        re: /["']offset-distance["']\s*:/,
    },
    {
        name: "sweeps from the `0%` and `100%` stops",
        re: /["']0%["']\s*:[\s\S]*?["']100%["']\s*:/,
    },
]);

// ── eligibility-reuse — NO second eligibility predicate in motion-path.ts ─────
{
    const src = read(MP);
    // A second predicate would either DEFINE its own `isWAAPIEligible`-shaped
    // function or re-implement the WAAPI_INELIGIBLE_UNITS check. Importing the
    // existing gate for a TEST is in test/, not here; motion-path.ts should not
    // even reference an eligibility predicate — the engine consults the one gate.
    const definesPredicate =
        /function\s+is\w*Eligib/i.test(src) ||
        /WAAPI_INELIGIBLE_UNITS/.test(src) ||
        /isWAAPIEligible\s*\(/.test(src);
    if (definesPredicate) {
        fail(
            "eligibility-reuse",
            `${MP} references/defines an eligibility predicate — MotionPath must reuse the ONE \`isWAAPIEligible\` gate (waapi.ts), not a path-specific branch.`,
        );
    } else {
        ok(
            "eligibility-reuse",
            `${MP} defines no second eligibility predicate — it rides the one gate`,
        );
    }
}

// ── waapi-exemption — the property-keyed offset-distance % exemption lives in waapi.ts
requireAll("waapi-exemption", WAAPI, [
    {
        name: "names `offset-distance` as a path-relative-% property",
        re: /["']offset-distance["']/,
    },
    {
        name: "a property-keyed % exemption helper (isOffsetPercentProperty)",
        re: /isOffsetPercentProperty/,
    },
    {
        name: "the exemption is surgical to `%` (calc/var still freeze)",
        re: /unit\s*===\s*["']%["']/,
    },
]);

// ── no-valuejs-edge — motion-path.ts carries no static @mkbabb/value.js edge ──
{
    const src = read(MP);
    // Any static specifier form: `import ... "@mkbabb/value.js"`,
    // `from "@mkbabb/value.js"`, or a subpath `@mkbabb/value.js/...`.
    const valueJsEdge = /["']@mkbabb\/value\.js(?:\/[^"']*)?["']/.test(src);
    if (valueJsEdge) {
        fail(
            "no-valuejs-edge",
            `${MP} carries a static \`@mkbabb/value.js\` specifier — MotionPath must compose the engine + light leaves only (the lead's proof:boundary gates this once the export is wired).`,
        );
    } else {
        ok(
            "no-valuejs-edge",
            `${MP} holds zero static value.js specifier (light-surface clean)`,
        );
    }
}

// ── test-locks — the locking assertions are present and biting ────────────────
requireAll("test-locks", TEST, [
    {
        name: "locks the offset-path set",
        re: /expect\(el\.style\.offsetPath\)\.toBe\(PATH\)/,
    },
    {
        name: "locks the offset-distance-only interpolating key set",
        re: /expect\(\[\.\.\.keys\]\)\.toEqual\(\["offset-distance"\]\)/,
    },
    {
        name: "locks eligibility through the one gate ({ eligible: true })",
        re: /expect\(isWAAPIEligible\([\s\S]*?\)\)\.toEqual\(\{\s*eligible:\s*true\s*\}\)/,
    },
    {
        name: "locks compositor delegation (target.animate called)",
        re: /expect\(spy\)\.toHaveBeenCalled\(\)/,
    },
    {
        name: "BITE: a width:% animation STAYS ineligible (property-keyed exemption)",
        re: /width[\s\S]*?expect\(elig\.eligible\)\.toBe\(false\)/,
    },
]);

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:motion-path — FAIL: the CSS-native MotionPath is not fully gated:\n" +
            failures.join("\n") +
            "\n\n  MotionPath sweeps offset-distance over an author offset-path, reuses\n" +
            "  the ONE isWAAPIEligible gate (the offset-distance % exemption is\n" +
            "  property-keyed in waapi.ts), and carries zero value.js edge. Restore\n" +
            "  the clause each anchor names.",
    );
    process.exit(1);
}
console.log(
    "proof:motion-path — PASS: MotionPath animates offset-distance:0%→100% over\n" +
        "an author offset-path; it reuses the one WAAPI eligibility gate (no\n" +
        "path-specific predicate; the offset-distance % exemption is property-keyed\n" +
        "in waapi.ts), delegates compositor-thread, and carries zero static\n" +
        "value.js edge. The behaviour proof rides `vitest run test/motion-path.test.ts`.",
);
