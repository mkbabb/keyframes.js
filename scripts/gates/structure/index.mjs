#!/usr/bin/env node
/**
 * proof:structure — the ONE standing structural gate (Tranche V, W4).
 *
 * Encodes the R2-05 library target-tree grammar (the "one grammar": a pure
 * `index.ts` barrel in every earned dir; an eponymous primary or kind-named
 * siblings; no dir-stutter; no hollow shims; a 500 raw-line ceiling; no
 * kind-buckets) as five falsifiable rules, so the settled tree cannot re-drift.
 *
 * Five rules:
 *   R1  dir-prefix stutter — a file whose basename repeats its parent dir name
 *       as a prefix (`easing/easing-option.ts`). Eponymous (`group/group.ts`)
 *       is the allowed grammar, NOT a stutter.
 *   R2  single-consumer fragment / hollow shim — a non-barrel file that is
 *       either (shim) pure re-export substance-free, or (fragment) the lone
 *       non-eponymous member stranded in its own directory. It belongs folded
 *       into the module that owns it.
 *   R3  impure-barrel ban — an `index.ts` that does anything beyond re-export
 *       from a REAL module: it carries local logic/declarations, OR it launders
 *       its exports through a hollow shim (an avoidable double hop).
 *   R4  500 raw-line ceiling — a source file over the ceiling (allowlist EMPTY
 *       at birth).
 *   R5  kind-dir ban — a `{components,composables,utils}`-style kind directory.
 *
 * BIRTH SCOPE: `src/` only (default). R1–R3 carry live reds against the
 * pre-move library tree; R4/R5 are PREVENTIVE on src (src max is 484L; src has
 * zero kind-dirs) and their live red witnesses are staged at W8, when the scope
 * extends to `demo/`. Extending to demo is the one-line change `--scope=demo`
 * (SCOPES.demo below is already authored: it adds `.vue` to the file set so
 * `ChannelOptions.vue` (609L, R4) and the instrument kind-dirs (R5) red).
 *
 * Usage:
 *   node scripts/gates/structure/index.mjs                 # scope=src (default)
 *   node scripts/gates/structure/index.mjs --scope=demo    # future (W8)
 *   node scripts/gates/structure/index.mjs --rule=R1       # one rule's hits only
 *   node scripts/gates/structure/index.mjs --selftest      # non-vacuity proof
 *
 * Exit non-zero listing every violation (rule ID + path). Honest and fallible:
 * `--selftest` proves every rule CAN pass (clean fixture → 0) and CAN fail
 * (dirty fixture → each rule fires).
 */
import {
    existsSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    readdirSync,
    rmSync,
    statSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

// ── Configuration ────────────────────────────────────────────────────────────

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

// Per-scope config. Extending the gate to demo/ at W8 is selecting `demo` here
// (`--scope=demo`) — one line, no rule edits.
const SCOPES = {
    src: {
        roots: ["src"],
        fileExtensions: [".ts"],
        lineCeiling: 500,
        // Justified line-ceiling exemptions. EMPTY at birth (R2-05 LT-01) — the
        // policy is 500 raw lines with an empty allowlist; src max is 484L.
        lineCeilingAllowlist: [],
    },
    demo: {
        roots: ["demo"],
        fileExtensions: [".ts", ".vue"],
        lineCeiling: 500,
        lineCeilingAllowlist: [],
    },
};
const DEFAULT_SCOPE = "src";

// Kind-bucket directory names the grammar forbids (R5). Colocation puts a unit
// with its module, not in a by-role heap.
const KIND_DIR_NAMES = new Set([
    "components",
    "composables",
    "utils",
    "helpers",
    "hooks",
    "mixins",
    "services",
]);

const RULE_IDS = ["R1", "R2", "R3", "R4", "R5"];

// ── Filesystem walk ──────────────────────────────────────────────────────────

const IGNORED_DIRS = new Set(["node_modules", ".git", "dist"]);

/** Recursively list every directory under `root` (inclusive). */
function listDirs(root) {
    const out = [];
    const walk = (dir) => {
        out.push(dir);
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
            if (!entry.isDirectory()) continue;
            if (IGNORED_DIRS.has(entry.name) || entry.name.startsWith(".")) continue;
            walk(join(dir, entry.name));
        }
    };
    walk(root);
    return out;
}

