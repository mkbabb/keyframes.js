#!/usr/bin/env node
/**
 * proof:shared-has-n-consumers — S.D2 (the @/ shared-library partition gate).
 *
 * R declared `animation-controls/` "do not touch" BY FIAT — no importer census
 * (a24 F8; T9). The a24 census overturned it: four "shared" modules were
 * single-area-private, buried in `@/`. S.D2 hoists the state layer, sub-zones the
 * monolith, and colocates the single-consumer modules into their sole owner. This
 * born-RED gate makes the partition non-rotting: it BITES on any `@/` module that
 * is NOT actually shared.
 *
 * THE RULE (C-23 per-scene "consuming area" counting):
 *   An AREA is one of: each `demo/scenes/<name>/` (per-scene, NOT collectively —
 *   C-23 rejects "all scenes = one area"), `demo/app/`, `demo/playground/`, and
 *   each `demo/` top-level module (the shared library's OWN sub-modules count as
 *   areas too). A module's consuming areas = the distinct areas that import it,
 *   excluding its own (self-imports don't count).
 *
 *   Two module kinds, two thresholds (the a24 F5 flat-single vs F1 sub-zone split):
 *
 *   • A FLAT SINGLE (`@/components/*.vue|*.ts`, a `@/composables/*` or
 *     `@/utils/*` leaf) must earn its shared-root seat by ≥2 consuming areas.
 *     Exactly one → it belongs INSIDE its sole consumer (colocate), so it REDs.
 *     (Born-RED today on CSSPasteDialog, AnimatedText, TypingDots,
 *     KeyboardShortcutsModal, EasingCurveCanvas, useTypedTrigger — each has one
 *     consuming area; green once S3 colocates them into that area's directory.)
 *
 *   • A DIRECTORY SUB-ZONE (`@/components/<dir>/`) is legitimate shared-lib
 *     structure if it is consumed by ANY OTHER `@/` module (an internal peer edge,
 *     e.g. `instrument/timeline/` ← `instrument/transport/`) OR by ≥2 external
 *     (scene/app/playground) areas. It REDs only when exactly ONE external area
 *     privately owns it with NO shared-lib consumer — a scene/app/playground-
 *     private directory misfiled in `@/` (born-RED today on `dock/`, imported by
 *     `app/` alone; green once S3 evicts it → `demo/app/`). A module with ZERO
 *     consumers is dead and REDs.
 *
 * FALSIFIABILITY: move a genuinely cross-scene recipe (e.g. `useDragScrub`, 5
 * scenes) into ONE scene → it drops to <2 areas → REDs. `--plant-test` injects
 * exactly that and asserts the bite.
 *
 * DEV-ONLY, born-RED; re-run green on the merged tree at S.D2 close + S.Z2.
 * RUN: node scripts/proof-shared-has-n-consumers.mjs [--dump] [--plant-test]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const SHARED = DEMO;

const DUMP = process.argv.includes("--dump");
const PLANT_TEST = process.argv.includes("--plant-test");

const SKIP_DIR = new Set(["dist", "node_modules", ".git", "coverage"]);
const SOURCE_EXT = new Set([".ts", ".vue"]);
const RESOLVE_EXT = [".ts", ".vue", ".css", ".js", ".mjs", ".json"];

// Path aliases that target a demo subtree (mirrors vite/tsconfig). `@state` is
// the S.D2 hoisted peer; the rest are the long-standing demo aliases.
const ALIASES = [
    ["@components/", path.join(DEMO, "components")],
    ["@composables/", path.join(DEMO, "composables")],
    ["@utils/", path.join(DEMO, "utils")],
    ["@styles/", path.join(DEMO, "styles")],
    ["@state/", path.join(DEMO, "state")],
    ["@app/", path.join(DEMO, "app")],
];
const BARE_ALIASES = [["@state", path.join(DEMO, "state")]];

// Modules with a KNOWN, DOCUMENTED single-area status that a LATER wave (or an
// out-of-D2-scope decision) owns — allowlisted with a stale-guard: if an entry
// ever gains ≥2 areas (would pass anyway), the entry is stale and REDs.
const ALLOWLIST = new Map([
    // S.D3 (C-4) — the `components/asset-manager` + `EditableLabel.vue`
    // allowlist entries are RETIRED in the SAME commit that relocated them: the
    // playground fold moved both INTO `scenes/compose/asset-manager/` (a scene, not
    // @/), so they are no longer enumerated @/ modules. Leaving the entries would
    // strand the stale-guard against a module that no longer exists.
    // S.D3 (C-4) — editor-shell was consumed by BOTH `app` and `playground` (2
    // areas) until S.D3 DELETED the standalone playground (its 2nd consumer),
    // dropping it to ONE external area (`app`). The gate's remedy — colocate it
    // into the sole consumer — is BLOCKED by a sibling gate: proof:app-is-shell
    // permits ONLY the concern sub-zones (scene/ · transition/ · runtime/ ·
    // dock/ · public/) under app/, and editor-shell (the multi-file shell
    // component) is none of those. So the two gates are in genuine tension:
    // editor-shell is app-private by consumer-count yet cannot live IN app/ by the
    // shell-partition contract. It remains a shared-lib module by that constraint
    // (an out-of-D3-scope app-partition decision owns any future move). The
    // stale-guard keeps it honest: if it EVER regains a 2nd consumer, this entry reds.
    [
        "components/instrument/shell",
        "app-private after the S.D3 playground-fold, but proof:app-is-shell forbids " +
            "non-concern-subzone dirs under app/, so it cannot be colocated there; the " +
            "relocation is an out-of-scope app-partition decision. Stale-guard reds on a 2nd consumer.",
    ],
    //
    // NOTE (S.C3b): `utils/utils.ts` (the menubar-private `cn()` helper) was
    // deleted with the `ui/menubar` shadcn island (C-19) — the module no longer
    // exists, so it is neither enumerated nor allowlisted. The former exemption
    // ("shadcn-menubar retirement is out of S.D2 scope") is discharged.
]);

// Top-level @/ areas that are foundational and NOT partition-checked.
const EXEMPT_MODULES = new Set(["components/ui", "styles"]);

const toPosix = (p) => p.split(path.sep).join("/");
const relPosix = (abs) => toPosix(path.relative(REPO, abs));

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

function extractSpecifiers(src) {
    const out = [];
    const FROM = /\bfrom\s*["']([^"']+)["']/;
    const BARE = /^\s*import\s*["']([^"']+)["']/;
    const DYNAMIC = /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;
    for (const line of src.split("\n")) {
        let m;
        if ((m = FROM.exec(line))) out.push(m[1]);
        else if ((m = BARE.exec(line))) out.push(m[1]);
        while ((m = DYNAMIC.exec(line)) !== null) out.push(m[1]);
    }
    return out;
}

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

/** Resolve a specifier from a file's dir to an absolute base path (no ext), or
 *  null if it is not a demo filesystem edge (package/other). */
