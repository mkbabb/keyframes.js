#!/usr/bin/env node
/**
 * proof:emerging-css-resolve-p2 — Q.WB1 (the emerging-CSS lowering pass, Phase-2
 * element-AWARE arm). P.W13 shipped the Phase-2 fields TYPED but never populated
 * and the SECOND resolution pass NEVER authored — `if(style(--p))` lowered to the
 * literal `if(...)` string and `sibling-index()`/`sibling-count()` never even
 * entered the pass. Q.WB1 activates the typed seam: ONE rewriter, a SECOND
 * lifecycle point (post-`setTargets`, element-populated env), the SAME
 * `ResolveContext` shape.
 *
 * This is the SOURCE-GREP half (the cure-is-wired anchors) — CHAINED in
 * package.json with the BEHAVIOUR half (`vitest run
 * test/resolve/emerging-css-resolve-p2.test.ts`, the live observable-truth resolution
 * against a REAL attached jsdom DOM target: if(style(--p)) → the resolved branch,
 * sibling-index() → the integer position). The behaviour half is the gate-
 * blindspot-proof witness (a real DOM resolution, NOT a source grep).
 *
 * POST-CURE-ONLY anchors — each names a symbol ABSENT from the uncured source
 * (the `style`-branch in `evalCondition`, the `sibling-*` arm in `resolveNode`,
 * the widened `hasResolvableValue` + the new `hasPhase2Node`, the `setTargets`
 * env-populate + second pass), so the gate is RED today by construction and
 * false-passes on NOTHING. Exits 1 on any residual.
 */
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

console.log(
    "proof:emerging-css-resolve-p2 — Q.WB1 (if(style(--p)) + sibling-index/count element-aware)",
);

// R.W2b carved the resolve recursion into the `resolve/` zone (env / resolve-if /
// resolve-function + the index core); the RESOLVE SURFACE is the four colocated
// files, so a clause's anchor is found wherever the carve landed it.
const RESOLVE = [
    "src/animation/resolve/index.ts",
    // S.B4 — the core recursion (resolveNode/hasResolvableValue/hasPhase2Node)
    // carved off the barrel into ./core (a02 F3/F4). The RESOLVE surface is the
    // concatenation, so the element-aware anchors are found wherever the carve
    // landed them.
    "src/animation/resolve/core.ts",
    "src/animation/resolve/spring-css.ts",
    "src/animation/resolve/env.ts",
    "src/animation/resolve/resolve-if.ts",
    "src/animation/resolve/resolve-function.ts",
];
const ENGINE = "src/animation/engine/animation.ts";
// R.W2 — the Phase-2 element-aware SECOND-pass resolver (the `resolveValues`
// rewriter + the env-populate) was carved out of the engine god-class; S.B2
// (a17 F5, RULED) RE-HOMED it into the `resolve/` zone it coheres with
// (`resolve/element-resolve.ts`), and folded `setTargets`' whole binding body
// into a `bindTargets(this)` delegate there (which calls
// `resolveElementAwareValues`). The body anchors follow the code to its new home
// (`bindTargets`/`resolveElementAwareValues`/`buildElementAwareEnv`).
const ELEMENT_RESOLVE = "src/animation/resolve/element-resolve.ts";

const requireAll = (clause, file, anchors) => {
    // `file` may be a single path or an array of paths whose concatenation is the
    // surface (R.W2b — a carve can split a clause's anchors across sibling files).
    const files = Array.isArray(file) ? file : [file];
    const label = files.join(" + ");
    const missingFiles = files.filter((f) => !existsSync(join(root, f)));
    if (missingFiles.length > 0) {
        fail(clause, `${missingFiles.join(", ")} does not exist.`);
        return;
    }
    const src = files.map((f) => read(f)).join("\n");
    const missing = anchors.filter(({ re }) => !re.test(src));
    if (missing.length > 0) {
        fail(
            clause,
            `${label} is missing: ${missing
                .map((m) => m.name)
                .join("; ")} — the ${clause} cure is no longer wired.`,
        );
    } else {
        ok(clause, `${label} locks ${anchors.length} ${clause} anchor(s)`);
    }
};

