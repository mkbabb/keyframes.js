#!/usr/bin/env node
/**
 * proof:claude-paths-live — S.A5 doc-authority gate (born-RED by construction).
 *
 * The `proof:readme-paths-live` sibling, aimed at the THREE CLAUDE.md files
 * (root, `src/animation/`, `demo/`) instead of README.md. Fold row 41 (S.md §3
 * item 4): root CLAUDE.md compounds "seven-zone" vs the shipped dir count,
 * `waapi/` invisible, a wrong HEAVY export list; `src/animation/CLAUDE.md`
 * documents the pre-R.W1 flat tree wholesale (nine independently-hit lanes).
 *
 * FOUR falsifiable clauses, each independently BITES:
 *
 *   (a) TREE-FENCE PATHS — every node of every ASCII directory-tree diagram
 *       (a fenced ``` block containing `├`/`└`) resolves on disk, anchored per
 *       file (root + demo/CLAUDE.md anchor at the repo root; src/animation/
 *       CLAUDE.md anchors at `src/`, since its tree's root token is
 *       `animation/` not `src/animation/`).
 *
 *   (b) INLINE BACKTICK PATHS — every remaining backtick-quoted token that
 *       LOOKS like a concrete relative path (ends `/` or carries a known
 *       source extension; no spaces/`<>`/`*`/`|`/`:` — which excludes shell
 *       command examples, `<name>`-template placeholders, and glob patterns)
 *       resolves on disk. A `@scope/pkg` token resolves against `package.json`
 *       dependencies instead of the filesystem; a bare `@/…` token substitutes
 *       the literal `demo/@/` directory (an actual on-disk dir named `@`, not
 *       a bundler alias — confirmed against vite.config.ts/tsconfig.json,
 *       neither of which declares a bare `@` alias).
 *
 *   (c) EXPORT-LIST FIDELITY (root CLAUDE.md only) — every backtick symbol
 *       named in the "HEAVY (dynamic …)" bullet is a property key of the
 *       built `AnimationEngine` interface (`dist/keyframes.d.ts`) — the exact
 *       falsifiability SPEC §3 S.A5 S1 names ("the HEAVY export list ⊆
 *       AnimationEngine keys"). Every backtick symbol named in the "LIGHT
 *       (static named exports…)" bullet is SOME top-level `export` of
 *       `dist/keyframes.d.ts` (a looser existence check — it is not required
 *       to sit in the AnimationEngine surface, just to be real).
 *
 *   (d) ZONE-COUNT SELF-CONSISTENCY (root CLAUDE.md only) — the stated
 *       "partitioned into <N> cohesive zone directories" number-word must
 *       equal the count of backtick-quoted `name/` tokens enumerated in that
 *       SAME sentence. A self-consistency check, not an external "true count"
 *       oracle — it does not adjudicate which directories editorially count
 *       as "zones", only that the prose does not contradict itself.
 *
 * C-8 (gate-first, regen-last): `src/animation/CLAUDE.md` documents the
 * pre-R.W1 flat file layout wholesale (nine lanes — a02/a13/a16/a17/a20/a21/
 * a26/a29, S.md §3 item 4) and stays RED on clauses (a)/(b) until S.B8's full
 * regen against the final post-B tree. That redness is AUTHORIZED backlog,
 * not masked: this script's exit code is the honest aggregate across all
 * three files. S.A5 hot-fixes only the actively-wrong root CLAUDE.md lines
 * (S2) so root + demo/CLAUDE.md clear clean; S.B8 discharges the rest.
 * Per the Verification section (S.A5 spec) this gate is DEVELOPMENT-ONLY —
 * not yet wired into `proof:hygiene-chain`/ci.yml (see the matching EXCLUDED
 * entry + comment in scripts/proof-ci-coverage.mjs) — re-run at S.B8 (fully
 * green) and re-executed again at S.Z2 close.
 *
 * RUN: npm run proof:claude-paths-live
 *      npm run proof:claude-paths-live -- --dump   (diagnostic: print every
 *        extracted path/symbol finding, no pass/fail — parser debugging aid)
 *      npm run proof:claude-paths-live -- --plant-test  (born-RED self-check:
 *        injects one synthetic breakage per clause into a COPY of root
 *        CLAUDE.md's live content, asserts the clause fires, then runs live)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..");

const DUMP = process.argv.includes("--dump");
const PLANT_TEST = process.argv.includes("--plant-test");

const FILES = {
    root: {
        label: "CLAUDE.md",
        path: path.join(REPO, "CLAUDE.md"),
        treeAnchor: REPO,
    },
    "src/animation": {
        label: "src/animation/CLAUDE.md",
        path: path.join(REPO, "src/animation/CLAUDE.md"),
        // The tree's own root token is `animation/`, not `src/animation/` — it
        // anchors one level above the file's own directory.
        treeAnchor: path.join(REPO, "src"),
    },
    demo: {
        label: "demo/CLAUDE.md",
        path: path.join(REPO, "demo/CLAUDE.md"),
        treeAnchor: REPO,
    },
};

const pkg = JSON.parse(fs.readFileSync(path.join(REPO, "package.json"), "utf8"));
const declaredDeps = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.optionalDependencies ?? {}),
]);

// ── clause (a)/(b) shared helpers ───────────────────────────────────────────

const KNOWN_EXT =
    /\.(ts|tsx|vue|js|mjs|cjs|json|md|html|css|txt|jpg|jpeg|png|svg|ico|toml|ya?ml)$/;

function isPathLike(name) {
    if (/[<>*|:"?]/.test(name)) return false; // templates/globs/labels excluded
    if (/\s/.test(name)) return false;
    if (name.endsWith("/")) return true;
    return KNOWN_EXT.test(name);
}

// One ASCII-tree indentation unit is exactly 4 characters: a continuation
// (`│   ` or `    `) or a branch marker (`├── ` or `└── `). Depth = the
// number of units consumed; the LAST unit must be a branch marker (a bare
// top-level name, depth 0, has none at all — that also passes).
const UNIT_RE = /^(│   |    |├── |└── )/;

function parseTreeLine(line) {
    let rest = line;
    let depth = 0;
    let matchedBranch = false;
    for (;;) {
        const m = UNIT_RE.exec(rest);
        if (!m) break;
        rest = rest.slice(m[0].length);
        depth++;
        if (m[0] === "├── " || m[0] === "└── ") {
            matchedBranch = true;
            break;
        }
    }
    // A non-zero depth that never resolved to a branch marker is an
    // irregular/wrapped comment-continuation line (e.g. a hand-wrapped
    // prose aside) — skip rather than mis-assert.
    if (depth > 0 && !matchedBranch) return null;
    if (rest.trim() === "" || rest.trimStart().startsWith("#")) return null;
    const commentIdx = rest.search(/\s{2,}#/);
    const body = (commentIdx === -1 ? rest : rest.slice(0, commentIdx)).trim();
    if (body === "") return null;
    return { depth, body };
}

/** Every fenced ``` block whose body contains a tree-draw glyph. */
function findTreeFences(content) {
    const fences = [];
    const fenceRe = /```[a-zA-Z]*\n([\s\S]*?)```/g;
    let m;
    while ((m = fenceRe.exec(content)) !== null) {
        if (/[├└]/.test(m[1])) fences.push(m[1]);
    }
    return fences;
}

