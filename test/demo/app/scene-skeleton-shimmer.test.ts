/**
 * C3-KF-01 (OD19 repair 3, OD19-V6 "skeleton shimmer", all apps) — the scene
 * fallback wears glass's owner-ruled Skeleton `shimmer` (glass 10.1.1,
 * O-102b(3)): the producer's travelling sheen, not a local animation and not
 * the breathe. The pin is exactly 10.1.1 with the registry's integrity, the
 * release that ships the prop (and the dock collapse closing its seats'
 * overlays).
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { mount } from "@vue/test-utils";
import SceneSkeleton from "../../../demo/app/SceneSkeleton.vue";

const ROOT = join(__dirname, "../../..");
const GLASS_10_1_1_INTEGRITY =
    "sha512-7e/gAShdoQRwfjyUplOu0jOiKTmOIErb+5AsLsDq6G4xyHjcucYCQB8oqkv4z7C+MLlravHE0bJzeU/cIQQ8pQ==";

describe("SceneSkeleton — glass's shimmer", () => {
    it("pins @mkbabb/glass-ui to exactly 10.1.1, lockfile integrity equal to the registry's", () => {
        const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
        expect(pkg.devDependencies["@mkbabb/glass-ui"]).toBe("10.1.1");
        const lock = JSON.parse(readFileSync(join(ROOT, "package-lock.json"), "utf8"));
        const entry = lock.packages["node_modules/@mkbabb/glass-ui"];
        expect(entry.version).toBe("10.1.1");
        expect(entry.integrity).toBe(GLASS_10_1_1_INTEGRITY);
    });

    it("the stage placeholder's Skeleton carries the producer's shimmer", () => {
        const wrapper = mount(SceneSkeleton);
        const sheen = wrapper.find(".scene-skeleton__sheen");
        expect(sheen.exists()).toBe(true);
        expect(sheen.attributes("data-shimmer")).toBeDefined();
        wrapper.unmount();
    });
});
