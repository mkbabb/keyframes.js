// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.r4shell · KFA-22 (the freeze limb) — the home Play is a hop from
 * home to cube, and home IS the cube scene (the same `CubeScene`, the same
 * `<Suspense>` key). The freeze was a remount: `EditorShell` keys its
 * `AnimationControlsGroup` on the scene's store key, home and cube carried two
 * keys, so the hop tore down the whole transport subtree and the scene slot
 * inside it and mounted both again on the swap tick (the 230-320 ms rAF gap).
 *
 * The falsifier mounts the REAL `EditorShell` (and through it the REAL
 * `AnimationControlsGroup`) with the REAL scene descriptors' store keys, and a
 * probe in the target slot that counts its own mounts. The hop must patch the
 * scene, never remount it.
 */
import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, h, nextTick, reactive } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";

const { default: EditorShell } = await import("../../../demo/components/instrument/shell/EditorShell.vue");
const { homeScene, sceneMap } = await import("../../../demo/app/scene/scenes");
const { kfEngine, warmKfEngine } = await import("../../../demo/kf-engine");
const { TooltipProvider } = await import("@mkbabb/glass-ui/tooltip");

await warmKfEngine();

let mounts = 0;
let unmounts = 0;
const Probe = defineComponent({
    mounted() {
        mounts++;
    },
    unmounted() {
        unmounts++;
    },
    render: () => h("div", { class: "scene-probe" }),
});

const wrappers: VueWrapper[] = [];
afterEach(() => {
    for (const w of wrappers.splice(0)) w.unmount();
    mounts = 0;
    unmounts = 0;
});

describe("KFA-22 — the home Play hop keeps the one cube scene mounted", () => {
    it("home and cube share one store key (the transport's mount key)", () => {
        expect(homeScene.superKey).toBe(sceneMap.get("cube")!.superKey);
    });

    it("EditorShell patches the scene slot across home -> cube; it never remounts it", async () => {
        const group = new (kfEngine().AnimationGroup)();
        const state = reactive({
            superKey: homeScene.superKey,
            home: true,
        });
        const Host = defineComponent({
            render: () =>
                h(TooltipProvider, null, () =>
                    h(
                        EditorShell,
                        {
                            animationGroup: group,
                            superKey: state.superKey,
                            showStartScreen: state.home,
                            hideControls: state.home,
                            gridBackground: false,
                        },
                        { target: () => h(Probe) },
                    ),
                ),
        });
        const w = mount(Host, { attachTo: document.body });
        wrappers.push(w);
        await nextTick();
        expect(mounts).toBe(1);

        state.superKey = sceneMap.get("cube")!.superKey;
        state.home = false;
        await nextTick();
        await nextTick();

        expect(unmounts).toBe(0);
        expect(mounts).toBe(1);
    });
});
