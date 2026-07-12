#!/usr/bin/env node
/**
 * proof:app-is-shell — S.D1 (the demo app/ partition · a23 Layout C).
 *
 * THE REAL app-shell gate — re-authored from the PHANTOM `proof:app-shell-thinness`
 * that R docs cited but never shipped (fold row 21; a23 F2). It is a re-runnable
 * STATIC instrument (import-graph walk + fs existence checks — no browser, no
 * build), mirroring the collectSources idiom of proof:scene-colocated.
 *
 * It is DIRECTIONAL — born-RED on the pre-D1 tree, reachable-to-GREEN only when
 * demo/app/ is honestly zoned (SD-1). Three falsifiable clauses, each BITES:
 *
 *   (i) NO MIS-HOME. No file under `demo/app/` is imported by EXACTLY ONE
 *       non-app area (a single-non-app-consumer file belongs IN that area, not
 *       the shell). An "area" is counted PER-SCENE (C-23): each `demo/scenes/
 *       <name>/`, plus `demo/` and `demo/playground/`, is one area; other
 *       `demo/app/` files (shell-internal) are NOT counted. Files imported by
 *       ZERO non-app areas (shell-private) or ≥2 non-app areas (legitimately
 *       cross-scene — the five `app/runtime/` recipes) are LEGAL. Born-RED today
 *       via `cubeTransformStore.ts` (lives in app/, imported by exactly one
 *       non-app area — `scenes/cube/`); greens when S3 evicts it → scenes/cube/.
 *
 *   (ii) NO STALE-DEPTH ESCAPE. Every RELATIVE import/dynamic-import specifier in
 *       every `demo/app/` source file resolves to an existing file on disk — so a
 *       move that deepens a file (root → scene/·transition/·runtime/) without the
 *       matching `../` depth bump surfaces HERE, not only at `tsc`. Catches the S4
 *       `scenes.ts` `../scenes/` → `../../scenes/` class by construction (the 16
 *       static + dynamic scene imports). Green on the current tree (it builds);
 *       a re-introduced stale `../scenes/` after the move reds it.
 *
 *   (iii) SHELL-NESS IS STRUCTURAL. The shell ROOT (`demo/app/`, non-recursive)
 *       holds ONLY the shell files (App.vue · main.ts · index.html) + the concern
 *       sub-zones (scene/ · transition/ · runtime/ · public/) — every composable/
 *       store/router file lives in a concern sub-zone, NOT loose at root. Measured
 *       by FILE MEMBERSHIP (concern grouping), NOT by line count (SD-7; T2
 *       corollary). App.vue's line count is an OBSERVED TRIPWIRE printed below,
 *       NOT a GREEN criterion — a cosmetic App.vue line-shrink cannot satisfy this
 *       gate, and a loose composable dumped back at app/ root reds it.
 *
 * Re-runnable: `node scripts/proof-app-is-shell.mjs`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const APP = path.join(DEMO, "app");
const SCENES = path.join(DEMO, "scenes");
const SHARED = path.join(DEMO, "@");
const PLAYGROUND = path.join(DEMO, "playground");

const SKIP_DIR = new Set(["dist", "node_modules", ".git", "coverage"]);
const SOURCE_EXT = new Set([".ts", ".vue"]);
// Extensions a specifier may resolve to (a bare specifier gets each appended).
const RESOLVE_EXT = [".ts", ".vue", ".css", ".js", ".mjs", ".json"];

// Clause (iii) — the honest shell-root membership (a23 Layout C). The root holds
// exactly these files + these concern sub-zones; anything else is a mis-home.
const ALLOWED_ROOT_FILES = new Set([
    "App.vue",
    "App.skeleton.vue",
    "main.ts",
    "index.html",
]);
// T.F3 — `dock/` (was `chrome/` — browser-jargon evicted) joins the concern
// sub-zones: the app's own glass-ui dock + @mbabb menu (ChromeDock.vue,
// MbabbMenu.vue), evicted from `@/components/dock/` because they are
// APP-private (a24 F3; imported by App.vue alone — they fail
// proof:shared-has-n-consumers as a single-external-area @/ module).
const ALLOWED_ROOT_DIRS = new Set(["scene", "transition", "runtime", "public", "dock"]);
// Skip-list for non-source droppings that are not a concern violation.
const IGNORE_ROOT_ENTRIES = new Set([".DS_Store"]);

const toPosix = (p) => p.split(path.sep).join("/");
const relPosix = (abs) => toPosix(path.relative(REPO, abs));

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

/**
 * Extract every module specifier a source file references:
 *   • `import … from "spec"` / `export … from "spec"`
 *   • bare `import "spec"`
 *   • dynamic `import("spec")`
 * Returns [{ spec, line }].
 */
