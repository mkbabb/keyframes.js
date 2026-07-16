import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "../..");
const testRoot = path.join(root, "test");
const animationRoot = path.join(root, "src/animation");
const infrastructureDirs = new Set([
    "_root",
    "characterization",
    "demo",
    "fixtures",
    "stubs",
    "support",
]);

function testFiles(directory: string): string[] {
    return readdirSync(directory).flatMap((entry) => {
        const absolute = path.join(directory, entry);
        return statSync(absolute).isDirectory()
            ? testFiles(absolute)
            : entry.endsWith(".test.ts")
              ? [absolute]
              : [];
    });
}

function importSpecifiers(file: string): string[] {
    const source = readFileSync(file, "utf8");
    const imports = Array.from(
        source.matchAll(/(?:from\s*|import\s*\()(["'])([^"']+)\1/g),
    ).flatMap((match) => (match[2] === undefined ? [] : [match[2]]));
    return [...new Set(imports)];
}

describe("test area mirror", () => {
    it("maps every library test area to an animation zone", () => {
        const animationZones = new Set(
            readdirSync(animationRoot).filter((entry) =>
                statSync(path.join(animationRoot, entry)).isDirectory(),
            ),
        );
        const libraryAreas = readdirSync(testRoot).filter((entry) => {
            const absolute = path.join(testRoot, entry);
            return (
                statSync(absolute).isDirectory() &&
                !infrastructureDirs.has(entry)
            );
        });

        expect(
            libraryAreas.filter((area) => !animationZones.has(area)),
        ).toEqual([]);
    });

    it("keeps root-module tests in _root", () => {
        for (const file of testFiles(path.join(testRoot, "_root"))) {
            const rootImports = importSpecifiers(file).filter((specifier) =>
                /^\.\.\/\.\.\/src\/animation\/[^/]+$/.test(specifier),
            );
            expect(rootImports, path.relative(root, file)).not.toEqual([]);
        }
    });
});
