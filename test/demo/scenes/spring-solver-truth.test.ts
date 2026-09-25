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
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import { withSetup } from "../../support/withSetup";
import { useSpringDemo } from "../../../demo/scenes/spring/useSpringDemo";
import SpringHeatmap, { overshoot } from "../../../demo/scenes/spring/SpringHeatmap.vue";
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

describe("(9) KFA-44 — Reverse runs the sweep backwards", () => {
    it("with Reverse on, the sweep phase falls frame over frame, continuously from where it was", () => {
        let clock = 1000;
        let queue = new Map<number, FrameRequestCallback>();
        let id = 1;
        const prevRaf = window.requestAnimationFrame;
        const prevCancel = window.cancelAnimationFrame;
        const nowSpy = vi.spyOn(performance, "now").mockImplementation(() => clock);
        window.requestAnimationFrame = ((cb: FrameRequestCallback) => { queue.set(id, cb); return id++; }) as typeof window.requestAnimationFrame;
        window.cancelAnimationFrame = ((h: number) => { queue.delete(h); }) as typeof window.cancelAnimationFrame;
        const frame = () => { clock += 16; const cur = queue; queue = new Map(); for (const cb of cur.values()) cb(clock); };
        const machine = parkPausedOnSpring();
        const [demo, app] = withSetup(() => useSpringDemo());
        try {
            demo.play();
            expect(machine.status.value).toBe("playing");
            for (let i = 0; i < 20; i++) frame();
            const before = demo.springLive.phase;
            expect(before, "the sweep ran forward first").toBeGreaterThan(0.1);
            // The scene's Reverse act. At the pre-cure bytes the only reverse
            // write was the channel flag (SpringScene's onToggleReverse), so
            // that is what is exercised when the demo exposes no clock seam.
            const d = demo as { setReversed?: (r: boolean) => void };
            if (typeof d.setReversed === "function") d.setReversed(true);
            else demo.springEditAnim.reversed = true;
            frame();
            const first = demo.springLive.phase;
            expect(Math.abs(first - before), "continuous across the toggle").toBeLessThan(0.05);
            for (let i = 0; i < 10; i++) frame();
            expect(demo.springLive.phase, "the phase fell").toBeLessThan(first);
            expect(demo.springEditAnim.reversed).toBe(true);
        } finally {
            app.unmount();
            nowSpy.mockRestore();
            window.requestAnimationFrame = prevRaf;
            window.cancelAnimationFrame = prevCancel;
        }
    });
});

describe("(10) KFA-40 + UIA-KF-094 + KFA-41 — the derby lanes share the rail's axis, and their names are legible", () => {
    const src = sfc("SpringTarget.vue");
    const tpl = src.slice(src.indexOf("<template>"), src.lastIndexOf("</template>"));
    const css = styleOf(src);
    it("KFA-41 — a lane is the rail's full width (no tag gutter shortening its cqw axis) and the target crosses the lanes", () => {
        const lane = ruleBody(css, ".derby-lane");
        expect(lane, ".derby-lane rule").not.toBe("");
        expect(lane).not.toMatch(/padding-inline-end/);
        expect(ruleBody(css, ".derby-lane-rail")).not.toMatch(/right:\s*var\(--derby-tag-gutter\)/);
        expect(tpl).toMatch(/class="derby-target-tick"[^>]*railPct\(1\)/);
    });
    it("KFA-40 / UIA-KF-094 — no tag sits inside a lane; each tag is one unbroken line", () => {
        const laneBlock = tpl.match(/class="derby-lane"[\s\S]*?<\/div>/)?.[0] ?? "";
        expect(laneBlock, "the lane element").not.toBe("");
        expect(laneBlock).not.toMatch(/derby-lane-tag/);
        expect(ruleBody(css, ".derby-lane-tag")).toMatch(/white-space:\s*nowrap/);
        // the legend overlays the hint row, which steps back while the derby runs
        expect(tpl).toMatch(/'spring-rail-verbs--veiled': demo\.derbyActive\.value/);
    });
});

describe("(11) UIA-KF-308 — the field previews its hover, and the marker's pip name steps aside", () => {
    it("a hover reads '(r, ζ) → peak %' in the header and reverts on leave; the current preset's pip is marked", async () => {
        const wrapper = mount(SpringHeatmap, { props: { response: 0.5, dampingFraction: 0.86 }, attachTo: document.body });
        try {
            const el = wrapper.get('[role="application"]').element as HTMLElement;
            vi.spyOn(el, "clientWidth", "get").mockReturnValue(220);
            vi.spyOn(el, "clientHeight", "get").mockReturnValue(260);
            vi.spyOn(el, "getBoundingClientRect").mockReturnValue({ left: 0, top: 0, width: 222, height: 262 } as DOMRect);
            // no gesture: a bare hover over node (0.65 s, ζ 0.85)
            el.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerId: 7, clientX: 110, clientY: 130 }));
            await nextTick();
            const hover = wrapper.find("[data-heatmap-hover]");
            expect(hover.exists(), "a hover readout").toBe(true);
            expect(hover.text()).toBe(`0.65 s · ζ 0.85 → ${Math.round(overshoot(0.85) * 100)} %`);
            el.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true, pointerId: 7 }));
            await nextTick();
            expect(wrapper.find("[data-heatmap-hover]").exists()).toBe(false);
            const current = wrapper.findAll(".spring-heatmap-pip.is-current");
            expect(current.map((p) => p.text())).toEqual(["smooth"]);
        } finally {
            wrapper.unmount();
        }
    });
});