/** Direct source-file children of `dir` (names), filtered to scope extensions. */
function directSourceFiles(dir, extensions) {
    return readdirSync(dir, { withFileTypes: true })
        .filter((e) => e.isFile())
        .map((e) => e.name)
        .filter((n) => extensions.includes(extname(n)) && !n.endsWith(".d.ts"));
}

function isBarrel(name) {
    return name === "index.ts" || name === "index.mjs";
}

function baseNoExt(name) {
    return name.slice(0, name.length - extname(name).length);
}

// ── Re-export analysis (for R2 hollow-shim + R3 barrel purity) ───────────────

function stripComments(src) {
    let s = src.replace(/\/\*[\s\S]*?\*\//g, "");
    s = s
        .split("\n")
        .map((line) => {
            const idx = line.indexOf("//");
            // Keep protocol-like `://` (a `//` immediately after `:`) intact.
            if (idx >= 0 && (idx === 0 || line[idx - 1] !== ":")) return line.slice(0, idx);
            return line;
        })
        .join("\n");
    return s;
}

const REEXPORT_PATTERNS = [
    /\bexport\s+type\s+\*\s*(?:as\s+\w+\s+)?from\s+["']([^"']+)["']\s*;?/g,
    /\bexport\s+\*\s*(?:as\s+\w+\s+)?from\s+["']([^"']+)["']\s*;?/g,
    /\bexport\s+type\s*\{[^}]*\}\s*from\s+["']([^"']+)["']\s*;?/g,
    /\bexport\s*\{[^}]*\}\s*from\s+["']([^"']+)["']\s*;?/g,
];

/**
 * Classify a module by its re-export shape.
 * @returns {{sources: string[], reexportCount: number, remainder: string}}
 *   `sources` = the specifier of every `... from "spec"` re-export;
 *   `remainder` = the code left after removing every re-export (whitespace/`;`
 *   only ⇒ the file is nothing but re-exports).
 */
function analyzeReexports(src) {
    let code = stripComments(src);
    const sources = [];
    let count = 0;
    for (const re of REEXPORT_PATTERNS) {
        code = code.replace(re, (_m, spec) => {
            sources.push(spec);
            count += 1;
            return "";
        });
    }
    const remainder = code.replace(/[\s;]+/g, "");
    return { sources, reexportCount: count, remainder };
}

/**
 * A hollow shim: a non-barrel file that is exclusively re-exports AND is a
 * redundant one-hop pass-through — every re-export targets the SAME single
 * sibling module (e.g. `presets/classic.ts` → all from `./catalog`). A file
 * that AGGREGATES many modules is a surface/barrel, NOT a shim — this is how
 * the frozen `./engine` surface `public.ts` (many sources) is correctly
 * excluded, so the gate never orders a fold of the frozen public surface.
 */
function isHollowShim(name, src) {
    if (isBarrel(name)) return false;
    const { sources, reexportCount, remainder } = analyzeReexports(src);
    if (reexportCount === 0 || remainder !== "") return false;
    const unique = new Set(sources);
    const allRelative = sources.every((s) => s.startsWith("."));
    return allRelative && unique.size === 1;
}

/** Resolve a relative re-export specifier to an on-disk file path, if it exists. */
function resolveRelativeSpecifier(fromFile, spec, extensions) {
    if (!spec.startsWith(".")) return null; // package / alias — not our concern
    const baseDir = dirname(fromFile);
    const candidates = [];
    for (const ext of extensions) candidates.push(resolve(baseDir, spec + ext));
    for (const ext of extensions) candidates.push(resolve(baseDir, spec, "index" + ext));
    candidates.push(resolve(baseDir, spec)); // already has extension
    for (const c of candidates) {
        if (existsSync(c) && statSync(c).isFile()) return c;
    }
    return null;
}

