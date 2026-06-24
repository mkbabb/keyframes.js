#!/usr/bin/env node
/**
 * proof:boundary — the value.js static/dynamic boundary gate (inv α).
 *
 * The KF-B1 release carved keyframes along the value.js seam: the light
 * physics/interpolation engines (`SpringProgress`, `SmoothProgress`,
 * `NumericAnimation`, `ElementMorph`, the `Timeline` family, `RAFPlayback`,
 * the spring-stop helpers, and the `resolveEasing`/`toEasing` factories)
 * carry ZERO static import edge to `@mkbabb/value.js`; the heavy
 * CSS-parsing engine sits behind `loadAnimationEngine()`'s dynamic
 * `import("./engine")`.
 *
 * B.W2 widened the gate from a single spring-only entry (which left 5 of 7
 * light modules unproven — a static value.js edge in `numeric`/`smooth`/
 * `morph`/`timeline` that the spring graph did not reach passed GREEN) to
 * the FULL light surface, with four assertions:
 *
 *   1. PER-ENTRY NEGATIVE COVERAGE — every runtime value export on the
 *      package barrel is bundled as its own entry from SOURCE (re-running
 *      tree-shaking on the real module graph, never the pre-built dist),
 *      and each entry chunk's STATIC module set must contain 0 value.js
 *      modules and 0 `src/animation/engine.ts`.
 *   2. SELF-ENFORCING ENTRY SET — the entry list is PARSED from the
 *      barrel's `export { … } from` statements, so a new light export is
 *      proven automatically; it cannot drift behind the gate. A sanity
 *      floor asserts the parse found the known core (a silently-empty
 *      parse fails the gate, not passes it). A STRUCTURAL barrel invariant
 *      backs the parse: the barrel may hold NO direct runtime light export
 *      (`export const/function/class/let/var`) other than the dynamic
 *      boundary accessors (`loadAnimationEngine` + the L.W7 S1/S3
 *      `warmEngine`/`loadEngine`/`loadCompiler`/`loadIngest`) — so a light
 *      value authored inline on the barrel (which `export { … } from` parsing
 *      would never see) cannot drift unproven; it reddens the gate until
 *      re-expressed as a `export { … } from` re-export the entry derivation
 *      captures.
 *   3. DYNAMIC-CHUNK PRESENCE — bundling EACH dynamic-boundary accessor
 *      (`loadAnimationEngine` + `warmEngine`/`loadEngine`/`loadCompiler`/
 *      `loadIngest`) must emit the heavy engine as a NON-ENTRY dynamic chunk
 *      with NO static engine / value.js edge on the accessor's own entry: a
 *      build that drops the dynamic boundary (eager-importing the engine, or
 *      tree-shaking the accessor away) turns the gate red. Bundling each by
 *      name also enforces presence — gating an absent accessor fails the
 *      bundle (the born-RED bite of adding a name before the export).
 *   4. SOURCE-GREP COMPLEMENT — every SOURCE module that actually appears
 *      in a light entry's static graph (derived from assertion 1's real
 *      module sets, never a hand-maintained name list) must hold no static
 *      `@mkbabb/value.js` value-specifier — bare, named, re-export, OR
 *      subpath (`@mkbabb/value.js/…`) — catching the dead-but-armed import
 *      class (`void _probe`) and the bare side-effect `import` that
 *      tree-shaking removes from the bundle graph before assertion 1 can
 *      see it. The light/heavy split is the import truth itself, not a
 *      rename-fragile basename allowlist.
 *   4b. PARSE-THAT SOURCE-SCAN (W96, O.W16 §S1) — the acyclic-spine guard.
 *      The constellation spine is acyclic (parse-that → value.js → kf), so kf
 *      reaches parse-that ONLY transitively through value.js, never as a direct
 *      production dependency. This scans the FULL `src/animation/**` tree (the
 *      heavy surface too — `utils.ts` is heavy) for any direct
 *      `@mkbabb/parse-that` import/export specifier; one reddens the gate.
 *
 * value.js + parse-that are deliberately NOT externalized, so a
 * reintroduced STATIC edge bundles their source into the entry chunk and
 * turns the gate red. The negative test — add `import "@mkbabb/value.js"`
 * to any single light module — must fail this gate.
 *
 * A passing gate means: "no REACHABLE static value.js edge from any
 * barrel-exported light entry, no static heavy-engine edge, the dynamic
 * boundary intact, and no dormant static specifier in light source."
 */
