// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.r4shell · UIA-KF-066 · UIA-KF-123 — the start screen names three
 * ways in (pick from the list, press Play, drag M. cubert); a drag rotated the
 * cube and left the poster printed over it for as long as `#/` was open,
 * because the shell drove the start screen from "is home" alone — and the same
 * flag hid the home transport's controls, so the start screen could not be
 * dismissed without unhiding them.
 *
 * Two facts are separated at the root:
 *   · the start screen is up while home is open and the subject has not been
 *     engaged (`useStartScreen`: the first press on the stage engages it;
 *     leaving home re-arms it);
 *   · home's transport keeps its controls withheld while home is open, whether
 *     or not the start screen is up (EditorShell's own `hideControls`).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { computed, defineComponent, effectScope, h, nextTick, reactive, ref } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";

const { default: EditorShell } = await import("../../../demo/components/instrument/shell/EditorShell.vue");
const { kfEngine, warmKfEngine } = await import("../../../demo/kf-engine");
const { TooltipProvider } = await import("@mkbabb/glass-ui/tooltip");

await warmKfEngine();

const wrappers: VueWrapper[] = [];
afterEach(() => {
    for (const w of wrappers.splice(0)) w.unmount();
});

describe("UIA-KF-066 — a press on the stage dismisses the start screen", () => {
    it("up at home; the first press engages it; leaving home re-arms it", async () => {
        // Resolved at run time, so the shell case below reads RED on its own
        // assertion while this module does not exist yet.
        const path = "../../../demo/app/scene/useStartScreen";
        const { useStartScreen } = await import(/* @vite-ignore */ path);
        const scene = ref("home");
        const scope = effectScope();
        const s = scope.run(() => useStartScreen(computed(() => scene.value === "home")))!;
        expect(s.showStartScreen.value).toBe(true);

        s.engage();
        expect(s.showStartScreen.value).toBe(false);

        scene.value = "cube";
        await nextTick();
        expect(s.showStartScreen.value).toBe(false);
        s.engage(); // a press off home engages nothing
        scene.value = "home";
        await nextTick();
        expect(s.showStartScreen.value).toBe(true);
        scope.stop();
    });
});

describe("UIA-KF-123 — with the start screen dismissed, home's transport still withholds its controls", () => {
    it("EditorShell hides the controls on its own flag, not on the start screen's", async () => {
        const group = new (kfEngine().AnimationGroup)();
        const state = reactive({ showStartScreen: true });
        const Host = defineComponent({
            render: () =>
                h(TooltipProvider, null, () =>
                    h(
                        EditorShell,
                        {
                            animationGroup: group,
                            superKey: "cube",
                            showStartScreen: state.showStartScreen,
                            hideControls: true,
                            gridBackground: false,
                        },
                        { "start-screen": () => h("p", { class: "start-probe" }, "start") },
                    ),
                ),
        });
        const w = mount(Host, { attachTo: document.body });
        wrappers.push(w);
        await nextTick();
        expect(document.querySelector(".start-probe")).not.toBeNull();
        expect(document.querySelector('[aria-label="Reset animation"]')).toBeNull();

        state.showStartScreen = false;
        await nextTick();
        await nextTick();

        expect(document.querySelector('[aria-label="Reset animation"]')).toBeNull();
    });
});

describe("Home's headline: a press opens the Scene list it names", () => {
    it("the headline is a button that asks for the list, and it stays", async () => {
        vi.doMock("@app/hero/TypingDots.vue", () => ({ default: defineComponent(() => () => h("span")) }));
        const { default: EditorStartScreen } = await import("../../../demo/app/hero/EditorStartScreen.vue");
        const w = mount(EditorStartScreen, { props: { hint: "or drag" }, attachTo: document.body });
        wrappers.push(w);
        const press = w.get("h1 button");
        expect(press.text()).toMatch(/Select an animation/);
        await press.trigger("click");
        expect(w.emitted("pickScene")).toHaveLength(1);
        expect(w.find("h1").exists()).toBe(true);
    });

    it("the dock opens its Scene list on that ask", async () => {
        const { default: ChromeDock } = await import("../../../demo/app/dock/ChromeDock.vue");
        const Glyph = defineComponent(() => () => h("span"));
        const scenes = [{ id: "cube", label: "Cube", icon: Glyph }];
        const dock = ref<{ openSceneList: () => Promise<void> } | null>(null);
        const w = mount(
            defineComponent(() => () =>
                h(TooltipProvider, null, () =>
                    h(ChromeDock, {
                        ref: dock,
                        currentSceneId: "home",
                        scenes,
                        homeScene: { id: "home", label: "Home", icon: Glyph },
                        isControlsPanelOpen: false,
                    }),
                ),
            ),
            { attachTo: document.body },
        );
        wrappers.push(w);
        await nextTick();
        const trigger = () => document.querySelector('[aria-label="Scene"]');
        expect(trigger()?.getAttribute("aria-expanded")).toBe("false");
        await dock.value!.openSceneList();
        await nextTick();
        await nextTick();
        expect(trigger()?.getAttribute("aria-expanded")).toBe("true");
    });
});
