// SERVED MODEL: claude-fable-5-1
import { readFileSync } from "node:fs";
import path from "node:path";
import postcss, { type Declaration, type Rule } from "postcss";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { withSetup } from "../../support/withSetup";
import SequenceAxis from "../../../demo/scenes/sequence/SequenceAxis.vue";
import SequenceScrubber from "../../../demo/scenes/sequence/SequenceScrubber.vue";
import { STAGGER_MAX, useSequenceDemo } from "../../../demo/scenes/sequence/useSequenceDemo";
import { ROW_COUNT } from "../../../demo/scenes/sequence/sequenceMotion";
import { SEQUENCE_DEMO_KEY } from "../../../demo/scenes/sequence/sequenceKeys";
import { warmKfEngine } from "../../../demo/kf-engine";

/**
 * X.KF.W11.d — G-KFW11-2: ONE canonical time domain (kf-SequencePlayhead N-1 ·
 * N-2 · N-10 · N-14; kf-SequenceAxis L-12; kf-SequenceTarget ST-4).
 *
 * The decision this file asserts (written in the wave record BEFORE the
 * family's first commit, §Seq 8): the canonical domain is the master clock in
 * milliseconds, `duration = max(at + ROW_DURATION)`. The ruler's terminal label
 * IS `sequence.duration`; a retime recomputes that denominator (N-2 lands
 * against N-1); the master slider announces the canonical unit (N-14, after
 * N-1); the reel's running state rides the Button `loading` contract (ST-4).
 *
 * THE MOUNT BOUND, stated: `SequenceTarget` imports glass-ui `Button`/`Card`/
 * `Metric`, whose dist chunk imports the bare `@mkbabb/keyframes.js` specifier
 * the demo vitest project cannot resolve (`vitest.config.ts` is a §Bounds
 * Do-NOT-touch row). So this file mounts the import-free leaves (`SequenceAxis`,
 * `SequenceScrubber`) against the REAL `useSequenceDemo` on the warmed engine,
 * and witnesses the two Target-only clauses at the settled bytes:
 *   • ST-4's binding as a byte clause beside the composable's runtime state;
 *   • the three-rect equality as the GRID-MODEL INVARIANT the three elements
 *     resolve their left edge from — parent gap ≡ subgrid gap ≡ `var(--col-gap)`,
 *     axis / row track / playhead track each placed on grid column 2, no
 *     transcribed `left:` offset — parsed from the stylesheets with postcss.
 *     jsdom lays nothing out; the pixel witness is SS-13 #1/#10's, by name.
 */

const SEQ = path.resolve(__dirname, "../../../demo/scenes/sequence");
const read = (file: string) => readFileSync(path.join(SEQ, file), "utf8");
const scopedStyle = (sfc: string) =>
    /<style scoped>([\s\S]*?)<\/style>/.exec(read(sfc))?.[1] ?? "";
const decl = (css: string, selector: string, prop: string): string | null => {
    let found: string | null = null;
    postcss.parse(css).walkRules((rule: Rule) => {
        if (rule.selector !== selector) return;
        rule.walkDecls(prop, (d: Declaration) => {
            found = d.value;
        });
    });
    return found;
};
const hasDecl = (css: string, selector: string, prop: string) =>
    decl(css, selector, prop) !== null;

const QUARTERS = [0, 0.25, 0.5, 0.75, 1] as const;
const ROW_DURATION = 900;

function realDemo() {
    const [demo, app] = withSetup(() => useSequenceDemo());
    return { demo, app };
}

