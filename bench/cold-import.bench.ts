/**
 * cold-import.bench.ts — S.F5b S2 (a26): the static-vs-dynamic boundary bench,
 * tied to the consumer-side LIGHT-edge check in `proof:publish`.
 *
 * `proof:publish` proves the boundary structurally: a downstream consumer
 * that eagerly imports the LIGHT surface (`SpringProgress`, `NumericAnimation`,
 * …) drags ZERO `@mkbabb/value.js` / engine into its bundle — the HEAVY engine
 * rides ONLY the dynamic `import()` behind `loadAnimationEngine()`. This bench is
 * the RUNTIME manifestation of that same boundary, made visible as a same-report
 * pair of the two surfaces' per-use cost:
 *
 *   - the STATIC LIGHT surface is value.js-free — a light-only consumer
 *     constructs + steps a `SpringProgress` with NO value.js in its graph
 *     (the publish check's eager-graph clause), read here from the value.js-free
 *     static barrel edge;
 *   - the DYNAMIC HEAVY surface is reached ONLY through `loadAnimationEngine()`,
 *     the dynamic `import()` that pulls the engine + value.js
 *     (the publish check's engine-dynamic-only clause); its per-use cost includes
 *     the value.js CSS parse a `CSSKeyframesAnimation.fromString` pays.
 *
 * The gap between the two arms is the price of the boundary the bundle gate
 * enforces: LIGHT consumers pay the value.js-free construct; only the HEAVY
 * surface pays the parser. The arms are OBSERVE-ONLY (construct cost is
 * device-dependent — no floor, C-10; the RATIO is same-report context,
 * re-baselined per run) and classified in `bench/taxonomy.json` (sf-#6).
 *
 * The bench file's OWN static graph is value.js-free: it imports only the LIGHT
 * barrel exports (`SpringProgress`, `loadAnimationEngine`); the engine is reached
 * exclusively through the dynamic `loadAnimationEngine()` boundary, resolved ONCE
 * at module load (the bench bodies stay SYNCHRONOUS — an async bench body
 * mis-serializes the fastest arm under vitest v4's `--outputJson`; the boundary
 * distinction is the SURFACE reached, not the one-time module resolve).
 */
import { bench, describe } from "vitest";
import { SpringProgress, loadAnimationEngine } from "../src/animation";

// Resolve the HEAVY surface ONCE through the dynamic boundary — the SAME
// `loadAnimationEngine()` edge `proof:publish` verifies is the only path to
// the engine + value.js. The static import above pulls ZERO value.js (LIGHT
// barrel exports only), so this file honors the boundary it measures.
const { CSSKeyframesAnimation } = await loadAnimationEngine();

describe("static-vs-dynamic boundary (S.F5b — consume-bundle runtime edge)", () => {
    bench(
        "static LIGHT surface · SpringProgress construct+settle (value.js-free)",
        () => {
            const s = new SpringProgress({
                response: 0.4,
                dampingFraction: 0.7,
            });
            s.target = 1;
            for (let i = 0; i < 8 && !s.settled; i++) s.tickDt(16);
        },
    );

    bench(
        "dynamic HEAVY surface · CSSKeyframesAnimation.fromString (engine + value.js, reached via loadAnimationEngine)",
        () => {
            new CSSKeyframesAnimation({ duration: 300 }).fromString(
                "from { opacity: 0; } to { opacity: 1; }",
            );
        },
    );
});
