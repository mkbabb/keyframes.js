/**
 * X.KF.W13X.lib — the AUDIT-2 Lens-1 cogency rows, one falsifier per row.
 *
 * Each case is RED at the wave's open bytes (kf `b2180040`) and GREEN once the
 * row's cure lands: a twin deleted with its replacement, a local copy retired
 * onto the glass seam, dead idiom removed. Sources are read through Vite's own
 * module graph (`import.meta.glob`), so a deleted file reads as an absent key.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";

const demoSources = import.meta.glob<string>(
    ["../../demo/**/*.{ts,vue,css}", "!../../demo/**/*.d.ts"],
    { query: "?raw", import: "default", eager: true },
);

/** Every demo source path (repo-relative, `demo/…`). */
const demoPaths = Object.keys(demoSources).map((p) => p.replace("../../", ""));
const source = (path: string): string => {
    const text = demoSources[`../../${path}`];
    if (text === undefined) throw new Error(`no demo source at ${path}`);
    return text;
};

afterEach(() => {
    vi.restoreAllMocks();
});

describe("A2-KE-L1-2 — one drag seam", () => {
    it("the transport's useDragCapture twin is gone; both former consumers ride useDragScrub", () => {
        expect(demoPaths.filter((p) => /useDragCapture/.test(p))).toEqual([]);
        for (const path of [
            "demo/components/playback/AnimationVisualizer.vue",
            "demo/components/playback/PlaybackRibbon.vue",
        ]) {
            expect(source(path)).toContain('from "@composables/useDragScrub"');
        }
    });
});

describe("A2-KE-L1-17 — one live lifecycle for the dock miniatures", () => {
    const minis = demoPaths.filter((p) => /^demo\/scenes\/[^/]+\/[A-Za-z]+Mini\.vue$/.test(p));

    it("all six minis share useLiveMini and none re-implements the watch(live) block", () => {
        expect(minis).toHaveLength(6);
        for (const path of minis) {
            const text = source(path);
            expect(text, path).toContain('from "@composables/useLiveMini"');
            expect(text, path).not.toMatch(/watch\(\s*\(\)\s*=>\s*live/);
        }
    });

    it("useLiveMini seats before the first play, follows `live`, and stops on unmount", async () => {
        const { useLiveMini } = await import("@composables/useLiveMini");
        const calls: string[] = [];
        const player = {
            play: () => calls.push("play"),
            stop: () => calls.push("stop"),
        };
        const live = ref(true);
        const Host = defineComponent({
            setup() {
                useLiveMini(player, () => live.value, () => calls.push("seat"));
                return () => h("i");
            },
        });
        const wrapper = mount(Host);
        expect(calls).toEqual(["seat", "play"]);
        live.value = false;
        await nextTick();
        expect(calls).toEqual(["seat", "play", "stop"]);
        wrapper.unmount();
        expect(calls).toEqual(["seat", "play", "stop", "stop"]);
    });
});