describe("G-KFW11-2 — one canonical domain (N-1 · N-2 · N-10 · N-14 · ST-4)", () => {
    beforeAll(async () => {
        await warmKfEngine();
    });
    afterEach(() => {
        vi.useRealTimers();
    });

    it("the ruler's terminal label IS sequence.duration, and the demo's duration is the engine's (N-1 · N-10)", () => {
        const { demo, app } = realDemo();
        try {
            const expected = Math.max(...demo.rows.value.map((r) => r.at + ROW_DURATION));
            expect(demo.sequence.duration).toBe(expected);
            expect(demo.duration.value).toBe(demo.sequence.duration);
            const axis = mount(SequenceAxis, {
                props: { quarters: QUARTERS, duration: demo.duration.value },
            });
            const ticks = axis.findAll(".seq-axis-tick").map((t) => t.text());
            expect(ticks).toHaveLength(QUARTERS.length);
            expect(parseInt(ticks[ticks.length - 1]!, 10)).toBe(demo.sequence.duration);
            expect(ticks[ticks.length - 1]).toMatch(/ms$/);
            expect(ticks[0]).toMatch(/^0/);
            axis.unmount();
        } finally {
            app.unmount();
        }
    });

    it("a retime recomputes the denominator — N-2 lands against N-1 (the End-keypress witness)", () => {
        const { demo, app } = realDemo();
        try {
            const before = demo.sequence.duration;
            demo.reseatRow(ROW_COUNT - 1, STAGGER_MAX);
            expect(demo.rows.value[ROW_COUNT - 1]!.at).toBe(STAGGER_MAX);
            expect(demo.sequence.duration).toBe(STAGGER_MAX + ROW_DURATION);
            expect(demo.duration.value).toBe(demo.sequence.duration);
            expect(demo.sequence.duration).not.toBe(before);
            // The symmetric collapse: every row to 0 SHRINKS the clock (the
            // engine's own `_duration` is monotone; the demo's is honest).
            for (let i = 0; i < ROW_COUNT; i++) demo.reseatRow(i, 0);
            expect(demo.sequence.duration).toBe(ROW_DURATION);
            expect(demo.duration.value).toBe(ROW_DURATION);
            // The undo (SC-2: `reset` is the drag gesture's undo) re-truths it.
            demo.reset();
            expect(demo.sequence.duration).toBe(before);
            expect(demo.duration.value).toBe(before);
        } finally {
            app.unmount();
        }
    });

    it("the master slider announces the canonical unit — N-14's valuetext, after N-1", () => {
        const { demo, app } = realDemo();
        try {
            const wrapper = mount(SequenceScrubber, {
                global: { provide: { [SEQUENCE_DEMO_KEY as symbol]: demo } },
                attachTo: document.body,
            });
            const rail = wrapper.get('[role="slider"]');
            expect(rail.attributes("aria-valuetext")).toBe(`0 ms of ${demo.duration.value} ms`);
            demo.scrub(0.5);
            return wrapper.vm.$nextTick().then(() => {
                const ms = Math.round(0.5 * demo.duration.value);
                expect(rail.attributes("aria-valuetext")).toBe(`${ms} ms of ${demo.duration.value} ms`);
                expect(rail.attributes("aria-valuenow")).toBe("50");
                wrapper.unmount();
            });
        } finally {
            app.unmount();
        }
    });

    it("ST-4 — the reel's running state is the Button `loading` contract, and it locks the transport", () => {
        vi.useFakeTimers();
        const target = read("SequenceTarget.vue");
        // The one binding that closes D-9.2 / D-15 / ST-4 — and the dead ring it
        // replaces (ST-2) is gone with it.
        expect(target).toContain(':loading="demo.isReeling.value"');
        expect(target).not.toContain("reel-active");
        const { demo, app } = realDemo();
        try {
            expect(demo.isReeling.value).toBe(false);
            demo.playReel();
            expect(demo.isReeling.value).toBe(true);
            // SC-3 / L-5 — the one guard: a retime during the reel is refused.
            const at = demo.rows.value[0]!.at;
            demo.reseatRow(0, at + 400);
            expect(demo.rows.value[0]!.at).toBe(at);
        } finally {
            // ST-6 / L-8 — unmount mid-stagger: the retained timers are cleared,
            // so no child is woken onto a detached target afterwards.
            app.unmount();
            expect(vi.getTimerCount()).toBe(0);
        }
    });

    it("three-rect equality BY CONSTRUCTION — axis, row track and playhead track share one grid line (N-10 · D-1 · D-2/L-4)", () => {
        const target = read("SequenceTarget.css");
        const playhead = scopedStyle("SequencePlayhead.vue");
        // The stage grants its own gutter token to its own gap, so the parent
        // and subgrid gutters coincide and no redistribution branch survives.
        expect(decl(target, ".seq-stage", "gap")).toBe("0.5rem var(--col-gap)");
        expect(decl(target, ".seq-row", "column-gap")).toBe("var(--col-gap)");
        // The three elements resolve their left edge from grid column 2.
        expect(decl(target, ".seq-axis", "grid-column")).toBe("2");
        expect(decl(target, ".seq-track", "grid-column")).toBe("2");
        expect(decl(playhead, ".seq-playhead-track", "grid-column")).toBe("2");
        // No transcribed offset: the playhead track carries no `left`, no
        // hardcoded `top`, no `--track-inset` read anywhere in the scene.
        expect(hasDecl(playhead, ".seq-playhead-track", "left")).toBe(false);
        expect(hasDecl(playhead, ".seq-playhead-track", "top")).toBe(false);
        for (const f of ["SequencePlayhead.vue", "SequenceTarget.css", "SequenceTarget.vue"]) {
            expect(read(f)).not.toContain("--track-inset");
        }
    });
});
