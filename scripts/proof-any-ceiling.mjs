#!/usr/bin/env node
/**
 * proof:any-ceiling — T.F23(b) (the demo `any`-count RATCHET).
 *
 * THE DEBT. The demo shares `src`'s `strict` / `noUncheckedIndexedAccess`
 * tsconfig posture but never had `src`'s `any`-sweep: `demo/` carries a cluster of
 * bare `: any` / `as any` / `<any>` / `any[]` / `Record<string, any>` — the
 * store/composable/keyframes-editor boundaries — vs. a near-zero count in `src`.
 * The AGGRESSIVE-PURGE charter (T.F23) does NOT sweep them this batch (the ~100
 * cluster is entangled with the facility-lane files); instead it installs a
 * RATCHET so the count can only FALL, never rise — a fresh un-typed `any` REDs
 * from t=0, and the eventual sweep lowers CEILING toward zero.
 *
 * THE MEASURE (single-sourced with the wave doc's authoritative figure). The
 * count is the number of LINES under `demo/` matching the SAME extended-regex the
 * T.F23(b) charter cites verbatim:
 *   :\s*any\b | as any\b | <any> | any\[\] | Record<string,\s*any>
 * counted the way `grep -rnE … demo | wc -l` counts it — matching LINES, over
 * EVERY file under `demo/` (not just `.ts`/`.vue`; the charter's grep is
 * extension-agnostic, so this gate is too — a `Record<string, any>` smuggled into
 * a `.css`/`.json`/`.md` still counts). node_modules/dist are never under demo/.
 *
 * THE RATCHET. `CEILING` is the count at authoring time (T.F23(b): 109 on the
 * post-excision tree; ratcheted to 103 at batch ⑩ when the scene/app transform
 * seams adopted the library's own `Vars` contract type + the dock icon/matrix
 * slider seams were typed). The gate REDs if:
 *   · the live count EXCEEDS CEILING (a NEW `any` — type it, or if it is a
 *     genuinely-dynamic seam, lower nothing and justify inline then RAISE nothing:
 *     the ceiling is a one-way ratchet, so a real new dynamic seam must be paid
 *     for by removing an `any` elsewhere), OR
 *   · the live count is STRICTLY BELOW CEILING (the ratchet slipped: a sweep
 *     lowered the real count but left CEILING stale — LOWER CEILING to the new
 *     count in the same commit so the ratchet stays tight).
 * The equality requirement is what makes it a true ratchet (the engine
 * cycle-count / known-violations precedent), not a loose upper bound that lets the
 * count silently drift back up under a stale ceiling.
 *
 * CI posture: HARD — a structural, device-independent line-count oracle.
 *
 * RUN: node scripts/proof-any-ceiling.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");

// The one-way ratchet. LOWER this (never raise) as the post-facility sweep types
// the cluster; the gate REDs if the live count drifts off this number in EITHER
// direction (above = a new `any`; below = a stale ceiling after a sweep).
const CEILING = 102;

// The charter's verbatim extended-regex (any ONE alternative on a line counts the
// line once — LINE counting, matching `grep -rnE … | wc -l`).
const ANY_RE = /:\s*any\b|as any\b|<any>|any\[\]|Record<string,\s*any>/;

function collect(dir) {
    const out = [];
    (function walk(d) {
        for (const e of fs.readdirSync(d, { withFileTypes: true })) {
            if (e.name === "node_modules" || e.name === "dist") continue;
            const p = path.join(d, e.name);
            if (e.isDirectory()) walk(p);
            else out.push(p);
        }
    })(dir);
    return out;
}

let count = 0;
const perFile = [];
for (const f of collect(DEMO)) {
    let src;
    try {
        src = fs.readFileSync(f, "utf8");
    } catch {
        continue; // unreadable/binary — skip (grep would skip binary too)
    }
    let n = 0;
    for (const line of src.split("\n")) if (ANY_RE.test(line)) n++;
    if (n > 0) {
        count += n;
        perFile.push([path.relative(REPO, f), n]);
    }
}

perFile.sort((a, b) => b[1] - a[1]);

if (count > CEILING) {
    console.error(
        `proof:any-ceiling — FAIL: demo/ carries ${count} \`any\` line(s), ABOVE the ` +
            `ceiling of ${CEILING}. A NEW \`any\` was introduced. Type it (the ` +
            `store/composable/keyframes-editor boundaries are the cluster), or — if it is a ` +
            `genuinely-dynamic seam — pay for it by removing an \`any\` elsewhere: the ceiling ` +
            `is a one-way ratchet, it never rises.`,
    );
    console.error("  top contributors:");
    for (const [rel, n] of perFile.slice(0, 12))
        console.error(`    ${n}\t${rel}`);
    process.exit(1);
}

if (count < CEILING) {
    console.error(
        `proof:any-ceiling — FAIL: demo/ carries ${count} \`any\` line(s), BELOW the ` +
            `ceiling of ${CEILING} — the ratchet slipped. A sweep lowered the real count but ` +
            `left CEILING stale. LOWER \`const CEILING\` to ${count} in ` +
            `scripts/proof-any-ceiling.mjs (same commit) so the ratchet stays tight.`,
    );
    process.exit(1);
}

console.log(
    `proof:any-ceiling — PASS: demo/ carries exactly ${count} \`any\` line(s), AT the ` +
        `ratchet ceiling of ${CEILING}. The count may only fall; a fresh \`any\` REDs.`,
);
process.exit(0);