import { rolldown } from "rolldown";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ANIM = path.join(REPO, "src/animation");
const ENTRY_SRC = path.join(ANIM, "index.ts");

// A module ID belongs to value.js when it lives under the value.js package.
const isValueJs = (id) =>
    /[\\/]node_modules[\\/]@mkbabb[\\/]value\.js[\\/]/.test(id) ||
    /[\\/]value\.js[\\/](?:dist|src)[\\/]/.test(id);

// The heavy engine module — must never appear as a STATIC input of a light entry.
const isHeavyEngine = (id) => /[\\/]animation[\\/]engine\.ts$/.test(id);

const rel = (id) =>
    id
        .replace(REPO + path.sep, "")
        .replace(/.*node_modules[\\/]/, "node_modules/");

/**
 * Does a source file hold a STATIC value.js value-specifier? Catches every
 * import/export shape that arms a runtime edge — bare side-effect, named,
 * default, re-export, `export *` — AND the subpath form
 * (`@mkbabb/value.js/dist/value.js`), so the grep is self-sufficient and not
 * contingent on value.js's exports-map staying subpath-free. `import type` /
 * `export type` are erased at build, so they're stripped first (no edge).
 */
function holdsValueJsSpecifier(src) {
    const stripped = src
        .replace(/\b(?:import|export)\s+type\s[^;]*;/g, "")
        // W97 allow-list (Q.WE2 S2): the `@mkbabb/value.js/math` subpath is a
        // VERIFIED-clean math leaf (the W97 `math-subpath-clean` clause bundles
        // its graph and asserts ZERO grammar/parse-that/engine modules). Blank
        // ONLY this exact specifier before the grep so a LIGHT module
        // (`internal/leaves.ts`) may re-export from it — the no-legacy externalize
        // the owner directs — while a grammar-pulling barrel/subpath edge still
        // reds. A NEW value.js subpath (not `/math`) is NOT allow-listed and reds.
        .replace(
            new RegExp(VALUEJS_MATH_SPEC_RE.source, "g"),
            (line) => " ".repeat(line.length),
        );
    // `@mkbabb/value.js` OR any subpath `@mkbabb/value.js/…`:
    const SPEC = String.raw`@mkbabb\/value\.js(?:\/[^"']*)?`;
    return (
        // `import X from "…"` / `export { X } from "…"` / `export * from "…"`
        new RegExp(
            String.raw`(?:^|\n)\s*(?:import|export)\b[^;'"]*from\s+["']${SPEC}["']`,
        ).test(stripped) ||
        // bare side-effect `import "…"` (no `from`)
        new RegExp(String.raw`(?:^|\n)\s*import\s+["']${SPEC}["']`).test(
            stripped,
        )
    );
}

// The W97-allow-listed verified-clean math subpath. The grep blanks a full
// import/export LINE that targets EXACTLY `@mkbabb/value.js/math` (not a longer
// subpath like `@mkbabb/value.js/mathx`) before assertion 4's source-scan. The
// `(?=["'])` lookahead pins the specifier END so `/math2` does not match.
const VALUEJS_MATH_SPEC_RE = new RegExp(
    String.raw`(?:^|\n)[^\n]*["']@mkbabb\/value\.js\/math(?=["'])["'][^\n]*`,
);

// The W97 allow-listed math module's package id (assertion 1 thread): the
// externalized math chunk lives under node_modules/@mkbabb/value.js/, so the
// `isValueJs` per-entry filter would flag it. We externalize the verified-clean
// subpath in the gate's OWN `bundleEntry` external so the chunk never enters a
// light entry's static module set — promoting "a value.js module that must be
// inlined-and-banned" to "a verified-clean runtime edge the gate externalizes."
const VALUEJS_MATH_EXTERNAL = "@mkbabb/value.js/math";