// ── Rules ────────────────────────────────────────────────────────────────────

/**
 * Evaluate all five rules over a scope config rooted at `rootAbs`.
 * @returns {Array<{rule: string, path: string, message: string}>}
 */
function evaluate(rootAbs, scope) {
    const findings = [];
    const { fileExtensions, lineCeiling, lineCeilingAllowlist } = scope;
    const allowlist = new Set(lineCeilingAllowlist);

    const dirs = listDirs(rootAbs);

    // First pass: index every source file, and pre-compute the hollow-shim set
    // (R3 needs it to detect launder-through-shim barrels).
    const sourceFiles = []; // { abs, name, dir }
    const shimSet = new Set(); // abs paths of hollow shims
    for (const dir of dirs) {
        for (const name of directSourceFiles(dir, fileExtensions)) {
            const abs = join(dir, name);
            sourceFiles.push({ abs, name, dir });
            const src = readFileSync(abs, "utf8");
            if (isHollowShim(name, src)) shimSet.add(abs);
        }
    }

    const rel = (abs) => relative(rootAbs, abs).split(sep).join("/");

    for (const { abs, name, dir } of sourceFiles) {
        const src = readFileSync(abs, "utf8");
        const dirName = basename(dir);
        const fileBase = baseNoExt(name);

        // ── R1: dir-prefix stutter ────────────────────────────────────────
        if (
            !isBarrel(name) &&
            fileBase !== dirName &&
            fileBase.startsWith(dirName + "-")
        ) {
            findings.push({
                rule: "R1",
                path: rel(abs),
                message: `basename "${fileBase}" repeats its parent dir "${dirName}" as a prefix (dir-stutter) — rename to drop the "${dirName}-" prefix`,
            });
        }

        // ── R2 (shim arm): hollow shim ────────────────────────────────────
        if (shimSet.has(abs)) {
            findings.push({
                rule: "R2",
                path: rel(abs),
                message: `hollow shim — the file is nothing but re-exports (substance-free); fold it into the module that consumes it`,
            });
        }

        // ── R3: impure barrel ─────────────────────────────────────────────
        if (isBarrel(name)) {
            const { sources, reexportCount, remainder } = analyzeReexports(src);
            if (remainder !== "") {
                // arm (a): local logic/declarations in a barrel (preventive on
                // src — all barrels are content-pure today).
                findings.push({
                    rule: "R3",
                    path: rel(abs),
                    message: `impure barrel — an index barrel must contain only re-exports, but this one holds local logic/declarations`,
                });
            } else {
                // arm (b): laundering exports through a hollow shim.
                const laundered = [];
                for (const spec of sources) {
                    const target = resolveRelativeSpecifier(abs, spec, fileExtensions);
                    if (target && shimSet.has(target)) laundered.push(spec);
                }
                if (laundered.length > 0) {
                    findings.push({
                        rule: "R3",
                        path: rel(abs),
                        message: `impure barrel — re-exports through hollow shim(s) ${laundered
                            .map((s) => `"${s}"`)
                            .join(", ")} instead of the real source; repoint to the substance module`,
                    });
                }
            }
            void reexportCount;
        }

        // ── R4: 500 raw-line ceiling ──────────────────────────────────────
        const rawLines = src.split("\n").length;
        if (rawLines > lineCeiling && !allowlist.has(rel(abs))) {
            findings.push({
                rule: "R4",
                path: rel(abs),
                message: `${rawLines} raw lines exceeds the ${lineCeiling}-line ceiling (allowlist has no entry for this file)`,
            });
        }
    }

    // ── R2 (fragment arm): lone non-eponymous member stranded in its own dir ─
    for (const dir of dirs) {
        if (dir === rootAbs) continue;
        const nonIndex = directSourceFiles(dir, fileExtensions).filter((n) => !isBarrel(n));
        if (nonIndex.length !== 1) continue;
        const only = nonIndex[0];
        const dirName = basename(dir);
        if (baseNoExt(only) === dirName) continue; // eponymous primary — allowed
        findings.push({
            rule: "R2",
            path: rel(join(dir, only)),
            message: `single-member fragment — the sole non-barrel file in "${rel(dir)}/" is not eponymous with its dir; fold it into the parent/consumer module rather than stranding it in its own directory`,
        });
    }

    // ── R5: kind-dir ban ──────────────────────────────────────────────────
    for (const dir of dirs) {
        if (KIND_DIR_NAMES.has(basename(dir))) {
            findings.push({
                rule: "R5",
                path: rel(dir) + "/",
                message: `kind directory "${basename(dir)}" — colocate units with their module, not in a by-role bucket`,
            });
        }
    }

    // Stable ordering: by rule, then path.
    findings.sort((a, b) => a.rule.localeCompare(b.rule) || a.path.localeCompare(b.path));
    return findings;
}

