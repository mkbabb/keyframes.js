#!/usr/bin/env node
/**
 * proof:ingest-replay — K.W8 (the round-trip pointed FORWARD at the live web):
 * the REPLAY-EQUALITY invariant, forward direction. kf reads the live web's OWN
 * CSS (`fromStyleSheets`/`fromLiveAnimations` walk the CSSOM), takes over a
 * RUNNING CSS animation mid-flight (`adoptRunning`), and every step it cannot
 * complete faithfully (a cross-origin sheet, a malformed rule) becomes a citable
 * `ParseDiagnostic` row — never a silent drop.
 *
 * BORN-RED WITNESS (the FRONTIER sense): on the pre-cure tree NO CSSOM-walk
 * surface exists — `grep -rn "styleSheets|getAnimations|cssRules|fromStyleSheets|
 * fromLiveAnimations|adoptRunning" src/` returned ZERO hits. There is no
 * `fromStyleSheets` to call, so every replay-equality clause reds by
 * construction (the capability is ABSENT). This gate greens only once the ingest
 * surface ships AND the reconstructed object replays equal to its source.
 *
 * CLAUSES (each BITES — the source-shape locks; the VALUE proof rides the
 * `vitest run test/ingest.test.ts` step wired beside this in package.json):
 *
 *   module-exists  — `src/animation/ingest.ts` exists and exports the K1/K2
 *       surface (`fromStyleSheets`, `fromLiveAnimations`, `resolveLiveKeyframes`,
 *       `adoptRunning`). BITE: delete the module / an export → the surface is
 *       absent (the born-RED root) → the value test cannot import → reds.
 *
 *   reuses-resolve — the ingest REUSES the existing parse pipeline WHOLE: it
 *       feeds `rule.cssText` into `CSSKeyframesAnimation.fromString` (which calls
 *       `resolveKeyframes`), NOT a re-derived lossy emitter. BITE: re-author a
 *       parser inside ingest.ts → the round-trip's faithfulness is forfeit (the
 *       moat-loss the mandate forbids) → this clause reds.
 *
 *   cssom-walk     — the walk reads `styleSheets`/`cssRules` and filters
 *       `@keyframes` rules (`CSSKeyframesRule`/type 7). BITE: drop the walk → the
 *       capability is gone → reds.
 *
 *   cors-honest    — the per-sheet `try/catch` emits a `CORS_SKIP` diagnostic
 *       (never a silent drop, never an uncaught throw). BITE: drop the catch / the
 *       row → a cross-origin sheet is silently dropped (the forbidden class) → reds.
 *
 *   adopt-runtime  — `adoptRunning` reads `getAnimations()` for the playhead,
 *       reconstructs from the CSSOM RULE (via `resolveLiveKeyframes`, NOT
 *       `getKeyframes()`), and seeds at the captured `currentTime` (the
 *       continuity seed, NOT seed-at-zero). BITE: seed at zero → the flash returns
 *       → the value test reds.
 *
 *   adopt-distinct — the new method is `adoptRunning`, NOT `adopt()` — it does
 *       NOT collide with the shipped `engine.ts adoptCompiled` (HARDENING-5
 *       HAZARD-1). BITE: rename to `adopt()` / touch `adoptCompiled` → reds.
 *
 *   barrel-heavy   — the ingest runtime rides `loadAnimationEngine()` (the HEAVY
 *       dynamic boundary), NOT the LIGHT static barrel — only its TYPES are
 *       re-exported statically (erased). BITE: add a static runtime export to the
 *       barrel → proof:boundary would red; this clause guards the wiring shape.
 *
 *   test-locks     — `test/ingest.test.ts` carries the per-clause born-RED
 *       replay-equality asserts. BITE: delete a lock → reds.
 *
 * Mirrors proof:diagnostics-channel / proof:roundtrip-fidelity: exits 1 on any
 * residual. The replay-equality VALUE proof is the vitest step; this script is
 * the source-shape lock that keeps the surface from drifting.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

/**
 * Strip line + block comments so a NO-WORKAROUND scan reads CODE, not the
 * prose that NAMES the forbidden pattern (e.g. "reconstructs from the CSSOM
 * rule, NOT `getAnimations().getKeyframes()`"). A faithful spec documents the
 * anti-pattern; the scan must not red on the documentation of it.
 */
