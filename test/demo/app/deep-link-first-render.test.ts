/**
 * test/demo/app/deep-link-first-render.test.ts — OD19-ALL (load).
 *
 * A cold load of #/<scene> renders that scene FIRST. The first-load seed ran
 * in the `router.isReady()` microtask, after App's first render, so a deep
 * link drew the persisted scene (home on a first visit) for one render: it
 * fetched and evaluated the home-only Aurora chunk (~211 KB), mounted the start
 * screen, then switched (`load/before-*.json`: the Aurora chunk on every cold
 * route). The router's initial navigation has resolved before App mounts on
 * every boot (main.ts mounts after the engine chunk), so the seed runs in
 * setup.
 */
import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";

import { allScenes } from "../../../demo/app/scene/scenes";
import { useSceneMachineRouterBinding } from "../../../demo/app/scene/useSceneMachineRouterBinding";
import { HOME_SCENE_ID, useSceneMachine } from "@state";

let wrapper: VueWrapper | undefined;
afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
});

const makeRouter = () =>
    createRouter({
        history: createMemoryHistory(),
        routes: allScenes.map((s) => ({
            path: s.id === HOME_SCENE_ID ? "/" : `/${s.id}`,
            name: s.id,
            component: { render: () => null },
        })),
    });

describe("OD19-ALL — a deep link's first render is the linked scene", () => {
    it.each(["spring", "easing", "sequence"])("#/%s: the first render reads the linked scene, never the persisted one", async (target) => {
        const router = makeRouter();
        await router.push(`/${target}`);
        await router.isReady();
        const firstRender: string[] = [];
        const Host = defineComponent({
            setup() {
                useSceneMachineRouterBinding({ getRunSceneSwitch: () => () => {} });
                const machine = useSceneMachine();
                return () => {
                    firstRender.push(machine.activeScene.value);
                    return h("div");
                };
            },
        });
        wrapper = mount(Host, { global: { plugins: [router] } });
        expect(firstRender[0]).toBe(target);
    });
});