// ── Runner ───────────────────────────────────────────────────────────────────

function runScope(scopeName, ruleFilter) {
    const scope = SCOPES[scopeName];
    if (!scope) {
        console.error(`proof:structure — unknown scope "${scopeName}" (known: ${Object.keys(SCOPES).join(", ")})`);
        process.exit(2);
    }
    let findings = [];
    for (const root of scope.roots) {
        const rootAbs = resolve(REPO_ROOT, root);
        if (!existsSync(rootAbs)) {
            console.error(`proof:structure — scope root "${root}" not found at ${rootAbs}`);
            process.exit(2);
        }
        findings.push(...evaluate(rootAbs, scope).map((f) => ({ ...f, path: `${root}/${f.path}` })));
    }
    if (ruleFilter) findings = findings.filter((f) => f.rule === ruleFilter);

    const header = ruleFilter
        ? `proof:structure — scope=${scopeName} rule=${ruleFilter}`
        : `proof:structure — scope=${scopeName}`;
    console.log(header);

    if (findings.length === 0) {
        console.log(
            ruleFilter
                ? `proof:structure — PASS: ${ruleFilter} clean on scope=${scopeName} (0 violations)`
                : `proof:structure — PASS: scope=${scopeName} clean (0 violations across R1–R5)`,
        );
        return 0;
    }

    for (const f of findings) console.log(`  ${f.rule}  ${f.path}\n        ${f.message}`);

    const counts = RULE_IDS.map((id) => `${id}×${findings.filter((f) => f.rule === id).length}`).join(" ");
    console.error(
        `proof:structure — FAIL: ${findings.length} violation(s) on scope=${scopeName}` +
            (ruleFilter ? ` (rule ${ruleFilter})` : ` [${counts}]`),
    );
    return 1;
}

// ── Self-test (non-vacuity proof) ────────────────────────────────────────────

function writeFixtureFile(root, relPath, content) {
    const abs = join(root, relPath);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, content);
}

function buildCleanFixture(root) {
    // A well-formed module: pure barrel over real members; an eponymous primary
    // in its own dir; no stutter, shim, oversize file, or kind-dir.
    writeFixtureFile(root, "widget/index.ts", `export { makeWidget } from "./factory";\nexport type * from "./types";\n`);
    writeFixtureFile(root, "widget/factory.ts", `export function makeWidget() {\n  return { kind: "widget" };\n}\n`);
    writeFixtureFile(root, "widget/types.ts", `export type Widget = { kind: string };\n`);
    writeFixtureFile(root, "widget/panel/panel.ts", `export const panel = 1;\n`); // eponymous — allowed
    writeFixtureFile(root, "widget/panel/index.ts", `export { panel } from "./panel";\n`);
}

