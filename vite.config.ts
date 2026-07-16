import { defineConfig } from "vite";
import path from "path";

import Vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";

import dts from "vite-plugin-dts";
import {
    assetExtension404Plugin,
    chunkAnalyzerPlugin,
    criticalCSSPlugin,
    deferLazyCSSPlugin,
    engineDtsRollupPlugin,
} from "./scripts/build/vite";

import tailwindcss from "@tailwindcss/postcss";

const defaultOptions = {
    css: {
        postcss: {
            plugins: [tailwindcss()],
        },
    },

    resolve: {
        // `@mkbabb/value.js` resolves through its own `exports` map from the
        // registry tarball (G.W2 re-pin — no longer a `file:` symlink). The demo
        // self-aliases `@mkbabb/keyframes.js` to its own library source: with
        // glass-ui consumed from the registry (not a workspace link), glass-ui's
        // bare `import … from "@mkbabb/keyframes.js"` (e.g. `SpringProgress` in
        // its dock/spring-mount) has no installed package to resolve against —
        // rolldown would stub it as an empty optional-peer-dep and drop the
        // export. The self-alias dedupes glass-ui onto the SAME keyframes
        // instance the demo uses via `@src`, so the consumer and its UI lib
        // share one engine. (Supersedes contract-v2's no-self-alias rule, which
        // presupposed the `file:` symlink walk that the registry pin removed.)
        alias: {
            "@src": path.resolve(import.meta.dirname, "src"),
            "@mkbabb/keyframes.js": path.resolve(
                import.meta.dirname,
                "src/animation/index.ts",
            ),
            "@styles": path.resolve(import.meta.dirname, "demo/styles"),
            // S.D2 — the hoisted demo state peer (a24 F2). A dir alias resolves
            // both the bare barrel (`@state` → state/index.ts) and subpaths.
            "@state": path.resolve(import.meta.dirname, "demo/state"),
            "@components": path.resolve(import.meta.dirname, "demo/components"),
            "@utils": path.resolve(import.meta.dirname, "demo/utils"),
            "@kf-engine": path.resolve(
                import.meta.dirname,
                "demo/kf-engine.ts",
            ),
            "@composables": path.resolve(
                import.meta.dirname,
                "demo/composables",
            ),
            "@app": path.resolve(import.meta.dirname, "demo/app"),
            "@assets": path.resolve(import.meta.dirname, "assets"),
        },
    },
};

/**
 * Dev/serve `resolve.conditions` per the cross-repo dev-resolution contract
 * (glass-ui/docs/precepts/cross-repo-dev-resolution.md, contract-v2).
 *
 * contract-v2 abrogates the `development` condition: a workspace-linked
 * `@mkbabb/*` sibling resolves to its own `dist/` in dev and prod alike,
 * kept always-fresh by the sibling's own `build:watch`. No `development`
 * arm, no sibling-`src/` deep-import — `["module","browser","default"]`
 * is the standard browser-target resolution order.
 */
const devConditions = ["module", "browser", "default"];

// The inline-SVG reference seam (H.W5.S1): `import Icon from "…icon.svg?component"`
// resolves to an inline-`<svg>` SFC whose `stroke="currentColor"` inherits the
// host theme color — the ONLY reference mechanism that themes (an `<img :src>`
// paints SVG as a replaced element that cannot read the host `currentColor`).
// kf-OWNED demo build tooling (inv-16), NOT a glass-ui handoff.
//
// SVGO is configured so it does NOT defeat the theming the whole wave is for:
//   • convertColors: false — never rewrite `currentColor`/`fill="none"`.
//   • removeViewBox:  false — keep the `viewBox` so the glyph scales.
// (WV-W5-MED-2: where the file-shape check and the computed-stroke check
// disagree, the computed stroke is the authority — these two SVGO flags keep
// the file faithful to what the browser computes.)
const svgLoaderPlugin = svgLoader({
    defaultImport: "component",
    svgoConfig: {
        plugins: [
            {
                name: "preset-default",
                params: {
                    overrides: {
                        convertColors: false,
                        removeViewBox: false,
                    },
                },
            },
        ],
    },
});

