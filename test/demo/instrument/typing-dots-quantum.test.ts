/**
 * typing-dots-quantum — X.KF.W13X.home · KFA-200.
 *
 * The typing dots march on `steps(4, jump-none)` across a 0 % / 50 % / 100 %
 * opacity shape, so every dot holds each step for CYCLE / 8 (1200 / 8 = 150 ms).
 * The per-dot stagger has to be a whole number of those quanta, or the three
 * dots step on three different grids (160 ms against 150 ms put each dot's
 * step 10 ms apart from its neighbour's, so even an ideal march never changes
 * two dots on one tick).
 *
 * The spec mounts the REAL component and reads the options the component
 * hands the REAL engine (the engine's own `CSSKeyframesAnimation`, subclassed
 * only to record its constructor argument).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { createApp, nextTick } from "vue";

const seen: { duration: number; delay: number; timingFunction: string }[] = [];

vi.mock("@mkbabb/keyframes.js", async (importOriginal) => {
    const real = await importOriginal<typeof import("@mkbabb/keyframes.js")>();
    return {
        ...real,
        loadAnimationEngine: async () => {
            const engine = await real.loadAnimationEngine();
            class Recording extends engine.CSSKeyframesAnimation<any> {
                constructor(options: any) {
                    super(options);
                    seen.push({
                        duration: Number(options.duration),
                        delay: Number(options.delay ?? 0),
                        timingFunction: String(options.timingFunction),
                    });
                }
            }
            return { ...engine, CSSKeyframesAnimation: Recording };
        },
    };
});

const { default: TypingDots } = await import("@components/instrument/shell/TypingDots.vue");

let teardown: (() => void) | null = null;
afterEach(() => {
    teardown?.();
    seen.length = 0;
});

describe("TypingDots — one step quantum for the march (KFA-200)", { timeout: 30_000 }, () => {
    it("every dot's stagger delay is a whole number of the steps(4) quantum (CYCLE / 8)", async () => {
        const host = document.createElement("div");
        document.body.appendChild(host);
        const app = createApp(TypingDots);
        app.mount(host);
        teardown = () => {
            app.unmount();
            host.remove();
            teardown = null;
        };
        await nextTick();
        // the engine is a cold dynamic import: under host load it can take
        // seconds, so the poll's own deadline sits well inside the case budget
        const deadline = Date.now() + 20_000;
        while (Date.now() < deadline && seen.length < 3) await new Promise((r) => setTimeout(r, 20));

        expect(seen.length).toBe(3);
        for (const s of seen) expect(s.timingFunction).toBe("steps(4, jump-none)");
        const quantum = seen[0]!.duration / 8;
        const offGrid = seen.map((s) => s.delay % quantum);
        expect(offGrid).toEqual([0, 0, 0]);
        // the stagger survives: three distinct, increasing delays
        const delays = seen.map((s) => s.delay);
        expect(new Set(delays).size).toBe(3);
        expect([...delays].sort((a, b) => a - b)).toEqual(delays);
    });
});