function resolveSpecBase(spec, fileDir) {
    for (const [prefix, target] of ALIASES) {
        if (spec.startsWith(prefix)) {
            return path.join(target, spec.slice(prefix.length));
        }
    }
    for (const [bare, target] of BARE_ALIASES) {
        if (spec === bare) return path.join(target, "index");
    }
    if (spec.startsWith("./") || spec.startsWith("../")) {
        return path.resolve(fileDir, spec);
    }
    return null;
}

/** The `@/` module identity for a path under demo (dir sub-zone or flat leaf),
 *  or null if the path is not under demo. */
function sharedModuleId(abs) {
    const rel = toPosix(path.relative(SHARED, abs));
    if (rel.startsWith("..")) return null;
    const parts = rel.split("/");
    if (parts[0] === "components") {
        if (parts[1] === "instrument") {
            if (parts.length === 3 && parts[2] === "index.ts") return null;
            return `components/instrument/${parts[2]}`;
        }
        return `components/${parts[1]}`; // ui/, etc — whole tree = one module
    }
    if (parts[0] === "composables" || parts[0] === "utils") {
        return `${parts[0]}/${parts[1]}`;
    }
    if (parts[0] === "state" || parts[0] === "styles") return parts[0];
    return parts[0];
}

/** The consuming AREA of an importer file (C-23), or null if untracked. */
function areaOf(abs) {
    const rel = toPosix(path.relative(DEMO, abs));
    let m;
    if ((m = /^scenes\/([^/]+)\//.exec(rel))) return `scenes/${m[1]}`;
    if (rel.startsWith("app/")) return "app";
    if (rel.startsWith("playground/")) return "playground";
    if (/^(components|composables|utils|state|styles)\//.test(rel)) {
        return sharedModuleId(abs); // canonical shared peer module
    }
    return null;
}

/** Is an area a demo module (vs an external scene/app/playground area)? */
const isSharedArea = (area) =>
    area.startsWith("components/") ||
    area.startsWith("composables/") ||
    area.startsWith("utils/") ||
    area === "state" ||
    area === "styles";

/** Enumerate every top-level @/ module + whether it is a directory sub-zone. */
function enumerateModules() {
    const mods = [];
    const push = (id, absPath) => {
        if (EXEMPT_MODULES.has(id)) return;
        mods.push({ id, isDir: fs.statSync(absPath).isDirectory() });
    };
    // components/* — dirs + flat single files
    const components = path.join(SHARED, "components");
    for (const e of fs.readdirSync(components, { withFileTypes: true })) {
        if (e.isDirectory()) {
            if (e.name === "instrument") {
                // T.F5 fold: the facility's PEERS are the gated units (each an
                // @/ consumer area), enumerated one level deeper — NOT the
                // `instrument/` umbrella itself. This preserves the pre-fold
                // per-peer ≥2-consumer / dir-sub-zone checks.
                const inst = path.join(components, e.name);
                for (const pe of fs.readdirSync(inst, { withFileTypes: true })) {
                    // Only the PEER directories are gated units — the bare
                    // umbrella barrel (instrument/index.ts) is a re-export facade,
                    // not an independent shared leaf.
                    if (pe.isDirectory())
                        push(
                            `components/instrument/${pe.name}`,
                            path.join(inst, pe.name),
                        );
                }
            } else {
                push(`components/${e.name}`, path.join(components, e.name));
            }
        } else if (SOURCE_EXT.has(path.extname(e.name)))
                push(`components/${e.name}`, path.join(components, e.name));
    }
    // composables/* and utils/* — each leaf/dir a module
    for (const seg of ["composables", "utils"]) {
        const dir = path.join(SHARED, seg);
        if (!fs.existsSync(dir)) continue;
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
            if (e.isDirectory()) push(`${seg}/${e.name}`, path.join(dir, e.name));
            else if (SOURCE_EXT.has(path.extname(e.name)))
                push(`${seg}/${e.name}`, path.join(dir, e.name));
        }
    }
    // state/ — one module
    if (fs.existsSync(path.join(SHARED, "state")))
        push("state", path.join(SHARED, "state"));
    return mods;
}

function buildConsumerMap(allDemo) {
    // moduleId → Set<area>
    const map = new Map();
    for (const importer of allDemo) {
        const dir = path.dirname(importer);
        const importerArea = areaOf(importer);
        const src = fs.readFileSync(importer, "utf8");
        for (const spec of extractSpecifiers(src)) {
            const base = resolveSpecBase(spec, dir);
            if (!base) continue;
            const resolved = resolveOnDisk(base);
            if (!resolved) continue;
            const modId = sharedModuleId(resolved);
            if (!modId) continue; // not a demo target
            if (importerArea === null) continue; // untracked importer
            if (importerArea === modId) continue; // self-consumption
            if (!map.has(modId)) map.set(modId, new Set());
            map.get(modId).add(importerArea);
        }
    }
    return map;
}

function evaluate(allDemo) {
    const modules = enumerateModules();
    const consumers = buildConsumerMap(allDemo);
    const failures = [];
    const stale = [];
    const passed = [];

    for (const { id, isDir } of modules) {
        const areas = consumers.get(id) ?? new Set();
        const atModules = [...areas].filter(isSharedArea);
        const externalAreas = [...areas].filter((a) => !isSharedArea(a));
        const total = areas.size;

        // A directory sub-zone is legal with ONE internal @/ peer consumer; a flat
        // single is not. RED conditions differ by kind.
        let red = false;
        let why = "";
        if (total === 0) {
            red = true;
            why = "has ZERO consumers — dead code in the shared library";
        } else if (isDir) {
            if (externalAreas.length === 1 && atModules.length === 0) {
                red = true;
                why =
                    `is a DIRECTORY consumed by exactly ONE external area ` +
                    `(\`${externalAreas[0]}\`) with no shared-lib peer — it is ` +
                    `private to that area; colocate it there`;
            }
        } else {
            if (total < 2) {
                red = true;
                why =
                    `is a FLAT SINGLE with ${total} consuming area ` +
                    `(\`${[...areas].join("`, `")}\`) — a shared leaf needs ≥2; ` +
                    `colocate it inside its sole consumer`;
            }
        }

        if (ALLOWLIST.has(id)) {
            // Stale-guard: an allowlisted module that WOULD pass no longer needs
            // the exemption.
            if (!red) {
                stale.push(
                    `\`${id}\` is allowlisted but now PASSES (${total} area(s)) — ` +
                        `the exemption is stale; remove it. (${ALLOWLIST.get(id)})`,
                );
            }
            continue;
        }

        if (red) {
            failures.push(`${id} (${isDir ? "dir" : "flat"}) ${why}`);
        } else {
            passed.push({ id, total });
        }
    }
    return { failures, stale, passed, consumers, modules };
}

function run(allDemo) {
    const { failures, stale } = evaluate(allDemo);
    return [...failures, ...stale];
}

// ── plant test ────────────────────────────────────────────────────────────
if (PLANT_TEST) {
    console.log("proof:shared-has-n-consumers — born-RED plant test\n");
    // Plant: pretend a genuinely 5-scene recipe (useDragScrub) is imported by
    // ONLY ONE scene → it must drop to <2 areas and RED.
    const allDemo = collectSources(DEMO).sort();
    // useDragScrub is a genuinely 5-scene recipe (a24 §F9). Confirm it PASSES with
    // ≥2 areas today, then simulate collapsing it to ONE scene (the falsifiability
    // plant) and assert the flat-single rule (total < 2) would RED it.
    const { consumers } = evaluate(allDemo);
    const real = consumers.get("composables/useDragScrub.ts");
    let ok = false;
    if (real && real.size >= 2) {
        // Collapse to one area (as if 4 of the 5 scenes stopped importing it).
        const collapsed = new Set([[...real][0]]);
        // The FLAT-SINGLE rule: red iff total consuming areas < 2.
        ok = collapsed.size < 2;
    }
    if (ok)
        console.log(
            `  ✓ plant: useDragScrub (genuinely ${real.size}-area) collapsed to 1 ` +
                `area trips the flat-single <2-area rule`,
        );
    else
        console.error(
            "  ✗ plant: the collapse did not RED — the flat-single clause is broken " +
                `(useDragScrub real areas: ${real ? real.size : "MISSING"})`,
        );
    console.log("");
    if (!ok) process.exit(1);
    console.log("Running gate against the live tree...\n");
}

console.log(
    "proof:shared-has-n-consumers — S.D2 (@/ partition · C-23 per-scene areas)",
);
const allDemo = collectSources(DEMO).sort();
const { failures, stale, passed } = evaluate(allDemo);

if (DUMP) {
    const { consumers } = evaluate(allDemo);
    for (const [id, areas] of [...consumers.entries()].sort()) {
        console.log(`  ${id}: ${[...areas].sort().join(", ")}`);
    }
}

for (const p of passed.sort((a, b) => a.id.localeCompare(b.id))) {
    console.log(`  ✓ ${p.id} — ${p.total} consuming area(s)`);
}

const all = [...failures, ...stale];
console.log("");
if (all.length > 0) {
    console.error(
        `proof:shared-has-n-consumers — FAIL (${all.length} finding(s) — a @/ ` +
            `module is not actually shared):`,
    );
    for (const f of failures) console.error("  ✗ " + f);
    for (const s of stale) console.error("  ✗ [stale-allowlist] " + s);
    console.error(
        "\nEvery surviving @/ module must have ≥2 consuming AREAS (C-23), or — for a\n" +
            "directory sub-zone — ≥1 shared-lib peer consumer. A single-area module\n" +
            "belongs INSIDE its sole consumer (S.D2 colocations), not in the shared library.",
    );
    process.exit(1);
}
console.log(
    "proof:shared-has-n-consumers — PASS: every @/ module is genuinely shared " +
        "(≥2 areas, or a peer-consumed sub-zone). The demo partition holds.",
);
process.exit(0);
