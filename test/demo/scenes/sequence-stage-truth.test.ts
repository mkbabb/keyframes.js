// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.sequence — the Sequence stage, as behaviour and as bytes.
 *
 *   A2-KE-L3-7 — one primary per region: the Timeline pane owns timing, so the
 *     stage carries no ruler, no playhead and no `@ms` label (an index at most).
 *   UIA-KF-210 — one readout per datum: the header is the title and ONE clock
 *     readout; no `stagger × N` caption, no ready/playing badge, and no reel
 *     (X.KF.W13X.dh2, UIA-KF-098: the reel is the Timeline pane's verb).
 *   UIA-KF-212 · UIA-KF-312 — the Card is the only frame (no 0px-radius tinted
 *     plate) and the lane rail reads at a visible tint.
 *   UIA-KF-214 — a lane is time: `--ball-p` spans ROW_DURATION / duration.
 *   KFA-48 — the springs' crest lands in reserved room inside the lane.
 *   KFA-47 — `--ball-p` is ONE spring segment (no 70% stall).
 *   KFA-107 · KFA-108 — the reel starts and ends on the master pose.
 *   KFA-162 · KFA-220 — the reel resumes a held play; its status is the pane's Reel.
 *   KFA-161 — the boot's lane drop holds no forward fill (no late re-raster).
 *
 * Born RED at kf `dade65bd`. The producer realm wall is answered as
 * `spring-entry-states.test.ts` answers it: glass primitives become
 * slot-rendering stubs, so the subject's own template and bindings execute.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, nextTick, provide } from "vue";
import { readFileSync } from "node:fs";
import path from "node:path";
import postcss, { type Declaration, type Rule } from "postcss";

const stub = vi.hoisted(() => ({
    module: async (entries: Record<string, string>) => {
        const { defineComponent, h } = await import("vue");
        return Object.fromEntries(
            Object.entries(entries).map(([name, tag]) => [
                name,
                defineComponent({
                    name,
                    inheritAttrs: false,
                    props: { loading: { type: Boolean, default: undefined }, label: String, value: Number, unit: String },
                    setup: (props, { slots, attrs }) =>
                        () =>
                            h(
                                tag,
                                { ...attrs, "data-stub": name, "data-loading": String(!!props.loading) },
                                [props.label ? `${props.label} ${props.value} ${props.unit}` : null, slots.default?.()],
                            ),
                }),
            ]),
        );
    },
}));
vi.mock("@mkbabb/glass-ui", () => stub.module({ Button: "button", Card: "div" }));

import { springTimingFunction } from "@mkbabb/keyframes.js";
import { kfEngine, warmKfEngine } from "../../../demo/kf-engine";
import { useSequenceDemo } from "../../../demo/scenes/sequence/useSequenceDemo";
import { SEQUENCE_DEMO_KEY, SEQUENCE_SCENE_ID } from "../../../demo/scenes/sequence/sequenceKeys";
import {
    ROW_COUNT,
    ROW_DURATION,
    ROW_GLIDE,
    sequenceRowKeyframes,
} from "../../../demo/scenes/sequence/sequenceMotion";
import { useSceneMachine } from "../../../demo/state";

const SEQ = path.resolve(__dirname, "../../../demo/scenes/sequence");
const read = (f: string) => readFileSync(path.join(SEQ, f), "utf8");
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
    return { app, host, demo: () => demo, done: () => (app.unmount(), host.remove()) };
}

/** The ball's painted progress (the engine's inline write). */
const pOf = (el: HTMLElement) => Number(el.style.getPropertyValue("--ball-p") || 0);

beforeAll(async () => {
    await warmKfEngine();
}, 90_000);
afterEach(() => {
    vi.useRealTimers();
});

