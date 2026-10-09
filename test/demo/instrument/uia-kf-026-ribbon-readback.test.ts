// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.r4transport · UIA-KF-026 (the scrubber limb) — the channel
 * ribbon's read-back re-derives on a paint it did not cause.
 *
 * Square: Play → a drag takeover (the machine pauses: the read-back reads the
 * paused time, then idles after its settle window) → Esc (Reset: the group
 * rewinds to 0). The read-back was woken only by its own scrubs and by
 * play/pause flips, so the rail kept reading ~705-716 ms while the group sat at
 * 0. The group host provides its paints (`GROUP_PAINTS_KEY`); the read-back
 * wakes on each one.
 */
import { describe, expect, it } from "vitest";
import { createApp, defineComponent, h, provide, ref, type Ref } from "vue";
import { CSSKeyframesAnimation } from "../../../src/animation/engine";
import { AnimationGroup } from "../../../src/animation/group";
import { GROUP_PAINTS_KEY } from "../../../demo/components/instrument/transport/transportSource";
import { useAnimationSync } from "../../../demo/components/instrument/transport/channel-controls/composables/useAnimationSync";

const frames = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe("UIA-KF-026 — the ribbon read-back follows the group's paints", () => {
    it("Reset's rewind of an already-paused group re-seats the rail at 0", async () => {
        const anim = new CSSKeyframesAnimation<{ opacity: number }>({
            duration: 2000,
            iterationCount: "infinite",
            useWAAPI: false,
        } as never).fromString("from { opacity: 0; } to { opacity: 1; }");
        anim.setTargets(document.createElement("div"));
        const group = new AnimationGroup<any>(anim);

        let currentT!: Ref<number>;
        const Child = defineComponent({
            setup() {
                ({ currentT } = useAnimationSync(() => anim, ref(false)));
                return () => h("div");
            },
        });
        const Host = defineComponent({
            setup() {
                provide(GROUP_PAINTS_KEY, (listener: () => void) => group.onRender(listener));
                return () => h(Child);
            },
        });
        const el = document.createElement("div");
        document.body.append(el);
        const app = createApp(Host);
        app.mount(el);

        // The takeover's pause left the group at 710 ms; the read-back reads it,
        // then idles once the value holds for its settle window.
        group.setChildTime(anim, 710).render();
        await frames(1200);
        expect(currentT.value).toBeCloseTo(710, 6);

        // Esc → Reset: the group rewinds while the read-back is idle.
        group.reset();
        await frames(200);
        expect(currentT.value).toBe(0);

        app.unmount();
        el.remove();
    });
});
