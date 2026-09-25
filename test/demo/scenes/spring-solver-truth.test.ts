/**
 * X.KF.W13X.spring — the spring solver and physics rows' falsifiers.
 *
 * (1) KFA-38 + UIA-KF-204 — the scene is born at an honest rest. The solvers
 *     were built at value 0 with the target written to 1 and the chase intent
 *     born false, so the mount loop stopped at once and left an UNSETTLED
 *     field parked at 0 under a target of 1: the badge read "tracking", x read
 *     0.000, the marker sat at 1, and the first Play or facet write launched the
 *     stale chase. Born state: every solver settled at its target, the target
 *     at the ball, the readouts flushed from the solvers.
 */
import { beforeAll, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { withSetup } from "../../support/withSetup";
import { useSpringDemo } from "../../../demo/scenes/spring/useSpringDemo";
import { useSceneMachine } from "../../../demo/state";
import { warmKfEngine } from "../../../demo/kf-engine";

function parkPausedOnSpring() {
    const machine = useSceneMachine();
    machine.dispatch({ type: "NAVIGATE", to: "spring" });
    machine.dispatch({ type: "SCENE_READY" });
    machine.dispatch({ type: "PAUSE" });
    return machine;
}

beforeAll(async () => {
    await warmKfEngine();
});

describe("(1) KFA-38 + UIA-KF-204 — born at an honest rest", () => {
    it("every solver is settled at its target, and the readouts say so", () => {
        parkPausedOnSpring();
        const [demo, app] = withSetup(() => useSpringDemo());
        try {
            expect(demo.liveSettled.value, "the badge's source reads settled").toBe(true);
            expect(demo.springLive.settled).toBe(true);
            expect(demo.target.value, "the target marker sits on the ball").toBe(demo.springLive.value);
            expect(demo.liveValue.value).toBe(demo.springLive.value);
            for (const t of demo.tracks) {
                expect(t.spring.settled, `${t.preset.name} is settled`).toBe(true);
                expect(t.settled.value).toBe(true);
                expect(t.spring.value).toBe(demo.target.value);
            }
        } finally {
            app.unmount();
        }
    });

    it("reset() returns the field to that same born rest", () => {
        parkPausedOnSpring();
        const [demo, app] = withSetup(() => useSpringDemo());
        try {
            const born = demo.target.value;
            demo.reseat(1 - born);
            demo.reset();
            expect(demo.target.value).toBe(born);
            expect(demo.springLive.settled).toBe(true);
            expect(demo.liveSettled.value).toBe(true);
            expect(demo.springLive.value).toBe(born);
            for (const t of demo.tracks) expect(t.spring.settled).toBe(true);
        } finally {
            app.unmount();
        }
    });
});

// ── Source-level clauses over the spring SFCs' own style blocks ──────────────

const sfc = (name: string) => readFileSync(resolve(process.cwd(), `demo/scenes/spring/${name}`), "utf8");
const styleOf = (src: string) => src.slice(src.indexOf("<style"));
/** The declarations of the FIRST rule whose selector is exactly `sel`. */
const ruleBody = (css: string, sel: string): string => {
    const at = css.search(new RegExp(`(^|\\n)${sel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{`));
    if (at < 0) return "";
    const open = css.indexOf("{", at);
    return css.slice(open + 1, css.indexOf("\n}", open));
};

describe("(2) UIA-KF-305 — the rail's focus ring follows a drawn radius", () => {
    it(".spring-rail declares a radius-role border-radius (the ring is a box-shadow on the host box)", () => {
        const body = ruleBody(styleOf(sfc("SpringTarget.vue")), ".spring-rail");
        expect(body, ".spring-rail rule present").not.toBe("");
        expect(body).toMatch(/border-radius:\s*var\(--radius-(field|control)\)/);
    });
});

describe("(3) UIA-KF-110 — the preset tiles never paint the page ground", () => {
    it("no bg-background on the tile, and no tile wash mixed into --background", () => {
        const src = sfc("SpringPhysicsFacet.vue");
        const cls = src.match(/class="(preset-cell[^"]*)"/)?.[1] ?? "";
        expect(cls, "the preset tile class list").toContain("preset-cell");
        expect(cls.split(/\s+/)).not.toContain("bg-background");
        const css = styleOf(src);
        for (const sel of [".preset-cell", ".preset-cell:hover", '.preset-cell[data-state="on"]']) {
            expect(ruleBody(css, sel), sel).not.toMatch(/var\(--background\)/);
        }
    });
});

