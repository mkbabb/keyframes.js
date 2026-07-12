#!/usr/bin/env node
/**
 * proof:compile-backward-leg — S.B3 structural gate (SPEC §3 S.B3 clauses 1–3;
 * C-2/C-9). The born-RED STRUCTURAL half of S.B3: the compile/ zone is layered
 * FORWARD (root) vs BACKWARD/emit (`compile/emit/`; U.C8 renamed `backward/` →
 * `emit/` and moved the two sibling emitters in), the FORWARD re-export ceremony
 * through `frame-compiler` is DEAD, and the emit leg reaches sibling zones
 * through their BARRELS (no cross-zone deep-import).
 *
 * THREE falsifiable clauses, each BITES (verified by `--plant-test`):
 *
 *   1. compile-root-forward-only — the BACKWARD leg (`backward.ts`,
 *      `backward-walk.ts`, `backward-color.ts`, `format.ts`) lives ONLY under
 *      `compile/emit/`, NEVER in `compile/` root; the FORWARD set
 *      (`frame-compiler`, `parse-flatten`, `selector`, `numeric-plan`, the
 *      `easing/` sub-zone's `easing-registry` + `easing-option`) + `adapter`
 *      (C-9) stay in the FORWARD half. A backward basename re-appearing in root
 *      REDs; a backward file missing from `compile/emit/` REDs. (a18: the
 *      real seam is FORWARD vs BACKWARD, NOT the directory name.)
 *
 *   2. no-re-export-bridge — NO non-barrel module under `compile/` carries a
 *      re-export statement (`export { … } from "…"` / `export * from …` /
 *      `export type { … } from …`). The a18 lesson: the `easing-option` /
 *      `selector` carves shipped as pure re-export ceremony THROUGH
 *      `frame-compiler` (import path unchanged) — C-2 KILLS it: consumers import
 *      the real modules. Only the zone barrels (`index.ts`) are re-export
 *      surfaces. Re-adding a bridge line to any non-barrel compile module REDs.
 *
 *   3. no-cross-zone-deep-import — the backward leg reaches sibling zones through
 *      their BARRELS (S.B3 S5, a06 F7 / a19 F2): `backward.ts` imports scroll via
 *      `../../scroll` (NOT the deep `../../scroll/grammar`); `backward-walk.ts`
 *      imports `getAnimationId` from the `internal/animation-id` LEAF (NOT
 *      re-routed through the `../../engine` barrel). A deep `../../scroll/<mod>`
 *      import REDs; a `getAnimationId` sourced from `../../engine` REDs.
 *
 * Development-only (born-RED at S.B3); re-run on the merged tree (T4) + at S.Z2.
 *
 * RUN: npm run proof:compile-backward-leg
 *      npm run proof:compile-backward-leg -- --plant-test   (born-RED self-check)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const COMPILE = path.join(REPO, "src/animation/compile");
// The emit sub-zone (U.C8 renamed `backward/` → `emit/` and moved the two sibling
// emitters entry.ts/view-transition.ts in). The a18 seam is FORWARD-vs-BACKWARD,
// NOT the directory name — the backward-leg basenames still key off this dir.
const EMIT = path.join(COMPILE, "emit");

const PLANT_TEST = process.argv.includes("--plant-test");

const rel = (abs) => path.relative(REPO, abs).split(path.sep).join("/");
const read = (abs) => fs.readFileSync(abs, "utf8");

// The backward-leg basenames (a18 C-2). These live ONLY under compile/emit/.
const BACKWARD_BASENAMES = [
    "backward.ts",
    "backward-walk.ts",
    "backward-color.ts",
    "format.ts",
];

// A re-export statement (the ceremony clause 2 forbids in a non-barrel module).
// Matches `export { … } from "…"`, `export * from "…"`, `export type … from "…"`.
const RE_EXPORT = /^\s*export\s+(?:\*|type\s|\{)[\s\S]*?\bfrom\s+["'][^"']+["']/gm;

/** Strip // and /* *​/ comments (a re-export mentioned in prose must not red). */
const stripComments = (s) =>
    s
        .replace(/\/\*[\s\S]*?\*\//g, " ")
        .replace(/(^|[^:])\/\/[^\n]*/g, "$1");

/**
 * The gate core over an injectable view of the compile zone, so `--plant-test`
 * can assert each clause fires on a synthetic violation without touching disk.
 *
 * @param rootFiles  Set<basename> present in compile/ ROOT (non-recursive).
 * @param emitFiles Set<basename> present in compile/emit/.
 * @param contents   Map<relPath, source> for the modules clauses 2/3 read.
 */
function runGate({ rootFiles, emitFiles, contents }) {
    const failures = [];

    // ── 1. compile-root-forward-only ─────────────────────────────────────────
    for (const base of BACKWARD_BASENAMES) {
        if (rootFiles.has(base)) {
            failures.push(
                `(1) [compile-root-forward-only] compile/${base} is in the ` +
                    `zone ROOT — the BACKWARD leg lives ONLY under ` +
                    `compile/emit/ (a18 FORWARD-vs-BACKWARD seam; C-2).`,
            );
        }
        if (!emitFiles.has(base)) {
            failures.push(
                `(1) [compile-root-forward-only] compile/emit/${base} is ` +
                    `MISSING — the backward leg (backward/backward-walk/` +
                    `backward-color/format) must live under compile/emit/.`,
            );
        }
    }

    // ── 2. no-re-export-bridge ───────────────────────────────────────────────
    // Every NON-barrel .ts under compile/ (root + emit/) must carry NO
    // re-export statement (only the index.ts barrels re-export). The frame-
    // compiler ceremony (C-2) is the born-RED target.
    for (const [relPath, src] of contents) {
        if (!relPath.startsWith("src/animation/compile/")) continue;
        if (relPath.endsWith("/index.ts")) continue; // barrels are re-export surfaces
        const m = stripComments(src).match(RE_EXPORT);
        if (m) {
            failures.push(
                `(2) [no-re-export-bridge] ${relPath} carries ${m.length} ` +
                    `re-export statement(s) (\`${m[0].trim().slice(0, 60)}…\`) — a ` +
                    `non-barrel compile module must NOT re-route another module's ` +
                    `names (the a18 ceremony C-2 killed). Consumers import the real ` +
                    `module; only the zone barrels (index.ts) re-export.`,
            );
        }
    }

    // ── 3. no-cross-zone-deep-import ─────────────────────────────────────────
    const backwardMain = contents.get(
        "src/animation/compile/emit/backward.ts",
    );
    if (backwardMain !== undefined) {
        const code = stripComments(backwardMain);
        const deep = code.match(/from\s+["']\.\.\/\.\.\/scroll\/[^"']+["']/g);
        if (deep) {
            failures.push(
                `(3) [no-cross-zone-deep-import] compile/emit/backward.ts ` +
                    `deep-imports the scroll zone (\`${deep[0]}\`) — reach it ` +
                    `through the \`../../scroll\` BARREL (a19 F2; the barrel is the ` +
                    `zone's single surface).`,
            );
        }
    }
    const backwardWalk = contents.get(
        "src/animation/compile/emit/backward-walk.ts",
    );
    if (backwardWalk !== undefined) {
        const code = stripComments(backwardWalk);
        const fromLeaf = /import\s*\{[^}]*\bgetAnimationId\b[^}]*\}\s*from\s*["']\.\.\/\.\.\/internal\/animation-id["']/.test(
            code,
        );
        const fromEngine = /import\s*\{[^}]*\bgetAnimationId\b[^}]*\}\s*from\s*["']\.\.\/\.\.\/engine["']/.test(
            code,
        );
        if (fromEngine || !fromLeaf) {
            failures.push(
                `(3) [no-cross-zone-deep-import] compile/emit/backward-walk.ts ` +
                    `must import \`getAnimationId\` from the \`../../internal/` +
                    `animation-id\` LEAF (a06 F7), not re-routed through the ` +
                    `\`../../engine\` barrel` +
                    (fromEngine ? " (found the engine-barrel source)" : "") +
                    ".",
            );
        }
    }

    return failures;
}

