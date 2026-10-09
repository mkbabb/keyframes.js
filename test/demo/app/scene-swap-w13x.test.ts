/**
 * test/demo/app/scene-swap-w13x.test.ts — X.KF.W13X.scene.
 *
 * The scene swap is ONE entry and ONE cross-dissolve, whole:
 *   - KFA-24: an in-app URL change (a direct hash, back/forward) reconciles
 *     through the View-Transition switch, not a bare NAVIGATE (a hard cut).
 *   - KFA-25 / KFA-76: the switch resolves the destination chunk BEFORE the
 *     transition starts, and the transition's update callback does not finish
 *     until the scene's commit point (`whenSceneReady`), so neither capture is
 *     the <Suspense> fallback.
 *   - KFA-26 / KFA-201: an overlay mid-exit (the picked Select) finishes
 *     leaving before the transition captures the old state.
 *   - A2-KE-L1-13 / L1-14: the dead contract members are gone, the cube has one
 *     load path, and scene identity is spelled once.
 */
import { afterEach, beforeEach, describe, expect, expectTypeOf, it, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";

import * as scenesModule from "../../../demo/app/scene/scenes";
import { allScenes, sceneMap } from "../../../demo/app/scene/scenes";
import { CUBE_SCENE_ID } from "../../../demo/scenes/cube/cubeKeys";
import type { SceneExposedApi } from "../../../demo/app/scene/sceneExposedApi";
import { useSceneMachineRouterBinding } from "../../../demo/app/scene/useSceneMachineRouterBinding";
import { useSceneTransition } from "../../../demo/app/transition/useSceneTransition";
import type { ChannelHandle } from "@composables/scene-facility";
import type { TransportChannel } from "@components/instrument/transport/transportSource";
import { HOME_SCENE_ID, useSceneMachine, type SurfaceChannelLike } from "@state";

let wrapper: VueWrapper | undefined;
afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
});

const flush = async (n = 6) => {
    for (let i = 0; i < n; i++) {
        await nextTick();
        await new Promise((r) => setTimeout(r, 0));
    }
};

describe("KFA-24 — a URL change runs the View-Transition switch", () => {
    it("routes a non-initial navigation through runSceneSwitch, not a bare NAVIGATE", async () => {
        const router = createRouter({
            history: createMemoryHistory(),
            routes: allScenes.map((s) => ({
                path: s.id === HOME_SCENE_ID ? "/" : `/${s.id}`,
                name: s.id,
                component: { render: () => null },
            })),
        });
        const switched: string[] = [];
        const Host = defineComponent({
            setup() {
                useSceneMachineRouterBinding({
                    getRunSceneSwitch: () => (id: string) => {
                        switched.push(id);
                    },
                });
                return () => h("div");
            },
        });
        await router.push("/");
        wrapper = mount(Host, { global: { plugins: [router] } });
        await router.isReady();
        await flush();
        const machine = useSceneMachine();
        const before = machine.activeScene.value;
        const target = before === "square" ? "amiga" : "square";
        await router.push(`/${target}`); // the hash/back-forward shape: the URL moves first
        await flush();
        expect(switched).toEqual([target]);
    });
});

describe("KFA-25 / KFA-26 / KFA-201 — the switch prepares, then captures the resolved scene", () => {
    let startVT: ReturnType<typeof vi.fn>;
    let callbackDone: Promise<unknown> | null;
    let exitFinished: { resolve: () => void; promise: Promise<void> };

    beforeEach(() => {
        callbackDone = null;
        let resolveExit!: () => void;
        exitFinished = {
            promise: new Promise<void>((r) => (resolveExit = r)),
            resolve: () => resolveExit(),
        };
        startVT = vi.fn((cb: () => Promise<void>) => {
            callbackDone = Promise.resolve().then(cb);
            const done = callbackDone.then(() => undefined);
            return { ready: done, finished: done, updateCallbackDone: done, skipTransition() {}, types: new Set() };
        });
        (document as unknown as { startViewTransition: unknown }).startViewTransition = startVT;
        // A closing Select's content: reka marks it data-state="closed" and runs its exit.
        const closing = document.createElement("div");
        closing.setAttribute("data-state", "closed");
        document.body.append(closing);
        const exit = {
            effect: { target: closing, getComputedTiming: () => ({ endTime: 150 }) },
            finished: exitFinished.promise,
        };
        (document as unknown as { getAnimations: unknown }).getAnimations = () => [exit];
    });
    afterEach(() => {
        delete (document as unknown as { startViewTransition?: unknown }).startViewTransition;
        delete (document as unknown as { getAnimations?: unknown }).getAnimations;
        document.body.replaceChildren();
    });

    it("waits for the closing overlay, then holds the update callback until the scene is ready", async () => {
        const mutate = vi.fn();
        let resolveReady!: () => void;
        const whenSceneReady = vi.fn(() => new Promise<void>((r) => (resolveReady = r)));
        let run!: (id: string) => void;
        const Host = defineComponent({
            setup() {
                ({ runSceneSwitch: run } = useSceneTransition({
                    mutate,
                    sceneHost: ref<HTMLElement | null>(null),
                    whenSceneReady,
                }));
                return () => h("div");
            },
        });
        wrapper = mount(Host);
        run(HOME_SCENE_ID);
        await flush();
        // The overlay is still leaving: no capture yet (KFA-26 / KFA-201).
        expect(startVT).not.toHaveBeenCalled();
        exitFinished.resolve();
        await flush();
        expect(startVT).toHaveBeenCalledTimes(1);
        expect(mutate).toHaveBeenCalledWith(HOME_SCENE_ID);
        expect(whenSceneReady).toHaveBeenCalledWith(HOME_SCENE_ID);
        // The update callback is still open: the new capture waits for the commit point (KFA-25).
        let settled = false;
        void callbackDone!.then(() => (settled = true));
        await flush();
        expect(settled).toBe(false);
        resolveReady();
        await flush();
        expect(settled).toBe(true);
    });
});

describe("A2-KE-L1-13 / L1-14 — the scene contract carries no dead members", () => {
    it("gives the cube one load path: home and cube mount the same static component", () => {
        const cube = sceneMap.get("cube")!.component as Record<string, unknown>;
        expect(sceneMap.get(HOME_SCENE_ID)!.component).toBe(cube);
        expect("__asyncLoader" in cube).toBe(false);
    });

    it("declares no unread descriptor members and spells each id once", () => {
        for (const s of allScenes) {
            expect(Object.keys(s)).not.toContain("showStartScreen");
            expect(Object.keys(s)).not.toContain("gridBackground");
            // KFA-22 (X.KF.W13X.r4shell): home stores under the cube's key (it IS
            // the cube scene, one mount across the Play hop); every other scene
            // stores under its own id.
            expect(s.superKey).toBe(s.id === HOME_SCENE_ID ? CUBE_SCENE_ID : s.id);
        }
        // One HOME_SCENE_ID: the state layer's; the registry does not redefine it.
        expect(Object.keys(scenesModule)).not.toContain("HOME_SCENE_ID");
    });

    it("exposes exactly the members a scene provides and the shell reads", () => {
        expectTypeOf<keyof SceneExposedApi>().toEqualTypeOf<
            "facility" | "tabsContent" | "ribbonContent" | "superKey" | "autoPlays" | "isStarted"
        >();
        expectTypeOf<ChannelHandle>().toMatchTypeOf<SurfaceChannelLike>();
        expectTypeOf<TransportChannel>().toEqualTypeOf<
            Pick<ChannelHandle, "name" | "animation" | "sequence" | "progress" | "setProgress">
        >();
    });
});
