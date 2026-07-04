#!/usr/bin/env node
/**
 * proof:no-any-default — no CONSTRAINED generic on the published type surface
 * defaults to `any` (S.B6 S1; a29 Finding 1; SPEC §3 S.B6 gate criterion 2).
 *
 * THE DEBT. R left every core generic defaulting to `any` — `<V extends Vars =
 * any>` at 11 sites (`KeyframesAnimation`, `Sequence`, `FrameCompiler`,
 * `AdoptResult`, `CompileInput`, `IngestedAnimation`/`IngestResult`,
 * `adoptRunning`, `fromStyleSheets`/`fromLiveAnimations`/`resolveLiveKeyframes`)
 * and `<V extends Record<string, any> = any>` at the SVG family (7 sites). A
 * default of `= any` (not `= Vars`) collapses every unparameterised use to
 * `any`: `new CSSKeyframesAnimation()` is `<any>`, and a method returning `V`
 * returns `any` — TS stops checking, and the `any` propagates to callers. The
 * fix (S.B6 S1): flip all to `= Vars` and unify the SVG family on
 * `<V extends Vars = Vars>`.
 *
 * THE ONE EXEMPTION (a29 F1). `Vars<T = any>` itself KEEPS its `<T = any>`
 * escape — it is the free-form VALUE-SLOT of the index-signature type
 * (`{ [k: string]: number | string | T }`), the deliberate any-hatch for a
 * nested value the domain cannot name. It is UNCONSTRAINED (no `extends`), which
 * is exactly how this gate distinguishes it: the gate flags a `= any` default
 * ONLY on a CONSTRAINED generic (`… extends … = any`), never the bare Vars slot.
 *
 * BORN-RED WITNESS. On the pre-flip roll-up (the 11 + 7 `= any` defaults present)
 * this gate REDs, one finding per site; after S.B6 S1 flips + rebuild it goes
 * GREEN with only `Vars<T = any>` surviving.
 *
 * MEASURES THE BUILT ARTIFACT — the rolled-up `dist/keyframes.d.ts` AND the
 * `dist/engine/index.d.ts` subpath (the two surfaces a consumer installs), not a
 * `src/**` proxy a roll-up could mask.
 *
 * PRECONDITION: the library is built (`npm run build:lib`). Exit 3 on an unbuilt
 * tree — same sequencing as `proof:published-surface`.
 *
 * CI posture: HARD (development-only through S; wired at S.Z2). Structural,
 * device-independent.
 *
 * RUN: npm run proof:no-any-default
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist");
const SURFACES = [
    ["dist/keyframes.d.ts", path.join(DIST, "keyframes.d.ts")],
    ["dist/engine/index.d.ts", path.join(DIST, "engine", "index.d.ts")],
];

const failures = [];

// ─────────────────────────────────────────────────────────────────────────────
// Precondition — the built artifact exists. The gate measures dist AS BUILT.
// ─────────────────────────────────────────────────────────────────────────────
for (const [label, p] of SURFACES) {
    if (!fs.existsSync(p)) {
        console.error(
            `proof:no-any-default — ERROR: ${label} missing. ` +
                "Run `npm run build:lib` first (the gate measures the built artifact).",
        );
        process.exit(3);
    }
}

/** Block + line comments → removed (line structure preserved). */
const stripComments = (src) =>
    src
        .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ""))
        .replace(/(^|\n)[ \t]*\/\/[^\n]*/g, "$1");

// A generic-parameter DEFAULT of `= any`: an `= any` immediately followed by the
// end of a type-param (`,` next param, or `>` end of list). This distinguishes a
// DEFAULT (`X = any`) from a TYPE-ARGUMENT (`Record<string, any>` → `, any>`,
// preceded by `,` not `=`). The optional `extends …` clause (group 2) is what
// tells a CONSTRAINED param (flag) from the bare Vars free-form slot (exempt).
const DEFAULT_ANY =
    /([A-Za-z_$][\w$]*)((?:\s+extends\s+[^=]+?)?)\s*=\s*any(?=\s*[,>])/g;

for (const [label, p] of SURFACES) {
    console.log(`\nscanning ${label} for constrained \`= any\` generic defaults`);
    const src = stripComments(fs.readFileSync(p, "utf8"));
    const lines = src.split("\n");
    let sawVarsSlot = false;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        DEFAULT_ANY.lastIndex = 0;
        let m;
        while ((m = DEFAULT_ANY.exec(line)) !== null) {
            const name = m[1];
            const constrained = m[2].trim().startsWith("extends");
            if (constrained) {
                failures.push(
                    `${label}:${i + 1} — constrained generic \`${name} ${m[2].trim()} = any\` ` +
                        "defaults to `any` (collapses every unparameterised use to " +
                        "`any`). Flip the default to `= Vars` (S.B6 S1 / a29 F1).",
                );
            } else if (/\btype Vars\s*</.test(line) && name === "T") {
                // The ONE sanctioned free-form value slot — `Vars<T = any>`.
                sawVarsSlot = true;
            } else {
                failures.push(
                    `${label}:${i + 1} — unconstrained generic \`${name} = any\` defaults ` +
                        "to `any` outside the sanctioned `Vars<T = any>` value slot. " +
                        "Constrain it (`extends Vars = Vars`) or remove the any-default.",
                );
            }
        }
    }
    // The barrel MUST still carry the free-form Vars slot — its disappearance
    // would mean a mechanical over-flip that broke the one legitimate any-hatch.
    if (label === "dist/keyframes.d.ts" && !sawVarsSlot) {
        failures.push(
            `${label} — the sanctioned \`Vars<T = any>\` free-form value slot is ` +
                "ABSENT; a mechanical flip removed the one legitimate any-hatch " +
                "(a29 F1 says KEEP it). Restore `export type Vars<T = any>`.",
        );
    }
}

// ─────────────────────────────────────────────────────────────────────────────

if (failures.length > 0) {
    console.error(
        `\nproof:no-any-default — FAIL (${failures.length} finding(s); a constrained ` +
            "generic defaults to `any` on the published type surface):",
    );
    for (const f of failures) console.error("  ✗ " + f);
    console.error(
        "\n  A `= any` default collapses the whole public class family to unchecked\n" +
            "  `any`. Flip every `<V extends Vars = any>` / `<V extends Record<string,\n" +
            "  any> = any>` to `<V extends Vars = Vars>` (S.B6 S1). The ONLY sanctioned\n" +
            "  `= any` default is the free-form `Vars<T = any>` value slot (a29 F1).",
    );
    process.exit(1);
}

console.log(
    "\nproof:no-any-default — PASS: no CONSTRAINED generic on the published type\n" +
        "surface defaults to `any`; only the sanctioned `Vars<T = any>` free-form\n" +
        "value slot survives (dist/keyframes.d.ts + dist/engine/index.d.ts).",
);
