#!/usr/bin/env node
/**
 * proof:alias-dropped — the NO-LEGACY breaking-surface oracle (Q.WE1 · S1).
 *
 * The owner's NO-LEGACY mandate's terminal, GATED (not hoped). The PKG-3 rename
 * (L.W8 §S4) shipped the canonical names cleanly — `Animation` →
 * `KeyframesAnimation`, `ScrollTimeline` → `KeyframesScrollTimeline`,
 * `ScrollTimelineOptions` → `KeyframesScrollTimelineOptions` — but left the
 * backward-compat `@deprecated` aliases on the published d.ts. Q.WE1 drops them
 * (the breaking 5.0.0 surface); THIS gate is the tripwire that asserts they are
 * GONE from the artifact a `npm i` consumer actually installs.
 *
 * It mirrors `proof:published-surface`'s build-then-read-the-BUILT-artifact
 * idiom: it reads the rolled-up `dist/keyframes.d.ts` (the consumer's surface),
 * NOT a `src/**` proxy a roll-up could mask. Three clauses:
 *
 *   clause 1 — `no-aliased-named-export` (THE KEYSTONE — the REAL breaking
 *     consumer observable). The published roll-up must carry ZERO
 *     `export { … as Animation }` / `export { … as ScrollTimeline }` /
 *     `export { … as ScrollTimelineOptions }` re-export statements, AND none of
 *     `Animation` / `ScrollTimeline` / `ScrollTimelineOptions` may be a named
 *     export of the built barrel (neither value nor type). This is the BYTE the
 *     consumer's `import { Animation } from "@mkbabb/keyframes.js"` resolves
 *     against — present on today's roll-up as a BARE re-export with NO
 *     `@deprecated` tag, so it cannot be gamed by a cosmetic JSDoc-only edit, and
 *     a re-export that survives API-Extractor (the genuine defect) is caught at
 *     the consumer's installed surface, not a source intent.
 *
 *   clause 2 — `no-deprecated-interface-key` (the SECOND breaking surface). The
 *     built roll-up's `AnimationEngine` + `EngineCore` interfaces must carry NO
 *     `Animation: typeof …` member — the two `@deprecated`-tagged interface keys
 *     are gone. The member match is shape-scoped (`@deprecated … \n Animation:
 *     typeof`) so a PROSE mention of "@deprecated" / "Animation" elsewhere in the
 *     d.ts stays GREEN. Companion SOURCE clause: `load-engine.ts` carries no
 *     `@deprecated`-tagged `Animation: typeof Animation;` key; `demo/` + `test/`
 *     carry no `import { Animation }` / `import type { Animation }` of the kf
 *     alias (the canonical `KeyframesAnimation` never triggers it).
 *
 *   clause 3 — `no-scroll-timeline-alias` (the DISAMBIGUATION-aware observable).
 *     `timeline.ts` carries no `KeyframesScrollTimeline as ScrollTimeline` /
 *     `KeyframesScrollTimelineOptions as ScrollTimelineOptions` re-export; the
 *     built barrel has no `ScrollTimeline` / `ScrollTimelineOptions` value/type
 *     export (subsumed by clause 1, restated here as the kf-class source-grep).
 *     The clause is disambiguation-aware: it matches only imports OF the kf class
 *     (`from "@mkbabb/keyframes.js"` / `from "…/animation/timeline"`), NEVER
 *     `globalThis.ScrollTimeline` or the ambient Houdini reference — so
 *     `test/platform-adopt.test.ts`'s + `test/orchestration-api.test.ts`'s
 *     `globalThis.ScrollTimeline` install/delete and README's native-global
 *     mention stay GREEN.
 *
 * PRECONDITION: the library is built (`npm run build:lib`) — the gate measures
 * the BUILT artifact, same sequencing as `proof:published-surface` (build →
 * gate). Exit 3 on an unbuilt tree (an environment error, not a surface verdict).
 *
 * CI posture: HARD — a correctness/precept invariant, structural and
 * device-independent.
 *
 * RUN: npm run proof:alias-dropped
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist");
const DTS = path.join(DIST, "keyframes.d.ts");
// S.B4 carved the `Timeline`/`KeyframesScrollTimeline` family OUT of the barrel
// into `./timeline` (r3 F4). The no-alias clause scans BOTH the barrel AND the
// class file — an `X as ScrollTimeline` alias could be re-exported from either.
const TIMELINE = [
    path.join(REPO, "src/animation/orchestration/timeline/index.ts"),
    path.join(REPO, "src/animation/orchestration/timeline/timeline.ts"),
];
const LOAD_ENGINE = path.join(REPO, "src/animation/load-engine.ts");

const failures = [];

// The dropped aliases + their canonical PKG-3 targets (the migration map).
const ALIASES = ["Animation", "ScrollTimeline", "ScrollTimelineOptions"];

// ─────────────────────────────────────────────────────────────────────────────
// Precondition — the built artifact exists. The gate measures dist AS BUILT.
// ─────────────────────────────────────────────────────────────────────────────
if (!fs.existsSync(DTS)) {
    console.error(
        "proof:alias-dropped — ERROR: dist/keyframes.d.ts missing. " +
            "Run `npm run build:lib` first (the gate measures the built artifact).",
    );
    process.exit(3);
}

/** Block + line comments → spaces (newlines preserved) so a prose mention of
 * `@deprecated`/`Animation`/`ScrollTimeline` in a docstring never trips a grep. */
