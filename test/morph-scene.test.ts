/**
 * S.B7 · S4 — Morph scene composable coverage (a25 F1 · fold row 40).
 *
 * Locks the `MORPH_SHAPES` catalog (the fromMorphSVG showcase's shape source —
 * every entry is a valid `d` in the `0 0 VIEW VIEW` user space) and smoke-
 * constructs `useMorphDemo` (scene-machine + warmed-engine wiring), so a
 * construction or shape-authoring regression reds here.
 */
import { beforeAll, describe, expect, it } from "vitest";
import { effectScope } from "vue";
import { MORPH_SHAPES, VIEW } from "../demo/scenes/morph/morphShapes";
import { MORPH_SUPER_KEY } from "../demo/scenes/morph/morphKeys";
import { warmKfEngine } from "../demo/@/utils/kfEngine";
import { useMorphDemo } from "../demo/scenes/morph/useMorphDemo";

describe("morphShapes — the morph target catalog", () => {
    it("carries ≥ 2 shapes, each with a unique id + a non-empty label", () => {
        expect(MORPH_SHAPES.length).toBeGreaterThanOrEqual(2);
        const ids = MORPH_SHAPES.map((s) => s.id);
        expect(new Set(ids).size).toBe(ids.length);
        for (const s of MORPH_SHAPES) {
            expect(s.label.length).toBeGreaterThan(0);
        }
    });

    it("every d is an absolute-move-opened, closed path in user space", () => {
        for (const s of MORPH_SHAPES) {
            expect(s.d.startsWith("M ")).toBe(true);
            expect(s.d.trimEnd().endsWith("Z")).toBe(true);
        }
        expect(VIEW).toBe(200);
    });

    it("the named archetypes are present", () => {
        const ids = new Set(MORPH_SHAPES.map((s) => s.id));
        expect(ids.has("triangle")).toBe(true);
        expect(ids.has("star")).toBe(true);
    });
});

describe("useMorphDemo construction", () => {
    beforeAll(async () => {
        await warmKfEngine();
    });

    it("constructs without throwing; transport superKey stable", () => {
        const scope = effectScope();
        const demo = scope.run(() => useMorphDemo())!;
        expect(demo).toBeTruthy();
        expect(MORPH_SUPER_KEY).toBe("Morph");
        scope.stop();
    });
});
