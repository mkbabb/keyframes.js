#!/usr/bin/env node
/**
 * proof:readme-paths-live — R.W7 docs-surface gate.
 *
 * Three clauses, each independently falsifiable:
 *
 *   (a) every `](src/…)` or `](./src/…)` inline link in README.md resolves
 *       to a real file on disk. A dead link → exit 1.
 *
 *   (b) the bare string `Animation` does NOT appear as a standalone class-name
 *       reference (backtick-quoted, not as part of CSSKeyframesAnimation,
 *       KeyframesAnimation, AnimationGroup, AnimationOptions, etc.). A surviving
 *       stale name → exit 1.
 *
 *   (c) the Quick Start fence is tagged `ts run` (not bare `ts`) and its body
 *       contains at least one `import` line. A `ts` tag or missing import → exit 1.
 *
 * Born-RED plant tests (run via --plant-test flag):
 *   - (a): inserts `](src/easing.ts)` into README → gate exits 1 → remove → exits 0
 *   - (b): inserts `` `Animation` class is… `` into README → gate exits 1 → remove → exits 0
 *   - (c): changes the Quick Start fence tag `ts run` → `ts` → gate exits 1 → restore → exits 0
 *
 * RUN: npm run proof:readme-paths-live
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..");
const README = path.join(REPO, "README.md");

const PLANT_TEST = process.argv.includes("--plant-test");

const failures = [];
const ok = (msg) => console.log(`  ✓ ${msg}`);

console.log("proof:readme-paths-live — README paths + class name + Quick Start fence");

// ── helpers ────────────────────────────────────────────────────────────────────

function runGate(content) {
    const gateFailures = [];

    // ── (a) every ](src/…) link resolves ──────────────────────────────────────
    const srcLinkRe = /\]\((\.\/)?src\/([^)]+)\)/g;
    let m;
    const deadLinks = [];
    while ((m = srcLinkRe.exec(content)) !== null) {
        const target = m[1] ? path.join(REPO, m[0].slice(2, -1)) : path.join(REPO, "src", m[2]);
        const resolved = m[1]
            ? path.join(REPO, m[0].replace(/^\]\(/, "").replace(/\)$/, ""))
            : path.join(REPO, "src", m[2]);
        if (!fs.existsSync(resolved)) {
            deadLinks.push(`  dead: ](src/${m[2]}) → ${resolved}`);
        }
    }
    if (deadLinks.length > 0) {
        gateFailures.push(
            `(a) ${deadLinks.length} dead src/ link(s) in README.md:\n${deadLinks.join("\n")}`,
        );
    } else {
        ok("(a) all ](src/…) links in README.md resolve to real files");
    }

    // ── (b) no standalone `Animation` class-name reference ────────────────────
    // Match `Animation` backtick-quoted but NOT as part of a longer identifier
    // that already uses the canonical name.
    const staleRe = /`Animation`/g;
    const staleMatches = [];
    let sm;
    while ((sm = staleRe.exec(content)) !== null) {
        // Extract surrounding context to filter out compound names
        const start = Math.max(0, sm.index - 20);
        const ctx = content.slice(start, sm.index + 15);
        // skip if preceded by CSS/Keyframes/Numeric/Group/Options prefix or followed by those suffixes
        if (
            /(?:CSSKeyframes|KeyframesAnimation|Numeric|Group|Options|Frame|Error|Id|Engine|Composer|Option)$/.test(
                ctx.slice(0, sm.index - start),
            ) ||
            /^Animation(?:Group|Options|Frame|Error|Id|Engine|Composer)/.test(
                content.slice(sm.index + 1),
            )
        ) {
            continue;
        }
        const lineNo = content.slice(0, sm.index).split("\n").length;
        staleMatches.push(`  line ${lineNo}: ${content.slice(sm.index - 20, sm.index + 30).trim()}`);
    }
    if (staleMatches.length > 0) {
        gateFailures.push(
            `(b) standalone \`Animation\` class-name reference found in README.md (stale — should be \`KeyframesAnimation\`):\n${staleMatches.join("\n")}`,
        );
    } else {
        ok("(b) no standalone `Animation` class-name reference in README.md");
    }

    // ── (c) Quick Start fence is `ts run` and has an import line ──────────────
    // Find the ## Quick Start heading, then the first fenced code block after it
    const qsIdx = content.indexOf("## Quick Start");
    if (qsIdx === -1) {
        gateFailures.push("(c) ## Quick Start heading not found in README.md");
    } else {
        const afterQs = content.slice(qsIdx);
        // Match the opening fence line (```ts run or ```ts etc.) — capture the full tag
        const fenceOpenRe = /^```([^\n]*)/m;
        const fenceOpen = fenceOpenRe.exec(afterQs);
        if (!fenceOpen) {
            gateFailures.push("(c) no fenced code block found after ## Quick Start");
        } else {
            const tag = fenceOpen[1];
            if (tag !== "ts run") {
                gateFailures.push(
                    `(c) Quick Start fence tag is \`${tag}\`, expected \`ts run\` — the snippet cannot be executed by \`ts run\``,
                );
            }
            // Extract the fence body
            const fenceStart = fenceOpen.index + fenceOpen[0].length;
            const fenceEndRe = /^```$/m;
            const fenceBody = afterQs.slice(fenceStart);
            const hasImport = /^import /m.test(fenceBody);
            if (!hasImport) {
                gateFailures.push(
                    "(c) Quick Start fence body has no `import` line — the snippet cannot compile",
                );
            }
            if (tag === "ts run" && hasImport) {
                ok("(c) Quick Start fence is tagged `ts run` and contains an import line");
            }
        }
    }

    return gateFailures;
}

// ── plant tests ────────────────────────────────────────────────────────────────

if (PLANT_TEST) {
    console.log("\n── Born-RED plant tests ──────────────────────────────────────────────────\n");
    const original = fs.readFileSync(README, "utf8");
    let allPassed = true;

    // Plant (a): insert a dead src/ link
    {
        const injected = original.replace(
            "## Quick Start",
            "## Quick Start\n\n<!-- plant-a: [dead link](src/easing.ts) -->",
        );
        const f = runGate(injected);
        const bit = f.some((msg) => msg.startsWith("(a)"));
        if (bit) {
            console.log("  ✓ plant (a): dead ](src/easing.ts) link → gate fired");
        } else {
            console.error("  ✗ plant (a): gate DID NOT fire for dead ](src/easing.ts) link — clause (a) is broken");
            allPassed = false;
        }
    }

    // Plant (b): insert standalone `Animation` class name
    {
        const injected = original + "\nThe `Animation` class is the engine.\n";
        const f = runGate(injected);
        const bit = f.some((msg) => msg.startsWith("(b)"));
        if (bit) {
            console.log("  ✓ plant (b): `Animation` reference → gate fired");
        } else {
            console.error("  ✗ plant (b): gate DID NOT fire for `Animation` reference — clause (b) is broken");
            allPassed = false;
        }
    }

    // Plant (c): change Quick Start fence tag to bare `ts`
    {
        const injected = original.replace("```ts run\n", "```ts\n");
        const f = runGate(injected);
        const bit = f.some((msg) => msg.startsWith("(c)"));
        if (bit) {
            console.log("  ✓ plant (c): bare `ts` fence tag → gate fired");
        } else {
            console.error("  ✗ plant (c): gate DID NOT fire for bare `ts` fence tag — clause (c) is broken");
            allPassed = false;
        }
    }

    console.log("");
    if (!allPassed) {
        console.error("proof:readme-paths-live — plant tests FAILED (one or more clauses did not bite)");
        process.exit(1);
    }
    console.log("proof:readme-paths-live — all plant tests passed (every clause bites on injection)");
    console.log("\nRunning gate against live README.md...\n");
}

// ── live gate ──────────────────────────────────────────────────────────────────

const content = fs.readFileSync(README, "utf8");
const gateFailures = runGate(content);

console.log("");
if (gateFailures.length > 0) {
    console.error(
        `proof:readme-paths-live — FAIL (${gateFailures.length} finding(s)):`,
    );
    for (const f of gateFailures) console.error("  ✗ " + f);
    process.exit(1);
}
console.log(
    "proof:readme-paths-live — PASS: all ](src/…) links live, no stale `Animation`\n" +
    "reference, Quick Start fence is `ts run` with an import line.",
);
process.exit(0);
