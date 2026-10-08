// SERVED MODEL: claude-fable-5-1
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import postcss, { type Declaration, type Rule } from "postcss";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { withSetup } from "../../support/withSetup";
// X.KF.W13V.s2 re-seat: the master slider moved from the stage's
// SequenceScrubber into the Timeline pane's Sequence mode (its leaf below).
import SequenceLanes from "../../../demo/components/instrument/timeline/components/SequenceLanes.vue";
import { STAGGER_MAX, useSequenceDemo } from "../../../demo/scenes/sequence/useSequenceDemo";
import { ROW_COUNT } from "../../../demo/scenes/sequence/sequenceMotion";
import { warmKfEngine } from "../../../demo/kf-engine";

/**
 * X.KF.W11.d — G-KFW11-2: ONE canonical time domain (kf-SequencePlayhead N-1 ·
 * N-2 · N-10 · N-14; kf-SequenceAxis L-12; kf-SequenceTarget ST-4).
 *
 * The decision this file asserts (written in the wave record BEFORE the
 * family's first commit, §Seq 8): the canonical domain is the master clock in
 * milliseconds, `duration = max(at + ROW_DURATION)`. The clock's terminal
 * IS `sequence.duration`; a retime recomputes that denominator (N-2 lands
 * against N-1); the master slider announces the canonical unit (N-14, after
 * N-1); the reel's running state rides the Button `loading` contract (ST-4).
 * X.KF.W13X.sequence (A2-KE-L3-7) deleted the stage's ruler and playhead —
 * the Timeline pane owns timing — so the terminal is read on the pane's
 * master slider and the three-rect equality became one time column.
 *
 * THE MOUNT BOUND, stated: this file mounts the import-free leaf (the
 * Timeline pane's `SequenceLanes`) against the REAL `useSequenceDemo` on the
 * warmed engine, and witnesses the Target-only clauses at the settled bytes:
 *   • ST-4's binding as a byte clause beside the composable's runtime state;
 *   • the one time column as the GRID-MODEL INVARIANT every lane track
 *     resolves from — parent gap ≡ subgrid gap ≡ `var(--col-gap)`, the track
 *     on grid column 2 — parsed from the stylesheet with postcss (the mounted
 *     stage is `sequence-stage-truth.test.ts`'s, over glass stubs).
 */

const SEQ = path.resolve(__dirname, "../../../demo/scenes/sequence");
const read = (file: string) => readFileSync(path.join(SEQ, file), "utf8");
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

    // X.KF.W13X.sequence re-seat (A2-KE-L3-7): the stage's ruler is deleted —
    // the Timeline pane owns timing — so N-1's terminal is read where the clock
    // now lives: the pane's master slider names `sequence.duration` at its end.
    it("the clock's terminal IS sequence.duration, and the demo's duration is the engine's (N-1 · N-10)", async () => {
        const { demo, app } = realDemo();
        try {
            const expected = Math.max(...demo.rows.value.map((r) => r.at + ROW_DURATION));
            expect(demo.sequence.duration).toBe(expected);
            expect(demo.duration.value).toBe(demo.sequence.duration);
            const wrapper = mount(SequenceLanes, {
                props: { source: demo.facility.channels[0]!.sequence! },
                attachTo: document.body,
            });
            demo.scrub(1);
            await wrapper.vm.$nextTick();
            const rail = wrapper.get('[role="slider"][aria-label="Scrub the sequence master clock"]');
            const d = demo.sequence.duration;
            expect(rail.attributes("aria-valuetext")).toBe(`${d} ms of ${d} ms`);
            wrapper.unmount();
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
            const wrapper = mount(SequenceLanes, {
                props: { source: demo.facility.channels[0]!.sequence! },
                attachTo: document.body,
            });
            const rail = wrapper.get('[role="slider"][aria-label="Scrub the sequence master clock"]');
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
        // X.KF.W13X.dh2 (UIA-KF-098) — the reel lives in the Timeline pane's
        // Stagger header now; the binding travels with it, and the stage card
        // carries no reel at all.
        const pane = readFileSync(path.join(SEQ, "../../components/instrument/timeline/SequenceTimeline.vue"), "utf8");
        const target = read("SequenceTarget.vue");
        // The one binding that closes D-9.2 / D-15 / ST-4 — and the dead ring it
        // replaces (ST-2) is gone with it.
        expect(pane).toContain(':loading="source.isReeling()"');
        expect(pane).toContain('@click="source.playReel()"');
        expect(target).not.toMatch(/playReel\(\)"|Clapperboard|<Button/);
        expect(pane + target).not.toContain("reel-active");
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

    // X.KF.W13X.sequence re-seat (A2-KE-L3-7): the ruler and the stage
    // playhead are deleted, so the stage has ONE time column — every lane's
    // track — and the equality the three rects proved is now structural: there
    // is no second horizontal geometry on the stage to disagree with it.
    it("one time column BY CONSTRUCTION — every lane track on grid column 2, one gutter (N-10 · D-1 · D-2/L-4)", () => {
        const target = read("SequenceTarget.css");
        // The stage grants its own gutter token to its own column gap, so the
        // parent and subgrid gutters coincide and no redistribution branch survives.
        expect(decl(target, ".seq-stage", "column-gap")).toBe("var(--col-gap)");
        expect(decl(target, ".seq-row", "column-gap")).toBe("var(--col-gap)");
        expect(decl(target, ".seq-track", "grid-column")).toBe("2");
        expect(hasDecl(target, ".seq-axis", "grid-column")).toBe(false);
        expect(existsSync(path.join(SEQ, "SequenceAxis.vue"))).toBe(false);
        expect(existsSync(path.join(SEQ, "SequencePlayhead.vue"))).toBe(false);
        // No transcribed offset anywhere in the scene.
        for (const f of ["SequenceTarget.css", "SequenceTarget.vue"]) {
            expect(read(f)).not.toContain("--track-inset");
        }
    });
});
