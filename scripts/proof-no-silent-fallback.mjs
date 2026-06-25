#!/usr/bin/env node
/**
 * proof:no-silent-fallback — R.W3 born-RED gate (lib-hygiene · AXIS-3 STATIC).
 *
 * Asserts that the legacy/workaround/fallback excision sweep (§2A–2E) is in
 * effect and that no new silent-fallback regression has been introduced.
 *
 * THREE CLAUSES (each must pass for exit 0):
 *
 *   Clause 1 — ZERO excise-set patterns in the de-allowlisted LIB files.
 *     Static source grep over the LIB files edited in §2A–2D for the patterns
 *     that were excised:
 *       a. Bare `catch {` or empty `catch(e) {}` in the excise-set LIB files
 *          (the over-broad swallows narrowed by §2A and §2B).
 *       b. `?? 0` in the per-frame morph render path of `morph-svg.ts`
 *          (the coordinate masking excised by §2D).
 *     Demo files may have hits — those are INTEGRATION-DEFERRED (the R.W5/R.W6
 *     demo branch owns them; this gate records them as context, not failures).
 *
 *   Clause 2 — LINT GREEN.
 *     `depcruise src --ignore-known` exits 0. This is the leaves.ts
 *     reconciliation gate: the `leaf-no-engine-no-valuejs` rule's `pathNot:
 *     VALUEJS_MATH_SUBPATH` exclusion ensures the verified-clean
 *     `@mkbabb/value.js/math` edge does NOT red the rule while `../engine`
 *     still would. R.W1/R.W2 landed the narrowing; this clause asserts it.
 *
 *   Clause 3 — LEAF-RULE PLANT STILL BITES.
 *     After the `VALUEJS_MATH_SUBPATH` narrowing, plant the `../engine` import
 *     onto `internal/leaves.ts` (NOT `@mkbabb/value.js/math`) and assert that
 *     `leaf-no-engine-no-valuejs` still fires — proving the rule was narrowed,
 *     not disabled. Reverts the plant before reporting.
 *
 * BORN-RED PROOF:
 *   Before §2A–2D: `engine/css-metadata.ts` has a bare `catch {}` (Clause 1a
 *   fires); `engine/element-resolve.ts` has a bare `catch {}` (Clause 1a fires).
 *   Before §2E/R.W1: `depcruise src --ignore-known` exits 1 on the live
 *   `leaves.ts → @mkbabb/value.js/math` edge (Clause 2 fires).
 *   All three clauses are falsifiable observables, not grep of config text.
 *
 * INTEGRATION-DEFERRED (not failures here):
 *   Demo files (`demo/`) may carry hits for the excise-set patterns — the demo
 *   excision (§2F–2M) is owned by the R.W5/R.W6 demo branch. This gate records
 *   demo hits as informational context (printed but NOT counted as failures).
 *
 * RUN: node scripts/proof-no-silent-fallback.mjs
 */
import { execFileSync } from "node:child_process";
import {
    cpSync,
    existsSync,
    readdirSync,
    readFileSync,
    rmSync,
    statSync,
    writeFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src");
const demo = join(root, "demo");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};
const info = (label) => console.log(`  ℹ ${label}`);

console.log(
    "proof:no-silent-fallback — R.W3 (legacy/workaround/fallback excision sweep · RUN, not grep)",
);

// ── Source-tree walker ───────────────────────────────────────────────────────

/** Recursively collect *.ts + *.vue files, skipping node_modules/dist/.git. */
function collectSourceFiles(dir, acc = []) {
    let entries;
    try {
        entries = readdirSync(dir);
    } catch {
        return acc;
    }
    for (const entry of entries) {
        if (entry === "node_modules" || entry === "dist" || entry === ".git") {
            continue;
        }
        const full = join(dir, entry);
        let st;
        try {
            st = statSync(full);
        } catch {
            continue;
        }
        if (st.isDirectory()) {
            collectSourceFiles(full, acc);
        } else if (/\.(ts|vue)$/.test(entry) && !entry.endsWith(".d.ts")) {
            acc.push(full);
        }
    }
    return acc;
}

/** Grep file lines for a pattern; return [{line, lineNo, file}] matches. */
function grepFile(filePath, pattern) {
    const lines = readFileSync(filePath, "utf8").split("\n");
    const hits = [];
    for (let i = 0; i < lines.length; i++) {
        if (pattern.test(lines[i])) {
            hits.push({ lineNo: i + 1, line: lines[i].trimEnd() });
        }
    }
    return hits;
}

// ── Clause 1: ZERO excise-set patterns in de-allowlisted LIB files ──────────
console.log("\n── Clause 1: excise-set patterns in de-allowlisted LIB files ──");