function checkTreeFences(content, anchor) {
    const findings = [];
    for (const body of findTreeFences(content)) {
        const stack = [];
        for (const rawLine of body.split("\n")) {
            const parsed = parseTreeLine(rawLine);
            if (!parsed) continue;
            const { depth, body: nodeBody } = parsed;
            const names = nodeBody
                .split(" / ")
                .map((s) => s.trim())
                .filter(Boolean);
            for (const name of names) {
                if (!isPathLike(name)) continue;
                const parentDir = depth === 0 ? anchor : stack[depth - 1];
                if (parentDir === undefined) continue; // orphaned depth — a parse gap, skip defensively
                const isDir = name.endsWith("/");
                const cleanName = isDir ? name.slice(0, -1) : name;
                const full = path.join(parentDir, cleanName);
                findings.push({
                    name,
                    rel: path.relative(REPO, full),
                    exists: fs.existsSync(full),
                });
                if (isDir) stack[depth] = full;
                stack.length = depth + 1;
            }
        }
    }
    return findings;
}

// Vite/tsconfig path aliases that resolve to a real directory (vite.config.ts
// `resolve.alias` + tsconfig.json `paths`, both checked) — mapped so the
// Conventions section's `@src/`, `@components/`, … mentions resolve to their
// TRUE target rather than a literal (nonexistent) `@src/` directory. `@/` is
// deliberately NOT here: `demo/@/` is a literal on-disk directory named `@`
// (confirmed: neither config declares a bare `@` alias), handled separately.
const ALIAS_MAP = {
    "@src": "src",
    "@components": "demo/@/components",
    "@composables": "demo/@/composables",
    "@styles": "demo/@/styles",
    "@utils": "demo/@/utils",
    "@app": "demo/app",
    "@assets": "assets",
};

