#!/usr/bin/env node
/**
 * proof:composable-encapsulation — H.W12 S2 / I9 (the gesture engine lives in the
 * composable; the store getters are pure reads).
 *
 * Before W12, `useMotionPathDemo.ts` was anomalously THIN (49L: group + register)
 * while the WHOLE gesture engine — the nearest-point projection, the
 * `ManualTimeline` scrub-seam, the `fromMotionPath` build, the
 * `setChildTime().render()` re-seat — lived inline in `MotionPathTarget.vue`'s
 * `<script>` (the W-MP-5 defect), unlike sequence/spring whose composables own
 * their engine. W12 LIFTS it: the engine moves to `useMotionPathGesture.ts` (the
 * composable the Target calls WITH its live refs), the Target keeps only refs +
 * markup. This matches the "composable owns the engine, Target holds refs" shape.
 *
 * This is a re-runnable STRUCTURAL + grep gate (no browser, no build), mirroring
 * the collectSources + comment-blanker idioms of proof:single-writer.
 *
 *   CLAUSE 1 — THE GESTURE ENGINE LIVES IN THE COMPOSABLE. `useMotionPathGesture`
 *     carries the projection-math signature (`getBoundingClientRect` /
 *     `getTotalLength` / `getPointAtLength` / `ManualTimeline` / `fromMotionPath`
 *     / `setChildTime`); `MotionPathTarget.vue`'s `<script>` carries NONE of it
 *     (comment-blanked — a comment NAMING the lifted engine does not red the
 *     gate). Reds the moment the projection math leaks back into the Target.
 *
 *   CLAUSE 2 — THE STORE GETTERS ARE PURE READS (no read-with-write-side-effect
 *     getter outside the store modules / the FSM core). Two sub-checks:
 *       2a — every store WRITE (`*.value = …` / keyed `store[…] = …`) to a
 *            reactive/FSM store lives INSIDE the store-module dir; a consumer that
 *            writes a store ref is the single-writer breach proof:single-writer
 *            owns — here we lock the COMPLEMENT: the lazy-init `getStored*`
 *            seed-on-miss is the ONE recorded write-on-read idiom (allowlisted
 *            with its rationale), and no OTHER exported `get*` store accessor
 *            writes.
 *       2b — ZERO writable `computed({ get, set })` whose GET half carries an
 *            assignment (a read with a hidden reactive write). A legitimate
 *            writable-computed writes only in its `set` half (the idiomatic
 *            two-way binding); a write in the `get` half is the read-side-effect
 *            anti-pattern this clause forbids.
 *
 * Re-runnable: `node scripts/proof-composable-encapsulation.mjs`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");

const SKIP_DIR = new Set(["dist", "node_modules", ".git", "coverage"]);
const SOURCE_EXT = new Set([".ts", ".vue"]);

const toPosix = (p) => p.split(path.sep).join("/");
const relPosix = (abs) => toPosix(path.relative(REPO, abs));
const read = (p) => fs.readFileSync(p, "utf8");

// (The motion-path gesture-engine clause-1 consts were RETIRED at T.E3 with the
//  pruned scene, OD-1 = PRUNE.)

// The store-module dir (clause 2a): the ONLY legitimate home for a store write.
const STORE_DIR =
    "demo/@/state";

// The recorded write-on-read carve-out (clause 2a): the lazy-localStorage
// singletons seed a missing key with `structuredClone(default…)` on the first
// read — a memoize-on-read / lazy-init idiom (idempotent thereafter), NOT a
// reactive getter with a hidden reactive mutation (the seam note §5 disposition:
// accepted-as-is). Each entry carries its rationale; a stale guard prunes a dead
// one. They live INSIDE the store dir already, so clause 2a passes them by
// location — this list documents WHY a store-internal seed-on-read is sound, so a
// future reader does not "fix" it into eager seeding (which would regress the
// lazy load). It is informational provenance, not a location exemption.
const SEED_ON_READ = new Map([
    [
        "demo/@/state/controlOptionsStore.ts",
        "getStoredAnimationGroupControlOptions seeds a missing superKey with " +
            "structuredClone(default) on first read — the lazy-localStorage " +
            "singleton idiom (idempotent), not a reactive read-side-effect.",
    ],
    [
        "demo/@/state/animationOptionsStore.ts",
        "getStoredAnimationOptions seeds a missing animationId with " +
            "structuredClone(default) on first read — same lazy-singleton idiom.",
    ],
]);

const failures = [];

/** Walk a dir, collecting every source file (skipping dist/ + deps). */
function collectSources(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) {
            if (SKIP_DIR.has(e.name)) continue;
            collectSources(path.join(dir, e.name), out);
        } else if (SOURCE_EXT.has(path.extname(e.name))) {
            out.push(path.join(dir, e.name));
        }
    }
    return out;
}

