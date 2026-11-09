/**
 * C3-KF-01 (OD19 repair 3, OD19-V6 "skeleton shimmer", all apps) — the scene
 * fallback wears glass's owner-ruled Skeleton `shimmer` (glass 10.1.1,
 * O-102b(3)): the producer's travelling sheen, not a local animation and not
 * the breathe. The prop shipped in 10.1.1 (with the dock collapse closing its
 * seats' overlays). The pin is now exactly 11.0.0 with the registry's integrity
 * (value.js X §0hz.glass11; 10.1.3 was the dock-anchor cure, COHESION §0hb.2;
 * 11.0.0 moved DockTrigger to its own subpath and needs reka-ui >= 2.10).
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { mount } from "@vue/test-utils";
import SceneSkeleton from "../../../demo/app/SceneSkeleton.vue";

const ROOT = join(__dirname, "../../..");
const GLASS_11_0_0_INTEGRITY =
    "sha512-Y6C0hV/DUkwAiJq4g4tKBLpdEHlKL5r4cZ5pvckia4kxtKtvYiJdm8szmYWPV0sRpyE/Gr0GV0YaIpWGmvyEjA==";

describe("SceneSkeleton — glass's shimmer", () => {
    it("pins @mkbabb/glass-ui to exactly 11.0.0, lockfile integrity equal to the registry's", () => {
        const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
        expect(pkg.devDependencies["@mkbabb/glass-ui"]).toBe("11.0.0");
        const lock = JSON.parse(readFileSync(join(ROOT, "package-lock.json"), "utf8"));
        const entry = lock.packages["node_modules/@mkbabb/glass-ui"];
        expect(entry.version).toBe("11.0.0");
        expect(entry.integrity).toBe(GLASS_11_0_0_INTEGRITY);
    });

    it("the stage placeholder's Skeleton carries the producer's shimmer", () => {
        const wrapper = mount(SceneSkeleton);
        const sheen = wrapper.find(".scene-skeleton__sheen");
        expect(sheen.exists()).toBe(true);
        expect(sheen.attributes("data-shimmer")).toBeDefined();
        wrapper.unmount();
    });
});