/**
 * Inline backtick-quoted tokens outside fenced tree diagrams (clause b).
 *
 * SCOPE (deliberately conservative — see the module docstring): only tokens
 * that are UNAMBIGUOUSLY anchored are checked — an alias (`@src/…`), the
 * literal `@/` dir, a scoped package (`@scope/pkg`), or a token rooted at one
 * of the known top-level segments (`src/`, `demo/`, …). A BARE filename
 * mention (`waapi.ts`, `ControlsPaneWrapper.vue`) is contextual — it means
 * "relative to whatever subdirectory the enclosing prose section is about",
 * which these three files do not state in a machine-anchorable way. Checking
 * those against a single per-file anchor produced false positives (a bare
 * `physics/` mentioned in root CLAUDE.md's intro paragraph is relative to
 * `src/animation/`, not repo root) AND false negatives (demo/CLAUDE.md's
 * component-suite bullets are relative to a nested `@/components/custom/…`
 * subdirectory the surrounding heading names, not `demo/` itself) in equal
 * measure. Clause (a)'s tree-fence walk already gives comprehensive,
 * unambiguous coverage of the full directory shape; clause (b) covers the
 * fully-qualified prose mentions on top of it.
 */
function checkInlinePaths(content) {
    const findings = [];
    // Strip the tree fences themselves — clause (a) already covers them, and
    // their content carries no backticks in these three files anyway.
    const withoutTreeFences = content.replace(/```[a-zA-Z]*\n[\s\S]*?```/g, (block) =>
        /[├└]/.test(block) ? "" : block,
    );
    for (const m of withoutTreeFences.matchAll(/`([^`\n]+)`/g)) {
        const token = m[1];
        if (token.startsWith("@")) {
            if (token === "@/" || token.startsWith("@/")) {
                if (!isPathLike(token)) continue;
                findings.push({
                    name: token,
                    rel: path.relative(REPO, path.join(REPO, "demo/@", token.slice(2))),
                    exists: fs.existsSync(path.join(REPO, "demo/@", token.slice(2))),
                });
                continue;
            }
            const aliasMatch = token.match(/^(@[\w-]+)(\/.*)?$/);
            if (aliasMatch && aliasMatch[1] in ALIAS_MAP) {
                const rest = (aliasMatch[2] ?? "/").slice(1);
                const resolved = path.join(REPO, ALIAS_MAP[aliasMatch[1]], rest);
                findings.push({
                    name: token,
                    rel: path.relative(REPO, resolved),
                    exists: fs.existsSync(resolved),
                });
                continue;
            }
            // `@scope/pkg[...]` — a package reference, not a filesystem path.
            const pkgMatch = token.match(/^(@[\w.-]+\/[\w.-]+)/);
            if (pkgMatch) {
                findings.push({
                    name: token,
                    kind: "package",
                    exists: declaredDeps.has(pkgMatch[1]),
                });
                continue;
            }
            continue; // an unrecognized `@…` token — not checked (bare mention)
        }
        if (!/^(src|demo|test|bench|scripts|docs|dist|assets)\//.test(token)) continue;
        if (!isPathLike(token)) continue;
        const resolved = path.join(REPO, token);
        findings.push({
            name: token,
            rel: path.relative(REPO, resolved),
            exists: fs.existsSync(resolved),
        });
    }
    return findings;
}

// ── clause (c): export-list fidelity (root CLAUDE.md only) ────────────────

function loadDtsSymbols() {
    const dtsPath = path.join(REPO, "dist/keyframes.d.ts");
    if (!fs.existsSync(dtsPath)) return null;
    const dts = fs.readFileSync(dtsPath, "utf8");
    const engineMatch = dts.match(
        /export declare interface AnimationEngine \{([\s\S]*?)\n\}/,
    );
    const engineKeys = new Set();
    if (engineMatch) {
        for (const m of engineMatch[1].matchAll(/^\s{4}(\w+)\??:/gm)) {
            engineKeys.add(m[1]);
        }
    }
    const allSymbols = new Set();
    for (const m of dts.matchAll(
        /^export declare (?:abstract\s+)?(?:class|function|const|interface|type|enum) (\w+)/gm,
    )) {
        allSymbols.add(m[1]);
    }
    for (const m of dts.matchAll(/^export \{ (\w+) \}/gm)) {
        allSymbols.add(m[1]);
    }
    return { engineKeys, allSymbols };
}

function extractBulletBag(content, bulletHeaderRe) {
    const m = content.match(bulletHeaderRe);
    if (!m) return null;
    // From the end of the matched header to the end of that bullet's
    // paragraph (the next blank line or bullet marker).
    const start = m.index + m[0].length;
    const rest = content.slice(start);
    const end = rest.search(/\n\s*\n|\n- \*\*/);
    const scope = end === -1 ? rest : rest.slice(0, end);
    const tokens = [...scope.matchAll(/`([^`\n]+)`/g)]
        .map((x) => x[1])
        .filter((t) => /^[A-Za-z_]\w*$/.test(t)); // bare identifiers only
    return [...new Set(tokens)];
}

