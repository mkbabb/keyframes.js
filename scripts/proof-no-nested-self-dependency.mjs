#!/usr/bin/env node
/**
 * proof:no-nested-self-dependency (T.S3 / lane 27 F6) — a BORN-RED tripwire.
 *
 * `@mkbabb/value.js@2.0.1`'s OWN package.json lists `"@mkbabb/value.js": "^1.0.2"`
 * among its own `dependencies` — a package depending on ITSELF. npm cannot dedupe
 * a package against itself, so every `npm ci` NESTS a stale value.js (and its
 * stale parse-that) inside kf's own node_modules:
 *   node_modules/@mkbabb/value.js/node_modules/@mkbabb/value.js -> a stale minor.
 * That is dead weight (>1MB) + a realm-duplication hazard (two value.js copies).
 * An upstream publishing bug; value.js 3.0.0 DROPS the self-dep (deps =
 * {@mkbabb/parse-that}) — this gate GREENs the instant kf re-points to a value.js
 * whose lockfile no longer nests a self/duplicate @mkbabb install.
 *
 * PLANTED-TRUE today: package-lock.json carries
 * `node_modules/@mkbabb/value.js/node_modules/@mkbabb/value.js` (+ a nested
 * parse-that). This census REDs on ANY @mkbabb package nested under another
 * @mkbabb package's node_modules (a self/duplicate install). Registered in
 * scripts/gate-bands.mjs T_BORNRED_BACKLOG
 * (dischargedBy: value.js 3.0.0 drops the self-dep + kf re-points). Exits 1 on
 * any residual nested @mkbabb install.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOCK = join(root, "package-lock.json");

console.log("proof:no-nested-self-dependency (T.S3 / lane 27 F6) — the value.js self-dependency phantom tripwire");

if (!existsSync(LOCK)) {
    console.error("  ✗ [substrate] package-lock.json absent — cannot census the install tree.");
    process.exit(1);
}

const lock = JSON.parse(readFileSync(LOCK, "utf8"));
const packages = lock.packages ?? {};

// A nested @mkbabb install under another @mkbabb package's node_modules — the
// self/duplicate-dependency signature (npm cannot dedupe a package vs itself).
const NESTED_RE = /node_modules\/@mkbabb\/[^/]+\/node_modules\/@mkbabb\/[^/]+/;
const offenders = Object.keys(packages).filter((p) => NESTED_RE.test(p));

if (offenders.length > 0) {
    const detail = offenders
        .map((p) => {
            const ver = packages[p]?.version ?? "?";
            // A nested install of the SAME package name as its parent = a self-dep.
            const parent = p.replace(/\/node_modules\/@mkbabb\/[^/]+$/, "");
            const parentName = parent.split("/node_modules/").pop();
            const childName = p.split("/node_modules/").pop();
            const self = parentName === childName ? " (SELF-dependency)" : "";
            return `    · ${p} @ ${ver}${self}`;
        })
        .join("\n");
    console.error(
        `  ✗ [nested-self-dep] package-lock.json nests ${offenders.length} @mkbabb install(s) ` +
            `under another @mkbabb package's node_modules:\n${detail}\n` +
            `    A package depending on ITSELF (value.js 2.0.1 deps carry "@mkbabb/value.js") forces npm ` +
            `to nest a stale duplicate. FIX (upstream): value.js drops the self-dep from its own\n` +
            `    package.json (3.0.0 already does); kf re-points to that version so npm dedupes to ONE ` +
            `copy. See docs/tranches/T/KF-TO-VALUEJS-T.md.`,
    );
    console.error("\nproof:no-nested-self-dependency — FAIL (born-RED tripwire; T_BORNRED_BACKLOG).");
    process.exit(1);
}

console.log("  ✓ [nested-self-dep] no nested @mkbabb/*/node_modules/@mkbabb/* self-or-duplicate install in package-lock.json");
console.log("proof:no-nested-self-dependency — PASS.");
