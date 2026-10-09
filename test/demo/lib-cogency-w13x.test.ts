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
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const demoSources = import.meta.glob<string>(
    ["../../demo/**/*.{ts,vue,css}", "!../../demo/**/*.d.ts"],
    { query: "?raw", import: "default", eager: true },
);

/** Every demo source path (repo-relative, `demo/…`). */
const demoPaths = Object.keys(demoSources).map((p) => p.replace("../../", ""));
const source = (path: string): string => {
    // Vite's `?raw` hands stylesheets through its CSS pipeline (empty under the
    // test transform), so a stylesheet is read from disk.
    if (path.endsWith(".css")) return readFileSync(resolve(process.cwd(), path), "utf8");
    const text = demoSources[`../../${path}`];
    if (text === undefined) throw new Error(`no demo source at ${path}`);
    return text;
};

/** The demo's cross-cutting composables, loaded lazily so an absent module is a
 *  failing case (not a file that cannot load). */
const composables = import.meta.glob("../../demo/composables/*.ts");
const loadComposable = async <M>(name: string): Promise<M> => {
    const load = composables[`../../demo/composables/${name}.ts`];
    expect(load, `demo/composables/${name}.ts`).toBeDefined();
    return (await load!()) as M;
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
        const { useLiveMini } = await loadComposable<typeof import("@composables/useLiveMini")>(
            "useLiveMini",
        );
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

describe("A2-KE-L1-21 — dead CSS and the tab-role idiom", () => {
    it("tab-idiom.css is retired; its panel-enter rule lives in design-idioms.css on data-surface-panel", () => {
        expect(demoPaths).not.toContain("demo/styles/tab-idiom.css");
        const idioms = source("demo/styles/design-idioms.css");
        expect(idioms).not.toContain(`@import "./tab-idiom.css"`);
        expect(idioms).toMatch(
            /\[data-surface-panel\]\[data-state="active"\]\s*\{\s*animation:\s*enter\b/,
        );
        expect(idioms).not.toMatch(/\[role="tabpanel"\]\s*\{/);
    });

    it("every surface panel carries the attribute the rule keys on", () => {
        const controls = source(
            "demo/components/instrument/transport/channel-controls/ChannelControls.vue",
        );
        const panels = controls.match(/role="tabpanel"\n\s*data-surface-panel\n/g) ?? [];
        expect(panels).toHaveLength((controls.match(/^\s*role="tabpanel"$/gm) ?? []).length);
        expect(panels.length).toBeGreaterThan(0);
        // X.KF.W13X.r4pane · UIA-KF-161 — the host renders every surface's
        // panel, scene facets included; a scene hands only the body, so no
        // scene-side tabpanel exists to carry (or miss) the attribute.
        expect(source("demo/scenes/cube/CubeScene.vue")).not.toMatch(/role: "tabpanel"/);
    });

    it("the idiom recipes with no consumer are deleted (.reverse-badge, .progress-bar, .progress-dot)", () => {
        const idioms = source("demo/styles/design-idioms.css");
        for (const cls of [".reverse-badge", ".progress-bar", ".progress-dot"]) {
            expect(idioms, cls).not.toContain(`${cls} {`);
        }
    });

    it("the two never-read description tables are deleted", async () => {
        const mod = await import("@utils/reference-data/animationDescriptions");
        expect(Object.keys(mod)).not.toContain("DIRECTION_DESCRIPTIONS");
        expect(Object.keys(mod)).not.toContain("FILL_MODE_DESCRIPTIONS");
    });
});

describe("A2-KE-L1-19 — the clipboard write is glass's, and a refusal speaks", () => {
    it("the demo's own copyText helper is deleted; no demo file writes the clipboard bare", () => {
        expect(demoPaths).not.toContain("demo/utils/clipboard.ts");
        for (const path of demoPaths.filter((p) => !p.endsWith(".css"))) {
            expect(source(path), path).not.toMatch(/navigator\.clipboard\.writeText/);
        }
    });

    it("a refused write resolves to a named failure and raises a destructive toast (no unhandled rejection)", async () => {
        const toastMod = await import("@mkbabb/glass-ui/toast");
        const toastSpy = vi.spyOn(toastMod, "toast");
        Object.defineProperty(navigator, "clipboard", {
            value: { writeText: () => Promise.reject(new DOMException("denied", "NotAllowedError")) },
            configurable: true,
        });
        const { copyWithToast } = await loadComposable<
            typeof import("@composables/copyWithToast")
        >("copyWithToast");
        await expect(copyWithToast("x", "copied")).resolves.toEqual({ ok: false, reason: "clipboard-api" });
        expect(toastSpy).toHaveBeenCalledTimes(1);
        expect(toastSpy.mock.calls[0]?.[0]).toMatchObject({ tone: "destructive" });
    });
});

describe("A2-KE-L3-11 — one label track across panes", () => {
    it("the labeled-field grid floors its label column at the one --pane-label-col token", () => {
        const idioms = source("demo/styles/design-idioms.css");
        expect(idioms).toMatch(/--pane-label-col:\s*calc\(var\(--control-label\)/);
        expect(idioms).toMatch(
            /grid-template-columns:\s*\[label\]\s*minmax\(var\(--pane-label-col\),\s*auto\)\s*\[value\]\s*1fr/,
        );
    });
});

describe("A2-KE-L1-15 (limb e) — components/playback does not up-import the transport's composables", () => {
    it("the playback components read cross-cutting composables from demo/composables", () => {
        for (const path of demoPaths.filter((p) => p.startsWith("demo/components/playback/"))) {
            expect(source(path), path).not.toMatch(/from "@components\/instrument\/transport\/composables\//);
        }
        expect(demoPaths).toContain("demo/composables/useDemoTicker.ts");
    });
});
