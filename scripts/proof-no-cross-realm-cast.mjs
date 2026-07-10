#!/usr/bin/env node
/**
 * proof:no-cross-realm-cast — Q.WE2 S1 (the cross-realm-cast keystone gate).
 *
 * The single most INSIDIOUS workaround class is invisible to `tsc`: an
 * `as any` / `as unknown as <T>` / `as never` cast that bridges the value.js
 * NOMINAL realm — value.js and kf each bundle their OWN nominal `Color`,
 * `ValueUnit`, … (a cross-realm structural mismatch `tsc` cannot see, papered
 * over by a double-cast). P.W10 §S1 authored this gate; the impl drive never
 * landed it, and the witnesses MOVED: the S9 parse-that retire vanished the
 * `utils.ts` `as any` casts over `parseAny`, and the live cross-realm class is
 * now the `compile-color.ts` casts over value.js `Color` (`:59`, `:63`, `:99`).
 *
 * THE OBSERVABLE (not the literal text): an UN-REASONED cross-realm cast. The
 * genuine escape is a DECLARED reason — a `// @cross-realm: <why>` annotation on
 * (or trailing) the cast line — never a syntactic dodge. A cure that swaps
 * `as unknown as Color` for a laundered `as never` double-cast (the SAME
 * workaround obfuscated) STILL reds: the gate matches `as any` / `as unknown as`
 * / `as never` TOGETHER, keyed on the value.js realm. The annotation is a
 * reasoned exception (the genuinely-irreducible `Color`-realm seam — value.js
 * exposes no structural-clone/typed accessor on the densify path, K.W10), not a
 * silence.
 *
 * ── WHAT IS A CROSS-REALM CAST (the precise bite) ────────────────────────────
 * A cast is cross-realm iff it touches a value.js-IMPORTED identifier:
 *   (a) `… as unknown as <T>` / `… as <T>` where `<T>` is a value.js-imported
 *       type name (`Color`, `ValueUnit`, …) — the realm-bridge TARGET; OR
 *   (b) `<expr> as never` where `<expr>` is an ARGUMENT to a value.js-imported
 *       FUNCTION call (`normalizeColorUnit(vu as never)`, `color2({…} as never)`)
 *       — the realm-bridge SOURCE (an `as never` arg laundering kf's shape into
 *       value.js's nominal param).
 * A kf-INTERNAL cast (`this as unknown as KeyframesAnimation`, `flatVars as
 * unknown as Record<…>`) touches NO value.js-imported identifier → NOT
 * cross-realm → not gated. The light/heavy `as unknown as` over kf's own types
 * is idiomatic and stays.
 *
 * ── THE ESCAPE HATCH (a reasoned, declared exception) ────────────────────────
 * A cross-realm cast carrying a `// @cross-realm: <reason>` annotation — on the
 * SAME line (trailing) OR the line IMMEDIATELY ABOVE the cast — is allow-listed.
 * The `compile-color.ts` `Color` casts gain the annotation (the densify
 * realm-bridge is genuinely irreducible until value.js exposes a typed
 * accessor); they GREEN as DECLARED exceptions. A NEW bare `as unknown as Color`
 * over a value.js import reds.
 *
 * Static grep gate (no browser, no build), device-INDEPENDENT — a structural
 * source fact. Re-runnable: `node scripts/proof-no-cross-realm-cast.mjs`.
 * Wired into `proof:hygiene` (beside `proof:no-deprecated-guard`). CI posture:
 * HARD (a correctness/precept invariant).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ANIM = path.join(REPO, "src/animation");

const failures = [];

// ── Source collection ────────────────────────────────────────────────────────

/** Every `.ts` under `src/animation/**` (skip node_modules/.git/dist). */
function collectSources(dir, acc = []) {
    for (const name of fs.readdirSync(dir)) {
        if (name === "node_modules" || name === ".git" || name === "dist") {
            continue;
        }
        const full = path.join(dir, name);
        if (fs.statSync(full).isDirectory()) {
            collectSources(full, acc);
        } else if (name.endsWith(".ts")) {
            acc.push(full);
        }
    }
    return acc;
}

// ── Comment blanker (preserve newlines so line numbers stay truthful) ────────
//
// We detect casts over the COMMENT-BLANKED source (so a docstring NAMING
// `as unknown as Color` cannot red the gate), but read the `// @cross-realm:`
// annotation off the ORIGINAL source (the annotation IS a comment).
const blankComments = (s) => {
    let out = "";
    let i = 0;
    const n = s.length;
    while (i < n) {
        if (s[i] === "/" && s[i + 1] === "*") {
            const end = s.indexOf("*/", i + 2);
            const stop = end === -1 ? n : end + 2;
            for (let j = i; j < stop; j++) out += s[j] === "\n" ? "\n" : " ";
            i = stop;
            continue;
        }
        if (s[i] === "/" && s[i + 1] === "/") {
            while (i < n && s[i] !== "\n") {
                out += " ";
                i++;
            }
            continue;
        }
        out += s[i];
        i++;
    }
    return out;
};

