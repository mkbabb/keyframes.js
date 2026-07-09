#!/usr/bin/env node
/**
 * proof:emerging-css-resolve-NOW — P.W13 (the emerging-CSS lowering pass,
 * Phase-1 element-INDEPENDENT arm). The owner directive: novel CSS features
 * SHOULD be supported in our grammar + engine — the library LEADS the platform.
 * The `springTimingFunction` precedent generalized: ONE compile-time lowering
 * pass (`resolve-values.ts`) resolves `if(supports/media)` + `spring()` to
 * concrete animatable values at the `resolveKeyframes → flatten` seam, so that
 * CSS animates in EVERY browser.
 *
 * This is the SOURCE-GREP half (the cure-is-wired anchors) — CHAINED in
 * package.json with the BEHAVIOUR half (`vitest run
 * test/resolve/emerging-css-resolve-now.test.ts`, the live observable-truth resolution:
 * if() → the concrete branch value, spring() → a curve sample-equal to
 * springTimingFunction). All jsdom-clean — NO browser, NO HW-accel sub-claim
 * (the WebKit native-parity assertion is DROPPED per the full-loop RE-SCOPE).
 *
 * POST-CURE-ONLY anchors — each names a symbol absent from the uncured source,
 * so the gate is RED today by construction and false-passes on NOTHING. Exits 1
 * on any residual.
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
    "proof:emerging-css-resolve-NOW — P.W13 (if(supports/media) + spring() lowering)",
);

// R.W2b carved the resolve recursion into the `resolve/` zone (env / resolve-if /
// resolve-function + the index core); the RESOLVE SURFACE is the four colocated
// files, so a clause's anchor is found wherever the carve landed it.
const RESOLVE = [
    "src/animation/resolve/index.ts",
    // S.B4 — the barrel was thinned; the core recursion + the spring-css
    // timing-function helpers carved into siblings (a02 F3/F4). The RESOLVE
    // surface is the concatenation, so a clause anchors wherever the carve
    // landed it (resolveValues/hasResolvableValue/hasPhase2Node → core.ts;
    // springCssToOptions + the spring algebra → spring-css.ts).
    "src/animation/resolve/core.ts",
    "src/animation/resolve/spring-css.ts",
    "src/animation/resolve/env.ts",
    "src/animation/resolve/resolve-if.ts",
    "src/animation/resolve/resolve-function.ts",
];
const ADAPTER = "src/animation/compile/adapter.ts";

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

// ── module-exists — the resolve-values lowering pass + its public surface ───────
requireAll("module-exists", RESOLVE, [
    {
        name: "export resolveValues (the recursive ValueArray rewriter)",
        re: /export\s+const\s+resolveValues\b/,
    },
    {
        name: "the DROP sentinel (guaranteed-invalid if() omits the declaration)",
        re: /export\s+const\s+DROP\s*=\s*Symbol\(/,
    },
    {
        name: "springCssToOptions (kf-owned (m,k,c,v0) → (response, dampingFraction))",
        re: /export\s+const\s+springCssToOptions\b/,
    },
    {
        name: "the spring algebra response = 2π·√(m/k)",
        re: /2\s*\*\s*Math\.PI\s*\*\s*Math\.sqrt\(\s*mass\s*\/\s*stiffness\s*\)/,
    },
    {
        name: "the dampingFraction algebra c / (2·√(k·m))",
        re: /damping\s*\/\s*\(\s*2\s*\*\s*Math\.sqrt\(\s*stiffness\s*\*\s*mass\s*\)\s*\)/,
    },
    {
        name: "if() condition evaluation via CSS.supports (the env-injected supports)",
        re: /ctx\.env\.supports/,
    },
    {
        name: "if(media(...)) evaluation via matchMedia (the env-injected matchMedia)",
        re: /ctx\.env\.matchMedia/,
    },
]);

// ── seam-wired — the adapter threads the pass at the resolveKeyframes → flatten
//    seam + collects the @function registry (the value.js-P call-inlining seam) ─
{
    const src = read(ADAPTER);
    const anchors = [
        {
            // S.B3 C-9 — adapter re-homed to compile/adapter.ts, so it reaches
            // the resolve zone barrel one level up (`../resolve`, was `./resolve`).
            name: "adapter imports resolveValues from the ../resolve barrel",
            re: /resolveValues[\s\S]*?from\s+["']\.\.\/resolve["']|from\s+["']\.\.\/resolve["']/,
        },
        {
            name: "adapter invokes resolveValues in declsToVarMap (the flatten seam)",
            re: /resolveValues\(/,
        },
        {
            name: "adapter collects the @function registry via extractFunctions",
            re: /extractFunctions\(/,
        },
        {
            name: "ResolvedKeyframes carries the functions registry",
            re: /functions:\s*Map<string,\s*CustomFunctionDescriptor>/,
        },
    ];
    if (!existsSync(join(root, ADAPTER))) {
        fail("seam-wired", `${ADAPTER} does not exist.`);
    } else {
        const missing = anchors.filter(({ re }) => !re.test(src));
        if (missing.length > 0) {
            fail(
                "seam-wired",
                `${ADAPTER} is missing: ${missing
                    .map((m) => m.name)
                    .join("; ")} — the resolveKeyframes → flatten seam is not wired.`,
            );
        } else {
            ok("seam-wired", `${ADAPTER} locks ${anchors.length} seam anchor(s)`);
        }
    }
}

if (failures.length > 0) {
    console.error("\nproof:emerging-css-resolve-NOW FAILED:");
    for (const f of failures) console.error(f);
    console.error(
        "\nThe Phase-1 emerging-CSS lowering pass is not wired. The behaviour " +
            "half (vitest run test/resolve/emerging-css-resolve-now.test.ts) carries the " +
            "live resolution observables; this source half confirms the pass + " +
            "the seam are in place.",
    );
    process.exit(1);
}
console.log(
    "\nproof:emerging-css-resolve-NOW source-shape: all anchors locked.",
);
