/**
 * X.KF.W13X.sections — the section-header rows' falsifiers (KF-W13 addenda (c)/(d);
 * AUDIT-2 A2-KE-L1-8 · A2-KE-L3-15; the RibbonBar limbs re-homed here by
 * `.timeline` / `.keyframes`: UIA-KF-173 · UIA-KF-175 · UIA-KF-179).
 *
 * (1) addendum (c) — every section action that sat alone on a body row (reset,
 *     refresh) rides its section's glass header (`ConfiguratorLayer #actions`,
 *     glass 10.1.0 O-68). Census: in the scene sources and the controls pane, a
 *     reset/refresh glyph appears only inside an `#actions` slot.
 * (2) the matrix Reset: MatrixEditor's "Transform matrix" layer carries it in
 *     `#actions`; CubeScene no longer hands the ribbon a lone Reset card.
 * (3) detached (addendum (c), shaped as fourier `f-w14v-detached.spec.ts`): every
 *     glass `Configurator` the demo mounts with a stage and an aside wears
 *     `layout="detached"` (the served `da` probe reads the band itself).
 * (4) A2-KE-L1-8 — the scene stage header is ONE component: every stage site
 *     renders `SceneStageHeader`, and the status-badge markup exists once.
 * (5) A2-KE-L3-15 · UIA-KF-179 — the Timeline ribbon is ONE row with a lead
 *     action: the lead is labelled, the rest are named icon commands, no wrap.
 * (6) UIA-KF-175 — Apply CSS is a toggle and says so (`aria-pressed`).
 * (7) UIA-KF-173 — the two clipboard verbs are named for what they copy.
 */
