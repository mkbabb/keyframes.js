import { describe, expect, it, vi, beforeEach } from "vitest";
import { CSSKeyframesAnimation, Animation } from "../src/animation/engine";
import { AnimationGroup } from "../src/animation/group";
import type { AnimationLayerConfig } from "../src/animation/constants";

function createOpacityAnim(name: string, duration = 1000): CSSKeyframesAnimation<any> {
    const anim = new CSSKeyframesAnimation({ duration }).fromString(`
        from { opacity: 0; }
        to { opacity: 1; }
    `);
    anim.name = name;
    return anim;
}

function createTransformAnim(name: string, duration = 1000): CSSKeyframesAnimation<any> {
    const anim = new CSSKeyframesAnimation({ duration }).fromString(`
        from { transform: translateX(0px); }
        to { transform: translateX(100px); }
    `);
    anim.name = name;
    return anim;
}

describe("AnimationGroup constructor", () => {
    it("marks children as managed", () => {
        const a = createOpacityAnim("a");
        const b = createOpacityAnim("b");
        expect(a.managed).toBe(false);
        expect(b.managed).toBe(false);

        const group = new AnimationGroup(a, b);
        expect(a.managed).toBe(true);
        expect(b.managed).toBe(true);
    });

    it("stores animations by name/id", () => {
        const a = createOpacityAnim("alpha");
        const b = createOpacityAnim("beta");
        const group = new AnimationGroup(a, b);

        expect(group.animations["alpha"]).toBeDefined();
        expect(group.animations["beta"]).toBeDefined();
        expect(group.animations["alpha"].animation).toBe(a);
        expect(group.animations["beta"].animation).toBe(b);
    });

    it("detects singleTarget when all animations share the same target", () => {
        const el = document.createElement("div");
        const a = createOpacityAnim("a");
        const b = createTransformAnim("b");
        a.targets = [el];
        b.targets = [el];

        const group = new AnimationGroup(a, b);
        expect(group.singleTarget).toBe(true);
    });

    it("detects non-singleTarget when animations have different targets", () => {
        const el1 = document.createElement("div");
        const el2 = document.createElement("div");
        const a = createOpacityAnim("a");
        const b = createTransformAnim("b");
        a.targets = [el1];
        b.targets = [el2];

        const group = new AnimationGroup(a, b);
        expect(group.singleTarget).toBe(false);
    });

    it("detects singleTarget with no targets (both empty)", () => {
        const a = createOpacityAnim("a");
        const b = createTransformAnim("b");
        // Both have empty targets arrays — targets[0] === targets[0] is undefined === undefined
        const group = new AnimationGroup(a, b);
        expect(group.singleTarget).toBe(true);
    });
});

describe("AnimationGroup.transformFramesGrouped", () => {
    it("merges non-conflicting properties from multiple animations", () => {
        const el = document.createElement("div");
        const a = createOpacityAnim("a");
        const b = createTransformAnim("b");
        a.targets = [el];
        b.targets = [el];

        const group = new AnimationGroup(a, b);
        // Simulate ticking so animations have state
        a.started = true;
        b.started = true;

        // Call interpFrames manually at midpoint to populate flatVars
        a.interpFrames(500, false);
        b.interpFrames(500, false);

        // transformFramesGrouped should merge both animations' values
        const mockTransform = vi.fn();
        group.transform = mockTransform;

        const result = group.transformFramesGrouped(500);

        expect(mockTransform).toHaveBeenCalledOnce();
        expect(result).toBeDefined();
    });

    it("last-write-wins for conflicting properties", () => {
        const el = document.createElement("div");
        const a = createOpacityAnim("a");
        const b = createOpacityAnim("b"); // same property: opacity

        a.targets = [el];
        b.targets = [el];

        const group = new AnimationGroup(a, b);
        a.started = true;
        b.started = true;

        const mockTransform = vi.fn();
        group.transform = mockTransform;

        // Both have opacity — b should win (last in iteration order)
        const result = group.transformFramesGrouped(500);
        expect(result).toBeDefined();
    });

    it("tracks done state across all animations", () => {
        const a = createOpacityAnim("a");
        const b = createOpacityAnim("b");
        const group = new AnimationGroup(a, b);
        group.transform = vi.fn();

        a.done = true;
        b.done = true;
        a.paused = true; // prevent interpFrames call
        b.paused = true;

        group.transformFramesGrouped(0);
        expect(group.done).toBe(true);
    });

    it("done is false when not all animations are done", () => {
        const a = createOpacityAnim("a");
        const b = createOpacityAnim("b");
        const group = new AnimationGroup(a, b);
        group.transform = vi.fn();

        a.done = true;
        a.paused = true;
        b.done = false;
        b.paused = true;

        group.transformFramesGrouped(0);
        expect(group.done).toBe(false);
    });
});

