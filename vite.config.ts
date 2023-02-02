import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

export default defineConfig((mode) => {
    if (mode.mode === "production") {
        return {
            base: "./",
            build: {
                minify: true,
                lib: {
                    entry: path.resolve(__dirname, "src/animation.ts"),
                    name: "Keyframes",
                    fileName: "@mkbabb/keyframes",
                },
                rollupOptions: {},
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
            base: "./",
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
