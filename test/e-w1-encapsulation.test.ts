// E.W1 render-smoke + snapshot round-trip.
//
// The falsifiable close of the encapsulation wave (E.W1 §S5 / gate clause 4):
//   1. the two extracted app-entry composables (`useSceneSwap`,
//      `usePlaybackSnapshot`) mount inside a real Vue setup with no throw, and
//   2. the playback codec ROUND-TRIPS — `saveCurrentPlaybackState` →
//      `restoreGroupPlaybackState` re-seats a fixture `AnimationGroup` at the
//      saved `t`/`reversed`/`iteration`.
// Re-inlining the codec into App.vue or breaking the composables reds this.
// (The thinned OrbitalDrag's disposition — all four appliers on the component,
// none in the pointer composable — is the grep clause of proof:decomposition;
// vitest carries no SFC transform here, so the .vue surface is gated there.)

import { describe, it, expect, beforeEach } from "vitest";
import { computed, createApp, defineComponent, h, ref, shallowRef } from "vue";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { AnimationGroup } from "../src/animation/group";
import { useSceneSwap } from "../demo/app/useSceneSwap";
import { usePlaybackSnapshot } from "../demo/app/usePlaybackSnapshot";
import {
    saveScenePlaybackState,
    getScenePlaybackState,
    clearScenePlaybackState,
} from "../demo/@/components/custom/animation-controls/stores/scenePlayback";

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

describe("E.W1 — render smoke (composables + thinned OrbitalDrag mount)", () => {
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

    it("usePlaybackSnapshot mounts and exposes the codec without throwing", () => {
        expect(() =>
            mountWith(() => {
                const superKey = shallowRef("Cube");
                const group = shallowRef(makeGroup());
                const codec = usePlaybackSnapshot(superKey, group);
                expect(typeof codec.saveCurrentPlaybackState).toBe("function");
                expect(typeof codec.restoreGroupPlaybackState).toBe("function");
            }),
        ).not.toThrow();
    });
});

describe("E.W1 — usePlaybackSnapshot round-trips a fixture group", () => {
    const KEY = "Cube";

    beforeEach(() => clearScenePlaybackState(KEY));

    it("save → restore re-seats t / reversed / iteration", () => {
        const superKey = shallowRef(KEY);

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

        const sourceRef = shallowRef(source);
        const { saveCurrentPlaybackState } = usePlaybackSnapshot(superKey, sourceRef);
        saveCurrentPlaybackState();

        const saved = getScenePlaybackState(KEY);
        expect(saved).toBeDefined();
        expect(saved!.animations["fade"]).toEqual({ t: fadeT, reversed: true, iteration: 2 });
        expect(saved!.animations["slide"]).toEqual({ t: slideT, reversed: false, iteration: 0 });

        // Restore onto a FRESH group (the scene-remount case).
        const fresh = makeGroup();
        const freshRef = shallowRef(fresh);
        const { restoreGroupPlaybackState } = usePlaybackSnapshot(superKey, freshRef);
        restoreGroupPlaybackState(fresh, saved!);

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

    it("save no-ops on a __-prefixed (transient) super-key", () => {
        const superKey = shallowRef("__transient");
        const group = makeGroup();
        group.started = true;
        saveCurrentPlaybackStateHelper(superKey, group);
        expect(getScenePlaybackState("__transient")).toBeUndefined();
    });
});

// Local helper that exercises the save guard via the real composable.
function saveCurrentPlaybackStateHelper(
    superKey: ReturnType<typeof ref<string>>,
    group: AnimationGroup<any>,
) {
    const { saveCurrentPlaybackState } = usePlaybackSnapshot(
        superKey as any,
        shallowRef(group),
    );
    saveCurrentPlaybackState();
}