/** Live view: scan disk. */
function liveView() {
    const rootFiles = new Set(
        fs.existsSync(COMPILE)
            ? fs
                  .readdirSync(COMPILE, { withFileTypes: true })
                  .filter((e) => e.isFile())
                  .map((e) => e.name)
            : [],
    );
    const emitFiles = new Set(
        fs.existsSync(EMIT)
            ? fs
                  .readdirSync(EMIT, { withFileTypes: true })
                  .filter((e) => e.isFile())
                  .map((e) => e.name)
            : [],
    );
    // Read every non-barrel .ts under compile/ (root + emit/) for clauses 2/3.
    const contents = new Map();
    const collect = (dir) => {
        if (!fs.existsSync(dir)) return;
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
            const abs = path.join(dir, e.name);
            if (e.isDirectory()) collect(abs);
            else if (e.name.endsWith(".ts")) contents.set(rel(abs), read(abs));
        }
    };
    collect(COMPILE);
    return { rootFiles, emitFiles, contents };
}

if (PLANT_TEST) {
    console.log("proof:compile-backward-leg — born-RED plant tests\n");
    const base = liveView();
    let allFired = true;
    const check = (label, view, clausePrefix) => {
        const f = runGate(view);
        const bit = f.some((msg) => msg.startsWith(clausePrefix));
        console.log(
            bit
                ? `  ✓ plant ${label}: clause fired`
                : `  ✗ plant ${label}: clause DID NOT fire — it is broken`,
        );
        if (!bit) allFired = false;
    };

    // (1) a backward basename re-appears in compile/ root
    check(
        "(1) root holds a backward file",
        { ...base, rootFiles: new Set([...base.rootFiles, "format.ts"]) },
        "(1)",
    );

    // (2) a re-export bridge is re-added to frame-compiler
    {
        const c = new Map(base.contents);
        const fc = "src/animation/compile/frame-compiler.ts";
        c.set(
            fc,
            (c.get(fc) ?? "") + '\nexport { resolveEasingOption } from "./easing/easing-option";\n',
        );
        check("(2) re-added frame-compiler bridge", { ...base, contents: c }, "(2)");
    }

    // (3a) backward.ts deep-imports scroll/grammar
    {
        const c = new Map(base.contents);
        const bw = "src/animation/compile/emit/backward.ts";
        c.set(
            bw,
            (c.get(bw) ?? "") +
                '\nimport { serializeScrollOptions } from "../../scroll/grammar";\n',
        );
        check("(3a) deep scroll import", { ...base, contents: c }, "(3)");
    }

    // (3b) backward-walk.ts sources getAnimationId from the engine barrel
    {
        const c = new Map(base.contents);
        const bw = "src/animation/compile/emit/backward-walk.ts";
        c.set(
            bw,
            'import { getAnimationId } from "../../engine";\n' + (c.get(bw) ?? ""),
        );
        check("(3b) getAnimationId via engine barrel", { ...base, contents: c }, "(3)");
    }

    console.log("");
    if (!allFired) {
        console.error(
            "proof:compile-backward-leg — plant tests FAILED (a clause did not bite)",
        );
        process.exit(1);
    }
    console.log(
        "proof:compile-backward-leg — all plant tests passed (every clause bites)\n",
    );
    console.log("Running gate against the live tree...\n");
}

console.log(
    "proof:compile-backward-leg — S.B3 (FORWARD/BACKWARD layering + ceremony kill + no deep-import)",
);
const failures = runGate(liveView());
console.log("");
if (failures.length > 0) {
    console.error(
        `proof:compile-backward-leg — FAIL (${failures.length} finding(s)):`,
    );
    for (const f of failures) console.error("  ✗ " + f);
    console.error(
        "\n  The BACKWARD leg lives under compile/emit/; the FORWARD re-export\n" +
            "  ceremony through frame-compiler is dead; the emit leg reaches sibling\n" +
            "  zones through their barrels. Each clause reds on the exact regression it\n" +
            "  forbids (verify with --plant-test).",
    );
    process.exit(1);
}
console.log(
    "proof:compile-backward-leg — PASS: compile/ is FORWARD/BACKWARD-layered, no\n" +
        "re-export bridge survives, and the backward leg carries no cross-zone deep-import.",
);
process.exit(0);