function checkExportListFidelity(content, dts) {
    const findings = [];
    if (!dts) {
        findings.push({
            clause: "export-list-fidelity",
            ok: false,
            reason: "dist/keyframes.d.ts not found — run `npm run build` first",
        });
        return findings;
    }
    const heavyBag = extractBulletBag(
        content,
        // Non-greedy `[\s\S]*?` (not `[^)]*`) — the header text itself
        // contains a nested `()` (`` `await loadAnimationEngine()` ``) before
        // its own closing paren; a `)`-excluding class stops at the FIRST
        // `)` (inside the nested call) and never reaches the real one.
        /\*\*HEAVY \(dynamic[\s\S]*?\):\*\*/,
    );
    if (heavyBag) {
        for (const sym of heavyBag) {
            findings.push({
                clause: "HEAVY-list",
                name: sym,
                exists: dts.engineKeys.has(sym),
            });
        }
    }
    const lightBag = extractBulletBag(
        content,
        /\*\*LIGHT \(static named exports[\s\S]*?\):\*\*/,
    );
    if (lightBag) {
        for (const sym of lightBag) {
            findings.push({
                clause: "LIGHT-list",
                name: sym,
                exists: dts.allSymbols.has(sym),
            });
        }
    }
    return findings;
}

// ── clause (d): zone-count self-consistency (root CLAUDE.md only) ─────────

const NUMBER_WORDS = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
};

function checkZoneCount(content) {
    const sentence = content.match(
        /partitioned into (\w+) cohesive zone directories[\s\S]*?\+ `svg\/`\./,
    );
    if (!sentence) {
        return {
            ok: false,
            reason:
                "the zone-count sentence (\"partitioned into … cohesive zone " +
                "directories … + `svg/`.\") was not found — structure changed; " +
                "re-derive this clause",
        };
    }
    const word = sentence[1].toLowerCase();
    const stated = NUMBER_WORDS[word];
    const tokens = [...sentence[0].matchAll(/`([\w-]+)\/`/g)].map((m) => m[1]);
    const actual = new Set(tokens).size;
    if (stated === undefined) {
        return { ok: false, reason: `unrecognized number word "${word}"` };
    }
    return { ok: stated === actual, stated, actual, tokens };
}

// ── per-file gate runner ────────────────────────────────────────────────────

function runFileGate(key, content) {
    const { treeAnchor } = FILES[key];
    const failures = [];

    const treeFindings = checkTreeFences(content, treeAnchor);
    const deadTree = treeFindings.filter((f) => !f.exists);
    if (DUMP) {
        console.log(`  [dump ${key}] tree-fence nodes: ${treeFindings.length}`);
        for (const f of treeFindings) {
            console.log(`    ${f.exists ? "OK " : "DEAD"} ${f.name} -> ${f.rel}`);
        }
    }
    if (deadTree.length > 0) {
        failures.push(
            `(a) ${deadTree.length} dead tree-fence path(s) in ${FILES[key].label}:\n` +
                deadTree.map((f) => `      dead: \`${f.name}\` -> ${f.rel}`).join("\n"),
        );
    }

    const inlineFindings = checkInlinePaths(content);
    const deadInline = inlineFindings.filter((f) => !f.exists);
    if (DUMP) {
        console.log(`  [dump ${key}] inline tokens: ${inlineFindings.length}`);
        for (const f of inlineFindings) {
            console.log(
                `    ${f.exists ? "OK " : "DEAD"} \`${f.name}\` ${f.kind === "package" ? "(package)" : `-> ${f.rel}`}`,
            );
        }
    }
    if (deadInline.length > 0) {
        failures.push(
            `(b) ${deadInline.length} dead inline backtick path(s)/package ref(s) in ${FILES[key].label}:\n` +
                deadInline
                    .map(
                        (f) =>
                            `      dead: \`${f.name}\`${f.kind === "package" ? " (not in package.json)" : ` -> ${f.rel}`}`,
                    )
                    .join("\n"),
        );
    }

    return failures;
}

