import { defineConfig, type Plugin } from "vite";
import path from "path";

import Vue from "@vitejs/plugin-vue";

import dts from "vite-plugin-dts";

import tailwindcss from "@tailwindcss/postcss";

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
        // No hard `dist/` alias and no self-alias for any `@mkbabb/*` package.
        // `@mkbabb/keyframes.js` (this package) reaches its own source via the
        // `@src` alias / relative paths; `@mkbabb/glass-ui` + `@mkbabb/value.js`
        // (workspace siblings) resolve through their own `exports` maps via the
        // `file:` symlink in `node_modules`. See the cross-repo dev-resolution
        // contract — glass-ui/docs/precepts/cross-repo-dev-resolution.md §2.3.
        alias: {
            "@src": path.resolve(import.meta.dirname, "src"),
            "@styles": path.resolve(import.meta.dirname, "demo/@/styles"),
            "@components": path.resolve(import.meta.dirname, "demo/@/components"),
            "@utils": path.resolve(import.meta.dirname, "demo/@/utils"),
            "@composables": path.resolve(import.meta.dirname, "demo/@/composables"),
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

const defaultPlugins = [Vue()];

export default defineConfig((mode) => {
    if (mode.mode === "production") {
        return {
            ...defaultOptions,
            optimizeDeps: {},
            build: {
                minify: true,
                lib: {
                    entry: path.resolve(import.meta.dirname, "src/animation/index.ts"),
                    name: "Keyframes",
                    fileName: "keyframes",
                    formats: ["es"],
                },
                rolldownOptions: {
                    external: ["vue", "prettier", "@mkbabb/parse-that", "@mkbabb/value.js"],
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
        // Dev mode: serve the demo app with HMR
        return {
            ...defaultOptions,
            root: "./demo/app/",
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
    }
});