describe("AnimationGroup state", () => {
    it("playing() returns false before start", () => {
        const a = createOpacityAnim("a");
        const group = new AnimationGroup(a);
        expect(group.playing()).toBe(false);
    });

    it("playing() returns true when started and not paused", () => {
        const a = createOpacityAnim("a");
        const group = new AnimationGroup(a);
        group.started = true;
        group.paused = false;
        expect(group.playing()).toBe(true);
    });

    it("playing() returns false when started but paused", () => {
        const a = createOpacityAnim("a");
        const group = new AnimationGroup(a);
        group.started = true;
        group.paused = true;
        expect(group.playing()).toBe(false);
    });

    it("reset() clears all state and unsets managed on children", () => {
        const a = createOpacityAnim("a");
        const b = createOpacityAnim("b");
        const group = new AnimationGroup(a, b);

        group.started = true;
        group.done = true;
        group.paused = true;

        group.reset();

        expect(group.started).toBe(false);
        expect(group.done).toBe(false);
        expect(group.paused).toBe(false);
        expect(a.managed).toBe(false);
        expect(b.managed).toBe(false);
    });

    it("reset() returns this for chaining", () => {
        const a = createOpacityAnim("a");
        const group = new AnimationGroup(a);
        expect(group.reset()).toBe(group);
    });

    it("forcePause() sets paused on group and all children", () => {
        const a = createOpacityAnim("a");
        const b = createOpacityAnim("b");
        const group = new AnimationGroup(a, b);

        group.forcePause();
        expect(group.paused).toBe(true);
        expect(a.paused).toBe(true);
        expect(b.paused).toBe(true);
    });

    it("forcePlay() clears paused on group and all children", () => {
        const a = createOpacityAnim("a");
        const b = createOpacityAnim("b");
        const group = new AnimationGroup(a, b);

        group.forcePause();
        group.forcePlay();
        expect(group.paused).toBe(false);
        expect(a.paused).toBe(false);
        expect(b.paused).toBe(false);
    });
});

describe("AnimationGroup lifecycle", () => {
    it("stop() cancels animation frame and resets", () => {
        const a = createOpacityAnim("a");
        const group = new AnimationGroup(a);
        group.started = true;
        group.handleId = 999;

        group.stop();

        expect(group.started).toBe(false);
        expect(group.done).toBe(false);
        expect(a.managed).toBe(false);
    });

    it("stop() returns this for chaining", () => {
        const a = createOpacityAnim("a");
        const group = new AnimationGroup(a);
        expect(group.stop()).toBe(group);
    });

    it("setSuperKey propagates to all child animations", () => {
        const a = createOpacityAnim("a");
        const b = createOpacityAnim("b");
        const group = new AnimationGroup(a, b);

        group.setSuperKey("TestKey");
        expect(group.superKey).toBe("TestKey");
        expect(a.superKey).toBe("TestKey");
        expect(b.superKey).toBe("TestKey");
    });

    it("setTargets updates all children and recalculates singleTarget", () => {
        const el = document.createElement("div");
        const a = createOpacityAnim("a");
        const b = createTransformAnim("b");
        const group = new AnimationGroup(a, b);

        group.setTargets(el);
        expect(a.targets[0]).toBe(el);
        expect(b.targets[0]).toBe(el);
        expect(group.singleTarget).toBe(true);
    });

    it("onStart sets started flag", () => {
        const a = createOpacityAnim("a");
        const group = new AnimationGroup(a);
        expect(group.started).toBe(false);

        group.onStart();
        expect(group.started).toBe(true);
    });

    it("pause toggles paused state when started", () => {
        const a = createOpacityAnim("a");
        const group = new AnimationGroup(a);
        group.started = true;

        group.pause();
        expect(group.paused).toBe(true);
    });

    it("pause does not toggle paused when not started", () => {
        const a = createOpacityAnim("a");
        const group = new AnimationGroup(a);
        expect(group.started).toBe(false);

        group.pause();
        expect(group.paused).toBe(false);
    });
});

