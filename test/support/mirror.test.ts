import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "../..");
const testRoot = path.join(root, "test");
const animationRoot = path.join(root, "src/animation");
const infrastructureDirs = new Set([
    "_root",
    "demo",
    "fixtures",
    "stubs",
    "support",
]);
const demoAreas = new Set(["app", "instrument", "scenes", "state"]);

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
        (match) => match[2],
    );
    const inspectedModules = Array.from(
        source.matchAll(/(["'])([^"']*demo\/[^"']+)\1/g),
        (match) => match[2],
    );
    return [...new Set([...imports, ...inspectedModules])];
}

function demoImportArea(specifier: string): string | undefined {
    const normalized = specifier.replaceAll("\\", "/");
    if (/demo\/scenes\//.test(normalized)) return "scenes";
    if (/demo\/app\//.test(normalized) || normalized.startsWith("@app"))
        return "app";
    if (
        /demo\/(?:@\/)?state\//.test(normalized) ||
        normalized.startsWith("@state")
    ) {
        return "state";
    }
    if (
        /(?:components\/.*instrument|\/instrument\/)/.test(normalized) ||
        /(?:iosTextEntry|useThrottledReadout)/.test(normalized)
    ) {
        return "instrument";
    }
    return undefined;
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

    it("files every demo test under one of its imported areas", () => {
        const demoRoot = path.join(testRoot, "demo");
        const looseTests = readdirSync(demoRoot).filter((entry) =>
            entry.endsWith(".test.ts"),
        );
        expect(looseTests).toEqual([]);

        for (const area of readdirSync(demoRoot)) {
            const areaRoot = path.join(demoRoot, area);
            if (!statSync(areaRoot).isDirectory()) continue;
            expect(demoAreas.has(area), area).toBe(true);

            for (const file of testFiles(areaRoot)) {
                const importedAreas = new Set(
                    importSpecifiers(file)
                        .map(demoImportArea)
                        .filter((item): item is string => item !== undefined),
                );
                expect(importedAreas.has(area), path.relative(root, file)).toBe(
                    true,
                );
            }
        }
    });
});
