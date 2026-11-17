/**
 * KF-URL (owner 2026-11-15: "Each page should have state defined in the URL")
 * — the one URL writer and its codecs (demo/app/scene/urlState.ts), under a
 * real vue-router: a default view writes nothing; a link's value is applied; a
 * continuous value replaces the entry once it rests; a discrete pick pushes;
 * Back re-applies; a key never binds while another scene is the route's.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";
import { flag, num, nums, oneOf, useUrlState, type UrlKey } from "../../../demo/app/scene/urlState";

const Stub = { render: () => null };
const makeRouter = () =>
    createRouter({
        history: createMemoryHistory(),
        routes: [
            { path: "/", name: "home", component: Stub },
            { path: "/a", name: "a", component: Stub },
            { path: "/b", name: "b", component: Stub },
        ],
    });

const settle = async (ms = 0) => {
    await vi.advanceTimersByTimeAsync(ms);
    await nextTick();
    await vi.advanceTimersByTimeAsync(0);
    await nextTick();
};

function harness(start: string) {
    const router = makeRouter();
    const speed = ref(1);
    const mode = ref<"x" | "y" | "z">("x");
    const keys: UrlKey<any>[] = [
        { key: "s", get: () => speed.value, set: (v: number) => (speed.value = v), fallback: () => 1, ...num(2), history: "replace" },
        { key: "m", get: () => mode.value, set: (v: "x" | "y" | "z") => (mode.value = v), fallback: () => "x", ...oneOf(() => ["x", "y", "z"] as const), history: "push" },
    ];
    const App = defineComponent({
        setup() {
            useUrlState(keys, { scene: () => "a" });
            return () => h("div");
        },
    });
    return { router, speed, mode, App, start };
}

describe("urlState", () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it("codecs: rounded numbers, lists, closed sets, flags; refusals are undefined", () => {
        expect(num(2).encode(1.23456)).toBe("1.23");
        expect(num(2).decode("1.239")).toBe(1.24);
        expect(num(2).decode("x")).toBeUndefined();
        expect(nums(0, 3).encode([1.4, 2.6, 3])).toBe("1,3,3");
        expect(nums(0, 3).decode("1,2")).toBeUndefined();
        expect(oneOf(() => ["a", "b"] as const).decode("c")).toBeUndefined();
        expect(flag.decode("0")).toBe(false);
        expect(flag.decode("yes")).toBeUndefined();
    });

    it("a default view writes nothing; a link's values apply; a refused value is ignored", async () => {
        vi.useFakeTimers();
        const t = harness("/a");
        await t.router.push("/a");
        await t.router.isReady();
        mount(t.App, { global: { plugins: [t.router] } });
        await settle(300);
        expect(t.router.currentRoute.value.fullPath).toBe("/a");

        const u = harness("/a?s=2.5&m=z");
        await u.router.push("/a?s=2.5&m=z");
        mount(u.App, { global: { plugins: [u.router] } });
        await settle(300);
        expect(u.speed.value).toBe(2.5);
        expect(u.mode.value).toBe("z");

        const w = harness("/a?m=q");
        await w.router.push("/a?m=q");
        mount(w.App, { global: { plugins: [w.router] } });
        await settle(300);
        expect(w.mode.value).toBe("x");
    });

    it("a continuous value replaces the entry after it rests; a discrete pick pushes; Back re-applies", async () => {
        vi.useFakeTimers();
        const t = harness("/a");
        await t.router.push("/a");
        mount(t.App, { global: { plugins: [t.router] } });
        await settle(300);
        const pushes = vi.spyOn(t.router, "push");
        const replaces = vi.spyOn(t.router, "replace");

        // A drag: many values, one write, after it rests.
        for (const v of [1.1, 1.2, 1.3, 1.4]) {
            t.speed.value = v;
            await settle(40);
        }
        expect(replaces).not.toHaveBeenCalled();
        await settle(300);
        expect(replaces).toHaveBeenCalledTimes(1);
        expect(t.router.currentRoute.value.query).toEqual({ s: "1.4" });

        // A pick: pushed at once.
        t.mode.value = "y";
        await settle(0);
        expect(pushes).toHaveBeenCalledTimes(1);
        expect(t.router.currentRoute.value.query).toEqual({ s: "1.4", m: "y" });

        // Back: the URL's view is applied to the state.
        t.router.back();
        await settle(300);
        expect(t.mode.value).toBe("x");
        expect(t.speed.value).toBe(1.4);
    });

    it("a key does not bind, read or write while another scene is the route's", async () => {
        vi.useFakeTimers();
        const t = harness("/b");
        await t.router.push("/b?s=3");
        mount(t.App, { global: { plugins: [t.router] } });
        await settle(300);
        expect(t.speed.value).toBe(1);
        t.speed.value = 2;
        await settle(300);
        expect(t.router.currentRoute.value.fullPath).toBe("/b?s=3");
    });
});
