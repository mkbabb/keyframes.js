import { defineConfig } from "vite";
import path from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
    base: "./",
    build: {
        minify: true,
        lib: {
            entry: path.resolve(__dirname, "src/animation.ts"),
            name: "Animation",
            fileName: "@mkbabb/animation",
        },
        rollupOptions: {},
    },
    plugins: [dts()],
});