function extractSpecifiers(src) {
    const out = [];
    const lines = src.split("\n");
    const FROM = /\bfrom\s*["']([^"']+)["']/;
    const BARE = /^\s*import\s*["']([^"']+)["']/;
    const DYNAMIC = /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;
    lines.forEach((line, i) => {
        const ln = i + 1;
        let m;
        if ((m = FROM.exec(line))) out.push({ spec: m[1], line: ln });
        else if ((m = BARE.exec(line))) out.push({ spec: m[1], line: ln });
        // dynamic imports can co-exist with the above / repeat on a line
        while ((m = DYNAMIC.exec(line)) !== null) {
            out.push({ spec: m[1], line: ln });
        }
    });
    return out;
}

/** Resolve an absolute base path to a real file (trying extensions + /index). */
function resolveOnDisk(base) {
    if (fs.existsSync(base) && fs.statSync(base).isFile()) return base;
    for (const ext of RESOLVE_EXT) {
        const p = base + ext;
        if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
    }
    for (const ext of RESOLVE_EXT) {
        const p = path.join(base, "index" + ext);
        if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
    }
    return null;
}

/**
 * Resolve a specifier to an absolute base path (no ext) if it targets a demo
 * source file, else null. Handles `@app/*` and relative `./`·`../`; other
 * aliases (`@components/*` etc.) and bare/package specifiers are NOT app-targets
 * for clause (i) but ARE decoded to a base so clause (ii) can existence-check
 * `@app/*` self-imports. Returns { base, isRelative }.
 */
function resolveSpecBase(spec, fileDir) {
    if (spec.startsWith("@app/")) {
        return { base: path.join(APP, spec.slice("@app/".length)), isRelative: false };
    }
    if (spec.startsWith("./") || spec.startsWith("../")) {
        return { base: path.resolve(fileDir, spec), isRelative: true };
    }
    return null; // package / other-alias specifier — not a filesystem edge we police
}

