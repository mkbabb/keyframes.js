#!/usr/bin/env node
/**
 * proof:no-silent-fallback — R.W3 born-RED gate, HARDENED at S.C2
 * (lib-hygiene · AXIS-3 STATIC).
 *
 * Asserts that the legacy/workaround/fallback excision sweep (§2A–2E) stays
 * in effect and that NO new silent-fallback regression has been introduced
 * ANYWHERE in `src/` or `demo/` — not just the 4 R.W3-touched LIB files.
 *
 * FOUR CLAUSES (each must pass for exit 0):
 *
 *   Clause 1 — ZERO unlabelled silent-fallback patterns, src-wide + demo-wide.
 *     A machine-checked `KEEP:` allowlist idiom (S.C2 S2, a07 F3): a labelled
 *     legitimate site is allowed; an unlabelled one REDs. Widened from the
 *     R.W3 4-file `EXCISE_SET_LIB` scope to every `.ts`/`.vue` file under
 *     `src/` AND `demo/` (S.C2 S1 — the demo arm is now ENFORCED, not
 *     informational). Deny patterns:
 *       a. A bare/empty `catch {}` block (any file, any depth).
 *       b. A `catch {}` block whose only content is a nullish-coalescing
 *          mask (`?? 0` / `?? ""` / `?? []` / `?? null` / `?? undefined`)
 *          with no diagnostic emission (no throw/console/push/log/toast/emit)
 *          — the generalized form of the `?? 0` per-frame render-path pattern
 *          §2D excised in `morph-svg.ts`.
 *       c. An empty `.catch(() => {})` / `.catch(function () {})` promise
 *          handler.
 *       d. `navigator.platform` anywhere in `demo/` (deprecated API, §2F) —
 *          not catch-shaped, kept as its own demo-wide sub-check.
 *     A hit is EXEMPTED when a `KEEP:`-labelled reason appears on the same
 *     line, inside the block body, or in the 1–3 lines immediately
 *     preceding it — turning the R.W3.md "confirmed KEEP" table (12 rows)
 *     from prose into a machine-checked baseline (a07 F3's proposal (b)).
 *
 *   Clause 2 — LINT GREEN.
 *     `depcruise src --ignore-known` exits 0 (unchanged from R.W3).
 *
 *   Clause 3 — LEAF-RULE PLANT STILL BITES.
 *     Plant `../engine` on `internal/leaves.ts`, assert
 *     `leaf-no-engine-no-valuejs` still fires, revert (unchanged from R.W3).
 *
 *   Clause 4 — the `as any` clause, scoped honestly to demo composables
 *     (S.C2 S3; sc-§2.4; fold row 26). "Demo composable" = a `.ts` file
 *     under `demo/` whose basename matches `use*.ts` OR whose path contains
 *     a `composables/` segment (the literal, falsifiable definition — NOT
 *     `.vue` components, which are out of this wave's scope per T9
 *     census-before-fiat). REDs on any UNLABELLED `as any` in that file set;
 *     a `KEEP:`-labelled survivor is allowed. The census today (re-derived
 *     live, not inherited from the SPEC-v3 table — T5/T9): the §2K row-4
 *     survivor (`useTimingFunctionEditor.ts:196`) was FIXED by deleting the
 *     erasing cast (its declared return type was already the `string` member
 *     of `InputAnimationOptions["timingFunction"]`'s union — no widen was
 *     structurally required, just the cast's removal); the one other live
 *     composable cast (`useKeyframeOps.ts:87`, `fromKeyframes(keyframes as
 *     any)`) type-checks clean without the cast too and was fixed the same
 *     way. Zero composable `as any` sites survive today — the SPEC-v3
 *     estimate of "5 other survivors" needing `KEEP:` labels does not match
 *     the live tree (both real sites were fixable, not merely labellable).
 *
 * BORN-RED PROOF (S.C2):
 *   Before S.C2: the demo clauses are INFORMATIONAL (a planted bare `catch
 *   {}` in a demo composable does NOT fail the gate) and
 *   `useTimingFunctionEditor.ts:196` carries an unlabelled `as any`
 *   (Clause 4 fires). After S.C2: Clause 1 is enforced src-wide + demo-wide
 *   (a planted demo bare-catch REDs it) and Clause 4 is GREEN (zero
 *   unlabelled composable casts).
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
import { basename, dirname, join, relative, sep } from "node:path";

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
    "proof:no-silent-fallback — S.C2 hardened (src+demo-wide deny-scan + KEEP: idiom + scoped as-any census)",
);

// ── Shared source-tree toolkit (reused by every clause — keep modular; ────
//    a future wave (S.B2) extends Clause 1's deny-set, not this toolkit) ──

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

/** 1-indexed line number of a character offset into `content`. */
function lineOf(content, idx) {
    return content.slice(0, idx).split("\n").length;
}