// ── value.js import-name extraction (value + type imports) ───────────────────
//
// Collect every identifier imported from `@mkbabb/value.js` (or a subpath),
// across `import {…}`, `import type {…}`, and inline `{ type Foo, Bar }` — the
// realm-bridge surface. A cast keyed on one of these names is cross-realm.
function valueJsImportNames(src) {
    const names = new Set();
    const SPEC = String.raw`@mkbabb\/value\.js(?:\/[^"']*)?`;
    // The brace body matches a SINGLE import statement only: it may not contain
    // a nested `import`/`from`/`;` (those would mean the non-greedy span leapt
    // across statements to a DISTANT value.js `from`, falsely pulling in
    // unrelated kf-local names — the load-engine.ts false-positive class, where
    // a lone `import type { Stylesheet } from "@mkbabb/value.js"` sits far below
    // many `import … from "./engine"` blocks).
    const re = new RegExp(
        // `[^{}]` already matches `\n` — the old `(?:[^{}]|\n)*?` alternation
        // made every newline two-way ambiguous, i.e. CATASTROPHIC backtracking
        // on every failing multi-line import (the library-gate job hung >14min
        // on the CI runner's node 24; local node 26 crawled too, 2026-07-10).
        String.raw`import\s+(?:type\s+)?\{([^{}]*?)\}\s*from\s*["']${SPEC}["']`,
        "g",
    );
    for (const m of src.matchAll(re)) {
        const body = m[1];
        if (/\b(?:import|from)\b|;/.test(body)) continue; // not a single stmt
        for (const raw of body.split(",")) {
            const t = raw.trim().replace(/^type\s+/, "");
            if (!t) continue;
            // `Foo as Bar` imports the local name Bar.
            const local = t.split(/\s+as\s+/).pop().trim();
            if (/^[A-Za-z_$][\w$]*$/.test(local)) names.add(local);
        }
    }
    return names;
}

// ── The cross-realm cast detector ────────────────────────────────────────────
//
// Over the comment-blanked source, find every cast token and classify it
// cross-realm per (a)/(b) above, keyed on `vjsNames`. Returns
// [{ line, kind, text, name }] for each cross-realm cast.
function findCrossRealmCasts(blanked, vjsNames) {
    const hits = [];
    const lineOf = (idx) => blanked.slice(0, idx).split("\n").length;
    const nameAlt = [...vjsNames].map(escapeRe).join("|");
    if (!nameAlt) return hits;

    // (a) the DOUBLE-cast `… as unknown as <T>` / `… as any as <T>` where <T> is
    //     a value.js type — the realm-bridge TARGET. We match ONLY the
    //     tsc-DEFEATING double-cast (`as unknown as` / `as any as`), NOT a bare
    //     single `as <T>` narrow: a lone `Object.keys(R) as ColorSpace[]` /
    //     `existing[i] as ValueUnit<number>` is a legal overlapping-type narrow
    //     tsc CHECKS — not the invisible cross-realm class. The insidious class
    //     is the `unknown`/`any` launder that erases tsc's view entirely.
    const targetRe = new RegExp(
        String.raw`\bas\s+(?:unknown|any)\s+as\s+(${nameAlt})\b`,
        "g",
    );
    for (const m of blanked.matchAll(targetRe)) {
        // A nullish-placeholder write — `undefined as unknown as ValueUnit[]`
        // (the V8 stable-key null-fill, F.W4) — carries NO value.js instance
        // across the realm; it types a deliberate `undefined`/`null` slot. Not
        // the insidious realm-bridge class (a real `Color`/`ValueUnit` crossing
        // the nominal seam), so it is out of scope.
        const before = blanked.slice(Math.max(0, m.index - 12), m.index);
        if (/\b(?:undefined|null)\s*$/.test(before)) continue;
        hits.push({
            line: lineOf(m.index),
            kind: "target-type",
            name: m[1],
            text: m[0],
        });
    }

    // (b) `<expr> as never` / `<expr> as any` ARGUMENT to a value.js-imported
    //     function call — the realm-bridge SOURCE (an `as never`/`as any` arg
    //     laundering kf's shape into value.js's nominal param,
    //     `normalizeColorUnit(vu as never)`, `color2({…} as never)`). `as never`
    //     and `as any` both DEFEAT tsc's param check; a bare single `as <T>`
    //     arg does not (tsc still checks it), so it is out of scope.
    const callRe = new RegExp(String.raw`\b(${nameAlt})\s*\(`, "g");
    for (const m of blanked.matchAll(callRe)) {
        const open = m.index + m[0].length - 1; // index of '('
        const span = balancedSpan(blanked, open);
        if (span === -1) continue;
        const argText = blanked.slice(open + 1, span);
        const launder = /\bas\s+(never|any)\b/g;
        let nm;
        while ((nm = launder.exec(argText)) !== null) {
            hits.push({
                line: lineOf(open + 1 + nm.index),
                kind: `as-${nm[1]}-arg`,
                name: m[1],
                text: `${m[1]}(… as ${nm[1]} …)`,
            });
        }
    }

    return hits;
}

