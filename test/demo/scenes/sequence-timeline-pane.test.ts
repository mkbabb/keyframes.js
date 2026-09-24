// SERVED MODEL: claude-opus-5-5
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { withSetup } from "../../support/withSetup";
import { STAGGER_MAX, useSequenceDemo } from "../../../demo/scenes/sequence/useSequenceDemo";
import { ROW_COUNT } from "../../../demo/scenes/sequence/sequenceMotion";
import { warmKfEngine } from "../../../demo/kf-engine";
import { surfacesFor } from "@state/controlSurfaces";
import { dockSurfaceItems } from "../../../demo/components/instrument/surfaceTabs";

/**
 * X.KF.W13V.s2 — ESC-s-1 ruled option (b) (KF-W13.md §0cw addendum; OA-46).
 *
 * Sequence's re-time handles and master scrub leave the STAGE and become the
 * Sequence mode of the SHARED Timeline pane, opened from the Timeline dock item
 * like every scene's:
 *   • the facility's one channel declares the Timeline surface, so the derived
 *     set (`surfacesFor`, no per-scene table) enables the dock's Timeline item;
 *   • the channel carries the sequence's lanes — one per item, each at its
 *     child's `at` on the master Sequence (the engine's `seq.add(child, at)`
 *     stays the placement truth);
 *   • the pane's lanes re-time through that channel: a lane handle writes the
 *     child's `at`, so the engine's entry moves; the master scrub is the pane's
 *     playhead;
 *   • the stage keeps the subject only — no slider, no scrubber, in its bytes.
 *
 * THE MOUNT BOUND (as `sequence-instrument-truth`): glass-ui's dist chunks
 * import the bare engine specifier the demo vitest project cannot resolve, so
 * the pane's glass-free LEAF (`SequenceLanes`) is what mounts here; the stage
 * clause is read at the settled bytes, and the served census is the pixel
 * witness (evidence/W13V/s2).
 */

const DEMO = path.resolve(__dirname, "../../../demo");
const SEQ = path.join(DEMO, "scenes/sequence");
/** The pane leaf, imported by path so the file reads per-case at a HEAD that
 *  lacks it (the born-RED reading). */
const LANES = "../../../demo/components/instrument/timeline/components/SequenceLanes.vue";

function realDemo() {
    const [demo, app] = withSetup(() => useSequenceDemo());
    return { demo, app };
}

/** The engine's placement: every entry's resolved `at`, in row order. */
const engineAts = (demo: ReturnType<typeof useSequenceDemo>) =>
    demo.sequence.entries.map((e) => e.at).sort((a, b) => a - b);

describe("KF.W13V.s2 — Sequence re-timing lives in the shared Timeline pane", () => {
    beforeAll(async () => {
        await warmKfEngine();
    });

    it("the Sequence channel declares the Timeline surface, so the dock's Timeline item enables", () => {
        const { demo, app } = realDemo();
        try {
            const surfaces = surfacesFor(demo.facility, "Sequence");
            expect(surfaces).toEqual(["timeline"]);
            const items = dockSurfaceItems(surfaces);
            expect(items.map((i) => [i.kind, i.enabled])).toEqual([
                ["controls", false],
                ["keyframes", false],
                ["timeline", true],
                ["facet", false],
            ]);
        } finally {
            app.unmount();
        }
    });

    it("the channel carries one lane per sequence item, at the engine's own placement", () => {
        const { demo, app } = realDemo();
        try {
            const source = demo.facility.channels[0]!.sequence;
            expect(source).toBeDefined();
            const lanes = source!.lanes();
            expect(lanes).toHaveLength(ROW_COUNT);
            expect(lanes.map((l) => l.at).sort((a, b) => a - b)).toEqual(engineAts(demo));
            expect(source!.duration()).toBe(demo.sequence.duration);
            expect(source!.atMax).toBe(STAGGER_MAX);
        } finally {
            app.unmount();
        }
    });

    it("a lane handle in the pane re-times the child's `at` on the master Sequence; Home returns it", async () => {
        const { demo, app } = realDemo();
        const { default: SequenceLanes } = await import(/* @vite-ignore */ LANES);
        const source = demo.facility.channels[0]!.sequence!;
        const wrapper = mount(SequenceLanes, { props: { source }, attachTo: document.body });
        try {
            const handles = wrapper.findAll('[role="slider"][aria-label^="Re-time row"]');
            expect(handles).toHaveLength(ROW_COUNT);
            const before = demo.rows.value[1]!.at;
            await handles[1]!.trigger("keydown", { key: "End" });
            expect(demo.rows.value[1]!.at).toBe(STAGGER_MAX);
            expect(engineAts(demo)).toContain(STAGGER_MAX);
            expect(handles[1]!.attributes("aria-valuenow")).toBe(String(STAGGER_MAX));
            await handles[1]!.trigger("keydown", { key: "Home" });
            expect(demo.rows.value[1]!.at).toBe(0);
            demo.reseatRow(1, before);
            expect(demo.rows.value[1]!.at).toBe(before);
        } finally {
            wrapper.unmount();
            app.unmount();
        }
    });

    it("the master scrub is the pane's playhead — it seeks the master clock in its canonical unit", async () => {
        const { demo, app } = realDemo();
        const { default: SequenceLanes } = await import(/* @vite-ignore */ LANES);
        const source = demo.facility.channels[0]!.sequence!;
        const wrapper = mount(SequenceLanes, { props: { source }, attachTo: document.body });
        try {
            const scrub = wrapper.get('[role="slider"][aria-label="Scrub the sequence master clock"]');
            expect(scrub.attributes("aria-valuetext")).toBe(`0 ms of ${demo.duration.value} ms`);
            await scrub.trigger("keydown", { key: "End" });
            expect(demo.progress.value).toBe(1);
            await wrapper.vm.$nextTick();
            expect(scrub.attributes("aria-valuenow")).toBe("100");
            expect(wrapper.find("[data-sequence-playhead]").exists()).toBe(true);
        } finally {
            wrapper.unmount();
            app.unmount();
        }
    });

    it("the stage shows the subject only — no re-time handle, no master scrub under demo/scenes", () => {
        const target = readFileSync(path.join(SEQ, "SequenceTarget.vue"), "utf8");
        expect(target).not.toMatch(/role="slider"/);
        expect(target).not.toMatch(/SequenceScrubber/);
        const hits: string[] = [];
        const walk = (dir: string) => {
            for (const ent of readdirSync(dir, { withFileTypes: true })) {
                const p = path.join(dir, ent.name);
                if (ent.isDirectory()) walk(p);
                else if (/Re-time row|Scrub the sequence master clock/.test(readFileSync(p, "utf8")))
                    hits.push(path.relative(DEMO, p));
            }
        };
        walk(path.join(DEMO, "scenes"));
        expect(hits).toEqual([]);
    });
});
