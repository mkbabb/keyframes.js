import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@src": path.resolve(import.meta.dirname, "src"),
            "@styles": path.resolve(import.meta.dirname, "demo/@/styles"),
            "@components": path.resolve(import.meta.dirname, "demo/@/components"),
            "@utils": path.resolve(import.meta.dirname, "demo/@/utils"),
            "@assets": path.resolve(import.meta.dirname, "assets"),
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
