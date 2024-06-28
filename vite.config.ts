import { defineConfig } from "vite";
import path from "path";

import VueMacros from "unplugin-vue-macros/vite";
import Vue from "@vitejs/plugin-vue";

import dts from "vite-plugin-dts";

import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";

const defaultOptions = {
    base: "./",
    css: {
        postcss: {
            plugins: [tailwind(), autoprefixer()],
        },
    },
    plugins: [
        VueMacros({
            plugins: {
                vue: Vue(),
            },
        }),
        dts({ rollupTypes: true }),
    ],
    resolve: {
        alias: {
            "@src": path.resolve(__dirname, "src"),
            "@styles": path.resolve(__dirname, "demo/@/styles"),
            "@components": path.resolve(__dirname, "demo/@/components"),
            "@utils": path.resolve(__dirname, "demo/@/utils"),
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
                    fileName: "keyframes",
                    formats: ["es", "cjs"],
                },
            },
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
        };
    } else {
        return {};
    }
});
