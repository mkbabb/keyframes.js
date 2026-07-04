import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@src": path.resolve(import.meta.dirname, "src"),
            // S.B7 — the `@mkbabb/keyframes.js` self-alias, mirroring vite.config.ts
            // (L.W8 dogfood inversion). The demo consumes the PUBLISHED barrel
            // specifier (`demo/@/utils/kfEngine.ts` → `import … from
            // "@mkbabb/keyframes.js"`); without this alias vitest cannot resolve the
            // self-package (a package never installs itself into node_modules), so
            // every demo test transitively importing kfEngine RED-fails at resolve.
            // Points at SOURCE so the demo composable tests share ONE realm with the
            // library under test (same nominal class identity, no dist round-trip).
            "@mkbabb/keyframes.js": path.resolve(
                import.meta.dirname,
                "src/animation/index.ts",
            ),
            "@styles": path.resolve(import.meta.dirname, "demo/@/styles"),
            // S.D2 — the hoisted demo state peer (a24 F2); mirror the vite alias.
            "@state": path.resolve(import.meta.dirname, "demo/@/state"),
            "@components": path.resolve(import.meta.dirname, "demo/@/components"),
            "@composables": path.resolve(import.meta.dirname, "demo/@/composables"),
            "@utils": path.resolve(import.meta.dirname, "demo/@/utils"),
            "@assets": path.resolve(import.meta.dirname, "assets"),
            // R.W5 fused scenes to demo/scenes/ and routed cross-scene imports
            // through @app (demo/app/); vitest must mirror the demo build alias.
            "@app": path.resolve(import.meta.dirname, "demo/app"),
            // The library gate is glass-ui-FREE (inv β); vitest runs only there.
            // Alias glass-ui's motion-core subpath to a shim so demo-encapsulation
            // tests (which transitively import it via useSceneSwap/useSceneTransition)
            // transform without the dangling optional sibling. The REAL module is
            // used in the demo build (gh-pages / demo-smoke), never under vitest.
            "@mkbabb/glass-ui/motion-core": path.resolve(
                import.meta.dirname,
                "test/stubs/glass-ui-motion-core.ts",
            ),
        },
    },
    test: {
        include: ["test/*.ts"],
        environment: "jsdom",
    },
    benchmark: {
        include: ["bench/*.bench.ts"],
    },
});
