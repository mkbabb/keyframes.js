#!/usr/bin/env node
/**
 * proof:no-orphan-module — S.C1 (the hardened reachability walker; SC-2, sc-§2.1/§2.3).
 *
 * THE DEFECT CLASS (SPEC §2.1-3, T6). `animate.ts` was R's own instance of the
 * failure mode R condemned in Q: 213 LOC, ZERO importers, excluded from every
 * published surface, kept alive ONLY by two self-referential test files. A module
 * that no reachable entry point imports is a ZOMBIE — dead code masquerading as
 * live. This gate makes the class STRUCTURAL: it walks the import graph of
 * `src/animation` from the package's entry roots and REDs on any module the walk
 * cannot reach. A re-introduced zero-importer file (the next `animate.ts`) reds
 * here from t=0 — the orphan class can no longer recur silently.
 *
 * ── CLAUSE A — reachability (the walker) ─────────────────────────────────────
 * The walk is DYNAMIC-IMPORT-AWARE. `load-engine.ts` reaches the ENTIRE heavy
 * lazy surface through `import("./engine/index")` / `import("./group/index")` /
 * `import("./svg/…")` / … string specifiers — a walker that follows only STATIC
 * `import … from` edges would find the whole HEAVY surface unreachable and
 * false-RED it, WHILE `animate.ts` stayed indistinguishable from a genuine lazy
 * split (SPEC §7 T6 falsifiability). So the walker resolves dynamic `import()`
 * string specifiers as real graph edges — that is the discriminator that keeps
 * the HEAVY surface reachable and leaves ONLY the true orphan flagged.
 *
 * ENTRY ROOTS (root-set-agnostic / derived — T7). The four PINNED package entries
 * are the boundary files: the `.` barrel `index.ts`, its dynamic half
 * `load-engine.ts`, the `./engine` subpath's zone barrel `engine/index.ts`, and
 * its composition barrel `public.ts` (S.B2 hoisted it out of `engine/` to the
 * `src/animation` root beside `load-engine.ts`; the build-entry SINK nothing
 * imports; vite.config's `engine/index` source). PLUS every zone `index.ts` barrel — the
 * R.W1 convention gave each cohesive zone an `index.ts` API surface; a zone barrel
 * is an entry surface BY CONSTRUCTION (the LIGHT `.` barrel imports zone leaves
 * directly, so `physics/index.ts` / `orchestration/index.ts` have no in-repo
 * importer yet are not dead — they are the zones' declared APIs). (`internal/`
 * carries NO barrel — it is the leaf tier; its `index.ts` was deleted at S.B4,
 * and its leaves stay reachable via the DIRECT `./internal/*` edges below.)
 * Deriving the barrels dynamically (rather than pinning a frozen 4) is what lets
 * this gate SURVIVE the T7 root-set perturbations without a re-author: S.B4 may
 * delete `internal/index.ts` (a deleted root simply drops out; its leaves stay
 * reachable via the direct `./internal/*` edges) and S.B6 may rewrite the loader
 * (the dynamic specifiers are parsed from source, not hardcoded, so a rewrite is
 * absorbed). A missing pinned root is skipped, never a crash.
 *
 * ── CLAUSE B — the front-door reference (scoped; S5, SC-3) ────────────────────
 * Zero references to the excised front-door symbol `animate` outside the
 * `Element.animate()` / CHANGELOG allowlist. A bare-substring `animate(` scan
 * would false-RED on WAAPI prose (`Element.animate()`, `target.animate(...)`) and
 * on changelog history — so the clause is SCOPED to the front-door symbol: an
 * `import … animate` binding, or a call `animate(` NOT preceded by `.` / a word
 * char (a method call `x.animate(` / `Element.animate(` is exempt). Comments are
 * stripped before the scan (WAAPI narration in a code comment is prose, not a
 * re-introduction); prose docs (CHANGELOG.md / README.md / *.md) are not scanned.
 *
 * Born-RED today: `animate.ts` is a zero-importer orphan (clause A) and the two
 * self-referential test files import + call `animate` (clause B). GREEN after
 * S.C1 deletes the file + its tests + scrubs the doc mentions — and the HEAVY
 * lazy surface is NOT false-RED (the dynamic edges keep it reachable).
 *
 * CI posture: HARD — a structural, device-independent reachability + grep oracle.
 *
 * RUN: node scripts/proof-no-orphan-module.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(REPO, "src/animation");

// The PINNED package entry roots (SPEC §3 S.C1 S4). The zone `index.ts` barrels
// are added derivationally below — the set is not a frozen literal (T7).
const PINNED_ROOTS = [
    "index.ts",
    "load-engine.ts",
    "engine/index.ts",
    "public.ts",
];

const failures = [];

// ── shared source helpers ─────────────────────────────────────────────────────

/** Strip block, line, and HTML comments so prose never forges a graph edge. */
function stripComments(s) {
    s = s.replace(/\/\*[\s\S]*?\*\//g, "");
    s = s.replace(/<!--[\s\S]*?-->/g, "");
    s = s.replace(/(^|[^:"'`])\/\/.*$/gm, (_m, p1) => p1);
    return s;
}

/** Every module specifier referenced by a file: static `from`, dynamic import(), side-effect import. */
function specifiers(src) {
    const code = stripComments(src);
    const out = [];
    let m;
    const staticRe = /\bfrom\s*["']([^"']+)["']/g;
    while ((m = staticRe.exec(code))) out.push(m[1]);
    const dynRe = /\bimport\s*\(\s*["']([^"']+)["']/g;
    while ((m = dynRe.exec(code))) out.push(m[1]);
    const sideRe = /(?:^|[\s;])import\s+["']([^"']+)["']/g;
    while ((m = sideRe.exec(code))) out.push(m[1]);
    return out;
}

/** Resolve a relative specifier to a concrete `.ts` file (bundler resolution). */
function resolveSpec(fromFile, spec) {
    if (!spec.startsWith(".")) return null; // bare / aliased — not a src/animation edge
    const base = path.resolve(path.dirname(fromFile), spec);
    for (const cand of [base + ".ts", path.join(base, "index.ts"), base]) {
        if (cand.endsWith(".ts") && fs.existsSync(cand) && fs.statSync(cand).isFile())
            return cand;
    }
    return null;
}

/** Every `.ts` (non-`.d.ts`) file under a directory. */
function collectTs(dir) {
    const out = [];
    (function walk(d) {
        for (const e of fs.readdirSync(d, { withFileTypes: true })) {
            const p = path.join(d, e.name);
            if (e.isDirectory()) walk(p);
            else if (e.name.endsWith(".ts") && !e.name.endsWith(".d.ts")) out.push(p);
        }
    })(dir);
    return out;
}

// ═════════════════════════════════════════════════════════════════════════════
// CLAUSE A — reachability: no orphan module under src/animation
// ═════════════════════════════════════════════════════════════════════════════

console.log("clause A — reachability walk (dynamic-import-aware, zone-barrel roots)");

const allTs = collectTs(SRC);
const barrels = allTs.filter((f) => path.basename(f) === "index.ts");
const roots = new Set(
    [
        ...PINNED_ROOTS.map((r) => path.join(SRC, r)),
        ...barrels, // every zone barrel is an entry surface by construction (R.W1)
    ].filter((f) => fs.existsSync(f)),
);
const missingPinned = PINNED_ROOTS.filter(
    (r) => !fs.existsSync(path.join(SRC, r)),
);
if (missingPinned.length > 0) {
    // Not a failure (T7: roots are perturbed by S.B2/S.B4/S.B6) — recorded, then skipped.
    console.log(
        `  · pinned root(s) absent (skipped, T7 root-set perturbation): ${missingPinned.join(", ")}`,
    );
}

const reachable = new Set(roots);
const queue = [...roots];
while (queue.length) {
    const f = queue.shift();
    for (const spec of specifiers(fs.readFileSync(f, "utf8"))) {
        const r = resolveSpec(f, spec);
        if (r && r.startsWith(SRC) && !reachable.has(r)) {
            reachable.add(r);
            queue.push(r);
        }
    }
}

const orphans = allTs
    .filter((f) => !reachable.has(f))
    .map((f) => path.relative(SRC, f))
    .sort();

if (orphans.length > 0) {
    failures.push(
        "clause A (reachability) — ORPHAN module(s) under src/animation reachable from " +
            "NO entry root (a zero-importer zombie — dead code masquerading as live, the " +
            "animate.ts defect class): " +
            orphans.join(", ") +
            ". Delete it (T6: body + tests + gates + doc mentions), or wire it onto a real " +
            "entry surface. The walk follows STATIC and DYNAMIC `import()` edges from the " +
            "pinned package entries + every zone barrel.",
    );
} else {
    console.log(
        `  ✓ all ${allTs.length} src/animation modules are reachable from the ` +
            `${roots.size} entry roots (the HEAVY lazy surface via dynamic import() edges — ` +
            `NOT false-RED); zero orphans.`,
    );
}

// ═════════════════════════════════════════════════════════════════════════════
// CLAUSE B — the front-door `animate` reference, scoped (S5, SC-3)
// ═════════════════════════════════════════════════════════════════════════════

console.log(
    "\nclause B — zero front-door `animate` references (import / bare-call), scoped",
);

// The source scan set: the library + the demo + the tests. Prose docs
// (CHANGELOG.md / README.md / *.md) are NOT scanned — the CHANGELOG-history +
// WAAPI-prose allowlist is satisfied by scanning code only.
function collectSources() {
    const out = [];
    const exts = new Set([".ts", ".vue"]);
    for (const root of ["src", "demo", "test"]) {
        const abs = path.join(REPO, root);
        if (!fs.existsSync(abs)) continue;
        (function walk(d) {
            for (const e of fs.readdirSync(d, { withFileTypes: true })) {
                if (e.name === "node_modules" || e.name.startsWith(".")) continue;
                const p = path.join(d, e.name);
                if (e.isDirectory()) walk(p);
                else if (exts.has(path.extname(e.name)) && !e.name.endsWith(".d.ts"))
                    out.push(p);
            }
        })(abs);
    }
    return out;
}

const frontDoorHits = [];
// A call to the front door: `animate(` NOT preceded by `.` (method call) or a word
// char (`reanimate(`). `Element.animate()` / `target.animate(...)` are exempt.
const CALL_RE = /(^|[^.\w])animate\s*\(/;
// An import binding named exactly `animate` (word-boundary excludes
// `animation` / `Animated` / `animateMotion`).
const IMPORT_ANIMATE_RE = /\banimate\b/;

for (const file of collectSources()) {
    const rel = path.relative(REPO, file);
    const code = stripComments(fs.readFileSync(file, "utf8"));
    // (i) import binding — whole import statements, then the pre-`from` binding list.
    for (const stmt of code.matchAll(/\bimport\b[^;]*?\bfrom\s*["'][^"']+["']/gs)) {
        const bindings = stmt[0].split(/\bfrom\b/)[0];
        if (IMPORT_ANIMATE_RE.test(bindings)) {
            frontDoorHits.push(`${rel} — import binds the front-door \`animate\``);
        }
    }
    // (ii) bare call — per line for a precise locator.
    code.split("\n").forEach((line, i) => {
        if (CALL_RE.test(line)) {
            frontDoorHits.push(
                `${rel}:${i + 1} — bare \`animate(\` call (not \`.animate(\`/\`Element.animate(\`)`,
            );
        }
    });
}

if (frontDoorHits.length > 0) {
    failures.push(
        "clause B (front-door reference) — the excised `animate` front-door symbol is " +
            "still imported/called outside the `Element.animate()` / CHANGELOG allowlist:\n    " +
            frontDoorHits.join("\n    ") +
            "\n  The single-call `animate()` front door was DELETED (R.W4 excision / S.C1); a " +
            "surviving import or bare call re-introduces the zombie. Use " +
            "`new CSSKeyframesAnimation(...)` (or `loadAnimationEngine()`) instead.",
    );
} else {
    console.log(
        "  ✓ zero front-door `animate` imports / bare `animate(` calls in src/demo/test " +
            "(the `.animate(` WAAPI method + CHANGELOG history are correctly exempt).",
    );
}

// ── report ────────────────────────────────────────────────────────────────────
if (failures.length > 0) {
    console.error(
        `\nproof:no-orphan-module — FAIL (${failures.length} finding(s)):`,
    );
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}
console.log(
    "\nproof:no-orphan-module — PASS: every src/animation module is reachable from " +
        "the entry roots (dynamic-import-aware; the HEAVY lazy surface NOT false-RED), " +
        "and the excised `animate` front door has zero surviving references. The " +
        "zero-importer zombie class is structural.",
);
process.exit(0);
