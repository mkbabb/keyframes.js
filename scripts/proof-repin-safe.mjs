// proof:repin-safe — G.W1 (the re-pin SAFETY verification; the measure-first
// lock the Band-1 re-pin ships behind). A PRE-STAGE gate: it certifies the
// `@mkbabb/value.js ^0.10.0→^0.11.0` + `@mkbabb/parse-that ^0.8.2→^0.9.0`
// re-pin (G.W2) is NON-BREAKING *before* the lockfile moves. It is NOT chained
// into `proof:all` — it reads the PUBLISHED 0.11.0/0.9.0 typings against kf's
// LIVE import list while the tree is still on the old pins. (`a-deferred-ledger
// §0 RP-1`, `a-valuejs-leverage §0`, `a-parsethat-leverage G-PT-1`.)
//
// The §Mandate forbids shipping the re-pin on `F/FINAL.md:11-12`'s assertion
// ("kf consumes them unchanged … on re-pin — ZERO kf edit needed"). This gate
// is the falsifiable form of that claim. It bundles four clauses:
//
//   (a) S1  — parse-that 0.9.0's ONLY break (the `.memoize()`/`.mergeMemos()`
//             Parser-method removal) has zero kf call-sites:
//             `grep -c "\.memoize(" src/` over kf = 0. BITES: a kf `.memoize()`
//             call (which would fail to compile against 0.9.0) reds.
//   (b) S2  — every value.js name kf statically imports survives 0.11.0:
//             kf's import list ∩ the published 0.11.0 export table === the full
//             import list. BITES: a removed/renamed value.js name → the
//             survivor count drops below the consumed count → reds.
//   (c) S1c — kf's one DIRECT parse-that import (`any as parseAny`,
//             utils.ts:1) is in the published 0.9.0 export table. BITES: `any`
//             removed/renamed upstream → reds (the re-pin would break
//             utils.ts:1).
//   (d) S3  — `proof:boundary` GREEN: the light tier carries no static
//             value.js/parse-that edge; the heavy surface is single-dispatch
//             (`engine.ts:731 lerpValue → iv._lerp`), so the re-pin's blast
//             radius is bounded to the one seam. BITES: a static sibling edge
//             in a light module reds.
//
// The symbol survival is checked against the PUBLISHED dist (`npm pack` into a
// throw-away temp dir), NOT the source tree or the installed node_modules —
// because the published registry artifact is exactly what kf resolves on
// re-pin. The repo `package.json` deps + `node_modules` are NOT mutated by
// this gate (the re-pin is G.W2). (`a-valuejs-leverage §design 3`.)
//
// RUN: node scripts/proof-repin-safe.mjs
//
// The published floors this gate certifies against (the G.W2 targets):
const VALUEJS_TARGET = "0.11.1";
const PARSETHAT_TARGET = "0.9.0";

import { execFileSync } from "node:child_process";
import {
    mkdtempSync,
    readFileSync,
    readdirSync,
    rmSync,
    existsSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(root, "src");

// ── helpers ────────────────────────────────────────────────────────────────

/** Recursively collect every .ts file under a directory. */
function tsFiles(dir) {
    const out = [];
    for (const ent of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, ent.name);
        if (ent.isDirectory()) out.push(...tsFiles(p));
        else if (ent.isFile() && ent.name.endsWith(".ts")) out.push(p);
    }
    return out;
}

/**
 * Extract the set of named symbols kf statically imports from a given module
 * specifier across the whole src/ tree. Reads the LIVE source (the consumer
 * side of the seam) — the import list is derived, never hardcoded, so a new
 * consumed name is automatically swept (and a renamed-to-non-exported name
 * BITES). Handles `import { a, b as c, type D } from "spec"` across multiple
 * lines; records the LOCAL-side name (the upstream export name).
 */
function importedNames(specifier) {
    const names = new Map(); // exportName -> first site "file:line"
    const re = new RegExp(
        `import\\s+(?:type\\s+)?\\{([^}]*)\\}\\s+from\\s+["']${specifier.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&",
        )}["']`,
        "g",
    );
    for (const file of tsFiles(SRC)) {
        const text = readFileSync(file, "utf8");
        let m;
        while ((m = re.exec(text)) !== null) {
            // line number of the match start, for grounding the bite report
            const line = text.slice(0, m.index).split("\n").length;
            for (const raw of m[1].split(",")) {
                const tok = raw.trim();
                if (!tok) continue;
                // strip a leading `type ` modifier on the specifier
                const cleaned = tok.replace(/^type\s+/, "");
                // `Foo as Bar` → the UPSTREAM export name is `Foo`
                const exportName = cleaned.split(/\s+as\s+/)[0].trim();
                if (exportName && !names.has(exportName)) {
                    const rel = file.slice(root.length + 1);
                    names.set(exportName, `${rel}:${line}`);
                }
            }
        }
    }
    return names;
}

