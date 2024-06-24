import { defineConfig } from "vite";
import path from "path";

import VueMacros from "unplugin-vue-macros/vite";
import Vue from "@vitejs/plugin-vue";

import dts from "vite-plugin-dts";
import autoprefixer from "autoprefixer";

const defaultOptions = {
    base: "./",
    css: {
        postcss: {
            plugins: [autoprefixer],
        },
    },
};

export default defineConfig((mode) => {
    if (mode.mode === "production") {
        return {
            ...defaultOptions,
            optimizeDeps: {
                include: ["highlight.js"],
            },
            build: {
                minify: true,
                lib: {
                    entry: path.resolve(__dirname, "src/animation.ts"),
                    name: "Keyframes",
                    fileName: "@mkbabb/keyframes",
                },
            },
            plugins: [
                dts(),
                VueMacros({
                    plugins: {
                        vue: Vue(),
                    },
                }),
            ],
        };
    } else if (mode.mode === "gh-pages") {
        return {
            ...defaultOptions,
            root: "./demo/cube/",
            build: {
                outDir: path.resolve(__dirname, "./dist/"),
                emptyOutDir: true,
                minify: true,
                sourcemap: true,
            },
            plugins: [
                VueMacros({
                    plugins: {
                        vue: Vue(),
                    },
                }),
            ],
        };
    } else {
        return {};
    }
});
