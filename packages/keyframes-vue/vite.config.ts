import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

/**
 * The build for `@mkbabb/keyframes-vue` — a thin library bundle. `vue` AND
 * `@mkbabb/keyframes.js` are EXTERNAL (peers — the consumer brings them), so the
 * adapter ships only its own ~80 lines. The heavy `CSSKeyframesAnimation` is
 * reached through the peer's `loadAnimationEngine()`, never bundled here.
 *
 * `vite-plugin-dts` rolls the source `.d.ts` up to `dist/keyframes-vue.d.ts` so
 * the published tarball satisfies the manifest's `types`/`exports` pointer (the
 * SAME tarball==files discipline the core library rides).
 *
 * The dts knobs mirror the CORE library's vite.config.ts (the load-bearing
 * lessons it records, lines 314-347):
 *   - `bundleTypes: true` is the vite-plugin-dts 5 (unplugin-dts) roll-up flag.
 *     v4's `rollupTypes` is SILENTLY IGNORED in v5 (no validation error) — using
 *     it leaves per-module `.d.ts` under `dist/src/` and NO rolled
 *     `keyframes-vue.d.ts`. `@microsoft/api-extractor` is its OPTIONAL peer
 *     (a devDependency here); without it the roll-up no-ops the same way.
 *   - `entryRoot` AND `compilerOptions.rootDir` BOTH pin to `src/` so TSC's emit
 *     location and the plugin's rollup-stub path (`relative(entryRoot, entry)`)
 *     stay in lockstep — else the stub-writer rolls up an empty `export {}`.
 *
 * The peer types (`@mkbabb/keyframes.js`, `vue`) stay EXTERNAL — the consumer
 * brings them. `@mkbabb/value.js` is INLINED (a top-level devDependency + an
 * api-extractor bundled package): the peer's `InputAnimationOptions.hueMethod`
 * references `HueInterpolationMethod` from value.js, and the kf barrel does NOT
 * re-export it — so an external reference is non-portable (TS2883). Bundling
 * value.js inlines that one type, keeping the rolled `.d.ts` self-contained.
 */
export default defineConfig({
    plugins: [
        dts({
            bundleTypes: true,
            include: ["src/"],
            entryRoot: "src",
            tsconfigPath: "./tsconfig.json",
            compilerOptions: {
                rootDir: resolve(import.meta.dirname, "src"),
            },
            bundledPackages: ["@mkbabb/value.js"],
        }),
    ],
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