const blankComments = (src) =>
    src
        .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
        .replace(/(^|\n)([ \t]*)\/\/[^\n]*/g, (_, a, b) => a + b);

/** Recursively list files under `dir` matching `re` (skips node_modules/dist). */
function walk(dir, re, out = []) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        if (ent.name === "node_modules" || ent.name === "dist") continue;
        const p = path.join(dir, ent.name);
        if (ent.isDirectory()) walk(p, re, out);
        else if (re.test(ent.name)) out.push(p);
    }
    return out;
}

const dts = fs.readFileSync(DTS, "utf8");
const dtsBlanked = blankComments(dts);

// ═════════════════════════════════════════════════════════════════════════════
// clause 1 — `no-aliased-named-export` (THE KEYSTONE — the breaking observable)
// ═════════════════════════════════════════════════════════════════════════════

console.log(
    "\nclause 1 — no-aliased-named-export (KEYSTONE: the breaking export-resolution, over the BUILT roll-up)",
);
{
    // (1a) No `export { <Canonical> as <Alias> }` aliased re-export on the d.ts.
    //   Today: `export { KeyframesAnimation as Animation }` (:2311),
    //   `export { KeyframesScrollTimeline as ScrollTimeline }` (:2338),
    //   `export { KeyframesScrollTimelineOptions as ScrollTimelineOptions }`
    //   (:2349) — bare, NO `@deprecated` tag, so a `@deprecated`-grep would MISS
    //   them. We read the export-list statements directly.
    const lines = dtsBlanked.split("\n");
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!/^\s*export\s*(?:type\s*)?\{/.test(line) && !/\}\s*;?\s*$/.test(line))
            continue;
        for (const alias of ALIASES) {
            // `… as Animation }` / `… as Animation,` — the aliased-export shape.
            const re = new RegExp(
                String.raw`\bas\s+${alias}\s*[},;]`,
            );
            if (re.test(line) && /\bexport\b/.test(line)) {
                failures.push(
                    `(1) dist/keyframes.d.ts:${i + 1} carries an aliased re-export ` +
                        `\`… as ${alias}\` — the breaking alias is STILL on the published ` +
                        `surface (a \`import { ${alias} } from "@mkbabb/keyframes.js"\` resolves). ` +
                        `Drop the source alias; the canonical name is the migration target.`,
                );
            }
        }
    }

    // (1b) None of the three aliases is a NAMED export of the built barrel —
    //   neither a `export declare class/const/interface/type <Alias>` nor an
    //   `export { … as <Alias> }`. (1a covers the aliased re-export; this covers
    //   a stray direct declaration under the alias name.)
    for (const alias of ALIASES) {
        const directDecl = new RegExp(
            String.raw`^\s*export\s+declare\s+(?:abstract\s+)?(?:class|interface|function|const|enum|type)\s+${alias}\b`,
            "m",
        );
        if (directDecl.test(dtsBlanked)) {
            failures.push(
                `(1) dist/keyframes.d.ts directly declares + exports \`${alias}\` — ` +
                    `the alias name is still a published export. Use the canonical PKG-3 name.`,
            );
        }
    }
    if (failures.length === 0) {
        console.log(
            "  ✓ zero aliased re-exports / direct declarations of `Animation` / " +
                "`ScrollTimeline` / `ScrollTimelineOptions` on the published roll-up — " +
                "the breaking names do not resolve for a `npm i` consumer.",
        );
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// clause 2 — `no-deprecated-interface-key` (the interface-key breaking surface)
// ═════════════════════════════════════════════════════════════════════════════

console.log(
    "\nclause 2 — no-deprecated-interface-key (AnimationEngine/EngineCore carry no @deprecated Animation key)",
);
{
    // (2a) The d.ts roll-up carries no `@deprecated`-tagged `Animation: typeof …`
    //   interface member. The match is the member-declaration SHAPE — a
    //   `@deprecated` JSDoc line immediately followed by an `Animation: typeof`
    //   member — so a prose mention of "@deprecated" inside an unrelated comment
    //   block does NOT trip it (we read the RAW d.ts here, not the blanked one,
    //   precisely to see the `@deprecated` JSDoc; the shape constraint is what
    //   makes it prose-proof).
    const KEY_RE = /@deprecated[^\n]*\n\s*(?:\*[^\n]*\n\s*)*Animation:\s*typeof/g;
    const keyHits = [...dts.matchAll(KEY_RE)];
    if (keyHits.length > 0) {
        failures.push(
            `(2) dist/keyframes.d.ts carries ${keyHits.length} \`@deprecated\` ` +
                `\`Animation: typeof …\` interface key(s) (the AnimationEngine / EngineCore ` +
                `keys) — \`loadAnimationEngine().Animation\` still resolves. Drop the keys ` +
                `in load-engine.ts; the canonical accessor is \`KeyframesAnimation\`.`,
        );
    }

    // (2b) SOURCE companion — load-engine.ts carries no `@deprecated`-tagged
    //   `Animation: typeof Animation;` interface key.
    const loadEngineSrc = fs.readFileSync(LOAD_ENGINE, "utf8");
    const srcKeyHits = [
        ...loadEngineSrc.matchAll(
            /@deprecated[^\n]*\n\s*Animation:\s*typeof\s+Animation;/g,
        ),
    ];
    if (srcKeyHits.length > 0) {
        failures.push(
            `(2) src/animation/load-engine.ts carries ${srcKeyHits.length} ` +
                `\`@deprecated\` \`Animation: typeof Animation;\` interface key(s) — drop them.`,
        );
    }

    // (2c) CONSUMER companion — no demo/test file imports the `Animation` ALIAS
    //   (value or type) from the published barrel or `…/animation/engine`. The
    //   canonical `KeyframesAnimation` is word-boundary-distinct and never trips.
    const consumerImportRe =
        /import\s+(?:type\s+)?\{[^}]*\bAnimation\b[^}]*\}\s*from\s*["'](?:@mkbabb\/keyframes\.js|(?:\.\.?\/)+(?:src\/)?animation\/engine)["']/;
    const consumers = [
        ...walk(path.join(REPO, "demo"), /\.(ts|vue)$/),
        ...walk(path.join(REPO, "test"), /\.ts$/),
    ];
    const offenders = [];
    for (const f of consumers) {
        const src = blankComments(fs.readFileSync(f, "utf8"));
        if (consumerImportRe.test(src)) offenders.push(path.relative(REPO, f));
    }
    if (offenders.length > 0) {
        failures.push(
            `(2) ${offenders.length} demo/test file(s) still import the \`Animation\` ` +
                `alias (migrate to \`KeyframesAnimation\`):\n      ` +
                offenders.join(", "),
        );
    }
    if (
        keyHits.length === 0 &&
        srcKeyHits.length === 0 &&
        offenders.length === 0
    ) {
        console.log(
            "  ✓ no `@deprecated` `Animation: typeof …` interface key on the d.ts or " +
                "in load-engine.ts; no demo/test consumer imports the `Animation` alias.",
        );
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// clause 3 — `no-scroll-timeline-alias` (disambiguation-aware)
// ═════════════════════════════════════════════════════════════════════════════

console.log(
    "\nclause 3 — no-scroll-timeline-alias (kf-class alias dropped; globalThis.ScrollTimeline untouched)",
);
{
    // (3a) SOURCE — timeline.ts carries no `KeyframesScrollTimeline as
    //   ScrollTimeline` / `KeyframesScrollTimelineOptions as
    //   ScrollTimelineOptions` re-export.
    const timelineSrc = blankComments(
        TIMELINE.map((f) => fs.readFileSync(f, "utf8")).join("\n"),
    );
    for (const [canonical, alias] of [
        ["KeyframesScrollTimeline", "ScrollTimeline"],
        ["KeyframesScrollTimelineOptions", "ScrollTimelineOptions"],
    ]) {
        const re = new RegExp(
            String.raw`export\s*\{[^}]*\b${canonical}\s+as\s+${alias}\b`,
        );
        if (re.test(timelineSrc)) {
            failures.push(
                `(3) src/animation/orchestration/timeline/index.ts re-exports \`${canonical} as ${alias}\` ` +
                    `— drop the alias; the canonical name is \`${canonical}\`.`,
            );
        }
    }

    // (3b) CONSUMER — no demo/test file imports the `ScrollTimeline` /
    //   `ScrollTimelineOptions` ALIAS of the kf class (from the barrel or
    //   `…/animation/timeline`). DISAMBIGUATION-AWARE: matches only the IMPORT of
    //   the kf class, NEVER `globalThis.ScrollTimeline` / the ambient Houdini
    //   reference (so the native-bridge tests + README native-global mention
    //   stay GREEN).
    const scrollImportRe =
        /import\s+(?:type\s+)?\{[^}]*\bScrollTimeline(?:Options)?\b[^}]*\}\s*from\s*["'](?:@mkbabb\/keyframes\.js|(?:\.\.?\/)+(?:src\/)?animation\/timeline)["']/;
    const consumers = [
        ...walk(path.join(REPO, "demo"), /\.(ts|vue)$/),
        ...walk(path.join(REPO, "test"), /\.ts$/),
    ];
    const offenders = [];
    for (const f of consumers) {
        const src = blankComments(fs.readFileSync(f, "utf8"));
        if (scrollImportRe.test(src)) offenders.push(path.relative(REPO, f));
    }
    if (offenders.length > 0) {
        failures.push(
            `(3) ${offenders.length} demo/test file(s) still import the kf-class ` +
                `\`ScrollTimeline\`/\`ScrollTimelineOptions\` alias (migrate to ` +
                `\`KeyframesScrollTimeline\`/\`KeyframesScrollTimelineOptions\`):\n      ` +
                offenders.join(", "),
        );
    }
    if (offenders.length === 0 && !failures.some((f) => f.startsWith("(3)"))) {
        console.log(
            "  ✓ no `KeyframesScrollTimeline as ScrollTimeline` re-export in timeline.ts; " +
                "no demo/test consumer imports the kf-class ScrollTimeline alias " +
                "(globalThis.ScrollTimeline references untouched).",
        );
    }
}

// ─────────────────────────────────────────────────────────────────────────────

if (failures.length > 0) {
    console.error(
        `\nproof:alias-dropped — FAIL (${failures.length} finding(s); the legacy aliases ` +
            `still ride the published surface):`,
    );
    for (const f of failures) console.error("  ✗ " + f);
    console.error(
        "\n  The NO-LEGACY mandate's terminal: `Animation` → `KeyframesAnimation`,\n" +
            "  `ScrollTimeline` → `KeyframesScrollTimeline`, `ScrollTimelineOptions` →\n" +
            "  `KeyframesScrollTimelineOptions`. Drop the source aliases + migrate every\n" +
            "  consumer (see docs/MIGRATION-5.0.0.md). globalThis.ScrollTimeline is the\n" +
            "  unrelated Houdini global — NEVER rename it.",
    );
    process.exit(1);
}

console.log(
    "\nproof:alias-dropped — PASS: the three `@deprecated` aliases (`Animation`,\n" +
        "`ScrollTimeline`, `ScrollTimelineOptions`) are GONE from the published\n" +
        "dist/keyframes.d.ts — neither an aliased re-export, a direct declaration, nor\n" +
        "a `@deprecated` interface key survives; no demo/test consumer imports them;\n" +
        "the Houdini `globalThis.ScrollTimeline` references are untouched.",
);
