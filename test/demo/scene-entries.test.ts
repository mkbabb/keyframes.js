import { describe, expect, it } from "vitest";
import {
    allScenes,
    sceneMap,
    scenes,
    warmScene,
} from "../../demo/app/scene/scenes";

describe("demo scene entries", () => {
    it("exposes the six routable scenes in stable navigation order", () => {
        expect(scenes.map(({ id, label }) => [id, label])).toEqual([
            ["cube", "Cube"],
            ["amiga", "Amiga"],
            ["square", "Square"],
            ["easing", "Easing"],
            ["spring", "Spring"],
            ["sequence", "Sequence"],
        ]);
        expect(allScenes.map(({ id }) => id)).toEqual([
            "home",
            "cube",
            "amiga",
            "square",
            "easing",
            "spring",
            "sequence",
        ]);
    });

    it("resolves every routable id through the public lookup and warm seam", () => {
        for (const scene of allScenes) {
            expect(sceneMap.get(scene.id)).toBe(scene);
            expect(() => warmScene(scene.id)).not.toThrow();
        }
        expect(sceneMap.get("not-a-scene")).toBeUndefined();
        expect(() => warmScene("not-a-scene")).not.toThrow();
    });
});
