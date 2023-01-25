import { defineConfig } from "vite";
import path from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
    base: "./",
    build: {
        minify: true,
        outDir: "dist",
        sourcemap: true,
        lib: {
            entry: {
                "@mkbabb/animation/index": "./src/animation.ts",
                "@mkbabb/animation/math": "./src/math.ts",
            },
            formats: ["es", "cjs"],
        },
    },
    plugins: [dts()],
});
