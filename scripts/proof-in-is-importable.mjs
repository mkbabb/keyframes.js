#!/usr/bin/env node
/**
 * proof:in-is-importable — the R.W4 born-RED gate: the "in" to keyframes.js is
 * a real, statically-importable surface, not a README snippet that cannot run.
 *
 * The retro-api-in audit's HEADLINE: the README Quick Start — the literal first
 * code a consumer copies — instantiated `new CSSKeyframesAnimation(...)` with no
 * import line, against a symbol 5.0.0 made impossible to statically import
 * (`CSSKeyframesAnimation` is `export type` only on the `.` barrel). R.W4 §2.1
 * fixes this structurally with the `@mkbabb/keyframes.js/engine` subpath. This
 * gate is the tripwire that proves the fix landed AND stays landed.
 *
 * THREE clauses, all must pass:
 *
 *   (1) THE SUBPATH RESOLVES (the structural "in"). `import { CSSKeyframesAnimation }
 *       from "@mkbabb/keyframes.js/engine"` resolves against the BUILT `dist/`
 *       — the `./engine` export exists in package.json AND the file it points at
 *       is present — and `typeof CSSKeyframesAnimation === "function"`. The
 *       born-RED state: before §2.1 added the subpath, this import throws
 *       `ERR_PACKAGE_PATH_NOT_EXPORTED` and the clause exits 1.
 *
 *   (2) THE QUICK START IS A REAL `ts run` FENCE. The README's first fenced block
 *       after `## Quick Start` is tagged ```ts run``` (not bare ```ts), so
 *       proof:readme-runs can enforce it, AND it contains an import from
 *       `@mkbabb/keyframes.js` (either `.` or `/engine`). A bare fence or a
 *       no-import snippet REDs — the docs-hygiene half, runnable without the
 *       build present.
 *
 *   (3) AGENT-SURFACE GREEN (co-assertion). Spawn `proof-agent-surface.mjs` and
 *       assert exit 0 — folding the `Animation`/`ScrollTimeline` phantom-export
 *       check into this gate. The 5.0.0 no-legacy drop completing is part of the
 *       honest "in".
 *
 * PRECONDITION (clause 1 only): the library is built. If dist is absent the
 * clause fails loud (exit 3 is reserved for harness error; a missing dist on the
 * subpath clause is a clause-1 RED with a build-first hint).
 *
 * RUN: npm run proof:in-is-importable
 */
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const README = path.join(REPO, "README.md");
const PKG = path.join(REPO, "package.json");

const failures = [];
const ok = (msg) => console.log(`  ✓ ${msg}`);

console.log(
    "proof:in-is-importable — the honest 'in' is statically importable + the Quick Start runs",
);

