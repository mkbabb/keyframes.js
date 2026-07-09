#!/usr/bin/env node
/**
 * proof:dts-rollups-agree — the two independently-generated d.ts roll-ups must
 * agree on every SHARED symbol (S.B6 S3; a29 Finding 5). FROZEN NOW, before the
 * S zoning churns the pipelines' compiler options.
 *
 * THE HAZARD. kf ships TWO d.ts roll-ups from TWO different generators:
 *   - `dist/keyframes.d.ts`  — vite-plugin-dts's API-Extractor pass (bundleTypes).
 *   - `dist/engine/index.d.ts` — the hand-rolled `engineDtsRollupPlugin`
 *     (`vite.config.ts`), a SEPARATE tsc-emit + API-Extractor invocation with its
 *     OWN `overrideTsconfig` (`lib`, `moduleResolution`).
 * They share NO code path. Today they agree — the `KeyframesAnimation` block is
 * byte-identical across both — but that agreement is UNENFORCED. A
 * compilerOptions change in one pipeline (a `lib` bump, a resolution mode, a
 * trimming setting applied to one and not the other) can silently render a
 * shared symbol differently in one roll-up and not the other; CI's dts
 * byte-check validates PRESENCE, never cross-roll-up CONSISTENCY. This gate
 * freezes the byte-identity so the deeper S zoning cannot drift them apart.
 *
 * THE CHECK. For every symbol declared+exported by BOTH roll-ups, extract its
 * declaration block and assert the two are identical after normalising:
 *   - API-Extractor collision-rename suffixes (`PropertyDescriptor_2` → the base
 *     name) — the two pipelines number their aliases independently;
 *   - `export ` prefixes (the engine subpath re-exports via a trailing
 *     `export { … }`, so its declarations are bare `declare …`);
 *   - whitespace / newlines (a reflow is not a semantic drift).
 * A surviving difference is a REAL divergence — the silent-drift the gate exists
 * to catch.
 *
 * BORN-RED WITNESS. Corrupt one shared symbol's block in one built roll-up (or
 * apply trimming to one pipeline and not the other) → the normalised blocks
 * differ → RED. Rebuild (or re-symmetrise) → GREEN. On the honest tree the
 * intersection agrees byte-for-byte.
 *
 * PRECONDITION: the library is built (`npm run build:lib`). Exit 3 on an unbuilt
 * tree.
 *
 * CI posture: HARD (development-only through S; wired at S.Z2). Structural,
 * device-independent.
 *
 * RUN: npm run proof:dts-rollups-agree
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist");
const BARREL = path.join(DIST, "keyframes.d.ts");
const ENGINE = path.join(DIST, "engine", "index.d.ts");

const failures = [];

for (const [label, p] of [
    ["dist/keyframes.d.ts", BARREL],
    ["dist/engine/index.d.ts", ENGINE],
]) {
    if (!fs.existsSync(p)) {
        console.error(
            `proof:dts-rollups-agree — ERROR: ${label} missing. ` +
                "Run `npm run build:lib` first (the gate measures the built artifacts).",
        );
        process.exit(3);
    }
}

/**
 * Extract every top-level declaration BLOCK keyed by symbol name. A
 * class/interface/enum block spans its brace-balanced body; a function/const/
 * type/let/var spans to the terminating `;` at bracket depth 0 (tracking
 * `{}`/`()`/`[]`/`<>`). Both roll-ups declare each symbol exactly once.
 */
function extractDeclarations(src) {
    const decls = new Map();
    const declRe =
        /^(?:export\s+)?declare\s+(?:abstract\s+)?(class|interface|enum|function|const|let|var|type)\s+([A-Za-z_$][\w$]*)/gm;
    let m;
    while ((m = declRe.exec(src)) !== null) {
        const kind = m[1];
        const name = m[2];
        const startAt = m.index;
        let end;
        if (kind === "class" || kind === "interface" || kind === "enum") {
            // Brace-balanced body: find the first `{` after the header, match it.
            const open = src.indexOf("{", declRe.lastIndex);
            if (open === -1) continue;
            let depth = 0;
            let i = open;
            for (; i < src.length; i++) {
                const c = src[i];
                if (c === "{") depth++;
                else if (c === "}") {
                    depth--;
                    if (depth === 0) {
                        i++;
                        break;
                    }
                }
            }
            end = i;
        } else {
            // Statement to the terminating `;` at depth 0 across () {} [] ONLY.
            // Angle brackets are NOT tracked — a type `<>` never contains the
            // statement `;`, and `=>` / comparison `>` would corrupt a `<>`
            // depth count and bleed the block into the next declaration.
            let depth = 0;
            let i = declRe.lastIndex;
            for (; i < src.length; i++) {
                const c = src[i];
                if (c === "(" || c === "{" || c === "[") depth++;
                else if (c === ")" || c === "}" || c === "]") depth--;
                else if (c === ";" && depth === 0) {
                    i++;
                    break;
                }
            }
            end = i;
        }
        // Last declaration wins if a name somehow repeats (both roll-ups are
        // single-declaration; a repeat would itself be anomalous, caught elsewhere).
        decls.set(name, src.slice(startAt, end));
    }
    return decls;
}