/**
 * Parse the named-export table from a published package's barrel `index.d.ts`.
 * value.js's barrel enumerates every name explicitly via `export { a, b, type C
 * } from './sub'` (no `export *`), so the barrel IS the export table.
 * parse-that's barrel has one `export * from './parsers/index.js'`; we follow
 * any `export *` one hop into the named dist d.ts so the table is complete.
 */
function exportTable(distDir, entry = "index.d.ts") {
    const names = new Set();
    const seen = new Set();
    const visit = (relFile) => {
        const file = join(distDir, relFile);
        if (seen.has(file) || !existsSync(file)) return;
        seen.add(file);
        const text = readFileSync(file, "utf8");
        // named export lists: `export { ... } from '...';` and bare
        // `export { ... };` re-export blocks.
        const namedRe = /export\s+(?:type\s+)?\{([^}]*)\}/g;
        let m;
        while ((m = namedRe.exec(text)) !== null) {
            for (const raw of m[1].split(",")) {
                const tok = raw.trim();
                if (!tok) continue;
                const cleaned = tok.replace(/^type\s+/, "");
                // `Foo as Bar` in a re-export exposes `Bar` downstream
                const parts = cleaned.split(/\s+as\s+/);
                const exposed = (parts[1] ?? parts[0]).trim();
                if (exposed) names.add(exposed);
            }
        }
        // follow `export * from './x.js'` one hop (resolve .js -> .d.ts)
        const starRe = /export\s+\*\s+from\s+["']([^"']+)["']/g;
        while ((m = starRe.exec(text)) !== null) {
            let target = m[1].replace(/\.js$/, "");
            // target may be a dir (its index) or a file
            const asDts = `${target}.d.ts`;
            const asIndex = join(target, "index.d.ts");
            if (existsSync(join(distDir, asDts))) visit(asDts);
            else if (existsSync(join(distDir, asIndex))) visit(asIndex);
        }
    };
    visit(entry);
    return names;
}

/**
 * Pack a published package version into the throw-away temp dir, extract it,
 * and return the path to its `dist` directory. Touches NO repo state — the
 * tarball + extraction live entirely under `workdir`. `npm pack` writes only
 * the .tgz to cwd; we run it inside `workdir`.
 */
function packPublished(workdir, name, version) {
    const tgz = execFileSync(
        "npm",
        ["pack", `${name}@${version}`, "--silent"],
        { cwd: workdir, encoding: "utf8" },
    )
        .trim()
        .split("\n")
        .pop()
        .trim();
    const tgzPath = join(workdir, tgz);
    const outDir = join(workdir, `${tgz}.x`);
    execFileSync("tar", ["-xzf", tgzPath, "-C", workdir], { cwd: workdir });
    // npm tarballs extract to a top-level `package/` dir
    execFileSync("mv", [join(workdir, "package"), outDir]);
    const dist = join(outDir, "dist");
    if (!existsSync(dist)) {
        throw new Error(
            `published ${name}@${version} has no dist/ (got ${tgz})`,
        );
    }
    return dist;
}

// ── the gate ─────────────────────────────────────────────────────────────────

const fail = [];
const pass = [];