/**
 * The W96 parse-that source-scan (O.W16 §S1). The constellation spine is
 * acyclic — `parse-that → value.js → kf → glass-ui` — so kf reaches parse-that
 * ONLY transitively through value.js, NEVER as a direct production dependency.
 * The `@keyframes` grammar (and the `any` combinator over value.js's own
 * parsers) lives in value.js; kf consumes value.js's public entrypoints
 * (`parseCSSSubValue`, …), it does not re-compose value.js's parsers across the
 * realm boundary. A kf source module importing `@mkbabb/parse-that` directly
 * breaks the spine at the `package.json` level and papers the cross-realm
 * nominal-type mismatch with `as any` casts (the retired S9 workaround).
 *
 * Same shape as {@link holdsValueJsSpecifier}: every import/export edge that
 * arms a runtime parse-that dependency — bare side-effect, named, default,
 * re-export, subpath — with `import type`/`export type` stripped first (a
 * type-only edge is erased at build and carries no runtime dep). This scans the
 * FULL `src/animation/**` tree (NOT just the light surface): the parse-that
 * breach is a production-dep restoration that applies to heavy modules
 * (`utils.ts`) too — the heavy surface may reach VALUE.JS statically, but never
 * parse-that DIRECTLY.
 */
function holdsParseThatSpecifier(src) {
    const stripped = src.replace(/\b(?:import|export)\s+type\s[^;]*;/g, "");
    const SPEC = String.raw`@mkbabb\/parse-that(?:\/[^"']*)?`;
    return (
        new RegExp(
            String.raw`(?:^|\n)\s*(?:import|export)\b[^;'"]*from\s+["']${SPEC}["']`,
        ).test(stripped) ||
        new RegExp(String.raw`(?:^|\n)\s*import\s+["']${SPEC}["']`).test(
            stripped,
        )
    );
}

/**
 * Recursively collect every kf `.ts` SOURCE module under `dir` (the full
 * `src/animation/**` tree), skipping `node_modules`/`.git`/`dist`. The
 * parse-that scan (assertion 4b) runs over this set rather than the light-entry
 * static graph: `utils.ts` (the live S9 violator) is on the HEAVY surface,
 * absent from `lightSourceModules`, so a light-only scan would miss it.
 */
function collectAnimationSources(dir, acc = []) {
    for (const name of fs.readdirSync(dir)) {
        if (name === "node_modules" || name === ".git" || name === "dist") {
            continue;
        }
        const full = path.join(dir, name);
        if (fs.statSync(full).isDirectory()) {
            collectAnimationSources(full, acc);
        } else if (name.endsWith(".ts")) {
            acc.push(full);
        }
    }
    return acc;
}

/** Parse the barrel's runtime value exports — the light surface the gate proves. */
function parseLightExports() {
    const src = fs.readFileSync(ENTRY_SRC, "utf8");
    const names = [];
    // Match `export { ... } from "..."` INCLUDING multi-line blocks (the
    // formatter reflows long export lists), but NOT `export type { ... }`
    // (types carry no runtime edge). `[\s\S]*?` spans newlines.
    for (const m of src.matchAll(
        /(?:^|\n)\s*export\s*\{([\s\S]*?)\}\s*from\s*["'][^"']+["']/g,
    )) {
        // Skip a `export type { ... }` statement (the leading-keyword check):
        // the match starts at `export {`, so a `type` here is an INLINE
        // `export { type Foo, Bar }` — drop the type-prefixed names, keep
        // the runtime ones.
        for (const raw of m[1].split(",").map((s) => s.trim())) {
            if (!raw || /^type\s/.test(raw)) continue;
            // `Foo as Bar` exports the local name Foo; bundle by the local.
            names.push(raw.split(/\s+as\s+/)[0].trim());
        }
    }
    return names;
}

