#!/usr/bin/env node
/**
 * proof:no-hand-rolled-labeled-select — T.H4 (LabeledSelect pure-consumption).
 *
 * glass-ui's `labeled-field` family is already the demo's idiom for option/config
 * rows (LabeledSlider / LabeledSelect / LabeledInput in AnimationControlsControls,
 * LayerConfigPanel, EasingSidebar, SpringSidebar). Its sibling `LabeledSelect`
 * (from @mkbabb/glass-ui/labeled-field) replaces a hand-rolled `<label>` adjacent
 * to a raw reka/glass-ui `<Select>` primitive — the exact pattern the labeled-field
 * component abstracts (label + controlled-open + tooltip + a11y in one unit).
 *
 * THE WITNESS: a hand-rolled `<label>…</label>` immediately followed (within a
 * small window) by a RAW `<Select>` primitive opening — NOT `<LabeledSelect>`
 * (the consumed component), NOT `<SelectTrigger>`/`<SelectContent>`/`<SelectItem>`
 * (Select's own children), NOT `<EasingSelect>` (the named rich grouped picker,
 * which is a component, not a hand-rolled pair). Each such pair reds — it must be
 * a `LabeledSelect`.
 *
 * DEVICE-INDEPENDENT static source grep (no browser, no build):
 *   node scripts/proof-no-hand-rolled-labeled-select.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = join(root, "demo");

// NAMED carve-out (a reason, not a silent exemption; self-tightening).
// The compose scene's asset-manager is OD-1 RULED PRUNE (FINAL, 2026-07-05) — T.E
// deletes compose wholesale; its animation-binding Select is a bespoke None-sentinel
// bind-ignition trigger (a `placeholder="None"` + `__none__` sentinel + dynamic
// preset names), not the standard option/config-row enum LabeledSelect models. When
// T.E deletes compose this carve-out matches nothing.
const CARVEOUT = [(rel) => rel.startsWith("demo/scenes/compose/")];

function collectVue(dir, acc = []) {
    let entries;
    try {
        entries = readdirSync(dir);
    } catch {
        return acc;
    }
    for (const name of entries) {
        if (name === "node_modules" || name === "dist" || name === ".vite") continue;
        const full = join(dir, name);
        let st;
        try {
            st = statSync(full);
        } catch {
            continue;
        }
        if (st.isDirectory()) collectVue(full, acc);
        else if (name.endsWith(".vue")) acc.push(full);
    }
    return acc;
}

/** Strip HTML comments so a comment that merely NAMES the pattern is not a false
 *  witness (replace with equal-length blanks to preserve line numbers). */
function stripComments(src) {
    return src.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "));
}

const violations = [];
let scanned = 0;

for (const file of collectVue(DEMO)) {
    const rel = relative(root, file);
    if (CARVEOUT.some((f) => f(rel))) continue;
    scanned++;
    const src = stripComments(readFileSync(file, "utf8"));
    // Each RAW `<Select>` primitive opening: `<Select` followed by whitespace or
    // `>` (so `<SelectTrigger`/`<SelectContent`/`<SelectItem` and `<LabeledSelect`
    // never match — the latter has no `<Select` substring at a `<` boundary).
    for (const m of src.matchAll(/<Select[\s>]/g)) {
        const pre = src.slice(Math.max(0, m.index - 300), m.index);
        if (/<\/label>/.test(pre)) {
            const line = src.slice(0, m.index).split("\n").length;
            violations.push(`${rel}:${line}`);
        }
    }
}

console.log(
    "proof:no-hand-rolled-labeled-select — T.H4 (LabeledSelect pure-consumption)\n",
);
console.log(`  · scanned ${scanned} demo .vue file(s)\n`);

if (violations.length > 0) {
    console.error(
        `proof:no-hand-rolled-labeled-select — FAIL (${violations.length}): a hand-rolled ` +
            "`<label>` adjacent to a raw `<Select>` primitive in an option/config row:",
    );
    for (const v of violations) console.error("  ✗ " + v);
    console.error(
        "\nReplace each with glass-ui `<LabeledSelect>` (from @mkbabb/glass-ui/labeled-field) " +
            "— the labeled-field idiom the sibling control rows already consume.",
    );
    process.exit(1);
}

console.log(
    "proof:no-hand-rolled-labeled-select — PASS: zero hand-rolled label-adjacent-Select " +
        "pairs in the option/config rows (each resolves to LabeledSelect).",
);
process.exit(0);
