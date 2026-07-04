import { defineConfig, type Plugin } from "vite";
import path from "path";
import fs from "fs";
import os from "os";

import Vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";

import dts from "vite-plugin-dts";
import ts from "typescript";
import {
    Extractor,
    ExtractorConfig,
    type IConfigFile,
} from "@microsoft/api-extractor";

import tailwindcss from "@tailwindcss/postcss";

/**
 * R.W4 §2.1 — emit a self-contained `dist/engine/index.d.ts` rollup for the
 * `./engine` package subpath.
 *
 * vite-plugin-dts's `bundleTypes` rolls up only the FIRST lib entry
 * (`keyframes.d.ts`); for a SECOND named entry it races — its API-Extractor run
 * loses its per-module inputs (the first rollup unlinks the shared intermediate
 * tree) and leaves a raw stub whose relative re-exports (`./animation`,
 * `../adapter`, …) do NOT resolve against `dist/`. So a TS consumer of
 * `@mkbabb/keyframes.js/engine` would get broken types.
 *
 * This plugin owns the engine `.d.ts` end-to-end, in `closeBundle` (AFTER the
 * dts plugin has finished): it tsc-emits the engine entry's declaration graph to
 * a temp dir, then runs API Extractor over `engine/index.d.ts` as the main entry
 * point — externalizing value.js exactly as the JS build does — and writes the
 * self-contained roll-up to `dist/engine/index.d.ts`. The engine CODE is still
 * the ONE shared chunk (the JS multi-entry dedupes it); only its TYPE roll-up is
 * produced here, independently of the racy multi-entry dts path.
 */
function engineDtsRollupPlugin(): Plugin {
    return {
        name: "kf-engine-dts-rollup",
        apply: "build",
        enforce: "post",
        async closeBundle() {
            const root = import.meta.dirname;
            // R.W4b — the `./engine` subpath dts roll-up is the FULL static
            // mirror, so the SOURCE entry is the composition barrel `public.ts`
            // (S.B2 hoisted it out of `engine/` to the `src/animation` root
            // beside `load-engine.ts`; NOT the zone-pure `engine/index.ts`). The
            // INSTALL path stays `dist/engine/index.d.ts` (the exports map is
            // UNCHANGED) — only the tsc-emit + API-Extractor INPUT moves.
            const entry = path.resolve(root, "src/animation/public.ts");
            const distEngine = path.resolve(root, "dist/engine/index.d.ts");
            if (!fs.existsSync(entry)) return;

            // 1. tsc-emit declarations for the engine subgraph to a temp dir.
            const tmp = fs.mkdtempSync(
                path.join(os.tmpdir(), "kf-engine-dts-"),
            );
            const configPath = ts.findConfigFile(
                root,
                ts.sys.fileExists,
                "tsconfig.lib.json",
            );
            const parsed = configPath
                ? ts.parseJsonConfigFileContent(
                      ts.readConfigFile(configPath, ts.sys.readFile).config,
                      ts.sys,
                      path.dirname(configPath),
                  )
                : { options: {} as ts.CompilerOptions };
            const program = ts.createProgram([entry], {
                ...parsed.options,
                declaration: true,
                emitDeclarationOnly: true,
                noEmit: false,
                outDir: tmp,
                rootDir: path.resolve(root, "src/animation"),
                skipLibCheck: true,
            });
            program.emit(undefined, undefined, undefined, true);

            // tsc emits the declaration graph mirroring the source path under
            // `rootDir: src/animation`, so the composition barrel `public.ts`
            // (S.B2 root-hoisted) lands at `public.d.ts` (R.W4b — this is the
            // API-Extractor main entry point, NOT `engine/index.d.ts`).
            const emittedEntry = path.join(tmp, "public.d.ts");
            if (!fs.existsSync(emittedEntry)) {
                this.warn(
                    "kf-engine-dts-rollup: engine declarations did not emit; leaving dts as-is",
                );
                return;
            }

            // 2. API Extractor → a self-contained roll-up (value.js external).
            const extractorRollup = path.join(tmp, "engine-rollup.d.ts");
            const config: IConfigFile = {
                projectFolder: root,
                mainEntryPointFilePath: emittedEntry,
                bundledPackages: [],
                compiler: {
                    // R.W4b — the FULL static surface transitively references
                    // ambient DOM lib globals from the modern CSS Scroll-driven-
                    // Animations spec (`ScrollAxis`, used by `orchestration/
                    // timeline/native.ts`'s `NativeTimelineSpec`). An EMPTY
                    // `compilerOptions` makes API Extractor's internal compiler
                    // fall to the TS default `lib` (no modern DOM), so it cannot
                    // FOLLOW the ambient `ScrollAxis` symbol and throws the
                    // "Unable to follow symbol" internal defect. Pin the SAME
                    // `target`/`lib` the library tsconfig type-checks against so
                    // every ambient global the surface references RESOLVES.
                    overrideTsconfig: {
                        compilerOptions: {
                            target: "ES2022",
                            lib: ["ES2022", "ES2023", "DOM"],
                            // The emitted roll-up entry re-exports zone barrels by
                            // DIRECTORY specifier (`export * as presets from
                            // "../presets"` → `../presets/index.d.ts`). API
                            // Extractor's internal compiler must resolve those the
                            // way the project does, or it throws
                            // `getResolvedModule() could not resolve "../presets"`.
                            // Mirror the library tsconfig's module resolution.
                            module: "ESNext",
                            moduleResolution: "bundler",
                            skipLibCheck: true,
                        },
                    },
                },
                apiReport: { enabled: false },
                docModel: { enabled: false },
                tsdocMetadata: { enabled: false },
                dtsRollup: {
                    enabled: true,
                    untrimmedFilePath: extractorRollup,
                },
                messages: {
                    compilerMessageReporting: { default: { logLevel: "none" } },
                    extractorMessageReporting: { default: { logLevel: "none" } },
                    tsdocMessageReporting: { default: { logLevel: "none" } },
                },
            };
            const prepared = ExtractorConfig.prepare({
                configObject: config as IConfigFile,
                configObjectFullPath: undefined,
                packageJsonFullPath: path.resolve(root, "package.json"),
            });
            const result = Extractor.invoke(prepared, {
                localBuild: true,
                showVerboseMessages: false,
            });
            if (!result.succeeded || !fs.existsSync(extractorRollup)) {
                this.warn(
                    "kf-engine-dts-rollup: API Extractor did not produce a roll-up",
                );
                return;
            }

            // 3. Install the roll-up at the stable subpath the exports map points
            //    at. value.js stays a bare external import (matches the .js graph).
            fs.mkdirSync(path.dirname(distEngine), { recursive: true });
            fs.copyFileSync(extractorRollup, distEngine);
            fs.rmSync(tmp, { recursive: true, force: true });
        },
    };
}

