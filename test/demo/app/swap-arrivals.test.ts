/**
 * FORTY-SIXTH A (K-1) and the motion law ("reduced motion is a fade, never a
 * cut") — what a page change does about the site's own work and about
 * reduced motion:
 *
 *   1. Home's wash arriving with a page change mounts once the swap has
 *      finished, in the first frame without a View Transition: mounted with
 *      the new page, its WebGL renderer came up inside the docks' glide (a
 *      task of 67 to 181 ms), the plates stood at their old width while the
 *      seats moved on, and the width then landed in one frame. With no swap
 *      running (a cold Home) it mounts at once.
 *   2. Under `prefers-reduced-motion: reduce` a page change is still a View
 *      Transition, untyped, and once it is ready the new page's image fades
 *      in by an animation of its own (opacity only). The dispatch used to
 *      snap there: no transition, the docks and the die changed between two
 *      frames.
 *   3. The press is answered: only a closing list, menu or dialog holds the
 *      swap for its exit. The pressed dock seat is a tooltip's trigger, which
 *      reka marks `data-state="closed"`, and its own press and hover
 *      transitions (200 and 300 ms) held every press before the swap began.
 *
 * jsdom has no View Transitions: the platform call, `:active-view-transition`
 * and the frame clock are stubbed, as the browser would answer them.
 */
import { afterEach, beforeEach, describe, expect, it, onTestFinished, vi } from "vitest";
import { defineComponent, h, nextTick, ref, type Ref } from "vue";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { useBackdropLeave } from "../../../demo/app/hero/useBackdropLeave";
import { useSceneTransition } from "../../../demo/app/transition/useSceneTransition";

let frames: FrameRequestCallback[] = [];
let swapRunning = false;
const realMatches = Element.prototype.matches;
let wrapper: VueWrapper | undefined;

function frame(): void {
    const run = frames;
    frames = [];
    for (const cb of run) cb(performance.now());
}

beforeEach(() => {
    frames = [];
    swapRunning = false;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => frames.push(cb));
    vi.stubGlobal("cancelAnimationFrame", () => {});
    Element.prototype.matches = function (this: Element, selector: string): boolean {
        if (selector === ":active-view-transition") return this === document.documentElement && swapRunning;
        return realMatches.call(this, selector);
    } as Element["matches"];
});

afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    delete (document as unknown as { getAnimations?: unknown }).getAnimations;
    Element.prototype.matches = realMatches;
    vi.unstubAllGlobals();
    delete (document as unknown as { startViewTransition?: unknown }).startViewTransition;
});

describe("1. Home's wash arrives once the swap has finished", () => {
    function host(shown: Ref<boolean>): Readonly<Ref<boolean>> {
        let mounted!: Readonly<Ref<boolean>>;
        wrapper = mount(
            defineComponent({
                setup() {
                    mounted = useBackdropLeave(() => shown.value, () => null, 240);
                    return () => h("div");
                },
            }),
        );
        return mounted;
    }

    it("mounts in the first frame after a running swap, not with the new page", async () => {
        const shown = ref(false);
        const mounted = host(shown);
        swapRunning = true;
        shown.value = true;
        await nextTick();
        expect(mounted.value, "while the swap runs").toBe(false);
        frame();
        frame();
        expect(mounted.value, "frames later, the swap still running").toBe(false);
        swapRunning = false;
        frame();
        expect(mounted.value, "the first frame without a swap").toBe(true);
    });

    it("mounts at once with no swap running (a cold Home)", async () => {
        const shown = ref(false);
        const mounted = host(shown);
        shown.value = true;
        await nextTick();
        expect(mounted.value).toBe(true);
    });

    it("does not mount if the page has left Home before the swap ends", async () => {
        const shown = ref(false);
        const mounted = host(shown);
        swapRunning = true;
        shown.value = true;
        await nextTick();
        shown.value = false;
        await nextTick();
        swapRunning = false;
        frame();
        expect(mounted.value).toBe(false);
    });
});

/** Mount the real switch; the platform's View Transition is stubbed and counted. */
function switcher(): { run: (id: string) => Promise<void>; started: () => number } {
    let started = 0;
    (document as unknown as { startViewTransition: unknown }).startViewTransition = vi.fn((arg: unknown) => {
        started++;
        const update = typeof arg === "function" ? (arg as () => Promise<void>) : (arg as { update: () => Promise<void> }).update;
        const done = Promise.resolve().then(update);
        return { ready: done, finished: new Promise<void>(() => {}), updateCallbackDone: done, skipTransition() {} };
    });
    let run!: (id: string) => Promise<void>;
    wrapper = mount(
        defineComponent({
            setup() {
                ({ runSceneSwitch: run } = useSceneTransition({
                    mutate: () => {},
                    sceneHost: ref<HTMLElement | null>(null),
                    whenSceneReady: () => Promise.resolve(() => {}),
                    currentId: () => "cube",
                }));
                return () => h("div");
            },
        }),
    );
    return { run: (id) => run(id), started: () => started };
}

