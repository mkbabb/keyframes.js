// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.r3res · C3r-4 / R-3 — the close's consumer residue.
 *
 * (1) The gh-pages build names no chunk for a package the demo no longer
 *     depends on (`highlight.js`, `html2canvas` were uninstalled at `.esc3`).
 * (2) The dock-edge seam is reached by the app's top dock AND the bottom
 *     transport dock, so it lives below both layers: a component never
 *     reaches up into `demo/app`.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const has = (rel: string): boolean => existsSync(resolve(root, rel));
const read = (rel: string): string => readFileSync(resolve(root, rel), "utf8");
const walk = (rel: string): string[] =>
    readdirSync(resolve(root, rel)).flatMap((name) => {
        const child = join(rel, name);
        if (statSync(resolve(root, child)).isDirectory()) return walk(child);
        return /\.(vue|ts|css)$/.test(name) ? [child] : [];
    });
const specifiers = (rel: string): string[] =>
    [...read(rel).matchAll(/(?:from|import\()\s*["']([^"']+)["']/g)].map((m) => m[1]!);

describe("(1) vite.config.ts names no uninstalled package", () => {
    it("no vendor-highlight / html2canvas chunk rule or lazy entry", () => {
        expect(read("vite.config.ts")).not.toMatch(/highlight|html2canvas/);
    });
});

describe("(2) the dock-edge seam lives below the app and the components", () => {
    it("dockEdge.ts is a demo composable, not an app file", () => {
        expect(has("demo/composables/dockEdge.ts")).toBe(true);
        expect(has("demo/app/dock/dockEdge.ts")).toBe(false);
    });

    it("no file under demo/components imports from demo/app", () => {
        const up = walk("demo/components").flatMap((f) =>
            specifiers(f)
                .filter((s) => /^@app\/|(^|\/)app\//.test(s))
                .map((s) => `${f} <- ${s}`),
        );
        expect(up).toEqual([]);
    });

    it("both docks read the seam from its one home", () => {
        for (const f of [
            "demo/app/dock/ChromeDock.vue",
            "demo/app/dock/menu/MbabbMenu.vue",
            "demo/components/instrument/transport/TransportDock.vue",
        ]) {
            expect(specifiers(f)).toContain("@composables/dockEdge");
        }
    });
});