/** Normalise a declaration block for cross-roll-up comparison. */
function normalise(block) {
    return (
        block
            // strip a leading `export ` (the subpath declares bare + re-exports).
            .replace(/^export\s+/, "")
            // drop JSDoc/line comments — the two pipelines can reflow doc text
            // differently (line-wrap), which is not a SEMANTIC declaration drift.
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/(^|\n)[ \t]*\/\/[^\n]*/g, "$1")
            // collapse API-Extractor collision-rename suffixes (`Name_2` → `Name`).
            .replace(/\b([A-Za-z_$][\w$]*)_\d+\b/g, "$1")
            // whitespace → single space, then remove spaces adjacent to
            // punctuation so a wrapped generic (`Foo<\n  Bar\n>`) and an inline
            // one (`Foo<Bar>`) normalise identically — the two API-Extractor
            // passes wrap generics at different widths (not a semantic drift).
            .replace(/\s+/g, " ")
            .replace(/\s*([<>(){}\[\],;:|&=?])\s*/g, "$1")
            .trim()
    );
}

const barrelDecls = extractDeclarations(fs.readFileSync(BARREL, "utf8"));
const engineDecls = extractDeclarations(fs.readFileSync(ENGINE, "utf8"));

// Sanity floor — the extractor must find the surface, or the whole diff is a
// false-green. The heavy classes MUST be present in BOTH.
const SANITY = ["KeyframesAnimation", "CSSKeyframesAnimation", "AnimationGroup"];
for (const name of SANITY) {
    if (!barrelDecls.has(name)) {
        failures.push(
            `parse — \`${name}\` not extracted from dist/keyframes.d.ts (the ` +
                "declaration extractor broke; fail-loud, not false-green).",
        );
    }
    if (!engineDecls.has(name)) {
        failures.push(
            `parse — \`${name}\` not extracted from dist/engine/index.d.ts (the ` +
                "declaration extractor broke; fail-loud, not false-green).",
        );
    }
}

const shared = [...barrelDecls.keys()].filter((n) => engineDecls.has(n)).sort();
console.log(
    `\ncomparing ${shared.length} symbol(s) declared by BOTH roll-ups ` +
        `(barrel ${barrelDecls.size} · engine ${engineDecls.size})`,
);

if (failures.length === 0 && shared.length < 3) {
    failures.push(
        `intersection — only ${shared.length} shared symbol(s); the roll-ups share ` +
            "the whole heavy class family, so a near-empty intersection means the " +
            "extractor is broken (fail-loud, not false-green).",
    );
}

let diverged = 0;
for (const name of shared) {
    const a = normalise(barrelDecls.get(name));
    const b = normalise(engineDecls.get(name));
    if (a !== b) {
        diverged++;
        // Show the first divergence point to make the drift actionable.
        let k = 0;
        while (k < a.length && k < b.length && a[k] === b[k]) k++;
        const ctx = (s) => s.slice(Math.max(0, k - 30), k + 40);
        failures.push(
            `divergence — \`${name}\` differs between the two roll-ups near char ${k}:\n` +
                `        barrel: …${ctx(a)}…\n` +
                `        engine: …${ctx(b)}…`,
        );
    }
}

// ─────────────────────────────────────────────────────────────────────────────

if (failures.length > 0) {
    console.error(
        `\nproof:dts-rollups-agree — FAIL (${failures.length} finding(s); ` +
            `${diverged} shared symbol(s) diverged):`,
    );
    for (const f of failures) console.error("  ✗ " + f);
    console.error(
        "\n  The two d.ts roll-ups (vite-plugin-dts's barrel + engineDtsRollupPlugin's\n" +
            "  subpath) rendered a SHARED symbol differently. A shared symbol must be\n" +
            "  byte-identical across both (modulo alias suffixes / reflow). Re-symmetrise\n" +
            "  the two pipelines' compiler options / trimming (S.B6 S3 / a29 F5).",
    );
    process.exit(1);
}

console.log(
    `\nproof:dts-rollups-agree — PASS: all ${shared.length} symbols declared by BOTH\n` +
        "roll-ups are byte-identical (modulo alias suffixes + reflow) — the two\n" +
        "independently-generated pipelines agree; the byte-identity is frozen.",
);
