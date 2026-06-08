// E.W1 render-smoke + snapshot round-trip — RE-HOMED for H.W1.
//
// The playback codec folded out of `usePlaybackSnapshot` (DELETED) into the
// H.W1 scene-machine seam: the AnimationGroup `ScenePlayback` adapter
// (`createGroupAdapter`) + the imperative `restoreGroupPlaybackState`, now in
// `stores/scenePlaybackAdapters.ts`. This wave's falsifiable close becomes:
//   1. the preserved `useSceneSwap` driver mounts in a real Vue setup, and
//   2. the group adapter's `snapshot()` → `restore()` ROUND-TRIPS a fixture
//      `AnimationGroup` at the saved `t`/`reversed`/`iteration`.
// Re-inlining the codec into App.vue or breaking the adapter reds this.

import { describe, it, expect } from "vitest";
import { computed, createApp, defineComponent, h } from "vue";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { AnimationGroup } from "../src/animation/group";
import { useSceneSwap } from "../demo/app/useSceneSwap";
import {
    createGroupAdapter,
    restoreGroupPlaybackState,
} from "../demo/@/components/custom/animation-controls/stores/scenePlaybackAdapters";

function makeGroup(): AnimationGroup<any> {
    const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
        from { opacity: 0; }
        to { opacity: 1; }
    `);
    a.name = "fade";
    const b = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
        from { transform: translateX(0px); }
        to { transform: translateX(100px); }
    `);
    b.name = "slide";
    return new AnimationGroup(a, b);
}

/** Mount a host that calls the composable in a real Vue setup, then unmount. */
function mountWith(setup: () => unknown) {
    const el = document.createElement("div");
    document.body.appendChild(el);
    const app = createApp(
        defineComponent({
            setup() {
                setup();
                return () => h("div");
            },
        }),
    );
    app.mount(el);
    app.unmount();
    el.remove();
}

describe("E.W1 — render smoke (the preserved useSceneSwap driver)", () => {
    it("useSceneSwap mounts and exposes sceneSwapStyle without throwing", () => {
        expect(() =>
            mountWith(() => {
                const activeSceneKey = computed(() => "cube");
                const { sceneSwapStyle } = useSceneSwap(activeSceneKey);
                // The style is a reactive computed binding the template consumes.
                expect(sceneSwapStyle.value).toHaveProperty("opacity");
                expect(sceneSwapStyle.value).toHaveProperty("transform");
            }),
        ).not.toThrow();
    });
});

describe("H.W1 — the group ScenePlayback adapter round-trips a fixture group", () => {
    it("snapshot() captures t / reversed / iteration; restore() re-seats a fresh group", () => {
        // Source group: started, with a known per-animation playback state.
        const source = makeGroup();
        source.started = true;
        const fadeT = 420;
        const slideT = 137;
        source.animations["fade"]!.animation.t = fadeT;
        source.animations["fade"]!.animation.reversed = true;
        source.animations["fade"]!.animation.iteration = 2;
        source.animations["slide"]!.animation.t = slideT;
        source.animations["slide"]!.animation.reversed = false;
        source.animations["slide"]!.animation.iteration = 0;

        const adapter = createGroupAdapter(() => source);
        const snap = adapter.snapshot();

        expect(snap.started).toBe(true);
        expect(snap.animations["fade"]).toEqual({ t: fadeT, reversed: true, iteration: 2 });
        expect(snap.animations["slide"]).toEqual({ t: slideT, reversed: false, iteration: 0 });

        // Restore onto a FRESH group (the scene-remount case).
        const fresh = makeGroup();
        restoreGroupPlaybackState(fresh, snap);

        const fadeAnim = fresh.animations["fade"]!.animation;
        const slideAnim = fresh.animations["slide"]!.animation;
        expect(fadeAnim.t).toBe(fadeT);
        expect(fadeAnim.reversed).toBe(true);
        expect(fadeAnim.iteration).toBe(2);
        expect(slideAnim.t).toBe(slideT);
        expect(slideAnim.reversed).toBe(false);
        expect(slideAnim.iteration).toBe(0);
        expect(fresh.started).toBe(true);
    });

    it("snapshot() on a never-started group still saves (ST-5: no paused-at-t=0 drop)", () => {
        // A scene paused before its first tick must snapshot, not save nothing.
        const fresh = makeGroup();
        expect(fresh.started).toBe(false);
        const snap = createGroupAdapter(() => fresh).snapshot();
        expect(snap.started).toBe(false);
        expect(snap.playing).toBe(false);
        // The per-animation entries are present (t=0), so a cold restore is
        // faithful instead of starting blank.
        expect(Object.keys(snap.animations).sort()).toEqual(["fade", "slide"]);
    });
});
