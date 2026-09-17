#!/usr/bin/env node
/**
 * SERVED MODEL: claude-opus-5[1m]
 *
 * census — the K4 census family (X.KF.W4, unit `.d`). ONE script, THREE
 * separately-closing clauses. Each clause owns its own verdict, its own
 * denominator and its own exit contribution; running one never runs another.
 *
 *   C1  provenance  (G-KFW4-7, K4/G-L7d)
 *       Every identifier ATTRIBUTED to `@mkbabb/value.js` inside a comment in
 *       src/, demo/ or test/ must be a real export of the subpath it is
 *       attributed to. Two arms, both the same assertion:
 *         (1) PHANTOM      — attributed, exported by nobody.
 *         (2) MISATTRIBUTED — attributed to value.js, actually exported by
 *             THIS repo's own `src/`.
 *       Denominator: the value.js export sets are READ FROM THE INSTALLED
 *       PACKAGE at use (runtime keys ∪ the `.d.ts` declared names), never from
 *       a checked-in list; the repo's own export set is derived from `src/`
 *       at use. Nothing is allowlisted (rule (c) / B10-27).
 *
 *       STATED BOUND, so the clause is not read wider than it bites: the
 *       subject is an IDENTIFIER attributed to value.js — a backticked symbol,
 *       or a bare symbol in an explicit attribution form ("value.js's X",
 *       "X from value.js", "value.js exports X") — inside a SENTENCE that
 *       names value.js. Prose that attributes a MECHANISM to value.js while
 *       naming no identifier (e.g. "value.js caches the resolved px keyed by a
 *       monotonic layout epoch") is NOT in this clause's denominator and is not
 *       silently claimed by it. That class needs a different instrument and is
 *       booked, not faked.
 *
 *   C2  citations  (G-KFW4-8)
 *       An ENUMERATED-SITE assertion: every `proof:*` citation at the
 *       enumerated citation targets resolves to an executable npm script or a
 *       gate script on disk. The site roster is read from the artefact when
 *       `--sites <file>` is given, else from the embedded roster; every site
 *       file is RE-READ and RE-HASHED at use (never allowlisted), and the
 *       hashes are printed so the run is reproducible.
 *
 *       DECLARED CARVE, never silent (R2-13): `proof:brittleness` at
 *       `demo/styles/layout.css:152` is OUT of this clause's denominator BY
 *       NAME — §Excluded 17 routes that family whole to KF.W6. The clause
 *       PRINTS the carve on every run and FAILS if the carve's subject has
 *       been cured here (curing a brittleness byte inside this wave is the
 *       scope-creep the carve exists to forbid).
 *
 *       SCOPE BOUNDARY, load-bearing: the clause reads LIVING source and
 *       LIVING docs. It never reads `docs/tranches/**` dated records — a gate
 *       that reds on immutable history is a gate that gets disabled.
 *
 *   C3  manifest  (G-KFW4-12's standing clause)
 *       Every declared devDependency has at least one consumer: an import
 *       specifier under src/ demo/ test/ scripts/, a config reference, or an
 *       npm script naming it. A dead devDep is a false declaration.
 *
 * Usage:
 *   node scripts/gates/census.mjs                            # all three
 *   node scripts/gates/census.mjs --clause provenance
 *   node scripts/gates/census.mjs --clause citations --sites citation-inventory.md
 *   node scripts/gates/census.mjs --clause manifest
 *   node scripts/gates/census.mjs --json                     # machine roster
 *
 * Exit 0 only when every REQUESTED clause passes. Each clause prints its own
 * `census C<n> — PASS/FAIL` line, so three gates read three verdicts off one
 * script.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../..",
);
const require_ = createRequire(path.join(REPO, "package.json"));

const argv = process.argv.slice(2);
const flag = (name) => {
    const i = argv.indexOf(`--${name}`);
    return i === -1 ? null : (argv[i + 1] ?? "");
};
const has = (name) => argv.includes(`--${name}`);
const requested = flag("clause");
const asJson = has("json");

const CLAUSES = ["provenance", "citations", "manifest"];
if (requested !== null && !CLAUSES.includes(requested)) {
    console.error(
        `census — FAIL: unknown --clause ${JSON.stringify(requested)} (expected ${CLAUSES.join(" | ")})`,
    );
    process.exit(2);
}
const run = requested === null ? CLAUSES : [requested];

// ── shared substrate ────────────────────────────────────────────────────────

const sha = (text) =>
    createHash("sha256").update(text).digest("hex").slice(0, 12);

const SOURCE_EXT = new Set([".ts", ".tsx", ".vue", ".mjs", ".js", ".css"]);

/** Every tracked-shaped file under `roots`, skipping build/vendor sinks. */
function walk(roots, { ext = SOURCE_EXT } = {}) {
    const skip = new Set([
        "node_modules",
        "dist",
        ".git",
        "coverage",
        "baselines",
        "monaco-themes",
    ]);
    const out = [];
    const visit = (dir) => {
        let entries;
        try {
            entries = readdirSync(dir, { withFileTypes: true });
        } catch {
            return;
        }
        for (const e of entries.sort((a, b) => (a.name < b.name ? -1 : 1))) {
            if (e.name.startsWith(".") || skip.has(e.name)) continue;
            const p = path.join(dir, e.name);
            if (e.isDirectory()) visit(p);
            else if (ext.has(path.extname(e.name))) out.push(p);
        }
    };
    for (const r of roots) {
        const abs = path.join(REPO, r);
        if (existsSync(abs) && statSync(abs).isDirectory()) visit(abs);
    }
    return out;
}

