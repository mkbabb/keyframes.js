/**
 * KF.W13U.d2 (OA-32, COHESION §0bh) — the living dock icons.
 *
 * (1) The descriptor's `icon` is the ONE binding, and it is the scene's own
 *     miniature (exported from the scene's directory) — no dock-local registry.
 * (2) The dock renders the CHOSEN scene's icon `live` at both of its sites (the
 *     collapsed face and the expanded trigger).
 * (3) Each miniature plays ITS scene's animation through the keyframes.js
 *     engine only while `live`, and stops it on unmount; at rest nothing plays.
 *
 * Born RED at the pre-cure bytes: the icons were static `?component` SVGs, so
 * (1) failed on identity and (2) saw no `live` prop.
 */
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { defineComponent, h, type Component } from "vue";
import { mount } from "@vue/test-utils";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import { Sequence } from "@mkbabb/keyframes.js";
import ChromeDock from "@app/dock/ChromeDock.vue";
import { homeScene, scenes } from "@app/scene/scenes";
import { kfEngine, warmKfEngine } from "@kf-engine";
import CubeMini from "../../../demo/scenes/cube/CubeMini.vue";
import AmigaMini from "../../../demo/scenes/amiga/AmigaMini.vue";
import SquareMini from "../../../demo/scenes/square/SquareMini.vue";
import EasingMini from "../../../demo/scenes/easing/EasingMini.vue";
import SpringMini from "../../../demo/scenes/spring/SpringMini.vue";
import SequenceMini from "../../../demo/scenes/sequence/SequenceMini.vue";

const MINIS: Record<string, Component> = {
    cube: CubeMini,
    amiga: AmigaMini,
    square: SquareMini,
    easing: EasingMini,
    spring: SpringMini,
    sequence: SequenceMini,
};

const savedResizeObserver = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;

beforeAll(async () => {
    await warmKfEngine();
    class NoopResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    }
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = NoopResizeObserver;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver = NoopResizeObserver;
    if (!window.matchMedia) {
        (window as unknown as { matchMedia: unknown }).matchMedia = (query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener() {},
            removeListener() {},
            addEventListener() {},
            removeEventListener() {},
            dispatchEvent: () => false,
        });
    }
});

afterAll(() => {
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = savedResizeObserver;
    (window as unknown as { ResizeObserver?: unknown }).ResizeObserver = savedResizeObserver;
});

afterEach(() => vi.restoreAllMocks());

describe("OA-32 — the descriptor's icon is the scene's own miniature (one binding)", () => {
    it("(1) every routable scene binds the miniature its directory exports; home keeps none", () => {
        expect(scenes.map((s) => s.id)).toEqual(Object.keys(MINIS));
        for (const scene of scenes) expect(scene.icon).toBe(MINIS[scene.id]);
        expect(homeScene.icon).toBeUndefined();
    });
});

describe("OA-32 — the dock renders the chosen scene's icon live", () => {
    it("(2) both chosen-icon sites (collapsed face + trigger) receive `live`", () => {
        const seen: (boolean | undefined)[] = [];
        const Probe = defineComponent({
            props: { live: { type: Boolean, default: undefined } },
            setup(props) {
                seen.push(props.live);
                return () => h("span", { "data-probe": "" });
            },
        });
        const wrapper = mount(
            defineComponent(() => () =>
                h(TooltipProvider, null, () =>
                    h(ChromeDock, {
                        currentSceneId: "cube",
                        scenes: [{ id: "cube", label: "Cube", icon: Probe }],
                        homeScene: { id: "home", label: "Home" },
                        isControlsPanelOpen: false,
                    }),
                ),
            ),
            { attachTo: document.body },
        );
        expect(seen.length).toBeGreaterThanOrEqual(1);
        expect(seen.every((live) => live === true)).toBe(true);
        wrapper.unmount();
    });
});

describe("OA-32 — each miniature plays its scene's animation through the engine only while live", () => {
    const spyPlays = () => {
        const { CSSKeyframesAnimation, AnimationGroup } = kfEngine();
        const plays: string[] = [];
        const stops: string[] = [];
        for (const [name, proto] of [
            ["group", AnimationGroup.prototype],
            ["keyframes", CSSKeyframesAnimation.prototype],
            ["sequence", Sequence.prototype],
        ] as const) {
            vi.spyOn(proto as { play: () => unknown }, "play").mockImplementation(function () {
                plays.push(name);
                return Promise.resolve();
            });
            vi.spyOn(proto as { stop: () => unknown }, "stop").mockImplementation(function (this: unknown) {
                stops.push(name);
                return this;
            });
        }
        return { plays, stops };
    };

    const ENGINE: Record<string, { kind: string; count: number }> = {
        cube: { kind: "group", count: 1 }, // Rotations + Hover, one group
        amiga: { kind: "group", count: 1 }, // Spin + Bouncing X + Bouncing Y
        square: { kind: "keyframes", count: 1 }, // the diamond tour
        easing: { kind: "keyframes", count: 1 }, // the preview sweep
        spring: { kind: "keyframes", count: 4 }, // the four preset lanes
        sequence: { kind: "sequence", count: 1 }, // the staggered storyboard
    };

    for (const [id, Mini] of Object.entries(MINIS)) {
        it(`(3) ${id}: live plays ${ENGINE[id]!.count}× ${ENGINE[id]!.kind}, unmount stops; rest plays nothing`, () => {
            const rest = spyPlays();
            const idle = mount(Mini, { props: { live: false }, attachTo: document.body });
            expect(rest.plays).toEqual([]);
            expect(idle.find("[data-live]").exists()).toBe(false);
            idle.unmount();
            vi.restoreAllMocks();

            const run = spyPlays();
            const live = mount(Mini, { props: { live: true }, attachTo: document.body });
            expect(run.plays).toEqual(Array(ENGINE[id]!.count).fill(ENGINE[id]!.kind));
            expect(live.find("[data-layer]").exists()).toBe(true);
            live.unmount();
            expect(run.stops.filter((k) => k === ENGINE[id]!.kind).length).toBeGreaterThanOrEqual(
                ENGINE[id]!.count,
            );
        });
    }
});
