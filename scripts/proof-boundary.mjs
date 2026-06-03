#!/usr/bin/env node
/**
 * proof:boundary — the value.js static/dynamic boundary gate (A inv α).
 *
 * The v2.2.0 KF-B1 release carved keyframes along the value.js seam: the light
 * physics/interpolation engines (`SpringProgress`, `SmoothProgress`,
 * `NumericAnimation`, `ElementMorph`, the `Timeline` family) carry ZERO static
 * import edge to `@mkbabb/value.js`; the heavy CSS-parsing engine sits behind
 * `loadAnimationEngine()`'s dynamic `import("./engine")`. The CHANGELOG asserted
 * "a spring-only bundle contains no value.js code" — nothing GATED it.
 *
 * This gate proves it by construction: it bundles a SPRING-ONLY entry
 * (`import { SpringProgress } from "src/animation/index.ts"`) from SOURCE with
 * rolldown — re-running tree-shaking on the real module graph, NOT inspecting
 * the pre-built dist — then asserts the entry chunk's STATIC module set:
 *
 *   1. contains 0 `@mkbabb/value.js` modules, and
 *   2. contains 0 `src/animation/engine.ts` (the heavy engine reaches the
 *      bundle, if at all, only as a DYNAMIC import chunk).
 *
 * value.js + parse-that are deliberately NOT externalized, so a reintroduced
 * STATIC edge from any light module pulls their source into the entry chunk and
 * turns the gate red. The negative test — add `import "@mkbabb/value.js"` to a
 * light module (e.g. `spring.ts`) — must fail this gate.
 */
import { rolldown } from "rolldown";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ENTRY_SRC = path.join(REPO, "src/animation/index.ts");
const TMP_ENTRY = path.join(REPO, ".proof-spring-entry.mjs");

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

async function main() {
    fs.writeFileSync(
        TMP_ENTRY,
        `import { SpringProgress } from ${JSON.stringify(ENTRY_SRC)};\nexport default SpringProgress;\n`,
    );

    let output;
    try {
        const bundle = await rolldown({
            input: TMP_ENTRY,
            // Only host-provided / unrelated externals. value.js + parse-that
            // stay NON-external so a reintroduced static edge bundles their
            // source into the entry chunk (where this gate would catch it).
            external: ["vue", "prettier"],
            treeshake: true,
            logLevel: "silent",
        });
        ({ output } = await bundle.generate({ format: "es" }));
        await bundle.close();
    } finally {
        fs.rmSync(TMP_ENTRY, { force: true });
    }

    const entry = output.find((o) => o.type === "chunk" && o.isEntry);
    if (!entry) {
        console.error("proof:boundary — FAIL: no entry chunk emitted.");
        process.exit(2);
    }

    const staticModules = entry.moduleIds;
    const valueJsStatic = staticModules.filter(isValueJs);
    const engineStatic = staticModules.filter(isHeavyEngine);

    const chunks = output.filter((o) => o.type === "chunk");
    const dynamicChunks = chunks.filter((c) => !c.isEntry);

    console.log("proof:boundary — spring-only entry static module graph");
    console.log(`  entry chunk           : ${entry.fileName}`);
    console.log(`  static modules        : ${staticModules.length}`);
    console.log(`  value.js static edges : ${valueJsStatic.length}`);
    console.log(`  engine.ts static edges: ${engineStatic.length}`);
    console.log(
        `  dynamic import chunks : ${dynamicChunks.length}` +
            (dynamicChunks.length
                ? ` (${dynamicChunks.map((c) => c.fileName).join(", ")})`
                : ""),
    );

    const failures = [];
    if (valueJsStatic.length > 0) {
        failures.push(
            `value.js is statically reachable from the spring-only entry via:\n    ` +
                valueJsStatic.map(rel).join("\n    "),
        );
    }
    if (engineStatic.length > 0) {
        failures.push(
            `the heavy engine.ts is a STATIC input of the spring-only entry (must be dynamic-only) via:\n    ` +
                engineStatic.map(rel).join("\n    "),
        );
    }

    if (failures.length > 0) {
        console.error(
            "\nproof:boundary — FAIL (A inv α — the boundary is broken):",
        );
        for (const f of failures) console.error("  ✗ " + f);
        console.error(
            "\n  A light module reintroduced a static value.js / engine edge. The KF-B1\n" +
                "  light/heavy boundary requires light engines to reach value.js ONLY through\n" +
                '  the dynamic `import("./engine")`. Move the offending import behind it.',
        );
        process.exit(1);
    }

    console.log(
        "\nproof:boundary — PASS: the spring-only entry is value.js-free and pulls the\n" +
            "heavy engine only dynamically. The KF-B1 boundary holds (A inv α).",
    );
}

main().catch((err) => {
    console.error("proof:boundary — ERROR:", err);
    process.exit(3);
});
