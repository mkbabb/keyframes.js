/**
 * X.KF.W13W.e · OA-61 (KF-W13.md §0cq :485-490) — ONE floating eye toggle for
 * the ball preview, in every view that carries it.
 *
 * (1) census: the eye / eye-off glyph pair is imported by exactly one demo
 *     component, PreviewToggle — no duplicate toggle survives;
 * (2) every PlaybackRibbon mount binds the preview state (every view offers it);
 * (3) out of flow: the eye is absolutely positioned in the top-right corner;
 *     hidden keeps the preview's box (visibility, never display / v-if);
 * (4) the hide/show is a cross-fade + scale on the engine's own spring
 *     (`springTimingFunction(...).css`), and reduced motion drops the
 *     transition (instant);
 * (5) behaviour: a press asks for the other state, pressed = hidden, the
 *     slotted preview stays mounted while hidden; unbound, no eye.
 * Born RED at the pre-cure bytes (no PreviewToggle; three eye sites).
 */
import { describe, expect, it } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(__dirname, "../../..");
const DEMO = join(ROOT, "demo");
const TOGGLE = "demo/components/playback/PreviewToggle.vue";

function walk(dir: string, out: string[] = []): string[] {
    for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) walk(p, out);
        else if (/\.(vue|ts)$/.test(name)) out.push(p);
    }
    return out;
}
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8");

describe("OA-61 — one floating eye toggle for the ball preview", () => {
    it("(1) exactly one demo component imports the eye / eye-off glyphs", () => {
        const sites = walk(DEMO)
            .filter((p) => /import\s*\{[^}]*\bEye(Off)?\b[^}]*\}\s*from\s*"@lucide\/vue"/.test(readFileSync(p, "utf8")))
            .map((p) => relative(ROOT, p));
        expect(sites).toEqual([TOGGLE]);
    });

    it("(2) every PlaybackRibbon mount binds the preview state", () => {
        const mounts = walk(DEMO).filter((p) => /h\(PlaybackRibbon|<PlaybackRibbon\b/.test(readFileSync(p, "utf8")));
        expect(mounts.length).toBeGreaterThanOrEqual(3);
        for (const p of mounts) {
            const src = readFileSync(p, "utf8");
            expect([relative(ROOT, p), /\bpreview:|:preview=/.test(src)]).toEqual([relative(ROOT, p), true]);
            expect(/ballPreview/.test(src)).toBe(true);
        }
        expect(read("demo/components/playback/PlaybackRibbon.vue")).toMatch(/<PreviewToggle\b/);
    });

    it("(3) the eye is absolutely positioned top-right; hidden keeps the box", () => {
        const src = read(TOGGLE);
        const eye = src.match(/\.preview-toggle__eye\s*\{([^}]*)\}/)![1]!;
        expect(eye).toMatch(/position:\s*absolute/);
        expect(eye).toMatch(/top:\s*0/);
        expect(eye).toMatch(/right:\s*0/);
        const hidden = src.match(/\[data-state="hidden"\] \.preview-toggle__body\s*\{([^}]*)\}/)![1]!;
        expect(hidden).toMatch(/visibility:\s*hidden/);
        expect(hidden).not.toMatch(/display:/);
        expect(src).not.toMatch(/v-if="state === 'hidden'|v-show/);
    });

    it("(4) cross-fade + scale on the engine's spring; reduced motion is instant", () => {
        const src = read(TOGGLE);
        expect(src).toMatch(/springTimingFunction\([^)]*\)\.css/);
        expect(src).toMatch(/opacity var\(--preview-toggle-ms\) var\(--preview-ease\)/);
        expect(src).toMatch(/transform var\(--preview-toggle-ms\) var\(--preview-ease\)/);
        expect(src).toMatch(/transform:\s*scale\(/);
        const prm = src.match(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/)![1]!;
        expect(prm).toMatch(/transition:\s*none/);
    });

    it("(5) a press asks for the other state; hidden keeps the preview mounted; unbound offers no eye", async () => {
        const { default: PreviewToggle } = await import("../../../demo/components/playback/PreviewToggle.vue");
        const state = ref<"shown" | "hidden">("shown");
        const Host = defineComponent({
            setup() {
                return () =>
                    h(
                        PreviewToggle,
                        { state: state.value, "onUpdate:state": (n: "shown" | "hidden") => (state.value = n) },
                        () => h("div", { "data-preview": "" }),
                    );
            },
        });
        const w = mount(Host, { attachTo: document.body });
        const eye = () => w.find('button[aria-label="Hide ball preview"]');
        expect(eye().attributes("aria-pressed")).toBe("false");
        expect(w.find(".preview-toggle").attributes("data-state")).toBe("shown");
        await eye().trigger("click");
        await nextTick();
        expect(state.value).toBe("hidden");
        expect(eye().attributes("aria-pressed")).toBe("true");
        expect(w.find(".preview-toggle").attributes("data-state")).toBe("hidden");
        expect(w.find("[data-preview]").exists()).toBe(true);
        w.unmount();

        const bare = mount(PreviewToggle, { slots: { default: () => h("div", { "data-preview": "" }) } });
        expect(bare.find("button").exists()).toBe(false);
        expect(bare.find(".preview-toggle").attributes("data-state")).toBe("shown");
        bare.unmount();
    });
});