/**
 * The de-allowlisted LIB files edited in §2A–2D (the excision targets).
 * These are the files whose catch{} / ?? 0 sites were replaced by FAIL-EXPLICIT
 * throws / diagnostics in R.W3. A hit here is a REGRESSION.
 */
const EXCISE_SET_LIB = [
    join(src, "animation", "engine", "css-metadata.ts"),
    join(src, "animation", "engine", "element-resolve.ts"),
    join(src, "animation", "svg", "morph-svg.ts"),
    // resolve-function.ts uses try/catch with explicit err binding — checked
    // separately for empty-body catches only.
    join(src, "animation", "resolve", "resolve-function.ts"),
];

/**
 * Pattern 1a — bare `catch {` or `catch(_)` or empty `catch(e) {}` (the
 * over-broad swallows). Does NOT match `catch (err)` with a non-empty body —
 * that is the FAIL-EXPLICIT pattern the excision introduces.
 *
 * Implementation note: we check for the empty-body form specifically, not all
 * catches. A `catch (err) { diagnostics.push(...); }` is correct; a bare
 * `catch {` or `catch { }` (with only whitespace/comments) is the pattern we
 * excised.
 */
const BARE_CATCH_PATTERN = /catch\s*(\(\s*\w*\s*\)\s*)?\{(\s*\/\/[^\n]*)?\s*\}/;

/**
 * Pattern 1b — `?? 0` in the per-frame render path of `morph-svg.ts`.
 * The legitimate `?? 0` uses (construction-time angle default, sampleD manual
 * pull) are now commented with "KEEP:" — match ONLY unlabeled ?? 0 in the
 * render body.
 *
 * Strategy: grep for `?? 0` and then filter out lines containing "KEEP:".
 */
const QQ_ZERO_PATTERN = /\?\? 0/;
const KEEP_COMMENT_PATTERN = /KEEP:/;

let clause1Failures = 0;
for (const libFile of EXCISE_SET_LIB) {
    if (!existsSync(libFile)) {
        fail(
            `excise-set lib file missing: ${relative(root, libFile)} — ` +
                "the excision target is absent from the tree (file renamed?)",
        );
        clause1Failures++;
        continue;
    }

    // Check for bare catch patterns
    const bareCatchHits = grepFile(libFile, BARE_CATCH_PATTERN);
    if (bareCatchHits.length > 0) {
        fail(
            `bare catch{} regression in ${relative(root, libFile)}: ` +
                bareCatchHits
                    .map((h) => `L${h.lineNo}: ${h.line.trim()}`)
                    .join("; "),
        );
        clause1Failures++;
    }
}

// Check morph-svg.ts specifically for unlabeled ?? 0 in the render body
const morphFile = join(src, "animation", "svg", "morph-svg.ts");
if (existsSync(morphFile)) {
    const qqHits = grepFile(morphFile, QQ_ZERO_PATTERN).filter(
        (h) => !KEEP_COMMENT_PATTERN.test(h.line),
    );
    if (qqHits.length > 0) {
        fail(
            `unlabeled ?? 0 regression in ${relative(root, morphFile)} ` +
                "(per-frame render coordinate masking — should be FAIL-EXPLICIT or " +
                'labeled "KEEP:" with a reason): ' +
                qqHits.map((h) => `L${h.lineNo}: ${h.line.trim()}`).join("; "),
        );
        clause1Failures++;
    }
}

if (clause1Failures === 0) {
    ok(
        "Clause 1: ZERO excise-set patterns (bare catch{} / unlabeled ?? 0) " +
            "in de-allowlisted LIB files",
    );
}

// ── Clause 1 addendum: demo hits (integration-deferred, informational) ──────
console.log("\n── Clause 1 addendum: demo hits (integration-deferred) ──");

const DEMO_EXCISE_SET = [
    // §2I — router silent nav-error swallow (R.W5 demo branch)
    join(demo, "app", "useSceneMachineRouter.ts"),
    // §2J — window.__lastVtTypes production test hook (R.W5 demo branch)
    join(demo, "app", "useSceneTransition.ts"),
    // §2F — navigator.platform deprecated API (R.W5 demo branch)
    join(demo, "@", "utils", "iosTextEntry.ts"),
];

let demoHits = 0;
for (const demoFile of DEMO_EXCISE_SET) {
    if (!existsSync(demoFile)) {
        // Demo file may not exist in lib worktree — skip without fail
        continue;
    }
    const bareCatchHits = grepFile(demoFile, BARE_CATCH_PATTERN);
    const navPlatformHits = grepFile(demoFile, /navigator\.platform/);
    const allHits = [...bareCatchHits, ...navPlatformHits];
    if (allHits.length > 0) {
        demoHits++;
        info(
            `INTEGRATION-DEFERRED (R.W5/R.W6 demo branch) — ` +
                `${relative(root, demoFile)}: ${allHits.length} hit(s) ` +
                "(not a failure here; owned by the demo excision wave)",
        );
    }
}
if (demoHits === 0) {
    ok(
        "Clause 1 addendum: no demo excise-set hits found in this worktree " +
            "(demo files may not be present in the lib worktree — expected)",
    );
} else {
    info(
        `Clause 1 addendum: ${demoHits} demo file(s) carry integration-deferred ` +
            "hits — NOT counted as failures (R.W5/R.W6 demo branch owns them)",
    );
}

