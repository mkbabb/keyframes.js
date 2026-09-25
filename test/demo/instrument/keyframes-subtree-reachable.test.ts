/**
 * X.KF.W13X.keyframes — KFE-ORPHAN · A2-KE-L1-1 (AUDIT-2 Lens 1, "dead
 * components"). The falsifier for the keyframes folder's LIVE surface.
 *
 * The folder held a second editor — `KeyframesEditor.vue` with its card list,
 * its cards, its add dialog, a toolbar-keyboard composable and a contenteditable
 * helper — that no product file mounted after `e69f7731` retired its one mount
 * (the spring inline editor, UIA-KF-044, owner OA-37/46/51: ONE keyframes
 * editor, the shared pane). Live tests kept it importable, so nothing failed
 * while it rotted. This file makes that state a failure:
 *
 *   (1) every code module under `demo/components/instrument/keyframes/` is
 *       reachable from a product importer OUTSIDE the folder (the import graph,
 *       walked from source text with the demo's own aliases, `vite.config.ts`);
 *   (2) the editor barrel (`useKeyframesEditor`) returns only what its
 *       consumer reads — every returned member is destructured at a call site.
 *
 * RED at the parent bytes (six unreachable modules; ten unread members), GREEN
 * after the delete.
 */
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../../..");
const DEMO = path.join(ROOT, "demo");
const FOLDER = path.join(DEMO, "components/instrument/keyframes");

const ALIASES: Record<string, string> = {
    "@components": path.join(DEMO, "components"),
    "@utils": path.join(DEMO, "utils"),
    "@state": path.join(DEMO, "state"),
    "@styles": path.join(DEMO, "styles"),
    "@app": path.join(DEMO, "app"),
    "@composables": path.join(DEMO, "composables"),
};

const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
        const full = path.join(dir, name);
        if (statSync(full).isDirectory()) return walk(full);
        return /\.(vue|ts)$/.test(name) && !name.endsWith(".d.ts") ? [full] : [];
    });

const SPECIFIER = /(?:from\s+|import\s*\(\s*|import\s+)["']([^"']+)["']/g;

const resolveSpecifier = (from: string, spec: string): string | undefined => {
    let base: string | undefined;
    if (spec.startsWith(".")) base = path.resolve(path.dirname(from), spec);
    else {
        const alias = Object.keys(ALIASES).find(
            (a) => spec === a || spec.startsWith(a + "/"),
        );
        if (alias) base = ALIASES[alias] + spec.slice(alias.length);
    }
    if (base === undefined) return undefined;
    for (const candidate of [base, base + ".ts", base + ".vue", path.join(base, "index.ts")]) {
        try {
            if (statSync(candidate).isFile()) return candidate;
        } catch {
            // not this candidate — the next one is tried
        }
    }
    return undefined;
};

const importsOf = (file: string): string[] =>
    [...readFileSync(file, "utf8").matchAll(SPECIFIER)]
        .map((m) => resolveSpecifier(file, m[1]!))
        .filter((r): r is string => r !== undefined);

describe("KFE-ORPHAN — the keyframes folder holds only what the product mounts", () => {
    it("(1) every code module in the folder is reachable from a product importer outside it", () => {
        const inside = walk(FOLDER);
        const outside = walk(DEMO).filter((f) => !f.startsWith(FOLDER + path.sep));
        const reached = new Set<string>();
        const queue = outside
            .flatMap(importsOf)
            .filter((f) => f.startsWith(FOLDER + path.sep));
        while (queue.length > 0) {
            const next = queue.pop()!;
            if (reached.has(next)) continue;
            reached.add(next);
            queue.push(...importsOf(next).filter((f) => f.startsWith(FOLDER + path.sep)));
        }
        const unreachable = inside
            .filter((f) => !reached.has(f))
            .map((f) => path.relative(FOLDER, f))
            .sort();
        expect(unreachable).toEqual([]);
    });

    it("(2) the editor barrel returns only members its consumer reads", () => {
        const barrel = readFileSync(
            path.join(FOLDER, "composables/useKeyframesEditor.ts"),
            "utf8",
        );
        const returned = [...barrel.slice(barrel.lastIndexOf("return {")).matchAll(/^\s{8}(\w+):/gm)].map(
            (m) => m[1]!,
        );
        const consumers = walk(DEMO)
            .map((f) => readFileSync(f, "utf8"))
            .filter((src) => /useKeyframesEditor\(/.test(src))
            .map((src) => src.slice(0, src.indexOf("useKeyframesEditor(")))
            .map((src) => src.slice(src.lastIndexOf("const {")));
        const unread = returned.filter(
            (member) => !consumers.some((destructure) => new RegExp(`\\b${member}\\b`).test(destructure)),
        );
        expect(returned.length).toBeGreaterThan(0);
        expect(unread).toEqual([]);
    });
});
