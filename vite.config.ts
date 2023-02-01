import { defineConfig } from "vite";
import path from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
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
    plugins: [dts()],
});
