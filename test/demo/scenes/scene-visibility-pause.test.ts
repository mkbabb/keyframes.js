// H.W1 — the visibility-fold contract (cube/amiga AnimationGroup scenes).
//
// The tab-visibility concern is folded into the machine as TAB_HIDDEN/TAB_SHOWN
// (status-only, in `sceneMachine.ts` — gated by scene-machine-reducer.test.ts),
// while the PRESERVED per-scene `useSceneVisibilityPause` OWNS the loop with its
// "only resume what IT paused" (autoPaused) honesty contract. The two are
// complementary, NOT a double-act: the machine parks `status`; this composable
// pauses/resumes the actual rAF/WebGL loop. cube (`useCubeDemo.ts:119`) and
// amiga (`AmigaScene.vue:122`) both wire it over their AnimationGroup / present
// loop.
//
// This locks the autoPaused contract directly (the spec PRESERVES it — do NOT
// rewrite). Both halves bite:
//   1. a RUNNING loop is paused on hide and resumed on show (the auto-pause it
//      armed), and
//   2. a USER-PAUSED loop (not running at hide time) is NEVER auto-resumed on
//      show (the load-bearing honesty — folding it must not resume a scene the
//      user paused).
// Re-introducing an unconditional resume (dropping the `wasRunning`/`autoPaused`
// gate) reds clause 2 — the exact regression the fold must not cause.

import { afterEach, describe, expect, it } from "vitest";
import { createApp, defineComponent, h, nextTick } from "vue";
import { useSceneVisibilityPause } from "../../../demo/composables/scene-runtime/useSceneVisibilityPause";

/** Drive `useDocumentVisibility`: set `document.visibilityState` + fire the
 *  `visibilitychange` event the composable listens on (vueuse reads
 *  `document.visibilityState`). Awaits `nextTick` so the `watch` (flush:'pre',
 *  async) callback runs before the assertion. */
async function setVisibility(state: "visible" | "hidden") {
    Object.defineProperty(document, "visibilityState", {
        configurable: true,
        get: () => state,
    });
    Object.defineProperty(document, "hidden", {
        configurable: true,
        get: () => state === "hidden",
    });
    document.dispatchEvent(new Event("visibilitychange"));
    await nextTick();
}

/** Mount a host that wires the composable in a real Vue setup (it uses `watch`,
 *  so it needs an active effect scope); returns the unmount fn. */
function mountWith(setup: () => void): () => void {
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
    return () => {
        app.unmount();
        el.remove();
    };
}

afterEach(async () => {
    await setVisibility("visible");
});

describe("H.W1 visibility fold — useSceneVisibilityPause autoPaused contract", () => {
    it("pauses a RUNNING loop on hide and resumes it on show", async () => {
        await setVisibility("visible");

        // Model a live AnimationGroup loop (cube/amiga): `playing` flips on
        // pause/resume; `wasRunning` reads it.
        let playing = true;
        const calls: string[] = [];

        const unmount = mountWith(() => {
            useSceneVisibilityPause(
                () => playing,
                () => {
                    calls.push("pause");
                    playing = false;
                },
                () => {
                    calls.push("resume");
                    playing = true;
                },
            );
        });

        await setVisibility("hidden");
        expect(calls).toEqual(["pause"]); // the running loop was auto-paused
        expect(playing).toBe(false);

        await setVisibility("visible");
        expect(calls).toEqual(["pause", "resume"]); // resumed what IT paused
        expect(playing).toBe(true);

        unmount();
    });

    it("NEVER auto-resumes a USER-PAUSED loop (the load-bearing honesty)", async () => {
        await setVisibility("visible");

        // The loop is already stopped at hide time (user paused / settled /
        // deactivated). `wasRunning` returns false → no auto-pause is armed → the
        // return MUST NOT force a resume.
        let playing = false;
        const calls: string[] = [];

        const unmount = mountWith(() => {
            useSceneVisibilityPause(
                () => playing,
                () => {
                    calls.push("pause");
                    playing = false;
                },
                () => {
                    calls.push("resume");
                    playing = true;
                },
            );
        });

        await setVisibility("hidden");
        expect(calls).toEqual([]); // nothing was running → nothing paused

        await setVisibility("visible");
        expect(calls).toEqual([]); // and so nothing is resumed — stays paused
        expect(playing).toBe(false);

        unmount();
    });

    it("only resumes once — a second show after an already-handled cycle is inert", async () => {
        await setVisibility("visible");

        let playing = true;
        const calls: string[] = [];
        const unmount = mountWith(() => {
            useSceneVisibilityPause(
                () => playing,
                () => {
                    calls.push("pause");
                    playing = false;
                },
                () => {
                    calls.push("resume");
                    playing = true;
                },
            );
        });

        await setVisibility("hidden"); // pause (armed)
        await setVisibility("visible"); // resume (disarms)
        // A spurious second `visible` (no intervening hide) must NOT re-resume —
        // the autoPaused flag was cleared, so the gate is closed.
        await setVisibility("visible");
        expect(calls).toEqual(["pause", "resume"]);

        unmount();
    });
});