/**
 * Vite plugin: makes CSS <link> tags for lazy vendor chunks non-render-blocking.
 * Converts `<link rel="stylesheet" href="...pattern...">` to use
 * `media="print" onload="this.media='all'"` so they don't block first paint.
 */
function deferLazyCSSPlugin(patterns: string[]): Plugin {
    return {
        name: "defer-lazy-css",
        enforce: "post",
        transformIndexHtml(html) {
            for (const pattern of patterns) {
                const re = new RegExp(
                    `<link rel="stylesheet"([^>]*href="[^"]*${pattern}[^"]*"[^>]*)>`,
                    "g",
                );
                html = html.replace(re, (_, attrs) => {
                    return `<link rel="stylesheet"${attrs} media="print" onload="this.media='all'">`;
                });
            }
            return html;
        },
    };
}

/**
 * Vite plugin: inlines critical CSS and defers the main stylesheet.
 *
 * Extracts :root custom properties + @layer base rules from the built CSS,
 * inlines them in <head> as <style>, and converts the main <link> to
 * non-render-blocking (media="print" + onload swap).
 *
 * This eliminates the main CSS from the critical rendering path while
 * preserving correct styling for the loading skeleton and first paint.
 */
function criticalCSSPlugin(): Plugin {
    return {
        name: "critical-css-inline",
        enforce: "post",
        transformIndexHtml: {
            order: "post",
            handler(html, ctx) {
                // Only run in build mode (ctx.bundle exists)
                if (!ctx.bundle) return html;

                // Find the main CSS asset in the bundle
                const cssAsset = Object.values(ctx.bundle).find(
                    (a): a is Extract<typeof a, { type: "asset" }> =>
                        a.type === "asset" &&
                        typeof a.fileName === "string" &&
                        a.fileName.endsWith(".css") &&
                        a.fileName.includes("index"),
                );

                if (!cssAsset || typeof cssAsset.source !== "string") return html;

                const fullCSS = cssAsset.source;

                // Extract only the minimum CSS for correct first-paint:
                // - Color tokens (background, foreground, card) for skeleton
                // - Color-scheme for dark mode
                // - Body reset (overflow, margin)
                // We hand-write a small critical block instead of regex-extracting
                // from the bundle, keeping it under 2KB.
                const criticalRulesManual = `
:root {
    color-scheme: light;
    --background: hsl(0 0% 100%);
    --foreground: hsl(222.2 84% 4.9%);
    --card: hsl(0 0% 100%);
    --border: hsl(214.3 31.8% 91.4%);
    --muted-foreground: hsl(215.4 16.3% 46.9%);
    --shadow-color: hsl(0 0% 0%);
    --radius-pill: 9999px;
    --radius-card: 1rem;
    --glass-bg-medium: color-mix(in srgb, var(--card) 65%, transparent);
    --glass-border-subtle: color-mix(in srgb, var(--foreground) 8%, transparent);
    --glass-blur-subtle: blur(4px) saturate(1.05);
    --glass-highlight: inset 0 0.5px 0 0 hsl(0 0% 100% / 0.25);
}
.dark {
    color-scheme: dark;
    --background: hsl(224 71% 4%);
    --foreground: hsl(210 40% 98%);
    --card: hsl(224 50% 10%);
    --border: hsl(216 34% 17%);
    --muted-foreground: hsl(215 20.2% 65.1%);
    --glass-highlight: inset 0 0.5px 0 0 hsl(0 0% 100% / 0.08);
}
*, *::before, *::after { box-sizing: border-box; border-color: var(--border); }
html, body {
    background-color: var(--background);
    color: var(--foreground);
    overflow: hidden;
    margin: 0;
    padding: 0;
    min-height: 100dvh;
    width: 100%;
}
`;
                const criticalPatterns: RegExp[] = [];

                const criticalCSS = criticalRulesManual;

                // Inline critical CSS before the main stylesheet link
                const inlineStyle = `<style data-critical>${criticalCSS}</style>`;

                // Find the main CSS <link> and make it non-render-blocking
                const mainCSSLink = new RegExp(
                    `<link rel="stylesheet"([^>]*href="[^"]*index-[^"]*\\.css"[^>]*)>`,
                );

                html = html.replace(mainCSSLink, (_, attrs) => {
                    return `${inlineStyle}\n      <link rel="stylesheet"${attrs} media="print" onload="this.media='all'">\n      <noscript><link rel="stylesheet"${attrs}></noscript>`;
                });

                return html;
            },
        },
    };
}

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
            "@styles": path.resolve(import.meta.dirname, "demo/@/styles"),
            "@components": path.resolve(import.meta.dirname, "demo/@/components"),
            "@utils": path.resolve(import.meta.dirname, "demo/@/utils"),
            "@composables": path.resolve(import.meta.dirname, "demo/@/composables"),
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
const DEMO_DEFAULT_OUTDIR = path.resolve(import.meta.dirname, "./dist/demo-app/");