const rel = (p) => path.relative(REPO, p).split(path.sep).join("/");

/**
 * Comment BLOCKS in a source text: contiguous runs of `//` lines, `/* … *\/`
 * spans, and `<!-- … -->` spans, each carried with the 1-based line its text
 * opens on. Comment markers are stripped; the block's lines are joined with a
 * single space so a wrapped sentence reads as one sentence.
 */
function commentBlocks(text) {
    const blocks = [];
    const lines = text.split("\n");
    let run = null;
    const flush = () => {
        if (run && run.parts.length)
            blocks.push({
                line: run.line,
                endLine: run.end,
                text: run.parts.join(" "),
            });
        run = null;
    };
    let inBlock = false;
    let blockStart = 0;
    let blockParts = [];
    for (let i = 0; i < lines.length; i++) {
        const raw = lines[i];
        if (inBlock) {
            const end =
                raw.indexOf("*/") !== -1
                    ? raw.indexOf("*/")
                    : raw.indexOf("-->");
            const body = end === -1 ? raw : raw.slice(0, end);
            blockParts.push(body.replace(/^\s*\*+/, "").trim());
            if (end !== -1) {
                blocks.push({
                    line: blockStart,
                    endLine: i + 1,
                    text: blockParts.join(" ").trim(),
                });
                inBlock = false;
                blockParts = [];
            }
            continue;
        }
        const open = raw.search(/\/\*|<!--/);
        const lineComment = raw.match(/(^|\s)\/\/(.*)$/);
        if (open !== -1) {
            flush();
            const marker = raw.slice(open, open + 2) === "/*" ? "*/" : "-->";
            const after = raw.slice(open + (marker === "*/" ? 2 : 4));
            const close = after.indexOf(marker);
            if (close !== -1) {
                blocks.push({
                    line: i + 1,
                    endLine: i + 1,
                    text: after
                        .slice(0, close)
                        .replace(/^\s*\*+/, "")
                        .trim(),
                });
            } else {
                inBlock = true;
                blockStart = i + 1;
                blockParts = [after.replace(/^\s*\*+/, "").trim()];
            }
            continue;
        }
        if (lineComment) {
            const body = lineComment[2].trim();
            if (!run) run = { line: i + 1, end: i + 1, parts: [] };
            run.end = i + 1;
            run.parts.push(body);
            continue;
        }
        flush();
    }
    flush();
    if (inBlock && blockParts.length)
        blocks.push({
            line: blockStart,
            endLine: lines.length,
            text: blockParts.join(" ").trim(),
        });
    return blocks.filter((b) => b.text.length > 0);
}

// ── C1 · provenance ─────────────────────────────────────────────────────────

const VALUE_PKG = "@mkbabb/value.js";

/** The installed value.js export sets, per subpath, read at use. */
function valuePackageDir() {
    // The package's own `exports` map need not publish `./package.json`, so the
    // directory is resolved from a real subpath and climbed, never assumed.
    let probe = null;
    for (const sub of ["math", "color", "css", "value"]) {
        try {
            probe = require_.resolve(`${VALUE_PKG}/${sub}`);
            break;
        } catch {
            /* try the next published subpath */
        }
    }
    let dir = probe
        ? path.dirname(probe)
        : path.join(REPO, "node_modules", ...VALUE_PKG.split("/"));
    for (let i = 0; i < 8; i++) {
        const manifest = path.join(dir, "package.json");
        if (existsSync(manifest)) {
            try {
                if (
                    JSON.parse(readFileSync(manifest, "utf8")).name ===
                    VALUE_PKG
                )
                    return dir;
            } catch {
                /* keep climbing */
            }
        }
        const up = path.dirname(dir);
        if (up === dir) break;
        dir = up;
    }
    throw new Error(
        `census C1 — ${VALUE_PKG} is not installed; the clause has no denominator`,
    );
}

