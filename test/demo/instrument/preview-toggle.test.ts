/**
 * X.KF.W13W.e · OA-61 (KF-W13.md §0cq :485-490) → X-DS pass 1 · KF-P1-01
 * (value.js X-DS.md; the owner, 2026-10-06: "visibility icon is just floating
 * meaninglessly") — ONE eye toggle for the ball preview, in every view that
 * carries it, SEATED in the ribbon's transport row.
 *
 * (1) census: the eye / eye-off glyph pair is imported by exactly one demo
 *     component, PlaybackRibbon — no duplicate toggle survives;
 * (2) every PlaybackRibbon mount binds the preview state (every view offers it);
 * (3) the eye has a home: it is a labelled Button beside Reverse in the
 *     ribbon's transport row, in flow — no out-of-flow eye remains on the
 *     preview; hidden keeps the preview's box (visibility, never display / v-if);
 * (4) the hide/show is a cross-fade + scale on the engine's own spring
 *     (`springTimingFunction(...).css`), and reduced motion drops the
 *     transition (instant);
 * (5) behaviour: the wrapper carries the state and keeps the slotted preview
 *     mounted while hidden; it renders no control of its own (the press is the
 *     ribbon's, asserted in playback-ribbon-contract "OA-10").
 * Born RED at the pre-cure bytes (OA-61: no PreviewToggle; X-DS: the eye
 * absolutely positioned over the ghost dot).
 */
import { describe, expect, it } from "vitest";
import { h } from "vue";
import { mount } from "@vue/test-utils";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(__dirname, "../../..");
const DEMO = join(ROOT, "demo");
const TOGGLE = "demo/components/playback/PreviewToggle.vue";
const RIBBON = "demo/components/playback/PlaybackRibbon.vue";

function walk(dir: string, out: string[] = []): string[] {
    for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) walk(p, out);
        else if (/\.(vue|ts)$/.test(name)) out.push(p);
    }
    return out;
}
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8");

describe("OA-61 · KF-P1-01 — one seated eye toggle for the ball preview", () => {
    it("(1) exactly one demo component imports the eye / eye-off glyphs", () => {
        const sites = walk(DEMO)
            .filter((p) => /import\s*\{[^}]*\bEye(Off)?\b[^}]*\}\s*from\s*"@lucide\/vue"/.test(readFileSync(p, "utf8")))
            .map((p) => relative(ROOT, p));
        expect(sites).toEqual([RIBBON]);
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

    it("(3) the eye is seated in the ribbon's transport row, in flow; hidden collapses its row", () => {
        const src = read(TOGGLE);
        // No control, and nothing out of flow, is left on the preview itself.
        expect(src).not.toMatch(/<Button\b|preview-toggle__eye/);
        expect(src).not.toMatch(/position:\s*absolute/);
        const hidden = src.match(/\[data-state="hidden"\] \.preview-toggle__body\s*\{([^}]*)\}/)![1]!;
        expect(hidden).toMatch(/visibility:\s*hidden/);
        expect(hidden).not.toMatch(/display:/);
        expect(src).not.toMatch(/v-if="state === 'hidden'|v-show/);
        // X-DS pass 1, C1 (KF-C1-04) — the hidden preview stays mounted but its
        // row collapses (1fr → 0fr on the same spring), leaving no empty slab.
        const root = src.match(/\.preview-toggle\[data-state="hidden"\]\s*\{([^}]*)\}/)![1]!;
        expect(root).toMatch(/grid-template-rows:\s*0fr/);
        expect(src).toMatch(/grid-template-rows var\(--preview-toggle-ms\) var\(--preview-ease\)/);

        // The ribbon: Reverse and the eye are siblings of ONE row, and the eye
        // is labelled. X-DS pass 1, C1 (KF-C1-03): the eye is glass's quiet
        // Button, subordinate to Reverse, and does not wear Reverse's skin.
        const ribbon = read(RIBBON);
        const template = ribbon.slice(0, ribbon.indexOf("<script"));
        // X-DS pass 5 (KF-C5-10): the two are PEERS at content width — a flex
        // row (no `1fr` track stretching Reverse), both glass `quiet`.
        const row = template.match(/<div\s+class="flex flex-wrap items-center gap-2"[\s\S]*?<\/Tooltip>\s*<\/div>/)![0];
        expect(row).toMatch(/<span>Reverse<\/span>/);
        expect(row).toMatch(/aria-label="Ball preview"/);
        expect(row).toMatch(/:aria-pressed="preview !== 'hidden'"/);
        expect(row).toMatch(/<span>Preview<\/span>/);
        expect(row.match(/emphasis="quiet"/g)).toHaveLength(2);
        expect(row).not.toMatch(/1fr/);
        expect(row.match(/class="btn-playback rounded-full gap-2"/g)).toHaveLength(1);
        expect(ribbon).not.toMatch(/position:\s*absolute/);
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

    it("(5) the wrapper carries the state, keeps the preview mounted while hidden, and renders no control", async () => {
        const { default: PreviewToggle } = await import("../../../demo/components/playback/PreviewToggle.vue");
        const w = mount(PreviewToggle, {
            props: { state: "shown" },
            slots: { default: () => h("div", { "data-preview": "" }) },
            attachTo: document.body,
        });
        expect(w.find(".preview-toggle").attributes("data-state")).toBe("shown");
        await w.setProps({ state: "hidden" });
        expect(w.find(".preview-toggle").attributes("data-state")).toBe("hidden");
        expect(w.find("[data-preview]").exists()).toBe(true);
        expect(w.find("button").exists()).toBe(false);
        w.unmount();

        const bare = mount(PreviewToggle, { slots: { default: () => h("div", { "data-preview": "" }) } });
        expect(bare.find("button").exists()).toBe(false);
        expect(bare.find(".preview-toggle").attributes("data-state")).toBe("shown");
        bare.unmount();
    });
});
