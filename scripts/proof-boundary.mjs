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
 *      parse fails the gate, not passes it).
 *   3. DYNAMIC-CHUNK PRESENCE — bundling `loadAnimationEngine` must emit
 *      the heavy engine as a NON-ENTRY dynamic chunk: a build that drops
 *      the dynamic boundary (eager-importing the engine, or tree-shaking
 *      the accessor away) turns the gate red.
 *   4. SOURCE-GREP COMPLEMENT — the light modules' SOURCE files must hold
 *      no static `from "@mkbabb/value.js"` specifier at all, catching the
 *      dead-but-armed import class (`void _probe`) that tree-shaking
 *      removes from the bundle graph before assertion 1 can see it.
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

/** Parse the barrel's runtime value exports — the light surface the gate proves. */
function parseLightExports() {
    const src = fs.readFileSync(ENTRY_SRC, "utf8");
    const names = [];
    for (const m of src.matchAll(/^export \{ ([^}]+) \} from "[^"]+";/gm)) {
        for (const name of m[1].split(",").map((s) => s.trim())) {
            if (name) names.push(name);
        }
    }
    return names;
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
            // source into the entry chunk (where this gate catches it).
            external: ["vue", "prettier"],
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

async function main() {
    const failures = [];

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

    console.log("proof:boundary — light-surface static module graphs");
    console.log(
        `  light entries (parsed from the barrel): ${lightExports.length}`,
    );

    // ── 1. Per-entry negative coverage ─────────────────────────────────
    for (const name of lightExports) {
        const output = await bundleEntry(name, `.proof-${name}-entry.mjs`);
        const entry = output.find((o) => o.type === "chunk" && o.isEntry);
        if (!entry) {
            failures.push(`entry "${name}": no entry chunk emitted.`);
            continue;
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
    {
        const output = await bundleEntry(
            "loadAnimationEngine",
            ".proof-boundary-entry.mjs",
        );
        const entry = output.find((o) => o.type === "chunk" && o.isEntry);
        const dynamicEngine = output.filter(
            (o) =>
                o.type === "chunk" &&
                !o.isEntry &&
                o.moduleIds.some(isHeavyEngine),
        );
        const entryEngine = entry
            ? entry.moduleIds.filter(isHeavyEngine)
            : [];
        console.log(
            `  loadAnimationEngine    dynamic engine chunks: ${dynamicEngine.length}` +
                ` (static engine edges: ${entryEngine.length})`,
        );
        if (entryEngine.length > 0) {
            failures.push(
                "loadAnimationEngine: the heavy engine is a STATIC input of " +
                    "the accessor entry — the dynamic boundary collapsed.",
            );
        }
        if (dynamicEngine.length === 0) {
            failures.push(
                "loadAnimationEngine: the heavy engine did NOT emit as a " +
                    "dynamic chunk — the boundary was tree-shaken away or " +
                    "rewired; the accessor no longer reaches the engine.",
            );
        }
    }

    // ── 4. Source-grep complement (dormant static specifiers) ──────────
    {
        // Heavy-side modules legitimately import value.js statically; every
        // OTHER module under src/animation (the light surface + internal/)
        // must not — even via a dead, tree-shaken import.
        const HEAVY = new Set([
            "engine.ts",
            "group.ts",
            "waapi.ts",
            "adapter.ts",
            "constants.ts",
            "utils.ts",
            "format.ts",
            "animations.ts",
        ]);
        const offenders = [];
        const walk = (dir) => {
            for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
                const p = path.join(dir, e.name);
                if (e.isDirectory()) walk(p);
                else if (
                    e.name.endsWith(".ts") &&
                    !HEAVY.has(e.name) &&
                    /(^|\n)import\s[^;]*from\s+["']@mkbabb\/value\.js["']/.test(
                        // `import type` is erased at build — only VALUE
                        // imports arm a static edge.
                        fs
                            .readFileSync(p, "utf8")
                            .replace(/import\s+type\s[^;]*;/g, ""),
                    )
                ) {
                    offenders.push(rel(p));
                }
            }
        };
        walk(ANIM);
        console.log(
            `  source-grep complement: ${offenders.length} dormant static specifier(s)`,
        );
        if (offenders.length > 0) {
            failures.push(
                `light-surface source holds a static "@mkbabb/value.js" ` +
                    `specifier (dead-but-armed):\n    ` +
                    offenders.join("\n    "),
            );
        }
    }

    if (failures.length > 0) {
        console.error("\nproof:boundary — FAIL (inv α — the boundary is broken):");
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