describe("the stage is the subject — A2-KE-L3-7 · UIA-KF-210", () => {
    it("A2-KE-L3-7 — the stage carries no ruler, no playhead and no `@ms` label; each lane shows its index at most", { timeout: 30_000 }, async () => {
        const m = await mountTarget();
        try {
            const stage = m.host.querySelector(".seq-stage")!;
            expect(stage).not.toBeNull();
            expect(stage.querySelectorAll(".seq-axis, .seq-playhead-track, .seq-playhead").length).toBe(0);
            const msLeaves = [...stage.querySelectorAll("*")].filter(
                (e) => e.children.length === 0 && /\d+\s*ms/.test(e.textContent ?? ""),
            );
            expect(msLeaves.map((e) => e.textContent)).toEqual([]);
            const rows = [...stage.querySelectorAll(".seq-row")];
            expect(rows).toHaveLength(ROW_COUNT);
            rows.forEach((row, i) => expect((row.textContent ?? "").trim()).toBe(String(i + 1)));
            expect(m.host.querySelectorAll('[role="slider"]').length).toBe(0); // G-W13V-s1 held
        } finally {
            m.done();
        }
    });

    it("UIA-KF-210 — the header is the title and ONE clock readout: no reel, no caption, no badge", { timeout: 30_000 }, async () => {
        const m = await mountTarget();
        try {
            const header = m.host.querySelector(".seq-target")!.firstElementChild as HTMLElement;
            expect(header.querySelector("h2")?.textContent).toBe("Sequence");
            // X-DS pass 7 (KF-C7-07) — the one stage readout anatomy: a
            // lowercase label and the value with its unit adjacent.
            expect(header.querySelectorAll('[data-readout="primary"]').length).toBe(1);
            const clock = header.querySelector('[data-readout="primary"]')!;
            expect(clock.classList.contains("stage-readout")).toBe(true);
            expect(clock.children[0]!.textContent?.trim()).toBe("clock");
            expect((clock.children[1]!.textContent ?? "").trim()).toMatch(/^-?\d+ ms$/);
            expect(header.querySelector('[role="status"]')).toBeNull();
            expect(header.querySelector('[data-stub="Button"]')).toBeNull(); // UIA-KF-098 (.dh2): the reel is the pane's
            expect(header.textContent).not.toMatch(/stagger|ready|playing|reel/i);
            // UIA-KF-211 — the row never wraps (the served probe reads the lines).
            expect(header.className).toMatch(/\bflex-nowrap\b/);
            expect(header.className).not.toMatch(/\bflex-wrap\b/);
        } finally {
            m.done();
        }
    });
});

describe("the lanes — UIA-KF-212 · UIA-KF-312 · UIA-KF-214 · KFA-48", () => {
    const css = read("SequenceTarget.css");

    it("UIA-KF-212 · UIA-KF-312 — no second plate inside the Card, and the rail reads at the visible tint", () => {
        for (const prop of ["border-radius", "border", "background"]) {
            expect(decl(css, ".seq-stage", prop)).toBeNull();
        }
        // X-DS pass 14 (KF-C14-02) — the lane reads the ROOT lane tint, which is
        // theme-aware: at least the visible 18% in light, and a higher dark arm
        // (one fixed 18% fell to ~1.2:1 over the near-black card). The dashed
        // overshoot tail reads the same token.
        expect(decl(css, ".seq-track .progress-rail", "--rail-tint")).toBe("var(--rail-tint-lane)");
        expect(decl(css, ".seq-track::after", "border-top")).toContain("var(--rail-tint-lane)");
        const idioms = readFileSync(path.join(SEQ, "../../styles/design-idioms.css"), "utf8");
        const light = parseFloat(decl(idioms, ":root", "--rail-tint-lane") ?? "NaN");
        const dark = parseFloat(decl(idioms, ".dark", "--rail-tint-lane") ?? "NaN");
        expect(light).toBeGreaterThanOrEqual(18);
        expect(dark).toBeGreaterThan(light);
    });

    it("UIA-KF-214 — a ball spans ROW_DURATION / duration of the time column, not the rest of the rail", { timeout: 30_000 }, async () => {
        const m = await mountTarget();
        try {
            const demo = m.demo();
            expect(demo.rowSpan?.value).toBeCloseTo(ROW_DURATION / demo.duration.value, 12);
            const stage = m.host.querySelector(".seq-stage") as HTMLElement;
            expect(Number(stage.style.getPropertyValue("--row-span"))).toBeCloseTo(demo.rowSpan?.value, 9);
            const translate = decl(css, ".seq-ball", "translate") ?? "";
            expect(translate).toContain("var(--ball-p, 0) * var(--row-span, 1)");
            expect(translate).not.toContain("(1 - var(--row-start, 0))");
        } finally {
            m.done();
        }
    });

    it("KFA-48 — the lane reserves the springs' crest past the last end time, read off the curves", { timeout: 30_000 }, async () => {
        const m = await mountTarget();
        try {
            const demo = m.demo();
            const peak = (e: { fn: (t: number) => number }) => {
                let p = 1;
                for (let k = 0; k <= 480; k++) p = Math.max(p, e.fn(k / 480));
                return p;
            };
            const reel = springTimingFunction({ response: 0.42, dampingFraction: 0.34 });
            const crest = Math.max(peak(springTimingFunction(ROW_GLIDE)), peak(reel));
            expect(crest).toBeGreaterThan(1.2); // the reel's overshoot is real
            const expected = Math.max(...demo.rows.value.map((r) => r.at + crest * ROW_DURATION)) / demo.duration.value - 1;
            expect(demo.overshootRoom?.value).toBeCloseTo(expected, 9);
            const stage = m.host.querySelector(".seq-stage") as HTMLElement;
            expect(Number(stage.style.getPropertyValue("--seq-room"))).toBeCloseTo(expected, 6);
            expect(decl(css, ".seq-track .progress-rail", "width")).toBe("calc(100cqw / (1 + var(--seq-room, 0)))");
            expect(decl(css, ".seq-ball", "translate")).toContain("(1 + var(--seq-room, 0))");
        } finally {
            m.done();
        }
    });
});