/**
 * I.W5.S2 — the dev SPA history-fallback must 404 asset-extension MISSES
 * HONESTLY. Vite's `spaFallbackMiddleware` rewrites ANY extensionless-or-
 * `.html`-accepting request to `index.html`; but an `Accept: * / *` request for
 * a file-extension'd asset (`*.svg`, `*.png`, …) that misses on disk ALSO falls
 * through to `index.html` (HTTP 200, text/html) when nothing else serves it —
 * which is how a stale importer of a renamed-away glyph (`easing-icon-sm.svg`)
 * silently received HTML where an `<svg>` was expected (B9-a), invisible to the
 * network tab and the gate.
 *
 * Asset paths and route paths are DIFFERENT NAMESPACES: the SPA fallback belongs
 * to ROUTES, never to file-extension'd asset requests. This middleware registers
 * DIRECTLY in `configureServer` (so it sits AHEAD of Vite's internal
 * `htmlFallbackMiddleware` in the stack) and, for any request whose pathname has
 * an asset-file extension, neutralizes the index.html rewrite — so a MISS surfaces
 * as an honest 404 in the network tab and the runtime gate instead of masquerading
 * as a route. We do NOT 404 paths that a real resource will serve: a real asset is
 * served by Vite's static/transform layer regardless of `Accept`; only the
 * `index.html` fallback for an asset-extension MISS is suppressed.
 *
 * Scope: DEV server only (`apply: "serve"`). The built `dist/` is served by a
 * plain static server (the gate's `serveDist`) that already 404s a miss.
 */