async function valueExportSets() {
    const pkgDir = valuePackageDir();
    const pkgPath = path.join(pkgDir, "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    const subpaths = Object.keys(pkg.exports ?? {});
    const sets = new Map();
    for (const sub of subpaths) {
        const names = new Set();
        const entry = pkg.exports[sub];
        const runtime =
            typeof entry === "string" ? entry : (entry.import ?? entry.default);
        if (runtime) {
            try {
                const mod = await import(path.join(pkgDir, runtime));
                for (const k of Object.keys(mod)) names.add(k);
            } catch {
                /* a subpath that will not load is reported by its empty set */
            }
        }
        const types = typeof entry === "object" ? entry.types : null;
        if (types && existsSync(path.join(pkgDir, types))) {
            const dts = readFileSync(path.join(pkgDir, types), "utf8");
            for (const m of dts.matchAll(/export\s*\{([^}]*)\}/g)) {
                for (const piece of m[1].split(",")) {
                    const name = piece
                        .trim()
                        .split(/\s+as\s+/)
                        .pop()
                        ?.trim();
                    if (name && /^[A-Za-z_$][\w$]*$/.test(name))
                        names.add(name);
                }
            }
            for (const m of dts.matchAll(
                /export\s+(?:declare\s+)?(?:type|interface|class|function|const|let|var|enum)\s+([A-Za-z_$][\w$]*)/g,
            )) {
                names.add(m[1]);
            }
        }
        sets.set(sub.replace(/^\.\//, ""), names);
    }
    const all = new Set();
    for (const s of sets.values()) for (const n of s) all.add(n);
    return { sets, all, version: pkg.version, subpaths };
}

/** This repo's own exported symbols, derived from `src/` at use. */
function ownExports() {
    const names = new Set();
    for (const file of walk(["src"], { ext: new Set([".ts"]) })) {
        const text = readFileSync(file, "utf8");
        for (const m of text.matchAll(
            /^export\s+(?:declare\s+)?(?:async\s+)?(?:type|interface|class|function|const|let|var|enum)\s+([A-Za-z_$][\w$]*)/gm,
        )) {
            names.add(m[1]);
        }
        for (const m of text.matchAll(/^export\s*\{([^}]*)\}/gm)) {
            for (const piece of m[1].split(",")) {
                const name = piece
                    .trim()
                    .split(/\s+as\s+/)
                    .pop()
                    ?.trim();
                if (name && /^[A-Za-z_$][\w$]*$/.test(name)) names.add(name);
            }
        }
    }
    return names;
}

const IDENT = /^[A-Za-z_$][\w$]*$/;
/** Words that read as identifiers but are English in every comment they sit in. */
const PROSE = new Set([
    "value",
    "js",
    "the",
    "a",
    "an",
    "it",
    "this",
    "for",
    "and",
    "or",
    "kf",
]);

/**
 * Attribution sentences in one comment block. `value.js` / `@mkbabb/value.js`
 * (and any subpath) is folded to a single token FIRST, so the package's own
 * dot never splits a sentence; the sentence window is then `.`/`!`/`?`.
 */
function attributionSentences(blockText) {
    const marks = [];
    const folded = blockText.replace(
        /(@mkbabb\/)?value\.js(\/[a-z-]+)?/g,
        (m, _s, sub) => {
            marks.push(sub ? sub.slice(1) : null);
            return `\u0000VALUEJS${marks.length - 1}\u0000`;
        },
    );
    if (marks.length === 0) return [];
    return folded
        .split(/(?<=[.!?])\s+/)
        .filter((s) => s.includes("\u0000VALUEJS"))
        .map((sentence) => {
            const subs = [...sentence.matchAll(/\u0000VALUEJS(\d+)\u0000/g)]
                .map((m) => marks[Number(m[1])])
                .filter(Boolean);
            return { sentence, subpaths: [...new Set(subs)] };
        });
}

const MARK = "\\u0000VALUEJS\\d+\\u0000";

/**
 * Identifiers a sentence ATTRIBUTES to value.js — FOUR relational forms, and
 * nothing wider. A backtick that merely shares a sentence with a value.js
 * mention is NOT an attribution; the relation has to be written.
 *
 *   A1  value.js('s | own | exports) `X`      — the possessive / export form
 *   A2  value.js exports X                    — the bare export-verb form
 *   A3  `X` (from | of) value.js              — the source form
 *   A4  value.js( /sub )? ( `X`, `Y`/`Z` … )  — the import parenthetical
 */
function attributedIdentifiers(sentence) {
    const found = new Map();
    const add = (raw, form) => {
        const name = raw.trim().replace(/\(\)$/, "");
        if (
            !IDENT.test(name) ||
            PROSE.has(name) ||
            PROSE.has(name.toLowerCase())
        )
            return;
        if (!found.has(name)) found.set(name, form);
    };
    const addRun = (run, form) => {
        for (const m of run.matchAll(/`([^`]+)`/g)) {
            for (const piece of m[1].split("/")) add(piece, form);
        }
    };
    // A1 — value.js's `X` · value.js `X` · value.js exports `X`
    for (const m of sentence.matchAll(
        new RegExp(
            MARK +
                "(?:'s|’s)?\\s+(?:own\\s+)?(?:exports?\\s+)?((?:`[^`]+`(?:\\s*/\\s*)?)+)",
            "g",
        ),
    )) {
        addRun(m[1], "A1 possessive");
    }
    // A2 — value.js exports X (bare name; the export verb is REQUIRED)
    for (const m of sentence.matchAll(
        new RegExp(MARK + "(?:'s)?\\s+exports?\\s+([A-Za-z_$][\\w$]*)", "g"),
    )) {
        add(m[1], "A2 export-verb");
    }
    // A3 — `X` from value.js
    for (const m of sentence.matchAll(
        new RegExp(
            "((?:`[^`]+`(?:\\s*/\\s*)?)+)\\s+(?:from|of)\\s+" + MARK,
            "g",
        ),
    )) {
        addRun(m[1], "A3 source");
    }
    // A4 — value.js ( `X` … ): the import parenthetical bound to the mention
    for (const m of sentence.matchAll(
        new RegExp(MARK + "`?\\s*\\(([^)]*)\\)", "g"),
    )) {
        addRun(m[1], "A4 import-parenthetical");
    }
    return found;
}

