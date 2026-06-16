import { defineConfig } from "vite";

/**
 * The build for `@mkbabb/keyframes-vue` — a thin library bundle. `vue` AND
 * `@mkbabb/keyframes.js` are EXTERNAL (peers — the consumer brings them), so the
 * adapter ships only its own ~80 lines. The heavy `CSSKeyframesAnimation` is
 * reached through the peer's `loadAnimationEngine()`, never bundled here.
 */
export default defineConfig({
    build: {
        lib: {
            entry: "src/index.ts",
            formats: ["es"],
            fileName: () => "keyframes-vue.js",
        },
        rollupOptions: {
            external: ["vue", "@mkbabb/keyframes.js"],
        },
        sourcemap: false,
        minify: false,
    },
});
