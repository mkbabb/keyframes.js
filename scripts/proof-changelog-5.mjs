#!/usr/bin/env node
/**
 * proof:changelog-5 — the breaking-set MIGRATION-doc oracle (Q.WE1 · S4/S5).
 *
 * Semver honesty (B6 + IMPL-RUN-BOARD:23): a BREAKING change must be DOCUMENTED
 * for the consumer. Q.WE1 drops the three `@deprecated` PKG-3 aliases — a
 * genuine breaking cut (`import { Animation }` / `import { ScrollTimeline }`
 * stops resolving). This gate asserts `docs/MIGRATION-5.0.0.md` exists and
 * records the FULL breaking alias-drop set with each rename's old→new mapping.
 *
 * Q.WE1 is the SINGLE owner of BOTH breaking-surface gates (this one +
 * `proof:alias-dropped`); Q.WZ (the 5.0.0 cut) CONSUMES this gate as a
 * publish-block precondition, it does not co-author it.
 *
 * THREE clauses:
 *   clause 1 — the doc EXISTS at docs/MIGRATION-5.0.0.md (or a CHANGELOG entry
 *     for 5.0.0 that references it).
 *   clause 2 — every dropped alias → canonical rename is documented: each of the
 *     three rows (`Animation` → `KeyframesAnimation`, `ScrollTimeline` →
 *     `KeyframesScrollTimeline`, `ScrollTimelineOptions` →
 *     `KeyframesScrollTimelineOptions`) must appear with BOTH the old and the new
 *     name on the same documented line/row.
 *   clause 3 — the disambiguation note: the doc must explicitly state that
 *     `globalThis.ScrollTimeline` (the platform Houdini timeline) is UNRELATED
 *     and untouched by the rename (the migration's central footgun).
 *
 * Born-RED today (the doc is absent). GREEN once Q.WE1's S4 authors it.
 *
 * CI posture: HARD — a semver-honesty precept, structural and device-independent.
 *
 * RUN: npm run proof:changelog-5
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIGRATION = path.join(REPO, "docs/MIGRATION-5.0.0.md");

const failures = [];

// The dropped-alias → canonical-target rename set (the breaking surface).
const RENAMES = [
    ["Animation", "KeyframesAnimation"],
    ["ScrollTimeline", "KeyframesScrollTimeline"],
    ["ScrollTimelineOptions", "KeyframesScrollTimelineOptions"],
];

// ═════════════════════════════════════════════════════════════════════════════
// clause 1 — the MIGRATION doc exists
// ═════════════════════════════════════════════════════════════════════════════

console.log("\nclause 1 — docs/MIGRATION-5.0.0.md exists");
if (!fs.existsSync(MIGRATION)) {
    failures.push(
        "(1) docs/MIGRATION-5.0.0.md is ABSENT — the breaking alias-drop set has no " +
            "consumer-facing migration doc (semver-honesty: a breaking change must be " +
            "documented). Author it (Q.WE1 S4).",
    );
    // Cannot check clauses 2/3 without the doc — fail loud, report, exit.
    report();
}

const doc = fs.readFileSync(MIGRATION, "utf8");
console.log(`  ✓ docs/MIGRATION-5.0.0.md present (${doc.length} B)`);

// ═════════════════════════════════════════════════════════════════════════════
// clause 2 — every dropped alias → canonical rename is documented
// ═════════════════════════════════════════════════════════════════════════════

console.log("\nclause 2 — every alias → canonical rename documented");
for (const [oldName, newName] of RENAMES) {
    // The rename must appear with BOTH names "near" each other — a markdown row,
    // a `old → new` arrow, or both backticked on one line. We assert each name is
    // present AND that at least one line carries BOTH (the mapping, not two stray
    // mentions). `\b` word boundaries keep `ScrollTimeline` from matching inside
    // `KeyframesScrollTimeline` (the new name is checked separately).
    const oldRe = new RegExp(String.raw`\b${oldName}\b`);
    const newRe = new RegExp(String.raw`\b${newName}\b`);
    if (!newRe.test(doc)) {
        failures.push(
            `(2) docs/MIGRATION-5.0.0.md never names the canonical target \`${newName}\` ` +
                `(the rename for \`${oldName}\`).`,
        );
        continue;
    }
    // A line documenting the mapping: contains `newName`, and contains `oldName`
    // NOT as a substring of `newName`. We blank `newName` occurrences first so a
    // line that has ONLY `KeyframesScrollTimeline` doesn't false-pass for the
    // `ScrollTimeline` old-name check.
    const mapped = doc.split("\n").some((line) => {
        const blanked = line.replaceAll(newName, "·".repeat(newName.length));
        return newRe.test(line) && oldRe.test(blanked);
    });
    if (!mapped) {
        failures.push(
            `(2) docs/MIGRATION-5.0.0.md names \`${oldName}\` and \`${newName}\` but ` +
                `not together on one row/line — the rename mapping is not unambiguously documented.`,
        );
    } else {
        console.log(`  ✓ \`${oldName}\` → \`${newName}\` documented`);
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// clause 3 — the globalThis.ScrollTimeline disambiguation note
// ═════════════════════════════════════════════════════════════════════════════

console.log("\nclause 3 — the globalThis.ScrollTimeline disambiguation note");
if (!/globalThis\.ScrollTimeline/.test(doc)) {
    failures.push(
        "(3) docs/MIGRATION-5.0.0.md does NOT mention `globalThis.ScrollTimeline` — the " +
            "central migration footgun (the platform Houdini timeline is UNRELATED and must " +
            "NOT be renamed) is undocumented.",
    );
} else {
    console.log(
        "  ✓ the `globalThis.ScrollTimeline` (Houdini platform global) disambiguation note is present.",
    );
}

report();

function report() {
    if (failures.length > 0) {
        console.error(
            `\nproof:changelog-5 — FAIL (${failures.length} finding(s); the breaking ` +
                `alias-drop set is undocumented):`,
        );
        for (const f of failures) console.error("  ✗ " + f);
        process.exit(1);
    }
    console.log(
        "\nproof:changelog-5 — PASS: docs/MIGRATION-5.0.0.md documents the full\n" +
            "breaking alias-drop set (Animation → KeyframesAnimation, ScrollTimeline →\n" +
            "KeyframesScrollTimeline, ScrollTimelineOptions → KeyframesScrollTimelineOptions)\n" +
            "with the globalThis.ScrollTimeline disambiguation note.",
    );
    process.exit(0);
}
