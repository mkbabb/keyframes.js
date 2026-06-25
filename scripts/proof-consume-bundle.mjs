// proof:consume-bundle — keyframes.js M.W9 / DM-25 (the "atlas" consume-side gate).
//
// THE GAP (the generalized atlas finding): proof:boundary bundles from SOURCE
// (src/animation/index.ts) and proves the LIGHT barrel is value.js-free there.
// It does NOT model a DOWNSTREAM CONSUMER: a project that installs
// @mkbabb/keyframes.js, eagerly imports the LIGHT surface, and bundles it with
// its OWN bundler. If the published dist's exports map, sideEffects:false, or the
// dynamic-import boundary were wrong, that consumer would drag the HEAVY engine +
// value.js into ITS output bundle even though the source-side gate is green.
//
// This gate bundles the BUILT dist barrel (dist/keyframes.js — exactly what the
// exports map resolves "@mkbabb/keyframes.js" to) as a consumer would, with
// value.js + parse-that kept NON-EXTERNAL so any static edge to them MUST surface
// in the bundle. It asserts the consumer's eager (static) graph pulls ZERO
// value.js / parse-that modules and ZERO engine chunk — the engine rides only the
// dynamic `import()` boundary. Born-RED: a static value.js edge in any LIGHT dist
// module makes the consumer bundle include value.js → exit 1.
import { rolldown } from "rolldown";
import { writeFileSync, rmSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const distBarrel = resolve(root, "dist/keyframes.js");

if (!existsSync(distBarrel)) {
    console.error("FAIL: dist/keyframes.js missing — run `npm run build:lib` first.");
    process.exit(1);
}

// A representative consumer: eagerly import a spread of LIGHT exports (the
// value.js-free static surface a tree-shaking app would pull).
const LIGHT = [
    "SpringProgress", "SmoothProgress", "NumericAnimation", "ElementMorph",
    "RAFPlayback", "stagger", "springLinearStops", "Oscillator",
];
const consumerEntry = resolve(root, ".proof-consume-entry.mjs");
writeFileSync(
    consumerEntry,
    `import { ${LIGHT.join(", ")} } from ${JSON.stringify(distBarrel)};\n` +
        `// touch each so tree-shake cannot drop them:\n` +
        `globalThis.__sink = [${LIGHT.join(", ")}];\n`,
);

let failed = false;
try {
    const bundle = await rolldown({
        input: consumerEntry,
        // value.js + parse-that stay NON-external: a reintroduced static GRAMMAR
        // edge bundles their modules, which this gate then catches. The ONE
        // exception is the W97 verified-clean `@mkbabb/value.js/math` subpath
        // (the LIGHT leaves re-export value.js's grammar-free math helpers from it;
        // proof:boundary proves its graph grammar-free + externalizes it the same
        // way) — externalized here so the verified-clean math edge is not bundled.
        external: ["vue", "prettier", "@mkbabb/value.js/math"],
        treeshake: true,
    });
    const { output } = await bundle.generate({ format: "es" });
    await bundle.close();

    const entryChunk = output.find((o) => o.type === "chunk" && o.isEntry);
    const dynamicChunks = output.filter((o) => o.type === "chunk" && !o.isEntry);

    // (1) The eager entry chunk must reference zero value.js / parse-that modules.
    // The W97 verified-clean `@mkbabb/value.js/math` external is blanked first
    // (mirroring proof:boundary's W97 allow-list) so the legitimate grammar-free
    // math edge does not false-fire the `@mkbabb/value.js` substring match; a
    // grammar-pulling value.js edge (the real leak) still reds.
    const code = (entryChunk?.code ?? "").split("@mkbabb/value.js/math").join("");
    const leaked = ["@mkbabb/value.js", "value.js", "parse-that", "ValueUnit", "parseCSSValue"]
        .filter((m) => code.includes(m));
    if (leaked.length > 0) {
        console.log(`  FAIL  C1-eager-graph  consumer eager bundle references: ${leaked.join(", ")}`);
        failed = true;
    } else {
        console.log(`  PASS  C1-eager-graph  consumer eager bundle is value.js/parse-that-free`);
    }

    // (2) The engine rides only the dynamic boundary: the eager chunk must NOT
    // statically inline an engine symbol set (heavy classes); they live behind
    // the dynamic import() chunks.
    const engineStatic = ["CSSKeyframesAnimation", "class Animation", "AnimationGroup", "FrameCompiler"]
        .filter((m) => code.includes(m));
    if (engineStatic.length > 0) {
        console.log(`  FAIL  C2-engine-dynamic-only  eager chunk statically inlines: ${engineStatic.join(", ")}`);
        failed = true;
    } else {
        console.log(`  PASS  C2-engine-dynamic-only  the heavy engine stays behind the dynamic import() boundary (${dynamicChunks.length} dynamic chunk(s))`);
    }
} catch (e) {
    console.log(`  FAIL  bundling threw: ${e.message}`);
    failed = true;
} finally {
    rmSync(consumerEntry, { force: true });
}

console.log(
    `\nproof:consume-bundle ${failed ? "FAIL" : "GREEN"} — a downstream consumer of the LIGHT surface drags zero value.js/engine.`,
);
process.exit(failed ? 1 : 0);
