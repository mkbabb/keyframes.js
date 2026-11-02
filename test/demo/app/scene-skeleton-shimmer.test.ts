/**
 * C3-KF-01 (OD19 repair 3, OD19-V6 "skeleton shimmer", all apps) — the scene
 * fallback wears glass's owner-ruled Skeleton `shimmer` (glass 10.1.1,
 * O-102b(3)): the producer's travelling sheen, not a local animation and not
 * the breathe. The prop shipped in 10.1.1 (with the dock collapse closing its
 * seats' overlays). The pin is now exactly 10.1.3 with the registry's integrity
 * (X·KF.W3 .c5, COHESION §0hb.2: the dock-anchor cure, value O-114 / glass
 * O-110; 10.1.2 brought G-4 b-ii declared dock seats, O-101 live expanded
 * endpoint, the focusable aria-disabled DockTrigger).
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { mount } from "@vue/test-utils";
import SceneSkeleton from "../../../demo/app/SceneSkeleton.vue";

const ROOT = join(__dirname, "../../..");
const GLASS_10_1_3_INTEGRITY =
    "sha512-URKzGBjP3cwx9GUoyzH6/dGInNlRE0RjIivaqXg+SdeOT1dQ4lJ9gnTJK2tIQNIcFp1en/i97k7rw/iDOi+0lg==";

describe("SceneSkeleton — glass's shimmer", () => {
    it("pins @mkbabb/glass-ui to exactly 10.1.3, lockfile integrity equal to the registry's", () => {
        const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
        expect(pkg.devDependencies["@mkbabb/glass-ui"]).toBe("10.1.3");
        const lock = JSON.parse(readFileSync(join(ROOT, "package-lock.json"), "utf8"));
        const entry = lock.packages["node_modules/@mkbabb/glass-ui"];
        expect(entry.version).toBe("10.1.3");
        expect(entry.integrity).toBe(GLASS_10_1_3_INTEGRITY);
    });

    it("the stage placeholder's Skeleton carries the producer's shimmer", () => {
        const wrapper = mount(SceneSkeleton);
        const sheen = wrapper.find(".scene-skeleton__sheen");
        expect(sheen.exists()).toBe(true);
        expect(sheen.attributes("data-shimmer")).toBeDefined();
        wrapper.unmount();
    });
});