const stripComments = (src) =>
    src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/[^\n]*/g, "$1 ");

const requireAll = (clause, file, anchors) => {
    if (!existsSync(join(root, file))) {
        fail(clause, `${file} does not exist — the ingest surface is ABSENT.`);
        return;
    }
    const src = read(file);
    const missing = anchors.filter(({ re }) => !re.test(src));
    if (missing.length > 0) {
        fail(
            clause,
            `${file} is missing: ` +
                missing.map((m) => m.name).join("; ") +
                ` — the ${clause} contract is no longer locked.`,
        );
    } else {
        ok(clause, `${file} locks ${anchors.length} ${clause} anchor(s)`);
    }
};

console.log(
    "proof:ingest-replay — K.W8 (the round-trip pointed FORWARD at the live web)",
);

const INGEST = "src/animation/ingest.ts";
const INDEX = "src/animation/index.ts";
const ENGINE = "src/animation/engine.ts";
const TEST = "test/ingest.test.ts";

// ── module-exists — the K1/K2 surface ─────────────────────────────────────────
requireAll("module-exists", INGEST, [
    {
        name: "export fromStyleSheets",
        re: /export\s+const\s+fromStyleSheets\b/,
    },
    {
        name: "export fromLiveAnimations",
        re: /export\s+const\s+fromLiveAnimations\b/,
    },
    {
        name: "export resolveLiveKeyframes",
        re: /export\s+const\s+resolveLiveKeyframes\b/,
    },
    { name: "export adoptRunning", re: /export\s+const\s+adoptRunning\b/ },
]);