// ─────────────────────────────────────────────────────────────────────────────
// (1) The ./engine subpath resolves against the built dist.
// ─────────────────────────────────────────────────────────────────────────────
{
    const pkg = JSON.parse(fs.readFileSync(PKG, "utf8"));
    const engineExport = pkg.exports?.["./engine"];
    if (!engineExport) {
        failures.push(
            "(1) @mkbabb/keyframes.js/engine subpath does not resolve — the ./engine export is absent from package.json. " +
                "The Quick Start 'new CSSKeyframesAnimation' cannot be statically imported.",
        );
    } else {
        const target = path.resolve(
            REPO,
            engineExport.import ?? engineExport.default,
        );
        const typesTarget = engineExport.types
            ? path.resolve(REPO, engineExport.types)
            : null;
        if (!fs.existsSync(target)) {
            failures.push(
                `(1) the ./engine export points at ${path.relative(REPO, target)} which does NOT exist on disk — run \`npm run build:lib\` first (the gate measures the BUILT subpath).`,
            );
        } else if (typesTarget && !fs.existsSync(typesTarget)) {
            failures.push(
                `(1) the ./engine export's types (${path.relative(REPO, typesTarget)}) are MISSING — a consumer importing the subpath gets broken types.`,
            );
        } else {
            // Resolve through Node's package-exports machinery against the real
            // specifier — the consumer's exact "in" — then assert the class is a
            // constructor, not a type-only erasure.
            try {
                const mod = await import("@mkbabb/keyframes.js/engine");
                if (typeof mod.CSSKeyframesAnimation !== "function") {
                    failures.push(
                        `(1) @mkbabb/keyframes.js/engine resolves but CSSKeyframesAnimation is \`${typeof mod.CSSKeyframesAnimation}\`, not \`function\` — the static "in" is not a real constructor.`,
                    );
                } else {
                    ok(
                        `(1) @mkbabb/keyframes.js/engine resolves against dist/ — CSSKeyframesAnimation is a constructor (statically importable)`,
                    );
                }
            } catch (err) {
                failures.push(
                    `(1) importing @mkbabb/keyframes.js/engine threw (${err?.code ?? err?.message}) — the subpath does not resolve against the built dist.`,
                );
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// (2) The README Quick Start is a real `ts run` fence with an import.
// ─────────────────────────────────────────────────────────────────────────────
{
    const readme = fs.readFileSync(README, "utf8");
    const qsIdx = readme.search(/^##\s+Quick Start\s*$/m);
    if (qsIdx === -1) {
        failures.push(
            "(2) no `## Quick Start` section in README.md — the first code a user copies is gone (fail-loud).",
        );
    } else {
        // The section body runs from the heading to the next `##` heading.
        const after = readme.slice(qsIdx + 1);
        const nextSec = after.search(/^##\s+/m);
        const body = nextSec === -1 ? after : after.slice(0, nextSec);
        const fence = body.match(/^```([^\n]*)\n([\s\S]*?)^```/m);
        if (!fence) {
            failures.push(
                "(2) the Quick Start section has NO fenced code block — there is no first snippet to run.",
            );
        } else {
            const info = fence[1].trim();
            const code = fence[2];
            if (!/^ts\s+run\b/.test(info)) {
                failures.push(
                    `(2) README Quick Start fence is not tagged 'ts run' (got \`${info || "<bare>"}\`) — proof:readme-runs cannot enforce the import.`,
                );
            }
            const hasImport = /\bfrom\s+["']@mkbabb\/keyframes\.js(?:\/engine)?["']/.test(
                code,
            );
            if (!hasImport) {
                failures.push(
                    "(2) Quick Start has no import line from `@mkbabb/keyframes.js` (`.` or `/engine`) — it cannot compile.",
                );
            }
            if (/^ts\s+run\b/.test(info) && hasImport) {
                ok(
                    "(2) Quick Start fence is `ts run` and imports from the package surface (statically importable + CI-enforceable)",
                );
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// (3) proof:agent-surface is GREEN (co-assertion — no phantom legacy exports).
// ─────────────────────────────────────────────────────────────────────────────
{
    try {
        await execFileAsync(
            process.execPath,
            [path.join(REPO, "scripts/proof-agent-surface.mjs")],
            { cwd: REPO, encoding: "utf8" },
        );
        ok(
            "(3) proof:agent-surface exits 0 — the agent index advertises no phantom legacy export (Animation/ScrollTimeline)",
        );
    } catch (err) {
        const tail = [err.stdout, err.stderr]
            .filter(Boolean)
            .join("\n")
            .split("\n")
            .filter((l) => l.trim())
            .slice(-4)
            .join("\n      ");
        failures.push(
            `(3) proof:agent-surface FAILED (exit ${err.code}) — the agent index lies about the published surface:\n      ${tail}`,
        );
    }
}

// ─────────────────────────────────────────────────────────────────────────────
console.log("");
if (failures.length > 0) {
    console.error(
        `proof:in-is-importable — FAIL (${failures.length} finding(s); the "in" is not honest):`,
    );
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}
console.log(
    "proof:in-is-importable — PASS: the @mkbabb/keyframes.js/engine subpath\n" +
        "resolves against the built dist, the README Quick Start is a real `ts run`\n" +
        "fence that imports the surface, and the agent index carries no phantom\n" +
        "legacy export. The honest API 'in' is statically importable.",
);
process.exit(0);