// ── guard-admits-sibling (S1 precondition) — hasResolvableValue widened +
//    hasPhase2Node added (the Phase-2 SUBSET predicate the 2nd pass gates on) ───
requireAll("guard-admits-sibling", RESOLVE, [
    {
        name: "hasResolvableValue admits sibling-index / sibling-count (GAP 3 — the Phase-2-only declaration enters the pass)",
        re: /hasResolvableValue[\s\S]*?["']sibling-index["'][\s\S]*?["']sibling-count["']/,
    },
    {
        name: "hasPhase2Node — the Phase-2 SUBSET predicate gating the SECOND pass",
        re: /export\s+const\s+hasPhase2Node\b/,
    },
    {
        name: "hasPhase2Node admits a style(...)-condition if() (isStyleConditionIf)",
        re: /isStyleConditionIf\b/,
    },
]);

// ── env-populated + sibling-resolved (S2/S3) — the live style branch in
//    evalCondition + the sibling-* arm in resolveNode (the element-aware arms) ──
requireAll("sibling-resolved", RESOLVE, [
    {
        name: "evalCondition reads ctx.env.customProps for style(--p) (the Phase-2 live branch, NOT the undefined Phase-1 return)",
        re: /ctx\.env\.customProps/,
    },
    {
        name: "evalStyleCondition — presence/equality over the resolved custom-prop",
        re: /evalStyleCondition\b/,
    },
    {
        name: "resolveNode resolves sibling-index() via ctx.env.siblingIndex",
        re: /node\.name\s*===\s*["']sibling-index["'][\s\S]*?ctx\.env\.siblingIndex/,
    },
    {
        name: "resolveNode resolves sibling-count() via ctx.env.siblingCount",
        re: /node\.name\s*===\s*["']sibling-count["'][\s\S]*?ctx\.env\.siblingCount/,
    },
]);

// ── second-pass (S3) — the element-aware second-pass resolver + the engine's
//    setTargets delegate. S.B2: the resolver body lives in `resolve/element-
//    resolve.ts`; `setTargets` (on the base class) delegates its whole binding
//    body to `bindTargets(this)`, which runs `resolveElementAwareValues`.
requireAll("second-pass", ENGINE, [
    {
        name: "setTargets delegates the element-aware second pass to bindTargets(this)",
        re: /bindTargets\s*\(\s*this\s*\)/,
    },
]);
requireAll("second-pass", ELEMENT_RESOLVE, [
    {
        name: "bindTargets runs the element-aware second pass (resolveElementAwareValues delegate)",
        re: /resolveElementAwareValues\s*\(\s*animation\s*\)/,
    },
    {
        name: "the resolver imports hasPhase2Node + resolveValues from ../resolve (the second-pass seam)",
        re: /hasPhase2Node[\s\S]*?from\s+["']\.\.\/resolve["']|resolveValues[\s\S]*?from\s+["']\.\.\/resolve["']/,
    },
    {
        name: "the env-populate reads the bound target's custom-prop + sibling position (buildElementAwareEnv)",
        re: /buildElementAwareEnv\b/,
    },
    {
        name: "the env binds siblingIndex (1-based) + siblingCount off parentElement.children",
        re: /siblingIndex\s*=\s*\(\)\s*=>[\s\S]*?\+\s*1[\s\S]*?siblingCount\s*=\s*\(\)\s*=>[\s\S]*?children\.length/,
    },
    {
        name: "the second pass re-resolves over the pre-flatten templateFrames snapshot (hasPhase2Node gated)",
        re: /templateFrames[\s\S]*?hasPhase2Node|hasPhase2Node[\s\S]*?vars\[key\]/,
    },
]);

if (failures.length > 0) {
    console.error("\nproof:emerging-css-resolve-p2 FAILED:");
    for (const f of failures) console.error(f);
    console.error(
        "\nThe Phase-2 element-aware emerging-CSS lowering pass is not wired. The " +
            "behaviour half (vitest run test/resolve/emerging-css-resolve-p2.test.ts) carries " +
            "the live resolution observables against a REAL attached DOM target; this " +
            "source half confirms the style/sibling-* arms + the widened guard + the " +
            "setTargets env-populate + the second pass are in place.",
    );
    process.exit(1);
}
console.log(
    "\nproof:emerging-css-resolve-p2 source-shape: all anchors locked.",
);
