#!/usr/bin/env node
/**
 * proof:no-foreign-symbol-stamp — the realm-cleanliness keystone (P.W11 §S1 /
 * O.W16 §S3).
 *
 * The constellation spine is acyclic and realm-CLEAN: kf consumes value.js's
 * published classes (`ValueUnit`, `Color`, `FunctionValue`, …) but never WRITES
 * state onto their instances. Stamping a kf-owned Symbol or property onto a
 * published value.js `ValueUnit` (the retired S8 `Symbol("kf.fnName")`
 * sidechannel) is the canonical "owned-Symbol-on-external-class" anti-pattern:
 * the annotation is invisible to value.js, invisible to any value.js
 * maintainer, and crosses the realm boundary as object state on a foreign
 * instance (the `inv-L-acyclic-purity` breach). The cure is a kf-MODULE-LOCAL
 * `WeakMap<ValueUnit, …>` — the `ValueUnit` is a KEY, never mutated, so the
 * realm stays clean (the leaf carries ZERO kf-owned own-properties).
 *
 * THE GATE bites the SHAPE, not the literal string `kf.fnName`:
 *
 *   (A) a `Symbol(…)` whose handle is later used as a COMPUTED-KEY property on a
 *       value.js-imported type — `(u as NamedValueUnit)[FN_NAME] = …` or a
 *       `type Named = ValueUnit & { [SYM]?: … }` intersection that annotates a
 *       foreign class. A cure that merely RENAMES the Symbol
 *       (`Symbol("kf.origin")`) or moves the `const` to another module STILL
 *       reds — the match is the foreign-object-annotation PATTERN.
 *   (B) a string/Symbol-keyed WRITE onto a value-cast of a value.js instance —
 *       `(u as any).__fnName = name`, `(u as ValueUnit & {…})[k] = …` — the
 *       same foreign-object-mutation by a different carrier. The genuine green
 *       requires NO kf-owned property written onto a foreign value.js instance.
 *
 * Born-RED on the pre-cure tree (`utils.ts:45-64` stamps `Symbol("kf.fnName")`
 * onto `ValueUnit`); GREEN once the provenance lives on a `WeakMap` keying the
 * leaf. This certifies the REALM-CLEANLINESS the WeakMap delivers — distinct
 * from `proof:workaround-deletion` S8 (which gates the VJ-L1 tripwire retirement
 * and STAYS PENDING after the WeakMap swap). STATIC, device-independent, HARD.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { declarePosture } from "./lib/ci-env.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ANIM = join(root, "src/animation");

const { miss } = declarePosture("hard");

// ── Collect the kf source tree (the whole library surface) ──────────────────

function collectSources(dir, acc = []) {
    for (const name of readdirSync(dir)) {
        if (name === "node_modules" || name === ".git" || name === "dist") {
            continue;
        }
        const full = join(dir, name);
        if (statSync(full).isDirectory()) {
            collectSources(full, acc);
        } else if (name.endsWith(".ts")) {
            acc.push(full);
        }
    }
    return acc;
}

// ── The value.js classes whose instances kf imports but does NOT own ─────────
//
// Stamping a kf-property onto an instance of ANY of these is the breach. The
// list is the published value.js instance surface kf flattens / interpolates.
const FOREIGN_CLASSES = ["ValueUnit", "ValueArray", "FunctionValue", "Color"];
const FOREIGN_ALT = FOREIGN_CLASSES.join("|");

/**
 * Strip block + line comments so a doc comment NAMING the retired Symbol (e.g.
 * "the former `Symbol(...)` sidechannel") is not read as a live stamp.
 */
function stripComments(src) {
    return src
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/(?:^|\n)\s*\/\/[^\n]*/g, "");
}

/**
 * Collect every kf TYPE-ALIAS name that intersects a foreign value.js class —
 * `type NamedValueUnit = ValueUnit & {…}`. A WRITE through such an alias
 * (`(u as NamedValueUnit)[K] = …`) is the same foreign-object mutation as a
 * direct `(u as ValueUnit & {…})[K] = …`, so the (A2) cast-write clause must
 * recognize the alias too — otherwise a cure that hides the foreign class
 * behind an alias evades the write detector.
 */
function foreignAliasNames(code) {
    const names = [];
    const aliasDecl = new RegExp(
        String.raw`\btype\s+([A-Za-z0-9_$]+)\s*=\s*[^;]*\b(?:${FOREIGN_ALT})\s*&`,
        "g",
    );
    for (const m of code.matchAll(aliasDecl)) names.push(m[1]);
    return names;
}

