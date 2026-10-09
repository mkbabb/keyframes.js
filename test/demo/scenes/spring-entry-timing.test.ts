/**
 * X.KF.W13X.springd — UIA-KF-096 · KFA-45 · KFA-215: the discrete card's time
 * is the spring's time.
 *
 * Born RED at `034c8a44` (the pinned 500 ms): the spring's `linear()` was sampled
 * over `4 × response` (2000 ms for Smooth) and played in 500 ms, so half the
 * stops sat on a `1.00000` plateau, `response` changed nothing, and the exit
 * replayed the entry's overshooting curve.
 *
 * THE INSTRUMENT reads the REAL artifact: `useCompiledEntry` is run through the
 * real engine chunk and its published CSS is parsed — the exit list is the base
 * rule's, the entry list the open rule's (`compileToEntry`'s grammar).
 * `artifactOf` reads the artifact at either byte generation of the composable
 * (`css` before the cure, `entry.result.css` after), so the RED at the pre-cure
 * bytes is an assertion, not a missing export.
 */
import { beforeAll, describe, expect, it } from "vitest";
import { useCompiledEntry } from "../../../demo/scenes/spring/useCompiledEntry";
import { warmKfEngine } from "../../../demo/kf-engine";
import { withSetup } from "../../support/withSetup";

type Published = {
    css?: { value: string };
    entry?: { value: { result: { css: string } | null } };
};

const artifactOf = (out: Published): string =>
    out.entry?.value.result?.css ?? out.css?.value ?? "";

async function compileAt(response: number, dampingFraction: number): Promise<string> {
    const [out, app] = withSetup(() =>
        useCompiledEntry(
            () => response,
            () => dampingFraction,
        ),
    );
    try {
        for (let i = 0; i < 400 && artifactOf(out as Published) === ""; i++) {
            await new Promise((r) => setTimeout(r, 5));
        }
        return artifactOf(out as Published);
    } finally {
        app.unmount();
    }
}

/** The one transition list of the rule whose selector is exactly `selector`. */
function transitionOf(css: string, selector: string): string {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rule = new RegExp(`(?:^|\\n)\\s*${escaped}\\s*\\{([^}]*)\\}`).exec(css);
    if (rule === null) throw new Error(`no rule for \`${selector}\``);
    const decl = /transition\s*:\s*([^;]*)/.exec(rule[1]!);
    if (decl === null) throw new Error(`no transition on \`${selector}\``);
    return decl[1]!;
}

/** The opacity leg's duration (ms) and its `linear()` stops as `[value, pct]`. */
function opacityLeg(transition: string): { ms: number; stops: [number, number][] } {
    // The time is the library's shortest exact CSS time (`0.5s` or `16.7ms`,
    // UIA-KF-177), so both units are read.
    const leg = /opacity\s+([\d.]+)(ms|s)\s+linear\(([^)]*)\)/.exec(transition);
    if (leg === null) throw new Error(`no opacity linear() leg in: ${transition.slice(0, 80)}`);
    const parts = leg[3]!.split(",").map((p) => p.trim().split(/\s+/));
    const stops = parts.map(([v, pct], i): [number, number] => [
        Number(v),
        pct === undefined ? (i === 0 ? 0 : 100) : Number.parseFloat(pct),
    ]);
    return { ms: Number(leg[1]) * (leg[2] === "s" ? 1000 : 1), stops };
}

/**
 * The dead tail: the share of the duration over which the curve already sits
 * within 1e-3 of rest and never leaves it — time the card spends not moving.
 */
function deadTail(stops: [number, number][]): number {
    let from = 100;
    for (let i = stops.length - 1; i >= 0; i--) {
        if (Math.abs(stops[i]![0] - 1) > 1e-3) break;
        from = stops[i]![1];
    }
    return (100 - from) / 100;
}

describe("X.KF.W13X.springd — the Entry card moves on the spring's own time", () => {
    let smooth = "";
    let slow = "";

    beforeAll(async () => {
        await warmKfEngine();
        smooth = await compileAt(0.5, 0.86);
        slow = await compileAt(1.0, 0.86);
        expect(smooth, "the shipped emitter produced no artifact").not.toBe("");
    }, 30_000);

    it("UIA-KF-096 · KFA-45 — no dead tail: the stops are motion, not a plateau", () => {
        const enter = opacityLeg(transitionOf(smooth, ".discrete-card.is-open"));
        // BEFORE: 1.00002 from 44% on — a 56% dead tail (13 of 26 stops).
        expect(deadTail(enter.stops)).toBeLessThanOrEqual(0.1);
    });

    it("UIA-KF-096 — response is expressed: twice the response is twice the time", () => {
        const a = opacityLeg(transitionOf(smooth, ".discrete-card.is-open")).ms;
        const b = opacityLeg(transitionOf(slow, ".discrete-card.is-open")).ms;
        // BEFORE: 500 and 500.
        expect(Math.abs(b - 2 * a)).toBeLessThanOrEqual(2);
    });

    it("KFA-215 — the exit has its own curve, and it never overshoots past closed", () => {
        const enter = opacityLeg(transitionOf(smooth, ".discrete-card.is-open"));
        const exit = opacityLeg(transitionOf(smooth, ".discrete-card"));
        // BEFORE: the exit replayed the entry's overshooting curve (peak 1.00498).
        expect(exit.stops.map(([v]) => v)).not.toEqual(enter.stops.map(([v]) => v));
        expect(Math.max(...exit.stops.map(([v]) => v))).toBeLessThanOrEqual(1);
        expect(Math.min(...exit.stops.map(([v]) => v))).toBeGreaterThanOrEqual(0);
        expect(deadTail(exit.stops)).toBeLessThanOrEqual(0.1);
    });
});
