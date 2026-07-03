import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import tailwindcss from "@tailwindcss/postcss";
import path from "node:path";

// The repo root (two levels up from demo/stage-proto/).
const root = path.resolve(import.meta.dirname, "../..");

/**
 * A STANDALONE dev config for the SceneStage round-1 prototype (Tranche S). Roots
 * at demo/stage-proto/, reuses the demo's aliases + the keyframes self-alias +
 * the tailwind/postcss + svg-loader pipeline so the full design cascade and the
 * LIGHT kf barrel resolve exactly as the real app.
 */
export default defineConfig({
    root: path.resolve(import.meta.dirname),
    resolve: {
        conditions: ["module", "browser", "default"],
        alias: {
            "@src": path.resolve(root, "src"),
            "@mkbabb/keyframes.js": path.resolve(
                root,
                "src/animation/index.ts",
            ),
            "@styles": path.resolve(root, "demo/@/styles"),
            "@components": path.resolve(root, "demo/@/components"),
            "@utils": path.resolve(root, "demo/@/utils"),
            "@composables": path.resolve(root, "demo/@/composables"),
            "@app": path.resolve(root, "demo/app"),
            "@assets": path.resolve(root, "assets"),
        },
    },
    css: {
        postcss: {
            plugins: [tailwindcss()],
        },
    },
    plugins: [
        Vue(),
        svgLoader({
            defaultImport: "component",
            svgoConfig: {
                plugins: [
                    {
                        name: "preset-default",
                        params: {
                            overrides: {
                                convertColors: false,
                                removeViewBox: false,
                            },
                        },
                    },
                ],
            },
        }),
    ],
    server: { port: 5231, strictPort: true },
});
