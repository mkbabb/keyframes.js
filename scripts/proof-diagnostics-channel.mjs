#!/usr/bin/env node
/**
 * proof:diagnostics-channel — K.W7 S4: the `ResolvedKeyframes.diagnostics`
 * channel CONSUMES the value.js 0.12.0 `ParseDiagnostic`/`OnParseError`
 * producer (N2 row 10), and every SILENT fallback site is mirrored by a
 * stable-coded diagnostic row — the honesty surface (never a kf-local
 * re-author, never a logging framework: a FLAT additive field with stable
 * codes, KISS).
 *
 * BORN-RED WITNESS: on the pre-cure tree `ResolvedKeyframes` carries NO
 * `diagnostics` field (`grep "diagnostics" adapter.ts` = ZERO) — the
 * channel-population assert reds because the field is absent.
 *
 * CLAUSES (each BITES):
 *
 *   field-exists   — `ResolvedKeyframes` carries a `diagnostics: Diagnostic[]`
 *       field. BITE: remove it → the channel is absent (the born-RED root) →
 *       the value test reds.
 *
 *   consume-types  — the channel CONSUMES the value.js `ParseDiagnostic` /
 *       `OnParseError` producer (imported `type`), NOT a kf-local re-author.
 *       BITE: drop the value.js import + re-author the shape → inv-16 breach →
 *       this clause reds.
 *
 *   empty-parse    — a non-empty input that parses to zero @keyframes rules
 *       emits an `EMPTY_PARSE` row. BITE: drop the EMPTY_PARSE emit → the silent
 *       empty parse returns → the value test reds.
 *
 *   codes          — the stable code SET is present (EMPTY_PARSE,
 *       UNKNOWN_TIMING_FN, COMPOSITION_FALLBACK, PARSE_ERROR). BITE: rename a
 *       code → a consumer branching on it breaks → reds.
 *
 *   surfaced       — engine.ts surfaces `resolved.diagnostics` on the animation
 *       (the consumer-queryable channel). BITE: drop the surface → the rows are
 *       computed then dropped (the dead-field anti-pattern) → the value test reds.
 *
 *   test-locks     — `test/diagnostics-channel.test.ts` carries the per-code
 *       born-RED clauses. BITE: delete a lock → reds.
 *
 * Mirrors proof:blend / proof:composition-honored: exits 1 on any residual.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

const requireAll = (clause, file, anchors) => {
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
    "proof:diagnostics-channel — K.W7 S4 (the consumed structured diagnostics)",
);

const ADAPTER = "src/animation/adapter.ts";
const ENGINE = "src/animation/engine/animation.ts";
// K.WZ — the COMPOSITION_FALLBACK engine row is PUSHED from the extracted
// `engine-composition.ts` (the K.W7 leaf logic lifted off the engine god-object
// for the engine.ts<1400 ceiling split). It still joins the SAME channel: the
// helper pushes onto `runtime.diagnostics`, which IS the engine's
// `this.diagnostics` (passed by reference). The push anchor follows the code.
const COMPOSITION = "src/animation/engine/composition.ts";
// R.W2 — `fromString` (the `resolved.diagnostics` surfacer) lives in the carved
// `engine/css/css-animation.ts` CSS subclass.
const CSS_ANIMATION = "src/animation/engine/css/css-animation.ts";
const TEST = "test/diagnostics-channel.test.ts";

// ── field-exists — ResolvedKeyframes carries diagnostics: Diagnostic[] ────────
requireAll("field-exists", ADAPTER, [
    {
        name: "ResolvedKeyframes.diagnostics field",
        re: /diagnostics:\s*Diagnostic\[\]/,
    },
    {
        name: "the resolveKeyframes return carries `diagnostics`",
        re: /return\s*\{[\s\S]*?diagnostics[\s\S]*?\}/,
    },
]);

// ── consume-types — the value.js ParseDiagnostic/OnParseError producer ────────
{
    const src = read(ADAPTER);
    const imported =
        /import\s*\{[\s\S]*?(?:OnParseError|ParseDiagnostic)[\s\S]*?\}\s*from\s*["']@mkbabb\/value\.js["']/.test(
            src,
        );
    const extendsProducer =
        /interface\s+Diagnostic\s+extends\s+Partial<ParseDiagnostic>/.test(src);
    if (!imported || !extendsProducer) {
        fail(
            "consume-types",
            `${ADAPTER}: ParseDiagnostic/OnParseError imported=${imported}, Diagnostic extends the producer=${extendsProducer} — the channel must CONSUME the value.js producer (N2 row 10), not re-author a kf-local shape (inv-16 published-only consumption).`,
        );
    } else {
        ok(
            "consume-types",
            `the channel CONSUMES the value.js ParseDiagnostic/OnParseError producer (Diagnostic extends Partial<ParseDiagnostic>)`,
        );
    }
}

// ── empty-parse — a zero-keyframe non-empty input emits EMPTY_PARSE ───────────
requireAll("empty-parse", ADAPTER, [
    {
        name: "the EMPTY_PARSE row is emitted on a zero-keyframe non-empty input",
        re: /sink\(\s*["']EMPTY_PARSE["']/,
    },
    {
        name: "the emit is guarded by rules.length === 0 && input.trim()",
        re: /rules\.length\s*===\s*0\s*&&\s*input\.trim\(\)/,
    },
]);

// ── codes — the stable code SET is present ────────────────────────────────────
requireAll("codes", ADAPTER, [
    { name: "EMPTY_PARSE", re: /["']EMPTY_PARSE["']/ },
    { name: "UNKNOWN_TIMING_FN", re: /["']UNKNOWN_TIMING_FN["']/ },
    { name: "COMPOSITION_FALLBACK", re: /["']COMPOSITION_FALLBACK["']/ },
    { name: "PARSE_ERROR", re: /["']PARSE_ERROR["']/ },
]);

// ── surfaced — engine surfaces resolved.diagnostics on the animation ──────────
requireAll("surfaced", CSS_ANIMATION, [
    {
        name: "fromString surfaces resolved.diagnostics on the animation",
        re: /this\.diagnostics\s*=\s*\[\s*\.\.\.\s*resolved\.diagnostics\s*\]/,
    },
]);
// The COMPOSITION_FALLBACK engine row joins the SAME channel from the extracted
// honoring helper — `runtime.diagnostics` is the engine's `this.diagnostics`.
requireAll("surfaced", COMPOSITION, [
    {
        name: "the COMPOSITION_FALLBACK engine row joins the same channel (runtime.diagnostics)",
        re: /runtime\.diagnostics\.push\(/,
    },
]);

// ── test-locks — the per-code born-RED clauses ────────────────────────────────
requireAll("test-locks", TEST, [
    {
        name: "the channel field is present (born-RED: absent pre-cure)",
        re: /Array\.isArray\(r\.diagnostics\)\)\.toBe\(true\)/,
    },
    {
        name: "EMPTY_PARSE has a born-RED test",
        re: /toContain\(["']EMPTY_PARSE["']\)/,
    },
    {
        name: "COMPOSITION_FALLBACK has a born-RED test",
        re: /toContain\(["']COMPOSITION_FALLBACK["']\)/,
    },
    {
        name: "UNKNOWN_TIMING_FN (the J.W1-landed code) has a test",
        re: /toBe\(["']UNKNOWN_TIMING_FN["']\)/,
    },
]);

console.log("");
if (failures.length > 0) {
    console.error(
        "proof:diagnostics-channel — FAIL: the structured diagnostics channel is\n" +
            "not fully wired:\n" +
            failures.join("\n") +
            "\n\n  `ResolvedKeyframes` must carry a `diagnostics: Diagnostic[]` field that\n" +
            "  CONSUMES the value.js ParseDiagnostic/OnParseError producer (NOT a\n" +
            "  kf-local re-author), emit EMPTY_PARSE on a silent empty parse, carry\n" +
            "  the stable code set, and be surfaced on the animation. Restore the\n" +
            "  clause each anchor names.",
    );
    process.exit(1);
}
console.log(
    "proof:diagnostics-channel — PASS: `ResolvedKeyframes` carries the\n" +
        "`diagnostics: Diagnostic[]` channel CONSUMING the value.js\n" +
        "ParseDiagnostic/OnParseError producer; every silent fallback site\n" +
        "(EMPTY_PARSE, UNKNOWN_TIMING_FN, COMPOSITION_FALLBACK) is a citable\n" +
        "stable-coded row, surfaced on the animation. The value proof rides\n" +
        "`vitest run test/diagnostics-channel.test.ts`.",
);