function buildDirtyFixture(root) {
    // R1 — dir-prefix stutter.
    writeFixtureFile(root, "toolbar/toolbar-button.ts", `export const btn = 1;\n`);
    writeFixtureFile(root, "toolbar/index.ts", `export { btn } from "./toolbar-button";\n`);
    // R2 shim + R3 launder-through-shim.
    writeFixtureFile(root, "catalog/real.ts", `export const alpha = 1;\nexport const beta = 2;\n`);
    writeFixtureFile(root, "catalog/shim.ts", `export { alpha, beta } from "./real";\n`); // hollow shim (R2)
    writeFixtureFile(root, "catalog/index.ts", `export { alpha, beta } from "./shim";\n`); // launders (R3)
    // R2 fragment — lone non-eponymous member stranded in its own dir.
    writeFixtureFile(root, "stranded/core.ts", `export const core = 1;\n`);
    // R4 — over the 500-line ceiling.
    writeFixtureFile(root, "huge.ts", "export const x = 1;\n".repeat(501));
    // R5 — kind directory.
    writeFixtureFile(root, "utils/thing.ts", `export const thing = 1;\n`);
}

function selftest() {
    const scope = { ...SCOPES.src };
    let ok = true;

    const cleanRoot = mkdtempSync(join(tmpdir(), "proof-structure-clean-"));
    const dirtyRoot = mkdtempSync(join(tmpdir(), "proof-structure-dirty-"));
    try {
        buildCleanFixture(cleanRoot);
        const cleanFindings = evaluate(cleanRoot, scope);
        const cleanPass = cleanFindings.length === 0;
        console.log(`selftest · clean fixture → ${cleanFindings.length} finding(s) — ${cleanPass ? "PASS (every rule CAN pass)" : "FAIL"}`);
        if (!cleanPass) {
            for (const f of cleanFindings) console.log(`    unexpected ${f.rule} ${f.path} — ${f.message}`);
            ok = false;
        }

        buildDirtyFixture(dirtyRoot);
        const dirtyFindings = evaluate(dirtyRoot, scope);
        const fired = new Set(dirtyFindings.map((f) => f.rule));
        console.log(`selftest · dirty fixture → ${dirtyFindings.length} finding(s); rules fired: ${[...fired].sort().join(", ") || "none"}`);
        for (const f of dirtyFindings) console.log(`    ${f.rule}  ${f.path} — ${f.message}`);
        for (const id of RULE_IDS) {
            const hit = fired.has(id);
            console.log(`selftest · rule ${id} CAN fail — ${hit ? "PASS" : "FAIL (rule never fired on the dirty fixture)"}`);
            if (!hit) ok = false;
        }
    } finally {
        rmSync(cleanRoot, { recursive: true, force: true });
        rmSync(dirtyRoot, { recursive: true, force: true });
    }

    console.log(ok ? "selftest — PASS: every rule can pass on clean and fail on dirty (non-vacuous)." : "selftest — FAIL: a rule is vacuous.");
    return ok ? 0 : 1;
}

// ── CLI ──────────────────────────────────────────────────────────────────────

function main() {
    const args = process.argv.slice(2);
    if (args.includes("--selftest")) process.exit(selftest());

    let scopeName = DEFAULT_SCOPE;
    let ruleFilter = null;
    for (const a of args) {
        if (a.startsWith("--scope=")) scopeName = a.slice("--scope=".length);
        else if (a.startsWith("--rule=")) ruleFilter = a.slice("--rule=".length);
        else {
            console.error(`proof:structure — unknown argument "${a}"`);
            process.exit(2);
        }
    }
    if (ruleFilter && !RULE_IDS.includes(ruleFilter)) {
        console.error(`proof:structure — unknown rule "${ruleFilter}" (known: ${RULE_IDS.join(", ")})`);
        process.exit(2);
    }
    process.exit(runScope(scopeName, ruleFilter));
}

main();