async function clauseProvenance() {
    const value = await valueExportSets();
    const own = ownExports();
    const files = walk(["src", "demo", "test"]);
    const violations = [];
    let sentences = 0;
    let candidates = 0;
    for (const file of files) {
        const text = readFileSync(file, "utf8");
        if (!text.includes("value.js")) continue;
        const fileLines = text.split("\n");
        /** The line the named identifier actually sits on, inside the block. */
        const siteLine = (block, name) => {
            for (
                let i = block.line - 1;
                i < Math.min(block.endLine ?? block.line, fileLines.length);
                i++
            ) {
                if (fileLines[i].includes(name)) return i + 1;
            }
            return block.line;
        };
        for (const block of commentBlocks(text)) {
            for (const { sentence, subpaths } of attributionSentences(
                block.text,
            )) {
                sentences++;
                for (const [name, form] of attributedIdentifiers(sentence)) {
                    candidates++;
                    const named = subpaths.filter((s) => value.sets.has(s));
                    const inNamed = named.some((s) =>
                        value.sets.get(s).has(name),
                    );
                    const inAny = value.all.has(name);
                    if (named.length > 0 ? inNamed : inAny) continue;
                    violations.push({
                        file: rel(file),
                        line: siteLine(block, name),
                        name,
                        form,
                        subpaths: named,
                        kind: own.has(name) ? "MISATTRIBUTED" : "PHANTOM",
                    });
                }
            }
        }
    }
    // One row per (file, line, identifier): a name caught by two attribution
    // forms at one coordinate is ONE false attribution, not two.
    const seen = new Set();
    const rows = violations.filter((v) => {
        const key = `${v.file}:${v.line}:${v.name}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
    violations.length = 0;
    violations.push(...rows);
    const pass = violations.length === 0;
    if (!asJson) {
        console.log(
            `census C1 provenance — value.js ${value.version}, ${value.subpaths.length} subpaths, ` +
                `${value.all.size} exported names; ${files.length} source files scanned, ` +
                `${sentences} attributing sentence(s), ${candidates} attributed identifier(s).`,
        );
        for (const v of violations) {
            console.error(
                `  ${v.kind}  ${v.file}:${v.line}  \`${v.name}\` (${v.form}` +
                    `${v.subpaths.length ? `, attributed to ${VALUE_PKG}/${v.subpaths.join(", ")}` : ""}) — ` +
                    (v.kind === "MISATTRIBUTED"
                        ? "exported by THIS repo's src/, not by value.js"
                        : "exported by neither"),
            );
        }
        console.log(
            pass
                ? "census C1 provenance — PASS: every value.js-attributed identifier is a real export."
                : `census C1 provenance — FAIL: ${violations.length} false attribution(s).`,
        );
    }
    return { clause: "provenance", pass, violations, candidates, sentences };
}