/**
 * The barrel's dynamic-boundary accessors — the ONLY direct runtime exports the
 * barrel may author inline. Each fires a `dynamic import("./…")` (never a static
 * value.js specifier), so each is proven by assertion 3 (its OWN entry holds no
 * static engine/value.js edge AND the heavy engine emits behind it as a dynamic
 * chunk), NOT by assertion 1's `export { … } from` entry derivation.
 *
 *   - `loadAnimationEngine` — the full heavy surface (backward-compat; B.W2).
 *   - `warmEngine`          — L.W7 S1: fire-and-forget memoized warm trigger.
 *   - `loadEngine`/`loadCompiler`/`loadIngest` — L.W7 S3: granular per-capability
 *     accessors sharing the memoized `loadAnimationEngine` substrate.
 *
 * Gating an ABSENT name here is the born-RED bite: assertion 3 bundles each by
 * name, and bundling a symbol the barrel does not export fails rolldown — so
 * adding a name to this list before the barrel exports it reddens the gate.
 */
const DYNAMIC_ACCESSORS = [
    "loadAnimationEngine",
    "warmEngine",
    "loadEngine",
    "loadCompiler",
    "loadIngest",
];

/**
 * The barrel's structural invariant: every LIGHT export is a `export { … }
 * from` re-export (which assertion 1 then bundles + proves). The ONLY permitted
 * direct runtime exports are the dynamic boundary accessors in
 * `DYNAMIC_ACCESSORS` (proven by assertion 3, not 1). Any OTHER direct light
 * export — `export const foo`, `export function`, `export class`,
 * `export let/var` — would be invisible to `parseLightExports` and silently
 * unproven, contradicting inv α's "a new light export is proven automatically."
 * Return the offending declarations.
 */
function strayDirectExports() {
    const src = fs
        .readFileSync(ENTRY_SRC, "utf8")
        // strip block + line comments so a commented example doesn't fire
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/(?:^|\n)\s*\/\/[^\n]*/g, "");
    const stray = [];
    for (const m of src.matchAll(
        /(?:^|\n)\s*export\s+(?:default\s+)?(const|let|var|function|class)\s+([A-Za-z0-9_$]+)/g,
    )) {
        if (DYNAMIC_ACCESSORS.includes(m[2])) continue; // the dynamic accessors
        stray.push(`export ${m[1]} ${m[2]}`);
    }
    return stray;
}

/** Bundle one named export off the barrel; return the rolldown output. */
async function bundleEntry(exportName, tmpName) {
    const tmp = path.join(REPO, tmpName);
    fs.writeFileSync(
        tmp,
        `import { ${exportName} } from ${JSON.stringify(ENTRY_SRC)};\nexport default ${exportName};\n`,
    );
    try {
        const bundle = await rolldown({
            input: tmp,
            // Only host-provided / unrelated externals. value.js + parse-that
            // stay NON-external so a reintroduced static edge bundles their
            // source into the entry chunk (where this gate catches it). The ONE
            // exception is the W97 verified-clean `@mkbabb/value.js/math` subpath
            // (Q.WE2 S2): it is externalized here too so the math chunk never
            // enters a light entry's static module set (assertion 1's `isValueJs`
            // per-entry filter would otherwise flag it). The grammar-pulling
            // barrel + every OTHER subpath stay NON-external — a reintroduced
            // grammar edge still reds.
            external: ["vue", "prettier", VALUEJS_MATH_EXTERNAL],
            treeshake: true,
            logLevel: "silent",
        });
        const { output } = await bundle.generate({ format: "es" });
        await bundle.close();
        return output;
    } finally {
        fs.rmSync(tmp, { force: true });
    }
}

/**
 * W97 `math-subpath-clean` (Q.WE2 S2 — the TRAP-resolution decision oracle).
 *
 * Bundle `@mkbabb/value.js/math` as its OWN rolldown entry (value.js NON-external
 * here, so its source is pulled in) and assert its STATIC module graph contains
 * ZERO CSS-grammar / parse-that / `engine`-equivalent modules. This is the
 * VERIFICATION behind the allow-list both `holdsValueJsSpecifier` (assertion 4)
 * and `bundleEntry` (assertion 1) thread: the subpath is permitted on the LIGHT
 * surface ONLY because its graph is PROVEN grammar-free, never assumed. A clause
 * that merely greps "does leaves.ts import ./math" would be the proxy mistake (it
 * greens on a subpath that secretly pulls grammar); this bundles the graph.
 *
 * Returns { ok, modules, bytes, grammar } — the probe numbers the decision JSON
 * records. `grammar` is the list of any grammar/parse-that/engine module in the
 * graph (empty ⇒ clean ⇒ the allow-list is legal).
 */
