// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.r4shared · A2-KE-L1-18 — the keyboard-operable two-axis subject has
 * ONE seat.
 *
 * Amiga's canvas and the Square's box each hand-built the same recipe: a help
 * text the subject's `aria-describedby` points at, two per-axis values, and an
 * arrow / Shift keymap. The class that hides the Square's copy lived in
 * `SquareScene.css` alone, and the Square's two values were `role="slider"`
 * spans with no tabindex and no keys (UIA-KF-291's inert slider, cured on Amiga
 * only). The seat is `demo/components/SubjectAxes/`:
 *
 *  · `SubjectAxes.vue` renders the help text and the per-axis read-outs
 *    (`role="status"`, never an inert slider), hidden by the published
 *    `.subject-axes-hidden` idiom (design-idioms.css);
 *  · `arrowNudge.ts` is the one arrow keymap: four arrows, Shift for the fine
 *    step, and it declines a ctrl / meta / alt chord (a command is not a nudge).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";

import { warmKfEngine } from "../../../demo/kf-engine";
import SubjectAxes from "../../../demo/components/SubjectAxes/SubjectAxes.vue";
import { arrowNudge } from "../../../demo/components/SubjectAxes/arrowNudge";
import SquareScene from "../../../demo/scenes/square/SquareScene.vue";

const read = (rel: string): string => readFileSync(resolve(process.cwd(), rel), "utf8");
const markup = (rel: string): string => read(rel).replace(/<!--[\s\S]*?-->/g, "");
const key = (k: string, mods: KeyboardEventInit = {}): KeyboardEvent =>
    new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...mods });

describe("A2-KE-L1-18 — the SubjectAxes seat", () => {
    it("renders the help text under the given id and one read-out per axis", () => {
        const w = mount(SubjectAxes, {
            props: { helpId: "help-1", axes: [{ label: "x", value: "0.25" }, { label: "y", value: "-0.50" }] },
            slots: { default: "Arrow keys nudge the subject." },
        });
        const help = w.get("#help-1");
        expect(help.text()).toBe("Arrow keys nudge the subject.");
        expect(help.classes()).toContain("subject-axes-hidden");
        const readouts = w.findAll('[role="status"]');
        expect(readouts.map((r) => r.text())).toEqual(["x 0.25", "y -0.50"]);
        for (const r of readouts) expect(r.classes()).toContain("subject-axes-hidden");
        expect(w.findAll('[role="slider"]')).toHaveLength(0);
        w.unmount();
    });

    it("both scenes consume the seat, and neither authors the recipe itself", () => {
        for (const rel of ["demo/scenes/amiga/AmigaTarget.vue", "demo/scenes/square/SquareScene.vue"]) {
            const src = markup(rel);
            expect(src).toMatch(/<SubjectAxes\b/);
            expect(src).toMatch(/from "@components\/SubjectAxes\/SubjectAxes\.vue"/);
            expect(src).not.toMatch(/role="slider"/);
            expect(src).not.toMatch(/<span[^>]*role="status"/);
        }
        // the keymap's two readers: Amiga's stage and the Square's keyboard layer
        for (const rel of ["demo/scenes/amiga/AmigaTarget.vue", "demo/scenes/square/useSquareKeyboard.ts"]) {
            expect(read(rel)).toMatch(/import \{ arrowNudge, isCommandChord \} from "@components\/SubjectAxes\/arrowNudge"/);
        }
    });

    it("the hiding class is the published idiom, not a scene's own", () => {
        expect(read("demo/scenes/square/SquareScene.css")).not.toMatch(/sr-only-slider/);
        expect(read("demo/scenes/square/SquareScene.vue")).not.toMatch(/sr-only-slider/);
        expect(read("demo/styles/design-idioms.css")).toMatch(/^\.subject-axes-hidden \{/m);
    });
});

describe("A2-KE-L1-18 — the one arrow keymap", () => {
    it("maps the four arrows to a per-axis step, and Shift to the fine step", () => {
        const steps = { step: 0.25, fine: 0.05 };
        expect(arrowNudge(key("ArrowRight"), steps)).toEqual({ dx: 0.25, dy: 0 });
        expect(arrowNudge(key("ArrowLeft"), steps)).toEqual({ dx: -0.25, dy: 0 });
        expect(arrowNudge(key("ArrowDown"), steps)).toEqual({ dx: 0, dy: 0.25 });
        expect(arrowNudge(key("ArrowUp"), steps)).toEqual({ dx: 0, dy: -0.25 });
        expect(arrowNudge(key("ArrowUp", { shiftKey: true }), steps)).toEqual({ dx: 0, dy: -0.05 });
    });

    it("declines every other key and every command chord", () => {
        const steps = { step: 1, fine: 0.1 };
        expect(arrowNudge(key("Home"), steps)).toBeNull();
        expect(arrowNudge(key("a"), steps)).toBeNull();
        for (const mod of ["ctrlKey", "metaKey", "altKey"] as const) {
            expect(arrowNudge(key("ArrowLeft", { [mod]: true }), steps)).toBeNull();
        }
    });
});

describe("A2-KE-L1-18 — the Square's per-axis values are read-outs, never an inert slider", () => {
    beforeAll(async () => {
        await warmKfEngine();
    });

    it("the mounted box carries two status read-outs that follow a keyboard nudge", async () => {
        const wrapper = mount(SquareScene, { attachTo: document.body });
        await nextTick();
        const box = wrapper.get(".demo-box").element as HTMLElement;
        try {
            const inert = [...box.querySelectorAll<HTMLElement>('[role="slider"]')].filter((s) => s.tabIndex < 0);
            expect(inert).toHaveLength(0);
            const texts = (): string[] =>
                [...box.querySelectorAll('[role="status"]')].map((e) => e.textContent!.trim());
            expect(texts()).toEqual(["x 0.00", "y 0.00"]);

            const help = document.getElementById(box.getAttribute("aria-describedby")!);
            expect(box.contains(help)).toBe(true);
            expect(help?.textContent?.trim().length ?? 0).toBeGreaterThan(20);

            const right = key("ArrowRight");
            box.dispatchEvent(right);
            expect(right.defaultPrevented).toBe(true);
            await nextTick();
            expect(texts()).toEqual(["x 0.25", "y 0.00"]);

            // a command chord is the app's, not a nudge
            const chord = key("ArrowRight", { metaKey: true });
            box.dispatchEvent(chord);
            expect(chord.defaultPrevented).toBe(false);
            await nextTick();
            expect(texts()).toEqual(["x 0.25", "y 0.00"]);
        } finally {
            (wrapper.vm as unknown as { facility: { group: { stop(): void } } }).facility.group.stop();
            wrapper.unmount();
        }
    });
});