const defaultPlugins = [Vue(), svgLoaderPlugin];

// I.W5.S1 — the ONE canonical demo `outDir`. The default demo build (the
// non-`gh-pages`/`production`/`playground` branch below) used to set
// `root: "./demo/app/"` with NO explicit `outDir`, so any non-enumerated-mode
// `vite build` wrote to `demo/app/dist/` — the Mar-25 orphan that contaminated
// dev module resolution and greps (B9-b). Routing the default demo build to the
// SAME single canonical path under the gitignored `dist/` root makes a second
// build output IMPOSSIBLE BY CONSTRUCTION (not merely cleaned): no Vite
// invocation can ever spawn `demo/app/dist/` again. (gh-pages keeps its own
// explicit `dist/gh-pages/` — both demo outputs live under `dist/`, never beside
// the source.)
const DEMO_DEFAULT_OUTDIR = path.resolve(
    import.meta.dirname,
    "./dist/demo-app/",
);

export default defineConfig((mode) => {
    if (mode.mode === "production") {
        return {
            ...defaultOptions,
            // J.W5.S4 (BP-1) — the LIBRARY build copies NO public dir. The
            // production (lib) mode runs with root = the project root, so
            // Vite's default `publicDir: "public"` resolved to the repo-root
            // CF-Pages staging dir (the gitignored `public/_redirects`) and
            // copied it verbatim into `outDir` (`dist/`) — which is EXACTLY
            // what `package.json "files": ["dist"]` tarballs, so the routing
            // relic rode every `npm pack`/publish. The demo builds own their
            // public dirs (gh-pages: root `demo/app/` → `demo/app/public/`,
            // outDir `dist/gh-pages/`); the library tarball is code + types
            // only. The seam fix, not a periodic `rm` — proof:published-
            // surface clause (a) proves it STAYS out.
            publicDir: false,
            optimizeDeps: {},
            build: {
                minify: true,
                lib: {
                    // R.W4 §2.1 — TWO named entries meet the same engine graph:
                    //   • `keyframes`     → the LIGHT static barrel (`.`), value.js-free.
                    //   • `engine/index`  → the `./engine` subpath: the HEAVY engine
                    //     barrel as a STABLE-PATH, statically-importable entry
                    //     (`@mkbabb/keyframes.js/engine`) — the honest "in" for
                    //     `new CSSKeyframesAnimation(...)`.
                    // Rolldown shares the engine module graph across the two entries
                    // (and the `loadAnimationEngine()` lazy `import("./engine/index")`),
                    // so the engine code is NOT duplicated — it lands in one shared
                    // chunk both the lazy split and the `engine/index` entry reference.
                    // The named entry's filename is keyed off the entry name, so it
                    // emits at `dist/engine/index.js` exactly where the subpath points.
                    entry: {
                        keyframes: path.resolve(
                            import.meta.dirname,
                            "src/animation/index.ts",
                        ),
                        // R.W4b — the `./engine` subpath SOURCE is the
                        // composition barrel `public.ts` (the FULL static mirror
                        // of the heavy `loadAnimationEngine()` surface; S.B2
                        // hoisted it to the `src/animation` root beside
                        // `load-engine.ts`), NOT the zone-pure `engine/index.ts`
                        // (which carries the engine CORE only). The OUTPUT name
                        // stays `engine/index` so the emit path
                        // (`dist/engine/index.js`) the exports map points at is
                        // UNCHANGED — only the source moves. The shared engine
                        // chunk is still deduped across the two entries + the
                        // `loadAnimationEngine()` lazy split, so the subpath stays
                        // a thin re-export, never a duplicate.
                        "engine/index": path.resolve(
                            import.meta.dirname,
                            "src/animation/public.ts",
                        ),
                    },
                    name: "Keyframes",
                    fileName: (_format, entryName) => `${entryName}.js`,
                    formats: ["es"],
                },
                rolldownOptions: {
                    // Value 4 is a rootless capability package. Externalize only
                    // the six entries Keyframes consumes; a prefix predicate would
                    // silently admit removed or private paths.
                    external: [
                        "vue",
                        "@mkbabb/value.js/color",
                        "@mkbabb/value.js/value",
                        "@mkbabb/value.js/css",
                        "@mkbabb/value.js/easing",
                        "@mkbabb/value.js/math",
                        "@mkbabb/value.js/transform",
                    ],
                },
            },
            esbuild: {
                drop: ["console", "debugger"],
            },
            plugins: [
                ...defaultPlugins,
                // vite-plugin-dts derives its rollup-stub path from
                // `relative(entryRoot, entry)` — which only matches the
                // actual emit location when TSC's effective `rootDir`
                // also equals `entryRoot`. With the project's default
                // tsconfig (no explicit `rootDir`, multi-dir `include`)
                // TSC's rootDir auto-resolves to the project root, so
                // `src/animation/index.ts` emits to `dist/src/animation/
                // index.d.ts` while the stub-writer looks for
                // `dist/index.d.ts` — and API Extractor rolls up the
                // empty stub, yielding a 12-byte `export {}` artifact.
                //
                // Pinning both `entryRoot` AND `compilerOptions.rootDir`
                // to the library entry's directory keeps emit and
                // stub-write in lockstep.
                //
                // vite-plugin-dts 5 (unplugin-dts): the roll-up option is
                // `bundleTypes` (v4's `rollupTypes` is silently ignored —
                // no validation error) and `@microsoft/api-extractor`
                // moved from a bundled dependency to an OPTIONAL peer the
                // consumer provides (devDependency here). Both are
                // load-bearing: without either, the build stays green and
                // emits per-module .d.ts but NO rolled-up keyframes.d.ts —
                // the dts byte-check in CI is what catches it.
                dts({
                    bundleTypes: true,
                    include: ["src/"],
                    entryRoot: "src/animation",
                    compilerOptions: {
                        rootDir: path.resolve(
                            import.meta.dirname,
                            "src/animation",
                        ),
                    },
                }),
                // R.W4 §2.1 — own the `./engine` subpath's .d.ts roll-up
                // independently of the dts plugin's racy multi-entry bundle.
                engineDtsRollupPlugin(),
            ],
        };
    } else if (mode.mode === "gh-pages") {
        // Heavy lazy chunks that should NOT be modulepreloaded or render-blocking
        const lazyChunks = [
            "vendor-monaco",
            "vendor-three",
            "vendor-prettier",
            "vendor-highlight",
            "html2canvas",
        ];

        return {
            ...defaultOptions,
            base: "./",
            root: "./demo/app/",
            resolve: {
                ...defaultOptions.resolve,
                conditions: devConditions,
            },
            build: {
                // Demo (gh-pages) output is routed to a SEPARATE outDir so a
                // demo build never clobbers the library `dist/keyframes.{js,d.ts}`
                // the package's `exports` map resolves to. `production` mode
                // (the library build) keeps the default `dist/`; the two builds
                // no longer share an `emptyOutDir` target. See the cross-repo
                // dev-resolution contract — glass-ui Q.W6.
                outDir: path.resolve(import.meta.dirname, "./dist/gh-pages/"),
                emptyOutDir: true,
                minify: true,
                // I.W5.S6 (B9-c) — the BUILT product emits NO source maps, so it
                // is structurally free of the dev-only "Source Map loading errors
                // ×47" DevTools noise. That x47 is benign dev-only diagnostics
                // from Vite's dep-optimizer serving pre-bundled vendor maps
                // (Monaco per-language chunks + html2canvas, whose
                // `sourceMappingURL` points at a `.map` it does not co-emit) — it
                // is ACCEPTED + documented, NOT suppressed: adding machinery at
                // the dep-optimize layer to silence it would risk masking REAL
                // future map errors (anti-KISS). The icon-paint gate asserts
                // `sourcemapNon200 === 0` on THIS built product — where it
                // matters — so the disposition is guarded at the product, not the
                // dev noise.
                sourcemap: false,
                modulePreload: {
                    resolveDependencies(filename, deps) {
                        // Exclude heavy lazy-loaded vendor chunks from modulepreload.
                        // Without this, Vite injects <link rel="modulepreload"> for Monaco (3.7 MB),
                        // Three.js, Prettier etc. into the HTML, defeating code splitting.
                        return deps.filter(
                            (dep) => !lazyChunks.some((c) => dep.includes(c)),
                        );
                    },
                },
                cssCodeSplit: true,
                rolldownOptions: {
                    output: {
                        // rolldown-NATIVE chunk grouping (first match wins).
                        // The former rollup-style manualChunks shim let
                        // rolldown park SHARED commons — vite's
                        // __vitePreload helper, the cn() leaf utils —
                        // INSIDE vendor-monaco, which made the 4 MB editor
                        // a STATIC import of the app entry (the exact
                        // eager-leak inv γ exists to prevent). With
                        // advancedChunks, unmatched commons land in the
                        // runtime/common chunk, never a vendor group.
                        advancedChunks: {
                            groups: [
                                // Vite's __vitePreload helper is imported by
                                // every dynamic-importing chunk INCLUDING the
                                // entry — it gets its own first-match micro-
                                // chunk so no vendor group (rolldown kept
                                // parking it inside vendor-monaco, dragging
                                // 4 MB onto the entry's critical path) can
                                // ever own it.
                                {
                                    name: "preload-helper",
                                    test: /vite[\\/]preload-helper/,
                                },
                                {
                                    name: "vendor-monaco",
                                    test: /node_modules[\\/]monaco/,
                                },
                                {
                                    name: "vendor-three",
                                    test: /node_modules[\\/][^\\/]*three/,
                                },
                                {
                                    name: "vendor-prettier",
                                    test: /node_modules[\\/][^\\/]*prettier/,
                                },
                                {
                                    name: "vendor-highlight",
                                    test: /node_modules[\\/][^\\/]*highlight/,
                                },
                                {
                                    name: "vendor-reka-ui",
                                    test: /node_modules[\\/]reka-ui/,
                                },
                                {
                                    name: "vendor-lucide",
                                    test: /node_modules[\\/][^\\/]*lucide/,
                                },
                            ],
                        },
                    },
                },
            },
            plugins: [
                ...defaultPlugins,
                deferLazyCSSPlugin(["vendor-monaco"]),
                criticalCSSPlugin(),
                // KF_ANALYZE=1: dump each chunk's import edges + the modules
                // that landed in it, to dist/gh-pages/_chunks.json — the
                // instrument for hunting eager-leak regressions (inv γ).
                ...(process.env.KF_ANALYZE ? [chunkAnalyzerPlugin()] : []),
            ],
        };
    } else {
        // Dev mode: serve the demo app with HMR.
        //
        // I.W5.S1 — `root: "./demo/app/"` with NO explicit `outDir` was the
        // default-outDir LANDMINE: a build in any non-enumerated mode wrote to
        // `demo/app/dist/` (the orphan). Pinning the SAME single canonical
        // `outDir` (under the gitignored `dist/`) makes that second build output
        // UNREACHABLE BY CONSTRUCTION — no Vite invocation can spawn
        // `demo/app/dist/` again. `emptyOutDir: true` keeps it self-cleaning.
        return {
            ...defaultOptions,
            root: "./demo/app/",
            resolve: {
                ...defaultOptions.resolve,
                conditions: devConditions,
            },
            build: {
                outDir: DEMO_DEFAULT_OUTDIR,
                emptyOutDir: true,
            },
            optimizeDeps: {
                include: [
                    "vue",
                    "reka-ui",
                    "@vueuse/core",
                    "@lucide/vue",
                    "vue-sonner",
                ],
            },
            // assetExtension404Plugin (S2): the dev SPA-fallback 404s
            // asset-extension misses honestly (an orphaned `*.svg` surfaces as a
            // real 404, never masked as 200-HTML).
            plugins: [...defaultPlugins, assetExtension404Plugin()],
        };
    }
});
