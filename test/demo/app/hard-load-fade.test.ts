// SERVED MODEL: claude-opus-5-5
/**
 * test/demo/app/hard-load-fade.test.ts — X.KF.W13X.r4fade (UIA-KF-125 motion half).
 *
 * A HARD load has no source scene and no dispatch: the keyed <Suspense> shows
 * its fallback while the cold chunk loads, then resolves the scene in place.
 * That resolve is a swap no View Transition carried, so it takes the house
 * swap fade — the same `useSceneSwap` spring a key swap runs — and honours
 * reduced motion as the swap does (an instant snap to 1 — the served read at
 * the parent bytes left a reduced-motion host at opacity 0, a blank stage,
 * because the leg was seated after `play()` read the query). A warm mount (no
 * fallback shown) never fades, so an in-app switch is never faded twice.
 *
 * The host wires the composable to a real keyed <Suspense> exactly as App.vue
 * does (`@fallback` → `onSceneFallback`, `@resolve` → `onSceneResolve`).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import {
    Suspense,
    computed,
    defineAsyncComponent,
    defineComponent,
    h,
    nextTick,
    ref,
} from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import type { ViewTransitionHandle } from "@mkbabb/keyframes.js";
import { useSceneSwap } from "../../../demo/app/transition/useSceneSwap";

const raf = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

let wrapper: VueWrapper | undefined;
const realMatchMedia = window.matchMedia;
afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    vi.unstubAllGlobals();
    window.matchMedia = realMatchMedia;
});

const Scene = defineComponent({
    render: () => h("div", { class: "scene-root" }),
});

/** Mount the scene host; `cold` holds the scene chunk until `release()`. */
function mountHost(cold: boolean) {
    let release!: () => void;
    const chunk = new Promise<typeof Scene>((r) => (release = () => r(Scene)));
    const component = cold ? defineAsyncComponent(() => chunk) : Scene;
    const key = ref("spring");
    const lastSwapBackend = ref<ViewTransitionHandle["backend"] | null>(null);
    let style!: ReturnType<typeof useSceneSwap>["sceneSwapStyle"];
    const Host = defineComponent({
        setup() {
            const swap = useSceneSwap(
                computed(() => key.value),
                lastSwapBackend,
            );
            style = swap.sceneSwapStyle;
            return () =>
                h(
                    "div",
                    { class: "scene-host", style: swap.sceneSwapStyle.value },
                    [
                        h(
                            Suspense,
                            {
                                key: key.value,
                                onFallback: swap.onSceneFallback,
                                onResolve: swap.onSceneResolve,
                            },
                            {
                                default: () => h(component),
                                fallback: () =>
                                    h("div", { class: "scene-skeleton" }),
                            },
                        ),
                    ],
                );
        },
    });
    wrapper = mount(Host, { attachTo: document.body });
    return { release, opacity: () => style.value.opacity, key };
}

/** The host opacity over `n` frames. */
async function trace(opacity: () => number, n = 8) {
    const out: number[] = [];
    for (let k = 0; k < n; k++) {
        await raf();
        out.push(opacity());
    }
    return out;
}

/** The reduce query on; the engine reads `window.matchMedia` at play time. */
function stubReducedMotion() {
    const mql = (q: string) =>
        ({
            matches: q.includes("prefers-reduced-motion: reduce"),
            media: q,
            onchange: null,
            addListener() {},
            removeListener() {},
            addEventListener() {},
            removeEventListener() {},
            dispatchEvent: () => false,
        }) as unknown as MediaQueryList;
    vi.stubGlobal("matchMedia", mql);
    window.matchMedia = mql;
}

describe("UIA-KF-125 motion half — the hard-load resolve takes the house swap fade", () => {
    it("the cold resolve fades the scene in (the fallback itself is not faded)", async () => {
        const host = mountHost(true);
        await nextTick();
        expect(wrapper!.find(".scene-skeleton").exists()).toBe(true);
        const whileFallback = await trace(host.opacity, 3);
        expect(Math.min(...whileFallback)).toBe(1);

        host.release();
        await vi.waitFor(() =>
            expect(wrapper!.find(".scene-root").exists()).toBe(true),
        );
        const fade = await trace(host.opacity);
        expect(Math.min(...fade)).toBeLessThan(1);
    });

    it("the resolve fade is the key swap's fade (one spring, one code path)", async () => {
        const cold = mountHost(true);
        await nextTick();
        cold.release();
        await vi.waitFor(() =>
            expect(wrapper!.find(".scene-root").exists()).toBe(true),
        );
        const resolveFirst = (await trace(cold.opacity, 1))[0]!;
        wrapper!.unmount();

        const warm = mountHost(false);
        await nextTick();
        warm.key.value = "amiga";
        await nextTick();
        const swapFirst = (await trace(warm.opacity, 1))[0]!;
        // Both re-seat the same spring 0 → 1: the first frame of each is a
        // fresh rise from 0, never the settled 1.
        expect(resolveFirst).toBeLessThan(0.5);
        expect(swapFirst).toBeLessThan(0.5);
    });

    it("a warm mount (no fallback shown) never fades", async () => {
        const host = mountHost(false);
        await nextTick();
        expect(wrapper!.find(".scene-root").exists()).toBe(true);
        expect(Math.min(...(await trace(host.opacity)))).toBe(1);
    });

    it("reduced motion: the resolve snaps, exactly as the swap does", async () => {
        stubReducedMotion();
        const host = mountHost(true);
        await nextTick();
        host.release();
        await vi.waitFor(() =>
            expect(wrapper!.find(".scene-root").exists()).toBe(true),
        );
        const resolve = await trace(host.opacity, 3);
        wrapper!.unmount();

        const warm = mountHost(false);
        await nextTick();
        warm.key.value = "amiga";
        await nextTick();
        const swap = await trace(warm.opacity, 3);
        expect(resolve).toEqual(swap);
        expect(resolve).toEqual([1, 1, 1]);
    });
});