/**
 * Strip `//` and `/* *\/` comments, preserving string length/newlines (so
 * offsets/line numbers computed against the ORIGINAL content stay valid).
 */
function blankComments(content) {
    return content
        .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
        .replace(/\/\/[^\n]*/g, (m) => " ".repeat(m.length));
}

/**
 * Find every `{`-delimited block whose opening matches `headerRe` (the regex
 * MUST end with a literal `{`), brace-matching to the closing `}`. Returns
 * `{ headerStart, braceStart, braceEnd, header, body }` per match.
 */
function findBracedBlocks(content, headerRe) {
    const blocks = [];
    const re = new RegExp(headerRe.source, "g");
    let m;
    while ((m = re.exec(content))) {
        const braceStart = m.index + m[0].length - 1;
        if (content[braceStart] !== "{") continue;
        let depth = 1;
        let i = braceStart + 1;
        while (i < content.length && depth > 0) {
            if (content[i] === "{") depth++;
            else if (content[i] === "}") depth--;
            i++;
        }
        const braceEnd = i - 1;
        blocks.push({
            headerStart: m.index,
            braceStart,
            braceEnd,
            header: m[0],
            body: content.slice(braceStart + 1, braceEnd),
        });
    }
    return blocks;
}

/**
 * The machine-checked `KEEP:` allowlist idiom (a07 F3 proposal (b)): a block
 * is exempted when `KEEP:` appears on its header line, within its body, or
 * in the ≤3 lines immediately preceding it.
 */
function hasKeepLabel(content, block) {
    const beforeLines = content.slice(0, block.headerStart).split("\n");
    const contextBefore = beforeLines.slice(-4).join("\n");
    return /KEEP:/.test(contextBefore + block.header + block.body);
}

// ── Clause 1: src-wide + demo-wide silent-fallback deny-scan ────────────────

