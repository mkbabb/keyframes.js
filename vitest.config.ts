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
        // X.KF.W13.a2 (KF13-E2, COHESION §0ai) — the producer's dist chunks
        // import the BARE SELF-SPECIFIER `@mkbabb/keyframes.js`
        // (`@mkbabb/glass-ui/dist/dock.js:24` → `useSpring-*.js`). vitest
        // externalizes `node_modules`, so those chunks are loaded by Node's own
        // resolver, which never sees the `resolve.alias` above — and a package
        // never installs itself into its own `node_modules`. Every demo test
        // that mounts a real glass-ui component whose closure reaches
        // `useSpring` therefore died at IMPORT, before a single assertion:
        //   Error: Cannot find package '@mkbabb/keyframes.js' imported from
        //   node_modules/@mkbabb/glass-ui/dist/useSpring-9u2_shxV.js
        // Inlining the producer hands its chunks to Vite's transform pipeline,
        // where the S.B7 alias resolves the self-specifier to `src/` — ONE
        // realm for producer and library, the same shape the alias already
        // declares for the demo's own consumption. This is the harness's own
        // idiom and the ROOT cure: it replaces the per-file `vi.mock` seam
        // stubs earlier waves had to reach for to keep a mounted card alive.
        server: { deps: { inline: ["@mkbabb/glass-ui"] } },
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
            // X.KF.W8 (G9 / R-5) — the two `bench/*.measure.test.ts` orphans are
            // ADOPTED IN PLACE, beside the bench fixtures they measure, rather
            // than moved into test/ away from them: `bench/` is outside `src/`,
            // so both shapes are precept-conformant and in-place is the smaller
            // act. They are `*.test.ts` files that NO declared project collected
            // — the `library` project scopes to `test/**`, the `demo` project to
            // `test/demo/**`, and `benchmark.include` is `bench/*.bench.ts`, a
            // different runner entirely. The include is anchored on the
            // `.measure.test.ts` suffix so it cannot swallow a `*.bench.ts`
            // sibling (verified against the tracked bench listing before this
            // shape was chosen, per README:127-130): the glob matches exactly
            // d3-changed-keys.measure.test.ts and sync-step.measure.test.ts.
            // `jsdom`, like both sibling projects: sync-step.measure.test.ts
            // swaps `window.requestAnimationFrame` for a deterministic clock, so
            // a `node` environment fails it at `window is not defined` — the
            // environment the adopted files actually need, not the lightest one.
            {
                extends: true,
                test: {
                    name: "measure",
                    include: ["bench/**/*.measure.test.ts"],
                    environment: "jsdom",
                },
            },
        ],
    },
});