describe("the boot — KFA-161", () => {
    it("the lane drop holds no forward fill, so removing the boot class re-rasterises nothing", () => {
        const css = read("SequenceTarget.css");
        // The top-level rule (the PRM block's `animation: none` is the degrade).
        const rule = postcss.parse(css).nodes.find(
            (n: any) => n.type === "rule" && n.selector === ".seq-stage.is-powering-on .seq-row",
        ) as Rule;
        const anim = (rule.nodes.find((d: any) => d.prop === "animation") as Declaration).value;
        expect(anim).toMatch(/^seq-lane-drop\b/);
        expect(anim.split(/\s+/)).not.toContain("both");
        expect(anim.split(/\s+/)).not.toContain("forwards");
        // … and the fill is only sound because the end keyframe IS the row's own style.
        const kf = postcss.parse(css).nodes.find((n: any) => n.type === "atrule" && n.name === "keyframes" && n.params === "seq-lane-drop") as any;
        const to = kf.nodes.find((r: any) => r.selector === "to");
        const decls = Object.fromEntries(to.nodes.map((d: any) => [d.prop, d.value]));
        expect(decls).toEqual({ opacity: "1", transform: "translateY(0)" });
    });
});

describe("the glide — KFA-47", () => {
    it("`--ball-p` is one spring segment: no hold inside the travel (the 70% stall and its snap)", () => {
        const { CSSKeyframesAnimation } = kfEngine();
        const anim = new CSSKeyframesAnimation<any>({
            duration: ROW_DURATION,
            fillMode: "forwards",
            timingFunction: springTimingFunction(ROW_GLIDE),
        }).fromKeyframes(sequenceRowKeyframes());
        const N = 900; // one sample per engine millisecond
        const p = Array.from({ length: N + 1 }, (_, k) => Number(anim.at(k / N)["--ball-p"]));
        // The longest run (ms) the travel holds still while mid-rail.
        let hold = 0;
        let run = 0;
        for (let k = 1; k <= N; k++) {
            run = Math.abs(p[k]! - p[k - 1]!) < 1e-5 && p[k]! > 0.05 && p[k]! < 0.95 ? run + 1 : 0;
            hold = Math.max(hold, run);
        }
        expect(hold).toBeLessThanOrEqual(16);
        expect(p[N]).toBeCloseTo(1, 6);
    });
});