// ── Clause 2: LINT GREEN ─────────────────────────────────────────────────────
console.log("\n── Clause 2: lint GREEN (depcruise src --ignore-known) ──");

function runDepcruise() {
    try {
        const out = execFileSync(
            "npx",
            ["depcruise", "src", "--ignore-known"],
            { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
        );
        return { code: 0, out };
    } catch (e) {
        return {
            code: typeof e.status === "number" ? e.status : 1,
            out: `${e.stdout ?? ""}${e.stderr ?? ""}`,
        };
    }
}

const lintResult = runDepcruise();
if (lintResult.code === 0) {
    ok(
        "Clause 2: `depcruise src --ignore-known` exits 0 — lint GREEN " +
            "(the leaves.ts → @mkbabb/value.js/math edge is correctly excluded " +
            "via pathNot:VALUEJS_MATH_SUBPATH; no boundary violation present)",
    );
} else {
    fail(
        "Clause 2: `depcruise src --ignore-known` exits non-zero — lint RED. " +
            "A live (non-baselined) source-graph violation is present:\n" +
            lintResult.out
                .split("\n")
                .filter((l) => /error|violation/i.test(l))
                .join("\n"),
    );
}

// ── Clause 3: LEAF-RULE PLANT STILL BITES ────────────────────────────────────
console.log("\n── Clause 3: leaf-rule plant still bites (../engine on leaves.ts) ──");

const LEAF = join(root, "src", "animation", "internal", "leaves.ts");
const LEAF_BAK = `${LEAF}.proof-nsf-bak`;

let clause3Passed = false;
try {
    // Plant: add a static `../engine` import to leaves.ts (the exact import
    // that proves leaf-no-engine-no-valuejs is live, NOT @mkbabb/value.js/math)
    cpSync(LEAF, LEAF_BAK);
    writeFileSync(
        LEAF,
        readFileSync(LEAF, "utf8") +
            "\nimport { getTimingFunction as _probe } from \"../engine\";\nexport const _lintProbe = _probe;\n",
    );
    const planted = runDepcruise();
    clause3Passed =
        planted.code !== 0 &&
        /error leaf-no-engine-no-valuejs\b/.test(planted.out);
} finally {
    if (existsSync(LEAF_BAK)) {
        cpSync(LEAF_BAK, LEAF);
        rmSync(LEAF_BAK, { force: true });
    }
}

if (clause3Passed) {
    ok(
        "Clause 3: `../engine` plant on leaves.ts reds leaf-no-engine-no-valuejs " +
            "— the rule was NARROWED (to exclude /math), NOT disabled. " +
            "The @mkbabb/value.js/math edge lints clean; a ../engine edge still bites.",
    );
} else {
    fail(
        "Clause 3: the `../engine` plant on leaves.ts did NOT red " +
            "leaf-no-engine-no-valuejs — the rule is disabled or mis-scoped. " +
            "The VALUEJS_PATH narrowing must exclude ONLY the /math subpath; " +
            "a ../engine import from an internal/ leaf must still red the rule.",
    );
}

// ── Post-plant sanity: lint still clean after revert ─────────────────────────
const restored = runDepcruise();
if (restored.code !== 0) {
    fail(
        "Clause 3 revert: after reverting the plant the tree is NOT lint-clean " +
            "— the plant leaked (a backup file was left behind). Manual cleanup needed.",
    );
} else {
    ok("Clause 3 revert: tree restored + lints clean after plant revert");
}

// ── Report ───────────────────────────────────────────────────────────────────
console.log("");
if (failures.length > 0) {
    console.error(
        `proof:no-silent-fallback — FAIL (${failures.length} failure(s)):\n` +
            failures.map((f) => `  ✗ ${f}`).join("\n"),
    );
    process.exit(1);
}
console.log(
    "proof:no-silent-fallback — PASS: all three clauses GREEN.\n" +
        "  Clause 1: no bare catch{} / unlabeled ?? 0 in the §2A–2D excise-set LIB files.\n" +
        "  Clause 2: depcruise src --ignore-known exits 0 (leaves.ts /math edge " +
        "correctly excluded; no boundary violation).\n" +
        "  Clause 3: ../engine plant on leaves.ts reds leaf-no-engine-no-valuejs " +
        "(rule narrowed, not disabled).",
);
