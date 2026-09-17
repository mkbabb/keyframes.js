import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    // X.KF.W4 (G-KFW4-2) — the SFC transform. The config declared `resolve` and
    // `test` and NO `plugins` array at all, so vitest could not compile a single
    // `.vue` file: the demo lane passed with ZERO mounted SFCs, and any spec
    // reaching a `demo/scenes/**` barrel that re-exports an SFC would have died
    // at transform rather than at an assertion. The registration happens HERE,
    // once, and is the witness KF.W8's G10 leg (a) cites; W8 performs no edit of
    // this file. The plugin is declared at the ROOT so both projects inherit it
    // through `extends: true` — the library lane compiles no SFC today, and a
    // per-project registration would silently re-open the same hole the first
    // time one does.
    plugins: [vue()],
    resolve: {
        alias: {
            "@src": path.resolve(import.meta.dirname, "src"),
            // S.B7 — the `@mkbabb/keyframes.js` self-alias, mirroring vite.config.ts
            // (L.W8 dogfood inversion). The demo consumes the PUBLISHED barrel
            // specifier (`demo/utils/kfEngine.ts` → `import … from
            // "@mkbabb/keyframes.js"`); without this alias vitest cannot resolve the
            // self-package (a package never installs itself into node_modules), so
            // every demo test transitively importing kfEngine RED-fails at resolve.
            // Points at SOURCE so the demo composable tests share ONE realm with the
            // library under test (same nominal class identity, no dist round-trip).
            "@mkbabb/keyframes.js": path.resolve(
                import.meta.dirname,
                "src/animation/index.ts",
            ),
            "@styles": path.resolve(import.meta.dirname, "demo/styles"),
            // S.D2 — the hoisted demo state peer (a24 F2); mirror the vite alias.
            "@state": path.resolve(import.meta.dirname, "demo/state"),
            "@components": path.resolve(import.meta.dirname, "demo/components"),
            "@composables": path.resolve(import.meta.dirname, "demo/composables"),
            "@utils": path.resolve(import.meta.dirname, "demo/utils"),
            "@kf-engine": path.resolve(import.meta.dirname, "demo/kf-engine.ts"),
            "@assets": path.resolve(import.meta.dirname, "assets"),
            // R.W5 fused scenes to demo/scenes/ and routed cross-scene imports
            // through @app (demo/app/); vitest must mirror the demo build alias.
            "@app": path.resolve(import.meta.dirname, "demo/app"),
        },
    },
    test: {
        benchmark: {
            include: ["bench/*.bench.ts"],
            exclude: ["**/.claude/**", "**/node_modules/**", "**/dist/**"],
        },
        projects: [
            {
                extends: true,
                test: {
                    name: "library",
                    include: ["test/**/*.test.ts"],
                    exclude: ["test/demo/**"],
                    environment: "jsdom",
                },
            },
            {
                extends: true,
                test: {
                    name: "demo",
                    include: ["test/demo/**/*.test.ts"],
                    environment: "jsdom",
                },
            },
        ],
    },
});