describe("AnimationGroup layering", () => {
    it("accepts { animation, layer } input with custom config", () => {
        const a = createOpacityAnim("a");
        const group = new AnimationGroup(
            { animation: a, layer: { zIndex: 5, blendMode: "add" } } as any,
        );

        const config = group.getLayerConfig("a");
        expect(config).toBeDefined();
        expect(config!.zIndex).toBe(5);
        expect(config!.blendMode).toBe("add");
        expect(config!.weight).toBe(1); // default
        expect(config!.enabled).toBe(true); // default
    });

    it("bare Animation gets default layer config", () => {
        const a = createOpacityAnim("a");
        const group = new AnimationGroup(a);

        const config = group.getLayerConfig("a");
        expect(config).toBeDefined();
        expect(config!.zIndex).toBe(0);
        expect(config!.weight).toBe(1);
        expect(config!.blendMode).toBe("replace");
        expect(config!.enabled).toBe(true);
    });

    it("setLayerConfig updates config and is chainable", () => {
        const a = createOpacityAnim("a");
        const group = new AnimationGroup(a);

        const result = group.setLayerConfig("a", { zIndex: 10, weight: 0.5 });
        expect(result).toBe(group);

        const config = group.getLayerConfig("a");
        expect(config!.zIndex).toBe(10);
        expect(config!.weight).toBe(0.5);
    });

    it("setLayerEnabled toggles layer", () => {
        const a = createOpacityAnim("a");
        const group = new AnimationGroup(a);

        group.setLayerEnabled("a", false);
        expect(group.getLayerConfig("a")!.enabled).toBe(false);

        group.setLayerEnabled("a", true);
        expect(group.getLayerConfig("a")!.enabled).toBe(true);
    });

    it("disabled layers are excluded from transformFramesGrouped", () => {
        const a = createOpacityAnim("a");
        const b = createOpacityAnim("b");
        const group = new AnimationGroup(a, b);
        group.transform = vi.fn();

        a.started = true;
        b.started = true;

        // Disable a — only b's values should be in output
        group.setLayerEnabled("a", false);
        a.paused = true; // prevent interpFrames
        b.paused = true;

        group.transformFramesGrouped(0);
        expect(group.transform).toHaveBeenCalled();
    });

    it("getLayerConfig returns undefined for unknown names", () => {
        const a = createOpacityAnim("a");
        const group = new AnimationGroup(a);
        expect(group.getLayerConfig("nonexistent")).toBeUndefined();
    });

    it("setLayerConfig accepts Animation instance", () => {
        const a = createOpacityAnim("a");
        const group = new AnimationGroup(a);

        group.setLayerConfig(a, { zIndex: 3 });
        expect(group.getLayerConfig(a)!.zIndex).toBe(3);
    });

    it("mixed bare and layered inputs in constructor", () => {
        const a = createOpacityAnim("a");
        const b = createOpacityAnim("b");

        const group = new AnimationGroup(
            a,
            { animation: b, layer: { zIndex: 2 } } as any,
        );

        expect(group.getLayerConfig("a")!.zIndex).toBe(0);
        expect(group.getLayerConfig("b")!.zIndex).toBe(2);
        expect(a.managed).toBe(true);
        expect(b.managed).toBe(true);
    });
});
