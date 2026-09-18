// SERVED MODEL: claude-opus-5[1m]
/**
 * test/group/group-viability.test.ts — X.KF.W5 arm B (`.c`), gate
 * **G-STAGGER-DOC leg 2 = P-8** (row B-4 ≡ KF-EST-5's library arm).
 *
 * P-8 IS A QUESTION, and the wave's own words set its terms: *"does a
 * multi-target `AnimationGroup` honour three infinitely-iterating,
 * differently-delayed children AT ALL? — no evidence in the tree either way"*.
 * A STATIC/UNIT test, never a browser probe, and it PRECEDES any group-rewrite
 * prescription: the cure B-4 would otherwise imply is SEVERED by the
 * cure-separation law and this wave does not un-sever it. So this spec MEASURES
 * and records the answer; it prescribes nothing.
 *
 * THE ANSWER IT RECORDS — the three-dot ellipsis a component would build:
 *  (a) a multi-target group is DERIVED non-single-target and stays on the rAF
 *      compositor: the group-WAAPI fast lane refuses it by name;
 *  (b) per-child `delay` IS honoured through the group's own advance — each
 *      child phase-offsets independently, which is precisely what the docblock
 *      paragraph claims ("the substrate that already carries it") and what the
 *      corrected example relies on;
 *  (c) `iterationCount: Infinity` children keep the group un-done forever, and
 *      the group composites them per frame with no per-child bookkeeping of its
 *      own — it reads each child's state;
 *  (d) a managed child's own `play()` THROWS: the group owns the loop. That is
 *      the boundary a "just drive each child yourself" workaround runs into.
 *
 * So: N per-instance rAF loops for a 3-glyph ellipsis is NOT the only shape
 * available — one group drives three delayed, infinite children today — and the
 * component-side evaluation (NOT a mechanical swap) stays KF.W6's.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { AnimationGroup } from "../../src/animation/group";
import { isGroupWAAPIEligible } from "../../src/animation/group/waapi";
import { KeyframesAnimation } from "../../src/animation/engine";
import { stagger } from "../../src/animation/orchestration/stagger";

const DURATION = 100;

function dot(delay: number): KeyframesAnimation<{ opacity: number }> {
    const el = document.createElement("span");
    document.body.appendChild(el);
    const anim = new KeyframesAnimation<{ opacity: number }>({
        duration: DURATION,
        delay,
        iterationCount: Infinity,
        useWAAPI: false,
    });
    anim.setTargets(el);
    anim.addFrame(0, { opacity: 0.2 });
    anim.addFrame(100, { opacity: 1 });
    return anim.parse();
}

/** The ellipsis: three targets, three delays, all infinite. */
function ellipsis() {
    const delay = stagger(3, { each: 120 });
    const dots = [0, 1, 2].map((i) => dot(delay(i, 3)));
    return { dots, group: new AnimationGroup(...dots) };
}

beforeEach(() => {
    document.body.innerHTML = "";
});

describe("P-8 — is a multi-target, delayed, infinite group VIABLE?", () => {
    it("(a) it is multi-target, and the WAAPI fast lane refuses it by name", () => {
        const { group } = ellipsis();

        expect(group.singleTarget).toBe(false);

        const verdict = isGroupWAAPIEligible(group);
        expect(verdict.eligible).toBe(false);
        if (!verdict.eligible) {
            expect(verdict.reason).toBe("group requires one shared target");
        }
    });

    it("(b) per-child delay IS honoured through the group's advance", async () => {
        const { dots, group } = ellipsis();
        expect(dots.map((d) => d.options.delay)).toEqual([0, 120, 240]);

        // One group tick advances every child from the same clock; each child
        // takes its OWN phase offset, exactly as `stagger` intends.
        await group.advanceTo(1_000);

        expect(dots[0]!.startTime).toBe(1_000);
        expect(dots[1]!.startTime).toBe(1_000 + 120);
        expect(dots[2]!.startTime).toBe(1_000 + 240);
    });

    it("(c) infinite children keep the group un-done, and it reads their state", async () => {
        const { dots, group } = ellipsis();

        await group.advanceTo(1_000);
        await group.advanceTo(1_000 + DURATION * 3);
        group.render(1_000 + DURATION * 3);

        expect(group.done).toBe(false);
        expect(dots.every((d) => d.done)).toBe(false);
        // Each child keeps its own iteration count — the group holds none.
        expect(dots[0]!.iteration).toBeGreaterThan(0);
    });

    it("(d) a MANAGED child's own play() throws — the group owns the loop", async () => {
        const { dots } = ellipsis();
        await expect(dots[0]!.play()).rejects.toThrow(
            /managed animation|AnimationGroup owns/i,
        );
    });

    it("(e) the group still composites a single-target cohort (the control)", () => {
        const el = document.createElement("div");
        document.body.appendChild(el);
        const shared = [0, 1].map(() => {
            const anim = new KeyframesAnimation<{ opacity: number }>({
                duration: DURATION,
                useWAAPI: false,
            });
            anim.setTargets(el);
            anim.addFrame(0, { opacity: 0 });
            anim.addFrame(100, { opacity: 1 });
            return anim.parse();
        });

        expect(new AnimationGroup(...shared).singleTarget).toBe(true);
    });
});