describe("(12) KFA-154 — the field's own sweep streams from its first write to its release", () => {
    it("the marker is streaming on the pointerdown's write and stays streaming through a stall", async () => {
        const wrapper = mount(SpringHeatmap, { props: { response: 0.5, dampingFraction: 0.86 }, attachTo: document.body });
        let clock = 5000;
        const nowSpy = vi.spyOn(performance, "now").mockImplementation(() => clock);
        try {
            const el = wrapper.get('[role="application"]').element as HTMLElement;
            vi.spyOn(el, "clientWidth", "get").mockReturnValue(220);
            vi.spyOn(el, "clientHeight", "get").mockReturnValue(260);
            vi.spyOn(el, "getBoundingClientRect").mockReturnValue({ left: 0, top: 0, width: 222, height: 262 } as DOMRect);
            el.setPointerCapture = () => {};
            el.releasePointerCapture = () => {};
            const marker = () => wrapper.get(".spring-heatmap-marker");
            el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, isPrimary: true, button: 0, pointerId: 1, clientX: 110, clientY: 130 }));
            await wrapper.setProps({ response: 0.65, dampingFraction: 0.85 });
            await nextTick();
            expect(marker().classes(), "the first write of the sweep").toContain("is-streaming");
            clock += 5000; // a stall mid-drag
            el.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerId: 1, clientX: 30, clientY: 30 }));
            await wrapper.setProps({ response: 0.25, dampingFraction: 1.35 });
            await nextTick();
            expect(marker().classes(), "after a stall, still the same sweep").toContain("is-streaming");
        } finally {
            nowSpy.mockRestore();
            wrapper.unmount();
        }
    });
});

describe("(13) KFA-42 — the derby starts from, and returns to, the pose the double-tap interrupted", () => {
    it("two tap-presses re-seat the field, yet the lanes launch together from the pre-gesture pose and the race restores it", () => {
        vi.useFakeTimers();
        let clock = 10_000;
        const nowSpy = vi.spyOn(performance, "now").mockImplementation(() => clock);
        const prevRaf = window.requestAnimationFrame;
        const prevCancel = window.cancelAnimationFrame;
        let queue = new Map<number, FrameRequestCallback>();
        let id = 1;
        window.requestAnimationFrame = ((cb: FrameRequestCallback) => { queue.set(id, cb); return id++; }) as typeof window.requestAnimationFrame;
        window.cancelAnimationFrame = ((h: number) => { queue.delete(h); }) as typeof window.cancelAnimationFrame;
        const frame = () => { clock += 16; const cur = queue; queue = new Map(); for (const cb of cur.values()) cb(clock); };
        parkPausedOnSpring();
        const [demo, app] = withSetup(() => useSpringDemo());
        try {
            const pose = demo.target.value;
            const d = demo as { beginRailPress?: () => void };
            const press = (v: number) => { d.beginRailPress?.(); demo.reseat(v); };
            press(0.5);
            for (let i = 0; i < 6; i++) frame(); // the first tap's chase runs ~100 ms
            press(0.5);
            for (let i = 0; i < 3; i++) frame();
            demo.derby();
            // common start: every lane is at the interrupted pose when the cascade begins
            for (const t of demo.tracks) expect(t.spring.value, `${t.preset.name} starts at the pose`).toBe(pose);
            // run the race out (timers + frames)
            for (let i = 0; i < 200; i++) { vi.advanceTimersByTime(16); frame(); }
            expect(demo.target.value, "the race restores the pre-gesture pose").toBe(pose);
        } finally {
            app.unmount();
            nowSpy.mockRestore();
            vi.useRealTimers();
            window.requestAnimationFrame = prevRaf;
            window.cancelAnimationFrame = prevCancel;
        }
    });
});

describe("(14) KFA-153 — the lane balls keep painting through the overlay's exit", () => {
    it("the ball map is never emptied by the ref callback's null; it clears after the leave", () => {
        const src = sfc("SpringTarget.vue");
        const setter = src.match(/const setDerbyBallEl = [\s\S]*?\n\};/)?.[0] ?? "";
        expect(setter, "setDerbyBallEl present").not.toBe("");
        expect(setter).not.toMatch(/derbyBallEls\.delete/);
        expect(src).toMatch(/<Transition name="derby" @after-leave="onDerbyAfterLeave">/);
        expect(src).toMatch(/const onDerbyAfterLeave = \(\): void => derbyBallEls\.clear\(\);/);
    });
});