/** Per-scene / shared / playground area of an importer path (C-23), or null if app-internal. */
function areaOf(abs) {
    const rel = toPosix(path.relative(DEMO, abs));
    if (rel.startsWith("app/")) return null; // shell-internal — not counted
    let m;
    if ((m = /^scenes\/([^/]+)\//.exec(rel))) return `scenes/${m[1]}`;
    if (rel.startsWith("@/")) return "@";
    if (rel.startsWith("playground/")) return "playground";
    return `demo:${rel.split("/")[0]}`;
}

function main() {
    if (!fs.existsSync(APP)) {
        console.error("proof:app-is-shell — ERROR: demo/app/ not found.");
        process.exit(3);
    }

    console.log(
        "proof:app-is-shell — S.D1 (app/ partition · a23 Layout C · the REAL app-shell gate)",
    );

    const allDemo = collectSources(DEMO).sort();
    const appFiles = collectSources(APP).sort();
    const appFileSet = new Set(appFiles);

    // ── CLAUSE (i) — no mis-home ────────────────────────────────────────────
    {
        // For each app file, the set of distinct NON-APP areas that import it.
        const consumers = new Map(); // appAbs → Set<area>
        for (const importer of allDemo) {
            const dir = path.dirname(importer);
            const src = fs.readFileSync(importer, "utf8");
            for (const { spec } of extractSpecifiers(src)) {
                const decoded = resolveSpecBase(spec, dir);
                if (!decoded) continue;
                const resolved = resolveOnDisk(decoded.base);
                if (!resolved || !appFileSet.has(resolved)) continue;
                const area = areaOf(importer);
                if (area === null) continue; // app-internal importer — not counted
                if (!consumers.has(resolved)) consumers.set(resolved, new Set());
                consumers.get(resolved).add(area);
            }
        }
        const misHomed = [];
        for (const [appAbs, areas] of consumers) {
            if (areas.size === 1) {
                const [only] = areas;
                misHomed.push(
                    `${relPosix(appAbs)} is imported by EXACTLY ONE non-app area ` +
                        `(\`${only}\`) — it is single-consumer state and belongs IN ` +
                        `that area, not the shell`,
                );
            }
        }
        if (misHomed.length > 0) {
            failures.push(
                `[no-mis-home] ${misHomed.length} file(s) under demo/app/ are ` +
                    `single-non-app-consumer mis-homes (cross-area — ≥2 scenes, or ` +
                    `shell-private — may reside under app/):\n      ` +
                    misHomed.join("\n      "),
            );
        } else {
            console.log(
                "  ✓ [no-mis-home] no demo/app/ file is imported by exactly one " +
                    "non-app area (the five app/runtime/ recipes are ≥2-scene shared)",
            );
        }
    }

    // ── CLAUSE (ii) — no stale-depth escape ─────────────────────────────────
    {
        const dangling = [];
        for (const abs of appFiles) {
            const dir = path.dirname(abs);
            const src = fs.readFileSync(abs, "utf8");
            const hits = [];
            for (const { spec, line } of extractSpecifiers(src)) {
                const decoded = resolveSpecBase(spec, dir);
                if (!decoded || !decoded.isRelative) continue; // only relative edges
                if (!resolveOnDisk(decoded.base)) {
                    hits.push(`${line}: "${spec}" → does not resolve on disk`);
                }
            }
            if (hits.length > 0) {
                dangling.push(`${relPosix(abs)}\n        ` + hits.join("\n        "));
            }
        }
        if (dangling.length > 0) {
            failures.push(
                `[no-stale-depth] ${dangling.length} demo/app/ file(s) carry a ` +
                    `relative import that escapes into a stale depth (the missed ` +
                    `../scenes/ → ../../scenes/ depth-bump class):\n      ` +
                    dangling.join("\n      "),
            );
        } else {
            console.log(
                "  ✓ [no-stale-depth] every relative import under demo/app/ resolves " +
                    "on disk (no post-move depth-bump miss)",
            );
        }
    }

    // ── CLAUSE (iii) — shell-ness is structural (membership, NOT line count) ──
    {
        const strays = [];
        for (const e of fs.readdirSync(APP, { withFileTypes: true })) {
            if (IGNORE_ROOT_ENTRIES.has(e.name)) continue;
            if (e.isDirectory()) {
                if (!ALLOWED_ROOT_DIRS.has(e.name)) {
                    strays.push(
                        `demo/app/${e.name}/ is not a concern sub-zone ` +
                            `(allowed: ${[...ALLOWED_ROOT_DIRS].join(" · ")}/)`,
                    );
                }
            } else if (!ALLOWED_ROOT_FILES.has(e.name)) {
                strays.push(
                    `demo/app/${e.name} is a loose non-shell file at the app root ` +
                        `(shell root allows only ${[...ALLOWED_ROOT_FILES].join(" · ")}) ` +
                        `— it belongs in a concern sub-zone (scene/·transition/·runtime/)`,
                );
            }
        }
        if (strays.length > 0) {
            failures.push(
                `[shell-structural] the app root is not partitioned — ` +
                    `${strays.length} stray entr(ies) sit loose at demo/app/ ` +
                    `instead of in a concern sub-zone:\n      ` +
                    strays.join("\n      "),
            );
        } else {
            console.log(
                "  ✓ [shell-structural] demo/app/ root holds only the shell files + " +
                    "the scene/·transition/·runtime/·public/ sub-zones",
            );
        }
        // OBSERVED TRIPWIRE (NOT a GREEN criterion — SD-7/T2 corollary): App.vue's
        // line count is recorded for drift-watching only; it does not gate.
        const appVue = path.join(APP, "App.vue");
        if (fs.existsSync(appVue)) {
            const n = fs.readFileSync(appVue, "utf8").split("\n").length;
            console.log(
                `  · [observed tripwire] App.vue is ${n} lines (recorded for drift ` +
                    `only — clause (iii) is membership-based, NOT a line ceiling)`,
            );
        }
    }

    if (failures.length > 0) {
        console.error(
            "\nproof:app-is-shell — FAIL (demo/app/ is not honestly zoned as a shell):",
        );
        for (const f of failures) console.error("  ✗ " + f);
        process.exit(1);
    }

    console.log(
        "\nproof:app-is-shell — PASS: demo/app/ is an honest shell — no single-" +
            "consumer mis-home, no stale-depth relative import, and the root is the\n" +
            "shell files + the scene/·transition/·runtime/ concern sub-zones (a23 Layout C).",
    );
}

main();