const ASSET_EXTENSION_RE =
    /\.(svg|png|jpe?g|gif|webp|avif|ico|woff2?|ttf|otf|eot|mp4|webm|json|map|wasm)(\?.*)?$/i;

function assetExtension404Plugin(): Plugin {
    return {
        name: "kf-asset-extension-404",
        apply: "serve",
        configureServer(server) {
            // Register DIRECTLY in `configureServer` (NOT the returned post-hook):
            // a direct `server.middlewares.use()` runs at config time, BEFORE Vite
            // installs its internal `htmlFallbackMiddleware`, so we sit ahead of it
            // in the stack.
            //
            // Vite 8's `htmlFallbackMiddleware` rewrites a request to `/index.html`
            // ONLY when `req.headers.accept` is undefined / "" / includes
            // "text/html" / includes "*/*". For an asset-extension URL whose file
            // MISSES on disk, that rewrite is exactly the silent-mis-paint bug
            // (B9-a: `*.svg` → 200-HTML). We neutralize it for asset-extension
            // requests ONLY by setting a non-HTML `Accept`, so htmlFallback
            // declines to hijack the miss and the request falls through to Vite's
            // static/transform pipeline — which 404s a missing asset HONESTLY.
            //
            // An asset that EXISTS is unaffected: the static/transform layer serves
            // by URL resolution, not by `Accept`, so a real `*.svg` still 200s.
            server.middlewares.use((req, _res, next) => {
                const pathname = (req.url ?? "").split("?")[0];
                if (ASSET_EXTENSION_RE.test(pathname)) {
                    (req as { headers: Record<string, string> }).headers.accept =
                        "application/octet-stream";
                }
                next();
            });
        },
    };
}

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
                    // The bare `@mkbabb/value.js` string externalizes the barrel
                    // but NOT a subpath (rolldown exact-string / package-boundary
                    // match, not prefix — H4 smoke-test: bare → the `/math` source
                    // INLINES at 533B). The predicate `/^@mkbabb\/value\.js(\/|$)/`
                    // externalizes the barrel AND every subpath (`@mkbabb/value.js/
                    // math`), so the Q.WE2 leaves-externalize lands the `/math`
                    // consume as a BARE runtime edge (113B, resolved at the
                    // consumer) — NOT inlined. The boundary gate's W97
                    // `math-subpath-clean` clause verifies the subpath's graph is
                    // grammar-free before permitting it on the LIGHT surface.
                    external: [
                        "vue",
                        "prettier",
                        "@mkbabb/parse-that",
                        /^@mkbabb\/value\.js(\/|$)/,
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
        const lazyChunks = ["vendor-monaco", "vendor-three", "vendor-prettier", "vendor-highlight", "html2canvas"];

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
                        return deps.filter(dep => !lazyChunks.some(c => dep.includes(c)));
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
                ...(process.env.KF_ANALYZE
                    ? [
                          {
                              name: "kf-chunk-analyze",
                              generateBundle(_o: unknown, bundle: Record<string, any>) {
                                  const out: Record<string, unknown> = {};
                                  for (const [name, chunk] of Object.entries(bundle)) {
                                      if ((chunk as any).type !== "chunk") continue;
                                      out[name] = {
                                          isEntry: (chunk as any).isEntry,
                                          imports: (chunk as any).imports,
                                          dynamicImports: (chunk as any).dynamicImports,
                                          modules: Object.keys((chunk as any).modules ?? {}).map((m) =>
                                              m.replace(/^.*node_modules\//, "nm:").replace(import.meta.dirname + "/", ""),
                                          ),
                                      };
                                  }
                                  (this as any).emitFile({
                                      type: "asset",
                                      fileName: "_chunks.json",
                                      source: JSON.stringify(out, null, 2),
                                  });
                              },
                          },
                      ]
                    : []),
            ],
        };
    } else if (mode.mode === "playground") {
        // Playground demo: asset manager + multi-element animations
        return {
            ...defaultOptions,
            root: "./demo/playground/",
            resolve: {
                ...defaultOptions.resolve,
                conditions: devConditions,
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
            plugins: [...defaultPlugins],
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