/**
 * The breach detectors. Each returns the offending line excerpts (post-comment-
 * strip) — a non-empty result reds the gate.
 */
function findForeignStamps(src) {
    const code = stripComments(src);
    const hits = [];

    // (A1) A type intersection annotating a foreign value.js class with a
    //      computed-key property: `type X = ValueUnit & { [SYM]?: … }` or
    //      `ValueUnit & { __foo?: … }`. This is the foreign-object-annotation
    //      TYPE the cure deletes (the `NamedValueUnit` shape). Catches a RENAMED
    //      Symbol/alias too — the match is the SHAPE, not `kf.fnName`.
    const intersectAnnot = new RegExp(
        String.raw`\b(?:${FOREIGN_ALT})\s*&\s*\{[^}]*(?:\[[^\]]+\]|__[A-Za-z0-9_$]+)\s*[?:]`,
        "g",
    );
    for (const m of code.matchAll(intersectAnnot)) {
        hits.push(`foreign-class annotation: ${oneLine(m[0])}`);
    }

    // (A2) A WRITE of a computed-key (a Symbol handle) OR a kf-owned property
    //      onto a value.js instance reached through a cast. The cast target may
    //      be a foreign class directly, a kf alias of one (A2a), OR an `as
    //      any`/`as unknown` escape-hatch followed by a `__`-prefixed property
    //      write (A2b — the string-keyed `(u as any).__fnName = …` variant the
    //      proxy-trap guard names). Both are the same foreign-object mutation.
    const aliases = foreignAliasNames(code);
    const castTargets = [...FOREIGN_CLASSES, ...aliases].join("|");

    // (A2a) cast mentions a foreign class / kf alias, then assigns a property:
    //       `(u as NamedValueUnit)[FN_NAME] = …` / `(u as ValueUnit & {…}).p = …`
    const foreignCastWrite = new RegExp(
        String.raw`\(\s*[A-Za-z0-9_$.]+\s+as\s+[^)]*\b(?:${castTargets})\b[^)]*\)\s*(?:\[[^\]]+\]|\.[A-Za-z_$][A-Za-z0-9_$]*)\s*=[^=]`,
        "g",
    );
    for (const m of code.matchAll(foreignCastWrite)) {
        hits.push(`foreign-instance write: ${oneLine(m[0])}`);
    }

    // (A2b) the `as any`/`as unknown` escape-hatch followed by a kf-owned
    //       `__`-prefixed property WRITE — the type-erased foreign-object
    //       mutation (`(u as any).__fnName = name`).
    const anyCastWrite = new RegExp(
        String.raw`\(\s*[A-Za-z0-9_$.]+\s+as\s+(?:any|unknown)\s*\)\s*\.__[A-Za-z0-9_$]+\s*=[^=]`,
        "g",
    );
    for (const m of code.matchAll(anyCastWrite)) {
        hits.push(`escape-hatch foreign write: ${oneLine(m[0])}`);
    }

    return hits;
}

function oneLine(s) {
    return s.replace(/\s+/g, " ").trim();
}

// ── Run ──────────────────────────────────────────────────────────────────────

console.log(
    "proof:no-foreign-symbol-stamp — the realm-cleanliness keystone " +
        "(P.W11 S1 / O.W16 S3)\n",
);

const offenders = [];
for (const file of collectSources(ANIM)) {
    const src = readFileSync(file, "utf8");
    const hits = findForeignStamps(src);
    if (hits.length > 0) {
        offenders.push({ file: relative(root, file), hits });
    }
}

if (offenders.length > 0) {
    console.error(
        "proof:no-foreign-symbol-stamp — FAIL: a kf-owned property/Symbol is " +
            "stamped onto a published value.js instance (the foreign-object-" +
            "annotation breach; inv-L-acyclic-purity). Move the provenance to a " +
            "kf-internal `WeakMap` keyed by the instance (the instance a KEY, " +
            "never mutated):",
    );
    for (const { file, hits } of offenders) {
        console.error(`  ✗ ${file}`);
        for (const h of hits) console.error(`      ${h}`);
    }
    miss("no-foreign-symbol-stamp");
    process.exit(1);
}

console.log(
    "  ✓ zero kf-owned stamp on any imported value.js instance across " +
        "src/animation/**.",
);
console.log(
    "\nproof:no-foreign-symbol-stamp — PASS: the realm is clean. value.js " +
        "instances carry no kf-owned own-property; any flatten-origin provenance " +
        "lives on a kf-internal WeakMap (the instance a key, never mutated).",
);
process.exit(0);
