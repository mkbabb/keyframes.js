import { defineConfig } from "vite";
import path from "path";

import VueMacros from "unplugin-vue-macros/vite";
import Vue from "@vitejs/plugin-vue";

import dts from "vite-plugin-dts";

import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";

const defaultOptions = {
    base: "",

    css: {
        postcss: {
            plugins: [tailwind("./tailwind.config.ts"), autoprefixer()],
        },
    },

    resolve: {
        alias: {
            "@src": path.resolve(__dirname, "src"),
            "@styles": path.resolve(__dirname, "demo/@/styles"),
            "@components": path.resolve(__dirname, "demo/@/components"),
            "@utils": path.resolve(__dirname, "demo/@/utils"),
            "@assets": path.resolve(__dirname, "assets"),
        },
    },
};

const defaultPlugins = [
    // VueMacros({
    //     betterDefine: false,
    //     plugins: {
    //         vue: Vue(),
    //     },
    // }),
];

export default defineConfig((mode) => {
    if (mode.mode === "production") {
        return {
            ...defaultOptions,

            optimizeDeps: {
                // include: ["highlight.js"],

                noDiscovery: true,
            },
            build: {
                minify: false,
                sourcemap: true,

                lib: {
                    entry: path.resolve(__dirname, "src/parsing/index.ts"),
                    // name: "Keyframes",
                    fileName: "index",
                    formats: ["es", "cjs"],
                },
            },
            plugins: [...defaultPlugins],
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
            plugins: [...defaultPlugins],
        };
    } else {
        return {};
    }
});
