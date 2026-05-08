#!/usr/bin/env node
/**
 * Freshness gate — fails loudly when `dist/` is older than `src/`.
 *
 * Mirrors glass-ui's `scripts/freshness-gate.mjs` per A3 §4.4 (same
 * stale-dist bug class). Wired as `prebuild` in `package.json` with
 * `--pre` permissive mode so it announces staleness in front of `vite
 * build` without blocking the very build that would fix it.
 *
 * Modes:
 *   - default (no flag): strict — exits 1 if newest src mtime exceeds
 *     `dist/keyframes.js` or `dist/keyframes.d.ts` mtime. CI / hard-gate use.
 *   - `--pre`: permissive — exits 0 always; warns if stale. Used in the
 *     `prebuild` lifecycle hook.
 */
import { readdirSync, statSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

function defaultRoot() {
    const url = import.meta.url;
    if (url && url.startsWith("file:")) {
        return resolve(fileURLToPath(new URL("../", url)));
    }
    return process.cwd();
}

const SRC_EXT = new Set([".ts", ".tsx", ".vue"]);
const SKIP_DIRS = new Set(["__tests__", "tests", "test", "node_modules", "dist"]);

function walkNewestMtime(dir) {
    let newest = 0;
    let newestPath = "";
    if (!existsSync(dir)) return { mtimeMs: 0, path: "" };
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (SKIP_DIRS.has(entry.name)) continue;
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
            const r = walkNewestMtime(full);
            if (r.mtimeMs > newest) {
                newest = r.mtimeMs;
                newestPath = r.path;
            }
        } else if (entry.isFile()) {
            const dot = entry.name.lastIndexOf(".");
            if (dot < 0) continue;
            const ext = entry.name.slice(dot);
            if (!SRC_EXT.has(ext)) continue;
            const m = statSync(full).mtimeMs;
            if (m > newest) {
                newest = m;
                newestPath = full;
            }
        }
    }
    return { mtimeMs: newest, path: newestPath };
}

export function checkFreshness({ root = defaultRoot() } = {}) {
    const reasons = [];
    const distDir = join(root, "dist");
    const srcDir = join(root, "src");

    if (!existsSync(distDir)) {
        reasons.push(
            `[keyframes.js freshness] dist/ does not exist — run \`npm run build\`.`,
        );
        return { ok: false, reasons };
    }
    const newest = walkNewestMtime(srcDir);
    if (newest.mtimeMs === 0) return { ok: true, reasons };

    const indexJs = join(distDir, "keyframes.js");
    const indexDts = join(distDir, "keyframes.d.ts");

    for (const artefact of [indexJs, indexDts]) {
        if (!existsSync(artefact)) {
            reasons.push(
                `[keyframes.js freshness] missing dist artefact ${artefact} — run \`npm run build\`.`,
            );
            continue;
        }
        const distMtime = statSync(artefact).mtimeMs;
        if (newest.mtimeMs > distMtime) {
            const srcDate = new Date(newest.mtimeMs).toISOString();
            const distDate = new Date(distMtime).toISOString();
            reasons.push(
                `[keyframes.js freshness] dist out of date for ${artefact} — ${newest.path} (${srcDate}) > dist (${distDate}). Run \`npm run build\`.`,
            );
        }
    }
    return { ok: reasons.length === 0, reasons };
}

const isMain =
    import.meta.url === `file://${process.argv[1]}` ||
    import.meta.url.endsWith(process.argv[1] ?? "");

if (isMain) {
    const isPreBuild = process.argv.slice(2).includes("--pre");
    const result = checkFreshness();
    if (!result.ok) {
        if (isPreBuild) {
            for (const r of result.reasons) console.warn(`[prebuild] ${r}`);
            process.exit(0);
        }
        for (const r of result.reasons) console.error(r);
        process.exit(1);
    }
    console.log("[keyframes.js freshness] dist/ is fresh.");
    process.exit(0);
}
