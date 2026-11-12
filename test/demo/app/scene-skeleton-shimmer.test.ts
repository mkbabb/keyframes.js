/**
 * C3-KF-01 (OD19 repair 3, OD19-V6 "skeleton shimmer", all apps) — the scene
 * fallback wears glass's owner-ruled Skeleton `shimmer` (glass 10.1.1,
 * O-102b(3)): the producer's travelling sheen, not a local animation and not
 * the breathe. The prop shipped in 10.1.1 (with the dock collapse closing its
 * seats' overlays). The pin is now exactly 11.0.1 with the registry's integrity
 * (value.js X §0hz.glass11; 10.1.3 was the dock-anchor cure, COHESION §0hb.2;
 * 11.0.0 moved DockTrigger to its own subpath and needs reka-ui >= 2.10;
 * 11.0.1 rounds the dock's end in every state and makes the labelled control's
 * hover plate a capsule).
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { mount } from "@vue/test-utils";
import SceneSkeleton from "../../../demo/app/SceneSkeleton.vue";

const ROOT = join(__dirname, "../../..");
const GLASS_11_0_1_INTEGRITY =
    "sha512-VyNBiQOjxE8pBbFQU6WqmQerqTveXcxtDYH5xL5KmXRwv84JUF2GDU9Woaje0JkcJV9RhWcj5hrb9g6o9j6N2Q==";

describe("SceneSkeleton — glass's shimmer", () => {
    it("pins @mkbabb/glass-ui to exactly 11.0.1, lockfile integrity equal to the registry's", () => {
        const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
        expect(pkg.devDependencies["@mkbabb/glass-ui"]).toBe("11.0.1");
        const lock = JSON.parse(readFileSync(join(ROOT, "package-lock.json"), "utf8"));
        const entry = lock.packages["node_modules/@mkbabb/glass-ui"];
        expect(entry.version).toBe("11.0.1");
        expect(entry.integrity).toBe(GLASS_11_0_1_INTEGRITY);
    });

    it("the stage placeholder's Skeleton carries the producer's shimmer", () => {
        const wrapper = mount(SceneSkeleton);
        const sheen = wrapper.find(".scene-skeleton__sheen");
        expect(sheen.exists()).toBe(true);
        expect(sheen.attributes("data-shimmer")).toBeDefined();
        wrapper.unmount();
    });
});