// ── reuses-resolve — the parse pipeline is REUSED WHOLE (no re-derivation) ─────
requireAll("reuses-resolve", INGEST, [
    {
        name: "feeds rule.cssText into CSSKeyframesAnimation.fromString",
        re: /\.fromString\(/,
    },
    {
        name: "imports CSSKeyframesAnimation from ./engine (the reused engine)",
        re: /import\s*\{[\s\S]*?CSSKeyframesAnimation[\s\S]*?\}\s*from\s*["']\.\/engine["']/,
    },
    {
        name: "reads rule.cssText (the CSSOM serialize the engine already eats)",
        re: /\.cssText\b/,
    },
]);
{
    // NO-WORKAROUND: the ingest must NOT re-author a parser. A direct
    // `parseCSSStylesheet`/`parseCSSValueUnit` call inside ingest.ts would be a
    // re-derivation that forfeits the round-trip — the bridge is `fromString`
    // (which owns `resolveKeyframes`), never a parallel parse.
    if (existsSync(join(root, INGEST))) {
        const src = stripComments(read(INGEST));
        if (/parseCSSStylesheet\s*\(|parseCSSValueUnit\s*\(/.test(src)) {
            fail(
                "reuses-resolve",
                `${INGEST} calls a value.js parser directly — the ingest must REUSE the engine's fromString→resolveKeyframes pipeline WHOLE, never re-derive (the moat-loss the mandate forbids).`,
            );
        } else {
            ok(
                "reuses-resolve",
                "no direct value.js parser call in ingest.ts (the pipeline is reused via fromString, not re-derived)",
            );
        }
    }
}

// ── cssom-walk — reads styleSheets/cssRules + filters @keyframes ──────────────
requireAll("cssom-walk", INGEST, [
    { name: "reads .cssRules (the CSSOM walk)", re: /\.cssRules\b/ },
    {
        name: "filters CSSKeyframesRule (instanceof or type 7)",
        re: /CSSKeyframesRule|KEYFRAMES_RULE|===\s*7\b/,
    },
    { name: "walks styleSheets", re: /styleSheets\b/ },
]);

// ── cors-honest — per-sheet try/catch → CORS_SKIP, never a silent drop ────────
requireAll("cors-honest", INGEST, [
    {
        name: "a CORS_SKIP diagnostic row is emitted",
        re: /["']CORS_SKIP["']/,
    },
    {
        name: "the cssRules read is guarded by try/catch",
        re: /try\s*\{[\s\S]*?\.cssRules[\s\S]*?\}\s*catch/,
    },
]);

// ── adopt-runtime — getAnimations playhead + CSSOM-rule reconstruction + seed ─
requireAll("adopt-runtime", INGEST, [
    {
        name: "adoptRunning reads getAnimations() for the playhead",
        re: /getAnimations\(\)/,
    },
    {
        name: "reconstructs from the CSSOM rule via resolveLiveKeyframes (NOT getKeyframes)",
        re: /resolveLiveKeyframes\s*</,
    },
    {
        name: "reads the captured currentTime (the continuity seed)",
        re: /currentTime\b/,
    },
    {
        name: "the commit-on-ADOPT paints the current frame inline (interpFrames)",
        re: /interpFrames\(/,
    },
]);
{
    // NO-WORKAROUND: K2 must NOT read the keyframe SOURCE from getAnimations() —
    // the computed getKeyframes() form has lost var()/cqw/oklab. A getKeyframes()
    // call as the KEYFRAME source is the moat-loss; reconstruction rides the
    // CSSOM rule (resolveLiveKeyframes). getAnimations() is the playhead only.
    if (existsSync(join(root, INGEST))) {
        const src = stripComments(read(INGEST));
        if (/\.getKeyframes\s*\(/.test(src)) {
            fail(
                "adopt-runtime",
                `${INGEST} calls getKeyframes() — K2 must reconstruct from the CSSOM @keyframes RULE (the authored form), never the computed keyframe list (which has lost var()/cqw/oklab).`,
            );
        } else {
            ok(
                "adopt-runtime",
                "no getKeyframes() keyframe-source read (reconstruction rides the CSSOM rule; getAnimations() is the playhead only)",
            );
        }
    }
}

// ── adopt-distinct — adoptRunning, NOT adopt(); adoptCompiled untouched ───────
{
    if (existsSync(join(root, INGEST))) {
        const src = stripComments(read(INGEST));
        // The method is named `adoptRunning` (the HAZARD-1 distinct name).
        const hasRunning = /\badoptRunning\b/.test(src);
        // It does NOT define/export a bare `adopt` that would conflate with the
        // shipped engine.ts adoptCompiled.
        const definesBareAdopt =
            /export\s+const\s+adopt\b(?!Running|Compiled)/.test(src);
        if (!hasRunning || definesBareAdopt) {
            fail(
                "adopt-distinct",
                `${INGEST}: adoptRunning present=${hasRunning}, bare adopt export=${definesBareAdopt} — the takeover MUST be named adoptRunning to disambiguate from engine.ts adoptCompiled (HARDENING-5 HAZARD-1).`,
            );
        } else {
            ok(
                "adopt-distinct",
                "the takeover is named adoptRunning (distinct from the shipped adoptCompiled)",
            );
        }
    }
    // engine.ts adoptCompiled is UNTOUCHED by this wave (the naming contract, not
    // a co-edit) — assert it still exists.
    requireAll("adopt-distinct", ENGINE, [
        {
            name: "engine.ts adoptCompiled is untouched (still present)",
            re: /adoptCompiled\(/,
        },
    ]);
}

// ── barrel-heavy — the ingest runtime rides loadAnimationEngine, types erased ─
requireAll("barrel-heavy", INDEX, [
    {
        name: "the ingest module is dynamically imported in loadAnimationEngine",
        re: /import\(["']\.\/ingest["']\)/,
    },
    {
        name: "fromStyleSheets is merged onto the heavy engine surface",
        re: /fromStyleSheets:\s*ingestMod\.fromStyleSheets/,
    },
    {
        name: "adoptRunning is merged onto the heavy engine surface",
        re: /adoptRunning:\s*ingestMod\.adoptRunning/,
    },
    {
        name: "the ingest TYPES are re-exported (erased — no static value.js edge)",
        re: /export\s+type\s*\{[\s\S]*?IngestResult[\s\S]*?\}\s*from\s*["']\.\/ingest["']/,
    },
]);
{
    // The ingest must NOT have a STATIC runtime export on the barrel (that would
    // pull value.js into the LIGHT graph — proof:boundary would red). Only the
    // dynamic merge + the erased types are allowed.
    if (existsSync(join(root, INDEX))) {
        const src = stripComments(read(INDEX));
        const staticRuntime =
            /export\s*\{\s*(?:fromStyleSheets|fromLiveAnimations|resolveLiveKeyframes|adoptRunning)\b[^}]*\}\s*from\s*["']\.\/ingest["']/.test(
                src,
            );
        if (staticRuntime) {
            fail(
                "barrel-heavy",
                `${INDEX} statically re-exports an ingest RUNTIME value — the ingest is HEAVY (value.js-bearing) and must ride loadAnimationEngine(), never the LIGHT static barrel (proof:boundary).`,
            );
        } else {
            ok(
                "barrel-heavy",
                "no static ingest runtime export on the barrel (the HEAVY surface rides loadAnimationEngine; only types are erased-exported)",
            );
        }
    }
}

// ── test-locks — the per-clause born-RED replay-equality asserts ──────────────
requireAll("test-locks", TEST, [
    {
        name: "clause (a) replay-equality: the kf sample equals the source interp",
        re: /SAMPLES equal to the source linear interp/,
    },
    {
        name: "clause (b) byte-faithful: re-serialise to a template-equivalent",
        re: /re-serialises to a template-equivalent/,
    },
    {
        name: "clause (c) flash-free: seeds at the captured currentTime, NOT zero",
        re: /seeds at the captured currentTime, NOT at zero/,
    },
    {
        name: "clause (d) CORS skip is a CORS_SKIP diagnostic row",
        re: /toContain\(["']CORS_SKIP["']\)|d\.code\s*===\s*["']CORS_SKIP["']/,
    },
]);

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:ingest-replay — FAIL: the forward-direction replay-equality\n" +
            "surface is not fully wired:\n" +
            failures.join("\n") +
            "\n\n  K.W8 ships `src/animation/ingest.ts` (the CSSOM walk + adoptRunning),\n" +
            "  reuses `resolveKeyframes` WHOLE (never a re-derived emitter), reports a\n" +
            "  cross-origin sheet as a CORS_SKIP diagnostic (never a silent drop),\n" +
            "  seeds adoptRunning at the captured currentTime (never seed-at-zero), and\n" +
            "  rides loadAnimationEngine (HEAVY, never the LIGHT barrel). Restore the\n" +
            "  clause each anchor names. The replay-equality VALUE proof rides\n" +
            "  `vitest run test/ingest.test.ts`.",
    );
    process.exit(1);
}
console.log(
    "proof:ingest-replay — PASS: the ingest surface (fromStyleSheets /\n" +
        "fromLiveAnimations / resolveLiveKeyframes / adoptRunning) walks the CSSOM,\n" +
        "reuses the engine's fromString→resolveKeyframes pipeline WHOLE, reports\n" +
        "every cross-origin skip as a CORS_SKIP diagnostic, seeds the takeover at\n" +
        "the captured currentTime (the continuity seed), and rides\n" +
        "loadAnimationEngine (HEAVY). The replay-equality VALUE proof rides\n" +
        "`vitest run test/ingest.test.ts`.",
);