// ── C2 · citations ──────────────────────────────────────────────────────────

/** The eight enumerated citation targets (X.KF.W4 §Bounds, Citation targets). */
const EMBEDDED_SITES = [
    "demo/DESIGN.md",
    "demo/components/instrument/shell/EditorStartScreen.vue",
    "demo/app/App.vue",
    "demo/components/instrument/shell/HeroAurora.vue",
    "demo/components/instrument/shell/TypingDots.vue",
    "demo/styles/layout.css",
    "demo/styles/design-idioms.css",
    "demo/scenes/spring/SpringPhysicsFacet.vue",
];

/** The declared carve — out of the denominator BY NAME, printed every run. */
const CARVE = {
    name: "proof:brittleness",
    site: "demo/styles/layout.css",
    routedTo: "KF.W6 (X.KF.W4 §Excluded 17)",
};

function readSiteRoster(sitesArg) {
    if (!sitesArg)
        return {
            source: "embedded roster (X.KF.W4 §Bounds)",
            sites: EMBEDDED_SITES,
        };
    const artefact = path.resolve(process.cwd(), sitesArg);
    if (!existsSync(artefact)) {
        return { error: `--sites artefact not found: ${sitesArg}`, sites: [] };
    }
    const text = readFileSync(artefact, "utf8");
    const sites = [];
    for (const m of text.matchAll(/^\s*[-*]\s+`([^`]+)`/gm)) {
        if (/\.(md|vue|css|ts|mjs|js|json)$/.test(m[1])) sites.push(m[1]);
    }
    return {
        source: `${sitesArg} (sha256 ${sha(text)})`,
        sites: [...new Set(sites)],
    };
}

/** Every runnable proof name: npm scripts + gate scripts on disk. */
function runnableProofNames() {
    const pkg = JSON.parse(
        readFileSync(path.join(REPO, "package.json"), "utf8"),
    );
    const names = new Set();
    for (const key of Object.keys(pkg.scripts ?? {})) {
        if (key.startsWith("proof:")) names.add(key);
    }
    return names;
}

function clauseCitations() {
    const roster = readSiteRoster(flag("sites"));
    const runnable = runnableProofNames();
    const rows = [];
    const violations = [];
    let carveSeen = 0;
    if (roster.error) {
        if (!asJson)
            console.error(`census C2 citations — FAIL: ${roster.error}`);
        return {
            clause: "citations",
            pass: false,
            violations: [{ error: roster.error }],
        };
    }
    for (const site of roster.sites) {
        const abs = path.join(REPO, site);
        if (site.startsWith("docs/tranches/")) {
            violations.push({
                site,
                line: 0,
                name: "-",
                why: "dated record — out of the census's scope by law",
            });
            continue;
        }
        if (!existsSync(abs)) {
            violations.push({
                site,
                line: 0,
                name: "-",
                why: "enumerated site does not exist",
            });
            continue;
        }
        const text = readFileSync(abs, "utf8");
        const digest = sha(text);
        const lines = text.split("\n");
        let hits = 0;
        for (let i = 0; i < lines.length; i++) {
            for (const m of lines[i].matchAll(/proof:[A-Za-z0-9_-]+/g)) {
                const name = m[0];
                hits++;
                if (name === CARVE.name) {
                    carveSeen++;
                    continue; // DECLARED CARVE — out of the denominator by name
                }
                if (!runnable.has(name)) {
                    violations.push({
                        site,
                        line: i + 1,
                        name,
                        why: "resolves to no executable script or gate",
                    });
                }
            }
        }
        rows.push({ site, sha256: digest, citations: hits });
    }
    // The carve is a CARVE, not a cure: its subject must still stand here.
    let carveIntact = true;
    if (roster.sites.includes(CARVE.site)) {
        carveIntact = carveSeen > 0;
        if (!carveIntact) {
            violations.push({
                site: CARVE.site,
                line: 0,
                name: CARVE.name,
                why: "the DECLARED CARVE's subject was cured inside this wave — the family is routed, not ours",
            });
        }
    }
    const pass = violations.length === 0;
    if (!asJson) {
        console.log(`census C2 citations — site roster: ${roster.source}`);
        console.log(
            `census C2 citations — DECLARED CARVE: \`${CARVE.name}\` at ${CARVE.site} is OUT of this ` +
                `clause's denominator BY NAME; routed whole to ${CARVE.routedTo}. ` +
                `Subject present: ${carveSeen} citation(s).`,
        );
        for (const r of rows)
            console.log(
                `  ${r.site}  sha256 ${r.sha256}  ${r.citations} citation(s)`,
            );
        for (const v of violations)
            console.error(`  DEAD  ${v.site}:${v.line}  ${v.name} — ${v.why}`);
        console.log(
            pass
                ? `census C2 citations — PASS: every citation at ${rows.length} enumerated site(s) resolves ` +
                      `to an executable (runnable: ${[...runnable].sort().join(", ")}).`
                : `census C2 citations — FAIL: ${violations.length} dead citation(s) at enumerated sites.`,
        );
    }
    return { clause: "citations", pass, violations, rows, carveSeen };
}