/** A running, finite animation on `target`, which finishes when `end` is called. */
function running(target: Element): { animation: Animation; end: () => void } {
    let end!: () => void;
    const finished = new Promise<Animation>((r) => (end = () => r(animation)));
    const animation = {
        effect: { target, getComputedTiming: () => ({ endTime: 300 }) },
        playState: "running",
        finished,
        finish() {},
    } as unknown as Animation;
    return { animation, end };
}

describe("3. the press is answered: only a closing overlay's exit holds the swap", () => {
    it("starts the swap while the pressed seat's own transitions still run", async () => {
        const seat = document.createElement("button");
        seat.setAttribute("data-state", "closed");
        document.body.append(seat);
        const press = running(seat);
        document.getAnimations = () => [press.animation];
        const s = switcher();
        const going = s.run("cube");
        await flushPromises();
        frame();
        await going;
        expect(s.started(), "the swap started").toBe(1);
        seat.remove();
    });

    it("waits for a closing list's exit, then starts", async () => {
        const list = document.createElement("div");
        list.setAttribute("role", "listbox");
        list.setAttribute("data-state", "closed");
        const row = document.createElement("div");
        list.append(row);
        document.body.append(list);
        const exit = running(row);
        document.getAnimations = () => [exit.animation];
        const s = switcher();
        const going = s.run("cube");
        await flushPromises();
        frame();
        await flushPromises();
        expect(s.started(), "while the list fades").toBe(0);
        exit.end();
        await going;
        expect(s.started(), "once it has faded").toBe(1);
        list.remove();
    });
});

describe("2. under reduced motion a page change is a fade of the page", () => {
    it("runs an untyped View Transition and fades the new page's image in once it is ready", async () => {
        const media = (query: string) => ({
            matches: query.includes("prefers-reduced-motion: reduce"),
            media: query,
            addEventListener() {},
            removeEventListener() {},
            addListener() {},
            removeListener() {},
            onchange: null,
            dispatchEvent: () => false,
        });
        vi.stubGlobal("matchMedia", media);
        const before = window.matchMedia;
        window.matchMedia = media as unknown as typeof window.matchMedia;
        onTestFinished(() => {
            window.matchMedia = before;
        });
        const calls: Array<{ types: readonly string[] | undefined }> = [];
        (document as unknown as { startViewTransition: unknown }).startViewTransition = vi.fn((arg: unknown) => {
            const update = typeof arg === "function" ? (arg as () => Promise<void>) : (arg as { update: () => Promise<void> }).update;
            calls.push({ types: typeof arg === "function" ? undefined : (arg as { types?: readonly string[] }).types });
            const done = Promise.resolve().then(update);
            return { ready: done, finished: new Promise<void>(() => {}), updateCallbackDone: done, skipTransition() {} };
        });
        const animate = vi.fn();
        document.documentElement.animate = animate as unknown as Element["animate"];
        let run!: (id: string) => Promise<void>;
        wrapper = mount(
            defineComponent({
                setup() {
                    ({ runSceneSwitch: run } = useSceneTransition({
                        mutate: () => {},
                        sceneHost: ref<HTMLElement | null>(null),
                        whenSceneReady: () => Promise.resolve(() => {}),
                        currentId: () => "cube",
                    }));
                    return () => h("div");
                },
            }),
        );
        const going = run("home");
        // The switch waits a frame for closing overlays before it starts.
        await flushPromises();
        frame();
        await going;
        await flushPromises();
        expect(calls, "the platform's View Transition, untyped").toHaveLength(1);
        expect(calls[0]?.types ?? []).toEqual([]);
        expect(animate).toHaveBeenCalledTimes(1);
        const [keyframes, options] = animate.mock.calls[0] ?? [];
        expect(options.pseudoElement).toBe("::view-transition-new(root)");
        expect(keyframes).toEqual([{ opacity: 0 }, { opacity: 1 }]);
        expect(options.duration).toBeGreaterThanOrEqual(100);
        expect(options.duration).toBeLessThanOrEqual(200);
    });
});