describe("(4) UIA-KF-307 — the heatmap well is a surface tint, not the page ground", () => {
    it("the field's fill and its ramp never read --background", () => {
        const src = sfc("SpringHeatmap.vue");
        expect(ruleBody(styleOf(src), ".spring-heatmap"), ".spring-heatmap rule").not.toBe("");
        expect(ruleBody(styleOf(src), ".spring-heatmap")).not.toMatch(/var\(--background\)/);
        const mix = src.match(/const accentMix = [^;]*;/)?.[0] ?? "";
        expect(mix, "accentMix present").not.toBe("");
        expect(mix).not.toMatch(/var\(--background\)/);
    });
});

describe("(5) A2-KE-L3-12 — the preset readout wraps between its two quantities", () => {
    it("the params line is not one unbreakable run; each value keeps its unit", () => {
        const src = sfc("SpringPhysicsFacet.vue");
        const item = src.slice(src.indexOf("<ToggleGroupItem"), src.indexOf("</ToggleGroupItem>"));
        const lineOpen = item.match(/<span class="([^"]*tabular-nums[^"]*)"/)?.[1] ?? "";
        expect(lineOpen, "the params line").not.toBe("");
        expect(lineOpen.split(/\s+/), "the whole line is never nowrap").not.toContain("whitespace-nowrap");
        expect(item).toMatch(/whitespace-nowrap[^>]*>\s*\{\{\s*t\.preset\.response\s*\}\}\s*s/);
        expect(item).toMatch(/whitespace-nowrap[^>]*>\s*ζ\s*\{\{\s*t\.preset\.dampingFraction\s*\}\}/);
        // A wrapped tile and an unwrapped one share a row height (the track's
        // own align-items would otherwise centre the shorter tile).
        const grid = src.match(/class="(preset-grid[^"]*)"/)?.[1] ?? "";
        expect(grid.split(/\s+/)).toContain("items-stretch");
    });
});

describe("(6) A2-KE-L3-9 — the facet's action rides its section header (glass #actions)", () => {
    it("the seed action is in a ConfiguratorLayer #actions slot, and no body row holds it", () => {
        const src = sfc("SpringPhysicsFacet.vue");
        const tpl = src.slice(src.indexOf("<template>"), src.lastIndexOf("</template>"));
        const actions = tpl.match(/<ConfiguratorLayer[\s\S]*?<template #actions>([\s\S]*?)<\/template>/)?.[1] ?? "";
        expect(actions, "a ConfiguratorLayer with an #actions slot").not.toBe("");
        expect(actions).toMatch(/seedKeyframes\(\)/);
        const outside = tpl.replace(actions, "");
        expect(outside).not.toMatch(/seedKeyframes\(\)/);
    });
});

describe("(7) A2-KE-L3-8 — Re-seat sits beside its rail, not on a lone ribbon row", () => {
    it("the ribbon renders no Re-seat; the stage carries it next to the rail hint", () => {
        const scene = sfc("SpringScene.vue");
        const ribbon = scene.slice(scene.indexOf("const ribbonContent"), scene.indexOf("defineExpose("));
        expect(ribbon, "ribbonContent present").not.toBe("");
        expect(ribbon).not.toMatch(/toggleTarget\(\)/);
        const target = sfc("SpringTarget.vue");
        const tpl = target.slice(target.indexOf("<template>"), target.lastIndexOf("</template>"));
        expect(tpl).toMatch(/@click="demo\.toggleTarget\(\)"/);
        // the verb and the rail's hint share one row
        expect(tpl).toMatch(/id="spring-rail-hint"[\s\S]{0,400}demo\.toggleTarget\(\)/);
    });
});

describe("(8) KFA-211 — the solver's marks are 'live' only while the solver moves", () => {
    it("isLive reads the solver's settled state and the derby, never the sweep transport; the sampler has its own gate", () => {
        const src = sfc("SpringTarget.vue");
        const live = src.match(/const isLive = computed\(([\s\S]*?)\);/)?.[1] ?? "";
        expect(live, "isLive present").not.toBe("");
        expect(live).toMatch(/liveSettled/);
        expect(live).not.toMatch(/isPlaying/);
        const css = styleOf(src);
        expect(css).not.toMatch(/\.spring-target--live \.sampler-carriage/);
        expect(css).toMatch(/\.spring-target--sweeping \.sampler-carriage/);
    });
});