// ── C3 · manifest ───────────────────────────────────────────────────────────

function clauseManifest() {
    const pkgText = readFileSync(path.join(REPO, "package.json"), "utf8");
    const pkg = JSON.parse(pkgText);
    const devDeps = Object.keys(pkg.devDependencies ?? {});
    const scriptText = Object.values(pkg.scripts ?? {}).join("\n");
    const configFiles = readdirSync(REPO, { withFileTypes: true })
        .filter(
            (e) =>
                e.isFile() &&
                /\.(json|ts|js|cjs|mjs|yml|yaml)$/.test(e.name) &&
                e.name !== "package-lock.json",
        )
        .map((e) => path.join(REPO, e.name));
    const ciDir = path.join(REPO, ".github/workflows");
    if (existsSync(ciDir)) {
        for (const f of readdirSync(ciDir))
            configFiles.push(path.join(ciDir, f));
    }
    const configText = configFiles
        .map((f) => readFileSync(f, "utf8"))
        .join("\n");
    const sourceText = walk(["src", "demo", "test", "scripts"])
        .map((f) => readFileSync(f, "utf8"))
        .join("\n");

    const dead = [];
    for (const dep of devDeps) {
        const spec = new RegExp(
            `(?:from\\s*|import\\s*\\(?\\s*|require\\(\\s*)["'\`]${dep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:/[^"'\`]*)?["'\`]`,
        );
        const bare = new RegExp(
            `(?<![\\w@/-])${dep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w-])`,
        );
        const viaImport = spec.test(sourceText);
        const viaConfig = bare.test(configText);
        const viaScript = bare.test(scriptText);
        if (!viaImport && !viaConfig && !viaScript) dead.push(dep);
    }
    const pass = dead.length === 0;
    if (!asJson) {
        console.log(
            `census C3 manifest — ${devDeps.length} devDependencies declared; consumers sought as ` +
                `import specifier (src/ demo/ test/ scripts/), config reference (${configFiles.length} files), or npm script.`,
        );
        for (const d of dead)
            console.error(
                `  DEAD DEVDEP  ${d} — no import specifier, config reference or npm script names it`,
            );
        console.log(
            pass
                ? `census C3 manifest — PASS: every declared devDependency has a consumer.`
                : `census C3 manifest — FAIL: ${dead.length} dead devDependenc${dead.length === 1 ? "y" : "ies"}.`,
        );
    }
    return { clause: "manifest", pass, dead, devDeps: devDeps.length };
}

// ── driver ──────────────────────────────────────────────────────────────────

const results = [];
for (const clause of run) {
    if (clause === "provenance") results.push(await clauseProvenance());
    if (clause === "citations") results.push(clauseCitations());
    if (clause === "manifest") results.push(clauseManifest());
}
if (asJson) {
    console.log(JSON.stringify({ repo: rel(REPO) || ".", results }, null, 2));
}
const failed = results.filter((r) => !r.pass);
if (!asJson) {
    console.log(
        failed.length === 0
            ? `census — PASS: ${results.map((r) => r.clause).join(" · ")}`
            : `census — FAIL: ${failed.map((r) => r.clause).join(" · ")}`,
    );
}
process.exit(failed.length === 0 ? 0 : 1);
