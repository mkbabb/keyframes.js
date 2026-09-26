/**
 * home-w13x — X.KF.W13X.home · the byte clauses of the unit's rows.
 *
 *   (1) the `vue-sonner` pin (KF-W13.md, the KF.W13X scope) — the demo's toasts
 *       are glass's `Toaster` / `toast()` (X.KF.W13V `.u`, UIA-KF-001/002), so
 *       nothing imports `vue-sonner`; the dependency, its lock entry and its
 *       dev pre-bundle entry are retired at the root, not kept as a dead pin.
 *   (2) UIA-KF-232 — SceneSkeleton's docblock states the structural contract
 *       only (no disposition history), and no comment names the removed
 *       `--radius-input` token (DESIGN.md records it renamed `--radius-media`).
 */
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(__dirname, "../../..");
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8");
function walk(dir: string, out: string[] = []): string[] {
    for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) walk(p, out);
        else if (/\.(vue|ts)$/.test(name)) out.push(p);
    }
    return out;
}

describe("X.KF.W13X.home — byte clauses", () => {
    it("(1) vue-sonner is retired: no importer, no declared dependency, no lock entry, no pre-bundle entry", () => {
        const importers = walk(join(ROOT, "demo")).filter((p) => /from\s+["']vue-sonner/.test(readFileSync(p, "utf8")));
        expect(importers).toEqual([]);
        const pkg = JSON.parse(read("package.json"));
        expect({ ...pkg.dependencies, ...pkg.devDependencies }["vue-sonner"]).toBeUndefined();
        const lock = JSON.parse(read("package-lock.json"));
        expect(lock.packages["node_modules/vue-sonner"]).toBeUndefined();
        expect(lock.packages[""].dependencies?.["vue-sonner"]).toBeUndefined();
        expect(read("vite.config.ts")).not.toMatch(/["']vue-sonner["']/);
    });

    it("(2) UIA-KF-232 — SceneSkeleton's docblock is the contract, not a history, and names no removed token", () => {
        const src = read("demo/app/App.skeleton.vue");
        const doc = src.match(/<script setup lang="ts">\s*(\/\*\*[\s\S]*?\*\/)/)![1]!;
        expect(doc.split("\n").length).toBeLessThanOrEqual(24);
        expect(doc).not.toMatch(/KF-SKEL-\d+/);
        expect(src).not.toMatch(/--radius-input/);
    });
});