const CATCH_HEADER = /\bcatch\s*(\([^){]*\))?\s*\{/;
const PROMISE_CATCH_HEADER = /\.catch\s*\(\s*(?:\([^)]*\)|[$\w]+)\s*=>\s*\{/;
const NULLISH_MASK_PATTERN = /\?\?\s*(0|""|''|\[\]|null|undefined)\b/;
const DIAGNOSTIC_PATTERN =
    /\bthrow\b|console\.|\.push\(|toast\.|\bemit\(|\.error\(|\.warn\(/;

function runClause1() {
    console.log(
        "\n── Clause 1: src-wide + demo-wide silent-fallback deny-scan (KEEP: allowlisted) ──",
    );

    const files = [...collectSourceFiles(src), ...collectSourceFiles(demo)];
    let clauseFailures = 0;

    for (const file of files) {
        const content = readFileSync(file, "utf8");
        const rel = relative(root, file);

        // (a) + (b) — catch blocks: bare/empty, or nullish-coalescing masks
        // with no diagnostic emission.
        for (const block of findBracedBlocks(content, CATCH_HEADER)) {
            const strippedBody = blankComments(block.body).trim();
            if (hasKeepLabel(content, block)) continue;

            if (strippedBody === "") {
                fail(
                    `Clause 1a: bare catch{} in ${rel}:${lineOf(content, block.headerStart)} ` +
                        '(empty/comment-only body, no `KEEP:` label — either FAIL-EXPLICIT it ' +
                        "or label it with a reason)",
                );
                clauseFailures++;
            } else if (
                NULLISH_MASK_PATTERN.test(strippedBody) &&
                !DIAGNOSTIC_PATTERN.test(strippedBody)
            ) {
                fail(
                    `Clause 1b: silent nullish-mask catch{} in ${rel}:${lineOf(content, block.headerStart)} ` +
                        `(masks via ?? with no throw/console/push/log, no \`KEEP:\` label): ` +
                        strippedBody.replace(/\s+/g, " ").trim(),
                );
                clauseFailures++;
            }
        }

        // (c) — empty .catch(() => {}) / .catch(function () {}) handlers.
        for (const block of findBracedBlocks(content, PROMISE_CATCH_HEADER)) {
            const strippedBody = blankComments(block.body).trim();
            if (strippedBody === "" && !hasKeepLabel(content, block)) {
                fail(
                    `Clause 1c: empty .catch(() => {}) in ${rel}:${lineOf(content, block.headerStart)} ` +
                        '(no `KEEP:` label — either surface the error or label the swallow)',
                );
                clauseFailures++;
            }
        }
    }

    // (d) — navigator.platform anywhere in demo/ (deprecated API, §2F).
    // Demo-wide now (S.C2 S1 — was a 1-file check); no KEEP: escape (there is
    // no legitimate use — CSS.supports()/userAgent are the replacement).
    for (const file of collectSourceFiles(demo)) {
        const hits = [];
        const lines = readFileSync(file, "utf8").split("\n");
        for (let i = 0; i < lines.length; i++) {
            if (/navigator\.platform/.test(lines[i])) {
                hits.push(i + 1);
            }
        }
        if (hits.length > 0) {
            fail(
                `Clause 1d: deprecated navigator.platform in ${relative(root, file)}:` +
                    `${hits.join(",")} (removed by §2F — use CSS.supports()/userAgent instead)`,
            );
            clauseFailures++;
        }
    }

    if (clauseFailures === 0) {
        ok(
            "Clause 1: ZERO unlabelled silent-fallback patterns (bare catch{} / " +
                "nullish-mask catch{} / empty .catch(() => {}) / navigator.platform) " +
                "across src/ + demo/ — every legitimate site carries a `KEEP:` label",
        );
    }
}

// ── Clause 2: LINT GREEN ─────────────────────────────────────────────────────

function runDepcruise() {
    try {
        const out = execFileSync(
            "npx",
            ["depcruise", "src"],
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

function runClause2() {
    console.log("\n── Clause 2: lint GREEN (depcruise src) ──");
    const lintResult = runDepcruise();
    if (lintResult.code === 0) {
        ok(
            "Clause 2: `depcruise src` exits 0 — lint GREEN " +
                "(the leaves.ts → @mkbabb/value.js/math edge is correctly excluded " +
                "via pathNot:VALUEJS_MATH_SUBPATH; no boundary violation present)",
        );
    } else {
        fail(
            "Clause 2: `depcruise src` exits non-zero — lint RED. " +
                "A live (non-baselined) source-graph violation is present:\n" +
                lintResult.out
                    .split("\n")
                    .filter((l) => /error|violation/i.test(l))
                    .join("\n"),
        );
    }
}

// ── Clause 3: LEAF-RULE PLANT STILL BITES ────────────────────────────────────

function runClause3() {
    console.log(
        "\n── Clause 3: leaf-rule plant still bites (../engine on leaves.ts) ──",
    );

    const LEAF = join(root, "src", "animation", "internal", "leaves.ts");
    const LEAF_BAK = `${LEAF}.proof-nsf-bak`;

    let clause3Passed = false;
    try {
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

    const restored = runDepcruise();
    if (restored.code !== 0) {
        fail(
            "Clause 3 revert: after reverting the plant the tree is NOT lint-clean " +
                "— the plant leaked (a backup file was left behind). Manual cleanup needed.",
        );
    } else {
        ok("Clause 3 revert: tree restored + lints clean after plant revert");
    }
}

// ── Clause 4: the as-any clause, scoped to demo composables ─────────────────

/**
 * "Demo composable" — the literal, falsifiable scope (S.C2 S3): a `.ts` file
 * under `demo/` whose basename matches `use*.ts` OR whose path contains a
 * `composables/` segment. Deliberately excludes `.vue` — components are a
 * different census, out of this wave's scope (T9 census-before-fiat: state
 * the boundary, don't over-claim it).
 */
function isDemoComposable(filePath) {
    if (!filePath.endsWith(".ts") || filePath.endsWith(".d.ts")) return false;
    const rel = relative(demo, filePath);
    if (rel.startsWith("..")) return false;
    const segments = rel.split(sep);
    if (segments.includes("composables")) return true;
    return /^use[A-Z0-9]/.test(basename(filePath));
}

/** Real (non-comment) `as any` occurrences, with their KEEP: label state. */
function findAsAnySites(filePath) {
    const original = readFileSync(filePath, "utf8");
    const codeOnly = blankComments(original);
    const originalLines = original.split("\n");
    const codeLines = codeOnly.split("\n");
    const sites = [];
    for (let i = 0; i < codeLines.length; i++) {
        if (/\bas\s+any\b/.test(codeLines[i])) {
            const context = [
                originalLines[i - 1] ?? "",
                originalLines[i],
                originalLines[i + 1] ?? "",
            ].join("\n");
            sites.push({
                lineNo: i + 1,
                line: originalLines[i].trim(),
                labelled: /KEEP:/.test(context),
            });
        }
    }
    return sites;
}

function runClause4() {
    console.log(
        "\n── Clause 4: `as any` clause, scoped to demo composables (S.C2 S3) ──",
    );

    const composableFiles = collectSourceFiles(demo).filter(isDemoComposable);
    let total = 0;
    let labelled = 0;
    let unlabelled = 0;

    for (const file of composableFiles) {
        const sites = findAsAnySites(file);
        for (const site of sites) {
            total++;
            const rel = relative(root, file);
            if (site.labelled) {
                labelled++;
                info(
                    `Clause 4 census: KEEP:-labelled survivor ${rel}:${site.lineNo} — ${site.line}`,
                );
            } else {
                unlabelled++;
                fail(
                    `Clause 4: unlabelled \`as any\` in demo composable ${rel}:${site.lineNo} ` +
                        `— ${site.line} (fix the type gap, or label with a KEEP: reason)`,
                );
            }
        }
    }

    info(
        `Clause 4 census: ${composableFiles.length} demo-composable file(s) scanned, ` +
            `${total} \`as any\` site(s) found (${labelled} labelled, ${unlabelled} unlabelled)`,
    );

    if (unlabelled === 0) {
        ok(
            "Clause 4: ZERO unlabelled `as any` in demo composables " +
                "(the §2K row-4 survivor — useTimingFunctionEditor.ts:196 — was fixed by " +
                "removing the erasing cast, not labelled)",
        );
    }
}

// ── Run all four clauses, then report ────────────────────────────────────────

runClause1();
runClause2();
runClause3();
runClause4();

console.log("");
if (failures.length > 0) {
    console.error(
        `proof:no-silent-fallback — FAIL (${failures.length} failure(s)):\n` +
            failures.map((f) => `  ✗ ${f}`).join("\n"),
    );
    process.exit(1);
}
console.log(
    "proof:no-silent-fallback — PASS: all four clauses GREEN.\n" +
        "  Clause 1: zero unlabelled silent-fallback patterns, src-wide + demo-wide.\n" +
        "  Clause 2: depcruise src exits 0.\n" +
        "  Clause 3: ../engine plant on leaves.ts reds leaf-no-engine-no-valuejs " +
        "(rule narrowed, not disabled).\n" +
        "  Clause 4: zero unlabelled `as any` in demo composables.",
);
