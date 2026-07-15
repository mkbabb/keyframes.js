import path from "path";
import type { Plugin } from "vite";

const PROJECT_ROOT = path.resolve(import.meta.dirname, "../../..");

/** Emit a compact chunk/import/module map when `KF_ANALYZE=1`. */
export function chunkAnalyzerPlugin(): Plugin {
    return {
        name: "kf-chunk-analyze",
        generateBundle(_options, bundle) {
            const out: Record<string, unknown> = {};
            for (const [name, item] of Object.entries(bundle)) {
                if (item.type !== "chunk") continue;
                out[name] = {
                    isEntry: item.isEntry,
                    imports: item.imports,
                    dynamicImports: item.dynamicImports,
                    modules: Object.keys(item.modules).map((moduleId) =>
                        moduleId
                            .replace(/^.*node_modules\//, "nm:")
                            .replace(`${PROJECT_ROOT}/`, ""),
                    ),
                };
            }
            this.emitFile({
                type: "asset",
                fileName: "_chunks.json",
                source: JSON.stringify(out, null, 2),
            });
        },
    };
}
