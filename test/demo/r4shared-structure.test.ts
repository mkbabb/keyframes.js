// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.r4shared · A2-KE-L1-15 — the demo tree is named by responsibility.
 *
 * One `describe` per limb of the row. Each reads the tree and the import graph
 * at the bytes: where a file lives, and who reaches it.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const has = (rel: string): boolean => existsSync(resolve(root, rel));
const read = (rel: string): string => readFileSync(resolve(root, rel), "utf8");
/** Every source file under `rel` (repo-relative paths). */
const walk = (rel: string): string[] =>
    readdirSync(resolve(root, rel)).flatMap((name) => {
        const child = join(rel, name);
        if (statSync(resolve(root, child)).isDirectory()) return walk(child);
        return /\.(vue|ts|css)$/.test(name) ? [child] : [];
    });
/** The module specifiers a file imports (static, dynamic and `src=`). */
const specifiers = (rel: string): string[] =>
    [...read(rel).matchAll(/(?:from|import\()\s*["']([^"']+)["']/g)].map((m) => m[1]!);

describe("limb (h) — a key lives with the keys, and a file is named for its component", () => {
    it("SCENE_ANNOUNCER_KEY is declared in injectionKeys.ts, not in a component", () => {
        expect(read("demo/components/instrument/transport/injectionKeys.ts")).toMatch(
            /^export const SCENE_ANNOUNCER_KEY\b/m,
        );
        const declared = walk("demo").filter((f) => /^export const SCENE_ANNOUNCER_KEY\b/m.test(read(f)));
        expect(declared).toEqual(["demo/components/instrument/transport/injectionKeys.ts"]);
        // no reader reaches a `.vue` file for a key
        for (const f of walk("demo")) {
            if (!/\bSCENE_ANNOUNCER_KEY\b/.test(read(f))) continue;
            for (const s of specifiers(f)) expect(`${f} <- ${s}`).not.toMatch(/EditorShell\.vue$/);
        }
    });

    it("the Suspense fallback is SceneSkeleton.vue", () => {
        expect(has("demo/app/SceneSkeleton.vue")).toBe(true);
        expect(has("demo/app/App.skeleton.vue")).toBe(false);
        expect(read("demo/app/App.vue")).toMatch(/import SceneSkeleton from "\.\/SceneSkeleton\.vue";/);
        // the name is the file's, so nothing has to declare it
        expect(read("demo/app/SceneSkeleton.vue")).not.toMatch(/defineOptions/);
    });
});

describe("limb (c) — the document-level chrome is the app's, mounted once", () => {
    it("DemoGlobalChrome lives in demo/app and App.vue is its one mount", () => {
        expect(has("demo/app/DemoGlobalChrome.vue")).toBe(true);
        expect(has("demo/components/instrument/transport/components")).toBe(false);
        const mounts = walk("demo").filter((f) => /<DemoGlobalChrome\b/.test(read(f).replace(/<!--[\s\S]*?-->/g, "")));
        expect(mounts).toEqual(["demo/app/App.vue"]);
        // above every scene key: a sibling of the Toaster, outside EditorShell's slots
        const app = read("demo/app/App.vue").replace(/<!--[\s\S]*?-->/g, "");
        expect(app.indexOf("<DemoGlobalChrome")).toBeGreaterThan(app.indexOf("</EditorShell>"));
    });
});
