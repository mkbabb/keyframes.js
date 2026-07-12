#!/usr/bin/env node
/**
 * proof:dock-single-tooltip — T.C3 (ONE tooltip authority). BORN-RED → GREEN.
 *
 * VERDICT #6 (shot 06 — "Clear all & reload" rendered TWICE). Lane 08 D3 root-caused
 * it: TWO tooltip systems fire on one dock control — glass-ui's `IconTooltip` (the
 * intended single renderer) AND the native browser `title` tooltip. `DockIconButton`
 * has no `title` prop, so a passed `title=` falls through onto the `<button>`; hover
 * ≥1s renders BOTH. The fix: drop EVERY `title=` passthrough on dock controls; use
 * `aria-label` for the accessible name; `IconTooltip` is the single VISIBLE renderer.
 *
 * TEETH (STATIC): zero `title=` attributes on the dock control call sites in
 * ChromeDock.vue + TransportDock.vue (the two docks where the double-tooltip fired).
 * A regression re-adding a `title=` passthrough reds. Re-runnable:
 * `node scripts/proof-dock-single-tooltip.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const DOCKS = [
    ["ChromeDock", path.join(DEMO, "app/dock/ChromeDock.vue")],
    [
        "TransportDock",
        path.join(DEMO, "@/components/instrument/transport/TransportDock.vue"),
    ],
];

const failures = [];
const ok = (l) => console.log(`  ✓ ${l}`);
const fail = (l) => {
    failures.push(l);
    console.error(`  ✗ ${l}`);
};
const stripHtml = (s) => s.replace(/<!--[\s\S]*?-->/g, "");

console.log("proof:dock-single-tooltip — T.C3 (ONE tooltip authority; no native `title` passthrough)\n");

for (const [label, file] of DOCKS) {
    if (!fs.existsSync(file)) {
        fail(`${label} not found at ${path.relative(REPO, file)}.`);
        continue;
    }
    const src = stripHtml(fs.readFileSync(file, "utf8"));
    // Any `title=` / `:title=` attribute in the (comment-free) dock template is a
    // native-tooltip passthrough (the double-tooltip source). IconTooltip's own
    // prop is `text=`, never `title=`, so this is unambiguous.
    const hits = [...src.matchAll(/(^|\s):?title\s*=/g)];
    if (hits.length === 0) {
        ok(`${label} — zero \`title=\` passthroughs (IconTooltip + aria-label are the only tooltip/name channels).`);
    } else {
        fail(`${label} — ${hits.length} \`title=\` passthrough(s) survive — the native-tooltip double-render (VERDICT #6). Use aria-label + IconTooltip.`);
    }
}

if (failures.length > 0) {
    console.error(`\nproof:dock-single-tooltip — FAIL (${failures.length}): a dock control carries a native \`title=\` (double tooltip).`);
    process.exit(1);
}
console.log("\nproof:dock-single-tooltip — PASS: no dock control carries a native `title=`; IconTooltip is the single visible tooltip authority.");
