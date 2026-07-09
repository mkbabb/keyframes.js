#!/usr/bin/env node
/**
 * proof:single-writer — H.W1 S9.c / WV-W1-MED-4 (the mutation boundary).
 *
 * `createGlobalState` gives NO mutation boundary by itself — a plain global store
 * would let any consumer write `machine.activeScene = x` and reopen the
 * five-authority desync D12 root-causes. The keystone closes the boundary by
 * EXPORTING ONLY `dispatch()` + READONLY refs (status, activeScene, perScene): the
 * one mutation surface is the reducer-driven `dispatch()`, and the readonly refs
 * make a consumer-side write a TYPE error. This gate is the SOURCE-SHAPE belt
 * under that type guarantee: no file OUTSIDE the machine's own files assigns
 * `machine.activeScene` / `machine.status` (the scene axis + the playback axis —
 * the two facts the machine OWNS).
 *
 *   CLAUSE — no `*.activeScene` / `*.status` ASSIGNMENT outside the FSM core.
 *     Sweeps `demo/**` (the consumer surface). Matches an assignment to an
 *     `.activeScene` / `.status` property — direct (`m.activeScene = …`), through
 *     the ref (`m.activeScene.value = …`), or a destructured-ref escape
 *     (`const { activeScene } = machine; activeScene.value = …`). Allowlists the
 *     machine's OWN files (where the single writer legitimately lives).
 *
 *   THE ALLOWED-WRITER SET. The keystone SPLIT the pure core from the store along
 *   the proof:decomposition ceiling (core-api §1): `sceneMachine.ts` = the PURE
 *   `transition` reducer (returns NEW state, never mutates in place), and
 *   `useSceneMachine.ts` = the `createGlobalState` store that runs the reducer and
 *   writes the single `machine.value` ref. BOTH are the machine — both are
 *   allowlisted. (The store writes `machine.value = next` / `persisted.value`, the
 *   FUNCTIONAL whole-state swap — it never assigns `.activeScene`/`.status` in
 *   place either, so it would pass even un-allowlisted; the allowlist is the
 *   explicit boundary statement, not a carve-out for a mutation.)
 *
 *   BITE: reds the moment a consumer reaches for the OWNED axes directly — e.g.
 *     `machine.activeScene.value = "cube"` (the writable-surface escape the
 *     readonly type forbids) or the pre-W1 lattice's per-authority active-scene
 *     writes folded back in. GREEN on the keystone (the only mutation is
 *     `dispatch()`; the refs are readonly). Add a writable `activeScene`/`.status`
 *     assignment anywhere in `demo/**` outside the FSM core → reds.
 *
 * Static grep gate (no browser, no build). Mirrors the comment-blanking +
 * collectSources idioms in scripts/proof-decomposition.mjs. Re-runnable:
 *   `node scripts/proof-single-writer.mjs`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");

// The machine's OWN files — the single writer lives here (the pure reducer +
// the createGlobalState store it drives, SPLIT per core-api §1). Relative-POSIX
// paths so the match is platform-stable.
const ALLOWED_WRITERS = new Set([
    "demo/@/state/sceneMachine.ts",
    "demo/@/state/useSceneMachine.ts",
]);

const SKIP_DIR = new Set(["node_modules", "dist", ".git", "coverage"]);
const SOURCE_EXT = new Set([".ts", ".vue"]);

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};
const relPosix = (abs) => path.relative(REPO, abs).split(path.sep).join("/");

console.log("proof:single-writer — H.W1 (the mutation boundary: one writer for the owned axes)");

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

/**
 * Comment-blanker (block + line + HTML), newline-preserving — so a docstring that
 * NAMES `machine.activeScene = …` as the forbidden shape (this very wave's design
 * prose) can never red the gate; only real code does.
 */
const blankComments = (s) => {
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
};

if (!fs.existsSync(DEMO)) {
    console.error(`proof:single-writer — ERROR: demo/ not found at ${relPosix(DEMO)}`);
    process.exit(3);
}

// An ASSIGNMENT to an `.activeScene` / `.status` property: direct
// (`x.activeScene = …`) or through the ref (`x.activeScene.value = …`). The
// trailing `=` is a single `=` NOT followed by `=` or `>` (so `==`/`===`
// comparisons and `=>` arrows never match). A leading member chain is allowed so
// `machine.context.activeScene = …` is caught too.
const ASSIGN =
    /[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*\.(?:activeScene|status)(?:\.value)?\s*=(?![=>])/g;

// Destructured-ref escape: `const { activeScene } = machine` (or `status`) THEN a
// later `activeScene.value = …`. We detect the destructure binding, then a bare
// `<name>.value =` write in the same file.
const DESTRUCTURE =
    /\b(?:const|let|var)\s*\{[^}]*\b(activeScene|status)\b[^}]*\}\s*=\s*[A-Za-z_$][\w$]*\b/g;

const sources = collectSources(DEMO).sort();
let scanned = 0;
const offenders = [];

for (const abs of sources) {
    const rel = relPosix(abs);
    const isOwn = ALLOWED_WRITERS.has(rel);
    const src = blankComments(fs.readFileSync(abs, "utf8"));
    scanned++;

    // ── 1. direct / through-ref property assignment ──
    for (const m of src.matchAll(ASSIGN)) {
        if (isOwn) continue; // the machine's own files are the single writer
        const idx = m.index;
        const line = src.slice(0, idx).split("\n").length;
        offenders.push({ rel, line, text: m[0].trim() });
    }

    // ── 2. destructured-ref escape ──
    for (const dm of src.matchAll(DESTRUCTURE)) {
        if (isOwn) continue;
        const name = dm[1];
        // a subsequent `<name>.value = …` write (not a comparison/arrow)
        const escape = new RegExp(
            `\\b${name}\\.value\\s*=(?![=>])`,
            "g",
        );
        for (const em of src.matchAll(escape)) {
            const idx = em.index;
            const line = src.slice(0, idx).split("\n").length;
            offenders.push({
                rel,
                line,
                text: `${name}.value = … (destructured from the machine)`,
            });
        }
    }
}

if (offenders.length === 0) {
    ok(
        `no \`.activeScene\`/\`.status\` assignment in any of ${scanned} demo ` +
            `source files outside the FSM core ` +
            `(${[...ALLOWED_WRITERS].map((p) => p.split("/").pop()).join(" + ")})`,
    );
    ok("the only mutation surface is the exported dispatch(); the axes are readonly refs");
} else {
    for (const o of offenders) {
        fail(
            `${o.rel}:${o.line} assigns \`${o.text}\` — the active-scene/status ` +
                `axes are OWNED by the machine (readonly refs); a consumer-side ` +
                `write reopens the five-authority desync (D12). Route the mutation ` +
                `through \`machine.dispatch(event)\` (H.W1 S9.c / WV-W1-MED-4).`,
        );
    }
}

if (failures.length > 0) {
    console.error(
        `\nproof:single-writer — FAIL (${failures.length}): a file outside the FSM ` +
            `core writes the owned scene/playback axes.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:single-writer — PASS: the scene/status axes have exactly one writer (dispatch); the boundary holds (H.W1).",
);
