#!/usr/bin/env node
/**
 * proof:emerging-css-resolve-fn — Q.WB2 (the emerging-CSS lowering pass, the
 * `@function` CALL-inlining arm). P.W13 threaded the `@function` DEFINITION
 * registry (`extractFunctions` → `ResolveContext.functions`) and left the
 * CALL-inlining as a typed-but-INERT seam — the dashed-function branch returned
 * the `--ident(args)` call UNCHANGED because value.js's generic producer dropped
 * a dashed-call's args. value.js 1.2.0 ships the dashed-call parse arm
 * (`--double(50px)` → `FunctionValue("--double", [ValueUnit(50, px)])`) + the
 * `coerceToSyntax(valueText, syntax)` resolve-path validator. Q.WB2 activates the
 * seam: bind → coerce → substitute → evaluate, cycle-guarded by `ctx.seen`.
 *
 * This is the SOURCE-GREP half (the cure-is-wired anchors) — CHAINED in
 * package.json with the BEHAVIOUR half (`vitest run
 * test/resolve/emerging-css-resolve-fn.test.ts`, the live observable-truth inlining: the
 * `--ident(args)` call is REPLACED by its substituted `result` expression on the
 * compiled frame). The behaviour half is the gate-blindspot-proof witness (a real
 * engine compile, NOT a source grep).
 *
 * This gate is the REAL terminal superseding the never-built P.W13
 * `proof:emerging-css-resolve-vjs-p` paper placeholder (which was never authored
 * — only the Phase-1 `proof:emerging-css-resolve-now` existed).
 *
 * POST-CURE-ONLY anchors — each names a symbol ABSENT from the inert source (the
 * `resolveFunctionCall` arm replacing the `return node` no-op, the
 * `ctx.seen.add`/`.delete` cycle-guard, the `coerceToSyntax` consume, the
 * `substituteParams` var-rewrite, the widened `hasResolvableValue`), so the gate
 * is RED on the uncured tree by construction and false-passes on NOTHING.
 * Exits 1 on any residual.
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
    "proof:emerging-css-resolve-fn — Q.WB2 (@function call-inlining: bind → coerce → substitute → evaluate)",
);

// R.W2b carved the resolve recursion into the `resolve/` zone (env / resolve-if /
// resolve-function + the index core); the RESOLVE SURFACE is the four colocated
// files, so a clause's anchor is found wherever the carve landed it.
const RESOLVE = [
    "src/animation/resolve/index.ts",
    // S.B4 — the core recursion (resolveNode + the dashed-function arm) carved
    // off the barrel into ./core (a02 F3/F4). The RESOLVE surface is the
    // concatenation, so the resolveFunctionCall anchors are found wherever the
    // carve landed them.
    "src/animation/resolve/core.ts",
    "src/animation/resolve/spring-css.ts",
    "src/animation/resolve/env.ts",
    "src/animation/resolve/resolve-if.ts",
    "src/animation/resolve/resolve-function.ts",
];

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

const requireNone = (clause, file, anchors) => {
    // Array-tolerant (R.W2b) — the surface may span sibling files; an inert-seam
    // residue in ANY of them reds the clause.
    const files = Array.isArray(file) ? file : [file];
    const label = files.join(" + ");
    const missingFiles = files.filter((f) => !existsSync(join(root, f)));
    if (missingFiles.length > 0) {
        fail(clause, `${missingFiles.join(", ")} does not exist.`);
        return;
    }
    const src = files.map((f) => read(f)).join("\n");
    const present = anchors.filter(({ re }) => re.test(src));
    if (present.length > 0) {
        fail(
            clause,
            `${label} still carries the INERT seam: ${present
                .map((m) => m.name)
                .join("; ")} — the call-inlining arm is not activated.`,
        );
    } else {
        ok(clause, `${label} carries no inert-seam residue (${clause})`);
    }
};

// ── arm-activated (S1) — the dashed-function branch CALLS resolveFunctionCall
//    (the inlining body) instead of returning the call UNCHANGED. ────────────
requireAll("arm-activated", RESOLVE, [
    {
        name: "the dashed-function branch invokes resolveFunctionCall (the bind→substitute→evaluate body, NOT the `return node` no-op)",
        re: /node\.name\.startsWith\("--"\)\s*&&\s*ctx\.functions\.has\(node\.name\)\)\s*\{\s*\n\s*return resolveFunctionCall\(node, ctx(?:, resolveNode)?\);/,
    },
    {
        name: "resolveFunctionCall — the @function lowering (bind → coerce → substitute → evaluate)",
        re: /const\s+resolveFunctionCall\s*=/,
    },
    {
        name: "it binds positional args off the descriptor (ctx.functions.get + parameters)",
        re: /resolveFunctionCall[\s\S]*?ctx\.functions\.get\(node\.name\)[\s\S]*?desc\.parameters/,
    },
    {
        name: "a SURPLUS arg (more args than params) → DROP (guaranteed-invalid call shape)",
        re: /args\.length\s*>\s*params\.length\)\s*return DROP/,
    },
]);

// ── inert-seam-retired (no-legacy) — the old `return node` no-op comment +
//    body are GONE from the dashed branch (the seam is live, not parallel). ──
requireNone("inert-seam-retired", RESOLVE, [
    {
        name: "the P.W13 inert-seam comment (`Registry present, call-parse pending`)",
        re: /Registry present, call-parse pending/,
    },
    {
        name: "the `When value.js-P lands` deferral marker",
        re: /When value\.js-P lands/,
    },
]);

// ── cycle-guard (S1 — the falsification anchor) — ctx.seen push/pop so a
//    self-reference DROPs at FIRST re-entry, never the depth ceiling. ────────
requireAll("cycle-guard", RESOLVE, [
    {
        name: "resolveFunctionCall DROPs on ctx.seen re-entry (the FIRST-re-entry guard, tighter than MAX_RESOLVE_DEPTH)",
        re: /if\s*\(ctx\.seen\.has\(node\.name\)\)\s*return DROP/,
    },
    {
        name: "it PUSHES the function name before recursing into the result (ctx.seen.add)",
        re: /ctx\.seen\.add\(node\.name\)/,
    },
    {
        name: "it POPS the function name after recursing (ctx.seen.delete)",
        re: /ctx\.seen\.delete\(node\.name\)/,
    },
]);

// ── coerce (S2 — value.js's syntax validator, NOT a kf-local checker) ───────
requireAll("coerce", RESOLVE, [
    {
        name: "imports coerceToSyntax from @mkbabb/value.js (inv-16: the validator is the sibling's, NOT re-authored)",
        re: /import\s*\{[\s\S]*?coerceToSyntax[\s\S]*?\}\s*from\s*["']@mkbabb\/value\.js["']/,
    },
    {
        name: "coerceArg coerces each bound arg through coerceToSyntax against the param <syntax>",
        re: /coerceToSyntax\(String\(arg\),\s*param\.syntax\)/,
    },
    {
        // S.C4/S2 — the field is `.default` since the value.js 2.0.x consume
        // (the KF-1 rename `defaultValue→default`; the shim-era anchor followed
        // the code to the clean direct read).
        name: "a coercion miss falls back to the param default (the CSS Mixins L1 fallback, never a NaN substitution)",
        re: /coerceArg[\s\S]*?param\.default\b/,
    },
]);

// ── substitute (S1 — the var(--param) → bound-value node rewrite) ───────────
requireAll("substitute", RESOLVE, [
    {
        name: "substituteParams — rewrites every var(--param) leaf with its bound value",
        re: /const\s+substituteParams\s*=/,
    },
    {
        name: "the var-ref match is unit `var` + the leading dashed-ident (isVarRef)",
        re: /node\.unit\s*===\s*["']var["'][\s\S]*?ident/,
    },
    {
        name: "the substitution CLONES the shared descriptor result (not a mutate)",
        re: /desc\.result\.clone\(\)/,
    },
]);

// ── guard-admits-call (S1 precondition) — hasResolvableValue admits the
//    dashed-function CALL so a `--double(...)` declaration enters the pass. ───
requireAll("guard-admits-call", RESOLVE, [
    {
        name: "hasResolvableValue admits a dashed-function call (name.startsWith('--')) — the Q.WB2 inlining precondition",
        re: /hasResolvableValue[\s\S]*?value\.name\.startsWith\("--"\)\s*\)\s*return true/,
    },
]);

if (failures.length > 0) {
    console.error("\nproof:emerging-css-resolve-fn FAILED:");
    for (const f of failures) console.error(f);
    console.error(
        "\nThe @function CALL-inlining arm is not wired. The behaviour half " +
            "(vitest run test/resolve/emerging-css-resolve-fn.test.ts) carries the live " +
            "inlining observables against the real engine compile (--double(50px) → " +
            "calc(50px * 2), the nested recursion, the self-reference DROP, the typed " +
            "coerce-fallback); this source half confirms the resolveFunctionCall arm + " +
            "the cycle-guard + the coerceToSyntax consume + the substituteParams " +
            "rewrite + the widened guard are in place, and the inert P.W13 seam is " +
            "retired.",
    );
    process.exit(1);
}
console.log(
    "\nproof:emerging-css-resolve-fn source-shape: all anchors locked.",
);
