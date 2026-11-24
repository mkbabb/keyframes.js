// FORTY-SIXTH E (owner, 23 Nov 2026): "we should store page state in the URL,
// not just in browser session, such that if we go back to a bare
// keyframes.babb.dev, it should be the homescreen".
//
// The address is the page. The scene machine and both option stores live in
// memory for one page's life; nothing of the view is read from or written to
// browser storage (the theme, a viewer's preference, is glass's and stays).
// A record a returning visitor's browser still holds from before is never
// read: the machine starts at Home with no scene entered.

import { beforeEach, describe, expect, it, vi } from "vitest";

// The page's Storage. Node (>= 25) defines its own global `localStorage`
// accessor, which reads `undefined` without `--localstorage-file` and shadows
// the jsdom window's: the jsdom window's own Storage is the one the page sees.
const { jsdom } = globalThis as unknown as { jsdom: { window: { localStorage: Storage; sessionStorage: Storage } } };
vi.stubGlobal("localStorage", jsdom.window.localStorage);
vi.stubGlobal("sessionStorage", jsdom.window.sessionStorage);

const OLD = {
    "keyframes-js-scene-machine": JSON.stringify({
        activeScene: "easing",
        perScene: { cube: { playing: true, started: true, animations: { Rotations: { t: 4287, reversed: false, iteration: 0 } } } },
    }),
    "animation-groups-options-store": JSON.stringify({
        _storeTimestamp: Date.now(),
        cube: { Rotations: { animationOptions: { duration: "2s" } } },
    }),
    "animation-groups-control-options-store": JSON.stringify({
        _storeTimestamp: Date.now(),
        cube: { selectedControl: "keyframes", selectedAnimation: "Matrix", cubeSkin: "daraksha", isTimelineExpanded: true, isControlsPanelOpen: true },
    }),
};

beforeEach(async () => {
    localStorage.clear();
    sessionStorage.clear();
    for (const [k, v] of Object.entries(OLD)) localStorage.setItem(k, v);
    vi.resetModules();
    const { warmKfEngine } = await import("../../../demo/kf-engine");
    await warmKfEngine();
});

describe("FORTY-SIXTH E — the address is the page", () => {
    it("the machine starts at Home with no scene entered, whatever storage holds", async () => {
        const { useSceneMachine } = await import("../../../demo/state/useSceneMachine");
        const machine = useSceneMachine();
        expect(machine.activeScene.value).toBe("home");
        expect(machine.perScene.value).toEqual({});
    });

    it("a scene's view starts at its defaults, never the stored one", async () => {
        const { getStoredAnimationGroupControlOptions } = await import("../../../demo/state/controlOptionsStore");
        const cube = getStoredAnimationGroupControlOptions("cube");
        expect(cube.cubeSkin).toBeUndefined();
        expect(cube.selectedAnimation).toBe("");
        expect(cube.isTimelineExpanded).toBe(false);
        const { getStoredAnimationOptions } = await import("../../../demo/state/animationOptionsStore");
        expect(getStoredAnimationOptions("Rotations", "cube").animationOptions.duration).toBe("5s");
    });

    it("nothing of the view reaches storage: a visit writes no key", async () => {
        localStorage.clear();
        const { useSceneMachine } = await import("../../../demo/state/useSceneMachine");
        const { getStoredAnimationGroupControlOptions } = await import("../../../demo/state/controlOptionsStore");
        const { getStoredAnimationOptions } = await import("../../../demo/state/animationOptionsStore");
        const machine = useSceneMachine();
        machine.dispatch({ type: "NAVIGATE", to: "cube" });
        machine.dispatch({ type: "SCENE_READY" });
        machine.dispatch({ type: "PLAY" });
        machine.dispatch({ type: "NAVIGATE", to: "easing" });
        const cube = getStoredAnimationGroupControlOptions("cube");
        cube.cubeSkin = "daraksha";
        cube.selectedAnimation = "Matrix";
        getStoredAnimationOptions("Rotations", "cube").animationOptions.duration = "2s";
        await new Promise((r) => setTimeout(r, 0));
        expect(Object.keys(localStorage)).toEqual([]);
        expect(Object.keys(sessionStorage)).toEqual([]);
        // ...and memory remembers within the page (owner item 7).
        expect(machine.activeScene.value).toBe("easing");
        expect(getStoredAnimationGroupControlOptions("cube").cubeSkin).toBe("daraksha");
    });
});