async function probeMathSubpathClean() {
    const tmp = path.join(REPO, ".proof-boundary-math-subpath.mjs");
    fs.writeFileSync(tmp, `export * from ${JSON.stringify(VALUEJS_MATH_EXTERNAL)};\n`);
    try {
        const bundle = await rolldown({
            input: tmp,
            external: ["vue", "prettier"], // value.js NON-external — pull the graph
            treeshake: true,
            logLevel: "silent",
        });
        const { output } = await bundle.generate({ format: "es" });
        await bundle.close();
        const entry = output.find((o) => o.type === "chunk" && o.isEntry);
        const ids = entry ? entry.moduleIds.filter((id) => id !== tmp) : [];
        // A grammar/parse-that/engine module would betray a hidden static edge.
        const grammar = ids.filter(
            (id) =>
                /parse-that/.test(id) ||
                /[\\/](?:grammars?|parsing)[\\/]/.test(id) ||
                /css-[a-z]+\.(?:bbnf|ts|js)/.test(id) ||
                /[\\/]engine\b/.test(id),
        );
        const bytes = output
            .filter((o) => o.type === "chunk")
            .reduce((a, c) => a + (c.code?.length ?? 0), 0);
        return {
            ok: grammar.length === 0,
            modules: ids.length,
            bytes,
            grammar: grammar.map(rel),
        };
    } finally {
        fs.rmSync(tmp, { force: true });
    }
}

