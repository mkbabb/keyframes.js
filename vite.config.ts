import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
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
                vue({
                    reactivityTransform: true,
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
                vue({
                    reactivityTransform: true,
                }),
            ],
        };
    }
});