/** Index of the matching close-paren for the `(` at `open`, or -1. */
function balancedSpan(s, open) {
    let depth = 0;
    for (let i = open; i < s.length; i++) {
        if (s[i] === "(") depth++;
        else if (s[i] === ")") {
            depth--;
            if (depth === 0) return i;
        }
    }
    return -1;
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ── The annotation check (read off the ORIGINAL source) ──────────────────────
//
// A cross-realm cast at line `L` is ALLOW-LISTED iff the original source carries
// a `// @cross-realm:` annotation on line `L` (trailing) OR anywhere in the
// CONTIGUOUS comment/expression window directly above it — so a single
// annotation at the head of a MULTI-LINE value.js call (`color2({…} as never,
// …) as unknown as Color` spans several lines) covers every cast in that
// statement. The upward scan stops at the first BLANK line or statement
// terminator (`;`/`{`/`}` ending a line that is NOT a comment), so the
// annotation cannot leak across unrelated statements — it must sit in the
// SAME contiguous expression/comment block as the cast.
function isAnnotated(origLines, line) {
    const ANN = /\/\/\s*@cross-realm:/;
    if (ANN.test(origLines[line - 1] ?? "")) return true; // trailing/same line
    for (let i = line - 2; i >= 0; i--) {
        const txt = origLines[i] ?? "";
        if (ANN.test(txt)) return true;
        const trimmed = txt.trim();
        if (trimmed === "") break; // blank line — out of the block
        // A line ENDING a PRIOR statement (a `;` terminator) that is not itself
        // a comment terminates the upward block — the annotation must sit inside
        // THIS statement's contiguous lines, never borrowed from a statement
        // above. Object-literal `{`/`}` (a multi-line value.js call argument)
        // are WITHIN the expression, not a terminator, so only `;` breaks.
        if (!trimmed.startsWith("//") && /;\s*$/.test(trimmed)) break;
    }
    return false;
}

// ── Run ──────────────────────────────────────────────────────────────────────

console.log(
    "proof:no-cross-realm-cast — Q.WE2 S1 (the un-reasoned cross-realm cast keystone)\n",
);

let totalCasts = 0;
let annotated = 0;
const unannotated = [];

for (const file of collectSources(ANIM)) {
    const src = fs.readFileSync(file, "utf8");
    const vjsNames = valueJsImportNames(src);
    if (vjsNames.size === 0) continue;

    const blanked = blankComments(src);
    const origLines = src.split("\n");
    const casts = findCrossRealmCasts(blanked, vjsNames);

    for (const c of casts) {
        totalCasts++;
        if (isAnnotated(origLines, c.line)) {
            annotated++;
        } else {
            unannotated.push({
                file: path.relative(REPO, file),
                ...c,
            });
        }
    }
}

console.log(
    `  scanned src/animation/** — ${totalCasts} cross-realm cast(s): ` +
        `${annotated} annotated (// @cross-realm:), ${unannotated.length} un-annotated`,
);

if (unannotated.length > 0) {
    for (const u of unannotated) {
        failures.push(
            `${u.file}:${u.line} — un-reasoned cross-realm cast \`${u.text}\` ` +
                `(${u.kind}, over value.js \`${u.name}\`). Bridging the value.js ` +
                `nominal realm with an \`as\`-cast is invisible to tsc; declare the ` +
                `reason with a \`// @cross-realm: <why>\` annotation (the genuinely-` +
                `irreducible Color-realm seam) or remove the cast.`,
        );
    }
}

if (failures.length > 0) {
    console.error(
        `\nproof:no-cross-realm-cast — FAIL (${failures.length}): an un-reasoned ` +
            `cross-realm cast over a value.js import sits in src/animation/**:`,
    );
    for (const f of failures) console.error("  ✗ " + f);
    process.exit(1);
}

console.log(
    "\nproof:no-cross-realm-cast — PASS: every cross-realm cast over a value.js " +
        "import carries a `// @cross-realm:` reason (zero un-annotated violators).",
);