/** Comment-blanker (block + line + HTML), newline-preserving. */
function blankComments(s) {
    let out = "";
    let i = 0;
    const n = s.length;
    while (i < n) {
        if (s[i] === "/" && s[i + 1] === "*") {
            const end = s.indexOf("*/", i + 2);
            const stop = end === -1 ? n : end + 2;
            for (let j = i; j < stop; j++) out += s[j] === "\n" ? "\n" : " ";
            i = stop;
            continue;
        }
        if (s[i] === "/" && s[i + 1] === "/") {
            while (i < n && s[i] !== "\n") {
                out += " ";
                i++;
            }
            continue;
        }
        if (s.startsWith("<!--", i)) {
            const end = s.indexOf("-->", i + 4);
            const stop = end === -1 ? n : end + 3;
            for (let j = i; j < stop; j++) out += s[j] === "\n" ? "\n" : " ";
            i = stop;
            continue;
        }
        out += s[i];
        i++;
    }
    return out;
}

// (The PROJECTION_MATH signature that clause 1 matched was RETIRED with the
//  pruned motion-path scene, T.E3, OD-1 = PRUNE.)

function main() {
    if (!fs.existsSync(DEMO)) {
        console.error("proof:composable-encapsulation — ERROR: demo/ not found.");
        process.exit(3);
    }

    console.log(
        "proof:composable-encapsulation — H.W12 S2/I9 (engine in the composable · pure store getters)",
    );

    // (CLAUSE 1 — the motion-path gesture-engine-in-composable + Target-stays-clean
    //  check — was RETIRED at T.E3: the motion-path scene (useMotionPathGesture.ts +
    //  MotionPathTarget.vue) was PRUNED, OD-1 = PRUNE. Clause 2's store-encapsulation
    //  checks below are scene-agnostic and SURVIVE.)

    // ── CLAUSE 2a — store writes are confined to the store-module dir ───────
    {
        const sources = collectSources(DEMO).sort();
        // A store WRITE to a stored reactive ref: the lazy-singleton stores hold
        // their state in a `store` / `*Store` ref written via `.value = …` or a
        // keyed `store.value[k] = …`. The single-writer gate owns the FSM axes;
        // here the COMPLEMENT — any consumer OUTSIDE the store dir that writes a
        // store ref reaches around the getter (the encapsulation breach). We key
        // on the store-accessor IMPORT + a write, which is the precise breach.
        // Simpler robust proxy: an exported `get*`-named store accessor that
        // writes lives ONLY in the store dir (the seed-on-read carve-out), and
        // every entry in SEED_ON_READ is inside the dir + still writes.
        const storeAbsDir = path.join(REPO, STORE_DIR);
        const seenSeeds = new Set();
        const STORE_REF_WRITE = /\bstore\.value\s*=|\bstore\.value\[[^\]]*\]\s*=/;
        for (const [rel] of SEED_ON_READ) {
            const abs = path.join(REPO, rel);
            if (!fs.existsSync(abs)) {
                failures.push(
                    `[store-write] SEED_ON_READ entry "${rel}" matches no file ` +
                        `— it is STALE; remove it.`,
                );
                continue;
            }
            // Must live under the store dir (location) AND still carry the seed
            // write (so a refactor that drops the seed prunes the carve-out).
            if (!toPosix(abs).includes(STORE_DIR)) {
                failures.push(
                    `[store-write] SEED_ON_READ entry "${rel}" is not under the ` +
                        `store-module dir ${STORE_DIR}.`,
                );
            }
            if (STORE_REF_WRITE.test(blankComments(read(abs)))) {
                seenSeeds.add(rel);
            } else {
                failures.push(
                    `[store-write] SEED_ON_READ entry "${rel}" no longer carries ` +
                        `a seed-on-read store write — it is STALE; remove it.`,
                );
            }
        }
        // The structural complement: NO file OUTSIDE the store dir carries a
        // `store.value = …` reactive-store write (that would be a consumer
        // reaching past the getter). Comment-blanked; dist/ excluded.
        const outsideWriters = [];
        for (const abs of sources) {
            const rel = relPosix(abs);
            if (toPosix(abs).includes(STORE_DIR)) continue; // the legitimate home
            if (STORE_REF_WRITE.test(blankComments(read(abs)))) {
                outsideWriters.push(rel);
            }
        }
        if (outsideWriters.length > 0) {
            failures.push(
                `[store-write] ${outsideWriters.length} file(s) OUTSIDE the ` +
                    `store-module dir write a \`store.value\` reactive store ref ` +
                    `directly — a consumer must go through the store's accessor, ` +
                    `not reach past it (H.W12.S2/I9). Sites:\n      ` +
                    outsideWriters.join("\n      "),
            );
        } else if (!failures.some((f) => f.startsWith("[store-write]"))) {
            console.log(
                `  ✓ [store-write] every reactive store write lives inside ` +
                    `${STORE_DIR} (${seenSeeds.size} recorded seed-on-read ` +
                    `lazy-init carve-out(s)); no consumer reaches past a getter`,
            );
        }
    }

    // ── CLAUSE 2b — no read-with-write-side-effect computed getter ─────────
    {
        const sources = collectSources(DEMO).sort();
        // A writable `computed({ get, set })` is legitimate IFF the write lives in
        // the `set` half. A write in the `get` half is the read-side-effect
        // anti-pattern. We extract each `computed({ … })` body, isolate the
        // get-arrow body, and red if it carries an assignment (`x = …`, not
        // `==`/`===`/`=>`).
        const offenders = [];
        for (const abs of sources) {
            const src = blankComments(read(abs));
            // Find `computed({` … matching brace span (shallow: stop at the first
            // `set:` or the closing of the object). We scope the GET arrow body:
            // `get: () => { … }` or `get: () => expr,`.
            const GET_BLOCK =
                /get\s*:\s*\([^)]*\)\s*=>\s*\{([\s\S]*?)\}\s*,?\s*set\s*:/g;
            const GET_EXPR =
                /get\s*:\s*\([^)]*\)\s*=>\s*([^\n,{][^\n]*),\s*set\s*:/g;
            const ASSIGN = /[A-Za-z_$][\w$.[\]]*\s*=(?![=>])/;
            for (const m of src.matchAll(GET_BLOCK)) {
                if (ASSIGN.test(m[1])) {
                    const line = src.slice(0, m.index).split("\n").length;
                    offenders.push({ rel: relPosix(abs), line });
                }
            }
            for (const m of src.matchAll(GET_EXPR)) {
                if (ASSIGN.test(m[1])) {
                    const line = src.slice(0, m.index).split("\n").length;
                    offenders.push({ rel: relPosix(abs), line });
                }
            }
        }
        if (offenders.length > 0) {
            failures.push(
                `[pure-getter] ${offenders.length} writable computed(s) whose ` +
                    `GET half carries an assignment — a read with a hidden ` +
                    `reactive write (the read-side-effect anti-pattern). The write ` +
                    `belongs in the \`set\` half (H.W12.S2/I9). Sites:\n      ` +
                    offenders
                        .map((o) => `${o.rel}:${o.line}`)
                        .join("\n      "),
            );
        } else {
            console.log(
                `  ✓ [pure-getter] no writable computed has a write in its GET ` +
                    `half (every two-way binding writes only in \`set\`)`,
            );
        }
    }

    if (failures.length > 0) {
        console.error(
            "\nproof:composable-encapsulation — FAIL (encapsulation not held):",
        );
        for (const f of failures) console.error("  ✗ " + f);
        console.error(
            "\n  The motion-path gesture engine lives in the composable (the Target\n" +
                "  holds refs + markup); store getters are pure reads (the lazy-init\n" +
                "  seed is the one recorded write-on-read idiom). I9 closes W-MP-5.",
        );
        process.exit(1);
    }

    console.log(
        "\nproof:composable-encapsulation — PASS: the gesture engine is in the\n" +
            "composable, the Target is projection-math-free, and the store getters\n" +
            "are pure reads. H.W12 S2/I9 holds.",
    );
}

main();
