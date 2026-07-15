import {
    Extractor,
    ExtractorConfig,
    ExtractorLogLevel,
    type IConfigFile,
} from "@microsoft/api-extractor";
import fs from "fs";
import os from "os";
import path from "path";
import ts from "typescript";
import type { Plugin } from "vite";

/**
 * Emit a self-contained `dist/engine/index.d.ts` rollup for the `./engine`
 * package subpath.
 *
 * vite-plugin-dts bundles only its first library entry reliably. This plugin
 * therefore owns the engine declaration graph end-to-end after that plugin has
 * finished: TypeScript emits the graph to a temporary directory, API Extractor
 * rolls it into one file, and the result is installed at the stable export-map
 * path.
 */
export function engineDtsRollupPlugin(): Plugin {
    return {
        name: "kf-engine-dts-rollup",
        apply: "build",
        enforce: "post",
        async closeBundle() {
            const root = import.meta.dirname;
            // The public composition barrel is the full static mirror of the
            // heavy engine surface. The installed path remains unchanged.
            const entry = path.resolve(
                root,
                "../../../src/animation/public.ts",
            );
            const projectRoot = path.resolve(root, "../../..");
            const distEngine = path.resolve(
                projectRoot,
                "dist/engine/index.d.ts",
            );
            if (!fs.existsSync(entry)) return;

            const tmp = fs.mkdtempSync(
                path.join(os.tmpdir(), "kf-engine-dts-"),
            );
            const configPath = ts.findConfigFile(
                projectRoot,
                ts.sys.fileExists,
                "tsconfig.lib.json",
            );
            const parsed = configPath
                ? ts.parseJsonConfigFileContent(
                      ts.readConfigFile(configPath, ts.sys.readFile).config,
                      ts.sys,
                      path.dirname(configPath),
                  )
                : { options: {} as ts.CompilerOptions };
            const program = ts.createProgram([entry], {
                ...parsed.options,
                declaration: true,
                emitDeclarationOnly: true,
                noEmit: false,
                outDir: tmp,
                rootDir: path.resolve(projectRoot, "src/animation"),
                skipLibCheck: true,
            });
            program.emit(undefined, undefined, undefined, true);

            const emittedEntry = path.join(tmp, "public.d.ts");
            if (!fs.existsSync(emittedEntry)) {
                this.error(
                    "kf-engine-dts-rollup: engine declarations did not emit " +
                        `(expected ${emittedEntry}). The ./engine subpath d.ts ` +
                        "roll-up cannot regenerate; refusing to ship a stale artifact.",
                );
            }

            const extractorRollup = path.join(tmp, "engine-rollup.d.ts");
            const config: IConfigFile = {
                projectFolder: projectRoot,
                mainEntryPointFilePath: emittedEntry,
                bundledPackages: [],
                compiler: {
                    // Match the library compiler so API Extractor can follow DOM
                    // globals and directory-specifier re-exports in the surface.
                    overrideTsconfig: {
                        compilerOptions: {
                            target: "ES2022",
                            lib: ["ES2022", "ES2023", "DOM"],
                            module: "ESNext",
                            moduleResolution: "bundler",
                            skipLibCheck: true,
                        },
                    },
                },
                apiReport: { enabled: false },
                docModel: { enabled: false },
                tsdocMetadata: { enabled: false },
                dtsRollup: {
                    enabled: true,
                    publicTrimmedFilePath: extractorRollup,
                },
                messages: {
                    compilerMessageReporting: {
                        default: { logLevel: ExtractorLogLevel.None },
                    },
                    extractorMessageReporting: {
                        default: { logLevel: ExtractorLogLevel.None },
                    },
                    tsdocMessageReporting: {
                        default: { logLevel: ExtractorLogLevel.None },
                    },
                },
            };
            const prepared = ExtractorConfig.prepare({
                configObject: config as IConfigFile,
                configObjectFullPath: undefined,
                packageJsonFullPath: path.resolve(projectRoot, "package.json"),
            });
            const result = Extractor.invoke(prepared, {
                localBuild: true,
                showVerboseMessages: false,
            });
            if (!result.succeeded || !fs.existsSync(extractorRollup)) {
                this.error(
                    "kf-engine-dts-rollup: API Extractor did not produce a " +
                        `roll-up (succeeded=${result.succeeded}, exists=${fs.existsSync(
                            extractorRollup,
                        )}). Refusing to ship a stale ./engine subpath d.ts.`,
                );
            }

            fs.mkdirSync(path.dirname(distEngine), { recursive: true });
            fs.copyFileSync(extractorRollup, distEngine);
            fs.rmSync(tmp, { recursive: true, force: true });
        },
    };
}