async function main() {
    const failures = [];

    // ── W97 math-subpath-clean (Q.WE2 S2 — the leaves-externalize enabler) ──
    const w97 = await probeMathSubpathClean();
    console.log(
        `  W97 math-subpath-clean: ${VALUEJS_MATH_EXTERNAL} graph = ` +
            `${w97.modules} module(s), ${w97.bytes}B, ` +
            `${w97.grammar.length} grammar/parse-that/engine module(s) → ` +
            `${w97.ok ? "CLEAN (allow-listed on both assertions)" : "GRAMMAR-PULLING (allow-list illegal)"}`,
    );
    if (!w97.ok) {
        failures.push(
            `W97 math-subpath-clean: the ${VALUEJS_MATH_EXTERNAL} static graph ` +
                `pulls grammar/parse-that/engine module(s) — the subpath is NOT a ` +
                `clean math leaf and CANNOT be allow-listed on the LIGHT surface ` +
                `(the leaves-externalize must fall to the documented-keep arm):\n    ` +
                w97.grammar.join("\n    "),
        );
    }

    // ── 2. Self-enforcing entry set ────────────────────────────────────
    const lightExports = parseLightExports();
    const CORE = [
        "SpringProgress",
        "SmoothProgress",
        "NumericAnimation",
        "ElementMorph",
        "Timeline",
        "RAFPlayback",
        "resolveEasing",
        // L.W9 S5 KF-OSCILLATOR (W128) — the LIGHT periodic phase clock. A
        // frequency-driven phase ramp + a pure waveform shaper; value.js-free (no
        // CSS parsing, no rAF ownership — the caller drives the loop, mirroring
        // SmoothProgress/SpringProgress). Enumerating it in the CORE floor asserts
        // the barrel parse FINDS `Oscillator` as a LIGHT entry, so assertion 1
        // bundles its source graph + proves zero static value.js edge; assertion 4
        // source-greps its module. A future commit dropping the export (or moving
        // it behind the dynamic boundary) reds this floor — born-RED before the
        // class shipped, GREEN now the value.js-free entry is on the light surface.
        "Oscillator",
    ];
    for (const name of CORE) {
        if (!lightExports.includes(name)) {
            failures.push(
                `barrel parse did not find core light export "${name}" — ` +
                    `the gate's entry derivation is broken (a silent empty ` +
                    `parse must fail, not pass).`,
            );
        }
    }
    // Structural barrel invariant: no direct runtime light export can drift
    // past the `export { … } from` entry derivation. The one dynamic accessor
    // (`loadAnimationEngine`) is exempt — assertion 3 proves it.
    for (const decl of strayDirectExports()) {
        failures.push(
            `barrel holds a direct runtime export \`${decl}\` — only ` +
                `\`export { … } from\` re-exports (which assertion 1 bundles + ` +
                `proves) and the dynamic \`loadAnimationEngine\` accessor are ` +
                `allowed on the barrel. A direct light value is invisible to ` +
                `the entry derivation and silently unproven; re-express it as a ` +
                `re-export from its submodule.`,
        );
    }

    console.log("proof:boundary — light-surface static module graphs");
    console.log(
        `  light entries (parsed from the barrel): ${lightExports.length}`,
    );

    // ── 1. Per-entry negative coverage ─────────────────────────────────
    // The union of every SOURCE module that appears in a light entry's static
    // graph — this IS the light surface (the import truth), and assertion 4
    // source-greps exactly it (no hand-maintained heavy/light name list).
    const lightSourceModules = new Set();
    for (const name of lightExports) {
        const output = await bundleEntry(name, `.proof-${name}-entry.mjs`);
        const entry = output.find((o) => o.type === "chunk" && o.isEntry);
        if (!entry) {
            failures.push(`entry "${name}": no entry chunk emitted.`);
            continue;
        }
        for (const id of entry.moduleIds) {
            // Real repo source `.ts` only — skip the synthetic `.proof-*.mjs`
            // probe entry and any externalized package id.
            if (id.endsWith(".ts") && id.startsWith(REPO + path.sep)) {
                lightSourceModules.add(id);
            }
        }
        const valueJsStatic = entry.moduleIds.filter(isValueJs);
        const engineStatic = entry.moduleIds.filter(isHeavyEngine);
        const dynamicChunks = output.filter(
            (o) => o.type === "chunk" && !o.isEntry,
        );
        console.log(
            `  ${name.padEnd(22)} static:${String(entry.moduleIds.length).padStart(3)}  ` +
                `value.js:${valueJsStatic.length}  engine:${engineStatic.length}  ` +
                `dynamic-chunks:${dynamicChunks.length}`,
        );
        if (valueJsStatic.length > 0) {
            failures.push(
                `entry "${name}": value.js is statically reachable via:\n    ` +
                    valueJsStatic.map(rel).join("\n    "),
            );
        }
        if (engineStatic.length > 0) {
            failures.push(
                `entry "${name}": the heavy engine.ts is a STATIC input (must be dynamic-only) via:\n    ` +
                    engineStatic.map(rel).join("\n    "),
            );
        }
    }

    // ── 3. Dynamic-chunk presence (the boundary itself) ────────────────
    // Every dynamic-boundary accessor (`loadAnimationEngine` + the L.W7 S1/S3
    // `warmEngine`/`loadEngine`/`loadCompiler`/`loadIngest`) must, bundled as
    // its OWN entry: (a) hold NO static heavy-engine edge — it reaches the
    // engine only through `await import("./engine")`, never a static input; and
    // (b) emit the heavy engine as a NON-ENTRY dynamic chunk — a build that
    // drops the dynamic boundary (eager-import, or tree-shaking the accessor
    // away) reds here. `warmEngine` fires `void loadAnimationEngine()`, so its
    // bundle reaches the engine dynamically too; the same two-sided proof holds.
    // Bundling each BY NAME also enforces presence: gating an absent accessor
    // fails rolldown (the born-RED bite of adding a name before the export).
    for (const accessor of DYNAMIC_ACCESSORS) {
        const output = await bundleEntry(
            accessor,
            `.proof-boundary-${accessor}.mjs`,
        );
        const entry = output.find((o) => o.type === "chunk" && o.isEntry);
        const dynamicEngine = output.filter(
            (o) =>
                o.type === "chunk" &&
                !o.isEntry &&
                o.moduleIds.some(isHeavyEngine),
        );
        const entryEngine = entry ? entry.moduleIds.filter(isHeavyEngine) : [];
        const entryValueJs = entry ? entry.moduleIds.filter(isValueJs) : [];
        console.log(
            `  ${accessor.padEnd(22)} dynamic engine chunks: ${dynamicEngine.length}` +
                ` (static engine edges: ${entryEngine.length}, value.js: ${entryValueJs.length})`,
        );
        if (entryEngine.length > 0) {
            failures.push(
                `${accessor}: the heavy engine is a STATIC input of the ` +
                    "accessor entry — the dynamic boundary collapsed.",
            );
        }
        if (entryValueJs.length > 0) {
            failures.push(
                `${accessor}: value.js is a STATIC input of the accessor ` +
                    "entry — a dynamic accessor must name no static value.js " +
                    `specifier:\n    ${entryValueJs.map(rel).join("\n    ")}`,
            );
        }
        if (dynamicEngine.length === 0) {
            failures.push(
                `${accessor}: the heavy engine did NOT emit as a dynamic ` +
                    "chunk — the boundary was tree-shaken away or rewired; the " +
                    "accessor no longer reaches the engine.",
            );
        }
    }

    // ── 4. Source-grep complement (dormant static specifiers) ──────────
    {
        // The light surface is the import truth assertion 1 already computed —
        // every SOURCE module reachable from a light entry. Each must hold no
        // static value.js value-specifier, even a dead/tree-shaken one
        // (`void _probe`) or a bare side-effect `import "@mkbabb/value.js"`
        // that rolldown strips before assertion 1's count sees it. No
        // hand-maintained heavy/light name list: a module is "light" iff a
        // light entry actually reaches it, so a rename, a basename collision
        // (`internal/utils.ts` vs `utils.ts`), or a new module cannot drift.
        const offenders = [];
        for (const id of lightSourceModules) {
            if (holdsValueJsSpecifier(fs.readFileSync(id, "utf8"))) {
                offenders.push(rel(id));
            }
        }
        console.log(
            `  source-grep complement: ${lightSourceModules.size} light source` +
                ` module(s), ${offenders.length} dormant static specifier(s)`,
        );
        if (offenders.length > 0) {
            failures.push(
                `light-surface source holds a static "@mkbabb/value.js" ` +
                    `specifier (dead-but-armed):\n    ` +
                    offenders.join("\n    "),
            );
        }
    }

    // ── 4b. W96 parse-that source-scan (the acyclic-spine guard) ───────
    {
        // The constellation spine is acyclic — kf reaches parse-that ONLY
        // transitively through value.js, never as a direct production dep. This
        // scans the FULL `src/animation/**` tree (the heavy surface too, where
        // the S9 `utils.ts` violator lives): no kf source module may import
        // `@mkbabb/parse-that` directly. Derived from the real source tree (not
        // a hand-maintained name list) so a rename or a new module cannot drift.
        const parseThatOffenders = [];
        for (const id of collectAnimationSources(ANIM)) {
            if (holdsParseThatSpecifier(fs.readFileSync(id, "utf8"))) {
                parseThatOffenders.push(rel(id));
            }
        }
        console.log(
            `  parse-that source-scan: ${parseThatOffenders.length} direct ` +
                `@mkbabb/parse-that specifier(s) across src/animation/**`,
        );
        if (parseThatOffenders.length > 0) {
            failures.push(
                `kf source holds a DIRECT "@mkbabb/parse-that" specifier — the ` +
                    `acyclic spine (parse-that → value.js → kf) is broken; kf must ` +
                    `reach parse-that only transitively via value.js (consume a ` +
                    `value.js entrypoint, e.g. parseCSSSubValue):\n    ` +
                    parseThatOffenders.join("\n    "),
            );
        }
    }

    if (failures.length > 0) {
        console.error(
            "\nproof:boundary — FAIL (inv α — the boundary is broken):",
        );
        for (const f of failures) console.error("  ✗ " + f);
        console.error(
            "\n  A light module reintroduced a static value.js / engine edge (or the\n" +
                "  dynamic boundary collapsed). Light engines reach value.js ONLY through\n" +
                '  the dynamic `import("./engine")`. Move the offending import behind it.',
        );
        process.exit(1);
    }

    console.log(
        "\nproof:boundary — PASS: every barrel light entry is value.js-free, the\n" +
            "heavy engine rides only the dynamic boundary, and no dormant static\n" +
            "specifier sits in light source. inv α holds across the full light surface.",
    );
}

main().catch((err) => {
    console.error("proof:boundary — ERROR:", err);
    process.exit(3);
});
