import { defineConfig, type Plugin } from "vite";
import path from "path";

import Vue from "@vitejs/plugin-vue";

import dts from "vite-plugin-dts";

import tailwindcss from "@tailwindcss/postcss";

/**
 * Vite plugin: makes CSS <link> tags for lazy vendor chunks non-render-blocking.
 * Converts `<link rel="stylesheet" href="...vendor-monaco...">` to use
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

const defaultOptions = {
    css: {
        postcss: {
            plugins: [tailwindcss()],
        },
    },

    resolve: {
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
                rollupOptions: {
                    external: ["vue", "prettier", "@mkbabb/parse-that", "@mkbabb/value.js"],
                },
            },
            esbuild: {
                drop: ["console", "debugger"],
            },
            plugins: [...defaultPlugins, dts({ rollupTypes: true, include: ["src/"] })],
        };
    } else if (mode.mode === "gh-pages") {
        // Heavy lazy chunks that should NOT be modulepreloaded or render-blocking
        const lazyChunks = ["vendor-monaco", "vendor-three", "vendor-prettier", "vendor-highlight", "html2canvas"];

        return {
            ...defaultOptions,
            base: "./",
            root: "./demo/app/",
            build: {
                outDir: path.resolve(import.meta.dirname, "./dist/"),
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
                rollupOptions: {
                    output: {
                        manualChunks(id) {
                            if (id.includes("node_modules")) {
                                if (id.includes("three")) return "vendor-three";
                                if (id.includes("monaco")) return "vendor-monaco";
                                if (id.includes("prettier")) return "vendor-prettier";
                                if (id.includes("highlight")) return "vendor-highlight";
                                if (id.includes("reka-ui")) return "vendor-reka-ui";
                                if (id.includes("lucide")) return "vendor-lucide";
                            }
                        },
                    },
                },
            },
            plugins: [...defaultPlugins, deferLazyCSSPlugin(["vendor-monaco"])],
        };
    } else if (mode.mode === "playground") {
        // Playground demo: asset manager + multi-element animations
        return {
            ...defaultOptions,
            root: "./demo/playground/",
            optimizeDeps: {
                include: [
                    "vue",
                    "reka-ui",
                    "@vueuse/core",
                    "lucide-vue-next",
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
            optimizeDeps: {
                include: [
                    "vue",
                    "reka-ui",
                    "@vueuse/core",
                    "lucide-vue-next",
                    "vue-sonner",
                ],
            },
            plugins: [...defaultPlugins],
        };
    }
});
