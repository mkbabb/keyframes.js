#!/usr/bin/env node
/**
 * proof:publish — surface-family barrel for the terminal publish bundle.
 *
 * Keep the publish boundary in one explicit sequence: light/heavy separation,
 * packed surface truth, dependency/lock currency, downstream consumption, and
 * runnable documentation. These are implementation checks, not a public gate
 * taxonomy; diagnostics run the family files directly.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const checks = [
    "boundary.mjs",
    "published-surface.mjs",
    "deps-current.mjs",
    "consume-bundle.mjs",
    "readme-runs.mjs",
];
for (const check of checks) {
    const result = spawnSync(process.execPath, [join(here, check)], { stdio: "inherit" });
    if (result.status !== 0) process.exit(result.status ?? 1);
}

// U.D6 — one post-build delivery clause. Release/merge library jobs do not
// build gh-pages, so the clause is explicitly skipped there; the nightly/demo
// build invokes the same bundle after assets exist and gets the real graph bite.
const assets = join(process.cwd(), "dist", "gh-pages", "assets");
if (existsSync(assets)) {
    const files = readdirSync(assets);
    const js = files.filter((f) => f.endsWith(".js"));
    const entry = js.find((f) => /^index-[^/]+\.js$/.test(f));
    const entryText = entry ? readFileSync(join(assets, entry), "utf8") : "";
    const forbiddenEntryEdges = ["vendor-monaco", "vendor-highlight", "vendor-three", "worker-"]
        .filter((token) => entryText.includes(token));
    const forbiddenWorkers = files.filter((f) => /^(?:html|json|ts)\.worker/i.test(f));
    const highlight = files.find((f) => /^vendor-highlight-.*\.js$/.test(f));
    const highlightBytes = highlight ? readFileSync(join(assets, highlight)).byteLength : 0;
    if (!entry || forbiddenEntryEdges.length > 0 || forbiddenWorkers.length > 0) {
        console.error(
            `proof:publish — FAIL: U.D6 eager graph violation (entry=${entry ?? "missing"}; ` +
                `forbidden entry edges=${forbiddenEntryEdges.join(",") || "none"}; ` +
                `unused workers=${forbiddenWorkers.join(",") || "none"})`,
        );
        process.exit(1);
    }
    if (highlightBytes > 40_000) {
        console.error(
            `proof:publish — FAIL: U.D6 deferred highlight chunk ${highlightBytes}B exceeds 40KB`,
        );
        process.exit(1);
    }
    console.log(
        `proof:publish — U.D6 PASS: eager entry has no editor/vendor edges; ` +
            `${files.length} assets, ${highlightBytes}B deferred highlight chunk.`,
    );
} else {
    console.log("proof:publish — U.D6 deferred: dist/gh-pages is absent on the library publish path.");
}
console.log("proof:publish — PASS: package boundary, consumption, and runnable docs are green.");