import { afterEach, describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { createApp, h, reactive } from "vue";
import RibbonBar from "../../../demo/components/instrument/transport/controls-pane/RibbonBar.vue";
import KeyframeTimeline from "../../../demo/components/instrument/timeline/KeyframeTimeline.vue";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";

const ROOT = process.cwd();
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8");
function vueFiles(dir: string): string[] {
    const out: string[] = [];
    for (const name of readdirSync(join(ROOT, dir))) {
        const rel = `${dir}/${name}`;
        if (statSync(join(ROOT, rel)).isDirectory()) out.push(...vueFiles(rel));
        else if (name.endsWith(".vue")) out.push(rel);
    }
    return out;
}
const withoutImports = (src: string) => src.replace(/^import[\s\S]*?from\s+["'][^"']+["'];?$/gm, "");
const withoutActions = (src: string) => src.replace(/<template #actions>[\s\S]*?<\/template>/g, "");
const withoutComments = (src: string) => src.replace(/<!--[\s\S]*?-->/g, "").replace(/^\s*\/\/.*$/gm, "");

describe("(1) addendum (c) — no reset/refresh action on a body row", () => {
    const files = [...vueFiles("demo/scenes"), ...vueFiles("demo/components/instrument/transport/controls-pane")];
    it.each(files)("%s", (rel) => {
        const body = withoutActions(withoutComments(withoutImports(read(rel))));
        expect(body).not.toMatch(/<(RotateCcw|RefreshCw|RotateCw)\b|h\((RotateCcw|RefreshCw|RotateCw)\b/);
        expect(body).not.toMatch(/>\s*Reset\s*</);
        expect(body).not.toMatch(/"\s*Reset\s*"\]/);
    });
});

describe("(2) the matrix Reset rides the Transform matrix header", () => {
    it("MatrixEditor's ConfiguratorLayer #actions raises resetMatrix; no body row holds it", () => {
        const src = read("demo/scenes/cube/matrix-editor/MatrixEditor.vue");
        const tpl = src.slice(src.indexOf("<template>"), src.lastIndexOf("</template>"));
        const actions = tpl.match(/<ConfiguratorLayer[^>]*label="Transform matrix"[\s\S]*?<template #actions>([\s\S]*?)<\/template>/)?.[1] ?? "";
        expect(actions, "a Transform matrix ConfiguratorLayer with an #actions slot").not.toBe("");
        expect(actions).toMatch(/emit\(\s*["']resetMatrix["']\s*\)/);
        expect(tpl.replace(actions, "")).not.toMatch(/resetMatrix/);
    });
    it("CubeScene wires the header's reset and hands the ribbon no lone Reset", () => {
        const src = read("demo/scenes/cube/CubeScene.vue");
        expect(src).toMatch(/onResetMatrix:\s*resetMatrix/);
        expect(src).not.toMatch(/const ribbonContent\b/);
    });
});

describe("(3) detached — every stage+aside Configurator wears layout=\"detached\"", () => {
    const files = vueFiles("demo").filter((f) => !f.startsWith("demo/components/ui/"));
    it("census", () => {
        const mounts = files.flatMap((rel) => [...read(rel).matchAll(/<Configurator\b[^>]*>/g)].map((m) => ({ rel, tag: m[0] })));
        for (const m of mounts) expect(m.tag, m.rel).toMatch(/layout="detached"/);
    });
});

describe("(4) A2-KE-L1-8 — one scene stage header", () => {
    const SITES = [
        "demo/scenes/spring/SpringTarget.vue",
        "demo/scenes/sequence/SequenceTarget.vue",
        "demo/scenes/easing/EasingTarget.vue",
        "demo/scenes/square/SquareInstrument.vue",
        "demo/scenes/spring/StartingStyleTarget.vue",
    ];
    it.each(SITES)("%s renders SceneStageHeader", (rel) => {
        const src = read(rel);
        expect(src).toMatch(/<SceneStageHeader\b/);
        expect(src).not.toMatch(/<CardHeader\b|<CardTitle\b/);
    });
    it("the status-badge markup is authored once, in SceneStageHeader", () => {
        const owners = vueFiles("demo").filter((rel) => /class="status-badge\b/.test(read(rel)));
        expect(owners).toEqual(["demo/scenes/SceneStageHeader.vue"]);
    });
});

const mounted: { unmount: () => void; el: HTMLElement }[] = [];
afterEach(() => {
    for (const m of mounted.splice(0)) {
        m.unmount();
        m.el.remove();
    }
});
function mountRibbon(selectedControl: string, cssApplied = false) {
    const el = document.createElement("div");
    document.body.appendChild(el);
    const storedControls = reactive({ selectedControl, selectedAnimation: "a" });
    const app = createApp({
        render: () =>
            h(RibbonBar, {
                storedControls: storedControls as never,
                activeKeyframesRef: { cssApplied },
            }),
    });
    app.mount(el);
    mounted.push({ unmount: () => app.unmount(), el });
    return el;
}

describe("(5) A2-KE-L3-15 · UIA-KF-179 — the Timeline verbs are one row with a lead", () => {
    // X-DS pass 2 (KF-C2-04) — the row is KeyframeTimeline's own (it
    // teleports into the ribbon while docked; timeline-expanded-surface pins
    // where it lands), so its structure is read off the timeline.
    it("the lead is labelled, the others are named icon commands, and the row never wraps", () => {
        const el = document.createElement("div");
        document.body.appendChild(el);
        const app = createApp({
            render: () =>
                h(TooltipProvider, null, () =>
                    h(KeyframeTimeline, { targets: [document.createElement("div")], expanded: false }),
                ),
        });
        app.component("CSSPasteDialog", { render: () => null });
        app.mount(el);
        mounted.push({ unmount: () => app.unmount(), el });
        const lead = [...el.querySelectorAll("button")].find((b) => b.textContent?.trim() === "Snapshot")!;
        const buttons = [...lead.parentElement!.querySelectorAll("button")];
        expect(buttons).toHaveLength(4);
        expect(buttons[0]?.hasAttribute("data-icon-only")).toBe(false);
        for (const b of buttons.slice(1)) {
            expect(b.hasAttribute("data-icon-only")).toBe(true);
            expect(b.getAttribute("aria-label")).toBeTruthy();
        }
        expect(lead.parentElement?.className).not.toMatch(/flex-wrap/);
    });
});

describe("(6) UIA-KF-175 — Apply CSS is a pressed-state toggle", () => {
    it.each([false, true])("cssApplied=%s → aria-pressed", (applied) => {
        const apply = mountRibbon("keyframes", applied).querySelector("button");
        expect(apply?.getAttribute("aria-pressed")).toBe(String(applied));
    });
});

describe("(7) UIA-KF-173 — the two clipboard verbs say what they copy", () => {
    it("Copy keyframes vs Copy compiled CSS", () => {
        const labels = [...mountRibbon("keyframes").querySelectorAll("button")].map((b) => b.getAttribute("aria-label"));
        expect(labels).toContain("Copy keyframes");
        expect(labels).toContain("Copy compiled CSS");
    });
});
