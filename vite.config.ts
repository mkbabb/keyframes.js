import { defineConfig } from "vite";
import path from "path";

import Vue from "@vitejs/plugin-vue";

import dts from "vite-plugin-dts";

import tailwindcss from "@tailwindcss/postcss";

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
                    formats: ["es", "cjs"],
                },
                rollupOptions: {
                    external: ["vue", "prettier"],
                },
            },
            esbuild: {
                drop: ["console", "debugger"],
            },
            plugins: [...defaultPlugins, dts({ rollupTypes: true, include: ["src/"] })],
        };
    } else if (mode.mode === "gh-pages") {
        return {
            ...defaultOptions,
            base: "./",
            root: "./demo/cube/",
            build: {
                outDir: path.resolve(import.meta.dirname, "./dist/"),
                emptyOutDir: true,
                minify: true,
                sourcemap: false,
                rollupOptions: {
                    output: {
                        manualChunks(id) {
                            if (id.includes("node_modules")) {
                                if (id.includes("three")) return "vendor-three";
                                if (id.includes("monaco")) return "vendor-monaco";
                                if (id.includes("prettier")) return "vendor-prettier";
                                if (id.includes("highlight")) return "vendor-highlight";
                            }
                        },
                    },
                },
            },
            plugins: [...defaultPlugins],
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
                    "monaco-editor",
                    "highlight.js/lib/core",
                    "prettier",
                ],
            },
            plugins: [...defaultPlugins],
        };
    } else {
        // Dev mode: serve the demo app with HMR
        return {
            ...defaultOptions,
            root: "./demo/cube/",
            optimizeDeps: {
                include: [
                    "vue",
                    "reka-ui",
                    "@vueuse/core",
                    "lucide-vue-next",
                    "vue-sonner",
                    "three",
                    "monaco-editor",
                    "highlight.js/lib/core",
                    "prettier",
                ],
            },
            plugins: [...defaultPlugins],
        };
    }
});