// clause (a) — S1: parse-that's `.memoize()` break has zero kf call-sites.
{
    let hits = 0;
    const sites = [];
    const re = /\.memoize\(/g;
    for (const file of tsFiles(SRC)) {
        const text = readFileSync(file, "utf8");
        let m;
        while ((m = re.exec(text)) !== null) {
            hits++;
            const line = text.slice(0, m.index).split("\n").length;
            sites.push(`${file.slice(root.length + 1)}:${line}`);
        }
    }
    if (hits > 0) {
        fail.push(
            `(a) S1: ${hits} kf \`.memoize(\` call-site(s) — parse-that ` +
                `${PARSETHAT_TARGET} removed the Parser \`.memoize()\` method ` +
                `(re-homed as a free fn in packrat.ts), so these would fail to ` +
                `compile on the re-pin:\n      ` +
                sites.join("\n      "),
        );
    } else {
        pass.push(
            `(a) S1: zero kf \`.memoize(\` call-sites — parse-that ` +
                `${PARSETHAT_TARGET}'s only break touches no kf production path.`,
        );
    }
}

// Derive kf's LIVE consumed-name sets (the falsifier surface for (b)/(c)).
const vjConsumed = importedNames("@mkbabb/value.js");
const ptConsumed = importedNames("@mkbabb/parse-that");

// Pack the PUBLISHED typings into a throw-away temp dir; repo node_modules
// untouched. Always clean up.
const work = mkdtempSync(join(tmpdir(), "proof-repin-safe-"));
try {
    const vjDist = packPublished(work, "@mkbabb/value.js", VALUEJS_TARGET);
    const ptDist = packPublished(work, "@mkbabb/parse-that", PARSETHAT_TARGET);
    const vjTable = exportTable(vjDist);
    const ptTable = exportTable(ptDist);

    // clause (b) — S2: every kf-consumed value.js name survives 0.11.0.
    {
        const consumed = [...vjConsumed.keys()].sort();
        const missing = consumed.filter((n) => !vjTable.has(n));
        if (missing.length > 0) {
            fail.push(
                `(b) S2: ${missing.length}/${consumed.length} kf-consumed ` +
                    `value.js name(s) MISSING from the published ` +
                    `${VALUEJS_TARGET} export table — the re-pin would break ` +
                    `these import sites:\n      ` +
                    missing
                        .map((n) => `${n}  (kf ${vjConsumed.get(n)})`)
                        .join("\n      "),
            );
        } else {
            pass.push(
                `(b) S2: ${consumed.length}/${consumed.length} kf-consumed ` +
                    `value.js names survive ${VALUEJS_TARGET} (0 MISSING).`,
            );
        }
    }

    // clause (c) — S1c: kf's one direct parse-that import survives 0.9.0.
    {
        const consumed = [...ptConsumed.keys()].sort();
        const missing = consumed.filter((n) => !ptTable.has(n));
        if (consumed.length === 0) {
            fail.push(
                `(c) S1c: no direct kf→parse-that import found — the gate ` +
                    `expects exactly the one \`any as parseAny\` edge ` +
                    `(utils.ts:1). A vanished edge means the gate lost its ` +
                    `subject; re-ground it.`,
            );
        } else if (missing.length > 0) {
            fail.push(
                `(c) S1c: kf direct parse-that import(s) MISSING from the ` +
                    `published ${PARSETHAT_TARGET} export table:\n      ` +
                    missing
                        .map((n) => `${n}  (kf ${ptConsumed.get(n)})`)
                        .join("\n      "),
            );
        } else {
            pass.push(
                `(c) S1c: kf's direct parse-that import(s) [${consumed.join(
                    ", ",
                )}] survive ${PARSETHAT_TARGET}.`,
            );
        }
    }
} finally {
    rmSync(work, { recursive: true, force: true });
}

// clause (d) — S3: proof:boundary green (the structural witness).
{
    try {
        execFileSync("npm", ["run", "--silent", "proof:boundary"], {
            cwd: root,
            stdio: "pipe",
        });
        pass.push(
            "(d) S3: proof:boundary GREEN — the light tier carries no static " +
                "value.js/parse-that edge; the re-pin's blast radius is the " +
                "one lerpValue→iv._lerp seam.",
        );
    } catch (e) {
        const out = `${e.stdout ?? ""}${e.stderr ?? ""}`.trim();
        fail.push(
            "(d) S3: proof:boundary RED — a static sibling edge crossed the " +
                "light boundary; the re-pin's blast radius is unbounded:\n      " +
                out.split("\n").slice(-6).join("\n      "),
        );
    }
}

// ── verdict ──────────────────────────────────────────────────────────────────

if (fail.length > 0) {
    console.error(
        `\nproof:repin-safe — FAIL: the re-pin to value.js ${VALUEJS_TARGET} / ` +
            `parse-that ${PARSETHAT_TARGET} is NOT certified non-breaking.\n`,
    );
    for (const f of fail) console.error("  ✗ " + f);
    for (const p of pass) console.error("  ✓ " + p);
    console.error(
        "\n  The §Mandate forbids landing the re-pin on assertion. Resolve " +
            "every clause before G.W2 moves the lockfile.",
    );
    process.exit(1);
}

console.log(
    `proof:repin-safe — PASS: the re-pin to value.js ${VALUEJS_TARGET} / ` +
        `parse-that ${PARSETHAT_TARGET} is certified non-breaking ` +
        `(${vjConsumed.size} value.js names + ${ptConsumed.size} direct ` +
        `parse-that import survive; zero \`.memoize(\` call-sites; boundary ` +
        `intact). G.W2 may move the lockfile behind this lock.`,
);
for (const p of pass) console.log("  ✓ " + p);
