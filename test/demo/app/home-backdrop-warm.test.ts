/**
 * C3-KF-02 / C3-KF-03 (OD19 repair 3) — Home's backdrop (the hero Aurora) takes
 * the scenes' one load path. Its loader is registered under home's id, so
 * `loadScene(home)` (the switch's pre-transition await) resolves the backdrop
 * module, the idle warm covers it, and opening the dock's Scene list warms
 * Home's row with the scenes'. A move into Home never fetches the chunk inside
 * the swap, and the new-state capture never holds a still-pending backdrop.
 */
import { describe, expect, it } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import ChromeDock from "@app/dock/ChromeDock.vue";
import { loadScene } from "../../../demo/app/scene/scenes";
import { HOME_SCENE_ID } from "@state";

const Glyph = defineComponent(() => () => h("span"));

describe("Home's backdrop is warmed and loaded like a scene", () => {
    it("loadScene(home) resolves the HeroAurora module before the transition", async () => {
        const mod = (await loadScene(HOME_SCENE_ID)) as { HERO_AURORA_OPACITY_CEILING?: number } | undefined;
        expect(mod?.HERO_AURORA_OPACITY_CEILING).toBeTypeOf("number");
    });

    it("opening the Scene list warms Home's row with the scenes'", async () => {
        const warmed: string[] = [];
        const wrapper = mount(
            defineComponent(() => () =>
                h(TooltipProvider, null, () =>
                    h(ChromeDock, {
                        currentSceneId: "sequence",
                        scenes: [
                            { id: "sequence", label: "Sequence", icon: Glyph },
                            { id: "spring", label: "Spring", icon: Glyph },
                        ],
                        homeScene: { id: HOME_SCENE_ID, label: "Home", icon: Glyph },
                        isControlsPanelOpen: false,
                        onWarmScene: (id: string) => warmed.push(id),
                    }),
                ),
            ),
            { attachTo: document.body },
        );
        try {
            // The keyboard opens reka's Select (jsdom has no pointer capture).
            await wrapper.find('[aria-label="Scene"]').trigger("keydown", { key: "Enter" });
            await flushPromises();
            await nextTick();
            expect(warmed).toContain(HOME_SCENE_ID);
            expect(warmed).toEqual(expect.arrayContaining(["sequence", "spring"]));
        } finally {
            wrapper.unmount();
        }
    });
});
