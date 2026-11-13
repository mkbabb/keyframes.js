// Owner order 2026-11-13: no browser runs in any GitHub Action. The browser
// oracles, the demo roster and Lighthouse run locally (`npm run preship`).
// This asserts the workflows stay that way.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const DIR = path.resolve(process.cwd(), ".github/workflows");
const BROWSER = /playwright|chromium|webkit|lighthouse|demo:correctness|KF_REQUIRE_BROWSER|preship/i;

describe("GitHub Actions run no browser", () => {
    const files = readdirSync(DIR).filter((f) => /\.ya?ml$/.test(f));

    it("finds the workflows", () => {
        expect(files).toContain("ci.yml");
    });

    for (const file of files) {
        it(`${file} launches no browser`, () => {
            const code = readFileSync(path.join(DIR, file), "utf8")
                .split("\n")
                .filter((line) => !line.trimStart().startsWith("#"))
                .map((line) => line.replace(/\s#\s.*$/, ""));
            expect(code.filter((line) => BROWSER.test(line))).toEqual([]);
        });
    }

    it("CI runs the shared gate script", () => {
        expect(readFileSync(path.join(DIR, "ci.yml"), "utf8")).toMatch(/run: npm run ci:actions/);
    });
});
