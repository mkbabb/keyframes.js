/**
 * o1105 kf-load L7 — the scene swap is typed `lateral` with a signed
 * `--route-direction` (glass's route grammar; the look is glass's).
 *
 * MEASURED (kf-load L0 `vt` cell, docs/evidence/o1105-kf-load): every swap
 * ran untyped (`types: []`), so the root and the scene subject cross-faded.
 * The witness drives the real `useSceneTransition`: the platform call carries
 * `types: ["lateral"]`, the root carries the dock-order sign of the move while
 * the transition runs, and clears it when the transition settles.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, ref } from "vue";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { routeDirection, useSceneTransition } from "../../../demo/app/transition/useSceneTransition";

describe("the scene swap is lateral, signed by dock order", () => {
    let wrapper: VueWrapper | undefined;
    afterEach(() => {
        wrapper?.unmount();
        delete (document as unknown as { startViewTransition?: unknown }).startViewTransition;
    });

    it("signs the move by the dock's scene order, Home at 0", () => {
        expect(routeDirection("home", "cube")).toBe(1);
        expect(routeDirection("sequence", "amiga")).toBe(-1);
        expect(routeDirection("spring", "spring")).toBe(0);
    });

    it("types the platform transition lateral and sets the direction while it runs", async () => {
        let release!: () => void;
        const finished = new Promise<void>((r) => (release = r));
        const seen: Array<{ types: readonly string[] | undefined; direction: string }> = [];
        (document as unknown as { startViewTransition: unknown }).startViewTransition = vi.fn(
            (arg: { update: () => Promise<void>; types?: readonly string[] }) => {
                seen.push({ types: arg.types, direction: document.documentElement.style.getPropertyValue("--route-direction") });
                const done = Promise.resolve().then(arg.update);
                return { ready: done, finished, updateCallbackDone: done, skipTransition() {} };
            },
        );
        let run!: (id: string) => Promise<void>;
        wrapper = mount(
            defineComponent({
                setup() {
                    ({ runSceneSwitch: run } = useSceneTransition({
                        mutate: () => {},
                        sceneHost: ref<HTMLElement | null>(null),
                        whenSceneReady: () => Promise.resolve(() => {}),
                        currentId: () => "sequence",
                    }));
                    return () => h("div");
                },
            }),
        );
        await run("cube");
        await flushPromises();
        expect(seen).toEqual([{ types: ["lateral"], direction: "-1" }]);
        release();
        await flushPromises();
        expect(document.documentElement.style.getPropertyValue("--route-direction")).toBe("");
    });
});
