#!/usr/bin/env node
/**
 * proof:no-collision-rename (T.S3 / lane 27 F5 — KF-7) — a BORN-RED tripwire.
 *
 * value.js exports a type named `PropertyDescriptor`, which COLLIDES with the
 * ambient DOM/TS global of the same name. When kf's API-Extractor rolls up the
 * public `dist/keyframes.d.ts`, it disambiguates the collision by emitting a
 * `PropertyDescriptor as PropertyDescriptor_2` import + `PropertyDescriptor_2`
 * references — a machine-mangled name leaking into kf's PUBLISHED type surface.
 * KF-7 (filed KF-VALUEJS-2.0.0.md:73) asked value.js to rename its export to a
 * collision-free name (e.g. `CSSPropertyDescriptor`, the KF-1 NO-legacy total-
 * rename shape). value.js 2.0.1 AND 3.0.0 STILL export it un-renamed, so the
 * defect is live in kf's built d.ts.
 *
 * PLANTED-TRUE today: `PropertyDescriptor_2` is present at dist/keyframes.d.ts
 * (import + two `Map<string, PropertyDescriptor_2>`). This gate REDs on that
 * collision-rename NOW and GREENs the instant value.js publishes the rename AND
 * kf re-points its `import PropertyDescriptor` + the `Map<…>` types (the KF-2
 * cadence: the adopt-event watch gates the re-point). Registered in
 * scripts/gate-bands.mjs T_BORNRED_BACKLOG (dischargedBy: value.js rename +
 * kf re-point). Exits 1 on any residual collision-rename.
 *
 * SCOPE: a `<Name> as <Name>_N` collision-rename on a `@mkbabb/value.js` import
 * (the API-Extractor mangling signature), plus any downstream `<Name>_N`
 * reference. This is a d.ts-surface gate — it reads the BUILT roll-up.
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DTS = join(root, "dist", "keyframes.d.ts");

console.log("proof:no-collision-rename (T.S3 / KF-7) — the value.js PropertyDescriptor collision tripwire");

// Build the d.ts roll-up if absent (the gate reads the PUBLISHED surface).
if (!existsSync(DTS)) {
    console.log("  · dist/keyframes.d.ts absent — building the library roll-up first…");
    try {
        execSync("npm run build:lib", { cwd: root, stdio: "inherit" });
    } catch {
        console.error("  ✗ [substrate] build:lib failed — cannot read the published d.ts surface.");
        process.exit(1);
    }
}

const dts = readFileSync(DTS, "utf8");

// The API-Extractor collision-rename signature: `X as X_2` on a value.js import
// (any `_<digit>` suffix), plus the downstream `X_<digit>` references.
const importRenameRe =
    /import\s*\{[^}]*\b([A-Za-z_$][\w$]*)\s+as\s+\1_(\d+)\b[^}]*\}\s*from\s*['"]@mkbabb\/value\.js['"]/g;
const renames = [];
let m;
while ((m = importRenameRe.exec(dts))) {
    renames.push(`${m[1]} as ${m[1]}_${m[2]}`);
}

// Also catch any bare `PropertyDescriptor_<digit>` reference (the KF-7 headline),
// even if the import form drifts — the mangled name must not appear at all.
const bareRefRe = /\bPropertyDescriptor_(\d+)\b/g;
const bareRefs = [...dts.matchAll(bareRefRe)].map((x) => x[0]);

const collisions = [...new Set([...renames, ...bareRefs])];

if (collisions.length > 0) {
    console.error(
        `  ✗ [collision-rename] the PUBLISHED dist/keyframes.d.ts carries value.js ` +
            `collision-rename(s): ${collisions.join(", ")}.\n` +
            `    KF-7 is UNFULFILLED — value.js still exports \`PropertyDescriptor\` un-renamed ` +
            `(collides with the ambient DOM global), so API-Extractor mangles it into kf's public\n` +
            `    type surface. FIX (upstream): value.js renames the export to a collision-free name ` +
            `(e.g. CSSPropertyDescriptor); kf then re-points its import + Map<…> types in the SAME\n` +
            `    motion (the adopt-event watch gates the re-point). See docs/tranches/T/KF-TO-VALUEJS-T.md.`,
    );
    console.error("\nproof:no-collision-rename — FAIL (born-RED tripwire; T_BORNRED_BACKLOG).");
    process.exit(1);
}

console.log(
    "  ✓ [collision-rename] no value.js collision-rename (PropertyDescriptor_N / X as X_N) in dist/keyframes.d.ts",
);
console.log("proof:no-collision-rename — PASS.");
