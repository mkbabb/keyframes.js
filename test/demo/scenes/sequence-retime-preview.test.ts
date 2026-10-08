/**
 * test/demo/scenes/sequence-retime-preview.test.ts — X.KF.W13X.dh2, UIA-KF-317's
 * preview limb (KF-W13.md addendum (f); brief value.js
 * `docs/tranches/X/execution/B/KF-W13X-dh2-brief.md`):
 *
 *   With the master parked, a re-time moved only the pane's handle and bar: the
 *   stage traveller sat still, so the new offset showed no motion until Play.
 *   A settled re-time now runs the retimed row's traveller once on the stage —
 *   off its master pose, across its run, back to the pose — and nothing else
 *   moves. A scrub cancels it onto the master pose; a running play and reduced
 *   motion refuse it.
 *
 * Served witness: `evidence/W13X/dh2/dh2.mjs` D4/D5 (1440/1024/390, L/D).
 */
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, nextTick, provide } from "vue";

const stub = vi.hoisted(() => ({
    module: async (entries: Record<string, string>) => {
        const { defineComponent, h } = await import("vue");
        return Object.fromEntries(
            Object.entries(entries).map(([name, tag]) => [
                name,
                defineComponent({
                    name,
                    inheritAttrs: false,
                    setup: (_props, { slots, attrs }) => () => h(tag, { ...attrs, "data-stub": name }, slots.default?.()),
                }),
            ]),
        );
    },
}));
vi.mock("@mkbabb/glass-ui", () => stub.module({ Button: "button", Card: "div" }));

import { warmKfEngine } from "../../../demo/kf-engine";
import { useSequenceDemo } from "../../../demo/scenes/sequence/useSequenceDemo";
import { SEQUENCE_DEMO_KEY } from "../../../demo/scenes/sequence/sequenceKeys";

const FAKE = ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame", "performance"] as const;

async function mountTarget() {
    const { default: SequenceTarget } = await import("../../../demo/scenes/sequence/SequenceTarget.vue");
    const host = document.createElement("div");
    document.body.appendChild(host);
    let demo!: ReturnType<typeof useSequenceDemo>;
    const app = createApp(
        defineComponent({
            setup() {
                demo = useSequenceDemo();
                provide(SEQUENCE_DEMO_KEY, demo);
                return () => h(SequenceTarget);
            },
        }),
    );
    app.mount(host);
    await nextTick();
    const balls = [...host.querySelectorAll<HTMLElement>(".seq-ball")];
    const source = demo.facility.channels[0]!.sequence!;
    return { demo, source, balls, done: () => (app.unmount(), host.remove()) };
}

/** The ball's painted progress (the engine's inline write). */
const pOf = (el: HTMLElement) => Number(el.style.getPropertyValue("--ball-p") || 0);

/** Every ball's p per 16 ms frame, for `frames` frames. */
async function trace(balls: HTMLElement[], frames: number) {
    const out: number[][] = [];
    for (let f = 0; f < frames; f++) {
        await vi.advanceTimersByTimeAsync(16);
        out.push(balls.map(pOf));
    }
    return out;
}
const distinct = (xs: number[]) => new Set(xs.map((x) => x.toFixed(3))).size;

beforeAll(async () => {
    await warmKfEngine();
}, 90_000);
afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
});

describe("UIA-KF-317 — a settled re-time runs the retimed row on the stage", () => {
    it("moves the retimed row's traveller and returns it to its master pose; the other rows hold", { timeout: 30_000 }, async () => {
        vi.useFakeTimers({ toFake: [...FAKE] });
        const m = await mountTarget();
        try {
            await vi.advanceTimersByTimeAsync(1000); // the boot settles
            m.demo.scrub(0.6);
            await vi.advanceTimersByTimeAsync(32);
            const at = m.source.lanes()[2]!.at;
            m.source.reseat(2, at + 40);
            await vi.advanceTimersByTimeAsync(16);
            const pre = m.balls.map(pOf);
            m.source.preview(2);
            const t = await trace(m.balls, 160);
            const row = t.map((r) => r[2]!);
            expect(distinct(row)).toBeGreaterThanOrEqual(10); // it moved, frame by frame
            expect(Math.max(...row.map((p) => Math.abs(p - pre[2]!)))).toBeGreaterThan(0.3);
            expect(row[row.length - 1]!).toBeCloseTo(pre[2]!, 2); // back on its master pose
            for (const i of [0, 1, 3, 4]) {
                expect(Math.max(...t.map((r) => Math.abs(r[i]! - pre[i]!)))).toBeLessThan(1e-6);
            }
        } finally {
            m.done();
        }
    });

    it("a scrub cancels a running preview onto the master pose", { timeout: 30_000 }, async () => {
        vi.useFakeTimers({ toFake: [...FAKE] });
        const m = await mountTarget();
        try {
            await vi.advanceTimersByTimeAsync(1000);
            m.source.preview(1);
            await vi.advanceTimersByTimeAsync(200);
            m.demo.scrub(0);
            await vi.advanceTimersByTimeAsync(16);
            const held = m.balls.map(pOf);
            const t = await trace(m.balls, 60);
            for (let i = 0; i < m.balls.length; i++) {
                expect(Math.max(...t.map((r) => Math.abs(r[i]! - held[i]!)))).toBeLessThan(1e-6);
            }
        } finally {
            m.done();
        }
    });

    it("declines under prefers-reduced-motion (feedback motion, as the reel)", { timeout: 30_000 }, async () => {
        vi.stubGlobal("matchMedia", (q: string) => ({ matches: q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} }));
        vi.useFakeTimers({ toFake: [...FAKE] });
        const m = await mountTarget();
        try {
            await vi.advanceTimersByTimeAsync(1000);
            const pre = m.balls.map(pOf);
            m.source.preview(3);
            const t = await trace(m.balls, 60);
            expect(Math.max(...t.map((r) => Math.abs(r[3]! - pre[3]!)))).toBeLessThan(1e-6);
        } finally {
            m.done();
        }
    });
});