describe("the reel — KFA-107 · KFA-108 · KFA-162 · KFA-220", () => {
    const FAKE = ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame", "performance"] as const;

    /** Drive frames until the reel settles; the trace is every ball's p per frame. */
    async function runReel(demo: ReturnType<typeof useSequenceDemo>, balls: HTMLElement[]) {
        const trace: number[][] = [];
        const reeling: boolean[] = [];
        demo.playReel();
        for (let f = 0; f < 400; f++) {
            await vi.advanceTimersByTimeAsync(16);
            trace.push(balls.map(pOf));
            reeling.push(demo.isReeling.value);
            if (f > 10 && !demo.isReeling.value) break;
        }
        return { trace, reeling };
    }

    it("KFA-108 · KFA-107 — from a mid-clock master the reel leaves each ball where it was and returns it there, with no cut", { timeout: 30_000 }, async () => {
        vi.useFakeTimers({ toFake: [...FAKE] });
        const m = await mountTarget();
        try {
            const demo = m.demo();
            await vi.advanceTimersByTimeAsync(1000); // the boot settles
            demo.scrub(0.5);
            await vi.advanceTimersByTimeAsync(32);
            const balls = [...m.host.querySelectorAll<HTMLElement>(".seq-ball")];
            const pre = balls.map(pOf);
            expect(Math.max(...pre) - Math.min(...pre)).toBeGreaterThan(0.5); // a mid-clock spread, not all at the origin
            const { trace, reeling } = await runReel(demo, balls);
            const settle = reeling.indexOf(false);
            expect(settle).toBeGreaterThan(10); // the reel ran and settled
            for (let i = 0; i < balls.length; i++) {
                // KFA-108: the first frame the reel moves this ball is a step, not a teleport.
                const first = trace.findIndex((row) => Math.abs(row[i]! - pre[i]!) > 1e-3);
                expect(first).toBeGreaterThanOrEqual(0);
                expect(Math.abs(trace[first]![i]! - pre[i]!)).toBeLessThan(0.2);
                // KFA-107: the hand-back is on the ball's own pose (no one-frame cut).
                expect(Math.abs(trace[settle]![i]! - trace[settle - 1]![i]!)).toBeLessThan(0.05);
                expect(trace[trace.length - 1]![i]!).toBeCloseTo(pre[i]!, 3);
            }
        } finally {
            m.done();
        }
    });

    it("KFA-162 · KFA-220 — a reel fired mid-play holds its status off the stage header and resumes the master when it settles", { timeout: 30_000 }, async () => {
        vi.useFakeTimers({ toFake: [...FAKE] });
        const m = await mountTarget();
        const machine = useSceneMachine();
        const off = machine.register(SEQUENCE_SCENE_ID, m.demo().facility.playback);
        try {
            const demo = m.demo();
            machine.dispatch({ type: "NAVIGATE", to: SEQUENCE_SCENE_ID });
            machine.dispatch({ type: "SCENE_READY" });
            machine.dispatch({ type: "PLAY" });
            await vi.advanceTimersByTimeAsync(240);
            expect(machine.status.value).toBe("playing");
            demo.playReel();
            await vi.advanceTimersByTimeAsync(16);
            await nextTick();
            const header = m.host.querySelector(".seq-target")!.firstElementChild as HTMLElement;
            expect(header.querySelector('[role="status"]')).toBeNull(); // no "ready" beside a flying reel
            // X.KF.W13X.dh2 (UIA-KF-098) — the reel's status is the Timeline
            // pane's Reel Button `loading` (sequence-instrument-truth ST-4); the
            // stage header carries no verb at all.
            expect(header.querySelector('[data-stub="Button"]')).toBeNull();
            expect(demo.isReeling.value).toBe(true);
            for (let f = 0; f < 400 && demo.isReeling.value; f++) await vi.advanceTimersByTimeAsync(16);
            expect(demo.isReeling.value).toBe(false);
            expect(machine.status.value).toBe("playing");
            const p0 = demo.progress.value;
            await vi.advanceTimersByTimeAsync(160);
            expect(demo.progress.value).toBeGreaterThan(p0); // the master clock runs again
        } finally {
            machine.dispatch({ type: "PAUSE" });
            off();
            m.done();
        }
    });

    it("a PAUSE during the reel cancels the resume (the hold is the user's play, not the reel's)", { timeout: 30_000 }, async () => {
        vi.useFakeTimers({ toFake: [...FAKE] });
        const m = await mountTarget();
        const machine = useSceneMachine();
        const off = machine.register(SEQUENCE_SCENE_ID, m.demo().facility.playback);
        try {
            const demo = m.demo();
            machine.dispatch({ type: "NAVIGATE", to: SEQUENCE_SCENE_ID });
            machine.dispatch({ type: "SCENE_READY" });
            machine.dispatch({ type: "PLAY" });
            await vi.advanceTimersByTimeAsync(240);
            demo.playReel();
            await vi.advanceTimersByTimeAsync(200);
            machine.dispatch({ type: "PLAY" }); // a Play mid-reel is held …
            machine.dispatch({ type: "PAUSE" }); // … and a Pause after it cancels the hold
            for (let f = 0; f < 400 && demo.isReeling.value; f++) await vi.advanceTimersByTimeAsync(16);
            await vi.advanceTimersByTimeAsync(64);
            expect(machine.status.value).not.toBe("playing");
        } finally {
            machine.dispatch({ type: "PAUSE" });
            off();
            m.done();
        }
    });
});