function runGate(fileContents, dts) {
    const failures = [];
    for (const key of Object.keys(FILES)) {
        failures.push(...runFileGate(key, fileContents[key]));
    }

    const exportFindings = checkExportListFidelity(fileContents.root, dts);
    const badExport = exportFindings.filter((f) => f.exists === false);
    if (badExport.length > 0) {
        failures.push(
            `(c) ${badExport.length} export-list symbol(s) in root CLAUDE.md do not resolve ` +
                `in the built surface:\n` +
                badExport
                    .map((f) => `      dead: [${f.clause}] \`${f.name}\``)
                    .join("\n"),
        );
    } else if (exportFindings.some((f) => f.reason)) {
        failures.push(`(c) ${exportFindings.find((f) => f.reason).reason}`);
    }

    const zone = checkZoneCount(fileContents.root);
    if (!zone.ok) {
        failures.push(
            zone.reason
                ? `(d) zone-count self-consistency: ${zone.reason}`
                : `(d) zone-count self-consistency: root CLAUDE.md states "${zone.stated}" ` +
                  `cohesive zone directories but the same sentence enumerates ${zone.actual} ` +
                  `(\`${zone.tokens.join("/`, `")}/\`) — the prose contradicts itself`,
        );
    }

    return failures;
}

// ── plant tests ──────────────────────────────────────────────────────────────

function readAll() {
    const out = {};
    for (const key of Object.keys(FILES)) {
        out[key] = fs.readFileSync(FILES[key].path, "utf8");
    }
    return out;
}

if (PLANT_TEST) {
    console.log("proof:claude-paths-live — born-RED plant tests\n");
    const original = readAll();
    const dts = loadDtsSymbols();
    let allPassed = true;

    const check = (label, mutated, clausePrefix) => {
        const f = runGate(mutated, dts);
        const bit = f.some((msg) => msg.startsWith(clausePrefix));
        if (bit) {
            console.log(`  ✓ plant ${label}: gate fired`);
        } else {
            console.error(`  ✗ plant ${label}: gate DID NOT fire — the clause is broken`);
            allPassed = false;
        }
    };

    // (a) dead tree-fence node
    check(
        "(a) dead tree path",
        {
            ...original,
            root: original.root.replace(
                "├── env.d.ts",
                "├── nonexistent-plant-a.ts\n├── env.d.ts",
            ),
        },
        "(a)",
    );

    // (b) dead inline backtick path
    check(
        "(b) dead inline path",
        {
            ...original,
            root: original.root + "\nSee `src/animation/plant-b-nonexistent.ts` for details.\n",
        },
        "(b)",
    );

    // (c) HEAVY list names a non-AnimationEngine key
    check(
        "(c) bad HEAVY symbol",
        {
            ...original,
            root: original.root.replace(
                /\*\*HEAVY \(dynamic[\s\S]*?\):\*\* `/,
                (m0) => m0.replace(/ `$/, " `PlantCNonexistentSymbol`, `"),
            ),
        },
        "(c)",
    );

    // (d) zone count mismatched
    check(
        "(d) zone-count self-contradiction",
        {
            ...original,
            root: original.root.replace(
                /partitioned into (\w+) cohesive zone directories/,
                "partitioned into one hundred cohesive zone directories",
            ),
        },
        "(d)",
    );

    console.log("");
    if (!allPassed) {
        console.error(
            "proof:claude-paths-live — plant tests FAILED (one or more clauses did not bite)",
        );
        process.exit(1);
    }
    console.log("proof:claude-paths-live — all plant tests passed (every clause bites on injection)");
    console.log("\nRunning gate against live CLAUDE.md files...\n");
}

// ── live gate ────────────────────────────────────────────────────────────────

console.log(
    "proof:claude-paths-live — root + src/animation + demo CLAUDE.md path/symbol liveness",
);

const live = readAll();
const dts = loadDtsSymbols();
const failures = runGate(live, dts);

console.log("");
if (failures.length > 0) {
    console.error(`proof:claude-paths-live — FAIL (${failures.length} finding(s)):`);
    for (const f of failures) console.error("  ✗ " + f);
    console.error(
        "\nC-8 note: src/animation/CLAUDE.md's pre-R.W1 flat-tree staleness is a NAMED,\n" +
            "authorized backlog discharged at S.B8's full regen (fold row 41). root\n" +
            "CLAUDE.md + demo/CLAUDE.md findings above are NOT authorized — they are the\n" +
            "actively-wrong lines S.A5 S2 hot-fixes.",
    );
    process.exit(1);
}
console.log(
    "proof:claude-paths-live — PASS: every tree-fence node + inline path + export-list " +
        "symbol resolves; the zone-count sentence is self-consistent.",
);
process.exit(0);
